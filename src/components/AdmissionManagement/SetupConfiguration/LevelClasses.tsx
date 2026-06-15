"use client";

import { ClassSummaryDto, LevelSummaryDto } from "@/api/admission";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLevelClasses } from "@/hooks/queryHooks/useAdmission";
import { cn } from "@/lib/utils";
import { ArrowLeft, Edit, Settings4 } from "@digenty/icons";
import { useRouter } from "next/navigation";

interface Props {
  cycleId: number;
  level: LevelSummaryDto;
  branchId?: number;
}

const buildQuery = (branchId?: number) => (branchId ? `?branchId=${branchId}` : "");

export const LevelClasses = ({ cycleId, level, branchId }: Props) => {
  const router = useRouter();
  const { data: classes = [], isPending, isError, refetch } = useGetLevelClasses(cycleId, level.classLevelId, branchId);
  const configured = level.status === "CONFIGURED";

  const baseUrl = `/staff/admission-management/setup/${cycleId}/levels/${level.classLevelId}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.back()}
            className="border-border-darker text-text-default bg-bg-state-secondary hover:bg-bg-state-secondary-hover! flex shrink-0 items-center gap-1.5 border text-sm font-medium transition-colors"
          >
            <ArrowLeft fill="var(--color-icon-default-subtle)" className="size-4 shrink-0" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <h2 className="text-text-default text-base font-semibold">{level.levelName}</h2>
            <Badge
              className={cn(
                "border-border-default w-fit rounded-md border px-2 py-0.5 text-xs font-medium",
                configured ? "bg-bg-badge-green text-bg-basic-green-strong" : "bg-bg-badge-orange text-bg-basic-orange-strong",
              )}
            >
              {configured ? "Configured" : "Not Configured"}
            </Badge>
          </div>
        </div>

        <Button
          onClick={() => router.push(`${baseUrl}${buildQuery(branchId)}`)}
          className="border-border-darker text-text-default hover:bg-bg-state-secondary-hover! bg-bg-state-secondary! flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium"
        >
          <Edit fill="var(--color-icon-default-subtle)" className="size-4 shrink-0" />
          Edit Level Settings
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-text-default text-sm font-semibold">Classes in {level.levelName}</h3>

        {isPending ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex justify-center py-12">
            <ErrorComponent
              title="Couldn't load classes"
              description="Something went wrong while fetching classes for this level. Please try again."
              buttonText="Retry"
              onClick={() => refetch()}
            />
          </div>
        ) : classes.length === 0 ? (
          <div className="border-border-default flex flex-col items-center gap-2 rounded-xl border border-dashed py-12">
            <p className="text-text-default text-sm font-medium">No classes found</p>
            <p className="text-text-muted text-xs">There are no classes in this level yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {classes.map((klass: ClassSummaryDto) => (
              <div key={klass.classId} className="border-border-default bg-bg-subtle flex flex-col gap-4 rounded-xl border p-4">
                <div className="flex flex-col gap-2">
                  <p className="text-text-default text-sm font-semibold">{klass.className}</p>
                  <Badge
                    className={cn(
                      "border-border-default w-fit rounded-md border px-2 py-0.5 text-xs font-medium",
                      klass.usesLevelSettings ? "bg-bg-badge-green text-bg-basic-green-strong" : "bg-bg-badge-blue text-bg-basic-blue-strong",
                    )}
                  >
                    {klass.usesLevelSettings ? "Using level settings" : "Using customized settings"}
                  </Badge>
                </div>

                <Button
                  onClick={() => router.push(`${baseUrl}/classes/${klass.classId}${buildQuery(branchId)}`)}
                  className="border-border-darker bg-bg-state-secondary! text-text-default hover:bg-bg-state-secondary-hover! flex w-full items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium"
                >
                  <Settings4 fill="var(--color-icon-default-subtle)" className="size-3.5 shrink-0" />
                  Configure Class
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
