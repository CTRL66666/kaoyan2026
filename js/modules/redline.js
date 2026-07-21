/* ============================================================
 * redline.js — 红线禁令：绝对禁令墙 + 防呆检查清单
 * ============================================================ */
(function () {
  'use strict';

  function render(el) {
    // 禁令墙
    const wall = DB.RED_LINES.map(r =>
      '<div class="red-item">'
      + '<div class="red-icon">' + r.icon + '</div>'
      + '<div><div class="red-title">' + U.esc(r.title) + '</div>'
      + '<div class="red-desc">' + U.esc(r.desc) + '</div></div>'
      + '</div>'
    ).join('');

    // 检查清单（状态存 sessionStorage，重置按钮清零；做题前必做，不持久化到隔天）
    const saved = JSON.parse(sessionStorage.getItem('foolproof_check') || '[]');
    const checks = DB.FOOLPROOF_CHECKLIST.map((c, i) =>
      '<label class="check-row"><input type="checkbox" data-i="' + i + '"' + (saved[i] ? ' checked' : '') + '><span class="box"></span><span>' + U.esc(c) + '</span></label>'
    ).join('');
    const doneN = saved.filter(Boolean).length;

    el.innerHTML =
      '<div class="card card-redline"><div class="card-title card-title-red">🚫 绝对禁令墙</div>' + wall + '</div>'

      + '<div class="card"><div class="card-title">防呆检查清单（做题前必做） <span class="muted-sm">' + doneN + '/5</span></div>'
      + checks
      + '<div class="btn-row" style="margin-top:10px">'
      + '<button class="btn btn-primary" id="rl-all">全部确认</button>'
      + '<button class="btn btn-ghost" id="rl-reset">重置清单</button>'
      + '</div></div>'

      + '<div class="card"><div class="card-title">违规记录</div><div id="rl-violations" class="muted-sm">硬件冲动拦截记录见「心理状态」模块的冲动统计。</div></div>';

    bind(el);
  }

  function bind(el) {
    el.querySelectorAll('.check-row input').forEach(cb => {
      cb.onchange = () => {
        const arr = JSON.parse(sessionStorage.getItem('foolproof_check') || '[false,false,false,false,false]');
        arr[+cb.getAttribute('data-i')] = cb.checked;
        sessionStorage.setItem('foolproof_check', JSON.stringify(arr));
        if (arr.filter(Boolean).length === 5) Toast.success('✓ 检查完毕，可以开始做题。保持流程不走样。');
        App.refresh();
      };
    });
    el.querySelector('#rl-all').onclick = () => {
      sessionStorage.setItem('foolproof_check', JSON.stringify([true, true, true, true, true]));
      Toast.success('✓ 全部确认，开工'); App.refresh();
    };
    el.querySelector('#rl-reset').onclick = () => {
      sessionStorage.setItem('foolproof_check', JSON.stringify([false, false, false, false, false]));
      App.refresh();
    };
  }

  window.RedlineModule = { render };
})();
