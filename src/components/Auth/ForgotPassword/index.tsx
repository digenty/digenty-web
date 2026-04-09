"use client";

import { useSearchParams } from "next/navigation";
import React from "react";
import { EnterEmail } from "./EnterEmail";
import { VerifyCode } from "./VerifyCode";
import { NewPassword } from "./NewPassword";

const STEPS = ["enter-email", "verify-code", "new-password", "done"];

const ForgotPassword = () => {
  const params = useSearchParams();
  const stepId = params.get("step") || STEPS[0];

  return (
    <div className="">
      <div className="w-full md:w-106 md:p-0">
        {stepId === "enter-email" && <EnterEmail />}

        {stepId === "verify-code" && <VerifyCode />}

        {stepId === "new-password" && <NewPassword />}
      </div>
    </div>
  );
};

export default ForgotPassword;
