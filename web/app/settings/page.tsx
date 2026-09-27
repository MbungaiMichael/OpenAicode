"use client";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [form, setForm] = useState({ name: "", phone: "", country: "", language: "en" });
  const [msg, setMsg] = useState("");
  useEffect(() => {
    fetch("/api/profile").then(async (r) => {
      if (r.ok) {
        const u = await r.json();
        setForm({ name: u.name ?? "", phone: u.phone ?? "", country: u.country ?? "", language: u.language ?? "en" });
      }
    }).catch(() => {});
  }, []);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setMsg(res.ok ? "Saved." : "Save failed — login required.");
  }
  return (
    <main className="mx-auto max-w-md py-8">
      <h1 className="text-2xl font-bold">Settings</h1>
      <form onSubmit={save} className="mt-4 space-y-3 rounded-lg border bg-white p-5">
        <input className="w-full rounded border p-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
        <input className="w-full rounded border p-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
        <input className="w-full rounded border p-2" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Country" />
        <select className="w-full rounded border p-2" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
          <option value="en">English</option><option value="fr">French</option><option value="sw">Swahili</option><option value="ar">Arabic</option>
        </select>
        {msg && <p className="text-sm text-slate-600">{msg}</p>}
        <button className="w-full rounded bg-blue-700 p-2 text-white" type="submit">Save</button>
      </form>
    </main>
  );
}
