"use server";
import { decodeJWT } from "@/lib/utils";
import { JWTPayload } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const createSession = async (token: string, userType: "SCHOOL_STAFF" | "PARENT") => {
  const cookieStore = await cookies();

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 10, // 10 hours
  });

  redirect(`/${userType === "SCHOOL_STAFF" ? "staff" : "parents"}`);
};

// Re-issues the token cookie in place, without redirecting — used to silently pick up a
// staff member's updated role/permissions (baked into the JWT) without a full re-login.
export const refreshSessionToken = async (token: string) => {
  const cookieStore = await cookies();

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 10, // 10 hours
  });
};

export const deleteSession = async (redirectTo: string = "/auth/staff") => {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("school");

  redirect(redirectTo);
};

export const getSessionToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/");
  }

  return { token };
};

export const getSessionData = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { user: null };
  }

  const user: JWTPayload | null = decodeJWT(token);
  return { user };
};
