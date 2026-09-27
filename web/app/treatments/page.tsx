import Link from "next/link";
import { db } from "@/lib/db";

export default async function TreatmentsPage() {
  const items = await db.treatment.findMany({ orderBy: { title: "asc" } });
  return (
    <main className="py-8">
      <h1 className="text-2xl font-bold">Treatments</h1>
      <p className="text-sm text-slate-600">Plain-language information only — not medical advice.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map((t) => (
          <div key={t.id} className="rounded-lg border bg-white p-4">
            <Link href={`/treatments/${t.id}`} className="font-semibold text-blue-700">{t.title}</Link>
            <p className="text-sm text-slate-600">{t.descriptionSimple}</p>
            <p className="text-xs text-slate-500">Avg stay: {t.avgStay}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
