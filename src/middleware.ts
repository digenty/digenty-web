import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

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
    return NextResponse.redirect(new URL("/auth/staff", req.nextUrl));
  }

  //   If user is logged in and tries to visit auth routes
  if (token && isAuthRoute) {
    const target = path.startsWith("/auth/parent") ? "/parents" : "/staff/";
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
