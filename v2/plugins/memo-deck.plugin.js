/* ============================================================
 * memo-deck.plugin.js — 记忆宫殿 · 闪卡引擎（单文件插件）· v1.0.0
 * ------------------------------------------------------------
 * 干什么：把任何笔记/错题/知识点变成闪卡，用 SM-2 间隔重复引擎安排复习，
 *         四页签合一（牌库 / 今日复习 / 记忆统计 / 引擎设置）+ 到期提醒 + AI 制卡。
 *
 * 设计边界（与「试卷提取」插件同一套纪律）：
 *   · 零外部依赖：不引图表库/不引 confetti 库 —— 曲线/饼图/彩带全部手写 SVG/Canvas。
 *   · 只用插件公开契约：ctx.*（AI/keep/data/notify/config/ui.api…）+ window/document。
 *     站点内部全局（U./Store./AI. 裸名）一律不碰 —— 换环境不失效。
 *   · 样式全部走站点设计令牌（--surface/--line/--text-primary/--ok…）：
 *     夜间的 --surface 是深色，硬编码 #fff 会白底白字。
 *   · 吸顶页眉复用原生模块机制（见 docs/essay-dock-sticky-report-2026-10-15.md）：
 *     root 撑满整页 → hero 直接作为 root 子级 sticky top:0（包含块=整页高），
 *     任何祖先不设 overflow:hidden；「压缩两态」由 window scroll 监听切 .md-stuck。
 *
 * 四合一（不拆工具页）：插件中心只出现一个入口，内部四个页签（牌库/复习/统计/设置）
 * 由 mountApp 持有的壳做页内切换 —— 切签不重建页眉、不丢吸顶滚动态、事件监听零泄漏，
 * 且支持 goTool('memo-deck', {tab:'memo-review'}) 带参直达某页签（提醒/快捷键/统计页都在用）。
 *
 * 存储分层（重要）：
 *   · 牌库 + 复习日志 → ctx.data（随账号云同步，换设备不丢）；
 *   · 复习会话现场/今日已提醒标记 → ctx.keep（本机状态槽，秒级变动不进云同步）；
 *   · 配置项 → manifest.config（插件中心自动渲染表单，ctx.config 读，带默认值回退）。
 *
 * 安装：插件中心 →「粘贴导入」→ 选择本文件（.js）或粘贴全部源码。
 * ============================================================ */
