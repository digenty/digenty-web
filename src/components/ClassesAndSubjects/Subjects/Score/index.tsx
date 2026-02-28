"use client";

import { useBreadcrumb } from "@/hooks/useBreadcrumb";

import { ScoreViewBySubject } from "@/components/ScoreViewBySubject";
import ScoresHeader from "./ScoresHeader";
import { useGetSubjectStudents } from "@/hooks/queryHooks/useSubject";
import { useSearchParams, useRouter } from "next/navigation";
import { useRef } from "react";
import { useAddScore } from "@/hooks/queryHooks/useScore";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorComponent } from "@/components/Error/ErrorComponent";

export default function Score() {
  useBreadcrumb([
    { label: "Classes and Subjects", url: "/classes-and-subjects" },
    { label: "My Subjects", url: "/classes-and-subjects?tab=subjects" },
    { label: "Score Input", url: "" },
  ]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const subjectId = Number(searchParams.get("subjectId"));
  const armId = Number(searchParams.get("armId"));
  const { data: StudentsItem, isLoading, isError } = useGetSubjectStudents(subjectId, armId);
  const { isPending: isSubmitting } = useAddScore();
  const isSubmitted = !!searchParams.get("SUBMITTED");
  const studentsData = StudentsItem?.data?.content;
  console.log(studentsData, "Student Items");

  const submitScoreRef = useRef<(() => void) | null>(null);

  const handleSubmitTrigger = (submitFn: () => void) => {
    submitScoreRef.current = submitFn;
  };

  const handleSubmit = () => {
    if (submitScoreRef.current) {
      submitScoreRef.current();
    }
  };

  const handleSubmitSuccess = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("SUBMITTED", "true");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <ScoresHeader onSubmit={handleSubmit} isSubmitting={isSubmitting} isError={isError} />

      {isLoading && <Skeleton className="bg-bg-input-soft hidden h-100 w-full md:block" />}

      {!isLoading && isError && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent title="No Students" description="No student has been added yet" buttonText="Contact Admin" />
        </div>
      )}

      {!isLoading && !isError && studentsData.length > 0 && (
        <div className="px-4 md:px-8">
          <ScoreViewBySubject
            scores={studentsData}
            isEditable={!isSubmitted}
            subjectId={subjectId}
            armId={armId}
            onSubmitTrigger={handleSubmitTrigger}
            onSubmitSuccess={handleSubmitSuccess}
          />
        </div>
      )}
    </div>
  );
}
