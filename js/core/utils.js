/* ============================================================
 * utils.js — 通用工具函数（纯函数，无副作用）
 * ============================================================ */
(function () {
  'use strict';
  const DAY_MS = 86400000;

  const U = {
    DAY_MS,
    // 生成唯一ID（时间戳+随机，足够本地使用）
    uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); },
    // 'YYYY-MM-DD' 本地时区日期键
    dkey(d) {
      d = d || new Date();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return d.getFullYear() + '-' + m + '-' + day;
    },
    // 'M.D' 短日期（错题列表显示用）
    shortDate(d) { d = d ? new Date(d) : new Date(); return (d.getMonth() + 1) + '.' + d.getDate(); },
    // 'HH:MM'
    hm(d) { d = d || new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); },
    // 距离目标日期的天数（今天为0）
    daysTo(dateStr) {
      const t = new Date(dateStr + 'T00:00:00');
      const n = new Date(); n.setHours(0, 0, 0, 0);
      return Math.round((t - n) / DAY_MS);
    },
    // 今天星期几：0=周一 ... 6=周日
    dow(d) { d = d || new Date(); return (d.getDay() + 6) % 7; },
    // 本周周一的 Date
    weekMonday(d) {
      d = d || new Date(); const t = new Date(d); t.setHours(0, 0, 0, 0);
      t.setDate(t.getDate() - U.dow(t)); return t;
    },
    // 本周7个日期键
    weekKeys(d) {
      const m = U.weekMonday(d); const out = [];
      for (let i = 0; i < 7; i++) { const t = new Date(m); t.setDate(m.getDate() + i); out.push(U.dkey(t)); }
      return out;
    },
    // 日期键 → 'M.D（周X）'
    keyLabel(k) {
      const d = new Date(k + 'T00:00:00');
      const wk = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][U.dow(d)];
      return (d.getMonth() + 1) + '.' + d.getDate() + ' ' + wk;
    },
    esc(s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },
    clamp(v, a, b) { return Math.max(a, Math.min(b, v)); },
    pct(done, total) { return total > 0 ? Math.round(done / total * 100) : 0; },
    sum(arr) { return (arr || []).reduce((a, b) => a + (+b || 0), 0); },
    avg(arr) { return arr && arr.length ? U.sum(arr) / arr.length : 0; },
    round1(v) { return Math.round(v * 10) / 10; },
    // 对象数组按字段计数 → {key: n}
    countBy(arr, fn) { const o = {}; (arr || []).forEach(x => { const k = fn(x); if (k != null) o[k] = (o[k] || 0) + 1; }); return o; },
    // 取计数Top N → [{key,count}]
    topN(countObj, n) {
      return Object.keys(countObj || {}).map(k => ({ key: k, count: countObj[k] }))
        .sort((a, b) => b.count - a.count).slice(0, n || 2);
    },
    // 最近n天的日期键数组（含今天）
    lastNDays(n) {
      const out = []; const t = new Date();
      for (let i = n - 1; i >= 0; i--) { const d = new Date(t); d.setDate(t.getDate() - i); out.push(U.dkey(d)); }
      return out;
    },
    // 判断日期键是否属于本周
    inThisWeek(k) { return U.weekKeys().indexOf(k) >= 0; },
    // 防抖
    debounce(fn, ms) { let t; return function () { clearTimeout(t); const a = arguments, s = this; t = setTimeout(() => fn.apply(s, a), ms); }; },
    // 深拷贝（JSON安全）
    clone(o) { return JSON.parse(JSON.stringify(o)); },
    // 下载文本文件
    download(filename, text) {
      const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = filename;
      document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 100);
    },
    // 全局事件
    on(evt, fn) { document.addEventListener(evt, fn); },
    emit(evt, detail) { document.dispatchEvent(new CustomEvent(evt, { detail })); }
  };

  window.U = U;
})();
