import { ForgotPassword } from "@/components/Auth/ForgotPassword";
import { LogoMark } from "@/components/Icons/LogoMark";
import React from "react";

function ForgotPasswordPage() {
  return (
    <div className="bg-bg-default w-full p-4">
      <LogoMark />
      <div className="flex min-h-screen w-full items-center justify-center">
        <ForgotPassword />
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
