import type { Member } from "./types";

export function memberSearchHaystack(m: Member, _lang: "zh" | "en"): string {
  return [
    m.name,
    m.companyZh,
    m.companyEn,
    m.professionZh,
    m.professionEn,
    m.introZh,
    m.introEn,
    m.roleZh,
    m.roleEn,
    m.keywords,
    m.instagram?.join(" "),
    m.category,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
