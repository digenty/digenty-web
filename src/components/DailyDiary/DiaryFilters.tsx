"use client";

import { Calendar, School } from "@digenty/icons";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { BranchWithClassLevels, Term } from "@/api/types";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
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

/**
 * Branch + term pickers shown in the Daily Diary page header. Desktop shows them inline; mobile
 * collapses both into the app's standard filter icon + bottom-sheet drawer (see AttendanceHeader).
 */
export const DiaryFilters = ({ branchId, onBranchChange, termId, onTermChange }: Props) => {
  const user = useLoggedInUser();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
  const termLabel = selectedTerm ? `${sessionName} ${selectedTerm.toLowerCase()} term` : "Select term";

  return (
    <>
      <div className="hidden items-center gap-2 md:flex">
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
                <span className="text-text-default text-sm font-medium capitalize">{termLabel}</span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-bg-card! border-border-default border">
              {terms.map(term => (
                <SelectItem key={term.termId} value={String(term.termId)} className="text-text-default text-sm capitalize">
                  {sessionName} {term.term.toLowerCase()} term
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Button className="bg-bg-state-soft flex size-7 items-center justify-center rounded-md p-1.5 md:hidden" onClick={() => setIsFilterOpen(true)}>
        <Image src="/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
      </Button>

      <MobileDrawer open={isFilterOpen} setIsOpen={setIsFilterOpen} title="Filter">
        <div className="flex w-full flex-col gap-4 p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <School fill="var(--color-icon-black-muted)" className="size-4" />
              <Label className="text-text-default text-sm font-medium">Branch</Label>
            </div>
            {loadingBranches ? (
              <Skeleton className="bg-bg-input-soft h-9 w-full" />
            ) : (
              <Select value={branchId ? String(branchId) : undefined} onValueChange={value => onBranchChange(Number(value))}>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                  <span className="text-text-default text-sm">{selectedBranch ?? "All branches"}</span>
                </SelectTrigger>
                <SelectContent className="bg-bg-card! border-border-default">
                  {branches.map(item => (
                    <SelectItem key={item.branch?.id} value={String(item.branch?.id)} className="text-text-default text-sm">
                      {item.branch?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar fill="var(--color-icon-black-muted)" className="size-4" />
              <Label className="text-text-default text-sm font-medium">Term</Label>
            </div>
            {loadingTerms ? (
              <Skeleton className="bg-bg-input-soft h-9 w-full" />
            ) : (
              <Select value={termId ? String(termId) : undefined} onValueChange={value => onTermChange(Number(value))}>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
                  <span className="text-text-default text-sm font-medium capitalize">{termLabel}</span>
                </SelectTrigger>
                <SelectContent className="bg-bg-card! border-border-default">
                  {terms.map(term => (
                    <SelectItem key={term.termId} value={String(term.termId)} className="text-text-default text-sm capitalize">
                      {sessionName} {term.term.toLowerCase()} term
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <DrawerFooter className="border-border-default border-t">
          <div className="flex justify-between">
            <DrawerClose asChild>
              <Button className="bg-bg-state-soft text-text-subtle rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
            </DrawerClose>
            <Button
              onClick={() => setIsFilterOpen(false)}
              className="bg-bg-state-primary text-text-white-default rounded-md! px-4 py-2 text-sm tracking-[0.1rem]"
            >
              Apply Filter
            </Button>
          </div>
        </DrawerFooter>
      </MobileDrawer>
    </>
  );
};
