const I18N = {
  zh: {
    title: "BNI Anchor 會員名錄",
    docTitle: "BNI Anchor 會員名錄",
    kicker: "BNI Anchor 香港分會",
    headline: "Stronger. Bigger. We are <span>Anchor</span>.",
    lead: "一站式瀏覽 BNI Anchor 專業會員：姓名、行業、公司與業務介紹。可用關鍵字搜尋，亦可以業務類別篩選。每週四聚會，Givers Gain®。",
    search: "搜尋姓名、公司、行業或介紹",
    searchAria: "搜尋會員",
    all: "全部類別",
    count: (n) => `${n} 位會員`,
    categories: "9 個業務類別",
    thursday: "星期四分會",
    company: "公司",
    profession: "專業",
    category: "業務類別",
    intro: "業務介紹",
    role: "分會職務",
    gold: "金章會員",
    empty: "沒有符合的會員，請試其他關鍵字。",
    close: "關閉",
    lang: "EN",
    langAria: "切換為英文",
    themeAria: "切換淺色或深色模式",
    footer: "BNI Anchor 分會會員名錄。資料來自 2026 年 9 月會員名單。",
    instagram: "Instagram"
  },
  en: {
    title: "BNI Anchor Member Directory",
    docTitle: "BNI Anchor Member Directory",
    kicker: "BNI Anchor Hong Kong",
    headline: "Stronger. Bigger. We are <span>Anchor</span>.",
    lead: "Browse BNI Anchor members by name, profession, company and introduction. Search by keyword or filter by business category. We meet on Thursdays. Givers Gain®.",
    search: "Search name, company, profession or introduction",
    searchAria: "Search members",
    all: "All categories",
    count: (n) => `${n} members`,
    categories: "9 business categories",
    thursday: "Thursday chapter",
    company: "Company",
    profession: "Profession",
    category: "Business category",
    intro: "Introduction",
    role: "Chapter role",
    gold: "Gold Club member",
    empty: "No members match that search. Try another keyword.",
    close: "Close",
    lang: "中文",
    langAria: "Switch to Traditional Chinese",
    themeAria: "Toggle light or dark mode",
    footer: "BNI Anchor chapter member directory. Information from the September 2026 member list.",
    instagram: "Instagram"
  }
};

