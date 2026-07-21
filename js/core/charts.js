/* ============================================================
 * charts.js — 纯SVG图表库（零依赖，离线可用）
 * 返回 SVG 字符串，模块自行 innerHTML
 * ============================================================ */
(function () {
  'use strict';

  function svgOpen(w, h) { return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" height="' + h + '" xmlns="http://www.w3.org/2000/svg">'; }

  const Charts = {
    // 柱状图：data=[{label, value, highlight}], opts={height, unit, color}
    bar(data, opts) {
      opts = opts || {};
      const W = 680, H = opts.height || 160, padB = 24, padT = 16, padL = 8, padR = 8;
      const max = Math.max.apply(null, data.map(d => d.value).concat([1]));
      const n = data.length || 1;
      const iw = (W - padL - padR) / n;
      const bw = Math.min(44, iw * 0.55);
      let s = svgOpen(W, H);
      for (let i = 0; i < n; i++) {
        const d = data[i];
        const bh = Math.max(2, (d.value / max) * (H - padB - padT));
        const x = padL + i * iw + (iw - bw) / 2;
        const y = H - padB - bh;
        const color = d.highlight ? (opts.hiColor || '#000') : (opts.color || '#bfbfbf');
        s += '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + bh + '" rx="4" fill="' + color + '">'
          + '<title>' + U.esc(d.label) + '：' + d.value + (opts.unit || '') + '</title></rect>';
        s += '<text x="' + (x + bw / 2) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="11" fill="#8c8c8c">' + U.esc(d.label) + '</text>';
        if (d.value > 0) s += '<text x="' + (x + bw / 2) + '" y="' + (y - 4) + '" text-anchor="middle" font-size="11" fill="#595959">' + d.value + '</text>';
      }
      return s + '</svg>';
    },

    // 环形图：data=[{label, value, color}]，中心显示总数
    donut(data, opts) {
      opts = opts || {};
      const W = 680, H = opts.height || 190;
      const cx = 110, cy = H / 2, r = 66, ir = 40;
      const total = U.sum(data.map(d => d.value));
      let s = svgOpen(W, H);
      if (total === 0) {
        s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#f0f0f0" stroke-width="' + (r - ir) + '"/>';
        s += '<text x="' + cx + '" y="' + (cy + 5) + '" text-anchor="middle" font-size="13" fill="#bfbfbf">暂无数据</text>';
      } else {
        let a0 = -Math.PI / 2;
        data.forEach(d => {
          if (d.value <= 0) return;
          const frac = d.value / total;
          const a1 = a0 + frac * Math.PI * 2;
          const large = frac > 0.5 ? 1 : 0;
          const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
          const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
          const xi1 = cx + ir * Math.cos(a1), yi1 = cy + ir * Math.sin(a1);
          const xi0 = cx + ir * Math.cos(a0), yi0 = cy + ir * Math.sin(a0);
          s += '<path d="M' + x0 + ' ' + y0 + ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1 + ' ' + y1
            + ' L' + xi1 + ' ' + yi1 + ' A' + ir + ' ' + ir + ' 0 ' + large + ' 0 ' + xi0 + ' ' + yi0 + ' Z" fill="' + d.color + '">'
            + '<title>' + U.esc(d.label) + '：' + d.value + '次 (' + Math.round(frac * 100) + '%)</title></path>';
          a0 = a1;
        });
        s += '<text x="' + cx + '" y="' + (cy - 2) + '" text-anchor="middle" font-size="22" font-weight="500" fill="#000">' + total + '</text>';
        s += '<text x="' + cx + '" y="' + (cy + 16) + '" text-anchor="middle" font-size="11" fill="#8c8c8c">总计</text>';
      }
      // 图例
      let ly = 24;
      data.forEach(d => {
        const pctN = total ? Math.round(d.value / total * 100) : 0;
        s += '<rect x="230" y="' + (ly - 10) + '" width="10" height="10" rx="2" fill="' + d.color + '"/>';
        s += '<text x="246" y="' + ly + '" font-size="12" fill="#262626">' + U.esc(d.label) + '</text>';
        s += '<text x="660" y="' + ly + '" font-size="12" text-anchor="end" fill="#595959">' + d.value + '次 · ' + pctN + '%</text>';
        ly += 24;
      });
      return s + '</svg>';
    },

    // 折线图：data=[{label, value}]，opts={height, unit, min, max, warnBelow}
    line(data, opts) {
      opts = opts || {};
      const W = 680, H = opts.height || 170, padB = 22, padT = 14, padL = 30, padR = 10;
      const vals = data.map(d => d.value);
      const lo = opts.min != null ? opts.min : Math.min.apply(null, vals.concat([0]));
      const hi = opts.max != null ? opts.max : Math.max.apply(null, vals.concat([10]));
      const n = data.length;
      if (n === 0) return svgOpen(W, H) + '<text x="340" y="90" text-anchor="middle" fill="#bfbfbf" font-size="13">暂无数据</text></svg>';
      const X = i => padL + (n === 1 ? (W - padL - padR) / 2 : i * (W - padL - padR) / (n - 1));
      const Y = v => H - padB - ((v - lo) / ((hi - lo) || 1)) * (H - padB - padT);
      let s = svgOpen(W, H);
      // 预警线
      if (opts.warnBelow != null) {
        s += '<line x1="' + padL + '" y1="' + Y(opts.warnBelow) + '" x2="' + (W - padR) + '" y2="' + Y(opts.warnBelow) + '" stroke="#cf1322" stroke-dasharray="4 4" stroke-width="1"/>';
        s += '<text x="' + (W - padR) + '" y="' + (Y(opts.warnBelow) - 4) + '" text-anchor="end" font-size="10" fill="#cf1322">预警线 ' + opts.warnBelow + '</text>';
      }
      let path = '';
      data.forEach((d, i) => { path += (i === 0 ? 'M' : 'L') + X(i) + ' ' + Y(d.value); });
      s += '<path d="' + path + '" fill="none" stroke="#000" stroke-width="2"/>';
      data.forEach((d, i) => {
        const bad = opts.warnBelow != null && d.value < opts.warnBelow;
        s += '<circle cx="' + X(i) + '" cy="' + Y(d.value) + '" r="4" fill="' + (bad ? '#cf1322' : '#000') + '"><title>' + U.esc(d.label) + '：' + d.value + (opts.unit || '') + '</title></circle>';
        if (n <= 12) s += '<text x="' + X(i) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="10" fill="#8c8c8c">' + U.esc(d.label) + '</text>';
      });
      return s + '</svg>';
    },

    // 进度条（HTML，非SVG）：pct 0-100
    progressBar(pct, color, height) {
      pct = U.clamp(pct, 0, 100);
      return '<div class="pbar" style="height:' + (height || 8) + 'px"><div class="pbar-fill" style="width:0%;background:' + color + '" data-w="' + pct + '"></div></div>';
    }
  };

  window.Charts = Charts;
})();
