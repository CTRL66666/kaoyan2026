/* ============================================================
 * scoring-forge.plugin.js — 采分点熔炉（单文件插件）· v1.1
 * ------------------------------------------------------------
 * 一句话：主观题的分数不是"写得多"给的，是"踩到点"给的。
 *   题目 → 拆采分点（AI 或手动）→ 限时书写 → 逐点判定 → 漏点画像 → 按 SRS 复练。
 *
 * 为什么做这件事：
 *   站内「政治背诵」练的是把原文背下来，「题卷/押题」练的是选择题；
 *   而政治/专业课大题真正的失分原因是**结构散、漏点、术语不到位** ——
 *   答得满满一页只得 4/10 分，因为六个采分点只踩到两个。这中间没有任何模块管。
 *
 * ── 背靠站点接口（这是本插件与"自建小应用"的根本区别）────────────
 *   ① `ctx.Mastery.recordAnswer(...)`：每次判定都写站内掌握度热力图，
 *      并在 score<80 且有错因时**自动进错题本**（走 Store.addMistake 的 dedup 契约）——
 *      不在插件里另造一套"掌握度"。
 *   ② `ctx.Spaced.grade() / dueKey()`：复练排期直接用站点的间隔盒算法，
 *      插件只存 box，不自己算日期表（改算法只改站点一处）。
 *   ③ `ctx.Store`：从错题本导入主观题（只读）、把漏点写成明日任务（走既有 tasks 形状）。
 *   ④ `ctx.notify`：今日待复练的推送卡片。
 *   ⑤ `ctx.api.go('mistakes') / goTool`：一键回到错题本 / 我的题卷。
 *   ⑥ `queries`：教练可以查"我的漏点画像"，不用用户复述。
 *
 * ── 数据形状（改字段要写迁移，见 normQuestion/normAttempt）────────
 *   questions: [{id,subject,topic,stem,ref,points:[{id,text,weight,kind}],
 *                src,createdAt,box,due,reps,mistakeId}]
 *   attempts:  [{id,qid,at,ms,hits:[pointId],partial:{pid:ratio},score,note}]
 *
 * ── 三条不做 ─────────────────────────────────────────────────
 *   ① 不替你写答案（那是作弊，也不长本事）——只拆点、只判定。
 *   ② 不在无 AI 时假装能判（降级为"手动逐点自评"，明确标注）。
 *   ③ 不把判定结论写死（AI 初判 + 你必须复核，命中/漏点都能改）。
 *
 * 安装：插件中心 → 市场「采分点熔炉」一键安装。
 * ============================================================ */
