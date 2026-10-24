/* ============================================================================
 * 公式军火库（formula-vault）v1.0 —— 考研数学公式速查 + 遮罩自测
 * ----------------------------------------------------------------------------
 * 命题：站内 tex.js 自研渲染器服务了 AI 输出多年，但用户自己没有一处
 * 「系统过公式」的地方 —— 政治有背诵、英语有单词本、数学只有错题本。
 * 这个插件补上：分科分章浏览（LaTeX 真渲染）+ 遮罩自测（先回忆后揭示）
 * + 站点 SRS 排复测 + 掌握度写回热力图 + 教练可查「哪些公式总想不起来」。
 *
 * 背靠的站点资产（不另造轮子）：
 *   · plugins/vendor/formula-vault —— KaTeX 0.16.47 全套（js/css/woff2，插件专属目录），
 *     与站内 docRender 同一版本；运行时按需注入，**不走站内自研 tex 渲染器**。
 *     （用户 2026-10-23 明确要求：公式一律走 KaTeX。）
 *   · ctx.Spaced.grade/dueKey —— 复测排期，插件只存 box
 *   · ctx.Mastery.recordAnswer—— 自测结果写站内掌握度（topicId = 公式 id）
 *   · ctx.queries             —— 教练可查「总想不起来的公式」
 *   · ctx.notify              —— 到期推送
 *
 * 硬约束（宿主契约，2026-10 两次实战确认）：
 *   · css 字段 20000 字符硬上限且**静默截断** → 拆两张表：共享层进 css，
 *     页面专属层在 mount 时注入 <style>、destroy 移除
 *   · 市场重放守门扫 var → 只用 let/const
 *   · 大插件走 codeUrl，主包 0 字节
 * ========================================================================== */
