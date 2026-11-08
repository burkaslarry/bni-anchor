import { getDb, hasMongo } from "./db";

const META_KEY = "site_banner";

export type SiteBanner = {
  imageUrl: string;
  alt: string;
  updatedAt?: Date;
};

export const DEFAULT_SITE_BANNER: SiteBanner = {
  imageUrl: "/images/photos/group.jpg",
  alt: "BNI Anchor 第三屆領導團隊",
};

type BannerDoc = SiteBanner & { key: string };

export async function getSiteBanner(): Promise<SiteBanner> {
  if (!hasMongo()) {
    return DEFAULT_SITE_BANNER;
  }
  try {
    const db = await getDb();
    const doc = await db.collection<BannerDoc>("meta").findOne({ key: META_KEY });
    if (!doc?.imageUrl) {
      return DEFAULT_SITE_BANNER;
    }
    return {
      imageUrl: doc.imageUrl,
      alt: doc.alt?.trim() || DEFAULT_SITE_BANNER.alt,
      updatedAt: doc.updatedAt,
    };
  } catch {
    return DEFAULT_SITE_BANNER;
  }
}

export async function setSiteBanner(banner: SiteBanner): Promise<void> {
  const db = await getDb();
  await db.collection<BannerDoc>("meta").updateOne(
    { key: META_KEY },
    {
      $set: {
        key: META_KEY,
        imageUrl: banner.imageUrl,
        alt: banner.alt.trim() || DEFAULT_SITE_BANNER.alt,
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );
}
