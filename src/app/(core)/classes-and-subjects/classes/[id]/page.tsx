import { ClassOverview } from "@/components/ClassesAndSubjects/Classes/ClassOverview";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function ClassesAndSubjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <ClassOverview />
    </Suspense>
  );
}
