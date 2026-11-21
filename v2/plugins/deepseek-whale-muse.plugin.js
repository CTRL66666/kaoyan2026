;(function () {
  'use strict'

/* ============================================================
 * DeepSeek 鲸鱼娘 · 悬浮球皮肤插件 v1.2.0
 * ------------------------------------------------------------
 * 复用 AiOrb.registerSkin/setSkin，不改悬浮球核心。桌面与预览共用同一渲染器。
 * 角色使用开源社区的 Q 版女仆鲸鱼娘动作图集，不是另画的替代形象。
 *
 * 图集：JAdpp/dsh-whale-galgame → assets/default/pet-dafeiyu.webp（6×7，384×512/格）。
 * 图集为该项目对其上游 Q 版形象的重绘；原始角色「溟月」：上善无形；
 * DeepSeek 女仆元素二创：ZipZipPipe；Q 版原型：这个刀子真甜。
 * 美术遵循 CC BY-NC-SA 4.0：署名、非商业、相同方式共享。完整上游 NOTICE 与许可
 * 随素材放在 public/plugins/whale-muse-assets/。本插件为非官方同人作品。
 * ============================================================ */

let PLUGIN_ID = 'deepseek-whale-muse'
let SKIN_KEY = 'deepseek-whale-muse'
let ATLAS_PATH = 'plugins/whale-muse-assets/pet-dafeiyu.webp'
let INBETWEEN_PATH = 'plugins/whale-muse-assets/pet-dafeiyu-inbetweens.png'
let SIZE_KEY = 'kaoyan_whale_muse_size_v1'
let SIZE_MIN = 56, SIZE_MAX = 168, SIZE_DEFAULT = 96
let BRIDGE_MS = 105, BRIDGE_FADE = 65
let MARK_TILE = '<svg viewBox="0 0 48 48" width="1em" height="1em" aria-hidden="true">'
  + '<defs><linearGradient id="dwmMarkG" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#80D8FF"/><stop offset="1" stop-color="#5364D9"/></linearGradient></defs>'
  + '<rect width="48" height="48" rx="13" fill="url(#dwmMarkG)"/>'
  + '<path d="M9 26c2-8 10-12 18-8 3-5 7-6 10-5-1 3-1 6 1 8-3 1-6 0-8-2-2 8-10 13-18 9l-5 4 1-7c-1-1-1-2-1-3z" fill="#fff"/>'
  + '<circle cx="18" cy="22" r="1.5" fill="#3154B8"/></svg>'

function atlasUrl(path) {
  let asset = path || ATLAS_PATH
  try { return new URL(asset, document.baseURI || window.location.href).href } catch (e) { return asset }
}

let SKIN_CSS = `
.dwm-skin{position:absolute;inset:0;pointer-events:none;user-select:none;-webkit-user-select:none;isolation:isolate}
.dwm-skin *{box-sizing:border-box;position:absolute}
.dwm-motion{inset:0;transform-origin:50% 88%;animation:dwm-breathe 3.4s ease-in-out infinite}
.dwm-character{height:100%;aspect-ratio:3/4;left:50%;top:0;transform:translateX(-50%);overflow:visible}
.dwm-sprite{inset:0;background-repeat:no-repeat;background-size:600% 700%;background-position:0 0;opacity:0;
image-rendering:auto;filter:drop-shadow(0 3px 3px rgba(37,54,110,.2));transform-origin:50% 88%;
transition:opacity var(--dwm-fade,180ms) ease-out,transform var(--dwm-fade,180ms) ease-out;will-change:opacity}
.dwm-skin.dnd .dwm-sprite{transition:none!important}
.dwm-shadow{left:25%;right:25%;bottom:-1%;height:5%;border-radius:50%;background:rgba(40,62,125,.18);filter:blur(2px)}
.dwm-badge{right:2%;top:2%;width:18%;height:18%;border-radius:50%;background:#FF4D67;border:2px solid #fff;
transform:scale(0);transition:transform .18s ease;z-index:5}
.dwm-skin.has-badge .dwm-badge{transform:scale(1)}
.dwm-burst{inset:3%;border:2px solid #80CFFF;border-radius:50%;opacity:0;z-index:4}
.dwm-zzz{right:-2%;top:-3%;font:700 12px/1 sans-serif;color:#5A75C9;opacity:0;text-shadow:0 1px #fff;z-index:5}
.dwm-skin[data-state="thinking"] .dwm-motion{animation:dwm-ponder 2.2s ease-in-out infinite}
.dwm-skin[data-state="working"] .dwm-motion{animation:dwm-work .52s ease-in-out infinite}
.dwm-skin[data-state="done"] .dwm-motion{animation:dwm-celebrate .72s cubic-bezier(.25,1.35,.45,1) 2}
.dwm-skin[data-state="done"] .dwm-burst{animation:dwm-burst .9s ease-out 2}
.dwm-skin[data-state="sleep"] .dwm-motion{animation:dwm-sleep 4s ease-in-out infinite}
.dwm-skin[data-state="sleep"] .dwm-zzz{opacity:1;animation:dwm-zzz 2.4s ease-in-out infinite}
.dwm-skin[data-move="hop"] .dwm-motion{animation:dwm-hop .72s cubic-bezier(.3,1.35,.5,1)}
.dwm-skin[data-move="spin"] .dwm-motion{animation:dwm-turn 1.4s ease-in-out}
.dwm-skin[data-move="wiggle"] .dwm-motion{animation:dwm-wiggle .72s ease-in-out}
.dwm-skin[data-move="wave"] .dwm-motion{animation:dwm-wave .7s ease-in-out 2}
.dwm-skin[data-move="rice"] .dwm-motion{animation:dwm-rice .6s ease-in-out 3}
.dwm-skin[data-move="pan"] .dwm-motion{animation:dwm-pan 1.4s ease-in-out}
.dwm-skin.is-bridging .dwm-motion{animation:none!important}
.dwm-skin.dnd *,.dwm-skin.dnd *::before,.dwm-skin.dnd *::after{animation:none!important}
@keyframes dwm-breathe{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-2%) scale(1.015,.99)}}
@keyframes dwm-ponder{0%,100%{transform:rotate(0) translateY(0)}50%{transform:rotate(2deg) translateY(-2%)}}
@keyframes dwm-work{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.5%)}}
@keyframes dwm-celebrate{0%{transform:translateY(0) scale(1)}25%{transform:translateY(4%) scale(1.06,.94)}58%{transform:translateY(-12%) scale(.97,1.04)}100%{transform:translateY(0) scale(1)}}
@keyframes dwm-burst{0%{transform:scale(.55);opacity:.8}100%{transform:scale(1.35);opacity:0}}
@keyframes dwm-zzz{0%{transform:translate(0,10%) scale(.75);opacity:0}35%{opacity:1}100%{transform:translate(35%,-60%) scale(1.15);opacity:0}}
@keyframes dwm-sleep{0%,100%{transform:rotate(0) translateY(0)}50%{transform:rotate(-2deg) translateY(2%)}}
@keyframes dwm-hop{0%,100%{transform:translateY(0) scale(1)}25%{transform:translateY(4%) scale(1.08,.9)}55%{transform:translateY(-14%) scale(.96,1.06)}80%{transform:translateY(0) scale(1.04,.96)}}
@keyframes dwm-turn{0%,100%{transform:scale(1)}45%{transform:scale(.94,1.03) translateY(-3%)}}
@keyframes dwm-wiggle{0%,100%{transform:rotate(0)}25%{transform:rotate(-5deg)}55%{transform:rotate(5deg)}78%{transform:rotate(-2deg)}}
@keyframes dwm-wave{0%,100%{transform:rotate(0)}50%{transform:rotate(-4deg) translateY(-2%)}}
@keyframes dwm-rice{0%,100%{transform:translateY(0)}50%{transform:translateY(-2%) scale(1.02,.98)}}
@keyframes dwm-pan{0%,100%{transform:rotate(0)}30%{transform:rotate(-4deg)}65%{transform:rotate(4deg)}}
@media(prefers-reduced-motion:reduce){.dwm-skin *,.dwm-skin *::before,.dwm-skin *::after{animation:none!important}}
`

let WHALE_DOM = '<div class="dwm-skin" data-state="idle">'
  + '<div class="dwm-shadow"></div><div class="dwm-motion"><div class="dwm-character">'
  + '<div class="dwm-sprite a"></div><div class="dwm-sprite b"></div></div></div>'
  + '<div class="dwm-burst"></div><div class="dwm-zzz">Z</div><div class="dwm-badge"></div></div>'

/* 帧坐标为 [row,col]，原图集 6 列 7 行；['x',col] 是 4 列补画中间帧图集。
 * x0 双手半抬、x1 电脑半合、x2 单手半举、x3 半闭眼微笑。
 * enter/exit 逐段编排真实绘制帧：先播当前动作 exit，再播目标 enter，最后进入目标循环。
 * 例如 working→done 会半合电脑、回站姿、半闭眼、微笑、双手半抬、抬手，而非直接换图。 */
let ACTIONS = {
  idle: { frames: [[0, 0]], interval: 900, loop: true, fade: 240, enter: [], exit: [] },
  thinking: { frames: [[0, 2]], interval: 900, loop: true, fade: 240, enter: [['x', 0], [0, 2]], exit: [[0, 2], ['x', 0], [0, 0]] },
  working: { frames: [[1, 3], [1, 4], [1, 5]], interval: 380, loop: true, fade: 150, enter: [[0, 2], ['x', 1], [1, 3]], exit: [[1, 4], ['x', 1], [0, 0]] },
  done: { frames: [[0, 1], [0, 3]], interval: 420, loop: true, fade: 180, enter: [['x', 3], [0, 1], ['x', 0], [0, 3]], exit: [['x', 3], [0, 0]] },
  sleep: { frames: [[0, 4], [0, 5]], interval: 1100, loop: true, fade: 420, enter: [['x', 3], [0, 4], [0, 5]], exit: [[0, 4], ['x', 3], [0, 0]] },
  wave: { frames: [[1, 0], [1, 1]], interval: 420, cycles: 3, fade: 180, enter: [['x', 2], [0, 3], [1, 0], [1, 1]], exit: [[1, 0], [0, 3], ['x', 2], [0, 0]] },
  hop: { frames: [[3, 4]], interval: 720, cycles: 1, fade: 200, enter: [['x', 0], [3, 2], [3, 3], [3, 4]], exit: [[3, 4], ['x', 0], [0, 0]] },
  spin: { frames: [[4, 0], [4, 2], [4, 3], [4, 4], [4, 5], [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [6, 0], [6, 1], [6, 2], [6, 3], [4, 0]], interval: 110, cycles: 1, fade: 70, enter: [['x', 3], [4, 0], [4, 2]], exit: [[4, 0], ['x', 3], [0, 0]] },
  rice: { frames: [[2, 0], [2, 1], [2, 2], [2, 3]], interval: 420, cycles: 2, fade: 180, enter: [['x', 0], [2, 0], [2, 1]], exit: [[2, 1], [2, 0], ['x', 0], [0, 0]] },
  pan: { frames: [[2, 4], [2, 5], [3, 0], [3, 1]], interval: 420, cycles: 2, fade: 180, enter: [['x', 0], [1, 2], [2, 4], [2, 5]], exit: [[2, 4], [1, 2], ['x', 0], [0, 0]] },
  wiggle: { frames: [[3, 2], [3, 3]], interval: 400, cycles: 2, fade: 160, enter: [['x', 3], [3, 2], [3, 3]], exit: [[3, 2], ['x', 3], [0, 0]] }
}
let IDLE_MOVES = ['wave', 'rice', 'wiggle', 'pan']

function normalizeSize(px) {
  let n = Math.round(Number(px) || SIZE_DEFAULT)
  return Math.max(SIZE_MIN, Math.min(SIZE_MAX, n))
}
function readSize() {
  try { return normalizeSize(localStorage.getItem(SIZE_KEY) || SIZE_DEFAULT) } catch (e) { return SIZE_DEFAULT }
}
function writeSize(px) {
  let n = normalizeSize(px)
  try { localStorage.setItem(SIZE_KEY, String(n)) } catch (e) { }
  return n
}
function makeBridge(from, to) {
  if (!from || from === to || !ACTIONS[from] || !ACTIONS[to]) return []
  let frames = (ACTIONS[from].exit || []).concat(ACTIONS[to].enter || [])
  return frames.filter(function (f, i) {
    let prev = frames[i - 1]
    return !prev || prev[0] !== f[0] || prev[1] !== f[1]
  })
}

let cssReady = false
function ensureSkinCss() {
  if (cssReady || typeof document === 'undefined') return
  if (document.head.querySelector('style[data-whale-muse]')) { cssReady = true; return }
  let st = document.createElement('style')
  st.setAttribute('data-whale-muse', '1')
  st.textContent = SKIN_CSS
  document.head.appendChild(st)
  cssReady = true
}

function emptyHandle() {
  return { el: null, setState: function () { }, notify: function () { }, setDnd: function () { }, playMove: function () { return false }, setSize: function () { return SIZE_DEFAULT }, destroy: function () { } }
}

function mountWhale(host, _ctx) {
  ensureSkinCss()
  if (!host) return emptyHandle()
  host.innerHTML = WHALE_DOM
  let root = host.querySelector('.dwm-skin')
  let layers = Array.from(host.querySelectorAll('.dwm-sprite'))
  if (!root || layers.length !== 2) { host.innerHTML = ''; return emptyHandle() }
  let desktop = host.id === 'copilot-fab'
  let oldWidth = host.style.width, oldHeight = host.style.height
  let url = atlasUrl(), inbetweenUrl = atlasUrl(INBETWEEN_PATH)
  /* 图集几何同时写在实例上：即使外部样式被覆盖，也不会把整张原图直接铺出来。 */
  layers.forEach(function (sprite) {
    sprite.style.backgroundImage = 'url("' + url + '")'
    sprite.style.backgroundSize = '600% 700%'
    sprite.style.backgroundRepeat = 'no-repeat'
  })
  let disposed = false, dndOn = false, state = 'idle', visualAction = 'idle', frameTimer = 0, idleTimer = 0
  let front = 0, hasFrame = false
  let reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  let timers = [], recent = []
  function later(fn, ms) {
    let id = setTimeout(function () {
      let i = timers.indexOf(id); if (i >= 0) timers.splice(i, 1)
      if (!disposed) fn()
    }, ms)
    timers.push(id); return id
  }
  function stopTimer(id) { clearTimeout(id); let i = timers.indexOf(id); if (i >= 0) timers.splice(i, 1) }
  function setSize(px) {
    let n = normalizeSize(px)
    root.setAttribute('data-size', String(n))
    if (desktop) {
      host.style.width = n + 'px'; host.style.height = n + 'px'
    } else {
      /* 工具页放大 1.5 倍展示；data-size 与桌面数值一致，方便核对。 */
      let previewPx = Math.round(n * 1.5)
      host.style.width = Math.round(previewPx * .75) + 'px'; host.style.height = previewPx + 'px'
    }
    return n
  }
  function setFrame(frame) {
    let row = frame[0], col = frame[1]
    let pos = (col * 20) + '% ' + (row * (100 / 6)) + '%'
    root.setAttribute('data-frame', row + ':' + col)
    let next = hasFrame ? 1 - front : front
    let incoming = layers[next], outgoing = layers[1 - next]
    incoming.style.backgroundPosition = pos
    if (!hasFrame || dndOn || reduced) {
      /* 首帧和免打扰不做延迟/淡入，保证任何时刻都有完整角色，不闪空帧。 */
      layers.forEach(function (layer) { layer.style.transition = 'none' })
      incoming.style.opacity = '1'; outgoing.style.opacity = '0'
      layers.forEach(function (layer) { layer.style.transition = '' })
    } else {
      incoming.style.opacity = '1'; outgoing.style.opacity = '0'
    }
    front = next; hasFrame = true
  }
  function stopFrames() { if (frameTimer) stopTimer(frameTimer); frameTimer = 0 }
  function runAction(name, onDone) {
    stopFrames()
    let def = ACTIONS[name] || ACTIONS.idle
    root.style.setProperty('--dwm-fade', (def.fade || 180) + 'ms')
    setFrame(def.frames[0])
    if (dndOn || reduced) { if (onDone) onDone(); return }
    /* 单帧动作（跳跃）也要保留到 CSS 动作结束，不能刚设 data-move 就立刻复原。 */
    if (def.frames.length < 2) {
      if (onDone) frameTimer = later(onDone, def.interval * (def.cycles || 1))
      return
    }
    let index = 0, count = 1
    let total = def.loop ? Infinity : def.frames.length * (def.cycles || 1)
    function tick() {
      index = (index + 1) % def.frames.length
      setFrame(def.frames[index]); count++
      if (count >= total) { frameTimer = 0; if (onDone) onDone(); return }
      frameTimer = later(tick, def.interval)
    }
    frameTimer = later(tick, def.interval)
  }
  function playAction(name, onDone) {
    stopFrames()
    let from = visualAction
    visualAction = name
    let bridge = (dndOn || reduced) ? [] : makeBridge(from, name)
    if (!bridge.length) {
      root.classList.remove('is-bridging'); root.removeAttribute('data-transition'); root.removeAttribute('data-bridge-index')
      runAction(name, onDone); return
    }
    root.classList.add('is-bridging')
    root.setAttribute('data-transition', from + '>' + name)
    root.style.setProperty('--dwm-fade', BRIDGE_FADE + 'ms')
    let index = 0
    function step() {
      if (disposed) return
      if (index >= bridge.length) {
        root.classList.remove('is-bridging'); root.removeAttribute('data-transition'); root.removeAttribute('data-bridge-index')
        runAction(name, onDone); return
      }
      root.setAttribute('data-bridge-index', String(index))
      setFrame(bridge[index++])
      frameTimer = later(step, BRIDGE_MS)
    }
    step()
  }
  function scheduleIdle() {
    if (idleTimer) stopTimer(idleTimer)
    idleTimer = 0
    if (disposed || dndOn || reduced || state !== 'idle' || root.hasAttribute('data-move')) return
    idleTimer = later(function () {
      idleTimer = 0
      if (state === 'idle' && !root.hasAttribute('data-move')) playMove()
    }, 5200 + Math.random() * 3000)
  }
  function applyState(s) {
    state = String(s || 'idle')
    root.setAttribute('data-state', state)
    root.removeAttribute('data-move')
    if (idleTimer) stopTimer(idleTimer)
    idleTimer = 0
    playAction(ACTIONS[state] ? state : 'idle')
    scheduleIdle()
  }
  function playMove(name) {
    if (disposed || dndOn || reduced || state !== 'idle') return false
    if (!ACTIONS[name] || name === 'idle' || name === 'thinking' || name === 'working' || name === 'done' || name === 'sleep') {
      let pool = IDLE_MOVES.filter(function (k) { return recent.indexOf(k) < 0 })
      name = pool[Math.floor(Math.random() * pool.length)] || 'wave'
    }
    recent.push(name); if (recent.length > 2) recent.shift()
    if (idleTimer) stopTimer(idleTimer)
    idleTimer = 0
    root.setAttribute('data-move', name)
    playAction(name, function () { if (!disposed && state === 'idle') applyState('idle') })
    return true
  }
  function onDown() { if (!disposed && state === 'idle') playMove('hop') }
  host.addEventListener('pointerdown', onDown)
  setSize(readSize())
  applyState('idle')
  return {
    el: root,
    setState: function (s) { if (!disposed) applyState(s) },
    notify: function (on) { if (!disposed) root.classList.toggle('has-badge', !!on) },
    setDnd: function (on) {
      if (disposed) return
      dndOn = !!on; root.classList.toggle('dnd', dndOn)
      if (dndOn) {
        stopFrames(); if (idleTimer) stopTimer(idleTimer)
        idleTimer = 0; root.removeAttribute('data-move')
        root.classList.remove('is-bridging'); root.removeAttribute('data-transition'); root.removeAttribute('data-bridge-index')
        visualAction = state
        let def = ACTIONS[state] || ACTIONS.idle; setFrame(def.frames[0])
      } else applyState(state)
    },
    playMove: playMove,
    setSize: function (px) { return disposed ? SIZE_DEFAULT : setSize(px) },
    destroy: function () {
      if (disposed) return
      disposed = true
      timers.forEach(function (t) { clearTimeout(t) }); timers = []
      frameTimer = 0; idleTimer = 0
      host.removeEventListener('pointerdown', onDown)
      host.innerHTML = ''
      if (desktop) { host.style.width = oldWidth; host.style.height = oldHeight }
    }
  }
}

function applyDesktopSize(px) {
  let n = normalizeSize(px)
  let fab = document.getElementById('copilot-fab')
  let A = window.AiOrb
  if (fab && A && A.activeSkin && A.activeSkin() === SKIN_KEY && fab.querySelector('.dwm-skin')) {
    fab.style.width = n + 'px'; fab.style.height = n + 'px'
    fab.querySelector('.dwm-skin').setAttribute('data-size', String(n))
  }
}

function registerWhale() {
  let A = window.AiOrb
  if (!A || typeof A.registerSkin !== 'function') return false
  A.registerSkin({ key: SKIN_KEY, name: 'DeepSeek 鲸鱼娘 · 原版', css: SKIN_CSS, mount: mountWhale })
  try {
    let pref = String((A.prefs() || {}).skin || '')
    if (pref === SKIN_KEY && A.activeSkin && A.activeSkin() !== SKIN_KEY) A.setSkin(SKIN_KEY)
  } catch (e) { }
  return true
}

let PAGE_CSS = `
.dwm-head{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:5px}.dwm-title{font-size:15px;font-weight:700}
.dwm-mark{font-size:23px;line-height:1;display:inline-block}.dwm-unofficial{font-size:10px;padding:2px 7px;border-radius:10px;background:#E8F1FF;color:#3657A7}
.dwm-layout{display:grid;grid-template-columns:minmax(190px,.9fr) minmax(210px,1.1fr);gap:14px;margin-top:12px;align-items:stretch}
.dwm-stage-card{position:relative;min-height:270px;border:1px solid var(--line);border-radius:16px;overflow:hidden;background:radial-gradient(circle at 50% 30%,#fff 0,#EDF6FF 52%,#DCE9FF 100%);display:flex;align-items:center;justify-content:center}
.dwm-stage-card::before,.dwm-stage-card::after{content:'';position:absolute;border:1px solid rgba(99,151,226,.22);border-radius:50%;width:180px;height:180px}
.dwm-stage-card::after{width:230px;height:230px}.dwm-preview{position:relative;width:174px;height:232px;z-index:1}
.dwm-current{position:absolute;left:10px;top:9px;z-index:2;font-size:10px;color:#4B6593;background:rgba(255,255,255,.8);padding:3px 8px;border-radius:10px}
.dwm-controls{display:flex;flex-direction:column;gap:12px}.dwm-label{font-size:11px;font-weight:600;opacity:.66;margin-bottom:5px}
.dwm-size-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.dwm-size-value{font:600 11px/1.2 var(--font-mono,monospace);color:#526BC2;font-variant-numeric:tabular-nums}
.dwm-size-range{display:block;width:100%;height:24px;margin:0;accent-color:#5A78E8;cursor:pointer}.dwm-size-range:focus-visible{outline:2px solid #5A78E8;outline-offset:2px;border-radius:6px}
.dwm-size-scale{display:flex;justify-content:space-between;font-size:9px;opacity:.55;margin-top:-3px}
.dwm-buttons{display:flex;gap:6px;flex-wrap:wrap}.dwm-note{font-size:11px;line-height:1.65;opacity:.68;margin-top:12px}
.dwm-on{border-color:#5A78E8!important;box-shadow:0 0 0 2px rgba(77,124,254,.12)}
@media(max-width:560px){.dwm-layout{grid-template-columns:1fr}.dwm-stage-card{min-height:258px}.dwm-controls{gap:9px}}
`
let pageCssReady = false
function ensurePageCss() {
  ensureSkinCss()
  if (pageCssReady || typeof document === 'undefined') return
  if (document.head.querySelector('style[data-whale-muse-page]')) { pageCssReady = true; return }
  let st = document.createElement('style')
  st.setAttribute('data-whale-muse-page', '1')
  st.textContent = PAGE_CSS
  document.head.appendChild(st)
  pageCssReady = true
}

let STATES = [['idle', '待机'], ['thinking', '思考'], ['working', '写代码'], ['done', '完成庆祝'], ['sleep', '睡眠']]
let EXTRA_MOVES = [['wave', '元气挥手'], ['rice', '吃白饭'], ['spin', '转圈展示'], ['hop', '开心跳跃'], ['pan', '头顶铁锅'], ['wiggle', '卖萌摇摆']]

PluginBus.register({
  id: PLUGIN_ID,
  name: 'DeepSeek 鲸鱼娘 · 原版',
  version: '1.2.0',
  author: '内置 · 非官方同人',
  desc: '开源 Q 版女仆鲸鱼娘：56–168 px 尺寸调节、五种状态、六种互动，以及手排原画真帧过渡。',
  init: function () { registerWhale() },
  tools: [{
    id: PLUGIN_ID,
    title: '鲸鱼娘皮肤',
    icon: MARK_TILE,
    render: function () {
      if (!window.AiOrb) return '<div class="muted-sm">window.AiOrb 未就绪，无法安装悬浮球皮肤。</div>'
      ensurePageCss()
      let states = STATES.map(function (s) { return '<button class="btn btn-ghost btn-sm" data-dwm-state="' + s[0] + '">' + s[1] + '</button>' }).join('')
      let moves = EXTRA_MOVES.map(function (m) { return '<button class="btn btn-ghost btn-sm" data-dwm-move="' + m[0] + '">' + m[1] + '</button>' }).join('')
      let size = readSize()
      return '<div class="card">'
        + '<div class="dwm-head"><span class="dwm-mark">' + MARK_TILE + '</span><span class="dwm-title">DeepSeek 鲸鱼娘 · 原版</span><span class="dwm-unofficial">开源社区形象 · 非官方</span></div>'
        + '<div class="muted-sm">蓝色渐变长发、呆毛、鲸鳍、大鲸尾和女仆装——使用社区开源 Q 版图集，不是近似替代角色。</div>'
        + '<div class="dwm-layout"><div class="dwm-stage-card" data-dwm-card><span class="dwm-current" data-dwm-current>实时预览</span><div class="dwm-preview" data-dwm-preview></div></div>'
        + '<div class="dwm-controls"><div><div class="dwm-size-head"><label class="dwm-label">桌面尺寸</label><output class="dwm-size-value" data-dwm-size-value>' + size + ' px</output></div>'
        + '<input class="dwm-size-range" data-dwm-size type="range" aria-label="鲸鱼娘桌面尺寸" min="' + SIZE_MIN + '" max="' + SIZE_MAX + '" step="4" value="' + size + '"><div class="dwm-size-scale"><span>小巧 56</span><span>超大 168</span></div></div>'
        + '<div><div class="dwm-label">AI 业务状态</div><div class="dwm-buttons">' + states + '</div></div>'
        + '<div><div class="dwm-label">娱乐动作（待机时也会随机出现）</div><div class="dwm-buttons">' + moves + '</div></div>'
        + '<div class="dwm-buttons"><button class="btn btn-primary btn-sm" data-dwm-wear>穿上鲸鱼娘</button><button class="btn btn-ghost btn-sm" data-dwm-flow>播放状态流</button></div>'
        + '</div></div>'
        + '<div class="dwm-note">尺寸会记住，并同步到已穿上的桌面鲸鱼娘。动作切换使用手排原画真帧：收电脑、起身、抬手、举锅、转身等中间姿势都会实际播放，交叉淡化只负责消除帧间硬切。<br>桌面点击会开心跳跃；通知红点和免打扰沿用悬浮球公开契约。免打扰停掉帧动画与循环动作，但保留当前状态姿势。<br>角色：上善无形「溟月」→ ZipZipPipe 女仆二创 → 这个刀子真甜 Q 版原型；图集来自 JAdpp/dsh-whale-galgame。美术按 CC BY-NC-SA 4.0 署名、非商业、相同方式共享，完整 NOTICE 随素材附带。</div></div>'
    },
    mount: function (el, ctx) {
      let A = window.AiOrb
      if (!A) return
      ensurePageCss(); registerWhale()
      let preview = mountWhale(el.querySelector('[data-dwm-preview]'))
      let timers = []
      function later(fn, ms) { let t = setTimeout(fn, ms); timers.push(t); return t }
      function clearFlow() { timers.forEach(function (t) { clearTimeout(t) }); timers = [] }
      function setState(s) { clearFlow(); preview.setState(s); let cur = el.querySelector('[data-dwm-current]'); if (cur) cur.textContent = '预览 · ' + s }
      function paintWear() {
        let on = A.activeSkin && A.activeSkin() === SKIN_KEY
        let b = el.querySelector('[data-dwm-wear]'); if (b) b.textContent = on ? '已穿上 · 点击重挂' : '穿上鲸鱼娘'
        let card = el.querySelector('[data-dwm-card]'); if (card) card.classList.toggle('dwm-on', !!on)
      }
      let sizeRange = el.querySelector('[data-dwm-size]')
      if (sizeRange) sizeRange.oninput = function () {
        let n = writeSize(sizeRange.value)
        preview.setSize(n); applyDesktopSize(n)
        let out = el.querySelector('[data-dwm-size-value]'); if (out) out.textContent = n + ' px'
      }
      el.querySelectorAll('[data-dwm-state]').forEach(function (b) { b.onclick = function () { setState(b.getAttribute('data-dwm-state')) } })
      el.querySelectorAll('[data-dwm-move]').forEach(function (b) { b.onclick = function () { preview.setState('idle'); preview.playMove(b.getAttribute('data-dwm-move')) } })
      let wear = el.querySelector('[data-dwm-wear]')
      if (wear) wear.onclick = function () {
        if (!registerWhale()) { ctx.Toast.show('皮肤注册表不可用', 'warn', 2200); return }
        let ok = A.setSkin(SKIN_KEY)
        ctx.Toast.show(ok ? '原版鲸鱼娘已换上' : '换装失败：皮肤未注册', ok ? 'success' : 'warn', 2000)
        paintWear()
      }
      let flow = el.querySelector('[data-dwm-flow]')
      if (flow) flow.onclick = function () {
        setState('thinking')
        later(function () { preview.setState('working') }, 1200)
        later(function () { preview.setState('done') }, 2500)
        later(function () { preview.setState('idle') }, 4400)
      }
      paintWear()
      return function () { clearFlow(); preview.destroy() }
    }
  }],
  onDisable: function () {
    try {
      let A = window.AiOrb
      if (A && A.activeSkin && A.activeSkin() === SKIN_KEY) A.setSkin('yali')
    } catch (e) { }
  }
})
})();
