"use client";

import { Term } from "@/api/types";
import Calendar from "@/components/Icons/Calendar";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Toggle } from "@/components/Toggle";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useState } from "react";

interface AllClassesHeaderProps {
  terms: Term[];
  selectedTermId: number | null;
  onTermChange: (termId: number) => void;
  isLoadingTerms?: boolean;
}

export const AllClassesHeader = ({ terms, selectedTermId, onTermChange, isLoadingTerms }: AllClassesHeaderProps) => {
  const [draft, setDraft] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pendingTermId, setPendingTermId] = useState<number | null>(selectedTermId);

  const selectedTerm = terms.find(t => t.termId === selectedTermId);

  return (
    <div className="border-border-default border-b">
      <div className="flex w-full items-center justify-between px-4 py-2.5 md:px-8">
        <h2 className="text-text-default text-lg font-semibold md:text-xl">All Classes</h2>

        <div className="flex items-center gap-2">
          <Toggle label={draft ? "Published" : "Draft"} checked={draft} onChange={e => setDraft(e.target.checked)} />

          <div className="hidden gap-1 align-middle md:flex">
            {isLoadingTerms ? (
              <Skeleton className="bg-bg-input-soft h-8 w-30" />
            ) : (
              <Select value={selectedTermId?.toString()} onValueChange={val => onTermChange(Number(val))} disabled={isLoadingTerms}>
                <SelectTrigger className="border-border-darker h-8 w-auto border">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <Calendar fill="var(--color-icon-black-muted)" className="size-4" />
                      <span className="text-text-default text-sm font-semibold">
                        {isLoadingTerms ? "Loading..." : (selectedTerm?.term ?? "Select Term")}
                      </span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-border-default">
                  {terms.map(term => (
                    <SelectItem key={term.termId} value={term.termId.toString()} className="text-text-default text-sm font-semibold">
                      {term.term}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <Button className="bg-bg-state-soft block size-7 rounded-md p-1.5 md:hidden" onClick={() => setIsFilterOpen(true)}>
            <Image src="/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
          </Button>
        </div>

        <MobileDrawer open={isFilterOpen} setIsOpen={setIsFilterOpen} title="Filter">
          <div className="flex w-full flex-col gap-4 px-3 py-4">
            <div className="space-y-4">
              {terms.map(term => (
                <p
                  key={term.termId}
                  onClick={() => setPendingTermId(term.termId)}
                  className={`text-text-default cursor-pointer px-3 pl-9 text-sm ${pendingTermId === term.termId ? "font-semibold" : ""}`}
                >
                  {term.term}
                </p>
              ))}
            </div>
          </div>

          <DrawerFooter className="border-border-default border-t">
            <div className="flex justify-between">
              <DrawerClose asChild>
                <Button className="bg-bg-state-soft text-text-subtle h-8! rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button
                  className="bg-bg-state-primary text-text-white-default h-8! rounded-md! px-4 py-2 text-sm tracking-[0.1rem]"
                  onClick={() => pendingTermId && onTermChange(pendingTermId)}
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
