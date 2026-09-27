import { NextResponse } from "next/server";
import { translatePhrase, phraseList } from "@/lib/phrases";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  if (!q) return NextResponse.json({ phrases: phraseList() });
  const hit = translatePhrase(q);
  if (!hit) return NextResponse.json({ error: "No glossary match — ask a human translator to review.", phrases: phraseList() }, { status: 404 });
  return NextResponse.json({ ...hit, reviewed: false, warning: "Draft helper only — human translator must confirm before medical use." });
}
