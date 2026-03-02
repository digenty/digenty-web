"use client";

import { useBreadcrumb } from "@/hooks/useBreadcrumb";

import { ScoreViewBySubject } from "@/components/ScoreViewBySubject";
import ScoresHeader from "./ScoresHeader";
import { useGetSubjectStudents } from "@/hooks/queryHooks/useSubject";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useRef } from "react";
import { useAddScore } from "@/hooks/queryHooks/useScore";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { useGetGradingsForClass } from "@/hooks/queryHooks/useGrading";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";

export default function Score() {
  useBreadcrumb([
    { label: "Classes and Subjects", url: "/classes-and-subjects" },
    { label: "My Subjects", url: "/classes-and-subjects?tab=subjects" },
    { label: "Score Input", url: "" },
  ]);

  const pathname = usePathname();
  const router = useRouter();
  const classId = pathname.split("/")[5];
  const subjectId = pathname.split("/")[3];
  const armId = pathname.split("/")[7];

  const { data: StudentsItem, isLoading, isError, error } = useGetSubjectStudents(Number(subjectId), Number(armId));
  const { data: classGrading, isLoading: isGradingLoading } = useGetGradingsForClass(Number(classId), 25);

  const { isPending: isSubmitting } = useAddScore();

  const studentsData = StudentsItem?.data?.data?.content ?? [];
  const assessmentHeader = Object.keys(studentsData[0]?.assessmentScores ?? {});
  const gradings = classGrading?.data ?? [];

  const submitScoreRef = useRef<(() => void) | null>(null);

  const handleSubmitTrigger = (submitFn: () => void) => {
    submitScoreRef.current = submitFn;
  };

  const handleSubmit = () => {
    if (submitScoreRef.current) {
      submitScoreRef.current();
    }
  };

  // const handleSubmitSuccess = () => {
  //   const params = new URLSearchParams(searchParams.toString());
  //   params.set("SUBMITTED", "true");
  //   router.push(`?${params.toString()}`);
  // };

  console.log(studentsData);
  return (
    <div className="flex w-full flex-col gap-5">
      <ScoresHeader onSubmit={handleSubmit} isSubmitting={isSubmitting} isError={isError} />

      {isLoading && <Skeleton className="bg-bg-input-soft h-100 w-full" />}

      {!isLoading && isError && (
        <div className="flex h-80 items-center justify-center">
          {/* TODO: Set URL or action to contact admin */}
          {error.message === "No assessments configured for this class or branch" ? (
            <ErrorComponent title="Not Found" description={error.message} buttonText="Contact Admin" url="" />
          ) : (
            <ErrorComponent
              title="No Students"
              description="This is our problem, we are looking into it so as to serve you better"
              buttonText="Go to Home page"
            />
          )}
        </div>
      )}

      {!isLoading && !isError && studentsData.length > 0 && (
        <div className="px-4 md:px-8">
          <ScoreViewBySubject
            scores={studentsData}
            columns={assessmentHeader}
            // isEditable={!isSubmitted}
            isEditable={true}
            subjectId={Number(subjectId)}
            armId={Number(armId)}
            onSubmitTrigger={handleSubmitTrigger}
            onSubmitSuccess={() => {}}
            gradings={gradings}
          />
        </div>
      )}
    </div>
  );
}
