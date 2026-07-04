(function () {
  const state = {
    tab: "account",
    loading: false,
    codeSeconds: 0,
    timer: null
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  function boot() {
    $("#loginApp").innerHTML = `
      ${window.NewIdeaLoginComponents.LoginIllustration()}
      ${window.NewIdeaLoginComponents.LoginPanel()}
    `;
    bindEvents();
  }

  function bindEvents() {
    $$(".auth-tab").forEach((tab) => {
      tab.addEventListener("click", () => switchTab(tab.dataset.tab));
    });

    $("#togglePassword").addEventListener("click", togglePassword);
    $("#sendCodeBtn").addEventListener("click", startCodeCountdown);
    $("#accountPanel").addEventListener("submit", handleSubmit);
    $("#codePanel").addEventListener("submit", handleSubmit);

    ["accountId", "password", "codeAccount", "verifyCode"].forEach((id) => {
      $(`#${id}`).addEventListener("input", () => clearError(id));
    });

    $$("[data-route]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const route = link.dataset.route === "forgot" ? "忘记密码" : "创建账号";
        showToast(`${route}路由占位，后续可接入真实页面`);
      });
    });

    $$(".social-button").forEach((button) => {
      button.addEventListener("click", () => {
        showToast(`${button.dataset.provider} 登录占位，后续可接入 OAuth`);
      });
    });

    $(".qr-login").addEventListener("click", () => {
      showToast("扫码登录占位，后续可接入 NewIdea App");
    });
  }

  function switchTab(nextTab) {
    state.tab = nextTab;
    clearErrors();
    $$(".auth-tab").forEach((tab) => {
      const active = tab.dataset.tab === nextTab;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    $("#accountPanel").classList.toggle("is-hidden", nextTab !== "account");
    $("#codePanel").classList.toggle("is-hidden", nextTab !== "code");
    const firstInput = nextTab === "account" ? $("#accountId") : $("#codeAccount");
    firstInput.focus();
  }

  function togglePassword() {
    const password = $("#password");
    const visible = password.type === "text";
    password.type = visible ? "password" : "text";
    $("#togglePassword").setAttribute("aria-label", visible ? "显示密码" : "隐藏密码");
  }

  function startCodeCountdown() {
    if (state.codeSeconds > 0) return;
    const account = $("#codeAccount").value.trim();
    if (!account) {
      setError("codeAccount", "请输入邮箱或手机号后再获取验证码");
      $("#codeAccount").focus();
      return;
    }
    clearError("codeAccount");
    state.codeSeconds = 60;
    updateCodeButton();
    state.timer = window.setInterval(() => {
      state.codeSeconds -= 1;
      updateCodeButton();
      if (state.codeSeconds <= 0) {
        window.clearInterval(state.timer);
        state.timer = null;
      }
    }, 1000);
    showToast("验证码已发送，原型中可输入任意内容");
  }

  function updateCodeButton() {
    const button = $("#sendCodeBtn");
    if (state.codeSeconds > 0) {
      button.textContent = `${state.codeSeconds}s`;
      button.disabled = true;
      return;
    }
    button.textContent = "获取验证码";
    button.disabled = false;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (state.loading) return;
    const valid = state.tab === "account" ? validateAccount() : validateCode();
    if (!valid) return;
    setLoading(true);
    window.setTimeout(() => {
      localStorage.setItem("newidea-authenticated", "true");
      window.location.href = "./app.html";
    }, 900);
  }

  function validateAccount() {
    clearErrors();
    let valid = true;
    if (!$("#accountId").value.trim()) {
      setError("accountId", "邮箱或手机号不能为空");
      valid = false;
    }
    if (!$("#password").value.trim()) {
      setError("password", "密码不能为空");
      valid = false;
    }
    focusFirstError();
    return valid;
  }

  function validateCode() {
    clearErrors();
    let valid = true;
    if (!$("#codeAccount").value.trim()) {
      setError("codeAccount", "邮箱或手机号不能为空");
      valid = false;
    }
    if (!$("#verifyCode").value.trim()) {
      setError("verifyCode", "验证码不能为空");
      valid = false;
    }
    focusFirstError();
    return valid;
  }

  function setError(inputId, message) {
    const input = $(`#${inputId}`);
    const error = $(`#${inputId}Error`);
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", `${inputId}Error`);
    error.textContent = message;
    input.closest(".auth-field").classList.add("has-error");
  }

  function clearError(inputId) {
    const input = $(`#${inputId}`);
    const error = $(`#${inputId}Error`);
    input.removeAttribute("aria-invalid");
    input.removeAttribute("aria-describedby");
    error.textContent = "";
    input.closest(".auth-field").classList.remove("has-error");
  }

  function clearErrors() {
    ["accountId", "password", "codeAccount", "verifyCode"].forEach(clearError);
  }

  function focusFirstError() {
    const first = $('.auth-field.has-error input');
    if (first) first.focus();
  }

  function setLoading(loading) {
    state.loading = loading;
    $$(".submit-button").forEach((button) => {
      button.disabled = loading;
      button.classList.toggle("is-loading", loading);
    });
  }

  function showToast(message) {
    const toast = $("#authToast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  boot();
})();
