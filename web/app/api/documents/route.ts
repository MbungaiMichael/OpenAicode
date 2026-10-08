import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { resolveUrl } from "@/lib/storage";

export async function GET(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const requestId = searchParams.get("requestId") ?? "";
  const where =
    s.role === "coordinator" || s.role === "admin"
      ? requestId ? { requestId } : {}
      : requestId ? { patientId: s.id, requestId } : { patientId: s.id };
  const docs = await db.medicalDocument.findMany({ where, orderBy: { createdAt: "desc" }, take: 100 });
  const resolved = await Promise.all(
    docs.map(async (d) => ({ ...d, fileUrl: await resolveUrl(d.fileUrl).catch(() => d.fileUrl) }))
  );
  return NextResponse.json(resolved);
}

export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.fileUrl || !body.label) return NextResponse.json({ error: "fileUrl + label required" }, { status: 400 });
  const created = await db.medicalDocument.create({
    data: { patientId: s.id, requestId: body.requestId || null, fileUrl: String(body.fileUrl).slice(0, 2000), label: String(body.label).slice(0, 200) },
  });
  return NextResponse.json(created, { status: 201 });
}
