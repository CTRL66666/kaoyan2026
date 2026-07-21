/* ============================================================
 * app.js — 应用主控
 * 交互架构（好用版）：
 *  · 底部固定5大高频Tab：作战台/任务/排程/复盘/工具（工具内含其余9模块）
 *  · 顶部极简状态条：倒计时+今日时长，全局可见
 * ============================================================ */
(function () {
  'use strict';

  // 主Tab（底部固定）| 子模块（工具抽屉）
  const MAIN_TABS = [
    ['dashboard', '作战台', '🎖', DashboardModule],
    ['tasks', '任务', '✅', TasksModule],
    ['scheduler', '排程', '🧠', SchedulerModule],
    ['review', '复盘', '📊', ReviewModule]
  ];
  const TOOL_TABS = [
    ['quiz', 'AI测验', '🤖', QuizModule],
    ['mistakes', '错题画像', '🎯', MistakesModule],
    ['heatmap', '考点热力', '🗺', HeatmapModule],
    ['inspector', '步骤审查', '✍️', InspectorModule],
    ['focus', '深度专注', '🔒', FocusModule],
    ['concept', '概念图谱', '🧩', ConceptMapModule],
    ['decision', '院校决策', '⚖️', DecisionModule],
    ['mental', '心理状态', '🧘', MentalModule],
    ['reading', '英语阅读', '📖', ReadingModule],
    ['redline', '红线禁令', '⛔', RedlineModule],
    ['progress', '进度追踪', '📈', ProgressModule],
    ['settings', '设置', '⚙️', SettingsModule]
  ];
  const ALL = MAIN_TABS.concat(TOOL_TABS);
  let current = 'dashboard';

  function rolloverIfNeeded() {
    const s = Store.get();
    const today = U.dkey();
    if (s.meta.lastOpenDate === today) return;
    const last = s.meta.lastOpenDate;
    if (last && last < today) {
      const doneIds = s.completions[last] || [];
      s.taskArchive[last] = s.tasks.map(t => ({ subject: t.subject, text: t.text, done: t.done || doneIds.indexOf(t.id) >= 0 }));
      s.tasks.forEach(t => { t.done = false; });
      const keys = Object.keys(s.taskArchive).sort();
      while (keys.length > 60) { delete s.taskArchive[keys.shift()]; }
    }
    Store.update(x => { x.meta.lastOpenDate = today; });
  }

  // 顶部状态条：倒计时 + 今日时长 + 今日任务完成度
  function renderStatusBar() {
    const el = document.getElementById('statusbar');
    const left = U.daysTo(Store.get().settings.examDate);
    const st = Store.todayTaskStats();
    let done = 0, total = 0;
    Object.keys(st).forEach(k => { done += st[k][0]; total += st[k][1]; });
    el.innerHTML =
      '<span class="sb-item">⏳ <b>' + left + '</b>天</span>'
      + '<span class="sb-item">🕐 <b>' + Store.todayHours() + '</b>h</span>'
      + '<span class="sb-item">✅ <b>' + done + '/' + total + '</b></span>'
      + (Store.mistakeCountToday('sign') > 0 ? '<span class="sb-item sb-warn">⚠️符号' + Store.mistakeCountToday('sign') + '</span>' : '');
  }

  function renderNav() {
    const nav = document.getElementById('bottomnav');
    let html = MAIN_TABS.map(t =>
      '<button class="bn-btn' + (current === t[0] ? ' bn-on' : '') + '" data-tab="' + t[0] + '">'
      + '<span class="bn-icon">' + t[2] + '</span><span class="bn-label">' + t[1] + '</span></button>'
    ).join('');
    html += '<button class="bn-btn' + (TOOL_TABS.some(t => t[0] === current) ? ' bn-on' : '') + '" data-tab="__tools">'
      + '<span class="bn-icon">🧰</span><span class="bn-label">工具</span></button>';
    nav.innerHTML = html;
    nav.querySelectorAll('.bn-btn').forEach(b => b.onclick = () => {
      const t = b.getAttribute('data-tab');
      if (t === '__tools') openTools();
      else App.go(t);
    });
  }

  function openTools() {
    Modal.open({
      title: '🧰 工具箱',
      html: '<div class="tools-grid">'
        + TOOL_TABS.map(t =>
          '<button class="tool-cell" data-tab="' + t[0] + '"><span class="tool-icon">' + t[2] + '</span><span>' + t[1] + '</span></button>'
        ).join('') + '</div>',
      actions: [{ label: '关闭' }]
    });
    document.querySelectorAll('.tool-cell').forEach(b => b.onclick = () => {
      Modal.close();
      App.go(b.getAttribute('data-tab'));
    });
  }

  function render() {
    renderStatusBar();
    renderNav();
    const view = document.getElementById('view');
    const tab = ALL.find(t => t[0] === current);
    view.scrollTop = 0; window.scrollTo(0, 0);
    tab[3].render(view);
    view.querySelectorAll('.pbar-fill').forEach(f => {
      requestAnimationFrame(() => { f.style.width = f.getAttribute('data-w') + '%'; });
    });
  }

  const App = {
    go(tab) { current = tab; render(); },
    refresh() { render(); renderStatusBar(); },
    get current() { return current; },
    init() {
      rolloverIfNeeded();
      Notify.ensurePermission();
      render();
      if (Onboarding.needed()) setTimeout(() => Onboarding.show(), 300);
      setTimeout(() => Alerts.runDailyChecks(), 800);
    }
  };

  window.App = App;
  document.addEventListener('DOMContentLoaded', App.init);
})();
