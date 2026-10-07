export default function DisclaimerPage() {
  return (
    <main className="py-8">
      <h1 className="text-2xl font-bold">Medical Disclaimer</h1>
      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
        <strong>Information only — not medical advice.</strong>
        <ul className="mt-2 list-disc pl-5">
          <li>This platform does not diagnose conditions or prescribe treatments.</li>
          <li>Cost estimates are ranges, not guarantees of final hospital bills.</li>
          <li>Hospital availability changes; confirm directly with the hospital.</li>
          <li>Always consult a qualified healthcare professional for medical decisions.</li>
          <li>In an emergency, call local emergency services immediately.</li>
        </ul>
      </div>
    </main>
  );
}
