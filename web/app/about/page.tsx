export default function AboutPage() {
  return (
    <main className="py-8">
      <h1 className="text-2xl font-bold">About PatientAssist</h1>
      <p className="mt-3 text-sm text-slate-600">
        PatientAssist is a coordination platform that helps international patients —
        especially from African countries — access medical care in India.
      </p>
      <div className="mt-4 space-y-3 text-sm">
        <div className="rounded-lg border bg-white p-4">
          <strong>What we do</strong>
          <p>Hospital directory, translator and coordinator matching, appointment help,
          plain-language treatment info, ranged cost estimates, and on-ground support.</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <strong>What we don&apos;t do</strong>
          <p>No diagnosis, no prescriptions, no guaranteed costs or availability.
          Medical decisions remain with qualified healthcare professionals.</p>
        </div>
      </div>
    </main>
  );
}