;(function () {
  'use strict'

  /* 【2026-10-23】1.2：空库点「开始练」给提示（原先是静默退回）、判定按钮字符 → 线性图标、
   * 小按钮命中区外扩。版本必须往上涨：已安装副本是整份源码存在 localStorage 里的，
   * 不涨版本市场不会提示更新，修了也发不出去。 */
  let VERSION = '1.2'
  let TOOL_ID = 'scoring-forge'

  /* 【2026-10-22 站内适配 · 补注册环节】原先两处业务调用都写死 `ctx: 'plugin.ai'` ——
   * 那是站内给「没自带场景的插件」留的通用兜底条目：只有一条「默认不思考」，
   * 于是「拆采分点」和「逐点判定」在 AI 参数中心里只能共用一个开关，
   * 既调不了「拆点要快、判分要严」，用量也分不清是哪一步在烧 token。
   * 现在各自一条 ctx（≤3 条上限内），体检探活另走伪场景 `probe.connect`。 */
  let AI_CTX_POINTS = 'plugin.scoring-forge.points'
  let AI_CTX_JUDGE = 'plugin.scoring-forge.judge'

  /* ============================================================
   * 0. 小工具
   * ============================================================ */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
  }
  function clamp(n, a, b) {
    n = Number(n)
    if (!isFinite(n)) n = 0
    return n < a ? a : (n > b ? b : n)
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n }
  function uid(p) { return (p || 'sf') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7) }
  function dkey(d) {
    let x = d ? (d instanceof Date ? d : new Date(d)) : new Date()
    return x.getFullYear() + '-' + pad2(x.getMonth() + 1) + '-' + pad2(x.getDate())
  }
  function todayKey() { return dkey(new Date()) }
  function parseDay(k) {
    let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(k || ''))
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null
  }
  function diffDays(a, b) {
    let da = parseDay(a), db = parseDay(b)
    if (!da || !db) return 0
    return Math.round((db.getTime() - da.getTime()) / 86400000)
  }
  function fmtDate(k) {
    let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(k || ''))
    return m ? ((+m[2]) + '月' + (+m[3]) + '日') : String(k || '')
  }
  function fmtDur(ms) {
    let s = Math.max(0, Math.round((Number(ms) || 0) / 1000))
    return Math.floor(s / 60) + ':' + pad2(s % 60)
  }
  function shortTitle(s, n) {
    s = String(s || '').replace(/\s+/g, ' ').trim()
    n = n || 16
    return s.length > n ? s.slice(0, n) + '…' : s
  }

  /* ============================================================
   * 1. 采分点模型（纯函数）
   * ------------------------------------------------------------
   * 为什么要有 kind（采分点类型）：分数丢在"哪一类点"上，比丢在"哪道题"上更有指导性。
   * 六类覆盖了考研主观题的绝大多数给分口径。
   * ============================================================ */
  let KINDS = [
    { k: 'def', t: '定义/概念', tip: '名词是什么、内涵外延' },
    { k: 'cond', t: '条件/前提', tip: '成立需要的条件、适用范围' },
    { k: 'logic', t: '逻辑/推导', tip: '为什么成立、因果链条' },
    { k: 'concl', t: '结论/判断', tip: '最终要落的那句话' },
    { k: 'case', t: '例子/结合材料', tip: '联系材料或具体实例' },
    { k: 'term', t: '术语/规范表述', tip: '必须出现的学科原话' }
  ]
  function kindMeta(k) {
    for (let i = 0; i < KINDS.length; i++) if (KINDS[i].k === k) return KINDS[i]
    return { k: 'term', t: '术语/规范表述', tip: '' }
  }
  function kindColor(k) {
    let m = { def: '#b45309', cond: '#7c3aed', logic: '#2563eb', concl: '#0f766e', case: '#b91c1c', term: '#475569' }
    return m[k] || '#475569'
  }
  /** 手动模式下的粗略归类：按关键词猜（猜错也无所谓，用户可以改） */
  function guessKind(text) {
    let t = String(text || '')
    if (/定义|是指|指的是|所谓|内涵|概念/.test(t)) return 'def'
    if (/条件|前提|前提是|当且仅当|适用|范围|必须/.test(t)) return 'cond'
    if (/因为|由于|所以|因此|从而|推导|证明|决定/.test(t)) return 'logic'
    if (/结论|总之|可见|说明|表明|体现/.test(t)) return 'concl'
    if (/例如|比如|材料|结合|实践|案例/.test(t)) return 'case'
    return 'term'
  }

  /** 权重归一：AI 给的权重可能乱七八糟，统一成整数百分比且合计 100（余数给最后一条） */
  function normalizeWeights(points) {
    let arr = (points || []).slice()
    if (!arr.length) return arr
    let sum = 0
    for (let i = 0; i < arr.length; i++) {
      arr[i].weight = Math.max(1, Math.round(Number(arr[i].weight) || 0))
      sum += arr[i].weight
    }
    if (!sum) {
      let each = Math.floor(100 / arr.length)
      for (let i = 0; i < arr.length; i++) arr[i].weight = each
      arr[arr.length - 1].weight += 100 - each * arr.length
      return arr
    }
    let acc = 0
    for (let i = 0; i < arr.length; i++) {
      let w = Math.round(arr[i].weight / sum * 100)
      if (w < 1) w = 1
      arr[i].weight = w
      acc += w
    }
    /* 抹平四舍五入误差：把差额补给权重最大的那条，避免出现 99/101 */
    let diff = 100 - acc
    if (diff !== 0) {
      let maxI = 0
      for (let i = 1; i < arr.length; i++) if (arr[i].weight > arr[maxI].weight) maxI = i
      arr[maxI].weight = Math.max(1, arr[maxI].weight + diff)
    }
    return arr
  }

  /** 得分：命中=满权重，部分命中=按比例，未命中=0；四舍五入到整分 */
  function scoreAttempt(points, hits, partial) {
    let h = {}
    for (let i = 0; i < (hits || []).length; i++) h[hits[i]] = 1
    let p = partial || {}
    let got = 0, total = 0
    for (let i = 0; i < (points || []).length; i++) {
      let pt = points[i]
      let w = Number(pt.weight) || 0
      total += w
      if (h[pt.id]) got += w
      else if (p[pt.id] > 0) got += w * clamp(p[pt.id], 0, 1)
    }
    if (!total) return 0
    return Math.round(got / total * 100)
  }

  /** 档位文案：给"下一步做什么"，不给空泛评价 */
  function verdictOf(score, missKinds) {
    if (score >= 85) return '点基本踩满了。保持这个结构，考场上照抄这套骨架。'
    if (score >= 70) return '主体踩到了，丢的是边角分。把漏的那几类补上就是满分级。'
    if (score >= 50) return '踩了一半。不是不会，是"想到哪写到哪"——先列点再展开。'
    if (score > 0) return '踩点严重不足。先别看答案，回材料把"给分的那几句"找出来。'
    return '这次没有命中任何采分点。'
  }
  /** 漏点画像：按类型统计漏率（分母=该类型出现次数） */
  function leakProfile(questions, attempts) {
    let stat = {}
    for (let i = 0; i < KINDS.length; i++) stat[KINDS[i].k] = { k: KINDS[i].k, seen: 0, missed: 0 }
    let byQ = {}
    for (let i = 0; i < questions.length; i++) byQ[questions[i].id] = questions[i]
    for (let i = 0; i < attempts.length; i++) {
      let a = attempts[i]
      let q = byQ[a.qid]
      if (!q) continue
      let hit = {}
      for (let j = 0; j < a.hits.length; j++) hit[a.hits[j]] = 1
      for (let j = 0; j < q.points.length; j++) {
        let pt = q.points[j]
        let s = stat[pt.kind] || (stat[pt.kind] = { k: pt.kind, seen: 0, missed: 0 })
        s.seen++
        if (!hit[pt.id]) s.missed++
      }
    }
    let out = []
    for (let k in stat) {
      if (!Object.prototype.hasOwnProperty.call(stat, k)) continue
      let s = stat[k]
      out.push({ k: s.k, label: kindMeta(s.k).t, seen: s.seen, missed: s.missed, rate: s.seen ? Math.round(s.missed / s.seen * 100) : 0 })
    }
    out.sort(function (a, b) { return b.rate - a.rate || b.missed - a.missed })
    return out
  }
  /** 科目命中率 */
  function subjectHitRate(questions, attempts) {
    let byQ = {}
    for (let i = 0; i < questions.length; i++) byQ[questions[i].id] = questions[i]
    let acc = {}
    for (let i = 0; i < attempts.length; i++) {
      let a = attempts[i]
      let q = byQ[a.qid]
      if (!q) continue
      let s = acc[q.subject] || (acc[q.subject] = { n: 0, sum: 0 })
      s.n++
      s.sum += a.score
    }
    let out = []
    for (let k in acc) {
      if (!Object.prototype.hasOwnProperty.call(acc, k)) continue
      out.push({ k: k, label: subjectLabel(k), n: acc[k].n, avg: Math.round(acc[k].sum / acc[k].n) })
    }
    out.sort(function (a, b) { return a.avg - b.avg })
    return out
  }
  /** 连续天数（今天没练从昨天起算） */
  function streakOf(attempts) {
    let days = {}
    for (let i = 0; i < (attempts || []).length; i++) days[dkey(new Date(attempts[i].at))] = 1
    let cur = days[todayKey()] ? todayKey() : (function () {
      let d = new Date(); d.setDate(d.getDate() - 1); return dkey(d)
    })()
    let n = 0
    while (days[cur] && n < 400) {
      n++
      let d = parseDay(cur); d.setDate(d.getDate() - 1); cur = dkey(d)
    }
    return n
  }

  /* 学科字典（唯一来源） */
  let SUBJ_ORDER = ['pol', 'major', 'math', 'eng', 'custom']
  function subjectLabel(k) {
    let m = { pol: '政治', major: '专业课', math: '数学', eng: '英语', custom: '其他' }
    return m[k] || '其他'
  }
  function subjectColor(k) {
    let m = { pol: '#b91c1c', major: '#0f766e', math: '#2563eb', eng: '#7c3aed', custom: '#64748b' }
    return m[k] || '#64748b'
  }

  /* ============================================================
   * 2. 数据层（读写 + 迁移 + 体积闸）
   * ============================================================ */
  let MAX_Q = 300
  let MAX_A = 600

  function normPoint(raw) {
    if (!raw || typeof raw !== 'object') return null
    let text = String(raw.text || '').trim()
    if (!text) return null
    return {
      id: String(raw.id || uid('sp')),
      text: text.slice(0, 200),
      weight: clamp(raw.weight, 1, 100),
      kind: String(raw.kind || guessKind(text))
    }
  }
  function normQuestion(raw) {
    if (!raw || typeof raw !== 'object') return null
    let stem = String(raw.stem || '').trim()
    if (!stem) return null
    let pts = []
    let arr = Array.isArray(raw.points) ? raw.points : []
    for (let i = 0; i < arr.length; i++) {
      let p = normPoint(arr[i])
      if (p) pts.push(p)
    }
    pts = normalizeWeights(pts)
    return {
      id: String(raw.id || uid('sq')),
      subject: String(raw.subject || 'pol'),
      topic: String(raw.topic || '').slice(0, 24),
      stem: stem.slice(0, 2000),
      ref: String(raw.ref || '').slice(0, 4000),
      points: pts,
      src: String(raw.src || 'manual'),
      mistakeId: String(raw.mistakeId || ''),
      createdAt: String(raw.createdAt || todayKey()),
      box: clamp(raw.box, 1, 6),
      due: String(raw.due || todayKey()),
      reps: clamp(raw.reps, 0, 999)
    }
  }
  function normAttempt(raw) {
    if (!raw || typeof raw !== 'object') return null
    if (!raw.qid) return null
    let hits = Array.isArray(raw.hits) ? raw.hits.slice(0, 20).map(function (x) { return String(x) }) : []
    let partial = {}
    if (raw.partial && typeof raw.partial === 'object') {
      for (let k in raw.partial) {
        if (!Object.prototype.hasOwnProperty.call(raw.partial, k)) continue
        let v = clamp(raw.partial[k], 0, 1)
        if (v > 0) partial[String(k)] = v
      }
    }
    return {
      id: String(raw.id || uid('sa')),
      qid: String(raw.qid),
      at: String(raw.at || new Date().toISOString()),
      ms: clamp(raw.ms, 0, 86400000),
      hits: hits,
      partial: partial,
      score: clamp(raw.score, 0, 100),
      note: String(raw.note || '').slice(0, 300)
    }
  }
  function loadQs(ctx) {
    let arr = ctx.data('questions')
    if (!Array.isArray(arr)) return []
    let out = []
    for (let i = 0; i < arr.length; i++) {
      let q = normQuestion(arr[i])
      if (q) out.push(q)
    }
    return out
  }
  function loadAs(ctx) {
    let arr = ctx.data('attempts')
    if (!Array.isArray(arr)) return []
    let out = []
    for (let i = 0; i < arr.length; i++) {
      let a = normAttempt(arr[i])
      if (a) out.push(a)
    }
    return out
  }
  function saveQs(ctx, list) {
    let arr = (list || []).slice()
    if (arr.length > MAX_Q) {
      /* 超上限时按"最久没复练"淘汰，而不是按创建时间 —— 常用的题不该被新题挤掉 */
      arr.sort(function (a, b) {
        let ka = a.due || '9999', kb = b.due || '9999'
        if (ka !== kb) return ka < kb ? -1 : 1
        return (a.createdAt || '') < (b.createdAt || '') ? -1 : 1
      })
      arr = arr.slice(0, MAX_Q)
    }
    ctx.data('questions', arr)
    return arr
  }
  function saveAs(ctx, list) {
    let arr = (list || []).slice(-MAX_A)
    ctx.data('attempts', arr)
    return arr
  }
  function findQ(list, id) {
    for (let i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i]
    return null
  }
  /** 到期判定与复练间隔：**直接用站点的 Spaced 引擎**（不自己造一套 SRS） */
  function isDue(q, today) {
    if (!q) return false
    return !q.due || q.due <= (today || todayKey())
  }
  function dueList(qs, today) {
    return (qs || []).filter(function (q) { return isDue(q, today) })
      .sort(function (a, b) {
        let oa = diffDays(a.due || today, today), ob = diffDays(b.due || today, today)
        if (oa !== ob) return ob - oa
        return (a.box || 1) - (b.box || 1)
      })
  }

  /* ============================================================
   * 3. AI：拆采分点 / 逐点判定（都可降级）
   * ============================================================ */
  function pointsSystem(count, strict) {
    return [
      '你是考研主观题的阅卷组长，任务是把一道题的**采分点**拆出来（不是写答案）。',
      '只输出 JSON，不要解释，不要 markdown 代码块。格式：',
      '{"points":[{"text":"采分点原话（阅卷时看到就给分的那句）","weight":数字,"kind":"def|cond|logic|concl|case|term"}]}',
      '规则：',
      '1) 拆 ' + count + ' 个采分点（可按题目实际增减 1 个），weight 合计约 100。',
      '2) 每个点必须是**可判定的短句**（≤30 字），不能是"论述充分"这种没法判的废话。',
      '3) kind 只能取：def=定义概念 / cond=条件前提 / logic=逻辑推导 / concl=结论判断 / case=结合材料或例子 / term=必须出现的学科术语。',
      '4) 按重要性分配权重：决定性论点 25-35，支撑性论点 15-20，边角 5-10。',
      '5) 难度档：' + strict + '。严格档要把"术语是否规范"单独列成一个点。',
      '6) 全部简体中文。不要复述题干。'
    ].join('\n')
  }
  function pointsUser(stem, ref, subject, count) {
    return '学科：' + subjectLabel(subject)
      + '\n题目：\n' + String(stem || '').slice(0, 1200)
      + (ref ? '\n\n参考答案（只作依据，不要照抄成采分点）：\n' + String(ref || '').slice(0, 2000) : '')
      + '\n\n请拆 ' + count + ' 个采分点。'
  }
  function judgeSystem() {
    return [
      '你是考研主观题的阅卷人。给你题目、采分点清单、学生答案，判断**每个采分点**是否被踩到。',
      '只输出 JSON，不要解释，不要 markdown 代码块。格式：',
      '{"judge":[{"i":0,"ok":true,"ratio":1,"why":"答案里对应哪句"}],"comment":"一句话总评（≤40字）"}',
      '规则：',
      '1) i 是采分点下标（从 0 开始），每个点都要给一条。',
      '2) ok=true 表示明确踩到；只沾边/说了同义但没到位的用 ok=false 且 ratio 给 0.3-0.7；完全没提 ratio=0。',
      '3) 判的是**意思**不是字面：学生用自己的话讲对了也算踩到。',
      '4) 不要因为答案长就给分，也不要因为没写术语就全否（除非该点 kind=term）。',
      '5) 允许不确定：确实读不懂某段就 ok=false、ratio=0、why 写"表述不清，无法判断"。',
      '6) 全部简体中文，why 控制在 20 字内。'
    ].join('\n')
  }
  function judgeUser(stem, points, answer) {
    let lines = ['题目：\n' + String(stem || '').slice(0, 1000), '', '采分点：']
    for (let i = 0; i < points.length; i++) {
      lines.push((i + 1) + ') [' + kindMeta(points[i].kind).t + '] ' + points[i].text)
    }
    lines.push('', '学生答案：\n' + String(answer || '').slice(0, 3000))
    return lines.join('\n')
  }
  function aiOk(ctx) {
    try { return !!(ctx && ctx.ai && ctx.ai.has && ctx.ai.has()) } catch (e) { return false }
  }
  /** 拆点：AI 优先；失败/无 AI → 返回 null，由 UI 引导手动建点（不假装拆出来了） */
  function askPoints(ctx, q, count, strict) {
    if (!aiOk(ctx)) return Promise.resolve(null)
    return ctx.ai.json(pointsSystem(count, strict), pointsUser(q.stem, q.ref, q.subject, count), { ctx: AI_CTX_POINTS })
      .then(function (r) {
        let arr = r && Array.isArray(r.points) ? r.points : []
        let out = []
        for (let i = 0; i < arr.length; i++) {
          let p = normPoint({ text: arr[i] && arr[i].text, weight: arr[i] && arr[i].weight, kind: arr[i] && arr[i].kind })
          if (p) out.push(p)
        }
        return out.length ? normalizeWeights(out) : null
      })['catch'](function () { return null })
  }
  /** 判定：AI 优先；失败 → null（UI 转手动逐点自评） */
  function askJudge(ctx, q, answer) {
    if (!aiOk(ctx)) return Promise.resolve(null)
    return ctx.ai.json(judgeSystem(), judgeUser(q.stem, q.points, answer), { ctx: AI_CTX_JUDGE })
      .then(function (r) {
        if (!r || !Array.isArray(r.judge)) return null
        let hits = [], partial = {}, why = {}
        for (let i = 0; i < r.judge.length; i++) {
          let row = r.judge[i]
          if (!row) continue
          let idx = clamp(row.i, 0, q.points.length - 1)
          let pt = q.points[idx]
          if (!pt) continue
          let ratio = row.ratio == null ? (row.ok ? 1 : 0) : clamp(row.ratio, 0, 1)
          if (ratio >= 0.85) hits.push(pt.id)
          else if (ratio > 0) partial[pt.id] = ratio
          why[pt.id] = String(row.why || '').slice(0, 40)
        }
        return { hits: hits, partial: partial, why: why, comment: String(r.comment || '').slice(0, 200) }
      })['catch'](function () { return null })
  }

  /* ============================================================
   * 4. 站点接口回写（本插件的"背靠"之处，全部容错：宿主没给就静默降级）
   * ------------------------------------------------------------
   * 这几支函数是本插件与站内数据的唯一接口层。原则：
   *   · 能走站点引擎就绝不自己造（掌握度→Mastery，间隔→Spaced，任务→Store.tasks）
   *   · 每一支都 try/catch 包住 —— 插件不能因为宿主改字段就把整个页面弄崩
   *   · 回写结果要**告诉用户**（"已写入错题本"），不做静默副作用
   * ============================================================ */
  function siteMastery(ctx, q, score, misses, answer) {
    let done = { heat: false, mistake: false, mistakeId: '', prevHeat: null }
    try {
      if (!ctx.Mastery || typeof ctx.Mastery.recordAnswer !== 'function') return done
      let toMistake = ctx.config('toMistakes') !== false
      /* 撤销要能撤干净 → 先记下站点侧"改动前"的样子：
       *   错题本按 id 集合做差（recordAnswer 不返回新错题 id，只能自己 diff）；
       *   热力图条目直接快照（不存在就记 null，撤销时删掉）。 */
      let beforeIds = {}
      let st0 = ctx.Store && ctx.Store.get ? ctx.Store.get() : null
      if (st0 && Array.isArray(st0.mistakes)) for (let i = 0; i < st0.mistakes.length; i++) beforeIds[st0.mistakes[i].id] = 1
      let topicId = (q.topic || q.id) + '@sf'
      done.prevHeat = (st0 && st0.heat && st0.heat[topicId]) ? JSON.parse(JSON.stringify(st0.heat[topicId])) : null
      ctx.Mastery.recordAnswer({
        topicId: topicId,
        topicName: q.topic || shortTitle(q.stem, 14),
        subject: q.subject,
        score: score,
        verdict: score >= 80 ? 'pass' : 'weak',
        source: TOOL_ID,
        sourceLabel: '采分点熔炉',
        /* errorType 只在确实丢点时给；给 none 就不会往错题本塞东西 */
        errorType: (toMistake && score < 80) ? '踩点不全' : 'none',
        comment: misses.length ? ('漏 ' + misses.length + ' 个采分点') : '',
        stem: q.stem,
        answer: String(answer || '').slice(0, 2000),
        solution: q.ref || ''
      })
      done.heat = true
      let st1 = ctx.Store && ctx.Store.get ? ctx.Store.get() : null
      if (st1 && Array.isArray(st1.mistakes)) {
        for (let i = 0; i < st1.mistakes.length; i++) {
          let m = st1.mistakes[i]
          if (m && !beforeIds[m.id]) { done.mistake = true; done.mistakeId = String(m.id || ''); break }
        }
      }
      if (!done.mistake) done.mistake = toMistake && score < 80
    } catch (e) { /* 宿主字段变了也不能炸 */ }
    return done
  }
  /** 撤销时把站点侧也恢复：删掉刚录的错题、把热力图条目还原（或删掉） */
  function siteRollback(ctx, q, wb) {
    try {
      let topicId = (q.topic || q.id) + '@sf'
      ctx.Store.update(function (st) {
        if (wb && wb.mistakeId && Array.isArray(st.mistakes)) {
          st.mistakes = st.mistakes.filter(function (m) { return String(m && m.id) !== wb.mistakeId })
        }
        if (st.heat && Object.prototype.hasOwnProperty.call(st.heat, topicId)) {
          if (wb && wb.prevHeat) st.heat[topicId] = wb.prevHeat
          else delete st.heat[topicId]
        }
        if (st.heatHistory && Array.isArray(st.heatHistory[topicId])) {
          st.heatHistory[topicId] = st.heatHistory[topicId].slice(0, -1)
          if (!st.heatHistory[topicId].length) delete st.heatHistory[topicId]
        }
      })
      return true
    } catch (e) { return false }
  }
  /** 复练排期：直接用站点的 Spaced 盒算法（通过升一盒，没通过回 1 盒） */
  function siteSpaced(ctx, q, passed) {
    try {
      if (ctx.Spaced && typeof ctx.Spaced.grade === 'function') {
        let g = ctx.Spaced.grade({ box: q.box || 1 }, passed)
        return { box: clamp(g.box, 1, 6), due: String(g.due || todayKey()) }
      }
    } catch (e) { /* 忽略 */ }
    /* 兜底（站点没给 Spaced 时）：1/2/4/7/15/30 天阶梯，语义与站点一致 */
    let ladder = [1, 2, 4, 7, 15, 30]
    let box = passed ? Math.min(6, (q.box || 1) + 1) : 1
    let d = new Date(); d.setDate(d.getDate() + ladder[box - 1])
    return { box: box, due: dkey(d) }
  }
  /** 把一条漏点写成明日任务（走站点既有 tasks 形状，排程页直接能看到） */
  function addTask(ctx, text, subject) {
    try {
      let s = ctx.Store && ctx.Store.get ? ctx.Store.get() : null
      if (!s) return false
      let subj = (subject === 'math' || subject === 'major' || subject === 'eng' || subject === 'pol') ? subject : 'pol'
      let tomorrow = (function () { let d = new Date(); d.setDate(d.getDate() + 1); return dkey(d) })()
      ctx.Store.update(function (st) {
        st.tasks = st.tasks || []
        st.tasks.push({
          id: uid('t'),
          subject: subj,
          text: String(text || '复练主观题').slice(0, 60),
          done: false,
          minutes: 15,
          deferTo: tomorrow,
          taskKind: 'single',
          forced: false,
          review: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      })
      return true
    } catch (e) { return false }
  }
  /** 从站内错题本导入主观题（只读；找不到就返回空数组，绝不编造） */
  function mistakesAsQuestions(ctx) {
    let out = []
    try {
      let s = ctx.Store && ctx.Store.get ? ctx.Store.get() : null
      let arr = s && Array.isArray(s.mistakes) ? s.mistakes : []
      for (let i = 0; i < arr.length && out.length < 60; i++) {
        let m = arr[i] || {}
        let stem = String(m.stem || m.desc || '').trim()
        if (!stem || stem.length < 12) continue
        /* 只收"看起来像主观题"的：有解析/答案、且题干够长（选择题一般很短） */
        let looksSubjective = String(m.type || '').indexOf('choice') < 0 && (stem.length >= 24 || m.solution)
        if (!looksSubjective) continue
        out.push({
          mistakeId: String(m.id || ''),
          subject: String(m.subject || 'pol'),
          topic: String(m.topicName || '').slice(0, 24),
          stem: stem.slice(0, 1200),
          ref: String(m.solution || m.answer || '').slice(0, 2000),
          date: String(m.date || m.createdAt || '').slice(0, 10)
        })
      }
    } catch (e) { /* 忽略 */ }
    return out
  }

  /* ============================================================
   * 5. 壳：吸顶页眉 + 底部 dock + 舞台
   * ============================================================ */
  let VIEWS = [
    { k: 'forge', t: '熔炉', ic: 'edit' },
    { k: 'library', t: '题库', ic: 'books' },
    { k: 'leak', t: '漏点', ic: 'target' },
    { k: 'curve', t: '曲线', ic: 'trendingUp' },
    { k: 'setup', t: '设置', ic: 'cpGear' }
  ]
  function ringSvg(pct, size, color, label) {
    let s = size || 64
    let r = (s - 10) / 2
    let c = 2 * Math.PI * r
    let p = clamp(pct, 0, 100)
    let dash = (c * p / 100).toFixed(1)
    return '<svg class="sf-ring" viewBox="0 0 ' + s + ' ' + s + '" width="' + s + '" height="' + s + '">'
      + '<circle cx="' + (s / 2) + '" cy="' + (s / 2) + '" r="' + r + '" fill="none" stroke="rgba(20,32,28,.10)" stroke-width="6"/>'
      + '<circle cx="' + (s / 2) + '" cy="' + (s / 2) + '" r="' + r + '" fill="none" stroke="' + (color || 'var(--sf-acc)') + '" stroke-width="6"'
      + ' stroke-linecap="round" stroke-dasharray="' + dash + ' ' + (c - dash).toFixed(1) + '"'
      + ' transform="rotate(-90 ' + (s / 2) + ' ' + (s / 2) + ')" style="transition:stroke-dasharray .7s cubic-bezier(.22,1,.36,1)"/>'
      + (label != null ? '<text x="50%" y="53%" text-anchor="middle" dominant-baseline="middle" class="sf-ring-t">' + esc(label) + '</text>' : '')
      + '</svg>'
  }
  function barsSvg(rows, opts) {
    let o = opts || {}
    let w = o.w || 320, h = o.h || 56
    let n = rows.length || 1
    let step = w / n
    let gap = Math.max(3, step * 0.34)
    let bw = Math.max(2, step - gap)
    let max = 1
    for (let i = 0; i < rows.length; i++) max = Math.max(max, rows[i].n || 0)
    let out = ['<svg class="sf-bars" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none">']
    out.push('<line x1="0" y1="' + (h - 1) + '" x2="' + w + '" y2="' + (h - 1) + '" stroke="rgba(20,32,28,.12)" stroke-width="1"/>')
    for (let i = 0; i < rows.length; i++) {
      let v = rows[i].n || 0
      let bh = Math.max(v ? 4 : 2, (h - 2) * (v / max))
      let x = i * (bw + gap)
      out.push('<rect class="sf-bar-tr" x="' + x.toFixed(1) + '" y="0" width="' + bw.toFixed(1) + '" height="' + (h - 1).toFixed(1) + '" fill="rgba(20,32,28,.05)"><title>' + esc(rows[i].label || '') + '：' + v + '</title></rect>')
      if (v) out.push('<rect class="sf-bar-v" x="' + x.toFixed(1) + '" y="' + (h - bh).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + bh.toFixed(1) + '" fill="' + (rows[i].c || 'var(--sf-acc)') + '"/>')
    }
    out.push('</svg>')
    return out.join('')
  }
  function emptyCard(icon, title, sub, btnLabel, act) {
    return '<div class="sf-empty"><div class="sf-empty-ic">' + icon + '</div>'
      + '<b>' + esc(title) + '</b><span>' + esc(sub) + '</span>'
      + (btnLabel ? '<button class="sf-btn primary" data-act="' + esc(act || '') + '">' + esc(btnLabel) + '</button>' : '')
      + '</div>'
  }
  function icon(ctx, key) {
    try { if (ctx && ctx.U && ctx.U.icon) return ctx.U.icon(key) } catch (e) { /* 忽略 */ }
    return ''
  }
  function toast(ctx, msg, type, ms) {
    try { ctx.Toast.show(msg, type || 'info', ms || 2000) } catch (e) { /* 忽略 */ }
  }
  /* 品牌字形：「点」字的笔画。抽成常量是为了**页眉印章与模块图标共用一份 d**
   * —— 两处各抄一份的话，改一处忘另一处，两枚标就会慢慢画歪。 */
  let MARK_CHAR = 'M14 17h16M22 12v9M15 26c2.4 3 5 4.4 7 4.4s4.6-1.4 7-4.4M13 33h18'
  /* 【2026-10-23 判定按钮去字符】原来三个按钮用字符画 `✓` `~` `✗`：`✓`/`✗` 是装饰符号（U+2713/2717），
   * 字形随系统字体走动 —— 安卓上偏粗、Windows 上偏细、基线还各自不同，三个按钮并排时高矮不齐。
   * 改成三枚同规格线性 SVG（24 格、currentColor、圆头），颜色仍由 `.sf-pmark` 的 CSS 管。
   * 「沾边」在站内图标表里没有对应键（只有 cpCheck/cpCross），所以这组**自带**，
   * 不混用「宿主 SVG + ASCII `~`」那种半吊子写法。 */
  let MARK_PATHS = {
    hit: 'M4.5 12.6l4.8 4.8L19.5 7.2',
    miss: 'M6.6 6.6l10.8 10.8M17.4 6.6L6.6 17.4',
    /* 半满圆：**右半填实**，半径比外圈小 2 格 —— 两个半径贴近时（先前的 7.5 / 8.5）
     * 13px 缩放下填色和外圈会糊成一个黑饼，看不出"一半"。 */
    half: 'M12 5.6a6.4 6.4 0 0 1 0 12.8z'
  }
  function markSvg(mode) {
    let p = MARK_PATHS[mode] || MARK_PATHS.miss
    /* 只有「沾边」画外圈：半满圆要有个容器才读得出"一半"；✓/✗ 加上圈在小尺寸下会糊成一团。 */
    let ring = mode === 'half' ? '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.5"/>' : ''
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ring
      + '<path d="' + p + '" fill="' + (mode === 'half' ? 'currentColor' : 'none') + '" stroke="currentColor"'
      + ' stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  }
  function sealSvg() {
    /* 朱砂印章：方形印面 + 内框 + 中间"点"字，呼应"采分点" */
    return '<svg viewBox="0 0 44 44" aria-hidden="true">'
      + '<rect x="3" y="3" width="38" height="38" rx="7" fill="none" stroke="currentColor" stroke-width="2.2"/>'
      + '<rect x="8.5" y="8.5" width="27" height="27" rx="3" fill="none" stroke="currentColor" stroke-width="1" opacity=".55"/>'
      + '<path d="' + MARK_CHAR + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>'
      + '</svg>'
  }
  /* 模块图标＝页眉同款朱砂印，外面再包一层**朱砂→赭石渐变圆角砖**（白印章）。
   * 为什么砖要自己画：页眉那枚靠 CSS `color:var(--sf-acc)` 取色、没有底色，
   * 而导航栏只吃一段 SVG 串（没有 CSS 可依附），必须把底色与白描边都写进 svg。
   * 44 格与页眉一致 → 字形复用 MARK_CHAR（translate+scale 0.75 收进内边距）；
   * 描边比页眉粗：48→22px 缩放后 2.2 只剩 ~1px，会糊。
   * 渐变 id 带插件前缀（sfMarkG）：多插件同名 id 会让后注册的砖抢走前面的填充。 */
  let MARK_TILE = '<svg viewBox="0 0 44 44" width="1em" height="1em" aria-hidden="true">'
    + '<defs><linearGradient id="sfMarkG" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0" stop-color="#B23A2E"/><stop offset="1" stop-color="#8A5A2B"/></linearGradient></defs>'
    + '<rect width="44" height="44" rx="12" fill="url(#sfMarkG)"/>'
    + '<g transform="translate(5.5 5.5) scale(0.75)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round">'
    + '<rect x="3" y="3" width="38" height="38" rx="7" stroke-width="2.6"/>'
    + '<rect x="8.5" y="8.5" width="27" height="27" rx="3" stroke-width="1.2" opacity=".5"/>'
    + '<path d="' + MARK_CHAR + '" stroke-width="2.6"/>'
    + '</g></svg>'
  function confetti(root) {
    try {
      let box = document.createElement('div')
      box.className = 'sf-confetti'
      let colors = ['#b23a2e', '#b45309', '#2563eb', '#0f766e', '#7c3aed', '#475569']
      let html = ''
      for (let i = 0; i < 24; i++) {
        let a = (i / 24) * Math.PI * 2
        let d = 70 + Math.random() * 140
        html += '<i style="--x:' + (Math.cos(a) * d).toFixed(0) + 'px;--y:' + (Math.sin(a) * d - 28).toFixed(0) + 'px;'
          + '--r:' + Math.round(Math.random() * 460 - 230) + 'deg;--c:' + colors[i % colors.length] + ';'
          + '--d:' + Math.round(Math.random() * 120) + 'ms"></i>'
      }
      box.innerHTML = html
      root.appendChild(box)
      setTimeout(function () { try { box.remove() } catch (e) { /* 忽略 */ } }, 1500)
    } catch (e) { /* 忽略 */ }
  }

  function kpiOf(S, ctx) {
    let today = todayKey()
    let doneToday = 0
    for (let i = 0; i < S.as.length; i++) if (dkey(new Date(S.as[i].at)) === today) doneToday++
    let due = dueList(S.qs, today).length
    let hit = 0
    if (S.as.length) {
      let sum = 0
      for (let i = 0; i < S.as.length; i++) sum += S.as[i].score
      hit = Math.round(sum / S.as.length)
    }
    let goal = clamp(ctx && ctx.config ? ctx.config('dailyGoal') : 2, 1, 20)
    return { today: doneToday, goal: goal, goalMet: doneToday >= goal, due: due, qs: S.qs.length, hit: hit }
  }

  /**
   * 挂载。返回 destroy。
   * S 是唯一状态源：视图只读 S，改状态一律走 act → 落盘 → reload → paint。
   */
  function mountShell(el, ctx) {
    let S = {
      view: 'forge',
      qs: loadQs(ctx),
      as: loadAs(ctx),
      selId: '',
      run: null,
      libQ: '',
      libSubj: 'all',
      leakKind: 'all',
      undo: null
    }
    let saved = String(ctx.data('view') || '')
    for (let i = 0; i < VIEWS.length; i++) if (VIEWS[i].k === saved) S.view = saved

    /* 页面专属样式：挂载注入、销毁移除（宿主 css 字段有 20000 字上限，装不下整页） */
    if (!document.getElementById('sf-extra-style')) {
      let st = document.createElement('style')
      st.id = 'sf-extra-style'
      st.textContent = CSS_EXTRA
      document.head.appendChild(st)
    }

    el.innerHTML = ''
    let root = document.createElement('div')
    root.className = 'sf-root'
    root.innerHTML = ''
      + '<div class="sf-aura" aria-hidden="true"><i></i><i></i></div>'
      + '<header class="sf-top" data-sf="top">'
      + '  <div class="sf-brand"><span class="sf-mark" aria-hidden="true">' + sealSvg() + '</span>'
      + '    <span class="sf-brandtx"><i class="sf-kicker">SCORING · FORGE</i><b>采分点熔炉<em>v' + VERSION + '</em></b></span></div>'
      + '  <div class="sf-kpis" data-sf="kpis"></div>'
      + '  <div class="sf-topacts">'
      + '    <button class="sf-btn primary" data-act="quickstart"><i>' + icon(ctx, 'cpPlay') + '</i><span>开始练</span></button>'
      + '    <button class="sf-icobtn" data-act="goto-setup" title="设置">' + icon(ctx, 'cpGear') + '</button>'
      + '  </div>'
      + '</header>'
      + '<main class="sf-stage" data-sf="stage"></main>'
      + '<nav class="sf-dockwrap"><div class="sf-dock" data-sf="dock">'
      + '  <i class="sf-dock-ind" data-sf="ind"></i>'
      + VIEWS.map(function (v) {
        return '<button class="sf-dock-item" data-view="' + v.k + '">' + icon(ctx, v.ic) + '<em>' + esc(v.t) + '</em>'
          + (v.k === 'forge' ? '<i class="sf-dot" data-sf="dot"></i>' : '') + '</button>'
      }).join('')
      + '</div></nav>'
    el.appendChild(root)

    let topEl = root.querySelector('[data-sf="top"]')
    let kpisEl = root.querySelector('[data-sf="kpis"]')
    let stageEl = root.querySelector('[data-sf="stage"]')
    let dockEl = root.querySelector('[data-sf="dock"]')
    let indEl = root.querySelector('[data-sf="ind"]')
    let dotEl = root.querySelector('[data-sf="dot"]')

    function moveInd() {
      let on = dockEl.querySelector('.sf-dock-item.on')
      if (!on || !indEl) return
      indEl.style.left = on.offsetLeft + 'px'
      indEl.style.width = on.offsetWidth + 'px'
    }
    function syncDock() {
      let items = dockEl.querySelectorAll('.sf-dock-item')
      for (let i = 0; i < items.length; i++) {
        items[i].classList.toggle('on', items[i].getAttribute('data-view') === S.view)
      }
      moveInd()
      if (dotEl) dotEl.classList.toggle('show', kpiOf(S, ctx).due > 0)
    }
    function updateKpis() {
      let k = kpiOf(S, ctx)
      kpisEl.innerHTML = ''
        + '<span class="sf-kpi' + (k.goalMet ? ' ok' : '') + '" title="今天练了几道 / 每日目标"><b>' + k.today + '<em>/' + k.goal + '</em></b><i>今日</i></span>'
        + '<span class="sf-kpi' + (k.due ? ' warn' : '') + '" title="到期待复练的题"><b>' + k.due + '</b><i>待复练</i></span>'
        + '<span class="sf-kpi" title="题库里有多少道主观题"><b>' + k.qs + '</b><i>题</i></span>'
        + '<span class="sf-kpi" title="历史平均得分"><b>' + (k.hit || '—') + '</b><i>均分</i></span>'
    }
    function paint() {
      let html = ''
      if (S.view === 'forge') html = viewForge(ctx, S)
      else if (S.view === 'library') html = viewLibrary(ctx, S)
      else if (S.view === 'leak') html = viewLeak(ctx, S)
      else if (S.view === 'curve') html = viewCurve(ctx, S)
      else html = viewSetup(ctx, S)
      stageEl.innerHTML = html
      bindStage()
      updateKpis()
      syncDock()
    }
    function bindStage() {
      if (S.view === 'forge') bindForge(ctx, S, stageEl, paint)
      else if (S.view === 'library') bindLibrary(ctx, S, stageEl, paint, startRun)
      else if (S.view === 'leak') bindLeak(ctx, S, stageEl, paint)
      else if (S.view === 'curve') bindCurve(ctx, S, stageEl)
      else bindSetup(ctx, S, stageEl, paint, reload)
    }
    function go(k) {
      if (S.view === k) return
      S.view = k
      ctx.data('view', k)
      stopTick()
      paint()
      try { window.scrollTo({ top: 0, behavior: 'smooth' }) } catch (e) { /* 忽略 */ }
    }
    function reload() {
      S.qs = loadQs(ctx)
      S.as = loadAs(ctx)
      paint()
    }

    /* ---- 开始一次练习：选题 → 拆点（已有就跳过）→ 作答 ---- */
    function startRun(q) {
      let target = q
      if (!target) {
        let due = dueList(S.qs, todayKey())
        target = due[0] || S.qs[0] || null
      }
      /* 【2026-10-23 空库点「开始练」】原先是 `S.view='forge'; paint(); return` —— 一声不响。
       * 真机上表现成"点了没反应"（探针也是这么报的）：用户在题库空的时候最想练，
       * 却拿不到任何回执。给一句话告诉他**下一步点哪儿**，别只报"没有题"。 */
      if (!target) {
        S.view = 'forge'; paint()
        toast(ctx, '题库还是空的 —— 先「从错题本导入」或点「+ 新建题」放一道进来', 'warn', 3200)
        return
      }
      S.selId = target.id
      S.run = {
        qid: target.id, phase: 'answer', busy: false,
        startedAt: Date.now(), answer: '', judge: null, comment: '',
        manual: false, saved: false
      }
      if (S.view !== 'forge') { S.view = 'forge'; ctx.data('view', 'forge') }
      paint()
      startTick()
    }
    /** 拆点：AI 或手动（手动=先给 4 个空位模板，用户自己写） */
    function askPointsFor(q) {
      let run = S.run
      if (!run) return
      run.busy = true
      run.phase = 'points'
      paint()
      let count = clamp(ctx.config('pointCount') || 5, 3, 8)
      let strict = String(ctx.config('strict') || '标准')
      askPoints(ctx, q, count, strict).then(function (pts) {
        if (S.run !== run) return
        run.busy = false
        run.phase = 'answer'
        if (!pts) { run.manual = true; toast(ctx, '未配置 AI 或拆点失败 —— 手动写采分点也能练', 'warn', 2600) }
        else {
          /* 拆完就落库：题目一旦有了采分点，下次复练不用再拆一遍 */
          let list = S.qs.map(function (x) { return x.id === q.id ? Object.assign({}, x, { points: pts }) : x })
          S.qs = saveQs(ctx, list)
          toast(ctx, '拆出 ' + pts.length + ' 个采分点', 'success')
        }
        paint()
      })
    }

    function stopTick() { if (tickId) { clearInterval(tickId); tickId = null } }
    let tickId = null
    function startTick() {
      stopTick()
      tickId = setInterval(function () {
        let span = stageEl.querySelector('[data-sf="clock"]')
        if (!span || !S.run || S.run.phase !== 'answer') { stopTick(); return }
        span.textContent = fmtDur(Date.now() - (S.run.startedAt || Date.now()))
      }, 500)
    }

    /* ---- 判定：AI 初判 → 用户复核 → 落盘回写 ---- */
    function judgeRun() {
      let run = S.run
      if (!run || run.busy) return
      let q = findQ(S.qs, run.qid)
      if (!q) return
      let ans = String(run.answer || '').trim()
      if (!ans) { toast(ctx, '先写点东西 —— 哪怕只写要点提纲', 'warn'); return }
      run.busy = true
      run.phase = 'judge'
      paint()
      askJudge(ctx, q, ans).then(function (r) {
        if (S.run !== run) return
        run.busy = false
        run.phase = 'review'
        if (!r) {
          run.manual = true
          run.judge = { hits: [], partial: {}, why: {}, comment: '' }
          toast(ctx, '没能自动判定 —— 逐点自己勾吧', 'warn', 2600)
        } else {
          run.manual = false
          run.judge = r
        }
        paint()
      })
    }
    /** 复核时切换某点状态：命中 ↔ 未命中（三态：中/半/未） */
    function togglePoint(pid, mode) {
      let run = S.run
      if (!run || !run.judge) return
      let hits = run.judge.hits.slice()
      let partial = Object.assign({}, run.judge.partial)
      let i = hits.indexOf(pid)
      if (i >= 0) hits.splice(i, 1)
      if (partial[pid] != null) delete partial[pid]
      if (mode === 'hit') hits.push(pid)
      else if (mode === 'half') partial[pid] = 0.5
      run.judge.hits = hits
      run.judge.partial = partial
      paint()
    }
    /** 收尾落盘：算分 → 写站点掌握度/错题本 → Spaced 排下一次 → 存 attempt */
    function finishRun() {
      let run = S.run
      if (!run) return
      let q = findQ(S.qs, run.qid)
      if (!q) { S.run = null; paint(); return }
      let hits = (run.judge && run.judge.hits) || []
      let partial = (run.judge && run.judge.partial) || {}
      let score = scoreAttempt(q.points, hits, partial)
      let missIds = []
      let hitMap = {}
      for (let i = 0; i < hits.length; i++) hitMap[hits[i]] = 1
      for (let i = 0; i < q.points.length; i++) if (!hitMap[q.points[i].id]) missIds.push(q.points[i].id)

      let passed = score >= 80
      let sp = siteSpaced(ctx, q, passed)
      let wb = siteMastery(ctx, q, score, missIds, run.answer)

      let before = Object.assign({}, q, { points: q.points.slice() })
      let list = S.qs.map(function (x) {
        if (x.id !== q.id) return x
        return Object.assign({}, x, { box: sp.box, due: sp.due, reps: (x.reps || 0) + 1 })
      })
      S.qs = saveQs(ctx, list)
      let at = normAttempt({
        id: uid('sa'), qid: q.id, at: new Date().toISOString(),
        ms: Date.now() - (run.startedAt || Date.now()),
        hits: hits, partial: partial, score: score,
        note: (run.judge && run.judge.comment) || ''
      })
      if (at) S.as = saveAs(ctx, S.as.concat([at]))
      S.undo = { question: before, attemptId: at ? at.id : '', qid: q.id, wb: wb }
      run.phase = 'done'
      run.score = score
      run.misses = missIds
      run.box = sp.box
      run.due = sp.due
      run.wb = wb
      stopTick()
      paint()
      if (score >= 85) confetti(root)
      toast(ctx, '已记录 ' + score + ' 分' + (wb.mistake ? ' · 已进错题本' : ''), 'success', 2600)
    }
    function undoRun() {
      let u = S.undo
      if (!u) return
      S.qs = saveQs(ctx, S.qs.map(function (x) { return x.id === u.question.id ? u.question : x }))
      if (u.attemptId) S.as = saveAs(ctx, S.as.filter(function (x) { return x.id !== u.attemptId }))
      let rolled = siteRollback(ctx, u.question, u.wb)
      S.undo = null
      S.run = null
      paint()
      toast(ctx, rolled ? '已撤销：本地记录 + 站内掌握度/错题本一起回滚' : '已撤销本地记录（站内数据未回滚）', 'info', 2600)
    }

    /* ---- 事件委托 ---- */
    function onClick(ev) {
      let t = ev.target
      let dockBtn = t.closest ? t.closest('.sf-dock-item') : null
      if (dockBtn) { go(dockBtn.getAttribute('data-view')); return }
      let btn = t.closest ? t.closest('[data-act]') : null
      if (!btn) return
      let act = btn.getAttribute('data-act')
      let id = btn.getAttribute('data-id') || ''
      if (act === 'quickstart') { startRun(findQ(S.qs, S.selId) || null); return }
      if (act === 'goto-setup') { go('setup'); return }
      if (act === 'start') { startRun(findQ(S.qs, id) || null); return }
      if (act === 'pick') { S.selId = id; S.run = null; paint(); return }
      if (act === 'ask-points') { let q = findQ(S.qs, id || (S.run && S.run.qid)); if (q) askPointsFor(q); return }
      if (act === 'submit') {
        let ta = stageEl.querySelector('[data-sf="answer"]')
        if (S.run && ta) S.run.answer = ta.value
        judgeRun()
        return
      }
      if (act === 'mark') { togglePoint(id, btn.getAttribute('data-mode') || 'hit'); return }
      if (act === 'finish') { finishRun(); return }
      if (act === 'abort') { S.run = null; stopTick(); paint(); return }
      if (act === 'restart') { S.run = null; paint(); return }
      if (act === 'undo-run') { undoRun(); return }
      if (act === 'newq') { openNewQuestion(ctx, reload); return }
      if (act === 'editq') { openEditQuestion(ctx, findQ(S.qs, id), reload); return }
      if (act === 'edit-points') { openPointsEditor(ctx, findQ(S.qs, id || (S.run && S.run.qid)), reload); return }
      if (act === 'delq') {
        let q = findQ(S.qs, id)
        if (!q) return
        ctx.api.confirm('删除这道题？', '<div class="muted-sm">「' + esc(shortTitle(q.stem, 30)) + '」以及它的采分点、练习记录都会删除。</div>', function () {
          S.qs = saveQs(ctx, S.qs.filter(function (x) { return x.id !== id }))
          S.as = saveAs(ctx, S.as.filter(function (x) { return x.qid !== id }))
          if (S.run && S.run.qid === id) S.run = null
          paint()
          toast(ctx, '已删除', 'info')
        }, true)
        return
      }
      if (act === 'import-mistakes') { importMistakes(ctx, reload); return }
      if (act === 'to-task') { makeTask(ctx, findQ(S.qs, id), S); return }
      if (act === 'goto-mistakes') { try { ctx.api.go('mistakes') } catch (e) { toast(ctx, '跳转失败', 'warn') } return }
      if (act === 'lib-subj') { S.libSubj = btn.getAttribute('data-k') || 'all'; paint(); return }
      if (act === 'leak-kind') { S.leakKind = btn.getAttribute('data-k') || 'all'; paint(); return }
      if (act === 'exp-json') { exportJson(ctx, S); return }
      if (act === 'exp-md') { exportMarkdown(ctx, S); return }
      if (act === 'imp-json') { importJson(ctx, reload); return }
      if (act === 'wipe') {
        ctx.api.confirm('清空全部数据？', '<div class="muted-sm">题库、采分点、练习记录全部删除。<b>不可撤销</b>，建议先导出 JSON。站内掌握度与错题本不受影响。</div>', function () {
          ctx.data('questions', [])
          ctx.data('attempts', [])
          S.qs = []
          S.as = []
          S.run = null
          paint()
          toast(ctx, '已清空', 'info')
        }, true)
        return
      }
      if (act === 'ai-test') { aiSelfTest(ctx); return }
      if (act === 'notify-due') {
        let n = dueList(S.qs, todayKey()).length
        try {
          ctx.notify({
            title: n ? ('今天有 ' + n + ' 道题该复练') : '今天没有到期的复练',
            body: n ? '按遗忘曲线排的，逾期越久越该先练。' : '想加练就从题库里挑一道。',
            level: n ? 'warn' : 'info'
          })
        } catch (e) { toast(ctx, '通知发送失败', 'warn') }
        return
      }
    }

    let raf = 0
    function onScroll() {
      if (raf) return
      raf = requestAnimationFrame(function () {
        raf = 0
        if (!topEl) return
        topEl.classList.toggle('is-stuck', topEl.getBoundingClientRect().top <= 1)
      })
    }
    function onKey(ev) {
      let t = ev.target
      let typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
      if (typing) {
        if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey) && S.run && S.run.phase === 'answer') {
          ev.preventDefault()
          let ta = stageEl.querySelector('[data-sf="answer"]')
          if (ta) S.run.answer = ta.value
          judgeRun()
        }
        return
      }
      if (ev.metaKey || ev.ctrlKey || ev.altKey) return
      if (ev.key >= '1' && ev.key <= '5') {
        let idx = Number(ev.key) - 1
        if (VIEWS[idx]) { ev.preventDefault(); go(VIEWS[idx].k) }
        return
      }
      if (ev.key === 'n' || ev.key === 'N') { ev.preventDefault(); openNewQuestion(ctx, reload); return }
      if (ev.key === 'Escape' && S.run && S.run.phase !== 'done') { S.run = null; stopTick(); paint() }
    }

    root.addEventListener('click', onClick)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', moveInd)
    onScroll()
    paint()
    if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
      document.fonts.ready.then(function () { try { moveInd() } catch (e) { /* 忽略 */ } })
    }
    if (S.run && S.run.phase === 'answer') startTick()

    return function destroy() {
      root.removeEventListener('click', onClick)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', moveInd)
      stopTick()
      if (raf) { cancelAnimationFrame(raf); raf = 0 }
      try {
        let st = document.getElementById('sf-extra-style')
        if (st && st.parentNode) st.parentNode.removeChild(st)
      } catch (e) { /* 忽略 */ }
    }
  }

  /* ============================================================
   * 6. 视图一：熔炉（训练台）
   * ------------------------------------------------------------
   * 状态机：answer（书写）→ judge（判定中）→ review（逐点复核）→ done（结果）
   * ★ 关键设计：**作答阶段绝不显示采分点** —— 那是答案。只显示"这题有几个点、共多少分"。
   *   一显示就等于把答案给了，练的是抄写不是回忆。
   * ============================================================ */
  function viewForge(ctx, S) {
    if (S.run) return runHtml(ctx, S)
    return forgeIdleHtml(ctx, S)
  }

  function forgeIdleHtml(ctx, S) {
    let today = todayKey()
    let due = dueList(S.qs, today)
    let out = []
    let k = kpiOf(S, ctx)

    /* 今日目标条 */
    out.push('<div class="sf-goalline' + (k.goalMet ? ' ok' : '') + '"><b>今日 ' + k.today + ' / ' + k.goal + '</b>'
      + '<span>' + (k.goalMet ? '目标达成 —— 再练是加练，注意别把时间全压在主观题上。' : '再练 ' + (k.goal - k.today) + ' 道就达标。') + '</span>'
      + '<i class="sf-goalbar"><b style="width:' + Math.min(100, Math.round(k.today / k.goal * 100)) + '%"></b></i></div>')

    out.push('<section class="sf-card">')
    out.push('<div class="sf-card-h"><b>待复练</b><em>' + (due.length ? due.length + ' 道到期' : '清空了') + '</em>'
      + '<button class="sf-btn ghost sm" data-act="newq">+ 新建题</button></div>')
    if (!S.qs.length) {
      out.push(emptyCard(icon(ctx, 'edit'), '还没有主观题',
        '主观题的分不是"写得多"给的，是"踩到点"给的。先放一道进来 —— 从错题本导入最快，也可以手动新建。',
        '从错题本导入', 'import-mistakes'))
      out.push('<div class="sf-acts"><button class="sf-btn" data-act="newq">手动新建一道</button></div>')
    } else if (!due.length) {
      out.push('<div class="sf-quiet">今天没有到期的题。按遗忘曲线，它们会在该复练的那天回来 —— 想加练就去「题库」挑。</div>')
    } else {
      out.push('<div class="sf-qlist">')
      for (let i = 0; i < Math.min(4, due.length); i++) {
        let q = due[i]
        let od = diffDays(q.due || today, today)
        out.push('<div class="sf-qrow">'
          + '<span class="sf-qdot" style="background:' + subjectColor(q.subject) + '"></span>'
          + '<div class="sf-qmain"><b>' + esc(shortTitle(q.stem, 30)) + '</b>'
          + '<span>' + esc(subjectLabel(q.subject)) + (q.topic ? ' · ' + esc(q.topic) : '')
          + ' · ' + q.points.length + ' 个点 · 第 ' + (q.box || 1) + ' 盒</span></div>'
          + (od > 0 ? '<span class="sf-od">逾期 ' + od + ' 天</span>' : '<span class="sf-od ok">今天</span>')
          + '<button class="sf-btn primary sm" data-act="start" data-id="' + esc(q.id) + '">练</button>'
          + '</div>')
      }
      out.push('</div>')
      if (due.length > 4) out.push('<div class="sf-more">还有 ' + (due.length - 4) + ' 道，去「题库」按序练。</div>')
    }
    out.push('</section>')

    /* 怎么用（只在没练过时出现，不占老用户的地方） */
    if (!S.as.length) {
      out.push('<section class="sf-card"><div class="sf-card-h"><b>怎么用</b><em>三步</em></div>')
      out.push('<ol class="sf-steps">'
        + '<li><b>拆点</b><span>AI 把这道题的给分点拆出来（没有 AI 就自己写，一行一个）。</span></li>'
        + '<li><b>限时写</b><span>对着题干写，写完逐点复核：踩到 / 半踩 / 没踩。</span></li>'
        + '<li><b>看漏点</b><span>分数不是重点，"你总漏哪一类点"才是 —— 漏点页会统计出来。</span></li>'
        + '</ol></section>')
    }
    return out.join('')
  }

  function runHtml(ctx, S) {
    let run = S.run
    let q = findQ(S.qs, run.qid)
    if (!q) { S.run = null; return forgeIdleHtml(ctx, S) }
    let out = ['<section class="sf-card">']
    out.push('<div class="sf-card-h"><b>' + esc(shortTitle(q.stem, 26)) + '</b>'
      + '<em>' + esc(subjectLabel(q.subject)) + (q.topic ? ' · ' + esc(q.topic) : '') + '</em>'
      + '<button class="sf-btn ghost sm" data-act="abort">退出</button></div>')

    if (run.phase === 'points') {
      out.push('<div class="sf-asking"><span class="sf-spin"></span>正在拆采分点…<i>按阅卷口径拆，不写答案</i></div>')
      out.push('<div class="sf-skl"><i></i><i></i><i></i></div></section>')
      return out.join('')
    }

    /* 没有采分点 → 先拆点（这是唯一会"看到答案"的时刻，所以放在作答之前） */
    if (!q.points.length) {
      out.push('<div class="sf-q"><b>' + esc(q.stem) + '</b></div>')
      out.push('<div class="sf-quiet">这道题还没有采分点。可以先让 AI 拆，也可以自己写 —— 自己写的往往更贴合你的教材口径。</div>')
      out.push('<div class="sf-acts">'
        + '<button class="sf-btn primary" data-act="ask-points" data-id="' + esc(q.id) + '">AI 拆采分点</button>'
        + '<button class="sf-btn" data-act="edit-points" data-id="' + esc(q.id) + '">自己写采分点</button>'
        + '</div></section>')
      return out.join('')
    }

    if (run.phase === 'answer') {
      out.push('<div class="sf-prog"><span>作答中</span><span class="sf-clock" data-sf="clock">' + fmtDur(Date.now() - (run.startedAt || Date.now())) + '</span></div>')
      out.push('<div class="sf-q"><b>' + esc(q.stem) + '</b>'
        + '<span class="sf-qwhy">这题共 ' + q.points.length + ' 个采分点、合计 100 分。写完再逐点核对。</span></div>')
      out.push('<textarea class="sf-ta" data-sf="answer" rows="10" placeholder="按点写：先列骨架（①②③），再每点补一句术语或材料。Ctrl/⌘+Enter 提交判定。">' + esc(run.answer || '') + '</textarea>')
      out.push('<div class="sf-acts"><button class="sf-btn primary" data-act="submit">提交判定</button>'
        + '<button class="sf-btn ghost" data-act="abort">放弃这次</button>'
        + '<span class="sf-hint">' + (aiOk(ctx) ? 'AI 先判，你再复核' : '未配置 AI：提交后逐点自己勾') + '</span></div></section>')
      return out.join('')
    }

    if (run.phase === 'judge') {
      out.push('<div class="sf-asking"><span class="sf-spin"></span>正在逐点判定…<i>看的是"意思到没到"，不是字面</i></div>')
      out.push('<div class="sf-skl"><i></i><i></i><i></i></div></section>')
      return out.join('')
    }

    if (run.phase === 'review') {
      let j = run.judge || { hits: [], partial: {}, why: {} }
      let hits = {}
      for (let i = 0; i < j.hits.length; i++) hits[j.hits[i]] = 1
      let score = scoreAttempt(q.points, j.hits, j.partial)
      out.push('<div class="sf-prog"><span>' + (run.manual ? '逐点自评' : 'AI 初判 · 请复核') + '</span>'
        + '<span class="sf-score">当前 ' + score + ' 分</span></div>')
      out.push('<div class="sf-ptlist">')
      for (let i = 0; i < q.points.length; i++) {
        let pt = q.points[i]
        let state = hits[pt.id] ? 'hit' : (j.partial[pt.id] > 0 ? 'half' : 'miss')
        let why = (j.why && j.why[pt.id]) || ''
        out.push('<div class="sf-prow' + (state === 'hit' ? ' is-hit' : state === 'half' ? ' is-half' : '') + '">'
          + '<span class="sf-pkind" style="--c:' + kindColor(pt.kind) + '">' + esc(kindMeta(pt.kind).t) + '</span>'
          + '<div class="sf-pmain"><b>' + esc(pt.text) + '</b>'
          + '<span>' + pt.weight + ' 分' + (why ? ' · ' + esc(why) : '') + '</span></div>'
          + '<div class="sf-pmarks">'
          + '<button class="sf-pmark' + (state === 'hit' ? ' on' : '') + '" data-act="mark" data-id="' + esc(pt.id) + '" data-mode="hit" title="踩到" aria-label="踩到">' + markSvg('hit') + '</button>'
          + '<button class="sf-pmark' + (state === 'half' ? ' on' : '') + '" data-act="mark" data-id="' + esc(pt.id) + '" data-mode="half" title="沾边" aria-label="沾边">' + markSvg('half') + '</button>'
          + '<button class="sf-pmark' + (state === 'miss' ? ' on' : '') + '" data-act="mark" data-id="' + esc(pt.id) + '" data-mode="miss" title="没踩" aria-label="没踩">' + markSvg('miss') + '</button>'
          + '</div></div>')
      }
      out.push('</div>')
      if (j.comment) out.push('<div class="sf-comment">' + esc(j.comment) + '</div>')
      out.push('<div class="sf-acts"><button class="sf-btn primary" data-act="finish">确认并记录</button>'
        + '<button class="sf-btn ghost" data-act="abort">不记录，退出</button></div></section>')
      return out.join('')
    }

    /* done：结果 */
    let miss = []
    let hitMap = {}
    for (let i = 0; i < (run.judge ? run.judge.hits : []).length; i++) hitMap[run.judge.hits[i]] = 1
    for (let i = 0; i < q.points.length; i++) if (!hitMap[q.points[i].id]) miss.push(q.points[i])
    out.push('<div class="sf-done">'
      + '<div class="sf-done-ring">' + ringSvg(run.score || 0, 104, run.score >= 80 ? '#0f766e' : '#b23a2e', String(run.score || 0)) + '</div>'
      + '<div class="sf-done-tx"><b>' + esc(verdictOf(run.score || 0)) + '</b>'
      + '<div class="sf-done-meta">'
      + '<span class="sf-pill">下次复练 <b>' + fmtDate(run.due) + '</b>（第 ' + run.box + ' 盒）</span>'
      + '<span class="sf-pill">漏 ' + miss.length + ' / ' + q.points.length + ' 点</span>'
      + (run.wb && run.wb.heat ? '<span class="sf-pill ok">已写入站内掌握度</span>' : '')
      + (run.wb && run.wb.mistake ? '<span class="sf-pill warn">已进错题本</span>' : '')
      + '</div>')
    if (miss.length) {
      out.push('<div class="sf-missbox"><b>这次漏掉的点</b><div>'
        + miss.map(function (m) {
          return '<span class="sf-chip" style="--c:' + kindColor(m.kind) + '">' + esc(shortTitle(m.text, 22)) + '</span>'
        }).join('')
        + '</div></div>')
    }
    out.push('</div></div>')
    out.push('<div class="sf-acts">'
      + '<button class="sf-btn primary" data-act="start" data-id="' + esc(q.id) + '">再练一遍</button>'
      + '<button class="sf-btn" data-act="restart">回到熔炉</button>'
      + '<button class="sf-btn ghost" data-act="to-task" data-id="' + esc(q.id) + '">把漏点写成明日任务</button>'
      + (S.undo && S.undo.qid === q.id ? '<button class="sf-btn ghost danger" data-act="undo-run">撤销这次（含站内回滚）</button>' : '')
      + '</div></section>')
    return out.join('')
  }

  function bindForge(ctx, S, stage, paint) {
    let ta = stage.querySelector('[data-sf="answer"]')
    if (ta) {
      try { ta.focus({ preventScroll: true }) } catch (e) { try { ta.focus() } catch (e2) { /* 忽略 */ } }
      ta.addEventListener('input', function () { if (S.run) S.run.answer = ta.value })
      ta.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) {
          ev.preventDefault()
          let b = stage.querySelector('[data-act="submit"]')
          if (b) b.click()
        }
      })
    }
  }

  /* ---- 弹窗：新建 / 编辑题目 / 写采分点（都走宿主 Modal） ---- */
  function openNewQuestion(ctx, done) {
    let close = ctx.Modal.open({
      title: '新建主观题',
      html: '<div class="sf-form">'
        + '<label>题干<b>*</b><textarea id="sf-nq-stem" class="sf-input" rows="4" placeholder="粘贴题目原文（材料题可只贴设问）"></textarea></label>'
        + '<label>学科<select id="sf-nq-subj" class="sf-input">'
        + SUBJ_ORDER.map(function (k) { return '<option value="' + k + '">' + subjectLabel(k) + '</option>' }).join('')
        + '</select></label>'
        + '<label>考点标签（可选）<input id="sf-nq-topic" class="sf-input" maxlength="24" placeholder="如：马原-矛盾论"></label>'
        + '<label>参考答案（可选，拆点时作依据）<textarea id="sf-nq-ref" class="sf-input" rows="4"></textarea></label>'
        + '</div>',
      actions: [
        { label: '取消' },
        {
          label: '创建', kind: 'btn-primary', onClick: function () {
            let stem = document.getElementById('sf-nq-stem')
            let subj = document.getElementById('sf-nq-subj')
            let topic = document.getElementById('sf-nq-topic')
            let ref = document.getElementById('sf-nq-ref')
            let s = stem ? String(stem.value || '').trim() : ''
            if (!s) { toast(ctx, '题干不能为空', 'warn'); return false }
            let q = normQuestion({
              stem: s, subject: subj ? subj.value : 'pol',
              topic: topic ? topic.value : '', ref: ref ? ref.value : '',
              src: 'manual', createdAt: todayKey(), due: todayKey()
            })
            let list = loadQs(ctx)
            list.push(q)
            saveQs(ctx, list)
            if (close) close()
            if (done) done()
            toast(ctx, '已加入题库', 'success')
            return false
          }
        }
      ]
    })
  }
  function openEditQuestion(ctx, q, done) {
    if (!q) return
    let close = ctx.Modal.open({
      title: '编辑题目',
      html: '<div class="sf-form">'
        + '<label>题干<textarea id="sf-eq-stem" class="sf-input" rows="4">' + esc(q.stem) + '</textarea></label>'
        + '<label>学科<select id="sf-eq-subj" class="sf-input">'
        + SUBJ_ORDER.map(function (k) {
          return '<option value="' + k + '"' + (k === q.subject ? ' selected' : '') + '>' + subjectLabel(k) + '</option>'
        }).join('')
        + '</select></label>'
        + '<label>考点标签<input id="sf-eq-topic" class="sf-input" maxlength="24" value="' + esc(q.topic) + '"></label>'
        + '<label>参考答案<textarea id="sf-eq-ref" class="sf-input" rows="4">' + esc(q.ref) + '</textarea></label>'
        + '</div>',
      actions: [
        { label: '取消' },
        { label: '写/改采分点', onClick: function () { if (close) close(); openPointsEditor(ctx, q, done); return false } },
        {
          label: '保存', kind: 'btn-primary', onClick: function () {
            let stem = document.getElementById('sf-eq-stem')
            let subj = document.getElementById('sf-eq-subj')
            let topic = document.getElementById('sf-eq-topic')
            let ref = document.getElementById('sf-eq-ref')
            let s = stem ? String(stem.value || '').trim() : ''
            if (!s) { toast(ctx, '题干不能为空', 'warn'); return false }
            let list = loadQs(ctx).map(function (x) {
              if (x.id !== q.id) return x
              return Object.assign({}, x, {
                stem: s.slice(0, 2000),
                subject: subj ? subj.value : x.subject,
                topic: topic ? String(topic.value || '').slice(0, 24) : x.topic,
                ref: ref ? String(ref.value || '').slice(0, 4000) : x.ref
              })
            })
            saveQs(ctx, list)
            if (close) close()
            if (done) done()
            toast(ctx, '已保存', 'success')
            return false
          }
        }
      ]
    })
  }
  /** 采分点编辑器：一行一个，支持「文本｜权重｜类型」三段（只有文本也行） */
  function openPointsEditor(ctx, q, done) {
    if (!q) return
    let text = q.points.map(function (p) {
      return p.text + '｜' + p.weight + '｜' + p.kind
    }).join('\n')
    let close = ctx.Modal.open({
      title: '采分点（一行一个）',
      html: '<div class="sf-form">'
        + '<label>格式：<code>文本｜权重｜类型</code>　类型可填 ' + KINDS.map(function (k) { return k.k + '(' + k.t + ')' }).join(' / ')
        + '<textarea id="sf-pe" class="sf-input" rows="9">' + esc(text) + '</textarea></label>'
        + '<div class="sf-quiet">权重不填会自动均分；类型不填按关键词猜。写完可以再回来改。</div>'
        + '</div>',
      actions: [
        { label: '取消' },
        {
          label: '保存', kind: 'btn-primary', onClick: function () {
            let ta = document.getElementById('sf-pe')
            let lines = String(ta ? ta.value : '').split(/\r?\n/)
            let pts = []
            for (let i = 0; i < lines.length; i++) {
              let raw = lines[i].trim()
              if (!raw) continue
              let seg = raw.split(/[|｜]/)
              let t = String(seg[0] || '').trim()
              if (!t) continue
              pts.push(normPoint({
                text: t,
                weight: seg[1] ? Number(String(seg[1]).replace(/[^\d.]/g, '')) : 0,
                kind: seg[2] ? String(seg[2]).trim() : ''
              }))
            }
            if (!pts.length) { toast(ctx, '至少要有一个采分点', 'warn'); return false }
            let list = loadQs(ctx).map(function (x) {
              return x.id === q.id ? Object.assign({}, x, { points: normalizeWeights(pts) }) : x
            })
            saveQs(ctx, list)
            if (close) close()
            if (done) done()
            toast(ctx, '采分点已保存（' + pts.length + ' 个）', 'success')
            return false
          }
        }
      ]
    })
  }

  /* ============================================================
   * 7. 视图二：题库
   * ============================================================ */
  function viewLibrary(ctx, S) {
    let q = String(S.libQ || '').trim().toLowerCase()
    let list = S.qs.slice().sort(function (a, b) {
      let ka = a.due || '9999', kb = b.due || '9999'
      if (ka !== kb) return ka < kb ? -1 : 1
      return (a.box || 1) - (b.box || 1)
    }).filter(function (x) {
      if (S.libSubj !== 'all' && x.subject !== S.libSubj) return false
      if (!q) return true
      let hay = (x.stem + ' ' + x.topic + ' ' + x.ref + ' ' + x.points.map(function (p) { return p.text }).join(' ')).toLowerCase()
      return hay.indexOf(q) >= 0
    })
    let out = []
    out.push('<section class="sf-card">')
    out.push('<div class="sf-card-h"><b>题库</b><em>' + list.length + ' / ' + S.qs.length + '</em>'
      + '<button class="sf-btn ghost sm" data-act="import-mistakes">从错题本导入</button>'
      + '<button class="sf-btn ghost sm" data-act="newq">+ 新建</button></div>')
    out.push('<div class="sf-searchbar">'
      + '<input class="sf-input sf-search" data-sf="libq" placeholder="搜题干 / 考点 / 采分点…" value="' + esc(S.libQ) + '" maxlength="40">'
      + '<div class="sf-subjbar">'
      + '<button class="sf-schip' + (S.libSubj === 'all' ? ' on' : '') + '" data-act="lib-subj" data-k="all">全部</button>'
      + SUBJ_ORDER.map(function (k) {
        return '<button class="sf-schip' + (S.libSubj === k ? ' on' : '') + '" data-act="lib-subj" data-k="' + k + '" style="--c:' + subjectColor(k) + '">' + subjectLabel(k) + '</button>'
      }).join('')
      + '</div></div>')

    if (!list.length) {
      out.push(S.qs.length
        ? '<div class="sf-quiet">没有匹配的题。换个词，或切回「全部」。</div>'
        : emptyCard(icon(ctx, 'books'), '题库是空的', '从错题本导入最快；也可以手动新建一道。', '从错题本导入', 'import-mistakes'))
    } else {
      out.push('<div class="sf-plist">')
      for (let i = 0; i < list.length; i++) {
        let x = list[i]
        let od = diffDays(x.due || todayKey(), todayKey())
        let dueTxt = !x.due ? '未排期' : (od > 0 ? '逾期 ' + od + ' 天' : (od === 0 ? '今天到期' : fmtDate(x.due) + ' 复练'))
        out.push('<div class="sf-prow">'
          + '<span class="sf-qdot" style="background:' + subjectColor(x.subject) + '"></span>'
          + '<button class="sf-pmainbtn" data-act="pick" data-id="' + esc(x.id) + '">'
          + '<b>' + esc(shortTitle(x.stem, 34)) + '</b>'
          + '<span>' + esc(subjectLabel(x.subject)) + (x.topic ? ' · ' + esc(x.topic) : '')
          + ' · ' + x.points.length + ' 个点 · ' + dueTxt + ' · 第 ' + (x.box || 1) + ' 盒</span>'
          + '</button>'
          + '<button class="sf-btn sm" data-act="start" data-id="' + esc(x.id) + '">练</button>'
          + '<button class="sf-icobtn sm" data-act="editq" data-id="' + esc(x.id) + '" title="编辑">' + icon(ctx, 'cpPencil') + '</button>'
          + '<button class="sf-icobtn sm danger" data-act="delq" data-id="' + esc(x.id) + '" title="删除">' + icon(ctx, 'cpTrash') + '</button>'
          + '</div>')
      }
      out.push('</div>')
    }
    out.push('</section>')
    return out.join('')
  }
  function bindLibrary(ctx, S, stage, paint, startRun) {
    let inp = stage.querySelector('[data-sf="libq"]')
    if (!inp) return
    inp.addEventListener('input', function () {
      let v = inp.value
      let pos = inp.selectionStart
      S.libQ = v
      paint()
      let again = stage.querySelector('[data-sf="libq"]')
      if (again) {
        again.focus()
        try { again.setSelectionRange(pos, pos) } catch (e) { /* 忽略 */ }
      }
    })
  }

  /* ============================================================
   * 8. 视图三：漏点画像
   * ------------------------------------------------------------
   * 这一页才是本插件的"结论"：不是"你考了多少分"，而是"你总在哪类点上丢分"。
   * 分母写清楚（该类型出现过几次），避免"漏了 3 次"其实只出现过 3 次这种误读。
   * ============================================================ */
  function viewLeak(ctx, S) {
    let prof = leakProfile(S.qs, S.as)
    let subj = subjectHitRate(S.qs, S.as)
    let out = []
    out.push('<section class="sf-card"><div class="sf-card-h"><b>漏点画像</b><em>' + S.as.length + ' 次练习</em></div>')
    if (!S.as.length) {
      out.push('<div class="sf-quiet">练过一次之后，这里会告诉你"哪一类采分点总漏"—— 那比分数有用得多。</div>')
    } else {
      out.push('<div class="sf-leaklist">')
      for (let i = 0; i < prof.length; i++) {
        let p = prof[i]
        if (!p.seen) continue
        let col = p.rate >= 60 ? '#b91c1c' : p.rate >= 30 ? '#b45309' : '#0f766e'
        out.push('<div class="sf-leakrow">'
          + '<span class="sf-leakname" style="--c:' + kindColor(p.k) + '">' + esc(p.label) + '</span>'
          + '<i class="sf-leakbar"><b style="width:' + p.rate + '%;background:' + col + '"></b></i>'
          + '<em>' + p.rate + '%</em>'
          + '<span class="sf-leakn">漏 ' + p.missed + ' / ' + p.seen + '</span>'
          + '</div>')
      }
      out.push('</div>')
      let worst = null
      for (let i = 0; i < prof.length; i++) if (prof[i].seen >= 2 && prof[i].rate >= 40) { worst = prof[i]; break }
      if (worst) {
        out.push('<div class="sf-tip"><b>最该补：' + esc(worst.label) + '</b>'
          + '<span>' + esc(kindMeta(worst.k).tip) + ' —— 这类点你漏了 ' + worst.missed + ' 次（共出现 ' + worst.seen + ' 次）。</span></div>')
      }
    }
    out.push('</section>')

    /* 科目命中率 */
    out.push('<section class="sf-card"><div class="sf-card-h"><b>分科表现</b><em>按平均分升序</em></div>')
    if (!subj.length) out.push('<div class="sf-quiet">还没有数据。</div>')
    else {
      for (let i = 0; i < subj.length; i++) {
        let s = subj[i]
        let col = s.avg >= 80 ? '#0f766e' : s.avg >= 60 ? '#b45309' : '#b91c1c'
        out.push('<div class="sf-subjrow">'
          + '<span class="sf-subjname" style="--c:' + subjectColor(s.k) + '">' + esc(s.label) + '</span>'
          + '<i class="sf-subdist"><b style="width:' + s.avg + '%;background:' + col + '"></b></i>'
          + '<em>' + s.avg + '</em><span class="sf-subjn">' + s.n + ' 次</span>'
          + '</div>')
      }
    }
    out.push('</section>')

    /* 具体漏得最多的点 */
    let missCount = {}
    let byQ = {}
    for (let i = 0; i < S.qs.length; i++) byQ[S.qs[i].id] = S.qs[i]
    for (let i = 0; i < S.as.length; i++) {
      let a = S.as[i]
      let q = byQ[a.qid]
      if (!q) continue
      let hit = {}
      for (let j = 0; j < a.hits.length; j++) hit[a.hits[j]] = 1
      for (let j = 0; j < q.points.length; j++) {
        let pt = q.points[j]
        if (hit[pt.id]) continue
        let key = pt.text
        if (!missCount[key]) missCount[key] = { text: pt.text, kind: pt.kind, n: 0, qid: q.id, subject: q.subject }
        missCount[key].n++
      }
    }
    let top = []
    for (let k in missCount) if (Object.prototype.hasOwnProperty.call(missCount, k)) top.push(missCount[k])
    top.sort(function (a, b) { return b.n - a.n })
    top = top.slice(0, 8)
    out.push('<section class="sf-card"><div class="sf-card-h"><b>漏得最多的点</b><em>Top ' + top.length + '</em></div>')
    if (!top.length) out.push('<div class="sf-quiet">没有漏点记录 —— 要么没练过，要么全踩到了。</div>')
    else {
      out.push('<div class="sf-thin">')
      for (let i = 0; i < top.length; i++) {
        let t = top[i]
        out.push('<div class="sf-thin-row">'
          + '<span class="sf-thin-n">' + (i + 1) + '</span>'
          + '<div><b>' + esc(shortTitle(t.text, 30)) + '</b>'
          + '<span>' + esc(kindMeta(t.kind).t) + ' · ' + esc(subjectLabel(t.subject)) + '</span></div>'
          + '<em class="sf-thinn">漏 ' + t.n + ' 次</em>'
          + '<button class="sf-btn sm" data-act="to-task" data-id="' + esc(t.qid) + '">写成任务</button>'
          + '</div>')
      }
      out.push('</div>')
    }
    out.push('</section>')
    return out.join('')
  }
  function bindLeak(ctx, S, stage, paint) { /* 全部走委托 */ }

  /* ============================================================
   * 9. 视图四：曲线
   * ============================================================ */
  function viewCurve(ctx, S) {
    let out = []
    let n = S.as.length
    let avg = 0
    for (let i = 0; i < n; i++) avg += S.as[i].score
    avg = n ? Math.round(avg / n) : 0
    let passed = 0
    for (let i = 0; i < n; i++) if (S.as[i].score >= 80) passed++
    let today = todayKey()
    let days = []
    for (let i = 13; i >= 0; i--) {
      let d = new Date(); d.setDate(d.getDate() - i)
      let k = dkey(d)
      let c = 0
      for (let j = 0; j < n; j++) if (dkey(new Date(S.as[j].at)) === k) c++
      days.push({ key: k, n: c, label: fmtDate(k) })
    }
    out.push('<section class="sf-card"><div class="sf-card-h"><b>总览</b><em>' + n + ' 次练习</em>'
      + '<button class="sf-btn ghost sm" data-act="exp-md">导出报告</button></div>')
    out.push('<div class="sf-overview">')
    out.push('<div class="sf-ov-ring">' + ringSvg(avg, 92, avg >= 80 ? '#0f766e' : '#b23a2e', String(avg)) + '<i>平均分</i></div>')
    out.push('<div class="sf-ov-grid">'
      + '<div class="sf-ov-cell"><b>' + passed + '</b><span>达线次数（≥80）</span></div>'
      + '<div class="sf-ov-cell"><b>' + (n ? Math.round(passed / n * 100) : 0) + '%</b><span>达线率</span></div>'
      + '<div class="sf-ov-cell"><b>' + streakOf(S.as) + '</b><span>连续天数</span></div>'
      + '<div class="sf-ov-cell"><b>' + S.qs.length + '</b><span>题库题数</span></div>'
      + '</div></div></section>')

    out.push('<section class="sf-card"><div class="sf-card-h"><b>近 14 天</b><em>每天练了几道</em></div>')
    out.push('<div class="sf-bars-wrap">' + barsSvg(days, { w: 640, h: 72 }) + '</div>')
    out.push('<div class="sf-axis"><span>' + fmtDate(days[0].key) + '</span><span>今天</span></div>')
    out.push('</section>')

    /* 得分趋势：折线（取最近 12 次，x 按序，y 按分） */
    let recent = S.as.slice(-12)
    out.push('<section class="sf-card"><div class="sf-card-h"><b>得分趋势</b><em>最近 ' + recent.length + ' 次</em></div>')
    if (recent.length < 2) out.push('<div class="sf-quiet">至少练两次才画得出趋势。</div>')
    else {
      let w = 640, h = 120
      let pts = []
      for (let i = 0; i < recent.length; i++) {
        let x = (i / (recent.length - 1)) * w
        let y = h - (clamp(recent[i].score, 0, 100) / 100) * (h - 12) - 6
        pts.push(x.toFixed(1) + ',' + y.toFixed(1))
      }
      out.push('<svg class="sf-line" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none">')
      out.push('<line x1="0" y1="' + (h - (80 / 100) * (h - 12) - 6).toFixed(1) + '" x2="' + w + '" y2="' + (h - (80 / 100) * (h - 12) - 6).toFixed(1) + '" stroke="rgba(15,118,110,.35)" stroke-width="1" stroke-dasharray="4 4"/>')
      out.push('<polyline points="' + pts.join(' ') + '" fill="none" stroke="var(--sf-acc)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>')
      for (let i = 0; i < recent.length; i++) {
        let xy = pts[i].split(',')
        out.push('<circle cx="' + xy[0] + '" cy="' + xy[1] + '" r="3" fill="var(--sf-acc)"/>')
      }
      out.push('</svg>')
      out.push('<div class="sf-axis"><span>越右越新 · 虚线 = 80 分达线</span></div>')
    }
    out.push('</section>')
    return out.join('')
  }
  function bindCurve(ctx, S, stage) { /* 委托 */ }

  /* ============================================================
   * 10. 视图五：设置与数据
   * ============================================================ */
  function viewSetup(ctx, S) {
    let ai = aiOk(ctx)
    let out = []
    out.push('<section class="sf-card"><div class="sf-card-h"><b>环境体检</b><em>决定能不能自动拆点/判点</em></div>')
    out.push('<div class="sf-health">'
      + '<span class="sf-hcell ' + (ai ? 'ok' : 'no') + '"><i></i>' + (ai ? 'AI 可用：自动拆采分点 + 逐点判定' : '未配置 AI：手动写点 + 逐点自评') + '</span>'
      + '<span class="sf-hcell ' + (ctx.Mastery ? 'ok' : 'no') + '"><i></i>' + (ctx.Mastery ? '站内掌握度引擎已接入' : '掌握度引擎不可用') + '</span>'
      + '<span class="sf-hcell ' + (ctx.Spaced ? 'ok' : 'no') + '"><i></i>' + (ctx.Spaced ? '复练间隔走站点 Spaced' : '间隔降级为内置阶梯') + '</span>'
      + '</div>')
    out.push('<div class="sf-acts"><button class="sf-btn" data-act="ai-test">测一次 AI</button>'
      + '<button class="sf-btn ghost" data-act="notify-due">推送一条到期提醒</button></div>')
    out.push('</section>')

    out.push('<section class="sf-card"><div class="sf-card-h"><b>当前生效设置</b><em>在插件中心改</em></div>')
    out.push('<div class="sf-cfglist">'
      + cfgRow('采分点数量', String(clamp(ctx.config('pointCount') || 5, 3, 8)) + ' 个', 'AI 拆点时按这个数量拆')
      + cfgRow('判定严格度', String(ctx.config('strict') || '标准'), '严格档会把"术语是否规范"单独列成采分点')
      + cfgRow('每日目标', String(clamp(ctx.config('dailyGoal') || 2, 1, 20)) + ' 道', '头部 KPI 的达标线')
      + cfgRow('低分进错题本', ctx.config('toMistakes') === false ? '关' : '开', '得分 <80 时把这道题写进站内错题本')
      + '</div>')
    out.push('<div class="sf-quiet">改法：插件中心 →「采分点熔炉」→ 配置。设置只有一处入口。</div>')
    out.push('</section>')

    out.push('<section class="sf-card"><div class="sf-card-h"><b>数据</b><em>本机存储</em></div>')
    out.push('<div class="sf-quiet">题库与练习记录存在本机（插件命名空间）。站内掌握度与错题本由站点自己管，清空这里不会动它们。</div>')
    out.push('<div class="sf-acts">'
      + '<button class="sf-btn" data-act="exp-json">导出 JSON</button>'
      + '<button class="sf-btn" data-act="exp-md">导出 Markdown</button>'
      + '<button class="sf-btn ghost" data-act="imp-json">导入 JSON</button>'
      + '<button class="sf-btn ghost danger" data-act="wipe">清空全部</button>'
      + '</div></section>')

    out.push('<section class="sf-card"><div class="sf-card-h"><b>关于</b><em>v' + VERSION + '</em></div>')
    out.push('<div class="sf-about">'
      + '<p><b>采分点熔炉</b>：主观题的分不是"写得多"给的，是"踩到点"给的。拆点 → 限时写 → 逐点判定 → 漏点画像。</p>'
      + '<p>判定口径：命中=满权重，半踩=权重×0.5，未踩=0；分数 = 命中权重 / 总权重。</p>'
      + '<p>复练间隔：<b>直接用站点的 Spaced 盒算法</b>（通过升一盒、没通过回 1 盒），插件不自己算日期。</p>'
      + '<p>每次记录都会写站内掌握度热力图；得分 &lt;80 且开了「低分进错题本」时，会同时进站内错题本。</p>'
      + '<p class="sf-quiet">数据形状变更会走 normQuestion/normAttempt 迁移，不会因为升级丢记录。</p>'
      + '</div></section>')
    return out.join('')
  }
  function cfgRow(label, val, tip) {
    return '<div class="sf-cfgrow"><b>' + esc(label) + '</b><em>' + esc(val) + '</em><span>' + esc(tip) + '</span></div>'
  }
  function bindSetup(ctx, S, stage, paint, reload) { /* 委托 */ }

  /* ---- 数据进出与站点动作 ---- */
  function importMistakes(ctx, done) {
    let cands = mistakesAsQuestions(ctx)
    if (!cands.length) {
      toast(ctx, '错题本里没有可导入的主观题（题干太短或没有解析）', 'warn', 3000)
      return
    }
    ctx.api.confirm('导入 ' + cands.length + ' 道主观题？',
      '<div class="muted-sm">从站内错题本挑出题干较长 / 带解析的记录，作为题库种子。导入后还要拆采分点才能练。已在题库里的同源错题会跳过。</div>',
      function () {
        let cur = loadQs(ctx)
        let exist = {}
        for (let i = 0; i < cur.length; i++) if (cur[i].mistakeId) exist[cur[i].mistakeId] = 1
        let added = 0
        for (let i = 0; i < cands.length; i++) {
          let c = cands[i]
          if (c.mistakeId && exist[c.mistakeId]) continue
          let q = normQuestion({
            subject: c.subject, topic: c.topic, stem: c.stem, ref: c.ref,
            src: 'mistake', mistakeId: c.mistakeId,
            createdAt: todayKey(), due: todayKey()
          })
          if (!q) continue
          cur.push(q)
          added++
        }
        saveQs(ctx, cur)
        if (done) done()
        toast(ctx, '导入了 ' + added + ' 道（跳过 ' + (cands.length - added) + ' 道重复）', 'success', 2600)
      })
  }
  function makeTask(ctx, q, S) {
    if (!q) { toast(ctx, '找不到这道题', 'warn'); return }
    let miss = []
    let last = null
    for (let i = S.as.length - 1; i >= 0; i--) if (S.as[i].qid === q.id) { last = S.as[i]; break }
    if (last) {
      let hit = {}
      for (let i = 0; i < last.hits.length; i++) hit[last.hits[i]] = 1
      for (let i = 0; i < q.points.length; i++) if (!hit[q.points[i].id]) miss.push(q.points[i].text)
    }
    let text = '复练主观题：' + shortTitle(q.stem, 22) + (miss.length ? '（漏 ' + miss.length + ' 点）' : '')
    if (addTask(ctx, text, q.subject)) toast(ctx, '已写进明日任务（排程页可见）', 'success', 2600)
    else toast(ctx, '写任务失败：宿主 Store 不可用', 'warn')
  }
  function exportJson(ctx, S) {
    ctx.api.download('scoring-forge-' + todayKey() + '.json',
      JSON.stringify({ app: 'scoring-forge', version: VERSION, exportedAt: new Date().toISOString(), questions: S.qs, attempts: S.as }, null, 2),
      'application/json')
    toast(ctx, '已导出 JSON', 'success')
  }
  function exportMarkdown(ctx, S) {
    let lines = ['# 采分点熔炉 · 练习报告', '', '导出时间：' + new Date().toLocaleString(), '']
    let n = S.as.length
    let avg = 0
    for (let i = 0; i < n; i++) avg += S.as[i].score
    avg = n ? Math.round(avg / n) : 0
    lines.push('## 总览', '- 题库：' + S.qs.length + ' 道', '- 练习：' + n + ' 次', '- 平均分：' + avg, '- 连续天数：' + streakOf(S.as), '')
    let prof = leakProfile(S.qs, S.as)
    if (prof.length) {
      lines.push('## 漏点画像（按漏率降序）', '| 类型 | 漏 / 出现 | 漏率 |', '|---|---|---|')
      for (let i = 0; i < prof.length; i++) {
        if (!prof[i].seen) continue
        lines.push('| ' + prof[i].label + ' | ' + prof[i].missed + ' / ' + prof[i].seen + ' | ' + prof[i].rate + '% |')
      }
      lines.push('')
    }
    lines.push('## 题库清单', '| 题干 | 学科 | 点数 | 盒 | 下次复练 |', '|---|---|---|---|---|')
    for (let i = 0; i < S.qs.length; i++) {
      let q = S.qs[i]
      lines.push('| ' + shortTitle(q.stem, 40).replace(/\|/g, '/') + ' | ' + subjectLabel(q.subject) + ' | ' + q.points.length + ' | ' + (q.box || 1) + ' | ' + (q.due || '—') + ' |')
    }
    lines.push('')
    let recent = S.as.slice(-10).reverse()
    if (recent.length) {
      lines.push('## 最近练习')
      for (let i = 0; i < recent.length; i++) {
        let a = recent[i]
        let q = findQ(S.qs, a.qid)
        lines.push('- ' + fmtDate(dkey(new Date(a.at))) + ' · ' + a.score + ' 分 · ' + (q ? shortTitle(q.stem, 30) : '（已删除）') + (a.note ? '　' + a.note : ''))
      }
    }
    ctx.api.download('scoring-forge-' + todayKey() + '.md', lines.join('\n'), 'text/markdown;charset=utf-8')
    toast(ctx, '已导出 Markdown', 'success')
  }
  function importJson(ctx, done) {
    ctx.api.readFile('.json,application/json').then(function (f) {
      let data = null
      try { data = JSON.parse(String(f.text || '')) } catch (e) { toast(ctx, '不是合法 JSON', 'warn'); return }
      let qs = Array.isArray(data && data.questions) ? data.questions : []
      let as = Array.isArray(data && data.attempts) ? data.attempts : []
      if (!qs.length) { toast(ctx, '文件里没有题目', 'warn'); return }
      ctx.api.confirm('导入 ' + qs.length + ' 道题？', '<div class="muted-sm">按 id 去重合并：同 id 覆盖，其余新增。当前题库 ' + loadQs(ctx).length + ' 道。</div>', function () {
        let cur = loadQs(ctx)
        let map = {}
        for (let i = 0; i < cur.length; i++) map[cur[i].id] = cur[i]
        let added = 0
        for (let i = 0; i < qs.length; i++) {
          let q = normQuestion(qs[i])
          if (!q) continue
          if (!map[q.id]) added++
          map[q.id] = q
        }
        let merged = []
        for (let k in map) if (Object.prototype.hasOwnProperty.call(map, k)) merged.push(map[k])
        saveQs(ctx, merged)
        let oldA = loadAs(ctx)
        let seen = {}
        for (let i = 0; i < oldA.length; i++) seen[oldA[i].id] = 1
        let addA = []
        for (let i = 0; i < as.length; i++) {
          let a = normAttempt(as[i])
          if (a && !seen[a.id]) addA.push(a)
        }
        if (addA.length) saveAs(ctx, oldA.concat(addA))
        if (done) done()
        toast(ctx, '导入完成：新增 ' + added + ' 道，记录 +' + addA.length, 'success')
      })
    })['catch'](function () { toast(ctx, '读取文件失败', 'warn') })
  }
  function aiSelfTest(ctx) {
    if (!aiOk(ctx)) { toast(ctx, '未配置 AI：手动写点 + 逐点自评同样能练', 'warn', 2800); return }
    toast(ctx, '正在测试…', 'info', 1200)
    /* 探活走伪场景 probe.connect：它只是连通性测试，不该冒充业务场景占参数中心一行。 */
    ctx.ai.json('只输出 JSON：{"ok":true}', '回一个 {"ok":true} 即可。', { ctx: 'probe.connect' }).then(function () {
      toast(ctx, 'AI 可用：拆点与判定都会自动跑', 'success', 2600)
    })['catch'](function (e) {
      toast(ctx, 'AI 调用失败：' + ((e && e.message) || '') + '（不影响手动模式）', 'warn', 3200)
    })
  }

  /* ---------- 共享层：宿主 css 字段（硬上限 20000 字符）----------
   * 设计语言沿用「讲义式排版」但换主色：朱砂（批卷红）+ 米纸，与费曼晶体的青绿区分开。
   * 页眉/dock/卡片/表单/空态/面板/夜间/响应式放这里（任何场景都要有）。 */
  let CSS = [
    '.sf-root{--sf-acc:#b23a2e;--sf-acc2:#8a5a2b;--sf-ink:var(--text-primary,#1b2430);--sf-sub:var(--text-muted,#6b7788);--sf-line:var(--line,#e5e7eb);--sf-line2:color-mix(in srgb,var(--text-primary,#1b2430) 24%,transparent);--sf-bg:var(--surface,#fff);--sf-soft:var(--surface-muted,#f6f8fb);--sf-gut:var(--vp-x,16px);--sf-w:1180px;position:relative;color:var(--sf-ink);font:14px/1.65 "PingFang SC","Noto Sans SC","Microsoft YaHei",system-ui,sans-serif}',
    '.sf-root *,.sf-root *::before,.sf-root *::after{box-sizing:border-box}',
    '.sf-root button{font-family:inherit;color:inherit}',
    '.sf-aura{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;background-image:repeating-linear-gradient(90deg,color-mix(in srgb,var(--sf-ink) 4%,transparent) 0 1px,transparent 1px 96px);mask-image:linear-gradient(180deg,#000,transparent 72%);-webkit-mask-image:linear-gradient(180deg,#000,transparent 72%)}',
    '.sf-aura i{position:absolute;border-radius:50%;filter:blur(90px);opacity:.26}',
    '.sf-aura i:nth-child(1){width:440px;height:440px;left:-150px;top:-200px;background:radial-gradient(circle,rgba(178,58,46,.45),transparent 68%);animation:sfFloat 32s ease-in-out infinite alternate}',
    '.sf-aura i:nth-child(2){width:360px;height:360px;right:-140px;top:-80px;background:radial-gradient(circle,rgba(138,90,43,.32),transparent 70%);animation:sfFloat 40s ease-in-out infinite alternate-reverse}',
    '@keyframes sfFloat{to{transform:translate3d(28px,-20px,0) scale(1.06)}}',
    '.sf-top{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:16px;margin:0 calc(-1 * var(--sf-gut));padding:15px calc(var(--sf-gut) + max(6px,(100% - var(--sf-w)) / 2)) 13px;background:transparent;transition:padding .3s cubic-bezier(.22,1,.36,1),background-color .3s ease}',
    '.sf-top::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--sf-line);opacity:0;transition:opacity .3s ease}',
    '.sf-top.is-stuck{padding-top:8px;padding-bottom:8px;background:color-mix(in srgb,var(--sf-bg) 88%,transparent);backdrop-filter:blur(18px) saturate(1.1);-webkit-backdrop-filter:blur(18px) saturate(1.1)}',
    '.sf-top.is-stuck::after{opacity:1}',
    '.sf-brand{display:flex;align-items:center;gap:11px;min-width:0}',
    '.sf-mark{width:40px;height:40px;flex:0 0 40px;display:grid;place-items:center;color:var(--sf-acc);transition:width .3s,height .3s,flex-basis .3s}',
    '.sf-mark svg{width:34px;height:34px}',
    '.sf-top.is-stuck .sf-mark{width:30px;height:30px;flex-basis:30px}',
    '.sf-top.is-stuck .sf-mark svg{width:26px;height:26px}',
    '.sf-brandtx{display:flex;flex-direction:column;min-width:0}',
    '.sf-kicker{font:600 8.5px/1.5 ui-monospace,Consolas,monospace;letter-spacing:.24em;color:var(--sf-sub);text-transform:uppercase;max-height:13px;overflow:hidden;transition:max-height .3s,opacity .3s}',
    '.sf-top.is-stuck .sf-kicker{max-height:0;opacity:0}',
    '.sf-brandtx b{font-family:Georgia,"Songti SC","Noto Serif SC",serif;font-size:21px;font-weight:700;letter-spacing:.05em;white-space:nowrap;transition:font-size .3s}',
    '.sf-top.is-stuck .sf-brandtx b{font-size:17px}',
    '.sf-brandtx em{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:9.5px;color:var(--sf-sub);margin-left:7px;letter-spacing:.06em}',
    '.sf-kpis{display:flex;align-items:baseline;margin-left:auto}',
    '.sf-kpi{display:flex;flex-direction:column;align-items:center;padding:0 14px;border-left:1px solid var(--sf-line);min-width:54px}',
    '.sf-kpi:first-child{border-left:0}',
    '.sf-kpi b{font-family:Georgia,serif;font-size:21px;line-height:1.15;font-variant-numeric:tabular-nums;transition:font-size .3s}',
    '.sf-kpi b em{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:11px;color:var(--sf-sub);letter-spacing:0}',
    '.sf-top.is-stuck .sf-kpi b{font-size:17px}',
    '.sf-kpi i{font-style:normal;font-size:9.5px;color:var(--sf-sub);letter-spacing:.14em;text-transform:uppercase}',
    '.sf-kpi.warn b{color:#b45309}',
    '.sf-kpi.ok b{color:#0f766e}',
    '.sf-topacts{display:flex;align-items:center;gap:10px;margin-left:6px}',
    '.sf-btn{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 1px;border:0;border-bottom:1px solid transparent;border-radius:0;background:none;color:var(--sf-ink);font-size:13px;font-weight:600;cursor:pointer;transition:color .16s,border-color .16s,transform .16s}',
    '.sf-btn:hover{color:var(--sf-acc);border-bottom-color:currentColor}',
    '.sf-btn:active{transform:translateY(1px)}',
    '.sf-btn svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.8}',
    '.sf-btn.primary{height:34px;padding:0 18px;border:0;border-radius:999px;background:linear-gradient(135deg,var(--sf-acc),#8f3a2a);color:#fff;box-shadow:0 8px 20px -12px rgba(178,58,46,.9)}',
    '.sf-btn.primary:hover{color:#fff;transform:translateY(-1px)}',
    '.sf-btn.ghost{color:var(--sf-sub)}',
    '.sf-btn.ghost.on{color:var(--sf-acc);border-bottom-color:var(--sf-acc)}',
    '.sf-btn.danger{color:#b91c1c}',
    '.sf-btn.sm{height:24px;font-size:12px}',
    '.sf-icobtn{width:30px;height:30px;display:grid;place-items:center;border:0;border-radius:0;background:none;color:var(--sf-sub);cursor:pointer;transition:color .16s,transform .16s}',
    '.sf-icobtn:hover{color:var(--sf-acc);transform:translateY(-1px)}',
    '.sf-icobtn svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.7}',
    '.sf-icobtn.sm{width:24px;height:24px}',
    '.sf-icobtn.sm svg{width:13px;height:13px}',
    '.sf-icobtn.danger{color:#b91c1c}',
    '.sf-stage{position:relative;z-index:1;width:100%;max-width:var(--sf-w);margin:0 auto;display:flex;flex-direction:column;padding:4px 6px 140px}',
    '.sf-card{border:0;border-top:1px solid var(--sf-line);border-radius:0;background:transparent;box-shadow:none;padding:18px 0 6px;animation:sfRise .45s cubic-bezier(.22,1,.36,1) both}',
    '.sf-card:first-child{border-top:0;padding-top:8px}',
    '.sf-card:nth-child(2){animation-delay:45ms}',
    '.sf-card:nth-child(3){animation-delay:85ms}',
    '@keyframes sfRise{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:none}}',
    '.sf-card-h{display:flex;align-items:baseline;gap:10px;padding-bottom:9px;margin-bottom:14px;border-bottom:1px solid var(--sf-line)}',
    '.sf-card-h b{font-family:Georgia,"Songti SC",serif;font-size:17px;font-weight:700;letter-spacing:.03em}',
    '.sf-card-h em{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:10px;letter-spacing:.12em;color:var(--sf-sub);text-transform:uppercase}',
    '.sf-card-h .sf-btn,.sf-card-h .sf-icobtn{margin-left:auto}',
    '.sf-card-h .sf-btn+.sf-btn,.sf-card-h .sf-btn+.sf-icobtn{margin-left:6px}',
    '.sf-quiet{font-size:12.5px;line-height:1.9;color:var(--sf-sub)}',
    '.sf-more{font-size:12px;color:var(--sf-sub);margin-top:9px;padding-top:9px;border-top:1px dashed var(--sf-line)}',
    '.sf-acts{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:16px}',
    '.sf-hint{font-size:11.5px;color:var(--sf-sub);letter-spacing:.02em}',
    '.sf-goalline{display:flex;align-items:baseline;gap:12px;margin:0 0 14px;font-size:12px;color:var(--sf-sub)}',
    '.sf-goalline>b{font-family:Georgia,serif;font-size:14px;color:var(--sf-ink);font-weight:700}',
    '.sf-goalline.ok>b{color:#0f766e}',
    '.sf-goalbar{margin-left:auto;width:120px;height:2px;background:var(--sf-line2);overflow:hidden}',
    '.sf-goalbar b{display:block;height:100%;background:var(--sf-acc);transition:width .6s cubic-bezier(.22,1,.36,1)}',
    '.sf-qlist{display:flex;flex-direction:column}',
    '.sf-qrow{display:flex;align-items:center;gap:12px;padding:12px 2px;border:0;border-bottom:1px solid var(--sf-line);border-radius:0;background:transparent;transition:background .18s,padding-left .18s}',
    '.sf-qrow:last-child{border-bottom:0}',
    '.sf-qrow:hover{background:linear-gradient(90deg,color-mix(in srgb,var(--sf-acc) 8%,transparent),transparent 58%);padding-left:9px}',
    '.sf-qdot{width:7px;height:7px;border-radius:50%;flex:0 0 7px}',
    '.sf-qmain{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}',
    '.sf-qmain b{font-size:13.5px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.sf-qmain span{font-size:11.5px;color:var(--sf-sub)}',
    '.sf-od{font-family:ui-monospace,Consolas,monospace;font-size:10.5px;letter-spacing:.06em;color:var(--sf-sub);white-space:nowrap}',
    '.sf-od.ok{color:#0f766e}',
    '.sf-input{height:32px;border:0;border-bottom:1px solid var(--sf-line2);border-radius:0;padding:3px 2px;background:transparent;color:var(--sf-ink);font-size:13.5px;font-family:inherit;outline:none;transition:border-color .16s,box-shadow .16s}',
    '.sf-input:focus{border-bottom-color:var(--sf-acc);box-shadow:0 1px 0 0 var(--sf-acc)}',
    '.sf-searchbar{display:flex;align-items:center;gap:20px;flex-wrap:wrap;margin-bottom:10px}',
    '.sf-searchbar .sf-subjbar{margin:0;padding:0;border:0;flex:0 0 auto}',
    '.sf-search{flex:1;min-width:180px;max-width:320px}',
    '.sf-ta{width:100%;border:0;border-left:2px solid color-mix(in srgb,var(--sf-acc) 55%,transparent);border-radius:0;padding:12px 14px;background:color-mix(in srgb,var(--sf-ink) 2.5%,transparent);color:var(--sf-ink);font:13.5px/1.85 inherit;outline:none;resize:vertical;min-height:190px;transition:background .16s,border-color .16s}',
    '.sf-ta:focus{background:color-mix(in srgb,var(--sf-acc) 4%,transparent);border-left-color:var(--sf-acc)}',
    '.sf-prog{display:flex;align-items:center;gap:12px;margin-bottom:14px;font-family:ui-monospace,Consolas,monospace;font-size:10.5px;letter-spacing:.1em;color:var(--sf-sub);text-transform:uppercase}',
    '.sf-clock{margin-left:auto;color:var(--sf-acc);font-variant-numeric:tabular-nums}',
    '.sf-score{margin-left:auto;font-family:Georgia,serif;font-size:14px;color:var(--sf-ink);letter-spacing:0;text-transform:none}',
    '.sf-q{padding:16px 0 14px 16px;border-left:2px solid var(--sf-acc);margin-bottom:16px}',
    '.sf-q b{display:block;font-family:Georgia,"Songti SC",serif;font-size:16.5px;line-height:1.7;font-weight:700;letter-spacing:.01em}',
    '.sf-qwhy{display:block;margin-top:7px;font-size:11.5px;color:var(--sf-sub)}',
    '.sf-asking{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--sf-sub);padding:16px 0}',
    '.sf-asking i{font-style:normal;font-size:11.5px;opacity:.85}',
    '.sf-spin{width:14px;height:14px;border-radius:50%;border:2px solid color-mix(in srgb,var(--sf-acc) 25%,transparent);border-top-color:var(--sf-acc);animation:sfSpin .8s linear infinite}',
    '@keyframes sfSpin{to{transform:rotate(360deg)}}',
    '.sf-skl{display:flex;flex-direction:column;gap:9px;padding:2px 0 14px}',
    '.sf-skl i{height:9px;background:var(--sf-line);animation:sfShimmer 1.4s ease-in-out infinite}',
    '.sf-skl i:nth-child(2){width:80%;animation-delay:.12s}',
    '.sf-skl i:nth-child(3){width:62%;animation-delay:.24s}',
    '@keyframes sfShimmer{0%,100%{opacity:.35}50%{opacity:1}}',
    '.sf-ring{display:block}',
    '.sf-ring-t{font:700 17px/1 Georgia,serif;fill:var(--sf-ink)}',
    '.sf-empty{padding:34px 12px;text-align:center;border-top:1px solid var(--sf-line);border-bottom:1px solid var(--sf-line);display:flex;flex-direction:column;align-items:center;gap:9px}',
    '.sf-empty-ic{color:var(--sf-sub);opacity:.75}',
    '.sf-empty-ic svg{width:26px;height:26px;fill:none;stroke:currentColor;stroke-width:1.4}',
    '.sf-empty b{font-family:Georgia,"Songti SC",serif;font-size:15px}',
    '.sf-empty span{font-size:12px;color:var(--sf-sub);max-width:440px;line-height:1.85}',
    '.sf-confetti{position:fixed;left:50%;top:46%;width:0;height:0;z-index:60;pointer-events:none}',
    '.sf-confetti i{position:absolute;width:6px;height:6px;border-radius:1px;background:var(--c);animation:sfConfetti 1.25s cubic-bezier(.2,.8,.3,1) var(--d) both}',
    '@keyframes sfConfetti{from{transform:translate(0,0) rotate(0);opacity:1}to{transform:translate(var(--x),var(--y)) rotate(var(--r));opacity:0}}',
    '.sf-dockwrap{display:contents}',
    '.sf-dock{position:sticky;z-index:40;bottom:calc(70px + env(safe-area-inset-bottom,0px));display:flex;justify-content:center;gap:2px;width:max-content;margin:18px auto 0;padding:6px;border-radius:18px;background:color-mix(in srgb,var(--sf-bg) 84%,transparent);border:1px solid var(--sf-line);box-shadow:0 16px 36px -26px rgba(20,32,28,.7);backdrop-filter:blur(20px) saturate(1.15);-webkit-backdrop-filter:blur(20px) saturate(1.15)}',
    'html[data-layout="workbench"] .sf-dock{bottom:20px}',
    '@media (max-width:900px){html[data-layout="workbench"] .sf-dock{bottom:calc(70px + env(safe-area-inset-bottom,0px))}}',
    '.sf-dock-ind{position:absolute;top:6px;bottom:6px;left:6px;width:62px;border-radius:14px;background:linear-gradient(135deg,var(--sf-acc),#8f3a2a);box-shadow:0 6px 16px -8px rgba(178,58,46,.8);transition:left .38s cubic-bezier(.3,.85,.3,1),width .38s cubic-bezier(.3,.85,.3,1)}',
    '.sf-dock-item{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:3px;min-width:62px;padding:8px 13px;border:0;border-radius:14px;background:none;color:var(--sf-sub);font-size:10.5px;font-weight:600;letter-spacing:.04em;cursor:pointer;transition:color .25s}',
    '.sf-dock-item svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;transition:transform .25s}',
    '.sf-dock-item em{font-style:normal}',
    '.sf-dock-item:hover{color:var(--sf-ink)}',
    '.sf-dock-item:hover svg{transform:translateY(-2px) scale(1.06)}',
    '.sf-dock-item.on{color:#fff}',
    '.sf-dot{position:absolute;top:5px;right:11px;width:6px;height:6px;border-radius:50%;background:#e11d48;box-shadow:0 0 6px #e11d48;display:none}',
    '.sf-dot.show{display:block;animation:sfDot 1.6s infinite}',
    '@keyframes sfDot{50%{opacity:.35}}',
    '.sf-panel{font:13px/1.6 "PingFang SC","Microsoft YaHei",system-ui,sans-serif;color:var(--text-primary,#1b2430);padding:2px}',
    '.sf-panel-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}',
    '.sf-panel-kpis div{border-bottom:1px solid var(--line,#e5e7eb);padding:2px 0 6px}',
    '.sf-panel-kpis b{display:block;font-family:Georgia,serif;font-size:20px;line-height:1.2}',
    '.sf-panel-kpis span{font-size:9.5px;letter-spacing:.1em;color:var(--text-muted,#6b7788)}',
    '.sf-panel-list{display:flex;flex-direction:column}',
    '.sf-panel-row{display:flex;align-items:center;gap:8px;font-size:12px;padding:7px 0;border-bottom:1px solid var(--line,#e5e7eb)}',
    '.sf-panel-row i{width:6px;height:6px;border-radius:50%;flex:0 0 6px}',
    '.sf-panel-row span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.sf-panel-row em{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:9.5px;color:var(--text-muted,#6b7788)}',
    '.sf-panel-empty{font-size:12px;color:var(--text-muted,#6b7788);padding:14px 0;line-height:1.8;border-bottom:1px solid var(--line,#e5e7eb)}',
    '.sf-panel-empty.ok{color:#0f766e}',
    '.sf-panel-foot{margin-top:10px;font-size:10px;letter-spacing:.06em;color:var(--text-muted,#6b7788)}',
    '@media (max-width:760px){.sf-top{gap:10px;padding:11px 14px}.sf-brandtx b{font-size:17px}.sf-kicker{display:none}.sf-kpi{padding:0 9px;min-width:44px}.sf-kpi b{font-size:16px}.sf-kpi i{font-size:8.5px;letter-spacing:.08em}.sf-topacts .sf-go span{display:none}.sf-topacts .sf-go{padding:0 11px}.sf-stage{padding:4px 14px 152px}.sf-card-h{flex-wrap:wrap}.sf-dock{width:calc(100vw - 24px);justify-content:space-between}.sf-dock-item{min-width:0;flex:1;padding:7px 2px}.sf-dock-item em{font-size:9.5px}}',
    '@media (prefers-reduced-motion:reduce){.sf-root *,.sf-root *::before,.sf-root *::after{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}}',
    'html[data-theme="night"] .sf-dock{box-shadow:0 16px 40px -26px rgba(0,0,0,.95)}',
    'html[data-theme="night"] .sf-dim-bar,html[data-theme="night"] .sf-subdist,html[data-theme="night"] .sf-leakbar{background:rgba(255,255,255,.14)}',
    'html[data-theme="night"] .sf-aura{background-image:repeating-linear-gradient(90deg,rgba(255,255,255,.045) 0 1px,transparent 1px 96px)}'
  ].join('')

  /* ---------- 页面专属层：挂载时注入 <style>、destroy 移除 ---------- */
  let CSS_EXTRA = [
    '.sf-ptlist{display:flex;flex-direction:column;border-top:1px solid var(--sf-line)}',
    '.sf-prow{display:flex;align-items:center;gap:12px;padding:11px 2px;border-bottom:1px solid var(--sf-line);transition:background .18s}',
    '.sf-prow.is-hit{background:linear-gradient(90deg,rgba(15,118,110,.07),transparent 60%)}',
    '.sf-prow.is-half{background:linear-gradient(90deg,rgba(180,83,9,.07),transparent 60%)}',
    '.sf-pkind{font-family:ui-monospace,Consolas,monospace;font-size:9.5px;letter-spacing:.06em;color:var(--c);border-bottom:1px solid var(--c);padding-bottom:1px;white-space:nowrap;flex:0 0 auto}',
    '.sf-pmain{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}',
    '.sf-pmain b{font-size:12.5px;font-weight:700;line-height:1.6}',
    '.sf-pmain span{font-size:10.5px;color:var(--sf-sub)}',
    '.sf-pmarks{display:flex;gap:4px;flex:0 0 auto}',
    '.sf-pmark{width:28px;height:26px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--sf-line2);border-radius:0;background:none;color:var(--sf-sub);font-size:12px;cursor:pointer;transition:all .16s}',
    '.sf-pmark svg{width:13px;height:13px;display:block}',
    '.sf-pmark:hover{border-color:var(--sf-acc);color:var(--sf-acc)}',
    '.sf-pmark.on{background:var(--sf-acc);border-color:var(--sf-acc);color:#fff}',
    '.sf-pmark[data-mode="half"].on{background:#b45309;border-color:#b45309}',
    '.sf-pmark[data-mode="miss"].on{background:#475569;border-color:#475569}',
    '.sf-comment{margin-top:14px;padding:12px 0 12px 16px;border-left:2px solid var(--sf-line2);font-size:13px;line-height:1.85}',
    '.sf-done{display:flex;align-items:center;gap:24px;padding:8px 0 4px;flex-wrap:wrap}',
    '.sf-done-ring{animation:sfGrow .6s cubic-bezier(.22,1,.36,1) both}',
    '@keyframes sfGrow{from{transform:scale(.9);opacity:0}to{transform:none;opacity:1}}',
    '.sf-done-tx{flex:1;min-width:260px}',
    '.sf-done-tx>b{display:block;font-family:Georgia,"Songti SC",serif;font-size:16.5px;line-height:1.7;font-weight:700;margin-bottom:12px}',
    '.sf-done-meta{display:flex;gap:20px;flex-wrap:wrap;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--sf-line)}',
    '.sf-pill{font-size:11.5px;color:var(--sf-sub);letter-spacing:.03em}',
    '.sf-pill b{font-family:Georgia,serif;font-size:14px;color:var(--sf-ink);margin:0 2px}',
    '.sf-pill.ok{color:#0f766e}',
    '.sf-pill.warn{color:#b45309}',
    '.sf-missbox b{display:block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--sf-sub);margin-bottom:7px}',
    '.sf-chip{display:inline-block;margin:0 8px 6px 0;padding:0 0 2px;border-bottom:1px solid var(--c,var(--sf-acc));font-size:12px;color:var(--c,var(--sf-acc))}',
    '.sf-steps{margin:0;padding:0;list-style:none;counter-reset:sfs;display:flex;flex-direction:column;gap:12px}',
    '.sf-steps li{counter-increment:sfs;font-size:12.5px;line-height:1.75;padding-left:34px;position:relative}',
    '.sf-steps li:before{content:counter(sfs,decimal-leading-zero);position:absolute;left:0;top:1px;font-family:Georgia,serif;font-size:13px;color:var(--sf-acc)}',
    '.sf-steps li b{display:block;font-size:13px;margin-bottom:2px}',
    '.sf-steps li span{color:var(--sf-sub)}',
    '.sf-bars-wrap{margin:8px 0 6px}',
    '.sf-bars{width:100%;height:74px;display:block}',
    '.sf-line{width:100%;height:130px;display:block}',
    '.sf-axis{display:flex;justify-content:space-between;font-family:ui-monospace,Consolas,monospace;font-size:10px;color:var(--sf-sub);letter-spacing:.06em}',
    '.sf-overview{display:flex;align-items:center;gap:34px;flex-wrap:wrap}',
    '.sf-ov-ring{display:flex;flex-direction:column;align-items:center;gap:6px}',
    '.sf-ov-ring i{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--sf-sub)}',
    '.sf-ov-grid{flex:1;display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:0 26px}',
    '.sf-ov-cell{padding:9px 0;border-bottom:1px solid var(--sf-line)}',
    '.sf-ov-cell b{display:block;font-family:Georgia,serif;font-size:26px;line-height:1.2;font-variant-numeric:tabular-nums}',
    '.sf-ov-cell span{font-size:10.5px;color:var(--sf-sub);letter-spacing:.06em}',
    '.sf-leaklist{display:flex;flex-direction:column}',
    '.sf-leakrow{display:flex;align-items:center;gap:14px;padding:10px 0;border-bottom:1px solid var(--sf-line)}',
    '.sf-leakrow:last-child{border-bottom:0}',
    '.sf-leakname{font-size:12px;font-weight:700;min-width:88px;color:var(--c);letter-spacing:.02em}',
    '.sf-leakbar{flex:1;height:2px;background:var(--sf-line2);overflow:hidden}',
    '.sf-leakbar b{display:block;height:100%;transition:width .7s cubic-bezier(.22,1,.36,1)}',
    '.sf-leakrow em{font-style:normal;font-family:Georgia,serif;font-size:15px;font-weight:700;min-width:38px;text-align:right;font-variant-numeric:tabular-nums}',
    '.sf-leakn{font-family:ui-monospace,Consolas,monospace;font-size:10px;color:var(--sf-sub);min-width:74px;text-align:right}',
    '.sf-subjbar{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:14px;border-bottom:1px solid var(--sf-line);padding-bottom:10px}',
    '.sf-schip{height:22px;padding:0;border:0;border-bottom:1px solid transparent;border-radius:0;background:none;font-size:12px;color:var(--sf-sub);cursor:pointer;transition:color .16s,border-color .16s}',
    /* 【2026-10-23 触控命中区】文字风格的小按钮（`.sf-btn.sm` 24px、`.sf-schip` 22px）在手机上按不准
     * —— 真机实测命中框就是 48×24 / 24×22，远低于 44px 的可点下限。但直接加高会挪动下划线与行高，
     * 把「线压字」的排版改坏。改用**透明伪元素向外扩命中区**：绝对定位不参与布局，
     * 视觉一字不动，手指能按到的范围变成 36~38px。 */
    '.sf-btn.sm,.sf-schip{position:relative}',
    '.sf-btn.sm::after,.sf-schip::after{content:"";position:absolute;left:-2px;right:-2px;top:-7px;bottom:-7px}',
    '.sf-schip:hover{color:var(--sf-ink)}',
    '.sf-schip.on{color:var(--c,var(--sf-acc));border-bottom-color:currentColor;font-weight:700}',
    '.sf-subjrow{display:flex;align-items:center;gap:14px;padding:9px 0;border-bottom:1px solid var(--sf-line)}',
    '.sf-subjrow:last-child{border-bottom:0}',
    '.sf-subjname{font-size:12px;font-weight:700;min-width:56px;color:var(--c)}',
    '.sf-subdist{flex:1;height:2px;background:var(--sf-line2);overflow:hidden}',
    '.sf-subdist b{display:block;height:100%}',
    '.sf-subjrow em{font-style:normal;font-family:Georgia,serif;font-size:15px;font-weight:700;min-width:28px;text-align:right;font-variant-numeric:tabular-nums}',
    '.sf-subjn{font-family:ui-monospace,Consolas,monospace;font-size:10px;color:var(--sf-sub);min-width:38px;text-align:right}',
    '.sf-thin{display:flex;flex-direction:column}',
    '.sf-thin-row{display:flex;align-items:center;gap:14px;padding:10px 2px;border-bottom:1px solid var(--sf-line)}',
    '.sf-thin-row:last-child{border-bottom:0}',
    '.sf-thin-n{font-family:Georgia,serif;font-size:13px;color:var(--sf-acc);width:18px;flex:0 0 18px}',
    '.sf-thin-row>div{flex:1;min-width:0;display:flex;flex-direction:column}',
    '.sf-thin-row b{font-size:12.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.sf-thin-row span{font-size:10.5px;color:var(--sf-sub)}',
    '.sf-thinn{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:10px;color:var(--sf-sub);white-space:nowrap}',
    '.sf-tip{padding:11px 0 11px 16px;border-left:2px solid var(--sf-acc)}',
    '.sf-tip b{display:block;font-size:12.5px;margin-bottom:3px}',
    '.sf-tip span{font-size:11.5px;color:var(--sf-sub);line-height:1.75}',
    '.sf-health{display:flex;gap:26px;flex-wrap:wrap;margin-bottom:6px}',
    '.sf-hcell{display:inline-flex;align-items:center;gap:7px;font-size:11.5px;color:var(--sf-sub);padding-bottom:4px;border-bottom:1px solid var(--sf-line)}',
    '.sf-hcell i{width:6px;height:6px;border-radius:50%;background:var(--sf-sub)}',
    '.sf-hcell.ok{color:#0f766e;border-bottom-color:rgba(15,118,110,.4)}',
    '.sf-hcell.ok i{background:#0f766e}',
    '.sf-hcell.no{color:#b45309;border-bottom-color:rgba(180,83,9,.35)}',
    '.sf-hcell.no i{background:#b45309}',
    '.sf-cfglist{display:flex;flex-direction:column}',
    '.sf-cfgrow{display:grid;grid-template-columns:130px 76px 1fr;gap:14px;align-items:baseline;font-size:12px;padding:10px 0;border-bottom:1px solid var(--sf-line)}',
    '.sf-cfgrow b{font-weight:700}',
    '.sf-cfgrow em{font-style:normal;color:var(--sf-acc);font-family:Georgia,serif;font-size:14px;font-weight:700}',
    '.sf-cfgrow span{color:var(--sf-sub);font-size:11.5px;line-height:1.7}',
    '.sf-about p{margin:0 0 9px;font-size:12.5px;line-height:1.9;color:var(--sf-sub);padding-left:14px;border-left:1px solid var(--sf-line)}',
    '.sf-about p b{color:var(--sf-ink)}',
    '.sf-form{display:flex;flex-direction:column;gap:14px}',
    '.sf-form label{display:flex;flex-direction:column;gap:5px;font-size:11.5px;color:var(--sf-sub);letter-spacing:.04em;font-weight:600}',
    '.sf-form label b{color:#b91c1c}',
    '.sf-form code{font-family:ui-monospace,Consolas,monospace;background:var(--sf-soft);padding:1px 5px;border-radius:3px}',
    '.sf-form textarea.sf-input{height:auto;padding:6px 2px;line-height:1.75;resize:vertical;border-bottom:1px solid var(--sf-line2)}',
    '.sf-plist{display:flex;flex-direction:column}',
    '.sf-pmainbtn{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px;border:0;background:none;text-align:left;cursor:pointer;padding:0;font:inherit;color:inherit}',
    '.sf-pmainbtn b{font-size:13px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.sf-pmainbtn span{font-size:11px;color:var(--sf-sub)}',
    '.sf-pmainbtn:hover b{color:var(--sf-acc)}'
    ].join('')

  /* ============================================================
   * 11. 注册
   * ------------------------------------------------------------
   * 只注册一个工具页：五个视图共享同一份"当前题目 + 当前练习"，拆成多页要把会话状态
   * 塞进 ctx.keep 再读回来，得不偿失（费曼晶体同款取舍）。
   * ============================================================ */
  let api = {
    id: TOOL_ID,
    name: '采分点熔炉',
    version: VERSION,
    author: 'kaoyan-v2',
    desc: '主观题按「采分点」练：AI 拆点 → 限时写 → 逐点判定 → 漏点画像 → 按站点 SRS 复练。得分自动写入站内掌握度热力图，低分自动进错题本。',
    tools: [
      /* 【v1.1】模块图标换品牌砖（朱砂→赭石渐变 + 白印章），与页眉同款字形 */
      { id: TOOL_ID, title: '采分点熔炉', icon: MARK_TILE, mount: mountShell }
    ],
    panels: [
      {
        id: 'sf-today',
        title: '采分点熔炉 · 今日',
        icon: MARK_TILE,
        width: 300,
        height: 260,
        render: function (ctx) {
          let qs = loadQs(ctx)
          let as = loadAs(ctx)
          let due = dueList(qs, todayKey())
          let k = kpiOf({ qs: qs, as: as }, ctx)
          let out = ['<div class="sf-panel">']
          out.push('<div class="sf-panel-kpis">'
            + '<div><b>' + due.length + '</b><span>待复练</span></div>'
            + '<div><b>' + k.today + '/' + k.goal + '</b><span>今日</span></div>'
            + '<div><b>' + (k.hit || '—') + '</b><span>均分</span></div>'
            + '</div>')
          if (!qs.length) out.push('<div class="sf-panel-empty">还没有主观题。打开「采分点熔炉」，从错题本导入最快。</div>')
          else if (!due.length) out.push('<div class="sf-panel-empty ok">今天没有到期的复练。</div>')
          else {
            out.push('<div class="sf-panel-list">')
            for (let i = 0; i < Math.min(4, due.length); i++) {
              let q = due[i]
              out.push('<div class="sf-panel-row"><i style="background:' + subjectColor(q.subject) + '"></i>'
                + '<span>' + esc(shortTitle(q.stem, 16)) + '</span>'
                + '<em>第 ' + (q.box || 1) + ' 盒</em></div>')
            }
            out.push('</div>')
          }
          out.push('<div class="sf-panel-foot">打开工具页「采分点熔炉」开始</div></div>')
          return out.join('')
        }
      }
    ],
    config: [
      { key: 'pointCount', label: 'AI 拆几个采分点', type: 'number', default: 5 },
      { key: 'strict', label: '判定严格度', type: 'select', default: '标准', options: ['宽松', '标准', '严格'] },
      { key: 'dailyGoal', label: '每日练几道（目标）', type: 'number', default: 2 },
      { key: 'toMistakes', label: '低分自动进错题本', type: 'bool', default: true }
    ],
    /* 教练可查：不用用户复述"我老漏什么"，直接给数据 */
    queries: [
      {
        key: 'leak', label: '主观题漏点画像',
        run: function (ctx) {
          let as = loadAs(ctx)
          if (!as.length) return '还没有主观题练习记录。'
          let prof = leakProfile(loadQs(ctx), as)
          let parts = []
          for (let i = 0; i < prof.length; i++) {
            if (!prof[i].seen) continue
            parts.push(prof[i].label + ' 漏 ' + prof[i].missed + '/' + prof[i].seen + '（' + prof[i].rate + '%）')
          }
          return '主观题共练 ' + as.length + ' 次。漏点：' + parts.join('；') + '。'
        }
      },
      {
        key: 'due', label: '待复练的主观题',
        run: function (ctx) {
          let due = dueList(loadQs(ctx), todayKey())
          if (!due.length) return '今天没有到期的主观题复练。'
          return '今天有 ' + due.length + ' 道主观题待复练：' + due.slice(0, 3).map(function (q) { return shortTitle(q.stem, 18) }).join('；') + '。'
        }
      }
    ],
    shortcuts: [
      {
        key: 'alt+s',
        run: function (ctx) {
          try {
            if (ctx && ctx.api && ctx.api.goTool) ctx.api.goTool(TOOL_ID)
            else if (window.App) window.App.go(TOOL_ID)
          } catch (e) { /* 忽略 */ }
        }
      }
    ],
    init: function (ctx) {
      /* 【2026-10-22 站内适配 · 补注册环节】两条业务场景登记进 AI 注册表，
       * 否则「AI 参数中心」里看不到它们、配置对它们无效、用量全落 `__none` 桶。
       * 拆点与判定都给 think：拆点错了后面全错，判定是最容易幻觉的一步（要求逐点保守裁决）。 */
      try {
        if (ctx.ai && typeof ctx.ai.registerCtx === 'function') {
          ctx.ai.registerCtx({
            ctx: AI_CTX_POINTS,
            name: '采分点熔炉 · 拆采分点',
            desc: '按科目/题型把一道题拆成带权重的采分点（读不懂就少拆，不许编造参考答案里没有的点）',
            def: 'think', latexNeed: false, tools: 'none', recall: false
          })
          ctx.ai.registerCtx({
            ctx: AI_CTX_JUDGE,
            name: '采分点熔炉 · 逐点判定',
            desc: '把学生答案对到每个采分点上判命中/半对/漏（读不懂就写无法判断，不许抬分）',
            def: 'think', latexNeed: false, tools: 'none', recall: false
          })
        }
      } catch (e) { /* 注册失败不影响手动模式 */ }
      try {
        ctx.log('采分点熔炉 v' + VERSION + ' 就绪（题库 ' + loadQs(ctx).length + ' 道，AI ' + (aiOk(ctx) ? '可用' : '未配置→手动模式') + '）')
      } catch (e) { /* 忽略 */ }
    },
    css: CSS
  }

  /* 调试钩子（仅站点显式打开时暴露）：纯判据挂出来给单测打 */
  if (window.__SF_DEBUG__) {
    window.__sfInternals = {
      normalizeWeights: normalizeWeights,
      scoreAttempt: scoreAttempt,
      verdictOf: verdictOf,
      leakProfile: leakProfile,
      subjectHitRate: subjectHitRate,
      streakOf: streakOf,
      guessKind: guessKind,
      kindMeta: kindMeta,
      normQuestion: normQuestion,
      normAttempt: normAttempt,
      dueList: dueList,
      mistakesAsQuestions: mistakesAsQuestions,
      judgeUser: judgeUser,
      pointsUser: pointsUser,
      KINDS: KINDS,
      TOOL_ID: TOOL_ID,
      CSS_LEN: CSS.length
    }
  }

  PluginBus.register(api)
})()
