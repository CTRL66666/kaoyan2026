/* ============================================================
 * alerts.js — 每日预警检查（业务规则4 & 5 + 备份提醒）
 *  4. 现控进度<40% 且日期>8月15日 → 每日首次打开黄色预警弹窗
 *  5. 10月底里程碑未勾选 → 11月1日起每日推送院校决策建议
 * ============================================================ */
(function () {
  'use strict';

  function runDailyChecks() {
    const s = Store.get();
    const today = U.dkey();
    const now = new Date();
    const y = now.getFullYear();
    const md = (now.getMonth() + 1) * 100 + now.getDate(); // MMDD 数字

    // --- 规则4：现控预警（8月15日后，现控<40%，每日首次） ---
    if (md >= 815 && Store.xiankongPercent() < 40 && s.alerts.lastXiankongWarn !== today) {
      Store.update(x => { x.alerts.lastXiankongWarn = today; });
      Modal.open({
        title: '⚠️ 现控黄色预警',
        html: '<p>今天是 ' + (now.getMonth() + 1) + '月' + now.getDate() + '日，你的现控进度为 <b>' + Store.xiankongPercent() + '%</b>（&lt;40%）。</p>'
          + '<p><b>8月底前必须独立完成极点配置，否则触发备选院校切换。</b></p>'
          + '<p class="muted-sm">建议：今天起每天固定1小时现控，按概念图谱顺序推进：状态转移矩阵 → 能控能观 → 极点配置。</p>',
        actions: [
          { label: '去概念图谱', kind: 'btn-primary', onClick: c => { c(); App.go('concept'); } },
          { label: '知道了', kind: 'btn-ghost' }
        ]
      });
      return; // 一次只弹一个，避免轰炸
    }

    // --- 规则5：11月1日决策推送（10月底里程碑未勾选） ---
    if (md >= 1101 && !s.milestones.octMath && s.alerts.lastNovPush !== today) {
      Store.update(x => { x.alerts.lastNovPush = today; });
      Modal.open({
        title: '⚖️ 院校决策提醒',
        html: '<p>已到11月，「数学一真题模拟≥120分」里程碑尚未勾选。</p>'
          + '<p><b>请立即根据数学成绩决定冲上大还是守河工大。</b>报名窗口不等人，用数据说话，不要凭感觉。</p>',
        actions: [
          { label: '去决策参谋', kind: 'btn-primary', onClick: c => { c(); App.go('decision'); } },
          { label: '稍后', kind: 'btn-ghost' }
        ]
      });
      return;
    }

    // --- 存储备份提醒（占用>60% 或 7天未备份，每周提醒一次） ---
    const usagePct = Store.usageBytes() / (5 * 1024 * 1024);
    const lastBak = s.meta.lastBackupReminder || '';
    const daysSinceBak = lastBak ? (Date.now() - new Date(lastBak).getTime()) / U.DAY_MS : 999;
    if ((usagePct > 0.6 || daysSinceBak > 7) && s.alerts['lastBakWarn'] !== today) {
      Store.update(x => { x.alerts.lastBakWarn = today; });
      Toast.warn('💾 已' + Math.floor(daysSinceBak) + '天未导出备份。数据只存在本浏览器，建议立即导出（设置 → 导出JSON备份）。', 6000);
    }
  }

  // 仪表盘预警条（非弹窗，常显）
  function bannerHtml() {
    const s = Store.get();
    const now = new Date();
    const md = (now.getMonth() + 1) * 100 + now.getDate();
    const out = [];
    if (md >= 815 && Store.xiankongPercent() < 40) {
      out.push('<div class="alert alert-warn">⚠️ 现控 ' + Store.xiankongPercent() + '% &lt; 40%：8月底前需独立完成极点配置，否则触发备选切换。</div>');
    }
    if (md >= 1101 && !s.milestones.octMath) {
      out.push('<div class="alert alert-danger">⚖️ 11月已到而数学模拟里程碑未达成：<a href="javascript:App.go(\'decision\')">立即去决策参谋定院校 →</a></div>');
    }
    if (Store.mistakeCountWeek('sign') > 3) {
      out.push('<div class="alert alert-warn">✍️ 本周符号错误 ' + Store.mistakeCountWeek('sign') + ' 次 &gt; 3次：智能排程已强制插入符号专项。</div>');
    }
    return out.join('');
  }

  window.Alerts = { runDailyChecks, bannerHtml };
})();
