;(function () {
  'use strict'

/* ============================================================
 * ear-radio.plugin.js — 磨耳朵电台（单文件插件）· v1.0
 * ------------------------------------------------------------
 * 一句话：把站内素材（政治背诵卡 / 英语单词 / 作文好句 / 自建文本）编成
 *        「提问 → 留白默想 → 答案」的挖空广播，通勤路上戴着耳机刷背诵。
 *
 * 为什么做这件事（而不是又一个闪卡插件）：
 *   记忆宫殿闪卡是「看-答-评」，占眼睛；政治大题和作文好句的痛点恰恰是
 *   整块时间难挤、碎片时间没用。电台模式把复习换成「听」：先播提问，
 *   留 8 秒（可调）在脑子里默答，再播答案对照，听完自评三档 → 走站内
 *   Spaced  Leitner 排期，下次到期自动回到「待复习」节目单。
 *   语音一律走 window.Tts（core/tts.ts 晚绑定桥），绝不另起第二套引擎；
 *   浏览器不支持 TTS 时降级「静音跟读模式」，闭环照走。
 *
 * ── 能力面 ────────────────────────────────────────────────────
 *   · 四视图 dock：备播台（选料建节目单）/ 直播间（挖空广播播放器）/ 待复习（到期队列）/ 档案
 *   · 素材四源：polRecite（政治背诵卡）/ vocab（单词+例句）/ writingAssets（作文好句）/ 自建
 *   · 播放器状态机：提问→倒计时留白→答案→自评；暂停/跳过/重听/收工；语速·留白秒·免手控实时可调
 *   · 自评三档：听出来了→Spaced.known=true；模糊/没听出→false 且标 weak（下档节目优先）
 *   · AI 可选：粘贴长文一键拆「提问—答案」脚本（plugin.ear-radio.script）；无 AI 用本地分段兜底
 *   · 常驻面板 / 教练技能「听背」/ queries 两笔账 / services 外部投料 / Alt+R 直达
 *   · 零闪烁纪律：入场动画只在切视图播；播放期所有更新走定点 DOM，绝不整层重画
 *
 * ── 宿主契约 ──────────────────────────────────────────────────
 *   window.Tts{supported,hasChineseVoice,speak,stop,sequence}（core/tts.ts 转发）
 *   ctx.Spaced.grade(card, known) → {box, due}（排期单源，插件不自算日期）
 *   ctx.data('db') 进云同步；ctx.keep 存播放偏好；ctx.api.download/readFile/confirm
 *   ctx.ai.json 仅脚本生成一处；未配置 = 本地分段兜底
 *   mount: function (el, ctx) → 返回 destroy：停朗读、清定时器、摘样式、解绑
 *
 * ── 数据形状（db 单键 ctx.data('db')；改字段过 normDb）────────
 *   tracks:  [{id,name,itemIds:['pol:xx'],createdAt,plays,lastPlayAt}]
 *   states:  { 'pol:xx': {box,due,reps,ok,no,weak,skip,lastAt} }   // box 0=从没排上(新料)
 *   custom:  [{id,cue,ans,subject,createdAt}]
 *   day:     {'YYYY-MM-DD':{items,secs,plays}}
 *   sessions:[{id,trackName,at,played,secs,ok,no,weak,skip}]（最近 60 条）
 *
 * ── 三条不做 ──────────────────────────────────────────────────
 *   ① 不假装听完了：免手控模式超时只记 skip，绝不自作主张打「听出来了」
 *   ② 不自建排期：到期日全走 ctx.Spaced，与单词本/闪卡同一套 Leitner 口径
 *   ③ 不抢焦点：播放中任何状态变化都不触发整页重绘（变式工厂 1.1 的教训）
 *
 * 安装：插件中心 → 市场「磨耳朵电台」一键安装，或粘贴本文件。
 * ============================================================ */

/* ---- 0. 小工具（纯函数） ---- */
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
  return (p || 'er') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
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
  return s.slice(0, n) + '…'
}
function fmtMins(secs) {
  let m = Math.round((Number(secs) || 0) / 60)
  return m < 60 ? m + ' 分' : Math.floor(m / 60) + ' 时 ' + (m % 60) + ' 分'
}
function icon(ctx, k) {
  try { return String((ctx && ctx.U && ctx.U.icon) ? ctx.U.icon(k) : '') } catch (e) { return '' }
}

/* ---- 1. 领域常量 ---- */
let VERSION = '1.1'
  /* 【2026-10-28】1.1：只播到期、方向键免手操作、音色预设；修复提问/留白相位「跳过此题」无效与旧语音回调串题(代际守卫)。 */
let TOOL_ID = 'ear-radio'
let AI_CTX_SCRIPT = 'plugin.ear-radio.script'
let MAX_TRACKS = 60
let MAX_ITEMS_PER_TRACK = 80
let MAX_CUSTOM = 200

/* 四路素材源：cue=提问播报文本，ans=答案播报文本，lang=提问段期望语种（选音色用） */
let SOURCES = [
  { k: 'pol', name: '政治背诵', ic: 'polrecite', tip: '背卡：先报「考点：主题」，留白默背，再朗读背诵卡全文' },
  { k: 'vocab', name: '英语单词', ic: 'wordbook', tip: '听音记词：报单词和例句，留白想释义，再报中文意思' },
  { k: 'essay', name: '作文好句', ic: 'essay', tip: '英文原句入耳，留白回想汉译，再对照素材批注' },
  { k: 'custom', name: '自建脚本', ic: 'cpPencil', tip: '自己粘的「提问—答案」对，或让 AI 把长文拆成脚本' }
]
function srcOf(k) {
  for (let i = 0; i < SOURCES.length; i++) if (SOURCES[i].k === k) return SOURCES[i]
  return null
}
let VIEWS = [
  { k: 'studio', t: '备播台', ic: 'list' },
  { k: 'live', t: '直播间', ic: 'volume' },
  { k: 'queue', t: '待复习', ic: 'refresh' },
  { k: 'stats', t: '档 案', ic: 'barChart' }
]
/* 品牌砖：信号塔 + 两道电波（纯几何，主题色 currentColor） */
let MARK_TILE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="2.2"/><path d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6" opacity=".85"/><path d="M5.5 5.5a9.2 9.2 0 0 0 0 13M18.5 5.5a9.2 9.2 0 0 1 0 13" opacity=".45"/></svg>'
let MARK_LG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="2.4"/><path d="M7.9 7.9a5.8 5.8 0 0 0 0 8.2M16.1 7.9a5.8 5.8 0 0 1 0 8.2"/><path d="M5.1 5.1a9.8 9.8 0 0 0 0 13.8M18.9 5.1a9.8 9.8 0 0 1 0 13.8" opacity=".5"/><path d="M2.6 2.6a13 13 0 0 0 0 18.8M21.4 2.6a13 13 0 0 1 0 18.8" opacity=".22"/></svg>'

/* ---- 2. 数据层（纯判据，可单测） ---- */
function emptyDb() {
  return { v: 1, tracks: [], states: {}, custom: [], day: {}, sessions: [] }
}
function strArr(v) {
  return Array.isArray(v) ? v.map(function (x) { return String(x == null ? '' : x) }).filter(function (x) { return x !== '' }) : []
}
function normState(x) {
  x = (x && typeof x === 'object') ? x : {}
  return {
    box: clamp(x.box, 0, 9),
    due: /^\d{4}-\d{2}-\d{2}$/.test(String(x.due || '')) ? String(x.due) : '',
    reps: clamp(x.reps, 0, 9999), ok: clamp(x.ok, 0, 9999), no: clamp(x.no, 0, 9999),
    weak: clamp(x.weak, 0, 9999), skip: clamp(x.skip, 0, 9999),
    lastAt: String(x.lastAt || '').slice(0, 30)
  }
}
function normTrack(x) {
  x = (x && typeof x === 'object') ? x : {}
  let ids = []
  strArr(x.itemIds).forEach(function (k) { if (ids.indexOf(k) < 0) ids.push(k) })
  return {
    id: String(x.id || uid('t')),
    name: String(x.name || '').slice(0, 40) || '未命名节目',
    itemIds: ids.slice(0, MAX_ITEMS_PER_TRACK),
    createdAt: String(x.createdAt || nowIso()),
    plays: clamp(x.plays, 0, 99999),
    lastPlayAt: String(x.lastPlayAt || '')
  }
}
function normCustom(x) {
  x = (x && typeof x === 'object') ? x : {}
  let cue = String(x.cue || '').trim()
  let ans = String(x.ans || '').trim()
  return { id: String(x.id || uid('c')), cue: cue.slice(0, 2000), ans: ans.slice(0, 4000), subject: String(x.subject || '自建').slice(0, 20), createdAt: String(x.createdAt || nowIso()) }
}
function normSession(x) {
  x = (x && typeof x === 'object') ? x : {}
  return {
    id: String(x.id || uid('s')), trackName: String(x.trackName || '').slice(0, 40),
    at: String(x.at || nowIso()), played: clamp(x.played, 0, 999), secs: clamp(x.secs, 0, 99999),
    ok: clamp(x.ok, 0, 999), no: clamp(x.no, 0, 999), weak: clamp(x.weak, 0, 999), skip: clamp(x.skip, 0, 999)
  }
}
function normDb(raw) {
  raw = (raw && typeof raw === 'object') ? raw : {}
  let states = {}
  let rs = (raw.states && typeof raw.states === 'object') ? raw.states : {}
  Object.keys(rs).slice(0, 4000).forEach(function (k) {
    let s = normState(rs[k])
    if (s.box || s.due || s.reps) states[String(k).slice(0, 64)] = s
  })
  let day = {}
  let rd = (raw.day && typeof raw.day === 'object') ? raw.day : {}
  Object.keys(rd).slice(0, 400).forEach(function (k) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) return
    let v = rd[k] || {}
    day[k] = { items: clamp(v.items, 0, 99999), secs: clamp(v.secs, 0, 999999), plays: clamp(v.plays, 0, 999) }
  })
  return {
    v: 1,
    tracks: (Array.isArray(raw.tracks) ? raw.tracks : []).slice(0, MAX_TRACKS).map(normTrack)
      .filter(function (t) { return t.itemIds.length }),
    states: states,
    custom: (Array.isArray(raw.custom) ? raw.custom : []).slice(0, MAX_CUSTOM).map(normCustom)
      .filter(function (c) { return c.cue }),
    day: day,
    sessions: (Array.isArray(raw.sessions) ? raw.sessions : []).slice(0, 60).map(normSession)
  }
}
function loadDb(ctx) {
  let d = null
  try { d = ctx.data('db') } catch (e) { d = null }
  return normDb(d)
}
function saveDb(ctx, db) {
  try { ctx.data('db', db) } catch (e) { /* 宿主已报 */ }
}
function bumpDay(db, field, n) {
  let k = todayKey()
  if (!db.day[k]) db.day[k] = { items: 0, secs: 0, plays: 0 }
  db.day[k][field] = clamp((db.day[k][field] || 0) + (n == null ? 1 : n), 0, 999999)
}
function itemKey(src, id) { return src + ':' + String(id || '') }
function getState(db, key) {
  return db.states[key] ? db.states[key] : (db.states[key] = normState({}))
}
/* 到期：排上过且 due<=今天（新料 box=0 不算到期，走「含新料」勾选） */
function dueKeys(db) {
  let t = todayKey()
  return Object.keys(db.states).filter(function (k) {
    let s = db.states[k]
    return s.box > 0 && s.due && s.due <= t
  })
}
function last14(db) {
  let out = []
  for (let i = 13; i >= 0; i--) {
    let k = addDays(todayKey(), -i)
    let d = db.day[k] || { items: 0, secs: 0, plays: 0 }
    out.push({ k: k, items: d.items, secs: d.secs })
  }
  return out
}
function dbTotals(db, ctx) {
  let today = db.day[todayKey()] || { items: 0, secs: 0, plays: 0 }
  let due = dueKeys(db).length
  let weak = Object.keys(db.states).filter(function (k) { return (db.states[k].weak || 0) > 0 }).length
  let newCount = 0
  allFeedKeys(db, ctx).forEach(function (k) {
    let s = db.states[k]
    if (!s || (!s.box && !s.reps)) newCount++
  })
  return {
    tracks: db.tracks.length, feeds: allFeedKeys(db, ctx).length,
    todayItems: today.items, todaySecs: today.secs, due: due, weak: weak, newCount: newCount
  }
}
/* 弱项榜：weak 次数 Top（自评「模糊/没听出」的累计） */
function weakTop(db, keysOf) {
  let rows = Object.keys(db.states).map(function (k) {
    let s = db.states[k]
    return { key: k, weak: s.weak || 0, no: s.no || 0, reps: s.reps || 0, text: keysOf ? keysOf(k) : k }
  }).filter(function (r) { return r.weak > 0 || r.no > 0 })
  rows.sort(function (a, b) { return (b.weak * 2 + b.no) - (a.weak * 2 + a.no) })
  return rows.slice(0, 8)
}
/* 全部可播素材 key（四源汇总；ctx 必传 —— 素材本体在 Store，读取靠它） */
function allFeedKeys(db, ctx) {
  let out = []
  feedItems(db, 'pol', ctx).forEach(function (it) { out.push(it.key) })
  feedItems(db, 'vocab', ctx).forEach(function (it) { out.push(it.key) })
  feedItems(db, 'essay', ctx).forEach(function (it) { out.push(it.key) })
  feedItems(db, 'custom', ctx).forEach(function (it) { out.push(it.key) })
  return out
}

/* e1: 素材源读取 + 播报文本构造 + 自建脚本（AI 拆分 / 本地兜底） */

function storeOf(ctx) {
  try { return ctx.Store.get() || {} } catch (e) { return {} }
}

/* 四源 → 统一播单项 {key,src,id,title,cue,ans,lang,subject}
 * cue=提问播报文本，ans=答案播报文本；lang 供选音色（en 优先英文音色）。 */
function feedItems(db, src, ctx) {
  let s = storeOf(ctx)
  let out = []
  if (src === 'pol') {
    (Array.isArray(s.polRecite) ? s.polRecite : []).forEach(function (r) {
      let topic = String(r.topic || '').trim()
      let points = Array.isArray(r.points) ? r.points.filter(Boolean) : []
      let card = String(r.card || '').trim()
      if (!topic || (!card && !points.length)) return
      let cue = '考点：' + topic + '。请先在脑子里过一遍完整答案。'
      let ans = card || ('要点：' + points.join('；'))
      out.push({ key: itemKey('pol', r.id), src: 'pol', id: String(r.id || ''), title: topic, cue: cue, ans: ans, lang: 'zh', subject: '政治' })
    })
  } else if (src === 'vocab') {
    (Array.isArray(s.vocab) ? s.vocab : []).forEach(function (w) {
      let word = String(w.word || '').trim()
      if (!word) return
      let cue = word + (w.example ? '. ' + String(w.example) : '')
      let ans = String(w.meaning || '') + (w.exampleCn ? '。' + String(w.exampleCn) : '')
      if (!ans.trim()) ans = '（释义缺失，回单词本补一下）'
      out.push({ key: itemKey('vocab', w.id), src: 'vocab', id: String(w.id || ''), title: word, cue: cue, ans: ans, lang: 'en', subject: '英语' })
    })
  } else if (src === 'essay') {
    (Array.isArray(s.writingAssets) ? s.writingAssets : []).forEach(function (a) {
      let text = String(a.text || '').trim()
      if (!text) return
      let note = String(a.note || '').trim()
      out.push({
        key: itemKey('essay', a.id), src: 'essay', id: String(a.id || ''), title: shortText(text, 30),
        cue: text + '。请回想这句的中文意思。', ans: note || text, lang: 'en', subject: '英语'
      })
    })
  } else if (src === 'custom') {
    (db.custom || []).forEach(function (c) {
      out.push({
        key: itemKey('custom', c.id), src: 'custom', id: c.id, title: shortText(c.cue, 30),
        cue: c.cue, ans: c.ans || '（这条没有答案段，去备播台补）', lang: 'zh', subject: c.subject || '自建'
      })
    })
  }
  return out
}
function feedByKey(db, key, ctx) {
  let src = String(key).split(':')[0]
  let list = feedItems(db, src, ctx)
  for (let i = 0; i < list.length; i++) if (list[i].key === key) return list[i]
  return null
}
/* 节目单 → 可播队列（素材被站内删掉的静默跳过，计数如实） */
function trackQueue(db, track, ctx) {
  let q = []
  let missing = 0
  ;(track.itemIds || []).forEach(function (k) {
    let it = feedByKey(db, k, ctx)
    if (it) q.push(it)
    else missing++
  })
  return { queue: q, missing: missing }
}
/* 队列排序：弱项(weak/no 多)在前 → 到期早的在前 → 新料最后 */
function sortQueue(db, keys) {
  return keys.slice().sort(function (a, b) {
    let sa = db.states[a] || {}
    let sb = db.states[b] || {}
    let wa = (sa.weak || 0) * 2 + (sa.no || 0)
    let wb = (sb.weak || 0) * 2 + (sb.no || 0)
    if (wa !== wb) return wb - wa
    let na = sa.box > 0 ? 0 : 1
    let nb = sb.box > 0 ? 0 : 1
    if (na !== nb) return na - nb
    return String(sa.due || '9999') < String(sb.due || '9999') ? -1 : 1
  })
}

