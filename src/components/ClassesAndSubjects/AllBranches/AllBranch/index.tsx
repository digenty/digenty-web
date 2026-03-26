"use client";

import React, { useEffect, useState } from "react";
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
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { Term, Terms } from "@/api/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import useDebounce from "@/hooks/useDebounce";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

export const AllBranches = () => {
  const user = useLoggedInUser();
  const schoolId = user?.schoolId;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [termSelected, setTermSelected] = useState<Term | null>(null);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data: terms, isFetching: isLoadingTerm } = useGetTerms(schoolId!);

  const { data: allBranchList, isPending, isError } = useGetAllBranchesDetails(termSelected?.termId, debouncedSearchQuery);

  useBreadcrumb([{ label: "All Branches", url: "/staff/classes-and-subjects/all-branches" }]);

  useEffect(() => {
    if (terms) {
      const activeTerm = terms.data.terms.find((term: Term) => term.isActiveTerm);
      setTermSelected(activeTerm);
      setActiveSession(terms.data.academicSessionName);
    }
  }, [setActiveSession, setTermSelected, terms]);

  return (
    <div className="flex flex-col gap-6 p-4 md:px-8">
      <div className="flex items-center justify-between">
        <div className="text-text-default text-xl font-semibold">All Branches</div>

        <div>
          <div className="hidden md:block">
            {!terms || isLoadingTerm ? (
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

          <Button
            className="bg-bg-state-soft block size-7 rounded-md p-1.5 md:hidden"
            onClick={() => {
              setIsFilterOpen(true);
            }}
          >
            <Image src="/staff/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
          </Button>

          <MobileDrawer open={isFilterOpen} setIsOpen={setIsFilterOpen} title="Filter">
            <div className="flex w-full flex-col gap-4 px-3 py-4">
              <div className="space-y-2">
                {!terms || isLoadingTerm ? (
                  <Skeleton className="bg-bg-input-soft h-9 w-full" />
                ) : (
                  <div className="flex flex-col gap-2">
                    {terms.data.terms.map((term: Term) => (
                      <Button
                        onClick={() => {
                          setTermSelected(term);
                        }}
                        key={term.termId}
                        value={String(term.termId)}
                        className="text-text-default justify-start text-sm font-medium capitalize"
                      >
                        {activeSession} {term.term.toLowerCase()}
                      </Button>
                    ))}
                  </div>
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
                  <span>Apply Filter</span>
                </Button>
              </div>
            </DrawerFooter>
          </MobileDrawer>
        </div>
      </div>

      <OverviewStats loadingStats={isPending} stats={allBranchList?.data} />
      {isError && (
        <div className="flex items-center justify-center pt-20">
          <ErrorComponent title="Error fetching all branches" description="This is our problem, we are looking into it so as to serve you better" />
        </div>
      )}
      {isPending && <Skeleton className="bg-bg-input-soft h-120 w-full" />}
      {!isPending && allBranchList && !isError && allBranchList?.data?.branchReports.length === 0 && (
        <ErrorComponent
          title="No branches found"
          description="No branches have been added to this school"
          buttonText="Add a branch"
          url="/staff/settings"
        />
      )}
      {allBranchList && !isPending && (
        <AllBranchesTable
          allBranchList={allBranchList?.data?.branchReports}
          isFetching={isPending}
          searchQuery={debouncedSearchQuery}
          setSearchQuery={setSearchQuery}
          isError={isError}
        />
      )}
    </div>
  );
};
