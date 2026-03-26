"use client";

import FileList2 from "@/components/Icons/FileList2";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

export const ClassOverviewHeader = ({ classArmName }: { classArmName: string }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="md:border-border-default flex w-full items-center justify-between align-middle md:border-b md:pb-3">
      <h2 className="text-text-default text-lg font-semibold md:text-xl">Class Overview</h2>

      <Button
        className="border-border-darker bg-bg-state-secondary text-text-default h-8! rounded-md border px-2! text-sm font-medium"
        onClick={() => router.push(`${pathname}/class-report?classArmName=${classArmName.replace(" ", "-")}`)}
      >
        <FileList2 fill="var(--color-icon-default-muted)" className="size-4" />
        Class Report
      </Button>
    </div>
  );
};
