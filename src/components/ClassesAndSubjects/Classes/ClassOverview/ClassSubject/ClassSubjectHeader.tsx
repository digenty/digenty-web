"use client";

import { ShareBox } from "@digenty/icons";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export const ClassSubjectHeader = ({ onExport }: { onExport?: () => void }) => {
  const params = useSearchParams();
  const classArmName = params.get("classArmName") || "";
  const subjectName = params.get("subject") || "";

  return (
    <div className="border-border-default flex w-full flex-col justify-between border-b py-2 align-middle md:flex-row md:pb-2">
      <div className="border-border-default flex items-center border-b px-4 pb-2 md:border-none md:px-8 md:pb-0">
        <h2 className="text-text-default text-lg font-semibold capitalize">
          {classArmName.replaceAll("-", " ")}, {subjectName.replaceAll("-", " ").toLowerCase()}
        </h2>
      </div>

      <div className="w-full px-4 pt-2 md:w-auto md:px-8 md:pt-0">
        <Button
          onClick={onExport}
          className="border-border-darker bg-bg-state-secondary text-text-default h-8! w-full rounded-md border px-2! text-sm font-medium"
        >
          <ShareBox fill="var(--color-icon-default-muted)" className="size-4" />
          Export
        </Button>
      </div>
    </div>
  );
};
