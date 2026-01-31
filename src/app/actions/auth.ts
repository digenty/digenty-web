"use server";
import { decodeJWT } from "@/lib/utils";
import { JWTPayload } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const createSession = async (token: string) => {
  const cookieStore = await cookies();

  cookieStore.set("token", JSON.stringify(token), {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });

  redirect("/");
};

export const deleteSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("token");

  redirect("/auth");
};

export const getSessionToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/auth");
  }

  const accessToken = JSON.parse(token);
  return { token: accessToken };
};

export const getSessionData = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { user: null };
  }

  const accessToken = JSON.parse(token);
  const user: JWTPayload | null = decodeJWT(accessToken);
  return { user };
};
