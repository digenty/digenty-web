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
// domain website resolution below only applies to hosts outside this set.
function isOwnPlatformHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname === "axisbydigenty.com" ||
    hostname.endsWith(".axisbydigenty.com") ||
    hostname === "digenty-web.vercel.app" ||
    hostname.endsWith(".digenty-web.vercel.app")
  );
}

// Unauthenticated host -> slug lookup for a school's connected custom domain. Plain fetch (not
// the axios-public client) since middleware runs on the Edge runtime. A 404 or network failure
// both mean "not a recognized school domain" — fall through to normal app routing either way.
async function resolveCustomDomainSlug(host: string): Promise<{ slug: string; live: boolean } | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public/website/resolve?host=${encodeURIComponent(host)}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const body = await res.json();
    return body.data ?? body ?? null;
  } catch {
    return null;
  }
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  const host = req.headers.get("host") ?? req.nextUrl.host;
  const hostname = host.split(":")[0];

  // A school's own connected domain (e.g. unilag.com) — resolve and serve the public website.
  // Runs before everything else below: this traffic has nothing to do with the staff/parent app.
  if (!isOwnPlatformHost(hostname)) {
    const resolution = await resolveCustomDomainSlug(host);
    if (resolution) {
      url.pathname = resolution.live ? `/site/${resolution.slug}` : "/site/coming-soon";
      return NextResponse.rewrite(url);
    }
    // Unresolved — no school owns this host. Fall through to normal app routing below.
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

  const isSubdomainPortal = !!getSubdomain(host);

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
    if (isSubdomainPortal) {
      const target = token ? "/parents" : "/auth/parents/login";
      return NextResponse.redirect(new URL(target, req.nextUrl));
    }
    return NextResponse.redirect(new URL("/auth/staff", req.nextUrl));
  }

  //   If user is logged in and tries to visit auth routes
  if (token && isAuthRoute) {
    const target = isSubdomainPortal || path.startsWith("/auth/parent") ? "/parents" : "/staff/";
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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icons|fonts|.*\\.png$).*)"],
};
