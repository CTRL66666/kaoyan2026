/* ============================================================
 * paper-extract.plugin.js — 试卷提取（单文件插件）· v1.1
 * ------------------------------------------------------------
 * 设计边界（重要）：
 *   · 不引 pdf.js / 不接预览 / 不用 Python；PDF 解析全部走站点注入的 window.PdfKit。
 *   · 插件只做：PDF 文字层 bbox → 题号切题 → 扫描页 VLM 定位 → 裁图 → JSON。
 *   · 宿主桥契约（由站点侧提供）：
 *       window.PdfKit  = { open(arrayBuffer) → pdfjs PDFDocumentProxy, ... }
 *       window.PaperKit = { parseJson(text) → {ok,papers,warnings,stats},
 *                           addDrafts(drafts) → {ids,skipped}, open(id,qi), brief(), remove(id) }
 *     （PaperKit 缺失时自动降级为"只导出 JSON，手动去题卷模块导入"，不假装能入库。）
 *
 * ── v1.1 做了什么（相对 1.0.0）────────────────────────────────
 *   ① 拆成三个子页：提取台 / 卷库 / 设置体检（同一套顶部导航，互跳不丢状态）
 *   ② 卷库：结果持久化 + 体积闸 + 回看/导出/删除/**一键送进「我的题卷」**
 *   ③ 提取台：阶段化进度、可按「全部/带图/纯图/低置信」筛选 + 搜索、灯箱可左右翻
 *   ④ 设置页：PdfKit/AI 体检、默认参数、噪声词扩展（不同机构水印不一样）、数据清理
 *   ⑤ 外观改用站点设计令牌（--surface/--line/--text-primary…）：夜间/晨岚主题不再白底白字
 *
 * 安装：插件中心 → 粘贴导入 / 选择本文件（.js）。
 * ============================================================ */
