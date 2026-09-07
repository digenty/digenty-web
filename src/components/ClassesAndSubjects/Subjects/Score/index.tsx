"use client";

import { useBreadcrumb } from "@/hooks/useBreadcrumb";

import { Assessment, Grading } from "@/api/types";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { ScoreViewBySubject } from "@/components/ScoreViewBySubject";
import { ScoreType, SubmitScorePayload } from "@/components/ScoreViewBySubject/types";
import { toast } from "@/components/Toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetGradingsForClass } from "@/hooks/queryHooks/useGrading";
import { useAddScore } from "@/hooks/queryHooks/useScore";
import { useSubmitArmTeacherInput } from "@/hooks/queryHooks/useStudent";
import { useGetSubjectStudents } from "@/hooks/queryHooks/useSubject";
import { cn } from "@/lib/utils";
import { exportToCSV } from "@/lib/export-utils";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SubjectReportPermissionWrapper } from "../SubjectReportPermissionWrapper";
import { DevelopmentPreview } from "./DevelopmentPreview";
import { useArmDevelopmentData } from "./DevelopmentPreview/useArmDevelopmentData";
import ScoresHeader from "./ScoresHeader";

export default function Score() {
  useBreadcrumb([
    { label: "Classes and Subjects", url: "/staff/classes-and-subjects" },
    { label: "My Subjects", url: "/staff/classes-and-subjects?tab=subjects" },
    { label: "Score Input", url: "" },
  ]);

  const pathname = usePathname();
  const classId = pathname.split("/")[6];
  const subjectId = pathname.split("/")[4];
  const armId = pathname.split("/")[8];

  const [updatedData, setUpdatedData] = useState<ScoreType[]>([]);
  const [activeScoreTab, setActiveScoreTab] = useState<string>("Standard");
  const [developmentEdits, setDevelopmentEdits] = useState<Record<string, string>>({});

  const { data: studentsItem, isLoading, isError, error } = useGetSubjectStudents(Number(subjectId), Number(armId));
  const { data: classGrading } = useGetGradingsForClass(Number(classId));
  const { mutate, isPending: isSubmitting } = useAddScore();
  const { mutate: submitDevelopment, isPending: isSubmittingDevelopment } = useSubmitArmTeacherInput();

  const studentsData = studentsItem?.data?.data?.response?.content ?? [];
  const status = studentsItem && studentsItem?.data?.data?.status;
  const {
    categories: developmentCategories,
    ratingLegend: developmentRatingLegend,
    ratings: developmentServerRatings,
  } = useArmDevelopmentData(Number(armId));
  // Local edits win over whatever was last saved, so an in-progress rating survives switching category tabs.
  const developmentRatings = { ...developmentServerRatings, ...developmentEdits };
  const scoreTabs = ["Standard", ...developmentCategories.map(category => category.categoryName)];
  const activeDevelopmentCategory = developmentCategories.find(category => category.categoryName === activeScoreTab);

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

  const handleSubmitDevelopment = () => {
    const ratingsByStudent = new Map<number, { skillId: number; rating: number }[]>();

    Object.entries(developmentEdits).forEach(([key, value]) => {
      if (!value) return;
      const [studentIdPart, skillIdPart] = key.split("-");
      const studentId = Number(studentIdPart);
      const skillId = Number(skillIdPart);
      if (!ratingsByStudent.has(studentId)) ratingsByStudent.set(studentId, []);
      ratingsByStudent.get(studentId)!.push({ skillId, rating: Number(value) });
    });

    const studentReports = Array.from(ratingsByStudent.entries()).map(([studentId, ratings]) => ({ studentId, ratings }));

    submitDevelopment(
      { armId: Number(armId), studentReports },
      {
        onSuccess: () => {
          toast({ title: "Submitted", description: "Development ratings submitted successfully", type: "success" });
          setDevelopmentEdits({});
        },
        onError: () => {
          toast({ title: "Could not submit", description: "Failed to submit development ratings", type: "error" });
        },
      },
    );
  };

  return (
    <SubjectReportPermissionWrapper subjectId={Number(subjectId)} isLoading={isLoading} type="edit">
      <div className="flex w-full flex-col gap-5">
        <ScoresHeader onSubmit={handleSubmit} isSubmitting={isSubmitting} isError={isError} onExport={handleExport} status={status} />

        <div className="border-border-default hide-scrollbar flex w-full items-center overflow-x-auto overscroll-x-contain border-b px-4 [-webkit-overflow-scrolling:touch] md:px-8">
          {scoreTabs.map(tab => {
            const isActive = activeScoreTab === tab;
            return (
              <div
                role="button"
                onClick={() => setActiveScoreTab(tab)}
                key={tab}
                className={cn(
                  "cursor-pointer px-3 py-2.5 text-center whitespace-nowrap transition-all duration-150",
                  isActive && "border-border-informative border-b-[1.5px]",
                )}
              >
                <span className={cn("text-sm font-medium", isActive ? "text-text-informative" : "text-text-muted")}>{tab}</span>
              </div>
            );
          })}
        </div>

        {activeScoreTab === "Standard" && (
          <>
            {!isLoading && isError && !studentsItem && (
              <div className="flex h-80 items-center justify-center pt-15">
                {/* TODO: Set URL or action to contact admin */}
                {error.message === "No assessments configured for this class or branch" ? (
                  <ErrorComponent title="Not Found" description={error.message} buttonText="Contact Admin" url="" />
                ) : (
                  <ErrorComponent
                    title="No Students"
                    description={`${error.message || "This is our problem, we are looking into it so as to serve you better"}`}
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

            {studentsItem?.data?.data?.response?.content.length === 0 && !isLoading && !isError && (
              <div className="flex h-80 items-center justify-center">
                <ErrorComponent
                  title="No Students"
                  description="No students for this class yet"
                  buttonText="Add Student"
                  url="/staff/student-and-parent-record/add-student"
                />
              </div>
            )}

            {!isLoading && !isError && studentsData.length > 0 && (
              <div className="px-4 md:px-8">
                <ScoreViewBySubject
                  scores={studentsData}
                  columns={assessmentHeader}
                  isEditable={status === "IN_PROGRESS" || status === "NOT_SUBMITTED" || status === "APPROVED_EDIT_ACCESS"}
                  subjectId={Number(subjectId)}
                  armId={Number(armId)}
                  gradings={gradings}
                  setUpdatedData={setUpdatedData}
                />
              </div>
            )}
          </>
        )}

        {activeDevelopmentCategory && !isLoading && !isError && studentsData.length > 0 && (
          <DevelopmentPreview
            category={activeDevelopmentCategory}
            students={studentsData.map((s: ScoreType) => ({ studentId: s.studentId, studentName: s.studentName }))}
            ratingLegend={developmentRatingLegend}
            ratings={developmentRatings}
            onRatingChange={(studentId, columnId, value) => setDevelopmentEdits(prev => ({ ...prev, [`${studentId}-${columnId}`]: value }))}
            editable={status === "IN_PROGRESS" || status === "NOT_SUBMITTED" || status === "APPROVED_EDIT_ACCESS"}
            onSubmit={handleSubmitDevelopment}
            isSubmitting={isSubmittingDevelopment}
          />
        )}
      </div>
    </SubjectReportPermissionWrapper>
  );
}
