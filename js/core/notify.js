/* ============================================================
 * notify.js — 系统消息通知（Notification API + Toast 兜底）
 * ============================================================ */
(function () {
  'use strict';
  const Notify = {
    // 首次调用请求权限
    ensurePermission() {
      if (!('Notification' in window)) return false;
      if (Notification.permission === 'default') {
        try { Notification.requestPermission(); } catch (e) { /* 忽略 */ }
      }
      return Notification.permission === 'granted';
    },
    send(title, body) {
      if (Notify.ensurePermission()) {
        try { new Notification(title, { body }); return; } catch (e) { /* 走兜底 */ }
      }
      Toast.show('🔔 ' + title + '：' + body, 'info', 5000);
    }
  };
  window.Notify = Notify;
})();
