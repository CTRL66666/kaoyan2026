/* ============================================================
 * prof-workshop.plugin.js — 出题家（单文件插件）· v1.0.0
 * ------------------------------------------------------------
 * 干什么：把学生变成出题人。你出一道题 → AI 当「试做学员」盲做 →
 *         用 AI 的作答与歧义报告反推这道题的质量 → 通过的题一键入站内题库，
 *         被博弈刷题场/组卷抽走，甚至回流成你自己的错题。
 *
 * 为什么值得存在：费曼晶体练「讲出来」（输出侧最强学习法之一），但出题在
 *   Bloom 塔更上一层——要预判错误路径才会设陷阱，要答案唯一才会消歧义。
 *   站内九个插件没有一个练这个，而「出题家出的题进题库被决斗场抽走」是
 *   插件生态第一次形成生产→消费闭环。
 *
 * 工程契约（与站内八插件同一套纪律）：
 *   · 零外部依赖，只用 ctx.*；模块级函数不引用挂载作用域（scope-hygiene）；
 *   · 类名全带 pw- 前缀；皮肤走 ctx.css.add('skin')（绕 manifest 20K 截断）；
 *   · 三主题令牌（日/夜鎏金/金）一处声明；夜间鎏金底配墨字；
 *   · 输入全部过 lintQuestions 确定性质检（答案越界/选项重复/选项数都在
 *     duel adaptChoice 契约内），入库前强制 lint 通过——脏题不进公共池；
 *   · 入站内题库是「写公共数据」：确认框里说清去向与撤回路径（红线纪律）；
 *   · 草稿落 ctx.keep 单槽（不进云）；快捷键在输入框/弹窗让位。
 *
 * AI 两景（都是锦上添花，未配置时质检走确定性 lint、试做退回自检清单）：
 *   · plugin.prof-workshop.trial  think：盲做题目并报告歧义（不许看 trap）
 *   · plugin.prof-workshop.judge  fast ：把学员答案判命中/半对/漏（保守裁决）
 *
 * 安装：插件中心 → 市场「出题家」，或「粘贴导入」选择本文件。
 * ============================================================ */
