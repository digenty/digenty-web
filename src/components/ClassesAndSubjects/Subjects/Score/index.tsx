"use client";

import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { ScoreTable } from "./ScoreTable";

import ScoresHeader from "./ScoresHeader";

export default function Score() {
  useBreadcrumb([
    { label: "Classes and Subjects", url: "/classes-and-subjects" },
    { label: "My Subjects", url: "/classes-and-subjects?tab=students" },
    { label: "Score Input", url: "" },
  ]);

  return (
    <div className="flex w-full flex-col gap-5">
      <ScoresHeader />
      <div className="px-4 md:px-8">
        <ScoreTable />
      </div>
    </div>
  );
}
