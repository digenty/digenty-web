"use client";

import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useEffect, useState } from "react";
import Calendar from "../Icons/Calendar";
import School from "../Icons/School";
import { MobileDrawer } from "../MobileDrawer";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useBreadcrumbStore } from "@/store/breadcrumb";
import { Branch, BranchWithClassLevels, Term } from "@/api/types";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";

export default function DashboardHeader({
  branchSelected,
  setBranchSelected,
  termSelected,
  setTermSelected,
}: {
  branchSelected: Branch | null;
  setBranchSelected: React.Dispatch<React.SetStateAction<Branch | null>>;
  termSelected: Term | null;
  setTermSelected: React.Dispatch<React.SetStateAction<Term | null>>;
}) {
  const user = useLoggedInUser();
  const { setBreadcrumbs } = useBreadcrumbStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { data: branches, isPending: loadingBranches } = useGetBranches();
  const { data: terms, isPending: loadingTerms } = useGetTerms(user.schoolId);
  const [activeSession, setActiveSession] = useState<string | null>(null);

  useEffect(() => {
    setBreadcrumbs([{ label: "Dashboard", url: "/staff/" }]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    if (terms) {
      const activeTerm = terms.data.terms.find((term: Term) => term.isActiveTerm);
      if (activeTerm && setTermSelected && !termSelected) {
        setTermSelected(activeTerm);
      }
      setActiveSession(terms.data.academicSessionName);
    }
  }, [terms, setTermSelected, termSelected]);

  return (
    <div>
      <div className="flex w-full justify-between align-middle">
        <h2 className="text-text-default text-lg font-semibold md:text-2xl">Overview</h2>

        <div className="hidden gap-1 align-middle md:flex">
          {!terms || loadingTerms ? (
            <Skeleton className="bg-bg-input-soft h-8 w-[140px]" />
          ) : (
            <Select
              value={termSelected ? String(termSelected.termId) : undefined}
              onValueChange={value => {
                const term = terms.data.terms?.find((term: Term) => term.termId === Number(value));
                setTermSelected(term || null);
              }}
            >
              <SelectTrigger className="border-border-darker h-8 w-auto border focus-visible:ring-0">
                <div className="flex items-center gap-2">
                  <Calendar fill="var(--color-icon-black-muted )" className="size-4" />
                  <span className="text-text-default text-sm font-semibold capitalize">
                    {activeSession} {termSelected?.term.toLowerCase()}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                {terms.data.terms.map((term: Term) => (
                  <SelectItem key={term.termId} value={String(term.termId)} className="text-text-default text-sm font-semibold capitalize">
                    {activeSession} {term.term.toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {!branches || loadingBranches ? (
            <Skeleton className="bg-bg-input-soft h-8 w-[140px]" />
          ) : (
            <Select
              value={branchSelected ? String(branchSelected.id) : "none"}
              onValueChange={value => {
                if (value === "none") {
                  setBranchSelected(null);
                  return;
                }
                const branch = branches.data?.find((branch: BranchWithClassLevels) => branch.branch.id === Number(value));
                setBranchSelected(branch?.branch || null);
              }}
            >
              <SelectTrigger className="border-border-darker h-8 w-auto border focus-visible:ring-0">
                <div className="flex items-center gap-2">
                  <Image src="/icons/school.svg" alt="branch" width={14} height={14} />
                  <span className="text-text-default text-sm font-semibold">{branchSelected ? branchSelected.name : "All Branches"}</span>
                </div>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                <SelectItem value="none" className="text-text-default text-sm font-semibold">
                  All Branches
                </SelectItem>
                {branches.data.map((branch: BranchWithClassLevels) => (
                  <SelectItem key={branch.branch.id} value={String(branch.branch.id)} className="text-text-default text-sm font-semibold">
                    {branch.branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <Button className="bg-bg-state-soft block size-7 rounded-md p-1.5 md:hidden" onClick={() => setIsFilterOpen(true)}>
          <Image src="/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
        </Button>

        <MobileDrawer open={isFilterOpen} setIsOpen={setIsFilterOpen} title="Filter">
          <div className="flex w-full flex-col gap-4 px-3 py-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar fill="var(--color-icon-black-muted)" className="size-4" />
                <Label className="text-text-default text-sm font-medium">Period</Label>
              </div>
              {!terms || loadingTerms ? (
                <Skeleton className="bg-bg-input-soft h-9 w-full" />
              ) : (
                <Select
                  value={termSelected ? String(termSelected.termId) : undefined}
                  onValueChange={value => {
                    const term = terms.data.terms?.find((term: Term) => term.termId === Number(value));
                    setTermSelected(term || null);
                  }}
                >
                  <SelectTrigger className="bg-bg-input-soft text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal focus-visible:ring-0">
                    <span className="text-text-default text-sm capitalize">
                      {activeSession} {termSelected?.term.toLowerCase()}
                    </span>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-default border-border-default">
                    {terms.data.terms.map((term: Term) => (
                      <SelectItem key={term.termId} value={String(term.termId)} className="text-text-default text-sm capitalize">
                        {activeSession} {term.term.toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <School fill="var(--color-icon-black-muted)" className="size-4" />
                <Label className="text-text-default text-sm font-medium">Branch</Label>
              </div>
              {!branches || loadingBranches ? (
                <Skeleton className="bg-bg-input-soft h-9 w-full" />
              ) : (
                <Select
                  value={branchSelected ? String(branchSelected.id) : "none"}
                  onValueChange={value => {
                    if (value === "none") {
                      setBranchSelected(null);
                      return;
                    }
                    const branch = branches.data?.find((branch: BranchWithClassLevels) => branch.branch.id === Number(value));
                    setBranchSelected(branch?.branch || null);
                  }}
                >
                  <SelectTrigger className="bg-bg-input-soft text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal! focus-visible:ring-0">
                    <span className="text-text-default text-sm">{branchSelected ? branchSelected.name : "All Branches"}</span>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-default border-border-default">
                    <SelectItem value="none" className="text-text-default text-sm">
                      All Branches
                    </SelectItem>
                    {branches.data.map((branch: BranchWithClassLevels) => (
                      <SelectItem key={branch.branch.id} value={String(branch.branch.id)} className="text-text-default text-sm">
                        {branch.branch.name}
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

              <Button className="bg-bg-state-primary text-text-white-default rounded-md! px-4 py-2 text-sm tracking-[0.1rem]">
                <span>Apply Filter</span>
                <span className="bg-bg-badge-white border-border-white rounded-sm px-1.5 py-0.5 text-xs">2</span>
              </Button>
            </div>
          </DrawerFooter>
        </MobileDrawer>
      </div>
    </div>
  );
}