;(function () {
  'use strict'

  let VERSION = '1.1.0'
  let AI_CTX = 'plugin.paper'
  let MAX_PAGES_DEFAULT = 40
  let TEXT_MIN = 80
  let LOW_CONF_DEFAULT = 0.7
  /* 卷库存多少卷 / 多久之前的老卷只留文字：题卷整卷会随 Store 持久化并参与云同步，
   * 数据 URL 图片很占体积 —— 不设闸，几次批量提取就能把同步通道堵死。 */
  let BANK_MAX = 8
  let BANK_CHAR_BUDGET = 2000000

  let T_MAIN = 'paper-extract'
  let T_LIB = 'paper-extract-lib'
  let T_SETUP = 'paper-extract-setup'

  /* ---------------- 提示词（与本地 Python 版同义，按浏览器场景收敛） ---------------- */
  let Q_SCHEMA = '{"no":1,"stem":"题干","type":"choice|fill|solve|essay",'
    + '"options":["A. .."],"answer":"卷面答案","solution":"卷面解析","noAnswer":true,'
    + '"topicName":"考点","score":数字或null,"star":1-5,"sourcePages":[1],"confidence":0.95,'
    + '"hasFigure":false,"figureKind":"","figureDesc":""}'

  let SYS_TEXT = '你是考研试卷数字化工程师。用户给你一份试卷其中几页的文字层提取（可能含页眉页脚、双栏错序、公式残缺、题目跨页）。'
    + '任务：把每一道题完整还原成结构化 JSON。'
    + '【铁律】①只做搬运，严禁增删题意、严禁编造卷面没有的答案或解析；卷面没给答案就 answer:"" 且 noAnswer:true。'
    + '②题目跨页时合并为一题（sourcePages 给全部页码）。'
    + '③公式保留 LaTeX（$...$），拿不准就降低 confidence，不要猜。'
    + '④题号 no 用卷面原题号；页眉页脚/注意事项/封面文字一律丢弃。'
    + '⑤star 为难度粗评（1=送分，5=压轴）。'
    + '只输出 JSON：{"questions":[' + Q_SCHEMA + ']}'

  let SYS_VISION = '你是考研试卷数字化工程师。用户给你一页试卷的高清图片（扫描/拍照/图文混排）。'
    + '任务：逐题识别并还原成结构化 JSON。'
    + '【铁律】①忠实转录，不补题、不编答案；看不清用 □ 占位并降低 confidence。'
    + '②卷面没答案就 answer:"" + noAnswer:true，严禁用你的知识顺手解题冒充卷面答案。'
    + '③公式用 LaTeX（$...$）。④题号 no 用卷面原题号；页眉页脚/水印/广告丢弃。'
    + '⑤题干含函数图像/几何图/表格/流程图时 hasFigure=true，figureKind 填类别，figureDesc 用 ≤80 字描述图中信息。'
    + '只输出 JSON：{"questions":[' + Q_SCHEMA + ']}'

  let SYS_LOCATE = '你是试卷版面分析器。给你一整页试卷图片，请找出每一道题在外层页面中的位置。'
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
  function num(v, d) { let n = Number(v); return isFinite(n) ? n : d }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms) }) }

  function pool(items, conc, worker, onDone) {
    let list = (items || []).slice()
    let out = []
    if (!list.length) return Promise.resolve(out)
    let idx = 0, done = 0, active = 0
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
  let NOISE_RE = /(公众号|B站|抖音|小红书|专注[^。]{0,8}考研|控制考研咨询|vx\s*[:：]|QQ群|扫码|二维码|水印|第\s*\d+\s*页|共\s*\d+\s*页|机密|启用前|考生注意事项|科目代码|科目名称|报考单位|准考证|答题纸|考试时间|满分\s*\d+|姓名\s*[:：]?|得分\s*[:：])/
  let NOISE_STRIP = [
    /【[^】]{0,40}(?:公众号|考研|控制|B站|抖音|小红书)[^】]{0,40}】/g,
    /(?:公众号|B站|抖音|小红书)\s*[/、，,：:]?\s*[^\s，。；;]{0,40}/g,
    /(?:控制考研咨询|专注[^。\s]{0,12}考研)\s*[^\s，。；;]{0,40}/g,
    /\bvx\s*[:：]\s*[A-Za-z0-9_\-]+/g,
    /(?:QQ群|扫码|二维码|水印)[^\s，。；;]{0,40}/g
  ]
  /* 用户在设置页追加的噪声词（各家机构水印/公众号名都不一样，写死在正则里必然漏）。
   * 只做"整词命中即丢弃/剔除"，不进正则编译 —— 用户输入里的括号星号不会被当元字符炸掉。 */
  let EXTRA_NOISE = []
  function setExtraNoise(words) {
    EXTRA_NOISE = (Array.isArray(words) ? words : [])
      .map(function (w) { return String(w || '').trim() })
      .filter(function (w) { return w.length >= 2 && w.length <= 30 })
      .slice(0, 60)
  }
  function hitExtraNoise(t) {
    for (let i = 0; i < EXTRA_NOISE.length; i++) if (t.indexOf(EXTRA_NOISE[i]) >= 0) return EXTRA_NOISE[i]
    return ''
  }
  function stripNoise(s) {
    let out = String(s == null ? '' : s)
    NOISE_STRIP.forEach(function (re) { out = out.replace(re, ' ') })
    EXTRA_NOISE.forEach(function (w) { out = out.split(w).join(' ') })
    return out.replace(/\s{2,}/g, ' ').trim()
  }
  function isNoise(s) {
    let raw = flat(s)
    if (!raw) return false
    let t = flat(stripNoise(s))
    if (!t) return true
    /* 用户自定义噪声词：整行基本只剩水印 → 丢弃；长篇正文里夹一处水印不算（别误杀题干） */
    if (hitExtraNoise(raw) && t.length < 6) return true
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
    let t = String(q && q.type || '')
    if (['choice', 'fill', 'solve', 'essay'].indexOf(t) >= 0) return t
    let o = (q && q.options) || []
    return Array.isArray(o) && o.length >= 2 ? (o.length === 4 ? 'choice' : 'solve') : 'solve'
  }
  function normQuestion(q, g) {
    q = q || {}
    let no = q.no
    if (no != null && no !== '') { let n = parseInt(String(no).replace(/[^\d]/g, ''), 10); no = isFinite(n) ? n : null } else no = null
    let opts = Array.isArray(q.options) ? q.options.filter(function (x) { return String(x || '').trim() }) .map(String) : []
    let stem = stripNoise(q.stem || '').trim()
    let conf = q.confidence == null ? null : num(q.confidence, null)
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
    let k = window.PdfKit
    if (k && typeof k.open === 'function') {
      let r = await k.open(buf)
      if (r && r.promise) r = await r.promise   // 兼容返回 LoadingTask 的桥实现
      return r
    }
    let lib = window.pdfjsLib
    if (lib && typeof lib.getDocument === 'function') {
      // 仅开发兜底：站点必须优先注入 window.PdfKit
      let t = lib.getDocument({ data: buf })
      return t && t.promise ? await t.promise : t
    }
    throw new Error('PDF 引擎未就绪：需要站点注入 window.PdfKit.open(ArrayBuffer) → pdfjs 文档。')
  }

  function runsFromItems(items, H) {
    let out = []
    ;(items || []).forEach(function (it) {
      let s = String(it && it.str || '')
      if (!s.trim()) return
      let tr = it.transform || []
      let x = num(tr[4], 0), y = num(tr[5], 0)
      let h = Math.max(1, num(it.height, 10))
      let w = Math.max(0, num(it.width, 0))
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
    let runs = runsFromItems(items, H)
    let lines = [], cur = null
    function close() {
      if (!cur || !cur.runs.length) { cur = null; return }
      cur.runs.sort(function (a, b) { return a.x - b.x })
      let text = '', prev = null
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
      let dy = Math.abs(r.top - cur.top)
      let tol = Math.max(2.2, 0.6 * Math.max(cur.size, r.h))
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
    let vp = page.getViewport({ scale: 1 })
    let W = vp.width, H = vp.height
    let tc = await page.getTextContent()
    let lines = linesFromItems(tc && tc.items, H)
    let chars = flat(lines.map(function (l) { return l.text }).join(''))
    let pua = 0, boxy = 0
    for (let i = 0; i < chars.length; i++) {
      let c = chars.charCodeAt(i)
      if (c >= 0xE000 && c <= 0xF8FF) pua++
    }
    boxy = (chars.match(/[\uFFFD\u25A1\u25A0\u25AF]/g) || []).length
    let garbled = chars.length > 30 && (pua > 30 || boxy >= 6)
    let kind = chars.length >= TEXT_MIN && lines.length >= 4 && !garbled ? 'text' : 'scan'
    return { page: page, no: no, W: W, H: H, lines: lines, chars: chars.length, garbled: garbled, kind: kind }
  }

  function bodySize(lines) {
    let vals = []
    lines.forEach(function (l) {
      let n = Math.min(40, flat(l.text).length)
      for (let i = 0; i < n; i++) vals.push(l.size)
    })
    if (!vals.length) return 10
    vals.sort(function (a, b) { return a - b })
    return vals[Math.floor(vals.length / 2)]
  }

  function contentBounds(lines, H) {
    let body = lines.filter(function (l) { return l.bottom < H * 0.95 && flat(l.text).length >= 2 })
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
    let vp = page.getViewport({ scale: scale })
    let c = document.createElement('canvas')
    c.width = Math.max(1, Math.ceil(vp.width))
    c.height = Math.max(1, Math.ceil(vp.height))
    let g = c.getContext('2d', { alpha: false, willReadFrequently: true })
    g.fillStyle = '#fff'
    g.fillRect(0, 0, c.width, c.height)
    await page.render({ canvasContext: g, viewport: vp }).promise
    return c
  }

  function canvasDataUrl(c, maxEdge, quality) {
    let w = c.width, h = c.height
    if (Math.max(w, h) > maxEdge) {
      let s = maxEdge / Math.max(w, h)
      let d = document.createElement('canvas')
      d.width = Math.max(1, Math.round(w * s)); d.height = Math.max(1, Math.round(h * s))
      let dg = d.getContext('2d'); dg.fillStyle = '#fff'; dg.fillRect(0, 0, d.width, d.height)
      dg.drawImage(c, 0, 0, d.width, d.height)
      c = d
    }
    let url = c.toDataURL('image/webp', quality)
    if (url.indexOf('data:image/webp') !== 0) url = c.toDataURL('image/jpeg', quality)
    return url
  }

  function cropCanvas(src, rectPt, scale) {
    let x = Math.max(0, Math.floor(rectPt.x0 * scale))
    let y = Math.max(0, Math.floor(rectPt.top * scale))
    let w = Math.max(1, Math.ceil((rectPt.x1 - rectPt.x0) * scale))
    let h = Math.max(1, Math.ceil((rectPt.bottom - rectPt.top) * scale))
    w = Math.min(w, src.width - x); h = Math.min(h, src.height - y)
    let c = document.createElement('canvas'); c.width = w; c.height = h
    let g = c.getContext('2d', { alpha: false }); g.fillStyle = '#fff'; g.fillRect(0, 0, w, h)
    g.drawImage(src, x, y, w, h, 0, 0, w, h)
    return c
  }

  function composeVertical(cs) {
    if (!cs.length) return null
    if (cs.length === 1) return cs[0]
    let W = Math.max.apply(null, cs.map(function (c) { return c.width }))
    let H = cs.reduce(function (a, c) { return a + c.height + 8 }, 0)
    let out = document.createElement('canvas'); out.width = W; out.height = H
    let g = out.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, W, H)
    let y = 0
    cs.forEach(function (c) { g.drawImage(c, 0, y); y += c.height + 8 })
    return out
  }

  /* ---------------- 数字版：题号锚点 / 题区间 ---------------- */
  let RE_A = /^\s*(\d{1,2})\s*[.．、]\s*(?=[^\d\s])/
  let RE_P = /^\s*[（(]\s*(\d{1,2})\s*[)）]\s*(?=[^\d\s])/
  let RE_C = /^\s*第\s*(\d{1,2})\s*题\s*[：:、.．]?\s*(?=[^\d\s])/
  let RE_SECTION = /^\s*(?:[一二三四五六七八九十]{1,3}\s*[、.．]|第[一二三四五六七八九十]{1,3}\s*部分)/
  function sectionType(t) {
    if (/选择/.test(t)) return 'choice'
    if (/填空/.test(t)) return 'fill'
    if (/解答|计算|证明|综合/.test(t)) return 'solve'
    if (/写作|作文/.test(t)) return 'essay'
    return ''
  }
  function findAnchors(lines, b, body, allowParen) {
    let out = [], last = 0
    let leftMax = b.x0 + Math.max(16, (b.x1 - b.x0) * 0.08)
    lines.forEach(function (l) {
      let t = String(l.text || '').trim()
      if (!t || t.length < 4) return
      if (l.top < b.top - 2 || l.bottom > b.bottom + 10) return
      if (l.size < body * 0.8) return
      if (l.x0 > leftMax) return
      if (isNoise(t)) return
      let m = RE_A.exec(t), no = 0
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
    let anchors = []
    pinfos.forEach(function (pi) {
      if (pi.kind !== 'text' || !pi.lines.length) return
      let b = contentBounds(pi.lines, pi.H)
      let body = bodySize(pi.lines)
      let as = findAnchors(pi.lines, b, body, false)
      if (as.length < 2) as = findAnchors(pi.lines, b, body, true)
      as.forEach(function (a) {
        a.pi = pi
        a.bounds = b
        a.body = body
        let sec = ''
        pi.lines.forEach(function (l) { if (RE_SECTION.test(String(l.text || '').trim()) && l.top < a.line.top) sec = sectionType(l.text) || sec })
        a.section = sec
        anchors.push(a)
      })
    })
    anchors.sort(function (a, b) { return a.pi.no - b.pi.no || a.line.top - b.line.top })
    let blocks = []
    for (let i = 0; i < anchors.length; i++) {
      let a = anchors[i], pi = a.pi
      let nxt = null
      for (let j = i + 1; j < anchors.length; j++) { if (anchors[j].pi.no >= pi.no) { nxt = anchors[j]; break } }
      let lastLine = null
      for (let k = 0; k < pi.lines.length; k++) if (pi.lines[k].top >= a.line.top - 1) lastLine = pi.lines[k]
      let lastBottom = lastLine ? lastLine.bottom : a.line.bottom
      let atBottom = lastBottom >= a.bounds.bottom - Math.max(34, (a.bounds.bottom - a.bounds.top) * 0.07)
      let segs = []
      if (!nxt) {
        segs.push({ page: pi.no, rect: { x0: a.bounds.x0, top: a.line.top - 2, x1: a.bounds.x1, bottom: Math.min(a.bounds.bottom, lastBottom + 8) } })
      } else if (nxt.pi.no === pi.no) {
        let end = nxt.line.top - 4
        if (end > a.line.top + 8) segs.push({ page: pi.no, rect: { x0: a.bounds.x0, top: a.line.top - 2, x1: a.bounds.x1, bottom: end } })
      } else {
        segs.push({ page: pi.no, rect: { x0: a.bounds.x0, top: a.line.top - 2, x1: a.bounds.x1, bottom: Math.min(a.bounds.bottom, lastBottom + 8) } })
        if (atBottom) {
          for (let p = pi.no + 1; p < nxt.pi.no; p++) {
            let mid = pinfos[p - 1]
            if (mid && mid.kind === 'text') {
              let mb = contentBounds(mid.lines, mid.H)
              segs.push({ page: p, rect: { x0: mb.x0, top: mb.top, x1: mb.x1, bottom: mb.bottom } })
            }
          }
          let np = nxt.pi, nb = nxt.bounds
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
    let scale = Math.min(1.6, 1400 / pi.W)
    let canvas = await renderPage(pi.page, scale)
    let g = canvas.getContext('2d')
    g.fillStyle = '#fff'
    pi.lines.forEach(function (l) {
      g.fillRect(Math.max(0, (l.x0 - 2) * scale), Math.max(0, (l.top - 2) * scale),
        Math.max(1, (l.x1 - l.x0 + 4) * scale), Math.max(1, (l.bottom - l.top + 4) * scale))
    })
    let img = g.getImageData(0, 0, canvas.width, canvas.height).data
    let block = 4
    let gw = Math.floor(canvas.width / block), gh = Math.floor(canvas.height / block)
    if (gw < 2 || gh < 2) return []
    let grid = new Uint8Array(gw * gh)
    for (let gy = 0; gy < gh; gy++) {
      for (let gx = 0; gx < gw; gx++) {
        let dark = 0
        for (let yy = 0; yy < block; yy++) {
          for (let xx = 0; xx < block; xx++) {
            let i = (((gy * block + yy) * canvas.width) + (gx * block + xx)) * 4
            if (img[i] < 175 && img[i + 1] < 175 && img[i + 2] < 175) dark++
          }
        }
        if (dark >= block * block * 0.12) grid[gy * gw + gx] = 1
      }
    }
    let seen = new Uint8Array(gw * gh), comps = []
    let stack = []
    for (let idx = 0; idx < grid.length; idx++) {
      if (!grid[idx] || seen[idx]) continue
      let minx = gw, maxx = 0, miny = gh, maxy = 0, cnt = 0
      stack.length = 0; stack.push(idx); seen[idx] = 1
      while (stack.length) {
        let cur = stack.pop(), cx = cur % gw, cy = (cur - cx) / gw
        minx = Math.min(minx, cx); maxx = Math.max(maxx, cx)
        miny = Math.min(miny, cy); maxy = Math.max(maxy, cy); cnt++
        let nb = [cur - 1, cur + 1, cur - gw, cur + gw]
        for (let q = 0; q < 4; q++) {
          let ni = nb[q]
          if (ni < 0 || ni >= grid.length || seen[ni] || !grid[ni]) continue
          if (q === 0 && cx === 0) continue
          if (q === 1 && cx === gw - 1) continue
          seen[ni] = 1; stack.push(ni)
        }
      }
      let x0 = minx * block / scale, x1 = (maxx + 1) * block / scale
      let top = miny * block / scale, bottom = (maxy + 1) * block / scale
      let w = x1 - x0, h = bottom - top, area = cnt * block * block / (scale * scale)
      if (w < 30 || h < 15 || area < 600) continue
      if (top < 4 || bottom > pi.H - 4) continue
      comps.push({ x0: x0, top: top, x1: x1, bottom: bottom, area: area, isFigure: area >= 1200 || h >= 30 })
    }
    // 合并相近/重叠块
    let merged = []
    comps.sort(function (a, b) { return a.top - b.top })
    comps.forEach(function (c) {
      let hit = null
      for (let i = 0; i < merged.length; i++) {
        let m = merged[i]
        let pad = 8
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
          let cy = (f.top + f.bottom) / 2
          if (cy < seg.rect.top - 10 || cy > seg.rect.bottom + 30) return
          let ox = Math.max(0, Math.min(f.x1, seg.rect.x1) - Math.max(f.x0, seg.rect.x0))
          let oy = Math.max(0, Math.min(f.bottom, seg.rect.bottom) - Math.max(f.top, seg.rect.top))
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
      let g = canvas.getContext('2d')
      let x = Math.max(0, Math.floor(box.x0 * scale)), y = Math.max(0, Math.floor(box.top * scale))
      let w = Math.max(1, Math.min(canvas.width - x, Math.ceil((box.x1 - box.x0) * scale)))
      let h = Math.max(1, Math.min(canvas.height - y, Math.ceil((box.bottom - box.top) * scale)))
      let data = g.getImageData(x, y, w, h).data
      let first = -1, last = -1
      for (let row = 0; row < h; row++) {
        let dark = 0
        for (let col = 0; col < w; col += 2) {
          let i = (row * w + col) * 4
          if (data[i] < 175 && data[i + 1] < 175 && data[i + 2] < 175) { dark++; if (dark > 3) break }
        }
        if (dark > 3) { if (first < 0) first = row; last = row }
      }
      if (first < 0) return box
      let pad = 4
      return {
        x0: box.x0, x1: box.x1,
        top: (y + Math.max(0, first - pad)) / scale,
        bottom: (y + Math.min(h, last + pad + 1)) / scale
      }
    } catch (e) { return box }
  }

  function projectionBlocks(canvas, W, H, scale) {
    let g = canvas.getContext('2d')
    let data = g.getImageData(0, 0, canvas.width, canvas.height).data
    let rows = []
    for (let y = 0; y < canvas.height; y += 2) {
      let dark = 0
      for (let x = 0; x < canvas.width; x += 4) {
        let i = (y * canvas.width + x) * 4
        if (data[i] < 170 && data[i + 1] < 170 && data[i + 2] < 170) dark++
      }
      rows.push(dark)
    }
    let blanks = [], run = 0
    for (let r = 0; r < rows.length; r++) {
      if (rows[r] <= 2) run++
      else { if (run >= 8) blanks.push([r - run, r]); run = 0 }
    }
    if (run >= 8) blanks.push([rows.length - run, rows.length])
    let cuts = [0]
    blanks.forEach(function (b) { if (b[0] > 0 && b[1] < rows.length) cuts.push(Math.floor((b[0] + b[1]) / 2)) })
    cuts.push(rows.length)
    let out = []
    for (let c = 0; c < cuts.length - 1; c++) {
      let y0 = cuts[c] * 2 / scale, y1 = cuts[c + 1] * 2 / scale
      if (y1 - y0 < 36) continue
      out.push({ no: null, segments: [{ page: 0, rect: { x0: W * 0.06, top: y0, x1: W * 0.94, bottom: y1 } }], hasFigure: false, figureRects: [], geometry: 'projection', low: true })
    }
    return out
  }

  function normBoxes(raw, W, H, canvas, scale) {
    let out = []
    ;(raw || []).forEach(function (it) {
      let b = it && (it.box || it.bbox || it.rect)
      if (!Array.isArray(b) || b.length !== 4) return
      let x0 = clamp(+b[0] || 0, 0, 1000) / 1000 * W
      let top = clamp(+b[1] || 0, 0, 1000) / 1000 * H
      let x1 = clamp(+b[2] || 0, 0, 1000) / 1000 * W
      let bottom = clamp(+b[3] || 0, 0, 1000) / 1000 * H
      if (x1 - x0 < 60 || bottom - top < 24) return
      let box = trimBoxByInk(canvas, { x0: x0, top: top, x1: x1, bottom: bottom }, scale)
      if (box.x1 - box.x0 > W * 0.45) { box.x0 = W * 0.06; box.x1 = W * 0.94 }
      let fig = null
      if (it.hasFigure && Array.isArray(it.figureBox) && it.figureBox.length === 4) {
        let fb = it.figureBox
        let fx0 = clamp(+fb[0] || 0, 0, 1000) / 1000 * W, ftop = clamp(+fb[1] || 0, 0, 1000) / 1000 * H
        let fx1 = clamp(+fb[2] || 0, 0, 1000) / 1000 * W, fbot = clamp(+fb[3] || 0, 0, 1000) / 1000 * H
        if (fx1 - fx0 >= 30 && fbot - ftop >= 20) fig = { page: 0, x0: fx0, top: ftop, x1: fx1, bottom: fbot }
      }
      out.push({ no: it.no != null ? +String(it.no).replace(/[^\d]/g, '') || null : null, box: box, hasFigure: !!fig, figureRects: fig ? [fig] : [], conf: num(it.confidence, 0.9) })
    })
    out.sort(function (a, b) { return a.box.top - b.box.top })
    return out
  }

  async function locateScanPage(pi, ctx, signal) {
    let scale = Math.min(1.6, 1400 / pi.W)
    let canvas = await renderPage(pi.page, scale)
    let img = canvasDataUrl(canvas, 1400, 0.72)
    let res
    try {
      res = await askJson(ctx, SYS_LOCATE, '【第 ' + pi.no + ' 页 · 整页图片】请定位本页所有题目（含配图）。', img, 3000, signal)
    } catch (e) { res = null }
    let raw = res && res.questions || []
    let boxes = normBoxes(raw, pi.W, pi.H, canvas, scale)
    if (!boxes.length) {
      let pb = projectionBlocks(canvas, pi.W, pi.H, scale)
      pb.forEach(function (b) {
        b.pageStart = pi.no
        b.pageEnd = pi.no
        b.segments[0].page = pi.no
      })
      return pb
    }
    return boxes.map(function (b) {
      let seg = { page: pi.no, rect: { x0: b.box.x0, top: b.box.top, x1: b.box.x1, bottom: b.box.bottom } }
      let figs = (b.figureRects || []).map(function (f) { return { page: pi.no, x0: f.x0, top: f.top, x1: f.x1, bottom: f.bottom } })
      return { no: b.no, pageStart: pi.no, pageEnd: pi.no, segments: [seg], hasFigure: !!figs.length, figureRects: figs, geometry: 'vision', section: '', low: !b.no }
    })
  }

  /* ---------------- AI ---------------- */
  async function askJson(ctx, sys, user, image, maxTokens, signal) {
    if (!ctx.AI || typeof ctx.AI.chatJSON !== 'function') throw new Error('AI 未就绪')
    if (!ctx.AI.configured()) throw new Error('请先在设置里配置 AI 接口')
    let opts = {
      ctx: AI_CTX, noTools: true, noThink: true, cache: false,
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
    let pinfos = []
    let maxPages = Math.min(opts.maxPages || MAX_PAGES_DEFAULT, doc.numPages)
    onProgress(3, '解析 PDF：' + doc.numPages + ' 页')
    for (let i = 1; i <= maxPages; i++) {
      if (state.cancelled) throw new Error('已取消')
      let page = await doc.getPage(i)
      pinfos.push(await pageInfo(page, i))
      onProgress(3 + Math.round(i / maxPages * 7), '读取文字层 ' + i + '/' + maxPages)
    }
    let scanPages = pinfos.filter(function (p) { return p.kind === 'scan' })
    onProgress(10, '切题：文字页 ' + (pinfos.length - scanPages.length) + ' / 扫描页 ' + scanPages.length)

    // 扫描页几何
    let scanBlocks = []
    if (scanPages.length) {
      let loc = await pool(scanPages, 2, async function (pi) {
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
    let textBlocks = buildTextBlocks(pinfos)
    for (let pi2 = 0; pi2 < pinfos.length; pi2++) {
      let p = pinfos[pi2]
      if (p.kind !== 'text') continue
      try {
        let figs = await detectFigures(p)
        attachFigures(textBlocks, p, figs)
      } catch (e) { /* 配图检测失败不阻塞 */ }
    }
    let blocks = textBlocks.concat(scanBlocks)
    blocks.sort(function (a, b) { return a.pageStart - b.pageStart || (a.segments[0].rect.top - b.segments[0].rect.top) })

    // 页面级 AI
    let groups = []
    let cur = []
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

    let aiQs = []
    await pool(groups, 3, async function (g) {
      if (state.cancelled) throw new Error('已取消')
      try {
        let qs = await extractGroup(g, opts, state)
        qs.forEach(function (q) { aiQs.push(q) })
      } catch (e) {
        if (g.kind === 'text') {
          for (let k = 0; k < g.pages.length; k++) {
            try {
              let qs2 = await extractOnePage(g.pages[k], opts, state)
              qs2.forEach(function (q) { aiQs.push(q) })
            } catch (e2) { }
          }
        }
      }
    }, function (d, n) { onProgress(15 + Math.round(d / n * 45), 'AI 拆题 ' + d + '/' + n + ' 组') })

    if (!aiQs.length && !blocks.length) throw new Error('没有识别到任何题目')
    if (!aiQs.length) throw new Error('AI 未识出题目（可检查接口/视觉能力）')

    // 合并
    let merged = mergeBlocks(blocks, aiQs, pinfos)
    merged = merged.filter(function (q) { return !(isNoise(q.stem) && !q.hasFigure) })
    if (!merged.length) throw new Error('未识别到有效题目（可能整页都是封面/页眉水印）')
    merged.sort(function (a, b) { return (a.sourcePages[0] || 999) - (b.sourcePages[0] || 999) || (a._order || 0) - (b._order || 0) })
    let nos = merged.map(function (q) { return q.no })
    let needRen = nos.some(function (n) { return n == null })
    if (!needRen) {
      let seen = {}, prev = 0
      for (let z = 0; z < nos.length; z++) {
        let nz = +nos[z]
        if (!isFinite(nz) || seen[nz] || nz <= prev) { needRen = true; break }
        seen[nz] = 1; prev = nz
      }
    }
    if (needRen) merged.forEach(function (q, i) { q.no = i + 1 })

    // 低置信 / 图片按需
    onProgress(65, '整理题目 / 按需裁图')
    let questions = []
    let cropScale = 2.2
    let canvasCache = {}
    for (let qi = 0; qi < merged.length; qi++) {
      if (state.cancelled) throw new Error('已取消')
      let q = merged[qi]
      let stem = stripNoise(q.stem || '').trim()
      stem = stem.replace(/^\s*[一二三四五六七八九十]{1,3}\s*[、.．]\s*/, '')
        .replace(/^\s*[\[【]\s*\d+\s*分\s*[\]】]\s*/, '')
        .replace(/^\s*[（(]\s*\d+\s*分\s*[)）]\s*/, '')
      let type = inferType(q)
      let opts4 = Array.isArray(q.options) ? q.options.filter(function (x) { return String(x || '').trim() }) .map(String) : []
      let note = ''
      if (type === 'choice' && opts4.length !== 4) {
        if (opts4.length >= 2) stem += '\n' + opts4.join('\n')
        opts4 = []; type = 'solve'; note = '选择题缺选项'
      }
      let conf = q.confidence == null ? null : num(q.confidence, null)
      let low = !stem || note !== '' || (conf != null && conf < opts.lowConf)
      if (q.geometry === 'projection' || q.geometry === 'ai-only') low = true
      let needImg = needImage({ hasFigure: q.hasFigure, confidence: conf, stem: stem }, opts)
      let img = ''
      if (needImg && q._segments && q._segments.length) {
        try {
          let cs = []
          for (let si = 0; si < q._segments.length; si++) {
            let seg = q._segments[si]
            let pp = pinfos[seg.page - 1]
            if (!pp) continue
            let key = 'p' + seg.page + '_' + cropScale
            if (!canvasCache[key]) {
              canvasCache[key] = await renderPage(pp.page, cropScale)
              let keys = Object.keys(canvasCache)
              if (keys.length > 4) delete canvasCache[keys[0]]
            }
            let c = cropCanvas(canvasCache[key], seg.rect, cropScale)
            if (c) cs.push(c)
          }
          let comp = composeVertical(cs)
          if (comp) img = canvasDataUrl(
            comp,
            opts.preset === 'compact' ? 900 : 1100,
            opts.preset === 'compact' ? 0.72 : 0.75
          )
        } catch (e) { try { console.error('[paper-extract] 裁图失败', e) } catch (e2) { } }
      }
      let item = {
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
      let text = g.pages.map(function (p) {
        return '【第 ' + p.no + ' 页】\n' + p.lines.map(function (l) { return l.text }).join('\n')
      }).join('\n\n').slice(0, 24000)
      let res = await askJson(opts.ctx, SYS_TEXT, text, null, 8192, opts.signal)
      return questionsOf(res).map(function (q) { return normQuestion(q, { pages: g.pages.map(function (p) { return p.no }) }) })
    }
    return await extractOnePage(g.pages[0], opts, state)
  }

  async function extractOnePage(p, opts, state) {
    let scale = Math.min(1.8, 1600 / p.W)
    let canvas = await renderPage(p.page, scale)
    let img = canvasDataUrl(canvas, 1600, 0.72)
    let res = await askJson(opts.ctx, SYS_VISION, '【第 ' + p.no + ' 页 · 整页图片】请逐题识别。', img, 8192, opts.signal)
    return questionsOf(res).map(function (q) { return normQuestion(q, { pages: [p.no] }) })
  }

  function mergeBlocks(blocks, aiQs, pinfos) {
    let used = {}, out = []
    let byNo = {}
    aiQs.forEach(function (q, i) { if (q.no != null) (byNo[q.no] = byNo[q.no] || []).push(i) })
    function take(b) {
      let cand = []
      aiQs.forEach(function (q, i) {
        if (used[i]) return
        let pages = q._groupPages || []
        if (b.no != null && q.no === b.no && pages.indexOf(b.pageStart) >= 0) cand.push(i)
      })
      if (!cand.length && b.no != null) {
        aiQs.forEach(function (q, i) { if (!used[i] && q.no === b.no) cand.push(i) })
      }
      if (!cand.length) {
        aiQs.forEach(function (q, i) {
          if (used[i]) return
          let pages = q._groupPages || []
          if (pages.indexOf(b.pageStart) >= 0) cand.push(i)
        })
      }
      if (!cand.length) {
        aiQs.forEach(function (q, i) {
          if (used[i]) return
          let pages = q._groupPages || []
          if (pages.some(function (p) { return b.segments.some(function (s) { return s.page === p }) })) cand.push(i)
        })
      }
      return cand.length ? cand[0] : -1
    }
    blocks.forEach(function (b) {
      let idx = take(b)
      let q = idx >= 0 ? aiQs[idx] : {}
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
      let pno = (q._groupPages || [1])[0]
      let pi = pinfos[pno - 1]
      if (!pi) return
      let rect = { x0: pi.W * 0.06, top: pi.H * 0.06, x1: pi.W * 0.94, bottom: pi.H * 0.9 }
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

  /* ══════════════════════════════════════════════════════════════════
   * 公共层：三个子页共用（导航 / 口径 / 卷库持久化 / 题目视图 / 灯箱）
   * ══════════════════════════════════════════════════════════════════ */

  let SUBJ = [
    { k: 'math', label: '数学' },
    { k: 'major', label: '专业课' },
    { k: 'eng', label: '英语' },
    { k: 'pol', label: '政治' }
  ]
  function subjLabel(k) {
    for (let i = 0; i < SUBJ.length; i++) if (SUBJ[i].k === k) return SUBJ[i].label
    return k || '综合'
  }

  let PAGES = [
    { id: T_MAIN, label: '提取台', icon: '📄' },
    { id: T_LIB, label: '卷库', icon: '🗂' },
    { id: T_SETUP, label: '设置体检', icon: '⚙️' }
  ]

  function fmtSize(chars) {
    let n = Number(chars) || 0
    if (n < 1024) return n + ' B'
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB'
    return (n / 1024 / 1024).toFixed(2) + ' MB'
  }
  function fmtWhen(iso) {
    let t = Date.parse(String(iso || ''))
    if (!isFinite(t)) return ''
    let d = (Date.now() - t) / 1000
    if (d < 60) return '刚刚'
    if (d < 3600) return Math.floor(d / 60) + ' 分钟前'
    if (d < 86400) return Math.floor(d / 3600) + ' 小时前'
    let dt = new Date(t)
    let p = function (n) { return n < 10 ? '0' + n : String(n) }
    return (dt.getMonth() + 1) + '-' + p(dt.getDate()) + ' ' + p(dt.getHours()) + ':' + p(dt.getMinutes())
  }
  function examChars(exam) { try { return JSON.stringify(exam || {}).length } catch (e) { return 0 } }
  function examFigures(exam) {
    let n = 0
    ;((exam && exam.questions) || []).forEach(function (q) { if (q && q.diagramImg) n++ })
    return n
  }

  /* ---------------- 卷库（ctx.data 持久化 + 体积闸） ----------------
   * 题卷整卷（含数据 URL 配图）会随 Store 持久化并参与云同步。这里做两件事：
   *   ① 最多留 BANK_MAX 卷（多的按时间淘汰）；
   *   ② 总量超预算时，**从最老的卷开始移除图片**并打 imgDropped 标记（界面如实显示），
   *      绝不静默丢题干 —— 文字是骨架，图可以重提取。 */
  function bankGet(ctx) {
    let raw = ctx.data('bank')
    return Array.isArray(raw) ? raw.filter(function (x) { return x && Array.isArray(x.questions) }) : []
  }
  function stripImages(exam) {
    let c = JSON.parse(JSON.stringify(exam))
    ;(c.questions || []).forEach(function (q) {
      if (q && q.diagramImg) { delete q.diagramImg; q.imgDropped = true }
    })
    c.meta = c.meta || {}
    c.meta.images = 0
    c.meta.imgDropped = true
    return c
  }
  function bankSave(ctx, exam) {
    let list = bankGet(ctx).filter(function (x) { return x.id !== exam.id })
    list.unshift(exam)
    let keep = [], total = 0, dropped = 0, trimmed = 0
    for (let i = 0; i < list.length; i++) {
      if (keep.length >= BANK_MAX) { dropped++; continue }
      let e = list[i]
      let sz = examChars(e)
      if (keep.length > 0 && total + sz > BANK_CHAR_BUDGET) {
        e = stripImages(e); sz = examChars(e); trimmed++
      }
      if (total + sz > BANK_CHAR_BUDGET * 1.4) { dropped++; continue }
      total += sz
      keep.push(e)
    }
    ctx.data('bank', keep)
    return { kept: keep.length, dropped: dropped, trimmed: trimmed, chars: total }
  }

  /* ---------------- 子页导航 ---------------- */
  function navHtml(active) {
    return '<nav class="px-nav">' + PAGES.map(function (p) {
      return '<a data-goto="' + p.id + '" class="' + (p.id === active ? 'on' : '') + '">'
        + '<b>' + p.icon + '</b>' + p.label + '</a>'
    }).join('') + '<span class="px-nav-v">v' + VERSION + '</span></nav>'
  }
  function bindNav(el, ctx, active) {
    el.querySelectorAll('[data-goto]').forEach(function (a) {
      a.onclick = function () {
        let id = a.getAttribute('data-goto')
        if (id && id !== active) ctx.api.goTool(id)
      }
    })
  }

  /* ---------------- 引擎体检（三个子页都要说同一句话） ---------------- */
  function healthOf(ctx) {
    let pdf = !!(window.PdfKit && typeof window.PdfKit.open === 'function')
    let paper = !!(window.PaperKit && typeof window.PaperKit.addDrafts === 'function')
    let ai = false
    try { ai = !!(ctx.AI && ctx.AI.configured()) } catch (e) { ai = false }
    return { pdf: pdf, paper: paper, ai: ai }
  }
  function healthHtml(ctx) {
    let h = healthOf(ctx)
    let cell = function (ok, name, note) {
      return '<span class="px-hcell ' + (ok ? 'ok' : 'no') + '"><i></i>' + name
        + '<em>' + (ok ? '就绪' : note) + '</em></span>'
    }
    return '<div class="px-health">'
      + cell(h.pdf, 'PDF 引擎', '缺 PdfKit')
      + cell(h.ai, 'AI 接口', '未配置')
      + cell(h.paper, '题卷入库', '只能导出 JSON')
      + '</div>'
  }

  /* ---------------- 题目视图（提取结果 / 卷库回看共用） ----------------
   * 判据只有一份：hasFigure 走字段、纯图 = 有图且无题干文字。 */
  let FILTERS = [
    { k: 'all', label: '全部' },
    { k: 'fig', label: '带图' },
    { k: 'imgonly', label: '纯图' },
    { k: 'low', label: '低置信' },
    { k: 'noans', label: '无答案' }
  ]
  function qtPass(q, filter, kw) {
    if (!q) return false
    let stem = String(q.stem || '')
    if (filter === 'fig' && !q.diagramImg && !q.hasFigure) return false
    if (filter === 'imgonly' && !(q.diagramImg && !stem.trim())) return false
    if (filter === 'low' && !q.lowConfidence) return false
    if (filter === 'noans' && !q.noAnswer) return false
    if (kw) {
      let hay = (stem + ' ' + String(q.topicName || '') + ' ' + String(q.figureKind || '')).toLowerCase()
      if (hay.indexOf(kw) < 0) return false
    }
    return true
  }
  function qCardHtml(q, i) {
    let img = q.diagramImg || ''
    let stem = String(q.stem || '')
    let isImgOnly = !!img && !stem.trim()
    let tags = '<span class="px-tag">' + esc(q.type || 'solve') + '</span>'
    if (q.hasFigure) tags += '<span class="px-tag fig">带图' + (q.figureKind ? ' · ' + esc(q.figureKind) : '') + '</span>'
    if (isImgOnly) tags += '<span class="px-tag imgonly">纯图题</span>'
    if (q.lowConfidence) tags += '<span class="px-tag low">低置信</span>'
    if (q.noAnswer) tags += '<span class="px-tag noans">卷面无答案</span>'
    if (q.imgDropped) tags += '<span class="px-tag low">图已清理</span>'
    let opts = (q.options || []).map(function (o) { return '<div class="px-opt">' + esc(o) + '</div>' }).join('')
    let meta = []
    if (q.score) meta.push('分值 ' + q.score)
    if (q.star) meta.push('难度 ' + q.star)
    if (q.topicName) meta.push('考点 ' + esc(q.topicName))
    if (q.confidence != null) meta.push('置信 ' + q.confidence)
    if ((q.sourcePages || []).length) meta.push('P' + q.sourcePages.join('、'))
    return '<div class="px-q ' + (img ? '' : 'noimg') + '" data-q="' + i + '">'
      + (img ? '<div class="px-q-img"><img src="' + img + '" data-zoom="' + i + '" loading="lazy" alt="第 ' + (q.no || i + 1) + ' 题配图">'
        + '<span class="px-q-z">点击放大</span></div>' : '')
      + '<div class="px-q-body">'
      + '<div class="px-q-hd"><span class="px-no">第 ' + (q.no || i + 1) + ' 题</span>' + tags + '</div>'
      + (stem ? '<div class="px-stem">' + esc(stem) + '</div>'
        : (img ? '<div class="px-stem px-stem-img">题干就在上面这张配图里（未提取到文字）</div>' : '<div class="px-stem px-stem-img">（题干为空）</div>'))
      + (opts ? '<div class="px-opts">' + opts + '</div>' : '')
      + (q.figureDesc ? '<div class="px-fig-note">图：' + esc(q.figureDesc) + '</div>' : '')
      + '<div class="px-meta">' + meta.map(function (m) { return '<span>' + m + '</span>' }).join('') + '</div>'
      + '<div class="px-q-ft"><button class="px-mini" data-copy="' + i + '">复制本题 JSON</button></div>'
      + '</div></div>'
  }

  function mountQView(host, ctx) {
    let S = { exam: null, filter: 'all', kw: '' }
    let box = document.createElement('div')
    box.className = 'px-view'
    box.innerHTML = '<div class="px-tools">'
      + '<div class="px-seg" data-seg="1">' + FILTERS.map(function (f, k) {
        return '<button data-f="' + f.k + '"' + (k === 0 ? ' class="on"' : '') + '>' + f.label + '</button>'
      }).join('') + '</div>'
      + '<input class="px-search" data-kw="1" placeholder="搜题干 / 考点 / 图形">'
      + '<span class="px-count" data-count="1"></span>'
      + '</div><div data-list="1"></div>'
    host.innerHTML = ''
    host.appendChild(box)
    let listEl = box.querySelector('[data-list]')

    function shown() {
      let qs = (S.exam && S.exam.questions) || []
      let kw = String(S.kw || '').trim().toLowerCase()
      let out = []
      qs.forEach(function (q, i) { if (qtPass(q, S.filter, kw)) out.push({ q: q, i: i }) })
      return out
    }
    function paint() {
      let items = shown()
      let total = (S.exam && S.exam.questions || []).length
      box.querySelector('[data-count]').textContent = items.length === total
        ? ('共 ' + total + ' 题') : ('筛出 ' + items.length + ' / ' + total + ' 题')
      if (!items.length) {
        listEl.innerHTML = '<div class="px-empty">这个筛选下没有题目 —— 换一个条件看看</div>'
        return
      }
      listEl.innerHTML = items.map(function (it) { return qCardHtml(it.q, it.i) }).join('')
    }
    box.addEventListener('click', function (e) {
      let t = e.target
      let seg = t.closest && t.closest('.px-seg button')
      if (seg) {
        box.querySelectorAll('.px-seg button').forEach(function (b) { b.classList.remove('on') })
        seg.classList.add('on')
        S.filter = seg.getAttribute('data-f')
        paint()
        return
      }
      let zoom = t.closest && t.closest('[data-zoom]')
      if (zoom) {
        let qi = +zoom.getAttribute('data-zoom')
        let imgs = shown().filter(function (it) { return !!it.q.diagramImg })
        let at = 0
        imgs.forEach(function (it, k) { if (it.i === qi) at = k })
        openLb(imgs.map(function (it) {
          return { src: it.q.diagramImg, cap: '第 ' + (it.q.no || it.i + 1) + ' 题' + (it.q.figureKind ? ' · ' + it.q.figureKind : '') }
        }), at)
        return
      }
      let cp = t.closest && t.closest('[data-copy]')
      if (cp) {
        let q = (S.exam.questions || [])[+cp.getAttribute('data-copy')]
        if (q) copyText(ctx, JSON.stringify(q, null, 2), '本题 JSON 已复制')
      }
    })
    box.addEventListener('input', function (e) {
      if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-kw')) {
        S.kw = e.target.value
        paint()
      }
    })
    return {
      set: function (exam) { S.exam = exam; S.filter = 'all'; S.kw = ''; paint() },
      clear: function () { S.exam = null; box.querySelector('[data-list]').innerHTML = '' }
    }
  }

  function copyText(ctx, txt, okMsg) {
    try {
      navigator.clipboard.writeText(txt).then(function () {
        ctx.Toast.show(okMsg || '已复制', 'success', 1500)
      }, function () { ctx.Toast.show('复制失败，请手动选中', 'warn', 2000) })
    } catch (e) { ctx.Toast.show('复制失败', 'warn', 2000) }
  }

  /* ---------------- 灯箱（可左右翻，Esc 关） ---------------- */
  let LB = { list: [], at: 0, root: null }
  function lbHtml() {
    return '<div class="px-lb" data-lb-root="1">'
      + '<button class="px-lb-x" data-lb="close" aria-label="关闭">✕</button>'
      + '<button class="px-lb-nav prev" data-lb="prev" aria-label="上一张">‹</button>'
      + '<img data-lb-img="1" alt="题图">'
      + '<button class="px-lb-nav next" data-lb="next" aria-label="下一张">›</button>'
      + '<div class="px-lb-cap" data-lb-cap="1"></div></div>'
  }
  function lbPaint() {
    if (!LB.root) return
    let it = LB.list[LB.at]
    if (!it) return
    LB.root.querySelector('[data-lb-img]').src = it.src
    LB.root.querySelector('[data-lb-cap]').textContent = it.cap + (LB.list.length > 1 ? '　' + (LB.at + 1) + '/' + LB.list.length : '')
    let many = LB.list.length > 1
    LB.root.querySelectorAll('[data-lb="prev"]').forEach(function (b) { b.style.display = many ? '' : 'none' })
    LB.root.querySelectorAll('[data-lb="next"]').forEach(function (b) { b.style.display = many ? '' : 'none' })
  }
  function openLb(list, at) {
    if (!LB.root || !list.length) return
    LB.list = list
    LB.at = Math.max(0, Math.min(list.length - 1, at || 0))
    LB.root.classList.add('on')
    lbPaint()
  }
  function bindLb(el) {
    let root = el.querySelector('[data-lb-root]')
    if (!root) return
    LB.root = root
    root.onclick = function (e) {
      let act = e.target.getAttribute && e.target.getAttribute('data-lb')
      if (!act) { if (e.target === root) closeLb(); return }
      if (act === 'close') closeLb()
      else if (act === 'prev') { LB.at = (LB.at - 1 + LB.list.length) % LB.list.length; lbPaint() }
      else if (act === 'next') { LB.at = (LB.at + 1) % LB.list.length; lbPaint() }
    }
  }
  function closeLb() { if (LB.root) LB.root.classList.remove('on') }

  /* ---------------- 入库（唯一口径：交给站点的 PaperKit） ----------------
   * 插件**不自己归一化**：exam 原样 JSON.stringify 后交给 PaperKit.parseJson，
   * 字段猜测/分值修补/纯图题判定全在 core/paperJson 那一份里，这里只负责说人话。 */
  function importToPapers(ctx, exam, openAfter) {
    let pk = window.PaperKit
    if (!pk || typeof pk.addDrafts !== 'function') {
      ctx.Toast.show('站点未提供题卷入库桥（PaperKit）—— 请用「下载 exam.json」再手动导入', 'warn', 3600)
      return null
    }
    let r
    try { r = pk.parseJson(JSON.stringify(exam)) } catch (e) { r = { ok: false, error: (e && e.message) || String(e) } }
    if (!r || !r.ok) {
      ctx.Toast.show('入库失败：' + ((r && r.error) || '格式不被识别'), 'warn', 3800)
      return null
    }
    let add = pk.addDrafts(r.papers)
    if (!add || !add.ids.length) {
      ctx.Toast.show('入库失败：' + ((add && add.skipped && add.skipped[0]) || '未知原因'), 'warn', 3800)
      return null
    }
    let extra = (r.warnings && r.warnings.length) ? '（有 ' + r.warnings.length + ' 条提醒）' : ''
    ctx.Toast.show('已送入「我的题卷」：' + r.stats.questions + ' 题' + extra, 'success', 2600)
    if (openAfter) pk.open(add.ids[0])
    return { ids: add.ids, stats: r.stats, warnings: r.warnings || [], skipped: add.skipped || [] }
  }

  /* ══════════════════════════════════════════════════════════════════
   * 样式：全部走站点设计令牌（夜间的 --surface 是深色，硬编码 #fff 会白底白字）
   * ══════════════════════════════════════════════════════════════════ */
  let CSS = [
    '.px-wrap{--px-acc:var(--blue,#2563eb);--px-ink:var(--text-primary,#1b2430);--px-sub:var(--text-muted,#6b7788);--px-line:var(--line,#e3e8f0);--px-bg:var(--surface,#fff);--px-soft:var(--surface-muted,#f6f8fb);color:var(--px-ink);font:14px/1.6 "Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;max-width:1180px;margin:0 auto}',
    /* 导航 */
    '.px-nav{display:flex;align-items:center;gap:6px;padding:6px;border:1px solid var(--px-line);border-radius:14px;background:var(--px-bg);margin-bottom:16px;flex-wrap:wrap;box-shadow:0 1px 2px rgba(16,30,60,.04)}',
    '.px-nav a{display:inline-flex;align-items:center;gap:7px;padding:8px 15px;border-radius:10px;font-size:13px;font-weight:600;color:var(--text-secondary,#4a5670);cursor:pointer;transition:background .16s,color .16s,transform .16s;user-select:none}',
    '.px-nav a b{font-size:15px;font-weight:400}',
    '.px-nav a:hover{background:var(--px-soft);color:var(--px-ink)}',
    '.px-nav a.on{background:var(--px-acc);color:#fff;box-shadow:0 4px 12px rgba(37,99,235,.28)}',
    '.px-nav-v{margin-left:auto;font-size:11px;color:var(--px-sub);letter-spacing:.4px;padding-right:6px}',
    /* 卡片 */
    '.px-card{background:var(--px-bg);border:1px solid var(--px-line);border-radius:16px;padding:18px 18px 16px;margin-bottom:14px;box-shadow:0 8px 24px rgba(20,35,70,.05)}',
    '.px-h{display:flex;align-items:center;gap:9px;font-size:17px;font-weight:800;margin:0 0 5px}',
    '.px-h em{font-style:normal;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--px-soft);color:var(--px-sub);border:1px solid var(--px-line)}',
    '.px-sub{color:var(--px-sub);font-size:12.5px;line-height:1.75;margin-bottom:14px}',
    /* 体检 */
    '.px-health{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}',
    '.px-hcell{display:inline-flex;align-items:center;gap:7px;font-size:12px;padding:6px 11px;border-radius:999px;border:1px solid var(--px-line);background:var(--px-soft);color:var(--px-sub)}',
    '.px-hcell i{width:7px;height:7px;border-radius:50%;background:var(--px-sub);display:inline-block}',
    '.px-hcell.ok{color:var(--ok,#16a34a);border-color:rgba(22,163,74,.35);background:rgba(22,163,74,.08)}',
    '.px-hcell.ok i{background:var(--ok,#16a34a)}',
    '.px-hcell.no{color:var(--warn,#d97706);border-color:rgba(217,119,6,.32);background:rgba(217,119,6,.08)}',
    '.px-hcell.no i{background:var(--warn,#d97706)}',
    '.px-hcell em{font-style:normal;color:inherit;opacity:.85}',
    /* 表单 */
    '.px-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(178px,1fr));gap:12px}',
    '.px-f{display:flex;flex-direction:column;gap:6px;font-size:12px;color:var(--px-sub)}',
    '.px-f select,.px-f input,.px-search{height:36px;border:1px solid var(--px-line);border-radius:10px;padding:0 10px;background:var(--px-bg);color:var(--px-ink);outline:none;font-size:13px;font-family:inherit}',
    '.px-f select:focus,.px-f input:focus,.px-search:focus,.px-ta:focus{border-color:var(--px-acc);box-shadow:0 0 0 3px rgba(37,99,235,.13)}',
    '.px-ta{width:100%;min-height:96px;border:1px solid var(--px-line);border-radius:10px;padding:10px;background:var(--px-bg);color:var(--px-ink);font:12.5px/1.7 ui-monospace,Consolas,monospace;outline:none;resize:vertical;box-sizing:border-box}',
    '.px-more{margin:12px 0 4px;border-top:1px dashed var(--px-line);padding-top:10px}',
    '.px-more>summary{cursor:pointer;font-size:12.5px;color:var(--px-sub);font-weight:600;user-select:none;list-style:none}',
    '.px-more>summary::-webkit-details-marker{display:none}',
    '.px-more>summary:before{content:"▸ ";color:var(--px-acc)}',
    '.px-more[open]>summary:before{content:"▾ "}',
    '.px-more>.px-grid{margin-top:12px}',
    /* 上传区 */
    '.px-drop{border:1.6px dashed var(--px-line);border-radius:14px;background:var(--px-soft);padding:22px 16px;text-align:center;cursor:pointer;transition:border-color .18s,background .18s;margin:4px 0 14px}',
    '.px-drop:hover,.px-drop.over{border-color:var(--px-acc);background:rgba(37,99,235,.05)}',
    '.px-drop.has{border-style:solid;border-color:var(--ok,#16a34a);background:rgba(22,163,74,.05)}',
    '.px-drop .ico{font-size:26px;line-height:1.2;display:block;margin-bottom:4px}',
    '.px-drop b{display:block;font-size:13.5px;word-break:break-all}',
    '.px-drop small{color:var(--px-sub);font-size:11.5px;line-height:1.7;display:block;margin-top:3px}',
    /* 按钮 */
    '.px-btn{height:36px;padding:0 15px;border-radius:10px;border:1px solid var(--px-line);background:var(--px-bg);cursor:pointer;font-weight:600;font-size:13px;color:var(--text-secondary,#33425a);font-family:inherit;transition:transform .12s,border-color .16s,background .16s}',
    '.px-btn:hover:not(:disabled){border-color:var(--px-acc);color:var(--px-acc)}',
    '.px-btn:active:not(:disabled){transform:translateY(1px)}',
    '.px-btn.primary{background:linear-gradient(135deg,var(--blue,#2563eb),var(--purple,#7c3aed));color:#fff;border:0;box-shadow:0 6px 16px rgba(37,99,235,.25)}',
    '.px-btn.primary:hover:not(:disabled){color:#fff;filter:brightness(1.05)}',
    '.px-btn.danger{color:var(--danger,#dc2626);border-color:rgba(220,38,38,.3)}',
    '.px-btn.danger:hover:not(:disabled){background:rgba(220,38,38,.07);color:var(--danger,#dc2626)}',
    '.px-btn.sm{height:30px;padding:0 11px;font-size:12px;border-radius:9px}',
    '.px-btn:disabled{opacity:.45;cursor:not-allowed}',
    '.px-actions{display:flex;gap:9px;align-items:center;flex-wrap:wrap}',
    '.px-msg{font-size:12px;color:var(--px-sub)}',
    /* 进度 */
    '.px-bar{height:9px;background:var(--px-soft);border-radius:999px;overflow:hidden;margin:14px 0 8px;display:none}',
    '.px-bar.on{display:block}',
    '.px-bar i{display:block;height:100%;width:0;border-radius:999px;background:linear-gradient(90deg,var(--blue,#2563eb),var(--purple,#7c3aed));transition:width .3s ease}',
    '.px-steps{display:flex;gap:7px;flex-wrap:wrap}',
    '.px-step{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;padding:5px 11px;border-radius:999px;border:1px solid var(--px-line);color:var(--px-sub);background:var(--px-bg);transition:all .2s}',
    '.px-step i{width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.55}',
    '.px-step.on{border-color:var(--px-acc);color:var(--px-acc);font-weight:700;background:rgba(37,99,235,.07)}',
    '.px-step.done{border-color:rgba(22,163,74,.4);color:var(--ok,#16a34a);background:rgba(22,163,74,.07)}',
    '.px-log{max-height:190px;overflow:auto;background:#0d1524;color:#c8d6ee;border-radius:11px;padding:11px;font:11.5px/1.7 ui-monospace,Consolas,monospace;white-space:pre-wrap;margin-top:10px}',
    '.px-log:empty{display:none}',
    /* 统计 chips */
    '.px-chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:13px}',
    '.px-chip{font-size:12px;border-radius:999px;padding:5px 12px;background:var(--px-soft);border:1px solid var(--px-line);color:var(--px-sub)}',
    '.px-chip b{color:var(--px-ink);font-size:13px;margin:0 2px}',
    /* 筛选 */
    '.px-tools{display:flex;gap:9px;flex-wrap:wrap;align-items:center;margin-bottom:12px}',
    '.px-seg{display:inline-flex;background:var(--px-soft);border:1px solid var(--px-line);border-radius:11px;padding:3px;gap:2px}',
    '.px-seg button{border:0;background:none;font:600 12px/1 inherit;padding:7px 12px;border-radius:8px;cursor:pointer;color:var(--px-sub);font-family:inherit}',
    '.px-seg button.on{background:var(--px-bg);color:var(--px-ink);box-shadow:0 1px 4px rgba(16,30,60,.12)}',
    '.px-search{width:220px;max-width:46vw}',
    '.px-count{font-size:12px;color:var(--px-sub);margin-left:auto}',
    /* 题目卡 */
    '.px-q{border:1px solid var(--px-line);border-radius:14px;padding:13px;margin-bottom:11px;display:grid;grid-template-columns:264px 1fr;gap:15px;background:var(--px-bg);transition:box-shadow .18s,transform .18s}',
    '.px-q:hover{box-shadow:0 6px 18px rgba(20,35,70,.07)}',
    '.px-q.noimg{grid-template-columns:1fr}',
    '.px-q-img{position:relative;align-self:start}',
    '.px-q-img img{width:100%;max-height:230px;object-fit:contain;border:1px solid var(--px-line);border-radius:10px;background:var(--px-soft);cursor:zoom-in;display:block}',
    '.px-q-z{position:absolute;right:7px;bottom:7px;font-size:10.5px;padding:2px 7px;border-radius:999px;background:rgba(13,21,36,.72);color:#fff;pointer-events:none;opacity:0;transition:opacity .16s}',
    '.px-q-img:hover .px-q-z{opacity:1}',
    '.px-q-hd{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:7px}',
    '.px-no{display:inline-block;background:#1f2b3d;color:#fff;border-radius:8px;padding:2px 9px;font-weight:800;font-size:12px}',
    '.px-tag{display:inline-block;font-size:11px;border-radius:999px;padding:2px 8px;background:var(--px-soft);color:var(--text-secondary,#41536e);border:1px solid var(--px-line)}',
    '.px-tag.fig{background:rgba(22,163,74,.1);color:#14653a;border-color:rgba(22,163,74,.25)}',
    '.px-tag.imgonly{background:rgba(37,99,235,.1);color:#1d4ed8;border-color:rgba(37,99,235,.25)}',
    '.px-tag.low{background:rgba(220,38,38,.09);color:#9a2f1b;border-color:rgba(220,38,38,.22)}',
    '.px-tag.noans{background:rgba(217,119,6,.1);color:#92400e;border-color:rgba(217,119,6,.24)}',
    '.px-stem{white-space:pre-wrap;word-break:break-word;margin:4px 0 8px;font-size:13.5px;line-height:1.75}',
    '.px-stem-img{color:var(--px-sub);font-style:italic}',
    '.px-opts{display:flex;flex-direction:column;gap:3px;margin-bottom:7px}',
    '.px-opt{font-size:13px;color:var(--text-secondary,#41536e)}',
    '.px-fig-note{background:rgba(22,163,74,.06);border-left:3px solid var(--ok,#16a34a);padding:6px 10px;border-radius:0 8px 8px 0;margin:6px 0;font-size:12.5px}',
    '.px-meta{color:var(--px-sub);font-size:11.5px;display:flex;gap:12px;flex-wrap:wrap;margin-top:4px}',
    '.px-q-ft{margin-top:8px}',
    '.px-mini{border:1px solid var(--px-line);background:none;border-radius:8px;font-size:11px;padding:4px 9px;cursor:pointer;color:var(--px-sub);font-family:inherit}',
    '.px-mini:hover{border-color:var(--px-acc);color:var(--px-acc)}',
    /* 卷库 */
    '.px-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-bottom:14px}',
    '.px-stat{border:1px solid var(--px-line);border-radius:13px;padding:12px 14px;background:var(--px-bg)}',
    '.px-stat b{display:block;font-size:21px;font-weight:800;line-height:1.25;color:var(--px-ink)}',
    '.px-stat span{font-size:11.5px;color:var(--px-sub)}',
    '.px-lib{border:1px solid var(--px-line);border-radius:14px;padding:14px;margin-bottom:10px;background:var(--px-bg);transition:box-shadow .18s}',
    '.px-lib:hover{box-shadow:0 8px 20px rgba(20,35,70,.07)}',
    '.px-lib-hd{display:flex;gap:11px;align-items:flex-start;flex-wrap:wrap}',
    '.px-lib-t{font-weight:700;font-size:14px;line-height:1.5;flex:1;min-width:180px;word-break:break-word}',
    '.px-lib-m{font-size:11.5px;color:var(--px-sub);display:flex;gap:11px;flex-wrap:wrap;margin-top:5px}',
    '.px-lib-act{display:flex;gap:7px;flex-wrap:wrap}',
    '.px-lib-body{margin-top:13px;border-top:1px dashed var(--px-line);padding-top:13px}',
    /* 空态 / 提示 */
    '.px-empty{border:1px dashed var(--px-line);border-radius:13px;padding:26px 16px;text-align:center;color:var(--px-sub);font-size:13px;background:var(--px-soft)}',
    '.px-empty b{display:block;font-size:15px;color:var(--px-ink);margin-bottom:5px}',
    '.px-note{font-size:12px;color:var(--px-sub);line-height:1.8;margin-top:8px}',
    '.px-note code{background:var(--px-soft);border:1px solid var(--px-line);border-radius:5px;padding:1px 5px;font-family:var(--font-mono,monospace)}',
    '.px-warnbox{border-radius:11px;padding:9px 12px;font-size:12.5px;line-height:1.7;margin:10px 0;background:rgba(217,119,6,.08);border:1px solid rgba(217,119,6,.25);color:#92400e}',
    /* 灯箱 */
    '.px-lb{position:fixed;inset:0;background:rgba(8,14,26,.86);display:none;place-items:center;z-index:99999;padding:24px;backdrop-filter:blur(2px)}',
    '.px-lb.on{display:grid}',
    '.px-lb img{max-width:94vw;max-height:86vh;background:#fff;border-radius:10px;box-shadow:0 24px 60px rgba(0,0,0,.45)}',
    '.px-lb-cap{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);color:#e6eefc;font-size:12.5px;background:rgba(13,21,36,.7);padding:5px 13px;border-radius:999px}',
    '.px-lb-x{position:absolute;top:16px;right:18px;width:38px;height:38px;border-radius:50%;border:0;background:rgba(255,255,255,.14);color:#fff;font-size:17px;cursor:pointer}',
    '.px-lb-x:hover{background:rgba(255,255,255,.26)}',
    '.px-lb-nav{position:absolute;top:50%;transform:translateY(-50%);width:44px;height:64px;border:0;border-radius:12px;background:rgba(255,255,255,.12);color:#fff;font-size:28px;line-height:1;cursor:pointer}',
    '.px-lb-nav:hover{background:rgba(255,255,255,.24)}',
    '.px-lb-nav.prev{left:14px}.px-lb-nav.next{right:14px}',
    '@media(max-width:760px){.px-grid{grid-template-columns:1fr 1fr}.px-q{grid-template-columns:1fr}.px-q-img img{max-height:190px}.px-search{width:100%;max-width:none}.px-nav-v{display:none}.px-lib-act{width:100%}}',
    '@media(max-width:460px){.px-grid{grid-template-columns:1fr}}'
  ].join('')

  /* ══════════════════════════════════════════════════════════════════
   * 子页 ①：提取台
   * ══════════════════════════════════════════════════════════════════ */
  let STAGES = ['解析 PDF', '切题', 'AI 识题', '裁图整理']
  function stageOf(pct) {
    if (pct >= 65) return 3
    if (pct >= 15) return 2
    if (pct >= 10) return 1
    return 0
  }
  function stepsHtml(at, done) {
    return '<div class="px-steps">' + STAGES.map(function (s, i) {
      let cls = done ? 'done' : (i < at ? 'done' : (i === at ? 'on' : ''))
      return '<span class="px-step ' + cls + '"><i></i>' + s + '</span>'
    }).join('') + '</div>'
  }

  function mountExtract(el, ctx) {
    let cfg = {
      subject: String(ctx.config('subject') || 'math'),
      imageMode: String(ctx.config('imageMode') || 'auto'),
      preset: String(ctx.config('imagePreset') || 'standard'),
      maxPages: Math.max(1, Math.min(60, parseInt(ctx.config('maxPages'), 10) || MAX_PAGES_DEFAULT)),
      lowConf: Math.max(0.1, Math.min(1, parseFloat(ctx.config('lowConf')) || LOW_CONF_DEFAULT)),
      autoBank: ctx.config('autoBank') !== false
    }
    let state = { cancelled: false, abort: null, result: null, file: null }
    el.innerHTML = '<div class="px-wrap">' + navHtml(T_MAIN)
      + '<div class="px-card">'
      + '<div class="px-h">📄 提取台 <em>PDF → 结构化题卷</em></div>'
      + '<div class="px-sub">PDF 的文字层与页面渲染由站点本地引擎完成（<b>不上传任何服务器</b>）；扫描页会走视觉模型定位。<br>提取结果可一键送入「我的题卷」直接做题。</div>'
      + '<div data-health="1">' + healthHtml(ctx) + '</div>'
      + '<div class="px-drop" data-drop="1"><span class="ico">📥</span><b>点击选择 PDF，或把文件拖到这里</b>'
      + '<small>单次 ≤ 60 页；扫描版会自动切到视觉识别（更慢，也更容易出错）</small>'
      + '<input type="file" accept="application/pdf" data-file="1" hidden></div>'
      /* 【首屏法则】主操作紧跟上传区：390 宽的窄屏上原先把参数摆在前面，
       * 「开始提取」被顶到 968px（844 视口要滚 124px 才看得见）。
       * 参数是有默认值的设置项，让步给主操作；改完参数点按钮仍在同一屏。 */
      + '<div class="px-actions">'
      + '<button class="px-btn primary" data-run="1">开始提取</button>'
      + '<button class="px-btn" data-cancel="1" disabled>取消</button>'
      + '<span class="px-msg" data-msg="1"></span></div>'
      + '<div class="px-bar"><i data-bar="1"></i></div>'
      + '<div data-steps="1">' + stepsHtml(-1, false) + '</div>'
      + '<div class="px-log" data-log="1"></div>'
      + '<details class="px-more"><summary>参数（默认取自设置页，可临时改）</summary><div class="px-grid">'
      + '<label class="px-f">科目<select data-subj="1">' + SUBJ.map(function (s) {
        return '<option value="' + s.k + '"' + (s.k === cfg.subject ? ' selected' : '') + '>' + s.label + '</option>'
      }).join('') + '</select></label>'
      + '<label class="px-f">图片策略<select data-mode="1">'
      + '<option value="auto">自动（带图/低置信/截断）</option><option value="all">全部题都裁图</option><option value="none">不生成图</option></select></label>'
      + '<label class="px-f">图片清晰度<select data-preset="1">'
      + '<option value="compact">精简 900 / 0.72</option><option value="standard">标准 1100 / 0.75</option></select></label>'
      + '<label class="px-f">最大页数<input type="number" min="1" max="60" data-max="1" value="' + cfg.maxPages + '"></label>'
      + '<label class="px-f">卷名<input type="text" data-title="1" placeholder="留空取文件名"></label>'
      + '<label class="px-f">低置信阈值<input type="number" min="0.1" max="1" step="0.05" data-low="1" value="' + cfg.lowConf + '"></label>'
      + '<label class="px-f">完成后<select data-autobank="1"><option value="1">自动存入卷库</option><option value="0">只留在本页</option></select></label>'
      + '</div></details>'
      + '</div>'
      + '<div class="px-card" data-result="1" style="display:none">'
      + '<div class="px-h" data-rtitle="1">✅ 提取完成</div>'
      + '<div class="px-chips" data-chips="1"></div>'
      + '<div class="px-actions" style="margin-bottom:13px">'
      + '<button class="px-btn primary" data-import="1">送入「我的题卷」去做题</button>'
      + '<button class="px-btn" data-dl="1">下载 exam.json</button>'
      + '<button class="px-btn" data-copyall="1">复制 JSON</button>'
      + '<button class="px-btn" data-openlib="1">在卷库里看</button>'
      + '</div><div data-warns="1"></div>'
      + '<div data-view="1"></div></div>'
      + lbHtml() + '</div>'

    let $ = function (sel) { return el.querySelector(sel) }
    let logEl = $('[data-log]'), barEl = $('[data-bar]'), msgEl = $('[data-msg]')
    bindLb(el)
    let view = mountQView($('[data-view]'), ctx)

    $('[data-subj]').value = cfg.subject
    $('[data-mode]').value = cfg.imageMode
    $('[data-preset]').value = cfg.preset
    $('[data-autobank]').value = cfg.autoBank ? '1' : '0'

    function log(s) {
      let t = new Date().toTimeString().slice(0, 8)
      logEl.textContent += (logEl.textContent ? '\n' : '') + '[' + t + '] ' + s
      logEl.scrollTop = logEl.scrollHeight
    }
    function progress(pct, msg) {
      let p = clamp(pct, 0, 100)
      /* 进度条只在真开始之后出现：0% 的空条在浅色/夜间主题下都像一条多余的分割线 */
      let barBox = barEl.parentNode
      if (barBox && barBox.classList) barBox.classList.toggle('on', msg ? true : p > 0)
      barEl.style.width = p + '%'
      msgEl.textContent = msg || ''
      $('[data-steps]').innerHTML = stepsHtml(stageOf(p), p >= 100)
      if (msg) log(msg)
    }

    /* 文件选择 + 拖拽 */
    let drop = $('[data-drop]'), fileInput = $('[data-file]')
    drop.onclick = function () { fileInput.click() }
    drop.ondragover = function (e) { e.preventDefault(); drop.classList.add('over') }
    drop.ondragleave = function () { drop.classList.remove('over') }
    drop.ondrop = function (e) {
      e.preventDefault(); drop.classList.remove('over')
      let f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]
      if (!f) return
      if (!/\.pdf$/i.test(f.name)) { ctx.Toast.show('请选择 PDF 文件', 'warn', 2200); return }
      takeFile(f)
    }
    fileInput.onchange = function () {
      let f = fileInput.files && fileInput.files[0]
      if (f) takeFile(f)
    }
    function takeFile(f) {
      state.file = f
      drop.classList.add('has')
      drop.querySelector('.ico').textContent = '📄'
      drop.querySelector('b').textContent = f.name
      drop.querySelector('small').textContent = (f.size / 1048576).toFixed(2) + ' MB　·　点此可重新选择'
      if (!$('[data-title]').value) $('[data-title]').value = f.name.replace(/\.pdf$/i, '')
      log('已选择：' + f.name + '（' + (f.size / 1048576).toFixed(2) + ' MB）')
    }

    $('[data-cancel]').onclick = function () {
      state.cancelled = true
      try { if (state.abort) state.abort.abort() } catch (e) { }
      log('正在取消…（已完成的题会保留在结果里）')
    }
    $('[data-openlib]').onclick = function () { ctx.api.goTool(T_LIB) }
    $('[data-import]').onclick = function () {
      if (!state.result) return
      importToPapers(ctx, state.result, true)
    }
    $('[data-dl]').onclick = function () {
      if (!state.result) return
      ctx.api.download(safeName(state.result) + '.json', JSON.stringify(state.result, null, 2), 'application/json')
    }
    $('[data-copyall]').onclick = function () {
      if (!state.result) return
      copyText(ctx, JSON.stringify(state.result, null, 2), 'JSON 已复制')
    }

    function safeName(exam) {
      return String(exam.title || 'exam').replace(/[\\/:*?"<>|]/g, '_').slice(0, 60)
    }

    $('[data-run]').onclick = async function () {
      if (!state.file) { ctx.Toast.show('请先选择 PDF', 'warn', 2000); return }
      if (!ctx.AI || !ctx.AI.configured()) { ctx.Toast.show('请先在设置里配置 AI 接口', 'warn', 2600); return }
      if (!window.PdfKit || typeof window.PdfKit.open !== 'function') {
        ctx.Toast.show('PDF 引擎未就绪（缺少 window.PdfKit）', 'warn', 3200)
        return
      }
      state.cancelled = false
      state.result = null
      state.abort = typeof AbortController !== 'undefined' ? new AbortController() : null
      let runBtn = $('[data-run]')
      runBtn.disabled = true; $('[data-cancel]').disabled = false
      $('[data-result]').style.display = 'none'
      $('[data-warns]').innerHTML = ''
      logEl.textContent = ''
      let t0 = Date.now()
      try {
        let buf = await state.file.arrayBuffer()
        let doc = await openPdf(buf)
        let preset = $('[data-preset]').value
        let opts = {
          ctx: ctx, signal: state.abort ? state.abort.signal : null,
          subject: $('[data-subj]').value,
          title: ($('[data-title]').value || '').trim() || state.file.name.replace(/\.pdf$/i, ''),
          imageMode: $('[data-mode]').value,
          lowConf: num($('[data-low]').value, LOW_CONF_DEFAULT),
          maxPages: parseInt($('[data-max]').value, 10) || MAX_PAGES_DEFAULT,
          preset: preset
        }
        let exam = await runPipeline(doc, opts, progress, state)
        /* 提取完立刻释放 pdfjs 文档：整卷几页的高清 canvas 很占内存，
         * 不销毁在手机上连续提两卷就容易被系统回收标签页。失败也不影响结果。 */
        try { if (doc && typeof doc.destroy === 'function') await doc.destroy() } catch (e) { }
        exam.meta.elapsedSec = Math.round((Date.now() - t0) / 100) / 10
        state.result = exam
        renderResult(exam)
        progress(100, '完成：' + exam.questions.length + ' 题（图片 ' + exam.meta.images + ' 张）')
        ctx.Toast.show('提取完成：' + exam.questions.length + ' 题', 'success', 2200)
        if ($('[data-autobank]').value === '1') {
          let r = bankSave(ctx, exam)
          log('已存入卷库（保留 ' + r.kept + ' 卷 / 约 ' + fmtSize(r.chars)
            + (r.dropped ? '；' + r.dropped + ' 卷因超出容量未存' : '')
            + (r.trimmed ? '；' + r.trimmed + ' 卷仅保留文字' : '') + '）')
          if (r.trimmed || r.dropped) {
            ctx.Toast.show('卷库空间有限：较早的卷已' + (r.trimmed ? '移除配图' : '') + (r.dropped ? '清理' : '') + '，文字都还在', 'warn', 4000)
          }
        }
      } catch (e) {
        let m = (e && e.message) || String(e)
        log('失败：' + m)
        progress(0, '失败：' + m)
        ctx.Toast.show('提取失败：' + m, 'warn', 4200)
      } finally {
        runBtn.disabled = false; $('[data-cancel]').disabled = true
      }
    }

    function renderResult(exam) {
      let figs = exam.questions.filter(function (q) { return q.diagramImg }).length
      let low = exam.questions.filter(function (q) { return q.lowConfidence }).length
      let noans = exam.questions.filter(function (q) { return q.noAnswer }).length
      $('[data-rtitle]').textContent = '✅ ' + exam.title
      $('[data-chips]').innerHTML =
        '<span class="px-chip"><b>' + exam.questions.length + '</b>题</span>'
        + '<span class="px-chip">带图 <b>' + figs + '</b></span>'
        + '<span class="px-chip">低置信 <b>' + low + '</b></span>'
        + '<span class="px-chip">无答案 <b>' + noans + '</b></span>'
        + '<span class="px-chip">扫描页 <b>' + (exam.meta.scanPages || 0) + '</b></span>'
        + '<span class="px-chip">耗时 <b>' + (exam.meta.elapsedSec || '-') + '</b>s</span>'
        + '<span class="px-chip">体积 <b>' + fmtSize(examChars(exam)) + '</b></span>'
      let warns = []
      if (low) warns.push('有 ' + low + ' 道题被判为低置信（扫描页/题干截断/选项缺失）—— 建议逐题核对，图已经替你裁好了。')
      if (noans) warns.push('有 ' + noans + ' 道题卷面没给答案：做题时判分只能靠 AI 或你自评，不是数据丢失。')
      if (figs) warns.push('带图题已裁成图片附在题后：做题时点图可放大，问教练也会随消息带上这张图。')
      $('[data-warns]').innerHTML = warns.length
        ? '<div class="px-warnbox">' + warns.map(esc).join('<br>') + '</div>' : ''
      $('[data-result]').style.display = ''
      view.set(exam)
      /* 参数块挪到主操作下面之后，结果卡离首屏更远了 —— 提取完成后自己滚过去，
       * 否则用户看着"完成"的 toast 却不知道结果在下面。 */
      try {
        let box = $('[data-result]')
        if (box && box.scrollIntoView) box.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } catch (e) { }
    }

    /* 上次提取：从卷库带出来（不自动载入图片，避免一进页面就吃几十 MB 内存） */
    let bank = bankGet(ctx)
    if (bank.length) {
      $('[data-msg]').innerHTML = '卷库里还有 ' + bank.length + ' 套提取记录 —— <a data-goto="' + T_LIB + '" style="color:var(--px-acc);cursor:pointer">去看看</a>'
    }
    /* 导航绑定放在所有会动态塞进 [data-goto] 的 innerHTML 之后：
     * 顶部三个 tab 是静态的，但上面那句"去看看"是运行时才拼的，
     * 先绑后拼就永远点不动（这是个只看代码看不出来的空点击）。 */
    bindNav(el, ctx, T_MAIN)

    return function destroy() {
      state.cancelled = true
      try { if (state.abort) state.abort.abort() } catch (e) { }
      closeLb()
      LB.root = null
    }
  }

  /* ══════════════════════════════════════════════════════════════════
   * 子页 ②：卷库
   * ══════════════════════════════════════════════════════════════════ */
  function mountLib(el, ctx) {
    let S = { kw: '', sort: 'time', openId: '' }
    el.innerHTML = '<div class="px-wrap">' + navHtml(T_LIB)
      + '<div class="px-card">'
      + '<div class="px-h">🗂 卷库 <em>本机保存 · 最多 8 卷</em></div>'
      + '<div class="px-sub">提取过的卷都在这儿。可以回看题目、导出 JSON、或直接送进「我的题卷」做题。<br>卷库存的是本机数据（随插件数据一起保存/同步），超容量时会优先清理较早卷的配图并如实标注。</div>'
      + '<div class="px-stats" data-stats="1"></div>'
      + '<div class="px-tools">'
      + '<input class="px-search" data-libkw="1" placeholder="搜卷名 / 科目">'
      + '<div class="px-seg" data-sort="1"><button data-s="time" class="on">按时间</button><button data-s="q">按题数</button></div>'
      + '</div><div data-list="1"></div></div>'
      + lbHtml() + '</div>'

    let listEl = el.querySelector('[data-list]')
    bindNav(el, ctx, T_LIB)
    bindLb(el)

    function list() {
      let arr = bankGet(ctx)
      let kw = S.kw.trim().toLowerCase()
      if (kw) arr = arr.filter(function (e) {
        return (String(e.title || '') + ' ' + subjLabel(e.subject)).toLowerCase().indexOf(kw) >= 0
      })
      arr = arr.slice().sort(function (a, b) {
        if (S.sort === 'q') return (b.questions || []).length - (a.questions || []).length
        return String(b.generatedAt || '').localeCompare(String(a.generatedAt || ''))
      })
      return arr
    }

    /* 统计口径是「整个卷库」而不是当前筛选结果 —— 搜索/排序时这几个数字不该跟着变，
     * 否则用户会以为数据丢了。 */
    function statsHtml() {
      let all = bankGet(ctx)
      let qn = 0, fig = 0, chars = 0
      all.forEach(function (e) {
        qn += (e.questions || []).length
        fig += examFigures(e)
        chars += examChars(e)
      })
      return '<div class="px-stat"><b>' + all.length + '</b><span>套卷</span></div>'
        + '<div class="px-stat"><b>' + qn + '</b><span>题目总数</span></div>'
        + '<div class="px-stat"><b>' + fig + '</b><span>配图张数</span></div>'
        + '<div class="px-stat"><b>' + fmtSize(chars) + '</b><span>占用空间</span></div>'
    }

    function paint() {
      let arr = list()
      el.querySelector('[data-stats]').innerHTML = statsHtml()
      if (!arr.length) {
        listEl.innerHTML = '<div class="px-empty"><b>卷库还是空的</b>去「提取台」选一份 PDF，提取完成后会自动存到这儿</div>'
        return
      }
      listEl.innerHTML = arr.map(function (e) {
        let qs = e.questions || []
        let low = qs.filter(function (q) { return q.lowConfidence }).length
        let meta = '<span>' + (qs.length) + ' 题</span>'
          + '<span>' + examFigures(e) + ' 张图</span>'
          + '<span>' + subjLabel(e.subject) + '</span>'
          + '<span>' + fmtWhen(e.generatedAt) + '</span>'
          + (e.meta && e.meta.elapsedSec ? '<span>耗时 ' + e.meta.elapsedSec + 's</span>' : '')
          + (low ? '<span style="color:var(--warn,#d97706)">低置信 ' + low + '</span>' : '')
          + (e.meta && e.meta.imgDropped ? '<span style="color:var(--danger,#dc2626)">配图已清理</span>' : '')
        return '<div class="px-lib" data-id="' + esc(e.id) + '">'
          + '<div class="px-lib-hd"><div style="flex:1;min-width:180px">'
          + '<div class="px-lib-t">' + esc(e.title || '未命名卷') + '</div>'
          + '<div class="px-lib-m">' + meta + '</div></div>'
          + '<div class="px-lib-act">'
          + '<button class="px-btn sm" data-act="view">' + (S.openId === e.id ? '收起' : '查看') + '</button>'
          + '<button class="px-btn sm" data-act="import">送题卷</button>'
          + '<button class="px-btn sm" data-act="dl">导出</button>'
          + '<button class="px-btn sm danger" data-act="del">删除</button>'
          + '</div></div>'
          + (S.openId === e.id ? '<div class="px-lib-body" data-body="1"></div>' : '')
          + '</div>'
      }).join('')
      if (S.openId) {
        let cur = arr.filter(function (e) { return e.id === S.openId })[0]
        let body = listEl.querySelector('.px-lib-body')
        if (cur && body) {
          let v = mountQView(body, ctx)
          v.set(cur)
        }
      }
    }

    el.addEventListener('click', function (e) {
      let t = e.target
      let sBtn = t.closest && t.closest('[data-sort] button')
      if (sBtn) {
        el.querySelectorAll('[data-sort] button').forEach(function (b) { b.classList.remove('on') })
        sBtn.classList.add('on'); S.sort = sBtn.getAttribute('data-s'); paint()
        return
      }
      let act = t.closest && t.closest('[data-act]')
      if (!act) return
      let row = act.closest('.px-lib')
      let id = row && row.getAttribute('data-id')
      let exam = bankGet(ctx).filter(function (x) { return x.id === id })[0]
      if (!exam) return
      let kind = act.getAttribute('data-act')
      if (kind === 'view') {
        S.openId = S.openId === id ? '' : id
        paint()
      } else if (kind === 'import') {
        importToPapers(ctx, exam, false)
      } else if (kind === 'dl') {
        ctx.api.download(String(exam.title || 'exam').replace(/[\\/:*?"<>|]/g, '_').slice(0, 60) + '.json',
          JSON.stringify(exam, null, 2), 'application/json')
      } else if (kind === 'del') {
        ctx.api.confirm('删除这套提取记录？', '<div class="muted-sm">只删卷库里的这份记录，已送进「我的题卷」的卷不受影响。</div>', function () {
          let arr = bankGet(ctx).filter(function (x) { return x.id !== id })
          ctx.data('bank', arr)
          if (S.openId === id) S.openId = ''
          ctx.Toast.show('已删除', 'success', 1500)
          paint()
        }, true)
      }
    })
    /* 卷库自己的搜索框用独立属性：展开某卷回看时里面还有一份题目搜索框（data-kw），
     * 两者共用属性会让"在题目里搜"顺手触发整页重绘 —— 一输入就丢焦点。 */
    el.addEventListener('input', function (e) {
      if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-libkw')) {
        S.kw = e.target.value; paint()
      }
    })

    paint()
    return function destroy() { closeLb(); LB.root = null }
  }

  /* ══════════════════════════════════════════════════════════════════
   * 子页 ③：设置与体检
   * ══════════════════════════════════════════════════════════════════ */
  function mountSetup(el, ctx) {
    let h = healthOf(ctx)
    let bank = bankGet(ctx)
    let noise = String(ctx.config('extraNoise') || '')
    el.innerHTML = '<div class="px-wrap">' + navHtml(T_SETUP)
      + '<div class="px-card">'
      + '<div class="px-h">🩺 引擎体检</div>'
      + '<div class="px-sub">这三项缺一个，对应能力就会降级 —— 界面会一直显示真实状态，不假装能用。</div>'
      + '<div class="px-health">'
      + '<span class="px-hcell ' + (h.pdf ? 'ok' : 'no') + '"><i></i>PdfKit<em>' + (h.pdf ? '就绪' : '缺失 → 无法读 PDF') + '</em></span>'
      + '<span class="px-hcell ' + (h.ai ? 'ok' : 'no') + '"><i></i>AI 接口<em>' + (h.ai ? '已配置' : '未配置 → 无法识别') + '</em></span>'
      + '<span class="px-hcell ' + (h.paper ? 'ok' : 'no') + '"><i></i>题卷入库<em>' + (h.paper ? '就绪' : '缺失 → 只能导出 JSON') + '</em></span>'
      + '</div>'
      + '<div class="px-note">PdfKit 由站点在启动时注入（本地 pdf.js + 自建 worker，<b>零联网</b>）。'
      + 'AI 与视觉能力在「设置 → 云 AI 配置」里填写；扫描版试卷必须用支持读图的模型，否则只能识别文字层。</div>'
      + '</div>'
      + '<div class="px-card">'
      + '<div class="px-h">⚙️ 默认参数</div>'
      + '<div class="px-sub">这里的值会成为「提取台」的默认值（每次仍可在页面上临时改）。</div>'
      + '<div class="px-grid">'
      + '<label class="px-f">默认科目<select data-cfg="subject">' + SUBJ.map(function (s) {
        return '<option value="' + s.k + '"' + (String(ctx.config('subject') || 'math') === s.k ? ' selected' : '') + '>' + s.label + '</option>'
      }).join('') + '</select></label>'
      + '<label class="px-f">图片策略<select data-cfg="imageMode">'
      + '<option value="auto">自动</option><option value="all">全部题</option><option value="none">不生成</option></select></label>'
      + '<label class="px-f">图片清晰度<select data-cfg="imagePreset">'
      + '<option value="compact">精简 900</option><option value="standard">标准 1100</option></select></label>'
      + '<label class="px-f">最大页数<input type="number" min="1" max="60" data-cfg="maxPages" value="' + (parseInt(ctx.config('maxPages'), 10) || MAX_PAGES_DEFAULT) + '"></label>'
      + '<label class="px-f">低置信阈值<input type="number" min="0.1" max="1" step="0.05" data-cfg="lowConf" value="' + (parseFloat(ctx.config('lowConf')) || LOW_CONF_DEFAULT) + '"></label>'
      + '</div>'
      + '<div class="px-actions" style="margin-top:13px"><button class="px-btn primary" data-savecfg="1">保存默认参数</button>'
      + '<span class="px-msg" data-cfgtip="1"></span></div>'
      + '</div>'
      + '<div class="px-card">'
      + '<div class="px-h">🏷 噪声词 <em>可选</em></div>'
      + '<div class="px-sub">每家机构的水印/公众号名都不一样。把你卷面上反复出现的广告词、公众号名、机构名写进来（一行一个），'
      + '切题时会从题干里剔除、整行只剩水印的直接丢弃。<b>写长的正文不会误伤</b>：只有整行基本只剩它才算噪声。</div>'
      + '<textarea class="px-ta" data-noise="1" placeholder="例如：&#10;真橙控制考研&#10;XX 考研咨询&#10;扫码关注">' + esc(noise) + '</textarea>'
      + '<div class="px-actions" style="margin-top:10px"><button class="px-btn" data-savenoise="1">保存噪声词</button>'
      + '<span class="px-msg" data-noisetip="1">当前 ' + extraNoiseCount(noise) + ' 个词</span></div>'
      + '</div>'
      + '<div class="px-card">'
      + '<div class="px-h">🧹 数据</div>'
      + '<div class="px-sub">卷库共 ' + bank.length + ' 套 / 约 ' + fmtSize(bank.reduce(function (a, e) { return a + examChars(e) }, 0)) + '。</div>'
      + '<div class="px-actions">'
      + '<button class="px-btn" data-expall="1">导出全部（单个 JSON）</button>'
      + '<button class="px-btn danger" data-clearbank="1">清空卷库</button>'
      + '</div></div>'
      + '<div class="px-card">'
      + '<details class="px-more" open><summary>使用说明 / 已知限制</summary>'
      + '<div class="px-note" style="margin-top:10px">'
      + '① <b>文字版 PDF</b>：走文字层 + 题号锚点切题，再让 AI 逐组还原成结构化 JSON。又快又准。<br>'
      + '② <b>扫描版 PDF</b>：没有文字层，改为整页图交给视觉模型定位每题框、再裁图。慢，且页面歪斜/双栏会掉精度。<br>'
      + '③ <b>题干截断</b>：题跨页时靠“上一页底部是否贴近正文底边”判断续页，判断不了就按截断标记（低置信）并裁图。<br>'
      + '④ <b>合并与题号</b>：AI 结果按题号与切题块对齐；题号缺失或乱序时按版面顺序重编号（界面不额外标注，因为卷面本来就没有）。<br>'
      + '⑤ <b>零幻觉</b>：卷面没给答案就标「卷面无答案」，绝不用模型自己的知识补一个答案冒充卷面。'
      + '</div></details></div>'
      + '</div>'

    bindNav(el, ctx, T_SETUP)

    let cfgMap = {
      subject: el.querySelector('[data-cfg="subject"]'),
      imageMode: el.querySelector('[data-cfg="imageMode"]'),
      imagePreset: el.querySelector('[data-cfg="imagePreset"]'),
      maxPages: el.querySelector('[data-cfg="maxPages"]'),
      lowConf: el.querySelector('[data-cfg="lowConf"]')
    }
    cfgMap.imageMode.value = String(ctx.config('imageMode') || 'auto')
    cfgMap.imagePreset.value = String(ctx.config('imagePreset') || 'standard')

    el.querySelector('[data-savecfg]').onclick = function () {
      ctx.config('subject', cfgMap.subject.value)
      ctx.config('imageMode', cfgMap.imageMode.value)
      ctx.config('imagePreset', cfgMap.imagePreset.value)
      ctx.config('maxPages', clamp(parseInt(cfgMap.maxPages.value, 10) || MAX_PAGES_DEFAULT, 1, 60))
      ctx.config('lowConf', clamp(num(cfgMap.lowConf.value, LOW_CONF_DEFAULT), 0.1, 1))
      el.querySelector('[data-cfgtip]').textContent = '已保存 ' + new Date().toTimeString().slice(0, 5)
      ctx.Toast.show('默认参数已保存', 'success', 1600)
    }
    el.querySelector('[data-savenoise]').onclick = function () {
      let txt = String(el.querySelector('[data-noise]').value || '')
      ctx.config('extraNoise', txt)
      setExtraNoise(txt.split(/\r?\n/))
      el.querySelector('[data-noisetip]').textContent = '当前 ' + extraNoiseCount(txt) + ' 个词'
      ctx.Toast.show('噪声词已保存（下次提取生效）', 'success', 2200)
    }
    el.querySelector('[data-expall]').onclick = function () {
      let all = bankGet(ctx)
      if (!all.length) { ctx.Toast.show('卷库是空的', 'warn', 1800); return }
      ctx.api.download('paper-extract-bank-' + new Date().toISOString().slice(0, 10) + '.json',
        JSON.stringify({ version: VERSION, exportedAt: new Date().toISOString(), exams: all }, null, 2),
        'application/json')
    }
    el.querySelector('[data-clearbank]').onclick = function () {
      let n = bankGet(ctx).length
      if (!n) { ctx.Toast.show('卷库已经是空的', 'warn', 1600); return }
      ctx.api.confirm('清空卷库？', '<div class="muted-sm">将删除卷库里的 ' + n + ' 套提取记录（' + fmtSize(bank.reduce(function (a, e) { return a + examChars(e) }, 0)) + '）。'
        + '已送进「我的题卷」的卷不受影响。<b>此操作不可撤销</b>，建议先「导出全部」。</div>', function () {
          ctx.data('bank', [])
          ctx.Toast.show('卷库已清空', 'success', 1600)
          mountSetup(el, ctx)
        }, true)
    }
    return function destroy() { }
  }
  function extraNoiseCount(txt) {
    return String(txt || '').split(/\r?\n/).map(function (s) { return s.trim() }).filter(function (s) { return s.length >= 2 }).length
  }

  /* ---------------- 注册 ---------------- */
  /* 三个工具页各自独立注册（而不是一个页里面包 tab）：
   * 工具页 id 就是路由 /tool/<id>，互跳走 ctx.api.goTool —— 浏览器前进/后退、
   * 刷新回原页、从教练/搜索直达「卷库」都能用，不需要插件自己维护一个假 tab 状态。 */
  let api = {
    id: 'paper-extract',
    name: '试卷提取',
    version: VERSION,
    author: 'kaoyan-v2',
    desc: 'PDF → 题号切题 / 按需裁图 / 一键送入题卷；三子页（提取台 / 卷库 / 设置体检），复用站点 PDF 引擎与 AI。',
    tools: [
      { id: T_MAIN, title: '试卷提取', icon: '📄', mount: mountExtract },
      { id: T_LIB, title: '试卷卷库', icon: '🗂', mount: mountLib },
      { id: T_SETUP, title: '试卷提取设置', icon: '🩺', mount: mountSetup }
    ],
    config: [
      { key: 'subject', label: '默认科目', type: 'select', default: 'math', options: ['math', 'major', 'eng', 'pol'] },
      { key: 'imageMode', label: '图片策略', type: 'select', default: 'auto', options: ['auto', 'all', 'none'] },
      { key: 'imagePreset', label: '图片清晰度', type: 'select', default: 'standard', options: ['compact', 'standard'] },
      { key: 'maxPages', label: '最大页数', type: 'number', default: 40 },
      { key: 'lowConf', label: '低置信阈值', type: 'number', default: LOW_CONF_DEFAULT },
      { key: 'autoBank', label: '完成后自动存入卷库', type: 'bool', default: true },
      { key: 'extraNoise', label: '额外噪声词（一行一个）', type: 'text', default: '' }
    ],
    /* 噪声词是"切题时才用到"的全局状态，必须在注册时装载一次：
     * 否则用户保存完配置、刷新页面后，要先去设置页点一下才生效。 */
    init: function (ctx) {
      setExtraNoise(String(ctx.config('extraNoise') || '').split(/\r?\n/))
    },
    css: CSS
  }

  /* 调试钩子（仅站点显式打开时暴露；生产无影响）
   * v1.1 增加了卷库/筛选/入库三块「纯逻辑」——它们没有 DOM 就测不了界面，
   * 但判据本身（体积闸怎么裁、筛选怎么判、入库是否只走 PaperKit）值得单独守门，
   * 所以一并挂出来给单测用。 */
  if (window.__PAPER_EXTRACT_DEBUG__) {
    window.__paperExtractInternals = {
      linesFromItems: linesFromItems,
      contentBounds: contentBounds,
      bodySize: bodySize,
      findAnchors: findAnchors,
      buildTextBlocks: buildTextBlocks,
      isNoise: isNoise,
      stripNoise: stripNoise,
      looksTruncated: looksTruncated,
      normQuestion: normQuestion,
      setExtraNoise: setExtraNoise,
      hitExtraNoise: hitExtraNoise,
      bankGet: bankGet,
      bankSave: bankSave,
      stripImages: stripImages,
      qtPass: qtPass,
      importToPapers: importToPapers,
      BANK_MAX: BANK_MAX,
      BANK_CHAR_BUDGET: BANK_CHAR_BUDGET,
      T_MAIN: T_MAIN,
      T_LIB: T_LIB,
      T_SETUP: T_SETUP
    }
  }

  PluginBus.register(api)
})();
