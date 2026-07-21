/* ============================================================
 * onboarding.js — 首次使用引导（5步）
 * 欢迎+倒计时 → 各科进度 → 本周时间 → 目标院校 → 生成模板+防呆教学
 * ============================================================ */
(function () {
  'use strict';
  let step = 0;
  const collected = { progress: {}, hours: { workday: 4, weekend: 8 }, school: 'undecided' };

  function show() {
    step = 0;
    collected.progress = {};
    renderStep();
  }

  function shell(inner, foot) {
    Modal.open({
      title: '🎖 26考研全能作战系统 · 初始化',
      wide: true, dismissable: false,
      html: '<div class="ob-steps">' + [0, 1, 2, 3, 4].map(i => '<span class="ob-dot' + (i <= step ? ' ob-on' : '') + '">' + (i + 1) + '</span>').join('') + '</div>' + inner,
      actions: foot
    });
  }

  function renderStep() {
    if (step === 0) {
      const left = U.daysTo('2026-12-26');
      shell(
        '<h3 class="ob-h">欢迎，考生。</h3>'
        + '<p>距离2026考研初试还有 <b class="ob-big">' + left + '</b> 天。</p>'
        + '<p>本系统是你的"外接大脑"：规划、追踪、复盘、防错、心理干预五位一体。所有规则都为一个目标服务——<b>一志愿上岸，拒绝二战</b>。</p>'
        + '<p class="muted-sm">接下来用1分钟完成初始化：各科进度 → 可用时间 → 目标院校 → 防呆教学。</p>',
        [{ label: '开始初始化 →', kind: 'btn-primary', onClick: c => { step = 1; renderStep(); } }]
      );
    } else if (step === 1) {
      const fields = [
        ['math', '数学一', '高数/线代/概率 各到第几章？（文字描述）'],
        ['ctrl', '自控', '经典控制/现控 各到第几节？'],
        ['eng', '英语一', '真题做到哪一年？单词几轮？'],
        ['pol', '政治', '马原开始了吗？']
      ];
      shell(
        '<h3 class="ob-h">各科目当前进度</h3>'
        + fields.map(f =>
          '<label class="fld" style="margin-bottom:10px"><span><b>' + f[1] + '</b> — ' + f[2] + '</span>'
          + '<input class="input ob-prog" data-k="' + f[0] + '" placeholder="如：高数到第6章，线代未开始"></label>'
        ).join('')
        + '<div class="muted-sm">顺便录入各科总进度百分比（粗略即可）：</div>'
        + ['math', 'ctrl', 'eng', 'pol'].map(k =>
          '<label class="fld fld-inline"><span>' + DB.SUBJECTS[k].short + '</span><input class="input ob-pct" data-k="' + k + '" type="number" min="0" max="100" value="10"> %</label>'
        ).join(''),
        [
          { label: '← 上一步', onClick: () => { step = 0; renderStep(); } },
          {
            label: '下一步 →', kind: 'btn-primary', onClick: () => {
              document.querySelectorAll('.ob-prog').forEach(i => collected.progress[i.getAttribute('data-k')] = i.value.trim());
              document.querySelectorAll('.ob-pct').forEach(i => collected.progress[i.getAttribute('data-k') + '_pct'] = U.clamp(+i.value || 0, 0, 100));
              step = 2; renderStep();
            }
          }
        ]
      );
    } else if (step === 2) {
      shell(
        '<h3 class="ob-h">本周可用时间</h3>'
        + '<label class="fld" style="margin-bottom:10px"><span>工作日每天可学几小时？</span>'
        + '<input id="ob-wd" class="input" type="number" min="1" max="16" value="4"></label>'
        + '<label class="fld"><span>周末每天可学几小时？</span>'
        + '<input id="ob-we" class="input" type="number" min="1" max="16" value="8"></label>'
        + '<div class="muted-sm">系统将按 5×工作日 + 2×周末 计算每周目标时长。</div>',
        [
          { label: '← 上一步', onClick: () => { step = 1; renderStep(); } },
          {
            label: '下一步 →', kind: 'btn-primary', onClick: () => {
              collected.hours.workday = U.clamp(+document.getElementById('ob-wd').value || 4, 1, 16);
              collected.hours.weekend = U.clamp(+document.getElementById('ob-we').value || 8, 1, 16);
              step = 3; renderStep();
            }
          }
        ]
      );
    } else if (step === 3) {
      collected.school = 'undecided'; // 进入本步时重置默认，防止快速回退/前进导致旧值残留
      shell(
        '<h3 class="ob-h">目标院校</h3>'
        + '<p>主目标河工大（081100），备选上大（并行主攻）。现在不确定也没关系——<b>10月底系统会用数学模拟分替你做决策</b>。</p>'
        + '<div class="seg-row">'
        + '<button class="seg ob-school" data-v="hebut">河北工业大学</button>'
        + '<button class="seg ob-school" data-v="shu">上海大学</button>'
        + '<button class="seg ob-school seg-on" data-v="undecided">未确定（推荐）</button>'
        + '</div>',
        [
          { label: '← 上一步', onClick: () => { step = 2; renderStep(); } },
          { label: '下一步 →', kind: 'btn-primary', onClick: () => { step = 4; renderStep(); } }
        ]
      );
      document.querySelectorAll('.ob-school').forEach(b => b.onclick = () => {
        document.querySelectorAll('.ob-school').forEach(x => x.classList.remove('seg-on'));
        b.classList.add('seg-on');
        collected.school = b.getAttribute('data-v');
      });
    } else if (step === 4) {
      const weekly = collected.hours.workday * 5 + collected.hours.weekend * 2;
      shell(
        '<h3 class="ob-h">最后一课：防呆检查清单</h3>'
        + '<p>你的致命弱点不是不会，而是<b>符号、分式、积分因子</b>。所以每次做数学题前，必须在「红线禁令」页逐项勾选：</p>'
        + '<div class="warn-box"><div class="warn-body">'
        + DB.FOOLPROOF_CHECKLIST.map((c, i) => (i + 1) + '. ' + c).join('<br>')
        + '</div></div>'
        + '<p class="muted-sm">每周目标时长已定为 <b>' + weekly + 'h</b>（可在设置中调整）。初始任务模板与4个里程碑已生成。</p>',
        [{
          label: '✓ 完成初始化，进入系统', kind: 'btn-primary', onClick: c => {
            Store.update(s => {
              ['math', 'ctrl', 'eng', 'pol'].forEach(k => {
                s.progress[k].percent = collected.progress[k + '_pct'] || 0;
                if (collected.progress[k]) s.progress[k].stage = collected.progress[k];
              });
              s.settings.weeklyTargetHours = collected.hours.workday * 5 + collected.hours.weekend * 2;
              s.settings.targetSchool = collected.school;
              s.settings.onboarded = true;
            });
            c();
            Toast.success('初始化完成。一志愿上岸，开工。');
            App.refresh();
          }
        }]
      );
    }
  }

  window.Onboarding = { show, needed: function () { return !Store.get().settings.onboarded; } };
})();
