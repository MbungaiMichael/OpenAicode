import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function MetricsPage() {
  const s = await getSession();
  if (!s || s.role !== "admin") redirect("/");
  const [patients, requests, connections, appointments, ratings] = await Promise.all([
    db.user.count({ where: { role: "patient" } }),
    db.assistanceRequest.count(),
    db.assistanceRequest.count({ where: { assigneeId: { not: null } } }),
    db.assistanceRequest.count({ where: { type: "appointment", status: "done" } }),
    db.rating.aggregate({ _avg: { score: true }, _count: { score: true } }),
  ]);
  const cards = [
    ["Registered patients", patients],
    ["Assistance requests", requests],
    ["Connections (assigned)", connections],
    ["Appointments done", appointments],
    ["Avg rating", ratings._avg.score?.toFixed(1) ?? "—"],
  ];
  return (
    <main className="py-8">
      <h1 className="text-2xl font-bold">Admin Metrics</h1>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {cards.map(([k, v]) => (
          <div key={k} className="rounded-lg border bg-white p-4">
            <p className="text-xs text-slate-500">{k}</p>
            <p className="text-2xl font-bold">{String(v)}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