/* ---- 自建脚本：本地分段兜底（无 AI 也能建料） ----
 * 认三种写法：① 每行「问：xxx / 答：xxx」②「Q: / A:」③ 空行分段，奇段问偶段答。 */
function splitScript(text) {
  let pairs = []
  let lines = String(text || '').split(/\r?\n/).map(function (l) { return l.trim() }).filter(Boolean)
  let i = 0
  while (i < lines.length) {
    let m = /^(问|Q|question|题目)\s*[::：]\s*(.*)$/i.exec(lines[i])
    let m2 = /^(答|A|answer|答案)\s*[::：]\s*(.*)$/i.exec(lines[i + 1] || '')
    if (m && m2) {
      pairs.push({ cue: m[2] || '', ans: m2[2] || '' })
      i += 2
      continue
    }
    if (m && m[2]) {
      /* 问行后面直接跟答行（无「答:」前缀）：吃到下一个问行/结尾 */
      let ans = []
      let j = i + 1
      while (j < lines.length && !/^(问|Q|question|题目)\s*[::：]/i.test(lines[j])) { ans.push(lines[j]); j++ }
      pairs.push({ cue: m[2], ans: ans.join(' ') })
      i = j
      continue
    }
    i++
  }
  if (pairs.length) return pairs
  /* 空行分段兜底：奇偶配对 */
  let blocks = String(text || '').split(/\n\s*\n/).map(function (b) { return b.trim() }).filter(Boolean)
  for (let k = 0; k + 1 < blocks.length; k += 2) pairs.push({ cue: blocks[k], ans: blocks[k + 1] })
  return pairs
}

/* ---- AI 脚本生成（可选；无 AI 走 splitScript） ---- */
function scriptSystem() {
  return [
    '你是「磨耳朵电台」的脚本编辑：把用户给的背诵材料拆成适合收听的「提问—答案」播报对。',
    '要求：提问要能独立听懂、先报考点再引导回想；答案是完整可朗读的正文；',
    '长段落按知识自然段落切分，每对答案不超过 200 字；不要引入材料之外的内容。',
    '只输出 JSON：{"pairs":[{"cue":"…","ans":"…"}]}'
  ].join('\n')
}
function buildScriptAsk(text) {
  return '【拆播报脚本】材料如下，请拆成 3~12 对「提问—答案」：\n\n' + shortText(String(text || ''), 6000)
}
function parseScriptPairs(raw) {
  let arr = null
  if (raw && Array.isArray(raw.pairs)) arr = raw.pairs
  else if (Array.isArray(raw)) arr = raw
  if (!Array.isArray(arr)) return []
  let out = []
  arr.forEach(function (p) {
    if (!p || typeof p !== 'object') return
    let cue = String(p.cue || '').trim()
    let ans = String(p.ans || '').trim()
    if (cue) out.push({ cue: cue.slice(0, 2000), ans: ans.slice(0, 4000) })
  })
  return out.slice(0, 40)
}

/* ---- 选音色：en 素材优先英文音色，zh 优先中文；拿不到就用系统默认 ---- */
function pickVoice(lang) {
  try {
    let vs = window.speechSynthesis ? window.speechSynthesis.getVoices() : null
    if (!vs || !vs.length) return null
    let want = lang === 'en' ? /^en/i : /^zh/i
    let hit = null
    for (let i = 0; i < vs.length; i++) {
      if (want.test(String(vs[i].lang || ''))) { hit = vs[i]; break }
    }
    return hit || null
  } catch (e) { return null }
}

/* e2: 播放器状态机（直播间的心跳）
 * 相位：idle → cue(提问) → gap(留白默答) → ans(答案) → judge(自评) → 下一条 / done
 * 三条铁律：① 时长不靠估——语音用 onEnd 链推进，静音模式才用字数估时；
 * ② 所有相位变化走 hooks.onPhase 定点更新 DOM，绝不整层重画（零闪烁）；
 * ③ 离开/收工必须 Tts.stop + 清定时器，不许"人已走还在读"。 */
function makeEngine(ctx, hooks) {
  let E = {
    queue: [], idx: -1, phase: 'idle', trackName: '',
    gapTimer: null, judgeTimer: null, itemStart: 0, sessStart: 0,
    played: 0, ok: 0, no: 0, weak: 0, skip: 0, secs: 0,
    _gen: 0,
    opts: { rate: 1, gapSec: 8, handsfree: false, judgeWait: 6, silent: false },
    dead: false
  }
  function T1(fn, ms) { return hooks.T(fn, ms) }
  function vpActive() {
    let cfg = voiceCfg(ctx)
    return !!(cfg && cfg.mode && cfg.mode !== 'system')
  }
  function speakSys(text, lang, finish) {
    try {
      let v = pickVoice(lang)
      let ok = window.Tts.speak(String(text || ''), {
        rate: E.opts.rate,
        voiceURI: v ? v.voiceURI : undefined,
        onEnd: finish,
        onError: function () { finish() }
      })
      if (!ok) T1(finish, 800)
    } catch (e) { T1(finish, 800) }
  }
  function speakSeg(text, lang, onEnd) {
    if (E.dead) return
    if (E.opts.silent || (!ttsOk() && !vpActive())) {
      /* 静音跟读：按字数估显示时长（约每秒 5 字，2~25 秒夹住），如实标注模式 */
      let ms = clamp(String(text || '').length / 5, 2, 25) * 1000
      T1(onEnd, ms)
      return
    }
    let done = false
    let finish = function () { if (!done) { done = true; onEnd() } }
    let cfg = voiceCfg(ctx)
    if (cfg && cfg.mode && cfg.mode !== 'system' && !E.opts.silent) {
      /* AI 音色通道：en 素材可配双音色；失败自动降级系统音色（每档节目只提醒一次） */
      let vof = (lang === 'en' && cfg.voiceEn) ? cfg.voiceEn : cfg.voice
      vpSpeak(text, cfg, vof, finish, function (reason) {
        if (!E._vpWarned) {
          E._vpWarned = true
          try { ctx.Toast.show('AI 音色失败（' + reason + '），本档已切回系统音色', 'warn', 4000) } catch (e) { }
        }
        speakSys(text, lang, finish)
      })
      return
    }
    speakSys(text, lang, finish)
  }
  function ttsOk() {
    try { return !!(window.Tts && window.Tts.supported && window.Tts.supported()) } catch (e) { return false }
  }
  function cur() { return E.queue[E.idx] || null }
  function setPhase(p) {
    E.phase = p
    try { hooks.onPhase(p, cur(), E) } catch (e) { /* UI 挂了不拖死播放 */ }
  }
  function runCue() {
    let it = cur()
    if (!it) return finishAll()
    E.itemStart = Date.now()
    let g = ++E._gen
    setPhase('cue')
    speakSeg(it.cue, it.lang, function () {
      /* 代际守卫：暂停/跳题后旧语音回调迟到也不许污染下一题 */
      if (E._gen !== g || E.phase !== 'cue') return
      runGap()
    })
  }
  function runGap() {
    setPhase('gap')
    let total = Math.max(2, E.opts.gapSec)
    let left = total
    try { hooks.onGap(left, total) } catch (e) { }
    E.gapTimer = T1(function tick() {
      left--
      try { hooks.onGap(left, total) } catch (e) { }
      if (left > 0) { E.gapTimer = T1(tick, 1000); return }
      runAns()
    }, 1000)
  }
  function skipGap() {
    if (E.phase !== 'gap') return
    if (E.gapTimer) { clearTimeout(E.gapTimer); E.gapTimer = null }
    runAns()
  }
  function runAns() {
    let it = cur()
    let g = ++E._gen
    setPhase('ans')
    speakSeg(it.ans, it.lang === 'en' ? 'zh' : it.lang, function () {
      if (E._gen !== g || E.phase !== 'ans') return
      runJudge()
    })
  }
  function runJudge() {
    setPhase('judge')
    if (E.opts.handsfree) {
      E.judgeTimer = T1(function () { judge('skip') }, Math.max(2, E.opts.judgeWait) * 1000)
    }
  }
  /* 自评三档：ok=听出来了；weak=模糊（算错+标弱）；no=没听出（算错）；skip=免手控超时/跳过（不评分） */
  function judge(verdict) {
    if (E.phase !== 'judge') return
    if (E.judgeTimer) { clearTimeout(E.judgeTimer); E.judgeTimer = null }
    let it = cur()
    if (!it) return finishAll()
    let st = getState(hooks.db(), it.key)
    let known = verdict === 'ok'
    if (verdict !== 'skip') {
      let g = null
      try {
        g = ctx.Spaced.grade({ box: st.box || 1, due: st.due || undefined, reps: st.reps, lapses: st.no }, known)
      } catch (e) { g = null }
      if (g) { st.box = clamp(g.box, 1, 9); st.due = /^\d{4}-\d{2}-\d{2}$/.test(g.due) ? g.due : addDays(todayKey(), known ? 2 : 1) }
      st.reps = clamp(st.reps + 1, 0, 9999)
      if (known) st.ok = clamp(st.ok + 1, 0, 9999)
      else {
        st.no = clamp(st.no + 1, 0, 9999)
        if (verdict === 'weak') st.weak = clamp(st.weak + 1, 0, 9999)
      }
      st.lastAt = nowIso()
    } else {
      st.skip = clamp(st.skip + 1, 0, 9999)
      st.lastAt = nowIso()
    }
    E.played++
    if (verdict === 'ok') E.ok++
    else if (verdict === 'weak') { E.no++; E.weak++ }
    else if (verdict === 'no') E.no++
    else E.skip++
    let el = Math.round((Date.now() - E.itemStart) / 1000)
    E.secs += clamp(el, 0, 600)
    try { hooks.onJudge(verdict, it, E, clamp(el, 0, 600)) } catch (e) { }
    next()
  }
  function next() {
    E.idx++
    if (E.idx >= E.queue.length) return finishAll()
    runCue()
  }
  function skip() {
    if (E.phase === 'idle' || E.phase === 'done') return
    if (E.phase === 'judge') { judge('skip'); return }
    /* 非 judge 相位（提问/留白/答案）也要能跳：记跳过、停声、进下一题 */
    E._gen++
    if (E.gapTimer) { clearTimeout(E.gapTimer); E.gapTimer = null }
    if (E.judgeTimer) { clearTimeout(E.judgeTimer); E.judgeTimer = null }
    try { window.Tts && window.Tts.stop && window.Tts.stop() } catch (e) { }
    vpStop()
    E.played++
    E.skip++
    E.secs += clamp(Math.round((Date.now() - E.itemStart) / 1000), 0, 600)
    try { hooks.onJudge('skip', cur(), E, 0) } catch (e) { }
    next()
  }
  function pause() {
    if (E.phase === 'idle' || E.phase === 'done' || E.phase === 'paused') return
    E._before = E.phase
    E._gen++
    if (E.gapTimer) { clearTimeout(E.gapTimer); E.gapTimer = null }
    if (E.judgeTimer) { clearTimeout(E.judgeTimer); E.judgeTimer = null }
    try { window.Tts && window.Tts.stop && window.Tts.stop() } catch (e) { }
    vpStop()
    setPhase('paused')
  }
  function resume() {
    if (E.phase !== 'paused') return
    let p = E._before || 'cue'
    if (p === 'gap') runGap()
    else if (p === 'judge') runJudge()
    else runCue() /* 重播当前段，比"从半句接上"更可靠 */
  }
  function replay() {
    if (E.phase === 'idle' || E.phase === 'done') return
    if (E.gapTimer) { clearTimeout(E.gapTimer); E.gapTimer = null }
    if (E.judgeTimer) { clearTimeout(E.judgeTimer); E.judgeTimer = null }
    try { window.Tts && window.Tts.stop && window.Tts.stop() } catch (e) { }
    vpStop()
    runCue()
  }
  function finishAll() {
    if (E.phase === 'done' || E.phase === 'idle') return
    if (E.gapTimer) { clearTimeout(E.gapTimer); E.gapTimer = null }
    if (E.judgeTimer) { clearTimeout(E.judgeTimer); E.judgeTimer = null }
    try { window.Tts && window.Tts.stop && window.Tts.stop() } catch (e) { }
    vpStop()
    setPhase('done')
    hooks.onFinish(E)
  }
  function start(queue, trackName, opts) {
    if (!queue || !queue.length) return false
    Object.assign(E.opts, opts || {})
    E.queue = queue
    E.trackName = String(trackName || '')
    E.idx = 0
    E._vpWarned = false
    E.played = 0; E.ok = 0; E.no = 0; E.weak = 0; E.skip = 0; E.secs = 0
    E.sessStart = Date.now()
    runCue()
    return true
  }
  function kill() { E.dead = true; vpStop() }
  return {
    start: start, pause: pause, resume: resume, skip: skip, replay: replay,
    judge: judge, skipGap: skipGap, stop: finishAll, kill: kill,
    state: function () { return E }
  }
}

