import { LogoMark } from "@digenty/icons";
import { ForgotPassword } from "@/components/Auth/ForgotPassword";

import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <div className="bg-bg-default w-full p-4 md:p-10">
        <LogoMark />
        <div className="flex min-h-screen w-full items-center justify-center">
          <ForgotPassword />
        </div>
      </div>
    </Suspense>
  );
}

export default ForgotPasswordPage;
