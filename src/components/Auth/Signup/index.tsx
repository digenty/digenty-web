import { AppleAuth } from "@/components/Auth/AppleAuth";
import { AuthLayout } from "@/components/Auth/AuthLayout";
import { GoogleAuth } from "@/components/Auth/GoogleAuth";
import { Fields } from "./Fields";

export const Signup = () => {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center px-12">
        <div>
          <h4 className="text-text-default text-lg font-semibold">Log in or Sign up</h4>
          <p className="text-text-muted text-sm">Choose how to proceed</p>
        </div>

        <GoogleAuth className="mt-7" />
        <AppleAuth className="mt-3" />

        <div className="mt-6 flex w-102 items-center justify-center gap-3">
          <hr className="border-border-default w-40 flex-1 border" />
          <span className="text-text-muted text-sm">or</span>
          <hr className="border-border-default w-40 flex-1 border" />
        </div>

        <Fields />
      </div>
    </AuthLayout>
  );
};