/* e3: 备播台（选料 → 勾选 → 建节目单 → 开播） */
function renderStudio(env) {
  let ctx = env.ctx, S = env.S, db = env.db
  let src = S.studio.src
  let tabs = '<div class="er-seg">' + SOURCES.map(function (s) {
    return '<button class="er-segbtn' + (src === s.k ? ' on' : '') + '" data-act="st-src" data-v="' + s.k + '">' + esc(s.name) + '</button>'
  }).join('') + '</div>'
  let sd = srcOf(src)
  let head = tabs + '<p class="er-tip">' + esc(sd ? sd.tip : '') + '</p>'
  let items = feedItems(db, src, ctx)
  let body = ''

  if (src === 'custom') {
    /* 自建源也要有操作条（真机实测抓的漏：没有 .er-filter 勾选后建单/即席按钮无处出现） */
    head += '<div class="er-filter">'
      + '<span class="er-count">' + items.length + ' 条自建</span>'
      + '<button class="er-btn ghost" data-act="st-pickall">' + (S.studio.pick.size ? '全取消' : '全选') + '</button>'
      + (S.studio.pick.size ? '<button class="er-btn primary" data-act="st-build"><i>' + icon(ctx, 'volume') + '</i>建节目单（' + S.studio.pick.size + '）</button>' : '')
      + (S.studio.pick.size ? '<button class="er-btn ghost" data-act="st-playpick" title="不建单直接开一档即席节目">先听这批</button>' : '')
      + '</div>'
    /* 自建库：手填一对 + AI/本地长文拆脚本 */
    body = '<div class="er-mform">'
      + '<div class="er-fldrow"><label class="er-fld"><span>提问（先播这个）</span><textarea class="er-input er-ta" rows="2" data-f="cue" placeholder="例：默背：新民主主义革命的三大法宝"></textarea></label>'
      + '<label class="er-fld"><span>答案（留白后播）</span><textarea class="er-input er-ta" rows="2" data-f="ans" placeholder="完整可朗读的答案"></textarea></label></div>'
      + '<div class="er-fldrow"><label class="er-fld"><span>科目标签</span><input class="er-input" data-f="subject" placeholder="政治 / 专业课…"></label>'
      + '<button class="er-btn primary" data-act="st-cadd" style="align-self:flex-end"><i>' + icon(ctx, 'cpPlus') + '</i>存入自建库</button></div>'
      + '</div>'
      + '<details class="er-import"><summary>粘长文 → 拆成播报脚本（AI 可拆 / 无 AI 本地分段）</summary>'
      + '<textarea class="er-input er-ta" rows="5" data-f="aiText" placeholder="粘贴一段背诵材料。&#10;支持「问：… / 答：…」逐行，或空行分段的问答交替。"></textarea>'
      + '<div class="er-acts"><button class="er-btn" data-act="st-ai"><i>' + icon(ctx, 'cpSpark') + '</i>拆成脚本</button>'
      + '<span class="er-hint">' + (aiOk(ctx) ? 'AI 拆分后逐对入自建库' : '未配置 AI：用本地分段规则（问:/答: 或空行交替）') + '</span></div>'
      + '</details>'
    let list = items.length ? items.map(function (it) {
      return itemRow(env, it, S.studio.pick.has(it.key))
    }).join('') : emptyBox('自建库还空着', '上面存一对问答，或粘一段材料让 AI 拆脚本。')
    body += '<div class="er-cands">' + list + '</div>'
  } else {
    let q = String(S.studio.q || '').trim().toLowerCase()
    let fq = q
    let shown = items.filter(function (it) {
      if (!fq) return true
      return String(it.title).toLowerCase().indexOf(fq) >= 0 || String(it.cue).toLowerCase().indexOf(fq) >= 0
    })
    head += '<div class="er-filter">'
      + '<input class="er-input er-search" data-act="st-q" placeholder="搜标题/内容…" value="' + esc(S.studio.q) + '">'
      + '<span class="er-count">' + shown.length + ' 条可选</span>'
      + '<button class="er-btn ghost" data-act="st-pickall">' + (S.studio.pick.size ? '全取消' : '本页全选') + '</button>'
      + (S.studio.pick.size ? '<button class="er-btn primary" data-act="st-build"><i>' + icon(ctx, 'volume') + '</i>建节目单（' + S.studio.pick.size + '）</button>' : '')
      + (S.studio.pick.size ? '<button class="er-btn ghost" data-act="st-playpick" title="不建单直接开一档即席节目">先听这批</button>' : '')
      + '</div>'
    body = shown.length ? '<div class="er-cands">' + shown.slice(0, 200).map(function (it) {
      return itemRow(env, it, S.studio.pick.has(it.key))
    }).join('') + '</div>' : emptyBox(items.length ? '这个搜索没结果' : '这一源还没有素材',
      src === 'pol' ? '去「政治强化」背起来，卡片会自动出现在这里' : (src === 'vocab' ? '去「单词本」攒词' : (src === 'essay' ? '去「英语强化」批改作文攒好句' : '存一对问答就能开播')))
    if (shown.length > 200) body += '<p class="er-more">仅列出前 200 条，用搜索缩小范围。</p>'
  }

  /* 节目单区 */
  let tracks = ''
  if (db.tracks.length) {
    tracks = '<div class="er-card"><div class="er-card-h"><b>节目单</b><em>PLAYLISTS · ' + db.tracks.length + '</em></div>'
      + db.tracks.map(function (t) {
        let r = trackQueue(db, t, ctx)
        let dueN = 0
        r.queue.forEach(function (it) {
          let st = db.states[it.key]
          if (st && st.box > 0 && st.due && st.due <= todayKey()) dueN++
        })
        return '<div class="er-trow"><div class="er-tmain"><b>' + esc(t.name) + '</b>'
          + '<span>' + r.queue.length + ' 项' + (r.missing ? '（' + r.missing + ' 项素材已不在）' : '')
          + (dueN ? ' · <i class="er-due">到期 ' + dueN + '</i>' : '') + ' · 已播 ' + (t.plays || 0) + ' 次</span></div>'
          + '<button class="er-btn sm primary" data-act="st-play" data-id="' + esc(t.id) + '"><i>' + icon(ctx, 'cpPlay') + '</i>开播</button>'
          + (dueN ? '<button class="er-btn sm ghost" data-act="st-playdue" data-id="' + esc(t.id) + '" title="只播这档里到期的部分，通勤短就听这些">只播到期（' + dueN + '）</button>' : '')
          + '<button class="er-btn sm ghost" data-act="st-shuffle" data-id="' + esc(t.id) + '" title="乱序开播，防背顺子">乱序</button>'
          + '<button class="er-btn sm ghost" data-act="st-edit" data-id="' + esc(t.id) + '" title="往这档节目单追加当前勾选的素材">加料</button>'
          + '<button class="er-btn sm ghost danger" data-act="st-del" data-id="' + esc(t.id) + '">删</button>'
          + '</div>'
      }).join('') + '</div>'
  }
  env.stage.innerHTML = '<div class="er-card">' + head + body + '</div>' + tracks
}

/* 单条素材行：勾选 + 标题 + 状态徽章 + 点开预览 */
function itemRow(env, it, on) {
  let ctx = env.ctx, S = env.S
  let st = env.db.states[it.key]
  let badges = ''
  if (st && st.box > 0 && st.due && st.due <= todayKey()) badges += '<span class="er-chip due">到期</span>'
  else if (!st || (!st.box && !st.reps)) badges += '<span class="er-chip new">新</span>'
  if (st && st.weak > 0) badges += '<span class="er-chip weak">弱×' + st.weak + '</span>'
  let isExp = S.studio.exp === it.key
  return '<div class="er-cand' + (on ? ' on' : '') + (isExp ? ' exp' : '') + '">'
    + '<button class="er-pickbtn" data-act="st-pick" data-key="' + esc(it.key) + '" title="选进节目单">' + (on ? '✓' : '') + '</button>'
    + '<div class="er-cmain" data-act="st-item" data-key="' + esc(it.key) + '">'
    + '<b>' + esc(it.title) + '</b>'
    + '<div class="er-cmeta"><span class="er-chip subj">' + esc(it.subject) + '</span>' + badges
    + '<span class="er-chev">' + (isExp ? '▾' : '▸') + ' 试听脚本</span></div>'
    + (isExp ? '<div class="er-cfull"><p><em>提问</em>' + esc(it.cue) + '</p><p><em>答案</em>' + esc(shortText(it.ans, 300)) + '</p>'
      + (it.src === 'custom' ? '<div class="er-acts"><button class="er-btn sm ghost danger" data-act="st-cdel" data-id="' + esc(it.id) + '">删这条自建</button></div>' : '')
      + '</div>' : '')
    + '</div></div>'
}

/* e4: 直播间（播放器界面；播放期一切更新走 updateLive 定点替换，不整页重画） */
function liveStageHtml(env, E) {
  let ctx = env.ctx
  let it = E.queue[E.idx]
  let head = ''
  if (it) {
    head = '<div class="er-lvitem"><span class="er-chip src-' + it.src + '">' + esc(srcLabel(it.src)) + '</span>'
      + '<b>' + esc(it.title) + '</b></div>'
  }
  if (E.phase === 'cue') {
    return head + '<div class="er-cardcue"><span class="er-plabel">提 问</span>'
      + '<div class="er-ptext">' + esc(it ? it.cue : '') + '</div>'
      + '<p class="er-hint">跟着耳机默读，答案马上到…</p></div>'
  }
  if (E.phase === 'gap') {
    return head + '<div class="er-gap"><svg viewBox="0 0 120 120" class="er-ring"><circle class="rbg" cx="60" cy="60" r="52"/><circle class="rfg" data-lv="ring" cx="60" cy="60" r="52"/></svg>'
      + '<b data-lv="count">' + (E._gapLeft || E.opts.gapSec) + '</b></div>'
      + '<p class="er-hint">留白默答中 —— 想好了它会自动播答案</p>'
      + '<div class="er-acts"><button class="er-btn ghost" data-act="lv-skipgap">不等了，直接听答案 →</button></div>'
  }
  if (E.phase === 'ans') {
    return head + '<div class="er-cardans"><span class="er-plabel">答 案</span>'
      + '<div class="er-ptext">' + esc(it ? it.ans : '') + '</div></div>'
  }
  if (E.phase === 'judge') {
    return head + '<div class="er-cardans"><span class="er-plabel">答 案</span>'
      + '<div class="er-ptext">' + esc(it ? it.ans : '') + '</div></div>'
      + '<div class="er-judge" data-lv="judge">'
      + '<button class="er-btn primary" data-act="lv-judge" data-v="ok"><i>' + icon(ctx, 'cpCheck') + '</i>听出来了</button>'
      + '<button class="er-btn" data-act="lv-judge" data-v="weak">有点模糊</button>'
      + '<button class="er-btn ghost danger" data-act="lv-judge" data-v="no">没听出来</button>'
      + (E.opts.handsfree ? '<span class="er-hint">免手控：几秒后自动记为「跳过」，不代你打分</span>' : '')
      + '</div>'
  }
  if (E.phase === 'paused') {
    return head + '<div class="er-paused"><b>已暂停</b><p class="er-hint">继续会重播当前段（半句接不上是浏览器语音的锅，重播更稳）</p></div>'
  }
  if (E.phase === 'done') {
    return '<div class="er-done"><b>本档节目播完</b>'
      + '<div class="er-donesum">'
      + '<span><i>' + E.played + '</i>项</span><span class="ok"><i>' + E.ok + '</i>听出</span>'
      + '<span class="no"><i>' + E.no + '</i>没听出</span><span><i>' + E.skip + '</i>跳过</span>'
      + '<span><i>' + fmtMins(E.secs) + '</i></span></div>'
      + '<div class="er-acts"><button class="er-btn primary" data-act="lv-again">再来一轮</button>'
      + '<button class="er-btn ghost" data-act="go-studio">回备播台</button></div></div>'
  }
  return ''
}
function srcLabel(k) {
  let s = srcOf(k)
  return s ? s.name : k
}
function renderLive(env) {
  let ctx = env.ctx, db = env.db, E = env.engine.state()
  if (E.phase === 'idle' && !E.queue.length) {
    let quick = db.tracks.slice(0, 3).map(function (t) {
      return '<button class="er-btn" data-act="st-play" data-id="' + esc(t.id) + '"><i>' + icon(ctx, 'cpPlay') + '</i>' + esc(t.name) + '</button>'
    }).join('')
    env.stage.innerHTML = '<div class="er-card">' + emptyBox('直播间静开着',
      db.tracks.length ? '点一档节目单开播，或去备播台勾素材新建。' : '先去备播台勾几项素材建一档节目单 —— 政治卡、单词、好句都能变成耳朵里的复习。',
      quick || '<button class="er-btn primary" data-act="go-studio">去备播台</button>') + '</div>'
    return
  }
  let total = E.queue.length
  let modeChip = E.opts.silent ? '<span class="er-chip mute">静音跟读</span>' : ''
  env.stage.innerHTML = '<div class="er-card er-player">'
    + '<div class="er-phead"><b>' + esc(E.trackName || '即席节目') + '</b>' + modeChip
    + '<span class="er-prog" data-lv="prog">' + Math.min(E.idx + 1, total) + ' / ' + total + '</span></div>'
    + '<div class="er-wave" data-lv="wave"><i></i><i></i><i></i><i></i><i></i></div>'
    + '<div data-lv="stage">' + liveStageHtml(env, E) + '</div>'
    + '<div class="er-ctl">'
    + (E.phase === 'paused'
      ? '<button class="er-btn primary" data-act="lv-resume"><i>' + icon(ctx, 'cpPlay') + '</i>继续</button>'
      : '<button class="er-btn" data-act="lv-pause">暂停</button>')
    + '<button class="er-btn ghost" data-act="lv-replay">重听本段</button>'
    + '<button class="er-btn ghost" data-act="lv-skip">跳过此题</button>'
    + '<button class="er-btn ghost danger" data-act="lv-stop">收工</button>'
    + '</div>'
    + '<div class="er-tune">'
    + '<label class="er-inl">语速<input class="er-input er-num" type="number" min="0.6" max="1.6" step="0.1" data-act="lv-rate" value="' + E.opts.rate + '"></label>'
    + '<label class="er-inl">留白秒<input class="er-input er-num" type="number" min="3" max="20" data-act="lv-gap" value="' + E.opts.gapSec + '"></label>'
    + '<label class="er-inl" title="到点评测超时自动记「跳过」，绝不代你打「听出来了」"><input type="checkbox" data-act="lv-handsfree"' + (E.opts.handsfree ? ' checked' : '') + '>免手控</label>'
    + '<label class="er-inl" title="浏览器不支持语音时自动开；也可手动开：看字跟读，节奏照走"><input type="checkbox" data-act="lv-silent"' + (E.opts.silent ? ' checked' : '') + '>静音跟读</label>'
    + '<button class="er-btn sm ghost" data-act="lv-voice" title="配置 AI 音色通道（OpenAI 兼容 / Azure），失败自动回退系统音色">音色：' + esc(vpModeLabel(voiceCfg(ctx))) + '</button>'
    + '<label class="er-inl" title="到点自动收工，不再偷偷朗读">定时<select class="er-input" data-act="lv-sleep" style="height:28px;width:auto"><option value="0">关</option><option value="10">10 分</option><option value="20">20 分</option><option value="40">40 分</option></select></label>'
    + '</div></div>'
}
/* 定点更新：引擎每次相位变化只动这几块，绝不动整层 */
function updateLive(env) {
  let stage = env.stage
  let E = env.engine.state()
  let box = stage.querySelector('[data-lv="stage"]')
  if (box) box.innerHTML = liveStageHtml(env, E)
  let prog = stage.querySelector('[data-lv="prog"]')
  if (prog) prog.textContent = Math.min(E.idx + 1, E.queue.length) + ' / ' + E.queue.length
  let wave = stage.querySelector('[data-lv="wave"]')
  if (wave) wave.className = 'er-wave' + (E.phase === 'cue' || E.phase === 'ans' ? ' on' : '')
}

