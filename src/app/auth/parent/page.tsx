import { Auth } from "@/components/Auth";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function ParentSignupPage() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <Auth userType="PARENT" />
      </Suspense>
    </div>
  );
}
