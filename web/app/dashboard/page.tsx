import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import StatusBadge from "@/components/StatusBadge";
import TriageButtons from "@/components/TriageButtons";

export default async function DashboardPage() {
  const s = await getSession();
  if (!s) redirect("/login");
  if (!(s.role === "coordinator" || s.role === "admin")) redirect("/requests");
  const items = await db.assistanceRequest.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { hospital: true } });
  return (
    <main className="py-8">
      <h1 className="text-2xl font-bold">Coordinator Dashboard</h1>
      <p className="text-sm text-slate-600">Triage queue — assign, complete, add estimates from request detail.</p>
      <div className="mt-4 space-y-3">
        {items.map((r) => (
          <div key={r.id} className="rounded-lg border bg-white p-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{r.type}</span> <StatusBadge status={r.status} />
              <span className="ml-auto"><TriageButtons id={r.id} status={r.status} /></span>
            </div>
            <p className="mt-1">{r.message}</p>
            <p className="text-xs text-slate-500">{r.hospital?.name ?? "No hospital"} · {r.specialty} · {r.languageNeeded}</p>
            <Link href={`/requests/${r.id}`} className="text-blue-700">Open →</Link>
          </div>
        ))}
      </div>
    </main>
  );
}
