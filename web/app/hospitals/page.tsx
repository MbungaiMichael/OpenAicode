import Link from "next/link";
import { db } from "@/lib/db";
import { parseList } from "@/lib/format";

export default async function HospitalsPage({ searchParams }: { searchParams: Promise<{ search?: string; specialty?: string; city?: string }> }) {
  const sp = await searchParams;
  const hospitals = await db.hospital.findMany({ orderBy: { name: "asc" }, take: 100 });
  const filtered = hospitals.filter((h) => {
    if (sp.search && !(h.name.toLowerCase().includes(sp.search.toLowerCase()) || h.address.toLowerCase().includes(sp.search.toLowerCase()))) return false;
    if (sp.city && !h.city.toLowerCase().includes(sp.city.toLowerCase())) return false;
    if (sp.specialty && !parseList(h.specialties).join(" ").toLowerCase().includes(sp.specialty.toLowerCase())) return false;
    return true;
  });
  return (
    <main className="py-8">
      <h1 className="text-2xl font-bold">Hospitals</h1>
      <form className="mt-4 flex flex-wrap gap-2 rounded-lg border bg-white p-4" method="get">
        <input name="search" defaultValue={sp.search ?? ""} placeholder="Search name/address" className="rounded border p-2" />
        <input name="specialty" defaultValue={sp.specialty ?? ""} placeholder="Specialty" className="rounded border p-2" />
        <input name="city" defaultValue={sp.city ?? ""} placeholder="City" className="rounded border p-2" />
        <button className="rounded bg-blue-700 px-4 py-2 text-white" type="submit">Filter</button>
      </form>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {filtered.map((h) => (
          <div key={h.id} className="rounded-lg border bg-white p-4">
            <Link href={`/hospitals/${h.id}`} className="font-semibold text-blue-700">{h.name}</Link>
            <p className="text-sm text-slate-600">{h.city}, {h.state} · {h.phone}</p>
            <p className="mt-1 text-sm">{parseList(h.specialties).join(" · ")}</p>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="mt-4 text-slate-600">No hospitals match.</p>}
    </main>
  );
}
