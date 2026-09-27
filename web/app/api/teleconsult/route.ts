import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const where = s.role === "coordinator" || s.role === "admin" ? {} : { patientId: s.id };
  const items = await db.teleconsult.findMany({ where, orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const created = await db.teleconsult.create({
    data: {
      patientId: s.id,
      hospitalId: body.hospitalId || null,
      specialty: String(body.specialty ?? ""),
      preferredAt: String(body.preferredAt ?? ""),
      notes: String(body.notes ?? "").slice(0, 2000),
    },
  });
  return NextResponse.json(created, { status: 201 });
}
