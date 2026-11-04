import sharp from "sharp";

/** Square crop with face biased toward upper center (matches legacy site avatars). */
export async function processMemberAvatar(input: Buffer): Promise<Buffer> {
  const image = sharp(input).rotate();
  const meta = await image.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (!width || !height) {
    throw new Error("Invalid image dimensions");
  }

  const side = Math.min(width, height);
  const left = Math.max(0, Math.round((width - side) / 2));
  const top = Math.max(0, Math.round((height - side) * 0.38));

  return image
    .extract({
      left,
      top,
      width: Math.min(side, width - left),
      height: Math.min(side, height - top),
    })
    .resize(512, 512, { fit: "cover" })
    .webp({ quality: 85 })
    .toBuffer();
}
