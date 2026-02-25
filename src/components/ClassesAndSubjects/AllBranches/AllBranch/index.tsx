"use client";

import React, { useState } from "react";
import { OverviewStats } from "./OverviewStats";
import { AllBranchesTable } from "./AllBranchesTable";
import { useGetAllBranchesDetails } from "@/hooks/queryHooks/useBranch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Calendar from "@/components/Icons/Calendar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Label } from "@/components/ui/label";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { useGetAllTerms } from "@/hooks/queryHooks/useTerm";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { Terms } from "@/api/types";
import { Skeleton } from "@/components/ui/skeleton";

export const AllBranches = () => {
  const user = useLoggedInUser();
  const schoolId = user?.schoolId;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [termSelected, setTermSelected] = useState<number | null>(null);
  const { data: terms, isFetching: isLoadingTerm } = useGetAllTerms(schoolId!);
  const termList = terms?.terms;
  const activeTerm = termList?.find((t: Terms) => t.isActiveTerm);
  const effectiveTermId = termSelected ?? activeTerm?.termId;
  const { data: allBranchList, isFetching } = useGetAllBranchesDetails(effectiveTermId!);
  const [mobileTempTerm, setMobileTempTerm] = useState<number | null>(null);
  console.log(allBranchList);
  const handleApplyFilter = () => {
    if (mobileTempTerm !== null) setTermSelected(mobileTempTerm);
    setIsFilterOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:px-8">
      <div className="flex items-center justify-between">
        <div className="text-text-default text-xl font-semibold">All Branches</div>

        <div className="">
          {isLoadingTerm || !termList ? (
            <Skeleton className="bg-bg-input-soft h-8 w-40" />
          ) : (
            <div className="hidden gap-1 align-middle md:flex">
              <Select value={String(effectiveTermId ?? "")} onValueChange={val => setTermSelected(Number(val))}>
                <SelectTrigger className="border-border-darker h-8 w-auto border">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <Calendar fill="var(--color-icon-black-muted)" className="size-4" />
                      <span className="text-text-default text-sm font-semibold">
                        {termList?.find((t: Terms) => t.termId === effectiveTermId)?.term.toLocaleUpperCase() ?? "Select Term"} TERM
                      </span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-border-default">
                  {termList?.map((term: Terms) => (
                    <SelectItem key={term.termId} value={String(term.termId)} className="text-text-default text-sm font-semibold">
                      {term.term} TERM
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {!termList ? null : (
            <Button
              className="bg-bg-state-soft block size-7 rounded-md p-1.5 md:hidden"
              onClick={() => {
                setMobileTempTerm(effectiveTermId ?? null);
                setIsFilterOpen(true);
              }}
            >
              <Image src="/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
            </Button>
          )}

          <MobileDrawer open={isFilterOpen} setIsOpen={setIsFilterOpen} title="Filter">
            <div className="flex w-full flex-col gap-4 px-3 py-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar fill="var(--color-icon-black-muted)" className="size-4" />
                  <Label className="text-text-default text-sm font-medium">Period</Label>
                </div>
                <Select value={String(mobileTempTerm ?? effectiveTermId ?? "")} onValueChange={val => setMobileTempTerm(Number(val))}>
                  <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
                    <SelectValue>
                      <span className="text-text-default text-sm">
                        {termList?.find((t: Terms) => t.termId === (mobileTempTerm ?? effectiveTermId))?.term ?? "Select Term"}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-default border-border-default">
                    {termList?.map((term: Terms) => (
                      <SelectItem key={term.termId} value={String(term.termId)} className="text-text-default text-sm">
                        {term.term}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DrawerFooter className="border-border-default border-t">
              <div className="flex justify-between">
                <DrawerClose asChild>
                  <Button className="bg-bg-state-soft text-text-subtle rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
                </DrawerClose>

                <Button
                  onClick={handleApplyFilter}
                  className="bg-bg-state-primary text-text-white-default rounded-md! px-4 py-2 text-sm tracking-[0.1rem]"
                >
                  <span>Apply Filter</span>
                </Button>
              </div>
            </DrawerFooter>
          </MobileDrawer>
        </div>
      </div>

      <OverviewStats stats={allBranchList} />
      <AllBranchesTable allBranchList={allBranchList?.branchReports} isFetching={isFetching} />
    </div>
  );
};