;(function () {
  'use strict'

  /* ════════════════════════ 0. 常量与元信息 ════════════════════════ */

  let VERSION = '1.1.2'
  let T_MAIN = 'prof-workshop'
  let STYLE_ID = 'pw-skin-style'
  let AI_CTX_TRIAL = 'plugin.prof-workshop.trial'
  let AI_CTX_JUDGE = 'plugin.prof-workshop.judge'

  let Q_MAX = 240                 // 自建题目上限（云同步闸门）
  let STEM_MAX = 600
  let OPT_MAX = 80
  let KEEP_DRAFT = 'pwDraft'      // 正在编辑的草稿单槽
  let BANK_PAGE = 40              // 题库分片首屏（性能纪律：首屏限量+逐帧补尾）

  /* 学科候选：与站内题库口径一致的粗粒度标签（自由文本，不做枚举校验） */
  let SUBJECT_HINTS = ['数学一', '数学二', '数学三', '英语一', '英语二', '政治', '408', '专业课']

  /* ════════════════════════ 1. 小工具（模块作用域，自包含） ════════════════════════ */

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
    })
  }
  function num(v, d) { let n = Number(v); return isFinite(n) ? n : d }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, num(v, a), b === undefined ? Infinity : b)) }
  function dkey(t) { let d = t == null ? new Date() : new Date(t); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') }
  function flat(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim() }
  function trunc(s, n) {
    s = String(s == null ? '' : s)
    if (s.length <= n) return s
    let cut = s.slice(0, n)
    if ((cut.match(/\$/g) || []).length % 2 === 1) cut = cut.slice(0, cut.lastIndexOf('$'))
    if (cut.endsWith('\\')) cut = cut.slice(0, -1)
    return cut.trim() + '…'
  }
  function hashStr(s) { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return h >>> 0 }
  function fmtTime(t) {
    let d = new Date(num(t, Date.now()))
    return (d.getMonth() + 1) + '-' + String(d.getDate()).padStart(2, '0') + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
  }

  /* ════════════════════════ 2. 确定性质检（离线内核，测试直验） ════════════════════════ */

  /**
   * lintQuestion：一道题 → {ok, hard:[硬伤], soft:[提醒]}
   * 硬伤 = 会污染公共题库/让 duel 拒收的：答案越界、选项<2或>4、选项空、选项重复、
   *        题干过短、正确选项缺解析（自产题解析是义务——回流错题本时没解析等于半道题）。
   * 提醒 = 出题手艺问题，不拦入库但要说破：
   *   · 否定词（不/错误/不正确/不属于）未加粗/未标 ※ → 考场读题失误高发结构；
   *   · 「最长选项即答案」启发式：正确选项字数 > 其他选项均长×1.6 → 暗示答案；
   *   · 选项含「以上都不对/无法确定」作正确项 → 零区分度；
   *   · 干扰项与正确项字数极差过小（全等长且都含数字）→ 疑似抄了同一句。
   */
  function lintQuestion(q) {
    let hard = [], soft = []
    if (!q || typeof q !== 'object') return { ok: false, hard: ['题目对象为空'], soft: [] }
    let stem = flat(q.stem)
    if (stem.length < 8) hard.push('题干少于 8 字：先说清「已知什么、问什么」')
    if (stem.length > STEM_MAX) hard.push('题干超过 ' + STEM_MAX + ' 字：拆掉背景故事')
    let opts = Array.isArray(q.options) ? q.options.map(flat) : []
    if (opts.length < 2 || opts.length > 4) hard.push('选项必须 2-4 个（站内题库契约）')
    if (opts.some(function (o) { return !o })) hard.push('存在空选项')
    /* 重复判定只看非空选项——否则空表单会刷出一屏「选项重复：「」」的假硬伤 */
    let seen = {}
    opts.forEach(function (o) { if (!o) return; if (seen[o]) hard.push('选项重复：「' + trunc(o, 12) + '」'); seen[o] = 1 })
    let a = clamp(num(q.answer, -1), -1, 9)
    if (a < 0 || a >= opts.length) hard.push('答案下标越界')
    /* 解析兼容两种形状：站内单数 solution 字符串 / 出题家逐项 solutions 数组
     * （数组时只强制正确项有解析——「为什么对」是入库义务，错项解析是建议项） */
    let solText = ''
    if (Array.isArray(q.solutions)) {
      let s = q.solutions[a]
      solText = flat(s && (typeof s === 'string' ? s : s.text))
    } else solText = flat(q.solution)
    if (a >= 0 && !solText) hard.push('正确项没有解析：出题家入库义务是「为什么对」')
    if (a >= 0 && /以上都不对|无法确定|无法判断/.test(opts[a] || '')) soft.push('正确项是「都不对/无法确定」型——几乎零区分度')
    if (/(不|错误|不正确|不属于|例外)/.test(stem) && !/(\*\*|※|〔注意〕|【注意】)/.test(q.stem || '') && !/(不|错误)/.test(flat(q.mark || ''))) {
      soft.push('否定式设问未做醒目标记：考场读错题的头号结构')
    }
    if (a >= 0 && opts.length >= 3) {
      let others = opts.filter(function (o, i) { return i !== a })
      let avg = others.reduce(function (s, o) { return s + o.length }, 0) / others.length
      if (avg > 4 && opts[a].length > avg * 1.6) soft.push('正确选项比其他选项长一半以上：「最长即答案」的暗示')
    }
    return { ok: hard.length === 0, hard: hard, soft: soft }
  }

  /**
   * scoreTrial：AI 试做结果 × 用户声称的答案 → 题面质量判定。
   * 判据矩阵（只认结构不认内容，内容判断交给歧义列表）：
   *   · AI 与答案一致 + 无歧义 → 干净（rigor 高）；
   *   · AI 与答案一致但 AI 指出多解 → 答案不唯一嫌疑（discrim 降）；
   *   · AI 与答案不一致 → 硬歧义：要么答案错要么题面误导（必须人工复核才能入库）；
   *   · AI 说无法作答（缺条件）→ 完备性低。
   * 返回 {rigor, completeness, discrim, trapHit, verdict, blockers[]}，分数 0-100。
   */
  function scoreTrial(q, trial) {
    if (!q || !trial) return null
    let a = clamp(num(q.answer, -1), -1, 9)
    let aiPick = clamp(num(trial.pick, -1), -1, 9)
    let amb = Array.isArray(trial.ambiguities) ? trial.ambiguities.map(flat).filter(Boolean).slice(0, 6) : []
    let cannot = !!trial.cannotAnswer
    let blockers = []
    let rigor, completeness, discrim
    if (cannot) {
      rigor = 40; completeness = 25; discrim = 45
      blockers.push('AI 判断此题条件不足、无法作答——检查是否漏了已知量')
    } else if (aiPick === a) {
      rigor = 85; completeness = 85
      if (amb.length) { rigor = 60; discrim = 55; blockers.push('AI 做对了但报告了 ' + amb.length + ' 处歧义/多解——答案唯一性存疑') }
      else discrim = 80
    } else {
      rigor = 30; completeness = 60; discrim = 35
      blockers.push('AI 选了 ' + 'ABCDEFGH'[clamp(aiPick, 0, 7)] + '，你声称答案是 ' + 'ABCDEFGH'[clamp(a, 0, 7)] + '：要么答案标错，要么题面在误导')
    }
    rigor = num(rigor, 50); completeness = num(completeness, 50); discrim = num(discrim, 50)
    let trapHit = !!trial.trapTriggered
    let verdict = blockers.length ? '需修订' : '干净'
    return {
      rigor: rigor, completeness: completeness, discrim: discrim,
      trapHit: trapHit, verdict: verdict, blockers: blockers,
      aiPick: aiPick, amb: amb, at: Date.now(),
    }
  }

  /** 聚合账本：跨题统计（教练查询与档案页共用） */
  function statsOf(list) {
    if (!Array.isArray(list) || !list.length) return null
    let n = list.length
    let trialed = list.filter(function (q) { return q.trial })
    let clean = trialed.filter(function (q) { return q.trial.verdict === '干净' })
    let banked = list.filter(function (q) { return q.bankedAt })
    let aiWrong = trialed.filter(function (q) { return q.trial.aiPick != null && q.trial.aiPick !== q.answer })
    let trapHit = trialed.filter(function (q) { return q.trial.trapHit })
    let bySubject = {}
    list.forEach(function (q) { let s = flat(q.subject) || '未分类'; bySubject[s] = (bySubject[s] || 0) + 1 })
    return {
      n: n,
      trialRate: Math.round(trialed.length / n * 100),
      cleanRate: trialed.length ? Math.round(clean.length / trialed.length * 100) : null,
      banked: banked.length,
      aiWrongRate: trialed.length ? Math.round(aiWrong.length / trialed.length * 100) : null,
      trapHitRate: trialed.length ? Math.round(trapHit.length / trialed.length * 100) : null,
      bySubject: bySubject,
    }
  }

  /* ════════════════════════ 3. 数据层 ════════════════════════ */

  function normOption(o) { return { id: String(o && o.id || 'p').slice(0, 24), text: flat(o && o.text).slice(0, OPT_MAX) } }
  function normQ(q) {
    if (!q || typeof q !== 'object') return null
    let stem = flat(q.stem).slice(0, STEM_MAX)
    if (!stem) return null
    let opts = (Array.isArray(q.options) ? q.options : []).slice(0, 4).map(normOption).filter(function (o) { return o.text })
    if (opts.length < 2) return null
    let sol = Array.isArray(q.solutions) ? q.solutions.slice(0, 4).map(function (s) { return { id: String(s && s.id || 's').slice(0, 24), text: flat(s && s.text).slice(0, OPT_MAX) } }).filter(function (s) { return s.text }) : []
    return {
      id: String(q.id || ('pw-' + Date.now().toString(36) + '-' + opts.length)).slice(0, 32),
      stem: stem,
      options: opts,
      answer: clamp(num(q.answer, 0), 0, opts.length - 1),
      solutions: sol,
      trap: flat(q.trap).slice(0, 200),
      subject: flat(q.subject).slice(0, 20),
      diff: clamp(num(q.diff, 2), 1, 3),
      status: ['draft', 'ok', 'banked'].indexOf(String(q.status)) >= 0 ? String(q.status) : 'draft',
      createdAt: clamp(num(q.createdAt, Date.now()), 1, Infinity),
      bankedAt: q.bankedAt ? clamp(num(q.bankedAt, 0), 1, Infinity) : 0,
      bankRef: String(q.bankRef || '').slice(0, 40),
      trial: q.trial && typeof q.trial === 'object' ? {
        verdict: String(q.trial.verdict || '需修订').slice(0, 8),
        rigor: clamp(num(q.trial.rigor, 0), 0, 100),
        completeness: clamp(num(q.trial.completeness, 0), 0, 100),
        discrim: clamp(num(q.trial.discrim, 0), 0, 100),
        trapHit: !!q.trial.trapHit,
        aiPick: num(q.trial.aiPick, -1),
        amb: (Array.isArray(q.trial.amb) ? q.trial.amb : []).slice(0, 6).map(flat).filter(Boolean),
        blockers: (Array.isArray(q.trial.blockers) ? q.trial.blockers : []).slice(0, 6).map(flat).filter(Boolean),
        at: clamp(num(q.trial.at, 0), 0, Infinity),
      } : null,
    }
  }
  function listGet(ctx) {
    let arr = null
    try { arr = ctx.data('pwQuestions') } catch (e) { return [] }
    if (!Array.isArray(arr)) return []
    return arr.map(normQ).filter(Boolean).slice(0, Q_MAX)
  }
  function listSave(ctx, list) {
    let out = (list || []).slice(0, Q_MAX)
    try { ctx.data('pwQuestions', out) } catch (e) { /* 隐私模式内存继续 */ }
    return out
  }

  /* ════════════════════════ 4. 样式 ════════════════════════ */

  let CSS = [
    '.pw-root,.pw-modal{--pw-acc:#6d28d9;--pw-acc2:#8b5cf6;--pw-ink:var(--text-primary,#1e2a4a);'
      + '--pw-sub:var(--text-muted,#7c8aa8);--pw-ink2:var(--text-secondary,#4a5670);--pw-line:var(--line,#d8dde8);'
      + '--pw-bg:var(--surface,#fff);--pw-soft:var(--surface-muted,#f6f8fc);--pw-ok:var(--ok,#0f7c4a);'
      + '--pw-warn:var(--warn,#c47615);--pw-danger:var(--danger,#d83b3b);--pw-on-acc:#fff;--pw-acc-text:var(--pw-acc);'
      + '--pw-ease:cubic-bezier(.22,.8,.26,1)}',
    'html[data-theme="night"] .pw-root,html[data-theme="night"] .pw-modal{'
      + '--pw-acc:var(--nk-acc,#f0b95a);--pw-acc2:#e2a43f;--pw-on-acc:var(--nk-acc-ink,#2a1c04);--pw-acc-text:var(--nk-acc,#f0b95a)}',
    'html[data-theme="gold"] .pw-root,html[data-theme="gold"] .pw-modal{'
      + '--pw-acc:#7c3aed;--pw-acc2:#9d6bff;--pw-on-acc:#fff;--pw-acc-text:#6d28d9}',
    '.pw-mark{width:42px;height:42px;border-radius:12px;flex:0 0 auto;display:grid;place-items:center;'
      + 'color:var(--pw-on-acc);background:linear-gradient(135deg,var(--pw-acc),var(--pw-acc2));box-shadow:0 8px 18px -8px color-mix(in srgb,var(--pw-acc) 70%,transparent)}',
    '.pw-mark svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}',
    '.pw-root{color:var(--pw-ink);font:14px/1.65 "PingFang SC","Microsoft YaHei",system-ui,sans-serif;'
      + 'margin:calc(var(--vp-t,16px)*-1) calc(var(--vp-x,16px)*-1) calc(var(--vp-b,24px)*-1);'
      + 'min-height:calc(100vh - 59px);display:flex;flex-direction:column;background:var(--pw-soft)}',
    '.pw-hero{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:14px;flex-wrap:wrap;'
      + 'padding:15px calc(var(--vp-x,16px) + max(6px,(100% - var(--pw-w,1120px))/2)) 13px;background:transparent;'
      + 'transition:padding .3s var(--pw-ease),background-color .3s,box-shadow .3s}',
    '.pw-hero.stuck{background:color-mix(in srgb,var(--pw-bg) 88%,transparent);backdrop-filter:blur(14px);'
      + '-webkit-backdrop-filter:blur(14px);box-shadow:0 10px 26px -22px rgba(15,25,45,.5);padding-top:9px;padding-bottom:8px}',
    '.pw-brand{display:flex;align-items:center;gap:12px;min-width:0}',
    '.pw-brandtx{display:flex;flex-direction:column;min-width:0}',
    '.pw-kicker{font:700 9.5px/1 ui-monospace,Consolas,monospace;letter-spacing:.22em;color:var(--pw-sub);text-transform:uppercase}',
    '.pw-brandtx b{font-size:19px;font-weight:800;letter-spacing:.01em}',
    '.pw-brandtx b em{font-style:normal;font-size:10px;font-weight:700;color:var(--pw-sub);margin-left:6px;'
      + 'vertical-align:2px;border:1px solid var(--pw-line);border-radius:6px;padding:1px 6px}',
    '.pw-kpis{display:flex;gap:8px;margin-left:auto;flex-wrap:wrap}',
    '.pw-kpi{display:flex;flex-direction:column;align-items:center;min-width:56px;padding:0 10px;border-left:1px solid var(--pw-line)}',
    '.pw-kpi b{font-size:17px;font-weight:800;line-height:1.2}.pw-kpi i{font-style:normal;font-size:9px;letter-spacing:.08em;color:var(--pw-sub)}',
    '.pw-kpi.ok b{color:var(--pw-ok)}.pw-kpi.warn b{color:var(--pw-warn)}',
    '.pw-btn{height:34px;padding:0 16px;border-radius:999px;border:1px solid var(--pw-line);'
      + 'background:var(--pw-bg);color:var(--pw-ink);font-weight:700;font-size:13px;cursor:pointer;'
      + 'display:inline-flex;align-items:center;gap:7px;transition:transform .16s,border-color .16s,box-shadow .16s}',
    '.pw-btn:hover{transform:translateY(-1px);border-color:color-mix(in srgb,var(--pw-acc) 45%,var(--pw-line))}',
    '.pw-btn.primary{background:linear-gradient(135deg,var(--pw-acc),var(--pw-acc2));color:var(--pw-on-acc);border:0;'
      + 'box-shadow:0 8px 20px -12px color-mix(in srgb,var(--pw-acc) 90%,transparent)}',
    '.pw-btn.ghost{background:none;border-style:dashed}',
    '.pw-btn.sm{height:28px;padding:0 12px;font-size:12px;border-radius:9px}',
    /* 禁用态不用 opacity：深色主题下按钮连文字一起被压成背景色（night-skin 纪律） */
    '.pw-btn:disabled{opacity:1;cursor:not-allowed;color:var(--pw-sub);border-color:var(--pw-line);'
      + 'background:color-mix(in oklab,var(--pw-ink) 6%,transparent);box-shadow:none;transform:none}',
    '.pw-dockwrap{position:fixed;left:0;right:0;bottom:0;z-index:40;display:flex;justify-content:center;padding:0 14px 12px;pointer-events:none}',
    '.pw-dock{position:relative;display:flex;gap:2px;padding:6px;pointer-events:auto;border-radius:19px;'
      + 'background:color-mix(in srgb,var(--pw-bg) 82%,transparent);backdrop-filter:blur(16px) saturate(1.2);'
      + '-webkit-backdrop-filter:blur(16px) saturate(1.2);border:1px solid var(--pw-line);'
      + 'box-shadow:0 14px 38px -18px rgba(15,23,42,.4)}',
    '.pw-dock-ind{position:absolute;top:6px;bottom:6px;left:6px;width:10px;border-radius:13px;'
      + 'background:color-mix(in srgb,var(--pw-acc) 16%,transparent);'
      + 'transition:transform .32s cubic-bezier(.22,1,.36,1),width .32s cubic-bezier(.22,1,.36,1)}',
    '.pw-dock-item{position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;min-width:76px;'
      + 'padding:8px 14px;border:0;border-radius:13px;background:none;color:var(--pw-sub);font-size:11.5px;'
      + 'font-weight:600;cursor:pointer;transition:color .18s}',
    /* 全局图标纪律（fv 同款教训）：内联 SVG 没有尺寸约束时按 viewBox 默认铺开撑爆容器。 */
    '.pw-btn svg,.pw-verdict svg,.pw-empty .ico svg,.pw-fld svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.9;flex:0 0 auto}',
    '.pw-dock-item svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.7}',
    '.pw-dock-item.on{color:var(--pw-acc-text)}',
    /* nowrap 必须打在基线规则上：dock 宽度由内容定，CJK 串的 min-content 是 1 个字——
     * 不给 nowrap，flex 压缩时「出题台」会竖排成「出题/台」（2026-11-12 390px 巡检实拍）。 */
    '.pw-dock-item em{font-style:normal;white-space:nowrap}',
    '.pw-stage{width:100%;max-width:var(--pw-w,1120px);margin:0 auto;padding:6px var(--vp-x,16px) 152px;flex:1}',
    '.pw-card{background:var(--pw-bg);border:1px solid var(--pw-line);border-radius:16px;padding:18px 20px;'
      + 'margin-bottom:14px;box-shadow:0 1px 2px rgba(16,30,60,.04)}',
    '.pw-enter .pw-card{animation:pwRise .45s var(--pw-ease) both}',
    '@keyframes pwRise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}',
    '.pw-card-h{display:flex;align-items:baseline;gap:10px;padding-bottom:9px;margin-bottom:14px;border-bottom:1px solid var(--pw-line)}',
    '.pw-card-h b{font-size:15.5px;font-weight:800}',
    '.pw-card-h em{font-style:normal;font-size:11.5px;color:var(--pw-sub)}',
    '.pw-quiet{font-size:12px;color:var(--pw-sub);line-height:1.7}',
    '.pw-acts{display:flex;gap:9px;flex-wrap:wrap;margin-top:12px}',
    '.pw-input{height:36px;border:1px solid var(--pw-line);border-radius:10px;padding:0 11px;background:var(--pw-bg);'
      + 'color:var(--pw-ink);outline:none;font:inherit;font-size:13.5px;width:100%}',
    '.pw-input:focus{border-color:var(--pw-acc);box-shadow:0 0 0 3px color-mix(in srgb,var(--pw-acc) 16%,transparent)}',
    'textarea.pw-input{height:auto;min-height:74px;padding:9px 11px;resize:vertical;line-height:1.6}',
    '.pw-fld{display:flex;flex-direction:column;gap:5px;margin-bottom:12px}',
    '.pw-fld>span{font-size:11.5px;font-weight:800;color:var(--pw-ink2);letter-spacing:.04em}',
    '.pw-fld .hint{font-size:10.5px;color:var(--pw-sub);font-weight:400}',
    '.pw-optrow{display:flex;gap:8px;align-items:center;margin-bottom:7px}',
    '.pw-olt{font:800 13px/1 ui-monospace,Consolas,monospace;color:var(--pw-sub);width:18px;flex:0 0 auto;text-align:center}',
    '.pw-radio{width:17px;height:17px;flex:0 0 auto;accent-color:var(--pw-acc);cursor:pointer}',
    '.pw-srow{display:flex;gap:8px;align-items:center;margin-bottom:6px}',
    '.pw-lint{border-radius:12px;padding:11px 13px;font-size:12.5px;line-height:1.7;margin-top:6px}'
      + '  ;border:1px solid var(--pw-line);background:var(--pw-soft)}',
    '.pw-lint.hard{border-color:color-mix(in srgb,var(--pw-danger) 45%,var(--pw-line));background:color-mix(in srgb,var(--pw-danger) 6%,var(--pw-bg))}',
    '.pw-lint.soft{border-color:color-mix(in srgb,var(--pw-warn) 45%,var(--pw-line));background:color-mix(in srgb,var(--pw-warn) 6%,var(--pw-bg))}',
    '.pw-lint ul{margin:4px 0 0 16px;padding:0}',
    '.pw-trial{display:flex;gap:10px;flex-wrap:wrap;margin:10px 0 4px}',
    '.pw-dim{flex:1;min-width:150px;border:1px solid var(--pw-line);border-radius:13px;padding:11px 13px;background:var(--pw-bg)}',
    '.pw-dim b{display:block;font:800 21px/1.1 ui-monospace,Consolas,monospace}',
    '.pw-dim span{font-size:11px;color:var(--pw-sub)}',
    '.pw-dim .pw-gauge{margin-top:7px}',
    '.pw-gauge{height:6px;border-radius:999px;background:var(--pw-soft);overflow:hidden}',
    '.pw-gauge i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,var(--pw-acc),var(--pw-acc2))}',
    '.pw-verdict{margin-top:10px;padding:10px 12px;border-radius:11px;font-size:12.5px;line-height:1.7;'
      + 'background:var(--pw-soft);border:1px dashed var(--pw-line)}',
    '.pw-verdict.clean{border-color:color-mix(in srgb,var(--pw-ok) 50%,var(--pw-line));background:color-mix(in srgb,var(--pw-ok) 6%,var(--pw-bg))}',
    '.pw-verdict.revise{border-color:color-mix(in srgb,var(--pw-danger) 40%,var(--pw-line));background:color-mix(in srgb,var(--pw-danger) 5%,var(--pw-bg))}',
    '.pw-qrow{display:flex;gap:11px;align-items:flex-start;padding:11px 4px;border-bottom:1px dashed color-mix(in srgb,var(--pw-line) 60%,transparent)}',
    '.pw-qrow:last-child{border-bottom:0}',
    '.pw-qmain{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}',
    '.pw-qmain b{font-size:13.5px;font-weight:700;line-height:1.5;word-break:break-word}',
    '.pw-qmain span{font-size:11px;color:var(--pw-sub)}',
    '.pw-st{border-radius:7px;padding:2px 8px;font-size:10px;font-weight:800;flex:0 0 auto}',
    '.pw-st.draft{background:color-mix(in srgb,var(--pw-sub) 14%,transparent);color:var(--pw-sub)}',
    '.pw-st.ok{background:color-mix(in srgb,var(--pw-ok) 13%,transparent);color:var(--pw-ok)}',
    '.pw-st.banked{background:color-mix(in srgb,var(--pw-acc) 13%,transparent);color:var(--pw-acc-text)}',
    '.pw-dots{display:flex;gap:3px;flex:0 0 auto;align-items:center}',
    '.pw-dot{width:13px;height:13px;border-radius:50%;background:var(--pw-soft);border:1px solid var(--pw-line)}',
    '.pw-dot.on{background:var(--pw-acc);border-color:var(--pw-acc)}',
    '.pw-statgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}',
    '.pw-stat{border:1px solid var(--pw-line);border-radius:13px;padding:12px 14px;background:var(--pw-bg)}',
    '.pw-stat b{display:block;font:800 22px/1.15 ui-monospace,Consolas,monospace}',
    '.pw-stat span{font-size:11.5px;color:var(--pw-sub)}',
    '.pw-empty{display:flex;flex-direction:column;align-items:center;gap:10px;padding:34px 12px;color:var(--pw-sub);text-align:center}',
    '.pw-empty .ico{width:44px;height:44px;border-radius:13px;display:grid;place-items:center;'
      + 'background:color-mix(in srgb,var(--pw-acc) 12%,transparent);color:var(--pw-acc-text)}',
    '.pw-empty b{color:var(--pw-ink);font-size:15px}',
    '.pw-keys{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px}',
    '.pw-keyrow{display:flex;gap:10px;align-items:center;font-size:12.5px;color:var(--pw-ink2)}',
    '.pw-keycap{font:700 11px/1 ui-monospace,Consolas,monospace;border:1px solid var(--pw-line);'
      + 'border-bottom-width:2.5px;border-radius:7px;padding:4px 8px;background:var(--pw-bg);color:var(--pw-ink)}',
    '.pw-modal{position:fixed;inset:0;z-index:9000;display:none;place-items:center;padding:22px;'
      + 'background:rgba(10,16,30,.5);backdrop-filter:blur(3px)}',
    '.pw-modal.on{display:grid}',
    '.pw-modal-box{width:min(600px,94vw);max-height:88vh;overflow:auto;background:var(--pw-bg);'
      + 'border:1px solid var(--pw-line);border-radius:17px;padding:20px 22px;box-shadow:0 30px 80px -30px rgba(10,20,40,.5)}',
    '.pw-think{display:inline-block;width:120px;height:14px;border-radius:4px;'
      + 'background:linear-gradient(90deg,var(--pw-line) 25%,color-mix(in srgb,var(--pw-line) 45%,transparent) 50%,var(--pw-line) 75%);'
      + 'background-size:240px 100%;animation:pwskel 1.1s linear infinite}',
    '@keyframes pwskel{0%{background-position:60px 0}100%{background-position:-180px 0}}',
    /* 常驻面板(插件中心/侧栏渲染,在 root 之外——令牌要自己带) */
    '.pw-panel{font:13px/1.6 "PingFang SC","Microsoft YaHei",system-ui,sans-serif;color:var(--text-primary,#1b2430);padding:2px}',
    '.pw-panel-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}',
    '.pw-panel-kpis div{border-bottom:1px solid var(--line,#e5e7eb);padding:2px 0 6px}',
    '.pw-panel-kpis b{display:block;font-family:Georgia,serif;font-size:20px;line-height:1.2}',
    '.pw-panel-kpis span{font-size:9.5px;letter-spacing:.1em;color:var(--text-muted,#6b7788)}',
    '.pw-panel-list{display:flex;flex-direction:column}',
    '.pw-panel-row{display:flex;align-items:center;gap:8px;font-size:12px;padding:7px 0;border-bottom:1px solid var(--line,#e5e7eb)}',
    '.pw-panel-row span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.pw-panel-row i{font-style:normal;flex:0 0 auto;font-size:10.5px}',
    /* 警告字色：站点 --warn 是填充色（#d48806 当文字在白卡只有 2.87:1）——
     * 日间深琥珀 #b45309（5.0:1），夜间才接 --warn（night-skin 纪律） */
    '.pw-panel-row i.warn{color:#b45309}.pw-panel-row i.ok{color:var(--ok,#0f7c4a)}',
    'html[data-theme="night"] .pw-panel-row i.warn{color:var(--warn,#e8ae3f)}',
    '.pw-panel-empty{font-size:12px;color:var(--text-muted,#6b7788);padding:10px 0}',
    /* —— 覆盖层放最后 —— */
    '@media (max-width:760px){.pw-btn.sm{height:30px}.pw-brandtx b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
      + '.pw-dock-item{min-width:0;flex:1;padding:7px 2px}'
      + '.pw-dock-item em{font-size:9.5px}.pw-brandtx b{font-size:17px}.pw-kicker{display:none}'
      + '.pw-dim{min-width:120px}.pw-stage{padding-bottom:162px}}',
    'html[data-theme="night"] .pw-dock-item.on{filter:brightness(1.8) saturate(.82)}',
  ].join('\n')

  function injectStyles() {
    let host = window.__PW_HOST_CTX
    if (host && host.css && typeof host.css.add === 'function') { host.css.add(CSS, 'skin'); return }
    let st = document.getElementById(STYLE_ID)
    if (st) { if (st.textContent !== CSS) st.textContent = CSS; return }
    st = document.createElement('style')
    st.id = STYLE_ID
    st.textContent = CSS
    document.head.appendChild(st)
  }

  /* ════════════════════════ 5. 图标 ════════════════════════ */

  function I(name) {
    let p = {
      pen: '<path d="M4 20l1.2-4.2L16 5.2a2.1 2.1 0 0 1 3 3L8.2 18.8 4 20z"/><path d="M13.5 7.5l3 3"/>',
      flask: '<path d="M9 3h6M10 3v5L5 19a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-11V3"/><path d="M7.5 14h9"/>',
      robot: '<rect x="5" y="8" width="14" height="10" rx="2.5"/><path d="M12 8V4M8.5 13h.01M15.5 13h.01M9 16.5h6"/><path d="M3 12v3M21 12v3"/>',
      archive: '<rect x="3" y="4" width="18" height="5" rx="1.5"/><path d="M5 9v9.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V9"/><path d="M10 13h4"/>',
      chart: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
      gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/>',
      check: '<path d="M4 12.5 9.5 18 20 6.5"/>',
      cross: '<path d="M5 5l14 14M19 5 5 19"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
      trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
      down: '<path d="M12 3v12M6 11l6 6 6-6M4 21h16"/>',
      up: '<path d="M12 21V9M6 13l6-6 6 6M4 3h16"/>',
      send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/>',
      bulb: '<path d="M9 18h6M10 21h4M12 2a7 7 0 0 1 4 12.5V16H8v-1.5A7 7 0 0 1 12 2z"/>',
      book: '<path d="M4 5a2 2 0 0 1 2-2h14v18H6a2 2 0 0 1-2-2V5z"/><path d="M4 17h16"/>',
    }[name] || ''
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + p + '</svg>'
  }
  let MARK_TILE = '<span class="pw-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 19l1-3.5L16.5 5a2 2 0 0 1 2.8 2.8L8.8 18.2 5 19z"/><path d="M4 4l2.5 2.5"/><path d="M12 20h8"/></svg></span>'
  /* 【2026-11-12 用户报修：导航图标全空】manifest 的 icon 走 U.rawIcon——白名单只认 SVG 标签，
   * `<span class="pw-mark">` 整棵子树（连里面的 svg）会被消毒器摘光。
   * 页面头图继续用 MARK_TILE（渐变砖靠皮肤），manifest（tools/panels）必须吃**自包含 SVG**
   * （sf/er 同款口径：viewBox+width+height+currentColor，不依赖任何外部 CSS）。 */
  let MARK_ICON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 19l1-3.5L16.5 5a2 2 0 0 1 2.8 2.8L8.8 18.2 5 19z"/><path d="M4 4l2.5 2.5"/><path d="M12 20h8"/></svg>'

  /* ════════════════════════ 6. 视图（模块级，(ctx,S) 入参） ════════════════════════ */

  function kpiOf(S) {
    let st = statsOf(S.list)
    if (!st) return { n: 0, banked: 0, clean: null, aiWrong: null }
    return { n: st.n, banked: st.banked, clean: st.cleanRate, aiWrong: st.aiWrongRate }
  }
  function heroHTML(S) {
    let k = kpiOf(S)
    return '<header class="pw-hero" data-pw="hero">'
      + '<div class="pw-brand">' + MARK_TILE
      + '<div class="pw-brandtx"><span class="pw-kicker">PROF · WORKSHOP</span>'
      + '<b>出题家<em>v' + VERSION + '</em></b></div></div>'
      + '<div class="pw-kpis">'
      + '<span class="pw-kpi"><b>' + k.n + '</b><i>我的题</i></span>'
      + '<span class="pw-kpi' + (k.banked ? ' ok' : '') + '"><b>' + k.banked + '</b><i>已入题库</i></span>'
      + '<span class="pw-kpi"><b>' + (k.clean == null ? '—' : k.clean + '%') + '</b><i>试做干净率</i></span>'
      + '<span class="pw-kpi' + (k.aiWrong != null && k.aiWrong > 30 ? ' warn' : '') + '"><b>' + (k.aiWrong == null ? '—' : k.aiWrong + '%') + '</b><i>AI 做错率</i></span>'
      + '</div>'
      + '<div style="display:flex;gap:8px;align-items:center"><button class="pw-btn primary" data-act="newq">' + I('plus') + '出新题</button></div>'
      + '</header>'
  }

  function qEditorHTML(S) {
    let d = S.draft
    let letters = 'ABCDEFGH'
    let lint = lintQuestion({ stem: d.stem, options: d.options.map(function (o) { return o.text }), answer: d.answer, solutions: d.solutions })
    let out = []
    out.push('<section class="pw-card"><div class="pw-card-h"><b>' + (d.id ? '修订题目' : '新题草稿') + '</b>'
      + '<em>先自己写清楚，再让 AI 试做挑刺</em>'
      + (d.id ? '<button class="pw-btn ghost sm" data-act="edit-cancel" style="margin-left:auto">退出编辑</button>' : '')
      + '</div>')
    out.push('<div class="pw-fld"><span>题干（$…$ 写 LaTeX，站内统一渲染）</span>'
      + '<textarea class="pw-input" data-pw="stem" placeholder="例：设 $f(x)=x^2-2x$，则 $f(1)$ 的值为（　）">' + esc(d.stem) + '</textarea></div>')
    out.push('<div class="pw-fld"><span>选项<span class="hint"> 2-4 个；点左侧圆圈设正确答案</span></span>')
    d.options.forEach(function (o, i) {
      out.push('<div class="pw-optrow">'
        + '<input type="radio" name="pw-ans" class="pw-radio" data-act="set-ans" data-i="' + i + '"' + (d.answer === i ? ' checked' : '') + ' title="正确答案">'
        + '<span class="pw-olt">' + letters[i] + '</span>'
        + '<input class="pw-input" data-pw="opt" data-i="' + i + '" value="' + esc(o.text) + '" placeholder="选项 ' + letters[i] + '">'
        + (d.options.length > 2 ? '<button class="pw-btn ghost sm" data-act="del-opt" data-i="' + i + '" style="height:36px;padding:0 9px" title="删掉这个选项">' + I('cross') + '</button>' : '')
        + '</div>')
    })
    if (d.options.length < 4) out.push('<button class="pw-btn ghost sm" data-act="add-opt">' + I('plus') + '加一个选项</button>')
    out.push('</div>')
    out.push('<div class="pw-fld"><span>逐项解析<span class="hint"> 至少写正确项为什么对——这是入库义务</span></span>')
    d.options.forEach(function (o, i) {
      out.push('<div class="pw-srow"><span class="pw-olt">' + letters[i] + '</span>'
        + '<input class="pw-input" data-pw="sol" data-i="' + i + '" value="' + esc((d.solutions[i] && d.solutions[i].text) || '') + '" placeholder="' + (i === d.answer ? '正确项解析（必填）' : '这个选项为什么错（建议）') + '"></div>')
    })
    out.push('</div>')
    out.push('<div style="display:flex;gap:10px;flex-wrap:wrap">'
      + '<div class="pw-fld" style="flex:1"><span>陷阱设计</span><input class="pw-input" data-pw="trap" value="' + esc(d.trap) + '" placeholder="例：B 项利用「漏乘 2」的典型错误构造干扰项"></div>'
      + '<div class="pw-fld" style="width:150px"><span>学科</span><input class="pw-input" data-pw="subject" value="' + esc(d.subject) + '" placeholder="数学一" list="pw-subj-list"></div>'
      + '<div class="pw-fld" style="width:130px"><span>难度</span><select class="pw-input" data-pw="diff">'
      + '<option value="1"' + (d.diff === 1 ? ' selected' : '') + '>简单</option>'
      + '<option value="2"' + (d.diff === 2 ? ' selected' : '') + '>中等</option>'
      + '<option value="3"' + (d.diff === 3 ? ' selected' : '') + '>硬骨头</option></select></div>'
      + '</div>'
      + '<datalist id="pw-subj-list">' + SUBJECT_HINTS.map(function (s) { return '<option value="' + esc(s) + '">' }).join('') + '</datalist>')
    /* 实时 lint：硬伤红、提醒黄 */
    if (flat(d.stem) || d.options.some(function (o) { return o.text })) {
      if (!lint.ok) out.push('<div class="pw-lint hard"><b>硬伤（修完才能保存/入库）</b><ul>' + lint.hard.map(function (x) { return '<li>' + esc(x) + '</li>' }).join('') + '</ul></div>')
      if (lint.soft.length) out.push('<div class="pw-lint soft"><b>出题手艺提醒</b><ul>' + lint.soft.map(function (x) { return '<li>' + esc(x) + '</li>' }).join('') + '</ul></div>')
    }
    out.push('<div class="pw-acts">'
      + '<button class="pw-btn primary" data-act="save-q"' + (lint.ok ? '' : ' disabled title="有硬伤"') + '>' + I('check') + '保存草稿</button>'
      + '<button class="pw-btn" data-act="trial"' + (lint.ok ? '' : ' disabled title="有硬伤"') + '>' + I('robot') + '送 AI 试做</button>'
      + '</div>')
    out.push('<div class="pw-quiet" style="margin-top:8px">保存 = 存进本插件私有档案；入库 = 写进<b>站内公共题库</b>（需先通过 AI 试做或手动确认「已自检」），之后决斗场/组卷都能抽到它。</div>')
    out.push('</section>')
    return out.join('')
  }

  function viewBench(ctx, S) {
    let out = [qEditorHTML(S)]
    /* 右侧/下方：从站内数据借灵感 */
    out.push('<section class="pw-card"><div class="pw-card-h"><b>找灵感</b><em>好题往往藏在你的错题里</em></div>')
    let mk = (S.mistakes || []).slice(0, 5)
    if (mk.length) {
      out.push('<div class="pw-quiet">把错题「反过来出」是最快的起步：你当时错在哪，就在别人对的地方设陷阱。</div><div style="margin-top:8px">')
      mk.forEach(function (m, i) {
        out.push('<div class="pw-qrow"><div class="pw-qmain"><b>' + esc(trunc(flat(m.stem || m.desc), 44)) + '</b>'
          + '<span>' + esc(flat(m.subject || '')) + ' · ' + fmtTime(m.at || m.savedAt || Date.now()) + '</span></div>'
          + '<button class="pw-btn sm" data-act="inspire" data-i="' + i + '">借这道重出</button></div>')
      })
      out.push('</div>')
    } else {
      out.push('<div class="pw-empty"><span class="ico">' + I('book') + '</span><b>站内错题本还是空的</b>'
        + '先去做几组题（刷题场/组卷），有了错题再来「反过来出题」。</div>')
    }
    out.push('</section>')
    return out.join('')
  }

  function viewTrial(ctx, S) {
    let q0 = S.list.filter(function (x) { return x.id === S.trialId })[0]
    if (!q0) {
      return '<section class="pw-card"><div class="pw-card-h"><b>AI 试做</b><em>还没有可试做的题</em></div>'
        + '<div class="pw-empty"><span class="ico">' + I('robot') + '</span><b>先保存一道题</b>在「出题台」写好并保存，再送 AI 盲做。</div></section>'
    }
    let out = []
    out.push('<section class="pw-card"><div class="pw-card-h"><b>题面（AI 看到的全部内容）</b><em>不给答案、不给解析、不给陷阱——只考题面本身立不立得住</em></div>')
    out.push('<div class="pw-verdict" style="font-size:14px;font-weight:600">' + esc(q0.stem) + '</div>')
    out.push('<div style="margin-top:8px">' + q0.options.map(function (o, i) {
      return '<div class="pw-optrow" style="cursor:default"><span class="pw-olt">' + 'ABCDEFGH'[i] + '</span><span style="font-size:13px">' + esc(o.text) + '</span></div>'
    }).join('') + '</div>')
    out.push('</section>')

    if (S.trialBusy) {
      out.push('<section class="pw-card"><div class="pw-card-h"><b>试做中</b><em>AI 正在盲做这道题…</em></div><span class="pw-think"></span></section>')
      return out.join('')
    }
    if (!S.trialResult) {
      let aiOn = ctx.ai && ctx.ai.has && ctx.ai.has()
      out.push('<section class="pw-card"><div class="pw-card-h"><b>开试</b></div>'
        + '<div class="pw-quiet">' + (aiOn ? 'AI 会像学员一样只读题面作答，并报告「条件不足/多个都对/表述含糊」三类问题。'
          : '未配置 AI：试做退回<b>自检清单</b>（确定性 lint 已在出题台实时把关），配置后可获得「被学员做错」的宝贵反馈。') + '</div>'
        + '<div class="pw-acts"><button class="pw-btn primary" data-act="trial-run">' + I('robot') + (aiOn ? '开始试做' : '走自检清单') + '</button></div></section>')
      return out.join('')
    }
    let r = S.trialResult
    let v = scoreTrial(q0, r.trial)
    out.push('<section class="pw-card"><div class="pw-card-h"><b>试做结果</b><em>' + fmtTime(r.at || Date.now()) + '</em></div>')
    if (r.offline) {
      out.push('<div class="pw-verdict"><b>自检清单模式（未配置 AI）</b><br>'
        + '· 确定性 lint：' + (r.lintOk ? '通过——结构上站得住' : '有硬伤，先修') + '<br>'
        + '· 请自问：四个选项里，每个错误选项「错在哪」你能一句话说清吗？<br>'
        + '· 请自问：把题干给同学读一遍，他会误选哪个？——那就是你的陷阱在工作。</div>')
    } else {
      out.push('<div class="pw-trial">'
        + '<div class="pw-dim"><b>' + v.rigor + '</b><span>严谨度（答案唯一）</span><div class="pw-gauge"><i style="width:' + v.rigor + '%"></i></div></div>'
        + '<div class="pw-dim"><b>' + v.completeness + '</b><span>完备性（条件够吗）</span><div class="pw-gauge"><i style="width:' + v.completeness + '%"></i></div></div>'
        + '<div class="pw-dim"><b>' + v.discrim + '</b><span>区分度（陷阱咬人吗）</span><div class="pw-gauge"><i style="width:' + v.discrim + '%"></i></div></div>'
        + '</div>')
      out.push('<div class="pw-verdict ' + (v.verdict === '干净' ? 'clean' : 'revise') + '">'
        + '<b>AI 选了 ' + 'ABCDEFGH'[clamp(num(r.trial.pick, 0), 0, 7)] + '，你标的答案是 ' + 'ABCDEFGH'[q0.answer] + '</b>'
        + (r.trial.reason ? '<br>AI 思路：' + esc(trunc(flat(r.trial.reason), 160)) : '')
        + (v.blockers.length ? '<br>' + v.blockers.map(esc).join('<br>') : '<br>判定：题面干净，可以入库。')
        + '</div>')
      if (r.trial.ambiguities && r.trial.ambiguities.length) {
        out.push('<div class="pw-quiet" style="margin-top:8px">歧义报告：' + r.trial.ambiguities.map(function (x) { return esc(trunc(flat(x), 60)) }).join('；') + '</div>')
      }
    }
    out.push('<div class="pw-acts">'
      + '<button class="pw-btn" data-act="trial-again">' + I('up') + '再试一次</button>'
      + '<button class="pw-btn primary" data-act="bank-q"' + (v && v.verdict === '干净' || r.offline ? '' : ' disabled title="先消除歧义"') + '>' + I('archive') + '合格，入站内题库</button>'
      + '</div>')
    out.push('<div class="pw-quiet" style="margin-top:8px">入库去向：站内公共题库（与收藏的题同一池子）——决斗场、组卷都会抽到它；'
      + '可在「我的题」里撤回（只撤未做对的，做过即成为你的历史数据）。</div>')
    out.push('</section>')
    return out.join('')
  }

  function viewVault(ctx, S) {
    let list = S.list
    let out = []
    out.push('<section class="pw-card"><div class="pw-card-h"><b>我的题</b><em>' + list.length + ' 道 · 上限 ' + Q_MAX + '</em></div>')
    if (!list.length) {
      out.push('<div class="pw-empty"><span class="ico">' + I('archive') + '</span><b>还没有自己的题</b>去出题台写第一道——哪怕是一道 30 秒的送分题，走完「试做→入库」全流程，你就懂了出题人的思维。</div></section>')
      return out.join('')
    }
    /* 分片：首屏 BANK_PAGE 行 + 逐帧补尾（大档案不卡；≤一页时零分片，行为与旧版一致） */
    let head = list.slice(0, BANK_PAGE)
    out.push('<div data-pw="qlist">' + head.map(rowHTML).join('')
      + (list.length > BANK_PAGE ? '<span data-pw-vtail style="display:none"></span>' : '') + '</div>')
    out.push('</section>')
    return out.join('')
  }
  function rowHTML(x) {
    let st = x.status === 'banked' ? '<span class="pw-st banked">已入库</span>' : (x.status === 'ok' ? '<span class="pw-st ok">试做通过</span>' : '<span class="pw-st draft">草稿</span>')
    let dots = x.options.map(function (o, i) { return '<span class="pw-dot' + (i === x.answer ? ' on' : '') + '" title="' + esc(o.text) + '"></span>' }).join('')
    return '<div class="pw-qrow" data-id="' + esc(x.id) + '">'
      + '<div class="pw-qmain"><b>' + esc(trunc(x.stem, 46)) + '</b>'
      + '<span>' + esc(x.subject || '未标学科') + ' · ' + (x.diff === 1 ? '简单' : x.diff === 3 ? '硬' : '中') + ' · ' + fmtTime(x.createdAt)
      + (x.trial ? ' · 试做：' + esc(x.trial.verdict) : '') + '</span></div>'
      + '<div class="pw-dots">' + dots + '</div>'
      + st
      + '<button class="pw-btn sm" data-act="edit-q" data-id="' + esc(x.id) + '">改</button>'
      + (x.status === 'draft' ? '<button class="pw-btn sm" data-act="trial-q" data-id="' + esc(x.id) + '">试做</button>' : '')
      + (x.status === 'ok' ? '<button class="pw-btn sm primary" data-act="bank-q2" data-id="' + esc(x.id) + '">入库</button>' : '')
      + (x.status === 'banked' ? '<button class="pw-btn sm ghost" data-act="revoke-q" data-id="' + esc(x.id) + '">撤回</button>' : '')
      + '<button class="pw-btn sm ghost" data-act="del-q" data-id="' + esc(x.id) + '" title="删除">' + I('trash') + '</button>'
      + '</div>'
  }

  function viewStats(ctx, S) {
    let st = statsOf(S.list)
    let out = []
    out.push('<section class="pw-card"><div class="pw-card-h"><b>出题档案</b><em>出题水平的镜子：AI 做错率越高，说明你越会设陷阱</em></div>')
    if (!st) {
      out.push('<div class="pw-empty"><span class="ico">' + I('chart') + '</span><b>还没有数据</b>出第一道题并试做，这里就有账。</div></section>')
      return out.join('')
    }
    out.push('<div class="pw-statgrid">'
      + '<div class="pw-stat"><b>' + st.n + '</b><span>累计出题</span></div>'
      + '<div class="pw-stat"><b>' + st.trialRate + '%</b><span>送过试做的比例</span></div>'
      + '<div class="pw-stat"><b>' + (st.cleanRate == null ? '—' : st.cleanRate + '%') + '</b><span>试做干净率</span></div>'
      + '<div class="pw-stat"><b>' + (st.aiWrongRate == null ? '—' : st.aiWrongRate + '%') + '</b><span>AI 做错率（越高你越狠）</span></div>'
      + '<div class="pw-stat"><b>' + (st.trapHitRate == null ? '—' : st.trapHitRate + '%') + '</b><span>陷阱咬中率</span></div>'
      + '<div class="pw-stat"><b>' + st.banked + '</b><span>已入公共题库</span></div>'
      + '</div>')
    let subs = Object.keys(st.bySubject)
    if (subs.length) {
      out.push('<div style="margin-top:14px" class="pw-quiet">学科覆盖：' + subs.map(function (s) { return esc(s) + ' ' + st.bySubject[s] + ' 道' }).join('　·　') + '</div>')
    }
    let tips = []
    if (st.trialRate < 40) tips.push('多数题没试过做——试做是出题家的「编译检查」，别省。')
    if (st.aiWrongRate != null && st.aiWrongRate > 40) tips.push('AI 做错率 ' + st.aiWrongRate + '%：陷阱设计很有一手，保持这个狠劲。')
    if (st.aiWrongRate != null && st.aiWrongRate < 10 && st.n >= 5) tips.push('AI 几乎不做错：干扰项可能太「一眼假」。错误项要错得像对的。')
    if (st.banked === 0 && st.n >= 3) tips.push('还没有题入公共题库——走完一次「试做→入库」，你的题就会被决斗场抽走考别人（也考你自己）。')
    if (tips.length) out.push('<div class="pw-verdict" style="margin-top:12px"><b>教练判词</b><br>' + tips.map(esc).join('<br>') + '</div>')
    out.push('</section>')
    return out.join('')
  }

  function viewSetup(ctx, S) {
    let out = []
    out.push('<section class="pw-card"><div class="pw-card-h"><b>数据</b><em>题目档案在浏览器本地 + 站内云同步；公共题库是全站资产</em></div>')
    out.push('<div class="pw-acts">'
      + '<button class="pw-btn" data-act="export">' + I('down') + '导出我的题 JSON</button>'
      + '<button class="pw-btn ghost" data-act="import">' + I('up') + '导入</button>'
      + '<button class="pw-btn ghost" data-act="wipe">' + I('trash') + '清空我的题</button></div>')
    out.push('<div class="pw-quiet" style="margin-top:10px">清空只删本插件档案；已入公共题库的题<b>不会</b>自动删除（那是公共资产，去站内题库管理页处理）。'
      + '建议清空前先导出。</div>')
    out.push('</section>')
    out.push('<section class="pw-card"><div class="pw-card-h"><b>快捷键</b><em>键盘党</em></div><div class="pw-keys">'
      + '<div class="pw-keyrow"><span class="pw-keycap">N</span>新题</div>'
      + '<div class="pw-keyrow"><span class="pw-keycap">1-5</span>切换视图</div>'
      + '<div class="pw-keyrow"><span class="pw-keycap">Ctrl+Enter</span>保存草稿</div>'
      + '</div></section>')
    out.push('<section class="pw-card"><div class="pw-card-h"><b>方法论</b><em>为什么出题是更狠的复习</em></div>'
      + '<div class="pw-quiet">能认出正确答案，是「会做」；能设计出<b>让别人选错</b>的干扰项，才知道概念的边界在哪。'
      + '错误选项不是凑数的——每一个都该是一种真实错误路径的画像（漏乘、符号反、概念混、条件缺）。'
      + 'AI 试做是你的第一读者：它做错，说明陷阱成立；它指出歧义，说明你比知识点更早发现了思维的裂缝。'
      + '<br>闭环：出题 → 试做 → 入库 → 决斗场抽到它 → 你自己答错 → 进你的错题本。出题家把「教」和「学」接成了环。</div></section>')
    return out.join('')
  }

  /* ════════════════════════ 7. 挂载 ════════════════════════ */

  let VIEWS = [
    { k: 'bench', t: '出题台', ic: 'pen', n: '出题台' },
    { k: 'trial', t: '试做', ic: 'robot', n: 'AI 试做' },
    { k: 'vault', t: '我的题', ic: 'archive', n: '我的题库' },
    { k: 'stats', t: '档案', ic: 'chart', n: '出题档案' },
    { k: 'setup', t: '设置', ic: 'gear', n: '设置与数据' },
  ]

  /* 【2026-11-12 协议合规】config 声明了就必须消费:defaultSubject 旧版从未读取,
   * 用户在插件中心填了「默认为新题填的学科」永远无效。blankDraft 现在吃 ctx。 */
  function blankDraft(ctx) {
    let subj = ''
    try { subj = String(ctx && ctx.config ? ctx.config('defaultSubject') || '' : '').slice(0, 20) } catch (e) { }
    return { id: '', stem: '', options: [{ id: 'o0', text: '' }, { id: 'o1', text: '' }, { id: 'o2', text: '' }, { id: 'o3', text: '' }], answer: 0, solutions: [{ id: 's0', text: '' }, { id: 's1', text: '' }, { id: 's2', text: '' }, { id: 's3', text: '' }], trap: '', subject: subj, diff: 2 }
  }

  /* 能力面在载入时就要落地（init 与 mount 共用，全部幂等）：
   * 浮窗面板不等工具页被打开——只在 mount 注皮肤的话，面板首开就是裸文字
   * （2026-11-12 巡检抓到；fv/sf/vf/fx/er 五插件把 CSS 放 manifest.css 正是为此）。 */
  function bootSurfaces(ctx) {
    try { window.__PW_HOST_CTX = ctx; injectStyles() } catch (e) { }
    try {
      if (ctx.ai && typeof ctx.ai.registerCtx === 'function') {
        ctx.ai.registerCtx({ ctx: AI_CTX_TRIAL, name: '出题家 · AI 试做', desc: '盲做用户出的单选题并报告歧义/多解/条件不足（只看题面，保守诚实）', def: 'think', latexNeed: true, tools: 'none', recall: false })
        ctx.ai.registerCtx({ ctx: AI_CTX_JUDGE, name: '出题家 · 判分', desc: '把学员答案对到采分点上判命中/半对/漏（读不懂就写无法判断，不许抬分）', def: 'think', latexNeed: true, tools: 'none', recall: false })
      }
    } catch (e) { }
  }

  function mountShell(el, ctx) {
    bootSurfaces(ctx)
    let S = {
      view: 'bench',
      list: [],
      draft: blankDraft(ctx),
      mistakes: [],
      trialId: '',
      trialBusy: false,
      trialResult: null,
      enterT: 0,
      tailRaf: 0,
    }
    S.list = listGet(ctx)
    try {
      let v = ctx.data('pwView')
      for (let i = 0; i < VIEWS.length; i++) if (VIEWS[i].k === v) S.view = v
    } catch (e) { }
    /* 借灵感源：站内错题 */
    try {
      let st = ctx.Store && ctx.Store.get ? ctx.Store.get() : null
      let mks = (st && Array.isArray(st.mistakes)) ? st.mistakes : []
      S.mistakes = mks.filter(function (m) { return m && (m.stem || m.desc) }).slice(0, 20)
    } catch (e) { S.mistakes = [] }
    /* 草稿恢复 */
    try {
      let d = ctx.keep.get(KEEP_DRAFT, null)
      if (d && typeof d === 'object' && (flat(d.stem) || (d.options || []).some(function (o) { return o && o.text }))) S.draft = d
    } catch (e) { }
    if (!S.list.filter(function (x) { return x.id === S.trialId })[0]) S.trialId = (S.list[0] || {}).id || ''

    let root = document.createElement('div')
    root.className = 'pw-root'
    el.appendChild(root)
    let stageEl = null, dockEl = null, dockInd = null, heroEl = null
    let lastView = ''

    function paint() {
      let html = ''
      if (S.view === 'bench') html = viewBench(ctx, S)
      else if (S.view === 'trial') html = viewTrial(ctx, S)
      else if (S.view === 'vault') html = viewVault(ctx, S)
      else if (S.view === 'stats') html = viewStats(ctx, S)
      else html = viewSetup(ctx, S)
      root.innerHTML = heroHTML(S) + '<main class="pw-stage">' + html + '</main>'
        + '<div class="pw-dockwrap"><nav class="pw-dock" aria-label="插件导航"><i class="pw-dock-ind"></i>'
        + VIEWS.map(function (v) {
          return '<button class="pw-dock-item" data-view="' + v.k + '" title="' + v.n + '">' + I(v.ic) + '<em>' + v.t + '</em></button>'
        }).join('') + '</nav></div>'
      heroEl = root.querySelector('.pw-hero')
      stageEl = root.querySelector('.pw-stage')
      dockEl = root.querySelector('.pw-dock')
      dockInd = root.querySelector('.pw-dock-ind')
      syncDock()
      /* 【2026-11-12 用户报修：点一个按钮整页重建一次】进场动画原来每次 paint 都重放。
       * duel 同款门控：只在视图真正切换（含首挂）时打进场标记。 */
      if (S.view !== lastView) { lastView = S.view; markEnter() }
      scheduleVaultTail()
    }
    function markEnter() {
      root.classList.add('pw-enter')
      if (S.enterT) clearTimeout(S.enterT)
      S.enterT = setTimeout(function () { if (root) root.classList.remove('pw-enter') }, 900)
    }
    function syncDock() {
      if (!dockEl) return
      let items = dockEl.querySelectorAll('.pw-dock-item')
      for (let i = 0; i < items.length; i++) {
        let on = items[i].getAttribute('data-view') === S.view
        items[i].classList.toggle('on', on)
        /* 【2026-11-12 巡检实测：指示器恒偏左 6px】同 pd：位移 = offsetLeft - 指示器 left 基位。 */
        if (on && dockInd) {
          let baseLeft = parseFloat(getComputedStyle(dockInd).left) || 0
          dockInd.style.transform = 'translateX(' + (items[i].offsetLeft - baseLeft) + 'px)'
          dockInd.style.width = items[i].offsetWidth + 'px'
        }
      }
    }
    function go(k) {
      if (S.view === k) return
      S.view = k
      S.trialBusy = false
      try { ctx.data('pwView', k) } catch (e) { }
      paint()
      try { window.scrollTo({ top: 0, behavior: 'smooth' }) } catch (e) { }
    }
    function toast(m, lv) { try { ctx.Toast.show(m, lv || 'info', 2600) } catch (e) { } }

    /* —— 分片尾（vault）：每帧补 36 行，≤一页时不触发 —— */
    function scheduleVaultTail() {
      if (S.tailRaf) { try { cancelAnimationFrame(S.tailRaf) } catch (e) { } S.tailRaf = 0 }
      if (S.view !== 'vault') return
      let marker = stageEl && stageEl.querySelector('[data-pw-vtail]')
      if (!marker) return
      let rest = S.list.slice(BANK_PAGE)
      let idx = 0
      let run = function () {
        S.tailRaf = 0
        if (!marker.isConnected) return
        let take = rest.slice(idx, idx + 36)
        idx += take.length
        if (take.length) { try { marker.insertAdjacentHTML('beforebegin', take.map(rowHTML).join('')) } catch (e) { return } }
        if (idx < rest.length) S.tailRaf = requestAnimationFrame(run)
        else { try { marker.remove() } catch (e) { } }
      }
      S.tailRaf = requestAnimationFrame(run)
    }

    /* —— 草稿持久化（防抖 300ms，输入不触发重绘） —— */
    let draftT = 0
    function persistDraft() {
      if (draftT) clearTimeout(draftT)
      draftT = setTimeout(function () {
        try { ctx.keep.set(KEEP_DRAFT, S.draft) } catch (e) { }
      }, 300)
    }
    function clearDraftKeep() { try { ctx.keep.set(KEEP_DRAFT, null) } catch (e) { } }

    /* —— 输入：只改数据，绝不整屏重绘（光标保位）；结构变化才 paint —— */
    function onInput(e) {
      let t = e.target
      if (!t || !t.getAttribute) return
      let f = t.getAttribute('data-pw')
      if (!f) return
      if (f === 'stem') { S.draft.stem = t.value.slice(0, STEM_MAX); persistDraft(); softLintRefresh() }
      else if (f === 'opt') { let i = num(t.getAttribute('data-i'), -1); if (S.draft.options[i]) { S.draft.options[i].text = t.value.slice(0, OPT_MAX); persistDraft(); softLintRefresh() } }
      /* 解析也影响硬伤（「正确项没有解析」）——不刷新的话，用户最后填解析时
       * lint 面板与保存/试做按钮的禁用态全停在旧值，明明填好了还点不动（真机截图抓到） */
      else if (f === 'sol') { let i = num(t.getAttribute('data-i'), -1); if (S.draft.solutions[i]) { S.draft.solutions[i].text = t.value.slice(0, OPT_MAX); persistDraft(); softLintRefresh() } }
      else if (f === 'trap') { S.draft.trap = t.value.slice(0, 200); persistDraft() }
      else if (f === 'subject') { S.draft.subject = t.value.slice(0, 20); persistDraft() }
      else if (f === 'diff') { S.draft.diff = clamp(num(t.value, 2), 1, 3); persistDraft() }
    }
    /* lint 结果实时刷新：只替换 lint 面板，不动输入焦点 */
    function softLintRefresh() {
      let box = stageEl && stageEl.querySelector('.pw-fld') ? stageEl : null
      if (!box) return
      let old = stageEl.querySelectorAll('.pw-lint')
      old.forEach(function (n) { n.remove() })
      let lint = lintQuestion({ stem: S.draft.stem, options: S.draft.options.map(function (o) { return o.text }), answer: S.draft.answer, solutions: S.draft.solutions })
      let acts = stageEl.querySelector('.pw-acts')
      if (!acts) return
      let html = ''
      if (flat(S.draft.stem) || S.draft.options.some(function (o) { return o.text })) {
        if (!lint.ok) html += '<div class="pw-lint hard"><b>硬伤（修完才能保存/入库）</b><ul>' + lint.hard.map(function (x) { return '<li>' + esc(x) + '</li>' }).join('') + '</ul></div>'
        if (lint.soft.length) html += '<div class="pw-lint soft"><b>出题手艺提醒</b><ul>' + lint.soft.map(function (x) { return '<li>' + esc(x) + '</li>' }).join('') + '</ul></div>'
      }
      if (html) acts.insertAdjacentHTML('beforebegin', html)
      let sv = stageEl.querySelector('[data-act="save-q"]'), tr = stageEl.querySelector('[data-act="trial"]')
      if (sv) sv.disabled = !lint.ok
      if (tr) tr.disabled = !lint.ok
    }
    function onChange(e) {
      let t = e.target
      if (t && t.getAttribute && t.getAttribute('data-act') === 'set-ans') {
        S.draft.answer = clamp(num(t.getAttribute('data-i'), 0), 0, S.draft.options.length - 1)
        persistDraft()
        paint()   /* 正确答案变了：解析占位文案要跟着变，重绘可接受（radio 不是文本输入） */
      }
    }

    /* —— 保存 / 试做 / 入库 —— */
    function saveDraft() {
      let lint = lintQuestion({ stem: S.draft.stem, options: S.draft.options.map(function (o) { return o.text }), answer: S.draft.answer, solutions: S.draft.solutions })
      if (!lint.ok) { toast('先修掉硬伤：' + lint.hard[0], 'warn'); return null }
      let keep = S.draft
      let q = normQ({
        id: keep.id || ('pw-' + Date.now().toString(36)),
        stem: keep.stem, options: keep.options, answer: keep.answer,
        solutions: keep.solutions.filter(function (s) { return s.text }),
        trap: keep.trap, subject: keep.subject, diff: keep.diff,
        status: 'draft', createdAt: keep.createdAt || Date.now(),
      })
      if (!q) { toast('题目结构不完整', 'danger'); return null }
      let idx = -1
      S.list.forEach(function (x, i) { if (x.id === q.id) idx = i })
      if (idx >= 0) { q.trial = S.list[idx].trial; q.bankedAt = S.list[idx].bankedAt; q.bankRef = S.list[idx].bankRef; q.status = S.list[idx].status; S.list[idx] = q }
      else S.list = [q].concat(S.list)
      listSave(ctx, S.list)
      clearDraftKeep()
      S.draft = blankDraft(ctx)
      S.trialId = q.id
      toast('已保存：' + trunc(q.stem, 24), 'success')
      paint()
      return q
    }
    function runTrial() {
      let q0 = S.list.filter(function (x) { return x.id === S.trialId })[0]
      if (!q0) { toast('先保存题目再试做', 'warn'); return }
      if (!(ctx.ai && ctx.ai.has && ctx.ai.has())) {
        let lint = lintQuestion({ stem: q0.stem, options: q0.options.map(function (o) { return o.text }), answer: q0.answer, solutions: q0.solutions })
        S.trialResult = { offline: true, lintOk: lint.ok, trial: { pick: q0.answer, ambiguities: lint.soft }, at: Date.now() }
        paint()
        return
      }
      S.trialBusy = true
      paint()
      let sys = '你是被抽查的考研学员，正在盲做一道单选题（你看不到答案与解析）。'
        + '第一步：只根据题面独立作答，给出选项下标 pick（0=A,1=B,2=C,3=D）。'
        + '第二步：诚实报告题面问题 ambiguities——「条件不足」「存在多个都说得通」「表述有歧义」「干扰项一眼假」四类，没有就空数组。'
        + '输出 JSON：{"pick":0,"reason":"≤60字思路","ambiguities":["…"]}'
      let usr = JSON.stringify({ stem: q0.stem, options: q0.options.map(function (o, i) { return 'ABCDEFGH'[i] + '. ' + o.text }) })
      ctx.ai.json(sys, usr, { ctx: AI_CTX_TRIAL, timeout: 90000 }).then(function (o) {
        let pick = clamp(num(o && o.pick, -1), -1, q0.options.length - 1)
        if (pick < 0) throw new Error('AI 没给出选项')
        let trial = { pick: pick, reason: flat(o.reason || ''), ambiguities: Array.isArray(o.ambiguities) ? o.ambiguities : [], cannotAnswer: false, trapTriggered: pick !== q0.answer }
        let v = scoreTrial(q0, trial)
        /* 落库到题目上 */
        S.list.forEach(function (x) { if (x.id === q0.id) { x.trial = v; if (v.verdict === '干净' && x.status === 'draft') x.status = 'ok' } })
        listSave(ctx, S.list)
        S.trialBusy = false
        S.trialResult = { trial: trial, at: Date.now() }
        paint()
      }).catch(function (err) {
        S.trialBusy = false
        S.trialResult = null
        toast('AI 试做失败：' + trunc(String(err && err.message || err), 30) + '——已退回自检清单', 'warn')
        let lint = lintQuestion({ stem: q0.stem, options: q0.options.map(function (o) { return o.text }), answer: q0.answer, solutions: q0.solutions })
        S.trialResult = { offline: true, lintOk: lint.ok, trial: { pick: q0.answer, ambiguities: lint.soft }, at: Date.now() }
        paint()
      })
    }
    function bankQ(q0) {
      if (!q0) return
      if (q0.status === 'banked') { toast('这道题已经在公共题库里了', 'info'); return }
      let clean = q0.trial && q0.trial.verdict === '干净'
      /* 【2026-11-12 协议合规】config trialStrict 声明了就必须生效:
       * 开启后未通过 AI 试做的题直接拦下入库(公共池质量闸)。 */
      let strict = false
      try { strict = ctx.config('trialStrict') === true } catch (e) { }
      if (strict && !clean) { toast('已开启「入库前必须通过 AI 试做」——先试做再入库', 'warn'); return }
      ctx.api.confirm(
        '把这道题放进站内公共题库？',
        '<div class="pw-quiet">放进去之后，<b>决斗场、组卷、变式工厂</b>都可能抽到这道题（它成为全站资产，不再只属于你）。'
        + (clean ? 'AI 试做判定：干净，可以放。<br>' : '注意：这道题还没通过 AI 试做，等于没编译就发布——建议先试做。<br>')
        + '随时可在「我的题」撤回（撤回只影响后续抽题，已被做对的题成为历史数据保留）。</div>',
        function () {
          let letter = 'ABCDEFGH'[q0.answer]
          let sol = q0.solutions.filter(function (s) { return s.text })
          let rec = {
            id: 'pw-' + hashStr(q0.id).toString(36),
            stem: q0.stem,
            type: 'choice',
            options: q0.options.map(function (o) { return o.text }),
            answer: letter,
            solution: (sol.length ? sol.map(function (s) { return s.text }).join('；') : ''),
            trap: q0.trap || '',
            subject: q0.subject || '',
            topicName: '出题家·' + (q0.subject || '自建'),
            diff: q0.diff === 1 ? 'easy' : q0.diff === 3 ? 'hard' : 'medium',
            savedAt: new Date().toISOString(),
            source: 'prof-workshop',
            note: '由「出题家」质检入库' + (q0.trial ? '（AI 试做：' + q0.trial.verdict + '）' : ''),
          }
          try {
            ctx.Store.update(function (st) {
              st.quizBank = Array.isArray(st.quizBank) ? st.quizBank : []
              if (st.quizBank.some(function (x) { return x && x.id === rec.id })) return
              st.quizBank.unshift(rec)
            })
          } catch (e) { toast('入库失败：站内题库不可写', 'danger'); return }
          S.list.forEach(function (x) { if (x.id === q0.id) { x.status = 'banked'; x.bankedAt = Date.now(); x.bankRef = rec.id } })
          listSave(ctx, S.list)
          toast('已入站内公共题库——决斗场现在能抽到它了', 'success')
          paint()
        },
        false
      )
    }
    function revokeQ(q0) {
      if (!q0 || !q0.bankRef) return
      ctx.api.confirm('从公共题库撤回这道题？', '<div class="pw-quiet">撤回后新的抽题不会再遇到它；已被别人/你做对的记录作为历史保留，不伪造删除。你本地的这道题会回到「试做通过」状态，可再次入库。</div>', function () {
        try {
          ctx.Store.update(function (st) {
            if (Array.isArray(st.quizBank)) st.quizBank = st.quizBank.filter(function (x) { return !x || x.id !== q0.bankRef })
          })
        } catch (e) { }
        S.list.forEach(function (x) { if (x.id === q0.id) { x.status = 'ok'; x.bankedAt = 0; x.bankRef = '' } })
        listSave(ctx, S.list)
        toast('已撤回', 'success')
        paint()
      }, false)
    }

    /* —— 点击委托 —— */
    function onClick(e) {
      let t = e.target
      let dockBtn = t.closest ? t.closest('.pw-dock-item') : null
      if (dockBtn) { go(dockBtn.getAttribute('data-view')); return }
      let a = t.closest ? t.closest('[data-act]') : null
      if (!a) return
      let act = a.getAttribute('data-act')
      if (act === 'newq') { S.draft = blankDraft(ctx); S.view = 'bench'; paint(); return }
      if (act === 'add-opt') {
        if (S.draft.options.length < 4) {
          S.draft.options.push({ id: 'o' + S.draft.options.length, text: '' })
          S.draft.solutions.push({ id: 's' + S.draft.solutions.length, text: '' })
          persistDraft(); paint()
        }
        return
      }
      if (act === 'del-opt') {
        let i = num(a.getAttribute('data-i'), -1)
        if (i >= 0 && S.draft.options.length > 2) {
          S.draft.options.splice(i, 1)
          S.draft.solutions.splice(i, 1)
          if (S.draft.answer >= S.draft.options.length) S.draft.answer = S.draft.options.length - 1
          persistDraft(); paint()
        }
        return
      }
      if (act === 'save-q') { saveDraft(); return }
      if (act === 'trial') { let q = saveDraft(); if (q) { S.trialId = q.id; S.trialResult = null; go('trial'); runTrial() } return }
      if (act === 'trial-run') { runTrial(); return }
      if (act === 'trial-again') { S.trialResult = null; runTrial(); return }
      if (act === 'inspire') {
        let m = S.mistakes[num(a.getAttribute('data-i'), 0)]
        if (m) {
          S.draft = blankDraft(ctx)
          S.draft.stem = flat(m.stem || m.desc)
          S.draft.subject = flat(m.subject || '')
          toast('已借入题干——把答案改成你的新问法，重设干扰项', 'info')
          paint()
        }
        return
      }
      if (act === 'edit-q') {
        let x = S.list.filter(function (y) { return y.id === a.getAttribute('data-id') })[0]
        if (!x) return
        S.draft = {
          id: x.id, stem: x.stem,
          options: x.options.map(function (o) { return { id: o.id, text: o.text } }),
          answer: x.answer,
          solutions: x.options.map(function (o, i) { return { id: 's' + i, text: (x.solutions[i] && x.solutions[i].text) || '' } }),
          trap: x.trap || '', subject: x.subject || '', diff: x.diff, createdAt: x.createdAt,
        }
        S.view = 'bench'
        paint()
        return
      }
      if (act === 'edit-cancel') { S.draft = blankDraft(ctx); clearDraftKeep(); paint(); return }
      if (act === 'trial-q') { S.trialId = a.getAttribute('data-id'); S.trialResult = null; go('trial'); return }
      if (act === 'bank-q') { bankQ(S.list.filter(function (x) { return x.id === S.trialId })[0]); return }
      if (act === 'bank-q2') { bankQ(S.list.filter(function (x) { return x.id === a.getAttribute('data-id') })[0]); return }
      if (act === 'revoke-q') { revokeQ(S.list.filter(function (x) { return x.id === a.getAttribute('data-id') })[0]); return }
      if (act === 'del-q') {
        let id = a.getAttribute('data-id')
        let x = S.list.filter(function (y) { return y.id === id })[0]
        if (!x) return
        ctx.api.confirm('删除这道题？', '<div class="pw-quiet">本地档案删除这道题' + (x.status === 'banked' ? '；<b>已入公共题库的副本不随之删除</b>（公共资产请走撤回）' : '') + '。不可恢复，可先导出备份。</div>', function () {
          S.list = listSave(ctx, S.list.filter(function (y) { return y.id !== id }))
          toast('已删除', 'success')
          paint()
        }, true)
        return
      }
      if (act === 'export') {
        try { ctx.api.download('出题家-我的题.json', JSON.stringify({ v: 1, questions: S.list }, null, 2), 'application/json') } catch (e) { toast('导出失败', 'danger') }
        return
      }
      if (act === 'import') {
        try {
          ctx.api.readFile('application/json').then(function (txt) {
            let arr = []
            try { let o = JSON.parse(txt); arr = Array.isArray(o) ? o : (o && Array.isArray(o.questions) ? o.questions : []) } catch (e2) { }
            let add = arr.map(normQ).filter(Boolean)
            if (!add.length) { toast('文件里没有可识别的题目', 'warn'); return }
            let have = {}
            S.list.forEach(function (x) { have[x.id] = 1 })
            let fresh = add.filter(function (x) { return !have[x.id] })
            S.list = listSave(ctx, fresh.concat(S.list))
            toast('导入 ' + fresh.length + ' 道（跳过重复 ' + (add.length - fresh.length) + '）', 'success')
            paint()
          }).catch(function () { })
        } catch (e) { toast('导入不可用', 'danger') }
        return
      }
      if (act === 'wipe') {
        ctx.api.confirm('清空我的题目？', '<div class="pw-quiet">将删除本地档案里全部 <b>' + S.list.length + '</b> 道题，<b>不可恢复</b>（建议先导出）。已入公共题库的副本不受影响。</div>', function () {
          S.list = listSave(ctx, [])
          S.trialId = ''
          S.trialResult = null
          toast('已清空', 'success')
          paint()
        }, true)
        return
      }
    }

    function onKey(e) {
      if (document.querySelector('.pw-modal, #modal-overlay')) return
      let typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || '')
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { if (S.view === 'bench') { e.preventDefault(); saveDraft() } return }
      if (typing) return
      if (e.key >= '1' && e.key <= '5') { let v = VIEWS[num(e.key, 1) - 1]; if (v) { e.preventDefault(); go(v.k) } return }
      if (e.key === 'n' || e.key === 'N') { e.preventDefault(); S.draft = blankDraft(ctx); S.view = 'bench'; paint() }
    }
    function onScroll() { if (heroEl) heroEl.classList.toggle('stuck', window.scrollY > 6) }
    function onResize() { syncDock() }

    root.addEventListener('click', onClick)
    root.addEventListener('input', onInput)
    root.addEventListener('change', onChange)
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    paint()
    /* AI 场景登记已挪进 bootSurfaces（init/mount 共用，见 §皮肤注入旁） */

    return function destroy() {
      if (S.enterT) clearTimeout(S.enterT)
      if (draftT) clearTimeout(draftT)
      if (S.tailRaf) { try { cancelAnimationFrame(S.tailRaf) } catch (e) { } S.tailRaf = 0 }
      persistDraft()
      root.removeEventListener('click', onClick)
      root.removeEventListener('input', onInput)
      root.removeEventListener('change', onChange)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      try { let st = document.getElementById(STYLE_ID); if (st) st.remove() } catch (e) { }
      root.remove()
      window.__PW_HOST_CTX = null
    }
  }

  /* ════════════════════════ 8. manifest ════════════════════════ */

  let api = {
    id: T_MAIN,
    name: '出题家',
    version: VERSION,
    author: 'kaoyan-v2',
    desc: '学生变出题人：写题（选项/逐项解析/陷阱设计）→ 确定性 lint 实时把关 → AI 盲做试做（严谨/完备/区分三维判分，歧义当场报）'
      + '→ 合格的题一键入站内公共题库，被决斗场/组卷抽走，甚至回流成你的错题——出题是 Bloom 塔尖的复习。未配置 AI 走自检清单，功能不残缺。',
    tools: [{ id: T_MAIN, title: '出题家', icon: MARK_ICON, mount: mountShell }],
    init: function (ctx) { bootSurfaces(ctx) },
    /* 【2026-11-12 协议合规】补齐能力面:shortcuts + panels,与站内六大插件同构。 */
    shortcuts: [
      {
        key: 'alt+c', label: '直达出题家',
        run: function (ctx) {
          try {
            if (ctx && ctx.api && ctx.api.goTool) ctx.api.goTool(T_MAIN)
            else if (window.App) window.App.go(T_MAIN)
          } catch (e) { }
        },
      },
    ],
    panels: [
      {
        id: 'pw-stock', title: '出题家 · 库存', icon: MARK_ICON, width: 300, height: 240,
        render: function (ctx) {
          let list = listGet(ctx)
          let st = statsOf(list)
          let out = ['<div class="pw-panel">']
          out.push('<div class="pw-panel-kpis">'
            + '<div><b>' + (st ? st.n : 0) + '</b><span>我的题</span></div>'
            + '<div><b>' + (st ? st.banked : 0) + '</b><span>已入库</span></div>'
            + '<div><b>' + (st && st.aiWrongRate != null ? st.aiWrongRate + '%' : '—') + '</b><span>AI 做错率</span></div></div>')
          if (!list.length) out.push('<div class="pw-panel-empty">还没有出自己的题。第一道哪怕送分题，走完「试做→入库」就懂出题人的思维。</div>')
          else {
            out.push('<div class="pw-panel-list">')
            for (let i = 0; i < Math.min(4, list.length); i++) {
              let x = list[i]
              let tag = x.status === 'banked' ? '<i class="ok">已入库</i>' : (x.status === 'ok' ? '<i class="ok">试做通过</i>' : '<i class="warn">草稿</i>')
              out.push('<div class="pw-panel-row"><span>' + esc(trunc(x.stem, 20)) + '</span>' + tag + '</div>')
            }
            out.push('</div>')
          }
          out.push('</div>')
          return out.join('')
        },
      },
    ],
    config: [
      { key: 'defaultSubject', label: '默认为新题填的学科', type: 'text', default: '' },
      { key: 'trialStrict', label: '入库前必须通过 AI 试做', type: 'bool', default: false },
    ],
    hooks: {
      quizDone: function (ctx) {
        try {
          let k = ctx.keep.get('pwNudgeDay')
          let tk = dkey()
          if (k === tk) return
          let st = statsOf(listGet(ctx))
          if (st && st.n >= 3) return
          ctx.keep.set('pwNudgeDay', tk)
          if (typeof ctx.notify === 'function') {
            ctx.notify({ title: '刚做错题——不如把它反过来出一道题？', body: '出题家：你错过的地方，就是别人最该被考到的地方。', level: 'info', timeout: 10000, onClick: function () { ctx.api.goTool(T_MAIN) } })
          }
        } catch (e) { }
      },
    },
    memory: '用户装有「出题家」插件：把学生变成出题人，出的题经 AI 试做质检后可入站内公共题库被决斗场/组卷抽取。'
      + '当用户说「这道题我会但讲不清」「概念总是混」时，建议他给这个概念出一道辨析题（错误项就是他的混淆路径）；'
      + '当用户问「怎么复习效果最好」时，出题与教人并列最高（Bloom 塔顶）。',
    queries: [
      {
        key: 'pw-inventory',
        label: '出题家题目库存',
        run: function (ctx) {
          let st = statsOf(listGet(ctx))
          if (!st) return '出题家还没有题目——用户还没出过题。'
          return '出题家：用户自己出了 ' + st.n + ' 道题，' + st.banked + ' 道已进站内公共题库；'
            + '送过 AI 试做的比例 ' + st.trialRate + '%'
            + (st.cleanRate != null ? '，试做干净率 ' + st.cleanRate + '%' : '') + '。'
        },
      },
      {
        key: 'pw-quality',
        label: '出题家出题水平',
        run: function (ctx) {
          let st = statsOf(listGet(ctx))
          if (!st || st.trialRate === 0) return '还没有 AI 试做记录，无法评估出题水平。'
          let out = '出题水平：AI 在用户题上的做错率 ' + (st.aiWrongRate == null ? '—' : st.aiWrongRate + '%')
            + '（做错率高=陷阱设计强；接近 0=干扰项一眼假），陷阱咬中率 ' + (st.trapHitRate == null ? '—' : st.trapHitRate + '%')
            + '，题面干净率 ' + (st.cleanRate == null ? '—' : st.cleanRate + '%') + '。'
          if (st.aiWrongRate != null && st.aiWrongRate < 10 && st.n >= 5) out += '建议：错误项要错得像对的，从自己当年的错题路径取材。'
          if (st.banked === 0 && st.n >= 3) out += '建议走完一次入库闭环，让题目被真实抽考检验。'
          return out
        },
      },
    ],
  }

  if (window.__PW_DEBUG__) {
    window.__pwInternals = {
      esc: esc, num: num, clamp: clamp, flat: flat, trunc: trunc, hashStr: hashStr, fmtTime: fmtTime,
      lintQuestion: lintQuestion, scoreTrial: scoreTrial, statsOf: statsOf,
      normQ: normQ, listGet: listGet, listSave: listSave,
      mountShell: mountShell, Q_MAX: Q_MAX, BANK_PAGE: BANK_PAGE,
    }
  }

  PluginBus.register(api)
})()
