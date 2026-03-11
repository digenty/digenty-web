"use client";

import { useBreadcrumb } from "@/hooks/useBreadcrumb";

import { Assessment, Grading } from "@/api/types";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { ScoreViewBySubject } from "@/components/ScoreViewBySubject";
import { ScoreType, SubmitScorePayload } from "@/components/ScoreViewBySubject/types";
import { toast } from "@/components/Toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetGradingsForLevel } from "@/hooks/queryHooks/useGrading";
import { useAddScore } from "@/hooks/queryHooks/useScore";
import { useGetSubjectStudents } from "@/hooks/queryHooks/useSubject";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { exportToCSV } from "@/lib/export-utils";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SubjectReportPermissionWrapper } from "../SubjectReportPermissionWrapper";
import ScoresHeader from "./ScoresHeader";

export default function Score() {
  useBreadcrumb([
    { label: "Classes and Subjects", url: "/classes-and-subjects" },
    { label: "My Subjects", url: "/classes-and-subjects?tab=subjects" },
    { label: "Score Input", url: "" },
  ]);

  const pathname = usePathname();
  const classId = pathname.split("/")[5];
  const subjectId = pathname.split("/")[3];
  const armId = pathname.split("/")[7];

  const [updatedData, setUpdatedData] = useState<ScoreType[]>([]);

  const { data: studentsItem, isLoading, isError, error } = useGetSubjectStudents(Number(subjectId), Number(armId));
  const { data: classGrading } = useGetGradingsForLevel(Number(classId));
  const { mutate, isPending: isSubmitting } = useAddScore();
  const user = useLoggedInUser();

  const studentsData = studentsItem?.data?.data?.content ?? [];
  const assessmentHeader = Object.values((studentsData[0]?.assessmentScores ?? {}) as Record<string, Assessment>).map((assessment: Assessment) => ({
    assessmentId: assessment.assessmentId,
    assessmentName: assessment.assessmentName,
    weight: assessment.weight,
    score: assessment.score,
  }));
  const gradings = classGrading?.data ?? [];

  const handleSubmit = (status: "SUBMITTED" | "IN_PROGRESS", closeModal: (bool: boolean) => void) => {
    const payload: SubmitScorePayload = {
      subjectId: Number(subjectId),
      armId: Number(armId),
      status,
      studentReports: updatedData.map(student => ({
        studentId: student.studentId,
        scores: [
          ...Object.entries(student.assessmentScores).map(([key, value]) => ({
            assessmentId: assessmentHeader.find(header => header.assessmentName === key)?.assessmentId as number,
            score: value.score,
          })),
        ],
      })),
    };

    mutate(payload, {
      onSuccess: () => {
        toast({
          title: `${status === "SUBMITTED" ? "Submitted" : "Saved as draft"}`,
          description: `Scores ${status === "SUBMITTED" ? "submitted" : "saved as draft"} successfully`,
          type: "success",
        });
        closeModal(false);
      },
      onError: () => {
        toast({
          title: `Could not ${status === "SUBMITTED" ? "submit" : "save"}`,
          description: `Failed to ${status === "SUBMITTED" ? "submit" : "save"} scores`,
          type: "error",
        });
        closeModal(false);
      },
    });
  };

  const handleExport = () => {
    const headers = ["S/N", "Student Name", ...assessmentHeader.map(h => h.assessmentName), "Total", "Grade", "Remark"];

    const rows =
      updatedData.length > 0
        ? updatedData
        : (studentsItem?.data?.data?.content ?? []).map((student: ScoreType) => ({
            ...student,
            assessmentScores: student.assessmentScores,
          }));

    const csvRows = rows.map((student: ScoreType, index: number) => {
      const assessments = assessmentHeader.map(h => student.assessmentScores[h.assessmentName]?.score ?? 0);
      const totalScore = Object.values(student.assessmentScores).reduce(
        (
          sum: number,
          assessment: {
            assessmentName: string;
            score: number;
            weight: number;
          },
        ) => sum + (assessment.score ?? 0),
        0,
      );
      const grading = gradings.find((g: Grading) => g.lowerLimit <= totalScore && g.upperLimit >= totalScore);

      return [index + 1, student.studentName, ...assessments, totalScore, grading?.grade ?? "", grading?.remark ?? ""];
    });

    const filename = `Scores_${subjectId}_${armId}.csv`;
    exportToCSV(filename, headers, csvRows);
  };

  return (
    <SubjectReportPermissionWrapper subjectId={Number(subjectId)} isLoading={isLoading}>
      <div className="flex w-full flex-col gap-5">
        <ScoresHeader onSubmit={handleSubmit} isSubmitting={isSubmitting} isError={isError} onExport={handleExport} />
        {!isLoading && isError && !studentsItem && (
          <div className="flex h-80 items-center justify-center pt-15">
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

        {isLoading && (
          <div className="px-4 md:px-8">
            <Skeleton className="bg-bg-input-soft h-100 w-full" />
          </div>
        )}

        {studentsItem?.data?.data?.content.length === 0 && !isLoading && !isError && (
          <div className="flex h-80 items-center justify-center">
            <ErrorComponent
              title="No Students"
              description="No students for this class yet"
              buttonText="Add Student"
              url="/student-and-parent-record/add-student"
            />
          </div>
        )}

        {!isLoading && !isError && studentsData.length > 0 && (
          <div className="px-4 md:px-8">
            <ScoreViewBySubject
              scores={studentsData}
              columns={assessmentHeader}
              isEditable={true}
              subjectId={Number(subjectId)}
              armId={Number(armId)}
              gradings={gradings}
              setUpdatedData={setUpdatedData}
            />
          </div>
        )}
      </div>
    </SubjectReportPermissionWrapper>
  );
}
