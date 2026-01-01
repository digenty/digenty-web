import React from "react";
import { AuthHeader } from "./AuthHeader";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-bg-default flex h-screen leading-5">
      <div className="hidden w-full flex-1 bg-center md:block md:bg-[url(/images/bg-image-1.png)] md:bg-cover md:bg-no-repeat" />
      <div className="min-h-screen flex-1">
        <AuthHeader />

        <div className="flex items-center justify-center">{children}</div>
      </div>
    </div>
  );
};
