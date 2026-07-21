/* ============================================================
 * reading.js — 英语阅读定位法训练器
 * 功能1：熟词僻义闪卡（Leitner盒间隔重复）
 * 功能2：定位法计时训练（每题≤90秒）
 * 功能3：虚假繁荣检测（连续全对但用时极短 → 提示）
 * ============================================================ */
(function () {
  'use strict';
  let tab = 'drill'; // drill | flash
  let cardIdx = 0, cardFlip = false;

  // 词库：内置 + 用户自定义合并（自定义在前优先复习）
  function allVocab() {
    const custom = Store.get().reading.customVocab || [];
    return custom.concat(DB.VOCAB);
  }

  // Leitner 盒：box 1-5，间隔 1/2/4/7/15 天
  const BOX_DAYS = [0, 1, 2, 4, 7, 15];
  function dueCards() {
    const cards = Store.get().reading.cards;
    const today = U.dkey();
    return allVocab().filter(v => {
      const c = cards[v.w];
      return !c || !c.due || c.due <= today;
    });
  }

  function grade(word, known) {
    Store.update(s => {
      const c = s.reading.cards[word] || { box: 1, due: U.dkey() };
      c.box = known ? Math.min(5, c.box + 1) : 1;
      const d = new Date(); d.setDate(d.getDate() + BOX_DAYS[c.box]);
      c.due = U.dkey(d);
      s.reading.cards[word] = c;
    });
  }

  // 虚假繁荣检测
  function bubbleCheck() {
    const rs = Store.get().reading.results.slice(-10);
    if (rs.length < 10) return null;
    const allRight = rs.every(r => r.correct);
    const avgSecs = U.avg(rs.map(r => r.secs));
    if (allRight && avgSecs < 40) return { allRight, avgSecs: Math.round(avgSecs) };
    return null;
  }

  function render(el) {
    const s = Store.get();
    const results = s.reading.results;
    const recent = results.slice(-20).reverse();
    const bubble = bubbleCheck();
    const due = dueCards();
    const learned = Object.keys(s.reading.cards).length;

    let body = '';
    if (tab === 'drill') {
      body =
        '<div class="card"><div class="card-title">定位法计时训练（每题≤90秒）</div>'
        + '<div class="form-grid">'
        + '<label class="fld"><span>真题来源（如 2023 Text 2 Q1）</span><input id="rd-src" class="input" placeholder="2023 Text 2 Q1"></label>'
        + '<label class="fld"><span>正确答案是第几段</span><select id="rd-ans" class="input input-sel"><option value="1">第1段</option><option value="2">第2段</option><option value="3">第3段</option><option value="4">第4段</option></select></label>'
        + '</div>'
        + '<div class="muted-sm">流程：计时开始 → 回原文定位 → 选择你认为的定位段落 → 系统判定并记录用时。</div>'
        + '<div class="btn-row" style="margin-top:10px">'
        + '<button class="btn btn-primary" id="rd-start">开始计时定位</button>'
        + '</div><div id="rd-arena"></div></div>'

        + (bubble ? '<div class="alert alert-warn">🎈 虚假繁荣检测：近10题全对但平均仅 ' + bubble.avgSecs + ' 秒。是否存在蒙对可能？建议精读错题分析，并对每题复述定位依据。</div>' : '')

        + '<div class="card"><div class="card-title">近期定位记录（' + results.length + ' 题）</div>'
        + (recent.length ? recent.map(r =>
          '<div class="his-row"><span>' + U.esc(r.source) + ' <span class="tag ' + (r.correct ? 'tag-ok' : 'tag-red') + '">' + (r.correct ? '定位正确' : '定位错误') + '</span></span>'
          + '<span class="muted-sm">' + r.secs + '秒 · ' + r.date + '</span></div>'
        ).join('') : '<div class="empty">暂无记录</div>')
        + '</div>';
    } else {
      const cur = due[cardIdx % Math.max(1, due.length)];
      body =
        '<div class="card"><div class="card-title-row"><span class="card-title">熟词僻义闪卡（Leitner间隔重复）</span>'
        + '<button class="link-btn" id="fc-import">+ 导入单词</button></div>'
        + '<div class="muted-sm">到期 ' + due.length + ' 张 · 已入库 ' + learned + '/' + allVocab().length + ' 词（含自定义 ' + (Store.get().reading.customVocab || []).length + '）。答错回到第1盒，答对晋级。</div>'
        + (cur
          ? '<div class="flashcard" id="fc-card">'
            + '<div class="fc-word">' + U.esc(cur.w) + '</div>'
            + (cardFlip
              ? '<div class="fc-back"><div><b>常义：</b>' + U.esc(cur.com) + '</div><div class="fc-rare"><b>僻义：</b>' + U.esc(cur.rare) + '</div><div class="fc-ex">' + U.esc(cur.ex) + '</div></div>'
              : '<div class="fc-hint">点击卡片翻面（先回忆僻义再翻）</div>')
            + '</div>'
          + (cardFlip
            ? '<div class="btn-row"><button class="btn btn-danger" id="fc-no">没想起来</button><button class="btn btn-primary" id="fc-yes">想起来了</button></div>'
            : '')
          : '<div class="empty">今日闪卡全部完成！明天再来。</div>')
        + '</div>'
        + '<div class="card"><div class="card-title">词库掌握分布</div><div id="fc-dist"></div></div>';
    }

    el.innerHTML =
      '<div class="card"><div class="card-title">📖 英语阅读定位法训练器</div>'
      + '<div class="tab-row">'
      + '<button class="tab' + (tab === 'drill' ? ' tab-on' : '') + '" data-t="drill">定位法计时</button>'
      + '<button class="tab' + (tab === 'flash' ? ' tab-on' : '') + '" data-t="flash">熟词僻义闪卡</button>'
      + '</div></div>'
      + body;

    bind(el);
    if (tab === 'flash') renderDist();
  }

  function renderDist() {
    const cards = Store.get().reading.cards;
    const dist = [0, 0, 0, 0, 0, 0];
    DB.VOCAB.forEach(v => { const c = cards[v.w]; dist[c ? c.box : 0]++; });
    const el = document.getElementById('fc-dist');
    if (!el) return;
    el.innerHTML = Charts.bar(dist.map((n, i) => ({ label: i === 0 ? '未学' : '盒' + i, value: n })), { height: 130, color: '#722ed1' });
  }

  function bind(el) {
    el.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { tab = b.getAttribute('data-t'); cardFlip = false; render(el); });

    // ---- 定位计时 ----
    const startBtn = el.querySelector('#rd-start');
    if (startBtn) startBtn.onclick = () => {
      const src = el.querySelector('#rd-src').value.trim();
      if (!src) { Toast.warn('先填写真题来源'); return; }
      const ans = +el.querySelector('#rd-ans').value;
      const t0 = Date.now();
      const arena = el.querySelector('#rd-arena');
      arena.innerHTML = '<div class="rd-timer" id="rd-clock">00:00</div>'
        + '<div class="muted-sm">回原文定位！找到依据段落后果断选择。90秒上限。</div>'
        + '<div class="seg-row">' + [1, 2, 3, 4].map(p => '<button class="seg" data-p="' + p + '">第' + p + '段</button>').join('') + '</div>';
      const clock = setInterval(() => {
        const sec = Math.floor((Date.now() - t0) / 1000);
        const c = document.getElementById('rd-clock');
        if (c) { c.textContent = String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0'); if (sec >= 90) c.classList.add('rd-over'); }
      }, 500);
      arena.querySelectorAll('[data-p]').forEach(b => b.onclick = () => {
        clearInterval(clock);
        const secs = Math.round((Date.now() - t0) / 1000);
        const choice = +b.getAttribute('data-p');
        const correct = choice === ans;
        Store.update(s => {
          s.reading.results.push({ id: U.uid(), date: U.shortDate(), source: src, answer: ans, choice, correct, secs });
          if (s.reading.results.length > 200) s.reading.results = s.reading.results.slice(-200);
        });
        if (!correct) {
          Modal.open({
            title: '❌ 定位错误',
            html: '<p>你选了第' + choice + '段，正确答案在第' + ans + '段（用时' + secs + '秒）。</p>'
              + '<div class="warn-box"><div class="warn-title">定位技巧提示</div><div class="warn-body">1. 题干关键词（人名/数字/大写词）优先定位<br>2. 顺序原则：题目顺序≈段落顺序<br>3. 定位句只读一句，别贪恋全段<br>4. 同义替换是答案的标志</div></div>',
            actions: [{ label: '记下了', kind: 'btn-primary' }]
          });
        } else {
          Toast.success('✓ 定位正确，用时 ' + secs + ' 秒' + (secs > 90 ? '（超90秒上限，提速！）' : ''));
        }
        render(el);
      });
    };

    // ---- 闪卡 ----
    const card = el.querySelector('#fc-card');
    if (card) card.onclick = () => { if (!cardFlip) { cardFlip = true; render(el); } };
    const yes = el.querySelector('#fc-yes'), no = el.querySelector('#fc-no');
    const due = dueCards();
    if (yes) yes.onclick = () => { const cur = due[cardIdx % due.length]; grade(cur.w, true); cardIdx++; cardFlip = false; render(el); };
    if (no) no.onclick = () => { const cur = due[cardIdx % due.length]; grade(cur.w, false); cardIdx++; cardFlip = false; Toast.warn('已回到第1盒，明天再见'); render(el); };

    // ---- 导入单词 ----
    const imp = el.querySelector('#fc-import');
    if (imp) imp.onclick = () => openImport(el);
  }

  // 导入弹窗：手动粘贴 或 AI整理
  function openImport(el) {
    const hasAI = AI.configured();
    Modal.open({
      title: '📥 导入自定义单词',
      wide: true,
      html:
        '<div class="muted-sm">方式一：直接粘贴标准格式（每行一个词，用 | 分隔 单词/常见义/僻义/例句）：</div>'
        + '<textarea class="input" id="imp-raw" rows="5" placeholder="subject | 科目；主题 | 受试者；使服从 | The subjects were tested.&#10;address | 地址 | 处理；探讨 | address the problem"></textarea>'
        + '<div class="btn-row" style="margin:10px 0"><button class="btn btn-primary" id="imp-manual">✓ 按格式导入</button></div>'
        + '<hr style="border:none;border-top:1px solid var(--line);margin:14px 0">'
        + '<div class="muted-sm">方式二：粘贴任意英文材料/混乱词表，AI自动提取熟词僻义并整理成标准格式' + (hasAI ? '' : '（需先配置API Key）') + '：</div>'
        + '<textarea class="input" id="imp-ai-raw" rows="4" placeholder="粘贴真题阅读原文、或一堆没整理的单词…"></textarea>'
        + '<div class="btn-row" style="margin:10px 0"><button class="btn ' + (hasAI ? 'btn-primary' : 'btn-ghost') + '" id="imp-ai"' + (hasAI ? '' : ' disabled') + '>🤖 AI整理并导入</button></div>'
        + '<div id="imp-result"></div>',
      actions: [{ label: '完成', kind: 'btn-primary' }]
    });

    // 手动导入
    document.getElementById('imp-manual').onclick = () => {
      const raw = document.getElementById('imp-raw').value;
      const parsed = parseVocabLines(raw);
      if (!parsed.length) { Toast.warn('没识别到有效行。格式：单词 | 常见义 | 僻义 | 例句'); return; }
      addVocab(parsed);
      document.getElementById('imp-result').innerHTML = '<div class="alert alert-ok">✓ 成功导入 ' + parsed.length + ' 个单词到闪卡系统。</div>';
    };

    // AI整理导入
    const aiBtn = document.getElementById('imp-ai');
    if (aiBtn && hasAI) aiBtn.onclick = () => {
      const raw = document.getElementById('imp-ai-raw').value.trim();
      if (!raw) { Toast.warn('请先粘贴材料'); return; }
      aiBtn.disabled = true; aiBtn.textContent = '🤖 AI整理中…';
      const prompt = '你是考研英语词汇专家。从以下材料中提取考研高频"熟词僻义"单词（或整理用户给的混乱词表），' +
        '必须只输出JSON数组，不要多余文字。格式：' +
        '[{"w":"单词","com":"常见义","rare":"僻义（考研常考）","ex":"英文例句（带中文）"}]。' +
        '只挑真正有生僻义的词，最多15个。材料：\n' + raw.slice(0, 2000);
      AI.chatJSON('你是词汇整理助手，只输出JSON数组。', prompt).then(arr => {
        const list = Array.isArray(arr) ? arr : (arr.words || []);
        const parsed = list.filter(v => v && v.w && v.rare).map(v => ({ w: String(v.w).trim(), com: String(v.com || '—'), rare: String(v.rare), ex: String(v.ex || '') }));
        if (!parsed.length) throw new Error('AI未提取到有效单词');
        addVocab(parsed);
        document.getElementById('imp-result').innerHTML = '<div class="alert alert-ok">✓ AI整理完成，导入 ' + parsed.length + ' 个熟词僻义词：' + parsed.map(v => v.w).join('、') + '</div>';
        aiBtn.disabled = false; aiBtn.textContent = '🤖 AI整理并导入';
      }).catch(e => {
        document.getElementById('imp-result').innerHTML = '<div class="alert alert-danger">AI整理失败：' + U.esc(e.message) + '。可改用方式一手动粘贴。</div>';
        aiBtn.disabled = false; aiBtn.textContent = '🤖 AI整理并导入';
      });
    };
  }

  // 解析 "单词 | 常见义 | 僻义 | 例句" 每行
  function parseVocabLines(raw) {
    return String(raw).split('\n').map(line => {
      const parts = line.split('|').map(x => x.trim());
      if (parts.length < 3 || !parts[0]) return null;
      return { w: parts[0], com: parts[1] || '—', rare: parts[2], ex: parts[3] || '' };
    }).filter(Boolean);
  }

  // 入库（去重：同词覆盖僻义更新）
  function addVocab(list) {
    Store.update(s => {
      s.reading.customVocab = s.reading.customVocab || [];
      list.forEach(v => {
        const key = v.w.toLowerCase();
        // 内置词不重复加，直接更新其卡片即可；自定义词去重
        const existCustom = s.reading.customVocab.findIndex(x => x.w.toLowerCase() === key);
        if (existCustom >= 0) s.reading.customVocab[existCustom] = v;
        else if (!DB.VOCAB.some(x => x.w.toLowerCase() === key)) s.reading.customVocab.push(v);
        // 重置该词的到期时间，让它立即可复习
        if (s.reading.cards[key]) delete s.reading.cards[key];
      });
    });
  }

  window.ReadingModule = { render };
})();
