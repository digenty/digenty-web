"use client";
import { AppleAuth } from "@/components/Auth/AppleAuth";
import { AuthLayout } from "@/components/Auth/AuthLayout";
import { GoogleAuth } from "@/components/Auth/GoogleAuth";
import { Fields } from "./Signup/Fields";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Auth = () => {
  const [nextStep, setNextStep] = useState<"login" | "signup" | null>(null);
  return (
    <AuthLayout showNextStep={!!nextStep}>
      <div className="flex h-full flex-col items-center justify-center">
        <div>
          <h4 className="text-text-default text-center text-lg font-semibold">
            {nextStep === "signup" ? "Create your account" : nextStep === "login" ? "Welcome Back 👋🏻" : "Log in or Sign up"}
          </h4>
          <p className="text-text-muted text-sm">
            {nextStep === "signup"
              ? "Set your password to continue"
              : nextStep === "login"
                ? "Log in to access your dashboard."
                : "Choose how to proceed"}
          </p>
        </div>

        {!nextStep && (
          <div className="mt-7 w-full space-y-3">
            <GoogleAuth />
            <AppleAuth />
          </div>
        )}

        {!nextStep && (
          <div className="my-6 flex w-full items-center justify-stretch gap-3">
            <hr className="border-border-default w-40 flex-1 border-[0.5px]" />
            <span className="text-text-muted text-sm">or</span>
            <hr className="border-border-default w-40 flex-1 border-[0.5px]" />
          </div>
        )}
        <div className={cn("w-full", nextStep && "mt-7")}>
          <Fields setNextStep={setNextStep} nextStep={nextStep} />
        </div>
      </div>
    </AuthLayout>
  );
};
