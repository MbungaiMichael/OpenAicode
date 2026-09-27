"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", country: "", language: "en", role: "patient" });
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) router.push("/hospitals");
    else setError((await res.json()).error?.message ?? "Registration failed");
  }
  return (
    <main className="mx-auto max-w-md py-10">
      <h1 className="text-2xl font-bold">Register</h1>
      <form onSubmit={submit} className="mt-4 space-y-3 rounded-lg border bg-white p-5">
        <input className="w-full rounded border p-2" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="w-full rounded border p-2" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="w-full rounded border p-2" placeholder="Password (min 6)" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <input className="w-full rounded border p-2" placeholder="Country (e.g. Kenya)" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
        <div className="flex gap-2">
          <select className="w-1/2 rounded border p-2" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
            <option value="en">English</option><option value="fr">French</option><option value="sw">Swahili</option><option value="ar">Arabic</option>
          </select>
          <select className="w-1/2 rounded border p-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="patient">Patient</option><option value="caregiver">Caregiver</option><option value="translator">Translator</option><option value="coordinator">Coordinator</option>
          </select>
        </div>
        {error && <p className="text-sm text-red-600">{String(error)}</p>}
        <button className="w-full rounded bg-blue-700 p-2 font-semibold text-white" type="submit">Create account</button>
      </form>
    </main>
  );
}
