"use client";

import { CycleResponse, LevelSummaryDto } from "@/api/admission";
import { BranchWithClassLevels } from "@/api/types";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useGetCycleLevels, useSetCycleBranchSpecific } from "@/hooks/queryHooks/useAdmission";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { cn } from "@/lib/utils";
import { Bill, CheckboxCircleFill, Edit, Eye, Settings4 } from "@digenty/icons";
import { useState } from "react";
import { toast } from "sonner";
import { EditCycleModal } from "./SetupConfiguration/EditCycleModal";
import { SetGlobalFeesModal } from "./SetupConfiguration/SetGlobalFeesModal";

interface Props {
  cycle: CycleResponse;
  onConfigureLevel: (level: LevelSummaryDto, branchId?: number) => void;
  onViewClasses: (level: LevelSummaryDto, branchId?: number) => void;
}

export const AdmissionCycleSetup = ({ cycle, onConfigureLevel, onViewClasses }: Props) => {
  const [differsByBranch, setDiffersByBranch] = useState(cycle.branchSpecificRequirements);
  const [activeBranchId, setActiveBranchId] = useState<number | undefined>(undefined);
  const [isGlobalFeesOpen, setIsGlobalFeesOpen] = useState(false);
  const [isEditCycleOpen, setIsEditCycleOpen] = useState(false);

  const { data: branchesData } = useGetBranches();
  const branches: BranchWithClassLevels[] = branchesData?.data ?? [];

  const { mutate: setBranchSpecific } = useSetCycleBranchSpecific();

  // Only scope levels to a branch when branch-specific requirements are enabled.
  const branchId = differsByBranch ? activeBranchId : undefined;
  const { data: levels, isPending, isError, refetch } = useGetCycleLevels(cycle.id, branchId);

  const handleDiffersChange = (enabled: boolean) => {
    setDiffersByBranch(enabled);
    if (enabled && activeBranchId === undefined && branches.length > 0) setActiveBranchId(branches[0].branch.id);
    setBranchSpecific(
      { cycleId: cycle.id, payload: { enabled } },
      { onError: () => toast.error("Failed to update branch settings") },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-text-default text-xl font-semibold">{cycle.name}</h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsGlobalFeesOpen(true)}
            className="border-border-darker text-text-default hover:bg-bg-state-secondary-hover! bg-bg-state-secondary! flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium"
          >
            <Bill fill="var(--color-icon-default-subtle)" className="size-4 shrink-0" />
            Set Global Fees
          </Button>
          <Button
            onClick={() => setIsEditCycleOpen(true)}
            className="border-border-darker text-text-default hover:bg-bg-state-secondary-hover! bg-bg-state-secondary! flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium"
          >
            <Edit fill="var(--color-icon-default-subtle)" className="size-4 shrink-0" />
            Edit Cycle Details
          </Button>
        </div>
      </div>

      <div className="border-border-default flex items-center justify-between gap-4 rounded-xl border p-4">
        <div className="flex flex-col gap-0.5">
          <p className="text-text-default text-sm font-semibold">Do admission requirements differ by school branch?</p>
          <p className="text-text-muted text-xs font-normal">
            Turn ON if admission requirements vary across branches. Keep OFF to apply the same requirements to all branches.
          </p>
        </div>
        <Switch checked={differsByBranch} onCheckedChange={handleDiffersChange} className="shrink-0" />
      </div>

      {differsByBranch && branches.length > 0 && (
        <div className="bg-bg-state-soft flex w-fit flex-wrap items-center gap-2.5 rounded-full p-1">
          {branches.map(({ branch }) => (
            <button
              key={branch.id}
              onClick={() => setActiveBranchId(branch.id)}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                activeBranchId === branch.id
                  ? "border-border-darker bg-bg-state-secondary text-text-default border"
                  : "text-text-muted hover:text-text-subtle",
              )}
            >
              {activeBranchId === branch.id && <CheckboxCircleFill fill="#22c55e" className="size-4 shrink-0" />}
              {branch.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <h3 className="text-text-default text-sm font-semibold">Configure Requirements by Level</h3>

        {isPending ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-36 w-full rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex justify-center py-12">
            <ErrorComponent
              title="Couldn't load levels"
              description="Something went wrong while fetching levels for this cycle. Please try again."
              buttonText="Retry"
              onClick={() => refetch()}
            />
          </div>
        ) : levels.length === 0 ? (
          <div className="border-border-default flex flex-col items-center gap-2 rounded-xl border border-dashed py-12">
            <p className="text-text-default text-sm font-medium">No levels found</p>
            <p className="text-text-muted text-xs">There are no class levels to configure for this branch.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {levels.map(level => {
              const configured = level.status === "CONFIGURED";
              return (
                <div key={level.classLevelId} className="border-border-default bg-bg-subtle flex flex-col gap-4 rounded-xl border p-4">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-text-default text-sm font-semibold">{level.levelName}</p>
                    <p className="text-text-muted text-xs">{level.classCount} Classes</p>
                    <Badge
                      className={cn(
                        "border-border-default w-fit rounded-md border px-2 py-0.5 text-xs font-medium",
                        configured ? "bg-bg-badge-green text-bg-basic-green-strong" : "bg-bg-badge-orange text-bg-basic-orange-strong",
                      )}
                    >
                      {configured ? "Configured" : "Not Configured"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => onViewClasses(level, branchId)}
                      className="border-border-darker bg-bg-state-secondary! text-text-default hover:bg-bg-state-secondary-hover! flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium"
                    >
                      <Eye fill="var(--color-icon-default-subtle)" className="size-3.5 shrink-0" />
                      View Classes
                    </Button>
                    <Button
                      onClick={() => onConfigureLevel(level, branchId)}
                      className="border-border-darker bg-bg-state-secondary! text-text-default hover:bg-bg-state-secondary-hover! flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium"
                    >
                      <Settings4 fill="var(--color-icon-default-subtle)" className="size-3.5 shrink-0" />
                      Configure Level
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <SetGlobalFeesModal open={isGlobalFeesOpen} setOpen={setIsGlobalFeesOpen} cycleId={cycle.id} branchId={branchId} />
      <EditCycleModal open={isEditCycleOpen} setOpen={setIsEditCycleOpen} cycle={cycle} />
    </div>
  );
};
