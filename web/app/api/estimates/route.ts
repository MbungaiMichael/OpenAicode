import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { estimateSchema } from "@/lib/validators";
import { notify } from "@/lib/notify";

export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(s.role === "coordinator" || s.role === "admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const parsed = estimateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const created = await db.costEstimate.create({ data: parsed.data });
  const parent = await db.assistanceRequest.findUnique({ where: { id: parsed.data.requestId } });
  if (parent) await notify(parent.patientId, "estimate_reply", `Cost estimate added to your ${parent.type} request.`);
  return NextResponse.json(created, { status: 201 });
}

export async function GET(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const requestId = searchParams.get("requestId") ?? "";
  const estimates = await db.costEstimate.findMany({
    where: requestId ? { requestId } : {},
    include: { treatment: true, hospital: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(estimates);
}
