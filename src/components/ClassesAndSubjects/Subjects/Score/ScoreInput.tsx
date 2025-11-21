"use client";

import ScoreTable from "./ScoreTable";

import ScoresHeader from "./ScoresHeader";

export default function ScoreInput() {
  return (
    <div className="flex w-full flex-col gap-5">
      <ScoresHeader />
      <ScoreTable />
    </div>
  );
}
