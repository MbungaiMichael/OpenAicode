import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ratingSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = ratingSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
  const created = await db.rating.upsert({
    where: { requestId: parsed.data.requestId },
    create: { requestId: parsed.data.requestId, patientId: s.id, score: parsed.data.score },
    update: { score: parsed.data.score },
  });
  return NextResponse.json(created, { status: 201 });
}
