"use client";

import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { useState } from "react";
import Calendar from "../../Icons/Calendar";
import { MobileDrawer } from "../../MobileDrawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const termsOptions = ["24/25 Third Term", "24/25 Second Term", "24/25 First Term"];

export default function SubjectHeader() {
  const [termSelected, setTermSelected] = useState(termsOptions[0]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="flex w-full justify-between align-middle">
      <h2 className="text-text-default text-lg font-semibold md:text-xl">My Subjects</h2>
      {/* 
      <div className="hidden gap-1 align-middle md:flex">
        <Select value={termSelected} onValueChange={setTermSelected}>
          <SelectTrigger className="border-border-darker h-8! w-auto border">
            <SelectValue>
              <div className="flex items-center gap-2">
                <Calendar fill="var(--color-icon-black-muted )" className="size-4" />
                <span className="text-text-default text-sm font-semibold">{termSelected}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default">
            {termsOptions.map(term => (
              <SelectItem key={term} value={term} className="text-text-default text-sm font-semibold">
                {term}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}

      {/* <Button className="bg-bg-state-soft block size-7 rounded-md p-1.5 md:hidden" onClick={() => setIsFilterOpen(true)}>
        <Image src="/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
      </Button>

      <MobileDrawer open={isFilterOpen} setIsOpen={setIsFilterOpen} title="Filter">
        <div className="flex w-full flex-col gap-4 px-3 py-4">
          {termsOptions.map(term => (
            <div key={term} onClick={() => setTermSelected(term)} className="h-8 r px-4 py-2 text-sm">
              {term}
            </div>
          ))}
        </div>

        <DrawerFooter className="border-border-default border-t">
          <div className="flex justify-between">
            <DrawerClose asChild>
              <Button className="bg-bg-state-soft text-text-subtle h-8 rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
            </DrawerClose>

            <Button className="bg-bg-state-primary text-text-white-default h-8 rounded-md! px-4 py-2 text-sm tracking-[0.1rem]">
              <span>Apply</span>
            </Button>
          </div>
        </DrawerFooter>
      </MobileDrawer> */}
    </div>
  );
}
