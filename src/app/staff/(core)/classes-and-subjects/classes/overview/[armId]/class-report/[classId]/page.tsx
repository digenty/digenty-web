import { ClassReport } from "@/components/ClassesAndSubjects/Classes/ClassOverview/ClassReport";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function ClassReportPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <ClassReport />
    </Suspense>
  );
}
