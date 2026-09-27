import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 font-sans">
      <p className="text-sm font-semibold text-blue-700">Phase 0 — Foundation live</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">
        International Patient Assistance Platform
      </h1>
      <p className="mt-3 text-slate-600">
        Helping international patients access care in India — hospitals,
        translators, coordinators, cost estimates, and support.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/hospitals" className="rounded-md bg-blue-700 px-4 py-2 font-semibold text-white">
          Browse Hospitals (Phase 1)
        </Link>
        <Link href="/request/new" className="rounded-md border border-blue-700 px-4 py-2 font-semibold text-blue-700">
          Request Assistance
        </Link>
      </div>
      <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-slate-700">
        Medical disclaimer: information only — no diagnosis or guaranteed
        costs. Medical decisions remain with qualified professionals.
      </div>
      <ul className="mt-8 list-disc pl-5 text-sm text-slate-600">
        <li>Next.js App Router + TypeScript + Tailwind</li>
        <li>Prisma models: User, Hospital, AssistanceRequest, Treatment, CostEstimate</li>
        <li>Local DB: SQLite (dev.db) — production: Supabase Postgres</li>
      </ul>
    </main>
  );
}
