/* ============================================================
 * tex.js — 极简 LaTeX → HTML 渲染器（零依赖，离线）
 * 只覆盖考研数学/自控常用命令，不是完整 KaTeX。
 * 用法：Tex.render('\\lim_{x \\to 0} \\frac{x-\\sin x}{x^3}')
 *      或 Tex.renderInline('求 $\\frac{a}{b}$ 的值')（自动识别 $..$ 段）
 * 安全：先 HTML 转义再替换，注入免疫。
 * ============================================================ */
(function () {
  'use strict';

  // 常用符号映射
  const GREEK = {
    alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', zeta: 'ζ',
    eta: 'η', theta: 'θ', iota: 'ι', kappa: 'κ', lambda: 'λ', mu: 'μ',
    nu: 'ν', xi: 'ξ', pi: 'π', rho: 'ρ', sigma: 'σ', tau: 'τ',
    upsilon: 'υ', phi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
    Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ',
    Pi: 'Π', Sigma: 'Σ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω'
  };
  const SYMBOL = {
    to: '→', rightarrow: '→', leftarrow: '←', infty: '∞', pm: '±', mp: '∓',
    times: '×', div: '÷', cdot: '·', leq: '≤', geq: '≥', neq: '≠',
    approx: '≈', equiv: '≡', propto: '∝', partial: '∂', nabla: '∇',
    sum: '∑', prod: '∏', int: '∫', iint: '∬', iiint: '∭', oint: '∮',
    sqrt: '√', in: '∈', notin: '∉', subset: '⊂', supset: '⊃',
    cup: '∪', cap: '∩', forall: '∀', exists: '∃', emptyset: '∅',
    ldots: '…', cdots: '⋯', degree: '°', angle: '∠', perp: '⊥', parallel: '∥'
  };
  // 函数名单词（保持正体）
  const FUNC = ['sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'arcsin', 'arccos', 'arctan',
    'sinh', 'cosh', 'tanh', 'ln', 'log', 'lg', 'exp', 'lim', 'max', 'min', 'sup', 'inf',
    'det', 'rank', 'tr', 'diag', 'grad', 'div', 'curl'];

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  // 读取一个 {...} 组，返回 [内容, 消耗长度]
  function readGroup(s, i) {
    if (s[i] !== '{') return [s[i] || '', 1];
    let d = 0, j = i;
    for (; j < s.length; j++) {
      if (s[j] === '{') d++;
      else if (s[j] === '}') { d--; if (d === 0) break; }
    }
    return [s.slice(i + 1, j), j - i + 1];
  }

  // 递归渲染一段（不含外层 $）
  function seg(input) {
    let s = input, out = '', i = 0;
    while (i < s.length) {
      const c = s[i];
      // 反斜杠命令
      if (c === '\\') {
        const m = s.slice(i).match(/^\\([a-zA-Z]+|.)/);
        if (!m) { i++; continue; }
        const cmd = m[1];
        // \frac{a}{b} —— 真分式横线
        if (cmd === 'frac' || cmd === 'dfrac' || cmd === 'tfrac') {
          const g1 = readGroup(s, i + m[0].length);
          const g2 = readGroup(s, i + m[0].length + g1[1]);
          out += '<span class="tx-frac"><span class="tx-num">' + seg(g1[0]) + '</span><span class="tx-den">' + seg(g2[0]) + '</span></span>';
          i += m[0].length + g1[1] + g2[1]; continue;
        }
        // \sqrt{a} / \sqrt[n]{a}
        if (cmd === 'sqrt') {
          let k = i + m[0].length, idx = '';
          if (s[k] === '[') { const e = s.indexOf(']', k); idx = s.slice(k + 1, e); k = e + 1; }
          const g = readGroup(s, k);
          out += '<span class="tx-sqrt">' + (idx ? '<sup class="tx-idx">' + seg(idx) + '</sup>' : '') + '√<span class="tx-radic">' + seg(g[0]) + '</span></span>';
          i = k + g[1]; continue;
        }
        // 希腊字母 / 符号
        if (GREEK[cmd]) { out += '<i>' + GREEK[cmd] + '</i>'; i += m[0].length; continue; }
        if (SYMBOL[cmd]) { out += SYMBOL[cmd]; i += m[0].length; continue; }
        if (FUNC.indexOf(cmd) >= 0) { out += '<span class="tx-fn">' + cmd + '</span>'; i += m[0].length; continue; }
        if (cmd === ' ' || cmd === ',' || cmd === ';' || cmd === '!') { out += ' '; i += m[0].length; continue; }
        if (cmd === 'left' || cmd === 'right' || cmd === 'big' || cmd === 'Big') { i += m[0].length; continue; } // 丢弃尺寸命令
        if (cmd === 'text' || cmd === 'mathrm' || cmd === 'mathbf') { const g = readGroup(s, i + m[0].length); out += '<span>' + esc(g[0]) + '</span>'; i += m[0].length + g[1]; continue; }
        if (cmd === 'overline' || cmd === 'bar' || cmd === 'vec' || cmd === 'hat' || cmd === 'dot') { const g = readGroup(s, i + m[0].length); out += '<span class="tx-over">' + seg(g[0]) + '</span>'; i += m[0].length + g[1]; continue; }
        // 未知命令：原样输出名字
        out += esc(cmd); i += m[0].length; continue;
      }
      // 上标 ^ 或 ^{..}
      if (c === '^') {
        const g = readGroup(s, i + 1);
        out += '<sup>' + seg(g[0]) + '</sup>';
        i += 1 + g[1]; continue;
      }
      // 下标 _ 或 _{..}
      if (c === '_') {
        const g = readGroup(s, i + 1);
        out += '<sub>' + seg(g[0]) + '</sub>';
        i += 1 + g[1]; continue;
      }
      // 分组 {...}（去掉花括号，保留内容）
      if (c === '{') {
        const g = readGroup(s, i);
        out += seg(g[0]); i += g[1]; continue;
      }
      // 普通字符
      out += esc(c); i++;
    }
    return out;
  }

  // 简写智能识别：把 AI 常用的简写记法转成标准LaTeX，再渲染
  //  [A] / B      → \frac{A}{B}
  //  (A) / (B)    → \frac{(A)}{(B)}
  //  lim(x->0)    → \lim_{x \to 0}
  //  ln(1+x)      → \ln(1+x)  (函数名正体化)
  // 找匹配的右括号（配平扫描），返回闭合位置索引，找不到返回-1
  function matchClose(s, openIdx, openCh, closeCh) {
    let d = 0;
    for (let i = openIdx; i < s.length; i++) {
      if (s[i] === openCh) d++;
      else if (s[i] === closeCh) { d--; if (d === 0) return i; }
    }
    return -1;
  }

  // 把一个形如 "[...] 或 (...) 开头，后接 / 分母" 的串转 \frac
  // 用配平扫描正确取分子分母（支持嵌套），返回转换后的串
  function fracScan(s) {
    let r = '', i = 0;
    while (i < s.length) {
      const c = s[i];
      // 分子候选：[ 或 (
      if (c === '[' || c === '(') {
        const openCh = c, closeCh = c === '[' ? ']' : ')';
        const closeIdx = matchClose(s, i, openCh, closeCh);
        if (closeIdx > 0) {
          // 看闭合后是否紧跟 空白 + /
          let j = closeIdx + 1;
          while (j < s.length && s[j] === ' ') j++;
          if (s[j] === '/') {
            const num = s.slice(i + 1, closeIdx);
            // 简单分数保护：(数字/数字 或 -数字/数字 或 字母/数字) 保持斜线，不转分式
            // 例如 (-1/2 A*) 里的 (-1/2 不应被当成 分子(-1)/分母(2)
            const afterSlash = s.slice(j + 1);
            const simpleNum = /^-?\d+$|^[a-zA-Z]$/.test(num.trim());
            if (simpleNum && /^\s*\d/.test(afterSlash)) {
              r += c; i++; continue; // 跳过分式转换，原样输出
            }
            // 取分母：紧跟的 (...) / [...] / 简单token
            let k = j + 1;
            while (k < s.length && s[k] === ' ') k++;
            let den = '', denEnd = k;
            if (s[k] === '(' || s[k] === '[') {
              const dc = matchClose(s, k, s[k], s[k] === '(' ? ')' : ']');
              if (dc > 0) { den = s.slice(k + 1, dc); denEnd = dc + 1; }
              else { den = s.slice(k); denEnd = s.length; }
            } else {
              // 简单token：字母数字^+-*（遇到空格/括号停）
              const m = s.slice(k).match(/^[a-zA-Z0-9\^\+\-\*\.]+/);
              den = m ? m[0] : s[k]; denEnd = k + den.length;
            }
            // 分子需含运算符/函数才转（避免误伤 f(x)/2）
            if (/[\+\-\*\^]|sin|cos|tan|ln|exp/.test(num)) {
              r += '\\frac{' + num + '}{' + den + '}';
              i = denEnd; continue;
            }
          }
        }
      }
      r += c; i++;
    }
    return r;
  }

  function normalizeShorthand(s) {
    let r = String(s);
    // lim(x->0) / lim(x→0) / lim_{x->0} → \lim_{x \to 0}
    r = r.replace(/lim\s*\(\s*([a-zA-Z])\s*(?:->|→)\s*([^\)]+)\)/g, '\\lim_{$1 \\to $2}');
    r = r.replace(/lim_?\{?\s*([a-zA-Z])\s*(?:->|→)\s*([^\}\s]+)\}?/g, '\\lim_{$1 \\to $2}');
    // 函数名正体化
    r = r.replace(/(^|[^\\a-zA-Z])(ln|sin|cos|tan|cot|sec|csc|lim|log|lg|exp|max|min)\s*\(/g, '$1\\$2(');
    // 分式：配平扫描（支持嵌套与外层[...]包裹），做两轮处理嵌套
    for (let k = 0; k < 3; k++) {
      const before = r;
      r = fracScan(r);
      if (r === before) break;
    }
    return r;
  }

  const Tex = {
    // 整段都是公式（可能带 $ 包裹）
    render(str) {
      if (str == null) return '';
      let s = String(str).trim();
      const m = s.match(/^\$+([\s\S]+?)\$+$/);
      if (m) s = m[1];
      s = normalizeShorthand(s);
      return '<span class="tx">' + seg(s) + '</span>';
    },
    // 文本里混着 $..$ 公式：文本转义 + 公式渲染
    renderInline(str) {
      if (str == null) return '';
      const D = String.fromCharCode(36); // 美元符号：用charCode避免源码字面量被shell展开
      const s = String(str);
      // 无 $ 包裹但含公式特征 → 整段按公式渲染（AI常返回裸公式题干）
      const looksMath = /(\\[a-zA-Z]+|->|→|\^|_|\[[^\]]+\]\s*\/|\)\s*\/\s*[\(a-zA-Z]|lim\s*[\(]|ln\s*\(|sin\s*\(|cos\s*\(|tan\s*\()/.test(s);
      if (s.indexOf(D) < 0 && looksMath) {
        return '<span class="tx">' + seg(normalizeShorthand(s)) + '</span>';
      }
      const parts = s.split(/(\$[^$]+\$)/g);
      return parts.map(p => {
        if (p.length > 1 && p[0] === D && p[p.length - 1] === D) return Tex.render(p);
        // 非公式段也可能夹带简写公式，做一次轻量识别
        if (looksMath && /->|→|\^|\[\S+\]\s*\//.test(p)) return '<span class="tx">' + seg(normalizeShorthand(p)) + '</span>';
        return esc(p).replace(/\n/g, '<br>');
      }).join('');
    }
  };

  window.Tex = Tex;
})();
