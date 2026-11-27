import { NextResponse } from "next/server";
import { getDb, hasDatabase } from "@/lib/db";

export const runtime = "nodejs";
export async function GET() {
  if (!hasDatabase) return NextResponse.json({ status: "not_configured", database: false }, { status: 503 });
  try {
    const sql = getDb();
    const rows = await sql`select current_timestamp as database_time`;
    return NextResponse.json({ status: "ok", database: true, databaseTime: rows[0].database_time });
  } catch {
    return NextResponse.json({ status: "error", database: false }, { status: 503 });
  }
}
