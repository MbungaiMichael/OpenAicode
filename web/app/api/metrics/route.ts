import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const s = await getSession();
  if (!s || s.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const [patients, requests, connections, appointments, ratings] = await Promise.all([
    db.user.count({ where: { role: "patient" } }),
    db.assistanceRequest.count(),
    db.assistanceRequest.count({ where: { assigneeId: { not: null } } }),
    db.assistanceRequest.count({ where: { type: "appointment", status: "done" } }),
    db.rating.aggregate({ _avg: { score: true }, _count: { score: true } }),
  ]);
  return NextResponse.json({
    patients,
    requests,
    connections,
    appointments,
    avgRating: ratings._avg.score,
    ratingCount: ratings._count.score,
  });
}
