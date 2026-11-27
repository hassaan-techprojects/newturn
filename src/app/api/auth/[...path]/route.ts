import { auth } from "@/lib/auth/server";

const unavailable = () => Response.json(
  { error: "Authentication is not configured. Pull the Neon Auth environment variables and restart the app." },
  { status: 503 },
);

const handlers = auth?.handler();

export const GET = handlers?.GET ?? unavailable;
export const POST = handlers?.POST ?? unavailable;
export const PUT = handlers?.PUT ?? unavailable;
export const DELETE = handlers?.DELETE ?? unavailable;
export const PATCH = handlers?.PATCH ?? unavailable;
