import { AcademicRecord } from "@/components/ParentPortalComponents/AcademicRecord";
import { Spinner } from "@/components/ui/spinner";
import React, { Suspense } from "react";

export default function ParentViewStudentsAcademicRecordPage() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <AcademicRecord />
      </Suspense>
    </div>
  );
}
