"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DocumentForm({ requestId }: { requestId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ label: "", fileUrl: "" });
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/documents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, requestId }) });
    setMsg(res.ok ? "Document saved." : "Save failed.");
    if (res.ok) { setForm({ label: "", fileUrl: "" }); router.refresh(); }
  }
  return (
    <form onSubmit={submit} className="mt-3 space-y-2 rounded-lg border bg-white p-4 text-sm">
      <strong>Add document link</strong>
      <input className="w-full rounded border p-2" placeholder="Label (e.g. Passport, MRI report)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
      <input className="w-full rounded border p-2" placeholder="File URL (upload to storage, paste link)" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} required />
      {msg && <p className="text-slate-600">{msg}</p>}
      <button className="rounded bg-blue-700 px-3 py-1 text-white" type="submit">Save</button>
    </form>
  );
}
