import { requireAdmin } from "@/lib/auth";
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
  const members = await listAllMembers();
  return NextResponse.json({ members });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<MemberInput>;
  if (!body.slug || !body.name || !body.category || !isCategoryId(body.category)) {
    return NextResponse.json({ error: "Invalid member payload" }, { status: 400 });
  }

  const input: MemberInput = {
    slug: body.slug,
    name: body.name,
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

  await upsertMember(input);
  return NextResponse.json({ ok: true });
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
  await deleteMember(slug);
  return NextResponse.json({ ok: true });
}
