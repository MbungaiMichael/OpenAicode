import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { name, email, password, country, language, role } = parsed.data;
  const exists = await db.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  const user = await db.user.create({
    data: { name, email, passwordHash: await hashPassword(password), country, language, role },
  });
  await createSession({ id: user.id, email: user.email, role: user.role });
  return NextResponse.json({ id: user.id, email: user.email, role: user.role });
}
