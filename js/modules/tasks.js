/* ============================================================
 * tasks.js — 任务中心：添加/打卡/就地编辑/删除 + 防呆提醒区
 * 业务规则：
 *  1. 数学任务勾选完成且今日符号错误>0 → 防呆弹窗
 *  2. 政治任务超过2个 → 警告
 *  3. 任务文本含硬件关键词 → 禁止添加 + 红线警告
 * ============================================================ */
(function () {
  'use strict';
  let filter = 'all';

  function hitHardware(text) {
    return DB.HARDWARE_KEYWORDS.find(k => text.indexOf(k) >= 0);
  }

  function render(el) {
    const s = Store.get();
    const tabs = [['all', '全部'], ['math', '数学'], ['ctrl', '自控'], ['eng', '英语'], ['pol', '政治']];

    let tabsHtml = '';
    tabs.forEach(t => {
      const n = t[0] === 'all' ? s.tasks.length : s.tasks.filter(x => x.subject === t[0]).length;
      tabsHtml += '<button class="tab' + (filter === t[0] ? ' tab-on' : '') + '" data-f="' + t[0] + '">' + t[1] + ' <span class="tab-n">' + n + '</span></button>';
    });

    const list = s.tasks.filter(t => filter === 'all' || t.subject === filter)
      .sort((a, b) => (a.done - b.done) || (a.createdAt < b.createdAt ? -1 : 1));

    let rows = '';
    if (list.length === 0) {
      rows = '<div class="empty">暂无任务，在下方添加一条吧</div>';
    } else {
      list.forEach(t => {
        const subj = DB.SUBJECTS[t.subject] || { short: '?', color: '#999' };
        rows += '<div class="task' + (t.done ? ' task-done' : '') + '" data-id="' + t.id + '">'
          + '<label class="task-check"><input type="checkbox"' + (t.done ? ' checked' : '') + ' data-act="toggle"><span class="box"></span></label>'
          + '<span class="task-tag" style="background:' + subj.color + '">' + subj.short + '</span>'
          + '<span class="task-text" data-act="edit" title="点击编辑">' + U.esc(t.text) + '</span>'
          + '<button class="task-x" data-act="del" aria-label="删除">×</button>'
          + '</div>';
      });
    }

    el.innerHTML =
      '<div class="card"><div class="card-title">任务中心</div>'
      + '<div class="tab-row">' + tabsHtml + '</div>'
      + '<div class="task-list">' + rows + '</div>'
      + '<div class="add-row">'
      +   '<select id="add-subj" class="input input-sel">'
      +     '<option value="math">数学一</option><option value="ctrl">自控</option>'
      +     '<option value="eng">英语一</option><option value="pol">政治</option>'
      +   '</select>'
      +   '<input id="add-text" class="input" placeholder="添加任务，回车确认（硬件关键词将被拦截）">'
      +   '<button id="add-btn" class="btn btn-primary">添加</button>'
      + '</div></div>'

      // 防呆提醒区（固定在列表下方，PRD 4.2-4）
      + '<div class="warn-box">'
      + '<div class="warn-title">⚠️ 防呆提醒</div>'
      + '<div class="warn-body">数学任务执行前请确认：<br>'
      + '1. 符号前置，负号立即提到最前面<br>'
      + '2. 分式合并三步法（分母→分子→计算）<br>'
      + '3. 草稿分区：左侧乱草，右侧正稿</div>'
      + '</div>';

    bind(el);
  }

  function addTask(el) {
    const subj = el.querySelector('#add-subj').value;
    const input = el.querySelector('#add-text');
    const text = input.value.trim();
    if (!text) { Toast.warn('任务内容不能为空'); return; }

    // 业务规则3：硬件冲动拦截
    const hit = hitHardware(text);
    if (hit) {
      Toast.danger('🚫 红线拦截：检测到「' + hit + '」。初试前绝对禁止硬件项目！');
      Modal.open({
        title: '🚫 红线警告',
        html: '<p>你试图添加包含 <b>「' + U.esc(hit) + '」</b> 的任务。</p>'
          + '<p>这触犯了绝对禁令第1条：<b>初试前绝对禁止硬件项目</b>。</p>'
          + '<p class="muted-sm">你的STM32履历已经够用。现在每一小时硬件时间，都是在从数学一的130分里偷分。任务已被拒绝。</p>',
        actions: [{ label: '我明白，回去学数学', kind: 'btn-primary' }]
      });
      return;
    }

    // 业务规则2：政治时间监控
    if (subj === 'pol') {
      const polCount = Store.get().tasks.filter(t => t.subject === 'pol' && !t.done).length;
      if (polCount >= 2) {
        Toast.warn('⚠️ 政治任务已超标，请优先保证数学/专业课。');
      }
    }

    Store.update(s => {
      s.tasks.push({ id: U.uid(), subject: subj, text, done: false, createdAt: new Date().toISOString() });
    });
    Toast.success('已添加');
    App.refresh();
  }

  function bind(el) {
    el.querySelectorAll('.tab').forEach(b => b.onclick = () => { filter = b.getAttribute('data-f'); render(el); });
    el.querySelector('#add-btn').onclick = () => addTask(el);
    el.querySelector('#add-text').addEventListener('keydown', e => { if (e.key === 'Enter') addTask(el); });

    el.querySelectorAll('.task').forEach(row => {
      const id = row.getAttribute('data-id');
      row.querySelector('[data-act="toggle"]').onchange = e => toggleTask(id, e.target.checked);
      row.querySelector('[data-act="del"]').onclick = () => {
        Modal.confirm('删除任务', '<p>确认删除该任务？此操作不可恢复。</p>', '删除', () => {
          Store.update(s => { s.tasks = s.tasks.filter(t => t.id !== id); });
          App.refresh();
        }, true);
      };
      // 就地编辑
      const textEl = row.querySelector('[data-act="edit"]');
      textEl.onclick = () => {
        if (row.classList.contains('editing')) return;
        const task = Store.get().tasks.find(t => t.id === id);
        if (!task) return;
        row.classList.add('editing');
        const inp = document.createElement('input');
        inp.className = 'input task-edit-input';
        inp.value = task.text;
        textEl.replaceWith(inp);
        inp.focus(); inp.select();
        const commit = save => {
          if (save) {
            const v = inp.value.trim();
            const hit = v && hitHardware(v);
            if (hit) { Toast.danger('🚫 红线拦截：文本包含「' + hit + '」，修改被拒绝'); }
            else if (v) Store.update(s => { const t = s.tasks.find(x => x.id === id); if (t) t.text = v; });
          }
          App.refresh();
        };
        inp.onkeydown = e => {
          if (e.key === 'Enter') commit(true);
          else if (e.key === 'Escape') commit(false);
        };
        inp.onblur = () => commit(true);
      };
    });
  }

  function toggleTask(id, done) {
    let subject = null;
    Store.update(s => {
      const t = s.tasks.find(x => x.id === id);
      if (!t) return;
      t.done = done;
      subject = t.subject;
      const k = U.dkey();
      s.completions[k] = s.completions[k] || [];
      const i = s.completions[k].indexOf(id);
      if (done && i < 0) s.completions[k].push(id);
      if (!done && i >= 0) s.completions[k].splice(i, 1);
    });

    if (done) {
      Toast.success('✓ 打卡完成');
      // 业务规则1：数学防呆触发（今日符号错误>0才弹）
      if (subject === 'math' && Store.mistakeCountToday('sign') > 0) {
        Modal.open({
          title: '⚠️ 数学防呆提醒',
          html: '<p>检测到今日已记录 <b>' + Store.mistakeCountToday('sign') + '</b> 次符号错误。下一题开始前请默念：</p>'
            + '<ol style="padding-left:18px;line-height:1.9"><li>符号前置，负号立即提到最前面</li>'
            + '<li>分式合并三步法（分母→分子→计算）</li>'
            + '<li>草稿分区：左侧乱草，右侧正稿</li></ol>',
          actions: [{ label: '收到，继续', kind: 'btn-primary' }]
        });
      }
    }
    App.refresh();
  }

  window.TasksModule = { render };
})();
