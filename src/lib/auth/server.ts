import { createNeonAuth } from "@neon/auth/next/server";

const baseUrl = process.env.NEON_AUTH_BASE_URL;
const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET;

// Keep the app buildable before a developer has pulled local Neon environment
// variables. Auth endpoints return a clear 503 until both settings are present.
export const auth = baseUrl && cookieSecret && cookieSecret.length >= 32
  ? createNeonAuth({ baseUrl, cookies: { secret: cookieSecret } })
  : null;
