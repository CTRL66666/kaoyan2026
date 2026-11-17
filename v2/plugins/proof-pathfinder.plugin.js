/* ════════════════════════════════════════════════════════════════════
 * proof-pathfinder.plugin.js —— 「证明寻路者」 v1.0.0
 * 考研数学 · 证明类大题专项训练插件
 *
 * 【概念根基】内部讲义《证明类大题专题讲义_第6版》的核心论断：
 *   证明不是「写」的问题，是「搜」的问题。每道证明大题都由三块零件组成——
 *   条件（题设）、结论（目标）、桥（定理或构造）。会证的人不是记的定理多，
 *   而是掌握一张「条件→桥」触发表 + 一副从结论倒推的眼镜（四板斧）。
 *   本插件把这套方法论变成可玩的训练系统。
 *
 * 【五个视图】
 *   ① 寻路板 board     —— 招牌玩法：条件节点在左、目标在右，按序选「桥卡」
 *                          把已知推到目标；每一步校验前提（缺条件红牌），
 *                          通关做「条件审计」（讲义原话：没用的条件=警报）。
 *   ② 触发速答 trigger —— 讲义触发表/构造表/决策表做成限时问答：
 *                          看到结论长相 → 立刻说出桥/辅助函数/武器。
 *   ③ 证明拼图 reasm   —— 经典证明拆成步骤卡打乱，按逻辑顺序点回来
 *                          （军规锚点：性质声明必在定理前，回扣必须收尾）。
 *   ④ 军规关卡 audit   —— 阅卷人视角：找出埋雷证明里的违规行
 *                          （四条军规 + 三大踩分点要领，F1 计分）。
 *   ⑤ 档案 ledger      —— 寻路效率/触发命中率/拼图/关卡四率 + 弱项方法
 *                          排行 + 讲义三大表数字卡 + 导出/清空。
 *
 * 【纪律】类名全带 pp- 前缀；皮肤走 ctx.css.add('skin') 且 init 就注入（面板
 * 不 mount 也要有皮）；manifest icon 自包含 SVG（rawIcon 白名单只认 svg）；
 * confirm 回调无参（宿主 onOk() 契约）；警告字色日间 #b45309 夜间 --warn；
 * dock 指示器位移 = offsetLeft - 基位；进场动画按视图切换门控；
 * 显示文本禁用 prime 字符（texauto 定界符教训）；数学串交给站内 texauto 全局排版。
 * ════════════════════════════════════════════════════════════════════ */
