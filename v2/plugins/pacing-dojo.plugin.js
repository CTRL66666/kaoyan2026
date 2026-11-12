/* ============================================================
 * pacing-dojo.plugin.js — 时钟道场（单文件插件）· v1.0.0
 * ------------------------------------------------------------
 * 干什么：考场时间策略训练。九个现有插件都在练「会不会做」，这里练的是
 *         考场上更要命的一件事——**每题该花多少时间、什么时候止损**。
 *
 * 三个确定性内核（零 AI 也能全程跑）：
 *   · 策略实验室：题型结构 + 目标分 → 单题时间预算表 + 最少做对矩阵
 *     （保底/争取/冲击三档，分数学一/数二/英语/408 模板，可自定义）；
 *   · 模拟限时赛：从站内题库（或内置示范题）抽题，每题有预算红线，
 *     「作答/蒙一个/跳过」三键决策，逐题记录用时与结果；
 *   · 决策复盘：paceScore 把「超时恋战、蒙中、跳后后悔」折算成一个
 *     0-100 的策略分，回放时间轴指出最亏的那道题。
 * AI 只做锦上添花：训练后的教练点评（plugin.pacing-dojo.review），
 * 未配置时退回确定性建议文本，功能不残缺。
 *
 * 工程纪律（与站内八插件同一套）：
 *   · 零外部依赖，只用 ctx.* 公开契约；模块级函数不引用挂载作用域（scope-hygiene）；
 *   · 类名全带 pd- 前缀；样式走 ctx.css.add('skin')（绕 manifest 20K 截断），
 *     主题令牌三套（日/夜鎏金/金色）一处声明；
 *   · 计时器 tick 只做**局部 DOM 更新**（指针 transform + 数字），不整屏重绘
 *     ——这是 formula-vault 745ms 长任务换来的教训；
 *   · 在场进度落 ctx.keep（单槽、不进云），切页回来能续；
 *   · 快捷键在输入框聚焦时让位、弹窗开着时让位（copilot 键盘纪律）。
 *
 * 安装：插件中心 → 市场「时钟道场」，或「粘贴导入」选择本文件。
 * ============================================================ */
