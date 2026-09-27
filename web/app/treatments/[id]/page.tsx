import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { parseList } from "@/lib/format";

export default async function TreatmentDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await db.treatment.findUnique({ where: { id } });
  if (!t) notFound();
  return (
    <main className="py-8">
      <Link href="/treatments" className="text-sm text-blue-700">← Treatments</Link>
      <h1 className="mt-2 text-2xl font-bold">{t.title}</h1>
      <p className="mt-2">{t.descriptionSimple}</p>
      <div className="mt-4 rounded-lg border bg-white p-4">
        <strong>Steps</strong>
        <ol className="list-decimal pl-5 text-sm">{parseList(t.procedureSteps).map((s) => <li key={s}>{s}</li>)}</ol>
        <p className="mt-2 text-sm"><strong>Avg stay:</strong> {t.avgStay}</p>
        <p className="text-sm"><strong>Risks:</strong> {parseList(t.risks).join(", ")}</p>
      </div>
      <div className="mt-3 rounded border border-amber-200 bg-amber-50 p-3 text-sm">Information only — consult a qualified doctor. Costs vary by hospital.</div>
      <Link href="/request/new" className="mt-4 inline-block rounded bg-blue-700 px-4 py-2 text-white">Get Cost Estimate</Link>
    </main>
  );
}
