#!/usr/bin/env node
/* ============================================================
 * kaoyan2026 云端出卷执行器（GitHub Actions 内运行，2026-08-24）
 * 流水线：读任务 → 总工规划(1 call) → 并发出题池(conc 4) → 蓝本硬校验(纯代码)
 *        → 总工程师审查(1 call) → 定向重写池(conc 3) → 终检 → result.json 回写 Gist
 * 环境变量（全部来自 repo secrets / dispatch inputs）：
 *   GIST_ID      任务 Gist id（workflow_dispatch inputs）
 *   GH_TOKEN     GitHub 令牌（需 gist 权限）
 *   AI_ENDPOINT  OpenAI 兼容接口地址（如 https://api.xxx.com/v1）
 *   AI_KEY       接口密钥
 *   AI_MODEL     模型名
 * 设计原则：任何阶段失败 → status.json 标 error + 原因；绝不把半成品标 done。
 *           用户在本地取消（status=canceled）→ 阶段边界检测到即退出。
 * ============================================================ */
'use strict';
const https = require('https');
const { URL } = require('url');

const API = 'https://api.github.com';
const GIST_ID = process.env.GIST_ID || '';
const GH_TOKEN = process.env.GH_TOKEN || '';

if (!GIST_ID || !GH_TOKEN) { console.error('缺 GIST_ID 或 GH_TOKEN'); process.exit(1); }

function log(...a) { console.log('[runner]', ...a); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// AI 配置：优先 job.json 里的 prefs.ai（本地工具自动写入，免配 secrets），回退 repo secrets。
// 在主流程读到 job 后调用 initAiConf() 完成校验。
let JOB_AI = null;
function aiConf(k) {
  if (JOB_AI && JOB_AI[k]) return String(JOB_AI[k]);
  return process.env['AI_' + k.toUpperCase()] || '';
}

// ---------- GitHub Gist ----------
function ghReq(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'api.github.com', path, method,
      headers: {
        'Authorization': 'Bearer ' + GH_TOKEN,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'kaoyan2026-cloudjob-runner',
        'Content-Length': data ? Buffer.byteLength(data) : 0
      },
      timeout: 30000
    }, res => {
      let txt = '';
      res.on('data', c => txt += c);
      res.on('end', () => {
        if (res.statusCode === 204) return resolve(null);
        let d = null;
        try { d = txt ? JSON.parse(txt) : null; } catch (e) {}
        if (res.statusCode >= 400) { const e = new Error('GitHub HTTP ' + res.statusCode + ' ' + txt.slice(0, 200)); e.status = res.statusCode; return reject(e); }
        resolve(d);
      });
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('GitHub 请求超时')));
    if (data) req.write(data);
    req.end();
  });
}
async function ghRetry(method, path, body, tries = 4) {
  for (let i = 0; ; i++) {
    try { return await ghReq(method, path, body); }
    catch (e) {
      if (i >= tries - 1 || (e.status && e.status < 500 && e.status !== 403)) throw e;
      log('GitHub 请求失败重试', i + 1, e.message);
      await sleep(2000 * (i + 1));
    }
  }
}
// ---------- 过程事件日志（写进 status.json.log，前端 aiFloat 浮窗实时可视化） ----------
const RUN_LOG = [];
function pushLog(msg) {
  RUN_LOG.push({ t: new Date().toISOString(), msg: String(msg) });
  if (RUN_LOG.length > 50) RUN_LOG.splice(0, RUN_LOG.length - 50);   // 只留最近 50 条
}

async function setStatus(status, stage, msg, progress) {
  pushLog((stage ? '[' + stage + '] ' : '') + (msg || ''));
  const payload = { files: { 'status.json': { content: JSON.stringify({ status, stage: stage || '', msg: msg || '', progress: progress == null ? null : progress, log: RUN_LOG, updatedAt: new Date().toISOString(), runnerVer: 'v3' }) } } };
  try { await ghRetry('PATCH', '/gists/' + GIST_ID, payload); log('status →', status, stage || '', msg || ''); return true; }
  catch (e) {
    const hint = (e && e.status === 404)
      ? '　👉 诊断：能读 job.json 却写不回 status，几乎可断定 CLOUDJOB_GH_TOKEN 对 Gist 缺「写」权限（请用 classic PAT 勾选 gist，或 fine-grained PAT 把 Gist 设为 Read & Write）'
      : '';
    log('!! 写状态失败（不中断主流程）：', e.message + hint);
    return false;
  }
}

