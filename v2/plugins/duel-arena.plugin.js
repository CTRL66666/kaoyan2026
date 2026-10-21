/* ============================================================
 * duel-arena.plugin.js — 博弈刷题场（单文件插件）· v1.0.0
 * ------------------------------------------------------------
 * 干什么：把刷题变成 PvE 决斗 —— AI 生成选择题，你和天梯上的 AI 对手竞速对答，
 *         ELO 天梯晋级，「心魔」Boss 在高分段等你。quizDone 钩子给护盾奖励。
 *
 * v1.2 站内数据接入（只读优先，写回单点）：
 *   · 出题来源四选一：AI 智能 / 站内题库（Store.quizBank 收藏题直接抽，零 AI）/
 *     题卷挑战（sprintData.mockExams 整卷选择题）/ 弱项突击（AI 读 mistakes 错题本
 *     + 可选 studyBooks 资料库讲义节选针对性命题）；
 *   · 战败题一键回写站内原生错题本（Store.mistakes，dedupKey 去重幂等，可关）。
 *
 * 与闪卡/复试舱同一套工程纪律：
 *   · 零外部依赖，只用插件公开契约（ctx.* / window / document）；
 *   · 站点设计令牌 + 单例 <style> 注入（绕开 css 字段 20K 截断）；
 *   · 吸顶页眉复用原生机制（root 撑满 / hero 直挂 sticky / scroll 切压缩态）。
 *
 * 决斗判定全部确定性：AI 只负责出题（一次生成整场），对手答题由种子随机
 * （mulberry32）按对手命中率×难度修正模拟 —— 不依赖第二次 AI 调用，
 * 判定可复现、可单测（种子进编年史）。
 *
 * 伤害模型：答对 → 对敌方造成伤害（18 + 速度加成 0-10 + 难度×2）；
 * 双方都答对 → 互相小幅反震（各 8）；答错/超时 → 若对手答对则承伤（18 + 难度）。
 * 问数耗尽比剩余 HP，或一方 HP 归零提前 KO。
 *
 * 安装：插件中心 →「粘贴导入」→ 选择本文件（.js）。
 * ============================================================ */
