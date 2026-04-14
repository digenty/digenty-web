"use client";

import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { EnterEmail } from "./EnterEmail";
import { NewPassword } from "./NewPassword";
import { VerifyCode } from "./VerifyCode";

const STEPS = ["enter-email", "verify-code", "new-password", "done"];

export const ForgotPassword = () => {
  const params = useSearchParams();
  const pathname = usePathname();
  const stepId = params.get("step") || STEPS[0];
  const userType = pathname.split("/")[2] as "staff" | "parent";

  return (
    <div className="">
      <div className="w-full md:w-106 md:p-0">
        {stepId === "enter-email" && <EnterEmail />}

        {stepId === "verify-code" && <VerifyCode />}

        {stepId === "new-password" && <NewPassword userType={userType} />}
      </div>
    </div>
  );
};
