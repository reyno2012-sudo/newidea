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
  toy: "我想做一个面向年轻父母的儿童旧玩具交换平台，通过社区活动和会员服务盈利，这个方向是否值得做？"
};

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
    `你最希望这轮验证回答什么问题？需求、付费、获客、供给，还是竞争？`
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
}

function quickFillAnswers() {
  const idea = state.idea || $("#ideaInput").value;
  const toyCase = idea.includes("玩具") || idea.length < 8;
  $("#answerUser").value = toyCase ? "25-38 岁，一二线城市年轻父母，家中有 2-8 岁儿童" : "有明确任务但缺少专业工具的早期项目负责人";
  $("#answerAlternative").value = toyCase ? "闲鱼、微信群、亲友转赠、社区跳蚤市场" : "手动搜索资料、问朋友、用通用 AI 写计划书";
  $("#answerDiff").value = toyCase ? "本地社区信任、玩具状态标准化、线下活动带来交易密度" : "先问关键问题，再把证据、假设和行动计划拆开";
  $("#answerValidation").value = toyCase ? "家长是否愿意拿出闲置玩具交换，并为省心和信任机制付费" : "用户是否愿意为更可信的验证报告付费";
}

function collectAnswers() {
  state.answers = {
    user: $("#answerUser").value.trim() || "目标用户尚未完全确认",
    alternative: $("#answerAlternative").value.trim() || "现有替代方案待调研",
    diff: $("#answerDiff").value.trim() || "差异化假设待确认",
    validation: $("#answerValidation").value.trim() || state.doubt
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
  ["#answerUser", "#answerAlternative", "#answerDiff", "#answerValidation"].forEach((selector) => {
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
    $("#ideaInput").value = examples.toy;
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
