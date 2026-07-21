/* ============================================================
 * dashboard.js — 作战台（好用版）
 * 设计哲学：打开即用，一页答三问——现在该干嘛？干得怎么样？有什么雷？
 * 结构：①当前行动卡（NOW） ②今日序列就地勾选 ③四科完成度 ④快捷操作 ⑤本周节奏 ⑥预警
 * ============================================================ */
(function () {
  'use strict';

  // 当前时刻该干什么：从排程序列取第一个未完成项
  function nowAction() {
    const s = Store.get();
    const gen = SchedulerModule.generate();
    const next = gen.sequence.find(x => !x.done);
    return next || null;
  }

  function render(el) {
    const s = Store.get();
    const st = Store.todayTaskStats();
    const allDone = Store.todayAllDone();
    const next = nowAction();

    // ---------- ① NOW 行动卡 ----------
    let nowHtml;
    if (allDone) {
      nowHtml = '<div class="now-card now-done"><div class="now-kicker">今日已清场</div>'
        + '<div class="now-title">✓ 今日任务全部完成</div>'
        + '<div class="now-sub">可以安心复盘、早点睡。明天继续。</div></div>';
    } else if (next) {
      nowHtml = '<div class="now-card"><div class="now-kicker">⚡ 现在就干这个</div>'
        + '<div class="now-title">' + U.esc(next.text) + '</div>'
        + '<div class="now-sub"><span class="task-tag" style="background:' + DB.SUBJECTS[next.subject].color + '">' + DB.SUBJECTS[next.subject].short + '</span> '
        + U.esc(next.reason) + '</div>'
        + '<div class="now-actions">'
        + '<button class="btn btn-primary" id="now-done">✓ 完成打卡</button>'
        + '<button class="btn btn-ghost" id="now-focus">🔒 专注' + (next.subject === 'math' ? '45' : '25') + '分钟</button>'
        + '</div></div>';
    } else {
      nowHtml = '<div class="now-card"><div class="now-kicker">今日无待办</div>'
        + '<div class="now-title">还没排任务</div>'
        + '<div class="now-actions"><button class="btn btn-primary" id="now-add">去任务中心添加</button></div></div>';
    }

    // ---------- ② 今日序列（前5条，就地勾选） ----------
    const gen = SchedulerModule.generate();
    let seqHtml = '';
    gen.sequence.slice(0, 5).forEach(item => {
      const t = s.tasks.find(x => x.id === item.id);
      const done = t ? t.done : false;
      seqHtml += '<div class="seq-row' + (done ? ' seq-is-done' : '') + '" data-id="' + item.id + '">'
        + '<label class="task-check"><input type="checkbox"' + (done ? ' checked' : '') + '><span class="box"></span></label>'
        + '<span class="seq-text">' + U.esc(item.text) + '</span>'
        + '<span class="seq-badge" style="color:' + DB.SUBJECTS[item.subject].color + '">' + item.weight + '</span>'
        + '</div>';
    });

    // ---------- ③ 四科 chips ----------
    let chips = '';
    ['math', 'ctrl', 'eng', 'pol'].forEach(k => {
      const meta = DB.SUBJECTS[k];
      const d = st[k][0], t = st[k][1];
      chips += '<div class="chip' + (t > 0 && d === t ? ' chip-done' : '') + '" style="--sc:' + meta.color + '">'
        + '<span class="chip-name">' + meta.short + '</span><span class="chip-num">' + d + '/' + t + '</span></div>';
    });

    // ---------- ④ 本周节奏（柱图，今天高亮，点按录入） ----------
    const hours = Store.weekHours();
    const todayIdx = (new Date().getDay() + 6) % 7;
    const barData = hours.map((v, i) => ({ label: ['一', '二', '三', '四', '五', '六', '日'][i], value: v, highlight: i === todayIdx }));

    el.innerHTML =
      '<div id="alert-slot">' + Alerts.bannerHtml() + '</div>'
      + nowHtml
      + '<div class="card"><div class="card-title-row"><span class="card-title">今日作战序列</span>'
      + '<button class="link-btn" id="go-sched">完整排程 →</button></div>' + (seqHtml || '<div class="empty">暂无任务</div>') + '</div>'
      + '<div class="chip-row">' + chips + '</div>'
      + '<div class="quick-grid">'
      + '<button class="quick-btn" data-go="tasks">✅<span>任务</span></button>'
      + '<button class="quick-btn" data-go="mistakes">🎯<span>错题</span></button>'
      + '<button class="quick-btn" data-go="review">📊<span>复盘</span></button>'
      + '<button class="quick-btn" data-go="redline">⛔<span>红线</span></button>'
      + '</div>'
      + '<div class="card"><div class="card-title-row"><span class="card-title">本周节奏</span>'
      + '<button class="link-btn" id="log-hours">+ 记录时长</button></div>'
      + '<div id="wk-chart">' + Charts.bar(barData, { height: 130, unit: 'h', hiColor: '#000' }) + '</div>'
      + '<div class="muted-sm">今日 ' + Store.todayHours() + 'h · 本周累计 ' + U.round1(U.sum(hours)) + 'h / 目标 ' + (s.settings.weeklyTargetHours || 50) + 'h</div>'
      + '</div>';

    bind(el, next);
  }

  function bind(el, next) {
    // NOW 卡动作
    const doneBtn = el.querySelector('#now-done');
    if (doneBtn && next) doneBtn.onclick = () => toggleTask(next.id, true);
    const focBtn = el.querySelector('#now-focus');
    if (focBtn && next) focBtn.onclick = () => { App.go('focus'); };
    const addBtn = el.querySelector('#now-add');
    if (addBtn) addBtn.onclick = () => App.go('tasks');

    // 序列就地勾选
    el.querySelectorAll('.seq-row input[type=checkbox]').forEach(cb => {
      cb.onchange = () => {
        const id = cb.closest('.seq-row').getAttribute('data-id');
        toggleTask(id, cb.checked);
      };
    });

    // 快捷入口
    el.querySelectorAll('[data-go]').forEach(b => b.onclick = () => App.go(b.getAttribute('data-go')));
    el.querySelector('#go-sched').onclick = () => App.go('scheduler');

    // 记时长
    el.querySelector('#log-hours').onclick = () => {
      Modal.open({
        title: '记录学习时长',
        html: '<div class="seg-row" id="hr-segs">'
          + [0.5, 1, 1.5, 2, 3].map(h => '<button class="seg" data-h="' + h + '">+' + h + 'h</button>').join('')
          + '</div><div class="muted-sm">点击即累加到今天（当前 ' + Store.todayHours() + 'h）</div>',
        actions: [{ label: '完成', kind: 'btn-primary' }]
      });
      document.querySelectorAll('#hr-segs .seg').forEach(b => b.onclick = () => {
        Store.addHours(+b.getAttribute('data-h'));
        Toast.success('+' + b.getAttribute('data-h') + 'h，今日共 ' + Store.todayHours() + 'h');
        renderStatusOnly();
      });
    };
  }

  function renderStatusOnly() { App.refresh(); }

  function toggleTask(id, done) {
    let subject = null, count = 0;
    Store.update(s => {
      const t = s.tasks.find(x => x.id === id);
      if (!t) return;
      t.done = done; subject = t.subject;
      const k = U.dkey();
      s.completions[k] = s.completions[k] || [];
      const i = s.completions[k].indexOf(id);
      if (done && i < 0) s.completions[k].push(id);
      if (!done && i >= 0) s.completions[k].splice(i, 1);
      count = s.completions[k].length;
    });
    if (done) {
      // 连击反馈
      Toast.show(['✓ 打卡', '✓ 拿下', '✓ 干净利落', '✓ 继续推进'][count % 4] + '（今日第' + count + '个）', 'success', 1800);
      confettiBurst();
      if (subject === 'math' && Store.mistakeCountToday('sign') > 0) {
        Modal.open({
          title: '⚠️ 数学防呆提醒',
          html: '<p>今日已记 <b>' + Store.mistakeCountToday('sign') + '</b> 次符号错误。下一题前默念：</p>'
            + '<ol style="padding-left:18px;line-height:1.9"><li>符号前置</li><li>分式三步法</li><li>草稿分区</li></ol>',
          actions: [{ label: '收到', kind: 'btn-primary' }]
        });
      }
    }
    App.refresh();
  }

  // 轻量庆祝动效（纯CSS，无库）
  function confettiBurst() {
    const c = document.createElement('div');
    c.className = 'burst';
    for (let i = 0; i < 10; i++) {
      const p = document.createElement('i');
      p.style.setProperty('--a', (i * 36) + 'deg');
      p.style.setProperty('--d', (34 + (i % 3) * 14) + 'px');
      c.appendChild(p);
    }
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 700);
  }

  window.DashboardModule = { render };
})();
