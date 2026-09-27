import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export default async function NotificationsPage() {
  const s = await getSession();
  if (!s) redirect("/login");
  const items = await db.notificationLog.findMany({ where: { userId: s.id }, orderBy: { createdAt: "desc" }, take: 50 });
  return (
    <main className="py-8">
      <h1 className="text-2xl font-bold">Alerts</h1>
      <p className="text-sm text-slate-600">In-app inbox (email provider plugs in here for production).</p>
      <div className="mt-4 space-y-2">
        {items.map((n) => (
          <div key={n.id} className="rounded border bg-white p-3 text-sm">
            <strong>{n.kind}</strong> · <span className="text-slate-500">{new Date(n.createdAt).toLocaleString()}</span>
            <p>{n.message}</p>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="mt-3 text-sm text-slate-600">No alerts yet.</p>}
    </main>
  );
}
