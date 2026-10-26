/* ============================================================
 * feynman-crystal.plugin.js — 费曼晶体（单文件插件）· v1.1
 * ------------------------------------------------------------
 * 一句话：把「看懂」变成「讲得出来」——知识点 → 递进提问 → 你用自己的话讲 → 判定 →
 *        长成一张掌握度晶体图 → 按遗忘曲线回来复习。
 *
 * 为什么做这件事（而不是又一份题库）：
 *   站内已有测验/押题/错题/方法，但**没有一处逼你把话讲出来**。看懂是"认得出"，
 *   讲清楚是"能重建"——考场上要的是后者。费曼法的核心不是自测，是**输出**：
 *   说不出、说得绕、说得只有自己懂，三种失败模式对应三种完全不同的补法，
 *   所以判定必须分维度（准确 / 自洽 / 通俗），不能只给一个总分。
 *
 * ── 能力面（都在一个文件里，不改站内架构）──────────────────────
 *   · 吸顶页眉：两态收窄（滚动后压扁 + 玻璃底），KPI 常驻（今日复述 / 连续 / 晶体节点）
 *   · 底部 dock：5 个视图就地切换，滑动胶囊指示器 + 到期红点（自实现，视觉对齐站内 isleDock）
 *   · 复述台：AI 递进出题 → 计时作答 → 三维判定 + 追问 + 缺失点；无 AI 时降级为本地提问链 + 自评
 *   · 晶体图：纯 SVG 环形簇布局（确定性，不抖），节点大小=复述次数、颜色=掌握度、呼吸动画
 *   · 复习队列：艾宾浩斯间隔（1/2/4/7/15/30/60 天）+ 逾期惩罚 + 未来 7 天负载
 *   · 统计：掌握度环 / 近 14 天柱状 / 学科分布 / 薄弱 Top5 / 连续天数
 *   · 数据：本机持久化（ctx.data）+ JSON 导入导出 + Markdown 报告
 *   · 快捷键：1-5 切视图 / N 新建 / Enter 提交（输入框内 Ctrl+Enter）/ Esc 收起
 *
 * ── 宿主契约（只依赖公开能力，不碰内部结构）──────────────────
 *   mount(el, ctx) —— el 是插件工具页容器，ctx 见 core/pluginbus buildCtx：
 *     ctx.data(k[,v])   本插件命名空间持久化（写要整体替换，不做深合并）
 *     ctx.config(k)     读配置（自动回退 manifest 默认值）
 *     ctx.ai.json(sys,usr,opts)  结构化输出（未配置 AI 时 reject，必须能兜住）
 *     ctx.Toast / ctx.Modal / ctx.U / ctx.api.download / ctx.api.confirm
 *   返回 destroy 函数：解绑窗口监听、清定时器（宿主切页时会调用）。
 *
 * ── 数据形状（改字段必须写迁移，见 normPoint/normSession）──────
 *   points:   [{id,title,subject,topic,note,createdAt,updatedAt,reps,mastery,
 *               lastAt,nextAt,okStreak,history:[{at,score,level}],tags}]
 *   sessions: [{id,pid,at,level,ms,score,qa:[{q,a,v:{accuracy,coherence,
 *               plainness,score,comment,missing,followUp,confidence,manual}}]}]
 *
 * ── 三条不做 ──────────────────────────────────────────────────
 *   ① 不做云同步（数据走本机 ctx.data；导出 JSON 自己备份）
 *   ② 不假装 AI 一定可用（无 AI = 本地提问链 + 自评，功能不残缺，只是判得粗）
 *   ③ 不编造判定（AI 给不出结论时如实显示"无法判定"，不塞一个假的 70 分）
 *
 * 安装：插件中心 → 市场「费曼晶体」一键安装，或粘贴本文件。
 * ============================================================ */
