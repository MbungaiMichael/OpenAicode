import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const hospital = await db.hospital.findUnique({ where: { id } });
  if (!hospital) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(hospital);
}
