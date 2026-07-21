/* ============================================================
 * settings.js — 设置：目标院校 / 数据导出导入 / 云端AI / 危险区
 * ============================================================ */
(function () {
  'use strict';

  function render(el) {
    const s = Store.get();
    const usage = Store.usageBytes();
    const usageKB = Math.round(usage / 1024 * 10) / 10;
    const usagePct = Math.min(100, Math.round(usage / (5 * 1024 * 1024) * 100));

    el.innerHTML =
      // 目标院校
      '<div class="card"><div class="card-title">目标院校</div>'
      + '<div class="seg-row">'
      + [['hebut', '河北工业大学'], ['shu', '上海大学'], ['undecided', '未确定']].map(o =>
        '<button class="seg' + (s.settings.targetSchool === o[0] ? ' seg-on' : '') + '" data-school="' + o[0] + '">' + o[1] + '</button>').join('')
      + '</div>'
      + '<div class="muted-sm">10月决策前建议保持「未确定」，让数据说话。决策参谋给出的建议才可覆盖。</div>'
      + '</div>'

      // 周目标
      + '<div class="card"><div class="card-title">每周目标时长</div>'
      + '<div class="add-row"><input id="st-target" class="input" type="number" min="10" max="100" value="' + (s.settings.weeklyTargetHours || 50) + '"><button class="btn btn-primary" id="st-target-save">保存</button></div>'
      + '</div>'

      // 数据
      + '<div class="card"><div class="card-title">数据管理</div>'
      + '<div class="muted-sm">本地存储占用：' + usageKB + ' KB / 约 5MB 上限（' + usagePct + '%）。数据仅存于本浏览器，换设备/清缓存前务必导出备份。</div>'
      + '<div class="btn-row" style="margin-top:10px">'
      + '<button class="btn btn-primary" id="st-export">导出JSON备份</button>'
      + '<button class="btn btn-ghost" id="st-import">导入JSON恢复</button>'
      + '<button class="btn btn-ghost" id="st-summary">复制AI周摘要</button>'
      + '</div>'
      + '<input type="file" id="st-file" accept=".json" style="display:none">'
      + '</div>'

      // 云端AI
      + '<div class="card"><div class="card-title">🤖 云端 AI（可选）</div>'
      + '<div class="muted-sm">本地规则引擎已覆盖排程/预警/周报。需要 AI 深度复盘时，选择预设一键导入——提示词已内置，你只需填 API Key。</div>'
      + '<div class="form-grid" style="margin-top:10px">'
      + '<label class="fld"><span>服务预设</span><select id="ai-preset" class="input input-sel">'
      + Object.keys(DB.AI_PRESETS).map(k => '<option value="' + k + '"' + (s.ai.preset === k ? ' selected' : '') + '>' + DB.AI_PRESETS[k].name + '</option>').join('')
      + '</select></label>'
      + '<label class="fld"><span>API Key</span><input id="ai-key" class="input" type="password" value="' + U.esc(s.ai.key) + '" placeholder="sk-..."></label>'
      + '<label class="fld fld-full"><span>接口地址（Endpoint）</span><input id="ai-endpoint" class="input" value="' + U.esc(s.ai.endpoint) + '"></label>'
      + '<label class="fld"><span>模型</span><input id="ai-model" class="input" value="' + U.esc(s.ai.model) + '"></label>'
      + '</div>'
      + '<div class="muted-sm" id="ai-hint">' + U.esc((DB.AI_PRESETS[s.ai.preset] || DB.AI_PRESETS.deepseek).hint) + '</div>'
      + '<div class="btn-row" style="margin-top:10px">'
      + '<button class="btn btn-primary" id="ai-save">保存配置</button>'
      + '<button class="btn btn-ghost" id="ai-test">测试连通</button>'
      + '</div></div>'

      // 危险区
      + '<div class="card"><div class="card-title card-title-red">危险区</div>'
      + '<button class="btn btn-danger" id="st-reset">清空全部数据并重置</button>'
      + '</div>';

    bind(el);
  }

  function bind(el) {
    el.querySelectorAll('[data-school]').forEach(b => b.onclick = () => {
      Store.update(s => { s.settings.targetSchool = b.getAttribute('data-school'); });
      Toast.success('目标已更新'); render(el);
    });

    el.querySelector('#st-target-save').onclick = () => {
      const v = U.clamp(+el.querySelector('#st-target').value || 50, 10, 100);
      Store.update(s => { s.settings.weeklyTargetHours = v; });
      Toast.success('周目标已设为 ' + v + 'h');
    };

    el.querySelector('#st-export').onclick = () => {
      U.download('kaoyan2026_backup_' + U.dkey() + '.json', Store.exportJSON());
      Store.update(s => { s.meta.lastBackupReminder = U.dkey(); });
      Toast.success('备份已导出，请妥善保存');
    };

    el.querySelector('#st-import').onclick = () => el.querySelector('#st-file').click();
    el.querySelector('#st-file').onchange = e => {
      const f = e.target.files[0];
      if (!f) return;
      const rd = new FileReader();
      rd.onload = () => {
        try {
          const data = JSON.parse(rd.result);
          if (!data.tasks || !data.settings) throw new Error('文件结构不符');
          Modal.confirm('导入确认', '<p>将用备份覆盖当前全部数据（当前数据建议先导出）。继续？</p>', '覆盖导入', () => {
            Store.replace(data);
            Toast.success('导入成功');
            App.refresh();
          }, true);
        } catch (err) { Toast.danger('导入失败：' + err.message); }
      };
      rd.readAsText(f);
      e.target.value = '';
    };

    el.querySelector('#st-summary').onclick = () => {
      const txt = AI.weeklySummary();
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => Toast.success('周摘要已复制，可粘贴给任何AI'));
      else Toast.show(txt, 'info', 8000);
    };

    // AI 配置
    const presetSel = el.querySelector('#ai-preset');
    presetSel.onchange = () => {
      AI.applyPreset(presetSel.value);
      const p = DB.AI_PRESETS[presetSel.value];
      el.querySelector('#ai-endpoint').value = p.endpoint;
      el.querySelector('#ai-model').value = p.model;
      el.querySelector('#ai-hint').textContent = p.hint;
    };
    el.querySelector('#ai-save').onclick = () => {
      Store.update(s => {
        s.ai.key = el.querySelector('#ai-key').value.trim();
        s.ai.endpoint = el.querySelector('#ai-endpoint').value.trim();
        s.ai.model = el.querySelector('#ai-model').value.trim();
      });
      Toast.success('AI 配置已保存' + (AI.configured() ? '，可直接使用AI复盘' : ''));
    };
    el.querySelector('#ai-test').onclick = () => {
      el.querySelector('#ai-save').onclick();
      if (!AI.configured()) { Toast.warn('请先完整填写配置'); return; }
      Toast.show('正在测试连通…', 'info');
      AI.test().then(t => Toast.success('连通正常：' + t)).catch(e => Toast.danger('测试失败：' + e.message));
    };

    el.querySelector('#st-reset').onclick = () => {
      Modal.open({
        title: '⚠️ 最终确认',
        html: '<p><b>此操作非常危险，可能导致不可逆的数据丢失！</b></p><p>将清空：全部任务、错题、时长、心理状态、考点掌握度、AI配置。</p><p>强烈建议先「导出JSON备份」。</p>',
        actions: [
          { label: '取消' },
          { label: '我已备份，确认清空', kind: 'btn-danger', onClick: close => { Store.resetAll(); close(); Toast.success('已重置'); App.refresh(); } }
        ]
      });
    };
  }

  window.SettingsModule = { render };
})();
