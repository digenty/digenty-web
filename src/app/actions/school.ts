"use server";
import { lookupSchoolByDomain } from "@/api/school";
import { cookies } from "next/headers";

const SCHOOL_COOKIE = "school";

export const setSchoolFromHost = async (host: string) => {
  const response = await lookupSchoolByDomain("tommy");
  const school = response?.data ?? response;
  console.log(school, "@@@@@@@@@");
  const cookieStore = await cookies();
  cookieStore.set(SCHOOL_COOKIE, JSON.stringify(school), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return school;
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
