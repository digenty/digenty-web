import ClassesAndSubjects from "@/components/ClassesAndSubjects";
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
      {/* For admin screens visit 'classes-and-subjects/all-classes' */}
      <ClassesAndSubjects />
    </Suspense>
  );
}
