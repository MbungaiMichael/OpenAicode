import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import StatusBadge from "@/components/StatusBadge";

export default async function RequestsPage() {
  const s = await getSession();
  if (!s) redirect("/login");
  const where = s.role === "coordinator" || s.role === "admin" ? {} : { patientId: s.id };
  const items = await db.assistanceRequest.findMany({ where, orderBy: { createdAt: "desc" }, take: 100, include: { hospital: true } });
  return (
    <main className="py-8">
      <h1 className="text-2xl font-bold">Requests</h1>
      <div className="mt-4 space-y-3">
        {items.map((r) => (
          <div key={r.id} className="rounded-lg border bg-white p-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{r.type}</span>
              <StatusBadge status={r.status} />
              <span className="ml-auto text-xs text-slate-500">{new Date(r.createdAt).toLocaleString()}</span>
            </div>
            <p className="mt-1 text-sm">{r.message}</p>
            <p className="text-xs text-slate-500">{r.hospital?.name ?? "No hospital"} · {r.specialty || "No specialty"} · {r.languageNeeded || "Any language"}</p>
            <Link href={`/requests/${r.id}`} className="text-sm text-blue-700">Open →</Link>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="mt-4 text-slate-600">No requests yet. <Link href="/request/new" className="text-blue-700">Create one</Link>.</p>}
    </main>
  );
}
