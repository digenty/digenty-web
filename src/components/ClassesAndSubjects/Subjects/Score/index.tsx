"use client";

import { useBreadcrumb } from "@/hooks/useBreadcrumb";

import { ScoreViewBySubject } from "@/components/ScoreViewBySubject";
import ScoresHeader from "./ScoresHeader";
import { useGetSubjectStudents } from "@/hooks/queryHooks/useSubject";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useRef } from "react";
import { useAddScore } from "@/hooks/queryHooks/useScore";
import { Skeleton } from "@/components/ui/skeleton";

export default function Score() {
  useBreadcrumb([
    { label: "Classes and Subjects", url: "/classes-and-subjects" },
    { label: "My Subjects", url: "/classes-and-subjects?tab=subjects" },
    { label: "Score Input", url: "" },
  ]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const subjectId = Number(params.id);
  const armId = Number(searchParams.get("armId"));
  const { data: StudentsItem, isLoading } = useGetSubjectStudents(subjectId, armId);
  const { isPending: isSubmitting } = useAddScore();
  const isSubmitted = !!searchParams.get("SUBMITTED");
  console.log("SubjectId:", subjectId);
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
      <ScoresHeader onSubmit={handleSubmit} isSubmitting={isSubmitting} subjectId={subjectId} />
      {isLoading || !subjectId || !armId ? (
        <div className="p-4">
          <Skeleton className="bg-bg-input-soft h-100 w-full" />
        </div>
      ) : (
        <div className="px-4 md:px-8">
          <ScoreViewBySubject
            scores={StudentsItem?.content}
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
