"use client";

import { ScoreViewBySubject } from "@/components/ScoreViewBySubject";
import { ScoreType } from "@/components/ScoreViewBySubject/types";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const tableData: ScoreType = {
  studentId: 1,
  studentName: "Damilare John",
  CA1: 0,
  CA2: 0,
  examScore: 0,
  totalScore: 0,
  grade: "F",
  remark: "Fail",
};

const scores: ScoreType[] = Array.from({ length: 12 }, (_, index) => ({
  ...tableData,
  studentId: index + 1,
}));

export const ReportTable = () => {
  useBreadcrumb([
    { label: "All Classes", url: "/all-classes" },
    { label: `JSS 1A`, url: "" },
    { label: `English Language`, url: "" },
  ]);

  return (
    <div className="px-4 py-3">
      <ScoreViewBySubject scores={scores} />
    </div>
  );
};
