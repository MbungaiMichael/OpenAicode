import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await db.user.findUnique({
    where: { id: s.id },
    select: { id: true, name: true, email: true, phone: true, country: true, language: true, role: true },
  });
  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const user = await db.user.update({
    where: { id: s.id },
    data: {
      name: body.name,
      phone: body.phone,
      country: body.country,
      language: body.language,
    },
    select: { id: true, name: true, email: true, phone: true, country: true, language: true, role: true },
  });
  return NextResponse.json(user);
}
