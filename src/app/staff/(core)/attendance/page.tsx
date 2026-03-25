import { AttendanceManagement } from "@/components/AttendanceManagement";
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
      <AttendanceManagement />
    </Suspense>
  );
}
