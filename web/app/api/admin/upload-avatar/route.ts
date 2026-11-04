import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/auth";
import { processMemberAvatar } from "@/lib/avatar";
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
          "BLOB_READ_WRITE_TOKEN is not set. Create a Blob store in Vercel or use local seed avatars under /public/images/members.",
      },
      { status: 503 },
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  const slug = String(form.get("slug") ?? "").trim();
  if (!(file instanceof File) || !slug) {
    return NextResponse.json({ error: "file and slug are required" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const processed = await processMemberAvatar(bytes);
  const pathname = `members/${slug}.webp`;

  const blob = await put(pathname, processed, {
    access: "public",
    contentType: "image/webp",
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  return NextResponse.json({ url: blob.url });
}
