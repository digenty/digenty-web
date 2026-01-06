"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  accessToken: string;
};

export const createSession = async (user: User) => {
  const cookieStore = await cookies();

  cookieStore.set("user", JSON.stringify(user), {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });

  // redirect("/");
};

export const deleteSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("user");

  redirect("/auth");
};

export const getSessionData = async () => {
  const cookieStore = await cookies();
  const user = cookieStore.get("user")?.value;

  if (!user) {
    redirect("/auth");
  }

  const parsedUser = JSON.parse(user);
  return { ...parsedUser };
};

// export const getAuthToken = async () => {
//   const cookieStore = await cookies();
//   const accessTokenString = cookieStore.get("access")?.value ?? "";
//   const refreshTokenString = cookieStore.get("refreshToken")?.value ?? "";

//   const accessToken = JSON.parse(accessTokenString);
//   const refreshToken = JSON.parse(refreshTokenString);

//   return { accessToken, refreshToken };
// };
