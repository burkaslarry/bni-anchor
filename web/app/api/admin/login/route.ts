import { createAdminSession, setAdminSessionCookie, verifyAdminPassword } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };
  const password = body.password ?? "";
  if (!(await verifyAdminPassword(password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  try {
    const token = await createAdminSession();
    await setAdminSessionCookie(token);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Server auth is not configured (ADMIN_SESSION_SECRET)" },
      { status: 500 },
    );
  }
}
