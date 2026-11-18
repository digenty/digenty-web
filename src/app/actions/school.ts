"use server";
import { lookupSchoolByDomain, lookupSchoolBySignupToken } from "@/api/school";
import { getApiErrorReason } from "@/lib/apiError";
import { cookies } from "next/headers";

const SCHOOL_COOKIE = "school";

const storeSchoolCookie = async (school: unknown) => {
  const cookieStore = await cookies();
  cookieStore.set(SCHOOL_COOKIE, JSON.stringify(school), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
};

export const setSchoolFromHost = async (host: string) => {
  const response = await lookupSchoolByDomain(host);
  const school = response?.data ?? response;
  await storeSchoolCookie(school);
  return school;
};

// For schools without a custom domain: the parent signup link carries a token instead of a host.
// Returns the failure reason instead of throwing — Next masks the message of an error thrown from a server
// action in production, and the backend's reason ("Signup link is invalid or has been disabled") is what the parent needs to see.
export const setSchoolFromSignupToken = async (token: string): Promise<{ school: { id?: number } | null; reason?: string }> => {
  try {
    const response = await lookupSchoolBySignupToken(token);
    const school = response?.data ?? response;
    await storeSchoolCookie(school);
    return { school };
  } catch (error) {
    return { school: null, reason: getApiErrorReason(error) };
  }
};

export const getSchoolFromCookie = async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SCHOOL_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const clearSchoolCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(SCHOOL_COOKIE);
};
