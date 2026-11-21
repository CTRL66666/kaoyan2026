/* 鸦荔开屏动画逻辑 —— 从 yali-splash-demo-v2.html 抽取（2026-11-21）
 * ⚠ 这是**原样搬运的 demo 逻辑**，尚未接入真实加载态（仍在用 setTimeout 模拟）。
 * 下一步要做的改动（见 demo 头部注释第四节）：
 *   1. finish 定时器 → 换成就绪 Promise；
 *   2. beginLoading 的 tasks → 换真实任务状态；
 *   3. #ai-orb-target → 换成教练悬浮窗真实节点；
 *   4. 卸载时清理 timers / raf / 监听 / 飞行层。
 */
(function () {
      var template = document.getElementById('splash-template');
      var replay = document.getElementById('replay');
      /*
        全局只保存当前实例的控制句柄。
        timers：所有延时任务，重播时统一清除。
        raf：当前路径或进度动画，重播时取消。
        started：本次播放起点，用于 Demo 进度模拟。
        loadMode：normal 或 fast，只用于 Demo；正式版可改为真实就绪策略。
      */
      var timers = [], raf = 0, started = 0;
      /* 【2026-11-21 更正】demo 的两种方案**不是**"首次 / 之后"，而是**按加载快慢自适应**：
       *   · 加载**慢**（数据多的用户）→ 完整 2950ms **连贯动画**，正好覆盖等待，**绝不加速**；
       *   · 加载**快** → 前奏跑够一个最短连贯段后就收束，别让人干等 3 秒。
       *
       * 之前按 localStorage「看过没」来选是**误读**：老用户固定走 fast，
       * 而他们往往正是数据多、加载慢的那批人 —— 1 秒前奏结束后就静止等加载，
       * 于是有了"动画和加载不并行、堵塞"的观感。
       *
       * 现在：起始一律 `normal`（完整连贯），由 ready 的到达时机动态收束。
       * 只有一条路线：完整前奏 2950ms（demo 的 normal 时间轴）。
       * 不存在"边播边判断要不要加速"的第三态 —— 那正是我上一版犯的错。 */
      var PRELUDE_FULL = 2950;   // demo 完整前奏：0 → 2950 一镜到底
      var loadMode = 'normal';

      /* ══════════════════════════════════════════════════════════════════════
       * window.__SPLASH —— 业务侧与启动屏之间的**唯一桥**（2026-11-21 接入）
       *
       * 设计原则：启动屏**不主动探测**业务状态，而是由业务侧推进 + 查询。
       * 理由：启动屏在 index.html 里、业务在 main.ts 里，前者早于后者执行；
       * 反过来"启动屏去猜业务进行到哪一步"必然要写超时和轮询，那种猜测永远错。
       *
       * 用法（业务侧）：
       *   window.__SPLASH.stage('加载词库', 62, 2)   // 推进真实阶段（可选）
       *   window.__SPLASH.ready()                    // 首屏**可交互**时调用，只调一次
       * 用法（启动屏）：轮询 isReady() / state()，ready 后立刻 exitNow（不留庆祝停留）。
       * ══════════════════════════════════════════════════════════════════════ */
      var SPLASH_API = {
        _ready: false,
        _readyReal: false,   // true=真正加载完成（可加速退场）；false=超时兜底（不算完成）
        _stage: { label: '正在准备你的学习空间', pct: 40, index: 0, total: 0 },
        /** 首屏可交互：业务侧调用。`real=false` 表示这是**超时兜底**而非真的加载完成
         *  —— 两者必须分开：只有真完成才允许"加速退场"，
         *  否则重型用户会被 2.5s 兜底误判、把 3 秒动画砍成 2.5 秒。 */
        ready: function (real) { this._ready = true; if (real !== false) this._readyReal = true; },
        isReady: function () { return !!this._ready; },
        /** 只有"真的加载完了"才允许提前收束 */
        isReadyReal: function () { return !!this._readyReal; },
        /** 推进真实阶段：label 文案、pct 目标进度、index 第几段（1 基） */
        /** 推进真实阶段：label 文案 / pct 目标进度 / index 第几项 / total 总项数 */
        stage: function (label, pct, index, total) {
          this._stage = {
            label: label || this._stage.label,
            pct: typeof pct === 'number' ? Math.max(0, Math.min(100, pct)) : this._stage.pct,
            index: typeof index === 'number' ? index : this._stage.index,
            total: typeof total === 'number' ? total : this._stage.total,
          };
        },
        state: function () { return this._stage; },
        /**
         * 【2026-11-21 排程】等动画进入"静止等待态"（蓝鸟 + 进度条阶段）。
         * 那一刻起，画面只剩合成属性的微动效（opacity/transform），**不需要主线程重绘** ——
         * 真正的重型初始化应该在这之后开始，否则会和"描边动画"抢主线程，
         * 表现为"线条画一半卡住"（用户实测）。
         */
        _docked: false,
        _dockedWaiters: [],
        whenDocked: function () {
          var self = this;
          if (self._docked) return Promise.resolve();
          return new Promise(function (res) { self._dockedWaiters.push(res); });
        },
        _markDocked: function () {
          var self = this;
          if (self._docked) return;
          self._docked = true;
          var ws = self._dockedWaiters || [];
          self._dockedWaiters = [];
          ws.forEach(function (r) { try { r(); } catch (e) { /* 回调异常不影响动画 */ } });
        },
      };
      window.__SPLASH = SPLASH_API;

      /* 所有延时必须经 later() 登记，否则重播或组件卸载后旧回调可能继续操作 DOM。 */
      function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

      /* 同时服务于 CSS 媒体查询与 JS 快速落位；不要在 JS 中另写一套断点判断。 */
      function reduced() {
        try { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
        catch (e) { return false; }
      }

      /*
        唯一的进度显示出口。正式接入可直接传入真实百分比。
        scaleX 只触发合成，百分比使用整数；100 只能由真实就绪流程给出。
      */
      function setProgress(pct) {
        var bar = document.getElementById('boot-bar'), num = document.getElementById('boot-num');
        if (bar) bar.style.transform = 'scaleX(' + (pct / 100).toFixed(3) + ')';
        if (num) num.textContent = Math.round(pct) + '%';
      }

      /*
        Demo 的前奏进度模拟：普通模式到 38，极速模式到 90。
        正式接入可整段删除，真实资源进度应来自业务任务，而不是 elapsed 时间。
      */
      function tick(now) {
        /* 首帧到来才认定"动画开始"：这一刻浏览器已经能画了，
         * 之前被主线程占掉的时间不该算进动画时长。 */
        if (!started) started = now;
        var elapsed = now - started;
        var duration = loadMode === 'fast' ? 1000 : 2950;
        var cap = loadMode === 'fast' ? 90 : 38;
        setProgress(Math.min(cap, 6 + elapsed / duration * (cap - 6)));
        if (elapsed < duration) raf = requestAnimationFrame(tick);
      }

      /*
        初始化与重播的统一入口，清理顺序有意义：
        1. 取消旧 rAF 和定时器。
        2. 删除旧启动屏与飞行层，阻止旧 settle() 再接管目标。
        3. 清空悬浮窗中的旧角色，并移除 is-arrived。
        4. 从模板生成新启动屏，再启动本次进度和首帧时间轴。
      */
      function play() {
        cancelAnimationFrame(raf);
        timers.forEach(clearTimeout); timers = [];
        /* ══════════════════════════════════════════════════════════════════
         * 【2026-11-21 审查·白屏防御】模板缺失/为空时**必须立刻放弃**。
         *
         * 下面第一件事就是 `old.remove()` 删掉旧启动屏，再插入模板内容。
         * 如果 `#splash-template` 不存在或内容是空的（典型场景：浏览器缓存了
         * 旧版 index.html，而 splash.js 是新版 —— PWA 更新时必然出现一次），
         * 结果就是「旧屏删了、新屏是空的」= **整页白屏**。
         *
         * 而且此时 `window.__SPLASH` 是存在的，业务侧的 `__BOOT_READY` 会
         * 看到它就把离场权交出来并 return —— **没有任何人负责关屏**。
         *
         * 所以：模板不合格 → 把 `__SPLASH` 置空（明确告诉业务侧"动画不可用"）
         * → `__BOOT_READY` 走原来的淡出逻辑 → 至少能进应用。
         * **宁可没有开屏动画，也不能白屏。**
         * ══════════════════════════════════════════════════════════════════ */
        var tplEl = document.getElementById('splash-template');
        if (!tplEl || String(tplEl.innerHTML || '').trim().length < 200) {
          try { window.__SPLASH = null; } catch (e) { /* 冻结环境忽略 */ }
          return;
        }
        var old = document.getElementById('boot-splash');
        if (old) old.remove();
        document.querySelectorAll('.boot-flight-layer').forEach(function (layer) { layer.remove(); });
        /* 落点节点此时可能还不存在（教练悬浮窗要等 Vue 挂载）—— 判空即可，
         * 真正的落点解析在 landOrb() 的 resolveOrbTarget() 里（含右下角兜底）。 */
        var orbTarget = document.getElementById('ai-orb-target');
        if (orbTarget) {
          orbTarget.innerHTML = '';
          orbTarget.classList.remove('is-arrived');
        }
        document.body.insertAdjacentHTML('afterbegin', template.innerHTML);
        document.querySelectorAll('[data-load-mode]').forEach(function (button) {
          var active = button.getAttribute('data-load-mode') === loadMode;
          button.classList.toggle('is-active', active);
          button.setAttribute('aria-pressed', String(active));
        });
        /* ⚠ 这里**不能**取 `performance.now()` 当作动画起点。
         * 主线程如果在插入 DOM 后被业务初始化占住（数据重的用户实测 3 秒），
         * 浏览器会延后到**能绘制时**才开始动画 —— 而 started 却停留在 3 秒前。
         * 结果：`elapsed` 一上来就 > PRELUDE_FULL → 动画刚出现就被 finish() 掐断
         * （用户实测"等 3 秒才出线条，然后 1 秒就结束"就是这个）。
         * 改为 0 = 未开始，由首个 rAF 回调赋值 —— 那才是动画真正跑起来的时刻。 */
        started = 0;
        if (reduced()) {
          setProgress(100);
          later(finish, 500);
          return;
        }
        raf = requestAnimationFrame(tick);
        /* 【2026-11-21 回退到 demo 原始节奏】前奏**一律完整播满 PRELUDE_FULL（2950ms）**。
         *
         * 我之前在这里加了"ready 早到就 900ms 收束"的自适应 —— **那是错的**：
         *   · `__BOOT_READY` 有 2.5s 兜底，重型用户的 ready 往往在 2.5s 就置真，
         *     于是前奏刚画 900ms 就被 finish() 掐断 → 三秒动画压成 0.9s → 用户看到的
         *     就是"线条还没画完就急忙退出"。
         *   · demo 的设计语言从来是**两条明确路线**：极速（手动选，1s）/ 完整（3s 一镜到底），
         *     不存在"边播边判断要不要加速"这种第三态。
         *
         * 所以：不看 ready，跑满 2950ms 再说。加载慢的用户正是需要这段时间被动画填满的人。
         * 加载快的情况交给下游 —— 形变结束后 beginLoading 一看到 ready 就立刻退出，
         * 那时才该"快"。 */
        /* 【2026-11-21 用户定的规则，最后一遍确认版】
         *   起屏就开始画线条；
         *   **3 秒正常动画内**，若用户加载提前完毕 → 立刻像急速模式一样加速退场；
         *   否则（重型用户）→ 正常跑满 3 秒，**不加速**。
         *
         * 所以加速的触发条件只有两个同时成立：`isReady()` 且已播够一个最短连贯段。
         * MIN_BEFORE_FAST 取 420ms：轻用户的 ready 通常 300~600ms 就到，
         * 这时线条刚画起来、画面已经"成立"，收束不会被看成闪切。
         * 重用户的 ready 在 2.5s 兜底之后才来 —— 那时早过了 420ms，
         * 但**关键是他们走的是第二条分支**：只有 `elapsed >= 2950` 才会 finish，
         * 所以前奏不会被砍（上一版把加速整个删掉是矫枉过正，轻用户被迫硬等）。 */
        var MIN_BEFORE_FAST = 420;
        var _finished = false;
        function tryFinish() {
          if (_finished || !document.getElementById('boot-splash')) return;
          if (!started) { later(tryFinish, 60); return; }   // 首帧没画出来，计时无意义
          var elapsed = performance.now() - started;
          var api = window.__SPLASH;
          /* 注意用 isReadyReal：超时兜底（isReady 为真但 isReadyReal 为假）**不触发加速**，
           * 重型用户必须走完 3 秒完整前奏。 */
          if (api && api.isReadyReal && api.isReadyReal() && elapsed >= MIN_BEFORE_FAST) {
            _finished = true;
            finish(true);          // 加载已完成 → 加速退场（急速模式节奏）
            return;
          }
          if (elapsed >= PRELUDE_FULL) {
            _finished = true;
            finish(false);         // 加载没完成 → 完整 3 秒，不加速
            return;
          }
          later(tryFinish, 60);
        }
        tryFinish();
      }
      function clamp(n) { return Math.max(0, Math.min(1, n)); }
      function smooth(n) { n = clamp(n); return n * n * (3 - 2 * n); }
      function mix(a, b, t) { return a + (b - a) * t; }
      function mixColor(a, b, t) {
        var av = a.match(/[a-f\d]{2}/gi).map(function (n) { return parseInt(n, 16); });
        var bv = b.match(/[a-f\d]{2}/gi).map(function (n) { return parseInt(n, 16); });
        return '#' + av.map(function (n, i) { return Math.round(mix(n, bv[i], t)).toString(16).padStart(2, '0'); }).join('');
      }
      /*
        路径插值器：提取 from 的全部数字，按顺序与 to 的数字一一混合。
        前提：两条路径命令完全同构、数字数量相同。否则应修正路径，而不是在这里补默认值。
      */
      function mixPath(el, from, to, t) {
        var a = from.match(/-?\d*\.?\d+/g).map(Number);
        var b = to.match(/-?\d*\.?\d+/g).map(Number);
        var i = 0;
        el.setAttribute('d', from.replace(/-?\d*\.?\d+/g, function () {
          var value = mix(a[i], b[i], t); i += 1; return value.toFixed(2);
        }));
      }
      function animateMorph(splash, done, morphDuration, reverse) {
        var body = splash.querySelector('.morph-body');
        var nearEye = splash.querySelector('.morph-eye-near');
        var farEye = splash.querySelector('.morph-eye-far');
        var beak = splash.querySelector('.morph-beak');
        var belly = splash.querySelector('.morph-belly');
        var farBlush = splash.querySelector('.morph-blush-far');
        var headLeaf = splash.querySelector('.morph-head-leaf');
        var shapes = [
          [body, 'M256 150 C322 150 366 202 366 268 C366 300 386 330 404 350 C370 350 284 350 250 350 C196 350 158 318 150 262 C143 212 190 150 256 150 Z'],
          [headLeaf, 'M256 92 C244 78 226 76 216 84 C226 96 244 98 256 92 Z'],
          [nearEye, 'M196 208 C196 200 202 194 210 194 C218 194 224 200 224 208 C216 208 204 208 196 208 C196 208 196 208 196 208 Z'],
          [farEye, 'M196 208 C196 208 196 208 196 208 C196 208 196 208 196 208 C196 208 196 208 196 208 C196 208 196 208 196 208 Z'],
          [beak, 'M158 206 L110 224 L158 244 Z'],
          [belly, 'M151 296 C160 334 200 350 238 350 C206 338 180 314 172 280 C162 284 154 289 151 296 C151 296 151 296 151 296 Z'],
          [farBlush, 'M151 296 C151 296 151 296 151 296 C151 296 151 296 151 296 C151 296 151 296 151 296 C151 296 151 296 151 296 Z']
        ];
        var bookColors = [];
        var bookParts = [
          ['.morph-book-pages', 'M104 376 L256 356 L408 376 L408 398 L256 378 L104 398 Z', '#FFFEF9', '#FFFFFF'],
          ['.morph-book-left', 'M104 398 L256 378 L256 400 L104 420 Z', '#FFFEF9', '#0B1C2C'],
          ['.morph-book-right', 'M256 378 L408 398 L408 420 L256 400 Z', '#FFFEF9', '#8E4626'],
          ['.morph-book-spine', 'M251 356 L261 356 L261 400 L251 400 Z', '#FF7A95', '#8E4626'],
          ['.morph-book-line-left', 'M230 344 L239 344 L239 378 L230 378 Z', '#DCE7F3', '#8E4626'],
          ['.morph-book-line-right', 'M262 344 L271 344 L271 378 L262 378 Z', '#F4DCE2', '#8E4626']
        ];
        bookParts.forEach(function (part) {
          var el = splash.querySelector(part[0]);
          shapes.push([el, part[1]]); bookColors.push([el, part[2], part[3]]);
        });
        shapes.forEach(function (item) {
          var el = item[0];
          if (!el.hasAttribute('data-front-d')) el.setAttribute('data-front-d', el.getAttribute('d'));
          item.push(el.getAttribute('d'));
          if (reverse) item[1] = el.getAttribute('data-front-d');
        });
        var yali = splash.querySelector('.boot-yali');
        var disc = splash.querySelector('.morph-disc');
        var book = splash.querySelector('.morph-book');
        var fruitPosition = splash.querySelector('.morph-fruit-position');
        var fruitSkin = splash.querySelector('.morph-fruit-skin');
        var fruitSpots = splash.querySelector('.morph-fruit-spots');
        var spotCircles = fruitSpots.querySelectorAll('circle');
        var spotFrom = [[-20,-16.8,8.8],[7.2,-21.6,8.8],[24.8,.8,8.8],[-7.2,12,8.8],[15.2,21.6,8.8],[-20,24.8,8.8],[0,22,.001],[20,14,.001]];
        var spotTo = [[-12,-10,4],[6,-14,4],[18,-2,4],[-6,6,4],[10,12,4],[-18,4,3.5],[0,22,3.5],[20,14,3.5]];
        var stem = splash.querySelector('.morph-stem');
        var rightLeaf = splash.querySelector('.morph-leaf-right');
        var tufts = splash.querySelectorAll('.morph-tuft');
        var begin = 0, duration = morphDuration || 525;
        function frame(now) {
          if (!begin) begin = now;
          var raw = clamp((now - begin) / duration), t = smooth(raw), u = reverse ? 1 - t : t;
          shapes.forEach(function (item) { mixPath(item[0], item[2], item[1], t); });
          bookColors.forEach(function (item) { item[0].setAttribute('fill', mixColor(item[1], item[2], u)); });
          body.setAttribute('fill', mixColor('#24262E', '#0B1C2C', u));
          body.setAttribute('stroke-width', (10 * (1 - u)).toFixed(2));
          nearEye.setAttribute('fill', mixColor('#FF9DB0', '#FFFFFF', u));
          beak.setAttribute('fill', mixColor('#F6C453', '#FFFFFF', u));
          belly.setAttribute('fill', mixColor('#FF9DB0', '#FFFFFF', u));
          belly.setAttribute('opacity', mix(.55, 1, u).toFixed(3));
          farBlush.setAttribute('opacity', (.55 * (1 - u)).toFixed(3));
          tufts.forEach(function (tuft) {
            var box = tuft.getBBox();
            var growth = smooth(raw * 1.35), s = Math.max(.001, reverse ? growth : 1 - growth);
            var x = box.x + box.width / 2, y = box.y + box.height;
            tuft.setAttribute('transform', 'translate(' + x + ' ' + y + ') scale(' + s + ') translate(' + (-x) + ' ' + (-y) + ')');
          });
          headLeaf.setAttribute('fill', mixColor('#3FAE6E', '#43A047', u));
          fruitPosition.setAttribute('transform', 'translate(' + mix(442.9,256,u) + ' ' + mix(56.7,122,u) + ') scale(' + mix(1.52,1,u) + ')');
          fruitSkin.setAttribute('fill', mixColor('#FF7A95', '#C0392B', u));
          fruitSkin.setAttribute('stroke-width', (4.67 * (1 - u)).toFixed(2));
          fruitSpots.setAttribute('fill', mixColor('#FFB0BF', '#96281B', u));
          spotCircles.forEach(function (circle, i) {
            circle.setAttribute('cx', mix(spotFrom[i][0], spotTo[i][0], u));
            circle.setAttribute('cy', mix(spotFrom[i][1], spotTo[i][1], u));
            circle.setAttribute('r', mix(spotFrom[i][2], spotTo[i][2], u));
          });
          stem.style.opacity = (reverse ? 1 - smooth(raw * 1.4) : smooth(raw * 1.4)).toFixed(3);
          rightLeaf.setAttribute('fill', mixColor('#3FAE6E', '#2E7D32', u));
          rightLeaf.setAttribute('transform', 'translate(0 -30) scale(' + mix(.325,1,u) + ') translate(0 30) rotate(' + mix(-22,0,u) + ')');
          disc.style.opacity = (reverse ? 1 - smooth(raw * 1.25) : smooth(raw * 1.25)).toFixed(3);
          var discScale = mix(.18, 1, u);
          disc.setAttribute('transform', 'translate(256 256) scale(' + discScale + ') translate(-256 -256)');
          book.style.opacity = reverse ? (1 - t).toFixed(3) : '1';
          if (!reverse) yali.style.transform = 'translate(-50%,-50%) scale(' + mix(1, 2 / 3, t) + ')';
          if (raw < 1) raf = requestAnimationFrame(frame);
          else if (done) done();
        }
        raf = requestAnimationFrame(frame);
      }
      function setLoadingLabel(splash, text, index, total) {
        var label = splash.querySelector('#boot-load-label');
        var counter = splash.querySelector('#boot-load-index');
        if (label) {
          label.textContent = text;
          label.animate([
            { opacity: 0, transform: 'translateY(4px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ], { duration: 260, easing: 'ease-out' });
        }
        /* 【2026-11-21 用户要求】不再硬编码 "00 / 04"（那是 demo 的四段模拟）。
         * 有真实总数才显示 "03 / 22"；没有就**整块不显示** —— 宁可少一行，
         * 也不要给用户一个和实际无关的假计数。 */
        if (counter) {
          var t = (typeof total === 'number' && total > 0) ? total : 0;
          counter.textContent = t > 0
            ? String(index).padStart(2, '0') + ' / ' + String(t).padStart(2, '0')
            : '';
        }
      }
      /**
       * 落点解析（2026-11-21 接入）：
       *  ① 优先真实教练悬浮窗 —— NoticeOrb 挂载后会给宿主 span 加 `.orb-yali`；
       *  ② 它还没挂载时（首屏极快 / 路由页没渲染），**兜底到屏幕右下角**的临时节点：
       *     宁可落在固定位置，也不能让角色飞到 (0,0) 然后消失（那是最难看的一种收尾）；
       *  ③ 临时节点用完即删，不留痕迹。
       */
      function resolveOrbTarget() {
        var orb = document.querySelector('.orb-yali');
        if (orb) return orb;
        var ph = document.getElementById('ai-orb-target');
        if (!ph) {
          /* 【2026-11-21 用户建议】悬浮球不存在时的兜底落点改成**左上角品牌图标**：
           * 右下角是"凭空出现"，用户会问"这鸟哪来的"；
           * 左上角有产品 logo，飞过去像"回到品牌标识"，语义成立。
           * 如果连 logo 都取不到，再退回右上角固定位置（总有地方落，绝不飞进空气）。 */
          ph = document.createElement('div');
          ph.id = 'ai-orb-target';
          var logo = document.querySelector('.brand-mark, .app-brand img, header img[alt*="鸦荔"], header .logo');
          var box = logo ? logo.getBoundingClientRect() : null;
          if (box && box.width > 8) {
            ph.style.cssText = 'position:fixed;left:' + Math.round(box.left) + 'px;top:' + Math.round(box.top) + 'px;'
              + 'width:' + Math.round(box.width) + 'px;height:' + Math.round(box.height) + 'px;pointer-events:none;z-index:1;';
          } else {
            ph.style.cssText = 'position:fixed;left:18px;top:16px;width:40px;height:40px;pointer-events:none;z-index:1;';
          }
          document.body.appendChild(ph);
          ph.__splashTemp = true;
        }
        return ph;
      }

      function landOrb(splash, fast, instant) {
        var yali = splash.querySelector('.boot-yali');
        var target = resolveOrbTarget();
        if (!yali || !target) return;
        var from = yali.getBoundingClientRect();
        var to = target.getBoundingClientRect();
        var layer = document.createElement('div');
        layer.className = 'boot-flight-layer is-complete' + (fast ? ' is-fast' : '');
        document.body.appendChild(layer);
        layer.appendChild(yali);
        yali.style.left = '0'; yali.style.top = '0';
        yali.style.width = from.width + 'px'; yali.style.height = from.height + 'px';
        yali.style.transformOrigin = '0 0';
        yali.style.transform = 'translate(' + from.left + 'px,' + from.top + 'px)';
        var flight, restored = false, arrived = false, settled = false;
        function settle() {
          if (settled || !restored || !arrived || !layer.parentNode) return;
          settled = true;
          if (flight) flight.cancel();
          /* 【2026-11-21 用户提问：悬浮球可换皮肤（小鸟/机器人…），小鸟飞过去会"串皮肤"】
           * 正解不是"读皮肤再渲染对应角色"（那要把每种皮肤都做成可形变 SVG，工作量爆炸），
           * 而是**只做交接、不占用落点**：
           *   小鸟飞到位置 → 淡出 → 目标自己 `.is-arrived` 出现。
           * 落点里显示的永远是**用户自己选的皮肤**，与启动屏角色无关。
           * 视觉上像"小鸟变形成悬浮球"，实际是两件事在同一位置衔接。 */
          yali.style.transition = 'opacity .22s ease-out, transform .22s ease-out';
          yali.style.opacity = '0';
          yali.style.transform += ' scale(.86)';
          try { target.classList.add('is-arrived') } catch (e) { /* 目标是临时节点也一样 */ }
          later(function () {
            try { yali.remove() } catch (e) { /* ignore */ }
            try { if (layer.parentNode) layer.remove() } catch (e) { /* ignore */ }
          }, 240);
        }
        /* 【2026-11-21 用户提问「这个时候就不用变形了吧？」—— 对，不用。】
         * 兜底落点是**左上角的品牌 logo 位**（临时节点），它不是"AI 入口"，
         * 所以不该走"正脸 → 侧脸"那套形变（侧脸是悬浮球图标的造型）。
         * 这里只做"飞过去 + 缩到落点尺寸 + 淡出"，像被 logo 吸收掉。
         * 顺带修掉用户截图里"小鸟压住『最适合你的工作台』"的问题：
         * 缩放比例按落点尺寸算，不再用固定 52px。 */
        if (target.__splashTemp) {
          var scl = Math.min(1, (to.width || 40) / Math.max(1, from.width));
          yali.style.transition = 'transform .36s cubic-bezier(.4,0,.2,1), opacity .3s ease-out .12s';
          yali.style.transform = 'translate(' + to.left + 'px,' + to.top + 'px) scale(' + scl + ')';
          yali.style.opacity = '0';
          later(function () {
            try { yali.remove() } catch (e) { /* ignore */ }
            try { if (layer.parentNode) layer.remove() } catch (e) { /* ignore */ }
            try { if (target.__splashTemp) target.remove() } catch (e) { /* 临时节点用完即删 */ }
          }, 420);
          return;
        }
        if (instant) {
          animateMorph(layer, function () { restored = true; arrived = true; settle(); }, 1, true);
          return;
        }
        var endScale = to.width / from.width;
        var middleX = to.left - Math.max(32, (to.left - from.left) * .28);
        var middleY = Math.max(to.top + 24, from.top - 104);
        var landingDuration = fast ? 480 : 760;
        animateMorph(layer, function () { restored = true; settle(); }, landingDuration, true);
        flight = yali.animate([
          { transform: 'translate(' + from.left + 'px,' + from.top + 'px) scale(1) rotate(0deg)', opacity: 1 },
          { transform: 'translate(' + (from.left + 8) + 'px,' + (from.top + 14) + 'px) scale(.97) rotate(3deg)', opacity: 1, offset: .16 },
          { transform: 'translate(' + middleX + 'px,' + middleY + 'px) scale(' + mix(1, endScale, .72) + ') rotate(-6deg)', opacity: 1, offset: .62 },
          { transform: 'translate(' + to.left + 'px,' + to.top + 'px) scale(' + endScale + ') rotate(0deg)', opacity: 1 }
        ], { duration: landingDuration, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' });
        flight.onfinish = function () { arrived = true; settle(); };
      }
      function exitNow(splash, fast) {
        if (!splash.parentNode) return;
        setProgress(100);
        splash.classList.add('is-ready');
        setLoadingLabel(splash, 'Workspace ready', 4);
        var readyTip = splash.querySelector('#boot-tip');
        if (readyTip) readyTip.textContent = '首屏内容已就绪，一起出发';
        if (fast) splash.classList.add('is-fast-exit');
        landOrb(splash, fast, false);
        splash.classList.add('is-flying', 'is-leaving');
        later(function () { if (splash.parentNode) splash.remove(); }, fast ? 520 : 820);
      }
      function beginLoading(splash) {
        /* 从这里开始进入"静止等待态"：通知等着的重型初始化可以开工了 */
        try { SPLASH_API._markDocked(); } catch (e) { /* ignore */ }
        var status = splash.querySelector('.boot-status');
        var icon = splash.querySelector('.boot-yali');
        if (status && icon) {
          var targetTop = icon.getBoundingClientRect().bottom + 48;
          var currentTop = status.getBoundingClientRect().top;
          status.style.setProperty('--dock-y', (targetTop - currentTop).toFixed(2) + 'px');
          splash.classList.add('is-waiting');
        }
        /* 【2026-11-21 接入改造】原来这里跑 4 段**模拟**任务（每段 SETTimeout 式推进）——
         * 那是 demo 为了演示节奏编的假进度。现在改成：
         *   · 进度/文案由业务侧 `__SPLASH.stage()` 真实推进；
         *   · 业务侧 `__SPLASH.ready()` 一置真，**同一帧**就退出（不留庆祝停留）；
         *   · 兜底：__SPLASH 不存在（脚本被拦/老版本）或超时 8s → 强制退出。
         *     "永远卡在启动屏"比"早退一点"严重得多。 */
        var EXIT_MAX_MS = 8000;
        var t0 = performance.now();
        var shown = { pct: -1, label: '', index: -1 };
        function poll() {
          if (!splash.parentNode) return;
          var api = window.__SPLASH;
          if (api && api.isReady()) { exitNow(splash, false); return; }
          var st = api ? api.state() : { label: '正在准备你的学习空间', pct: 40, index: 1 };
          if (st.pct !== shown.pct) { setProgress(st.pct); shown.pct = st.pct; }
          if (st.label !== shown.label || st.index !== shown.index) {
            setLoadingLabel(splash, st.label, st.index, st.total);
            shown.label = st.label; shown.index = st.index;
          }
          if (!api || performance.now() - t0 > EXIT_MAX_MS) { exitNow(splash, false); return; }
          raf = requestAnimationFrame(poll);
        }
        poll();
      }
      function finish(fast) {
        var splash = document.getElementById('boot-splash');
        if (!splash) return;
        splash.classList.add('is-complete');
        var tip = document.getElementById('boot-tip');
        if (tip) tip.textContent = '正在装载你的学习空间';
        if (reduced()) {
          setProgress(100);
          splash.classList.add('is-ready');
          setLoadingLabel(splash, 'Workspace ready', 4);
          animateMorph(splash, function () {
            splash.classList.add('is-morphed');
            landOrb(splash, true, true);
          }, 1);
          splash.style.opacity = '0';
          splash.style.transition = 'opacity .12s ease-out';
          later(function () { if (splash.parentNode) splash.remove(); }, 140);
          return;
        }
        /* fast=true（加载提前完成）→ 用急速模式的短形变 280ms；
         * fast=false（重型用户跑满 3 秒）→ 完整 525ms（demo 时间轴 2950 → 3475）。
         * 之后都进 beginLoading：它一看到 isReady 就立刻 exitNow。 */
        animateMorph(splash, function () {
          splash.classList.add('is-morphed');
          beginLoading(splash);
        }, fast ? 280 : 525);
      }
      /* 【2026-11-21 审查修复·关键】全局兜底。
       * 上一版的 8s 兜底只在 `beginLoading()` 里 —— 也就是说，**如果前奏动画
       * （finish 之前的形变/描边）因任何原因没走到那一步，启动屏就永远不退出**。
       * 而 `__BOOT_READY` 已经把离场权交出去了（它看到 __SPLASH 就 return），
       * 于是全站会永远停在开屏上 —— 比"动画不好看"严重得多。
       * 这里补一条独立于动画流程的硬兜底：到点没走就直接收场（正常离场失败就硬移除）。 */
      later(function () {
        var sp = document.getElementById('boot-splash');
        if (!sp || !sp.parentNode) return;
        if (sp.classList.contains('is-leaving') || sp.classList.contains('is-fast-exit')) return;
        try { exitNow(sp, true); } catch (e) { try { sp.remove(); } catch (e2) { /* 交给用户刷新 */ } }
      }, 10000);

      if (replay) replay.addEventListener('click', play);
      document.addEventListener('click', function (event) {
        var button = event.target.closest('[data-load-mode]');
        if (!button) return;
        loadMode = button.getAttribute('data-load-mode');
        play();
      });
      play();
    })();
