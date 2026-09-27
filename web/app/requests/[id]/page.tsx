import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import StatusBadge from "@/components/StatusBadge";
import TriageButtons from "@/components/TriageButtons";
import EstimateForm from "@/components/EstimateForm";
import RatingForm from "@/components/RatingForm";
import DocumentForm from "@/components/DocumentForm";

export default async function RequestDetail({ params }: { params: Promise<{ id: string }> }) {
  const s = await getSession();
  if (!s) redirect("/login");
  const { id } = await params;
  const r = await db.assistanceRequest.findUnique({
    where: { id },
    include: { hospital: true, estimates: { include: { treatment: true, hospital: true } }, rating: true, documents: true },
  });
  if (!r) notFound();
  if ((s.role === "patient" || s.role === "caregiver") && r.patientId !== s.id) {
    return <main className="py-8">Forbidden.</main>;
  }
  const isStaff = s.role === "coordinator" || s.role === "admin";
  return (
    <main className="py-8">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold capitalize">{r.type} request</h1>
        <StatusBadge status={r.status} />
        <span className="ml-auto flex gap-2">
          {isStaff && <TriageButtons id={r.id} status={r.status} />}
          <Link href={`/requests/${r.id}/print`} className="rounded border px-2 py-1 text-sm">Print / Offline pack</Link>
        </span>
      </div>
      <div className="mt-4 rounded-lg border bg-white p-4 text-sm">
        <p>{r.message}</p>
        <p className="mt-2 text-slate-600">Hospital: {r.hospital?.name ?? "—"} · Specialty: {r.specialty || "—"} · Language: {r.languageNeeded || "—"}</p>
      </div>
      <h2 className="mt-6 font-bold">Cost estimates</h2>
      {r.estimates.map((e) => (
        <div key={e.id} className="mt-2 rounded-lg border bg-white p-4">
          <p className="text-xl font-bold">{e.minCost} – {e.maxCost} {e.currency}</p>
          <p className="text-sm">{e.treatment.title} · {e.hospital.name}</p>
          <p className="text-xs text-slate-600">{e.notes}</p>
          <p className="mt-1 text-xs text-amber-800">Estimate only — not a guarantee of cost or availability.</p>
        </div>
      ))}
      {r.estimates.length === 0 && <p className="text-sm text-slate-600">No estimates yet.</p>}
      {isStaff && <EstimateForm requestId={r.id} />}
      <h2 className="mt-6 font-bold">Documents</h2>
      {r.documents.map((d) => (
        <p key={d.id} className="mt-1 text-sm"><strong>{d.label}:</strong> <a className="text-blue-700" href={d.fileUrl} target="_blank">{d.fileUrl}</a></p>
      ))}
      {r.documents.length === 0 && <p className="text-sm text-slate-600">No documents linked.</p>}
      <DocumentForm requestId={r.id} />
      {r.status === "done" && <RatingForm requestId={r.id} current={r.rating?.score} />}
    </main>
  );
}
