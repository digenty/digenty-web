"use client";

import Calendar from "@/components/Icons/Calendar";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Toggle } from "@/components/Toggle";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useGetAllTerms } from "@/hooks/queryHooks/useTerm";
import { Terms } from "@/api/types";
import { Skeleton } from "@/components/ui/skeleton";

export const AllClassesHeader = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const schoolId = 36;
  const { data: terms, isLoading: isLoadingTerms } = useGetAllTerms(schoolId);

  const [draft, setDraft] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTermMobile, setSelectedTermMobile] = useState("");

  const currentTermId = searchParams.get("termId");
  const currentTerm = terms?.find((t: Terms) => t.termId.toString() === currentTermId);

  useEffect(() => {
    if (terms && terms.length > 0 && !currentTermId) {
      const defaultTerm = terms[0];
      updateURL(defaultTerm.termId);
    }
  }, [terms, currentTermId]);

  const updateURL = (termId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("termId", termId.toString());
    router.push(`?${params.toString()}`);
  };

  const handleTermChange = (termId: string) => {
    updateURL(Number(termId));
  };

  const handleApplyMobileFilter = () => {
    if (selectedTermMobile) {
      updateURL(Number(selectedTermMobile));
    }
    setIsFilterOpen(false);
  };

  return (
    <div className="border-border-default border-b">
      <div className="flex w-full items-center justify-between px-4 py-2.5 md:px-8">
        <h2 className="text-text-default text-lg font-semibold md:text-xl">All Classes</h2>

        {isLoadingTerms ? (
          <Skeleton className="bg-bg-input-soft h-8 w-40" />
        ) : (
          <div className="flex items-center gap-2">
            <Toggle label={draft ? "Published" : "Draft"} checked={draft} onChange={e => setDraft(e.target.checked)} />

            <div className="hidden gap-1 align-middle md:flex">
              <Select value={currentTermId || ""} onValueChange={handleTermChange}>
                <SelectTrigger className="border-border-darker h-8 w-auto border">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <Calendar fill="var(--color-icon-black-muted)" className="size-4" />
                      <span className="text-text-default text-sm font-semibold">{currentTerm?.term || "Select Term"}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-border-default">
                  {terms?.map((term: Terms) => (
                    <SelectItem key={term.termId} value={term.termId.toString()} className="text-text-default text-sm font-semibold">
                      {term.term}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="bg-bg-state-soft block size-7 rounded-md p-1.5 md:hidden" onClick={() => setIsFilterOpen(true)}>
              <Image src="/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
            </Button>
          </div>
        )}

        <MobileDrawer open={isFilterOpen} setIsOpen={setIsFilterOpen} title="Filter">
          <div className="flex w-full flex-col gap-4 px-3 py-4">
            <div className="space-y-4">
              {terms?.map((term: Terms) => (
                <div
                  key={term.termId}
                  onClick={() => setSelectedTermMobile(term.termId.toString())}
                  className={`cursor-pointer px-3 pl-9 text-sm ${
                    selectedTermMobile === term.termId.toString() || currentTermId === term.termId.toString()
                      ? "text-text-default font-semibold"
                      : "text-text-muted"
                  }`}
                >
                  {term.term}
                </div>
              ))}
            </div>
          </div>

          <DrawerFooter className="border-border-default border-t">
            <div className="flex justify-between">
              <DrawerClose asChild>
                <Button className="bg-bg-state-soft text-text-subtle h-8! rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
              </DrawerClose>

              <Button
                onClick={handleApplyMobileFilter}
                className="bg-bg-state-primary text-text-white-default h-8! rounded-md! px-4 py-2 text-sm tracking-[0.1rem]"
              >
                <span>Apply</span>
              </Button>
            </div>
          </DrawerFooter>
        </MobileDrawer>
      </div>
    </div>
  );
};
