import { SubjectByClass } from "@/components/ClassesAndSubjects/Classes/ClassOverview/ClassSubject";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function ViewSubjectScores() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <SubjectByClass />
    </Suspense>
  );
}
