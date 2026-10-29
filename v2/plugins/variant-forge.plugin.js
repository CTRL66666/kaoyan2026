/* ============================================================
 * variant-forge.plugin.js — 变式题工厂（单文件插件）· v1.0
 * ------------------------------------------------------------
 * 一句话：错一道题 → 得一组同考点新题 —— 从错题本/题库/试卷挑母题，AI 按七种
 *        变式策略批量出「同源不同脸」的新题，星形谱系图看变式关系，留用的变式
 *        一键成卷（走站内唯一落库口 PaperKit），交卷后成绩自动回流工厂账本。
 *
 * 为什么做这件事（而不是又一个刷题场）：
 *   站内已有「举一反三」的单题变式（quizEngine.buildVariantAsk：做完一道题顺手
 *   出一道），但它一次只出一题、出完就散、不成体系。真正被一道错题卡住的人需要的
 *   是一条生产线：同一母题按「换数/换壳/升阶/降阶/逆问/靶向/扰支」多路同时出，
 *   横向对比着练，最后打包成一张能做的卷重做。错因（trap）在这里是一等公民 ——
 *   每张变式卡都标明「这道题打的是哪个坑」，让「会做一道题」升级成「会做一类题」。
 *
 * ── 能力面（一个文件，不改站内架构）────────────────────────────
 *   · 吸顶页眉：两态收窄（滚动压扁 + 玻璃底），KPI 常驻（待熔母题/今日留用/变式卷）
 *   · 底部 dock：5 个视图就地切换（选题台/熔炉/谱系/打包/档案），滑动胶囊指示器
 *   · 选题台：错题本/题库/我的卷三源浏览 + 手填母题，搜索 + 科目过滤 + 多选送炉
 *   · 熔炉：七策略多选 → 逐母题排队开炉（进度条 + 可中断 + 可撤销整炉）；
 *          变式卡「留用/弃用/就地编辑」；疑似换皮检测（只改数字没换壳的如实标出）
 *   · 谱系图：纯 SVG 星形布局（确定性不抖），中心母题、卫星变式；颜色=策略、
 *          大小=难度、金环=留用、灰虚线=弃用，点卫星就地处置
 *   · 打包：跨谱系勾选留用 → 卷面预览（PaperKit.parseJson 同判据预检）→
 *          按科目拆卷 → PaperKit.addDrafts 唯一口入库 → PaperKit.open 直达做题；
 *          可打印 MD 文稿（卷面 + 答案册）
 *   · 档案：14 日活动柱 / 策略留用率（<40% 如实亮质量预警）/ 库存盘点 / 坑位榜 /
 *          交卷回流 / JSON 导入导出 / Markdown 报告
 *   · AI 场景：plugin.variant-forge.gen（开炉，think+latex）/ .audit（质检，noThink）；
 *          未配置 AI 降级为「空白骨架变式」，功能不残缺
 *   · 常驻面板 + 教练技能（「变式」「错因复盘」）+ services（外部插件可投母题）
 *   · hooks.examGraded 成绩回流；shortcuts Alt+V；config 五项；四主题样式全适配
 *
 * ── 宿主契约（只依赖公开能力，不碰内部结构）──────────────────
 *   mount: function (el, ctx) —— ctx 见 core/pluginbus buildCtx：
 *     ctx.data('db')            整份档案（进 Store → 云同步；写要整体替换）
 *     ctx.keep.get/set          本机记忆（策略组合、引导已读）
 *     ctx.config(k)             读配置（自动回退 manifest 默认值）
 *     ctx.ai.has()/json(sys,usr,{ctx})  结构化输出；未配置时 reject —— 必须兜住
 *     ctx.Tex.renderInline      题干/选项/解析的公式渲染口（失败退回 esc 原文）
 *     ctx.Store/Toast/U/api.download/api.readFile/api.confirm/api.goTool/api.params
 *   window.PaperKit：brief/sizeOf/addDrafts/open/remove/parseJson（不自建落库口）
 *   hooks.examGraded：宿主交卷处 emit（sprint.ts），按 paperId 认领，同一卷不双计
 *   返回 destroy：解绑监听、清定时器、摘走按需注入的页面样式。
 *
 * ── 数据形状（db 单键存 ctx.data('db')；改字段必须写迁移，见 normDb）──
 *   staged:   [{id,srcType,srcId,subject,stem,options,answer,solution,trap,point,addedAt}]
 *   lineages: [{id,createdAt,srcType,srcId,stagedId,subject,stem,options,answer,solution,
 *               trap,point,origin,             // origin:'ai'|'skeleton'
 *               variants:[{id,strategy,diff,stem,options,answer,solution,trap,
 *                          changeNote,status:'new|kept|drop',skin,similar,note,updatedAt}],
 *               paperId,paperTitle,packedAt,auditedAt}]
 *   papers:   [{id,title,subject,count,score,createdAt,lineageIds,graded|null}]
 *   day:      {'YYYY-MM-DD':{gen,keep,paper,grade}}
 *   stratStat:{strategyKey:{gen,keep}}
 *
 * ── 三条不做 ──────────────────────────────────────────────────
 *   ① 不编造变式质量（疑似换皮、质检存疑、留用率过低，都如实标出来，不粉饰）
 *   ② 不假装 AI 一定可用（无 AI = 空白骨架变式 + 手动填，成卷闭环照走）
 *   ③ 不自建第二套落库口（成卷只走 PaperKit.addDrafts，与站内导入完全同判据）
 *
 * 安装：插件中心 → 市场「变式题工厂」一键安装，或粘贴本文件。
 * ============================================================ */
;(function () {
  'use strict'

/* c1: utils + 领域常量 */
  /* 【2026-10-28】1.1：入场动画只在切视图时播放 + 策略芯片就地更新。
   * 之前每次 render 都整层重建并重放 vfRise —— 点任何按钮整页闪一下（用户实机反馈）。
   * 版本必须涨：已安装副本是整份源码存在 localStorage 里的，不涨号市场不提示更新。 */
  /* 【2026-10-28】1.2：提高题目质量与复核规范 —— 生成提示词加「四步自检」；本地快检
   * （缺答案/答案非A-D/选项重复/题干过短或不自足/换皮）标记疑点；疑点题须走结构化复核清单
   * （题干自足/答案复算/干扰项成立三项勾选）才能成卷；档案加复核台账。
   * 版本必须涨：已安装副本是整份源码存在 localStorage 里的。 */
  let VERSION = '1.3'
  let TOOL_ID = 'variant-forge'
  let AI_CTX_GEN = 'plugin.variant-forge.gen'
  let AI_CTX_AUDIT = 'plugin.variant-forge.audit'
  let PAPER_TAG = '变式工厂'

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
    return (p || 'vf') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
  }
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
  function nowIso() { return new Date().toISOString() }
  function fmtDate(k) {
    let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(k || ''))
    if (!m) return String(k || '')
    return (+m[2]) + '月' + (+m[3]) + '日'
  }
  function pctStr(a, b) {
    if (!b) return '—'
    return Math.round((a / b) * 100) + '%'
  }
  function shortText(s, n) {
    s = String(s || '')
    n = n || 46
    if (s.length <= n) return s
    let cut = s.slice(0, n)
    if ((cut.match(/\$/g) || []).length % 2 === 1) cut = cut.slice(0, cut.lastIndexOf('$'))
    if (cut.endsWith('\\')) cut = cut.slice(0, -1)
    return cut + '…'
  }
  function fingerprint(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/\\[a-z]+|[{}$\\^_]|[^0-9a-z一-鿿.]/g, '')
      .replace(/\s+/g, '')
  }
  function sim2(a, b) {
    a = fingerprint(a); b = fingerprint(b)
    if (a.length < 2 || b.length < 2) return 0
    let ga = {}
    for (let i = 0; i < a.length - 1; i++) ga[a.slice(i, i + 2)] = 1
    let hit = 0
    let gb = {}
    for (let j = 0; j < b.length - 1; j++) {
      let g = b.slice(j, j + 2)
      if (gb[g]) continue
      gb[g] = 1
      if (ga[g]) hit++
    }
    return hit / Math.max(1, Object.keys(gb).length)
  }
  function digitsOf(s) {
    let m = String(s || '').match(/\d+(?:\.\d+)?/g) || []
    return m.sort().join(',')
  }
  function icon(ctx, k) {
    try { return String((ctx && ctx.U && ctx.U.icon) ? ctx.U.icon(k) : '') } catch (e) { return '' }
  }
  function tex(ctx, s) {
    try {
      if (ctx && ctx.Tex && ctx.Tex.renderInline) return String(ctx.Tex.renderInline(String(s == null ? '' : s)))
    } catch (e) { /* fallthrough */ }
    return esc(s)
  }
  function texOne(ctx, s) {
    return tex(ctx, String(s == null ? '' : s).replace(/\s*\n+\s*/g, ' ').trim())
  }

  /* 七种变式策略：键是数据的一部分（账本/配色/prompt 共用），改键 = 迁移 */
  let STRATS = [
    {
      k: 'numShift', name: '数值变体', c: 'num',
      why: '方法考点全保留，只动数据 —— 治「背解题模板」，验证真的会算',
      ask: '保持考点、方法与陷阱完全一致，只系统性地更换全部数值/参数（不要只改一个数字），可顺带微调数据规模让计算量相当。'
    },
    {
      k: 'ctxSwap', name: '情境换壳', c: 'ctx',
      why: '换应用场景与叙述外壳 —— 治「认得出这道题」，练识别题型结构',
      ask: '把题目装进一个全新的应用情境（工程/经济/几何实物/生活场景等，与原题明显不同），问法和考点同构，但叙述外壳、符号命名全部换掉。'
    },
    {
      k: 'hardUp', name: '难度升阶', c: 'up',
      why: '加一层条件链/综合度 —— 打穿到真题水准以上',
      ask: '在原考点上增加一层综合：多一个前置化简步骤、或把两个相邻考点缝到一起、或给非常规形式的条件，让方法需要「先拆再套」。'
    },
    {
      k: 'hardDown', name: '难度降阶', c: 'down',
      why: '拆成带台阶的铺垫小题 —— 卡壳时退回的起跳板',
      ask: '把原题拆解成一道降低一档的铺垫题：减少一次变形、明给一个中间结论、或把综合题的第一问单独拿出来。适合连原题都卡住时练起。'
    },
    {
      k: 'reverse', name: '逆向设问', c: 'rev',
      why: '已知与所求互换 —— 双向打通才叫真懂',
      ask: '逆向命题：把原题的「所求」变成「已知」、原题的「已知条件之一」变成「所求」（例如原求极限改为已知极限反求参数），解法路径反转。'
    },
    {
      k: 'trapFocus', name: '陷阱靶向', c: 'trap',
      why: '对着母题的易错坑造辨析题 —— 错在哪就在哪再错一次的机会留不住',
      ask: '围绕原题的【易错点】专门设计辨析/防错型变式：让错误路径看起来格外「顺理成章」（干扰信息按典型错误布置），正确解法需要绕开该坑。若原题没给易错点，先推断该考点最常见误因再设计。'
    },
    {
      k: 'optionPerturb', name: '选项扰动', c: 'opt', onlyChoice: true,
      why: '正确项不动、干扰项全部按误因重造 —— 选择题的「精确制导」',
      ask: '保持题干与正确答案基本不变（可有轻微同义改写），把全部干扰项重造为「每个错误选项各对应一种具体误因」（漏绝对值/符号反了/量纲错/边界值…），在解析中逐一写明每个干扰项对应什么错误。'
    }
  ]
  function stratOf(k) {
    for (let i = 0; i < STRATS.length; i++) if (STRATS[i].k === k) return STRATS[i]
    return null
  }
  /* 难度四档口径同站内 quizEngine.DIFFS —— 不另立第五种说法 */
  let DIFFS = [
    { k: 'easy', name: '基础巩固', d: 0 },
    { k: 'medium', name: '常规训练', d: 1 },
    { k: 'real', name: '真题水准', d: 2 },
    { k: 'hard', name: '压轴挑战', d: 3 }
  ]
  function diffOf(k) {
    for (let i = 0; i < DIFFS.length; i++) if (DIFFS[i].k === k) return DIFFS[i]
    return DIFFS[1]
  }
  function diffStep(k, n) {
    let i = clamp(diffOf(k).d + (Number(n) || 0), 0, DIFFS.length - 1)
    return DIFFS[i].k
  }
  let VIEWS = [
    { k: 'bench', t: '选题台', ic: 'list' },
    { k: 'forge', t: '熔 炉', ic: 'cpBolt' },
    { k: 'atlas', t: '谱 系', ic: 'cpNodes' },
    { k: 'pack', t: '打 包', ic: 'fileText' },
    { k: 'stats', t: '档 案', ic: 'barChart' }
  ]
  /* 品牌砖：母题恒星 + 三颗变式卫星 */
  let MARK_TILE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="3.2"/><circle cx="12" cy="3.4" r="1.5"/><circle cx="20.1" cy="16.7" r="1.5"/><circle cx="3.9" cy="16.7" r="1.5"/><path d="M12 8.8V4.9M14.8 13.9l3.9 2.2M9.2 13.9l-3.9 2.2" opacity=".55"/></svg>'
  let MARK_LG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="3.4"/><circle cx="12" cy="3.2" r="1.7"/><circle cx="20.3" cy="16.8" r="1.7"/><circle cx="3.7" cy="16.8" r="1.7"/><path d="M12 8.6V4.9M14.9 13.8l4 2.3M9.1 13.8l-4 2.3" opacity=".55"/><path d="M12 12l4.6-6.2M12 12l-4.9 5.9" opacity=".25"/></svg>'

/* c2: 数据层（规范化 / 读写 / 统计口径，纯判据可单测） */
  let MAX_STAGED = 12        // 熔炉托盘容量
  let MAX_LINEAGES = 240     // 谱系档案上限（超出拒新并如实提示）
  let MAX_VARIANTS = 12      // 单母题变式上限

  function emptyDb() {
    return { v: 1, staged: [], lineages: [], papers: [], day: {}, stratStat: {} }
  }
  function strArr(v) {
    return Array.isArray(v) ? v.map(function (x) { return String(x == null ? '' : x) }).filter(function (x) { return x.trim() !== '' }) : []
  }
  function normVariant(x) {
    x = (x && typeof x === 'object') ? x : {}
    let st = stratOf(String(x.strategy || ''))
    return {
      id: String(x.id || uid('v')),
      strategy: st ? st.k : (x.strategy ? String(x.strategy).slice(0, 16) : 'numShift'),
      diff: diffOf(String(x.diff || 'medium')).k,
      stem: String(x.stem || ''),
      options: Array.isArray(x.options) && x.options.length ? strArr(x.options).slice(0, 8) : null,
      answer: String(x.answer || ''),
      solution: String(x.solution || ''),
      trap: String(x.trap || '').slice(0, 300),
      changeNote: String(x.changeNote || '').slice(0, 160),
      status: (x.status === 'kept' || x.status === 'drop') ? x.status : 'new',
      skin: !!x.skin,
      similar: Number(x.similar) || 0,
      note: String(x.note || '').slice(0, 200),
      /* 结构化复核记录：疑点题复核通过才有 packed 资格（见 buildDrafts/requireReview） */
      reviewed: !!x.reviewed,
      reviewedAt: String(x.reviewedAt || ''),
      updatedAt: String(x.updatedAt || nowIso())
    }
  }
  /* ---- 本地答案快检（确定性规则，不花 token） ----
   * 问题码：noAns=缺答案 / badChoice=选择题答案不是 A-H 单字母 / dupOpt=选项重复 /
   * shortStem=题干过短 / notSelf=题干引用了「原题/母题/上文」/ skin=疑似换皮。
   * 空白骨架（还没写题干）不算问题——它本来就等着人填。 */
  function quickIssues(v, L) {
    let out = []
    let stem = String(v && v.stem || '').trim()
    if (!stem) return out
    let ans = String(v && v.answer || '').trim()
    if (!ans) out.push('noAns')
    if (v.options && v.options.length >= 2) {
      if (!/^[A-H]$/.test(ans.toUpperCase())) out.push('badChoice')
      let seen = {}
      let dup = false
      v.options.forEach(function (o) { let k = String(o).trim(); if (k && seen[k]) dup = true; seen[k] = 1 })
      if (dup) out.push('dupOpt')
    }
    if (stem.length < 8) out.push('shortStem')
    if (/(原题|上文|母题|见上|前面那道)/.test(stem)) out.push('notSelf')
    if (v.skin) out.push('skin')
    return out
  }
  function issueLabel(k) {
    let m = { noAns: '缺答案', badChoice: '答案非A-D', dupOpt: '选项重复', shortStem: '题干过短', notSelf: '题干不自足', skin: '疑似换皮' }
    return m[k] || k
  }
  function normLineage(x) {
    x = (x && typeof x === 'object') ? x : {}
    return {
      id: String(x.id || uid('L')),
      createdAt: String(x.createdAt || nowIso()),
      srcType: ['mistake', 'bank', 'exam', 'manual'].indexOf(String(x.srcType || '')) >= 0 ? String(x.srcType) : 'manual',
      srcId: String(x.srcId || '').slice(0, 64),
      stagedId: String(x.stagedId || '').slice(0, 64),
      subject: String(x.subject || '').slice(0, 20) || '数学',
      stem: String(x.stem || ''),
      options: Array.isArray(x.options) && x.options.length ? strArr(x.options).slice(0, 8) : null,
      answer: String(x.answer || ''),
      solution: String(x.solution || ''),
      trap: String(x.trap || '').slice(0, 300),
      point: String(x.point || '').slice(0, 120),
      origin: x.origin === 'skeleton' ? 'skeleton' : 'ai',
      variants: (Array.isArray(x.variants) ? x.variants.filter(function (v) { return v && typeof v === 'object' }) : []).slice(0, MAX_VARIANTS).map(normVariant),
      paperId: String(x.paperId || ''),
      paperTitle: String(x.paperTitle || '').slice(0, 60),
      packedAt: String(x.packedAt || ''),
      auditedAt: String(x.auditedAt || '')
    }
  }
  function normStaged(x) {
    x = (x && typeof x === 'object') ? x : {}
    return {
      id: String(x.id || uid('s')),
      srcType: ['mistake', 'bank', 'exam', 'manual'].indexOf(String(x.srcType || '')) >= 0 ? String(x.srcType) : 'manual',
      srcId: String(x.srcId || '').slice(0, 64),
      subject: String(x.subject || '').slice(0, 20) || '数学',
      stem: String(x.stem || ''),
      options: Array.isArray(x.options) && x.options.length ? strArr(x.options).slice(0, 8) : null,
      answer: String(x.answer || ''),
      solution: String(x.solution || ''),
      trap: String(x.trap || '').slice(0, 300),
      point: String(x.point || '').slice(0, 120),
      addedAt: String(x.addedAt || nowIso())
    }
  }
  function normPaper(x) {
    x = (x && typeof x === 'object') ? x : {}
    let g = (x.graded && typeof x.graded === 'object') ? x.graded : null
    return {
      id: String(x.id || ''),
      title: String(x.title || '').slice(0, 80),
      subject: String(x.subject || '').slice(0, 20),
      count: clamp(x.count, 0, 500),
      score: clamp(x.score, 0, 1000),
      createdAt: String(x.createdAt || nowIso()),
      lineageIds: strArr(x.lineageIds).slice(0, 60),
      graded: g ? {
        score: clamp(g.score, 0, 1000),
        total: clamp(g.total, 0, 1000),
        wrongCount: clamp(g.wrongCount, 0, 999),
        at: String(g.at || '')
      } : null
    }
  }
  /* 全库规范化：脏字段逐条吞掉而不是整库拒收（云同步合并后的历史条目形状最野） */
  function normDb(raw) {
    raw = (raw && typeof raw === 'object') ? raw : {}
    let day = {}
    let rd = (raw.day && typeof raw.day === 'object') ? raw.day : {}
    Object.keys(rd).slice(0, 400).forEach(function (k) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) return
      let v = rd[k] || {}
      day[k] = {
        gen: clamp(v.gen, 0, 9999), keep: clamp(v.keep, 0, 9999),
        paper: clamp(v.paper, 0, 999), grade: clamp(v.grade, 0, 999)
      }
    })
    let ss = {}
    let rs = (raw.stratStat && typeof raw.stratStat === 'object') ? raw.stratStat : {}
    STRATS.forEach(function (st) {
      let v = rs[st.k] || {}
      ss[st.k] = { gen: clamp(v.gen, 0, 99999), keep: clamp(v.keep, 0, 99999) }
    })
    return {
      v: 1,
      staged: (Array.isArray(raw.staged) ? raw.staged : []).slice(0, MAX_STAGED).map(normStaged)
        .filter(function (s) { return s.stem }),
      lineages: (Array.isArray(raw.lineages) ? raw.lineages : []).slice(0, MAX_LINEAGES).map(normLineage)
        .filter(function (L) { return L.stem || L.variants.length }),
      papers: (Array.isArray(raw.papers) ? raw.papers : []).slice(0, 200).map(normPaper)
        .filter(function (p) { return p.id }),
      day: day, stratStat: ss
    }
  }
  function loadDb(ctx) {
    let d = null
    try { d = ctx.data('db') } catch (e) { d = null }
    return normDb(d)
  }
  function saveDb(ctx, db) {
    try { ctx.data('db', db) } catch (e) { /* Store 满时宿主 Toast 已报，不双弹 */ }
  }
  function bumpDay(db, field, n) {
    let k = todayKey()
    if (!db.day[k]) db.day[k] = { gen: 0, keep: 0, paper: 0, grade: 0 }
    db.day[k][field] = clamp((db.day[k][field] || 0) + (n == null ? 1 : n), 0, 9999)
  }
  function bumpStrat(db, sk, field, n) {
    if (!db.stratStat[sk]) db.stratStat[sk] = { gen: 0, keep: 0 }
    db.stratStat[sk][field] = clamp((db.stratStat[sk][field] || 0) + (n == null ? 1 : n), 0, 99999)
  }
  /* 疑似换皮粗判：文本高度相似 且 数字集合没变，两个都命中才敢标 */
  function skinCheck(srcStem, v) {
    let s = sim2(srcStem, v.stem)
    let digitSame = digitsOf(srcStem) === digitsOf(v.stem)
    return { similar: Math.round(s * 100) / 100, skin: !!(s >= 0.86 && digitSame) }
  }
  /* 谱系汇总：列表行与 KPI 共用一份口径 */
  function lineageStat(L) {
    let kept = 0, drop = 0, fresh = 0
    ;(L.variants || []).forEach(function (v) {
      if (v.status === 'kept') kept++
      else if (v.status === 'drop') drop++
      else fresh++
    })
    return { total: (L.variants || []).length, kept: kept, drop: drop, fresh: fresh }
  }
  function dbTotals(db) {
    let gen = 0, kept = 0
    db.lineages.forEach(function (L) {
      gen += (L.variants || []).length
      ;(L.variants || []).forEach(function (v) { if (v.status === 'kept') kept++ })
    })
    let graded = db.papers.filter(function (p) { return p.graded && p.graded.total > 0 })
    let got = 0, tot = 0
    graded.forEach(function (p) { got += p.graded.score; tot += p.graded.total })
    return {
      src: db.lineages.length, gen: gen, kept: kept, keepRate: gen ? kept / gen : 0,
      papers: db.papers.length, graded: graded.length, scoreRate: tot ? got / tot : 0
    }
  }
  /* 近 14 天序列（含空白天 —— 柱状图要刻度连续） */
  function last14(db) {
    let out = []
    for (let i = 13; i >= 0; i--) {
      let k = addDays(todayKey(), -i)
      let d = db.day[k] || { gen: 0, keep: 0, paper: 0 }
      out.push({ k: k, gen: d.gen, keep: d.keep, paper: d.paper })
    }
    return out
  }
  /* 薄弱考点榜：trap 是一等公民 */
  function weakPoints(db) {
    let m = {}
    db.lineages.forEach(function (L) {
      let key = String(L.trap || L.point || '').trim()
      if (!key) return
      key = key.slice(0, 40)
      if (!m[key]) m[key] = { trap: key, subject: L.subject, src: 0, kept: 0 }
      m[key].src++
      m[key].kept += lineageStat(L).kept
    })
    return Object.keys(m).map(function (k) { return m[k] })
      .sort(function (a, b) { return (b.src - a.src) || (b.kept - a.kept) })
      .slice(0, 8)
  }
  /* 策略质量账：留用率 <40% 且样本 ≥6 → 如实预警 */
  function strategyReport(db) {
    return STRATS.map(function (st) {
      let s = db.stratStat[st.k] || { gen: 0, keep: 0 }
      let rate = s.gen ? s.keep / s.gen : 0
      return { k: st.k, name: st.name, c: st.c, gen: s.gen, keep: s.keep, rate: rate, warn: s.gen >= 6 && rate < 0.4 }
    })
  }
  /* 母题查重：指纹口径与搜索一致（去标点/空白/大小写）—— 托盘或档案已有就不再收 */
  function stemDup(db, stem) {
    let fp = fingerprint(stem)
    if (!fp) return false
    if (db.staged.some(function (s) { return fingerprint(s.stem) === fp })) return true
    return db.lineages.some(function (L) { return fingerprint(L.stem) === fp })
  }

