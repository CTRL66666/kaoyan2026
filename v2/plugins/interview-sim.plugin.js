/* ============================================================
 * interview-sim.plugin.js — 复试模拟舱（单文件插件）· v1.0.0
 * ------------------------------------------------------------
 * 干什么：考研复试/面试的多轮 AI 压力模拟。考官基于你的回答层层追问，
 *         结束后按四维 rubric 出成绩单，会话存编年史可回放。
 *
 * 与「记忆宫殿 · 闪卡」同一套工程纪律：
 *   · 零外部依赖，只用插件公开契约（ctx.* / window / document），不碰站点内部全局；
 *   · 样式全走站点设计令牌；样式注入用单例 <style>（绕开 manifest css 字段 20K 截断）；
 *   · 吸顶页眉复用原生模块机制：root 撑满整页 → hero 直挂 root sticky top:0，
 *     祖先零 overflow:hidden，window scroll 监听切压缩两态。
 *
 * 状态机：console（控制台）→ room（面试间）→ report（成绩单）→ console。
 *   追问深度由「压力档位」控制；轮数到点或考生主动交卷 → rubric 评分。
 *
 * AI 调用两路：
 *   · 对话：ctx.ai.stream（流式，考官气泡逐字出现）——追问逻辑全在 system 提示词；
 *   · 评分：ctx.AI.chatJSON（结构化 rubric，入参 transcript 全文）。
 *
 * 安装：插件中心 →「粘贴导入」→ 选择本文件（.js）。
 * ============================================================ */
