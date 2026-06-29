import { ClassApplicants } from "@/components/AdmissionManagement/ProcessApplicants/ClassApplicants";
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
        <ClassApplicants />
      </div>
    </Suspense>
  );
}
