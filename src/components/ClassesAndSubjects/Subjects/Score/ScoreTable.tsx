"use client";

import { ScoreProps } from "./types";

import { ScoreViewBySubject } from "@/components/ScoreViewBySubject";

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

export const ScoreTable = () => {
  return (
    <div>
      <ScoreViewBySubject scores={StudentsItem} />
    </div>
  );
};
