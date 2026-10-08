"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DocumentForm({ requestId }: { requestId?: string }) {
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setMsg("Choose a file (image or PDF, max 10 MB).");
      return;
    }
    setBusy(true);
    setMsg("");
    const data = new FormData();
    data.append("file", file);
    data.append("label", label);
    if (requestId) data.append("requestId", requestId);
    const res = await fetch("/api/documents/upload", { method: "POST", body: data });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok) {
      setMsg("Document uploaded.");
      setLabel("");
      setFile(null);
      router.refresh();
    } else {
      setMsg(body.error ?? "Upload failed.");
    }
  }

  return (
    <form onSubmit={submit} className="mt-3 space-y-2 rounded-lg border bg-white p-4 text-sm">
      <strong>Upload document</strong>
      <input
        className="w-full rounded border p-2"
        placeholder="Label (e.g. Passport, MRI report)"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        required
      />
      <input
        className="w-full rounded border p-2"
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        required
      />
      <p className="text-xs text-slate-500">Images or PDF, max 10 MB. Stored privately; only you, your coordinator, and admins can view.</p>
      {msg && <p className="text-slate-600">{msg}</p>}
      <button className="rounded bg-blue-700 px-3 py-1 text-white disabled:opacity-50" type="submit" disabled={busy}>
        {busy ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}