;(function () {
  'use strict'

  /* ════════════════════════ 0. 常量与元信息 ════════════════════════ */

  let VERSION = '1.0.0'
  /* 【站内适配 2026-10-22】ctx 必须落在 `plugin.<完整 pid>.<场景>` 才能进站内 AI 注册表
   * （`plugin.memo` 只有两段，registerAiCtx 会拒）。注册后吃得到站内思考档位、公式契约与用量分桶。 */
  let AI_CTX = 'plugin.memo-deck.cards'

  /* 四个工具页 id（= 路由 /tool/<id>，互相 goTool 跳转） */
  let T_DECK = 'memo-deck'       // 牌库
  let T_REVIEW = 'memo-review'   // 今日复习
  let T_STATS = 'memo-stats'     // 记忆统计
  let T_PREFS = 'memo-prefs'     // 引擎设置

  /* 体积闸（与试卷提取插件同思路）：牌库随 Store 云同步，不设闸会堵死同步通道 */
  let DECK_MAX_CARDS = 4000          // 单库卡数上限
  let FRONT_MAX = 2000               // 卡面正文字上限
  let BACK_MAX = 4000                // 卡背正文字上限
  let LOG_MAX = 4000                 // 复习日志条数上限（滚动丢弃最旧）
  let GEN_MAX_CARDS = 60             // 单次 AI 制卡上限
  let IMPORT_MAX_CARDS = 500         // 单次导入上限

  /* SM-2 引擎参数（写成常量而不是散落魔法数：调参只改这里） */
  let AGAIN_MINUTES = 10             // 「重来」后几分钟回队（学习步长）
  let EASE_INIT = 2.5                // 初始难度因子
  let EASE_MIN = 1.3                 // 难度因子下限（SM-2 标准值）
  let EASE_MAX = 2.8                 // 难度因子上限（防止轻松卡无限膨胀）
  let MATURE_IVL = 21                // 间隔 ≥21 天视为「成熟卡」
  let HARD_F = 0.8                   // 「困难」间隔折扣
  let EASY_F = 1.35                  // 「轻松」间隔加成

  let GRADES = [
    { q: 0, key: 'again', label: '重来', hint: '10 分钟后回队', css: 'g-again' },
    { q: 3, key: 'hard', label: '困难', hint: '间隔 ×0.8', css: 'g-hard' },
    { q: 4, key: 'good', label: '良好', hint: '按 SM-2 排期', css: 'g-good' },
    { q: 5, key: 'easy', label: '轻松', hint: '间隔 ×1.35', css: 'g-easy' }
  ]

  let SUBJECTS = ['数学', '英语', '政治', '专业课', '其他']

  /* 内置示例卡包：空库 onboarding 一键载入。
   * 刻意选「跨科目、答案稳定共识」的考点 —— 不搬任何机构专属内容，换谁用都成立。 */
  let SAMPLE_DECK = [
    { f: '洛必达法则适用的极限型有哪些？', b: '① 0/0 型或 ∞/∞ 型；② 在去心邻域内可导且分母导数不为 0；③ 导数之比的极限存在（或为无穷大）。三者缺一不可。', s: '数学', t: ['高数', '极限'], h: '两个型 + 两个条件' },
    { f: '等价无穷小替换什么时候「不能」用在加减项？', b: '乘除因子可随意换；加减项只有当两项不是等价无穷小（差不为 0 阶）时才能各自替换，否则要泰勒展开到足够阶数。', s: '数学', t: ['高数', '极限'] },
    { f: '矩阵 A 可逆的等价条件（任写三条）', b: '① |A|≠0；② r(A)=n 满秩；③ Ax=0 只有零解；④ A 的特征值全不为 0；⑤ 可表为初等矩阵之积。', s: '数学', t: ['线代'] },
    { f: '英语阅读主旨题干扰项的三大特征？', b: '① 以偏概全（拿某段细节冒充主旨）；② 无中生有（原文没有的态度/结论）；③ 反着说（与作者态度相反）。正确项常是「各段共有的抽象上位词」。', s: '英语', t: ['阅读'] },
    { f: '「which」引导的非限制性定语从句，谓语动词单复数看什么？', b: '看关系词指代的先行词：指代前面整个句子时用单数；指代复数先行词用复数。不要被插入语或就近名词带偏。', s: '英语', t: ['语法'] },
    { f: '马原中「实践对认识的决定作用」体现在哪四个方面？', b: '① 实践是认识的来源；② 实践是认识发展的动力；③ 实践是检验认识真理性的唯一标准；④ 实践是认识的目的。', s: '政治', t: ['马原'] },
    { f: '毛中特「新民主主义革命三大法宝」是什么？相互关系？', b: '统一战线、武装斗争、党的建设。统一战线和武装斗争是两大武器，党的建设是掌握武器冲锋陷阵的英勇战士。', s: '政治', t: ['毛中特'] },
    { f: '专业课背书「艾宾浩斯表格」为什么常常坚持不下来？', b: '因为它的复习量是指数爆炸设计。更可持续的是 SM-2 式「按表现动态定间隔」—— 这正是本插件的引擎：该插件的复习页。', s: '专业课', t: ['方法论'], h: '指数爆炸 vs 动态间隔' },
    { f: '一道错题变成闪卡的标准流程？', b: '① 定位错因（概念不清/计算失误/审题偏差）；② 把错因改写成「提问式卡面」；③ 卡背只写纠正后的关键一步，不抄整题。', s: '其他', t: ['方法论'] },
    { f: '间隔重复中「困难」和「重来」的本质区别？', b: '「困难」=想起来了但费力，间隔打折后继续前进；「重来」=没想起来，进度清零、10 分钟后回队再考。 honesty 是算法的燃料。', s: '其他', t: ['方法论'], h: '想起来没？' }
  ]

  /* ════════════════════════ 1. 小工具 ════════════════════════ */

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
    })
  }
  function flat(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim() }
  function trunc(s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n) + '…' : s }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)) }
  function num(v, d) { let n = Number(v); return isFinite(n) ? n : d }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms) }) }
  function uid(p) { return (p || 'c') + Date.now().toString(36) + Math.random().toString(36).slice(2, 7) }

  /* 本地日期键 'YYYY-MM-DD'（复习打卡按本地时区算，不用 UTC——否则晚上学习会记到明天） */
  function dkey(t) {
    let d = t ? new Date(t) : new Date()
    let m = String(d.getMonth() + 1), day = String(d.getDate())
    return d.getFullYear() + '-' + (m.length < 2 ? '0' + m : m) + '-' + (day.length < 2 ? '0' + day : day)
  }
  function fmtDay(ts) {
    let d = new Date(ts), now = new Date()
    let today = dkey(), that = dkey(ts)
    if (that === today) return '今天'
    if (that === dkey(now.getTime() - 86400000)) return '昨天'
    return (d.getMonth() + 1) + '月' + d.getDate() + '日'
  }
  /* 相对到期文案：新卡 / 已到期 / n 分钟后 / 今天 / n 天后 / n 月后 */
  function dueText(card, now) {
    if (!card.studied) return '新卡'
    let diff = card.due - now
    if (diff <= 0) return '已到期'
    if (diff < 3600000) return Math.max(1, Math.round(diff / 60000)) + ' 分钟后'
    if (diff < 86400000) return fmtDay(card.due)
    let d = Math.round(diff / 86400000)
    if (d < 31) return d + ' 天后'
    return Math.round(d / 30.4) + ' 月后'
  }
  function debounce(fn, ms) {
    let t = null
    return function () {
      let args = arguments, self = this
      clearTimeout(t)
      t = setTimeout(function () { fn.apply(self, args) }, ms)
    }
  }
  /* 事件委托：root 内所有 [data-act] 点击统一分发，页签不用再各自绑一堆监听 */
  function delegate(root, map) {
    function h(ev) {
      let el = ev.target
      while (el && el !== root) {
        if (el.dataset && el.dataset.act != null) {
          let fn = map[el.dataset.act]
          if (fn) { fn(el, ev); return }
        }
        el = el.parentNode
      }
    }
    root.addEventListener('click', h)
    return function () { root.removeEventListener('click', h) }
  }
  /* 数字滚动动画（统计页用）：从 0 缓动到目标值，rAF 驱动 */
  function countUp(el, target, ms) {
    let t0 = null
    function step(t) {
      if (!t0) t0 = t
      let p = clamp((t - t0) / (ms || 700), 0, 1)
      let e = 1 - Math.pow(1 - p, 3)   // easeOutCubic
      el.textContent = String(Math.round(target * e))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  /* ════════════════════════ 2. SM-2 记忆引擎（纯函数，可单测） ════════════════════════
   * 与 anki-droid 同源的 SM-2 变体：
   *   · 评分四档：重来(0)/困难(3)/良好(4)/轻松(5) —— 1/2 两档键盘难以表达，不占位；
   *   · 难度因子 ease 走教科书公式 EF' = EF + (0.1 - (5-q)*(0.08 + (5-q)*0.02))，
   *     夹在 [EASE_MIN, EASE_MAX]；
   *   · 间隔：首过 1 天、二过 6 天（SM-2 标准），之后 I(n) = I(n-1) × EF，
   *     「困难」整体 ×0.8、「轻松」整体 ×1.35（防「困难=明天又见」劝退）；
   *   · 「重来」不推进进度：lapses+1、reps 清零、10 分钟后回队（学习步长）。
   * 纯函数约定：入参不改动，返回新卡对象 —— 调用方决定何时落库。
   */

  /* 新卡出厂状态 */
  function newCard(front, back, opts) {
    opts = opts || {}
    return {
      id: uid('c'),
      front: String(front || '').slice(0, FRONT_MAX),
      back: String(back || '').slice(0, BACK_MAX),
      subject: SUBJECTS.indexOf(opts.subject) >= 0 ? opts.subject : '其他',
      tags: Array.isArray(opts.tags) ? opts.tags.map(function (t) { return flat(t).slice(0, 20) }).filter(Boolean).slice(0, 6) : [],
      hint: String(opts.hint || '').slice(0, 200),
      created: Date.now(),
      /* —— 引擎字段 —— */
      studied: false,      // 是否学过（新卡=没学过）
      reps: 0,             // 连续成功次数
      lapses: 0,           // 失败次数
      ease: EASE_INIT,
      ivl: 0,              // 当前间隔（天）
      due: Date.now(),     // 到期时间戳（新卡立即可学）
      lastQ: null,         // 上次评分（统计页画记忆曲线用）
      lastSeen: 0
    }
  }

  /* 评分排期：返回 {card, requeue} —— requeue=true 表示本场内还要再见 */
  function schedule(card, q, now) {
    now = now || Date.now()
    let c = {}
    for (let k in card) c[k] = card[k]
    c.lastSeen = now
    c.lastQ = q
    c.reviews = (c.reviews || 0) + 1
    if (q < 3) {
      c.lapses = (c.lapses || 0) + 1
      c.reps = 0
      c.studied = true
      c.ivl = Math.max(1, c.ivl)   // 保持 1 天名义间隔，但回队由 due 决定
      c.due = now + AGAIN_MINUTES * 60000
      return { card: c, requeue: true, label: AGAIN_MINUTES + ' 分钟后回队' }
    }
    /* 教科书 ease 公式 */
    let ef = c.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    c.ease = clamp(ef, EASE_MIN, EASE_MAX)
    c.reps = (c.reps || 0) + 1
    c.studied = true
    let ivl
    if (c.reps === 1) ivl = 1            // 首过
    else if (c.reps === 2) ivl = 6       // 二过
    else ivl = Math.round(c.ivl * c.ease)
    if (q === 3) ivl = Math.max(1, Math.round(ivl * HARD_F))
    if (q === 5) ivl = Math.max(2, Math.round(ivl * EASY_F))
    c.ivl = ivl
    c.due = now + ivl * 86400000
    return { card: c, requeue: false, label: ivl >= 30 ? Math.round(ivl / 30.4) + ' 月后' : ivl + ' 天后' }
  }

  /* 今日待学队列：新卡（受 dailyNew 限）+ 到期复习卡（受 dailyReview 限），按到期时间升序 */
  function dueQueue(deck, now, dailyNew, dailyReview) {
    now = now || Date.now()
    let fresh = [], due = []
    deck.forEach(function (c) {
      if (!c.studied) fresh.push(c)
      else if (c.due <= now) due.push(c)
    })
    fresh.sort(function (a, b) { return a.created - b.created })
    due.sort(function (a, b) { return a.due - b.due })
    return {
      fresh: fresh.slice(0, Math.max(0, dailyNew)),
      freshLeft: Math.max(0, fresh.length - Math.max(0, dailyNew)),
      due: due.slice(0, Math.max(0, dailyReview)),
      dueLeft: Math.max(0, due.length - Math.max(0, dailyReview))
    }
  }

  /* —— 纯统计（统计页唯一数据源，视图不许自己另算一份） —— */

  /* 记忆保留率：近 days 天评过分的卡里，评分 ≥3 的占比 */
  function retentionOf(log, days, now) {
    now = now || Date.now()
    let from = now - days * 86400000, hit = 0, total = 0
    ;(log || []).forEach(function (e) {
      if (e.t >= from) { total++; if (e.q >= 3) hit++ }
    })
    return total ? Math.round((hit / total) * 100) : null   // null=样本不足
  }
  /* 连续学习天数：从今天（或昨天，允许当天还没学）往前数不断档 */
  function streakOf(log, now) {
    now = now || Date.now()
    let days = {}
    ;(log || []).forEach(function (e) { days[dkey(e.t)] = 1 })
    let cursor = new Date(now), n = 0
    if (!days[dkey(cursor.getTime())]) cursor = new Date(now - 86400000)  // 今天没学则从昨天起算
    while (days[dkey(cursor.getTime())]) {
      n++
      cursor = new Date(cursor.getTime() - 86400000)
    }
    return n
  }
  /* 近 n 天每日 {reviews, again}（画记忆曲线与热力图共用） */
  function dailyActivity(log, n, now) {
    now = now || Date.now()
    let out = []
    for (let i = n - 1; i >= 0; i--) {
      let dayStart = new Date(now - i * 86400000)
      out.push({ day: dkey(dayStart.getTime()), reviews: 0, again: 0, ts: dayStart.getTime() })
    }
    let idx = {}
    out.forEach(function (d, i) { idx[d.day] = i })
    ;(log || []).forEach(function (e) {
      let i = idx[dkey(e.t)]
      if (i == null) return
      out[i].reviews++
      if (e.q < 3) out[i].again++
    })
    return out
  }
  /* 未来 n 天到期预测（今天之后每天到几张） */
  function forecast(deck, n, now) {
    now = now || Date.now()
    let out = []
    for (let i = 1; i <= n; i++) out.push({ day: dkey(now + i * 86400000), n: 0 })
    deck.forEach(function (c) {
      if (!c.studied) return
      let day = dkey(c.due)
      for (let i = 0; i < n; i++) if (out[i].day === day) { out[i].n++; break }
    })
    return out
  }
  /* 卡库分布：新/学习/年轻/成熟 四态 */
  function deckBreakdown(deck) {
    let b = { new_: 0, learning: 0, young: 0, mature: 0, suspended: 0 }
    deck.forEach(function (c) {
      if (c.suspended) { b.suspended++; return }
      if (!c.studied) b.new_++
      else if (c.ivl < 1 || (c.lastQ != null && c.lastQ < 3)) b.learning++
      else if (c.ivl >= MATURE_IVL) b.mature++
      else b.young++
    })
    return b
  }

  /* ════════════════════════ 3. 数据层（唯一读写入口） ════════════════════════
   * 牌库/日志只准从这里进出 —— 视图层永远改完调 save()，
   * 杜绝「A 页面改了忘了存、B 页面读到旧值」的漂移。
   */

  function deckGet(ctx) {
    let d = ctx.data('deck')
    if (!Array.isArray(d)) return []
    return d.filter(function (c) { return c && c.id && typeof c.front === 'string' })
  }
  function deckSave(ctx, deck) {
    deck = deck.slice(0, DECK_MAX_CARDS)
    ctx.data('deck', deck)
    return deck.length
  }
  function logGet(ctx) {
    let l = ctx.data('log')
    return Array.isArray(l) ? l : []
  }
  function logPush(ctx, entries) {
    let l = logGet(ctx).concat(entries)
    if (l.length > LOG_MAX) l = l.slice(l.length - LOG_MAX)
    ctx.data('log', l)
  }
  function cardById(deck, id) {
    for (let i = 0; i < deck.length; i++) if (deck[i].id === id) return deck[i]
    return null
  }
  function deckSize(deck) {
    let n = 0
    deck.forEach(function (c) { n += (c.front || '').length + (c.back || '').length })
    return n
  }
  function fmtSize(n) {
    if (n < 1024) return n + ' B'
    if (n < 1048576) return (n / 1024).toFixed(1) + ' KB'
    return (n / 1048576).toFixed(2) + ' MB'
  }
  /* 纯文本制卡表导入：每行「卡面<TAB>卡背」，# 开头行视为注释跳过。
   * 兼容从 Excel/备忘录直接复制来的两列表格 —— JSON 之外的第二导入通道。 */
  function parseCardText(text) {
    let out = []
    String(text || '').split(/\r?\n/).forEach(function (line) {
      line = line.replace(/\s+$/, '')
      if (!line || line.charAt(0) === '#') return
      let i = line.indexOf('\t')
      if (i < 1) return
      out.push({ front: line.slice(0, i).trim(), back: line.slice(i + 1).trim() })
    })
    return out
  }

  /* AI 可用性统一探测（各页签同一入口，不重复写 try/catch 三段式） */
  function aiReady(ctx) {
    try { return !!(ctx.AI && typeof ctx.AI.chatJSON === 'function' && ctx.AI.configured()) } catch (e) { return false }
  }

  /* ════════════════════════ 4. 样式（注入 <style>，全插件单例） ════════════════════════
   * 为什么不走 manifest 的 css 字段：内核对该字段硬截 20000 字符（pluginbus.ts normalize），
   * 本插件动画样式远超这个量 —— 改为挂载时注入单例 <style>（按 id 去重，四页签共享一份），
   * 启用即注入、与 css 字段语义一致（样式随插件停用失去意义：页签本身就不渲染了）。
   * 所有规则挂在 .md-root 作用域下，不污染站内其它页面。
   */
  let CSS = [
    /* —— 令牌：全部映射站点设计令牌，夜间/晨岚主题自动跟随 —— */
    '.md-root{--md-acc:var(--blue,#2563eb);--md-acc2:var(--purple,#7c3aed);--md-ink:var(--text-primary,#1e2a4a);'
      + '--md-sub:var(--text-muted,#7c8aa8);--md-ink2:var(--text-secondary,#4a5670);--md-line:var(--line,#d8dde8);'
      + '--md-bg:var(--surface,#fff);--md-soft:var(--surface-muted,#f6f8fc);--md-ok:var(--ok,#0f7c4a);'
      + '--md-warn:var(--warn,#c47615);--md-danger:var(--danger,#d83b3b);'
      + '--md-ease:cubic-bezier(.22,.8,.26,1);'
      + 'color:var(--md-ink);font:14px/1.65 "PingFang SC","Microsoft YaHei",system-ui,sans-serif;'
      /* 出血到视口边缘（与原生页 eden/mind 同手法）：host 卡片的内边距被负 margin 抵消 */
      + 'margin:calc(var(--vp-t,16px)*-1) calc(var(--vp-x,16px)*-1) calc(var(--vp-b,24px)*-1);'
      + 'min-height:calc(100vh - 59px);display:flex;flex-direction:column;background:var(--md-soft)}',

    /* —— 吸顶页眉（机制与原生模块逐条对齐，见文件头注释） —— */
    /* ① hero 直接作为 .md-root 子级 → 包含块=整页高；② 祖先不设 overflow:hidden；
       ③ 玻璃底必须配 backdrop-filter，纯半透明会透出滚动内容显得脏 */
    '.md-hero{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:14px;flex-wrap:wrap;'
      + 'padding:14px calc(var(--vp-x,16px) + 18px);border:0;border-bottom:1px solid var(--md-line);border-radius:0;'
      + 'background:color-mix(in oklab,var(--md-bg) 84%,transparent);'
      + 'backdrop-filter:blur(18px) saturate(1.5);-webkit-backdrop-filter:blur(18px) saturate(1.5);'
      + 'box-shadow:0 1px 0 rgba(20,35,70,.03);'
      + 'max-height:150px;overflow:hidden;'
      + 'transition:padding .3s var(--md-ease),box-shadow .3s var(--md-ease),max-height .34s var(--md-ease)}',
    /* 「压缩两态」：滚动过阈值切 .md-stuck —— 原生页同款（tihe .thm-hero.thm-stuck） */
    '.md-hero.md-stuck{padding-top:8px;padding-bottom:8px;box-shadow:0 10px 26px -14px rgba(30,36,90,.28)}',
    /* 徽标：渐变圆角方块 + 「呼吸」微动画（只动 transform/opacity，GPU 合成零重排；
       停靠时同步缩小 —— 尺寸过渡与 hero 压缩同一曲线，视觉是「一整块在收」） */
    '.md-mark{width:46px;height:46px;border-radius:15px;flex:0 0 auto;color:#fff;position:relative;'
      + 'background:linear-gradient(135deg,var(--md-acc),var(--md-acc2));display:flex;align-items:center;justify-content:center;'
      + 'box-shadow:0 6px 18px color-mix(in oklab,var(--md-acc) 35%,transparent);'
      + 'transition:width .3s var(--md-ease),height .3s var(--md-ease),border-radius .3s var(--md-ease);animation:md-breathe 3.6s ease-in-out infinite}',
    '.md-mark svg{width:24px;height:24px}',
    '.md-hero.md-stuck .md-mark{width:34px;height:34px;border-radius:11px}',
    '@keyframes md-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}',
    '.md-titles{flex:1;min-width:150px}',
    '.md-title{font-size:19px;font-weight:800;letter-spacing:.3px;display:flex;align-items:center;gap:8px}',
    '.md-title em{font-style:normal;font-size:11px;font-weight:700;padding:2px 9px;border-radius:999px;'
      + 'background:var(--md-soft);color:var(--md-sub);border:1px solid var(--md-line)}',
    '.md-sub2{font-size:12px;color:var(--md-sub);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    /* 页眉导航：分段控件（原生 .thm-seg 同构） */
    '.md-nav{display:inline-flex;background:color-mix(in oklab,var(--md-soft) 75%,transparent);'
      + 'border:1px solid var(--md-line);border-radius:999px;padding:3px;gap:2px}',
    '.md-nav a{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 14px;border-radius:999px;'
      + 'font-size:12.5px;font-weight:600;color:var(--md-sub);cursor:pointer;user-select:none;white-space:nowrap;'
      + 'transition:color .18s,background .18s,box-shadow .18s,transform .18s}',
    '.md-nav a:hover{color:var(--md-ink);transform:translateY(-1px)}',
    '.md-nav a.on{background:var(--md-bg);color:var(--md-acc);box-shadow:0 2px 8px rgba(16,30,60,.13)}',
    /* 页眉统计 chips */
    '.md-hero-stats{display:flex;gap:7px;flex-wrap:wrap}',
    '.md-hchip{font-size:11.5px;padding:4px 11px;border-radius:999px;border:1px solid var(--md-line);'
      + 'background:color-mix(in oklab,var(--md-bg) 70%,transparent);color:var(--md-sub);white-space:nowrap}',
    '.md-hchip b{color:var(--md-ink);font-size:12.5px;margin:0 2px}',
    '.md-hchip.hot b{color:var(--md-warn)}',

    /* —— 内容区 ——
     * 【站内适配 2026-10-22】原本 max-width:1340px —— 比站点内容轨（1140）还宽 200px，
     * 真机实测 .md-body 溢出宿主 64px、把 .view 的左右留白吃光（与页眉错位）。
     * 改为吃宿主轨：宽度交给站点轨限，插件不再自带上限。 */
    '.md-body{flex:1 1 auto;width:100%;max-width:100%;margin:0 auto;box-sizing:border-box;'
      + 'padding:20px calc(var(--vp-x,16px) + 18px) 46px}',
    /* 进场交错上浮：卡片按行索引延迟出现（JS 写 --i 变量），只动 transform/opacity */
    '.md-card{background:var(--md-bg);border:1px solid var(--md-line);border-radius:16px;padding:18px;margin-bottom:14px;'
      + 'box-shadow:0 8px 24px rgba(20,35,70,.05);'
      + 'animation:md-rise .42s var(--md-ease) both;animation-delay:calc(var(--i,0)*45ms)}',
    '@keyframes md-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}',
    '.md-h{font-size:16px;font-weight:800;margin:0 0 4px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}',
    '.md-h em{font-style:normal;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;'
      + 'background:var(--md-soft);color:var(--md-sub);border:1px solid var(--md-line)}',
    '.md-desc{color:var(--md-sub);font-size:12.5px;line-height:1.75;margin-bottom:13px}',

    /* —— 工具行 / 按钮 —— */
    '.md-tools{display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin-bottom:13px}',
    '.md-btn{height:36px;padding:0 15px;border-radius:10px;border:1px solid var(--md-line);background:var(--md-bg);'
      + 'cursor:pointer;font-weight:600;font-size:13px;color:var(--md-ink2);font-family:inherit;position:relative;overflow:hidden;'
      + 'transition:transform .12s,border-color .16s,color .16s,box-shadow .16s,filter .16s}',
    '.md-btn:hover:not(:disabled){border-color:var(--md-acc);color:var(--md-acc);box-shadow:0 4px 12px rgba(37,99,235,.14);transform:translateY(-1px)}',
    '.md-btn:active:not(:disabled){transform:translateY(1px)}',
    '.md-btn:disabled{opacity:.45;cursor:not-allowed}',
    /* 主按钮：渐变 + 扫光（::after 平移，悬停触发一次） */
    '.md-btn.primary{background:linear-gradient(135deg,var(--md-acc),var(--md-acc2));color:#fff;border:0;'
      + 'box-shadow:0 6px 16px color-mix(in oklab,var(--md-acc) 30%,transparent)}',
    '.md-btn.primary:hover:not(:disabled){color:#fff;filter:brightness(1.06)}',
    '.md-btn.primary::after{content:"";position:absolute;top:0;left:-80%;width:50%;height:100%;'
      + 'background:linear-gradient(100deg,transparent,rgba(255,255,255,.35),transparent);transform:skewX(-20deg);transition:none}',
    '.md-btn.primary:hover::after{left:130%;transition:left .6s ease}',
    '.md-btn.danger{color:var(--md-danger);border-color:color-mix(in oklab,var(--md-danger) 30%,transparent)}',
    '.md-btn.danger:hover:not(:disabled){background:color-mix(in oklab,var(--md-danger) 8%,transparent);color:var(--md-danger)}',
    '.md-btn.sm{height:30px;padding:0 11px;font-size:12px;border-radius:9px}',
    '.md-seg{display:inline-flex;max-width:100%;overflow-x:auto;scrollbar-width:none;background:var(--md-soft);'
      + 'border:1px solid var(--md-line);border-radius:11px;padding:3px;gap:2px}',
    '.md-seg::-webkit-scrollbar{display:none}',
    /* 窄屏分段器不压缩文字：挤压时横向滚动（paper-extract px-seg 同坑同解） */
    '.md-seg button{border:0;background:none;font:600 12px/1 inherit;padding:7px 12px;border-radius:8px;cursor:pointer;'
      + 'color:var(--md-sub);font-family:inherit;flex:none;white-space:nowrap;transition:all .18s}',
    '.md-seg button.on{background:var(--md-bg);color:var(--md-ink);box-shadow:0 1px 4px rgba(16,30,60,.12)}',
    '.md-input,.md-sel,.md-ta{height:36px;border:1px solid var(--md-line);border-radius:10px;padding:0 11px;'
      + 'background:var(--md-bg);color:var(--md-ink);outline:none;font-size:13px;font-family:inherit;box-sizing:border-box;'
      + 'transition:border-color .16s,box-shadow .16s}',
    '.md-input:focus,.md-sel:focus,.md-ta:focus{border-color:var(--md-acc);box-shadow:0 0 0 3px color-mix(in oklab,var(--md-acc) 14%,transparent)}',
    '.md-ta{width:100%;min-height:90px;padding:10px;font:12.5px/1.7 var(--font-mono,monospace);resize:vertical}',
    '.md-search{width:210px;max-width:46vw}',
    '.md-msg{font-size:12px;color:var(--md-sub)}',
    '.md-msg.ok{color:var(--md-ok)}.md-msg.err{color:var(--md-danger)}',
    '.md-count{margin-left:auto;font-size:12px;color:var(--md-sub)}',

    /* —— 牌库卡（3D 翻转预览） —— */
    '.md-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}',
    '.md-fcard{perspective:1100px;height:168px;cursor:pointer}',
    '.md-fcard-in{position:relative;width:100%;height:100%;transform-style:preserve-3d;'
      + 'transition:transform .55s var(--md-ease)}',
    '.md-fcard.flipped .md-fcard-in{transform:rotateY(180deg)}',
    '.md-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;'
      + 'border:1px solid var(--md-line);border-radius:14px;background:var(--md-bg);padding:12px 13px;'
      + 'display:flex;flex-direction:column;gap:7px;overflow:hidden;'
      + 'box-shadow:0 4px 14px rgba(20,35,70,.05);transition:box-shadow .2s,border-color .2s}',
    '.md-fcard:hover .md-face{border-color:color-mix(in oklab,var(--md-acc) 45%,var(--md-line));box-shadow:0 10px 26px rgba(20,35,70,.1)}',
    '.md-face.back{transform:rotateY(180deg);background:var(--md-soft)}',
    '.md-ftext{flex:1;overflow:hidden;font-size:12.8px;line-height:1.7;white-space:pre-wrap;word-break:break-word}',
    '.md-fmeta{display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:11px;color:var(--md-sub)}',
    '.md-tag{display:inline-block;font-size:10.5px;border-radius:999px;padding:1px 8px;background:var(--md-soft);'
      + 'color:var(--md-ink2);border:1px solid var(--md-line)}',
    '.md-due{font-weight:700;padding:1px 8px;border-radius:999px;border:1px solid transparent}',
    '.md-due.new{background:color-mix(in oklab,var(--md-acc) 10%,transparent);color:var(--md-acc);border-color:color-mix(in oklab,var(--md-acc) 28%,transparent)}',
    '.md-due.now{background:color-mix(in oklab,var(--md-warn) 12%,transparent);color:var(--md-warn);border-color:color-mix(in oklab,var(--md-warn) 30%,transparent)}',
    '.md-due.far{color:var(--md-sub);border-color:var(--md-line)}',
    '.md-due.done{background:color-mix(in oklab,var(--md-ok) 10%,transparent);color:var(--md-ok);border-color:color-mix(in oklab,var(--md-ok) 28%,transparent)}',
    '.md-facts{display:flex;gap:5px;align-items:center;opacity:0;transition:opacity .18s}',
    '.md-fcard:hover .md-facts{opacity:1}',
    '.md-iconbtn{width:26px;height:26px;border-radius:8px;border:1px solid var(--md-line);background:var(--md-bg);'
      + 'cursor:pointer;font-size:13px;line-height:1;display:inline-flex;align-items:center;justify-content:center;'
      + 'transition:all .15s;color:var(--md-sub)}',
    '.md-iconbtn:hover{border-color:var(--md-acc);color:var(--md-acc);transform:translateY(-1px)}',
    '.md-iconbtn.del:hover{border-color:var(--md-danger);color:var(--md-danger)}',
    /* 批量管理模式：勾选态描边 + 整理条 */
    '.md-fcard.picked .md-face{border-color:var(--md-acc);box-shadow:0 0 0 2px color-mix(in oklab,var(--md-acc) 16%,transparent)}',
    '.md-editbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:13px;padding:9px 12px;'
      + 'border:1px dashed var(--md-line);border-radius:12px;background:var(--md-soft)}',
    '.md-pickall{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--md-sub);cursor:pointer;user-select:none}',
    '.md-pickall input{width:15px;height:15px;cursor:pointer;accent-color:var(--md-acc);margin:0}',

    /* —— 编辑器弹层（页面内自绘模态；灯箱/编辑共用一套遮罩） —— */
    '.md-modal{position:fixed;inset:0;z-index:9000;display:none;place-items:center;padding:22px;'
      + 'background:rgba(10,16,30,.5);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}',
    '.md-modal.on{display:grid;animation:md-fade .2s ease both}',
    '.md-modal-box{width:min(620px,94vw);max-height:88vh;overflow:auto;background:var(--md-bg);border:1px solid var(--md-line);'
      + 'border-radius:18px;padding:20px;box-shadow:0 30px 70px rgba(10,20,45,.35);'
      + 'animation:md-pop .28s var(--md-ease) both}',
    '@keyframes md-fade{from{opacity:0}to{opacity:1}}',
    '@keyframes md-pop{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:none}}',
    '.md-modal-h{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:800;margin-bottom:13px}',
    '.md-modal-h .x{margin-left:auto}',
    '.md-field{display:flex;flex-direction:column;gap:5px;font-size:12px;color:var(--md-sub);margin-bottom:11px}',
    '.md-chips{display:flex;gap:6px;flex-wrap:wrap;min-height:30px;padding:5px;border:1px solid var(--md-line);'
      + 'border-radius:10px;background:var(--md-bg);cursor:text}',
    '.md-chips input{border:0;outline:none;flex:1;min-width:90px;font:inherit;color:var(--md-ink);background:none}',
    '.md-chipx{display:inline-flex;align-items:center;gap:4px;font-size:11.5px;padding:3px 9px;border-radius:999px;'
      + 'background:color-mix(in oklab,var(--md-acc) 10%,transparent);color:var(--md-acc);animation:md-fade .18s ease both}',
    '.md-chipx i{font-style:normal;cursor:pointer;opacity:.7}.md-chipx i:hover{opacity:1}',

    /* —— AI 制卡骨架屏（生成等待期 shimmer） —— */
    '.md-skel{border:1px solid var(--md-line);border-radius:12px;padding:12px;margin-bottom:9px;'
      + 'background:linear-gradient(100deg,var(--md-soft) 40%,color-mix(in oklab,var(--md-bg) 65%,var(--md-soft)) 50%,var(--md-soft) 60%);'
      + 'background-size:200% 100%;animation:md-shimmer 1.3s linear infinite}',
    '.md-skel i{display:block;height:12px;border-radius:6px;background:color-mix(in oklab,var(--md-line) 55%,transparent);margin:7px 0}',
    '.md-skel i:nth-child(2){width:72%}.md-skel i:nth-child(3){width:45%}',
    '@keyframes md-shimmer{from{background-position:180% 0}to{background-position:-80% 0}}',
    '.md-genrow{display:flex;gap:9px;align-items:flex-start;padding:10px;border:1px solid var(--md-line);'
      + 'border-radius:12px;margin-bottom:9px;background:var(--md-bg);transition:border-color .16s,box-shadow .16s}',
    '.md-genrow:hover{border-color:color-mix(in oklab,var(--md-acc) 40%,var(--md-line))}',
    '.md-genrow.picked{border-color:var(--md-acc);box-shadow:0 0 0 2px color-mix(in oklab,var(--md-acc) 15%,transparent)}',
    '.md-genrow .b{flex:1;min-width:0}',
    '.md-genrow .f{font-size:12.8px;font-weight:700;word-break:break-word}',
    '.md-genrow .k{font-size:12px;color:var(--md-sub);margin-top:3px;white-space:pre-wrap;word-break:break-word}',

    /* —— 复习台 —— */
    '.md-stage{display:grid;grid-template-columns:270px 1fr;gap:16px;align-items:start}',
    '.md-sidecard{position:sticky;top:86px}',
    '.md-ringwrap{position:relative;width:132px;height:132px;margin:6px auto 4px}',
    '.md-ringwrap svg{transform:rotate(-90deg)}',
    '.md-ring-t{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}',
    '.md-ring-t b{font-size:26px;font-weight:800;line-height:1.1}',
    '.md-ring-t span{font-size:11px;color:var(--md-sub)}',
    '.md-ring-fg{transition:stroke-dashoffset .5s var(--md-ease)}',
    /* 复习大卡：点击翻面（与牌库同一套 3D 机制，更大的舞台） */
    '.md-bigcard{perspective:1400px;height:340px;cursor:pointer;user-select:none}',
    '.md-bigcard-in{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .6s var(--md-ease)}',
    '.md-bigcard.flipped .md-bigcard-in{transform:rotateY(180deg)}',
    '.md-bigface{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;'
      + 'border-radius:18px;border:1px solid var(--md-line);background:var(--md-bg);padding:26px 28px;'
      + 'display:flex;flex-direction:column;box-shadow:0 14px 38px rgba(20,35,70,.09);overflow:auto}',
    '.md-bigface.back{transform:rotateY(180deg);background:var(--md-soft)}',
    '.md-bigtext{flex:1;white-space:pre-wrap;word-break:break-word;font-size:16.5px;line-height:1.85;overflow:auto}',
    '.md-bighint{margin-top:10px;font-size:12px;color:var(--md-warn);background:color-mix(in oklab,var(--md-warn) 9%,transparent);'
      + 'border:1px solid color-mix(in oklab,var(--md-warn) 26%,transparent);border-radius:9px;padding:6px 11px}',
    '.md-bigfoot{display:flex;align-items:center;gap:8px;font-size:11.5px;color:var(--md-sub);flex-wrap:wrap}',
    '.md-flipcue{font-size:12px;color:var(--md-sub);text-align:center;margin-top:9px}',
    /* 评分按钮组：四个渐变色阶，悬停上浮，键盘 1-4 等效 */
    '.md-grades{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:13px}',
    '.md-grade{border:1px solid var(--md-line);border-radius:13px;background:var(--md-bg);padding:11px 8px;cursor:pointer;'
      + 'font-family:inherit;text-align:center;transition:transform .14s,box-shadow .18s,border-color .18s;'
      + 'animation:md-rise .34s var(--md-ease) both}',
    '.md-grade:hover{transform:translateY(-3px)}',
    '.md-grade b{display:block;font-size:14px;font-weight:800}',
    '.md-grade span{display:block;font-size:10.5px;color:var(--md-sub);margin-top:2px}',
    '.md-grade k{display:inline-block;font-size:10px;border:1px solid var(--md-line);border-radius:5px;padding:0 5px;margin-top:5px;color:var(--md-sub)}',
    '.md-grade.g-again:hover{border-color:var(--md-danger);box-shadow:0 8px 20px color-mix(in oklab,var(--md-danger) 22%,transparent)}',
    '.md-grade.g-again b{color:var(--md-danger)}',
    '.md-grade.g-hard:hover{border-color:var(--md-warn);box-shadow:0 8px 20px color-mix(in oklab,var(--md-warn) 22%,transparent)}',
    '.md-grade.g-hard b{color:var(--md-warn)}',
    '.md-grade.g-good:hover{border-color:var(--md-ok);box-shadow:0 8px 20px color-mix(in oklab,var(--md-ok) 22%,transparent)}',
    '.md-grade.g-good b{color:var(--md-ok)}',
    '.md-grade.g-easy:hover{border-color:var(--md-acc);box-shadow:0 8px 20px color-mix(in oklab,var(--md-acc) 22%,transparent)}',
    '.md-grade.g-easy b{color:var(--md-acc)}',
    /* 连续天数火焰：跳动 + 光晕脉冲 */
    '.md-flame{display:inline-flex;align-items:center;gap:5px;font-weight:800;color:var(--md-warn)}',
    '.md-flame .fi{display:inline-block;animation:md-flame 1.6s ease-in-out infinite;transform-origin:50% 90%}',
    '@keyframes md-flame{0%,100%{transform:scale(1) rotate(-3deg)}30%{transform:scale(1.14) rotate(3deg)}60%{transform:scale(.95) rotate(-2deg)}}',
    /* 会话结算 */
    '.md-result{grid-template-columns:repeat(auto-fit,minmax(130px,1fr));display:grid;gap:11px;margin:13px 0}',
    '.md-rstat{border:1px solid var(--md-line);border-radius:13px;padding:13px 15px;background:var(--md-bg);text-align:center}'
      + ';animation:md-rise .4s var(--md-ease) both;animation-delay:calc(var(--i,0)*70ms)}',
    '.md-rstat b{display:block;font-size:23px;font-weight:800;line-height:1.2}',
    '.md-rstat span{font-size:11px;color:var(--md-sub)}',

    /* —— 热力格（复习页 14 天 + 统计页全年共用） —— */
    '.md-heat{display:grid;grid-auto-flow:column;grid-template-rows:repeat(7,1fr);gap:3px}',
    '.md-heat i{width:13px;height:13px;border-radius:3.5px;background:var(--md-soft);border:1px solid var(--md-line);'
      + 'animation:md-cell .3s var(--md-ease) both;animation-delay:calc(var(--i,0)*6ms)}',
    '@keyframes md-cell{from{transform:scale(.4);opacity:0}to{transform:scale(1);opacity:1}}',
    '.md-heat i.l1{background:color-mix(in oklab,var(--md-acc) 22%,var(--md-bg));border-color:transparent}',
    '.md-heat i.l2{background:color-mix(in oklab,var(--md-acc) 45%,var(--md-bg));border-color:transparent}',
    '.md-heat i.l3{background:color-mix(in oklab,var(--md-acc) 70%,var(--md-bg));border-color:transparent}',
    '.md-heat i.l4{background:var(--md-acc);border-color:transparent}',

    /* —— 统计页 —— */
    '.md-statgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:14px}',
    '.md-stat{border:1px solid var(--md-line);border-radius:14px;padding:14px 16px;background:var(--md-bg);'
      + 'animation:md-rise .42s var(--md-ease) both;animation-delay:calc(var(--i,0)*50ms);transition:transform .18s,box-shadow .18s}',
    '.md-stat:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(20,35,70,.08)}',
    '.md-stat b{display:block;font-size:25px;font-weight:800;line-height:1.2}',
    '.md-stat span{font-size:11.5px;color:var(--md-sub)}',
    '.md-chart{width:100%;height:auto;display:block}',
    '.md-bars{display:flex;align-items:flex-end;gap:8px;height:120px;padding-top:8px}',
    '.md-bar{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:5px;min-width:0}',
    '.md-bar i{width:min(26px,70%);border-radius:6px 6px 3px 3px;background:linear-gradient(180deg,var(--md-acc),var(--md-acc2));'
      + 'height:0;transition:height .7s var(--md-ease)}',
    '.md-bar span{font-size:10px;color:var(--md-sub);white-space:nowrap}',
    '.md-bar.today i{background:linear-gradient(180deg,var(--md-warn),var(--md-danger))}',
    '.md-legend{display:flex;gap:14px;flex-wrap:wrap;font-size:11.5px;color:var(--md-sub);margin-top:9px}',
    '.md-legend em{font-style:normal;display:inline-flex;align-items:center;gap:5px}',
    '.md-legend em::before{content:"";width:9px;height:9px;border-radius:3px;background:var(--md-acc)}',
    '.md-legend em.warn::before{background:var(--md-warn)}',
    /* 分布条（四态占比，宽度由 JS 算好内联样式，过渡动画） */
    '.md-dist{display:flex;height:26px;border-radius:8px;overflow:hidden;border:1px solid var(--md-line)}',
    '.md-dist i{display:block;height:100%;width:0;transition:width .8s var(--md-ease)}',

    /* —— 空态 / 提示 / 体检 —— */
    '.md-empty{border:1.6px dashed var(--md-line);border-radius:16px;padding:34px 18px;text-align:center;'
      + 'color:var(--md-sub);font-size:13px;background:color-mix(in oklab,var(--md-bg) 55%,transparent)}',
    '.md-empty b{display:block;font-size:16px;color:var(--md-ink);margin-bottom:6px}',
    '.md-empty .ico{font-size:32px;display:block;margin-bottom:8px}',
    '.md-health{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:13px}',
    '.md-hcell{display:inline-flex;align-items:center;gap:7px;font-size:12px;padding:6px 12px;border-radius:999px;'
      + 'border:1px solid var(--md-line);background:var(--md-soft);color:var(--md-sub)}',
    '.md-hcell i{width:7px;height:7px;border-radius:50%;background:var(--md-sub)}',
    '.md-hcell.ok{color:var(--md-ok);border-color:color-mix(in oklab,var(--md-ok) 35%,transparent);background:color-mix(in oklab,var(--md-ok) 8%,transparent)}',
    '.md-hcell.ok i{background:var(--md-ok)}',
    '.md-hcell.no{color:var(--md-warn);border-color:color-mix(in oklab,var(--md-warn) 32%,transparent);background:color-mix(in oklab,var(--md-warn) 8%,transparent)}',
    '.md-hcell.no i{background:var(--md-warn)}',
    '.md-note{font-size:12px;color:var(--md-sub);line-height:1.8;margin-top:9px}',
    '.md-note code{background:var(--md-soft);border:1px solid var(--md-line);border-radius:5px;padding:1px 5px;font-family:var(--font-mono,monospace)}',
    '.md-kv{display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px dashed var(--md-line);font-size:12.8px}',
    '.md-kv:last-child{border-bottom:0}',
    '.md-kv b{font-weight:700}.md-kv span{color:var(--md-sub);text-align:right}',

    /* —— 彩带（会话完成庆祝，canvas 置顶一次性） —— */
    '.md-confetti{position:fixed;inset:0;pointer-events:none;z-index:99990}',

    /* —— 窄屏适配 —— */
    '@media (max-width:820px){.md-stage{grid-template-columns:1fr}.md-sidecard{position:static}'
      + '.md-bigcard{height:300px}.md-bigtext{font-size:15px}}',
    '@media (max-width:560px){.md-grades{grid-template-columns:repeat(2,1fr)}.md-search{width:100%;max-width:none}'
      + '.md-sub2{display:none}.md-hchip:nth-child(n+4){display:none}.md-grid{grid-template-columns:1fr 1fr}'
      + '.md-body{padding:14px calc(var(--vp-x,16px) + 10px) 34px}}',
    '@media (max-width:400px){.md-grid{grid-template-columns:1fr}.md-nav a{padding:0 10px;font-size:11.5px}}',
    /* 动效可及性：系统要求减少动效时，全部动画一次性关掉 */
    '@media (prefers-reduced-motion:reduce){.md-root *{animation:none!important;transition:none!important}}'
  ].join('\n')

  let STYLE_ID = 'md-styles'
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return
    let st = document.createElement('style')
    st.id = STYLE_ID
    st.textContent = CSS
    document.head.appendChild(st)
  }

  /* ════════════════════════ 5. 壳：吸顶页眉 + 页内导航 + 共享件 ════════════════════════ */

  let NAV = [
    { id: T_DECK, icon: '🃏', label: '牌库' },
    { id: T_REVIEW, icon: '⚡', label: '复习' },
    { id: T_STATS, icon: '📈', label: '统计' },
    { id: T_PREFS, icon: '⚙️', label: '设置' }
  ]

  /* 页眉图标（内联 SVG，不依赖站点图标库 —— 插件契约只承诺 ctx/window/document） */
  let MARK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'
    + '<rect x="3" y="6" width="13" height="15" rx="2.5"/><path d="M8 3.5h11a2 2 0 0 1 2 2V19"/>'
    + '<path d="M7 11h5M7 14.5h5M7 18h3"/></svg>'

  /* 页眉统计 chips：deck/log 现算（纯函数），各页签共用一份口径 */
  function heroChips(ctx) {
    let deck = deckGet(ctx), log = logGet(ctx), now = Date.now()
    let q = dueQueue(deck, now, 9999, 9999)
    let streak = streakOf(log, now)
    let mature = deckBreakdown(deck).mature
    return '<span class="md-hchip">总卡 <b>' + deck.length + '</b></span>'
      + '<span class="md-hchip">待复习 <b>' + q.due.length + '</b></span>'
      + '<span class="md-hchip">新卡 <b>' + q.fresh.length + '</b></span>'
      + '<span class="md-hchip' + (streak >= 3 ? ' hot' : '') + '">连续 <b>' + streak + '</b> 天</span>'
      + '<span class="md-hchip">已掌握 <b>' + mature + '</b></span>'
  }

  /* 页签元信息：id → 页眉副标题（页眉两态文案随页签切换） */
  let TAB_META = {}
  TAB_META[T_DECK] = { subtitle: '牌库 · 建卡 / AI 制卡 / 导入导出' }
  TAB_META[T_REVIEW] = { subtitle: '复习 · SM-2 间隔重复' }
  TAB_META[T_STATS] = { subtitle: '统计 · 记忆曲线 / 到期预测 / 全年打卡' }
  TAB_META[T_PREFS] = { subtitle: '设置 · 额度 / 体检 / 引擎 / 数据' }

  /* 吸顶「压缩两态」：window 滚动过 12px 给 hero 切 .md-stuck。
   * 原生模块同款机制；legacy 页滚 window（无内部滚动容器），监听 window 即可。
   * mount 返回的 destroy 必须解绑 —— 否则切页后监听泄漏，还会在别的页面乱切类名。 */
  function bindStuck(root) {
    let hero = root.querySelector('.md-hero')
    if (!hero) return function () { }
    function onScroll() {
      let on = (window.scrollY || window.pageYOffset || 0) > 12
      if (on !== hero.classList.contains('md-stuck')) hero.classList.toggle('md-stuck', on)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return function () { window.removeEventListener('scroll', onScroll) }
  }

  /* ═══════════ 四合一入口：唯一工具页，四个页签 ═══════════
   * 壳（吸顶页眉 + 页签导航）只建一次，由本入口持有；
   * 四个模块降级为「页签渲染器」：接收 body 容器，画自己的内容、委托自己的事件，
   * 返回 destroy。切页签 = 先调旧模块 destroy，再挂新模块 —— 事件/键盘监听零泄漏。
   * 为什么不拆四个工具页（试卷提取那套结论在这里被本插件否定）：
   * 四页共享同一套壳与页眉统计，合一后切页签不重建页眉、不丢吸顶滚动态，
   * 且插件中心只出现一个入口 —— 这正是「插件中心承载力」考察的另一种形态。 */
  function mountApp(el, ctx) {
    injectStyles()
    let tab = T_DECK
    let pending = {}            /* 带参跳入：统计页「去攻坚」→ 牌库按失误排序 */
    let curDestroy = null

    el.innerHTML = '<div class="md-root"><header class="md-hero"></header><main class="md-body"></main></div>'
    let root = el.querySelector('.md-root')
    let hero = root.querySelector('.md-hero')
    let bodyEl = root.querySelector('.md-body')

    function paintHero() {
      hero.innerHTML = '<div class="md-mark">' + MARK_SVG + '</div>'
        + '<div class="md-titles"><div class="md-title">记忆宫殿 <em>闪卡引擎 v' + VERSION + '</em></div>'
        + '<div class="md-sub2">' + esc((TAB_META[tab] || {}).subtitle || '') + '</div></div>'
        + '<nav class="md-nav">' + NAV.map(function (n) {
          return '<a data-act="tab" data-id="' + n.id + '" class="' + (n.id === tab ? 'on' : '') + '">' + n.icon + ' ' + n.label + '</a>'
        }).join('') + '</nav>'
        + '<div class="md-hero-stats">' + heroChips(ctx) + '</div>'
    }

    /* 传给各页签渲染器的上下文：
     * go() 页内切签（可带参，目标模块用 param() 取一次即清）；
     * refresh() 数据变了（建卡/评分/导入）→ 让页眉统计 chips 跟上。 */
    function envFor(t) {
      return {
        go: function (id, params) {
          if (params) pending[id] = params
          switchTo(id)
        },
        param: function () { let p = pending[t]; pending[t] = null; return p },
        refresh: paintHero
      }
    }

    function switchTo(id) {
      if (!TAB_META[id]) return
      if (curDestroy) { try { curDestroy() } catch (e) { } }
      tab = id
      paintHero()
      curDestroy = MODULES[id](bodyEl, ctx, envFor(id)) || null
    }

    let unbindNav = delegate(root, { tab: function (a) { switchTo(a.dataset.id) } })
    let offStuck = bindStuck(root)
    /* 带参跳入入口：外部 goTool('memo-deck', {tab:'memo-review'}) 直达某页签 */
    try {
      let p = typeof ctx.api.params === 'function' ? ctx.api.params() : null
      if (p && p.tab && TAB_META[p.tab]) tab = String(p.tab)
    } catch (e) { /* 无参跳入是常态 */ }
    switchTo(tab)

    return function destroy() {
      if (curDestroy) { try { curDestroy() } catch (e) { } }
      unbindNav()
      offStuck()
    }
  }

  /* 页签 → 渲染器 登记表（在四个模块定义之后求值，mountApp 运行时才会用到） */
  let MODULES = {}
  MODULES[T_DECK] = mountDeck
  MODULES[T_REVIEW] = mountReview
  MODULES[T_STATS] = mountStats
  MODULES[T_PREFS] = mountPrefs

  /* —— 共享小件 —— */

  /* 体检格（设置页 / AI 面板共用）：ok 绿 / no 黄 */
  function healthCell(ok, text) {
    return '<span class="md-hcell ' + (ok ? 'ok' : 'no') + '"><i></i>' + esc(text) + '</span>'
  }

  /* 页面内模态：open 返回 {close, box}；点遮罩/× 关闭，Esc 关闭 */
  function openModal(html) {
    let wrap = document.createElement('div')
    wrap.className = 'md-modal'
    wrap.innerHTML = '<div class="md-modal-box">' + html + '</div>'
    document.body.appendChild(wrap)
    function onKey(ev) { if (ev.key === 'Escape') close() }
    function close() {
      window.removeEventListener('keydown', onKey)
      wrap.remove()
    }
    wrap.addEventListener('mousedown', function (ev) { if (ev.target === wrap) close() })
    window.addEventListener('keydown', onKey)
    requestAnimationFrame(function () { wrap.classList.add('on') })
    return { close: close, box: wrap.querySelector('.md-modal-box'), wrap: wrap }
  }

  /* 彩带庆祝：手写 canvas 粒子（不引库）。约 1.6s 生命周期，结束自动清节点。 */
  function confetti() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let cv = document.createElement('canvas')
    cv.className = 'md-confetti'
    document.body.appendChild(cv)
    let g = cv.getContext('2d')
    let W = cv.width = window.innerWidth, H = cv.height = window.innerHeight
    let colors = ['#2563eb', '#7c3aed', '#0f7c4a', '#c47615', '#d83b3b', '#e8ae3f']
    let parts = []
    for (let i = 0; i < 130; i++) {
      parts.push({
        x: W / 2 + (Math.random() - 0.5) * W * 0.5,
        y: H * 0.32,
        vx: (Math.random() - 0.5) * 11,
        vy: -Math.random() * 11 - 4,
        s: Math.random() * 7 + 4,
        r: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        c: colors[i % colors.length]
      })
    }
    let t0 = null
    function frame(t) {
      if (!t0) t0 = t
      let el = (t - t0) / 1000
      g.clearRect(0, 0, W, H)
      let alive = false
      parts.forEach(function (p) {
        p.vy += 0.34; p.x += p.vx; p.y += p.vy; p.r += p.vr
        let a = clamp(1.4 - el, 0, 1)
        if (a <= 0 || p.y > H + 20) return
        alive = true
        g.save(); g.globalAlpha = a; g.translate(p.x, p.y); g.rotate(p.r)
        g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.62); g.restore()
      })
      if (alive && el < 2.2) requestAnimationFrame(frame)
      else cv.remove()
    }
    requestAnimationFrame(frame)
  }

  /* SVG 折线（记忆曲线）：点由调用方归一化到 viewBox 960×180，含渐变填充面积 */
  function linePath(points, w, h, pad) {
    /* points: [{x:0-1, y:0-1}]（y 已反转由调用方处理） */
    if (!points.length) return ''
    let sx = (w - pad * 2) / Math.max(1, points.length - 1)
    let d = ''
    points.forEach(function (p, i) {
      let x = pad + p.x * (w - pad * 2)
      let y = pad + (1 - p.y) * (h - pad * 2)
      d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1)
    })
    return d
  }
  function lineChart(points, color, fill) {
    let w = 960, h = 180, pad = 26
    let d = linePath(points, w, h, pad)
    if (!d) return ''
    let area = d + ' L' + (w - pad) + ' ' + (h - pad) + ' L' + pad + ' ' + (h - pad) + ' Z'
    return (fill ? '<path d="' + area + '" fill="' + color + '" opacity="0.12"/>' : '')
      + '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'
  }

  /* 热力格 HTML：entries [{day, n}] → 7 行网格，n 分 4 档；--i 做交错弹出 */
  function heatHtml(entries, now) {
    let max = 1
    entries.forEach(function (e) { if (e.n > max) max = e.n })
    let cells = entries.map(function (e, i) {
      let lvl = e.n <= 0 ? 0 : e.n <= max * 0.25 ? 1 : e.n <= max * 0.5 ? 2 : e.n <= max * 0.75 ? 3 : 4
      return '<i class="' + (lvl ? 'l' + lvl : '') + '" style="--i:' + i + '" title="' + e.day + ' · ' + e.n + ' 次"></i>'
    })
    return '<div class="md-heat">' + cells.join('') + '</div>'
  }

  /* ════════════════════════ 6. 页签①：牌库 ════════════════════════ */

  /* 卡面到期徽标样式：新/已到期/x天后/已掌握（暂停卡单独灰显） */
  function dueBadge(card, now) {
    if (card.suspended) return '<span class="md-due far">已暂停</span>'
    if (!card.studied) return '<span class="md-due new">新卡</span>'
    if (card.ivl >= MATURE_IVL && card.lastQ >= 3) return '<span class="md-due done">已掌握</span>'
    let diff = card.due - now
    if (diff <= 0) return '<span class="md-due now">' + dueText(card, now) + '</span>'
    return '<span class="md-due far">' + dueText(card, now) + '</span>'
  }

  /* manage=true 时卡角加勾选框（批量操作模式）；勾选状态由 picked 传入 */
  function cardHtml(card, now, i, manage, picked) {
    let tags = card.tags.map(function (t) { return '<span class="md-tag">#' + esc(t) + '</span>' }).join('')
    let facts = '<div class="md-facts">'
      + '<button class="md-iconbtn" data-act="edit" data-id="' + card.id + '" title="编辑">✏️</button>'
      + '<button class="md-iconbtn" data-act="suspend" data-id="' + card.id + '" title="' + (card.suspended ? '恢复' : '暂停（不再排期）') + '">' + (card.suspended ? '▶️' : '⏸️') + '</button>'
      + '<button class="md-iconbtn del" data-act="del" data-id="' + card.id + '" title="删除">🗑</button>'
      + '</div>'
    let pick = manage
      ? '<span class="md-pick" data-act="pick" data-id="' + card.id + '" title="勾选"><input type="checkbox" tabindex="-1" ' + (picked ? 'checked' : '') + ' style="accent-color:var(--md-acc)"></span>'
      : ''
    return '<div class="md-fcard' + (picked ? ' picked' : '') + '" data-act="flip" style="--i:' + Math.min(i || 0, 12) + '">'
      + '<div class="md-fcard-in">'
      + '<div class="md-face"><div class="md-fmeta" style="margin-bottom:0">' + pick + dueBadge(card, now) + '<span>' + esc(card.subject) + '</span>' + tags + '</div>'
      + '<div class="md-ftext">' + esc(card.front) + '</div><div class="md-fmeta">' + facts + '</div></div>'
      + '<div class="md-face back"><div class="md-ftext">' + esc(card.back) + '</div>'
      + (card.hint ? '<div class="md-bighint" style="margin-top:auto">💡 ' + esc(card.hint) + '</div>' : '')
      + '<div class="md-fmeta"><span>难度 ' + card.ease.toFixed(2) + ' · 连续成功 ' + card.reps + ' · 失败 ' + card.lapses + ' 次</span></div></div>'
      + '</div></div>'
  }

  /* 标签 chips 编辑器（模态内用）：input 回车成 chip，点 × 移除 */
  function wireTagChips(box, initial) {
    let wrap = box.querySelector('.md-chips')
    if (!wrap) return function () { return [] }
    let input = wrap.querySelector('input')
    function values() {
      return Array.prototype.map.call(wrap.querySelectorAll('.md-chipx'), function (c) {
        return c.dataset.v
      })
    }
    function add(v) {
      v = flat(v).slice(0, 20)
      if (!v || values().indexOf(v) >= 0 || values().length >= 6) return
      let s = document.createElement('span')
      s.className = 'md-chipx'
      s.dataset.v = v
      s.innerHTML = esc(v) + '<i data-x="1">×</i>'
      wrap.insertBefore(s, input)
    }
    ;(initial || []).forEach(add)
    function onKey(ev) {
      if (ev.key === 'Enter' || ev.key === ',') {
        ev.preventDefault()
        add(input.value); input.value = ''
      } else if (ev.key === 'Backspace' && !input.value) {
        let chips = wrap.querySelectorAll('.md-chipx')
        if (chips.length) chips[chips.length - 1].remove()
      }
    }
    function onClick(ev) {
      let x = ev.target
      if (x && x.dataset && x.dataset.x) x.parentNode.remove()
    }
    function onFocus() { input.focus() }
    input.addEventListener('keydown', onKey)
    wrap.addEventListener('click', onClick)
    wrap.addEventListener('mousedown', function (ev) { if (ev.target === wrap) onFocus() })
    return values
  }

  /* 卡片编辑器模态：新增/编辑同一张表单；onSave(front,back,subject,tags,hint) */
  function openEditor(opts, onSave) {
    let m = openModal(
      '<div class="md-modal-h">✏️ ' + (opts.card ? '编辑卡片' : '新建卡片')
      + '<button class="md-iconbtn x" data-x="1">×</button></div>'
      + '<div class="md-field"><span>卡面（问题 / 提示语）</span>'
      + '<textarea class="md-ta" data-f="front" rows="4" placeholder="例：洛必达法则的三个使用条件？">' + esc(opts.card ? opts.card.front : '') + '</textarea></div>'
      + '<div class="md-field"><span>卡背（答案）</span>'
      + '<textarea class="md-ta" data-f="back" rows="5" placeholder="例：①0/0 或 ∞/∞ 型；②去心邻域可导且分母导数不为 0；③导数比极限存在或为无穷。">' + esc(opts.card ? opts.card.back : '') + '</textarea></div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:11px">'
      + '<div class="md-field"><span>科目</span><select class="md-sel" data-f="subject" style="width:100%">'
      + SUBJECTS.map(function (s) { return '<option' + (opts.card && opts.card.subject === s ? ' selected' : (opts.subject === s ? ' selected' : '')) + '>' + s + '</option>' }).join('')
      + '</select></div>'
      + '<div class="md-field"><span>助记提示（可选，翻面后显示）</span><input class="md-input" data-f="hint" style="width:100%" placeholder="一眼想起的钩子" value="' + esc(opts.card ? opts.card.hint : '') + '"></div>'
      + '</div>'
      + '<div class="md-field"><span>标签（回车添加，最多 6 个）</span><div class="md-chips"><input placeholder="如 高数 · 极限"></div></div>'
      + '<div class="md-msg" data-f="msg"></div>'
      + '<div style="display:flex;gap:9px;justify-content:flex-end;margin-top:6px">'
      + '<button class="md-btn" data-x="1">取消</button>'
      + '<button class="md-btn primary" data-save="1">保存卡片</button></div>'
    )
    let getTags = wireTagChips(m.box, opts.card ? opts.card.tags : [])
    m.box.addEventListener('click', function (ev) {
      let t = ev.target
      if (t && t.dataset) {
        if (t.dataset.x) { m.close(); return }
        if (t.dataset.save) {
          let front = m.box.querySelector('[data-f=front]').value.trim()
          let back = m.box.querySelector('[data-f=back]').value.trim()
          let msg = m.box.querySelector('[data-f=msg]')
          if (flat(front).length < 2) { msg.className = 'md-msg err'; msg.textContent = '卡面太短 —— 至少写 2 个字。'; return }
          if (flat(back).length < 1) { msg.className = 'md-msg err'; msg.textContent = '卡背不能为空。'; return }
          onSave({
            front: front.slice(0, FRONT_MAX),
            back: back.slice(0, BACK_MAX),
            subject: m.box.querySelector('[data-f=subject]').value,
            tags: getTags(),
            hint: m.box.querySelector('[data-f=hint]').value.trim().slice(0, 200)
          })
          m.close()
        }
      }
    })
    let frontTa = m.box.querySelector('[data-f=front]')
    if (frontTa) frontTa.focus()
    return m
  }

  /* AI 制卡提示词：负例护栏 —— 只点类别不写具体书名/机构名（换份资料不失效），
   * 与试卷提取插件的 NOT_QUESTION 同一思路。 */
  let CARD_SCHEMA = '{"front":"卡面问题（一句话，能自答）","back":"卡背答案（≤80字，可含 $LaTeX$）","tags":["1-3个分类词"]}'
  let SYS_CARDS = '你是考研记忆教练。用户粘贴一段学习笔记，你要把它拆成若干张「问答闪卡」。'
    + '【铁律】①一卡一事：每张只考一个知识点，卡面必须是能独立回答的问题；'
    + '②不照搬整句当卡面 —— 卡面要「提问化」（例：笔记「洛必达法则需 0/0 型」→ 卡面「洛必达法则适用的极限型有哪些？」）；'
    + '③卡背只写答案本身，≤80 字，公式用 $LaTeX$；④定义/公式/易错点优先，例子和客套话不制卡；'
    + '⑤【不制卡内容】标题、目录、页码、版权/来源信息、「本章小结」式过渡句、与考试无关的寒暄；'
    + '⑥卡片数量服从素材：宁缺毋滥，同义重复合并。'
    + '只输出 JSON：{"cards":[' + CARD_SCHEMA + ']}'

  /* 页签渲染器：接收 body 容器 + env（go/refresh/param），返回 destroy。
   * 不再自建壳 —— 壳由 mountApp 持有，这里只画页签内容。 */
  function mountDeck(bodyEl, ctx, env) {
    let view = { q: '', subject: '全部', tag: '', sort: 'due', manage: false, sel: {} }
    /* 支持带参跳入：统计页「遗忘预警」→ env.go(T_DECK, {sort:'lapses'}) 直达「按失误」排序 */
    try {
      let p0 = env && typeof env.param === 'function' ? env.param() : null
      if (p0 && p0.sort) view.sort = String(p0.sort)
    } catch (e) { /* 无参跳入是常态 */ }
    let now = Date.now()

    function filtered(deck) {
      let list = deck.slice()
      if (view.subject !== '全部') list = list.filter(function (c) { return c.subject === view.subject })
      if (view.tag) list = list.filter(function (c) { return c.tags.indexOf(view.tag) >= 0 })
      if (view.q) {
        let q = view.q.toLowerCase()
        list = list.filter(function (c) {
          return (c.front + '\n' + c.back + '\n' + c.tags.join(' ')).toLowerCase().indexOf(q) >= 0
        })
      }
      if (view.sort === 'due') list.sort(function (a, b) { return (a.studied ? a.due : 0) - (b.studied ? b.due : 0) })
      else if (view.sort === 'new') list.sort(function (a, b) { return b.created - a.created })
      else if (view.sort === 'hard') list.sort(function (a, b) { return a.ease - b.ease })
      else if (view.sort === 'lapses') list.sort(function (a, b) { return b.lapses - a.lapses })
      return list
    }

    function allTags(deck) {
      let m = {}
      deck.forEach(function (c) { c.tags.forEach(function (t) { m[t] = 1 }) })
      return Object.keys(m).sort()
    }

    function bodyHtml() {
      let deck = deckGet(ctx)
      let list = filtered(deck)
      let tags = allTags(deck)
      let subjOpts = ['全部'].concat(SUBJECTS)
      return '<section class="md-card" style="--i:0">'
        + '<div class="md-h">🃏 牌库 <em>' + deck.length + ' 张 · ' + fmtSize(deckSize(deck)) + '</em></div>'
        + '<div class="md-desc">卡片是记忆的最小单元。点击卡片 3D 翻面预览；悬停出现编辑/暂停/删除。</div>'
        + '<div class="md-tools">'
        + '<input class="md-input md-search" data-f="q" placeholder="搜索卡面 / 卡背 / 标签…" value="' + esc(view.q) + '">'
        + '<div class="md-seg">' + subjOpts.map(function (s) {
          return '<button data-act="subj" data-v="' + esc(s) + '" class="' + (view.subject === s ? 'on' : '') + '">' + esc(s) + '</button>'
        }).join('') + '</div>'
        + '<select class="md-sel" data-f="tag"><option value="">全部标签</option>'
        + tags.map(function (t) { return '<option value="' + esc(t) + '"' + (view.tag === t ? ' selected' : '') + '>#' + esc(t) + '</option>' }).join('')
        + '</select>'
        + '<select class="md-sel" data-f="sort">'
        + '<option value="due"' + (view.sort === 'due' ? ' selected' : '') + '>按到期</option>'
        + '<option value="new"' + (view.sort === 'new' ? ' selected' : '') + '>按创建</option>'
        + '<option value="hard"' + (view.sort === 'hard' ? ' selected' : '') + '>按最难</option>'
        + '<option value="lapses"' + (view.sort === 'lapses' ? ' selected' : '') + '>按失误</option>'
        + '</select>'
        + '<span class="md-count">' + list.length + ' 张</span></div>'
        + '<div class="md-tools">'
        + '<button class="md-btn primary" data-act="new">＋ 新建卡片</button>'
        + '<button class="md-btn" data-act="ai">✨ AI 制卡</button>'
        + '<button class="md-btn" data-act="import">📥 导入</button>'
        + '<button class="md-btn" data-act="export">📤 导出</button>'
        + '<button class="md-btn' + (view.manage ? ' primary' : '') + '" data-act="manage">☑️ 批量</button>'
        + '<button class="md-btn" data-act="goreview">⚡ 去复习</button>'
        + '</div>'
        /* 批量操作条：默认收起，进管理模式才出现（与试卷提取「整理条」同一交互） */
        + (view.manage
          ? '<div class="md-editbar">'
          + '<label class="md-pickall" data-act="pickall"><input type="checkbox" tabindex="-1"> 全选本页</label>'
          + '<span class="md-count">已选 ' + Object.keys(view.sel).length + ' 张</span>'
          + '<button class="md-btn sm danger" data-act="bdel">🗑 删除所选</button>'
          + '<button class="md-btn sm" data-act="bsusp">⏸ 暂停所选</button>'
          + '<button class="md-btn sm" data-act="bres">▶️ 恢复所选</button>'
          + '<button class="md-btn sm" data-act="manage">✕ 退出</button>'
          + '</div>'
          : '')
        + (list.length
          ? '<div class="md-grid">' + list.map(function (c, i) { return cardHtml(c, now, i, view.manage, !!view.sel[c.id]) }).join('') + '</div>'
          : '<div class="md-empty"><span class="ico">🃏</span><b>这里还空着</b>'
          + (deck.length
            ? '没有匹配当前筛选的卡片 —— 换个关键词或科目。'
            : '建第一张卡，或点「✨ AI 制卡」把一段笔记变成一叠卡片。<div style="margin-top:12px">'
            + '<button class="md-btn" data-act="sample">🎁 载入 10 张示例卡（跨科目）</button></div>') + '</div>')
        + '</section>'
    }

    bodyEl.innerHTML = bodyHtml()
    let unbind = delegate(bodyEl, {
      flip: function (a) { if (view.manage) return; a.classList.toggle('flipped') },
      subj: function (a) { view.subject = a.dataset.v; repaint() },
      /* —— 批量管理模式 —— */
      manage: function () { view.manage = !view.manage; if (!view.manage) view.sel = {}; repaint() },
      pick: function (a, ev) {
        ev.stopPropagation()
        let id = a.dataset.id
        if (view.sel[id]) delete view.sel[id]; else view.sel[id] = 1
        repaint()
      },
      pickall: function (a, ev) {
        ev.stopPropagation()
        let list = filtered(deckGet(ctx))
        let all = list.every(function (c) { return view.sel[c.id] })
        if (all) view.sel = {}; else { view.sel = {}; list.forEach(function (c) { view.sel[c.id] = 1 }) }
        repaint()
      },
      bdel: function () {
        let ids = Object.keys(view.sel)
        if (!ids.length) { ctx.Toast.show('先勾选卡片', 'info', 1400); return }
        ctx.api.confirm('删除所选卡片？', '<div class="md-note" style="margin:0">将删除 <b>' + ids.length + '</b> 张卡，<b>不可恢复</b>（复习历史保留在统计里）。</div>', function () {
          deckSave(ctx, deckGet(ctx).filter(function (c) { return !view.sel[c.id] }))
          ctx.Toast.show('已删除 ' + ids.length + ' 张', 'success', 1500)
          view.sel = {}
          repaint()
        }, true)
      },
      bsusp: function () {
        let ids = Object.keys(view.sel)
        if (!ids.length) { ctx.Toast.show('先勾选卡片', 'info', 1400); return }
        let deck = deckGet(ctx), n = 0
        deck.forEach(function (c) { if (view.sel[c.id] && !c.suspended) { c.suspended = true; n++ } })
        deckSave(ctx, deck)
        ctx.Toast.show('已暂停 ' + n + ' 张（不再排期）', 'success', 1600)
        view.sel = {}; repaint()
      },
      bres: function () {
        let ids = Object.keys(view.sel)
        if (!ids.length) { ctx.Toast.show('先勾选卡片', 'info', 1400); return }
        let deck = deckGet(ctx), n = 0
        deck.forEach(function (c) { if (view.sel[c.id] && c.suspended) { c.suspended = false; n++ } })
        deckSave(ctx, deck)
        ctx.Toast.show('已恢复 ' + n + ' 张', 'success', 1600)
        view.sel = {}; repaint()
      },
      sample: function () {
        let deck = deckGet(ctx), n = 0
        SAMPLE_DECK.forEach(function (s) {
          if (deck.length >= DECK_MAX_CARDS) return
          deck.unshift(newCard(s.f, s.b, { subject: s.s, tags: s.t, hint: s.h }))
          n++
        })
        deckSave(ctx, deck)
        ctx.Toast.show('已载入 ' + n + ' 张示例卡 —— 去「⚡ 复习」体验流程', 'success', 2600)
        ctx.log('载入示例卡包 ' + n + ' 张')
        repaint()
      },
      new: function () { openEditor({ subject: view.subject !== '全部' ? view.subject : '其他' }, function (v) {
        let deck = deckGet(ctx)
        if (deck.length >= DECK_MAX_CARDS) { ctx.Toast.show('牌库已满（' + DECK_MAX_CARDS + ' 张上限）—— 先删一些旧卡', 'warn', 2600); return }
        deck.unshift(newCard(v.front, v.back, v))
        deckSave(ctx, deck)
        ctx.log('新建卡片：' + trunc(v.front, 24))
        ctx.Toast.show('已加入牌库', 'success', 1400)
        repaint()
      }) },
      edit: function (a, ev) {
        ev.stopPropagation()
        let card = cardById(deckGet(ctx), a.dataset.id)
        if (!card) return
        openEditor({ card: card }, function (v) {
          let deck = deckGet(ctx)
          for (let i = 0; i < deck.length; i++) if (deck[i].id === card.id) {
            deck[i] = Object.assign({}, deck[i], v)
            break
          }
          deckSave(ctx, deck)
          ctx.Toast.show('已保存', 'success', 1200)
          repaint()
        })
      },
      del: function (a, ev) {
        ev.stopPropagation()
        let card = cardById(deckGet(ctx), a.dataset.id)
        if (!card) return
        ctx.api.confirm('删除这张卡？', '<div class="md-note" style="margin:0 0 6px">' + esc(trunc(card.front, 60)) + '</div><b>删除后不可恢复</b>（复习历史保留在统计里）。', function () {
          deckSave(ctx, deckGet(ctx).filter(function (c) { return c.id !== card.id }))
          ctx.Toast.show('已删除', 'success', 1200)
          repaint()
        }, true)
      },
      suspend: function (a, ev) {
        ev.stopPropagation()
        let deck = deckGet(ctx)
        for (let i = 0; i < deck.length; i++) if (deck[i].id === a.dataset.id) {
          deck[i].suspended = !deck[i].suspended
          ctx.Toast.show(deck[i].suspended ? '已暂停排期' : '已恢复排期', 'info', 1400)
          break
        }
        deckSave(ctx, deck)
        repaint()
      },
      export: function () {
        let deck = deckGet(ctx)
        ctx.api.download('memo-deck-' + dkey() + '.json', JSON.stringify({ app: 'memo-deck', version: VERSION, exported: dkey(), cards: deck }, null, 2), 'application/json')
        ctx.log('导出牌库 ' + deck.length + ' 张')
      },
      import: function () {
        ctx.api.readFile('.json,.txt,.tsv,.csv').then(function (f) {
          let cards = null
          try {
            let data = JSON.parse(f.text)
            if (Array.isArray(data)) cards = data
            else if (data && Array.isArray(data.cards)) cards = data.cards
          } catch (e) {
            /* 不是 JSON → 按「卡面⇥卡背」纯文本制卡表解析（第二导入通道） */
            cards = parseCardText(f.text)
          }
          if (!Array.isArray(cards) || !cards.length) {
            ctx.Toast.show('没读到卡片 —— 支持插件 JSON 或「卡面⇥卡背」逐行文本', 'warn', 2800)
            return
          }
          let deck = deckGet(ctx), added = 0
          cards.slice(0, IMPORT_MAX_CARDS).forEach(function (c) {
            if (!c || typeof c.front !== 'string' || typeof c.back !== 'string') return
            if (flat(c.front).length < 2 || !flat(c.back)) return
            if (deck.length >= DECK_MAX_CARDS) return
            deck.unshift(newCard(c.front, c.back, c))
            added++
          })
          deckSave(ctx, deck)
          ctx.Toast.show('导入 ' + added + ' 张卡' + (added < cards.length ? '（超上限或缺字段的被跳过）' : ''), added ? 'success' : 'warn', 2400)
          repaint()
        }).catch(function () { /* 用户取消选文件，静默 */ })
      },
      goreview: function () { env.go(T_REVIEW) },
      ai: function () { openAiPanel() }
    })

    /* 输入类控件（搜索/标签/排序）不走 data-act 委托，单独绑 */
    function bindInputs() {
      let q = bodyEl.querySelector('[data-f=q]')
      let tag = bodyEl.querySelector('[data-f=tag]')
      let sort = bodyEl.querySelector('[data-f=sort]')
      if (q) q.addEventListener('input', debounce(function () { view.q = q.value; repaint(true) }, 180))
      if (tag) tag.addEventListener('change', function () { view.tag = tag.value; repaint() })
      if (sort) sort.addEventListener('change', function () { view.sort = sort.value; repaint() })
    }

    /* AI 制卡面板（模态）：粘贴笔记 → 生成 → 勾选 → 入库 */
    function openAiPanel() {
      if (!aiReady(ctx)) { ctx.Toast.show('请先在设置里配置 AI 接口', 'warn', 2600); return }
      let m = openModal(
        '<div class="md-modal-h">✨ AI 制卡 <em style="font-style:normal;font-size:11px;color:var(--md-sub);font-weight:600">笔记 → 问答闪卡</em>'
        + '<button class="md-iconbtn x" data-x="1">×</button></div>'
        + '<div class="md-health">' + healthCell(true, 'AI 已配置') + healthCell(true, '单次最多 ' + GEN_MAX_CARDS + ' 张') + '</div>'
        + '<div class="md-field"><span>粘贴笔记（讲义/错题解析/考点清单均可）</span>'
        + '<textarea class="md-ta" data-f="notes" rows="8" placeholder="把一段笔记粘到这里，AI 会把它拆成问答闪卡…"></textarea></div>'
        + '<div style="display:flex;gap:11px;align-items:center;flex-wrap:wrap">'
        + '<select class="md-sel" data-f="subject">' + SUBJECTS.map(function (s) { return '<option' + (s === '数学' ? ' selected' : '') + '>' + s + '</option>' }).join('') + '</select>'
        + '<input class="md-input" data-f="want" type="number" min="3" max="' + GEN_MAX_CARDS + '" value="12" style="width:90px" title="目标卡数">'
        + '<button class="md-btn primary" data-gen="1">生成卡片</button>'
        + '<span class="md-msg" data-f="msg"></span></div>'
        + '<div data-f="out" style="margin-top:13px"></div>'
        + '<div style="display:none;gap:9px;justify-content:flex-end;margin-top:12px" data-f="bar">'
        + '<button class="md-btn" data-all="1">全选/清空</button>'
        + '<button class="md-btn primary" data-in="1">导入选中</button></div>'
      )
      let out = m.box.querySelector('[data-f=out]')
      let bar = m.box.querySelector('[data-f=bar]')
      let msg = m.box.querySelector('[data-f=msg]')
      let genCards = []
      m.box.addEventListener('click', function (ev) {
        let t = ev.target
        if (!t || !t.dataset) return
        if (t.dataset.x) { m.close(); return }
        if (t.dataset.gen) {
          let notes = m.box.querySelector('[data-f=notes]').value.trim()
          if (flat(notes).length < 20) { msg.className = 'md-msg err'; msg.textContent = '笔记太短 —— 至少 20 个字，AI 才有拆卡空间。'; return }
          let want = clamp(parseInt(m.box.querySelector('[data-f=want]').value, 10) || 12, 3, GEN_MAX_CARDS)
          let subject = m.box.querySelector('[data-f=subject]').value
          msg.className = 'md-msg'; msg.textContent = '生成中…'
          out.innerHTML = '<div class="md-skel"><i></i><i></i><i></i></div><div class="md-skel"><i></i><i></i><i></i></div>'
          ctx.AI.chatJSON(SYS_CARDS + '\n目标卡数约 ' + want + ' 张，科目归「' + subject + '」。', notes, null,
            { ctx: AI_CTX, noTools: true, cache: false, timeout: 180000, maxTokens: 6000 })
            .then(function (r) {
              let cards = (r && r.cards) || []
              cards = cards.filter(function (c) { return c && flat(c.front).length >= 2 && flat(c.back) })
                .slice(0, GEN_MAX_CARDS)
              if (!cards.length) { out.innerHTML = ''; msg.className = 'md-msg err'; msg.textContent = 'AI 没有产出有效卡片 —— 换一段更「知识密度高」的笔记试试。'; return }
              genCards = cards.map(function (c) { return { front: c.front, back: c.back, tags: Array.isArray(c.tags) ? c.tags : [] } })
              msg.className = 'md-msg ok'; msg.textContent = '生成 ' + genCards.length + ' 张 —— 勾选后导入。'
              paintGen()
              bar.style.display = 'flex'
              ctx.log('AI 制卡 ' + genCards.length + ' 张（' + subject + '）')
            })
            .catch(function (e) {
              out.innerHTML = ''
              msg.className = 'md-msg err'
              msg.textContent = '生成失败：' + trunc(e && e.message || e, 60)
            })
        }
        if (t.dataset.pickrow != null) {
          let row = t.closest('.md-genrow')
          if (row) row.classList.toggle('picked')
        }
        if (t.dataset.all) {
          let rows = out.querySelectorAll('.md-genrow')
          let allPicked = out.querySelectorAll('.md-genrow.picked').length === rows.length
          rows.forEach(function (r) { r.classList.toggle('picked', !allPicked) })
        }
        if (t.dataset.in) {
          let picked = []
          out.querySelectorAll('.md-genrow.picked').forEach(function (r) { picked.push(genCards[num(r.dataset.i)]) })
          if (!picked.length) { msg.className = 'md-msg err'; msg.textContent = '先勾选要导入的卡片。'; return }
          let deck = deckGet(ctx), n = 0
          picked.forEach(function (c) {
            if (deck.length >= DECK_MAX_CARDS) return
            deck.unshift(newCard(c.front, c.back, { subject: m.box.querySelector('[data-f=subject]').value, tags: c.tags }))
            n++
          })
          deckSave(ctx, deck)
          ctx.Toast.show('已导入 ' + n + ' 张卡', 'success', 1800)
          m.close()
          repaint()
        }
      })
      function paintGen() {
        out.innerHTML = genCards.map(function (c, i) {
          return '<div class="md-genrow picked" data-pickrow="1" data-i="' + i + '" style="--i:' + Math.min(i, 10) + '">'
            + '<input type="checkbox" checked style="margin-top:2px;accent-color:var(--md-acc)">'
            + '<div class="b"><div class="f">' + esc(c.front) + '</div><div class="k">' + esc(c.back) + '</div></div></div>'
        }).join('')
      }
      function num(v) { return parseInt(v, 10) || 0 }
    }

    function repaint(keepFocus) {
      let active = document.activeElement
      let selStart = active && active.selectionStart
      let val = active && active.value
      bodyEl.innerHTML = bodyHtml()
      bindInputs()
      if (env && typeof env.refresh === 'function') env.refresh()   /* 数据变了，页眉统计跟上 */
      if (keepFocus) {
        let q = bodyEl.querySelector('[data-f=q]')
        if (q) { q.focus(); if (typeof selStart === 'number') { try { q.setSelectionRange(selStart, selStart) } catch (e) { } if (val) q.value = val } }
      }
    }

    bindInputs()
    return function destroy() { unbind() }
  }

  /* ════════════════════════ 7. 页签②：今日复习 ════════════════════════
   * 会话状态机：idle → running → done。
   * 「重来」卡 10 分钟后回队 —— 队尾重排由 schedule() 的 due 决定，本场内活卡队列
   * （alive）维护「本场还要见的卡」；会话日志结束时一次性 logPush（减少云同步写次数）。
   */

  function mountReview(bodyEl, ctx, env) {
    /* prefs：配置项读法与插件中心表单联动（带默认值回退） */
    let dailyNew = clamp(num(ctx.config('dailyNew'), 15), 0, 200)
    let dailyReview = clamp(num(ctx.config('dailyReview'), 80), 0, 500)

    let S = null   /* 会话状态；null=未开始 */

    /* —— 态 A：待开始 —— */
    function idleHtml() {
      let deck = deckGet(ctx), log = logGet(ctx), now = Date.now()
      let q = dueQueue(deck.filter(function (c) { return !c.suspended }), now, dailyNew, dailyReview)
      let ret = retentionOf(log, 30, now)
      let activity = dailyActivity(log, 14, now)
      let total = q.fresh.length + q.due.length
      let streak = streakOf(log, now)
      let head = '<section class="md-card" style="--i:0">'
        + '<div class="md-h">⚡ 今日复习 <em>' + dkey(now) + '</em></div>'
      if (!total) {
        return head + '<div class="md-empty"><span class="ico">🎉</span><b>今日无事可做</b>'
          + (q.freshLeft + q.dueLeft > 0
            ? '今日额度（新卡 ' + dailyNew + ' / 复习 ' + dailyReview + '）已用完 —— 明天再来，间隔重复的价值就在「等」。'
            : '没有到期的卡片。去「牌库」加几张卡，或粘贴笔记「✨ AI 制卡」。')
          + '<div style="margin-top:12px"><button class="md-btn" data-act="godeck">🃏 去牌库</button> '
          + '<button class="md-btn" data-act="gostats">📈 看统计</button></div></div></section>'
          + '<section class="md-card" style="--i:1"><div class="md-h">近 14 天</div>' + heatHtml(activity, now) + '</section>'
      }
      return head
        + '<div class="md-desc">SM-2 间隔重复：记得越牢，下次见面越远。'
        + (streak ? ' <span class="md-flame"><span class="fi">🔥</span>连续 ' + streak + ' 天</span>' : '') + '</div>'
        + '<div class="md-result">'
        + '<div class="md-rstat" style="--i:0"><b style="color:var(--md-warn)">' + q.due.length + '</b><span>到期复习</span></div>'
        + '<div class="md-rstat" style="--i:1"><b style="color:var(--md-acc)">' + q.fresh.length + '</b><span>今日新卡</span></div>'
        + '<div class="md-rstat" style="--i:2"><b>' + (ret == null ? '—' : ret + '%') + '</b><span>30 天保留率</span></div>'
        + '</div>'
        + (q.dueLeft + q.freshLeft > 0 ? '<div class="md-note">超出今日额度的 ' + (q.dueLeft + q.freshLeft) + ' 张已自动顺延 —— 细水长流比一次刷爆有效。</div>' : '')
        + '<div style="margin-top:14px;display:flex;gap:9px;flex-wrap:wrap">'
        + '<button class="md-btn primary" data-act="start" style="height:42px;padding:0 26px;font-size:14.5px">▶ 开始今日复习（' + total + ' 张）</button>'
        + '</div></section>'
        + '<section class="md-card" style="--i:1"><div class="md-h">近 14 天打卡</div>' + heatHtml(activity, now) + '</section>'
    }

    /* —— 态 B：会话进行中 —— */

    /* 取当前该见的卡：优先复习卡（按到期），新卡穿插其后（每隔 3 张复习插 1 张新卡，
     * 避免「开头连学 15 张新卡」的疲惫峰值 —— 交错是 FSRS/Anki 社区共识）。 */
    function buildQueue(deck, now) {
      let q = dueQueue(deck.filter(function (c) { return !c.suspended }), now, dailyNew, dailyReview)
      let mix = [], di = 0, fi = 0
      while (di < q.due.length || fi < q.fresh.length) {
        let steps = 3
        while (steps-- > 0 && di < q.due.length) mix.push(q.due[di++].id)
        if (fi < q.fresh.length) mix.push(q.fresh[fi++].id)
      }
      return { order: mix, freshCount: q.fresh.length, dueCount: q.due.length, deck: deck }
    }

    function sessionHtml() {
      let card = cardById(S.deck, S.order[S.ptr])
      let total = S.order.length
      let done = S.answered
      let pct = total ? Math.round((done / (total + S.requeueCount)) * 100) : 0
      /* 进度环：r=54 → 周长 ≈ 339.3 */
      let C = 2 * Math.PI * 54
      let off = C * (1 - clamp(done / Math.max(1, total + S.requeueCount), 0, 1))
      let cardInner = card
        ? '<div class="md-bigcard' + (S.flipped ? ' flipped' : '') + '" data-act="flip">'
          + '<div class="md-bigcard-in">'
          + '<div class="md-bigface"><div class="md-bigtext">' + esc(card.front) + '</div>'
          /* 助记提示是「回忆钩子」，放卡面（帮你想起来），不是放卡背（那就泄密了） */
          + (card.hint ? '<div class="md-bighint">💡 ' + esc(card.hint) + '</div>' : '')
          + '<div class="md-bigfoot"><span class="md-tag">' + esc(card.subject) + '</span>'
          + card.tags.map(function (t) { return '<span class="md-tag">#' + esc(t) + '</span>' }).join('')
          + '<span style="margin-left:auto">' + (card.studied ? '复习 · 间隔 ' + card.ivl + ' 天' : '新卡首见') + '</span></div></div>'
          + '<div class="md-bigface back"><div class="md-bigtext">' + esc(card.back) + '</div>'
          + '<div class="md-bigfoot"><span>连续成功 ' + card.reps + ' · 失败 ' + card.lapses + ' 次 · 难度 ' + card.ease.toFixed(2) + '</span></div></div>'
          + '</div></div>'
        : ''
      let grades = S.flipped
        ? '<div class="md-grades">' + GRADES.map(function (g, i) {
            return '<button class="md-grade ' + g.css + '" data-act="grade" data-q="' + g.q + '" style="--i:' + i + '">'
              + '<b>' + g.label + '</b><span>' + g.hint + '</span><k>按 ' + (i + 1) + '</k></button>'
          }).join('') + '</div>'
        : '<div class="md-flipcue">点击卡片或按空格键翻面</div>'
      return '<section class="md-card" style="--i:0"><div class="md-stage">'
        + '<aside class="md-sidecard">'
        + '<div class="md-ringwrap">'
        + '<svg width="132" height="132" viewBox="0 0 132 132">'
        + '<circle cx="66" cy="66" r="54" fill="none" stroke="var(--md-line)" stroke-width="10"/>'
        + '<circle class="md-ring-fg" cx="66" cy="66" r="54" fill="none" stroke="url(#mdgrad)" stroke-width="10" stroke-linecap="round"'
        + ' stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/>'
        + '<defs><linearGradient id="mdgrad" x1="0" y1="0" x2="1" y2="1">'
        + '<stop offset="0" stop-color="var(--md-acc)"/><stop offset="1" stop-color="var(--md-acc2)"/></linearGradient></defs>'
        + '</svg>'
        + '<div class="md-ring-t"><b>' + pct + '%</b><span>' + done + ' / ' + (total + S.requeueCount) + '</span></div>'
        + '</div>'
        + '<div class="md-desc" style="text-align:center;margin-bottom:10px">剩余 ' + (total - S.ptr) + ' 张 · 本场回队 ' + S.requeueCount + '</div>'
        + '<div style="text-align:center"><button class="md-btn sm" data-act="quit">结束本场（进度已计入）</button></div>'
        + '</aside>'
        + '<div>' + cardInner + grades + '</div>'
        + '</div></section>'
    }

    /* —— 态 C：结算 —— */
    function doneHtml() {
      let secs = Math.max(1, Math.round((S.endAt - S.startAt) / 1000))
      let accuracy = S.graded ? Math.round((S.graded - S.again) / S.graded * 100) : null
      let activity = dailyActivity(logGet(ctx), 14, Date.now())
      return '<section class="md-card" style="--i:0">'
        + '<div class="md-h">🎉 本场完成 <em>用时 ' + Math.floor(secs / 60) + ' 分 ' + (secs % 60) + ' 秒</em></div>'
        + '<div class="md-result">'
        + '<div class="md-rstat" style="--i:0"><b style="color:var(--md-acc)">' + S.graded + '</b><span>已评卡</span></div>'
        + '<div class="md-rstat" style="--i:1"><b style="color:var(--md-danger)">' + S.again + '</b><span>重来</span></div>'
        + '<div class="md-rstat" style="--i:2"><b>' + (accuracy == null ? '—' : accuracy + '%') + '</b><span>正确率</span></div>'
        + '<div class="md-rstat" style="--i:3"><b>' + S.newLearned + '</b><span>新卡首过</span></div>'
        + '</div>'
        + '<div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:6px">'
        + '<button class="md-btn primary" data-act="again2">⚡ 再学一轮（到期才排）</button>'
        + '<button class="md-btn" data-act="gostats">📈 看记忆曲线</button>'
        + '<button class="md-btn" data-act="godeck">🃏 回牌库</button>'
        + '</div></section>'
        + '<section class="md-card" style="--i:1"><div class="md-h">近 14 天打卡</div>' + heatHtml(activity) + '</section>'
    }

    function paint() {
      let html = !S ? idleHtml() : (S.done ? doneHtml() : sessionHtml())
      bodyEl.innerHTML = html
      if (env && typeof env.refresh === 'function') env.refresh()   /* 评分落库后页眉统计跟上 */
      /* 统计数字滚动（结算页的已评卡数） */
      if (S && S.done) {
        let b = bodyEl.querySelector('.md-rstat b')
        if (b) countUp(b, S.graded, 650)
      }
    }

    function start() {
      let deck = deckGet(ctx)
      let b = buildQueue(deck, Date.now())
      if (!b.order.length) { ctx.Toast.show('没有到期的卡片', 'info', 1600); return }
      S = {
        deck: deck, order: b.order, ptr: 0, flipped: false,
        answered: 0, graded: 0, again: 0, requeueCount: 0, newLearned: 0,
        entries: [], startAt: Date.now(), endAt: 0, done: false
      }
      ctx.keep.set('session', { open: true, at: Date.now() })
      paint()
    }

    /* 评分落子：唯一改库入口 —— 改卡 + 记日志 + 推进指针 */
    function grade(q) {
      if (!S || S.done) return
      let card = cardById(S.deck, S.order[S.ptr])
      if (!card) { S.ptr++; next(); return }
      let wasNew = !card.studied
      let r = schedule(card, q, Date.now())
      /* 写回主库 */
      for (let i = 0; i < S.deck.length; i++) if (S.deck[i].id === card.id) { S.deck[i] = r.card; break }
      S.entries.push({ t: Date.now(), id: card.id, q: q })
      S.graded++
      if (q < 3) S.again++
      if (wasNew && q >= 3) S.newLearned++
      ctx.Toast.show(r.label, q < 3 ? 'warn' : 'success', 1100)
      /* 即时落库（每张一存）：刷新/切页/浏览器崩了，已评进度都不丢。
       * 日志先并入云端再清空缓冲，避免重复 push。 */
      deckSave(ctx, S.deck)
      logPush(ctx, S.entries)
      S.entries = []
      if (r.requeue) {
        /* 本场回队：插到「剩余 3 张之后」的位置 —— 立刻重考是机械记忆，隔几张再考才有效 */
        S.order.splice(Math.min(S.ptr + 4, S.order.length), 0, card.id)
        S.requeueCount++
      }
      S.answered++
      S.flipped = false
      next()
    }

    function next() {
      /* 跳过已暂停/已删除的卡 */
      while (S.ptr < S.order.length) {
        let c = cardById(S.deck, S.order[S.ptr])
        if (c && !c.suspended) break
        S.ptr++
      }
      if (S.ptr >= S.order.length) {
        /* 结束：进度已逐张落库，这里只收尾状态（彩带 + 结算页） */
        if (S.entries.length) { logPush(ctx, S.entries); S.entries = [] }
        deckSave(ctx, S.deck)
        S.done = true
        S.endAt = Date.now()
        ctx.keep.del('session')
        ctx.log('复习完成：' + S.graded + ' 张，重来 ' + S.again)
        /* 结算页重绘 + 彩带庆祝（≥5 张才放，两三张的小场不打扰） */
        paint()
        if (S.graded >= 5) confetti()
      } else {
        paint()
      }
    }

    function quit() {
      if (!S || S.done) return
      ctx.api.confirm('结束本场？', '<div class="md-note" style="margin:0">已评的 <b>' + S.graded + '</b> 张已逐张存好，未评的不受影响。</div>', function () {
        if (S.entries.length) { logPush(ctx, S.entries); S.entries = [] }
        deckSave(ctx, S.deck)
        S.done = true
        S.endAt = Date.now()
        ctx.keep.del('session')
        ctx.log('提前结束复习：' + S.graded + ' 张')
        paint()
      })
    }

    bodyEl.innerHTML = idleHtml()
    let unbind = delegate(bodyEl, {
      start: start,
      flip: function () { if (S && !S.done) { S.flipped = !S.flipped; paint() } },
      grade: function (a) { grade(num(a.dataset.q, 4)) },
      quit: quit,
      again2: function () { S = null; paint() },
      godeck: function () { env.go(T_DECK) },
      gostats: function () { env.go(T_STATS) }
    })
    paint()

    /* 键盘：空格翻面、1-4 评分（仅本页签存活时生效，切签/离开自动解绑） */
    function onKey(ev) {
      if (!S || S.done) return
      let tag = (ev.target && ev.target.tagName) || ''
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (ev.code === 'Space') { ev.preventDefault(); S.flipped = !S.flipped; paint() }
      else if (S.flipped && ev.key >= '1' && ev.key <= '4') { grade(GRADES[num(ev.key, 4) - 1].q) }
    }
    window.addEventListener('keydown', onKey)

    return function destroy() {
      window.removeEventListener('keydown', onKey)
      /* destroy = 断开 UI，不掐会话：已评进度已逐张写库，重开页签重建队列即可 */
      unbind()
    }
  }

  /* ════════════════════════ 8. 页签③：记忆统计 ════════════════════════ */

  function mountStats(bodyEl, ctx, env) {
    let RANGE = 30
    let now = Date.now()
    let deck = deckGet(ctx), log = logGet(ctx)

    let b = deckBreakdown(deck)
    let total = deck.length || 1
    let activity = dailyActivity(log, RANGE, now)
    let ret = retentionOf(log, 30, now)
    let ret7 = retentionOf(log, 7, now)
    let streak = streakOf(log, now)
    let fc = forecast(deck, 7, now)
    let fcMax = Math.max(1, fc.reduce(function (m, d) { return Math.max(m, d.n) }, 0))
    let reviewedTotal = log.length
    let mins = Math.round(log.reduce(function (a, e) { return a + (e.sec || 8) }, 0) / 60)

    /* 记忆曲线：近 30 天每日评分量（柱=总量隐含在热力图，这里画正确率折线 + 评分量面积） */
    function curveSvg() {
      let w = 960, h = 180, pad = 30
      let acc = activity.map(function (d) {
        return d.reviews ? Math.round(((d.reviews - d.again) / d.reviews) * 100) : null
      })
      let pts = []
      activity.forEach(function (d, i) {
        if (acc[i] == null) return
        pts.push({ x: i / (activity.length - 1), y: acc[i] / 100 })
      })
      let grid = ''
      for (let g = 0; g <= 4; g++) {
        let y = pad + (1 - g / 4) * (h - pad * 2)
        grid += '<line x1="' + pad + '" y1="' + y + '" x2="' + (w - pad) + '" y2="' + y + '" stroke="var(--md-line)" stroke-width="1" stroke-dasharray="3 5"/>'
          + '<text x="' + (pad - 8) + '" y="' + (y + 4) + '" font-size="11" fill="var(--md-sub)" text-anchor="end">' + (g * 25) + '%</text>'
      }
      let dots = pts.map(function (p) {
        let x = pad + p.x * (w - pad * 2), y = pad + (1 - p.y) * (h - pad * 2)
        return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3.4" fill="var(--md-acc)" stroke="var(--md-bg)" stroke-width="1.5"/>'
      }).join('')
      return '<svg class="md-chart" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" style="min-height:150px">'
        + grid + lineChart(pts, 'var(--md-acc)', true) + dots + '</svg>'
        + '<div class="md-legend"><em>每日正确率（≥良好占比）</em><span>悬停牌库可按「最难」排序攻坚</span></div>'
    }

    /* 未来 7 天到期柱图 */
    function forecastBars() {
      return '<div class="md-bars">' + fc.map(function (d, i) {
        let today = d.n > 0 && i === 0
        return '<div class="md-bar' + (i === 0 ? ' today' : '') + '">'
          + '<span>' + d.n + '</span>'
          + '<i data-h="' + Math.round((d.n / fcMax) * 100) + '"></i>'
          + '<span>' + d.day.slice(5).replace('-', '/') + '</span></div>'
      }).join('') + '</div>'
    }

    /* 卡库四态分布条 */
    let DIST_META = [
      { k: 'new_', label: '新卡', color: 'var(--md-acc)' },
      { k: 'learning', label: '学习中', color: 'var(--md-warn)' },
      { k: 'young', label: '年轻', color: 'var(--md-acc2)' },
      { k: 'mature', label: '成熟', color: 'var(--md-ok)' }
    ]
    function distBar() {
      let segs = DIST_META.map(function (m) {
        let pct = Math.round((b[m.k] / total) * 100)
        if (!pct) return ''
        /* 宽度过渡动画：先写 0，挂载后由 JS 推到目标值（CSS 只负责过渡曲线） */
        return '<i data-w="' + pct + '" style="width:0;background:' + m.color + '" title="' + m.label + ' ' + b[m.k] + ' 张"></i>'
      }).join('')
      let legend = DIST_META.map(function (m) {
        return '<em style="--md-acc:' + m.color + '">' + m.label + ' ' + b[m.k] + '</em>'
      }).join('')
      return '<div class="md-dist">' + segs + '</div><div class="md-legend">' + legend + '</div>'
    }

    /* 全年热力：52 周 × 7 天，拿 dailyActivity 太贵 —— 直接扫日志按天聚合 */
    function yearHeat() {
      let days = {}
      log.forEach(function (e) { let k = dkey(e.t); days[k] = (days[k] || 0) + 1 })
      let cells = []
      let today = new Date()
      /* 从 364 天前那个周一起排，保证列对齐（auto-flow column + 7 行） */
      let start = new Date(today.getTime() - 363 * 86400000)
      let offset = (start.getDay() + 6) % 7   /* 周一=0 */
      for (let i = 0; i < offset; i++) cells.push({ n: -1 })
      for (let d = 0; d < 364; d++) {
        let t = start.getTime() + d * 86400000
        cells.push({ day: dkey(t), n: days[dkey(t)] || 0 })
      }
      let max = 1
      cells.forEach(function (c) { if (c.n > max) max = c.n })
      return '<div class="md-heat" style="grid-template-rows:repeat(7,1fr)">' + cells.map(function (c, i) {
        if (c.n < 0) return '<i style="visibility:hidden;--i:' + (i % 49) + '"></i>'
        let lvl = c.n <= 0 ? 0 : c.n <= max * 0.25 ? 1 : c.n <= max * 0.5 ? 2 : c.n <= max * 0.75 ? 3 : 4
        return '<i class="' + (lvl ? 'l' + lvl : '') + '" style="--i:' + (i % 49) + '" title="' + c.day + ' · ' + c.n + ' 次"></i>'
      }).join('') + '</div>'
    }

    /* 遗忘预警：失败次数最多的 5 张学过的卡 —— 间隔重复里最值得人工干预的信号。
     * 点「去攻坚」带参跳牌库并自动切「按失误」排序（ctx.api.params 通道）。 */
    function warnSection() {
      let warns = deck.filter(function (c) { return c.studied && c.lapses > 0 && !c.suspended })
        .sort(function (a, b) { return b.lapses - a.lapses }).slice(0, 5)
      if (!warns.length) return ''
      return '<section class="md-card" style="--i:4"><div class="md-h">⚠️ 遗忘预警 <em>失败次数 Top ' + warns.length + '</em></div>'
        + '<div class="md-desc">这些卡反复「重来」—— 要么是卡背写太长记不住，要么是卡面表述有歧义。点「去攻坚」逐张改写。</div>'
        + warns.map(function (c, i) {
          return '<div class="md-kv" style="--i:' + i + '"><b>' + esc(trunc(c.front, 42)) + '</b>'
            + '<span>失败 ' + c.lapses + ' 次 · 难度 ' + c.ease.toFixed(2) + '</span></div>'
        }).join('')
        + '<div style="margin-top:12px"><button class="md-btn" data-act="warnfix">🔧 去牌库按「失误」排序攻坚</button></div>'
        + '</section>'
    }

    let body =
      '<section class="md-card" style="--i:0"><div class="md-h">📈 总览 <em>近 ' + RANGE + ' 天</em></div>'
      + '<div class="md-statgrid">'
      + '<div class="md-stat" style="--i:0"><b data-count="' + deck.length + '">0</b><span>牌库总量</span></div>'
      + '<div class="md-stat" style="--i:1"><b data-count="' + reviewedTotal + '">0</b><span>累计评分</span></div>'
      + '<div class="md-stat" style="--i:2"><b>' + (ret == null ? '—' : '<i data-count="' + ret + '">0</i>%') + '</b><span>30 天保留率</span></div>'
      + '<div class="md-stat" style="--i:3"><b>' + (ret7 == null ? '—' : '<i data-count="' + ret7 + '">0</i>%') + '</b><span>7 天保留率</span></div>'
      + '<div class="md-stat" style="--i:4"><b class="md-flame"><span class="fi">🔥</span><i data-count="' + streak + '">0</i></b><span>连续天数</span></div>'
      + '<div class="md-stat" style="--i:5"><b data-count="' + mins + '">0</b><span>累计分钟（估）</span></div>'
      + '</div>'
      + distBar()
      + '</section>'
      + '<section class="md-card" style="--i:1"><div class="md-h">🧠 记忆曲线 <em>每日正确率</em></div>' + curveSvg() + '</section>'
      + '<section class="md-card" style="--i:2"><div class="md-h">📅 未来 7 天到期 <em>峰值 ' + fcMax + ' 张/天</em></div>' + forecastBars()
      + '<div class="md-note">柱图在挂载后长高 —— 峰值日考虑减量，谷底日适合加新卡。</div></section>'
      + '<section class="md-card" style="--i:3"><div class="md-h">🗓️ 全年打卡 <em>' + Math.min(364, log.length ? 364 : 0) + ' 天窗口</em></div>'
      + (log.length ? yearHeat() : '<div class="md-empty"><b>还没有数据</b>完成一场复习后，这里会长出你的打卡地图。</div>')
      + '</section>'
      + warnSection()

    let sh = { root: bodyEl }   // 动画段统一走 sh.root，少改几行
    bodyEl.innerHTML = body
    let unbind = delegate(bodyEl, {
      goreview: function () { env.go(T_REVIEW) },
      warnfix: function () { env.go(T_DECK, { sort: 'lapses' }) }
    })

    /* 挂载后动画：数字滚动 + 分布条/柱图宽度过渡 */
    sh.root.querySelectorAll('[data-count]').forEach(function (n) {
      countUp(n, num(n.dataset.count, 0), 750)
    })
    sh.root.querySelectorAll('.md-dist i').forEach(function (i) {
      requestAnimationFrame(function () { i.style.width = i.dataset.w + '%' })  /* 0 → 目标值，CSS 过渡生效 */
    })
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        sh.root.querySelectorAll('.md-bar i').forEach(function (i) { i.style.height = (num(i.dataset.h, 0)) + '%' })
      })
    })
    return function destroy() { unbind() }
  }

  /* ════════════════════════ 9. 页签④：引擎设置 ════════════════════════ */

  function mountPrefs(bodyEl, ctx, env) {
    let deck = deckGet(ctx), log = logGet(ctx)

    function bodyHtml() {
      let ai = aiReady(ctx)
      let q = dueQueue(deck.filter(function (c) { return !c.suspended }), Date.now(), 9999, 9999)
      return '<section class="md-card" style="--i:0">'
        + '<div class="md-h">⚙️ 每日额度</div>'
        + '<div class="md-desc">在插件中心 → 本插件「配置」里改；改完即生效，无需刷新。</div>'
        + '<div class="md-kv"><span>每日新卡上限</span><b>' + num(ctx.config('dailyNew'), 15) + ' 张</b></div>'
        + '<div class="md-kv"><span>每日复习上限</span><b>' + num(ctx.config('dailyReview'), 80) + ' 张</b></div>'
        + '<div class="md-kv"><span>提醒时刻</span><b>' + esc(String(ctx.config('remindAt') || '20:30')) + ' 后</b></div>'
        + '<div class="md-kv"><span>悬停牌库按「最难」攻坚</span><b>牌库页排序选「按最难」</b></div>'
        + '</section>'
        + '<section class="md-card" style="--i:1"><div class="md-h">🩺 体检</div>'
        + '<div class="md-health">'
        + healthCell(ai, ai ? 'AI 已配置（制卡可用）' : 'AI 未配置（制卡不可用，手工建卡不受影响）')
        + healthCell(deck.length > 0, deck.length ? '牌库 ' + deck.length + ' 张 · ' + fmtSize(deckSize(deck)) : '牌库为空')
        + healthCell(deck.length < DECK_MAX_CARDS, deck.length < DECK_MAX_CARDS ? '容量正常（上限 ' + DECK_MAX_CARDS + '）' : '已达容量上限')
        + healthCell(log.length < LOG_MAX, '日志 ' + log.length + ' / ' + LOG_MAX + ' 条')
        + healthCell(q.due.length === 0, q.due.length ? '今日有 ' + q.due.length + ' 张到期' : '今日无到期卡')
        + '</div></section>'
        + '<section class="md-card" style="--i:2"><div class="md-h">🧮 引擎说明</div>'
        + '<div class="md-desc">SM-2 间隔重复（Anki 同源变体）：评分四档（重来/困难/良好/轻松），'
        + '难度因子 EF′ = EF + (0.1 − (5−q)(0.08 + (5−q)·0.02))，夹在 [' + EASE_MIN + ', ' + EASE_MAX + ']；'
        + '首过 1 天、二过 6 天，之后 I(n) = I(n−1) × EF，「困难」×' + HARD_F + '、「轻松」×' + EASY_F + '；'
        + '「重来」' + AGAIN_MINUTES + ' 分钟后回队且不推进进度；间隔 ≥ ' + MATURE_IVL + ' 天计「已掌握」。</div>'
        + '<div class="md-kv"><span>重来回队间隔</span><b>' + AGAIN_MINUTES + ' 分钟（隔 3 张再考）</b></div>'
        + '<div class="md-kv"><span>初始 / 边界难度因子</span><b>' + EASE_INIT + ' / ' + EASE_MIN + ' ~ ' + EASE_MAX + '</b></div>'
        + '<div class="md-kv"><span>数据存放</span><b>牌库随云同步 · 会话现场只留本机</b></div>'
        + '</section>'
        + '<section class="md-card" style="--i:3"><div class="md-h">🗃️ 数据管理</div>'
        + '<div class="md-desc">牌库与日志存在本插件的云同步空间里。导出做备份，导入可迁移到其它设备。</div>'
        + '<div class="md-tools">'
        + '<button class="md-btn" data-act="export">📤 导出全部（JSON）</button>'
        + '<button class="md-btn" data-act="import">📥 导入备份</button>'
        + '<button class="md-btn" data-act="sample">🎁 载入示例卡包</button>'
        + '<button class="md-btn danger" data-act="wipe">🗑 清空牌库与日志</button>'
        + '</div>'
        + '<div class="md-msg" data-f="msg"></div></section>'
    }

    bodyEl.innerHTML = bodyHtml()
    let unbind = delegate(bodyEl, {
      sample: function () {
        let cur = deckGet(ctx), n = 0
        SAMPLE_DECK.forEach(function (s) {
          if (cur.length >= DECK_MAX_CARDS) return
          cur.unshift(newCard(s.f, s.b, { subject: s.s, tags: s.t, hint: s.h }))
          n++
        })
        deckSave(ctx, cur)
        deck = cur
        ctx.Toast.show('已载入 ' + n + ' 张示例卡', 'success', 1800)
        ctx.log('设置页载入示例卡包 ' + n + ' 张')
        repaint()
      },
      export: function () {
        ctx.api.download('memo-deck-backup-' + dkey() + '.json', JSON.stringify({ app: 'memo-deck', version: VERSION, exported: dkey(), cards: deck, log: log }, null, 2), 'application/json')
        ctx.log('导出备份（牌库 ' + deck.length + ' 张）')
      },
      import: function () {
        ctx.api.readFile('.json').then(function (f) {
          let data
          try { data = JSON.parse(f.text) } catch (e) { ctx.Toast.show('不是合法 JSON 文件', 'warn', 2200); return }
          let n1 = 0, n2 = 0
          if (Array.isArray(data.cards)) {
            let cur = deckGet(ctx)
            data.cards.slice(0, DECK_MAX_CARDS).forEach(function (c) {
              if (!c || typeof c.front !== 'string' || !flat(c.front) || typeof c.back !== 'string' || !flat(c.back)) return
              if (cur.length >= DECK_MAX_CARDS) return
              cur.unshift(newCard(c.front, c.back, c)); n1++
            })
            deckSave(ctx, cur)
          }
          if (Array.isArray(data.log)) {
            ctx.data('log', data.log.slice(-LOG_MAX)); n2 = Math.min(data.log.length, LOG_MAX)
          }
          ctx.Toast.show('导入完成：' + n1 + ' 张卡 / ' + n2 + ' 条日志（已合并，不覆盖）', 'success', 2600)
          ctx.log('导入备份：+' + n1 + ' 卡 / +' + n2 + ' 日志')
        }).catch(function () { })
      },
      wipe: function () {
        ctx.api.confirm('清空全部数据？', '<div class="md-note" style="margin:0">将删除 <b>' + deck.length + '</b> 张卡与 <b>' + log.length + '</b> 条复习日志，<b>不可恢复</b>。建议先「导出全部」。</div>', function () {
          ctx.data('deck', [])
          ctx.data('log', [])
          ctx.keep.del('session')
          ctx.log('清空牌库与日志', 'warn')
          ctx.Toast.show('已清空', 'success', 1500)
          deck = []; log = []
          repaint()
        }, true)
      }
    })

    function repaint() {
      bodyEl.innerHTML = bodyHtml()
      if (env && typeof env.refresh === 'function') env.refresh()
    }
    return function destroy() { unbind() }
  }

  /* ════════════════════════ 10. 提醒 / 定时 / 技能 / 钩子 / 服务 ════════════════════════ */

  /* 到期提醒：每 30 分钟轻量自检一次（manifest 定时规格是静态的，提醒时刻是用户配置 ——
   * 所以用「每 30 分钟看一次表」实现任意时刻提醒，而不是注册一个写死时刻的 at 定时）。
   * 「今天已提醒」标记放 ctx.keep（本机状态槽）：这属于秒级变动状态，不进云同步。 */
  function reminderTick(ctx) {
    try {
      let at = String(ctx.config('remindAt') || '20:30').trim()
      let m = /^(\d{1,2}):(\d{2})$/.exec(at)
      if (!m) return
      let now = new Date()
      let mins = now.getHours() * 60 + now.getMinutes()
      let target = num(m[1], 20) * 60 + num(m[2], 30)
      if (mins < target) return                                  /* 还没到点 */
      let tk = dkey()
      if (ctx.keep.get('lastRemind') === tk) return              /* 今天已提醒过 */
      let deck = deckGet(ctx).filter(function (c) { return !c.suspended })
      let q = dueQueue(deck, Date.now(), num(ctx.config('dailyNew'), 15), num(ctx.config('dailyReview'), 80))
      let n = q.fresh.length + q.due.length
      if (!n) return                                             /* 无事可做不打扰 */
      ctx.keep.set('lastRemind', tk)
      ctx.notify({
        title: '⚡ 闪卡到期 ' + n + ' 张',
        body: '其中复习 ' + q.due.length + ' 张、新卡 ' + q.fresh.length + ' 张 —— 点开即学。',
        level: 'info',
        timeout: 0,
        onClick: function () { ctx.api.goTool('memo-deck', { tab: T_REVIEW }) }
      })
      ctx.log('已推送复习提醒（' + n + ' 张到期）')
    } catch (e) { ctx.log('提醒自检失败：' + (e && e.message || e), 'warn') }
  }

  /* quizDone 钩子：交卷后若闪卡有积压，轻推一下（只日志+一次通知，不弹窗打断） */
  function onQuizDone(ctx, payload) {
    try {
      ctx.log('quizDone：' + JSON.stringify(payload || {}).slice(0, 120))
      let tk = dkey()
      if (ctx.keep.get('lastQuizNudge') === tk) return
      let deck = deckGet(ctx).filter(function (c) { return !c.suspended })
      let q = dueQueue(deck, Date.now(), num(ctx.config('dailyNew'), 15), num(ctx.config('dailyReview'), 80))
      let n = q.fresh.length + q.due.length
      if (n < 10) return
      ctx.keep.set('lastQuizNudge', tk)
      ctx.notify({
        title: '🃏 错题刚出炉，趁热制卡？',
        body: '闪卡还有 ' + n + ' 张到期。把刚错的考点做成卡，比整本重读有效。',
        level: 'info',
        timeout: 12000,
        onClick: function () { ctx.api.goTool('memo-deck', { tab: T_DECK }) }
      })
    } catch (e) { /* 钩子失败绝不影响主流程 */ }
  }

  /* ════════════════════════ 11. 注册 ════════════════════════ */

  let api = {
    id: 'memo-deck',
    name: '记忆宫殿 · 闪卡',
    version: VERSION,
    author: 'kaoyan-v2',
    desc: 'SM-2 间隔重复闪卡（四合一单工具页）：牌库/复习/统计/设置页签切换，AI 制卡、到期提醒、吸顶页眉、3D 翻面。插件中心承载力测试件（约两千行单文件）。',
    tools: [
      /* 四合一：只注册这一个入口，四个页签在页内切换（mountApp 持有壳） */
      { id: 'memo-deck', title: '记忆宫殿 · 闪卡', icon: '🧠', mount: mountApp }
    ],
    config: [
      { key: 'dailyNew', label: '每日新卡上限', type: 'number', default: 15 },
      { key: 'dailyReview', label: '每日复习上限', type: 'number', default: 80 },
      { key: 'remindAt', label: '每日提醒时刻（HH:MM，过点且有到期卡才提醒）', type: 'text', default: '20:30' }
    ],
    skills: [
      {
        trigger: '闪卡',
        title: '记忆宫殿 · 制卡教练',
        prompt: '用户输入：{input}\n你是记忆宫殿插件的制卡教练。把用户给的笔记/考点/错题解析，拆成 5-15 张「问答闪卡」建议。'
          + '每张输出：卡面（一个能独立回答的问题）、卡背（≤80 字答案，公式用 $LaTeX$）、标签。'
          + '一卡一事、提问化、不照搬原句；标题/页码/客套话不制卡。'
          + '输出后提醒用户：去「工具 → 闪卡牌库 → ✨ AI 制卡」可以一键入库并开始复习。'
      }
    ],
    timers: [
      { every: '30min', label: '闪卡到期提醒自检', run: reminderTick }
    ],
    shortcuts: [
      { key: 'ctrl+shift+m', label: '打开闪卡复习', run: function (ctx) { ctx.api.goTool('memo-deck', { tab: T_REVIEW }) } }
    ],
    hooks: {
      quizDone: onQuizDone
      /* 【站内适配 2026-10-22】去掉原来的 `'*'` 通配钩子：它给全站每个事件都写一条 debug 日志，
       * 插件日志区（有条数上限）会被事件流挤满，真正该留的记录（「AI 制卡 12 张」「复习完成 30 张」）
       * 反而被冲掉、用户查不到。事件流是调试资产，但不该由每个插件无脑复读。 */
    },
    /* 其它插件可调：ctx.call('memo-deck', 'dueCount') / 'deckSize' */
    services: {
      dueCount: function (ctx) {
        let q = dueQueue(deckGet(ctx).filter(function (c) { return !c.suspended }), Date.now(), 9999, 9999)
        return { due: q.due.length, fresh: q.fresh.length }
      },
      deckSize: function (ctx) { return deckGet(ctx).length }
    },
    /* 教练记忆注入：让 AI 知道用户有这套闪卡体系 */
    memory: '用户装有「记忆宫殿 · 闪卡」插件（工具抽屉 → 记忆宫殿 · 闪卡，内部四页签：牌库/复习/统计/设置）。'
      + '当用户问「该复习什么」「记不住」时，提醒他去闪卡的复习页签。',
    init: function (ctx) {
      /* 声明自己的 AI 场景（制卡）：卡背常放公式 → latexNeed 必须开，
       * 否则 AI 制的卡里 `$…$` 不走站内公式契约（渲染出来是源码）。 */
      try {
        if (ctx.ai && typeof ctx.ai.registerCtx === 'function') {
          ctx.ai.registerCtx({
            ctx: AI_CTX,
            name: '记忆宫殿 · AI 制卡',
            desc: '把笔记/错题拆成问答闪卡（卡背常含公式）',
            def: 'think',
            latexNeed: true,
            tools: 'none',
            recall: false
          })
        }
      } catch (e) { /* 注册失败 = 退回未注册路径（吃全局设置） */ }
      ctx.log('记忆宫殿 v' + VERSION + ' 已装载（牌库 ' + deckGet(ctx).length + ' 张）')
    }
  }

  /* 调试钩子（仅站点显式打开时暴露；生产无影响）：
   * SM-2 引擎与统计聚合都是纯函数 —— 判据（重排/回队/保留率/连续天数）
   * 值得脱离 DOM 单测，所以挂出来给测试脚本用。 */
  if (window.__MEMO_DEBUG__) {
    window.__memoInternals = {
      newCard: newCard,
      schedule: schedule,
      dueQueue: dueQueue,
      retentionOf: retentionOf,
      streakOf: streakOf,
      dailyActivity: dailyActivity,
      forecast: forecast,
      deckBreakdown: deckBreakdown,
      dueText: dueText,
      GRADES: GRADES,
      EASE_MIN: EASE_MIN,
      EASE_MAX: EASE_MAX,
      MATURE_IVL: MATURE_IVL,
      AGAIN_MINUTES: AGAIN_MINUTES,
      DECK_MAX_CARDS: DECK_MAX_CARDS,
      T_DECK: T_DECK,
      T_REVIEW: T_REVIEW,
      T_STATS: T_STATS,
      T_PREFS: T_PREFS,
      mountApp: mountApp,
      mountDeck: mountDeck,
      mountReview: mountReview,
      mountStats: mountStats,
      mountPrefs: mountPrefs,
      reminderTick: reminderTick,
      heatHtml: heatHtml
    }
  }

  PluginBus.register(api)
})()