/* c3: AI 层（开炉生成 + 质检） */
  let HOST_CTX = null // init 抓的 ctx（无参操作用）

  function aiOk(ctx) {
    try { return !!(ctx && ctx.ai && ctx.ai.has && ctx.ai.has()) } catch (e) { return false }
  }
  function genSystem() {
    return [
      '你是考研命题组的资深命题人，专长是「变式命题」：给定一道母题，产出同源但不同脸的新题。',
      '铁律：',
      '1) 每道变式必须与母题同考点、方法同源，但切入角度/数据/情境/问法至少一项发生实质变化；',
      '2) 严禁只换个数字糊弄（数值变体策略除外，它要求系统性更换全部数据）；',
      '3) 保留同类陷阱，并把陷阱写进 trap 字段（一句话说清这道题埋的坑）；',
      '4) 答案必须可独立验算；选择题须逐干扰项写明它对应哪种典型误因；',
      '5) 公式一律标准 LaTeX（行内 $…$），题干自洽，不引用「上文/原题」；',
      '6) 只输出 JSON，不要解释文字或代码围栏。',
      '',
      '【出题前必须逐题完成的四步自检（写进 JSON 之前过一遍）】',
      '① 条件充分性：只凭题干必须能推出唯一答案——缺条件的补上，冗余条件删掉；',
      '② 答案正确性：answer 不得为空；选择题答案必须是 A/B/C/D 中的一个字母，且与选项顺序一一对应；凡可计算/可求极限/可解方程的题，先用沙箱 Python 验算再落答案，严禁凭感觉报数值；',
      '③ 选项互斥性：选择题选项互不重叠、无重复项，干扰项按典型误因设计（"像真的"但错误原因唯一），禁止「以上都对/都不对」凑数；',
      '④ 难度一致性：升阶必须真的多一步推理或综合，降阶必须真的少一步；解析末尾用一句「易错提醒」点破本题的坑。'
    ].join('\n')
  }
  /* 母题信息块（字段口径对齐 quizEngine.buildVariantAsk） */
  function srcBlock(L) {
    let lines = ['母题题干：' + String(L.stem || '').trim()]
    if (L.options && L.options.length) {
      lines.push('母题选项：' + L.options.map(function (o, i) { return 'ABCD'[i] + '. ' + o }).join(' ｜ '))
    }
    if (L.answer) lines.push('母题答案：' + L.answer)
    if (L.solution) lines.push('母题解析/关键方法：' + shortText(L.solution, 500))
    if (L.trap) lines.push('母题易错点：' + L.trap)
    if (L.point) lines.push('考点标注：' + L.point)
    lines.push('科目：' + L.subject)
    return lines.join('\n')
  }
  /* 生成 ask：策略清单 + 轮转配额 + 严格 schema（一次母题一次调用） */
  function buildGenAsk(L, stratKeys, count) {
    let picked = stratKeys.map(stratOf).filter(Boolean)
    if (!picked.length) picked = [STRATS[0], STRATS[1], STRATS[4]]
    /* 选项扰动只对选择题可用；非选择题时静默剔除 */
    if (!(L.options && L.options.length >= 2)) {
      picked = picked.filter(function (s) { return !s.onlyChoice })
      if (!picked.length) picked = [STRATS[0], STRATS[1], STRATS[4]]
    }
    let n = clamp(count, 1, MAX_VARIANTS)
    /* 配额轮转：3 策略出 6 题 = 各 2 题；除不尽前面的策略多拿 */
    let per = []
    let rest = n
    for (let i = 0; i < picked.length; i++) {
      let base = Math.min(Math.ceil(rest / (picked.length - i)), rest)
      per.push(base)
      rest -= base
    }
    let req = picked.map(function (s, i) {
      return '【' + s.name + '】出 ' + per[i] + ' 道：' + s.ask
    }).join('\n')
    let keys = picked.map(function (s) { return s.k }).join('/')
    return '【变式工厂 · 批量开炉】\n\n== 母题信息 ==\n' + srcBlock(L) +
      '\n\n== 各路策略要求 ==\n' + req +
      '\n\n== 输出 JSON 契约 ==\n' +
      '{\n  "variants": [\n    {\n' +
      '      "strategy": "策略键，只能取：' + keys + '",\n' +
      '      "stem": "题干（公式用 $…$）",\n' +
      '      "options": ["选项A文本","选项B文本","选项C文本","选项D文本"] 或 null（非选择题填 null）,\n' +
      '      "answer": "标准答案；选择题为单个大写字母",\n' +
      '      "solution": "完整解析：方法路线 + 关键步骤；选项扰动题须逐干扰项写明误因",\n' +
      '      "trap": "本题埋的坑（一句话）",\n' +
      '      "diff": "easy|medium|real|hard 四档之一",\n' +
      '      "changeNote": "和母题比改了什么（≤40字）"\n    }\n  ]\n}\n' +
      '共 ' + n + ' 道，按策略顺序排列；diff 围绕母题水平允许 ±1 档浮动。\n' +
      '契约重申：answer 必填不得为空；' + (L.options && L.options.length ? ('选择题 options 数量必须为 ' + L.options.length + ' 个、与母题一致，答案字母与选项顺序一一对应；') : '') +
      '公式一律 $…$ 包裹，不得裸写反斜杠；每道题 trap 必填；题干不得引用「原题/母题/上文」。'
  }
  /* 解析 AI 返回：顶层给数组也认；坏条目丢进 dropped 如实报数 */
  function parseGenResult(raw) {
    let arr = null
    if (Array.isArray(raw)) arr = raw
    else if (raw && typeof raw === 'object') arr = raw.variants || raw.items || raw.questions || null
    if (!Array.isArray(arr)) return { ok: false, variants: [], dropped: 0, error: '返回里没有 variants 数组' }
    let out = []
    let dropped = 0
    arr.forEach(function (x) {
      if (!x || typeof x !== 'object') { dropped++; return }
      let stem = String(x.stem || '').trim()
      if (!stem) { dropped++; return }
      let options = Array.isArray(x.options) ? strArr(x.options).slice(0, 8) : null
      if (options && options.length < 2) options = null
      out.push(normVariant({
        strategy: String(x.strategy || ''),
        stem: stem,
        options: options,
        answer: String(x.answer || ''),
        solution: String(x.solution || ''),
        trap: String(x.trap || ''),
        diff: diffOf(String(x.diff || 'medium')).k,
        changeNote: String(x.changeNote || ''),
        status: 'new'
      }))
    })
    return { ok: out.length > 0, variants: out, dropped: dropped, error: out.length ? '' : '全部条目都缺题干，没有可用变式' }
  }
  /* 无 AI 降级：空白骨架变式 —— 策略说明与陷阱预填，题干留白，标签如实写「骨架」 */
  function skeletonVariants(L, stratKeys, count) {
    let picked = stratKeys.map(stratOf).filter(Boolean)
    if (!picked.length) return []
    let out = []
    for (let i = 0; i < clamp(count, 1, MAX_VARIANTS); i++) {
      let s = picked[i % picked.length]
      if (s.onlyChoice && !(L.options && L.options.length >= 2)) continue
      out.push(normVariant({
        strategy: s.k,
        stem: '',
        options: L.options ? L.options.slice() : null,
        answer: '',
        solution: '',
        trap: s.name + '：' + shortText(L.trap || s.why, 80),
        diff: s.k === 'hardUp' ? diffStep('medium', 1) : (s.k === 'hardDown' ? diffStep('medium', -1) : 'medium'),
        changeNote: s.ask,
        status: 'new'
      }))
    }
    return out
  }
  /* 超额修剪：只挤「新出炉」，留用/弃用永不被挤（控制台承诺过） */
  function trimVariants(L) {
    if ((L.variants || []).length <= MAX_VARIANTS) return
    let keep = L.variants.filter(function (v) { return v.status !== 'new' })
    let fresh = L.variants.filter(function (v) { return v.status === 'new' })
    let room = Math.max(0, MAX_VARIANTS - keep.length)
    L.variants = keep.concat(fresh.slice(Math.max(0, fresh.length - room))) /* 挤最旧的 new,保最新的（与承诺文案一致） */
  }
  /* 开炉单体：返回 Promise，绝不 reject */
  function forgeOne(ctx, L, stratKeys, count) {
    /* db 在入口一次抓取：destroy 会把 ctx.__db 置空,在途微任务再摸就是 null 崩账 */
    let db = ctx.__db || loadDb(ctx)
    if (!aiOk(ctx)) {
      let sk = skeletonVariants(L, stratKeys, count)
      L.variants = (L.variants || []).concat(sk)
      trimVariants(L)
      L.origin = 'skeleton'
      sk.forEach(function (v) { bumpStrat(db, v.strategy, 'gen', 1) })
      return Promise.resolve({ ok: sk.length > 0, count: sk.length, skeleton: true })
    }
    return ctx.ai.json(genSystem(), buildGenAsk(L, stratKeys, count), {
      ctx: AI_CTX_GEN, maxTokens: 3800, temperature: 0.8
    }).then(function (raw) {
      let r = parseGenResult(raw)
      if (!r.ok) return { ok: false, count: 0, error: r.error }
      r.variants.forEach(function (v) {
        let chk = skinCheck(L.stem, v)
        v.similar = chk.similar
        v.skin = chk.skin
        if (v.skin) v.note = '疑似换皮：与母题文本相似度 ' + Math.round(v.similar * 100) + '% 且数值未变'
        bumpStrat(db, v.strategy, 'gen', 1)
      })
      L.variants = (L.variants || []).concat(r.variants)
      trimVariants(L)
      return { ok: true, count: r.variants.length, dropped: r.dropped }
    }, function (e) {
      return { ok: false, count: 0, error: (e && e.message) ? String(e.message).slice(0, 80) : 'AI 调用失败' }
    })
  }
  /* 批量开炉：串行队列（并行会打爆单家 API，站内出题链同款节奏）；
   * onProgress(done,total,L,r)；cancel() 后当前一题跑完就不再发下一题 */
  function forgeBatch(ctx, list, stratKeys, count, onProgress) {
    let cancelled = false
    let doneArr = []
    let failedArr = []
    let i = 0
    function step() {
      if (cancelled || i >= list.length) {
        return Promise.resolve({ done: doneArr, failed: failedArr, cancelled: cancelled })
      }
      let L = list[i]
      i++
      return forgeOne(ctx, L, stratKeys, count).then(function (r) {
        if (r.ok) doneArr.push(L.id)
        else failedArr.push({ id: L.id, why: r.error || '失败' })
        if (onProgress) { try { onProgress(i, list.length, L, r) } catch (e) { /* 回调炸了不拦主链 */ } }
        return step()
      })
    }
    return { promise: step(), cancel: function () { cancelled = true } }
  }
  /* 质检：整谱系交「核对员」人设 —— 只标不改，可疑就在卡上亮 note，改不改由人定 */
  function buildAuditAsk(L) {
    let vs = (L.variants || []).map(function (v, i) {
      let sd = stratOf(v.strategy) || STRATS[0]
      let o = (v.options && v.options.length) ? ' 选项：' + v.options.map(function (x, j) { return 'ABCD'[j] + '.' + shortText(x, 30) }).join(' | ') : ''
      return '#' + (i + 1) + ' [' + sd.name + '] ' + shortText(v.stem, 120) + o + ' 答案：' + shortText(v.answer, 60)
    }).join('\n')
    return '【变式质检 · 逐题核对】\n母题：' + shortText(L.stem, 300) +
      '\n\n变式清单：\n' + vs +
      '\n\n请逐题核对三件事：\n' +
      '1) 答案能否由题干独立推出（逻辑自洽、不缺条件）；\n' +
      '2) 是否真变式（与母题只有一处表层差异算不合格）；\n' +
      '3) 选择题干扰项是否合理（有无明显送分/无意义选项）。\n' +
      '只输出 JSON：{"checks":[{"n":1,"ok":true,"issue":""},{"n":2,"ok":false,"issue":"≤40字问题"}]}\n' +
      'n 为清单序号，没问题时 issue 留空串。'
  }
  function parseAudit(raw, L) {
    let arr = null
    if (raw && Array.isArray(raw.checks)) arr = raw.checks
    else if (Array.isArray(raw)) arr = raw
    if (!Array.isArray(arr)) return { ok: false, hit: 0 }
    let hit = 0
    arr.forEach(function (c) {
      if (!c || typeof c !== 'object') return
      let n = Number(c.n)
      if (!(n >= 1 && n <= L.variants.length)) return
      let v = L.variants[n - 1]
      if (c.ok === true || c.ok === 'true') {
        if (/质检/.test(v.note || '')) v.note = ''
      } else {
        v.note = '质检存疑：' + shortText(String(c.issue || 'AI 未能核对自洽'), 60)
        hit++
      }
    })
    return { ok: true, hit: hit }
  }
  function auditLineage(ctx, L) {
    if (!aiOk(ctx)) return Promise.resolve({ ok: false, error: '未配置 AI，无法自检' })
    if (!(L.variants || []).length) return Promise.resolve({ ok: false, error: '这个谱系还没有题目可查' })
    return ctx.ai.json(
      '你是考研试卷质检员，只核对答案自洽性与变式有效性，宁缺毋滥：拿不准就 ok=true、issue 写"未能判定"。只输出 JSON。',
      buildAuditAsk(L),
      { ctx: AI_CTX_AUDIT, maxTokens: 1800, temperature: 0.2 }
    ).then(function (raw) {
      let r = parseAudit(raw, L)
      if (r.ok) L.auditedAt = nowIso()
      return { ok: r.ok, hit: r.hit }
    }, function (e) {
      return { ok: false, error: (e && e.message) ? '自检失败：' + String(e.message).slice(0, 60) : '自检失败' }
    })
  }

/* c4: 成卷层（留用变式 → PaperDraft → PaperKit 唯一落库口） */
  /* questions 直接对齐 Quiz/PaperQuestion：stem/type/options/answer/solution/trap/
   * diff/topicName/source/score —— 做题器、判分、热力图全都认识。
   * 跨科目按科目拆卷（PaperDraft.subject 单值，混科会毁掉热力归账）。 */
  function keptPool(db) {
    let out = []
    db.lineages.forEach(function (L) {
      (L.variants || []).forEach(function (v) {
        if (v.status === 'kept') out.push({ L: L, v: v })
      })
    })
    return out
  }
  function variantToQuestion(L, v, scorePer) {
    let s = stratOf(v.strategy) || STRATS[0]
    let q = {
      stem: v.stem,
      type: (v.options && v.options.length >= 2) ? 'choice' : 'solve',
      answer: v.answer,
      solution: v.solution || '',
      trap: v.trap || '',
      diff: diffOf(v.diff).k,
      score: clamp(scorePer, 1, 100),
      topicName: String(L.point || L.subject || s.name).slice(0, 60),
      source: '变式工厂 · ' + s.name + '（母题：' + shortText(L.stem, 24) + '）'
    }
    if (v.options && v.options.length >= 2) q.options = v.options
    q.aiFilled = true // AI/骨架产出，如实标注，不冒充卷面原文
    return q
  }
  /* 组装：refs=[{vid}] → {drafts, groups, skipped}（空题干/超大体积逐条如实报） */
  function buildDrafts(ctx, db, refs, meta) {
    meta = meta || {}
    let scorePer = clamp(meta.scorePer || 10, 1, 100)
    let perMin = clamp(meta.timePerQ || 3, 1, 60)
    /* 复核闸：疑点题（本地快检命中）未复核不许成卷；requireReview 可关（届时只警告） */
    let strict = true
    try { strict = ctx.config('requireReview') !== false } catch (e) { }
    let groups = {}
    let skipped = []
    let reviewBlocked = 0
    refs.forEach(function (ref) {
      let found = null
      for (let i = 0; i < db.lineages.length && !found; i++) {
        let L = db.lineages[i]
        for (let j = 0; j < (L.variants || []).length; j++) {
          if (L.variants[j].id === ref.vid) { found = { L: L, v: L.variants[j] }; break }
        }
      }
      if (!found) { skipped.push('有题目已不在档案里（可能刚被删掉）'); return }
      if (!String(found.v.stem || '').trim()) { skipped.push('「' + shortText(found.L.stem, 14) + '」的某道变式题干为空（骨架没填完）'); return }
      let iss = quickIssues(found.v, found.L)
      if (strict && iss.length && !found.v.reviewed) {
        reviewBlocked++
        skipped.push('「' + shortText(found.L.stem, 14) + '」变式有快检疑点（' + iss.map(issueLabel).join('/') + '）未复核')
        return
      }
      if (!strict && iss.length) skipped.push('提醒：「' + shortText(found.L.stem, 12) + '」有疑点未复核（已按设置放行）')
      let sub = String(found.L.subject || '其他')
      if (!groups[sub]) groups[sub] = { subject: sub, items: [] }
      groups[sub].items.push(found)
    })
    let drafts = []
    let gs = []
    Object.keys(groups).forEach(function (sub) {
      let g = groups[sub]
      /* 由易到难：先按难度档排（easy→hard），同档保持勾选顺序（sort 稳定） */
      if (meta.sortEasy) {
        g.items.sort(function (a, b) { return diffOf(a.v.diff).d - diffOf(b.v.diff).d })
      }
      let qs = g.items.map(function (it) { return variantToQuestion(it.L, it.v, scorePer) })
      let title = String(meta.titlePrefix || '').trim() ||
        ('变式卷 · ' + sub + ' · ' + fmtDate(todayKey()) + '（' + qs.length + '题）')
      let draft = {
        title: title, subject: sub,
        timeLimit: qs.length * perMin,
        totalScore: qs.length * scorePer,
        questions: qs,
        tag: PAPER_TAG
      }
      let size = JSON.stringify(draft).length
      try {
        if (window.PaperKit && window.PaperKit.sizeOf) size = window.PaperKit.sizeOf(draft)
      } catch (e) { /* 桥没挂时用字符数兜底 */ }
      if (size > 6 * 1024 * 1024) { skipped.push(title + '：体积超 6MB 入库闸，请精简解析文本'); return }
      drafts.push(draft)
      gs.push({
        subject: sub, count: qs.length, score: qs.length * scorePer,
        minutes: qs.length * perMin,
        lineageIds: g.items.map(function (it) { return it.L.id })
      })
    })
    return { drafts: drafts, groups: gs, skipped: skipped }
  }
  /* 入库并记账；PaperKit 的 skipped 原样并入返回值（如实拒绝，不静默） */
  function commitPapers(ctx, db, build, createdAt) {
    let res = { ids: [], skipped: (build.skipped || []).slice() }
    if (!build.drafts.length) return res
    let kit = window.PaperKit
    if (!kit || !kit.addDrafts) {
      res.skipped.push('宿主 PaperKit 不可用（题卷能力未加载）')
      return res
    }
    let add = kit.addDrafts(build.drafts)
    res.ids = (add && add.ids) || []
    let addSkipped = (add && add.skipped) || []
    addSkipped.forEach(function (s) { res.skipped.push(String(s)) })
    /* addDrafts 按传入顺序返回；某卷被闸掉则该组无对应 id，如实跳过 */
    res.ids.forEach(function (id, gi) {
      let g = build.groups[gi]
      let d = build.drafts[gi]
      if (!g || !d) return
      let title = d.title
      db.papers.unshift(normPaper({
        id: id, title: title, subject: g.subject, count: g.count, score: g.score,
        createdAt: createdAt || nowIso(), lineageIds: g.lineageIds, graded: null
      }))
      /* 谱系打上行踪：被卷进过哪张卷（重复组卷也允许，只记最近一次） */
      g.lineageIds.forEach(function (lid) {
        for (let i = 0; i < db.lineages.length; i++) {
          if (db.lineages[i].id === lid) {
            db.lineages[i].paperId = id
            db.lineages[i].paperTitle = title
            db.lineages[i].packedAt = createdAt || nowIso()
            break
          }
        }
      })
    })
    bumpDay(db, 'paper', res.ids.length)
    return res
  }
  /* 勾选集合按科目预拆（只为按钮文案报「几张卷」，真实拆卷在 buildDrafts） */
  function subjectSplit(S, db) {
    let subs = {}
    db.lineages.forEach(function (L) {
      (L.variants || []).forEach(function (v) {
        if (S.packSel.has(v.id)) subs[L.subject || '其他'] = 1
      })
    })
    return Object.keys(subs)
  }
  /* 可打印文稿：卷面（分值 + 作答空位）+ 答案册（策略/坑/解析） */
  function buildPaperMd(draft, withAnswers) {
    let out = [
      '# ' + (draft.title || '变式卷'), '',
      '> 科目：' + draft.subject + ' ｜ 满分：' + (draft.totalScore || '—') +
      ' ｜ 建议用时：' + (draft.timeLimit || '—') + ' 分钟 ｜ 由变式题工厂 v' + VERSION + ' 生成', ''
    ]
    let running = 0
    draft.questions.forEach(function (q, i) {
      let sc = q.score ? '（' + q.score + ' 分）' : ''
      out.push('**' + (i + 1) + '.**' + sc + ' ' + String(q.stem || '').replace(/\n+/g, ' '))
      if (q.options && q.options.length) {
        q.options.forEach(function (o, j) { out.push('　　' + 'ABCD'[j] + '．' + String(o).replace(/\n+/g, ' ')) })
      } else {
        out.push('　　＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿')
        out.push('　　＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿')
      }
      running += Number(q.score || 0)
      out.push('')
    })
    out.push('---', '', '_全卷合计 ' + running + ' 分；做完后可回站内「我的题卷」对照答案判分。_')
    if (withAnswers) {
      out.push('', '## 答案册', '')
      draft.questions.forEach(function (q, i) {
        let m = /变式工厂 · ([^（]+)/.exec(String(q.source || ''))
        out.push('**' + (i + 1) + '.** 答案：' + (q.answer || '（卷面未给）'))
        if (m) out.push('　　- 策略：' + m[1])
        if (q.trap) out.push('　　- 陷阱：' + q.trap)
        if (q.solution) out.push('　　- 解析：' + String(q.solution).replace(/\n+/g, ' '))
        out.push('')
      })
    }
    out.push('', '由变式题工厂 v' + VERSION + ' 生成 · ' + dkey(new Date()))
    return out.join('\n')
  }

