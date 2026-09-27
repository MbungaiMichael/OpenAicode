import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await db.notificationLog.findMany({
    where: { userId: s.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(items);
}
