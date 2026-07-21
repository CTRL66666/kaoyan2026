/* ============================================================
 * heatmap.js — 考点热力图 + 130分能力分层训练
 * 绿=掌握 黄=薄弱 红=危险；点击格子录入掌握度并可生成针对任务
 * 分层规则：必拿层正确率<90% → 提示先补必拿层（弱锁定）
 * ============================================================ */
(function () {
  'use strict';
  let subjTab = 'math';

  function tierStats(list, heat) {
    const byTier = { 1: [], 2: [], 3: [] };
    list.forEach(t => byTier[t.tier].push(t));
    const out = {};
    [1, 2, 3].forEach(tier => {
      const items = byTier[tier];
      const scored = items.filter(t => heat[t.id] && heat[t.id].score != null);
      out[tier] = {
        total: items.length,
        mastered: items.filter(t => heat[t.id] && heat[t.id].level === 2).length,
        avg: scored.length ? Math.round(U.avg(scored.map(t => heat[t.id].score))) : null
      };
    });
    return out;
  }

  function cell(t, heat, tierLocked) {
    const h = heat[t.id] || {};
    const lv = h.level || 0;
    const cls = lv === 2 ? 'hm-green' : lv === 1 ? 'hm-yellow' : 'hm-red';
    const scoreTxt = h.score != null ? h.score + '%' : '未测';
    return '<button class="hm-cell ' + cls + (tierLocked ? ' hm-locked' : '') + '" data-id="' + t.id + '" title="' + U.esc(t.group + ' · ' + t.name) + '：' + scoreTxt + '">'
      + '<span class="hm-name">' + U.esc(t.name) + '</span>'
      + '<span class="hm-score">' + scoreTxt + '</span>'
      + '</button>';
  }

  function render(el) {
    const s = Store.get();
    const heat = s.heat;
    const list = DB.TOPICS[subjTab];
    const ts = tierStats(list, heat);
    // 必拿层弱锁定：必拿层平均<90 → 拔高/冲刺层提示先补基础
    const tier1Weak = ts[1].avg != null && ts[1].avg < 90;
    const tier1Untested = ts[1].avg == null;

    let tierCards = '';
    [1, 2, 3].forEach(tier => {
      const meta = DB.TIERS[tier];
      const st = ts[tier];
      tierCards += '<div class="tier-card" style="border-top-color:' + meta.color + '">'
        + '<div class="tier-head">' + meta.icon + ' ' + meta.name + ' <span class="muted-sm">' + meta.range + '</span></div>'
        + '<div class="tier-nums">' + st.mastered + '/' + st.total + ' 掌握' + (st.avg != null ? ' · 平均 ' + st.avg + '%' : ' · 未测评') + '</div>'
        + '<div class="muted-sm">' + meta.rule + '</div>'
        + '</div>';
    });

    let groups = '';
    const groupNames = [];
    list.forEach(t => { if (groupNames.indexOf(t.group) < 0) groupNames.push(t.group); });
    groupNames.forEach(g => {
      const items = list.filter(t => t.group === g);
      groups += '<div class="hm-group"><div class="hm-group-name">' + U.esc(g) + '</div><div class="hm-grid">'
        + items.map(t => cell(t, heat, false)).join('') + '</div></div>';
    });

    el.innerHTML =
      '<div class="card"><div class="card-title">🎯 考点热力图与真题切片追踪</div>'
      + '<div class="tab-row">'
      + '<button class="tab' + (subjTab === 'math' ? ' tab-on' : '') + '" data-t="math">数学一（19考点）</button>'
      + '<button class="tab' + (subjTab === 'ctrl' ? ' tab-on' : '') + '" data-t="ctrl">自控（11考点）</button>'
      + '</div>'
      + '<div class="legend"><span class="lg lg-green"></span>掌握(≥80%) <span class="lg lg-yellow"></span>薄弱(50-79%) <span class="lg lg-red"></span>危险(&lt;50%或未测) <span class="muted-sm">点击格子录入/更新掌握度</span></div>'
      + '</div>'

      + '<div class="tier-row">' + tierCards + '</div>'
      + (tier1Weak ? '<div class="alert alert-danger">🔒 必拿层平均 ' + ts[1].avg + '% < 90%：按规则应暂停拔高/冲刺层新题，先把必拿层补到零失误。错一题罚5道同类题。</div>' : '')
      + (tier1Untested ? '<div class="alert alert-warn">必拿层尚未测评：建议先用步骤审查器做3道必拿层题目，录入掌握度后再解锁拔高层。</div>' : '')

      + '<div class="card">' + groups + '</div>'

      + '<div class="card"><div class="card-title">层级跃迁报告（本周）</div><div class="muted-sm" id="hm-week"></div></div>';

    // 周跃迁统计
    const weekAgo = Date.now() - 7 * U.DAY_MS;
    const updated = Object.keys(heat).filter(id => heat[id].updatedAt && new Date(heat[id].updatedAt).getTime() > weekAgo);
    document.getElementById('hm-week').textContent = updated.length
      ? '本周更新了 ' + updated.length + ' 个考点的掌握度：' + updated.map(id => { const t = (DB.TOPICS.math.concat(DB.TOPICS.ctrl)).find(x => x.id === id); return t ? t.name : id; }).join('、')
      : '本周尚未更新任何考点。做题后记得回来点格子。';

    bind(el);
  }

  function bind(el) {
    el.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { subjTab = b.getAttribute('data-t'); render(el); });

    el.querySelectorAll('.hm-cell').forEach(c => {
      c.onclick = () => {
        const id = c.getAttribute('data-id');
        const topic = (DB.TOPICS.math.concat(DB.TOPICS.ctrl)).find(t => t.id === id);
        const heat = Store.get().heat;
        const h = heat[id] || {};
        const meta = DB.TIERS[topic.tier];
        Modal.open({
          title: topic.group + ' · ' + topic.name + '（' + meta.icon + meta.name + '）',
          html:
            '<div class="form-grid">'
            + '<label class="fld"><span>自测正确率（%，近10题）</span><input id="hm-in-score" class="input" type="number" min="0" max="100" value="' + (h.score != null ? h.score : '') + '"></label>'
            + '<label class="fld"><span>掌握状态</span><select id="hm-in-level" class="input input-sel">'
            + '<option value="0"' + (h.level === 0 ? ' selected' : '') + '>🔴 危险</option>'
            + '<option value="1"' + (h.level === 1 ? ' selected' : '') + '>🟡 薄弱</option>'
            + '<option value="2"' + (h.level === 2 ? ' selected' : '') + '>🟢 掌握</option>'
            + '</select></label></div>'
            + '<div class="muted-sm">保存正确率后系统将自动判定状态：≥80绿 / 50-79黄 / &lt;50红</div>',
          actions: [
            { label: '取消' },
            {
              label: '生成针对训练任务', kind: 'btn-ghost', onClick: close => {
                Store.update(s => {
                  s.mistakeDrills.push({ id: U.uid(), source: 'topic', refId: id, title: '【' + topic.name + '】针对训练3题（热力图生成）', subject: subjTab === 'math' ? 'math' : 'ctrl', status: 'pending', createdAt: new Date().toISOString() });
                });
                close(); Toast.success('已加入错题重练队列'); App.refresh();
              }
            },
            {
              label: '保存', kind: 'btn-primary', onClick: close => {
                const score = parseFloat(document.getElementById('hm-in-score').value);
                const level = parseInt(document.getElementById('hm-in-level').value, 10);
                Store.update(s => {
                  const autoLevel = !isNaN(score) ? (score >= 80 ? 2 : score >= 50 ? 1 : 0) : level;
                  s.heat[id] = { level: autoLevel, score: isNaN(score) ? null : score, updatedAt: new Date().toISOString() };
                  // 必拿层惩罚规则：必拿层考点录入<90 → 生成罚练
                  if (topic.tier === 1 && !isNaN(score) && score < 90) {
                    for (let i = 0; i < 5; i++) {
                      s.mistakeDrills.push({ id: U.uid(), source: 'topic', refId: id, title: '【罚练】' + topic.name + ' 同类题 ' + (i + 1) + '/5', subject: subjTab === 'math' ? 'math' : 'ctrl', status: 'pending', penaltyOf: id, createdAt: new Date().toISOString() });
                    }
                    Toast.warn('必拿层正确率<90%：按规则罚5道同类题，已加入重练队列');
                  }
                });
                close(); App.refresh();
              }
            }
          ]
        });
        setTimeout(() => { const i = document.getElementById('hm-in-score'); if (i) i.focus(); }, 50);
      };
    });
  }

  window.HeatmapModule = { render };
})();
