/* ============================================================
 * focus.js — 深度专注模式 + 番茄钟（学习契约系统）
 * 全屏倒计时25/45/90三档；每15分钟疲劳自检；结束强制5分钟防呆复盘；
 * 连续3次强制休息15分钟；统计日/周/月专注数据
 * ============================================================ */
(function () {
  'use strict';
  let timer = null;          // setInterval handle
  let session = null;        // {mins, subject, startAt, remainSec, lastFatigueMark}
  let fatigueShownAt = 0;

  function todaySessions() {
    const s = Store.get();
    const k = U.dkey();
    return s.focus.sessions.filter(x => x.date === k);
  }
  function todayCount() { return todaySessions().filter(x => !x.aborted).length; }
  function todayMins() { return U.sum(todaySessions().map(x => x.mins)); }

  function render(el) {
    const s = Store.get();
    const count = todayCount();
    const mins = todayMins();
    const weekMins = U.sum(s.focus.sessions.filter(x => U.inThisWeek(x.date)).map(x => x.mins));
    const aborted = s.focus.sessions.filter(x => U.inThisWeek(x.date) && x.aborted).length;
    const mustRest = count > 0 && count % 3 === 0;

    el.innerHTML =
      '<div class="card"><div class="card-title">🔒 深度专注模式</div>'
      + '<div class="muted-sm">启动即签订学习契约：屏蔽非学习操作，每15分钟疲劳自检，结束后强制5分钟防呆复盘。</div>'
      + '<div class="stat-row">'
      + '<div class="stat"><div class="stat-num">' + count + '</div><div class="stat-label">今日专注</div></div>'
      + '<div class="stat"><div class="stat-num">' + mins + '</div><div class="stat-label">今日分钟</div></div>'
      + '<div class="stat"><div class="stat-num">' + U.round1(weekMins / 60) + '</div><div class="stat-label">本周小时</div></div>'
      + '<div class="stat"><div class="stat-num">' + aborted + '</div><div class="stat-label">本周中断</div></div>'
      + '</div>'
      + (mustRest ? '<div class="alert alert-danger">😴 已连续专注3次，系统强制休息15分钟。去走动、喝水、远眺。此期间无法启动新专注。</div>' : '')
      + '<div class="focus-setup">'
      + '<div class="seg-row">' + [25, 45, 90].map(m => '<button class="seg" data-m="' + m + '"' + (mustRest ? ' disabled' : '') + '>' + m + ' 分钟</button>').join('') + '</div>'
      + '<select id="fc-subj" class="input input-sel">'
      + '<option value="math">数学一</option><option value="ctrl">自控</option><option value="eng">英语一</option><option value="pol">政治</option></select>'
      + '</div></div>'

      + '<div class="card"><div class="card-title">近7天专注趋势</div>'
      + Charts.line(U.lastNDays(7).map(k => ({ label: k.slice(5), value: U.round1(U.sum(s.focus.sessions.filter(x => x.date === k).map(x => x.mins)) / 60) })), { height: 150, unit: 'h' })
      + '</div>'

      + '<div class="card"><div class="card-title">专注规则</div><ul class="rule-list">'
      + '<li>专注期间隐藏任务添加/错题记录等干扰操作</li>'
      + '<li>每15分钟弹出疲劳检测：是否出现「想当然」或跳步冲动</li>'
      + '<li>结束后强制5分钟防呆复盘（符号/分式回顾）</li>'
      + '<li>连续3次专注 → 强制休息15分钟（无法跳过）</li>'
      + '<li>专注时长自动计入学习时长统计</li>'
      + '</ul></div>';

    el.querySelectorAll('.seg').forEach(b => {
      b.onclick = () => startFocus(+b.getAttribute('data-m'), el.querySelector('#fc-subj').value);
    });
  }

  // ---------- 专注会话 ----------
  function startFocus(mins, subject) {
    if (session) return;
    session = { mins, subject, startAt: Date.now(), remainSec: mins * 60, lastFatigueMark: mins * 60 };
    fatigueShownAt = 0;
    document.body.classList.add('focus-lock');
    renderOverlay();
    Notify.send('专注开始', DB.SUBJECTS[subject].name + ' · ' + mins + '分钟。手机扣过来，开工。');
    timer = setInterval(tick, 1000);
  }

  function tick() {
    if (!session) return;
    session.remainSec--;
    // 每15分钟疲劳检测（剩余时间为15的倍数分钟时触发，且非最后一分钟）
    const elapsed = session.mins * 60 - session.remainSec;
    if (elapsed > 0 && elapsed % 900 === 0 && session.remainSec > 60 && fatigueShownAt !== elapsed) {
      fatigueShownAt = elapsed;
      showFatigueCheck();
    }
    if (session.remainSec <= 0) { finishFocus(false); return; }
    updateOverlay();
  }

  function fmt(sec) {
    const m = Math.floor(sec / 60), s = sec % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function renderOverlay() {
    const old = document.getElementById('focus-overlay');
    if (old) old.remove();
    const ov = document.createElement('div');
    ov.id = 'focus-overlay';
    ov.innerHTML =
      '<div class="fo-inner">'
      + '<div class="fo-subj">' + DB.SUBJECTS[session.subject].name + ' · 深度专注中</div>'
      + '<div class="fo-time" id="fo-time">' + fmt(session.remainSec) + '</div>'
      + '<div class="fo-hint">屏蔽干扰中。卡壳3分钟标记"?"跳过，不倒推。</div>'
      + '<div class="fo-btns"><button class="btn btn-danger" id="fo-abort">中断专注（计入中断）</button></div>'
      + '</div>';
    document.body.appendChild(ov);
    document.getElementById('fo-abort').onclick = () => {
      Modal.confirm('中断专注', '<p>确定中断？本次将计为中断，专注时长按已过分钟计入。</p>', '中断', () => finishFocus(true), true);
    };
  }

  function updateOverlay() {
    const t = document.getElementById('fo-time');
    if (t) t.textContent = fmt(session.remainSec);
  }

  function showFatigueCheck() {
    const div = document.createElement('div');
    div.className = 'fatigue-pop';
    div.innerHTML = '<b>⏱ 疲劳自检</b><p>此刻是否出现「想当然」？是否想跳步？</p>'
      + '<div class="btn-row"><button class="btn btn-sm btn-primary" id="ft-ok">没有，状态在线</button>'
      + '<button class="btn btn-sm btn-ghost" id="ft-yes">有点，提醒我走流程</button></div>';
    document.body.appendChild(div);
    div.querySelector('#ft-ok').onclick = () => div.remove();
    div.querySelector('#ft-yes').onclick = () => {
      div.remove();
      Toast.warn('⚠️ 默念：符号前置 / 分式三步法 / 草稿分区。下一步开始走流程。', 5000);
    };
  }

  function finishFocus(aborted) {
    clearInterval(timer); timer = null;
    const doneMins = aborted ? Math.floor((session.mins * 60 - session.remainSec) / 60) : session.mins;
    const rec = { id: U.uid(), date: U.dkey(), mins: doneMins, subject: session.subject, endedAt: new Date().toISOString(), aborted };
    Store.update(s => { s.focus.sessions.push(rec); });
    if (doneMins > 0) Store.addHours(U.round1(doneMins / 60 * 10) / 10);
    document.body.classList.remove('focus-lock');
    const ov = document.getElementById('focus-overlay');
    if (ov) ov.remove();
    session = null;

    if (aborted) {
      Toast.warn('已记录中断 ' + doneMins + ' 分钟');
      App.refresh();
    } else {
      Notify.send('专注完成', '强制5分钟防呆复盘开始');
      Modal.open({
        title: '🧘 强制防呆复盘（5分钟）',
        dismissable: false,
        html: '<p>闭眼回忆刚才的练习，逐条确认：</p>'
          + '<ol style="padding-left:18px;line-height:2">'
          + '<li>有没有出现<b>负号后置</b>？翻草稿检查最后3题</li>'
          + '<li>分式合并是否走了<b>分母→分子→计算</b>三步？</li>'
          + '<li>草稿是否保持<b>左乱草/右正稿</b>分区？</li>'
          + '<li>卡壳题是否已标记"?"，没有死磕超过3分钟？</li></ol>'
          + '<p class="muted-sm">发现违规 → 立即去错题画像记录一条，类型选对应项。</p>',
        actions: [
          { label: '发现违规，去记错题', kind: 'btn-ghost', onClick: close => { close(); App.go('mistakes'); } },
          { label: '复盘完毕，无违规', kind: 'btn-primary', onClick: close => { close(); App.refresh(); } }
        ]
      });
    }
  }

  window.FocusModule = { render, get active() { return !!session; } };
})();
