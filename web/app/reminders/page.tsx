"use client";
import { useEffect, useState } from "react";

export default function RemindersPage() {
  const [items, setItems] = useState<{ id: string; title: string; dueAt: string; done: boolean }[]>([]);
  const [form, setForm] = useState({ title: "", dueAt: "" });
  async function load() {
    const r = await fetch("/api/reminders");
    if (r.ok) setItems(await r.json());
  }
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/set-state-in-effect
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/reminders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setForm({ title: "", dueAt: "" }); load(); }
  }
  async function toggle(id: string, done: boolean) {
    await fetch("/api/reminders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, done: !done }) });
    load();
  }
  return (
    <main className="py-8">
      <h1 className="text-2xl font-bold">Follow-up Reminders</h1>
      <form onSubmit={submit} className="mt-4 flex max-w-lg gap-2">
        <input className="flex-1 rounded border p-2" placeholder="e.g. Take reports to follow-up" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input className="rounded border p-2" placeholder="Due date" value={form.dueAt} onChange={(e) => setForm({ ...form, dueAt: e.target.value })} />
        <button className="rounded bg-blue-700 px-3 text-white" type="submit">Add</button>
      </form>
      <div className="mt-4 space-y-2">
        {items.map((r) => (
          <div key={r.id} className="flex items-center gap-2 rounded border bg-white p-3 text-sm">
            <input type="checkbox" checked={r.done} onChange={() => toggle(r.id, r.done)} />
            <span className={r.done ? "line-through" : ""}>{r.title} · {r.dueAt}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
