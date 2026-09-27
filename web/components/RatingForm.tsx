"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RatingForm({ requestId, current }: { requestId: string; current?: number }) {
  const router = useRouter();
  const [score, setScore] = useState(current ?? 5);
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/ratings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ requestId, score }) });
    setMsg(res.ok ? "Thanks for rating." : "Rating failed.");
    if (res.ok) router.refresh();
  }
  return (
    <form onSubmit={submit} className="mt-3 flex items-center gap-2 rounded-lg border bg-white p-4 text-sm">
      <label>Rate (1-5):</label>
      <select className="rounded border p-1" value={score} onChange={(e) => setScore(Number(e.target.value))}>
        {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
      <button className="rounded bg-blue-700 px-3 py-1 text-white" type="submit">Submit</button>
      {msg && <span className="text-slate-600">{msg}</span>}
    </form>
  );
}
