import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = (searchParams.get("search") ?? "").toLowerCase();
  const specialty = (searchParams.get("specialty") ?? "").toLowerCase();
  const city = (searchParams.get("city") ?? "").toLowerCase();
  const hospitals = await db.hospital.findMany({ orderBy: { name: "asc" }, take: 100 });
  const filtered = hospitals.filter((h) => {
    if (search && !(h.name.toLowerCase().includes(search) || h.address.toLowerCase().includes(search))) return false;
    if (city && !h.city.toLowerCase().includes(city)) return false;
    if (specialty) {
      try {
        const list = (JSON.parse(h.specialties) as string[]).map((x) => x.toLowerCase());
        if (!list.some((x) => x.includes(specialty))) return false;
      } catch {
        if (!h.specialties.toLowerCase().includes(specialty)) return false;
      }
    }
    return true;
  });
  return NextResponse.json(filtered);
}
