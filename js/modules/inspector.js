/* ============================================================
 * inspector.js — 数学计算步骤审查器（Step Inspector）
 * 结构化步骤输入 + 规则级检查（负号后置/分式漏分母/未求导验证）
 * 输出 1-10 风险评分，高风险(≥7)自动加入错题本
 * ============================================================ */
(function () {
  'use strict';
  let curType = 'integral';
  let stepInputs = [];
  let checkState = {};

  // 规则级文本检查
  function analyze(texts) {
    const flags = [];
    texts.forEach((t, i) => {
      if (!t) return;
      // 负号后置/双写：如 "3 - -2" 或行尾裸露负号
      if (/-\s*-|-\s*$/.test(t)) {
        flags.push({ step: i + 1, type: 'sign', msg: '第' + (i + 1) + '步检测到疑似后置/双写负号，请立即前置处理' });
      }
      // 分式漏分母：出现 a/b 但全文无"分母/通分"字样
      if (/\d\s*\/\s*\d/.test(t) && texts[i + 1] && !/分母|通分|公分母/.test(texts[i + 1])) {
        flags.push({ step: i + 2, type: 'fraction', msg: '第' + (i + 2) + '步疑似分式未带分母，请用三步法（分母→分子→计算）核对' });
      }
      // 跳步痕迹：单步文本过长
      if (t.length > 60) flags.push({ step: i + 1, type: 'careless', msg: '第' + (i + 1) + '步内容过长，疑似跳步，建议拆开重写' });
    });
    return flags;
  }

  function riskScore(flags, checks) {
    let score = 1;
    flags.forEach(f => { score += f.type === 'sign' ? 2.5 : f.type === 'fraction' ? 2.5 : 1; });
    Object.keys(checks).forEach(k => { if (!checks[k]) score += 1.5; });
    return U.clamp(Math.round(score), 1, 10);
  }

  function render(el) {
    const tpl = DB.INSPECTOR_TYPES[curType];
    stepInputs = tpl.steps.map(() => '');
    checkState = {};
    tpl.checks.forEach(c => checkState[c.key] = false);

    el.innerHTML =
      '<div class="card"><div class="card-title">✍️ 数学计算步骤审查器</div>'
      + '<div class="muted-sm">结构化步骤输入，专治符号错误 / 分式漏分母 / 积分因子符号反。每步必填，系统做规则级检查。</div>'
      + '<div class="tab-row">'
      + Object.keys(DB.INSPECTOR_TYPES).map(k => '<button class="tab' + (curType === k ? ' tab-on' : '') + '" data-t="' + k + '">' + DB.INSPECTOR_TYPES[k].name + '</button>').join('')
      + '</div>'
      + '<div id="insp-steps">'
      + tpl.steps.map((st, i) =>
        '<div class="step-row"><div class="step-head"><span class="step-no">' + (i + 1) + '</span><b>' + U.esc(st.name) + '</b></div>'
        + '<div class="muted-sm">' + U.esc(st.hint) + '</div>'
        + '<textarea class="input step-in" data-i="' + i + '" rows="2" placeholder="写下这一步的中间结果（必填）"></textarea></div>'
      ).join('')
      + '</div>'
      + '<div class="card-inner"><div class="card-title-sm">强制验证项</div>'
      + tpl.checks.map(c =>
        '<label class="check-row"><input type="checkbox" data-chk="' + c.key + '"><span class="box"></span>'
        + '<span><b>' + U.esc(c.label) + '</b> — ' + U.esc(c.desc) + '</span></label>'
      ).join('')
      + '</div>'
      + '<button class="btn btn-primary btn-block" id="insp-run">执行审查</button>'
      + '<div id="insp-result"></div>'
      + '</div>'

      + historyHtml();

    bind(el);
  }

  function historyHtml() {
    const runs = U.clone(Store.get().inspector.runs).reverse().slice(0, 8);
    if (!runs.length) return '';
    return '<div class="card"><div class="card-title">审查历史</div>'
      + runs.map(r => '<div class="his-row"><span>' + (DB.INSPECTOR_TYPES[r.type] || {}).name + ' · ' + r.date + '</span>'
        + '<span class="risk-' + (r.risk >= 7 ? 'high' : r.risk >= 4 ? 'mid' : 'low') + '">风险 ' + r.risk + '/10</span></div>').join('')
      + '</div>';
  }

  function bind(el) {
    el.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { curType = b.getAttribute('data-t'); render(el); });
    el.querySelectorAll('.step-in').forEach(t => t.oninput = () => { stepInputs[+t.getAttribute('data-i')] = t.value; });
    el.querySelectorAll('[data-chk]').forEach(cb => cb.onchange = () => { checkState[cb.getAttribute('data-chk')] = cb.checked; });

    el.querySelector('#insp-run').onclick = () => {
      const tpl = DB.INSPECTOR_TYPES[curType];
      const emptyIdx = stepInputs.findIndex((v) => !v.trim());
      if (emptyIdx >= 0) { Toast.warn('第 ' + (emptyIdx + 1) + ' 步「' + tpl.steps[emptyIdx].name + '」未填写。步骤化就是为了防止跳步，请补全。'); return; }

      const flags = analyze(stepInputs);
      const risk = riskScore(flags, checkState);

      let html = '<div class="risk-card risk-bg-' + (risk >= 7 ? 'high' : risk >= 4 ? 'mid' : 'low') + '">'
        + '<div class="risk-score">' + risk + '<span class="risk-max">/10</span></div>'
        + '<div class="risk-label">' + (risk >= 7 ? '🔴 高风险：建议重做并加入错题本' : risk >= 4 ? '🟡 中风险：复核标记步骤' : '🟢 低风险：流程规范') + '</div></div>';
      if (flags.length) {
        html += '<div class="flag-list">' + flags.map(f => '<div class="flag-row flag-' + f.type + '">⚠️ ' + U.esc(f.msg) + '</div>').join('') + '</div>';
      } else {
        html += '<div class="muted-sm" style="margin-top:8px">未检测到规则级错误模式。</div>';
      }
      const unchecked = Object.keys(checkState).filter(k => !checkState[k]);
      if (unchecked.length) {
        html += '<div class="alert alert-warn" style="margin-top:8px">未完成的强制验证：' + unchecked.map(k => { const c = tpl.checks.find(x => x.key === k); return c ? c.label : k; }).join('、') + '</div>';
      }
      document.getElementById('insp-result').innerHTML = html;

      Store.update(s => {
        s.inspector.runs.push({ id: U.uid(), date: U.shortDate(), type: curType, risk, flags: flags.map(f => f.msg) });
        if (s.inspector.runs.length > 100) s.inspector.runs = s.inspector.runs.slice(-100);
        if (risk >= 7) {
          s.mistakes.push({
            id: U.uid(), subject: 'math', type: flags[0] ? flags[0].type : 'careless',
            desc: '【步骤审查高风险' + risk + '/10】' + tpl.name + '：' + (flags[0] ? flags[0].msg : '强制验证未通过'),
            date: U.shortDate(), createdAt: new Date().toISOString()
          });
          Toast.danger('风险≥7：已自动记入错题本');
        } else {
          Toast.success('审查完成，风险 ' + risk + '/10');
        }
      });
    };
  }

  window.InspectorModule = { render };
})();