;(function () {
  'use strict'

  /* ════════════════════════ 0. 常量与元信息 ════════════════════════ */

  let VERSION = '1.1.1'
  let T_MAIN = 'pacing-dojo'
  let STYLE_ID = 'pd-skin-style'
  let AI_CTX_REVIEW = 'plugin.pacing-dojo.review'

  let SESSION_MAX = 60           // 训练会话上限（云同步闸门）
  let Q_PER_RUN = 10             // 每场默认题量（可在配置调 5-15）
  let KEEP_RUN = 'pdRun'         // 在场进度单槽（ctx.keep）

  /* 题型结构模板：n=题量，v=每题分值，sec=官方参考单题秒 —— 只描述**结构**，
   * 不假设具体科目内容；用户可在此基础上改。 */
  let PLAN_TEMPLATES = [
    { k: 'math-choice', name: '数学单选', qs: [
      { kind: '选择', n: 10, v: 5, sec: 120 },
      { kind: '填空', n: 6, v: 5, sec: 90 },
      { kind: '解答', n: 6, v: 10, sec: 240 },
    ], total: 150, mins: 180 },
    { k: 'math1-pro', name: '数一 题面（含线代概率）', qs: [
      { kind: '选择', n: 10, v: 5, sec: 110 },
      { kind: '填空', n: 6, v: 5, sec: 80 },
      { kind: '解答', n: 9, v: 11, sec: 250 },
    ], total: 150, mins: 180 },
    { k: 'eng', name: '英语一', qs: [
      { kind: '阅读', n: 20, v: 2, sec: 100 },
      { kind: '新题型', n: 5, v: 2, sec: 70 },
      { kind: '翻译', n: 1, v: 10, sec: 600 },
      { kind: '作文', n: 2, v: 20, sec: 1500 },
    ], total: 100, mins: 180 },
    { k: 'pol', name: '政治', qs: [
      { kind: '单选', n: 16, v: 1, sec: 55 },
      { kind: '多选', n: 17, v: 2, sec: 110 },
      { kind: '分析', n: 5, v: 10, sec: 900 },
    ], total: 100, mins: 180 },
    { k: '408', name: '408 选择+综合', qs: [
      { kind: '选择', n: 80, v: 2, sec: 60 },
      { kind: '综合', n: 7, v: 15, sec: 480 },
    ], total: 240, mins: 180 },
  ]

  /* 内置示范题库（12 条数学单选，带难度标签）——站内题库为空时的兜底，
   * 保证「装了就能立刻练」，不依赖 AI、不依赖用户已有数据。 */
  let DEMO_BANK = [
    { id: 'dm1', d: 1, s: '设 $f(x)=x^2-2x+3$，则 $f(2)$ 的值为（　）', o: ['$1$', '$3$', '$5$', '$7$'], a: 1, why: '直接代入 $4-4+3=3$。' },
    { id: 'dm2', d: 1, s: '$\\lim\\limits_{x\\to 0}\\dfrac{\\sin 3x}{x}=$（　）', o: ['$0$', '$1$', '$3$', '不存在'], a: 2, why: '等价无穷小 $\\sin 3x\\sim 3x$。' },
    { id: 'dm3', d: 1, s: '函数 $y=|x|$ 在 $x=0$ 处（　）', o: ['可导', '连续但不可导', '不连续', '极限不存在'], a: 1, why: '左右导数 $\\pm1$ 不相等，但连续。' },
    { id: 'dm4', d: 2, s: '级数 $\\sum\\limits_{n=1}^{\\infty}\\dfrac{1}{n^p}$ 当（　）时收敛', o: ['$p>0$', '$p\\ge 1$', '$p>1$', '$p<1$'], a: 2, why: 'p 级数判据，$p>1$ 收敛。' },
    { id: 'dm5', d: 2, s: '设 $A$ 为 3 阶矩阵，$|A|=2$，则 $|2A^{-1}|=$（　）', o: ['$1$', '$2$', '$4$', '$8$'], a: 1, why: '$|2A^{-1}|=2^3/|A|=8/2=4$？不——$|kA|=k^n|A|$，$|A^{-1}|=1/2$，得 $8\\times\\frac12=4$。' },
    { id: 'dm6', d: 2, s: '微分方程 $y\'-2y=0$ 的通解是（　）', o: ['$y=Ce^{-2x}$', '$y=Ce^{2x}$', '$y=C\\sin 2x$', '$y=2x+C$'], a: 1, why: '特征根 $r=2$。' },
    { id: 'dm7', d: 3, s: '设随机变量 $X\\sim N(1,4)$，则 $P(X<1)=$（　）', o: ['$0.1$', '$0.3$', '$0.5$', '$0.9$'], a: 2, why: '正态分布关于均值对称。' },
    { id: 'dm8', d: 3, s: '$\\int_0^{+\\infty} e^{-x}dx=$（　）', o: ['$0$', '$\\dfrac12$', '$1$', '发散'], a: 2, why: '原函数 $-e^{-x}$，代入得 1。' },
    { id: 'dm9', d: 3, s: '向量组 $\\alpha_1=(1,0),\\alpha_2=(2,0),\\alpha_3=(0,1)$ 的秩为（　）', o: ['1', '2', '3', '0'], a: 1, why: '$\\alpha_2=2\\alpha_1$，极大无关组含 2 个。' },
    { id: 'dm10', d: 2, s: '函数 $f(x)=x^3-3x$ 的极小值点是（　）', o: ['$x=-1$', '$x=0$', '$x=1$', '$x=3$'], a: 2, why: '$f\'=3x^2-3$，$x=1$ 处二阶导正。' },
    { id: 'dm11', d: 1, s: '当 $x\\to 0$ 时，$x-\\sin x$ 是 $x$ 的（　）', o: ['等价无穷小', '同阶非等价', '高阶无穷小', '低阶无穷小'], a: 2, why: '$x-\\sin x\\sim x^3/6$。' },
    { id: 'dm12', d: 3, s: '设 $A$ 为 3 阶实对称矩阵，特征值为 $1,2,-3$，则 $A$（　）', o: ['正定', '负定', '不定', '半正定'], a: 2, why: '特征值有正有负。' },
  ]

  /* ════════════════════════ 1. 小工具（模块作用域，自包含） ════════════════════════ */

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
    })
  }
  function num(v, d) { let n = Number(v); return isFinite(n) ? n : d }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, num(v, a), b === undefined ? Infinity : b)) }
  function dkey(t) { let d = t == null ? new Date() : new Date(t); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') }
  function flat(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim() }
  function trunc(s, n) {
    s = String(s == null ? '' : s)
    if (s.length <= n) return s
    let cut = s.slice(0, n)
    if ((cut.match(/\$/g) || []).length % 2 === 1) cut = cut.slice(0, cut.lastIndexOf('$'))
    if (cut.endsWith('\\')) cut = cut.slice(0, -1)
    return cut.trim() + '…'
  }
  function hashStr(s) { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return h >>> 0 }
  function shuffle(a) {
    a = a.slice()
    for (let i = a.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); let t = a[i]; a[i] = a[j]; a[j] = t
    }
    return a
  }
  /* 【2026-11-06 解剖截图揪出的第二坑】不能用 ′ ″（U+2032/2033 prime）：
   * 站点 texauto 把它们当数学定界符——"用时 0″ / 预算 1′50″" 两个 prime 成对，
   * 中间文字被渲染成乱码 KaTeX（解剖探针实测）。时间一律写「秒/分」汉字。 */
  function fmtSec(s) {
    s = Math.max(0, Math.round(num(s, 0)))
    if (s < 60) return s + ' 秒'
    let m = Math.floor(s / 60), r = s % 60
    return r ? m + ' 分 ' + r + ' 秒' : m + ' 分'
  }

  /* ════════════════════════ 2. 数据层（ctx.data + 归一） ════════════════════════ */

  function normSession(s) {
    if (!s || typeof s !== 'object') return null
    let qs = (Array.isArray(s.qs) ? s.qs : []).slice(0, 30).map(function (q) {
      if (!q || typeof q !== 'object') return null
      let act = ['ans', 'guess', 'skip'].indexOf(String(q.act)) >= 0 ? String(q.act) : 'ans'
      return {
        id: String(q.id || 'q').slice(0, 24),
        sec: clamp(num(q.sec, 0), 0, 3600),
        budget: clamp(num(q.budget, 0), 0, 3600),
        act: act,
        ok: !!q.ok,
        d: clamp(num(q.d, 2), 1, 3),
      }
    }).filter(Boolean)
    if (!qs.length) return null
    return {
      id: String(s.id || ('pd-' + Date.now().toString(36))).slice(0, 24),
      at: clamp(num(s.at, Date.now()), 1, Infinity),
      tpl: String(s.tpl || '').slice(0, 20),
      goal: clamp(num(s.goal, 0), 0, 300),
      score: clamp(num(s.score, paceScore(qs).score), 0, 100),
      qs: qs,
      note: String(s.note || '').slice(0, 200),
    }
  }
  function sessionsGet(ctx) {
    let arr = null
    try { arr = ctx.data('pdSessions') } catch (e) { return [] }
    if (!Array.isArray(arr)) return []
    return arr.map(normSession).filter(Boolean).slice(0, SESSION_MAX)
  }
  function sessionsSave(ctx, list) {
    let out = (list || []).slice(0, SESSION_MAX)
    try { ctx.data('pdSessions', out) } catch (e) { /* 隐私模式内存继续 */ }
    return out
  }

  /* ════════════════════════ 3. 策略引擎（纯函数，测试直验） ════════════════════════ */

  /**
   * solvePlan：目标分 → 时间预算表 + 最少做对矩阵。
   * 模型（确定性、可解释）：
   *   · 每题型按「分值降序」排答题顺序直觉（先高分稳分），预算 = 总时长 × 该型总分占比 × 宽容系数；
   *   · 保底档：优先「便宜的分」（每分值耗时最少）凑到 floorScore；
   *   · 矩阵：对每个目标分线，贪心按 分值/耗时 比从高往低累计，得出各题型最少做对数。
   * 返回 {rows:[{kind,n,v,sec,budget,ratio}], matrix:[{line,need:[{kind,needN}],reach}], warn}
   */
  function solvePlan(tpl, goalScore) {
    if (!tpl || !Array.isArray(tpl.qs) || !tpl.qs.length) return null
    let totalSec = clamp(num(tpl.mins, 180), 30, 300) * 60
    let total = clamp(num(tpl.total, 100), 10, 500)
    let goal = clamp(num(goalScore, Math.round(total * 0.6)), 0, total)
    let avail = totalSec * 0.92   /* 8% 涂卡、翻卷、发呆的「人性税」 */
    /* 【2026-11-12 巡检修核心 bug】旧版预算纯按「分值占比」分时间，把模板里每题声明的
     * sec（选择 120s / 填空 90s…）整个忽略——结果同分值的题型预算一模一样，
     * 「分/百秒」全相等，effOrder 沦为空排序，「先做便宜的题」这套策略名存实亡。
     * 正确口径：预算 = 每题预估耗时，再整体缩放到 92% 可用时间内。这样 分值/耗时
     * 效率才有差异，贪心矩阵才会优先锁定「单位时间最便宜」的题型。 */
    let sumV = 0
    let rawSum = 0
    tpl.qs.forEach(function (q) {
      sumV += q.n * q.v
      rawSum += q.n * clamp(num(q.sec, 60), 15, 3600)
    })
    let scale = rawSum > 0 ? avail / rawSum : 1
    let rows = tpl.qs.map(function (q) {
      let est = clamp(num(q.sec, 60), 15, 3600)
      let budget = Math.max(15, Math.round(est * scale))
      return { kind: q.kind, n: q.n, v: q.v, sec: est, budget: budget, perValue: q.v ? budget / q.v : budget }
    })
    /* 最少做对矩阵：按「每秒分值」贪心 */
    let byEff = rows.slice().sort(function (a, b) { return (b.v / b.budget) - (a.v / a.budget) })
    let lines = [0.4, 0.6, 0.8, 1].map(function (r) { return Math.round(total * r) }).filter(function (v, i, a) { return a.indexOf(v) === i })
    let matrix = lines.map(function (line) {
      let need = []
      let acc = 0
      for (let i = 0; i < byEff.length && acc < line; i++) {
        let rw = byEff[i]
        let maxScore = rw.n * rw.v
        let take = Math.min(maxScore, line - acc)
        let needN = Math.ceil(take / rw.v)
        if (needN > 0) { acc += needN * rw.v; need.push({ kind: rw.kind, needN: Math.min(needN, rw.n), n: rw.n, v: rw.v }) }
      }
      return { line: line, need: need, reach: acc >= line }
    })
    let warn = ''
    if (goal > sumV * 0.9) warn = '目标接近满分：策略上必须放弃「全部做完」，按预算表果断跳。'
    return { rows: rows, matrix: matrix, goal: goal, total: total, totalSec: totalSec, warn: warn, effOrder: byEff.map(function (r) { return r.kind }) }
  }

  /**
   * paceScore：一场训练 → 策略分（0-100）+ 明细。
   * 扣分模型（全部可解释、可复算）：
   *   · 恋战：act=ans 且 sec>budget×1.4 → 每题扣 min(12, 超出比例×10)；
   *   · 错而不短：答错的题 sec>budget → 额外扣 6（错了还花光预算最亏）；
   *   · 蒙中：+8/题（上限 24）——蒙是预算内的正当战术；
   *   · 跳后无回访意识：skip 且该题简单（d=1）→ 扣 5（简单题不该跳）；
   *   · 基础分 100，按题数归一。
   */
  function paceScore(qs) {
    let n = qs.length || 1
    let over = 0, wrongOver = 0, guessHit = 0, dumbSkip = 0, right = 0, secs = 0, budgets = 0
    qs.forEach(function (q) {
      secs += q.sec; budgets += q.budget || q.sec
      if (q.act === 'ans') {
        if (q.ok) right++
        if (q.budget > 0 && q.sec > q.budget * 1.4) over += Math.min(12, Math.round(((q.sec - q.budget) / Math.max(1, q.budget)) * 10))
        if (!q.ok && q.budget > 0 && q.sec > q.budget) wrongOver++
        if (q.d === 1 && !q.ok && q.sec > q.budget * 1.4) dumbSkip += 0
      } else if (q.act === 'guess') {
        if (q.ok) guessHit++
      } else if (q.act === 'skip') {
        if (q.d === 1) dumbSkip++
      }
    })
    let raw = 100 - over - wrongOver * 6 - Math.min(15, dumbSkip * 5) + Math.min(24, guessHit * 8)
    let score = clamp(Math.round(raw), 0, 100)
    return { score: score, right: right, over: over, wrongOver: wrongOver, guessHit: guessHit, dumbSkip: dumbSkip, secs: secs, budgets: budgets, n: n }
  }

  /** 确定性建议（AI 不可用时的兜底，也是 AI 的输入摘要） */
  function adviceFor(qs, plan) {
    let p = paceScore(qs)
    let out = []
    if (p.over >= 20) out.push('恋战是主要失分：有题超预算 40% 以上还没止损。给自己立规矩——红线一到，先蒙后跳。')
    if (p.wrongOver >= 1) out.push('答错还花光预算的题有 ' + p.wrongOver + ' 道：错就错了，时间不该陪葬。')
    if (p.dumbSkip >= 2) out.push('简单题也跳了 ' + p.dumbSkip + ' 道：跳过要留给「看了 30 秒没思路」的题，不是留给「懒得算」。')
    if (p.guessHit > 0) out.push('蒙中 ' + p.guessHit + ' 道——蒙是战术不是赌博，预算耗尽时三长一短选最短的直觉可以信。')
    if (!out.length) out.push(p.score >= 85 ? '节奏很好：预算内完成、止损果断。把难度提到更硬的题组继续压。' : '没有明显恋战，但正确率还有空间——策略稳了之后，题源换难一档。')
    if (plan && plan.rows && plan.rows.length) {
      let slowest = plan.rows.slice().sort(function (a, b) { return (b.perValue - a.perValue) })[0]
      if (slowest) out.push('你卷面上最贵的是「' + slowest.kind + '」：每题 ' + fmtSec(slowest.budget) + ' 才换 ' + slowest.v + ' 分，时间都从它身上省。')
    }
    return out
  }

  /** 习惯聚合（跨会话）：教练与账本共用 */
  function habitsOf(sessions) {
    if (!sessions || !sessions.length) return null
    let n = sessions.length
    let scoreSum = 0, overCnt = 0, guessCnt = 0, guessHit = 0, skipCnt = 0, qTotal = 0, rightTotal = 0
    let byKind = {}
    sessions.forEach(function (s) {
      scoreSum += s.score
      s.qs.forEach(function (q) {
        qTotal++; if (q.ok) rightTotal++
        if (q.budget > 0 && q.sec > q.budget * 1.4) overCnt++
        if (q.act === 'guess') { guessCnt++; if (q.ok) guessHit++ }
        if (q.act === 'skip') skipCnt++
      })
    })
    return {
      n: n, avgScore: Math.round(scoreSum / n),
      overRate: qTotal ? Math.round(overCnt / qTotal * 100) : 0,
      guessRate: qTotal ? Math.round(guessCnt / qTotal * 100) : 0,
      guessHitRate: guessCnt ? Math.round(guessHit / guessCnt * 100) : null,
      skipRate: qTotal ? Math.round(skipCnt / qTotal * 100) : 0,
      rightRate: qTotal ? Math.round(rightTotal / qTotal * 100) : 0,
    }
  }

  /** 题源适配：站内错题 → 训练题（选择题、有答案下标或字母） */
  function adaptMistake(m, i) {
    if (!m || typeof m !== 'object') return null
    let stem = flat(m.stem || m.desc || '')
    if (stem.length < 6) return null
    let raw = Array.isArray(m.options) ? m.options : null
    if (!raw || raw.length < 2 || raw.length > 6) return null
    let o = raw.map(function (x) { return flat(x) }).filter(Boolean)
    if (o.length < 2) return null
    let a = -1
    let ans = m.answer
    if (typeof ans === 'number' && ans >= 0 && ans < o.length) a = ans
    else {
      let t = String(ans == null ? '' : ans).trim().toUpperCase()
      if (/^[A-H]/.test(t)) { let idx = 'ABCDEFGH'.indexOf(t[0]); if (idx >= 0 && idx < o.length) a = idx }
    }
    if (a < 0) return null
    let d = m.difficulty === 'easy' ? 1 : (m.difficulty === 'hard' ? 3 : 2)
    return { id: 'mk' + hashStr(String(m.dedupKey || m.id || stem.slice(0, 30))).toString(36).slice(0, 8), s: o.length ? stem : '', o: o, a: a, d: d, why: flat(m.solution || m.explain || '') }
  }

  /* ════════════════════════ 4. 样式（ctx.css.add 单例注入） ════════════════════════ */

  let CSS = [
    /* 令牌：root + 模态层 + 面板三声明（弹窗挂 body、面板挂 .plg-panel-b，
     * 少了谁谁的 var(--pd-*) 就悬空——2026-11-12 巡检面板截图发灰就是只写了 root/modal） */
    '.pd-root,.pd-modal,.pd-panel{--pd-acc:#1f7a5c;--pd-acc2:#2fa57f;--pd-gold:#c9932c;--pd-ink:var(--text-primary,#1e2a4a);'
      + '--pd-sub:var(--text-muted,#7c8aa8);--pd-ink2:var(--text-secondary,#4a5670);--pd-line:var(--line,#d8dde8);'
      + '--pd-bg:var(--surface,#fff);--pd-soft:var(--surface-muted,#f6f8fc);--pd-ok:var(--ok,#0f7c4a);'
      + '--pd-warn:var(--warn,#c47615);--pd-danger:var(--danger,#d83b3b);--pd-on-acc:#fff;--pd-acc-text:var(--pd-acc);--pd-ink-gold:#2b1d05;'
      + '--pd-ease:cubic-bezier(.22,.8,.26,1)}',
    'html[data-theme="night"] .pd-root,html[data-theme="night"] .pd-modal,html[data-theme="night"] .pd-panel{'
      + '--pd-acc:var(--nk-acc,#f0b95a);--pd-acc2:#e2a43f;--pd-gold:#f0b95a;--pd-on-acc:var(--nk-acc-ink,#2a1c04);--pd-acc-text:var(--nk-acc,#f0b95a)}',
    'html[data-theme="gold"] .pd-root,html[data-theme="gold"] .pd-modal,html[data-theme="gold"] .pd-panel{'
      + '--pd-acc:#b45309;--pd-acc2:#d9820a;--pd-on-acc:#fff;--pd-acc-text:#9a5407}',
    /* 品牌砖：墨绿表盘 + 金指针（夜间令牌自动跟随） */
    '.pd-mark{width:42px;height:42px;border-radius:12px;flex:0 0 auto;display:grid;place-items:center;'
      + 'color:var(--pd-on-acc);background:linear-gradient(135deg,var(--pd-acc),var(--pd-acc2));'
      + 'box-shadow:0 8px 18px -8px color-mix(in srgb,var(--pd-acc) 70%,transparent)}',
    '.pd-mark svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round}',
    /* root 出血 + 吸顶页眉（与原生模块同机制：root 撑满、hero sticky、无 overflow 祖先） */
    '.pd-root{color:var(--pd-ink);font:14px/1.65 "PingFang SC","Microsoft YaHei",system-ui,sans-serif;'
      + 'margin:calc(var(--vp-t,16px)*-1) calc(var(--vp-x,16px)*-1) calc(var(--vp-b,24px)*-1);'
      + 'min-height:calc(100vh - 59px);display:flex;flex-direction:column;background:var(--pd-soft)}',
    '.pd-hero{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:14px;flex-wrap:wrap;'
      + 'padding:15px calc(var(--vp-x,16px) + max(6px,(100% - var(--pd-w,1120px))/2)) 13px;background:transparent;'
      + 'transition:padding .3s var(--pd-ease),background-color .3s,box-shadow .3s}',
    '.pd-hero.stuck{background:color-mix(in srgb,var(--pd-bg) 88%,transparent);backdrop-filter:blur(14px);'
      + '-webkit-backdrop-filter:blur(14px);box-shadow:0 10px 26px -22px rgba(15,25,45,.5);padding-top:9px;padding-bottom:8px}',
    '.pd-brand{display:flex;align-items:center;gap:12px;min-width:0}',
    '.pd-brandtx{display:flex;flex-direction:column;min-width:0}',
    '.pd-kicker{font:700 9.5px/1 ui-monospace,Consolas,monospace;letter-spacing:.22em;color:var(--pd-sub);text-transform:uppercase}',
    '.pd-brandtx b{font-size:19px;font-weight:800;letter-spacing:.01em}',
    '.pd-brandtx b em{font-style:normal;font-size:10px;font-weight:700;color:var(--pd-sub);margin-left:6px;'
      + 'vertical-align:2px;border:1px solid var(--pd-line);border-radius:6px;padding:1px 6px}',
    '.pd-kpis{display:flex;gap:8px;margin-left:auto;flex-wrap:wrap}',
    '.pd-kpi{display:flex;flex-direction:column;align-items:center;min-width:56px;padding:0 10px}'
      + 'border-left:1px solid var(--pd-line)}',
    '.pd-kpi b{font-size:17px;font-weight:800;line-height:1.2}',
    '.pd-kpi b em{font-style:normal;font-size:10px;color:var(--pd-sub);font-weight:600}',
    '.pd-kpi i{font-style:normal;font-size:9px;letter-spacing:.08em;color:var(--pd-sub)}',
    '.pd-kpi.ok b{color:var(--pd-ok)}.pd-kpi.warn b{color:var(--pd-warn)}',
    '.pd-topacts{display:flex;gap:8px;align-items:center}',
    '.pd-btn{height:34px;padding:0 16px;border-radius:999px;border:1px solid var(--pd-line);'
      + 'background:var(--pd-bg);color:var(--pd-ink);font-weight:700;font-size:13px;cursor:pointer;'
      + 'display:inline-flex;align-items:center;gap:7px;transition:transform .16s,border-color .16s,box-shadow .16s}',
    '.pd-btn:hover{transform:translateY(-1px);border-color:color-mix(in srgb,var(--pd-acc) 45%,var(--pd-line))}',
    '.pd-btn.primary{background:linear-gradient(135deg,var(--pd-acc),var(--pd-acc2));color:var(--pd-on-acc);border:0;'
      + 'box-shadow:0 8px 20px -12px color-mix(in srgb,var(--pd-acc) 90%,transparent)}',
    '.pd-btn.gold{background:linear-gradient(135deg,var(--pd-gold),#a87418);color:var(--pd-ink-gold);border:0}',
    '.pd-btn.ghost{background:none;border-style:dashed}',
    '.pd-btn.sm{height:28px;padding:0 12px;font-size:12px;border-radius:9px}',
    /* 禁用态不用 opacity：深色主题下按钮连文字一起被压成背景色（night-skin 纪律） */
    '.pd-btn:disabled{opacity:1;cursor:not-allowed;color:var(--pd-sub);border-color:var(--pd-line);'
      + 'background:color-mix(in oklab,var(--pd-ink) 6%,transparent);box-shadow:none;transform:none}',
    /* 底部 dock：玻璃胶囊 + 滑动指示（站内 isleDock 同款） */
    '.pd-dockwrap{position:fixed;left:0;right:0;bottom:0;z-index:40;display:flex;justify-content:center;padding:0 14px 12px;pointer-events:none}',
    '.pd-dock{position:relative;display:flex;gap:2px;padding:6px;pointer-events:auto;border-radius:19px;'
      + 'background:color-mix(in srgb,var(--pd-bg) 82%,transparent);backdrop-filter:blur(16px) saturate(1.2);'
      + '-webkit-backdrop-filter:blur(16px) saturate(1.2);border:1px solid var(--pd-line);'
      + 'box-shadow:0 14px 38px -18px rgba(15,23,42,.4)}',
    '.pd-dock-ind{position:absolute;top:6px;bottom:6px;left:6px;width:10px;border-radius:13px;'
      + 'background:color-mix(in srgb,var(--pd-acc) 16%,transparent);'
      + 'transition:transform .32s cubic-bezier(.22,1,.36,1),width .32s cubic-bezier(.22,1,.36,1)}',
    '.pd-dock-item{position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;min-width:76px;'
      + 'padding:8px 14px;border:0;border-radius:13px;background:none;color:var(--pd-sub);font-size:11.5px;'
      + 'font-weight:600;cursor:pointer;transition:color .18s}',
    /* 全局图标纪律（fv 同款教训）：内联 SVG 没有尺寸约束时按 viewBox 默认铺开 ——
     * 实测 verdict 里的 × 图标撑到 912px 把卡片拉成 984px 高。所有出图标的容器钉死尺寸。 */
    '.pd-btn svg,.pd-verdict svg,.pd-empty .ico svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.9;flex:0 0 auto}',
    '.pd-dock-item svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.7}',
    '.pd-dock-item.on{color:var(--pd-acc-text)}',
    /* nowrap 必须打在基线规则上：dock 宽度由内容定，CJK 串的 min-content 是 1 个字——
     * 不给 nowrap，flex 压缩时「实验室」会竖排（2026-11-12 巡检同款病，pw 实拍）。 */
    '.pd-dock-item em{font-style:normal;white-space:nowrap}',
    '.pd-stage{width:100%;max-width:var(--pd-w,1120px);margin:0 auto;padding:6px var(--vp-x,16px) 152px;flex:1}',
    /* 卡片与进场 */
    '.pd-card{background:var(--pd-bg);border:1px solid var(--pd-line);border-radius:16px;padding:18px 20px;'
      + 'margin-bottom:14px;box-shadow:0 1px 2px rgba(16,30,60,.04)}',
    '.pd-enter .pd-card{animation:pdRise .45s var(--pd-ease) both}',
    '@keyframes pdRise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}',
    '.pd-card-h{display:flex;align-items:baseline;gap:10px;padding-bottom:9px;margin-bottom:14px;border-bottom:1px solid var(--pd-line)}',
    '.pd-card-h b{font-size:15.5px;font-weight:800}',
    '.pd-card-h em{font-style:normal;font-size:11.5px;color:var(--pd-sub)}',
    '.pd-quiet{font-size:12px;color:var(--pd-sub);line-height:1.7}',
    '.pd-acts{display:flex;gap:9px;flex-wrap:wrap;margin-top:12px}',
    '.pd-seg{display:inline-flex;max-width:100%;overflow-x:auto;scrollbar-width:none;background:var(--pd-soft);'
      + 'border:1px solid var(--pd-line);border-radius:11px;padding:3px;gap:2px}',
    '.pd-seg button{border:0;background:none;font:600 12px/1 inherit;padding:7px 12px;border-radius:8px;cursor:pointer;color:var(--pd-ink2);white-space:nowrap}',
    '.pd-seg button.on{background:var(--pd-bg);color:var(--pd-ink);box-shadow:0 1px 4px rgba(16,30,60,.12)}',
    /* 表盘 */
    '.pd-clockwrap{display:flex;align-items:center;gap:22px;flex-wrap:wrap}',
    '.pd-clock{width:150px;height:150px;flex:0 0 auto}',
    '.pd-clock .face{fill:var(--pd-bg);stroke:var(--pd-line);stroke-width:2}',
    '.pd-clock .tick{stroke:var(--pd-line);stroke-width:2;stroke-linecap:round}',
    '.pd-clock .hand-sec{stroke:var(--pd-gold);stroke-width:2.4;stroke-linecap:round;transform-origin:75px 75px}',
    '.pd-clock .hand-budget{stroke:var(--pd-acc);stroke-width:5;stroke-linecap:round;opacity:.35;transform-origin:75px 75px}',
    '.pd-clock .ring{fill:none;stroke:var(--pd-acc);stroke-width:5;stroke-linecap:round;transform:rotate(-90deg);transform-origin:75px 75px;transition:stroke-dashoffset .2s linear}',
    '.pd-clock .ring.over{stroke:var(--pd-danger)}',
    '.pd-clock .hub{fill:var(--pd-ink)}',
    '.pd-clocktext{display:flex;flex-direction:column;gap:4px;min-width:180px}',
    '.pd-bignum{font:800 40px/1 ui-monospace,Consolas,monospace;letter-spacing:.02em}',
    '.pd-bignum.over{color:var(--pd-danger)}',
    '.pd-budgetline{font-size:12px;color:var(--pd-sub)}',
    '.pd-budgetline b{color:var(--pd-acc-text)}',
    /* 题卡与决策 */
    '.pd-qstem{font-size:16px;font-weight:700;line-height:1.85;margin:4px 0 12px}',
    '.pd-qmeta{display:flex;gap:8px;align-items:center;font-size:11.5px;color:var(--pd-sub);margin-bottom:8px}',
    '.pd-dchip{border-radius:999px;padding:2px 9px;font-weight:700;font-size:10.5px;border:1px solid var(--pd-line)}',
    '.pd-dchip.d1{color:var(--pd-ok)}.pd-dchip.d2{color:var(--pd-warn)}.pd-dchip.d3{color:var(--pd-danger)}',
    '.pd-opts{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:6px 0 4px}',
    '.pd-opt{display:flex;gap:8px;align-items:flex-start;text-align:left;border:1px solid var(--pd-line);'
      + 'background:var(--pd-bg);border-radius:11px;padding:10px 12px;cursor:pointer;font-size:13.5px;'
      + 'color:var(--pd-ink);transition:border-color .14s,background .14s;line-height:1.5}',
    '.pd-opt:hover{border-color:var(--pd-acc)}',
    '.pd-opt i{font-style:normal;font-weight:800;color:var(--pd-sub);flex:0 0 auto}',
    '.pd-opt.pick-ok{border-color:var(--pd-ok);background:color-mix(in srgb,var(--pd-ok) 8%,var(--pd-bg))}',
    '.pd-opt.pick-bad{border-color:var(--pd-danger);background:color-mix(in srgb,var(--pd-danger) 7%,var(--pd-bg))}',
    '.pd-opt.showright{border-color:var(--pd-ok)}',
    '.pd-decide{display:flex;gap:9px;flex-wrap:wrap;margin-top:10px}',
    '.pd-verdict{margin-top:10px;padding:10px 12px;border-radius:11px;font-size:12.5px;line-height:1.7;'
      + 'background:var(--pd-soft);border:1px dashed var(--pd-line)}',
    '.pd-verdict b{color:var(--pd-acc-text)}',
    /* 策略表 */
    '.pd-plan{width:100%;border-collapse:collapse;font-size:13px}',
    '.pd-plan th{text-align:left;font-size:11px;color:var(--pd-sub);font-weight:700;padding:6px 8px;border-bottom:1px solid var(--pd-line)}',
    '.pd-plan td{padding:9px 8px;border-bottom:1px solid color-mix(in srgb,var(--pd-line) 55%,transparent)}',
    '.pd-plan td b{font:700 14px/1 ui-monospace,Consolas,monospace}',
    '.pd-gauge{height:7px;border-radius:999px;background:var(--pd-soft);overflow:hidden;margin-top:4px}',
    '.pd-gauge i{display:block;height:100%;background:linear-gradient(90deg,var(--pd-acc),var(--pd-gold));border-radius:999px}',
    '.pd-matrix{display:flex;flex-direction:column;gap:8px;margin-top:10px}',
    '.pd-mrow{display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:9px 12px;border-radius:12px;'
      + 'border:1px solid var(--pd-line);background:var(--pd-bg)}',
    '.pd-mrow.hit{border-color:color-mix(in srgb,var(--pd-ok) 50%,var(--pd-line))}',
    '.pd-mline{font:800 15px/1 ui-monospace,Consolas,monospace;min-width:52px}',
    '.pd-mneed{font-size:12.5px;color:var(--pd-ink2)}',
    '.pd-mtag{margin-left:auto;font-size:10.5px;font-weight:800;color:var(--pd-ok)}',
    /* 回放时间轴 */
    '.pd-tl{margin:8px 0 12px}',
    '.pd-tlseg{cursor:default}',
    '.pd-decision-row{display:flex;gap:10px;align-items:flex-start;padding:9px 4px;border-bottom:1px dashed color-mix(in srgb,var(--pd-line) 60%,transparent);font-size:12.5px}',
    '.pd-decision-row:last-child{border-bottom:0}',
    '.pd-dsec{font:700 12px/1 ui-monospace,Consolas,monospace;min-width:44px;color:var(--pd-ink2)}',
    '.pd-dtag{border-radius:7px;padding:2px 8px;font-size:10.5px;font-weight:800;flex:0 0 auto}',
    '.pd-dtag.ans{background:color-mix(in srgb,var(--pd-acc) 12%,transparent);color:var(--pd-acc-text)}',
    '.pd-dtag.guess{background:color-mix(in srgb,var(--pd-gold) 15%,transparent);color:var(--pd-warn)}',
    '.pd-dtag.skip{background:color-mix(in srgb,var(--pd-sub) 14%,transparent);color:var(--pd-sub)}',
    '.pd-dtag.ok{background:color-mix(in srgb,var(--pd-ok) 13%,transparent);color:var(--pd-ok)}',
    '.pd-dtag.bad{background:color-mix(in srgb,var(--pd-danger) 12%,transparent);color:var(--pd-danger)}',
    /* 账本 */
    '.pd-statgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}',
    '.pd-stat{border:1px solid var(--pd-line);border-radius:13px;padding:12px 14px;background:var(--pd-bg)}',
    '.pd-stat b{display:block;font:800 22px/1.15 ui-monospace,Consolas,monospace}',
    '.pd-stat span{font-size:11.5px;color:var(--pd-sub)}',
    /* 柱宽封顶（2026-11-12 巡检目检：只有 3 场时 flex:1 把柱子拉成 370px 宽的色块，
     * 像坏了的进度条；封顶 56px 并左对齐，场次多时仍自适应变细） */
    '.pd-bars{display:flex;align-items:flex-end;gap:5px;height:96px;margin-top:8px}',
    '.pd-bar{flex:1 1 0;max-width:56px;min-width:8px;border-radius:5px 5px 2px 2px;background:linear-gradient(180deg,var(--pd-acc),var(--pd-acc2));position:relative}',
    '.pd-bar.low{background:linear-gradient(180deg,var(--pd-warn),var(--pd-gold))}',
    '.pd-empty{display:flex;flex-direction:column;align-items:center;gap:10px;padding:34px 12px;color:var(--pd-sub);text-align:center}',
    '.pd-empty .ico{width:44px;height:44px;border-radius:13px;display:grid;place-items:center;'
      + 'background:color-mix(in srgb,var(--pd-acc) 12%,transparent);color:var(--pd-acc-text)}',
    '.pd-empty b{color:var(--pd-ink);font-size:15px}',
    '.pd-keys{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px}',
    '.pd-keyrow{display:flex;gap:10px;align-items:center;font-size:12.5px;color:var(--pd-ink2)}',
    '.pd-keycap{font:700 11px/1 ui-monospace,Consolas,monospace;border:1px solid var(--pd-line);'
      + 'border-bottom-width:2.5px;border-radius:7px;padding:4px 8px;background:var(--pd-bg);color:var(--pd-ink)}',
    /* 模态（宿主 ctx.Modal 之外，本插件确认框用 api.confirm；此处仅内部弹层） */
    '.pd-modal{position:fixed;inset:0;z-index:9000;display:none;place-items:center;padding:22px;'
      + 'background:rgba(10,16,30,.5);backdrop-filter:blur(3px)}',
    '.pd-modal.on{display:grid}',
    '.pd-modal-box{width:min(560px,94vw);max-height:88vh;overflow:auto;background:var(--pd-bg);'
      + 'border:1px solid var(--pd-line);border-radius:17px;padding:20px 22px;box-shadow:0 30px 80px -30px rgba(10,20,40,.5)}',
    /* 常驻面板(插件中心/侧栏渲染,在 root 之外——令牌要自己带) */
    '.pd-panel{font:13px/1.6 "PingFang SC","Microsoft YaHei",system-ui,sans-serif;color:var(--text-primary,#1b2430);padding:2px}',
    '.pd-panel-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}',
    '.pd-panel-kpis div{border-bottom:1px solid var(--line,#e5e7eb);padding:2px 0 6px}',
    '.pd-panel-kpis b{display:block;font-family:Georgia,serif;font-size:20px;line-height:1.2}',
    '.pd-panel-kpis span{font-size:9.5px;letter-spacing:.1em;color:var(--text-muted,#6b7788)}',
    '.pd-panel-list{display:flex;flex-direction:column}',
    '.pd-panel-row{display:flex;align-items:center;gap:8px;font-size:12px;padding:7px 0;border-bottom:1px solid var(--line,#e5e7eb)}',
    '.pd-panel-row b{font-family:Georgia,serif}',
    '.pd-panel-row i{font-style:normal;margin-left:auto;font-size:10.5px}',
    /* 警告字色：站点 --warn 是填充色（#d48806 当文字在白卡只有 2.87:1）——
     * 日间深琥珀 #b45309（5.0:1），夜间才接 --warn（night-skin 纪律） */
    '.pd-panel-row i.warn{color:#b45309}.pd-panel-row i.ok{color:var(--ok,#0f7c4a)}',
    'html[data-theme="night"] .pd-panel-row i.warn{color:var(--warn,#e8ae3f)}',
    '.pd-panel-empty{font-size:12px;color:var(--text-muted,#6b7788);padding:10px 0}',
    /* —— 覆盖层放最后（同特异性后写者胜） —— */
    '@media (max-width:760px){.pd-btn.sm{height:30px}.pd-brandtx b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
      + '.pd-dock-item{min-width:0;flex:1;padding:7px 2px}'
      + '.pd-dock-item em{font-size:9.5px}.pd-brandtx b{font-size:17px}.pd-kicker{display:none}'
      + '.pd-opts{grid-template-columns:1fr}.pd-bignum{font-size:32px}.pd-clock{width:118px;height:118px}'
      /* 390px 巡检（2026-11-12，duel 一字一行同款病）：预算表 6 列挤成竖排单字——
       * 砍掉「每秒分值」列（与节奏条信息重复）、预算列不许折行、节奏条收窄 */
      + '.pd-plan{font-size:11.5px}.pd-plan th,.pd-plan td{padding:6px 4px}'
      + '.pd-plan th:nth-child(5),.pd-plan td:nth-child(5){display:none}'
      + '.pd-plan td:nth-child(4){white-space:nowrap}'
      + '.pd-plan .pd-gauge{width:56px !important}}',
    'html[data-theme="night"] .pd-seg button.on{background:color-mix(in srgb,var(--pd-bg) 70%,transparent)}',
    'html[data-theme="night"] .pd-dock-item.on{filter:brightness(1.8) saturate(.82)}',
  ].join('\n')

  function injectStyles() {
    let host = window.__PD_HOST_CTX
    if (host && host.css && typeof host.css.add === 'function') { host.css.add(CSS, 'skin'); return }
    let st = document.getElementById(STYLE_ID)
    if (st) { if (st.textContent !== CSS) st.textContent = CSS; return }
    st = document.createElement('style')
    st.id = STYLE_ID
    st.textContent = CSS
    document.head.appendChild(st)
  }

  /* ════════════════════════ 5. 图标 ════════════════════════ */

  function I(name) {
    let p = {
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.4 2"/>',
      lab: '<path d="M9 3h6M10 3v5L5 19a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-11V3"/><path d="M7.5 14h9"/>',
      bolt: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/>',
      film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
      chart: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
      gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/>',
      check: '<path d="M4 12.5 9.5 18 20 6.5"/>',
      cross: '<path d="M5 5l14 14M19 5 5 19"/>',
      hand: '<path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1V4.5a1.5 1.5 0 0 1 3 0V11m0-1v-.5a1.5 1.5 0 0 1 3 0V15a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-2.7L4.4 15a1.8 1.8 0 0 1 3-2l1.6 2"/>',
      skip: '<path d="M5 5l9 7-9 7zM19 5v14"/>',
      dice: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.1" fill="currentColor" stroke="none"/><circle cx="15" cy="15" r="1.1" fill="currentColor" stroke="none"/><circle cx="15" cy="9" r="1.1" fill="currentColor" stroke="none"/><circle cx="9" cy="15" r="1.1" fill="currentColor" stroke="none"/>',
      down: '<path d="M12 3v12M6 11l6 6 6-6M4 21h16"/>',
      up: '<path d="M12 21V9M6 13l6-6 6 6M4 3h16"/>',
      bulb: '<path d="M9 18h6M10 21h4M12 2a7 7 0 0 1 4 12.5V16H8v-1.5A7 7 0 0 1 12 2z"/>',
    }[name] || ''
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + p + '</svg>'
  }
  let MARK_TILE = '<span class="pd-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.6"/><path d="M12 7.4V12l3.1 1.9"/><path d="M12 3.4v1.2M20.6 12h-1.2M12 20.6v-1.2M3.4 12h1.2"/></svg></span>'
  /* 【2026-11-12 用户报修：导航图标全空】manifest 的 icon 走 U.rawIcon——白名单只认 SVG 标签，
   * `<span class="pd-mark">` 整棵子树（连里面的 svg）会被消毒器摘光。
   * 页面头图继续用 MARK_TILE（渐变砖靠皮肤），manifest（tools/panels）必须吃**自包含 SVG**
   * （sf/er 同款口径：viewBox+width+height+currentColor，不依赖任何外部 CSS）。 */
  let MARK_ICON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.6"/><path d="M12 7.4V12l3.1 1.9"/><path d="M12 3.4v1.2M20.6 12h-1.2M12 20.6v-1.2M3.4 12h1.2"/></svg>'

  /* ════════════════════════ 6. 视图（模块级，(ctx,S) 入参） ════════════════════════ */

  function kpiOf(ctx, S) {
    let list = S.sessions
    let h = habitsOf(list)
    let today = dkey()
    let todayN = 0
    list.forEach(function (s) { if (dkey(s.at) === today) todayN++ })
    return { n: list.length, avg: h ? h.avgScore : null, today: todayN, over: h ? h.overRate : null }
  }

  function heroHTML(ctx, S) {
    let k = kpiOf(ctx, S)
    return '<header class="pd-hero" data-pd="hero">'
      + '<div class="pd-brand">' + MARK_TILE
      + '<div class="pd-brandtx"><span class="pd-kicker">PACING · DOJO</span>'
      + '<b>时钟道场<em>v' + VERSION + '</em></b></div></div>'
      + '<div class="pd-kpis" data-pd="kpis">'
      + '<span class="pd-kpi"><b>' + (k.today) + '</b><i>今日练场</i></span>'
      + '<span class="pd-kpi' + (k.avg != null && k.avg < 70 ? ' warn' : (k.avg != null ? ' ok' : '')) + '"><b>' + (k.avg == null ? '—' : k.avg) + '</b><i>策略均分</i></span>'
      + '<span class="pd-kpi"><b>' + (k.over == null ? '—' : k.over + '%') + '</b><i>超时率</i></span>'
      + '</div>'
      + '<div class="pd-topacts"><button class="pd-btn primary" data-act="quick" title="按当前策略直接开一场（快捷键 D）">' + I('bolt') + '开练</button></div>'
      + '</header>'
  }

  function viewLab(ctx, S) {
    let tplKey = S.labTpl || 'math-choice'
    let tpl = PLAN_TEMPLATES.filter(function (t) { return t.k === tplKey })[0] || PLAN_TEMPLATES[0]
    let goal = clamp(S.labGoal || 0, 0, tpl.total) || Math.round(tpl.total * 0.6)
    let plan = solvePlan(tpl, goal)
    let out = []
    out.push('<section class="pd-card"><div class="pd-card-h"><b>策略实验室</b><em>目标分 → 每题时间预算，先想好再开考</em></div>')
    out.push('<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:12px">'
      + '<div class="pd-seg" role="tablist">' + PLAN_TEMPLATES.map(function (t) {
        return '<button data-act="lab-tpl" data-k="' + t.k + '" class="' + (t.k === tplKey ? 'on' : '') + '" role="tab">' + esc(t.name) + '</button>'
      }).join('') + '</div>'
      + '<label class="pd-quiet" style="display:flex;gap:8px;align-items:center">目标分'
      + '<input class="pd-input" type="number" min="10" max="' + tpl.total + '" step="5" value="' + goal + '" data-pd="goal" style="width:84px"> / ' + tpl.total + '</label>'
      + '</div>')
    if (plan.warn) out.push('<div class="pd-verdict">' + I('bulb') + ' ' + esc(plan.warn) + '</div>')
    out.push('<table class="pd-plan"><thead><tr><th>题型</th><th>题量</th><th>每题分</th><th>建议预算</th><th>每秒分值</th><th>节奏条</th></tr></thead><tbody>')
    let maxB = 1
    plan.rows.forEach(function (r) { maxB = Math.max(maxB, r.budget) })
    plan.rows.forEach(function (r) {
      let pv = (r.v / r.budget * 100)
      out.push('<tr><td><b style="font-size:13px">' + esc(r.kind) + '</b></td><td>' + r.n + ' 题</td><td>' + r.v + ' 分</td>'
        + '<td><b>' + fmtSec(r.budget) + '</b></td><td>' + pv.toFixed(1) + ' 分/百秒</td>'
        + '<td><div class="pd-gauge" style="width:110px"><i style="width:' + Math.round(r.budget / maxB * 100) + '%"></i></div></td></tr>')
    })
    out.push('</tbody></table>')
    out.push('<div class="pd-quiet" style="margin-top:8px">预算已扣 8%「人性税」（涂卡、翻卷、发呆）。顺序按 分值/耗时 效率排：' + esc(plan.effOrder.join(' → ')) + '</div>')
    out.push('</section>')

    out.push('<section class="pd-card"><div class="pd-card-h"><b>最少做对矩阵</b><em>分数从便宜的地方来——先看哪几块必须拿下</em></div><div class="pd-matrix">')
    plan.matrix.forEach(function (m) {
      let isGoal = m.line === goal || Math.abs(m.line - goal) < 10
      out.push('<div class="pd-mrow' + (m.reach ? ' hit' : '') + '">'
        + '<span class="pd-mline">' + m.line + ' 分</span>'
        + '<span class="pd-mneed">' + (m.need.length ? m.need.map(function (x) { return esc(x.kind) + '做对 <b>' + x.needN + '</b>/' + x.n }).join('、') : '—') + '</span>'
        + (m.reach ? '<span class="pd-mtag">可达</span>' : '<span class="pd-mtag" style="color:var(--pd-warn)">吃紧</span>')
        + '</div>')
      if (isGoal) {}
    })
    out.push('</div><div class="pd-quiet" style="margin-top:8px">读法：想上 ' + goal + ' 分，从上往下把「可达」行的做对数当最低目标——考场上先兑现这些，再谈难题。</div>')
    out.push('<div class="pd-acts"><button class="pd-btn primary" data-act="lab-start">' + I('bolt') + '按这套策略开一场限时赛</button></div>')
    out.push('</section>')
    return out.join('')
  }

  function viewDojo(ctx, S) {
    if (S.run) return dojoRunningHTML(ctx, S)
    let src = S.src || 'bank'
    let bankN = S.bank.length
    let out = []
    out.push('<section class="pd-card"><div class="pd-card-h"><b>训练场</b><em>每题一个预算红线，到线必须做决策</em></div>')
    out.push('<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:12px">'
      + '<div class="pd-seg">'
      + '<button data-act="dojo-src" data-k="bank" class="' + (src === 'bank' ? 'on' : '') + '">站内题库（' + bankN + ' 题可用）</button>'
      + '<button data-act="dojo-src" data-k="demo" class="' + (src === 'demo' ? 'on' : '') + '">内置示范题（12 题）</button>'
      + '</div></div>')
    out.push('<div class="pd-quiet">规则：每题限时 = 策略实验室的预算（没算过就按默认）。三种收场——'
      + '<b>作答</b>（点选项提交）、<b>蒙一个</b>（凭直觉选并记录）、<b>跳过</b>（本轮末尾回访一次，再不会就放弃）。'
      + '跳过不是逃跑，是把时间买给更有把握的题。</div>')
    out.push('<div class="pd-acts"><button class="pd-btn primary" data-act="dojo-start">' + I('clock') + '开始限时训练</button>'
      + '<button class="pd-btn ghost" data-act="goto-lab">' + I('lab') + '先去看策略</button></div>')
    out.push('</section>')
    if (S.resume) {
      out.push('<section class="pd-card"><div class="pd-card-h"><b>上一场没打完</b><em>切页/刷新前留在道场里的进度</em></div>'
        + '<div class="pd-quiet">第 ' + (num(S.resume.idx, 0) + 1) + ' 题 · 已练 ' + (S.resume.qs || []).length + ' 题</div>'
        + '<div class="pd-acts"><button class="pd-btn primary" data-act="resume-yes">继续</button>'
        + '<button class="pd-btn ghost" data-act="resume-no">放弃并重开</button></div></section>')
    }
    return out.join('')
  }

  function dojoRunningHTML(ctx, S) {
    let run = S.run
    let q = run.queue[run.idx]
    if (!q) return viewDojo(ctx, S)
    let budget = run.budgetOf(q)
    let used = run.qSec
    let pct = budget ? Math.min(100, used / budget * 100) : 0
    let over = used > budget * 1.4
    let letters = 'ABCDEFGH'
    let phase = run.phase || 'answer'
    let out = []
    out.push('<section class="pd-card"><div class="pd-clockwrap">')
    /* 表盘：金指针=本题已用/预算，外环=整场进度 */
    let C = 2 * Math.PI * 66
    let handDeg = Math.min(360, (used / Math.max(1, budget)) * 360)
    out.push('<svg class="pd-clock" viewBox="0 0 150 150" aria-hidden="true">'
      + '<circle class="face" cx="75" cy="75" r="70"/>'
      + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (i) {
        let a = i * 30 * Math.PI / 180
        return '<line class="tick" x1="' + (75 + 62 * Math.sin(a)).toFixed(1) + '" y1="' + (75 - 62 * Math.cos(a)).toFixed(1) + '" x2="' + (75 + 66 * Math.sin(a)).toFixed(1) + '" y2="' + (75 - 66 * Math.cos(a)).toFixed(1) + '"/>'
      }).join('')
      + '<circle class="ring' + (over ? ' over' : '') + '" cx="75" cy="75" r="66" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - run.idx / run.queue.length)).toFixed(1) + '"/>'
      + '<g data-pd="hand" style="transform:rotate(' + handDeg.toFixed(1) + 'deg)"><line class="hand-sec" x1="75" y1="75" x2="75" y2="24"/></g>'
      + '<circle class="hub" cx="75" cy="75" r="4"/></svg>')
    out.push('<div class="pd-clocktext">'
      + '<div class="pd-bignum' + (over ? ' over' : '') + '" data-pd="sec">' + fmtSec(used) + '</div>'
      + '<div class="pd-budgetline">预算 <b data-pd="budget">' + fmtSec(budget) + '</b> · 第 ' + (run.idx + 1) + '/' + run.queue.length + ' 题'
      + ' · 本场策略分 <b data-pd="pscore">' + paceScore(run.qs).score + '</b></div>'
      + (over ? '<div class="pd-budgetline" style="color:var(--pd-danger)">红线已过——蒙一个或跳过，别恋战。</div>' : '')
      + '</div></div></section>')

    out.push('<section class="pd-card"><div class="pd-qmeta">'
      + '<span class="pd-dchip d' + q.d + '">' + (q.d === 1 ? '简单' : q.d === 3 ? '硬骨头' : '中等') + '</span>'
      + '<span>' + esc(q.kind || '选择题') + '</span>'
      + (run.qs.length ? '<span style="margin-left:auto">上一题：' + fmtSec(run.qs[run.qs.length - 1].sec) + '</span>' : '')
      + '</div>')
    out.push('<div class="pd-qstem">' + esc(q.s) + '</div>')
    if (phase === 'answer') {
      out.push('<div class="pd-opts">' + q.o.map(function (o, i) {
        return '<button class="pd-opt" data-act="pick" data-i="' + i + '"><i>' + letters[i] + '</i><span>' + esc(o) + '</span></button>'
      }).join('') + '</div>')
      out.push('<div class="pd-decide">'
        + '<button class="pd-btn gold sm" data-act="guess">' + I('dice') + '蒙一个</button>'
        + '<button class="pd-btn ghost sm" data-act="skip">' + I('skip') + '跳过（本轮末回访）</button>'
        + '<button class="pd-btn ghost sm" data-act="abort">' + I('cross') + '结束本场</button>'
        + '</div>')
    } else if (phase === 'verdict') {
      let v = run.verdict || {}
      out.push('<div class="pd-opts">' + q.o.map(function (o, i) {
        let cls = ''
        if (i === q.a) cls = ' showright'
        if (v.pick === i) cls += v.ok ? ' pick-ok' : ' pick-bad'
        return '<div class="pd-opt' + cls + '" style="cursor:default"><i>' + letters[i] + '</i><span>' + esc(o) + '</span></div>'
      }).join('') + '</div>')
      out.push('<div class="pd-verdict">'
        + (v.ok ? '<b>' + I('check') + ' 答对了</b>' : '<b style="color:var(--pd-danger)">' + I('cross') + ' 答错了</b>')
        + ' · 用时 ' + fmtSec(v.sec) + ' / 预算 ' + fmtSec(v.budget)
        + (v.act === 'guess' ? ' · 蒙的' : v.act === 'skip' ? ' · 回访补答' : '')
        + (q.why ? '<br>' + esc(q.why) : '') + '</div>')
      out.push('<div class="pd-decide"><button class="pd-btn primary sm" data-act="next">' + I('bolt') + '下一题</button></div>')
    }
    out.push('</section>')
    return out.join('')
  }

  function viewReplay(ctx, S) {
    let list = S.sessions
    let out = []
    out.push('<section class="pd-card"><div class="pd-card-h"><b>决策回放</b><em>' + (list.length ? list.length + ' 场训练' : '还没打过') + '</em></div>')
    if (!list.length) {
      out.push('<div class="pd-empty"><span class="ico">' + I('film') + '</span><b>还没有一场训练</b>去「道场」打一场，回来这里逐题复盘。</div></section>')
      return out.join('')
    }
    let cur = null
    let rid = S.replayId || list[0].id
    list.forEach(function (s) { if (s.id === rid) cur = s })
    if (!cur) cur = list[0]
    /* 会话选择条 */
    out.push('<div class="pd-seg" style="margin-bottom:12px">' + list.slice(0, 8).map(function (s) {
      return '<button data-act="replay-pick" data-id="' + esc(s.id) + '" class="' + (s.id === cur.id ? 'on' : '') + '">' + dkey(s.at) + ' · ' + s.score + '分</button>'
    }).join('') + '</div>')
    /* 时间轴 SVG */
    let totalSec = 0, totalBudget = 0
    cur.qs.forEach(function (q) { totalSec += q.sec; totalBudget += q.budget || q.sec })
    let W = 640
    let x = 0
    let tl = '<svg class="pd-tl" viewBox="0 0 ' + W + ' 64" style="width:100%;height:64px">'
    cur.qs.forEach(function (q, i) {
      let w = totalSec ? (q.sec / totalSec) * (W - 8) : 40
      let col = q.act === 'skip' ? 'var(--pd-sub)' : (q.act === 'guess' ? 'var(--pd-gold)' : (q.ok ? 'var(--pd-ok)' : 'var(--pd-danger)'))
      let overB = q.budget && q.sec > q.budget * 1.4
      tl += '<rect class="pd-tlseg" x="' + x.toFixed(1) + '" y="' + (overB ? 8 : 16) + '" width="' + Math.max(4, w).toFixed(1) + '" height="' + (overB ? 30 : 16) + '" rx="4" fill="' + col + '" opacity="' + (overB ? .95 : .7) + '"/>'
      tl += '<text x="' + (x + 3).toFixed(1) + '" y="52" font-size="10" fill="var(--pd-sub)">' + (i + 1) + '</text>'
      x += Math.max(6, w) + 2
    })
    tl += '</svg>'
    out.push(tl)
    out.push('<div class="pd-quiet">条宽=实际用时；浮起=超预算 40% 以上。绿=答对 红=答错 金=蒙 灰=跳。</div>')
    /* 决策卡列表 */
    out.push('<div style="margin-top:10px">')
    let worst = null
    cur.qs.forEach(function (q, i) {
      let dev = q.budget ? Math.round((q.sec - q.budget) / Math.max(1, q.budget) * 100) : 0
      if (dev > 40 && (!worst || dev > worst.dev)) worst = { i: i, dev: dev }
      out.push('<div class="pd-decision-row"><span class="pd-dsec">' + fmtSec(q.sec) + '</span>'
        + '<span class="pd-dtag ' + q.act + '">' + (q.act === 'ans' ? '作答' : q.act === 'guess' ? '蒙' : '跳') + '</span>'
        + '<span class="pd-dtag ' + (q.ok ? 'ok' : 'bad') + '">' + (q.ok ? '对' : '错') + '</span>'
        + '<span style="color:var(--pd-sub)">预算 ' + fmtSec(q.budget) + ' · ' + (dev >= 0 ? '+' : '') + dev + '%</span>'
        + '<span style="margin-left:auto;color:var(--pd-ink2)">难度 ' + (q.d === 1 ? '易' : q.d === 3 ? '难' : '中') + '</span></div>')
    })
    out.push('</div>')
    let adv = adviceFor(cur.qs, null)
    out.push('<div class="pd-verdict" style="margin-top:12px"><b>本场策略判词</b><br>' + adv.map(esc).join('<br>')
      + (worst ? '<br>最亏的是第 ' + (worst.i + 1) + ' 题：超预算 ' + worst.dev + '%。' : '') + '</div>')
    out.push('<div class="pd-acts"><button class="pd-btn" data-act="replay-ai">' + I('bulb') + 'AI 教练点评</button></div>')
    out.push('</section>')
    return out.join('')
  }

  function viewLedger(ctx, S) {
    let h = habitsOf(S.sessions)
    let out = []
    out.push('<section class="pd-card"><div class="pd-card-h"><b>策略账本</b><em>跨场的习惯，比单场分数重要</em></div>')
    if (!h) {
      out.push('<div class="pd-empty"><span class="ico">' + I('chart') + '</span><b>账本是空的</b>打一场限时训练，这里就有数据。</div></section>')
      return out.join('')
    }
    out.push('<div class="pd-statgrid">'
      + '<div class="pd-stat"><b>' + h.n + '</b><span>训练场次</span></div>'
      + '<div class="pd-stat"><b>' + h.avgScore + '</b><span>平均策略分</span></div>'
      + '<div class="pd-stat"><b>' + h.rightRate + '%</b><span>正确率</span></div>'
      + '<div class="pd-stat"><b>' + h.overRate + '%</b><span>超预算率（恋战）</span></div>'
      + '<div class="pd-stat"><b>' + h.guessRate + '%</b><span>蒙题占比</span></div>'
      + '<div class="pd-stat"><b>' + (h.guessHitRate == null ? '—' : h.guessHitRate + '%') + '</b><span>蒙中率</span></div>'
      + '</div>')
    /* 近 10 场策略分柱 */
    let recent = S.sessions.slice(0, 10).reverse()
    out.push('<div style="margin-top:16px"><div class="pd-quiet">近 ' + recent.length + ' 场策略分</div><div class="pd-bars">')
    recent.forEach(function (s) {
      out.push('<div class="pd-bar' + (s.score < 70 ? ' low' : '') + '" style="height:' + Math.max(6, s.score) + '%" title="' + dkey(s.at) + ' · ' + s.score + '分"></div>')
    })
    out.push('</div></div>')
    let adv = []
    if (h.overRate > 25) adv.push('恋战体质：' + h.overRate + '% 的题超了预算 40%。红线一到先做决策再想第二遍。')
    if (h.guessHitRate != null && h.guessHitRate < 25 && h.guessRate > 20) adv.push('蒙题命中率 ' + h.guessHitRate + '% 低于随机基线——蒙之前先排除一个选项再猜。')
    if (h.skipRate > 35) adv.push('跳过率 ' + h.skipRate + '%：跳太多会把简单分也跳没了，给「跳」设上限（每大题最多跳一半）。')
    if (!adv.length) adv.push('习惯健康：把题源难度升一档，策略分才有新的压力测试。')
    out.push('<div class="pd-verdict" style="margin-top:12px"><b>习惯判词</b><br>' + adv.map(esc).join('<br>') + '</div>')
    out.push('</section>')
    return out.join('')
  }

  function viewSetup(ctx, S) {
    let out = []
    out.push('<section class="pd-card"><div class="pd-card-h"><b>数据</b><em>训练记录都在浏览器本地，云同步走站内通道</em></div>')
    out.push('<div class="pd-acts">'
      + '<button class="pd-btn" data-act="export">' + I('down') + '导出 JSON</button>'
      + '<button class="pd-btn ghost" data-act="wipe">' + I('cross') + '清空训练记录</button></div>')
    out.push('<div class="pd-quiet" style="margin-top:10px">清空只删本插件的会话记录（' + S.sessions.length + ' 场），不动站内题库与错题本。</div>')
    out.push('</section>')
    out.push('<section class="pd-card"><div class="pd-card-h"><b>快捷键</b><em>键盘党</em></div><div class="pd-keys">'
      + '<div class="pd-keyrow"><span class="pd-keycap">D</span>直接开一场</div>'
      + '<div class="pd-keyrow"><span class="pd-keycap">A/D/W</span>作答时选 A/D 项之外——用数字 1-4 选选项</div>'
      + '<div class="pd-keyrow"><span class="pd-keycap">G</span>蒙一个</div>'
      + '<div class="pd-keyrow"><span class="pd-keycap">S</span>跳过</div>'
      + '<div class="pd-keyrow"><span class="pd-keycap">Enter</span>下一题</div>'
      + '<div class="pd-keyrow"><span class="pd-keycap">Esc</span>结束本场</div>'
      + '<div class="pd-keyrow"><span class="pd-keycap">1-5</span>切换视图</div>'
      + '</div></section>')
    out.push('<section class="pd-card"><div class="pd-card-h"><b>方法论</b><em>为什么练「时间」而不是只练「题」</em></div>'
      + '<div class="pd-quiet">考研考场上，多数人的失分不是「不会」，是<b>不会放弃</b>：一道 4 分的选择题恋战 6 分钟，'
      + '挤掉的是一道 12 分解答题的从容。道场把「恋战/蒙/跳」变成有分数的决策——策略分只认时间纪律，不认运气。'
      + '<br>三步用法：① 策略实验室按目标分生成预算表；② 道场按预算打限时赛；③ 回放里找到最亏的那道题，下场只改这一个习惯。</div></section>')
    return out.join('')
  }

  /* ════════════════════════ 7. 挂载 ════════════════════════ */

  let VIEWS = [
    { k: 'lab', t: '实验室', ic: 'lab', n: '策略实验室' },
    { k: 'dojo', t: '道场', ic: 'bolt', n: '训练场' },
    { k: 'replay', t: '回放', ic: 'film', n: '决策回放' },
    { k: 'ledger', t: '账本', ic: 'chart', n: '策略账本' },
    { k: 'setup', t: '设置', ic: 'gear', n: '设置与数据' },
  ]

  /* 能力面在载入时就要落地（init 与 mount 共用，全部幂等）：
   * 浮窗面板不等工具页被打开——只在 mount 注皮肤的话，面板首开就是裸文字
   * （2026-11-12 巡检抓到；fv/sf/vf/fx/er 五插件把 CSS 放 manifest.css 正是为此）。 */
  function bootSurfaces(ctx) {
    try { window.__PD_HOST_CTX = ctx; injectStyles() } catch (e) { }
    try {
      if (ctx.ai && typeof ctx.ai.registerCtx === 'function') {
        ctx.ai.registerCtx({
          ctx: AI_CTX_REVIEW, name: '时钟道场 · 策略点评',
          desc: '基于逐题用时/预算/决策数据，给 3-5 条考场时间策略判词（只评时间决策不评知识）',
          def: 'fast', latexNeed: false, tools: 'none', recall: false,
        })
      }
    } catch (e) { }
  }

  function mountShell(el, ctx) {
    bootSurfaces(ctx)
    let S = {
      view: 'lab',
      sessions: [],
      bank: [],
      /* 【2026-11-12 协议合规】config 声明了就必须消费:labTpl/labGoal 旧版是写死的默认,
       * 用户在插件中心改「默认目标分/默认题型模板」永远无效。现从 config 初始化,
       * 会话内改动仍即时生效(下次进插件回到配置值)。 */
      labTpl: (function () {
        /* 配置存的是显示名(下拉友好),这里解析回 key;存了 key 也兼容 */
        try {
          let t = String(ctx.config('tpl') || '数学单选')
          for (let i = 0; i < PLAN_TEMPLATES.length; i++) if (PLAN_TEMPLATES[i].name === t || PLAN_TEMPLATES[i].k === t) return PLAN_TEMPLATES[i].k
        } catch (e) { }
        return 'math-choice'
      })(),
      labGoal: (function () { try { return clamp(num(ctx.config('defaultGoal'), 90), 10, 300) } catch (e) { return 90 } })(),
      src: 'bank',
      replayId: '',
      run: null,
      resume: null,
      enterT: 0,
    }
    try { let v = ctx.data('pdView'); for (let i = 0; i < VIEWS.length; i++) if (VIEWS[i].k === v) S.view = v } catch (e) { }
    S.sessions = sessionsGet(ctx)
    /* 题源：站内错题里可用的选择题（≥2 选项 + 可解析答案） */
    try {
      let st = ctx.Store && ctx.Store.get ? ctx.Store.get() : null
      let mks = (st && Array.isArray(st.mistakes)) ? st.mistakes : []
      S.bank = mks.map(adaptMistake).filter(Boolean)
    } catch (e) { S.bank = [] }

    /* 在场恢复：ctx.keep 里的未完场 */
    try {
      let r = ctx.keep.get(KEEP_RUN, null)
      if (r && Array.isArray(r.queue) && r.queue.length && r.idx != null && !r.done) {
        S.resume = r
        /* 未完场优先：重进插件直接落回道场亮「继续/重开」，而不是丢在别的视图里等用户找 */
        S.view = 'dojo'
      }
    } catch (e) { }

    let root = document.createElement('div')
    root.className = 'pd-root'
    el.appendChild(root)
    let stageEl = null
    let heroEl = null
    let dockEl = null
    let lastView = ''
    let dockInd = null
    let tick = null           /* 训练计时器（局部更新，不整屏重绘） */
    let rafClock = 0

    function paint() {
      let html = ''
      if (S.view === 'lab') html = viewLab(ctx, S)
      else if (S.view === 'dojo') html = viewDojo(ctx, S)
      else if (S.view === 'replay') html = viewReplay(ctx, S)
      else if (S.view === 'ledger') html = viewLedger(ctx, S)
      else html = viewSetup(ctx, S)
      root.innerHTML = heroHTML(ctx, S) + '<main class="pd-stage">' + html + '</main>'
        + '<div class="pd-dockwrap"><nav class="pd-dock" aria-label="插件导航"><i class="pd-dock-ind"></i>'
        + VIEWS.map(function (v) {
          return '<button class="pd-dock-item" data-view="' + v.k + '" title="' + v.n + '">' + I(v.ic) + '<em>' + v.t + '</em></button>'
        }).join('') + '</nav></div>'
      heroEl = root.querySelector('.pd-hero')
      stageEl = root.querySelector('.pd-stage')
      dockEl = root.querySelector('.pd-dock')
      dockInd = root.querySelector('.pd-dock-ind')
      syncDock()
      /* 【2026-11-12 用户报修：点一个按钮整页重建一次】进场动画原来每次 paint 都重放——
       * 选选项/下一题这些同视图内的动作也在闪整页。duel 同款门控：只在视图真正切换
       * （含首挂）时打进场标记，同视图内 paint 不动结构动画。 */
      if (S.view !== lastView) { lastView = S.view; markEnter() }
      if (S.run && S.view === 'dojo') startClock()
    }
    function markEnter() {
      root.classList.add('pd-enter')
      if (S.enterT) clearTimeout(S.enterT)
      S.enterT = setTimeout(function () { if (root) root.classList.remove('pd-enter') }, 900)
    }
    function syncDock() {
      if (!dockEl) return
      let items = dockEl.querySelectorAll('.pd-dock-item')
      for (let i = 0; i < items.length; i++) {
        let on = items[i].getAttribute('data-view') === S.view
        items[i].classList.toggle('on', on)
        if (on && dockInd) {
          dockInd.style.transform = 'translateX(' + items[i].offsetLeft + 'px)'
          dockInd.style.width = items[i].offsetWidth + 'px'
        }
      }
    }
    function go(k) {
      if (S.view === k) return
      if (S.run && k !== 'dojo') { persistRun(); }
      S.view = k
      try { ctx.data('pdView', k) } catch (e) { }
      paint()
      try { window.scrollTo({ top: 0, behavior: 'smooth' }) } catch (e) { }
    }
    function toast(m, lv) { try { ctx.Toast.show(m, lv || 'info', 2600) } catch (e) { } }

    /* —— 训练引擎 —— */
    function currentPlan() {
      let tpl = PLAN_TEMPLATES.filter(function (t) { return t.k === S.labTpl })[0] || PLAN_TEMPLATES[0]
      return solvePlan(tpl, S.labGoal)
    }
    function pickQueue() {
      let n = clamp((function () { try { return num(ctx.config('perRun'), Q_PER_RUN) } catch (e) { return Q_PER_RUN } })(), 5, 15)
      let srcPool = S.src === 'demo' || !S.bank.length ? DEMO_BANK.map(function (d) { return { id: d.id, s: d.s, o: d.o, a: d.a, d: d.d, why: d.why, kind: '示范' } }) : S.bank.slice()
      let pool = shuffle(srcPool).slice(0, n)
      if (!pool.length) return []
      /* 预算：实验室算过就按每题预算，否则按难度默认 */
      let plan = currentPlan()
      let perBudget = plan && plan.rows.length ? plan.rows[0].budget : 0
      pool.forEach(function (q) {
        q.budget = q.budget || (perBudget && q.kind === plan.rows[0].kind ? perBudget : (q.d === 1 ? 60 : q.d === 3 ? 180 : 110))
      })
      return pool
    }
    function startRun(resumeData) {
      let queue = resumeData ? resumeData.queue : pickQueue()
      if (!queue.length) { toast(S.src === 'bank' ? '站内题库没有可用的选择题——先切「内置示范题」' : '题池是空的', 'warn'); return }
      S.run = {
        id: 'pd-' + Date.now().toString(36),
        at: Date.now(),
        tpl: S.labTpl,
        goal: S.labGoal,
        queue: queue,
        idx: resumeData ? resumeData.idx : 0,
        qs: resumeData ? resumeData.qs : [],
        qSec: 0,
        t0: Date.now(),
        phase: 'answer',
        verdict: null,
        budgetOf: function (q) { return num(q.budget, 110) },
      }
      S.resume = null
      S.view = 'dojo'
      try { ctx.data('pdView', 'dojo') } catch (e) { }
      paint()
    }
    function persistRun() {
      if (!S.run) return
      try {
        let r = S.run
        ctx.keep.set(KEEP_RUN, { queue: r.queue, idx: r.idx, qs: r.qs, done: false })
      } catch (e) { }
    }
    function clearRunKeep() { try { ctx.keep.set(KEEP_RUN, null) } catch (e) { } }

    /* 计时：200ms 只更新指针/数字/红线提示（局部 DOM），绝不 paint() 整屏 */
    function startClock() {
      stopClock()
      tick = setInterval(function () {
        let r = S.run
        if (!r || S.view !== 'dojo' || r.phase !== 'answer') return
        if (document.hidden) { r.t0 += 200; return }   /* 切后台暂停（与 duel 同纪律） */
        r.qSec = Math.round((Date.now() - r.t0) / 1000)
        let q = r.queue[r.idx]
        if (!q) return
        let budget = num(q.budget, 110)
        let deg = Math.min(360, r.qSec / Math.max(1, budget) * 360)
        let over = r.qSec > budget * 1.4
        if (!rafClock) rafClock = requestAnimationFrame(function () {
          rafClock = 0
          let hand = root.querySelector('[data-pd="hand"]')
          let secEl = root.querySelector('[data-pd="sec"]')
          if (hand) hand.style.transform = 'rotate(' + deg.toFixed(1) + 'deg)'
          if (secEl) { secEl.textContent = fmtSec(r.qSec); secEl.classList.toggle('over', over) }
        })
      }, 200)
    }
    function stopClock() { if (tick) { clearInterval(tick); tick = null } }

    function settle(act, pickIdx) {
      let r = S.run
      if (!r) return
      let q = r.queue[r.idx]
      if (!q) return
      stopClock()
      let sec = r.qSec
      let ok = pickIdx != null && pickIdx === q.a
      r.qs.push({ id: q.id, sec: sec, budget: num(q.budget, 110), act: act, ok: ok, d: num(q.d, 2) })
      r.verdict = { pick: pickIdx, ok: ok, sec: sec, budget: num(q.budget, 110), act: act }
      r.phase = 'verdict'
      persistRun()
      paint()
    }
    function nextQ() {
      let r = S.run
      if (!r) return
      r.idx++
      r.qSec = 0
      r.t0 = Date.now()
      r.phase = 'answer'
      r.verdict = null
      if (r.idx >= r.queue.length) { finishRun(); return }
      persistRun()
      paint()
      startClock()
    }
    function finishRun() {
      let r = S.run
      stopClock()
      if (!r || !r.qs.length) { S.run = null; paint(); return }
      let ps = paceScore(r.qs)
      let sess = normSession({ id: r.id, at: r.at, tpl: r.tpl, goal: r.goal, score: ps.score, qs: r.qs })
      if (sess) {
        S.sessions = sessionsSave(ctx, [sess].concat(S.sessions))
        S.replayId = sess.id
      }
      S.run = null
      clearRunKeep()
      toast('本场策略分 ' + ps.score + '，去回放看每一题的决策', ps.score >= 80 ? 'success' : (ps.score < 60 ? 'warn' : 'info'))
      S.view = 'replay'
      try { ctx.data('pdView', 'replay') } catch (e) { }
      paint()
    }

    /* —— 交互委托 —— */
    function onClick(e) {
      let t = e.target
      let dockBtn = t.closest ? t.closest('.pd-dock-item') : null
      if (dockBtn) { go(dockBtn.getAttribute('data-view')); return }
      let a = t.closest ? t.closest('[data-act]') : null
      if (!a) return
      let act = a.getAttribute('data-act')
      if (act === 'quick') { S.view = 'dojo'; startRun(); return }
      if (act === 'goto-lab') { go('lab'); return }
      if (act === 'lab-tpl') { S.labTpl = a.getAttribute('data-k'); paint(); return }
      if (act === 'lab-start') { S.view = 'dojo'; startRun(); return }
      if (act === 'dojo-src') { S.src = a.getAttribute('data-k'); paint(); return }
      if (act === 'dojo-start') { startRun(); return }
      if (act === 'resume-yes') { startRun(S.resume); return }
      if (act === 'resume-no') { S.resume = null; clearRunKeep(); paint(); return }
      if (act === 'pick') { settle('ans', num(a.getAttribute('data-i'), 0)); return }
      if (act === 'guess') {
        let q = S.run && S.run.queue[S.run.idx]
        if (!q) return
        settle('guess', Math.floor(Math.random() * q.o.length))
        return
      }
      if (act === 'skip') {
        let r = S.run
        if (!r) return
        let q = r.queue[r.idx]
        r.qs.push({ id: q.id, sec: r.qSec, budget: num(q.budget, 110), act: 'skip', ok: false, d: num(q.d, 2) })
        /* 跳过的题排到本轮末尾回访一次 */
        r.queue.splice(r.idx, 1)
        r.queue.push(q)
        r.qSec = 0
        r.t0 = Date.now()
        persistRun()
        paint()
        startClock()
        return
      }
      if (act === 'next') { nextQ(); return }
      if (act === 'abort') {
        ctx.api.confirm('结束本场？', '已作答的题会正常计入策略分与回放；没答完的题不算。', function () {
          finishRun()
        }, false)
        return
      }
      if (act === 'replay-pick') { S.replayId = a.getAttribute('data-id'); paint(); return }
      if (act === 'replay-ai') { aiReview(); return }
      if (act === 'export') {
        try { ctx.api.download('时钟道场-训练记录.json', JSON.stringify({ v: 1, sessions: S.sessions }, null, 2), 'application/json') } catch (e) { toast('导出失败', 'danger') }
        return
      }
      if (act === 'wipe') {
        ctx.api.confirm('清空训练记录？', '将删除全部 ' + S.sessions.length + ' 场训练会话，<b>不可恢复</b>（建议先导出）。站内题库与错题本不受影响。', function () {
          S.sessions = sessionsSave(ctx, [])
          S.replayId = ''
          toast('已清空', 'success')
          paint()
        }, true)
        return
      }
    }

    /* AI 点评（可选增强；失败退回确定性判词） */
    function aiReview() {
      let sess = null
      S.sessions.forEach(function (s) { if (s.id === (S.replayId || S.sessions[0].id)) sess = s })
      if (!sess) return
      if (!ctx.ai || !ctx.ai.has || !ctx.ai.has()) {
        let adv = adviceFor(sess.qs, null)
        try { ctx.Modal.open({ title: '策略判词（离线）', html: '<div class="pd-quiet">' + adv.map(esc).join('<br>') + '</div>', actions: [{ label: '知道了', value: 1 }] }) } catch (e) { }
        return
      }
      let sys = '你是考研考场时间教练。基于学员一场限时训练的逐题数据（用时/预算/决策/对错），给出 3-5 条可执行的时间策略判词。'
        + '只评时间决策，不评知识点掌握；诚实直接，不夸不吓。输出 JSON：{"lines":["…","…"]}。'
      let usr = JSON.stringify({ goal: sess.goal, tpl: sess.tpl, score: sess.score, qs: sess.qs.map(function (q) { return { sec: q.sec, budget: q.budget, act: q.act, ok: q.ok, d: q.d } }) })
      try {
        ctx.ai.json(sys, usr, { ctx: AI_CTX_REVIEW, timeout: 60000 }).then(function (o) {
          let lines = (o && Array.isArray(o.lines)) ? o.lines.filter(function (x) { return typeof x === 'string' && x.trim() }).slice(0, 6) : []
          if (!lines.length) lines = adviceFor(sess.qs, null)
          try { ctx.Modal.open({ title: 'AI 教练点评', html: '<div class="pd-quiet">' + lines.map(esc).join('<br>') + '</div>', actions: [{ label: '知道了', value: 1 }] }) } catch (e) { }
        }).catch(function () {
          toast('AI 没回话，已用确定性判词顶上', 'warn')
          let adv = adviceFor(sess.qs, null)
          try { ctx.Modal.open({ title: '策略判词（离线）', html: '<div class="pd-quiet">' + adv.map(esc).join('<br>') + '</div>', actions: [{ label: '知道了', value: 1 }] }) } catch (e) { }
        })
      } catch (e) { toast('AI 通道异常', 'danger') }
    }

    /* 键盘：输入框/弹窗让位（copilot 纪律） */
    function onKey(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (document.querySelector('.pd-modal, #modal-overlay')) return
      let tg = e.target && e.target.tagName
      if (tg === 'INPUT' || tg === 'TEXTAREA' || tg === 'SELECT') return
      let r = S.run
      if (r && S.view === 'dojo') {
        if (r.phase === 'answer') {
          let q = r.queue[r.idx]
          if (q && e.key >= '1' && e.key <= String(Math.min(8, q.o.length))) { e.preventDefault(); settle('ans', num(e.key, 1) - 1); return }
          if (e.key === 'g' || e.key === 'G') { e.preventDefault(); let btn = root.querySelector('[data-act="guess"]'); if (btn) btn.click(); return }
          if (e.key === 's' || e.key === 'S') { e.preventDefault(); let btn = root.querySelector('[data-act="skip"]'); if (btn) btn.click(); return }
          if (e.key === 'Escape') { e.preventDefault(); let btn = root.querySelector('[data-act="abort"]'); if (btn) btn.click(); return }
        } else if (r.phase === 'verdict' && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); nextQ(); return }
        return
      }
      if (e.key >= '1' && e.key <= '5') { let v = VIEWS[num(e.key, 1) - 1]; if (v) { e.preventDefault(); go(v.k) } return }
      if (e.key === 'd' || e.key === 'D') { e.preventDefault(); S.view = 'dojo'; startRun() }
    }

    /* 吸顶页眉两态（原生机制：window scroll 切 .stuck） */
    function onScroll() {
      if (heroEl) heroEl.classList.toggle('stuck', window.scrollY > 6)
    }
    function onResize() { syncDock() }

    root.addEventListener('click', onClick)
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    paint()
    /* AI 场景登记已挪进 bootSurfaces（init/mount 共用，见 §4 皮肤注入旁） */

    return function destroy() {
      stopClock()
      if (rafClock) { try { cancelAnimationFrame(rafClock) } catch (e) { } rafClock = 0 }
      if (S.enterT) clearTimeout(S.enterT)
      persistRun()
      root.removeEventListener('click', onClick)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      try { let st = document.getElementById(STYLE_ID); if (st) st.remove() } catch (e) { }
      root.remove()
      window.__PD_HOST_CTX = null
    }
  }

  /* ════════════════════════ 8. manifest ════════════════════════ */

  let api = {
    id: T_MAIN,
    name: '时钟道场',
    version: VERSION,
    author: 'kaoyan-v2',
    desc: '考场时间策略训练：目标分→每题时间预算与最少做对矩阵；限时赛里「作答/蒙/跳」三键决策逐题计时；'
      + '策略分只认时间纪律不认运气，回放指出最亏的一道题；跨场账本看恋战率/蒙中率/跳后悔率。'
      + '纯确定性内核零 AI 可跑，AI 点评可选增强。',
    tools: [{ id: T_MAIN, title: '时钟道场', icon: MARK_ICON, mount: mountShell }],
    init: function (ctx) { bootSurfaces(ctx) },
    /* 【2026-11-12 协议合规】补齐能力面:shortcuts(全局直达) + panels(常驻面板),
     * 与站内六大插件同构——插件中心自动渲染,教练/侧栏都能看见插件的今日态。 */
    shortcuts: [
      {
        key: 'alt+p', label: '直达时钟道场',
        run: function (ctx) {
          try {
            if (ctx && ctx.api && ctx.api.goTool) ctx.api.goTool(T_MAIN)
            else if (window.App) window.App.go(T_MAIN)
          } catch (e) { }
        },
      },
    ],
    panels: [
      {
        id: 'pd-today', title: '时钟道场 · 今日', icon: MARK_ICON, width: 300, height: 240,
        render: function (ctx) {
          let list = sessionsGet(ctx)
          let h = habitsOf(list)
          let today = dkey()
          let todayN = 0
          list.forEach(function (s) { if (dkey(s.at) === today) todayN++ })
          let out = ['<div class="pd-panel">']
          out.push('<div class="pd-panel-kpis">'
            + '<div><b>' + todayN + '</b><span>今日练场</span></div>'
            + '<div><b>' + (h ? h.avgScore : '—') + '</b><span>策略均分</span></div>'
            + '<div><b>' + (h ? h.overRate + '%' : '—') + '</b><span>恋战率</span></div></div>')
          if (!list.length) out.push('<div class="pd-panel-empty">还没打过限时赛。打开道场，按预算练一场。</div>')
          else {
            out.push('<div class="pd-panel-list">')
            for (let i = 0; i < Math.min(4, list.length); i++) {
              let s = list[i]
              let bad = s.qs.filter(function (q) { return q.budget > 0 && q.sec > q.budget * 1.4 }).length
              out.push('<div class="pd-panel-row"><span>' + dkey(s.at) + '</span>'
                + '<b>' + s.score + ' 分</b>'
                + '<i class="' + (bad ? 'warn' : 'ok') + '">' + (bad ? '恋战 ' + bad + ' 题' : '节奏干净') + '</i></div>')
            }
            out.push('</div>')
          }
          out.push('</div>')
          return out.join('')
        },
      },
    ],
    config: [
      { key: 'perRun', label: '每场题量（5-15）', type: 'number', default: Q_PER_RUN },
      { key: 'defaultGoal', label: '默认目标分', type: 'number', default: 90 },
      { key: 'tpl', label: '默认题型模板', type: 'select', default: '数学单选', options: PLAN_TEMPLATES.map(function (t) { return t.name }) },
    ],
    hooks: {
      quizDone: function (ctx) {
        try {
          let k = ctx.keep.get('pdNudgeDay')
          let tk = dkey()
          if (k === tk) return
          ctx.keep.set('pdNudgeDay', tk)
          if (typeof ctx.notify === 'function') {
            ctx.notify({ title: '刚刷完题——顺手练 5 分钟时间策略？', body: '会做不代表考场来得及。时钟道场按预算打一场限时赛。', level: 'info', timeout: 10000, onClick: function () { ctx.api.goTool(T_MAIN) } })
          }
        } catch (e) { }
      },
    },
    memory: '用户装有「时钟道场」插件：练考场时间策略（每题预算、止损、蒙题战术）。当用户提到「做不完」「时间不够」「考场节奏」'
      + '「一到考试就写不完」时，建议去时钟道场打一场限时赛并按策略实验室的预算表执行。',
    queries: [
      {
        key: 'pd-habits',
        label: '时钟道场时间习惯',
        run: function (ctx) {
          let h = habitsOf(sessionsGet(ctx))
          if (!h) return '时钟道场还没有训练记录——用户还没打过限时赛。'
          let out = '时钟道场练了 ' + h.n + ' 场，平均策略分 ' + h.avgScore + '。'
            + '恋战（超预算40%+）率 ' + h.overRate + '%，蒙题率 ' + h.guessRate + '%'
            + (h.guessHitRate != null ? '（命中 ' + h.guessHitRate + '%）' : '')
            + '，跳过率 ' + h.skipRate + '%，正确率 ' + h.rightRate + '%。'
          if (h.overRate > 25) out += '主要问题是恋战。'
          else if (h.skipRate > 35) out += '倾向过度放弃，简单分在漏。'
          else out += '时间纪律总体健康。'
          return out
        },
      },
      {
        key: 'pd-plan',
        label: '时钟道场当前策略表',
        run: function (ctx) {
          let tpl = PLAN_TEMPLATES[0]
          let plan = solvePlan(tpl, 90)
          if (!plan) return '策略表初始化失败。'
          return '当前策略（' + tpl.name + '，目标 90/' + tpl.total + '）：'
            + plan.rows.map(function (r) { return r.kind + ' 每题预算 ' + fmtSec(r.budget) }).join('；')
            + '。上 90 分最少做对：' + (function () {
              let m = plan.matrix.filter(function (x) { return x.line <= 90 }).pop()
              return m && m.need.length ? m.need.map(function (x) { return x.kind + ' ' + x.needN + '/' + x.n }).join('、') : '—'
            })()
        },
      },
    ],
  }

  /* 测试钩子：仅调试模式导出纯函数（不进生产语义） */
  if (window.__PD_DEBUG__) {
    window.__pdInternals = {
      esc: esc, num: num, clamp: clamp, flat: flat, trunc: trunc, hashStr: hashStr, fmtSec: fmtSec,
      PLAN_TEMPLATES: PLAN_TEMPLATES, DEMO_BANK: DEMO_BANK,
      solvePlan: solvePlan, paceScore: paceScore, adviceFor: adviceFor, habitsOf: habitsOf,
      adaptMistake: adaptMistake, normSession: normSession, sessionsGet: sessionsGet, sessionsSave: sessionsSave,
      mountShell: mountShell,
    }
  }

  PluginBus.register(api)
})()
