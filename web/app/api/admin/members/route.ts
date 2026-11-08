import { requireAdmin } from "@/lib/auth";
import { hasMongo } from "@/lib/db";
import { deleteMember, listAllMembers, upsertMember } from "@/lib/members";
import { isCategoryId } from "@/lib/members";
import type { MemberInput } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const members = await listAllMembers();
    return NextResponse.json({ members });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load members";
    return NextResponse.json({ error: message }, { status: 503 });
  }
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

  const body = (await request.json()) as Partial<MemberInput>;
  const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return NextResponse.json(
      { error: "Slug is required (lowercase letters, numbers, hyphens only, e.g. raymond-kuo)" },
      { status: 400 },
    );
  }
  if (!body.name?.trim() || !body.category || !isCategoryId(body.category)) {
    return NextResponse.json({ error: "Name and category are required" }, { status: 400 });
  }

  const input: MemberInput = {
    slug,
    name: body.name.trim(),
    companyZh: body.companyZh ?? "",
    companyEn: body.companyEn ?? "",
    professionZh: body.professionZh ?? "",
    professionEn: body.professionEn ?? "",
    category: body.category,
    roleZh: body.roleZh,
    roleEn: body.roleEn,
    introZh: body.introZh ?? "",
    introEn: body.introEn ?? "",
    keywords: body.keywords,
    instagram: body.instagram,
    websiteUrl: body.websiteUrl ?? "",
    lookingForZh: body.lookingForZh,
    lookingForEn: body.lookingForEn,
    gold: Boolean(body.gold),
    avatarUrl: body.avatarUrl,
    sortOrder: typeof body.sortOrder === "number" ? body.sortOrder : 999,
    published: body.published !== false,
  };

  try {
    await upsertMember(input);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to save member";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }
  if (!hasMongo()) {
    return NextResponse.json({ error: "MONGODB_URI is not configured" }, { status: 503 });
  }
  try {
    await deleteMember(slug);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to delete member";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