/* c5: 视图公共件 + 三源候选读取 + 选题台 */
  /* 每个视图 = render(env) 纯函数：读 S 与 db → 写 env.stage.innerHTML；
   * 事件全走 stage 上的委托（ACT 表在 c8/mountShell 里）。
   * env = { ctx, S, db, stage, save, go, rerender, toast, T, trayCount } */
  function chip(label, cls) {
    return '<span class="vf-chip' + (cls ? ' ' + cls : '') + '">' + esc(label) + '</span>'
  }
  function stratChip(sk, small) {
    let s = stratOf(sk)
    if (!s) return '<span class="vf-chip">' + esc(String(sk || '?')) + '</span>'
    return '<span class="vf-chip c-' + s.c + (small ? ' sm' : '') + '">' + esc(s.name) + '</span>'
  }
  function diffChip(dk) {
    let d = diffOf(dk)
    return '<span class="vf-diffchip d-' + d.k + '">' + esc(d.name) + '</span>'
  }
  function statusTag(v) {
    if (v.status === 'kept') return '<span class="vf-stag kept">留用</span>'
    if (v.status === 'drop') return '<span class="vf-stag drop">弃用</span>'
    return '<span class="vf-stag new">新出炉</span>'
  }
  function emptyBox(title, sub, act) {
    return '<div class="vf-empty"><i>' + MARK_TILE + '</i>'
      + '<b>' + esc(title) + '</b>'
      + (sub ? '<span>' + esc(sub) + '</span>' : '')
      + (act || '')
      + '</div>'
  }
  /* 「送进熔炉」批量按钮：renderBench 首画与行级更新的 syncPickBar 共用一份模板（单一事实源） */
  function pickGoHtml(n) {
    return '<button class="vf-btn primary" data-act="bench-pickgo"><i>' + icon(HOST_CTX, 'cpBolt') + '</i>送进熔炉（' + n + '）</button>'
  }

  /* ---- 三源只读（形状对齐 siteSearch 的 SR* 视图；写库只走 ctx.data） ---- */
  function storeOf(ctx) {
    try { return ctx.Store.get() || {} } catch (e) { return {} }
  }
  function srcSubjects(list) {
    let m = {}
    list.forEach(function (x) { let s = String(x.subject || '').trim(); if (s) m[s] = 1 })
    return Object.keys(m).sort()
  }
  /* 错题本 → 候选：带 SRS 到期标记，到期的排前面（先练正在忘的） */
  function candMistakes(ctx) {
    let s = storeOf(ctx)
    return (Array.isArray(s.mistakes) ? s.mistakes : []).map(function (m) {
      return {
        key: 'mistake:' + String(m.id || ''),
        srcType: 'mistake', srcId: String(m.id || ''),
        subject: String(m.subject || '未分科'),
        stem: String(m.stem || m.desc || ''),
        options: (m.options && m.options.length) ? m.options.slice(0, 8) : null,
        answer: String(m.answer || ''), solution: String(m.solution || ''),
        trap: String(m.type || (m.desc ? shortText(m.desc, 40) : '')),
        point: String(m.desc || m.type || '').slice(0, 120),
        due: m.srs && m.srs.due ? String(m.srs.due) : '',
        lapses: m.srs && m.srs.lapses ? Number(m.srs.lapses) : 0,
        date: String(m.date || '')
      }
    }).filter(function (c) { return c.stem.trim() })
      .sort(function (a, b) {
        let ad = a.due && a.due <= todayKey() ? 0 : 1
        let bd = b.due && b.due <= todayKey() ? 0 : 1
        return (ad - bd) || (b.lapses - a.lapses) || (String(b.date) > String(a.date) ? 1 : -1)
      })
  }
  /* 站内题库（AI 测验沉淀） */
  function candBank(ctx) {
    let s = storeOf(ctx)
    return (Array.isArray(s.quizBank) ? s.quizBank : []).map(function (b) {
      return {
        key: 'bank:' + String(b.id || b.stem || '').slice(0, 40),
        srcType: 'bank', srcId: String(b.id || ''),
        subject: String(b.subject || '未分科'),
        stem: String(b.stem || ''),
        options: (b.options && b.options.length) ? b.options.slice(0, 8) : null,
        answer: String(b.answer || ''), solution: String(b.solution || ''),
        trap: String(b.trap || ''), point: String(b.topicName || ''),
        due: '', lapses: 0, date: String(b.savedAt || '')
      }
    }).filter(function (c) { return c.stem.trim() })
  }
  /* 我的卷 → 摊平成候选小题 */
  function candExam(ctx) {
    let s = storeOf(ctx)
    let exams = (s.sprintData && Array.isArray(s.sprintData.mockExams)) ? s.sprintData.mockExams : []
    let out = []
    exams.slice(0, 40).forEach(function (e) {
      (Array.isArray(e.questions) ? e.questions : []).forEach(function (q, qi) {
        let stem = String(q.stem || '').trim()
        if (!stem) return
        out.push({
          key: 'exam:' + String(e.id || '') + ':' + qi,
          srcType: 'exam', srcId: String(e.id || ''),
          subject: String(e.subject || '未分科'),
          stem: stem,
          options: (q.options && q.options.length) ? q.options.slice(0, 8) : null,
          answer: String(q.answer || ''), solution: String(q.solution || ''),
          trap: String(q.trap || ''), point: String(q.topicName || q.point || ''),
          examTitle: String(e.title || '未命名卷'),
          due: '', lapses: 0, date: String(e.completedAt || '')
        })
      })
    })
    return out
  }
  function candList(ctx, src) {
    if (src === 'bank') return candBank(ctx)
    if (src === 'exam') return candExam(ctx)
    return candMistakes(ctx)
  }

  /* ============================================================
   * 选题台：三源浏览 + 手填母题 + 托盘常驻
   * ============================================================ */
  function renderBench(env) {
    let ctx = env.ctx, S = env.S, db = env.db
    let src = S.bench.src
    let cands = []
    if (src !== 'manual') {
      cands = candList(ctx, src)
      if (S.bench.subj !== 'all') cands = cands.filter(function (c) { return c.subject === S.bench.subj })
      let q = String(S.bench.q || '').trim().toLowerCase()
      if (q) {
        cands = cands.filter(function (c) {
          return fingerprint(c.stem + ' ' + c.point + ' ' + c.trap).indexOf(fingerprint(q)) >= 0
            || String(c.stem).toLowerCase().indexOf(q) >= 0
        })
      }
    }
    let head = ''
    let body = ''
    if (src !== 'manual') {
      let subjAll = srcSubjects(candList(ctx, src))
      head = '<div class="vf-seg">'
        + [['mistake', '错题本'], ['bank', '题库'], ['exam', '我的卷'], ['manual', '手填母题']].map(function (p) {
          return '<button class="vf-segbtn' + (src === p[0] ? ' on' : '') + '" data-act="bench-src" data-v="' + p[0] + '">' + esc(p[1]) + '</button>'
        }).join('') + '</div>'
        + '<div class="vf-filter">'
        + '<input class="vf-input vf-search" data-act="bench-q" placeholder="搜题干/考点/错因…" value="' + esc(S.bench.q) + '">'
        + '<select class="vf-input vf-sel" data-act="bench-subj">'
        + '<option value="all"' + (S.bench.subj === 'all' ? ' selected' : '') + '>全部科目</option>'
        + subjAll.map(function (s) { return '<option value="' + esc(s) + '"' + (S.bench.subj === s ? ' selected' : '') + '>' + esc(s) + '</option>' }).join('')
        + '</select>'
        + '<span class="vf-count">' + cands.length + ' 条可选</span>'
        + '<button class="vf-btn ghost" data-act="bench-all">'
        + (S.bench.pick.size ? '全部取消' : '本页全选') + '</button>'
        + (S.bench.pick.size ? pickGoHtml(S.bench.pick.size) : '')
        + '</div>'
    } else {
      head = '<div class="vf-seg">'
        + [['mistake', '错题本'], ['bank', '题库'], ['exam', '我的卷'], ['manual', '手填母题']].map(function (p) {
          return '<button class="vf-segbtn' + (src === p[0] ? ' on' : '') + '" data-act="bench-src" data-v="' + p[0] + '">' + esc(p[1]) + '</button>'
        }).join('') + '</div>'
    }
    if (src === 'manual') {
      let m = S.bench.m
      body = '<div class="vf-mform">'
        + '<div class="vf-fldrow"><label class="vf-fld"><span>科目</span><input class="vf-input" data-f="subject" placeholder="数学 / 英语 / 政治 …" value="' + esc(m.subject) + '"></label>'
        + '<label class="vf-fld grow"><span>考点（可空）</span><input class="vf-input" data-f="point" placeholder="这个题在考什么" value="' + esc(m.point) + '"></label></div>'
        + '<label class="vf-fld"><span>题干 *</span><textarea class="vf-input vf-ta" rows="4" data-f="stem" placeholder="把题面粘进来，公式用 $…$">' + esc(m.stem) + '</textarea></label>'
        + '<div class="vf-fldrow">'
        + '<label class="vf-fld"><span>选项（每行一个，非选择题留空）</span><textarea class="vf-input vf-ta" rows="5" data-f="options" placeholder="A. …&#10;B. …">' + esc((m.options || []).join('\n')) + '</textarea></label>'
        + '<label class="vf-fld grow"><span>答案 / 解析 / 易错点</span>'
        + '<input class="vf-input" style="margin-bottom:8px" data-f="answer" placeholder="答案（选择题填字母）" value="' + esc(m.answer) + '">'
        + '<textarea class="vf-input vf-ta" rows="3" style="margin-bottom:8px" data-f="solution" placeholder="解析 / 关键方法（可空，AI 会先推断）">' + esc(m.solution) + '</textarea>'
        + '<input class="vf-input" data-f="trap" placeholder="当时错在哪（这道变式要打的就是这个坑）" value="' + esc(m.trap) + '"></label></div>'
        + '<div class="vf-acts"><button class="vf-btn primary" data-act="bench-manual"><i>' + icon(ctx, 'cpPlus') + '</i>送进熔炉</button>'
        + '<span class="vf-hint">手填母题与站内三源同权进谱系；信息越全（尤其「易错点」），靶向变式越准。</span></div>'
        + '</div>'
    } else if (!cands.length) {
      body = emptyBox(
        (S.bench.q || S.bench.subj !== 'all') ? '这个筛选条件下没有题' : (src === 'mistake' ? '错题本还是空的' : (src === 'bank' ? '题库还没有沉淀题目' : '还没有做过任何卷')),
        src === 'mistake' ? '去「错题画像」录几道，或切「手填母题」直接粘一道' : '换个来源，或「手填母题」',
        '<button class="vf-btn" data-act="bench-src" data-v="manual">手填母题</button>'
      )
    } else {
      body = '<div class="vf-candwrap">' + cands.slice(0, 160).map(function (c) {
        let on = S.bench.pick.has(c.key)
        let isExp = S.bench.exp === c.key
        return '<div class="vf-cand' + (on ? ' on' : '') + (isExp ? ' exp' : '') + '">'
          + '<button class="vf-pickbtn" data-act="bench-pick" data-key="' + esc(c.key) + '" title="选它当母题">' + (on ? '✓' : '') + '</button>'
          + '<div class="vf-cmain" data-act="bench-exp" data-key="' + esc(c.key) + '">'
          + '<b>' + texOne(ctx, shortText(c.stem, 90)) + '</b>'
          + '<div class="vf-cmeta">' + chip(c.subject, 'subj')
          + (c.point ? chip(shortText(c.point, 16), 'pt') : '')
          + (c.examTitle ? chip(shortText(c.examTitle, 12), 'exam') : '')
          + (c.due && c.due <= todayKey() ? '<span class="vf-due">SRS 已到期</span>' : '')
          + (c.lapses >= 2 ? '<span class="vf-lapse">已错 ' + c.lapses + ' 次</span>' : '')
          + '</div>'
          + (isExp ? '<div class="vf-cfull">'
            + (c.options ? '<div class="vf-copts">' + c.options.map(function (o, j) { return '<i>' + 'ABCD'[j] + '.</i><span>' + texOne(ctx, o) + '</span>' }).join('') + '</div>' : '')
            + (c.answer ? '<p><em>答案</em>' + texOne(ctx, c.answer) + '</p>' : '')
            + (c.trap ? '<p><em>错因</em>' + esc(c.trap) + '</p>' : '')
            + (c.solution ? '<p><em>解析</em>' + tex(ctx, shortText(c.solution, 600)) + '</p>' : '')
            + '</div>' : '')
          + '</div></div>'
      }).join('') + '</div>'
      if (cands.length > 160) body += '<p class="vf-more">仅列出前 160 条，请用搜索继续缩小范围。</p>'
    }
    /* 首次使用引导：全站只出现一次（ctx.keep 记忆），三步讲清「工厂在干嘛」 */
    let guide = ''
    if (!S.benchGuide && !db.lineages.length && !db.staged.length) {
      guide = '<div class="vf-card vf-guide"><div class="vf-card-h"><b>三步开一家变式分店</b><em>HOW IT WORKS</em>'
        + '<button class="vf-btn sm ghost" data-act="guide-ok">知道了</button></div>'
        + '<div class="vf-gsteps">'
        + '<div class="vf-gstep"><i>1</i><b>选题</b><span>错题本 / 题库 / 我的卷三源任选，勾选母题送进熔炉；也可以手填一道刚把你绊倒的题。</span></div>'
        + '<div class="vf-gstep"><i>2</i><b>开炉</b><span>勾几种变式策略（换数/换壳/升阶/降阶/逆问/靶向/扰支），AI 一炉出齐同考点不同脸的题；逐张留用或弃用，疑似换皮会自动标出。</span></div>'
        + '<div class="vf-gstep"><i>3</i><b>成卷</b><span>留用的题打包成卷（走站内唯一落库口），直接跳做题；交卷后成绩自动回流工厂账本。</span></div>'
        + '</div></div>'
    }
    env.stage.innerHTML = guide + '<div class="vf-card">' + head + '</div>' + '<div class="vf-card">' + body + '</div>' + renderTray(env)
  }

  /* 熔炉托盘：bench/forge 共用一份渲染 */
  function renderTray(env) {
    let ctx = env.ctx, db = env.db, S = env.S
    let items = db.staged.map(function (st) {
      return '<div class="vf-trayitem' + (S.traySel === st.id ? ' sel' : '') + '">'
        + '<button class="vf-tpick" data-act="tray-sel" data-id="' + esc(st.id) + '">' + (S.traySel === st.id ? '◉' : '○') + '</button>'
        + '<div class="vf-tmain" data-act="tray-open" data-id="' + esc(st.id) + '">'
        + '<b>' + texOne(ctx, shortText(st.stem, 50)) + '</b>'
        + '<span>' + esc(st.subject) + (st.trap ? ' · 坑：' + esc(shortText(st.trap, 24)) : '') + '</span></div>'
        + '<button class="vf-xbtn" data-act="tray-del" data-id="' + esc(st.id) + '" title="移出托盘">×</button>'
        + '</div>'
    }).join('')
    return '<div class="vf-tray' + (db.staged.length ? '' : ' empty') + '">'
      + '<div class="vf-tray-h"><b>熔炉托盘</b><em>' + db.staged.length + ' / ' + MAX_STAGED + '</em>'
      + (db.staged.length ? '<button class="vf-btn sm ghost" data-act="tray-clear">清空</button>' : '')
      + '</div>'
      + (db.staged.length ? '<div class="vf-traylist">' + items + '</div>'
        : '<p class="vf-hint">在「选题台」勾选母题送进来；一道母题 ≈ 一组可对比着练的变式。</p>')
      + '</div>'
  }

/* c6: 熔炉视图（控制台 + 筛选 + 谱系卡 + 变式卡） */
  function renderForge(env) {
    let ctx = env.ctx, db = env.db, S = env.S
    /* ---- 开炉控制台 ---- */
    let stratChips = STRATS.map(function (st) {
      let on = S.forge.strats.indexOf(st.k) >= 0
      return '<button class="vf-schip c-' + st.c + (on ? ' on' : '') + '" aria-pressed="' + (on ? 'true' : 'false') + '" data-act="forge-strat" data-k="' + st.k + '" title="' + esc(st.why) + '">'
        + esc(st.name) + (st.onlyChoice ? '<i class="vf-lock" title="仅选择题可用">◇</i>' : '') + '</button>'
    }).join('')
    let runBtn = ''
    if (S.forge.running) {
      runBtn = '<div class="vf-runbar"><div class="vf-prog"><b style="width:'
        + Math.round((S.forge.done / Math.max(1, S.forge.total)) * 100) + '%"></b></div>'
        + '<span>' + S.forge.done + ' / ' + S.forge.total + ' · ' + esc(S.forge.phase || '开炉中') + '</span>'
        + '<button class="vf-btn sm danger" data-act="forge-cancel">中断</button></div>'
    } else {
      let canRun = db.staged.length > 0
      runBtn = '<button class="vf-btn primary' + (canRun ? '' : ' dis') + '" data-act="forge-run"'
        + (canRun ? '' : ' disabled') + '><i>' + icon(ctx, 'cpBolt') + '</i>开炉</button>'
        + '<span class="vf-hint">' + (canRun ? '对托盘中 ' + db.staged.length + ' 道母题逐个出变式' : '托盘是空的 —— 先去选题台送母题进来') + '</span>'
    }
    let aiNote = aiOk(ctx) ? '' : '<div class="vf-alert warn">未配置 AI：熔炉只会生成「空白骨架变式」——策略说明与选项预填仍在，题干/答案要你自己写。配置 AI 后同一批母题可重开炉。'
      + '<button class="vf-btn sm ghost" data-act="go-ai-settings" style="margin-left:10px">去设置</button></div>'
    let undoStrip = (S.lastBatch && !S.forge.running) ? '<div class="vf-undostrip"><i>' + icon(ctx, 'cpUndo') + '</i>'
      + '上一炉：' + S.lastBatch.ids.length + ' 条谱系（刚生成）'
      + '<button class="vf-btn sm ghost" data-act="undo-batch">撤销这炉</button></div>' : ''
    let consoleHtml = '<div class="vf-card">'
      + '<div class="vf-card-h"><b>开炉控制台</b><em>FORGE CONSOLE</em></div>'
      + aiNote
      + '<div class="vf-srow">' + stratChips + '</div>'
      + '<div class="vf-rrow">'
      + '<label class="vf-inl">每题变式数<input class="vf-input vf-num" type="number" min="1" max="12" data-act="forge-count" value="' + S.forge.count + '"></label>'
      + '<label class="vf-inl">单炉上限<input class="vf-input vf-num" type="number" min="1" max="12" data-act="forge-cap" value="' + S.forge.cap + '"></label>'
      + runBtn
      + '</div>' + undoStrip
      + '<p class="vf-quiet">「单炉上限」= 一道母题档案里最多留多少变式（含历史）；超出会挤掉最早的「新出炉」条目，留用/弃用的永不被挤。</p>'
      + '</div>'

    /* ---- 谱系卡列表：先按筛选/搜索收敛，再截最近 4 条 ---- */
    let f = S.forge.filter
    let fq = String(f.q || '').trim().toLowerCase()
    let visible = db.lineages.filter(function (L) {
      if (f.strat !== 'all' && !(L.variants || []).some(function (v) { return v.strategy === f.strat })) return false
      if (f.status === 'kept' && !(L.variants || []).some(function (v) { return v.status === 'kept' })) return false
      if (f.status === 'fresh' && !(L.variants || []).some(function (v) { return v.status === 'new' })) return false
      if (f.status === 'packed' && !L.paperId) return false
      if (f.status === 'review' && !(L.variants || []).some(function (v) { return quickIssues(v, L).length && !v.reviewed && v.status !== 'drop' })) return false
      if (fq) {
        let hitSrc = fingerprint(L.stem + ' ' + (L.point || '') + ' ' + (L.trap || '')).indexOf(fingerprint(fq)) >= 0
        let hitVar = (L.variants || []).some(function (v) { return String(v.stem || '').toLowerCase().indexOf(fq) >= 0 })
        if (!hitSrc && !hitVar) return false
      }
      return true
    })
    let fbar = '<div class="vf-filter">'
      + '<input class="vf-input vf-search" data-act="forge-q" placeholder="搜母题/变式题干…" value="' + esc(f.q) + '">'
      + '<select class="vf-input vf-sel" data-act="forge-fstrat">'
      + '<option value="all">全部策略</option>'
      + STRATS.map(function (s) { return '<option value="' + s.k + '"' + (f.strat === s.k ? ' selected' : '') + '>' + esc(s.name) + '</option>' }).join('')
      + '</select>'
      + '<select class="vf-input vf-sel" data-act="forge-fstat">'
      + '<option value="all">' + visible.length + ' / ' + db.lineages.length + ' 条谱系</option>'
      + '<option value="kept"' + (f.status === 'kept' ? ' selected' : '') + '>含留用</option>'
      + '<option value="fresh"' + (f.status === 'fresh' ? ' selected' : '') + '>含待处理</option>'
      + '<option value="review"' + (f.status === 'review' ? ' selected' : '') + '>待复核</option>'
      + '<option value="packed"' + (f.status === 'packed' ? ' selected' : '') + '>已成卷</option>'
      + '</select>'
      + '</div>'
    let list = S.forge.showAll ? visible : visible.slice(0, 4)
    let cards = ''
    if (!db.lineages.length) {
      cards = emptyBox('还没有开过炉', '托盘放好母题、勾上策略，按下「开炉」。')
    } else if (!visible.length) {
      cards = emptyBox('筛选后没有谱系', '换个条件，或展开全部档案。', '<button class="vf-btn" data-act="forge-showall">展开全部</button>')
    } else {
      cards = list.map(function (L) { return lineageCard(env, L) }).join('')
      if (visible.length > 4 || S.forge.showAll) {
        cards += '<div class="vf-acts"><button class="vf-btn ghost" data-act="forge-showall">'
          + (S.forge.showAll ? '只看前 4 条' : '展开全部 ' + visible.length + ' 条（共 ' + db.lineages.length + ' 条谱系）') + '</button></div>'
      }
    }
    env.stage.innerHTML = consoleHtml
      + '<div class="vf-card"><div class="vf-card-h"><b>变式档案</b><em>LINEAGES</em>'
      + '<button class="vf-btn sm ghost" data-act="go-atlas">谱系图 →</button></div>'
      + fbar + cards + '</div>'
      + renderTray(env)
  }

  /* 单个谱系卡：母题抬头 + 对照原题折叠 + 变式列表 + 卡级动作 */
  function lineageCard(env, L) {
    let ctx = env.ctx
    let st = lineageStat(L)
    let originTag = L.origin === 'skeleton' ? '<span class="vf-origin sk">骨架</span>' : ''
    let auditTag = L.auditedAt ? '<span class="vf-origin ok">已质检 ' + fmtDate(L.auditedAt.slice(0, 10)) + '</span>' : ''
    let head = '<div class="vf-lhead">'
      + '<b>' + texOne(ctx, shortText(L.stem, 60)) + '</b>'
      + '<span>' + esc(L.subject) + (L.point ? ' · ' + esc(shortText(L.point, 20)) : '') + (L.trap ? ' · 坑：' + esc(shortText(L.trap, 30)) : '') + '</span>'
      + originTag + auditTag
      + '<i class="vf-lnum">' + st.kept + '留 / ' + st.total + '出' + (L.paperId ? ' · 已卷' : '') + '</i>'
      + '</div>'
    /* 对照原题：判断「变得到不到位」必须能一眼比对 */
    let cmp = '<details class="vf-cmp"><summary>对照原题</summary>'
      + '<div class="vf-cmp-body"><div class="vf-vstem">' + tex(ctx, L.stem) + '</div>'
      + (L.options && L.options.length ? '<div class="vf-copts">' + L.options.map(function (o, j) { return '<i>' + 'ABCD'[j] + '.</i><span>' + texOne(ctx, o) + '</span>' }).join('') + '</div>' : '')
      + (L.answer ? '<p class="vf-cmp-ans"><em>原答案</em> ' + texOne(ctx, L.answer) + '</p>' : '')
      + (L.trap ? '<p class="vf-cmp-ans"><em>原错因</em> ' + esc(L.trap) + '</p>' : '')
      + '</div></details>'
    let rows = (L.variants || []).map(function (v) { return variantCard(env, L, v) }).join('')
    if (!(L.variants || []).length) rows = '<p class="vf-more">还没变式 —— <a class="vf-lnk" data-act="l-forge" data-id="' + esc(L.id) + '">直接对它开一炉</a>。</p>'
    /* 骨架待办横幅：无 AI 路径的收尾提示，一点直达第一张空白题的编辑（焦点自动进题干框） */
    let skelN = (L.variants || []).filter(function (v) { return v.status !== 'drop' && !String(v.stem || '').trim() }).length
    let skelBar = skelN ? '<button class="vf-skeldots" data-act="l-fillskel" data-id="' + esc(L.id) + '"><i>◌</i>骨架还差 ' + skelN + ' 道题干没填 · 点此补第一道</button>' : ''
    let acts = '<div class="vf-lacts">'
      + '<button class="vf-btn sm" data-act="l-audit" data-id="' + esc(L.id) + '"><i>' + icon(ctx, 'cpCheck') + '</i>自检答案自洽</button>'
      + '<button class="vf-btn sm ghost" data-act="l-forge" data-id="' + esc(L.id) + '">再开一炉</button>'
      + '<button class="vf-btn sm ghost" data-act="l-keepall" data-id="' + esc(L.id) + '">全部留用</button>'
      + '<button class="vf-btn sm danger" data-act="l-del" data-id="' + esc(L.id) + '">删谱系</button>'
      + '</div>'
    return '<div class="vf-lineage' + (L.paperId ? ' packed' : '') + '">' + head + cmp + skelBar + '<div class="vf-vlist">' + rows + '</div>' + acts + '</div>'
  }

  /* 变式卡：默认展示（Tex 渲染），点编辑就地切 textarea；留/弃即时写库 */
  function variantCard(env, L, v) {
    let ctx = env.ctx, S = env.S
    if (S.edit === v.id) return variantEdit(env, L, v)
    let optHtml = (v.options && v.options.length)
      ? '<div class="vf-copts">' + v.options.map(function (o, j) { return '<i>' + 'ABCD'[j] + '.</i><span>' + texOne(ctx, o) + '</span>' }).join('') + '</div>'
      : ''
    let bodyHtml = String(v.stem || '').trim()
      ? '<div class="vf-vstem">' + tex(ctx, v.stem) + '</div>' + optHtml
      : '<div class="vf-vstem skel" data-act="v-edit" data-id="' + esc(v.id) + '" title="点开就地补全">（空白骨架 —— 点这里把题干/答案补全）</div>'
    let chips = stratChip(v.strategy, true) + diffChip(v.diff) + statusTag(v)
      + (v.skin ? '<span class="vf-skinchip" title="' + esc(v.note || '与母题几乎同文同数') + '">疑似换皮 ' + Math.round(v.similar * 100) + '%</span>' : '')
      + (v.note && !v.skin ? '<span class="vf-notechip">' + esc(shortText(v.note, 46)) + '</span>' : '')
      + (function () {
        let iss = quickIssues(v, L)
        if (!iss.length) return ''
        return '<span class="vf-qchip' + (v.reviewed ? ' ok' : '') + '" title="本地快检：' + esc(iss.map(issueLabel).join(' / ')) + '">'
          + (v.reviewed ? '复核已过 · ' : '快检：') + esc(iss.map(issueLabel).join(' / ')) + '</span>'
      })()
    let fold = (v.answer || v.solution || v.trap || v.changeNote)
      ? '<details class="vf-fold"><summary>答案 / 解析 / 变动点</summary>'
      + (v.changeNote ? '<p><em>改了什么</em> ' + esc(v.changeNote) + '</p>' : '')
      + (v.answer ? '<p><em>答案</em> ' + texOne(ctx, v.answer) + '</p>' : '')
      + (v.solution ? '<p><em>解析</em> ' + tex(ctx, v.solution) + '</p>' : '')
      + (v.trap ? '<p><em>陷阱</em> ' + esc(v.trap) + '</p>' : '')
      + '</details>' : ''
    return '<div class="vf-vrow ' + v.status + (v.skin ? ' skin' : '') + '">'
      + '<div class="vf-vhead">' + chips + '</div>'
      + bodyHtml + fold
      + '<div class="vf-vacts">'
      + '<button class="vf-btn sm' + (v.status === 'kept' ? ' primary' : '') + '" data-act="v-keep" data-id="' + esc(v.id) + '">' + (v.status === 'kept' ? '已留用 ✓' : '留用') + '</button>'
      + '<button class="vf-btn sm ghost' + (v.status === 'drop' ? ' danger' : '') + '" data-act="v-drop" data-id="' + esc(v.id) + '">' + (v.status === 'drop' ? '已弃用' : '弃用') + '</button>'
      + '<button class="vf-btn sm ghost" data-act="v-edit" data-id="' + esc(v.id) + '">编辑</button>'
      + '<button class="vf-btn sm ghost" data-act="v-copy" data-id="' + esc(v.id) + '" title="复制题干+选项+答案+解析到剪贴板">复制</button>'
      + (quickIssues(v, L).length ? '<button class="vf-btn sm' + (v.reviewed ? ' ghost' : '') + '" data-act="v-review" data-id="' + esc(v.id) + '">' + (v.reviewed ? '复核通过 ✓' : '复核') + '</button>' : '')
      + '</div></div>'
  }

  function variantEdit(env, L, v) {
    return '<div class="vf-vrow editing">'
      + '<div class="vf-vhead">' + stratChip(v.strategy, true)
      + '<select class="vf-input vf-sel" data-e="diff">'
      + DIFFS.map(function (d) { return '<option value="' + d.k + '"' + (v.diff === d.k ? ' selected' : '') + '>' + esc(d.name) + '</option>' }).join('')
      + '</select></div>'
      + '<textarea class="vf-input vf-ta" rows="3" data-e="stem" data-af="1" placeholder="题干（公式用 $…$）">' + esc(v.stem) + '</textarea>'
      + '<textarea class="vf-input vf-ta" rows="4" data-e="options" placeholder="选项每行一个（非选择题留空）">' + esc((v.options || []).join('\n')) + '</textarea>'
      + '<input class="vf-input" data-e="answer" placeholder="答案" value="' + esc(v.answer) + '" style="margin-bottom:8px">'
      + '<textarea class="vf-input vf-ta" rows="2" data-e="solution" placeholder="解析">' + esc(v.solution) + '</textarea>'
      + '<input class="vf-input" data-e="trap" placeholder="本题陷阱" value="' + esc(v.trap) + '" style="margin-bottom:8px">'
      + '<div class="vf-vacts"><button class="vf-btn sm primary" data-act="v-save" data-id="' + esc(v.id) + '">保存</button>'
      + '<button class="vf-btn sm ghost" data-act="v-cancel">取消</button>'
      + '<button class="vf-btn sm danger" data-act="v-del" data-id="' + esc(v.id) + '">删这道</button></div>'
      + '</div>'
  }