/* e5: 待复习队列 + 档案 */
function renderQueue(env) {
  let ctx = env.ctx, db = env.db, S = env.S
  let due = dueKeys(db)
  let news = allFeedKeys(db, ctx).filter(function (k) {
    let st = db.states[k]
    return !st || (!st.box && !st.reps)
  })
  let keys = S.queue.includeNew ? due.concat(news) : due.slice()
  keys = sortQueue(db, keys)
  let groups = {}
  keys.forEach(function (k) {
    let src = String(k).split(':')[0]
    if (!groups[src]) groups[src] = []
    groups[src].push(k)
  })
  let head = '<div class="er-card"><div class="er-card-h"><b>待复习队列</b><em>DUE QUEUE</em></div>'
    + '<div class="er-kgrid slim">'
    + kpiCard(String(due.length), '到期')
    + kpiCard(String(news.length), '新料未排')
    + kpiCard(String(Object.keys(db.states).filter(function (k) { return (db.states[k].weak || 0) > 0 }).length), '弱项')
    + '</div>'
    + '<div class="er-acts">'
    + '<label class="er-inl" title="把从没播过的新料也拉进这一档"><input type="checkbox" data-act="qu-new"' + (S.queue.includeNew ? ' checked' : '') + '>带上新料</label>'
    + (keys.length ? '<button class="er-btn primary" data-act="qu-play"><i>' + icon(ctx, 'cpPlay') + '</i>编成节目单开播（' + keys.length + ' 项）</button>' : '')
    + '</div>'
  let body = ''
  if (!keys.length) {
    body = emptyBox('队列是空的', due.length ? '' : '今天没有到期的料。去备播台开一档新节目，播完自评后会自动排期到这里。')
  } else {
    body = Object.keys(groups).map(function (src) {
      let sd = srcOf(src)
      return '<div class="er-qgroup"><div class="er-qgh"><span class="er-chip src-' + src + '">' + esc(sd ? sd.name : src) + '</span><b>' + groups[src].length + ' 项</b></div>'
        + groups[src].slice(0, 40).map(function (k) {
          let it = feedByKey(db, k, ctx)
          let st = db.states[k] || {}
          let tag = st.due && st.due <= todayKey() ? '<span class="er-chip due">到期</span>' : '<span class="er-chip new">新</span>'
          if ((st.weak || 0) > 0) tag += '<span class="er-chip weak">弱×' + st.weak + '</span>'
          return '<div class="er-qrow"><span>' + esc(it ? it.title : '（素材已不在）') + '</span>' + tag
            + '<i class="er-qdue">' + (st.due ? fmtDate(st.due) : '—') + '</i></div>'
        }).join('') + '</div>'
    }).join('')
  }
  env.stage.innerHTML = head + '</div>' + (body ? '<div class="er-card">' + body + '</div>' : '')
}

function renderStats(env) {
  let ctx = env.ctx, db = env.db
  let t = dbTotals(db, ctx)
  let days = last14(db)
  let maxBar = 1
  days.forEach(function (d) { maxBar = Math.max(maxBar, d.items) })
  let BW = 34, BH = 92
  let chart = '<svg class="er-bars" viewBox="0 0 ' + (BW * 14) + ' ' + (BH + 24) + '" role="img" aria-label="近14天收听条数">'
    + days.map(function (d, i) {
      let h = Math.round((d.items / maxBar) * (BH - 20))
      return '<g transform="translate(' + (i * BW) + ',0)">'
        + '<rect class="ibar" x="' + 9 + '" y="' + (BH - 16 - h) + '" width="' + 16 + '" height="' + Math.max(d.items ? 3 : 0, h) + '"/>'
        + (d.secs > 0 ? '<title>' + d.k + ' · ' + d.items + ' 条 · ' + fmtMins(d.secs) + '</title>' : '')
        + '<text class="dlabel" x="17" y="' + (BH + 4) + '">' + (i % 2 === 0 ? String(+d.k.slice(8, 10)) : '') + '</text></g>'
    }).join('') + '</svg>'
    + '<p class="er-hint" style="margin-top:4px">柱高 = 当日完成自评的条数（悬停看时长）</p>'
  let wt = weakTop(db, function (k) {
    let it = feedByKey(db, k, ctx)
    return it ? (srcLabel(it.src) + ' · ' + it.title) : k
  })
  let wpHtml = wt.length ? wt.map(function (r, i) {
    return '<div class="er-wprow"><i>' + (i + 1) + '</i><span class="w">' + esc(r.text) + '</span>'
      + '<span class="c">模糊 ' + r.weak + ' · 没听出 ' + r.no + '</span></div>'
  }).join('') : '<p class="er-more">还没有弱项 —— 自评「有点模糊/没听出来」的条目会爬到这里，并优先排进下一档节目。</p>'
  let ss = db.sessions.slice(0, 8)
  let ssHtml = ss.length ? '<div class="er-card"><div class="er-card-h"><b>收听流水</b><em>SESSIONS</em></div>'
    + ss.map(function (s) {
      return '<div class="er-srow"><b>' + esc(s.trackName || '即席') + '</b>'
        + '<span>' + fmtDate(String(s.at).slice(0, 10)) + ' · ' + s.played + ' 项 · ' + fmtMins(s.secs) + '</span>'
        + '<i class="er-sok">' + s.ok + '✓ ' + (s.no || s.weak ? (s.no + '✗') : '') + (s.skip ? ' ' + s.skip + '→' : '') + '</i></div>'
    }).join('') + '</div>' : ''
  env.stage.innerHTML = '<div class="er-card"><div class="er-card-h"><b>电台台账</b><em>STATION LEDGER</em></div>'
    + '<div class="er-kgrid">'
    + kpiCard(fmtMins(t.todaySecs), '今日收听')
    + kpiCard(String(t.todayItems), '今日条数')
    + kpiCard(String(t.due), '待复习')
    + kpiCard(String(t.weak), '弱项')
    + kpiCard(String(t.newCount), '新料')
    + kpiCard(String(t.tracks), '节目单')
    + '</div>' + chart + '</div>'
    + '<div class="er-card"><div class="er-card-h"><b>弱项榜（下档节目优先）</b><em>WEAK SPOTS</em></div>' + wpHtml + '</div>'
    + ssHtml
    + '<div class="er-card"><div class="er-card-h"><b>数据维护</b><em>DATA OPS</em></div>'
    + '<div class="er-acts">'
    + '<button class="er-btn" data-act="st-export"><i>' + icon(ctx, 'cpDownload') + '</i>导出 JSON</button>'
    + '<button class="er-btn" data-act="st-import">导入 JSON</button>'
    + '<button class="er-btn" data-act="st-report">下载 MD 报告</button>'
    + '<button class="er-btn danger" data-act="st-clear">清空电台</button>'
    + '</div>'
    + '<p class="er-quiet">档案走 ctx.data 命名空间（随站内云同步）；素材本体在站内各模块，这里只存节目单与收听状态。</p></div>'
}
function kpiCard(v, l, cls) {
  return '<div class="er-kc' + (cls ? ' ' + cls : '') + '"><b>' + esc(v) + '</b><i>' + esc(l) + '</i></div>'
}
function buildReport(db) {
  let t = dbTotals(db, ctx)
  let out = ['# 磨耳朵电台 · 收听报告', '', '- 生成日期：' + dkey(new Date()),
    '- 节目单：' + t.tracks + ' 档 ｜ 待复习：' + t.due + ' ｜ 弱项：' + t.weak + ' ｜ 新料：' + t.newCount,
    '- 今日：' + fmtMins(t.todaySecs) + ' / ' + t.todayItems + ' 条', '', '## 收听流水', '']
  db.sessions.slice(0, 20).forEach(function (s) {
    out.push('- ' + String(s.at).slice(0, 10) + ' 《' + (s.trackName || '即席') + '》 ' + s.played + ' 项 · '
      + fmtMins(s.secs) + ' · 听出 ' + s.ok + ' / 没听出 ' + s.no + ' / 跳过 ' + s.skip)
  })
  out.push('', '由磨耳朵电台 v' + VERSION + ' 生成')
  return out.join('\n')
}

/* e6: 壳层（mountShell + ACT 动作总线 + 键盘 + 生命周期） */
function aiOk(ctx) {
  try { return !!(ctx && ctx.ai && ctx.ai.has && ctx.ai.has()) } catch (e) { return false }
}
function emptyBox(title, sub, act) {
  return '<div class="er-empty"><i>' + MARK_TILE + '</i><b>' + esc(title) + '</b>'
    + (sub ? '<span>' + esc(sub) + '</span>' : '') + (act || '') + '</div>'
}
function ttsOk() {
  try { return !!(window.Tts && window.Tts.supported && window.Tts.supported()) } catch (e) { return false }
}

