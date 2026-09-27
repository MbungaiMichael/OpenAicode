import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export default async function ProfilePage() {
  const s = await getSession();
  if (!s) redirect("/login");
  const user = await db.user.findUnique({ where: { id: s.id } });
  if (!user) redirect("/login");
  return (
    <main className="mx-auto max-w-md py-10">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="mt-4 rounded-lg border bg-white p-5 text-sm">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Country:</strong> {user.country || "—"}</p>
        <p><strong>Language:</strong> {user.language}</p>
      </div>
      <a href="/settings" className="mt-4 inline-block rounded bg-blue-700 px-4 py-2 text-white">Edit in Settings</a>
    </main>
  );
}
