export default function PrivacyPage() {
  return (
    <main className="py-8">
      <h1 className="text-2xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-xs text-slate-500">Last updated: October 2026 · MVP version</p>
      <div className="mt-4 space-y-3 text-sm">
        <div className="rounded-lg border bg-white p-4">
          <strong>Data we collect</strong>
          <p>Account details (name, email, country, language), assistance requests,
          estimates, documents you link, and ratings.</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <strong>Who sees it</strong>
          <p>Patients see their own data. Coordinators and admins see assigned queues.
          Documents are restricted to patient, assignee, and admin. We never sell data.</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <strong>Your rights</strong>
          <p>Update your profile in Settings. Contact support to export or delete
          your account data.</p>
        </div>
      </div>
    </main>
  );
}
