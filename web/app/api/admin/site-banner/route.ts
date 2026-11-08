import { requireAdmin } from "@/lib/auth";
import { hasMongo } from "@/lib/db";
import { DEFAULT_SITE_BANNER, getSiteBanner, setSiteBanner } from "@/lib/site-banner";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const banner = await getSiteBanner();
  return NextResponse.json({ banner, canPersist: hasMongo() });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasMongo()) {
    return NextResponse.json({ error: "MONGODB_URI is not configured" }, { status: 503 });
  }

  const body = (await request.json()) as { alt?: string; imageUrl?: string };
  const current = await getSiteBanner();
  const imageUrl =
    typeof body.imageUrl === "string" && body.imageUrl.trim()
      ? body.imageUrl.trim()
      : current.imageUrl;
  const alt =
    typeof body.alt === "string" && body.alt.trim()
      ? body.alt.trim()
      : current.alt || DEFAULT_SITE_BANNER.alt;

  if (!imageUrl) {
    return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
  }

  try {
    await setSiteBanner({ imageUrl, alt });
    return NextResponse.json({ ok: true, banner: { imageUrl, alt } });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to save";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
