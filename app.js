document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  const screens = document.querySelectorAll(".screen");
  const menuOverlay = document.getElementById("menuOverlay");
  const sideMenu = document.getElementById("sideMenu");
  const clockDisplay = document.getElementById("clockDisplay");
  const chatMessages = document.getElementById("chatMessages");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const aiOrb = document.getElementById("aiOrb");

  const goLoginBtn = document.getElementById("goLoginBtn");
  const goSignupBtn = document.getElementById("goSignupBtn");
  const loginToSignupBtn = document.getElementById("loginToSignupBtn");
  const loginBackHomeBtn = document.getElementById("loginBackHomeBtn");
  const signupToLoginBtn = document.getElementById("signupToLoginBtn");
  const signupBackHomeBtn = document.getElementById("signupBackHomeBtn");
  const openMenuBtn = document.getElementById("openMenuBtn");
  const closeMenuBtn = document.getElementById("closeMenuBtn");
  const newChatBtn = document.getElementById("newChatBtn");
  const saveSettingsBtn = document.getElementById("saveSettingsBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const crtOverlay = document.getElementById("crtOverlay");

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const loginErrorBox = document.getElementById("loginErrorBox");
  const loginUsername = document.getElementById("loginUsername");
  const loginPassword = document.getElementById("loginPassword");

  const colorOptions = document.querySelectorAll(".color-option");
  const screenButtons = document.querySelectorAll("[data-screen]");
  const menuLinks = document.querySelectorAll(".menu-link");
  const topNavBtns = document.querySelectorAll(".top-nav-btn");

  const avatarUpload = document.getElementById("avatarUpload");
  const settingsAvatarPreview = document.getElementById("settingsAvatarPreview");
  const homeAvatar = document.getElementById("homeAvatar");
  const miniAvatar = document.getElementById("miniAvatar");

  let selectedTheme = localStorage.getItem("nr_theme") || "noir";
  let avatarData = localStorage.getItem("nr_avatar") || "";
  let geminiApiKey = localStorage.getItem("nr_gemini_key") || "";
  let chatHistory = [];

  // =====================
  // NAVIGATION
  // =====================

  function showScreen(screenId) {
    screens.forEach((screen) => screen.classList.remove("active"));
    const target = document.getElementById(screenId);
    if (target) target.classList.add("active");
    closeMenu();

    if (screenId === "chatScreen" && chatInput) {
      setTimeout(() => chatInput.focus(), 120);
    }

    topNavBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.screen === screenId);
    });
  }

  function showScreenWithCRT(screenId) {
    if (!crtOverlay) {
      showScreen(screenId);
      return;
    }

    crtOverlay.className = "crt-overlay crt-close";

    setTimeout(() => {
      showScreen(screenId);
      crtOverlay.className = "crt-overlay crt-open";
    }, 1500);

    setTimeout(() => {
      crtOverlay.className = "crt-overlay";
    }, 3200);
  }

  // =====================
  // MENU LATERAL
  // =====================

  function openMenu() {
    matrixBurst = true;
    canvas.style.opacity = "0.7";
    canvas.style.transition = "opacity 0.5s ease";

    sideMenu.classList.remove("hidden");
    menuOverlay.classList.remove("hidden");

    requestAnimationFrame(() => {
      sideMenu.classList.add("open");
      menuOverlay.classList.add("show");
    });

    setTimeout(() => {
      matrixBurst = false;
      canvas.style.opacity = "0.38";
    }, 5000);
  }

  function closeMenu() {
    sideMenu.classList.remove("open");
    menuOverlay.classList.remove("show");
    matrixBurst = false;
    canvas.style.opacity = "0.38";
    setTimeout(() => {
      sideMenu.classList.add("hidden");
      menuOverlay.classList.add("hidden");
    }, 400);
  }

  // =====================
  // HORLOGE MATRIX
  // =====================

  const clockDigits = document.getElementById("clockDigits");
  const clockRain = document.getElementById("clockRain");
  let lastTimeStr = "";
  const matrixChars = "アイウエオカキクケコ0123456789#$%&@";

  function spawnClockRainDrops() {
    if (!clockRain) return;
    clockRain.classList.add("active");

    for (let i = 0; i < 12; i++) {
      const drop = document.createElement("span");
      drop.className = "clock-rain-drop";
      drop.textContent = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
      drop.style.left = Math.random() * 100 + "%";
      drop.style.animationDelay = Math.random() * 0.3 + "s";
      drop.style.animationDuration = (0.3 + Math.random() * 0.4) + "s";
      clockRain.appendChild(drop);
    }

    setTimeout(() => {
      clockRain.classList.remove("active");
      clockRain.innerHTML = "";
    }, 800);
  }

  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const timeStr = hours + ":" + minutes;

    if (!clockDigits || timeStr === lastTimeStr) return;

    const newChars = timeStr.split("");
    const oldChars = lastTimeStr ? lastTimeStr.split("") : [];
    const spans = clockDigits.querySelectorAll(".clock-digit");

    let hasChanged = false;

    for (let i = 0; i < newChars.length; i++) {
      if (spans[i] && newChars[i] !== oldChars[i]) {
        hasChanged = true;
        spans[i].classList.add("changing");
        spans[i].textContent = newChars[i];

        const span = spans[i];
        setTimeout(() => span.classList.remove("changing"), 650);
      }
    }

    if (hasChanged && lastTimeStr) {
      spawnClockRainDrops();
    }

    lastTimeStr = timeStr;
  }

  // =====================
  // CHAT
  // =====================

  function createMessageElement(text, type) {
    const message = document.createElement("div");
    message.className = "message message-" + type;

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.textContent = text;

    message.appendChild(bubble);
    return message;
  }

  function scrollMessagesToBottom() {
    if (!chatMessages) return;
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function animateAiOrb() {
    if (!aiOrb) return;
    aiOrb.style.transform = "scale(1.08)";
    aiOrb.style.boxShadow = "0 0 30px rgba(255, 122, 0, 0.38)";
    setTimeout(() => {
      aiOrb.style.transform = "scale(1)";
      aiOrb.style.boxShadow = "0 0 22px rgba(255, 122, 0, 0.18)";
    }, 260);
  }

  function addMessage(text, type) {
    if (!text.trim()) return;
    chatMessages.appendChild(createMessageElement(text, type));
    scrollMessagesToBottom();
  }

  // =====================
  // GEMINI AI
  // =====================

  const aiStatusDot = document.querySelector(".ai-status-dot");
  const aiStatusText = document.getElementById("aiStatusText");
  const geminiApiKeyInput = document.getElementById("geminiApiKeyInput");
  const geminiStatus = document.getElementById("geminiStatus");

  function updateAiStatus() {
    if (geminiApiKey) {
      if (aiStatusDot) { aiStatusDot.className = "ai-status-dot online"; }
      if (aiStatusText) aiStatusText.textContent = "Gemini IA connecte";
    } else {
      if (aiStatusDot) { aiStatusDot.className = "ai-status-dot offline"; }
      if (aiStatusText) aiStatusText.textContent = "Mode demo - Ajoute ta cle Gemini dans Parametres";
    }
  }

  function setAiThinking(isThinking) {
    if (isThinking) {
      if (aiStatusDot) aiStatusDot.className = "ai-status-dot thinking";
      if (aiStatusText) aiStatusText.textContent = "Gemini reflechit...";
    } else {
      updateAiStatus();
    }
  }

  async function askGemini(userText) {
    chatHistory.push({ role: "user", parts: [{ text: userText }] });

    const systemInstruction = "Tu es l'assistant personnel intelligent de Alex dans l'application Nouveau Riviere. Tu reponds en francais, de facon claire, utile et concise. Tu peux aider avec le travail, le code, les projets, les idees, et tout ce que Alex demande. Sois amical et direct.";

    const body = {
      system_instruction: { parts: [{ text: systemInstruction }] },
      contents: chatHistory,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 1024
      }
    };

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiApiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || "Erreur API " + response.status);
    }

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Je n'ai pas pu generer une reponse.";

    chatHistory.push({ role: "model", parts: [{ text: aiText }] });

    if (chatHistory.length > 20) {
      chatHistory = chatHistory.slice(-16);
    }

    return aiText;
  }

  function getDemoResponse(userText) {
    const text = userText.toLowerCase().trim();
    const rules = [
      { keywords: ["bonjour","salut","allo","hello"], replies: ["Salut Alex! Je suis en mode demo. Ajoute ta cle Gemini dans Parametres pour des vraies reponses IA."] },
      { keywords: ["aide","help"], replies: ["Je suis en mode demo. Va dans Parametres et ajoute ta cle API Gemini gratuite pour me rendre intelligent!"] }
    ];

    for (const rule of rules) {
      if (rule.keywords.some((kw) => text.includes(kw))) {
        return rule.replies[0];
      }
    }
    return "Mode demo actif. Pour des reponses intelligentes, ajoute ta cle Gemini dans les Parametres (c'est gratuit!).";
  }

  async function handleSendMessage() {
    const userText = chatInput.value.trim();
    if (!userText) return;

    addMessage(userText, "user");
    chatInput.value = "";
    animateAiOrb();

    if (geminiApiKey) {
      setAiThinking(true);
      try {
        const reply = await askGemini(userText);
        addMessage(reply, "ai");
      } catch (err) {
        addMessage("Erreur: " + err.message, "ai");
      }
      setAiThinking(false);
    } else {
      setTimeout(() => {
        addMessage(getDemoResponse(userText), "ai");
      }, 400);
    }

    animateAiOrb();
  }

  function resetChat() {
    chatMessages.innerHTML = "";
    chatMessages.appendChild(createMessageElement("Bonjour Alex. Je suis pret.", "ai"));
    scrollMessagesToBottom();
  }

  // =====================
  // THEMES
  // =====================

  function applyTheme(themeName) {
    selectedTheme = themeName;

    app.classList.remove(
      "theme-noir",
      "theme-blanc",
      "theme-orange",
      "theme-bleu",
      "theme-rouge",
      "theme-vert"
    );

    app.classList.add("theme-" + themeName);

    colorOptions.forEach((button) => {
      button.classList.toggle("active", button.dataset.theme === themeName);
    });

    localStorage.setItem("nr_theme", themeName);
  }

  // =====================
  // AVATAR
  // =====================

  function setAvatarUI(imageData) {
    const targets = [settingsAvatarPreview, miniAvatar, aiOrb];

    targets.forEach((target) => {
      if (!target) return;

      if (imageData) {
        target.innerHTML = '<img src="' + imageData + '" alt="Avatar" />';
      } else {
        target.textContent = "IA";
      }
    });
  }

  function saveAvatar(file) {
    const reader = new FileReader();
    reader.onload = () => {
      avatarData = reader.result;
      localStorage.setItem("nr_avatar", avatarData);
      setAvatarUI(avatarData);
    };
    reader.readAsDataURL(file);
  }

  // =====================
  // LOGIN
  // =====================

  function showLoginError() {
    loginErrorBox.classList.remove("hidden");
    setTimeout(() => {
      loginErrorBox.classList.add("hidden");
      showScreen("homeScreen");
    }, 1800);
  }

  // =====================
  // HOME MENU ANIMATION
  // =====================

  function startHomeAnimation() {
    showScreen("homeScreen");
    const homeItems = document.querySelectorAll(".home-menu-item");
    homeItems.forEach((item) => item.classList.remove("visible"));

    setTimeout(() => {
      homeItems.forEach((item) => item.classList.add("visible"));
    }, 100);
  }

  // =====================
  // MATRIX RAIN (3 couches de profondeur)
  // =====================

  const canvas = document.getElementById("matrixCanvas");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initMatrixLayers();
  }

  const letters = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>{}[]";

  const matrixLayers = [];

  function initMatrixLayers() {
    matrixLayers.length = 0;

    const layerConfigs = [
      { fontSize: 10, speed: 0.6, opacity: 0.3, color: "180,100,0", reset: 0.985 },
      { fontSize: 15, speed: 1.0, opacity: 0.6, color: "255,122,0", reset: 0.978 },
      { fontSize: 22, speed: 1.6, opacity: 1.0, color: "255,154,47", reset: 0.970 }
    ];

    for (const cfg of layerConfigs) {
      const cols = Math.floor(canvas.width / cfg.fontSize);
      matrixLayers.push({
        ...cfg,
        columns: cols,
        drops: Array.from({ length: cols }, () => Math.random() * -20)
      });
    }
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let matrixBurst = false;

  function drawMatrix() {
    ctx.fillStyle = matrixBurst ? "rgba(0,0,0,0.04)" : "rgba(0,0,0,0.07)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const layer of matrixLayers) {
      for (let i = 0; i < layer.drops.length; i++) {
        const char = letters.charAt(Math.floor(Math.random() * letters.length));
        const x = i * layer.fontSize;
        const y = layer.drops[i] * layer.fontSize;

        const headGlow = matrixBurst ? 0.95 : 0.8;
        ctx.font = layer.fontSize + "px monospace";

        if (Math.random() > 0.7) {
          ctx.shadowBlur = matrixBurst ? 18 : 10;
          ctx.shadowColor = "rgba(" + layer.color + "," + headGlow + ")";
          ctx.fillStyle = "rgba(255,220,180," + headGlow + ")";
        } else {
          ctx.shadowBlur = matrixBurst ? 8 : 3;
          ctx.shadowColor = "rgba(" + layer.color + ",0.4)";
          ctx.fillStyle = "rgba(" + layer.color + "," + layer.opacity + ")";
        }

        ctx.fillText(char, x, y);
        ctx.shadowBlur = 0;

        const speed = matrixBurst ? layer.speed * 2.2 : layer.speed;
        layer.drops[i] += speed;

        const resetThreshold = matrixBurst ? 0.96 : layer.reset;
        if (layer.drops[i] * layer.fontSize > canvas.height && Math.random() > resetThreshold) {
          layer.drops[i] = Math.random() * -8;
        }
      }
    }

    if (matrixBurst && Math.random() > 0.92) {
      ctx.fillStyle = "rgba(255,122,0,0.02)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  setInterval(drawMatrix, 40);

  // =====================
  // YOUTUBE MUSIC (PRIVE)
  // =====================

  const ytMusicBtn = document.getElementById("ytMusicBtn");
  const ytLoginOverlay = document.getElementById("ytLoginOverlay");
  const ytLoginForm = document.getElementById("ytLoginForm");
  const ytUsername = document.getElementById("ytUsername");
  const ytPassword = document.getElementById("ytPassword");
  const ytLoginClose = document.getElementById("ytLoginClose");
  const ytErrorOverlay = document.getElementById("ytErrorOverlay");
  const ytErrorCode = document.getElementById("ytErrorCode");
  const ytErrorBinary = document.getElementById("ytErrorBinary");
  const ytMusicFrame = document.getElementById("ytMusicFrame");

  const YT_USER = "alexmarceauprevost";
  const YT_PASS = "6718217";
  let ytUnlocked = false;

  if (ytMusicBtn) {
    ytMusicBtn.addEventListener("click", () => {
      if (ytUnlocked) {
        showScreen("ytMusicScreen");
        if (ytMusicFrame && ytMusicFrame.src === "about:blank") {
          ytMusicFrame.src = "https://music.youtube.com";
        }
      } else {
        if (ytLoginOverlay) ytLoginOverlay.classList.add("active");
        if (ytUsername) { ytUsername.value = ""; ytUsername.focus(); }
        if (ytPassword) ytPassword.value = "";
      }
    });
  }

  if (ytLoginClose) {
    ytLoginClose.addEventListener("click", () => {
      if (ytLoginOverlay) ytLoginOverlay.classList.remove("active");
    });
  }

  if (ytLoginForm) {
    ytLoginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const user = ytUsername ? ytUsername.value.trim() : "";
      const pass = ytPassword ? ytPassword.value.trim() : "";

      if (user === YT_USER && pass === YT_PASS) {
        ytUnlocked = true;
        if (ytLoginOverlay) ytLoginOverlay.classList.remove("active");
        showScreen("ytMusicScreen");
        if (ytMusicFrame) ytMusicFrame.src = "https://music.youtube.com";
      } else {
        if (ytLoginOverlay) ytLoginOverlay.classList.remove("active");
        showYtError();
      }
    });
  }

  function showYtError() {
    if (!ytErrorOverlay) return;

    const errorCodes = [
      "ERR_ACCESS_DENIED_0x8F2A",
      "FATAL_AUTH_FAILURE_0xDEAD",
      "SEC_VIOLATION_0x6661",
      "INTRUDER_DETECTED_0xFF00",
      "LOCK_PROTOCOL_0xBAAD",
      "BREACH_ATTEMPT_0x0403"
    ];

    if (ytErrorCode) {
      ytErrorCode.innerHTML = "";
      errorCodes.forEach((code) => {
        ytErrorCode.innerHTML += "[ " + code + " ]<br>";
      });
    }

    if (ytErrorBinary) {
      let binary = "";
      for (let i = 0; i < 500; i++) {
        binary += Math.random() > 0.5 ? "1" : "0";
        if (i % 60 === 59) binary += " ";
      }
      ytErrorBinary.textContent = binary;
    }

    ytErrorOverlay.classList.add("active");

    setTimeout(() => {
      ytErrorOverlay.classList.remove("active");
      showScreen("homeScreen");
    }, 5000);
  }

  // =====================
  // SYSTEME DE SECURITE
  // =====================

  const securityModal = document.getElementById("securityModal");
  const securityMessage = document.getElementById("securityMessage");
  const securityConfirm = document.getElementById("securityConfirm");
  const securityCancel = document.getElementById("securityCancel");
  let securityCallback = null;

  function showSecurityWarning(message, onConfirm) {
    if (securityMessage) securityMessage.textContent = message;
    securityCallback = onConfirm;
    if (securityModal) securityModal.classList.add("active");
  }

  function hideSecurityModal() {
    if (securityModal) securityModal.classList.remove("active");
    securityCallback = null;
  }

  if (securityConfirm) {
    securityConfirm.addEventListener("click", () => {
      if (securityCallback) securityCallback();
      hideSecurityModal();
    });
  }

  if (securityCancel) {
    securityCancel.addEventListener("click", hideSecurityModal);
  }

  // =====================
  // NAVIGATEUR D'APPS
  // =====================

  const appUrlInput = document.getElementById("appUrlInput");
  const appGoBtn = document.getElementById("appGoBtn");
  const appBrowserWrap = document.getElementById("appBrowserWrap");
  const appBrowserFrame = document.getElementById("appBrowserFrame");
  const appBrowserTitle = document.getElementById("appBrowserTitle");
  const appBrowserClose = document.getElementById("appBrowserClose");
  const appShortcuts = document.getElementById("appShortcuts");
  const addAppBtn = document.getElementById("addAppBtn");

  let savedApps = JSON.parse(localStorage.getItem("nr_apps") || "[]");

  function openAppUrl(url) {
    if (!url.startsWith("http")) url = "https://" + url;
    if (appBrowserWrap) appBrowserWrap.style.display = "";
    if (appBrowserFrame) appBrowserFrame.src = url;
    if (appBrowserTitle) appBrowserTitle.textContent = url;
    if (appUrlInput) appUrlInput.value = url;
  }

  if (appGoBtn) {
    appGoBtn.addEventListener("click", () => {
      const url = appUrlInput ? appUrlInput.value.trim() : "";
      if (url) openAppUrl(url);
    });
  }

  if (appUrlInput) {
    appUrlInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const url = appUrlInput.value.trim();
        if (url) openAppUrl(url);
      }
    });
  }

  if (appBrowserClose) {
    appBrowserClose.addEventListener("click", () => {
      if (appBrowserWrap) appBrowserWrap.style.display = "none";
      if (appBrowserFrame) appBrowserFrame.src = "about:blank";
    });
  }

  if (addAppBtn) {
    addAppBtn.addEventListener("click", () => {
      const name = prompt("Nom de l'app :");
      if (!name || !name.trim()) return;
      const url = prompt("URL de l'app :");
      if (!url || !url.trim()) return;

      savedApps.push({ name: name.trim(), url: url.trim() });
      localStorage.setItem("nr_apps", JSON.stringify(savedApps));
      renderAppShortcuts();
    });
  }

  function renderAppShortcuts() {
    if (!appShortcuts) return;
    appShortcuts.innerHTML = "";

    savedApps.forEach((app, index) => {
      const shortcut = document.createElement("div");
      shortcut.className = "app-shortcut";

      const initial = app.name.charAt(0).toUpperCase();

      shortcut.innerHTML =
        '<div class="app-shortcut-icon">' + initial + '</div>' +
        '<span>' + app.name + '</span>' +
        '<button class="app-shortcut-delete" type="button" data-index="' + index + '">supprimer</button>';

      shortcut.addEventListener("click", (e) => {
        if (e.target.classList.contains("app-shortcut-delete")) return;
        openAppUrl(app.url);
      });

      appShortcuts.appendChild(shortcut);
    });

    appShortcuts.querySelectorAll(".app-shortcut-delete").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.index);
        if (confirm("Supprimer " + savedApps[idx].name + " ?")) {
          savedApps.splice(idx, 1);
          localStorage.setItem("nr_apps", JSON.stringify(savedApps));
          renderAppShortcuts();
        }
      });
    });
  }

  renderAppShortcuts();

  // =====================
  // STUDIO DE CODE
  // =====================

  const codeTabs = document.querySelectorAll(".code-tab");
  const codeEditors = document.querySelectorAll(".code-editor");
  const codeRunBtn = document.getElementById("codeRunBtn");
  const codeSaveBtn = document.getElementById("codeSaveBtn");
  const codeLoadSelect = document.getElementById("codeLoadSelect");
  const codePreviewWrap = document.getElementById("codePreviewWrap");
  const codePreview = document.getElementById("codePreview");
  const codeClosePreview = document.getElementById("codeClosePreview");
  const codeEditorHtml = document.getElementById("codeEditorHtml");
  const codeEditorCss = document.getElementById("codeEditorCss");
  const codeEditorJs = document.getElementById("codeEditorJs");

  let codeProjects = JSON.parse(localStorage.getItem("nr_code_projects") || "[]");

  codeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      codeTabs.forEach((t) => t.classList.remove("active"));
      codeEditors.forEach((e) => e.classList.remove("active"));
      tab.classList.add("active");
      const lang = tab.dataset.lang;
      const editor = document.getElementById("codeEditor" + lang.charAt(0).toUpperCase() + lang.slice(1));
      if (editor) editor.classList.add("active");
    });
  });

  if (codeRunBtn) {
    codeRunBtn.addEventListener("click", () => {
      showSecurityWarning(
        "Tu es sur le point d'executer du code sur ton application privee. Confirmer ?",
        () => {
          const html = codeEditorHtml ? codeEditorHtml.value : "";
          const css = codeEditorCss ? codeEditorCss.value : "";
          const js = codeEditorJs ? codeEditorJs.value : "";

          const fullCode = "<!DOCTYPE html><html><head><style>" + css + "</style></head><body style='background:#111;color:#fff;font-family:Arial,sans-serif;padding:20px;'>" + html + "<script>" + js + "<\/script></body></html>";

          if (codePreviewWrap) codePreviewWrap.style.display = "";
          if (codePreview) {
            codePreview.srcdoc = fullCode;
          }
        }
      );
    });
  }

  if (codeClosePreview) {
    codeClosePreview.addEventListener("click", () => {
      if (codePreviewWrap) codePreviewWrap.style.display = "none";
    });
  }

  if (codeSaveBtn) {
    codeSaveBtn.addEventListener("click", () => {
      showSecurityWarning(
        "Tu es sur le point de sauvegarder du code sur ton application. Confirmer ?",
        () => {
          const name = prompt("Nom du projet :");
          if (!name || !name.trim()) return;

          codeProjects.push({
            name: name.trim(),
            html: codeEditorHtml ? codeEditorHtml.value : "",
            css: codeEditorCss ? codeEditorCss.value : "",
            js: codeEditorJs ? codeEditorJs.value : "",
            date: new Date().toISOString()
          });

          localStorage.setItem("nr_code_projects", JSON.stringify(codeProjects));
          renderCodeProjects();
          alert("Projet sauvegarde !");
        }
      );
    });
  }

  function renderCodeProjects() {
    if (!codeLoadSelect) return;
    codeLoadSelect.innerHTML = '<option value="">-- Charger un projet --</option>';

    codeProjects.forEach((project, index) => {
      const opt = document.createElement("option");
      opt.value = index;
      opt.textContent = project.name;
      codeLoadSelect.appendChild(opt);
    });
  }

  if (codeLoadSelect) {
    codeLoadSelect.addEventListener("change", () => {
      const index = parseInt(codeLoadSelect.value);
      if (isNaN(index)) return;

      const project = codeProjects[index];
      if (!project) return;

      if (codeEditorHtml) codeEditorHtml.value = project.html;
      if (codeEditorCss) codeEditorCss.value = project.css;
      if (codeEditorJs) codeEditorJs.value = project.js;
    });
  }

  renderCodeProjects();

  // =====================
  // GESTIONNAIRE DE FICHIERS PRIVES
  // =====================

  const fileUploadInput = document.getElementById("fileUploadInput");
  const filesList = document.getElementById("filesList");
  const filesEmpty = document.getElementById("filesEmpty");

  let storedFiles = JSON.parse(localStorage.getItem("nr_files") || "[]");

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " o";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " Ko";
    return (bytes / 1048576).toFixed(1) + " Mo";
  }

  function renderFiles() {
    if (!filesList) return;
    filesList.innerHTML = "";

    if (storedFiles.length === 0) {
      if (filesEmpty) filesEmpty.style.display = "";
      return;
    }

    if (filesEmpty) filesEmpty.style.display = "none";

    storedFiles.forEach((file, index) => {
      const item = document.createElement("div");
      item.className = "file-item";

      item.innerHTML =
        '<div class="file-item-info">' +
          '<div class="file-item-name">' + file.name + '</div>' +
          '<div class="file-item-size">' + formatFileSize(file.size) + '</div>' +
        '</div>' +
        '<div class="file-item-actions">' +
          '<button class="file-btn download" type="button" title="Telecharger" data-index="' + index + '">&#8595;</button>' +
          '<button class="file-btn delete" type="button" title="Supprimer" data-index="' + index + '">&#10005;</button>' +
        '</div>';

      filesList.appendChild(item);
    });

    filesList.querySelectorAll(".file-btn.download").forEach((btn) => {
      btn.addEventListener("click", () => downloadFile(parseInt(btn.dataset.index)));
    });

    filesList.querySelectorAll(".file-btn.delete").forEach((btn) => {
      btn.addEventListener("click", () => deleteFile(parseInt(btn.dataset.index)));
    });
  }

  function saveFilesToStorage() {
    try {
      localStorage.setItem("nr_files", JSON.stringify(storedFiles));
    } catch (e) {
      alert("Espace de stockage plein. Supprime des fichiers.");
    }
  }

  function addFiles(fileList) {
    for (const file of fileList) {
      const reader = new FileReader();
      reader.onload = () => {
        storedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          data: reader.result,
          date: new Date().toISOString()
        });
        saveFilesToStorage();
        renderFiles();
      };
      reader.readAsDataURL(file);
    }
  }

  function downloadFile(index) {
    const file = storedFiles[index];
    if (!file) return;

    const a = document.createElement("a");
    a.href = file.data;
    a.download = file.name;
    a.click();
  }

  function deleteFile(index) {
    if (!confirm("Supprimer ce fichier ?")) return;
    storedFiles.splice(index, 1);
    saveFilesToStorage();
    renderFiles();
  }

  if (fileUploadInput) {
    fileUploadInput.addEventListener("change", (event) => {
      if (event.target.files && event.target.files.length > 0) {
        addFiles(event.target.files);
        event.target.value = "";
      }
    });
  }

  renderFiles();

  // =====================
  // EVENT LISTENERS
  // =====================

  goLoginBtn.addEventListener("click", () => showScreen("loginScreen"));
  goSignupBtn.addEventListener("click", () => showScreen("signupScreen"));
  loginToSignupBtn.addEventListener("click", () => showScreen("signupScreen"));
  loginBackHomeBtn.addEventListener("click", () => showScreen("homeScreen"));
  signupToLoginBtn.addEventListener("click", () => showScreen("loginScreen"));
  signupBackHomeBtn.addEventListener("click", () => showScreen("homeScreen"));

  topNavBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.screen;
      if (target) showScreen(target);
    });
  });

  openMenuBtn.addEventListener("click", openMenu);
  closeMenuBtn.addEventListener("click", closeMenu);
  menuOverlay.addEventListener("click", closeMenu);

  menuLinks.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.textContent.trim() === "Entrer") {
        showScreen("chatScreen");
        return;
      }
      const target = button.dataset.screen;
      if (target === "chatScreen" && button.textContent.trim() === "Nouveau chat") {
        resetChat();
      }
      if (target) showScreen(target);
    });
  });

  screenButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.screen;
      if (button.textContent.trim() === "Nouveau chat") {
        resetChat();
      }
      if (target) showScreen(target);
    });
  });

  logoutBtn.addEventListener("click", () => {
    closeMenu();
    showScreenWithCRT("homeScreen");
    setTimeout(() => startHomeAnimation(), 3200);
  });

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = loginUsername.value.trim();
    const password = loginPassword.value.trim();

    if (username === "alex" && password === "1234") {
      loginErrorBox.classList.add("hidden");
      showScreenWithCRT("chatScreen");
    } else {
      showLoginError();
    }
  });

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    showScreenWithCRT("chatScreen");
  });

  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handleSendMessage();
  });

  newChatBtn.addEventListener("click", () => {
    resetChat();
    showScreen("chatScreen");
  });

  colorOptions.forEach((button) => {
    button.addEventListener("click", () => {
      const themeName = button.dataset.theme;
      if (themeName) applyTheme(themeName);
    });
  });

  avatarUpload.addEventListener("change", (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      saveAvatar(file);
    }
  });

  saveSettingsBtn.addEventListener("click", () => {
    if (geminiApiKeyInput) {
      const newKey = geminiApiKeyInput.value.trim();
      if (newKey) {
        geminiApiKey = newKey;
        localStorage.setItem("nr_gemini_key", geminiApiKey);
        if (geminiStatus) {
          geminiStatus.textContent = "Cle sauvegardee! Gemini IA est maintenant actif.";
          geminiStatus.style.color = "#00ff66";
        }
      }
    }
    updateAiStatus();
    alert("Parametres enregistres!");
  });

  // =====================
  // INIT
  // =====================

  updateClock();
  setInterval(updateClock, 1000);
  applyTheme(selectedTheme);
  setAvatarUI(avatarData);
  resetChat();
  startHomeAnimation();
  updateAiStatus();

  if (geminiApiKeyInput && geminiApiKey) {
    geminiApiKeyInput.value = geminiApiKey;
    if (geminiStatus) {
      geminiStatus.textContent = "Gemini IA actif";
      geminiStatus.style.color = "#00ff66";
    }
  }
});
