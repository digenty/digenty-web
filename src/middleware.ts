import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function getSubdomain(host: string): string | null {
  const hostname = host.split(":")[0];
  if (hostname.endsWith(".localhost") && hostname !== "localhost") {
    return hostname.slice(0, hostname.lastIndexOf(".localhost"));
  }
  if (hostname.endsWith(".axisbydigenty.com") && hostname !== "axisbydigenty.com" && hostname !== "app.axisbydigenty.com") {
    return hostname.split(".")[0];
  }
  if (hostname.endsWith(".digenty-web.vercel.app") && hostname !== "digenty-web.vercel.app" && hostname !== "app.digenty-web.vercel.app") {
    return hostname.split(".")[0];
  }
  return null;
}

// Hosts that belong to the platform itself, never a school's connected custom domain — even
// though /public/website/resolve would technically resolve a *.axisbydigenty.com host too, that
// pattern is already owned by the parent-onboarding subdomain flow above (getSubdomain). Custom-
// domain detection below only applies to hosts outside this set.
//
// A bare IP address (127.0.0.1, a LAN address) can never be a school's domain. It is also what lets a
// second person be signed in side by side while testing: each host has its own cookie jar.
const IPV4_HOST = /^\d{1,3}(\.\d{1,3}){3}$/;

function isOwnPlatformHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    IPV4_HOST.test(hostname) ||
    hostname.endsWith(".localhost") ||
    hostname === "axisbydigenty.com" ||
    hostname.endsWith(".axisbydigenty.com") ||
    hostname === "digenty-web.vercel.app" ||
    hostname.endsWith(".digenty-web.vercel.app")
  );
}

// Unauthenticated host -> slug lookup for a school's connected custom domain. Plain fetch (not
// the axios-public client) since middleware runs on the Edge runtime. A 404 or network failure
// 404 means "not a recognized school domain" — fall through to normal app routing. Any other failure
// (network, 5xx) is "unavailable": we can't tell, so the root must not bounce a school's visitors to
// the staff login.
const RESOLVE_UNAVAILABLE = "unavailable" as const;

async function resolveConnectedDomain(host: string): Promise<{ slug: string; live: boolean } | typeof RESOLVE_UNAVAILABLE | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public/website/resolve?host=${encodeURIComponent(host)}`, {
      next: { revalidate: 60 },
    });
    if (res.status === 404) return null;
    if (!res.ok) return RESOLVE_UNAVAILABLE;
    const body = await res.json();
    return body.data ?? body ?? RESOLVE_UNAVAILABLE;
  } catch {
    return RESOLVE_UNAVAILABLE;
  }
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  const host = req.headers.get("host") ?? req.nextUrl.host;
  const hostname = host.split(":")[0];

  // A school's own connected custom domain (e.g. unilag.com). Its root serves the customized public
  // website; every other path (parent auth, /parents) still works, and the staff app is blocked.
  const resolved = !isOwnPlatformHost(hostname) ? await resolveConnectedDomain(host) : null;
  const resolution = resolved && resolved !== RESOLVE_UNAVAILABLE ? resolved : null;
  const isCustomSchoolDomain = !!resolution;

  // Custom-domain root comes first — before the cookie read and the "/" redirects below.
  if (path === "/" && resolved) {
    url.pathname = resolution && resolution.live ? `/site/${resolution.slug}` : "/site/coming-soon";
    return NextResponse.rewrite(url);
  }

  // Temporarily disabled finance routes
  // const disabledRoutes = [
  //   "/staff/fee-collection",
  //   "/staff/website-customization",
  //   "/staff/invoice-templates",
  //   "/staff/fees",
  //   "/staff/stocks",
  //   "/staff/domain",
  // ];
  // if (disabledRoutes.some(route => path === route || path.startsWith(route + "/"))) {
  //   return NextResponse.redirect(new URL("/staff/", req.nextUrl));
  // }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // True for a *.axisbydigenty.com parent subdomain or a school's connected custom domain —
  // either way, this host serves the parent portal only, never the staff app.
  const isParentPortalHost = !!getSubdomain(host) || isCustomSchoolDomain;

  //include all routes that you want to be accessed without auth
  const authRoutes = [
    "/auth/staff",
    "/auth/staff?step=login",
    "/auth/staff?step=signup",
    "/auth/parents/login",
    "/auth/parents/signup",
    "/auth/parents/forgot-password",
  ];

  const isAuthRoute = authRoutes.includes(path);

  if (path === "/") {
    // Real parent-portal subdomains (e.g. greenwood.axisbydigenty.com) still land on the
    // parent portal by default. Bare hosts (localhost, digenty-web.vercel.app) default to
    // staff — users must manually navigate to /auth/parents/login for the parent portal.
    if (isParentPortalHost) {
      const target = token ? "/parents" : "/auth/parents/login";
      return NextResponse.redirect(new URL(target, req.nextUrl));
    }
    return NextResponse.redirect(new URL("/auth/staff", req.nextUrl));
  }

  // A parent-portal-only host (subdomain or connected custom domain) never serves the staff app.
  if (isParentPortalHost && (path.startsWith("/staff") || path.startsWith("/auth/staff"))) {
    return NextResponse.redirect(new URL(token ? "/parents" : "/auth/parents/login", req.nextUrl));
  }

  //   If user is logged in and tries to visit auth routes
  if (token && isAuthRoute) {
    const target = isParentPortalHost || path.startsWith("/auth/parent") ? "/parents" : "/staff/";
    return NextResponse.redirect(new URL(target, req.nextUrl));
  }

  if (!token && !isAuthRoute) {
    if (path.startsWith("/staff")) {
      return NextResponse.redirect(new URL("/auth/staff", req.url));
    }

    if (path.startsWith("/parent")) {
      return NextResponse.redirect(new URL("/auth/parents/login", req.url));
    }
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|serwist|firebase-messaging-sw\\.js|_next/static|_next/image|favicon.ico|icons|fonts|.*\\.png$).*)"],
};
