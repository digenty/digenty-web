"use client";

import { FileList2 } from "@digenty/icons";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

export const ClassOverviewHeader = ({ classArmName, classId }: { classArmName: string; classId: number }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="md:border-border-default flex w-full items-center justify-between align-middle md:border-b md:pb-3">
      <h2 className="text-text-default text-lg font-semibold md:text-xl">Class Overview</h2>

      <Button
        className="border-border-darker bg-bg-state-secondary text-text-default h-8! rounded-md border px-2! text-sm font-medium"
        onClick={() => router.push(`${pathname}/class-report/${classId}?classArmName=${classArmName.replaceAll(" ", "-")}`)}
      >
        <FileList2 fill="var(--color-icon-default-muted)" className="size-4" />
        Class Report
      </Button>
    </div>
  );
};
