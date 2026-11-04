import { requireAdmin } from "@/lib/auth";
import { hasMongo } from "@/lib/db";
import { seedDatabase } from "@/lib/members";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasMongo()) {
    return NextResponse.json({ error: "MONGODB_URI is not configured" }, { status: 503 });
  }
  const result = await seedDatabase();
  return NextResponse.json(result);
}
