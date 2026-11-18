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

  let VERSION = '3.0.0'
  let T_MAIN = 'proof-pathfinder'
  let STYLE_ID = 'pp-skin-style'
  let AI_CTX_REVIEW = 'plugin.proof-pathfinder.review'
  let KEEP_RUN = 'ppRun'          // 寻路板进行中的题（单槽）
  let KEEP_ED = 'ppEd'            // 证明编辑器进行中的证明（单槽）
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
  function motherChip(p) {
    let mo = null
    MOTHERS.forEach(function (m) { if (m.no === p.mother) mo = m })
    if (!mo) return ''
    return '<span class="pp-mother" title="' + esc(mo.skel) + '">' + CIRCLED[mo.no - 1] + ' ' + esc(mo.name) + '</span>'
  }
  /** 题条按钮短标签：先摘掉数学段再截断——裸 slice 会把 $...$ 拦腰斩成孤儿 $，
   *  texauto 的 .tex-auto-src 锁（skipNode 不回头）让残 $ 永远以源码示人（v2.8 巡检教训） */
  function segLabel(s, n) {
    let t = String(s || '').replace(/\$[^$]*\$/g, '').replace(/[「」]/g, '')
    if (t.replace(/\s/g, '').length < 3) t = String(s || '').replace(/\\[a-zA-Z]+/g, '').replace(/[「」$]/g, '')
    return esc(t.trim().slice(0, n))
  }
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
    { k: 'constvar', name: '常数变易法', req: ['twoVar'], out: ['oneVar', 'gDef', 'g0'], tip: '双变量 x,y：固定一边为常数 a 并作差——得到 g 与白送的 g(基点)=0，接单调性法。' },
    { k: 'monoBound', name: '单调有界准则', req: ['recur'], out: ['conv'], tip: '递推数列四步全在这座桥里：解不动点猜极限 → 归纳证有界 → 作差判单调 → 取极限。必须先证收敛再取极限（逻辑硬伤点）。' },
    { k: 'squeeze', name: '夹逼准则', req: ['twoSide'], out: ['conv'], tip: 'n 项和式：最大项最小项夹住整体；两端极限相等即收口。' },
    { k: 'comp', name: '压缩映射', req: ['recur', 'lipK'], out: ['conv', 'unique'], tip: '不单调的递推：|f(x)-f(y)| ≤ k|x-y| (k<1)，逐次缩距证收敛，顺带唯一性。' },
    { k: 'varInt', name: '变限积分桥', req: ['cont', 'intZero'], out: ['eqEnd', 'dZero', 'root'], tip: '积分条件的标准消化法：令 $F(x)=\\int_0^x f$，则 $F\'=f$ 且端点值为零——积分题翻译成微分题，$F\'(\\eta)=0$ 即 $f(\\eta)=0$。' },
    { k: 'rankOp', name: '秩运算三板斧', req: ['matCond'], out: ['rankIneq'], tip: 'AB=O → r(A)+r(B) ≤ n；乘矩阵不增秩；分块秩不等式。线性证明的地基。' },
    { k: 'eigDef', name: '特征定义展开', req: ['matCond', 'xNe0'], out: ['eigEq'], tip: 'Ax=λx 两边左乘需要的矩阵、内积展开——特征值证明没有魔法，全是定义左乘右乘。' },
    { k: 'symDel', name: '对称性消元', req: ['oddFn', 'symDom'], out: ['intZero'], tip: '奇函数 × 对称区域 = 0。不用算就能消灭的积分。' },
    { k: 'swapLim', name: '一致收敛换序', req: ['unifConv', 'cont'], out: ['canSwap'], tip: '极限号与积分/求导换序的通行证：一致收敛（或 M 判别法先证）+ 各项连续——换不了序=没资格。' },
    { k: 'contra', name: '反证法', req: ['anyGoal'], out: ['absurd'], tip: '「至多一个」「不含零点」类：反设两个/存在，推出与题设矛盾。' },
    { k: 'callback', name: '结论回扣', req: ['dZero'], out: ['done'], tip: '推出 F\'(ξ)=0 之后必须再一步「即 ……」翻译回题目原式——阅卷踩分点 1 分。' },
    { k: 'declare', name: '性质声明', req: ['anyGoal'], out: ['certify'], tip: '每引入一个函数，立刻声明连续/可导——所有中值定理的入场券（军规一，2-3 分）。' },
    { k: 'nonzero', name: '除法验证', req: ['anyGoal'], out: ['gNe0'], tip: '军规二：除法/柯西之前先证分母（g\'、b-a、e^{φ}）不为零——声明它，债务即清。' },
    { k: 'fp', name: '不动点双门', req: ['cont', 'signDiff', 'lipK'], out: ['unique'], tip: '存在性：令 F=φ-x 用零点定理；唯一性再开一扇门：反设 ξ≠η，压缩不等式 (1-k)|ξ-η|≤0 逼出重合（例 14.1）。' },
    { k: 'replay', name: '区间再现换元', req: ['cont', 'symDom'], out: ['intVal'], tip: '换元 x=a+b-x 与原式相加——「零件」在换元下不变，x 自己消掉（例 8.2：∫xf(sin) 的经典杀法）。' },
    { k: 'cmp', name: '比较原理', req: ['serConv', 'posTerm'], out: ['serConv2'], tip: '大级数收敛⇒小级数收敛；派生级数三大高频构造：均值不等式、柯西-施瓦茨、√n 放缩（例 9.1）。' },
    { k: 'mtest', name: 'M 判别法', req: ['majConv'], out: ['unifConv'], tip: '优级数收敛⇒一致（且绝对）收敛；判「不一致」首选和函数不连续反证，不硬算余项（例 15.2/15.3）。' },
    { k: 'gree', name: '格林路独立', req: ['cont', 'pderEq'], out: ['pathIndep'], tip: '∂P/∂y=∂Q/∂x + 单连通 = 路径独立许可证；拿到证后换直线段，被积函数当场退化（例 18.3 四等价）。' },
    { k: 'dblRoot', name: '双零点模型', req: ['cont', 'intZero', 'intXZero'], out: ['root2'], tip: 'F=∫f 白送两个端点零点，分部+介值逼出第三个等值点——相邻罗尔各打一发，单零点升级双零点（例 3.3 进化）。' },
    { k: 'symOrth', name: '同一内积两算', req: ['matCond', 'xNe0'], out: ['orth'], tip: '(Aα)·β 用 A\'=A 换成 α·(Aβ)——对称矩阵让 A 在内积间自由穿梭，(λ-μ)(α·β)=0 收口（例 12.2）。' },
    { k: 'cheb', name: '切比雪夫二重化', req: ['cont', 'sameMono'], out: ['ineq'], tip: '同单调 ⇒ (f(x)-f(y))(g(x)-g(y))≥0，二重积分展开即得 ∫fg≥∫f·∫g——「自己加自己」的升维技巧（例 16.3）。' },
    /* v2.8：第 19-35 章 + 母题谱系新桥 */
    { k: 'posDef', name: '正定四段梯', req: ['matCond', 'xNe0'], out: ['posDef'], tip: '默认顺序（清单19）：定义 → 特征值全正 → 顺序主子式 → 拼 C\'C。实对称是入场前提，特征向量非零是内积穿梭的除数（定理 19.1 三等价）。' },
    { k: 'adjRank', name: '伴随恒等式', req: ['matCond', 'detNe0'], out: ['rankIneq'], tip: 'AA*=|A|E 两边取行列式定 |A*|；秩三段各自讨论：可逆直乘 / n-1 列空间夹逼 / ≤n-2 子式全零（例 20.1）。' },
    { k: 'block', name: 'Schur 分块', req: ['matCond', 'detNe0'], out: ['detVal'], tip: '主块可逆先化对角：|A||D-CA⁻¹B|——分块行列式的万能钥匙；例 20.2 的 Schur 补（清单18：先翻译再动手）。' },
    { k: 'convex', name: '凸性三刀', req: ['diff2', 'cont'], out: ['ineq'], tip: 'f\'\'≥0 定号后三选一（定理 26.1 三等价）：切线在下 / 弦在上 / Jensen 加权；闭区间连续让端点代入合法（母题⑪凸性三刀）。' },
    { k: 'darboux', name: '达布反串', req: ['diff', 'signDiff'], out: ['dZero'], tip: '对 f\' 用介值前必须先声明达布定理（母题⑫：导数无第一类间断）——不声明就是军规三级别的量词事故。' },
    { k: 'bonnet', name: '第二中值 Bonnet', req: ['intg', 'monoF'], out: ['intVal'], tip: 'f 可积、g 单调 ⇒ ∫fg=g(a+)∫_a^ξ f——「单调的提出来，振荡的积分段」；定理 28.2 分部+放大收口。' },
    { k: 'stolz', name: 'Stolz 离散洛必达', req: ['denInf', 'ratioLim'], out: ['limVal'], tip: '分母严格增趋于 +∞ 才准「分子分母差分比」——和式极限的重武器（第 34 章），条件不足时用柯西准则兜底。' },
    { k: 'unbiased', name: '拆平方期望', req: ['expLin', 'indp'], out: ['unbiased'], tip: '无偏性全部技术=拆平方+期望线性：交叉项求和自动归零，D(X̄)=σ²/n 靠独立性入场（定理 33.1）。' },
    { k: 'variance', name: '非负放大器', req: ['probSet'], out: ['ineq'], tip: '概率证明找天然非负量：方差 / (t-Z)² / 指示函数——展开它就是证明（母题⑧：切比雪夫不等式的出生方式）。' },
    { k: 'compact', name: '紧性拼接', req: ['cont', 'tailLim'], out: ['unifCont'], tip: '无穷区间一致连续三段论：尾段极限存在管远处、头部紧性管有限段、中转点衔接（母题⑨，定理 13.x）。' },
    { k: 'odespace', name: '解空间同构', req: ['matCond', 'intg'], out: ['solStruct'], tip: 'ODE 解结构=线代解结构的分析版（母题⑬）：齐次通解=基础解组线性组合，特解+核——特征值翻译重根情形。' },
    /* —— v2.9 新章桥：第 10/17/22/28/30/32/35 章 —— */
    { k: 'wronks', name: '朗斯基微分方程', req: ['isSol', 'pCont'], out: ['detEq'], tip: '对 W=y1y2\'-y1\'y2 直接求导，把 y_i\'\'=-py_i\'-qy_i 代入——q 消掉只剩 W\'=-pW，一阶线性积分出恒等式（例 10.1）。' },
    { k: 'superp', name: '叠加+唯一性', req: ['isSol', 'sameIC'], out: ['sameFun'], tip: '线性方程解之差仍是解（叠加原理），零函数同初值——唯一性定理把两条解曲线焊死（例 10.2：先造新解再请唯一性）。' },
    { k: 'nonDiff', name: '路径测试反证', req: ['partEx', 'pathTest'], out: ['notDiff'], tip: '可微要求增量=AΔx+BΔy+o(ρ) 与路径无关——沿 y=kx 两路径主部不同 ⇒ 不可微。|xy| 的原函数版判例（例 10.3）。' },
    { k: 'implF', name: '隐函数三板斧', req: ['pCont', 'fNe0'], out: ['yEx'], tip: '偏导定号劈出局部矩形→一元介值给存在、严格单调给唯一→有界+子列论证接上连续（定理 17.2 全程就这三刀）。' },
    { k: 'lagrMul', name: '降维费马', req: ['consExt', 'yEx'], out: ['colline'], tip: '把条件极值降成一元：约束曲线光滑（隐函数定理供）→限制到曲线用费马→梯度行列式为零=两向量共线（例 17.3）。' },
    { k: 'induct', name: '归纳起步双验', req: ['baseN', 'stepK'], out: ['forAll'], tip: '第一归纳法：起点+递推步。讲义点名的死因是「起点平移没跟上」——性质从 n0 起才成立时，起点单独验、假设写 n≥n0（例 22.1/22.2）。' },
    { k: 'fixShift', name: '不动点平移', req: ['recur', 'fixedPt'], out: ['geoForm'], tip: '解 f(L)=L 取不动点，令 b_n=a_n-L——递推在不动点附近线性化成等比型（母题④的构造臂，例 22.3/14.3）。' },
    { k: 'perSplit', name: '周期拆段相消', req: ['cont', 'periodic'], out: ['transInv'], tip: '把 ∫_a^{a+T} 劈成 0~a + a~T + T~a+T，末段换元 u=x-T 与首段相消——平移不变性的全部机关就一次拆+一次换元（定理 28.3）。' },
    { k: 'periodF', name: '原函数周期分解', req: ['cont', 'periodic', 'intZeroT'], out: ['perFun'], tip: 'F(x)= 均值·x + 周期项 P(x) 的分解：减掉线性项后验证 P(x+T)=P(x) 恰好消耗 ∫₀ᵀf=0——原函数同周期 ⟺ 一周期积分为零（例 28.1）。' },
    { k: 'wallis', name: 'Wallis 分部递推', req: ['intg', 'nNat'], out: ['intRec', 'twoSide'], tip: '分部积分给 I_n=((n-1)/n)I_{n-2} 双路递推，相邻乘积 J_nJ_{n+1} 干净——单调性把 I_n/I_{n+1} 夹向 1（例 28.3 的递推+夹逼双引擎）。' },
    { k: 'convDen', name: '卷积求导法', req: ['indp', 'dens'], out: ['convDens'], tip: '先对分布函数积分、变限求导（Leibniz 端点项为零）——f_Z(z)=∫f(x)g(z-x)dx。独立性把联合密度拆成乘积是第一块骨牌（例 30.1）。' },
    { k: 'maxDist', name: '分布函数法', req: ['indp', 'cdf'], out: ['maxCdf'], tip: '最大值不问密度问事件：{max≤z}={每一个≤z}——独立性把概率变乘积，再求导得密度。最小值取补事件 {min>z}（例 30.2 的离散化思想）。' },
    { k: 'pBase', name: 'p 积分基准', req: ['posF', 'pRange'], out: ['intConv'], tip: '反常积分判敛先把 p=1 基准背熟：∫₁^∞x^{-p} 当 p>1 收敛，∫₀¹x^{-p} 当 p<1 收敛——两条互补是全部比较判法的参照系（例 32.1）。' },
    { k: 'cmpInt', name: '极限比较基准', req: ['posF', 'cmpK', 'intRef'], out: ['intConv'], tip: '正被积函数找等价主部：lim f/g=c∈(0,∞) 时同敛散——把大题化为 p 基准一句话。g 的选取=端点主部提取（例 32.2 的「找替身」）。' },
    { k: 'proj', name: '正交投影系', req: ['sqIntg', 'trigSet'], out: ['besselIneq'], tip: '系数=内积投影，Bessel=「残差非负」的展开式——三角系正交完备性是右端不等号的出处；取等号升级成 Parseval 借级数求和（例 35.1/35.3）。' },
    /* —— v2.9 第二波桥：第 3/4/8/11/12/13/15/16/18/19/21 章 —— */
    { k: 'chordF', name: '水平弦构造', req: ['cont', 'eqEnd', 'halfDom'], out: ['root'], tip: '令 $F(x)=f(x)-f(x+a)$：$F(0)$ 与 $F(1-a)$ 反号相乘 $\\le 0$——零点定理给出等值点对。「平移自己减自己」是水平弦全家福的母构造（例 3.x）。' },
    { k: 'chordProd', name: '中间值劈叉', req: ['cont', 'diff', 'eqEnd01'], out: ['prodDeriv'], tip: '先介值取 $f(c)=c$ 把图像钉在对角线上，再对 $[0,c]$、$[c,1]$ 各一发拉格朗日——两导数相乘分子分母约成 1（例 4.x 双点乘积经典）。' },
    { k: 'boundaryLayer', name: '边界层集中', req: ['cont', 'intg'], out: ['limVal'], tip: '$nx^{n-1}$ 是概率密度家族：质量全部堆向 $x=1$。$\\varepsilon/3$ 劈段：$[0,1-\\delta]$ 上 $nx^n$ 一致趋零，边界段用连续性夹住——母题⑨「头部+尾部」的积分版（例 8.3）。' },
    { k: 'idemRank', name: '幂等拆恒等', req: ['matCond', 'idemP'], out: ['rankSum'], tip: '$x=\\dfrac{x+Ax}{2}+\\dfrac{x-Ax}{2}$ 把空间拆进 $\\mathrm{Im}\\,A$ 与 $\\mathrm{Ker}\\,A$——维数公式收口 $r(A)+r(A-E)=n$（例 11.5：幂等是「投影」的代数名）。' },
    { k: 'eigenIdem', name: '特征多项式翻译', req: ['matCond', 'idemP', 'xNe0'], out: ['eigEq'], tip: '$A^2=A$ 左乘特征向量：$\\lambda^2\\alpha=\\lambda\\alpha$——矩阵方程立刻翻译成数量方程，非零向量把 $\\alpha$ 约掉得 $\\lambda\\in\\{0,1\\}$。「先翻译再动手」的最小教学样本。' },
    { k: 'heine', name: '闭区间致密', req: ['cont', 'closedSeg'], out: ['unifCont'], tip: 'Heine-Cantor 反证标准流水线：否定式造点对列 → 致密性抽收敛子列 → 极限点处连续性接管——$\\delta$ 只依赖 $\\varepsilon$ 不依赖点，「闭」字是命门（定理 13.1）。' },
    { k: 'abelTest', name: 'Abel 一致判', req: ['monoZero', 'bndSum'], out: ['unifConv'], tip: '系数列单调趋零 + 部分和有界一致——Abel 是 Dirichlet 的加强票，$\\sum(-1)^n x^n/n$ 在 $[0,1]$ 一致收敛靠它（$x=1$ 端点交错级数救场，M 判别法在此失效）。' },
    { k: 'csW', name: '加权 C—S', req: ['cont', 'intg', 'posG'], out: ['ineq'], tip: '对 $\\varphi(\\lambda)=\\int(f-\\lambda g)^2\\ge 0$ 用判别式——$g$ 就是权重旋钮（$g\\equiv 1$ 退化普通版，$g>0$ 加权版）。母题⑥「一个母式三种皮肤」的积分皮肤正主（例 16.1）。' },
    { k: 'inertia', name: '惯性指数合同不变', req: ['matCond', 'congr'], out: ['inIdx'], tip: 'Sylvester 定律：合同=同一二次型换坐标系，正负惯性指数是坐标系之外的「身份证」——证「不同形」只需算一次行列式符号序列（例 19.5）。' },
    { k: 'corrBnd', name: '相关系数界', req: ['probSet', 'expLin'], out: ['ineq'], tip: '$0\\le D(X\\pm Y)=DX+DY\\pm 2\\mathrm{Cov}$ 两支展开，标准化后夹出 $|\\rho|\\le 1$——C—S 的期望皮肤（母题⑥点名：判别式技巧换裤子）。等号=直线相关。' },
    /* —— v3.0 桥：第 23 章综合大题 + 第 24 章自测卷 + 散题补挖 —— */
    { k: 'discMid', name: '离散化中值', req: ['diff', 'tailLim'], out: ['derivSeq'], tip: '在每个 $[n,n+1]$ 上拉格朗日生成中值点列：$f\'(\\xi_n)=f(n+1)-f(n)$——两端都趋 $A$ 相减趋零（大题一(1)：数列结论靠小区间中值「打印」点列）。' },
    { k: 'lipBoot', name: '导数界点火', req: ['diff', 'derBd'], out: ['unifCont'], tip: '$|f\'|\\le M$ 在任意区间上拉格朗日 → Lipschitz：$|f(x)-f(y)|\\le M|x-y|$，取 $\\delta=\\varepsilon/M$ 一致连续白送——比紧性拼接更直接的路线（大题一(2)），两法都会按条件选路。' },
    { k: 'rayleigh', name: '瑞利极小极大', req: ['matCond', 'eigEq'], out: ['eigMin'], tip: '展开 $R(x)-\\lambda_1=\\frac{\\sum c_i^2(\\lambda_i-\\lambda_1)}{\\sum c_i^2}\\ge0$——特征向量基下的「重心不在最低点之下」。第一特征值=单位球上 $x\'Ax$ 的最小值（大题三）。' },
    { k: 'covPSD', name: '协方差半正定', req: ['probSet', 'expLin'], out: ['posDef'], tip: '对任意 $t$：$t\'\\Sigma t=D(t_1X_1+\\cdots+t_nX_n)\\ge0$——方差把整族二次型一次非负化（大题五：概率给线代供弹药，母题⑧跨章演出）。' },
    { k: 'normalEq', name: '正规方程正定', req: ['matCond', 'colFull', 'xNe0'], out: ['posDef'], tip: '$x\'(X\'X)x=(Xx)\'(Xx)=\\Vert Xx\\Vert^{2}>0$——列满秩保证 $Xx\\ne 0$。平方和放大器（母题⑧）的统计学正主：最小二乘解 $X\'X\\hat\\beta=X\'y$ 唯一性的全部机密。' },
    { k: 'greenFubini', name: '格林+换序先积', req: ['cont', 'intg'], out: ['ineq'], tip: '分部积分建格林表示式后 Fubini 换序：先对内层精确积分算出核、再放缩——「先积分后放缩」（清单 13）的压轴级演出：一阶条件控 $L^1$、二阶控 $L^2$（大题二）。' },
    { k: 'existUnique', name: '双柱定根', req: ['root', 'monoF'], out: ['exactlyOne'], tip: '存在性（零点定理）与唯一性（严格单调）两条腿缺一不可——只写其一最多半分（A1 评分点原话）。清单 09 的标准照：先介值钉住，再单调收编。' },
    { k: 'iterConv', name: '归纳定界迭代', req: ['recur', 'indBound'], out: ['conv'], tip: '上界的归纳验证必须真正用到定值方程（$\\varphi=1+\\frac1\\varphi$ 型）——凭空写 $x_n<\\varphi$ 拿不到满分（A2 评分点）。定界+单调两板斧齐全，母题④收官。' },
    { k: 'simSpec', name: '相似保谱', req: ['matCond', 'similar0'], out: ['eigEq'], tip: '$B=P^{-1}AP$：$B-\\lambda P^{-1}x=P^{-1}(A-\\lambda)x$——特征向量被 $P$ 搬运、特征值原地不动。行列式语言同款：$|B-\\lambda I|=|A-\\lambda I|$（例 12.3）。' },
    { k: 'leibniz', name: '莱布尼茨双柱', req: ['monoZero', 'altSign'], out: ['serConv'], tip: '交错级数收敛两柱：模单调 + 趋零。缺前者可造发散振荡（条件收敛的史前史），缺后者直接通项不归零——$\\sum\\frac{(-1)^n}{n}$ 是双柱全立的教学标本（例 9.2）。' },
    { k: 'abelLim', name: 'Abel 极限定理', req: ['serConv'], out: ['limVal'], tip: '幂级数在收敛半径端点的「连续延拓」：$\\lim_{x\\to1^-}\\sum a_nx^n=\\sum a_n$。证明用 Cauchy 准则劈段——收敛性供尾部，Abel 变换管头部（例 15.7）。' },
    { k: 'jensen', name: 'Jensen 积分版', req: ['diff2', 'cont', 'posG'], out: ['ineq'], tip: '凸 = 处处在切线上方：取切点 $x_0=\\frac{\\int gy}{\\int g}$，代入 $f(y)\\ge f(x_0)+f\'(x_0)(y-x_0)$ 再以 $g$ 加权积分——线性项自消，母题⑪第三刀的积分形态（例 16.5）。' },
    { k: 'sampVar', name: '样本均值方差', req: ['expLin', 'indp', 'probSet'], out: ['varEq'], tip: '$D\\bar X=\\frac{1}{n^2}\\sum DX_i=\\frac{\\sigma^2}{n}$——独立性让交叉项归零（无独立性时方差可发散到任何值）；$\\frac1n$ 尺度的噪声衰减是全部统计推断的第一块基石（例 33.3）。' },
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
    intXZero: '「$\\int xf=0$ 的第二条积分条件」没消费——双零点模型缺了逼中间点的弹药',
    serConv: '「$\\sum a_n$ 收敛」没引用——比较原理的大级数端悬空',
    posTerm: '「$a_n\\ge 0$」没验证——比较判别法只对正项级数说话',
    majConv: '「优级数 $\\sum M_n$ 收敛」没构造——M 判别法缺控制',
    pderEq: '「$\\partial P/\\partial y=\\partial Q/\\partial x$」没验证——格林许可证没拿到',
    sameMono: '「f、g 同单调」没引用——(f(x)-f(y))(g(x)-g(y))≥0 的符号根基',
    lipK: '「$|f\'|\\le k<1$」的压缩常数没锁定——不动点唯一性门开不了',
    detNe0: '「主块行列式 $\\ne0$」没验证——Schur 化简的分母（清单18 线代版）',
    intg: '「$f$ 可积」没交代——第二中值定理对可积函数说话，不是只对连续',
    monoF: '「$g$ 单调」没验证——Bonnet 形式的全部力气来自单调',
    denInf: '「分母严格增趋于 $+\\infty$」没验证——Stolz 的入场券（洛必达的离散镜像）',
    ratioLim: '「差分比极限」没算出来——Stolz 只把极限搬运，不创造极限',
    expLin: '「期望线性」没引用——拆平方后逐项求期望的许可证',
    indp: '「样本独立」没声明——$D(\\bar X)=\\sigma^2/n$ 与交叉项归零都靠它',
    probSet: '「随机变量二阶矩存在」没交代——方差非负性的载体',
    tailLim: '「尾部极限存在」没验证——无穷区间一致连续的远处保证',
    /* —— v2.9 新章键 —— */
    isSol: '「$y_1,y_2$ 是方程的解」没引用——Wronski 求导代入全靠它',
    pCont: '「$p(x)$ 连续」没交代——唯一性定理与积分因子的共同地基',
    sameIC: '「同初值」没用上——唯一性定理的两条入场券之一',
    partEx: '「偏导存在」单独一条推不出可微——判据是偏导连续或增量一致',
    pathTest: '没做路径测试——沿两条路径主部不同即可微性死刑',
    consExt: '「条件极值点」的定义（约束曲线上的一元极值）没写开',
    baseN: '归纳起点没验证——起点平移时首项单独验是讲义点名的死因',
    stepK: '递推步「$P(k)\\Rightarrow P(k+1)$」没证明——归纳法的一半',
    fixedPt: '不动点方程 $f(L)=L$ 没解——平移构造缺圆心',
    periodic: '「以 $T$ 为周期」没引用——拆段换元相消全靠它',
    intZeroT: '「一个周期内积分为零」没验证——原函数周期性的命门',
    nNat: '「$n$ 为正整数」没交代——分部递推的展开次数',
    dens: '密度函数的非负与归一没核对——分布函数法的合法性前提',
    cdf: '分布函数没先写——极值分布的事件化第一步',
    posF: '被积函数非负没交代——比较判别法的方向性前提',
    pRange: '「$p$ 的范围」没分情况——p-基准两条互补线各管一头',
    cmpK: '没找比较替身 $g$——等价主部提取是判敛的第一步',
    intRef: '参照级/参照积分的敛散没引用——比较法缺右端',
    sqIntg: '「平方可积」没交代——Bessel/Parseval 的积分存在前提',
    trigSet: '三角系正交性没验证——投影系数公式的合法性来源',
    yEx: '「隐函数存在且光滑」还没立——条件极值降维缺这条跑道',
    halfDom: '「平移域 $[0,1-a]$ 落回定义域」没交代——水平弦两脚都要踩在定义域上',
    eqEnd01: '「$f(0)=0$ 与 $f(1)=1$」没用足——对角线交点是劈叉的支点',
    idemP: '「$A^2=A$」没翻译——矩阵方程不代入向量/行列式就是死条件',
    closedSeg: '「闭区间」丢了——开区间上一致连续的结论直接假（$1/x$ 候着）',
    monoZero: '系数列「单调趋零」没验证——Abel/Dirichlet 的共同入场券',
    bndSum: '部分和一致有界没立——Abel 变换的另一条腿',
    posG: '权重/比较函数非负没交代——乘进去不等号方向才不翻',
    congr: '「合同关系」没写成 $C\'AC=B$——换坐标系的证明全从这条展开',
    minVal: '最小值点存在性没交代——闭区间连续才有费马出场的舞台',
    derBd: '「导数有界」没用足——它不是装饰，是 Lipschitz 的常数来源',
    colFull: '「列满秩」没翻译成 $Xx\\ne 0$——平方和放大的地基',
    indBound: '上界只用归纳假设硬推——没接入定值方程就是凭空宣称',
    similar0: '「相似」没写成 $B=P^{-1}AP$——特征值搬运全靠这条',
    altSign: '「交错符号」没声明——莱布尼茨两柱的第一根',
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
    { fn: '$\\operatorname{sgn}(x)$', breaks: ['between'], why: '第一类间断——凡是「它是某个导函数」的说法，Darboux 定理一枪毙命（母题⑫）' },
    { fn: '有理点取 $x^2$、无理点取 $0$ 的函数', breaks: ['diff'], why: '仅在原点可导（导数为 $0$），其余点连连续都没有——「可导」不是邻域遗传律' },
    { fn: '$f_n(x)=n e^{-n x}$ 在 $[0,1]$', breaks: ['unifConv', 'swapLim'], why: '逐点收敛到 $0$ 而积分恒 $1-e^{-n}\\to 1$——换序不打票，光滑函数一样咬人' },
    { fn: '$\\dfrac{xy}{\\sqrt{x^{2}+y^{2}}}$（原点补 $0$）', breaks: ['diff'], why: '处处连续、偏导处处存在，原点仍不可微——偏导是十字方向的信息，可微要的是全平面' },
  ]
  /* 触发题 → 关联桥卡（SRS 掌握度挂靠；索引对 TRIG_ITEMS） */
  let TRIG_BK = ['rolle', 'rolle', 'rolle', 'cauchy', 'rolle', 'cauchy', 'taylor', 'mono', 'extma', 'constvar', 'taylor', 'varInt', 'zero', 'monoBound', 'comp', 'swapLim', 'mono', 'extma', 'replay', 'cmp', 'mtest', 'contra', 'symOrth', 'gree',
    /* 考前清单 12 题（01,02,19,04,05,06,09,10,13,14,18,20） */
    'declare', 'rolle', 'posDef', 'declare', 'cauchy', 'taylor', 'mono', 'compact', 'squeeze', 'gree', 'rankOp', 'variance',
    /* v2.9 新章触发 8 题 */
    'wronks', 'superp', 'implF', 'lagrMul', 'induct', 'fixShift', 'perSplit', 'maxDist',
    /* v3.0 综合/自测卷触发 6 题 */
    'discMid', 'lipBoot', 'existUnique', 'iterConv', 'sampVar', 'leibniz']

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
      id: 'bp1', mother: 1, ch: '第4章 罗尔与辅助函数', title: '乘积导数型',
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
      id: 'bp2', mother: 12, ch: '第3章 存在性定理', title: '端点异号零点',
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
      id: 'bp3', mother: 5, ch: '第8章 积分等式', title: '变限积分桥',
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
      id: 'bp4', mother: 3, ch: '第6章 泰勒公式', title: '二阶导放大',
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
      id: 'bp5', mother: 4, ch: '第2章 递推数列', title: '单调有界四步',
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
      id: 'bp6', mother: 2, ch: '第5章 拉格朗日柯西', title: '双点差商',
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
      id: 'bp7', mother: 7, ch: '第11章 秩不等式', title: 'AB=O 的秩',
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
      id: 'bp8', mother: 1, ch: '第1章 方法论总论', title: '移项作差 + 罗尔',
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
    {
      id: 'bp9', mother: 10, ch: '第2章 数列极限', title: '夹逼：n 项和',
      stem: '证明：$\\lim\\limits_{n\\to\\infty}\\left(\\dfrac{1}{\\sqrt{n^2+1}}+\\dfrac{1}{\\sqrt{n^2+2}}+\\cdots+\\dfrac{1}{\\sqrt{n^2+n}}\\right)=1$。',
      conds: [
        { t: 'twoSide', x: '最大/最小项夹逼：$\\dfrac{n}{\\sqrt{n^2+n}}\\le S_n\\le\\dfrac{n}{\\sqrt{n^2+1}}$' },
      ],
      goal: 'conv', best: 1,
      routes: [['squeeze'], ['declare', 'squeeze']],
      tip: '夹逼三大模型之「项和式」：把每一项同时放大缩小成同一组端点项，两端极限相等即收口。',
      anchor: '例 2.3：n 项和的夹逼——分母同阶，最大项最小项就是两端',
      necessity: { tag: 'twoSide', why: '没有两端同极限的夹子，和式极限无从谈起——放大与缩小必须同步收敛到 1。' },
    },
    {
      id: 'bp10', mother: 4, ch: '第2章 数列极限', title: '压缩：不单调递推',
      stem: '设 $x_1=3$，$x_{n+1}=\\dfrac{x_n}{2}+\\dfrac{1}{x_n}$。证明 $\\{x_n\\}$ 收敛（提示：数列不单调，单调有界失效）。',
      conds: [
        { t: 'recur', x: '递推式 $x_{n+1}=\\varphi(x_n)$ 与初值' },
        { t: 'lipK', x: '$|\\varphi\'(x)|\\le k<1$ 于 $[\\sqrt2,+\\infty)$' },
      ],
      goal: 'conv', best: 1,
      routes: [['comp'], ['declare', 'comp']],
      tip: '不单调的递推换武器：$|x_{n+1}-\\xi|\\le k|x_n-\\xi|$ 逐次缩距——压缩映射，顺带送唯一性。',
      anchor: '例 2.3/14.2：「不单调」是压缩映射的出场信号',
      necessity: { tag: 'lipK', why: '去掉 k<1：$x_{n+1}=2x_n$ 也满足递推——发散。缩距率是收敛的全部保证。' },
    },
    {
      id: 'bp11', mother: 4, ch: '第14章 不动点', title: '不动点双门',
      stem: '设 $f$ 在 $[a,b]$ 连续且 $f([a,b])\\subseteq[a,b]$。证明：存在 $\\xi\\in[a,b]$ 使 $f(\\xi)=\\xi$；若另有 $|f(x)-f(y)|\\le k|x-y|$（$k<1$），证明 $\\xi$ 唯一。',
      conds: [
        { t: 'cont', x: '$f$ 在 $[a,b]$ 连续' },
        { t: 'signDiff', x: '$F(a)=f(a)-a\\ge 0\\ge f(b)-b=F(b)$（值域含入）' },
        { t: 'lipK', x: '$|f(x)-f(y)|\\le k|x-y|$，$k<1$' },
      ],
      goal: 'unique', best: 1,
      routes: [['fp'], ['declare', 'fp']],
      tip: '不动点问题开两扇门：存在性=作差 F=f-x 后零点定理；唯一性=反设两点，(1-k)|ξ-η|≤0 逼重合。',
      anchor: '例 14.1：f(x)=ξ 就是 F(x)=f(x)-x 的零点——「换个未知数看桥」',
      necessity: { tag: 'signDiff', why: '去掉值域含入：$f(x)=x+1$ 在 $[0,1]$ 连续却无不动点——F 的两端符号就是存在性本身。' },
    },
    {
      id: 'bp12', mother: 5, ch: '第3章 存在性定理', title: '双零点升级',
      stem: '设 $f$ 在 $[0,1]$ 连续，$\\int_0^1 f\\,dx=0$，$\\int_0^1 x f\\,dx=0$。证明：$f$ 在 $(0,1)$ 内至少有两个零点。',
      conds: [
        { t: 'cont', x: '$f$ 在 $[0,1]$ 连续' },
        { t: 'intZero', x: '$\\int_0^1 f=0$' },
        { t: 'intXZero', x: '$\\int_0^1 xf=0$' },
      ],
      goal: 'root2', best: 1,
      routes: [['dblRoot'], ['declare', 'dblRoot']],
      tip: '双零点模型：F=∫f 白送 F(0)=F(1)=0；分部把第二条积分条件翻译成「第三个等值点」，相邻罗尔各打一发。',
      anchor: '例 3.3 进化版：一条积分=一个零点，两条积分=两个零点',
      necessity: { tag: 'intXZero', why: '去掉 $\\int xf=0$：$f=\\cos 2\\pi x$ 满足其余条件却只有两个零点在边界——第二条件逼出内部第三等值点。' },
    },
    {
      id: 'bp13', mother: 6, ch: '第8章 积分等式', title: '区间再现',
      stem: '设 $f$ 在 $[0,\\pi]$ 连续。证明：$\\int_0^{\\pi} x f(\\sin x)\\,dx=\\dfrac{\\pi}{2}\\int_0^{\\pi} f(\\sin x)\\,dx$。',
      conds: [
        { t: 'cont', x: '$f$ 连续故 $f(\\sin x)$ 可积' },
        { t: 'symDom', x: '区间 $[0,\\pi]$ 关于 $\\pi/2$ 对称，$\\sin(\\pi-x)=\\sin x$ 换元下不变' },
      ],
      goal: 'intVal', best: 1,
      routes: [['replay'], ['declare', 'replay']],
      tip: '区间再现：换元 x=π-t 后 I 变成 π∫-I，两式相加 x 自己消掉——「自己加自己」的对称杀法。',
      anchor: '例 8.2：凡 $xf(\\sin x)$ 型先想 $x=a+b-t$',
      necessity: { tag: 'symDom', why: '去掉对称性：$\\int_0^{\\pi} x\\,dx=\\pi^2/2\\ne\\frac{\\pi}{2}\\cdot\\pi$ 仍成立但方法失效——再现全靠零件在换元下不变。' },
    },
    {
      id: 'bp14', mother: 11, ch: '第7章 函数不等式', title: '单调性法',
      stem: '证明：当 $x>0$ 时，$\\ln(1+x)<x$。',
      conds: [
        { t: 'gDef', x: '令 $g(x)=x-\\ln(1+x)$' },
        { t: 'g0', x: '$g(0)=0$（基点白送）' },
      ],
      goal: 'ineq', best: 1,
      routes: [['mono'], ['declare', 'mono']],
      tip: '可移项作差 → 单调性法：$g\'=\\frac{x}{1+x}>0$（$x>0$），严格递增配 $g(0)=0$ 即得 $g>0$（军规四：严格号严格证）。',
      anchor: '例 7.1 左半：单调性法标准四步——作差/验基点/判号/收口',
      necessity: { tag: 'g0', why: '去掉 $g(0)=0$：$x-\\ln(1+x)+c$ 对 $c<0$ 结论崩塌——基点值是「起点」，没起点谈不上递增到正。' },
    },
    {
      id: 'bp15', mother: 11, ch: '第7章 函数不等式', title: '极值法比大小',
      stem: '证明：$e^{\\pi}>\\pi^{e}$。',
      conds: [
        { t: 'cont', x: '$\\dfrac{\\ln x}{x}$ 在 $(0,+\\infty)$ 连续' },
        { t: 'crit', x: '$\\left(\\frac{\\ln x}{x}\\right)\'=\\frac{1-\\ln x}{x^2}$ 在 $x=e$ 处为零，左正右负' },
      ],
      goal: 'ineq', best: 1,
      routes: [['extma'], ['declare', 'extma']],
      tip: '幂指结构先取对数：比 e^π 与 π^e 化为比 ln x/x 在 e 与 π 的函数值——极值点唯一最大，π≠e 即严格。',
      anchor: '例 7.2：极值法——导数变号但驻点好解时的标准武器',
      necessity: { tag: 'crit', why: '不验 $\\ln x/x$ 在 $e$ 取最大：$e^{\\pi}>\\pi^{e}$ 与 $e^{3}>3^{e}$ 无从分辨——极值位置就是比大小的裁判。' },
    },
    {
      id: 'bp16', mother: 11, ch: '第7章 函数不等式', title: '常数变易（双变量）',
      stem: '设 $0<a\\le 1$，$x>y\\ge 0$。证明：$|x^a-y^a|\\le|x-y|^a$。',
      conds: [
        { t: 'twoVar', x: '双变量 $x,y$ 齐次结构 $x^a-y^a$' },
      ],
      goal: 'ineq', best: 2,
      routes: [['constvar', 'mono'], ['declare', 'constvar', 'mono']],
      tip: '双变量先固定一边：令 y 为常数、g(x)=x^a-y^a-(x-y)^a，g(y)=0 白送，判 g\' 符号收口。',
      anchor: '决策表第 3 行：两端都含参数 → 常数变易法',
      necessity: { tag: 'twoVar', why: 'a>1 时结论反号（$2^2-1^2=3>1=|2-1|^2$）——参数范围 a≤1 正是 g\' 判号的命门。' },
    },
    {
      id: 'bp17', mother: 6, ch: '第9章 级数证明', title: '级数比较（CS）',
      stem: '设 $a_n\\ge 0$ 且 $\\sum a_n$ 收敛。证明：$\\sum\\dfrac{a_n}{n^{2/3}}$ 收敛。',
      conds: [
        { t: 'serConv', x: '$\\sum a_n$ 收敛' },
        { t: 'posTerm', x: '$a_n\\ge 0$（正项级数）' },
      ],
      goal: 'serConv2', best: 1,
      routes: [['cmp'], ['declare', 'cmp']],
      tip: '例 9.1 三大构造之柯西-施瓦茨：$(\\sum\\frac{a_n}{n^{2/3}})^2\\le\\sum a_n\\cdot\\sum n^{-4/3}$，右端两项都收敛。',
      anchor: '例 9.1：派生级数三件套——均值不等式 / CS / √n 放缩',
      necessity: { tag: 'posTerm', why: '去掉正项：条件收敛时重排/派生可以崩坏——比较与 CS 都活在正项世界。' },
    },
    {
      id: 'bp18', mother: 10, ch: '第15章 一致收敛', title: 'M 判别法',
      stem: '证明：$\\sum\\limits_{n=1}^{\\infty}\\dfrac{x^n}{n^2}$ 在 $[0,1]$ 上一致收敛。',
      conds: [
        { t: 'majConv', x: '$\\left|\\frac{x^n}{n^2}\\right|\\le\\frac{1}{n^2}$ 且 $\\sum\\frac{1}{n^2}$ 收敛（优级数）' },
      ],
      goal: 'unifConv', best: 1,
      routes: [['mtest'], ['declare', 'mtest']],
      tip: '一致收敛判定首选 M 判别：找一个与 x 无关的收敛控制级数——x=1 处恰取等，仍被 1/n² 控制。',
      anchor: '例 15.2：M 判别法——一致收敛的「优级数许可证」',
      necessity: { tag: 'majConv', why: '去掉优级数控制：$\\sum x^n$ 在 $[0,1)$ 逐点收敛却不一致——没有与 x 无关的控制就没有一致性。' },
    },
    {
      id: 'bp19', mother: 10, ch: '第15章 一致收敛', title: '换序资格',
      stem: '设 $\\sum u_n(x)$ 在 $[a,b]$ 一致收敛且各项连续。证明：和函数连续，且可逐项积分。',
      conds: [
        { t: 'unifConv', x: '级数一致收敛' },
        { t: 'cont', x: '各项 $u_n$ 连续' },
      ],
      goal: 'canSwap', best: 1,
      routes: [['declare', 'swapLim'], ['swapLim']],
      tip: '一致收敛是换序的门票：极限与积分交换、连续性传递全靠它——逐点收敛时 x^n 反例候着。',
      anchor: '例 15.3 反面对照：x^n 在 [0,1] 逐点收敛到跳变函数——不一致则换序必翻车',
      necessity: { tag: 'unifConv', why: '去掉一致：$x^n$ 逐项积分 $\\to\\int_0^1\\lim=0$ 而 $\\lim\\int=\\lim\\frac{1}{n+1}\\cdot$……两端不等——门票就是本体。' },
    },
    {
      id: 'bp20', mother: 7, ch: '第12章 特征值证明', title: '特征向量无关',
      stem: '设 $\\lambda_1\\ne\\lambda_2$ 是 $A$ 的两个特征值，$\\alpha_1,\\alpha_2$ 为对应特征向量。证明：$\\alpha_1,\\alpha_2$ 线性无关。',
      conds: [
        { t: 'matCond', x: '$A\\alpha_i=\\lambda_i\\alpha_i$' },
        { t: 'xNe0', x: '特征向量 $\\alpha_i\\ne 0$（定义自带）' },
      ],
      goal: 'eigEq', best: 1,
      routes: [['eigDef'], ['contra', 'eigDef']],
      tip: '例 12.1 标准开局：反设组合为零，左乘 A 得第二式，与原式的 λ 倍相减——消去一个向量逼出 (λ1-λ2)k1α1=0。',
      anchor: '例 12.1：左乘 A 制造第二个等式——特征值证明的「双方程相减」母题',
      necessity: { tag: 'xNe0', why: '特征向量定义就要求非零：α=0 谁都是它的特征向量——无关性瞬间崩塌。' },
    },
    {
      id: 'bp21', mother: 7, ch: '第12章 特征值证明', title: '实对称正交',
      stem: '设 $A$ 实对称，$A\\alpha=\\lambda_1\\alpha$，$A\\beta=\\lambda_2\\beta$，$\\lambda_1\\ne\\lambda_2$。证明：$\\alpha\\perp\\beta$。',
      conds: [
        { t: 'matCond', x: '$A\'=A$（实对称）' },
        { t: 'xNe0', x: '$\\alpha,\\beta$ 为特征向量故非零' },
      ],
      goal: 'orth', best: 1,
      routes: [['symOrth'], ['declare', 'symOrth']],
      tip: '例 12.2 精髓：算同一个内积 (Aα)·β 两次——对称性把 A 从左边挪到右边得 λ1(α·β)=λ2(α·β)，相减收口。',
      anchor: '例 12.2：「同一内积两种算法」——实对称谱定理的地基砖',
      necessity: { tag: 'matCond', why: '去掉对称：$A=\\begin{pmatrix}1&1\\\\0&2\\end{pmatrix}$ 特征向量 (1,0) 与 (1,1) 不正交——A\'=A 是穿梭许可证。' },
    },
    {
      id: 'bp22', mother: 10, ch: '第18章 曲线积分（数一）', title: '格林路独立',
      stem: '设 $P,Q$ 在全平面有连续偏导且 $\\dfrac{\\partial P}{\\partial y}=\\dfrac{\\partial Q}{\\partial x}$。证明：曲线积分 $\\int_L P\\,dx+Q\\,dy$ 与路径无关，并求势函数。',
      conds: [
        { t: 'cont', x: '$P,Q$ 偏导连续（全平面单连通）' },
        { t: 'pderEq', x: '$\\partial P/\\partial y=\\partial Q/\\partial x$ 处处成立' },
      ],
      goal: 'pathIndep', best: 1,
      routes: [['gree'], ['declare', 'gree']],
      tip: '例 18.3 四等价：先验偏导相等拿到「路独立许可证」，再把 L 换成折线——势函数用固定变量逐次积分复原。',
      anchor: '定理 18.3：路径无关四等价——(iii)⇒(i)/(iv) 是考场最常用的箭头',
      necessity: { tag: 'pderEq', why: '去掉偏导相等：$\\int \\frac{-y\\,dx+x\\,dy}{x^2+y^2}$ 绕原点一圈 2π——条件与单连通域缺一不可。' },
    },
    {
      id: 'bp23', mother: 6, ch: '第16章 凸性与积分不等式', title: '切比雪夫二重化',
      stem: '设 $f,g$ 在 $[0,1]$ 连续且单调性相同。证明：$\\int_0^1 fg\\,dx\\ge\\int_0^1 f\\,dx\\int_0^1 g\\,dx$。',
      conds: [
        { t: 'cont', x: '$f,g$ 在 $[0,1]$ 连续' },
        { t: 'sameMono', x: '$f,g$ 同单调（同增或同减）' },
      ],
      goal: 'ineq', best: 1,
      routes: [['cheb'], ['declare', 'cheb']],
      tip: '例 16.3 升维技巧：对任意 x,y 有 (f(x)-f(y))(g(x)-g(y))≥0，在 [0,1]² 上二重积分展开——「自己加自己」。',
      anchor: '定理 16.3：Chebyshev 积分不等式——同单调是符号的全部来源',
      necessity: { tag: 'sameMono', why: '单调性相反时不等号反向（例 16.3 注）——同向是乘积非负的唯一保障。' },
    },
    /* ═══ v2.8：第 19-35 章新题（母题谱系联动）═══ */
    {
      id: 'bp24', mother: 8, ch: '第19章 线代进阶', title: '正定三等价',
      stem: '设 $A$ 为 $n$ 阶实对称矩阵。证明：$A$ 正定 $\\iff$ $A$ 的特征值全大于零 $\\iff$ 存在可逆实矩阵 $C$ 使 $A=C\'C$。',
      conds: [
        { t: 'matCond', x: '$A\'=A$ 实对称（谱定理入场券）' },
        { t: 'xNe0', x: '特征向量 $\\alpha\\ne0$（定义自带）' },
      ],
      goal: 'posDef', best: 1,
      routes: [['posDef'], ['declare', 'posDef']],
      tip: '（1）⟹（2）：$A\\alpha=\\lambda\\alpha$ 两边与 $\\alpha$ 作内积，$\\lambda|\\alpha|^2=\\alpha\'A\\alpha>0$；（2）⟹（3）：正交对角化 $A=Q\\Lambda Q\'=(\\Lambda^{1/2}Q\')\'(\\Lambda^{1/2}Q\'$)。',
      anchor: '定理 19.1：正定性三充要——清单 19 的默认顺序就是证明顺序',
      necessity: { tag: 'matCond', why: '去掉实对称：$A=\\begin{pmatrix}1&2\\\\0&1\\end{pmatrix}$ 特征值全正但 $x\'Ax$ 可负——对称是内积穿梭的前提。' },
    },
    {
      id: 'bp25', mother: 7, ch: '第20章 行列式与分块', title: '伴随秩三段论',
      stem: '设 $A$ 为 $n$ 阶矩阵（$n\\ge2$）。证明：$r(A^*)=\\begin{cases}n,&r(A)=n\\\\1,&r(A)=n-1\\\\0,&r(A)\\le n-2\\end{cases}$',
      conds: [
        { t: 'matCond', x: '$AA^*=|A|E$ 恒等式' },
        { t: 'detNe0', x: '$|A|\\ne0$ 分支（三段各自讨论）' },
      ],
      goal: 'rankIneq', best: 1,
      routes: [['adjRank'], ['declare', 'adjRank']],
      tip: '恒等式两边取行列式定 $|A^*|$；秩的三段：$r(A)=n$ 可逆直接乘；$n-1$ 用 $AA^*=0$ 的列空间夹逼 + 某代数余子式非零；$\\le n-2$ 一切 $n-1$ 阶子式为零。',
      anchor: '例 20.1：伴随的行列式与秩——母题⑦秩三段论的标准像',
      necessity: { tag: 'matCond', why: '$AA^*=|A|E$ 是全部三段讨论的公用地基——没有它伴随只是子式的散乱集合。' },
    },
    {
      id: 'bp26', mother: 7, ch: '第20章 行列式与分块', title: 'Schur 补行列式',
      stem: '设 $A$ 为 $n$ 阶可逆阵，$\\begin{pmatrix}A&B\\\\C&D\\end{pmatrix}$ 为分块方阵。证明：$\\left|\\begin{matrix}A&B\\\\C&D\\end{matrix}\\right|=|A|\\,|D-CA^{-1}B|$。',
      conds: [
        { t: 'matCond', x: '$A$ 可逆（主块）' },
        { t: 'detNe0', x: '$|A|\\ne0$（分块化简的除数）' },
      ],
      goal: 'detVal', best: 1,
      routes: [['block'], ['declare', 'block']],
      tip: '左乘分块初等阵 $\\begin{pmatrix}E&0\\\\-CA^{-1}&E\\end{pmatrix}$ 化成上三角块——行列式=对角块乘积；初等变换不改行列式是全部魔法的许可证。',
      anchor: '例 20.2：Schur 补——「先翻译再动手」（清单18）的行列式版',
      necessity: { tag: 'detNe0', why: '$A$ 不可逆时 $A^{-1}$ 无意义——化简动作本身塌方（$D$ 可逆时有对称版本，换主块）。' },
    },
    {
      id: 'bp27', mother: 11, ch: '第26章 凸函数专题', title: '凸性判定主定理',
      stem: '设 $f$ 在 $[a,b]$ 连续、$(a,b)$ 内二阶可导。证明：$f\'\'\\ge0$ $\\iff$ 对任意 $x_0$，曲线整体在 $x_0$ 切线上方。',
      conds: [
        { t: 'diff2', x: '二阶可导（$f\'\'$ 存在）' },
        { t: 'cont', x: '闭区间连续（端点代入合法）' },
      ],
      goal: 'ineq', best: 1,
      routes: [['convex'], ['declare', 'convex']],
      tip: '（iii）⟸：固定 $x_0$ 令 $g(x)=f(x)-f(x_0)-f\'(x_0)(x-x_0)$，$g(x_0)=g\'(x_0)=0$，$g\'\'=f\'\'\ge0$ ⇒ $g\'$ 单调 ⇒ $g$ 在 $x_0$ 取最小 0——凸性三刀的第一刀。',
      anchor: '定理 26.1：三种等价刻画——切线/弦/Jensen 是母题⑪的三把刀',
      necessity: { tag: 'diff2', why: '去掉二阶信息：$f(x)=-x$ 一阶可导但切线穿曲线——$f\'\'$ 定号是「刀」本身。' },
    },
    {
      id: 'bp28', mother: 12, ch: '第27章 Darboux 定理', title: '导数介值声明',
      stem: '设 $f$ 在 $[a,b]$ 可导，$f\'(a)<0<f\'(b)$。证明：存在 $\\xi\\in(a,b)$ 使 $f\'(\\xi)=0$。',
      conds: [
        { t: 'diff', x: '$f$ 在闭区间可导（$f\'$ 存在但不假设连续！）' },
        { t: 'signDiff', x: '$f\'(a)<0<f\'(b)$ 端点导数异号' },
      ],
      goal: 'dZero', best: 1,
      routes: [['darboux'], ['declare', 'darboux']],
      tip: '陷阱预警：$f\'$ 未必连续，介值定理直接套不上！必须先声明达布定理（导函数无第一类间断）——母题⑫「Darboux 声明」的全部意义。',
      anchor: '第 27 章：对 $f\'$ 用介值必须先声明——清单 12 条 Darboux 声明',
      necessity: { tag: 'diff', x: '', why: '可导是达布的前提：$f(x)=x+\\mathrm{sgn}\\,x$ 型跳跃导数不存在达布保护——结论可假。' },
    },
    {
      id: 'bp29', mother: 5, ch: '第28章 积分中值·Bonnet', title: '第二积分中值',
      stem: '设 $f$ 在 $[a,b]$ 可积，$g$ 在 $[a,b]$ 单调递增且非负。证明：存在 $\\xi\\in[a,b]$ 使 $\\int_a^b f g\\,dx=g(b)\\int_\\xi^b f\\,dx$。',
      conds: [
        { t: 'intg', x: '$f$ 可积（不要求连续！）' },
        { t: 'monoF', x: '$g$ 单调递增且 $g\\ge0$' },
      ],
      goal: 'intVal', best: 1,
      routes: [['bonnet'], ['declare', 'bonnet']],
      tip: '分部思想：$\\int fg$ 里把单调的 $g$ 提出来、把可积的 $f$ 攒成 $F(x)=\\int_a^x f$——最值放大定 $\\xi$（定理 28.2 Bonnet 形式）。',
      anchor: '第 28 章：「单调的提出去，振荡的积分段」——Wallis 估计的前置武器',
      necessity: { tag: 'monoF', why: '去掉单调：$g=\\sin x$ 在 $[0,2\\pi]$ 变号摆动，Bonnet 表示整体失效——放大收口没有方向。' },
    },
    {
      id: 'bp30', mother: 10, ch: '第34章 Stolz 定理', title: '离散洛必达',
      stem: '设 $b_n$ 严格递增趋于 $+\\infty$，$\\lim\\dfrac{a_{n+1}-a_n}{b_{n+1}-b_n}=L$。证明：$\\lim\\dfrac{a_n}{b_n}=L$。',
      conds: [
        { t: 'denInf', x: '$b_n\\uparrow+\\infty$（严格增）' },
        { t: 'ratioLim', x: '差分比极限 $=L$ 已知' },
      ],
      goal: 'limVal', best: 1,
      routes: [['stolz'], ['declare', 'stolz']],
      tip: 'ε 语言三段：差分比进入 $(L-\\varepsilon,L+\\varepsilon)$ 后，$a_n$ 被夹在 $b_n$ 的加权 telescoping 里——尾部主导，头部有限项除 $b_n\\to\\infty$ 归零。',
      anchor: '第 34 章：和式极限重武器——「分母严格增趋于无穷」是入场券（清单 07 的离散版）',
      necessity: { tag: 'denInf', why: '$b_n$ 不趋于无穷时结论假：$a_n=(-1)^n,b_n=2$——差分比极限存在而比值不收敛。' },
    },
    {
      id: 'bp31', mother: 8, ch: '第33章 估计量评价', title: '样本方差无偏',
      stem: '设 $X_1,\\dots,X_n$ 独立同分布，$E X=\\mu$，$D X=\\sigma^2$。证明：$E(S^2)=\\sigma^2$（$S^2=\\frac{1}{n-1}\\sum(X_i-\\bar X)^2$）。',
      conds: [
        { t: 'expLin', x: '期望线性（拆平方逐项求期望的许可证）' },
        { t: 'indp', x: '样本独立同分布' },
      ],
      goal: 'unbiased', best: 1,
      routes: [['unbiased'], ['declare', 'unbiased']],
      tip: '拆平方：$\\sum(X_i-\\bar X)^2=\\sum X_i^2-n\\bar X^2$；$E\\bar X^2=D\\bar X+\\mu^2=\\sigma^2/n+\\mu^2$（独立性在此入场）；两式相减除 $n-1$ 恰得 $\\sigma^2$——「自由度 n-1」修正的就是这份偏差。',
      anchor: '定理 33.1：无偏性全部技术=拆平方+期望线性（母题⑧非负放大器的对偶）',
      necessity: { tag: 'indp', why: '去掉独立：$D\\bar X\\ne\\sigma^2/n$，交叉项不归零——$n-1$ 分母不再恰好修正偏差。' },
    },
    {
      id: 'bp32', mother: 8, ch: '第21章 概率不等式', title: '切比雪夫出生',
      stem: '设随机变量 $X$ 二阶矩存在，$E X=\\mu$，$D X=\\sigma^2$。证明：$P\\{|X-\\mu|\\ge\\varepsilon\\}\\le\\sigma^2/\\varepsilon^2$。',
      conds: [
        { t: 'probSet', x: '$X$ 二阶矩存在（方差是天然非负量）' },
      ],
      goal: 'ineq', best: 1,
      routes: [['variance'], ['declare', 'variance']],
      tip: '非负放大器：$\\sigma^2=E(X-\\mu)^2\\ge\\varepsilon^2 P\\{|X-\\mu|\\ge\\varepsilon\\}$——在事件 $\\{|X-\\mu|\\ge\\varepsilon\\}$ 上 $(X-\\mu)^2\\ge\\varepsilon^2$，指示函数展开即得（母题⑧的标准出生）。',
      anchor: '第 21 章：概率证明找天然非负量——方差 / $(t-Z)^2$ / 指示函数（清单 20）',
      necessity: { tag: 'probSet', why: '二阶矩不存在（柯西分布）：$\\sigma^2=\\infty$ 不等式失去信息——放大器需要能量源。' },
    },
    {
      id: 'bp33', mother: 9, ch: '第13章 一致连续', title: '无穷区间拼接',
      stem: '设 $f$ 在 $[0,+\\infty)$ 连续且 $\\lim\\limits_{x\\to+\\infty}f(x)$ 存在有限。证明：$f$ 在 $[0,+\\infty)$ 一致连续。',
      conds: [
        { t: 'cont', x: '$f$ 在 $[0,+\\infty)$ 连续' },
        { t: 'tailLim', x: '尾部极限存在有限（远处函数值收敛）' },
      ],
      goal: 'unifCont', best: 1,
      routes: [['compact'], ['declare', 'compact'] ],
      tip: '三段拼接（母题⑨）：尾部 $[M,+\\infty)$ 靠极限存在（两点函数值都贴近极限）；头部 $[0,M+1]$ 靠 Heine-Cantor 紧性；中转段 $\\delta$ 取小——三处 $\\delta$ 取最小统一。',
      anchor: '第 13 章：尾段极限 + 头部紧性 + 中转点——「紧性与拼接」母题',
      necessity: { tag: 'tailLim', why: '去掉尾部极限：$f(x)=x$ 在 $[0,+\\infty)$ 连续但不一致——远处的「收敛」正是一致性的来源。' },
    },
    {
      id: 'bp34', mother: 13, ch: '第29章 微分方程结构', title: '解空间同构',
      stem: '设 $a(x),b(x)$ 在 $[a,b]$ 连续。证明：$y\'\'+p(x)y\'+q(x)y=0$ 的通解恰为 $C_1 y_1+C_2 y_2$（$y_1,y_2$ 线性无关解），非齐次通解=特解+齐次通解。',
      conds: [
        { t: 'intg', x: '系数连续（解的存在性与 Wronski 可导）' },
        { t: 'matCond', x: '$y_1,y_2$ 线性无关（W\\ne0）' },
      ],
      goal: 'solStruct', best: 1,
      routes: [['odespace'], ['declare', 'odespace']],
      tip: '与线代 $Ax=0$ 同构（母题⑬）：解空间是二维线性空间——Abel 定理保证 W 恒非零或恒零；「特解+核」的分解与 $Ax=b$ 的 $x_0+\\ker A$ 逐字对应。',
      anchor: '第 29 章：ODE 解结构=线代解结构的分析版——「先翻译再动手」（清单 18）',
      necessity: { tag: 'matCond', why: '$y_1,y_2$ 相关时张不出二维解空间——W=0 一处零则处处零（Abel），基都立不起来。' },
    },
    /* ═══ v2.9：第 10/17/22/28/30/32/35 章经典例题入池 ═══ */
    {
      id: 'bp35', mother: 13, ch: '第10章 微分方程综合', title: '朗斯基恒等式',
      stem: '设 $y_1,y_2$ 是 $y\'\' + p(x)y\' + q(x)y = 0$ 的解，$p,q$ 连续。证明：$W(x) = W(x_0)e^{-\\int_{x_0}^x p}$。',
      conds: [
        { t: 'isSol', x: '$y_1,y_2$ 都满足方程' },
        { t: 'pCont', x: '$p(x)$ 连续（积分因子合法）' },
      ],
      goal: 'detEq', best: 1,
      routes: [['wronks'], ['declare', 'wronks']],
      tip: '对 $W=y_1y_2\'-y_1\'y_2$ 直接求导——$q$ 项代入时两两相消，只剩 $W\'=-pW$，一阶线性收口。',
      anchor: '例 10.1：Wronski 恒等式——Abel 公式的证明本体',
      necessity: { tag: 'isSol', why: '$y_i\'\'$ 只能用方程替换——不引用「是解」，求导后 $q$ 项相消就是无源之水。' },
    },
    {
      id: 'bp36', mother: 13, ch: '第10章 微分方程综合', title: '初值唯一性',
      stem: '设 $y_1,y_2$ 是同一线性方程的解，存在 $x_0$ 使 $y_1(x_0)=y_2(x_0)$、$y_1\'(x_0)=y_2\'(x_0)$。证明：$y_1\\equiv y_2$。',
      conds: [
        { t: 'isSol', x: '两者都是解（差也是解——叠加原理）' },
        { t: 'sameIC', x: '同一初值：函数值与导数值都重合' },
      ],
      goal: 'sameFun', best: 1,
      routes: [['superp'], ['declare', 'superp']],
      tip: '三步：造差函数 $Y=y_1-y_2$（叠加）→ $Y$ 零初值 → 唯一性定理判 $Y\\equiv 0$。两条积分曲线永不交叉就是这条定理的几何名。',
      anchor: '例 10.2：解的唯一性 = 积分曲线互不相交（图 10.1）',
      necessity: { tag: 'sameIC', why: '唯一性只对同初值发言——初值不重合时两条解可以任意纠缠，差函数零初值这一步直接塌。' },
    },
    {
      id: 'bp37', mother: 12, ch: '第10·17章 可微性判定', title: '偏导存在不可微',
      stem: '设 $f(x,y)=\\dfrac{xy}{x^2+y^2}$（原点补充定义为 $0$）。证明：$f$ 在原点两个偏导都存在，但不可微。',
      conds: [
        { t: 'partEx', x: '沿坐标轴 $f\\equiv 0$，偏导双双为零（存在性已验）' },
        { t: 'pathTest', x: '沿 $y=x$：增量比不趋零——主部与路径有关' },
      ],
      goal: 'notDiff', best: 1,
      routes: [['nonDiff'], ['declare', 'nonDiff']],
      tip: '可微要求 $\\Delta f = A\\Delta x + B\\Delta y + o(\\rho)$ 对一切路径一致成立——偏导全零时右端是 $o(\\rho)$，沿 $y=x$ 却恒为 $1/2$：路径一票否决。',
      anchor: '例 10.3 / 17.1：偏导存在与可微之间隔着一条路径',
      necessity: { tag: 'pathTest', why: '偏导存在是「坐标轴方向的可微」——没有路径测试，你验的永远只是十字形上的极限。' },
    },
    {
      id: 'bp38', mother: 9, ch: '第17章 隐函数定理', title: '隐函数三板斧',
      stem: '设 $F(x,y)$ 有连续偏导、$F(x_0,y_0)=0$、$F_y(x_0,y_0)\\ne 0$。证明：$F=0$ 局部唯一确定连续可导的 $y=y(x)$。',
      conds: [
        { t: 'pCont', x: '偏导连续（定号可传播到小矩形）' },
        { t: 'fNe0', x: '$F_y(x_0,y_0)>0$：对目标变量的偏导非零（清单 17）' },
      ],
      goal: 'yEx', best: 1,
      routes: [['implF'], ['declare', 'implF']],
      tip: '三板斧：①偏导定号劈出局部矩形；②固定 $x$ 化一元——介值给存在、严格单调给唯一；③连续性用「有界数列任一收敛子列极限相同」的经典论证接上。',
      anchor: '定理 17.2：隐函数存在定理的完整证明——一元工具的多元组装',
      necessity: { tag: 'fNe0', why: '$F_y=0$ 时水平切线让 $y$ 对 $x$ 不再是函数（$x^2+y^2=0$ 在原点整条竖直方向失联）——「对目标变量」四个字就是入场券。' },
    },
    {
      id: 'bp39', mother: 13, ch: '第17章 条件极值', title: 'Lagrange 降维费马',
      stem: '设 $f$ 在约束 $\\varphi=0$ 下的点 $P_0$ 取条件极值，偏导连续、$\\nabla\\varphi\\ne 0$。证明：$\\nabla f=\\lambda\\nabla\\varphi$。',
      conds: [
        { t: 'pCont', x: '$f,\\varphi$ 偏导连续' },
        { t: 'fNe0', x: '$\\varphi_y\\ne 0$：约束曲面局部是光滑曲线' },
        { t: 'consExt', x: '$P_0$ 是条件极值点（限制到曲线后的一元极值）' },
      ],
      goal: 'colline', best: 2,
      routes: [['implF', 'lagrMul'], ['declare', 'implF', 'lagrMul']],
      tip: '两步接力：隐函数定理供「约束曲线光滑可参数化」这条跑道 → 限制成一元、费马定理给出 $df/dt=0$ → 行列式为零 = 两梯度共线。三元情形把曲线换成曲面上的光滑路径，证明同构。',
      anchor: '例 17.3：乘数法必要条件的证明本体——椭球内接长方体（例 17.4）是它的出口',
      necessity: { tag: 'consExt', why: '「条件极值」不翻译成「沿约束曲线的一元极值」，费马定理就没有出场对象——$\\lambda$ 只是共线的签名。' },
    },
    {
      id: 'bp40', mother: 4, ch: '第22章 数学归纳法', title: '归纳起步双验',
      stem: '证明：对一切正整数 $n$，$1^2 + 2^2 + \\cdots + n^2 = \\dfrac{n(n+1)(2n+1)}{6}$。',
      conds: [
        { t: 'baseN', x: '起点：$n=1$ 左右都等于 1（若性质从 $n_0$ 才成立，起点单独验）' },
        { t: 'stepK', x: '递推步：$n=k$ 成立时，加 $(k+1)^2$ 配方得 $k+1$ 的公式' },
      ],
      goal: 'forAll', best: 1,
      routes: [['induct'], ['declare', 'induct']],
      tip: '归纳法的两处死因讲义点名：起点平移没跟上（假设要写「对 $n\\ge n_0$」）、第二归纳法要双起点（斐波那契型同时出现 $a_{n+1},a_n,a_{n-1}$）。',
      anchor: '例 22.1：平方和公式——归纳法的教学级标准像',
      necessity: { tag: 'baseN', why: '没有起点，递推步是悬空的梯子——「$P(k)\\Rightarrow P(k+1)$」全真而 $P(1)$ 假，照样推出空集上的定理。' },
    },
    {
      id: 'bp41', mother: 4, ch: '第22章 构造法', title: '不动点平移化等比',
      stem: '设 $a_1=1$，$a_{n+1}=\\dfrac{2a_n+1}{a_n+2}$。证明：$\\{a_n\\}$ 收敛并求极限。',
      conds: [
        { t: 'recur', x: '分式线性递推给定' },
        { t: 'fixedPt', x: '不动点方程 $L=\\dfrac{2L+1}{L+2}$ 解出 $L=\\pm\\sqrt2$（取正）' },
      ],
      goal: 'geoForm', best: 1,
      routes: [['fixShift'], ['declare', 'fixShift']],
      tip: '构造法精神：把问题变换到「已经会做」的形状。平移 $b_n=a_n-\\sqrt2$ 后 $b_{n+1}=\\dfrac{2-2\\sqrt2}{2+\\sqrt2}\\cdot\\dfrac{b_n}{\\cdots}$ 化成等比——公比绝对值小于 1，收敛白送（母题④的构造臂）。',
      anchor: '例 22.3 / 14.3：不动点平移——递推数列的「换坐标系」',
      necessity: { tag: 'fixedPt', why: '不平移到不动点，分式递推的分子分母各自发散、比值无从下手——平移是让「变化率」变「常数比」的圆心。' },
    },
    {
      id: 'bp42', mother: 6, ch: '第28章 周期函数', title: '周期积分平移不变',
      stem: '设 $f$ 连续、以 $T$ 为周期。证明：对任意 $a$，$\\int_a^{a+T}f\\,dx = \\int_0^T f\\,dx$。',
      conds: [
        { t: 'cont', x: '$f$ 连续（可积性由它保证）' },
        { t: 'periodic', x: '$f(x+T)=f(x)$ 对一切 $x$' },
      ],
      goal: 'transInv', best: 1,
      routes: [['perSplit'], ['declare', 'perSplit']],
      tip: '拆段 $\\int_a^{a+T}=\\int_a^0+\\int_0^T+\\int_T^{a+T}$，末段换元 $u=x-T$ 后与首段正好相消——与区间再现同一族「自己加自己」的对称技巧（母题⑥皮肤之一）。',
      anchor: '定理 28.3：周期积分的平移不变性——拆 + 换元 + 相消',
      necessity: { tag: 'periodic', why: '换元后 $f(u+T)=f(u)$ 的代换全押在周期性——去掉它，末段与首段不再相消，命题立刻假（$e^x$ 的「周期」只能自证反例）。' },
    },
    {
      id: 'bp43', mother: 6, ch: '第28章 周期函数', title: '原函数同周期判',
      stem: '设 $f$ 连续、以 $T$ 为周期。证明：$f$ 的原函数以 $T$ 为周期当且仅当 $\\int_0^T f\\,dx = 0$。',
      conds: [
        { t: 'cont', x: '$f$ 连续' },
        { t: 'periodic', x: '$f$ 以 $T$ 为周期' },
        { t: 'intZeroT', x: '一个周期内积分为零' },
      ],
      goal: 'perFun', best: 1,
      routes: [['periodF'], ['declare', 'periodF']],
      tip: '分解定理：原函数 = 线性项 $\\frac{\\bar f}{T}x$ + 周期项 $P(x)$。周期项 $P(x+T)-P(x)=\\int_x^{x+T}f-\\int_0^Tf$ 恰在「一周期积分为零」时消失——$\\sin x$ 的原函数 $-\\cos x$ 是同款演示。',
      anchor: '例 28.1：周期函数原函数的分解——推论「必有界」是压轴常客',
      necessity: { tag: 'intZeroT', why: '积分不为零（如 $f\\equiv 1$）：原函数是斜线，永远不是周期的——这是「充要」的另一半，去掉就只剩单向。' },
    },
    {
      id: 'bp44', mother: 4, ch: '第28章 Wallis 公式', title: '递推夹逼 π/2',
      stem: '记 $I_n=\\int_0^{\\pi/2}\\sin^n x\\,dx$。证明：$I_n=\\dfrac{n-1}{n}I_{n-2}$ 且 $\\lim\\dfrac{I_{2n}}{I_{2n+1}}=1$。',
      conds: [
        { t: 'intg', x: '$\\sin^n$ 连续可积、分部积分合法' },
        { t: 'nNat', x: '$n$ 为正整数（递推展开 $n-2$ 层）' },
      ],
      goal: 'conv', best: 2,
      routes: [['wallis', 'squeeze'], ['declare', 'wallis', 'squeeze']],
      tip: '分部递推 $I_n=\\frac{n-1}{n}I_{n-2}$ 双路展开；$I_n$ 单调降（$\\sin<1$）给两端、相邻乘积 $I_nI_{n+1}=\\frac1n\\cdot\\frac\\pi2$ 的干净表达给夹逼右端——Wallis 乘积公式就是这么夹出来的。',
      anchor: '例 28.3：Wallis 公式——递推 + 单调 + 夹逼的三合一经典',
      necessity: { tag: 'intg', why: '分部积分要先交代被积项可导连续——$\\sin^n$ 在端点的边界项 $[\\sin^{n-1}x\\cos x]$ 归零正是连续性付的票。' },
    },
    {
      id: 'bp45', mother: 8, ch: '第30章 卷积', title: '独立和的密度',
      stem: '设 $X,Y$ 独立、密度 $f,g$。证明：$Z=X+Y$ 的密度为 $f_Z(z)=\\int_{-\\infty}^{\\infty} f(x)g(z-x)\\,dx$。',
      conds: [
        { t: 'indp', x: '独立性：联合密度 = $f(x)g(y)$ 乘积' },
        { t: 'dens', x: '$f,g$ 是非负归一的密度函数' },
      ],
      goal: 'convDens', best: 1,
      routes: [['convDen'], ['declare', 'convDen']],
      tip: '先走分布函数：$F_Z(z)=\\iint_{x+y\\le z}fg$，对 $z$ 求导（变限求导端点项合法）——卷积公式是「先积分后求导」路线的产物（清单 13 的概率版）。',
      anchor: '例 30.1：卷积公式——独立性是联合密度拆乘积的唯一门票',
      necessity: { tag: 'indp', why: '不独立时联合密度拆不开乘积——同样的「先积后导」只能停在二重积分，卷积公式直接失效。' },
    },
    {
      id: 'bp46', mother: 8, ch: '第30章 极值分布', title: '最大值分布函数',
      stem: '设 $X_1,\\dots,X_n$ 独立同分布、公共分布函数 $F$。证明：$M=\\max X_i$ 的分布函数为 $F_M(z)=F(z)^n$。',
      conds: [
        { t: 'indp', x: '$X_1,\\dots,X_n$ 相互独立' },
        { t: 'cdf', x: '公共分布函数 $F$ 给定（事件 {≤z} 的概率语言）' },
      ],
      goal: 'maxCdf', best: 1,
      routes: [['maxDist'], ['declare', 'maxDist']],
      tip: '分布函数法第一步不是积分是集合：$\\{\\max\\le z\\}=\\bigcap\\{X_i\\le z\\}$——独立性把交事件概率变乘积。最小值取 $\\{\\min>z\\}=\\bigcup^c$ 同款处理（例 30.2）。',
      anchor: '例 30.2：极值分布——「max 不问密度问事件」的方法论样板',
      necessity: { tag: 'indp', why: '相关时 $P(\\cap)=\\prod P$ 不成立——$F^n$ 公式在完全正相关的极端退化回 $F$，独立性是唯一放大器。' },
    },
    {
      id: 'bp47', mother: 10, ch: '第32章 反常积分', title: 'p 积分基准',
      stem: '讨论 $\\int_1^{+\\infty}x^{-p}\\,dx$ 与 $\\int_0^1 x^{-p}\\,dx$ 的敛散性（按 $p$ 分情况）。',
      conds: [
        { t: 'posF', x: '$x^{-p}>0$：正被积函数（比较法方向安全）' },
        { t: 'pRange', x: '$p$ 与 1 的大小关系分情况讨论' },
      ],
      goal: 'intConv', best: 1,
      routes: [['pBase'], ['declare', 'pBase']],
      tip: '两条互补基准背成口诀：无穷远处 $p>1$ 收敛（衰减够快），零点附近 $p<1$ 收敛（爆炸够慢）——$p=1$ 两边都栽在 $\\ln x$ 上。全部判敛题的参照系。',
      anchor: '例 32.1：p-积分基准——反常积分版的「调和/几何级数」',
      necessity: { tag: 'posF', why: '不记号时 $\\int\\sin x\\,dx$ 的振荡可积会绕开基准——p 基准管的是绝对值尺度上的收敛预算。' },
    },
    {
      id: 'bp48', mother: 10, ch: '第32章 比较判别法', title: '极限比较找替身',
      stem: '设 $f\\ge 0$ 连续，$\\lim\\limits_{x\\to+\\infty}x^p f(x)=c\\in(0,+\\infty)$。证明：$\\int_1^{+\\infty}f$ 当且仅当 $p>1$ 时收敛。',
      conds: [
        { t: 'posF', x: '$f\\ge 0$（比较法的前提）' },
        { t: 'cmpK', x: '主部提取：$f$ 与 $cx^{-p}$ 在无穷远等价' },
        { t: 'intRef', x: '参照积分 $\\int_1^\\infty x^{-p}$ 的敛散（p 基准现用）' },
      ],
      goal: 'intConv', best: 1,
      routes: [['cmpInt'], ['declare', 'cmpInt']],
      tip: '极限形式比直接放缩省力：$c\\in(0,\\infty)$ 让 $f$ 在 $(c/2)x^{-p}$ 与 $2cx^{-p}$ 之间——同敛散是夹出来的。判敛第一步永远是「写出无穷远的主部」。',
      anchor: '例 32.2：比较判别法极限形式——「找替身」方法论',
      necessity: { tag: 'cmpK', why: '$c=0$ 或 $+\\infty$ 时只能单向推——极限形式的「当且仅当」恰好依赖非零有限这个窗口。' },
    },
    {
      id: 'bp49', mother: 6, ch: '第35章 傅里叶分析', title: 'Bessel 投影不等式',
      stem: '设 $f$ 平方可积，$a_n,b_n$ 为其傅里叶系数。证明：$\\dfrac{a_0^2}{2}+\\sum(a_n^2+b_n^2)\\le\\dfrac1\\pi\\int_{-\\pi}^{\\pi}f^2\\,dx$。',
      conds: [
        { t: 'sqIntg', x: '$f^2$ 可积（右端能量有限）' },
        { t: 'trigSet', x: '三角系 $\\{1,\\cos nx,\\sin nx\\}$ 两两正交' },
      ],
      goal: 'besselIneq', best: 1,
      routes: [['proj'], ['declare', 'proj']],
      tip: '一切从「残差非负」：$\\int(f-S_n)^2\\ge 0$ 展开，正交性让交叉项归零，系数取投影值（最小化平方误差）——Bessel 是勾股定理在函数空间的无穷维账单；取等号即 Parseval，借它从 $\\sum\\frac1{n^2}$ 求 $\\frac{\\pi^2}6$（例 35.3）。',
      anchor: '例 35.1：Bessel 不等式——C—S 判别式技巧的「高阶皮肤」（母题⑥点名）',
      necessity: { tag: 'trigSet', why: '不正交时展开 $\\int(f-S_n)^2$ 的交叉项不消失——投影系数公式与不等式一起塌，这正是其他正交系（勒让德）要重证一遍的原因。' },
    },
    /* ═══ v2.9 第二波：第 3/4/6/8/11/12/13/15/16/18/19/21 章经典例题 ═══ */
    {
      id: 'bp50', mother: 1, ch: '第3章 介值变化', title: '水平弦定理',
      stem: '设 $f$ 在 $[0,1]$ 连续、$f(0)=f(1)$。证明：存在 $\\xi\\in[0,\\dfrac12]$ 使 $f(\\xi)=f(\\xi+\\dfrac12)$。',
      conds: [
        { t: 'cont', x: '$f$ 在 $[0,1]$ 连续' },
        { t: 'eqEnd', x: '$f(0)=f(1)$（弦的两脚等高）' },
        { t: 'halfDom', x: '平移 $\\frac12$ 后两点仍落在定义域内' },
      ],
      goal: 'root', best: 1,
      routes: [['chordF'], ['declare', 'chordF']],
      tip: '构造 $F(x)=f(x)-f(x+\\frac12)$：$F(0)+F(\\frac12)=f(0)-f(1)=0$——两者异号或双零，零点定理收口。平移自己减自己是水平弦全家福的母构造。',
      anchor: '第 3 章「十八般变化」之水平弦：介值定理的标准变装',
      necessity: { tag: 'eqEnd', why: '去掉 $f(0)=f(1)$：$F(0)$ 与 $F(\\frac12)$ 不再互补，单调函数 $f(x)=x$ 直接证伪整个命题。' },
    },
    {
      id: 'bp51', mother: 2, ch: '第4章 罗尔套路', title: '两导数乘积为一',
      stem: '设 $f$ 在 $[0,1]$ 连续、$(0,1)$ 可导，$f(0)=0$、$f(1)=1$。证明：存在不同 $\\xi,\\eta$ 使 $f\'(\\xi)f\'(\\eta)=1$。',
      conds: [
        { t: 'cont', x: '闭区间连续' },
        { t: 'diff', x: '开区间可导' },
        { t: 'eqEnd01', x: '两端值 $f(0)=0$、$f(1)=1$——图像必穿对角线' },
      ],
      goal: 'prodDeriv', best: 1,
      routes: [['chordProd'], ['declare', 'chordProd']],
      tip: '双中值先分账（清单 05）：介值取 $f(c)=c$ 把图像钉在对角线上，$[0,c]$ 与 $[c,1]$ 各一发拉格朗日——$\\frac{c}{c}\\cdot\\frac{1-c}{1-c}=1$ 分子分母自动约掉。两点分居 $c$ 两侧，天然不同。',
      anchor: '第 4 章双点乘积经典——介值当支点、拉格朗日出两刀',
      necessity: { tag: 'eqEnd01', why: '端点值不对称（如 $f(1)=2$）时约分失效，乘积变成常数 $2$——「等于 $1$」全靠 $0\\to1$ 的首尾呼应。' },
    },
    {
      id: 'bp52', mother: 3, ch: '第6章 泰勒公式', title: '最小值逼二阶导',
      stem: '设 $f$ 二阶可导于 $[0,1]$，$f(0)=f(1)=0$、$\\min f=-1$。证明：存在 $\\xi$ 使 $f\'\'(\\xi)\\ge 8$。',
      conds: [
        { t: 'cont', x: '$f$ 连续（最小值点 $x_0$ 存在）' },
        { t: 'diff2', x: '二阶可导——泰勒到一阶余项二阶' },
        { t: 'crit', x: '内点最小值：$f\'(x_0)=0$（费马白送）' },
      ],
      goal: 'ineq', best: 2,
      routes: [['taylor', 'extma'], ['declare', 'taylor', 'extma']],
      tip: '在最小值点展开、两端点代入：$0\\ge -1+\\frac12 m x_0^2$ 与 $0\\ge -1+\\frac12 m(1-x_0)^2$（$m=\\min f\'\'$），两式相加取 $m\\ge\\frac{2}{x_0^2+(1-x_0)^2}\\ge 8$——分母最大值 $\\frac14$ 在 $x_0=\\frac12$ 取得，中点最紧。',
      anchor: '第 6 章高阶信息压界经典——「端点—中点泰勒」（母题③）的硬核变式',
      necessity: { tag: 'diff2', why: '只有一阶可导时余项控不住——$8$ 这个常数正是二阶展开系数的 $\\frac12$ 与 $x_0=\\frac12$ 的 $\\frac{1}{(1/2)^2}$ 合谋。' },
    },
    {
      id: 'bp53', mother: 9, ch: '第8章 积分极限', title: '边界层集中',
      stem: '设 $f$ 在 $[0,1]$ 连续。证明：$\\lim\\limits_{n\\to\\infty} n\\int_0^1 x^{n} f(x)\\,dx = f(1)$。',
      conds: [
        { t: 'cont', x: '$f$ 连续（$x=1$ 附近可近似为常数）' },
        { t: 'intg', x: '$nx^{n}$ 可积且质量归一趋向 $1$' },
      ],
      goal: 'limVal', best: 1,
      routes: [['boundaryLayer'], ['declare', 'boundaryLayer']],
      tip: '$nx^{n-1}$ 是概率密度家族：质量全堆向 $x=1$。劈段 $\\varepsilon/3$ 法——$[0,1-\\delta]$ 上 $n(1-\\delta)^n\\to0$ 一致干掉，边界段用 $|f(x)-f(1)|<\\varepsilon$ 夹住。母题⑨「头部+尾部」的积分版。',
      anchor: '例 8.3：Dirac 序列的考研先声——「极限进积分号」的合法路线',
      necessity: { tag: 'cont', why: '$f$ 在 $1$ 处不连续（如 $f(1)$ 被改动一点）：极限仍只认左连续值——结论直接失真，连续性是「边界取值」的凭据。' },
    },
    {
      id: 'bp54', mother: 7, ch: '第11章 秩证明', title: '幂等矩阵秩和',
      stem: '设 $A^2=A$（$n$ 阶）。证明：$r(A)+r(A-E)=n$。',
      conds: [
        { t: 'matCond', x: '$A$ 为 $n$ 阶方阵' },
        { t: 'idemP', x: '幂等：$A^2=A$（投影的代数名）' },
      ],
      goal: 'rankSum', best: 1,
      routes: [['idemRank'], ['declare', 'idemRank']],
      tip: '恒等式拆桥：$x=\\frac{x+Ax}{2}+\\frac{x-Ax}{2}$，前项在 $\\mathrm{Im}\\,A$、后项在 $\\mathrm{Ker}\\,A$——$\\mathbb{R}^n=\\mathrm{Im}\\,A\\oplus\\mathrm{Ker}\\,A$，维数公式收口；而 $\\mathrm{Ker}\\,A=\\mathrm{Im}(A-E)$。',
      anchor: '例 11.5：幂等秩和——「解空间翻译」（母题⑦第一步）的标准演出',
      necessity: { tag: 'idemP', why: '不幂等时 $\\frac{x+Ax}{2}$ 未必落进 $\\mathrm{Im}\\,A$ 的互补分解——$A^2=A$ 恰好让两半互相抵消。' },
    },
    {
      id: 'bp55', mother: 7, ch: '第12章 特征值', title: '幂等特征值只有零一',
      stem: '设 $A^2=A$、$\\alpha\\ne 0$ 是特征向量：$A\\alpha=\\lambda\\alpha$。证明：$\\lambda$ 只能是 $0$ 或 $1$。',
      conds: [
        { t: 'matCond', x: '$A$ 方阵、特征向量非零' },
        { t: 'idemP', x: '矩阵满足 $A^2=A$' },
        { t: 'xNe0', x: '$\\alpha\\ne 0$——约分资格' },
      ],
      goal: 'eigEq', best: 1,
      routes: [['eigenIdem'], ['declare', 'eigenIdem']],
      tip: '「先翻译再动手」（清单 18）：$A^2\\alpha=\\lambda^2\\alpha$ 又 $=A\\alpha=\\lambda\\alpha$，$(\\lambda^2-\\lambda)\\alpha=0$，非零向量把系数逼成零——矩阵方程瞬间变小学方程 $\\lambda(\\lambda-1)=0$。',
      anchor: '第 12 章特征值入门样板——任何矩阵多项式方程的特征值都满足数量版',
      necessity: { tag: 'xNe0', why: '特征向量按定义非零；若允许零向量，$A\\cdot0=\\lambda\\cdot0$ 对任何 $\\lambda$ 成立——「约掉向量」全靠非零这张票。' },
    },
    {
      id: 'bp56', mother: 9, ch: '第13章 一致连续', title: 'Heine-Cantor 定理',
      stem: '设 $f$ 在闭区间 $[a,b]$ 连续。证明：$f$ 在 $[a,b]$ 一致连续。',
      conds: [
        { t: 'cont', x: '$f$ 在 $[a,b]$ 逐点连续' },
        { t: 'closedSeg', x: '区间是闭的（致密性只在闭集里放行）' },
      ],
      goal: 'unifCont', best: 1,
      routes: [['heine'], ['declare', 'heine']],
      tip: '反证流水线（清单 10 的镜像）：否定式造点对列 $|x_n-y_n|\\to0$ 但 $|f(x_n)-f(y_n)|\\ge\\varepsilon_0$——致密性抽收敛子列 $x_{n_k}\\to x^*$，则 $y_{n_k}\\to x^*$，逐点连续性接管矛盾。「闭」字把极限点留在场内。',
      anchor: '定理 13.1：Heine-Cantor——开区间的 $\\frac1x$ 证明「闭」不可丢',
      necessity: { tag: 'closedSeg', why: '换成开区间 $(0,1)$：$f=\\frac1x$ 连续却不一致——极限点逃到区间外时，连续性追不上。' },
    },
    {
      id: 'bp57', mother: 10, ch: '第15章 一致收敛', title: 'Abel 判法领票',
      stem: '证明 $\\sum\\limits_{n=1}^{\\infty}\\dfrac{(-1)^{n} x^{n}}{n}$ 在 $[0,1]$ 上一致收敛。',
      conds: [
        { t: 'monoZero', x: '$\\frac{x^n}{n}$ 关于 $n$ 单调降且一致趋零（$x\\in[0,1]$）' },
        { t: 'bndSum', x: '$\\sum(-1)^n$ 部分和一致有界（$\\le1$）' },
      ],
      goal: 'unifConv', best: 1,
      routes: [['abelTest'], ['declare', 'abelTest']],
      tip: 'M 判别法在这里失效（优级数 $\\sum\\frac1n$ 发散）——Abel 是端点处交错级数的专用门票：系数单调趋零 + 部分和有界，两条腿缺一不可（Dirichlet 版的加强）。',
      anchor: '例 15.5：Abel 一致收敛——幂级数收敛半径端点的续票',
      necessity: { tag: 'bndSum', why: '部分和无界时 Abel 变换求不出一致余项——$\\sum x^n$ 在 $x\\to1$ 处正是无界失败样本。' },
    },
    {
      id: 'bp58', mother: 6, ch: '第16章 积分不等式', title: '加权 C—S（积分版母式）',
      stem: '设 $f,g$ 连续、$g>0$ 于 $[a,b]$。证明：$\\left(\\int_a^b f\\,dx\\right)^{2}\\le\\int_a^b\\dfrac{f^{2}}{g}\\,dx\\cdot\\int_a^b g\\,dx$。',
      conds: [
        { t: 'cont', x: '$f,g$ 连续' },
        { t: 'intg', x: '各积分存在' },
        { t: 'posG', x: '$g>0$：权函数保号——除法与开方合法' },
      ],
      goal: 'ineq', best: 1,
      routes: [['csW'], ['declare', 'csW']],
      tip: '母式还是那个判别式：对 $\\varphi(\\lambda)=\\int\\big(\\frac{f}{\\sqrt g}-\\lambda\\sqrt g\\big)^2\\ge0$ 展开——$g>0$ 让 $\\sqrt g$ 出场合法（清单 12 的「选 $\\lambda$ 调节」在积分版里变成选权重）。',
      anchor: '例 16.1：加权 Schwarz——母题⑥「积分皮肤」的正主',
      necessity: { tag: 'posG', why: '$g$ 变号时 $\\frac{f^2}{g}$ 失去非负性、$\\sqrt g$ 不存在——判别式技巧整条腿骨折。' },
    },
    {
      id: 'bp59', mother: 6, ch: '第18章 多元积分', title: '奇偶对称消元',
      stem: '设 $\\Omega$ 关于 $xOy$ 面对称、$f$ 连续且 $f(-x,-y,z)=-f(x,y,z)$ 型奇对称。证明：$\\iiint_\\Omega f\\,dv=0$。',
      conds: [
        { t: 'oddFn', x: '被积函数关于对称变换取反' },
        { t: 'symDom', x: '积分区域关于该平面对称' },
      ],
      goal: 'intZero', best: 1,
      routes: [['symDel'], ['declare', 'symDel']],
      tip: '清单 15 的三重积分版：区域拆上下两半，换元 $z\\to-z$ 让两半互为相反数——散度含奇函数「直接归零」不是玄学，是一次换元的算术。',
      anchor: '第 18 章高斯公式实战标配——先查奇偶对称再动笔计算',
      necessity: { tag: 'symDom', why: '区域不对称（半球）时两半不相消——对称域与奇函数必须成对出现，缺一即失效。' },
    },
    {
      id: 'bp60', mother: 7, ch: '第19章 合同与惯性', title: '惯性指数身份证',
      stem: '设实对称 $A\\simeq B$（合同：$C\'AC=B$，$C$ 可逆）。证明：$A,B$ 正惯性指数相同。',
      conds: [
        { t: 'matCond', x: '$A,B$ 实对称' },
        { t: 'congr', x: '合同关系 $C\'AC=B$ 且 $C$ 可逆' },
      ],
      goal: 'inIdx', best: 1,
      routes: [['inertia'], ['declare', 'inertia']],
      tip: '合同=同一二次型换坐标系：$x\'Ax=y\'By$（$y=Cx$ 双射）。正惯性=能把型变正的子空间最大维数——换坐标不改变「存在多大正平面」这个事实，维数论证收口（Sylvester 定律）。',
      anchor: '例 19.5：惯性定律——「合同但相似？」判断题的底层依据',
      necessity: { tag: 'congr', why: '$C$ 退化时 $y=Cx$ 不再双射——正平面可被压扁，惯性指数可升可降，唯一不变量失联。' },
    },
    {
      id: 'bp61', mother: 6, ch: '第21章 概率统计', title: '相关系数有界',
      stem: '设 $X,Y$ 二阶矩存在。证明：$|\\rho_{XY}|\\le 1$，且等号当且仅当 $Y=aX+b$ 几乎处处成立。',
      conds: [
        { t: 'probSet', x: '$DX,DY>0$：标准化有分母' },
        { t: 'expLin', x: '期望的线性性可用（拆方差的基础运算）' },
      ],
      goal: 'ineq', best: 1,
      routes: [['corrBnd'], ['declare', 'corrBnd']],
      tip: '非负放大器（母题⑧）：$0\\le D\\big(\\frac{X-EX}{\\sqrt{DX}}\\pm\\frac{Y-EY}{\\sqrt{DY}}\\big)=2\\pm2\\rho$——两个方向各夹出 $\\rho\\le1$ 与 $\\rho\\ge-1$。等号=方差为零=几乎处处常数=直线相关。',
      anchor: '第 21 章：C—S 的期望皮肤——母题⑥三张面孔之二',
      necessity: { tag: 'probSet', why: '方差为零时 $\\rho$ 无定义（分母塌）；二阶矩不存在时连 $\\mathrm{Cov}$ 都写不出——放大器需要能量源。' },
    },
    /* ═══ v3.0：第 23 章综合大题 + 第 24 章自测卷 + 散题补挖 ═══ */
    {
      id: 'bp62', mother: 9, ch: '第23章 综合演练', title: '离散化中值点列',
      stem: '设 $f$ 在 $[0,+\\infty)$ 可导且 $\\lim\\limits_{x\\to+\\infty}f(x)=A$。证明：存在 $\\xi_n\\in(n,n+1)$ 使 $f\'(\\xi_n)\\to 0$。',
      conds: [
        { t: 'diff', x: '$f$ 在每段 $[n,n+1]$ 连续、$(n,n+1)$ 可导' },
        { t: 'tailLim', x: '$f(x)\\to A$：整数列两端同趋 $A$' },
      ],
      goal: 'derivSeq', best: 1,
      routes: [['discMid'], ['declare', 'discMid']],
      tip: '「数列结论靠小区间中值打印点列」——每段拉格朗日给 $f\'(\\xi_n)=f(n+1)-f(n)$，右端两子列都趋 $A$，相减趋零。离散化中值是压轴第一问的入口套路（大题一(1)）。',
      anchor: '第 23 章大题一：数列极限 × 中值定理 × 一致连续的合成演习（上）',
      necessity: { tag: 'tailLim', why: '$f$ 无极限（如 $f(x)=\\sin x^2$）时差商列可任意振荡——$A$ 的存在是相减归零的账本。' },
    },
    {
      id: 'bp63', mother: 9, ch: '第23章 综合演练', title: '导数有界致一致连续',
      stem: '设 $f\'$ 在 $[0,+\\infty)$ 上有界：$|f\'|\\le M$。证明：$f$ 在 $[0,+\\infty)$ 一致连续。',
      conds: [
        { t: 'diff', x: '全区间可导' },
        { t: 'derBd', x: '$|f\'|\\le M$：导数有界' },
      ],
      goal: 'unifCont', best: 1,
      routes: [['lipBoot'], ['declare', 'lipBoot']],
      tip: '任意区间上拉格朗日：$|f(x)-f(y)|\\le M|x-y|$——Lipschitz 一步到位，$\\delta=\\varepsilon/M$ 与点无关。与「头部紧性+尾段极限」拼接法（第 13 章）并存的第二条路线：按题设有什么用什么。',
      anchor: '第 23 章大题一(2)：导数有界 ⇒ Lipschitz ⇒ 一致连续，一条线三步',
      necessity: { tag: 'derBd', why: '$\\sqrt{x}$ 于 $[0,\\infty)$ 反证：一致连续却导数无界——界 $M$ 正是 $\\delta$ 公式的分母，抽掉整个估计失重。' },
    },
    {
      id: 'bp64', mother: 7, ch: '第23章 综合演练', title: '瑞利商极小极大',
      stem: '设 $A$ 实对称、特征值 $\\lambda_1\\le\\cdots\\le\\lambda_n$。证明：$\\min\\limits_{x\\ne 0}\\dfrac{x\'Ax}{x\'x}=\\lambda_1$。',
      conds: [
        { t: 'matCond', x: '$A$ 实对称（正交对角化可用）' },
        { t: 'xNe0', x: '$x\\ne 0$：商的分母活着' },
      ],
      goal: 'eigMin', best: 2,
      routes: [['eigDef', 'rayleigh'], ['declare', 'eigDef', 'rayleigh']],
      tip: '两步接力：谱定理把 $x$ 搬到特征基坐标（$x\'Ax=\\sum\\lambda_ic_i^2$），再展开重心差 $R(x)-\\lambda_1=\\frac{\\sum c_i^2(\\lambda_i-\\lambda_1)}{\\sum c_i^2}\\ge0$——「加权平均不小于最小权重项」的矩阵化（大题三）。',
      anchor: '第 23 章大题三：变分刻画特征值——线代与分析的合流点',
      necessity: { tag: 'matCond', why: '不对称时 $x\'Ax$ 只看到对称部分 $\\frac{A+A\'}2$——瑞利商与特征值脱钩，极小原理整个失效。' },
    },
    {
      id: 'bp65', mother: 8, ch: '第23章 综合演练', title: '协方差矩阵半正定',
      stem: '设 $(X_1,\\dots,X_n)$ 二阶矩存在，$\\Sigma=(\\mathrm{Cov}(X_i,X_j))$。证明：$\\Sigma$ 半正定。',
      conds: [
        { t: 'probSet', x: '各 $X_i$ 二阶矩存在（$\\Sigma$ 的元素都有限）' },
        { t: 'expLin', x: '期望线性性可用（方差展开的基础运算）' },
      ],
      goal: 'posDef', best: 1,
      routes: [['covPSD'], ['declare', 'covPSD']],
      tip: '一行证明压住一页纸：$t\'\\Sigma t=D(\\sum t_iX_i)\\ge0$——方差是天然非负量（清单 20），二次型只是它的换装。概率向线代供弹药的教科书案例（大题五；等号条件=线性相关）。',
      anchor: '第 23 章大题五：协方差矩阵半正定——母题⑧跨章进⑦的语言',
      necessity: { tag: 'probSet', why: '柯西型分布二阶矩不存在：$\\Sigma$ 根本无定义——半正定的前提先是「有值可谈」。' },
    },
    {
      id: 'bp66', mother: 8, ch: '第23章 综合演练', title: '最小二乘正定地基',
      stem: '设 $X$ 是 $n\\times p$ 列满秩阵（$n\\ge p$）。证明：$X\'X$ 正定，从而正规方程 $X\'X\\hat\\beta=X\'y$ 唯一可解。',
      conds: [
        { t: 'matCond', x: '$X\'X$ 对称（合同结构自带）' },
        { t: 'colFull', x: '列满秩：$Xx=0$ 只有零解' },
        { t: 'xNe0', x: '$x\\ne 0$ 时 $Xx\\ne 0$——放大器的扳机' },
      ],
      goal: 'posDef', best: 1,
      routes: [['normalEq'], ['declare', 'normalEq']],
      tip: '平方和放大器（母题⑧）的统计学正主：$x\'(X\'X)x=\\Vert Xx\\Vert^2>0$。列满秩⟺$Xx\\ne0$（$x\\ne0$）⟺ Gram 阵正定——三重身份一条等式锁死，最小二乘的唯一性由此免费。',
      anchor: '第 23 章大题八：多元回归 × 线代 × 最优化——$X\'X$ 是全部统计推断的地基',
      necessity: { tag: 'colFull', why: '列亏秩时存在 $x\\ne0$ 使 $Xx=0$：二次型取到零，正定退半正定，正规方程解无穷——共线性诊断的全部意义。' },
    },
    {
      id: 'bp67', mother: 10, ch: '第23章 综合演练', title: '格林核先积后放',
      stem: '设 $f$ 连续非负于 $[0,1]$。证明：$\\int_0^1\\left(\\int_0^x f(t)\\,dt\\right)dx=\\int_0^1(1-t)f(t)\\,dt$，并由此放缩。',
      conds: [
        { t: 'cont', x: '$f$ 连续（可积与换序前提）' },
        { t: 'intg', x: '二重积分区域有界（Fubini 合法）' },
      ],
      goal: 'ineq', best: 1,
      routes: [['greenFubini'], ['declare', 'greenFubini']],
      tip: '三角形区域上换序：先 $x$ 后 $t$ 变先 $t$ 后 $x$——内层精确积出核 $(1-t)$，剩下的放缩有整体结构托底。「先积分后放缩」（清单 13）的压轴级演出：反过来只能拿到粗界（大题二）。',
      anchor: '第 23 章大题二：积分 × 格林函数 × 换序——换序次序决定常数精度',
      necessity: { tag: 'intg', why: '无界区域（$\\int_0^\\infty$）上换序要额外的控制收敛条件——有界三角域是本题换序免费的凭据。' },
    },
    {
      id: 'bp68', mother: 5, ch: '第24章 自测A卷', title: '恰一实根双柱',
      stem: '证明方程 $x^{3}-3x+1=0$ 在 $(0,1)$ 内有且仅有一个实根。',
      conds: [
        { t: 'cont', x: '多项式处处连续' },
        { t: 'signDiff', x: '$f(0)=1>0$、$f(1)=-1<0$ 端点异号' },
        { t: 'monoF', x: '$f\'(x)=3x^{2}-3<0$ 于 $(0,1)$：严格递减' },
      ],
      goal: 'exactlyOne', best: 2,
      routes: [['zero', 'existUnique'], ['declare', 'zero', 'existUnique']],
      tip: 'A1 评分点原话：存在性（零点定理）与唯一性（单调）两条腿缺一不可——只写其一最多半分。清单 09 的标准照：先介值钉住，再单调收编。',
      anchor: '第 24 章 A1：「有且仅有」双柱结构——阅卷采分点表的第一行',
      necessity: { tag: 'monoF', why: '去掉单调腿：$x^3-3x+1$ 在 $(-2,2)$ 内三根皆实——「恰一」的 uniqueness 全部押在递减上。' },
    },
    {
      id: 'bp69', mother: 4, ch: '第24章 自测A卷', title: '黄金比迭代收敛',
      stem: '设 $x_1=1$，$x_{n+1}=1+\\dfrac{1}{x_n}$。证明 $\\{x_n\\}$ 收敛并求极限。',
      conds: [
        { t: 'recur', x: '递推式给定（连分数结构）' },
        { t: 'indBound', x: '归纳上界定界：$1\\le x_n<\\varphi$——界 $\\varphi$ 来自解 $\\varphi=1+\\frac1\\varphi$' },
      ],
      goal: 'conv', best: 1,
      routes: [['iterConv'], ['declare', 'iterConv']],
      tip: 'A2 评分点：上界的归纳必须真正用到定值方程 $\\varphi=1+\\frac1\\varphi$，凭空写 $x_n<\\varphi$ 拿不到满分。定界 + 单调（$x_{n+1}-x_n$ 符号跟着 $x_n-\\varphi$ 走）→ 收敛 → 取极限回代定 $L=\\varphi$（母题④全套）。',
      anchor: '第 24 章 A2：连分数迭代——定值方程既是猜极限的球探又是验证的教练',
      necessity: { tag: 'indBound', why: '不先定界就取极限 = 用未收敛数列写 $\\lim$（军规一逻辑雷）——$\\varphi$ 界是极限记号的合法化凭证。' },
    },
    {
      id: 'bp70', mother: 7, ch: '第12章 相似对角化', title: '相似保谱搬运',
      stem: '设 $B=P^{-1}AP$（相似）。证明：$A$ 的特征值都是 $B$ 的特征值。',
      conds: [
        { t: 'matCond', x: '$P$ 可逆：搬运工有回程票' },
        { t: 'similar0', x: '$B=P^{-1}AP$ 写成等式待用' },
      ],
      goal: 'eigEq', best: 1,
      routes: [['simSpec'], ['declare', 'simSpec']],
      tip: '两条等价路：行列式语言 $|B-\\lambda I|=|P^{-1}||A-\\lambda I||P|$ 特征多项式相同；或向量搬运 $A x=\\lambda x\\Rightarrow B(P^{-1}x)=\\lambda(P^{-1}x)$——特征值原地不动、特征向量被 $P$ 搬家（例 12.3）。',
      anchor: '例 12.3：相似不变量——「先翻译再动手」在特征值语言里的那次',
      necessity: { tag: 'similar0', why: '$P$ 不可逆时搬运工会把非零向量搬成零——特征向量定义当场被杀，相似退化成普通乘法。' },
    },
    {
      id: 'bp71', mother: 10, ch: '第9章 级数敛散', title: '莱布尼茨双柱',
      stem: '设 $a_n\\downarrow 0$。证明：交错级数 $\\sum\\limits_{n=1}^{\\infty}(-1)^{n}a_n$ 收敛。',
      conds: [
        { t: 'altSign', x: '符号交错：$(-1)^n$ 两两抵消的结构性资源' },
        { t: 'monoZero', x: '$a_n$ 单调降且趋零（双柱本体）' },
      ],
      goal: 'serConv', best: 1,
      routes: [['leibniz'], ['declare', 'leibniz']],
      tip: '偶数项部分和递增、奇数项=偶数项减一个正元——两列夹向同一极限。缺单调可造发散振荡、缺趋零通项直接不过关（例 9.2 的两柱教学）。',
      anchor: '例 9.2：莱布尼茨判别法——条件收敛世界的入门签证',
      necessity: { tag: 'monoZero', why: '$a_n$ 不趋零时通项不归零，收敛免谈；不单调时偶子列可一路创新高——两根柱子少一根塔就歪。' },
    },
    {
      id: 'bp72', mother: 10, ch: '第15章 幂级数', title: 'Abel 端点延拓',
      stem: '设 $\\sum a_n$ 收敛。证明：$\\lim\\limits_{x\\to1^-}\\sum a_nx^{n}=\\sum a_n$。',
      conds: [
        { t: 'serConv', x: '数项级数收敛（端点账本已结清）' },
      ],
      goal: 'limVal', best: 1,
      routes: [['abelLim'], ['declare', 'abelLim']],
      tip: '劈段：尾部用 $\\sum a_n$ 收敛的 Cauchy 准则 + Abel 变换控住（$x^n$ 单调有界）；头部有限项逐项令 $x\\to1^-$。Abel 极限定理=幂级数在收敛端点的「连续延拓」——$\\sum\\frac{(-1)^n}{n+1}=\\ln2$ 的合法化证书（例 15.7）。',
      anchor: '例 15.7：Abel 第二定理——「借级数求和」的最后一块门票',
      necessity: { tag: 'serConv', why: '$\\sum a_n$ 发散（如 $a_n=1$）时 $\\sum x^n=\\frac{x}{1-x}\\to\\infty$：端点无和，延拓无从谈起。' },
    },
    {
      id: 'bp73', mother: 11, ch: '第16章 凸函数', title: 'Jensen 积分版',
      stem: '设 $f\'\'\\ge 0$、$g\\ge 0$ 连续于 $[a,b]$ 且 $\\int g>0$。证明：$f\\!\\left(\\dfrac{\\int gy}{\\int g}\\right)\\le\\dfrac{\\int f(y)\\,g}{\\int g}$。',
      conds: [
        { t: 'cont', x: '函数连续（积分与介值合法）' },
        { t: 'diff2', x: '$f\'\'\\ge 0$：凸性入场券' },
        { t: 'posG', x: '$g\\ge0$、$\\int g>0$：权重保号可归一' },
      ],
      goal: 'ineq', best: 1,
      routes: [['jensen'], ['declare', 'jensen']],
      tip: '凸=处处在切线上方。取切点为「加权重心」$x_0=\\frac{\\int gy}{\\int g}$，代入切线不等式再以 $g$ 加权积分——右端线性项恰好自消（重心定义使然）。母题⑪三刀的积分形态（例 16.5）。',
      anchor: '例 16.5：Jensen 不等式——切线刀在积分里的复刻',
      necessity: { tag: 'posG', why: '权重变号时「加权积分保序」失效，切线不等式被乘负数翻转——Jensen 的整个方向感系于 $g\\ge0$。' },
    },
    {
      id: 'bp74', mother: 8, ch: '第33章 大数定律', title: '样本均值噪声衰减',
      stem: '设 $X_1,\\dots,X_n$ 独立同分布、$EX_i=\\mu$、$DX_i=\\sigma^2$。证明：$D\\bar X=\\dfrac{\\sigma^{2}}{n}$。',
      conds: [
        { t: 'probSet', x: '二阶矩存在（$\\sigma^2$ 有限）' },
        { t: 'expLin', x: '期望线性性（拆 $\\bar X-\\mu$ 的手术刀）' },
        { t: 'indp', x: '独立性：交叉项期望归零的门票' },
      ],
      goal: 'varEq', best: 1,
      routes: [['sampVar'], ['declare', 'sampVar']],
      tip: '$D\\bar X=\\frac1{n^2}\\sum D X_i+\\frac1{n^2}\\sum_{i\\ne j}\\mathrm{Cov}$——独立让交叉项集体退场，只剩 $n$ 个 $\\sigma^2/n^2$。$\\frac1{\\sqrt n}$ 是噪声衰减的宇宙常数：大数定律、置信区间、中心极限定理共用的第一块基石（例 33.3）。',
      anchor: '例 33.3：样本均值方差——一切统计推断的误差预算表',
      necessity: { tag: 'indp', why: '完全相关（$X_i\\equiv X_1$）时 $D\\bar X=\\sigma^2$ 与 $n$ 无关——独立性是「平均降噪」的唯一供应商。' },
    },
    {
      id: 'bp75', mother: 4, ch: '第34章 Stolz 应用', title: 'Cesàro 平均收敛',
      stem: '设 $x_n\\to a$。证明：算术平均 $\\dfrac{x_1+\\cdots+x_n}{n}\\to a$。',
      conds: [
        { t: 'ratioLim', x: '差商收敛：$\\big(\\sum_{k\\le n}x_k\\big)-\\big(\\sum_{k\\le n-1}x_k\\big)=x_n\\to a$' },
        { t: 'denInf', x: '分母 $n$ 严格增趋 $+\\infty$（Stolz 唯一入场券）' },
      ],
      goal: 'limVal', best: 1,
      routes: [['stolz'], ['declare', 'stolz']],
      tip: '把 Cesàro 写成 $\\frac{S_n}{n}$ 型再请 Stolz——差商恰好是 $x_n$ 本身，一步到岸。逆命题假（平均收敛推不出原列收敛，$(-1)^n$ 候着）：Stolz 单向通行的又一生动教材。',
      anchor: '第 34 章：Cesàro 均值——Stolz 定理「离散洛必达」身份的最短演示',
      necessity: { tag: 'denInf', why: '$n\\to\\infty$ 且严格增才够资格当分母——换成有界分母时「平均」失去稀释力，定理整条失效。' },
    },
    {
      id: 'bp76', mother: 6, ch: '第28章 对称再现', title: 'sin 对称再现',
      stem: '设 $f$ 连续。证明：$\\int_0^{\\pi}x\\,f(\\sin x)\\,dx=\\dfrac{\\pi}{2}\\int_0^{\\pi}f(\\sin x)\\,dx$。',
      conds: [
        { t: 'cont', x: '$f$ 连续（复合后仍可积）' },
        { t: 'symDom', x: '$[0,\\pi]$ 关于 $x\\to\\pi-t$ 对称、$\\sin(\\pi-t)=\\sin t$ 零件不变' },
      ],
      goal: 'intVal', best: 1,
      routes: [['replay'], ['declare', 'replay']],
      tip: '区间再现换元 $x=\\pi-t$：换元式与原式相加，$x$ 与 $\\pi-x$ 合出常数 $\\pi$——「零件不变、自己加自己」（例 8.2 同族，三角皮肤）。',
      anchor: '第 28 章：$\\sin$ 对称再现——区间再现法在周期零件上的复刻',
      necessity: { tag: 'symDom', why: '零件 $\\sin(\\pi-t)\\ne\\sin t$ 时（如 $\\cos x$）换元得负号、相加不闭合——对称域+不变零件必须成对。' },
    },
  ]

  /* ═══ 母题谱系（讲义 25.11 母题—章节对照表：一题生万题） ═══
   * 13 条主线 ①–⑬：①–⑩ 对应 25.1–25.10 十个母题小节，⑪⑫⑬ 属拓谱二期
   * （凸性 / Darboux / 解空间结构，正文在第十六、二十六、二十七、二十九章）。
   * 每道寻路题的 mother 字段指向这里——真题从不重复，但母题永远重复。 */
  let MOTHERS = [
    { no: 1, name: '积分因子构造族', skel: '要证 $f\'+Pf=0$ 型：令 $F=e^{\\int P}f$，导数恰含该因子——罗尔的百变面具', home: '第四章', link: '第二十二章', tr: '导数与原函数线性组合' },
    { no: 2, name: '双中值点分账', skel: '结论含两个中值点：先问地位是否相同——不同则劈区间，相同则两定理各打一发', home: '第五章', link: '第二十三章', tr: '两个 $\\xi,\\eta$ 并列' },
    { no: 3, name: '端点—中点泰勒', skel: '给到 $f\'\'$ 信息且结论存在型：在中点展开、端点代入，两式相加减消导数', home: '第六章', link: '第二十三章', tr: '$f\'\'$ + 存在等式' },
    { no: 4, name: '单调有界 / 迭代', skel: '递推数列三部曲：解 $f(L)=L$ 猜极限 → 单调有界或压缩证收敛 → 回代定 $L$', home: '第二·十四章', link: '第二十二章', tr: '$x_{n+1}=f(x_n)$' },
    { no: 5, name: '变限积分造等值点', skel: '「积分+中值」混合题：令 $F(x)=\int_a^x f$，积分中值定理白送等值点', home: '第三·八章', link: '第二十四章', tr: '积分条件 + 微分结论' },
    { no: 6, name: 'C—S 三重奏', skel: '同一个判别式技巧三种皮肤：积分 / 期望 / 矩阵一个母式，等号=两因子成比例', home: '第八·十六章', link: '第二十一·二十三章', tr: '平方积分 × 平方积分' },
    { no: 7, name: '秩三段论', skel: '$AB=O$ 译成解空间包含：Sylvester 夹逼 + 秩等式定位，三段论通用三步', home: '第十一·二十章', link: '第十九章', tr: '矩阵关系 → 秩结论' },
    { no: 8, name: '非负性放大器', skel: '找天然非负的量（方差 / 二次型 / 平方和）然后展开它——概率与线代的公共引擎', home: '第二十一章', link: '第十九·二十三章', tr: '期望 / 方差 / 正定' },
    { no: 9, name: '紧性与拼接', skel: '开区间或无穷区间上证闭区间结论：尾段用极限、头部用紧性、中转点接力', home: '第十三章', link: '第二十三章', tr: '$(a,+\\infty)$ 上一致连续' },
    { no: 10, name: '换序特权', skel: '极限·求和·积分·求导四张牌两两交换都要验票——M 判别法是标准门票', home: '第十五章', link: '第九章', tr: '一致收敛 / 逐项交换' },
    { no: 11, name: '凸性三刀', skel: '先定号（$f\'\'\\ge 0$），再切线 / 弦 / Jensen 三刀任选——不等式一刀一个', home: '第十六·二十六章', link: '第七章', tr: '凸 + 积分或求和不等式' },
    { no: 12, name: 'Darboux 声明', skel: '对 $f\'$ 用介值，必须先声明导数无第一类间断（Darboux）——不声明就踩雷', home: '第二十七章', link: '第四·五章', tr: '$f\'$ 取中间值' },
    { no: 13, name: '解空间同构', skel: 'ODE 解空间 = 线代解结构的分析版：特解 + 核，「先翻译再动手」', home: '第十一·二十九章', link: '第十九章', tr: '解的结构 / 线性相关' },
  ]
  let CIRCLED = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬']
  /* 考前二十条清单（讲义 25.15）——「考场上的灵光一现，不过是清单第二十条的条件反射」 */
  let CHECKLIST = [
    '辅助函数另起一行写，声明区间与连续可导性（踩分点）',
    '罗尔前提三件套：闭区间连续、开区间可导、端点等值',
    '结论含 $f\'+Pf=0$ 型 → 立刻想积分因子 $e^{\\int P}$',
    '结论含 $\\xi f\'+f$ → 乘 $x$；含 $f\'g-fg\'$ → 作商',
    '双中值先问地位是否相同，再选「劈区间」或「两定理」',
    '给到 $f\'\'$ 信息 → 找信息交汇点作泰勒，两端展开相加减',
    '递推数列：先解 $f(L)=L$ 猜极限，再证收敛，最后定 $L$',
    '不单调的递推：试压缩 $|f\'|\\le k<1$，或交比构造',
    '「存在 $\\xi$ 使…」→ 零点/介值；「恰一」→ 补单调',
    '不一致连续的反证流水线：$\\varepsilon_0$ → 造点对 → 致密性抽子列',
    '一致收敛的 M 判别法是换序的唯一门票，反例记 $x^{n}$ 一族',
    '积分不等式先试 C—S（选 $\\lambda$ 调节），再试对称化与格林函数',
    '「先积分后放缩」几乎总比「先放缩后积分」精确',
    '格林公式先查封闭性；不闭就补线，补的线取坐标轴最省力',
    '高斯公式先查内外侧与奇偶对称，散度含奇函数直接归零',
    '偏导连续 ⟹ 可微 ⟹ 连续且偏导存在；两条箭头都不可逆',
    '隐函数存在性抓「$F$ 对目标变量的偏导非零」；条件极值抓 Lagrange',
    '线代证明先翻译成「解空间 / 特征值 / 二次型」三种语言之一再动手',
    '正定证明默认顺序：定义 → 特征值 → 顺序主子式 → $LDL\'$',
    '概率证明找天然非负量：方差、平方项、指示函数——展开它',
  ]

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
    { q: '要证 $x>0$ 时 $\\ln(1+x)<x$，第一动作？', opts: ['令 $g(x)=x-\\ln(1+x)$，验 $g(0)=0$ 判 $g\'$ 号', '泰勒展开到二阶', '对两边积分', '反设存在反例', '用柯西中值定理', '夹逼放缩'], a: 0, why: '决策表第 1 行：可移项作差 → 单调性法，基点 0 白送 g(0)=0（例 7.1）。' },
    { q: '比较 $e^{\\pi}$ 与 $\\pi^{e}$，化简方向？', opts: ['取对数化为比较 $\\dfrac{\\ln x}{x}$ 的单调性', '直接数值计算', '平方比较', '泰勒展开', '夹逼准则', '柯西不等式'], a: 0, why: '幂指结构先取对数——化为同一函数在两点比大小，极值收口（例 7.2）。' },
    { q: '$\\int_0^{\\pi} x f(\\sin x)\\,dx$ 型积分，首选换元？', opts: ['$x=\\pi-t$（区间再现）', '$x=2t$', '$t=\\sin x$', '$t=\\cos x$', '不换元直接分部', '$x=t^2$'], a: 0, why: '区间再现：$\\sin(\\pi-t)=\\sin t$ 零件不变，换元后与原式相加消去 x（例 8.2）。' },
    { q: '$\\sum a_n$ 收敛（$a_n\\ge0$），证 $\\sum\\dfrac{a_n}{n^{2/3}}$ 收敛的武器？', opts: ['柯西-施瓦茨：$(\\sum\\frac{a_n}{n^{2/3}})^2\\le\\sum a_n\\cdot\\sum\\frac1{n^{4/3}}$', '直接比较 $\\frac1{n^{2/3}}\\le1$', '莱布尼茨判别法', '比值判别法', '根值判别法', '积分判别法'], a: 0, why: '例 9.1 三大高频构造之一：CS 放缩，$\\sum n^{-4/3}$ 收敛是现成的右端。' },
    { q: '判级数在 $[0,1]$ 一致收敛，首选？', opts: ['M 判别法：找与 $x$ 无关的收敛优级数', '直接算余项极限', '用柯西收敛准则逐点', '莱布尼茨判别法', '比值判别法', 'Abel 判别法'], a: 0, why: '例 15.2：一致收敛判定首选 M 判别；判「不一致」首选和函数不连续反证（例 15.3）。' },
    { q: '证「不同特征值的特征向量线性无关」，第一动作？', opts: ['反设线性组合为零，左乘 $A$ 后与原式的 $\\lambda$ 倍相减', '直接算行列式', '用迹等于特征值和', '相似对角化', 'Cayley-Hamilton', '取内积'], a: 0, why: '例 12.1 标准开局：左乘 A 制造第二个等式，相减消向量——「双方程相减」母题。' },
    { q: '实对称矩阵特征向量正交，关键一步？', opts: ['用 $A\'=A$ 把 $(A\\alpha)\\cdot\\beta$ 换成 $\\alpha\\cdot(A\\beta)$——同一内积两种算法', '直接坐标展开计算', '引用谱定理', '用 Rayleigh 商', '取模平方', '化二次型标准形'], a: 0, why: '例 12.2 精髓：对称性让 $A$ 在内积间自由穿梭，$(\\lambda_1-\\lambda_2)(\\alpha\\cdot\\beta)=0$ 收口。' },
    { q: '格林公式证路径无关，先拿什么「许可证」？', opts: ['$\\frac{\\partial P}{\\partial y}=\\frac{\\partial Q}{\\partial x}$ 在单连通域内成立', '先求出势函数', '先把曲线参数化', '验证 $P,Q$ 有界', '验证曲线光滑', '直接算闭曲线积分'], a: 0, why: '定理 18.3 四等价：先验偏导相等拿到许可证，再把路径换成直线段——被积函数当场退化。' },
    /* —— 考前二十条清单直接入题（25.15）—— */
    { q: '答题纸上写辅助函数，清单第 01 条要求的踩分点动作是？', opts: ['另起一行写，并声明所在区间与连续可导性', '写在推理链中间省行数', '只给公式不必声明', '先声明定理再补构造', '用图代替构造', '把构造藏进反证'], a: 0, why: '清单 01：构造是独立踩分点——另起一行 + 声明性质，阅卷人第一时间找的就是这两样。' },
    { q: '罗尔定理的前提三件套（清单 02）不含下列哪一项？', opts: ['导函数有界', '闭区间连续', '开区间可导', '端点等值', '区间为有限闭区间', '——以上五项全是前提'], a: 0, why: '清单 02：闭连续、开可导、端点等值。「导数有界」不在入场券之列——$x^2\\sin\\frac1x$ 的导数无界照样可导。' },
    { q: '正定证明的默认顺序（清单 19）第一步是？', opts: ['定义法：对一切 $x\\ne 0$ 把 $x\'Ax$ 展开配方', '先算全部特征值', '先扫顺序主子式', '先写 $LDL\'$ 分解', '合同变换化标准形', '与 $I$ 比 Rayleigh 商'], a: 0, why: '清单 19：定义 → 特征值 → 顺序主子式 → $LDL\'$。低阶定义法配方向来最短；维数高才轮到主子式逐阶扫。' },
    { q: '结论含 $\\xi f\'(\\xi)g(\\xi)-f(\\xi)g\'(\\xi)=0$（清单 04），第一反应？', opts: ['作商：$F=\\dfrac{f}{g}$，分子正是 $(f/g)\'$ 的 $-\\xi$ 倍', '乘积分因子 $e^{\\xi}$', '泰勒展开到二阶', '对 $fg$ 分部', '反设唯一零点', '取对数'], a: 0, why: '清单 04：含 $f\'g-fg\'$ 就作商——商法则的分子自带这个组合，分母平方不改变零点。' },
    { q: '结论同时出现 $\\xi,\\eta$ 两个中值点，清单 05 的第一步是？', opts: ['先问两点地位是否相同，再选「劈区间」或「两定理分工」', '直接对 $\\xi+\\eta$ 用柯西', '令 $\\xi=\\eta$ 化简', '先用介值定理锚定 $\\xi$', '两遍拉格朗日不分工', '放弃一个点'], a: 0, why: '清单 05：双中值先分账——地位不同（一个带 $f\'$ 一个带 $g\'$）劈区间各打一发；同构对称则两定理联立。' },
    { q: '题设给到 $f\'\'$ 的信息、结论含两端点值，清单 06 的打法？', opts: ['在信息交汇点（常是中点）泰勒展开，端点代入后两式相加减', '直接在端点用拉格朗日', '用积分中值定理', '对 $f\'\'$ 用介值', '反证设最大值在内点', '逐项求导'], a: 0, why: '清单 06 / 母题③：$f\'\'$ 是泰勒的信号灯——中点展开、两端代入，相加消奇部、相减消偶部。' },
    { q: '证「存在且唯一 $\\xi$ 使 $f\'(\\xi)=k$」，最容易丢分的是哪半句（清单 09）？', opts: ['唯一性——补单调（对 $f\'-k$ 或差函数严格单调论证）', '存在性——再验一遍介值', '两者都不扣分', '只要中值定理名对就满分', '把唯一写成至多', '用反证法包打'], a: 0, why: '清单 09：「存在」靠零点/介值，「恰一」必须另证单调——只证存在写「易证唯一」，阅卷按半题计。' },
    { q: '反证「$f$ 在 $D$ 上不一致连续」的标准流水线（清单 10）是？', opts: ['写出否定式取 $\\varepsilon_0$ → 造点对列 $|x_n-y_n|\\to 0$ → 致密性抽子列逼出矛盾', '直接找两个固定点', '用极限不存在', '对 $f\'$ 用 Darboux', '构造单调列', '改用 M 判别法'], a: 0, why: '清单 10：一致连续的否定是「存在 $\\varepsilon_0$，一切 $\\delta$ 都有反例点对」——造列 + 致密性是标准出口（例 13.2）。' },
    { q: '积分不等式两条路线（清单 13）谁更精确？', opts: ['先积分后放缩——把整体结构积出来再估', '先放缩后被积函数变碎', '两条永远等价', '取决于放缩方向', '被积函数含 $e^x$ 时反向', '都只能给出严格号'], a: 0, why: '清单 13：先放缩会把「正负相消」的机会提前掐死——讲义原话：先积分几乎总比先放缩精确。' },
    { q: '格林公式遇到的曲线不封闭（清单 14），怎么补？', opts: ['补线使封闭，补的线段优先取坐标轴或平行轴——参数化最省力', '改成第二类曲线积分', '放弃格林用参数化硬算', '先证路径无关', '加一个无穷远点', '拆成两段开弧'], a: 0, why: '清单 14：补线是标准动作——沿轴补线段上 $x$ 或 $y$ 恒定，被积函数当场退化一半。' },
    { q: '线代证明题无从下笔时，清单 18 的第一动作是？', opts: ['把矩阵关系翻译成三种语言之一：解空间 / 特征值 / 二次型', '直接暴力算行列式', '先对角化再说', '用秩的定义逐条验', '举数值例子找感觉', '引入 Jordan 形'], a: 0, why: '清单 18：$AB=O$ 读作「$B$ 的列落在 $Ax=0$ 里」——翻译即半证。母题⑦⑬全部从这一步出发。' },
    { q: '概率证明要找「天然非负量」展开（清单 20），讲义点名的三件套是？', opts: ['方差、平方项、指示函数', '协方差、矩母函数、特征函数', '期望、中位数、众数', '密度函数、分布函数、分位数', '$\\varepsilon-\\delta$、上确界、下极限', '大数定律、中心极限、Borel-Cantelli'], a: 0, why: '清单 20 / 母题⑧：$D X=E(X-EX)^2\\ge0$、$\\mathbf{1}_A$ 的期望即 $P(A)$——非负量展开是所有概率不等式的发动机。' },
    /* —— v2.9 新章触发 —— */
    { q: '要证朗斯基恒等式 $W\'=-pW$，对 $W$ 求导后的关键代换是？', opts: ['用方程把 $y_i\'\'$ 换成 $-py_i\'-qy_i$，$q$ 项自动相消', '对 $W$ 分部积分', '用介值定理', '泰勒展开两个解', '取对数求导', '反设 $W\\ne 0$'], a: 0, why: '例 10.1 的机关：$W\'=y_1y_2\'\'-y_1\'\'y_2$，代入后含 $q$ 的两项一正一负恰好抵消——剩 $-pW$ 一阶线性积分即得。' },
    { q: '线性方程两个同初值解必恒等，证明第一步？', opts: ['令 $Y=y_1-y_2$：叠加原理知 $Y$ 是解且零初值', '反证设两曲线相交', '直接算 Wronski 行列式', '积分因子乘全方程', '对差用中值定理', '归一化取比值'], a: 0, why: '例 10.2 三板斧顺序：叠加造新解 → 零初值 → 唯一性定理判 $Y\\equiv 0$——先造后判。' },
    { q: '隐函数存在定理中「$F_y\\ne 0$」的真正作用是？', opts: ['偏导定号传播到小矩形，截面严格单调——存在与唯一一起到手', '保证 $F$ 连续', '保证 $F=0$ 有解', '保证可积', '保证 $y(x)$ 有界', '保证 $F$ 可微'], a: 0, why: '清单 17：抓「对目标变量的偏导非零」——它同时买通介值（存在）与单调（唯一），缺一边定理就塌。' },
    { q: 'Lagrange 乘数法必要条件证明的骨架是？', opts: ['约束曲线降维成一元极值，再上费马定理', '直接令两个偏导为零', '反证梯度不等', '对约束泰勒展开', '解出 $f$ 代回', '构造辅助函数'], a: 0, why: '例 17.3：隐函数定理供光滑曲线 → 限制 $f$ 到曲线 → 费马给 $df/dt=0$ → 行列式为零 = 共线——「降维再用一元武器」。' },
    { q: '递推式同时含 $a_{n+1},a_n,a_{n-1}$（斐波那契型），归纳法该用？', opts: ['第二归纳法：起点 $P(1),P(2)$ 双验', '第一归纳法单起点', '反向归纳', '跳过起点', '夹逼代替归纳', '只用强假设'], a: 0, why: '22.1 信号词表：依赖前两值的命题归纳假设要携带 $P(1)\\dots P(k)$ 全体，双起点缺一不可——讲义点名的死因之一。' },
    { q: '分式线性递推 $a_{n+1}=\\dfrac{2a_n+1}{a_n+2}$ 的标准开局？', opts: ['解不动点 $L=\\dfrac{2L+1}{L+2}$，平移 $b_n=a_n-L$ 化等比', '直接猜通项验证', '取对数线性化', '硬证单调有界', '夹逼放缩', '先求上极限'], a: 0, why: '构造法精神（22.2）：变换到「已经会做」的形状——平移后递推变常数比，母题④的构造臂。' },
    { q: '周期积分平移不变性的证明里，末段 $\\int_T^{a+T}f$ 怎么处理？', opts: ['换元 $u=x-T$ 用周期性化回 $\\int_0^a$，与首段相消', '分部积分', '用中值定理', '拆成级数和', '直接算原函数', '放缩成 $T\\max|f|$'], a: 0, why: '定理 28.3 全部机关 = 一次拆段 + 一次换元——与区间再现同族「自己加自己」（母题⑥皮肤）。' },
    { q: '$M=\\max(X_1,\\dots,X_n)$（独立同分布）求分布，第一动作？', opts: ['事件翻译：$\\{M\\le z\\}=\\bigcap\\{X_i\\le z\\}$', '直接卷积密度', '对 $z$ 求导', '用切比雪夫界', '先算 $E[M]$', '全概率展开'], a: 0, why: '例 30.2：分布函数法先做事件翻译——交事件 + 独立性 = 概率乘积 $F(z)^n$，密度随后求导即得。' },
    /* —— v3.0 综合演练/自测卷触发 —— */
    { q: '结论是「存在点列 $\\xi_n\\to\\infty$ 使 $f\'(\\xi_n)\\to0$」，生成点列的套路？', opts: ['每个 $[n,n+1]$ 上拉格朗日，中值点列自动打印', '反证取子列', '用介值定理逐点选', '泰勒展开比较', '构造辅助函数罗尔', '致密性直接抽'], a: 0, why: '大题一(1) 入口套路：数列极限结论 = 小区间中值定理的副产品，$f\'(\\xi_n)=f(n+1)-f(n)$ 右端相减趋零。' },
    { q: '「$f\'$ 有界 ⇒ 一致连续」与「尾部极限 + 头部紧性」两条路怎么选？', opts: ['有导数界就走 Lipschitz（$\\delta=\\varepsilon/M$），没导数信息用拼接', '永远选拼接', '永远选 Lipschitz', '两条等价随便挑', '都需先证可微', '改用 Cauchy 列'], a: 0, why: '大题一(2) 注记原话：两法都要会，按题设条件选路——导数有界时 Lipschitz 一条线三步走完，更直接。' },
    { q: '证「有且仅有一根」，阅卷给分结构是？', opts: ['存在性（零点定理）+ 唯一性（单调），两条腿各占一半', '只要写出 $f(a)f(b)<0$', '只要证单调', '画出函数图', '给出近似根即可', '用介值定理包打'], a: 0, why: 'A1 评分点原话：只写其一最多拿一半分——「恰一」= 清单 09 的双柱结构。' },
    { q: '递推数列归纳定界，上界必须从哪里来？', opts: ['定值方程 $\\varphi=1+\\frac1\\varphi$ 解出来，归纳时真正用上它', '看前几项猜一个', '取 $2\\max x_1$', '用 $n$ 表示', '不需要上界', '由单调性反推'], a: 0, why: 'A2 评分点：凭空写 $x_n<\\varphi$ 拿不到满分——上界的归纳步必须消耗定值方程本身。' },
    { q: '$D\\bar X=\\sigma^2/n$ 的交叉项归零靠什么？', opts: ['独立性：$\\mathrm{Cov}(X_i,X_j)=0$（$i\\ne j$）', '同分布', '正态假设', '大数定律', '切比雪夫不等式', '期望线性性即可'], a: 0, why: '例 33.3：同分布只给每项 $\\sigma^2$，交叉项退场专属独立性——完全相关时 $D\\bar X=\\sigma^2$ 与 $n$ 无关。' },
    { q: '莱布尼茨判别法的两根柱子是？', opts: ['模单调不增 + 通项趋零', '仅通项趋零', '仅模有界', '绝对收敛', '部分和有界', '通项最终同号'], a: 0, why: '例 9.2 双柱结构：缺一可造发散振荡、缺二通项不过关——交错级数的入门签证。' },
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
    {
      id: 'rp7', title: '例 11.1：秩加法不等式',
      steps: [
        '观察列结构：$A+B$ 的每一列 = $A$ 的对应列 + $B$ 的对应列',
        '故 $A+B$ 的列向量组可由 $\\{A \\text{ 的列}\\}\\cup\\{B \\text{ 的列}\\}$ 线性表出',
        '表出组的大小：取 $A,B$ 各自的极大无关组拼在一起，至多 $r(A)+r(B)$ 个向量',
        '引用定理「能被 $m$ 个向量表出的向量组，秩不超过 $m$」（声明依据——军规精神）',
        '回扣：$r(A+B)\\le r(A)+r(B)$ ∎',
      ],
    },
    {
      id: 'rp8', title: '例 12.2：实对称特征向量正交',
      steps: [
        '设 $A\\alpha=\\lambda_1\\alpha$，$A\\beta=\\lambda_2\\beta$，$\\lambda_1\\ne\\lambda_2$',
        '算同一个内积的左路：$(A\\alpha)\\cdot\\beta=\\lambda_1(\\alpha\\cdot\\beta)$',
        '用 $A\'=A$ 换到右路：$(A\\alpha)\\cdot\\beta=\\alpha\\cdot(A\\beta)=\\lambda_2(\\alpha\\cdot\\beta)$——对称性是穿梭许可证',
        '两路相减：$(\\lambda_1-\\lambda_2)(\\alpha\\cdot\\beta)=0$',
        '$\\lambda_1\\ne\\lambda_2$ 故 $\\alpha\\cdot\\beta=0$，即正交 ∎（除法先证因子非零——军规二）',
      ],
    },
    {
      id: 'rp9', title: '例 8.2：区间再现',
      steps: [
        '记 $I=\\int_0^{\\pi} x f(\\sin x)\\,dx$',
        '换元 $x=\\pi-t$（区间关于 $\\pi/2$ 再现）：$I=\\int_0^{\\pi}(\\pi-t)f(\\sin(\\pi-t))\\,dt$',
        '关键不变量：$\\sin(\\pi-t)=\\sin t$——「零件」在换元下原样保留',
        '展开：$I=\\pi\\int_0^{\\pi} f(\\sin t)\\,dt-I$，即 $2I=\\pi\\int_0^{\\pi} f(\\sin x)\\,dx$',
        '回扣：$I=\\frac{\\pi}{2}\\int_0^{\\pi} f(\\sin x)\\,dx$ ∎（自己加自己，x 消形）',
      ],
    },
    {
      id: 'rp10', title: '例 14.1：不动点存在 + 唯一双门',
      steps: [
        '作差构造 $F(x)=f(x)-x$',
        '声明性质：$f$ 连续、$x$ 连续，故 $F$ 在 $[a,b]$ 连续（军规一——零点定理的入场券）',
        '端点定号：值域含入给 $F(a)=f(a)-a\\ge 0$，$F(b)=f(b)-b\\le 0$；若严格异号用零点定理，恰为零即得',
        '存在性收口：$F(\\xi)=0$ 即 $f(\\xi)=\\xi$',
        '唯一性另开门：反设 $\\xi\\ne\\eta$ 均为不动点，$|\\xi-\\eta|=|f(\\xi)-f(\\eta)|\\le k|\\xi-\\eta|$，$(1-k)|\\xi-\\eta|\\le 0$ 逼出重合 ∎',
      ],
    },
    {
      id: 'rp11', title: '例 19.1：正定 ⇒ 顺序主子式全正',
      steps: [
        '截段构造：取 $x=(x_1,\\dots,x_k,0,\\dots,0)\'$，把 $n$ 元问题降到 $k$ 阶主子式 $A_k$——正定性对截段自动遗传',
        '声明性质：$A$ 实对称正定，对一切 $x\\ne 0$ 有 $x\'Ax>0$（军规一：先把「对谁成立」说全）',
        '限制验证：截段记 $y=(x_1,\\dots,x_k)\'\\ne 0$，代入得 $x\'Ax=y\'A_ky>0$——每个 $A_k$ 继承正定',
        '谱桥梁：正定矩阵特征值全正，$|A_k|=\\lambda_1\\cdots\\lambda_k>0$（第 12 章成果现用）',
        '回扣结论：对 $k=1,\\dots,n$ 逐阶得 $|A_k|>0$ ∎——「子式族」靠截段白拿，不是独立举证',
      ],
    },
    {
      id: 'rp12', title: '例 20.1：伴随矩阵秩三段论',
      steps: [
        '地基恒等式：$AA^*=|A|E$——后面三段全部从这里出发（先写它，阅卷按地基给分）',
        '$r(A)=n$ 段：$A$ 可逆，$A^*=|A|A^{-1}$ 也可逆，$r(A^*)=n$',
        '$r(A)=n-1$ 段：$|A|=0$ 使 $AA^*=O$——$A^*$ 的列全落在 $Ax=0$ 的解空间里，$r(A^*)\\le 1$',
        '下界补刀：某代数余子式 $A_{ij}\\ne 0$（秩 $n-1$ 的定义）给出 $r(A^*)\\ge 1$，夹逼得 $r(A^*)=1$',
        '$r(A)\\le n-2$ 段：一切 $n-1$ 阶子式为 $0$，$A^*=O$，$r(A^*)=0$ ∎',
        '回扣三段表：$r(A^*)=n,1,0$ 分别对应 $r(A)=n,n-1,\\le n-2$——一个恒等式吃三道题',
      ],
    },
    {
      id: 'rp13', title: '例 26.1：凸性 ⇔ 切线在曲线下方',
      steps: [
        '差函数构造：$g(t)=f(t)-f(x)-f\'(x)(t-x)$，要证的就是 $g(t)\\ge 0$ 且 $g(x)=0$',
        '声明性质：$f$ 二阶可导且 $f\'\'\\ge 0$，故 $f\'$ 单调不减（军规一：单调性的入场券先验齐）',
        '求导定号：$g\'(t)=f\'(t)-f\'(x)$——$t>x$ 时 $\\ge 0$，$t<x$ 时 $\\le 0$',
        '极值收口：$g$ 在 $t=x$ 处取全局最小，$g(x)=0$ 即最小值',
        '回扣结论：$f(t)\\ge f(x)+f\'(x)(t-x)$ ∎——「切线是全局下界」，Jensen 的第一块骨牌',
      ],
    },
    {
      id: 'rp14', title: '例 28.1：第二积分中值（Bonnet 形）',
      steps: [
        '规范化：$f$ 单调减且 $0\\le f\\le 1$（除以 $f(a)$、平移不改变结论形状——先把旋钮归零）',
        '变限造桥：$F(x)=\\int_a^x g\\,dt$ 连续，$F(a)=0$、$F(b)=\\int_a^b g$',
        '分部改写：$\\int_a^b fg=f(b)F(b)-\\int_a^b F\\,df$——$df$ 非负（$f$ 递减取号要交代）',
        '夹逼估值：$0\\le F\\le F(b)$ 且 $\\int df=f(a)-f(b)$，得 $\\int F\\,df\\le F(b)(f(a)-f(b))$',
        '介值取 $\\xi$：$\\theta=\\dfrac{\\int F\\,df}{F(b)(f(a)-f(b))}\\in[0,1]$，回扣即 $\\int fg=f(\\xi)\\int_a^b g$ 型 ∎（中值点存在性必须交代——军规三）',
      ],
    },
    {
      id: 'rp15', title: '第 34 章：Stolz 定理（离散洛必达）',
      steps: [
        '声明前提：$b_n$ 严格增且 $\\to+\\infty$，差商 $\\dfrac{a_n-a_{n-1}}{b_n-b_{n-1}}\\to L$（军规一：两条入场券逐条写）',
        '极限翻译：给定 $\\varepsilon$，存在 $N$ 使 $n>N$ 时差商落在 $[L-\\varepsilon,L+\\varepsilon]$',
        '望远镜拆分：$a_n=a_N+\\sum_{k>N}(a_k-a_{k-1})$，分母同款拆 $b_n$',
        '尾段控制：差商夹逼给 $(L-\\varepsilon)(b_n-b_N)\\le a_n-a_N\\le(L+\\varepsilon)(b_n-b_N)$',
        '头段湮灭：$\\dfrac{a_N-Lb_N}{b_n}\\to 0$——固定的分子除以无穷的分母，头段自动清零',
        '夹逼回扣：$\\limsup/\\liminf$ 都被 $L\\pm\\varepsilon$ 夹住，$\\varepsilon$ 任意 ⇒ $a_n/b_n\\to L$ ∎',
      ],
    },
    {
      id: 'rp16', title: '定理 17.2：隐函数存在三板斧',
      steps: [
        '定号传播：$F_y(x_0,y_0)>0$ 且偏导连续，存在矩形使 $F_y>0$ 处处成立（军规一：先交代偏导连续这张票）',
        '一元截面：固定 $x$，$y\\mapsto F(x,y)$ 严格增——至多一个零点（唯一性先于存在性落袋）',
        '介值给存在：$F(x_0,y_0)=0$ 夹在 $F(x_0,y_1)<0<F(x_0,y_2)$ 之间，一元介值定理取零点 $y(x)$',
        '连续性论证：取 $x_n\\to x$，$\\{y(x_n)\\}$ 有界→任一收敛子列极限都是 $F(x,\\cdot)=0$ 的根→由唯一性整列收敛',
        '可导收尾：对 $F(x,y(x))\\equiv 0$ 用一元链式（差商版）：$y\'=-F_x/F_y$，分母非零已验（军规二）∎',
      ],
    },
    {
      id: 'rp17', title: '例 28.3：Wallis 递推夹逼',
      steps: [
        '分部递推：$I_n=\\int\\sin^n=\\left[-\\sin^{n-1}x\\cos x\\right]+(n-1)\\int\\sin^{n-2}\\cos^2$，边界项归零（端点处 $\\sin$ 或 $\\cos$ 为 $0$——军规一先交代）',
        '用 $\\cos^2=1-\\sin^2$ 回代整理：$I_n=\\dfrac{n-1}{n}I_{n-2}$，双路（奇/偶）各展开到 $I_0=\\frac\\pi2$ 或 $I_1=1$',
        '单调性：$\\sin x<1$ 于内部 ⇒ $I_{n+1}<I_n$——夹逼的左端',
        '相邻乘积：递推 telescoping 得 $I_n\\cdot I_{n+1}=\\dfrac{\\pi}{2(n+1)}$——两个相邻积分的积有干净表达',
        '夹逼收口：$\\frac{I_{n+1}}{I_n}\\le1\\le\\frac{I_n}{I_{n+1}}$ 两端同乘 $I_nI_{n+1}$，squeeze 出 $\\lim I_{2n}/I_{2n+1}=1$ ∎（Wallis 乘积公式到手）',
      ],
    },
    {
      id: 'rp18', title: '例 11.5：幂等矩阵秩和',
      steps: [
        '翻译条件（清单 18）：$A^2=A$ 读作「投影」——$A$ 在自身值域上是恒等',
        '拆恒等式：任取 $x$，$x=\\underbrace{\\tfrac{x+Ax}{2}}_{u}+\\underbrace{\\tfrac{x-Ax}{2}}_{v}$；验 $Au=u$（用 $A^2=A$）故 $u\\in\\mathrm{Im}\\,A$',
        '另一半：$Av=\\tfrac{Ax-A^2x}{2}=0$ 故 $v\\in\\mathrm{Ker}\\,A$——分解存在',
        '直和验证：$w\\in\\mathrm{Im}\\,A\\cap\\mathrm{Ker}\\,A$ ⇒ $w=Ax$ 且 $Aw=0$ ⇒ $w=Aw=0$——交为零',
        '维数收口：$n=\\dim\\mathrm{Im}\\,A+\\dim\\mathrm{Ker}\\,A=r(A)+(n-r(A))$；再用 $\\mathrm{Ker}\\,A=\\mathrm{Im}(A-E)$（两边互推）代换得 $r(A)+r(A-E)=n$ ∎',
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
    {
      id: 'au7', title: 'Darboux 不声明就介值',
      lines: [
        { x: '设 $f$ 在 $[0,1]$ 可导，且 $f\'(0)<0<f\'(1)$。', bad: null },
        { x: '$f\'$ 在端点异号，由介值定理存在 $\\xi\\in(0,1)$ 使 $f\'(\\xi)=0$。', bad: 'premise', note: '导函数未必连续——对 $f\'$ 用介值定理是「拿别人的票」！必须先引 Darboux 定理：导函数无第一类间断、自带介值性（军规一 / 清单 12，母题⑫的招牌动作）。这一声明就是 3 分。' },
        { x: '于是 $f\'$ 取遍 $f\'(0)$ 与 $f\'(1)$ 之间的一切值。', bad: null },
        { x: '证毕。', bad: 'callback', note: '题目要的是 $f\'(\\xi)=0$：介值陈述只报了值域，末句「特别地 $0$ 在两者之间」才是回扣——缺这句，结构分白丢。' },
      ],
    },
    {
      id: 'au8', title: '换序不打票的悲剧',
      lines: [
        { x: '在 $[0,1]$ 上 $f_n(x)=x^{n}$ 逐点收敛于 $f$：$[0,1)$ 上 $f\\equiv 0$、$f(1)=1$。', bad: null },
        { x: '故 $\\lim\\int_0^1 f_n=\\int_0^1\\lim f_n=0$。', bad: 'swap', note: '极限与积分换序没验票：$f_n$ 不一致收敛（各项连续而极限函数不连续）。事实 $\\int x^n=\\frac{1}{n+1}\\to 0$——答案碰对了，路线仍是错的：阅卷批的是推理链，不是结果（母题⑩：一致收敛才是门票）。' },
        { x: '同理可对 $\\sum x^{n}$ 逐项求导。', bad: 'premise', note: '逐项求导要「导函数项级数一致收敛 + 原级数至少一点收敛」双入场券——两条都没验就下笔，第 15 章的雷区原地爆炸。' },
      ],
    },
    {
      id: 'au9', title: '非负放大器拆反了',
      lines: [
        { x: '欲证 $D X\\ge 0$ 且 $E X^{2}\\ge(EX)^{2}$。', bad: null },
        { x: '展开 $D X=E(X-EX)^{2}=E X^{2}+(EX)^{2}$。', bad: 'logic', note: '拆平方符号事故：$E(X-EX)^2=EX^2-2(EX)^2+(EX)^2=EX^2-(EX)^2$——中间负项被吃掉，放大器当场短路。展开类错误按步扣分，无同情分。' },
        { x: '由平方式非负即得两不等式。', bad: 'premise', note: '发动机点火前要声明 $E X^2$ 存在：二阶矩不存在时方差无定义（清单 20 / 母题⑧的标准开场白是「设二阶矩存在」）。' },
        { x: '等号当且仅当 $X$ 几乎处处为常数。', bad: 'logic', note: '等号条件是「给结论不给证明」的重灾区：需走「非负可积函数积分为零 ⇒ 几乎处处为零」这步引理——证明题里「当且仅当」四个字自带 1 分证明义务。' },
      ],
    },
    {
      id: 'au10', title: '无穷区间拼接断档',
      lines: [
        { x: '设 $f$ 在 $(0,+\\infty)$ 连续且 $\\lim_{x\\to+\\infty}f(x)$ 存在，证 $f$ 一致连续。', bad: null },
        { x: '$f$ 在 $[0,N]$ 上连续，由 Heine-Cantor 一致连续。', bad: 'premise', note: '$N$ 还没出场就宣布「在 [0,N] 上」——正解第一步是用尾部极限定 $N$：给定 $\\varepsilon$，取 $N$ 使 $x,y>N$ 时 $|f(x)-f(y)|<\\varepsilon/3$，然后才轮到闭区间武器（母题⑨的三段结构，声明必须前置）。' },
        { x: '头尾两段各自一致连续，故全区间一致连续。', bad: 'logic', note: '拼接缺「中转」：两段各有各的 $\\delta$，必须取 $\\delta=\\min(\\delta_1,\\delta_2)$ 并单独讨论跨段点对（$x\\le N<y$）——跳过 ε/3 接力，证明链断在阅卷人眼前。' },
        { x: '证毕。', bad: null },
      ],
    },
    {
      id: 'au11', title: '偏导存在硬上全微分',
      lines: [
        { x: '设 $f(x,y)=\\dfrac{xy}{\\sqrt{x^{2}+y^{2}}}$（原点取 $0$），已验证 $f$ 处处连续、原点两偏导均为 $0$。', bad: null },
        { x: '于是 $df\\big|_{(0,0)}=0\\,dx+0\\,dy$，可微。', bad: 'premise', note: '偏导存在只是「十字方向」的可微——可微要求增量 $o(\\rho)$ 沿一切路径一致成立。沿 $y=x$：$\\frac{f(h,h)-0-0}{\\sqrt2|h|}=\\frac{1}{2\\sqrt2}$ 不趋零，不可微。清单 16 的第一条箭头不可逆，正是这条雷。' },
        { x: '故全增量 $\\Delta f=f_x\\Delta x+f_y\\Delta y+o(\\rho)$。', bad: 'logic', note: '在错误的「可微」上继续写全微分公式——一步塌、步步塌：阅卷按链扣分，后文全在废墟上。' },
      ],
    },
    {
      id: 'au12', title: '归纳起点平移事故',
      lines: [
        { x: '设 $a_1=1$，$a_{n+1}=a_n^{2}-2$ 型的倒数变式（此处命题：$a_n\\ge 2$）。', bad: null },
        { x: '$n=1$ 时 $a_1=1\\ge 2$ 显然成立。', bad: 'logic', note: '起点就是假的（$1\\ge2$？）。讲义点名归纳法头号死因：命题从 $n\\ge2$ 才成立，起点必须单独验 $n=2$——「显然」救不了不显然。' },
        { x: '设 $n=k$ 成立，则 $a_{k+1}=\\cdots\\ge 2$，故对一切 $n$ 成立。', bad: 'premise', note: '假设写「$n=k$」而递推用到 $a_{k-1}\\ge2$：第一归纳法弹药不足，应换第二归纳法（假设携带 $P(2)\\dots P(k)$ 全体）——假设强度也是入场券。' },
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
        ['含参数 $x$，两边可移项作差', '单调性法', '令 $g$ 等于左边减右边，验 $g(\\text{基点})=0$，判 $g\'$ 号'],
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
    { k: 'p-editor', when: function (prob, pool, path) { return path.length >= 1 && pool[prob.goal] }, act: '路已通——去「编辑器」把这条链写成逐行带引用的证明：内核会替你查每一行的出处，考场丢分点当场现形。' },
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
    {
      id: 'ce5', law: '「$f$ 可导 ⇒ 导函数 $f\'$ 必有介值性（Darboux）」',
      pool: [
        { t: '$\\operatorname{sgn}(x)$：有跳跃、不满足介值', ok: false, why: 'sgn 压根不是任何可导函数的导函数——它非但不推翻命题，反而是定理的推论：正因为导函数必带介值性，才判 sgn「导函数资格死刑」。' },
        { t: '$x^2\\sin\\dfrac1x$ 的导函数在 $0$ 处间断', ok: false, why: '它间断得「振荡」（第二类），介值性完好无损——Darboux 只禁第一类间断。用第二类的伤口去证第一类的清白，方向反了。' },
        { t: '命题是真定理：反例不存在（标准证明：构造辅助函数 $\\varphi(x)=f(x)-\\lambda x$ 在区间内取最值，用 Fermat 收口）', ok: true, why: '识别「不可反例的命题」与给出反例是同级的反例素养——这题在考你能不能看穿定理和猜想的边界。' },
        { t: '$|x|$ 不可导', ok: false, why: '前提直接不满足——它连「导函数」都交不出，谈不上违背后的结论。' },
      ],
    },
    {
      id: 'ce6', law: '「$\\sum a_n$ 收敛且 $a_n\\ge 0$ ⇒ $\\sum a_n^{2}$ 收敛」',
      pool: [
        { t: '$a_n=\\dfrac1n$', ok: false, why: '调和级数自己就不收敛——前提都没过审。这是「把著名的错例当万能反例」的头号陷阱。' },
        { t: '$a_n=\\dfrac{(-1)^n}{\\sqrt n}$', ok: false, why: '条件收敛版：前提要求 $a_n\\ge 0$，你擅自把命题换成了另一条（非负去掉后确实可反例，但那是另一道题）。' },
        { t: '命题为真：$a_n\\to 0$ 后必有 $a_n\\le 1$，于是 $a_n^2\\le a_n$，比较判别法一行收口', ok: true, why: '非负 + 收敛 ⇒ 通项 eventually 进 $[0,1]$，平方只会更小——这是「五秒击穿失败」的快拳型真命题：考场上认出它就该直接写答案。' },
        { t: '比较判别法要求正项，本题不能用它', ok: false, why: '前提已经保证 $a_n\\ge 0$——比较判别法正是本题的正规武器，「不能用」是自我缴械。' },
      ],
    },
    {
      id: 'ce7', law: '「$A$ 正定 ⇒ $A$ 的一切元素都为正」',
      pool: [
        { t: '$A=\\begin{pmatrix}2&-1\\\\-1&2\\end{pmatrix}$：顺序主子式 $2,3$ 全正故正定，非对角元却是负的', ok: true, why: '正定管的是二次型 $x\'Ax$，不是逐元素表——非对角元素当然可以负。命题把「主子式」偷换成「一切元素」，打穿它=识破范围偷换。' },
        { t: '$A=I$', ok: false, why: '处处为正的正定阵——它支持命题，不是反例（支持项混进反例池是常见缴械动作）。' },
        { t: '含负元素的矩阵必有负特征值', ok: false, why: '上面那个反例特征值 $1,3$ 全正——元素符号与特征值符号根本没有这条直连通道。' },
        { t: '「正定 ⇒ 对角元为正」是假的', ok: false, why: '取 $x=e_i$ 立得 $a_{ii}>0$——那条命题是真的，而且不是本题在审的命题。' },
      ],
    },
    {
      id: 'ce8', law: '「$\\dfrac{a_n}{b_n}\\to L$ ⇒ 差商 $\\dfrac{a_n-a_{n-1}}{b_n-b_{n-1}}\\to L$（Stolz 的逆）」',
      pool: [
        { t: '$a_n=(-1)^n,\\ b_n=n$：比值 $\\to 0$，差商 $=\\pm 2$ 振荡无极限', ok: true, why: 'Stolz 只单向放行「差商→比值」；振荡可以藏在差分里而不藏进比值。构造「定理逆命题」的反例，是反例素养的期末考。' },
        { t: '$a_n=b_n=n$', ok: false, why: '两边同为 $1$——它支持命题方向，不构成反例。' },
        { t: '逆命题也真：对 $\\dfrac{a_n}{b_n}$ 两边取极限即可', ok: false, why: '「两边取极限」正是循环论证：差商极限存在是待证结论，不能预先当工具用（军规一的逻辑版）。' },
        { t: 'Stolz 是充要条件，所以不存在反例', ok: false, why: '定理陈述里 $b_n\\uparrow+\\infty$ 只服务正向；把它读成「⟺」是记忆事故——上面 $(-1)^n$ 就是证伪样本。' },
      ],
    },
    {
      id: 'ce9', law: '「$A^2=A$（幂等）⇒ $A$ 必对称」',
      pool: [
        { t: '$A=\\begin{pmatrix}1&1\\\\0&0\\end{pmatrix}$：$A^2=A$ 却 $A\'\\ne A$', ok: true, why: '幂等只管「投影沿哪个方向」——斜投影照样满足 $A^2=A$。$A\'=A$ 额外要求投影方向垂直于值域，那是正交投影的专利：两个条件各管一件事，别让它们互相冒充。' },
        { t: '$A=I$', ok: false, why: '对称的幂等阵——支持命题方向，不是反例。' },
        { t: '$A^2=A$ 的特征值只能是 $0$ 或 $1$，所以必对称', ok: false, why: '前半句真、后半句偷换：特征值谱只约束对角化，不约束 $A\'=A$——斜投影的谱同样是 $\\{0,1\\}$。' },
        { t: '幂等阵必不可逆', ok: false, why: '$I$ 可逆且幂等——自身就是这条的反例；且它也不是命题在说的事。' },
      ],
    },
    {
      id: 'ce10', law: '「$f$ 连续且两偏导都存在 ⇒ $f$ 可微」',
      pool: [
        { t: '$f=\\dfrac{xy}{\\sqrt{x^{2}+y^{2}}}$（原点补 $0$）：连续、偏导全存在，原点沿 $y=x$ 增量比不趋零', ok: true, why: '偏导是十字方向的信息，可微要全平面一致——沿 $y=x$ 的增量比恒为 $\\frac{1}{2\\sqrt2}$，$o(\\rho)$ 当场破产。清单 16「偏导连续」四个字少一个都不行。' },
        { t: '$f(x,y)=|xy|$：处处连续、偏导存在', ok: false, why: '这个函数其实可微（$|xy|\\le\\frac{\\rho^{2}}{2}=o(\\rho)$）——拿可微的函数当反例，是「没验结论就举旗」的常见缴械。' },
        { t: '偏导存在已经蕴含连续，前提冗余', ok: false, why: '两个偏导存在连连续都推不出（$\\frac{xy}{x^{2}+y^{2}}$ 型）——这条是把「可微⇒连续」倒放，逻辑方向事故。' },
        { t: '不存在反例：偏导+连续就是可微的定义强度', ok: false, why: '定义是「增量=线性主部+小 $o(\\rho)$」——偏导存在只给了主部的两个系数，余项对路径的一致性根本没进账单。' },
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


  /* ════════════════════ 1.14 证明内核（v2.3 旗舰：从概念清单到系统）══════════════════
   * Lean/Coq 不是玩具的原因：有一个逐行核查的验证器内核。这里实现同款纪律的轻量版：
   * 证明 = Fitch 风格行序列，每行必须显式声明「引用哪些行、动用哪张桥」。
   * verifySteps 三查：①引用的行必须存在（幻觉引用）②桥的前提必须全被引用
   * （「用定理没证前提」——考场第一大丢分，现在是机器可判硬错误）③多引无害但提示。
   * 全部概念向内核接线：债务=内核 gap、骨架/美学=内核证明的度量、启发式=导流到内核。 */
  function allBridges(lemmas) {
    return METHODS.concat((lemmas || []).map(function (L) {
      return { k: 'lm:' + L.id, name: L.name, req: L.req.slice(), out: [L.out], lemma: true, tip: '自长引理（你证过的结论，现在是可以直接引用的武器）' }
    }))
  }
  function verifySteps(prob, steps, bridges) {
    let avail = {}
    prob.conds.forEach(function (c) { avail[c.t] = 1 })
    let errors = [], warns = [], lines = [], usedConds = {}
    for (let i = 0; i < steps.length; i++) {
      let st = steps[i]
      let m = null
      bridges.forEach(function (b) { if (b.k === st.cite) m = b })
      if (!m) { errors.push({ line: i + 1, msg: '引用了不存在的桥卡' }); break }
      let ghost = st.from.filter(function (t) { return !avail[t] })
      if (ghost.length) { errors.push({ line: i + 1, msg: '引用了不存在的行：' + ghost.join('、') + '（幻觉引用——证明里不能有无中生有的行）' }); break }
      let lack = m.req.filter(function (r) { return r !== 'anyGoal' && st.from.indexOf(r) < 0 })
      if (lack.length) { errors.push({ line: i + 1, msg: '「' + m.name + '」的前提 ' + lack.join('、') + ' 没引用——用定理却没证前提，阅卷人最爱的扣分点' }); break }
      let extra = st.from.filter(function (t) { return m.req.indexOf(t) < 0 && t !== 'anyGoal' })
      if (extra.length) warns.push({ line: i + 1, msg: '多引了 ' + extra.join('、') + '，本步没用到（无害，但好证明不养闲行）' })
      st.from.forEach(function (t) {
        prob.conds.forEach(function (c) { if (c.t === t) usedConds[t] = 1 })
      })
      m.out.forEach(function (o) { avail[o] = 1 })
      lines.push({ n: i + 1, cite: m.name, from: st.from.slice(), out: m.out.join('、'), lemma: !!m.lemma })
    }
    return { errors: errors, warns: warns, reached: !!avail[prob.goal], avail: avail, lines: lines, usedConds: Object.keys(usedConds) }
  }
  /** 自动定理证明器：命题集上的 BFS 饱和前向链接（真 ATP 的最小可教形态） */
  function autoProve(prob, bridges) {
    let start = {}
    prob.conds.forEach(function (c) { start[c.t] = 1 })
    let key0 = Object.keys(start).sort().join(',')
    let seen = {}
    seen[key0] = { set: start, parent: null, via: null, depth: 0 }
    let queue = [key0]
    let explored = 0, deadEnds = 0, found = null
    while (queue.length && explored < 400) {
      let key = queue.shift()
      let node = seen[key]
      explored++
      if (node.set[prob.goal]) { found = node; break }
      let expanded = false
      bridges.forEach(function (m) {
        let lack = m.req.filter(function (r) { return r !== 'anyGoal' && !node.set[r] })
        if (lack.length) return
        let ns = {}
        Object.keys(node.set).forEach(function (t) { ns[t] = 1 })
        let added = false
        m.out.forEach(function (o) { if (!ns[o]) { ns[o] = 1; added = true } })
        if (!added) return
        expanded = true
        let nk = Object.keys(ns).sort().join(',')
        if (!seen[nk]) { seen[nk] = { set: ns, parent: key, via: m.k, depth: node.depth + 1 }; queue.push(nk) }
      })
      if (!expanded) deadEnds++
    }
    let path = []
    if (found) {
      let cur = found
      while (cur && cur.via) { path.unshift(cur.via); cur = seen[cur.parent] }
    }
    return { found: !!found, path: path, explored: explored, deadEnds: deadEnds, depth: found ? found.depth : 0 }
  }
  /** 对手测试（Lakatos 内建化）：存引理时，怪兽馆自动攻击它的前提 */
  function lemmaAttack(lemma) {
    let hits = []
    MONSTERS.forEach(function (mo) {
      let b = mo.breaks.filter(function (t) { return lemma.req.indexOf(t) >= 0 })
      if (b.length) hits.push({ fn: mo.fn, tags: b, why: mo.why })
    })
    return hits
  }

  /* ════════════════════ 1.15 反向链接求解器（v2.4：真 ATP 的核心算法）══════════════════
   * 前向 BFS 是「能推什么推什么」；反向链接才是数学家的方式：从目标倒推——
   * 哪条规则的结论能统一目标？它的前提变成新子目标，递归分解直到全部落在题设里。
   * 返回 Fitch 步骤序列（from 只含该步真正需要的行——机器写的证明同样过内核）。 */
  function solveBackward(prob, bridges) {
    let given = {}
    prob.conds.forEach(function (c) { given[c.t] = 1 })
    let memo = {}
    function solve(goal, depth) {
      if (given[goal]) return []
      let key = goal + ':' + depth
      if (memo[key] !== undefined) return memo[key]
      if (depth > 5) return null
      let cands = bridges.filter(function (b) { return b.out.indexOf(goal) >= 0 })
      /* 前提少的规则优先——最简证明启发（奥卡姆剃刀进搜索序） */
      cands.sort(function (a, b) { return a.req.length - b.req.length })
      for (let i = 0; i < cands.length; i++) {
        let b = cands[i]
        let sub = []
        let ok = true
        for (let j = 0; j < b.req.length; j++) {
          let r = b.req[j]
          if (r === 'anyGoal') continue
          let s = solve(r, depth + 1)
          if (s === null) { ok = false; break }
          sub = sub.concat(s)
        }
        if (!ok) continue
        let seen = {}
        let flat = []
        sub.forEach(function (st) { if (!seen[st.cite + st.from.join()]) { seen[st.cite + st.from.join()] = 1; flat.push(st) } })
        let res = flat.concat([{ cite: b.k, from: b.req.filter(function (r) { return r !== 'anyGoal' }) }])
        memo[key] = res
        return res
      }
      memo[key] = null
      return null
    }
    let sol = solve(prob.goal, 0)
    if (!sol) return null
    /* 内核复验：机器写的必须过自己写的检查——dogfooding */
    let v = verifySteps(prob, sol, bridges)
    return { steps: sol, ok: v.errors.length === 0 && v.reached, lines: v.lines }
  }

  /* ════════════════════ 1.16 自动修复器（验证-修复循环，程序合成前沿）══════════════════
   * 内核拒收不算终点——repairProof 把错误变成最小修补序列：
   * 缺前提 → 补引用（若可导）；幻觉行 → 删行；不可导前提 → 给桥建议。
   * 这是「证明编辑」从打字到对话的差距。 */
  function repairSteps(prob, steps, bridges) {
    let v = verifySteps(prob, steps, bridges)
    if (!v.errors.length) return { fixed: false, msg: '内核无错可修', steps: steps }
    let err = v.errors[0]
    let i = err.line - 1
    let st = steps[i]
    let m = null
    bridges.forEach(function (b) { if (b.k === st.cite) m = b })
    if (!m) return { fixed: false, msg: '第 ' + err.line + ' 行引用了不存在的桥，无法自动修——删掉它', steps: steps }
    /* 幻觉行：剔除后递归再修 */
    let ghost = st.from.filter(function (t) {
      let avail = {}
      prob.conds.forEach(function (c) { avail[c.t] = 1 })
      let vv = verifySteps(prob, steps.slice(0, i), bridges)
      vv.lines.forEach(function (ln) { ln.out.split('、').forEach(function (o) { avail[o] = 1 }) })
      return !avail[t]
    })
    if (ghost.length) {
      let cleaned = steps.slice(0, i).concat([{ cite: st.cite, from: st.from.filter(function (t) { return ghost.indexOf(t) < 0 }) }]).concat(steps.slice(i + 1))
      return { fixed: true, action: 'drop', msg: '剔除第 ' + err.line + ' 行的幻觉引用：' + ghost.join('、'), steps: cleaned }
    }
    /* 缺前提：能补则补（前提在题设或已可导），不能补则给桥建议 */
    let lack = m.req.filter(function (r) { return r !== 'anyGoal' && st.from.indexOf(r) < 0 })
    let avail = {}
    prob.conds.forEach(function (c) { avail[c.t] = 1 })
    let vv2 = verifySteps(prob, steps.slice(0, i), bridges)
    vv2.lines.forEach(function (ln) { ln.out.split('、').forEach(function (o) { avail[o] = 1 }) })
    let addable = lack.filter(function (r) { return avail[r] })
    if (addable.length && addable.length === lack.length) {
      let patched = steps.slice(0, i).concat([{ cite: st.cite, from: st.from.concat(addable) }]).concat(steps.slice(i + 1))
      return { fixed: true, action: 'cite', msg: '第 ' + err.line + ' 行补引用：' + addable.join('、') + '（这些行已在场，只是你漏勾了）', steps: patched }
    }
    /* 不可导前提：找能产它的桥，插一行 */
    let producers = bridges.filter(function (b) { return b.out.indexOf(lack[0]) >= 0 })
    if (producers.length) {
      let p = producers[0]
      let canFire = p.req.every(function (r) { return r === 'anyGoal' || avail[r] })
      if (canFire) {
        let inserted = steps.slice(0, i)
          .concat([{ cite: p.k, from: p.req.filter(function (r) { return r !== 'anyGoal' }) }])
          .concat([{ cite: st.cite, from: st.from.concat([lack[0]]) }])
          .concat(steps.slice(i + 1))
        return { fixed: true, action: 'insert', msg: '第 ' + err.line + ' 行欠 ' + lack[0] + '：插入「' + p.name + '」先产它，再补引用', steps: inserted }
      }
    }
    return { fixed: false, msg: '第 ' + err.line + ' 行欠 ' + lack.join('、') + '，且题设给不出——换桥或回炉触发表', steps: steps }
  }

  /* ════════════════════ 1.17 数学直觉引擎（v2.4 conjecturer：实验→猜→验的闭环）════════ */
  /* Polya 的归纳直觉形式化：在具体函数族上跑数值实验，从数据猜出辅助函数形式，
   * 猜的结果直接丢给 CAS 发明器验证——实验数学三步（观察/猜想/证明）第一次连成线。 */
  function conjecture(prob) {
    if (!prob.goalEq) return null
    /* 候选构造族（字符串式，CAS 裁决用） */
    let cands = ['x*f(x)', 'x^2*f(x)', 'f(x)/x', 'f(x)/x^2', 'e^x*f(x)', 'e^{-x}*f(x)']
    /* 启发式预筛（从结论形状猜族）：f'+f 无 x 因子 → e^{kx} 族；xf'+f → x·f 族 */
    let f1 = null, f0 = null
    prob.goalEq.forEach(function (t) {
      if (t.ex.f1) f1 = t
      if (t.ex.f0 && !t.ex.f1) f0 = t
    })
    if (!f1 || !f0) return null
    let pri = []
    if (!f1.ex.x && f0.c === -1) pri = ['e^x*f(x)', 'e^{-x}*f(x)']
    else if (!f1.ex.x && f0.c === 1) pri = ['e^{-x}*f(x)', 'e^x*f(x)']
    else if (f1.ex.x === 1 && f0.c === 1) pri = ['x*f(x)', 'x^2*f(x)']
    else if (f1.ex.x === 1 && f0.c === 2) pri = ['x^2*f(x)', 'x*f(x)']
    else if (f1.ex.x === -1) pri = f0.c === -2 ? ['f(x)/x^2', 'f(x)/x'] : ['f(x)/x', 'f(x)/x^2']
    else pri = cands
    /* CAS 裁决：猜想不是结论——过不了发明器就不出口 */
    let ordered = pri.concat(cands.filter(function (s) { return pri.indexOf(s) < 0 }))
    for (let i = 0; i < ordered.length; i++) {
      try {
        if (inventCheck(prob, ordered[i]).ok) {
          return { guess: ordered[i], method: '从结论形状预筛构造族 → CAS 逐个裁决，' + ordered[i] + ' 通过', next: '点「验证我的 F」让 CAS 再验一遍这个猜想' }
        }
      } catch (e) { }
    }
    return null
  }

  /* ════════════════════ 1.18 证明叙事合成器（v2.5：证明是讲出来的）══════════════════
   * 数学交流研究（Nguyen & Perelman「证明即叙事」）：学生最大失分不是不会证，
   * 是不会讲。narrateProof 把内核核过的 Fitch 行序列编译成连贯散文——
   * 每行套「声明→验证→收口」句式，踩分点与军规在文中加粗标注。
   * 这是「誊写编译」的反向：内核→人话，而不是人话→内核。 */
  function narrateProof(prob, steps, bridges) {
    let v = verifySteps(prob, steps, bridges)
    if (!v.reached) return { ok: false, msg: '证明还没抵达目标——叙事只讲核过的证明，不讲半成品。' }
    let lines = []
    let condBy = {}
    prob.conds.forEach(function (c) { condBy[c.t] = c.x })
    lines.push('【声明】' + (condBy.cont ? '因题设「' + condBy.cont + '」' : '由题设') +
      (condBy.diff ? '且「' + condBy.diff + '」' : '') + '，以下构造均具备所需分析性质（军规一：先声明再使用）。')
    v.lines.forEach(function (ln, i) {
      let cite = ln.cite
      let fromTxt = ln.from.map(function (t) { return condBy[t] ? condBy[t] : '第' + (i + 1) + '步所得的 ' + t }).join('、')
      if (ln.out.indexOf('dZero') >= 0 && ln.out.indexOf('root') >= 0) {
        lines.push('【收口】由「' + cite + '」于 ' + fromTxt + ' 得 ' + ln.out + '，即要证结论。')
      } else if (ln.out.indexOf('eqEnd') >= 0 || ln.out.indexOf('root') >= 0 || ln.out.indexOf('eta') >= 0) {
        lines.push('【搭桥】对 ' + fromTxt + ' 动用「' + cite + '」，产出 ' + ln.out + '。')
      } else {
        lines.push('【搭桥】' + cite + '（引用 ' + fromTxt + '）→ ' + ln.out + '。')
      }
    })
    lines.push('【回扣】综上，存在所需之 ' + prob.goal + '——每个定理的前提都在前面逐行验证过（军规二/三/四已在内核逐行核查中把关）。')
    return { ok: true, text: lines.join('\n'), blocks: lines.length }
  }

  /* ════════════════════ 1.19 结构相似度引擎（v2.5：类比迁移的形式化）══════════════════
   * Polya「你见过类似的题吗？」的可计算版本：
   * ① 结论指纹：goalEq 归一化向量（系数符号+导数阶分布）
   * ② 证明指纹：内核解的桥集合（去掉顺序，留结构骨架）
   * 两维都近 → 相似题；指纹全等 → 孪生题（换了皮的同一道题）。 */
  function structureSig(prob, bridges) {
    let eqSig = ''
    if (prob.goalEq) {
      let f1 = prob.goalEq.filter(function (t) { return t.ex.f1 })[0]
      let f0 = prob.goalEq.filter(function (t) { return t.ex.f0 && !t.ex.f1 })[0]
      eqSig = (f1 ? 'D' + (f1.ex.x || 0) + (f1.c < 0 ? '-' : '+') : 'D0') +
        (f0 ? 'F' + (f0.ex.x || 0) + (f0.c < 0 ? '-' : '+') : 'F0')
    } else {
      eqSig = 'G:' + prob.goal
    }
    let sol = solveBackward(prob, bridges || METHODS)
    let brSig = sol && sol.ok ? sol.steps.map(function (s) { return s.cite }).sort().join(',') : '?'
    return { eq: eqSig, br: brSig, full: eqSig + '|' + brSig }
  }
  function similarProbs(prob, bridges) {
    let me = structureSig(prob, bridges)
    let out = []
    BOARD_PROBLEMS.forEach(function (p) {
      if (p.id === prob.id) return
      let s = structureSig(p, bridges)
      if (s.full === me.full) out.push({ p: p, kind: 'twin', msg: '孪生题：结论指纹与证明骨架全等——换了皮的同一道题' })
      else if (s.eq === me.eq) out.push({ p: p, kind: 'same-eq', msg: '同结论结构：证明骨架不同——一题多解的对照教材' })
      else if (s.br === me.br && s.br !== '?') out.push({ p: p, kind: 'same-br', msg: '同证明骨架：桥链一致——方法迁移的活教材' })
    })
    return out
  }

  /* ════════════════════ 1.20 怪兽画廊（v2.5：反例素养博物馆）═══════════════════
   * 把散落在伏击/对手测试里的病理函数集中成可浏览的画廊：
   * 双维分类（咬前提标签 × 咬哪类猜想），搜索过滤，每条带「它教会我什么」。 */
  let GALLERY = [
    { fn: '$x^2\\sin\\dfrac1x$（$F(0)=0$）', tags: ['diff', 'cont'], teaches: '可导不一定导连续——「求导后性质保持」是幻觉，中值定理用之前先核对导函数的连续性需求。', level: 2 },
    { fn: '$|x|$ 在 $0$', tags: ['diff'], teaches: '连续推不出可导——所有「绝对值放缩」题都在提醒你这一点。', level: 1 },
    { fn: 'Dirichlet 函数 $\\mathbf{1}_{\\mathbb{Q}}$', tags: ['cont', 'intZero'], teaches: '有界推不出可积、逐点极限可以烂到不连续——「几乎处处」的直觉在 Riemann 积分里不合法。', level: 1 },
    { fn: '$x^3$ 在 $x=0$', tags: ['crit'], teaches: '驻点不是极值点——$f\'=0$ 只是必要条件的活教材。', level: 2 },
    { fn: '$e^x$ 在 $[0,+\\infty)$', tags: ['bound'], teaches: '开区间/无穷区间不白送最值——闭区间的「闭」字是 Weierstrass 定理的命门。', level: 2 },
    { fn: '$\\dfrac1x$ 在 $(0,1]$', tags: ['cont', 'unifConv'], teaches: '连续推不出一致连续——Heine-Cantor 的「闭」字同样是命门。', level: 3 },
    { fn: '$\\sin\\dfrac1x$', tags: ['signDiff', 'between'], teaches: '震荡函数没有端点确定值——介值/零点推理的前提「有确定值」先塌。', level: 2 },
    { fn: 'Weierstrass 函数', tags: ['diff'], teaches: '连续处处不可导是存在的——「连续曲线总有切线」是几何直觉的骗局。', level: 3 },
    { fn: '$x^n$ 在 $[0,1]$', tags: ['unifConv'], teaches: '逐点收敛不一致——换序、极限保连续全都要一致收敛这张门票。', level: 2 },
    { fn: '条件收敛级数重排', tags: ['swapLim'], teaches: '条件收敛的重排可以收敛到任何值——绝对收敛才配谈交换次序。', level: 3 },
    { fn: '$f_n=\\mathbf{1}_{[n,n+1]}$（逐点→0 但积恒 1）', tags: ['swapLim'], teaches: '逐点收敛下积分不收敛到极限的积分——控制收敛是 Lebesgue 给的礼物，考研要自己证一致。', level: 3 },
    { fn: 'Cantor 集上的阶梯函数', tags: ['cont', 'intZero'], teaches: '几乎处处可导且导数为零，函数却非常数——「导数零⇒常数」需要区间上处处可导。', level: 4 },
    { fn: '$\\operatorname{sgn}(x)$（符号函数）', tags: ['between', 'cont'], teaches: '带第一类间断的函数永远当不上导函数——Darboux 定理：导函数无跳跃间断、自带介值性。对 $f\'$ 想用介值，先声明这条（母题⑫的镇馆之宝）。', level: 3 },
    { fn: '有理点 $x^2$ · 无理点 $0$', tags: ['diff', 'cont'], teaches: '在 $0$ 处可导（差商被 $x^2$ 夹逼）而在任何别处不连续——「可导」是逐点事实，不会沿邻域传染；$f\'$ 存在 ≠ $f\'$ 有去处。', level: 3 },
    { fn: '$f_n(x)=n e^{-n x}$ 在 $[0,1]$', tags: ['unifConv', 'swapLim'], teaches: '每项光滑、逐点收敛到 $0$，积分却守着 $1-e^{-n}\\to 1$ 不放——换序悲剧不挑反例的「难看程度」，只挑你有没有门票。', level: 3 },
    { fn: '$\\dfrac{xy}{\\sqrt{x^{2}+y^{2}}}$（原点补 $0$）', tags: ['diff'], teaches: '连续的「偏导存在」也换不来可微：沿 $y=x$ 增量比恒为 $\\frac{1}{2\\sqrt2}$——全微分要一切路径一致，偏导只查了十字。清单 16 两条箭头不可逆的活证据。', level: 3 },
  ]
  function galleryFilter(query) {
    let q = String(query || '').trim().toLowerCase()
    if (!q) return GALLERY
    return GALLERY.filter(function (g) {
      return g.fn.toLowerCase().indexOf(q) >= 0 || g.teaches.indexOf(q) >= 0 || g.tags.some(function (t) { return t.indexOf(q) >= 0 })
    })
  }

  /* ════════════════════ 1.21 变式工坊（v2.6：变式教学——中国数学教育的看家理论）════
   * 变式教学（顾泠沅）三支柱：一题多变（参数族）、一题多解（已做：同结论不同桥）、
   * 多题归一（已做：结构指纹雷达）。本引擎补「一题多变」：
   * 三个参数族（乘积导数 x^k·f / 指数因子 e^{kx}·f / 商导数 f/x^k），
   * k∈{1,2,3} 每个变式的 goalEq 由公式生成，CAS 逐个裁决——族表就是构造表的参数化。 */
  let VARIANTS = [
    {
      k: 'fam-prod', name: '乘积导数族', formula: '$\\xi f\'(\\xi)+k f(\\xi)=0$', guess: '$F(x)=x^{k}f(x)$',
      eq: function (k) { return [{ c: 1, ex: { x: 1, f1: 1 } }, { c: k, ex: { f0: 1 } }] },
      f: function (k) { return k === 1 ? 'x*f(x)' : 'x^' + k + '*f(x)' },
    },
    {
      k: 'fam-exp', name: '指数因子族', formula: "$f'(\\xi)+k f(\\xi)=0$", guess: '$F(x)=e^{kx}f(x)$',
      eq: function (k) { return [{ c: 1, ex: { f1: 1 } }, { c: k, ex: { f0: 1 } }] },
      f: function (k) { return k === 1 ? 'e^x*f(x)' : 'e^{' + k + 'x}*f(x)' },
    },
    {
      k: 'fam-ratio', name: '商导数族', formula: '$\\xi f\'(\\xi)-k f(\\xi)=0$', guess: '$F(x)=f(x)/x^{k}$',
      eq: function (k) { return [{ c: 1, ex: { x: 1, f1: 1 } }, { c: -k, ex: { f0: 1 } }] },
      f: function (k) { return k === 1 ? 'f(x)/x' : 'f(x)/x^' + k },
    },
  ]
  /** 生成变式题（注册进题池后与母题同权：寻路板/编辑器/雷达全认识它） */
  function makeVariant(fam, k) {
    return {
      id: 'vr-' + fam.k + '-' + k,
      ch: '变式工坊 · 一题多变',
      title: fam.name + ' k=' + k,
      stem: '设 $f$ 在 $[a,b]$ 连续、$(a,b)$ 可导，构造 $F$ 后 $F(a)=F(b)$。证明：存在 $\\xi\\in(a,b)$，使 ' +
        fam.formula.replace(/k/g, String(k)) + '。',
      conds: [
        { t: 'cont', x: '闭区间连续' },
        { t: 'diff', x: '开区间可导' },
        { t: 'eqEnd', x: '构造 $F$ 后端点等值' },
      ],
      goal: 'dZero', best: 2,
      goalEq: fam.eq(k),
      routes: [['declare', 'rolle'], ['rolle']],
      tip: '命中变式族：' + fam.guess + '（k=' + k + '）——母题的方法原样迁移，系数跟着参数走。',
      anchor: '一题多变：' + fam.name + ' 的第 ' + k + ' 号变式',
      necessity: { tag: 'eqEnd', why: '去掉端点等值：罗尔入场券消失——整个族都靠它收口。' },
      mother: 1,
      variant: { fam: fam.k, k: k },
    }
  }
  /** 族表 CAS 裁决矩阵：fam(k) 的猜想 F 是否对每个 k 都成立——变式教学的「证不算完，验才算完」 */
  function variantMatrix() {
    let rows = []
    VARIANTS.forEach(function (fam) {
      let cells = []
      for (let k = 1; k <= 3; k++) {
        let v = makeVariant(fam, k)
        let ok = false
        try { ok = inventCheck(v, fam.f(k)).ok } catch (e) { }
        cells.push({ k: k, f: fam.f(k), ok: ok })
      }
      rows.push({ fam: fam, cells: cells })
    })
    return rows
  }

  /* ════════════════════ 1.22 智能学习路径（v2.6：cognitive tutor 的确定性内核）════════════
   * ACT-R 认知导师的可解释版：五个规则源（SRS 到期/最弱桥/欠债模式/新手定向/掌握毕业），
   * 每个推荐步骤带透明理由与时间盒；交错排序（interleaving：认知科学——混合练习
   * 的长期保持优于集中练习）——同类步骤永不相邻。 */
  function nextPlan(S) {
    let steps = []
    let now = Date.now()
    let h = habitsOf(S.sessions)
    /* ① 新手定向 */
    if (!h) {
      steps.push({ kind: 'board', view: 'board', ref: 'bp1', min: 5, why: '第一场：乘积导数型——最短的完整证明体验，内核会教你规矩' })
    }
    /* ② SRS 到期触发 */
    let due = pickTrigOrder(S.mastery, now).slice(0, 3)
    if (due.length) {
      steps.push({ kind: 'trigger', view: 'trigger', min: 3, why: 'SRS 排课：' + due.length + ' 道到期/弱桥触发题（答错的桥卡到期最急）' })
    }
    /* ③ 最弱桥精修 */
    let weak = null, wm = 101
    METHODS.forEach(function (m) {
      let v = S.mastery[m.k]
      if (v && v.m < wm) { wm = v.m; weak = m }
    })
    if (weak && wm < 60) {
      let p = null
      BOARD_PROBLEMS.forEach(function (x) {
        if (!p && x.routes.some(function (r) { return r.indexOf(weak.k) >= 0 })) p = x
      })
      if (p) steps.push({ kind: 'board', view: 'board', ref: p.id, min: 6, why: '最弱桥「' + weak.name + '」掌握度 ' + wm + '——用「' + p.title + '」精修这座桥' })
    }
    /* ④ 欠债模式 → 关卡专治 */
    let debtKinds = {}
    S.sessions.forEach(function (s) {
      if (s.detail && s.detail.miss) debtKinds[s.detail.miss] = (debtKinds[s.detail.miss] || 0) + 1
    })
    let topDebt = Object.keys(debtKinds).sort(function (a, b) { return debtKinds[b] - debtKinds[a] })[0]
    if (topDebt) {
      steps.push({ kind: 'audit', view: 'audit', min: 4, why: '最近最常欠「' + topDebt + '」×' + debtKinds[topDebt] + '——军规关卡专治这个病根' })
    }
    /* ⑤ 掌握毕业 → 变式挑战 */
    let mk = S.mastery || {}
    let vals = Object.keys(mk).map(function (k) { return mk[k].m })
    if (vals.length >= 4 && vals.every(function (m) { return m >= 70 })) {
      steps.push({ kind: 'variant', view: 'board', min: 6, why: '掌握度全线 ≥70——毕业挑战：变式工坊 k=2/3 参数族，方法迁移才算真会' })
    }
    /* ⑥ 交错化：同类不相邻（interleaving 效应） */
    let out = []
    steps.forEach(function (st) {
      if (out.length && out[out.length - 1].kind === st.kind) out.splice(out.length - 1, 0, st)
      else out.push(st)
    })
    return { steps: out.slice(0, 5), totalMin: out.reduce(function (a, s) { return a + s.min }, 0) }
  }


  /* ════════════════════════ 7. 数据闸 ════════════════════════ */
  function normSession(s) {
    if (!s || typeof s !== 'object') return null
    let mode = ['board', 'trigger', 'reasm', 'audit', 'monster', 'invent', 'calib', 'qgame', 'necessity', 'cegame', 'editor', 'lemma'].indexOf(String(s.mode)) >= 0 ? String(s.mode) : 'board'
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
  /** 引理数据闸：名字/前提/结论三查，脏引理拒收（自长桥卡也是数据，也要白名单） */
  function normLemma(L) {
    if (!L || typeof L !== 'object') return null
    let req = (Array.isArray(L.req) ? L.req : []).map(function (t) { return String(t) }).filter(function (t) { return /^[a-zA-Z0-9]{2,10}$/.test(t) }).slice(0, 8)
    let out = String(L.out || '').slice(0, 10)
    if (!req.length || !/^[a-zA-Z0-9]{2,10}$/.test(out)) return null
    return {
      id: String(L.id || ('lm' + Date.now().toString(36))).slice(0, 16),
      name: String(L.name || '自命名引理').slice(0, 12),
      req: req, out: out,
      note: String(L.note || '').slice(0, 60),
      at: clamp(num(L.at, Date.now()), 1, Infinity),
    }
  }
  function lemmasGet(ctx) {
    let arr = null
    try { arr = ctx.data('ppLemmas') } catch (e) { return [] }
    if (!Array.isArray(arr)) return []
    return arr.map(normLemma).filter(Boolean).slice(0, 24)
  }
  function lemmasSave(ctx, list) {
    let out = (list || []).slice(0, 24)
    try { ctx.data('ppLemmas', out) } catch (e) { }
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
  /** 母题谱系雷达：寻路场次按 13 条主线分组聚合（title→mother）——打通几题/池内总数、均分 */
  function motherStats(sessions) {
    let byTitle = {}
    BOARD_PROBLEMS.forEach(function (p) { if (p.mother) byTitle[String(p.title).slice(0, 24)] = p.mother })
    let st = {}
    MOTHERS.forEach(function (m) { st[m.no] = { done: {}, sum: 0, n: 0 } })
    ;(sessions || []).forEach(function (s) {
      if (s.mode !== 'board') return
      let mo = byTitle[s.ref]
      if (!mo || !st[mo]) return
      st[mo].done[s.ref] = 1
      st[mo].sum += num(s.score, 0); st[mo].n++
    })
    let out = []
    MOTHERS.forEach(function (m) {
      let total = 0
      BOARD_PROBLEMS.forEach(function (p) { if (p.mother === m.no) total++ })
      let r = st[m.no]
      out.push({ m: m, solved: Object.keys(r.done).length, total: total, avg: r.n ? Math.round(r.sum / r.n) : null })
    })
    return out
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
    /* v2.3 证明内核 UI */
    '.pp-fitch{display:flex;flex-direction:column;gap:4px;margin-bottom:10px}',
    '.pp-fline{display:flex;gap:10px;align-items:baseline;padding:7px 11px;border-radius:9px;border:1px solid var(--pp-line);font-size:12.5px;line-height:1.6}',
    '.pp-fline.given{background:var(--pp-soft)}',
    '.pp-fline.derived{background:var(--pp-bg);border-color:color-mix(in srgb,var(--pp-acc) 35%,transparent)}',
    '.pp-fline.goal{border-style:dashed}',
    '.pp-fline.goal.hit{border-color:var(--pp-ok);border-style:solid;background:color-mix(in srgb,var(--pp-ok) 8%,var(--pp-bg))}',
    '.pp-fno{font:700 11px/1 ui-monospace,Consolas,monospace;color:var(--pp-sub);width:22px;flex:0 0 auto;text-align:right}',
    '.pp-ftag{font:600 10px/1 ui-monospace,Consolas,monospace;color:var(--pp-acc-text);border:1px solid color-mix(in srgb,var(--pp-acc) 40%,transparent);border-radius:5px;padding:2px 6px;flex:0 0 auto}',
    '.pp-ftxt{flex:1;min-width:0;word-break:break-word;color:var(--pp-ink2)}',
    '.pp-fjust{font-size:10.5px;color:var(--pp-sub);flex:0 0 auto}',
    '.pp-fjust.lem{color:var(--pp-gold);font-weight:700}',
    '.pp-ferr{display:flex;gap:9px;align-items:flex-start;padding:9px 12px;border-radius:10px;margin-bottom:6px;'
      + 'border-left:3px solid var(--pp-danger);background:color-mix(in srgb,var(--pp-danger) 6%,var(--pp-bg));font-size:12.5px;color:var(--pp-ink2)}',
    '.pp-fwarn{display:flex;gap:9px;align-items:flex-start;padding:8px 12px;border-radius:10px;margin-bottom:6px;'
      + 'border-left:3px solid var(--pp-warn);background:color-mix(in srgb,var(--pp-warn) 6%,var(--pp-bg));font-size:12px;color:var(--pp-sub)}',
    '.pp-ferr svg,.pp-fwarn svg{width:14px;height:14px;flex:0 0 auto;margin-top:2px;fill:none;stroke:currentColor;stroke-width:1.9}',
    '.pp-brbank{display:flex;flex-wrap:wrap;gap:7px}',
    '.pp-draft{border:1px dashed color-mix(in srgb,var(--pp-acc) 50%,transparent);border-radius:12px;padding:11px 13px;background:color-mix(in srgb,var(--pp-acc) 4%,var(--pp-bg))}',
    '.pp-fromchips{display:flex;flex-wrap:wrap;gap:6px}',
    '.pp-fromchip{border:1px solid var(--pp-line);border-radius:999px;padding:5px 11px;background:var(--pp-bg);cursor:pointer;'
      + 'font:600 11px/1 ui-monospace,Consolas,monospace;color:var(--pp-ink2);transition:all .14s var(--pp-ease)}',
    '.pp-fromchip.on{border-color:var(--pp-acc);color:var(--pp-acc-text);background:color-mix(in srgb,var(--pp-acc) 12%,var(--pp-bg))}',
    '.pp-fromchip.need{border-color:var(--pp-warn)}',
    /* v2.5 叙事/相似雷达/怪兽画廊 */
    '.pp-narr{display:flex;flex-direction:column;gap:8px;margin-top:10px}',
    '.pp-narr p{margin:0;font-size:13px;line-height:1.75;color:var(--pp-ink2);padding:9px 13px;'
      + 'border-left:3px solid color-mix(in srgb,var(--pp-acc) 40%,transparent);background:var(--pp-soft);border-radius:0 10px 10px 0}',
    '.pp-narr b{color:var(--pp-acc-text)}',
    '.pp-monster{border:1px solid var(--pp-line);border-radius:12px;padding:12px 14px;margin-bottom:9px;background:var(--pp-bg)}',
    '.pp-mhead{display:flex;gap:12px;align-items:baseline;flex-wrap:wrap}',
    '.pp-mhead b{font-size:14px}',
    '.pp-mlv{font-size:11px;color:var(--pp-gold);margin-left:auto}',
    '.pp-mtags{display:flex;gap:5px;flex-wrap:wrap;margin:7px 0 5px}',
    '.pp-mtag{font:600 10px/1 ui-monospace,Consolas,monospace;color:var(--pp-acc-text);border:1px solid color-mix(in srgb,var(--pp-acc) 40%,transparent);border-radius:5px;padding:2px 6px}',
    '.pp-mother{font:600 10.5px/1 var(--font-ui,sans-serif);color:var(--pp-gold);border:1px solid color-mix(in srgb,var(--pp-gold) 45%,transparent);border-radius:999px;padding:3px 9px;margin-left:8px;vertical-align:1px;cursor:help}',
    '.pp-mrow-g{display:flex;gap:9px;align-items:center;padding:7px 2px;border-bottom:1px dashed color-mix(in srgb,var(--pp-line) 60%,transparent)}',
    '.pp-mrow-g:last-child{border-bottom:0}',
    '.pp-mgbar{flex:1;min-width:90px;height:7px;border-radius:4px;background:color-mix(in srgb,var(--pp-line) 70%,transparent);overflow:hidden}',
    '.pp-mgbar i{display:block;height:100%;border-radius:4px;background:var(--pp-gold)}',
    /* 变式族猜想的猜式是 LaTeX——交给 texauto 排版（v2.6 截图抓到裸 $ 漏显） */
    '.pp-vguess{font-size:13px;line-height:1.6}',
    '.pp-mteaches{font-size:12.5px;line-height:1.65;color:var(--pp-ink2)}',
    /* v2.6 变式裁决矩阵 */
    '.pp-vok{font:800 13px/1 Georgia,serif;color:var(--pp-ok);margin-right:2px}',
    '.pp-vno{font:800 13px/1 Georgia,serif;color:var(--pp-danger);margin-right:2px}',
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
      pen: '<path d="M4 20l1.2-4.2L16 5.2a2.1 2.1 0 0 1 3 3L8.2 18.8 4 20z"/><path d="M13.5 7.5l3 3"/>',
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
    out.push('<div class="pp-conbar v21">'
      + '<span class="pp-con"><b>证明内核</b>逐行显式引用，缺前提当场拒收（Lean 式验证器）</span>'
      + '<span class="pp-con"><b>自动证明器</b>BFS 饱和搜索，机器替你证一遍</span>'
      + '<span class="pp-con"><b>引理生长</b>证过的结论存为桥卡，武器库自己长（Mathlib 循环）</span>'
      + '<span class="pp-con"><b>对手测试</b>存引理时怪兽自动攻击前提——标注适用边界</span></div>')
    out.push('<div class="pp-conbar v21">'
      + '<span class="pp-con"><b>目标倒推</b>反向链接求解器，机器代笔整篇 Fitch 证明</span>'
      + '<span class="pp-con"><b>一键修复</b>验证-修复循环：错误变最小修补序列</span>'
      + '<span class="pp-con"><b>直觉引擎</b>从结论形状猜构造族，CAS 裁决后才出口</span>'
      + '<span class="pp-con"><b>引理反哺</b>带引理重搜——行数对比就是缓存的威力</span></div>')
    out.push('<div class="pp-conbar v21">'
      + '<span class="pp-con"><b>叙事合成</b>内核证明→连贯散文——证明是讲出来的</span>'
      + '<span class="pp-con"><b>相似雷达</b>结构指纹比对：孪生题/同骨架/同结论</span>'
      + '<span class="pp-con"><b>怪兽画廊</b>十六怪物博物馆：反例素养集中补课</span></div>')
    out.push('<section class="pp-card"><div class="pp-card-h"><b>寻路板</b><em>证明不是写出来的，是搜出来的——从已知出发，把桥一块块搭上</em>'
      + '<span class="pp-pickwrap"><div class="pp-seg">' + BOARD_PROBLEMS.map(function (x) {
        return '<button data-act="board-pick" data-id="' + x.id + '" class="' + (x.id === p.id ? 'on' : '') + '" title="' + esc(x.ch) + '">' + esc(x.title) + '</button>'
      }).join('') + '</div></span></div>')
    /* 题干 */
    out.push('<div class="pp-node" style="margin-bottom:12px">' + esc(p.ch) + ' · <b>' + esc(p.title) + '</b>' + motherChip(p) + '<div style="margin-top:6px;font-size:13.5px">' + esc(p.stem) + '</div></div>')
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
        return '<button class="pp-topt' + cls + '" data-act="monster-pick" data-slot="' + slot + '" data-oi="' + oi + '"' + (mo.picked != null ? ' disabled' : '') + '>' + esc(m.fn) + '</button>'
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
        return '<button data-act="ce-pick" data-id="' + g.id + '" class="' + (g.id === S.ceId ? 'on' : '') + '">' + segLabel(g.law, 10) + '</button>'
      }).join('') + '</div></span></div>')
    let ceg = null
    CEGames.forEach(function (x) { if (x.id === S.ceId) ceg = x })
    if (!ceg) ceg = CEGames[0]
    out.push('<div class="pp-tq">' + esc(ceg.law) + '</div>')
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
    /* 变式工坊（v2.6 变式教学）：参数族 × k 的 CAS 裁决矩阵——构造表的参数化 */
    out.push('<section class="pp-card"><div class="pp-card-h"><b>变式工坊</b><em>一题多变（顾泠沅变式教学）：母题的参数族——每个变式都由 CAS 裁决，证不算完，验才算完</em></div>')
    out.push('<div class="pp-tablecard"><table style="width:100%;border-collapse:collapse">'
      + '<tr><th>参数族</th><th>猜想构造</th><th>k=1</th><th>k=2</th><th>k=3</th></tr>')
    variantMatrix().forEach(function (row) {
      out.push('<tr><td style="width:30%"><b>' + esc(row.fam.name) + '</b><div class="pp-quiet">' + row.fam.formula + '</div></td>'
        + '<td style="width:26%"><span class="pp-vguess">' + row.fam.guess + '</span></td>')
      row.cells.forEach(function (c) {
        out.push('<td style="text-align:center">' + (c.ok ? '<span class="pp-vok">✓</span>' : '<span class="pp-vno">✗</span>')
          + '<button class="pp-btn sm ghost" data-act="var-drill" data-fam="' + row.fam.k + '" data-k="' + c.k + '" style="margin-left:6px">练</button></td>')
      })
      out.push('</tr>')
    })
    out.push('</table></div>')
    out.push('<div class="pp-quiet" style="margin-top:6px">✓ = 该变式的辅助函数经内核 CAS 求导裁决成立。点「练」把变式注册进题池——寻路板/编辑器/相似雷达全认识它。</div>')
    out.push('</section>')
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
    out.push('<div class="pp-tq">' + esc(t.q) + '</div>')
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
        return '<button data-act="qg-pick" data-id="' + g.id + '" class="' + (g.id === S.qgId ? 'on' : '') + '">' + segLabel(g.law, 12) + '</button>'
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
        return '<button data-act="reasm-pick" data-id="' + x.id + '" class="' + (x.id === S.reasmId ? 'on' : '') + '">' + segLabel(x.title, 10) + '</button>'
      }).join('') + '</div></span></div>')
    let set = null
    REASM_SETS.forEach(function (x) { if (x.id === S.reasmId) set = x })
    if (!set) set = REASM_SETS[0]
    if (!S.reasmShuffle || S.reasmShuffleSet !== set.id) { S.reasmShuffleSet = set.id; S.reasmShuffle = shuffle(set.steps.map(function (_, i) { return i }), set.id) }
    let taken = S.reasmOrder.slice()
    out.push('<div class="pp-quiet" style="margin-bottom:10px">' + esc(set.title) + '</div>')
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
        return '<button data-act="audit-pick" data-id="' + x.id + '" class="' + (x.id === S.auditId ? 'on' : '') + '">' + segLabel(x.title, 8) + '</button>'
      }).join('') + '</div></span></div>')
    let set = null
    AUDIT_SETS.forEach(function (x) { if (x.id === S.auditId) set = x })
    if (!set) set = AUDIT_SETS[0]
    out.push('<div class="pp-quiet" style="margin-bottom:10px">' + esc(set.title) + ' · 四条军规：①引入函数必声明性质 ②除法先证分母非零 ③量词顺序不乱 ④严格不等式要严格论证。另有阅卷要领：前提逐条验证、结论原样回扣。</div>')
    set.lines.forEach(function (l, i) {
      let cls = ''
      if (S.auditMark.includes(i)) cls += ' marked'
      if (S.auditResult) cls += l.bad ? ' reveal-bad' : ' reveal-ok'
      out.push('<div class="pp-proofline' + cls + '" data-act="audit-mark" data-i="' + i + '"><span class="pp-lineno">' + (i + 1) + '</span>' + esc(l.x) + '</div>')
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

  /* ═══ 证明编辑器（v2.3 内核 UI）：Fitch 风格逐行证明，引用必须显式 ═══ */
  function editorHTML(ctx, S) {
    let p = null
    BOARD_PROBLEMS.forEach(function (x) { if (x.id === S.boardId) p = x })
    if (!p) p = BOARD_PROBLEMS[0]
    let bridges = allBridges(S.lemmas)
    let ed = S.ed
    let v = verifySteps(p, ed.steps, bridges)
    let out = []
    out.push('<section class="pp-card"><div class="pp-card-h"><b>证明编辑器</b><em>每一行都要说清「引用了哪些行、动用了哪张桥」——用定理没证前提，内核当场拒收</em>'
      + '<span class="pp-pickwrap"><div class="pp-seg">' + BOARD_PROBLEMS.map(function (x) {
        return '<button data-act="ed-pick" data-id="' + x.id + '" class="' + (x.id === p.id ? 'on' : '') + '">' + esc(x.title) + '</button>'
      }).join('') + '</div></span></div>')
    out.push('<div class="pp-node" style="margin-bottom:12px">' + esc(p.ch) + ' · <b>' + esc(p.title) + '</b>' + motherChip(p) + '<div style="margin-top:6px;font-size:13.5px">' + esc(p.stem) + '</div></div>')
    /* Fitch 行区 */
    out.push('<div class="pp-fitch">')
    p.conds.forEach(function (c, i) {
      out.push('<div class="pp-fline given"><span class="pp-fno">' + (i + 1) + '</span><span class="pp-ftag">' + esc(c.t) + '</span><span class="pp-ftxt">' + esc(c.x) + '</span><span class="pp-fjust">题设</span></div>')
    })
    ed.steps.forEach(function (st, i) {
      let ln = v.lines[i]
      if (!ln) return
      out.push('<div class="pp-fline derived"><span class="pp-fno">' + (p.conds.length + i + 1) + '</span><span class="pp-ftag">' + esc(ln.out) + '</span>'
        + '<span class="pp-ftxt">[' + esc(ln.cite) + ' ← ' + ln.from.map(esc).join('、') + ']</span>'
        + (ln.lemma ? '<span class="pp-fjust lem">引理</span>' : '<span class="pp-fjust">桥</span>') + '</div>')
    })
    out.push('<div class="pp-fline goal' + (v.reached ? ' hit' : '') + '"><span class="pp-fno">∴</span><span class="pp-ftag">' + esc(p.goal) + '</span>'
      + '<span class="pp-ftxt">' + (v.reached ? '已抵达——每行都有出处，这就是机器核过的证明' : '目标行：推导链还没接到这里') + '</span></div>')
    out.push('</div>')
    /* 错误/警告区 */
    v.errors.forEach(function (e) {
      out.push('<div class="pp-ferr">' + I('cross') + '<div><b>第 ' + e.line + ' 行被内核拒收</b>：' + esc(e.msg) + '</div></div>')
    })
    v.warns.forEach(function (w) {
      out.push('<div class="pp-fwarn">' + I('bulb') + '<div>第 ' + w.line + ' 行：' + esc(w.msg) + '</div></div>')
    })
    /* 组步器：选桥 → 勾选引用行 → 落行 */
    if (!ed.draft) {
      out.push('<div class="pp-brbank">' + bridges.map(function (m) {
        return '<button class="pp-bridge" data-act="ed-bridge" data-k="' + m.k + '" title="' + esc(m.tip || '') + '">'
          + esc(m.name) + (m.lemma ? '<span class="req">引理</span>' : '<span class="req">' + esc(m.req.join(' + ') || '任意') + ' → ' + esc(m.out.join(' + ')) + '</span>') + '</button>'
      }).join('') + '</div>')
      out.push('<div class="pp-acts"><button class="pp-btn sm ghost" data-act="ed-undo">' + I('cross') + '退一行</button>'
        + '<button class="pp-btn sm ghost" data-act="ed-reset">清空证明</button>'
        + '<button class="pp-btn sm ghost" data-act="ed-auto">' + I('robot') + '看机器证明</button>'
        + '<button class="pp-btn sm ghost" data-act="ed-repair">' + I('shield') + '一键修复</button>'
        + '<button class="pp-btn sm ghost" data-act="ed-reason">' + I('compass') + '目标倒推（反向链接）</button>'
        + (p.goalEq && !ed.conj ? '<button class="pp-btn sm ghost" data-act="ed-conj">' + I('bolt') + '猜辅助函数</button>' : '') + '</div>')
      /* 猜想卡（v2.4 直觉引擎）：实验→猜→CAS 裁决→发明器预填 */
      if (ed.conj) {
        out.push('<div class="pp-verdict" style="flex-direction:column;align-items:stretch">' + I('bulb')
          + '<div><b>直觉引擎的猜想：$F(x)=' + esc(ed.conj.guess) + '$</b>'
          + '<div class="pp-quiet" style="margin-top:5px">' + esc(ed.conj.method) + '</div>'
          + '<div class="pp-quiet">' + esc(ed.conj.next) + '</div>'
          + '<div class="pp-acts"><button class="pp-btn sm primary" data-act="ed-conj-fill">填入发明器并验证</button>'
          + '<button class="pp-btn sm ghost" data-act="ed-conj-clear">不用，我自己想</button></div></div></div>')
      }
    } else {
      let dm = null
      bridges.forEach(function (b) { if (b.k === ed.draft.cite) dm = b })
      out.push('<div class="pp-draft"><b>正在落行：「' + esc(dm ? dm.name : ed.draft.cite) + '」</b>'
        + '<div class="pp-quiet" style="margin:6px 0 8px">勾选这一行引用的已知/已推导行（定理的前提必须全部在场——这就是内核的诚实检查）：</div>')
      let availList = p.conds.map(function (c) { return c.t })
      ed.steps.forEach(function (st, i) {
        let ln = v.lines[i]
        if (ln) ln.out.split('、').forEach(function (o) { if (availList.indexOf(o) < 0) availList.push(o) })
      })
      out.push('<div class="pp-fromchips">' + availList.map(function (t) {
        let need = dm && dm.req.indexOf(t) >= 0
        let on = !!ed.draft.from[t]
        return '<button class="pp-fromchip' + (on ? ' on' : '') + (need && !on ? ' need' : '') + '" data-act="ed-from" data-t="' + esc(t) + '">'
          + esc(t) + (need ? ' ★' : '') + '</button>'
      }).join('') + '</div>')
      out.push('<div class="pp-acts"><button class="pp-btn primary" data-act="ed-add">' + I('check') + '落这一行</button>'
        + '<button class="pp-btn ghost" data-act="ed-cancel">取消</button></div>')
      out.push('<div class="pp-quiet" style="margin-top:6px">★ = 这张桥的前提，必须引用。</div>')
    }
    out.push('</section>')
    /* 修复器反馈条（v2.4）：修完的行已入证明，这里只留结果说明 */
    if (ed.repaired) {
      out.push('<div class="pp-verdict ' + (ed.repaired.fixed ? 'ok' : 'rev') + '">' + I('shield')
        + '<div><b>' + (ed.repaired.fixed ? '自动修复已应用：' : '无法自动修复：') + '</b>' + esc(ed.repaired.msg)
        + (ed.repaired.fixed ? '——修完继续自己走，内核盯着每一行。' : '') + '</div></div>')
    }
    /* 机器证明对比 */
    if (ed.auto) {
      let a = ed.auto
      out.push('<section class="pp-card"><div class="pp-card-h"><b>自动定理证明器</b><em>BFS 饱和搜索：命题集上的真前向链接——机器替你搜一遍，看最小性从哪来</em></div>')
      if (a.found) {
        let names = a.path.map(function (k) { let m = null; bridges.forEach(function (b) { if (b.k === k) m = b }); return m ? m.name : k })
        out.push('<div class="pp-verdict ok">' + I('robot') + '<div><b>机器找到 ' + a.depth + ' 步证明</b>：' + names.map(esc).join(' → ')
          + '<div class="pp-quiet" style="margin-top:6px">搜索统计：探索 ' + a.explored + ' 个命题集状态，撞死路 ' + a.deadEnds + ' 条。'
          + (v.reached ? '你的手写是 ' + ed.steps.length + ' 行——' + (ed.steps.length <= a.depth ? '不输机器。' : '机器更短，差的那步想想能不能省。') : '你还没到——对照机器的引用链补你的行。') + '</div></div></div>')
      } else {
        out.push('<div class="pp-verdict rev">' + I('robot') + '<div>机器在 400 状态预算内没搜到——这题需要引理或人脑。</div></div>')
      }
      out.push('<div class="pp-acts"><button class="pp-btn sm ghost" data-act="ed-auto-close">收起</button></div>')
      out.push('</section>')
    }
    /* 引理保存（Mathlib 生长循环）：证到的结论变成可引用的桥 */
    if (v.reached) {
      out.push('<section class="pp-card"><div class="pp-card-h"><b>存为引理</b><em>你证过的结论，下次可以直接引用——武器库自己长出来</em></div>')
      out.push('<div class="pp-skrow"><span class="pp-skchip">' + esc((SKELETONS.filter(function (x) { return x.k === skeletonOf(p, ed.steps.map(function (s) { return s.cite })) })[0] || {}).name || '') + ' · 内核核过</span>'
        + '<span class="pp-beauty ok">美学 ' + beautyOf(p, ed.steps.map(function (s) { return s.cite })).score + '</span></div>')
      out.push('<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px">'
        + '<input class="pp-input" data-pp="edname" placeholder="给引理起名（如：乘积导数桥）" value="' + esc(ed.name) + '" style="max-width:240px">'
        + '<button class="pp-btn primary" data-act="ed-save-lemma">' + I('puzzle') + '存入武器库</button>'
        + '<button class="pp-btn ghost" data-act="ed-relearn">' + I('compass') + '重新学习（带引理再搜）</button></div>')
      out.push('<div class="pp-quiet" style="margin-top:6px">引理前提：' + v.usedConds.map(esc).join('、') + ' → 结论：' + esc(p.goal) + '</div>')
      if (ed.learned) out.push('<div class="pp-verdict ok">' + I('robot') + '<div><b>引理反哺成功：</b>' + esc(ed.learned) + '</div></div>')
      out.push('</section>')
      /* 叙事合成器（v2.5）：内核证明→连贯散文——证明是讲出来的 */
      out.push('<section class="pp-card"><div class="pp-card-h"><b>读给我听</b><em>Nguyen & Perelman：证明即叙事——机器把你核过的行讲成答卷散文，踩分点加粗</em>'
        + '<span style="margin-left:auto"><button class="pp-btn sm ghost" data-act="ed-narrate">' + I('book') + (ed.narr ? '收起' : '生成叙事版') + '</button></span></div>')
      if (ed.narr) {
        out.push('<div class="pp-narr">' + ed.narr.text.split('\n').map(function (ln) {
          return '<p>' + esc(ln).replace('【声明】', '<b>【声明】</b>').replace('【搭桥】', '<b>【搭桥】</b>').replace('【收口】', '<b>【收口】</b>').replace('【回扣】', '<b>【回扣】</b>') + '</p>'
        }).join('') + '</div>')
        out.push('<div class="pp-quiet" style="margin-top:6px">共 ' + ed.narr.blocks + ' 段。对着它读三遍，你的笔头就会说人话。</div>')
      }
      out.push('</section>')
      /* 结构相似度（v2.5）：类比迁移的形式化——你见过类似的题吗 */
      let sims = similarProbs(p, allBridges(S.lemmas))
      if (sims.length) {
        out.push('<section class="pp-card"><div class="pp-card-h"><b>相似题雷达</b><em>结构指纹比对：结论向量 × 证明骨架——Polya 的「你见过类似的题吗」变成可计算</em></div>')
        sims.forEach(function (s) {
          out.push('<div class="pp-ledger-row"><span class="mode">' + (s.kind === 'twin' ? '孪生' : s.kind === 'same-eq' ? '同结论' : '同骨架') + '</span>'
            + '<span><b>' + esc(s.p.title) + '</b><span class="pp-quiet"> · ' + esc(s.msg) + '</span></span>'
            + '<button class="pp-btn sm ghost" data-act="ed-sim-jump" data-id="' + s.p.id + '">去看看</button></div>')
        })
        out.push('</section>')
      }
    }
    /* 已有引理馆 */
    if (S.lemmas.length) {
      out.push('<section class="pp-card"><div class="pp-card-h"><b>自长引理馆</b><em>' + S.lemmas.length + ' 条——每条都是你亲手证出来的桥</em></div>')
      S.lemmas.forEach(function (L) {
        let atk = lemmaAttack(L)
        out.push('<div class="pp-ledger-row"><span class="mode">引理</span><span><b>' + esc(L.name) + '</b>'
          + '<span class="pp-quiet"> ' + L.req.map(esc).join('、') + ' → ' + esc(L.out) + '</span></span>'
          + (atk.length ? '<span class="sc mid" title="' + esc(atk[0].why) + '">怪兽咬 ' + atk[0].tags.join('/') + '</span>' : '<span class="sc ok">无已知反例</span>') + '</div>')
      })
      out.push('<div class="pp-quiet" style="margin-top:6px">对手测试（Lakatos 内建化）：存引理时怪兽馆自动攻击它的前提——被咬不等于错，是标注适用边界。</div>')
      out.push('</section>')
    }
    return out.join('')
  }

  /* ═══ 怪兽画廊（v2.5：反例素养博物馆）═══ */
  function galleryListHTML(S) {
    let list = galleryFilter(S.gq)
    let out = []
    out.push('<div class="pp-quiet" style="margin-bottom:8px">' + list.length + ' / ' + GALLERY.length + ' 怪物</div>')
    if (!list.length) {
      out.push('<div class="pp-quiet" style="padding:14px 4px">没有匹配的怪物——换个关键词，或清空搜索框看全馆。</div>')
      return out.join('')
    }
    list.forEach(function (g) {
      out.push('<div class="pp-monster">'
        + '<div class="pp-mhead"><b>' + esc(g.fn) + '</b><span class="pp-mlv">杀伤力 ' + '★'.repeat(g.level) + '☆'.repeat(4 - g.level) + '</span></div>'
        + '<div class="pp-mtags">' + g.tags.map(function (t) { return '<span class="pp-mtag">' + esc(t) + '</span>' }).join('') + '</div>'
        + '<div class="pp-mteaches">' + esc(g.teaches) + '</div></div>')
    })
    return out.join('')
  }
  function galleryHTML(ctx, S) {
    let out = []
    out.push('<section class="pp-card"><div class="pp-card-h"><b>怪兽画廊</b><em>Lakatos 的博物馆：十六个病理函数——每个都咬断过一条「显然」的前提</em></div>')
    /* 工具条与列表分离：搜索只换 .pp-glist，输入框节点原地不动（焦点不丢） */
    out.push('<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:12px">'
      + '<input class="pp-input" data-pp="gq" placeholder="搜函数名/标签/教训（如 Dirichlet、一致、震荡）" value="' + esc(S.gq) + '" style="max-width:320px"></div>')
    out.push('<div class="pp-glist">' + galleryListHTML(S) + '</div>')
    out.push('<div class="pp-quiet" style="margin-top:8px">标签 = 它咬断的前提；杀伤力 = 考研真题里它坑人的深度。在寻路板欠债、存引理时都会偶遇它们——先在这里认识，考场上才不会中招。</div>')
    out.push('</section>')
    return out.join('')
  }

  function ledgerHTML(ctx, S) {
    let h = habitsOf(S.sessions)
    let out = []
    /* 今日路径（v2.6 认知导师）：规则引擎排的交错练习计划，每步带透明理由 */
    let plan = nextPlan(S)
    if (plan.steps.length) {
      out.push('<section class="pp-card"><div class="pp-card-h"><b>今日路径</b><em>认知导师排课：SRS 到期 × 最弱桥 × 欠债模式 × 交错练习——约 ' + plan.totalMin + ' 分钟</em></div>')
      plan.steps.forEach(function (st, i) {
        let KIND_CN = { board: '寻路', trigger: '触发', audit: '关卡', variant: '变式' }
        out.push('<div class="pp-ledger-row"><span class="mode">' + (i + 1) + ' ' + (KIND_CN[st.kind] || st.kind) + '</span>'
          + '<span style="flex:1"><b style="font-size:12.5px">' + esc(st.why) + '</b><span class="pp-quiet"> · ' + st.min + ' 分钟</span></span>'
          + '<button class="pp-btn sm ghost" data-act="plan-go" data-view="' + st.view + '" data-ref="' + esc(st.ref || '') + '">开始</button></div>')
      })
      out.push('<div class="pp-quiet" style="margin-top:6px">排课原理（认知科学）：混合练习（interleaving）的长期保持优于集中刷同类——所以同类步骤永不相邻。</div>')
      out.push('</section>')
    }
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
      let MODE_CN = { board: '寻路', trigger: '触发', reasm: '拼图', audit: '关卡', monster: '怪兽', invent: '发明', calib: '校准', qgame: '博弈', necessity: '必要性', cegame: '反例博弈', editor: '内核证明', lemma: '引理' }
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
      out.push('<div class="pp-verdict">' + I('bulb') + '<div><b>处方</b>：' + esc(dg[0].name.indexOf('怪兽') >= 0 ? '去寻路板故意欠一次债，等伏击；或把怪兽馆整册翻完' : (dg[0].name.indexOf('除法') >= 0 ? '每次动除法/柯西前，先点「除法验证」桥卡——把它变肌肉' : (dg[0].name.indexOf('声明') >= 0 ? '把「性质声明」设为搭桥的固定第一步，15 分不白丢' : '触发速答按 SRS 会自动把弱桥排到你面前，每天一轮就够'))) + '。</div></div>')
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
    /* 母题谱系雷达（v2.8 / 讲义 25.11）：真题从不重复，母题永远重复——13 条主线分组战绩 */
    let ms = motherStats(S.sessions)
    let anyMother = ms.some(function (r) { return r.solved > 0 })
    out.push('<section class="pp-card"><div class="pp-card-h"><b>母题谱系雷达</b><em>一题生万题：每道真题都是这 13 条主线的变装出场——按母题查战绩</em></div>')
    ms.forEach(function (r) {
      let pct = r.total ? Math.round(100 * r.solved / r.total) : 0
      out.push('<div class="pp-mrow-g">'
        + '<span class="pp-mname" title="' + esc(r.m.skel) + '">' + CIRCLED[r.m.no - 1] + ' ' + esc(r.m.name) + '</span>'
        + '<span class="pp-quiet" style="min-width:96px;font-size:11px">' + esc(r.m.home) + ' → ' + esc(r.m.link) + '</span>'
        + '<div class="pp-mgbar"><i style="width:' + pct + '%"></i></div>'
        + '<span class="pp-mnum">' + r.solved + '/' + r.total + (r.avg != null ? ' · ' + r.avg : '') + '</span></div>')
    })
    if (anyMother) {
      let weakest = ms.filter(function (r) { return r.total > 0 }).sort(function (a, b) { return (a.solved / a.total) - (b.solved / b.total) })[0]
      if (weakest && weakest.solved < weakest.total) {
        out.push('<div class="pp-verdict" style="margin-top:8px">' + I('bulb') + '<div><b>谱系盲区</b>：' + CIRCLED[weakest.m.no - 1] + ' 「'
          + esc(weakest.m.name) + '」打通 ' + weakest.solved + '/' + weakest.total + '——触发词「' + esc(weakest.m.tr)
          + '」。骨架：' + esc(weakest.m.skel) + '</div></div>')
      }
    } else {
      out.push('<div class="pp-quiet" style="margin-top:6px">还没有寻路战绩——去寻路板打通任意一题，雷达就会按母题给你归队。每张寻路题卡顶部的金标就是它的母题号。</div>')
    }
    out.push('</section>')
    /* 考前二十条清单（v2.8 / 讲义 25.15）：D-1 只看这一页 */
    out.push('<section class="pp-card"><div class="pp-card-h"><b>考前二十条清单</b><em>「考场上的灵光一现，不过是清单第二十条的条件反射」</em></div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:2px 16px">')
    CHECKLIST.forEach(function (c, i) {
      out.push('<div style="display:flex;gap:8px;padding:4px 0;border-bottom:1px dashed color-mix(in srgb,var(--pp-line) 45%,transparent)">'
        + '<b style="color:var(--pp-gold);min-width:22px;text-align:right">' + (i < 9 ? '0' : '') + (i + 1) + '</b>'
        + '<span style="font-size:12.5px">' + esc(c) + '</span></div>')
    })
    out.push('</div><div class="pp-quiet" style="margin-top:8px">冲刺 D-1 晚只看本页 + 三大表 + 易错 20 例，早睡——讲义原话：二十条读三遍，胜过题海一晚上。</div></section>')
    /* 三大表数字卡 */
    out.push('<section class="pp-card"><div class="pp-card-h"><b>讲义三大表</b><em>触发表 · 构造表 · 决策表——寻路板的底层数据库，背穿它们</em></div>')
    TABLES.forEach(function (tb) {
      out.push('<div class="pp-tablecard"><table style="width:100%;border-collapse:collapse">'
        + '<tr><th colspan="3">' + esc(tb.name) + '<span style="float:right;font-weight:400">' + esc(tb.src) + '</span></th></tr>')
      tb.rows.forEach(function (r) {
        out.push('<tr><td style="width:38%">' + esc(r[0]) + '</td><td style="width:30%"><b>' + esc(r[1]) + '</b></td><td class="pp-quiet">' + esc(r[2]) + '</td></tr>')
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
    { k: 'editor', t: '编辑器', ic: 'pen', n: 'Fitch 结构化证明' },
    { k: 'trigger', t: '触发', ic: 'bolt', n: '触发表速答' },
    { k: 'reasm', t: '拼图', ic: 'puzzle', n: '证明重排' },
    { k: 'audit', t: '关卡', ic: 'shield', n: '军规排雷' },
    { k: 'gallery', t: '画廊', ic: 'book', n: '怪兽画廊' },
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
      ed: { steps: [], draft: null, name: '', auto: null, repaired: null, conj: null, learned: null, narr: null },
      lemmas: [],
      gq: '',
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
    /* 引理馆载入 + 编辑器在场恢复 */
    S.lemmas = lemmasGet(ctx)
    /* 变式题池重建（v2.6）：历史注册过的 fam+k 幂等重注入 */
    try {
      let saved = ctx.data('ppVars')
      if (Array.isArray(saved)) {
        saved.forEach(function (pair) {
          if (!Array.isArray(pair) || pair.length < 2) return
          let fam = null
          VARIANTS.forEach(function (x) { if (x.k === pair[0]) fam = x })
          if (!fam) return
          let vid = 'vr-' + fam.k + '-' + num(pair[1], 1)
          if (!BOARD_PROBLEMS.some(function (x) { return x.id === vid })) BOARD_PROBLEMS.push(makeVariant(fam, num(pair[1], 1)))
        })
      }
    } catch (e) { }
    try {
      let ke = ctx.keep.get(KEEP_ED, null)
      if (ke && ke.boardId && Array.isArray(ke.steps)) {
        S.boardId = ke.boardId
        S.ed.steps = ke.steps.filter(function (st) { return st && st.cite && Array.isArray(st.from) })
      }
    } catch (e) { }
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
      else if (S.view === 'editor') html = editorHTML(ctx, S)
      else if (S.view === 'trigger') html = triggerHTML(ctx, S)
      else if (S.view === 'reasm') html = reasmHTML(ctx, S)
      else if (S.view === 'audit') html = auditHTML(ctx, S)
      else if (S.view === 'gallery') html = galleryHTML(ctx, S)
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
      /* board 半程与 editor 半截证明分槽持久化：互相不覆盖（第一版 editor 早退
       * 吞掉 board 保存，被守门当场抓到） */
      try { ctx.keep.set(KEEP_RUN, S.path.length ? { boardId: S.boardId, path: S.path } : null) } catch (e) { }
      try { ctx.keep.set(KEEP_ED, S.ed.steps.length ? { boardId: S.boardId, steps: S.ed.steps } : null) } catch (e) { }
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
      /* ═══ 证明编辑器（内核 UI）动作组 ═══ */
      if (act === 'ed-pick') { S.boardId = a.getAttribute('data-id'); S.ed = { steps: [], draft: null, name: '', auto: null, repaired: null, conj: null, learned: null, narr: null }; try { ctx.keep.set(KEEP_ED, null) } catch (e0) { } paint(); return }
      if (act === 'ed-bridge') { S.ed.draft = { cite: a.getAttribute('data-k'), from: {} }; paint(); return }
      if (act === 'ed-from') {
        if (!S.ed.draft) return
        let t = a.getAttribute('data-t')
        S.ed.draft.from[t] = !S.ed.draft.from[t]
        paint(); return
      }
      if (act === 'ed-cancel') { S.ed.draft = null; paint(); return }
      if (act === 'ed-add') {
        if (!S.ed.draft) return
        let p2 = null
        BOARD_PROBLEMS.forEach(function (x) { if (x.id === S.boardId) p2 = x })
        if (!p2) p2 = BOARD_PROBLEMS[0]
        let st = { cite: S.ed.draft.cite, from: Object.keys(S.ed.draft.from).filter(function (k) { return S.ed.draft.from[k] }) }
        let trial = verifySteps(p2, S.ed.steps.concat([st]), allBridges(S.lemmas))
        if (trial.errors.length) { toast(trial.errors[0].msg, 'danger'); paint(); return }
        S.ed.steps.push(st)
        S.ed.draft = null
        try { ctx.keep.set(KEEP_ED, { boardId: S.boardId, steps: S.ed.steps }) } catch (e0) { }
        if (trial.reached) {
          commitSession('editor', 100, p2.title, { steps: S.ed.steps.length, best: p2.best, sig: chainSig(S.ed.steps.map(function (x) { return x.cite })), sk: skeletonOf(p2, S.ed.steps.map(function (x) { return x.cite })) })
          toast('内核核过：每一行都有出处。这就是可以写进答卷的证明。', 'success')
        } else {
          toast('第 ' + S.ed.steps.length + ' 行已落（' + trial.lines[trial.lines.length - 1].out + '）——继续', 'info')
        }
        paint(); return
      }
      if (act === 'ed-undo') {
        S.ed.steps.pop()
        try { ctx.keep.set(KEEP_ED, S.ed.steps.length ? { boardId: S.boardId, steps: S.ed.steps } : null) } catch (e0) { }
        paint(); return
      }
      if (act === 'ed-reset') { S.ed = { steps: [], draft: null, name: '', auto: null, repaired: null, conj: null, learned: null, narr: null }; try { ctx.keep.set(KEEP_ED, null) } catch (e0) { } paint(); return }
      if (act === 'ed-auto') {
        let p3 = null
        BOARD_PROBLEMS.forEach(function (x) { if (x.id === S.boardId) p3 = x })
        if (!p3) p3 = BOARD_PROBLEMS[0]
        S.ed.auto = autoProve(p3, allBridges(S.lemmas))
        paint(); return
      }
      if (act === 'ed-auto-close') { S.ed.auto = null; paint(); return }
      if (act === 'ed-repair') {
        /* 自动修复器：内核错误 → 最小修补序列（验证-修复循环） */
        let p5 = null
        BOARD_PROBLEMS.forEach(function (x) { if (x.id === S.boardId) p5 = x })
        if (!p5) p5 = BOARD_PROBLEMS[0]
        let rp = repairSteps(p5, S.ed.steps, allBridges(S.lemmas))
        if (rp.fixed) {
          S.ed.steps = rp.steps
          S.ed.repaired = rp
          try { ctx.keep.set(KEEP_ED, S.ed.steps.length ? { boardId: S.boardId, steps: S.ed.steps } : null) } catch (e0) { }
          toast('修复器：' + rp.msg, 'success')
        } else {
          S.ed.repaired = rp
          toast(rp.msg, 'warn')
        }
        paint(); return
      }
      if (act === 'ed-reason') {
        /* 反向链接求解器：目标驱动倒推，机器代笔整篇 Fitch 证明 */
        let p6 = null
        BOARD_PROBLEMS.forEach(function (x) { if (x.id === S.boardId) p6 = x })
        if (!p6) p6 = BOARD_PROBLEMS[0]
        let sol = solveBackward(p6, allBridges(S.lemmas))
        if (sol && sol.ok) {
          S.ed.steps = sol.steps.map(function (st) { return { cite: st.cite, from: st.from.slice() } })
          S.ed.draft = null
          S.ed.repaired = { fixed: true, msg: '反向链接已代笔整篇证明（' + sol.steps.length + ' 行，内核复验通过）——逐行读它的引用，然后自己重走一遍', action: 'reason' }
          try { ctx.keep.set(KEEP_ED, { boardId: S.boardId, steps: S.ed.steps }) } catch (e0) { }
          toast('目标倒推完成：' + sol.steps.length + ' 行证明已入编辑器', 'success')
        } else {
          toast('反向链接搜不到解——这题需要引理或人脑', 'warn')
        }
        paint(); return
      }
      if (act === 'ed-conj') {
        let p7 = null
        BOARD_PROBLEMS.forEach(function (x) { if (x.id === S.boardId) p7 = x })
        if (!p7) p7 = BOARD_PROBLEMS[0]
        let cj = conjecture(p7)
        if (cj) { S.ed.conj = cj; toast('直觉引擎：从结论形状猜到了构造族，CAS 已预裁决', 'info') }
        else toast('这题的结论不在构造族里——没有捷径可猜', 'warn')
        paint(); return
      }
      if (act === 'ed-conj-fill') {
        if (S.ed.conj) { S.inventStr = S.ed.conj.guess; S.ed.conj = null }
        paint(); return
      }
      if (act === 'ed-conj-clear') { S.ed.conj = null; paint(); return }
      if (act === 'ed-relearn') {
        /* 引理反哺：带着新引理重跑反向链接，机器变强当场可见 */
        let p8 = null
        BOARD_PROBLEMS.forEach(function (x) { if (x.id === S.boardId) p8 = x })
        if (!p8) p8 = BOARD_PROBLEMS[0]
        let sol2 = solveBackward(p8, allBridges(S.lemmas))
        let plain = solveBackward(p8, METHODS)
        if (sol2 && sol2.ok && plain && plain.ok) {
          S.ed.learned = '无引理时机器要 ' + plain.steps.length + ' 行，带引理库现在 ' + sol2.steps.length + ' 行——引理就是数学家的缓存。'
        } else if (sol2 && sol2.ok) {
          S.ed.learned = '带引理 ' + sol2.steps.length + ' 行解出。'
        }
        paint(); return
      }
      if (act === 'ed-narrate') {
        let p9 = null
        BOARD_PROBLEMS.forEach(function (x) { if (x.id === S.boardId) p9 = x })
        if (!p9) p9 = BOARD_PROBLEMS[0]
        if (S.ed.narr) { S.ed.narr = null; paint(); return }
        let nr = narrateProof(p9, S.ed.steps, allBridges(S.lemmas))
        if (!nr.ok) { toast(nr.msg, 'warn'); return }
        S.ed.narr = nr
        paint(); return
      }
      if (act === 'ed-sim-jump') {
        S.boardId = a.getAttribute('data-id')
        S.ed = { steps: [], draft: null, name: '', auto: null, repaired: null, conj: null, learned: null, narr: null }
        try { ctx.keep.set(KEEP_ED, null) } catch (e0) { }
        toast('已跳到相似题——对比它的结论指纹与你的证明骨架', 'info')
        paint(); return
      }
      if (act === 'ed-save-lemma') {
        let p4 = null
        BOARD_PROBLEMS.forEach(function (x) { if (x.id === S.boardId) p4 = x })
        if (!p4) p4 = BOARD_PROBLEMS[0]
        let v4 = verifySteps(p4, S.ed.steps, allBridges(S.lemmas))
        if (!v4.reached) return
        let L = normLemma({ id: 'lm' + Date.now().toString(36), name: (S.ed.name || '').trim() || (p4.title + '桥'), req: v4.usedConds, out: p4.goal, note: p4.ch, at: Date.now() })
        if (!L) { toast('引理前提为空——内核没记到用了哪些题设', 'warn'); return }
        S.lemmas = lemmasSave(ctx, S.lemmas.concat([L]))
        let atk = lemmaAttack(L)
        commitSession('lemma', atk.length ? 85 : 100, L.name, { right: 1, total: 1, miss: atk.map(function (x) { return x.tags.join('') }).join(',') })
        toast('引理「' + L.name + '」入列武器库' + (atk.length ? '——注意：怪兽馆咬得动它的前提（' + atk[0].tags.join('、') + '），边界条件要写清' : '——无已知反例可咬'), atk.length ? 'info' : 'success')
        S.ed.name = ''
        paint(); return
      }
      if (act === 'quick') {
        let p = BOARD_PROBLEMS[Math.floor(Math.random() * BOARD_PROBLEMS.length)]
        S.boardId = p.id; boardReset(); go('board'); if (S.view !== 'board') { S.view = 'board'; paint() } else paint()
        return
      }
      if (act === 'board-pick') { S.boardId = a.getAttribute('data-id'); boardReset(); paint(); return }
      if (act === 'var-drill') {        /* 变式注册进题池（幂等：同 fam+k 不重复生成） */
        let fk = a.getAttribute('data-fam'), kv = num(a.getAttribute('data-k'), 1)
        let fam = null
        VARIANTS.forEach(function (x) { if (x.k === fk) fam = x })
        if (!fam) return
        let vid = 'vr-' + fk + '-' + kv
        if (!BOARD_PROBLEMS.some(function (x) { return x.id === vid })) {
          BOARD_PROBLEMS.push(makeVariant(fam, kv))
          let saved = []
          try { saved = ctx.data('ppVars') } catch (e0) { }
          if (!Array.isArray(saved)) saved = []
          saved.push([fk, kv])
          try { ctx.data('ppVars', saved.slice(-12)) } catch (e0) { }
        }
        S.boardId = vid; boardReset(); paint()
        toast('变式「' + fam.name + ' k=' + kv + '」已入题池——去寻路板或编辑器练它', 'success')
        return
      }
      if (act === 'plan-go') {
        /* 路径跳转：带 ref 的切题+切视图，无 ref 的直接切视图 */
        let ref = a.getAttribute('data-ref')
        if (ref) { S.boardId = ref; boardReset() }
        go(a.getAttribute('data-view'))
        toast('按今日路径开始：' + (ref ? '目标题 ' + ref : '视图切换'), 'info')
        return
      }
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
      else if (f === 'edname') { S.ed.name = t.value.slice(0, 12) }
      else if (f === 'gq') {
        S.gq = String(t.value || '').slice(0, 30)
        let gl = root.querySelector('.pp-glist')
        if (gl) gl.innerHTML = galleryListHTML(S)
      }
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
      if (e.key >= '1' && e.key <= '7') { let v = VIEWS[num(e.key, 1) - 1]; if (v) { e.preventDefault(); go(v.k) } return }
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
      /* 编辑器在场保存：半截证明是用户的劳动，切页不丢 */
      try { ctx.keep.set(KEEP_ED, S.ed.steps.length ? { boardId: S.boardId, steps: S.ed.steps } : null) } catch (e) { }
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
          if (h.trigHit != null && h.trigHit < 60) {
            /* 宿主契约④：notify 只取第一参——先拼好整句字符串变量再传（拼接表达式会被棘轮当双参） */
            let nudge = '证明寻路者：触发命中率 ' + h.trigHit + '%——构造表七行还没背穿，去「触发」练一轮。'
            ctx.notify(nudge)
          }
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
          let MODE_CN = { board: '寻路', trigger: '触发', reasm: '拼图', audit: '关卡', monster: '怪兽', invent: '发明', calib: '校准', qgame: '博弈', necessity: '必要性', cegame: '反例博弈', editor: '内核证明', lemma: '引理' }
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
      verifySteps: verifySteps, autoProve: autoProve, allBridges: allBridges,
      lemmaAttack: lemmaAttack, normLemma: normLemma, lemmasGet: lemmasGet, lemmasSave: lemmasSave,
      solveBackward: solveBackward, repairSteps: repairSteps, conjecture: conjecture,
      narrateProof: narrateProof, structureSig: structureSig, similarProbs: similarProbs,
      GALLERY: GALLERY, galleryFilter: galleryFilter,
      VARIANTS: VARIANTS, makeVariant: makeVariant, variantMatrix: variantMatrix, nextPlan: nextPlan,
      MOTHERS: MOTHERS, CHECKLIST: CHECKLIST, motherStats: motherStats, motherChip: motherChip,
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
