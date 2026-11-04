"use client";

import { useMemo, useState } from "react";
import { BNI_CATEGORIES, categoryById } from "@/lib/categories";
import type { Member } from "@/lib/types";
import { memberSearchHaystack } from "@/lib/search";

type Lang = "zh" | "en";

type Props = {
  members: Member[];
  initialLang?: Lang;
};

function igButtons(handles: string[] | undefined) {
  if (!handles?.length) return null;
  return (
    <div className="ig-row">
      {handles.map((h) => (
        <a
          key={h}
          className="ig-btn"
          href={`https://www.instagram.com/${h}/`}
          target="_blank"
          rel="noreferrer"
        >
          @{h}
        </a>
      ))}
    </div>
  );
}

export function MemberDirectory({ members, initialLang = "zh" }: Props) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [active, setActive] = useState<Member | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      if (category !== "all" && m.category !== category) return false;
      if (!q) return true;
      return memberSearchHaystack(m, lang).includes(q);
    });
  }, [members, query, category, lang]);

  return (
    <>
      <section className="toolbar" aria-label="Filters">
        <div className="search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M16.2 16.2 21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === "zh" ? "搜尋姓名、公司、行業或介紹" : "Search name, company, profession or intro"}
            aria-label={lang === "zh" ? "搜尋會員" : "Search members"}
          />
        </div>
        <div className="chips">
          <button
            type="button"
            className="chip"
            aria-pressed={category === "all"}
            onClick={() => setCategory("all")}
          >
            {lang === "zh" ? "全部類別" : "All categories"}
          </button>
          {BNI_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className="chip"
              aria-pressed={category === c.id}
              onClick={() => setCategory(c.id)}
            >
              {lang === "zh" ? c.zh : c.en}
            </button>
          ))}
        </div>
      </section>

      <section id="members" aria-label="BNI Anchor member directory">
        {!filtered.length ? (
          <p className="empty" id="empty">
            {lang === "zh" ? "沒有符合的會員，請試其他關鍵字。" : "No members match. Try another keyword."}
          </p>
        ) : (
          <div className="grid" aria-live="polite">
            {filtered.map((m) => {
              const cat = categoryById(m.category)!;
              const profession = lang === "zh" ? m.professionZh : m.professionEn;
              const company = lang === "zh" ? m.companyZh : m.companyEn;
              const intro = lang === "zh" ? m.introZh : m.introEn;
              const role = lang === "zh" ? m.roleZh : m.roleEn;
              const catLabel = lang === "zh" ? cat.zh : cat.en;
              const avatar = m.avatarUrl || `/images/members/${m.slug}.png`;
              return (
                <article className="card-wrap" key={m.slug}>
                  <div className="card-shell" style={{ ["--cat" as string]: cat.color }}>
                    <button type="button" className="card" onClick={() => setActive(m)}>
                      <div className="card-top">
                        <img
                          className="avatar"
                          src={avatar}
                          alt={m.name}
                          width={84}
                          height={84}
                          loading="lazy"
                          decoding="async"
                        />
                        <div>
                          <div className="badges">
                            <span className="badge">{catLabel}</span>
                            {role ? <span className="badge role">{role}</span> : null}
                            {m.gold ? (
                              <span className="badge gold">{lang === "zh" ? "金章會員" : "Gold member"}</span>
                            ) : null}
                          </div>
                          <h2 className="card-name">{m.name}</h2>
                          <p className="profession">{profession}</p>
                        </div>
                      </div>
                      {company ? <p className="company">{company}</p> : null}
                      <p className="intro">{intro}</p>
                    </button>
                    {igButtons(m.instagram)}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {active ? (
        <div className="modal" id="modal" role="presentation" onClick={() => setActive(null)}>
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            style={{ ["--cat" as string]: categoryById(active.category)?.color }}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="modal-close" aria-label="Close" onClick={() => setActive(null)}>
              ×
            </button>
            <div className="modal-head">
              <img
                src={active.avatarUrl || `/images/members/${active.slug}.png`}
                alt={active.name}
                width={120}
                height={120}
              />
              <div>
                <h2 id="member-title">{active.name}</h2>
                <p>{lang === "zh" ? active.professionZh : active.professionEn}</p>
              </div>
            </div>
            <dl className="modal-fields">
              <div className="field">
                <dt>{lang === "zh" ? "業務類別" : "Category"}</dt>
                <dd>{lang === "zh" ? categoryById(active.category)?.zh : categoryById(active.category)?.en}</dd>
              </div>
              {(lang === "zh" ? active.companyZh : active.companyEn) ? (
                <div className="field">
                  <dt>{lang === "zh" ? "公司" : "Company"}</dt>
                  <dd>
                    {active.websiteUrl ? (
                      <a href={active.websiteUrl} target="_blank" rel="noreferrer">
                        {lang === "zh" ? active.companyZh : active.companyEn}
                      </a>
                    ) : (
                      lang === "zh" ? active.companyZh : active.companyEn
                    )}
                  </dd>
                </div>
              ) : null}
              <div className="field">
                <dt>{lang === "zh" ? "業務介紹" : "Introduction"}</dt>
                <dd>{lang === "zh" ? active.introZh : active.introEn}</dd>
              </div>
              {active.instagram?.length ? (
                <div className="field">
                  <dt>Instagram</dt>
                  <dd>{igButtons(active.instagram)}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className="float-nav-toggle"
        aria-label={lang === "zh" ? "語言" : "Language"}
        style={{ position: "fixed", bottom: 88, right: 24, zIndex: 50, padding: "10px 14px", borderRadius: 999 }}
        onClick={() => setLang(lang === "zh" ? "en" : "zh")}
      >
        {lang === "zh" ? "EN" : "中文"}
      </button>
    </>
  );
}
