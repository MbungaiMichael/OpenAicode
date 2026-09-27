"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EstimateForm({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [treatments, setTreatments] = useState<{ id: string; title: string }[]>([]);
  const [hospitals, setHospitals] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({ treatmentId: "", hospitalId: "", minCost: "", maxCost: "", currency: "USD", notes: "" });
  const [msg, setMsg] = useState("");
  useEffect(() => {
    fetch("/api/treatments").then((r) => r.json()).then(setTreatments).catch(() => {});
    fetch("/api/hospitals").then((r) => r.json()).then(setHospitals).catch(() => {});
  }, []);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/estimates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, treatmentId: form.treatmentId, hospitalId: form.hospitalId, minCost: Number(form.minCost), maxCost: Number(form.maxCost), currency: form.currency, notes: form.notes }),
    });
    setMsg(res.ok ? "Estimate saved." : "Failed — check min ≤ max and all fields.");
    if (res.ok) router.refresh();
  }
  return (
    <form onSubmit={submit} className="mt-3 space-y-2 rounded-lg border bg-white p-4 text-sm">
      <strong>Add cost estimate (staff only)</strong>
      <select className="w-full rounded border p-2" value={form.treatmentId} onChange={(e) => setForm({ ...form, treatmentId: e.target.value })} required>
        <option value="">Select treatment</option>
        {treatments.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
      </select>
      <select className="w-full rounded border p-2" value={form.hospitalId} onChange={(e) => setForm({ ...form, hospitalId: e.target.value })} required>
        <option value="">Select hospital</option>
        {hospitals.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
      </select>
      <div className="flex gap-2">
        <input className="w-1/3 rounded border p-2" placeholder="Min" type="number" value={form.minCost} onChange={(e) => setForm({ ...form, minCost: e.target.value })} required />
        <input className="w-1/3 rounded border p-2" placeholder="Max" type="number" value={form.maxCost} onChange={(e) => setForm({ ...form, maxCost: e.target.value })} required />
        <select className="w-1/3 rounded border p-2" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
          <option>USD</option><option>INR</option><option>EUR</option>
        </select>
      </div>
      <input className="w-full rounded border p-2" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      {msg && <p className="text-slate-600">{msg}</p>}
      <button className="rounded bg-blue-700 px-3 py-1 text-white" type="submit">Save estimate</button>
    </form>
  );
}
