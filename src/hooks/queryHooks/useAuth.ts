import { login, signup } from "@/api/auth";
import { createSession } from "@/app/actions/auth";
import { decodeJWT } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export const useLogin = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: data => {
      // const user = decodeJWT(data.data.token)
      console.log(data);
      // createSession(user)
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationKey: ["signup"],
    mutationFn: signup,
    onSuccess: () => {
      redirect("/auth?step=login");
    },
  });
};
