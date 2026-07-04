(function () {
  const iconMap = {
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.8A2.8 2.8 0 0 1 6.8 4h10.4A2.8 2.8 0 0 1 20 6.8v10.4a2.8 2.8 0 0 1-2.8 2.8H6.8A2.8 2.8 0 0 1 4 17.2V6.8Z"/><path d="m5.2 7.2 5.1 4.4a2.6 2.6 0 0 0 3.4 0l5.1-4.4"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V8a5 5 0 0 1 10 0v2"/><path d="M6.8 10h10.4A1.8 1.8 0 0 1 19 11.8v6.4a1.8 1.8 0 0 1-1.8 1.8H6.8A1.8 1.8 0 0 1 5 18.2v-6.4A1.8 1.8 0 0 1 6.8 10Z"/><path d="M12 14v2"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3.8A1.8 1.8 0 0 1 9.8 2h4.4A1.8 1.8 0 0 1 16 3.8v16.4a1.8 1.8 0 0 1-1.8 1.8H9.8A1.8 1.8 0 0 1 8 20.2V3.8Z"/><path d="M11 18h2"/></svg>',
    code: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8h10M7 12h6M7 16h8"/><path d="M5.8 4h12.4A1.8 1.8 0 0 1 20 5.8v12.4a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 18.2V5.8A1.8 1.8 0 0 1 5.8 4Z"/></svg>',
    eye: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 12s3-5.5 8.5-5.5 8.5 5.5 8.5 5.5-3 5.5-8.5 5.5S3.5 12 3.5 12Z"/><path d="M12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"/></svg>',
    google: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12.2c0-.7-.1-1.3-.2-1.9H12v3.5h4.5a4 4 0 0 1-1.7 2.6v2.1h2.8c1.6-1.5 2.4-3.6 2.4-6.3Z"/><path d="M12 20c2.3 0 4.2-.7 5.6-2l-2.8-2.1c-.8.5-1.7.8-2.8.8a4.8 4.8 0 0 1-4.5-3.3H4.7v2.2A8.3 8.3 0 0 0 12 20Z"/><path d="M7.5 13.4a5 5 0 0 1 0-2.8V8.4H4.7a8.2 8.2 0 0 0 0 7.2l2.8-2.2Z"/><path d="M12 7.3c1.2 0 2.3.4 3.2 1.3l2.4-2.4A8 8 0 0 0 12 4a8.3 8.3 0 0 0-7.3 4.4l2.8 2.2A4.8 4.8 0 0 1 12 7.3Z"/></svg>',
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.8a8.3 8.3 0 0 0-2.6 16.2c.4.1.6-.2.6-.4v-1.5c-2.3.5-2.8-1-2.8-1-.4-.9-.9-1.1-.9-1.1-.8-.5.1-.5.1-.5.8.1 1.3.9 1.3.9.8 1.3 2 1 2.4.8.1-.6.3-1 .5-1.2-1.8-.2-3.7-.9-3.7-4a3 3 0 0 1 .9-2.2 3 3 0 0 1 .1-2.2s.7-.2 2.3.8a8 8 0 0 1 4.2 0c1.6-1 2.3-.8 2.3-.8.4 1 .2 1.8.1 2.2a3 3 0 0 1 .9 2.2c0 3.1-1.9 3.8-3.7 4 .3.2.5.7.5 1.4v2.2c0 .2.2.5.6.4A8.3 8.3 0 0 0 12 3.8Z"/></svg>',
    wechat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.3 6.2c-3.5 0-6.3 2.2-6.3 5 0 1.6.9 3 2.4 3.9l-.5 1.8 2.1-1a7.4 7.4 0 0 0 2.3.3h.6a4.9 4.9 0 0 1-.2-1.4c0-2.7 2.6-4.8 5.8-4.9-.8-2.1-3.2-3.7-6.2-3.7Z"/><path d="M20 14.8c0-2.1-2.1-3.8-4.7-3.8s-4.7 1.7-4.7 3.8 2.1 3.8 4.7 3.8c.5 0 .9 0 1.3-.1l1.7.8-.4-1.4c1.3-.7 2.1-1.8 2.1-3.1Z"/><path d="M8.2 10.6h.1M12.3 10.6h.1M14 14.4h.1M16.9 14.4h.1"/></svg>',
    briefcase: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7"/><path d="M5.8 7h12.4A1.8 1.8 0 0 1 20 8.8v8.4a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 17.2V8.8A1.8 1.8 0 0 1 5.8 7Z"/><path d="M4 12h16M10 12v1h4v-1"/></svg>'
  };

  function BrandLogo() {
    return `
      <div class="auth-brand">
        <div class="auth-logo" aria-hidden="true">
          <img src="./assets/images/newidea-logo.png" alt="" />
        </div>
        <div>
          <strong>NewIdea</strong>
          <span>快速验证你的想法</span>
        </div>
      </div>
    `;
  }

  function LoginTabs() {
    return `
      <div class="auth-tabs" role="tablist" aria-label="登录方式">
        <button class="auth-tab is-active" id="accountTab" role="tab" type="button" aria-selected="true" aria-controls="accountPanel" data-tab="account">账号登录</button>
        <button class="auth-tab" id="codeTab" role="tab" type="button" aria-selected="false" aria-controls="codePanel" data-tab="code">验证码登录</button>
      </div>
    `;
  }

  function AuthInput(options) {
    const action = options.action || "";
    return `
      <label class="auth-field" for="${options.id}">
        <span>${options.label}</span>
        <div class="auth-input-wrap">
          <span class="auth-input-icon">${iconMap[options.icon] || ""}</span>
          <input id="${options.id}" name="${options.name}" type="${options.type}" autocomplete="${options.autocomplete || "off"}" placeholder="${options.placeholder}" />
          ${action}
        </div>
        <small class="field-error" id="${options.id}Error"></small>
      </label>
    `;
  }

  function SocialLoginButtons() {
    const providers = [
      ["Google", "google"],
      ["GitHub", "github"],
      ["微信", "wechat"],
      ["企业微信", "briefcase"]
    ];
    return `
      <div class="social-grid" aria-label="其他登录方式">
        ${providers
          .map(
            ([label, icon]) => `
              <button class="social-button" type="button" data-provider="${label}" aria-label="使用 ${label} 登录">
                ${iconMap[icon]}
              </button>
            `
          )
          .join("")}
      </div>
    `;
  }

  function LoginIllustration() {
    return `
      <section class="visual-panel" aria-label="NewIdea 产品插画">
        <div class="texture texture-a">NEWIDEA</div>
        <div class="texture texture-b">IDEA LAB</div>
        <div class="texture texture-c">VALIDATE YOUR IDEA</div>
        <div class="shape orb-a"></div>
        <div class="shape orb-b"></div>
        <div class="shape slab-a"></div>
        <div class="shape slab-b"></div>

        <div class="visual-logo-card" aria-hidden="true">
          <img src="./assets/images/newidea-logo.png" alt="" />
        </div>

        <div class="illustration-stage" aria-hidden="true">
          <svg class="idea-scene" viewBox="0 0 780 620">
            <defs>
              <linearGradient id="screenGrad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="100%" stop-color="#dbe8ff" />
              </linearGradient>
              <linearGradient id="cyanGrad" x1="0" x2="1">
                <stop offset="0%" stop-color="#21D9F5" />
                <stop offset="100%" stop-color="#8C7CFF" />
              </linearGradient>
              <filter id="softShadow" x="-20%" y="-20%" width="140%" height="150%">
                <feDropShadow dx="0" dy="22" stdDeviation="18" flood-color="#1f247e" flood-opacity=".28" />
              </filter>
            </defs>

            <ellipse cx="390" cy="516" rx="270" ry="50" fill="#2530a9" opacity=".24" />

            <g class="float-slow" filter="url(#softShadow)">
              <path d="M176 188 486 112l154 248-314 84-150-256Z" fill="#17236d" opacity=".42" />
              <path d="M190 172h384a22 22 0 0 1 22 22v210H190V172Z" fill="#111a55" />
              <path d="M216 198h334v174H216V198Z" fill="url(#screenGrad)" />
              <path d="M162 404h462l52 62H216l-54-62Z" fill="#dce6ff" />
              <path d="M216 404h408l34 40H250l-34-40Z" fill="#aab8ef" />
              <text x="238" y="230" class="svg-title">Idea Validation Dashboard</text>
              <rect x="236" y="252" width="118" height="78" rx="12" fill="#eef4ff" />
              <rect x="372" y="252" width="154" height="78" rx="12" fill="#eef4ff" />
              <path d="M247 315c22-44 43-21 58-42 11-14 22 2 36-12" fill="none" stroke="#4055E8" stroke-width="7" stroke-linecap="round" />
              <rect x="393" y="274" width="38" height="34" rx="6" fill="#21D9F5" opacity=".82" />
              <rect x="441" y="262" width="38" height="46" rx="6" fill="#8C7CFF" opacity=".82" />
              <rect x="489" y="288" width="24" height="20" rx="6" fill="#4055E8" opacity=".82" />
              <rect x="236" y="344" width="86" height="14" rx="7" fill="#bdd0ff" />
              <rect x="334" y="344" width="118" height="14" rx="7" fill="#bdd0ff" />
              <rect x="464" y="344" width="62" height="14" rx="7" fill="#bdd0ff" />
            </g>

            <g class="float-fast" filter="url(#softShadow)">
              <rect x="552" y="256" width="102" height="180" rx="22" fill="#16205f" />
              <rect x="565" y="280" width="76" height="126" rx="12" fill="#f8fbff" />
              <rect x="578" y="300" width="50" height="10" rx="5" fill="#4055E8" />
              <rect x="578" y="322" width="44" height="34" rx="8" fill="#e8edff" />
              <path d="M584 348h26l13-17" fill="none" stroke="#21D9F5" stroke-width="5" stroke-linecap="round" />
              <rect x="578" y="370" width="50" height="8" rx="4" fill="#b7c7ff" />
              <circle cx="603" cy="420" r="5" fill="#b7c7ff" />
            </g>

            <g class="magnifier" filter="url(#softShadow)">
              <circle cx="168" cy="330" r="54" fill="none" stroke="#ffffff" stroke-width="18" opacity=".95" />
              <circle cx="168" cy="330" r="38" fill="#21D9F5" opacity=".18" />
              <path d="m207 369 60 60" stroke="#ffffff" stroke-width="18" stroke-linecap="round" />
            </g>

            <g class="spark-card card-one">
              <rect x="96" y="106" width="138" height="58" rx="18" fill="#ffffff" opacity=".95" />
              <circle cx="122" cy="135" r="12" fill="#21D9F5" />
              <text x="144" y="141" class="svg-label">用户需求</text>
            </g>
            <g class="spark-card card-two">
              <rect x="526" y="96" width="150" height="58" rx="18" fill="#ffffff" opacity=".95" />
              <path d="M552 139h66" stroke="#4055E8" stroke-width="8" stroke-linecap="round" />
              <text x="552" y="124" class="svg-label">市场热度</text>
            </g>
            <g class="spark-card card-three">
              <rect x="112" y="448" width="150" height="58" rx="18" fill="#ffffff" opacity=".95" />
              <path d="M136 482h84" stroke="#8C7CFF" stroke-width="8" stroke-linecap="round" />
              <text x="136" y="468" class="svg-label">竞品分析</text>
            </g>
            <g class="spark-card card-four">
              <rect x="534" y="454" width="160" height="58" rx="18" fill="#ffffff" opacity=".95" />
              <text x="558" y="489" class="svg-label">可行性评分</text>
              <circle cx="656" cy="482" r="17" fill="#21D9F5" opacity=".72" />
            </g>

            <g class="person person-a">
              <circle cx="306" cy="500" r="18" fill="#ffd4b8" />
              <path d="M276 560c7-34 17-48 31-48s25 15 34 48H276Z" fill="#21D9F5" />
              <rect x="238" y="528" width="56" height="30" rx="8" fill="#ffffff" opacity=".88" />
              <rect x="250" y="538" width="32" height="6" rx="3" fill="#4055E8" />
            </g>
            <g class="person person-b">
              <circle cx="466" cy="494" r="17" fill="#ffd4b8" />
              <path d="M437 560c7-34 16-48 30-48s24 15 33 48H437Z" fill="#8C7CFF" />
              <path d="m489 520 34-22" stroke="#ffffff" stroke-width="10" stroke-linecap="round" />
            </g>
            <g class="person person-c">
              <circle cx="610" cy="516" r="15" fill="#ffd4b8" />
              <path d="M586 566c6-29 14-41 25-41s20 12 28 41H586Z" fill="#4055E8" />
              <rect x="632" y="500" width="44" height="30" rx="8" fill="#ffffff" opacity=".9" />
            </g>

            <g class="idea-symbols">
              <path d="M426 78c0-21 17-38 38-38s38 17 38 38c0 15-8 27-20 34v18h-36v-18c-12-7-20-19-20-34Z" fill="#ffffff" opacity=".92" />
              <path d="M454 142h22" stroke="#21D9F5" stroke-width="7" stroke-linecap="round" />
              <path d="M78 266h54M105 239v54" stroke="#ffffff" stroke-width="10" stroke-linecap="round" opacity=".58" />
              <circle cx="690" cy="246" r="34" fill="none" stroke="#ffffff" stroke-width="8" opacity=".8" />
              <circle cx="690" cy="246" r="14" fill="#21D9F5" opacity=".85" />
            </g>
          </svg>
        </div>

        <div class="visual-copy">
          <h1>NewIdea</h1>
          <p>快速验证你的想法</p>
          <span>从一个灵感，到一份值得行动的答案。</span>
        </div>
      </section>
    `;
  }

  function LoginPanel() {
    const passwordAction = '<button class="input-action" id="togglePassword" type="button" aria-label="显示密码">' + iconMap.eye + "</button>";
    const codeAction = '<button class="code-button" id="sendCodeBtn" type="button">获取验证码</button>';
    return `
      <section class="auth-side" aria-label="登录表单">
        <div class="login-card">
          <button class="qr-login" type="button" aria-label="扫码登录">
            <span class="qr-tooltip">使用 NewIdea App 扫码登录</span>
            <span class="qr-grid" aria-hidden="true"></span>
          </button>

          ${BrandLogo()}
          <p class="auth-kicker">让每一个想法，都先得到数据的回答。</p>
          ${LoginTabs()}

          <form class="auth-form" id="accountPanel" aria-labelledby="accountTab" novalidate>
            ${AuthInput({ id: "accountId", name: "accountId", type: "text", label: "邮箱或手机号", icon: "mail", placeholder: "请输入邮箱或手机号", autocomplete: "username" })}
            ${AuthInput({ id: "password", name: "password", type: "password", label: "密码", icon: "lock", placeholder: "请输入密码", autocomplete: "current-password", action: passwordAction })}
            <div class="form-row">
              <label class="remember-me">
                <input id="rememberMe" type="checkbox" />
                <span>记住我</span>
              </label>
              <a href="#forgot" data-route="forgot">忘记密码？</a>
            </div>
            <button class="submit-button" type="submit">
              <span class="button-spinner" aria-hidden="true"></span>
              <span class="button-text">登录 NewIdea</span>
            </button>
          </form>

          <form class="auth-form is-hidden" id="codePanel" aria-labelledby="codeTab" novalidate>
            ${AuthInput({ id: "codeAccount", name: "codeAccount", type: "text", label: "邮箱或手机号", icon: "phone", placeholder: "请输入邮箱或手机号", autocomplete: "username" })}
            ${AuthInput({ id: "verifyCode", name: "verifyCode", type: "text", label: "验证码", icon: "code", placeholder: "请输入 6 位验证码", autocomplete: "one-time-code", action: codeAction })}
            <div class="form-row code-hint">
              <span>验证码仅作原型演示，可输入任意内容。</span>
            </div>
            <button class="submit-button" type="submit">
              <span class="button-spinner" aria-hidden="true"></span>
              <span class="button-text">登录 NewIdea</span>
            </button>
          </form>

          <div class="divider"><span>或使用其他方式登录</span></div>
          ${SocialLoginButtons()}

          <p class="signup-line">还没有账号？<a href="#signup" data-route="signup">立即创建</a></p>
        </div>
      </section>
    `;
  }

  window.NewIdeaLoginComponents = {
    LoginIllustration,
    LoginPanel
  };
})();
