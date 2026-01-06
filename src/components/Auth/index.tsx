"use client";
import { AuthLayout } from "@/components/Auth/AuthLayout";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { GoogleAuth } from "./GoogleAuth";
import { ValidateEmail } from "./ValidateEmail";

export const Auth = () => {
  const params = useSearchParams();
  const step = params.get("step");

  return (
    <AuthLayout showNextStep={!!step}>
      <div className="flex h-full flex-col items-center justify-center">
        <div>
          <h4 className="text-text-default text-center text-lg font-semibold">
            {step === "signup" ? "Create your account" : step === "login" ? "Welcome Back 👋🏻" : "Log in or Sign up"}
          </h4>
          <p className="text-text-muted text-sm">
            {step === "signup" ? "Set your password to continue" : step === "login" ? "Log in to access your dashboard." : "Choose how to proceed"}
          </p>
        </div>

        {!step && (
          <div className="mt-7 w-full space-y-3">
            <GoogleAuth />
            {/* <AppleAuth /> */}
          </div>
        )}

        {!step && (
          <div className="my-6 flex w-full items-center justify-stretch gap-3">
            <hr className="border-border-default w-40 flex-1 border-[0.5px]" />
            <span className="text-text-muted text-sm">or</span>
            <hr className="border-border-default w-40 flex-1 border-[0.5px]" />
          </div>
        )}
        <div className={cn("w-full", step && "mt-7")}>
          <ValidateEmail />
        </div>
      </div>
    </AuthLayout>
  );
};
