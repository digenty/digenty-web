import React from "react";
import { AuthHeader } from "./AuthHeader";
import { cn } from "@/lib/utils";

export const AuthLayout = ({ children, showNextStep }: { children: React.ReactNode; showNextStep: boolean }) => {
  return (
    <div className="bg-bg-default grid min-h-screen w-full grid-cols-1 leading-5 md:grid-cols-2">
      <div
        className={cn(
          "hidden w-full bg-center md:block md:bg-cover md:bg-no-repeat",
          showNextStep ? "md:bg-[url(/images/bg-image-2.png)]" : "md:bg-[url(/images/bg-image-1.png)]",
        )}
      />

      <div className="min-h-screen px-5 md:px-12">
        <AuthHeader />

        <div className="flex items-center justify-center pt-[25%]">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
};
