/* ============================================================
 * progress.js — 进度追踪：四科进度卡片 + 里程碑时间线
 * 特殊预警：现控<40%黄警 / 政治红色警告（PRD 4.3）
 * ============================================================ */
(function () {
  'use strict';

  function subjCard(key) {
    const meta = DB.SUBJECTS[key];
    const p = Store.get().progress[key];
    const now = new Date();
    const month = now.getMonth() + 1;

    let warn = '';
    if (key === 'ctrl' && (p.modules['现代控制'] || 0) < 40) {
      warn = '<div class="alert alert-warn">⚠️ 8月底前需独立完成极点配置，否则触发备选切换</div>';
    }
    if (key === 'pol' && month < 9) {
      warn = '<div class="alert alert-danger">⏰ 9月前每天≤45分钟，禁止挤占数学/专业课时间</div>';
    }

    let moduleChips = '';
    meta.modules.forEach(m => {
      const v = (p.modules && p.modules[m]) || 0;
      moduleChips += '<span class="tag tag-mod" data-subj="' + key + '" data-mod="' + U.esc(m) + '" title="点击更新进度">' + U.esc(m) + ' ' + v + '%</span>';
    });

    return '<div class="card prog-card">'
      + '<div class="prog-head"><span class="prog-name" style="color:' + meta.color + '">' + meta.name + '</span>'
      + '<span class="prog-target">目标 ' + meta.target + ' 分</span></div>'
      + '<div class="prog-bar-row">' + Charts.progressBar(p.percent, meta.color) + '<span class="prog-pct" data-subj="' + key + '" title="点击更新总进度">' + p.percent + '%</span></div>'
      + '<div class="muted-sm">当前阶段：' + U.esc(p.stage) + ' <button class="link-btn" data-stage="' + key + '">修改</button></div>'
      + '<div class="tag-row">' + moduleChips + '</div>'
      + warn
      + '</div>';
  }

  function milestoneNode(m) {
    const done = Store.get().milestones[m.id];
    return '<div class="ms-node' + (done ? ' ms-done' : '') + '" data-id="' + m.id + '">'
      + '<div class="ms-dot"></div>'
      + '<div class="ms-body"><div class="ms-date">' + m.date + (done ? ' <span class="ms-badge">已完成</span>' : ' <span class="ms-badge ms-badge-doing">' + (new Date() <= new Date('2026-' + m.deadline + 'T23:59:59') ? '进行中' : '逾期') + '</span>') + '</div>'
      + '<div class="ms-title">' + U.esc(m.title) + '</div></div>'
      + '<label class="ms-check"><input type="checkbox"' + (done ? ' checked' : '') + '><span class="box"></span></label>'
      + '</div>';
  }

  function render(el) {
    el.innerHTML =
      '<div class="grid-2">'
      + subjCard('math') + subjCard('ctrl') + subjCard('eng') + subjCard('pol')
      + '</div>'
      + '<div class="card"><div class="card-title">里程碑时间线</div>'
      + '<div class="ms-line">' + DB.MILESTONES.map(milestoneNode).join('') + '</div>'
      + '<div class="muted-sm" style="margin-top:8px">勾选里程碑将触发系统通知；10月底节点未达成时，系统将在11月1日推送院校决策建议。</div>'
      + '</div>';

    bind(el);
  }

  function bind(el) {
    // 总进度点击更新
    el.querySelectorAll('.prog-pct').forEach(sp => {
      sp.onclick = () => {
        const key = sp.getAttribute('data-subj');
        const cur = Store.get().progress[key].percent;
        Modal.open({
          title: '更新 ' + DB.SUBJECTS[key].name + ' 总进度',
          html: '<input id="pct-input" class="input" type="number" min="0" max="100" value="' + cur + '">',
          actions: [{ label: '取消' }, {
            label: '保存', kind: 'btn-primary', onClick: close => {
              const v = U.clamp(parseInt(document.getElementById('pct-input').value, 10) || 0, 0, 100);
              Store.update(s => { s.progress[key].percent = v; });
              close(); App.refresh(); Toast.success('进度已更新为 ' + v + '%');
            }
          }]
        });
        setTimeout(() => document.getElementById('pct-input').focus(), 50);
      };
    });
    // 阶段修改
    el.querySelectorAll('[data-stage]').forEach(b => {
      b.onclick = () => {
        const key = b.getAttribute('data-stage');
        const cur = Store.get().progress[key].stage;
        Modal.open({
          title: '修改当前阶段',
          html: '<input id="stage-input" class="input" value="' + U.esc(cur) + '">',
          actions: [{ label: '取消' }, {
            label: '保存', kind: 'btn-primary', onClick: close => {
              const v = document.getElementById('stage-input').value.trim() || cur;
              Store.update(s => { s.progress[key].stage = v; });
              close(); App.refresh();
            }
          }]
        });
        setTimeout(() => document.getElementById('stage-input').focus(), 50);
      };
    });
    // 子模块进度点击更新
    el.querySelectorAll('.tag-mod').forEach(tag => {
      tag.onclick = () => {
        const key = tag.getAttribute('data-subj');
        const mod = tag.getAttribute('data-mod');
        const cur = (Store.get().progress[key].modules || {})[mod] || 0;
        Modal.open({
          title: '更新「' + mod + '」进度',
          html: '<input id="mod-input" class="input" type="number" min="0" max="100" value="' + cur + '">',
          actions: [{ label: '取消' }, {
            label: '保存', kind: 'btn-primary', onClick: close => {
              const v = U.clamp(parseInt(document.getElementById('mod-input').value, 10) || 0, 0, 100);
              Store.update(s => {
                s.progress[key].modules = s.progress[key].modules || {};
                s.progress[key].modules[mod] = v;
              });
              close(); App.refresh(); Toast.success(mod + ' → ' + v + '%');
            }
          }]
        });
        setTimeout(() => document.getElementById('mod-input').focus(), 50);
      };
    });
    // 里程碑勾选 → 系统通知
    el.querySelectorAll('.ms-node input[type=checkbox]').forEach(cb => {
      cb.onchange = () => {
        const id = cb.closest('.ms-node').getAttribute('data-id');
        const m = DB.MILESTONES.find(x => x.id === id);
        Store.update(s => { s.milestones[id] = cb.checked; });
        if (cb.checked && window.Notify) Notify.send('里程碑达成', '🏁 里程碑达成：' + m.title);
        App.refresh();
      };
    });
  }

  window.ProgressModule = { render };
})();