/* c7: 谱系图 + 打包（含卷面预览/可打印文稿） + 档案 */
  /* 布局判据纯函数：角度 = -90° + i·360/n，半径恒定、节点大小只由难度决定 ——
   * 同一份数据永远画同一张图，刷新/切主题都不抖（站内晶体图同款纪律）。 */
  function atlasLayout(L, W, H) {
    let vs = L.variants || []
    let n = vs.length
    let cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.36
    return vs.map(function (v, i) {
      let ang = (-90 + (n > 0 ? (i * 360 / n) : 0)) * Math.PI / 180
      return {
        v: v, i: i,
        x: cx + R * Math.cos(ang),
        y: cy + R * Math.sin(ang),
        r: 12 + diffOf(v.diff).d * 3
      }
    })
  }
  function renderAtlas(env) {
    let ctx = env.ctx, db = env.db, S = env.S
    if (!db.lineages.length) {
      env.stage.innerHTML = '<div class="vf-card">' + emptyBox('谱系图要等有炉次', '开一炉之后，这里把母题和它所有的变式画成一张星形图。')
        + '<div class="vf-acts"><button class="vf-btn" data-act="go-bench">去选题台</button><button class="vf-btn" data-act="go-forge">去熔炉</button></div></div>'
      return
    }
    let L = null
    for (let i = 0; i < db.lineages.length; i++) if (db.lineages[i].id === S.atlasSel) { L = db.lineages[i]; break }
    if (!L) { L = db.lineages[0]; S.atlasSel = L.id }
    let st = lineageStat(L)
    let W = 640, H = 420
    let nodes = atlasLayout(L, W, H)
    let svg = '<svg class="vf-atlas" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="变式谱系图">'
      + '<circle cx="' + (W / 2) + '" cy="' + (H / 2) + '" r="' + Math.round(Math.min(W, H) * 0.36) + '" class="vf-orbit"/>'
      + nodes.map(function (nd) {
        let sd = stratOf(nd.v.strategy) || STRATS[0]
        let cls = 'vf-node c-' + sd.c + ' st-' + nd.v.status + (S.atlasVid === nd.v.id ? ' sel' : '')
        return '<line x1="' + (W / 2) + '" y1="' + (H / 2) + '" x2="' + Math.round(nd.x) + '" y2="' + Math.round(nd.y) + '" class="vf-spoke' + (nd.v.status === 'drop' ? ' drop' : '') + '"/>'
          + '<g class="' + cls + '" data-act="atlas-sel" data-vid="' + esc(nd.v.id) + '">'
          + '<title>' + esc(sd.name + ' · ' + diffOf(nd.v.diff).name + ' · ' + (nd.v.status === 'kept' ? '留用' : nd.v.status === 'drop' ? '弃用' : '新出炉')) + '</title>'
          + '<circle cx="' + Math.round(nd.x) + '" cy="' + Math.round(nd.y) + '" r="' + nd.r + '"/>'
          + '<text x="' + Math.round(nd.x) + '" y="' + (Math.round(nd.y) + 4) + '">' + (nd.i + 1) + '</text>'
          + (nd.v.status === 'kept' ? '<circle class="vf-keepering" cx="' + Math.round(nd.x) + '" cy="' + Math.round(nd.y) + '" r="' + (nd.r + 4) + '"/>' : '')
          + (nd.v.skin ? '<text class="vf-skinmark" x="' + (Math.round(nd.x) + nd.r - 3) + '" y="' + (Math.round(nd.y) - nd.r + 6) + '">!</text>' : '')
          + '</g>'
      }).join('')
      + '<g class="vf-sun"><circle cx="' + (W / 2) + '" cy="' + (H / 2) + '" r="26"/>'
      + '<text x="' + (W / 2) + '" y="' + ((H / 2) + 5) + '">母题</text></g>'
      + '</svg>'
    let lcol = '<div class="vf-alist">' + db.lineages.map(function (x) {
      let s = lineageStat(x)
      return '<button class="vf-alitem' + (x.id === L.id ? ' on' : '') + '" data-act="atlas-go" data-id="' + esc(x.id) + '">'
        + '<b>' + texOne(ctx, shortText(x.stem, 30)) + '</b><span>' + esc(x.subject) + ' · ' + s.kept + '/' + s.total + (x.paperId ? ' 已卷' : '') + '</span></button>'
    }).join('') + '</div>'
    let legend = '<div class="vf-legend">' + STRATS.map(function (s) {
      return '<span><i class="c-' + s.c + '"></i>' + esc(s.name) + '</span>'
    }).join('') + '<span class="lg-st"><i class="k"></i>留用</span><span class="lg-st"><i class="n"></i>新出炉</span><span class="lg-st"><i class="d"></i>弃用</span></div>'
    let sel = null
    if (S.atlasVid) {
      for (let i = 0; i < (L.variants || []).length; i++) if (L.variants[i].id === S.atlasVid) { sel = L.variants[i]; break }
    }
    let detail = sel ? '<div class="vf-afocus"><div class="vf-card-h"><b>焦点变式 #' + ((L.variants.indexOf(sel) || 0) + 1) + '</b><em>' + esc((stratOf(sel.strategy) || STRATS[0]).name) + '</em></div>' + variantCard(env, L, sel) + '</div>'
      : '<p class="vf-hint" style="margin-top:14px">点一个卫星节点看处置面板。辐条灰虚线 = 已弃用；金环 = 留用；圈上「!」 = 疑似换皮。</p>'
    env.stage.innerHTML = '<div class="vf-card"><div class="vf-card-h"><b>变式谱系</b><em>CONSTELLATION · ' + st.kept + '/' + st.total + ' 留用</em>'
      + '<button class="vf-btn sm ghost" data-act="go-forge">回熔炉开新炉</button></div>'
      + '<div class="vf-atlaswrap">' + lcol + '<div class="vf-acanvas">' + svg + legend + '</div></div>'
      + detail + '</div>'
  }

  /* ============================================================
   * 打包：勾选留用 → 卷面预览 → 按科目拆卷 → PaperKit → 直达做题
   * ============================================================ */
  function renderPack(env) {
    let ctx = env.ctx, db = env.db, S = env.S
    let pool = keptPool(db)
    /* 卷记录与站内真实卷对账：用户在「我的题卷」删掉的卷，档案同步消失（诚实原则） */
    let realIds = {}
    try {
      (window.PaperKit && window.PaperKit.brief ? window.PaperKit.brief() : []).forEach(function (p) { realIds[p.id] = p })
    } catch (e) { /* 桥没挂时跳过对账 */ }
    if (window.PaperKit && window.PaperKit.brief) {
      let ghost = db.papers.filter(function (p) { return !realIds[p.id] })
      if (ghost.length) {
        db.papers = db.papers.filter(function (p) { return realIds[p.id] })
        db.lineages.forEach(function (L) {
          if (L.paperId && !realIds[L.paperId]) { L.paperId = ''; L.paperTitle = ''; L.packedAt = '' }
        })
        env.save()
      }
    }
    /* 首次进入默认全选未成卷的留用题 */
    if (!S.packInit) {
      pool.forEach(function (it) { if (!it.L.paperId) S.packSel.add(it.v.id) })
      S.packInit = true
    }
    /* 按母题谱系分组呈现 */
    let byL = {}
    pool.forEach(function (it) {
      if (!byL[it.L.id]) byL[it.L.id] = { L: it.L, items: [] }
      byL[it.L.id].items.push(it.v)
    })
    let groupsHtml = Object.keys(byL).map(function (lid) {
      let g = byL[lid]
      let sub = g.items.map(function (v) {
        let on = S.packSel.has(v.id)
        return '<label class="vf-pick' + (on ? ' on' : '') + '"><input type="checkbox" data-act="pack-tick" data-id="' + esc(v.id) + '"' + (on ? ' checked' : '') + '>'
          + '<span class="pv">' + stratChip(v.strategy, true) + diffChip(v.diff) + '</span>'
          + '<span class="ps">' + texOne(ctx, shortText(v.stem, 78)) + '</span>'
          + (quickIssues(v, g.L).length ? '<span class="vf-qchip' + (v.reviewed ? ' ok' : '') + '" title="成卷时会' + (v.reviewed ? '正常收录' : '跳过：疑点未复核') + '">' + (v.reviewed ? '复核✓' : '待复核') + '</span>' : '')
          + (g.L.paperId ? '<span class="vf-chip sm" title="这条谱系已组过卷,再勾会再生成一张新卷">已卷过</span>' : '') + '</label>'
      }).join('')
      return '<div class="vf-pgroup"><div class="vf-pgh"><b>' + texOne(ctx, shortText(g.L.stem, 46)) + '</b><em>' + esc(g.L.subject) + '</em></div>' + sub + '</div>'
    }).join('')
    let n = S.packSel.size
    let scorePer = S.pack.scorePer, perMin = S.pack.timePer
    /* 待复核（疑点未过审）：成卷闸会跳过它们，这里先亮出来并可直达复核 */
    let pendingN = 0
    pool.forEach(function (it) { if (!it.v.reviewed && quickIssues(it.v, it.L).length) pendingN++ })
    let consoleHtml = '<div class="vf-card"><div class="vf-card-h"><b>组卷参数</b><em>PACK CONSOLE</em></div>'
      + '<div class="vf-rrow">'
      + '<label class="vf-inl">卷名前缀<input class="vf-input" data-act="pack-title" placeholder="留空自动「变式卷 · 科目 · 日期」" value="' + esc(S.pack.title) + '"></label>'
      + '<label class="vf-inl">每题分值<input class="vf-input vf-num" type="number" min="1" max="100" data-act="pack-score" value="' + scorePer + '"></label>'
      + '<label class="vf-inl">单题限时(分)<input class="vf-input vf-num" type="number" min="1" max="60" data-act="pack-time" value="' + perMin + '"></label>'
      + '<label class="vf-inl" title="同科卷内先易后难,进入状态再爬坡"><input type="checkbox" data-act="pack-sort"' + (S.pack.sortEasy ? ' checked' : '') + '>由易到难</label>'
      + '</div>'
      + (pool.length ? '<div class="vf-acts"><button class="vf-btn sm ghost" data-act="pack-all">' + (n ? '全不选' : '全选中') + '</button><span class="vf-hint">' + pool.length + ' 道留用变式可选 · 已勾 ' + n + '</span></div>' : '')
      + '<div class="vf-acts">'
      + (n ? '<button class="vf-btn primary" data-act="pack-run"><i>' + icon(ctx, 'fileText') + '</i>生成 ' + Math.max(1, subjectSplit(S, db).length) + ' 张卷（' + n + ' 题 · ' + (n * scorePer) + ' 分 · ' + (n * perMin) + ' 分钟）</button>' : '')
      + (n ? '<button class="vf-btn" data-act="pack-preview">卷面预览</button>' : '')
      + (n ? '<button class="vf-btn ghost" data-act="pack-print">可打印文稿</button>' : '')
      + (pendingN ? '<button class="vf-btn sm ghost" data-act="go-review" title="快检有疑点且未复核，成卷时会被跳过">待复核 ' + pendingN + ' 道 →</button>' : '')
      + '<span class="vf-hint">' + (n ? ('跨科目自动按科目拆卷；只走站内唯一落库口 PaperKit，与「导入 JSON 卷」完全同判据。' + (pendingN ? ' 疑点题需先复核，否则本次会如实跳过。' : '')) : '先勾选留用变式。熔炉里点「留用」的题才会出现在这。') + '</span>'
      + '</div></div>'
    let bodyHtml = pool.length
      ? '<div class="vf-card"><div class="vf-card-h"><b>留用变式池</b><em>KEPT POOL · ' + pool.length + '</em></div>' + groupsHtml + '</div>'
      : '<div class="vf-card">' + emptyBox('还没有留用的变式', '熔炉里给中意的题点「留用」，它们就会出现在这里等着成卷。') + '</div>'
    /* 卷面预览：勾出来的草稿原样过一遍 PaperKit.parseJson（同判据预检），
     * 所见即所存 —— 预览用的判据就是入库用的判据，不留「预览挺美入库变样」的缝 */
    let previewHtml = ''
    if (S.packPreview && S.packPreview.drafts && S.packPreview.drafts.length) {
      let parse = null
      try {
        if (window.PaperKit && window.PaperKit.parseJson) {
          parse = window.PaperKit.parseJson(JSON.stringify({ papers: S.packPreview.drafts }))
        }
      } catch (e) { parse = null }
      previewHtml = '<div class="vf-card"><div class="vf-card-h"><b>卷面预览</b><em>PREVIEW · ' + S.packPreview.drafts.length + ' 张</em>'
        + '<button class="vf-btn sm ghost" data-act="preview-reveal">' + (S.packReveal ? '隐藏答案' : '显示答案') + '</button></div>'
        + (parse && !parse.ok ? '<div class="vf-alert danger">站内导入判据预检未过：' + esc(parse.error || '形状问题') + '</div>' : '')
        + (parse && parse.warnings && parse.warnings.length ? '<div class="vf-alert warn">判据提醒：' + parse.warnings.map(esc).join('；') + '</div>' : '')
        + S.packPreview.drafts.map(function (d) {
          return '<div class="vf-pvpaper"><div class="vf-pvhead"><b>' + esc(d.title) + '</b><span>' + esc(d.subject) + ' · ' + d.questions.length + ' 题 · ' + (d.totalScore || 0) + ' 分 · 限 ' + (d.timeLimit || 0) + ' 分</span></div>'
            + d.questions.map(function (q, qi) {
              let body = '<div class="vf-pvq"><i>' + (qi + 1) + '．</i><span>' + tex(ctx, q.stem)
                + (q.options ? '<span class="vf-pvopts">' + q.options.map(function (o, oi) { return '<em>' + 'ABCD'[oi] + '．</em>' + texOne(ctx, o) }).join('') + '</span>' : '')
                + '</span><s>' + (q.score || 0) + '分</s></div>'
              if (S.packReveal) body += '<div class="vf-pvans"><b>答案</b> ' + texOne(ctx, q.answer || '—')
                + (q.solution ? ' <b>解析</b> ' + tex(ctx, shortText(q.solution, 300)) : '')
                + (q.trap ? ' <b>坑</b> ' + esc(q.trap) : '') + '</div>'
              return body
            }).join('') + '</div>'
        }).join('') + '</div>'
    }
    /* 已生成的变式卷 */
    let papersHtml = ''
    if (db.papers.length) {
      papersHtml = '<div class="vf-card"><div class="vf-card-h"><b>我的变式卷</b><em>FORGED PAPERS</em></div>'
        + db.papers.map(function (p) {
          let rp = realIds[p.id]
          let gr = p.graded ? '<span class="vf-grade">' + p.graded.score + '/' + p.graded.total + (p.graded.total ? '（' + Math.round(p.graded.score / p.graded.total * 100) + '%）' : '') + '</span>' : '<span class="vf-grade todo">未交卷</span>'
          return '<div class="vf-prow"><div class="vf-pmain"><b>' + esc(p.title) + '</b>'
            + '<span>' + esc(p.subject) + ' · ' + p.count + ' 题 · ' + p.score + ' 分 · ' + fmtDate(String(p.createdAt).slice(0, 10)) + (rp && rp.completedAt ? ' · 已完成' : '') + '</span></div>'
            + gr
            + '<button class="vf-btn sm" data-act="paper-open" data-id="' + esc(p.id) + '">去重做</button>'
            + (p.graded && p.graded.total && p.graded.score / p.graded.total < 0.6
              ? '<button class="vf-btn sm ghost" data-act="l-retrain" data-id="' + esc(p.id) + '" title="得分率不过六：勾好靶向+降阶回熔炉再开一炉">靶向重炉</button>'
              : '')
            + '<button class="vf-btn sm ghost" data-act="paper-atlas" data-id="' + esc(p.id) + '">看谱系</button>'
            + '<button class="vf-btn sm danger" data-act="paper-del" data-id="' + esc(p.id) + '">删卷</button>'
            + '</div>'
        }).join('') + '</div>'
    }
    env.stage.innerHTML = consoleHtml + bodyHtml + previewHtml + papersHtml
  }

  /* ============================================================
   * 档案：账 + 预警 + 盘点 + 数据维护
   * ============================================================ */
  function distroRows(rows, max) {
    return rows.map(function (r) {
      return '<div class="vf-drow"><span class="dn">' + esc(r.name) + '</span>'
        + '<div class="dtrack"><b style="width:' + Math.round((r.n / max) * 100) + '%"></b></div>'
        + '<span class="dv">' + r.n + '</span></div>'
    }).join('')
  }
  function diffDist(db) {
    let m = {}
    DIFFS.forEach(function (d) { m[d.k] = 0 })
    db.lineages.forEach(function (L) {
      (L.variants || []).forEach(function (v) { if (v.status === 'kept') m[diffOf(v.diff).k]++ })
    })
    return DIFFS.map(function (d) { return { name: d.name, n: m[d.k] } })
  }
  function subjectDist(db) {
    let m = {}
    db.lineages.forEach(function (L) {
      (L.variants || []).forEach(function (v) {
        if (v.status !== 'kept') return
        let s = L.subject || '其他'
        m[s] = (m[s] || 0) + 1
      })
    })
    return Object.keys(m).map(function (k) { return { name: k, n: m[k] } })
      .sort(function (a, b) { return b.n - a.n }).slice(0, 8)
  }
  function renderStats(env) {
    let ctx = env.ctx, db = env.db
    let t = dbTotals(db)
    /* 疑点复核台账：本地快检命中的非弃用题里，已复核几道 */
    let revTotal = 0, revDone = 0
    db.lineages.forEach(function (L) {
      (L.variants || []).forEach(function (v) {
        if (v.status === 'drop' || !String(v.stem || '').trim()) return
        if (!quickIssues(v, L).length) return
        revTotal++
        if (v.reviewed) revDone++
      })
    })
    let days = last14(db)
    let maxBar = 1
    days.forEach(function (d) { maxBar = Math.max(maxBar, d.gen, d.keep) })
    let BW = 30, BH = 92
    let chart = '<svg class="vf-bars" viewBox="0 0 ' + (BW * 14) + ' ' + (BH + 26) + '" role="img" aria-label="近14天出题与留用">'
      + days.map(function (d, i) {
        let x = i * BW
        let gh = Math.round((d.gen / maxBar) * (BH - 22))
        let kh = Math.round((d.keep / maxBar) * (BH - 22))
        return '<g transform="translate(' + x + ',0)">'
          + '<rect class="gbar" x="' + 8 + '" y="' + (BH - 18 - gh) + '" width="' + 6 + '" height="' + Math.max(d.gen ? 2 : 0, gh) + '"/>'
          + '<rect class="kbar" x="' + 16 + '" y="' + (BH - 18 - kh) + '" width="' + 6 + '" height="' + Math.max(d.keep ? 2 : 0, kh) + '"/>'
          + (d.paper ? '<rect class="pbar" x="8" y="' + (BH - 12) + '" width="14" height="3"/>' : '')
          + '<text class="dlabel" x="15" y="' + (BH + 4) + '">' + (i % 2 === 0 ? String(+d.k.slice(8, 10)) : '') + '</text>'
          + '</g>'
      }).join('') + '</svg>'
      + '<p class="vf-hint" style="margin-top:4px"><i class="lg g"></i>生成 <i class="lg k"></i>留用 <i class="lg p"></i>成卷</p>'
    let sr = strategyReport(db)
    let stratHtml = sr.map(function (r) {
      let w = Math.round(r.rate * 100)
      return '<div class="vf-srow2' + (r.warn ? ' warn' : '') + '"><span class="nm">' + stratChip(r.k, true) + '</span>'
        + '<div class="track"><b style="width:' + w + '%"></b></div>'
        + '<span class="num">' + r.keep + ' / ' + r.gen + ' = ' + (r.gen ? pctStr(r.keep, r.gen) : '—') + (r.warn ? ' · 质量预警' : '') + '</span>'
        + (r.warn ? '<button class="vf-btn sm ghost" data-act="strat-mute" data-k="' + r.k + '" title="从开炉组合里停用这一路">少勾这路</button>' : '')
        + '</div>'
    }).join('')
    let dd = diffDist(db), sd = subjectDist(db)
    let dmax = 1
    dd.concat(sd).forEach(function (r) { dmax = Math.max(dmax, r.n) })
    let wp = weakPoints(db)
    let wpHtml = wp.length ? wp.map(function (x, i) {
      return '<div class="vf-wprow"><i>' + (i + 1) + '</i><span class="w">' + esc(x.trap) + '</span><span class="c">' + x.src + ' 次母题 · ' + x.kept + ' 变式已留用</span></div>'
    }).join('') : '<p class="vf-more">还没有带「易错点」的母题 —— 送母题进炉时把当时错在哪写上，这里就能长出你的坑位榜。</p>'
    let kp = db.papers.filter(function (p) { return p.graded })
    let kpHtml = kp.length ? '<div class="vf-card"><div class="vf-card-h"><b>交卷回流</b><em>GRADED FLOW</em></div>'
      + kp.map(function (p) {
        return '<div class="vf-prow plain"><div class="vf-pmain"><b>' + esc(p.title) + '</b><span>' + esc(p.subject) + ' · ' + p.count + ' 题</span></div>'
          + '<span class="vf-grade">' + p.graded.score + '/' + p.graded.total + '（' + pctStr(p.graded.score, p.graded.total) + '）</span></div>'
      }).join('') + '</div>' : ''
    env.stage.innerHTML = '<div class="vf-card"><div class="vf-card-h"><b>工厂账本</b><em>FACTORY LEDGER</em></div>'
      + '<div class="vf-kgrid">'
      + kpiCard(String(t.src), '母题谱系') + kpiCard(String(t.gen), '生成变式')
      + kpiCard(pctStr(t.kept, t.gen), '总体留用率', t.gen >= 10 && t.keepRate < 0.4 ? 'warn' : '')
      + kpiCard(String(t.papers), '变式卷')
      + kpiCard(revDone + ' / ' + revTotal, '疑点复核', revTotal > revDone ? 'warn' : '')
      + kpiCard(t.graded ? pctStr(Math.round(t.scoreRate * 100), 100) : '—', '交卷得分率')
      + '</div>' + chart + '</div>'
      + '<div class="vf-card"><div class="vf-card-h"><b>策略质量账</b><em>STRATEGY YIELD</em></div>'
      + stratHtml
      + '<p class="vf-quiet">留用率 = 该策略产出的变式被你点「留用」的比例。某路长期 &lt;40% 会亮预警 —— 点「少勾这路」当场从开炉组合停用，下一炉就不再浪费额度和 token。</p></div>'
      + '<div class="vf-card"><div class="vf-card-h"><b>留用库存盘点</b><em>STOCKTAKING</em></div>'
      + '<div class="vf-two">'
      + '<div><i class="sub">按难度</i><div class="vf-distro">' + distroRows(dd, dmax) + '</div></div>'
      + '<div><i class="sub">按科目</i>' + (sd.length ? '<div class="vf-distro subj">' + distroRows(sd, dmax) + '</div>' : '<p class="vf-more">暂无留用库存。</p>') + '</div>'
      + '</div></div>'
      + '<div class="vf-card"><div class="vf-card-h"><b>你的坑位榜</b><em>TRAP HEAT</em></div>' + wpHtml + '</div>'
      + kpHtml
      + '<div class="vf-card"><div class="vf-card-h"><b>数据维护</b><em>DATA OPS</em></div>'
      + '<div class="vf-acts">'
      + '<button class="vf-btn" data-act="st-export"><i>' + icon(ctx, 'cpDownload') + '</i>导出 JSON</button>'
      + '<button class="vf-btn" data-act="st-import">导入 JSON</button>'
      + '<button class="vf-btn" data-act="st-report">下载 MD 报告</button>'
      + '<button class="vf-btn danger" data-act="st-clear">清空档案</button>'
      + '</div>'
      + '<p class="vf-quiet">档案走 ctx.data 命名空间（随站内云同步）；导入按 id 去重合并 —— 换设备/回滚都从这两个按钮走，别手改 localStorage。</p>'
      + '</div>'
  }
  function kpiCard(v, l, cls) {
    return '<div class="vf-kc' + (cls ? ' ' + cls : '') + '"><b>' + esc(v) + '</b><i>' + esc(l) + '</i></div>'
  }
  /* Markdown 报告：纯函数（调试钩子暴露给单测直接打） */
  function buildReport(db) {
    let t = dbTotals(db)
    let out = ['# 变式题工厂 · 生产报告', '', '- 生成日期：' + dkey(new Date()),
      '- 母题谱系：' + t.src + ' ｜ 生成变式：' + t.gen + ' ｜ 留用：' + t.kept + '（' + pctStr(t.kept, t.gen) + '）',
      '- 成卷：' + t.papers + ' 张 ｜ 已交卷：' + t.graded + ' ｜ 得分率：' + (t.graded ? pctStr(Math.round(t.scoreRate * 100), 100) : '—'),
      '', '## 策略产出账', '', '| 策略 | 生成 | 留用 | 留用率 | 质量 |', '|---|---|---|---|---|']
    strategyReport(db).forEach(function (r) {
      out.push('| ' + r.name + ' | ' + r.gen + ' | ' + r.keep + ' | ' + (r.gen ? pctStr(r.keep, r.gen) : '—') + ' | ' + (r.warn ? '⚠ 预警' : '—') + ' |')
    })
    out.push('', '## 坑位榜（按母题易错点聚合）', '')
    weakPoints(db).forEach(function (x, i) {
      out.push((i + 1) + '. ' + x.trap + '（母题 ' + x.src + ' 次 / 留用变式 ' + x.kept + '）')
    })
    out.push('', '## 谱系明细', '')
    db.lineages.slice(0, 60).forEach(function (L, i) {
      let s = lineageStat(L)
      out.push('### ' + (i + 1) + '. ' + shortText(L.stem, 40) + '（' + L.subject + ' · ' + s.kept + '/' + s.total + ' 留用' + (L.paperTitle ? ' · 卷：' + L.paperTitle : '') + '）')
      ;(L.variants || []).forEach(function (v, j) {
        out.push('  ' + (j + 1) + ') ' + (v.status === 'kept' ? '✓' : v.status === 'drop' ? '✗' : '·') + ' '
          + (stratOf(v.strategy) ? stratOf(v.strategy).name : v.strategy) + ' / ' + diffOf(v.diff).name
          + (v.skin ? ' [疑似换皮]' : '') + '：' + shortText(v.stem, 60))
      })
      out.push('')
    })
    out.push('---', '', '由变式题工厂 v' + VERSION + ' 生成')
    return out.join('\n')
  }