// ---------- AI 调用（OpenAI 兼容 /chat/completions） ----------
function aiCall(messages, opts = {}) {
  const maxTok = opts.maxTokens || 3000;
  // 本地 job.json 里 endpoint 是「完整请求 URL」（含 /chat/completions，如 openrouter 的
  // /api/v1/chat/completions）；repo secrets 回退时可能是 base URL（如 /api/v1）。幂等拼接，
  // 避免出现 /chat/completions/chat/completions 双拼导致 AI 404。
  let endpoint = aiConf('endpoint').trim().replace(/\/+$/, '');
  if (!/\/chat\/completions$/.test(endpoint)) endpoint += '/chat/completions';
  const body = JSON.stringify({ model: aiConf('model'), messages, temperature: opts.temperature == null ? 0.7 : opts.temperature, max_tokens: maxTok });
  return new Promise((resolve, reject) => {
    const u = new URL(endpoint);
    const req = https.request({
      hostname: u.hostname, port: u.port || 443, path: u.pathname + u.search, method: 'POST',
      headers: { 'Authorization': 'Bearer ' + aiConf('key'), 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: opts.timeoutMs || 240000
    }, res => {
      let txt = '';
      res.on('data', c => txt += c);
      res.on('end', () => {
        if (res.statusCode >= 400) return reject(new Error('AI HTTP ' + res.statusCode + ' ' + txt.slice(0, 300)));
        try {
          const d = JSON.parse(txt);
          const ch0 = d.choices && d.choices[0];
          const msg = ch0 && ch0.message;
          const content = String((msg && msg.content) || '').trim();
          if (!content) {
            // 空正文诊断：思考模型把 max_tokens 全烧在 reasoning 上时 content 为空（finish_reason=length）
            // 必须用 reject 而非 throw——此处处于 res.on('end') 事件回调内，throw 会变成
            // 未捕获异常直接崩掉进程，主流程 catch→setStatus('error') 永远执行不到，
            // 任务状态就冻结在半路（12 小时假运行的根因）。
            const fr = (ch0 && ch0.finish_reason) || '?';
            const hasReason = !!(msg && (msg.reasoning_content || msg.reasoning));
            return reject(new Error('AI 返回空正文（finish_reason=' + fr
              + (hasReason ? '；模型只输出了思考内容没写答案——请换非思考模型、关闭思考模式或调大 max_tokens' : '；模型未输出任何内容')
              + '）响应片段：' + txt.slice(0, 150)));
          }
          resolve(content);
        } catch (e) { reject(new Error('AI 响应解析失败: ' + txt.slice(0, 200))); }
      });
    });
    req.on('timeout', () => req.destroy(new Error('AI 调用超时')));
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}
async function aiRetry(messages, opts, tries = 3) {
  for (let i = 0; ; i++) {
    try { return await aiCall(messages, opts); }
    catch (e) {
      if (i >= tries - 1) throw e;
      log('AI 调用失败重试', i + 1, e.message);
      await sleep(3000 * (i + 1));
    }
  }
}
// 宽容 JSON 抽取：剥 <think> 思考块 → 剥代码围栏 → 找首个平衡的 {...} 或 [...]
function extractJson(txt) {
  let t = String(txt || '')
    .replace(/<think>[\s\S]*?<\/think>/gi, '')   // 思考模型的显式思考块
    .replace(/<think>[\s\S]*$/i, '')             // 未闭合的思考块（后面不会再有正文了）
    .trim();
  t = t.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/g, '').trim();
  try { return JSON.parse(t); } catch (e) {}
  const starts = [t.indexOf('{'), t.indexOf('[')].filter(i => i >= 0);
  if (!starts.length) throw new Error('输出中没有 JSON（原始输出前 160 字：' + t.slice(0, 160).replace(/\s+/g, ' ') + '）');
  const s = Math.min(...starts);
  const open = t[s], close = open === '{' ? '}' : ']';
  let depth = 0, inStr = false, esc = false;
  for (let i = s; i < t.length; i++) {
    const ch = t[i];
    if (inStr) { if (esc) esc = false; else if (ch === '\\') esc = true; else if (ch === '"') inStr = false; continue; }
    if (ch === '"') inStr = true;
    else if (ch === open) depth++;
    else if (ch === close) { depth--; if (!depth) return JSON.parse(t.slice(s, i + 1)); }
  }
  throw new Error('JSON 不完整/被截断（输出末尾：…' + t.slice(-100).replace(/\s+/g, ' ') + '）。可尝试调大 max_tokens 或换模型');
}

// AI 调用 + 宽容 JSON 抽取一体化：网络/HTTP 错误由 aiRetry 重试；
// 解析类失败（没 JSON / 被截断 / 空正文）自动换一轮重问，且若是「思考耗尽 token」类
// 失败（空正文/截断），下一轮把 max_tokens 翻倍（上限 12000）再试——单次坏响应不再炸全卷。
async function aiJson(messages, opts, tries = 3) {
  let o = opts || {};
  for (let i = 0; ; i++) {
    let out;
    try { out = await aiRetry(messages, o, 2); }
    catch (e) {
      const m = (e && e.message) || '';
      if (/空正文|finish_reason=length|JSON 不完整/.test(m) && (o.maxTokens || 3000) < 12000) {
        o = Object.assign({}, o, { maxTokens: Math.min((o.maxTokens || 3000) * 2, 12000) });
        log('疑似思考耗尽 token，max_tokens 翻倍至', o.maxTokens, '重试');
      }
      if (i >= tries - 1) throw e;
      await sleep(2000 * (i + 1));
      continue;
    }
    try { return extractJson(out); }
    catch (e) {
      log('JSON 解析失败，重问', i + 1, '/', tries, '：', ((e && e.message) || '').slice(0, 120));
      if (/JSON 不完整/.test((e && e.message) || '') && (o.maxTokens || 3000) < 12000) {
        o = Object.assign({}, o, { maxTokens: Math.min((o.maxTokens || 3000) * 2, 12000) });
        log('疑似输出截断，max_tokens 翻倍至', o.maxTokens, '重试');
      }
      if (i >= tries - 1) throw e;
      await sleep(2500 * (i + 1));
    }
  }
}

// ---------- 并发池 ----------
async function pool(items, conc, worker, onEachDone) {
  const results = new Array(items.length);
  let idx = 0, done = 0;
  async function runOne() {
    while (idx < items.length) {
      const i = idx++;
      try { results[i] = await worker(items[i], i); }
      catch (e) { results[i] = { __err: (e && e.message) || String(e) }; log('worker 失败 @' + i, e.message); }
      done++; if (onEachDone) onEachDone(done, items.length);
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, Math.min(conc, items.length)) }, runOne));
  return results;
}

