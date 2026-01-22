"use client";

import Image from "next/image";
import { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { SearchInput } from "@/components/SearchInput";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/Avatar";

const branches = ["Lawanson", "Ilasamaja"];
const reasons = ["Restock", "Sold"];
const changesBy = ["Damilare John"];
export const StockHistoryHeader = () => {
  const isMobile = useIsMobile();
  const [openFilter, setOpenFilter] = useState(false);
  const [openReasons, setOpenReasons] = useState(false);
  const [openBranch, setOpenBranch] = useState(false);
  const [openChangeBy, setOpenchangeBy] = useState(false);
  const [branchSelected, setBranchSelected] = useState(branches[0]);
  const [reasonSelected, setReasonSelected] = useState(reasons[0]);
  const [changeBySelected, setchangeBySelected] = useState(changesBy[0]);
  return (
    <>
      <div className="flex w-full items-center justify-between gap-3 md:gap-0">
        <div className="flex items-center gap-1">
          <SearchInput className="border-border-default bg-bg-input-soft! w-full border text-sm md:w-71" />

          <DropdownMenu open={openBranch} onOpenChange={setOpenBranch}>
            <DropdownMenuTrigger asChild>
              <Badge className="border-border-darker bg-bg-state-secondary text-text-muted hidden cursor-pointer items-center rounded-full border border-dashed text-sm md:flex">
                <Image src="/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} className="size-7 p-1.5" />
                Branch
              </Badge>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-bg-card border-border-default text-text-default hidden w-48 py-2.5 shadow-sm md:block">
              <div className="flex flex-col gap-1 px-1 py-2">
                {branches.map((cat, i) => (
                  <div key={i} className="hover:bg-bg-state-ghost-hover flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-sm">
                    <span className="text-text-default font-normal">{cat}</span>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu open={openReasons} onOpenChange={setOpenReasons}>
            <DropdownMenuTrigger asChild>
              <Badge className="border-border-darker bg-bg-state-secondary text-text-muted hidden cursor-pointer items-center rounded-full border border-dashed text-sm md:flex">
                <Image src="/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} className="size-7 p-1.5" />
                Reason
              </Badge>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-bg-card border-border-default text-text-default hidden w-48 py-2.5 shadow-sm md:block">
              <div className="flex flex-col gap-1 px-1 py-2">
                {reasons.map((item, i) => (
                  <div key={i} className="hover:bg-bg-state-ghost-hover flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-sm">
                    <span className="text-text-default font-normal">{item}</span>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu open={openChangeBy} onOpenChange={setOpenchangeBy}>
            <DropdownMenuTrigger asChild>
              <Badge className="border-border-darker bg-bg-state-secondary text-text-muted hidden cursor-pointer items-center rounded-full border border-dashed text-sm md:flex">
                <Image src="/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} className="size-7 p-1.5" />
                Changed By
              </Badge>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-bg-card border-border-default text-text-default hidden w-48 py-2.5 shadow-sm md:block">
              <div className="flex flex-col gap-1 px-1">
                {changesBy.map((ch, i) => (
                  <div key={i} className="hover:bg-bg-state-ghost-hover flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-sm">
                    <Avatar username={ch} className="size-4" /> <span className="text-text-default font-normal">{ch}</span>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button onClick={() => setOpenFilter(true)} className="border-border-darker bg-bg-state-secondary block w-fit rounded-md p-1 md:hidden">
          <Image src="/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} className="size-7 p-1.5" />
        </Button>

        {isMobile && (
          <MobileDrawer open={openFilter} setIsOpen={setOpenFilter} title="Filter">
            <div className="flex w-full flex-col gap-2 px-4 py-4">
              <div className="space-y-2">
                <Label className="text-text-default text-sm font-medium">Branch</Label>

                <Select value={branchSelected} onValueChange={setBranchSelected}>
                  <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                    <SelectValue>
                      <span className="text-text-default text-sm">{branchSelected}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-default border-border-default">
                    {branches.map(br => (
                      <SelectItem key={br} value={br} className="text-text-default text-sm">
                        {br}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-text-default text-sm font-medium">Reason</Label>

                <Select value={reasonSelected} onValueChange={setReasonSelected}>
                  <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                    <SelectValue>
                      <span className="text-text-default text-sm">{reasonSelected}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-default border-border-default">
                    {reasons.map(rs => (
                      <SelectItem key={rs} value={rs} className="text-text-default text-sm">
                        {rs}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-text-default text-sm font-medium">Changed By</Label>

                <Select value={changeBySelected} onValueChange={setchangeBySelected}>
                  <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                    <SelectValue>
                      <span className="text-text-default text-sm">{changeBySelected}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-default border-border-default">
                    {changesBy.map(ch => (
                      <SelectItem key={ch} value={ch} className="text-text-default text-sm">
                        {ch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DrawerFooter className="border-border-default border-t">
              <div className="flex justify-between">
                <DrawerClose asChild>
                  <Button className="bg-bg-state-soft text-text-subtle h-8 rounded-md! px-2.5 py-1 text-sm font-medium">Cancel</Button>
                </DrawerClose>

                <Button className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-8 rounded-md px-2.5 py-1 text-sm">
                  Apply
                </Button>
              </div>
            </DrawerFooter>
          </MobileDrawer>
        )}
      </div>
    </>
  );
};
