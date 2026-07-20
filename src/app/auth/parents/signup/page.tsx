import { AuthHeader } from "@/components/Auth/AuthHeader";
import { SignupPasswordForm } from "@/components/ParentPortalComponents/Auth/SignupPasswordForm";
import { cn } from "@/lib/utils";

export default function ParentSignupPage() {
  return (
    <div>
      <div className="bg-bg-default grid min-h-screen w-full grid-cols-1 leading-5 md:grid-cols-2">
        <div className={cn("hidden w-full bg-center md:block md:bg-[url(/images/bg-image-1.png)] md:bg-cover md:bg-no-repeat")} />

        <div className="min-h-screen px-5 md:px-12">
          <AuthHeader />

          <div className="flex items-center justify-center pt-[15%]">
            <div className="w-full max-w-md">
              <SignupPasswordForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
