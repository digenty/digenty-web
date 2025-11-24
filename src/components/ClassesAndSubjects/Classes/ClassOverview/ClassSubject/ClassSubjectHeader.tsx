"use client";

import ShareBox from "@/components/Icons/ShareBox";
import { Button } from "@/components/ui/button";

export const ClassSubjectHeader = () => {
  return (
    <div className="border-border-default flex w-full flex-col justify-between border-b py-2 align-middle md:flex-row md:pb-2">
      <div className="border-border-default flex items-center border-b px-4 pb-2 md:border-none md:px-8 md:pb-0">
        <h2 className="text-text-default text-lg font-semibold md:text-2xl">JSS 3A, English Language</h2>
      </div>

      <div className="w-full px-4 pt-2 md:w-auto md:px-8 md:pt-0">
        <Button
          className="border-border-darker bg-bg-state-secondary text-text-default h-8! w-full rounded-md border px-2! text-sm font-medium"
          // onClick={() => setIsFilterOpen(true)}
        >
          <ShareBox fill="var(--color-icon-default-muted)" className="size-4" />
          Export
        </Button>
      </div>
    </div>
  );
};