function mountShell(el, ctx) {
  HOST_CTX = ctx
  let S = {
    view: 'studio',
    studio: { src: 'pol', q: '', pick: new Set(), exp: '', m: { cue: '', ans: '', subject: '', aiText: '' } },
    queue: { includeNew: false }
  }
  let db = loadDb(ctx)
  ctx.__db = db
  /* 播放偏好：manifest config 给默认，keep 存本机实时调过的（不进云同步） */
  let tune = { rate: 1, gapSec: 8, handsfree: false }
  try {
    tune.rate = clamp(ctx.config('defaultRate') || 1, 0.6, 1.6)
    tune.gapSec = clamp(ctx.config('defaultGap') || 8, 3, 20)
    tune.handsfree = !!ctx.config('handsfree')
    let k = ctx.keep.get('tune', null)
    if (k && typeof k === 'object') {
      tune.rate = clamp(k.rate, 0.6, 1.6)
      tune.gapSec = clamp(k.gapSec, 3, 20)
      tune.handsfree = !!k.handsfree
    }
    let sv = String(ctx.data('view') || '')
    for (let i = 0; i < VIEWS.length; i++) if (VIEWS[i].k === sv) S.view = sv
  } catch (e) { }

  let timers = []
  let destroyed = false
  function T(fn, ms) {
    let h = setTimeout(function () { if (!destroyed) fn() }, ms)
    timers.push(h)
    return h
  }
  let _qT = null
  /* 定时收工（通勤场景：到点自动停，不会人下车了还在兜里朗读） */
  let sleepT = null

  function toast(msg, type) { try { ctx.Toast.show(msg, type || 'info', 3600) } catch (e) { } }
  function save() { saveDb(ctx, db) }

  /* ---- 播放器引擎（hooks 全部定点更新，见 updateLive） ---- */
  let env = null
  let engine = makeEngine(ctx, {
    T: T,
    db: function () { return db },
    onPhase: function () { if (S.view === 'live' && env) updateLive(env) },
    onGap: function (left, total) {
      let E = engine.state()
      E._gapLeft = left
      if (S.view !== 'live' || !env) return
      let c = env.stage.querySelector('[data-lv="count"]')
      if (c) c.textContent = left
      let ring = env.stage.querySelector('[data-lv="ring"]')
      if (ring) {
        let C = 326.7
        ring.style.strokeDasharray = C
        ring.style.strokeDashoffset = String(C * (1 - clamp(left / total, 0, 1)))
      }
    },
    onJudge: function (verdict, it, E, el) {
      bumpDay(db, 'items', 1)
      bumpDay(db, 'secs', el || 0)
      save()
      if (env) updKpis()
    },
    onFinish: function (E) {
      db.sessions.unshift(normSession({
        id: uid('s'), trackName: E.trackName, at: nowIso(),
        played: E.played, secs: E.secs, ok: E.ok, no: E.no, weak: E.weak, skip: E.skip
      }))
      if (db.sessions.length > 60) db.sessions.length = 60
      bumpDay(db, 'plays', 1)
      /* 节目单播放计数 */
      for (let i = 0; i < db.tracks.length; i++) {
        if (db.tracks[i].name === E.trackName) { db.tracks[i].plays = clamp(db.tracks[i].plays + 1, 0, 99999); db.tracks[i].lastPlayAt = nowIso(); break }
      }
      save()
      if (S.view === 'live' && env) updateLive(env)
      if (env) updKpis()
    }
  })

  /* ---- KPI 与 dock ---- */
  let kpisEl = null
  let dockEl = null
  let indEl = null
  let qdotEl = null
  let ldotEl = null
  function updKpis() {
    if (!kpisEl) return
    let t = dbTotals(db, ctx)
    kpisEl.innerHTML =
      '<span class="er-kpi"><b>' + fmtMins(t.todaySecs) + '</b><i>今日收听</i></span>'
      + '<span class="er-kpi"><b>' + t.due + '</b><i>待复习</i></span>'
      + '<span class="er-kpi"><b>' + t.tracks + '</b><i>节目单</i></span>'
    if (qdotEl) qdotEl.className = 'er-dot' + (t.due && S.view !== 'queue' ? ' on' : '')
    let E = engine.state()
    let running = E.phase !== 'idle' && E.phase !== 'done'
    if (ldotEl) ldotEl.className = 'er-dot live' + (running ? ' on' : '')
  }
  function updDock() {
    if (!dockEl) return
    for (let i = 0; i < VIEWS.length; i++) if (VIEWS[i].k === S.view) {
      let btn = dockEl.children[1 + i]
      if (btn) {
        indEl.style.transform = 'translateX(' + btn.offsetLeft + 'px)'
        indEl.style.width = btn.offsetWidth + 'px'
      }
      break
    }
    let bs = dockEl.querySelectorAll('.er-dock-item')
    for (let i = 0; i < bs.length; i++) bs[i].className = 'er-dock-item' + (VIEWS[i].k === S.view ? ' on' : '')
  }

  /* ---- 路由（入场动画只在切视图时播 —— 变式工厂 1.1 同款零闪烁纪律） ---- */
  let RENDER = { studio: renderStudio, live: renderLive, queue: renderQueue, stats: renderStats }
  let lastView = null
  let stageEl = null
  function go(v) {
    if (!RENDER[v]) v = 'studio'
    S.view = v
    try { ctx.data('view', v) } catch (e) { }
    render()
  }
  function render() {
    if (destroyed || !stageEl) return
    env = { ctx: ctx, S: S, db: db, stage: stageEl, save: save, go: go, rerender: render, toast: toast, T: T, engine: engine }
    try {
      RENDER[S.view](env)
    } catch (e) {
      stageEl.innerHTML = '<div class="er-card"><div class="er-alert danger">视图渲染出错：' + esc(String((e && e.message) || e)) + '。</div></div>'
    }
    updKpis(); updDock()
    if (S.view !== lastView) {
      lastView = S.view
      stageEl.classList.add('er-enter')
      T(function () { stageEl.classList.remove('er-enter') }, 650)
    }
  }

  /* ---- 动作总线 ---- */
  function startQueue(keys, name) {
    let q = []
    keys.forEach(function (k) {
      let it = feedByKey(db, k, ctx)
      if (it) q.push(it)
    })
    if (!q.length) { toast('这一档里的素材都不在了（可能站内删了）', 'warn'); return false }
    let ok = engine.start(q, name, {
      rate: tune.rate, gapSec: tune.gapSec, handsfree: tune.handsfree,
      silent: !ttsOk()
    })
    if (ok) go('live')
    return ok
  }  let ACT = {
    'quick': function () {
      let due = dueKeys(db)
      if (due.length) startQueue(sortQueue(db, due), '复习 · ' + fmtDate(todayKey()))
      else go('studio')
    },
    'st-gear': function () { go('stats') },
    'go-studio': function () { go('studio') },
    'go-live': function () { go('live') },

    /* 备播台 */
    'st-src': function (t) { S.studio.src = t.dataset.v || 'pol'; S.studio.exp = ''; S.studio.pick = new Set(); render() },
    'st-item': function (t) { let k = t.dataset.key || ''; S.studio.exp = S.studio.exp === k ? '' : k; render() },
    'st-pick': function (t) {
      let key = t.dataset.key
      let on = !S.studio.pick.has(key)
      if (on) {
        if (S.studio.pick.size >= MAX_ITEMS_PER_TRACK) { toast('一档节目单最多 ' + MAX_ITEMS_PER_TRACK + ' 项', 'warn'); return }
        S.studio.pick.add(key)
      } else S.studio.pick.delete(key)
      /* 行级更新：只翻这颗勾与筛选条按钮，不整列表重画 */
      let row = t.closest ? t.closest('.er-cand') : null
      if (row) { if (on) row.classList.add('on'); else row.classList.remove('on'); t.textContent = on ? '✓' : '' }
      syncPickBar()
    },
    'st-pickall': function () {
      let items = feedItems(db, S.studio.src, ctx)
      let q = String(S.studio.q || '').trim().toLowerCase()
      if (q) items = items.filter(function (it) { return String(it.title).toLowerCase().indexOf(q) >= 0 || String(it.cue).toLowerCase().indexOf(q) >= 0 })
      if (S.studio.pick.size) S.studio.pick = new Set()
      else items.slice(0, MAX_ITEMS_PER_TRACK).forEach(function (it) { S.studio.pick.add(it.key) })
      render()
    },
    'st-build': function () {
      if (!S.studio.pick.size) { toast('先勾选素材', 'warn'); return }
      if (db.tracks.length >= MAX_TRACKS) { toast('节目单已满 ' + MAX_TRACKS + ' 档，先清理', 'warn'); return }
      let sd = srcOf(S.studio.src)
      let name = (sd ? sd.name : '混合') + ' · ' + fmtDate(todayKey())
      let ids = []
      S.studio.pick.forEach(function (k) { ids.push(k) })
      db.tracks.unshift(normTrack({ name: name, itemIds: ids }))
      S.studio.pick = new Set()
      save(); render()
      toast('已建节目单「' + name + '」（' + ids.length + ' 项）', 'ok')
    },
    'st-play': function (t) {
      let tr = null
      db.tracks.forEach(function (x) { if (x.id === t.dataset.id) tr = x })
      if (!tr) return
      let r = trackQueue(db, tr, ctx)
      if (!r.queue.length) { toast('这档节目单的素材都不在了', 'warn'); return }
      if (r.missing) toast(r.missing + ' 项素材已不在站内，本次跳过', 'warn')
      startQueue(r.queue.map(function (it) { return it.key }), tr.name)
    },
    'st-playpick': function () {
      let ids = []
      S.studio.pick.forEach(function (k) { ids.push(k) })
      if (!ids.length) { toast('先勾选素材', 'warn'); return }
      startQueue(ids, '即席 · ' + fmtDate(todayKey()))
    },
    /* 只播到期：通勤时间短时,先清这档里到期的 */
    'st-playdue': function (t) {
      let tr = null
      db.tracks.forEach(function (x) { if (x.id === t.dataset.id) tr = x })
      if (!tr) return
      let r = trackQueue(db, tr, ctx)
      let due = r.queue.filter(function (it) {
        let st = db.states[it.key]
        return st && st.box > 0 && st.due && st.due <= todayKey()
      }).map(function (it) { return it.key })
      if (!due.length) { toast('这档里没有到期的项（可点「开播」听全部）', 'info'); return }
      startQueue(sortQueue(db, due), tr.name + ' · 只播到期')
    },
    /* 乱序开播：治「背顺子」——顺序熟了等于没测 */
    'st-shuffle': function (t) {
      let tr = null
      db.tracks.forEach(function (x) { if (x.id === t.dataset.id) tr = x })
      if (!tr) return
      let r = trackQueue(db, tr, ctx)
      let q2 = r.queue.slice()
      for (let i = q2.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let tmp = q2[i]; q2[i] = q2[j]; q2[j] = tmp
      }
      if (!q2.length) { toast('这档节目单的素材都不在了', 'warn'); return }
      let ok = engine.start(q2, tr.name + ' · 乱序', {
        rate: tune.rate, gapSec: tune.gapSec, handsfree: tune.handsfree, silent: !ttsOk()
      })
      if (ok) go('live')
    },
    /* 加料：把当前勾选追加进这档节目单（去重、守上限） */
    'st-edit': function (t) {
      if (!S.studio.pick.size) { toast('先勾选要追加的素材', 'warn'); return }
      let tr = null
      db.tracks.forEach(function (x) { if (x.id === t.dataset.id) tr = x })
      if (!tr) return
      let added = 0, full = false
      S.studio.pick.forEach(function (k) {
        if (tr.itemIds.indexOf(k) < 0) {
          if (tr.itemIds.length >= MAX_ITEMS_PER_TRACK) { full = true; return }
          tr.itemIds.push(k)
          added++
        }
      })
      S.studio.pick = new Set()
      save(); render()
      toast('已加入「' + tr.name + '」' + added + ' 项' + (full ? '（已满 ' + MAX_ITEMS_PER_TRACK + ' 项上限，其余未加）' : ''), added ? 'ok' : 'warn')
    },
    'st-del': function (t) {
      let id = t.dataset.id
      ctx.api.confirm('删除这档节目单？', '只删节目单本身；素材与收听排期状态保留。', function () {
        db.tracks = db.tracks.filter(function (x) { return x.id !== id })
        save(); render(); toast('节目单已删', 'info')
      }, true)
    },
    'st-cadd': function () {
      let m = S.studio.m
      if (!String(m.cue || '').trim()) { toast('提问不能空', 'warn'); return }
      if (db.custom.length >= MAX_CUSTOM) { toast('自建库已满 ' + MAX_CUSTOM + ' 条', 'warn'); return }
      db.custom.unshift(normCustom({ cue: m.cue, ans: m.ans, subject: m.subject }))
      S.studio.m = { cue: '', ans: '', subject: '', aiText: m.aiText || '' }
      save(); render(); toast('已存入自建库', 'ok')
    },
    'st-cdel': function (t) {
      let id = t.dataset.id
      ctx.api.confirm('删除这条自建脚本？', '引用它的节目单会如实提示素材缺失。', function () {
        db.custom = db.custom.filter(function (x) { return x.id !== id })
        save(); render()
      }, true)
    },
    'st-ai': function () {
      let text = String(S.studio.m.aiText || '').trim()
      if (!text) { toast('先粘一段材料', 'warn'); return }
      let fill = function (pairs, how) {
        let n = 0
        pairs.forEach(function (p) {
          if (db.custom.length >= MAX_CUSTOM) return
          db.custom.unshift(normCustom({ cue: p.cue, ans: p.ans, subject: '自建' }))
          n++
        })
        S.studio.m.aiText = ''
        save(); render()
        toast(how + '拆出 ' + n + ' 对脚本', n ? 'ok' : 'warn')
      }
      if (!aiOk(ctx)) { fill(splitScript(text), '本地分段') ; return }
      ctx.ai.json(scriptSystem(), buildScriptAsk(text), { ctx: AI_CTX_SCRIPT, maxTokens: 2600 })
        .then(function (raw) {
          let pairs = parseScriptPairs(raw)
          if (!pairs.length) { fill(splitScript(text), 'AI 没拆出来，本地分段') ; return }
          fill(pairs, 'AI')
        }, function () { fill(splitScript(text), 'AI 失败，本地分段') })
    },

    /* 直播间 */
    'lv-pause': function () { engine.pause() },
    'lv-resume': function () { engine.resume() },
    'lv-replay': function () { engine.replay() },
    'lv-skip': function () { engine.skip() },
    'lv-skipgap': function () { engine.skipGap() },
    'lv-judge': function (t) { engine.judge(t.dataset.v) },
    'lv-again': function () {
      let E = engine.state()
      if (!E.queue.length) { go('studio'); return }
      engine.start(E.queue, E.trackName, {
        rate: tune.rate, gapSec: tune.gapSec, handsfree: tune.handsfree, silent: !ttsOk()
      })
    },
    'lv-stop': function () {
      let E = engine.state()
      if (E.phase === 'done' || E.phase === 'idle') { E.phase = 'idle'; E.queue = []; E.idx = -1; render(); return }
      engine.stop()
    },

    /* 音色通道设置 */
    'lv-voice': function () {
      openVoiceCfgModal(ctx, function () {
        toast('音色通道已更新：' + vpModeLabel(voiceCfg(ctx)), 'ok')
        render()
      })
    },

    /* 待复习 */
    'qu-new': function (t) { S.queue.includeNew = !!(t && t.checked); save(); render() },    'qu-play': function () {
      let keys = dueKeys(db)
      if (S.queue.includeNew) {
        let news = allFeedKeys(db, ctx).filter(function (k) {
          let st = db.states[k]
          return !st || (!st.box && !st.reps)
        })
        keys = keys.concat(news)
      }
      keys = sortQueue(db, keys)
      if (!keys.length) { toast('队列是空的 —— 去备播台开一档吧', 'info'); return }
      startQueue(keys, '复习 · ' + fmtDate(todayKey()))
    },

    /* 档案数据维护 */
    'st-export': function () {
      try { ctx.api.download('ear-radio-' + todayKey() + '.json', JSON.stringify(db, null, 2), 'application/json'); toast('电台档案已导出', 'ok') }
      catch (e) { toast('导出失败', 'danger') }
    },
    'st-import': function () {
      ctx.api.readFile('.json,application/json').then(function (f) {
        if (!f || !f.text) return
        let raw = null
        try { raw = JSON.parse(f.text) } catch (e) { toast('不是合法 JSON', 'danger'); return }
        let inc = normDb(raw)
        inc.tracks.forEach(function (t) {
          if (db.tracks.length >= MAX_TRACKS) return
          if (!db.tracks.some(function (x) { return x.id === t.id })) db.tracks.push(t)
        })
        inc.custom.forEach(function (c) {
          if (db.custom.length >= MAX_CUSTOM) return
          if (!db.custom.some(function (x) { return x.id === c.id })) db.custom.push(c)
        })
        Object.keys(inc.states).forEach(function (k) {
          let cur = db.states[k]
          /* 合并取"更熟"的一侧：reps 多者胜（云同步回滚不丢进度） */
          if (!cur || (inc.states[k].reps || 0) > (cur.reps || 0)) db.states[k] = inc.states[k]
        })
        Object.keys(inc.day).forEach(function (k) {
          if (!db.day[k]) db.day[k] = { items: 0, secs: 0, plays: 0 }
          db.day[k].items += inc.day[k].items
          db.day[k].secs += inc.day[k].secs
          db.day[k].plays += inc.day[k].plays
        })
        save(); render(); toast('导入完成', 'ok')
      }).catch(function () { })
    },
    'st-report': function () {
      try { ctx.api.download('磨耳朵电台报告-' + todayKey() + '.md', buildReport(db), 'text/markdown'); toast('报告已下载', 'ok') } catch (e) { toast('生成失败', 'danger') }
    },
    'st-clear': function () {
      ctx.api.confirm('清空电台全部档案？', '节目单、自建脚本、排期状态、收听流水一起清（站内素材本体不动）。建议先导出。', function () {
        db = emptyDb(); ctx.__db = db
        S.studio.pick = new Set()
        save(); render(); toast('电台已重置', 'info')
      }, true)
    }
  }
  /* 勾选后同步筛选条（与 renderStudio 首画共用文案规则） */
  function syncPickBar() {
    let bar = document.querySelector('.er-filter')
    if (!bar) return
    let has = S.studio.pick.size > 0
    let go = bar.querySelector('[data-act="st-build"]')
    if (!has) { if (go) go.remove() }
    else if (go) go.innerHTML = '<i>' + icon(HOST_CTX, 'volume') + '</i>建节目单（' + S.studio.pick.size + '）'
    else bar.insertAdjacentHTML('beforeend', '<button class="er-btn primary" data-act="st-build"><i>' + icon(HOST_CTX, 'volume') + '</i>建节目单（' + S.studio.pick.size + '）</button>')
    let pk = bar.querySelector('[data-act="st-playpick"]')
    if (!has) { if (pk) pk.remove() }
    else if (!pk) bar.insertAdjacentHTML('beforeend', '<button class="er-btn ghost" data-act="st-playpick" title="不建单直接开一档即席节目">先听这批</button>')
    let all = bar.querySelector('[data-act="st-pickall"]')
    if (all) all.textContent = has ? '全取消' : '本页全选'
  }

  /* ---- 事件接线 ---- */
  function onClick(e) {
    let t = e.target.closest ? e.target.closest('[data-act]') : null
    if (!t) return
    if (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA') return
    let fn = ACT[t.getAttribute('data-act')]
    if (!fn) return
    e.preventDefault()
    try { fn(t, e) } catch (err) { toast('操作出错：' + String((err && err.message) || err).slice(0, 50), 'danger') }
  }
  function onInput(e) {
    let t = e.target
    if (!t || !t.getAttribute) return
    let a = t.getAttribute('data-act') || ''
    let f = t.getAttribute('data-f') || ''
    if (f && S.studio.m) { S.studio.m[f] = t.value; return }
    if (a === 'st-q') {
      S.studio.q = t.value
      if (_qT) clearTimeout(_qT)
      _qT = setTimeout(function () {
        if (destroyed) return
        render()
        let again = document.querySelector('[data-act="st-q"]')
        if (again) { again.focus(); try { again.setSelectionRange(again.value.length, again.value.length) } catch (e2) { } }
      }, 300)
      return
    }
    if (a === 'lv-rate') { tune.rate = clamp(t.value, 0.6, 1.6); engine.state().opts.rate = tune.rate; saveTune(); return }
    if (a === 'lv-gap') { tune.gapSec = clamp(t.value, 3, 20); engine.state().opts.gapSec = tune.gapSec; saveTune(); return }
    if (a === 'lv-handsfree') { tune.handsfree = !!t.checked; engine.state().opts.handsfree = tune.handsfree; saveTune(); return }
    if (a === 'lv-silent') { engine.state().opts.silent = !!t.checked; render(); return }
    if (a === 'lv-sleep') {
      let mins = Number(t.value) || 0
      if (sleepT) { clearTimeout(sleepT); sleepT = null }
      if (mins > 0) {
        sleepT = T(function () { engine.stop(); toast('定时收工时间到，电台已停', 'info') }, mins * 60000)
        toast('将在 ' + mins + ' 分钟后自动收工', 'ok')
      }
      return
    }
    if (a === 'qu-new') { ACT['qu-new'](t); return }
  }
  function saveTune() { try { ctx.keep.set('tune', tune) } catch (e) { } }
  function onDock(e) {
    let b = e.target.closest ? e.target.closest('.er-dock-item') : null
    if (b) { e.preventDefault(); go(b.getAttribute('data-view')) }
  }
  /* 键盘：1-4 切视图；空格=暂停/继续（仅直播间）；Esc=暂停 */
  function onKeyDown(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return
    let tg = e.target && e.target.tagName
    if (tg === 'INPUT' || tg === 'TEXTAREA' || tg === 'SELECT') return
    if (e.key >= '1' && e.key <= '4') {
      let v = VIEWS[Number(e.key) - 1]
      if (v) { e.preventDefault(); go(v.k) }
    } else if (e.key === ' ' && S.view === 'live') {
      e.preventDefault()
      let p = engine.state().phase
      if (p === 'paused') engine.resume()
      else if (p !== 'idle' && p !== 'done') engine.pause()
    } else if (e.key === 'Escape' && S.view === 'live') {
      let p = engine.state().phase
      if (p !== 'idle' && p !== 'done' && p !== 'paused') engine.pause()
    } else if (S.view === 'live') {
      /* 通勤免手操作：←重听、→跳过此题、回车=听出来了（仅点评相位） */
      let p = engine.state().phase
      if (p === 'idle' || p === 'done') return
      if (e.key === 'ArrowRight') { e.preventDefault(); engine.skip() }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); engine.replay() }
      else if (e.key === 'Enter' && p === 'judge') { e.preventDefault(); engine.judge('ok') }
    }
  }

  /* ---- 骨架 ---- */
  el.innerHTML = ''
  let root = document.createElement('div')
  root.className = 'er-root'
  root.innerHTML = ''
    + '<div class="er-aura" aria-hidden="true"><i></i><i></i></div>'
    + '<header class="er-top" data-er="top">'
    + '  <div class="er-brand"><span class="er-mark" aria-hidden="true">' + MARK_LG + '</span>'
    + '    <span class="er-brandtx"><i class="er-kicker">EAR · RADIO</i><b>磨耳朵电台<em>v' + esc(VERSION) + '</em></b></span></div>'
    + '  <div class="er-kpis" data-er="kpis"></div>'
    + '  <div class="er-topacts">'
    + '    <button class="er-btn primary" data-act="quick"><i>' + icon(ctx, 'cpPlay') + '</i><span>开播待复习</span></button>'
    + '    <button class="er-icobtn" data-act="st-gear" title="电台台账与数据">' + icon(ctx, 'cpGear') + '</button>'
    + '  </div></header>'
    + '<main class="er-stage" data-er="stage"></main>'
    + '<nav class="er-dockwrap"><div class="er-dock" data-er="dock">'
    + '  <i class="er-dock-ind" data-er="ind"></i>'
    + VIEWS.map(function (v) {
      return '<button class="er-dock-item" data-view="' + v.k + '" title="' + esc(v.t.replace(/\s/g, '')) + '（键盘 ' + (VIEWS.indexOf(v) + 1) + '）">' + icon(ctx, v.ic) + '<em>' + esc(v.t) + '</em>'
        + (v.k === 'queue' ? '<i class="er-dot" data-er="qdot"></i>' : '')
        + (v.k === 'live' ? '<i class="er-dot live" data-er="ldot"></i>' : '') + '</button>'
    }).join('')
    + '</div></nav>'
  el.appendChild(root)

  let styleEl = null
  if (!document.getElementById('er-extra-style')) {
    styleEl = document.createElement('style')
    styleEl.id = 'er-extra-style'
    styleEl.textContent = CSS_EXTRA
    document.head.appendChild(styleEl)
  }
  kpisEl = root.querySelector('[data-er="kpis"]')
  stageEl = root.querySelector('[data-er="stage"]')
  dockEl = root.querySelector('[data-er="dock"]')
  indEl = root.querySelector('[data-er="ind"]')
  qdotEl = root.querySelector('[data-er="qdot"]')
  ldotEl = root.querySelector('[data-er="ldot"]')

  root.addEventListener('click', onClick)
  root.addEventListener('input', onInput)
  dockEl.addEventListener('click', onDock)
  window.addEventListener('keydown', onKeyDown)
  let lastStuck = false
  function onScroll() {
    let topEl = root.querySelector('[data-er="top"]')
    if (!topEl) return
    let stuck = topEl.getBoundingClientRect().top <= 2
    if (stuck === lastStuck) return
    lastStuck = stuck
    topEl.className = 'er-top' + (stuck ? ' is-stuck' : '')
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  function onStore() {
    T(function () {
      if (destroyed) return
      /* 云同步/他页改了素材池：只在没播放时轻同步一次（播放中绝不重画） */
      if (engine.state().phase === 'idle' || engine.state().phase === 'done') {
        db = loadDb(ctx); ctx.__db = db
        render()
      } else updKpis()
    }, 120)
  }
  document.addEventListener('store:change', onStore)

  render()
  T(updDock, 30)

  return function destroy() {
    destroyed = true
    engine.kill()
    try { window.Tts && window.Tts.stop && window.Tts.stop() } catch (e) { }
    vpStop()
    timers.forEach(clearTimeout)
    if (_qT) clearTimeout(_qT)
    root.removeEventListener('click', onClick)
    root.removeEventListener('input', onInput)
    dockEl.removeEventListener('click', onDock)
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('scroll', onScroll)
    document.removeEventListener('store:change', onStore)
    if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl)
    try { ctx.__db = null } catch (e) { }
  }
}

