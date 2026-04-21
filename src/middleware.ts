import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host");
  const path = url.pathname;
  console.log(url, host, path);

  // Subdomain handling
  // For local testing: greenwood.localhost:3000
  // For production: school.axis.com
  const mainDomains = ["axis.com", "localhost:3000", "app.axis.com"];

  if (host && !mainDomains.includes(host)) {
    const parts = host.split(".");
    // Check if we have a subdomain (e.g., greenwood.axis.com or greenwood.localhost:3000)
    // For localhost:3000, parts would be ["greenwood", "localhost:3000"]
    // For axis.com, parts would be ["greenwood", "axis", "com"]
    const subdomain = parts.length > 2 || (parts.length === 2 && parts[1].includes("localhost")) ? parts[0] : null;

    if (subdomain && subdomain !== "www") {
      // Rewrite root /onboarding to /parents/[schoolSlug]/onboarding
      if (path === "/onboarding" || path === "/parent/onboarding") {
        url.pathname = `/parents/${subdomain}/onboarding`;
        return NextResponse.rewrite(url);
      }
    }
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  //include all routes that you want to be accessed without auth
  const authRoutes = [
    "/auth/staff",
    "/auth/staff?step=login",
    "/auth/staff?step=signup",
    "/auth/parents",
    "/auth/parents?step=login",
    "/auth/parents?step=signup",
  ];

  const isAuthRoute = authRoutes.includes(path);

  if (path === "/") {
    return NextResponse.redirect(new URL("/auth/staff", req.nextUrl));
  }

  //   If user is logged in and tries to visit auth routes
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/staff/", req.nextUrl));
  }

  if (!token && !isAuthRoute) {
    if (path.startsWith("/staff")) {
      return NextResponse.redirect(new URL("/auth/staff", req.url));
    }

    if (path.startsWith("/parent")) {
      // Don't redirect if it's already a rewritten path or subdomain specific
      if (!path.includes(`/${host?.split(".")[0]}/`)) {
        return NextResponse.redirect(new URL("/auth/parent", req.url));
      }
    }
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icons|fonts|.*\\.png$).*)"],
};
