/* ============================================================
 * ai.js — 云端AI接口（OpenAI兼容协议）
 * 预设一键导入（DeepSeek/Kimi/通义/智谱），提示词全部内置。
 * 含：结构化出题 / 自动判卷（JSON模式），配合本地引擎兜底。
 * ============================================================ */
(function () {
  'use strict';

  const SYSTEM_PROMPT =
    '你是一名严厉的2026考研教练，服务对象是一名跨考控制科学与工程的考生（双非一本机电背景）。' +
    '其目标：数学一130、专业课135、英语一70、政治65，一志愿上岸拒绝二战。' +
    '其致命弱点：数学计算易错（符号错误、分式漏分母、积分因子符号反）、偶有硬件项目冲动。' +
    '回复要求：1) 直接、犀利、不灌鸡汤；2) 优先指出风险与防呆措施；3) 建议必须落到具体章节/题量/时间；' +
    '4) 发现"二战""放松一下硬件"等倾向立即引用红线禁令制止；5) 用简体中文，200-400字。';

  const QUIZ_PROMPT =
    '你是考研数学/自控出题官。根据用户给出的考点、层级、薄弱错误类型，出1道题。' +
    '必须只输出 JSON，不要任何多余文字、不要markdown代码块。格式：' +
    '{"stem":"题干（公式用纯文本，如 ∫(0到1) x dx）","type":"choice|solve",' +
    '"options":["A. ...","B. ...","C. ...","D. ..."](仅choice需要),"answer":"标准答案",' +
    '"solution":"分步详解（标出关键步骤）","trap":"本题最易踩的坑（符号/分母/积分因子）"}。' +
    '题目必须贴合考研难度，层级越高越综合。';

  const JUDGE_PROMPT =
    '你是考研阅卷老师，极其严格，按步骤给分。根据题目、标准答案、学生作答，输出判卷结果。' +
    '必须只输出 JSON，不要任何多余文字、不要markdown代码块。格式：' +
    '{"score":0-100整数,"verdict":"对|部分对|错","steps":[{"point":"采分点","got":true|false,"note":"评语"}],' +
    '"errorType":"sign|fraction|integral|concept|careless|other|none",' +
    '"comment":"一句话点评（指出最致命问题）"}。' +
    '若学生跳步、符号错误、漏分母，即使答案碰巧对也要扣分并标记对应errorType。';

  function configured() {
    const a = Store.get().ai;
    return !!(a.endpoint && a.key && a.model);
  }

  function applyPreset(key) {
    const p = DB.AI_PRESETS[key];
    if (!p) return;
    Store.update(s => {
      s.ai.preset = key;
      if (key !== 'custom') { s.ai.endpoint = p.endpoint; s.ai.model = p.model; }
    });
  }

  function weeklySummary() {
    const d = ReviewModule.weekData();
    const signW = Store.mistakeCountWeek('sign');
    const s = Store.get();
    const urgeW = s.mental.filter(m => U.inThisWeek(m.date) && m.hwUrge).length;
    const mentalMap = { normal: '正常', anxious: '焦虑', tired: '疲劳', impulsive: '冲动', panic: '恐慌' };
    return '【本周学习摘要】\n'
      + '时长：' + d.totalHours + 'h | 数学正确率：' + (d.accuracy != null ? d.accuracy + '%' : '未录入') + ' | 主要错误：' + (d.top2.length ? d.top2.map(t => t.name).join('、') : '无记录') + '\n'
      + '现控进度：' + Store.xiankongPercent() + '% | 心理状态：' + (mentalMap[d.mental] || '未记录') + ' | 硬件冲动：' + urgeW + '次' + (urgeW ? '（已劝阻）' : '') + '\n'
      + '符号错误：' + signW + '次/周 | 本周错题：' + d.weekMistakes + '条 | 里程碑：' + DB.MILESTONES.map(m => (s.milestones[m.id] ? '✓' : '✗') + m.date).join(' ');
  }

  function rawChat(messages) {
    const a = Store.get().ai;
    return fetch(a.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + a.key },
      body: JSON.stringify({ model: a.model, messages, temperature: 0.6 })
    }).then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(j => {
      const txt = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
      if (!txt) throw new Error('接口返回异常');
      return txt;
    });
  }

  function chat(userText) {
    return rawChat([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userText }
    ]);
  }

  // JSON 调用：容错提取首个 JSON 对象
  function chatJSON(systemPrompt, userText) {
    return rawChat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userText }
    ]).then(txt => {
      const m = txt.match(/\{[\s\S]*\}/);
      if (!m) throw new Error('AI未返回JSON');
      return JSON.parse(m[0]);
    });
  }

  const AI = {
    configured, applyPreset, weeklySummary, chat, chatJSON,
    QUIZ_PROMPT, JUDGE_PROMPT,
    reviewWeekly(reportText) {
      const summary = weeklySummary();
      const payload = reportText + '\n\n' + summary + '\n\n请给出：1)风险诊断 2)下周逐日任务调整 3)防呆强化点。';
      Modal.open({
        title: '🤖 AI 深度复盘中…',
        wide: true, dismissable: false,
        html: '<div class="muted-sm">已自动附带本周学习摘要，正在等待云端教练回复…</div><pre class="report" id="ai-out">加载中…</pre>',
        actions: [{ label: '关闭', kind: 'btn-ghost' }]
      });
      chat(payload).then(txt => {
        const out = document.getElementById('ai-out');
        if (out) out.textContent = txt;
      }).catch(e => {
        const out = document.getElementById('ai-out');
        if (out) out.textContent = '调用失败：' + e.message + '\n\n可改用本地摘要手动复盘：\n' + summary;
      });
    },
    test() { return chat('用一句话回复：系统连通正常').then(t => t.slice(0, 60)); }
  };

  window.AI = AI;
})();
