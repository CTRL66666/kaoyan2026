/* ============================================================
 * conceptmap.js — 自控概念依赖图谱（技能树 + 锁定机制 + 术语桥）
 * 锁定规则：前置节点掌握度<60% → 后继节点锁定，无法添加相关任务
 * ============================================================ */
(function () {
  'use strict';

  function nodeState(n) {
    const heat = Store.get().heat;
    const h = heat[n.id] || {};
    const score = h.score;
    const mastered = (score != null ? score : (h.level === 2 ? 80 : h.level === 1 ? 55 : 0));
    // 锁定判定：任一前置<60
    const lockBy = n.deps.filter(d => {
      const dh = heat[d] || {};
      const ds = dh.score != null ? dh.score : (dh.level === 2 ? 80 : dh.level === 1 ? 55 : 0);
      return ds < 60;
    });
    return { score, mastered, locked: lockBy.length > 0, lockBy };
  }

  function render(el) {
    const nodes = DB.CONCEPT_GRAPH;
    const byId = {}; nodes.forEach(n => byId[n.id] = n);

    // SVG 连线
    let edges = '';
    nodes.forEach(n => n.deps.forEach(d => {
      const p = byId[d];
      const locked = nodeState(n).locked;
      edges += '<line x1="' + (p.x + 70) + '" y1="' + (p.y + 22) + '" x2="' + (n.x) + '" y2="' + (n.y + 22)
        + '" stroke="' + (locked ? '#d9d9d9' : '#8c8c8c') + '" stroke-width="1.5" marker-end="url(#arr)"/>';
    }));

    let svgNodes = '';
    nodes.forEach(n => {
      const st = nodeState(n);
      const color = st.locked ? '#bfbfbf' : st.mastered >= 80 ? '#237804' : st.mastered >= 50 ? '#d48806' : '#cf1322';
      svgNodes += '<g class="cm-node" data-id="' + n.id + '" style="cursor:pointer">'
        + '<rect x="' + n.x + '" y="' + n.y + '" width="150" height="44" rx="8" fill="#fff" stroke="' + color + '" stroke-width="2"/>'
        + '<text x="' + (n.x + 75) + '" y="' + (n.y + 20) + '" text-anchor="middle" font-size="12" fill="#262626">' + (st.locked ? '🔒 ' : '') + U.esc(n.name) + '</text>'
        + '<text x="' + (n.x + 75) + '" y="' + (n.y + 36) + '" text-anchor="middle" font-size="11" fill="' + color + '">' + (st.locked ? '未解锁' : st.mastered + '%') + '</text>'
        + '</g>';
    });

    el.innerHTML =
      '<div class="card"><div class="card-title">🗺️ 自控概念依赖图谱</div>'
      + '<div class="muted-sm">前置节点掌握度 &lt; 60% → 后继节点锁定。点击节点查看推荐任务与「工程↔学术」术语桥。左列经典控制，右列现代控制。</div>'
      + '<div class="cm-scroll"><svg viewBox="0 0 780 470" width="100%" height="470" xmlns="http://www.w3.org/2000/svg">'
      + '<defs><marker id="arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="#8c8c8c"/></marker></defs>'
      + edges + svgNodes
      + '</svg></div>'
      + '<div class="legend"><span class="lg lg-green"></span>≥80 掌握 <span class="lg lg-yellow"></span>50-79 薄弱 <span class="lg lg-red"></span>&lt;50 危险 <span class="lg" style="background:#bfbfbf"></span>🔒 锁定</div>'
      + '</div>'

      + '<div class="card" id="cm-detail"><div class="card-title">节点详情</div><div class="empty">点击上方节点查看依赖、推荐任务与术语桥</div></div>';

    bind(el);
  }

  function bind(el) {
    el.querySelectorAll('.cm-node').forEach(g => {
      g.addEventListener('click', () => {
        const id = g.getAttribute('data-id');
        const n = DB.CONCEPT_GRAPH.find(x => x.id === id);
        const st = nodeState(n);
        const heat = Store.get().heat;
        const byId = {}; DB.CONCEPT_GRAPH.forEach(x => byId[x.id] = x);
        const lockNames = st.lockBy.map(d => byId[d].name).join('、');

        let gloss = n.glossary.map(g2 =>
          '<div class="gloss-row"><span class="gloss-eng">' + U.esc(g2[0]) + '</span><span class="gloss-arrow">↔</span><span>' + U.esc(g2[1]) + '</span></div>'
        ).join('');

        document.getElementById('cm-detail').innerHTML =
          '<div class="card-title">' + (st.locked ? '🔒 ' : '') + U.esc(n.name) + ' <span class="muted-sm">掌握度 ' + st.mastered + '%</span></div>'
          + (st.locked
            ? '<div class="alert alert-danger">🔒 未解锁：需先完成 <b>' + U.esc(lockNames) + '</b>（掌握度≥60%）<br>推荐任务：' + U.esc(n.book) + '</div>'
            : '<div class="alert alert-ok">已解锁。推荐任务：' + U.esc(n.book) + '</div>')
          + '<div class="card-title-sm">复试术语桥（工程 ↔ 学术）</div>' + gloss
          + '<div class="btn-row" style="margin-top:10px">'
          + (st.locked
            ? '<button class="btn btn-ghost" id="cm-go-dep">去提升前置：' + U.esc(byId[st.lockBy[0]].name) + '</button>'
            : '<button class="btn btn-primary" id="cm-add-task">添加相关任务到任务中心</button>')
          + '<button class="btn btn-ghost" id="cm-set-score">录入掌握度</button>'
          + '</div>';

        const depBtn = document.getElementById('cm-go-dep');
        if (depBtn) depBtn.onclick = () => Toast.show('先去热力图把「' + byId[st.lockBy[0]].name + '」练到60%以上', 'info', 4000);
        const addBtn = document.getElementById('cm-add-task');
        if (addBtn) addBtn.onclick = () => {
          Store.update(s => {
            s.tasks.push({ id: U.uid(), subject: 'ctrl', text: '【图谱】' + n.name + '：' + n.book, done: false, createdAt: new Date().toISOString() });
          });
          Toast.success('已加入任务中心');
        };
        document.getElementById('cm-set-score').onclick = () => {
          Modal.open({
            title: '录入「' + n.name + '」掌握度',
            html: '<input id="cm-score" class="input" type="number" min="0" max="100" value="' + (st.score != null ? st.score : '') + '" placeholder="自测正确率%">',
            actions: [{ label: '取消' }, {
              label: '保存', kind: 'btn-primary', onClick: close => {
                const v = parseFloat(document.getElementById('cm-score').value);
                Store.update(s => {
                  s.heat[id] = { level: !isNaN(v) ? (v >= 80 ? 2 : v >= 50 ? 1 : 0) : 0, score: isNaN(v) ? null : v, updatedAt: new Date().toISOString() };
                });
                close(); App.refresh();
              }
            }]
          });
          setTimeout(() => document.getElementById('cm-score').focus(), 50);
        };
      });
    });
  }

  window.ConceptMapModule = { render };
})();
