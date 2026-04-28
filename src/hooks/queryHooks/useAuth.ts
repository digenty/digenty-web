import {
  changePassword,
  forgetPassword,
  login,
  parentSignup,
  reAuthenticateUser,
  resetPassword,
  sendChangePasswordOtp,
  signup,
  verifyChangePasswordOtp,
  verifyOtp,
} from "@/api/auth";
import { authKeys } from "@/queries/auth";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const STORAGE_KEY = "otp_expiry";
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

export const useParentSignup = () => {
  return useMutation({
    mutationKey: authKeys.parentSignup,
    mutationFn: parentSignup,
  });
};

export const useReAutheticateUser = () => {
  return useMutation({
    mutationKey: authKeys.reAuthenticateUser,
    mutationFn: reAuthenticateUser,
  });
};

export const useForgetPassword = () => {
  return useMutation({
    mutationKey: authKeys.forgetPassword,
    mutationFn: forgetPassword,
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationKey: authKeys.verifyOtp,
    mutationFn: verifyOtp,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationKey: authKeys.resetPassword,
    mutationFn: resetPassword,
  });
};

export const useSendChangePasswordOtp = () => {
  return useMutation({
    mutationKey: authKeys.sendChangePasswordOtp,
    mutationFn: sendChangePasswordOtp,
  });
};

export const useVerifyChangePasswordOtp = () => {
  return useMutation({
    mutationKey: authKeys.verifyChangePasswordOtp,
    mutationFn: verifyChangePasswordOtp,
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationKey: authKeys.changePassword,
    mutationFn: changePassword,
  });
};

export const useOtpCountdown = (durationSeconds: number) => {
  const getSecondsLeft = () => {
    const expiry = localStorage.getItem(STORAGE_KEY);
    if (!expiry) return 0;
    return Math.max(0, Math.round((Number(expiry) - Date.now()) / 1000));
  };

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const remaining = getSecondsLeft();
    if (remaining > 0) {
      setSeconds(remaining);
    } else {
      const expiry = Date.now() + durationSeconds * 1000;
      localStorage.setItem(STORAGE_KEY, String(expiry));
      setSeconds(durationSeconds);
    }
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const restart = () => {
    const expiry = Date.now() + durationSeconds * 1000;
    localStorage.setItem(STORAGE_KEY, String(expiry));
    setSeconds(durationSeconds);
  };

  const formatted = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return { seconds, formatted, restart, isExpired: seconds <= 0 };
};
