"use client";

import { FolderReduce, School } from "@digenty/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { BranchWithClassLevels } from "@/api/types";

import { MobileDrawer } from "../MobileDrawer";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

type Props = {
  branchId?: number;
  setBranchId: (id: number | undefined) => void;
};

export const StockHeader = ({ branchId, setBranchId }: Props) => {
  const router = useRouter();
  const { data: branchesResp } = useGetBranches();
  const branches = ((branchesResp?.data ?? []) as BranchWithClassLevels[]).map(b => b.branch);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useBreadcrumb([{ label: "Stock", url: "/staff/stock" }]);

  const handleBranchChange = (value: string) => {
    setBranchId(value ? Number(value) : undefined);
  };

  const selectedBranch = branches.find(b => b.id === branchId);

  return (
    <div>
      <div className="flex w-full justify-between align-middle">
        <h2 className="text-text-default text-xl font-semibold">Overview</h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push("/staff/stock/stock-categories")}
            className="border-border-darker text-text-default h-8! w-auto border text-sm font-medium"
          >
            <FolderReduce fill="var(--color-icon-black-muted)" className="size-4" /> Stock Categories
          </Button>
          <div className="hidden gap-2 align-middle md:flex">
            <Select value={branchId ? String(branchId) : ""} onValueChange={handleBranchChange}>
              <SelectTrigger className="border-border-darker placeholder:text-text-default! text-text-default bg-bg-default! h-8! w-auto border font-medium">
                <SelectValue placeholder="Select Branch">
                  <Image src="/staff/icons/school.svg" alt="branch" width={14} height={14} />
                  <span className="">{selectedBranch?.name ?? "Select Branch"}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                {branches.map(branch => (
                  <SelectItem key={branch.id} value={String(branch.id)} className="text-text-default text-sm font-medium">
                    {branch.name ?? `Branch ${branch.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button className="bg-bg-state-soft block size-7 rounded-md p-1.5 md:hidden" onClick={() => setIsFilterOpen(true)}>
          <Image src="/staff/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
        </Button>

        <MobileDrawer open={isFilterOpen} setIsOpen={setIsFilterOpen} title="Filter">
          <div className="flex w-full flex-col gap-4 px-3 py-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <School fill="var(--color-icon-black-muted)" className="size-4" />
                <Label className="text-text-default text-sm font-medium">Branch</Label>
              </div>
              <Select value={branchId ? String(branchId) : ""} onValueChange={handleBranchChange}>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
                  <SelectValue>
                    <span className="text-text-default text-sm">{selectedBranch?.name ?? "Select Branch"}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {branches.map(branch => (
                    <SelectItem key={branch.id} value={String(branch.id)} className="text-text-default text-sm">
                      {branch.name ?? `Branch ${branch.id}`}
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
