import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { storeFile } from "@/lib/storage";

export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  const label = String(form.get("label") ?? "").slice(0, 200);
  const requestId = form.get("requestId") ? String(form.get("requestId")) : null;

  if (!(file instanceof File)) return NextResponse.json({ error: "No file attached" }, { status: 400 });
  if (!label) return NextResponse.json({ error: "Label required" }, { status: 400 });

  if (requestId) {
    const parent = await db.assistanceRequest.findUnique({ where: { id: requestId } });
    if (!parent) return NextResponse.json({ error: "Request not found" }, { status: 404 });
    if (s.role === "patient" || s.role === "caregiver") {
      if (parent.patientId !== s.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const ref = await storeFile(s.id, file.name, file.type, bytes);
    const created = await db.medicalDocument.create({
      data: { patientId: s.id, requestId, fileUrl: ref, label },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed" },
      { status: 400 }
    );
  }
}
