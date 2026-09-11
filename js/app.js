const I18N = {
  zh: {
    title: "BNI Anchor 會員名錄",
    docTitle: "BNI Anchor 香港分會｜星期四商務人脈網絡與會員名錄",
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
    instagram: "Instagram",
    navMembers: "會員名單",
    navClients: "我們的客戶",
    navInquire: "查詢",
    newsTitle: "最新動態",
    clientsTitle: "我們的客戶",
    inquireChapter: "BNI Anchor 分會",
    inquireTitle: "查詢",
    labelFirst: "名字",
    labelLast: "姓氏",
    labelPhone: "電話",
    labelEmail: "電子郵件",
    labelIndustry: "公司行業",
    inquireSubmit: "提交，想來一次商務會議",
    inquireNote: "提交後會開啟 WhatsApp，資料會發送予BNI Anchor 司庫",
    inquireError: "請填妥名字、姓氏、電話、電郵與公司行業。",
    waIntro: "BNI Anchor 分會查詢",
    waIntent: "我想來一次商務會議。",
    waTo: "謝謝。",
    metaDesc: "BNI Anchor 是香港九龍的 BNI 星期四分會，聚會於彌敦道 380 號香港逸東酒店。瀏覽會員名錄與客戶，或經 WhatsApp 預約商務會議。",
    navLocation: "聚會地點",
    locationTitle: "聚會地點",
    locationLead: "BNI Anchor 是香港九龍的 BNI 星期四分會，服務本地專業人士與企業主，以 Givers Gain® 互相轉介生意。",
    locationWhereLabel: "地址",
    locationStreet: "香港逸東酒店 2 樓 Maggie，彌敦道 380 號",
    locationWhenLabel: "聚會時間",
    locationWhen: "逢星期四早上（商務交流約 06:30，會議 07:00–09:00）",
    locationAreaLabel: "服務地區",
    locationArea: "香港、九龍、油尖旺、佐敦、油麻地",
    locationContactLabel: "聯絡",
    locationMap: "在 Google 地圖開啟"
  },
  en: {
    title: "BNI Anchor Member Directory",
    docTitle: "BNI Anchor Hong Kong | Thursday Business Networking Chapter",
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
    instagram: "Instagram",
    navMembers: "Members",
    navClients: "Our Clients",
    navInquire: "Enquire",
    newsTitle: "Latest news",
    clientsTitle: "Our Clients",
    inquireChapter: "BNI Anchor Chapter",
    inquireTitle: "Enquire",
    labelFirst: "First name",
    labelLast: "Last name",
    labelPhone: "Phone",
    labelEmail: "Email",
    labelIndustry: "Company / industry",
    inquireSubmit: "Submit — I'd like to visit a business meeting",
    inquireNote: "Submit opens WhatsApp with your details to BNI Anchor Treasurer",
    inquireError: "Please complete first name, last name, phone, email and industry.",
    waIntro: "BNI Anchor chapter enquiry",
    waIntent: "I would like to visit a business meeting.",
    waTo: "Please follow up with Frankie Ng. Thank you.",
    metaDesc: "BNI Anchor is a Thursday BNI chapter in Kowloon, Hong Kong, meeting at Eaton HK, 380 Nathan Road. Browse members and clients, or book a visitor business meeting on WhatsApp.",
    navLocation: "Location",
    locationTitle: "Meeting location",
    locationLead: "BNI Anchor is a Thursday BNI chapter in Kowloon, Hong Kong. Local professionals and business owners exchange referrals under Givers Gain®.",
    locationWhereLabel: "Address",
    locationStreet: "Room Maggie, 2/F, Eaton HK, 380 Nathan Road",
    locationWhenLabel: "Meeting time",
    locationWhen: "Every Thursday morning (networking from about 06:30, meeting 07:00–09:00)",
    locationAreaLabel: "Area served",
    locationArea: "Hong Kong, Kowloon, Yau Tsim Mong, Jordan, Yau Ma Tei",
    locationContactLabel: "Contact",
    locationMap: "Open in Google Maps"
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
  $("#nav-members").textContent = t("navMembers");
  $("#nav-clients").textContent = t("navClients");
  $("#nav-location").textContent = t("navLocation");
  $("#nav-inquire").textContent = t("navInquire");
  $("#news-title").textContent = t("newsTitle");
  $("#clients-title").textContent = t("clientsTitle");
  $("#inquire-chapter").textContent = t("inquireChapter");
  $("#inquire-title").textContent = t("inquireTitle");
  $("#label-first").textContent = t("labelFirst");
  $("#label-last").textContent = t("labelLast");
  $("#label-phone").textContent = t("labelPhone");
  $("#label-email").textContent = t("labelEmail");
  $("#label-industry").textContent = t("labelIndustry");
  $("#inquire-submit").textContent = t("inquireSubmit");
  $("#location-title").textContent = t("locationTitle");
  $("#location-lead").textContent = t("locationLead");
  $("#location-where-label").textContent = t("locationWhereLabel");
  $("#location-street").textContent = t("locationStreet");
  $("#location-when-label").textContent = t("locationWhenLabel");
  $("#location-when").textContent = t("locationWhen");
  $("#location-area-label").textContent = t("locationAreaLabel");
  $("#location-area").textContent = t("locationArea");
  $("#location-contact-label").textContent = t("locationContactLabel");
  $("#location-map").textContent = t("locationMap");
  setMeta('meta[name="description"]', t("metaDesc"));
  setMeta('meta[property="og:title"]', t("docTitle"));
  setMeta('meta[property="og:description"]', t("metaDesc"));
  setMeta('meta[property="og:locale"]', state.lang === "zh" ? "zh_HK" : "en_US");
  setMeta('meta[name="twitter:title"]', t("docTitle"));
  setMeta('meta[name="twitter:description"]', t("metaDesc"));
  const note = $("#inquire-note");
  if (note && !note.classList.contains("error")) note.textContent = t("inquireNote");
}

function setMeta(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute("content", value);
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

  $("#inquire-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const first = $("#inq-first").value.trim();
    const last = $("#inq-last").value.trim();
    const phone = $("#inq-phone").value.trim();
    const email = $("#inq-email").value.trim();
    const industry = $("#inq-industry").value.trim();
    const note = $("#inquire-note");
    if (!first || !last || !phone || !email || !industry) {
      note.classList.add("error");
      note.textContent = t("inquireError");
      return;
    }
    note.classList.remove("error");
    note.textContent = t("inquireNote");
    const lines = [
      t("waIntro"),
      "",
      t("waIntent"),
      "",
      `${t("labelFirst")}: ${first}`,
      `${t("labelLast")}: ${last}`,
      `${t("labelPhone")}: ${phone}`,
      `${t("labelEmail")}: ${email}`,
      `${t("labelIndustry")}: ${industry}`,
      "",
      t("waTo")
    ];
    const url = `https://wa.me/85266989778?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener");
  });
}

document.addEventListener("DOMContentLoaded", init);
