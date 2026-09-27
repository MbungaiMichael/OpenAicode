import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export default async function PrintPack({ params }: { params: Promise<{ id: string }> }) {
  const s = await getSession();
  if (!s) redirect("/login");
  const { id } = await params;
  const r = await db.assistanceRequest.findUnique({
    where: { id },
    include: { hospital: true, estimates: { include: { treatment: true, hospital: true } } },
  });
  if (!r) notFound();
  return (
    <main className="py-8">
      <button onClick={() => window.print()} className="rounded bg-blue-700 px-3 py-1 text-sm text-white print:hidden">Print / Save PDF</button>
      <h1 className="mt-3 text-2xl font-bold">Offline Pack — {r.type}</h1>
      <p className="text-sm">Status: {r.status} · Hospital: {r.hospital?.name ?? "—"} {r.hospital?.phone ? `(${r.hospital.phone})` : ""}</p>
      <p className="text-sm">Address: {r.hospital?.address ?? "—"}, {r.hospital?.city ?? ""}</p>
      <p className="mt-2 text-sm">{r.message}</p>
      <h2 className="mt-4 font-bold">Estimates</h2>
      {r.estimates.map((e) => <p key={e.id} className="text-sm">{e.treatment.title}: {e.minCost}–{e.maxCost} {e.currency} (estimate only)</p>)}
      <p className="mt-4 text-xs">Medical disclaimer: information only. Carry passport, visa, reports, and emergency contacts.</p>
    </main>
  );
}
