"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function NewRequestPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [hospitals, setHospitals] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({ type: "translator", languageNeeded: "", hospitalId: sp.get("hospitalId") ?? "", specialty: "", message: "" });
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/hospitals").then((r) => r.json()).then(setHospitals).catch(() => {});
  }, []);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, hospitalId: form.hospitalId || null }) });
    if (res.ok) router.push("/requests");
    else setError("Submit failed — login required? Message min 5 chars.");
  }
  return (
    <main className="mx-auto max-w-lg py-8">
      <h1 className="text-2xl font-bold">New Assistance Request</h1>
      <form onSubmit={submit} className="mt-4 space-y-3 rounded-lg border bg-white p-5">
        <select className="w-full rounded border p-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="translator">Translator</option><option value="coordinator">Coordinator</option><option value="appointment">Appointment</option><option value="cost_estimate">Cost estimate</option><option value="support">Support</option>
        </select>
        <input className="w-full rounded border p-2" placeholder="Language needed (e.g. French)" value={form.languageNeeded} onChange={(e) => setForm({ ...form, languageNeeded: e.target.value })} />
        <select className="w-full rounded border p-2" value={form.hospitalId} onChange={(e) => setForm({ ...form, hospitalId: e.target.value })}>
          <option value="">No hospital selected</option>
          {hospitals.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
        <input className="w-full rounded border p-2" placeholder="Specialty (e.g. Cardiology)" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} />
        <textarea className="w-full rounded border p-2" placeholder="Describe what you need..." rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded bg-blue-700 p-2 font-semibold text-white" type="submit">Submit request</button>
      </form>
    </main>
  );
}
