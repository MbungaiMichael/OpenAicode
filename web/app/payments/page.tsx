export default function PaymentsPage() {
  return (
    <main className="py-8">
      <h1 className="text-2xl font-bold">Payments Guidance</h1>
      <p className="text-sm text-slate-600">Phase 4 — guidance only. No in-app charges in V1.</p>
      <div className="mt-4 space-y-3 text-sm">
        <div className="rounded-lg border bg-white p-4"><strong>Before travel</strong><p>Confirm estimate in writing from hospital. Carry cards + USD/Inr cash buffer. Keep receipts for insurance.</p></div>
        <div className="rounded-lg border bg-white p-4"><strong>In India</strong><p>Hospitals accept UPI, cards, wire transfer. Forex desks at airports/malls. Always collect itemized bills.</p></div>
        <div className="rounded-lg border bg-white p-4"><strong>Safety</strong><p>Never pay personal accounts — only hospital billing counters. Report fraud to your coordinator.</p></div>
      </div>
    </main>
  );
}
