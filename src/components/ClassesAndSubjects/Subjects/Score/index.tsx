"use client";

import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { ScoreProps } from "./types";

import { ScoreViewBySubject } from "@/components/ScoreViewBySubject";
import ScoresHeader from "./ScoresHeader";

const tableData: ScoreProps = {
  id: 1,
  studentName: "Damilare John",
  ca1Score: 0,
  ca2Score: 0,
  examScore: 0,
  totalScore: 0,
  grade: "F",
  remark: "Fail",
};

const StudentsItem: ScoreProps[] = Array.from({ length: 12 }, (_, index) => ({
  ...tableData,
  id: index + 1,
}));

export default function Score() {
  useBreadcrumb([
    { label: "Classes and Subjects", url: "/classes-and-subjects" },
    { label: "My Subjects", url: "/classes-and-subjects?tab=subjects" },
    { label: "Score Input", url: "" },
  ]);

  return (
    <div className="flex w-full flex-col gap-5">
      <ScoresHeader />
      <div className="px-4 md:px-8">
        <ScoreViewBySubject scores={StudentsItem} isEditable />
      </div>
    </div>
  );
}
