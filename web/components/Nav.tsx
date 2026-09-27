import Link from "next/link";
import { getSession } from "@/lib/auth";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default async function Nav() {
  const session = await getSession();
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3 text-sm">
        <Link href="/" className="font-bold text-blue-700">PatientAssist</Link>
        <Link href="/hospitals">Hospitals</Link>
        <Link href="/hospitals/compare">Compare</Link>
        <Link href="/treatments">Treatments</Link>
        <Link href="/request/new">Request</Link>
        <Link href="/requests">My Requests</Link>
        <Link href="/documents">Documents</Link>
        <Link href="/teleconsult">Teleconsult</Link>
        <Link href="/translate">Translate</Link>
        <Link href="/reminders">Reminders</Link>
        <Link href="/payments">Payments</Link>
        <Link href="/support">Support</Link>
        {session && (session.role === "coordinator" || session.role === "admin") && (
          <Link href="/dashboard">Dashboard</Link>
        )}
        {session?.role === "admin" && <Link href="/admin/metrics">Metrics</Link>}
        <span className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
          {session ? (
            <>
              <Link href="/notifications">Alerts</Link>
              <Link href="/profile">{session.email}</Link>
              <Link href="/settings">Settings</Link>
              <form action="/api/auth/logout" method="post">
                <button className="rounded border px-2 py-1" type="submit">Logout</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register" className="rounded bg-blue-700 px-2 py-1 text-white">Register</Link>
            </>
          )}
        </span>
      </nav>
    </header>
  );
}