/* c8: 壳层 mountShell（页眉 + 舞台 + dock + 动作总线 ACT + 生命周期） */
  function mountShell(el, ctx) {
    HOST_CTX = ctx
    let S = {
      view: 'bench',
      bench: { src: 'mistake', q: '', subj: 'all', pick: new Set(), exp: '', m: { subject: '', point: '', stem: '', options: [], answer: '', solution: '', trap: '' } },
      traySel: '',
      forge: { strats: ['numShift', 'ctxSwap', 'trapFocus'], count: 4, cap: 8, running: false, done: 0, total: 0, phase: '', handle: null, showAll: false, filter: { q: '', strat: 'all', status: 'all' } },
      edit: '', editDraft: null,
      atlasSel: '', atlasVid: '',
      packSel: new Set(), packInit: false,
      pack: { title: '', scorePer: 10, timePer: 3, sortEasy: false },
      packPreview: null, packReveal: false,
      benchGuide: false,
      lastBatch: null
    }
    let db = loadDb(ctx)
    ctx.__db = db /* forgeOne/bumpStrat 通过 ctx 摸同一份内存档案（挂载期内唯一写者） */
    try {
      let ks = ctx.keep.get('strats', null)
      if (Array.isArray(ks) && ks.length) S.forge.strats = ks.filter(function (k) { return !!stratOf(k) })
      let v = ctx.config('countPerRun'); if (v) S.forge.count = clamp(v, 1, MAX_VARIANTS)
      v = ctx.config('capPerSrc'); if (v) S.forge.cap = clamp(v, 1, MAX_VARIANTS)
      v = ctx.config('scorePerQ'); if (v) S.pack.scorePer = clamp(v, 1, 100)
      v = ctx.config('timePerQ'); if (v) S.pack.timePer = clamp(v, 1, 60)
      S.benchGuide = !!ctx.keep.get('guide', false)
      let sv = String(ctx.data('view') || '')
      for (let i = 0; i < VIEWS.length; i++) if (VIEWS[i].k === sv) S.view = sv
      /* 跨页直达：常驻面板「去打包」用 goTool(id, {view:'pack'}) 带参进来 */
      try {
        let pv = ctx.api.params()
        if (pv && pv.view) for (let i = 0; i < VIEWS.length; i++) if (VIEWS[i].k === String(pv.view)) S.view = String(pv.view)
      } catch (e) { /* 老站点没 params 就忽略 */ }
    } catch (e) { /* 配置读歪就用默认，不拦挂载 */ }

    /* ---- 骨架：页眉（常量，只建一次）+ 舞台 + dock ---- */
    el.innerHTML = ''
    let root = document.createElement('div')
    root.className = 'vf-root'
    root.innerHTML = ''
      + '<div class="vf-aura" aria-hidden="true"><i></i><i></i></div>'
      + '<header class="vf-top" data-vf="top">'
      + '  <div class="vf-brand">'
      + '    <span class="vf-mark" aria-hidden="true">' + MARK_LG + '</span>'
      + '    <span class="vf-brandtx"><i class="vf-kicker">VARIANT · FORGE</i><b>变式题工厂<em>v' + esc(VERSION) + '</em></b></span>'
      + '  </div>'
      + '  <div class="vf-kpis" data-vf="kpis"></div>'
      + '  <div class="vf-topacts">'
      + '    <button class="vf-btn primary" data-act="quick"><i>' + icon(ctx, 'cpBolt') + '</i><span>快速开炉</span></button>'
      + '    <button class="vf-icobtn" data-act="st-gear" title="工厂账本与数据">' + icon(ctx, 'cpGear') + '</button>'
      + '  </div>'
      + '</header>'
      + '<main class="vf-stage" data-vf="stage"></main>'
      + '<nav class="vf-dockwrap"><div class="vf-dock" data-vf="dock">'
      + '  <i class="vf-dock-ind" data-vf="ind"></i>'
      + VIEWS.map(function (v, i) {
        return '<button class="vf-dock-item" data-view="' + v.k + '" title="' + esc(v.t.replace(/\s/g, '')) + '（键盘 ' + (i + 1) + '）">' + icon(ctx, v.ic) + '<em>' + esc(v.t) + '</em>'
          + (v.k === 'forge' ? '<i class="vf-dot" data-vf="fdot"></i>' : '')
          + (v.k === 'pack' ? '<i class="vf-dot pack" data-vf="pdot"></i>' : '') + '</button>'
      }).join('')
      + '</div></nav>'
    el.appendChild(root)

    /* ---- 页面级样式按需注入（manifest css 被宿主截 20000 字符；destroy 摘走） ---- */
    let styleEl = null
    if (!document.getElementById('vf-extra-style')) {
      styleEl = document.createElement('style')
      styleEl.id = 'vf-extra-style'
      styleEl.textContent = CSS_EXTRA
      document.head.appendChild(styleEl)
    }

    let topEl = root.querySelector('[data-vf="top"]')
    let kpisEl = root.querySelector('[data-vf="kpis"]')
    let stageEl = root.querySelector('[data-vf="stage"]')
    let dockEl = root.querySelector('[data-vf="dock"]')
    let indEl = root.querySelector('[data-vf="ind"]')
    let fdotEl = root.querySelector('[data-vf="fdot"]')
    let pdotEl = root.querySelector('[data-vf="pdot"]')

    let timers = []
    let destroyed = false
    function T(fn, ms) { let h = setTimeout(function () { if (!destroyed) fn() }, ms); timers.push(h); return h }
    /* 搜索防抖共用一只表：每键入重排一次，销毁时收表 */
    let _qT = { b: null, f: null }

    /* ---- 基础设施 ---- */
    function toast(msg, type) { try { ctx.Toast.show(msg, type || 'info', 3600) } catch (e) { } }
    function save() { saveDb(ctx, db) }
    /* 勾选后同步筛选条：送炉按钮增/改/删、全选文案 —— 与 renderBench 首画共用 pickGoHtml 模板 */
    function syncPickBar() {
      let bar = stageEl.querySelector('.vf-filter')
      if (!bar) return
      let go = bar.querySelector('[data-act="bench-pickgo"]')
      if (!S.bench.pick.size) { if (go) go.remove() }
      else if (go) go.outerHTML = pickGoHtml(S.bench.pick.size)
      else bar.insertAdjacentHTML('beforeend', pickGoHtml(S.bench.pick.size))
      let all = bar.querySelector('[data-act="bench-all"]')
      if (all) all.textContent = S.bench.pick.size ? '全部取消' : '本页全选'
    }
    function findL(id) {
      for (let i = 0; i < db.lineages.length; i++) if (db.lineages[i].id === id) return db.lineages[i]
      return null
    }
    function findV(vid) {
      for (let i = 0; i < db.lineages.length; i++) {
        let vs = db.lineages[i].variants || []
        for (let j = 0; j < vs.length; j++) if (vs[j].id === vid) return { L: db.lineages[i], v: vs[j] }
      }
      return null
    }

    /* ---- KPI 与 dock ---- */
    function updKpis() {
      let t = dbTotals(db)
      let d = db.day[todayKey()] || { gen: 0, keep: 0, paper: 0 }
      kpisEl.innerHTML =
        '<span class="vf-kpi"><b>' + db.staged.length + '</b><i>待熔母题</i></span>'
        + '<span class="vf-kpi' + (d.keep ? ' ok' : '') + '"><b>' + d.keep + '</b><i>今日留用</i></span>'
        + '<span class="vf-kpi"><b>' + t.papers + '</b><i>变式卷</i></span>'
      if (fdotEl) fdotEl.className = 'vf-dot' + (db.staged.length && S.view !== 'forge' ? ' on' : '')
      if (pdotEl) pdotEl.className = 'vf-dot pack' + (keptPool(db).some(function (it) { return !it.L.paperId }) && S.view !== 'pack' ? ' on' : '')
    }
    function updDock() {
      for (let i = 0; i < VIEWS.length; i++) if (VIEWS[i].k === S.view) {
        let btn = dockEl.children[1 + i]
        if (btn) {
          indEl.style.transform = 'translateX(' + btn.offsetLeft + 'px)'
          indEl.style.width = btn.offsetWidth + 'px'
        }
        break
      }
      let bs = dockEl.querySelectorAll('.vf-dock-item')
      for (let i = 0; i < bs.length; i++) bs[i].className = 'vf-dock-item' + (VIEWS[i].k === S.view ? ' on' : '')
    }

    /* ---- 路由 ---- */
    let RENDER = { bench: renderBench, forge: renderForge, atlas: renderAtlas, pack: renderPack, stats: renderStats }
    /* 上一次渲染的视图：区分「切视图」与「原地重画」,前者才重放入场动画 */
    let lastView = null
    function go(v) {
      if (!RENDER[v]) v = 'bench'
      S.view = v
      try { ctx.data('view', v) } catch (e) { }
      render()
    }
    function render() {
      if (destroyed) return
      let env = { ctx: ctx, S: S, db: db, stage: stageEl, save: save, go: go, rerender: render, toast: toast, T: T }
      env.trayCount = function () { return db.staged.length }
      try {
        RENDER[S.view](env)
      } catch (e) {
        stageEl.innerHTML = '<div class="vf-card"><div class="vf-alert danger">视图渲染出错：' + esc(String((e && e.message) || e)) + '。</div>'
          + '<p class="vf-quiet">数据未受影响（写库都在动作层）。可切别的视图继续；反复出现请把「档案 → 导出 JSON」发给开发者。</p></div>'
      }
      updKpis(); updDock()
      /* 视图真的切换才重放入场动画（0.65s 后摘标记）；同视图原地重画保持静止 */
      if (S.view !== lastView) {
        lastView = S.view
        stageEl.classList.add('vf-enter')
        T(function () { stageEl.classList.remove('vf-enter') }, 650)
      }
      /* 编辑表单首开：焦点进题干框、光标到文本尾 —— 「点开即写」,不多那一次点击 */
      if (S.justFocus) {
        S.justFocus = false
        let af = stageEl.querySelector('[data-af]')
        if (af) {
          try {
            /* 先把表单拉进视口中央再聚焦：长谱系里编辑框常在下缘外 */
            if (af.scrollIntoView) af.scrollIntoView({ block: 'center' })
            af.focus()
            if (af.setSelectionRange) { let n = af.value.length; af.setSelectionRange(n, n) }
          } catch (e) { }
        }
      }
    }

    /* ============================================================
     * 动作总线 ACT（click 委托；data-act 名点与 c5/c6/c7 视图严格对齐）
     * ============================================================ */
    let ACT = {
      /* ---- 页眉 ---- */
      'quick': function () { if (db.staged.length) go('forge'); else { go('bench'); toast('先挑一道母题：错题本/题库/我的卷三源任选，或手填', 'info') } },
      'st-gear': function () { go('stats') },
      'go-bench': function () { go('bench') },
      'go-forge': function () { go('forge') },
      'go-atlas': function () { go('atlas') },
      'go-pack': function () { go('pack') },

      /* ---- 首次引导 ---- */
      'guide-ok': function () {
        S.benchGuide = true
        try { ctx.keep.set('guide', 1) } catch (e) { }
        render()
      },

      /* ---- 选题台 ---- */
      'bench-src': function (t) { S.bench.src = t.dataset.v || 'mistake'; S.bench.exp = ''; if (S.bench.src !== 'manual') S.bench.pick = new Set(); render() },
      'bench-exp': function (t) { let k = t.dataset.key || ''; S.bench.exp = S.bench.exp === k ? '' : k; render() },
      'bench-pick': function (t) {
        let key = t.dataset.key
        let on = !S.bench.pick.has(key)
        if (on) {
          if (S.bench.pick.size + db.staged.length >= MAX_STAGED) { toast('托盘满 ' + MAX_STAGED + ' 道 —— 先开炉或清托盘', 'warn'); return }
          S.bench.pick.add(key)
        } else S.bench.pick.delete(key)
        /* 勾选是高频动作：只更新这一行与筛选条，不整列表重画（防闪烁、保滚动位置、不丢展开态） */
        let row = t.closest ? t.closest('.vf-cand') : null
        if (row) {
          if (on) row.classList.add('on'); else row.classList.remove('on')
          t.textContent = on ? '✓' : ''
        }
        syncPickBar()
      },
      'bench-all': function () {
        let cands = candList(ctx, S.bench.src)
        if (S.bench.subj !== 'all') cands = cands.filter(function (c) { return c.subject === S.bench.subj })
        let q = String(S.bench.q || '').trim()
        if (q) cands = cands.filter(function (c) { return String(c.stem).indexOf(q) >= 0 })
        if (S.bench.pick.size) S.bench.pick = new Set()
        else cands.slice(0, Math.max(0, MAX_STAGED - db.staged.length)).forEach(function (c) { S.bench.pick.add(c.key) })
        render()
      },
      'bench-manual': function () {
        let m = S.bench.m
        if (!String(m.stem || '').trim()) { toast('题干还没写', 'warn'); return }
        if (db.staged.length >= MAX_STAGED) { toast('托盘已满 ' + MAX_STAGED + ' 道', 'warn'); return }
        if (stemDup(db, m.stem)) { toast('同一道母题已经在托盘/档案里 —— 去熔炉找它即可', 'warn'); return }
        let mopts = (m.options || []).map(function (s) { return s.replace(/^\s*[A-Za-zＡＢＣＤａｂｃｄ]\s*[.、:：)]\s*/, '').trim() }).filter(Boolean)
        db.staged.push(normStaged({ srcType: 'manual', subject: m.subject || '数学', stem: m.stem, options: mopts.length >= 2 ? mopts : null, answer: m.answer, solution: m.solution, trap: m.trap, point: m.point }))
        save()
        S.bench.m = { subject: '', point: '', stem: '', options: [], answer: '', solution: '', trap: '' }
        toast('已送进熔炉托盘', 'ok')
        go('forge')
      },
      /* 批量送炉：勾选的候选一次性进托盘（重复跳、满员停，结果如实汇总） */
      'bench-pickgo': function () {
        if (!S.bench.pick.size) { toast('先在列表里勾选母题', 'warn'); return }
        let added = 0, dup = 0, miss = 0, full = false
        let byType = {}
        S.bench.pick.forEach(function (key) {
          if (full) return
          if (db.staged.length >= MAX_STAGED) { full = true; return }
          let type = String(key).split(':')[0]
          if (!byType[type]) byType[type] = candList(ctx, type)
          let c = null
          for (let i = 0; i < byType[type].length; i++) if (byType[type][i].key === key) { c = byType[type][i]; break }
          if (!c) { miss++; return }
          if (stemDup(db, c.stem)) { dup++; return }
          db.staged.push(normStaged({
            srcType: c.srcType, srcId: c.srcId, subject: c.subject, stem: c.stem,
            options: c.options ? c.options.slice() : null, answer: c.answer,
            solution: c.solution, trap: c.trap, point: c.point
          }))
          added++
        })
        S.bench.pick = new Set()
        save(); render()
        let msg = '已送进熔炉 ' + added + ' 道'
          + (dup ? '；' + dup + ' 道与档案重复被跳过' : '')
          + (miss ? '；' + miss + ' 道已不在列表' : '')
          + (full ? '；托盘已满 ' + MAX_STAGED + ' 道，先开炉再选' : '')
        toast(msg, added ? 'ok' : 'warn')
      },
      /* 未配置 AI 横幅里的直达按钮 */
      'go-ai-settings': function () {
        try { ctx.api.go('settings') } catch (e) { toast('跳转设置失败', 'warn') }
      },

      /* ---- 托盘 ---- */
      'tray-sel': function (t) { S.traySel = S.traySel === t.dataset.id ? '' : t.dataset.id; render() },
      'tray-open': function (t) { S.traySel = t.dataset.id; go('forge') },
      'tray-del': function (t) {
        db.staged = db.staged.filter(function (x) { return x.id !== t.dataset.id })
        if (S.traySel === t.dataset.id) S.traySel = ''
        save(); render()
      },
      'tray-clear': function () {
        ctx.api.confirm('清空熔炉托盘？', '只清待熔的母题列表，已开炉的谱系档案不受影响。', function () {
          db.staged = []; S.traySel = ''; save(); render(); toast('托盘已清', 'info')
        }, false)
      },

      /* ---- 熔炉 ---- */
      'forge-strat': function (t) {
        let k = t.dataset.k
        let i = S.forge.strats.indexOf(k)
        let on = i < 0
        if (!on && S.forge.strats.length <= 1) return /* 最后一条在用策略不可关 */
        if (on) S.forge.strats.push(k)
        else S.forge.strats.splice(i, 1)
        try { ctx.keep.set('strats', S.forge.strats) } catch (e) { }
        /* 芯片只影响自身外观：就地翻转 class,不整页重画（防闪烁） */
        if (t.classList) { if (on) t.classList.add('on'); else t.classList.remove('on') }
        t.setAttribute('aria-pressed', on ? 'true' : 'false')
      },
      /* 档案预警 → 当场停用：账本指出的问题一步解决，不用跳回熔炉摸是哪颗芯片 */
      'strat-mute': function (t) {
        let k = String(t.dataset.k || '')
        let s = stratOf(k)
        if (!s) return
        let i = S.forge.strats.indexOf(k)
        if (i < 0) { toast('「' + s.name + '」本来就不在开炉组合里', 'info'); return }
        if (S.forge.strats.length <= 1) { toast('这是最后一条在用的策略，先去熔炉勾上别的再停它', 'warn'); return }
        S.forge.strats.splice(i, 1)
        try { ctx.keep.set('strats', S.forge.strats) } catch (e) { }
        toast('已停用「' + s.name + '」，下一炉不再出这一路', 'ok')
        render()
      },
      'forge-showall': function () { S.forge.showAll = !S.forge.showAll; render() },
      'forge-cancel': function () { if (S.forge.handle) S.forge.handle.cancel(); toast('已请求中断：当前母题跑完后停', 'warn') },
      'forge-run': function () { actRunForge(null) },
      'l-forge': function (t) { actRunForge(t.dataset.id) },
      'undo-batch': function () {
        let b = S.lastBatch
        if (!b) return
        let touched = 0, exist = 0
        b.ids.forEach(function (id) {
          let L = findL(id)
          if (!L) return
          exist++
          L.variants.forEach(function (v) { if (v.status !== 'new') touched++ })
        })
        let doUndo = function () {
          b.ids.forEach(function (id) {
            let L = findL(id)
            /* 已成卷的谱系不撤（卷已入库就是事实），其余整删 */
            if (L && !L.paperId) db.lineages = db.lineages.filter(function (x) { return x.id !== id })
          })
          b.seeds.forEach(function (s) {
            if (db.staged.length < MAX_STAGED && !db.staged.some(function (x) { return x.id === s.id })) db.staged.push(normStaged(s))
          })
          /* 策略生成账不回退：已删条目重算太脆，宁可账面偏多也绝不造假（撤销动作本身进 log） */
          S.lastBatch = null
          save(); render()
          toast('已撤销本炉，母题回到托盘（' + b.seeds.length + ' 道）', 'info')
          try { ctx.log('撤销上一炉：删除 ' + exist + ' 条谱系') } catch (e) { }
        }
        if (!exist) { S.lastBatch = null; render(); toast('这批谱系已经不在了', 'info'); return }
        if (touched) ctx.api.confirm('这批里有 ' + touched + ' 张卡被你留用/弃用', '撤销会连处置记录一起删除（母题仍会回到托盘）。确定？', doUndo, true)
        else doUndo()
      },

      /* ---- 谱系卡 ---- */
      'l-audit': function (t) {
        let L = findL(t.dataset.id); if (!L) return
        t.disabled = true; t.textContent = '质检中…'
        auditLineage(ctx, L).then(function (r) {
          if (r.ok) { save(); render(); toast(r.hit ? '质检完成：' + r.hit + ' 道存疑（已标在卡上）' : '质检完成：未发现自洽问题', r.hit ? 'warn' : 'ok') }
          else { toast(r.error || '自检失败', 'warn'); try { render() } catch (e) { } }
        })
      },
      /* 批量改状态且会进打包默认勾选 —— 先报数确认,再落账（单张留/弃仍免确认） */
      'l-keepall': function (t) {
        let L = findL(t.dataset.id); if (!L) return
        let n = (L.variants || []).filter(function (v) { return v.status === 'new' }).length
        if (!n) { toast('没有「新出炉」的题可留（弃用的可在卡上改回）', 'info'); return }
        ctx.api.confirm('全部留用这 ' + n + ' 道？', '它们会进入留用池,并在打包台被默认勾上；逐张点「弃用」随时可退。', function () {
          let done = 0
          L.variants.forEach(function (v) {
            if (v.status === 'new') { v.status = 'kept'; done++; bumpStrat(db, v.strategy, 'keep', 1) }
          })
          if (done) bumpDay(db, 'keep', done)
          save(); render(); toast(done + ' 道全部留用', 'ok')
        }, false)
      },
      'l-del': function (t) {
        let id = t.dataset.id
        ctx.api.confirm('删除整条谱系？', '母题与它的全部变式（含留用未成卷的）会从档案消失；已生成的题卷留在「我的题卷」不联动删除。', function () {
          db.lineages = db.lineages.filter(function (x) { return x.id !== id })
          save(); render(); toast('谱系已删', 'info')
        }, true)
      },

      /* ---- 变式卡 ---- */
      'v-keep': function (t) {
        let r = findV(t.dataset.id); if (!r) return
        if (r.v.status === 'kept') return /* 重复点不双计（留用率账必须干净） */
        r.v.status = 'kept'; bumpStrat(db, r.v.strategy, 'keep', 1); bumpDay(db, 'keep', 1)
        r.v.updatedAt = nowIso(); save(); render()
      },
      'v-drop': function (t) {
        let r = findV(t.dataset.id); if (!r) return
        if (r.v.status === 'kept') {
          let s = db.stratStat[r.v.strategy]; if (s && s.keep > 0) s.keep-- /* 撤销留用要退账 */
        }
        r.v.status = 'drop'; r.v.updatedAt = nowIso(); save(); render()
      },
      'v-edit': function (t) {
        let r = findV(t.dataset.id); if (!r) return
        S.edit = r.v.id
        S.editDraft = { stem: r.v.stem, options: (r.v.options || []).join('\n'), answer: r.v.answer, solution: r.v.solution, trap: r.v.trap, diff: r.v.diff }
        S.justFocus = true
        render()
      },
      /* 骨架横幅直达：开这条谱系第一张空白题的编辑（配合 justFocus,点一下就能开写） */
      'l-fillskel': function (t) {
        let L = findL(t.dataset.id); if (!L) return
        let first = null
        for (let i = 0; i < (L.variants || []).length; i++) {
          let v = L.variants[i]
          if (v.status !== 'drop' && !String(v.stem || '').trim()) { first = v; break }
        }
        if (!first) { toast('这条谱系的骨架都填完了 —— 留用的题可以打包了', 'ok'); return }
        S.edit = first.id
        S.editDraft = { stem: first.stem, options: (first.options || []).join('\n'), answer: first.answer, solution: first.solution, trap: first.trap, diff: first.diff }
        S.justFocus = true
        render()
      },
      'v-cancel': function () { S.edit = ''; S.editDraft = null; render() },
      'v-save': function (t) {
        let r = findV(t.dataset.id); if (!r || !S.editDraft) return
        let d = S.editDraft
        let wasBlank = !String(r.v.stem || '').trim()
        r.v.stem = String(d.stem || '').trim()
        r.v.options = String(d.options || '').split('\n').map(function (s) { return s.replace(/^\s*[A-Za-z]\s*[.、:：)]\s*/, '').trim() }).filter(Boolean)
        if (r.v.options.length < 2) r.v.options = null
        r.v.answer = String(d.answer || '').trim(); r.v.solution = String(d.solution || '').trim(); r.v.trap = String(d.trap || '').trim()
        if (d.diff) r.v.diff = diffOf(d.diff).k
        r.v.similar = Math.round(sim2(r.L.stem, r.v.stem) * 100) / 100
        r.v.skin = r.v.similar >= 0.86 && digitsOf(r.L.stem) === digitsOf(r.v.stem) && r.v.strategy !== 'numShift'
        r.v.updatedAt = nowIso()
        S.edit = ''; S.editDraft = null
        /* 骨架补全流水线：这次补上了题干 → 自动打开下一张空白骨架（连作不用一张张点） */
        let nextBlank = null
        if (wasBlank && String(r.v.stem || '').trim()) {
          for (let i = 0; i < r.L.variants.length; i++) {
            let v2 = r.L.variants[i]
            if (v2.status !== 'drop' && !String(v2.stem || '').trim()) { nextBlank = v2; break }
          }
        }
        if (nextBlank) {
          S.edit = nextBlank.id
          S.editDraft = { stem: '', options: (nextBlank.options || []).join('\n'), answer: nextBlank.answer, solution: nextBlank.solution, trap: nextBlank.trap, diff: nextBlank.diff }
          S.justFocus = true
        }
        save(); render()
        toast(nextBlank ? '已更新，下一张骨架已打开' : '变式已更新', 'ok')
      },
      'v-copy': function (t) {
        let r = findV(t.dataset.id); if (!r) return
        let s = stratOf(r.v.strategy) || STRATS[0]
        let txt = '【变式 · ' + s.name + '】\n' + r.v.stem
        if (r.v.options && r.v.options.length) txt += '\n' + r.v.options.map(function (o, i) { return 'ABCD'[i] + '．' + o }).join('\n')
        if (r.v.answer) txt += '\n答案：' + r.v.answer
        if (r.v.solution) txt += '\n解析：' + r.v.solution
        if (r.v.trap) txt += '\n陷阱：' + r.v.trap
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(txt).then(function () { toast('已复制到剪贴板', 'ok') }, function () { toast('复制失败（浏览器限制）', 'warn') })
            return
          }
        } catch (e) { }
        toast('此环境没有剪贴板接口', 'warn')
      },
      /* 结构化复核：三项逐条核对通过才允许成卷（规范化的「错题复核」，不是拍脑袋点通过） */
      'v-review': function (t) {
        let r = findV(t.dataset.id); if (!r) return
        let v = r.v, issues = quickIssues(v, r.L)
        let html = '<div class="vf-rev">'
          + '<p>快检疑点：<b>' + esc(issues.map(issueLabel).join(' / ') || '无') + '</b></p>'
          + '<p class="vf-quiet">对照卡片逐项核对（三项全部勾选才能判「复核通过」）：</p>'
          + '<label class="vf-revline"><input type="checkbox" data-rv="stem"> 题干自足：不依赖原题/上文，条件够且无歧义</label>'
          + '<label class="vf-revline"><input type="checkbox" data-rv="ans"> 答案复算：亲手算过一遍，与解析、选项顺序一致</label>'
          + '<label class="vf-revline"><input type="checkbox" data-rv="opt"> 干扰项成立：无重复、每个错误项都有明确误因</label>'
          + '</div>'
        ctx.Modal.open({
          title: '变式复核', html: html, actions: [
            { label: '取消', kind: 'btn-ghost', onClick: function (close) { close() } },
            {
              label: '存疑搁置', kind: 'btn-ghost', onClick: function (close) {
                v.reviewed = false; v.reviewedAt = ''
                v.note = '复核存疑，待重看'
                v.updatedAt = nowIso()
                save(); close(); render()
                toast('已标记存疑（成卷时会被跳过）', 'warn')
              }
            },
            {
              label: '复核通过', kind: 'btn-primary', onClick: function (close) {
                let box = document.querySelector('.vf-rev')
                let all = box && ['stem', 'ans', 'opt'].every(function (k) {
                  let e = box.querySelector('[data-rv="' + k + '"]')
                  return e && e.checked
                })
                if (!all) { toast('三项都核对通过才能判复核完成', 'warn'); return }
                v.reviewed = true; v.reviewedAt = nowIso()
                if (/复核/.test(v.note || '')) v.note = ''
                v.updatedAt = nowIso()
                save(); close(); render()
                toast('复核通过（计入复核台账）', 'ok')
              }
            }
          ]
        })
      },
      'go-review': function () {
        S.forge.showAll = true
        S.forge.filter = { q: '', strat: 'all', status: 'review' }
        go('forge')
      },
      'v-del': function (t) {
        let r = findV(t.dataset.id); if (!r) return
        let before = r.L.variants.length
        r.L.variants = r.L.variants.filter(function (x) { return x.id !== t.dataset.id })
        if (r.L.variants.length !== before) bumpStrat(db, r.v.strategy, 'gen', -1)
        S.edit = ''; save(); render()
      },

      /* ---- 谱系图 ---- */
      'atlas-sel': function (t) { S.atlasVid = S.atlasVid === t.dataset.vid ? '' : t.dataset.vid; render() },
      'atlas-go': function (t) { S.atlasSel = t.dataset.id; S.atlasVid = ''; render() },

      /* ---- 打包 ---- */
      'pack-all': function () {
        let pool = keptPool(db)
        if (S.packSel.size) S.packSel = new Set()
        else pool.forEach(function (it) { S.packSel.add(it.v.id) })
        render()
      },
      'pack-run': function () { actPackRun() },
      'pack-preview': function () {
        let refs = []
        S.packSel.forEach(function (vid) { refs.push({ vid: vid }) })
        if (!refs.length) { toast('先勾选要预览的留用变式', 'warn'); return }
        S.packPreview = buildDrafts(ctx, db, refs, { titlePrefix: S.pack.title, scorePer: S.pack.scorePer, timePerQ: S.pack.timePer, sortEasy: S.pack.sortEasy })
        S.packReveal = false
        render()
      },
      'preview-reveal': function () { S.packReveal = !S.packReveal; render() },
      'pack-print': function () {
        let build = S.packPreview
        if (!build) {
          let refs = []
          S.packSel.forEach(function (vid) { refs.push({ vid: vid }) })
          if (!refs.length) { toast('先勾选要导出的留用变式', 'warn'); return }
          build = buildDrafts(ctx, db, refs, { titlePrefix: S.pack.title, scorePer: S.pack.scorePer, timePerQ: S.pack.timePer, sortEasy: S.pack.sortEasy })
        }
        if (!build.drafts.length) { toast('没有可导出的题（可能都被体积闸拦了）', 'warn'); return }
        let md = build.drafts.map(function (d) { return buildPaperMd(d, true) }).join('\n\n\\pagebreak\n\n')
        try { ctx.api.download('变式文稿-' + todayKey() + '.md', md, 'text/markdown'); toast('可打印文稿已下载（卷面 + 答案册）', 'ok') } catch (e) { toast('导出失败', 'danger') }
      },
      'paper-open': function (t) {
        let kit = window.PaperKit
        if (!kit || !kit.open || !kit.open(t.dataset.id, 0)) toast('这张卷在「我的题卷」里已经不在了', 'warn')
        /* 导航由 PaperKit.open 自己投递意图并跳做题页，这里不重复 go */
      },
      'paper-atlas': function (t) {
        let p = null
        db.papers.forEach(function (x) { if (x.id === t.dataset.id) p = x })
        if (!p || !p.lineageIds.length) { toast('这条卷记录没有谱系回溯', 'info'); return }
        S.atlasSel = p.lineageIds[0]; S.atlasVid = ''
        go('atlas')
      },
      /* 靶向重炉：交卷得分率 <60% 的卷 —— 一键勾好「靶向+降阶」回到熔炉再开 */
      'l-retrain': function (t) {
        let p = null
        db.papers.forEach(function (x) { if (x.id === t.dataset.id) p = x })
        if (!p || !p.graded || !p.graded.total) { toast('这张卷还没交卷，拿不到得分率', 'info'); return }
        let rate = p.graded.score / p.graded.total
        if (rate >= 0.6) { toast('得分率 ' + pctStr(p.graded.score, p.graded.total) + ' —— 这批守得住，不用重炉', 'ok'); return }
        S.forge.strats = ['trapFocus', 'hardDown']
        try { ctx.keep.set('strats', S.forge.strats) } catch (e) { }
        S.forge.showAll = true
        S.forge.filter = { q: '', strat: 'all', status: 'packed' }
        go('forge')
        /* 找卷内还活着的谱系直接再开一炉；一条都不在就退回引导 */
        let lid = ''
        for (let i = 0; i < p.lineageIds.length; i++) if (findL(p.lineageIds[i])) { lid = p.lineageIds[i]; break }
        toast('得分率 ' + pctStr(p.graded.score, p.graded.total) + ' —— 已勾好「陷阱靶向 + 难度降阶」' + (lid ? '，直接对这条谱系再开一炉' : ''), 'info')
        if (lid) actRunForge(lid)
        else toast('这条卷的谱系已不在档案里，去熔炉挑一条相近的再开炉', 'warn')
      },
      'paper-del': function (t) {
        let id = t.dataset.id
        ctx.api.confirm('删除这张变式卷？', '从「我的题卷」与工厂档案一并删除；谱系里的变式保留（可再次组卷）。', function () {
          try { if (window.PaperKit && window.PaperKit.remove) window.PaperKit.remove(id) } catch (e) { }
          db.papers = db.papers.filter(function (p) { return p.id !== id })
          db.lineages.forEach(function (L) { if (L.paperId === id) { L.paperId = ''; L.paperTitle = ''; L.packedAt = '' } })
          save(); render(); toast('卷已删除', 'info')
        }, true)
      },

      /* ---- 档案 ---- */
      'st-export': function () {
        try { ctx.api.download('variant-forge-' + todayKey() + '.json', JSON.stringify(db, null, 2), 'application/json'); toast('档案已导出', 'ok') }
        catch (e) { toast('导出失败：' + String((e && e.message) || e).slice(0, 40), 'danger') }
      },
      'st-import': function () {
        ctx.api.readFile('.json,application/json').then(function (f) {
          if (!f || !f.text) return
          let raw = null
          try { raw = JSON.parse(f.text) } catch (e) { toast('这个文件不是合法 JSON', 'danger'); return }
          let inc = normDb(raw)
          let added = 0
          /* 合并按 id 去重、来者更新优先；day/stratStat 直接累加（导出的就是账本快照） */
          inc.staged.forEach(function (x) { if (db.staged.length < MAX_STAGED && !db.staged.some(function (y) { return y.id === x.id })) { db.staged.push(x); added++ } })
          inc.lineages.forEach(function (x) {
            let hit = findL(x.id)
            if (!hit) { if (db.lineages.length < MAX_LINEAGES) { db.lineages.push(x); added++ } }
            else {
              x.variants.forEach(function (nv) { if (!hit.variants.some(function (ov) { return ov.id === nv.id })) hit.variants.push(nv) })
              /* 合并也要守单谱系上限：旧档优先,溢出的来客如实丢弃（上限在 normDb 里也是这么收的） */
              if (hit.variants.length > MAX_VARIANTS) hit.variants = hit.variants.slice(0, MAX_VARIANTS)
              added++
            }
          })
          inc.papers.forEach(function (x) { if (!db.papers.some(function (y) { return y.id === x.id })) db.papers.push(x) })
          Object.keys(inc.day).forEach(function (k) {
            if (!db.day[k]) db.day[k] = { gen: 0, keep: 0, paper: 0, grade: 0 }
            ;['gen', 'keep', 'paper', 'grade'].forEach(function (f2) { db.day[k][f2] += inc.day[k][f2] || 0 })
          })
          Object.keys(inc.stratStat).forEach(function (k) {
            if (!db.stratStat[k]) db.stratStat[k] = { gen: 0, keep: 0 }
            db.stratStat[k].gen += inc.stratStat[k].gen || 0
            db.stratStat[k].keep += inc.stratStat[k].keep || 0
          })
          db.papers.sort(function (a, b) { return String(b.createdAt) > String(a.createdAt) ? 1 : -1 })
          save(); render(); toast('导入完成：新增/并入 ' + added + ' 条记录', 'ok')
        }).catch(function () { /* 用户取消选文件 */ })
      },
      'st-report': function () {
        try { ctx.api.download('变式工厂报告-' + todayKey() + '.md', buildReport(db), 'text/markdown'); toast('报告已下载', 'ok') } catch (e) { toast('报告生成失败', 'danger') }
      },
      'st-clear': function () {
        ctx.api.confirm('清空工厂全部档案？', '母题、谱系、变式、卷记录、账本一起清。已生成的题卷不联动删除（在「我的题卷」里管）。建议先「导出 JSON」留个底。', function () {
          db = emptyDb(); ctx.__db = db
          S.packSel = new Set(); S.packInit = false; S.packPreview = null; S.packReveal = false
          S.atlasSel = ''; S.atlasVid = ''; S.edit = ''; S.lastBatch = null
          save(); render(); toast('档案已清空，工厂重新开张', 'info')
        }, true)
      }
    }

    /* 开炉动作：托盘全部（或选中的一道）→ 母题落谱系 → 批量 forgeOne */
    function actRunForge(oneLineageId) {
      if (S.forge.running) { toast('上一炉还在跑', 'warn'); return }
      if (!S.forge.strats.length) { toast('至少勾一种变式策略', 'warn'); return }
      let targets = []
      let undoSeeds = []
      if (oneLineageId) {
        let L = findL(oneLineageId)
        if (L) targets.push(L)
      } else {
        if (!db.staged.length) { toast('托盘是空的', 'warn'); return }
        let seeds = S.traySel ? db.staged.filter(function (x) { return x.id === S.traySel }) : db.staged.slice()
        seeds.forEach(function (st) {
          if (db.lineages.length >= MAX_LINEAGES) { toast('谱系档案已满 ' + MAX_LINEAGES + ' 条 —— 去档案清理一些', 'warn'); return }
          /* 托盘母题 → 谱系建档（一条母题一条谱系；重开炉走「再开一炉」追加） */
          let L = normLineage({
            srcType: st.srcType, srcId: st.srcId, stagedId: st.id, subject: st.subject,
            stem: st.stem, options: st.options ? st.options.slice() : null, answer: st.answer,
            solution: st.solution, trap: st.trap, point: st.point, origin: aiOk(ctx) ? 'ai' : 'skeleton',
            variants: []
          })
          db.lineages.unshift(L)
          targets.push(L)
          undoSeeds.push(JSON.parse(JSON.stringify(st)))
        })
        db.staged = db.staged.filter(function (x) {
          return !targets.some(function (L) { return L.stagedId === x.id })
        })
        S.traySel = ''
      }
      if (!targets.length) { save(); render(); return }
      /* 每母题按「单炉上限 − 现存非弃用」定配额；没配额就跳过并如实报 */
      let plan = []
      targets.forEach(function (L) {
        let room = Math.max(0, S.forge.cap - (L.variants || []).filter(function (v) { return v.status !== 'drop' }).length)
        let q = Math.min(S.forge.count, room)
        if (q <= 0) { toast('「' + shortText(L.stem, 16) + '」变式已到单炉上限，跳过（可调高上限或删旧变式）', 'warn'); return }
        plan.push(L)
      })
      if (!plan.length) {
        /* 一道都没配额：回滚本轮刚建档的空谱系，母题请回托盘 —— 不留孤儿档案 */
        targets.forEach(function (L) {
          if (!(L.variants || []).length) db.lineages = db.lineages.filter(function (x) { return x.id !== L.id })
        })
        undoSeeds.forEach(function (s) {
          if (db.staged.length < MAX_STAGED) db.staged.push(normStaged(s))
        })
        save(); render(); return
      }
      S.forge.running = true; S.forge.done = 0; S.forge.total = plan.length; S.forge.phase = ''
      S.lastBatch = null
      render()
      let h = forgeBatch(ctx, plan, S.forge.strats, S.forge.count, function (done, total, L, r) {
        S.forge.done = done; S.forge.phase = shortText(L.stem, 18) + (r.ok ? (r.skeleton ? '（骨架）' : '') : ' ✗')
        bumpDay(db, 'gen', r.ok ? r.count : 0)
        save()
        render()
      })
      S.forge.handle = h
      h.promise.then(function (res) {
        S.forge.running = false; S.forge.handle = null
        if (res.done.length) S.lastBatch = { at: Date.now(), ids: res.done.slice(), seeds: undoSeeds }
        /* 失败且零产出的谱系：删空档、母题回托盘 —— 「重开」不该需要用户先当清道夫 */
        let back = 0
        res.failed.forEach(function (f) {
          let L = findL(f.id)
          if (!L || (L.variants || []).length) return /* 部分成功不动账 */
          db.lineages.splice(db.lineages.indexOf(L), 1)
          let seed = null
          for (let i2 = 0; i2 < undoSeeds.length; i2++) if (undoSeeds[i2].id === L.stagedId) { seed = undoSeeds[i2]; break }
          if (seed && db.staged.length < MAX_STAGED && !db.staged.some(function (x) { return x.id === seed.id })) {
            db.staged.push(normStaged(seed))
            back++
          }
        })
        save(); render()
        let msg = []
        if (res.done.length) msg.push('开炉 ' + res.done.length + ' 道母题')
        if (res.failed.length) msg.push('失败 ' + res.failed.length + '（' + esc(res.failed[0].why || '') + '）')
        if (back) msg.push(back + ' 道已退回托盘,可直接重开')
        toast(msg.join(' · ') || '本炉没有产出', res.failed.length ? 'warn' : 'ok')
        if (res.done.length) go('forge')
      })
    }

    /* 打包动作：勾选 → buildDrafts → PaperKit → 记账 → (autoOpen) 直达做题 */
    function actPackRun() {
      let refs = []
      S.packSel.forEach(function (vid) { refs.push({ vid: vid }) })
      if (!refs.length) { toast('先勾选要打包的留用变式', 'warn'); return }
      let build = buildDrafts(ctx, db, refs, { titlePrefix: S.pack.title, scorePer: S.pack.scorePer, timePerQ: S.pack.timePer, sortEasy: S.pack.sortEasy })
      if (build.skipped.length) build.skipped.forEach(function (s) { toast('跳过：' + s, 'warn') })
      if (!build.drafts.length) { toast('没有可入库的卷（题目可能题干为空）', 'warn'); return }
      let res = commitPapers(ctx, db, build)
      S.packSel = new Set(); S.packInit = false; S.packPreview = null
      save(); render()
      if (!res.ids.length) { toast('入库失败：' + (res.skipped[0] || 'PaperKit 未返回卷 id'), 'danger'); return }
      let auto = true
      try { auto = ctx.config('autoOpen') !== false } catch (e) { }
      toast(res.ids.length > 1
        ? '已生成 ' + res.ids.length + ' 张变式卷（按科目拆）'
        : '变式卷已生成（' + build.drafts[0].questions.length + ' 题）', 'ok')
      if (auto && window.PaperKit) window.PaperKit.open(res.ids[0], 0)
    }

    /* ---- 事件接线：root 一个 click 覆盖页眉/舞台/dock；stage 一对 input/change ---- */
    function onClick(e) {
      let t = e.target.closest ? e.target.closest('[data-act]') : null
      if (!t) return
      /* dock 项没有 data-act，走 onDock；输入控件的动作走 input/change */
      if (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA') return
      let fn = ACT[t.getAttribute('data-act')]
      if (!fn) return
      if (S.forge.running && t.getAttribute('data-act') !== 'forge-cancel') {
        toast('熔炉运行中，先点「中断」再做这一步', 'info')
        return
      }
      e.preventDefault()
      try { fn(t, e) } catch (err) { toast('操作出错：' + String((err && err.message) || err).slice(0, 50), 'danger') }
    }
    function refocus(sel) {
      let again = stageEl.querySelector('[data-act="' + sel + '"]')
      if (again) {
        again.focus()
        try { again.setSelectionRange(again.value.length, again.value.length) } catch (e) { }
      }
    }
    function onInput(e) {
      let t = e.target
      if (!t || !t.getAttribute) return
      let a = t.getAttribute('data-act') || ''
      let f = t.getAttribute('data-f') || ''
      let k = t.getAttribute('data-e') || ''
      if (f) {
        S.bench.m[f] = f === 'options' ? String(t.value || '').split('\n').filter(function (x) { return x.trim() }) : t.value
        return
      }
      if (k) { if (S.editDraft) S.editDraft[k] = t.value; return }
      if (a === 'bench-q') {
        S.bench.q = t.value
        /* 打字即过滤：防抖重画后把焦点/光标送回去（丢光标的搜索框等于没有搜索框） */
        if (_qT.b) clearTimeout(_qT.b)
        _qT.b = setTimeout(function () { if (destroyed) return; render(); refocus('bench-q') }, 300)
        return
      }
      if (a === 'forge-q') {
        S.forge.filter.q = t.value
        if (_qT.f) clearTimeout(_qT.f)
        _qT.f = setTimeout(function () { if (destroyed) return; render(); refocus('forge-q') }, 300)
        return
      }
      if (a === 'forge-count') { S.forge.count = clamp(t.value, 1, MAX_VARIANTS); return }
      if (a === 'forge-cap') { S.forge.cap = clamp(t.value, 1, MAX_VARIANTS); return }
      if (a === 'pack-title') { S.pack.title = t.value; return }
      if (a === 'pack-sort') { S.pack.sortEasy = !!t.checked; return } /* 状态在 DOM 勾选框上，不用重画 */
      if (a === 'pack-score') { S.pack.scorePer = clamp(t.value, 1, 100); return }
      if (a === 'pack-time') { S.pack.timePer = clamp(t.value, 1, 60); return }
      if (a === 'pack-tick') {
        if (t.checked) S.packSel.add(t.getAttribute('data-id'))
        else S.packSel.delete(t.getAttribute('data-id'))
        render()
      }
    }
    function onChange(e) {
      let t = e.target
      let a = t && t.getAttribute ? (t.getAttribute('data-act') || '') : ''
      if (a === 'bench-subj') { S.bench.subj = t.value; S.bench.pick = new Set(); render() }
      else if (a === 'forge-fstrat') { S.forge.filter.strat = t.value; render() }
      else if (a === 'forge-fstat') { S.forge.filter.status = t.value; render() }
      else if (a === 'pack-score' || a === 'pack-time') { render() } /* 离焦后刷新按钮上的合计文案 */
      /* 勾选框不在这接：input 事件先于 change 触发，onInput 已处理 —— 两边都接会重渲两次 */
    }
    function onDock(e) {
      let b = e.target.closest ? e.target.closest('.vf-dock-item') : null
      if (b) { e.preventDefault(); go(b.getAttribute('data-view')) }
    }
    root.addEventListener('click', onClick)
    stageEl.addEventListener('input', onInput)
    stageEl.addEventListener('change', onChange)
    dockEl.addEventListener('click', onDock)

    /* 吸顶两态：只在状态真的翻转那帧写 className（滚动帧率下免每帧重排） */
    let lastStuck = false
    function onScroll() {
      let stuck = topEl.getBoundingClientRect().top <= 2
      if (stuck === lastStuck) return
      lastStuck = stuck
      topEl.className = 'vf-top' + (stuck ? ' is-stuck' : '')
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    /* 数据/主题变化轻同步一次（云同步合并、主题切换都可能改到配色与账本） */
    function onStore() { T(function () { if (!destroyed && !S.forge.running) render() }, 80) }
    document.addEventListener('store:change', onStore)

    /* 键盘：1-5 切视图、N 直达熔炉、Esc 收起编辑（输入场景与组合键不拦）——站内多插件同惯例 */
    function onKeyDown(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      let tg = e.target && e.target.tagName
      if (tg === 'INPUT' || tg === 'TEXTAREA' || tg === 'SELECT') return
      if (e.key >= '1' && e.key <= '5') {
        let v = VIEWS[Number(e.key) - 1]
        if (v) { e.preventDefault(); go(v.k) }
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        go(db.staged.length ? 'forge' : 'bench')
      } else if (e.key === 'Escape' && S.edit) {
        S.edit = ''; S.editDraft = null; render()
      }
    }
    window.addEventListener('keydown', onKeyDown)

    /* 首帧：指示器/吸顶态校准 */
    render()
    T(updDock, 30)

    /* ---- 返回 destroy：切页/卸载时宿主会调（LegacyPage 已接线） ---- */
    return function destroy() {
      destroyed = true
      try { if (S.forge.handle) S.forge.handle.cancel() } catch (e) { }
      if (_qT.b) clearTimeout(_qT.b)
      if (_qT.f) clearTimeout(_qT.f)
      timers.forEach(clearTimeout)
      root.removeEventListener('click', onClick)
      stageEl.removeEventListener('input', onInput)
      stageEl.removeEventListener('change', onChange)
      dockEl.removeEventListener('click', onDock)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('store:change', onStore)
      window.removeEventListener('keydown', onKeyDown)
      if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl)
      try { ctx.__db = null } catch (e) { }
    }
  }

