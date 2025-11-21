"use client";

import FileList2 from "@/components/Icons/FileList2";
import { Button } from "@/components/ui/button";

export const ClassOverviewHeader = () => {
  return (
    <div className="md:border-border-default flex w-full justify-between pb-3 align-middle md:border-b">
      <h2 className="text-text-default text-lg font-semibold md:text-2xl">Class Overview</h2>

      <Button
        className="border-border-darker bg-bg-state-secondary text-text-default h-8! rounded-md border px-2! text-sm font-medium"
        onClick={() => setIsFilterOpen(true)}
      >
        <FileList2 fill="var(--color-icon-default-muted)" className="size-4" />
        Class Report
      </Button>
    </div>
  );
};
