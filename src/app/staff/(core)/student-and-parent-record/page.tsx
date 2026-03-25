import StudentAndParentRecord from "@/components/StudentAndParent";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function StudentAndParentRecordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <StudentAndParentRecord />
    </Suspense>
  );
}
