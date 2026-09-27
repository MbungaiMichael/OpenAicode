"use client";
import { useState } from "react";

export default function TranslatePage() {
  const [q, setQ] = useState("Where is the pharmacy?");
  const [out, setOut] = useState<{ english?: string; fr?: string; sw?: string; ar?: string; warning?: string; error?: string } | null>(null);
  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch(`/api/translate?q=${encodeURIComponent(q)}`);
    setOut(await r.json());
  }
  return (
    <main className="py-8">
      <h1 className="text-2xl font-bold">Translation Helper</h1>
      <p className="text-sm text-slate-600">Phase 4 draft glossary (EN → FR/SW/AR). Human translator must confirm before medical use.</p>
      <form onSubmit={lookup} className="mt-4 flex max-w-lg gap-2">
        <input className="flex-1 rounded border p-2" value={q} onChange={(e) => setQ(e.target.value)} placeholder="English phrase" />
        <button className="rounded bg-blue-700 px-3 text-white" type="submit">Translate</button>
      </form>
      {out && (
        <div className="mt-4 max-w-lg rounded-lg border bg-white p-4 text-sm">
          {out.error ? <p className="text-red-600">{out.error}</p> : (
            <>
              <p><strong>EN:</strong> {out.english}</p>
              <p><strong>FR:</strong> {out.fr}</p>
              <p><strong>SW:</strong> {out.sw}</p>
              <p><strong>AR:</strong> {out.ar}</p>
              <p className="mt-2 text-xs text-amber-800">{out.warning}</p>
            </>
          )}
        </div>
      )}
    </main>
  );
}
