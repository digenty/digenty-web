"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

const termsOptions = ["24/25 Third Term", "24/25 Second Term", "24/25 First Term"];
const branches = ["All Branches", "Lawanson", "Ilasamaja"];

export default function OverviewHeader() {
  const [termSelected, setTermSelected] = useState(termsOptions[0]);
  const [branchSelected, setBranchSelected] = useState(branches[0]);

  return (
    <div>
      <div className="flex w-full justify-between p-4 align-middle">
        <h2 className="text-text-default text-3xl font-bold">Overview</h2>

        <div className="hidden gap-2 align-middle md:flex">
          <Select value={termSelected} onValueChange={setTermSelected}>
            <SelectTrigger className="border-border-darker h-8 w-[181px] border focus-visible:ring-0">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <Calendar className="text-icon-black-muted size-4" />
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
            <SelectTrigger className="border-border-darker h-8 w-[181px] border focus-visible:ring-0">
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

        {/* Mobile Drawer */}
        <Drawer>
          <DrawerTrigger asChild>
            <button className="bg-bg-state-soft block h-[20px] w-[20px] rounded-sm p-1 md:hidden">
              <Image src="/icons/open-filter-modal.svg" alt="filter icon" width={16} height={16} />
            </button>
          </DrawerTrigger>

          <DrawerContent className="bg-bg-default w-full max-w-full rounded-t-[12px] pb-3 shadow-lg">
            <DrawerHeader className="bg-bg-state-soft flex items-center justify-between rounded-t-[12px] border-b border-zinc-200 px-4 py-3">
              <DrawerTitle className="text-text-default text-lg font-semibold">Filter</DrawerTitle>
              <DrawerClose asChild>
                <button className="text-text-muted w-[ 10.61px] text-xl font-bold">×</button>
              </DrawerClose>
            </DrawerHeader>

            {/* Mobile Filter  */}
            <div className="mb-4 flex w-full flex-col gap-4 p-4">
              {/* Period */}
              <div className="flex items-center gap-2">
                <Calendar className="text-icon-black-muted size-4" />
                <label className="text-text-default text-sm font-medium">Period</label>
              </div>
              <Select value={termSelected} onValueChange={setTermSelected}>
                <SelectTrigger className="bg-bg-state-soft w-full rounded-md border border-zinc-200 px-3 py-2 text-left text-sm font-semibold">
                  <SelectValue>
                    <div>
                      <span className="text-text-default text-sm font-semibold">{termSelected}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {termsOptions.map(term => (
                    <SelectItem key={term} value={term} className="text-text-default text-sm font-semibold">
                      {term}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Branch */}
              <div className="flex items-center gap-2">
                <Image src="/icons/Vector (4).svg" alt="branch" width={14} height={14} />
                <label className="text-text-default text-sm font-medium">Branch</label>
              </div>
              <Select value={branchSelected} onValueChange={setBranchSelected}>
                <SelectTrigger className="bg-bg-state-soft w-full rounded-md border border-zinc-200 px-3 py-2 text-left text-sm font-semibold">
                  <SelectValue>
                    <div className="">
                      <span className="text-text-default text-sm font-semibold">{branchSelected}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {branches.map(branch => (
                    <SelectItem key={branch} value={branch} className="text-text-default text-sm font-semibold">
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DrawerFooter>
              <div className="flex justify-between">
                <DrawerClose asChild>
                  <button className="bg-bg-state-soft text-text-default rounded-md px-4 py-2 text-sm font-semibold">Cancel</button>
                </DrawerClose>

                <button className="rounded-md bg-blue-500 px-4 py-2 text-sm tracking-[0.1rem] text-white">Apply Filter</button>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
