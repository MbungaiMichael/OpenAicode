import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import DocumentForm from "@/components/DocumentForm";

export default async function DocumentsPage() {
  const s = await getSession();
  if (!s) redirect("/login");
  const docs = await db.medicalDocument.findMany({ where: { patientId: s.id }, orderBy: { createdAt: "desc" }, take: 100 });
  return (
    <main className="py-8">
      <h1 className="text-2xl font-bold">My Documents</h1>
      <div className="mt-3 space-y-2 text-sm">
        {docs.map((d) => <p key={d.id} className="rounded border bg-white p-3"><strong>{d.label}:</strong> <a className="text-blue-700" href={d.fileUrl} target="_blank">{d.fileUrl}</a></p>)}
      </div>
      {docs.length === 0 && <p className="text-sm text-slate-600">No documents yet.</p>}
      <DocumentForm />
    </main>
  );
}
