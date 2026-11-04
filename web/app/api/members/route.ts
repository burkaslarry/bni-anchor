import { listPublishedMembers } from "@/lib/members";
import { NextResponse } from "next/server";

export async function GET() {
  const members = await listPublishedMembers();
  return NextResponse.json(
    { members },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
