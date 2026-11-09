import { School } from "@digenty/icons";
import { Branch, BranchWithClassLevels } from "@/api/types";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

// Shared between the Academic Setup wizard and the regular Academic settings tabs — any "branch specific"
// section picks the branch to scope its data to via this. Only defaults `activeBranch` to the first branch
// once, and only while nothing is selected yet, so a background refetch of the branch list never silently
// snaps the user's selection back to branch #1.
export function BranchTabs({ activeBranch, setActiveBranch }: { activeBranch: Branch | null; setActiveBranch: (t: Branch | null) => void }) {
  const { data: branchesData, isFetching: isLoadingBranches } = useGetBranches();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (branchesData?.data?.length > 0 && !activeBranch) {
      setActiveBranch(branchesData.data[0].branch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchesData]);

  if (isMobile) {
    return (
      <div className="w-full">
        {isLoadingBranches || !branchesData ? (
          <Skeleton />
        ) : (
          <Select
            value={activeBranch?.name || ""}
            onValueChange={value => {
              const branch = branchesData?.data?.find((branch: BranchWithClassLevels) => branch?.branch?.name === value);
              setActiveBranch(branch?.branch || null);
            }}
          >
            <Label className="text-text-default mb-2 text-sm font-medium">
              {" "}
              <School fill="var(--color-icon-default-muted)" /> Select Branch
            </Label>
            <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
              <SelectValue>
                <span className="text-text-default text-sm">{activeBranch?.name}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-default border-border-default">
              {branchesData?.data?.map((branch: BranchWithClassLevels) => (
                <SelectItem key={branch.branch.name} value={branch.branch.name || ""} className="text-text-default text-sm">
                  {branch.branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    );
  }

  return (
    <div className="flex w-auto max-w-64 items-center gap-3">
      {isLoadingBranches && <Skeleton className="h-9 w-1/2" />}
      {branchesData?.data?.map((branch: BranchWithClassLevels) => {
        const isActive = activeBranch?.name === branch.branch.name;

        return (
          <Button
            key={branch.branch.name}
            type="button"
            onClick={() => setActiveBranch(branch?.branch)}
            className={cn(
              "hover:bg-bg-none! w-1/2 cursor-pointer rounded-none py-2.5 text-center transition-all duration-150",
              isActive && "border-border-informative border-b-[1.5px]",
            )}
          >
            <span className={cn("text-sm font-medium", isActive ? "text-text-informative" : "text-text-muted")}>{branch.branch.name}</span>
          </Button>
        );
      })}
    </div>
  );
}
