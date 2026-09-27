import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { requestSchema } from "@/lib/validators";

export async function GET(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const mine = searchParams.get("mine");
  const where =
    s.role === "coordinator" || s.role === "admin"
      ? mine === "1"
        ? { OR: [{ patientId: s.id }, { assigneeId: s.id }] }
        : {}
      : { patientId: s.id };
  const requests = await db.assistanceRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { hospital: true, assignee: { select: { name: true, email: true } } },
  });
  return NextResponse.json(requests);
}

export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const created = await db.assistanceRequest.create({
    data: { patientId: s.id, ...parsed.data, hospitalId: parsed.data.hospitalId || null },
  });
  return NextResponse.json(created, { status: 201 });
}
