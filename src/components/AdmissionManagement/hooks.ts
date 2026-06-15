"use client";

import { useGetAdmissionCycles } from "@/hooks/queryHooks/useAdmission";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { BranchWithClassLevels } from "@/api/types";

/** Resolves the single ACTIVE admission cycle the dashboard / applicants / payments tabs operate on. */
export const useActiveAdmissionCycle = () => {
  const { data, isPending, isError, refetch } = useGetAdmissionCycles();
  const cycle = data?.find(c => c.status === "ACTIVE");
  return { cycle, isPending, isError, refetch };
};

export interface BranchOption {
  id?: number;
  name: string;
}

/** Branch options for the "filter by branch" selects, prefixed with an "All Branches" sentinel (id undefined). */
export const useAdmissionBranchOptions = (): { options: BranchOption[]; isPending: boolean } => {
  const { data, isPending } = useGetBranches();
  const branches: BranchWithClassLevels[] = data?.data ?? [];
  const options: BranchOption[] = [{ name: "All Branches" }, ...branches.map(b => ({ id: b.branch.id, name: b.branch.name ?? "Branch" }))];
  return { options, isPending };
};