const state = {
  lang: localStorage.getItem("bni-lang") || "zh",
  theme: localStorage.getItem("bni-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
  query: "",
  category: "all",
  activeId: null
};

const $ = (sel) => document.querySelector(sel);

function t(key) {
  return I18N[state.lang][key];
}

function catMeta(id) {
  return window.BNI_CATEGORIES.find((c) => c.id === id);
}

function applyChrome() {
  document.documentElement.lang = state.lang === "zh" ? "zh-Hant" : "en";
  document.documentElement.dataset.theme = state.theme;
  document.title = t("docTitle");
  $("#kicker").textContent = t("kicker");
  $("#headline").innerHTML = t("headline");
  $("#lead").textContent = t("lead");
  $("#search").placeholder = t("search");
  $("#search").setAttribute("aria-label", t("searchAria"));
  $("#lang-btn").textContent = t("lang");
  $("#lang-btn").setAttribute("aria-label", t("langAria"));
  $("#theme-btn").setAttribute("aria-label", t("themeAria"));
  $("#theme-btn").setAttribute("aria-pressed", state.theme === "dark" ? "true" : "false");
  $("#stat-count").innerHTML = `<b>${window.BNI_MEMBERS.length}</b> ${state.lang === "zh" ? "位會員" : "members"}`;
  $("#stat-cats").textContent = t("categories");
  $("#stat-day").textContent = t("thursday");
  $("#footer-copy").textContent = t("footer");
  $("#ig-link").textContent = t("instagram");
}

function matches(member) {
  if (state.category !== "all" && member.category !== state.category) return false;
  const q = state.query.trim().toLowerCase();
  if (!q) return true;
  const cat = catMeta(member.category);
  const hay = [
    member.name,
    member.companyZh,
    member.companyEn,
    member.professionZh,
    member.professionEn,
    member.introZh,
    member.introEn,
    member.roleZh,
    member.roleEn,
    member.keywords,
    cat?.zh,
    cat?.en
  ].filter(Boolean).join(" ").toLowerCase();
  return hay.includes(q);
}

function renderChips() {
  const wrap = $("#chips");
  const items = [{ id: "all", zh: t("all"), en: t("all") }, ...window.BNI_CATEGORIES];
  wrap.innerHTML = items.map((c) => {
    const label = c.id === "all" ? t("all") : (state.lang === "zh" ? c.zh : c.en);
    const pressed = state.category === c.id;
    return `<button class="chip" type="button" data-cat="${c.id}" aria-pressed="${pressed}">${label}</button>`;
  }).join("");
}

function cardHTML(m) {
  const cat = catMeta(m.category);
  const profession = state.lang === "zh" ? m.professionZh : m.professionEn;
  const company = state.lang === "zh" ? m.companyZh : m.companyEn;
  const intro = state.lang === "zh" ? m.introZh : m.introEn;
  const role = state.lang === "zh" ? m.roleZh : m.roleEn;
  const catLabel = state.lang === "zh" ? cat.zh : cat.en;
  return `
    <button class="card" type="button" data-id="${m.id}" style="--cat:${cat.color}">
      <div class="card-top">
        <img class="avatar" src="images/members/${m.id}.png" alt="${m.name}" width="84" height="84">
        <div>
          <div class="badges">
            <span class="badge">${catLabel}</span>
            ${role ? `<span class="badge role">${role}</span>` : ""}
            ${m.gold ? `<span class="badge gold">${t("gold")}</span>` : ""}
          </div>
          <h2 class="card-name">${m.name}</h2>
          <p class="profession">${profession}</p>
        </div>
      </div>
      ${company ? `<p class="company">${company}</p>` : ""}
      <p class="intro">${intro}</p>
    </button>
  `;
}

function renderGrid() {
  const list = window.BNI_MEMBERS.filter(matches);
  const grid = $("#grid");
  const empty = $("#empty");
  if (!list.length) {
    grid.innerHTML = "";
    empty.hidden = false;
    empty.textContent = t("empty");
    return;
  }
  empty.hidden = true;
  grid.innerHTML = list.map(cardHTML).join("");
}

function openModal(id) {
  const m = window.BNI_MEMBERS.find((x) => x.id === id);
  if (!m) return;
  const cat = catMeta(m.category);
  const profession = state.lang === "zh" ? m.professionZh : m.professionEn;
  const company = state.lang === "zh" ? m.companyZh : m.companyEn;
  const intro = state.lang === "zh" ? m.introZh : m.introEn;
  const role = state.lang === "zh" ? m.roleZh : m.roleEn;
  const catLabel = state.lang === "zh" ? cat.zh : cat.en;
  state.activeId = id;
  const modal = $("#modal");
  modal.hidden = false;
  modal.innerHTML = `
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="member-title" style="--cat:${cat.color}">
      <button class="modal-close" type="button" data-close aria-label="${t("close")}">×</button>
      <div class="modal-head">
        <img src="images/members/${m.id}.png" alt="${m.name}" width="120" height="120">
        <div>
          <div class="badges">
            <span class="badge">${catLabel}</span>
            ${role ? `<span class="badge role">${role}</span>` : ""}
            ${m.gold ? `<span class="badge gold">${t("gold")}</span>` : ""}
          </div>
          <h2 id="member-title">${m.name}</h2>
          <p class="profession">${profession}</p>
        </div>
      </div>
      <dl class="modal-grid">
        ${company ? `<div class="field"><dt>${t("company")}</dt><dd>${company}</dd></div>` : ""}
        <div class="field"><dt>${t("profession")}</dt><dd>${profession}</dd></div>
        <div class="field"><dt>${t("category")}</dt><dd>${catLabel}</dd></div>
        <div class="field"><dt>${t("intro")}</dt><dd>${intro}</dd></div>
      </dl>
    </div>
  `;
  modal.querySelector(".modal-close").focus();
}

function closeModal() {
  state.activeId = null;
  const modal = $("#modal");
  modal.hidden = true;
  modal.innerHTML = "";
}

function render() {
  applyChrome();
  renderChips();
  renderGrid();
  if (state.activeId) openModal(state.activeId);
}

function init() {
  applyChrome();
  render();

  $("#search").addEventListener("input", (e) => {
    state.query = e.target.value;
    renderGrid();
  });

  $("#chips").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    state.category = btn.dataset.cat;
    renderChips();
    renderGrid();
  });

  $("#grid").addEventListener("click", (e) => {
    const card = e.target.closest("[data-id]");
    if (card) openModal(card.dataset.id);
  });

  $("#modal").addEventListener("click", (e) => {
    if (e.target.id === "modal" || e.target.closest("[data-close]")) closeModal();
  });

  $("#lang-btn").addEventListener("click", () => {
    state.lang = state.lang === "zh" ? "en" : "zh";
    localStorage.setItem("bni-lang", state.lang);
    render();
  });

  $("#theme-btn").addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    localStorage.setItem("bni-theme", state.theme);
    applyChrome();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

document.addEventListener("DOMContentLoaded", init);
