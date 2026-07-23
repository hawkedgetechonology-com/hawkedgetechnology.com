import { NextRequest, NextResponse } from "next/server";

// ── Public routes that DON'T require authentication ────────────────────────
const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/services",
  "/portfolio",
  "/careers",
  "/contact",
  "/privacy-policy",
  "/terms-and-conditions",
  "/login",
  "/robots.txt",
  "/sitemap.xml",
  "/forgot-password",
];

// Prefixes for always-public assets
const PUBLIC_PREFIXES = ["/_next", "/favicon", "/og-image", "/api/public"];

function isPublic(pathname: string): boolean {
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  return PUBLIC_ROUTES.some(
    (r) => pathname === r || pathname === r + "/"
  );
}

// ── Decode JWT payload (no verification — just read claims) ────────────────
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const padded = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  // ── 1. Always allow public routes ────────────────────────────────────────
  if (isPublic(pathname)) {
    // If authenticated user visits /login → redirect to their dashboard
    if (pathname === "/login" && token) {
      const payload = decodeJwtPayload(token);
      const role = (payload?.role as string) ?? "CLIENT";
      const dest =
        role === "ADMIN"
          ? "/admin/dashboard"
          : role === "STAFF"
          ? "/dashboard"
          : "/workspace";
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return NextResponse.next();
  }

  // ── 2. Protect everything else ───────────────────────────────────────────
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 3. Role-based route guards ────────────────────────────────────────────
  const payload = decodeJwtPayload(token);
  const role = (payload?.role as string) ?? "CLIENT";

  // /admin/* → ADMIN only
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    const dest = role === "STAFF" ? "/dashboard" : "/workspace";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // /dashboard → ADMIN or STAFF only
  if (pathname.startsWith("/dashboard") && role === "CLIENT") {
    return NextResponse.redirect(new URL("/workspace", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)",
  ],
};
