import { login, reAuthenticateUser, signup } from "@/api/auth";
import { authKeys } from "@/queries/auth";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation({
    mutationKey: authKeys.login,
    mutationFn: login,
  });
};

export const useSignup = () => {
  return useMutation({
    mutationKey: authKeys.signup,
    mutationFn: signup,
  });
};

export const useReAutheticateUser = () => {
  return useMutation({
    mutationKey: authKeys.reAuthenticateUser,
    mutationFn: reAuthenticateUser,
  });
};
