/* ============================================================
 * mental.js — 心理状态量化追踪（每日强制1分钟）
 * 预警：连续3天<5分 → 强制休息建议；硬件冲动 → 复读红线禁令
 * ============================================================ */
(function () {
  'use strict';

  function render(el) {
    const s = Store.get();
    const today = s.mental.find(m => m.date === U.dkey());

    // 近30天心情趋势
    const last30 = U.lastNDays(30).map(k => {
      const m = s.mental.find(x => x.date === k);
      return { label: k.slice(8), value: m ? m.mood : null };
    }).filter(d => d.value != null);
    // 近7天
    const last7 = last30.slice(-7);

    // 预警
    const recent3 = U.lastNDays(3).map(k => { const m = s.mental.find(x => x.date === k); return m ? m.mood : null; });
    const lowStreak = recent3.every(v => v != null && v < 5);
    const urgeWeek = s.mental.filter(m => U.inThisWeek(m.date) && m.hwUrge).length;

    el.innerHTML =
      '<div class="card"><div class="card-title">🧘 心理状态量化追踪</div>'
      + (today ? '<div class="alert alert-ok">✓ 今日已记录（心情 ' + today.mood + '/10）。一天一次，诚实面对自己。</div>'
        : '<div class="alert alert-warn">今日尚未记录。学习结束后强制1分钟完成。</div>')
      + '<div class="form-grid">'
      + '<label class="fld fld-full"><span>今日心情评分（1-10）：<b id="mt-mood-v">5</b></span>'
      + '<input id="mt-mood" type="range" min="1" max="10" value="5" class="range"></label>'
      + '<label class="fld"><span>疲劳程度</span><select id="mt-fatigue" class="input input-sel">'
      + '<option value="fresh">清醒</option><option value="tired">略累</option><option value="exhausted">疲惫</option><option value="giveup">想放弃</option></select></label>'
      + '<label class="fld"><span>是否出现「想当然」/跳步冲动</span><select id="mt-jumpy" class="input input-sel"><option value="no">否</option><option value="yes">是</option></select></label>'
      + '<label class="fld"><span>是否有硬件/B站冲动</span><select id="mt-urge" class="input input-sel"><option value="no">否</option><option value="yes">是</option></select></label>'
      + '<label class="fld"><span>今日最卡壳的科目/知识点</span><input id="mt-stuck" class="input" placeholder="如：现控-状态转移矩阵"></label>'
      + '</div>'
      + '<button class="btn btn-primary" id="mt-save">' + (today ? '更新今日记录' : '提交今日记录') + '</button>'
      + '</div>'

      + (lowStreak ? '<div class="alert alert-danger">😴 疲劳预警：连续3天心情<5分。建议明天强制休息半日——效率崩了，努力只是自我感动。</div>' : '')
      + (urgeWeek > 0 ? '<div class="alert alert-danger">🔧 冲动预警：本周检测到 ' + urgeWeek + ' 次硬件/B站冲动。复读红线第1条：<b>初试前绝对禁止硬件项目</b>。你的STM32履历已经够用了。</div>' : '')

      + '<div class="card"><div class="card-title">心情趋势（近7天）</div>'
      + (last7.length >= 2 ? Charts.line(last7, { height: 150, min: 0, max: 10, warnBelow: 5 }) : '<div class="empty">记录满2天后显示趋势</div>')
      + '</div>'

      + '<div class="card"><div class="card-title">卡壳热点（近30天）</div><div id="mt-stuck-list" class="muted-sm"></div></div>';

    // 卡壳热点统计
    const stucks = s.mental.filter(m => m.stuck && new Date(m.date) > new Date(Date.now() - 30 * U.DAY_MS)).map(m => m.stuck);
    const cnt = U.countBy(stucks, x => x);
    const top = U.topN(cnt, 5);
    document.getElementById('mt-stuck-list').innerHTML = top.length
      ? '本周最需突破：' + top.map(t => '<span class="tag tag-warn">' + U.esc(t.key) + '（' + t.count + '次）</span>').join(' ')
      : '暂无卡壳记录';

    bind(el, today);
  }

  function bind(el, today) {
    const mood = el.querySelector('#mt-mood');
    mood.oninput = () => { document.getElementById('mt-mood-v').textContent = mood.value; };
    if (today) {
      mood.value = today.mood; document.getElementById('mt-mood-v').textContent = today.mood;
      el.querySelector('#mt-fatigue').value = today.fatigue;
      el.querySelector('#mt-jumpy').value = today.jumpy ? 'yes' : 'no';
      el.querySelector('#mt-urge').value = today.hwUrge ? 'yes' : 'no';
      el.querySelector('#mt-stuck').value = today.stuck || '';
    }
    el.querySelector('#mt-save').onclick = () => {
      const urge = el.querySelector('#mt-urge').value === 'yes';
      const rec = {
        id: today ? today.id : U.uid(),
        date: U.dkey(),
        mood: +mood.value,
        fatigue: el.querySelector('#mt-fatigue').value,
        jumpy: el.querySelector('#mt-jumpy').value === 'yes',
        hwUrge: urge,
        stuck: el.querySelector('#mt-stuck').value.trim()
      };
      Store.update(s => {
        const i = s.mental.findIndex(m => m.date === U.dkey());
        if (i >= 0) s.mental[i] = rec; else s.mental.push(rec);
      });
      if (urge) {
        Modal.open({
          title: '🔧 硬件冲动拦截',
          html: '<p>检测到硬件/B站冲动。复读绝对禁令第1条：</p><p><b>初试前绝对禁止硬件项目——禁止PCB、B站视频、STM32新工程。</b></p><p class="muted-sm">冲动已记录。现在去喝口水，然后回到数学题上。</p></div>',
          actions: [{ label: '收到，回去学习', kind: 'btn-primary' }]
        });
      } else {
        Toast.success('已记录。诚实面对自己，是防呆的第一步。');
      }
      App.refresh();
    };
  }

  window.MentalModule = { render };
})();
