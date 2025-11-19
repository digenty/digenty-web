import { TermSheet } from "@/components/AttendanceManagement/ClassAttendance/TermSheet";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function ClassTermSheetPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <TermSheet />
    </Suspense>
  );
}
