/* ============================================================
 * paper-extract.plugin.js — 试卷提取（单文件插件）
 * ------------------------------------------------------------
 * 设计边界（重要）：
 *   · 不引 pdf.js / 不接预览 / 不用 Python；PDF 解析全部走站点注入的 window.PdfKit。
 *   · 插件只做：PDF 文字层 bbox → 题号切题 → 扫描页 VLM 定位 → 裁图 → JSON。
 *   · 宿主桥契约（由站点侧提供，约 25 行）：
 *       window.PdfKit = {
 *         open: function (arrayBuffer) { return Promise<pdfjs PDFDocumentProxy> },
 *         itemsToText?: function (items) { return string }   // 可选，复用站内分行口径
 *       }
 *     插件对 doc/page 只用 pdf.js 标准 API：
 *       doc.numPages / doc.getPage(n)
 *       page.getViewport({scale}) / page.getTextContent() / page.render({canvasContext, viewport})
 *   · 若桥尚未就绪，插件会明确提示，不会偷偷去 CDN 拉第二套引擎。
 *
 * 安装：插件中心 → 粘贴导入 / 选择本文件（.js）。
 * ============================================================ */
;(function () {
  'use strict'

  var VERSION = '1.0.0'
  var AI_CTX = 'plugin.paper'
  var MAX_PAGES_DEFAULT = 40
  var TEXT_MIN = 80
  var LOW_CONF_DEFAULT = 0.7

  /* ---------------- 提示词（与本地 Python 版同义，按浏览器场景收敛） ---------------- */
  var Q_SCHEMA = '{"no":1,"stem":"题干","type":"choice|fill|solve|essay",'
    + '"options":["A. .."],"answer":"卷面答案","solution":"卷面解析","noAnswer":true,'
    + '"topicName":"考点","score":数字或null,"star":1-5,"sourcePages":[1],"confidence":0.95,'
    + '"hasFigure":false,"figureKind":"","figureDesc":""}'

  var SYS_TEXT = '你是考研试卷数字化工程师。用户给你一份试卷其中几页的文字层提取（可能含页眉页脚、双栏错序、公式残缺、题目跨页）。'
    + '任务：把每一道题完整还原成结构化 JSON。'
    + '【铁律】①只做搬运，严禁增删题意、严禁编造卷面没有的答案或解析；卷面没给答案就 answer:"" 且 noAnswer:true。'
    + '②题目跨页时合并为一题（sourcePages 给全部页码）。'
    + '③公式保留 LaTeX（$...$），拿不准就降低 confidence，不要猜。'
    + '④题号 no 用卷面原题号；页眉页脚/注意事项/封面文字一律丢弃。'
    + '⑤star 为难度粗评（1=送分，5=压轴）。'
    + '只输出 JSON：{"questions":[' + Q_SCHEMA + ']}'

  var SYS_VISION = '你是考研试卷数字化工程师。用户给你一页试卷的高清图片（扫描/拍照/图文混排）。'
    + '任务：逐题识别并还原成结构化 JSON。'
    + '【铁律】①忠实转录，不补题、不编答案；看不清用 □ 占位并降低 confidence。'
    + '②卷面没答案就 answer:"" + noAnswer:true，严禁用你的知识顺手解题冒充卷面答案。'
    + '③公式用 LaTeX（$...$）。④题号 no 用卷面原题号；页眉页脚/水印/广告丢弃。'
    + '⑤题干含函数图像/几何图/表格/流程图时 hasFigure=true，figureKind 填类别，figureDesc 用 ≤80 字描述图中信息。'
    + '只输出 JSON：{"questions":[' + Q_SCHEMA + ']}'

  var SYS_LOCATE = '你是试卷版面分析器。给你一整页试卷图片，请找出每一道题在外层页面中的位置。'
    + '要求：①按从上到下顺序，每题一条；②box 为 [x0,y0,x1,y1]，相对整页宽高的归一化坐标，取值 0-1000；'
    + '③box 必须完整包住该题题干、选项与配图/表格，左边界包含题号前缀（如“一、”“1.”），右边界包含整行公式，不侵入相邻题；'
    + '④带图时 hasFigure=true，并在 figureBox 给出配图本身的框；⑤不要输出页眉页脚、水印、二维码、页码。'
    + '只输出 JSON：{"questions":[{"no":1,"box":[0,0,1000,1000],"hasFigure":false,"figureBox":[0,0,0,0],"confidence":0.9}]}'

  /* ---------------- 小工具 ---------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
    })
  }
  function flat(s) { return String(s == null ? '' : s).replace(/\s+/g, '') }
  function trunc(s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n) + '…' : s }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)) }
  function num(v, d) { var n = Number(v); return isFinite(n) ? n : d }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms) }) }

  function pool(items, conc, worker, onDone) {
    var list = (items || []).slice()
    var out = []
    if (!list.length) return Promise.resolve(out)
    var idx = 0, done = 0, active = 0
    return new Promise(function (resolve, reject) {
      function next() {
        if (done === list.length) return resolve(out)
        while (active < conc && idx < list.length) {
          (function (i) {
            active++
            Promise.resolve().then(function () { return worker(list[i], i) })
              .then(function (r) { out[i] = r })
              .catch(function (e) { out[i] = { __err: e } })
              .then(function () {
                active--; done++
                if (onDone) { try { onDone(done, list.length) } catch (e2) { } }
                if (done === list.length) resolve(out); else next()
              })
          })(idx++)
        }
      }
      next()
    })
  }

  /* ---------------- 噪声 / 题号 / 题干 ---------------- */
  var NOISE_RE = /(公众号|B站|抖音|小红书|专注[^。]{0,8}考研|控制考研咨询|vx\s*[:：]|QQ群|扫码|二维码|水印|第\s*\d+\s*页|共\s*\d+\s*页|机密|启用前|考生注意事项|科目代码|科目名称|报考单位|准考证|答题纸|考试时间|满分\s*\d+|姓名\s*[:：]?|得分\s*[:：])/
  var NOISE_STRIP = [
    /【[^】]{0,40}(?:公众号|考研|控制|B站|抖音|小红书)[^】]{0,40}】/g,
    /(?:公众号|B站|抖音|小红书)\s*[/、，,：:]?\s*[^\s，。；;]{0,40}/g,
    /(?:控制考研咨询|专注[^。\s]{0,12}考研)\s*[^\s，。；;]{0,40}/g,
    /\bvx\s*[:：]\s*[A-Za-z0-9_\-]+/g,
    /(?:QQ群|扫码|二维码|水印)[^\s，。；;]{0,40}/g
  ]
  function stripNoise(s) {
    var out = String(s == null ? '' : s)
    NOISE_STRIP.forEach(function (re) { out = out.replace(re, ' ') })
    return out.replace(/\s{2,}/g, ' ').trim()
  }
  function isNoise(s) {
    var raw = flat(s)
    if (!raw) return false
    var t = flat(stripNoise(s))
    if (!t) return true
    if (t.length > 160) return false
    if (NOISE_RE.test(t)) return true
    if ((/大学|学院|攻读硕士|研究生入学考试|研究生招生/.test(t)) && /考试|模考/.test(t) && t.indexOf('题') < 0 && t.length < 90) return true
    if (/^[一二三四五六七八九十]{1,3}\s*[、.．]\s*(选择|填空|解答|计算|证明|综合|判断|简答|论述)题/.test(t) && t.length < 60) return true
    if ((/模拟卷|模考卷|模拟考试|考研真题/.test(t)) && t.indexOf('题') < 0 && t.length < 60) return true
    if (/^[（(]?\d{1,3}[)）]?$/.test(t)) return true
    return false
  }
  function looksTruncated(s) {
    s = String(s || '').trim()
    return !!s && s.length > 18 && '。！？；：)）]】.”"\''
      .indexOf(s.charAt(s.length - 1)) < 0
  }
  function inferType(q) {
    var t = String(q && q.type || '')
    if (['choice', 'fill', 'solve', 'essay'].indexOf(t) >= 0) return t
    var o = (q && q.options) || []
    return Array.isArray(o) && o.length >= 2 ? (o.length === 4 ? 'choice' : 'solve') : 'solve'
  }
  function normQuestion(q, g) {
    q = q || {}
    var no = q.no
    if (no != null && no !== '') { var n = parseInt(String(no).replace(/[^\d]/g, ''), 10); no = isFinite(n) ? n : null } else no = null
    var opts = Array.isArray(q.options) ? q.options.filter(function (x) { return String(x || '').trim() }) .map(String) : []
    var stem = stripNoise(q.stem || '').trim()
    var conf = q.confidence == null ? null : num(q.confidence, null)
    return {
      no: no, stem: stem, type: inferType(q), options: opts,
      answer: q.answer == null ? '' : String(q.answer).trim(),
      solution: q.solution == null ? '' : String(q.solution).trim(),
      noAnswer: !!q.noAnswer || !String(q.answer || '').trim(),
      topicName: q.topicName == null ? '' : String(q.topicName).trim(),
      score: typeof q.score === 'number' && q.score > 0 ? q.score : null,
      star: clamp(Math.round(num(q.star, 3)) || 3, 1, 5),
      sourcePages: Array.isArray(q.sourcePages) && q.sourcePages.length
        ? q.sourcePages.map(Number).filter(function (x) { return x > 0 }) : (g && g.pages ? g.pages.slice() : []),
      confidence: conf, hasFigure: !!q.hasFigure,
      figureKind: q.figureKind == null ? '' : String(q.figureKind).trim(),
      figureDesc: q.figureDesc == null ? '' : String(q.figureDesc).trim(),
      _groupPages: g && g.pages ? g.pages.slice() : []
    }
  }

  /* ---------------- PDF：文字行 / 渲染 ---------------- */
  async function openPdf(buf) {
    var k = window.PdfKit
    if (k && typeof k.open === 'function') return await k.open(buf)
    var lib = window.pdfjsLib
    if (lib && typeof lib.getDocument === 'function') {
      // 仅开发兜底：站点必须优先注入 window.PdfKit
      return await lib.getDocument({ data: buf }).promise
    }
    throw new Error('PDF 引擎未就绪：需要站点注入 window.PdfKit.open(ArrayBuffer) → pdfjs 文档。')
  }

  function runsFromItems(items, H) {
    var out = []
    ;(items || []).forEach(function (it) {
      var s = String(it && it.str || '')
      if (!s.trim()) return
      var tr = it.transform || []
      var x = num(tr[4], 0), y = num(tr[5], 0)
      var h = Math.max(1, num(it.height, 10))
      var w = Math.max(0, num(it.width, 0))
      out.push({
        s: s, x: x, w: w, h: h,
        top: H - (y + h * 0.8),
        bottom: H - (y - h * 0.2),
        eol: !!it.hasEOL
      })
    })
    out.sort(function (a, b) { return a.top - b.top || a.x - b.x })
    return out
  }

  function linesFromItems(items, H) {
    var runs = runsFromItems(items, H)
    var lines = [], cur = null
    function close() {
      if (!cur || !cur.runs.length) { cur = null; return }
      cur.runs.sort(function (a, b) { return a.x - b.x })
      var text = '', prev = null
      cur.runs.forEach(function (r) {
        if (prev && /[A-Za-z0-9]$/.test(prev.s) && /^[A-Za-z0-9]/.test(r.s) && r.x - (prev.x + prev.w) > 1.5) text += ' '
        text += r.s
        prev = r
      })
      cur.text = text.trim()
      cur.x0 = Math.min.apply(null, cur.runs.map(function (r) { return r.x }))
      cur.x1 = Math.max.apply(null, cur.runs.map(function (r) { return r.x + r.w }))
      cur.size = Math.max.apply(null, cur.runs.map(function (r) { return r.h }))
      if (cur.text) lines.push(cur)
      cur = null
    }
    runs.forEach(function (r) {
      if (!cur) { cur = { runs: [r], top: r.top, bottom: r.bottom, size: r.h }; return }
      var dy = Math.abs(r.top - cur.top)
      var tol = Math.max(2.2, 0.6 * Math.max(cur.size, r.h))
      if (dy > tol) { close(); cur = { runs: [r], top: r.top, bottom: r.bottom, size: r.h }; return }
      cur.runs.push(r)
      cur.top = Math.min(cur.top, r.top)
      cur.bottom = Math.max(cur.bottom, r.bottom)
      cur.size = Math.max(cur.size, r.h)
    })
    close()
    return lines
  }

  async function pageInfo(page, no) {
    var vp = page.getViewport({ scale: 1 })
    var W = vp.width, H = vp.height
    var tc = await page.getTextContent()
    var lines = linesFromItems(tc && tc.items, H)
    var chars = flat(lines.map(function (l) { return l.text }).join(''))
    var pua = 0, boxy = 0
    for (var i = 0; i < chars.length; i++) {
      var c = chars.charCodeAt(i)
      if (c >= 0xE000 && c <= 0xF8FF) pua++
    }
    boxy = (chars.match(/[\uFFFD\u25A1\u25A0\u25AF]/g) || []).length
    var garbled = chars.length > 30 && (pua > 30 || boxy >= 6)
    var kind = chars.length >= TEXT_MIN && lines.length >= 4 && !garbled ? 'text' : 'scan'
    return { page: page, no: no, W: W, H: H, lines: lines, chars: chars.length, garbled: garbled, kind: kind }
  }

  function bodySize(lines) {
    var vals = []
    lines.forEach(function (l) {
      var n = Math.min(40, flat(l.text).length)
      for (var i = 0; i < n; i++) vals.push(l.size)
    })
    if (!vals.length) return 10
    vals.sort(function (a, b) { return a - b })
    return vals[Math.floor(vals.length / 2)]
  }

  function contentBounds(lines, H) {
    var body = lines.filter(function (l) { return l.bottom < H * 0.95 && flat(l.text).length >= 2 })
    if (!body.length) body = lines
    if (!body.length) return { x0: 0, top: 0, x1: 595, bottom: H }
    return {
      x0: Math.min.apply(null, body.map(function (l) { return l.x0 })),
      top: Math.min.apply(null, body.map(function (l) { return l.top })),
      x1: Math.max.apply(null, body.map(function (l) { return l.x1 })),
      bottom: Math.max.apply(null, body.map(function (l) { return l.bottom })) + 6
    }
  }

  async function renderPage(page, scale) {
    var vp = page.getViewport({ scale: scale })
    var c = document.createElement('canvas')
    c.width = Math.max(1, Math.ceil(vp.width))
    c.height = Math.max(1, Math.ceil(vp.height))
    var g = c.getContext('2d', { alpha: false })
    g.fillStyle = '#fff'
    g.fillRect(0, 0, c.width, c.height)
    await page.render({ canvasContext: g, viewport: vp }).promise
    return c
  }

  function canvasDataUrl(c, maxEdge, quality) {
    var w = c.width, h = c.height
    if (max(w, h) > maxEdge) {
      var s = maxEdge / max(w, h)
      var d = document.createElement('canvas')
      d.width = Math.max(1, Math.round(w * s)); d.height = Math.max(1, Math.round(h * s))
      var dg = d.getContext('2d'); dg.fillStyle = '#fff'; dg.fillRect(0, 0, d.width, d.height)
      dg.drawImage(c, 0, 0, d.width, d.height)
      c = d
    }
    var url = c.toDataURL('image/webp', quality)
    if (url.indexOf('data:image/webp') !== 0) url = c.toDataURL('image/jpeg', quality)
    return url
  }

  function cropCanvas(src, rectPt, scale) {
    var x = Math.max(0, Math.floor(rectPt.x0 * scale))
    var y = Math.max(0, Math.floor(rectPt.top * scale))
    var w = Math.max(1, Math.ceil((rectPt.x1 - rectPt.x0) * scale))
    var h = Math.max(1, Math.ceil((rectPt.bottom - rectPt.top) * scale))
    w = Math.min(w, src.width - x); h = Math.min(h, src.height - y)
    var c = document.createElement('canvas'); c.width = w; c.height = h
    var g = c.getContext('2d', { alpha: false }); g.fillStyle = '#fff'; g.fillRect(0, 0, w, h)
    g.drawImage(src, x, y, w, h, 0, 0, w, h)
    return c
  }

  function composeVertical(cs) {
    if (!cs.length) return null
    if (cs.length === 1) return cs[0]
    var W = Math.max.apply(null, cs.map(function (c) { return c.width }))
    var H = cs.reduce(function (a, c) { return a + c.height + 8 }, 0)
    var out = document.createElement('canvas'); out.width = W; out.height = H
    var g = out.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, W, H)
    var y = 0
    cs.forEach(function (c) { g.drawImage(c, 0, y); y += c.height + 8 })
    return out
  }

  /* ---------------- 数字版：题号锚点 / 题区间 ---------------- */
  var RE_A = /^\s*(\d{1,2})\s*[.．、]\s*(?=[^\d\s])/
  var RE_P = /^\s*[（(]\s*(\d{1,2})\s*[)）]\s*(?=[^\d\s])/
  var RE_C = /^\s*第\s*(\d{1,2})\s*题\s*[：:、.．]?\s*(?=[^\d\s])/
  var RE_SECTION = /^\s*(?:[一二三四五六七八九十]{1,3}\s*[、.．]|第[一二三四五六七八九十]{1,3}\s*部分)/
  function sectionType(t) {
    if (/选择/.test(t)) return 'choice'
    if (/填空/.test(t)) return 'fill'
    if (/解答|计算|证明|综合/.test(t)) return 'solve'
    if (/写作|作文/.test(t)) return 'essay'
    return ''
  }
  function findAnchors(lines, b, body, allowParen) {
    var out = [], last = 0
    var leftMax = b.x0 + Math.max(16, (b.x1 - b.x0) * 0.08)
    lines.forEach(function (l) {
      var t = String(l.text || '').trim()
      if (!t || t.length < 4) return
      if (l.top < b.top - 2 || l.bottom > b.bottom + 10) return
      if (l.size < body * 0.8) return
      if (l.x0 > leftMax) return
      if (isNoise(t)) return
      var m = RE_A.exec(t), no = 0
      if (m) no = +m[1]
      else if (allowParen) { m = RE_P.exec(t); if (m) no = +m[1] }
      if (!m || no < 1 || no > 80) return
      if (out.length && no <= last) return
      last = no
      out.push({ no: no, line: l, text: t, section: '' })
    })
    return out
  }
  function buildTextBlocks(pinfos) {
    var anchors = []
    pinfos.forEach(function (pi) {
      if (pi.kind !== 'text' || !pi.lines.length) return
      var b = contentBounds(pi.lines, pi.H)
      var body = bodySize(pi.lines)
      var as = findAnchors(pi.lines, b, body, false)
      if (as.length < 2) as = findAnchors(pi.lines, b, body, true)
      as.forEach(function (a) {
        a.pi = pi
        a.bounds = b
        a.body = body
        var sec = ''
        pi.lines.forEach(function (l) { if (RE_SECTION.test(String(l.text || '').trim()) && l.top < a.line.top) sec = sectionType(l.text) || sec })
        a.section = sec
        anchors.push(a)
      })
    })
    anchors.sort(function (a, b) { return a.pi.no - b.pi.no || a.line.top - b.line.top })
    var blocks = []
    for (var i = 0; i < anchors.length; i++) {
      var a = anchors[i], pi = a.pi
      var nxt = null
      for (var j = i + 1; j < anchors.length; j++) { if (anchors[j].pi.no >= pi.no) { nxt = anchors[j]; break } }
      var lastLine = null
      for (var k = 0; k < pi.lines.length; k++) if (pi.lines[k].top >= a.line.top - 1) lastLine = pi.lines[k]
      var lastBottom = lastLine ? lastLine.bottom : a.line.bottom
      var atBottom = lastBottom >= a.bounds.bottom - Math.max(34, (a.bounds.bottom - a.bounds.top) * 0.07)
      var segs = []
      if (!nxt) {
        segs.push({ page: pi.no, rect: { x0: a.bounds.x0, top: a.line.top - 2, x1: a.bounds.x1, bottom: Math.min(a.bounds.bottom, lastBottom + 8) } })
      } else if (nxt.pi.no === pi.no) {
        var end = nxt.line.top - 4
        if (end > a.line.top + 8) segs.push({ page: pi.no, rect: { x0: a.bounds.x0, top: a.line.top - 2, x1: a.bounds.x1, bottom: end } })
      } else {
        segs.push({ page: pi.no, rect: { x0: a.bounds.x0, top: a.line.top - 2, x1: a.bounds.x1, bottom: Math.min(a.bounds.bottom, lastBottom + 8) } })
        if (atBottom) {
          for (var p = pi.no + 1; p < nxt.pi.no; p++) {
            var mid = pinfos[p - 1]
            if (mid && mid.kind === 'text') {
              var mb = contentBounds(mid.lines, mid.H)
              segs.push({ page: p, rect: { x0: mb.x0, top: mb.top, x1: mb.x1, bottom: mb.bottom } })
            }
          }
          var np = nxt.pi, nb = nxt.bounds
          if (nxt.line.top - 4 > nb.top + 16) {
            segs.push({ page: np.no, rect: { x0: nb.x0, top: nb.top, x1: nb.x1, bottom: nxt.line.top - 4 } })
          }
        }
      }
      if (!segs.length) continue
      blocks.push({
        no: a.no, pageStart: pi.no, pageEnd: segs[segs.length - 1].page,
        segments: segs, hasFigure: false, figureRects: [], geometry: 'text', section: a.section
      })
    }
    return blocks
  }

  /* ---------------- 数字版配图：文字涂白 + 墨迹连通域 ---------------- */
  async function detectFigures(pi) {
    if (!pi.lines.length) return []
    var scale = Math.min(1.6, 1400 / pi.W)
    var canvas = await renderPage(pi.page, scale)
    var g = canvas.getContext('2d')
    g.fillStyle = '#fff'
    pi.lines.forEach(function (l) {
      g.fillRect(Math.max(0, (l.x0 - 2) * scale), Math.max(0, (l.top - 2) * scale),
        Math.max(1, (l.x1 - l.x0 + 4) * scale), Math.max(1, (l.bottom - l.top + 4) * scale))
    })
    var img = g.getImageData(0, 0, canvas.width, canvas.height).data
    var block = 4
    var gw = Math.floor(canvas.width / block), gh = Math.floor(canvas.height / block)
    if (gw < 2 || gh < 2) return []
    var grid = new Uint8Array(gw * gh)
    for (var gy = 0; gy < gh; gy++) {
      for (var gx = 0; gx < gw; gx++) {
        var dark = 0
        for (var yy = 0; yy < block; yy++) {
          for (var xx = 0; xx < block; xx++) {
            var i = (((gy * block + yy) * canvas.width) + (gx * block + xx)) * 4
            if (img[i] < 175 && img[i + 1] < 175 && img[i + 2] < 175) dark++
          }
        }
        if (dark >= block * block * 0.12) grid[gy * gw + gx] = 1
      }
    }
    var seen = new Uint8Array(gw * gh), comps = []
    var stack = []
    for (var idx = 0; idx < grid.length; idx++) {
      if (!grid[idx] || seen[idx]) continue
      var minx = gw, maxx = 0, miny = gh, maxy = 0, cnt = 0
      stack.length = 0; stack.push(idx); seen[idx] = 1
      while (stack.length) {
        var cur = stack.pop(), cx = cur % gw, cy = (cur - cx) / gw
        minx = Math.min(minx, cx); maxx = Math.max(maxx, cx)
        miny = Math.min(miny, cy); maxy = Math.max(maxy, cy); cnt++
        var nb = [cur - 1, cur + 1, cur - gw, cur + gw]
        for (var q = 0; q < 4; q++) {
          var ni = nb[q]
          if (ni < 0 || ni >= grid.length || seen[ni] || !grid[ni]) continue
          if (q === 0 && cx === 0) continue
          if (q === 1 && cx === gw - 1) continue
          seen[ni] = 1; stack.push(ni)
        }
      }
      var x0 = minx * block / scale, x1 = (maxx + 1) * block / scale
      var top = miny * block / scale, bottom = (maxy + 1) * block / scale
      var w = x1 - x0, h = bottom - top, area = cnt * block * block / (scale * scale)
      if (w < 30 || h < 15 || area < 600) continue
      if (top < 4 || bottom > pi.H - 4) continue
      comps.push({ x0: x0, top: top, x1: x1, bottom: bottom, area: area, isFigure: area >= 1200 || h >= 30 })
    }
    // 合并相近/重叠块
    var merged = []
    comps.sort(function (a, b) { return a.top - b.top })
    comps.forEach(function (c) {
      var hit = null
      for (var i = 0; i < merged.length; i++) {
        var m = merged[i]
        var pad = 8
        if (c.x0 <= m.x1 + pad && c.x1 >= m.x0 - pad && c.top <= m.bottom + pad && c.bottom >= m.top - pad) { hit = m; break }
      }
      if (!hit) merged.push(c)
      else {
        hit.x0 = Math.min(hit.x0, c.x0); hit.x1 = Math.max(hit.x1, c.x1)
        hit.top = Math.min(hit.top, c.top); hit.bottom = Math.max(hit.bottom, c.bottom)
        hit.area += c.area; hit.isFigure = hit.isFigure || c.isFigure
      }
    })
    return merged
  }

  function attachFigures(blocks, pi, figs) {
    if (!figs.length) return
    blocks.forEach(function (b) {
      b.segments.forEach(function (seg) {
        if (seg.page !== pi.no) return
        figs.forEach(function (f) {
          var cy = (f.top + f.bottom) / 2
          if (cy < seg.rect.top - 10 || cy > seg.rect.bottom + 30) return
          var ox = Math.max(0, Math.min(f.x1, seg.rect.x1) - Math.max(f.x0, seg.rect.x0))
          var oy = Math.max(0, Math.min(f.bottom, seg.rect.bottom) - Math.max(f.top, seg.rect.top))
          if (ox * oy <= 0) return
          if (f.isFigure) {
            b.hasFigure = true
            b.figureRects.push({ page: pi.no, x0: f.x0, top: f.top, x1: f.x1, bottom: f.bottom })
            seg.rect.bottom = Math.max(seg.rect.bottom, f.bottom + 4)
          }
        })
      })
    })
  }

  /* ---------------- 扫描页：VLM 定位 / 投影兜底 ---------------- */
  function trimBoxByInk(canvas, box, scale) {
    try {
      var g = canvas.getContext('2d')
      var x = Math.max(0, Math.floor(box.x0 * scale)), y = Math.max(0, Math.floor(box.top * scale))
      var w = Math.max(1, Math.min(canvas.width - x, Math.ceil((box.x1 - box.x0) * scale)))
      var h = Math.max(1, Math.min(canvas.height - y, Math.ceil((box.bottom - box.top) * scale)))
      var data = g.getImageData(x, y, w, h).data
      var first = -1, last = -1
      for (var row = 0; row < h; row++) {
        var dark = 0
        for (var col = 0; col < w; col += 2) {
          var i = (row * w + col) * 4
          if (data[i] < 175 && data[i + 1] < 175 && data[i + 2] < 175) { dark++; if (dark > 3) break }
        }
        if (dark > 3) { if (first < 0) first = row; last = row }
      }
      if (first < 0) return box
      var pad = 4
      return {
        x0: box.x0, x1: box.x1,
        top: (y + Math.max(0, first - pad)) / scale,
        bottom: (y + Math.min(h, last + pad + 1)) / scale
      }
    } catch (e) { return box }
  }

  function projectionBlocks(canvas, W, H, scale) {
    var g = canvas.getContext('2d')
    var data = g.getImageData(0, 0, canvas.width, canvas.height).data
    var rows = []
    for (var y = 0; y < canvas.height; y += 2) {
      var dark = 0
      for (var x = 0; x < canvas.width; x += 4) {
        var i = (y * canvas.width + x) * 4
        if (data[i] < 170 && data[i + 1] < 170 && data[i + 2] < 170) dark++
      }
      rows.push(dark)
    }
    var blanks = [], run = 0
    for (var r = 0; r < rows.length; r++) {
      if (rows[r] <= 2) run++
      else { if (run >= 8) blanks.push([r - run, r]); run = 0 }
    }
    if (run >= 8) blanks.push([rows.length - run, rows.length])
    var cuts = [0]
    blanks.forEach(function (b) { if (b[0] > 0 && b[1] < rows.length) cuts.push(Math.floor((b[0] + b[1]) / 2)) })
    cuts.push(rows.length)
    var out = []
    for (var c = 0; c < cuts.length - 1; c++) {
      var y0 = cuts[c] * 2 / scale, y1 = cuts[c + 1] * 2 / scale
      if (y1 - y0 < 36) continue
      out.push({ no: null, segments: [{ page: 0, rect: { x0: W * 0.06, top: y0, x1: W * 0.94, bottom: y1 } }], hasFigure: false, figureRects: [], geometry: 'projection', low: true })
    }
    return out
  }

  function normBoxes(raw, W, H, canvas, scale) {
    var out = []
    ;(raw || []).forEach(function (it) {
      var b = it && (it.box || it.bbox || it.rect)
      if (!Array.isArray(b) || b.length !== 4) return
      var x0 = clamp(+b[0] || 0, 0, 1000) / 1000 * W
      var top = clamp(+b[1] || 0, 0, 1000) / 1000 * H
      var x1 = clamp(+b[2] || 0, 0, 1000) / 1000 * W
      var bottom = clamp(+b[3] || 0, 0, 1000) / 1000 * H
      if (x1 - x0 < 60 || bottom - top < 24) return
      var box = trimBoxByInk(canvas, { x0: x0, top: top, x1: x1, bottom: bottom }, scale)
      if (box.x1 - box.x0 > W * 0.45) { box.x0 = W * 0.06; box.x1 = W * 0.94 }
      var fig = null
      if (it.hasFigure && Array.isArray(it.figureBox) && it.figureBox.length === 4) {
        var fb = it.figureBox
        var fx0 = clamp(+fb[0] || 0, 0, 1000) / 1000 * W, ftop = clamp(+fb[1] || 0, 0, 1000) / 1000 * H
        var fx1 = clamp(+fb[2] || 0, 0, 1000) / 1000 * W, fbot = clamp(+fb[3] || 0, 0, 1000) / 1000 * H
        if (fx1 - fx0 >= 30 && fbot - ftop >= 20) fig = { page: 0, x0: fx0, top: ftop, x1: fx1, bottom: fbot }
      }
      out.push({ no: it.no != null ? +String(it.no).replace(/[^\d]/g, '') || null : null, box: box, hasFigure: !!fig, figureRects: fig ? [fig] : [], conf: num(it.confidence, 0.9) })
    })
    out.sort(function (a, b) { return a.box.top - b.box.top })
    return out
  }

  async function locateScanPage(pi, ctx, signal) {
    var scale = Math.min(1.6, 1400 / pi.W)
    var canvas = await renderPage(pi.page, scale)
    var img = canvasDataUrl(canvas, 1400, 0.72)
    var res
    try {
      res = await askJson(ctx, SYS_LOCATE, '【第 ' + pi.no + ' 页 · 整页图片】请定位本页所有题目（含配图）。', img, 3000, signal)
    } catch (e) { res = null }
    var raw = res && res.questions || []
    var boxes = normBoxes(raw, pi.W, pi.H, canvas, scale)
    if (!boxes.length) {
      var pb = projectionBlocks(canvas, pi.W, pi.H, scale)
      pb.forEach(function (b) { b.segments[0].page = pi.no })
      return pb
    }
    return boxes.map(function (b) {
      var seg = { page: pi.no, rect: { x0: b.box.x0, top: b.box.top, x1: b.box.x1, bottom: b.box.bottom } }
      var figs = (b.figureRects || []).map(function (f) { return { page: pi.no, x0: f.x0, top: f.top, x1: f.x1, bottom: f.bottom } })
      return { no: b.no, pageStart: pi.no, pageEnd: pi.no, segments: [seg], hasFigure: !!figs.length, figureRects: figs, geometry: 'vision', section: '', low: !b.no }
    })
  }

  /* ---------------- AI ---------------- */
  async function askJson(ctx, sys, user, image, maxTokens, signal) {
    if (!ctx.AI || typeof ctx.AI.chatJSON !== 'function') throw new Error('AI 未就绪')
    if (!ctx.AI.configured()) throw new Error('请先在设置里配置 AI 接口')
    var opts = {
      ctx: AI_CTX, noTools: true, cache: false,
      timeout: 240000, maxTokens: maxTokens || 8192,
      signal: signal
    }
    return await ctx.AI.chatJSON(sys, user, image || null, opts)
  }

  function questionsOf(res) {
    if (Array.isArray(res)) return res
    if (res && Array.isArray(res.questions)) return res.questions
    return []
  }

  /* ---------------- 主编排 ---------------- */
  async function runPipeline(doc, opts, onProgress, state) {
    var pinfos = []
    var maxPages = Math.min(opts.maxPages || MAX_PAGES_DEFAULT, doc.numPages)
    onProgress(3, '解析 PDF：' + doc.numPages + ' 页')
    for (var i = 1; i <= maxPages; i++) {
      if (state.cancelled) throw new Error('已取消')
      var page = await doc.getPage(i)
      pinfos.push(await pageInfo(page, i))
      onProgress(3 + Math.round(i / maxPages * 7), '读取文字层 ' + i + '/' + maxPages)
    }
    var scanPages = pinfos.filter(function (p) { return p.kind === 'scan' })
    onProgress(10, '切题：文字页 ' + (pinfos.length - scanPages.length) + ' / 扫描页 ' + scanPages.length)

    // 扫描页几何
    var scanBlocks = []
    if (scanPages.length) {
      var loc = await pool(scanPages, 2, async function (pi) {
        try { return await locateScanPage(pi, opts.ctx, opts.signal) }
        catch (e) { return [] }
      }, function (d, n) { onProgress(10 + Math.round(d / n * 4), '扫描页定位 ' + d + '/' + n) })
      loc.forEach(function (arr) { if (Array.isArray(arr)) scanBlocks = scanBlocks.concat(arr) })
      if (!scanBlocks.length) {
        scanPages.forEach(function (pi) {
          scanBlocks.push({ no: null, pageStart: pi.no, pageEnd: pi.no, segments: [{ page: pi.no, rect: { x0: pi.W * 0.06, top: 0, x1: pi.W * 0.94, bottom: pi.H * 0.94 } }], hasFigure: false, figureRects: [], geometry: 'projection', low: true })
        })
      }
    }

    // 数字版切题 + 配图
    var textBlocks = buildTextBlocks(pinfos)
    for (var pi2 = 0; pi2 < pinfos.length; pi2++) {
      var p = pinfos[pi2]
      if (p.kind !== 'text') continue
      try {
        var figs = await detectFigures(p)
        attachFigures(textBlocks, p, figs)
      } catch (e) { /* 配图检测失败不阻塞 */ }
    }
    var blocks = textBlocks.concat(scanBlocks)
    blocks.sort(function (a, b) { return a.pageStart - b.pageStart || (a.segments[0].rect.top - b.segments[0].rect.top) })

    // 页面级 AI
    var groups = []
    var cur = []
    pinfos.forEach(function (p) {
      if (p.kind === 'text') {
        cur.push(p)
        if (cur.length >= 2) { groups.push({ kind: 'text', pages: cur.slice() }); cur = [] }
      } else {
        if (cur.length) { groups.push({ kind: 'text', pages: cur.slice() }); cur = [] }
        groups.push({ kind: 'img', pages: [p] })
      }
    })
    if (cur.length) groups.push({ kind: 'text', pages: cur.slice() })

    var aiQs = []
    await pool(groups, 3, async function (g) {
      if (state.cancelled) throw new Error('已取消')
      try {
        var qs = await extractGroup(g, opts, state)
        qs.forEach(function (q) { aiQs.push(q) })
      } catch (e) {
        if (g.kind === 'text') {
          for (var k = 0; k < g.pages.length; k++) {
            try {
              var qs2 = await extractOnePage(g.pages[k], opts, state)
              qs2.forEach(function (q) { aiQs.push(q) })
            } catch (e2) { }
          }
        }
      }
    }, function (d, n) { onProgress(15 + Math.round(d / n * 45), 'AI 拆题 ' + d + '/' + n + ' 组') })

    if (!aiQs.length && !blocks.length) throw new Error('没有识别到任何题目')
    if (!aiQs.length) throw new Error('AI 未识出题目（可检查接口/视觉能力）')

    // 合并
    var merged = mergeBlocks(blocks, aiQs, pinfos)
    merged = merged.filter(function (q) { return !(isNoise(q.stem) && !q.hasFigure) })
    merged.sort(function (a, b) { return (a.sourcePages[0] || 999) - (b.sourcePages[0] || 999) || (a._order || 0) - (b._order || 0) })
    var nos = merged.map(function (q) { return q.no })
    var needRen = nos.some(function (n) { return n == null })
    if (!needRen) {
      var seen = {}, prev = 0
      for (var z = 0; z < nos.length; z++) {
        var nz = +nos[z]
        if (!isFinite(nz) || seen[nz] || nz <= prev) { needRen = true; break }
        seen[nz] = 1; prev = nz
      }
    }
    if (needRen) merged.forEach(function (q, i) { q.no = i + 1 })

    // 低置信 / 图片按需
    onProgress(65, '整理题目 / 按需裁图')
    var questions = []
    var cropScale = 2.2
    var canvasCache = {}
    for (var qi = 0; qi < merged.length; qi++) {
      if (state.cancelled) throw new Error('已取消')
      var q = merged[qi]
      var stem = stripNoise(q.stem || '').trim()
      stem = stem.replace(/^\s*[一二三四五六七八九十]{1,3}\s*[、.．]\s*/, '')
        .replace(/^\s*[\[【]\s*\d+\s*分\s*[\]】]\s*/, '')
        .replace(/^\s*[（(]\s*\d+\s*分\s*[)）]\s*/, '')
      var type = inferType(q)
      var opts4 = Array.isArray(q.options) ? q.options.filter(function (x) { return String(x || '').trim() }) .map(String) : []
      var note = ''
      if (type === 'choice' && opts4.length !== 4) {
        if (opts4.length >= 2) stem += '\n' + opts4.join('\n')
        opts4 = []; type = 'solve'; note = '选择题缺选项'
      }
      var conf = q.confidence == null ? null : num(q.confidence, null)
      var low = !stem || note !== '' || (conf != null && conf < opts.lowConf)
      if (q.geometry === 'projection' || q.geometry === 'ai-only') low = true
      var needImg = needImage({ hasFigure: q.hasFigure, confidence: conf, stem: stem }, opts)
      var img = ''
      if (needImg && q._segments && q._segments.length) {
        try {
          var cs = []
          for (var si = 0; si < q._segments.length; si++) {
            var seg = q._segments[si]
            var pp = pinfos[seg.page - 1]
            if (!pp) continue
            var key = 'p' + seg.page + '_' + cropScale
            if (!canvasCache[key]) canvasCache[key] = await renderPage(pp.page, cropScale)
            var c = cropCanvas(canvasCache[key], seg.rect, cropScale)
            if (c) cs.push(c)
          }
          var comp = composeVertical(cs)
          if (comp) img = canvasDataUrl(comp, 1100, 0.75)
        } catch (e) { /* 裁图失败不影响文字 */ }
      }
      var item = {
        no: q.no, stem: stem, type: type,
        answer: q.answer || '', solution: q.solution || '',
        noAnswer: !String(q.answer || '').trim(),
        star: clamp(Math.round(num(q.star, 3)) || 3, 1, 5),
        sourcePages: q.sourcePages || [],
        lowConfidence: !!low,
        fromImport: true, importKind: 'pdf'
      }
      if (type === 'choice' && opts4.length === 4) item.options = opts4
      if (q.topicName) item.topicName = q.topicName
      if (q.score) item.score = q.score
      if (conf != null) item.confidence = conf
      if (q.hasFigure) {
        item.hasFigure = true
        if (q.figureKind) item.figureKind = q.figureKind
        if (q.figureDesc) item.figureDesc = q.figureDesc
      }
      if (img) item.diagramImg = img
      questions.push(item)
      onProgress(70 + Math.round((qi + 1) / merged.length * 25), '处理第 ' + (qi + 1) + '/' + merged.length + ' 题')
    }

    return {
      id: 'plugin-' + Date.now().toString(36),
      title: (opts.title || '导入试卷') + '（' + questions.length + ' 题）',
      subject: opts.subject || 'math',
      timeLimit: questions.length * 6,
      totalScore: questions.reduce(function (a, q) { return a + (Number(q.score) || 0) }, 0) || questions.length * 5,
      questions: questions, imported: true,
      builtBy: 'paper-extract-plugin', generatedAt: new Date().toISOString(),
      meta: {
        pages: pinfos.length,
        scanPages: scanPages.length,
        images: questions.filter(function (q) { return !!q.diagramImg }).length,
        imageMode: opts.imageMode,
        embedded: true,
        engine: 'paper-extract-plugin',
        version: VERSION
      }
    }
  }

  function needImage(q, opts) {
    if (opts.imageMode === 'none') return false
    if (opts.imageMode === 'all') return true
    if (q.hasFigure) return true
    if (q.confidence == null || q.confidence < opts.lowConf) return true
    if (!q.stem || looksTruncated(q.stem)) return true
    return false
  }

  async function extractGroup(g, opts, state) {
    if (g.kind === 'text') {
      var text = g.pages.map(function (p) {
        return '【第 ' + p.no + ' 页】\n' + p.lines.map(function (l) { return l.text }).join('\n')
      }).join('\n\n').slice(0, 24000)
      var res = await askJson(opts.ctx, SYS_TEXT, text, null, 8192, opts.signal)
      return questionsOf(res).map(function (q) { return normQuestion(q, { pages: g.pages.map(function (p) { return p.no }) }) })
    }
    return await extractOnePage(g.pages[0], opts, state)
  }

  async function extractOnePage(p, opts, state) {
    var scale = Math.min(1.8, 1600 / p.W)
    var canvas = await renderPage(p.page, scale)
    var img = canvasDataUrl(canvas, 1600, 0.72)
    var res = await askJson(opts.ctx, SYS_VISION, '【第 ' + p.no + ' 页 · 整页图片】请逐题识别。', img, 8192, opts.signal)
    return questionsOf(res).map(function (q) { return normQuestion(q, { pages: [p.no] }) })
  }

  function mergeBlocks(blocks, aiQs, pinfos) {
    var used = {}, out = []
    var byNo = {}
    aiQs.forEach(function (q, i) { if (q.no != null) (byNo[q.no] = byNo[q.no] || []).push(i) })
    function take(b) {
      var cand = []
      aiQs.forEach(function (q, i) {
        if (used[i]) return
        var pages = q._groupPages || []
        if (b.no != null && q.no === b.no && pages.indexOf(b.pageStart) >= 0) cand.push(i)
      })
      if (!cand.length && b.no != null) {
        aiQs.forEach(function (q, i) { if (!used[i] && q.no === b.no) cand.push(i) })
      }
      if (!cand.length) {
        aiQs.forEach(function (q, i) {
          if (used[i]) return
          var pages = q._groupPages || []
          if (pages.indexOf(b.pageStart) >= 0) cand.push(i)
        })
      }
      if (!cand.length) {
        aiQs.forEach(function (q, i) {
          if (used[i]) return
          var pages = q._groupPages || []
          if (pages.some(function (p) { return b.segments.some(function (s) { return s.page === p }) })) cand.push(i)
        })
      }
      return cand.length ? cand[0] : -1
    }
    blocks.forEach(function (b) {
      var idx = take(b)
      var q = idx >= 0 ? aiQs[idx] : {}
      if (idx >= 0) used[idx] = 1
      out.push({
        no: b.no != null ? b.no : q.no,
        stem: q.stem || '', type: q.type, options: q.options || [],
        answer: q.answer || '', solution: q.solution || '',
        topicName: q.topicName || '', score: q.score, star: q.star,
        confidence: q.confidence, hasFigure: !!b.hasFigure || !!q.hasFigure,
        figureKind: q.figureKind || '', figureDesc: q.figureDesc || '',
        sourcePages: b.segments.map(function (s) { return s.page }),
        _segments: b.segments, geometry: b.geometry,
        _order: idx >= 0 ? idx : 999
      })
    })
    aiQs.forEach(function (q, i) {
      if (used[i]) return
      var pno = (q._groupPages || [1])[0]
      var pi = pinfos[pno - 1]
      if (!pi) return
      var rect = { x0: pi.W * 0.06, top: pi.H * 0.06, x1: pi.W * 0.94, bottom: pi.H * 0.9 }
      out.push({
        no: q.no, stem: q.stem || '', type: q.type, options: q.options || [],
        answer: q.answer || '', solution: q.solution || '',
        topicName: q.topicName || '', score: q.score, star: q.star,
        confidence: q.confidence, hasFigure: !!q.hasFigure,
        figureKind: q.figureKind || '', figureDesc: q.figureDesc || '',
        sourcePages: [pno], _segments: [{ page: pno, rect: rect }], geometry: 'ai-only',
        _order: i
      })
    })
    return out
  }

  /* ---------------- UI ---------------- */
  var CSS = [
    '.px-wrap{--px-line:#e3e8f0;--px-ink:#1b2430;--px-mut:#6b7788;--px-acc:#2563eb;--px-ok:#16a34a;--px-warn:#d97706;--px-bad:#dc2626;color:var(--px-ink);font:14px/1.55 "Segoe UI","PingFang SC","Microsoft YaHei",sans-serif}',
    '.px-card{background:#fff;border:1px solid var(--px-line);border-radius:14px;padding:16px;margin-bottom:14px;box-shadow:0 10px 24px rgba(20,35,70,.06)}',
    '.px-h{font-size:18px;font-weight:800;margin:0 0 4px}.px-sub{color:var(--px-mut);font-size:12px;margin-bottom:12px}',
    '.px-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:10px}',
    '.px-f{display:flex;flex-direction:column;gap:5px;font-size:12px;color:var(--px-mut)}',
    '.px-f select,.px-f input{height:34px;border:1px solid var(--px-line);border-radius:9px;padding:0 9px;background:#fbfcff;color:var(--px-ink);outline:none}',
    '.px-drop{border:1.5px dashed #c9d5ea;border-radius:12px;background:#f8faff;padding:16px;text-align:center;cursor:pointer;margin:6px 0 12px}',
    '.px-drop b{display:block}.px-drop small{color:var(--px-mut)}',
    '.px-btn{height:36px;padding:0 15px;border-radius:10px;border:1px solid var(--px-line);background:#fff;cursor:pointer;font-weight:600;color:#33425a}',
    '.px-btn.primary{background:linear-gradient(135deg,#2563eb,#3b82f6);color:#fff;border:0}.px-btn:disabled{opacity:.5;cursor:not-allowed}',
    '.px-bar{height:8px;background:#e9eef8;border-radius:999px;overflow:hidden;margin-top:10px}.px-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#2563eb,#7c3aed);transition:width .25s}',
    '.px-log{max-height:180px;overflow:auto;background:#0e1626;color:#cdd9ee;border-radius:10px;padding:10px;font:11.5px/1.6 ui-monospace,Consolas,monospace;white-space:pre-wrap;margin-top:8px}',
    '.px-chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}.px-chip{font-size:12px;border-radius:999px;padding:4px 10px;background:#f0f4fb;border:1px solid #e2e9f5}.px-chip b{color:var(--px-acc)}',
    '.px-q{border:1px solid var(--px-line);border-radius:12px;padding:12px;margin-bottom:10px;display:grid;grid-template-columns:280px 1fr;gap:14px}.px-q.noimg{grid-template-columns:1fr}',
    '.px-q img{width:100%;max-height:240px;object-fit:contain;border:1px solid var(--px-line);border-radius:8px;background:#fbfcfe;cursor:zoom-in}',
    '.px-no{display:inline-block;background:#1f2b3d;color:#fff;border-radius:7px;padding:1px 8px;font-weight:800;font-size:12px;margin-right:6px}',
    '.px-tag{display:inline-block;font-size:11px;border-radius:999px;padding:2px 8px;background:#eef3fb;color:#41536e;margin-left:5px}',
    '.px-tag.fig{background:#e9f8ef;color:#14653a}.px-tag.low{background:#fff3f0;color:#9a2f1b}',
    '.px-stem{white-space:pre-wrap;word-break:break-word;margin:6px 0}.px-meta{color:var(--px-mut);font-size:11.5px;display:flex;gap:12px;flex-wrap:wrap}',
    '.px-json{max-height:420px;overflow:auto;background:#0e1626;color:#cfe0f7;border-radius:10px;padding:12px;font:11.5px/1.55 ui-monospace,Consolas,monospace;white-space:pre-wrap}',
    '.px-img{position:fixed;inset:0;background:rgba(8,14,26,.8);display:none;place-items:center;z-index:99999;padding:20px}.px-img.on{display:grid}.px-img img{max-width:96vw;max-height:92vh;background:#fff;border-radius:10px}',
    '@media(max-width:760px){.px-row{grid-template-columns:1fr}.px-q{grid-template-columns:1fr}}'
  ].join('')

  function mountTool(el, ctx) {
    var cfg = {
      subject: String(ctx.config('subject') || 'math'),
      imageMode: String(ctx.config('imageMode') || 'auto'),
      preset: String(ctx.config('imagePreset') || 'standard'),
      maxPages: Math.max(1, Math.min(60, parseInt(ctx.config('maxPages'), 10) || MAX_PAGES_DEFAULT))
    }
    var state = { cancelled: false, abort: null, result: null, file: null }
    el.innerHTML = '<div class="px-wrap">'
      + '<div class="px-card"><div class="px-h">📄 试卷提取</div>'
      + '<div class="px-sub">PDF 文字层/页面由站点 PDF 引擎解析；本插件只做切题、按需裁图、导出 JSON。不上传任何服务器。</div>'
      + '<div class="px-row">'
      + '<label class="px-f">科目<select id="px-subj"><option value="math">数学</option><option value="major">专业课</option><option value="eng">英语</option><option value="pol">政治</option></select></label>'
      + '<label class="px-f">图片策略<select id="px-mode"><option value="auto">自动（带图/低置信/截断）</option><option value="all">全部题</option><option value="none">不生成</option></select></label>'
      + '<label class="px-f">图片清晰度<select id="px-preset"><option value="compact">精简 900/72</option><option value="standard">标准 1100/76</option></select></label>'
      + '</div>'
      + '<div class="px-drop" id="px-drop"><b>点击选择 PDF</b><small>单次 ≤ 60 页；扫描版会走视觉模型</small><input type="file" id="px-file" accept="application/pdf" hidden></div>'
      + '<div class="px-row"><label class="px-f">卷名<input id="px-title" placeholder="留空取文件名"></label>'
      + '<label class="px-f">最大页数<input id="px-max" type="number" min="1" max="60"></label>'
      + '<label class="px-f">低置信阈值<input id="px-low" type="number" min="0.1" max="1" step="0.05" value="0.7"></label></div>'
      + '<div style="display:flex;gap:10px;align-items:center"><button class="px-btn primary" id="px-run">开始提取</button><button class="px-btn" id="px-cancel" disabled>取消</button><span id="px-msg" class="px-sub" style="margin:0"></span></div>'
      + '<div class="px-bar"><i id="px-bar"></i></div><div class="px-log" id="px-log"></div></div>'
      + '<div class="px-card" id="px-result" style="display:none"><div class="px-chips" id="px-chips"></div>'
      + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px"><button class="px-btn" id="px-dl">下载 exam.json</button><button class="px-btn" id="px-copy">复制 JSON</button></div>'
      + '<div id="px-list"></div><details style="margin-top:10px"><summary style="cursor:pointer;color:var(--px-mut)">原始 JSON</summary><pre class="px-json" id="px-json"></pre></details></div>'
      + '<div class="px-img" id="px-img"><img id="px-img-i" alt="题图"></div></div>'

    var $ = function (id) { return el.querySelector('#' + id) }
    $('px-subj').value = cfg.subject
    $('px-mode').value = cfg.imageMode
    $('px-preset').value = cfg.preset
    $('px-max').value = cfg.maxPages
    var logEl = $('px-log'), barEl = $('px-bar'), msgEl = $('px-msg')
    function log(s) {
      var t = new Date().toTimeString().slice(0, 8)
      logEl.textContent += (logEl.textContent ? '\n' : '') + '[' + t + '] ' + s
      logEl.scrollTop = logEl.scrollHeight
    }
    function progress(pct, msg) { barEl.style.width = clamp(pct, 0, 100) + '%'; msgEl.textContent = msg || ''; if (msg) log(msg) }

    $('px-drop').onclick = function () { $('px-file').click() }
    $('px-file').onchange = function () {
      var f = $('px-file').files && $('px-file').files[0]
      if (!f) return
      state.file = f
      $('px-drop').querySelector('b').textContent = f.name
      $('px-drop').querySelector('small').textContent = (f.size / 1048576).toFixed(2) + ' MB'
      if (!$('px-title').value) $('px-title').value = f.name.replace(/\.pdf$/i, '')
    }
    $('px-img').onclick = function () { this.classList.remove('on') }
    $('px-cancel').onclick = function () {
      state.cancelled = true
      try { if (state.abort) state.abort.abort() } catch (e) { }
      log('正在取消…')
    }
    $('px-dl').onclick = function () {
      if (!state.result) return
      ctx.api.download('exam.json', JSON.stringify(state.result, null, 2), 'application/json')
    }
    $('px-copy').onclick = function () {
      if (!state.result) return
      var txt = JSON.stringify(state.result, null, 2)
      try {
        navigator.clipboard.writeText(txt).then(function () { ctx.Toast.show('JSON 已复制', 'success', 1500) },
          function () { ctx.Toast.show('复制失败，请手动选中', 'warn', 2000) })
      } catch (e) { ctx.Toast.show('复制失败', 'warn', 2000) }
    }

    $('px-run').onclick = async function () {
      if (!state.file) { ctx.Toast.show('请先选择 PDF', 'warn', 2000); return }
      if (!ctx.AI || !ctx.AI.configured()) { ctx.Toast.show('请先在设置里配置 AI 接口', 'warn', 2600); return }
      state.cancelled = false
      state.result = null
      state.abort = typeof AbortController !== 'undefined' ? new AbortController() : null
      $('px-run').disabled = true; $('px-cancel').disabled = false
      $('px-result').style.display = 'none'
      logEl.textContent = ''
      var t0 = Date.now()
      try {
        var buf = await state.file.arrayBuffer()
        var doc = await openPdf(buf)
        var preset = $('px-preset').value
        var opts = {
          ctx: ctx, signal: state.abort ? state.abort.signal : null,
          subject: $('px-subj').value,
          title: $('px-title').value.trim() || state.file.name.replace(/\.pdf$/i, ''),
          imageMode: $('px-mode').value,
          lowConf: num($('px-low').value, LOW_CONF_DEFAULT),
          maxPages: parseInt($('px-max').value, 10) || MAX_PAGES_DEFAULT,
          preset: preset
        }
        var exam = await runPipeline(doc, opts, progress, state)
        exam.meta.elapsedSec = Math.round((Date.now() - t0) / 100) / 10
        state.result = exam
        renderResult(exam)
        progress(100, '完成：' + exam.questions.length + ' 题（图片 ' + exam.meta.images + ' 张）')
        ctx.Toast.show('提取完成：' + exam.questions.length + ' 题', 'success', 2200)
      } catch (e) {
        log('失败：' + (e && e.message || e))
        progress(0, '失败：' + (e && e.message || e))
        ctx.Toast.show('提取失败：' + (e && e.message || e), 'warn', 4000)
      } finally {
        $('px-run').disabled = false; $('px-cancel').disabled = true
      }
    }

    function renderResult(exam) {
      var figs = exam.questions.filter(function (q) { return q.hasFigure }).length
      var low = exam.questions.filter(function (q) { return q.lowConfidence }).length
      $('px-chips').innerHTML = '<span class="px-chip">共 <b>' + exam.questions.length + '</b> 题</span>'
        + '<span class="px-chip">带图 <b>' + figs + '</b></span>'
        + '<span class="px-chip">题图 <b>' + exam.meta.images + '</b> 张</span>'
        + '<span class="px-chip">低置信 <b>' + low + '</b></span>'
        + '<span class="px-chip">耗时 <b>' + (exam.meta.elapsedSec || '-') + 's</b></span>'
      $('px-list').innerHTML = exam.questions.map(function (q) {
        var img = q.diagramImg || ''
        var tags = (q.hasFigure ? '<span class="px-tag fig">带图 · ' + esc(q.figureKind || '图') + '</span>' : '')
          + (q.lowConfidence ? '<span class="px-tag low">低置信</span>' : '')
        var opts = (q.options || []).map(function (o) { return '<div>' + esc(o) + '</div>' }).join('')
        return '<div class="px-q ' + (img ? '' : 'noimg') + '">'
          + (img ? '<img src="' + img + '" data-img="' + (q.no || '') + '" alt="第 ' + (q.no || '') + ' 题">' : '')
          + '<div><div><span class="px-no">第 ' + (q.no || '?') + ' 题</span><span class="px-tag">' + esc(q.type) + '</span>' + tags + '</div>'
          + '<div class="px-stem">' + esc(q.stem || '（题干为空）') + '</div>'
          + (opts ? '<div>' + opts + '</div>' : '')
          + (q.hasFigure && q.figureDesc ? '<div style="background:#f3fbf6;border-left:3px solid #16a34a;padding:6px 9px;border-radius:0 8px 8px 0;margin:6px 0">图：' + esc(q.figureDesc) + '</div>' : '')
          + '<div class="px-meta"><span>P' + (q.sourcePages || []).join('、') + '</span>'
          + (q.confidence == null ? '' : '<span>置信 ' + q.confidence + '</span>') + '</div></div></div>'
      }).join('')
      $('px-list').querySelectorAll('img[data-img]').forEach(function (im) {
        im.onclick = function () { $('px-img-i').src = im.src; $('px-img').classList.add('on') }
      })
      $('px-json').textContent = JSON.stringify(exam, null, 2)
      $('px-result').style.display = ''
    }

    return function destroy() {
      state.cancelled = true
      try { if (state.abort) state.abort.abort() } catch (e) { }
    }
  }

  /* ---------------- 注册 ---------------- */
  var api = {
    id: 'paper-extract',
    name: '试卷提取',
    version: VERSION,
    author: 'kaoyan-v2',
    desc: 'PDF → 题号切题 / 按需裁图 / JSON；复用站点 PDF 引擎与 AI，不接预览、不引第三方引擎。',
    tools: [{
      id: 'paper-extract',
      title: '试卷提取',
      icon: '📄',
      mount: mountTool
    }],
    config: [
      { key: 'subject', label: '默认科目', type: 'select', default: 'math', options: ['math', 'major', 'eng', 'pol'] },
      { key: 'imageMode', label: '图片策略', type: 'select', default: 'auto', options: ['auto', 'all', 'none'] },
      { key: 'imagePreset', label: '图片清晰度', type: 'select', default: 'standard', options: ['compact', 'standard'] },
      { key: 'maxPages', label: '最大页数', type: 'number', default: 40 }
    ],
    css: CSS
  }

  // 调试钩子（仅站点显式打开时暴露；生产无影响）
  if (window.__PAPER_EXTRACT_DEBUG__) {
    window.__paperExtractInternals = {
      linesFromItems: linesFromItems,
      findAnchors: findAnchors,
      isNoise: isNoise,
      stripNoise: stripNoise,
      looksTruncated: looksTruncated,
      normQuestion: normQuestion
    }
  }

  PluginBus.register(api)
})();
