import { MongoClient } from "mongodb";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seed = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/members.seed.json"), "utf8"));

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "bni_anchor";
if (!uri) {
  console.error("Set MONGODB_URI");
  process.exit(1);
}

const client = new MongoClient(uri);
await client.connect();
const db = client.db(dbName);
const col = db.collection("members");
const now = new Date();

let n = 0;
for (const [i, m] of seed.members.entries()) {
  const doc = {
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
    avatarUrl: `/images/members/${m.id}.png`,
    sortOrder: i,
    published: true,
    updatedAt: now,
  };
  await col.updateOne({ slug: doc.slug }, { $set: doc }, { upsert: true });
  n += 1;
}

console.log(`Seeded ${n} members into ${dbName}`);
await client.close();
