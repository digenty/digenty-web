"use client";

import Image from "next/image";
import React from "react";
import { Listbox } from "@headlessui/react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";

const termsOptions = [
  { value: "Term 1", label: "24/25 Third Term", icon: "/icons/Vector (3).svg" },
  { value: "Term 2", label: "24/25 Second Term", icon: "/icons/home-2.svg" },
  { value: "Term 3", label: "24/25 First Term", icon: "/icons/home-2.svg" },
];

const branches = [
  { value: "All Branches", label: "All Branches", icon: "/icons/Vector (4).svg" },
  { value: "Lawanson", label: "Lawanson", icon: "/icons/Vector (4).svg" },
  { value: "Ilasamaja", label: "Ilasamaja", icon: "/icons/Vector (4).svg" },
];

export default function OverviewHeader() {
  const [termSelected, setTermSelected] = React.useState(termsOptions[0]);
  const [branchSelected, setBranchSelected] = React.useState(branches[0]);

  return (
    <div>
      <div className="flex w-full justify-between p-4 align-middle">
        <h2 className="text-text-default text-3xl font-bold">Overview</h2>

        {/* Desktop filter options */}
        <div className="hidden gap-2 align-middle md:flex">
          <div className="border-border-default text-text-default flex items-center gap-2 rounded-md border px-2 py-2">
            <Image src={termsOptions[0].icon} width={15} height={15} alt="term icon" />
            <select
              name="terms"
              className="border-border-default text-text-default border-none text-sm font-bold focus:ring-0 focus:outline-none"
              defaultValue={termsOptions[0].value}
            >
              {termsOptions.map(term => (
                <option
                  key={term.value}
                  value={term.value}
                  className="border-border-darker bg-bg-default hover:text-text-muted font-bold text-zinc-500"
                >
                  {term.label}
                </option>
              ))}
            </select>
          </div>

          <div className="border-border-default text-text-default flex items-center gap-2 rounded-md border px-2 py-2">
            <Image src={branches[0].icon} width={15} height={15} alt="branch icon" />
            <select
              name="branches"
              id="branches"
              className="border-border-default text-text-default border-none text-sm font-bold focus:ring-0 focus:outline-none"
              defaultValue="All Branches"
            >
              {branches.map(branch => (
                <option
                  key={branch.value}
                  value={branch.value}
                  className="border-border-darker bg-bg-default hover:text-text-muted px-2 font-bold text-zinc-500"
                >
                  {branch.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile Drawer Trigger */}
        <Drawer>
          <DrawerTrigger asChild>
            <button className="bg-bg-state-soft block rounded-sm px-2 md:hidden">
              <Image src="/icons/Vector (5).svg" alt="filter icon" width={20} height={20} />
            </button>
          </DrawerTrigger>

          <DrawerContent className="bg-bg-default w-full max-w-full rounded-t-[12px] pb-3 shadow-lg">
            <DrawerHeader className="bg-bg-state-soft flex items-center justify-between rounded-t-[12px] border-b border-zinc-200 px-4 py-3">
              <DrawerTitle className="text-text-default text-lg font-semibold">Filter</DrawerTitle>
              <DrawerClose asChild>
                <button className="text-text-default text-xl font-bold">×</button>
              </DrawerClose>
            </DrawerHeader>

            <div className="mb-4 flex w-full flex-col gap-4 p-4">
              {/* Period Section */}
              <div className="flex items-center gap-2">
                <Image src={termsOptions[0].icon} width={15} height={15} alt="term icon" />
                <label className="text-text-default text-sm font-medium">Period</label>
              </div>

              <Listbox value={termSelected} onChange={setTermSelected}>
                <div className="relative">
                  <Listbox.Button className="bg-bg-state-soft text-text-default w-full rounded-md px-3 py-2 text-left text-sm font-semibold">
                    {termSelected.label}
                  </Listbox.Button>
                  <Listbox.Options className="bg-bg-default text-text-default absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-zinc-200 shadow-lg">
                    {termsOptions.map(term => (
                      <Listbox.Option
                        key={term.value}
                        value={term}
                        className="hover:bg-bg-state-secondary text-text-default w-full max-w-full rounded-md px-3 py-2 text-sm font-bold"
                      >
                        {term.label}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>

              {/* Branch Section */}
              <div className="flex items-center gap-2">
                <Image src={branches[0].icon} width={15} height={15} alt="branch icon" />
                <label className="text-text-default text-sm font-medium">Branch</label>
              </div>

              <Listbox value={branchSelected} onChange={setBranchSelected}>
                <div className="relative">
                  <Listbox.Button className="bg-bg-state-soft text-text-default w-full rounded-md px-3 py-2 text-left text-sm font-semibold">
                    {branchSelected.label}
                  </Listbox.Button>
                  <Listbox.Options className="bg-bg-default absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-zinc-200 shadow-lg">
                    {branches.map(branch => (
                      <Listbox.Option
                        key={branch.value}
                        value={branch}
                        className="text-text-default hover:bg-bg-state-secondary w-full max-w-full rounded-md px-3 py-2 text-sm font-bold"
                      >
                        {branch.label}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
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
