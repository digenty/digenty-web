"use client";
import { Assessment, Grading } from "@/api/types";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { ScoreViewBySubject } from "@/components/ScoreViewBySubject";
import { ScoreType } from "@/components/ScoreViewBySubject/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetGradingsForClass } from "@/hooks/queryHooks/useGrading";
import { useGetSubjectStudents } from "@/hooks/queryHooks/useSubject";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ClassSubjectHeader } from "./ClassSubjectHeader";
import { exportToCSV } from "@/lib/export-utils";
import { ClassPermissionWrapper } from "../../ClassPermissionWrapper";

export const SubjectByClass = () => {
  useBreadcrumb([
    { label: "Classes and Subjects", url: "/staff/classes-and-subjects" },
    { label: "Classes", url: `/staff/classes-and-subjects` },
    { label: "My Class", url: "/staff/classes-and-subjects" },
    { label: "View Score", url: "" },
  ]);

  const pathname = usePathname();
  const classId = pathname.split("/staff/")[8];
  const subjectId = pathname.split("/staff/")[6];
  const armId = pathname.split("/staff/")[4];

  const [updatedData, setUpdatedData] = useState<ScoreType[]>([]);

  const { data: StudentsItem, isLoading, isError, error } = useGetSubjectStudents(Number(subjectId), Number(armId));
  const { data: classGrading } = useGetGradingsForClass(Number(classId));

  const studentsData = StudentsItem?.data?.data?.response?.content ?? [];
  const assessmentHeader = Object.values((studentsData[0]?.assessmentScores ?? {}) as Record<string, Assessment>).map((assessment: Assessment) => ({
    assessmentId: assessment.assessmentId,
    assessmentName: assessment.assessmentName,
    weight: assessment.weight,
    score: assessment.score,
  }));
  const gradings = classGrading?.data ?? [];

  const handleExport = () => {
    const headers = ["S/N", "Student Name", ...assessmentHeader.map(h => h.assessmentName), "Total", "Grade", "Remark"];

    const rows = updatedData.length > 0 ? updatedData : studentsData;

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

    const filename = `ClassSubject_Scores_${subjectId}_${armId}.csv`;
    exportToCSV(filename, headers, csvRows);
  };

  return (
    <ClassPermissionWrapper armId={Number(armId)} isLoading={isLoading}>
      <div className="space-y-4">
        <ClassSubjectHeader onExport={handleExport} />

        {isLoading && (
          <div className="px-4 md:px-8">
            <Skeleton className="bg-bg-input-soft h-100 w-full" />
          </div>
        )}

        {studentsData.length === 0 && !isLoading && !isError && (
          <div className="flex h-80 items-center justify-center">
            <ErrorComponent
              title="No Students"
              description="No students for this class yet"
              buttonText="Add Student"
              url="/staff/student-and-parent-record/add-student"
            />
          </div>
        )}

        {!isLoading && isError && (
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

        {!isLoading && !isError && studentsData.length > 0 && (
          <div className="px-4 md:px-8">
            <ScoreViewBySubject
              scores={studentsData}
              columns={assessmentHeader}
              isEditable={false}
              subjectId={Number(subjectId)}
              armId={Number(armId)}
              gradings={gradings}
              setUpdatedData={setUpdatedData}
            />
          </div>
        )}
      </div>
    </ClassPermissionWrapper>
  );
};
