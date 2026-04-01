import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { parseCookieString } from "./lib/utils";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const cookieStore = await cookies();
  const tokenString = cookieStore.get("token")?.value;
  const token = parseCookieString(tokenString);

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

  // Redirect to /login if user is not authenticated and tries to visit non-auth routes
  // if (!token && !isAuthRoute) {
  //   return NextResponse.redirect(new URL("/auth/staff", req.nextUrl));
  // }

  if (!token && !isAuthRoute) {
    const path = req.nextUrl.pathname;

    if (path.startsWith("/staff")) {
      return NextResponse.redirect(new URL("/auth/staff", req.url));
    }

    if (path.startsWith("/parent")) {
      return NextResponse.redirect(new URL("/auth/parent", req.url));
    }
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icons|fonts|.*\\.png$).*)"],
};
