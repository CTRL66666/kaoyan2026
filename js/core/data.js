/* ============================================================
 * data.js — 静态数据库：科目/考点/院校/红线/熟词僻义/概念图谱/AI预设
 * 全部为内置常量，离线可用
 * ============================================================ */
(function () {
  'use strict';

  const SUBJECTS = {
    math: { name: '数学一', short: '数学', color: '#2f54eb', target: 130, modules: ['高数', '线代', '概率'] },
    ctrl: { name: '自控(含现控)', short: '自控', color: '#237804', target: 135, modules: ['经典控制', '现代控制'] },
    eng: { name: '英语一', short: '英语', color: '#722ed1', target: 70, modules: ['阅读', '作文'] },
    pol: { name: '政治', short: '政治', color: '#595959', target: 65, modules: ['马原', '思修', '史纲', '毛中特'] }
  };

  const MISTAKE_TYPES = {
    sign: { name: '符号错误', color: '#cf1322' },
    fraction: { name: '分式漏分母', color: '#237804' },
    concept: { name: '概念混淆', color: '#2f54eb' },
    integral: { name: '积分因子', color: '#722ed1' },
    careless: { name: '粗心大意', color: '#d48806' },
    other: { name: '其他', color: '#8c8c8c' }
  };

  // ---------- 考点库（热力图 + 分层训练） ----------
  // tier: 1=必拿层(100-110) 2=拔高层(110-125) 3=冲刺层(125-130+)
  const TOPICS = {
    math: [
      { id: 'm-limit', name: '极限计算', tier: 1, group: '高数' },
      { id: 'm-mvt', name: '微分中值定理', tier: 2, group: '高数' },
      { id: 'm-subst', name: '定积分换元', tier: 1, group: '高数' },
      { id: 'm-improper', name: '反常积分判敛', tier: 2, group: '高数' },
      { id: 'm-multi', name: '多元微分', tier: 1, group: '高数' },
      { id: 'm-dint', name: '重积分', tier: 1, group: '高数' },
      { id: 'm-line', name: '曲线曲面积分', tier: 2, group: '高数' },
      { id: 'm-series', name: '级数求和', tier: 3, group: '高数' },
      { id: 'm-ode', name: '微分方程', tier: 1, group: '高数' },
      { id: 'm-det', name: '行列式计算', tier: 1, group: '线代' },
      { id: 'm-matrix', name: '矩阵运算', tier: 1, group: '线代' },
      { id: 'm-vector', name: '向量组相关性', tier: 2, group: '线代' },
      { id: 'm-eigen', name: '特征值/特征向量', tier: 1, group: '线代' },
      { id: 'm-quad', name: '二次型标准化', tier: 2, group: '线代' },
      { id: 'm-posdef', name: '正定判定', tier: 2, group: '线代' },
      { id: 'm-dist', name: '分布函数', tier: 1, group: '概率' },
      { id: 'm-exp', name: '期望方差', tier: 1, group: '概率' },
      { id: 'm-est', name: '参数估计', tier: 2, group: '概率' },
      { id: 'm-hypo', name: '假设检验', tier: 3, group: '概率' }
    ],
    ctrl: [
      { id: 'c-tf', name: '传递函数', tier: 1, group: '经典控制' },
      { id: 'c-time', name: '时域分析', tier: 1, group: '经典控制' },
      { id: 'c-root', name: '根轨迹', tier: 2, group: '经典控制' },
      { id: 'c-freq', name: '频域分析', tier: 2, group: '经典控制' },
      { id: 'c-comp', name: '校正设计', tier: 3, group: '经典控制' },
      { id: 'c-ss', name: '状态空间建模', tier: 1, group: '现代控制' },
      { id: 'c-stm', name: '状态转移矩阵', tier: 2, group: '现代控制' },
      { id: 'c-ctrb', name: '能控能观判据', tier: 2, group: '现代控制' },
      { id: 'c-pole', name: '极点配置', tier: 2, group: '现代控制' },
      { id: 'c-obs', name: '观测器设计', tier: 3, group: '现代控制' },
      { id: 'c-lyap', name: '李雅普诺夫稳定性', tier: 3, group: '现代控制' }
    ]
  };

  const TIERS = {
    1: { name: '必拿层', range: '100-110分', color: '#237804', icon: '🟢', rule: '要求零失误，错一题罚5道同类题' },
    2: { name: '拔高层', range: '110-125分', color: '#d48806', icon: '🟡', rule: '理解套路，建立题型-方法映射' },
    3: { name: '冲刺层', range: '125-130+分', color: '#cf1322', icon: '🔴', rule: '战略性取舍，不恋战' }
  };

  // ---------- 概念依赖图谱（自控） ----------
  // deps: 前置节点id；book: 推荐任务；glossary: 工程↔学术术语对照
  const CONCEPT_GRAPH = [
    { id: 'c-tf', name: '传递函数', x: 60, y: 40, deps: [], book: '胡寿松《自控》P20 例2-1', glossary: [['被控对象', 'plant'], ['放大倍数', '增益 K']] },
    { id: 'c-time', name: '时域分析', x: 60, y: 130, deps: ['c-tf'], book: '胡寿松P75 例3-2', glossary: [['响应快慢', '上升时间 tr'], ['超调', 'σ%']] },
    { id: 'c-root', name: '根轨迹', x: 60, y: 220, deps: ['c-time'], book: '胡寿松P140 例4-3', glossary: [['开环增益', 'K*'], ['分离点', 'breakaway point']] },
    { id: 'c-freq', name: '频域分析', x: 60, y: 310, deps: ['c-root'], book: '胡寿松P180 例5-1', glossary: [['带宽', 'ωb'], ['稳定裕度', 'PM/GM']] },
    { id: 'c-comp', name: '校正设计', x: 60, y: 400, deps: ['c-freq'], book: '胡寿松P240 例6-2', glossary: [['超前校正', 'lead'], ['滞后校正', 'lag']] },
    { id: 'c-ss', name: '状态空间建模', x: 380, y: 40, deps: [], book: '胡寿松(现控)P10 例1-1', glossary: [['刚度', 'Kp 类比'], ['阻尼', 'Kd 类比']] },
    { id: 'c-stm', name: '状态转移矩阵', x: 380, y: 130, deps: ['c-ss'], book: '现控P45 例2-3', glossary: [['矩阵指数', 'e^At'], ['零输入响应', 'Φ(t)x(0)']] },
    { id: 'c-ctrb', name: '能控能观判据', x: 380, y: 220, deps: ['c-stm'], book: '现控P80 例3-1', glossary: [['能控性', 'controllability'], ['秩判据', 'rank test']] },
    { id: 'c-pole', name: '极点配置', x: 380, y: 310, deps: ['c-ctrb'], book: '现控P120 例4-2（8月底验证题）', glossary: [['状态反馈', 'u=-Kx'], ['期望极点', 'desired poles']] },
    { id: 'c-obs', name: '观测器设计', x: 560, y: 220, deps: ['c-pole'], book: '现控P150 例5-1', glossary: [['状态观测', 'observer'], ['估计误差', 'e=x-x̂']] },
    { id: 'c-lyap', name: '李雅普诺夫', x: 560, y: 310, deps: ['c-ctrb'], book: '现控P180 例6-1', glossary: [['渐近稳定', 'asymptotically stable'], ['能量函数', 'V(x)']] }
  ];

  // ---------- 院校数据库 ----------
  const SCHOOLS = {
    hebut: {
      name: '河北工业大学', code: '081100 控制科学与工程（学硕）',
      exam: '初试：897 自动控制原理（现控约35%）', reexam: '复试：F2801（铁律：必须选「过程控制」，禁止「运动控制」）',
      line: '近年复试线≈国家线偏上，专业课给分大方', ratio: '报录比约 4:1',
      pros: ['专业课难度适中、给分友好', '一志愿保护较好', '稳妥首选'],
      cons: ['地域（天津）实习资源弱于上海'],
      career: '京津冀自动化/车企供应链就业够用', score: { diff: 3, region: 3, career: 3 }
    },
    shu: {
      name: '上海大学', code: '控制科学与工程（学硕）',
      exam: '初试：836 自动控制理论（含现控，占比高）', reexam: '复试：微机原理与软硬件（与你的STM32经历高度匹配）',
      line: '复试线高于河工大，对数学一要求高', ratio: '报录比约 6:1',
      pros: ['上海地域+大厂实习机会多', '836现控对口', '复试微机匹配工程背景'],
      cons: ['分数线更高，风险更大', '数学一需≥120才有底气'],
      career: '上海大厂/外企自动化岗首选跳板', score: { diff: 4, region: 5, career: 5 }
    },
    gdut: {
      name: '广东工业大学', code: '控制科学与工程（A-）',
      exam: '初试：自控（难度适中）', reexam: '复试：电路/微机方向可选',
      line: '近年录取约275分', ratio: '招生约120人，名额充足',
      pros: ['控制学科A-，实力强', '招生多、分数友好', '珠三角就业极强'],
      cons: ['学硕名额需核对当年简章'],
      career: '珠三角制造/硬件大厂直通', score: { diff: 2, region: 4, career: 4 }
    },
    futzu: { name: '福州大学', code: '控制科学与工程', exam: '初试：自控', reexam: '复试：综合', line: '国家线附近', ratio: '约 3:1', pros: ['211，稳妥'], cons: ['地域一般'], career: '福建区域就业', score: { diff: 2, region: 2, career: 2 } },
    hfut: { name: '合肥工业大学', code: '控制科学与工程', exam: '初试：自控（含现控）', reexam: '复试：微机/过控', line: '国家线上浮', ratio: '约 4:1', pros: ['211，车企资源（蔚来/比亚迪合肥）'], cons: ['热度上升中'], career: '长三角制造业', score: { diff: 3, region: 3, career: 3 } }
  };

  // ---------- 红线禁令 ----------
  const RED_LINES = [
    { icon: '🔧', title: '初试前绝对禁止硬件项目', desc: '禁止PCB、禁止B站硬件视频、禁止STM32新工程。工程履历已足够，初试前任何硬件投入都是在偷数学的分数。' },
    { icon: '📋', title: '复试科目铁律', desc: 'F2801 必须选「过程控制」，禁止「运动控制」。这是定死的选择，到时候不许犹豫。' },
    { icon: '✍️', title: '数学防呆强制执行', desc: '符号前置、分式三步法（分母→分子→计算）、草稿分区（左乱草/右正稿）。不是建议，是流程。' },
    { icon: '⏰', title: '政治时间红线', desc: '9月前 ≤45分钟/天，11月前 ≤1.5小时/天。政治是提分效率最低的科目，禁止挤占数学/专业课。' },
    { icon: '🎯', title: '拒绝二战思维', desc: '所有规划基于一志愿上岸。不许说"大不了二战"，这个词在本系统是违禁词。' }
  ];

  const FOOLPROOF_CHECKLIST = [
    '草稿纸已分区（左侧乱草 / 右侧正稿）',
    '负号已前置处理，不留在后面',
    '分式合并：先写分母 → 抄分子 → 去括号',
    '积分因子指数符号已反向检查',
    '卡3分钟已标记"?"跳过，不倒推'
  ];

  const FOOLPROOF_REMIND = [
    '符号前置，负号立即提到最前面',
    '分式合并三步法（分母→分子→计算）',
    '草稿分区：左侧乱草，右侧正稿'
  ];

  // 硬件冲动拦截关键词（业务规则3）
  const HARDWARE_KEYWORDS = ['PCB', 'pcb', '硬件', 'B站', 'b站', 'Bilibili', 'bilibili', 'STM32', 'stm32', '单片机', '焊', '电路板', '打板'];

  // ---------- 英语熟词僻义库 ----------
  const VOCAB = [
    { w: 'subject', com: '科目；主题', rare: '受试者；使服从', ex: 'The subjects were tested. 受试者接受了测试。' },
    { w: 'novel', com: '小说', rare: '新颖的', ex: 'a novel approach 一种新颖的方法' },
    { w: 'address', com: '地址', rare: '处理；致辞；探讨', ex: 'address the problem 处理该问题' },
    { w: 'issue', com: '问题', rare: '发行；流出', ex: 'issue a statement 发表声明' },
    { w: 'practice', com: '练习', rare: '惯例；执业', ex: 'common practice 通行惯例' },
    { w: 'term', com: '学期；术语', rare: '条款；(pl.)关系', ex: 'on good terms 关系良好' },
    { w: 'figure', com: '数字；人物', rare: '认为；理解(figure out)', ex: 'I figure that... 我认为…' },
    { w: 'course', com: '课程', rare: '航向；进程', ex: 'change course 改变航向' },
    { w: 'plant', com: '植物', rare: '工厂', ex: 'a power plant 发电厂' },
    { w: 'board', com: '木板', rare: '董事会；登上(车船机)', ex: 'the board of directors 董事会' },
    { w: 'rate', com: '比率', rare: '评价；等级', ex: 'be highly rated 备受好评' },
    { w: 'sound', com: '声音', rare: '健全的；合理的', ex: 'sound advice 合理的建议' },
    { w: 'mean', com: '意思是', rare: '吝啬的；平均的', ex: 'the mean temperature 平均气温' },
    { w: 'fine', com: '好的', rare: '罚款；细微的', ex: 'a heavy fine 高额罚款' },
    { w: 'bill', com: '账单', rare: '法案；钞票', ex: 'pass the bill 通过法案' },
    { w: 'firm', com: '坚固的', rare: '公司', ex: 'a law firm 律所' },
    { w: 'game', com: '游戏', rare: '猎物；博弈', ex: 'big game 大型猎物' },
    { w: 'slip', com: '滑倒', rare: '纸条；疏忽', ex: 'a slip of the pen 笔误' },
    { w: 'policy', com: '政策', rare: '保单', ex: 'an insurance policy 保险单' },
    { w: 'yield', com: '产量', rare: '屈服；让行', ex: 'yield to pressure 屈服于压力' },
    { w: 'secure', com: '安全的', rare: '获得；争取', ex: 'secure a deal 达成交易' },
    { w: 'conduct', com: '行为', rare: '实施；指挥；传导', ex: 'conduct an experiment 做实验' },
    { w: 'account', com: '账户', rare: '解释(account for)；叙述', ex: 'account for 40% 占40%' },
    { w: 'approach', com: '接近', rare: '方法；处理', ex: 'a new approach to X 解决X的新方法' },
    { w: 'concern', com: '关心', rare: '公司；事关；担忧', ex: 'a going concern 持续经营企业' },
    { w: 'present', com: '现在；礼物', rare: '呈现；提交', ex: 'present findings 呈现研究结果' },
    { w: 'content', com: '内容', rare: '满足的；使满意', ex: 'be content with 满足于' },
    { w: 'object', com: '物体', rare: '反对', ex: 'object to the plan 反对该计划' },
    { w: 'produce', com: '生产', rare: '农产品(名词)', ex: 'fresh produce 新鲜农产品' },
    { w: 'minute', com: '分钟', rare: '微小的', ex: 'minute details 细枝末节' }
  ];

  // ---------- 步骤审查器模板 ----------
  const INSPECTOR_TYPES = {
    integral: {
      name: '积分计算',
      steps: [
        { name: '识别积分类型', hint: '换元/分部/有理式/三角？写下判断依据' },
        { name: '选择方法并写出首步', hint: '写出换元式或分部u,v' },
        { name: '执行换元/分部', hint: '⚠️ 负号前置！每一步检查符号' },
        { name: '回代为原变量', hint: '上下限是否同步变换？' },
        { name: '求导验证结果', hint: '对结果求导应等于被积函数' }
      ],
      checks: [
        { key: 'sign', label: '负号检查', desc: '全文搜索负号位置，确认无后置负号' },
        { key: 'verify', label: '求导验证', desc: '结果求导 = 被积函数' }
      ]
    },
    ode: {
      name: '微分方程',
      steps: [
        { name: '判定方程类型', hint: '一阶线性/可分离/齐次/二阶常系数？' },
        { name: '写出标准形', hint: "y'+P(x)y=Q(x)" },
        { name: '计算积分因子', hint: '⚠️ μ=e^∫P dx，指数符号必须反向检查！' },
        { name: '求解并写出通解', hint: '别忘 +C' },
        { name: '代回验证', hint: '代入原方程验证成立' }
      ],
      checks: [
        { key: 'factor', label: '积分因子符号反查', desc: 'e 的指数符号与 P(x) 一致，无漏负号' },
        { key: 'fraction', label: '分式三步法验证', desc: '分母→分子→计算，逐步核对' }
      ]
    },
    matrix: {
      name: '矩阵运算',
      steps: [
        { name: '明确运算目标', hint: '求逆/特征值/秩/对角化？' },
        { name: '写出初等变换第一步', hint: '行变换标记清楚 r1↔r2 等' },
        { name: '逐步运算', hint: '⚠️ 每步只做一个变换，禁止心算跳步' },
        { name: '得到结果', hint: '特征值写全(含重根)' },
        { name: '验算', hint: 'A·A⁻¹=E 或 |A-λE|=0 回代' }
      ],
      checks: [
        { key: 'sign', label: '行列式符号检查', desc: '换行/提公因子产生的符号已处理' }
      ]
    },
    series: {
      name: '级数',
      steps: [
        { name: '判定级数类型', hint: '正项/交错/幂级数？' },
        { name: '选择判敛法', hint: '比值/根值/比较/莱布尼茨' },
        { name: '计算极限', hint: '⚠️ 分式三步法：分母→分子→计算' },
        { name: '得出结论', hint: '收敛域端点单独讨论！' }
      ],
      checks: [
        { key: 'fraction', label: '分式三步法验证', desc: '极限计算中的分式无漏分母' }
      ]
    }
  };

  // ---------- 里程碑 ----------
  const MILESTONES = [
    { id: 'augControl', date: '8月底', title: '现控学习能力验证（独立完成极点配置）', deadline: '08-31' },
    { id: 'octMath', date: '10月底', title: '数学一真题模拟 ≥120分（决定冲上大/守河工大）', deadline: '10-31' },
    { id: 'novProf', date: '11月底', title: '专业课真题二刷完成', deadline: '11-30' },
    { id: 'decPol', date: '12月', title: '政治大题背诵启动', deadline: '12-01' }
  ];

  // ---------- AI 服务预设（一键导入，无需配置提示词） ----------
  const AI_PRESETS = {
    deepseek: { name: 'DeepSeek', endpoint: 'https://api.deepseek.com/v1/chat/completions', model: 'deepseek-chat', hint: 'platform.deepseek.com 申请 API Key' },
    kimi: { name: 'Kimi (月之暗面)', endpoint: 'https://api.moonshot.cn/v1/chat/completions', model: 'moonshot-v1-8k', hint: 'platform.moonshot.cn 申请 API Key' },
    qwen: { name: '通义千问', endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', model: 'qwen-plus', hint: '阿里云百炼平台申请 API Key' },
    zhipu: { name: '智谱 GLM', endpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions', model: 'glm-4-flash', hint: 'bigmodel.cn 申请 API Key（有免费额度）' },
    custom: { name: '自定义 (OpenAI兼容)', endpoint: '', model: '', hint: '任何 OpenAI 兼容接口均可' }
  };

  window.DB = {
    SUBJECTS, MISTAKE_TYPES, TOPICS, TIERS, CONCEPT_GRAPH, SCHOOLS,
    RED_LINES, FOOLPROOF_CHECKLIST, FOOLPROOF_REMIND, HARDWARE_KEYWORDS,
    VOCAB, INSPECTOR_TYPES, MILESTONES, AI_PRESETS
  };
})();
