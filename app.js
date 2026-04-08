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

  const enterBtn = document.getElementById("enterBtn");
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

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const loginErrorBox = document.getElementById("loginErrorBox");
  const loginUsername = document.getElementById("loginUsername");
  const loginPassword = document.getElementById("loginPassword");

  const colorOptions = document.querySelectorAll(".color-option");
  const screenButtons = document.querySelectorAll("[data-screen]");
  const menuLinks = document.querySelectorAll(".menu-link");

  const avatarUpload = document.getElementById("avatarUpload");
  const settingsAvatarPreview = document.getElementById("settingsAvatarPreview");
  const introAvatar = document.getElementById("introAvatar");
  const homeAvatar = document.getElementById("homeAvatar");
  const miniAvatar = document.getElementById("miniAvatar");
  const introMessage = document.getElementById("introMessage");

  let selectedTheme = localStorage.getItem("nr_theme") || "noir";
  let avatarData = localStorage.getItem("nr_avatar") || "";

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

  function getDemoResponse(userText) {
    const text = userText.toLowerCase().trim();

    const rules = [
      {
        keywords: ["bonjour", "salut", "allo", "hello"],
        replies: [
          "Salut Alex. Je suis pret a t'aider.",
          "Bonjour Alex. Que veux-tu faire aujourd'hui ?",
          "Salut Alex, ton assistant travail est en ligne."
        ]
      },
      {
        keywords: ["ca va", "comment vas", "tu vas bien"],
        replies: [
          "Oui Alex, je vais bien et je suis pret a travailler avec toi.",
          "Je suis operationnel Alex.",
          "Tout est pret de mon cote."
        ]
      },
      {
        keywords: ["travail", "job", "projet", "tache", "mission"],
        replies: [
          "On peut organiser ton travail, tes projets et tes idees ici.",
          "Je peux t'aider a structurer un projet etape par etape.",
          "Dis-moi ton objectif de travail et je t'aide a le decouper."
        ]
      },
      {
        keywords: ["code", "coder", "html", "css", "javascript", "js"],
        replies: [
          "Je peux t'aider a ecrire du code HTML, CSS et JavaScript.",
          "On peut corriger ton code ou construire une nouvelle base propre.",
          "Dis-moi ce que tu veux coder et je te guide."
        ]
      },
      {
        keywords: ["avatar", "photo", "image", "profil"],
        replies: [
          "Tu peux changer ton avatar dans les parametres quand tu veux.",
          "Va dans Parametres pour telecharger une nouvelle image.",
          "L'avatar peut etre mis a jour localement depuis ton appareil."
        ]
      },
      {
        keywords: ["matrix", "pluie", "effet", "animation"],
        replies: [
          "La pluie Matrix reste active en arriere-plan de l'application.",
          "L'effet Matrix tourne deja sur l'ecran.",
          "On peut renforcer l'effet Matrix si tu veux une version plus intense."
        ]
      },
      {
        keywords: ["heure", "temps", "clock"],
        replies: [
          "L'heure s'affiche en haut a droite dans l'application.",
          "Le systeme met l'heure a jour automatiquement.",
          "L'horloge fonctionne en direct."
        ]
      },
      {
        keywords: ["parametre", "parametres", "reglage", "theme", "couleur"],
        replies: [
          "Dans les parametres, tu peux changer le theme et l'avatar.",
          "Les couleurs disponibles sont noir, blanc, orange, bleu, rouge et vert.",
          "Le theme principal reste noir avec texte blanc et accent orange."
        ]
      },
      {
        keywords: ["connexion", "connecter", "login", "mot de passe", "utilisateur"],
        replies: [
          "La connexion locale verifie actuellement le nom utilisateur et le mot de passe.",
          "Si les identifiants sont faux, l'application affiche une tete de mort et retourne a l'accueil.",
          "On peut renforcer le systeme de connexion plus tard."
        ]
      },
      {
        keywords: ["alex"],
        replies: [
          "Oui Alex, je suis la.",
          "Bienvenue Alex. Que veux-tu faire maintenant ?",
          "Je suis pret a travailler avec toi Alex."
        ]
      },
      {
        keywords: ["aide", "help", "quoi faire", "menu"],
        replies: [
          "Je peux t'aider avec le travail, le code, les projets, les themes et l'organisation.",
          "Tu peux utiliser le menu pour acceder au travail, a l'historique et aux parametres.",
          "Demande-moi par exemple : aide projet, aide code, aide theme, aide travail."
        ]
      }
    ];

    for (const rule of rules) {
      if (rule.keywords.some((keyword) => text.includes(keyword))) {
        return rule.replies[Math.floor(Math.random() * rule.replies.length)];
      }
    }

    if (text.length < 3) {
      return "Ecris-moi une question un peu plus complete, Alex.";
    }

    if (text.endsWith("?")) {
      return "Bonne question Alex. Donne-moi un peu plus de details et je vais t'aider.";
    }

    const genericReplies = [
      "Message recu. Explique-moi ton besoin plus en detail et je t'aide.",
      "Je comprends. Donne-moi plus de contexte pour que je te reponde mieux.",
      "Je suis pret a t'aider. Precise ce que tu veux faire exactement.",
      "On peut travailler la-dessus ensemble. Dis-moi la prochaine etape."
    ];

    return genericReplies[Math.floor(Math.random() * genericReplies.length)];
  }

  function handleSendMessage() {
    const userText = chatInput.value.trim();
    if (!userText) return;

    addMessage(userText, "user");
    chatInput.value = "";
    animateAiOrb();

    setTimeout(() => {
      addMessage(getDemoResponse(userText), "ai");
      animateAiOrb();
    }, 550);
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
    const targets = [settingsAvatarPreview, introAvatar, homeAvatar, miniAvatar, aiOrb];

    targets.forEach((target) => {
      if (!target) return;

      if (imageData) {
        target.innerHTML = '<img src="' + imageData + '" alt="Avatar" />';
      } else {
        if (target === introAvatar || target === homeAvatar) {
          target.innerHTML =
            '<div class="eyes"><div class="eye"></div><div class="eye"></div></div><div class="fallback">IA</div>';
        } else {
          target.textContent = "IA";
        }
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
  // INTRO
  // =====================

  function startIntroSequence() {
    showScreen("introScreen");
    introMessage.textContent = "";

    setTimeout(() => {
      introMessage.textContent = "Salut Alex";
    }, 5000);

    setTimeout(() => {
      showScreen("homeScreen");
    }, 7600);
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

  enterBtn.addEventListener("click", () => showScreen("chatScreen"));
  goLoginBtn.addEventListener("click", () => showScreen("loginScreen"));
  goSignupBtn.addEventListener("click", () => showScreen("signupScreen"));
  loginToSignupBtn.addEventListener("click", () => showScreen("signupScreen"));
  loginBackHomeBtn.addEventListener("click", () => showScreen("homeScreen"));
  signupToLoginBtn.addEventListener("click", () => showScreen("loginScreen"));
  signupBackHomeBtn.addEventListener("click", () => showScreen("homeScreen"));

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
    showScreen("homeScreen");
  });

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = loginUsername.value.trim();
    const password = loginPassword.value.trim();

    if (username === "alex" && password === "1234") {
      loginErrorBox.classList.add("hidden");
      showScreen("chatScreen");
    } else {
      showLoginError();
    }
  });

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    showScreen("chatScreen");
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
    alert("Parametres enregistres");
  });

  // =====================
  // INIT
  // =====================

  updateClock();
  setInterval(updateClock, 1000);
  applyTheme(selectedTheme);
  setAvatarUI(avatarData);
  resetChat();
  startIntroSequence();
});
