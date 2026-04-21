import { ParentOnboarding } from "@/components/Parents/Onboarding";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function ParentOnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <ParentOnboarding />
    </Suspense>
  );
}
