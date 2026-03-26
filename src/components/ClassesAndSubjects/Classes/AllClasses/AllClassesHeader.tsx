"use client";

import { Term } from "@/api/types";
import Calendar from "@/components/Icons/Calendar";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Toggle } from "@/components/Toggle";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import Image from "next/image";
import { useEffect, useState } from "react";

interface AllClassesHeaderProps {
  termSelected: Term | null;
  setTermSelected: React.Dispatch<React.SetStateAction<Term | null>>;
  isLoadingTerms?: boolean;
  activeSession: string | null;
  setActiveSession: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AllClassesHeader = ({ termSelected, setTermSelected, activeSession, setActiveSession }: AllClassesHeaderProps) => {
  const [draft, setDraft] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const user = useLoggedInUser();

  useBreadcrumb([
    {
      label: "Classes and Subjects",
      url: "/staff/classes-and-subjects/all-classes",
    },
    {
      label: "All Classes",
      url: "/staff/classes-and-subjects/all-classes",
    },
  ]);

  const { data: terms, isPending: loadingTerms } = useGetTerms(user.schoolId);

  useEffect(() => {
    if (terms) {
      const activeTerm = terms.data.terms.find((term: Term) => term.isActiveTerm);
      setTermSelected(activeTerm);
      setActiveSession(terms.data.academicSessionName);
    }
  }, [setActiveSession, setTermSelected, terms]);

  return (
    <div className="border-border-default border-b">
      <div className="flex w-full items-center justify-between px-4 py-2.5 md:px-8">
        <h2 className="text-text-default text-lg font-semibold md:text-xl">All Classes</h2>

        <div className="flex items-center gap-2">
          <Toggle label={draft ? "Live" : "Not Live"} checked={draft} onChange={e => setDraft(e.target.checked)} />

          <div className="hidden gap-1 align-middle md:flex">
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
            <Image src="/staff/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
          </Button>
        </div>

        <MobileDrawer open={isFilterOpen} setIsOpen={setIsFilterOpen} title="Filter">
          <div className="flex w-full flex-col gap-4 px-3 py-4">
            {!terms && loadingTerms ? (
              <Skeleton className="bg-bg-input-soft h-9 w-full" />
            ) : (
              <div className="space-y-4">
                {terms.data.terms.map((term: Term) => (
                  <p
                    key={term.termId}
                    onClick={() => setTermSelected(term)}
                    className={`text-text-default cursor-pointer px-3 pl-9 text-sm ${termSelected?.termId === term.termId ? "font-semibold" : ""}`}
                  >
                    {term.term}
                  </p>
                ))}
              </div>
            )}
          </div>

          <DrawerFooter className="border-border-default border-t">
            <div className="flex justify-between">
              <DrawerClose asChild>
                <Button className="bg-bg-state-soft text-text-subtle h-8! rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button
                  className="bg-bg-state-primary text-text-white-default h-8! rounded-md! px-4 py-2 text-sm tracking-[0.1rem]"
                  // onClick={() => pendingTermId && onTermChange(pendingTermId)}
                >
                  Apply
                </Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </MobileDrawer>
      </div>
    </div>
  );
};
