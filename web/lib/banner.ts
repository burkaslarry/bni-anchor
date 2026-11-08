import sharp from "sharp";

/** Wide chapter photo — preserve aspect ratio, max width for homepage banner. */
export async function processChapterBanner(input: Buffer): Promise<Buffer> {
  const image = sharp(input).rotate();
  const meta = await image.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (!width || !height) {
    throw new Error("Invalid image dimensions");
  }

  return image
    .resize({ width: 1600, height: 900, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 88 })
    .toBuffer();
}
