"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TriageButtons({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function set(statusNext: string) {
    setBusy(true);
    await fetch(`/api/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: statusNext }),
    });
    setBusy(false);
    router.refresh();
  }
  return (
    <span className="flex gap-2">
      {status === "new" && <button disabled={busy} onClick={() => set("assigned")} className="rounded border px-2 py-1">Assign to me</button>}
      {status === "assigned" && <button disabled={busy} onClick={() => set("done")} className="rounded bg-green-600 px-2 py-1 text-white">Mark done</button>}
      {status === "done" && <button disabled={busy} onClick={() => set("new")} className="rounded border px-2 py-1">Reopen</button>}
    </span>
  );
}
