"use client";
import { useEffect, useState } from "react";

export default function TeleconsultPage() {
  const [items, setItems] = useState<{ id: string; specialty: string; preferredAt: string; status: string; notes: string }[]>([]);
  const [form, setForm] = useState({ specialty: "", preferredAt: "", notes: "" });
  const [msg, setMsg] = useState("");
  async function load() {
    const r = await fetch("/api/teleconsult");
    if (r.ok) setItems(await r.json());
  }
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/set-state-in-effect
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/teleconsult", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setMsg(res.ok ? "Booked — coordinator will confirm." : "Login required.");
    if (res.ok) { setForm({ specialty: "", preferredAt: "", notes: "" }); load(); }
  }
  return (
    <main className="py-8">
      <h1 className="text-2xl font-bold">Teleconsult Booking</h1>
      <p className="text-sm text-slate-600">Video pre-consult scheduling (Phase 4). Confirmation by coordinator.</p>
      <form onSubmit={submit} className="mt-4 max-w-lg space-y-2 rounded-lg border bg-white p-4">
        <input className="w-full rounded border p-2" placeholder="Specialty" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} required />
        <input className="w-full rounded border p-2" placeholder="Preferred date/time" value={form.preferredAt} onChange={(e) => setForm({ ...form, preferredAt: e.target.value })} />
        <textarea className="w-full rounded border p-2" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        {msg && <p className="text-sm text-slate-600">{msg}</p>}
        <button className="rounded bg-blue-700 px-3 py-1 text-white" type="submit">Book</button>
      </form>
      <div className="mt-4 space-y-2">
        {items.map((t) => <div key={t.id} className="rounded border bg-white p-3 text-sm"><strong>{t.specialty}</strong> · {t.preferredAt} · {t.status}<p>{t.notes}</p></div>)}
      </div>
    </main>
  );
}
