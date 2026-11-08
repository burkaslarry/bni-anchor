import seed from "@/data/members.seed.json";
import { getDb, hasMongo } from "./db";
import type { LegacyMember, Member, MemberInput } from "./types";
import type { CategoryId } from "./categories";

const COLLECTION = "members";

function legacyAvatarUrl(slug: string): string {
  return `/images/members/${slug}.png`;
}

function fromLegacy(m: LegacyMember, sortOrder: number): MemberInput {
  return {
    slug: m.id,
    name: m.name,
    companyZh: m.companyZh ?? "",
    companyEn: m.companyEn ?? "",
    professionZh: m.professionZh,
    professionEn: m.professionEn,
    category: m.category,
    roleZh: m.roleZh,
    roleEn: m.roleEn,
    introZh: m.introZh,
    introEn: m.introEn,
    keywords: m.keywords,
    instagram: m.instagram,
    websiteUrl: "",
    lookingForZh: m.lookingForZh,
    lookingForEn: m.lookingForEn,
    gold: m.gold,
    avatarUrl: legacyAvatarUrl(m.id),
    sortOrder,
    published: true,
  };
}

export function getSeedMembers(): Member[] {
  const now = new Date();
  return (seed.members as LegacyMember[]).map((m, i) => ({
    ...fromLegacy(m, i),
    updatedAt: now,
  }));
}

export async function listPublishedMembers(): Promise<Member[]> {
  if (!hasMongo()) {
    return getSeedMembers().filter((m) => m.published);
  }
  try {
    const db = await getDb();
    const docs = await db
      .collection<Member>(COLLECTION)
      .find({ published: true })
      .sort({ sortOrder: 1, name: 1 })
      .toArray();
    return docs;
  } catch {
    return getSeedMembers().filter((m) => m.published);
  }
}

export async function listAllMembers(): Promise<Member[]> {
  if (!hasMongo()) {
    return getSeedMembers();
  }
  const db = await getDb();
  return db
    .collection<Member>(COLLECTION)
    .find({})
    .sort({ sortOrder: 1, name: 1 })
    .toArray();
}

export async function getMemberBySlug(slug: string): Promise<Member | null> {
  if (!hasMongo()) {
    return getSeedMembers().find((m) => m.slug === slug) ?? null;
  }
  const db = await getDb();
  return db.collection<Member>(COLLECTION).findOne({ slug });
}

export async function upsertMember(input: MemberInput): Promise<void> {
  const db = await getDb();
  const updatedAt = input.updatedAt ?? new Date();
  await db.collection<Member>(COLLECTION).updateOne(
    { slug: input.slug },
    { $set: { ...input, updatedAt } },
    { upsert: true },
  );
}

export async function deleteMember(slug: string): Promise<void> {
  const db = await getDb();
  await db.collection<Member>(COLLECTION).deleteOne({ slug });
}

export async function seedDatabase(): Promise<{ upserted: number }> {
  const db = await getDb();
  const members = getSeedMembers();
  let upserted = 0;
  for (const m of members) {
    const res = await db.collection<Member>(COLLECTION).updateOne(
      { slug: m.slug },
      { $set: m },
      { upsert: true },
    );
    if (res.upsertedCount || res.modifiedCount) upserted += 1;
  }
  await db.collection("meta").updateOne(
    { key: "seed" },
    { $set: { key: "seed", lastSeedAt: new Date(), memberCount: members.length } },
    { upsert: true },
  );
  return { upserted };
}

export function isCategoryId(v: string): v is CategoryId {
  return [
    "it",
    "professional",
    "construction",
    "lifestyle",
    "marketing",
    "fb",
    "medical",
    "education",
    "finance",
  ].includes(v);
}
