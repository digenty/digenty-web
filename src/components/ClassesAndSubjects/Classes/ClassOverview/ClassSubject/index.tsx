"use client";
import { ScoreViewBySubject } from "@/components/ScoreViewBySubject";
import { ScoreType } from "@/components/ScoreViewBySubject/types";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { ClassSubjectHeader } from "./ClassSubjectHeader";

const tableData: ScoreType = {
  id: 1,
  studentName: "Damilare John",
  ca1Score: 0,
  ca2Score: 0,
  examScore: 0,
  totalScore: 0,
  grade: "F",
  remark: "Fail",
};

const scores: ScoreType[] = Array.from({ length: 12 }, (_, index) => ({
  ...tableData,
  id: index + 1,
}));

export const SubjectByClass = () => {
  useBreadcrumb([
    { label: "Classes and Subjects", url: "/classes-and-subjects" },
    { label: "Classes", url: `/classes-and-subjects` },
    { label: "My Class", url: "/classes-and-subjects" },
    { label: "View Score", url: "" },
  ]);

  return (
    <div className="space-y-4">
      <ClassSubjectHeader />
      <div className="px-4 md:px-8">
        <ScoreViewBySubject scores={scores} />
      </div>
    </div>
  );
};
