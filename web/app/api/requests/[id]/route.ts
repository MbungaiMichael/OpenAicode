import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { notify } from "@/lib/notify";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(s.role === "coordinator" || s.role === "admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await ctx.params;
  const body = await req.json();
  const status = body.status as string;
  if (!["new", "assigned", "done"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const updated = await db.assistanceRequest.update({
    where: { id },
    data: {
      status: status as "new" | "assigned" | "done",
      assigneeId: status === "new" ? null : (body.assigneeId ?? s.id),
    },
  });
  await notify(updated.patientId, `request_${status}`, `Your ${updated.type} request is now ${status}.`);
  return NextResponse.json(updated);
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const item = await db.assistanceRequest.findUnique({
    where: { id },
    include: {
      hospital: true,
      estimates: { include: { treatment: true, hospital: true } },
      rating: true,
    },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (s.role === "patient" || s.role === "caregiver") {
    if (item.patientId !== s.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json(item);
}
