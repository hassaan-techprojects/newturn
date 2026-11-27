import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";

const middleware = auth?.middleware({
  loginUrl: "/",
  publicRoutes: ["/", "/sell", "/admin", "/api/admin/session", "/api/auth/*", "/api/location/*", "/api/health"],
});

export default middleware ?? (() => NextResponse.next());

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
