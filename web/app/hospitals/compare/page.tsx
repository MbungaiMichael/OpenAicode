import { db } from "@/lib/db";
import { parseList } from "@/lib/format";

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const sp = await searchParams;
  const hospitals = await db.hospital.findMany({ orderBy: { name: "asc" }, take: 100 });
  const selected = sp.ids ? hospitals.filter((h) => sp.ids!.split(",").includes(h.id)).slice(0, 3) : hospitals.slice(0, 2);
  return (
    <main className="py-8">
      <h1 className="text-2xl font-bold">Compare Hospitals</h1>
      <form className="mt-3 rounded-lg border bg-white p-4 text-sm" method="get">
        <p>Pick up to 3 (paste IDs comma-separated) or use defaults below.</p>
        <input name="ids" defaultValue={sp.ids ?? ""} className="mt-2 w-full rounded border p-2" placeholder="id1,id2,id3" />
        <button className="mt-2 rounded bg-blue-700 px-3 py-1 text-white" type="submit">Compare</button>
      </form>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {selected.map((h) => (
          <div key={h.id} className="rounded-lg border bg-white p-4 text-sm">
            <strong>{h.name}</strong>
            <p>{h.city} · {h.phone}</p>
            <p>Specialties: {parseList(h.specialties).join(", ")}</p>
            <p>Facilities: {parseList(h.facilities).join(", ")}</p>
            <p className="break-all text-xs text-slate-500">{h.id}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-6 font-bold">All hospitals (copy IDs)</h2>
      {hospitals.map((h) => <p key={h.id} className="text-xs text-slate-600">{h.name} — {h.id}</p>)}
    </main>
  );
}
