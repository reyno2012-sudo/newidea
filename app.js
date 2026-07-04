const state = {
  activePanel: "idea",
  mode: "quick",
  idea: "",
  market: "中国一线和新一线城市",
  format: "Web / 小程序",
  doubt: "需求是否真实，是否已有强竞品",
  answers: {},
  hypotheses: []
};

const modeCopy = {
  quick: "3 分钟形成第一版判断，适合刚冒出来的想法。",
  standard: "面向准备做 MVP 的团队，补充竞品、用户和商业模式细节。",
  deep: "面向立项、融资或企业创新，扩展为深度研究与路演材料。"
};

const statusCycle = ["unverified", "partial", "confirmed"];
const statusLabel = {
  unverified: "未验证",
  partial: "部分验证",
  confirmed: "已确认"
};

const examples = {
  toy: "我想做一个面向年轻父母的儿童旧玩具交换平台，通过社区活动和会员服务盈利，这个方向是否值得做？",
  elder: "我想做一个老人陪伴生活辅助平台，为独居或半独居老人提供陪伴聊天、用药提醒、医院陪护提醒、生活辅助和紧急求助服务。"
};

const answerSelectors = [
  "#answerUser",
  "#answerAlternative",
  "#answerDiff",
  "#answerValidation",
  "#answerPains",
  "#answerScenes",
  "#answerPayment",
  "#answerCompetitors",
  "#answerPersona",
  "#answerFeatures",
  "#answerRisks"
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function activatePanel(panelName) {
  state.activePanel = panelName;
  $$(".panel").forEach((panel) => {
    panel.classList.toggle("active-panel", panel.dataset.panel === panelName);
  });
  $$(".step").forEach((step) => {
    step.classList.toggle("is-active", step.dataset.stepJump === panelName);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deriveProjectName(idea) {
  if (!idea.trim()) return "未命名项目";
  if (idea.includes("玩具")) return "儿童旧玩具交换平台";
  if (idea.includes("老人") || idea.includes("陪伴") || idea.includes("用药")) return "老人陪伴生活辅助";
  if (idea.includes("大学生") || idea.includes("兼职")) return "大学生兼职 AI 平台";
  if (idea.includes("独立开发者") || idea.includes("SaaS")) return "独立开发者增长验证工具";
  return idea.replace(/[，。！？?]/g, " ").trim().slice(0, 18) || "新商业灵感";
}

function collectIdea() {
  state.idea = $("#ideaInput").value.trim();
  state.market = $("#marketInput").value.trim() || "待确认市场";
  state.format = $("#formatInput").value.trim() || "待确认产品形式";
  state.doubt = $("#doubtInput").value.trim() || "待确认";
}

function renderAgentQuestions() {
  const projectName = deriveProjectName(state.idea);
  const questions = [
    `你具体想解决的高频问题是什么？如果只能保留一个痛点，应该是哪一个？`,
    `谁是最主要的第一批用户？他们现在用什么替代方案解决？`,
    `你的方案与现有方案的差异是什么？是更便宜、更可信、更方便，还是更有组织？`,
    `用户在哪些场景里最需要这个产品？请给出 3 到 4 个场景，并估计优先级。`,
    `用户愿意为什么能力付费？你预期的价格区间和付费人是谁？`,
    `直接竞品、替代方案和用户“不用你”的理由分别是什么？`,
    `最终报告要给谁看？合伙人、团队、投资人、客户，还是自己决策？`
  ];

  const chat = $("#chatStream");
  chat.innerHTML = "";
  chat.insertAdjacentHTML(
    "beforeend",
    `<div class="message user"><strong>你</strong>${escapeHtml(state.idea)}</div>`
  );
  chat.insertAdjacentHTML(
    "beforeend",
    `<div class="message"><strong>newidea Agent</strong>我会先把“${escapeHtml(projectName)}”当成一个待验证项目，而不是直接写成商业计划书。下面这些问题决定假设地图的质量。</div>`
  );
  questions.forEach((question, index) => {
    chat.insertAdjacentHTML(
      "beforeend",
      `<div class="message"><strong>追问 ${index + 1}</strong>${question}</div>`
    );
  });
  chat.insertAdjacentHTML(
    "beforeend",
    `<div class="message"><strong>报告生成逻辑</strong>最终海报会把你的回答映射到评分、痛点、用户画像、场景分布、付费意愿、竞品、风险、下一步建议等模块。没有用户提供或搜索证据支持的内容，会标记为“待验证”。</div>`
  );
}

function quickFillAnswers() {
  const idea = state.idea || $("#ideaInput").value;
  const elderCase = idea.includes("老人") || idea.includes("陪伴") || idea.includes("用药");
  const toyCase = idea.includes("玩具") || idea.length < 8;

  if (elderCase) {
    $("#answerUser").value = "70 岁以上独居或半独居老人，以及承担照护责任的子女";
    $("#answerAlternative").value = "子女电话提醒、社区志愿者、家政陪护、智能音箱、微信群互助";
    $("#answerDiff").value = "把陪伴聊天、用药提醒、医院陪护提醒、生活辅助和紧急求助整合成一个低门槛服务";
    $("#answerValidation").value = "老人是否愿意持续使用，子女是否愿意为安心和高频提醒付费";
    $("#answerPains").value = "孤独无聊，没人陪伴；忘记吃药，健康风险高；不会使用智能手机；就医陪护困难；紧急情况无人知晓";
    $("#answerScenes").value = "独自在家45%，医院就医25%，日常用药20%，紧急情况10%";
    $("#answerPayment").value = "¥0-19/月试用18%，¥20-39/月35%，¥40-59/月25%，¥60+/月22%；主要由子女付费";
    $("#answerCompetitors").value = "小度在家、天猫精灵、家政陪护、用药助手、社区养老服务";
    $("#answerPersona").value = "王奶奶，72岁，独居，子女在外地工作，使用智能手机1-2年，月收入3000-5000元";
    $("#answerFeatures").value = "陪伴聊天、用药提醒、紧急求助、医院陪护、生活辅助、依赖子女、记忆力减退";
    $("#answerRisks").value = "老人学习成本、AI 误判风险、医疗健康合规、紧急求助履约、子女付费转化";
    return;
  }

  $("#answerUser").value = toyCase ? "25-38 岁，一二线城市年轻父母，家中有 2-8 岁儿童" : "有明确任务但缺少专业工具的早期项目负责人";
  $("#answerAlternative").value = toyCase ? "闲鱼、微信群、亲友转赠、社区跳蚤市场" : "手动搜索资料、问朋友、用通用 AI 写计划书";
  $("#answerDiff").value = toyCase ? "本地社区信任、玩具状态标准化、线下活动带来交易密度" : "先问关键问题，再把证据、假设和行动计划拆开";
  $("#answerValidation").value = toyCase ? "家长是否愿意拿出闲置玩具交换，并为省心和信任机制付费" : "用户是否愿意为更可信的验证报告付费";
  $("#answerPains").value = toyCase ? "闲置玩具占空间；二手交易不信任；玩具成色难判断；孩子兴趣变化快；新品玩具花费高" : "不知道该查什么；资料碎片化；结论不可信；无法形成行动；表达给团队成本高";
  $("#answerScenes").value = toyCase ? "社区交换45%，亲友转赠25%，二手平台20%，亲子活动10%" : "创业想法验证40%，内部立项25%，黑客松20%，投资初筛15%";
  $("#answerPayment").value = toyCase ? "¥9-19/月轻会员，¥29-49/月含消毒和活动权益，平台抽佣5%-8%" : "免费初评，高级报告¥29-99/份，团队版按月订阅";
  $("#answerCompetitors").value = toyCase ? "闲鱼、微信群、亲子社区、线下跳蚤市场、玩具租赁平台" : "ChatGPT、Notion模板、市场调研工具、咨询服务、行业报告平台";
  $("#answerPersona").value = toyCase ? "重视安全和省心的年轻父母，愿意参加社区活动，对陌生交易有顾虑" : "独立开发者、产品经理、创业比赛参与者，需要快速判断方向";
  $("#answerFeatures").value = toyCase ? "同城匹配、玩具消毒、成色评级、社区活动、信用档案、亲子社群" : "Agent追问、证据引用、假设地图、竞品矩阵、评分维度、30天验证计划";
  $("#answerRisks").value = toyCase ? "信任纠纷、卫生安全、供需密度、履约成本、获客效率" : "模型编造、搜索来源质量、报告同质化、成本控制、用户付费意愿";
}

function collectAnswers() {
  state.answers = {
    user: $("#answerUser").value.trim() || "目标用户尚未完全确认",
    alternative: $("#answerAlternative").value.trim() || "现有替代方案待调研",
    diff: $("#answerDiff").value.trim() || "差异化假设待确认",
    validation: $("#answerValidation").value.trim() || state.doubt,
    pains: $("#answerPains").value.trim() || "用户痛点待访谈确认",
    scenes: $("#answerScenes").value.trim() || "使用场景与占比待调研",
    payment: $("#answerPayment").value.trim() || "付费意愿和价格区间待验证",
    competitors: $("#answerCompetitors").value.trim() || "直接竞品与替代方案待扫描",
    persona: $("#answerPersona").value.trim() || "核心用户画像待补全",
    features: $("#answerFeatures").value.trim() || "关键功能热词待提炼",
    risks: $("#answerRisks").value.trim() || "风险清单待补充"
  };
}

function buildHypotheses() {
  collectIdea();
  collectAnswers();
  const projectName = deriveProjectName(state.idea);
  const isToy = state.idea.includes("玩具");
  const baseProblem = isToy ? "年轻父母存在处理闲置儿童玩具的麻烦，且希望更省心、更可信。" : `${state.answers.user} 存在一个足够频繁、足够具体的未满足需求。`;
  const willingness = isToy ? "用户愿意为可信交换、玩具整理和社区活动支付会员或服务费。" : "目标用户愿意为节省调研时间、降低试错成本而付费。";

  state.hypotheses = [
    {
      type: "用户问题",
      text: baseProblem,
      status: "unverified",
      importance: "高"
    },
    {
      type: "目标人群",
      text: state.answers.user,
      status: "partial",
      importance: "高"
    },
    {
      type: "替代方案",
      text: `用户当前主要依赖：${state.answers.alternative}。`,
      status: "partial",
      importance: "中"
    },
    {
      type: "解决方案差异",
      text: state.answers.diff,
      status: "unverified",
      importance: "高"
    },
    {
      type: "付费意愿",
      text: willingness,
      status: "unverified",
      importance: "高"
    },
    {
      type: "首轮验证",
      text: `优先验证：${state.answers.validation}。`,
      status: "unverified",
      importance: "高"
    },
    {
      type: "报告海报数据",
      text: `需要补齐痛点、场景、画像、付费、竞品和风险，才能生成类似仪表盘式报告图片。`,
      status: "partial",
      importance: "高"
    },
    {
      type: "证据来源",
      text: "每个关键结论都应绑定用户回答、公开搜索、访谈样本或平台推理标签。",
      status: "unverified",
      importance: "高"
    }
  ];

  $("#mapProjectName").textContent = projectName;
  renderHypotheses();
}

function renderHypotheses() {
  const grid = $("#hypothesisGrid");
  grid.innerHTML = "";
  state.hypotheses.forEach((item, index) => {
    const button = document.createElement("button");
    button.className = "hypothesis-card";
    button.type = "button";
    button.dataset.index = String(index);
    button.innerHTML = `
      <h3>${escapeHtml(item.type)}</h3>
      <p>${escapeHtml(item.text)}</p>
      <div class="card-meta">
        <span class="badge ${item.status}">${statusLabel[item.status]}</span>
        <span class="importance">重要性：${escapeHtml(item.importance)}</span>
      </div>
    `;
    button.addEventListener("click", () => cycleHypothesis(index));
    grid.appendChild(button);
  });
}

function cycleHypothesis(index) {
  const current = state.hypotheses[index].status;
  const next = statusCycle[(statusCycle.indexOf(current) + 1) % statusCycle.length];
  state.hypotheses[index].status = next;
  renderHypotheses();
}

function addHypothesis() {
  state.hypotheses.push({
    type: "新增假设",
    text: "这里可以补充一个你认为决定项目成败的关键假设。",
    status: "unverified",
    importance: "中"
  });
  renderHypotheses();
}

function generateReport() {
  collectIdea();
  collectAnswers();
  if (!state.hypotheses.length) buildHypotheses();

  const projectName = deriveProjectName(state.idea);
  const score = calculateScore();
  $("#scoreValue").textContent = String(score);
  $("#reportProjectTitle").textContent = `${projectName}：第一轮可行性判断`;
  $("#reportSummary").textContent = `基于当前输入、Agent 追问和假设地图，这个方向不适合直接投入完整开发，适合先用低成本实验验证“${state.answers.validation}”。`;

  renderList("#conclusionList", [
    `方向具备继续验证价值，但关键结论仍应标记为“待验证”，尤其是付费意愿与获客效率。`,
    `第一批用户应聚焦在 ${state.answers.user}，避免一开始覆盖过宽。`,
    `当前最重要的不是做完整产品，而是用访谈、落地页和小范围供需测试验证需求强度。`
  ]);

  renderList("#riskList", [
    `如果用户现有替代方案已经足够便宜或省心，项目差异化会被削弱。`,
    `如果首批供给或内容质量不足，早期体验会比商业模式更早失效。`,
    `模型生成的信息不能直接当事实，真实版本必须为关键结论绑定来源与置信度。`
  ]);

  renderEvidence();
  renderPosterBlueprint();
  renderQuestionFramework();
  renderPromptStack();
  renderTimeline();
}

function calculateScore() {
  const confirmed = state.hypotheses.filter((item) => item.status === "confirmed").length;
  const partial = state.hypotheses.filter((item) => item.status === "partial").length;
  return Math.min(86, 62 + confirmed * 6 + partial * 3);
}

function renderList(selector, items) {
  const list = $(selector);
  list.innerHTML = items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderEvidence() {
  const rows = [
    ["事实", "用户输入中已有明确目标市场、产品形式和最大疑问。", "来自用户"],
    ["推测", "目标人群可能有高频痛点，但强度需要访谈确认。", "待验证"],
    ["反证", "若替代方案已能低成本满足需求，付费空间会明显下降。", "需搜索"],
    ["动作", "先验证需求强度与付费意愿，再决定是否开发 MVP。", "建议执行"]
  ];
  $("#evidenceTable").innerHTML = rows
    .map(
      ([type, content, source]) => `
        <div class="evidence-row">
          <strong>${escapeHtml(type)}</strong>
          <span>${escapeHtml(content)}</span>
          <span class="badge ${source === "来自用户" ? "confirmed" : "unverified"}">${escapeHtml(source)}</span>
        </div>
      `
    )
    .join("");
}

function splitAnswer(value, fallback) {
  return String(value || fallback)
    .split(/[；;，,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function renderPosterBlueprint() {
  const painItems = splitAnswer(state.answers.pains, "核心痛点待确认").slice(0, 5);
  const sceneItems = splitAnswer(state.answers.scenes, "场景分布待调研").slice(0, 4);
  const competitorItems = splitAnswer(state.answers.competitors, "竞品待扫描").slice(0, 5);
  const featureItems = splitAnswer(state.answers.features, "关键功能待提炼").slice(0, 8);
  const riskItems = splitAnswer(state.answers.risks, "风险待识别").slice(0, 5);

  const modules = [
    ["综合评分", "输出 0-100 分、推荐指数、推进建议", "用户信息 + 评分维度模型"],
    ["评分维度", "市场需求、用户痛点、商业价值、竞品情况、技术可行性、增长潜力", "Agent 结构化评分"],
    ["用户痛点 TOP 5", painItems.join(" / "), "用户回答 + 访谈验证"],
    ["用户场景分布", sceneItems.join(" / "), "用户回答 + 调研样本"],
    ["用户画像", state.answers.persona, "用户回答 + 人群推断"],
    ["付费意愿分析", state.answers.payment, "价格测试 + 问卷"],
    ["竞品分析", competitorItems.join(" / "), "搜索 API + 应用商店/网站"],
    ["功能需求热度", featureItems.join(" / "), "痛点归因 + 高频词聚类"],
    ["方案对比", "方案 A / B / C 的壁垒、优势、周期、成本", "平台生成"],
    ["风险评估", riskItems.join(" / "), "反证搜索 + 约束识别"],
    ["下一步建议", "真人验证、MVP 细化、资源清单", "平台行动计划模板"]
  ];

  $("#posterBlueprint").innerHTML = modules
    .map(
      ([title, output, source]) => `
        <div class="blueprint-card">
          <strong>${escapeHtml(title)}</strong>
          <span>${escapeHtml(output)}</span>
          <small>来源：${escapeHtml(source)}</small>
        </div>
      `
    )
    .join("");
}

function renderQuestionFramework() {
  const groups = [
    ["用户与场景", "目标用户是谁？他们在什么时间、地点、情境下最痛？当前用什么替代方案？"],
    ["痛点与频率", "请列出 5 个痛点，并给出痛点强度、发生频率和当前解决成本。"],
    ["付费与决策", "谁付费？为什么愿意付费？可接受价格区间是多少？购买阻力是什么？"],
    ["竞品与替代", "直接竞品是谁？替代方案是谁？用户为什么不用你？你比它们强在哪里？"],
    ["功能与价值", "哪些功能是必须有、可延后、可放弃？每个功能解决哪个痛点？"],
    ["风险与合规", "技术、市场、政策、履约、信任、数据隐私分别有什么风险？"],
    ["验证实验", "本周能做什么低成本实验？成功标准是什么？失败后如何调整？"]
  ];

  $("#questionFramework").innerHTML = groups
    .map(
      ([title, question]) => `
        <div class="framework-card">
          <strong>${escapeHtml(title)}</strong>
          <p>${escapeHtml(question)}</p>
        </div>
      `
    )
    .join("");
}

function renderPromptStack() {
  const projectName = deriveProjectName(state.idea);
  const prompts = [
    [
      "信息缺口追问 Prompt",
      `你是 NewIdea 商业验证顾问。基于用户想法“${projectName}”，只问最影响判断的 5-7 个问题。问题必须覆盖用户、场景、痛点、付费、竞品、风险和验证实验。不要直接写报告。`
    ],
    [
      "证据搜索 Prompt",
      `围绕“${projectName}”搜索市场需求、用户抱怨、竞品、替代方案、价格和监管信息。每条证据必须输出来源、可信度、支持或反驳的假设，不允许编造来源。`
    ],
    [
      "评分计算 Prompt",
      "用 6 个维度打分：市场需求、用户痛点、商业价值、竞品情况、技术可行性、增长潜力。每个维度给 0-100 分、理由、证据状态和待验证点。"
    ],
    [
      "报告海报生成 Prompt",
      "把结构化研究结果转成仪表盘式报告：综合评分、维度雷达、核心结论、趋势、痛点 TOP5、场景分布、用户画像、付费意愿、商业价值、竞品、功能热度、方案对比、风险、进度、下一步建议和资源推荐。所有结论标记事实/推测/待验证。"
    ]
  ];

  $("#promptStack").innerHTML = prompts
    .map(
      ([title, prompt]) => `
        <details class="prompt-card">
          <summary>${escapeHtml(title)}</summary>
          <p>${escapeHtml(prompt)}</p>
        </details>
      `
    )
    .join("");
}

function renderTimeline() {
  const steps = [
    ["第 1 周", "访谈 8-12 个目标用户，确认痛点频率、现有替代方案和愿意付费的触发点。"],
    ["第 2 周", "做一个无代码落地页或报名表，测试一句话价值主张和转化率。"],
    ["第 3-4 周", "组织小范围手动服务实验，记录获客成本、交付成本和复购意愿。"]
  ];
  $("#timeline").innerHTML = steps
    .map(
      ([label, text]) => `
        <div class="timeline-step">
          <strong>${escapeHtml(label)}</strong>
          <span>${escapeHtml(text)}</span>
        </div>
      `
    )
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function resetApp() {
  $("#ideaInput").value = "";
  $("#marketInput").value = "中国一线和新一线城市";
  $("#formatInput").value = "Web / 小程序";
  $("#doubtInput").value = "需求是否真实，是否已有强竞品";
  answerSelectors.forEach((selector) => {
    $(selector).value = "";
  });
  $("#chatStream").innerHTML = `
    <div class="empty-state">
      <span class="empty-icon" aria-hidden="true"></span>
      <p>输入想法后，Agent 会在这里提出 3 到 5 个关键追问。</p>
    </div>
  `;
  state.hypotheses = [];
  $("#hypothesisGrid").innerHTML = "";
  ["#posterBlueprint", "#questionFramework", "#promptStack"].forEach((selector) => {
    const node = $(selector);
    if (node) node.innerHTML = "";
  });
  activatePanel("idea");
  showToast("已重置原型");
}

function bindEvents() {
  $$(".step").forEach((step) => {
    step.addEventListener("click", () => activatePanel(step.dataset.stepJump));
  });

  $$(".segmented button").forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.mode;
      $$(".segmented button").forEach((item) => item.classList.toggle("is-selected", item === button));
      $("#modeCopy").textContent = modeCopy[state.mode];
    });
  });

  $$(".prompt-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      $("#ideaInput").value = chip.dataset.example;
    });
  });

  $("#demoBtn").addEventListener("click", () => {
    $("#ideaInput").value = examples.elder;
    quickFillAnswers();
    showToast("已填入示例想法");
  });

  $("#resetBtn").addEventListener("click", resetApp);

  $("#startBtn").addEventListener("click", () => {
    collectIdea();
    if (!state.idea) {
      showToast("先输入一个商业想法");
      $("#ideaInput").focus();
      return;
    }
    renderAgentQuestions();
    activatePanel("dialogue");
  });

  $("#quickAnswerBtn").addEventListener("click", () => {
    collectIdea();
    quickFillAnswers();
    showToast("已快速补充追问答案");
  });

  $("#buildMapBtn").addEventListener("click", () => {
    collectIdea();
    if (!state.idea) {
      showToast("请先输入商业想法");
      activatePanel("idea");
      return;
    }
    buildHypotheses();
    activatePanel("map");
  });

  $("#addHypothesisBtn").addEventListener("click", addHypothesis);

  $("#generateReportBtn").addEventListener("click", () => {
    generateReport();
    activatePanel("report");
  });

  $("#printBtn").addEventListener("click", () => window.print());
  $("#pptBtn").addEventListener("click", () => showToast("MVP 原型：下一版接入 PptxGenJS 生成简版 PPT"));
}

bindEvents();
