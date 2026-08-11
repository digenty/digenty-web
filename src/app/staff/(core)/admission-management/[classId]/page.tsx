import { ClassApplicants } from "@/components/AdmissionManagement/ProcessApplicants/ClassApplicants";
import { BackButton } from "@/components/BackButton";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <div className="p-6">
        <div className="pb-3 md:hidden">
          <BackButton />
        </div>
        <ClassApplicants />
      </div>
    </Suspense>
  );
}
