/* ============================================================
 * scheduler.js — 智能任务调度引擎
 * 规则（蓝图v2.0硬编码）：
 *  · 数学正确率<70% → 数学任务权重+30%
 *  · 现控连续3天未打卡 → 知识冷却预警，优先排现控
 *  · 符号错误本周>3次 → 每日强制插入符号专项5题
 *  · 政治超红线 → 自动削减政治任务
 * 输出：每日唯一最优任务序列（generate() 供 Dashboard NOW 卡复用）
 * ============================================================ */
(function () {
  'use strict';

  function ctx() {
    const acc = Store.currentMathAccuracy();
    return {
      acc,
      mathBoost: (acc != null && acc < 70) ? 1.3 : 1,
      signWeek: Store.mistakeCountWeek('sign'),
      ctrlIdle: !Store.subjectDoneInDays('ctrl', 3),
      polCap: 2
    };
  }

  // 生成今日最优序列：返回 {sequence:[{id?,subject,text,reason,weight,done,forced}], reasons[]}
  function generate() {
    const s = Store.get();
    const c = ctx();
    const reasons = [];
    const forced = [];

    // 1) 强制项：符号专项
    if (c.signWeek > 3) {
      forced.push({ id: '__sign', subject: 'math', text: '【符号专项】5题（本周符号错误 ' + c.signWeek + ' 次，强制插入）', reason: '符号错误本周 ' + c.signWeek + ' 次 > 3次 → 强制插入符号专项', weight: 99, forced: true, done: false });
      reasons.push('符号错误本周 ' + c.signWeek + ' 次 > 3次 → 强制插入符号专项');
    }
    // 2) 强制项：现控冷却
    if (c.ctrlIdle) {
      forced.push({ id: '__cool', subject: 'ctrl', text: '【知识冷却补救】现控：复习状态转移矩阵 → 重做极点配置例4-2', reason: '现控连续3天未打卡 → 触发知识冷却，优先排现控', weight: 98, forced: true, done: false });
      reasons.push('现控连续3天未打卡 → 触发知识冷却，优先排现控');
    }
    if (c.mathBoost > 1) reasons.push('数学正确率 ' + c.acc + '% < 70% → 数学权重 +30%');

    // 3) 加权排序既有未完成任务
    const weight = t => {
      let w = 1;
      if (t.subject === 'math') w *= c.mathBoost;
      if (t.subject === 'ctrl' && c.ctrlIdle) w *= 1.5;
      if (t.subject === 'pol') w *= 0.6;
      return w + (Math.random() * 0.01);
    };
    const doneIds = s.completions[U.dkey()] || [];
    const pending = s.tasks.map(t => ({
      id: t.id, subject: t.subject, text: t.text,
      done: t.done || doneIds.indexOf(t.id) >= 0,
      forced: false, weight: Math.round(weight(t) * 100) / 100,
      reason: ''
    }));
    // 未完成在前，按权重降序；已完成沉底
    const sorted = pending.sort((a, b) => (a.done - b.done) || (b.weight - a.weight));

    let polN = 0, polCut = false;
    const picked = [];
    sorted.forEach(t => {
      if (t.done) { picked.push(t); return; }
      if (t.subject === 'pol') {
        if (polN >= c.polCap) { polCut = true; return; }
        polN++;
      }
      picked.push(t);
    });
    if (polCut) reasons.push('政治超过时间红线 → 已自动削减未排政治任务');

    return { sequence: forced.concat(picked).slice(0, 9), reasons, ctx: c };
  }

  function render(el) {
    const gen = generate();
    const s = Store.get();

    let rows = '';
    if (!gen.sequence.length) rows = '<div class="empty">任务池为空。先去「任务」页添加今天的任务，排程引擎才能工作。</div>';
    gen.sequence.forEach(item => {
      const meta = DB.SUBJECTS[item.subject];
      rows += '<div class="seq-row' + (item.forced ? ' seq-forced' : '') + (item.done ? ' seq-is-done' : '') + '" data-id="' + item.id + '">'
        + '<label class="task-check"><input type="checkbox"' + (item.done ? ' checked' : '') + (item.forced ? ' disabled' : '') + '><span class="box"></span></label>'
        + '<span class="seq-text">' + U.esc(item.text) + '</span>'
        + '<span class="seq-badge" style="color:' + meta.color + '">' + (item.forced ? '🔒' : item.weight) + '</span>'
        + '</div>';
    });

    el.innerHTML =
      '<div class="card"><div class="card-title">🧠 智能任务调度引擎</div>'
      + '<div class="muted-sm">不是静态列表，是基于 正确率/连续打卡/易错类型/政治红线 动态计算出的<b>今日唯一最优序列</b>。</div>'
      + '<div class="ctx-grid">'
      + '<div class="ctx-item">数学正确率<b>' + (gen.ctx.acc != null ? gen.ctx.acc + '%' : '未录入') + '</b></div>'
      + '<div class="ctx-item">数学权重<b>×' + gen.ctx.mathBoost + '</b></div>'
      + '<div class="ctx-item">符号错误(周)<b>' + gen.ctx.signWeek + ' 次</b></div>'
      + '<div class="ctx-item">现控冷却<b>' + (gen.ctx.ctrlIdle ? '⚠️ 是' : '否') + '</b></div>'
      + '</div>'
      + (gen.reasons.length ? '<div class="reason-box">⚙️ 调度决策：<br>' + gen.reasons.map(r => '· ' + r).join('<br>') + '</div>' : '<div class="reason-box">⚙️ 今日无特殊调度干预，按常规权重排序。</div>')
      + '</div>'

      + '<div class="card"><div class="card-title">今日最优序列（' + gen.sequence.filter(x => !x.done).length + ' 项待办）</div>' + rows
      + '<div class="muted-sm" style="margin-top:8px">🔒 = 系统强制项，不可跳过；数字 = 动态权重。勾选直接打卡。</div></div>'

      + '<div class="card"><div class="card-title">调度规则（硬编码）</div><ul class="rule-list">'
      + '<li>数学正确率 &lt; 70% → 数学任务权重 +30%</li>'
      + '<li>现控连续3天未打卡 → 触发知识冷却，强制优先</li>'
      + '<li>符号错误本周 &gt; 3次 → 每日强制插入符号专项5题</li>'
      + '<li>政治任务当日超2个 → 超出部分自动削减</li>'
      + '</ul></div>';

    bind(el);
  }

  function bind(el) {
    el.querySelectorAll('.seq-row input[type=checkbox]').forEach(cb => {
      cb.onchange = () => {
        const id = cb.closest('.seq-row').getAttribute('data-id');
        if (id.indexOf('__') === 0) return; // 强制项不走任务存储
        let subject = null;
        Store.update(s => {
          const t = s.tasks.find(x => x.id === id);
          if (!t) return;
          t.done = cb.checked; subject = t.subject;
          const k = U.dkey();
          s.completions[k] = s.completions[k] || [];
          const i = s.completions[k].indexOf(id);
          if (cb.checked && i < 0) s.completions[k].push(id);
          if (!cb.checked && i >= 0) s.completions[k].splice(i, 1);
        });
        if (cb.checked) {
          Toast.success('✓ 打卡完成');
          if (subject === 'math' && Store.mistakeCountToday('sign') > 0) {
            Modal.open({
              title: '⚠️ 数学防呆提醒',
              html: '<p>今日已记 <b>' + Store.mistakeCountToday('sign') + '</b> 次符号错误。下一题前默念：符号前置 / 分式三步法 / 草稿分区。</p>',
              actions: [{ label: '收到', kind: 'btn-primary' }]
            });
          }
        }
        App.refresh();
      };
    });
  }

  window.SchedulerModule = { render, generate };
})();
