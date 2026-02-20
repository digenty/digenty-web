"use client";

import { Branch, Term } from "@/api/types";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetTerms } from "@/hooks/queryHooks/useTerms";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Calendar from "../Icons/Calendar";
import School from "../Icons/School";
import { MobileDrawer } from "../MobileDrawer";
import { Button } from "../ui/button";
import { DrawerClose, DrawerFooter } from "../ui/drawer";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { Skeleton } from "../ui/skeleton";

export const AttendanceHeader = ({
  branchSelected,
  setBranchSelected,
  termSelected,
  setTermSelected,
  activeSession,
  setActiveSession,
}: {
  branchSelected: Branch | null;
  setBranchSelected: React.Dispatch<React.SetStateAction<Branch | null>>;
  termSelected: Term | null;
  setTermSelected: React.Dispatch<React.SetStateAction<Term | null>>;
  activeSession: string | null;
  setActiveSession: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const user = useLoggedInUser();

  const { data: branches, isPending: loadingBranches } = useGetBranches();
  const { data: terms, isPending: loadingTerms } = useGetTerms(user.schoolId);

  useEffect(() => {
    if (terms) {
      const activeTerm = terms.data.terms.find((term: Term) => term.isActiveTerm);
      setTermSelected(activeTerm);
      setActiveSession(terms.data.academicSessionName);
    }
  }, [setActiveSession, setTermSelected, terms]);

  return (
    <div className="border-border-default flex w-full items-center justify-between border-b px-4 py-2 align-middle md:px-8 md:py-3">
      <h2 className="text-text-default text-lg font-semibold md:text-xl">Attendance Management</h2>

      <div className="hidden gap-2 align-middle md:flex">
        {!branches || loadingBranches ? (
          <Skeleton className="bg-bg-input-soft h-9 w-full" />
        ) : (
          <Select
            onValueChange={value => {
              const branch = branches.data.content?.find((branch: Branch) => branch.id === Number(value));
              setBranchSelected(branch);
            }}
          >
            <SelectTrigger className="border-border-darker h-8! w-fit border focus-visible:ring-0">
              <School fill="var(--color-icon-default-muted)" className="size-3" />
              <span className="text-text-default text-sm font-medium">{branchSelected ? branchSelected?.name : "All Branches"}</span>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default">
              <SelectItem value="none" className="text-text-default text-sm font-medium">
                All Branches
              </SelectItem>
              {branches.data.content.map((branch: Branch) => (
                <SelectItem key={branch.id} value={String(branch.id)} className="text-text-default text-sm font-medium">
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {!terms || loadingTerms ? (
          <Skeleton className="bg-bg-input-soft h-9 w-full" />
        ) : (
          <Select
            onValueChange={value => {
              const term = terms.data.terms?.find((term: Term) => term.termId === Number(value));
              setTermSelected(term);
            }}
          >
            <SelectTrigger className="border-border-darker h-8! w-fit border focus-visible:ring-0">
              <Calendar fill="var(--color-icon-default-muted )" className="size-4" />
              <span className="text-text-default text-sm font-medium capitalize">
                {activeSession} {termSelected?.term.toLowerCase()}
              </span>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default">
              {terms.data.terms.map((term: Term) => (
                <SelectItem key={term.termId} value={String(term.termId)} className="text-text-default text-sm font-medium capitalize">
                  {activeSession} {term.term.toLowerCase()}
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
        <div className="flex w-full flex-col gap-4 p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <School fill="var(--color-icon-black-muted)" className="size-4" />
              <Label className="text-text-default text-sm font-medium">Branch</Label>
            </div>
            {!branches || loadingBranches ? (
              <Skeleton className="bg-bg-input-soft h-9 w-full" />
            ) : (
              <Select
                onValueChange={value => {
                  const branch = branches.data.content?.find((branch: Branch) => branch.id === Number(value));
                  setBranchSelected(branch);
                }}
              >
                <SelectTrigger className="bg-bg-input-soft text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                  <span className="text-text-default text-sm">{branchSelected?.name}</span>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {branches.data.content.map((branch: Branch) => (
                    <SelectItem key={branch.id} value={String(branch.id)} className="text-text-default text-sm">
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {!terms || loadingTerms ? (
            <Skeleton className="bg-bg-input-soft h-9 w-full" />
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar fill="var(--color-icon-black-muted)" className="size-4" />
                <Label className="text-text-default text-sm font-medium">Period</Label>
              </div>
              <Select
                onValueChange={value => {
                  const term = terms.data.terms?.find((term: Term) => term.termId === Number(value));
                  setTermSelected(term);
                }}
              >
                <SelectTrigger className="bg-bg-input-soft text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
                  <span className="text-text-default text-sm font-medium capitalize">
                    {activeSession} {termSelected?.term.toLowerCase()}
                  </span>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {terms.data.terms.map((term: Term) => (
                    <SelectItem key={term.termId} value={String(term.termId)} className="text-text-default text-sm font-medium capitalize">
                      {activeSession} {term.term.toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
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
              <span>Apply Filter</span>
              <span className="bg-bg-badge-white border-border-white rounded-sm px-1.5 py-0.5 text-xs">2</span>
            </Button>
          </div>
        </DrawerFooter>
      </MobileDrawer>
    </div>
  );
};
