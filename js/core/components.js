/* ============================================================
 * components.js — Toast 通知 / Modal 弹窗 / 通用表单弹窗
 * ============================================================ */
(function () {
  'use strict';

  // ---------- Toast ----------
  const Toast = {
    show(msg, type, ms) {
      const wrap = document.getElementById('toast-wrap');
      if (!wrap) return;
      const el = document.createElement('div');
      el.className = 'toast toast-' + (type || 'info');
      el.innerHTML = '<span>' + msg + '</span><button class="toast-x" aria-label="关闭">×</button>';
      wrap.appendChild(el);
      requestAnimationFrame(() => el.classList.add('show'));
      const close = () => { el.classList.remove('show'); setTimeout(() => el.remove(), 200); };
      el.querySelector('.toast-x').onclick = close;
      setTimeout(close, ms || 3000);
    },
    success(m) { Toast.show(m, 'success'); },
    warn(m) { Toast.show(m, 'warn', 4200); },
    danger(m) { Toast.show(m, 'danger', 5000); }
  };

  // ---------- Modal ----------
  const Modal = {
    // opts: {title, html, actions:[{label, kind, onClick(close)}], wide, onClose, dismissable}
    open(opts) {
      Modal.close();
      const ov = document.createElement('div');
      ov.className = 'modal-overlay';
      ov.id = 'modal-overlay';
      const box = document.createElement('div');
      box.className = 'modal' + (opts.wide ? ' modal-wide' : '');
      let acts = '';
      (opts.actions || []).forEach((a, i) => {
        acts += '<button class="btn ' + (a.kind || 'btn-ghost') + '" data-act="' + i + '">' + U.esc(a.label) + '</button>';
      });
      box.innerHTML =
        '<div class="modal-head"><span class="modal-title">' + opts.title + '</span>' +
        (opts.dismissable === false ? '' : '<button class="modal-x" aria-label="关闭">×</button>') + '</div>' +
        '<div class="modal-body">' + opts.html + '</div>' +
        (acts ? '<div class="modal-foot">' + acts + '</div>' : '');
      ov.appendChild(box);
      document.body.appendChild(ov);
      document.body.style.overflow = 'hidden';
      const close = () => { Modal.close(); if (opts.onClose) opts.onClose(); };
      const x = box.querySelector('.modal-x');
      if (x) x.onclick = close;
      if (opts.dismissable !== false) ov.addEventListener('click', e => { if (e.target === ov) close(); });
      (opts.actions || []).forEach((a, i) => {
        box.querySelector('[data-act="' + i + '"]').onclick = () => { if (a.onClick) a.onClick(close); else close(); };
      });
      requestAnimationFrame(() => ov.classList.add('show'));
      return close;
    },
    close() {
      const ov = document.getElementById('modal-overlay');
      if (ov) { ov.remove(); document.body.style.overflow = ''; }
    },
    confirm(title, html, okLabel, onOk, danger) {
      Modal.open({
        title, html,
        actions: [
          { label: '取消', kind: 'btn-ghost' },
          { label: okLabel || '确定', kind: danger ? 'btn-danger' : 'btn-primary', onClick: close => { close(); onOk && onOk(); } }
        ]
      });
    }
  };

  window.Toast = Toast;
  window.Modal = Modal;
})();