(function () {
  'use strict'

  let TOOL_ID = 'formula-vault'
  let VERSION = '1.0'

  /* ══════════════ 0. 设计决策（改这个文件前先读这里） ══════════════
   *
   * ① 为什么"公式也要遮罩"：看懂 ≠ 记得住。公式要在考场上条件反射式调出来，
   *    唯一被反复验证的办法是「先回忆、后对照」的检索练习（testing effect）。
   *    所以自测台在揭示前**绝不渲染公式本体** —— 场景提示也只给章节/易错/线索。
   *
   * ② 为什么复测排期不自己算：站内 Spaced 已是成熟 SRS（间隔盒 + 质量分），
   *    自己再写一套 = 两套遗忘曲线、两处 bug。插件只存 box/due，Spaced 挂了你才
   *    退化到本地间隔盒（见 scheduleNext 的 try/catch）。
   *
   * ③ 为什么 LaTeX 走 KaTeX（用户 2026-10-23 指定）：站内 docRender 用的就是
   *    KaTeX 0.16.47，公式产物与站点其它地方同源；资产放 public/vendor/katex 按需注入，
   *    加载失败有纯文本兜底（页面照常能用）。
   *
   * ④ 为什么"弹药箱"是独立概念而不只是筛选：它对应一个具体心理动作 ——
   *    "老漏的那几条"。按 miss/slow 计数自动进箱，比"按掌握度<X 筛选"更贴合直觉。
   *
   * ⑤ 撤销为什么只留最近一次：连续撤销会让掌握度曲线出现"时间倒流"的假跳变。
   *    一次就够（防手滑），要更多请去设置页清空重来。
   *
   * ⑥ 种子库为什么控制在 ~140 条：宁可少而准。一条错公式比没有更糟
   *    （会以"权威"的姿态被记进脑子）。要更多用「自建公式」补。
   * ══════════════════════════════════════════════════════════════ */

  /* ══════════════ 1. 小工具 ══════════════ */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
  }
  function todayKey(d) {
    let x = d || new Date()
    return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0')
  }
  function dkey(iso) {
    try { return todayKey(new Date(iso)) } catch (e) { return '' }
  }
  function fmtDate(k) {
    if (!k) return '—'
    let m = /^(\d+)-(\d+)-(\d+)$/.exec(k)
    if (!m) return k
    return m[1].slice(2) + '/' + m[2] + '/' + m[3]
  }
  function shortTitle(s, n) {
    s = String(s || '').replace(/\s+/g, ' ').trim()
    return s.length > n ? s.slice(0, n) + '…' : s
  }
  function clamp(v, a, b) { v = Number(v); if (!isFinite(v)) v = a; return Math.max(a, Math.min(b, v)) }
  function uid() { return 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7) }
  /* ---- KaTeX 渲染层 ----
   * 用户要求不走站内自研 tex 渲染器，一律用 KaTeX。资产在 public/vendor/katex
   * （与站内 docRender 同版本 0.16.47），运行时按需注入：
   *   · 只注入一次（katexLoad 缓存 Promise，重复调用返回同一个）
   *   · 站点里已有 katex（别人注入过）就直接复用，不重复下 272KB
   *   · 加载失败 → 纯文本兜底，页面照常能用（绝不白屏）
   * 渲染参数：throwOnError:false（破损 LaTeX 不炸页面，由 CSS 把错误色压成中性）、
   *           strict:false（宽容未知命令）、trust:false（禁 \href 等，防 XSS）。
   *
   * **用 renderToString 不是 render**：render(tex, baseNode, options) 的第二个参数是
   * **目标 DOM 节点**，把 options 传进去会得到 "t.appendChild is not a function"
   * （真机抓到：公式整排静默变纯文本兜底，页面不报错）。 */
  /* KaTeX 资产在**插件自己的目录**下（public/plugins/vendor/formula-vault/）：
   * 卸载这个插件 = 删掉它自己的 vendor 目录，不会在站点根留死文件。
   * 不用 CDN：国内访问 jsdelivr 不稳，公式是核心功能不能赌网络。 */
  const KATEX_BASE = 'plugins/vendor/formula-vault'
  let katexLoad = null
  let katexRepaintHooks = []

  function loadKatex() {
    if (window.katex && typeof window.katex.renderToString === 'function') return Promise.resolve(window.katex)
    if (katexLoad) return katexLoad
    katexLoad = new Promise(function (resolve, reject) {
      let done = false
      function finish(ok) {
        if (done) return
        done = true
        if (ok && window.katex && typeof window.katex.renderToString === 'function') resolve(window.katex)
        else { katexLoad = null; reject(new Error('katex load failed')) }
      }
      /* CSS 只注入一次（link[data-fv-katex] 做幂等标记） */
      if (!document.querySelector('link[data-fv-katex]')) {
        let link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = KATEX_BASE + '/katex.min.css'
        link.setAttribute('data-fv-katex', '1')
        document.head.appendChild(link)
      }
      if (document.querySelector('script[data-fv-katex]')) {
        /* script 在（可能是别人刚注入、还没执行完）→ 轮询等 window.katex。
         * 上限 3s：jsdom/无脚本执行环境里 script 永远不 onload，
         * 等满 8s 会让批量重放测试白等 8s×N（真机抓到的性能坑）。 */
        let t0 = Date.now()
        let poll = setInterval(function () {
          if (window.katex && typeof window.katex.renderToString === 'function') { clearInterval(poll); finish(true) }
          else if (Date.now() - t0 > 3000) { clearInterval(poll); finish(false) }
        }, 120)
        return
      }
      let sc = document.createElement('script')
      sc.src = KATEX_BASE + '/katex.min.js'
      sc.async = true
      sc.setAttribute('data-fv-katex', '1')
      sc.onload = function () { finish(true) }
      sc.onerror = function () { finish(false) }
      document.head.appendChild(sc)
    }).catch(function (e) {
      /* 失败不缓存：下次 paint 还会再试一次（可能是网络抖动） */
      katexLoad = null
      throw e
    })
    return katexLoad
  }

  /** 剥掉 $ / $$ 定界符（KaTeX 只吃裸 TeX，见下方注释） */
  function stripDelims(s) {
    let t = String(s == null ? '' : s).trim()
    if (t.length > 4 && t.slice(0, 2) === '$$' && t.slice(-2) === '$$') return t.slice(2, -2)
    if (t.length > 2 && t[0] === '$' && t[t.length - 1] === '$') return t.slice(1, -1)
    return t
  }
  /** 渲染一段 LaTeX。已加载 → 同步出 HTML；未加载 → 纯文本兜底 + 后台加载完重绘
   *
   * **定界符必须自己剥**：KaTeX.render 的输入是裸 TeX，传 `$x$` 会报
   * "Can't use function '$' in math mode"（真机抓到：公式整排变成纯文本兜底，
   * 页面不报错、只是"公式没渲染"）。站内自研 tex.js 会自己吃定界符，换引擎就得自己管。 */
  function katexTex(s, display) {
    let src = String(s == null ? '' : s).trim()
    let wantDisplay = !!display
    if (src.length > 4 && src.slice(0, 2) === '$$' && src.slice(-2) === '$$') { src = src.slice(2, -2); wantDisplay = true }
    else if (src.length > 2 && src[0] === '$' && src[src.length - 1] === '$') { src = src.slice(1, -1) }
    if (window.katex && typeof window.katex.renderToString === 'function') {
      try {
        return '<span class="fv-katex">' + window.katex.renderToString(src, {
          displayMode: wantDisplay,
          throwOnError: false,
          strict: false,
          trust: false
        }) + '</span>'
      } catch (e) { /* 极端情况也别炸 */ }
    }
    if (katexLoad) {
      katexLoad.then(function () {
        for (let i = 0; i < katexRepaintHooks.length; i++) katexRepaintHooks[i]()
      }).catch(function () { /* 兜底文本已经显示了 */ })
    } else {
      loadKatex().then(function () {
        for (let i = 0; i < katexRepaintHooks.length; i++) katexRepaintHooks[i]()
      }).catch(function () { /* 忽略：保持纯文本 */ })
    }
    return '<code class="fv-fallback">' + esc(String(s == null ? '' : s)) + '</code>'
  }

  /* ══════════════ 2. 科目与章节 ══════════════ */
  const SUBJ = {
    calc: { label: '高等数学', color: '#2f4bd8', short: '高数' },
    linalg: { label: '线性代数', color: '#0f766e', short: '线代' },
    prob: { label: '概率统计', color: '#b45309', short: '概率' }
  }
  const SUBJ_ORDER = ['calc', 'linalg', 'prob']
  function subjectLabel(k) { return (SUBJ[k] && SUBJ[k].label) || k }
  function subjectColor(k) { return (SUBJ[k] && SUBJ[k].color) || 'var(--fv-acc)' }

  /* ══════════════ 3. 种子公式库 ══════════════
   * 考研数学（数一/二/三）核心公式 ~150 条。字段：
   *   id    唯一键（掌握度/自测记录都按它存）
   *   s     科目 calc / linalg / prob
   *   c     章节
   *   n     公式名
   *   t     LaTeX（$...$ 行内 / $$...$$ 行间）
   *   p     记忆要点（一句话）
   *   w     易错点（一句话）
   * 内容是资产：宁可少而准，不要多而错。
   * ------------------------------------------------------------ */
  const SEED_CALC = [
    { id: 'c001', s: 'calc', c: '极限与连续', n: '两个重要极限', t: '$\\lim_{x\\to0}\\frac{\\sin x}{x}=1$，$\\lim_{x\\to\\infty}(1+\\frac1x)^x=e$', p: 'sin 那个配 $\\frac{\\sin ax}{ax}$，1∞ 那个配 $\\frac{\\ln(1+x)}x$', w: '$x$ 换成 $\\sin x$、$\\tan x$ 时极限过程必须一致，别混' },
    { id: 'c002', s: 'calc', c: '极限与连续', n: '等价无穷小', t: '$x\\sim\\sin x\\sim\\tan x\\sim\\ln(1+x)\\sim e^x-1$；$1-\\cos x\\sim\\frac{x^2}2$；$\\arcsin x\\sim x$', p: '记「sin tan ln e 四兄弟 + arctan arcsin」', w: '等价替换**只能用于乘除因子**，加减里拆开会错' },
    { id: 'c003', s: 'calc', c: '极限与连续', n: '泰勒展开（麦克劳林）', t: '$e^x=1+x+\\frac{x^2}{2!}+\\frac{x^3}{3!}+o(x^3)$', p: 'e 阶乘分母、sin 奇次正负交替、cos 偶次正负交替', w: '$\\sin x$ 展到 $x^3$ 才够减出 $x^3$ 项；展少了会丢阶' },
    { id: 'c004', s: 'calc', c: '极限与连续', n: 'sin / cos / ln 泰勒', t: '$\\sin x=x-\\frac{x^3}{3!}+\\frac{x^5}{5!}$；$\\cos x=1-\\frac{x^2}{2!}+\\frac{x^4}{4!}$；$\\ln(1+x)=x-\\frac{x^2}2+\\frac{x^3}3$', p: 'sin 奇 cos 偶，符号都是正负交替', w: 'cos 的常数项是 1，减 1 后首项才是 $-\\frac{x^2}2$' },
    { id: 'c005', s: 'calc', c: '极限与连续', n: '洛必达法则', t: '$\\lim\\frac{f}{g}=\\lim\\frac{f^{\\prime}}{g^{\\prime}}$（$\\frac00$ 或 $\\frac\\infty\\infty$）', p: '每用一次先检查是否还定型', w: '不是 $\\frac00/\\frac\\infty\\infty$ 别用；$x\\sin\\frac1x$ 越洛越乱' },
    { id: 'c006', s: 'calc', c: '极限与连续', n: '渐近线', t: '水平：$\\lim_{x\\to\\infty}f=k$；铅直：$\\lim_{x\\to a}f=\\infty$；斜：$k=\\lim\\frac f x,\\ b=\\lim(f-kx)$', p: '斜线要先算斜率再算截距，两步', w: '$x\\to+\\infty$ 与 $x\\to-\\infty$ 要分别算，水平线可能只一侧有' },
    { id: 'c007', s: 'calc', c: '极限与连续', n: '连续与间断', t: '第一类（可去/跳跃）：左右极限都存在；第二类（无穷/振荡）：至少一侧不存在', p: '「都存在=一类，缺一个=二类」', w: '$\\frac1x$ 在 0 是无穷间断；$\\sin\\frac1x$ 在 0 是振荡间断' },
    { id: 'c008', s: 'calc', c: '一元函数微分学', n: '导数定义', t: '$f^{\\prime}(x_0)=\\lim_{\\Delta x\\to0}\\frac{f(x_0+\\Delta x)-f(x_0)}{\\Delta x}$', p: '「增量比的极限」，抽象函数求导全靠它', w: '$f(x_0)=0$ 时 $\\lim\\frac{f(x)}{x-x_0}$ 就是 $f^{\\prime}(x_0)$' },
    { id: 'c009', s: 'calc', c: '一元函数微分学', n: '基本导数表', t: '$(x^n)^{\\prime}=nx^{n-1}$；$(\\sin x)^{\\prime}=\\cos x$；$(\\ln x)^{\\prime}=\\frac1x$；$(a^x)^{\\prime}=a^x\\ln a$', p: '幂、三角、对数、指数四组各记一条代表', w: '$a^x$ 求导带 $\\ln a$，$x^x$ 要用对数求导' },
    { id: 'c010', s: 'calc', c: '一元函数微分学', n: '复合/反函数/参数求导', t: '$\\frac{dy}{dx}=\\frac{dy}{du}\\frac{du}{dx}$；$\\frac{dy}{dx}=\\frac1{\\frac{dx}{dy}}$；$\\frac{dy}{dx}=\\frac{y^{\\prime}(t)}{x^{\\prime}(t)}$', p: '链式相乘、反函数取倒、参数上下分别求再相除', w: '参数方程二阶导要再对 $t$ 求一次，分母是 $x^{\\prime}(t)$ 不是 $\\frac{dy}{dx}$' },
    { id: 'c011', s: 'calc', c: '一元函数微分学', n: '高阶导数公式', t: '$(\\sin x)^{(n)}=\\sin(x+\\frac{n\\pi}2)$；$(\\ln(1+x))^{(n)}=(-1)^{n-1}\\frac{(n-1)!}{(1+x)^n}$', p: 'sin/cos 高阶就是加相位；ln 记 (-1)^{n-1}', w: '$\\frac1{1+x}$ 与 $\\ln(1+x)$ 差一个阶乘与符号' },
    { id: 'c012', s: 'calc', c: '一元函数微分学', n: '莱布尼茨公式', t: '$(uv)^{(n)}=\\sum_{k=0}^n C_n^k u^{(n-k)}v^{(k)}$', p: '二项展开的系数照搬，只是导数替代幂', w: '多项式高阶会变 0，别傻傻全写出来' },
    { id: 'c013', s: 'calc', c: '一元函数微分学', n: '单调性判别', t: '$f^{\\prime}(x)>0\\Rightarrow$ 单调增；$f^{\\prime}(x)<0\\Rightarrow$ 单调减', p: '先找驻点与不可导点，再分区间定号', w: '等号处不保证单调，只能说「不减」' },
    { id: 'c014', s: 'calc', c: '一元函数微分学', n: '极值第一充分条件', t: '左侧 $f^{\\prime}>0$ 右侧 $f^{\\prime}<0\\Rightarrow$ 极大；反之为极小', p: '「正负→极大，负正→极小」', w: '导数不变号 ⇒ 不是极值（如 $y=x^3$）' },
    { id: 'c015', s: 'calc', c: '一元函数微分学', n: '极值第二充分条件', t: '$f^{\\prime}(x_0)=0,\\ f^{\\prime\\prime}(x_0)\\ne0$：$f^{\\prime\\prime}(x_0)<0$ 极大，$>0$ 极小', p: '只用于驻点，比第一法省事', w: '$f^{\\prime\\prime}(x_0)=0$ 时失效，退回第一法' },
    { id: 'c016', s: 'calc', c: '一元函数微分学', n: '拐点', t: '$f^{\\prime\\prime}(x_0)=0$ 或不存在，且 $f^{\\prime\\prime}$ 在 $x_0$ 两侧变号', p: '拐点看**二阶导变号**，不是看二阶导为 0', w: '$y=x^4$ 在 0 处二阶导为 0 但不变号 ⇒ 不是拐点' },
    { id: 'c017', s: 'calc', c: '一元函数微分学', n: '凹凸性定义式', t: '$f(\\frac{x_1+x_2}2)<\\frac{f(x_1)+f(x_2)}2\\Rightarrow$ 凹（下凸）', p: '「中点函数值小于两端平均 ⇒ 凹」', w: '中文教材凹凸定义与英文字典相反，按自己用的那本记' },
    { id: 'c018', s: 'calc', c: '一元函数微分学', n: '曲率', t: '$K=\\frac{|y^{\\prime\\prime}|}{(1+y^{\\prime2})^{3/2}}$；半径 $R=\\frac1K$', p: '直线 K=0；圆 $K=\\frac1r$ 用来验算', w: '参数方程要先求 $y^{\\prime},y^{\\prime\\prime}$ 再代入' },
    { id: 'c019', s: 'calc', c: '一元函数积分学', n: '基本积分表', t: '$\\int\\frac{dx}{1+x^2}=\\arctan x$；$\\int\\frac{dx}{\\sqrt{1-x^2}}=\\arcsin x$；$\\int\\tan x\\,dx=-\\ln|\\cos x|$', p: '与导数表互为反推，背导数就够', w: '$\\frac{1}{\\sqrt{a^2-x^2}}$ 要先提出 $\\frac1a$ 才成 $\\arcsin\\frac x a$' },
    { id: 'c020', s: 'calc', c: '一元函数积分学', n: '分部积分', t: '$\\int u\\,dv=uv-\\int v\\,du$', p: '「反对幂三指」顺序选 $u$：反三角函数优先当 $u$', w: '$\\int e^x\\sin x\\,dx$ 转回来会还原，把未积项移到一边' },
    { id: 'c021', s: 'calc', c: '一元函数积分学', n: '换元积分', t: '$\\int f(x)dx=\\int f(g(t))g^{\\prime}(t)dt$（$x=g(t)$）', p: '三角换元：$\\sqrt{a^2-x^2}\\to x=a\\sin t$', w: '定积分换元**必须换上下限**；开方要保号' },
    { id: 'c022', s: 'calc', c: '一元函数积分学', n: '有理函数拆分', t: '$\\frac{P(x)}{Q(x)}=$ 多项式 $+\\sum\\frac{A}{(x-a)^k}+\\sum\\frac{Bx+C}{(x^2+px+q)^k}$', p: '先看真假分式，假分数先除式', w: '拆完每一项系数要解方程，别漏常数项' },
    { id: 'c023', s: 'calc', c: '一元函数积分学', n: '变上限积分求导', t: '$\\frac{d}{dx}\\int_{a(x)}^{b(x)}f(t)dt=f(b)b^{\\prime}-f(a)a^{\\prime}$', p: '「上线代入乘上线导数，减下线代入乘下线导数」', w: '被积函数里也含 $x$ 时先拆出：$\\int_a^x g(x,t)dt$ 要拆两项' },
    { id: 'c024', s: 'calc', c: '一元函数积分学', n: '牛顿-莱布尼茨公式', t: '$\\int_a^b f(x)dx=F(b)-F(a)$，$F^{\\prime}=f$', p: '定积分 = 原函数增量', w: '$f$ 在 $[a,b]$ 有原函数才有这公式，不连续要小心' },
    { id: 'c025', s: 'calc', c: '一元函数积分学', n: '定积分换元', t: '$\\int_a^b f(x)dx=\\int_{\\alpha}^{\\beta}f(g(t))g^{\\prime}(t)dt$，$g(\\alpha)=a,g(\\beta)=b$', p: '「换元必换限」', w: '$g$ 不单调时积分区间要分段' },
    { id: 'c026', s: 'calc', c: '一元函数积分学', n: '对称区间积分', t: '$f$ 奇 ⇒ $\\int_{-a}^a f=0$；$f$ 偶 ⇒ $=2\\int_0^a f$', p: '「奇零偶倍」', w: '先判断奇偶再算，别硬算；$\\frac{\\sin x}{x^2+1}$ 是奇函数' },
    { id: 'c027', s: 'calc', c: '一元函数积分学', n: '区间再现公式', t: '$\\int_a^b f(x)dx=\\int_a^b f(a+b-x)dx$', p: '「$x\\to a+b-x$」换一下 often 出奇迹', w: '多用于 $\\int_0^{\\frac\\pi2}$ 的 sin-cos 互换化简' },
    { id: 'c028', s: 'calc', c: '一元函数积分学', n: '点火公式', t: '$I_n=\\int_0^{\\frac\\pi2}\\sin^n x\\,dx$：$I_n=\\frac{n-1}{n}I_{n-2}$；$I_0=\\frac\\pi2,\\ I_1=1$', p: '递推两步降一次，奇偶分别落到 $I_1$ / $I_0$', w: '$\\int_0^{\\pi}\\sin^n x\\,dx=2\\int_0^{\\frac\\pi2}\\sin^n x\\,dx$（n 任意）' },
    { id: 'c029', s: 'calc', c: '中值定理与证明', n: '罗尔定理', t: '$f$ 在 $[a,b]$ 连续、$(a,b)$ 可导、$f(a)=f(b)\\Rightarrow\\exists\\xi,\\ f^{\\prime}(\\xi)=0$', p: '结论是「有水平切线」', w: '三个条件缺一不可，反例要能背' },
    { id: 'c030', s: 'calc', c: '中值定理与证明', n: '拉格朗日中值定理', t: '$\\frac{f(b)-f(a)}{b-a}=f^{\\prime}(\\xi)$，$\\xi\\in(a,b)$', p: '「割线斜率 = 某点切线斜率」', w: '证不等式常用：$|f(b)-f(a)|\\le M|b-a|$' },
    { id: 'c031', s: 'calc', c: '中值定理与证明', n: '柯西中值定理', t: '$\\frac{f(b)-f(a)}{g(b)-g(a)}=\\frac{f^{\\prime}(\\xi)}{g^{\\prime}(\\xi)}$', p: '拉格朗日的「双函数版」，洛必达的理论基础', w: '$g^{\\prime}(\\xi)\\ne0$，故 $g$ 单调（由 $g(b)\\ne g(a)$ 保证）' },
    { id: 'c032', s: 'calc', c: '中值定理与证明', n: '泰勒公式（带拉格朗日余项）', t: '$f(x)=f(x_0)+f^{\\prime}(x_0)(x-x_0)+\\cdots+\\frac{f^{(n)}(\\xi)}{n!}(x-x_0)^n$', p: '展开点选「已知信息最多」的点', w: '余项里的 $\\xi$ 在 $x_0$ 与 $x$ 之间，不能当常数提出' },
    { id: 'c033', s: 'calc', c: '中值定理与证明', n: '零点存在定理', t: '$f(a)f(b)<0$ 且连续 $\\Rightarrow\\exists\\xi\\in(a,b),\\ f(\\xi)=0$', p: '介值定理的直接推论', w: '证唯一性要再用单调性（ Rolle 反证）' },
    { id: 'c034', s: 'calc', c: '多元函数微分学', n: '全微分存在条件', t: '偏导连续 $\\Rightarrow$ 可微；可微 $\\Rightarrow$ 偏导存在且连续**不要求**', p: '链条：连续→? 可微→偏导', w: '偏导存在**推不出**连续（$f=1$ 当 $xy\\ne0$，原点例外）' },
    { id: 'c035', s: 'calc', c: '多元函数微分学', n: '复合函数链式法则', t: '$\\frac{dz}{dt}=\\frac{\\partial z}{\\partial x}\\frac{dx}{dt}+\\frac{\\partial z}{\\partial y}\\frac{dy}{dt}$', p: '「有几条路径到 x 就乘几项」', w: '抽象复合求二阶导，务必画出变量依赖树再动手' },
    { id: 'c036', s: 'calc', c: '多元函数微分学', n: '隐函数求导', t: '$F(x,y)=0\\Rightarrow\\frac{dy}{dx}=-\\frac{F_x}{F_y}$', p: '「对 x 的偏导比上对 y 的偏导，加负号」', w: '$F_y=0$ 时此处不能用（要换 $x$ 为 $y$ 的函数）' },
    { id: 'c037', s: 'calc', c: '多元函数微分学', n: '梯度与方向导数', t: '$\\nabla f=(f_x,f_y,f_z)$；$\\frac{\\partial f}{\\partial l}=\\nabla f\\cdot\\vec l^0$', p: '梯度指向增长最快方向', w: '方向导数最大 = $|\\nabla f|$，方向就是梯度方向' },
    { id: 'c038', s: 'calc', c: '多元函数微分学', n: '多元极值', t: '$f_x=f_y=0$，$A=f_{xx},B=f_{xy},C=f_{yy}$：$AC-B^2>0$ 且 $A>0$ ⇒ 极小', p: '判别式 $AC-B^2$：>0 有极值，<0 无，=0 不定', w: '$AC-B^2>0$ 但 $A<0$ 是极大；别忘符号' },
    { id: 'c039', s: 'calc', c: '多元函数微分学', n: '条件极值（拉格朗日）', t: '$L=f+\\lambda\\varphi$，解 $f_x=\\lambda\\varphi_x,\\ f_y=\\lambda\\varphi_y,\\ \\varphi=0$', p: '「目标 + λ×约束」，λ 一起当未知数', w: '多约束就多几个 λ；最后要代回约束验证可行' },
    { id: 'c040', s: 'calc', c: '重积分', n: '二重积分（直角）', t: '$\\iint_D f\\,d\\sigma=\\int_a^b dx\\int_{\\varphi_1(x)}^{\\varphi_2(x)}f\\,dy$', p: '先看 D 是 X 型还是 Y 型，谁简单谁后积', w: '交换次序要重画区域，别凭原式直接换' },
    { id: 'c041', s: 'calc', c: '重积分', n: '二重积分（极坐标）', t: '$\\iint f\\,d\\sigma=\\int_\\alpha^\\beta d\\theta\\int_{r_1(\\theta)}^{r_2(\\theta)}f\\,r\\,dr$', p: '「换成极坐标必带 r」', w: '积分域是圆环/扇形/心形才用，别滥用' },
    { id: 'c042', s: 'calc', c: '重积分', n: '二重积分对称性', t: 'D 关于 y 轴对称且 $f(-x,y)=-f(x,y)\\Rightarrow\\iint=0$', p: '「奇对称零，偶对称一半」', w: '先验证 D 对称，再看 f 的奇偶' },
    { id: 'c043', s: 'calc', c: '重积分', n: '三重积分（柱/球坐标）', t: '柱：$dV=r\\,dr\\,d\\theta\\,dz$；球：$dV=r^2\\sin\\varphi\\,dr\\,d\\varphi\\,d\\theta$', p: '「柱带 r，球带 $r^2\\sin\\varphi$」', w: '球坐标 $\\varphi$ 是极角（与 z 轴夹角），别和方位角混' },
    { id: 'c044', s: 'calc', c: '重积分', n: '形心公式', t: '$\\bar x=\\frac{\\iint_D x\\,d\\sigma}{\\iint_D d\\sigma}$', p: '「一阶矩除以面积」', w: '对称区域 + 对称被积函数，形心在对称轴上' },
    { id: 'c045', s: 'calc', c: '曲线曲面积分', n: '第一类曲线积分', t: '$\\int_L f\\,ds=\\int_\\alpha^\\beta f(x(t),y(t))\\sqrt{x^{\\prime2}+y^{\\prime2}}\\,dt$', p: '「带弧长微元 $\\sqrt{x^{\\prime2}+y^{\\prime2}}$」', w: '与方向无关（ds 无向）' },
    { id: 'c046', s: 'calc', c: '曲线曲面积分', n: '第二类曲线积分', t: '$\\int_L P\\,dx+Q\\,dy=\\int_\\alpha^\\beta (P\\dot x+Q\\dot y)\\,dt$', p: '「dx、dy 各自换成 $\\dot x dt,\\dot y dt$」', w: '与方向有关：反向积分取负' },
    { id: 'c047', s: 'calc', c: '曲线曲面积分', n: '格林公式', t: '$\\oint_L P\\,dx+Q\\,dy=\\iint_D(\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y})d\\sigma$', p: '「Q 对 x 减 P 对 y」', w: 'L 取**正向**（区域在左手边）；有奇点要挖洞' },
    { id: 'c048', s: 'calc', c: '曲线曲面积分', n: '路径无关条件', t: '$\\frac{\\partial P}{\\partial y}=\\frac{\\partial Q}{\\partial x}$（单连通）$\\Leftrightarrow\\oint=0$', p: '「交叉偏导相等」', w: '多连通区域每条内边界都要单独验证' },
    { id: 'c049', s: 'calc', c: '曲线曲面积分', n: '高斯公式', t: '$\\oiint_{\\Sigma}P\\,dy\\,dz+Q\\,dz\\,dx+R\\,dx\\,dy=\\iiint_\\Omega(\\frac{\\partial P}{\\partial x}+\\frac{\\partial Q}{\\partial y}+\\frac{\\partial R}{\\partial z})dV$', p: '「散度的三重积分」', w: '取**外侧**；$\\Sigma$ 要封闭' },
    { id: 'c050', s: 'calc', c: '曲线曲面积分', n: '斯托克斯公式', t: '$\\oint_L=\\iint_{\\Sigma}(\\nabla\\times\\vec F)\\cdot d\\vec S$', p: '「环量 = 旋度通量」', w: 'L 与 $\\Sigma$ 的方向服从右手法则' },
    { id: 'c051', s: 'calc', c: '无穷级数', n: '几何级数', t: '$\\sum_{n=0}^\\infty aq^n=\\frac{a}{1-q}$（$|q|<1$）', p: '「首项除以 1-比」', w: 'n 从 1 起时首项是 $aq$ 不是 $a$' },
    { id: 'c052', s: 'calc', c: '无穷级数', n: 'p 级数', t: '$\\sum_{n=1}^\\infty\\frac1{n^p}$：$p>1$ 收敛，$p\\le1$ 发散', p: '「大于一收敛」', w: '$p=1$ 是调和级数，发散' },
    { id: 'c053', s: 'calc', c: '无穷级数', n: '比值/根值判别法', t: '$\\rho=\\lim|\\frac{u_{n+1}}{u_n}|$（或 $\\lim\\sqrt[n]{|u_n|}$）：$\\rho<1$ 收敛，$>1$ 发散', p: '「含阶乘/指数用比值，n 次幂用根值」', w: '$\\rho=1$ 都失效，改用比较或积分' },
    { id: 'c054', s: 'calc', c: '无穷级数', n: '幂级数收敛半径', t: '$R=\\lim|\\frac{a_n}{a_{n+1}}|$（或 $\\frac1{\\lim\\sqrt[n]{|a_n|}}$）', p: '「相邻系数比的极限」', w: '端点 $x=\\pm R$ 要单独判敛散' },
    { id: 'c055', s: 'calc', c: '无穷级数', n: '常用麦克劳林级数', t: '$\\frac1{1-x}=\\sum x^n$；$\\arctan x=\\sum(-1)^n\\frac{x^{2n+1}}{2n+1}$；$(1+x)^\\alpha=\\sum C_\\alpha^n x^n$', p: '由已知展开式逐项求导/积分得新级数', w: '$\\ln(1+x)=\\int\\frac1{1+x}dx$，别背错符号' },
    { id: 'c056', s: 'calc', c: '无穷级数', n: '傅里叶级数', t: '$f(x)=\\frac{a_0}2+\\sum(a_n\\cos nx+b_n\\sin nx)$，$a_n=\\frac1\\pi\\int_{-\\pi}^{\\pi}f\\cos nx\\,dx$', p: '「奇函数只剩正弦，偶函数只剩余弦」', w: '展开成余弦级数要先偶延拓，正弦要奇延拓' },
    { id: 'c057', s: 'calc', c: '常微分方程', n: '可分离变量', t: '$\\frac{dy}{dx}=g(x)h(y)\\Rightarrow\\int\\frac{dy}{h(y)}=\\int g(x)dx$', p: '「变量各站一边」', w: '$h(y)=0$ 的常数解别丢（奇解）' },
    { id: 'c058', s: 'calc', c: '常微分方程', n: '一阶线性微分方程', t: '$y^{\\prime}+P(x)y=Q(x)$：$y=e^{-\\int P}(\\int Qe^{\\int P}dx+C)$', p: '「积分因子 $e^{\\int P}$」', w: '$Q=0$ 是齐次（变量分离即可），别硬套公式' },
    { id: 'c059', s: 'calc', c: '常微分方程', n: '伯努利方程', t: '$y^{\\prime}+P(x)y=Q(x)y^n$（$n\\ne0,1$）：令 $z=y^{1-n}$', p: '「除 $y^n$ 再换元」', w: '$n=0$ 就是线性，$n=1$ 可分离' },
    { id: 'c060', s: 'calc', c: '常微分方程', n: '可降阶二阶', t: '$y^{\\prime\\prime}=f(x)$：连积两次；$y^{\\prime\\prime}=f(x,y^{\\prime})$：令 $p=y^{\\prime}$', p: '「缺 y 就降一阶」', w: '令 $p=y^{\\prime}$ 后 $y^{\\prime\\prime}=p\\frac{dp}{dy}$，不是 $\\frac{dp}{dx}$ 就完事' },
    { id: 'c061', s: 'calc', c: '常微分方程', n: '二阶常系数齐次', t: '$r^2+pr+q=0$：两实根 $y=C_1e^{r_1x}+C_2e^{r_2x}$；重根 $y=(C_1+C_2x)e^{rx}$', p: '「特征方程定形式」', w: '复根 $\\alpha\\pm\\beta i\\to e^{\\alpha x}(C_1\\cos\\beta x+C_2\\sin\\beta x)$' },
    { id: 'c062', s: 'calc', c: '常微分方程', n: '二阶常系数非齐次特解', t: '$f=e^{\\lambda x}P_m(x)$：设 $y^*=x^k e^{\\lambda x}Q_m$，$k$ = $\\lambda$ 是特征根重数', p: '「设同族，按重数乘 x」', w: 'λ 是单根乘 1 个 x，重根乘 $x^2$；别忘' },
    { id: 'c063', s: 'calc', c: '极限与连续', n: '单调有界准则', t: '单调递增有上界 ⇒ 收敛（单调递减有下界同理）', p: '「单调 + 有界 = 收敛」，递推数列就靠它', w: '缺单调或有界都不行（如 $(-1)^n$）' },
    { id: 'c064', s: 'calc', c: '极限与连续', n: '夹逼准则', t: '$g(x)\\le f(x)\\le h(x)$ 且 $\\lim g=\\lim h=A$ ⇒ $\\lim f=A$', p: '「两头夹住，中间投降」', w: '常用于 n 项和（放大缩小后两项可算）' },
    { id: 'c065', s: 'calc', c: '一元函数微分学', n: '可导与连续的关系', t: '可导 ⇒ 连续；连续 ⇏ 可导', p: '「可导必连续，连续不一定可导」', w: '反例：$y=|x|$ 在 0 连续不可导' },
    { id: 'c066', s: 'calc', c: '一元函数微分学', n: '指数与幂的衰减阶', t: '$x\\to\\infty$ 时 $e^{-x}$ 快于任何 $x^{-n}$ 趋于 0', p: '「指数衰减碾压幂衰减」', w: '比较阶数先认指数与幂的辈分' },
    { id: 'c067', s: 'calc', c: '一元函数积分学', n: '定积分定义（黎曼和）', t: '$\\int_a^b f=\\lim_{\\lambda\\to0}\\sum f(\\xi_i)\\Delta x_i$', p: '「分割、近似、求和、取极限」四步', w: '证存在常用达布上下和趋于同值' },
    { id: 'c068', s: 'calc', c: '一元函数积分学', n: '积分中值定理', t: '$\\int_a^b f=f(\\xi)(b-a)$，$\\xi\\in[a,b]$', p: '「平矩形等高」', w: '$f$ 必须连续才有这个 $\\xi$' },
    { id: 'c069', s: 'calc', c: '中值定理与证明', n: '证明题的选刀口诀', t: '证 $f^{\\prime}(\\xi)=0$ → 罗尔；证增量=导数×区间 → 拉格朗日；证二阶 → 泰勒', p: '「结论长什么样，就选哪把刀」', w: '辅助函数（$F=f-g$、$F=xf$）是现造条件的标准手法' },
    { id: 'c070', s: 'calc', c: '无穷级数', n: '交错级数莱布尼茨判别', t: '$u_n\\downarrow 0$ ⇒ $\\sum(-1)^{n-1}u_n$ 收敛', p: '「递减趋于零」四字足矣', w: '收敛但不一定绝对收敛（交错调和级数）' }
  ]

  const SEED_LINALG = [
    { id: 'l001', s: 'linalg', c: '行列式', n: '行列式基本性质', t: '$|A^T|=|A|$；$|AB|=|A||B|$；$|A^{-1}|=|A|^{-1}$；$|kA|=k^n|A|$', p: '「转置不变、乘积可拆、数乘提 n 次」', w: '$|A+B|\\ne|A|+|B|$，最常见的坑' },
    { id: 'l002', s: 'linalg', c: '行列式', n: '代数余子式展开', t: '$|A|=\\sum_{j=1}^n a_{ij}A_{ij}$（按第 i 行）', p: '「元素 × 余子式，正负号 $(-1)^{i+j}$」', w: '某行 0 多就按哪行展开，先化简再算' },
    { id: 'l003', s: 'linalg', c: '行列式', n: '范德蒙行列式', t: '$\\begin{vmatrix}1&1&\\cdots&1\\\\x_1&x_2&\\cdots&x_n\\\\x_1^2&x_2^2&\\cdots&x_n^2\\\\\\end{vmatrix}=\\prod_{1\\le j<i\\le n}(x_i-x_j)$', p: '「后面减前面，全乘起来」', w: '顺序是 $x_i-x_j$（$i>j$），别写反' },
    { id: 'l004', s: 'linalg', c: '行列式', n: '克莱姆法则', t: '$x_j=\\frac{|A_j|}{|A|}$（$|A|\\ne0$）', p: '「第 j 列换成常数项」', w: '只适用于 n 个方程 n 个未知且 $|A|\\ne0$' },
    { id: 'l005', s: 'linalg', c: '矩阵', n: '逆矩阵公式', t: '$A^{-1}=\\frac1{|A|}A^*$；$(AB)^{-1}=B^{-1}A^{-1}$', p: '「伴随矩阵除以行列式」', w: '乘法逆序；$(A+B)^{-1}\\ne A^{-1}+B^{-1}$' },
    { id: 'l006', s: 'linalg', c: '矩阵', n: '初等矩阵', t: '$E$ 初等 $\\Rightarrow|E|\\ne0$；$EA$ = 对 A 做一次初等**行**变换', p: '「左乘变行，右乘变列」', w: '求逆就是连乘初等矩阵的逆' },
    { id: 'l007', s: 'linalg', c: '矩阵', n: '矩阵秩', t: '$r(A)=$ 非零子式最高阶；$r(A)=r(A^T)$；$r(AB)\\le\\min(r(A),r(B))$', p: '「秩不超过任因子的秩」', w: '$A\\ne0$ 但 $r(A)$ 可能为 0 吗？不可能——别被唬' },
    { id: 'l008', s: 'linalg', c: '矩阵', n: '伴随矩阵性质', t: '$AA^*=A^*A=|A|E$；$r(A^*)=n$（$r=n$）；$=1$（$r=n-1$）；$=0$（$r<n-1$）', p: '「满秩 n、缺一 1、缺多 0」', w: '$r=n-1$ 时 $A^*$ 的列成比例，别当满秩用' },
    { id: 'l009', s: 'linalg', c: '向量', n: '线性相关判定', t: '$n$ 个 n 维向量相关 $\\Leftrightarrow|A|=0$（A 由它们拼成）', p: '「方阵版看行列式，一般版看秩」', w: '含零向量必相关；$n+1$ 个 n 维向量必相关' },
    { id: 'l010', s: 'linalg', c: '向量', n: '极大无关组', t: '秩 = 极大无关组中向量个数；其余向量可由它线性表示', p: '「秩就是极大无关组的大小」', w: '表示系数唯一（因为无关）' },
    { id: 'l011', s: 'linalg', c: '向量', n: '施密特正交化', t: '$\\beta_1=\\alpha_1$；$\\beta_k=\\alpha_k-\\sum_{j<k}\\frac{(\\alpha_k,\\beta_j)}{(\\beta_j,\\beta_j)}\\beta_j$', p: '「减去在前面的投影」', w: '顺序不可换；单位化要放最后做' },
    { id: 'l012', s: 'linalg', c: '向量', n: '正交矩阵', t: '$A^TA=E\\Rightarrow|A|=\\pm1$，行/列都是单位正交向量', p: '「转置即逆」', w: '只行正交不够，还要模为 1' },
    { id: 'l013', s: 'linalg', c: '方程组', n: '解的结构（齐次）', t: '$Ax=0$：解 = 基础解系的线性组合；基础解系含 $n-r(A)$ 个向量', p: '「自由变量个数 = 解空间维数」', w: '自由变量取 0/1 组合得基础解系，别取错列' },
    { id: 'l014', s: 'linalg', c: '方程组', n: '解的结构（非齐次）', t: '$Ax=b$：通解 = 特解 + 对应齐次通解', p: '「特解加齐次解」', w: '无解判别：$r(A)\\ne r(A|b)$' },
    { id: 'l015', s: 'linalg', c: '方程组', n: '公共解', t: '$\\begin{cases}Ax=0\\\\Bx=0\\end{cases}$ 的公共解 = $\\begin{pmatrix}A\\\\B\\end{pmatrix}x=0$ 的解', p: '「两个方程组叠成一个」', w: '问「有非零公共解」即问叠后秩 < n' },
    { id: 'l016', s: 'linalg', c: '特征值', n: '特征值与特征向量', t: '$A\\alpha=\\lambda\\alpha\\Leftrightarrow(\\lambda E-A)\\alpha=0$；$\\sum\\lambda_i=\\mathrm{tr}A$，$\\prod\\lambda_i=|A|$', p: '「迹是特征值和，行列式是积」', w: '特征向量对**同一个**特征值才成比例；不同特征值必无关' },
    { id: 'l017', s: 'linalg', c: '特征值', n: '相似对角化', t: '$A\\sim\\Lambda$ 需要 n 个线性无关特征向量；$\\Lambda=\\mathrm{diag}(\\lambda_i)$', p: '「可对角化 ⇔ 每个重特征值都有完整个数的无关向量」', w: '实对称矩阵一定可对角化且正交对角化' },
    { id: 'l018', s: 'linalg', c: '特征值', n: '实对称矩阵性质', t: '不同特征值的特征向量正交；重特征值处也可正交化', p: '「对称 ⇒ 特征值全实、向量可正交」', w: '正交对角化用 $Q^{-1}=Q^T$，别用普通逆' },
    { id: 'l019', s: 'linalg', c: '特征值', n: '相似不变量', t: '相似矩阵有相同特征值、迹、行列式、秩', p: '「谱是相似不变量」', w: '反过来不成立（同谱不一定相似）' },
    { id: 'l020', s: 'linalg', c: '二次型', n: '二次型标准形', t: '$f=x^TAx$，$A$ 实对称；经可逆变换 $x=Cy$ 得 $f=\\sum d_i y_i^2$', p: '「配方或正交变换」', w: '正交变换保长度，一般可逆变换不保' },
    { id: 'l021', s: 'linalg', c: '二次型', n: '正定判别', t: '正定 ⇔ 所有顺序主子式 > 0；⇔ 特征值全正；⇔ $x^TAx>0$（$x\\ne0$）', p: '「主子式全正」最好算', w: '半正定是 ≥0 且允许等号，别混' },
    { id: 'l022', s: 'linalg', c: '二次型', n: '合同与惯性', t: '$A\\simeq B$（合同）⇔ 秩与正负惯性指数相同', p: '「两正一负」就叫惯性指数', w: '合同不要求特征值相同' },
    { id: 'l023', s: 'linalg', c: '矩阵', n: '分块对角矩阵求逆', t: '$\\begin{pmatrix}A&0\\\\0&D\end{pmatrix}^{-1}=\begin{pmatrix}A^{-1}&0\\\\0&D^{-1}\end{pmatrix}$', p: '「对角块各自求逆」', w: '副对角块要两块互换位置' },
    { id: 'l024', s: 'linalg', c: '矩阵', n: '矩阵方程', t: '$AX=B\\Rightarrow X=A^{-1}B$；$XA=B\\Rightarrow X=BA^{-1}$', p: '「左乘左逆，右乘右逆」', w: '$AX+XB=C$ 型不能直接逆，要提公因子' },
    { id: 'l025', s: 'linalg', c: '向量', n: '秩的关系式', t: '$r(A+B)\\le r(A)+r(B)$；$r(AB)\\le\\min(r(A),r(B))$', p: '「和可加，积取小」', w: '$r(A+B)\\ge|r(A)-r(B)|$ 也常用' },
    { id: 'l026', s: 'linalg', c: '特征值', n: '特征值反用', t: '$\\lambda\\ne0$ 是 A 的特征值 ⇒ $\\lambda^{-1}$ 是 $A^{-1}$ 的特征值', p: '「逆的特征值是倒数」', w: '$A+\\lambda E$ 的特征值是 $\\mu+\\lambda$（平移）' }
  ]

  const SEED_PROB = [
    { id: 'p001', s: 'prob', c: '随机事件', n: '条件概率', t: '$P(B|A)=\\frac{P(AB)}{P(A)}$（$P(A)>0$）', p: '「样本空间缩小到 A」', w: '$P(B|A)\\ne P(A|B)$，贝叶斯就是它们的换算' },
    { id: 'p002', s: 'prob', c: '随机事件', n: '乘法公式', t: '$P(AB)=P(A)P(B|A)=P(B)P(A|B)$', p: '「一起发生 = 先发生 × 条件下再发生」', w: '多事件版是链式条件概率连乘' },
    { id: 'p003', s: 'prob', c: '随机事件', n: '全概率公式', t: '$P(A)=\\sum_i P(B_i)P(A|B_i)$（$B_i$ 构成划分）', p: '「先分类再加权」', w: '$B_i$ 必须两两不交且并为全集' },
    { id: 'p004', s: 'prob', c: '随机事件', n: '贝叶斯公式', t: '$P(B_i|A)=\\frac{P(B_i)P(A|B_i)}{\\sum_j P(B_j)P(A|B_j)}$', p: '「先验 × 似然 ÷ 证据」', w: '分母是全概率，别漏项' },
    { id: 'p005', s: 'prob', c: '随机事件', n: '独立性', t: '$A,B$ 独立 ⇔ $P(AB)=P(A)P(B)$；独立 ⇒ 条件概率无条件', p: '「互斥 ≠ 独立」', w: '$P(A)>0,P(B)>0$ 时互斥必不独立' },
    { id: 'p006', s: 'prob', c: '随机事件', n: '加法公式', t: '$P(A\\cup B)=P(A)+P(B)-P(AB)$', p: '「加了两次的交，要减回来」', w: '三事件版要加减 $P(ABC)$' },
    { id: 'p007', s: 'prob', c: '一维分布', n: '0-1 分布', t: '$P(X=1)=p,\\ P(X=0)=1-p$；$EX=p$，$DX=p(1-p)$', p: '「二项 n=1 的特例」', w: '方差用 $p(1-p)$ 不是 $pq^2$' },
    { id: 'p008', s: 'prob', c: '一维分布', n: '二项分布', t: '$P(X=k)=C_n^k p^k(1-p)^{n-k}$；$EX=np$，$DX=np(1-p)$', p: '「均值 np，方差 npq」', w: 'n 次独立重复，缺一不可' },
    { id: 'p009', s: 'prob', c: '一维分布', n: '泊松分布', t: '$P(X=k)=\\frac{\\lambda^k e^{-\\lambda}}{k!}$；$EX=DX=\\lambda$', p: '「均值方差都等于 λ」', w: '二项 $np\\to\\lambda$ 时近似泊松' },
    { id: 'p010', s: 'prob', c: '一维分布', n: '几何分布', t: '$P(X=k)=(1-p)^{k-1}p$；$EX=\\frac1p$，$DX=\\frac{1-p}{p^2}$', p: '「等到第一次成功」', w: '与「前 k-1 次失败后第 k 次成功」同义' },
    { id: 'p011', s: 'prob', c: '一维分布', n: '均匀分布', t: '$f(x)=\\frac1{b-a}$（$a\\le x\\le b$）；$EX=\\frac{a+b}2$，$DX=\\frac{(b-a)^2}{12}$', p: '「中点均值，跨度的平方除 12」', w: '方差分母 12，别和泊松的 λ 混' },
    { id: 'p012', s: 'prob', c: '一维分布', n: '指数分布', t: '$f(x)=\\lambda e^{-\\lambda x}$（$x>0$）；$EX=\\frac1\\lambda$，$DX=\\frac1{\\lambda^2}$', p: '「均值倒数，方差平方倒数」', w: '无记忆性：$P(T>s+t|T>s)=P(T>t)$' },
    { id: 'p013', s: 'prob', c: '一维分布', n: '正态分布', t: '$X\\sim N(\\mu,\\sigma^2)$：$f=\\frac1{\\sqrt{2\\pi}\\sigma}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}$', p: '「中间高两边低，σ 管胖瘦」', w: '标准化 $Z=\\frac{X-\\mu}{\\sigma}\\sim N(0,1)$' },
    { id: 'p014', s: 'prob', c: '一维分布', n: '正态 3σ 法则', t: '$P(|X-\\mu|\\le\\sigma)\\approx68.3\\%$，$2\\sigma\\approx95.4\\%$，$3\\sigma\\approx99.7\\%$', p: '「68-95-99」', w: '是双侧概率；单侧减半' },
    { id: 'p015', s: 'prob', c: '一维分布', n: '均匀分布区间概率', t: '$P(c<X\\le d)=\\frac{d-c}{b-a}$', p: '「长度比」', w: '开闭区间不影响（连续型）' },
    { id: 'p016', s: 'prob', c: '二维分布', n: '联合与边缘', t: '$P(X=x_i)=\\sum_j p_{ij}$；$F(x,y)=P(X\\le x,Y\\le y)$', p: '「边缘 = 另一维求和」', w: '联合分布的行和列和都是边缘' },
    { id: 'p017', s: 'prob', c: '二维分布', n: '独立性（二维）', t: '$p_{ij}=p_{i\\cdot}p_{\\cdot j}$ 对所有 $i,j$', p: '「联合 = 边缘乘积」', w: '找一个反例格子即可证不独立' },
    { id: 'p018', s: 'prob', c: '二维分布', n: '条件分布', t: '$P(Y=y_j|X=x_i)=\\frac{p_{ij}}{p_{i\\cdot}}$', p: '「行内归一化」', w: '分母是 X 的边缘概率' },
    { id: 'p019', s: 'prob', c: '二维分布', n: '协方差', t: '$\\mathrm{Cov}(X,Y)=E(XY)-EX\\,EY$；$\\rho=\\frac{\\mathrm{Cov}}{\\sqrt{DX}\\sqrt{DY}}$', p: '「相关系数 = 归一化协方差」', w: '$\\rho=0$ 只是不线性相关，不一定独立' },
    { id: 'p020', s: 'prob', c: '二维分布', n: '协方差矩阵性质', t: '$D(aX+bY)=a^2DX+b^2DY+2ab\\,\\mathrm{Cov}(X,Y)$', p: '「方差的二项式，交叉项是 2ab 协方差」', w: '$\\rho=\\pm1$ 时退化（线性关系）' },
    { id: 'p021', s: 'prob', c: '数字特征', n: '期望性质', t: '$E(aX+b)=aEX+b$；$E(X+Y)=EX+EY$（不需要独立）', p: '「线性可加」', w: '$E(XY)=EX\\,EY$ **需要独立**' },
    { id: 'p022', s: 'prob', c: '数字特征', n: '方差性质', t: '$DX=E(X^2)-(EX)^2$；$D(aX+b)=a^2DX$', p: '「平方期望减期望平方」最好算', w: '常数方差为 0，别忘' },
    { id: 'p023', s: 'prob', c: '数字特征', n: '切比雪夫不等式', t: '$P(|X-EX|\\ge\\varepsilon)\\le\\frac{DX}{\\varepsilon^2}$', p: '「偏差概率被方差卡住」', w: '只知道均值方差时唯一的通用估计' },
    { id: 'p024', s: 'prob', c: '数字特征', n: '常见分布期望方差表', t: '二项 $(np,npq)$；泊松 $(\\lambda,\\lambda)$；几何 $(\\frac1p,\\frac{1-p}{p^2})$；指数 $(\\frac1\\lambda,\\frac1{\\lambda^2})$；正态 $(\\mu,\\sigma^2)$', p: '「二项 np、泊松 λ、指数倒数」', w: '均匀 $(\\frac{a+b}2,\\frac{(b-a)^2}{12})$ 也要一起背' },
    { id: 'p025', s: 'prob', c: '大数定律', n: '辛钦大数定律', t: '$iid$ 且 $E(X_i)=\\mu$ ⇒ $\\bar X\\xrightarrow{P}\\mu$', p: '「独立同分布，样本均值趋于均值」', w: '不要求方差存在' },
    { id: 'p026', s: 'prob', c: '大数定律', n: '伯努利大数定律', t: '频率 $\\xrightarrow{P}$ 概率', p: '「频率稳定于概率」', w: '是辛钦的特例（0-1 分布）' },
    { id: 'p027', s: 'prob', c: '中心极限定理', n: '棣莫弗-拉普拉斯', t: '$\\frac{Y_n-np}{\\sqrt{npq}}\\xrightarrow{d}N(0,1)$（$Y_n\\sim B(n,p)$）', p: '「二项大 n 用正态近似」', w: '$np,nq$ 都 ≥5（或 10）才好用' },
    { id: 'p028', s: 'prob', c: '中心极限定理', n: '列维-林德伯格', t: '$\\frac{\\sum X_i-n\\mu}{\\sqrt n\\sigma}\\xrightarrow{d}N(0,1)$（$iid$，$DX=\\sigma^2$）', p: '「独立同分布和趋于正态」', w: '标准化分母是 $\\sqrt n\\sigma$，不是 $\\sigma$' },
    { id: 'p029', s: 'prob', c: '数理统计', n: '三大抽样分布', t: '$\\chi^2=\\sum Z_i^2$；$t=\\frac{Z}{\\sqrt{\\chi^2/n}}$；$F=\\frac{\\chi^2_m/m}{\\chi^2_n/n}$', p: '「卡方是标准正态平方和」', w: '$t$ 的自由度在分母；$F$ 互为倒数是自由度互换' },
    { id: 'p030', s: 'prob', c: '数理统计', n: '正态总体样本均值方差', t: '$\\bar X\\sim N(\\mu,\\frac{\\sigma^2}n)$；$\\frac{(n-1)S^2}{\\sigma^2}\\sim\\chi^2(n-1)$', p: '「均值方差缩小 n 倍」', w: '$\\bar X$ 与 $S^2$ **相互独立**（仅正态总体）' },
    { id: 'p031', s: 'prob', c: '数理统计', n: '矩估计', t: '用样本矩替换总体矩：$\\frac1n\\sum X_i^k=E(X^k)$', p: '「样本矩 = 总体矩」', w: '一阶不够就上二阶，别忘解方程' },
    { id: 'p032', s: 'prob', c: '数理统计', n: '最大似然估计', t: '$L(\\theta)=\\prod f(x_i;\\theta)$，取 $\\ln L$ 求导置 0', p: '「先取对数再求导」', w: '定义域与 θ 有关时（均匀分布）不能直接求导' },
    { id: 'p033', s: 'prob', c: '数理统计', n: '无偏性', t: '$E(\\hat\\theta)=\\theta$；$E(S^2)=\\sigma^2$，$E(\\frac1n\\sum(X_i-\\bar X)^2)\\ne\\sigma^2$', p: '「样本方差无偏，除以 n 的那个有偏」', w: '$S^2$ 分母是 $n-1$，这才是无偏的那个' },
    { id: 'p034', s: 'prob', c: '数理统计', n: '置信区间（单个正态 μ）', t: '$\\bar x\\pm z_{\\alpha/2}\\frac{\\sigma}{\\sqrt n}$（σ 已知）；σ 未知用 $t_{\\alpha/2}(n-1)\\frac{s}{\\sqrt n}$', p: '「点估计 ± 分位数 × 标准误」', w: 'σ 未知必须换 t，别用 z' },
    { id: 'p035', s: 'prob', c: '数理统计', n: '假设检验两类错误', t: '第一类：弃真（概率 $\\alpha$）；第二类：取伪（概率 $\\beta$）', p: '「拒真 = 假阳性」', w: '$n$ 固定时 $\\alpha,\\beta$ 此消彼长' },
    { id: 'p036', s: 'prob', c: '随机事件', n: '抽签公平性', t: '不放回抽取中第 $k$ 次抽中的边缘概率均为 $\\frac{m}{n}$', p: '「先抽后抽一样公平」', w: '别被"前面没抽中我概率变大"误导——那是条件概率变了' },
    { id: 'p037', s: 'prob', c: '一维分布', n: '超几何分布', t: '$P(X=k)=\\frac{C_M^kC_{N-M}^{n-k}}{C_N^n}$；$EX=n\\frac{M}{N}$', p: '「不放回的成功数」', w: '$N$ 很大时近似二项（$p=\\frac{M}{N}$）' },
    { id: 'p038', s: 'prob', c: '二维分布', n: '二维均匀分布', t: '$f(x,y)=\\frac1{S_D}$（$(x,y)\\in D$，面积 $S_D$）', p: '「面积分之一」', w: '边缘一般是长度比，不再均匀' },
    { id: 'p039', s: 'prob', c: '二维分布', n: '最大最小值分布', t: '$F_{max}(z)=F(z)^n$；$F_{min}(z)=1-[1-F(z)]^n$', p: '「最大取交，最小取补」', w: '求密度记得对分布函数求导' },
    { id: 'p040', s: 'prob', c: '数字特征', n: '不相关的三条等价', t: '$\\rho=0\\Leftrightarrow\\mathrm{Cov}=0\\Leftrightarrow E(XY)=EX\\cdot EY$', p: '「常用第三条验算」', w: '只有正态分布 $\\rho=0$ 才等价独立' },
    { id: 'p041', s: 'prob', c: '数理统计', n: '样本方差分布', t: '$\\frac1{\\sigma^2}\\sum(X_i-\\bar X)^2\\sim\\chi^2(n-1)$', p: '「除以 $\\sigma^2$ 才是卡方，自由度少 1」', w: '少的 1 个自由度是因为估了均值' }
  ]

  /* ---- 3b. 易混对比：考研丢分往往不是不会，是分不清两个长得像的 ----
   * 按 id 引用种子公式（不复制内容，保持单一事实源）。 */
  const CONFUSE = [
    { id: 'x1', a: 'c029', b: 'c030', note: '罗尔要求两端函数值相等，拉格朗日不要求；拉格朗日是"把函数掰弯之后"的罗尔。' },
    { id: 'x2', a: 'c023', b: 'c024', note: '变上限求导是"被积函数代入上下限"，牛顿-莱布尼茨是"原函数增量"——一个是导数，一个是积分。' },
    { id: 'x3', a: 'c014', b: 'c015', note: '极值第一法看一阶导变号（含不可导点），第二法只看驻点且要二阶导非零。' },
    { id: 'x4', a: 'c047', b: 'c049', note: '格林是"平面闭曲线→二重积分"，高斯是"封闭曲面→三重积分"；维度各升一阶。' },
    { id: 'x5', a: 'p001', b: 'p004', note: '条件概率问"已知 A 后 B 的概率"，贝叶斯问"看到 B 后 A 的概率"——因和果的方向别反。' },
    { id: 'x6', a: 'p005', b: 'p019', note: '独立是"概率可乘"，不相关只是"协方差为 0"；独立 ⇒ 不相关，反之不成立。' },
    { id: 'x7', a: 'p031', b: 'p032', note: '矩估计"样本矩替总体矩"，最大似然"让观测结果最可能发生"；同一题两法常给不同答案。' },
    { id: 'x8', a: 'l004', b: 'l005', note: '克莱姆用法则解单个未知数，逆矩阵解整个向量；法则算一步、逆矩阵算一片。' },
    { id: 'x9', a: 'l009', b: 'l017', note: '线性相关是"有没有多余向量"，可对角化是"特征向量够不够填成基"。' },
    { id: 'x10', a: 'l021', b: 'l022', note: '正定要求 >0，半正定允许 =0；合同看的是秩与正负惯性指数，不是特征值。' },
    { id: 'x11', a: 'c026', b: 'c042', note: '定积分对称看被积函数奇偶，二重积分对称还要看积分区域是否对称。' },
    { id: 'x12', a: 'c013', b: 'c016', note: '单调性看一阶导符号，凹凸/拐点看二阶导符号——同一题两问常被混为一谈。' },
    { id: 'x13', a: 'c002', b: 'c005', note: '等价替换只能换乘除因子，洛必达只吃 0/0 与 ∞/∞ —— 两个都不是万能钥匙。' },
    { id: 'x14', a: 'p027', b: 'p028', note: '棣莫弗-拉普拉斯是二项专用，列维-林德伯格是任意同分布之和 —— 前者是后者的特例。' },
    { id: 'x15', a: 'c021', b: 'c025', note: '不定积分换元换完要换回原变量；定积分换元**必须同时换上下限**。' },
    { id: 'x16', a: 'l001', b: 'l008', note: '行列式是数（可拆可逆），伴随是矩阵（按代数余子式转置排）。' }
  ]
  /** 易混对渲染：两条并排 + 一句辨析（并排才看得出差别） */
  function confuseRow(ctx, list, item) {
    let fa = findF(list, item.a)
    let fb = findF(list, item.b)
    if (!fa || !fb) return ''
    let side = function (f) {
      return '<div class="fv-cside"><span class="fv-fsubj" style="--c:' + subjectColor(f.s) + '">' + esc((SUBJ[f.s] && SUBJ[f.s].short) || f.s) + '</span>'
        + '<b>' + esc(f.n) + '</b>'
        + '<div class="fv-ft">' + katexTex(f.t, true) + '</div></div>'
    }
    return '<div class="fv-crow"><span class="fv-vs" aria-hidden="true">VS</span>'
      + side(fa) + side(fb)
      + '<div class="fv-cnote">' + esc(item.note) + '</div></div>'
  }

  /* ══════════════ 4. 判据（纯函数） ══════════════ */
  /** 自评三档 → 站点 Spaced 的质量分（4=秒想 / 3=想一下 / 1=没想起） */
  function gradeOf(k) {
    if (k === 'fast') return 4
    if (k === 'slow') return 3
    return 1
  }
  /** 掌握度融合：与费曼晶体同口径（80% 旧 + 20% 新， clamp 0-100） */
  function fuseMastery(old, score) {
    old = clamp(old, 0, 100)
    score = clamp(score, 0, 100)
    return Math.round(old * 0.8 + score * 0.2)
  }
  /** 一次自评的得分：fast=100 / slow=72 / miss=25（miss 不是 0 分：想起来一半比完全没方向强） */
  function scoreOf(k) {
    if (k === 'fast') return 100
    if (k === 'slow') return 72
    return 25
  }
  /** 该公式是否"还不熟"（进弹药箱）：miss 或 slow 且历史 miss≥1 */
  function isWeak(rec) {
    if (!rec) return false
    return rec.miss >= 1 || (rec.slow >= 1 && rec.miss + rec.slow >= 2)
  }
  /** 到期清单：nextAt <= today；没自测过的（nextAt 空）不算到期但算"未测" */
  function dueList(recs, today) {
    let out = []
    for (let k in recs) {
      let r = recs[k]
      if (r && r.nextAt && r.nextAt <= today) out.push({ id: k, rec: r })
    }
    out.sort(function (a, b) { return a.rec.nextAt < b.rec.nextAt ? -1 : 1 })
    return out
  }
  /** 未测清单：从没自测过的公式 */
  function untestedList(recs, seed) {
    let out = []
    for (let i = 0; i < seed.length; i++) if (!recs[seed[i].id]) out.push(seed[i])
    return out
  }
  /** 连续达标天数（每日目标内完成 fast+slow 的次数） */
  function streakOf(logs, goal) {
    let days = {}
    for (let i = 0; i < logs.length; i++) {
      let k = dkey(logs[i].at)
      if (!days[k]) days[k] = 0
      days[k]++
    }
    let streak = 0
    let d = new Date()
    for (let i = 0; i < 400; i++) {
      let k = todayKey(d)
      if ((days[k] || 0) >= goal) streak++
      else if (i > 0) break
      else if ((days[k] || 0) > 0) { /* 今天没达标但练过：不断连，从昨天开始算 */ }
      d.setDate(d.getDate() - 1)
    }
    return streak
  }

  /* ══════════════ 5. 数据层（ctx.data + 迁移） ══════════════ */
  function normRec(r) {
    r = r || {}
    return {
      box: clamp(r.box, 1, 6),
      nextAt: String(r.nextAt || ''),
      mastery: clamp(r.mastery, 0, 100),
      fast: clamp(r.fast, 0, 9999),
      slow: clamp(r.slow, 0, 9999),
      miss: clamp(r.miss, 0, 9999),
      fav: !!r.fav,
      lastAt: String(r.lastAt || ''),
      history: Array.isArray(r.history) ? r.history.slice(-20) : []
    }
  }
  function loadRecs(ctx) {
    let raw = {}
    try { raw = ctx.data('recs') || {} } catch (e) { raw = {} }
    let out = {}
    for (let k in raw) out[k] = normRec(raw[k])
    return out
  }
  function saveRecs(ctx, recs) {
    try { ctx.data('recs', recs) } catch (e) { /* 隐私模式：内存里继续用 */ }
    return recs
  }
  function loadLogs(ctx) {
    try {
      let a = ctx.data('logs')
      return Array.isArray(a) ? a : []
    } catch (e) { return [] }
  }
  function saveLogs(ctx, logs) {
    logs = logs.slice(-500)
    try { ctx.data('logs', logs) } catch (e) { /* 忽略 */ }
    return logs
  }
  /** 合并用户自定义公式（导入/自建）与种子：id 相同用户版优先 */
  function loadCustom(ctx) {
    try {
      let a = ctx.data('custom')
      return Array.isArray(a) ? a : []
    } catch (e) { return [] }
  }
  function saveCustom(ctx, arr) {
    try { ctx.data('custom', arr) } catch (e) { /* 忽略 */ }
    return arr
  }
  function allFormulas(ctx) {
    return SEED_CALC.concat(SEED_LINALG).concat(SEED_PROB).concat(loadCustom(ctx))
  }
  function findF(list, id) {
    for (let i = 0; i < list.length; i++) if (list[i].id === id) return list[i]
    return null
  }
  /** 章节分组：保持种子顺序 */
  function chaptersOf(list, subj) {
    let order = [], map = {}
    for (let i = 0; i < list.length; i++) {
      if (subj !== 'all' && list[i].s !== subj) continue
      let c = list[i].c
      if (!map[c]) { map[c] = []; order.push(c) }
      map[c].push(list[i])
    }
    return order.map(function (c) { return { chap: c, items: map[c] } })
  }

  /* ══════════════ 6. AI 面 ══════════════ */
  function aiOk(ctx) {
    try { return !!(ctx && ctx.ai && typeof ctx.ai.json === 'function') } catch (e) { return false }
  }
  /** 让 AI 给一条公式编记忆线索（严格 JSON，失败返回 null —— 绝不编）
   *  三条防幻觉要求：① 只输出 JSON ② 联想必须挂在公式的**真实结构**上
   *  （谐音/图像/推导链），不许编造不存在的性质 ③ 拿不准就空着，调用方会兜底。 */
  function aiMnemonic(ctx, f) {
    if (!aiOk(ctx)) return Promise.resolve(null)
    let sys = '你是考研数学助教。为给定公式设计记忆线索。只输出 JSON：'
      + '{"mnemonic":"口诀/联想（≤60字，必须挂在公式真实结构上，禁止编造性质）",'
      + '"derivation":"一句话推导线索（≤80字）"}。'
      + '不要解释、不要多余字段；没有把握就把对应字段留空字符串。'
    let usr = '公式名：' + f.n + '\n科目：' + subjectLabel(f.s) + '\n公式：' + f.t
      + '\n已有记忆要点：' + (f.p || '') + '\n易错点：' + (f.w || '')
    return ctx.ai.json(sys, usr, { temperature: 0.4 }).then(function (o) {
      if (!o || typeof o !== 'object') return null
      let m = String(o.mnemonic || '').slice(0, 120)
      let d = String(o.derivation || '').slice(0, 160)
      if (!m && !d) return null
      return { mnemonic: m, derivation: d }
    }).catch(function () { return null })
  }

  /* ---------- 共享层：宿主 css 字段（硬上限 20000 字符）----------
   * 设计语言 = 讲义式排版第三个变体：靛蓝（理性/公式）+ 坐标纸网格背景。
   * 与费曼晶体（青绿）、采分点熔炉（朱砂）明确区分。
   * 为什么要有第二张表：宿主 normalize() 会把 css 截到 20000 字符且**静默截断**。 */
    let CSS = [
    '.fv-root{--fv-acc:#2f4bd8;--fv-acc2:#1e3bb8;--fv-ink:var(--text-primary,#1b2430);--fv-sub:var(--text-muted,#6b7788);--fv-faint:color-mix(in srgb,var(--text-primary,#1b2430) 26%,transparent);--fv-line:var(--line,#e5e7eb);--fv-line2:color-mix(in srgb,var(--text-primary,#1b2430) 22%,transparent);--fv-bg:var(--surface,#fff);--fv-soft:var(--surface-muted,#f6f8fb);--fv-gut:var(--vp-x,16px);--fv-w:1180px;position:relative;color:var(--fv-ink);font:14px/1.65 "PingFang SC","Noto Sans SC","Microsoft YaHei",system-ui,sans-serif}',
    '.fv-root *,.fv-root *::before,.fv-root *::after{box-sizing:border-box}',
    '.fv-root button{font-family:inherit;color:inherit}',
    '.fv-aura{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;background-image:repeating-linear-gradient(90deg,color-mix(in srgb,var(--fv-ink) 4%,transparent) 0 1px,transparent 1px 88px),repeating-linear-gradient(0deg,color-mix(in srgb,var(--fv-ink) 3%,transparent) 0 1px,transparent 1px 88px);mask-image:linear-gradient(180deg,#000,transparent 76%);-webkit-mask-image:linear-gradient(180deg,#000,transparent 76%)}',
    '.fv-aura i{position:absolute;border-radius:50%;filter:blur(90px);opacity:.22}',
    '.fv-aura i:nth-child(1){width:440px;height:440px;left:-160px;top:-200px;background:radial-gradient(circle,rgba(47,75,216,.42),transparent 68%);animation:fvFloat 32s ease-in-out infinite alternate}',
    '.fv-aura i:nth-child(2){width:380px;height:380px;right:-150px;top:-60px;background:radial-gradient(circle,rgba(15,118,110,.26),transparent 70%);animation:fvFloat 40s ease-in-out infinite alternate-reverse}',
    '@keyframes fvFloat{to{transform:translate3d(26px,-18px,0) scale(1.06)}}',
    '.fv-top{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:16px;margin:0 calc(-1 * var(--fv-gut));padding:15px calc(var(--fv-gut) + max(6px,(100% - var(--fv-w)) / 2)) 13px;background:transparent;transition:padding .3s cubic-bezier(.22,1,.36,1),background-color .3s ease}',
    '.fv-top::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--fv-line);opacity:0;transition:opacity .3s ease}',
    '.fv-top.is-stuck{padding-top:8px;padding-bottom:8px;background:color-mix(in srgb,var(--fv-bg) 88%,transparent);backdrop-filter:blur(18px) saturate(1.1);-webkit-backdrop-filter:blur(18px) saturate(1.1)}',
    '.fv-top.is-stuck::after{opacity:1}',
    '.fv-brand{display:flex;align-items:center;gap:11px;min-width:0}',
    '.fv-mark{width:40px;height:40px;flex:0 0 40px;display:grid;place-items:center;color:var(--fv-acc);transition:width .3s,height .3s,flex-basis .3s}',
    '.fv-mark svg{width:34px;height:34px}',
    '.fv-top.is-stuck .fv-mark{width:30px;height:30px;flex-basis:30px}',
    '.fv-top.is-stuck .fv-mark svg{width:26px;height:26px}',
    '.fv-brandtx{display:flex;flex-direction:column;min-width:0}',
    '.fv-kicker{font:600 8.5px/1.5 ui-monospace,Consolas,monospace;letter-spacing:.24em;color:var(--fv-sub);text-transform:uppercase;max-height:13px;overflow:hidden;transition:max-height .3s,opacity .3s}',
    '.fv-top.is-stuck .fv-kicker{max-height:0;opacity:0}',
    '.fv-brandtx b{font-family:Georgia,"Songti SC","Noto Serif SC",serif;font-size:21px;font-weight:700;letter-spacing:.05em;white-space:nowrap;transition:font-size .3s}',
    '.fv-top.is-stuck .fv-brandtx b{font-size:17px}',
    '.fv-brandtx em{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:9.5px;color:var(--fv-sub);margin-left:7px;letter-spacing:.06em}',
    '.fv-kpis{display:flex;align-items:baseline;margin-left:auto}',
    '.fv-kpi{display:flex;flex-direction:column;align-items:center;padding:0 14px;border-left:1px solid var(--fv-line);min-width:54px}',
    '.fv-kpi:first-child{border-left:0}',
    '.fv-kpi b{font-family:Georgia,serif;font-size:21px;line-height:1.15;font-variant-numeric:tabular-nums;transition:font-size .3s}',
    '.fv-kpi b em{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:11px;color:var(--fv-sub);letter-spacing:0}',
    '.fv-top.is-stuck .fv-kpi b{font-size:17px}',
    '.fv-kpi i{font-style:normal;font-size:9.5px;color:var(--fv-sub);letter-spacing:.14em;text-transform:uppercase}',
    '.fv-kpi.warn b{color:#b45309}',
    '.fv-kpi.ok b{color:#0f766e}',
    '.fv-topacts{display:flex;align-items:center;gap:10px;margin-left:6px}',
    '.fv-btn{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 1px;border:0;border-bottom:1px solid transparent;border-radius:0;background:none;color:var(--fv-ink);font-size:13px;font-weight:600;cursor:pointer;transition:color .16s,border-color .16s,transform .16s}',
    '.fv-btn:hover{color:var(--fv-acc);border-bottom-color:currentColor}',
    '.fv-btn:active{transform:translateY(1px)}',
    '.fv-btn svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.8}',
    '.fv-btn.primary{height:34px;padding:0 18px;border:0;border-radius:999px;background:linear-gradient(135deg,var(--fv-acc),#1e3bb8);color:#fff;box-shadow:0 8px 20px -12px rgba(47,75,216,.9)}',
    '.fv-btn.primary:hover{color:#fff;transform:translateY(-1px)}',
    '.fv-btn.ghost{color:var(--fv-sub)}',
    '.fv-btn.ghost.on{color:var(--fv-acc);border-bottom-color:var(--fv-acc)}',
    '.fv-btn.danger{color:#b91c1c}',
    '.fv-btn.sm{height:24px;font-size:12px}',
    '.fv-btn.sm.on{color:var(--fv-acc);border-bottom-color:var(--fv-acc)}',
    '.fv-stage{position:relative;z-index:1;width:100%;max-width:var(--fv-w);margin:0 auto;display:flex;flex-direction:column;padding:4px 6px 140px}',
    '.fv-card{border:0;border-top:1px solid var(--fv-line);border-radius:0;background:transparent;box-shadow:none;padding:18px 0 6px;animation:fvRise .45s cubic-bezier(.22,1,.36,1) both}',
    '.fv-card:first-child{border-top:0;padding-top:8px}',
    '.fv-card:nth-child(2){animation-delay:45ms}',
    '.fv-card:nth-child(3){animation-delay:85ms}',
    '@keyframes fvRise{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:none}}',
    '.fv-card-h{display:flex;align-items:baseline;gap:10px;padding-bottom:9px;margin-bottom:14px;border-bottom:1px solid var(--fv-line)}',
    '.fv-card-h b{font-family:Georgia,"Songti SC",serif;font-size:17px;font-weight:700;letter-spacing:.03em}',
    '.fv-card-h em{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:10px;letter-spacing:.12em;color:var(--fv-sub);text-transform:uppercase}',
    '.fv-card-h .fv-btn{margin-left:auto}',
    '.fv-card-h .fv-btn+.fv-btn{margin-left:6px}',
    '.fv-quiet{font-size:12.5px;line-height:1.9;color:var(--fv-sub)}',
    '.fv-more{font-size:12px;color:var(--fv-sub);margin-top:9px;padding-top:9px;border-top:1px dashed var(--fv-line)}',
    '.fv-acts{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:16px}',
    '.fv-hint{font-size:11.5px;color:var(--fv-sub)}',
    '.fv-goalline{display:flex;align-items:baseline;gap:12px;margin:0 0 14px;font-size:12px;color:var(--fv-sub)}',
    '.fv-goalline>b{font-family:Georgia,serif;font-size:14px;color:var(--fv-ink);font-weight:700}',
    '.fv-goalline.ok>b{color:#0f766e}',
    '.fv-goalbar{margin-left:auto;width:120px;height:2px;background:var(--fv-line2);overflow:hidden}',
    '.fv-goalbar b{display:block;height:100%;background:var(--fv-acc);transition:width .6s cubic-bezier(.22,1,.36,1)}',
    '.fv-searchbar{display:flex;align-items:center;gap:20px;flex-wrap:wrap;margin-bottom:10px}',
    '.fv-searchbar .fv-subjbar{margin:0;padding:0;border:0;flex:0 0 auto}',
    '.fv-search{flex:1;min-width:180px;max-width:320px}',
    '.fv-subjbar{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:14px;border-bottom:1px solid var(--fv-line);padding-bottom:10px}',
    '.fv-schip{height:22px;padding:0;border:0;border-bottom:1px solid transparent;border-radius:0;background:none;font-size:12px;color:var(--fv-sub);cursor:pointer;transition:color .16s,border-color .16s}',
    '.fv-schip:hover{color:var(--fv-ink)}',
    '.fv-schip.on{color:var(--c,var(--fv-acc));border-bottom-color:currentColor;font-weight:700}',
    '.fv-input{height:32px;border:0;border-bottom:1px solid var(--fv-line2);border-radius:0;padding:3px 2px;background:transparent;color:var(--fv-ink);font-size:13.5px;font-family:inherit;outline:none;transition:border-color .16s,box-shadow .16s}',
    '.fv-input:focus{border-bottom-color:var(--fv-acc);box-shadow:0 1px 0 0 var(--fv-acc)}',
    '.fv-chap{border-bottom:1px solid var(--fv-line)}',
    '.fv-chap-h{display:flex;align-items:center;gap:10px;width:100%;padding:13px 2px;border:0;background:none;text-align:left;cursor:pointer}',
    '.fv-chap-h b{font-family:Georgia,"Songti SC",serif;font-size:15.5px;font-weight:700;letter-spacing:.02em}',
    '.fv-chap-h em{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:10px;color:var(--fv-sub);letter-spacing:.1em;margin-left:auto}',
    '.fv-chap-arrow{width:0;height:0;border-left:5px solid var(--fv-sub);border-top:4px solid transparent;border-bottom:4px solid transparent;transition:transform .25s}',
    '.fv-chap.open .fv-chap-arrow{transform:rotate(90deg)}',
    '.fv-chap-h:hover b{color:var(--fv-acc)}',
    '.fv-fgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:0 26px;padding:4px 0 14px}',
    '.fv-fcard{padding:13px 0;border-top:1px dashed var(--fv-line);animation:fvFade .4s cubic-bezier(.22,1,.36,1) both}',
    '.fv-fcard:first-child{border-top:0}',
    '@keyframes fvFade{from{opacity:0}to{opacity:1}}',
    '.fv-fcard.sel{background:linear-gradient(90deg,color-mix(in srgb,var(--fv-acc) 7%,transparent),transparent 70%)}',
    '.fv-fcard-h{display:flex;align-items:baseline;gap:9px;margin-bottom:7px}',
    '.fv-fsubj{font-family:ui-monospace,Consolas,monospace;font-size:9.5px;letter-spacing:.1em;color:var(--c,var(--fv-acc));border-bottom:1px solid var(--c,var(--fv-acc));padding-bottom:1px;flex:0 0 auto}',
    '.fv-fcard-h b{font-size:14px;font-weight:700;letter-spacing:.02em;flex:1;min-width:0}',
    '.fv-fstars{margin-left:auto;display:inline-flex;gap:3px;flex:0 0 auto}',
    '.fv-fstars i{width:5px;height:5px;border-radius:50%;background:var(--fv-line2)}',
    '.fv-fstars i.on{background:var(--fv-acc)}',
    '@keyframes fvReveal{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}',
    '.fv-fallback{font-family:ui-monospace,Consolas,monospace;font-size:12.5px;color:var(--fv-sub)}',
    /* KaTeX 容器：破损 LaTeX 的错误色压成中性（throwOnError:false 时它会渲染红字），
     * 行间公式允许横向滚动（长公式在小屏上不该把卡片撑破） */
    '.fv-katex{display:inline-block;max-width:100%}',
    '.fv-katex .katex-error{color:var(--fv-sub)}',
    '.fv-katex .katex-display{margin:0;overflow-x:auto;overflow-y:hidden;padding:1px 0}',
    '.fv-fp,.fv-fw{font-size:12px;line-height:1.8;color:var(--fv-sub);display:flex;gap:8px}',
    '.fv-fp i,.fv-fw i{font-style:normal;flex:0 0 auto;font-family:ui-monospace,Consolas,monospace;font-size:10px;letter-spacing:.08em;padding-top:2px}',
    '.fv-fp i{color:var(--fv-acc)}',
    '.fv-fw i{color:#b45309}',
    '.fv-fcard-f{display:flex;align-items:center;gap:14px;margin-top:9px;flex-wrap:wrap}',
    '.fv-fnext{font-family:ui-monospace,Consolas,monospace;font-size:10px;color:var(--fv-sub);letter-spacing:.06em}',
    '.fv-fnext .hot{color:#b91c1c}',
    '.fv-ainote{margin-top:10px;padding:10px 0 10px 14px;border-left:2px solid var(--fv-acc);font-size:12.5px;line-height:1.85;animation:fvFade .35s both}',
    '.fv-ainote b{display:block;font-family:ui-monospace,Consolas,monospace;font-size:9.5px;letter-spacing:.14em;color:var(--fv-acc);text-transform:uppercase;margin-top:6px}',
    '.fv-ainote b:first-child{margin-top:0}',
    '.fv-drill-intro{display:flex;gap:34px;flex-wrap:wrap;padding:6px 0 2px}',
    '.fv-clock{color:var(--fv-acc);font-variant-numeric:tabular-nums}',
    '.fv-q{padding:16px 0 14px 16px;border-left:2px solid var(--fv-acc);margin-bottom:16px}',
    '.fv-q b{display:block;font-family:Georgia,"Songti SC",serif;font-size:16.5px;line-height:1.7;font-weight:700;letter-spacing:.01em}',
    '.fv-qdot{width:7px;height:7px;border-radius:50%;flex:0 0 7px}',
    '.fv-plist{display:flex;flex-direction:column}',
    '.fv-prow{display:flex;align-items:center;gap:12px;padding:11px 2px;border-bottom:1px solid var(--fv-line)}',
    '.fv-prow:last-child{border-bottom:0}',
    '.fv-pmainbtn{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px;border:0;background:none;text-align:left;cursor:pointer;padding:0;font:inherit;color:inherit}',
    '.fv-pmainbtn b{font-size:13px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.fv-pmainbtn span{font-size:11px;color:var(--fv-sub)}',
    '.fv-pmainbtn:hover b{color:var(--fv-acc)}',
    '.fv-prow em{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:9.5px;letter-spacing:.06em;flex:0 0 auto;padding-bottom:1px;border-bottom:1px solid currentColor}',
    '.fv-prow .tag-weak{color:#b91c1c}',
    '.fv-prow .tag-fav{color:#b45309}',
    '.fv-overview{display:flex;align-items:center;gap:34px;flex-wrap:wrap}',
    '@keyframes fvGrow{from{transform:scale(.9);opacity:0}to{transform:none;opacity:1}}',
    '.fv-dockwrap{display:contents}',
    '.fv-dock{position:sticky;z-index:40;bottom:calc(70px + env(safe-area-inset-bottom,0px));display:flex;justify-content:center;gap:2px;width:max-content;margin:18px auto 0;padding:6px;border-radius:18px;background:color-mix(in srgb,var(--fv-bg) 84%,transparent);border:1px solid var(--fv-line);box-shadow:0 16px 36px -26px rgba(20,32,28,.7);backdrop-filter:blur(20px) saturate(1.15);-webkit-backdrop-filter:blur(20px) saturate(1.15)}',
    'html[data-layout="workbench"] .fv-dock{bottom:20px}',
    '@media (max-width:900px){html[data-layout="workbench"] .fv-dock{bottom:calc(70px + env(safe-area-inset-bottom,0px))}}',
    '.fv-dock-ind{position:absolute;top:6px;bottom:6px;left:6px;width:62px;border-radius:14px;background:linear-gradient(135deg,var(--fv-acc),#1e3bb8);box-shadow:0 6px 16px -8px rgba(47,75,216,.8);transition:left .38s cubic-bezier(.3,.85,.3,1),width .38s cubic-bezier(.3,.85,.3,1),opacity .2s}',
    '.fv-dock-item{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:3px;min-width:62px;padding:8px 13px;border:0;border-radius:14px;background:none;color:var(--fv-sub);font-size:10.5px;font-weight:600;letter-spacing:.04em;cursor:pointer;transition:color .25s}',
    '.fv-dock-item svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;transition:transform .25s}',
    '.fv-dock-item em{font-style:normal}',
    '.fv-dock-item:hover{color:var(--fv-ink)}',
    '.fv-dock-item:hover svg{transform:translateY(-2px) scale(1.06)}',
    '.fv-dock-item.on{color:#fff}',
    '.fv-dot{position:absolute;top:5px;right:11px;width:6px;height:6px;border-radius:50%;background:#e11d48;box-shadow:0 0 6px #e11d48;display:none}',
    '.fv-dot.show{display:block;animation:fvDot 1.6s infinite}',
    '@keyframes fvDot{50%{opacity:.35}}',
    '.fv-panel{font:13px/1.6 "PingFang SC","Microsoft YaHei",system-ui,sans-serif;color:var(--text-primary,#1b2430);padding:2px}',
    '.fv-panel-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}',
    '.fv-panel-kpis div{border-bottom:1px solid var(--line,#e5e7eb);padding:2px 0 6px}',
    '.fv-panel-kpis b{display:block;font-family:Georgia,serif;font-size:20px;line-height:1.2}',
    '.fv-panel-kpis span{font-size:9.5px;letter-spacing:.1em;color:var(--text-muted,#6b7788)}',
    '.fv-panel-list{display:flex;flex-direction:column}',
    '.fv-panel-row{display:flex;align-items:center;gap:8px;font-size:12px;padding:7px 0;border-bottom:1px solid var(--line,#e5e7eb)}',
    '.fv-panel-row i{width:6px;height:6px;border-radius:50%;flex:0 0 6px}',
    '.fv-panel-row span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.fv-panel-row em{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:9.5px;color:var(--text-muted,#6b7788)}',
    '.fv-panel-empty{font-size:12px;color:var(--text-muted,#6b7788);padding:14px 0;line-height:1.8;border-bottom:1px solid var(--line,#e5e7eb)}',
    '.fv-panel-empty.ok{color:#0f766e}',
    '.fv-panel-foot{margin-top:10px;font-size:10px;letter-spacing:.06em;color:var(--text-muted,#6b7788)}',
    '@media (max-width:760px){.fv-top{gap:10px;padding:11px 14px}.fv-brandtx b{font-size:17px}.fv-kicker{display:none}.fv-kpi{padding:0 9px;min-width:44px}.fv-kpi b{font-size:16px}.fv-kpi i{font-size:8.5px;letter-spacing:.08em}.fv-topacts .fv-btn{font-size:12px}.fv-stage{padding:4px 14px 152px}.fv-fgrid{grid-template-columns:1fr;gap:0}.fv-card-h{flex-wrap:wrap}.fv-dock{width:calc(100vw - 24px);justify-content:space-between}.fv-dock-item{min-width:0;flex:1;padding:7px 2px}.fv-dock-item em{font-size:9.5px}}',
    '@media (prefers-reduced-motion:reduce){.fv-root *,.fv-root *::before,.fv-root *::after{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}}',
    'html[data-theme="night"] .fv-dock{box-shadow:0 16px 40px -26px rgba(0,0,0,.95)}',
    'html[data-theme="night"] .fv-dist-bar,html[data-theme="night"] .fv-subdist{background:rgba(255,255,255,.14)}',
    'html[data-theme="night"] .fv-aura{background-image:repeating-linear-gradient(90deg,rgba(255,255,255,.045) 0 1px,transparent 1px 88px),repeating-linear-gradient(0deg,rgba(255,255,255,.035) 0 1px,transparent 1px 88px)}'
  ].join('')

  /* ---------- 页面专属层：挂载时注入 <style>、destroy 移除 ---------- */
  let CSS_EXTRA = [
    '.fv-fallback{font-family:ui-monospace,Consolas,monospace;font-size:12.5px;color:var(--fv-sub)}',
    '@media print{.fv-top,.fv-dock{display:none}.fv-stage{padding:0}}',
    '.fv-ft{padding:4px 0 6px;overflow-x:auto;font-size:14.5px;line-height:2}',
    '.fv-ft.big{font-size:18px;padding:8px 0;animation:fvReveal .5s cubic-bezier(.22,1,.36,1) both}',
    '.fv-dcell{display:flex;flex-direction:column}',
    '.fv-dcell b{font-family:Georgia,serif;font-size:26px;line-height:1.2;font-variant-numeric:tabular-nums}',
    '.fv-dcell span{font-size:10.5px;color:var(--fv-sub);letter-spacing:.08em}',
    '.fv-prog{display:flex;align-items:center;gap:12px;margin-bottom:14px;font-family:ui-monospace,Consolas,monospace;font-size:10.5px;letter-spacing:.1em;color:var(--fv-sub);text-transform:uppercase}',
    '.fv-progbar{flex:1;height:2px;background:var(--fv-line2);overflow:hidden}',
    '.fv-progbar b{display:block;height:100%;background:var(--fv-acc);transition:width .4s cubic-bezier(.22,1,.36,1)}',
    '.fv-qwhy{display:block;margin-top:7px;font-size:11.5px;color:var(--fv-sub)}',
    '.fv-mask{display:flex;flex-direction:column;align-items:center;gap:9px;padding:38px 12px;border-top:1px solid var(--fv-line);border-bottom:1px solid var(--fv-line)}',
    '.fv-mask-btn{height:36px;padding:0 26px;border:0;border-radius:999px;background:linear-gradient(135deg,var(--fv-acc),#1e3bb8);color:#fff;font-size:13.5px;font-weight:600;cursor:pointer;box-shadow:0 8px 20px -12px rgba(47,75,216,.9);transition:transform .16s}',
    '.fv-mask-btn:hover{transform:translateY(-1px)}',
    '.fv-mask span{font-size:11.5px;color:var(--fv-sub)}',
    '.fv-ask{padding:10px 0 4px 16px;border-left:2px solid var(--fv-line2)}',
    '.fv-ask>b{display:block;font-size:12.5px;margin-bottom:11px}',
    '.fv-grades{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}',
    '.fv-grade{display:flex;flex-direction:column;gap:3px;padding:11px 14px;border:0;border-bottom:2px solid var(--fv-line2);border-radius:0;background:none;text-align:left;cursor:pointer;transition:all .18s}',
    '.fv-grade b{font-size:13px;font-weight:700}',
    '.fv-grade em{font-style:normal;font-size:10.5px;color:var(--fv-sub)}',
    '.fv-grade:hover{transform:translateY(-1px)}',
    '.fv-grade.g1:hover,.v-grade.g1:focus{border-bottom-color:#b91c1c}',
    '.fv-grade.g1:hover b{color:#b91c1c}',
    '.fv-grade.g2:hover{border-bottom-color:#b45309}',
    '.fv-grade.g2:hover b{color:#b45309}',
    '.fv-grade.g3:hover{border-bottom-color:#0f766e}',
    '.fv-grade.g3:hover b{color:#0f766e}',
    '.fv-empty{padding:34px 12px;text-align:center;border-top:1px solid var(--fv-line);border-bottom:1px solid var(--fv-line);display:flex;flex-direction:column;align-items:center;gap:9px}',
    '.fv-empty-ic{color:var(--fv-sub);opacity:.75}',
    '.fv-empty-ic svg{width:26px;height:26px;fill:none;stroke:currentColor;stroke-width:1.4}',
    '.fv-empty b{font-family:Georgia,"Songti SC",serif;font-size:15px}',
    '.fv-empty span{font-size:12px;color:var(--fv-sub);max-width:440px;line-height:1.85}',
    '.fv-ov-ring{display:flex;flex-direction:column;align-items:center;gap:6px}',
    '.fv-ov-ring i{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--fv-sub)}',
    '.fv-ov-grid{flex:1;display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:0 26px}',
    '.fv-ov-cell{padding:9px 0;border-bottom:1px solid var(--fv-line)}',
    '.fv-ov-cell b{display:block;font-family:Georgia,serif;font-size:26px;line-height:1.2;font-variant-numeric:tabular-nums}',
    '.fv-ov-cell span{font-size:10.5px;color:var(--fv-sub);letter-spacing:.06em}',
    '.fv-ring{width:120px;height:120px;animation:fvGrow .6s cubic-bezier(.22,1,.36,1) both}',
    '.fv-ring-t{font:700 20px/1 Georgia,serif;fill:var(--fv-ink)}',
    '.fv-ring-l{font:400 9px/1 ui-monospace,Consolas,monospace;fill:var(--fv-sub);letter-spacing:.1em}',
    '.fv-dist{display:flex;flex-direction:column}',
    '.fv-dist-row{display:flex;align-items:center;gap:14px;padding:8px 0;border-bottom:1px solid var(--fv-line)}',
    '.fv-dist-row:last-child{border-bottom:0}',
    '.fv-dist-n{font-size:12px;font-weight:700;min-width:38px}',
    '.fv-dist-bar{flex:1;height:2px;background:var(--fv-line2);overflow:hidden}',
    '.fv-dist-bar b{display:block;height:100%;background:var(--fv-acc);transition:width .7s cubic-bezier(.22,1,.36,1)}',
    '.fv-dist-bar.d1 b{background:#b91c1c}',
    '.fv-dist-bar.d2 b{background:#b45309}',
    '.fv-dist-bar.d3 b{background:var(--fv-acc)}',
    '.fv-dist-bar.d4 b{background:#0f766e}',
    '.fv-dist-row em{font-style:normal;font-family:Georgia,serif;font-size:14px;font-weight:700;min-width:28px;text-align:right;font-variant-numeric:tabular-nums}',
    '.fv-subjrow{display:flex;align-items:center;gap:14px;padding:9px 0;border-bottom:1px solid var(--fv-line)}',
    '.fv-subjrow:last-child{border-bottom:0}',
    '.fv-subjname{font-size:12px;font-weight:700;min-width:64px}',
    '.fv-subdist{flex:1;height:2px;background:var(--fv-line2);overflow:hidden}',
    '.fv-subdist b{display:block;height:100%}',
    '.fv-subjrow em{font-style:normal;font-family:Georgia,serif;font-size:15px;font-weight:700;min-width:28px;text-align:right;font-variant-numeric:tabular-nums}',
    '.fv-subjn{font-family:ui-monospace,Consolas,monospace;font-size:10px;color:var(--fv-sub);min-width:56px;text-align:right}',
    '.fv-bars-wrap{margin:8px 0 6px}',
    '.fv-bars{width:100%;height:92px;display:block}',
    '.fv-axis{display:flex;justify-content:space-between;font-family:ui-monospace,Consolas,monospace;font-size:10px;color:var(--fv-sub);letter-spacing:.06em}',
    '.fv-health{display:flex;gap:26px;flex-wrap:wrap;margin-bottom:6px}',
    '.fv-hcell{display:inline-flex;align-items:center;gap:7px;font-size:11.5px;color:var(--fv-sub);padding-bottom:4px;border-bottom:1px solid var(--fv-line)}',
    '.fv-hcell i{width:6px;height:6px;border-radius:50%;background:var(--fv-sub)}',
    '.fv-hcell.ok{color:#0f766e;border-bottom-color:rgba(15,118,110,.4)}',
    '.fv-hcell.ok i{background:#0f766e}',
    '.fv-hcell.no{color:#b45309;border-bottom-color:rgba(180,83,9,.35)}',
    '.fv-hcell.no i{background:#b45309}',
    '.fv-cfglist{display:flex;flex-direction:column}',
    '.fv-cfgrow{display:grid;grid-template-columns:130px 76px 1fr;gap:14px;align-items:baseline;font-size:12px;padding:10px 0;border-bottom:1px solid var(--fv-line)}',
    '.fv-cfgrow b{font-weight:700}',
    '.fv-cfgrow em{font-style:normal;color:var(--fv-acc);font-family:Georgia,serif;font-size:14px;font-weight:700}',
    '.fv-cfgrow span{color:var(--fv-sub);font-size:11.5px;line-height:1.7}',
    '.fv-about p{margin:0 0 9px;font-size:12.5px;line-height:1.9;color:var(--fv-sub);padding-left:14px;border-left:1px solid var(--fv-line)}',
    '.fv-about p b{color:var(--fv-ink)}',
    /* 易混对比：两条并排才看得出差别；VS 徽标浮在中间 */
    '.fv-confuse{padding-bottom:10px}',
    '.fv-crow{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:14px 0 12px;border-top:1px dashed var(--fv-line);animation:fvFade .4s both}',
    '.fv-crow:first-of-type{border-top:0}',
    '.fv-vs{position:absolute;left:50%;top:16px;transform:translateX(-50%);z-index:1;width:30px;height:30px;display:grid;place-items:center;border-radius:50%;background:var(--fv-bg);border:1px solid var(--fv-line2);font:700 9.5px/1 ui-monospace,Consolas,monospace;letter-spacing:.02em;color:var(--fv-sub)}',
    '.fv-cside{display:flex;flex-direction:column;gap:3px;min-width:0}',
    '.fv-cside>b{font-size:13px;font-weight:700}',
    '.fv-cnote{grid-column:1/-1;margin-top:8px;padding:9px 0 9px 14px;border-left:2px solid var(--fv-acc);font-size:12px;line-height:1.8;color:var(--fv-sub)}',
    /* 自建公式表单 */
    '.fv-form{display:flex;flex-direction:column;gap:14px;min-width:320px}',
    '.fv-form label{display:flex;flex-direction:column;gap:5px;font-size:11.5px;color:var(--fv-sub);letter-spacing:.04em;font-weight:600}',
    '.fv-form label b{color:#b91c1c}',
    '.fv-form select.fv-input{height:34px}',
    '.fv-form textarea.fv-input{height:auto;padding:6px 2px;line-height:1.75;resize:vertical}',
    /* 章节掌握度（站内 Charts.bar 容器） */
    '.fv-chapbars{margin:6px 0 4px}',
    /* 快捷键一览 */
    '.fv-keys{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:0 26px}',
    '.fv-krow{display:flex;align-items:baseline;gap:10px;padding:8px 0;border-bottom:1px solid var(--fv-line);font-size:12px}',
    '.fv-krow:last-child{border-bottom:0}',
    '.fv-krow kbd{font-family:ui-monospace,Consolas,monospace;font-size:10px;padding:2px 7px;border:1px solid var(--fv-line2);border-radius:4px;background:var(--fv-soft);color:var(--fv-ink);flex:0 0 auto}',
    '.fv-krow span{color:var(--fv-sub);font-size:11.5px}',
    /* 未来 7 天复测计划 */
    '.fv-plan{display:flex;flex-direction:column}',
    '.fv-planrow{display:flex;align-items:center;gap:14px;padding:8px 0;border-bottom:1px solid var(--fv-line)}',
    '.fv-planrow:last-child{border-bottom:0}',
    '.fv-pland{font-family:ui-monospace,Consolas,monospace;font-size:11px;color:var(--fv-sub);min-width:52px;letter-spacing:.06em}',
    '.fv-planbar{flex:1;height:2px;background:var(--fv-line2);overflow:hidden}',
    '.fv-planbar b{display:block;height:100%;background:var(--fv-acc);transition:width .6s cubic-bezier(.22,1,.36,1)}',
    '.fv-planrow em{font-style:normal;font-family:Georgia,serif;font-size:14px;font-weight:700;min-width:24px;text-align:right;font-variant-numeric:tabular-nums}',
    /* 最近自测明细 */
    '.fv-thin{display:flex;flex-direction:column}',
    '.fv-thin-row{display:flex;align-items:center;gap:14px;padding:9px 0;border-bottom:1px solid var(--fv-line)}',
    '.fv-thin-row:last-child{border-bottom:0}',
    '.fv-thin-n{font-family:Georgia,serif;font-size:14px;width:16px;flex:0 0 16px;text-align:center}',
    '.fv-thin-row>div{flex:1;min-width:0;display:flex;flex-direction:column}',
    '.fv-thin-row b{font-size:12.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.fv-thin-row span{font-size:10.5px;color:var(--fv-sub)}',
    '.fv-thinn{font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:10px;color:var(--fv-sub);white-space:nowrap}',
    /* 草稿纸：揭示前的作答区（稿纸质感：左竖线 + 淡底） */
    '.fv-ta{width:100%;border:0;border-left:2px solid color-mix(in srgb,var(--fv-acc) 55%,transparent);border-radius:0;padding:12px 14px;background:color-mix(in srgb,var(--fv-ink) 2.5%,transparent);color:var(--fv-ink);font:13.5px/1.85 inherit;outline:none;resize:vertical;min-height:130px;transition:background .16s,border-color .16s}',
    '.fv-ta:focus{background:color-mix(in srgb,var(--fv-acc) 4%,transparent);border-left-color:var(--fv-acc)}',
    '.fv-draftprev{font-family:ui-monospace,Consolas,monospace;font-size:10px;color:var(--fv-sub);letter-spacing:.08em;margin-top:8px}',
    '.fv-draftshow{margin:0 0 14px;padding:10px 0 10px 16px;border-left:2px dashed var(--fv-line2)}',
    '.fv-draftshow b{display:block;font-family:ui-monospace,Consolas,monospace;font-size:9.5px;letter-spacing:.14em;color:var(--fv-sub);text-transform:uppercase;margin-bottom:5px}',
    '.fv-draftshow p{margin:0;font-size:12.5px;line-height:1.85;white-space:pre-wrap;color:var(--fv-sub)}'
  ].join('')

  /* ══════════════ 7. 视图 ══════════════ */
  const VIEWS = [
    { k: 'vault', n: '军火库', icon: 'vault' },
    { k: 'drill', n: '自测', icon: 'drill' },
    { k: 'ammo', n: '弹药箱', icon: 'ammo' },
    { k: 'stats', n: '统计', icon: 'stats' },
    { k: 'setup', n: '设置', icon: 'setup' }
  ]

  /* ---- 7.1 军火库：分科 + 章节手风琴 ---- */
  function viewVault(ctx, S, list) {
    let out = []
    let k = kpiOf(S, ctx)
    /* 顶部一行：总览 + 今日目标 */
    out.push('<div class="fv-goalline' + (k.goalMet ? ' ok' : '') + '">'
      + '<b>今日 ' + k.today + ' / ' + k.goal + '</b>'
      + '<span>' + (k.goalMet ? '目标达成 —— 顺手把不熟的再拖一遍。' : '再自测 ' + (k.goal - k.today) + ' 个达标。') + '</span>'
      + '<i class="fv-goalbar"><b style="width:' + Math.min(100, Math.round(k.today / k.goal * 100)) + '%"></b></i>'
      + '</div>')

    /* 搜索 + 学科 chips */
    out.push('<div class="fv-searchbar">'
      + '<input class="fv-input fv-search" data-fv="q" placeholder="搜公式名 / 章节 / 记忆点…" value="' + esc(S.q) + '" maxlength="30">'
      + '<div class="fv-subjbar">'
      + '<button class="fv-schip' + (S.subj === 'all' ? ' on' : '') + '" data-act="subj" data-k="all">全部</button>'
      + SUBJ_ORDER.map(function (s) {
        return '<button class="fv-schip' + (S.subj === s ? ' on' : '') + '" data-act="subj" data-k="' + s + '" style="--c:' + subjectColor(s) + '">' + subjectLabel(s) + '</button>'
      }).join('')
      + '</div></div>')

    let q = String(S.q || '').trim().toLowerCase()
    /* 易混对比：搜索词为空且没按学科过滤时才显示（避免和列表抢注意力） */
    if (!q && S.subj === 'all' && S.openChap.confuse !== false) {
      out.push('<section class="fv-card fv-confuse"><div class="fv-card-h"><b>易混对比</b><em>分不清 = 做不对</em>'
        + '<button class="fv-btn ghost sm" data-act="chap" data-k="confuse">收起</button></div>')
      for (let i = 0; i < CONFUSE.length; i++) out.push(confuseRow(ctx, list, CONFUSE[i]))
      out.push('</section>')
    }

    let filtered = list.filter(function (f) {
      if (S.subj !== 'all' && f.s !== S.subj) return false
      if (!q) return true
      return (f.n + ' ' + f.c + ' ' + f.p + ' ' + f.w + ' ' + subjectLabel(f.s)).toLowerCase().indexOf(q) >= 0
    })
    let groups = chaptersOf(filtered, S.subj)
    if (!groups.length) {
      out.push('<div class="fv-quiet">没有匹配的公式。换个词，或切回「全部」学科。</div>')
      return out.join('')
    }
    for (let i = 0; i < groups.length; i++) {
      let g = groups[i]
      let open = S.openChap[g.chap] !== false && (!q || true)
      let sec = S.openChap[g.chap] === false
      out.push('<section class="fv-chap' + (sec ? '' : ' open') + '">')
      out.push('<button class="fv-chap-h" data-act="chap" data-k="' + esc(g.chap) + '">'
        + '<span class="fv-chap-arrow" aria-hidden="true"></span>'
        + '<b>' + esc(g.chap) + '</b>'
        + '<em>' + g.items.length + ' 条</em>'
        + '</button>')
      if (!sec) {
        out.push('<div class="fv-fgrid">')
        for (let j = 0; j < g.items.length; j++) out.push(formulaCard(ctx, S, g.items[j]))
        out.push('</div>')
      }
      out.push('</section>')
    }
    out.push('<div class="fv-more">共 ' + filtered.length + ' 条公式（含自建 ' + S.customCount + ' 条）。'
      + '<button class="fv-btn sm" data-act="newf" style="margin-left:10px">+ 自建公式</button>'
      + '数据存在浏览器本地，可随时导出备份。</div>')
    return out.join('')
  }

  /** 公式卡：标题 + LaTeX + 记忆点 + 易错 + 熟练度刻度 + 操作 */
  function formulaCard(ctx, S, f) {
    let r = S.recs[f.id] || null
    let col = masteryColor(r ? r.mastery : 0)
    let stars = masteryStars(r ? r.mastery : 0)
    let hit = S.selId === f.id
    return '<article class="fv-fcard' + (hit ? ' sel' : '') + '" data-id="' + esc(f.id) + '">'
      + '<div class="fv-fcard-h">'
      + '<span class="fv-fsubj" style="--c:' + subjectColor(f.s) + '">' + esc((SUBJ[f.s] && SUBJ[f.s].short) || f.s) + '</span>'
      + '<b>' + esc(f.n) + '</b>'
      + '<em class="fv-fstars" title="掌握度 ' + (r ? r.mastery : 0) + '">' + stars + '</em>'
      + '</div>'
      + '<div class="fv-ft">' + katexTex(f.t, true) + '</div>'
      + (f.p ? '<div class="fv-fp"><i>记</i>' + katexTex(f.p) + '</div>' : '')
      + (f.w ? '<div class="fv-fw"><i>坑</i>' + katexTex(f.w) + '</div>' : '')
      + '<div class="fv-fcard-f">'
      + '<span class="fv-fnext">' + (r && r.nextAt ? (overdue(S.today, r.nextAt) ? '<b class="hot">已到期</b>' : fmtDate(r.nextAt) + ' 复测') : '未测') + '</span>'
      + '<button class="fv-btn sm" data-act="drill-one" data-id="' + esc(f.id) + '">自测这条</button>'
      + '<button class="fv-btn sm' + (r && r.fav ? ' on' : '') + '" data-act="fav" data-id="' + esc(f.id) + '">' + (r && r.fav ? '已收藏' : '收藏') + '</button>'
      + '<button class="fv-btn sm ghost" data-act="ai-mnem" data-id="' + esc(f.id) + '">AI 助记</button>'
      + '</div>'
      + ((S.aiNote && S.aiNote.id === f.id) || (S.aiNoteBatch && S.aiNoteBatch[f.id]) ? '<div class="fv-ainote">'
      + (function () {
        let n = (S.aiNote && S.aiNote.id === f.id) ? S.aiNote : (S.aiNoteBatch ? S.aiNoteBatch[f.id] : null)
        if (!n) return ''
        return (n.mnemonic ? '<b>口诀</b>' + esc(n.mnemonic) : '') + (n.derivation ? '<b>线索</b>' + esc(n.derivation) : '')
      })()
      + '</div>' : '')
      + '</article>'
  }

  /* ---- 7.2 自测台 ---- */
  function viewDrill(ctx, S) {
    let out = []
    if (S.run) return drillRunning(ctx, S)
    /* 未开始：说明今日任务 + 入口 */
    let due = dueList(S.recs, S.today)
    let untested = untestedList(S.recs, S.all)
    out.push('<section class="fv-card">'
      + '<div class="fv-card-h"><b>开始一轮自测</b><em>先回忆 · 后揭示 · 三档自评</em></div>')
    out.push('<div class="fv-drill-intro">'
      + '<div class="fv-dcell"><b>' + due.length + '</b><span>到期复测</span></div>'
      + '<div class="fv-dcell"><b>' + untested.length + '</b><span>从未测过</span></div>'
      + '<div class="fv-dcell"><b>' + Math.min(untested.length + due.length, 10) + '</b><span>本轮上限</span></div>'
      + '</div>')
    out.push('<div class="fv-acts">'
      + (due.length ? '<button class="fv-btn primary" data-act="drill-start" data-mode="due">复练到期的 ' + due.length + ' 条</button>' : '')
      + '<button class="fv-btn' + (due.length ? '' : ' primary') + '" data-act="drill-start" data-mode="mixed">混合抽练（到期优先 + 未测）</button>'
      + '<button class="fv-btn ghost" data-act="drill-start" data-mode="weak">只练弹药箱</button>'
      + '</div>')
    out.push('<div class="fv-quiet">规则：每题先看公式名与使用场景，在脑子里（或草稿上）复现公式，再揭示对照。'
      + '自评三档会决定下次出现的时机——「秒想」最长间隔，「没想起」最短。</div>')
    out.push('</section>')
    return out.join('')
  }

  /** 自测进行中的一题（遮罩态 / 揭示态） */
  function drillRunning(ctx, S) {
    let run = S.run
    let f = run.queue[run.idx]
    if (!f) { S.run = null; return viewDrill(ctx, S) }
    let r = S.recs[f.id] || normRec(null)
    let revealed = run.revealed
    let out = ['<section class="fv-card fv-drillcard">']
    out.push('<div class="fv-prog"><span>第 ' + (run.idx + 1) + ' / ' + run.queue.length + ' 题</span>'
      + '<span class="fv-progbar"><b style="width:' + Math.round((run.idx) / run.queue.length * 100) + '%"></b></span>'
      + '<span class="fv-clock">' + fmtDur(run.ms) + '</span></div>')
    /* 题面：名字 + 科目章节 + 场景提示（公式本体遮住） */
    out.push('<div class="fv-q">'
      + '<span class="fv-fsubj" style="--c:' + subjectColor(f.s) + '">' + esc((SUBJ[f.s] && SUBJ[f.s].short) || f.s) + ' · ' + esc(f.c) + '</span>'
      + '<b>' + esc(f.n) + '</b>'
      + '<span class="fv-qwhy">场景提示：' + esc(hintOf(f)) + '</span>'
      + '</div>')
    if (!revealed) {
      /* 草稿纸：脑子里复现不如写下来。揭示前给出作答区，写过的推导会作为
       * 「本轮草稿」跟着走，揭示后一并显示对照（不落库 —— 它是思考痕迹不是成绩）。 */
      out.push('<div class="fv-mask">'
        + '<button class="fv-mask-btn" data-act="reveal">揭示公式</button>'
        + '<span>先在脑子里（或草稿上）复现，再点开对照 —— 点太早就等于抄了一遍</span>'
        + '<button class="fv-btn ghost sm" data-act="draft">' + (run.draftOpen ? '收起草稿纸' : '展开草稿纸') + '</button>'
        + '</div>')
      if (run.draftOpen) {
        out.push('<textarea class="fv-ta" data-fv="draft" placeholder="在这里复现公式 / 写推导过程（仅本轮有效，不影响判定）">'
          + esc(run.draft || '') + '</textarea>')
      } else if (run.draft) {
        out.push('<div class="fv-draftprev">已写 ' + run.draft.length + ' 字草稿</div>')
      }
    } else {
      if (run.draft) {
        out.push('<div class="fv-draftshow"><b>你刚才的草稿</b><p>' + esc(run.draft) + '</p></div>')
      }
      out.push('<div class="fv-ft big">' + katexTex(f.t, true) + '</div>')
      if (f.p) out.push('<div class="fv-fp"><i>记</i>' + katexTex(f.p) + '</div>')
      if (f.w) out.push('<div class="fv-fw"><i>坑</i>' + katexTex(f.w) + '</div>')
      out.push('<div class="fv-ask"><b>刚才复现得怎么样？</b>'
        + '<div class="fv-grades">'
        + '<button class="fv-grade g1" data-act="grade" data-k="miss"><b>没想起</b><em>完全没方向或记错</em></button>'
        + '<button class="fv-grade g2" data-act="grade" data-k="slow"><b>想一下</b><em>磕绊/漏条件</em></button>'
        + '<button class="fv-grade g3" data-act="grade" data-k="fast"><b>秒想</b><em>一次到位</em></button>'
        + '</div></div>')
    }
    out.push('<div class="fv-acts"><button class="fv-btn ghost" data-act="drill-abort">结束本轮</button></div>')
    out.push('</section>')
    return out.join('')
  }

  /** 场景提示：从章节名 + 记忆点里取最有信息量的一句（不能泄露公式本体） */
  /* ---- 章节专属的元认知提问 ----
   * 为什么需要这张表：137 条公式里有 83 条的记忆要点/易错点含 LaTeX，
   * 剥掉后剩下的文字不足以当提示，只能降级 —— 如果所有降级都给同一句通用提问，
   * 用户连练三条就腻了（真机统计过：83/137 会走到降级分支）。
   * 按章节给一句"这一章该问自己什么"，既不含公式本体，又能真的勾起回忆。 */
  const CHAP_ASK = {
    '极限与连续': '它处理的是哪种不定式？代换/夹逼/洛必达谁先上？',
    '一元函数微分学': '它描述的是变化率、几何性质，还是高阶规律？',
    '一元函数积分学': '它是算面积、找原函数，还是换一种算法？',
    '中值定理与证明': '结论要的是"存在某点"还是"某个等式"？三个条件各是什么？',
    '多元函数微分学': '它是一阶（方向导数/梯度）还是二阶（极值判别）？',
    '重积分': '先看区域形状选坐标系，还是先定积分次序？',
    '曲线曲面积分': '它是"带弧长/面积"（第一类）还是"带方向"（第二类）？',
    '无穷级数': '判的是收敛还是求和？通项长什么样？',
    '常微分方程': '先认型（可分离/线性/齐次/常系数），再套法',
    '行列式': '它算的是一个数还是一堆数？哪条性质能化简？',
    '矩阵': '它说的是运算律、可逆性还是秩的关系？',
    '向量': '判的是线性相关性还是正交性？',
    '方程组': '齐次还是非齐次？解的结构怎么拼？',
    '特征值': '要的是特征值本身、特征向量还是对角化？',
    '二次型': '标准形怎么化？正定怎么判？',
    '随机事件': '求的是概率、条件概率还是独立性判断？',
    '一维分布': '先认分布类型，再套它的期望与方差',
    '二维分布': '要的是边缘分布、条件分布还是独立性？',
    '数字特征': '用的是期望的线性，还是方差/协方差公式？',
    '大数定律': '样本均值趋于什么？前提条件有几个？',
    '中心极限定理': '标准化之后极限分布是什么？分母是什么？',
    '数理统计': '它是估计（矩/最大似然）还是检验/区间估计？'
  }
  /** 这条线索"剥掉公式后还读得通吗"。
   *  判据：① 剩下可读字 >= 6 ② 丢掉的字符不超过留下的
   *  —— 否则句子会断裂（"换成 、 时…""配 ，1∞ 那个配"），比不给线索更糟。 */
  function fragReadable(raw, frag) {
    let keep = (String(frag).match(/[\u4e00-\u9fa5A-Za-z0-9]/g) || []).length
    if (keep < 6) return false
    let dropped = String(raw == null ? '' : raw).length - String(frag).length
    return dropped <= keep
  }
  /** 剥掉 LaTeX 后剩下的文字碎片（连占位符一起去掉，只留能读的部分） */
  function hintFrag(s) {
    return String(s == null ? '' : s)
      .replace(/\$\$[^$]*\$\$/g, ' ')
      .replace(/\$[^$]*\$/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/^[，。、；：\s]+|[，。、；：\s]+$/g, '')
      .trim()
  }

  /** 剥掉文本里的 LaTeX 段（$...$ / $$...$$）——用于"不能泄露公式本体"的场景 */
  function stripTex(s) {
    return String(s == null ? '' : s)
      .replace(/\$\$[^$]*\$\$/g, '（公式）')
      .replace(/\$[^$]*\$/g, '（公式）')
  }
  function hintOf(f) {
    /* 章节名始终给出（定位感）；易错/线索做裁剪。
     * **绝不包含公式本体** —— 提示泄露了公式，这一题就等于白练（抄写不是回忆）。
     * 种子库的记忆要点里偶有 LaTeX 片段（如"配 $\\frac{\\sin ax}{ax}$"），统一剥掉。
     * 但剥完可能只剩一串「（公式）」占位符（信息量为零）→ 此时退化成**元认知提问**：
     * 问适用条件与联用，不碰任何形式细节，同样不泄露，且真的能勾起回忆。 */
    /* 逐条判定：剥掉公式后还读得通的才保留，读不通的整条丢掉
     * （半截句子比没有线索更误导）。两条都不可用 → 降级到本章专属提问。 */
    let bits = ['章节：' + f.c]
    let w = shortTitle(hintFrag(f.w), 24)
    let p = shortTitle(hintFrag(f.p), 24)
    if (w && fragReadable(f.w, w)) bits.push('易错：' + w)
    if (p && fragReadable(f.p, p)) bits.push('线索：' + p)
    if (bits.length > 1) return bits.join('　')
    let ask = CHAP_ASK[f.c] || '它的适用条件是什么？常和哪条公式联用？'
    return '章节：' + f.c + '　先问自己：' + ask
  }

  /* ---- 7.3 弹药箱（不熟的公式） ---- */
  function viewAmmo(ctx, S) {
    let out = []
    let weak = S.all.filter(function (f) { return isWeak(S.recs[f.id]) })
    let fav = S.all.filter(function (f) { return S.recs[f.id] && S.recs[f.id].fav })
    let rows = weak.concat(fav.filter(function (f) { return weak.indexOf(f) < 0 }))
    out.push('<section class="fv-card"><div class="fv-card-h"><b>弹药箱</b><em>'
      + weak.length + ' 个不熟 · ' + fav.length + ' 个收藏</em>'
      + (rows.length ? '<button class="fv-btn primary sm" data-act="drill-ammo">全练一遍</button>'
      + '<button class="fv-btn sm" data-act="ai-batch">批量 AI 助记</button>' : '')
      + '</div>')
    if (!rows.length) {
      out.push('<div class="fv-empty"><div class="fv-empty-ic">' + U_icon('ammo') + '</div>'
        + '<b>弹药箱是空的</b><span>自评「没想起」或「想一下」的公式会自动进这里；也可以在任何公式卡上点「收藏」手动加。</span></div>')
    } else {
      out.push('<div class="fv-plist">')
      for (let i = 0; i < rows.length; i++) {
        let f = rows[i]
        let r = S.recs[f.id]
        let tags = []
        if (isWeak(r)) tags.push('<em class="tag-weak">不熟</em>')
        if (r && r.fav) tags.push('<em class="tag-fav">收藏</em>')
        out.push('<div class="fv-prow">'
          + '<span class="fv-qdot" style="background:' + subjectColor(f.s) + '"></span>'
          + '<button class="fv-pmainbtn" data-act="pick" data-id="' + esc(f.id) + '"><b>' + esc(f.n) + '</b>'
          + '<span>' + esc(f.c) + ' · 掌握度 ' + (r ? r.mastery : 0) + ' · 漏 ' + (r ? r.miss : 0) + ' / 磕 ' + (r ? r.slow : 0) + '</span></button>'
          + tags.join('')
          + '<button class="fv-btn sm" data-act="drill-one" data-id="' + esc(f.id) + '">自测</button>'
          + '</div>')
      }
      out.push('</div>')
    }
    out.push('</section>')

    /* ---- 未来 7 天复测计划：提前知道哪天有几条，别被突然的到期打懵 ---- */
    let plan = []
    for (let i = 0; i < 7; i++) {
      let d = new Date()
      d.setDate(d.getDate() + i)
      let k = todayKey(d)
      let n = 0
      for (let fid in S.recs) if (S.recs[fid] && S.recs[fid].nextAt === k) n++
      plan.push({ k: k, label: i === 0 ? '今天' : (i === 1 ? '明天' : (d.getMonth() + 1) + '/' + d.getDate()), n: n })
    }
    let planMax = Math.max.apply(null, plan.map(function (x) { return x.n }).concat([1]))
    out.push('<section class="fv-card"><div class="fv-card-h"><b>未来 7 天复测计划</b><em>按到期日</em></div>')
    out.push('<div class="fv-plan">')
    for (let i = 0; i < plan.length; i++) {
      out.push('<div class="fv-planrow"><span class="fv-pland">' + plan[i].label + '</span>'
        + '<i class="fv-planbar"><b style="width:' + Math.round(plan[i].n / planMax * 100) + '%"></b></i>'
        + '<em>' + plan[i].n + '</em></div>')
    }
    out.push('</div></section>')
    return out.join('')
  }

  /* ---- 7.4 统计 ---- */
  function viewStats(ctx, S) {
    let out = []
    let logs = S.logs
    let k = kpiOf(S, ctx)
    /* 总览环 + 数字格 */
    let avg = logs.length ? Math.round(logs.reduce(function (a, b) { return a + (b.score || 0) }, 0) / logs.length) : 0
    out.push('<section class="fv-card"><div class="fv-card-h"><b>自测总览</b><em>' + logs.length + ' 次记录</em></div>')
    out.push('<div class="fv-overview">'
      + '<div class="fv-ov-ring"><svg viewBox="0 0 120 120" class="fv-ring">'
      + '<circle cx="60" cy="60" r="52" fill="none" stroke="var(--fv-line2)" stroke-width="9"/>'
      + '<circle cx="60" cy="60" r="52" fill="none" stroke="var(--fv-acc)" stroke-width="9" stroke-linecap="round"'
      + ' stroke-dasharray="' + (2 * Math.PI * 52 * avg / 100).toFixed(1) + ' 999" transform="rotate(-90 60 60)"/>'
      + '<text x="60" y="58" text-anchor="middle" class="fv-ring-t">' + avg + '</text>'
      + '<text x="60" y="76" text-anchor="middle" class="fv-ring-l">均分</text>'
      + '</svg><i>AVERAGE</i></div>')
    out.push('<div class="fv-ov-grid">')
    out.push(ovCell(k.today + ' / ' + k.goal, '今日完成'))
    out.push(ovCell(k.due, '今日到期'))
    out.push(ovCell(k.nodes, '公式总数'))
    out.push(ovCell(k.streak, '连续达标（天）'))
    out.push('</div></div></section>')

    /* 掌握度分布（按档位） */
    let dist = [0, 0, 0, 0, 0]
    for (let i = 0; i < S.all.length; i++) {
      let m = (S.recs[S.all[i].id] || {}).mastery || 0
      let b = m === 0 ? 0 : (m < 40 ? 1 : (m < 60 ? 2 : (m < 80 ? 3 : 4)))
      dist[b]++
    }
    let distMax = Math.max.apply(null, dist) || 1
    let labels = ['未测', '生疏', '模糊', '会用', '熟练']
    out.push('<section class="fv-card"><div class="fv-card-h"><b>掌握度分布</b><em>' + S.all.length + ' 条公式</em></div>')
    out.push('<div class="fv-dist">')
    for (let i = 0; i < 5; i++) {
      out.push('<div class="fv-dist-row"><span class="fv-dist-n">' + labels[i] + '</span>'
        + '<i class="fv-dist-bar d' + i + '"><b style="width:' + Math.round(dist[i] / distMax * 100) + '%"></b></i>'
        + '<em>' + dist[i] + '</em></div>')
    }
    out.push('</div></section>')

    /* 分科熟练度 */
    out.push('<section class="fv-card"><div class="fv-card-h"><b>分科熟练度</b><em>按科目</em></div>')
    for (let si = 0; si < SUBJ_ORDER.length; si++) {
      let s = SUBJ_ORDER[si]
      let items = S.all.filter(function (f) { return f.s === s })
      let tested = items.filter(function (f) { return S.recs[f.id] })
      let m = tested.length
        ? Math.round(tested.reduce(function (a, b) { return a + S.recs[b.id].mastery }, 0) / tested.length)
        : 0
      out.push('<div class="fv-subjrow"><span class="fv-subjname" style="color:' + subjectColor(s) + '">' + subjectLabel(s) + '</span>'
        + '<i class="fv-subdist"><b style="width:' + m + '%;background:' + subjectColor(s) + '"></b></i>'
        + '<em>' + m + '</em><span class="fv-subjn">' + tested.length + '/' + items.length + ' 测过</span></div>')
    }
    out.push('</section>')

    /* 章节掌握度：走站内 Charts.bar —— 与洞察/复盘同一张图的口径 */
    out.push('<section class="fv-card"><div class="fv-card-h"><b>章节掌握度</b><em>只统计测过的</em></div>')
    let chapData = []
    let chapGroups = chaptersOf(S.all, 'all')
    for (let i = 0; i < chapGroups.length; i++) {
      let tested = chapGroups[i].items.filter(function (f) { return S.recs[f.id] })
      if (!tested.length) continue
      let m = Math.round(tested.reduce(function (a, b) { return a + S.recs[b.id].mastery }, 0) / tested.length)
      chapData.push({ label: shortTitle(chapGroups[i].chap, 6), value: m })
    }
    if (!chapData.length) {
      out.push('<div class="fv-quiet">还没有任何章节被测过。从「军火库」点「自测这条」开始。</div>')
    } else if (ctx.Charts && ctx.Charts.bar) {
      out.push('<div class="fv-chapbars">' + ctx.Charts.bar(chapData, { height: 150, color: '#2f4bd8' }) + '</div>')
    } else {
      out.push('<div class="fv-quiet">站内 Charts 不可用，章节掌握度暂不显示。</div>')
    }
    out.push('</section>')

    /* 最近自测明细：看出"最近在练什么、手感如何" */
    let recent = S.logs.slice(-10).reverse()
    out.push('<section class="fv-card"><div class="fv-card-h"><b>最近自测</b><em>最近 ' + recent.length + ' 次</em></div>')
    if (!recent.length) out.push('<div class="fv-quiet">还没有自测记录。</div>')
    else {
      out.push('<div class="fv-thin">')
      for (let i = 0; i < recent.length; i++) {
        let l = recent[i]
        let f = findF(S.all, l.fid)
        let col = masteryColor(scoreOf(l.k))
        out.push('<div class="fv-thin-row">'
          + '<span class="fv-thin-n" style="color:' + col + '">' + gradeGlyph(l.k) + '</span>'
          + '<div><b>' + esc(f ? f.n : '（已删除）') + '</b>'
          + '<span>' + esc(f ? f.c : '') + ' · ' + fmtDate(dkey(l.at)) + ' · ' + fmtDur(l.ms) + '</span></div>'
          + '<em class="fv-thinn">' + l.score + ' 分</em>'
          + '</div>')
      }
      out.push('</div>')
    }
    out.push('</section>')

    /* 近 14 天自测量 */
    out.push('<section class="fv-card"><div class="fv-card-h"><b>近 14 天自测</b><em>条/天</em></div>')
    let rows = lastNDays(ctx, 14, function (dayKey) {
      return logs.filter(function (l) { return dkey(l.at) === dayKey }).length
    })
    out.push(barsSvg(rows))
    out.push('<div class="fv-axis"><span>14 天前</span><span>今天</span></div>')
    out.push('</section>')
    return out.join('')
  }

  function ovCell(b, label) {
    return '<div class="fv-ov-cell"><b>' + b + '</b><span>' + label + '</span></div>'
  }

  /* ---- 7.5 设置 ---- */
  function viewSetup(ctx, S) {
    let out = []
    out.push('<section class="fv-card"><div class="fv-card-h"><b>AI 体检</b><em>' + (aiOk(ctx) ? '已就绪' : '未配置') + '</em></div>')
    out.push('<div class="fv-health">'
      + '<span class="fv-hcell ' + (aiOk(ctx) ? 'ok' : 'no') + '"><i></i>' + (aiOk(ctx) ? 'AI 可用（助记/补写都能用）' : 'AI 未配置 —— 手动模式：可浏览、可自测，AI 助记不可用') + '</span>'
      + '<span class="fv-hcell ' + (window.katex ? 'ok' : 'no') + '"><i></i>'
      + (window.katex ? '公式渲染走 KaTeX 0.16（本地资产）' : 'KaTeX 未就绪（先显示纯文本，就绪后自动重绘）') + '</span>'
      + '<span class="fv-hcell ' + (ctx.Spaced ? 'ok' : 'no') + '"><i></i>' + (ctx.Spaced ? '复测排期走站内 SRS' : 'SRS 不可用（本地简化排期）') + '</span>'
      + '</div></section>')

    out.push('<section class="fv-card"><div class="fv-card-h"><b>当前设置</b><em>来自插件配置</em></div>')
    out.push('<div class="fv-cfglist">')
    out.push(cfgRow('每日自测目标', ctx.config('dailyGoal'), '达标即算完成一天，可 1-10'))
    out.push(cfgRow('每轮题量', ctx.config('roundSize'), '一轮最多多少条，默认 10'))
    out.push(cfgRow('到期推送', ctx.config('notify') === false ? '关' : '开', '打开插件时若有到期会提示一次'))
    out.push('</div></section>')

    out.push('<section class="fv-card"><div class="fv-card-h"><b>数据</b><em>本地存储</em></div>')
    out.push('<div class="fv-acts">'
      + '<button class="fv-btn" data-act="export">导出 JSON</button>'
      + '<button class="fv-btn" data-act="export-md">导出 Markdown</button>'
      + '<button class="fv-btn" data-act="import">导入合并</button>'
      + '<button class="fv-btn ghost" data-act="reset">清空自测记录</button>'
      + '</div>')
    out.push('<div class="fv-quiet">自测记录与弹药箱都在浏览器本地（插件云数据独立文件），不掺进站内 core 数据。'
      + '清空只删自测历史，公式库本身是插件内置资产，不受影响。</div>')
    out.push('</section>')

    out.push('<section class="fv-card"><div class="fv-card-h"><b>快捷键</b><em>键盘党</em></div>')
    out.push('<div class="fv-keys">')
    out.push(krow('1 - 5', '切换五个视图'))
    out.push(krow('D', '直接开一轮（到期优先）'))
    out.push(krow('R', '揭示公式'))
    out.push(krow('1 / 2 / 3', '揭示后打分：没想起 / 想一下 / 秒想'))
    out.push(krow('Z', '撤销上次自评'))
    out.push(krow('Esc', '结束本轮 / 收起'))
    out.push('</div></section>')

    out.push('<section class="fv-card"><div class="fv-card-h"><b>怎么用最有效</b><em>方法论</em></div>')
    out.push('<div class="fv-quiet">① <b>先回忆后揭示</b>：点开答案前必须在脑子里（或草稿上）复现一次，否则只是抄写；'
      + '② <b>三档要诚实</b>：磕绊就选想一下，自评注水只会让排期失效；'
      + '③ <b>每天 3 条胜过周末 30 条</b>：间隔效应比集中轰炸强得多；'
      + '④ <b>弹药箱优先</b>：老漏的那几条，隔天就再拖出来一遍。</div>')
    out.push('</section>')

    out.push('<section class="fv-card fv-about"><div class="fv-card-h"><b>关于</b><em>v' + VERSION + '</em></div>')
    out.push('<p><b>它解决什么</b>：看懂 ≠ 记得住。公式要在考场上条件反射式地调出来，唯一办法是「先回忆、后对照」的间隔自测。</p>')
    out.push('<p><b>为什么不自己写渲染</b>：站内 tex.js 已处理 AI 输出的各种破损 LaTeX，公式库直接走它，花括号/转义/管道符全都对。</p>')
    out.push('<p><b>排期</b>：复测间隔用站内 SRS 的间隔盒（1/2/4/7/15/30 天），自评三档映射到站点质量分，与背单词同一套遗忘曲线。</p>')
    out.push('</section>')
    return out.join('')
  }

  function krow(key, desc) {
    return '<div class="fv-krow"><kbd>' + esc(key) + '</kbd><span>' + esc(desc) + '</span></div>'
  }
  function cfgRow(label, val, note) {
    return '<div class="fv-cfgrow"><b>' + esc(label) + '</b><em>' + esc(String(val)) + '</em><span>' + esc(note) + '</span></div>'
  }

  /* ══════════════ 8. 表现层辅助 ══════════════ */
  function masteryColor(m) {
    m = Number(m) || 0
    if (m >= 80) return '#0f766e'
    if (m >= 60) return '#2f4bd8'
    if (m >= 40) return '#b45309'
    if (m > 0) return '#b91c1c'
    return 'var(--fv-faint)'
  }
  /** 五格掌握度刻度（只有真正测过才点亮，未测全灰） */
  function masteryStars(m) {
    let n = m >= 80 ? 5 : (m >= 60 ? 4 : (m >= 40 ? 3 : (m > 0 ? 2 : (m === 0 ? 0 : 0))))
    if (m > 0 && m < 40) n = 1
    let out = []
    for (let i = 0; i < 5; i++) out.push('<i' + (i < n ? ' class="on"' : '') + '></i>')
    return out.join('')
  }
  /** 三档的线性图标（不用 ✓/~/✗ 字符：字形随系统字体，Windows 上可能变豆腐块） */
  function gradeGlyph(k) {
    let p = k === 'fast' ? 'M3 12l5 5L21 6' : (k === 'slow' ? 'M4 12c2-3 4 3 6 0s4 3 6 0 4 3 4 0' : 'M5 5l14 14M19 5L5 19')
    return '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + p + '"/></svg>'
  }
  function overdue(today, nextAt) {
    return !!(nextAt && nextAt < today)
  }
  function fmtDur(ms) {
    let s = Math.max(0, Math.floor((ms || 0) / 1000))
    let m = Math.floor(s / 60)
    let h = Math.floor(m / 60)
    if (h) return h + ':' + String(m % 60).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0')
    return m + ':' + String(s % 60).padStart(2, '0')
  }
  /** 取近 N 天（含今天）的某指标，返回 [{label,value}] */
  function lastNDays(ctx, n, pick) {
    let out = []
    let d = new Date()
    d.setDate(d.getDate() - (n - 1))
    for (let i = 0; i < n; i++) {
      out.push({ label: (d.getMonth() + 1) + '/' + d.getDate(), value: pick(todayKey(d)) || 0 })
      d.setDate(d.getDate() + 1)
    }
    return out
  }
  /** 14 天柱状 SVG：每天一条淡轨道 + 数值柱（空白日也要看得见是第几天） */
  function barsSvg(rows) {
    let n = rows.length
    let w = 560, h = 92
    let max = Math.max.apply(null, rows.map(function (r) { return r.value }).concat([1]))
    let step = w / n
    let gap = Math.max(3, step * 0.34)
    let bw = Math.max(2, step - gap)
    let out = ['<svg class="fv-bars" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none">']
    out.push('<line x1="0" y1="' + (h - 1) + '" x2="' + w + '" y2="' + (h - 1) + '" stroke="var(--fv-line2)" stroke-width="1"/>')
    for (let i = 0; i < n; i++) {
      let v = rows[i].value
      let x = (i * step + gap / 2).toFixed(1)
      out.push('<rect class="fv-bar-tr" x="' + x + '" y="0" width="' + bw.toFixed(1) + '" height="' + (h - 1) + '" fill="var(--fv-soft)"><title>' + esc(rows[i].label) + '：' + v + ' 条</title></rect>')
      if (v) {
        let bh = Math.max(3, (h - 4) * (v / max))
        out.push('<rect class="fv-bar-v" x="' + x + '" y="' + (h - bh).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + bh.toFixed(1) + '" rx="' + Math.min(3, bw / 2).toFixed(1) + '" fill="var(--fv-acc)"><title>' + esc(rows[i].label) + '：' + v + ' 条</title></rect>')
      }
    }
    out.push('</svg>')
    return out.join('')
  }
  /** 图标：宿主 U.icon 语义键优先；缺失就用内联兜底（绝不显示空白） */
  function U_icon(k) {
    try {
      if (window.U && typeof window.U.icon === 'function') {
        let s = window.U.icon(k)
        if (s) return s
      }
    } catch (e) { /* 忽略 */ }
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/></svg>'
  }
  function dockIcon(k) {
    let p = {
      vault: 'M4 6h16M4 12h16M4 18h10',
      drill: 'M12 3v6l4 2M12 21a9 9 0 100-18 9 9 0 000 18z',
      ammo: 'M5 8h14l-1 12H6L5 8zM9 8V5h6v3',
      stats: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
      setup: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a7.6 7.6 0 000-6l2-1-2-3.4-2 1a7.6 7.6 0 00-5.4-2L11 0H9l-.6 2.6a7.6 7.6 0 00-5.4 2l-2-1L-1 7l2 1a7.6 7.6 0 000 6l-2 1 2 3.4 2-1a7.6 7.6 0 005.4 2L9 22h2l.6-2.6a7.6 7.6 0 005.4-2l2 1 2-3.4-2-1z'
    }[k] || 'M4 12h16'
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="' + p + '"/></svg>'
  }
  /** KPI：今日完成/目标、到期、公式数、连击 */
  function kpiOf(S, ctx) {
    let today = S.today
    let doneToday = 0
    for (let i = 0; i < S.logs.length; i++) if (dkey(S.logs[i].at) === today) doneToday++
    let due = dueList(S.recs, today).length
    let goal = clamp(ctx && ctx.config ? ctx.config('dailyGoal') : 3, 1, 20)
    return {
      today: doneToday,
      goal: goal,
      goalMet: doneToday >= goal,
      due: due,
      nodes: S.all.length,
      streak: streakOf(S.logs, goal)
    }
  }

  /* ══════════════ 9. 站点侧回写 ══════════════ */
  /** 一次自评 → 写站内掌握度（topicId = 公式 id），返回是否写入成功 */
  function siteMastery(ctx, f, score) {
    try {
      if (!ctx.Mastery || typeof ctx.Mastery.recordAnswer !== 'function') return false
      /* 字段照 RecordAnswerInput：topicId + score 必填，topicName 用于站内正确率历史与
       * 错题描述（早期写成 topic → 站内这条记录没名字）。verdict/source 便于追溯来源。 */
      ctx.Mastery.recordAnswer({
        topicId: f.id,
        topicName: f.n,
        subject: f.s,
        score: score,
        verdict: score >= 80 ? 'pass' : 'weak',
        source: TOOL_ID
      })
      return true
    } catch (e) { return false }
  }
  /** 排下次：优先站内 Spaced，退化用本地间隔盒 */
  function scheduleNext(ctx, rec, grade) {
    let box = rec.box
    try {
      /* ⚠ Spaced.grade(card, **known: 布尔**, opts?) —— 第二参不是质量分。
       * 早期版本传了 4/3/1 的数字：三个值都 truthy → 全被当"记住"，
       * 自评"没想起"也升盒，间隔算法等于废掉（真机核对宿主签名才发现）。
       * 站点只有升/降两态，所以：秒想升一盒、没想起回 1 盒、想一下原地按当前盒排期。 */
      if (ctx.Spaced && typeof ctx.Spaced.grade === 'function') {
        if (grade >= 3) {
          let g = ctx.Spaced.grade({ box: box }, true)
          if (g && g.box != null) return { box: clamp(g.box, 1, 6), nextAt: String(g.due || '') }
        } else {
          let g = ctx.Spaced.grade({ box: box }, false)
          if (g && g.box != null) return { box: clamp(g.box, 1, 6), nextAt: String(g.due || '') }
        }
      }
    } catch (e) { /* 宿主字段变了走本地 */ }
    /* 本地兜底：miss 回第 1 盒，slow 停在原盒，fast 进一盒 */
    if (grade === 1) box = 1
    else if (grade === 4) box = Math.min(6, box + 1)
    let days = [0, 1, 2, 4, 7, 15, 30][clamp(box, 1, 6)] || 1
    let d = new Date()
    d.setDate(d.getDate() + days)
    return { box: box, nextAt: todayKey(d) }
  }

  /* ══════════════ 10. 挂载壳 ══════════════
   * 契约（与另两个插件一致，宿主强制）：
   *   · mount(el, ctx) 的 el 是 #view > .plugin-tool-body，宿主没有 overflow
   *     → 本页 sticky 可用，但 z-index 要 > 站内状态栏的 20
   *   · destroy 必须移除：window 监听 ×3、rAF、计时器、注入的 <style>、root 节点
   *   · 切视图只改 class + moveInd，**不重建 dock DOM**（重建 = 指示器瞬移）
   *   · 所有"写完数据"的路径都走 reload（读回真值）而不是 paint，
   *     否则 S 里的旧副本会把新数据盖掉
   * ══════════════════════════════════════════════════════════ */
  function mountShell(el, ctx) {
    let S = {
      view: 'vault',
      q: '',
      subj: 'all',
      openChap: {},
      selId: '',
      all: allFormulas(ctx),
      recs: loadRecs(ctx),
      logs: loadLogs(ctx),
      today: todayKey(),
      run: null,
      undo: null,
      aiNote: null,
      aiNoteBatch: null,
      aiBusy: false,
      customCount: loadCustom(ctx).length,
      tick: 0
    }
    /* 恢复上次视图 */
    try {
      let v = String(ctx.data('view') || '')
      for (let i = 0; i < VIEWS.length; i++) if (VIEWS[i].k === v) S.view = v
    } catch (e) { /* 忽略 */ }

    let root = document.createElement('div')
    root.className = 'fv-root'
    root.innerHTML =
      '<div class="fv-aura" aria-hidden="true"><i></i><i></i></div>'
      + '<header class="fv-top" data-fv="top">'
      + '<div class="fv-brand">'
      + '<span class="fv-mark" aria-hidden="true">' + U_icon('bookOpen') + '</span>'
      + '<div class="fv-brandtx"><span class="fv-kicker">KAOYAN · FORMULA VAULT</span>'
      + '<b>公式军火库<em>v' + VERSION + '</em></b></div>'
      + '</div>'
      + '<div class="fv-kpis" data-fv="kpis"></div>'
      + '<div class="fv-topacts">'
      + '<button class="fv-btn" data-act="drill-quick" title="直接开一轮（快捷键 D）">开练</button>'
      + '</div>'
      + '</header>'
      + '<main class="fv-stage" data-fv="stage"></main>'
      + '<div class="fv-dockwrap" data-fv="dockwrap"></div>'
    el.appendChild(root)

    /* 页面专属样式：注入一次，切页即回收 */
    let styleEl = document.createElement('style')
    styleEl.id = 'fv-extra-style'
    styleEl.textContent = CSS_EXTRA
    document.head.appendChild(styleEl)

    let topEl = root.querySelector('[data-fv="top"]')
    let kpisEl = root.querySelector('[data-fv="kpis"]')
    let stage = root.querySelector('[data-fv="stage"]')
    let dockWrap = root.querySelector('[data-fv="dockwrap"]')

    /* ---- dock：就地生成（视觉对齐站内 isleDock：玻璃胶囊 + 滑动指示器） ---- */
    let dockInd = null
    function buildDock() {
      dockWrap.innerHTML =
        '<nav class="fv-dock" data-fv="dock" aria-label="插件导航">'
        + '<span class="fv-dock-ind" data-fv="ind"></span>'
        + VIEWS.map(function (v) {
          return '<button class="fv-dock-item" data-view="' + v.k + '" title="' + v.n + '">'
            + dockIcon(v.icon) + '<em>' + v.n + '</em>'
            + (v.k === 'drill' ? '<span class="fv-dot" data-fv="dot"></span>' : '')
            + '</button>'
        }).join('')
        + '</nav>'
      dockInd = dockWrap.querySelector('[data-fv="ind"]')
      moveInd()
    }
    function moveInd() {
      if (!dockInd) return
      let on = dockWrap.querySelector('.fv-dock-item.on')
      if (!on) { dockInd.style.opacity = '0'; return }
      dockInd.style.opacity = '1'
      dockInd.style.left = on.offsetLeft + 'px'
      dockInd.style.width = on.offsetWidth + 'px'
    }
    function setView(v) {
      if (S.view === v) return
      S.view = v
      try { ctx.data('view', v) } catch (e) { /* 忽略 */ }
      let items = dockWrap.querySelectorAll('.fv-dock-item')
      for (let i = 0; i < items.length; i++) items[i].classList.toggle('on', items[i].getAttribute('data-view') === v)
      moveInd()
      paint()
    }

    /* ---- 吸顶两态：判据统一 getBoundingClientRect().top <= 1 ---- */
    let raf = 0
    function onScroll() {
      if (raf) return
      raf = requestAnimationFrame(function () {
        raf = 0
        topEl.classList.toggle('is-stuck', topEl.getBoundingClientRect().top <= 1)
      })
    }

    /* ---- 计时器（自测中） ---- */
    let timer = 0
    function startTick() {
      stopTick()
      timer = setInterval(function () {
        if (!S.run) { stopTick(); return }
        S.run.ms = Date.now() - S.run.t0
        let c = stage.querySelector('.fv-clock')
        if (c) c.textContent = fmtDur(S.run.ms)
      }, 1000)
    }
    function stopTick() { if (timer) { clearInterval(timer); timer = 0 } }

    /* ---- KPI ---- */
    function paintKpis() {
      let k = kpiOf(S, ctx)
      kpisEl.innerHTML =
        '<span class="fv-kpi' + (k.goalMet ? ' ok' : '') + '" title="今日完成 / 目标"><b>' + k.today + '<em>/' + k.goal + '</em></b><i>今日</i></span>'
        + '<span class="fv-kpi' + (k.due ? ' warn' : '') + '" title="今日到期的复测"><b>' + k.due + '</b><i>到期</i></span>'
        + '<span class="fv-kpi" title="公式库总量"><b>' + k.nodes + '</b><i>公式</i></span>'
        + '<span class="fv-kpi" title="连续达标天数"><b>' + k.streak + '</b><i>连击</i></span>'
      let dot = dockWrap.querySelector('[data-fv="dot"]')
      if (dot) dot.classList.toggle('show', k.due > 0)
    }

    /* ---- 主渲染 ---- */
    function paint() {
      S.all = allFormulas(ctx)
      S.customCount = loadCustom(ctx).length
      let html = ''
      if (S.view === 'vault') html = viewVault(ctx, S, S.all)
      else if (S.view === 'drill') html = viewDrill(ctx, S)
      else if (S.view === 'ammo') html = viewAmmo(ctx, S)
      else if (S.view === 'stats') html = viewStats(ctx, S)
      else html = viewSetup(ctx, S)
      stage.innerHTML = html
      paintKpis()
      bindSearch()
    }
    function reload() { S.recs = loadRecs(ctx); S.logs = loadLogs(ctx); paint() }

    /** 焦点感知重绘：记录当前聚焦的 data-fv 输入框与光标，重绘后还原。
     *  为什么需要：katex 是**异步**就绪的（网络 IO），就绪那一刻用户可能正在
     *  搜索框里打字 —— 直接 paint 会重建 DOM、丢焦点，打一个字跳一次光标。
     *  搜索框自己的 input 处理器也做同样的事，这里统一收口。 */
    function paintKeepFocus() {
      let ae = document.activeElement
      let key = ae && ae.getAttribute ? ae.getAttribute('data-fv') : ''
      let pos = 0
      if (key) { try { pos = ae.selectionStart || 0 } catch (e) { /* 忽略 */ } }
      paint()
      if (key) {
        let again = stage.querySelector('[data-fv="' + key + '"]')
        if (again) {
          again.focus()
          try { again.setSelectionRange(pos, pos) } catch (e) { /* 忽略 */ }
        }
      }
    }

    /* 搜索框：重绘后还原焦点与光标（否则打一个字就丢焦点） */
    function bindSearch() {
      let dr = stage.querySelector('[data-fv="draft"]')
      if (dr) {
        dr.addEventListener('input', function () { if (S.run) S.run.draft = String(dr.value || '') })
      }
      let sq = stage.querySelector('[data-fv="q"]')
      if (!sq) return
      sq.addEventListener('input', function () {
        let v = sq.value
        let pos = sq.selectionStart
        S.q = v
        paint()
        let again = stage.querySelector('[data-fv="q"]')
        if (again) {
          again.focus()
          try { again.setSelectionRange(pos, pos) } catch (e) { /* 忽略 */ }
        }
      })
    }

    /* ══════════════ 11. 交互 ══════════════ */
    function toast(msg, kind) {
      try {
        if (ctx.Toast && typeof ctx.Toast.show === 'function') ctx.Toast.show(msg, kind || 'info')
      } catch (e) { /* 忽略 */ }
    }

    /** 组一轮题 */
    function buildQueue(mode) {
      let size = clamp(ctx.config('roundSize'), 1, 30)
      let due = dueList(S.recs, S.today).map(function (x) { return findF(S.all, x.id) }).filter(Boolean)
      let pool = []
      if (mode === 'due') pool = due
      else if (mode === 'weak') {
        pool = S.all.filter(function (f) { return isWeak(S.recs[f.id]) })
        pool.sort(function (a, b) {
          let ra = S.recs[a.id], rb = S.recs[b.id]
          return (rb.miss + rb.slow) - (ra.miss + ra.slow)
        })
      } else {
        /* mixed：到期优先，再用未测补齐，最后随机抽熟练度低的 */
        let rest = S.all.filter(function (f) { return due.indexOf(f) < 0 })
        let untested = rest.filter(function (f) { return !S.recs[f.id] })
        let weak = rest.filter(function (f) { return isWeak(S.recs[f.id]) })
        let other = rest.filter(function (f) { return !S.recs[f.id] && weak.indexOf(f) < 0 })
        pool = due.concat(untested).concat(weak).concat(shuffle(other))
      }
      pool = pool.filter(Boolean).slice(0, size)
      /* 洗一下（due 模式保留紧急度排序） */
      if (mode !== 'due' && mode !== 'weak') pool = shuffle(pool)
      return pool
    }
    function shuffle(a) {
      a = a.slice()
      for (let i = a.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let t = a[i]; a[i] = a[j]; a[j] = t
      }
      return a
    }

    function startDrill(mode, onlyId) {
      let queue = onlyId ? [findF(S.all, onlyId)] : buildQueue(mode)
      queue = queue.filter(Boolean)
      if (!queue.length) { toast(mode === 'weak' ? '弹药箱是空的' : '没有可练的公式', 'info'); return }
      S.run = { queue: queue, idx: 0, t0: Date.now(), ms: 0, revealed: false, draft: '', draftOpen: false, mode: onlyId ? 'one' : mode }
      S.view = 'drill'
      syncDock()
      paint()
      startTick()
    }

    function syncDock() {
      let items = dockWrap.querySelectorAll('.fv-dock-item')
      for (let i = 0; i < items.length; i++) items[i].classList.toggle('on', items[i].getAttribute('data-view') === S.view)
      moveInd()
    }

    function reveal() {
      if (!S.run || S.run.revealed) return
      /* 收一下草稿文本（input 事件是实时的，这里兜底防时序漏更） */
      let d = stage.querySelector('[data-fv="draft"]')
      if (d && S.run) S.run.draft = String(d.value || '')
      S.run.revealed = true
      paint()
    }

    /** 打分：落库 + 站点回写 + 排下次 */
    function grade(k) {
      let run = S.run
      if (!run || !run.revealed) return
      let f = run.queue[run.idx]
      let before = Object.assign({}, S.recs[f.id] || normRec(null), { history: ((S.recs[f.id] || normRec(null)).history || []).slice() })
      let rec = normRec(S.recs[f.id] || null)
      let g = gradeOf(k)
      let sc = scoreOf(k)
      rec.mastery = fuseMastery(rec.mastery, sc)
      if (k === 'fast') rec.fast++
      else if (k === 'slow') rec.slow++
      else rec.miss++
      let nx = scheduleNext(ctx, rec, g)
      rec.box = nx.box
      rec.nextAt = nx.nextAt
      rec.lastAt = new Date().toISOString()
      rec.history = rec.history.concat([{ k: k, at: rec.lastAt }]).slice(-20)
      S.recs[f.id] = rec
      S.recs = saveRecs(ctx, S.recs)
      let log = { id: uid(), fid: f.id, at: rec.lastAt, k: k, score: sc, ms: run.ms }
      S.logs = saveLogs(ctx, S.logs.concat([log]))
      let wrote = siteMastery(ctx, f, sc)
      /* 撤销快照：只留最近一次 */
      S.undo = { rec: before, logId: log.id, fid: f.id, wrote: wrote }
      toast(wrote ? '已记录：' + kLabel(k) + '（站内掌握度已更新）' : '已记录：' + kLabel(k), 'info', 1800)
      /* 下一题或收尾 */
      if (run.idx < run.queue.length - 1) {
        run.idx++
        run.revealed = false
        paint()
      } else {
        finishDrill()
      }
    }
    function kLabel(k) { return k === 'fast' ? '秒想' : (k === 'slow' ? '想一下' : '没想起') }

    function finishDrill() {
      let run = S.run
      S.run = null
      stopTick()
      S.view = 'stats'
      syncDock()
      paint()
      let n = run ? run.queue.length : 0
      toast('本轮完成 ' + n + ' 条 —— 统计已更新', 'ok', 2200)
    }

    function undoLast() {
      let u = S.undo
      if (!u) return
      let rec = normRec(u.rec)
      S.recs[u.fid] = rec
      S.recs = saveRecs(ctx, S.recs)
      S.logs = saveLogs(ctx, S.logs.filter(function (l) { return l.id !== u.logId }))
      S.undo = null
      paint()
      toast('已撤销上次自评（站内热力图不同步回滚，以最新记录为准）', 'info', 2400)
    }

    /* ---- 点击分发 ---- */
    function onClick(e) {
      let t = e.target
      let actEl = t.closest ? t.closest('[data-act]') : null
      let viewEl = t.closest ? t.closest('[data-view]') : null
      if (viewEl) { setView(viewEl.getAttribute('data-view')); return }
      if (!actEl) return
      let act = actEl.getAttribute('data-act')
      let id = actEl.getAttribute('data-id') || ''
      let k = actEl.getAttribute('data-k') || ''
      if (act === 'subj') { S.subj = k; paint(); return }
      if (act === 'chap') {
        let c = actEl.getAttribute('data-k')
        S.openChap[c] = S.openChap[c] === false
        paint(); return
      }
      if (act === 'pick') { S.selId = (S.selId === id ? '' : id); paint(); return }
      if (act === 'drill-one') { startDrill(null, id); return }
      if (act === 'drill-start') { startDrill(k || 'mixed'); return }
      if (act === 'drill-ammo') { startDrill('weak'); return }
      if (act === 'ai-batch') {
        let items = S.all.filter(function (f) { return isWeak(S.recs[f.id]) })
        aiMnemonicBatch(ctx, items.slice(0, 12))
        return
      }
      if (act === 'newf') { openNewFormula(ctx, reload); return }
      if (act === 'drill-quick') {
        let due = dueList(S.recs, S.today)
        startDrill(due.length ? 'due' : 'mixed')
        return
      }
      if (act === 'reveal') { reveal(); return }
      if (act === 'draft') {
        if (S.run) S.run.draftOpen = !S.run.draftOpen
        paint()
        let d = stage.querySelector('[data-fv="draft"]')
        if (d) d.focus()
        return
      }
      if (act === 'grade') { grade(k); return }
      if (act === 'drill-abort') { S.run = null; stopTick(); paint(); return }
      if (act === 'fav') {
        let r = normRec(S.recs[id] || null)
        r.fav = !r.fav
        S.recs[id] = r
        S.recs = saveRecs(ctx, S.recs)
        paint(); return
      }
      if (act === 'ai-mnem') {
        if (S.aiBusy) { toast('AI 正在想上一条', 'info'); return }
        let f = findF(S.all, id)
        if (!f) return
        if (!aiOk(ctx)) { toast('AI 未配置，用记忆要点也一样', 'info'); return }
        S.aiBusy = true
        S.aiNote = { id: id, mnemonic: '', derivation: '' }
        paint()
        aiMnemonic(ctx, f).then(function (o) {
          S.aiBusy = false
          if (!o) { S.aiNote = null; paint(); toast('AI 没给出可用内容，先看内置记忆要点', 'info'); return }
          S.aiNote = { id: id, mnemonic: o.mnemonic, derivation: o.derivation }
          paint()
        })
        return
      }
      if (act === 'export') { doExport(ctx); return }
      if (act === 'export-md') { exportMarkdown(ctx); return }
      if (act === 'import') { doImport(ctx); return }
      if (act === 'reset') { doReset(ctx); return }
    }

    /* ---- 导出 Markdown：可打印、可喂 Anki ----
     * 为什么不是只给 JSON：JSON 是机器备份用的，Markdown 才是"贴进笔记软件/打印"用的。 */
    function exportMarkdown(ctx) {
      try {
        let groups = chaptersOf(S.all, S.subj)
        let lines = ['# 公式军火库导出（' + todayKey() + '）', '']
        let total = 0
        for (let i = 0; i < groups.length; i++) {
          lines.push('## ' + groups[i].chap)
          lines.push('')
          for (let j = 0; j < groups[i].items.length; j++) {
            let f = groups[i].items[j]
            let r = S.recs[f.id]
            total++
            lines.push('### ' + f.n + '　*(' + subjectLabel(f.s) + ')*')
            lines.push('')
            lines.push('```latex')
            lines.push(String(f.t || '').replace(/^\$+|\$+$/g, '').trim())
            lines.push('```')
            lines.push('')
            if (f.p) lines.push('- 记忆：' + f.p)
            if (f.w) lines.push('- 易错：' + f.w)
            if (r && r.nextAt) lines.push('- 掌握度：' + r.mastery + '（下次复测 ' + fmtDate(r.nextAt) + '）')
            lines.push('')
          }
        }
        lines.push('---')
        lines.push('共 ' + total + ' 条。由「公式军火库 v' + VERSION + '」导出。')
        let blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' })
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = 'formula-vault-' + todayKey() + '.md'
        a.click()
        setTimeout(function () { URL.revokeObjectURL(a.href) }, 4000)
        toast('已导出 ' + total + ' 条为 Markdown', 'ok')
      } catch (e) { toast('导出失败：' + (e && e.message), 'error') }
    }

    /* ---- 批量 AI 助记：弹药箱里老漏的公式，一键全问 ----
     * 进度实时 toast（等待要有可见进度，不能干转）；
     * 单个失败不影响整体（跳过继续），结果逐条落到公式卡上。 */
    function aiMnemonicBatch(ctx, items) {
      if (!items.length) { toast('弹药箱是空的', 'info'); return }
      if (!aiOk(ctx)) { toast('AI 未配置', 'info'); return }
      if (S.aiBusy) { toast('正在跑上一批', 'info'); return }
      S.aiBusy = true
      let idx = 0
      let ok = 0
      let notes = {}
      function step() {
        if (idx >= items.length) {
          S.aiBusy = false
          S.aiNoteBatch = notes
          paint()
          toast('批量助记完成：' + ok + ' / ' + items.length + ' 条拿到内容', ok ? 'ok' : 'info', 2600)
          return
        }
        let f = items[idx]
        toast('正在想第 ' + (idx + 1) + ' / ' + items.length + ' 条：' + shortTitle(f.n, 10) + '…', 'info', 0)
        aiMnemonic(ctx, f).then(function (o) {
          if (o) { notes[f.id] = o; ok++ }
          idx++
          step()
        }).catch(function () { idx++; step() })
      }
      step()
    }

    /* ---- 自建公式 ---- */
    /** 读弹窗里的值（宿主渲染 DOM，可能缺字段/被改 — 一律容错，别假设元素一定在） */
    function modalVal(id) {
      let el = document.getElementById(id)
      return String((el && el.value != null ? el.value : '') || '').trim()
    }
    function openNewFormula(ctx, done) {
      let draft = { s: S.subj === 'all' ? 'calc' : S.subj, c: '', n: '', t: '', p: '', w: '' }
      try {
        if (ctx.Modal && typeof ctx.Modal.open === 'function') {
          ctx.Modal.open({
            title: '自建公式',
            html: '<div class="fv-form">'
              + '<label>名称<b>*</b><input class="fv-input" id="fv-nf-n" maxlength="40" placeholder="如：柯西积分公式"></label>'
              + '<label>科目<select class="fv-input" id="fv-nf-s">'
              + SUBJ_ORDER.map(function (k) { return '<option value="' + k + '"' + (k === draft.s ? ' selected' : '') + '>' + subjectLabel(k) + '</option>' }).join('')
              + '</select></label>'
              + '<label>章节<input class="fv-input" id="fv-nf-c" maxlength="24" placeholder="如：复变函数（自建章节名）"></label>'
              + '<label>公式（LaTeX）<b>*</b><textarea class="fv-input" id="fv-nf-t" rows="3" placeholder="$\\int_{-\\infty}^{\\infty} f$"></textarea></label>'
              + '<label>记忆要点<input class="fv-input" id="fv-nf-p" maxlength="80"></label>'
              + '<label>易错点<input class="fv-input" id="fv-nf-w" maxlength="80"></label>'
              + '<div class="fv-quiet">LaTeX 用 $...$ 包起来；不会写就填纯文本，也能存能看（渲染会退化成等宽文本）。</div>'
              + '</div>',
            actions: [
              { label: '取消' },
              {
                label: '保存', kind: 'btn-primary', onClick: function (close) {
                  let n = modalVal('fv-nf-n')
                  let t = modalVal('fv-nf-t')
                  if (!n || !t) { toast('名称和公式不能空', 'error'); return }
                  let arr = loadCustom(ctx)
                  arr.push({
                    id: uid(), s: modalVal('fv-nf-s') || 'calc',
                    c: modalVal('fv-nf-c') || '自建',
                    n: n.slice(0, 60), t: t.slice(0, 500),
                    p: modalVal('fv-nf-p').slice(0, 120),
                    w: modalVal('fv-nf-w').slice(0, 120)
                  })
                  saveCustom(ctx, arr)
                  S.customCount = arr.length
                  done()
                  toast('已加入公式库（可立即自测）', 'ok')
                  close()
                }
              }
            ]
          })
        }
      } catch (e) { toast('弹窗打开失败', 'error') }
    }

    /* ---- 数据进出 ---- */
    function doExport(ctx) {
      try {
        let payload = { app: TOOL_ID, v: 1, recs: S.recs, logs: S.logs, custom: loadCustom(ctx) }
        let blob = new Blob([JSON.stringify(payload, null, 1)], { type: 'application/json' })
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = 'formula-vault-' + todayKey() + '.json'
        a.click()
        setTimeout(function () { URL.revokeObjectURL(a.href) }, 4000)
        toast('已导出（含自测记录与自建公式）', 'ok')
      } catch (e) { toast('导出失败：' + (e && e.message), 'error') }
    }
    function doImport(ctx) {
      try {
        let inp = document.createElement('input')
        inp.type = 'file'
        inp.accept = '.json,application/json'
        inp.onchange = function () {
          let f = inp.files && inp.files[0]
          if (!f) return
          let rd = new FileReader()
          rd.onload = function () {
            try {
              let o = JSON.parse(String(rd.result))
              let nRec = 0, nLog = 0, nCus = 0
              if (o && o.recs && typeof o.recs === 'object') {
                for (let k in o.recs) {
                  if (!S.recs[k]) { S.recs[k] = normRec(o.recs[k]); nRec++ }
                  else {
                    /* 合并：取更熟练的一方（导入不该让掌握度倒退） */
                    let a = S.recs[k], b = normRec(o.recs[k])
                    if (b.mastery > a.mastery || !a.nextAt) S.recs[k] = b
                    nRec++
                  }
                }
                S.recs = saveRecs(ctx, S.recs)
              }
              if (Array.isArray(o.logs)) {
                let have = {}
                for (let i = 0; i < S.logs.length; i++) have[S.logs[i].id] = 1
                let add = o.logs.filter(function (l) { return l && !have[l.id] })
                if (add.length) { S.logs = saveLogs(ctx, S.logs.concat(add)); nLog = add.length }
              }
              if (Array.isArray(o.custom)) {
                let have = {}
                let cur = loadCustom(ctx)
                for (let i = 0; i < cur.length; i++) have[cur[i].id] = 1
                let add = o.custom.filter(function (c) { return c && c.id && !have[c.id] })
                if (add.length) { saveCustom(ctx, cur.concat(add)); nCus = add.length }
              }
              reload()
              toast('导入完成：记录 ' + nRec + '、历史 ' + nLog + '、自建公式 ' + nCus, 'ok', 2600)
            } catch (err) { toast('导入失败：JSON 解析不了', 'error') }
          }
          rd.readAsText(f, 'utf-8')
        }
        inp.click()
      } catch (e) { toast('导入失败：' + (e && e.message), 'error') }
    }
    function doReset(ctx) {
      try {
        if (ctx.api && typeof ctx.api.confirm === 'function') {
          ctx.api.confirm('清空自测记录？', '公式库不受影响；自测历史、掌握度、弹药箱收藏都会清掉，且不可恢复。', function (ok) {
            if (!ok) return
            S.recs = saveRecs(ctx, {})
            S.logs = saveLogs(ctx, [])
            S.undo = null
            S.run = null
            reload()
            toast('已清空自测记录', 'ok')
          })
          return
        }
      } catch (e) { /* 宿主没有 confirm：直接走兜底 */ }
      S.recs = saveRecs(ctx, {})
      S.logs = saveLogs(ctx, [])
      S.undo = null
      reload()
      toast('已清空自测记录', 'ok')
    }

    /* ---- 键盘 ---- */
    function onKey(e) {
      let tag = (e.target && e.target.tagName) || ''
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'Escape') {
        if (S.run) { S.run = null; stopTick(); paint() }
        return
      }
      /* 自测中且已揭示：1/2/3 = 打分（**优先于视图切换**）。
       * 否则揭示后按 1 会跳去军火库，手在键盘上时最顺的路径反而不通。 */
      if (S.run && S.run.revealed && (e.key === '1' || e.key === '2' || e.key === '3')) {
        grade(e.key === '1' ? 'miss' : (e.key === '2' ? 'slow' : 'fast'))
        return
      }
      if (e.key === '1') { setView('vault'); return }
      if (e.key === '2') { setView('drill'); return }
      if (e.key === '3') { setView('ammo'); return }
      if (e.key === '4') { setView('stats'); return }
      if (e.key === '5') { setView('setup'); return }
      if (e.key === 'd' || e.key === 'D') {
        let due = dueList(S.recs, S.today)
        startDrill(due.length ? 'due' : 'mixed')
        return
      }
      if (e.key === 'r' || e.key === 'R') { reveal(); return }
      if (e.key === 'z' || e.key === 'Z') { undoLast(); return }
    }

    /* ---- 生命周期 ---- */
    buildDock()
    paint()
    /* 首绘先给纯文本兜底；katex 就绪后重绘一次 → 首屏尽量是渲染后的公式。
     * 用 paintKeepFocus：就绪那一刻用户可能正在搜索框打字，不能丢焦点。 */
    katexRepaintHooks.push(paintKeepFocus)
    loadKatex().then(function () { paintKeepFocus() }).catch(function () { /* 保持兜底 */ })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', moveInd)
    window.addEventListener('keydown', onKey)
    root.addEventListener('click', onClick)
    onScroll()

    return function destroy() {
      stopTick()
      katexRepaintHooks = katexRepaintHooks.filter(function (h) { return h !== paintKeepFocus })
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', moveInd)
      window.removeEventListener('keydown', onKey)
      root.removeEventListener('click', onClick)
      if (raf) cancelAnimationFrame(raf)
      if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl)
      root.remove()
    }
  }

  /* ══════════════ 12. 注册 ══════════════ */
  let api = {
    id: TOOL_ID,
    name: '公式军火库',
    version: VERSION,
    author: 'kaoyan-v2',
    desc: '考研数学公式速查 + 遮罩自测：119 条核心公式（LaTeX 走站内渲染）→ 先回忆后揭示 → 三档自评 → 站内 SRS 排复测，掌握度写回热力图，教练可查「哪些公式总想不起来」。',
    tools: [{ id: TOOL_ID, title: '公式军火库', icon: 'bookOpen', mount: mountShell }],
    panels: [
      {
        id: 'fv-today', title: '公式军火库 · 今日', icon: 'bookOpen', width: 300, height: 250,
        render: function (ctx) {
          let recs = loadRecs(ctx)
          let due = dueList(recs, todayKey())
          let logs = loadLogs(ctx)
          let today = todayKey()
          let done = logs.filter(function (l) { return dkey(l.at) === today }).length
          let goal = clamp(ctx.config('dailyGoal'), 1, 20)
          let all = SEED_CALC.concat(SEED_LINALG).concat(SEED_PROB).concat(loadCustom(ctx))
          let out = ['<div class="fv-panel">']
          out.push('<div class="fv-panel-kpis">'
            + '<div><b>' + due.length + '</b><span>待复测</span></div>'
            + '<div><b>' + done + '/' + goal + '</b><span>今日</span></div>'
            + '<div><b>' + all.length + '</b><span>公式</span></div>'
            + '</div>')
          if (!due.length) out.push('<div class="fv-panel-empty ok">今天没有到期的复测。</div>')
          else {
            out.push('<div class="fv-panel-list">')
            for (let i = 0; i < Math.min(4, due.length); i++) {
              let f = findF(all, due[i].id)
              if (!f) continue
              out.push('<div class="fv-panel-row"><i style="background:' + subjectColor(f.s) + '"></i>'
                + '<span>' + esc(shortTitle(f.n, 16)) + '</span>'
                + '<em>第 ' + due[i].rec.box + ' 盒</em></div>')
            }
            out.push('</div>')
          }
          out.push('<div class="fv-panel-foot">打开工具页「公式军火库」开练</div></div>')
          return out.join('')
        }
      }
    ],
    config: [
      { key: 'dailyGoal', label: '每日自测目标（条）', type: 'number', default: 3 },
      { key: 'roundSize', label: '每轮题量（条）', type: 'number', default: 10 },
      { key: 'notify', label: '打开时提示到期', type: 'bool', default: true }
    ],
    queries: [
      {
        key: 'weak', label: '总想不起来的公式',
        run: function (ctx) {
          let recs = loadRecs(ctx)
          let all = SEED_CALC.concat(SEED_LINALG).concat(SEED_PROB).concat(loadCustom(ctx))
          let weak = all.filter(function (f) { return isWeak(recs[f.id]) })
          if (!weak.length) return '没有标记为不熟的公式。'
          return '有 ' + weak.length + ' 个公式老记不牢：' + weak.slice(0, 5).map(function (f) { return f.n }).join('；') + '。建议从弹药箱开始一轮。'
        }
      },
      {
        key: 'due', label: '今天该复测哪些公式',
        run: function (ctx) {
          let due = dueList(loadRecs(ctx), todayKey())
          if (!due.length) return '今天没有到期的公式复测。'
          let all = SEED_CALC.concat(SEED_LINALG).concat(SEED_PROB).concat(loadCustom(ctx))
          return '今天有 ' + due.length + ' 条公式待复测：' + due.slice(0, 4).map(function (x) {
            let f = findF(all, x.id)
            return f ? f.n : x.id
          }).join('；') + '。'
        }
      }
    ],
    shortcuts: [
      {
        key: 'alt+v',
        run: function (ctx) {
          try {
            if (ctx && ctx.api && ctx.api.goTool) ctx.api.goTool(TOOL_ID)
            else if (window.App) window.App.go(TOOL_ID)
          } catch (e) { /* 忽略 */ }
        }
      }
    ],
    init: function (ctx) {
      try {
        let n = SEED_CALC.length + SEED_LINALG.length + SEED_PROB.length
        ctx.log('公式军火库 v' + VERSION + ' 就绪（' + n + ' 条公式，渲染=KaTeX' + (window.katex ? '' : '（加载中，先纯文本）') + '）')
        /* 到期提示一次（不打扰：只在真的有到期时） */
        if (ctx.config('notify') !== false) {
          let due = dueList(loadRecs(ctx), todayKey())
          if (due.length && ctx.notify) {
            try {
              /* ⚠ ctx.notify 是**单参**接口（对象或纯标题串）——
               * 早期版本写成 notify(msg, {title})，第二参会被静默丢弃，通知只剩一串正文。
               * 顺便挂 onClick：点通知直接进工具页（唯一有提醒价值的动作）。 */
              ctx.notify({
                title: '公式军火库 · ' + due.length + ' 条待复测',
                body: '打开工具页开练，或按 D 直接开始一轮',
                level: 'info',
                onClick: function () {
                  try { if (ctx.api && ctx.api.goTool) ctx.api.goTool(TOOL_ID) } catch (e) { /* 忽略 */ }
                }
              })
            } catch (e) { /* 宿主字段变了就静默 */ }
          }
        }
      } catch (e) { /* 忽略 */ }
    },
    css: CSS
  }

  if (window.__FV_DEBUG__) {
    window.__fvInternals = {
      SEED_CALC: SEED_CALC, SEED_LINALG: SEED_LINALG, SEED_PROB: SEED_PROB,
      gradeOf: gradeOf, scoreOf: scoreOf, fuseMastery: fuseMastery, isWeak: isWeak,
      dueList: dueList, untestedList: untestedList, streakOf: streakOf,
      scheduleNext: scheduleNext, normRec: normRec, chaptersOf: chaptersOf,
      masteryStars: masteryStars, masteryColor: masteryColor, hintOf: hintOf,
      barsSvg: barsSvg, lastNDays: lastNDays, U_icon: U_icon, stripTex: stripTex,
      katexTex: katexTex, loadKatex: loadKatex, KATEX_BASE: KATEX_BASE, stripDelims: stripDelims,
      TOOL_ID: TOOL_ID, CSS_LEN: CSS.length
    }
  }

  PluginBus.register(api)
})()