/* c9: 样式（manifest 小件 CSS 全局段 + 整页 CSS_EXTRA） */
  let CSS = [
    '.vf-chip{display:inline-flex;align-items:center;height:19px;padding:0 8px;border-radius:999px;font-size:11px;font-weight:600;letter-spacing:.02em;background:color-mix(in srgb,var(--text-primary,#1b2430) 8%,transparent);color:var(--text-secondary,#4a5568)}',
    '.vf-chip.sm{height:16px;font-size:10px;padding:0 7px}',
    '.vf-chip.subj{background:color-mix(in srgb,var(--vf-acc,#c2410c) 14%,transparent);color:var(--vf-acc-ink,#9a3412)}',
    '.vf-chip.pt{background:color-mix(in srgb,#2563eb 12%,transparent);color:#1d4ed8}',
    '.vf-chip.exam{background:color-mix(in srgb,#7c3aed 12%,transparent);color:#6d28d9}',
    '.vf-chip.c-num{background:color-mix(in srgb,var(--vf-c-num,#0d9488) 16%,transparent);color:var(--vf-c-num,#0d9488)}',
    '.vf-chip.c-ctx{background:color-mix(in srgb,var(--vf-c-ctx,#7c3aed) 16%,transparent);color:var(--vf-c-ctx,#7c3aed)}',
    '.vf-chip.c-up{background:color-mix(in srgb,var(--vf-c-up,#dc2626) 16%,transparent);color:var(--vf-c-up,#dc2626)}',
    '.vf-chip.c-down{background:color-mix(in srgb,var(--vf-c-down,#16a34a) 16%,transparent);color:var(--vf-c-down,#16a34a)}',
    '.vf-chip.c-rev{background:color-mix(in srgb,var(--vf-c-rev,#2563eb) 16%,transparent);color:var(--vf-c-rev,#2563eb)}',
    '.vf-chip.c-trap{background:color-mix(in srgb,var(--vf-c-trap,#d97706) 16%,transparent);color:var(--vf-c-trap,#d97706)}',
    '.vf-chip.c-opt{background:color-mix(in srgb,var(--vf-c-opt,#db2777) 16%,transparent);color:var(--vf-c-opt,#db2777)}',
    '.vf-stag{display:inline-flex;align-items:center;height:18px;padding:0 8px;border-radius:4px;font-size:10.5px;font-weight:700;letter-spacing:.06em}',
    '.vf-stag.kept{background:color-mix(in srgb,var(--vf-acc,#c2410c) 16%,transparent);color:var(--vf-acc-ink,#9a3412)}',
    '.vf-stag.drop{background:color-mix(in srgb,var(--text-muted,#8a94a3) 12%,transparent);color:var(--text-muted,#8a94a3);text-decoration:line-through}',
    '.vf-stag.new{background:color-mix(in srgb,#0ea5e9 14%,transparent);color:#0369a1}',
    '.vf-diffchip{display:inline-flex;align-items:center;height:18px;padding:0 7px;border-radius:4px;font-size:10.5px;background:color-mix(in srgb,var(--text-primary,#1b2430) 7%,transparent);color:var(--text-secondary,#4a5568)}',
    '.vf-diffchip.d-hard{color:#b91c1c;background:color-mix(in srgb,#b91c1c 10%,transparent)}',
    '.vf-diffchip.d-real{color:#c2410c;background:color-mix(in srgb,#c2410c 10%,transparent)}',
    /* ---- 常驻面板（渲染在 .vf-root 之外，样式必须进 manifest css 全局段） ---- */
    '.vf-panel{display:flex;flex-direction:column;gap:10px;padding:14px 6px 6px;font:13px/1.6 "PingFang SC","Noto Sans SC",system-ui,sans-serif;color:var(--text-primary,#1b2430)}',
    '.vf-panel-top{display:flex;align-items:center;gap:8px}',
    '.vf-panel-top b{font-family:Georgia,"Songti SC",serif;font-size:14.5px;font-weight:700}',
    '.vf-panel-top em{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:9.5px;letter-spacing:.14em;color:var(--text-muted,#8a94a3);margin-left:auto}',
    '.vf-panel .vf-mark-sm{color:#c2410c;display:grid;place-items:center}',
    '.vf-panel .vf-mark-sm svg{width:20px;height:20px}',
    '.vf-panel-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}',
    '.vf-panel-kpis .pk{display:flex;flex-direction:column;align-items:center;padding:9px 4px;border:1px solid var(--line,#e5e7eb);border-radius:10px;background:color-mix(in srgb,#c2410c 4%,transparent)}',
    '.vf-panel-kpis .pk b{font-family:Georgia,serif;font-size:20px;line-height:1.1;font-variant-numeric:tabular-nums;color:#c2410c}',
    'html[data-theme="night"] .vf-panel .vf-mark-sm,html[data-theme="night"] .vf-panel-kpis .pk b{color:var(--nk-acc,#f0b95a)}',
    '.vf-panel-kpis .pk i{font-style:normal;font-size:10px;color:var(--text-muted,#8a94a3);margin-top:2px}',
    '.vf-panel-stage{margin:0;font-size:12px;color:var(--text-secondary,#4a5568)}',
    '.vf-panel-acts{display:flex;gap:8px}'
  ].join('')

  let CSS_EXTRA = [
    /* ---- 根与色板：品牌色走变量，四主题只改根令牌 ---- */
    '.vf-root{--vf-acc:#c2410c;--vf-acc2:#2563eb;--vf-on-acc:#fff;--vf-ink:var(--text-primary,#1b2430);--vf-sub:var(--text-muted,#6b7788);--vf-line:var(--line,#e5e7eb);--vf-line2:color-mix(in srgb,var(--text-primary,#1b2430) 22%,transparent);--vf-bg:var(--surface,#fff);--vf-soft:var(--surface-muted,#f6f8fb);--vf-gut:var(--vp-x,16px);--vf-w:1180px;',
    '--vf-c-num:#0d9488;--vf-c-ctx:#7c3aed;--vf-c-up:#dc2626;--vf-c-down:#16a34a;--vf-c-rev:#2563eb;--vf-c-trap:#d97706;--vf-c-opt:#db2777}',
    '.vf-root{color:var(--vf-ink);font:14px/1.65 "PingFang SC","Noto Sans SC","Microsoft YaHei",system-ui,sans-serif;position:relative}',
    'html[data-theme="night"] .vf-root{--vf-acc:var(--nk-acc,#f0b95a);--vf-acc2:#e2a43f;--vf-on-acc:#2a1c04;--vf-c-num:#5eead4;--vf-c-ctx:#c4b5fd;--vf-c-up:#fca5a5;--vf-c-down:#86efac;--vf-c-rev:#93c5fd;--vf-c-trap:#fcd34d;--vf-c-opt:#f9a8d4}',
    'html[data-theme="night"] .vf-chip.pt{color:#bfdbfe}',
    '.vf-root *,.vf-root *::before,.vf-root *::after{box-sizing:border-box}.vf-root button{font-family:inherit;color:inherit}.vf-root i{font-style:normal}',
    /* ---- 氛围光斑 ---- */
    '.vf-aura{position:absolute;inset:calc(var(--vp-t,16px)*-1) calc(var(--vp-x,16px)*-1) calc(var(--vp-b,24px)*-1);z-index:0;pointer-events:none;overflow:hidden;background-image:repeating-linear-gradient(90deg,color-mix(in srgb,var(--vf-ink) 4%,transparent) 0 1px,transparent 1px 96px);mask-image:linear-gradient(180deg,#000,transparent 74%);-webkit-mask-image:linear-gradient(180deg,#000,transparent 74%)}',
    '.vf-aura i{position:absolute;border-radius:50%;filter:blur(90px);opacity:.26}',
    '.vf-aura i:nth-child(1){width:460px;height:460px;left:-160px;top:-210px;background:radial-gradient(circle,rgba(194,65,12,.42),transparent 68%);animation:vfFloat 32s ease-in-out infinite alternate}',
    '.vf-aura i:nth-child(2){width:380px;height:380px;right:-130px;top:-110px;background:radial-gradient(circle,rgba(37,99,235,.30),transparent 70%);animation:vfFloat 40s ease-in-out infinite alternate-reverse}',
    '@keyframes vfFloat{to{transform:translate3d(28px,-20px,0) scale(1.05)}}',
    /* ---- 吸顶页眉（两态收窄） ---- */
    '.vf-top{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:16px;margin:0 calc(-1*var(--vf-gut));padding:15px calc(var(--vf-gut)+max(6px,(100% - var(--vf-w))/2)) 13px;background:transparent;transition:padding .3s cubic-bezier(.22,1,.36,1),background-color .3s ease}',
    '.vf-top::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--vf-line);opacity:0;transition:opacity .3s ease}',
    '.vf-top.is-stuck{padding-top:8px;padding-bottom:8px;background:color-mix(in srgb,var(--vf-bg) 88%,transparent);backdrop-filter:blur(18px) saturate(1.1);-webkit-backdrop-filter:blur(18px) saturate(1.1)}',
    '.vf-top.is-stuck::after{opacity:1}',
    '.vf-brand{display:flex;align-items:center;gap:11px;min-width:0}',
    '.vf-mark{width:40px;height:40px;flex:0 0 40px;display:grid;place-items:center;color:var(--vf-acc);transition:width .3s,height .3s,flex-basis .3s}',
    '.vf-mark svg{width:34px;height:34px}',
    '.vf-top.is-stuck .vf-mark{width:30px;height:30px;flex-basis:30px}.vf-top.is-stuck .vf-mark svg{width:26px;height:26px}',
    '.vf-brandtx{display:flex;flex-direction:column;min-width:0}',
    '.vf-kicker{font:600 8.5px/1.5 ui-monospace,Consolas,monospace;letter-spacing:.24em;color:var(--vf-sub);text-transform:uppercase;max-height:13px;overflow:hidden;transition:max-height .3s,opacity .3s}',
    '.vf-top.is-stuck .vf-kicker{max-height:0;opacity:0}',
    '.vf-brandtx b{font-family:Georgia,"Songti SC","Noto Serif SC",serif;font-size:21px;font-weight:700;letter-spacing:.05em;white-space:nowrap;transition:font-size .3s}',
    '.vf-top.is-stuck .vf-brandtx b{font-size:17px}',
    '.vf-brandtx em{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:9.5px;color:var(--vf-sub);margin-left:7px}',
    '.vf-kpis{display:flex;align-items:baseline;margin-left:auto}',
    '.vf-kpi{display:flex;flex-direction:column;align-items:center;padding:0 14px;border-left:1px solid var(--vf-line);min-width:54px}',
    '.vf-kpi:first-child{border-left:0}',
    '.vf-kpi b{font-family:Georgia,serif;font-size:21px;line-height:1.15;font-variant-numeric:tabular-nums;transition:font-size .3s}',
    '.vf-top.is-stuck .vf-kpi b{font-size:17px}',
    '.vf-kpi i{font-size:9.5px;color:var(--vf-sub);letter-spacing:.14em}',
    '.vf-kpi.ok b{color:var(--vf-acc)}',
    '.vf-topacts{display:flex;align-items:center;gap:10px;margin-left:6px}',
    /* ---- 按钮族 ---- */
    '.vf-btn{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 1px;border:0;border-bottom:1px solid transparent;border-radius:0;background:none;color:var(--vf-ink);font-size:13px;font-weight:600;cursor:pointer;transition:color .16s,border-color .16s,transform .16s}',
    '.vf-btn:hover{color:var(--vf-acc);border-bottom-color:currentColor}',
    '.vf-btn:active{transform:translateY(1px)}',
    '.vf-btn svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.8}',
    '.vf-btn.primary{height:34px;padding:0 18px;border:0;border-radius:999px;background:linear-gradient(135deg,var(--vf-acc),var(--vf-acc2));color:var(--vf-on-acc);box-shadow:0 8px 20px -12px color-mix(in srgb,var(--vf-acc) 90%,transparent)}',
    '.vf-btn.primary:hover{color:var(--vf-on-acc);transform:translateY(-1px)}',
    '.vf-btn.primary.dis{opacity:.45;pointer-events:none}',
    '.vf-btn.ghost{color:var(--vf-sub)}.vf-btn.ghost.danger{color:#b91c1c}',
    '.vf-btn.danger{color:#b91c1c}',
    'html[data-theme="night"] .vf-btn.ghost.danger,html[data-theme="night"] .vf-btn.danger{color:var(--danger,#ef6a63)}',
    '.vf-btn.sm{height:24px;font-size:12px}',
    '.vf-icobtn{width:30px;height:30px;display:grid;place-items:center;border:0;border-radius:0;background:none;color:var(--vf-sub);cursor:pointer;transition:color .16s,transform .16s}',
    '.vf-icobtn:hover{color:var(--vf-acc);transform:translateY(-1px)}',
    '.vf-icobtn svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.7}',
    /* ---- 舞台 / 卡片 ---- */
    '.vf-stage{position:relative;z-index:1;width:100%;max-width:var(--vf-w);margin:0 auto;display:flex;flex-direction:column;padding:4px 6px 150px}',
    '.vf-card{border:0;border-top:1px solid var(--vf-line);border-radius:0;background:transparent;box-shadow:none;padding:18px 0 6px}',
    /* 入场动画只在「切换视图」时播放（.vf-enter 由 render 按视图变化挂/摘）；
     * 原地重画（勾芯片/留用/搜索防抖）不再重放 —— 消除整页闪烁 */
    '.vf-enter .vf-card{animation:vfRise .45s cubic-bezier(.22,1,.36,1) both}',
    '.vf-card:first-child{border-top:0;padding-top:8px}',
    '.vf-enter .vf-card:nth-child(2){animation-delay:45ms}.vf-enter .vf-card:nth-child(3){animation-delay:85ms}.vf-enter .vf-card:nth-child(4){animation-delay:120ms}',
    '@keyframes vfRise{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:none}}',
    '.vf-card-h{display:flex;align-items:baseline;gap:10px;padding-bottom:9px;margin-bottom:14px;border-bottom:1px solid var(--vf-line)}',
    '.vf-card-h b{font-family:Georgia,"Songti SC",serif;font-size:17px;font-weight:700;letter-spacing:.03em}',
    '.vf-card-h em{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:10px;letter-spacing:.12em;color:var(--vf-sub);text-transform:uppercase}',
    '.vf-card-h .vf-btn,.vf-card-h .vf-icobtn{margin-left:auto}',
    '.vf-card-h .vf-btn+.vf-btn{margin-left:8px}',
    '.vf-quiet{font-size:12.5px;line-height:1.9;color:var(--vf-sub)}',
    '.vf-more{font-size:12px;color:var(--vf-sub);margin-top:9px;padding-top:9px;border-top:1px dashed var(--vf-line)}',
    '.vf-acts{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:16px}',
    '.vf-hint{font-size:11.5px;color:var(--vf-sub);letter-spacing:.02em}',
    '.vf-lnk{color:var(--vf-acc);cursor:pointer;text-decoration:underline}',
    '.vf-alert{margin:0 0 12px;padding:9px 13px;border-radius:8px;font-size:12.5px;line-height:1.7}',
    '.vf-alert.warn{background:color-mix(in srgb,var(--warn,#f59e0b) 14%,transparent);color:#8a6100}',
    'html[data-theme="night"] .vf-alert.warn{color:var(--warn,#e8ae3f)}',
    '.vf-alert.danger{background:color-mix(in srgb,var(--danger,#ef6a63) 12%,transparent);color:#b91c1c}',
    'html[data-theme="night"] .vf-alert.danger{color:var(--danger,#ef6a63)}',
    /* ---- 分段控件 / 筛选 / 输入 ---- */
    '.vf-seg{display:inline-flex;gap:2px;padding:3px;border-radius:999px;background:var(--vf-soft)}',
    '.vf-segbtn{height:28px;padding:0 14px;border:0;border-radius:999px;background:none;color:var(--vf-sub);font-size:12.5px;font-weight:600;cursor:pointer;transition:background .16s,color .16s}',
    '.vf-segbtn.on{background:var(--vf-bg);color:var(--vf-ink);box-shadow:0 1px 4px rgba(0,0,0,.10)}',
    '.vf-filter{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:12px}',
    '.vf-search{flex:1;min-width:180px;max-width:320px}',
    '.vf-count{font-size:12px;color:var(--vf-sub);font-variant-numeric:tabular-nums}',
    '.vf-input{height:32px;border:0;border-bottom:1px solid var(--vf-line2);border-radius:0;padding:3px 2px;background:transparent;color:var(--vf-ink);font-size:13.5px;font-family:inherit;outline:none;transition:border-color .16s,box-shadow .16s}',
    '.vf-input:focus{border-bottom-color:var(--vf-acc);box-shadow:0 1px 0 0 var(--vf-acc)}',
    '.vf-input.vf-sel{cursor:pointer}',
    '.vf-input.vf-num{width:64px;text-align:center}',
    '.vf-ta{height:auto;padding:6px 4px;resize:vertical;width:100%;display:block}',
    '.vf-inl{display:inline-flex;align-items:center;gap:8px;font-size:12.5px;color:var(--vf-sub)}',
    /* ---- 引导卡 ---- */
    '.vf-guide .vf-gsteps{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}',
    '.vf-gstep{border:1px solid var(--vf-line);border-radius:12px;padding:13px 15px;background:var(--vf-bg)}',
    '.vf-gstep i{display:grid;place-items:center;width:24px;height:24px;border-radius:8px;background:color-mix(in srgb,var(--vf-acc) 14%,transparent);color:var(--vf-acc);font:700 13px ui-monospace,Consolas,monospace;margin-bottom:7px}',
    '.vf-gstep b{display:block;font-size:13.5px;margin-bottom:3px}',
    '.vf-gstep span{font-size:12px;line-height:1.75;color:var(--vf-sub)}',
    '@media (max-width:780px){.vf-guide .vf-gsteps{grid-template-columns:1fr}}',
    /* ---- 候选列表 / 手填表单 ---- */
    '.vf-candwrap{display:flex;flex-direction:column}',
    '.vf-cand{display:flex;align-items:flex-start;gap:12px;padding:11px 2px;border-bottom:1px solid var(--vf-line);transition:background .18s,padding-left .18s}',
    '.vf-cand:hover{background:linear-gradient(90deg,color-mix(in srgb,var(--vf-acc) 7%,transparent),transparent 58%);padding-left:8px}',
    '.vf-cand.on{background:linear-gradient(90deg,color-mix(in srgb,var(--vf-acc) 11%,transparent),transparent 62%)}',
    '.vf-pickbtn{width:24px;height:24px;margin-top:2px;flex:0 0 24px;border:1px solid var(--vf-line2);border-radius:6px;background:none;color:var(--vf-sub);cursor:pointer;font-size:13px;line-height:1}',
    '.vf-cand.on .vf-pickbtn{background:var(--vf-acc);border-color:var(--vf-acc);color:var(--vf-on-acc)}',
    '.vf-cmain{flex:1;min-width:0;cursor:pointer}',
    '.vf-cmain b{display:block;font-size:13.5px;font-weight:600;line-height:1.55}',
    '.vf-cmeta{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-top:5px}',
    '.vf-due{font-size:11px;font-weight:700;color:#b91c1c}',
    '.vf-lapse{font-size:11px;color:var(--vf-sub)}',
    'html[data-theme="night"] .vf-due{color:var(--danger,#ef6a63)}',
    '.vf-cfull{margin-top:9px;padding:10px 12px;border-left:2px solid var(--vf-acc);background:var(--vf-soft);font-size:12.5px;line-height:1.8;color:var(--vf-sub)}',
    '.vf-cfull p{margin:4px 0}.vf-cfull p em{font-style:normal;font-weight:700;color:var(--vf-ink);margin-right:6px}',
    '.vf-copts{display:grid;grid-template-columns:1fr 1fr;gap:2px 14px;margin:6px 0}',
    '.vf-copts i{color:var(--vf-acc);font-weight:700;margin-right:5px}',
    '.vf-mform{display:flex;flex-direction:column;gap:10px}',
    '.vf-fldrow{display:flex;gap:14px;flex-wrap:wrap}',
    '.vf-fld{display:flex;flex-direction:column;gap:5px;flex:1;min-width:200px}',
    '.vf-fld.grow{flex:1.6}',
    '.vf-fld>span{font-size:11.5px;font-weight:700;color:var(--vf-sub);letter-spacing:.04em}',
    /* ---- 托盘 ---- */
    '.vf-tray{margin-top:6px;border:1px dashed var(--vf-line2);border-radius:12px;padding:13px 15px;background:color-mix(in srgb,var(--vf-acc) 3%,transparent)}',
    '.vf-tray.empty{background:transparent}',
    '.vf-tray-h{display:flex;align-items:baseline;gap:10px}',
    '.vf-tray-h b{font-family:Georgia,serif;font-size:14.5px}.vf-tray-h em{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:10px;color:var(--vf-sub);letter-spacing:.1em}',
    '.vf-tray-h .vf-btn{margin-left:auto}',
    '.vf-traylist{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}',
    '.vf-trayitem{display:flex;align-items:center;gap:6px;max-width:100%;padding:6px 9px 6px 6px;border:1px solid var(--vf-line);border-radius:999px;background:var(--vf-bg);font-size:12px;transition:border-color .16s,box-shadow .16s}',
    '.vf-trayitem.sel{border-color:var(--vf-acc);box-shadow:0 0 0 1px var(--vf-acc)}',
    '.vf-tpick{border:0;background:none;color:var(--vf-acc);cursor:pointer;font-size:14px;padding:0 2px}',
    '.vf-tmain{min-width:0;display:flex;flex-direction:column;cursor:pointer}',
    '.vf-tmain b{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:340px}',
    '.vf-tmain span{color:var(--vf-sub);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:340px}',
    '.vf-xbtn{border:0;background:none;color:var(--vf-sub);cursor:pointer;font-size:15px;padding:0 4px}',
    '.vf-xbtn:hover{color:#b91c1c}',
    /* ---- 熔炉控制台 / 策略芯片 / 运行条 / 撤销条 ---- */
    '.vf-srow{display:flex;flex-wrap:wrap;gap:8px}',
    '.vf-schip{display:inline-flex;align-items:center;gap:5px;height:30px;padding:0 13px;border:1px solid var(--vf-line2);border-radius:999px;background:var(--vf-bg);font-size:12.5px;font-weight:600;color:var(--vf-sub);cursor:pointer;transition:all .16s}',
    '.vf-schip:hover{transform:translateY(-1px)}',
    '.vf-schip.c-num{--sc:var(--vf-c-num)}.vf-schip.c-ctx{--sc:var(--vf-c-ctx)}.vf-schip.c-up{--sc:var(--vf-c-up)}.vf-schip.c-down{--sc:var(--vf-c-down)}.vf-schip.c-rev{--sc:var(--vf-c-rev)}.vf-schip.c-trap{--sc:var(--vf-c-trap)}.vf-schip.c-opt{--sc:var(--vf-c-opt)}',
    '.vf-schip.on{color:var(--sc);border-color:currentColor;background:color-mix(in srgb,var(--sc) 13%,transparent)}',
    '.vf-lock{opacity:.5;font-size:9px}',
    '.vf-rrow{display:flex;align-items:center;gap:18px;flex-wrap:wrap;margin-top:14px}',
    '.vf-runbar{display:flex;align-items:center;gap:12px;flex:1;min-width:220px}',
    '.vf-prog{flex:1;height:8px;border-radius:999px;background:var(--vf-soft);overflow:hidden}',
    '.vf-prog b{display:block;height:100%;background:linear-gradient(90deg,var(--vf-acc),var(--vf-acc2));border-radius:999px;transition:width .45s cubic-bezier(.22,1,.36,1)}',
    '.vf-undostrip{display:flex;align-items:center;gap:8px;margin-top:12px;padding:8px 12px;border:1px dashed var(--vf-line2);border-radius:10px;font-size:12px;color:var(--vf-sub)}',
    '.vf-undostrip i{color:var(--vf-acc);display:inline-flex}.vf-undostrip i svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.8}',
    '.vf-undostrip .vf-btn{margin-left:auto}',
    /* ---- 谱系卡 / 变式卡 ---- */
    '.vf-lineage{border:1px solid var(--vf-line);border-radius:14px;padding:15px 17px;margin-bottom:16px;background:var(--vf-bg);transition:box-shadow .2s}',
    '.vf-lineage:hover{box-shadow:0 10px 26px -18px rgba(0,0,0,.28)}',
    '.vf-lineage.packed{border-left:3px solid var(--vf-acc)}',
    '.vf-lhead b{display:block;font-size:14px;font-weight:700;line-height:1.55}',
    '.vf-lhead>span{display:block;font-size:12px;color:var(--vf-sub);margin-top:3px}',
    '.vf-lnum{float:right;font-family:ui-monospace,Consolas,monospace;font-size:11px;color:var(--vf-sub)}',
    '.vf-origin{display:inline-block;font-size:10px;font-weight:700;letter-spacing:.05em;color:#8a6100;background:color-mix(in srgb,var(--warn,#f59e0b) 14%,transparent);border-radius:4px;padding:1px 6px;margin-left:6px;vertical-align:1px}',
    '.vf-origin.sk{color:#6d28d9;background:color-mix(in srgb,#7c3aed 12%,transparent)}',
    '.vf-origin.ok{color:#166534;background:color-mix(in srgb,#16a34a 12%,transparent)}',
    '.vf-cmp{margin:8px 0 2px;border-top:1px dashed var(--vf-line);padding-top:6px}',
    '.vf-cmp summary{cursor:pointer;font-size:12px;font-weight:600;color:var(--vf-acc)}',
    '.vf-cmp-body{margin-top:8px;padding:10px 12px;border:1px solid var(--vf-line);border-radius:10px;background:var(--vf-soft);font-size:13px;line-height:1.7}',
    '.vf-cmp-ans{margin:5px 0 0;font-size:12.5px;color:var(--vf-sub)}.vf-cmp-ans em{font-style:normal;font-weight:700;color:var(--vf-ink);margin-right:6px}',
    '.vf-vlist{margin-top:10px}',
    /* 骨架待办横幅：琥珀虚线胶囊,hover 提亮 —— 无 AI 路径的"还差最后一步"可见性 */
    '.vf-skeldots{display:flex;align-items:center;gap:7px;width:100%;margin:2px 0 8px;padding:8px 12px;border:1px dashed color-mix(in srgb,var(--vf-c-trap) 55%,transparent);border-radius:10px;background:color-mix(in srgb,var(--vf-c-trap) 7%,transparent);color:#8a6100;font-size:12.5px;font-weight:600;cursor:pointer;text-align:left;transition:background .16s,border-color .16s}',
    '.vf-skeldots:hover{background:color-mix(in srgb,var(--vf-c-trap) 13%,transparent);border-color:var(--vf-c-trap)}',
    '.vf-skeldots i{font-size:13px}',
    'html[data-theme="night"] .vf-skeldots{color:var(--vf-c-trap)}',
    '.vf-vrow{border:0;border-top:1px dashed var(--vf-line);padding:12px 0 4px}',
    '.vf-vrow:first-child{border-top:0}',
    '.vf-vrow.drop{opacity:.5}',
    '.vf-vrow.editing{border:1px solid var(--vf-acc2);border-radius:10px;padding:12px 13px}',
    '.vf-vhead{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:7px}',
    '.vf-vstem{font-size:13.5px;line-height:1.75;padding:2px 0 2px 12px;border-left:2px solid color-mix(in srgb,var(--vf-acc) 55%,transparent)}',
    '.vf-vstem.skel{color:var(--vf-sub);font-style:italic;border-left-color:var(--vf-line2)}',
    '.vf-fold{margin-top:7px;font-size:12.5px;color:var(--vf-sub)}',
    '.vf-fold summary{cursor:pointer;font-weight:600;color:var(--vf-acc);font-size:12px}',
    '.vf-fold p{margin:5px 0;line-height:1.75}.vf-fold p em{font-style:normal;font-weight:700;color:var(--vf-ink);margin-right:6px;font-size:11.5px}',
    '.vf-vacts{display:flex;align-items:center;gap:12px;margin-top:9px}',
    '.vf-skinchip{display:inline-flex;align-items:center;height:18px;padding:0 7px;border-radius:4px;font-size:10.5px;font-weight:700;color:#b91c1c;background:color-mix(in srgb,#dc2626 11%,transparent)}',
    /* 本地快检徽标 / 复核清单（2026-10-28 规范复核轮） */
    '.vf-qchip{display:inline-flex;align-items:center;height:18px;padding:0 7px;border-radius:4px;font-size:10.5px;font-weight:700;color:#b45309;background:color-mix(in srgb,#f59e0b 14%,transparent)}',
    '.vf-qchip.ok{color:#166534;background:color-mix(in srgb,#16a34a 12%,transparent)}',
    'html[data-theme="night"] .vf-qchip{color:var(--warn,#e8ae3f)}',
    'html[data-theme="night"] .vf-qchip.ok{color:#86efac}',
    '.vf-rev p{margin:6px 0;font-size:13px;line-height:1.8}',
    '.vf-rev .vf-quiet{font-size:12px;color:var(--vf-sub)}',
    '.vf-revline{display:flex;align-items:flex-start;gap:9px;padding:9px 4px;border-bottom:1px dashed var(--vf-line);font-size:13px;cursor:pointer}',
    '.vf-revline:last-child{border-bottom:0}',
    '.vf-revline input{accent-color:var(--vf-acc);width:16px;height:16px;margin-top:2px}',
    'html[data-theme="night"] .vf-skinchip{color:var(--danger,#ef6a63)}',
    '.vf-notechip{display:inline-flex;align-items:center;height:18px;padding:0 7px;border-radius:4px;font-size:10.5px;color:#8a6100;background:color-mix(in srgb,var(--warn,#f59e0b) 14%,transparent)}',
    '.vf-lacts{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:12px;padding-top:10px;border-top:1px dashed var(--vf-line)}',
    /* ---- dock（滑动胶囊指示器 + 红点） ---- */
    '.vf-dockwrap{position:fixed;left:0;right:0;bottom:0;z-index:40;display:flex;justify-content:center;padding:0 14px 12px;pointer-events:none}',
    '.vf-dock{position:relative;display:flex;gap:2px;padding:6px;pointer-events:auto;border-radius:19px;background:color-mix(in srgb,var(--vf-bg) 82%,transparent);backdrop-filter:blur(16px) saturate(1.2);-webkit-backdrop-filter:blur(16px) saturate(1.2);border:1px solid var(--vf-line);box-shadow:0 14px 38px -18px rgba(15,23,42,.4)}',
    '.vf-dock-ind{position:absolute;top:6px;bottom:6px;left:6px;width:10px;border-radius:13px;background:color-mix(in srgb,var(--vf-acc) 16%,transparent);transition:transform .32s cubic-bezier(.22,1,.36,1),width .32s cubic-bezier(.22,1,.36,1)}',
    '.vf-dock-item{position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;min-width:76px;padding:8px 14px;border:0;border-radius:13px;background:none;color:var(--vf-sub);font-size:11.5px;font-weight:600;cursor:pointer;transition:color .18s}',
    '.vf-dock-item svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.7}',
    '.vf-dock-item:hover{color:var(--vf-ink)}',
    '.vf-dock-item.on{color:var(--vf-acc)}',
    '.vf-dot{position:absolute;top:6px;right:10px;width:7px;height:7px;border-radius:50%;background:transparent}',
    '.vf-dot.on{background:#dc2626;box-shadow:0 0 0 2px color-mix(in srgb,var(--vf-bg) 80%,transparent)}',
    '.vf-dot.pack.on{background:var(--vf-acc2)}',
    /* ---- 谱系图 ---- */
    '.vf-atlaswrap{display:flex;gap:18px;align-items:flex-start}',
    '.vf-alist{width:225px;flex:0 0 225px;display:flex;flex-direction:column;gap:4px;max-height:430px;overflow:auto;padding-right:4px}',
    '.vf-alitem{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:8px 11px;border:1px solid transparent;border-radius:9px;background:none;cursor:pointer;text-align:left;transition:background .16s,border-color .16s}',
    '.vf-alitem b{font-size:12.5px;font-weight:600;line-height:1.45}',
    '.vf-alitem span{font-size:11px;color:var(--vf-sub)}',
    '.vf-alitem:hover{background:var(--vf-soft)}',
    '.vf-alitem.on{border-color:var(--vf-acc);background:color-mix(in srgb,var(--vf-acc) 8%,transparent)}',
    '.vf-acanvas{flex:1;min-width:0}',
    '.vf-atlas{width:100%;height:auto;display:block}',
    '.vf-orbit{fill:none;stroke:var(--vf-line);stroke-dasharray:3 5}',
    '.vf-spoke{stroke:color-mix(in srgb,var(--vf-ink) 18%,transparent);stroke-width:1.2}',
    '.vf-spoke.drop{stroke-dasharray:2 4;opacity:.4}',
    '.vf-sun circle{fill:color-mix(in srgb,var(--vf-acc) 14%,transparent);stroke:var(--vf-acc);stroke-width:2}',
    '.vf-sun text{fill:var(--vf-acc);font:700 12px/1 Georgia,"Songti SC",serif;text-anchor:middle}',
    '.vf-node{cursor:pointer}',
    '.vf-node circle:first-of-type{stroke:var(--vf-bg);stroke-width:1.5;opacity:.92;transition:transform .16s}',
    '.vf-node:hover circle:first-of-type{transform:scale(1.14);transform-box:fill-box;transform-origin:center}',
    '.vf-node.sel circle:first-of-type{stroke:var(--vf-ink);stroke-width:2}',
    '.vf-node text{fill:var(--vf-on-acc);font:700 10px/1 ui-monospace,Consolas,monospace;text-anchor:middle;pointer-events:none}',
    'html[data-theme="night"] .vf-node text{fill:#20242c}',
    '.vf-node.c-num circle{fill:var(--vf-c-num)}.vf-node.c-ctx circle{fill:var(--vf-c-ctx)}.vf-node.c-up circle{fill:var(--vf-c-up)}.vf-node.c-down circle{fill:var(--vf-c-down)}.vf-node.c-rev circle{fill:var(--vf-c-rev)}.vf-node.c-trap circle{fill:var(--vf-c-trap)}.vf-node.c-opt circle{fill:var(--vf-c-opt)}',
    '.vf-node.st-new circle:first-of-type{opacity:.55}',
    '.vf-node.st-drop circle:first-of-type{opacity:.25;stroke-dasharray:3 3;stroke:var(--vf-sub)}',
    '.vf-node.st-drop text{opacity:.3}',
    '.vf-keepering{fill:none;stroke:var(--vf-acc);stroke-width:1.6;opacity:.75;animation:vfBreathe 2.6s ease-in-out infinite}',
    '@keyframes vfBreathe{0%,100%{opacity:.75}50%{opacity:.25}}',
    '.vf-skinmark{fill:#fff;font:700 11px ui-monospace,Consolas,monospace;text-anchor:middle}',
    '.vf-legend{display:flex;flex-wrap:wrap;gap:10px 16px;margin-top:8px;font-size:11px;color:var(--vf-sub)}',
    '.vf-legend i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px;vertical-align:-1px}',
    '.vf-legend .c-num{background:var(--vf-c-num)}.vf-legend .c-ctx{background:var(--vf-c-ctx)}.vf-legend .c-up{background:var(--vf-c-up)}.vf-legend .c-down{background:var(--vf-c-down)}.vf-legend .c-rev{background:var(--vf-c-rev)}.vf-legend .c-trap{background:var(--vf-c-trap)}.vf-legend .c-opt{background:var(--vf-c-opt)}',
    '.vf-legend .lg-st i.k{border:2px solid var(--vf-acc);background:none}.vf-legend .lg-st i.n{background:var(--vf-line2)}.vf-legend .lg-st i.d{border:1px dashed var(--vf-sub);background:none}',
    '.vf-afocus{margin-top:14px;border-top:1px dashed var(--vf-line);padding-top:12px}',
    /* ---- 打包视图 ---- */
    '.vf-pgroup{margin-bottom:14px}',
    '.vf-pgh{display:flex;align-items:baseline;gap:10px;padding-bottom:6px;border-bottom:1px dashed var(--vf-line)}',
    '.vf-pgh b{font-size:13px;font-weight:700}.vf-pgh em{font-style:normal;font-size:11px;color:var(--vf-sub);margin-left:auto}',
    '.vf-pick{display:flex;align-items:center;gap:10px;padding:9px 4px;border-bottom:1px solid color-mix(in srgb,var(--vf-line) 60%,transparent);cursor:pointer;transition:background .16s}',
    '.vf-pick:hover{background:color-mix(in srgb,var(--vf-acc) 5%,transparent)}',
    '.vf-pick input{accent-color:var(--vf-acc);width:16px;height:16px;flex:0 0 16px}',
    '.vf-pick .pv{display:flex;gap:5px;flex:0 0 auto}',
    '.vf-pick .ps{min-width:0;font-size:13px;line-height:1.5;flex:1}',
    '.vf-prow{display:flex;align-items:center;gap:12px;padding:11px 2px;border-bottom:1px solid var(--vf-line)}',
    '.vf-prow:last-child{border-bottom:0}',
    '.vf-pmain{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}',
    '.vf-pmain b{font-size:13.5px}.vf-pmain span{font-size:11.5px;color:var(--vf-sub)}',
    '.vf-grade{font-family:ui-monospace,Consolas,monospace;font-size:12px;font-weight:700;color:var(--vf-acc);white-space:nowrap}',
    '.vf-grade.todo{color:var(--vf-sub);font-weight:400}',
    '.vf-prow.plain .vf-btn{display:none}',
    /* ---- 卷面预览 ---- */
    '.vf-pvpaper{border:1px solid var(--vf-line);border-radius:12px;padding:15px 17px;margin-bottom:14px;background:var(--vf-bg)}',
    '.vf-pvhead{display:flex;align-items:baseline;gap:10px;border-bottom:1px dashed var(--vf-line);padding-bottom:8px;margin-bottom:10px}',
    '.vf-pvhead b{font-family:Georgia,"Songti SC",serif;font-size:15px}',
    '.vf-pvhead span{font-size:11.5px;color:var(--vf-sub);margin-left:auto}',
    '.vf-pvq{display:flex;gap:8px;font-size:13px;line-height:1.75;padding:5px 0}',
    '.vf-pvq i{color:var(--vf-acc);font-weight:700;flex:0 0 auto}',
    '.vf-pvq s{margin-left:auto;flex:0 0 auto;text-decoration:none;font-family:ui-monospace,Consolas,monospace;font-size:11px;color:var(--vf-sub)}',
    '.vf-pvopts{display:block;margin-top:3px}',
    '.vf-pvopts em{font-style:normal;color:var(--vf-sub);margin-right:2px}',
    '.vf-pvopts em:not(:first-of-type){margin-left:12px}',
    '.vf-pvans{margin:2px 0 8px 22px;padding:7px 10px;border-left:2px solid var(--vf-c-down);background:var(--vf-soft);font-size:12.5px;line-height:1.7}',
    '.vf-pvans b{font-size:11px;margin-right:5px}',
    /* ---- 档案视图 ---- */
    '.vf-kgrid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:16px}',
    '.vf-kc{border:1px solid var(--vf-line);border-radius:12px;padding:13px 15px;display:flex;flex-direction:column;gap:2px;background:var(--vf-bg);transition:transform .16s,box-shadow .16s}',
    '.vf-kc:hover{transform:translateY(-2px);box-shadow:0 10px 24px -16px rgba(15,23,42,.4)}',
    '.vf-kc b{font-family:Georgia,serif;font-size:24px;font-variant-numeric:tabular-nums;line-height:1.1}',
    '.vf-kc i{font-size:11px;color:var(--vf-sub);letter-spacing:.06em}',
    '.vf-kc.warn b{color:#b45309}',
    'html[data-theme="night"] .vf-kc.warn b{color:var(--warn,#e8ae3f)}',
    '.vf-bars{width:100%;max-width:560px;height:auto}',
    '.vf-bars .gbar{fill:color-mix(in srgb,var(--vf-acc2) 55%,transparent)}',
    '.vf-bars .kbar{fill:var(--vf-acc)}',
    '.vf-bars .pbar{fill:var(--vf-c-trap)}',
    '.vf-bars .dlabel{fill:var(--vf-sub);font:9px ui-monospace,Consolas,monospace;text-anchor:middle}',
    '.vf-hint .lg{display:inline-block;width:9px;height:9px;border-radius:2px;vertical-align:-1px;margin-left:10px}',
    '.vf-hint .lg.g{background:color-mix(in srgb,var(--vf-acc2) 55%,transparent)}.vf-hint .lg.k{background:var(--vf-acc)}.vf-hint .lg.p{background:var(--vf-c-trap)}',
    '.vf-srow2{display:flex;align-items:center;gap:12px;padding:7px 0}',
    '.vf-srow2 .nm{flex:0 0 110px}.vf-srow2 .track{flex:1;height:8px;border-radius:999px;background:var(--vf-soft);overflow:hidden}',
    '.vf-srow2 .track b{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,var(--vf-acc),var(--vf-acc2));transition:width .5s cubic-bezier(.22,1,.36,1)}',
    '.vf-srow2 .num{flex:0 0 170px;text-align:right;font-family:ui-monospace,Consolas,monospace;font-size:11.5px;color:var(--vf-sub)}',
    '.vf-srow2 .vf-btn{margin-left:4px;opacity:0;max-width:0;padding:0;overflow:hidden;white-space:nowrap;transition:opacity .16s}',
    '.vf-srow2:hover .vf-btn,.vf-srow2.warn .vf-btn{opacity:1;max-width:96px;padding:0 1px}',
    '.vf-srow2.warn .track b{background:#b45309}',
    '.vf-srow2.warn .num{color:#b45309;font-weight:700}',
    'html[data-theme="night"] .vf-srow2.warn .track b{background:var(--warn,#e8ae3f)}',
    'html[data-theme="night"] .vf-srow2.warn .num{color:var(--warn,#e8ae3f)}',
    '.vf-two{display:grid;grid-template-columns:1fr 1fr;gap:18px}',
    '@media (max-width:700px){.vf-two{grid-template-columns:1fr}}',
    '.vf-two .sub{display:block;font-size:11px;font-weight:700;letter-spacing:.06em;color:var(--vf-sub);margin-bottom:6px}',
    '.vf-distro{display:flex;flex-direction:column;gap:4px}',
    '.vf-drow{display:flex;align-items:center;gap:10px}',
    '.vf-drow .dn{flex:0 0 90px;font-size:12px;color:var(--vf-sub)}',
    '.vf-drow .dtrack{flex:1;height:8px;border-radius:999px;background:var(--vf-soft);overflow:hidden}',
    '.vf-drow .dtrack b{display:block;height:100%;border-radius:999px;background:var(--vf-acc)}',
    '.vf-distro.subj .dtrack b{background:var(--vf-acc2)}',
    '.vf-drow .dv{flex:0 0 34px;text-align:right;font-family:ui-monospace,Consolas,monospace;font-size:11px;color:var(--vf-sub);font-variant-numeric:tabular-nums}',
    '.vf-wprow{display:flex;align-items:center;gap:12px;padding:9px 2px;border-bottom:1px dashed var(--vf-line)}',
    '.vf-wprow:last-child{border-bottom:0}',
    '.vf-wprow i{flex:0 0 22px;height:22px;display:grid;place-items:center;border-radius:7px;background:color-mix(in srgb,var(--vf-c-trap) 15%,transparent);color:#8a6100;font-size:11px;font-weight:700}',
    'html[data-theme="night"] .vf-wprow i{color:var(--vf-c-trap)}',
    '.vf-wprow .w{flex:1;min-width:0;font-size:12.5px;line-height:1.5}',
    '.vf-wprow .c{font-size:11px;color:var(--vf-sub);white-space:nowrap;font-variant-numeric:tabular-nums}',
    /* ---- 空态 ---- */
    '.vf-empty{display:flex;flex-direction:column;align-items:center;gap:8px;padding:38px 20px;border:1px dashed var(--vf-line2);border-radius:14px;text-align:center}',
    '.vf-empty i{color:color-mix(in srgb,var(--vf-acc) 40%,transparent);display:inline-flex}',
    '.vf-empty b{font-family:Georgia,"Songti SC",serif;font-size:15px}',
    '.vf-empty span{font-size:12px;color:var(--vf-sub);max-width:420px;line-height:1.8}',
    '.vf-empty .vf-btn{margin-top:6px}',
    /* ---- 窄屏 / 动效降级 ---- */
    '@media (max-width:780px){.vf-kpis{display:none}.vf-kgrid{grid-template-columns:repeat(2,1fr)}.vf-atlaswrap{flex-direction:column}.vf-alist{width:100%;flex:0 0 auto;max-height:150px}.vf-copts{grid-template-columns:1fr}.vf-dock-item{min-width:60px;padding:8px 8px}.vf-num{width:52px}}',
    '@media (prefers-reduced-motion:reduce){.vf-root *,.vf-root *::before,.vf-root *::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}'
  ].join('')

