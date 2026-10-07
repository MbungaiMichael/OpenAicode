import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="py-16 text-center">
      <h1 className="text-2xl font-bold">You&apos;re offline</h1>
      <p className="mt-2 text-sm text-slate-600">
        PatientAssist needs a connection for hospital search and requests.
        Your printed offline pack (<code>/requests/[id]/print</code>) works without one —
        save it as PDF before you travel.
      </p>
      <Link href="/" className="mt-4 inline-block rounded bg-blue-700 px-4 py-2 text-white">
        Retry
      </Link>
    </main>
  );
}
