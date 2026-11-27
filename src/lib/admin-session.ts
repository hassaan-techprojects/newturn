import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "newturn_admin_session";
const SESSION_SECONDS = 60 * 60 * 8;

function signature(payload: string) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("ADMIN_PASSWORD is not configured");
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createAdminToken(email: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = Buffer.from(JSON.stringify({ email, expiresAt })).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function verifyAdminToken(token?: string) {
  if (!token || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) return false;
  const [payload, supplied] = token.split(".");
  if (!payload || !supplied) return false;
  const expected = signature(payload);
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email?: string; expiresAt?: number };
    return decoded.email?.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()
      && typeof decoded.expiresAt === "number"
      && decoded.expiresAt > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export const adminSessionMaxAge = SESSION_SECONDS;
