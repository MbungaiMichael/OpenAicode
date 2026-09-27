export default function StatusBadge({ status }: { status: string }) {
  const color =
    status === "done"
      ? "bg-green-100 text-green-800"
      : status === "assigned"
        ? "bg-amber-100 text-amber-900"
        : "bg-blue-100 text-blue-800";
  return (
    <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${color}`}>
      {status}
    </span>
  );
}
