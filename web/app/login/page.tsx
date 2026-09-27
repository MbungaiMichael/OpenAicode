"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) router.push("/hospitals");
    else setError("Invalid credentials");
  }
  return (
    <main className="mx-auto max-w-md py-10">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={submit} className="mt-4 space-y-3 rounded-lg border bg-white p-5">
        <input className="w-full rounded border p-2" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="w-full rounded border p-2" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded bg-blue-700 p-2 font-semibold text-white" type="submit">Login</button>
      </form>
    </main>
  );
}