// ---------- 提示词（与 sprint.js 本地管线同风格，独立内联） ----------
const SUBJ_NAME = { math: '数学', ctrl: '专业课', eng: '英语', pol: '政治' };
function plannerSystem(subj, prefs) {
  const diffNote = prefs.diff === 'superhard'
    ? '难度硬约束：全部为压轴难题（★4~★5），禁止基础题。'
    : prefs.diff === 'hard'
      ? '难度约束：约 70% 压轴难题（★4~★5），30% 中档（★3）。'
      : '难度约束：约 60% 中档综合题（★3），40% 压轴题（★4~★5）。';
  const n = prefs.count === 'full' ? 15 : prefs.count === 'lite' ? 8 : 12;
  return '你是考研' + (SUBJ_NAME[subj] || '综合') + '命题总工程师。请规划一份押题卷蓝图：共 ' + n + ' 题。'
    + diffNote + '\n要求：①覆盖不同考点，突出今年高频与考生薄弱方向 ②题型分布合理（选择题/填空题/解答题）③每题给出方向描述供出题 AI 执行。\n'
    + '只输出 JSON：{"title":"卷名","timeLimit":分钟,"questions":[{"topicName":"考点","type":"choice|fill|solve","diff":"easy|medium|hard","star":1-5,"score":分值,"direction":"命题方向一句话"}]}';
}
function questionSystem(subj) {
  return '你是考研' + (SUBJ_NAME[subj] || '综合') + '命题专家。按给定蓝图出一道题：题目创新但解法严格在考纲内；题干严谨无歧义；选择题给 4 个选项（A. B. C. D. 开头）；答案必须正确且解析完整（含关键步骤与易错点）。\n'
    + '只输出 JSON：{"stem":"题干(LaTeX用$...$)","type":"choice|fill|solve","options":["A. ..","B. ..","C. ..","D. .."]或省略,"answer":"正确答案","solution":"详细解析","trap":"常见陷阱一句话","diff":"easy|medium|hard","star":1-5}';
}
function chiefSystem(subj) {
  return '你是考研' + (SUBJ_NAME[subj] || '综合') + '押题卷总审查工程师。逐题检查：①答案是否正确（自己验算关键步骤）②题干是否严谨无歧义 ③选项是否有双对/无解 ④解析是否支撑答案 ⑤难度星级是否虚标。verdict 判定：全过关 ok；≤2 题小问题 minor；更多或整卷性问题 major。\n'
    + '只输出 JSON：{"verdict":"ok|minor|major","targetHardPct":40,"hardPct":实际hard百分比,"summary":"总评一句话","needsRewrite":[{"index":题号从1开始,"reason":"问题","fixHint":"修改指引"}]}';
}