/* e7: 样式（manifest 小件 + 整页 CSS_EXTRA） */
let CSS = [
  '.er-chip{display:inline-flex;align-items:center;height:18px;padding:0 8px;border-radius:999px;font-size:10.5px;font-weight:600;background:color-mix(in srgb,var(--text-primary,#1b2430) 8%,transparent);color:var(--text-secondary,#4a5568)}',
  '.er-chip.due{background:color-mix(in srgb,#0e7490 14%,transparent);color:#0e7490}',
  '.er-chip.new{background:color-mix(in srgb,#16a34a 12%,transparent);color:#166534}',
  '.er-chip.weak{background:color-mix(in srgb,#dc2626 11%,transparent);color:#b91c1c}',
  '.er-chip.mute{background:color-mix(in srgb,#7c3aed 12%,transparent);color:#6d28d9}',
  '.er-chip.subj{background:color-mix(in srgb,var(--er-acc,#0e7490) 12%,transparent);color:var(--er-acc,#0e7490)}',
  '.er-chip.src-pol{background:color-mix(in srgb,#b91c1c 12%,transparent);color:#b91c1c}',
  '.er-chip.src-vocab{background:color-mix(in srgb,#2563eb 12%,transparent);color:#1d4ed8}',
  '.er-chip.src-essay{background:color-mix(in srgb,#7c3aed 12%,transparent);color:#6d28d9}',
  '.er-chip.src-custom{background:color-mix(in srgb,#0d9488 13%,transparent);color:#0f766e}',
  'html[data-theme="night"] .er-chip.due,html[data-theme="night"] .er-chip.subj{color:var(--nk-acc,#f0b95a)}',
  'html[data-theme="night"] .er-chip.new{color:#86efac}',
  'html[data-theme="night"] .er-chip.weak{color:var(--danger,#ef6a63)}',
  '.er-panel{display:flex;flex-direction:column;gap:10px;padding:14px 6px 6px;font:13px/1.6 "PingFang SC","Noto Sans SC",system-ui,sans-serif;color:var(--text-primary,#1b2430)}',
  '.er-panel-top{display:flex;align-items:center;gap:8px}',
  '.er-panel-top b{font-family:Georgia,"Songti SC",serif;font-size:14.5px;font-weight:700}',
  '.er-panel-top em{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:9.5px;letter-spacing:.14em;color:var(--text-muted,#8a94a3);margin-left:auto}',
  '.er-panel .er-mark-sm{color:#0e7490;display:grid;place-items:center}',
  '.er-panel .er-mark-sm svg{width:20px;height:20px}',
  'html[data-theme="night"] .er-panel .er-mark-sm{color:var(--nk-acc,#f0b95a)}',
  '.er-panel-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}',
  '.er-panel-kpis .pk{display:flex;flex-direction:column;align-items:center;padding:9px 4px;border:1px solid var(--line,#e5e7eb);border-radius:10px;background:color-mix(in srgb,#0e7490 4%,transparent)}',
  '.er-panel-kpis .pk b{font-family:Georgia,serif;font-size:18px;line-height:1.1;font-variant-numeric:tabular-nums;color:#0e7490}',
  'html[data-theme="night"] .er-panel-kpis .pk b{color:var(--nk-acc,#f0b95a)}',
  '.er-panel-kpis .pk i{font-style:normal;font-size:10px;color:var(--text-muted,#8a94a3);margin-top:2px}',
  '.er-panel-stage{margin:0;font-size:12px;color:var(--text-secondary,#4a5568)}',
  '.er-panel-acts{display:flex;gap:8px}'
].join('')

