"use client";
import { AppleAuth } from "@/components/Auth/AppleAuth";
import { AuthLayout } from "@/components/Auth/AuthLayout";
import { GoogleAuth } from "@/components/Auth/GoogleAuth";
import { Fields } from "./Signup/Fields";
import { useState } from "react";

export const Auth = () => {
  const [showNextStep, setShowNextStep] = useState(false);
  return (
    <AuthLayout showNextStep={showNextStep}>
      <div className="flex h-full flex-col items-center justify-center">
        <div>
          <h4 className="text-text-default text-lg font-semibold">Log in or Sign up</h4>
          <p className="text-text-muted text-sm">Choose how to proceed</p>
        </div>

        {!showNextStep && (
          <div className="mt-7 w-full space-y-3">
            <GoogleAuth />
            <AppleAuth />
          </div>
        )}

        <div className="my-6 flex w-full items-center justify-stretch gap-3">
          <hr className="border-border-default w-40 flex-1 border-[0.5px]" />
          <span className="text-text-muted text-sm">or</span>
          <hr className="border-border-default w-40 flex-1 border-[0.5px]" />
        </div>

        <Fields setShowNextStep={setShowNextStep} />
      </div>
    </AuthLayout>
  );
};