;(function () {
  'use strict'

  /* ════════════════════════ 0. 常量与元信息 ════════════════════════ */

  let VERSION = '1.2.0'
  /* 【站内适配 2026-10-22】ctx 必须落在 `plugin.<完整 pid>.<场景>` 才能进站内 AI 注册表
   * （`plugin.duel` 只有两段，registerAiCtx 会拒）。注册后吃得到站内思考档位、公式契约与用量分桶。 */
  let AI_CTX = 'plugin.duel-arena.gen'
  let T_MAIN = 'duel-arena'

  let HISTORY_MAX = 50          /* 编年史（随云同步）条数闸 */
  let STREAK_MAX = 5            /* 连胜 ELO 加成上限（每场 +streak，最高 +5） */
  let WRONG_BOOK_MAX = 100      /* 错题本上限（云同步） */
  let DAILY_BONUS = 10          /* 每日挑战胜利奖励 ELO */
  let REVIEW_KEEP_KEY = 'lastReview' /* 赛后题目回顾存 keep（本地，不进云同步编年史） */

  let SUBJECTS = ['数学', '英语', '政治', '专业课']

  /* 段位称号：按 ELO 取第一个命中的；弑魔者无视段位。起点 1000 = 见习斗士 */
  let TITLES = [
    { min: 2300, icon: '🌑', name: '心魔共舞者' },
    { min: 2150, icon: '🌅', name: '半步上岸' },
    { min: 1950, icon: '👻', name: '图书馆传说' },
    { min: 1750, icon: '🧤', name: '满分手套继承者' },
    { min: 1550, icon: '⛏️', name: '真题大师' },
    { min: 1350, icon: '🧩', name: '套路猎手' },
    { min: 1200, icon: '📓', name: '解题熟手' },
    { min: 1080, icon: '📚', name: '自习室新星' },
    { min: 0, icon: '🐣', name: '见习斗士' }
  ]

  /* 成就徽章：cond(last, p) 判定；last 为上一场结算快照 */
  let BADGES = [
    { id: 'first-blood', icon: '🩸', name: '首胜', desc: '赢第一场决斗', cond: function (l, p) { return p.wins >= 1 } },
    { id: 'streak-3', icon: '🔥', name: '三连胜', desc: '连胜达到 3', cond: function (l, p) { return p.streak >= 3 } },
    { id: 'streak-5', icon: '☄️', name: '五连胜', desc: '连胜达到 5', cond: function (l, p) { return p.streak >= 5 } },
    { id: 'ko-win', icon: '💥', name: 'KO 取胜', desc: '把对手 HP 打空', cond: function (l) { return l.score === 1 && l.ko } },
    { id: 'flawless', icon: '💎', name: '完胜', desc: '单场全部答对', cond: function (l) { return l.score === 1 && l.allCorrect } },
    { id: 'swift', icon: '⚡', name: '快剑', desc: '单场 ≥5 题全对且平均 8 秒内', cond: function (l) { return l.score === 1 && l.allCorrect && l.answered >= 5 && l.avgUsed < 8 } },
    { id: 'giant-killer', icon: '🎯', name: '以下克上', desc: '战胜 ELO 高你 300+ 的对手', cond: function (l) { return l.score === 1 && l.oppEloGap >= 300 } },
    { id: 'boss-slayer', icon: '🗡️', name: '弑魔者', desc: '击败心魔', cond: function (l) { return l.score === 1 && l.oppBoss } },
    { id: 'comeback', icon: '🛟', name: '绝地翻盘', desc: 'HP 低于 20 时获胜', cond: function (l) { return l.score === 1 && l.pHp > 0 && l.pHp < 20 } },
    { id: 'veteran', icon: '🎖️', name: '身经百战', desc: '累计 10 场决斗', cond: function (l, p) { return p.wins + p.losses + p.draws >= 10 } }
  ]

  /* 天梯：命中率 acc 是「中等难度题的答对概率」，难度修正见 oppAnswersCorrect */
  let LADDER = [
    { id: 'o1', name: '草稿纸学徒', icon: '🐣', elo: 800, acc: 0.55, tag: '刚翻开习题册的新手' },
    { id: 'o2', name: '自习室常客', icon: '📚', elo: 950, acc: 0.62, tag: '闭馆音乐一响就走的那个' },
    { id: 'o3', name: '错题本收藏家', icon: '📓', elo: 1100, acc: 0.68, tag: '本子很厚，分数很稳' },
    { id: 'o4', name: '真题考古者', icon: '⛏️', elo: 1250, acc: 0.73, tag: '从 2003 年挖到去年的那种人' },
    { id: 'o5', name: '倒计时信徒', icon: '⏳', elo: 1400, acc: 0.78, tag: '日历上全是红圈' },
    { id: 'o6', name: '套路拆解师', icon: '🧩', elo: 1550, acc: 0.82, tag: '看见题干就拆骨架' },
    { id: 'o7', name: '命题人影子', icon: '🎭', elo: 1700, acc: 0.86, tag: '出题思路比你还熟' },
    { id: 'o8', name: '满分手套', icon: '🧤', elo: 1850, acc: 0.89, tag: '据说从没沾过墨水' },
    { id: 'o9', name: '图书馆幽灵', icon: '👻', elo: 2000, acc: 0.92, tag: '座位固定，来去无声' },
    { id: 'o10', name: '上岸者残影', icon: '🌅', elo: 2200, acc: 0.95, tag: '去年此时，他坐在这里' },
    { id: 'boss', name: '心魔', icon: '🌑', elo: 2400, acc: 0.97, tag: '你所有「差一点」的总和', boss: true }
  ]
  let BOSS_UNLOCK_ELO = 1800    /* 心魔出现条件 */
  let UNLOCK_WINDOW = 250       /* 对手解锁窗口：elo ≥ 对手 elo - 250 可挑战 */

  let ELO_K = 32
  let ELO_START = 1000

  let PLAYER_HP = 100
  let BOSS_HP = 160
  let DMG_BASE = 18             /* 答对基础伤害 */
  let DMG_COUNTER = 8           /* 双对反震 */
  let TAKE_BASE = 18            /* 答错承伤基础 */

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
  function uid(p) { return (p || 'm') + Date.now().toString(36) + Math.random().toString(36).slice(2, 7) }
  function dkey(t) {
    let d = t ? new Date(t) : new Date()
    let m = String(d.getMonth() + 1), day = String(d.getDate())
    return d.getFullYear() + '-' + (m.length < 2 ? '0' + m : m) + '-' + (day.length < 2 ? '0' + day : day)
  }
  function fmtTime(ts) {
    let d = new Date(ts)
    return dkey(ts) + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
  }
  /* 事件委托 */
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
  function countUp(el, target, ms, prefix) {
    let t0 = null
    function step(t) {
      if (!t0) t0 = t
      let p = clamp((t - t0) / (ms || 700), 0, 1)
      el.textContent = (prefix || '') + String(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }
  /* mulberry32：种子随机 —— 对手答题判定可复现（种子 = 比赛id+题序） */
  function mulberry32(seed) {
    let a = seed >>> 0
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0
      let t = Math.imul(a ^ (a >>> 15), 1 | a)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }
  function hashStr(s) {
    let h = 2166136261
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
    return h >>> 0
  }
  function aiJSON(ctx, sys, usr, opts) {
    if (!ctx.AI || typeof ctx.AI.chatJSON !== 'function') return Promise.reject(new Error('AI 接口不可用'))
    return ctx.AI.chatJSON(sys, usr, null, Object.assign({ ctx: AI_CTX, noTools: true, cache: false }, opts || {}))
  }
  function aiReady(ctx) {
    try { return !!(ctx.AI && typeof ctx.AI.chatJSON === 'function' && ctx.AI.configured()) } catch (e) { return false }
  }

  /* ════════════════════════ 2. 纯逻辑：ELO / 对手判定 / 伤害（可单测） ════════════════════════ */

  /* ELO 期望胜率与赛后变化：win=1 胜 / 0.5 平 / 0 负 */
  function eloExpected(player, opp) {
    return 1 / (1 + Math.pow(10, (opp - player) / 400))
  }
  function eloUpdate(player, opp, score) {
    let exp = eloExpected(player, opp)
    return Math.round(player + ELO_K * (score - exp))
  }

  /* 对手某题是否答对：命中率按难度修正（越难越低），种子决定 —— 同种子必然同结果 */
  function oppAnswersCorrect(oppAcc, difficulty, seed) {
    let eff = clamp(oppAcc - (difficulty - 3) * 0.04, 0.05, 0.99)
    return mulberry32(seed)() < eff
  }

  /* 一题结算：返回 {pDmg, oDmg, counter} —— 正值为各自受到的伤害 */
  function resolveQuestion(playerCorrect, playerSeconds, oppCorrect, difficulty, secsTotal) {
    let speedBonus = playerCorrect ? Math.round(clamp(1 - playerSeconds / secsTotal, 0, 1) * 10) : 0
    let pDmg = 0, oDmg = 0
    if (playerCorrect) oDmg = DMG_BASE + speedBonus + difficulty * 2
    if (oppCorrect && !playerCorrect) pDmg = TAKE_BASE + difficulty
    if (playerCorrect && oppCorrect) { oDmg = Math.max(4, oDmg - DMG_COUNTER); pDmg = DMG_COUNTER }
    return { pDmg: pDmg, oDmg: oDmg, speedBonus: speedBonus }
  }

  /* ════════════════════════ 2.5 站内数据桥（只读 Store + 错题回写单点） ════════════════════════
   * 官方桥 = ctx.Store（pluginbus 全量上下文的一员，与内置模块同权）。
   * 读：quizBank（题库收藏）/ sprintData.mockExams（题卷整卷）/ mistakes（文本错题本）
   *     / studyBooks（资料库讲义）。全部只读 + 防御（try/catch，键缺失返回空）。
   * 写：只有 writeBackMistakes 一个出口，按站内 mistakes 条目的既有 shape 推入，
   *     dedupKey = 'duel:' + 题干哈希 —— 重复开战同一错题不会产生重复条目（幂等）。 */

  function nativeBank(ctx) {
    try { let s = ctx.Store.get(); return (s && Array.isArray(s.quizBank)) ? s.quizBank : [] } catch (e) { return [] }
  }
  function nativeExams(ctx) {
    try { let s = ctx.Store.get(); return (s && s.sprintData && Array.isArray(s.sprintData.mockExams)) ? s.sprintData.mockExams : [] } catch (e) { return [] }
  }
  function nativeMistakes(ctx) {
    try { let s = ctx.Store.get(); return (s && Array.isArray(s.mistakes)) ? s.mistakes : [] } catch (e) { return [] }
  }
  function nativeBooks(ctx) {
    try { let s = ctx.Store.get(); return (s && Array.isArray(s.studyBooks)) ? s.studyBooks : [] } catch (e) { return [] }
  }

  /* 站内难度字段（diff，字符串）→ 决斗难度 1-5 */
  function diffToNum(d) {
    let s = String(d == null ? '' : d)
    if (/^\d/.test(s)) return clamp(Math.round(num(s, 3)), 1, 5)
    if (/难|高/.test(s)) return 4
    if (/易|低|简/.test(s)) return 2
    return 3
  }
  /* 选项文本去字母前缀：["A. 氧化", "B. 还原"] → ["氧化", "还原"]（quizContract 产物带前缀） */
  function stripOptLetter(t) {
    return flat(t).replace(/^[A-Ea-eＡ-Ｅ]\s*[.、．:：]\s*/, '')
  }
  /* 站内答案字段（"A" / "A. xxx" / 数字下标）→ 选项下标；-1 表示无法解析 */
  function ansLetterIdx(ans, n) {
    if (typeof ans === 'number' && isFinite(ans)) return (ans >= 0 && ans < n) ? Math.round(ans) : -1
    let m = String(ans == null ? '' : ans).trim().match(/^[A-Ea-eＡ-Ｅ]/)
    if (!m) return -1
    let ch = m[0]
    if (ch.charCodeAt(0) > 0xFF00) ch = String.fromCharCode(ch.charCodeAt(0) - 0xFEE0) /* 全角→半角 */
    let i = 'ABCDE'.indexOf(ch.toUpperCase())
    return (i >= 0 && i < n) ? i : -1
  }
  /* 站内题目记录（题库/卷内题同 shape 超集）→ 决斗题；只收 2-4 选项的选择题 */
  function adaptChoice(rec, fallbackTopic) {
    if (!rec || typeof rec !== 'object') return null
    let stem = flat(rec.stem)
    if (!stem || stem.length < 4) return null
    if (rec.type && String(rec.type) !== 'choice') return null
    let raw = Array.isArray(rec.options) ? rec.options : []
    if (raw.length < 2 || raw.length > 4) return null
    let opts = raw.map(stripOptLetter)
    if (opts.some(function (o) { return !o })) return null
    let seen = {}, dup = false
    opts.forEach(function (o) { if (seen[o]) dup = true; seen[o] = 1 })
    if (dup) return null
    let ans = ansLetterIdx(rec.answer, opts.length)
    if (ans < 0) return null
    return {
      stem: stem, options: opts, answer: ans,
      explain: flat(rec.solution) || flat(rec.explain) || ('正确答案：' + 'ABCD'[ans] + '。站内原题未附解析。'),
      difficulty: diffToNum(rec.diff != null ? rec.diff : rec.difficulty),
      topic: flat(rec.topicName) || flat(rec.topic) || (fallbackTopic || '综合')
    }
  }
  /* 站内题库 → 决斗题池（科目匹配优先；无 subject 字段的条目全科目通用） */
  function bankPool(ctx, subject) {
    let out = []
    nativeBank(ctx).forEach(function (rec) {
      if (rec && rec.subject && subject && String(rec.subject) !== String(subject)) return
      let q = adaptChoice(rec, flat(rec.topicName) || '题库收藏')
      if (q) out.push(q)
    })
    return out
  }
  /* 整卷 → 决斗题（只取选择题；不按科目过滤，卷即选题） */
  function examChoiceQs(exam) {
    let out = []
    ;(exam && exam.questions || []).forEach(function (rec) {
      let q = adaptChoice(rec, (exam && flat(exam.title)) || '题卷')
      if (q) out.push(q)
    })
    return out
  }
  function shuffle(arr) {
    let a = arr.slice()
    for (let i = a.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t
    }
    return a
  }
  /* 资料库书 → 讲义节选（弱项突击的 AI 语料；封顶 2400 字防 token 爆炸） */
  function bookExcerpt(book) {
    if (!book) return ''
    let txt = (book.chapters || []).map(function (c) {
      return (c && flat(c.title)) + '\n' + (c && Array.isArray(c.content) ? c.content.join('\n') : '')
    }).join('\n')
    return trunc(txt.replace(/\n{3,}/g, '\n\n'), 2400)
  }
  function subjNativeKey(label) {
    return ({ '数学': 'math', '英语': 'eng', '政治': 'pol', '专业课': 'major' })[label] || 'math'
  }
  /* 战败题回写站内原生错题本：shape 与站内写入方一致，dedupKey 幂等 */
  function writeBackMistakes(ctx, bt) {
    try {
      if (ctx.config && ctx.config('writeBackMistakes') === false) return 0
      let wrongs = (bt.review || []).filter(function (r) { return !r.ok })
      if (!wrongs.length) return 0
      let written = 0
      ctx.Store.update(function (st) {
        st.mistakes = Array.isArray(st.mistakes) ? st.mistakes : []
        wrongs.forEach(function (r) {
          let key = 'duel:' + hashStr(r.stem)
          let dup = false
          for (let i = 0; i < st.mistakes.length; i++) {
            if (st.mistakes[i] && st.mistakes[i].dedupKey === key) { dup = true; break }
          }
          if (dup) return
          /* 【站内适配 2026-10-22】原来只写题干不写答案 —— 用户去站内错题本复习时
           * 只看到一道不会做的题、看不到正确选项与解析，等于"记了个寂寞"。
           * r.answer 是 adaptChoice 归一后的**选项下标**（0-3），这里翻回 'A. 选项原文'。 */
          let ai = (typeof r.answer === 'number' && r.answer >= 0) ? r.answer : -1
          let ansText = (ai >= 0 && Array.isArray(r.options) && r.options[ai])
            ? ('ABCD'[ai] + '. ' + r.options[ai])
            : ''
          st.mistakes.unshift({
            id: 'duel-mk-' + hashStr(r.stem).toString(36),
            subject: subjNativeKey(bt.subj), type: 'concept',
            desc: '【决斗场】' + trunc(r.stem, 40), stem: r.stem,
            answer: ansText || undefined,
            solution: flat(r.explain) || undefined,
            note: r.topic ? ('考点：' + flat(r.topic)) : undefined,
            source: 'duel', dedupKey: key, date: dkey(), createdAt: new Date().toISOString()
          })
          written++
        })
      })
      return written
    } catch (e) {
      try { ctx.log('错题回写失败：' + (e && e.message || e), 'warn') } catch (e2) { }
      return 0
    }
  }



  /* ════════════════════════ 3. 数据层 ════════════════════════ */

  function profileGet(ctx) {
    let p = ctx.data('profile')
    if (!p || typeof p !== 'object') return { elo: ELO_START, wins: 0, losses: 0, draws: 0, streak: 0, badges: [], wrongBook: [], daily: null, history: [], shield: false }
    return {
      elo: num(p.elo, ELO_START), wins: num(p.wins, 0), losses: num(p.losses, 0), draws: num(p.draws, 0),
      streak: num(p.streak, 0),
      badges: Array.isArray(p.badges) ? p.badges : [],
      wrongBook: Array.isArray(p.wrongBook) ? p.wrongBook : [],
      daily: (p.daily && typeof p.daily === 'object') ? p.daily : null,
      history: Array.isArray(p.history) ? p.history : [], shield: p.shield === true
    }
  }
  function profileSave(ctx, p) {
    p.history = p.history.slice(0, HISTORY_MAX)
    p.wrongBook = p.wrongBook.slice(0, WRONG_BOOK_MAX)
    ctx.data('profile', p)
  }
  function ladderState(ctx) {
    let elo = profileGet(ctx).elo
    return LADDER.map(function (o) {
      let locked = o.boss ? elo < BOSS_UNLOCK_ELO : elo < o.elo - UNLOCK_WINDOW
      return { opp: o, locked: locked, elo: elo }
    })
  }

  function titleOf(elo, badges) {
    if (badges && badges.indexOf('boss-slayer') >= 0) return { icon: '🗡️', name: '弑魔者' }
    for (let i = 0; i < TITLES.length; i++) if (elo >= TITLES[i].min) return TITLES[i]
    return TITLES[TITLES.length - 1]
  }

  /* 每日挑战者：日期做种子，全天固定同一个非 Boss 对手；种子进比赛 id，判定可复现 */
  function dailyOpp() {
    let key = dkey()
    let pool = LADDER.filter(function (o) { return !o.boss })
    let opp = pool[hashStr('duel-daily:' + key) % pool.length]
    return { key: key, opp: opp, seed: 'daily:' + key + ':' + opp.id, bonus: DAILY_BONUS }
  }

  /* 错题本 upsert：答对移除、答错收录（按题干去重，错因计数 +1） */
  function bookUpsert(book, q) {
    let hit = null
    for (let i = 0; i < book.length; i++) if (book[i].stem === q.stem) { hit = book[i]; break }
    if (hit) { hit.wrong = num(hit.wrong, 1) + 1; hit.topic = q.topic }
    else book.unshift({ stem: q.stem, topic: q.topic, options: q.options.slice(), answer: q.answer, explain: q.explain, difficulty: q.difficulty, wrong: 1 })
    return book
  }
  function bookRemove(book, stem) {
    return book.filter(function (x) { return x.stem !== stem })
  }

  /* 赛后评估成就：返回新解锁 id 列表（不改动入参 profile） */
  function checkBadges(last, p) {
    return BADGES.filter(function (b) { return p.badges.indexOf(b.id) < 0 && b.cond(last, p) })
      .map(function (b) { return b.id })
  }

  /* ════════════════════════ 4. 样式（单例注入） ════════════════════════ */

  let CSS = [
    '.du-root{--du-acc:var(--blue,#2563eb);--du-acc2:var(--purple,#7c3aed);--du-ink:var(--text-primary,#1e2a4a);'
      + '--du-sub:var(--text-muted,#7c8aa8);--du-ink2:var(--text-secondary,#4a5670);--du-line:var(--line,#d8dde8);'
      + '--du-bg:var(--surface,#fff);--du-soft:var(--surface-muted,#f6f8fc);--du-ok:var(--ok,#0f7c4a);'
      + '--du-warn:var(--warn,#c47615);--du-danger:var(--danger,#d83b3b);--du-gold:#d97706;--du-ease:cubic-bezier(.22,.8,.26,1);'
      + 'color:var(--du-ink);font:14px/1.65 "PingFang SC","Microsoft YaHei",system-ui,sans-serif;'
      + 'margin:calc(var(--vp-t,16px)*-1) calc(var(--vp-x,16px)*-1) calc(var(--vp-b,24px)*-1);'
      + 'min-height:calc(100vh - 59px);display:flex;flex-direction:column;background:var(--du-soft)}',
    '.du-hero{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:14px;flex-wrap:wrap;'
      + 'padding:14px calc(var(--vp-x,16px) + 18px);border:0;border-bottom:1px solid var(--du-line);border-radius:0;'
      + 'background:color-mix(in oklab,var(--du-bg) 84%,transparent);'
      + 'backdrop-filter:blur(18px) saturate(1.5);-webkit-backdrop-filter:blur(18px) saturate(1.5);'
      + 'box-shadow:0 1px 0 rgba(20,35,70,.03);max-height:150px;overflow:hidden;'
      + 'transition:padding .3s var(--du-ease),box-shadow .3s var(--du-ease),max-height .34s var(--du-ease)}',
    '.du-hero.du-stuck{padding-top:8px;padding-bottom:8px;box-shadow:0 10px 26px -14px rgba(30,36,90,.28)}',
    /* 徽标：火焰呼吸（决斗场语义） */
    '.du-mark{width:46px;height:46px;border-radius:15px;flex:0 0 auto;color:#fff;'
      + 'background:linear-gradient(135deg,var(--du-gold),var(--du-danger));display:flex;align-items:center;justify-content:center;'
      + 'box-shadow:0 6px 18px color-mix(in oklab,var(--du-gold) 40%,transparent);'
      + 'transition:width .3s var(--du-ease),height .3s var(--du-ease),border-radius .3s var(--du-ease);animation:du-breathe 2.6s ease-in-out infinite}',
    '.du-mark svg{width:24px;height:24px}',
    '.du-hero.du-stuck .du-mark{width:34px;height:34px;border-radius:11px}',
    '@keyframes du-breathe{0%,100%{transform:scale(1) rotate(-2deg)}50%{transform:scale(1.06) rotate(2deg)}}',
    '.du-titles{flex:1;min-width:150px}',
    '.du-title{font-size:19px;font-weight:800;letter-spacing:.3px;display:flex;align-items:center;gap:8px}',
    '.du-title em{font-style:normal;font-size:11px;font-weight:700;padding:2px 9px;border-radius:999px;'
      + 'background:var(--du-soft);color:var(--du-sub);border:1px solid var(--du-line)}',
    '.du-sub2{font-size:12px;color:var(--du-sub);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.du-chips{display:flex;gap:7px;flex-wrap:wrap}',
    '.du-hchip{font-size:11.5px;padding:4px 11px;border-radius:999px;border:1px solid var(--du-line);'
      + 'background:color-mix(in oklab,var(--du-bg) 70%,transparent);color:var(--du-sub);white-space:nowrap}',
    '.du-hchip b{color:var(--du-ink);font-size:12.5px;margin:0 2px}',
    '.du-hchip.battle{border-color:color-mix(in oklab,var(--du-danger) 40%,transparent);color:var(--du-danger);animation:du-pulse 1.4s ease-in-out infinite}',
    '.du-hchip.streak{border-color:color-mix(in oklab,var(--du-gold) 45%,transparent);color:var(--du-gold)}',
    '.du-subjrow{display:flex;gap:7px;flex-wrap:wrap;margin:10px 0 2px}',
    '.du-subjrow .du-hchip b.w{color:var(--du-ok)}',
    '@keyframes du-pulse{0%,100%{opacity:1}50%{opacity:.55}}',
    /* 低血量警戒 + KO 震屏 */
    '.du-hpfill.crit{background:linear-gradient(90deg,var(--du-danger),color-mix(in oklab,var(--du-danger) 65%,var(--du-gold)))!important;animation:du-pulse 1s ease-in-out infinite}',
    '.du-arena.shake{animation:du-shake .5s ease}',
    '@keyframes du-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(3px)}}',
    /* 键盘提示 */
    '.du-kbd{display:inline-block;min-width:19px;height:19px;line-height:18px;padding:0 5px;border-radius:5px;text-align:center;'
      + 'font-size:10.5px;font-family:inherit;border:1px solid var(--du-line);border-bottom-width:2px;background:var(--du-soft);color:var(--du-sub)}',
    /* 每日挑战 + 错题复仇入口 */
    '.du-daily{display:flex;gap:13px;align-items:center;border:1px solid color-mix(in oklab,var(--du-gold) 40%,var(--du-line));'
      + 'border-radius:14px;padding:13px 15px;margin-bottom:13px;'
      + 'background:linear-gradient(120deg,color-mix(in oklab,var(--du-gold) 9%,var(--du-bg)),var(--du-bg));'
      + 'animation:du-rise .4s var(--du-ease) both}',
    '.du-daily .ic{font-size:30px}',
    '.du-daily .tx{flex:1;min-width:0}',
    '.du-daily .tx b{font-size:14px}',
    '.du-daily .tx span{display:block;font-size:11.5px;color:var(--du-sub);margin-top:2px}',
    '.du-revenge{border-style:dashed;cursor:pointer;transition:border-color .16s,transform .16s}',
    '.du-revenge:hover{border-color:var(--du-danger);transform:translateY(-2px)}',
    /* 成就徽章墙 */
    '.du-badges{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}',
    '.du-badge{border:1px solid var(--du-line);border-radius:13px;padding:11px 12px;background:var(--du-bg);'
      + 'transition:transform .16s,box-shadow .16s;animation:du-rise .4s var(--du-ease) both;animation-delay:calc(var(--i,0)*35ms)}',
    '.du-badge .t{display:flex;align-items:center;gap:7px;font-weight:800;font-size:13px}',
    '.du-badge .t i{font-style:normal;font-size:19px}',
    '.du-badge p{margin:4px 0 0;font-size:11.5px;color:var(--du-sub);line-height:1.6}',
    '.du-badge.off{opacity:.45;filter:grayscale(.85)}',
    '.du-badge:not(.off):hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(20,35,70,.09)}',
    /* 赛后题目回顾 */
    '.du-rev{border:1px solid var(--du-line);border-radius:12px;background:var(--du-bg);margin-top:8px;overflow:hidden}',
    '.du-rev summary{cursor:pointer;padding:9px 13px;font-size:12.8px;font-weight:700;list-style:none;display:flex;gap:8px;align-items:center}',
    '.du-rev summary::-webkit-details-marker{display:none}',
    '.du-rev summary .tag{margin-left:auto;font-size:11px;font-weight:700;padding:1px 8px;border-radius:999px;flex:0 0 auto}',
    '.du-rev.ok summary .tag{color:var(--du-ok);background:color-mix(in oklab,var(--du-ok) 10%,transparent)}',
    '.du-rev.no summary .tag{color:var(--du-danger);background:color-mix(in oklab,var(--du-danger) 9%,transparent)}',
    '.du-rev .bd{border-top:1px dashed var(--du-line);padding:9px 13px;font-size:12.3px;line-height:1.75;color:var(--du-ink2);display:grid;gap:4px}',
    '.du-rev .bd .ex{color:var(--du-sub)}',
    '.du-title-tag{font-style:normal;font-size:11px;font-weight:800;padding:2px 9px;border-radius:999px;'
      + 'background:linear-gradient(135deg,color-mix(in oklab,var(--du-gold) 18%,var(--du-bg)),var(--du-soft));'
      + 'border:1px solid color-mix(in oklab,var(--du-gold) 40%,var(--du-line));color:var(--du-gold)}',
    /* 【站内适配 2026-10-22】原本写死 max-width:1080px（作者按独立宿主窄栏设计）。
     * 站点内容轨 1140 + 满幅已解除限宽，自带限宽会额外缩 60px、与页眉左边缘错开。
     * 改为吃宿主轨：不越界，也不再自缩。 */
    '.du-body{flex:1 1 auto;width:100%;max-width:100%;margin:0 auto;box-sizing:border-box;'
      + 'padding:20px calc(var(--vp-x,16px) + 18px) 46px}',
    '.du-card{background:var(--du-bg);border:1px solid var(--du-line);border-radius:16px;padding:18px;margin-bottom:14px;'
      + 'box-shadow:0 8px 24px rgba(20,35,70,.05);animation:du-rise .42s var(--du-ease) both;animation-delay:calc(var(--i,0)*45ms)}',
    '@keyframes du-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}',
    '.du-h{font-size:16px;font-weight:800;margin:0 0 4px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}',
    '.du-h em{font-style:normal;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;'
      + 'background:var(--du-soft);color:var(--du-sub);border:1px solid var(--du-line)}',
    '.du-desc{color:var(--du-sub);font-size:12.5px;line-height:1.75;margin-bottom:13px}',
    '.du-btn{height:36px;padding:0 15px;border-radius:10px;border:1px solid var(--du-line);background:var(--du-bg);'
      + 'cursor:pointer;font-weight:600;font-size:13px;color:var(--du-ink2);font-family:inherit;position:relative;overflow:hidden;'
      + 'transition:transform .12s,border-color .16s,color .16s,box-shadow .16s,filter .16s}',
    '.du-btn:hover:not(:disabled){border-color:var(--du-acc);color:var(--du-acc);box-shadow:0 4px 12px rgba(37,99,235,.14);transform:translateY(-1px)}',
    '.du-btn:active:not(:disabled){transform:translateY(1px)}',
    '.du-btn:disabled{opacity:.45;cursor:not-allowed}',
    '.du-btn.fire{background:linear-gradient(135deg,var(--du-gold),var(--du-danger));color:#fff;border:0;'
      + 'box-shadow:0 6px 16px color-mix(in oklab,var(--du-gold) 35%,transparent)}',
    '.du-btn.fire:hover:not(:disabled){color:#fff;filter:brightness(1.06)}',
    '.du-btn.sm{height:30px;padding:0 11px;font-size:12px;border-radius:9px}',
    '.du-note{font-size:12px;color:var(--du-sub);line-height:1.8;margin-top:9px}',
    /* —— 天梯 —— */
    '.du-ladder{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}',
    '.du-opp{border:1px solid var(--du-line);border-radius:15px;padding:14px;background:var(--du-bg);position:relative;overflow:hidden;'
      + 'transition:transform .16s,box-shadow .16s,border-color .16s;animation:du-rise .4s var(--du-ease) both;animation-delay:calc(var(--i,0)*40ms)}',
    '.du-opp:hover:not(.locked){transform:translateY(-3px);box-shadow:0 10px 26px rgba(20,35,70,.1);border-color:color-mix(in oklab,var(--du-acc) 45%,var(--du-line))}',
    '.du-opp.locked{opacity:.55;filter:grayscale(.6)}',
    '.du-opp.boss{border-color:color-mix(in oklab,var(--du-danger) 45%,var(--du-line));'
      + 'background:linear-gradient(160deg,color-mix(in oklab,var(--du-danger) 7%,var(--du-bg)),var(--du-bg))}',
    '.du-opp .ic{font-size:30px;line-height:1.2}',
    '.du-opp .nm{font-weight:800;font-size:14px;margin-top:6px}',
    '.du-opp .tg{font-size:11.5px;color:var(--du-sub);margin-top:2px;min-height:2.2em}',
    '.du-opp .meta{display:flex;align-items:center;gap:8px;margin-top:9px;font-size:11.5px;color:var(--du-sub)}',
    '.du-opp .elo{margin-left:auto;font-weight:800;color:var(--du-ink)}',
    '.du-opp .lock{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--du-sub);'
      + 'background:color-mix(in oklab,var(--du-bg) 55%,transparent);font-weight:700}',
    '.du-friendly{position:absolute;right:10px;bottom:10px;opacity:0;transition:opacity .16s}',
    '.du-opp:hover .du-friendly{opacity:1}',
    '@media (hover:none){.du-friendly{opacity:1}}',
    /* —— 决斗台 —— */
    '.du-arena{position:relative}',
    '.du-hps{display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:center;margin-bottom:14px}',
    '.du-hpbox{border:1px solid var(--du-line);border-radius:13px;padding:10px 13px;background:var(--du-bg)}',
    '.du-hpbox.opp{text-align:right}',
    '.du-hpname{display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:700;margin-bottom:6px}',
    '.du-hpbox.opp .du-hpname{flex-direction:row-reverse}',
    '.du-hpname .ic{font-size:19px}',
    '.du-hpbar{height:13px;border-radius:999px;background:var(--du-soft);border:1px solid var(--du-line);overflow:hidden;position:relative}',
    '.du-hpfill{height:100%;width:100%;border-radius:999px;background:linear-gradient(90deg,var(--du-ok),color-mix(in oklab,var(--du-ok) 70%,var(--du-gold)));'
      + 'transition:width .55s var(--du-ease)}',
    '.du-hpbox.opp .du-hpfill{background:linear-gradient(90deg,color-mix(in oklab,var(--du-danger) 75%,var(--du-gold)),var(--du-danger))}',
    '.du-hpnum{font-size:11px;color:var(--du-sub);margin-top:4px;font-variant-numeric:tabular-nums}',
    '.du-vs{font-size:20px;font-weight:800;color:var(--du-sub)}',
    /* 受击抖动 + 伤害飘字 */
    '.du-hpbox.hit{animation:du-hit .4s ease}',
    '@keyframes du-hit{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}50%{transform:translateX(4px)}75%{transform:translateX(-2px)}}',
    '.du-float{position:absolute;font-weight:800;font-size:17px;pointer-events:none;animation:du-float 1s ease-out both;z-index:5}',
    '@keyframes du-float{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-34px)}}',
    /* 倒计时环 */
    '.du-timerwrap{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--du-sub);margin-bottom:11px}',
    '.du-timerbar{flex:1;height:7px;border-radius:999px;background:var(--du-soft);border:1px solid var(--du-line);overflow:hidden}',
    '.du-timerfill{height:100%;width:100%;background:linear-gradient(90deg,var(--du-acc),var(--du-acc2));transition:width 1s linear}',
    '.du-timerfill.low{background:linear-gradient(90deg,var(--du-warn),var(--du-danger))}',
    '.du-tnum{font-variant-numeric:tabular-nums;font-weight:700;color:var(--du-ink);min-width:2.2em;text-align:right}',
    /* 题目卡 */
    '.du-q{border:1px solid var(--du-line);border-radius:15px;padding:17px;background:var(--du-bg);margin-bottom:13px}',
    '.du-qstem{font-size:15px;font-weight:700;line-height:1.8;white-space:pre-wrap;word-break:break-word;margin-bottom:5px}',
    '.du-qmeta{font-size:11px;color:var(--du-sub);margin-bottom:12px}',
    '.du-opts{display:grid;grid-template-columns:1fr 1fr;gap:9px}',
    '.du-opt{border:1px solid var(--du-line);border-radius:11px;padding:11px 13px;background:var(--du-bg);cursor:pointer;'
      + 'font-family:inherit;font-size:13px;text-align:left;color:var(--du-ink);line-height:1.6;'
      + 'transition:all .15s var(--du-ease);animation:du-rise .3s var(--du-ease) both}',
    '.du-opt b{display:inline-block;width:22px;height:22px;border-radius:7px;background:var(--du-soft);border:1px solid var(--du-line);'
      + 'text-align:center;line-height:21px;font-size:12px;margin-right:7px}',
    '.du-opt:hover:not(:disabled){border-color:var(--du-acc);transform:translateY(-1px);box-shadow:0 5px 14px rgba(20,35,70,.09)}',
    '.du-opt.picked{border-color:var(--du-acc);box-shadow:0 0 0 2px color-mix(in oklab,var(--du-acc) 18%,transparent)}',
    '.du-opt.right{border-color:var(--du-ok);background:color-mix(in oklab,var(--du-ok) 9%,transparent)}',
    '.du-opt.right b{background:var(--du-ok);border-color:var(--du-ok);color:#fff}',
    '.du-opt.wrong{border-color:var(--du-danger);background:color-mix(in oklab,var(--du-danger) 8%,transparent)}',
    '.du-opt.wrong b{background:var(--du-danger);border-color:var(--du-danger);color:#fff}',
    '.du-opt:disabled{cursor:default}',
    /* 对手思考指示 */
    '.du-think{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--du-sub);padding:7px 12px;'
      + 'border:1px dashed var(--du-line);border-radius:999px;background:var(--du-soft)}',
    '.du-think i{width:6px;height:6px;border-radius:50%;background:var(--du-sub);animation:du-dot 1s ease-in-out infinite}',
    '.du-think i:nth-child(2){animation-delay:.14s}.du-think i:nth-child(3){animation-delay:.28s}',
    '@keyframes du-dot{0%,100%{opacity:.4;transform:scale(.8)}50%{opacity:1;transform:scale(1.15)}}',
    '.du-judge{margin-top:11px;font-size:12.8px;line-height:1.75;border-radius:11px;padding:10px 13px;display:none}',
    '.du-judge.on{display:block;animation:du-rise .3s var(--du-ease) both}',
    '.du-judge.ok{background:color-mix(in oklab,var(--du-ok) 8%,transparent);border:1px solid color-mix(in oklab,var(--du-ok) 30%,transparent)}',
    '.du-judge.no{background:color-mix(in oklab,var(--du-danger) 7%,transparent);border:1px solid color-mix(in oklab,var(--du-danger) 28%,transparent)}',
    /* 结果横幅 */
    '.du-banner{text-align:center;padding:26px 16px;border-radius:16px;margin-bottom:14px;animation:du-rise .5s var(--du-ease) both}',
    '.du-banner.win{background:linear-gradient(135deg,color-mix(in oklab,var(--du-gold) 16%,var(--du-bg)),var(--du-bg));border:1px solid color-mix(in oklab,var(--du-gold) 40%,var(--du-line))}',
    '.du-banner.lose{background:var(--du-bg);border:1px solid var(--du-line)}',
    '.du-banner .big{font-size:30px;font-weight:800;margin-bottom:6px}',
    '.du-banner.win .big{color:var(--du-gold)}',
    '.du-banner .sub{font-size:13px;color:var(--du-sub)}',
    '.du-elodelta{display:inline-block;margin-top:9px;font-size:15px;font-weight:800;padding:4px 14px;border-radius:999px}',
    '.du-elodelta.up{color:var(--du-ok);background:color-mix(in oklab,var(--du-ok) 10%,transparent)}',
    '.du-elodelta.down{color:var(--du-danger);background:color-mix(in oklab,var(--du-danger) 9%,transparent)}',
    /* 战绩/编年史 */
    '.du-statgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:11px;margin-bottom:13px}',
    '.du-stat{border:1px solid var(--du-line);border-radius:13px;padding:12px 14px;background:var(--du-bg);text-align:center;'
      + 'animation:du-rise .4s var(--du-ease) both;animation-delay:calc(var(--i,0)*50ms)}',
    '.du-stat b{display:block;font-size:23px;font-weight:800;line-height:1.2}',
    '.du-stat span{font-size:11px;color:var(--du-sub)}',
    '.du-hist{display:flex;gap:10px;align-items:center;padding:9px 12px;border-bottom:1px dashed var(--du-line);font-size:12.5px}'
      + ';animation:du-rise .3s var(--du-ease) both}',
    '.du-hist:last-child{border-bottom:0}',
    '.du-hist .r{font-weight:800;width:44px;flex:0 0 auto}',
    '.du-hist .r.w{color:var(--du-ok)}.du-hist .r.l{color:var(--du-danger)}.du-hist .r.d{color:var(--du-sub)}',
    '.du-hist .m{flex:1;min-width:0;color:var(--du-ink2)}',
    '.du-hist .e{font-variant-numeric:tabular-nums;color:var(--du-sub)}',
    '.du-empty{border:1.6px dashed var(--du-line);border-radius:16px;padding:28px 18px;text-align:center;color:var(--du-sub);font-size:13px}',
    '.du-empty b{display:block;font-size:16px;color:var(--du-ink);margin-bottom:6px}',
    '.du-spark{width:100%;height:auto;display:block}',
    '@media (max-width:560px){.du-opts{grid-template-columns:1fr}.du-hchip:nth-child(n+4){display:none}'
      + '.du-hps{grid-template-columns:1fr}.du-vs{display:none}}',
    '@media (prefers-reduced-motion:reduce){.du-root *{animation:none!important;transition:none!important}}',
    /* —— 出题来源选择器（站内数据接入） —— */
    '.du-srcrow{display:grid;grid-template-columns:repeat(auto-fill,minmax(158px,1fr));gap:9px;margin:4px 0 2px}',
    '.du-src{border:1.5px solid var(--du-line);border-radius:13px;padding:11px 13px;background:var(--du-bg);cursor:pointer;'
      + 'transition:transform .16s,border-color .16s,box-shadow .16s;animation:du-rise .4s var(--du-ease) both}',
    '.du-src b{display:block;font-size:13px}',
    '.du-src span{display:block;font-size:11px;color:var(--du-sub);margin-top:2px}',
    '.du-src:hover:not(.off){transform:translateY(-2px);border-color:var(--du-acc)}',
    '.du-src.on{border-color:var(--du-acc);box-shadow:0 0 0 2px color-mix(in oklab,var(--du-acc) 18%,transparent);'
      + 'background:linear-gradient(150deg,color-mix(in oklab,var(--du-acc) 7%,var(--du-bg)),var(--du-bg))}',
    '.du-src.off{opacity:.5;cursor:not-allowed;filter:grayscale(.5)}',
    '.du-picklist{display:grid;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));gap:8px;margin-top:10px}',
    '.du-pick{border:1px solid var(--du-line);border-radius:11px;padding:9px 12px;background:var(--du-bg);cursor:pointer;'
      + 'transition:transform .15s,border-color .15s,box-shadow .15s;animation:du-rise .35s var(--du-ease) both}',
    '.du-pick b{display:block;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.du-pick span{display:block;font-size:11px;color:var(--du-sub);margin-top:1px}',
    '.du-pick:hover{border-color:var(--du-acc);transform:translateY(-1px)}',
    '.du-pick.on{border-color:var(--du-gold);box-shadow:0 0 0 2px color-mix(in oklab,var(--du-gold) 22%,transparent)}'
  ].join('\n')

  let STYLE_ID = 'du-styles'
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return
    let st = document.createElement('style')
    st.id = STYLE_ID
    st.textContent = CSS
    document.head.appendChild(st)
  }

  /* 页眉图标：交叉双剑 */
  let MARK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M4 4l7 7M4 4v3M4 4h3"/><path d="M20 4l-7 7M20 4v3M20 4h-3"/>'
    + '<path d="M6.5 13.5L4 20l6.5-2.5M17.5 13.5L20 20l-6.5-2.5"/></svg>'

  function heroChips(ctx, battle) {
    let p = profileGet(ctx)
    let t = titleOf(p.elo, p.badges)
    return '<span class="du-hchip">' + t.icon + ' <b>' + t.name + '</b></span>'
      + '<span class="du-hchip">ELO <b>' + p.elo + '</b></span>'
      + '<span class="du-hchip">胜 <b>' + p.wins + '</b> / 负 ' + p.losses + (p.draws ? ' / 平 ' + p.draws : '') + '</span>'
      + '<span class="du-hchip">场次 <b>' + p.history.length + '</b></span>'
      + (p.streak > 1 ? '<span class="du-hchip streak">🔥 连胜 <b>' + p.streak + '</b></span>' : '')
      + (p.badges.length ? '<span class="du-hchip">🏅 <b>' + p.badges.length + '</b>/' + BADGES.length + '</span>' : '')
      + (p.shield ? '<span class="du-hchip">🛡 quizDone 护盾已充能</span>' : '')
      + (battle ? '<span class="du-hchip battle">● 决斗中</span>' : '')
  }

  function bindStuck(root) {
    let hero = root.querySelector('.du-hero')
    if (!hero) return function () { }
    function onScroll() {
      let on = (window.scrollY || window.pageYOffset || 0) > 12
      if (on !== hero.classList.contains('du-stuck')) hero.classList.toggle('du-stuck', on)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return function () { window.removeEventListener('scroll', onScroll) }
  }

  /* 结算彩带（与闪卡插件同款手写粒子，独立实现避免跨插件依赖） */
  function confetti() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let cv = document.createElement('canvas')
    cv.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99990'
    document.body.appendChild(cv)
    let g = cv.getContext('2d')
    let W = cv.width = window.innerWidth, H = cv.height = window.innerHeight
    let colors = ['#d97706', '#dc2626', '#2563eb', '#7c3aed', '#0f7c4a']
    let parts = []
    for (let i = 0; i < 120; i++) {
      parts.push({ x: W / 2 + (Math.random() - 0.5) * W * 0.5, y: H * 0.3, vx: (Math.random() - 0.5) * 11, vy: -Math.random() * 11 - 4, s: Math.random() * 7 + 4, r: Math.random() * 3, vr: (Math.random() - 0.5) * 0.3, c: colors[i % colors.length] })
    }
    let t0 = null
    ;(function frame(t) {
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
      if (alive && el < 2.2) requestAnimationFrame(frame); else cv.remove()
    })(performance.now ? performance.now() : Date.now())
  }

  /* ════════════════════════ 5. 视图骨架 ════════════════════════ */

  function heroHTML(ctx, battle) {
    return '<div class="du-hero"><div class="du-mark">' + MARK_SVG + '</div>'
      + '<div class="du-titles"><div class="du-title">博弈刷题场<em>v' + VERSION + '</em></div>'
      + '<div class="du-sub2">AI 一次出整场题 · 种子模拟对手作答 · ELO 天梯 —— 站内题库/题卷/错题/资料库皆可作战场</div></div>'
      + '<div class="du-chips">' + heroChips(ctx, battle) + '</div></div>'
  }

  function statCell(i, v, label) {
    return '<div class="du-stat" style="--i:' + i + '"><b>' + v + '</b><span>' + label + '</span></div>'
  }

  /* ELO 走势折线（编年史最新在前 → 反转为时间序） */
  function eloSeries(p) {
    let s = [ELO_START].concat(p.history.slice(0, 19).reverse().map(function (h) { return num(h.elo, ELO_START) }))
    return s.slice(-20)
  }
  function sparkSVG(series, w, h) {
    w = w || 260; h = h || 56
    if (!series.length) return ''
    let min = Math.min.apply(null, series), max = Math.max.apply(null, series)
    let span = (max - min) || 1
    let pts = series.map(function (v, i) {
      let x = series.length === 1 ? w / 2 : (i / (series.length - 1)) * (w - 8) + 4
      let y = h - 6 - ((v - min) / span) * (h - 12)
      return x.toFixed(1) + ',' + y.toFixed(1)
    })
    let lastPt = pts[pts.length - 1].split(',')
    return '<svg class="du-spark" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" role="img" aria-label="ELO 走势">'
      + '<polyline points="' + pts.join(' ') + '" fill="none" stroke="var(--du-acc)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
      + '<circle cx="' + lastPt[0] + '" cy="' + lastPt[1] + '" r="3.4" fill="var(--du-gold)"/></svg>'
  }

  function histList(p, limit) {
    let list = p.history.slice(0, limit || 8)
    if (!list.length) return '<div class="du-empty"><b>还没有战绩</b>挑一个已解锁的对手，打一场就有了</div>'
    return list.map(function (h) {
      let r = h.result === 'W' ? '<span class="r w">胜</span>' : h.result === 'L' ? '<span class="r l">负</span>'
        : h.result === 'F' ? '<span class="r l">降</span>' : '<span class="r d">平</span>'
      return '<div class="du-hist">' + r
        + '<span class="m">' + (h.icon || '') + ' ' + esc(h.name) + ' · ' + esc(h.subj || '') + '</span>'
        + '<span class="e">' + (h.delta > 0 ? '+' : '') + h.delta + ' → ' + h.elo + '</span>'
        + '<span class="e">' + fmtTime(h.ts) + '</span></div>'
    }).join('')
  }

  /* 赛后题目回顾折叠卡（结算页/友谊赛共用） */
  function reviewHTML(review) {
    let letters = ['A', 'B', 'C', 'D']
    return review.map(function (r, i) {
      let pickTxt = r.pick < 0 ? '超时未答' : ('你选 ' + letters[r.pick])
      return '<details class="du-rev ' + (r.ok ? 'ok' : 'no') + '">'
        + '<summary><span>' + (i + 1) + '. ' + esc(trunc(r.stem, 40)) + '</span>'
        + '<span class="tag">' + (r.ok ? '✓ 对' : '✗ 错 · ' + esc(pickTxt)) + '</span></summary>'
        + '<div class="bd">'
        + r.options.map(function (o, j) {
          let mark = j === r.answer ? ' ✅' : (j === r.pick ? ' ❌' : '')
          return '<span>' + letters[j] + '. ' + esc(o) + mark + '</span>'
        }).join('')
        + '<span class="ex">💡 ' + esc(r.explain) + '</span>'
        + '</div></details>'
    }).join('')
  }

  function oppCard(c, i) {
    let o = c.opp
    let lockMsg = o.boss ? ('ELO ' + BOSS_UNLOCK_ELO + ' 解锁心魔') : ('ELO ' + (o.elo - UNLOCK_WINDOW) + ' 解锁')
    return '<div class="du-opp' + (c.locked ? ' locked' : '') + (o.boss ? ' boss' : '') + '" style="--i:' + i + '"'
      + (c.locked ? '' : ' data-act="pick" data-oid="' + o.id + '" role="button" tabindex="0"') + '>'
      + '<div class="ic">' + o.icon + '</div><div class="nm">' + esc(o.name) + '</div>'
      + '<div class="tg">' + esc(o.tag) + '</div>'
      + '<div class="meta"><span>命中率 ' + Math.round(o.acc * 100) + '%</span><span class="elo">ELO ' + o.elo + '</span></div>'
      + (c.locked ? '<div class="lock">🔒 ' + lockMsg + '</div>'
        : '<button class="du-btn sm du-friendly" data-act="friendly" data-oid="' + o.id + '" title="不计 ELO、不进编年史，纯练手感">🤝 友谊赛</button>')
      + '</div>'
  }

  /* 科目战绩：编年史按 subj 聚合胜负（认输记负） */
  function subjStats(p) {
    let m = {}
    p.history.forEach(function (h) {
      let k = h.subj || '其他'
      if (!m[k]) m[k] = { w: 0, l: 0, d: 0 }
      if (h.result === 'W') m[k].w += 1
      else if (h.result === 'D') m[k].d += 1
      else m[k].l += 1
    })
    return m
  }

  /* 出题来源 chip（站内数据接入） */
  function srcChip(m, icon, label, hint, cur, enabled) {
    return '<div class="du-src' + (cur === m ? ' on' : '') + (enabled ? '' : ' off') + '" data-act="src-mode" data-m="' + m + '"'
      + (enabled ? ' role="button" tabindex="0"' : '') + ' style="--i:' + (enabled ? 1 : 0) + '">'
      + '<b>' + icon + ' ' + esc(label) + '</b><span>' + esc(hint) + '</span></div>'
  }
  function examPickerHTML(ctx, state) {
    let exams = nativeExams(ctx).slice(0, 12)
    if (!exams.length) {
      return '<div class="du-empty" style="margin-top:10px"><b>站内还没有题卷</b>'
        + '去「题卷」模块生成一张模拟卷或导入 exam.json，再回来挑战</div>'
    }
    if (!state.examId || !exams.some(function (e) { return e.id === state.examId })) state.examId = exams[0].id
    return '<div class="du-picklist">' + exams.map(function (e, i) {
      let n = (e.questions || []).length
      return '<div class="du-pick' + (state.examId === e.id ? ' on' : '') + '" style="--i:' + i + '"'
        + ' data-act="src-exam" data-id="' + esc(e.id || '') + '" role="button" tabindex="0">'
        + '<b>📄 ' + esc(trunc(e.title || '未命名卷', 26)) + '</b>'
        + '<span>' + esc(e.subject || '未分科') + ' · 共 ' + n + ' 题' + (e.completedAt ? ' · 已考过' : '') + '</span></div>'
    }).join('') + '</div>'
  }
  function weakPickerHTML(ctx, state) {
    let books = nativeBooks(ctx).slice(0, 12)
    let mks = nativeMistakes(ctx)
    let h = '<div class="du-note">AI 将读取你站内错题本最近 ' + Math.min(15, mks.length) + ' 条错题'
      + (books.length ? '，并可结合一本资料库讲义命题：' : '。')
      + (mks.length ? '' : '<b style="color:var(--du-warn)">（当前无错题，退化为普通 AI 出题）</b>')
    if (books.length) {
      h += '</div><div class="du-picklist">'
        + '<div class="du-pick' + (!state.bookId ? ' on' : '') + '" data-act="src-book" data-id="" role="button" tabindex="0">'
        + '<b>🚫 不用讲义</b><span>仅按错题命题</span></div>'
        + books.map(function (b, i) {
          return '<div class="du-pick' + (state.bookId === b.id ? ' on' : '') + '" style="--i:' + (i + 1) + '"'
            + ' data-act="src-book" data-id="' + esc(b.id || '') + '" role="button" tabindex="0">'
            + '<b>📖 ' + esc(trunc(b.title || '未命名书', 24)) + '</b>'
            + '<span>' + esc(b.subject || '未分科') + ' · ' + num(b.questionCount, (b.chapters || []).length) + ' 章</span></div>'
        }).join('') + '</div>'
    } else {
      h += '资料库还没有书 —— 去「资料库」导入讲义可让命题更贴你的材料。</div>'
    }
    return h
  }

  function lobbyHTML(ctx, state) {
    let p = profileGet(ctx)
    let t = titleOf(p.elo, p.badges)
    let d = dailyOpp()
    let dailyClaimed = !!(p.daily && p.daily.key === d.key && p.daily.claimed)
    let s = '<div class="du-card" style="--i:0"><h3 class="du-h">' + t.icon + ' ' + t.name + ' <em>ELO ' + p.elo + '</em></h3>'
      + '<div class="du-desc">与 AI 对手同题竞速：答对造成伤害（速度越快越痛），答错则挨打，双对互相反震；'
      + '问数耗尽比剩余 HP，一方归零提前 KO。ELO 按等级分公式结算，连胜有加成，段位随 ELO 晋升。'
      + '在站内任何工具完成一组刷题（quizDone）都会给本场充能 🛡 护盾：下一场 +20 HP。</div>'
      + '<div class="du-statgrid">'
      + statCell(0, p.elo, '当前 ELO') + statCell(1, p.wins, '胜场') + statCell(2, p.losses, '负场')
      + statCell(3, p.draws, '平局') + statCell(4, p.history.length, '总场次')
      + '</div>'
      + (function () {
        let ss = subjStats(p), keys = Object.keys(ss)
        return keys.length
          ? '<div class="du-subjrow">' + keys.map(function (k) {
            let v = ss[k]
            return '<span class="du-hchip">' + esc(k) + ' <b class="w">' + v.w + '胜</b>' + (v.l ? ' / ' + v.l + '负' : '') + (v.d ? ' / ' + v.d + '平' : '') + '</span>'
          }).join('') + '</div>'
          : ''
      })()
      + sparkSVG(eloSeries(p))
      + '<div style="margin-top:11px">' + histList(p) + '</div>'
      + '</div>'
    /* 每日挑战 + 错题复仇 */
    s += '<div class="du-card" style="--i:1">'
      + '<div class="du-daily" data-act="daily" role="button" tabindex="0" style="cursor:pointer">'
      + '<span class="ic">⚡</span><div class="tx"><b>今日挑战者：' + d.opp.icon + ' ' + esc(d.opp.name) + '</b>'
      + '<span>ELO ' + d.opp.elo + ' · 胜利 +' + d.bonus + ' ELO（每日限一次' + (dailyClaimed ? ' · 今日已领取，仍可陪练' : '') + '）'
      + ' · 种子按日期固定，判定全天可复现</span></div>'
      + '<button class="du-btn sm fire">' + (dailyClaimed ? '陪练' : '挑战') + '</button></div>'
      + (p.wrongBook.length
        ? '<div class="du-daily du-revenge" data-act="revenge" role="button" tabindex="0">'
          + '<span class="ic">📕</span><div class="tx"><b>错题复仇（' + p.wrongBook.length + '）</b>'
          + '<span>' + esc(trunc(p.wrongBook[0].stem, 34)) + (p.wrongBook.length > 1 ? ' 等' : '')
          + ' · 单人重做，答对即移除；不限时刷新你对错题的肌肉记忆</span></div>'
          + '<button class="du-btn sm">开始清算</button></div>'
        : '')
      + '</div>'
    /* 出题来源：站内数据接入（题库/题卷/错题/资料库 —— 全走 ctx.Store 只读桥） */
    ;(function () {
      let mode = state.srcMode || 'ai'
      let subject = String(ctx.config('subject') || '数学')
      let bankN = bankPool(ctx, subject).length
      let examN = nativeExams(ctx).length
      let mkN = nativeMistakes(ctx).length
      s += '<div class="du-card" style="--i:2"><h3 class="du-h">🎯 出题来源 <em>站内数据接入</em></h3>'
        + '<div class="du-desc">出题来源对天梯 / 每日 / 友谊赛全部生效：'
        + '<b>AI 智能</b>无限新题；<b>站内题库</b>直接抽你收藏的题目（零 AI 调用，秒开）；'
        + '<b>题卷挑战</b>拿站内整张卷的选择题开战；<b>弱项突击</b>让 AI 读你站内错题本'
        + '（可选叠加资料库讲义）针对薄弱点命题。非友谊赛战败题可同步进站内错题本。</div>'
        + '<div class="du-srcrow">'
        + srcChip('ai', '🧠', 'AI 智能', '无限新题', mode, true)
        + srcChip('bank', '🗃', '站内题库', bankN + ' 道可选', mode, bankN > 0)
        + srcChip('exam', '📄', '题卷挑战', examN + ' 张整卷', mode, examN > 0)
        + srcChip('weak', '🎯', '弱项突击', mkN + ' 条错题驱动', mode, mkN > 0)
        + '</div>'
        + (mode === 'exam' ? examPickerHTML(ctx, state) : '')
        + (mode === 'weak' ? weakPickerHTML(ctx, state) : '')
        + '</div>'
    })()
    /* 成就徽章墙 */
    s += '<div class="du-card" style="--i:3"><h3 class="du-h">🏅 成就 <em>' + p.badges.length + ' / ' + BADGES.length + '</em></h3>'
      + '<div class="du-badges">' + BADGES.map(function (b, i) {
        let got = p.badges.indexOf(b.id) >= 0
        return '<div class="du-badge' + (got ? '' : ' off') + '" style="--i:' + i + '" title="' + esc(b.desc) + '">'
          + '<div class="t"><i>' + (got ? b.icon : '❔') + '</i>' + esc(b.name) + '</div>'
          + '<p>' + esc(b.desc) + '</p></div>'
      }).join('') + '</div></div>'
    s += '<div class="du-card" style="--i:4"><h3 class="du-h">选择对手</h3>'
      + '<div class="du-desc">解锁规则：ELO ≥ 对手 − ' + UNLOCK_WINDOW + '；Boss「心魔」需 ELO ≥ ' + BOSS_UNLOCK_ELO + '。'
      + '对手作答由种子随机按其命中率×难度修正模拟 —— 同一场决斗结果必然可复现（种子随战绩存档）。</div>'
      + '<div class="du-ladder">' + ladderState(ctx).map(function (c, i) { return oppCard(c, i) }).join('') + '</div>'
      + '</div>'
    return s
  }

  /* 出题提示词：AI 只负责生成整场题，判定不走 AI（确定性） */
  function sysGenQuestions(subject, opp, n) {
    return '你是考研【' + subject + '】科目的命题专家。为一场「刷题决斗」出 ' + n + ' 道单项选择题。'
      + '决斗对手设定：' + opp.name + '（' + opp.tag + '）。'
      + '只输出 JSON，不要输出任何其他文字。格式：{"qs":[{"stem":"题干（自包含，不引用外部材料）",'
      + '"options":["选项A","选项B","选项C","选项D"],"answer":0,"explain":"解析：考点 + 正确项理由 + 错项错因",'
      + '"difficulty":1到5,"topic":"考点名"}]}。'
      + '要求：answer 为正确项下标（0-3）；四项互斥且仅一项正确；难度从 2 到 5 大致递增；'
      + '考点互不重复；全部使用中文。'
  }
  /* 弱项突击出题：在基础契约上追加「站内错题 + 资料库讲义节选」语料，
   * 让 AI 针对用户真实薄弱点命题（错题只有题干，选项/答案仍由 AI 补齐）。 */
  function sysGenWeak(subject, opp, n, mistakes, excerpt) {
    let s = sysGenQuestions(subject, opp, n)
    let stems = (mistakes || []).slice(0, 15).map(function (m) {
      return '- ' + trunc(flat(m && (m.stem || m.desc) || ''), 180)
    }).filter(function (x) { return x.length > 2 })
    if (stems.length) {
      s += '\n【弱项突击】学员站内错题本最近错题如下，请针对这些薄弱点命题'
        + '（可变换角度、适当提高一档难度，考点向错题集中处倾斜）：\n' + stems.join('\n')
    }
    if (excerpt) {
      s += '\n【参考讲义节选（来自站内资料库）】\n' + excerpt
        + '\n命题可结合讲义中的概念、定理与例题风格，但题干必须自包含。'
    }
    return s
  }
  /* AI 返回清洗：结构不合法就丢，凑不齐 3 题视为出题失败 */
  function normalizeQs(raw, want) {
    let arr = raw && Array.isArray(raw.qs) ? raw.qs : []
    let out = []
    for (let i = 0; i < arr.length && out.length < want; i++) {
      let q = arr[i] || {}
      let stem = flat(q.stem), topic = flat(q.topic) || '综合'
      let opts = Array.isArray(q.options) ? q.options.map(flat) : []
      let ans = Math.round(num(q.answer, -1))
      let diff = clamp(Math.round(num(q.difficulty, 3)), 1, 5)
      let explain = flat(q.explain)
      if (!stem || opts.length !== 4 || opts.some(function (o) { return !o }) || ans < 0 || ans > 3 || !explain) continue
      out.push({ stem: stem, options: opts, answer: ans, explain: explain, difficulty: diff, topic: topic })
    }
    return out
  }

  /* ════════════════════════ 6. 主视图：大厅 ⇄ 决斗 ⇄ 结算 ════════════════════════ */

  function mountMain(el, ctx) {
    injectStyles()
    let state = {
      view: 'lobby', bt: null, last: null,
      srcMode: (function () { try { return ctx.data('srcMode') || 'ai' } catch (e) { return 'ai' } })(),
      examId: '', bookId: ''
    }
    let root = null, body = null, unbind = null, offStuck = null

    function stopTimer() {
      let bt = state.bt
      if (bt && bt.tInt) { clearInterval(bt.tInt); bt.tInt = null }
    }

    function render() {
      if (unbind) { unbind(); unbind = null }
      if (offStuck) { offStuck(); offStuck = null }
      el.innerHTML = '<div class="du-root">' + heroHTML(ctx, state.view === 'battle') + '<div class="du-body"></div></div>'
      root = el.firstElementChild || el.children[0]
      body = root.querySelector('.du-body')
      unbind = delegate(root, actions)
      offStuck = bindStuck(root)
      if (state.view === 'lobby') body.innerHTML = lobbyHTML(ctx, state)
      else if (state.view === 'battle') body.innerHTML = arenaHTML()
      else body.innerHTML = resultHTML()
    }

    /* —— 大厅 —— */
    /* 需要 AI 的题源（ai/weak）才校验 AI 配置；站内题库/题卷为本地数据，零 AI 依赖 */
    function srcNeedsAI() {
      let m = state.srcMode || 'ai'
      return m === 'ai' || m === 'weak'
    }
    function tryPick(oid) {
      let cell = ladderState(ctx).filter(function (c) { return c.opp.id === oid })[0]
      if (!cell) return
      if (cell.locked) { ctx.Toast.show('还没解锁 —— 先提升 ELO 再来', 'info', 1800); return }
      if (srcNeedsAI() && !aiReady(ctx)) { ctx.Toast.show('请先在设置里配置 AI 接口', 'warn', 2600); return }
      startBattle(cell.opp)
    }

    /* —— 开战：消耗护盾（若有）→ AI 一次性生成整场题 ——
     * opts.seed：固定比赛种子（每日挑战用，判定全天可复现）；
     * opts.bonus：胜利额外 ELO（每日挑战）；opts.soloQs：错题复仇（不出题，直接用错题本）。 */
    function startBattle(opp, opts) {
      opts = opts || {}
      let p = profileGet(ctx)
      let subject = String(ctx.config('subject') || '数学')
      let n = clamp(Math.round(num(ctx.config('questionsPerMatch'), 5)), 3, 10)
      let secs = clamp(Math.round(num(ctx.config('secondsPerQ'), 30)), 10, 120)
      let bt = state.bt = {
        opp: opp, subj: subject, id: opts.seed || uid('duel'), qs: [], idx: 0,
        pMax: PLAYER_HP + (p.shield ? 20 : 0), oMax: opp.boss ? BOSS_HP : PLAYER_HP,
        shield: p.shield === true, secs: secs, want: n,
        bonus: num(opts.bonus, 0), solo: !!opts.soloQs, friendly: !!opts.friendly,
        srcMode: opts.srcMode || state.srcMode || 'ai',
        srcLabel: '', examId: opts.examId || state.examId || '', bookId: opts.bookId || state.bookId || '',
        review: [], usedSum: 0, answered: 0, missed: 0, lastPick: -1,
        phase: 'loading', locked: false, tInt: null, tLeft: 0, used: 0, judgeTimer: null
      }
      bt.pHp = bt.pMax; bt.oHp = bt.oMax
      /* 预置来源标签：开战首帧（loading 态）的顶部条也要带；loader 细化后用 render() 刷新 */
      bt.srcLabel = bt.solo ? '📕 错题复仇'
        : bt.srcMode === 'bank' ? '🗃 站内题库'
          : bt.srcMode === 'exam' ? '📄 题卷挑战'
            : bt.srcMode === 'weak' ? '🎯 弱项突击' : '🧠 AI 智能出题'
      if (bt.shield && !bt.friendly) {
        p.shield = false
        profileSave(ctx, p)
        ctx.Toast.show('🛡 护盾生效：本场 +20 HP', 'info', 2200)
      }
      state.view = 'battle'
      render()
      if (bt.solo) {
        bt.srcLabel = '📕 错题复仇'
        bt.qs = opts.soloQs.slice(0, 10)
        bt.phase = 'fight'
        renderQuestion()
        return
      }
      /* 站内题库：直接抽收藏题（零 AI 调用，秒开） */
      if (bt.srcMode === 'bank') {
        let pool = bankPool(ctx, subject)
        let bankQs = shuffle(pool).slice(0, n)
        if (bankQs.length < Math.min(3, n)) {
          ctx.Toast.show('站内题库「' + subject + '」可选选择题不足 ' + Math.min(3, n) + ' 道（现有 '
            + bankQs.length + ' 道）—— 去题库/题卷收藏些好题，或切回 AI 智能', 'warn', 4200)
          state.view = 'lobby'; state.bt = null; render(); return
        }
        bt.qs = bankQs; bt.srcLabel = '🗃 站内题库 × ' + bankQs.length
        bt.phase = 'fight'
        render()
        renderQuestion()
        return
      }
      /* 题卷挑战：拿站内整张卷的选择题开战 */
      if (bt.srcMode === 'exam') {
        let exams = nativeExams(ctx)
        let exam = exams.filter(function (e) { return e.id === bt.examId })[0] || exams[0]
        if (!exam) {
          ctx.Toast.show('站内还没有题卷 —— 去「题卷」模块生成或导入一张再来', 'warn', 3200)
          state.view = 'lobby'; state.bt = null; render(); return
        }
        let exQs = examChoiceQs(exam)
        if (exQs.length < 2) {
          ctx.Toast.show('「' + trunc(exam.title || '未命名卷', 20) + '」里可选选择题不足 2 道，换一张卷', 'warn', 3200)
          state.view = 'lobby'; state.bt = null; render(); return
        }
        bt.qs = shuffle(exQs).slice(0, 10)
        bt.srcLabel = '📄 ' + trunc(exam.title || '题卷', 16) + ' × ' + bt.qs.length
        bt.phase = 'fight'
        render()
        renderQuestion()
        return
      }
      /* AI 出题（ai = 纯生成；weak = 追加站内错题 + 资料库讲义语料） */
      let sys = sysGenQuestions(subject, opp, n)
      let usr = '科目：' + subject + '；题数：' + n
      if (bt.srcMode === 'weak') {
        let mks = nativeMistakes(ctx)
        let book = bt.bookId ? nativeBooks(ctx).filter(function (b) { return b.id === bt.bookId })[0] : null
        sys = sysGenWeak(subject, opp, n, mks, bookExcerpt(book))
        usr = '科目：' + subject + '；题数：' + n + '；依据站内 ' + mks.length + ' 条错题'
          + (book ? ' + 资料库《' + trunc(book.title || '', 20) + '》' : '') + ' 针对性命题'
        bt.srcLabel = '🎯 弱项突击' + (book ? ' · ' + trunc(book.title || '', 10) : '')
      } else {
        bt.srcLabel = '🧠 AI 智能出题'
      }
      aiJSON(ctx, sys, usr, { timeout: 180000, maxTokens: 4000 })
        .then(function (raw) {
          if (state.bt !== bt) return
          let qs = normalizeQs(raw, n)
          if (qs.length < Math.min(3, n)) {
            ctx.Toast.show('出题失败：AI 返回题目不足，请重试', 'warn', 3000)
            state.view = 'lobby'; state.bt = null; render(); return
          }
          bt.qs = qs; bt.phase = 'fight'
          render()
          renderQuestion()
        })
        .catch(function (e) {
          if (state.bt !== bt) return
          ctx.log('决斗出题失败：' + (e && e.message || e), 'warn')
          ctx.Toast.show('出题失败：' + trunc(e && e.message || e, 40), 'warn', 3000)
          state.view = 'lobby'; state.bt = null; render()
        })
    }

    /* 错题复仇：单人重做错题本，答对即移除 */
    function startRevenge() {
      let p = profileGet(ctx)
      if (!p.wrongBook.length) { ctx.Toast.show('错题本是空的 —— 先去打一场', 'info', 1800); return }
      let opp = { id: 'revenge', name: '过去的自己', icon: '📕', elo: profileGet(ctx).elo, acc: 0, tag: '错题清算中' }
      startBattle(opp, { soloQs: p.wrongBook })
    }

    /* —— 决斗台 —— */
    function arenaHTML() {
      let bt = state.bt
      let myElo = profileGet(ctx).elo
      let s = '<div class="du-card du-arena" style="--i:0">'
        + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:8px;flex-wrap:wrap">'
        + '<span style="font-size:11.5px;color:var(--du-sub)">'
        + (bt.srcLabel ? esc(bt.srcLabel) + ' · ' : '')
        + (bt.friendly ? '🤝 友谊赛 · 不计 ELO · ' : '')
        + '键盘：<span class="du-kbd">1</span>-<span class="du-kbd">4</span> 或 <span class="du-kbd">A</span>-<span class="du-kbd">D</span> 作答 · <span class="du-kbd">Enter</span> 下一题</span>'
        + '<button class="du-btn sm" data-act="forfeit">' + (bt.solo ? '✕ 退出清算' : '🏳 认输') + '</button></div>'
        + '<div class="du-hps">'
        + '<div class="du-hpbox" id="du-hp-p"><div class="du-hpname"><span class="ic">🎓</span>你'
        + (bt.shield ? ' <span title="quizDone 护盾">🛡</span>' : '')
        + '<span style="color:var(--du-sub);font-weight:400">' + (bt.solo ? '错题复仇' : 'ELO ' + myElo) + '</span></div>'
        + '<div class="du-hpbar"><div class="du-hpfill" style="width:100%"></div></div>'
        + '<div class="du-hpnum"><span class="n">' + bt.pHp + '</span> / ' + bt.pMax + '</div></div>'
      if (!bt.solo) {
        s += '<div class="du-vs">VS</div>'
          + '<div class="du-hpbox opp" id="du-hp-o"><div class="du-hpname"><span class="ic">' + bt.opp.icon + '</span>' + esc(bt.opp.name)
          + '<span style="color:var(--du-sub);font-weight:400">ELO ' + bt.opp.elo + '</span></div>'
          + '<div class="du-hpbar"><div class="du-hpfill" style="width:100%"></div></div>'
          + '<div class="du-hpnum"><span class="n">' + bt.oHp + '</span> / ' + bt.oMax + '</div></div>'
      }
      s += '</div><div class="du-qarea">'
      if (bt.phase === 'loading') {
        s += '<div class="du-empty"><b>' + bt.opp.icon + ' ' + esc(bt.opp.name) + ' 正在布题…</b>AI 命题中，稍安勿躁</div>'
      } else if (bt.qs.length) {
        s += qHTML(bt)
      }
      return s + '</div></div>'
    }

    function qHTML(bt) {
      let q = bt.qs[bt.idx]
      if (!q) return ''
      let letters = ['A', 'B', 'C', 'D']
      return '<div class="du-timerwrap"><span>第 ' + (bt.idx + 1) + ' / ' + bt.qs.length + ' 题 · ' + esc(q.topic) + '</span>'
        + '<div class="du-timerbar"><div class="du-timerfill"></div></div><span class="du-tnum">' + bt.secs + 's</span></div>'
        + '<div class="du-q">'
        + '<div class="du-qmeta">难度 ' + '★'.repeat(q.difficulty) + '☆'.repeat(5 - q.difficulty) + '</div>'
        + '<div class="du-qstem">' + esc(q.stem) + '</div>'
        + '<div class="du-opts">'
        + q.options.map(function (o, i) {
          return '<button class="du-opt" data-act="pick-opt" data-i="' + i + '"><b>' + letters[i] + '</b>' + esc(o) + '</button>'
        }).join('')
        + '</div>'
        + '<div style="margin-top:11px;min-height:30px"><span class="du-think" style="display:none"><i></i><i></i><i></i> 对手作答中…</span></div>'
        + '<div class="du-judge"></div>'
        + '<div style="margin-top:12px;text-align:right"><button class="du-btn fire" data-act="next-q" style="display:none"></button></div>'
        + '</div>'
    }

    function renderQuestion() {
      let bt = state.bt
      if (!bt || !body) return
      let area = body.querySelector('.du-qarea')
      if (!area) return
      area.innerHTML = qHTML(bt)
      bt.locked = false
      bt.tLeft = bt.secs
      paintTimer()
      stopTimer()
      bt.tInt = setInterval(function () {
        bt.tLeft -= 0.25
        paintTimer()
        if (bt.tLeft <= 0) { stopTimer(); onTimeout() }
      }, 250)
    }

    function paintTimer() {
      let bt = state.bt; if (!bt || !body) return
      let f = body.querySelector('.du-timerfill'), n = body.querySelector('.du-tnum')
      if (!f) return
      let pct = clamp(bt.tLeft / bt.secs * 100, 0, 100)
      f.style.width = pct + '%'
      f.classList.toggle('low', pct < 34)
      if (n) n.textContent = Math.ceil(Math.max(bt.tLeft, 0)) + 's'
    }

    /* 玩家点选项：锁定 → 秀「对手作答中」→ 结算（520ms 节奏感） */
    function pickOpt(i) {
      let bt = state.bt
      if (!bt || bt.phase !== 'fight' || bt.locked) return
      bt.locked = true
      stopTimer()
      bt.used = clamp(Math.round(bt.secs - bt.tLeft), 0, bt.secs)
      bt.lastPick = i
      let btn = body.querySelector('.du-opt[data-i="' + i + '"]')
      if (btn) btn.classList.add('picked')
      let all = body.querySelectorAll('.du-opt')
      for (let k = 0; k < all.length; k++) all[k].disabled = true
      let think = body.querySelector('.du-think')
      if (think) think.style.display = bt.solo ? 'none' : ''
      let qi = i
      bt.judgeTimer = setTimeout(function () {
        bt.judgeTimer = null
        settle(qi === bt.qs[bt.idx].answer)
      }, bt.solo ? 60 : 520)
    }

    function onTimeout() {
      let bt = state.bt
      if (!bt || bt.locked) return
      bt.locked = true
      bt.used = bt.secs
      bt.lastPick = -1
      settle(false)
    }

    /* 一题结算：种子模拟对手 → 伤害模型 → 原位更新 HP + 飘字；
     * 同时记赛后回顾（keep）与错题本（云同步）：答对移出、答错收录 */
    function settle(playerCorrect) {
      let bt = state.bt; if (!bt || !body) return
      let q = bt.qs[bt.idx]
      bt.answered += 1
      bt.usedSum += bt.used
      if (!playerCorrect) bt.missed += 1
      bt.review.push({
        stem: q.stem, topic: q.topic, options: q.options, answer: q.answer,
        pick: bt.lastPick, ok: playerCorrect, explain: q.explain
      })
      /* 错题本维护（复仇模式答对即真正移除） */
      let p = profileGet(ctx)
      if (playerCorrect) {
        if (p.wrongBook.length && p.wrongBook.some(function (x) { return x.stem === q.stem })) {
          p.wrongBook = bookRemove(p.wrongBook, q.stem)
          profileSave(ctx, p)
        }
      } else {
        p.wrongBook = bookUpsert(p.wrongBook, q)
        profileSave(ctx, p)
      }
      if (bt.solo) {
        bt.phase = 'judge'
        paintSoloResult(playerCorrect, q)
        if (bt.idx >= bt.qs.length - 1) bt.phase = 'over'
        return
      }
      let oppOK = oppAnswersCorrect(bt.opp.acc, q.difficulty, hashStr(bt.id + ':' + bt.idx))
      let r = resolveQuestion(playerCorrect, bt.used, oppOK, q.difficulty, bt.secs)
      bt.pHp = Math.max(0, bt.pHp - r.pDmg)
      bt.oHp = Math.max(0, bt.oHp - r.oDmg)
      bt.phase = 'judge'
      paintResult(playerCorrect, oppOK, r, q)
      if (bt.idx >= bt.qs.length - 1 || bt.pHp <= 0 || bt.oHp <= 0) {
        bt.phase = 'over'
        if (bt.pHp <= 0 || bt.oHp <= 0) {
          let arena = body.querySelector('.du-arena')
          if (arena) { arena.classList.remove('shake'); void arena.offsetWidth; arena.classList.add('shake') }
        }
      }
    }

    /* 错题复仇的单题反馈 */
    function paintSoloResult(playerCorrect, q) {
      let bt = state.bt; if (!bt || !body) return
      let all = body.querySelectorAll('.du-opt')
      for (let i = 0; i < all.length; i++) {
        let b = all[i]
        b.disabled = true
        if (Number(b.dataset.i) === q.answer) b.classList.add('right')
        else if (b.classList.contains('picked')) b.classList.add('wrong')
      }
      let judge = body.querySelector('.du-judge')
      if (judge) {
        judge.className = 'du-judge on ' + (playerCorrect ? 'ok' : 'no')
        judge.innerHTML = '<b>' + (playerCorrect ? '✓ 已掌握，移出错题本' : '✗ 仍在错题本（错 ' + (function () {
          let p = profileGet(ctx)
          let hit = p.wrongBook.filter(function (x) { return x.stem === q.stem })[0]
          return hit ? hit.wrong : 1
        })() + ' 次）') + '</b><br><span style="color:var(--du-sub)">' + esc(q.explain) + '</span>'
      }
      let next = body.querySelector('[data-act="next-q"]')
      if (next) {
        next.textContent = bt.idx >= bt.qs.length - 1 ? '完成清算 ✔' : '下一题 →'
        next.style.display = ''
      }
    }

    function updateHp(box, hp, max, dmg) {
      if (!box) return
      let fill = box.querySelector('.du-hpfill'), numEl = box.querySelector('.du-hpnum .n')
      if (fill) {
        fill.style.width = Math.round(hp / max * 100) + '%'
        fill.classList.toggle('crit', hp > 0 && hp / max <= 0.3) /* 低血量警戒色 */
      }
      if (numEl) numEl.textContent = hp
      if (dmg > 0) {
        box.classList.remove('hit')
        void box.offsetWidth /* 重启动画 */
        box.classList.add('hit')
        let fl = document.createElement('span')
        fl.className = 'du-float'
        fl.style.color = 'var(--du-danger)'
        fl.style.top = '4px'
        fl.style[box.classList.contains('opp') ? 'left' : 'right'] = '13px'
        fl.textContent = '-' + dmg
        box.appendChild(fl)
        setTimeout(function () { if (fl.parentNode) fl.parentNode.removeChild(fl) }, 1050)
      }
    }

    function paintResult(playerCorrect, oppOK, r, q) {
      let bt = state.bt; if (!bt || !body) return
      let all = body.querySelectorAll('.du-opt')
      for (let i = 0; i < all.length; i++) {
        let b = all[i]
        b.disabled = true
        if (Number(b.dataset.i) === q.answer) b.classList.add('right')
        else if (b.classList.contains('picked')) b.classList.add('wrong')
      }
      let think = body.querySelector('.du-think')
      if (think) think.style.display = 'none'
      let verdict = playerCorrect
        ? (oppOK ? '你答对了，' + esc(bt.opp.name) + ' 也答对了 —— 双对反震！' : '命中！' + esc(bt.opp.name) + ' 答错了这题')
        : (oppOK ? '这题失手，' + esc(bt.opp.name) + ' 命中 —— 你受到 ' + r.pDmg + ' 点伤害' : '双方都答错了 —— 虚惊一场')
      let judge = body.querySelector('.du-judge')
      if (judge) {
        judge.className = 'du-judge on ' + (playerCorrect ? 'ok' : 'no')
        judge.innerHTML = '<b>' + (playerCorrect ? '✓ 答对' : '✗ 答错 / 超时') + '</b> · ' + verdict
          + '<br><span style="color:var(--du-sub)">' + esc(q.explain) + '</span>'
      }
      updateHp(body.querySelector('#du-hp-p'), bt.pHp, bt.pMax, r.pDmg)
      updateHp(body.querySelector('#du-hp-o'), bt.oHp, bt.oMax, r.oDmg)
      let next = body.querySelector('[data-act="next-q"]')
      if (next) {
        next.textContent = bt.idx >= bt.qs.length - 1 || bt.pHp <= 0 || bt.oHp <= 0 ? '查看结算 ⚔' : '下一题 →'
        next.style.display = ''
      }
    }

    function nextQ() {
      let bt = state.bt
      if (!bt) return
      if (bt.phase === 'over') { if (bt.solo) endSolo(); else endMatch(); return }
      bt.idx += 1
      bt.phase = 'fight'
      renderQuestion()
    }

    /* 错题复仇收尾：不入编年史、不动 ELO，只报清算结果 */
    function endSolo() {
      let bt = state.bt; if (!bt) return
      stopTimer()
      let cleared = bt.review.filter(function (r) { return r.ok }).length
      let left = profileGet(ctx).wrongBook.length
      state.bt = null
      state.view = 'lobby'
      render()
      ctx.Toast.show('📕 清算完成：掌握 ' + cleared + ' 题' + (left ? '，还剩 ' + left + ' 题待复仇' : '，错题本清空 🎉'), left ? 'info' : 'ok', 3200)
      try { ctx.log('错题复仇：' + cleared + '/' + bt.review.length + '，剩余 ' + left) } catch (e) { }
    }

    /* —— 结算：ELO + 连胜 + 每日奖励 + 成就 + 编年史 —— */
    function endMatch(forfeit) {
      let bt = state.bt; if (!bt) return
      stopTimer()
      if (bt.judgeTimer) { clearTimeout(bt.judgeTimer); bt.judgeTimer = null }
      /* 战败题回写站内原生错题本（dedupKey 幂等；config 可关；友谊赛也回写 —— 练手感同样攒错题） */
      if (!bt.solo) {
        let wb = writeBackMistakes(ctx, bt)
        if (wb > 0) ctx.Toast.show('📕 已同步 ' + wb + ' 道战败题到站内错题本', 'info', 2600)
      }
      /* 友谊赛：纯练手感 —— 不动 ELO/编年史/成就/每日，保留回顾与错题本 */
      if (bt.friendly) {
        let fScore = forfeit ? 0 : bt.pHp > bt.oHp ? 1 : bt.pHp < bt.oHp ? 0 : 0.5
        try {
          ctx.keep.set(REVIEW_KEEP_KEY, {
            at: Date.now(), oppName: bt.opp.name, oppIcon: bt.opp.icon, subj: bt.subj,
            score: fScore, friendly: true, review: bt.review
          })
        } catch (e) { }
        state.last = {
          opp: bt.opp, score: fScore, friendly: true, forfeit: !!forfeit, delta: 0,
          pHp: bt.pHp, oHp: bt.oHp, ko: !forfeit && (bt.pHp <= 0 || bt.oHp <= 0),
          rounds: bt.qs.length, subj: bt.subj, srcLabel: bt.srcLabel, review: bt.review
        }
        state.bt = null
        state.view = 'result'
        render()
        try { ctx.log('友谊赛结束：vs ' + bt.opp.name + ' · HP ' + bt.pHp + ':' + bt.oHp) } catch (e) { }
        return
      }
      let score = forfeit ? 0 : bt.pHp > bt.oHp ? 1 : bt.pHp < bt.oHp ? 0 : 0.5
      let p = profileGet(ctx)
      let oldElo = p.elo
      let newElo = eloUpdate(oldElo, bt.opp.elo, score)
      /* 连胜奖励：胜场额外 +min(streak, STREAK_MAX) ELO（连胜数在 +1 前算） */
      let bonus = 0
      if (score === 1) bonus = Math.min(num(p.streak, 0), STREAK_MAX)
      /* 每日挑战奖励：每日限领一次 */
      let dailyBonus = 0
      let d = dailyOpp()
      if (score === 1 && bt.id === d.seed && !(p.daily && p.daily.key === d.key && p.daily.claimed)) {
        dailyBonus = d.bonus
        p.daily = { key: d.key, claimed: true }
      }
      newElo += bonus + dailyBonus
      let delta = newElo - oldElo
      p.elo = newElo
      if (score === 1) { p.wins += 1; p.streak = num(p.streak, 0) + 1 } else { if (score === 0) p.losses += 1; else p.draws += 1; p.streak = 0 }
      let last = {
        opp: bt.opp, score: score, delta: delta, oldElo: oldElo, newElo: newElo, bonus: bonus, dailyBonus: dailyBonus,
        forfeit: !!forfeit, streak: score === 1 ? p.streak : 0,
        pHp: bt.pHp, oHp: bt.oHp, ko: !forfeit && (bt.pHp <= 0 || bt.oHp <= 0), rounds: bt.qs.length, subj: bt.subj,
        allCorrect: bt.answered > 0 && bt.missed === 0, answered: bt.answered,
        avgUsed: bt.answered ? bt.usedSum / bt.answered : 99,
        oppEloGap: bt.opp.elo - oldElo, oppBoss: !!bt.opp.boss,
        srcLabel: bt.srcLabel,
        review: bt.review
      }
      /* 成就评估（基于已更新的 profile 计数） */
      let fresh = checkBadges(last, p)
      if (fresh.length) {
        p.badges = p.badges.concat(fresh)
        fresh.forEach(function (id) {
          let b = BADGES.filter(function (x) { return x.id === id })[0]
          if (b) ctx.Toast.show('🏅 成就解锁：' + b.icon + ' ' + b.name, 'ok', 3200)
        })
      }
      p.history.unshift({
        ts: Date.now(), oid: bt.opp.id, name: bt.opp.name, icon: bt.opp.icon, oppElo: bt.opp.elo,
        result: forfeit ? 'F' : score === 1 ? 'W' : score === 0 ? 'L' : 'D',
        elo: newElo, delta: delta, subj: bt.subj, seed: bt.id, bonus: bonus + dailyBonus
      })
      profileSave(ctx, p)
      /* 赛后题目回顾存 keep（本地）：解析不丢，随时回看不占云同步 */
      try {
        ctx.keep.set(REVIEW_KEEP_KEY, {
          at: Date.now(), oppName: bt.opp.name, oppIcon: bt.opp.icon, subj: bt.subj,
          score: score, review: bt.review
        })
      } catch (e) { }
      state.last = last
      state.bt = null
      state.view = 'result'
      render()
      if (score === 1) confetti()
      try { ctx.log('决斗结束：vs ' + last.opp.name + ' · ' + (forfeit ? '认输' : score === 1 ? '胜' : score === 0 ? '负' : '平') + ' · ELO ' + oldElo + '→' + newElo + (bonus ? '（连胜+' + bonus + '）' : '') + (dailyBonus ? '（每日+' + dailyBonus + '）' : '') + (fresh.length ? ' · 新成就 ' + fresh.join(',') : '')) } catch (e) { }
      let numEl = body && body.querySelector('#du-elonum')
      if (numEl) countUp(numEl, newElo, 800, '')
    }

    function resultHTML() {
      let last = state.last
      if (!last) return ''
      if (last.friendly) {
        let fw = last.score === 1
        let fko = last.ko ? (fw ? ' · KO！' + esc(last.opp.name) + ' HP 归零' : ' · 被 KO') : ''
        return '<div class="du-card" style="--i:0"><div class="du-banner ' + (fw ? 'win' : 'lose') + '">'
          + '<div class="big">🤝 友谊赛' + (last.forfeit ? ' · 提前结束' : fw ? ' · 你赢了' : last.score === 0.5 ? ' · 平局' : ' · 输了') + '</div>'
          + '<div class="sub">vs ' + last.opp.icon + ' ' + esc(last.opp.name) + ' · ' + esc(last.subj)
          + (last.srcLabel ? ' · ' + esc(last.srcLabel) : '')
          + ' · 剩余 HP ' + last.pHp + ' : ' + last.oHp + fko + ' · 不计 ELO，纯练手感</div>'
          + '</div>'
          + '<div style="display:flex;gap:9px;flex-wrap:wrap;margin:4px 0 13px">'
          + '<button class="du-btn fire" data-act="rematch">⚔ 再来一场友谊赛</button>'
          + '<button class="du-btn" data-act="go-lobby">返回天梯</button>'
          + '</div>'
          + (last.review && last.review.length ? '<h3 class="du-h" style="margin-top:6px">📖 题目回顾 <em>' + last.review.length + ' 题</em></h3>' : '')
          + reviewHTML(last.review)
          + '</div>'
      }
      let win = last.score === 1
      let koTxt = last.ko ? (win ? ' · KO！' + esc(last.opp.name) + ' HP 归零' : ' · 被 KO，你的 HP 归零') : ''
      let s = '<div class="du-card" style="--i:0"><div class="du-banner ' + (win ? 'win' : 'lose') + '">'
        + '<div class="big">' + (last.forfeit ? '🏳 认输' : win ? '🏆 胜利' : last.score === 0.5 ? '🤝 平局' : '💀 战败') + '</div>'
        + '<div class="sub">vs ' + last.opp.icon + ' ' + esc(last.opp.name) + '（ELO ' + last.opp.elo + '）· ' + esc(last.subj)
        + (last.srcLabel ? ' · ' + esc(last.srcLabel) : '')
        + (last.forfeit ? ' · 中途认输' : ' · 剩余 HP ' + last.pHp + ' : ' + last.oHp + koTxt) + '</div>'
        + '<span class="du-elodelta ' + (last.delta >= 0 ? 'up' : 'down') + '">' + (last.delta >= 0 ? '+' : '') + last.delta + ' ELO'
        + (last.bonus ? '（连胜 +' + last.bonus + '）' : '') + (last.dailyBonus ? '（每日挑战 +' + last.dailyBonus + '）' : '') + '</span>'
        + (win && last.streak > 1 ? '<div class="sub" style="margin-top:7px">🔥 当前连胜 <b style="color:var(--du-gold)">' + last.streak + '</b> —— 下场胜利再 +' + Math.min(last.streak, STREAK_MAX) + ' ELO</div>' : '')
        + '</div>'
        + '<div class="du-statgrid">'
        + '<div class="du-stat" style="--i:0"><b id="du-elonum">' + last.oldElo + '</b><span>当前 ELO</span></div>'
        + statCell(1, last.pHp + ' : ' + last.oHp, '剩余 HP')
        + statCell(2, last.rounds, '答题数')
        + statCell(3, profileGet(ctx).history.length, '总场次')
        + '</div>'
        + '<div style="display:flex;gap:9px;flex-wrap:wrap;margin:4px 0 13px">'
        + '<button class="du-btn fire" data-act="rematch">⚔ 再战一场</button>'
        + '<button class="du-btn" data-act="go-lobby">返回天梯</button>'
        + '</div>'
        + histList(profileGet(ctx), 6)
        + '</div>'
      /* 赛后题目回顾：解析不丢，逐题可折叠回看 */
      if (!last.forfeit && last.review && last.review.length) {
        s += '<div class="du-card" style="--i:1"><h3 class="du-h">📖 题目回顾 <em>' + last.review.length + ' 题 · 答对 '
          + last.review.filter(function (r) { return r.ok }).length + '</em></h3>'
          + reviewHTML(last.review) + '</div>'
      }
      return s
    }

    let actions = {
      pick: function (t) { tryPick(t.dataset.oid) },
      friendly: function (t) {
        let cell = ladderState(ctx).filter(function (c) { return c.opp.id === t.dataset.oid })[0]
        if (!cell || cell.locked) return
        if (srcNeedsAI() && !aiReady(ctx)) { ctx.Toast.show('请先在设置里配置 AI 接口', 'warn', 2600); return }
        startBattle(cell.opp, { friendly: true })
      },
      daily: function () {
        if (srcNeedsAI() && !aiReady(ctx)) { ctx.Toast.show('请先在设置里配置 AI 接口', 'warn', 2600); return }
        let d = dailyOpp()
        startBattle(d.opp, { seed: d.seed, bonus: d.bonus })
      },
      'src-mode': function (t) {
        let m = t.dataset.m
        let subject = String(ctx.config('subject') || '数学')
        if (m === 'bank' && !bankPool(ctx, subject).length) {
          ctx.Toast.show('站内题库还没有「' + subject + '」可选选择题 —— 去题库/题卷收藏些题', 'warn', 3200); return
        }
        if (m === 'exam' && !nativeExams(ctx).length) {
          ctx.Toast.show('站内还没有题卷 —— 去「题卷」模块生成或导入一张', 'warn', 3200); return
        }
        if (m === 'weak' && !nativeMistakes(ctx).length && !nativeBooks(ctx).length) {
          ctx.Toast.show('错题本和资料库都是空的 —— 弱项突击暂无素材，先用 AI 智能', 'warn', 3200); return
        }
        state.srcMode = m
        try { ctx.data('srcMode', m) } catch (e) { }
        render()
      },
      'src-exam': function (t) {
        state.examId = t.dataset.id || ''
        render()
      },
      'src-book': function (t) {
        state.bookId = t.dataset.id || ''
        render()
      },
      revenge: function () { startRevenge() },
      'pick-opt': function (t) { pickOpt(Number(t.dataset.i)) },
      'next-q': function () { nextQ() },
      forfeit: function () {
        let bt = state.bt
        if (!bt || bt.phase === 'loading') return
        if (bt.solo) {
          ctx.api.confirm('退出清算？', '本次已做的题目保留结果，错题本按已答题更新。', function () {
            state.bt = null; state.view = 'lobby'; render()
          })
          return
        }
        ctx.api.confirm('认输？', '本场按战败结算（掉 ELO），编年史记「降」。', function () { endMatch(true) })
      },
      'go-lobby': function () {
        stopTimer()
        let bt = state.bt
        if (bt && bt.judgeTimer) { clearTimeout(bt.judgeTimer); bt.judgeTimer = null }
        state.view = 'lobby'; state.bt = null; render()
      },
      rematch: function () {
        if (!state.last) return
        if (state.last.friendly) startBattle(state.last.opp, { friendly: true })
        else tryPick(state.last.opp.id)
      }
    }

    /* 键盘作答：1-4 / A-D 选项，Enter/空格 推进（只作用于决斗态，卸载即移除） */
    let KEYMAP = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3, A: 0, B: 1, C: 2, D: 3 }
    function onKey(ev) {
      let bt = state.bt
      if (state.view !== 'battle' || !bt) return
      if (ev.target && /^(INPUT|TEXTAREA|SELECT)$/.test(ev.target.tagName)) return
      if (bt.phase === 'fight' && !bt.locked) {
        if (Object.prototype.hasOwnProperty.call(KEYMAP, ev.key)) {
          ev.preventDefault()
          pickOpt(KEYMAP[ev.key])
        }
      } else if (bt.phase === 'judge' || bt.phase === 'over') {
        if (ev.key === 'Enter' || ev.key === ' ') {
          let next = body.querySelector('[data-act="next-q"]')
          if (next && next.style.display !== 'none') { ev.preventDefault(); nextQ() }
        }
      }
    }
    window.addEventListener('keydown', onKey)

    render()
    return function () {
      stopTimer()
      let bt = state.bt
      if (bt && bt.judgeTimer) clearTimeout(bt.judgeTimer)
      window.removeEventListener('keydown', onKey)
      if (unbind) unbind()
      if (offStuck) offStuck()
    }
  }

  /* ════════════════════════ 7. 注册 ════════════════════════ */

  let api = {
    id: 'duel-arena',
    name: '博弈刷题场',
    version: VERSION,
    author: 'kaoyan-v2',
    desc: 'PvE 刷题决斗：AI 一次生成整场选择题，你与天梯 AI 对手同题竞速对答；种子随机判定对手、'
      + 'ELO 天梯与段位称号、每日挑战者、成就徽章、赛后题目回顾与错题复仇、Boss 心魔坐镇高分段；'
      + '出题来源可切换：AI 智能 / 站内题库 / 题卷挑战 / 弱项突击（读站内错题本+资料库讲义）；'
      + '战败题自动同步进站内原生错题本；站内任何工具完成刷题（quizDone）可为本场充能护盾。',
    tools: [
      { id: T_MAIN, title: '博弈刷题场', icon: '⚔️', mount: mountMain }
    ],
    config: [
      { key: 'subject', label: '决斗科目', type: 'select', default: '数学', options: SUBJECTS },
      { key: 'questionsPerMatch', label: '每场题数（3-10）', type: 'number', default: 5 },
      { key: 'secondsPerQ', label: '每题倒计时秒数（10-120）', type: 'number', default: 30 },
      { key: 'writeBackMistakes', label: '战败题同步进站内错题本', type: 'bool', default: true }
    ],
    hooks: {
      /* 站内任何工具完成一组刷题 → 给决斗场充能护盾（下一场 +20 HP） */
      quizDone: function (ctx) {
        try {
          let p = profileGet(ctx)
          if (p.shield) return
          p.shield = true
          profileSave(ctx, p)
          /* 【站内适配 2026-10-22 · 真 bug】ctx.notify 是**单参**接口（对象或纯标题串）。
           * 原写法 `ctx.notify('博弈刷题场', '🛡 护盾已充能…')` 的第二参会被静默丢弃 ——
           * 用户只看到标题「博弈刷题场」，护盾这件事一个字都没说。 */
          if (typeof ctx.notify === 'function') {
            ctx.notify({ title: '🛡 护盾已充能', body: '下一场决斗 +20 HP（站内刷题充能）', level: 'success', timeout: 6000 })
          }
          ctx.log('quizDone → 决斗护盾充能', 'debug')
        } catch (e) { }
      }
      /* 【站内适配 2026-10-22】去掉原来的通配钩子 `'*'`：它给全站每个事件都写一条 debug 日志，
       * 会把插件日志区里真正有价值的记录（ELO 变化、错题回写条数）挤掉。 */
    },
    memory: '用户装有「博弈刷题场」插件：可以把刷题变成 PvE 决斗（工具 → 博弈刷题场）。'
      + 'ELO 天梯、AI 对手竞速、心魔 Boss。用户提到「刷题没动力」「想挑战」「天梯」时，建议他去决斗场打一场。',
    init: function (ctx) {
      /* 声明自己的 AI 场景（出题）：数学选择题要出对、要出得像真题 → think + 公式契约。 */
      try {
        if (ctx.ai && typeof ctx.ai.registerCtx === 'function') {
          ctx.ai.registerCtx({
            ctx: AI_CTX,
            name: '博弈刷题场 · 整场出题',
            desc: '一次生成整场选择题（题干/选项/答案/解析）',
            def: 'think',
            latexNeed: true,
            tools: 'none',
            recall: false
          })
        }
      } catch (e) { /* 注册失败 = 退回未注册路径（吃全局设置） */ }
      ctx.log('博弈刷题场 v' + VERSION + ' 已装载（ELO ' + profileGet(ctx).elo + ' · ' + profileGet(ctx).history.length + ' 场）')
    }
  }

  if (window.__DUEL_DEBUG__) {
    window.__duelInternals = {
      LADDER: LADDER, ELO_K: ELO_K, BOSS_UNLOCK_ELO: BOSS_UNLOCK_ELO, UNLOCK_WINDOW: UNLOCK_WINDOW,
      TITLES: TITLES, BADGES: BADGES, DAILY_BONUS: DAILY_BONUS,
      eloExpected: eloExpected, eloUpdate: eloUpdate, oppAnswersCorrect: oppAnswersCorrect,
      resolveQuestion: resolveQuestion, mulberry32: mulberry32, hashStr: hashStr,
      normalizeQs: normalizeQs, ladderState: ladderState, profileGet: profileGet,
      titleOf: titleOf, dailyOpp: dailyOpp, checkBadges: checkBadges,
      bookUpsert: bookUpsert, bookRemove: bookRemove, mountMain: mountMain,
      /* 站内数据桥（v1.2） */
      nativeBank: nativeBank, nativeExams: nativeExams, nativeMistakes: nativeMistakes, nativeBooks: nativeBooks,
      adaptChoice: adaptChoice, bankPool: bankPool, examChoiceQs: examChoiceQs, bookExcerpt: bookExcerpt,
      writeBackMistakes: writeBackMistakes, subjNativeKey: subjNativeKey, sysGenWeak: sysGenWeak,
      diffToNum: diffToNum, stripOptLetter: stripOptLetter, ansLetterIdx: ansLetterIdx
    }
  }

  PluginBus.register(api)
})()