let CSS_EXTRA = [
  '.er-root{--er-acc:#0e7490;--er-acc2:#6366f1;--er-on-acc:#fff;--er-ink:var(--text-primary,#1b2430);--er-sub:var(--text-muted,#6b7788);--er-line:var(--line,#e5e7eb);--er-line2:color-mix(in srgb,var(--text-primary,#1b2430) 22%,transparent);--er-bg:var(--surface,#fff);--er-soft:var(--surface-muted,#f6f8fb);--er-gut:var(--vp-x,16px);--er-w:1120px;color:var(--er-ink);font:14px/1.65 "PingFang SC","Noto Sans SC","Microsoft YaHei",system-ui,sans-serif;position:relative}',
  'html[data-theme="night"] .er-root{--er-acc:var(--nk-acc,#f0b95a);--er-acc2:#e2a43f;--er-on-acc:#2a1c04}',
  '.er-root *,.er-root *::before,.er-root *::after{box-sizing:border-box}.er-root button{font-family:inherit;color:inherit}.er-root i{font-style:normal}',
  '.er-aura{position:absolute;inset:calc(var(--vp-t,16px)*-1) calc(var(--vp-x,16px)*-1) calc(var(--vp-b,24px)*-1);z-index:0;pointer-events:none;overflow:hidden;background-image:repeating-linear-gradient(90deg,color-mix(in srgb,var(--er-ink) 4%,transparent) 0 1px,transparent 1px 96px);mask-image:linear-gradient(180deg,#000,transparent 74%);-webkit-mask-image:linear-gradient(180deg,#000,transparent 74%)}',
  '.er-aura i{position:absolute;border-radius:50%;filter:blur(90px);opacity:.24}',
  '.er-aura i:nth-child(1){width:440px;height:440px;left:-150px;top:-200px;background:radial-gradient(circle,rgba(14,116,144,.45),transparent 68%);animation:erFloat 34s ease-in-out infinite alternate}',
  '.er-aura i:nth-child(2){width:380px;height:380px;right:-130px;top:-110px;background:radial-gradient(circle,rgba(99,102,241,.32),transparent 70%);animation:erFloat 42s ease-in-out infinite alternate-reverse}',
  '@keyframes erFloat{to{transform:translate3d(26px,-18px,0) scale(1.05)}}',
  '.er-top{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:16px;margin:0 calc(-1*var(--er-gut));padding:15px calc(var(--er-gut)+max(6px,(100% - var(--er-w))/2)) 13px;background:transparent;transition:padding .3s cubic-bezier(.22,1,.36,1),background-color .3s ease}',
  '.er-top::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--er-line);opacity:0;transition:opacity .3s ease}',
  '.er-top.is-stuck{padding-top:8px;padding-bottom:8px;background:color-mix(in srgb,var(--er-bg) 88%,transparent);backdrop-filter:blur(18px) saturate(1.1);-webkit-backdrop-filter:blur(18px) saturate(1.1)}',
  '.er-top.is-stuck::after{opacity:1}',
  '.er-brand{display:flex;align-items:center;gap:11px;min-width:0}',
  '.er-mark{width:40px;height:40px;flex:0 0 40px;display:grid;place-items:center;color:var(--er-acc);transition:width .3s,height .3s,flex-basis .3s}',
  '.er-mark svg{width:34px;height:34px}',
  '.er-top.is-stuck .er-mark{width:30px;height:30px;flex-basis:30px}.er-top.is-stuck .er-mark svg{width:26px;height:26px}',
  '.er-brandtx{display:flex;flex-direction:column;min-width:0}',
  '.er-kicker{font:600 8.5px/1.5 ui-monospace,Consolas,monospace;letter-spacing:.24em;color:var(--er-sub);text-transform:uppercase;max-height:13px;overflow:hidden;transition:max-height .3s,opacity .3s}',
  '.er-top.is-stuck .er-kicker{max-height:0;opacity:0}',
  '.er-brandtx b{font-family:Georgia,"Songti SC","Noto Serif SC",serif;font-size:21px;font-weight:700;letter-spacing:.05em;white-space:nowrap;transition:font-size .3s}',
  '.er-top.is-stuck .er-brandtx b{font-size:17px}',
  '.er-brandtx em{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:9.5px;color:var(--er-sub);margin-left:7px}',
  '.er-kpis{display:flex;align-items:baseline;margin-left:auto}',
  '.er-kpi{display:flex;flex-direction:column;align-items:center;padding:0 14px;border-left:1px solid var(--er-line);min-width:54px}',
  '.er-kpi:first-child{border-left:0}',
  '.er-kpi b{font-family:Georgia,serif;font-size:19px;line-height:1.15;font-variant-numeric:tabular-nums;transition:font-size .3s}',
  '.er-top.is-stuck .er-kpi b{font-size:16px}',
  '.er-kpi i{font-size:9.5px;color:var(--er-sub);letter-spacing:.14em}',
  '.er-topacts{display:flex;align-items:center;gap:10px;margin-left:6px}',
  '.er-btn{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 1px;border:0;border-bottom:1px solid transparent;border-radius:0;background:none;color:var(--er-ink);font-size:13px;font-weight:600;cursor:pointer;transition:color .16s,border-color .16s,transform .16s}',
  '.er-btn:hover{color:var(--er-acc);border-bottom-color:currentColor}',
  '.er-btn:active{transform:translateY(1px)}',
  '.er-btn svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.8}',
  '.er-btn.primary{height:34px;padding:0 18px;border:0;border-radius:999px;background:linear-gradient(135deg,var(--er-acc),var(--er-acc2));color:var(--er-on-acc);box-shadow:0 8px 20px -12px color-mix(in srgb,var(--er-acc) 90%,transparent)}',
  '.er-btn.primary:hover{color:var(--er-on-acc);transform:translateY(-1px)}',
  '.er-btn.ghost{color:var(--er-sub)}.er-btn.ghost.danger{color:#b91c1c}',
  '.er-btn.danger{color:#b91c1c}',
  'html[data-theme="night"] .er-btn.ghost.danger,html[data-theme="night"] .er-btn.danger{color:var(--danger,#ef6a63)}',
  '.er-btn.sm{height:24px;font-size:12px}',
  '.er-icobtn{width:30px;height:30px;display:grid;place-items:center;border:0;background:none;color:var(--er-sub);cursor:pointer;transition:color .16s,transform .16s}',
  '.er-icobtn:hover{color:var(--er-acc);transform:translateY(-1px)}',
  '.er-icobtn svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.7}',
  '.er-stage{position:relative;z-index:1;width:100%;max-width:var(--er-w);margin:0 auto;display:flex;flex-direction:column;padding:4px 6px 150px}',
  '.er-card{border:0;border-top:1px solid var(--er-line);border-radius:0;background:transparent;box-shadow:none;padding:18px 0 6px}',
  '.er-card:first-child{border-top:0;padding-top:8px}',
  /* 入场动画只在切视图时播（.er-enter 由 render 挂/摘） */
  '.er-enter .er-card{animation:erRise .45s cubic-bezier(.22,1,.36,1) both}',
  '.er-enter .er-card:nth-child(2){animation-delay:45ms}.er-enter .er-card:nth-child(3){animation-delay:85ms}',
  '@keyframes erRise{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:none}}',
  '.er-card-h{display:flex;align-items:baseline;gap:10px;padding-bottom:9px;margin-bottom:14px;border-bottom:1px solid var(--er-line)}',
  '.er-card-h b{font-family:Georgia,"Songti SC",serif;font-size:17px;font-weight:700;letter-spacing:.03em}',
  '.er-card-h em{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:10px;letter-spacing:.12em;color:var(--er-sub);text-transform:uppercase}',
  '.er-card-h .er-btn{margin-left:auto}',
  '.er-hint{font-size:11.5px;color:var(--er-sub);letter-spacing:.02em}',
  '.er-more{font-size:12px;color:var(--er-sub);margin-top:9px;padding-top:9px;border-top:1px dashed var(--er-line)}',
  '.er-quiet{font-size:12.5px;line-height:1.9;color:var(--er-sub)}',
  '.er-acts{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:14px}',
  '.er-alert{margin:0 0 12px;padding:9px 13px;border-radius:8px;font-size:12.5px;line-height:1.7}',
  '.er-alert.danger{background:color-mix(in srgb,var(--danger,#ef6a63) 12%,transparent);color:#b91c1c}',
  'html[data-theme="night"] .er-alert.danger{color:var(--danger,#ef6a63)}',
  '.er-seg{display:inline-flex;gap:2px;padding:3px;border-radius:999px;background:var(--er-soft)}',
  '.er-segbtn{height:28px;padding:0 14px;border:0;border-radius:999px;background:none;color:var(--er-sub);font-size:12.5px;font-weight:600;cursor:pointer;transition:background .16s,color .16s}',
  '.er-segbtn.on{background:var(--er-bg);color:var(--er-ink);box-shadow:0 1px 4px rgba(0,0,0,.10)}',
  '.er-tip{margin:10px 0 0;font-size:12px;color:var(--er-sub)}',
  '.er-filter{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:12px}',
  '.er-search{flex:1;min-width:170px;max-width:300px}',
  '.er-count{font-size:12px;color:var(--er-sub);font-variant-numeric:tabular-nums}',
  '.er-input{height:32px;border:0;border-bottom:1px solid var(--er-line2);border-radius:0;padding:3px 2px;background:transparent;color:var(--er-ink);font-size:13.5px;font-family:inherit;outline:none;transition:border-color .16s,box-shadow .16s}',
  '.er-input:focus{border-bottom-color:var(--er-acc);box-shadow:0 1px 0 0 var(--er-acc)}',
  '.er-input.er-num{width:62px;text-align:center}',
  '.er-ta{height:auto;padding:6px 4px;resize:vertical;width:100%;display:block}',
  '.er-inl{display:inline-flex;align-items:center;gap:8px;font-size:12.5px;color:var(--er-sub)}',
  '.er-cands{display:flex;flex-direction:column;margin-top:10px}',
  '.er-cand{display:flex;align-items:flex-start;gap:12px;padding:10px 2px;border-bottom:1px solid var(--er-line);transition:background .18s,padding-left .18s}',
  '.er-cand:hover{background:linear-gradient(90deg,color-mix(in srgb,var(--er-acc) 7%,transparent),transparent 58%);padding-left:8px}',
  '.er-cand.on{background:linear-gradient(90deg,color-mix(in srgb,var(--er-acc) 11%,transparent),transparent 62%)}',
  '.er-pickbtn{width:24px;height:24px;margin-top:2px;flex:0 0 24px;border:1px solid var(--er-line2);border-radius:6px;background:none;color:var(--er-sub);cursor:pointer;font-size:13px;line-height:1}',
  '.er-cand.on .er-pickbtn{background:var(--er-acc);border-color:var(--er-acc);color:var(--er-on-acc)}',
  '.er-cmain{flex:1;min-width:0;cursor:pointer}',
  '.er-cmain b{display:block;font-size:13.5px;font-weight:600;line-height:1.55}',
  '.er-cmeta{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-top:4px}',
  '.er-chev{font-size:11px;color:var(--er-sub);margin-left:auto}',
  '.er-cfull{margin-top:8px;padding:9px 12px;border-left:2px solid var(--er-acc);background:var(--er-soft);font-size:12.5px;line-height:1.8;color:var(--er-sub)}',
  '.er-cfull p{margin:3px 0}.er-cfull p em{font-style:normal;font-weight:700;color:var(--er-ink);margin-right:6px}',
  '.er-trow{display:flex;align-items:center;gap:12px;padding:11px 2px;border-bottom:1px solid var(--er-line)}',
  '.er-trow:last-child{border-bottom:0}',
  '.er-tmain{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}',
  '.er-tmain b{font-size:13.5px}.er-tmain span{font-size:11.5px;color:var(--er-sub)}',
  '.er-due{color:#b91c1c;font-weight:700}',
  'html[data-theme="night"] .er-due{color:var(--danger,#ef6a63)}',
  '.er-mform{display:flex;flex-direction:column;gap:10px;margin-bottom:12px}',
  '.er-fldrow{display:flex;gap:14px;flex-wrap:wrap;align-items:flex-end}',
  '.er-fld{display:flex;flex-direction:column;gap:5px;flex:1;min-width:200px}',
  '.er-fld>span{font-size:11.5px;font-weight:700;color:var(--er-sub);letter-spacing:.04em}',
  '.er-import{margin:2px 0 12px;border:1px dashed var(--er-line2);border-radius:10px;padding:9px 13px}',
  '.er-import summary{cursor:pointer;font-size:12.5px;font-weight:600;color:var(--er-acc)}',
  '.er-import .er-ta{margin-top:9px}',
  '.er-empty{display:flex;flex-direction:column;align-items:center;gap:8px;padding:36px 20px;border:1px dashed var(--er-line2);border-radius:14px;text-align:center}',
  '.er-empty i{color:color-mix(in srgb,var(--er-acc) 40%,transparent);display:inline-flex}',
  '.er-empty b{font-family:Georgia,"Songti SC",serif;font-size:15px}',
  '.er-empty span{font-size:12px;color:var(--er-sub);max-width:420px;line-height:1.8}',
  '.er-empty .er-btn{margin-top:6px}',
  /* ---- 直播间 ---- */
  '.er-player{max-width:720px;margin:0 auto;width:100%}',
  '.er-phead{display:flex;align-items:baseline;gap:12px;margin-bottom:6px}',
  '.er-phead b{font-family:Georgia,"Songti SC",serif;font-size:16px}',
  '.er-prog{margin-left:auto;font-family:ui-monospace,Consolas,monospace;font-size:12px;color:var(--er-sub);font-variant-numeric:tabular-nums}',
  '.er-wave{display:flex;align-items:flex-end;gap:4px;height:22px;margin:6px 0 14px}',
  '.er-wave i{width:5px;height:5px;border-radius:3px;background:color-mix(in srgb,var(--er-acc) 45%,transparent)}',
  '.er-wave.on i{background:var(--er-acc);animation:erWave 1s ease-in-out infinite}',
  '.er-wave.on i:nth-child(2){animation-delay:.12s}.er-wave.on i:nth-child(3){animation-delay:.24s}.er-wave.on i:nth-child(4){animation-delay:.36s}.er-wave.on i:nth-child(5){animation-delay:.48s}',
  '@keyframes erWave{0%,100%{height:5px}50%{height:20px}}',
  '.er-lvitem{display:flex;align-items:center;gap:9px;margin-bottom:8px}',
  '.er-lvitem b{font-size:14px}',
  '.er-plabel{display:block;font:700 10px ui-monospace,Consolas,monospace;letter-spacing:.24em;color:var(--er-acc);margin-bottom:6px}',
  '.er-cardcue,.er-cardans{border-radius:14px;padding:16px 18px;margin-bottom:12px}',
  '.er-cardcue{border:1px solid color-mix(in srgb,var(--er-acc) 40%,transparent);background:color-mix(in srgb,var(--er-acc) 6%,transparent)}',
  '.er-cardans{border:1px solid color-mix(in srgb,#16a34a 35%,transparent);background:color-mix(in srgb,#16a34a 5%,transparent)}',
  '.er-ptext{font-size:15px;line-height:1.8;white-space:pre-wrap}',
  '.er-gap{position:relative;width:130px;height:130px;margin:8px auto 4px;display:grid;place-items:center}',
  '.er-gap b{position:absolute;font-family:Georgia,serif;font-size:38px;font-variant-numeric:tabular-nums;color:var(--er-acc)}',
  '.er-ring{width:130px;height:130px;transform:rotate(-90deg)}',
  '.er-ring circle{fill:none;stroke-width:6}',
  '.er-ring .rbg{stroke:var(--er-soft)}',
  '.er-ring .rfg{stroke:var(--er-acc);stroke-linecap:round;transition:stroke-dashoffset 1s linear}',
  '.er-judge{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:6px 0 10px}',
  '.er-paused{text-align:center;padding:26px 0}',
  '.er-paused b{font-family:Georgia,serif;font-size:18px}',
  '.er-done{text-align:center;padding:18px 0 6px}',
  '.er-done b{font-family:Georgia,"Songti SC",serif;font-size:18px}',
  '.er-donesum{display:flex;justify-content:center;gap:18px;margin:14px 0 6px;font-size:13px;color:var(--er-sub)}',
  '.er-donesum i{font-style:normal;font-family:Georgia,serif;font-size:20px;font-weight:700;color:var(--er-ink);margin-right:3px;font-variant-numeric:tabular-nums}',
  '.er-donesum .ok i{color:#16a34a}.er-donesum .no i{color:#b91c1c}',
  '.er-ctl{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:10px;border-top:1px dashed var(--er-line)}',
  '.er-tune{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:12px;padding-top:10px;border-top:1px dashed var(--er-line)}',
  '.er-tune .er-inl input[type="checkbox"]{accent-color:var(--er-acc);width:15px;height:15px}',
  /* ---- 队列/档案 ---- */
  '.er-qgroup{margin-bottom:14px}',
  '.er-qgh{display:flex;align-items:baseline;gap:10px;padding-bottom:6px;border-bottom:1px dashed var(--er-line);margin-bottom:4px}',
  '.er-qgh b{font-size:12.5px;color:var(--er-sub)}',
  '.er-qrow{display:flex;align-items:center;gap:10px;padding:8px 2px;border-bottom:1px solid color-mix(in srgb,var(--er-line) 55%,transparent);font-size:13px}',
  '.er-qrow:last-child{border-bottom:0}',
  '.er-qrow>span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
  '.er-qdue{font-family:ui-monospace,Consolas,monospace;font-size:11px;color:var(--er-sub);white-space:nowrap}',
  '.er-kgrid{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-bottom:14px}',
  '.er-kgrid.slim{grid-template-columns:repeat(3,1fr)}',
  '.er-kc{border:1px solid var(--er-line);border-radius:12px;padding:11px 13px;display:flex;flex-direction:column;gap:2px;background:var(--er-bg)}',
  '.er-kc b{font-family:Georgia,serif;font-size:19px;font-variant-numeric:tabular-nums;line-height:1.15}',
  '.er-kc i{font-size:10.5px;color:var(--er-sub);letter-spacing:.05em}',
  '.er-bars{width:100%;max-width:520px;height:auto}',
  '.er-bars .ibar{fill:color-mix(in srgb,var(--er-acc) 62%,transparent)}',
  '.er-bars .dlabel{fill:var(--er-sub);font:9px ui-monospace,Consolas,monospace;text-anchor:middle}',
  '.er-wprow{display:flex;align-items:center;gap:12px;padding:9px 2px;border-bottom:1px dashed var(--er-line)}',
  '.er-wprow:last-child{border-bottom:0}',
  '.er-wprow i{flex:0 0 22px;height:22px;display:grid;place-items:center;border-radius:7px;background:color-mix(in srgb,#dc2626 12%,transparent);color:#b91c1c;font:700 11px ui-monospace,Consolas,monospace}',
  '.er-wprow .w{flex:1;min-width:0;font-size:12.5px}',
  '.er-wprow .c{font-size:11px;color:var(--er-sub);white-space:nowrap}',
  '.er-srow{display:flex;align-items:baseline;gap:12px;padding:8px 2px;border-bottom:1px dashed var(--er-line);font-size:12.5px}',
  '.er-srow:last-child{border-bottom:0}',
  '.er-srow b{font-size:13px}.er-srow span{color:var(--er-sub)}',
  '.er-sok{margin-left:auto;font-family:ui-monospace,Consolas,monospace;font-size:11.5px;color:#166534}',
  /* ---- dock ---- */
  '.er-dockwrap{position:fixed;left:0;right:0;bottom:0;z-index:40;display:flex;justify-content:center;padding:0 14px 12px;pointer-events:none}',
  '.er-dock{position:relative;display:flex;gap:2px;padding:6px;pointer-events:auto;border-radius:19px;background:color-mix(in srgb,var(--er-bg) 82%,transparent);backdrop-filter:blur(16px) saturate(1.2);-webkit-backdrop-filter:blur(16px) saturate(1.2);border:1px solid var(--er-line);box-shadow:0 14px 38px -18px rgba(15,23,42,.4)}',
  '.er-dock-ind{position:absolute;top:6px;bottom:6px;left:6px;width:10px;border-radius:13px;background:color-mix(in srgb,var(--er-acc) 16%,transparent);transition:transform .32s cubic-bezier(.22,1,.36,1),width .32s cubic-bezier(.22,1,.36,1)}',
  '.er-dock-item{position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;min-width:80px;padding:8px 14px;border:0;border-radius:13px;background:none;color:var(--er-sub);font-size:11.5px;font-weight:600;cursor:pointer;transition:color .18s}',
  '.er-dock-item svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.7}',
  '.er-dock-item:hover{color:var(--er-ink)}',
  '.er-dock-item.on{color:var(--er-acc)}',
  '.er-dot{position:absolute;top:6px;right:12px;width:7px;height:7px;border-radius:50%;background:transparent}',
  '.er-dot.on{background:#dc2626;box-shadow:0 0 0 2px color-mix(in srgb,var(--er-bg) 80%,transparent)}',
  '.er-dot.live.on{background:var(--er-acc)}',
  '@media (max-width:780px){.er-kpis{display:none}.er-kgrid{grid-template-columns:repeat(3,1fr)}.er-dock-item{min-width:62px;padding:8px 8px}.er-judge .er-btn{flex:1}}',
  '@media (prefers-reduced-motion:reduce){.er-root *,.er-root *::before,.er-root *::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}'
].join('')

/* e8: 增值能力层（常驻面板 / 教练技能 / 插件间服务） */
let HOST_CTX = null

/* 常驻面板：宿主 openPanel 会传 box 并绑交互；守门 plugin-capability 单参只看返回值
 * —— 双契约：有 box 写 box，永远返回 HTML 字符串（变式工厂同款）。 */
function panelRender(ctx, box) {
  let db = loadDb(ctx)
  let t = dbTotals(db, ctx)
  let html = ''
    + '<div class="er-panel">'
    + '<div class="er-panel-top"><span class="er-mark-sm">' + MARK_TILE + '</span><b>磨耳朵电台</b><em>ON AIR</em></div>'
    + '<div class="er-panel-kpis">'
    + '<span class="pk"><b>' + fmtMins(t.todaySecs) + '</b><i>今日收听</i></span>'
    + '<span class="pk"><b>' + t.due + '</b><i>待复习</i></span>'
    + '<span class="pk"><b>' + t.tracks + '</b><i>节目单</i></span>'
    + '</div>'
    + '<p class="er-panel-stage">' + esc(t.due ? '有 ' + t.due + ' 项到期，戴上耳机就能清' : (t.newCount ? t.newCount + ' 项新料等着首播' : '今天没有到期，去备播台逛一圈？')) + '</p>'
    + '<div class="er-panel-acts"><button class="btn btn-sm btn-primary" data-p="open">打开电台</button></div>'
    + '</div>'
  if (box) {
    box.innerHTML = html
    let b1 = box.querySelector('[data-p="open"]')
    if (b1) b1.onclick = function () { try { ctx.api.goTool(TOOL_ID) } catch (e) { try { window.App && window.App.go(TOOL_ID) } catch (e2) { } } }
  }
  return html
}

/* 教练技能 */
let SKILLS = [
  {
    trigger: '听背',
    title: '通勤听背处方',
    summary: '按到期队列与弱项，开一档今天该听的节目单',
    when: '用户说「路上想复习 / 磨耳朵 / 听背」时',
    prompt: '你是磨耳朵电台的节目编排。先取 [[QUERY:due-queue]] 看到期与弱项：'
      + '若到期 >= 8 项，建议直接进电台「待复习」页点开播（自动按弱项优先排序）；'
      + '若到期很少，问用户想听哪科，去备播台勾 10~20 项建一档节目（一档 = 一段通勤约 20~30 分钟）。'
      + '提醒：自评要诚实，「有点模糊」会被标弱、下档优先重播；免手控模式超时只记跳过，不代打「听出来了」。'
  }
]

