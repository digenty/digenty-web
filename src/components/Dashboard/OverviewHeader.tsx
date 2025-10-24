"use client";

import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { useState } from "react";
import Calendar from "../Icons/Calendar";
import School from "../Icons/School";
import { MobileDrawer } from "../MobileDrawer";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

const termsOptions = ["24/25 Third Term", "24/25 Second Term", "24/25 First Term"];
const branches = ["All Branches", "Lawanson", "Ilasamaja"];

export default function OverviewHeader() {
  const [termSelected, setTermSelected] = useState(termsOptions[0]);
  const [branchSelected, setBranchSelected] = useState(branches[0]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div>
      <div className="flex w-full justify-between align-middle">
        <h2 className="text-text-default text-lg font-semibold md:text-2xl">Overview</h2>

        <div className="hidden gap-2 align-middle md:flex">
          <Select value={termSelected} onValueChange={setTermSelected}>
            <SelectTrigger className="border-border-darker h-8 w-auto border focus-visible:ring-0">
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

          <Select value={branchSelected} onValueChange={setBranchSelected}>
            <SelectTrigger className="border-border-darker h-8 w-auto border focus-visible:ring-0">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <Image src="/icons/school.svg" alt="branch" width={14} height={14} />
                  <span className="text-text-default text-sm font-semibold">{branchSelected}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default">
              {branches.map(branch => (
                <SelectItem key={branch} value={branch} className="text-text-default text-sm font-semibold">
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button className="bg-bg-state-soft block size-7 rounded-md p-1.5 md:hidden" onClick={() => setIsFilterOpen(true)}>
          <Image src="/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
        </Button>

        <MobileDrawer open={isFilterOpen} setIsOpen={setIsFilterOpen} title="Filter">
          <div className="flex w-full flex-col gap-4 p-4">
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

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <School fill="var(--color-icon-black-muted)" className="size-4" />
                <Label className="text-text-default text-sm font-medium">Branch</Label>
              </div>
              <Select value={branchSelected} onValueChange={setBranchSelected}>
                <SelectTrigger className="bg-bg-input-soft text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                  <SelectValue>
                    <span className="text-text-default text-sm">{branchSelected}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {branches.map(branch => (
                    <SelectItem key={branch} value={branch} className="text-text-default text-sm">
                      {branch}
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
                <span className="bg-bg-badge-white border-border-white rounded-sm px-1.5 py-0.5 text-xs">2</span>
              </Button>
            </div>
          </DrawerFooter>
        </MobileDrawer>
      </div>
    </div>
  );
}
