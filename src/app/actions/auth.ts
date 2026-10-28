"use server";
import { canReplaceSession, identityOf, isSameIdentity, type SessionIdentity, type SessionUserType } from "@/lib/session-identity";
import { decodeJWT } from "@/lib/utils";
import { JWTPayload } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const TOKEN_COOKIE = "token";
// Which portal the session belongs to. The JWT doesn't say, and only the two login pages know.
const USER_TYPE_COOKIE = "session_type";

const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 10, // 10 hours
};

const readUserType = (value: string | undefined): SessionUserType | undefined => (value === "PARENT" || value === "SCHOOL_STAFF" ? value : undefined);

// The session currently held in the cookie. Every tab of a browser shares it, so it is whoever signed in last.
const currentSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  const userType = readUserType(cookieStore.get(USER_TYPE_COOKIE)?.value);
  const user: JWTPayload | null = token ? decodeJWT(token) : null;

  return { cookieStore, token, userType, user, identity: identityOf(user, userType) };
};

export const createSession = async (token: string, userType: SessionUserType) => {
  const cookieStore = await cookies();

  cookieStore.set(TOKEN_COOKIE, token, sessionCookieOptions);
  cookieStore.set(USER_TYPE_COOKIE, userType, sessionCookieOptions);

  redirect(`/${userType === "SCHOOL_STAFF" ? "staff" : "parents"}`);
};

// Re-issues the token cookie in place, without redirecting — used to silently pick up a
// staff member's updated role/permissions (baked into the JWT) without a full re-login.
// It only ever re-issues the session that is still current: if another tab has signed in as
// someone else (or signed out) since the request that produced `token` started, writing it
// would undo that, so it is skipped and `applied` is false.
export const refreshSessionToken = async (token: string): Promise<{ applied: boolean }> => {
  const { cookieStore, token: currentToken, userType, identity: current } = await currentSession();

  if (!canReplaceSession(current, !!currentToken, identityOf(decodeJWT(token), userType))) {
    return { applied: false };
  }

  cookieStore.set(TOKEN_COOKIE, token, sessionCookieOptions);
  return { applied: true };
};

export const deleteSession = async (redirectTo: string = "/auth/staff") => {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE);
  cookieStore.delete(USER_TYPE_COOKIE);
  cookieStore.delete("school");

  redirect(redirectTo);
};

// For automatic sign-outs (an expired token, a 401). If the cookie now holds a different person's
// session, because another tab signed in as them meanwhile, it is left alone: ending it would log
// that person out of a perfectly good session.
export const deleteSessionIfCurrent = async (expected: SessionIdentity, redirectTo: string = "/auth/staff") => {
  const { token, identity: current } = await currentSession();

  if (token && current && !isSameIdentity(current, expected)) {
    return { deleted: false as const };
  }

  return deleteSession(redirectTo);
};

export const getSessionToken = async () => {
  const { token, userType } = await currentSession();

  if (!token) {
    redirect("/");
  }

  return { token, userType };
};

export const getSessionData = async () => {
  const { token, user, userType } = await currentSession();

  if (!token) {
    return { user: null, userType };
  }

  return { user, userType };
};