/* c10: 增值能力层（常驻面板 / 教练技能 / 插件间服务） */
  /* ---- 右下角常驻面板：只读 + 两个直达按钮（交互全部留在工具页，避免两套状态源） ---- */
  function panelRender(ctx, box) {
    let db = loadDb(ctx)
    let d = db.day[todayKey()] || { gen: 0, keep: 0, paper: 0 }
    let pool = keptPool(db).filter(function (it) { return !it.L.paperId }).length
    let stage = db.staged.length ? '托盘有 ' + db.staged.length + ' 道母题待开炉'
      : (pool ? '有 ' + pool + ' 道留用变式待成卷' : (db.lineages.length ? '库存健康，等下一道错题' : '还没有开过炉'))
    /* 宿主契约（pluginbus openPanel）：传 box 则写入并绑交互，同时**永远返回 HTML 字符串**
     * —— 守门 plugin-capability 用单参 stub 调它只看返回值；feynman 同规范，两边不落空。 */
    let html = ''
      + '<div class="vf-panel">'
      + '<div class="vf-panel-top"><span class="vf-mark-sm">' + MARK_TILE + '</span><b>变式工厂</b><em>TODAY</em></div>'
      + '<div class="vf-panel-kpis">'
      + '<span class="pk"><b>' + d.gen + '</b><i>今日生成</i></span>'
      + '<span class="pk"><b>' + d.keep + '</b><i>今日留用</i></span>'
      + '<span class="pk"><b>' + pool + '</b><i>待成卷</i></span>'
      + '</div>'
      + '<p class="vf-panel-stage">' + esc(stage) + '</p>'
      + '<div class="vf-panel-acts">'
      + '<button class="btn btn-sm btn-primary" data-p="open">打开工厂</button>'
      + (pool ? '<button class="btn btn-sm btn-ghost" data-p="pack">去打包</button>' : '')
      + '</div></div>'
    if (box) {
      box.innerHTML = html
      let b1 = box.querySelector('[data-p="open"]')
      if (b1) b1.onclick = function () { try { ctx.api.goTool(TOOL_ID) } catch (e) { try { window.App && window.App.go(TOOL_ID) } catch (e2) { } } }
      let b2 = box.querySelector('[data-p="pack"]')
      if (b2) b2.onclick = function () { try { ctx.api.goTool(TOOL_ID, { view: 'pack' }) } catch (e) { } }
    }
    return html
  }

  /* ---- 教练技能：触发词进教练（三级匹配在 skillkit/教练里，这里只声明） ---- */
  let SKILLS = [
    {
      trigger: '变式',
      title: '变式处方 · 一题的纠偏路径',
      summary: '按七策略为卡住的题目开变式处方，并引导去工厂一键批量生成',
      when: '用户说「这道题总出错 / 想要几道类似的练 / 换个问法我再试试」时',
      prompt: '你是变式题工厂的处方参谋。先问清用户卡住的具体题目或错因（若上文中能读到原题就更好）。'
        + '然后从七种策略里选 2~3 种最对症的：数值变体（背模板型错误）/情境换壳（认不出题型）/难度升阶（吃不饱）/难度降阶（连母题都卡）/逆向设问（只会单向）/陷阱靶向（同一个坑反复踩）/选项扰动（选择题总选错干扰项），'
        + '每种给一句「为什么这一剂对你有效」，并引导用户：到「变式题工厂」→ 选题台勾选该错题 → 熔炉勾上这些策略 → 开炉。'
        + '可参考 [[QUERY:ledger]] 与 [[QUERY:pool]] 了解用户工厂存量，别让他重复开已有谱系的炉。'
    },
    {
      trigger: '错因复盘',
      title: '错因复盘 · 坑位榜巡诊',
      summary: '拉工厂坑位榜与交卷回流，分析哪些坑被变式围剿过、还守不守得住',
      when: '用户说「复盘我的错因 / 我总在哪翻车」且装并启用了变式题工厂时',
      prompt: '先取 [[QUERY:ledger]] 看工厂总体账（生成量/留用率/交卷得分率）；'
        + '再让用户口述最近 3 道错题的坑，与工厂「档案 → 坑位榜」里高频坑交叉比对：'
        + '已被变式围剿过的坑（谱系 trap 相同且有留用卷已交）重点问得分率——得分仍低就建议对该谱系再开一炉升阶；'
        + '从没进过工厂的新坑，建议直接送选题台建档。最后给一条「本周只围剿一个坑」的收敛建议。'
    }
  ]

  /* ---- 插件间服务：其他插件 ctx.call('variant-forge', …)；签名 fn(ctx, ...args) ---- */
  let SERVICES = {
    /** 库存总览 {src,gen,kept,papers,pool,staged} */
    summary: function (ctx) {
      let db = loadDb(ctx)
      let t = dbTotals(db)
      return {
        src: t.src, gen: t.gen, kept: t.kept, papers: t.papers,
        pool: keptPool(db).filter(function (it) { return !it.L.paperId }).length,
        staged: db.staged.length
      }
    },
    /** 往熔炉托盘投一道母题（刷题场战败题可趁热送进来）；返回条目 id，托盘满/缺题干回 null */
    addSeed: function (ctx, seed) {
      seed = seed || {}
      if (!String(seed.stem || '').trim()) return null
      let db = loadDb(ctx)
      if (db.staged.length >= MAX_STAGED) return null
      if (stemDup(db, seed.stem)) return null /* 重复投递如实拒收，调用方自查 */
      let s = normStaged({
        srcType: 'manual', subject: String(seed.subject || '数学'),
        stem: String(seed.stem), options: Array.isArray(seed.options) ? seed.options : null,
        answer: String(seed.answer || ''), solution: String(seed.solution || ''),
        trap: String(seed.trap || ''), point: String(seed.point || '')
      })
      db.staged.push(s)
      saveDb(ctx, db)
      try { ctx.log('外部插件向托盘投递母题（' + s.subject + '）') } catch (e) { }
      return s.id
    },
    /** 最近 N 条谱系的紧凑摘要（只给文本级字段，不把整版题目推给调用方） */
    recent: function (ctx, n) {
      let db = loadDb(ctx)
      return db.lineages.slice(0, clamp(n, 1, 20)).map(function (L) {
        let s = lineageStat(L)
        return {
          id: L.id, subject: L.subject, stem: shortText(L.stem, 60),
          variants: s.total, kept: s.kept, packed: !!L.paperId,
          strategies: (L.variants || []).map(function (v) { return v.strategy })
        }
      })
    }
  }

