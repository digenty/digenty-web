"use client";

import Calendar from "@/components/Icons/Calendar";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Toggle } from "@/components/Toggle";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { useState } from "react";

const termsOptions = ["24/25 Third Term", "24/25 Second Term", "24/25 First Term"];

export const AllClassesHeader = () => {
  const [draft, setDraft] = useState(false);
  const [termSelected, setTermSelected] = useState(termsOptions[0]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  return (
    <div className="border-border-default border-b">
      <div className="flex w-full justify-between px-4 py-2 align-middle">
        <h2 className="text-text-default text-lg font-semibold md:text-2xl">All Classes</h2>

        <div className="flex items-center gap-2">
          <Toggle label="Draft" checked={draft} onChange={e => setDraft(e.target.checked)} />
          <div className="hidden gap-1 align-middle md:flex">
            <Select value={termSelected} onValueChange={setTermSelected}>
              <SelectTrigger className="border-border-darker h-8 w-auto border">
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
          </div>
          <Button className="bg-bg-state-soft block size-7 rounded-md p-1.5 md:hidden" onClick={() => setIsFilterOpen(true)}>
            <Image src="/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
          </Button>
        </div>

        <MobileDrawer open={isFilterOpen} setIsOpen={setIsFilterOpen} title="Filter">
          <div className="flex w-full flex-col gap-4 px-3 py-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar fill="var(--color-icon-black-muted)" className="size-4" />
                <Label className="text-text-default text-sm font-medium">Period</Label>
              </div>
              <Select value={termSelected} onValueChange={setTermSelected}>
                <SelectTrigger className="bg-bg-input-soft text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
                  <SelectValue>
                    <span className="text-text-default text-sm">{termSelected}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {termsOptions.map(term => (
                    <SelectItem key={term} value={term} className="text-text-default text-sm">
                      {term}
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

              <Button className="bg-bg-state-primary text-text-white-default rounded-md! px-4 py-2 text-sm tracking-[0.1rem]">
                <span>Apply Filter</span>
              </Button>
            </div>
          </DrawerFooter>
        </MobileDrawer>
      </div>
    </div>
  );
};