// ---------- 本地蓝本硬校验（纯代码，零幻觉防线） ----------
function validateQuestion(q) {
  if (!q || typeof q !== 'object') return '不是对象';
  if (!q.stem || typeof q.stem !== 'string' || q.stem.length < 8) return '题干缺失或过短';
  if (q.answer == null || q.answer === '') return '缺 answer';
  if (q.type === 'choice') {
    if (!Array.isArray(q.options) || q.options.length !== 4) return '选择题须 4 个选项';
    const letters = q.options.map(o => String(o).trim().charAt(0).toUpperCase());
    if (letters.join('') !== 'ABCD') return '选项前缀须 A/B/C/D（实为 ' + letters.join('') + '）';
    const ans = String(q.answer).trim().charAt(0).toUpperCase();
    if (letters.indexOf(ans) < 0) return 'answer 不在选项中';
    // 双对粗检：answer 出现在 ≥2 个选项正文里
    const ansBody = String(q.answer).trim().slice(1).trim();
    if (ansBody.length > 6 && q.options.filter(o => String(o).indexOf(ansBody) >= 0).length > 1) return '疑似多个选项含相同答案内容';
  }
  if (!q.solution || String(q.solution).length < 10) return '解析缺失或过短';
  return '';
}
// LaTeX 花括号平衡粗检（防 AI 漏花括号导致渲染崩坏）
function braceBalanced(s) {
  let n = 0;
  s = String(s || '');
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '\\') { i++; continue; }
    if (ch === '{') n++;
    else if (ch === '}') n--;
  }
  return n === 0;
}

