import { auth } from "@/lib/auth/server";

export default auth.middleware({
  loginUrl: "/",
  publicRoutes: ["/", "/sell", "/admin", "/api/admin/session", "/api/auth/*", "/api/location/*", "/api/health"],
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