;(function () {
  'use strict'

  /* 【2026-10-23】1.2：空库点「开始复述」给提示（原先是静默退回）、小按钮命中区外扩。
   * 版本必须涨 —— 已安装副本是整份源码存在 localStorage 里的。 */
  let VERSION = '1.3'
  let TOOL_ID = 'feynman-crystal'
  /* 【2026-10-22 站内适配 · 补注册环节】原先三处 AI 调用全写死 `ctx: 'plugin.ai'` ——
   * 那是站内给「没自带场景的插件」留的通用兜底条目：它只有一条「默认不思考」，
   * 于是「递进出题」和「三维判定」在参数中心里**共用一个开关**，用户没法把判定调成严谨、
   * 把出题调成快出字；用量也全记在通用桶里，看不出是哪一步在烧 token。
   * 现在拆成两条真场景并注册；体检探活改用伪 ctx `probe.connect`（它本来就是个连通测试，
   * 不该冒充业务场景、也不该进配置中心占一行）。 */
  let AI_CTX_QUIZ = 'plugin.feynman-crystal.quiz'
  let AI_CTX_JUDGE = 'plugin.feynman-crystal.judge'

  /* ============================================================
   * 0. 小工具（纯函数，不碰 DOM / 不碰 ctx）
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
  function uid(p) {
    return (p || 'fx') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
  }
  /** 日期键 YYYY-MM-DD（本地时区，不用 toISOString —— 那个按 UTC 切日，晚上会差一天） */
  function dkey(d) {
    let x = d ? (d instanceof Date ? d : new Date(d)) : new Date()
    return x.getFullYear() + '-' + pad2(x.getMonth() + 1) + '-' + pad2(x.getDate())
  }
  function todayKey() { return dkey(new Date()) }
  function parseDay(k) {
    let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(k || ''))
    if (!m) return null
    return new Date(+m[1], +m[2] - 1, +m[3])
  }
  function addDays(k, n) {
    let d = parseDay(k) || new Date()
    d.setDate(d.getDate() + n)
    return dkey(d)
  }
  /** b - a 的天数差（按日历日算，不用毫秒除 —— 夏令时/时区偏移会算出 0.96 天） */
  function diffDays(a, b) {
    let da = parseDay(a), db = parseDay(b)
    if (!da || !db) return 0
    return Math.round((db.getTime() - da.getTime()) / 86400000)
  }
  function fmtDur(ms) {
    let s = Math.max(0, Math.round((Number(ms) || 0) / 1000))
    let m = Math.floor(s / 60)
    s = s % 60
    return m + ':' + pad2(s)
  }
  function fmtDate(k) {
    let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(k || ''))
    if (!m) return String(k || '')
    return (+m[2]) + '月' + (+m[3]) + '日'
  }
  function shortTitle(s, n) {
    s = String(s || '')
    n = n || 14
    if (s.length <= n) return s
    /* 【2026-10-23 第 26 轮】切点落在一对 `$…$` 里面 → 收尾的 `$` 被切掉，
     * 渲染器认不出完整公式就整段按原文显示。奇数个 `$` = 正在公式里 → 退到那个 `$` 之前。 */
    let cut = s.slice(0, n)
    if ((cut.match(/\$/g) || []).length % 2 === 1) cut = cut.slice(0, cut.lastIndexOf('$'))
    if (cut.endsWith('\\')) cut = cut.slice(0, -1)
    return cut + '…'
  }

  /* ============================================================
   * 1. 掌握度与遗忘曲线（纯函数 —— 单测直接打这些）
   * ============================================================ */

  /** 艾宾浩斯间隔阶梯（天）。通过一次往上爬一格，答糊了减半，答砸了明天再来。 */
  let EBB = [1, 2, 4, 7, 15, 30, 60]

  /**
   * 下次复习间隔。
   * 为什么不直接用「连续通过次数」当索引：中断一次就该往回退，
   * 而不是永远往前爬 —— 否则一个反复半懂的知识点会被排到 30 天后，等于放弃它。
   */
  function nextInterval(reps, score) {
    let i = clamp(reps || 0, 0, EBB.length - 1)
    if (score >= 80) return EBB[i]
    if (score >= 60) return Math.max(1, Math.round(EBB[i] / 2))
    return 1
  }

  /**
   * 掌握度更新：新分与旧分**加权融合**，不让一次超常发挥就把底子洗白。
   * 权重 0.45/0.55 的依据：一次复述的判定噪声很大（AI 判卷 + 表达波动），
   * 旧值代表多次证据，不该被单次覆盖；但也不能太钝，否则从 30 分爬到 80 分要十几次。
   */
  function masteryAfter(prev, score, level) {
    let p = clamp(prev || 0, 0, 100)
    let s = clamp(score || 0, 0, 100)
    let next = Math.round(p * 0.45 + s * 0.55)
    /* 讲满三层且答得漂亮 → 额外 +4：这是"能重建"的强证据，值得提前结束折磨 */
    if (s >= 85 && clamp(level || 1, 1, 4) >= 3) next = Math.min(100, next + 4)
    /* 从未复述过（p=0）时别被 0.45 拖成低分：首测就该直接反映这次表现 */
    if (!p) next = Math.max(next, Math.round(s * 0.9))
    return clamp(next, 0, 100)
  }

  /** 掌握度 → 语义档位（UI 文案唯一来源，别在模板里再写一套 if） */
  function masteryLabel(m) {
    m = clamp(m, 0, 100)
    if (m >= 85) return '结晶'
    if (m >= 65) return '通透'
    if (m >= 40) return '成形'
    if (m > 0) return '模糊'
    return '未复述'
  }
  /** 掌握度 → 色（返回主色与柔和底，UI 只用这两个，不散落色值） */
  function masteryColor(m) {
    m = clamp(m, 0, 100)
    if (m >= 85) return { c: '#0f766e', soft: 'rgba(15,118,110,.12)' }
    if (m >= 65) return { c: '#2563eb', soft: 'rgba(37,99,235,.12)' }
    if (m >= 40) return { c: '#b45309', soft: 'rgba(180,83,9,.12)' }
    if (m > 0) return { c: '#b91c1c', soft: 'rgba(185,28,28,.10)' }
    return { c: '#94a3b8', soft: 'rgba(148,163,184,.14)' }
  }
  /** 到期判定：没排过复习日的一律算"今天该复述"（新知识点不该躺尸） */
  function isDue(p, today) {
    if (!p) return false
    if (!p.nextAt) return true
    return p.nextAt <= (today || todayKey())
  }
  function overdueDays(p, today) {
    if (!p || !p.nextAt) return 0
    let d = diffDays(p.nextAt, today || todayKey())
    return d > 0 ? d : 0
  }
  /** 复习优先级：逾期久的优先，同逾期按掌握度低的优先（越糊越该练） */
  function dueList(points, today) {
    return (points || []).filter(function (p) { return isDue(p, today) })
      .sort(function (a, b) {
        let oa = overdueDays(a, today), ob = overdueDays(b, today)
        if (oa !== ob) return ob - oa
        return (a.mastery || 0) - (b.mastery || 0)
      })
  }
  /** 未来 n 天每天到期多少（复习页负载条 + 统计用） */
  function loadAhead(points, today, n) {
    let out = []
    let base = today || todayKey()
    for (let i = 0; i < (n || 7); i++) {
      let k = addDays(base, i)
      out.push({
        key: k,
        n: (points || []).filter(function (p) {
          let t = p.nextAt || base
          return t === k || (i === 0 && t <= k)
        }).length
      })
    }
    return out
  }

  /* ============================================================
   * 2. 数据层（读写 + 迁移 + 体积闸）
   * ------------------------------------------------------------
   * 为什么写之前要整体替换：ctx.data(k, v) 是「整键覆盖」语义，没有深合并。
   * 想改一个字段也必须读全量 → 改 → 写回，别指望局部更新。
   * ============================================================ */
  let MAX_POINTS = 600          // 知识点上限（超过按"最久没碰"淘汰）
  let MAX_SESSIONS = 400        // 会话上限（只留最近 400 次，统计够用）

  function normPoint(raw) {
    if (!raw || typeof raw !== 'object') return null
    let title = String(raw.title || '').trim()
    if (!title) return null
    let history = Array.isArray(raw.history) ? raw.history.slice(-40).map(function (h) {
      return { at: String(h && h.at || ''), score: clamp(h && h.score, 0, 100), level: clamp(h && h.level, 1, 4) }
    }) : []
    return {
      id: String(raw.id || uid('pt')),
      title: title.slice(0, 80),
      subject: String(raw.subject || 'custom'),
      topic: String(raw.topic || '').slice(0, 20),
      note: String(raw.note || '').slice(0, 600),
      createdAt: String(raw.createdAt || todayKey()),
      updatedAt: String(raw.updatedAt || raw.createdAt || todayKey()),
      reps: clamp(raw.reps, 0, 999),
      mastery: clamp(raw.mastery, 0, 100),
      lastAt: String(raw.lastAt || ''),
      nextAt: String(raw.nextAt || ''),
      okStreak: clamp(raw.okStreak, 0, 99),
      history: history,
      tags: Array.isArray(raw.tags) ? raw.tags.slice(0, 8).map(function (t) { return String(t).slice(0, 12) }) : []
    }
  }
  function normSession(raw) {
    if (!raw || typeof raw !== 'object') return null
    let qa = Array.isArray(raw.qa) ? raw.qa.slice(0, 8).map(function (x) {
      let v = x && x.v && typeof x.v === 'object' ? x.v : {}
      return {
        q: String(x && x.q || '').slice(0, 500),
        a: String(x && x.a || '').slice(0, 4000),
        v: {
          accuracy: clamp(v.accuracy, 0, 100),
          coherence: clamp(v.coherence, 0, 100),
          plainness: clamp(v.plainness, 0, 100),
          score: clamp(v.score, 0, 100),
          comment: String(v.comment || '').slice(0, 600),
          missing: Array.isArray(v.missing) ? v.missing.slice(0, 6).map(function (m) { return String(m).slice(0, 40) }) : [],
          followUp: String(v.followUp || '').slice(0, 300),
          confidence: clamp(v.confidence, 0, 100),
          manual: !!v.manual
        }
      }
    }) : []
    if (!qa.length) return null
    return {
      id: String(raw.id || uid('ss')),
      pid: String(raw.pid || ''),
      at: String(raw.at || new Date().toISOString()),
      level: clamp(raw.level, 1, 4),
      ms: clamp(raw.ms, 0, 86400000),
      score: clamp(raw.score, 0, 100),
      qa: qa
    }
  }
  function loadPoints(ctx) {
    let arr = ctx.data('points')
    if (!Array.isArray(arr)) return []
    let out = []
    for (let i = 0; i < arr.length; i++) {
      let p = normPoint(arr[i])
      if (p) out.push(p)
    }
    return out
  }
  function loadSessions(ctx) {
    let arr = ctx.data('sessions')
    if (!Array.isArray(arr)) return []
    let out = []
    for (let i = 0; i < arr.length; i++) {
      let s = normSession(arr[i])
      if (s) out.push(s)
    }
    return out
  }
  /** 写回知识点：超上限时按「最久没碰」淘汰（lastAt/updatedAt 都空的最先走） */
  function savePoints(ctx, list) {
    let arr = (list || []).slice()
    if (arr.length > MAX_POINTS) {
      arr.sort(function (a, b) {
        let ka = a.lastAt || a.updatedAt || a.createdAt || ''
        let kb = b.lastAt || b.updatedAt || b.createdAt || ''
        return kb < ka ? -1 : (kb > ka ? 1 : 0)
      })
      arr = arr.slice(0, MAX_POINTS)
    }
    ctx.data('points', arr)
    return arr
  }
  function saveSessions(ctx, list) {
    let arr = (list || []).slice(-MAX_SESSIONS)
    ctx.data('sessions', arr)
    return arr
  }
  function findPoint(list, id) {
    for (let i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i]
    return null
  }

  /* ============================================================
   * 3. 会话评分（把 N 道题的三维判定揉成一个分数 + 一句结论）
   * ============================================================ */
  /** 单题综合分：准确权重最高（讲错了，再通俗也是错的） */
  function qScore(v) {
    if (!v) return 0
    return Math.round(clamp(v.accuracy, 0, 100) * 0.5 + clamp(v.coherence, 0, 100) * 0.3 + clamp(v.plainness, 0, 100) * 0.2)
  }
  /** 会话分：取均值，但**最后一层加权**（最后一问通常最接近"能不能重建"） */
  function sessionScore(qa) {
    if (!qa || !qa.length) return 0
    let sum = 0, wsum = 0
    for (let i = 0; i < qa.length; i++) {
      let w = (i === qa.length - 1 && qa.length > 1) ? 1.5 : 1
      sum += qScore(qa[i].v) * w
      wsum += w
    }
    return Math.round(sum / (wsum || 1))
  }
  /** 一句话结论（复述结束卡的主文案，按分数段给"下一步做什么"，不给空泛表扬） */
  function verdictLine(score, level) {
    if (score >= 85) return '能用自己的话把它重建出来了 —— 这是可以上考场的程度。'
    if (score >= 70) return '主体讲对了，但有几处还靠"我记得"撑着。再补一次就能稳。'
    if (score >= 50) return '骨架有了，血肉还缺：先把缺失点补上，再讲一遍。'
    if (score > 0) return '这次没讲清。不是记性问题 —— 回教材把"为什么"补上再来。'
    return '没有拿到有效回答。'
  }
  /** 三维里最弱的一项（结束卡给一条针对性建议） */
  function weakestDim(v) {
    if (!v) return { k: 'accuracy', label: '准确', tip: '先确认定义与条件，再谈理解' }
    let arr = [
      { k: 'accuracy', n: clamp(v.accuracy, 0, 100), label: '准确', tip: '把定义、条件、适用范围的原文再过一遍' },
      { k: 'coherence', n: clamp(v.coherence, 0, 100), label: '自洽', tip: '检查有没有自相矛盾或跳步：把推导一句句念出来' },
      { k: 'plainness', n: clamp(v.plainness, 0, 100), label: '通俗', tip: '换成一个不学这门课的人也能听懂的说法，重讲一次' }
    ]
    arr.sort(function (a, b) { return a.n - b.n })
    return arr[0]
  }

  /* ============================================================
   * 4. AI：出题链 + 三维判定（都要求 JSON；失败一律可兜底）
   * ============================================================ */

  /* 出题 prompt 的三条硬约束（写在这里而不是散在调用点）：
   *   ① 只能问"理解"，不能问"背没背"（否则练的是记忆，不是重建）
   *   ② 递进：是什么 → 为什么成立 → 边界/反例/易混（层数由用户配置决定）
   *   ③ 必须允许"这题不适用"（有些知识点没有反例），别硬凑 */
  function chainSystem(levels, strict) {
    return [
      '你是考研复习的费曼出题人。学生要"把知识点讲给一个外行听"，你的任务是出递进问题。',
      '只输出 JSON，不要解释，不要 markdown 代码块。格式：',
      '{"questions":[{"q":"问题正文","why":"这道题在考什么（一句话）"}]}',
      '规则：',
      '1) 一共 ' + levels + ' 个问题，从浅到深：是什么 → 为什么成立 → 边界/反例/容易和什么混。',
      '2) 只问"能不能讲清"，不许问"请默写""请列举定义原文"这类纯记忆题。',
      '3) 问题必须能脱离教材回答，不许出现"如上文所述"这种指代。',
      '4) 如果这个知识点天然没有反例或边界，就用"它什么时候会失效/被谁替代"代替，不要硬造。',
      '5) 难度档：' + strict + '。严格档要多问一层"为什么不是另一种做法"。',
      '6) 全部用简体中文，问题控制在 40 字内。'
    ].join('\n')
  }
  function judgeSystem(strict) {
    return [
      '你是考研复习的判卷人，评的是"学生有没有把知识点讲清楚"，不是文采。',
      '只输出 JSON，不要解释，不要 markdown 代码块。格式：',
      '{"accuracy":0-100,"coherence":0-100,"plainness":0-100,"comment":"一句话评语（≤40字）",',
      ' "missing":["漏掉的关键点，最多4条"],"followUp":"一句追问（≤30字）","confidence":0-100}',
      '三个维度分别指：',
      '- accuracy 准确：定义、条件、结论对不对（讲错了这里给低分，不管多流畅）。',
      '- coherence 自洽：有没有自相矛盾、跳步、循环论证。',
      '- plainness 通俗：外行能不能听懂（堆术语、照搬原文 = 低分）。',
      '硬性要求：',
      '1) 不要默认学生答对。空泛、复述题干、只说结论不说理由，都要压到 40 分以下。',
      '2) 允许不确定：如果你无法判断（比如答案跑题到别的知识点），把 confidence 给到 40 以下，comment 里直说。',
      '3) missing 只写学生**确实漏掉**的点，不要把他没提但无关紧要的东西算漏。',
      '4) 严格档：' + strict + '。严格档下，只有结论没有推导最高 60 分。'
    ].join('\n')
  }
  /** 出题：AI 优先；失败/未配置 → 本地模板链（保证功能不残缺） */
  function buildChain(ctx, point, levels, strict) {
    let sys = chainSystem(levels, strict)
    let usr = '知识点：' + point.title
      + (point.subject && point.subject !== 'custom' ? '\n学科：' + subjectLabel(point.subject) : '')
      + (point.topic ? '\n主题：' + point.topic : '')
      + (point.note ? '\n学生自记的要点（出题可参考，但不要直接念出来）：' + point.note : '')
      + (point.mastery ? '\n当前掌握度：' + point.mastery + '/100（' + masteryLabel(point.mastery) + '）' : '')
      + '\n请出 ' + levels + ' 个递进问题。'
    if (!aiOk(ctx)) return Promise.resolve(localChain(point, levels))
    return ctx.ai.json(sys, usr, { ctx: AI_CTX_QUIZ }).then(function (r) {
      let qs = r && Array.isArray(r.questions) ? r.questions : []
      let out = []
      for (let i = 0; i < qs.length; i++) {
        let q = String(qs[i] && qs[i].q || '').trim()
        if (q) out.push({ q: q.slice(0, 200), why: String(qs[i] && qs[i].why || '').slice(0, 80), local: false })
      }
      if (!out.length) return localChain(point, levels)
      return out.slice(0, levels)
    })['catch'](function () { return localChain(point, levels) })
  }
  /**
   * 本地提问链：没有 AI 也能练。
   * 不假装它懂这个知识点 —— 四个模板只依赖"知识点名字"，所以问题必然泛；
   * UI 会明确标注「本地模板提问」，让用户知道这不是针对他的知识点出的题。
   */
  function localChain(point, levels) {
    let t = shortTitle(point.title, 18)
    let bank = [
      { q: '不看资料，用你自己的话把「' + t + '」讲一遍（它是什么、解决什么问题）。', why: '能不能脱离原文重建' },
      { q: '「' + t + '」为什么成立？把中间的关键一步说出来，别只给结论。', why: '推导链是否完整' },
      { q: '「' + t + '」在什么条件下会失效？或者最容易和哪个概念混？', why: '边界与辨析' },
      { q: '如果让你给一个没学过这门课的人解释「' + t + '」，你会用什么比喻？', why: '是否真懂（能降维）' }
    ]
    return bank.slice(0, clamp(levels, 1, 4)).map(function (x) { return { q: x.q, why: x.why, local: true } })
  }
  /** 判定：AI 优先；失败 → 返回 manual 标记（UI 转自评，不编分数） */
  /** 判定的 user 文本（纯函数，可单测）：带上前面几问的摘要，让判卷知道"这些已经讲过" */
  function judgeUser(point, question, answer, prior) {
    let lines = ['知识点：' + point.title]
    if (prior && prior.length) {
      lines.push('此前已答过的题（只作上下文，不要重复评判这些内容）：')
      for (let i = 0; i < prior.length; i++) {
        lines.push('· 问：' + String(prior[i].q || '').slice(0, 80))
        lines.push('  答：' + String(prior[i].a || '').replace(/\s+/g, ' ').slice(0, 160))
      }
      lines.push('本次只评判下面这一问的回答，不要因为前面讲得好就抬分。')
    }
    lines.push('问题：' + question)
    lines.push('学生的回答：\n' + String(answer || '').slice(0, 3000))
    return lines.join('\n')
  }
  function judgeAnswer(ctx, point, question, answer, strict, prior) {
    let sys = judgeSystem(strict)
    let usr = judgeUser(point, question, answer, prior)
    if (!aiOk(ctx)) return Promise.resolve(manualVerdict())
    return ctx.ai.json(sys, usr, { ctx: AI_CTX_JUDGE }).then(function (r) {
      if (!r || typeof r !== 'object') return manualVerdict()
      /* 关键防线：AI 没给出任何维度时**不要**用 0 分伪装成"讲砸了"，
       * 那是把"判不了"说成"你不行"。改成 manual，让用户自评。 */
      if (r.accuracy == null && r.score == null && r.coherence == null) return manualVerdict()
      let v = {
        accuracy: clamp(r.accuracy, 0, 100),
        coherence: clamp(r.coherence, 0, 100),
        plainness: clamp(r.plainness, 0, 100),
        score: clamp(r.score, 0, 100),
        comment: String(r.comment || '').slice(0, 300),
        missing: Array.isArray(r.missing) ? r.missing.slice(0, 6).map(function (m) { return String(m).slice(0, 60) }) : [],
        followUp: String(r.followUp || '').slice(0, 200),
        confidence: r.confidence == null ? 70 : clamp(r.confidence, 0, 100),
        manual: false
      }
      if (!v.score) v.score = qScore(v)
      return v
    })['catch'](function () { return manualVerdict() })
  }
  function manualVerdict() {
    return {
      accuracy: 0, coherence: 0, plainness: 0, score: 0,
      comment: '', missing: [], followUp: '', confidence: 0, manual: true
    }
  }
  /** 自评三档 → 分数（自评不是"作弊"，是 AI 不可用时的诚实替代；UI 会标注"自评"） */
  let MANUAL_SCALE = [
    { k: 'good', label: '讲清了', score: 85, tip: '能顺畅讲完、没有卡壳' },
    { k: 'mid', label: '有点糊', score: 60, tip: '讲得下去，但有几处靠"我记得"' },
    { k: 'bad', label: '讲不出', score: 30, tip: '卡在开头，或者只能背原文' }
  ]
  function manualToVerdict(k) {
    let hit = null
    for (let i = 0; i < MANUAL_SCALE.length; i++) if (MANUAL_SCALE[i].k === k) hit = MANUAL_SCALE[i]
    let s = hit ? hit.score : 50
    return {
      accuracy: s, coherence: s, plainness: s, score: s,
      comment: '自评：' + (hit ? hit.label : '未评'),
      missing: [], followUp: '', confidence: 100, manual: true
    }
  }
  function aiOk(ctx) {
    try { return !!(ctx && ctx.ai && ctx.ai.has && ctx.ai.has()) } catch (e) { return false }
  }

  /* 学科字典（唯一来源；新增学科只改这里 + SUBJ_ORDER） */
  let SUBJ_ORDER = ['math', 'major', 'eng', 'pol', 'custom']
  function subjectLabel(k) {
    let m = { math: '数学', major: '专业课', eng: '英语', pol: '政治', custom: '其他' }
    return m[k] || '其他'
  }
  function subjectColor(k) {
    let m = { math: '#2563eb', major: '#0f766e', eng: '#7c3aed', pol: '#b45309', custom: '#64748b' }
    return m[k] || '#64748b'
  }

  /* ============================================================
   * 5. 壳：吸顶页眉 + 底部 dock + 视图舞台
   * ------------------------------------------------------------
   * 三个视图切换的坑（站内其它模块踩过，这里直接按正解写）：
   *   ① dock 的 DOM **只生成一次**，切视图只切 .on 与指示器 left/width ——
   *      重建 DOM 会让指示器变成新元素，滑动过渡直接丢失（瞬移）。
   *   ② 舞台内容整体重绘（innerHTML）是**故意**的：每个视图都有几十个节点，
   *      手写 diff 不值得；重绘只发生在切视图/数据变更，不是每帧。
   *   ③ 吸顶判据用 getBoundingClientRect().top <= 1（与站内作文页/题卷页同款），
   *      不用 scrollY 阈值 —— 阈值会被上面的宿主容器高度变化骗到。
   * ============================================================ */

  let VIEWS = [
    { k: 'train', t: '复述', ic: 'cpChat' },
    { k: 'crystal', t: '晶体', ic: 'puzzle' },
    { k: 'review', t: '复习', ic: 'cpRefresh' },
    { k: 'stats', t: '统计', ic: 'barChart' },
    { k: 'setup', t: '设置', ic: 'cpGear' }
  ]
  let VIEW_TITLE = {
    train: { t: '复述台', s: '用自己的话讲一遍，比再看十遍有用' },
    crystal: { t: '晶体图', s: '每个节点是一个知识点，越亮越通透' },
    review: { t: '复习队列', s: '按遗忘曲线排的，逾期越久越靠前' },
    stats: { t: '统计', s: '复述量、掌握度、学科分布与薄弱点' },
    setup: { t: '设置与数据', s: 'AI 体检 / 判定严格度 / 导入导出' }
  }

  /** 环形进度（纯 SVG，stroke-dasharray 画弧；0-100） */
  function ringSvg(pct, size, color, label) {
    let s = size || 64
    let r = (s - 10) / 2
    let c = 2 * Math.PI * r
    let p = clamp(pct, 0, 100)
    let dash = (c * p / 100).toFixed(1)
    return '<svg class="fx-ring" viewBox="0 0 ' + s + ' ' + s + '" width="' + s + '" height="' + s + '">'
      + '<circle cx="' + (s / 2) + '" cy="' + (s / 2) + '" r="' + r + '" fill="none" stroke="rgba(20,32,28,.10)" stroke-width="6"/>'
      + '<circle cx="' + (s / 2) + '" cy="' + (s / 2) + '" r="' + r + '" fill="none" stroke="' + (color || 'var(--fx-acc)') + '" stroke-width="6"'
      + ' stroke-linecap="round" stroke-dasharray="' + dash + ' ' + (c - dash).toFixed(1) + '"'
      + ' transform="rotate(-90 ' + (s / 2) + ' ' + (s / 2) + ')" style="transition:stroke-dasharray .7s cubic-bezier(.22,1,.36,1)"/>'
      + (label != null ? '<text x="50%" y="53%" text-anchor="middle" dominant-baseline="middle" class="fx-ring-t">' + esc(label) + '</text>' : '')
      + '</svg>'
  }

  /** 迷你柱状（近 n 天复述量 / 负载条共用；无数据也要画出基线，不能空成一片白） */
  function barsSvg(rows, opts) {
    let o = opts || {}
    let w = o.w || 320, h = o.h || 56
    let n = rows.length || 1
    /* 间距按列宽比例算：固定 3 单位在 14 列时会变成"一根粗色块"（真机截图里像只有一个数据点） */
    let step = w / n
    let gap = Math.max(3, step * 0.34)
    let bw = Math.max(2, step - gap)
    let max = 1
    for (let i = 0; i < rows.length; i++) max = Math.max(max, rows[i].n || 0)
    let out = ['<svg class="fx-bars" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none">']
    /* 基线：空白日子的柱子只有 1px 高，不画一条底边就看不出来"这里是 14 天" */
    out.push('<line x1="0" y1="' + (h - 1) + '" x2="' + w + '" y2="' + (h - 1) + '" stroke="rgba(20,32,28,.12)" stroke-width="1"/>')
    for (let i = 0; i < rows.length; i++) {
      let v = rows[i].n || 0
      let bh = Math.max(3, (h - 2) * (v / max))
      let x = i * (bw + gap)
      let col = rows[i].c || 'var(--fx-acc)'
      /* 每天先铺一条淡色"轨道"：没有数据的日子也要看得出来是第几天，
       * 否则整张图只剩"一根柱子"，读不出"这是 14 天"（真机截图抓到的）。 */
      out.push('<rect class="fx-bar-tr" x="' + x.toFixed(1) + '" y="0" width="' + bw.toFixed(1) + '" height="' + (h - 1).toFixed(1) + '" fill="rgba(20,32,28,.05)"><title>' + esc(rows[i].label || '') + '：' + v + '</title></rect>')
      if (v) out.push('<rect class="fx-bar-v" x="' + x.toFixed(1) + '" y="' + (h - bh).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + bh.toFixed(1) + '" fill="' + col + '"/>')
    }
    out.push('</svg>')
    return out.join('')
  }

  /** 空态卡（统一形状：图标 + 一句能做的事 + 一个按钮，别只写"暂无数据"） */
  function emptyCard(icon, title, sub, btnLabel, act) {
    return '<div class="fx-empty">'
      + '<div class="fx-empty-ic">' + icon + '</div>'
      + '<b>' + esc(title) + '</b>'
      + '<span>' + esc(sub) + '</span>'
      + (btnLabel ? '<button class="fx-btn primary" data-act="' + esc(act || '') + '">' + esc(btnLabel) + '</button>' : '')
      + '</div>'
  }

  /** 顶部 KPI 数字（唯一来源：S 与派生统计，模板里不再算） */
  function kpiOf(S, ctx) {
    let today = todayKey()
    let doneToday = 0
    for (let i = 0; i < S.sessions.length; i++) {
      if (dkey(new Date(S.sessions[i].at)) === today) doneToday++
    }
    let due = dueList(S.points, today).length
    let avg = 0
    if (S.points.length) {
      let sum = 0
      for (let i = 0; i < S.points.length; i++) sum += S.points[i].mastery || 0
      avg = Math.round(sum / S.points.length)
    }
    /* 每日目标：给"今天要不要再讲一个"一个明确答案，而不是只报一个孤立数字 */
    let goal = clamp(ctx && ctx.config ? ctx.config('dailyGoal') : 3, 1, 20)
    return {
      today: doneToday,
      goal: goal,
      goalMet: doneToday >= goal,
      due: due,
      nodes: S.points.length,
      avg: avg,
      streak: streakOf(S.sessions)
    }
  }
  /** 连续复述天数（从今天往前数；今天没复述则从昨天起算，避免"早上还没练"就把连击清零） */
  function streakOf(sessions) {
    let days = {}
    for (let i = 0; i < (sessions || []).length; i++) {
      let k = dkey(new Date(sessions[i].at))
      days[k] = 1
    }
    let today = todayKey()
    let cur = days[today] ? today : addDays(today, -1)
    let n = 0
    while (days[cur] && n < 400) { n++; cur = addDays(cur, -1) }
    return n
  }

  /**
   * 挂载整个插件页。返回 destroy（宿主切页时会调）。
   * 所有视图共用一份 S；视图函数只读 S、通过 act() 改 S 再 paint()。
   */
  function mountShell(el, ctx) {
    HOST_CTX = ctx
    let S = {
      view: 'train',
      points: loadPoints(ctx),
      sessions: loadSessions(ctx),
      selId: '',
      run: null,
      crystalWeak: false,
      crystalSubj: 'all',
      listQ: '',
      listSubj: 'all',
      undo: null,
      stageTick: 0
    }
    let saved = String(ctx.data('view') || '')
    for (let i = 0; i < VIEWS.length; i++) if (VIEWS[i].k === saved) S.view = saved

    /* 页面专属样式：挂载时注入、销毁时移除。
     * 为什么不用宿主 css 字段装全部：那个字段被 normalize 截到 20000 字符，
     * 而整页样式（含晶体图/统计/设置）约 26k —— 塞进去会被静默截断，
     * 表现为"最后几条规则莫名不生效"。共享层留在 css 字段（面板也要用），
     * 只服务工具页的这部分在这里按需挂。 */
    let styleEl = null
    if (!document.getElementById('fx-extra-style')) {
      styleEl = document.createElement('style')
      styleEl.id = 'fx-extra-style'
      styleEl.textContent = CSS_EXTRA
      document.head.appendChild(styleEl)
    }

    /* ---- 骨架：页眉（常量，只建一次）+ 舞台 + dock ---- */
    el.innerHTML = ''
    let root = document.createElement('div')
    root.className = 'fx-root'
    root.innerHTML = ''
      + '<div class="fx-aura" aria-hidden="true"><i></i><i></i><i></i></div>'
      + '<header class="fx-top" data-fx="top">'
      + '  <div class="fx-brand">'
      + '    <span class="fx-mark" aria-hidden="true">' + crystalMarkSvg() + '</span>'
      + '    <span class="fx-brandtx"><i class="fx-kicker">FEYNMAN · CRYSTAL</i><b>费曼晶体<em>v' + VERSION + '</em></b></span>'
      + '  </div>'
      + '  <div class="fx-kpis" data-fx="kpis"></div>'
      + '  <div class="fx-topacts">'
      + '    <button class="fx-btn primary fx-go" data-act="quickstart"><i>' + icon(ctx, 'cpPlay') + '</i><span>开始复述</span></button>'
      + '    <button class="fx-icobtn" data-act="goto-setup" title="设置">' + icon(ctx, 'cpGear') + '</button>'
      + '  </div>'
      + '</header>'
      + '<main class="fx-stage" data-fx="stage"></main>'
      + '<nav class="fx-dockwrap"><div class="fx-dock" data-fx="dock">'
      + '  <i class="fx-dock-ind" data-fx="ind"></i>'
      + VIEWS.map(function (v) {
        return '<button class="fx-dock-item" data-view="' + v.k + '">' + icon(ctx, v.ic) + '<em>' + esc(v.t) + '</em>'
          + (v.k === 'review' ? '<i class="fx-dot" data-fx="dot"></i>' : '') + '</button>'
      }).join('')
      + '</div></nav>'
    el.appendChild(root)

    let topEl = root.querySelector('[data-fx="top"]')
    let kpisEl = root.querySelector('[data-fx="kpis"]')
    let stageEl = root.querySelector('[data-fx="stage"]')
    let dockEl = root.querySelector('[data-fx="dock"]')
    let indEl = root.querySelector('[data-fx="ind"]')
    let dotEl = root.querySelector('[data-fx="dot"]')

    /* ---- 指示器：按当前 .on 项的几何派生（同站内 isleDock 的算法，不引依赖） ---- */
    function moveInd() {
      let on = dockEl.querySelector('.fx-dock-item.on')
      if (!on || !indEl) return
      indEl.style.left = on.offsetLeft + 'px'
      indEl.style.width = on.offsetWidth + 'px'
    }

    function syncDock() {
      let items = dockEl.querySelectorAll('.fx-dock-item')
      for (let i = 0; i < items.length; i++) {
        let k = items[i].getAttribute('data-view')
        if (k === S.view) items[i].classList.add('on')
        else items[i].classList.remove('on')
      }
      moveInd()
      if (dotEl) {
        let k = kpiOf(S, ctx)
        dotEl.classList.toggle('show', k.due > 0)
      }
    }

    function updateKpis() {
      let k = kpiOf(S, ctx)
      kpisEl.innerHTML = ''
        + '<span class="fx-kpi' + (k.goalMet ? ' ok' : '') + '" title="今天完成 / 每日目标"><b>' + k.today
        + '<em>/' + k.goal + '</em></b><i>今日</i></span>'
        + '<span class="fx-kpi' + (k.due ? ' warn' : '') + '" title="今天到期待复习的知识点"><b>' + k.due + '</b><i>到期</i></span>'
        + '<span class="fx-kpi" title="晶体里的知识点数量"><b>' + k.nodes + '</b><i>节点</i></span>'
        + '<span class="fx-kpi" title="连续复述天数"><b>' + k.streak + '</b><i>连击</i></span>'
    }

    /* ---- 舞台重绘：视图函数各自返回 HTML，再各自绑定交互 ---- */
    function paint() {
      let html = ''
      if (S.view === 'train') html = viewTrain(ctx, S)
      else if (S.view === 'crystal') html = viewCrystal(ctx, S)
      else if (S.view === 'review') html = viewReview(ctx, S)
      else if (S.view === 'stats') html = viewStats(ctx, S)
      else html = viewSetup(ctx, S)
      stageEl.innerHTML = html
      bindStage()
      updateKpis()
      syncDock()
      S.stageTick++
    }

    function bindStage() {
      /* 每个视图的交互绑定集中在 afterView（switch 里只有一行调用，视图自己管自己的元素） */
      if (S.view === 'train') bindTrain(ctx, S, stageEl, paint)
      else if (S.view === 'crystal') bindCrystal(ctx, S, stageEl, paint, go)
      else if (S.view === 'review') bindReview(ctx, S, stageEl, paint, startRun)
      else if (S.view === 'stats') bindStats(ctx, S, stageEl)
      else bindSetup(ctx, S, stageEl, paint, reload)
    }

    /** 切视图：只切 dock 激活态 + 重绘舞台（不重建 dock，指示器过渡才在） */
    function go(k) {
      if (S.view === k) return
      S.view = k
      ctx.data('view', k)
      stopTick()
      paint()
      try { window.scrollTo({ top: 0, behavior: 'smooth' }) } catch (e) { /* 旧内核忽略 */ }
    }

    /** 数据变了：重载 → 重绘（写盘在 act 里做，这里只负责"读回真值"） */
    function reload() {
      S.points = loadPoints(ctx)
      S.sessions = loadSessions(ctx)
      paint()
    }

    /** 开始一次复述（指定知识点；不指定则取到期最久的那条） */
    function startRun(point) {
      let p = point
      if (!p) {
        let due = dueList(S.points, todayKey())
        p = due[0] || S.points[0] || null
      }
      /* 【2026-10-23 空库点「开始复述」】原先是 `S.selId=''; go('train'); return` —— 静默退回。
       * 真机上就是"点了没反应"。空库时最该给的是**去哪儿建第一个知识点**，不是空白。 */
      if (!p) {
        S.selId = ''; go('train')
        toast(ctx, '还没有知识点 —— 先点「新建知识点」建一个，复述一次它就会亮起来', 'warn', 3200)
        return
      }
      S.selId = p.id
      S.run = {
        pid: p.id,
        chain: [],
        idx: 0,
        answers: [],
        startedAt: Date.now(),
        phase: 'ask',
        busy: false,
        v: null,
        score: 0,
        err: ''
      }
      go('train')
      if (S.view === 'train') paint()
      askChain(p)
    }

    /** 拉提问链（AI 或本地模板），完成后进入作答态 */
    function askChain(p) {
      let run = S.run
      if (!run) return
      run.busy = true
      run.phase = 'ask'
      paint()
      let levels = clamp(ctx.config('levels') || 3, 1, 4)
      let strict = String(ctx.config('strict') || '标准')
      buildChain(ctx, p, levels, strict).then(function (chain) {
        if (S.run !== run) return               /* 期间切了视图/换了知识点 → 丢弃这次结果 */
        run.chain = chain
        run.idx = 0
        run.phase = 'answer'
        run.busy = false
        paint()
      })['catch'](function (e) {
        if (S.run !== run) return
        run.busy = false
        run.phase = 'answer'
        run.chain = localChain(p, levels)
        run.err = '出题失败，已用本地模板：' + ((e && e.message) || e)
        paint()
      })
    }

    /* ---- 提交一道题：判定 → 记一条 → 下一题或收尾 ---- */
    function submitAnswer(text) {
      let run = S.run
      if (!run || run.phase !== 'answer' || run.busy) return
      let p = findPoint(S.points, run.pid)
      if (!p) return
      let q = run.chain[run.idx]
      if (!q) return
      let a = String(text || '').trim()
      if (!a) { toast(ctx, '先写点什么再提交 —— 哪怕只写"讲不清"也是信息', 'warn'); return }
      run.busy = true
      run.phase = 'judge'
      paint()
      let strict = String(ctx.config('strict') || '标准')
      let prior = run.answers.slice(-2).map(function (x) { return { q: x.q, a: x.a } })
      judgeAnswer(ctx, p, q.q, a, strict, prior).then(function (v) {
        if (S.run !== run) return
        run.v = v
        run.answers.push({ q: q.q, a: a, v: v })
        run.busy = false
        run.phase = 'verdict'
        paint()
      })['catch'](function () {
        if (S.run !== run) return
        run.busy = false
        run.v = manualVerdict()
        run.phase = 'verdict'
        paint()
      })
    }

    /** 自评（AI 判不了时用户自己给档）
     *  ★ 自评之后必须能继续：没有反馈可看，所以默认直接进下一题/总结；
     *    关掉「自评后自动继续」才停在原地显示按钮（有人习惯先想想再走）。 */
    function submitManual(k) {
      let run = S.run
      if (!run || run.phase !== 'verdict') return
      let v = manualToVerdict(k)
      run.v = v
      run.rated = true
      let last = run.answers[run.answers.length - 1]
      if (last) last.v = v
      if (ctx.config('autoNext') === false) { paint(); return }
      nextQuestion()
    }

    /** 撤销刚完成的那次复述：知识点回到复述前，会话记录一并删除 */
    function undoRun() {
      let u = S.undo
      if (!u) return
      S.points = savePoints(ctx, S.points.map(function (x) { return x.id === u.point.id ? u.point : x }))
      if (u.sessionId) S.sessions = saveSessions(ctx, S.sessions.filter(function (x) { return x.id !== u.sessionId }))
      S.undo = null
      S.run = null
      paint()
      toast(ctx, '已撤销：掌握度回到 ' + (u.point.mastery || 0) + '（' + masteryLabel(u.point.mastery) + '）', 'info', 2600)
    }

    /** 下一题；已是最后一题则收尾落盘 */
    function nextQuestion() {
      let run = S.run
      if (!run) return
      if (run.idx < run.chain.length - 1) {
        run.idx++
        run.phase = 'answer'
        run.v = null
        run.startedAt = Date.now()
        paint()
        return
      }
      finishRun()
    }

    /** 收尾：算会话分 → 更新掌握度与下次复习日 → 写盘 → 出总结卡 */
    function finishRun() {
      let run = S.run
      if (!run) return
      let p = findPoint(S.points, run.pid)
      if (!p) { S.run = null; paint(); return }
      let score = sessionScore(run.answers)
      let level = run.answers.length
      let prev = p.mastery || 0
      let mastery = masteryAfter(prev, score, level)
      let gap = nextInterval(p.reps || 0, score)
      let today = todayKey()
      let patched = Object.assign({}, p, {
        reps: (p.reps || 0) + 1,
        mastery: mastery,
        lastAt: today,
        updatedAt: today,
        nextAt: addDays(today, gap),
        okStreak: score >= 80 ? (p.okStreak || 0) + 1 : 0,
        history: (p.history || []).concat([{ at: today, score: score, level: level }]).slice(-40)
      })
      /* 撤销快照：评错档（自评尤其容易）时能一键回到复述前，不让一次手滑污染掌握度 */
      let before = Object.assign({}, p, { history: (p.history || []).slice() })
      let list = S.points.map(function (x) { return x.id === patched.id ? patched : x })
      S.points = savePoints(ctx, list)
      let ss = normSession({
        id: uid('ss'), pid: p.id, at: new Date().toISOString(),
        level: level, ms: Date.now() - (run.startedAt || Date.now()),
        score: score, qa: run.answers
      })
      if (ss) S.sessions = saveSessions(ctx, S.sessions.concat([ss]))
      S.undo = { point: before, sessionId: ss ? ss.id : '', pid: p.id, at: Date.now() }
      run.phase = 'done'
      run.score = score
      run.prevMastery = prev
      run.gap = gap
      run.mastery = mastery
      stopTick()
      paint()
      if (mastery >= 80 && prev < 80) confetti(root)
      toast(ctx, '已长进晶体：' + masteryLabel(mastery) + ' · ' + mastery + ' 分', 'success')
    }

    /* ---- 作答计时（只有作答态需要；切视图/收尾必须停，否则定时器泄漏） ---- */
    let tickId = null
    function stopTick() {
      if (tickId) { clearInterval(tickId); tickId = null }
    }
    function startTick() {
      stopTick()
      tickId = setInterval(function () {
        let span = stageEl.querySelector('[data-fx="clock"]')
        if (!span || !S.run || S.run.phase !== 'answer') { stopTick(); return }
        span.textContent = fmtDur(Date.now() - (S.run.startedAt || Date.now()))
      }, 500)
    }

    /* ---- 事件：委托一次，所有视图共用（视图内元素随 innerHTML 重建也不丢） ---- */
    function onClick(ev) {
      let t = ev.target
      let dockBtn = t.closest ? t.closest('.fx-dock-item') : null
      if (dockBtn) { go(dockBtn.getAttribute('data-view')); return }
      let btn = t.closest ? t.closest('[data-act]') : null
      if (!btn) return
      let act = btn.getAttribute('data-act')
      let id = btn.getAttribute('data-id') || ''
      if (act === 'quickstart') { startRun(null); return }
      if (act === 'goto-setup') { go('setup'); return }
      if (act === 'goto-train') { go('train'); return }
      if (act === 'start') { startRun(findPoint(S.points, id) || null); return }
      if (act === 'pick') { S.selId = id; S.run = null; paint(); return }
      if (act === 'submit') {
        let ta = stageEl.querySelector('[data-fx="answer"]')
        submitAnswer(ta ? ta.value : '')
        return
      }
      if (act === 'next') { nextQuestion(); return }
      if (act === 'manual') { submitManual(btn.getAttribute('data-k')); return }
      if (act === 'reask') {
        let p = findPoint(S.points, S.run ? S.run.pid : S.selId)
        if (p) { S.run = null; startRun(p) }
        return
      }
      if (act === 'abort') {
        S.run = null
        stopTick()
        paint()
        return
      }
      if (act === 'restart') { S.run = null; paint(); return }
      if (act === 'undo-run') { undoRun(); return }
      if (act === 'list-subj') { S.listSubj = btn.getAttribute('data-k') || 'all'; paint(); return }
      /* 注意这里必须 reload 而不是 paint：弹窗写的是 ctx.data，S.points 还是旧的，
       * 只 paint 的话「新建的卡不出现」，用户会以为没建成（真机踩到）。 */
      if (act === 'newpoint') { openNewPoint(ctx, reload); return }
      if (act === 'addpoint') { openNewPoint(ctx, reload); return }
      if (act === 'editpoint') { openEditPoint(ctx, findPoint(S.points, id), reload); return }
      if (act === 'delpoint') {
        let p = findPoint(S.points, id)
        if (!p) return
        ctx.api.confirm('删除这个知识点？', '<div class="muted-sm">「' + esc(p.title) + '」以及它的复述记录都会删除（会话历史保留在统计里）。</div>', function () {
          S.points = savePoints(ctx, S.points.filter(function (x) { return x.id !== id }))
          if (S.selId === id) S.selId = ''
          if (S.run && S.run.pid === id) S.run = null
          paint()
          toast(ctx, '已删除', 'info')
        }, true)
        return
      }
      if (act === 'exp-json') { exportJson(ctx, S); return }
      if (act === 'exp-md') { exportMarkdown(ctx, S); return }
      if (act === 'imp-json') { importJson(ctx, reload); return }
      if (act === 'wipe') {
        ctx.api.confirm('清空全部数据？', '<div class="muted-sm">知识点、复述记录、会话历史全部删除。<b>不可撤销</b>，建议先导出 JSON。</div>', function () {
          ctx.data('points', [])
          ctx.data('sessions', [])
          S.points = []
          S.sessions = []
          S.run = null
          S.selId = ''
          paint()
          toast(ctx, '已清空', 'info')
        }, true)
        return
      }
      if (act === 'ai-test') { aiSelfTest(ctx); return }
      if (act === 'weak-toggle') { S.crystalWeak = !S.crystalWeak; paint(); return }
      if (act === 'subj') { S.crystalSubj = btn.getAttribute('data-k') || 'all'; paint(); return }
    }

    /* ---- 吸顶两态：rAF 合帧，避免每帧强制重排 ---- */
    let raf = 0
    function onScroll() {
      if (raf) return
      raf = requestAnimationFrame(function () {
        raf = 0
        if (!topEl) return
        let stuck = topEl.getBoundingClientRect().top <= 1
        topEl.classList.toggle('is-stuck', stuck)
      })
    }

    /* ---- 快捷键：输入框里只认 Ctrl/Cmd+Enter，避免打字被劫持 ---- */
    function onKey(ev) {
      let t = ev.target
      let typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
      if (typing) {
        if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey) && S.view === 'train' && S.run && S.run.phase === 'answer') {
          ev.preventDefault()
          let ta = stageEl.querySelector('[data-fx="answer"]')
          submitAnswer(ta ? ta.value : '')
        }
        return
      }
      if (ev.metaKey || ev.ctrlKey || ev.altKey) return
      if (ev.key >= '1' && ev.key <= '5') {
        let idx = Number(ev.key) - 1
        if (VIEWS[idx]) { ev.preventDefault(); go(VIEWS[idx].k) }
        return
      }
      if (ev.key === 'n' || ev.key === 'N') { ev.preventDefault(); openNewPoint(ctx, paint); return }
      if (ev.key === 'Escape') {
        if (S.run && S.run.phase !== 'done') { S.run = null; stopTick(); paint() }
      }
    }

    root.addEventListener('click', onClick)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', moveInd)
    onScroll()
    paint()
    /* 首帧字体到位后指示器可能偏窄，补一次（同 isleDock 的处理） */
    if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
      document.fonts.ready.then(function () { try { moveInd() } catch (e) { /* 旧内核 */ } })
    }
    if (S.view === 'train' && S.run && S.run.phase === 'answer') startTick()

    return function destroy() {
      root.removeEventListener('click', onClick)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', moveInd)
      stopTick()
      if (raf) { cancelAnimationFrame(raf); raf = 0 }
      /* 页面专属样式随页面走：不清掉的话，切到别的模块还留着一张 fx-extra-style 死样式 */
      try {
        let st = document.getElementById('fx-extra-style')
        if (st && st.parentNode) st.parentNode.removeChild(st)
      } catch (e) { /* 忽略 */ }
      if (styleEl) styleEl = null
    }
  }

  /** 站点图标（拿不到就退回 emoji，绝不让页面出现空白方块） */
  function icon(ctx, key) {
    try {
      if (ctx && ctx.U && ctx.U.icon) return ctx.U.icon(key)
    } catch (e) { /* 忽略 */ }
    return ''
  }
  /* ms 默认 2000（短提示够用）；长文案/带"下一步怎么做"的提示由调用方显式给更长的时长 ——
   * 2000ms 读不完一句 25 字的话，等于没提示。 */
  function toast(ctx, msg, type, ms) {
    try { ctx.Toast.show(msg, type || 'info', ms || 2000) } catch (e) { /* 忽略 */ }
  }
  /* 品牌字形：晶体五边形轮廓 + 内部辐条。
   * 抽成常量是为了**页眉徽标与模块图标共用一份 d** —— 分开抄两份，改一处忘另一处，
   * 两枚标就会慢慢画歪（这是真事：以前页眉与导航各画各的，用户一眼看出不是同一个标）。 */
  let MARK_OUTLINE = 'M22 5 L36 14 L32 32 L12 32 L8 14 Z'
  let MARK_SPOKES = 'M22 5 V32 M8 14 L32 32 M36 14 L12 32'
  function crystalMarkSvg() {
    return '<svg viewBox="0 0 44 44" aria-hidden="true">'
      + '<defs><linearGradient id="fxg" x1="0" y1="0" x2="1" y2="1">'
      + '<stop offset="0" stop-color="#0f766e"/><stop offset="1" stop-color="#2563eb"/></linearGradient></defs>'
      + '<path d="' + MARK_OUTLINE + '" fill="url(#fxg)" opacity=".16"/>'
      + '<path d="' + MARK_OUTLINE + '" fill="none" stroke="url(#fxg)" stroke-width="1.6" stroke-linejoin="round"/>'
      + '<path d="' + MARK_SPOKES + '" stroke="url(#fxg)" stroke-width=".8" opacity=".5"/>'
      + '<circle cx="22" cy="18" r="2.6" fill="#0f766e"/>'
      + '</svg>'
  }
  /* 模块图标＝页眉同款晶体标，加一层**青→蓝渐变圆角砖**（白字形）。
   * 砖必须自己画成一段 SVG：页眉那枚是「div 里塞 44 格 svg」，导航栏只吃一段 SVG 串。
   * 44 格与页眉一致 → 字形直接复用上面的 d（translate+scale 0.8 把它缩进砖的内边距）。
   * 描边比页眉粗（2.2/1.2）：48→22px 缩放后 1.6 只剩 ~0.9px，糊成一团。
   * 渐变 id 必须带插件前缀（fxMarkG）：多插件同名 id 会让后注册的砖抢走前一个的填充。 */
  let MARK_TILE = '<svg viewBox="0 0 44 44" width="1em" height="1em" aria-hidden="true">'
    + '<defs><linearGradient id="fxMarkG" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0" stop-color="#0F766E"/><stop offset="1" stop-color="#2563EB"/></linearGradient></defs>'
    + '<rect width="44" height="44" rx="12" fill="url(#fxMarkG)"/>'
    + '<g transform="translate(4.4 4.4) scale(0.8)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="' + MARK_OUTLINE + '" stroke-width="2.2"/>'
    + '<path d="' + MARK_SPOKES + '" stroke-width="1.2" opacity=".8"/>'
    + '</g>'
    + '<circle cx="22" cy="18.8" r="1.9" fill="#fff"/>'
    + '</svg>'
  /** 结晶庆祝（一次性 DOM，1.4s 后自清；不动 CSS 变量，避免污染宿主） */
  function confetti(root) {
    try {
      let box = document.createElement('div')
      box.className = 'fx-confetti'
      let colors = ['#0f766e', '#2563eb', '#7c3aed', '#b45309', '#16a34a', '#e11d48']
      let html = ''
      for (let i = 0; i < 26; i++) {
        let a = (i / 26) * Math.PI * 2
        let d = 70 + Math.random() * 150
        html += '<i style="--x:' + (Math.cos(a) * d).toFixed(0) + 'px;--y:' + (Math.sin(a) * d - 30).toFixed(0) + 'px;'
          + '--r:' + Math.round(Math.random() * 480 - 240) + 'deg;--c:' + colors[i % colors.length] + ';'
          + '--d:' + Math.round(Math.random() * 120) + 'ms"></i>'
      }
      box.innerHTML = html
      root.appendChild(box)
      setTimeout(function () { try { box.remove() } catch (e) { /* 忽略 */ } }, 1500)
    } catch (e) { /* 忽略 */ }
  }

  /* ============================================================
   * 6. 视图一：复述台
   * ------------------------------------------------------------
   * 状态机（S.run.phase）：
   *   ask（出题中）→ answer（作答）→ judge（判定中）→ verdict（看判定/自评）→ 下一题 … → done（总结）
   * 为什么不用"一步一屏"：作答时用户常常要回头看上一个问题，
   * 所以 verdict 屏把"上一题的原问题"留在卡头，而不是立刻清空。
   * ============================================================ */
  function viewTrain(ctx, S) {
    let run = S.run
    if (run) return runHtml(ctx, S, run)
    return trainIdleHtml(ctx, S)
  }

  /** 没有进行中的会话：待办队列 + 快速新建 + 选中知识点详情 */
  function trainIdleHtml(ctx, S) {
    let today = todayKey()
    let due = dueList(S.points, today)
    let out = []

    /* ---- 顶部：待复述队列（首屏第一块，符合"核心操作放最显眼处"） ---- */
    out.push('<section class="fx-card fx-queue">')
    let goalLine = ''
    let kk = kpiOf(S, ctx)
    if (kk.today || S.points.length) {
      goalLine = '<div class="fx-goalline' + (kk.goalMet ? ' ok' : '') + '">'
        + '<b>今日 ' + kk.today + ' / ' + kk.goal + '</b>'
        + '<span>' + (kk.goalMet ? '目标达成 —— 想加练就继续，别硬撑。' : '再讲 ' + (kk.goal - kk.today) + ' 个就达标。') + '</span>'
        + '<i class="fx-goalbar"><b style="width:' + Math.min(100, Math.round(kk.today / kk.goal * 100)) + '%"></b></i>'
        + '</div>'
    }
    out.push(goalLine)
    out.push('<div class="fx-card-h"><b>待复述</b><em>' + (due.length ? due.length + ' 个到期' : '今天清空了') + '</em>'
      + '<button class="fx-btn ghost sm" data-act="newpoint">+ 新建知识点</button></div>')
    if (!due.length) {
      out.push('<div class="fx-quiet">' + (S.points.length
        ? '今天没有到期的知识点。想加练就点上面的「新建知识点」，或去晶体图挑一个。'
        : '还没有知识点。先把今天最难讲清的一个概念写进来 —— 比如「拉格朗日中值定理为什么需要闭区间连续」。') + '</div>')
    } else {
      out.push('<div class="fx-qlist">')
      for (let i = 0; i < Math.min(4, due.length); i++) {
        let p = due[i]
        let od = overdueDays(p, today)
        let col = masteryColor(p.mastery)
        out.push('<div class="fx-qrow">'
          + '<span class="fx-qdot" style="background:' + col.c + '"></span>'
          + '<div class="fx-qmain"><b>' + esc(shortTitle(p.title, 26)) + '</b>'
          + '<span>' + esc(subjectLabel(p.subject)) + (p.topic ? ' · ' + esc(p.topic) : '')
          + ' · ' + (p.mastery ? masteryLabel(p.mastery) + ' ' + p.mastery : '还没复述过') + '</span></div>'
          + (od ? '<span class="fx-od">逾期 ' + od + ' 天</span>' : '<span class="fx-od ok">今天</span>')
          + '<button class="fx-btn primary sm" data-act="start" data-id="' + esc(p.id) + '">开始</button>'
          + '</div>')
      }
      out.push('</div>')
      if (due.length > 4) out.push('<div class="fx-more">还有 ' + (due.length - 4) + ' 个到期，去「复习」页按优先级排队。</div>')
    }
    out.push('</section>')

    /* ---- 快速新建：一个输入框就够（学科/主题可在详情里补） ---- */
    out.push('<section class="fx-card fx-quickadd">')
    out.push('<div class="fx-card-h"><b>一句话加一个知识点</b><em>回车即建</em></div>')
    out.push('<div class="fx-qa-row">'
      + '<input class="fx-input" data-fx="quicktitle" placeholder="例如：为什么梯度方向是函数增长最快的方向" maxlength="80">'
      + '<select class="fx-input fx-sel" data-fx="quicksubj">'
      + SUBJ_ORDER.map(function (k) { return '<option value="' + k + '">' + subjectLabel(k) + '</option>' }).join('')
      + '</select>'
      + '<button class="fx-btn" data-act="newpoint">建卡</button>'
      + '</div>')
    out.push('</section>')

    /* ---- 选中的知识点详情（点晶体节点 / 队列行后来到这里） ---- */
    /* ---- 全部知识点：搜索 + 学科筛选（有 600 条上限，没有搜索等于没有库） ---- */
    let all = S.points.slice().sort(function (a, b) {
      let ta = a.nextAt || '9999', tb = b.nextAt || '9999'
      if (ta !== tb) return ta < tb ? -1 : 1
      return (a.mastery || 0) - (b.mastery || 0)
    })
    let q = String(S.listQ || '').trim().toLowerCase()
    let filtered = all.filter(function (p) {
      if (S.listSubj !== 'all' && p.subject !== S.listSubj) return false
      if (!q) return true
      return (p.title + ' ' + p.topic + ' ' + p.note + ' ' + subjectLabel(p.subject)).toLowerCase().indexOf(q) >= 0
    })
    out.push('<section class="fx-card fx-allpoints">')
    out.push('<div class="fx-card-h"><b>全部知识点</b><em>' + filtered.length + ' / ' + all.length + '</em>'
      + '<button class="fx-btn ghost sm" data-act="newpoint">+ 新建</button></div>')
    out.push('<div class="fx-searchbar">'
      + '<input class="fx-input fx-search" data-fx="listq" placeholder="搜标题 / 主题 / 要点…" value="' + esc(S.listQ) + '" maxlength="30">'
      + '<div class="fx-subjbar">'
      + '<button class="fx-schip' + (S.listSubj === 'all' ? ' on' : '') + '" data-act="list-subj" data-k="all">全部</button>'
      + SUBJ_ORDER.map(function (k) {
        return '<button class="fx-schip' + (S.listSubj === k ? ' on' : '') + '" data-act="list-subj" data-k="' + k + '" style="--c:' + subjectColor(k) + '">' + subjectLabel(k) + '</button>'
      }).join('')
      + '</div></div>')
    if (!filtered.length) {
      out.push('<div class="fx-quiet">' + (all.length ? '没有匹配的知识点，换个词或切回「全部」。' : '还没有知识点。') + '</div>')
    } else {
      out.push('<div class="fx-plist">')
      for (let i = 0; i < Math.min(30, filtered.length); i++) {
        let p = filtered[i]
        let col = masteryColor(p.mastery)
        let od = overdueDays(p, today)
        out.push('<div class="fx-prow">'
          + '<span class="fx-qdot" style="background:' + col.c + '"></span>'
          + '<button class="fx-prow-main" data-act="pick" data-id="' + esc(p.id) + '">'
          + '<b>' + esc(shortTitle(p.title, 30)) + '</b>'
          + '<span>' + esc(subjectLabel(p.subject)) + (p.topic ? ' · ' + esc(p.topic) : '')
          + ' · ' + (p.mastery ? masteryLabel(p.mastery) + ' ' + p.mastery : '还没复述过')
          + (p.nextAt ? ' · ' + (od ? '逾期 ' + od + ' 天' : fmtDate(p.nextAt) + ' 复习') : '') + '</span>'
          + '</button>'
          + '<button class="fx-btn sm" data-act="start" data-id="' + esc(p.id) + '">开始</button>'
          + '</div>')
      }
      out.push('</div>')
      if (filtered.length > 30) out.push('<div class="fx-more">还有 ' + (filtered.length - 30) + ' 个，用搜索缩小范围。</div>')
    }
    out.push('</section>')

    /* ---- 选中项详情：从列表/晶体点进来后看它（放在列表之后，先挑后看） ---- */
    let sel = findPoint(S.points, S.selId)
    if (sel) out.push(pointDetailHtml(S, sel))

    /* ---- 空态引导（只有真的一个知识点都没有时才出现） ---- */
    if (!S.points.length) {
      out.push('<section class="fx-card fx-how">'
        + '<div class="fx-card-h"><b>怎么用</b><em>三步</em></div>'
        + '<ol class="fx-steps">'
        + '<li><b>写下知识点</b><span>一个概念 / 一个定理 / 一道你总讲不清的题。</span></li>'
        + '<li><b>回答三层递进问题</b><span>是什么 → 为什么 → 边界与易混。AI 出题，没配 AI 也能用本地模板。</span></li>'
        + '<li><b>看判定、等复习</b><span>准确/自洽/通俗三维打分，按遗忘曲线排下一次。</span></li>'
        + '</ol></section>')
    }
    return out.join('')
  }

  /** 知识点详情卡：掌握度环 + 历史折线 + 要点 + 三个动作 */
  function pointDetailHtml(S, p) {
    let col = masteryColor(p.mastery)
    let hist = (p.history || []).slice(-12)
    let spark = ''
    if (hist.length >= 2) {
      let w = 220, h = 44
      let pts = []
      for (let i = 0; i < hist.length; i++) {
        let x = hist.length === 1 ? 0 : (i / (hist.length - 1)) * w
        let y = h - (clamp(hist[i].score, 0, 100) / 100) * (h - 4) - 2
        pts.push(x.toFixed(1) + ',' + y.toFixed(1))
      }
      spark = '<svg class="fx-spark" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none">'
        + '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + col.c + '" stroke-width="2" stroke-linecap="round"/>'
        + '</svg>'
    }
    return '<section class="fx-card fx-detail">'
      + '<div class="fx-card-h"><b>' + esc(p.title) + '</b><em>' + esc(subjectLabel(p.subject)) + (p.topic ? ' · ' + esc(p.topic) : '') + '</em>'
      + '<button class="fx-icobtn sm" data-act="editpoint" data-id="' + esc(p.id) + '" title="编辑">' + icon({ U: window.U }, 'cpPencil') + '</button>'
      + '<button class="fx-icobtn sm danger" data-act="delpoint" data-id="' + esc(p.id) + '" title="删除">' + icon({ U: window.U }, 'cpTrash') + '</button></div>'
      + '<div class="fx-detail-body">'
      + '<div class="fx-detail-ring">' + ringSvg(p.mastery || 0, 72, col.c, String(p.mastery || 0)) + '<i>' + masteryLabel(p.mastery) + '</i></div>'
      + '<div class="fx-detail-meta">'
      + '<div class="fx-metarow"><span>复述次数</span><b>' + (p.reps || 0) + '</b></div>'
      + '<div class="fx-metarow"><span>上次</span><b>' + (p.lastAt ? fmtDate(p.lastAt) : '—') + '</b></div>'
      + '<div class="fx-metarow"><span>下次复习</span><b>' + (p.nextAt ? fmtDate(p.nextAt) : '今天') + '</b></div>'
      + '</div>'
      + '<div class="fx-detail-spark">' + (spark || '<span class="fx-quiet">还没有复述记录</span>') + '</div>'
      + '</div>'
      + (p.note ? '<details class="fx-note"><summary>我记的要点</summary><div>' + esc(p.note).replace(/\n/g, '<br>') + '</div></details>' : '')
      + '<div class="fx-acts"><button class="fx-btn primary" data-act="start" data-id="' + esc(p.id) + '">' + icon({ U: window.U }, 'cpPlay') + ' 开始复述</button>'
      + '<button class="fx-btn ghost" data-act="goto-crystal">去晶体图</button></div>'
      + '</section>'
  }

  /** 进行中的会话：按 phase 出不同卡 */
  function runHtml(ctx, S, run) {
    let p = findPoint(S.points, run.pid)
    if (!p) { S.run = null; return trainIdleHtml(ctx, S) }
    let col = masteryColor(p.mastery)
    let out = ['<section class="fx-card fx-run">']
    out.push('<div class="fx-card-h"><b>' + esc(shortTitle(p.title, 22)) + '</b><em>'
      + (p.mastery ? masteryLabel(p.mastery) + ' ' + p.mastery : '还没复述过') + '</em>'
      + '<button class="fx-btn ghost sm" data-act="abort">退出</button></div>')

    if (run.phase === 'ask') {
      out.push('<div class="fx-asking"><span class="fx-spin"></span>正在为你出题…'
        + '<i>' + (aiOk(ctx) ? 'AI 按你的知识点生成递进问题' : '未配置 AI，正在用本地模板出题') + '</i></div>')
      out.push('<div class="fx-skl"><i></i><i></i><i></i></div>')
      out.push('</section>')
      return out.join('')
    }

    if (run.phase === 'done') {
      let prev = run.prevMastery || 0
      let cur = run.mastery || 0
      let weak = weakestDim(run.answers.length ? run.answers[run.answers.length - 1].v : null)
      out.push('<div class="fx-done">'
        + '<div class="fx-done-ring">' + ringSvg(run.score || 0, 108, masteryColor(cur).c, String(run.score || 0)) + '</div>'
        + '<div class="fx-done-tx"><b>' + esc(verdictLine(run.score || 0, run.answers.length)) + '</b>'
        + '<div class="fx-done-meta">'
        + '<span class="fx-pill" style="--c:' + masteryColor(cur).c + '">掌握度 ' + prev + ' → <b>' + cur + '</b>（' + masteryLabel(cur) + '）</span>'
        + '<span class="fx-pill">下次复习 ' + fmtDate(addDays(todayKey(), run.gap || 1)) + '（' + (run.gap || 1) + ' 天后）</span>'
        + '<span class="fx-pill">' + run.answers.length + ' 题 · ' + fmtDur(Date.now() - (run.startedAt || Date.now())) + '</span>'
        + '</div>'
        + '<div class="fx-tip"><b>最该补的一项：' + esc(weak.label) + '</b><span>' + esc(weak.tip) + '</span></div>'
        + '</div></div>')
      out.push('<div class="fx-acts">'
        + '<button class="fx-btn primary" data-act="start" data-id="' + esc(p.id) + '">再讲一遍</button>'
        + '<button class="fx-btn" data-act="restart">回到复述台</button>'
        + '<button class="fx-btn ghost" data-act="goto-crystal">看晶体</button>'
        + (S.undo && S.undo.pid === p.id ? '<button class="fx-btn ghost danger" data-act="undo-run">撤销这次（掌握度回滚）</button>' : '')
        + '</div>')
      out.push('</section>')
      return out.join('')
    }

    /* answer / judge / verdict 共用：问题卡（judge 态锁定输入） */
    let q = run.chain[run.idx] || { q: '', why: '' }
    out.push('<div class="fx-prog">')
    for (let i = 0; i < run.chain.length; i++) {
      let cls = i < run.idx ? 'done' : (i === run.idx ? 'on' : '')
      out.push('<i class="' + cls + '"></i>')
    }
    out.push('<span>第 ' + (run.idx + 1) + ' / ' + run.chain.length + ' 层</span>')
    out.push('<span class="fx-clock" data-fx="clock">' + fmtDur(Date.now() - (run.startedAt || Date.now())) + '</span>')
    out.push('</div>')

    out.push('<div class="fx-q"><b>' + esc(q.q) + '</b>'
      + (q.why ? '<span class="fx-qwhy">考的是：' + esc(q.why) + '</span>' : '')
      + (q.local ? '<span class="fx-qlocal">本地模板提问（未配置 AI 或出题失败）</span>' : '')
      + '</div>')

    if (run.phase === 'answer') {
      out.push('<textarea class="fx-ta" data-fx="answer" rows="7" placeholder="用你自己的话讲 —— 不要抄定义，就当对面坐着一个没学过这门课的人。Ctrl/⌘+Enter 提交。"></textarea>')
      out.push('<div class="fx-acts"><button class="fx-btn primary" data-act="submit">提交判定</button>'
        + '<button class="fx-btn ghost" data-act="reask">换一组问题</button>'
        + '<span class="fx-hint">' + (aiOk(ctx) ? 'AI 判定：准确 / 自洽 / 通俗' : '未配置 AI：提交后自己评档') + '</span></div>')
    } else if (run.phase === 'judge') {
      out.push('<div class="fx-asking"><span class="fx-spin"></span>正在判定…<i>看的是"讲清没讲清"，不是文采</i></div>')
      out.push('<div class="fx-skl"><i></i><i></i><i></i></div>')
    } else if (run.phase === 'verdict') {
      let v = run.v || manualVerdict()
      if (v.manual) {
        out.push('<div class="fx-verdict manual">'
          + '<div class="fx-vh">' + icon({ U: window.U }, 'cpWarn') + ' 这次没能自动判定</div>'
          + '<p>可能是未配置 AI，或这次回答让判卷无从下手。<b>自己给个档</b>：讲清了就是讲清了，别客气也别虚。</p>'
          + '<div class="fx-manual">'
          + MANUAL_SCALE.map(function (m) {
            return '<button class="fx-mbtn" data-act="manual" data-k="' + m.k + '"><b>' + m.label + '</b><span>' + m.tip + '</span></button>'
          }).join('')
          + '</div></div>')
      } else {
        out.push(verdictHtml(v))
      }
      out.push('<div class="fx-acts">'
        + (run.phase === 'verdict' && v && (!v.manual || run.rated)
          ? '<button class="fx-btn primary" data-act="next">' + (run.idx < run.chain.length - 1 ? '下一题' : '看总结') + '</button>'
          : '')
        + '<button class="fx-btn ghost" data-act="abort">结束这次</button></div>')
    }
    out.push('</section>')
    return out.join('')
  }

  /** 判定卡：三条维度条 + 评语 + 缺失点 + 追问 */
  function verdictHtml(v) {
    let dims = [
      { k: 'accuracy', t: '准确', n: v.accuracy, tip: '定义/条件/结论对不对' },
      { k: 'coherence', t: '自洽', n: v.coherence, tip: '有没有跳步、矛盾' },
      { k: 'plainness', t: '通俗', n: v.plainness, tip: '外行能不能听懂' }
    ]
    let out = ['<div class="fx-verdict">']
    out.push('<div class="fx-vhead">' + ringSvg(v.score || 0, 76, masteryColor(v.score || 0).c, String(v.score || 0))
      + '<div class="fx-vhead-tx"><b>这次讲得怎么样</b>'
      + '<span>' + (v.confidence && v.confidence < 50 ? '判卷置信度偏低，仅供参考' : '三维分开看，才知道该补哪') + '</span></div></div>')
    out.push('<div class="fx-dims">')
    for (let i = 0; i < dims.length; i++) {
      let d = dims[i]
      let c = masteryColor(d.n)
      out.push('<div class="fx-dim" style="--c:' + c.c + '">'
        + '<div class="fx-dim-h"><b>' + d.t + '</b><em>' + Math.round(d.n) + '</em></div>'
        + '<div class="fx-dim-bar"><i style="width:' + clamp(d.n, 0, 100) + '%"></i></div>'
        + '<span>' + d.tip + '</span></div>')
    }
    out.push('</div>')
    if (v.comment) out.push('<div class="fx-comment">' + esc(v.comment) + '</div>')
    if (v.missing && v.missing.length) {
      out.push('<div class="fx-missing"><b>漏掉的点</b><div>'
        + v.missing.map(function (m) { return '<span class="fx-chip">' + esc(m) + '</span>' }).join('')
        + '</div></div>')
    }
    if (v.followUp) out.push('<div class="fx-followup"><b>追问一句</b><span>' + esc(v.followUp) + '</span></div>')
    out.push('</div>')
    return out.join('')
  }

  /** 复述台的直接绑定：输入框自动聚焦 + Ctrl+Enter + 快速建卡回车 */
  function bindTrain(ctx, S, stage, paint) {
    let ta = stage.querySelector('[data-fx="answer"]')
    if (ta) {
      try { ta.focus({ preventScroll: true }) } catch (e) { try { ta.focus() } catch (e2) { /* 忽略 */ } }
      ta.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) {
          ev.preventDefault()
          let btn = stage.querySelector('[data-act="submit"]')
          if (btn) btn.click()
        }
      })
    }
    let sq = stage.querySelector('[data-fx="listq"]')
    if (sq) {
      sq.addEventListener('input', function () {
        let v = sq.value
        let pos = sq.selectionStart
        S.listQ = v
        paint()
        let again = stage.querySelector('[data-fx="listq"]')
        if (again) {
          again.focus()
          try { again.setSelectionRange(pos, pos) } catch (e) { /* 忽略 */ }
        }
      })
    }
    let qt = stage.querySelector('[data-fx="quicktitle"]')
    if (qt) {
      qt.addEventListener('keydown', function (ev) {
        if (ev.key !== 'Enter') return
        ev.preventDefault()
        let title = String(qt.value || '').trim()
        if (!title) return
        let sel = stage.querySelector('[data-fx="quicksubj"]')
        createPoint(ctx, { title: title, subject: sel ? sel.value : 'custom' }, function (p) {
          S.points = loadPoints(ctx)
          S.selId = p.id
          paint()
          toast(ctx, '已加入晶体：' + shortTitle(p.title, 12), 'success')
        })
      })
    }
  }

  /* ---- 新建 / 编辑知识点（走宿主 Modal，不自建浮层） ---- */
  function createPoint(ctx, data, done) {
    let list = loadPoints(ctx)
    let p = normPoint({
      id: uid('pt'),
      title: data.title,
      subject: data.subject || 'custom',
      topic: data.topic || '',
      note: data.note || '',
      createdAt: todayKey(),
      updatedAt: todayKey()
    })
    if (!p) { toast(ctx, '标题不能为空', 'warn'); return }
    list.push(p)
    savePoints(ctx, list)
    if (done) done(p)
  }
  function openNewPoint(ctx, done) {
    let close = ctx.Modal.open({
      title: '新建知识点',
      html: '<div class="fx-form">'
        + '<label>知识点<b>*</b><input id="fx-np-title" class="fx-input" maxlength="80" placeholder="一句话写清要讲什么"></label>'
        + '<label>学科<select id="fx-np-subj" class="fx-input">'
        + SUBJ_ORDER.map(function (k) { return '<option value="' + k + '">' + subjectLabel(k) + '</option>' }).join('')
        + '</select></label>'
        + '<label>主题（可选，用于晶体分簇）<input id="fx-np-topic" class="fx-input" maxlength="20" placeholder="如：中值定理 / 概率分布"></label>'
        + '<label>要点提示（可选，出题会参考）<textarea id="fx-np-note" class="fx-input" rows="3" placeholder="你觉得自己会卡在哪一步"></textarea></label>'
        + '</div>',
      actions: [
        { label: '取消' },
        {
          label: '创建并开始', kind: 'btn-primary', onClick: function () {
            let t = document.getElementById('fx-np-title')
            let s = document.getElementById('fx-np-subj')
            let tp = document.getElementById('fx-np-topic')
            let nt = document.getElementById('fx-np-note')
            let title = t ? String(t.value || '').trim() : ''
            if (!title) { toast(ctx, '先写个标题', 'warn'); return false }
            createPoint(ctx, {
              title: title,
              subject: s ? s.value : 'custom',
              topic: tp ? tp.value : '',
              note: nt ? nt.value : ''
            }, function (p) {
              if (close) close()
              if (done) done()
              toast(ctx, '已创建，点「开始」即可复述', 'success')
            })
            return false
          }
        }
      ]
    })
  }
  function openEditPoint(ctx, p, done) {
    if (!p) return
    let close = ctx.Modal.open({
      title: '编辑知识点',
      html: '<div class="fx-form">'
        + '<label>知识点<input id="fx-ep-title" class="fx-input" maxlength="80" value="' + esc(p.title) + '"></label>'
        + '<label>学科<select id="fx-ep-subj" class="fx-input">'
        + SUBJ_ORDER.map(function (k) {
          return '<option value="' + k + '"' + (k === p.subject ? ' selected' : '') + '>' + subjectLabel(k) + '</option>'
        }).join('')
        + '</select></label>'
        + '<label>主题<input id="fx-ep-topic" class="fx-input" maxlength="20" value="' + esc(p.topic) + '"></label>'
        + '<label>要点提示<textarea id="fx-ep-note" class="fx-input" rows="3">' + esc(p.note) + '</textarea></label>'
        + '</div>',
      actions: [
        { label: '取消' },
        {
          label: '保存', kind: 'btn-primary', onClick: function () {
            let t = document.getElementById('fx-ep-title')
            let s = document.getElementById('fx-ep-subj')
            let tp = document.getElementById('fx-ep-topic')
            let nt = document.getElementById('fx-ep-note')
            let title = t ? String(t.value || '').trim() : ''
            if (!title) { toast(ctx, '标题不能为空', 'warn'); return false }
            let list = loadPoints(ctx).map(function (x) {
              if (x.id !== p.id) return x
              return Object.assign({}, x, {
                title: title.slice(0, 80),
                subject: s ? s.value : x.subject,
                topic: tp ? String(tp.value || '').slice(0, 20) : x.topic,
                note: nt ? String(nt.value || '').slice(0, 600) : x.note,
                updatedAt: todayKey()
              })
            })
            savePoints(ctx, list)
            if (close) close()
            if (done) done()
            toast(ctx, '已保存', 'success')
            return false
          }
        }
      ]
    })
  }

  /* ============================================================
   * 7. 视图二：晶体图
   * ------------------------------------------------------------
   * 布局是**确定性**的：按主题分簇，簇心绕大圆均分，簇内节点再绕簇心均分。
   * 为什么不用力导向：力导向每次重绘位置都会变（看起来像在抖），
   * 而这张图的语义是"同一批知识点随时间变亮"，位置必须稳定，否则记忆里的方位全乱。
   * ============================================================ */
  function crystalLayout(points) {
    let byTopic = {}
    for (let i = 0; i < points.length; i++) {
      let t = String(points[i].topic || '').trim() || '未分组'
      if (!byTopic[t]) byTopic[t] = []
      byTopic[t].push(points[i])
    }
    let topics = Object.keys(byTopic).sort()
    /* 画布尺寸随节点量收放：5 个节点给 620 高会空出一大片（真机截图像"图没画完"） */
    let W = 900, H = points.length <= 6 ? 380 : (topics.length <= 2 ? 420 : 620)
    let cx = W / 2, cy = H / 2
    /* 簇半径先算出来，再用**最大簇**反推纵向半径：
     * 否则顶部那一簇会顶出画布，簇标签被裁掉（截图里就是"那颗簇没有名字"）。 */
    let grs = []
    let grMax = 0
    for (let i = 0; i < topics.length; i++) {
      let n = byTopic[topics[i]].length
      let g = n <= 1 ? 0 : Math.min(140, 52 + n * 12)
      grs.push(g)
      if (g > grMax) grMax = g
    }
    let rx = Math.min(W * 0.32, 330)
    let ry = Math.max(46, Math.min(H * 0.30, H / 2 - grMax - 34))
    let nodes = [], clusters = []
    for (let i = 0; i < topics.length; i++) {
      let t = topics[i]
      let arr = byTopic[t]
      /* 只有一簇时**必须放正中心**：否则 cos(0)*r 会把唯一的簇推到右边（截图里"一颗星挂在角落"） */
      let a = (i / Math.max(1, topics.length)) * Math.PI * 2 - Math.PI / 2
      let gx = topics.length === 1 ? cx : cx + Math.cos(a) * rx
      let gy = topics.length === 1 ? cy : cy + Math.sin(a) * ry
      let gr = grs[i]
      clusters.push({ x: gx, y: gy, label: t, n: arr.length, gr: gr })
      for (let j = 0; j < arr.length; j++) {
        let p = arr[j]
        let ang = arr.length === 1 ? 0 : (j / arr.length) * Math.PI * 2 - Math.PI / 2
        let rr = gr * (arr.length <= 2 ? 0.55 : 0.78)
        let x = arr.length === 1 ? gx : gx + Math.cos(ang) * rr
        let y = arr.length === 1 ? gy : gy + Math.sin(ang) * rr
        nodes.push({
          p: p,
          x: x, y: y,
          r: 13 + Math.min(17, (p.reps || 0) * 3),
          ci: i
        })
      }
    }
    return { W: W, H: H, nodes: nodes, clusters: clusters }
  }

  function viewCrystal(ctx, S) {
    let out = []
    let pts = S.points.filter(function (p) {
      if (S.crystalSubj !== 'all' && p.subject !== S.crystalSubj) return false
      if (S.crystalWeak && (p.mastery || 0) >= 60) return false
      return true
    })
    out.push('<section class="fx-card fx-crystal-card">')
    out.push('<div class="fx-card-h"><b>晶体</b><em>' + pts.length + ' 个节点</em>'
      + '<button class="fx-btn ghost sm' + (S.crystalWeak ? ' on' : '') + '" data-act="weak-toggle">只看薄弱</button>'
      + '<button class="fx-btn ghost sm" data-act="newpoint">+ 新节点</button></div>')
    /* 学科筛选：点第二次取消（用 on 态表示当前筛选项，不做下拉 —— 手指点两下比开下拉快） */
    out.push('<div class="fx-subjbar">'
      + '<button class="fx-schip' + (S.crystalSubj === 'all' ? ' on' : '') + '" data-act="subj" data-k="all">全部</button>'
      + SUBJ_ORDER.map(function (k) {
        return '<button class="fx-schip' + (S.crystalSubj === k ? ' on' : '') + '" data-act="subj" data-k="' + k + '"'
          + ' style="--c:' + subjectColor(k) + '">' + subjectLabel(k) + '</button>'
      }).join('')
      + '</div>')

    if (!pts.length) {
      out.push(emptyCard(icon({ U: window.U }, 'puzzle'), '晶体还没长出来',
        S.points.length ? '当前筛选下没有节点，试试切回「全部」' : '先建一个知识点，复述一次它就会亮起来',
        S.points.length ? '' : '新建知识点', 'newpoint'))
      out.push('</section>')
      return out.join('')
    }

    let lay = crystalLayout(pts)
    let svg = ['<svg class="fx-crystal" viewBox="0 0 ' + lay.W + ' ' + lay.H + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="掌握度晶体图">']
    /* 背景网格（很淡，只做空间感，不抢节点） */
    svg.push('<defs><radialGradient id="fxcg" cx="50%" cy="45%" r="60%">'
      + '<stop offset="0" stop-color="rgba(15,118,110,.10)"/><stop offset="1" stop-color="rgba(15,118,110,0)"/>'
      + '</radialGradient></defs>')
    svg.push('<rect x="0" y="0" width="' + lay.W + '" height="' + lay.H + '" fill="url(#fxcg)"/>')
    /* 簇连线（中心 → 节点）：弱化到 .16，只在视觉上把同主题圈在一起 */
    for (let i = 0; i < lay.nodes.length; i++) {
      let n = lay.nodes[i]
      let c = lay.clusters[n.ci]
      svg.push('<line x1="' + c.x.toFixed(1) + '" y1="' + c.y.toFixed(1) + '" x2="' + n.x.toFixed(1) + '" y2="' + n.y.toFixed(1) + '"'
        + ' stroke="rgba(20,32,28,.16)" stroke-width="1" stroke-dasharray="3 4"/>')
    }
    /* 簇标签 */
    for (let i = 0; i < lay.clusters.length; i++) {
      let c = lay.clusters[i]
      /* 标签放在簇半径之外（gr + 18）：固定偏移会在节点多时压住最上面那颗 */
      /* 夹住上边界：簇多/簇大时标签会算出负 y，被 SVG 裁掉 = 那颗簇"没有名字" */
      let ly = Math.max(14, c.y - (c.gr + 20))
      svg.push('<text x="' + c.x.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="middle" class="fx-clabel">'
        + esc(c.label) + ' · ' + c.n + '</text>')
    }
    /* 节点：外圈光晕（掌握度越高越亮）+ 实心圆 + 呼吸动画（delay 按下标错开，避免同频闪烁） */
    for (let i = 0; i < lay.nodes.length; i++) {
      let n = lay.nodes[i]
      let col = masteryColor(n.p.mastery)
      let dim = n.p.mastery ? 1 : 0.55
      let delay = (i % 9) * 0.28
      svg.push('<g class="fx-node" data-node="' + esc(n.p.id) + '" style="--c:' + col.c + ';animation-delay:' + delay.toFixed(2) + 's" tabindex="0" role="button">'
        + '<title>' + esc(n.p.title) + '｜' + masteryLabel(n.p.mastery) + ' ' + (n.p.mastery || 0) + '｜复述 ' + (n.p.reps || 0) + ' 次</title>'
        + '<circle cx="' + n.x.toFixed(1) + '" cy="' + n.y.toFixed(1) + '" r="' + (n.r + 9).toFixed(1) + '" fill="' + col.soft + '" opacity="' + dim + '"/>'
        + '<circle cx="' + n.x.toFixed(1) + '" cy="' + n.y.toFixed(1) + '" r="' + n.r.toFixed(1) + '" fill="' + col.c + '" opacity="' + dim + '"/>'
        + '<text x="' + n.x.toFixed(1) + '" y="' + (n.y + n.r + 13).toFixed(1) + '" text-anchor="middle" class="fx-nlabel">'
        + esc(shortTitle(n.p.title, 8)) + '</text>'
        + '</g>')
    }
    svg.push('</svg>')
    out.push('<div class="fx-crystal-wrap">' + svg.join('') + '</div>')
    out.push('<div class="fx-legend">'
      + [85, 65, 40, 1, 0].map(function (m) {
        let c = masteryColor(m)
        return '<span><i style="background:' + c.c + '"></i>' + masteryLabel(m) + '</span>'
      }).join('')
      + '<span class="fx-legend-tip">圆越大 = 复述越多</span></div>')
    out.push('</section>')

    /* 选中节点的详情（点节点后切到复述台，这里也给一个"最近复述"列表帮助回看） */
    let recent = S.sessions.slice(-5).reverse()
    if (recent.length) {
      out.push('<section class="fx-card"><div class="fx-card-h"><b>最近复述</b><em>' + recent.length + ' 条</em></div><div class="fx-recent">')
      for (let i = 0; i < recent.length; i++) {
        let s = recent[i]
        let p = findPoint(S.points, s.pid)
        let col = masteryColor(s.score)
        out.push('<div class="fx-recent-row">'
          + '<span class="fx-recent-score" style="color:' + col.c + '">' + s.score + '</span>'
          + '<div><b>' + esc(p ? shortTitle(p.title, 20) : '（已删除的知识点）') + '</b>'
          + '<span>' + fmtDate(dkey(new Date(s.at))) + ' · ' + s.qa.length + ' 题 · ' + fmtDur(s.ms) + '</span></div>'
          + '<i class="fx-recent-bar"><b style="width:' + clamp(s.score, 0, 100) + '%;background:' + col.c + '"></b></i>'
          + '</div>')
      }
      out.push('</div></section>')
    }
    return out.join('')
  }

  function bindCrystal(ctx, S, stage, paint, go) {
    let wrap = stage.querySelector('.fx-crystal-wrap')
    if (!wrap) return
    let nodes = wrap.querySelectorAll('.fx-node')
    for (let i = 0; i < nodes.length; i++) {
      let id = nodes[i].getAttribute('data-node')
      nodes[i].addEventListener('click', function () {
        S.selId = id
        go('train')
      })
      /* 键盘可达：晶体图不该只有鼠标能用 */
      nodes[i].addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); S.selId = id; go('train') }
      })
    }
  }

  /* ============================================================
   * 8. 视图三：复习队列
   * ------------------------------------------------------------
   * 语义要写清楚：这里是"该复习了"的队列，不是"全部知识点"。
   * 逾期天数必须显眼 —— 逾期越久，遗忘越接近"从没学过"，
   * 用户需要看到代价，而不是一条温和的提醒。
   * ============================================================ */
  function viewReview(ctx, S) {
    let today = todayKey()
    let due = dueList(S.points, today)
    let load = loadAhead(S.points, today, 7)
    let out = []
    out.push('<section class="fx-card">')
    out.push('<div class="fx-card-h"><b>复习队列</b><em>' + (due.length ? due.length + ' 个待复习' : '清空了') + '</em>'
      + (due.length ? '<button class="fx-btn primary sm" data-act="start">从最逾期的开始</button>' : '')
      + '</div>')
    if (!due.length) {
      out.push(emptyCard(icon({ U: window.U }, 'cpCheck'), '今天没有到期的',
        S.points.length ? '新知识点会在掌握度低时更早回到队列；去晶体图挑一个加练也行' : '还没有知识点',
        S.points.length ? '去晶体图' : '新建知识点', S.points.length ? 'goto-crystal' : 'newpoint'))
    } else {
      out.push('<div class="fx-qlist">')
      for (let i = 0; i < due.length; i++) {
        let p = due[i]
        let od = overdueDays(p, today)
        let col = masteryColor(p.mastery)
        out.push('<div class="fx-qrow' + (od >= 3 ? ' hot' : '') + '">'
          + '<span class="fx-qdot" style="background:' + col.c + '"></span>'
          + '<div class="fx-qmain"><b>' + esc(shortTitle(p.title, 24)) + '</b>'
          + '<span>' + esc(subjectLabel(p.subject)) + (p.topic ? ' · ' + esc(p.topic) : '')
          + ' · ' + (p.mastery ? masteryLabel(p.mastery) + ' ' + p.mastery : '还没复述过')
          + (p.reps ? ' · 复述 ' + p.reps + ' 次' : '') + '</span></div>'
          + (od ? '<span class="fx-od' + (od >= 3 ? ' hot' : '') + '">逾期 ' + od + ' 天</span>' : '<span class="fx-od ok">今天</span>')
          + '<button class="fx-btn primary sm" data-act="start" data-id="' + esc(p.id) + '">复述</button>'
          + '</div>')
      }
      out.push('</div>')
    }
    out.push('</section>')

    out.push('<section class="fx-card">')
    out.push('<div class="fx-card-h"><b>未来 7 天</b><em>每天到期多少</em></div>')
    out.push('<div class="fx-load">')
    let max = 1
    for (let i = 0; i < load.length; i++) max = Math.max(max, load[i].n)
    for (let i = 0; i < load.length; i++) {
      let d = load[i]
      let h = Math.round((d.n / max) * 100)
      out.push('<div class="fx-load-col' + (i === 0 ? ' today' : '') + '">'
        + '<i><b style="height:' + Math.max(d.n ? 6 : 2, h) + '%"></b></i>'
        + '<em>' + (i === 0 ? '今' : (+d.key.slice(8))) + '</em>'
        + '<span>' + d.n + '</span>'
        + '</div>')
    }
    out.push('</div>')
    out.push('<div class="fx-quiet">间隔按艾宾浩斯阶梯（1/2/4/7/15/30/60 天）：讲得好就往后跳，讲糊了减半，讲砸了明天再来。</div>')
    out.push('</section>')
    return out.join('')
  }

  function bindReview(ctx, S, stage, paint, startRun) {
    /* 队列按钮走委托（data-act="start"），这里不需要额外绑定；
     * 保留函数是为了与其它视图同构（将来加拖拽排序时只改这里）。 */
  }

  /* ============================================================
   * 9. 视图四：统计
   * ------------------------------------------------------------
   * 只呈现"能改变决策"的数：哪科最虚、哪些点最薄、这周比上周练得多不多。
   * 不做"总时长 XX 小时"这种只让人感觉良好的指标。
   * ============================================================ */
  function viewStats(ctx, S) {
    let today = todayKey()
    let out = []
    let pts = S.points
    let avg = 0, crystal = 0, weak = 0
    for (let i = 0; i < pts.length; i++) {
      avg += pts[i].mastery || 0
      if ((pts[i].mastery || 0) >= 85) crystal++
      if ((pts[i].mastery || 0) < 40) weak++
    }
    avg = pts.length ? Math.round(avg / pts.length) : 0

    /* ---- 总览 ---- */
    out.push('<section class="fx-card"><div class="fx-card-h"><b>总览</b><em>' + pts.length + ' 个知识点</em>'
      + '<button class="fx-btn ghost sm" data-act="exp-md">导出报告</button></div>')
    out.push('<div class="fx-overview">')
    out.push('<div class="fx-ov-ring">' + ringSvg(avg, 92, masteryColor(avg).c, String(avg)) + '<i>平均掌握度</i></div>')
    out.push('<div class="fx-ov-grid">'
      + '<div class="fx-ov-cell"><b>' + crystal + '</b><span>已结晶（≥85）</span></div>'
      + '<div class="fx-ov-cell"><b>' + weak + '</b><span>薄弱（<40）</span></div>'
      + '<div class="fx-ov-cell"><b>' + S.sessions.length + '</b><span>累计复述</span></div>'
      + '<div class="fx-ov-cell"><b>' + streakOf(S.sessions) + '</b><span>连续天数</span></div>'
      + '</div>')
    out.push('</div></section>')

    /* ---- 近 14 天复述量（按会话日期聚合；空白天也要占位，否则看不出断档） ---- */
    let days = []
    for (let i = 13; i >= 0; i--) {
      let k = addDays(today, -i)
      let n = 0
      for (let j = 0; j < S.sessions.length; j++) {
        if (dkey(new Date(S.sessions[j].at)) === k) n++
      }
      days.push({ key: k, n: n, label: fmtDate(k), c: 'var(--fx-acc)' })
    }
    let total14 = 0
    for (let i = 0; i < days.length; i++) total14 += days[i].n
    out.push('<section class="fx-card"><div class="fx-card-h"><b>近 14 天</b><em>共 ' + total14 + ' 次复述</em></div>')
    out.push('<div class="fx-bars-wrap">' + barsSvg(days, { w: 640, h: 72 }) + '</div>')
    out.push('<div class="fx-axis"><span>' + fmtDate(days[0].key) + '</span><span>今天</span></div>')
    out.push('</section>')

    /* ---- 学科分布（条宽按该科平均掌握度，右侧给"点数/平均"） ---- */
    out.push('<section class="fx-card"><div class="fx-card-h"><b>学科</b><em>哪科最虚</em></div>')
    let anySubj = false
    for (let i = 0; i < SUBJ_ORDER.length; i++) {
      let k = SUBJ_ORDER[i]
      let arr = pts.filter(function (p) { return p.subject === k })
      if (!arr.length) continue
      anySubj = true
      let a = 0
      for (let j = 0; j < arr.length; j++) a += arr[j].mastery || 0
      a = Math.round(a / arr.length)
      let col = masteryColor(a)
      out.push('<div class="fx-subjrow">'
        + '<span class="fx-subjname" style="--c:' + subjectColor(k) + '">' + subjectLabel(k) + '</span>'
        + '<i class="fx-subdist"><b style="width:' + a + '%;background:' + col.c + '"></b></i>'
        + '<em>' + a + '</em><span class="fx-subjn">' + arr.length + ' 个</span>'
        + '</div>')
    }
    if (!anySubj) out.push('<div class="fx-quiet">还没有知识点</div>')
    out.push('</section>')

    /* ---- 薄弱 Top5（按掌握度升序，只列复述过的；没复述过的不算"薄弱"，那是"没开始"） ---- */
    let thin = pts.filter(function (p) { return (p.reps || 0) > 0 }).sort(function (a, b) { return (a.mastery || 0) - (b.mastery || 0) }).slice(0, 5)
    out.push('<section class="fx-card"><div class="fx-card-h"><b>最该补的 5 个</b><em>按掌握度升序</em></div>')
    if (!thin.length) out.push('<div class="fx-quiet">还没有复述记录 —— 先去复述一次，这里才有东西可排。</div>')
    else {
      out.push('<div class="fx-thin">')
      for (let i = 0; i < thin.length; i++) {
        let p = thin[i]
        let col = masteryColor(p.mastery)
        out.push('<div class="fx-thin-row">'
          + '<span class="fx-thin-n">' + (i + 1) + '</span>'
          + '<div><b>' + esc(shortTitle(p.title, 22)) + '</b><span>' + esc(subjectLabel(p.subject)) + ' · ' + masteryLabel(p.mastery) + '</span></div>'
          + '<i class="fx-thin-bar"><b style="width:' + clamp(p.mastery, 0, 100) + '%;background:' + col.c + '"></b></i>'
          + '<button class="fx-btn ghost sm" data-act="start" data-id="' + esc(p.id) + '">补一次</button>'
          + '</div>')
      }
      out.push('</div>')
    }
    out.push('</section>')

    /* ---- 复述记录：能回看"当时怎么讲的、被判了什么" ---- */
    let hist = S.sessions.slice(-12).reverse()
    out.push('<section class="fx-card"><div class="fx-card-h"><b>复述记录</b><em>最近 ' + hist.length + ' 次</em></div>')
    if (!hist.length) out.push('<div class="fx-quiet">还没有复述记录。</div>')
    else {
      out.push('<div class="fx-hist">')
      for (let i = 0; i < hist.length; i++) {
        let ss = hist[i]
        let p = findPoint(S.points, ss.pid)
        let col = masteryColor(ss.score)
        out.push('<details class="fx-hitem">'
          + '<summary><b style="color:' + col.c + '">' + ss.score + '</b>'
          + '<span>' + esc(p ? shortTitle(p.title, 24) : '（已删除的知识点）') + '</span>'
          + '<em>' + fmtDate(dkey(new Date(ss.at))) + ' · ' + ss.qa.length + ' 题 · ' + fmtDur(ss.ms) + '</em></summary>'
          + '<div class="fx-hbody">')
        for (let j = 0; j < ss.qa.length; j++) {
          let qa = ss.qa[j]
          out.push('<div class="fx-hqa">'
            + '<b>Q' + (j + 1) + '　' + esc(shortTitle(qa.q, 60)) + '</b>'
            + '<p>' + esc(shortTitle(String(qa.a || '').replace(/\s+/g, ' '), 220)) + '</p>'
            + '<span>准 ' + qa.v.accuracy + ' · 洽 ' + qa.v.coherence + ' · 俗 ' + qa.v.plainness
            + (qa.v.manual ? ' · 自评' : '') + (qa.v.comment ? '　' + esc(qa.v.comment) : '') + '</span>'
            + '</div>')
        }
        out.push('</div></details>')
      }
      out.push('</div>')
    }
    out.push('</section>')
    return out.join('')
  }

  function bindStats(ctx, S, stage) { /* 全部走委托；保留占位以便将来加图表交互 */ }

  /* ============================================================
   * 10. 视图五：设置与数据
   * ------------------------------------------------------------
   * 注意：真正的配置项由**插件中心的配置面板**渲染（manifest.config），
   * 这里只做"当前生效值 + 去哪儿改 + 体检 + 数据进出"。
   * 为什么不在插件里再画一套表单：两处都能改配置 = 必然出现"改了这里没生效"。
   * ============================================================ */
  function viewSetup(ctx, S) {
    let ai = aiOk(ctx)
    let out = []
    out.push('<section class="fx-card"><div class="fx-card-h"><b>环境体检</b><em>决定判定精度</em></div>')
    out.push('<div class="fx-health">'
      + '<span class="fx-hcell ' + (ai ? 'ok' : 'no') + '"><i></i>' + (ai ? 'AI 已配置：可自动出题 + 三维判定' : '未配置 AI：本地模板出题 + 自评') + '</span>'
      + '<span class="fx-hcell ' + (S.points.length ? 'ok' : 'no') + '"><i></i>知识点 ' + S.points.length + ' 个</span>'
      + '<span class="fx-hcell ' + (S.sessions.length ? 'ok' : 'no') + '"><i></i>复述记录 ' + S.sessions.length + ' 条</span>'
      + '</div>')
    out.push('<div class="fx-acts"><button class="fx-btn" data-act="ai-test">测一次 AI 判定</button>'
      + '<span class="fx-hint">未配置也能用，只是判定换成自评</span></div>')
    out.push('</section>')

    out.push('<section class="fx-card"><div class="fx-card-h"><b>当前生效设置</b><em>在插件中心改</em></div>')
    out.push('<div class="fx-cfglist">'
      + cfgRow('每次问题层数', String(clamp(ctx.config('levels') || 3, 1, 4)) + ' 层', '层数越多越逼近"能不能重建"，也越累')
      + cfgRow('判定严格度', String(ctx.config('strict') || '标准'), '严格档下只有结论没有推导最高 60 分')
      + cfgRow('自评后自动继续', ctx.config('autoNext') === false ? '关' : '开', '关掉后自评完停在判定卡，需手动点「下一题」')
      + '</div>')
    out.push('<div class="fx-quiet">改法：插件中心 →「费曼晶体」→ 配置。设置只有一处入口，避免"改了没生效"。</div>')
    out.push('</section>')

    out.push('<section class="fx-card"><div class="fx-card-h"><b>数据</b><em>本机存储</em></div>')
    out.push('<div class="fx-quiet">知识点与复述记录存在本机（插件命名空间），不上云。换设备请用 JSON 导出/导入。</div>')
    out.push('<div class="fx-acts">'
      + '<button class="fx-btn" data-act="exp-json">导出 JSON</button>'
      + '<button class="fx-btn" data-act="exp-md">导出 Markdown</button>'
      + '<button class="fx-btn ghost" data-act="imp-json">导入 JSON</button>'
      + '<button class="fx-btn ghost danger" data-act="wipe">清空全部</button>'
      + '</div>')
    out.push('</section>')

    out.push('<section class="fx-card"><div class="fx-card-h"><b>关于</b><em>v' + VERSION + '</em></div>')
    out.push('<div class="fx-about">'
      + '<p><b>费曼晶体</b>：把"看懂"变成"讲得出来"。三层递进提问 + 三维判定 + 遗忘曲线复习。</p>'
      + '<p>判定口径：准确 50% / 自洽 30% / 通俗 20%；掌握度按 0.45×旧 + 0.55×新 融合，讲满三层且 ≥85 分额外 +4。</p>'
      + '<p>复习间隔：1/2/4/7/15/30/60 天；≥80 分进一格，60-79 减半，&lt;60 明天再来。</p>'
      + '<p class="fx-quiet">数据形状变更时会自动迁移（见 normPoint/normSession），不会因为升级丢记录。</p>'
      + '</div></section>')
    return out.join('')
  }
  function cfgRow(label, val, tip) {
    return '<div class="fx-cfgrow"><b>' + esc(label) + '</b><em>' + esc(val) + '</em><span>' + esc(tip) + '</span></div>'
  }
  function bindSetup(ctx, S, stage, paint, reload) { /* 委托即可 */ }

  /* ---- 数据进出 ---- */
  function exportJson(ctx, S) {
    let payload = {
      app: 'feynman-crystal',
      version: VERSION,
      exportedAt: new Date().toISOString(),
      points: S.points,
      sessions: S.sessions
    }
    ctx.api.download('feynman-crystal-' + todayKey() + '.json', JSON.stringify(payload, null, 2), 'application/json')
    toast(ctx, '已导出 JSON', 'success')
  }
  function exportMarkdown(ctx, S) {
    let lines = ['# 费曼晶体 · 复述报告', '', '导出时间：' + new Date().toLocaleString(), '']
    let today = todayKey()
    let avg = 0
    for (let i = 0; i < S.points.length; i++) avg += S.points[i].mastery || 0
    avg = S.points.length ? Math.round(avg / S.points.length) : 0
    lines.push('## 总览')
    lines.push('- 知识点：' + S.points.length + ' 个')
    lines.push('- 平均掌握度：' + avg + '（' + masteryLabel(avg) + '）')
    lines.push('- 累计复述：' + S.sessions.length + ' 次')
    lines.push('- 连续天数：' + streakOf(S.sessions) + ' 天')
    lines.push('- 今天到期：' + dueList(S.points, today).length + ' 个')
    lines.push('')
    lines.push('## 知识点清单')
    lines.push('| 知识点 | 学科 | 掌握度 | 档位 | 复述 | 上次 | 下次 |')
    lines.push('|---|---|---|---|---|---|---|')
    let sorted = S.points.slice().sort(function (a, b) { return (a.mastery || 0) - (b.mastery || 0) })
    for (let i = 0; i < sorted.length; i++) {
      let p = sorted[i]
      lines.push('| ' + p.title.replace(/\|/g, '/') + ' | ' + subjectLabel(p.subject) + ' | ' + (p.mastery || 0)
        + ' | ' + masteryLabel(p.mastery) + ' | ' + (p.reps || 0) + ' | ' + (p.lastAt || '—') + ' | ' + (p.nextAt || '今天') + ' |')
    }
    lines.push('')
    lines.push('## 最近 10 次复述')
    let recent = S.sessions.slice(-10).reverse()
    for (let i = 0; i < recent.length; i++) {
      let s = recent[i]
      let p = findPoint(S.points, s.pid)
      lines.push('### ' + (p ? p.title : '（已删除）') + ' · ' + s.score + ' 分 · ' + fmtDate(dkey(new Date(s.at))))
      for (let j = 0; j < s.qa.length; j++) {
        let qa = s.qa[j]
        lines.push('- 问：' + qa.q)
        lines.push('  答：' + String(qa.a || '').replace(/\n/g, ' ').slice(0, 160))
        if (qa.v && qa.v.comment) lines.push('  评：' + qa.v.comment + '（准 ' + qa.v.accuracy + ' / 洽 ' + qa.v.coherence + ' / 俗 ' + qa.v.plainness + '）')
      }
      lines.push('')
    }
    ctx.api.download('feynman-crystal-' + todayKey() + '.md', lines.join('\n'), 'text/markdown;charset=utf-8')
    toast(ctx, '已导出 Markdown', 'success')
  }
  function importJson(ctx, done) {
    ctx.api.readFile('.json,application/json').then(function (f) {
      let data = null
      try { data = JSON.parse(String(f.text || '')) } catch (e) {
        toast(ctx, '不是合法 JSON：' + ((e && e.message) || ''), 'warn')
        return
      }
      let pts = Array.isArray(data && data.points) ? data.points : (Array.isArray(data) ? data : [])
      let sss = Array.isArray(data && data.sessions) ? data.sessions : []
      if (!pts.length) { toast(ctx, '文件里没有知识点（要 feynman-crystal 导出的 JSON）', 'warn'); return }
      ctx.api.confirm('导入 ' + pts.length + ' 个知识点？',
        '<div class="muted-sm">按 id 去重合并：已存在的会覆盖为文件里的版本，其余新增。当前库有 ' + loadPoints(ctx).length + ' 个。</div>',
        function () {
          let cur = loadPoints(ctx)
          let map = {}
          for (let i = 0; i < cur.length; i++) map[cur[i].id] = cur[i]
          let added = 0
          for (let i = 0; i < pts.length; i++) {
            let p = normPoint(pts[i])
            if (!p) continue
            if (!map[p.id]) added++
            map[p.id] = p
          }
          let merged = []
          for (let k in map) if (Object.prototype.hasOwnProperty.call(map, k)) merged.push(map[k])
          savePoints(ctx, merged)
          let oldS = loadSessions(ctx)
          let seen = {}
          for (let i = 0; i < oldS.length; i++) seen[oldS[i].id] = 1
          let addS = []
          for (let i = 0; i < sss.length; i++) {
            let s = normSession(sss[i])
            if (s && !seen[s.id]) addS.push(s)
          }
          if (addS.length) saveSessions(ctx, oldS.concat(addS))
          if (done) done()
          toast(ctx, '导入完成：新增 ' + added + ' 个，记录 +' + addS.length, 'success')
        })
    })['catch'](function (e) {
      toast(ctx, '读取文件失败：' + ((e && e.message) || ''), 'warn')
    })
  }
  /** AI 体检：真打一次最小请求，比"配置里填了 key"更可信 */
  function aiSelfTest(ctx) {
    if (!aiOk(ctx)) { toast(ctx, '未配置 AI：设置页填好接口后就能自动判定', 'warn', 2600); return }
    toast(ctx, '正在测试…', 'info', 1200)
    /* 探活走伪场景 probe.connect（全站「连通性测试」共用一桶），
     * 不占用业务场景的 Token/温度配置，也不该在参数中心里多出一行。 */
    ctx.ai.json('只输出 JSON：{"ok":true}', '回一个 {"ok":true} 即可。', { ctx: 'probe.connect' }).then(function () {
      toast(ctx, 'AI 可用：出题与判定都会自动跑', 'success', 2600)
    })['catch'](function (e) {
      toast(ctx, 'AI 调用失败：' + ((e && e.message) || '') + '（不影响本地模板模式）', 'warn', 3200)
    })
  }

  /* ---------- 共享层：宿主 css 字段（硬上限 20000 字符）----------
   * 设计语言 = **讲义式排版**（2026-10-22 用户要求换掉卡片风）：
   *   去圆角卡片 / 去投影 / 去填充块，改用「细线分节 + 衬线标题 + 大数字 + 留白」；
   *   全页只有一处填充色块（主行动按钮）与一处玻璃（吸顶页眉 + dock）。
   * 为什么要有第二张表：宿主 normalize() 会把 css 截到 20000 字符，超了**静默截断**
   * （末尾规则直接消失、不报错）→ 只放"任何场景都要有"的规则。 */
  /* ════════════════════════ 站内图标（2026-10-22 用户要求：摆脱原生 emoji） ════════════════════════
   * 为什么不留 emoji：emoji 是**字体渲染**的，同一个字符在 Win/Android/iOS 上是三套画风，
   * 尺寸、基线、颜色都不受控 —— 混在用线性 SVG 做的站内 UI 里就像贴纸；夜间主题下更明显
   * （emoji 自带彩色，卡片暗下去它还是亮的）。
   *
   * 取值顺序（都是站内公开层，不碰 Store/AI/App 这些内部单例）：
   *   ① ctx.U.icon(key) —— 与站内视觉逐像素一致、随主题换色、带 .ci 基线样式；
   *   ② window.ICONS[key] —— globals 注册的同一张图标表。**必须有这一级**：
   *      manifest 的 icon 在 register() 时就求值（比 init(ctx) 早），那时还没有 ctx；
   *   ③ 都取不到 → 返回空串。调用方对「纯图标按钮」都要写 `I(k) || '文字'` 兜底，
   *      否则图标缺了按钮会变成空白方块（点了没反馈的那种"坏按钮"）。
   *
   * 铁律：key 必须是 site icons.ts SPEC 里真实存在的语义名（传错静默得空串，不报错）。
   * 本文件用到的每一个 key 都已对照 SPEC 核过。 */
  let HOST_CTX = null
  function I(key, cls) {
    try {
      if (HOST_CTX && HOST_CTX.U && typeof HOST_CTX.U.icon === 'function') {
        let s = HOST_CTX.U.icon(key, cls)
        if (s) return s
      }
    } catch (e) { /* 宿主图标层异常 → 走下一级 */ }
    try {
      if (typeof window !== 'undefined' && window.ICONS && window.ICONS[key]) {
        return String(window.ICONS[key]).replace('<svg', '<svg class="ci ' + (cls || '') + '"')
      }
    } catch (e) { /* 无 window 环境（单测 teardown）*/ }
    return ''
  }

    /* ---------- 共享层：宿主 css 字段（硬上限 20000 字符）----------
   * 只放"任何场景都要有"的规则：页眉 / dock / 卡片骨架 / 按钮 / 表单基础 / 列表 /
   * 空态 / 侧边面板 / 夜间 / 响应式。晶体图、统计、设置、结束卡等**工具页专属**规则
   * 放到下面的页面层（mount 时注入、destroy 移除），给共享层留出余量。 */
  let CSS = [
    '.fx-root{--fx-acc:#0f766e;--fx-acc2:#2563eb;--fx-on-acc:#fff;--fx-warn-ink:#b45309;--fx-ink:var(--text-primary,#1b2430);--fx-sub:var(--text-muted,#6b7788);--fx-line:var(--line,#e5e7eb);--fx-line2:color-mix(in srgb,var(--text-primary,#1b2430) 24%,transparent);--fx-bg:var(--surface,#fff);--fx-soft:var(--surface-muted,#f6f8fb);--fx-gut:var(--vp-x,16px);--fx-w:1180px;position:relative;color:var(--fx-ink);font:14px/1.65 "PingFang SC","Noto Sans SC","Microsoft YaHei",system-ui,sans-serif}',
    'html[data-theme="night"] .fx-root{--fx-acc:var(--nk-acc,#f0b95a);--fx-acc2:#e2a43f;--fx-on-acc:var(--nk-acc-ink,#2a1c04);--fx-warn-ink:var(--warn,#e8ae3f)}',
    'html[data-theme="night"] .fx-btn.danger,html[data-theme="night"] .fx-icobtn.danger{color:var(--danger,#ef6a63)}',
    '.fx-root *,.fx-root *::before,.fx-root *::after{box-sizing:border-box}',
    '.fx-root button{font-family:inherit;color:inherit}',
    '.fx-aura{position:absolute;inset:calc(var(--vp-t,16px) * -1) calc(var(--vp-x,16px) * -1) calc(var(--vp-b,24px) * -1);z-index:0;pointer-events:none;overflow:hidden;background-image:repeating-linear-gradient(90deg,color-mix(in srgb,var(--fx-ink) 4%,transparent) 0 1px,transparent 1px 96px);mask-image:linear-gradient(180deg,#000,transparent 72%);-webkit-mask-image:linear-gradient(180deg,#000,transparent 72%)}',
    '.fx-aura i{position:absolute;border-radius:50%;filter:blur(90px);opacity:.28}',
    '.fx-aura i:nth-child(1){width:460px;height:460px;left:-160px;top:-200px;background:radial-gradient(circle,rgba(15,118,110,.5),transparent 68%);animation:fxFloat 30s ease-in-out infinite alternate}',
    '.fx-aura i:nth-child(2){width:380px;height:380px;right:-140px;top:-90px;background:radial-gradient(circle,rgba(37,99,235,.35),transparent 70%);animation:fxFloat 38s ease-in-out infinite alternate-reverse}',
    '.fx-aura i:nth-child(3){display:none}',
    '@keyframes fxFloat{to{transform:translate3d(30px,-22px,0) scale(1.06)}}',
    '.fx-top{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:16px;margin:0 calc(-1 * var(--fx-gut));padding:15px calc(var(--fx-gut) + max(6px,(100% - var(--fx-w)) / 2)) 13px;background:transparent;transition:padding .3s cubic-bezier(.22,1,.36,1),background-color .3s ease}',
    '.fx-top::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--fx-line);opacity:0;transition:opacity .3s ease}',
    '.fx-top.is-stuck{padding-top:8px;padding-bottom:8px;background:color-mix(in srgb,var(--fx-bg) 88%,transparent);backdrop-filter:blur(18px) saturate(1.1);-webkit-backdrop-filter:blur(18px) saturate(1.1)}',
    '.fx-top.is-stuck::after{opacity:1}',
    '.fx-brand{display:flex;align-items:center;gap:11px;min-width:0}',
    '.fx-mark{width:40px;height:40px;flex:0 0 40px;display:grid;place-items:center;color:var(--fx-acc);transition:width .3s,height .3s,flex-basis .3s}',
    '.fx-mark svg{width:34px;height:34px}',
    '.fx-top.is-stuck .fx-mark{width:30px;height:30px;flex-basis:30px}',
    '.fx-top.is-stuck .fx-mark svg{width:26px;height:26px}',
    '.fx-brandtx{display:flex;flex-direction:column;min-width:0}',
    '.fx-kicker{font:600 8.5px/1.5 ui-monospace,Consolas,monospace;letter-spacing:.24em;color:var(--fx-sub);text-transform:uppercase;max-height:13px;overflow:hidden;transition:max-height .3s,opacity .3s}',
    '.fx-top.is-stuck .fx-kicker{max-height:0;opacity:0}',
    '.fx-brandtx b{font-family:Georgia,"Songti SC","Noto Serif SC",serif;font-size:21px;font-weight:700;letter-spacing:.05em;white-space:nowrap;transition:font-size .3s}',
    '.fx-top.is-stuck .fx-brandtx b{font-size:17px}',
    '.fx-brandtx em{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:9.5px;color:var(--fx-sub);margin-left:7px;letter-spacing:.06em}',
    '.fx-kpis{display:flex;align-items:baseline;margin-left:auto}',
    '.fx-kpi{display:flex;flex-direction:column;align-items:center;padding:0 14px;border-left:1px solid var(--fx-line);min-width:54px}',
    '.fx-kpi:first-child{border-left:0}',
    '.fx-kpi b{font-family:Georgia,serif;font-size:21px;line-height:1.15;font-variant-numeric:tabular-nums;transition:font-size .3s}',
    '.fx-top.is-stuck .fx-kpi b{font-size:17px}',
    '.fx-kpi i{font-style:normal;font-size:9.5px;color:var(--fx-sub);letter-spacing:.14em;text-transform:uppercase}',
    '.fx-kpi.warn b{color:#b45309}',
    '.fx-kpi b em{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:11px;color:var(--fx-sub);letter-spacing:0}',
    '.fx-kpi.ok b{color:var(--fx-acc)}',
    '.fx-goalline{display:flex;align-items:baseline;gap:12px;margin:0 0 14px;font-size:12px;color:var(--fx-sub)}',
    '.fx-goalline>b{font-family:Georgia,serif;font-size:14px;color:var(--fx-ink);font-weight:700}',
    '.fx-goalline.ok>b{color:var(--fx-acc)}',
    '.fx-goalbar{margin-left:auto;width:120px;height:2px;background:var(--fx-line2);overflow:hidden}',
    '.fx-goalbar b{display:block;height:100%;background:var(--fx-acc);transition:width .6s cubic-bezier(.22,1,.36,1)}',
    '.fx-searchbar{display:flex;align-items:center;gap:20px;flex-wrap:wrap;margin-bottom:10px}',
    '.fx-searchbar .fx-subjbar{margin:0;padding:0;border:0;flex:0 0 auto}',
    '.fx-search{flex:1;min-width:180px;max-width:320px}',
    '.fx-topacts{display:flex;align-items:center;gap:10px;margin-left:6px}',
    '.fx-btn{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 1px;border:0;border-bottom:1px solid transparent;border-radius:0;background:none;color:var(--fx-ink);font-size:13px;font-weight:600;cursor:pointer;transition:color .16s,border-color .16s,transform .16s}',
    '.fx-btn:hover{color:var(--fx-acc);border-bottom-color:currentColor}',
    '.fx-btn:active{transform:translateY(1px)}',
    '.fx-btn svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.8}',
    '.fx-btn.primary{height:34px;padding:0 18px;border:0;border-radius:999px;background:linear-gradient(135deg,var(--fx-acc),var(--fx-acc2));color:var(--fx-on-acc);box-shadow:0 8px 20px -12px color-mix(in srgb,var(--fx-acc) 90%,transparent)}',
    '.fx-btn.primary:hover{color:var(--fx-on-acc);transform:translateY(-1px)}',
    '.fx-btn.ghost{color:var(--fx-sub)}',
    '.fx-btn.ghost.on{color:var(--fx-acc);border-bottom-color:var(--fx-acc)}',
    '.fx-btn.danger{color:#b91c1c}',
    '.fx-btn.sm{height:24px;font-size:12px}',
    '.fx-icobtn{width:30px;height:30px;display:grid;place-items:center;border:0;border-radius:0;background:none;color:var(--fx-sub);cursor:pointer;transition:color .16s,transform .16s}',
    '.fx-icobtn:hover{color:var(--fx-acc);transform:translateY(-1px)}',
    '.fx-icobtn svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.7}',
    '.fx-icobtn.sm{width:24px;height:24px}',
    '.fx-icobtn.sm svg{width:13px;height:13px}',
    '.fx-icobtn.danger{color:#b91c1c}',
    '.fx-stage{position:relative;z-index:1;width:100%;max-width:var(--fx-w);margin:0 auto;display:flex;flex-direction:column;padding:4px 6px 140px}',
    '.fx-card{border:0;border-top:1px solid var(--fx-line);border-radius:0;background:transparent;box-shadow:none;padding:18px 0 6px;animation:fxRise .45s cubic-bezier(.22,1,.36,1) both}',
    '.fx-card:first-child{border-top:0;padding-top:8px}',
    '.fx-card:nth-child(2){animation-delay:45ms}',
    '.fx-card:nth-child(3){animation-delay:85ms}',
    '.fx-card:nth-child(4){animation-delay:120ms}',
    '@keyframes fxRise{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:none}}',
    '.fx-card-h{display:flex;align-items:baseline;gap:10px;padding-bottom:9px;margin-bottom:14px;border-bottom:1px solid var(--fx-line)}',
    '.fx-card-h b{font-family:Georgia,"Songti SC",serif;font-size:17px;font-weight:700;letter-spacing:.03em}',
    '.fx-card-h em{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:10px;letter-spacing:.12em;color:var(--fx-sub);text-transform:uppercase}',
    '.fx-card-h .fx-btn,.fx-card-h .fx-icobtn{margin-left:auto}',
    '.fx-card-h .fx-btn+.fx-icobtn{margin-left:4px}',
    '.fx-quiet{font-size:12.5px;line-height:1.9;color:var(--fx-sub)}',
    '.fx-more{font-size:12px;color:var(--fx-sub);margin-top:9px;padding-top:9px;border-top:1px dashed var(--fx-line)}',
    '.fx-acts{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:16px}',
    '.fx-hint{font-size:11.5px;color:var(--fx-sub);letter-spacing:.02em}',
    '.fx-qlist{display:flex;flex-direction:column}',
    '.fx-qrow{display:flex;align-items:center;gap:12px;padding:12px 2px;border:0;border-bottom:1px solid var(--fx-line);border-radius:0;background:transparent;transition:background .18s,padding-left .18s}',
    '.fx-qrow:last-child{border-bottom:0}',
    '.fx-qrow:hover{background:linear-gradient(90deg,color-mix(in srgb,var(--fx-acc) 8%,transparent),transparent 58%);padding-left:9px}',
    '.fx-qrow.hot{background:linear-gradient(90deg,rgba(185,28,28,.06),transparent 58%)}',
    '.fx-qdot{width:7px;height:7px;border-radius:50%;flex:0 0 7px}',
    '.fx-qmain{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}',
    '.fx-qmain b{font-size:13.5px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.fx-qmain span{font-size:11.5px;color:var(--fx-sub)}',
    '.fx-od{font-family:ui-monospace,Consolas,monospace;font-size:10.5px;letter-spacing:.06em;color:var(--fx-sub);white-space:nowrap}',
    '.fx-od.ok{color:var(--fx-acc)}',
    '.fx-od.hot{color:#b91c1c}',
    '.fx-input{height:32px;border:0;border-bottom:1px solid var(--fx-line2);border-radius:0;padding:3px 2px;background:transparent;color:var(--fx-ink);font-size:13.5px;font-family:inherit;outline:none;transition:border-color .16s,box-shadow .16s}',
    '.fx-input:focus{border-bottom-color:var(--fx-acc);box-shadow:0 1px 0 0 var(--fx-acc)}',
    '.fx-qa-row{display:flex;gap:16px;flex-wrap:wrap;align-items:flex-end}',
    '.fx-qa-row .fx-input{flex:1;min-width:220px}',
    '.fx-sel{flex:0 0 auto;width:auto;cursor:pointer}',
    '.fx-clock{margin-left:auto;font-family:ui-monospace,Consolas,monospace;font-size:12.5px;color:var(--fx-acc);font-variant-numeric:tabular-nums}',
    '.fx-q{padding:16px 0 14px 16px;border-left:2px solid var(--fx-acc);margin-bottom:16px}',
    '.fx-q b{display:block;font-family:Georgia,"Songti SC",serif;font-size:17.5px;line-height:1.65;font-weight:700;letter-spacing:.01em}',
    '.fx-qwhy{display:block;margin-top:7px;font-size:11.5px;color:var(--fx-sub);letter-spacing:.03em}',
    '.fx-qlocal{display:inline-block;margin-top:9px;font-family:ui-monospace,Consolas,monospace;font-size:10px;letter-spacing:.08em;color:#b45309;border-bottom:1px solid rgba(180,83,9,.4);padding-bottom:1px}',
    '@keyframes fxSpin{to{transform:rotate(360deg)}}',
    '@keyframes fxShimmer{0%,100%{opacity:.35}50%{opacity:1}}',
    '.fx-dims{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:0 22px;margin-bottom:14px}',
    '.fx-dim{padding:10px 0;border-bottom:1px solid var(--fx-line)}',
    '.fx-dim span{display:block;margin-top:6px;font-size:10.5px;color:var(--fx-sub)}',
    '.fx-comment{padding:12px 0 12px 16px;border-left:2px solid var(--fx-line2);font-size:13px;line-height:1.85}',
    '.fx-missing{margin-top:12px}',
    '.fx-missing b{display:block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--fx-sub);margin-bottom:7px}',
    '.fx-chip{display:inline-block;margin:0 8px 6px 0;padding:0 0 2px;border-bottom:1px solid rgba(185,28,28,.45);font-size:12px;color:#b91c1c}',
    '.fx-empty{padding:34px 12px;text-align:center;border-top:1px solid var(--fx-line);border-bottom:1px solid var(--fx-line);display:flex;flex-direction:column;align-items:center;gap:9px}',
    '.fx-empty-ic{color:var(--fx-sub);opacity:.75}',
    '.fx-empty-ic svg{width:26px;height:26px;fill:none;stroke:currentColor;stroke-width:1.4}',
    '.fx-empty b{font-family:Georgia,"Songti SC",serif;font-size:15px}',
    '.fx-empty span{font-size:12px;color:var(--fx-sub);max-width:440px;line-height:1.85}',
    '@keyframes fxConfetti{from{transform:translate(0,0) rotate(0);opacity:1}to{transform:translate(var(--x),var(--y)) rotate(var(--r));opacity:0}}',
    '.fx-dockwrap{display:contents}',
    '.fx-dock{position:sticky;z-index:40;bottom:calc(70px + env(safe-area-inset-bottom,0px));display:flex;justify-content:center;gap:2px;width:max-content;margin:18px auto 0;padding:6px;border-radius:18px;background:color-mix(in srgb,var(--fx-bg) 84%,transparent);border:1px solid var(--fx-line);box-shadow:0 16px 36px -26px rgba(20,32,28,.7);backdrop-filter:blur(20px) saturate(1.15);-webkit-backdrop-filter:blur(20px) saturate(1.15)}',
    'html[data-layout="workbench"] .fx-dock{bottom:20px}',
    '@media (max-width:900px){html[data-layout="workbench"] .fx-dock{bottom:calc(70px + env(safe-area-inset-bottom,0px))}}',
    '.fx-dock-ind{position:absolute;top:6px;bottom:6px;left:6px;width:62px;border-radius:14px;background:linear-gradient(135deg,var(--fx-acc),var(--fx-acc2));box-shadow:0 6px 16px -8px rgba(15,118,110,.8);transition:left .38s cubic-bezier(.3,.85,.3,1),width .38s cubic-bezier(.3,.85,.3,1)}',
    '.fx-dock-item{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:3px;min-width:62px;padding:8px 13px;border:0;border-radius:14px;background:none;color:var(--fx-sub);font-size:10.5px;font-weight:600;letter-spacing:.04em;cursor:pointer;transition:color .25s}',
    '.fx-dock-item svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;transition:transform .25s}',
    '.fx-dock-item em{font-style:normal}',
    '.fx-btn svg.ci,.fx-icobtn svg.ci,.fx-dock-item svg.ci{margin-right:0}',
    '.fx-dock-item:hover{color:var(--fx-ink)}',
    '.fx-dock-item:hover svg{transform:translateY(-2px) scale(1.06)}',
    '.fx-dock-item.on{color:var(--fx-on-acc)}',
    '.fx-dot{position:absolute;top:5px;right:11px;width:6px;height:6px;border-radius:50%;background:#e11d48;box-shadow:0 0 6px #e11d48;display:none}',
    '.fx-dot.show{display:block;animation:fxDot 1.6s infinite}',
    '@keyframes fxDot{50%{opacity:.35}}',
    '@media (max-width:760px){.fx-top{gap:10px;padding:11px 14px}.fx-brandtx b{font-size:17px}.fx-kicker{display:none}.fx-kpi{padding:0 9px;min-width:44px}.fx-kpi b{font-size:16px}.fx-kpi i{font-size:8.5px;letter-spacing:.08em}.fx-topacts .fx-go span{display:none}.fx-topacts .fx-go{padding:0 11px}.fx-stage{padding:4px 14px 152px}.fx-card-h{flex-wrap:wrap}.fx-dock{width:calc(100vw - 24px);justify-content:space-between}.fx-dock-item{min-width:0;flex:1;padding:7px 2px}.fx-dock-item em{font-size:9.5px}}',
    '@media (prefers-reduced-motion:reduce){.fx-root *,.fx-root *::before,.fx-root *::after{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}}',
    'html[data-theme="night"] .fx-dock{box-shadow:0 16px 40px -26px rgba(0,0,0,.95)}',
    'html[data-theme="night"] .fx-aura{background-image:repeating-linear-gradient(90deg,rgba(255,255,255,.045) 0 1px,transparent 1px 96px)}',
    '.fx-panel{font:13px/1.6 "PingFang SC","Microsoft YaHei",system-ui,sans-serif;color:var(--text-primary,#1b2430);padding:2px}',
    '.fx-panel-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}',
    '.fx-panel-kpis div{border-bottom:1px solid var(--line,#e5e7eb);padding:2px 0 6px}',
    '.fx-panel-kpis b{display:block;font-family:Georgia,serif;font-size:20px;line-height:1.2}',
    '.fx-panel-kpis span{font-size:9.5px;letter-spacing:.1em;color:var(--text-muted,#6b7788)}',
    '.fx-panel-list{display:flex;flex-direction:column}',
    '.fx-panel-row{display:flex;align-items:center;gap:8px;font-size:12px;padding:7px 0;border-bottom:1px solid var(--line,#e5e7eb)}',
    '.fx-panel-row i{width:6px;height:6px;border-radius:50%;flex:0 0 6px}',
    '.fx-panel-row span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.fx-panel-row em{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:9.5px;color:var(--text-muted,#6b7788)}',
    '.fx-panel-empty{font-size:12px;color:var(--text-muted,#6b7788);padding:14px 0;line-height:1.8;border-bottom:1px solid var(--line,#e5e7eb)}',
    '.fx-panel-empty.ok{color:#0f766e}',
    '.fx-panel-foot{margin-top:10px;font-size:10px;letter-spacing:.06em;color:var(--text-muted,#6b7788)}'
  ].join('')

  /* ---------- 页面专属层：挂载时注入 <style>，destroy 时移除 ---------- */
  let CSS_EXTRA = [
    '.fx-done{display:flex;align-items:center;gap:26px;padding:10px 0 4px;flex-wrap:wrap}',
    '.fx-done-ring{animation:fxGrow .6s cubic-bezier(.22,1,.36,1) both}',
    '@keyframes fxGrow{from{transform:scale(.9);opacity:0}to{transform:none;opacity:1}}',
    '.fx-done-tx{flex:1;min-width:260px}',
    '.fx-done-tx>b{display:block;font-family:Georgia,"Songti SC",serif;font-size:16.5px;line-height:1.7;font-weight:700;margin-bottom:12px}',
    '.fx-done-meta{display:flex;gap:22px;flex-wrap:wrap;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--fx-line)}',
    '.fx-pill{font-size:11.5px;color:var(--fx-sub);letter-spacing:.03em}',
    '.fx-pill b{font-family:Georgia,serif;font-size:14px;color:var(--c,var(--fx-acc));margin:0 2px}',
    '.fx-tip{padding:11px 0 11px 16px;border-left:2px solid var(--fx-acc2)}',
    '.fx-tip b{display:block;font-size:12.5px;margin-bottom:3px;letter-spacing:.03em}',
    '.fx-tip span{font-size:11.5px;color:var(--fx-sub);line-height:1.75}',
    '.fx-detail-body{display:flex;align-items:center;gap:30px;flex-wrap:wrap}',
    '.fx-detail-ring{display:flex;flex-direction:column;align-items:center;gap:5px}',
    '.fx-detail-ring i{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:10px;letter-spacing:.14em;color:var(--fx-sub);text-transform:uppercase}',
    '.fx-detail-meta{display:flex;flex-direction:column;gap:0;min-width:190px}',
    '.fx-metarow{display:flex;justify-content:space-between;gap:18px;font-size:12px;color:var(--fx-sub);padding:7px 0;border-bottom:1px solid var(--fx-line)}',
    '.fx-metarow b{color:var(--fx-ink);font-weight:700;font-variant-numeric:tabular-nums}',
    '.fx-detail-spark{flex:1;min-width:180px}',
    '.fx-spark{width:100%;height:52px;display:block;border-bottom:1px solid var(--fx-line)}',
    '.fx-note{margin-top:16px;border-top:1px solid var(--fx-line);padding-top:10px}',
    '.fx-note summary{cursor:pointer;font-family:ui-monospace,Consolas,monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--fx-sub);list-style:none}',
    '.fx-note summary::-webkit-details-marker{display:none}',
    '.fx-note summary:before{content:"＋ ";color:var(--fx-acc)}',
    '.fx-note[open] summary:before{content:"− "}',
    '.fx-note div{margin-top:9px;font-size:12.5px;line-height:1.9;color:var(--fx-sub);padding-left:14px;border-left:1px solid var(--fx-line)}',
    '.fx-steps{margin:0;padding:0;list-style:none;counter-reset:fxs;display:flex;flex-direction:column;gap:12px}',
    '.fx-steps li{counter-increment:fxs;font-size:12.5px;line-height:1.75;padding-left:34px;position:relative}',
    '.fx-steps li:before{content:counter(fxs,decimal-leading-zero);position:absolute;left:0;top:1px;font-family:Georgia,serif;font-size:13px;color:var(--fx-acc);letter-spacing:.02em}',
    '.fx-steps li b{display:block;font-size:13px;margin-bottom:2px}',
    '.fx-steps li span{color:var(--fx-sub)}',
    '.fx-subjbar{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:14px;border-bottom:1px solid var(--fx-line);padding-bottom:10px}',
    '.fx-schip{height:22px;padding:0;border:0;border-bottom:1px solid transparent;border-radius:0;background:none;font-size:12px;color:var(--fx-sub);cursor:pointer;transition:color .16s,border-color .16s}',
    '.fx-schip:hover{color:var(--fx-ink)}',
    '.fx-btn.sm,.fx-schip{position:relative}',
    '.fx-btn.sm::after,.fx-schip::after{content:"";position:absolute;left:-2px;right:-2px;top:-7px;bottom:-7px}',
    '.fx-schip.on{color:var(--c,var(--fx-acc));border-bottom-color:currentColor;font-weight:700}',
    '.fx-crystal-wrap{border-top:1px solid var(--fx-line);border-bottom:1px solid var(--fx-line);background:linear-gradient(180deg,color-mix(in srgb,var(--fx-acc) 4%,transparent),transparent 70%);padding:6px 0}',
    '.fx-crystal{width:100%;height:auto;display:block}',
    '.fx-clabel{font-family:ui-monospace,Consolas,monospace;font-size:10px;fill:var(--fx-sub);letter-spacing:.1em}',
    '.fx-nlabel{font-size:11px;fill:var(--fx-sub)}',
    '.fx-node{cursor:pointer;transform-box:fill-box;transform-origin:center;animation:fxPulse 3.6s ease-in-out infinite}',
    '.fx-node:hover circle{stroke:var(--c);stroke-width:1.5}',
    '.fx-node:focus{outline:none}',
    '.fx-node:focus-visible circle{stroke:var(--fx-acc2);stroke-width:2}',
    '@keyframes fxPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}',
    '.fx-legend{display:flex;align-items:center;gap:18px;flex-wrap:wrap;margin-top:12px;font-size:10.5px;color:var(--fx-sub);letter-spacing:.04em}',
    '.fx-legend i{width:7px;height:7px;border-radius:50%;display:inline-block;margin-right:5px;vertical-align:0}',
    '.fx-legend-tip{margin-left:auto;opacity:.7}',
    '.fx-recent{display:flex;flex-direction:column}',
    '.fx-recent-row{display:flex;align-items:center;gap:14px;padding:10px 2px;border-bottom:1px solid var(--fx-line)}',
    '.fx-recent-row:last-child{border-bottom:0}',
    '.fx-recent-score{font-family:Georgia,serif;font-size:20px;font-weight:700;min-width:34px;text-align:right;font-variant-numeric:tabular-nums}',
    '.fx-recent-row>div{flex:1;min-width:0;display:flex;flex-direction:column}',
    '.fx-recent-row b{font-size:12.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.fx-recent-row span{font-size:11px;color:var(--fx-sub)}',
    '.fx-recent-bar{width:80px;height:2px;background:var(--fx-line2);overflow:hidden;flex:0 0 80px}',
    '.fx-recent-bar b{display:block;height:100%}',
    '.fx-load{display:grid;grid-template-columns:repeat(7,1fr);gap:14px;align-items:end;height:110px;margin:6px 0 10px}',
    '.fx-load-col{display:flex;flex-direction:column;align-items:center;gap:6px;height:100%}',
    '.fx-load-col i{flex:1;width:100%;max-width:44px;display:flex;align-items:flex-end;background:color-mix(in srgb,var(--fx-ink) 5%,transparent);overflow:hidden}',
    '.fx-load-col i b{width:100%;background:color-mix(in srgb,var(--fx-acc) 55%,transparent);transition:height .6s cubic-bezier(.22,1,.36,1)}',
    '.fx-load-col.today i b{background:var(--fx-acc)}',
    '.fx-load-col em{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:10px;color:var(--fx-sub)}',
    '.fx-load-col span{font-family:Georgia,serif;font-size:12.5px;font-weight:700}',
    '.fx-overview{display:flex;align-items:center;gap:34px;flex-wrap:wrap}',
    '.fx-ov-ring{display:flex;flex-direction:column;align-items:center;gap:6px}',
    '.fx-ov-ring i{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--fx-sub)}',
    '.fx-ov-grid{flex:1;display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:0 26px}',
    '.fx-ov-cell{padding:9px 0;border-bottom:1px solid var(--fx-line)}',
    '.fx-ov-cell b{display:block;font-family:Georgia,serif;font-size:26px;line-height:1.2;font-variant-numeric:tabular-nums}',
    '.fx-ov-cell span{font-size:10.5px;color:var(--fx-sub);letter-spacing:.06em}',
    '.fx-bars-wrap{margin:8px 0 6px}',
    '.fx-bars{width:100%;height:74px;display:block}',
    '.fx-axis{display:flex;justify-content:space-between;font-family:ui-monospace,Consolas,monospace;font-size:10px;color:var(--fx-sub);letter-spacing:.06em}',
    '.fx-subjrow{display:flex;align-items:center;gap:14px;padding:9px 0;border-bottom:1px solid var(--fx-line)}',
    '.fx-subjrow:last-child{border-bottom:0}',
    '.fx-subjname{font-size:12px;font-weight:700;min-width:56px;color:var(--c);letter-spacing:.04em}',
    '.fx-subdist{flex:1;height:2px;background:var(--fx-line2);overflow:hidden}',
    '.fx-subdist b{display:block;height:100%;transition:width .7s cubic-bezier(.22,1,.36,1)}',
    '.fx-subjrow em{font-style:normal;font-family:Georgia,serif;font-size:15px;font-weight:700;min-width:28px;text-align:right;font-variant-numeric:tabular-nums}',
    '.fx-subjn{font-family:ui-monospace,Consolas,monospace;font-size:10px;color:var(--fx-sub);min-width:38px;text-align:right}',
    '.fx-thin{display:flex;flex-direction:column}',
    '.fx-thin-row{display:flex;align-items:center;gap:14px;padding:10px 2px;border-bottom:1px solid var(--fx-line)}',
    '.fx-thin-row:last-child{border-bottom:0}',
    '.fx-thin-n{font-family:Georgia,serif;font-size:13px;color:var(--fx-acc);width:18px;flex:0 0 18px}',
    '.fx-thin-row>div{flex:1;min-width:0;display:flex;flex-direction:column}',
    '.fx-thin-row b{font-size:12.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.fx-thin-row span{font-size:10.5px;color:var(--fx-sub)}',
    '.fx-thin-bar{width:70px;height:2px;background:var(--fx-line2);overflow:hidden;flex:0 0 70px}',
    '.fx-thin-bar b{display:block;height:100%}',
    '.fx-health{display:flex;gap:26px;flex-wrap:wrap;margin-bottom:6px}',
    '.fx-hcell{display:inline-flex;align-items:center;gap:7px;font-size:11.5px;color:var(--fx-sub);padding-bottom:4px;border-bottom:1px solid var(--fx-line)}',
    '.fx-hcell i{width:6px;height:6px;border-radius:50%;background:var(--fx-sub)}',
    '.fx-hcell.ok{color:var(--fx-acc);border-bottom-color:color-mix(in srgb,var(--fx-acc) 40%,transparent)}',
    '.fx-hcell.ok i{background:var(--fx-acc)}',
    '.fx-hcell.no{color:var(--fx-warn-ink);border-bottom-color:color-mix(in srgb,var(--warn,#b45309) 35%,transparent)}',
    '.fx-hcell.no i{background:var(--warn,#b45309)}',
    '.fx-cfglist{display:flex;flex-direction:column}',
    '.fx-cfgrow{display:grid;grid-template-columns:130px 76px 1fr;gap:14px;align-items:baseline;font-size:12px;padding:10px 0;border-bottom:1px solid var(--fx-line)}',
    '.fx-cfgrow b{font-weight:700}',
    '.fx-cfgrow em{font-style:normal;color:var(--fx-acc);font-family:Georgia,serif;font-size:14px;font-weight:700}',
    '.fx-cfgrow span{color:var(--fx-sub);font-size:11.5px;line-height:1.7}',
    '.fx-about p{margin:0 0 9px;font-size:12.5px;line-height:1.9;color:var(--fx-sub);padding-left:14px;border-left:1px solid var(--fx-line)}',
    '.fx-about p b{color:var(--fx-ink)}',
    '.fx-verdict.manual{padding:14px 0 14px 16px;border-left:2px solid #b45309}',
    '.fx-vh{font-family:Georgia,"Songti SC",serif;font-size:14px;font-weight:700;color:#b45309;margin-bottom:8px;display:flex;align-items:center;gap:7px}',
    '.fx-vh svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.8}',
    '.fx-verdict.manual p{margin:0 0 14px;font-size:12.5px;line-height:1.85;color:var(--fx-sub)}',
    '.fx-manual{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:0 22px}',
    '.fx-mbtn{display:flex;flex-direction:column;gap:4px;padding:12px 0;border:0;border-bottom:1px solid var(--fx-line2);background:none;cursor:pointer;text-align:left;transition:border-color .16s,padding-left .16s}',
    '.fx-mbtn:hover{border-bottom-color:var(--fx-acc);padding-left:6px}',
    '.fx-mbtn b{font-size:13px}',
    '.fx-mbtn span{font-size:11px;color:var(--fx-sub)}',
    '.fx-plist{display:flex;flex-direction:column}',
    '.fx-prow{display:flex;align-items:center;gap:12px;padding:9px 2px;border-bottom:1px solid var(--fx-line)}',
    '.fx-prow:last-child{border-bottom:0}',
    '.fx-prow-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px;border:0;background:none;text-align:left;cursor:pointer;padding:0;font:inherit;color:inherit}',
    '.fx-prow-main b{font-size:13px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.fx-prow-main span{font-size:11px;color:var(--fx-sub)}',
    '.fx-prow-main:hover b{color:var(--fx-acc)}',
    '.fx-hist{display:flex;flex-direction:column}',
    '.fx-hitem{border-bottom:1px solid var(--fx-line)}',
    '.fx-hitem:last-child{border-bottom:0}',
    '.fx-hitem summary{display:flex;align-items:baseline;gap:12px;padding:10px 0;cursor:pointer;list-style:none}',
    '.fx-hitem summary::-webkit-details-marker{display:none}',
    '.fx-hitem summary b{font-family:Georgia,serif;font-size:17px;min-width:34px;font-variant-numeric:tabular-nums}',
    '.fx-hitem summary span{flex:1;min-width:0;font-size:12.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.fx-hitem summary em{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:10px;color:var(--fx-sub);white-space:nowrap}',
    '.fx-hitem[open] summary span{color:var(--fx-acc)}',
    '.fx-hbody{padding:0 0 12px 46px}',
    '.fx-hqa{padding:8px 0;border-top:1px dashed var(--fx-line)}',
    '.fx-hqa b{display:block;font-size:12px;line-height:1.65}',
    '.fx-hqa p{margin:4px 0;font-size:12px;line-height:1.85}',
    '.fx-hqa span{font-family:ui-monospace,Consolas,monospace;font-size:10px;color:var(--fx-sub);letter-spacing:.04em}',
    '.fx-qrow .fx-btn.primary.sm,.fx-thin-row .fx-btn.primary.sm,.fx-recent-row .fx-btn{background:none;color:var(--fx-acc);border:0;border-bottom:1px solid color-mix(in srgb,var(--fx-acc) 45%,transparent);border-radius:0;box-shadow:none;height:auto;padding:0 0 1px;font-size:12px}',
    '.fx-qrow .fx-btn.primary.sm:hover,.fx-thin-row .fx-btn.primary.sm:hover{color:var(--fx-acc2);border-bottom-color:currentColor;transform:none}',
    '.fx-ta{width:100%;border:0;border-left:2px solid color-mix(in srgb,var(--fx-acc) 55%,transparent);border-radius:0;padding:12px 14px;background:color-mix(in srgb,var(--fx-ink) 2.5%,transparent);color:var(--fx-ink);font:13.5px/1.85 inherit;outline:none;resize:vertical;min-height:150px;transition:background .16s,border-color .16s}',
    '.fx-ta:focus{background:color-mix(in srgb,var(--fx-acc) 4%,transparent);border-left-color:var(--fx-acc)}',
    '.fx-form{display:flex;flex-direction:column;gap:14px}',
    '.fx-form label{display:flex;flex-direction:column;gap:5px;font-size:11.5px;color:var(--fx-sub);letter-spacing:.04em;font-weight:600}',
    '.fx-form label b{color:#b91c1c}',
    '.fx-form textarea.fx-input{height:auto;padding:6px 2px;line-height:1.75;resize:vertical}',
    '.fx-prog{display:flex;align-items:center;gap:7px;margin-bottom:14px}',
    '.fx-prog i{width:26px;height:2px;background:var(--fx-line2);transition:background .3s}',
    '.fx-prog i.done{background:color-mix(in srgb,var(--fx-acc) 60%,transparent)}',
    '.fx-prog i.on{background:var(--fx-acc);height:3px}',
    '.fx-prog span{font-family:ui-monospace,Consolas,monospace;font-size:10.5px;letter-spacing:.1em;color:var(--fx-sub)}',
    '.fx-asking{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--fx-sub);padding:16px 0}',
    '.fx-asking i{font-style:normal;font-size:11.5px;opacity:.85}',
    '.fx-spin{width:14px;height:14px;border-radius:50%;border:2px solid color-mix(in srgb,var(--fx-acc) 25%,transparent);border-top-color:var(--fx-acc);animation:fxSpin .8s linear infinite}',
    '.fx-skl{display:flex;flex-direction:column;gap:9px;padding:2px 0 14px}',
    '.fx-skl i{height:9px;background:var(--fx-line);animation:fxShimmer 1.4s ease-in-out infinite}',
    '.fx-skl i:nth-child(2){width:80%;animation-delay:.12s}',
    '.fx-skl i:nth-child(3){width:62%;animation-delay:.24s}',
    '.fx-vhead{display:flex;align-items:center;gap:16px;margin-bottom:16px}',
    '.fx-vhead-tx{display:flex;flex-direction:column;gap:3px}',
    '.fx-vhead-tx b{font-family:Georgia,"Songti SC",serif;font-size:16px;font-weight:700}',
    '.fx-vhead-tx span{font-size:11.5px;color:var(--fx-sub)}',
    '.fx-ring{display:block}',
    '.fx-ring-t{font:700 17px/1 Georgia,serif;fill:var(--fx-ink)}',
    '.fx-dim-h{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:7px}',
    '.fx-dim-h b{font-size:12.5px;letter-spacing:.06em}',
    '.fx-dim-h em{font-style:normal;font-family:Georgia,serif;font-size:18px;font-weight:700;color:var(--c)}',
    '.fx-dim-bar{height:2px;background:var(--fx-line2);overflow:hidden}',
    '.fx-dim-bar i{display:block;height:100%;background:var(--c);transition:width .7s cubic-bezier(.22,1,.36,1)}',
    '.fx-followup{margin-top:14px;padding:11px 0 11px 16px;border-left:2px solid var(--fx-acc2);font-size:12.5px;line-height:1.8}',
    '.fx-followup b{display:block;font-family:ui-monospace,Consolas,monospace;font-size:10px;letter-spacing:.14em;color:var(--fx-acc2);margin-bottom:4px}',
    '.fx-confetti{position:fixed;left:50%;top:46%;width:0;height:0;z-index:60;pointer-events:none}',
    '.fx-confetti i{position:absolute;width:6px;height:6px;border-radius:1px;background:var(--c);animation:fxConfetti 1.25s cubic-bezier(.2,.8,.3,1) var(--d) both}',
    'html[data-theme="night"] .fx-dim-bar,html[data-theme="night"] .fx-subdist,html[data-theme="night"] .fx-thin-bar,html[data-theme="night"] .fx-recent-bar{background:rgba(255,255,255,.14)}'
  ].join('')

  /* ============================================================
   * 12. 注册
   * ------------------------------------------------------------
   * 只注册**一个**工具页（而不是像试卷提取那样拆三个）：
   * 这里的五个视图是"同一件事的不同视角"，共用一份进行中的会话与选中知识点；
   * 拆成多个工具页会让"复述到一半去看晶体"变成跨页跳转，会话得序列化到 ctx.keep —— 得不偿失。
   * 路由仍是 /tool/feynman-crystal（工具页 id 即路由）。
   * ============================================================ */
  let api = {
    id: TOOL_ID,
    name: '费曼晶体',
    version: VERSION,
    author: 'kaoyan-v2',
    desc: '把「看懂」变成「讲得出来」：三层递进提问 + 准确/自洽/通俗三维判定 + 掌握度晶体图 + 遗忘曲线复习。无 AI 时降级为本地提问链 + 自评。',
    tools: [
      /* 【v1.1】模块图标换品牌砖（青→蓝渐变 + 白晶体），与页眉同款字形 */
      { id: TOOL_ID, title: '费曼晶体', icon: MARK_TILE, mount: mountShell }
    ],
    /* 侧边小面板：不占页面，随时看"今天还有几个要讲"。
     * 面板只读（不做交互）—— 交互全部留在工具页，避免两套状态源。 */
    panels: [
      {
        id: 'fx-today',
        title: '费曼晶体 · 今日',
        icon: MARK_TILE,
        width: 300,
        height: 260,
        render: function (ctx) {
          let points = loadPoints(ctx)
          let sessions = loadSessions(ctx)
          let today = todayKey()
          let due = dueList(points, today)
          let st = streakOf(sessions)
          let out = ['<div class="fx-panel">']
          out.push('<div class="fx-panel-kpis">'
            + '<div><b>' + due.length + '</b><span>待复述</span></div>'
            + '<div><b>' + points.length + '</b><span>晶体节点</span></div>'
            + '<div><b>' + st + '</b><span>连击</span></div>'
            + '</div>')
          if (!points.length) {
            out.push('<div class="fx-panel-empty">还没有知识点。打开「费曼晶体」写第一个。</div>')
          } else if (!due.length) {
            out.push('<div class="fx-panel-empty ok">今天清空了 —— 想加练就手动挑一个。</div>')
          } else {
            out.push('<div class="fx-panel-list">')
            for (let i = 0; i < Math.min(4, due.length); i++) {
              let p = due[i]
              let col = masteryColor(p.mastery)
              out.push('<div class="fx-panel-row"><i style="background:' + col.c + '"></i>'
                + '<span>' + esc(shortTitle(p.title, 16)) + '</span>'
                + '<em>' + (overdueDays(p, today) ? '逾期' + overdueDays(p, today) + '天' : '今天') + '</em></div>')
            }
            out.push('</div>')
          }
          out.push('<div class="fx-panel-foot">打开工具页「费曼晶体」开始</div>')
          out.push('</div>')
          return out.join('')
        }
      }
    ],
    config: [
      { key: 'levels', label: '每次问题层数', type: 'number', default: 3 },
      { key: 'strict', label: '判定严格度', type: 'select', default: '标准', options: ['宽松', '标准', '严格'] },
      { key: 'autoNext', label: '自评后自动继续', type: 'bool', default: true },
      { key: 'dailyGoal', label: '每日复述目标（个）', type: 'number', default: 3 }
    ],
    /* 教练可查：复述数据本来就在本地（points/sessions），但教练问"我哪些点讲不清"时
     * 没法自己看 —— 这两条让教练直接拿到结论，不用用户复述。
     * （2026-10-24 补：另两个插件早就有 queries，这个一直缺，能力面对不齐） */
    queries: [
      {
        key: 'stale', label: '最久没复述的知识点',
        run: function (ctx) {
          let pts = loadPoints(ctx).filter(function (p) { return p && p.title })
          if (!pts.length) return '还没有知识点。'
          let today = todayKey()
          let list = pts.slice().sort(function (a, b) {
            let ta = a.nextAt || '', tb = b.nextAt || ''
            if (ta !== tb) return ta < tb ? -1 : 1
            return (a.mastery || 0) - (b.mastery || 0)
          }).slice(0, 5)
          let parts = list.map(function (p) {
            let od = p.nextAt ? overdueDays(p, today) : 0
            return p.title + (od ? '（逾期 ' + od + ' 天）' : (p.nextAt ? '（' + fmtDate(p.nextAt) + ' 到期）' : '（从没复述）'))
          })
          return '最该先讲的 ' + list.length + ' 个知识点：' + parts.join('；') + '。'
        }
      },
      {
        key: 'weak', label: '复述最吃力的知识点',
        run: function (ctx) {
          let pts = loadPoints(ctx)
          let tested = pts.filter(function (p) { return (p.reps || 0) > 0 })
          if (!tested.length) return '还没有复述记录。'
          let list = tested.slice().sort(function (a, b) { return (a.mastery || 0) - (b.mastery || 0) }).slice(0, 5)
          let ss = loadSessions(ctx)
          let avg = ss.length ? Math.round(ss.reduce(function (a, b) { return a + (b.score || 0) }, 0) / ss.length) : 0
          return '共复述 ' + ss.length + ' 次（均分 ' + avg + '）。掌握度最低：'
            + list.map(function (p) { return p.title + ' ' + (p.mastery || 0) + '（' + masteryLabel(p.mastery) + '，讲过 ' + p.reps + ' 次）' }).join('；') + '。'
        }
      }
    ],
    /* 全局快捷键：Alt+F 直达费曼晶体（不在输入框里也能用；有修饰键不会被打字吃掉） */
    shortcuts: [
      {
        key: 'alt+f',
        run: function (ctx) {
          try {
            if (ctx && ctx.api && ctx.api.goTool) ctx.api.goTool(TOOL_ID)
            else if (window.App) window.App.go(TOOL_ID)
          } catch (e) { /* 忽略 */ }
        }
      }
    ],
    /* init 只做一次"轻量自检"，不写数据、不拉网络：
     * 首次安装时给一条可读的日志，排查"插件到底装上没有"时不用翻控制台。 */
    init: function (ctx) {
      HOST_CTX = ctx
      /* 【2026-10-22 站内适配 · 补注册环节】把两条业务场景登记进 AI 注册表：
       * 少了这一步，参数中心里根本没有它们 → 用户在「AI 参数」里配的思考档 / Token / 温度
       * 永远不会作用到本插件（全部退化成默认值），用量也全记进 `__none` 桶。
       * 出题要即时出字 → noThink；判定要严谨（三维打分 + 置信度）→ think。
       * 两者都不需要内置工具（纯文本进、JSON 出），也不做长期记忆召回。 */
      try {
        if (ctx.ai && typeof ctx.ai.registerCtx === 'function') {
          ctx.ai.registerCtx({
            ctx: AI_CTX_QUIZ,
            name: '费曼晶体 · 递进出题',
            desc: '按掌握度递进生成讲解题（一问一答、难度跟着 crystals 走，不编造教材外结论）',
            def: 'noThink', latexNeed: false, tools: 'none', recall: false
          })
          ctx.ai.registerCtx({
            ctx: AI_CTX_JUDGE,
            name: '费曼晶体 · 三维判定',
            desc: '按准确性/连贯性/通俗性三维打分的讲解评审（必须给置信度，拿不准就交回自评）',
            def: 'think', latexNeed: false, tools: 'none', recall: false
          })
        }
      } catch (e) { /* 注册失败不影响本地模板模式 */ }
      try {
        ctx.log('费曼晶体 v' + VERSION + ' 就绪（AI ' + (aiOk(ctx) ? '可用' : '未配置，走本地模板 + 自评') + '）')
      } catch (e) { /* 忽略 */ }
    },
    css: CSS
  }

  /* 调试钩子（仅站点显式打开时暴露）：把纯判据挂出来，单测直接打，
   * 不必为了测"掌握度怎么算"去驱动整个 DOM。 */
  if (window.__FEYNMAN_DEBUG__) {
    window.__feynmanInternals = {
      masteryAfter: masteryAfter,
      nextInterval: nextInterval,
      sessionScore: sessionScore,
      qScore: qScore,
      dueList: dueList,
      loadAhead: loadAhead,
      streakOf: streakOf,
      crystalLayout: crystalLayout,
      localChain: localChain,
      judgeUser: judgeUser,
      manualToVerdict: manualToVerdict,
      normPoint: normPoint,
      normSession: normSession,
      verdictLine: verdictLine,
      weakestDim: weakestDim,
      masteryLabel: masteryLabel,
      masteryColor: masteryColor,
      nextIntervalTable: EBB,
      MAX_POINTS: MAX_POINTS,
      TOOL_ID: TOOL_ID,
      CSS_LEN: CSS.length
    }
  }

  PluginBus.register(api)
})()
