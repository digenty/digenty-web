"use client";

import { Calendar, School } from "@digenty/icons";
import { useEffect, useMemo } from "react";

import { BranchWithClassLevels, Term } from "@/api/types";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";

type Props = {
  branchId?: number;
  onBranchChange: (branchId: number | undefined) => void;
  termId?: number;
  onTermChange: (termId: number | undefined) => void;
};

/** Branch + term pickers shown in the Daily Diary page header (S1). */
export const DiaryFilters = ({ branchId, onBranchChange, termId, onTermChange }: Props) => {
  const user = useLoggedInUser();

  const { data: branchesData, isPending: loadingBranches } = useGetBranches();
  const { data: termsData, isPending: loadingTerms } = useGetTerms(user.schoolId);

  // Memoised so the auto-select effects below do not re-run on every render.
  const branches: BranchWithClassLevels[] = useMemo(() => branchesData?.data ?? [], [branchesData]);
  const terms: Term[] = useMemo(() => termsData?.data?.terms ?? [], [termsData]);
  const sessionName: string = termsData?.data?.academicSessionName ?? "";

  // Default to the staff member's own branch, then the active term, so the page lands on today's work.
  useEffect(() => {
    if (branchId || branches.length === 0) return;
    const ownBranchId = user.branchIds?.[0];
    const match = branches.find(b => b.branch?.id === ownBranchId) ?? branches[0];
    if (match?.branch?.id) onBranchChange(match.branch.id);
  }, [branches, branchId, user.branchIds, onBranchChange]);

  useEffect(() => {
    if (termId || terms.length === 0) return;
    const active = terms.find(term => term.isActiveTerm);
    if (active) onTermChange(active.termId);
  }, [terms, termId, onTermChange]);

  const selectedBranch = branches.find(b => b.branch?.id === branchId)?.branch?.name;
  const selectedTerm = terms.find(term => term.termId === termId)?.term;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {loadingBranches ? (
        <Skeleton className="bg-bg-input-soft h-8 w-32 rounded-md" />
      ) : (
        <Select value={branchId ? String(branchId) : undefined} onValueChange={value => onBranchChange(Number(value))}>
          <SelectTrigger className="border-border-darker h-8! w-auto border focus-visible:ring-0" aria-label="Filter by branch">
            <div className="flex items-center gap-1.5">
              <School fill="var(--color-icon-black-muted)" className="size-4" />
              <span className="text-text-default text-sm font-medium">{selectedBranch ?? "All branches"}</span>
            </div>
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default border">
            {branches.map(item => (
              <SelectItem key={item.branch?.id} value={String(item.branch?.id)} className="text-text-default text-sm">
                {item.branch?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {loadingTerms ? (
        <Skeleton className="bg-bg-input-soft h-8 w-40 rounded-md" />
      ) : (
        <Select value={termId ? String(termId) : undefined} onValueChange={value => onTermChange(Number(value))}>
          <SelectTrigger className="border-border-darker h-8! w-auto border focus-visible:ring-0" aria-label="Filter by term">
            <div className="flex items-center gap-1.5">
              <Calendar fill="var(--color-icon-black-muted)" className="size-4" />
              <span className="text-text-default text-sm font-medium capitalize">
                {selectedTerm ? `${sessionName} ${selectedTerm.toLowerCase()} term` : "Select term"}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default border">
            {terms.map(term => (
              <SelectItem key={term.termId} value={String(term.termId)} className="text-text-default text-sm capitalize">
                {sessionName} {term.term.toLowerCase()} term
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
