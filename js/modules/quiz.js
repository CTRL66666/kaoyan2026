/* ============================================================
 * quiz.js — AI 智能出题与自动判卷（高度智能化）
 * 工作流（全程无需手动标记"测没测"）：
 *   选考点 → 引擎生成题目（云端AI 或 本地模板兜底）
 *   → 结构化作答（选择点选 / 解答分步输入）
 *   → 自动判卷（云端JSON判分 或 本地规则评分）
 *   → 自动回写：热力图掌握度 + 错题记录 + 防呆干预 + 重练队列
 * ============================================================ */
(function () {
  'use strict';

  // 本地出题引擎（离线兜底）。题干用纯文本/Unicode（∫ π → ²），避免反斜杠转义事故。
  // lv: 1简单 2中等 3真题难度 4极难（localQuiz按难度筛选）
  const LOCAL_BANK = {
    'm-subst': [
      { lv: 1, gen: () => { const a = U.randInt(1, 3); return { stem: '计算定积分 ∫(从0到π/2) ' + a + '·sinx·cosx dx（用换元法，写出完整步骤）', type: 'solve', answer: a + '/2', solution: '令 u=sinx, du=cosx dx → ∫' + a + 'u du = ' + a + '·u²/2，代入0→1得 ' + a + '/2', trap: '换元后上下限必须同步变换，且负号前置' }; } },
      { lv: 2, gen: () => { const a = U.randInt(1, 4); return { stem: '计算 ∫(从0到1) ' + a + 'x/(1+x²) dx', type: 'solve', answer: a + 'ln2/2', solution: 'u=1+x², du=2x dx → (' + a + '/2)ln(1+x²) 代入0→1 = ' + a + 'ln2/2', trap: '分式系数易漏，u代换回代要彻底' }; } },
      { lv: 3, gen: () => { const a = U.randInt(2, 5); return { stem: '计算 ∫(从0到π) x·sin(' + a + 'x) dx（需分部积分，注意符号）', type: 'solve', answer: '含三角求值', solution: '分部：u=x, dv=sin(' + a + 'x)dx → -x·cos(' + a + 'x)/' + a + ' + ∫cos(' + a + 'x)/' + a + ' dx，逐项代入上下限', trap: '分部积分两次符号交替，最易出错' }; } }
    ],
    'm-limit': [
      { lv: 1, gen: () => { const a = U.randInt(1, 5); return { stem: '求极限：当 x→0 时，sin(' + a + 'x)/x = ?', type: 'choice', options: ['A. ' + a, 'B. 1', 'C. 0', 'D. ' + (a * a)], answer: 'A', solution: 'sin(ax) 等价于 ax，极限 = a = ' + a, trap: '等价无穷小系数别丢' }; } },
      { lv: 2, gen: () => { const a = U.randInt(2, 4); return { stem: '求极限：当 x→0 时，(1-cosx)/x² = ?', type: 'choice', options: ['A. 0', 'B. 1/2', 'C. 1', 'D. 2'], answer: 'B', solution: '1-cosx 等价于 x²/2，比值 1/2', trap: '泰勒展开阶数要够' }; } },
      { lv: 3, gen: () => { return { stem: '求极限：当 x→0 时，[ln(1+x) - x] / x² = ?', type: 'choice', options: ['A. 0', 'B. -1/2', 'C. 1/2', 'D. -1'], answer: 'B', solution: 'ln(1+x) 泰勒展开 x - x²/2 + ...，减去x得 -x²/2，除以x² → -1/2', trap: '展开到二阶，符号为负' }; } },
      { lv: 4, gen: () => { return { stem: '求极限：当 x→0 时，[(e^x - 1 - x) / (x·sin(x))] = ?', type: 'choice', options: ['A. 0', 'B. 1/2', 'C. 1', 'D. 2'], answer: 'B', solution: 'e^x = 1+x+x²/2+...，分子≈x²/2；分母 x·sinx≈x²，比值 1/2', trap: '分子分母都需展开到同阶，sinx≈x' }; } }
    ],
    'm-eigen': [
      { lv: 1, gen: () => { const a = U.randInt(1, 3); return { stem: '设 A 为 2 阶矩阵，特征值为 ' + a + ' 和 ' + (a + 1) + '，则 |A| = ?', type: 'choice', options: ['A. ' + (a * (a + 1)), 'B. ' + (a + a + 1), 'C. ' + a, 'D. ' + (a * a)], answer: 'A', solution: '行列式 = 特征值之积 = ' + a + '×' + (a + 1) + ' = ' + (a * (a + 1)), trap: '与迹混淆：迹是特征值之和' }; } },
      { lv: 3, gen: () => { const a = U.randInt(2, 4); return { stem: '设 A 为 3 阶矩阵，特征值为 1, ' + a + ', ' + (a + 1) + '，则 A 的迹 tr(A) 与 |A| 分别为？', type: 'choice', options: ['A. ' + (1 + a + a + 1) + ' 和 ' + (a * (a + 1)), 'B. ' + (a * (a + 1)) + ' 和 ' + (1 + a + a + 1), 'C. ' + (a + a) + ' 和 ' + a, 'D. ' + a + ' 和 ' + (a * a)], answer: 'A', solution: '迹=特征值之和=1+' + a + '+' + (a + 1) + '=' + (2 + 2 * a) + '；行列式=之积=1×' + a + '×' + (a + 1) + '=' + (a * (a + 1)), trap: '迹与行列式别记反' }; } }
    ],
    'm-ode': [
      { lv: 2, gen: () => { const a = U.randInt(1, 3); return { stem: "求微分方程 y' + " + a + 'y = e^x 的积分因子 μ(x)', type: 'choice', options: ['A. e^(' + a + 'x)', 'B. e^(-' + a + 'x)', 'C. e^x', 'D. ' + a + 'e^x'], answer: 'A', solution: 'μ = e^(∫' + a + 'dx) = e^(' + a + 'x)', trap: '⚠️积分因子指数符号必须反向检查：P(x)=' + a + '，指数为正' }; } }
    ],
    'c-pole': [
      { lv: 2, gen: () => { return { stem: '状态反馈极点配置的前提条件是系统（ ）', type: 'choice', options: ['A. 完全能控', 'B. 完全能观', 'C. 渐近稳定', 'D. 最小相位'], answer: 'A', solution: '极点可任意配置 ⟺ 系统完全能控', trap: '能控↔极点配置，能观↔观测器，别记反' }; } }
    ],
    'c-ctrb': [
      { lv: 2, gen: () => { return { stem: 'n 阶线性定常系统完全能控的充要条件是能控性矩阵 [B AB ... Aⁿ⁻¹B] 的秩为（ ）', type: 'choice', options: ['A. n', 'B. n-1', 'C. 1', 'D. 0'], answer: 'A', solution: '秩判据：rank(Qc) = n', trap: '能控用Qc，能观用Qo=[C;CA;...]，矩阵别写错' }; } }
    ],
    'c-tf': [
      { lv: 2, gen: () => { const a = U.randInt(1, 5); return { stem: '单位反馈系统开环传递函数 G(s) = ' + a + '/[s(s+1)]，闭环特征方程为？', type: 'solve', answer: 's² + s + ' + a + ' = 0', solution: '1+G(s)=0 → s(s+1)+' + a + '=0 → s²+s+' + a + '=0', trap: '分式合并三步法：先写分母s(s+1)，再加分子' + a }; } }
    ]
  };

  function fallbackLocal(topic) {
    return {
      stem: '【自测】' + topic.group + ' · ' + topic.name + '：请写出该考点的核心定义/公式，并举一个典型应用。',
      type: 'solve', answer: '（概念复述题，对照课本自评）',
      solution: '对照 ' + (topic.id[0] === 'm' ? '高数/线代/概率' : '胡寿松') + ' 教材核对要点完整性。',
      trap: '概念混淆是你画像里的高频错误'
    };
  }

  // ==================== 状态 ====================
  let phase = 'pick';
  let topicId = null;
  let quiz = null;
  let judge = null;
  let difficulty = 'auto';   // auto|easy|medium|real|hard —— auto按掌握度推荐
  let variantOf = null;      // 错题变式复现：{topicName, errorType, originDesc}

  const DIFFS = {
    easy: { name: '简单', icon: '🟢', prompt: '单一考点、直接套公式、计算量小的基础题，确保零失误拿分' },
    medium: { name: '中等', icon: '🟡', prompt: '常规考研题型、一两个知识点结合、需要标准步骤的中等题' },
    real: { name: '真题难度', icon: '🟠', prompt: '完全对标考研真题风格的综合题，多知识点交叉、有陷阱、计算量适中偏大' },
    hard: { name: '极难', icon: '🔴', prompt: '压轴题级别，创新题型或极复杂计算，训练战略性取舍能力' }
  };

  // 按掌握度自动推荐难度
  function autoDifficulty(tid) {
    const h = Store.get().heat[tid] || {};
    const s = h.score;
    if (s == null) return 'easy';
    if (s < 50) return 'easy';
    if (s < 75) return 'medium';
    if (s < 90) return 'real';
    return 'hard';
  }

  function allTopics() { return DB.TOPICS.math.concat(DB.TOPICS.ctrl); }

  // ==================== 出题 ====================
  function makeQuiz() {
    const topic = allTopics().find(t => t.id === topicId);
    phase = 'quizzing'; judge = null; quiz = null;
    render(document.getElementById('view'));

    // 确定实际难度
    const diff = difficulty === 'auto' ? autoDifficulty(topicId) : difficulty;
    const diffMeta = DIFFS[diff];
    const userWeak = Store.weekTopMistakes().map(t => (DB.MISTAKE_TYPES[t.key] || {}).name).join('、') || '符号错误';
    const useAI = AI.configured();

    if (useAI) {
      let ask;
      if (variantOf) {
        // 错题变式复现：同知识点、同陷阱、换数字换情境
        ask = '这是一道需要变式复现的错题。原题/考点：' + variantOf.originDesc +
          '；学生错误类型：' + (DB.MISTAKE_TYPES[variantOf.errorType] || {}).name +
          '。请出一道【同源变式题】：同一知识点、保留同样的陷阱（' + userWeak + '），但更换数字、情境或问法，' +
          '难度等级：' + diffMeta.name + '（' + diffMeta.prompt + '）。用于验证学生是否真正掌握。';
      } else {
        ask = '考点：' + topic.group + '·' + topic.name + '；层级：' + DB.TIERS[topic.tier].name +
          '（' + DB.TIERS[topic.tier].range + '）；难度等级：' + diffMeta.name + '（' + diffMeta.prompt + '）；' +
          '该生本周高频错误：' + userWeak + '。请出1道题。';
      }
      AI.chatJSON(AI.QUIZ_PROMPT, ask).then(q => {
        quiz = Object.assign({ source: 'ai', diff }, q);
        render(document.getElementById('view'));
      }).catch(() => {
        Toast.warn('云端出题失败，已切换本地题库');
        quiz = localQuiz(topic, diff);
        render(document.getElementById('view'));
      });
    } else {
      quiz = localQuiz(topic, diff);
      render(document.getElementById('view'));
    }
  }

  function localQuiz(topic, diff) {
    const bank = LOCAL_BANK[topic.id];
    let q;
    if (bank) {
      // 本地题库按难度分层：题目标记了lv则匹配，无标记则按难度筛选
      const lvMap = { easy: 1, medium: 2, real: 3, hard: 4 };
      const want = lvMap[diff] || 2;
      const pool = bank.filter(b => (b.lv || 2) === want);
      const use = pool.length ? pool : bank; // 无该难度题则全库随机
      q = use[U.randInt(0, use.length - 1)].gen();
    } else {
      q = fallbackLocal(topic);
    }
    return Object.assign({ source: 'local', diff }, q);
  }

  // ==================== 判卷 ====================
  function submitAnswer(payload) {
    phase = 'result'; judge = null;
    render(document.getElementById('view'));

    const answerText = quiz.type === 'choice' ? payload.choice : (payload.steps.filter(Boolean).join(' → ') + ' 结论：' + payload.final);
    const useAI = AI.configured();

    if (useAI) {
      const ask = '题目：' + quiz.stem + '\n标准答案：' + quiz.answer + '\n参考解析：' + quiz.solution +
        '\n学生作答：' + answerText + '\n该生易错点：' + Store.weekTopMistakes().map(t => (DB.MISTAKE_TYPES[t.key] || {}).name).join('、');
      AI.chatJSON(AI.JUDGE_PROMPT, ask).then(j => {
        judge = normalizeJudge(j, 'ai');
        commitResult(answerText);
      }).catch(() => {
        judge = localJudge(payload);
        commitResult(answerText);
      });
    } else {
      judge = localJudge(payload);
      commitResult(answerText);
    }
  }

  function normalizeJudge(j, source) {
    return {
      score: U.clamp(parseInt(j.score, 10) || 0, 0, 100),
      verdict: j.verdict || (j.score >= 80 ? '对' : j.score >= 40 ? '部分对' : '错'),
      steps: Array.isArray(j.steps) ? j.steps : [],
      errorType: j.errorType || 'none',
      comment: j.comment || '',
      source
    };
  }

  // 本地规则判卷（离线）
  function localJudge(payload) {
    if (quiz.type === 'choice') {
      const right = String(payload.choice).trim().toUpperCase() === String(quiz.answer).trim().toUpperCase().replace(/[^A-D]/g, '');
      return { score: right ? 100 : 0, verdict: right ? '对' : '错', steps: [{ point: '选项判定', got: right, note: right ? '正确' : '应为 ' + quiz.answer }], errorType: right ? 'none' : 'concept', comment: right ? '选对。' : '选错，对照解析找概念漏洞。', source: 'local' };
    }
    const steps = (payload.steps || []).filter(s => s && s.trim());
    let score = 40;
    const flags = [];
    if (steps.length >= 3) score += 20; else flags.push({ point: '步骤完整度', got: false, note: '只写了 ' + steps.length + ' 步，疑似跳步' });
    if (payload.final && payload.final.trim()) score += 20; else flags.push({ point: '最终结论', got: false, note: '未写最终结论' });
    const allText = steps.join(' ') + ' ' + (payload.final || '');
    // 危险模式：双负号 / 负号结尾
    if (/-\s*-|\d\s+-\s*$|-\s*$/.test(allText)) { score -= 20; flags.push({ point: '符号检查', got: false, note: '检测到疑似后置/双写负号' }); }
    // 分式：出现 a/b 但未出现"通分/分母"字样
    if (/\d\s*\/\s*\d/.test(allText) && !/通分|分母|公分母/.test(allText)) { score -= 15; flags.push({ point: '分式检查', got: false, note: '分式未见通分痕迹，疑似漏分母' }); }
    score = U.clamp(score, 0, 100);
    const errType = flags.some(f => f.point === '符号检查') ? 'sign' : flags.some(f => f.point === '分式检查') ? 'fraction' : flags.length ? 'careless' : 'none';
    if (!flags.length) flags.push({ point: '流程规范', got: true, note: '步骤完整，未检出危险模式' });
    return { score, verdict: score >= 80 ? '对' : score >= 40 ? '部分对' : '错', steps: flags, errorType: errType, comment: '本地规则评分（无AI，配置Key可得逐点精评）。', source: 'local' };
  }

  // ==================== 自动回写 ====================
  function commitResult(answerText) {
    const topic = allTopics().find(t => t.id === topicId);
    const score = judge.score;
    const level = score >= 80 ? 2 : score >= 50 ? 1 : 0;
    Store.update(s => {
      s.heat[topicId] = { level, score, updatedAt: new Date().toISOString() };
      if (score < 80 && judge.errorType && judge.errorType !== 'none') {
        s.mistakes.push({
          id: U.uid(), subject: topic.id[0] === 'm' ? 'math' : 'ctrl', type: judge.errorType,
          desc: '【AI测验】' + topic.name + '：' + (judge.comment || '作答有误'),
          date: U.shortDate(), createdAt: new Date().toISOString()
        });
      }
      if (topic.tier === 1 && score < 90) {
        for (let i = 0; i < 5; i++) {
          s.mistakeDrills.push({ id: U.uid(), source: 'topic', refId: topicId, title: '【罚练】' + topic.name + ' 同类题 ' + (i + 1) + '/5', subject: topic.id[0] === 'm' ? 'math' : 'ctrl', status: 'pending', penaltyOf: topicId, createdAt: new Date().toISOString() });
        }
      }
      s.quizHistory = s.quizHistory || [];
      s.quizHistory.push({ id: U.uid(), topicId, topicName: topic.name, score, verdict: judge.verdict, date: U.shortDate(), createdAt: new Date().toISOString(), source: judge.source });
      if (s.quizHistory.length > 100) s.quizHistory = s.quizHistory.slice(-100);
    });

    if (judge.errorType === 'sign') {
      setTimeout(() => {
        Modal.open({
          title: '⚠️ 符号错误自动捕获',
          html: '<p>判卷确认你又犯了<b>符号错误</b>（已自动记入错题本）。</p><p>强制复读：<b>负号立即提到最前面，不留在后面。</b></p>',
          actions: [{ label: '收到，下题前置符号', kind: 'btn-primary' }]
        });
      }, 600);
    }
    render(document.getElementById('view'));
  }

  // ==================== 渲染 ====================
  function render(el) {
    if (!el) return;
    if (phase === 'pick') renderPick(el);
    else if (phase === 'quizzing') renderQuiz(el);
    else renderResult(el);
  }

  function renderPick(el) {
    const heat = Store.get().heat;
    const scored = allTopics().map(t => {
      const h = heat[t.id] || {};
      const urgency = (h.level === 0 ? 3 : h.level === 1 ? 2 : 0) + (t.tier === 1 && (h.score == null || h.score < 90) ? 2 : 0);
      return { t, urgency, score: h.score };
    }).sort((a, b) => b.urgency - a.urgency);
    const recommend = scored.slice(0, 6);

    el.innerHTML =
      '<div class="card"><div class="card-title">🤖 AI 智能测验</div>'
      + '<div class="muted-sm">选考点 → 引擎出题（' + (AI.configured() ? '云端AI' : '本地题库') + '）→ 你作答 → <b>自动判卷并回写热力图/错题本</b>，全程不用手动标记。</div>'
      + (AI.configured() ? '<div class="alert alert-ok" style="margin-top:8px">✓ 云端AI已就绪：AI出题 + AI逐点精判</div>'
        : '<div class="alert alert-warn" style="margin-top:8px">当前为本地题库模式（离线）。到设置配API Key可解锁AI自由出题+逐点精判。</div>')
      + '</div>'

      // 难度选择
      + '<div class="card"><div class="card-title">难度</div>'
      + '<div class="seg-row" id="diff-row">'
      + '<button class="seg" data-d="auto">🎯 智能推荐</button>'
      + Object.keys(DIFFS).map(k => '<button class="seg" data-d="' + k + '">' + DIFFS[k].icon + ' ' + DIFFS[k].name + '</button>').join('')
      + '</div>'
      + '<div class="muted-sm" id="diff-hint">' + diffHint() + '</div>'
      + '</div>'

      + '<div class="card"><div class="card-title">🎯 系统推荐（按危险度排序）</div>'
      + recommend.map(r =>
        '<button class="seq-row quiz-pick" data-id="' + r.t.id + '">'
        + '<span class="seq-text">' + r.t.group + ' · ' + r.t.name + ' <span class="muted-sm">' + DB.TIERS[r.t.tier].icon + DB.TIERS[r.t.tier].name + '</span></span>'
        + '<span class="seq-badge" style="color:' + (r.score == null ? '#999' : r.score >= 80 ? 'var(--ok)' : r.score >= 50 ? 'var(--warn)' : 'var(--danger)') + '">' + (r.score == null ? '未测' : r.score + '%') + '</span>'
        + '</button>'
      ).join('')
      + '<div class="muted-sm" style="margin-top:8px">或从全部考点中选：</div>'
      + '<select id="quiz-sel" class="input input-sel" style="margin-top:6px">'
      + allTopics().map(t => '<option value="' + t.id + '">' + t.group + ' · ' + t.name + '（' + DB.TIERS[t.tier].name + '）</option>').join('')
      + '</select>'
      + '<button class="btn btn-primary btn-block" id="quiz-go">开始测验</button>'
      + '</div>'

      + historyHtml();

    // 难度选择交互
    el.querySelectorAll('#diff-row .seg').forEach(b => {
      if (b.getAttribute('data-d') === difficulty) b.classList.add('seg-on');
      b.onclick = () => {
        difficulty = b.getAttribute('data-d');
        el.querySelectorAll('#diff-row .seg').forEach(x => x.classList.remove('seg-on'));
        b.classList.add('seg-on');
        el.querySelector('#diff-hint').textContent = diffHint();
      };
    });

    el.querySelectorAll('.quiz-pick').forEach(b => b.onclick = () => { topicId = b.getAttribute('data-id'); variantOf = null; makeQuiz(); });
    el.querySelector('#quiz-go').onclick = () => { topicId = el.querySelector('#quiz-sel').value; variantOf = null; makeQuiz(); };
  }

  function diffHint() {
    if (difficulty === 'auto') return '智能推荐：按你在该考点的掌握度自动选难度（未测/薄弱→简单，掌握→真题难度，熟练→极难）。';
    const d = DIFFS[difficulty];
    return d.icon + ' ' + d.name + '：' + d.prompt + '。';
  }

  function historyHtml() {
    const his = U.clone(Store.get().quizHistory || []).reverse().slice(0, 8);
    if (!his.length) return '';
    return '<div class="card"><div class="card-title">最近测验</div>'
      + his.map(h => '<div class="his-row"><span>' + h.topicName + ' · ' + h.date + (h.source === 'ai' ? ' <span class="tag tag-ok">AI</span>' : '') + '</span>'
        + '<span class="risk-' + (h.score >= 80 ? 'low' : h.score >= 50 ? 'mid' : 'high') + '">' + h.score + '分</span></div>').join('')
      + '</div>';
  }

  function renderQuiz(el) {
    if (!quiz) {
      el.innerHTML = '<div class="card"><div class="empty">🤖 出题中…（' + (AI.configured() ? '云端AI生成' : '本地题库抽取') + '）</div></div>';
      return;
    }
    let answerUI = '';
    if (quiz.type === 'choice') {
      answerUI = '<div id="quiz-opts">'
        + (quiz.options || []).map(o => {
          const letter = o.trim().charAt(0);
          return '<button class="seq-row quiz-opt" data-v="' + letter + '"><span class="seq-text">' + U.esc(o) + '</span></button>';
        }).join('') + '</div>';
    } else {
      answerUI = '<div class="muted-sm" style="margin:6px 0">分步输入（每步一行，至少2步——这是防跳步强制项）：</div>'
        + [1, 2, 3, 4].map(i => '<textarea class="input step-in quiz-step" data-i="' + (i - 1) + '" rows="2" placeholder="第' + i + '步中间结果' + (i === 4 ? '（可留空）' : '') + '"></textarea>').join('')
        + '<input class="input" id="quiz-final" placeholder="最终结论（必填）" style="margin-top:8px">';
    }

    el.innerHTML =
      '<div class="card"><div class="card-title-row"><span class="card-title">📝 作答中</span>'
      + '<span>'
      + (quiz.diff ? '<span class="tag" style="background:' + (quiz.diff === 'easy' ? '#237804' : quiz.diff === 'medium' ? '#d48806' : quiz.diff === 'real' ? '#d4380d' : '#cf1322') + '">' + DIFFS[quiz.diff].icon + DIFFS[quiz.diff].name + '</span> ' : '')
      + (variantOf ? '<span class="tag tag-red">变式复现</span> ' : '')
      + '<span class="tag ' + (quiz.source === 'ai' ? 'tag-ok' : '') + '">' + (quiz.source === 'ai' ? 'AI出题' : '本地题') + '</span>'
      + '</span></div>'
      + '<div class="quiz-stem">' + formatStem(quiz.stem) + '</div>'
      + '<div class="alert alert-warn" style="margin:10px 0">💣 本题陷阱预警：' + formatStem(quiz.trap || '无') + '</div>'
      + answerUI
      + '<div class="btn-row" style="margin-top:14px">'
      + '<button class="btn btn-primary" id="quiz-submit">提交判卷</button>'
      + '<button class="btn btn-ghost" id="quiz-abandon">放弃本题</button>'
      + '</div></div>';

    bindQuiz(el);
  }

  function formatStem(s) {
    // 用极简LaTeX渲染器处理 $..$ 公式，普通文本转义
    return window.Tex ? Tex.renderInline(s) : U.esc(s).replace(/\n/g, '<br>');
  }

  function bindQuiz(el) {
    let choice = null;
    el.querySelectorAll('.quiz-opt').forEach(b => b.onclick = () => {
      el.querySelectorAll('.quiz-opt').forEach(x => x.classList.remove('opt-on'));
      b.classList.add('opt-on');
      choice = b.getAttribute('data-v');
    });
    el.querySelector('#quiz-abandon').onclick = () => { phase = 'pick'; render(el); };
    el.querySelector('#quiz-submit').onclick = () => {
      if (quiz.type === 'choice') {
        if (!choice) { Toast.warn('请先选择一个选项'); return; }
        submitAnswer({ choice });
      } else {
        const steps = [];
        el.querySelectorAll('.quiz-step').forEach(t => steps.push(t.value));
        const final = el.querySelector('#quiz-final').value.trim();
        if (steps.filter(s => s.trim()).length < 2) { Toast.warn('至少写2步。步骤化就是防跳步，别跳。'); return; }
        if (!final) { Toast.warn('请写最终结论'); return; }
        submitAnswer({ steps, final });
      }
    };
  }

  function renderResult(el) {
    if (!judge) {
      el.innerHTML = '<div class="card"><div class="empty">🤖 判卷中…（' + (AI.configured() ? 'AI逐点精评' : '本地规则评分') + '）</div></div>';
      return;
    }
    const cls = judge.score >= 80 ? 'low' : judge.score >= 50 ? 'mid' : 'high';
    const errMeta = judge.errorType !== 'none' && DB.MISTAKE_TYPES[judge.errorType] ? DB.MISTAKE_TYPES[judge.errorType] : null;

    el.innerHTML =
      '<div class="card"><div class="card-title-row"><span class="card-title">📋 判卷结果</span>'
      + '<span class="tag ' + (judge.source === 'ai' ? 'tag-ok' : '') + '">' + (judge.source === 'ai' ? 'AI精判' : '本地判') + '</span></div>'
      + '<div class="risk-card risk-bg-' + cls + '"><div class="risk-score">' + judge.score + '<span class="risk-max">/100</span></div>'
      + '<div class="risk-label">' + (judge.score >= 80 ? '🟢 ' : judge.score >= 50 ? '🟡 ' : '🔴 ') + U.esc(judge.verdict) + '</div></div>'

      + (judge.steps.length ? '<div class="card-title-sm" style="margin-top:14px">采分点</div>'
        + judge.steps.map(s => '<div class="judge-step"><span class="judge-ico">' + (s.got ? '✅' : '❌') + '</span><span><b>' + U.esc(s.point) + '</b> — ' + U.esc(s.note || '') + '</span></div>').join('') : '')

      + (errMeta ? '<div class="alert alert-danger" style="margin-top:12px">错误类型已标记：<span class="tag" style="background:' + errMeta.color + '">' + errMeta.name + '</span>（已自动记入错题本）</div>' : '')
      + (judge.comment ? '<div class="reason-box" style="margin-top:10px">💬 ' + U.esc(judge.comment) + '</div>' : '')

      + '<div class="card-title-sm" style="margin-top:14px">标准解析</div><div class="report">' + formatStem(quiz.solution || '见教材') + '</div>'

      + '<div class="alert alert-ok" style="margin-top:12px">✓ 已自动回写：热力图「' + U.esc(allTopics().find(t => t.id === topicId).name) + '」掌握度 → ' + judge.score + '%'
      + (judge.score < 80 ? '；错题本+1' + (allTopics().find(t => t.id === topicId).tier === 1 && judge.score < 90 ? '；必拿层罚5题已入重练队列' : '') : '') + '</div>'

      + '<div class="btn-row" style="margin-top:14px">'
      + '<button class="btn btn-primary" id="quiz-next">再来一题（同考点）</button>'
      + '<button class="btn btn-ghost" id="quiz-back">返回选题</button>'
      + '</div></div>';

    el.querySelector('#quiz-next').onclick = () => { makeQuiz(); };
    el.querySelector('#quiz-back').onclick = () => { phase = 'pick'; variantOf = null; render(el); };
  }

  // 错题变式复现入口：从错题本跳入，生成同源变式题
  function startVariant(mistake) {
    // 根据错题科目猜考点：用错误类型映射到一个相关考点，或让用户在选题页确认
    variantOf = {
      topicName: mistake.desc || '综合',
      errorType: mistake.type,
      originDesc: mistake.desc || '（原题描述缺失）'
    };
    // 找一个与错误类型最相关的考点作为默认（符号/分式→定积分换元，概念→对应科目首考点）
    const guessTopic = mistake.subject === 'ctrl' ? DB.TOPICS.ctrl[0].id
      : mistake.type === 'sign' || mistake.type === 'fraction' ? 'm-subst'
      : mistake.type === 'integral' ? 'm-ode' : DB.TOPICS.math[0].id;
    topicId = guessTopic;
    phase = 'pick';
    // 直接进入出题（用变式）
    makeQuiz();
  }

  window.QuizModule = { render, startVariant };
})();
