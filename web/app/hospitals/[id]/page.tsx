import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { parseList } from "@/lib/format";

export default async function HospitalDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const h = await db.hospital.findUnique({ where: { id } });
  if (!h) notFound();
  const mapUrl = h.lat && h.lng
    ? `https://www.google.com/maps/search/?api=1&query=${h.lat},${h.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name + " " + h.city)}`;
  return (
    <main className="py-8">
      <Link href="/hospitals" className="text-sm text-blue-700">← Hospitals</Link>
      <h1 className="mt-2 text-2xl font-bold">{h.name}</h1>
      <p className="text-slate-600">{h.address} · {h.city}, {h.state} · {h.phone}</p>
      <div className="mt-4 rounded-lg border bg-white p-4">
        <p><strong>Specialties:</strong> {parseList(h.specialties).join(", ")}</p>
        <p><strong>Services:</strong> {parseList(h.services).join(", ") || "—"}</p>
        <p><strong>Facilities:</strong> {parseList(h.facilities).join(", ") || "—"}</p>
        <a href={mapUrl} target="_blank" className="mt-2 inline-block rounded border border-blue-700 px-3 py-1 text-blue-700">Directions</a>
      </div>
      <Link href={`/request/new?hospitalId=${h.id}`} className="mt-4 inline-block rounded bg-blue-700 px-4 py-2 text-white">Request Assistance</Link>
    </main>
  );
}
