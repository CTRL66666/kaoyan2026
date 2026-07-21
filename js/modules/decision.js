/* ============================================================
 * decision.js — 10月院校决策参谋
 * 决策逻辑（蓝图v2.0硬编码）：
 *  数学≥120 + 现控≥7 → 冲上海大学
 *  数学115-120 + 现控≥6 → 河北工业大学
 *  数学<115 或 现控<5 → 广东工业大学
 *  数学<100 → 红色警报
 * ============================================================ */
(function () {
  'use strict';

  function evaluate(inp) {
    const mathAvg = inp.mathSims.length ? U.avg(inp.mathSims) : null;
    const xk = +inp.xiankongScore || 0;
    if (mathAvg == null) return null;
    let rec, level, reason;
    if (mathAvg < 100) {
      rec = 'alert'; level = 'danger';
      reason = '数学一均分 <100：触发红色警报。建议立即评估是否更换目标或调整策略——当前节奏无法支撑任何目标院校，先止损再谈择校。';
    } else if (mathAvg >= 120 && xk >= 7) {
      rec = 'shu'; level = 'ok';
      reason = '数学≥120 + 现控自评≥7：具备冲上海大学的硬条件。上大836现控对口，复试微机与你的STM32经历高度匹配，上海大厂实习资源是职业目标的最优解。';
    } else if (mathAvg >= 115 && xk >= 6) {
      rec = 'hebut'; level = 'ok';
      reason = '数学115-120 + 现控≥6：建议河北工业大学。专业课给分大方、一志愿保护好，是"一志愿上岸拒绝二战"前提下的稳妥首选。';
    } else {
      rec = 'gdut'; level = 'warn';
      reason = '数学<115 或 现控<5：建议广东工业大学。控制学科A-、录取约275分、招生约120人，珠三角就业极强，是风险可控的优质退路。';
    }
    return { rec, level, reason, mathAvg: U.round1(mathAvg) };
  }

  function schoolRow(key, hl) {
    const sc = DB.SCHOOLS[key];
    return '<div class="sch-row' + (hl ? ' sch-hl' : '') + '">'
      + '<div class="sch-name">' + sc.name + (hl ? ' <span class="tag tag-red">推荐</span>' : '') + '</div>'
      + '<div class="sch-info">' + sc.code + '｜' + sc.exam + '</div>'
      + '<div class="sch-info">' + sc.reexam + '</div>'
      + '<div class="sch-info muted-sm">' + sc.line + '｜' + sc.ratio + '</div>'
      + '</div>';
  }

  function render(el) {
    const inp = Store.get().decision.inputs;
    const res = evaluate(inp);

    el.innerHTML =
      '<div class="card"><div class="card-title">⚖️ 10月院校决策参谋</div>'
      + '<div class="muted-sm">报名前的数据化决策工具。填入近5套数学模拟分，系统按固化规则给出建议。此建议不可手动覆盖——防止"我觉得我能行"式冲动。</div>'
      + '<div class="form-grid">'
      + '<label class="fld fld-full"><span>数学一近5套模拟分数（逗号分隔，必填）</span>'
      + '<input id="dc-sims" class="input" placeholder="如：118, 122, 115, 121, 119" value="' + U.esc(inp.mathSims.join(', ')) + '"></label>'
      + '<label class="fld"><span>专业课真题自测分（必填）</span><input id="dc-prof" class="input" type="number" value="' + inp.profScore + '"></label>'
      + '<label class="fld"><span>英语一阅读正确率（%）</span><input id="dc-eng" class="input" type="number" value="' + inp.engAccuracy + '"></label>'
      + '<label class="fld"><span>政治完成度（%）</span><input id="dc-pol" class="input" type="number" value="' + inp.polProgress + '"></label>'
      + '<label class="fld"><span>现控掌握度自评（1-10）</span><input id="dc-xk" class="input" type="number" min="1" max="10" value="' + inp.xiankongScore + '"></label>'
      + '</div>'
      + '<button class="btn btn-primary" id="dc-run">生成决策建议</button>'
      + '<div id="dc-result">' + (res ? resultHtml(res, inp) : '') + '</div>'
      + '</div>'

      + '<div class="card"><div class="card-title">院校对比决策表</div>'
      + schoolRow('hebut', res && res.rec === 'hebut')
      + schoolRow('shu', res && res.rec === 'shu')
      + schoolRow('gdut', res && res.rec === 'gdut')
      + schoolRow('hfut', res && res.rec === 'hfut')
      + schoolRow('futzu', res && res.rec === 'futzu')
      + '</div>';

    bind(el);
  }

  function resultHtml(res, inp) {
    const cls = res.level === 'danger' ? 'alert-danger' : res.level === 'warn' ? 'alert-warn' : 'alert-ok';
    const sc = DB.SCHOOLS[res.rec];
    return '<div class="alert ' + cls + '" style="margin-top:12px">'
      + '<b>' + (res.rec === 'alert' ? '🚨 红色警报' : '推荐：' + sc.name) + '</b>（数学均分 ' + res.mathAvg + '）<br>' + res.reason + '</div>'
      + (res.rec !== 'alert' ? '<button class="btn btn-primary" id="dc-confirm" style="margin-top:8px">将目标院校设为 ' + sc.name + '</button>' : '');
  }

  function collect(el) {
    const sims = el.querySelector('#dc-sims').value.split(/[,，\s]+/).map(Number).filter(n => !isNaN(n) && n > 0);
    return {
      mathSims: sims,
      profScore: el.querySelector('#dc-prof').value,
      engAccuracy: el.querySelector('#dc-eng').value,
      polProgress: +el.querySelector('#dc-pol').value || 0,
      xiankongScore: +el.querySelector('#dc-xk').value || 5
    };
  }

  function bind(el) {
    el.querySelector('#dc-run').onclick = () => {
      const inp = collect(el);
      if (!inp.mathSims.length) { Toast.warn('请至少填入一套数学模拟分数'); return; }
      const res = evaluate(inp);
      Store.update(s => { s.decision.inputs = inp; s.decision.result = res; s.decision.updatedAt = new Date().toISOString(); });
      render(el);
      const confirmBtn = document.getElementById('dc-confirm');
      if (confirmBtn) confirmBtn.onclick = () => {
        const rec = Store.get().decision.result.rec;
        Store.update(s => { s.settings.targetSchool = rec; });
        Toast.success('目标院校已设为 ' + DB.SCHOOLS[rec].name);
        App.refresh();
      };
    };
  }

  window.DecisionModule = { render, evaluate };
})();
