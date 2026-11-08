import { requireAdmin } from "@/lib/auth";
import { processChapterBanner } from "@/lib/banner";
import { DEFAULT_SITE_BANNER, setSiteBanner } from "@/lib/site-banner";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "BLOB_READ_WRITE_TOKEN is not set. Create a Blob store in Vercel or keep the default image under /public/images/photos.",
      },
      { status: 503 },
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  const alt = String(form.get("alt") ?? "").trim();
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  let processed: Buffer;
  try {
    processed = await processChapterBanner(bytes);
  } catch {
    return NextResponse.json({ error: "Could not process image" }, { status: 400 });
  }

  const blob = await put("site/chapter-banner.webp", processed, {
    access: "public",
    contentType: "image/webp",
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  const banner = {
    imageUrl: blob.url,
    alt: alt || DEFAULT_SITE_BANNER.alt,
  };

  try {
    await setSiteBanner(banner);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to save banner settings";
    return NextResponse.json({ error: message }, { status: 503 });
  }

  return NextResponse.json({ ok: true, ...banner });
}
