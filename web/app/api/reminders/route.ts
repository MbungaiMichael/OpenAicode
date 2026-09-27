import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await db.reminder.findMany({ where: { patientId: s.id }, orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.title) return NextResponse.json({ error: "title required" }, { status: 400 });
  const created = await db.reminder.create({
    data: { patientId: s.id, title: String(body.title).slice(0, 200), dueAt: String(body.dueAt ?? "") },
  });
  return NextResponse.json(created, { status: 201 });
}

export async function PATCH(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const updated = await db.reminder.updateMany({ where: { id: body.id, patientId: s.id }, data: { done: !!body.done } });
  return NextResponse.json(updated);
}
