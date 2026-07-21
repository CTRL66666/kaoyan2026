/* ============================================================
 * store.js — 数据层：localStorage 持久化（key: kaoyan2026_data）
 * 所有模块通过 Store.get()/Store.update() 读写，禁止直接操作 localStorage
 * ============================================================ */
(function () {
  'use strict';
  const KEY = 'kaoyan2026_data';

  // ---------- 默认任务模板（PRD 4.2） ----------
  function defaultTasks() {
    const now = new Date().toISOString();
    const t = (subject, text) => ({ id: U.uid() + Math.random().toString(36).slice(2, 4), subject, text, done: false, createdAt: now });
    return [
      t('math', '高数强化第X章（按当前进度替换章节号）'),
      t('math', '线代：二次型标准化 + 正定判定'),
      t('math', '概率论：参数估计（矩估计/极大似然）'),
      t('ctrl', '现控第X节 + 课后题（按当前进度替换）'),
      t('eng', '阅读真题2篇 + 定位法复盘'),
      t('pol', '马原视频1节 + 肖1000对应章节')
    ];
  }

  // ---------- 初始数据结构（PRD 4.7） ----------
  function initialState() {
    return {
      meta: { createdAt: new Date().toISOString(), version: '2.0.0', lastBackupReminder: '' },
      tasks: defaultTasks(),
      completions: {},            // 'YYYY-MM-DD' -> [taskId...] 每日打卡记录
      taskArchive: {},            // 'YYYY-MM-DD' -> [{subject,text,done}] 前日任务归档（供复盘统计）
      mistakes: [],               // {id, subject, type, desc, date:'M.D', createdAt}
      studyHours: {},             // 'YYYY-MM-DD' -> hours（当天累计）
      focus: { sessions: [], todayCount: 0, todayDate: '' },  // {id,date:'YYYY-MM-DD',mins,subject,endedAt,aborted}
      weeklyStats: {},            // 'YYYY-Www' -> {totalHours,targetHours,mathAccuracy,prevAccuracy,mainErrorTypes:[],mentalState,specialEvent}
      milestones: { augControl: false, octMath: false, novProf: false, decPol: false },
      progress: {
        math: { percent: 0, stage: '强化阶段', modules: { '高数': 0, '线代': 0, '概率': 0 } },
        ctrl: { percent: 0, stage: '强化阶段', modules: { '经典控制': 0, '现代控制': 0 } },
        eng: { percent: 0, stage: '真题阶段', modules: { '阅读': 0, '作文': 0 } },
        pol: { percent: 0, stage: '基础阶段', modules: { '马原': 0, '思修': 0, '史纲': 0, '毛中特': 0 } }
      },
      heat: {},                   // topicId -> {level:0|1|2, score:0-100|null, updatedAt}
      mistakeDrills: [],          // 错题重练队列 {id, source:'mistake'|'topic', refId, title, subject, status:'pending'|'done', createdAt, penaltyOf}
      mental: [],                 // {id, date, mood:1-10, fatigue:'fresh'|'tired'|'exhausted'|'giveup', jumpy:bool, hwUrge:bool, stuck}
      reading: { results: [], cards: {}, customVocab: [] }, // results:{id,date,source,answer,choice,correct,secs}; cards: wordKey -> {box:1-5, due:'YYYY-MM-DD'}; customVocab: 用户自定义词
      decision: { inputs: { mathSims: [], profScore: '', engAccuracy: '', polProgress: 0, xiankongScore: 5 }, result: null, updatedAt: '' },
      inspector: { runs: [] },    // {id,date,type,risk,flags:[]}
      ai: { endpoint: '', key: '', model: '', preset: '' },
      settings: { targetSchool: 'undecided', examDate: '2026-12-26', weeklyTargetHours: 50, onboarded: false },
      alerts: { lastXiankongWarn: '', lastNovPush: '' }
    };
  }

  let cache = null;

  const Store = {
    KEY,
    // 读取整个状态（带缓存）。首次或损坏时回退到初始结构
    get() {
      if (cache) return cache;
      try {
        const raw = localStorage.getItem(KEY);
        if (!raw) { cache = initialState(); Store.save(); return cache; }
        const data = JSON.parse(raw);
        cache = Store.migrate(data);
        return cache;
      } catch (e) {
        console.error('[Store] 数据损坏，已重置', e);
        cache = initialState(); Store.save();
        return cache;
      }
    },
    // 结构补齐：老数据缺字段时合并默认值（非破坏性）
    migrate(data) {
      const base = initialState();
      function merge(def, cur) {
        if (cur == null) return def;
        if (Array.isArray(def)) return Array.isArray(cur) ? cur : def;
        if (typeof def === 'object' && def !== null) {
          const out = {};
          Object.keys(def).forEach(k => { out[k] = merge(def[k], cur[k]); });
          // 保留 cur 中多出来的键（前向兼容）
          Object.keys(cur).forEach(k => { if (!(k in out)) out[k] = cur[k]; });
          return out;
        }
        return cur;
      }
      return merge(base, data);
    },
    save() { try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch (e) { console.error('[Store] 保存失败', e); if (window.Toast) Toast.show('存储失败：空间不足，请导出备份后清理', 'danger'); } },
    // 函数式更新：Store.update(s => { s.xxx = ... })
    update(fn) { const s = Store.get(); fn(s); Store.save(); U.emit('store:change'); return s; },
    replace(data) { cache = Store.migrate(data); Store.save(); U.emit('store:change'); },
    resetAll() { cache = initialState(); Store.save(); U.emit('store:change'); },
    exportJSON() { return JSON.stringify(Store.get(), null, 2); },
    usageBytes() { const raw = localStorage.getItem(KEY) || ''; return raw.length * 2; }, // UTF-16 粗算

    // ---------- 跨模块查询助手 ----------
    // 今日完成的任务数/总数（按科目）
    todayTaskStats() {
      const s = Store.get();
      const doneIds = s.completions[U.dkey()] || [];
      const stats = { math: [0, 0], ctrl: [0, 0], eng: [0, 0], pol: [0, 0] };
      s.tasks.forEach(t => {
        if (!stats[t.subject]) return;
        stats[t.subject][1]++;
        if (t.done || doneIds.indexOf(t.id) >= 0) stats[t.subject][0]++;
      });
      return stats;
    },
    // 今日是否全部完成
    todayAllDone() {
      const st = Store.todayTaskStats();
      let total = 0, done = 0;
      Object.keys(st).forEach(k => { total += st[k][1]; done += st[k][0]; });
      return total > 0 && done === total;
    },
    // 本周7天学习时长数组（周一至周日）
    weekHours() {
      const s = Store.get();
      return U.weekKeys().map(k => s.studyHours[k] || 0);
    },
    // 今天已累计时长
    todayHours() { return Store.get().studyHours[U.dkey()] || 0; },
    addHours(h) { Store.update(s => { const k = U.dkey(); s.studyHours[k] = U.round1((s.studyHours[k] || 0) + h); }); },
    // 今日某错误类型次数
    mistakeCountToday(type) {
      const today = U.dkey();
      return Store.get().mistakes.filter(m => (m.createdAt || '').slice(0, 10) === today && (!type || m.type === type)).length;
    },
    // 本周某错误类型次数
    mistakeCountWeek(type) {
      return Store.get().mistakes.filter(m => U.inThisWeek((m.createdAt || '').slice(0, 10)) && (!type || m.type === type)).length;
    },
    // 本周错误类型Top2 → [{key,count}]
    weekTopMistakes() {
      const list = Store.get().mistakes.filter(m => U.inThisWeek((m.createdAt || '').slice(0, 10)));
      return U.topN(U.countBy(list, m => m.type), 2);
    },
    // 最近n天数学正确率（从 weeklyStats 取本周；无则null）
    currentMathAccuracy() {
      const s = Store.get();
      const wk = Store.weekKey();
      const w = s.weeklyStats[wk];
      return w && typeof w.mathAccuracy === 'number' ? w.mathAccuracy : null;
    },
    weekKey(d) {
      d = d || new Date();
      const m = U.weekMonday(d);
      const y = m.getFullYear();
      // ISO周数近似
      const jan1 = new Date(y, 0, 1);
      const week = Math.ceil((((m - jan1) / U.DAY_MS) + jan1.getDay() + 1) / 7);
      return y + '-W' + String(week).padStart(2, '0');
    },
    // 现控掌握度（decision.inputs.xiankongScore 自评 1-10）
    xiankongScore() { return Store.get().decision.inputs.xiankongScore || 0; },
    // 现控模块进度（progress.ctrl.modules['现代控制']）
    xiankongPercent() { const m = Store.get().progress.ctrl.modules; return m['现代控制'] || 0; },
    // 近3天是否有某科目打卡
    subjectDoneInDays(subject, days) {
      const s = Store.get();
      const keys = U.lastNDays(days);
      // 已完成任务看 completions + tasks.done；近似：今天看任务，历史看 taskArchive
      for (const k of keys) {
        if (k === U.dkey()) {
          const doneIds = s.completions[k] || [];
          if (s.tasks.some(t => t.subject === subject && (t.done || doneIds.indexOf(t.id) >= 0))) return true;
        } else {
          const arch = s.taskArchive[k] || [];
          if (arch.some(t => t.subject === subject && t.done)) return true;
        }
      }
      return false;
    }
  };

  window.Store = Store;
})();