/* 插件间服务：外部（如刷题场/教练台）可查可投料 */
let SERVICES = {
  summary: function (ctx) {
    let t = dbTotals(loadDb(ctx), ctx)
    return { tracks: t.tracks, due: t.due, weak: t.weak, newCount: t.newCount, todaySecs: t.todaySecs }
  },
  /** 投一对「提问—答案」进自建库；重复/超限返回 null */
  addCustom: function (ctx, pair) {
    pair = pair || {}
    if (!String(pair.cue || '').trim()) return null
    let db = loadDb(ctx)
    if (db.custom.length >= MAX_CUSTOM) return null
    let dup = db.custom.some(function (c) { return c.cue === String(pair.cue).trim() })
    if (dup) return null
    let c = normCustom({ cue: pair.cue, ans: pair.ans, subject: pair.subject })
    db.custom.unshift(c)
    saveDb(ctx, db)
    return c.id
  }
}

/* e10: 语音通道层（系统音色 / OpenAI 兼容接口 / Azure 语音）
 * ---------------------------------------------------------------
 * 为什么：浏览器内置 Web Speech 音色机械。免费且能纯前端直连的高品质通道有两条：
 *   ① OpenAI 兼容 /v1/audio/speech —— 覆盖自建 edge-tts 代理（微软神经音色、免费）、
 *      Coqui/Kokoro 自托管、one-api/LiteLLM 网关；
 *   ② Azure Speech REST —— 官方支持浏览器直调，F0 档每月 50 万字符神经音色免费。
 * 红线：key 只进 ctx.keep（localStorage），绝不进 ctx.data/云同步（与 PAT 同规则）；
 * 任何失败自动降级系统音色，绝不断播。 */
let VP_AUDIO = null
let VP_CACHE = [] /* [{k,url}] 合成结果 LRU，上限 40 条（blob url 要 revoke） */
function vpCacheGet(k) {
  for (let i = 0; i < VP_CACHE.length; i++) {
    if (VP_CACHE[i].k === k) {
      let u = VP_CACHE[i].url
      VP_CACHE.push(VP_CACHE.splice(i, 1)[0])
      return u
    }
  }
  return null
}
function vpCachePut(k, url) {
  VP_CACHE.push({ k: k, url: url })
  while (VP_CACHE.length > 40) {
    let old = VP_CACHE.shift()
    try { URL.revokeObjectURL(old.url) } catch (e) { }
  }
}
function vpStop() {
  try { if (VP_AUDIO) { VP_AUDIO.pause(); VP_AUDIO = null } } catch (e) { }
}
function voiceCfg(ctx) {
  try {
    let k = ctx.keep.get('voiceCfg', null)
    return (k && typeof k === 'object' && k.mode) ? k : null
  } catch (e) { return null }
}
function vpModeLabel(cfg) {
  if (!cfg || !cfg.mode || cfg.mode === 'system') return '系统音色'
  return cfg.mode === 'azure' ? 'AI 音色 · Azure' : 'AI 音色 · OpenAI 兼容'
}
/* 合成一段文本 → blob URL。voiceOf 可覆盖默认音色（中英双音色用）。 */
function synthesize(text, cfg, voiceOf) {
  let voice = String(voiceOf || cfg.voice || '')
  let speed = cfg.speed ? clamp(Number(cfg.speed), 0.5, 2) : 0
  let ck = [cfg.mode, cfg.base || cfg.region || '', cfg.model || '', voice, speed, text].join('|')
  let hit = vpCacheGet(ck)
  if (hit) return Promise.resolve(hit)
  if (cfg.mode === 'azure') {
    let region = String(cfg.region || '').trim()
    let key = String(cfg.key || '').trim()
    if (!region || !key) return Promise.reject(new Error('Azure 区域或密钥未填'))
    let v = voice || 'zh-CN-XiaoxiaoNeural'
    let lang = v.slice(0, 5)
    let ratePct = speed ? Math.round((speed - 1) * 100) : 0
    let ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="' + esc(lang) + '">'
      + '<voice name="' + esc(v) + '"><prosody rate="' + (ratePct >= 0 ? '+' : '') + ratePct + '%">' + esc(text) + '</prosody></voice></speak>'
    return fetch('https://' + encodeURIComponent(region) + '.tts.speech.microsoft.com/cognitiveservices/v1', {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        'User-Agent': 'ear-radio-plugin'
      },
      body: ssml
    }).then(function (r) {
      if (!r.ok) throw new Error('Azure HTTP ' + r.status)
      return r.blob()
    }).then(function (b) {
      let u = URL.createObjectURL(b)
      vpCachePut(ck, u)
      return u
    })
  }
  /* openai 兼容：POST {base}/audio/speech */
  let base = String(cfg.base || '').replace(/\/+$/, '')
  if (!base) return Promise.reject(new Error('接口地址未填'))
  let body = { model: String(cfg.model || 'tts-1'), voice: voice || 'alloy', input: String(text), response_format: 'mp3' }
  if (speed) body.speed = speed
  let h = { 'Content-Type': 'application/json' }
  if (cfg.key) h.Authorization = 'Bearer ' + String(cfg.key)
  return fetch(base + '/audio/speech', { method: 'POST', headers: h, body: JSON.stringify(body) })
    .then(function (r) {
      if (!r.ok) return r.text().then(function (t) { throw new Error('HTTP ' + r.status + ' ' + String(t || '').slice(0, 60)) })
      return r.blob()
    }).then(function (b) {
      let u = URL.createObjectURL(b)
      vpCachePut(ck, u)
      return u
    })
}
function vpSpeak(text, cfg, voiceOf, onEnd, onError) {
  synthesize(text, cfg, voiceOf).then(function (url) {
    let a = new Audio(url)
    VP_AUDIO = a
    a.onended = function () { if (VP_AUDIO === a) VP_AUDIO = null; onEnd() }
    a.onerror = function () { onError('音频播放失败') }
    let pr = a.play()
    if (pr && pr.catch) pr.catch(function () { onError('自动播放被拦（先点一下页面）') })
  }, function (e) {
    onError(String((e && e.message) || e).slice(0, 80))
  })
}
/* ---- 配置弹窗（Modal.open 的 actions[].onClick(close) 契约） ---- */
function openVoiceCfgModal(ctx, done) {
  let c = (function () { try { return ctx.keep.get('voiceCfg', null) } catch (e) { return null } })() || { mode: 'system' }
  let fld = function (label, key, ph, type) {
    return '<label class="er-fld"><span>' + esc(label) + '</span><input class="er-input" data-vc="' + key + '"'
      + (type ? ' type="' + type + '"' : '') + ' placeholder="' + esc(ph) + '" value="' + esc(c[key] == null ? '' : c[key]) + '"></label>'
  }
  let html = '<div class="er-vcfg">'
    + '<p class="er-hint">内置浏览器音色偏机械。两条免费高品质路线：'
    + '<b>OpenAI 兼容</b>（自建 edge-tts 代理 / Coqui / one-api 网关都行）或 <b>Azure 语音</b>（F0 档每月 50 万字符神经音色免费，官方支持浏览器直调）。'
    + '密钥只存本机 localStorage，不进云同步；合成失败自动回退系统音色，绝不断播。</p>'
    + '<label class="er-fld"><span>通道</span><select class="er-input" data-vc="mode">'
    + ['system|系统音色（免配置）', 'openai|OpenAI 兼容接口', 'azure|Azure 语音'].map(function (o) {
      let p = o.split('|')
      return '<option value="' + p[0] + '"' + ((c.mode || 'system') === p[0] ? ' selected' : '') + '>' + p[1] + '</option>'
    }).join('') + '</select></label>'
    + '<label class="er-fld"><span>音色预设（一键填入下面两栏）</span><select class="er-input" data-vc-preset><option value="">— 自定义 —</option>'
    + [['微软·晓晓（中文女·神经）', 'zh-CN-XiaoxiaoNeural', 'en-US-AriaNeural'],
       ['微软·云希（中文男·神经）', 'zh-CN-YunxiNeural', 'en-US-GuyNeural'],
       ['微软·晓伊（温柔女声）', 'zh-CN-XiaoyiNeural', 'en-US-JennyNeural'],
       ['OpenAI 内置（nova）', 'nova', 'nova']].map(function (p) {
      return '<option value="' + esc(p[1] + '|' + p[2]) + '">' + esc(p[0]) + '</option>'
    }).join('') + '</select></label>'
    + '<div class="er-fldrow">' + fld('接口地址（OpenAI 兼容）', 'base', 'https://你的代理或网关', 'text') + fld('密钥 / API Key', 'key', 'sk-… 或 Azure Key', 'password') + '</div>'
    + '<div class="er-fldrow">' + fld('model', 'model', 'tts-1 / tts-1-hd', 'text') + fld('Azure 区域', 'region', 'eastasia / 你的区域', 'text') + '</div>'
    + '<div class="er-fldrow">' + fld('默认音色', 'voice', 'edge: zh-CN-XiaoxiaoNeural；OpenAI: alloy/nova', 'text') + fld('英文音色（可空）', 'voiceEn', 'en-US-AriaNeural / onyx', 'text') + '</div>'
    + '<div class="er-fldrow">' + fld('语速倍率（可空）', 'speed', '0.5~2.0，如 1.1', 'text') + '</div>'
    + '</div>'
  let read = function () {
    let box = document.querySelector('.er-vcfg')
    let g = function (k) { let e = box && box.querySelector('[data-vc="' + k + '"]'); return e ? String(e.value || '').trim() : '' }
    return { mode: g('mode') || 'system', base: g('base'), key: g('key'), model: g('model'), region: g('region'), voice: g('voice'), voiceEn: g('voiceEn'), speed: g('speed') }
  }
  ctx.Modal.open({
    title: '语音通道设置', wide: true, html: html,
    actions: [
      {
        label: '试听', kind: 'btn-ghost', onClick: function () {
          let cfg = read()
          if (!cfg.mode || cfg.mode === 'system') {
            try { window.Tts && window.Tts.speak('磨耳朵电台，测试成功', { rate: 1 }) } catch (e) { }
            return
          }
          synthesize('磨耳朵电台，测试成功', cfg, cfg.voice).then(function (u) {
            try { let a = new Audio(u); a.play() } catch (e) { }
          }, function (e) { ctx.Toast.show('试听失败：' + String(e.message || e), 'warn', 4000) })
        }
      },
      { label: '取消', kind: 'btn-ghost', onClick: function (close) { close() } },
      {
        label: '保存', kind: 'btn-primary', onClick: function (close) {
          let cfg = read()
          try { ctx.keep.set('voiceCfg', cfg) } catch (e) { }
          close()
          if (done) done()
        }
      }
    ]
  })
  /* 预设联动（Modal 是同步挂载，open 返回后 DOM 已在）：选预设即填两栏音色 */
  try {
    let ps = document.querySelector('[data-vc-preset]')
    if (ps) ps.onchange = function () {
      let val = String(ps.value || '')
      if (!val) return
      let p = val.split('|')
      let v = document.querySelector('.er-vcfg [data-vc="voice"]')
      let ve = document.querySelector('.er-vcfg [data-vc="voiceEn"]')
      if (v) v.value = p[0]
      if (ve) ve.value = p[1]
    }
  } catch (e) { }
}

/* e9: 注册（manifest）+ 调试钩子 + 收尾 */
let api = {
  id: TOOL_ID,
  name: '磨耳朵电台',
  version: VERSION,
  author: 'kaoyan-v2',
  desc: '把政治背诵卡/英语单词/作文好句/自建脚本编成「提问→留白默答→答案」的挖空广播：通勤戴上耳机刷背诵，听完三档自评自动走站内 Spaced 排期，弱项下档优先重播。语音收口 core/tts，浏览器不支持时降级静音跟读，闭环照走。',
  memory: '磨耳朵电台：用户把站内背诵素材编成挖空广播用耳朵刷；节目单/排期状态/自建脚本存插件命名空间。教练问「听背/通勤复习/该听什么」可引用 due-queue 查询。',
  tools: [
    {
      id: TOOL_ID, title: '磨耳朵电台', icon: MARK_TILE,
      mount: function (el, ctx) { return mountShell(el, ctx) }
    }
  ],
  panels: [
    { id: 'er-stock', title: '磨耳朵电台 · 频率', icon: MARK_TILE, width: 300, height: 250, render: panelRender }
  ],
  skills: SKILLS,
  services: SERVICES,
  init: function (ctx) {
    HOST_CTX = ctx
    try {
      if (ctx.ai && typeof ctx.ai.registerCtx === 'function') {
        ctx.ai.registerCtx({
          ctx: AI_CTX_SCRIPT,
          name: '电台 · 挖空脚本生成',
          desc: '把长文拆成「提问—答案」播报对（手填分段为降级）',
          def: 'noThink', latexNeed: false, tools: 'none', recall: false
        })
      }
    } catch (e) { }
    try {
      ctx.log('磨耳朵电台 v' + VERSION + ' 就绪（TTS ' + (ttsOk() ? '可用' : '不支持，将走静音跟读') + '；AI ' + (aiOk(ctx) ? '可拆稿' : '未配置，本地分段') + '）')
    } catch (e) { }
  },
  config: [
    { key: 'defaultRate', label: '默认语速', type: 'number', default: 1, desc: '0.6~1.6；直播间可实时调' },
    { key: 'defaultGap', label: '默认留白秒', type: 'number', default: 8, desc: '提问后默想时长 3~20 秒' },
    { key: 'handsfree', label: '默认免手控', type: 'bool', default: false, desc: '开启后点评超时自动记「跳过」，绝不代打「听出来了」' }
  ],
  queries: [
    {
      key: 'due-queue', label: '电台待复习账（到期/弱项/新料/今日分钟）',
      run: function (ctx) {
        let db = loadDb(ctx)
        let t = dbTotals(db, ctx)
        if (!t.feeds) return '电台还没有可播素材（政治卡/单词/好句/自建都是空的）。'
        let s = '待复习 ' + t.due + ' 项，弱项 ' + t.weak + ' 项，新料 ' + t.newCount + ' 项；今日已听 ' + fmtMins(t.todaySecs) + '（' + t.todayItems + ' 条）；节目单 ' + t.tracks + ' 档。'
        if (t.due >= 8) s += '到期不少，建议开一档「复习」节目清一清。'
        return s
      }
    },
    {
      key: 'station-ledger', label: '电台流水（最近几档播了什么、成绩如何）',
      run: function (ctx) {
        let db = loadDb(ctx)
        if (!db.sessions.length) return '还没有完整的收听流水（一档节目播完会记一条）。'
        return db.sessions.slice(0, 5).map(function (s) {
          return fmtDate(String(s.at).slice(0, 10)) + '《' + (s.trackName || '即席') + '》' + s.played + ' 项，听出 ' + s.ok + '、没听出 ' + s.no + (s.skip ? '、跳过 ' + s.skip : '')
        }).join('；') + '。'
      }
    }
  ],
  shortcuts: [
    {
      key: 'alt+r', label: '直达磨耳朵电台',
      run: function (ctx) {
        try {
          if (ctx && ctx.api && ctx.api.goTool) ctx.api.goTool(TOOL_ID)
          else if (window.App) window.App.go(TOOL_ID)
        } catch (e) { }
      }
    }
  ],
  css: CSS
}

/* 调试钩子：纯判据直打，不驱动 DOM */
if (window.__ERRADIO_DEBUG__) {
  window.__eradioInternals = {
    esc, clamp, shortText, fmtMins, dkey, todayKey, addDays,
    SOURCES, VIEWS, emptyDb, normDb, normTrack, normCustom, normState, normSession,
    itemKey, dueKeys, sortQueue, splitScript, parseScriptPairs, dbTotals, last14, weakTop,
    feedItems, trackQueue, buildReport, srcOf,
    synthesize, vpModeLabel, voiceCfg,
    makeEngine, MAX_ITEMS_PER_TRACK, MAX_CUSTOM, TOOL_ID, VERSION,
    CSS_LEN: CSS.length, CSS_EXTRA_LEN: CSS_EXTRA.length
  }
}

PluginBus.register(api)
})()
