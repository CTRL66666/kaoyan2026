/* ============================================================
 * mistakes.js — 错题画像：类型分布环形图 / 记录新错题 / 列表 / 重练
 * ============================================================ */
(function () {
  'use strict';

  function render(el) {
    const s = Store.get();

    // 分布图数据
    const counts = U.countBy(s.mistakes, m => m.type);
    const pie = Object.keys(DB.MISTAKE_TYPES).map(k => ({
      label: DB.MISTAKE_TYPES[k].name, value: counts[k] || 0, color: DB.MISTAKE_TYPES[k].color
    }));

    // 错题列表（时间倒序，最多50条）
    const list = U.clone(s.mistakes).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 50);
    let rows = '';
    if (list.length === 0) rows = '<div class="empty">还没有错题记录。错题不可怕，重复错才可怕。</div>';
    list.forEach(m => {
      const t = DB.MISTAKE_TYPES[m.type] || DB.MISTAKE_TYPES.other;
      rows += '<div class="mis-row" style="border-left-color:' + t.color + '">'
        + '<div class="mis-head"><span class="tag" style="background:' + t.color + '">' + t.name + '</span>'
        + '<span class="mis-subj">' + ((DB.SUBJECTS[m.subject] || {}).name || m.subject) + '</span>'
        + '<span class="mis-date">' + U.esc(m.date || '') + '</span></div>'
        + '<div class="mis-desc">' + U.esc(m.desc) + '</div>'
        + '<div class="mis-actions"><button class="btn btn-sm btn-ghost mis-variant" data-id="' + m.id + '">🔄 重练变式题</button></div>'
        + '</div>';
    });

    // 重练队列
    const drills = s.mistakeDrills.filter(d => d.status === 'pending');
    let drillHtml = '';
    if (drills.length) {
      drillHtml = drills.map(d =>
        '<div class="drill-row" data-id="' + d.id + '"><span>🎯 ' + U.esc(d.title) + (d.penaltyOf ? ' <span class="tag tag-red">罚练</span>' : '') + '</span>'
        + '<button class="btn btn-sm btn-primary" data-done="' + d.id + '">完成</button></div>'
      ).join('');
    } else {
      drillHtml = '<div class="empty">重练队列为空。记录错题后可一键生成重练任务。</div>';
    }

    el.innerHTML =
      '<div class="card"><div class="card-title">错题类型分布（全部 ' + s.mistakes.length + ' 条）</div>'
      + Charts.donut(pie, { height: 200 })
      + '</div>'

      + '<div class="card"><div class="card-title">记录新错题</div>'
      + '<div class="form-grid">'
      + '<label class="fld"><span>科目</span><select id="ms-subj" class="input input-sel">'
      +   '<option value="math">数学一</option><option value="ctrl">自控</option><option value="eng">英语一</option></select></label>'
      + '<label class="fld"><span>错误类型</span><select id="ms-type" class="input input-sel">'
      +   Object.keys(DB.MISTAKE_TYPES).map(k => '<option value="' + k + '">' + DB.MISTAKE_TYPES[k].name + '</option>').join('') + '</select></label>'
      + '<label class="fld fld-full"><span>题目描述</span><input id="ms-desc" class="input" placeholder="如：定积分换元法负号处理"></label>'
      + '</div>'
      + '<button class="btn btn-primary" id="ms-add">提交</button>'
      + '</div>'

      + '<div class="card"><div class="card-title-row"><span class="card-title">错题重练</span><span>'
      + '<button class="link-btn" id="ms-gen">生成本周Top重练5题</button>'
      + (drills.length ? ' <button class="link-btn" id="ms-to-tasks" style="color:var(--danger)">一键转入任务中心 →</button>' : '')
      + '</span></div>'
      + drillHtml
      + '</div>'

      + '<div class="card"><div class="card-title">错题列表（最近50条）</div>' + rows + '</div>';

    bind(el);
  }

  function bind(el) {
    el.querySelector('#ms-add').onclick = () => {
      const desc = el.querySelector('#ms-desc').value.trim();
      if (!desc) { Toast.warn('请填写题目描述'); return; }
      const type = el.querySelector('#ms-type').value;
      Store.update(s => {
        s.mistakes.push({
          id: U.uid(), subject: el.querySelector('#ms-subj').value, type, desc,
          date: U.shortDate(), createdAt: new Date().toISOString()
        });
      });
      Toast.success('已记录。同类错误再犯时，系统会加重干预。');
      // 符号错误即时提醒
      if (type === 'sign') Toast.warn('⚠️ 今日符号错误已达 ' + Store.mistakeCountToday('sign') + ' 次，下次数学打卡将触发防呆提醒');
      App.refresh();
    };

    el.querySelector('#ms-gen').onclick = () => {
      const top = Store.weekTopMistakes();
      if (!top.length) { Toast.warn('本周暂无错题记录'); return; }
      Store.update(s => {
        top.slice(0, 2).forEach(t => {
          const name = (DB.MISTAKE_TYPES[t.key] || {}).name || t.key;
          for (let i = 1; i <= (t.key === top[0].key ? 3 : 2); i++) {
            s.mistakeDrills.push({
              id: U.uid(), source: 'mistake', refId: t.key,
              title: '【' + name + '专项】自行从题库选1道同类题（第' + i + '题）',
              subject: 'math', status: 'pending', createdAt: new Date().toISOString()
            });
          }
        });
      });
      Toast.success('已生成5道重练任务');
      App.refresh();
    };

    // 闭环：重练完成 → 自动累加为数学任务打卡记录
    el.querySelectorAll('[data-done]').forEach(b => {
      b.onclick = () => {
        const id = b.getAttribute('data-done');
        Store.update(s => { const d = s.mistakeDrills.find(x => x.id === id); if (d) d.status = 'done'; });
        Toast.success('重练完成 +1');
        App.refresh();
      };
    });

    // 错题变式复现：跳到AI测验生成同源变式题
    el.querySelectorAll('.mis-variant').forEach(b => {
      b.onclick = () => {
        const id = b.getAttribute('data-id');
        const m = Store.get().mistakes.find(x => x.id === id);
        if (!m) return;
        if (window.QuizModule && QuizModule.startVariant) {
          App.go('quiz');
          // 等quiz模块渲染后启动变式
          setTimeout(() => QuizModule.startVariant(m), 50);
        } else {
          Toast.warn('AI测验模块未就绪');
        }
      };
    });

    // 闭环：一键把全部待重练转成任务中心正式任务（打卡才算数）
    const genBtn = el.querySelector('#ms-to-tasks');
    if (genBtn) genBtn.onclick = () => {
      const drills = Store.get().mistakeDrills.filter(d => d.status === 'pending');
      if (!drills.length) { Toast.warn('重练队列已空'); return; }
      Store.update(s => {
        s.mistakeDrills.filter(d => d.status === 'pending').forEach(d => {
          s.tasks.push({ id: U.uid(), subject: d.subject === 'ctrl' ? 'ctrl' : 'math', text: d.title, done: false, createdAt: new Date().toISOString() });
          d.status = 'done';
        });
      });
      Toast.success('已转入任务中心，去打卡吧');
      App.go('tasks');
    };
  }

  window.MistakesModule = { render };
})();