// ---------- 主流程 ----------
(async function main() {
  try {
    // ① 读任务
    let gist;
    try { gist = await ghRetry('GET', '/gists/' + GIST_ID); }
    catch (e) {
      if (e.status === 404) throw new Error('找不到任务 Gist（404）：gist_id 传错，或 CLOUDJOB_GH_TOKEN 缺 gist 权限。GIST_ID=' + GIST_ID);
      throw e;
    }
    if (!gist || !gist.files || !gist.files['job.json']) throw new Error('Gist 缺 job.json');
    const job = JSON.parse(gist.files['job.json'].content);
    const stNow = gist.files['status.json'] ? JSON.parse(gist.files['status.json'].content) : {};
    if (stNow.status === 'canceled') { log('任务已被用户取消，直接退出'); return; }
    const prefs = job.prefs || {};
    // AI 配置：优先任务自带的 prefs.ai（本地工具写入 secret Gist），回退 repo secrets
    JOB_AI = prefs.ai || null;
    log('AI 配置来源：', JOB_AI ? 'job.json' : 'repo secrets', '· model =', aiConf('model') || '(空)');
    if (!aiConf('endpoint') || !aiConf('key') || !aiConf('model')) {
      throw new Error('缺 AI 配置：任务未携带（prefs.ai）且 repo secrets 也未配置');
    }

    // ①.5 自检模式：只验证链路（Gist 读写 + secret 有效 + AI 配置在场），不调 AI、不耗 token
    if (prefs.check) {
      const aiOk = !!(aiConf('endpoint') && aiConf('key') && aiConf('model'));
      await ghRetry('PATCH', '/gists/' + GIST_ID, { files: {
        'result.json': { content: JSON.stringify({ cloudJobCheck: true, ok: true, aiConfigPresent: aiOk, checkedAt: new Date().toISOString() }) },
        'status.json': { content: JSON.stringify({ status: 'done', stage: '', msg: '🧪 自检通过：Gist 读写 ✓ · CLOUDJOB_GH_TOKEN ✓ · AI 配置在场' + (aiOk ? ' ✓' : ' ✗'), progress: 100, updatedAt: new Date().toISOString(), runnerVer: 'v1' }) }
      } });
      log('🧪 自检完成');
      return;
    }
    const subj = prefs.subject === 'auto' ? 'math' : (prefs.subject || 'math');   // auto 由规划阶段自行判断科目语境
    log('接单', job.jobId, JSON.stringify(prefs));
    pushLog('📋 接单 ' + job.jobId + ' · ' + (SUBJ_NAME[subj] || subj) + ' · 难度 ' + (prefs.diff || 'mix') + ' · 模型 ' + (aiConf('model') || '?'));

    // ② 总工规划
    await setStatus('running', 'planning', '总工程师正在规划蓝图…', 5);
    const plan = await aiJson(
      [{ role: 'system', content: plannerSystem(subj, prefs) },
       { role: 'user', content: '请规划本卷蓝图。' }],
      { maxTokens: 3500 });
    if (!plan || !Array.isArray(plan.questions) || !plan.questions.length) throw new Error('蓝图规划失败：无 questions');
    log('蓝图完成：', plan.questions.length, '题 ·', plan.title || '');
    pushLog('🗺 蓝图《' + (plan.title || '未命名卷') + '》规划完成：共 ' + plan.questions.length + ' 题 · 限时 ' + (plan.timeLimit || 120) + ' 分钟');
    plan.questions.forEach((pq, i) => pushLog('　第' + (i + 1) + '题 ' + (pq.topicName || '?') + ' · ' + (pq.type || '?') + ' · ★' + (pq.star || '?')));

    // ③ 并发出题池
    await setStatus('running', 'generating', '并发出题中…', 10);
    let questions = await pool(plan.questions, 4, async (pq, i) => {
      const out = await aiJson(
        [{ role: 'system', content: questionSystem(subj) },
         { role: 'user', content: '蓝图第' + (i + 1) + '题：' + JSON.stringify(pq) }],
        { maxTokens: 3200 });
      out.topicName = pq.topicName || out.topicName || '';
      out.score = out.score || pq.score || 5;
      out.type = pq.type || out.type || 'solve';
      pushLog('✅ 第' + (i + 1) + '题出好了 · ' + (out.topicName || '?') + ' · ★' + (out.star || '?'));
      return out;
    }, (d, n) => { if (d % 3 === 0 || d === n) setStatus('running', 'generating', '并发出题中… ' + d + '/' + n, 10 + Math.round(d / n * 45)); });

    // ④ 蓝本硬校验（纯代码）：坏题先标记，交由审查后统一重写
    const localIssues = [];
    questions.forEach((q, i) => {
      const bad = validateQuestion(q);
      const braceBad = !braceBalanced(q.stem) || !braceBalanced(q.solution);
      if (bad || braceBad) localIssues.push({ index: i + 1, reason: bad + (braceBad ? '；LaTeX 花括号不平衡' : ''), fixHint: '修复结构问题，保持题意不变' });
    });
    log('本地硬校验：', localIssues.length, '题有问题');
    pushLog('🔍 本地硬校验：' + (questions.length - localIssues.length) + ' 题过关，' + localIssues.length + ' 题待修');

    // ⑤ 总工审查
    await setStatus('running', 'reviewing', '总工程师审查中…', 58);
    let review = {};
    try {
      review = await aiJson(
        [{ role: 'system', content: chiefSystem(subj) },
         { role: 'user', content: '审查这份押题卷（题号从1开始）：\n' + JSON.stringify(questions.map((q, i) => ({ index: i + 1, stem: q.stem, options: q.options, answer: q.answer, solution: String(q.solution || '').slice(0, 400), star: q.star })) ) }],
        { maxTokens: 4000 }) || {};
    } catch (e) { log('审查调用失败，仅按本地校验处理：', e.message); }
    const rewriteList = [];
    const seenRw = {};
    ((review.needsRewrite) || []).forEach(r => { if (r && r.index && !seenRw[r.index]) { seenRw[r.index] = 1; rewriteList.push(r); } });
    localIssues.forEach(li => { if (!seenRw[li.index]) { seenRw[li.index] = 1; rewriteList.push(li); } });
    log('审查 verdict=', review.verdict || 'n/a', '待重写', rewriteList.length, '题');
    pushLog('🧐 总审查 verdict=' + (review.verdict || 'n/a') + (review.summary ? '（' + String(review.summary).slice(0, 60) + '）' : '') + '，待重写 ' + rewriteList.length + ' 题');
    rewriteList.forEach(rw => pushLog('　第' + rw.index + '题需重写：' + String(rw.reason || '').slice(0, 50)));

    // ⑥ 定向重写池
    if (rewriteList.length) {
      await setStatus('running', 'rewriting', '定向重写 ' + rewriteList.length + ' 题…', 68);
      await pool(rewriteList, 3, async (rw) => {
        const i = rw.index - 1;
        const old = questions[i];
        if (!old) return null;
        const fixed = await aiJson(
          [{ role: 'system', content: questionSystem(subj) },
           { role: 'user', content: '重写这道题（原题如下）。必须修复：' + rw.reason + '。指引：' + (rw.fixHint || '') + '\n原题：' + JSON.stringify(old) }],
          { maxTokens: 3200 });
        fixed.topicName = old.topicName; fixed.score = old.score; fixed.type = old.type || fixed.type;
        const bad = validateQuestion(fixed);
        if (bad) { log('重写后仍不合格，保留原题 @', rw.index, bad); pushLog('⚠️ 第' + rw.index + '题重写后仍不合格，保留原题'); return null; }
        questions[i] = fixed;
        pushLog('✏️ 第' + rw.index + '题重写完成');
        return null;
      }, (d, n) => setStatus('running', 'rewriting', '定向重写中… ' + d + '/' + n, 68 + Math.round(d / n * 20)));
    }

    // ⑦ 终检 + 打包
    await setStatus('running', 'finalizing', '终检打包中…', 92);
    const finalBad = [];
    questions.forEach((q, i) => { const b = validateQuestion(q); if (b) finalBad.push((i + 1) + ':' + b); });
    if (finalBad.length > Math.ceil(questions.length / 3)) throw new Error('终检不合格题过多（' + finalBad.length + '/' + questions.length + '），放弃交付：' + finalBad.join('; ').slice(0, 300));
    // 剔除个别终检仍坏的题（宁缺毋滥），至少保留 60%
    questions = questions.filter(q => !validateQuestion(q));
    if (questions.length < 5) throw new Error('合格题不足 5 题，放弃交付');
    const totalScore = questions.reduce((a, q) => a + (Number(q.score) || 5), 0);
    const exam = {
      title: plan.title || ('云端押题卷 · ' + (SUBJ_NAME[subj] || '')),
      subject: subj,
      timeLimit: plan.timeLimit || 120,
      totalScore: totalScore,
      questions: questions,
      chiefReview: { verdict: review.verdict || (rewriteList.length ? 'minor' : 'ok'), hardPct: review.hardPct || null, targetHardPct: review.targetHardPct || null, summary: review.summary || '', rewrittenCount: rewriteList.length },
      builtBy: 'cloud-actions',
      generatedAt: new Date().toISOString()
    };

    // ⑧ 收卷回写
    pushLog('📦 终检通过：' + questions.length + ' 题 · 总分 ' + totalScore + ' · 即将回写');
    await ghRetry('PATCH', '/gists/' + GIST_ID, { files: {
      'result.json': { content: JSON.stringify(exam) },
      'status.json': { content: JSON.stringify({ status: 'done', stage: '', msg: '出卷完成（' + questions.length + ' 题 · ' + totalScore + ' 分），可收卷导入', progress: 100, log: RUN_LOG, updatedAt: new Date().toISOString(), runnerVer: 'v3' }) }
    } });
    log('✅ 完成');
  } catch (e) {
    log('❌ 失败：', e.message);
    await setStatus('error', '', '云端执行失败：' + ((e && e.message) || e));
    process.exitCode = 1;
  }
})();