;(function () {
  'use strict'

  /* ════════════════════════ 0. 常量与元信息 ════════════════════════ */

  let VERSION = '1.2.0'
  /* 【站内适配 2026-10-22】AI ctx 必须落在 `plugin.<完整 pid>.<场景>` 才能进站内 AI 注册表
   * （`plugin.ivs` 只有两段，registerAiCtx 会拒）。分开两条是刻意的：
   *   对话要「逐字出、不等思考」→ noThink；评分要「严谨、可复核」→ think。
   * 注册后这两个场景就吃得到站内「设置 → AI 思考模式」的逐场景配置与用量分桶。 */
  let AI_CTX_CHAT = 'plugin.interview-sim.chat'
  let AI_CTX_SCORE = 'plugin.interview-sim.score'
  let T_MAIN = 'interview-sim'

  /* 编年史闸：会话（含 transcript）随 Store 云同步，必须限条数限体积 */
  let SESSION_MAX = 30
  let TURN_MAX = 60              // 单场对话轮数硬顶（防 AI 无限扯皮）
  let TRANSCRIPT_CHARS = 12000   // 送评分的 transcript 总字数上限（超出截头）
  let ANSWER_MAX = 2000          // 单条考生回答字数上限

  /* 压力档位 → 考官人格指令（只描述行为风格，不写具体院校/专业内容） */
  let PRESSURES = {
    '温和': '你是鼓励型考官：语气友善，给考生留台阶；但仍要考察真实水平，追问止于两层。',
    '标准': '你是标准复试考官：就事论事，回答有漏洞必须指出并追问一层，不打断不闲聊。',
    '压力': '你是压力型考官：刻意质疑每个论点的依据（"凭什么""具体例子？"），'
      + '遇到空话套话当场戳穿并连续追问，语气严肃但问题始终围绕专业，不进行人身评价。'
  }

  /* 面试模式：考察范围脚本（写进考官人设） */
  let MODES = {
    '专业面': '【考察范围】专业基础、核心课程概念、毕业设计/科研项目深挖。',
    '综合面': '【考察范围】读研动机、学习规划、团队协作、抗压与沟通 —— 少问纯知识，多问「你具体怎么做」。',
    '英语面': '【考察范围】English interview：self-introduction、academic background、research interests、future plans。'
      + '全程用英语提问与追问（考生也用英语回答），问题由浅入深。'
  }
  let PITCH_SECS = 60            /* 自我介绍专项：陈述限时 */
  let PITCH_DIMS = [
    { key: 'structure', label: '结构', desc: '开场-主体-收尾是否完整' },
    { key: 'content', label: '内容', desc: '亮点具体、与方向相关' },
    { key: 'language', label: '语言', desc: '简洁有力、无口头语' }
  ]

  /* 评分维度（rubric 固定四轴；AI 只负责打分与点评，结构由插件钉死） */
  let DIMS = [
    { key: 'professional', label: '专业深度', desc: '知识准确性与体系感' },
    { key: 'logic', label: '逻辑结构', desc: '论证是否闭环、有条理' },
    { key: 'expression', label: '语言表达', desc: '清晰、简洁、有分寸' },
    { key: 'composure', label: '临场应变', desc: '被追问时不慌、能自洽' }
  ]

  /* 各维度薄弱时的离线复盘建议（避免为建议再调一次 AI；规则化、可预期） */
  let ADVICE = {
    professional: '把复试高频考点按「定义 → 原理 → 应用 → 局限」四格各写一页纸，面试时用体系感弥补单点记忆。',
    logic: '练习「结论先行」：每轮回答先给观点，再用「第一/第二/第三」铺论据，最后一句回扣问题。',
    expression: '掐表录音练 2 分钟自述：删掉口头语（然后/就是/嗯），每句话只保留一个主干。',
    composure: '预演「被打断」场景：让同学随机追问一个你答不上的点，练「承认边界 + 给出思路」的标准应对。'
  }

  /* 平均分走势折线（编年史最新在前 → 反转为时间序） */
  function trendSpark(list, w, h) {
    let series = list.slice(0, 20).reverse().map(function (s) { return num(s.total, 0) }).filter(function (v) { return v > 0 })
    w = w || 240; h = h || 48
    if (series.length < 2) return ''
    let min = Math.min.apply(null, series), max = Math.max.apply(null, series)
    let span = (max - min) || 1
    let pts = series.map(function (v, i) {
      let x = (i / (series.length - 1)) * (w - 8) + 4
      let y = h - 6 - ((v - min) / span) * (h - 12)
      return x.toFixed(1) + ',' + y.toFixed(1)
    })
    let last = pts[pts.length - 1].split(',')
    return '<svg class="ivs-spark" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" role="img" aria-label="平均分走势">'
      + '<polyline points="' + pts.join(' ') + '" fill="none" stroke="var(--iv-acc)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
      + '<circle cx="' + last[0] + '" cy="' + last[1] + '" r="3.2" fill="var(--iv-acc2)"/></svg>'
  }

  /* 最薄弱的 1-2 个维度（<70 分，按分数升序），附离线建议 */
  function adviceFor(report) {
    if (!report || !report.scores) return []
    return DIMS.map(function (d) {
      return { dim: d, score: clamp(num(report.scores[d.key], 0), 0, 100) }
    }).filter(function (x) { return x.score < 70 })
      .sort(function (a, b) { return a.score - b.score })
      .slice(0, 2)
      .map(function (x) { return { label: x.dim.label, score: x.score, tip: ADVICE[x.dim.key] || '' } })
  }

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
  function uid(p) { return (p || 's') + Date.now().toString(36) + Math.random().toString(36).slice(2, 7) }
  function dkey(t) {
    let d = t ? new Date(t) : new Date()
    let m = String(d.getMonth() + 1), day = String(d.getDate())
    return d.getFullYear() + '-' + (m.length < 2 ? '0' + m : m) + '-' + (day.length < 2 ? '0' + day : day)
  }
  function fmtTime(ts) {
    let d = new Date(ts)
    return dkey(ts) + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
  }
  function debounce(fn, ms) {
    let t = null
    return function () {
      let args = arguments, self = this
      clearTimeout(t)
      t = setTimeout(function () { fn.apply(self, args) }, ms)
    }
  }
  /* 事件委托：容器内 [data-act] 点击统一分发 */
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
  function countUp(el, target, ms) {
    let t0 = null
    function step(t) {
      if (!t0) t0 = t
      let p = clamp((t - t0) / (ms || 700), 0, 1)
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }
  function aiStream(ctx, sys, usr, onChunk, opts) {
    /* 流式出口统一走 ctx.ai.stream（文档契约）；失败转成 reject 由调用方呈现 */
    if (!ctx.ai || typeof ctx.ai.stream !== 'function') return Promise.reject(new Error('AI 流式接口不可用'))
    return ctx.ai.stream(sys, usr, onChunk, Object.assign({ ctx: AI_CTX_CHAT, noTools: true }, opts || {}))
  }
  function aiJSON(ctx, sys, usr, opts) {
    if (!ctx.AI || typeof ctx.AI.chatJSON !== 'function') return Promise.reject(new Error('AI 接口不可用'))
    return ctx.AI.chatJSON(sys, usr, null, Object.assign({ ctx: AI_CTX_SCORE, noTools: true, cache: false }, opts || {}))
  }
  function aiReady(ctx) {
    try { return !!(ctx.AI && typeof ctx.AI.chatJSON === 'function' && ctx.AI.configured()) } catch (e) { return false }
  }

  /* ════════════════════════ 2. 数据层（编年史 + 站内资料库只读桥） ════════════════════════ */

  function sessionsGet(ctx) {
    let l = ctx.data('sessions')
    return Array.isArray(l) ? l.filter(function (s) { return s && s.id && Array.isArray(s.transcript) }) : []
  }
  function sessionSave(ctx, sess) {
    let l = sessionsGet(ctx)
    l.unshift(sess)
    ctx.data('sessions', l.slice(0, SESSION_MAX))
  }

  /* v1.2 资料库材料包：官方桥 = ctx.Store（pluginbus 全量上下文），只读 + 防御。
   * 选一本书后，考官 prompt 追加讲义节选 —— 专业课复试围绕考生自己的材料提问。 */
  function nativeBooks(ctx) {
    try { let s = ctx.Store.get(); return (s && Array.isArray(s.studyBooks)) ? s.studyBooks : [] } catch (e) { return [] }
  }
  /* 书 → 讲义节选：章节标题 + 正文拼接，封顶 2400 字防 token 爆炸 */
  function bookExcerpt(book) {
    if (!book) return ''
    let txt = (book.chapters || []).map(function (c) {
      return (c && flat(c.title)) + '\n' + (c && Array.isArray(c.content) ? c.content.join('\n') : '')
    }).join('\n')
    return trunc(txt.replace(/\n{3,}/g, '\n\n'), 2400)
  }
  function findBook(ctx, id) {
    if (!id) return null
    let list = nativeBooks(ctx)
    for (let i = 0; i < list.length; i++) if (list[i] && list[i].id === id) return list[i]
    return null
  }

  /* 纯统计：平均分 / 场次 / 最佳（报告页与页眉 chips 共用口径） */
  function statsOf(list) {
    let n = list.length, avg = null, best = null
    if (n) {
      let sum = 0, cnt = 0
      list.forEach(function (s) {
        if (s.total != null) { sum += s.total; cnt++ }
        if (best == null || (s.total != null && s.total > best.total)) best = s
      })
      avg = cnt ? Math.round(sum / cnt) : null
    }
    return { n: n, avg: avg, best: best }
  }

  /* ════════════════════════ 3. 样式（注入 <style>，单例） ════════════════════════ */

  let CSS = [
    '.ivs-root{--iv-acc:var(--blue,#2563eb);--iv-acc2:var(--purple,#7c3aed);--iv-ink:var(--text-primary,#1e2a4a);'
      + '--iv-sub:var(--text-muted,#7c8aa8);--iv-ink2:var(--text-secondary,#4a5670);--iv-line:var(--line,#d8dde8);'
      + '--iv-bg:var(--surface,#fff);--iv-soft:var(--surface-muted,#f6f8fc);--iv-ok:var(--ok,#0f7c4a);'
      + '--iv-warn:var(--warn,#c47615);--iv-danger:var(--danger,#d83b3b);--iv-ease:cubic-bezier(.22,.8,.26,1);'
      + 'color:var(--iv-ink);font:14px/1.65 "PingFang SC","Microsoft YaHei",system-ui,sans-serif;'
      + 'margin:calc(var(--vp-t,16px)*-1) calc(var(--vp-x,16px)*-1) calc(var(--vp-b,24px)*-1);'
      + 'min-height:calc(100vh - 59px);display:flex;flex-direction:column;background:var(--iv-soft)}',
    /* 吸顶页眉（机制与原生模块逐条对齐：hero 直挂 root、祖先零 overflow、scroll 切压缩态） */
    '.ivs-hero{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:14px;flex-wrap:wrap;'
      + 'padding:14px calc(var(--vp-x,16px) + 18px);border:0;border-bottom:1px solid var(--iv-line);border-radius:0;'
      + 'background:color-mix(in oklab,var(--iv-bg) 84%,transparent);'
      + 'backdrop-filter:blur(18px) saturate(1.5);-webkit-backdrop-filter:blur(18px) saturate(1.5);'
      + 'box-shadow:0 1px 0 rgba(20,35,70,.03);max-height:150px;overflow:hidden;'
      + 'transition:padding .3s var(--iv-ease),box-shadow .3s var(--iv-ease),max-height .34s var(--iv-ease)}',
    '.ivs-hero.ivs-stuck{padding-top:8px;padding-bottom:8px;box-shadow:0 10px 26px -14px rgba(30,36,90,.28)}',
    /* 徽标：渐变方块 + 声波纹呼吸（面试=对话的语义） */
    '.ivs-mark{width:46px;height:46px;border-radius:15px;flex:0 0 auto;color:#fff;'
      + 'background:linear-gradient(135deg,var(--iv-acc),var(--iv-acc2));display:flex;align-items:center;justify-content:center;'
      + 'box-shadow:0 6px 18px color-mix(in oklab,var(--iv-acc) 35%,transparent);'
      + 'transition:width .3s var(--iv-ease),height .3s var(--iv-ease),border-radius .3s var(--iv-ease);animation:ivs-breathe 3.4s ease-in-out infinite}',
    '.ivs-mark svg{width:24px;height:24px}',
    '.ivs-hero.ivs-stuck .ivs-mark{width:34px;height:34px;border-radius:11px}',
    '@keyframes ivs-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}',
    '.ivs-titles{flex:1;min-width:150px}',
    '.ivs-title{font-size:19px;font-weight:800;letter-spacing:.3px;display:flex;align-items:center;gap:8px}',
    '.ivs-title em{font-style:normal;font-size:11px;font-weight:700;padding:2px 9px;border-radius:999px;'
      + 'background:var(--iv-soft);color:var(--iv-sub);border:1px solid var(--iv-line)}',
    '.ivs-sub2{font-size:12px;color:var(--iv-sub);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.ivs-chips{display:flex;gap:7px;flex-wrap:wrap}',
    '.ivs-hchip{font-size:11.5px;padding:4px 11px;border-radius:999px;border:1px solid var(--iv-line);'
      + 'background:color-mix(in oklab,var(--iv-bg) 70%,transparent);color:var(--iv-sub);white-space:nowrap}',
    '.ivs-hchip b{color:var(--iv-ink);font-size:12.5px;margin:0 2px}',
    '.ivs-hchip.live{border-color:color-mix(in oklab,var(--iv-danger) 40%,transparent);color:var(--iv-danger);animation:ivs-pulse 1.4s ease-in-out infinite}',
    '@keyframes ivs-pulse{0%,100%{opacity:1}50%{opacity:.55}}',
    /* 【站内适配 2026-10-22】原本写死 max-width:1080px（作者按独立宿主的窄栏设计）。
     * 站点工作台内容轨 = min(1440 应用宽 − 236 侧栏 − 64 边距) = 1140，且满幅页已解除限宽，
     * 自带限宽会额外缩 60px、与页眉左边缘错开。改为吃宿主轨：不越界，也不再自缩。 */
    '.ivs-body{flex:1 1 auto;width:100%;max-width:100%;margin:0 auto;box-sizing:border-box;'
      + 'padding:20px calc(var(--vp-x,16px) + 18px) 46px}',
    '.ivs-card{background:var(--iv-bg);border:1px solid var(--iv-line);border-radius:16px;padding:18px;margin-bottom:14px;'
      + 'box-shadow:0 8px 24px rgba(20,35,70,.05);animation:ivs-rise .42s var(--iv-ease) both;animation-delay:calc(var(--i,0)*45ms)}',
    '@keyframes ivs-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}',
    '.ivs-h{font-size:16px;font-weight:800;margin:0 0 4px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}',
    '.ivs-h em{font-style:normal;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;'
      + 'background:var(--iv-soft);color:var(--iv-sub);border:1px solid var(--iv-line)}',
    '.ivs-desc{color:var(--iv-sub);font-size:12.5px;line-height:1.75;margin-bottom:13px}',
    /* 控制台表单 */
    '.ivs-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px;margin-bottom:13px}',
    '.ivs-f{display:flex;flex-direction:column;gap:5px;font-size:12px;color:var(--iv-sub)}',
    '.ivs-input,.ivs-sel,.ivs-ta{height:36px;border:1px solid var(--iv-line);border-radius:10px;padding:0 11px;'
      + 'background:var(--iv-bg);color:var(--iv-ink);outline:none;font-size:13px;font-family:inherit;box-sizing:border-box;'
      + 'transition:border-color .16s,box-shadow .16s}',
    '.ivs-input:focus,.ivs-sel:focus,.ivs-ta:focus{border-color:var(--iv-acc);box-shadow:0 0 0 3px color-mix(in oklab,var(--iv-acc) 14%,transparent)}',
    '.ivs-ta{width:100%;min-height:74px;padding:10px;resize:vertical;line-height:1.7}',
    '.ivs-btn{height:36px;padding:0 15px;border-radius:10px;border:1px solid var(--iv-line);background:var(--iv-bg);'
      + 'cursor:pointer;font-weight:600;font-size:13px;color:var(--iv-ink2);font-family:inherit;position:relative;overflow:hidden;'
      + 'transition:transform .12s,border-color .16s,color .16s,box-shadow .16s,filter .16s}',
    '.ivs-btn:hover:not(:disabled){border-color:var(--iv-acc);color:var(--iv-acc);box-shadow:0 4px 12px rgba(37,99,235,.14);transform:translateY(-1px)}',
    '.ivs-btn:active:not(:disabled){transform:translateY(1px)}',
    '.ivs-btn:disabled{opacity:.45;cursor:not-allowed}',
    '.ivs-btn.primary{background:linear-gradient(135deg,var(--iv-acc),var(--iv-acc2));color:#fff;border:0;'
      + 'box-shadow:0 6px 16px color-mix(in oklab,var(--iv-acc) 30%,transparent)}',
    '.ivs-btn.primary:hover:not(:disabled){color:#fff;filter:brightness(1.06)}',
    '.ivs-btn.primary::after{content:"";position:absolute;top:0;left:-80%;width:50%;height:100%;'
      + 'background:linear-gradient(100deg,transparent,rgba(255,255,255,.35),transparent);transform:skewX(-20deg)}',
    '.ivs-btn.primary:hover::after{left:130%;transition:left .6s ease}',
    '.ivs-btn.danger{color:var(--iv-danger);border-color:color-mix(in oklab,var(--iv-danger) 30%,transparent)}',
    '.ivs-btn.sm{height:30px;padding:0 11px;font-size:12px;border-radius:9px}',
    '.ivs-note{font-size:12px;color:var(--iv-sub);line-height:1.8;margin-top:9px}',
    /* 压力档位分段器 */
    '.ivs-seg{display:inline-flex;background:var(--iv-soft);border:1px solid var(--iv-line);border-radius:11px;padding:3px;gap:2px}',
    '.ivs-seg button{border:0;background:none;font:600 12px/1 inherit;padding:7px 14px;border-radius:8px;cursor:pointer;'
      + 'color:var(--iv-sub);font-family:inherit;flex:none;white-space:nowrap;transition:all .18s}',
    '.ivs-seg button.on{background:var(--iv-bg);color:var(--iv-acc);box-shadow:0 1px 4px rgba(16,30,60,.12)}',
    /* ── 面试间（聊天） ── */
    '.ivs-room{display:flex;flex-direction:column;gap:0;height:calc(100vh - 300px);min-height:380px}',
    '.ivs-msgs{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:12px;padding:6px 4px 12px;scroll-behavior:smooth}',
    '.ivs-msg{display:flex;gap:10px;max-width:88%;animation:ivs-rise .34s var(--iv-ease) both}',
    '.ivs-msg.user{align-self:flex-end;flex-direction:row-reverse}',
    '.ivs-ava{width:36px;height:36px;border-radius:12px;flex:0 0 auto;display:flex;align-items:center;justify-content:center;'
      + 'font-size:17px;color:#fff;background:linear-gradient(135deg,var(--iv-acc),var(--iv-acc2));'
      + 'box-shadow:0 4px 12px color-mix(in oklab,var(--iv-acc) 30%,transparent)}',
    '.ivs-msg.user .ivs-ava{background:var(--iv-soft);color:var(--iv-ink2);border:1px solid var(--iv-line);box-shadow:none}',
    '.ivs-bubble{padding:11px 14px;border-radius:14px;font-size:13.5px;line-height:1.75;white-space:pre-wrap;word-break:break-word}',
    '.ivs-msg.prof .ivs-bubble{background:var(--iv-soft);border:1px solid var(--iv-line);border-top-left-radius:4px}',
    '.ivs-msg.user .ivs-bubble{background:linear-gradient(135deg,var(--iv-acc),var(--iv-acc2));color:#fff;border-top-right-radius:4px}',
    /* 打字指示器（三点弹跳） */
    '.ivs-typing{display:inline-flex;gap:4px;padding:13px 15px;background:var(--iv-soft);border:1px solid var(--iv-line);border-radius:14px;border-top-left-radius:4px}',
    '.ivs-typing i{width:6px;height:6px;border-radius:50%;background:var(--iv-sub);animation:ivs-dot 1.1s ease-in-out infinite}',
    '.ivs-typing i:nth-child(2){animation-delay:.15s}.ivs-typing i:nth-child(3){animation-delay:.3s}',
    '@keyframes ivs-dot{0%,100%{transform:translateY(0);opacity:.5}50%{transform:translateY(-4px);opacity:1}}',
    /* 流式光标 */
    '.ivs-cursor{display:inline-block;width:2px;height:1em;background:var(--iv-acc);margin-left:2px;vertical-align:-2px;animation:ivs-pulse .8s steps(2) infinite}',
    /* 输入区 */
    '.ivs-compose{display:flex;gap:9px;align-items:flex-end;border-top:1px solid var(--iv-line);padding-top:12px}',
    '.ivs-compose .ivs-ta{min-height:46px;max-height:140px;flex:1}',
    '.ivs-roombar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:11px}',
    '.ivs-round{font-size:12px;font-weight:700;color:var(--iv-acc);background:color-mix(in oklab,var(--iv-acc) 10%,transparent);'
      + 'border:1px solid color-mix(in oklab,var(--iv-acc) 28%,transparent);border-radius:999px;padding:3px 11px}',
    '.ivs-clock{font-size:12px;color:var(--iv-sub);font-variant-numeric:tabular-nums}',
    /* ── 成绩单 ── */
    '.ivs-scorebig{display:flex;align-items:baseline;gap:10px;margin:6px 0 14px}',
    '.ivs-scorebig b{font-size:52px;font-weight:800;line-height:1;background:linear-gradient(135deg,var(--iv-acc),var(--iv-acc2));'
      + '-webkit-background-clip:text;background-clip:text;color:transparent}',
    '.ivs-scorebig span{font-size:13px;color:var(--iv-sub)}',
    '.ivs-dim{margin-bottom:12px}',
    '.ivs-dim-h{display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:5px}',
    '.ivs-dim-h b{font-weight:700}.ivs-dim-h span{color:var(--iv-sub);font-size:11.5px}',
    '.ivs-track{height:10px;border-radius:999px;background:var(--iv-soft);border:1px solid var(--iv-line);overflow:hidden}',
    '.ivs-fill{height:100%;width:0;border-radius:999px;background:linear-gradient(90deg,var(--iv-acc),var(--iv-acc2));transition:width .9s var(--iv-ease)}',
    '.ivs-cmt{border-left:3px solid var(--iv-acc);background:color-mix(in oklab,var(--iv-acc) 6%,transparent);'
      + 'border-radius:0 10px 10px 0;padding:8px 12px;margin:8px 0;font-size:12.8px;line-height:1.75}',
    /* 平均分走势 + 离线复盘建议 */
    '.ivs-spark{display:block;margin:2px 0 10px}',
    '.ivs-advice{border:1px solid color-mix(in oklab,var(--iv-acc) 30%,var(--iv-line));border-radius:12px;'
      + 'padding:11px 13px;margin-top:9px;background:color-mix(in oklab,var(--iv-acc) 5%,transparent);'
      + 'animation:ivs-rise .35s var(--iv-ease) both}',
    '.ivs-advice b{font-size:13px}',
    '.ivs-advice b em{font-style:normal;color:var(--iv-danger);font-size:11px;margin-left:6px}',
    '.ivs-advice p{margin:4px 0 0;font-size:12.5px;line-height:1.75;color:var(--iv-ink2)}',
    /* 维度涨跌 + 自介专项计时 */
    '.ivs-delta{font-style:normal;font-weight:800;font-size:11px}',
    '.ivs-delta.up{color:var(--iv-ok)}.ivs-delta.down{color:var(--iv-danger)}',
    '.ivs-pitchbar{display:flex;align-items:center;gap:10px;margin:4px 0 12px}',
    '.ivs-pitchbar .ivs-track{flex:1}',
    '.ivs-fill.low{background:linear-gradient(90deg,var(--iv-warn),var(--iv-danger))}',
    '.ivs-pitcht{font-weight:800;font-size:13px;font-variant-numeric:tabular-nums;min-width:3em;text-align:right}',
    /* 编年史 */
    '.ivs-hist{display:flex;gap:11px;align-items:flex-start;padding:12px;border:1px solid var(--iv-line);border-radius:13px;'
      + 'margin-bottom:10px;background:var(--iv-bg);cursor:pointer;transition:border-color .16s,box-shadow .16s,transform .16s}'
      + ';animation:ivs-rise .36s var(--iv-ease) both;animation-delay:calc(var(--i,0)*40ms)}',
    '.ivs-hist:hover{border-color:color-mix(in oklab,var(--iv-acc) 45%,var(--iv-line));box-shadow:0 8px 20px rgba(20,35,70,.08);transform:translateY(-2px)}',
    '.ivs-hist .n{font-size:22px;font-weight:800;width:56px;flex:0 0 auto;text-align:center;border-radius:11px;'
      + 'background:var(--iv-soft);border:1px solid var(--iv-line);line-height:44px}',
    '.ivs-hist .b{flex:1;min-width:0}',
    '.ivs-hist .t{font-weight:700;font-size:13.5px}',
    '.ivs-hist .m{font-size:11.5px;color:var(--iv-sub);margin-top:2px}',
    /* 模态（回放用） */
    '.ivs-modal{position:fixed;inset:0;z-index:9000;display:none;place-items:center;padding:22px;'
      + 'background:rgba(10,16,30,.5);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}',
    '.ivs-modal.on{display:grid;animation:ivs-fade .2s ease both}',
    '.ivs-modal-box{width:min(680px,94vw);max-height:86vh;overflow:auto;background:var(--iv-bg);border:1px solid var(--iv-line);'
      + 'border-radius:18px;padding:20px;box-shadow:0 30px 70px rgba(10,20,45,.35);animation:ivs-pop .28s var(--iv-ease) both}',
    '@keyframes ivs-fade{from{opacity:0}to{opacity:1}}',
    '@keyframes ivs-pop{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:none}}',
    '.ivs-x{margin-left:auto}',
    '.ivs-empty{border:1.6px dashed var(--iv-line);border-radius:16px;padding:30px 18px;text-align:center;color:var(--iv-sub);font-size:13px}',
    '.ivs-empty b{display:block;font-size:16px;color:var(--iv-ink);margin-bottom:6px}',
    '.ivs-msg2{display:flex;gap:8px;margin-bottom:10px;font-size:12.8px;line-height:1.7}',
    '.ivs-msg2 .r{font-weight:800;flex:0 0 auto;font-size:11px;padding:2px 8px;border-radius:999px;height:fit-content}',
    '.ivs-msg2.prof .r{background:var(--iv-soft);color:var(--iv-sub);border:1px solid var(--iv-line)}',
    '.ivs-msg2.user .r{background:color-mix(in oklab,var(--iv-acc) 12%,transparent);color:var(--iv-acc)}',
    '@media (max-width:560px){.ivs-room{height:calc(100vh - 260px)}.ivs-msg{max-width:96%}'
      + '.ivs-scorebig b{font-size:42px}.ivs-hchip:nth-child(n+4){display:none}}',
    '@media (prefers-reduced-motion:reduce){.ivs-root *{animation:none!important;transition:none!important}}'
  ].join('\n')

  let STYLE_ID = 'ivs-styles'
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return
    let st = document.createElement('style')
    st.id = STYLE_ID
    st.textContent = CSS
    document.head.appendChild(st)
  }

  /* 页眉图标：声波/对话气泡（面试 = 对话） */
  let MARK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H8l-4 3V6a3 3 0 0 1 3-3h5z"/>'
    + '<path d="M16 8h1a3 3 0 0 1 3 3v4l2 1.5V11a5 5 0 0 0-5-5h-1"/>'
    + '<path d="M9.5 8.5v3M12.5 8.5v3"/></svg>'

  function heroChips(ctx, live) {
    let st = statsOf(sessionsGet(ctx))
    return '<span class="ivs-hchip">面试 <b>' + st.n + '</b> 场</span>'
      + '<span class="ivs-hchip">平均 <b>' + (st.avg == null ? '—' : st.avg) + '</b> 分</span>'
      + '<span class="ivs-hchip">最佳 <b>' + (st.best ? st.best.total : '—') + '</b></span>'
      + (live ? '<span class="ivs-hchip live">● 面试进行中</span>' : '')
  }

  function bindStuck(root) {
    let hero = root.querySelector('.ivs-hero')
    if (!hero) return function () { }
    function onScroll() {
      let on = (window.scrollY || window.pageYOffset || 0) > 12
      if (on !== hero.classList.contains('ivs-stuck')) hero.classList.toggle('ivs-stuck', on)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return function () { window.removeEventListener('scroll', onScroll) }
  }

  function openModal(html) {
    let wrap = document.createElement('div')
    wrap.className = 'ivs-modal'
    wrap.innerHTML = '<div class="ivs-modal-box">' + html + '</div>'
    document.body.appendChild(wrap)
    function onKey(ev) { if (ev.key === 'Escape') close() }
    function close() { window.removeEventListener('keydown', onKey); wrap.remove() }
    wrap.addEventListener('mousedown', function (ev) { if (ev.target === wrap) close() })
    window.addEventListener('keydown', onKey)
    requestAnimationFrame(function () { wrap.classList.add('on') })
    return { close: close, box: wrap.querySelector('.ivs-modal-box'), wrap: wrap }
  }

  /* ════════════════════════ 4. 主挂载：console → room → report ════════════════════════ */

  function mountMain(el, ctx) {
    injectStyles()
    let sess = null   /* 当前面试：{subject,pressure,mode,rounds,transcript[],exchanges,startAt} */
    let busy = false  /* AI 正在生成时锁输入 */
    let timer = null  /* 面试计时器 */
    let elapsed = 0
    let pitch = null  /* 自我介绍专项：{left,tInt,text,report} */
    let streamDead = '' /* 流式失败原因（非空时面试间显示「重试」） */
    let bookId = (function () { try { return ctx.data('ivsBook') || '' } catch (e) { return '' } })() /* 资料库材料包 */

    el.innerHTML = '<div class="ivs-root"><header class="ivs-hero"></header><main class="ivs-body"></main></div>'
    let root = el.querySelector('.ivs-root')
    let hero = root.querySelector('.ivs-hero')
    let bodyEl = root.querySelector('.ivs-body')

    function stopPitchTimer() {
      if (pitch && pitch.tInt) { clearInterval(pitch.tInt); pitch.tInt = null }
    }

    function paintHero() {
      hero.innerHTML = '<div class="ivs-mark">' + MARK_SVG + '</div>'
        + '<div class="ivs-titles"><div class="ivs-title">复试模拟舱 <em>v' + VERSION + '</em></div>'
        + '<div class="ivs-sub2">' + (pitch
          ? '🎤 自我介绍专项 · ' + (pitch.report ? '点评报告' : '60 秒陈述')
          : sess
            ? esc(sess.subject) + ' · ' + esc(sess.mode || '专业面') + ' · ' + esc(sess.pressure) + '考官'
            + (sess.bookTitle ? ' · 📖 ' + esc(trunc(sess.bookTitle, 10)) : '')
            + ' · 第 ' + Math.min(sess.exchanges + 1, sess.rounds) + '/' + sess.rounds + ' 问'
            : '多轮压力面试 · 考官追问 · 四维成绩单') + '</div></div>'
        + '<div class="ivs-chips">' + heroChips(ctx, !!sess && !sess.report) + '</div>'
    }

    function paint() {
      paintHero()
      if (pitch) bodyEl.innerHTML = pitch.report ? pitchResultHtml() : pitchHtml()
      else if (!sess) bodyEl.innerHTML = consoleHtml()
      else if (sess.report) bodyEl.innerHTML = reportHtml()
      else bodyEl.innerHTML = roomHtml()
      if (sess && !sess.report) bindCompose()
      scrollBottom()
    }

    function scrollBottom() {
      let box = bodyEl.querySelector('.ivs-msgs')
      if (box) box.scrollTop = box.scrollHeight
    }

    /* —— 态 A：控制台 —— */
    function consoleHtml() {
      let subject = String(ctx.config('subject') || '计算机')
      let pressure = String(ctx.config('pressure') || '标准')
      let mode = String(ctx.config('mode') || '专业面')
      let rounds = clamp(num(ctx.config('rounds'), 8), 3, 20)
      let list = sessionsGet(ctx)
      let st = statsOf(list)
      let lastPitch = (function () {
        let l = ctx.data('pitches')
        return Array.isArray(l) && l.length ? l[0] : null
      })()
      return '<section class="ivs-card" style="--i:0">'
        + '<div class="ivs-h">🎙️ 面试设置 <em>' + (aiReady(ctx) ? 'AI 已配置' : 'AI 未配置') + '</em></div>'
        + '<div class="ivs-desc">考官会基于你的每轮回答<strong>层层追问</strong>（压力档会戳穿空话）。'
        + '回答可以口语化 —— 考官看的是你怎么想，不是背书。</div>'
        + '<div class="ivs-grid">'
        + '<div class="ivs-f"><span>报考方向（写进考官人设，如：计算机 / 金融 / 机械）</span>'
        + '<input class="ivs-input" data-f="subject" value="' + esc(subject) + '"></div>'
        + '<div class="ivs-f"><span>每场面试问数（3-20）</span>'
        + '<input class="ivs-input" data-f="rounds" type="number" min="3" max="20" value="' + rounds + '"></div>'
        + '<div class="ivs-f"><span>面试模式（决定考官考察范围）</span><div class="ivs-seg" data-f="mode">'
        + Object.keys(MODES).map(function (k) {
          return '<button data-m="' + k + '" class="' + (k === mode ? 'on' : '') + '">' + k + '</button>'
        }).join('') + '</div></div>'
        + '<div class="ivs-f"><span>压力档位</span><div class="ivs-seg" data-f="pressure">'
        + Object.keys(PRESSURES).map(function (k) {
          return '<button data-p="' + k + '" class="' + (k === pressure ? 'on' : '') + '">' + k + '</button>'
        }).join('') + '</div></div>'
        + (function () {
          /* 资料库材料包：选中后考官围绕该书讲义提问（英语面不适用 —— 避免中英文混杂） */
          let books = nativeBooks(ctx).slice(0, 10)
          let h = '<div class="ivs-f" style="grid-column:1/-1"><span>📖 资料库材料包（可选 · 站内数据接入）'
            + (books.length ? '' : ' —— 资料库为空，去「资料库」导入讲义后可用') + '</span>'
            + '<div class="ivs-seg" data-f="book">'
            + '<button data-act="book" data-b="" class="' + (!bookId ? 'on' : '') + '">不使用</button>'
            + books.map(function (b) {
              return '<button data-act="book" data-b="' + esc(b.id || '') + '" class="' + (bookId === b.id ? 'on' : '') + '"'
                + ' title="' + esc(b.title || '') + '">📖 ' + esc(trunc(b.title || '未命名', 12)) + '</button>'
            }).join('') + '</div></div>'
          return h
        })()
        + '</div>'
        + '<div style="display:flex;gap:9px;align-items:center;flex-wrap:wrap">'
        + '<button class="ivs-btn primary" data-act="start" style="height:42px;padding:0 26px;font-size:14.5px"' + (aiReady(ctx) ? '' : ' disabled') + '>▶ 进入面试间</button>'
        + '<button class="ivs-btn" data-act="pitch"' + (aiReady(ctx) ? '' : ' disabled') + '>🎤 自我介绍专项</button>'
        + '<span class="ivs-note" style="margin:0">' + (aiReady(ctx)
          ? (lastPitch ? '上次自介 ' + lastPitch.total + ' 分 · ' : '') + '开场白与追问全部由 AI 现场生成'
          : '先在设置里配置 AI 接口') + '</span>'
        + '</div></section>'
        + (st.n
          ? '<section class="ivs-card" style="--i:1"><div class="ivs-h">📜 编年史 <em>' + st.n + ' 场 · 平均 ' + (st.avg == null ? '—' : st.avg) + ' 分</em></div>'
          + trendSpark(list)
          + list.map(function (s, i) { return histHtml(s, i) }).join('') + '</section>'
          : '<section class="ivs-card" style="--i:1"><div class="ivs-empty"><b>还没有面试记录</b>完成第一场后，成绩单与回放会存在这里（随账号同步）。</div></section>')
    }

    function histHtml(s, i) {
      return '<div class="ivs-hist" data-act="replay" data-id="' + s.id + '" style="--i:' + Math.min(i, 10) + '">'
        + '<div class="n">' + (s.total == null ? '—' : s.total) + '</div>'
        + '<div class="b"><div class="t">' + esc(s.subject) + ' · ' + esc(s.pressure) + '考官</div>'
        + '<div class="m">' + fmtTime(s.at) + ' · ' + s.transcript.filter(function (t) { return t.role === 'user' }).length + ' 轮作答'
        + (s.bookTitle ? ' · 📖' : '')
        + (s.summary ? ' · ' + esc(trunc(s.summary, 40)) : '') + '</div></div>'
        + '</div>'
    }

    /* —— 态 B：面试间 —— */
    function roomHtml() {
      let mins = String(Math.floor(elapsed / 60)).padStart(2, '0')
      let secs = String(elapsed % 60).padStart(2, '0')
      return '<section class="ivs-card" style="--i:0;padding-bottom:12px">'
        + '<div class="ivs-roombar">'
        + '<span class="ivs-round">第 ' + Math.min(sess.exchanges + 1, sess.rounds) + ' / ' + sess.rounds + ' 问</span>'
        + '<span class="ivs-clock">⏱ ' + mins + ':' + secs + '</span>'
        + '<span style="flex:1"></span>'
        + '<button class="ivs-btn sm danger" data-act="finish">交卷评分</button>'
        + '</div>'
        + '<div class="ivs-msgs" data-f="msgs">' + sess.transcript.map(msgHtml).join('')
        + (busy ? typingHtml() : '') + '</div>'
        + (streamDead ? '<div style="display:flex;gap:9px;align-items:center;margin-top:9px">'
          + '<button class="ivs-btn sm" data-act="retry">🔁 重试（考官掉线）</button>'
          + '<span class="ivs-note" style="margin:0">' + esc(streamDead) + '</span></div>' : '')
        + '<div class="ivs-compose">'
        + '<textarea class="ivs-ta" data-f="answer" placeholder="口述你的回答…（Enter 发送，Shift+Enter 换行）"'
        + (busy ? ' disabled' : '') + '></textarea>'
        + '<button class="ivs-btn primary" data-act="send"' + (busy ? ' disabled' : '') + ' style="height:46px">发送</button>'
        + '</div></section>'
    }

    function msgHtml(t, i) {
      return '<div class="ivs-msg ' + t.role + '" style="--i:' + (i % 12) + '">'
        + '<div class="ivs-ava">' + (t.role === 'prof' ? '👨‍🏫' : '🎓') + '</div>'
        + '<div class="ivs-bubble">' + esc(t.text) + '</div></div>'
    }
    function typingHtml() {
      return '<div class="ivs-msg prof"><div class="ivs-ava">👨‍🏫</div>'
        + '<div class="ivs-typing"><i></i><i></i><i></i></div></div>'
    }

    /* —— 态 C：成绩单 —— */
    function reportHtml() {
      let r = sess.report
      let prev = sess.prev
      let totalDelta = prev && prev.total != null ? r.total - prev.total : null
      return '<section class="ivs-card" style="--i:0">'
        + '<div class="ivs-h">📋 面试成绩单 <em>' + esc(sess.subject) + ' · ' + esc(sess.mode || '专业面') + ' · ' + esc(sess.pressure) + '考官</em></div>'
        + '<div class="ivs-scorebig"><b data-count="' + r.total + '">0</b><span>/ 100 · ' + fmtTime(sess.at)
        + (totalDelta != null ? ' · 较上次 <b style="color:' + (totalDelta >= 0 ? 'var(--iv-ok)' : 'var(--iv-danger)') + '">' + (totalDelta >= 0 ? '+' : '') + totalDelta + '</b>' : '')
        + '</span></div>'
        + DIMS.map(function (d, i) {
          let v = clamp(num(r.scores && r.scores[d.key], 0), 0, 100)
          let pv = prev && prev.scores ? num(prev.scores[d.key], null) : null
          let dv = pv == null ? null : v - pv
          return '<div class="ivs-dim" style="--i:' + i + '"><div class="ivs-dim-h"><b>' + d.label + '</b><span>' + d.desc + ' · ' + v + ' 分'
            + (dv != null ? ' · <i class="ivs-delta ' + (dv >= 0 ? 'up' : 'down') + '">' + (dv >= 0 ? '+' : '') + dv + '</i>' : '')
            + '</span></div>'
            + '<div class="ivs-track"><div class="ivs-fill" data-w="' + v + '"></div></div></div>'
        }).join('')
        + (r.comments && r.comments.length
          ? '<div style="margin-top:10px">' + r.comments.map(function (c) { return '<div class="ivs-cmt">' + esc(c) + '</div>' }).join('') + '</div>'
          : '')
        + adviceFor(r).map(function (a, i) {
          return '<div class="ivs-advice" style="animation-delay:' + (i * 90) + 'ms"><b>🎯 ' + esc(a.label) + ' <em>' + a.score + ' 分 · 薄弱</em></b>'
            + '<p>' + esc(a.tip) + '</p></div>'
        }).join('')
        + '<div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:14px">'
        + '<button class="ivs-btn primary" data-act="again">🔄 再来一场</button>'
        + '<button class="ivs-btn" data-act="transcript">📜 回看本场对话</button>'
        + '<button class="ivs-btn" data-act="export">📤 导出成绩单</button>'
        + '<button class="ivs-btn" data-act="home">🏠 回控制台</button>'
        + '</div></section>'
    }

    /* 成绩单导出：Markdown 文本进剪贴板（无剪贴板权限时降级为弹窗展示） */
    function exportReport() {
      if (!sess || !sess.report) return
      let r = sess.report
      let lines = ['# 复试模拟舱 · 成绩单', '',
        '- 方向：' + sess.subject + ' · ' + sess.pressure + '考官',
        '- 时间：' + fmtTime(sess.at),
        '- 总分：**' + r.total + ' / 100**', '',
        '## 维度得分', '',
        '| 维度 | 得分 |', '| --- | --- |']
      DIMS.forEach(function (d) {
        lines.push('| ' + d.label + '（' + d.desc + '） | ' + clamp(num(r.scores && r.scores[d.key], 0), 0, 100) + ' |')
      })
      if (r.summary) lines.push('', '## 总评', '', r.summary)
      if (r.comments && r.comments.length) lines.push('', '## 点评', '', ...r.comments.map(function (c) { return '- ' + c }))
      lines.push('', '## 对话记录', '')
      sess.transcript.forEach(function (t) {
        lines.push('**' + (t.role === 'prof' ? '考官' : '考生') + '**：' + t.text, '')
      })
      let text = lines.join('\n')
      function fallback() {
        let m = openModal('<div class="ivs-h">📤 成绩单 Markdown<button class="ivs-btn sm ivs-x" data-x="1">×</button></div>'
          + '<textarea class="ivs-ta" style="width:100%;height:300px;margin-top:10px;font-size:12px">' + esc(text) + '</textarea>')
        m.box.addEventListener('click', function (ev) { if (ev.target && ev.target.dataset && ev.target.dataset.x) m.close() })
      }
      try {
        if (win_nav().clipboard && typeof win_nav().clipboard.writeText === 'function') {
          win_nav().clipboard.writeText(text).then(function () {
            ctx.Toast.show('成绩单已复制到剪贴板', 'ok', 2200)
          }, fallback)
        } else fallback()
      } catch (e) { fallback() }
      function win_nav() { return (typeof navigator !== 'undefined' && navigator) ? navigator : (window.navigator || {}) }
    }

    /* —— 面试推进 —— */

    function profSys() {
      let modeScript = MODES[sess.mode] || MODES['专业面']
      let sys = '你正在主持一场研究生复试模拟面试（方向：' + sess.subject + ' · 模式：' + esc(sess.mode || '专业面') + '）。' + PRESSURES[sess.pressure]
        + modeScript
        + '【流程纪律】①一次只问一个问题，问题要具体、可回答、可追问；'
        + '②仔细读考生上一轮回答：有明显漏洞/空话就追问，扎实就换新考点；'
        + '③不要复述考生的话，不要给评价（评价在交卷后由系统做）；'
        + (sess.mode === '英语面' ? '④全程使用英语（问题与追问都用英语，专业名词可保留原文）；' : '④全程中文，专业术语可夹英文；')
        + '⑤回答偏题时把话题拉回考察范围。'
      /* 资料库材料包：考官围绕考生导入的讲义提问（书被删/英语面则自动跳过） */
      if (sess.bookId && sess.mode !== '英语面') {
        let bk = findBook(ctx, sess.bookId)
        let ex = bookExcerpt(bk)
        if (ex) {
          sys += '\n【参考材料】考生站内资料库导入了《' + flat(bk.title || '未命名') + '》。'
            + '本场面试可围绕其中的概念、定理、例题与易错点提问（题干必须自包含，不引用「见材料第几页」）：\n' + ex
        }
      }
      return sys
    }

    /* transcriptText 已提升到 IIFE 级（debug 钩子共用） */

    /* —— 态 D：自我介绍专项（60 秒陈述 + AI 点评 + 改进稿） —— */
    function pitchHtml() {
      let pct = Math.round(pitch.left / PITCH_SECS * 100)
      return '<section class="ivs-card" style="--i:0">'
        + '<div class="ivs-h">🎤 自我介绍专项 <em>' + PITCH_SECS + ' 秒限时 · 读完自动提交</em></div>'
        + '<div class="ivs-desc">像真实复试那样<strong>掐表陈述</strong>：结构（开场-主体-收尾）、内容（亮点具体、扣方向）、'
        + '语言（简洁、无口头语）。提交后 AI 按三维打分并给一版改进稿。</div>'
        + '<div class="ivs-pitchbar"><div class="ivs-track"><div class="ivs-fill' + (pct < 34 ? ' low' : '') + '" data-w="' + pct + '" style="width:' + pct + '%"></div></div>'
        + '<span class="ivs-pitcht">' + pitch.left + 's</span></div>'
        + '<textarea class="ivs-ta" data-f="pitch" placeholder="写下或粘贴你的自我介绍，掐着 60 秒默读一遍…"' + (busy ? ' disabled' : '') + '>'
        + esc(pitch.text || '') + '</textarea>'
        + '<div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:11px">'
        + '<button class="ivs-btn primary" data-act="pitch-submit"' + (busy ? ' disabled' : '') + '>✔ 提交点评</button>'
        + '<button class="ivs-btn" data-act="pitch-back">返回控制台</button>'
        + (busy ? '<span class="ivs-note" style="margin:0">教练批改中…</span>' : '')
        + '</div></section>'
    }

    function pitchResultHtml() {
      let r = pitch.report
      return '<section class="ivs-card" style="--i:0">'
        + '<div class="ivs-h">📋 自介点评 <em>' + fmtTime(pitch.at) + '</em></div>'
        + '<div class="ivs-scorebig"><b data-count="' + r.total + '">0</b><span>/ 100 · 自我介绍专项</span></div>'
        + PITCH_DIMS.map(function (d, i) {
          let v = clamp(num(r.scores && r.scores[d.key], 0), 0, 100)
          return '<div class="ivs-dim" style="--i:' + i + '"><div class="ivs-dim-h"><b>' + d.label + '</b><span>' + d.desc + ' · ' + v + ' 分</span></div>'
            + '<div class="ivs-track"><div class="ivs-fill" data-w="' + v + '"></div></div></div>'
        }).join('')
        + (r.comments && r.comments.length
          ? '<div style="margin-top:10px">' + r.comments.map(function (c) { return '<div class="ivs-cmt">' + esc(c) + '</div>' }).join('') + '</div>'
          : '')
        + (r.rewrite ? '<div class="ivs-advice"><b>✍️ AI 改进稿</b><p>' + esc(r.rewrite) + '</p></div>' : '')
        + '<div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:14px">'
        + '<button class="ivs-btn primary" data-act="pitch-again">🔄 再练一次</button>'
        + '<button class="ivs-btn" data-act="pitch-back">🏠 回控制台</button>'
        + '</div></section>'
    }

    function startPitch() {
      if (!aiReady(ctx)) { ctx.Toast.show('请先在设置里配置 AI 接口', 'warn', 2600); return }
      pitch = { text: '', left: PITCH_SECS, tInt: null, report: null, at: Date.now() }
      paint()
      pitch.tInt = setInterval(function () {
        if (!pitch || pitch.report) { stopPitchTimer(); return }
        pitch.left -= 1
        let bar = bodyEl.querySelector('.ivs-pitchbar .ivs-fill')
        let t = bodyEl.querySelector('.ivs-pitcht')
        let pct = clamp(Math.round(pitch.left / PITCH_SECS * 100), 0, 100)
        if (bar) { bar.style.width = pct + '%'; bar.classList.toggle('low', pct < 34) }
        if (t) t.textContent = Math.max(pitch.left, 0) + 's'
        if (pitch.left <= 0) { stopPitchTimer(); submitPitch() }
      }, 1000)
    }

    function submitPitch() {
      if (!pitch || pitch.report || busy) return
      let ta = bodyEl.querySelector('[data-f=pitch]')
      let text = flat(ta ? ta.value : pitch.text).slice(0, 2000)
      if (!text) { ctx.Toast.show('先写点内容再提交', 'info', 1400); return }
      stopPitchTimer()
      pitch.text = text
      busy = true
      paint()
      let sys = '你是考研复试自我介绍教练。考生报考方向：' + String(ctx.config('subject') || '通用')
        + '。请按三个维度给这篇自我介绍打 0-100 分，给 2-3 条具体点评（指出哪句空泛/结构缺了什么），'
        + '并写一版改进稿（150 字内，保留考生真实经历，只改结构与表达）。'
        + '只输出 JSON：{"scores":{"structure":数,"content":数,"language":数},"comments":["≤60字",...],"rewrite":"改进稿"}'
      aiJSON(ctx, sys, text, { timeout: 120000, maxTokens: 2000 })
        .then(function (r) {
          let scores = (r && r.scores) || {}
          let total = 0, cnt = 0
          PITCH_DIMS.forEach(function (d) { let v = clamp(num(scores[d.key], 0), 0, 100); scores[d.key] = v; total += v; cnt++ })
          total = cnt ? Math.round(total / cnt) : 0
          pitch.report = {
            total: total, scores: scores,
            comments: (Array.isArray(r && r.comments) ? r.comments : []).map(function (c) { return flat(c).slice(0, 120) }).slice(0, 3),
            rewrite: flat(r && r.rewrite || '').slice(0, 300)
          }
          pitch.at = Date.now()
          /* 最近 10 次存云同步，控制台显示上次得分 */
          try {
            let l = ctx.data('pitches')
            l = Array.isArray(l) ? l : []
            l.unshift({ at: pitch.at, total: total, rewrite: pitch.report.rewrite })
            ctx.data('pitches', l.slice(0, 10))
          } catch (e) { }
          busy = false
          paint()
          requestAnimationFrame(function () {
            bodyEl.querySelectorAll('.ivs-fill').forEach(function (f) { f.style.width = f.dataset.w + '%' })
          })
        })
        .catch(function (e) {
          busy = false
          ctx.Toast.show('点评失败：' + trunc(e && e.message || e, 50), 'warn', 3200)
          paint()
        })
    }

    function start() {
      let subject = flat(bodyEl.querySelector('[data-f=subject]').value).slice(0, 30) || '通用'
      let pressure = bodyEl.querySelector('[data-f=pressure] button.on').dataset.p
      let modeBtn = bodyEl.querySelector('[data-f=mode] button.on')
      let mode = modeBtn ? modeBtn.dataset.m : '专业面'
      let rounds = clamp(num(bodyEl.querySelector('[data-f=rounds]').value, 8), 3, 20)
      /* 材料包以控制台当前选中为准（兼容 bindCompose 未绑定的回退路径） */
      let bookBtn = bodyEl.querySelector('[data-f=book] button.on')
      if (bookBtn) bookId = bookBtn.dataset.b || ''
      let book = findBook(ctx, bookId)
      /* 保存为默认配置：下次进来直接复用 */
      try { ctx.config('subject', subject); ctx.config('pressure', pressure); ctx.config('mode', mode); ctx.config('rounds', rounds); ctx.data('ivsBook', bookId) } catch (e) { }
      sess = { id: uid('iv'), subject: subject, pressure: pressure, mode: mode, rounds: rounds, transcript: [], exchanges: 0, startAt: Date.now(), at: Date.now(), report: null, bookId: book ? book.id : '', bookTitle: book ? flat(book.title || '') : '' }
      elapsed = 0
      timer = setInterval(function () { elapsed++; let c = bodyEl.querySelector('[data-f=clock]'); if (c) c.textContent = '⏱ ' + String(Math.floor(elapsed / 60)).padStart(2, '0') + ':' + String(elapsed % 60).padStart(2, '0') }, 1000)
      paint()
      ask('面试开始。请向考生提出第一个复试问题（可从自我介绍或专业基础切入）。只输出你的发言。')
    }

    /* 考官说话：流式逐字进气泡。
     * 兼容两种流式契约：有的站点 onChunk 给增量 delta，有的给累积全文 ——
     * 以「当前文本是否为 chunk 前缀」判定，累积则替换、增量则追加（截图复读 bug 的根因就是这里只按增量处理）。 */
    let PROF_MAX = 600
    let lastAsk = ''
    function absorbChunk(list, chunk) {
      let cur = list[list.length - 1].text
      if (chunk && chunk.length >= cur.length && chunk.slice(0, cur.length) === cur) list[list.length - 1].text = chunk
      else list[list.length - 1].text += chunk
    }
    function ask(instruction) {
      busy = true
      lastAsk = instruction
      paint()
      let bubble = null
      function ensureBubble() {
        if (bubble) return bubble
        sess.transcript.push({ role: 'prof', text: '' })
        paint()
        let nodes = bodyEl.querySelectorAll('.ivs-msg.prof .ivs-bubble')
        bubble = nodes[nodes.length - 1]
        return bubble
      }
      aiStream(ctx, profSys(), transcriptText(sess.transcript) + '\n\n【你现在要做什么】' + instruction,
        function (chunk) {
          let b = ensureBubble()
          absorbChunk(sess.transcript, String(chunk == null ? '' : chunk))
          if (b) { b.innerHTML = esc(sess.transcript[sess.transcript.length - 1].text) + '<span class="ivs-cursor"></span>'; scrollBottom() }
        })
        .then(function () {
          busy = false
          let last = sess.transcript[sess.transcript.length - 1]
          if (!last || !flat(last.text)) {
            sess.transcript.pop()
            sess.transcript.push({ role: 'prof', text: '（考官顿了一下）换个问法 —— 请用两分钟说说你报考这个方向的理由。' })
          } else if (last.text.length > PROF_MAX) {
            /* 单条发言护栏：截断防模型啰嗦撑爆气泡 */
            last.text = last.text.slice(0, PROF_MAX) + '……（打住，先说这么多）'
          }
          lastAsk = ''
          paint()
        })
        .catch(function (e) {
          busy = false
          if (sess.transcript.length && !flat(sess.transcript[sess.transcript.length - 1].text)) sess.transcript.pop()
          streamDead = trunc(e && e.message || e, 50)
          ctx.Toast.show('考官掉线：' + streamDead + ' —— 可点「重试」', 'warn', 2800)
          ctx.log('面试流式失败：' + (e && e.message || e), 'warn')
          paint()
        })
    }

    function send() {
      if (busy || !sess || sess.report) return
      let ta = bodyEl.querySelector('[data-f=answer]')
      let text = flat(ta.value).slice(0, ANSWER_MAX)
      if (!text) { ctx.Toast.show('先写点回答再发送', 'info', 1400); return }
      sess.transcript.push({ role: 'user', text: text })
      sess.exchanges++
      if (sess.exchanges >= sess.rounds) { paint(); finish() }   /* 轮数到点 → 自动评分 */
      else paint(), ask('考生已作答（第 ' + sess.exchanges + '/' + sess.rounds + ' 轮）。按流程纪律决定追问还是换题。只输出你的发言。')
    }

    /* 交卷：结构化 rubric 评分（transcript 截头防超限） */
    function finish() {
      if (!sess || sess.report || busy) { if (busy) { ctx.Toast.show('等考官说完这句…', 'info', 1400); return } return }
      busy = true
      paint()
      let sys = '你是复试评分系统。根据下面的完整面试 transcript，按四个维度各打 0-100 分并给出 2-4 条具体点评'
        + '（指出具体哪轮回答暴露了什么问题、怎么改；点评要针对这个考生的真实表现，不写套话）。'
        + '只输出 JSON：{"scores":{"professional":数,"logic":数,"expression":数,"composure":数},'
        + '"comments":["≤80字点评",...],"summary":"≤40字总评"}'
      let text = transcriptText(sess.transcript)
      if (text.length > TRANSCRIPT_CHARS) text = text.slice(-TRANSCRIPT_CHARS)
      aiJSON(ctx, sys, text, { timeout: 180000, maxTokens: 3000 })
        .then(function (r) {
          let scores = (r && r.scores) || {}
          let total = 0, cnt = 0
          DIMS.forEach(function (d) { let v = clamp(num(scores[d.key], 0), 0, 100); scores[d.key] = v; total += v; cnt++ })
          total = cnt ? Math.round(total / cnt) : 0
          /* 上一场同插件成绩单：维度对比用（取编年史最新一场；scores 在 report 内） */
          let prevSess = sessionsGet(ctx)[0]
          sess.prev = prevSess && prevSess.report && prevSess.report.scores
            ? { total: prevSess.total != null ? num(prevSess.total, null) : num(prevSess.report.total, null), scores: prevSess.report.scores }
            : null
          sess.report = {
            total: total, scores: scores,
            comments: (Array.isArray(r && r.comments) ? r.comments : []).map(function (c) { return flat(c).slice(0, 200) }).slice(0, 4),
            summary: flat(r && r.summary || '').slice(0, 60)
          }
          sess.total = total /* 顶层冗余一份：编年史/统计/走势线直接可读 */
          sess.at = Date.now()
          sessionSave(ctx, sess)
          if (timer) { clearInterval(timer); timer = null }
          ctx.log('面试完成：' + sess.subject + ' · ' + sess.pressure + ' · ' + total + ' 分')
          busy = false
          paint()
          /* 维度条动画：下一帧推到目标宽度 */
          requestAnimationFrame(function () {
            bodyEl.querySelectorAll('.ivs-fill').forEach(function (f) { f.style.width = f.dataset.w + '%' })
          })
        })
        .catch(function (e) {
          busy = false
          ctx.Toast.show('评分失败：' + trunc(e && e.message || e, 50) + ' —— 可重试交卷', 'warn', 3200)
          paint()
        })
    }

    /* —— 事件 —— */
    let unbind = delegate(bodyEl, {
      start: function () { if (!aiReady(ctx)) { ctx.Toast.show('请先在设置里配置 AI 接口', 'warn', 2600); return } start() },
      book: function (t) {
        /* 材料包选择：持久化 + 就地切换 .on（不依赖 bindCompose，回控制台后依然可用） */
        bookId = t.dataset.b || ''
        try { ctx.data('ivsBook', bookId) } catch (e) { }
        let seg = t.parentNode
        if (seg) {
          let btns = seg.querySelectorAll('button')
          for (let i = 0; i < btns.length; i++) btns[i].classList.toggle('on', btns[i] === t)
        }
      },
      retry: function () {
        if (busy || !sess || sess.report) return
        streamDead = ''
        ask(lastAsk || '请继续。只输出你的发言。')
      },
      send: send,
      finish: function () {
        if (!sess || sess.report) return
        if (sess.transcript.filter(function (t) { return t.role === 'user' }).length === 0) {
          ctx.Toast.show('考官刚开口 —— 至少回答一轮再交卷', 'info', 1800); return
        }
        finish()
      },
      again: function () { sess = null; paint(); },
      home: function () { sess = null; paint() },
      export: exportReport,
      pitch: startPitch,
      'pitch-submit': function () { pitch && submitPitch() },
      'pitch-again': function () { pitch = null; startPitch() },
      'pitch-back': function () { stopPitchTimer(); pitch = null; paint() },
      transcript: function () {
        let m = openModal('<div class="ivs-h">📜 本场对话<button class="ivs-btn sm ivs-x" data-x="1">×</button></div>'
          + '<div style="margin-top:10px">' + sess.transcript.map(function (t) {
            return '<div class="ivs-msg2 ' + t.role + '"><span class="r">' + (t.role === 'prof' ? '考官' : '考生') + '</span><span>' + esc(t.text) + '</span></div>'
          }).join('') + '</div>')
        m.box.addEventListener('click', function (ev) { if (ev.target && ev.target.dataset && ev.target.dataset.x) m.close() })
      },
      replay: function (a) {
        let s = sessionsGet(ctx).filter(function (x) { return x.id === a.dataset.id })[0]
        if (!s) return
        let m = openModal('<div class="ivs-h">📜 ' + esc(s.subject) + ' · ' + s.total + ' 分<button class="ivs-btn sm ivs-x" data-x="1">×</button></div>'
          + '<div class="ivs-note" style="margin:0 0 10px">' + fmtTime(s.at) + ' · ' + esc(s.pressure) + '考官</div>'
          + s.transcript.map(function (t) {
            return '<div class="ivs-msg2 ' + t.role + '"><span class="r">' + (t.role === 'prof' ? '考官' : '考生') + '</span><span>' + esc(t.text) + '</span></div>'
          }).join(''))
        m.box.addEventListener('click', function (ev) { if (ev.target && ev.target.dataset && ev.target.dataset.x) m.close() })
      }
    })

    /* 分段器（压力档 / 面试模式）+ Enter 发送 */
    function bindCompose() {
      bodyEl.querySelectorAll('.ivs-seg button').forEach(function (b) {
        b.addEventListener('click', function () {
          let seg = b.parentNode
          seg.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b) })
        })
      })
      let ta = bodyEl.querySelector('[data-f=answer]')
      if (ta) ta.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); send() }
      })
    }

    let offStuck = bindStuck(root)
    paint()
    bindCompose()

    return function destroy() {
      if (timer) clearInterval(timer)
      stopPitchTimer()
      unbind()
      offStuck()
      /* 面试进行中切走：transcript 不丢（在 sess 内），但会话不存档 —— 回来可继续答 */
    }
  }

  /* ════════════════════════ 5. 注册 ════════════════════════ */

  let api = {
    id: 'interview-sim',
    name: '复试模拟舱',
    version: VERSION,
    author: 'kaoyan-v2',
    desc: '多轮 AI 压力面试：专业面/综合面/英语面三模式、压力三档、考官层层追问、四维成绩单（含较上次对比）、'
      + '编年史回放与平均分走势、薄弱维度建议、自我介绍专项（60 秒限时 + AI 改进稿）、成绩单导出；'
      + 'v1.2 接入站内资料库：可选一本讲义当「材料包」，考官围绕你的材料提问（专业课复试对口）。',
    tools: [
      { id: T_MAIN, title: '复试模拟舱', icon: '🎙️', mount: mountMain }
    ],
    config: [
      { key: 'subject', label: '报考方向（如 计算机/金融/机械）', type: 'text', default: '计算机' },
      { key: 'mode', label: '面试模式', type: 'select', default: '专业面', options: ['专业面', '综合面', '英语面'] },
      { key: 'pressure', label: '压力档位', type: 'select', default: '标准', options: ['温和', '标准', '压力'] },
      { key: 'rounds', label: '每场面试问数（3-20）', type: 'number', default: 8 }
    ],
    hooks: {
      /* 【站内适配 2026-10-22】去掉原来的 `'*'` 通配钩子。
       * 它给全站**每一个**事件都写一条 debug 日志，插件日志区（有条数上限）会被事件流挤满，
       * 真正有用的几条（「面试完成：数学 · 标准 · 88 分」）反而被冲掉、用户查不到。
       * 事件流是调试资产，但不该由每个插件无脑复读一遍。 */
      quizDone: function (ctx) {
        /* 刷完题正好是练复试的好时机 —— 只做一次轻提示，不打断 */
        try {
          let k = ctx.keep.get('lastQuizNudge')
          let tk = dkey()
          if (k === tk) return
          ctx.keep.set('lastQuizNudge', tk)
          if (typeof ctx.notify === 'function') {
            ctx.notify({ title: '🎙️ 刚刷完题，趁热练一轮复试？', body: '面试间的追问会逼你把「会做题」讲成「讲得清」。', level: 'info', timeout: 12000, onClick: function () { ctx.api.goTool(T_MAIN) } })
          }
        } catch (e) { /* 钩子失败绝不影响主流程 */ }
      }
    },
    memory: '用户装有「复试模拟舱」插件：可随时进行多轮 AI 压力面试（工具 → 复试模拟舱）。'
      + '用户提到「复试」「面试」「自我介绍」时，建议他去模拟舱练，并把成绩单拿出来复盘。',
    init: function (ctx) {
      /* 声明自己的 AI 场景：注册后才吃得到站内「设置 → AI 思考模式」的逐场景档位、
       * 公式契约（latexNeed）与用量分桶名。失败不阻断装载（老版本站点没有这个方法）。 */
      try {
        if (ctx.ai && typeof ctx.ai.registerCtx === 'function') {
          ctx.ai.registerCtx({
            ctx: AI_CTX_CHAT,
            name: '复试模拟舱 · 考官对话',
            desc: '多轮压力面试的考官提问与追问（流式逐字）',
            def: 'noThink',       /* 对话要即时出字，等思考会让考生干瞪眼 */
            latexNeed: false,     /* 面试是口语表达，不出公式 */
            tools: 'none',
            recall: false
          })
          ctx.ai.registerCtx({
            ctx: AI_CTX_SCORE,
            name: '复试模拟舱 · 四维评分',
            desc: '按 rubric 给面试表现打分与点评（结构化）',
            def: 'think',         /* 评分要严谨，宁可慢 */
            latexNeed: false,
            tools: 'none',
            recall: false
          })
        }
      } catch (e) { /* 注册失败 = 退回未注册路径（吃全局设置），不影响使用 */ }
      ctx.log('复试模拟舱 v' + VERSION + ' 已装载（编年史 ' + sessionsGet(ctx).length + ' 场）')
    }
  }

  /* 把 transcript 渲染成给 AI 看的对话记录（IIFE 级：debug 钩子也要用） */
  function transcriptText(list) {
    return list.map(function (t) { return (t.role === 'prof' ? '【考官】' : '【考生】') + t.text }).join('\n')
  }

  if (window.__IVS_DEBUG__) {
    window.__ivsInternals = {
      PRESSURES: PRESSURES,
      MODES: MODES,
      PITCH_DIMS: PITCH_DIMS,
      DIMS: DIMS,
      ADVICE: ADVICE,
      statsOf: statsOf,
      sessionsGet: sessionsGet,
      transcriptText: transcriptText,
      trendSpark: trendSpark,
      adviceFor: adviceFor,
      SESSION_MAX: SESSION_MAX,
      mountMain: mountMain,
      nativeBooks: nativeBooks, bookExcerpt: bookExcerpt, findBook: findBook
    }
  }

  PluginBus.register(api)
})()
