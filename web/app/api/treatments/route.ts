import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const treatments = await db.treatment.findMany({ orderBy: { title: "asc" } });
  return NextResponse.json(treatments);
}
