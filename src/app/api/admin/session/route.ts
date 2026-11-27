import { NextRequest, NextResponse } from "next/server";
import { createAdminToken, ADMIN_COOKIE, adminSessionMaxAge } from "@/lib/admin-session";
import { timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json().catch(() => ({}));
  const expectedEmail = process.env.ADMIN_EMAIL ?? "";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!expectedEmail || !expectedPassword || typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ message: "Admin access is not configured." }, { status: 503 });
  }
  const emailMatches = email.trim().toLowerCase() === expectedEmail.toLowerCase();
  const provided = Buffer.from(password);
  const expected = Buffer.from(expectedPassword);
  const passwordMatches = provided.length === expected.length && timingSafeEqual(provided, expected);
  if (!emailMatches || !passwordMatches) {
    return NextResponse.json({ message: "Email or password is incorrect." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createAdminToken(expectedEmail), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
    path: "/", maxAge: adminSessionMaxAge,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
  return response;
}
