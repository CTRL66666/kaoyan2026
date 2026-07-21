/* ============================================================
 * review.js — 复盘中心：日/周/月复盘 + 数据洞察 + 月里程碑检查
 * 周复盘报告按 PRD 4.4 模板自动生成
 * ============================================================ */
(function () {
  'use strict';

  // 生成本周复盘数据
  function weekData() {
    const s = Store.get();
    const wk = Store.weekKey();
    const hours = Store.weekHours();
    const totalHours = U.round1(U.sum(hours));
    const target = s.settings.weeklyTargetHours || 50;
    const w = s.weeklyStats[wk] || {};
    const top2 = Store.weekTopMistakes().map(t => ({ name: (DB.MISTAKE_TYPES[t.key] || {}).name || t.key, count: t.count }));
    const weekMistakes = s.mistakes.filter(m => U.inThisWeek((m.createdAt || '').slice(0, 10))).length;
    return { wk, hours, totalHours, target, accuracy: w.mathAccuracy, prevAccuracy: w.prevAccuracy, top2, weekMistakes, mental: w.mentalState, special: w.specialEvent };
  }

  function reportText(d) {
    const gap = U.round1(d.target - d.totalHours);
    const accDiff = (d.accuracy != null && d.prevAccuracy != null) ? U.round1(d.accuracy - d.prevAccuracy) : null;
    const topStr = d.top2.length ? d.top2.map(t => t.name + '（' + t.count + '次）').join('、') : '本周未记录错题';
    const mentalMap = { normal: '正常', anxious: '焦虑', tired: '疲劳', impulsive: '冲动', panic: '恐慌' };
    let tips = [];
    const signN = Store.mistakeCountWeek('sign');
    if (signN >= 3) tips.push('数学：增加「符号专项」5题/天（本周符号错误已达 ' + signN + ' 次）');
    if (d.accuracy != null && d.accuracy < 70) tips.push('数学：正确率低于70%，智能排程已自动提高数学权重');
    if (d.top2.some(t => t.name === '分式漏分母')) tips.push('数学：分式合并强制执行三步法，每题书面验证');
    if (gap > 0) tips.push('时长：本周缺口 ' + gap + 'h，建议周末补足或下调下周目标');
    if (!Store.subjectDoneInDays('ctrl', 3)) tips.push('现控：近3天未打卡，下周优先排现控任务');
    if (tips.length === 0) tips.push('节奏健康，保持当前计划，注意防呆流程不走样');
    return '📊 本周战报（' + U.keyLabel(U.weekKeys()[0]) + ' ~ ' + U.keyLabel(U.weekKeys()[6]) + '）\n'
      + '├── 有效学习时长：' + d.totalHours + 'h / 目标 ' + d.target + 'h（' + (gap > 0 ? '缺口 ' + gap + 'h' : '已达标') + '）\n'
      + '├── 数学平均正确率：' + (d.accuracy != null ? d.accuracy + '%' : '未录入') + (accDiff != null ? '（较上周 ' + (accDiff >= 0 ? '+' : '') + accDiff + '%）' : '') + '\n'
      + '├── 主要错误类型：' + topStr + '\n'
      + '├── 心理状态：' + (mentalMap[d.mental] || '未记录') + (d.special ? '（' + d.special + '）' : '') + '\n'
      + '└── 下周调整建议：\n' + tips.map(t => '    • ' + t).join('\n');
  }

  function render(el) {
    const d = weekData();
    const s = Store.get();
    const wk = Store.weekKey();

    // 日复盘快捷（今日）
    const todayH = Store.todayHours();
    const todayMistakes = s.mistakes.filter(m => (m.createdAt || '').slice(0, 10) === U.dkey()).length;

    // 历史周报列表
    const weeks = Object.keys(s.weeklyStats).sort().reverse().filter(k => s.weeklyStats[k] && s.weeklyStats[k].mathAccuracy != null);
    let history = '';
    weeks.slice(0, 6).forEach(k => {
      const w = s.weeklyStats[k];
      history += '<div class="his-row"><span>' + k + '</span><span class="muted-sm">' + (w.totalHours || 0) + 'h · 正确率 ' + (w.mathAccuracy != null ? w.mathAccuracy + '%' : '-') + '</span></div>';
    });

    el.innerHTML =
      // 今日速览
      '<div class="card"><div class="card-title">今日速览</div>'
      + '<div class="stat-row">'
      + '<div class="stat"><div class="stat-num">' + todayH + '</div><div class="stat-label">今日时长(h)</div></div>'
      + '<div class="stat"><div class="stat-num">' + todayMistakes + '</div><div class="stat-label">今日错题</div></div>'
      + '<div class="stat"><div class="stat-num">' + d.weekMistakes + '</div><div class="stat-label">本周错题</div></div>'
      + '<div class="stat"><div class="stat-num">' + d.totalHours + '</div><div class="stat-label">本周时长(h)</div></div>'
      + '</div>'
      + '<button class="btn btn-ghost btn-block" id="go-mental">🧘 去做今日心理状态记录（1分钟）</button>'
      + '</div>'

      // 周复盘表单
      + '<div class="card"><div class="card-title">周复盘数据录入（' + wk + '）</div>'
      + '<div class="form-grid">'
      + '<label class="fld"><span>本周数学平均正确率（%）</span><input id="rv-acc" class="input" type="number" min="0" max="100" value="' + (d.accuracy != null ? d.accuracy : '') + '" placeholder="如 75"></label>'
      + '<label class="fld"><span>上周正确率（%，用于对比）</span><input id="rv-prev" class="input" type="number" min="0" max="100" value="' + (d.prevAccuracy != null ? d.prevAccuracy : '') + '"></label>'
      + '<label class="fld"><span>本周目标时长（h）</span><input id="rv-target" class="input" type="number" min="0" max="120" value="' + d.target + '"></label>'
      + '<label class="fld"><span>心理状态</span><select id="rv-mental" class="input input-sel">'
      +   ['normal|正常', 'anxious|焦虑', 'tired|疲劳', 'impulsive|冲动', 'panic|恐慌'].map(o => { const p = o.split('|'); return '<option value="' + p[0] + '"' + (d.mental === p[0] ? ' selected' : '') + '>' + p[1] + '</option>'; }).join('')
      + '</select></label>'
      + '<label class="fld fld-full"><span>特殊事件（如：周三出现硬件冲动，已劝阻）</span><input id="rv-special" class="input" value="' + U.esc(d.special || '') + '"></label>'
      + '</div>'
      + '<button class="btn btn-primary" id="rv-save">保存并生成周报</button>'
      + '</div>'

      // 周报预览
      + '<div class="card"><div class="card-title">本周战报 <button class="link-btn" id="rv-copy">复制文本</button></div>'
      + '<pre class="report" id="rv-report"></pre>'
      + '<div class="btn-row">'
      + '<button class="btn btn-ghost" id="rv-ai">🤖 发送给 AI 深度复盘</button>'
      + '<button class="btn btn-ghost" id="rv-export">导出本周JSON</button>'
      + '</div></div>'

      // 月里程碑检查
      + '<div class="card"><div class="card-title">月里程碑检查</div>'
      + DB.MILESTONES.map(m => {
        const done = Store.get().milestones[m.id];
        return '<label class="check-row"><input type="checkbox" data-ms="' + m.id + '"' + (done ? ' checked' : '') + '><span class="box"></span><span>' + m.date + ' — ' + U.esc(m.title) + '</span></label>';
      }).join('')
      + '</div>'

      // 历史
      + (history ? '<div class="card"><div class="card-title">历史周报</div>' + history + '</div>' : '');

    document.getElementById('rv-report').textContent = reportText(d);
    bind(el);
  }

  function bind(el) {
    el.querySelector('#go-mental').onclick = () => App.go('mental');
    el.querySelector('#rv-save').onclick = () => {
      const acc = parseFloat(el.querySelector('#rv-acc').value);
      Store.update(s => {
        const wk = Store.weekKey();
        s.weeklyStats[wk] = s.weeklyStats[wk] || {};
        const w = s.weeklyStats[wk];
        if (!isNaN(acc)) w.mathAccuracy = acc;
        const prev = parseFloat(el.querySelector('#rv-prev').value);
        if (!isNaN(prev)) w.prevAccuracy = prev;
        const tgt = parseFloat(el.querySelector('#rv-target').value);
        if (!isNaN(tgt)) { w.targetHours = tgt; s.settings.weeklyTargetHours = tgt; }
        w.mentalState = el.querySelector('#rv-mental').value;
        w.specialEvent = el.querySelector('#rv-special').value.trim();
        w.totalHours = U.round1(U.sum(Store.weekHours()));
        w.mainErrorTypes = Store.weekTopMistakes().map(t => t.key);
      });
      Toast.success('周报已保存');
      render(el);
    };
    el.querySelector('#rv-copy').onclick = () => {
      const txt = document.getElementById('rv-report').textContent;
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => Toast.success('已复制'));
      else Toast.warn('复制失败，请手动选择文本');
    };
    el.querySelector('#rv-ai').onclick = () => {
      const txt = document.getElementById('rv-report').textContent;
      if (window.AI) AI.reviewWeekly(txt);
    };
    el.querySelector('#rv-export').onclick = () => {
      const s = Store.get();
      const data = { week: Store.weekKey(), stats: s.weeklyStats[Store.weekKey()], mistakes: s.mistakes.filter(m => U.inThisWeek((m.createdAt || '').slice(0, 10))), hours: Store.weekHours() };
      U.download('kaoyan_week_' + Store.weekKey() + '.json', JSON.stringify(data, null, 2));
      Toast.success('已导出');
    };
    el.querySelectorAll('[data-ms]').forEach(cb => {
      cb.onchange = () => {
        const id = cb.getAttribute('data-ms');
        const m = DB.MILESTONES.find(x => x.id === id);
        Store.update(s => { s.milestones[id] = cb.checked; });
        if (cb.checked && window.Notify) Notify.send('里程碑达成', '🏁 里程碑达成：' + m.title);
        Toast.success('已更新');
      };
    });
  }

  window.ReviewModule = { render, reportText, weekData };
})();
