"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SupportPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "support", message }) });
    if (res.ok) router.push("/requests");
    else setError("Login required to contact support.");
  }
  return (
    <main className="mx-auto max-w-lg py-8">
      <h1 className="text-2xl font-bold">Patient Support</h1>
      <p className="text-sm text-slate-600">Contact a coordinator — replies appear in My Requests.</p>
      <form onSubmit={submit} className="mt-4 rounded-lg border bg-white p-5">
        <textarea className="w-full rounded border p-2" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="mt-2 w-full rounded bg-blue-700 p-2 text-white" type="submit">Send</button>
      </form>
    </main>
  );
}