; (function () {
  'use strict'
  let DEBUG = typeof window !== 'undefined' && window.__PP_DEBUG__

  /* ════════════════════════ 0. 常量与元信息 ════════════════════════ */

  let VERSION = '2.2.0'
  let T_MAIN = 'proof-pathfinder'
  let STYLE_ID = 'pp-skin-style'
  let AI_CTX_REVIEW = 'plugin.proof-pathfinder.review'
  let KEEP_RUN = 'ppRun'          // 寻路板进行中的题（单槽）
  let SESSION_MAX = 80
  let TRIG_PAGE = 12              // 触发一轮默认题数（config perRound 5-15）

  function num(v, d) { let n = Number(v); return isFinite(n) ? n : d }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v) }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }
  function trunc(s, n) {
    s = String(s == null ? '' : s)
    if (s.length <= n) return s
    let cut = s.slice(0, n)
    if ((cut.match(/\$/g) || []).length % 2 === 1) cut = cut.slice(0, cut.lastIndexOf('$'))
    if (cut.endsWith('\\')) cut = cut.slice(0, -1)
    return cut.trim() + '…'
  }
  function hashStr(s) { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return h >>> 0 }
  function dkey(t) { let d = new Date(num(t, Date.now())); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') }
  function fmtTime(t) { let d = new Date(num(t, Date.now())); return (d.getMonth() + 1) + '-' + String(d.getDate()).padStart(2, '0') + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') }
  function shuffle(arr, seed) {
    let a = arr.slice(), s = hashStr(seed)
    for (let i = a.length - 1; i > 0; i--) { s = (s * 1103515245 + 12345) >>> 0; let j = s % (i + 1); let t = a[i]; a[i] = a[j]; a[j] = t }
    return a
  }

  /* ════════════════════════ 1. 知识库：桥卡（定理/构造） ════════════════════════
   * 每张桥卡：req=入场券（需要的已知标签）, out=产出标签, tip=讲义触发器原文。
   * 标签体系来自讲义 1.1 触发表：cont 闭区间连续 / diff 开区间可导 / eqEnd 端点等值 /
   * signDiff 端点异号 / fx2 二阶以上导数信息 / recur 递推式 / intZero 积分为零 …… */
  let METHODS = [
    { k: 'zero', name: '零点定理', req: ['cont', 'signDiff'], out: ['root'], tip: '闭区间连续 + 端点异号 → 存在零点。注意：只能证存在，证不出唯一。' },
    { k: 'ivt', name: '介值定理', req: ['cont', 'between'], out: ['eta', 'eqEnd'], tip: '连续函数取到最值之间的一切值——「平均值不悬空」；双零点模型里它负责逼出中间那个等值点。' },
    { k: 'rolle', name: '罗尔定理', req: ['cont', 'diff', 'eqEnd'], out: ['dZero'], tip: '端点等值 + 连续可导 → 存在导数为零。用之前先造 F 使 F\' 就是结论。' },
    { k: 'lagr', name: '拉格朗日中值', req: ['cont', 'diff'], out: ['diffEq'], tip: '两点函数值之差 → f\'(ξ)·(b-a)。结论含 f\' 或两点函数值首选。' },
    { k: 'cauchy', name: '柯西中值', req: ['cont', 'diff', 'gNe0'], out: ['ratioEq'], tip: '结论是两个增量之比：分母函数的导数要先证非零（军规二）。' },
    { k: 'taylor', name: '泰勒展开', req: ['cont', 'diff2'], out: ['polyEst'], tip: '出现二阶及以上导数信息：选好展开点（常在取最值/中点处），拉格朗日余项。' },
    { k: 'mono', name: '单调性法', req: ['gDef', 'g0'], out: ['ineq'], tip: '证 g(x)>0：作差令 g，验 g(基点)=0，判 g\' 符号——层层剥笋。' },
    { k: 'extma', name: '极值最值法', req: ['cont', 'crit'], out: ['ineq'], tip: '导数变号但极值好算：求驻点比端点，最值即不等式界。' },
    { k: 'constvar', name: '常数变易法', req: ['twoVar'], out: ['oneVar'], tip: '双变量 x,y：固定一边为常数 a，化单变量再判单调。' },
    { k: 'monoBound', name: '单调有界准则', req: ['recur'], out: ['conv'], tip: '递推数列四步全在这座桥里：解不动点猜极限 → 归纳证有界 → 作差判单调 → 取极限。必须先证收敛再取极限（逻辑硬伤点）。' },
    { k: 'squeeze', name: '夹逼准则', req: ['twoSide'], out: ['conv'], tip: 'n 项和式：最大项最小项夹住整体；两端极限相等即收口。' },
    { k: 'comp', name: '压缩映射', req: ['recur', 'lipK'], out: ['conv', 'unique'], tip: '不单调的递推：|f(x)-f(y)| ≤ k|x-y| (k<1)，逐次缩距证收敛，顺带唯一性。' },
    { k: 'varInt', name: '变限积分桥', req: ['cont', 'intZero'], out: ['eqEnd', 'dZero', 'root'], tip: '积分条件的标准消化法：令 $F(x)=\\int_0^x f$，则 $F\'=f$ 且端点值为零——积分题翻译成微分题，$F\'(\\eta)=0$ 即 $f(\\eta)=0$。' },
    { k: 'rankOp', name: '秩运算三板斧', req: ['matCond'], out: ['rankIneq'], tip: 'AB=O → r(A)+r(B) ≤ n；乘矩阵不增秩；分块秩不等式。线性证明的地基。' },
    { k: 'eigDef', name: '特征定义展开', req: ['matCond', 'xNe0'], out: ['eigEq'], tip: 'Ax=λx 两边左乘需要的矩阵、内积展开——特征值证明没有魔法，全是定义左乘右乘。' },
    { k: 'symDel', name: '对称性消元', req: ['oddFn', 'symDom'], out: ['intZero'], tip: '奇函数 × 对称区域 = 0。不用算就能消灭的积分。' },
    { k: 'swapLim', name: '一致收敛换序', req: ['unifConv'], out: ['canSwap'], tip: '极限号与积分/求导换序的通行证：一致收敛（或 M 判别法先证）。换不了序=没资格。' },
    { k: 'contra', name: '反证法', req: ['anyGoal'], out: ['absurd'], tip: '「至多一个」「不含零点」类：反设两个/存在，推出与题设矛盾。' },
    { k: 'callback', name: '结论回扣', req: ['dZero'], out: ['done'], tip: '推出 F\'(ξ)=0 之后必须再一步「即 ……」翻译回题目原式——阅卷踩分点 1 分。' },
    { k: 'declare', name: '性质声明', req: ['anyGoal'], out: ['certify'], tip: '每引入一个函数，立刻声明连续/可导——所有中值定理的入场券（军规一，2-3 分）。' },
    { k: 'nonzero', name: '除法验证', req: ['anyGoal'], out: ['gNe0'], tip: '军规二：除法/柯西之前先证分母（g\'、b-a、e^{φ}）不为零——声明它，债务即清。' },
  ]
  let M_BY_K = {}
  METHODS.forEach(function (m) { M_BY_K[m.k] = m })

  /* ════════════════════ 1.5 前沿概念层（v2.0 融合升级） ════════════════════
   * A. 证明债务（Isabelle 式未清偿义务）：桥卡缺的前提不再拒收，而是挂债——
   *    你可以先往下写（像真实草稿），但每条债在结算时按阅卷扣分，且可被后续
   *    标签自动清偿；用「欠着该债的桥」去还该债 = 循环论证，当场报警。
   * B. 辅助函数发明器（Kapur 生产性失败 + 迷你 CAS）：自由输入 F(x)，
   *    符号求导 + 单项式规范形，验证 F'(ξ)=0 ≡ 结论 × 非零因子。
   * C. 反例怪兽馆（Lakatos）：病理函数库，债务产生时伏击「哪个怪物咬断前提」。
   * D. 提示阶梯（desirable difficulty）：四级渐进提示，逐级衰减得分。
   * E. 桥卡掌握度 SRS：触发题按 (到期,低掌握) 加权抽取，答后更新。
   * F. 方法供给网络：前提→桥→目标的 DAG + 个人证明病症诊断。 */

  /* 债务的人类可读文案（按缺失前提标签） */
  let DEBT_TEXT = {
    cont: '「$F$ 在闭区间连续」没验证就用了中值定理',
    diff: '「开区间可导」没验证——中值定理的入场券',
    eqEnd: '「端点等值 $F(a)=F(b)$」没算出来就喊罗尔',
    signDiff: '「端点异号」没验证，零点定理悬空',
    between: '「目标值介于最值之间」没夹住',
    gNe0: '柯西分母 $g\'\\ne 0$ 没先证（军规二）',
    diff2: '泰勒要二阶导数信息，题里没给够',
    crit: '极值法要先找到驻点/最值点',
    g0: '单调性法要验基点值 $g(\\text{基点})=0$',
    twoVar: '常数变易要先固定一边',
    recur: '递推式没写出来',
    mono: '单调性没证就套单调有界',
    bound: '有界性没证就套单调有界',
    twoSide: '夹逼的两端界没构造',
    lipK: '压缩映射的 Lipschitz 常数 $k<1$ 没验证',
    intZero: '积分条件没消费，变限积分桥搭不上',
    matCond: '矩阵条件（如 $AB=O$）没翻译成秩语言',
    xNe0: '特征向量 $x\\ne 0$ 是定义的一部分',
    oddFn: '奇偶性没验证',
    symDom: '积分区域的对称性没说明',
    unifConv: '一致收敛没证就换序（第 15 章通行证）',
    anyGoal: '',
  }
  /* 债务 → 怪兽伏击题（Lakatos：哪个病理函数咬断这个前提） */
  let MONSTERS = [
    { fn: '$x^2\\sin\\dfrac1x$（补充 $F(0)=0$）', breaks: ['diff', 'cont'], why: '处处可导但导函数在 0 处不连续——「可导 ⇒ 导数连续」是最流行的幻觉' },
    { fn: '$|x|$', breaks: ['diff'], why: '连续但 0 点不可导——罗尔的「可导」入场券它交不出' },
    { fn: 'Dirichlet 函数（$[0,1]$ 上 $\\mathbf{1}_{\\mathbb{Q}}$）', breaks: ['cont', 'intZero'], why: '处处不连续、不可积——「函数总有积分值」的前提它先塌' },
    { fn: '$x^3$ 在 $x=0$', breaks: ['crit'], why: '驻点不是极值点——$f\'(c)=0$ 之后还要看两侧符号' },
    { fn: '$e^x$ 在 $[0,+\\infty)$', breaks: ['bound', 'extma'], why: '单调递增无上界——「有界」不是天经地义，闭区间才白送最值' },
    { fn: '$\\dfrac1x$ 在 $(0,1]$', breaks: ['unifConv', 'cont'], why: '连续却无界——开区间上的「连续」不保证有界，一致连续要再验' },
    { fn: '$\\sin\\dfrac1x$', breaks: ['signDiff', 'between'], why: '震荡无极限——介值/零点推理的前提「端点有确定值」它没有' },
    { fn: 'Weierstrass 函数', breaks: ['diff'], why: '处处连续处处不可导——「连续函数总能求导」的历史级幻觉' },
    { fn: '$f_n(x)=x^n$ 在 $[0,1]$', breaks: ['unifConv'], why: '逐点收敛到不连续函数 ⇒ 不一致收敛——换序资格它没有' },
    { fn: '$\\dfrac{\\sin n}{n}$ 型级数条件收敛', breaks: ['swapLim'], why: '条件收敛时重排可改和——绝对收敛才配谈换序' },
  ]
  /* 触发题 → 关联桥卡（SRS 掌握度挂靠；索引对 TRIG_ITEMS） */
  let TRIG_BK = ['rolle', 'rolle', 'rolle', 'cauchy', 'rolle', 'cauchy', 'taylor', 'mono', 'extma', 'constvar', 'taylor', 'varInt', 'zero', 'monoBound', 'comp', 'swapLim']

  /* ════════════════════ 1.6 迷你 CAS：辅助函数发明器的验证内核 ════════════════════
   * 项 = c · x^a · e^{kx}^n · ln^m · f^{(d)} · g^{(e)}（指数为整数，键表存储）。
   * 支持表达式：x、f、f'、f''、g、ln(x)、e^{kx}、常数、*、/、括号、^ 非负整幂。
   * 求导：积法则/商法则/链式（e^{kx} 与 ln 的导数内建），展开为规范项表。
   * 匹配：F' 项表 ≡ 结论项表 × 单项式非零因子（逐指数差一致 + 系数比一致）。 */
  function exKey(ex) {
    let ks = Object.keys(ex).sort()
    return ks.map(function (k) { return k + ':' + ex[k] }).join(',')
  }
  function exAdd(a, b, s) {
    let o = {}
    Object.keys(a).forEach(function (k) { o[k] = a[k] })
    Object.keys(b).forEach(function (k) { o[k] = (o[k] || 0) + (s || 1) * b[k] })
    Object.keys(o).forEach(function (k) { if (o[k] === 0) delete o[k] })
    return o
  }
  function ppEx(ex) {
    let out = []
    if (ex.x) out.push(ex.x === 1 ? 'x' : 'x^{' + ex.x + '}')
    Object.keys(ex).forEach(function (k) {
      if (k.indexOf('e') === 0 && k !== 'x' && k !== 'ln') {
        let kk = k.slice(1)
        out.push('e^{' + (kk === '1' ? 'x' : kk + 'x') + '}' + (ex[k] === 1 ? '' : '^{' + ex[k] + '}'))
      }
    })
    if (ex.ln) out.push(ex.ln === 1 ? '\\ln x' : '(\\ln x)^{' + ex.ln + '}')
    ;['f', 'g'].forEach(function (fn) {
      for (let d = 0; d <= 3; d++) {
        let key = fn + d
        if (ex[key]) {
          let base = d === 0 ? fn + '(x)' : fn + '^(' + (d === 1 ? "'" : d === 2 ? '' + String.fromCharCode(0) : '') + ')'
          base = d === 1 ? fn + "'(x)" : d === 2 ? fn + "''(x)" : d === 3 ? fn + "'''(x)" : base
          out.push(ex[key] === 1 ? base : '(' + base + ')^{' + ex[key] + '}')
        }
      }
    })
    return out.length ? out.join(' \\cdot ') : '1'
  }
  function ppTerms(ts) {
    if (!ts.length) return '0'
    return ts.map(function (t) {
      let c = t.c
      let cs = c === 1 ? '' : (c === -1 ? '-' : String(c))
      let body = ppEx(t.ex)
      return cs + (body === '1' ? (cs ? '' : '1') : (cs ? ' ' + body : body))
    }).join(' + ').replace(/\+ -/g, '- ')
  }
  /* 解析 */
  function parseExpr(str) {
    let toks = String(str).replace(/\s+/g, '').match(/[a-zA-Z]+|\d+(?:\.\d+)?|\^|\*|\/|\(|\)|\{|\}|-/g)
    if (!toks) return { err: '空的不能再空——F(x) 总得写点什么' }
    let pos = 0
    function peek() { return toks[pos] }
    function next() { return toks[pos++] }
    function expr() {
      let t = term()
      if (t.err) return t
      while (peek() === '*' || peek() === '/') {
        let op = next()
        let r = term()
        if (r.err) return r
        if (op === '*') t = { kind: 'mul', a: t, b: r }
        else t = { kind: 'div', a: t, b: r }
      }
      return t
    }
    function term() {
      let a = atom()
      if (a.err) return a
      if (peek() === '^') {
        next()
        let neg = peek() === '-'
        if (neg) next()
        let n = next()
        if (!/^\d+$/.test(n)) return { err: '^ 后面只支持非负整数幂（考研构造够用）' }
        let v = Number(n) * (neg ? -1 : 1)
        if (v < 0) return { kind: 'div', a: { kind: 'num', v: 1 }, b: { kind: 'pow', a: a, n: -v } }
        if (v === 0) return { kind: 'num', v: 1 }
        if (v === 1) return a
        return { kind: 'pow', a: a, n: v }
      }
      return a
    }
    function atom() {
      let tk = peek()
      if (tk == null) return { err: '表达式不完整' }
      if (tk === '(') {
        next()
        let e = expr()
        if (e.err) return e
        if (peek() !== ')') return { err: '少右括号' }
        next()
        return e
      }
      if (/^\d/.test(tk)) { next(); return { kind: 'num', v: Number(tk) } }
      if (tk === 'x') { next(); return { kind: 'x' } }
      if (tk === 'ln') {
        next()
        if (peek() === '(') { next(); if (peek() === 'x') { next(); if (peek() === ')') next() } }
        return { kind: 'ln' }
      }
      if (tk === 'e') {
        next()
        if (peek() !== '^') return { err: 'e 后面要接 ^，如 e^x、e^{-2x}' }
        next()
        let brace = peek() === '{'
        if (brace) next()
        let neg = peek() === '-'
        if (neg) next()
        let k = 1
        if (/^\d/.test(String(peek()))) { k = Number(next()) }
        if (peek() !== 'x') return { err: 'e 的指数只支持整数倍 x，如 e^x、e^{-2x}' }
        next()
        if (brace) {
          if (peek() !== '}') return { err: 'e 的指数少右花括号' }
          next()
        }
        return { kind: 'exp', k: (neg ? -1 : 1) * k }
      }
      if (tk === 'f' || tk === 'g') {
        next()
        let d = 0
        while (peek() === "'" || peek() === '′') { next(); d++ }
        if (peek() === '(') {
          next()
          if (peek() === 'x') next()
          if (peek() !== ')') return { err: '括号没闭合——写 f(x) 或 f' }
          next()
        }
        if (d > 2) return { err: '最高支持到二阶导（考研构造天花板）' }
        return { kind: 'fn', name: tk, d: d }
      }
      return { err: '不认识「' + tk + '」——可用：x, f, f\', g, ln(x), e^{kx}, 数字, *, /, ^n, ()' }
    }
    let root = expr()
    if (root.err) return root
    if (pos < toks.length) return { err: '后面有多余的「' + toks[pos] + '」（相邻项要用 * 连接）' }
    return root
  }
  /* AST → 项表（展开） */
  function flatten(a) {
    if (a.kind === 'num') return a.v === 0 ? [] : [{ c: a.v, ex: {} }]
    if (a.kind === 'x') return [{ c: 1, ex: { x: 1 } }]
    if (a.kind === 'ln') return [{ c: 1, ex: { ln: 1 } }]
    if (a.kind === 'exp') return [{ c: 1, ex: { ['e' + a.k]: 1 } }]
    if (a.kind === 'fn') return [{ c: 1, ex: { [a.name + a.d]: 1 } }]
    if (a.kind === 'pow') {
      let base = flatten(a.a)
      let acc = [{ c: 1, ex: {} }]
      for (let i = 0; i < a.n; i++) acc = mulTerms(acc, base)
      return acc
    }
    if (a.kind === 'mul') return mulTerms(flatten(a.a), flatten(a.b))
    if (a.kind === 'div') {
      /* 只允许分母是单项式（flatten 后恰一项）——考研构造全在此列 */
      let den = normTerms(flatten(a.b))
      if (den.length !== 1) return []
      let denInv = [{ c: 1 / den[0].c, ex: exAdd({}, den[0].ex, -1) }]
      return mulTerms(flatten(a.a), denInv)
    }
    return []
  }
  function mulTerms(A, B) {
    let out = []
    A.forEach(function (ta) { B.forEach(function (tb) { out.push({ c: ta.c * tb.c, ex: exAdd(ta.ex, tb.ex, 1) }) }) })
    return normTerms(out)
  }
  function normTerms(ts) {
    let map = {}
    ts.forEach(function (t) {
      if (t.c === 0) return
      let k = exKey(t.ex)
      if (map[k]) map[k].c += t.c; else map[k] = { c: t.c, ex: t.ex }
    })
    return Object.keys(map).map(function (k) { return map[k] }).filter(function (t) { return t.c !== 0 })
      .sort(function (a, b) { return exKey(a.ex) < exKey(b.ex) ? -1 : 1 })
  }
  /* 求导（对 AST） */
  function diff(a) {
    if (a.kind === 'num') return []
    if (a.kind === 'x') return [{ c: 1, ex: {} }]
    if (a.kind === 'ln') return [{ c: 1, ex: { x: -1 } }]
    if (a.kind === 'exp') return [{ c: a.k, ex: { ['e' + a.k]: 1 } }]
    if (a.kind === 'fn') {
      if (a.d >= 2) return []  // f''' 不支持（flatten 已限 d≤2）
      let k = a.name + (a.d + 1)
      return [{ c: 1, ex: { [k]: 1 } }]
    }
    if (a.kind === 'pow') {
      if (a.n === 1) return diff(a.a)
      let inner = flatten(a.a)
      let dpu = [{ c: a.n, ex: {} }]
      let acc = [{ c: 1, ex: {} }]
      for (let i = 0; i < a.n - 1; i++) acc = mulTerms(acc, inner)
      return mulTerms(mulTerms(dpu, acc), diff(a.a))
    }
    if (a.kind === 'mul') {
      return normTerms(mulTerms(diff(a.a), flatten(a.b)).concat(mulTerms(flatten(a.a), diff(a.b))))
    }
    if (a.kind === 'div') {
      /* 商法则（分母限单项式）：F=u/d → F' = u'·d⁻¹ − u·d'·d⁻² */
      let dFlat = normTerms(flatten(a.b))
      if (dFlat.length !== 1) return []
      let d = dFlat[0]
      let dInv1 = [{ c: 1 / d.c, ex: exAdd({}, d.ex, -1) }]
      let dInv2 = [{ c: 1 / (d.c * d.c), ex: exAdd({}, d.ex, -2) }]
      let t1 = mulTerms(diff(a.a), dInv1)
      let t2 = mulTerms(mulTerms(flatten(a.a), diff(a.b)), dInv2)
        .map(function (t) { return { c: -t.c, ex: t.ex } })
      return normTerms(t1.concat(t2))
    }
    return []
  }
  /* F' 与结论匹配：F' = μ · goal，μ 单项式非零因子。
   * 配对按「导数结构」而非排序位置：ex 拆成 fn 部分（f0/f1/f2/g0/g1）与变量部分
   * （x/ln/e*）——goal 每项须在 F' 中找同 fn 结构、变量部分差同一个 μ 的对应项。 */
  function exSplit(ex) {
    let fn = {}, vr = {}
    Object.keys(ex).forEach(function (k) {
      if (k[0] === 'f' || k[0] === 'g') fn[k] = ex[k]; else vr[k] = ex[k]
    })
    return { fn: fn, vr: vr }
  }
  function matchGoal(fterms, goalTerms) {
    if (!fterms.length) return { ok: false, why: '你的 F 求导恒为 0（它是常数？）——和结论对不上' }
    let g = normTerms(goalTerms)
    if (fterms.length !== g.length) return { ok: false, why: '项数对不上：F\' 展开有 ' + fterms.length + ' 项，结论是 ' + g.length + ' 项——差的往往是乘积法则漏了半条' }
    let s0 = exSplit(g[0].ex)
    for (let anchor = 0; anchor < fterms.length; anchor++) {
      let sf = exSplit(fterms[anchor].ex)
      if (exKey(sf.fn) !== exKey(s0.fn)) continue
      let dVr = exAdd(sf.vr, s0.vr, -1)
      let cf = fterms[anchor].c / g[0].c
      let ok = true
      for (let j = 1; j < g.length; j++) {
        let sj = exSplit(g[j].ex)
        let hit = -1
        for (let i = 0; i < fterms.length; i++) {
          let si = exSplit(fterms[i].ex)
          if (exKey(si.fn) !== exKey(sj.fn)) continue
          if (exKey(exAdd(si.vr, sj.vr, -1)) !== exKey(dVr)) continue
          if (Math.abs(fterms[i].c - cf * g[j].c) > 1e-9) continue
          hit = i; break
        }
        if (hit < 0) { ok = false; break }
      }
      if (ok) {
        let negExp = Object.keys(dVr).some(function (k) { return dVr[k] < 0 })
        return { ok: true, factor: (cf === 1 ? '' : cf + ' · ') + ppTerms([{ c: 1, ex: dVr }]), negExp: negExp }
      }
    }
    return { ok: false, why: 'F\' = ' + ppTerms(fterms) + '——与结论 × 同一非零因子的形状不齐。检查：系数比处处一致吗？漏乘/多乘了哪个因子？' }
  }


  /* ════════════════════════ 2. 知识库：寻路板题目（8 道，蒸馏自讲义例题） ════════════════════════ */
  let BOARD_PROBLEMS = [
    {
      id: 'bp1', ch: '第4章 罗尔与辅助函数', title: '乘积导数型',
      stem: '设 $f(x)$ 在 $[0,1]$ 上连续，在 $(0,1)$ 内可导，且 $f(1)=0$。证明：存在 $\\xi\\in(0,1)$，使 $\\xi f\'(\\xi)+f(\\xi)=0$。',
      conds: [
        { t: 'cont', x: '$f$ 在 $[0,1]$ 连续' },
        { t: 'diff', x: '$f$ 在 $(0,1)$ 可导' },
        { t: 'eqEnd', x: '构造 $F(x)=xf(x)$ 后 $F(0)=F(1)=0$' },
      ],
      goal: 'dZero', best: 2,
      goalEq: [{ c: 1, ex: { x: 1, f1: 1 } }, { c: 1, ex: { f0: 1 } }],
      routes: [['declare', 'rolle'], ['rolle'], ['varInt', 'rolle']],
      necessity: { tag: 'eqEnd', why: '去掉 $f(1)=0$：$f\\equiv 1$ 一切条件满足，但 $F(x)=x$ 无罗尔入场券——$F(0)=F(1)$ 断了整条链。' },
      tip: '结论 $\\xi f\'(\\xi)+f(\\xi)=0$ 恰是 $(xf)\'$ 的展开——直接观察（四板斧①），令 $F(x)=xf(x)$。',
      anchor: '构造表第 1 行：$\\xi f\'(\\xi)+f(\\xi)=0\\Rightarrow F(x)=xf(x)$',
    },
    {
      id: 'bp2', ch: '第3章 存在性定理', title: '端点异号零点',
      stem: '设 $f(x)$ 在 $[0,1]$ 上连续，$f(0)<0<f(1)$。证明：存在 $\\xi\\in(0,1)$ 使 $f(\\xi)=0$。',
      conds: [
        { t: 'cont', x: '$f$ 在 $[0,1]$ 连续' },
        { t: 'signDiff', x: '$f(0)<0<f(1)$ 端点异号' },
      ],
      goal: 'root', best: 1,
      goalEq: [{ c: 1, ex: { f0: 1 } }],
      routes: [['zero'], ['declare', 'zero']],
      necessity: { tag: 'cont', why: '去掉连续：Dirichlet 函数在 $[0,1]$ 上 $f(0)<0<f(1)$ 却处处不连续、根本没有零点——介值/零点全部依赖连续这个舞台。' },
      tip: '闭区间连续 + 端点异号 → 零点定理，一步到位。它只证存在不证唯一——要唯一得再借单调。',
      anchor: '触发表第 1 行：闭区间连续 + 端点异号 → 零点定理',
    },
    {
      id: 'bp3', ch: '第8章 积分等式', title: '变限积分桥',
      stem: '设 $f(x)$ 在 $[0,1]$ 上连续，$\\int_0^1 f(x)\\,dx=0$。证明：存在 $\\xi\\in(0,1)$ 使 $f(\\xi)=0$。',
      conds: [
        { t: 'cont', x: '$f$ 在 $[0,1]$ 连续' },
        { t: 'intZero', x: '$\\int_0^1 f=0$' },
      ],
      goal: 'root', best: 1,
      goalEq: [{ c: 1, ex: { f0: 1 } }],
      routes: [['varInt'], ['declare', 'varInt']],
      necessity: { tag: 'intZero', why: '去掉积分为零：$f\\equiv 1$ 在 $[0,1]$ 连续但无零点——积分条件是「平均值不悬空」的全部来源。' },
      tip: '积分条件的标准消化方式：令 $F(x)=\\int_0^x f$，则 $F\'=f$、$F(0)=F(1)=0$——积分题秒变罗尔题。',
      anchor: '构造表/触发表第 6 行：积分等式含 $f(\\xi)$ → 构造变限积分',
    },
    {
      id: 'bp4', ch: '第6章 泰勒公式', title: '二阶导放大',
      stem: '设 $f$ 在 $[0,1]$ 二阶可导，$f(0)=f(1)=0$，$\\max f=-1$。证明：存在 $\\xi$ 使 $f\'\'(\\xi)\\ge 8$。',
      conds: [
        { t: 'cont', x: '$f\'\'$ 存在故 $f\'$ 连续' },
        { t: 'diff2', x: '二阶可导' },
        { t: 'crit', x: '内点 $c$ 取最小值：$f\'(c)=0$' },
      ],
      goal: 'polyEst', best: 3,
      routes: [['extma', 'taylor'], ['declare', 'extma', 'taylor'], ['taylor']],
      necessity: { tag: 'diff2', why: '去掉二阶可导：$f(x)=-1+|2x-1|$ 连续、$f(0)=f(1)=0$、$\\max=-1$ 全满足，但 $x=1/2$ 处不可导——$f\'\'\\ge 8$ 根本无从谈起。' },
      tip: '出现二阶导数信息 → 泰勒。展开点选最值点 $c$（$f\'(c)=0$ 白送），在端点取值放缩。',
      anchor: '触发表第 4 行：二阶及以上导数信息 → 泰勒公式（选好展开点）',
    },
    {
      id: 'bp5', ch: '第2章 递推数列', title: '单调有界四步',
      stem: '设 $a_1=2$，$a_{n+1}=\\sqrt{a_n+2}$。证明 $\\{a_n\\}$ 收敛并求极限。',
      conds: [
        { t: 'recur', x: '递推式 $a_{n+1}=\\sqrt{a_n+2}$ 与初值' },
      ],
      goal: 'conv', best: 2,
      routes: [['monoBound'], ['declare', 'monoBound']],
      necessity: { tag: 'recur', why: '没有递推式就没有「两边取极限」的代数通道——$a_n$ 随便震荡都满足别的条件，收敛纯属幻想。' },
      tip: '标准作战四步：解不动点 $L=\\sqrt{L+2}$ 猜极限 → 归纳证 $a_n\\le 2$ → 作差判单调 → 取极限。',
      anchor: '触发表第 7 行：递推数列 → 单调有界准则，先猜极限再证',
    },
    {
      id: 'bp6', ch: '第5章 拉格朗日柯西', title: '双点差商',
      stem: '设 $f,g$ 在 $[a,b]$ 连续、$(a,b)$ 可导，且已知 $g\'(x)\\ne 0$。证明：存在 $\\xi$ 使 $\\dfrac{f\'(\\xi)}{g\'(\\xi)}=\\dfrac{f(b)-f(a)}{g(b)-g(a)}$。',
      conds: [
        { t: 'cont', x: '$f,g$ 闭区间连续' },
        { t: 'diff', x: '$f,g$ 开区间可导' },
        { t: 'gNe0', x: '已知 $g\'(x)\\ne 0$' },
      ],
      goal: 'ratioEq', best: 2,
      routes: [['cauchy'], ['declare', 'cauchy']],
      necessity: { tag: 'gNe0', why: '去掉 $g\'\\ne 0$：$g(x)=x^2$ 在 $[-1,1]$ 上 $g\'(0)=0$——柯西的分母当场爆炸（军规二的定理级版本）。' },
      tip: '两个增量之比 → 柯西中值定理；分母导数非零这题白送，考场上这一步要自己先证（军规二）。',
      anchor: '触发表第 3 行：结论含 $f\'(\\xi)$ 或两点函数值 → 拉格朗日/柯西',
    },
    {
      id: 'bp7', ch: '第11章 秩不等式', title: 'AB=O 的秩',
      stem: '设 $A$ 为 $m\\times n$，$B$ 为 $n\\times s$，且 $AB=O$。证明：$r(A)+r(B)\\le n$。',
      conds: [
        { t: 'matCond', x: '$AB=O$：$B$ 的列都是 $Ax=0$ 的解' },
      ],
      goal: 'rankIneq', best: 2,
      routes: [['rankOp'], ['declare', 'rankOp']],
      necessity: { tag: 'matCond', why: '去掉 $AB=O$：取 $A=B=I$，$r(A)+r(B)=2n>n$——整个命题就是这一条条件撑起来的。' },
      tip: '$B$ 的列空间 ⊆ $Ax=0$ 的解空间（维数 $n-r(A)$），故 $r(B)\\le n-r(A)$。',
      anchor: '秩不等式三条主干之一：$AB=O\\Rightarrow r(A)+r(B)\\le n$',
    },
    {
      id: 'bp8', ch: '第1章 方法论总论', title: '移项作差 + 罗尔',
      stem: '设 $f$ 在 $[0,1]$ 连续、$(0,1)$ 可导，$f(0)=0$，$f(1)=1$。证明：存在 $\\xi$ 使 $f\'(\\xi)=f(\\xi)$。',
      conds: [
        { t: 'cont', x: '闭区间连续' },
        { t: 'diff', x: '开区间可导' },
        { t: 'between', x: '$f(0)=0<f(1)=1$' },
      ],
      goal: 'dZero', best: 3,
      goalEq: [{ c: 1, ex: { f1: 1 } }, { c: -1, ex: { f0: 1 } }],
      necessity: { tag: 'between', why: '去掉端点值跨 0：$f\\equiv 1$ 满足连续可导但 $f\'-f=-1$ 永不为零——介值逼出第二个等值点全靠 $f(0)=0<f(1)=1$。' },
      routes: [['declare', 'ivt', 'rolle'], ['ivt', 'rolle']],
      tip: '移项作差（四板斧②）：$f\'-f=0$ 命中积分因子 $e^{-x}$（构造表第 3 行）令 $F=e^{-x}f$，则 $F(0)=0$；$F(1)=e^{-1}>0$，由介值找 $c$ 使 $F(c)=0$，罗尔收口。',
      anchor: '四板斧②③：移项作差 + 积分因子 $f\'-f\\Rightarrow$ 乘 $e^{-x}$',
    },
  ]

  /* ════════════════════════ 3. 知识库：触发速答题（蒸馏自三大表） ════════════════════════ */
  let TRIG_ITEMS = [
    { q: '结论要证 $\\xi f\'(\\xi)+f(\\xi)=0$，辅助函数选？', opts: ['$F(x)=xf(x)$', '$F(x)=f(x)/x$', '$F(x)=e^{x}f(x)$', '$F(x)=x^{2}f(x)$', '$F(x)=\\ln f(x)$', '$F(x)=f(x)-x$'], a: 0, why: '构造表第 1 行：$\\xi f\'(\\xi)+f(\\xi)=0$ 即 $(xf)\'$ 的零点。' },
    { q: '结论要证 $\\xi f\'(\\xi)-2f(\\xi)=0$，辅助函数选？', opts: ['$F(x)=x^{2}f(x)$', '$F(x)=f(x)/x^{2}$', '$F(x)=e^{-2x}f(x)$', '$F(x)=2xf(x)$', '$F(x)=x^{-1}f(x)$', '$F(x)=f\'(x)/x^{2}$'], a: 1, why: '构造表第 2 行：商求导 $(f/x^{2})\'=(xf\'-2f)/x^{3}$，分子正是结论。' },
    { q: '结论形如 $f\'(\\xi)+\\lambda f(\\xi)=0$，乘的积分因子是？', opts: ['$e^{\\lambda x}$', '$e^{-\\lambda x}$', '$x^{\\lambda}$', '$e^{x}$', '$\\lambda$', '$e^{f(x)}$'], a: 0, why: '构造表第 3 行：$(e^{\\lambda x}f)\'=e^{\\lambda x}(f\'+\\lambda f)$。指数符号取结论的同号。' },
    { q: '结论形如 $f\'(\\xi)g(\\xi)-f(\\xi)g\'(\\xi)=0$，辅助函数选？', opts: ['$F=f/g$', '$F=fg$', '$F=f-g$', '$F=f\'g\'$', '$F=f/g\'$', '$F=e^{f}g$'], a: 0, why: '商的导数分子：$(f/g)\'=(f\'g-fg\')/g^{2}$。先确认 $g\\ne 0$（军规二）。' },
    { q: '结论含 $f\'(\\xi)$ 且题设给了端点等值 $F(a)=F(b)$，首选桥是？', opts: ['罗尔定理', '拉格朗日中值定理', '柯西中值定理', '泰勒公式', '零点定理', '介值定理'], a: 0, why: '触发表第 2 行：结论含 $f\'(\\xi)$ + 端点等值 → 罗尔 + 辅助函数。' },
    { q: '结论是两点导数之比 $\\dfrac{f\'(\\xi)}{g\'(\\xi)}$，首选桥是？', opts: ['柯西中值定理', '拉格朗日中值定理', '罗尔定理', '泰勒公式', '介值定理', '反证法'], a: 0, why: '触发表第 3 行：两个增量之比 → 柯西。用之前先证 $g\'\\ne 0$。' },
    { q: '题设出现二阶导数信息（$f\'\'$ 有界/存在），首选武器是？', opts: ['泰勒公式', '罗尔定理', '夹逼准则', '单调性法', '拉格朗日中值', '反证法'], a: 0, why: '触发表第 4 行：二阶及以上导数信息 → 泰勒公式，展开点选最值点或中点。' },
    { q: '要证函数不等式 $g(x)>0$ 且 $g\'$ 直接可判号，标准动作是？', opts: ['单调性法：令 $g$，验 $g(\\text{基点})=0$，判 $g\'$ 号', '极值法求最值', '常数变易法', '泰勒展开', '拉格朗日中值', '夹逼准则'], a: 0, why: '决策表第 1 行：含参数可移项作差 → 单调性法，基点常取 $0$ 或端点。' },
    { q: '$g\'$ 变号但驻点好解、极值好算，武器换成？', opts: ['极值最值法', '单调性法', '常数变易法', '凹凸性', '泰勒公式', '反证法'], a: 0, why: '决策表第 2 行：导数变号但极值好算 → 驻点比端点，最值即界。' },
    { q: '不等式两端各含一个变量（双变量 $x,y$），第一动作是？', opts: ['常数变易：固定一边为常数 $a$', '两边平方', '直接求导', '用均值不等式', '泰勒展开', '反证法'], a: 0, why: '决策表第 3 行：双变量 → 固定一边为常数，化为单变量函数再判单调。' },
    { q: '结论含标杆函数 $e^{x}$、$\\ln(1+x)$、$\\arctan x$，首选放缩是？', opts: ['切线放缩（泰勒一阶）', '均值不等式', '柯西不等式', '琴生不等式', '夹逼准则', '单调性法'], a: 0, why: '决策表第 6 行：$e^{x}\\ge 1+x$、$\\ln(1+x)\\le x$、$\\arctan x\\le x$ 是现成的螺丝刀。' },
    { q: '要证「至少两个零点」，比零点定理多借的那把刀是？', opts: ['变限积分 + 罗尔', '泰勒公式', '反证法', '压缩映射', '一致连续', '柯西中值'], a: 0, why: '双零点模型：令 $F=\\int f$，找三个等值点（积分条件逼出中间一个），相邻罗尔各打一个。' },
    { q: '递推数列 $a_{n+1}=f(a_{n})$ 证明收敛，第一步是？', opts: ['解不动点方程猜极限', '直接取极限', '先证单调', '先证有界', '用夹逼', '用压缩映射'], a: 0, why: '标准作战流程第一步：解 $f(L)=L$ 求候选极限——界常常就是不动点本身。' },
    { q: '不单调的递推数列，讲义给的替代武器是？', opts: ['压缩映射', '单调有界准则', '夹逼准则', '区间套', '柯西收敛原理', '斯托尔兹'], a: 0, why: '第 2.3 节：$|f(x)-f(y)|\\le k|x-y|$（$k<1$）逐次缩距，顺带送唯一性。' },
    { q: '极限号与积分号要换序，先必须验证？', opts: ['一致收敛（或 M 判别法）', '连续', '可导', '有界', '单调', '绝对可积'], a: 0, why: '第 15 章：一致收敛是换序的通行证——「换不了序=没资格」。' },
    { q: '$AB=O$ 能直接推出的秩结论是？', opts: ['$r(A)+r(B)\\le n$', '$r(A)=0$', '$r(B)=0$', '$r(A)+r(B)=n$', '$AB\\ne O$', '$r(AB)=r(A)$'], a: 0, why: '秩不等式主干：$B$ 的列全是 $Ax=0$ 的解，$r(B)\\le n-r(A)$。' },
  ]

  /* ════════════════════════ 4. 知识库：证明拼图（经典证明拆步，正确顺序=数组序） ════════════════════════ */
  let REASM_SETS = [
    {
      id: 'rp1', title: '例 4.1：$f(1)=0$ 证 $\\xi f\'(\\xi)+f(\\xi)=0$',
      steps: [
        '倒推观察：结论即 $(xf)\'$ 在 $\\xi$ 处为零——令 $F(x)=xf(x)$（构造表第 1 行）',
        '声明性质：$f$ 在 $[0,1]$ 连续、$(0,1)$ 可导，故 $F(x)=xf(x)$ 同具此性质（军规一）',
        '验证端点：$F(0)=0$，$F(1)=1\\cdot f(1)=0$，得 $F(0)=F(1)$（定理前提逐条写）',
        '罗尔定理：存在 $\\xi\\in(0,1)$ 使 $F\'(\\xi)=0$',
        '回扣结论：$F\'(x)=f(x)+xf\'(x)$，即 $\\xi f\'(\\xi)+f(\\xi)=0$ ∎（踩分点：翻译回原式）',
      ],
    },
    {
      id: 'rp2', title: '例 8.1：推广积分中值定理',
      steps: [
        '不妨设 $g(x)\\ge 0$（$g\\le 0$ 对 $-g$ 同理）——先处理符号情形',
        '最值定理：$f$ 连续，设 $m=\\min f$、$M=\\max f$，则 $m\\le f(x)\\le M$',
        '乘 $g$ 保号积分：$m\\int g\\le \\int fg\\le M\\int g$（$g\\ge 0$ 方向不变）',
        '若 $\\int g>0$：平均值 $\\mu$ 落在 $[m,M]$ 内，介值定理给出 $\\xi$ 使 $f(\\xi)=\\mu$',
        '$\\int g=0$ 分支：$g$ 非负连续积分为零 $\\Rightarrow g\\equiv 0$，两边皆 $0$ 平凡成立',
        '回扣：$\\int fg=f(\\xi)\\int g$ ∎',
      ],
    },
    {
      id: 'rp3', title: '例 2.1：$a_{n+1}=\\sqrt{a_n+2}$ 收敛',
      steps: [
        '解不动点 $L=\\sqrt{L+2}$ 得 $L=2$（负根舍去）——先猜后证',
        '归纳证有界：$a_1=2\\le 2$；设 $a_n\\le 2$，则 $a_{n+1}=\\sqrt{a_n+2}\\le 2$',
        '作差判单调：$a_{n+1}-a_n=\\dfrac{2-a_n}{\\sqrt{a_n+2}+a_n}\\ge 0$，单调递增',
        '单调有界准则：$\\{a_n\\}$ 收敛，设极限为 $A$',
        '两边取极限（$\\sqrt{\\cdot}$ 连续）：$A=\\sqrt{A+2}$，解得 $A=2$ ∎（注意：必须先证收敛再取极限——军规）',
      ],
    },
    {
      id: 'rp4', title: '例 3.3：$\\int_0^1 f=0$ 证 $f$ 有零点',
      steps: [
        '构造变限积分：$F(x)=\\int_0^x f(t)\\,dt$，则 $F\'=f$、$F(0)=0$、$F(1)=\\int_0^1 f=0$',
        '声明性质：$f$ 连续故 $F$ 在 $[0,1]$ 可导、$F\'$ 连续',
        '罗尔定理：存在 $\\eta\\in(0,1)$ 使 $F\'(\\eta)=0$',
        '回扣：$F\'(\\eta)=f(\\eta)=0$，即 $f$ 在 $(0,1)$ 内有零点 ∎',
      ],
    },
    {
      id: 'rp5', title: '第一章练习 4：$f\'(\\xi)=2\\xi f(\\xi)$ 型',
      steps: [
        '移项作差：结论改写为 $f\'(\\xi)-2\\xi f(\\xi)=0$',
        '积分因子：命中构造表 $f\'-2xf$ 型 $\\Rightarrow$ 乘 $e^{-x^{2}}$，令 $F(x)=e^{-x^{2}}f(x)$',
        '端点验证：$F(0)=f(0)=0$，$F(1)=e^{-1}f(1)=0$（题设 $f(0)=f(1)=0$ 白送）',
        '声明性质 + 罗尔：$F$ 连续可导，存在 $\\xi$ 使 $F\'(\\xi)=0$',
        '回扣：$F\'=e^{-x^{2}}(f\'-2xf)$ 且指数恒非零，故 $f\'(\\xi)=2\\xi f(\\xi)$ ∎（除以 $e^{-\\xi^{2}}$ 前先说明它不为零——军规二）',
      ],
    },
    {
      id: 'rp6', title: '双零点模型：$\\int f=\\int xf=0$ 证 $f$ 两零点',
      steps: [
        '第一层构造：$F(x)=\\int_0^x f$，则 $F(0)=F(1)=0$（$F(1)=\\int_0^1 f=0$ 由积分条件）',
        '罗尔一打：存在 $c\\in(0,1)$ 使 $F\'(c)=f(c)=0$——第一个零点到手',
        '第二层逼点：$\\int_0^1 xf=F\\cdot x\\big|_0^1-\\int_0^1 F=\\int_0^1 F$ 分部后由条件为 $0$',
        '介值逼出：$F$ 连续、积分为 $0$ 且 $F(0)=F(1)=0$，若 $F$ 不恒零则必变号，介值定理给出 $d$ 使 $F(d)=0$',
        '罗尔再打：$F(0)=F(d)=0$ 与 $F(d)=F(1)=0$ 各用一次罗尔，得 $f$ 在 $(0,d)$ 与 $(d,1)$ 各一个零点 ∎',
      ],
    },
  ]

  /* ════════════════════════ 5. 知识库：军规关卡（埋雷证明，bad=违反的军规/要领） ════════════════════════ */
  let AUDIT_SETS = [
    {
      id: 'au1', title: '罗尔证明里的三处雷',
      lines: [
        { x: '令 $F(x)=f(x)-f(a)$。', bad: null },
        { x: '$F$ 在 $[a,b]$ 上连续，在 $(a,b)$ 内可导。', bad: null },
        { x: '由罗尔定理，存在 $\\xi\\in(a,b)$ 使 $F\'(\\xi)=0$。', bad: 'premise', note: '罗尔三前提里「端点等值」没验证：$F(a)=0$ 但 $F(b)=f(b)-f(a)$ 未必为零——定理前提逐条写，没写=不会。' },
        { x: '即 $f\'(\\xi)=0$。', bad: null },
        { x: '两边除以 $b-a$，得证。', bad: 'divide', note: '军规二：除法之前先证分母非零。这里 $b-a>0$ 由区间定义保证，但必须写出来。' },
      ],
    },
    {
      id: 'au2', title: '递推数列：先取极限后证收敛',
      lines: [
        { x: '设 $a_1=1$，$a_{n+1}=\\dfrac{a_n}{1+a_n}$。', bad: null },
        { x: '令极限为 $A$，则 $A=\\dfrac{A}{1+A}$，解得 $A=0$。', bad: 'logic', note: '逻辑硬伤：还没证明 $\\{a_n\\}$ 收敛就写 $\\lim$——极限记号只对收敛数列有意义，阅卷整步扣分。正确顺序：先单调有界证收敛，再取极限。' },
        { x: '下面给出严格证明。', bad: null },
        { x: '由归纳法 $a_n>0$，且 $a_{n+1}-a_n=-\\dfrac{a_n^{2}}{1+a_n}<0$，单调递减。', bad: null },
        { x: '单调递减且有下界 $0$，故收敛，极限为 $0$。', bad: null },
      ],
    },
    {
      id: 'au3', title: '不等式证明：严格性含糊',
      lines: [
        { x: '要证 $x>0$ 时 $\\ln(1+x)<x$。', bad: null },
        { x: '令 $g(x)=x-\\ln(1+x)$，$g(0)=0$。', bad: null },
        { x: '$g\'(x)=\\dfrac{x}{1+x}>0$（$x>0$），故 $g$ 单调不减。', bad: 'strict', note: '军规四：由 $g\'>0$ 应得「严格递增」，写「单调不减」是主动降档——严格不等号需要严格论证。' },
        { x: '于是 $x>0$ 时 $g(x)\\ge g(0)=0$，即 $\\ln(1+x)\\le x$。', bad: 'strict', note: '回扣的结论是 $\\le$，题目要的是 $<$：不减 + 端点等值推不出严格号。应写「严格递增故 $g(x)>g(0)=0$」。' },
      ],
    },
    {
      id: 'au4', title: '量词顺序事故现场',
      lines: [
        { x: '题设：对任意 $x\\in[0,1]$，存在 $\\delta_x>0$ 使 $f$ 在 $(x-\\delta_x,x+\\delta_x)$ 有界。', bad: null },
        { x: '结论：存在统一的 $\\delta>0$ 使 $f$ 在 $[0,1]$ 有界。', bad: null },
        { x: '证明：取 $\\delta=\\min\\{\\delta_x:x\\in[0,1]\\}$ 即可。', bad: 'quant', note: '军规三：$\\delta_x$ 的下标是连续统，「任意个正数的最小值」未必为正（未必存在）——$\\forall x\\exists\\delta$ 与 $\\exists\\delta\\forall x$ 是两个命题。正确武器是有限覆盖定理。' },
      ],
    },
    {
      id: 'au5', title: '辅助函数「鬼探头」',
      lines: [
        { x: '要证存在 $\\xi$ 使 $f\'(\\xi)+2\\xi f(\\xi)=0$。', bad: null },
        { x: '由题设条件及罗尔定理，存在 $\\xi$ 使结论成立。', bad: 'declare', note: '阅卷踩分点第 1 项（2-3 分）整步消失：辅助函数 $F(x)=e^{x^{2}}f(x)$ 必须另起一行「郑重其事」写出来并声明连续可导——直接喊罗尔等于没过程。' },
      ],
    },
    {
      id: 'au6', title: '柯西定理的隐藏分母',
      lines: [
        { x: '设 $f,g$ 在 $[a,b]$ 连续、$(a,b)$ 可导。', bad: null },
        { x: '由柯西中值定理，存在 $\\xi$ 使 $\\dfrac{f\'(\\xi)}{g\'(\\xi)}=\\dfrac{f(b)-f(a)}{g(b)-g(a)}$。', bad: 'premise', note: '柯西的入场券少验一条：$g\'(\\xi)\\ne 0$（且 $g(a)\\ne g(b)$）。不先证分母函数导数非零就套柯西——军规二在定理层面的版本。' },
        { x: '整理即得所要证。', bad: 'callback', note: '要领三：推出定理式后必须再一步把它翻译回题目原式——「整理即得」把最后的回扣分（1 分）丢了。' },
      ],
    },
  ]

  /* ════════════════════════ 6. 知识库：三大表数字卡（档案视图） ════════════════════════ */
  let TABLES = [
    {
      name: '触发表 · 看到什么条件，立刻想到什么桥', src: '讲义 1.1',
      rows: [
        ['闭区间连续 + 端点异号 / 端点等值', '零点定理 / 介值定理 / 罗尔定理', '第 3 章'],
        ['结论含 $f\'(\\xi)$ 且端点有等值条件', '罗尔定理 + 辅助函数', '第 4 章'],
        ['结论含 $f\'(\\xi)$ 或两点函数值', '拉格朗日 / 柯西中值定理', '第 5 章'],
        ['出现二阶及以上导数信息', '泰勒公式（选好展开点）', '第 6 章'],
        ['要证 $g(x)>0$ 型函数不等式', '单调性 / 极值法 / 常数变易', '第 7 章'],
        ['积分等式要证「存在 $\\xi$」', '构造变限积分 $F=\\int f$，用罗尔或零点', '第 8 章'],
        ['递推数列 $a_{n+1}=f(a_n)$', '单调有界准则，先猜极限再证', '第 2 章'],
      ],
    },
    {
      name: '辅助函数构造表 · 必须背熟', src: '讲义 4.2',
      rows: [
        ['$\\xi f\'(\\xi)+f(\\xi)=0$', '$F(x)=xf(x)$', '乘积导数 $(xf)\'$'],
        ['$\\xi f\'(\\xi)-2f(\\xi)=0$', '$F(x)=f(x)/x^{2}$', '商导数 $(f/x^{2})\'$'],
        ['$f\'(\\xi)+\\lambda f(\\xi)=0$', '$F(x)=e^{\\lambda x}f(x)$', '积分因子 $e^{\\lambda x}$'],
        ['$f\'(\\xi)+g(\\xi)f(\\xi)=0$', '$F(x)=e^{\\int g}f(x)$', '一般积分因子'],
        ['$f\'g-fg\'=0$', '$F(x)=f(x)/g(x)$', '商 $(f/g)\'$，先验 $g\\ne 0$'],
        ['$f\'(\\xi)=f(\\xi)/\\xi$', '$F(x)=f(x)/x$', '$(f/x)\'$ 的分子'],
        ['结论含 $f\'\'$ 或高阶信息', '泰勒展开（中点/最值点）', '拉格朗日余项'],
      ],
    },
    {
      name: '武器选择决策表 · 不等式的长相决定武器', src: '讲义 7.1',
      rows: [
        ['含参数 $x$，两边可移项作差', '单调性法', '令 $g$=左$-$右，验 $g(\\text{基点})=0$，判 $g\'$ 号'],
        ['导数变号、但极值好算', '极值法', '驻点比端点，证 $\\min g>0$'],
        ['两端都含参数（双变量）', '常数变易法', '固定一边为常数 $a$，化单变量'],
        ['结构对称（和、积、均值）', '凹凸性 / 均值不等式', '切线在下、弦在上（Jensen）'],
        ['两点函数值之差', '拉格朗日 + 放缩', '差 $=f\'(\\xi)(b-a)$，对 $f\'$ 放缩'],
        ['含 $e^{x}$、$\\ln(1+x)$ 等标杆函数', '泰勒 / 切线放缩', '$e^{x}\\ge 1+x$，$\\ln(1+x)\\le x$'],
      ],
    },
  ]

  /* 阅卷人视角：四大踩分点（军规关卡与 AI 点评共用口径） */
  let BLOCKS = [
    { k: 'declare', name: '构造与性质声明', pts: '2-3 分', tip: '另起一行令 $F=\\cdots$，并写明在哪个区间连续、可导。' },
    { k: 'premise', name: '定理前提逐条验证', pts: '2-3 分', tip: '罗尔三前提（连续/可导/端点等值）一条条写，没写=不会。' },
    { k: 'chain', name: '主体推理链条', pts: '3-4 分', tip: '从桥到目标式，每步有依据；除法先证分母非零（军规二）。' },
    { k: 'callback', name: '结论原样回扣', pts: '1 分', tip: '推出 $F\'(\\xi)=0$ 后再一步「即……」翻译回题目要证的式子。' },
  ]

  /* ════════════════════ 1.7 量化博弈（Lorenzen 对话语义 / Skolem 依赖）════════════════════
   * ∀∃ 顺序不是文法，是「谁先选」的游戏：对手先动，你的应答只能依赖已亮的牌。
   * 每题三回合：对手出招（x/ε 的具体值），你从候选应答里选——选「依赖了不该依赖的
   * 变量」的应答（比如 δ 看着 x 选）当场输，讲解直击量词病根。 */
  let QGAMES = [
    {
      id: 'qg1', law: '闭区间连续 ⇒ 一致连续（Heine–Cantor）',
      claim: '$\\forall\\varepsilon>0,\\ \\exists\\delta>0,\\ \\forall x,y\\in[0,1]:\\ |x-y|<\\delta\\Rightarrow|f(x)-f(y)|<\\varepsilon$',
      rounds: [
        { opp: '对手出 $\\varepsilon=0.1$——你的应答可以依赖什么？', opts: [
          { t: '$\\delta$ 只由 $\\varepsilon$ 定，全区间统一', ok: true },
          { t: '$\\delta$ 可以随点 $x$ 变', ok: false, why: '那是逐点连续的 δ(x,ε)——∀ε∃δ∀x 的顺序里 δ 在 ∀x 之前被选定，它不许偷看 x。' },
          { t: '$\\delta$ 由 $\\varepsilon$ 和具体的 $x,y$ 共同定', ok: false, why: '同上，且依赖了两点后选的量——量词表里它排在 δ 后面。' } ] },
        { opp: '在 $f(x)=x^2$、$\\varepsilon=0.1$ 下，$\\delta$ 取多少能全区间通吃？', opts: [
          { t: '$\\delta=0.05$', ok: true, why: '$|x^2-y^2|\\le 2|x-y|$（$[0,1]$ 上），$\\delta=\\varepsilon/2$ 通吃。' },
          { t: '$\\delta$ 取 $x$ 附近的局部值，逐点不同', ok: false, why: '一致连续的全部难度就在「统一」二字——逐点回答的是另一条命题。' },
          { t: '不存在这样的 $\\delta$', ok: false, why: 'Heine–Cantor 保证存在——闭区间连续是一致连续的入场券。' } ] },
        { opp: '换成开区间 $(0,1)$ 上的 $f(x)=1/x$，对手押注你输。为什么？', opts: [
          { t: '区间不闭：$x\\to 0$ 处曲线陡到没有统一的 $\\delta$', ok: true },
          { t: '$1/x$ 不连续', ok: false, why: '它在 $(0,1)$ 处处连续——塌的是「闭」这个条件，不是连续。' },
          { t: '$1/x$ 不可导', ok: false, why: '可导与否不是这条定理的语言。' } ] },
      ],
    },
    {
      id: 'qg2', law: '逐点收敛 ⇏ 一致收敛（换序资格赛）',
      claim: '$\\forall\\varepsilon,\\ \\exists N,\\ \\forall n\\ge N,\\ \\forall x:\\ |f_n(x)-f(x)|<\\varepsilon$ vs $\\forall\\varepsilon,\\ \\forall x,\\ \\exists N$',
      rounds: [
        { opp: '$f_n(x)=x^n$ 在 $[0,1]$：$N$ 能统一吗？', opts: [
          { t: '不能——$x$ 贴近 1 时收敛慢到没有全区间统一的 $N$', ok: true },
          { t: '能——逐点收敛给每个 x 都配了 N，取最大即可', ok: false, why: '「取最大」正是幻觉：N(x) 在 x→1 处无界——无穷个位置没有最大值。' },
          { t: '能——多项式总是表现良好', ok: false, why: '极限函数在 1 处跳变，连续函数列逐点收敛到不连续 ⇒ 必不一致。' } ] },
        { opp: '一致收敛买到了什么「换序资格」？', opts: [
          { t: '$\\lim\\int=\\int\\lim$、极限函数保持连续', ok: true },
          { t: '逐项积分永远合法，与收敛速度无关', ok: false, why: '逐点收敛时换序会翻车——$x^n$ 反例刚演示过。' },
          { t: '级数一定绝对收敛', ok: false, why: '一致收敛管的是「与极限交换」，不管绝对性。' } ] },
        { opp: '对手出招：$\\sum x^n/n$ 在端点 $x=1$。你的判断？', opts: [
          { t: '端点发散（调和级数），一致收敛在含 1 的区间免谈', ok: true },
          { t: '端点也收敛，$1^n/n\\to 0$', ok: false, why: '通项趋零只是级数收敛的必要条件——这是「项趋零⇒级数收敛」幻觉。' },
          { t: '与端点无关，看开区间就行', ok: false, why: '一致收敛的定义量词覆盖整个讨论域，端点正是 ∀x 的 x。' } ] },
      ],
    },
    {
      id: 'qg3', law: '极限定义的 ε–δ 对决',
      claim: '$\\lim_{x\\to a}f(x)=L:\\ \\forall\\varepsilon>0,\\exists\\delta>0,\\forall x:0<|x-a|<\\delta\\Rightarrow|f(x)-L|<\\varepsilon$',
      rounds: [
        { opp: '对手出 $\\varepsilon=10^{-6}$。你的 δ 可以依赖什么？', opts: [
          { t: '只能依赖 $\\varepsilon$（和函数本身）', ok: true },
          { t: '可以依赖 $x$——反正每个 x 都有对应邻域', ok: false, why: '∀x 在 ∃δ 之后——δ 先被选定，x 后入场；依赖 x 是顺序颠倒（军规三）。' },
          { t: '可以依赖 $a$ 以外的任意量', ok: false, why: 'a 是题目给定的中心点，依赖它合法；「任意量」里混进了 x 就违规。' } ] },
        { opp: '$f(x)=\\sin(1/x)$ 在 $x\\to 0$：对手赌你找不到 δ。成立吗？', opts: [
          { t: '成立——震荡使任何 ε<1 都无 δ 可应', ok: true, why: '这就是用定义证「极限不存在」的标准打法：挑一个 ε，证明任何 δ 都应不住。' },
          { t: '不成立——|sin|≤1 有界所以极限存在', ok: false, why: '有界是收敛的必要条件不是充分条件——震荡有界无极限是头号反例族。' },
          { t: '成立——因为 $1/x$ 无界', ok: false, why: '无界内层不是理由，理由在外层的震荡幅度不收缩。' } ] },
        { opp: '去掉 $0<|x-a|$（挖去中心点），定义会误伤哪个经典函数？', opts: [
          { t: '$f(a)$ 乱填也「极限存在」——挖点正是为了与 $f(a)$ 无关', ok: true },
          { t: '$|x-a|$ 会算不出来', ok: false, why: '计算无障碍，问题在语义：极限管的是趋近过程，不是该点取值。' },
          { t: '连续函数', ok: false, why: '连续函数带不带挖点极限都对——误伤的是「函数值与极限强绑」的幻觉。' } ] },
      ],
    },
  ]
  /** 量化博弈单回合判分 */
  function qgJudge(round, idx) {
    let o = round.opts[idx]
    return o ? { ok: !!o.ok, why: o.ok ? (o.why || '应答合法：依赖集干净。') : o.why } : { ok: false, why: '应答丢失' }
  }

  /* ════════════════════ 1.8 抽象阶梯（Polya：不会证就先证它的特化版）════════════════════
   * 每题可下潜一级：一般→特化（抽象条件换成具体函数），先赢一局再爬梯子。 */
  let LADDER = {
    bp1: { down: '特化：取 $f(x)=1-x$ 直接算出 $\\xi$——先看见 $(xf)\'$ 在具体函数上归零，再回一般情形', up: '推广：$\\xi f\'(\\xi)+kf(\\xi)=0$ 的构造怎么变？（乘 $x^k$——构造表的参数族）' },
    bp3: { down: '特化：$f(x)=2x-1$ 代入验证 $\\int_0^1 f=0$ 且零点在 $1/2$——变限积分桥在具体函数上的样子', up: '推广：$\\int_0^1 xf\\,dx=0$ 能证出什么零点？（双零点模型的入口）' },
    bp8: { down: '特化：$f(x)=x$ 时结论要 $f\'=f$ 即 $1=x$——$\\xi=1$ 恰在边界，体会「为什么需要介值找内点」', up: '推广：$f\'=\\lambda f$ 的辅助函数是 $e^{-\\lambda x}f$——参数化整行构造表' },
  }
  /** 同构签名：桥链（剔除军规步）排序后作结构指纹 */
  function chainSig(path) {
    return path.filter(function (k) { return k !== 'declare' && k !== 'nonzero' }).slice().sort().join('+')
  }
  /** 迁移检测：同签名但不同题的历史通关 */
  function transferOf(sessions, sig, ref) {
    let hit = null
    sessions.forEach(function (s) {
      if (s.mode === 'board' && s.detail && s.detail.sig === sig && s.ref !== ref) hit = s
    })
    return hit
  }

  /* ════════════════════ 1.9 MPS 命题骨架（模型检测的抽象表示）═════════════════════
   * Grushevsky/Kreitz 等：证明的本质骨架是「哪些命题被引用、推出什么」的拓扑，
   * 与具体函数无关。每题的 conds→goal 抽象成命题节点，路径=引用链。
   * 骨架模式库（5 种）——通关时识别你的路径命中哪种，档案里可看「你偏好哪种骨架」。 */
  let SKELETONS = [
    { k: 'sk-direct', name: '直接引用', pat: 'C → B → G', desc: '条件一步喂出目标：定理入场券全在题设里（bp2 零点、bp6 柯西）。' },
    { k: 'sk-construct', name: '构造中介', pat: 'C → M(新对象) → B → G', desc: '先造辅助函数 M 改写战场，再上桥——构造表的全部意义（bp1/bp3/bp8）。' },
    { k: 'sk-decompose', name: '目标分解', pat: 'G ← G1 ∧ G2（倒推）', desc: '把目标拆成两个子目标分别击破——双零点模型、极值+泰勒（bp4）。' },
    { k: 'sk-contradict', name: '反证骨架', pat: '¬G → 矛盾 → G', desc: '假设结论失败，与已知撞车——「至多一个」「无零点」类。' },
    { k: 'sk-induct', name: '归纳骨架', pat: 'Base + Step', desc: '命题对 n 成立：验证 n=1，再 n→n+1——递推数列有界性的归纳法。' },
  ]
  /** 骨架识别：按路径结构分类（declare/nonzero 是军规步不计入拓扑） */
  function skeletonOf(prob, path) {
    let core = path.filter(function (k) { return k !== 'declare' && k !== 'nonzero' })
    if (core.indexOf('contra') >= 0) return 'sk-contradict'
    if (core.indexOf('monoBound') >= 0 && core.length === 1) return 'sk-induct'
    if (core.length === 1) return 'sk-direct'
    /* 中介构造：路径里出现「产新对象」的桥（varInt 造 F、ivt 逼中间点） */
    let mediator = core.filter(function (k) { return k === 'varInt' || k === 'ivt' })
    if (mediator.length) return 'sk-construct'
    if (core.length >= 2) return 'sk-decompose'
    return 'sk-direct'
  }

  /* ════════════════════ 1.10 Pólya 启发式引擎（元搜索的形式化）══════════════════════
   * 启发式不是答案，是「下一步往哪看」。每条规则：触发条件（目标标签/池状态）→
   * 元动作。寻路板每步都跑一遍规则库，给「此刻最该做的动作」——这是把 Polya
   * 《怎样解题表》编译进搜索循环。 */
  let POLYA = [
    { k: 'p-lookback', when: function (prob, pool, path) { return path.length === 0 }, act: '未知先看图：结论长什么样？回触发表给目标贴标签（构造表/决策表二选一）。' },
    { k: 'p-aux', when: function (prob, pool, path) { return prob.goalEq && !pool.F && !pool.certify && path.length < 2 }, act: '结论是等式构造型——先发明辅助函数（下方发明器可直接验证你的 F）。' },
    { k: 'p-debt', when: function (prob, pool, path) { return path.length > 0 && !pool[prob.goal] }, act: '桥已上但目标未到：检查还欠的入场券（债务台账），缺什么就找能产它的桥。' },
    { k: 'p-regress', when: function (prob, pool, path) { return path.length >= 2 && !pool[prob.goal] }, act: '正向推了两步还没到——切换倒推：点「倒推」看什么桥能直接造出目标。' },
    { k: 'p-specialize', when: function (prob, pool, path) { return path.length >= 3 && !pool[prob.goal] }, act: '越推越远：下潜特化版（抽象阶梯按钮），在具体函数上看见骨架再回来。' },
    { k: 'p-debt-pay', when: function (prob, pool, path) { return false }, act: '' },
  ]
  function polyyaAdvice(prob, pool, path) {
    let hits = POLYA.filter(function (r) { return r.when(prob, pool, path) })
    return hits.slice(0, 2).map(function (r) { return r.act })
  }

  /* ════════════════════ 1.11 反例博弈（Skolem 游戏的对抗化）═══════════════════════
   * 量化博弈是「你当应答者」；反例博弈反过来——你当对手，专门找函数击穿命题。
   * 每题给 4 个候选函数，找出使命题为假的见证（确定性判据：每题预置答案+理由）。 */
  let CEGames = [
    {
      id: 'ce1', law: '「$f$ 连续可导且 $f\'(x)>0$ 处处成立 ⇒ $f$ 严格增」',
      pool: [
        { t: '$f(x)=x^3$（$f\'(0)=0$，不满足前提，不算）', ok: false, why: '它在 $f\'(0)=0$ 处违反了「处处 >0」的前提——反例必须满足前提而违反结论。' },
        { t: '本题无解：前提已锁死结论（拉格朗日中值直接给出）', ok: true, why: '对任意 $a<b$，$f(b)-f(a)=f\'(\\xi)(b-a)>0$——这是真定理，击穿它的尝试都会失败。认不出「不可反例」也是反例素养。' },
        { t: '$f(x)=x+\\sin x$（导数 $1+\\cos x\\ge 0$）', ok: false, why: '导数在 $x=\\pi$ 处为 0，不满足「处处 >0」——前提都没满足，不算反例。' },
        { t: '$f(x)=-x$', ok: false, why: '导数恒 -1，前提直接不满足。' },
      ],
    },
    {
      id: 'ce2', law: '「$f\'\'(x)>0$ ⇒ $f$ 在任意区间上 $\\max\\le$ 端点最大值（凸函数最大值在端点）」',
      pool: [
        { t: '$f(x)=x^2$ 在 $[-1,2]$：$\\max f=4$ 在端点 $x=2$', ok: false, why: '这正是定理本身的样貌——它支持命题，不是反例。' },
        { t: '$f(x)=-x^2$（$f\'\'=-2<0$）', ok: false, why: '凹凸方向反了，前提不满足。' },
        { t: '不存在反例：凸函数最大值必在端点（$f\'\'＞0$ 的几何含义）', ok: true, why: '弦在曲线上方——内部极大会破坏凸性。真命题的反例空间是空集。' },
        { t: '$f(x)=|x|$（不可导点）', ok: false, why: '$f\'\'$ 在 0 处不存在，前提不满足；且它仍是凸的，结论照旧成立。' },
      ],
    },
    {
      id: 'ce3', law: '「$\\lim f_n$ 存在且每个 $f_n$ 连续 ⇒ 极限函数连续」',
      pool: [
        { t: '$f_n(x)=x^n$ 在 $[0,1]$：极限函数在 $x=1$ 跳变', ok: true, why: '经典怪物：每个 $x^n$ 连续、逐点极限存在，但极限函数不连续——缺的正是「一致收敛」。反例的全部要素：满足前提、击穿结论。' },
        { t: '$f_n(x)=x/n$', ok: false, why: '极限函数 $\\equiv 0$ 连续——它不构成击穿。' },
        { t: '$f_n(x)=\\sin(nx)$', ok: false, why: '逐点极限根本不存在——前提就没满足。' },
        { t: '$f_n(x)=x^2/n^2$', ok: false, why: '极限 0 连续，同样打不穿。' },
      ],
    },
    {
      id: 'ce4', law: '「$f$ 在 $[a,b]$ 有界 ⇒ $f$ 可积」',
      pool: [
        { t: 'Dirichlet 函数：有界但处处不连续、不 Riemann 可积', ok: true, why: '有界只是可积的必要条件——「值域有界」与「振荡可控」是两回事，这是可积性最标准的怪物。' },
        { t: '$f(x)=1/x$ 在 $[0,1]$', ok: false, why: '它无界，前提不满足（而且反常积分另当别论）。' },
        { t: '$f(x)=x$ 在 $[0,1]$', ok: false, why: '连续必可积——它支持命题方向。' },
        { t: '存在这样的反例但考研不考', ok: false, why: 'Dirichlet 函数就在考研大纲边缘（可积判定的反例标配），「不考」不是数学理由。' },
      ],
    },
  ]

  /* ════════════════════ 1.12 证明美学度量（结构复杂度）══════════════════════════
   * 「最短 ≠ 最美」的形式化：好证明 = 步骤少 × 引理复用高 × 无特判堆砌。
   * 对路径打分：长度（eff）、是否走了「一步桥」（复用构造表的成品模式）、
   * 是否堆了重复桥（冗余=美感扣分）。输出 0-100 美学分 + 评语。 */
  function beautyOf(prob, path) {
    let core = path.filter(function (k) { return k !== 'declare' && k !== 'nonzero' })
    let dup = core.length !== new Set(core).size
    let len = core.length
    let score = clamp(Math.round(100 * (prob.best / Math.max(1, len)) - (dup ? 25 : 0)), 0, 100)
    let note
    if (score >= 95) note = '最短路径且无冗余——这就是阅卷人想看到的「漂亮」。'
    else if (dup) note = '有桥被重复使用：重复即冗余，好证明不回头。'
    else if (len > prob.best) note = '比最短路绕了 ' + (len - prob.best) + ' 步：能到，但不够凝练。'
    else note = '结构干净。'
    return { score: score, note: note, len: len, dup: dup }
  }

  /* ════════════════════ 1.13 数学实验引擎（数值先验证再证明）═══════════════════════
   * Zeberg/Polymath 式实验数学：对每题的结论做数值抽样验证——
   * 在具体函数族上随机取样，检查结论是否「实验成立」，并给出实验证据。
   * 目的不是替代证明，是建立「先猜后证」的直觉（Polya 的实验面）。 */
  let EXPERIMENTS = {
    bp1: {
      name: '乘积导数型 · 数值抽样',
      run: function () {
        /* 对 f(x)=1-x、sin(πx)、x(1-x) 等满足 f(1)=0 的函数，数值求 ξf'+f=0 的根 */
        let fns = [
          { f: function (x) { return 1 - x }, d: function (x) { return -1 } },
          { f: function (x) { return Math.sin(Math.PI * x) }, d: function (x) { return Math.PI * Math.cos(Math.PI * x) } },
          { f: function (x) { return x * (1 - x) }, d: function (x) { return 1 - 2 * x } },
        ]
        let rows = fns.map(function (g) {
          /* h(x)=x·f(x) 的导数 = f+xf'，在 [0.01,0.99] 网格找变号点 */
          let best = null
          for (let x = 0.01; x <= 0.99; x += 0.01) {
            let v = g.f(x) + x * g.d(x)
            if (best && best.v * v < 0) { best = { lo: best.x, hi: x, v: v, done: true }; break }
            if (!best || !best.done) best = { x: x, v: v }
          }
          return { fn: g.f(0.5).toFixed(2), hit: !!(best && best.done) }
        })
        return {
          verdict: rows.every(function (r) { return r.hit }) ? '三个具体函数上，方程 $xf\'(x)+f(x)=0$ 都在 $(0,1)$ 内找到变号根——实验支持结论。' : '有函数未命中变号——实验提示边界情形。',
          rows: rows.map(function (r, i) { return ['f' + (i + 1) + '(0.5)=' + r.fn, r.hit ? '找到根 ✓' : '未找到'] }),
          hint: '注意实验对象是 $h(x)=xf(x)$ 的零点存在（罗尔的数值影子）：$h(0)=0$，$h(1)=0$，内部 $h\'=0$ 即结论。',
        }
      },
    },
    bp3: {
      name: '变限积分桥 · 数值抽样',
      run: function () {
        /* f(x)=2x-1、cos(πx)、x²-1/3：∫₀¹f=0 时找 f 的零点 */
        let fns = [
          { f: function (x) { return 2 * x - 1 }, zero: 0.5 },
          { f: function (x) { return Math.cos(Math.PI * x) }, zero: 0.5 },
          { f: function (x) { return x * x - 1 / 3 }, zero: Math.sqrt(1 / 3) },
        ]
        let rows = fns.map(function (g, i) {
          let s = 0
          for (let x = 0; x < 1; x += 0.001) s += g.f(x) * 0.001
          return { i: i, int: s.toFixed(3), zero: g.zero.toFixed(3) }
        })
        return {
          verdict: '三个函数 $\\int_0^1 f\\approx 0$ 且都在 $(0,1)$ 内有零点——实验支持「平均值不悬空」。',
          rows: rows.map(function (r) { return ['f' + (r.i + 1) + '：$\\int\\approx$' + r.int, '零点 $\\xi\\approx$' + r.zero] }),
          hint: '反例思维：构造 $\\int f=0$ 但无零点的连续函数——做不到（这正是本题）。',
        }
      },
    },
    bp8: {
      name: 'f′=f 型 · 数值抽样',
      run: function () {
        /* f(x)=x（f'=1,找 f'=f 即 x=1 边界）、f=sin(πx/2)·? 用 h=e^{-x}f 找零点 */
        let fns = [
          { f: function (x) { return x }, d: function (x) { return 1 } },
          { f: function (x) { return x * x }, d: function (x) { return 2 * x } },
          { f: function (x) { return Math.exp(x) - 1 }, d: function (x) { return Math.exp(x) } },
        ]
        let rows = fns.map(function (g, i) {
          let hit = false
          let prev = null
          for (let x = 0.01; x <= 0.99; x += 0.01) {
            let v = g.d(x) - g.f(x)
            if (prev !== null && prev * v < 0) { hit = true; break }
            prev = v
          }
          return { i: i, hit: i === 2 ? false : hit }
        })
        return {
          verdict: '$f(x)=x$ 与 $x^2$ 在 $(0,1)$ 内 $f\'=f$ 无解——但注意它们不满足 $f(1)=1$ 的完整前提！实验的价值：暴露「前提缺一不可」。',
          rows: [['$f=x$：$f\'-f=1-x>0$ 不变号', '前提 $f(0)=0,f(1)=1$ 满足但 $f\'=f$ 无内点解？$x=1$ 在边界——介值逼内点正是证明的活'], ['$f=x^2$：$f(1)=1$ 满足，$2x=x^2$ 解 $x=2$ 出界', '同上：边界/出界正是需要构造的原因'], ['$f=e^x-1$：$f(1)=e-1\\ne 1$', '前提不满足，实验直接拒收']],
          hint: '实验数学第一课：数值失败往往不是定理错，是前提没喂饱。',
        }
      },
    },
  }


  /* ════════════════════════ 7. 数据闸 ════════════════════════ */
  function normSession(s) {
    if (!s || typeof s !== 'object') return null
    let mode = ['board', 'trigger', 'reasm', 'audit', 'monster', 'invent', 'calib', 'qgame', 'necessity', 'cegame'].indexOf(String(s.mode)) >= 0 ? String(s.mode) : 'board'
    return {
      id: String(s.id || ('pp-' + Date.now().toString(36))).slice(0, 24),
      at: clamp(num(s.at, Date.now()), 1, Infinity),
      mode: mode,
      score: clamp(num(s.score, 0), 0, 100),
      ref: String(s.ref || '').slice(0, 24),
      detail: (s.detail && typeof s.detail === 'object') ? {
        steps: clamp(num(s.detail.steps, 0), 0, 30),
        best: clamp(num(s.detail.best, 0), 0, 30),
        unused: clamp(num(s.detail.unused, 0), 0, 10),
        right: clamp(num(s.detail.right, 0), 0, 40),
        total: clamp(num(s.detail.total, 0), 0, 40),
        miss: String(s.detail.miss || '').slice(0, 80),
        cert: clamp(num(s.detail.cert, 0), 0, 1),
        debts: clamp(num(s.detail.debts, 0), 0, 10),
        hint: clamp(num(s.detail.hint, 0), 0, 4),
        sig: String(s.detail.sig || '').slice(0, 40),
        sk: String(s.detail.sk || '').slice(0, 16),
      } : null,
    }
  }
  function sessionsGet(ctx) {
    let arr = null
    try { arr = ctx.data('ppSessions') } catch (e) { return [] }
    if (!Array.isArray(arr)) return []
    return arr.map(normSession).filter(Boolean).slice(0, SESSION_MAX)
  }
  function sessionsSave(ctx, list) {
    let out = (list || []).slice(0, SESSION_MAX)
    try { ctx.data('ppSessions', out) } catch (e) { /* 隐私模式内存继续 */ }
    return out
  }

  /* ════════════════════════ 8. 纯引擎（测试直验） ════════════════════════ */
  /** 债务语义（v2.0）：桥卡照用，缺的前提挂债；后续标签到位自动清偿。
   *  返回 {debts:[{tag,bridge}], circular:[描述]} —— 用「欠着该债的桥」还该债 = 循环论证。 */
  function debtOf(prob, usedKeys) {
    let pool = {}
    prob.conds.forEach(function (c) { pool[c.t] = 1 })
    let debts = []
    let circular = []
    for (let i = 0; i < usedKeys.length; i++) {
      let m = M_BY_K[usedKeys[i]]
      if (!m) continue
      m.req.forEach(function (r) {
        if (r === 'anyGoal') return
        if (pool[r]) return
        /* 循环检测：这张桥自己也欠着 r，而它想产出的 out 里有没有能还 r 的？
         * 更狠的直接判据：该桥的 req 含某标签 T，而 T 的当前债主就是这张桥自己——
         * 即「用还没被证明的 T 去证 r」，而 r 又反过来被 T 需要。简化：同一张桥
         * 被重复使用且仍缺同一前提 = 原地打转。 */
        let dup = false
        for (let k = 0; k < i; k++) {
          if (usedKeys[k] === m.k && debts.some(function (d) { return d.bridge === m.k && d.tag === r })) dup = true
        }
        if (dup && !circular.some(function (c) { return c.indexOf(m.name) >= 0 })) {
          circular.push('「' + m.name + '」被重复使用仍缺「' + r + '」——你在用还没证出来的东西证明自己（循环论证）')
        }
        if (!debts.some(function (d) { return d.tag === r && d.bridge === m.k })) debts.push({ tag: r, bridge: m.k })
      })
      m.out.forEach(function (r) { pool[r] = 1 })
    }
    /* 自动清偿：pool 里已有的标签把债销掉 */
    return dischargeDebts(debts, pool, circular)
  }
  function dischargeDebts(debts, pool, circular) {
    let live = (debts || []).filter(function (d) { return !pool[d.tag] })
    return { debts: live, circular: circular || [] }
  }
  /** 发明器验证（v2.0 招牌）：用户自由写的 F(x) → 求导 → 与结论匹配 */
  function inventCheck(prob, fStr) {
    if (!prob.goalEq) return { ok: false, why: '本题结论不是等式构造型，没有「辅助函数」可发明——去拼图和关卡练它。' }
    let ast = parseExpr(fStr)
    if (ast.err) return { ok: false, why: ast.err }
    let dts = normTerms(diff(ast))
    let m = matchGoal(dts, prob.goalEq)
    m.dprime = ppTerms(dts)
    return m
  }
  /** 提示阶梯（四级渐进，逐级衰减） */
  function hintLadder(prob) {
    let route = (prob.routes[0] || []).filter(function (k) { return k !== 'declare' && k !== 'contra' })
    return [
      prob.ch + '——武器家族已经圈出来了',
      prob.anchor,
      '第一座桥：「' + ((M_BY_K[route[0]] || {}).name || '') + '」',
      '完整链：' + route.map(function (k) { return (M_BY_K[k] || {}).name || k }).join(' → '),
    ]
  }
  /** SRS：触发题抽取顺序——弱桥关联题整组优先（组内保持题序稳定），其余按掌握度升序 */
  function pickTrigOrder(mastery, now) {
    let weakBk = {}
    METHODS.forEach(function (m) {
      let v = mastery[m.k]
      if (v && v.m < 50) weakBk[m.k] = 1
    })
    let idx = TRIG_ITEMS.map(function (_, i) { return i })
    let weak = idx.filter(function (i) { return weakBk[TRIG_BK[i]] })
    let rest = idx.filter(function (i) { return !weakBk[TRIG_BK[i]] })
    rest.sort(function (a, b) {
      let ma = (mastery[TRIG_BK[a]] || {}).m
      let mb = (mastery[TRIG_BK[b]] || {}).m
      return (ma == null ? 50 : ma) - (mb == null ? 50 : mb)
    })
    return weak.concat(rest)
  }
  /** 掌握度更新（答对 +12 且推后 due；答错 -20 且立刻到期） */
  function masteryApply(mastery, bk, right, now) {
    let cur = mastery[bk] || { m: 50, due: 0 }
    let m = clamp(cur.m + (right ? 12 : -20), 0, 100)
    let gap = right ? Math.round(3 * Math.pow(2, m / 25)) * 86400000 : 86400000
    mastery[bk] = { m: m, due: now + gap }
    return mastery
  }
  /** 方法供给网络：前提→桥→目标 的边表 */
  function supplyGraph() {
    let prem = {}, goal = {}, edges = []
    METHODS.forEach(function (m) {
      m.req.forEach(function (r) {
        if (r === 'anyGoal') return
        prem[r] = 1
        edges.push({ from: r, to: m.k })
      })
      m.out.forEach(function (o) {
        goal[o] = 1
        edges.push({ from: m.k, to: o })
      })
    })
    return { prem: Object.keys(prem), goal: Object.keys(goal), edges: edges }
  }
  /** 个人证明病症诊断：未清偿债务 + 怪兽漏抓 + 关卡漏报 → 病根排行 */
  function diagnose(sessions, debtLog, monsterMiss) {
    let fam = {}
    let add = function (k, w) { fam[k] = (fam[k] || 0) + (w || 1) }
    ;(debtLog || []).forEach(function (t) {
      if (t === 'cont' || t === 'diff' || t === 'diff2') add('前提裸奔（连续/可导不验证）', 2)
      else if (t === 'eqEnd' || t === 'signDiff' || t === 'between') add('端点文章没做（等值/异号没算）', 2)
      else if (t === 'gNe0') add('除法不验分母（军规二缺失）', 3)
      else if (t === 'unifConv') add('换序没资格（一致收敛盲区）', 2)
      else add('构造链断环（' + t + ' 前提总缺）', 1)
    })
    ;(monsterMiss || []).forEach(function (t) { add('病理函数没见过（怪兽馆要补课）', 2) })
    sessions.forEach(function (s) {
      if (s.mode === 'audit' && s.score < 75) add('阅卷眼迟钝（排雷召回低）', 1)
      if (s.mode === 'board' && s.detail && s.detail.cert === 0) add('性质声明习惯未养成', 2)
    })
    let list = Object.keys(fam).map(function (k) { return { name: k, w: fam[k] } }).sort(function (a, b) { return b.w - a.w })
    return list.slice(0, 3)
  }
  /** 寻路计分（v2.0）：效率 55% + 覆盖 20% + 声明 15% + 债务清偿 10%，
   *  未清债务每条 -12（阅卷「没写=不会」的形式化），阶梯每用一级 -6，非法尝试第 2 次起 -8 */
  function pathScore(prob, usedKeys, illegal, opts) {
    opts = opts || {}
    let pool = {}
    prob.conds.forEach(function (c) { pool[c.t] = 1 })
    let used = 0
    let consumed = {}
    let ok = true
    for (let i = 0; i < usedKeys.length; i++) {
      let m = M_BY_K[usedKeys[i]]
      if (!m) { ok = false; break }
      used++
      m.req.forEach(function (r) { consumed[r] = 1 })
      m.out.forEach(function (r) { pool[r] = 1 })
    }
    let reached = !!pool[prob.goal]
    if (!ok || !reached) return { ok: false, reached: reached, score: 0, eff: 0, cover: 0, certified: false, used: used, debts: [], circular: [] }
    let dd = debtOf(prob, usedKeys)
    let unused = prob.conds.filter(function (c) { return !consumed[c.t] && c.t !== 'anyGoal' })
    let certified = !!pool.certify
    /* 「军规步」不算绕路：declare/nonzero 是义务清偿动作，eff 按剔除它们后的净步数计 */
    let ruleSteps = 0
    usedKeys.forEach(function (k) { if (k === 'declare' || k === 'nonzero') ruleSteps++ })
    let eff = Math.min(1, prob.best / Math.max(1, used - ruleSteps))
    let cover = prob.conds.length ? (prob.conds.length - unused.length) / prob.conds.length : 1
    let debtClear = dd.debts.length === 0 ? 1 : Math.max(0, 1 - dd.debts.length * 0.5)
    let score = Math.round(100 * (0.55 * eff + 0.2 * cover + (certified ? 0.15 : 0) + 0.1 * debtClear)
      - 8 * Math.max(0, (illegal || 0) - 1) - 6 * (opts.hintLevel || 0))
    return {
      ok: true, reached: true, score: clamp(score, 25, 100), eff: Math.round(eff * 100),
      cover: Math.round(cover * 100), certified: certified, used: used,
      unused: unused.map(function (u) { return u.x }), debts: dd.debts, circular: dd.circular,
      illegal: illegal || 0,
    }
  }
  /** 拼图计分：逐位比对 */
  function reasmScore(order, correct) {
    let hits = 0
    for (let i = 0; i < correct.length; i++) if (order[i] === correct[i]) hits++
    return { score: Math.round(100 * hits / Math.max(1, correct.length)), hits: hits, total: correct.length }
  }
  /** 军规关卡计分：F1（漏报比误报更伤——阅卷人视角漏雷=丢分） */
  function auditScore(marked, lines) {
    let truth = {}
    let nBad = 0
    lines.forEach(function (l, i) { if (l.bad) { truth[i] = 1; nBad++ } })
    let tp = 0, fp = 0
    marked.forEach(function (i) { if (truth[i]) tp++; else fp++ })
    let fn = nBad - tp
    let prec = tp + fp ? tp / (tp + fp) : (nBad ? 0 : 1)
    let rec = nBad ? tp / nBad : 1
    let f1 = prec + rec ? 2 * prec * rec / (prec + rec) : 0
    return {
      score: Math.round(100 * f1), prec: Math.round(prec * 100), recall: Math.round(rec * 100),
      tp: tp, fp: fp, fn: fn, nBad: nBad,
      missed: lines.map(function (l, i) { return { i: i, l: l, bad: l.bad } }).filter(function (x) { return x.bad && !marked.includes(x.i) }),
      falsePos: marked.filter(function (i) { return !truth[i] }),
    }
  }
  /** 跨场聚合 */
  function habitsOf(sessions) {
    if (!sessions || !sessions.length) return null
    let g = function (mode) { return sessions.filter(function (s) { return s.mode === mode }) }
    let avg = function (arr) { return arr.length ? Math.round(arr.reduce(function (a, s) { return a + s.score }, 0) / arr.length) : null }
    let board = g('board'), trig = g('trigger'), reasm = g('reasm'), audit = g('audit')
    let right = 0, total = 0
    trig.forEach(function (s) { if (s.detail) { right += s.detail.right; total += s.detail.total } })
    let weak = {}
    board.forEach(function (s) { if (s.detail && s.detail.miss) s.detail.miss.split(',').forEach(function (k) { if (k) weak[k] = (weak[k] || 0) + 1 }) })
    let weakList = Object.keys(weak).sort(function (a, b) { return weak[b] - weak[a] }).slice(0, 3)
    return {
      n: sessions.length,
      boardN: board.length, trigN: trig.length, reasmN: reasm.length, auditN: audit.length,
      boardAvg: avg(board), trigAvg: avg(trig), reasmAvg: avg(reasm), auditAvg: avg(audit),
      trigHit: total ? Math.round(100 * right / total) : null,
      weakList: weakList,
    }
  }
  function adviceFor(h, mode, score) {
    let out = []
    if (mode === 'board' && score != null) {
      if (score >= 90) out.push('寻路干净：一步不多，条件全用上了——这就是讲义说的「掌握触发表」。')
      else if (score >= 60) out.push('路走通了但绕了：回档案翻触发表，把「结论长相 → 桥」的映射再压一遍。')
      else out.push('路没走通或代价高：先背构造表七行（讲义原话「必须背熟」），再回来寻路。')
    }
    if (mode === 'trigger' && h && h.trigHit != null) {
      if (h.trigHit >= 85) out.push('触发命中率 ' + h.trigHit + '%：考场上看到结论就能条件反射，证明题已赢一半。')
      else out.push('触发命中率 ' + h.trigHit + '%：错的每题都回触发表找原行——不是记不住，是表没背穿。')
    }
    if (mode === 'reasm' && score != null) {
      if (score < 60) out.push('拼图错位多在「性质声明」与「回扣」：军规一要求声明在定理之前，要领三要求回扣收尾——这两个锚点先钉死。')
      else out.push('结构感在线：步骤顺序对了，写出来自然踩在得分点上。')
    }
    if (mode === 'audit' && score != null) {
      if (score >= 80) out.push('阅卷眼已上线：这些雷在别人的卷子上，就是你自己的失分点。')
      else out.push('漏雷=自己也会踩雷。把四条军规抄在草稿纸抬头，写证明时逐条对照。')
    }
    if (!out.length && h) out.push('总场次 ' + h.n + '：寻路 ' + (h.boardAvg == null ? '—' : h.boardAvg + '分') + ' / 触发 ' + (h.trigAvg == null ? '—' : h.trigAvg + '分') + ' / 拼图 ' + (h.reasmAvg == null ? '—' : h.reasmAvg + '分') + ' / 关卡 ' + (h.auditAvg == null ? '—' : h.auditAvg + '分') + '。')
    return out
  }

  /* ════════════════════════ 9. 样式（ctx.css.add 单例注入） ════════════════════════ */
  let CSS = [
    /* 令牌：root + 模态 + 面板三声明（浮窗面板不 mount 也要有皮） */
    '.pp-root,.pp-modal,.pp-panel{--pp-acc:#7c3aed;--pp-acc2:#a78bfa;--pp-gold:#c9932c;--pp-ink:var(--text-primary,#1e2a4a);'
      + '--pp-sub:var(--text-muted,#7c8aa8);--pp-ink2:var(--text-secondary,#4a5670);--pp-line:var(--line,#d8dde8);'
      + '--pp-bg:var(--surface,#fff);--pp-soft:var(--surface-muted,#f6f8fc);--pp-ok:var(--ok,#0f7c4a);'
      + '--pp-warn:var(--warn,#c47615);--pp-danger:var(--danger,#d83b3b);--pp-on-acc:#fff;--pp-acc-text:var(--pp-acc);'
      + '--pp-ease:cubic-bezier(.22,.8,.26,1)}',
    'html[data-theme="night"] .pp-root,html[data-theme="night"] .pp-modal,html[data-theme="night"] .pp-panel{'
      + '--pp-acc:var(--nk-acc,#f0b95a);--pp-acc2:#e2a43f;--pp-gold:#f0b95a;--pp-on-acc:var(--nk-acc-ink,#2a1c04);--pp-acc-text:var(--nk-acc,#f0b95a)}',
    'html[data-theme="gold"] .pp-root,html[data-theme="gold"] .pp-modal,html[data-theme="gold"] .pp-panel{'
      + '--pp-acc:#b45309;--pp-acc2:#d9820a;--pp-on-acc:#fff;--pp-acc-text:#9a5407}',
    /* width:100% + border-box：负 margin 外扩时，百分比宽度只按 content box 算，
     * 不写这两行 root 会比视口宽出左右 padding 之和（390px 巡检实测 422>390） */
    '.pp-root{box-sizing:border-box;width:100%;color:var(--pp-ink);font:14px/1.65 "PingFang SC","Microsoft YaHei",system-ui,sans-serif;'
      + 'margin:calc(var(--vp-t,16px)*-1) calc(var(--vp-x,16px)*-1) calc(var(--vp-b,24px)*-1);'
      + 'min-height:calc(100vh - 59px);display:flex;flex-direction:column;background:var(--pp-soft)}',
    '.pp-hero{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:14px;flex-wrap:wrap;min-width:0;'
      + 'padding:14px var(--vp-x,16px);background:color-mix(in srgb,var(--pp-soft) 84%,transparent);'
      + 'backdrop-filter:blur(14px);border-bottom:1px solid color-mix(in srgb,var(--pp-line) 60%,transparent)}',
    '.pp-hero.stuck{box-shadow:0 10px 26px -18px rgba(15,23,42,.4)}',
    '.pp-mark{width:42px;height:42px;border-radius:12px;flex:0 0 auto;display:grid;place-items:center;'
      + 'color:var(--pp-on-acc);background:linear-gradient(135deg,var(--pp-acc),var(--pp-acc2));box-shadow:0 8px 18px -8px color-mix(in srgb,var(--pp-acc) 70%,transparent)}',
    '.pp-mark svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}',
    '.pp-brandtx{display:flex;flex-direction:column;line-height:1.2}',
    '.pp-kicker{font-size:10px;letter-spacing:.22em;color:var(--pp-sub);text-transform:uppercase}',
    '.pp-brandtx b{font-size:19px;font-weight:800}',
    '.pp-vtag{font-size:10px;color:var(--pp-sub);border:1px solid var(--pp-line);border-radius:6px;padding:1px 6px;margin-left:6px;vertical-align:2px}',
    '.pp-kpis{display:flex;gap:8px;margin-left:auto;flex-wrap:wrap}',
    '.pp-kpi{display:flex;flex-direction:column;align-items:center;min-width:56px;padding:0 10px;border-left:1px solid var(--pp-line)}',
    '.pp-kpi b{font-size:17px;font-weight:800;line-height:1.2}.pp-kpi i{font-style:normal;font-size:9px;letter-spacing:.08em;color:var(--pp-sub)}',
    '.pp-kpi.ok b{color:var(--pp-ok)}.pp-kpi.warn b{color:var(--pp-warn)}',
    '.pp-btn{height:34px;padding:0 16px;border-radius:999px;border:1px solid var(--pp-line);'
      + 'background:var(--pp-bg);color:var(--pp-ink);font:600 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;gap:7px;'
      + 'transition:all .16s var(--pp-ease);white-space:nowrap}',
    '.pp-btn:hover{border-color:var(--pp-acc);color:var(--pp-acc-text)}',
    '.pp-btn.primary{background:linear-gradient(135deg,var(--pp-acc),var(--pp-acc2));color:var(--pp-on-acc);border-color:transparent;'
      + 'box-shadow:0 8px 16px -8px color-mix(in srgb,var(--pp-acc) 70%,transparent)}',
    '.pp-btn.ghost{background:none;border-style:dashed}',
    '.pp-btn.sm{height:30px;padding:0 11px;font-size:12px}',
    /* 禁用态纪律（night-skin C 组）：不许 opacity 压暗——暗底上半透明会整块消失，
     * 退到 --pp-sub 语义色才既读得出又明确「此刻不可用」 */
    '.pp-btn:disabled{opacity:1;cursor:not-allowed;color:var(--pp-sub);border-color:var(--pp-line);'
      + 'background:color-mix(in oklab,var(--pp-ink) 6%,transparent);box-shadow:none;transform:none}',
    /* 全局图标纪律（fv 912px / pp 348px 两次教训）：内联 SVG 没有尺寸约束时按 viewBox 比例铺开撑爆容器 */
    '.pp-btn svg,.pp-verdict svg,.pp-empty .ico svg,.pp-fld svg,.pp-arrowcol svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.9;flex:0 0 auto}',
    '.pp-arrowcol svg{width:20px;height:20px}',
    '.pp-stage{width:100%;max-width:var(--pp-w,1120px);margin:0 auto;padding:6px var(--vp-x,16px) 152px;flex:1}',
    '.pp-card{background:var(--pp-bg);border:1px solid var(--pp-line);border-radius:16px;padding:18px 20px;'
      + 'margin-bottom:14px;box-shadow:0 12px 30px -24px rgba(15,23,42,.28)}',
    '.pp-card-h{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:12px;padding-bottom:9px;'
      + 'border-bottom:1px solid color-mix(in srgb,var(--pp-line) 55%,transparent)}',
    '.pp-card-h b{font-size:16px}.pp-card-h em{font-style:normal;font-size:11.5px;color:var(--pp-sub)}',
    '.pp-quiet{font-size:12px;color:var(--pp-sub);line-height:1.7}',
    '.pp-acts{display:flex;gap:9px;flex-wrap:wrap;margin-top:12px}',
    '.pp-input{height:36px;border:1px solid var(--pp-line);border-radius:10px;padding:0 11px;background:var(--pp-bg);'
      + 'color:var(--pp-ink);outline:none;font:inherit;font-size:13.5px;width:100%}',
    '.pp-input:focus{border-color:var(--pp-acc);box-shadow:0 0 0 3px color-mix(in srgb,var(--pp-acc) 16%,transparent)}',
    'textarea.pp-input{height:auto;min-height:70px;padding:9px 11px;resize:vertical;line-height:1.6}',
    /* 题源/篇目选择条：窄屏真能横滑。min-width:0 是 flex 子项防撑爆的命门——
     * 只写 max-width 时，inline-flex 容器的 min-content 会被内部 nowrap 按钮串顶开
     * （390 巡检定位器实锤：seg 顶出 789px） */
    '.pp-seg{display:inline-flex;min-width:0;max-width:100%;overflow-x:auto;scrollbar-width:none;background:var(--pp-soft);'
      + 'border:1px solid var(--pp-line);border-radius:12px;padding:3px;gap:2px}',
    '.pp-seg button{border:0;background:none;font:600 12px/1 inherit;padding:7px 12px;border-radius:8px;cursor:pointer;color:var(--pp-ink2);white-space:nowrap}',
    '.pp-seg button.on{background:var(--pp-bg);color:var(--pp-ink);box-shadow:0 1px 4px rgba(16,30,60,.12)}',
    /* flex 行里放横滑条的命门：包裹 span 必须 flex:1+min-width:0，inline-flex 条自身必须 width:0 起步——
     * 否则条按 min-content（全部 nowrap 按钮之和）撑爆祖先（390 巡检定位器实锤 789px） */
    '.pp-pickwrap{flex:1;min-width:0;display:flex}',
    '.pp-pickwrap .pp-seg{width:0;min-width:100%}',
    /* 寻路板 */
    '.pp-board{display:grid;grid-template-columns:minmax(230px,1fr) 56px minmax(230px,1fr);gap:12px;align-items:stretch}',
    '.pp-col{display:flex;flex-direction:column;gap:8px;min-width:0}',
    '.pp-col-h{font-size:10.5px;letter-spacing:.16em;color:var(--pp-sub);text-transform:uppercase}',
    /* 长 LaTeX 串（不可断字符）不许把 grid/flex 子项顶爆：min-width:0 + word-break（390px 巡检） */
    '.pp-node{border:1px solid var(--pp-line);border-radius:12px;padding:9px 12px;background:var(--pp-soft);font-size:12.5px;line-height:1.55;min-width:0;word-break:break-word}',
    '.pp-node .tg{display:inline-block;font:700 9.5px/1 ui-monospace,Consolas,monospace;color:var(--pp-acc-text);'
      + 'border:1px solid color-mix(in srgb,var(--pp-acc) 40%,transparent);border-radius:5px;padding:2px 5px;margin-right:6px;vertical-align:1px}',
    '.pp-node.goal{border-color:color-mix(in srgb,var(--pp-acc) 55%,transparent);background:color-mix(in srgb,var(--pp-acc) 7%,var(--pp-bg))}',
    '.pp-node.reached{border-color:var(--pp-ok);background:color-mix(in srgb,var(--pp-ok) 9%,var(--pp-bg))}',
    '.pp-arrowcol{display:grid;place-items:center;color:var(--pp-sub);font-size:20px}',
    '.pp-bridgebank{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}',
    '.pp-bridge{border:1px solid var(--pp-line);border-radius:10px;padding:7px 11px;background:var(--pp-bg);cursor:pointer;'
      + 'font:600 12px/1.3 inherit;color:var(--pp-ink2);display:inline-flex;flex-direction:column;gap:3px;transition:all .15s var(--pp-ease)}',
    '.pp-bridge:hover{border-color:var(--pp-acc);color:var(--pp-acc-text);transform:translateY(-1px)}',
    '.pp-bridge .req{font-size:10px;color:var(--pp-sub);font-weight:500}',
    '.pp-bridge.dim{opacity:.4;pointer-events:none}',
    '.pp-path{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:12px;min-height:30px}',
    '.pp-pathchip{border-radius:999px;padding:5px 12px;font-size:12px;font-weight:600;background:color-mix(in srgb,var(--pp-acc) 12%,var(--pp-bg));'
      + 'color:var(--pp-acc-text);border:1px solid color-mix(in srgb,var(--pp-acc) 35%,transparent)}',
    '.pp-pathsep{color:var(--pp-sub)}',
    '.pp-pool{display:flex;flex-wrap:wrap;gap:5px;margin-top:10px}',
    '.pp-pooltag{font:600 10.5px/1 ui-monospace,Consolas,monospace;border-radius:6px;padding:4px 7px;'
      + 'background:var(--pp-soft);border:1px solid var(--pp-line);color:var(--pp-ink2)}',
    '.pp-pooltag.new{border-color:var(--pp-ok);color:var(--pp-ok)}',
    /* 触发速答 */
    '.pp-tq{font-size:15px;font-weight:600;line-height:1.6;margin-bottom:12px}',
    '.pp-topts{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:8px}',
    '.pp-topt{border:1px solid var(--pp-line);border-radius:11px;padding:10px 13px;background:var(--pp-bg);cursor:pointer;'
      + 'font-size:13px;text-align:left;color:var(--pp-ink);transition:all .15s var(--pp-ease);line-height:1.5}',
    '.pp-topt:hover{border-color:var(--pp-acc)}',
    '.pp-topt.right{border-color:var(--pp-ok);background:color-mix(in srgb,var(--pp-ok) 9%,var(--pp-bg))}',
    '.pp-topt.wrong{border-color:var(--pp-danger);background:color-mix(in srgb,var(--pp-danger) 7%,var(--pp-bg))}',
    '.pp-timer{font:700 22px/1 ui-monospace,Consolas,monospace;color:var(--pp-ink)}',
    '.pp-timer.low{color:var(--pp-danger)}',
    '.pp-streak{font-size:12px;color:var(--pp-sub)}',
    /* 拼图 */
    '.pp-pieces{display:flex;flex-direction:column;gap:7px}',
    '.pp-piece{border:1px solid var(--pp-line);border-radius:11px;padding:10px 13px;background:var(--pp-bg);cursor:pointer;'
      + 'font-size:12.5px;line-height:1.6;text-align:left;color:var(--pp-ink);transition:all .15s var(--pp-ease);word-break:break-word}',
    '.pp-piece:hover{border-color:var(--pp-acc);transform:translateX(2px)}',
    '.pp-piece.taken{opacity:.32;pointer-events:none}',
    '.pp-slotrow{display:flex;gap:7px;align-items:center;margin-bottom:7px}',
    '.pp-slotn{width:22px;height:22px;border-radius:50%;flex:0 0 auto;display:grid;place-items:center;'
      + 'background:color-mix(in srgb,var(--pp-acc) 14%,transparent);color:var(--pp-acc-text);font:700 11px/1 ui-monospace,monospace}',
    '.pp-slot{flex:1;min-width:0;border:1px dashed var(--pp-line);border-radius:10px;padding:8px 12px;font-size:12px;color:var(--pp-sub);min-height:20px;line-height:1.55;word-break:break-word}',
    '.pp-slot.filled{border-style:solid;color:var(--pp-ink);background:var(--pp-soft)}',
    '.pp-slot.badpos{border-color:var(--pp-danger);color:var(--pp-danger)}',
    /* 军规关卡 */
    '.pp-proofline{border:1px solid transparent;border-left:3px solid var(--pp-line);border-radius:8px;padding:8px 12px;'
      + 'font-size:13px;line-height:1.65;cursor:pointer;background:var(--pp-bg);margin-bottom:5px;transition:all .14s var(--pp-ease);word-break:break-word;min-width:0}',
    '.pp-proofline:hover{background:var(--pp-soft)}',
    '.pp-proofline.marked{border-left-color:var(--pp-danger);background:color-mix(in srgb,var(--pp-danger) 6%,var(--pp-bg))}',
    '.pp-proofline.reveal-bad{border-left-color:var(--pp-danger);background:color-mix(in srgb,var(--pp-danger) 9%,var(--pp-bg))}',
    '.pp-proofline.reveal-ok{border-left-color:var(--pp-ok)}',
    '.pp-lineno{font:600 10px/1 ui-monospace,monospace;color:var(--pp-sub);margin-right:8px}',
    /* 判定/结果卡 */
    '.pp-verdict{border-radius:13px;padding:13px 16px;font-size:13px;line-height:1.7;margin-top:12px;'
      + 'background:var(--pp-soft);border:1px solid var(--pp-line);display:flex;gap:10px;align-items:flex-start}',
    '.pp-verdict.ok{border-color:color-mix(in srgb,var(--pp-ok) 45%,transparent);background:color-mix(in srgb,var(--pp-ok) 7%,var(--pp-bg))}',
    '.pp-verdict.rev{border-color:color-mix(in srgb,var(--pp-danger) 40%,transparent);background:color-mix(in srgb,var(--pp-danger) 5%,var(--pp-bg))}',
    '.pp-big{font:800 34px/1.1 Georgia,serif;color:var(--pp-acc-text)}',
    '.pp-bignum{font-family:Georgia,serif;font-size:38px;font-weight:800;line-height:1}',
    /* 档案表卡 */
    '.pp-tablecard{border:1px solid var(--pp-line);border-radius:13px;overflow:hidden;margin-bottom:12px}',
    '.pp-tablecard th,.pp-tablecard td{text-align:left;padding:8px 12px;font-size:12px;border-bottom:1px solid color-mix(in srgb,var(--pp-line) 50%,transparent);vertical-align:top;line-height:1.55}',
    '.pp-tablecard th{background:var(--pp-soft);font-size:10.5px;letter-spacing:.1em;color:var(--pp-sub)}',
    '.pp-tablecard tr:last-child td{border-bottom:0}',
    '.pp-ledger-row{display:flex;gap:10px;align-items:center;padding:8px 2px;border-bottom:1px dashed color-mix(in srgb,var(--pp-line) 55%,transparent);font-size:12.5px}',
    '.pp-ledger-row .mode{font:700 10px/1 ui-monospace,monospace;border-radius:5px;padding:3px 6px;background:var(--pp-soft);border:1px solid var(--pp-line);color:var(--pp-ink2)}',
    '.pp-ledger-row .sc{margin-left:auto;font:800 15px/1 Georgia,serif}',
    '.pp-ledger-row .sc.ok{color:var(--pp-ok)}.pp-ledger-row .sc.mid{color:var(--pp-warn)}.pp-ledger-row .sc.low{color:var(--pp-danger)}',
    '.pp-empty{text-align:center;padding:34px 18px;color:var(--pp-sub)}',
    '.pp-empty .ico{display:inline-grid;place-items:center;width:52px;height:52px;border-radius:16px;background:var(--pp-soft);border:1px solid var(--pp-line);margin-bottom:10px}',
    '.pp-empty b{display:block;font-size:15px;color:var(--pp-ink);margin-bottom:4px}',
    /* 底部 dock：玻璃胶囊 + 滑动指示（站内 isleDock 同款） */
    '.pp-dockwrap{position:fixed;left:0;right:0;bottom:0;z-index:40;display:flex;justify-content:center;padding:0 14px 12px;pointer-events:none}',
    '.pp-dock{position:relative;display:flex;gap:2px;padding:6px;pointer-events:auto;border-radius:19px;'
      + 'background:color-mix(in srgb,var(--pp-bg) 82%,transparent);backdrop-filter:blur(16px) saturate(1.2);'
      + '-webkit-backdrop-filter:blur(16px) saturate(1.2);border:1px solid var(--pp-line);'
      + 'box-shadow:0 14px 38px -18px rgba(15,23,42,.4)}',
    '.pp-dock-ind{position:absolute;top:6px;bottom:6px;left:6px;width:10px;border-radius:13px;'
      + 'background:color-mix(in srgb,var(--pp-acc) 16%,transparent);'
      + 'transition:transform .32s cubic-bezier(.22,1,.36,1),width .32s cubic-bezier(.22,1,.36,1)}',
    '.pp-dock-item{position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;min-width:76px;'
      + 'padding:8px 14px;border:0;border-radius:13px;background:none;color:var(--pp-sub);font-size:11.5px;'
      + 'font-weight:600;cursor:pointer;transition:color .18s}',
    /* nowrap 打在基线：CJK min-content=1 字，flex 压缩必折行（2026-11-12 巡检教训） */
    '.pp-dock-item em{font-style:normal;white-space:nowrap}',
    '.pp-dock-item svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.7}',
    '.pp-dock-item.on{color:var(--pp-acc-text)}',
    /* v2.0 概念层样式 */
    '.pp-conbar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}',
    '.pp-conbar.v21{margin-top:10px}',
    '.pp-con{font-size:11px;color:var(--pp-ink2);background:var(--pp-bg);border:1px solid var(--pp-line);'
      + 'border-radius:999px;padding:5px 12px}.pp-con b{color:var(--pp-acc-text)}',
    '.pp-debts{margin-top:10px;display:flex;flex-direction:column;gap:6px}',
    '.pp-debt{display:flex;gap:8px;align-items:flex-start;font-size:12.5px;padding:9px 12px;border-radius:10px;'
      + 'border-left:3px solid var(--pp-warn);background:color-mix(in srgb,var(--pp-warn) 7%,var(--pp-bg));color:var(--pp-ink2)}',
    '.pp-debt.circ{border-left-color:var(--pp-danger);background:color-mix(in srgb,var(--pp-danger) 7%,var(--pp-bg))}',
    '.pp-debt svg{width:14px;height:14px;flex:0 0 auto;margin-top:2px;fill:none;stroke:currentColor;stroke-width:1.9}',
    '.pp-debt button{margin-left:auto}',
    '.pp-mastery{display:flex;flex-direction:column;gap:7px}',
    '.pp-mrow{display:flex;align-items:center;gap:10px;font-size:12px}',
    '.pp-mname{width:110px;flex:0 0 auto;color:var(--pp-ink2)}',
    '.pp-mbar{flex:1;height:8px;border-radius:4px;background:var(--pp-soft);border:1px solid var(--pp-line);overflow:hidden}',
    '.pp-mbar i{display:block;height:100%;background:linear-gradient(90deg,var(--pp-acc),var(--pp-acc2))}',
    '.pp-mnum{width:34px;text-align:right;font:700 12px/1 ui-monospace,Consolas,monospace;color:var(--pp-ink)}',
    '.pp-net text{font-size:10px;fill:var(--pp-ink2)}',
    '.pp-net .pp-net-lab{font-family:ui-monospace,Consolas,monospace;fill:var(--pp-sub)}',
    '.pp-net .pp-net-b text{font-size:10.5px;font-weight:600;fill:var(--pp-ink)}',
    /* v2.2 概念层：启发式条 / 骨架+美学 / 实验行 */
    '.pp-polya{display:flex;gap:9px;align-items:flex-start;margin-top:12px;padding:11px 14px;border-radius:12px;'
      + 'border:1px dashed color-mix(in srgb,var(--pp-acc) 45%,transparent);background:color-mix(in srgb,var(--pp-acc) 5%,var(--pp-bg));font-size:12.5px;color:var(--pp-ink2)}',
    '.pp-polya svg{width:15px;height:15px;flex:0 0 auto;margin-top:2px;fill:none;stroke:var(--pp-acc-text);stroke-width:1.9}',
    '.pp-polya-line{margin-top:3px;line-height:1.6}',
    '.pp-skrow{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px}',
    '.pp-skchip{font:600 11.5px/1 ui-monospace,Consolas,monospace;color:var(--pp-acc-text);'
      + 'border:1px solid color-mix(in srgb,var(--pp-acc) 40%,transparent);border-radius:999px;padding:5px 11px;'
      + 'background:color-mix(in srgb,var(--pp-acc) 7%,var(--pp-bg))}',
    '.pp-beauty{font:700 12px/1 Georgia,serif;padding:5px 10px;border-radius:999px;border:1px solid var(--pp-line)}',
    '.pp-beauty.ok{color:var(--pp-ok);border-color:color-mix(in srgb,var(--pp-ok) 45%,transparent)}',
    '.pp-beauty.mid{color:#b45309}',
    '.pp-beauty.low{color:var(--pp-danger)}',
    '.pp-exrows{display:flex;flex-direction:column;gap:4px;margin-top:8px}',
    '.pp-exrow{display:flex;gap:12px;align-items:baseline;font-size:12.5px;line-height:1.6}',
    '.pp-exrow span:first-child{flex:0 0 auto}',
    /* 常驻面板 */
    '.pp-panel{font:13px/1.6 "PingFang SC","Microsoft YaHei",system-ui,sans-serif;color:var(--text-primary,#1b2430);padding:2px}',
    '.pp-panel-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}',
    '.pp-panel-kpis div{border-bottom:1px solid var(--line,#e5e7eb);padding:2px 0 6px}',
    '.pp-panel-kpis b{display:block;font-family:Georgia,serif;font-size:20px;line-height:1.2}',
    '.pp-panel-kpis span{font-size:9.5px;letter-spacing:.1em;color:var(--text-muted,#6b7788)}',
    '.pp-panel-list{display:flex;flex-direction:column}',
    '.pp-panel-row{display:flex;align-items:center;gap:8px;font-size:12px;padding:7px 0;border-bottom:1px solid var(--line,#e5e7eb)}',
    '.pp-panel-row span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.pp-panel-row i{font-style:normal;flex:0 0 auto;font-size:10.5px}',
    /* 警告字色：日间深琥珀 #b45309（5.0:1），夜间才接 --warn（night-skin 纪律） */
    '.pp-panel-row i.warn{color:#b45309}.pp-panel-row i.ok{color:var(--ok,#0f7c4a)}',
    'html[data-theme="night"] .pp-panel-row i.warn{color:var(--warn,#e8ae3f)}',
    '.pp-panel-empty{font-size:12px;color:var(--text-muted,#6b7788);padding:10px 0}',
    /* 覆盖层放最后（同特异性后写者胜） */
    '@media (max-width:760px){.pp-btn.sm{height:30px}.pp-brandtx b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
      + '.pp-dock-item{min-width:0;flex:1;padding:7px 2px}'
      + '.pp-dock-item em{font-size:9.5px}.pp-brandtx b{font-size:17px}.pp-kicker{display:none}'
      + '.pp-board{grid-template-columns:1fr}.pp-arrowcol{transform:rotate(90deg);height:26px}'
      + '.pp-topts{grid-template-columns:1fr}.pp-bignum{font-size:30px}.pp-stage{padding-bottom:162px}}',
    'html[data-theme="night"] .pp-seg button.on{background:color-mix(in srgb,var(--pp-bg) 70%,transparent)}',
    'html[data-theme="night"] .pp-dock-item.on{filter:brightness(1.8) saturate(.82)}',
  ].join('\n')

  function injectStyles() {
    let host = window.__PP_HOST_CTX
    if (host && host.css && typeof host.css.add === 'function') { host.css.add(CSS, 'skin'); return }
    let st = document.getElementById(STYLE_ID)
    if (st) { if (st.textContent !== CSS) st.textContent = CSS; return }
    st = document.createElement('style')
    st.id = STYLE_ID
    st.textContent = CSS
    document.head.appendChild(st)
  }

  /* ════════════════════════ 10. 图标 ════════════════════════ */
  function I(name) {
    let P = {
      compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2.2 5-5 2.2 2.2-5z"/>',
      bolt: '<path d="M13 2 4.5 13.5H11L9.5 22 19 9.5h-6.5z"/>',
      grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
      puzzle: '<path d="M9 4a2 2 0 1 1 4 0v1h3a1 1 0 0 1 1 1v3h-1a2 2 0 1 0 0 4h1v3a1 1 0 0 1-1 1h-4v-1a2 2 0 1 0-4 0v1H4a1 1 0 0 1-1-1v-4h1a2 2 0 1 0 0-4H3V6a1 1 0 0 1 1-1h5z"/>',
      shield: '<path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z"/><path d="M9.5 12l1.8 1.8 3.4-3.6"/>',
      chart: '<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',
      down: '<path d="M12 3v12M6 11l6 6 6-6M4 21h16"/>',
      cross: '<path d="M6 6l12 12M18 6L6 18"/>',
      bulb: '<path d="M9.5 18h5M10.5 21h3M12 3a6 6 0 0 1 3.5 10.8c-.8.6-1.2 1.5-1.3 2.2h-4.4c-.1-.7-.5-1.6-1.3-2.2A6 6 0 0 1 12 3z"/>',
      check: '<path d="M5 13l4 4L19 7"/>',
      clock: '<circle cx="12" cy="12" r="8.6"/><path d="M12 7.4V12l3.1 1.9"/>',
      arrow: '<path d="M4 12h14M13 6l6 6-6 6"/>',
      robot: '<rect x="5" y="8" width="14" height="10" rx="2.5"/><path d="M12 8V4M8.5 13h.01M15.5 13h.01M9 16.5h6"/><path d="M3 12v3M21 12v3"/>',
      book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v18H6.5A2.5 2.5 0 0 1 4 18.5z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v18h4.5a2.5 2.5 0 0 0 2.5-2.5z"/>',
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (P[name] || P.compass) + '</svg>'
  }
  let MARK_TILE = '<span class="pp-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2.2 5-5 2.2 2.2-5z"/></svg></span>'
  /* manifest icon 必须自包含 SVG（rawIcon 白名单只认 svg 标签） */
  let MARK_ICON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2.2 5-5 2.2 2.2-5z"/></svg>'

  /* ════════════════════════ 11. 视图（模块级纯函数，(ctx,S) 入参） ════════════════════════ */
  function heroHTML(ctx, S) {
    let h = habitsOf(S.sessions)
    let today = dkey()
    let todayN = 0
    S.sessions.forEach(function (s) { if (dkey(s.at) === today) todayN++ })
    return '<header class="pp-hero" id="pp-hero">'
      + '<div class="pp-brand">' + MARK_TILE
      + '<div class="pp-brandtx"><span class="pp-kicker">PROOF · PATHFINDER</span><b>证明寻路者<span class="pp-vtag">v' + VERSION + '</span></b></div></div>'
      + '<div class="pp-kpis">'
      + '<span class="pp-kpi"><b>' + todayN + '</b><i>今日寻路</i></span>'
      + '<span class="pp-kpi"><b>' + (h ? (h.trigHit == null ? '—' : h.trigHit + '%') : '—') + '</b><i>触发命中率</i></span>'
      + '<span class="pp-kpi"><b>' + (h ? h.boardAvg == null ? '—' : h.boardAvg : '—') + '</b><i>寻路均分</i></span>'
      + '</div>'
      + '<div class="pp-topacts"><button class="pp-btn primary" data-act="quick" title="随机一道寻路题（快捷键 D）">' + I('bolt') + '开寻</button></div>'
      + '</header>'
  }

  function boardHTML(ctx, S) {
    let p = null
    BOARD_PROBLEMS.forEach(function (x) { if (x.id === S.boardId) p = x })
    if (!p) p = BOARD_PROBLEMS[0]
    let out = []
    /* v2.0 概念导览条：五种玩法一句话（融合的前沿概念对用户可见） */
    out.push('<div class="pp-conbar">'
      + '<span class="pp-con"><b>双向搜索</b>倒推欠债 → 正向还债</span>'
      + '<span class="pp-con"><b>证明债务</b>先欠后还，欠债扣分</span>'
      + '<span class="pp-con"><b>发明器</b>自造 F，CAS 真求导验证</span>'
      + '<span class="pp-con"><b>怪兽馆</b>Lakatos 反例伏击</span>'
      + '<span class="pp-con"><b>提示阶梯</b>四级渐进，用一级扣一级</span></div>')
    out.push('<div class="pp-conbar v21">'
      + '<span class="pp-con"><b>量化博弈</b>∀∃ 是出招顺序，不是文法（触发速答页开局）</span>'
      + '<span class="pp-con"><b>积木质检</b>通关后抽条件——塌没塌一目了然</span>'
      + '<span class="pp-con"><b>同构迁移</b>桥链撞签名 = 你已会这道题的孪生</span>'
      + '<span class="pp-con"><b>抽象阶梯</b>卡住就下潜特化版，赢一局再爬上来</span></div>')
    out.push('<div class="pp-conbar v21">'
      + '<span class="pp-con"><b>启发式引擎</b>Polya 元搜索：每步告诉你此刻最该做什么</span>'
      + '<span class="pp-con"><b>反例博弈</b>你当对手——击穿命题或承认不可破</span>'
      + '<span class="pp-con"><b>骨架识别</b>你的路径命中哪种命题拓扑（MPS）</span>'
      + '<span class="pp-con"><b>证明美学</b>短、复用、无冗余的结构分</span>'
      + '<span class="pp-con"><b>实验引擎</b>数值先验证，再动笔证明</span></div>')
    out.push('<section class="pp-card"><div class="pp-card-h"><b>寻路板</b><em>证明不是写出来的，是搜出来的——从已知出发，把桥一块块搭上</em>'
      + '<span class="pp-pickwrap"><div class="pp-seg">' + BOARD_PROBLEMS.map(function (x) {
        return '<button data-act="board-pick" data-id="' + x.id + '" class="' + (x.id === p.id ? 'on' : '') + '" title="' + esc(x.ch) + '">' + esc(x.title) + '</button>'
      }).join('') + '</div></span></div>')
    /* 题干 */
    out.push('<div class="pp-node" style="margin-bottom:12px">' + esc(p.ch) + ' · <b>' + esc(p.title) + '</b><div style="margin-top:6px;font-size:13.5px">' + p.stem + '</div></div>')
    /* 三栏：条件 | 桥 | 目标 */
    let pool = {}
    p.conds.forEach(function (c) { pool[c.t] = 1 })
    S.path.forEach(function (k) { (M_BY_K[k] || { out: [] }).out.forEach(function (t) { pool[t] = 1 }) })
    let reached = !!pool[p.goal]
    out.push('<div class="pp-board">')
    out.push('<div class="pp-col"><span class="pp-col-h">已知条件</span>'
      + p.conds.map(function (c) { return '<div class="pp-node"><span class="tg">' + esc(c.t) + '</span>' + esc(c.x) + '</div>' }).join('') + '</div>')
    out.push('<div class="pp-arrowcol">' + I('arrow') + '</div>')
    out.push('<div class="pp-col"><span class="pp-col-h">目标</span>'
      + '<div class="pp-node goal' + (reached ? ' reached' : '') + '"><span class="tg">' + esc(p.goal) + '</span>'
      + (reached ? '已抵达——结论成立' : '把已知推到这张牌') + '</div>'
      + '<div class="pp-node"><span class="pp-col-h">标签池</span><div class="pp-pool">'
      + Object.keys(pool).map(function (t) {
        let isNew = !p.conds.some(function (c) { return c.t === t })
        return '<span class="pp-pooltag' + (isNew ? ' new' : '') + '">' + esc(t) + '</span>'
      }).join('') + '</div></div></div>')
    out.push('</div>')
    /* 已走路径 */
    out.push('<div class="pp-path">' + (S.path.length
      ? S.path.map(function (k) { return '<span class="pp-pathchip">' + esc((M_BY_K[k] || {}).name || k) + '</span>' }).join('<span class="pp-pathsep">→</span>')
      : '<span class="pp-quiet">路径为空——从下面的桥卡开始搭</span>') + '</div>')
    /* 桥卡库 */
    out.push('<div class="pp-bridgebank">' + METHODS.map(function (m) {
      let lack = m.req.filter(function (r) { return r !== 'anyGoal' && !pool[r] })
      return '<button class="pp-bridge' + (lack.length ? ' dim' : '') + '" data-act="bridge" data-k="' + m.k + '" title="' + esc(m.tip) + '">'
        + esc(m.name) + '<span class="req">' + esc(m.req.join(' + ') || '任意目标') + ' → ' + esc(m.out.join(' + ')) + '</span></button>'
    }).join('') + '</div>')
    out.push('<div class="pp-acts">'
      + '<button class="pp-btn sm" data-act="board-undo">' + I('cross') + '退一步</button>'
      + '<button class="pp-btn sm ghost" data-act="board-reset">重置</button>'
      + '<button class="pp-btn sm ghost" data-act="regress">' + I('compass') + '倒推：什么桥能造出目标？</button>'
      + '<button class="pp-btn sm ghost" data-act="board-hint">' + I('bulb') + '提示阶梯' + (S.hintLevel ? '（已用 ' + S.hintLevel + '/4，-' + Math.min(18, S.hintLevel * 6) + ' 分）' : '') + '</button>'
      + (LADDER[p.id] ? '<button class="pp-btn sm ghost" data-act="ladder">' + I('grid') + '抽象阶梯：不会证就先解特化版</button>' : '')
      + '</div>')
    if (S.ladder && LADDER[p.id]) {
      let ld = LADDER[p.id]
      out.push('<div class="pp-verdict">' + I('grid') + '<div><b>下潜一级（Polya）</b>：' + esc(ld.down)
        + '<div class="pp-quiet" style="margin-top:6px"><b>再上一级</b>：' + esc(ld.up) + '</div>'
        + '<div class="pp-quiet" style="margin-top:6px">梯子哲学：难题解不动不是能力问题，是抽象层级问题——找到你还能站住的那级台阶。</div></div></div>')
    }
    if (S.regress) {
      let makers = METHODS.filter(function (m) { return m.out.indexOf(p.goal) >= 0 })
      out.push('<div class="pp-verdict">' + I('compass') + '<div><b>倒推（goal regression）</b>——能直接造出「' + esc(p.goal) + '」的桥：'
        + (makers.length ? makers.map(function (m) {
          let lack = m.req.filter(function (r) { return r !== 'anyGoal' && !pool[r] })
          return '<button class="pp-btn sm' + (lack.length ? ' ghost' : ' primary') + '" data-act="regress-pick" data-k="' + m.k + '" style="margin:4px 6px 0 0">'
            + esc(m.name) + (lack.length ? '（先欠 ' + lack.join('、') + '）' : '（入场券齐）') + '</button>'
        }).join('') : '无——这题的目标需要别的桥先改名') +
        '<div class="pp-quiet" style="margin-top:6px">讲义心法：从结论倒推「什么定理会直接给出它」，再检查这些定理的前提——欠的就是你要证的。</div></div></div>')
    }
    if (S.hintLevel) {
      let lad = hintLadder(p)
      out.push('<div class="pp-verdict">' + I('bulb') + '<div>' + lad.slice(0, S.hintLevel).map(function (h, i) {
        return '<b>L' + (i + 1) + '</b> ' + esc(h)
      }).join('<div style="height:4px"></div>') + '</div></div>')
    }
    /* 债务台账（v2.0）：欠的前提不再拦路，但每一笔都记账、都扣分 */
    let dd = debtOf(p, S.path)
    if (dd.debts.length || dd.circular.length) {
      out.push('<div class="pp-debts">' + dd.circular.map(function (c) {
        return '<div class="pp-debt circ">' + I('cross') + ' ' + esc(c) + '</div>'
      }).join('') + dd.debts.map(function (d) {
        return '<div class="pp-debt">' + I('shield') + ' 欠「' + esc(d.tag) + '」——' + esc(DEBT_TEXT[d.tag] || d.tag)
          + '（用「' + esc((M_BY_K[d.bridge] || {}).name) + '」时挂的账）</div>'
      }).join('') + '</div>')
    }
    /* 怪兽伏击（Lakatos）：债务在场就可能被咬——哪个病理函数咬断这个前提？ */
    if (S.monster) {
      let mo = S.monster
      out.push('<section class="pp-card"><div class="pp-card-h"><b>怪兽出没！</b><em>Lakatos：一个反例顶十个正面论证——' + esc(mo.tag) + ' 前提被谁咬断？</em></div>')
      out.push('<div class="pp-topts">' + mo.opts.map(function (oi, slot) {
        let m = MONSTERS[oi]
        let cls = ''
        if (mo.picked != null) cls = oi === mo.answer ? ' right' : (slot === mo.picked ? ' wrong' : '')
        return '<button class="pp-topt' + cls + '" data-act="monster-pick" data-slot="' + slot + '" data-oi="' + oi + '"' + (mo.picked != null ? ' disabled' : '') + '>' + m.fn + '</button>'
      }).join('') + '</div>')
      if (mo.picked != null) {
        let hit = mo.opts[mo.picked] === mo.answer
        out.push('<div class="pp-verdict ' + (hit ? 'ok' : 'rev') + '">' + (hit ? I('check') : I('bulb')) + '<div><b>' + (hit ? '认出来了。' : '没认出来——记住这个怪物。') + '</b>'
          + esc(MONSTERS[mo.answer].why) + '</div></div>')
        out.push('<div class="pp-acts"><button class="pp-btn primary" data-act="monster-close">收下教训，回到寻路</button></div>')
      }
      out.push('</section>')
    }
    /* Pólya 启发式引擎：每步都跑规则库，给「此刻最该做的元动作」 */
    let pa = polyyaAdvice(p, pool, S.path)
    if (pa.length) {
      out.push('<div class="pp-polya">' + I('bulb') + '<div><b>启发式（Polya 元搜索）</b>'
        + pa.map(function (a) { return '<div class="pp-polya-line">· ' + esc(a) + '</div>' }).join('') + '</div></div>')
    }
    out.push('</section>')
    /* ═══ 反例博弈（v2.2 Skolem 对抗化）：这次你当对手——找函数击穿命题 ═══ */
    out.push('<section class="pp-card"><div class="pp-card-h"><b>反例博弈</b><em>你当对手：找一个满足前提却击穿结论的见证。打不穿也是素养——识别「不可反例」</em>'
      + '<span class="pp-pickwrap"><div class="pp-seg">' + CEGames.map(function (g) {
        return '<button data-act="ce-pick" data-id="' + g.id + '" class="' + (g.id === S.ceId ? 'on' : '') + '">' + esc(g.law.slice(0, 10)) + '</button>'
      }).join('') + '</div></span></div>')
    let ceg = null
    CEGames.forEach(function (x) { if (x.id === S.ceId) ceg = x })
    if (!ceg) ceg = CEGames[0]
    out.push('<div class="pp-tq">' + ceg.law + '</div>')
    out.push('<div class="pp-topts">' + ceg.pool.map(function (o, i) {
      let cls = ''
      if (S.ce && S.ce.gid === ceg.id && S.ce.picked != null) cls = o.ok ? ' right' : (i === S.ce.picked ? ' wrong' : '')
      let dis = (S.ce && S.ce.gid === ceg.id && S.ce.picked != null) ? ' disabled' : ''
      return '<button class="pp-topt' + cls + '" data-act="ce-pick-opt" data-i="' + i + '"' + dis + '>' + esc(o.t) + '</button>'
    }).join('') + '</div>')
    if (S.ce && S.ce.gid === ceg.id && S.ce.picked != null) {
      let co = ceg.pool[S.ce.picked]
      out.push('<div class="pp-verdict ' + (co.ok ? 'ok' : 'rev') + '">' + (co.ok ? I('check') : I('bulb'))
        + '<div><b>' + (co.ok ? '反例成立——前提满足、结论塌了。' : '这一手没打穿。') + '</b>' + esc(co.why) + '</div></div>')
    }
    out.push('</section>')
    /* 发明器（Kapur：先发明，后教学）——自己造 F，CAS 验证 */
    if (p.goalEq) {
      out.push('<section class="pp-card"><div class="pp-card-h"><b>辅助函数发明器</b><em>别背构造表——自己造一个 F，让符号引擎验给你看（F\' 会真的被求出来）</em></div>')
      out.push('<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">'
        + '<input class="pp-input" data-pp="invent" placeholder="F(x)= 如 x*f(x)、e^x*f(x)、f(x)/x^2、e^{-x}*f(x)" value="' + esc(S.inventStr) + '" style="max-width:340px">'
        + '<button class="pp-btn primary" data-act="invent">' + I('bolt') + '验证我的 F</button></div>')
      out.push('<div class="pp-quiet" style="margin-top:6px">可用语法：x, f, f\', g, ln(x), e^{kx}, 常数, *, /, ^n, ()。判定标准：F\'(ξ)=0 ⟺ 结论 × 非零因子。</div>')
      if (S.invent) {
        let iv = S.invent
        out.push('<div class="pp-verdict ' + (iv.ok ? 'ok' : 'rev') + '">' + (iv.ok ? I('check') : I('bulb')) + '<div>'
          + (iv.ok
            ? '<b>你的 F 成立。</b> F\' = ' + iv.dprime + ' = ' + iv.factor + ' × 结论左边——所以 F\'(ξ)=0 正是要证的式子。'
              + (iv.negExp ? '<div class="pp-quiet" style="margin-top:5px">注意：因子含负指数（除法），军规二——先说明分母在区间内不为零。</div>' : '')
              + '<div class="pp-quiet" style="margin-top:5px">你刚才独立重走了构造表的一行。这就是「先发明后教学」。</div>'
            : esc(iv.why)) + '</div></div>')
      }
      out.push('</section>')
    }
    out.push('</section>')
    /* 通关结算 */
    if (S.pathResult && S.pathResult.ok) {
      let r = S.pathResult
      out.push('<section class="pp-card"><div class="pp-card-h"><b>寻路完成</b><em>效率 ' + r.eff + '% · 条件覆盖 ' + r.cover + '% · 走了 ' + r.used + ' 步（最优 ' + p.best + ' 步）· 性质声明' + (r.certified ? ' ✓' : ' ✗（踩分点丢了）') + '</em></div>')
      out.push('<div class="pp-bignum">' + r.score + ' <span style="font-size:15px;color:var(--pp-sub)">分</span></div>')
      if (r.unused && r.unused.length) {
        out.push('<div class="pp-verdict rev">' + I('shield') + '<div><b>条件审计</b>——讲义原话：没用上的条件=警报<div class="pp-quiet">本题有 ' + r.unused.length + ' 个条件没被你的路径消费：' + r.unused.map(esc).join('；') + '</div></div></div>')
      } else {
        out.push('<div class="pp-verdict ok">' + I('check') + '<div>条件审计通过：每个已知都被桥消费了。</div></div>')
      }
      /* 骨架识别 + 美学度量（v2.2）：你的路径命中哪种命题拓扑？漂亮吗？ */
      let sk = null
      SKELETONS.forEach(function (x) { if (x.k === skeletonOf(p, S.path)) sk = x })
      let bt = beautyOf(p, S.path)
      out.push('<div class="pp-skrow"><span class="pp-skchip">' + esc(sk.name) + ' · ' + esc(sk.pat) + '</span>'
        + '<span class="pp-beauty ' + (bt.score >= 90 ? 'ok' : (bt.score >= 70 ? 'mid' : 'low')) + '">美学 ' + bt.score + '</span></div>')
      out.push('<div class="pp-quiet" style="margin-bottom:10px">' + esc(sk.desc) + ' ' + esc(bt.note) + '</div>')
      /* 数学实验引擎（v2.2 Polya 实验面）：数值抽样先验证再证明 */
      if (EXPERIMENTS[p.id]) {
        let ex = EXPERIMENTS[p.id]
        out.push('<div class="pp-fld"><span>数学实验（先猜后证）：在 ' + ex.name + '</span>')
        out.push('<div class="pp-acts"><button class="pp-btn sm ghost" data-act="experiment">' + I('grid') + '跑数值实验</button></div>')
        if (S.experiment && S.experiment.id === p.id) {
          let ev = S.experiment
          out.push('<div class="pp-verdict ok" style="flex-direction:column;align-items:stretch"><b>' + esc(ev.verdict) + '</b>'
            + '<div class="pp-exrows">' + ev.rows.map(function (r) {
              return '<div class="pp-exrow"><span>' + r[0] + '</span><span class="pp-quiet">' + esc(r[1]) + '</span></div>'
            }).join('') + '</div>'
            + '<div class="pp-quiet" style="margin-top:6px">' + esc(ev.hint) + '</div></div>')
        }
        out.push('</div>')
      }
      out.push('<div class="pp-fld" style="margin-top:12px"><span>誊写编译 · 把骨架写成完整证明，AI 阅卷人按四大踩分点点评</span>'
        + '<textarea class="pp-input" data-pp="proof" placeholder="例：令 $F(x)=xf(x)$。因 $f$ 在 $[0,1]$ 连续……">' + esc(S.proofText) + '</textarea></div>')
      out.push('<div class="pp-acts"><button class="pp-btn primary" data-act="review">' + I('robot') + 'AI 阅卷人点评</button>'
        + '<button class="pp-btn ghost" data-act="selfcheck">' + I('check') + '自检清单（零 AI）</button></div>')
      if (S.reviewBusy) out.push('<div class="pp-quiet" style="margin-top:8px">阅卷中…</div>')
      if (S.review) out.push(renderReview(S.review))
      if (S.selfCheck) out.push(renderSelfCheck(S.selfCheck))
      /* 校准预测（v2.0）：先报分数，再开牌——过度自信是考场杀手 */
      if (!S.predict) {
        out.push('<div class="pp-verdict" style="flex-direction:column;align-items:stretch"><b>结算前最后一问（元认知校准）：你给自己打几分？</b>'
          + '<div class="pp-acts">'
          + '<button class="pp-btn sm" data-act="predict" data-v="90">90+（稳了）</button>'
          + '<button class="pp-btn sm" data-act="predict" data-v="70">70-89（有瑕疵）</button>'
          + '<button class="pp-btn sm" data-act="predict" data-v="45">45-69（心虚）</button>'
          + '<button class="pp-btn sm" data-act="predict" data-v="20">及格线以下</button></div></div>')
      } else {
        let gap = r.score - S.predict
        out.push('<div class="pp-verdict ' + (Math.abs(gap) <= 10 ? 'ok' : 'rev') + '">' + I('compass') + '<div><b>校准</b>：你预测 ' + S.predict + '，实际 ' + r.score + '——'
          + (gap > 10 ? '过度自信 +' + gap + '（考场上这类盲区就是丢分点）' : (gap < -10 ? '低估自己 ' + gap + '（你比自己以为的更会寻路）' : '校准良好 ±10 内，元认知在线')) + '</div></div>')
      }
      /* 必要性反事实（v2.1 Lakatos）：哪个条件抽掉，整座楼就塌 */
      if (p.necessity) {
        let others = p.conds.filter(function (c) { return c.t !== p.necessity.tag })
        let opts = shuffle([p.necessity.tag].concat(others.map(function (c) { return c.t })), 'ne' + p.id)
        out.push('<section class="pp-card"><div class="pp-card-h"><b>抽掉一块积木</b><em>条件不是背景板——抽掉哪个，刚才的证明立刻塌？（Lakatos：反例是证明的质检员）</em></div>')
        out.push('<div class="pp-topts">' + opts.map(function (t, i) {
          let c = null
          p.conds.forEach(function (x) { if (x.t === t) c = x })
          let cls = S.ness ? (t === p.necessity.tag ? ' right' : (i === S.ness.pick ? ' wrong' : '')) : ''
          return '<button class="pp-topt' + cls + '" data-act="ness-pick" data-i="' + i + '" data-t="' + esc(t) + '"' + (S.ness ? ' disabled' : '') + '>'
            + esc((c || { x: t }).x) + '</button>'
        }).join('') + '</div>')
        if (S.ness) {
          out.push('<div class="pp-verdict ' + (S.ness.hit ? 'ok' : 'rev') + '">' + (S.ness.hit ? I('check') : I('bulb'))
            + '<div><b>' + (S.ness.hit ? '楼塌的位置找对了。' : '你抽掉的那块，楼还站着——真正承重的是它：') + '</b>'
            + esc(p.necessity.why) + '</div></div>')
        }
        out.push('</section>')
      }
      out.push('</section>')
    }
    return out.join('')
  }

  function renderReview(rv) {
    if (!rv || !rv.blocks) return ''
    let out = ['<div class="pp-verdict ' + (rv.total >= 70 ? 'ok' : 'rev') + '" style="flex-direction:column;align-items:stretch">']
    out.push('<b>阅卷人评分：' + rv.total + '/100</b>')
    rv.blocks.forEach(function (b) {
      out.push('<div style="margin-top:6px"><b>' + esc(b.name || '') + '</b>（' + esc(b.pts || '') + '）：' + esc(b.note || '') + '</div>')
    })
    if (rv.worst) out.push('<div class="pp-quiet" style="margin-top:6px">最伤的一句：' + esc(rv.worst) + '</div>')
    out.push('</div>')
    return out.join('')
  }
  function renderSelfCheck(sc) {
    let out = ['<div class="pp-verdict" style="flex-direction:column;align-items:stretch"><b>自检清单（阅卷口径，逐项打勾）</b>']
    BLOCKS.forEach(function (b, i) {
      out.push('<label style="display:flex;gap:8px;align-items:flex-start;margin-top:7px;font-size:12.5px;cursor:pointer">'
        + '<input type="checkbox" data-act="scbox" data-i="' + i + '" ' + (sc[i] ? 'checked' : '') + ' style="margin-top:3px">'
        + '<span><b>' + esc(b.name) + '</b>（' + esc(b.pts) + '）——' + esc(b.tip) + '</span></label>')
    })
    out.push('<div class="pp-quiet" style="margin-top:7px">四条军规复核：性质声明了吗 / 除法前证分母非零了吗 / 量词顺序对吗 / 严格号有严格论证吗。</div></div>')
    return out.join('')
  }

  function triggerHTML(ctx, S) {
    let out = []
    out.push('<section class="pp-card"><div class="pp-card-h"><b>触发速答</b><em>讲义三大表变成肌肉记忆：看到结论长相，桥就该在 3 秒内冒出来</em></div>')
    if (!S.trig || S.trig.done) {
      let h = habitsOf(S.sessions)
      out.push('<div class="pp-quiet" style="margin-bottom:10px">'
        + (S.trig && S.trig.done ? '本轮 ' + S.trig.right + '/' + S.trig.i + ' 命中。' : '一轮 ' + S.trigN + ' 题，每题限时 ' + (S.timerOn ? '20 秒' : '不限') + '。答错当场回表讲解。')
        + (h && h.trigHit != null ? '历史总命中率 ' + h.trigHit + '%。' : '') + '</div>')
      out.push('<div class="pp-acts"><button class="pp-btn primary" data-act="trig-start">' + I('bolt') + '开始一轮</button></div>')
      out.push('</section>')
      out.push(qgCardHTML(S))
      return out.join('')
    }
    let t = TRIG_ITEMS[S.trig.order[S.trig.i]]
    out.push('<div style="display:flex;align-items:center;gap:14px;margin-bottom:10px">'
      + '<span class="pp-quiet">第 ' + (S.trig.i + 1) + ' / ' + S.trig.order.length + ' 题</span>'
      + '<span class="pp-streak">' + (S.trig.streak > 1 ? '连对 ' + S.trig.streak + ' 中' : '') + '</span>'
      + '<span style="margin-left:auto" class="pp-timer' + (S.trigLeft <= 5 && S.timerOn ? ' low' : '') + '">' + (S.timerOn ? S.trigLeft + 's' : '∞') + '</span></div>')
    out.push('<div class="pp-tq">' + t.q + '</div>')
    out.push('<div class="pp-topts">' + t.opts.map(function (o, i) {
      let cls = ''
      if (S.trig.picked != null) cls = i === t.a ? ' right' : (i === S.trig.picked ? ' wrong' : '')
      return '<button class="pp-topt' + cls + '" data-act="trig-pick" data-i="' + i + '"' + (S.trig.picked != null ? ' disabled' : '') + '>' + esc(o) + '</button>'
    }).join('') + '</div>')
    if (S.trig.picked != null) {
      let hit = S.trig.picked === t.a
      out.push('<div class="pp-verdict ' + (hit ? 'ok' : 'rev') + '">' + (hit ? I('check') : I('bulb'))
        + '<div><b>' + (hit ? '命中。' : '没接住。') + '</b>' + esc(t.why) + '</div></div>')
      out.push('<div class="pp-acts"><button class="pp-btn primary" data-act="trig-next">' + I('arrow') + (S.trig.i + 1 < S.trig.order.length ? '下一题' : '收口结算') + '</button></div>')
    }
    out.push('</section>')
    out.push(qgCardHTML(S))
    return out.join('')
  }

  /* 量化博弈卡（v2.1 概念旗舰）：量词顺序是对话游戏——对手先选，你只能应答已亮的牌。
   * 独立成函数：idle 分支与对局分支都要挂上（第一版只挂对局分支，空闲页看不见博弈）。 */
  function qgCardHTML(S) {
    let out = []
    out.push('<section class="pp-card"><div class="pp-card-h"><b>量化博弈</b><em>Lorenzen 对话语义：$\\forall\\exists$ 的顺序就是「谁先动」——军规三的游戏化</em>'
      + '<span class="pp-pickwrap"><div class="pp-seg">' + QGAMES.map(function (g) {
        return '<button data-act="qg-pick" data-id="' + g.id + '" class="' + (g.id === S.qgId ? 'on' : '') + '">' + esc(g.law.slice(0, 12)) + '</button>'
      }).join('') + '</div></span></div>')
    let g = null
    QGAMES.forEach(function (x) { if (x.id === S.qgId) g = x })
    if (!g) g = QGAMES[0]
    out.push('<div class="pp-node" style="margin-bottom:12px"><b>论题</b> ' + g.claim + '</div>')
    if (!S.qg) S.qg = { i: 0, wins: 0, picked: null }
    let round = g.rounds[Math.min(S.qg.i, g.rounds.length - 1)]
    let finished = S.qg.i >= g.rounds.length
    if (finished) {
      out.push('<div class="pp-verdict ' + (S.qg.wins === g.rounds.length ? 'ok' : 'rev') + '">' + I('shield')
        + '<div><b>博弈结束：' + S.qg.wins + '/' + g.rounds.length + ' 回合你守住了量词顺序。</b>'
        + (S.qg.wins === g.rounds.length ? '「∀ε∃δ」你已不是背符号，而是看见了出招顺序。' : '输的回合都在同一件事上：应答偷看了后面才登场的变量（军规三）。') + '</div></div>')
      out.push('<div class="pp-acts"><button class="pp-btn primary" data-act="qg-reset">' + I('bolt') + '再来一局</button></div>')
    } else {
      out.push('<div class="pp-tq"><span class="pp-quiet">第 ' + (S.qg.i + 1) + '/' + g.rounds.length + ' 回合 · 对手出招：</span><br>' + round.opp + '</div>')
      out.push('<div class="pp-topts">' + round.opts.map(function (o, i) {
        let cls = ''
        if (S.qg.picked != null) cls = o.ok ? ' right' : (i === S.qg.picked ? ' wrong' : '')
        return '<button class="pp-topt' + cls + '" data-act="qg-pick-opt" data-i="' + i + '"' + (S.qg.picked != null ? ' disabled' : '') + '>' + esc(o.t) + '</button>'
      }).join('') + '</div>')
      if (S.qg.picked != null) {
        let jd = qgJudge(round, S.qg.picked)
        out.push('<div class="pp-verdict ' + (jd.ok ? 'ok' : 'rev') + '">' + (jd.ok ? I('check') : I('bulb'))
          + '<div><b>' + (jd.ok ? '应答合法。' : '量词违规。') + '</b>' + esc(jd.why) + '</div></div>')
        out.push('<div class="pp-acts"><button class="pp-btn primary" data-act="qg-next">' + I('arrow') + (S.qg.i + 1 < g.rounds.length ? '下一回合' : '结算') + '</button></div>')
      }
    }
    out.push('</section>')
    return out.join('')
  }

  function reasmHTML(ctx, S) {
    let out = []
    out.push('<section class="pp-card"><div class="pp-card-h"><b>证明拼图</b><em>经典证明拆成步骤卡打乱——按逻辑顺序点回来，结构感就是在这一步一步里长出来的</em>'
      + '<span class="pp-pickwrap"><div class="pp-seg">' + REASM_SETS.map(function (x) {
        return '<button data-act="reasm-pick" data-id="' + x.id + '" class="' + (x.id === S.reasmId ? 'on' : '') + '">' + esc(x.title.slice(0, 10)) + '</button>'
      }).join('') + '</div></span></div>')
    let set = null
    REASM_SETS.forEach(function (x) { if (x.id === S.reasmId) set = x })
    if (!set) set = REASM_SETS[0]
    if (!S.reasmShuffle || S.reasmShuffleSet !== set.id) { S.reasmShuffleSet = set.id; S.reasmShuffle = shuffle(set.steps.map(function (_, i) { return i }), set.id) }
    let taken = S.reasmOrder.slice()
    out.push('<div class="pp-quiet" style="margin-bottom:10px">' + set.title + '</div>')
    out.push('<div>')
    for (let i = 0; i < set.steps.length; i++) {
      let stepIdx = taken[i]
      let txt = stepIdx == null ? '' : set.steps[stepIdx]
      let badCls = S.reasmResult && S.reasmOrder[i] !== i ? ' badpos' : ''
      out.push('<div class="pp-slotrow"><span class="pp-slotn">' + (i + 1) + '</span>'
        + '<div class="pp-slot' + (stepIdx != null ? ' filled' + badCls : '') + '" data-act="reasm-unpick" data-i="' + i + '">'
        + (stepIdx != null ? esc(txt) : '（第 ' + (i + 1) + ' 步——点下方卡片放入）') + '</div></div>')
    }
    out.push('</div>')
    if (!S.reasmResult) {
      out.push('<div class="pp-pieces" style="margin-top:10px">' + S.reasmShuffle.map(function (si) {
        if (taken.includes(si)) return ''
        return '<button class="pp-piece" data-act="reasm-take" data-i="' + si + '">' + esc(set.steps[si]) + '</button>'
      }).join('') + '</div>')
      if (taken.length === set.steps.length) out.push('<div class="pp-acts"><button class="pp-btn primary" data-act="reasm-check">' + I('check') + '对答案</button></div>')
    } else {
      let r = S.reasmResult
      out.push('<div class="pp-verdict ' + (r.score >= 80 ? 'ok' : 'rev') + '">' + I('shield')
        + '<div><b>' + r.hits + '/' + r.total + ' 位正确（' + r.score + ' 分）。</b>'
        + '两个军规锚点：<b>性质声明</b>永远在定理使用之前，<b>结论回扣</b>必须收尾。错位多发生在这两处。</div></div>')
      out.push('<div class="pp-acts"><button class="pp-btn" data-act="reasm-retry">' + I('bolt') + '再来一次</button></div>')
    }
    out.push('</section>')
    return out.join('')
  }

  function auditHTML(ctx, S) {
    let out = []
    out.push('<section class="pp-card"><div class="pp-card-h"><b>军规关卡</b><em>阅卷人视角：这些「看着对」的证明里埋着雷——点出违规行</em>'
      + '<span class="pp-pickwrap"><div class="pp-seg">' + AUDIT_SETS.map(function (x) {
        return '<button data-act="audit-pick" data-id="' + x.id + '" class="' + (x.id === S.auditId ? 'on' : '') + '">' + esc(x.title.slice(0, 8)) + '</button>'
      }).join('') + '</div></span></div>')
    let set = null
    AUDIT_SETS.forEach(function (x) { if (x.id === S.auditId) set = x })
    if (!set) set = AUDIT_SETS[0]
    out.push('<div class="pp-quiet" style="margin-bottom:10px">' + esc(set.title) + ' · 四条军规：①引入函数必声明性质 ②除法先证分母非零 ③量词顺序不乱 ④严格不等式要严格论证。另有阅卷要领：前提逐条验证、结论原样回扣。</div>')
    set.lines.forEach(function (l, i) {
      let cls = ''
      if (S.auditMark.includes(i)) cls += ' marked'
      if (S.auditResult) cls += l.bad ? ' reveal-bad' : ' reveal-ok'
      out.push('<div class="pp-proofline' + cls + '" data-act="audit-mark" data-i="' + i + '"><span class="pp-lineno">' + (i + 1) + '</span>' + l.x + '</div>')
    })
    if (!S.auditResult) {
      out.push('<div class="pp-acts"><button class="pp-btn primary" data-act="audit-submit">' + I('shield') + '提交排雷</button>'
        + '<button class="pp-btn ghost" data-act="audit-reset">清空标记</button></div>')
    } else {
      let r = S.auditResult
      out.push('<div class="pp-verdict ' + (r.score >= 75 ? 'ok' : 'rev') + '">' + I('shield')
        + '<div><b>F1 得分 ' + r.score + '</b>（精确 ' + r.prec + '% · 召回 ' + r.recall + '%）——埋雷 ' + r.nBad + ' 处，抓到 ' + r.tp + '，误伤 ' + r.fp + '，漏报 ' + r.fn + '。</div></div>')
      r.missed.forEach(function (m) {
        out.push('<div class="pp-verdict rev" style="margin-top:8px"><div><b>第 ' + (m.i + 1) + ' 行漏报</b>（违反 ' + esc(m.bad) + '）：' + esc(m.l.note || '') + '</div></div>')
      })
      r.falsePos.forEach(function (i) {
        out.push('<div class="pp-verdict" style="margin-top:8px"><div><b>第 ' + (i + 1) + ' 行误伤</b>：这一行其实合规——军规没被违反。</div></div>')
      })
      out.push('<div class="pp-acts"><button class="pp-btn" data-act="audit-retry">' + I('bolt') + '换一篇</button></div>')
    }
    out.push('</section>')
    return out.join('')
  }

  /* 供给网络 SVG：三列布局（前提/桥/产出），边=供给关系，色=掌握度 */
  function supplyGraphSVG(g, mastery) {
    let W = 640, rowH = 26, colX = [8, 250, 520]
    let prem = g.prem.slice(0, 10), goal = g.goal.slice(0, 10)
    let bridges = METHODS.filter(function (m) { return m.req.some(function (r) { return r !== 'anyGoal' }) })
    let H = Math.max(prem.length, bridges.length, goal.length) * rowH + 30
    let yOf = {}
    prem.forEach(function (t, i) { yOf['P:' + t] = 20 + i * rowH })
    goal.forEach(function (t, i) { yOf['G:' + t] = 20 + i * rowH })
    bridges.forEach(function (m, i) { yOf['B:' + m.k] = 20 + i * rowH })
    let out = ['<svg class="pp-net" viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:' + H + 'px" role="img" aria-label="方法供给网络">']
    g.edges.forEach(function (e) {
      let fromKey = yOf['P:' + e.from] != null ? 'P:' + e.from : 'B:' + e.from
      let toKey = yOf['G:' + e.to] != null ? 'G:' + e.to : 'B:' + e.to
      let fy = yOf[fromKey], ty = yOf[toKey]
      if (fy == null || ty == null) return
      let fx = fromKey[0] === 'P' ? colX[0] + 62 : colX[1] + 118
      let tx = toKey[0] === 'G' ? colX[2] : colX[1]
      out.push('<path d="M' + fx + ' ' + (fy + 10) + ' C' + (fx + 40) + ' ' + (fy + 10) + ',' + (tx - 40) + ' ' + (ty + 10) + ',' + tx + ' ' + (ty + 10) + '" fill="none" stroke="var(--pp-line)" stroke-width="1"/>')
    })
    prem.forEach(function (t, i) {
      out.push('<text class="pp-net-lab" x="' + colX[0] + '" y="' + (20 + i * rowH + 14) + '">' + esc(t) + '</text>')
    })
    bridges.forEach(function (m, i) {
      let mv = (mastery[m.k] || {}).m
      let col = mv == null ? 'var(--pp-sub)' : (mv >= 70 ? 'var(--pp-ok)' : (mv >= 40 ? 'var(--pp-gold)' : 'var(--pp-danger)'))
      out.push('<g class="pp-net-b" data-k="' + m.k + '"><title>' + esc(m.tip) + '</title>'
        + '<rect x="' + colX[1] + '" y="' + (20 + i * rowH) + '" width="118" height="20" rx="6" fill="var(--pp-soft)" stroke="' + col + '"/>'
        + '<text x="' + (colX[1] + 59) + '" y="' + (20 + i * rowH + 14) + '" text-anchor="middle">' + esc(m.name) + '</text></g>')
    })
    goal.forEach(function (t, i) {
      out.push('<text class="pp-net-lab" x="' + colX[2] + '" y="' + (20 + i * rowH + 14) + '">' + esc(t) + '</text>')
    })
    out.push('</svg>')
    return out.join('')
  }

  function ledgerHTML(ctx, S) {
    let h = habitsOf(S.sessions)
    let out = []
    out.push('<section class="pp-card"><div class="pp-card-h"><b>证明力档案</b><em>四个率，一张「寻路感」体检表</em></div>')
    if (!h) {
      out.push('<div class="pp-empty"><span class="ico">' + I('compass') + '</span><b>还没有一场训练</b>去寻路板搭第一座桥——证明题赢在「搜」，不在「背」。</div></section>')
    } else {
      out.push('<div style="display:flex;gap:8px;flex-wrap:wrap">'
        + '<div class="pp-node" style="flex:1;min-width:120px;text-align:center"><div class="pp-bignum" style="font-size:26px">' + h.n + '</div><span class="pp-quiet">总场次</span></div>'
        + '<div class="pp-node" style="flex:1;min-width:120px;text-align:center"><div class="pp-bignum" style="font-size:26px">' + (h.boardAvg == null ? '—' : h.boardAvg) + '</div><span class="pp-quiet">寻路均分</span></div>'
        + '<div class="pp-node" style="flex:1;min-width:120px;text-align:center"><div class="pp-bignum" style="font-size:26px">' + (h.trigHit == null ? '—' : h.trigHit + '%') + '</div><span class="pp-quiet">触发命中</span></div>'
        + '<div class="pp-node" style="flex:1;min-width:120px;text-align:center"><div class="pp-bignum" style="font-size:26px">' + (h.auditAvg == null ? '—' : h.auditAvg) + '</div><span class="pp-quiet">军规关卡</span></div></div>')
      if (h.weakList.length) {
        out.push('<div class="pp-verdict" style="margin-top:12px">' + I('bulb') + '<div><b>弱项桥卡</b>（寻路中前提缺失最多的卡）：'
          + h.weakList.map(function (k) { return esc((M_BY_K[k] || {}).name || k) }).join('、') + '——回触发表精修这几座桥。</div></div>')
      }
      let adv = adviceFor(h, null, null)
      out.push('<div class="pp-verdict">' + I('compass') + '<div>' + adv.map(esc).join('<br>') + '</div></div>')
    }
    out.push('</section>')
    /* 场次流水 */
    if (S.sessions.length) {
      out.push('<section class="pp-card"><div class="pp-card-h"><b>训练流水</b><em>近 ' + Math.min(12, S.sessions.length) + ' 场</em></div>')
      let MODE_CN = { board: '寻路', trigger: '触发', reasm: '拼图', audit: '关卡', monster: '怪兽', invent: '发明', calib: '校准', qgame: '博弈', necessity: '必要性', cegame: '反例博弈' }
      S.sessions.slice(0, 12).forEach(function (s) {
        let cls = s.score >= 80 ? 'ok' : (s.score >= 55 ? 'mid' : 'low')
        out.push('<div class="pp-ledger-row"><span class="mode">' + (MODE_CN[s.mode] || s.mode) + '</span>'
          + '<span class="pp-quiet">' + fmtTime(s.at) + (s.ref ? ' · ' + esc(s.ref) : '') + '</span>'
          + '<span class="sc ' + cls + '">' + s.score + '</span></div>')
      })
      out.push('</section>')
    }
    /* 病症诊断（v2.0）：债务史 + 怪兽漏抓 + 校准差 → 病根排行 + 处方 */
    let debtLog = []
    S.sessions.forEach(function (s) { if (s.mode === 'board' && s.detail && s.detail.miss) debtLog.push(s.detail.miss) })
    let dg = diagnose(S.sessions, debtLog, S.monsterMiss || [])
    if (dg.length) {
      out.push('<section class="pp-card"><div class="pp-card-h"><b>证明病症诊断</b><em>你的失分不在天赋，在病根——按出现权重排行</em></div>')
      dg.forEach(function (d, i) {
        out.push('<div class="pp-ledger-row"><span class="mode">' + (i + 1) + '</span><span><b>' + esc(d.name) + '</b><span class="pp-quiet"> ×' + d.w + '</span></span></div>')
      })
      out.push('<div class="pp-verdict">' + I('bulb') + '<div><b>处方</b>：' + esc(dg[0].name.indexOf('怪兽') >= 0 ? '去寻路板故意欠一次债，等伏击；或把怪兽馆十页翻完' : (dg[0].name.indexOf('除法') >= 0 ? '每次动除法/柯西前，先点「除法验证」桥卡——把它变肌肉' : (dg[0].name.indexOf('声明') >= 0 ? '把「性质声明」设为搭桥的固定第一步，15 分不白丢' : '触发速答按 SRS 会自动把弱桥排到你面前，每天一轮就够'))) + '。</div></div>')
      out.push('</section>')
    }
    /* 骨架偏好 + 反例胜率（v2.2）：你习惯哪种命题拓扑？敢不敢当对手？ */
    let skCount = {}
    let ceWins = 0, ceTotal = 0
    S.sessions.forEach(function (s) {
      if (s.mode === 'board' && s.detail && s.detail.sk) skCount[s.detail.sk] = (skCount[s.detail.sk] || 0) + 1
      if (s.mode === 'cegame') { ceTotal++; if (s.score >= 80) ceWins++ }
    })
    let skList = Object.keys(skCount).sort(function (a, b) { return skCount[b] - skCount[a] })
    if (skList.length || ceTotal) {
      out.push('<section class="pp-card"><div class="pp-card-h"><b>骨架偏好与反例胜率</b><em>MPS 抽象层：你脑子里住的是哪种证明拓扑</em></div>')
      skList.slice(0, 3).forEach(function (k) {
        let sk = null
        SKELETONS.forEach(function (x) { if (x.k === k) sk = x })
        if (sk) out.push('<div class="pp-ledger-row"><span class="mode">' + esc(sk.name) + '</span><span class="pp-quiet">' + esc(sk.pat) + '</span><span class="sc ok">' + skCount[k] + ' 次</span></div>')
      })
      if (ceTotal) out.push('<div class="pp-ledger-row"><span class="mode">反例博弈</span><span class="pp-quiet">你当对手的胜率</span><span class="sc ' + (ceWins / ceTotal >= 0.7 ? 'ok' : 'mid') + '">' + Math.round(100 * ceWins / ceTotal) + '%</span></div>')
      out.push('</section>')
    }
    /* 桥卡掌握度（v2.0 SRS）：20 张卡 Elo 式掌握度条 */
    let mk = S.mastery || {}
    if (Object.keys(mk).length) {
      out.push('<section class="pp-card"><div class="pp-card-h"><b>桥卡掌握度</b><em>SRS 记忆引擎：答对涨、答错清零且立刻到期——触发速答按这个排课</em></div><div class="pp-mastery">')
      METHODS.forEach(function (m) {
        let v = mk[m.k]
        if (!v) return
        out.push('<div class="pp-mrow"><span class="pp-mname">' + esc(m.name) + '</span>'
          + '<div class="pp-mbar"><i style="width:' + v.m + '%"></i></div>'
          + '<span class="pp-mnum">' + v.m + '</span></div>')
      })
      out.push('</div></section>')
    }
    /* 方法供给网络（v2.0）：前提→桥→目标 的 DAG */
    out.push('<section class="pp-card"><div class="pp-card-h"><b>方法供给网络</b><em>谁的产出喂谁的入场券——这张图就是「证明武器库」的电路图</em></div>')
    out.push(supplyGraphSVG(supplyGraph(), S.mastery || {}))
    out.push('<div class="pp-quiet" style="margin-top:6px">左列前提标签、中列桥卡（越红掌握越低）、右列产出目标。悬停桥卡看它的触发器原文。</div>')
    out.push('</section>')
    /* 三大表数字卡 */
    out.push('<section class="pp-card"><div class="pp-card-h"><b>讲义三大表</b><em>触发表 · 构造表 · 决策表——寻路板的底层数据库，背穿它们</em></div>')
    TABLES.forEach(function (tb) {
      out.push('<div class="pp-tablecard"><table style="width:100%;border-collapse:collapse">'
        + '<tr><th colspan="3">' + esc(tb.name) + '<span style="float:right;font-weight:400">' + esc(tb.src) + '</span></th></tr>')
      tb.rows.forEach(function (r) {
        out.push('<tr><td style="width:38%">' + r[0] + '</td><td style="width:30%"><b>' + r[1] + '</b></td><td class="pp-quiet">' + r[2] + '</td></tr>')
      })
      out.push('</table></div>')
    })
    out.push('<div class="pp-acts"><button class="pp-btn" data-act="export">' + I('down') + '导出档案 JSON</button>'
      + '<button class="pp-btn ghost" data-act="wipe">' + I('cross') + '清空训练记录</button></div>')
    out.push('<div class="pp-quiet" style="margin-top:8px">清空只删本插件的场次记录，不动站内题库与错题本；导出后可用「导入」找回。</div>')
    out.push('</section>')
    return out.join('')
  }

  /* ════════════════════════ 12. 挂载 ════════════════════════ */
  let VIEWS = [
    { k: 'board', t: '寻路板', ic: 'compass', n: '双向寻路' },
    { k: 'trigger', t: '触发', ic: 'bolt', n: '触发表速答' },
    { k: 'reasm', t: '拼图', ic: 'puzzle', n: '证明重排' },
    { k: 'audit', t: '关卡', ic: 'shield', n: '军规排雷' },
    { k: 'ledger', t: '档案', ic: 'chart', n: '证明力体检' },
  ]

  /* 能力面在载入时就要落地（init 与 mount 共用，全部幂等）：
   * 浮窗面板不等工具页被打开——只在 mount 注皮肤的话，面板首开就是裸文字。 */
  function bootSurfaces(ctx) {
    try { window.__PP_HOST_CTX = ctx; injectStyles() } catch (e) { }
    try {
      if (ctx.ai && typeof ctx.ai.registerCtx === 'function') {
        ctx.ai.registerCtx({
          ctx: AI_CTX_REVIEW, name: '证明寻路者 · 阅卷人点评',
          desc: '按四大踩分点（构造声明/前提验证/主体链/结论回扣）+ 四条军规逐段点评用户写的证明',
          def: 'think', latexNeed: true, tools: 'none', recall: false,
        })
      }
    } catch (e) { }
  }

  function mountShell(el, ctx) {
    bootSurfaces(ctx)
    let S = {
      view: 'board',
      boardId: 'bp1',
      path: [],
      pathResult: null,
      hintLevel: 0,
      regress: false,
      illegal: 0,
      proofText: '',
      review: null,
      reviewBusy: false,
      selfCheck: null,
      monster: null,
      monsterMiss: [],
      inventStr: '',
      invent: null,
      predict: null,
      ness: null,
      qgId: 'qg1',
      qg: null,
      ladder: 0,
      ceId: 'ce1',
      ce: null,
      experiment: null,
      mastery: {},
      trig: null,
      trigN: 6,
      trigLeft: 20,
      timerOn: true,
      reasmId: 'rp1',
      reasmOrder: [],
      reasmResult: null,
      auditId: 'au1',
      auditMark: [],
      auditResult: null,
      sessions: [],
      enterT: 0,
      trigT: 0,
    }
    try { let v = ctx.data('ppView'); for (let i = 0; i < VIEWS.length; i++) if (VIEWS[i].k === v) S.view = v } catch (e) { }
    S.sessions = sessionsGet(ctx)
    try { S.trigN = clamp(num(ctx.config('perRound'), 6), 5, 15) } catch (e) { }
    try { S.timerOn = ctx.config('timerOn') !== false } catch (e) { }
    try { let bc = String(ctx.config('defaultCh') || ''); if (bc && bc !== '全部') { let hit = BOARD_PROBLEMS.filter(function (p) { return p.ch.indexOf(bc) >= 0 })[0]; if (hit) S.boardId = hit.id } } catch (e) { }
    /* SRS 掌握度：载入读回，落盘走 ctx.data */
    try { let ms = ctx.data('ppMastery'); if (ms && typeof ms === 'object') S.mastery = ms } catch (e) { }
    function masterySave() { try { ctx.data('ppMastery', S.mastery) } catch (e) { } }
    function masteryBump(bk, right) {
      if (!bk) return
      S.mastery = masteryApply(S.mastery, bk, right, Date.now())
      masterySave()
    }

    let root = document.createElement('div')
    root.className = 'pp-root'
    el.appendChild(root)
    let stageEl = null, dockEl = null, dockInd = null, heroEl = null
    let lastView = ''

    function log(m, lv) { try { ctx.log(m, lv) } catch (e) { } }
    function toast(m, lv) { try { ctx.Toast.show(m, lv, 2600) } catch (e) { } }
    function save() { try { sessionsSave(ctx, S.sessions) } catch (e) { } }

    function paint() {
      let html = ''
      if (S.view === 'board') html = boardHTML(ctx, S)
      else if (S.view === 'trigger') html = triggerHTML(ctx, S)
      else if (S.view === 'reasm') html = reasmHTML(ctx, S)
      else if (S.view === 'audit') html = auditHTML(ctx, S)
      else html = ledgerHTML(ctx, S)
      root.innerHTML = heroHTML(ctx, S) + '<main class="pp-stage">' + html + '</main>'
        + '<div class="pp-dockwrap"><nav class="pp-dock" aria-label="插件导航"><i class="pp-dock-ind"></i>'
        + VIEWS.map(function (v) {
          return '<button class="pp-dock-item" data-view="' + v.k + '" title="' + v.n + '">' + I(v.ic) + '<em>' + v.t + '</em></button>'
        }).join('') + '</nav></div>'
      heroEl = root.querySelector('.pp-hero')
      stageEl = root.querySelector('.pp-stage')
      dockEl = root.querySelector('.pp-dock')
      dockInd = root.querySelector('.pp-dock-ind')
      syncDock()
      /* 进场动画只在视图真切换时重放（duel/pd/pw 同款门控） */
      if (S.view !== lastView) { lastView = S.view; markEnter() }
    }
    function markEnter() {
      root.classList.add('pp-enter')
      if (S.enterT) clearTimeout(S.enterT)
      S.enterT = setTimeout(function () { if (root) root.classList.remove('pp-enter') }, 900)
    }
    function syncDock() {
      if (!dockEl) return
      let items = dockEl.querySelectorAll('.pp-dock-item')
      for (let i = 0; i < items.length; i++) {
        let on = items[i].getAttribute('data-view') === S.view
        items[i].classList.toggle('on', on)
        if (on && dockInd) {
          /* 位移 = offsetLeft - 指示器 left 基位（computed style 读；不回读 rect——transition 中不可信） */
          let baseLeft = parseFloat(getComputedStyle(dockInd).left) || 0
          dockInd.style.transform = 'translateX(' + (items[i].offsetLeft - baseLeft) + 'px)'
          dockInd.style.width = items[i].offsetWidth + 'px'
        }
      }
    }
    function go(k) {
      if (S.view === k) return
      S.view = k
      try { ctx.data('ppView', k) } catch (e) { }
      paint()
    }
    function curBoard() {
      let p = null
      BOARD_PROBLEMS.forEach(function (x) { if (x.id === S.boardId) p = x })
      return p || BOARD_PROBLEMS[0]
    }
    function boardReset() {
      S.path = []
      S.pathResult = null
      S.hintLevel = 0
      S.regress = false
      S.illegal = 0
      S.review = null
      S.selfCheck = null
      S.monster = null
      S.invent = null
      S.predict = null
      try { ctx.keep.set(KEEP_RUN, null) } catch (e) { }
    }
    function persistRun() {
      if (S.view !== 'board' || !S.path.length) return
      try { ctx.keep.set(KEEP_RUN, { boardId: S.boardId, path: S.path }) } catch (e) { }
    }
    function commitSession(mode, score, ref, detail) {
      /* 顺序教训：先落盘再回读——旧写法 unshift 后立刻 sessionsGet，
       * 读到 save 之前的空档，新场次当场蒸发（守门测试抓到） */
      let s = normSession({ id: 'pp-' + Date.now().toString(36) + '-' + hashStr(mode + ref).toString(36).slice(0, 4), at: Date.now(), mode: mode, score: score, ref: ref, detail: detail })
      if (!s) return
      S.sessions = sessionsSave(ctx, [s].concat(S.sessions))
      /* 同构迁移提示（v2.0）：同桥链签名、不同题——你证过的不是题，是结构 */
      if (mode === 'board' && s.detail && s.detail.sig) {
        let t = transferOf(S.sessions.slice(1), s.detail.sig, s.ref)
        if (t) setTimeout(function () {
          toast('同构警报：这条桥链和你证过的「' + t.ref + '」结构相同——换皮题，你已经会了两次。', 'info')
        }, 300)
      }
    }

    /* 触发速答计时器：20s/题，到点自动记未答 */
    function trigTick() {
      if (S.trigT) clearInterval(S.trigT)
      if (!S.timerOn) return
      S.trigT = setInterval(function () {
        if (!S.trig || S.trig.done || S.view !== 'trigger') { clearInterval(S.trigT); S.trigT = 0; return }
        if (S.trig.picked != null) return
        S.trigLeft--
        let tn = root.querySelector('.pp-timer')
        if (tn) { tn.textContent = S.trigLeft + 's'; tn.className = 'pp-timer' + (S.trigLeft <= 5 ? ' low' : '') }
        if (S.trigLeft <= 0) trigPick(-1)
      }, 1000)
    }
    function trigStart() {
      let n = clamp(S.trigN, 1, TRIG_ITEMS.length)
      /* SRS 抽题：到期优先、低掌握桥卡关联题在前（pickTrigOrder 确定性排序） */
      let order = pickTrigOrder(S.mastery, Date.now()).slice(0, n)
      S.trig = { order: order, i: 0, right: 0, picked: null, done: false, streak: 0, bestStreak: 0 }
      S.trigLeft = 20
      paint()
      trigTick()
    }
    function trigPick(i) {
      if (!S.trig || S.trig.done || S.trig.picked != null) return
      let idx = S.trig.order[S.trig.i]
      let t = TRIG_ITEMS[idx]
      S.trig.picked = i
      let hit = i === t.a
      if (hit) { S.trig.right++; S.trig.streak++; S.trig.bestStreak = Math.max(S.trig.bestStreak, S.trig.streak) }
      else S.trig.streak = 0
      masteryBump(TRIG_BK[idx], hit)   /* 答对涨掌握、答错清零到期——下一轮它必然再来 */
      paint()
    }
    function trigNext() {
      if (!S.trig) return
      if (S.trig.i + 1 < S.trig.order.length) {
        S.trig.i++
        S.trig.picked = null
        S.trigLeft = 20
        paint()
        return
      }
      /* 收口 */
      let total = S.trig.order.length, right = S.trig.right
      let score = Math.round(100 * right / Math.max(1, total))
      commitSession('trigger', score, '触发一轮', { right: right, total: total })
      S.trig.done = true
      if (S.trigT) { clearInterval(S.trigT); S.trigT = 0 }
      toast('本轮命中 ' + right + '/' + total + '（' + score + ' 分）', score >= 80 ? 'success' : 'info')
      paint()
    }

    /* ════ 交互 ════ */
    function onClick(e) {
      let a = e.target.closest ? e.target.closest('[data-act],[data-view]') : null
      if (!a) return
      let act = a.getAttribute('data-act')
      if (a.hasAttribute('data-view')) { go(a.getAttribute('data-view')); return }
      if (act === 'quick') {
        let p = BOARD_PROBLEMS[Math.floor(Math.random() * BOARD_PROBLEMS.length)]
        S.boardId = p.id; boardReset(); go('board'); if (S.view !== 'board') { S.view = 'board'; paint() } else paint()
        return
      }
      if (act === 'board-pick') { S.boardId = a.getAttribute('data-id'); boardReset(); paint(); return }
      if (act === 'board-reset') { boardReset(); paint(); return }
      if (act === 'board-hint') { S.hintLevel = Math.min(4, (S.hintLevel || 0) + 1); paint(); return }
      if (act === 'regress') { S.regress = !S.regress; paint(); return }
      if (act === 'ladder') { S.ladder = !S.ladder; paint(); return }
      if (act === 'ce-pick') { S.ceId = a.getAttribute('data-id'); paint(); return }
      if (act === 'ce-pick-opt') {
        let ceg2 = null
        CEGames.forEach(function (x) { if (x.id === S.ceId) ceg2 = x })
        if (!ceg2) ceg2 = CEGames[0]
        if (S.ce && S.ce.gid === ceg2.id && S.ce.picked != null) return
        let i2 = num(a.getAttribute('data-i'), -1)
        let co2 = ceg2.pool[i2]
        if (!co2) return
        S.ce = { gid: ceg2.id, picked: i2 }
        commitSession('cegame', co2.ok ? 100 : 35, ceg2.law.slice(0, 12), { right: co2.ok ? 1 : 0, total: 1 })
        toast(co2.ok ? '反例成立——你打穿了这条命题。' : '这一手没打穿——看清前提与结论的边界。', co2.ok ? 'success' : 'info')
        paint(); return
      }
      if (act === 'experiment') {
        let ex = EXPERIMENTS[curBoard().id]
        if (!ex) return
        let res = ex.run()
        S.experiment = { id: curBoard().id, verdict: res.verdict, rows: res.rows, hint: res.hint }
        paint(); return
      }
      if (act === 'regress-pick') {
        /* 倒推选桥：把该桥欠的前提先立成「预欠债清单」——知道要证什么，再去正向搭 */
        let m = M_BY_K[a.getAttribute('data-k')]
        if (m) { S.regressPick = m.k; toast('倒推锁定「' + m.name + '」：它的入场券就是你要补的作业', 'info') }
        paint(); return
      }
      if (act === 'board-undo') { S.path.pop(); S.pathResult = null; persistRun(); paint(); return }
      if (act === 'monster-pick') {
        if (!S.monster || S.monster.picked != null) return
        let slot = num(a.getAttribute('data-slot'), -1)
        S.monster.picked = slot
        let hit = S.monster.opts[slot] === S.monster.answer
        if (!hit) S.monsterMiss.push(S.monster.tag)
        paint(); return
      }
      if (act === 'monster-close') {
        if (S.monster) {
          let hit = S.monster.picked != null && S.monster.opts[S.monster.picked] === S.monster.answer
          commitSession('monster', hit ? 100 : 30, '怪兽·' + S.monster.tag, { right: hit ? 1 : 0, total: 1 })
        }
        S.monster = null; paint(); return
      }
      if (act === 'invent') {
        let iv = inventCheck(curBoard(), String(S.inventStr || '').trim())
        S.invent = iv
        if (iv.ok) {
          toast('验证通过：你的 F 就是构造表的答案——发明成功', 'success')
          commitSession('invent', 100, curBoard().title, { right: 1, total: 1 })
        }
        paint(); return
      }
      if (act === 'predict') {
        S.predict = num(a.getAttribute('data-v'), 70)
        let r = S.pathResult
        if (r && r.ok) {
          let gap = r.score - S.predict
          S.sessions = sessionsSave(ctx, [normSession({ id: 'pp-c' + Date.now().toString(36), at: Date.now(), mode: 'calib', score: clamp(100 - Math.abs(gap), 0, 100), ref: '校准', detail: { right: r.score, total: S.predict } })].concat(S.sessions))
        }
        paint(); return
      }
      if (act === 'ness-pick') {
        let p3 = curBoard()
        S.ness = { pick: num(a.getAttribute('data-i'), 0), hit: a.getAttribute('data-t') === (p3.necessity || {}).tag }
        commitSession('necessity', S.ness.hit ? 100 : 30, p3.title, { right: S.ness.hit ? 1 : 0, total: 1 })
        paint(); return
      }
      if (act === 'qg-pick') { S.qgId = a.getAttribute('data-id'); S.qg = null; paint(); return }
      if (act === 'qg-pick-opt') {
        if (!S.qg || S.qg.picked != null) return
        let g3 = null
        QGAMES.forEach(function (x) { if (x.id === S.qgId) g3 = x })
        if (!g3) g3 = QGAMES[0]
        S.qg.picked = num(a.getAttribute('data-i'), -1)
        let jd = qgJudge(g3.rounds[S.qg.i], S.qg.picked)
        if (jd.ok) S.qg.wins++
        paint(); return
      }
      if (act === 'qg-next') {
        if (!S.qg) return
        S.qg.i++
        S.qg.picked = null
        let g4 = null
        QGAMES.forEach(function (x) { if (x.id === S.qgId) g4 = x })
        if (!g4) g4 = QGAMES[0]
        if (S.qg.i >= g4.rounds.length) {
          commitSession('qgame', Math.round(100 * S.qg.wins / g4.rounds.length), g4.law.slice(0, 12), { right: S.qg.wins, total: g4.rounds.length })
          masteryBump('contra', S.qg.wins === g4.rounds.length)
        }
        paint(); return
      }
      if (act === 'qg-reset') { S.qg = { i: 0, wins: 0, picked: null }; paint(); return }
      if (act === 'bridge') {
        let m = M_BY_K[a.getAttribute('data-k')]
        if (!m) return
        let p = curBoard()
        S.path.push(m.k)
        persistRun()
        /* v2.0：缺前提不再拦死——桥照搭，但挂账（债务台账可见、结算扣分），
         * 且首次挂账时概率触发怪兽伏击（Lakatos：用反例认识前提的边界） */
        let dd = debtOf(p, S.path)
        let newDebt = dd.debts.filter(function (d) { return d.bridge === m.k })
        if (newDebt.length) {
          S.illegal++
          S.lastMiss = m.k
          toast('「' + m.name + '」先欠后还：' + newDebt.map(function (d) { return d.tag }).join('、') + ' 已记账——结算前务必清偿', 'warn')
          if (!S.monster && dd.circular.length === 0) {
            let seed = hashStr(p.id + m.k + newDebt[0].tag) % 10
            if (seed < 4) {
              let tag = newDebt[0].tag
              let answer = -1
              MONSTERS.forEach(function (mo, mi) { if (answer < 0 && mo.breaks.indexOf(tag) >= 0) answer = mi })
              if (answer >= 0) {
                let opts = shuffle(MONSTERS.map(function (_, i) { return i }), 'mo' + tag).slice(0, 3)
                if (opts.indexOf(answer) < 0) opts[1] = answer
                S.monster = { tag: tag, opts: shuffle(opts, 'mo' + Date.now()), answer: opts.indexOf(answer), picked: null }
              }
            }
          }
        }
        /* 循环论证报警 */
        if (dd.circular.length) toast(dd.circular[0], 'danger')
        let r = pathScore(p, S.path, S.illegal, { hintLevel: S.hintLevel || 0 })
        if (r.ok) {
          S.pathResult = r
          if (r.debts.length) toast('到是到了，但挂着 ' + r.debts.length + ' 笔债——先还债再收口，否则按笔扣分', 'warn')
          else {
            commitSession('board', r.score, p.title, { steps: r.used, best: p.best, unused: (r.unused || []).length, miss: S.lastMiss || '', cert: r.certified ? 1 : 0, debts: 0, hint: S.hintLevel || 0, sig: chainSig(S.path), sk: skeletonOf(p, S.path) })
            try { ctx.keep.set(KEEP_RUN, null) } catch (e2) { }
            toast('桥搭通且账目清白：寻路得分 ' + r.score + (r.unused && r.unused.length ? '（有 ' + r.unused.length + ' 个条件没消费）' : ''), 'success')
            METHODS.forEach(function (mm) { if (S.path.indexOf(mm.k) >= 0) masteryBump(mm.k, true) })
          }
        } else {
          S.pathResult = null
        }
        paint()
        return
      }
      if (act === 'debt-pay') {
        /* 还债动作：declare 补声明 / nonzero 补除法验证 / 其余靠正确搭桥清偿 */
        let tag = a.getAttribute('data-tag')
        if (tag === 'cont' || tag === 'diff' || tag === 'diff2') { if (S.path.indexOf('declare') < 0) S.path.push('declare') }
        else if (tag === 'gNe0') { if (S.path.indexOf('nonzero') < 0) S.path.push('nonzero') }
        else { toast('「' + tag + '」不能口头挂账——它得靠正确的桥推出来（试试倒推按钮）', 'warn'); return }
        persistRun()
        let p2 = curBoard()
        let r2 = pathScore(p2, S.path, S.illegal, { hintLevel: S.hintLevel || 0 })
        if (r2.ok) {
          S.pathResult = r2
          if (!r2.debts.length) {
            commitSession('board', r2.score, p2.title, { steps: r2.used, best: p2.best, unused: (r2.unused || []).length, miss: S.lastMiss || '', cert: r2.certified ? 1 : 0, debts: 0, hint: S.hintLevel || 0, sig: chainSig(S.path), sk: skeletonOf(p2, S.path) })
            try { ctx.keep.set(KEEP_RUN, null) } catch (e2) { }
            toast('债务清偿，账目清白：寻路得分 ' + r2.score, 'success')
          }
        }
        paint(); return
      }
      if (act === 'review') { runReview(); return }
      if (act === 'selfcheck') { S.selfCheck = {}; S.review = null; paint(); return }
      if (act === 'trig-start') { trigStart(); return }
      if (act === 'trig-pick') { trigPick(num(a.getAttribute('data-i'), -1)); return }
      if (act === 'trig-next') { trigNext(); return }
      if (act === 'reasm-pick') { S.reasmId = a.getAttribute('data-id'); S.reasmOrder = []; S.reasmResult = null; paint(); return }
      if (act === 'reasm-take') { S.reasmOrder.push(num(a.getAttribute('data-i'), 0)); paint(); return }
      if (act === 'reasm-unpick') {
        let i = num(a.getAttribute('data-i'), -1)
        if (!S.reasmResult && i >= 0 && i < S.reasmOrder.length) { S.reasmOrder.splice(i, 1); paint() }
        return
      }
      if (act === 'reasm-check') {
        let set = REASM_SETS.filter(function (x) { return x.id === S.reasmId })[0] || REASM_SETS[0]
        let correct = set.steps.map(function (_, i) { return i })
        let r = reasmScore(S.reasmOrder, correct)
        S.reasmResult = r
        commitSession('reasm', r.score, set.title.slice(0, 12), { right: r.hits, total: r.total })
        toast('拼图 ' + r.hits + '/' + r.total + ' 位正确（' + r.score + ' 分）', r.score >= 80 ? 'success' : 'info')
        paint()
        return
      }
      if (act === 'reasm-retry') { S.reasmOrder = []; S.reasmResult = null; S.reasmShuffle = null; paint(); return }
      if (act === 'audit-pick') { S.auditId = a.getAttribute('data-id'); S.auditMark = []; S.auditResult = null; paint(); return }
      if (act === 'audit-mark') {
        if (S.auditResult) return
        let i = num(a.getAttribute('data-i'), -1)
        let at = S.auditMark.indexOf(i)
        if (at >= 0) S.auditMark.splice(at, 1); else S.auditMark.push(i)
        paint()
        return
      }
      if (act === 'audit-reset') { S.auditMark = []; paint(); return }
      if (act === 'audit-submit') {
        let set = AUDIT_SETS.filter(function (x) { return x.id === S.auditId })[0] || AUDIT_SETS[0]
        let r = auditScore(S.auditMark, set.lines)
        S.auditResult = r
        commitSession('audit', r.score, set.title.slice(0, 12), { right: r.tp, total: r.nBad, miss: '' })
        toast('排雷 F1 ' + r.score + '（漏 ' + r.fn + ' 误 ' + r.fp + '）', r.score >= 75 ? 'success' : 'info')
        paint()
        return
      }
      if (act === 'audit-retry') {
        let idx = AUDIT_SETS.map(function (x) { return x.id }).indexOf(S.auditId)
        S.auditId = AUDIT_SETS[(idx + 1) % AUDIT_SETS.length].id
        S.auditMark = []; S.auditResult = null; paint(); return
      }
      if (act === 'export') {
        try { ctx.api.download('证明寻路者-档案.json', JSON.stringify({ v: 1, sessions: S.sessions }, null, 2), 'application/json') } catch (e2) { toast('导出失败', 'danger') }
        return
      }
      if (act === 'wipe') {
        ctx.api.confirm('清空训练档案？', '将删除全部 ' + S.sessions.length + ' 场训练记录，<b>不可恢复</b>——如需保留请先「导出」，之后可在本页重新导入。站内题库与错题本不受影响。', function () {
          S.sessions = sessionsSave(ctx, [])
          toast('已清空', 'success')
          paint()
        }, true)
        return
      }
    }
    function onInput(e) {
      let t = e.target
      if (!t || !t.getAttribute) return
      let f = t.getAttribute('data-pp')
      if (f === 'proof') { S.proofText = t.value.slice(0, 4000) }
      else if (f === 'invent') { S.inventStr = t.value.slice(0, 80) }
    }
    function onChange(e) {
      let t = e.target
      if (t && t.getAttribute && t.getAttribute('data-act') === 'scbox') {
        let i = num(t.getAttribute('data-i'), -1)
        if (S.selfCheck && i >= 0) {
          S.selfCheck[i] = !!t.checked
          let n = Object.keys(S.selfCheck).filter(function (k) { return S.selfCheck[k] }).length
          if (n === BLOCKS.length) {
            commitSession('board', 60, '自检通过', { steps: 0, best: 0, unused: 0 })
            toast('自检全勾：骨架齐了。要真分数，去寻路板把桥走通再誊写。', 'info')
          }
        }
      }
    }
    function onKey(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (document.querySelector('.pp-modal.on, #modal-overlay')) return
      let tg = e.target && e.target.tagName
      if (tg === 'INPUT' || tg === 'TEXTAREA' || tg === 'SELECT') return
      if (e.key >= '1' && e.key <= '5') { let v = VIEWS[num(e.key, 1) - 1]; if (v) { e.preventDefault(); go(v.k) } return }
      if (e.key === 'd' || e.key === 'D') { e.preventDefault(); let p = BOARD_PROBLEMS[Math.floor(Math.random() * BOARD_PROBLEMS.length)]; S.boardId = p.id; boardReset(); go('board'); paint() }
    }
    function onScroll() {
      if (!heroEl) return
      let on = (window.scrollY || window.pageYOffset || 0) > 12
      heroEl.classList.toggle('stuck', on)
    }
    function onResize() { syncDock() }

    root.addEventListener('click', onClick)
    root.addEventListener('input', onInput)
    root.addEventListener('change', onChange)
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)

    /* 在场恢复：寻路板半程 */
    try {
      let keep = ctx.keep.get(KEEP_RUN, null)
      if (keep && keep.boardId && Array.isArray(keep.path) && keep.path.length) {
        S.boardId = keep.boardId
        S.path = keep.path.filter(function (k) { return !!M_BY_K[k] })
      }
    } catch (e) { }

    paint()

    /* AI 阅卷人点评 */
    function runReview() {
      if (S.reviewBusy) return
      let p = curBoard()
      let txt = String(S.proofText || '').trim()
      if (txt.length < 20) { toast('先把证明写出来（或至少写骨架）再送阅卷', 'warn'); return }
      if (!ctx.ai || !ctx.ai.has || !ctx.ai.has()) {
        S.selfCheck = {}
        S.review = null
        toast('未配置 AI：退回自检清单——四大踩分点 + 四条军规逐项打勾', 'info')
        paint()
        return
      }
      S.reviewBusy = true
      paint()
      let sys = '你是考研数学阅卷组长，只按这份口径评证明：四大踩分点——①构造辅助函数并声明连续可导（2-3分）②定理前提逐条验证（2-3分）③主体推理链条（3-4分）④结论原样回扣（1分）；四条军规——①引入函数必声明分析性质②除法之前先证分母非零③「任意/存在」量词顺序不能乱④严格不等式要有严格论证。输出 JSON：{"total":0-100,"blocks":[{"name":"踩分点名","pts":"分值","note":"点评"}],"worst":"最伤的一句原话或空串"}。blocks 固定四项按名给分。点评要狠而准，不夸虚分。'
      let usr = '【题目】' + p.stem + '\n【标准骨架】' + p.tip + '\n【考生证明】\n' + txt
      ctx.ai.json(sys, usr, { ctx: AI_CTX_REVIEW, timeout: 90000 }).then(function (o) {
        S.reviewBusy = false
        let rv = o && typeof o === 'object' ? o : null
        if (rv && Array.isArray(rv.blocks)) {
          rv.total = clamp(num(rv.total, 0), 0, 100)
          rv.blocks = rv.blocks.slice(0, 4).map(function (b) { return { name: String(b.name || '').slice(0, 20), pts: String(b.pts || '').slice(0, 10), note: String(b.note || '').slice(0, 160) } })
          S.review = rv
          commitSession('board', rv.total, 'AI 阅卷', { steps: S.path.length, best: p.best, unused: 0 })
        } else {
          toast('阅卷返回不合契约，退回自检清单', 'warn')
          S.selfCheck = {}
        }
        paint()
      }).catch(function (err) {
        S.reviewBusy = false
        toast('AI 阅卷失败：' + trunc(String(err && err.message || err), 30) + '——已退回自检清单', 'warn')
        S.selfCheck = {}
        paint()
      })
    }

    return function destroy() {
      if (S.trigT) { clearInterval(S.trigT); S.trigT = 0 }
      if (S.enterT) clearTimeout(S.enterT)
      persistRun()
      root.removeEventListener('click', onClick)
      root.removeEventListener('input', onInput)
      root.removeEventListener('change', onChange)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      try { let st = document.getElementById(STYLE_ID); if (st) st.remove() } catch (e) { }
      root.remove()
      window.__PP_HOST_CTX = null
    }
  }

  /* ════════════════════════ 13. manifest ════════════════════════ */
  let api = {
    id: T_MAIN,
    name: '证明寻路者',
    version: VERSION,
    author: 'kaoyan-v2',
    desc: '把证明题当搜索题来练，融合八种前沿概念：寻路板（双向搜索+证明债务——缺的前提挂账不拦路，'
      + 'Isabelle 式义务追踪，循环论证当场报警）、辅助函数发明器（内置迷你 CAS 真求导，验证你自造的 F，'
      + 'Kapur 先发明后教学）、量化博弈（Lorenzen 对话语义：∀∃ 顺序就是对手先出招你应答，Skolem 依赖判卷）、'
      + '积木质检（Lakatos 条件反事实：抽掉哪块楼就塌）、怪兽伏击（病理函数库 x²sin1x/Dirichlet/Weierstrass）、'
      + '提示阶梯+校准预测（元认知）、同构迁移（桥链签名撞车=你已会孪生题）、抽象阶梯（Polya 特化下潜）。'
      + '内容蒸馏自内部讲义《证明类大题专题》35 章体系；纯确定性零 AI 可跑，AI 阅卷人点评可选。',
    tools: [{ id: T_MAIN, title: '证明寻路者', icon: MARK_ICON, mount: mountShell }],
    init: function (ctx) { bootSurfaces(ctx) },
    config: [
      { key: 'perRound', label: '触发速答每题数（5-15）', type: 'number', default: 6 },
      { key: 'timerOn', label: '触发速答 20 秒限时', type: 'bool', default: true },
      { key: 'defaultCh', label: '默认章节', type: 'select', default: '全部', options: ['全部', '第2章', '第3章', '第4章', '第5章', '第6章', '第8章', '第11章'] },
    ],
    hooks: {
      quizDone: function (ctx) {
        try {
          let k = ctx.keep.get('ppNudgeDay')
          let tk = dkey()
          if (k === tk) return
          ctx.keep.set('ppNudgeDay', tk)
          let h = habitsOf(sessionsGet(ctx))
          if (!h || h.n < 2) return
          if (h.trigHit != null && h.trigHit < 60) ctx.notify('证明寻路者：触发命中率 ' + h.trigHit + '%——构造表七行还没背穿，去「触发」练一轮。')
        } catch (e) { }
      },
    },
    queries: [
      {
        key: 'pp-stats', label: '证明寻路者 · 训练档案（四率体检）',
        run: function (ctx) {
          let h = habitsOf(sessionsGet(ctx))
          if (!h) return '证明寻路者还没有训练记录。建议从寻路板 bp1（乘积导数型罗尔）开始。'
          return '证明寻路者档案：总 ' + h.n + ' 场（寻路 ' + h.boardN + '/触发 ' + h.trigN + '/拼图 ' + h.reasmN + '/关卡 ' + h.auditN + '）。'
            + '寻路均分 ' + (h.boardAvg == null ? '—' : h.boardAvg) + '，触发命中 ' + (h.trigHit == null ? '—' : h.trigHit + '%')
            + '，拼图均分 ' + (h.reasmAvg == null ? '—' : h.reasmAvg) + '，军规关卡均分 ' + (h.auditAvg == null ? '—' : h.auditAvg) + '。'
            + (h.weakList.length ? '弱项桥卡：' + h.weakList.map(function (k) { return (M_BY_K[k] || {}).name || k }).join('、') + '。' : '暂无明显弱项桥。')
        },
      },
      {
        key: 'pp-method', label: '证明方法桥卡查询（按名字/章节关键词）',
        run: function (ctx, arg) {
          let q = String(arg || '').trim()
          if (!q) return '用法：pp-method 罗尔 / 泰勒 / 递推 / 积分 / 秩 …… 返回对应桥卡与触发表行。'
          let hit = METHODS.filter(function (m) { return m.name.indexOf(q) >= 0 || m.k.indexOf(q.toLowerCase()) >= 0 || m.tip.indexOf(q) >= 0 })
          if (!hit.length) return '桥卡库里没有含「' + q + '」的方法。可用的桥：' + METHODS.map(function (m) { return m.name }).join('、') + '。'
          return hit.slice(0, 3).map(function (m) { return '【' + m.name + '】入场券：' + m.req.join(' + ') + ' → 产出：' + m.out.join(' + ') + '。' + m.tip }).join('\n')
        },
      },
    ],
    shortcuts: [
      {
        key: 'alt+b', label: '直达证明寻路板',
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
        id: 'pp-today', title: '证明寻路者 · 今日', icon: MARK_ICON, width: 300, height: 240,
        render: function (ctx) {
          let list = sessionsGet(ctx)
          let h = habitsOf(list)
          let today = dkey()
          let todayN = 0
          list.forEach(function (s) { if (dkey(s.at) === today) todayN++ })
          let MODE_CN = { board: '寻路', trigger: '触发', reasm: '拼图', audit: '关卡', monster: '怪兽', invent: '发明', calib: '校准', qgame: '博弈', necessity: '必要性', cegame: '反例博弈' }
          let out = ['<div class="pp-panel">']
          out.push('<div class="pp-panel-kpis">'
            + '<div><b>' + todayN + '</b><span>今日场次</span></div>'
            + '<div><b>' + (h && h.trigHit != null ? h.trigHit + '%' : '—') + '</b><span>触发命中</span></div>'
            + '<div><b>' + (h && h.boardAvg != null ? h.boardAvg : '—') + '</b><span>寻路均分</span></div></div>')
          if (!list.length) out.push('<div class="pp-panel-empty">还没搭过桥。去寻路板把第一道罗尔题的条件推到目标。</div>')
          else {
            out.push('<div class="pp-panel-list">')
            for (let i = 0; i < Math.min(4, list.length); i++) {
              let x = list[i]
              let tag = x.score >= 80 ? '<i class="ok">' + x.score + ' 分</i>' : '<i class="warn">' + x.score + ' 分</i>'
              out.push('<div class="pp-panel-row"><span>' + fmtTime(x.at) + ' · ' + (MODE_CN[x.mode] || x.mode) + (x.ref ? ' · ' + esc(trunc(x.ref, 10)) : '') + '</span>' + tag + '</div>')
            }
            out.push('</div>')
          }
          out.push('</div>')
          return out.join('')
        },
      },
    ],
    memory: '用户装有「证明寻路者」插件：按内部讲义《证明类大题专题》的方法论练证明——证明=条件到结论的搜索（桥卡/触发表/构造表/决策表/四条军规/四大踩分点）。当用户提到「不会证明」「辅助函数想不到」「中值定理」'
      + '「写证明丢分」时，可用 queries：pp-stats（四率档案）、pp-method（桥卡查询）；AI 场景 plugin.proof-pathfinder.review 做阅卷人点评。',
  }

  if (DEBUG) {
    window.__ppInternals = {
      VERSION: VERSION, METHODS: METHODS, M_BY_K: M_BY_K, BOARD_PROBLEMS: BOARD_PROBLEMS,
      TRIG_ITEMS: TRIG_ITEMS, REASM_SETS: REASM_SETS, AUDIT_SETS: AUDIT_SETS, TABLES: TABLES, BLOCKS: BLOCKS,
      normSession: normSession, sessionsGet: sessionsGet, sessionsSave: sessionsSave,
      pathScore: pathScore, reasmScore: reasmScore, auditScore: auditScore, habitsOf: habitsOf, adviceFor: adviceFor,
      /* v2.0 概念层 */
      DEBT_TEXT: DEBT_TEXT, MONSTERS: MONSTERS, TRIG_BK: TRIG_BK,
      parseExpr: parseExpr, flatten: flatten, diff: diff, normTerms: normTerms,
      matchGoal: matchGoal, ppTerms: ppTerms, exKey: exKey, exSplit: exSplit,
      inventCheck: inventCheck, debtOf: debtOf, dischargeDebts: dischargeDebts,
      pickTrigOrder: pickTrigOrder, masteryApply: masteryApply,
      supplyGraph: supplyGraph, diagnose: diagnose, hintLadder: hintLadder,
      QGAMES: QGAMES, LADDER: LADDER, qgJudge: qgJudge, chainSig: chainSig, transferOf: transferOf,
      SKELETONS: SKELETONS, skeletonOf: skeletonOf, POLYA: POLYA, polyyaAdvice: polyyaAdvice,
      CEGames: CEGames, beautyOf: beautyOf, EXPERIMENTS: EXPERIMENTS,
      CSS: CSS,
    }
  }

  try {
    if (window.PluginBus && window.PluginBus.register) window.PluginBus.register(api)
    else if (DEBUG) console.warn('[proof-pathfinder] PluginBus 未就绪')
  } catch (e) {
    if (DEBUG) console.error('[proof-pathfinder] 注册失败', e)
  }
})()