/* c11: 注册（manifest）+ 调试钩子 + 收尾 */
  /* 只注册一个工具页：五个视图共享同一份进行中档案（S 与 db），
   * 拆成多个工具页会把「熔炉到一半去打包」变成跨页接力 —— 得不偿失。
   * 路由仍是 /tool/variant-forge（工具页 id 即路由）。 */
  let api = {
    id: TOOL_ID,
    name: '变式题工厂',
    version: VERSION,
    author: 'kaoyan-v2',
    desc: '错题 → 七策略批量AI变式（换数/换壳/升阶/降阶/逆问/靶向/扰支）→ 星形谱系图 → 留用一键成卷重做；疑似换皮与答案质检如实标出，交卷成绩自动回流，策略留用率如实质检。未配置 AI 降级为骨架变式，功能不残缺。',
    memory: '变式题工厂：用户从错题本/题库/试卷挑母题，AI 批量出同源变式并留用成卷；档案存插件命名空间（谱系/策略账/卷记录）。教练问「变式/举一反三/错这道该练什么」可引用其 ledger 查询。',
    tools: [
      {
        id: TOOL_ID, title: '变式题工厂', icon: MARK_TILE,
        mount: function (el, ctx) { return mountShell(el, ctx) }
      }
    ],
    /* 常驻面板：不进工厂也看得见今日炉况（只读，交互全留工具页） */
    panels: [
      { id: 'vf-stock', title: '变式工厂 · 库存', icon: MARK_TILE, width: 300, height: 250, render: panelRender }
    ],
    /* 教练触发词技能 */
    skills: SKILLS,
    /* 插件间服务：刷题场战败题可 addSeed 趁热进托盘 */
    services: SERVICES,
    init: function (ctx) {
      HOST_CTX = ctx
      /* 把两条业务场景登记进 AI 注册表：少了这一步，参数中心里根本没有它们，
       * 用户配的思考档/Token 永远作用不到本插件，用量也全进不了自己的桶。 */
      try {
        if (ctx.ai && typeof ctx.ai.registerCtx === 'function') {
          ctx.ai.registerCtx({
            ctx: AI_CTX_GEN,
            name: '变式工厂 · 批量开炉',
            desc: '给定母题按所选策略批量出变式（LaTeX 公式契约、逐路配额、可验算题先 Python 算再作答、只回 JSON）',
            def: 'think', latexNeed: true, tools: 'py', recall: false
          })
          ctx.ai.registerCtx({
            ctx: AI_CTX_AUDIT,
            name: '变式工厂 · 变式质检',
            desc: '核对已生成变式的答案自洽性与真变式程度（可验算题用 Python 复算，宁缺毋滥，只标问题不改题）',
            def: 'noThink', latexNeed: true, tools: 'py', recall: false
          })
        }
      } catch (e) { /* 注册失败不阻断：AI 照常可用，只是进不了参数中心 */ }
      try {
        ctx.log('变式题工厂 v' + VERSION + ' 就绪（AI ' + (aiOk(ctx) ? '可用' : '未配置，开炉降级为骨架变式') + '）')
      } catch (e) { }
    },
    config: [
      { key: 'countPerRun', label: '每道母题出几道变式', type: 'number', default: 4, desc: '1~12；实际以「单炉上限 − 现存」截断' },
      { key: 'capPerSrc', label: '单条谱系变式上限', type: 'number', default: 8, desc: '含历史；超出会如实跳过（不挤掉留用/弃用）' },
      { key: 'scorePerQ', label: '变式卷每题分值', type: 'number', default: 10, desc: '打包时的默认分值' },
      { key: 'timePerQ', label: '变式卷单题限时（分钟）', type: 'number', default: 3, desc: '整卷时限 = 题数 × 单题限时' },
      { key: 'autoOpen', label: '成卷后直接跳去做题', type: 'bool', default: true, desc: '关掉则停在打包台，自己去「我的题卷」开' },
      { key: 'requireReview', label: '疑点变式必须复核后才能成卷', type: 'bool', default: true, desc: '本地快检命中（缺答案/选项异常/不自足/换皮）的题，复核通过前成卷会如实跳过' }
    ],
    /* 交卷回流：sprint 判分处 emit('examGraded',{examId,score,total,wrongCount})。
     * 只认领打过「变式工厂」行踪的卷 —— 别的卷成绩不碰，同一张卷也不双计。 */
    hooks: {
      examGraded: function (ctx, payload) {
        try {
          if (!payload || !payload.examId) return
          let db = loadDb(ctx)
          let hit = null
          db.papers.forEach(function (p) { if (p.id === String(payload.examId)) hit = p })
          if (!hit || (hit.graded && hit.graded.at)) return
          hit.graded = {
            score: clamp(payload.score, 0, 1000),
            total: clamp(payload.total, 0, 1000),
            wrongCount: clamp(payload.wrongCount, 0, 999),
            at: nowIso()
          }
          bumpDay(db, 'grade', 1)
          saveDb(ctx, db)
          ctx.log('变式卷成绩已回流：' + hit.title + ' ' + hit.graded.score + '/' + hit.graded.total)
        } catch (e) { /* 回流失败绝不影响交卷主流程 */ }
      }
    },
    /* 教练 [[QUERY:…]] 可直查的两笔账 */
    queries: [
      {
        key: 'ledger', label: '变式工厂生产账（母题/生成/留用/成卷/得分率）',
        run: function (ctx) {
          let db = loadDb(ctx)
          let t = dbTotals(db)
          if (!t.src) return '变式工厂还没开过炉。'
          let best = strategyReport(db).filter(function (r) { return r.gen >= 3 }).sort(function (a, b) { return b.rate - a.rate })[0]
          let worst = strategyReport(db).filter(function (r) { return r.warn })
          let s = '母题 ' + t.src + ' 道，生成变式 ' + t.gen + ' 道，留用 ' + t.kept + '（' + pctStr(t.kept, t.gen) + '）；组卷 ' + t.papers + ' 张，交卷 ' + t.graded + ' 张'
          if (t.graded) s += '，得分率 ' + pctStr(Math.round(t.scoreRate * 100), 100)
          if (best) s += '。留用率最高策略：' + best.name + '（' + pctStr(best.keep, best.gen) + '）'
          if (worst.length) s += '。质量预警策略：' + worst.map(function (r) { return r.name }).join('、') + '（留用率过低，建议下炉少勾）'
          return s + '。'
        }
      },
      {
        key: 'pool', label: '还有多少留用变式没成卷',
        run: function (ctx) {
          let db = loadDb(ctx)
          let pool = keptPool(db).filter(function (it) { return !it.L.paperId })
          if (!pool.length) return '没有待打包的留用变式。'
          let bys = {}
          pool.forEach(function (it) { bys[it.L.subject] = (bys[it.L.subject] || 0) + 1 })
          let s = Object.keys(bys).map(function (k) { return k + ' ' + bys[k] + ' 道' }).join('、')
          return '有 ' + pool.length + ' 道留用变式还没组卷（' + s + '），在变式工厂「打包」视图可一键成卷。'
        }
      }
    ],
    shortcuts: [
      {
        key: 'alt+v', label: '直达变式工厂',
        run: function (ctx) {
          try {
            if (ctx && ctx.api && ctx.api.goTool) ctx.api.goTool(TOOL_ID)
            else if (window.App) window.App.go(TOOL_ID)
          } catch (e) { /* 忽略 */ }
        }
      }
    ],
    css: CSS
  }

  /* 调试钩子（仅站内显式打开时暴露）：纯判据挂出来，单测直接打，
   * 不必为了测「换皮检测怎么算」去驱动整个 DOM。与费曼晶体同款约定。 */
  if (window.__VFORGE_DEBUG__) {
    window.__vforgeInternals = {
      esc, clamp, shortText, fingerprint, sim2, digitsOf,
      diffOf, diffStep, stratOf, STRATS, DIFFS, VIEWS,
      emptyDb, normDb, normVariant, normLineage, normStaged, normPaper,
      lineageStat, dbTotals, last14, weakPoints, strategyReport, skinCheck, stemDup,
      buildGenAsk, parseGenResult, buildAuditAsk, parseAudit,
      skeletonVariants, trimVariants,
      buildDrafts, variantToQuestion, subjectSplit, buildPaperMd, buildReport,
      quickIssues, issueLabel, genSystem,
      MAX_STAGED, MAX_LINEAGES, MAX_VARIANTS,
      PAPER_TAG, TOOL_ID, VERSION,
      CSS_LEN: CSS.length, CSS_EXTRA_LEN: CSS_EXTRA.length
    }
  }

  PluginBus.register(api)
})()
