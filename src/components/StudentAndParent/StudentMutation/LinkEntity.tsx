"use client";
import { Modal } from "@/components/Modal";
import { SearchInput } from "@/components/SearchInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Avatar } from "../../Avatar";
import { Button } from "../../ui/button";
import { MobileDrawer } from "@/components/MobileDrawer";
import { useIsMobile } from "@/hooks/useIsMobile";

const branches = ["All Branches", "Lawanson", "Ilasamaja"];

export const LinkEntity = ({ entity, open, setOpen }: { entity: "Students" | "Parents"; open: boolean; setOpen: (open: boolean) => void }) => {
  const [branchSelected, setBranchSelected] = useState(branches[0]);
  const isMobile = useIsMobile();
  return (
    <>
      {isMobile ? (
        <MobileDrawer open={open} setIsOpen={setOpen} title={`Link ${entity}`}>
          <div className="border-border-default bg-bg-card-subtle flex items-center justify-between border-b px-4 py-3">
            <h3 className="text-text-default text-base font-semibold">{entity} List</h3>
            <Select value={branchSelected} onValueChange={setBranchSelected}>
              <SelectTrigger className="border-border-darker h-8! w-auto border">
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

          <div className="space-y-3 px-3 py-4 md:px-6">
            <SearchInput className="bg-bg-input-soft h-8 rounded-lg border-none" />
            <Button className="bg-bg-state-secondary hover:bg-bg-state-secondary-hover! border-border-default h-6 border px-1.5!">
              <XIcon className="text-icon-default-muted size-4" />
              <span className="text-text-default text-xs">Clear All</span>
            </Button>

            <div className="border-border-default h-[300px] space-y-3 overflow-y-auto rounded-sm border p-3">
              <div className="bg-bg-card border-border-darker flex items-center gap-3 rounded-lg border p-4">
                <Checkbox checked={false} onCheckedChange={(value: boolean) => {}} aria-label="Select" />
                <div className="flex items-center gap-2">
                  <Avatar username="Damilare John" className="size-10 md:size-8" />
                  <div className="">
                    <p className="text-text-default text-sm font-medium">Damilare John</p>
                    <p className="text-text-subtle text-xs font-normal">Lawanson</p>
                  </div>
                </div>
              </div>

              <div className="bg-bg-card border-border-darker flex items-center gap-3 rounded-lg border p-4">
                <Checkbox checked={false} onCheckedChange={(value: boolean) => {}} aria-label="Select" />
                <div className="flex items-center gap-2">
                  <Avatar username="Damilare John" className="size-10 md:size-8" />
                  <div className="">
                    <p className="text-text-default text-sm font-medium">Damilare John</p>
                    <p className="text-text-subtle text-xs font-normal">Lawanson</p>
                  </div>
                </div>
              </div>

              <div className="bg-bg-card border-border-darker flex items-center gap-3 rounded-lg border p-4">
                <Checkbox checked={false} onCheckedChange={(value: boolean) => {}} aria-label="Select" />
                <div className="flex items-center gap-2">
                  <Avatar username="Damilare John" className="size-10 md:size-8" />
                  <div className="">
                    <p className="text-text-default text-sm font-medium">Damilare John</p>
                    <p className="text-text-subtle text-xs font-normal">Lawanson</p>
                  </div>
                </div>
              </div>

              <div className="bg-bg-card border-border-darker flex items-center gap-3 rounded-lg border p-4">
                <Checkbox checked={false} onCheckedChange={(value: boolean) => {}} aria-label="Select" />
                <div className="flex items-center gap-2">
                  <Avatar username="Damilare John" className="size-10 md:size-8" />
                  <div className="">
                    <p className="text-text-default text-sm font-medium">Damilare John</p>
                    <p className="text-text-subtle text-xs font-normal">Lawanson</p>
                  </div>
                </div>
              </div>

              <div className="bg-bg-card border-border-darker flex items-center gap-3 rounded-lg border p-4">
                <Checkbox checked={false} onCheckedChange={(value: boolean) => {}} aria-label="Select" />
                <div className="flex items-center gap-2">
                  <Avatar username="Damilare John" className="size-10 md:size-8" />
                  <div className="">
                    <p className="text-text-default text-sm font-medium">Damilare John</p>
                    <p className="text-text-subtle text-xs font-normal">Lawanson</p>
                  </div>
                </div>
              </div>

              <div className="bg-bg-card border-border-darker flex items-center gap-3 rounded-lg border p-4">
                <Checkbox checked={false} onCheckedChange={(value: boolean) => {}} aria-label="Select" />
                <div className="flex items-center gap-2">
                  <Avatar username="Damilare John" className="size-10 md:size-8" />
                  <div className="">
                    <p className="text-text-default text-sm font-medium">Damilare John</p>
                    <p className="text-text-subtle text-xs font-normal">Lawanson</p>
                  </div>
                </div>
              </div>

              <div className="bg-bg-card border-border-darker flex items-center gap-3 rounded-lg border p-4">
                <Checkbox checked={false} onCheckedChange={(value: boolean) => {}} aria-label="Select" />
                <div className="flex items-center gap-2">
                  <Avatar username="Damilare John" className="size-10 md:size-8" />
                  <div className="">
                    <p className="text-text-default text-sm font-medium">Damilare John</p>
                    <p className="text-text-subtle text-xs font-normal">Lawanson</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-bg-subtle border-border-default space-y-2 border-t px-4 py-3">
            <h3 className="text-text-default text-sm font-medium">Selected</h3>
            <div className="flex flex-wrap gap-2">
              <div className="bg-bg-badge-default border-border-default text-text-subtle flex items-center gap-1 rounded-full border p-1 text-xs">
                <Avatar username="Damilare John" className="size-3.5" />
                <span>Damilare John</span>
                <XIcon className="text-icon-default-muted size-3.5 cursor-pointer" />
              </div>
              <div className="bg-bg-badge-default border-border-default text-text-subtle flex items-center gap-1 rounded-full border p-1 text-xs">
                <Avatar username="Damilare John" className="size-3.5" />
                <span>Damilare John</span>
                <XIcon className="text-icon-default-muted size-3.5 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="bg-bg-card border-border-default flex items-center justify-between border-t px-3 py-4 md:px-4">
            <Button
              variant="outline"
              className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle hover:text-text-subtle h-7 border-none px-2 py-1 text-sm font-medium"
            >
              Cancel
            </Button>

            <Button className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7 px-2 py-1">
              {true && <Spinner />}
              <span className="text-sm font-medium">Link {entity}</span>
            </Button>
          </div>
        </MobileDrawer>
      ) : (
        <Modal
          className="bg-bg-card max-w-200! overflow-y-auto"
          open={open}
          setOpen={setOpen}
          title={`Link ${entity}`}
          ActionButton={
            <Button className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7 px-2 py-1">
              {true && <Spinner />}
              <span className="text-sm font-medium">Link {entity}</span>
            </Button>
          }
        >
          <div className="border-border-default bg-bg-card-subtle flex items-center justify-between border-b px-4 py-3">
            <h3 className="text-text-default text-base font-semibold">{entity} List</h3>
            <Select value={branchSelected} onValueChange={setBranchSelected}>
              <SelectTrigger className="border-border-darker h-8! w-auto border">
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

          <div className="space-y-3 px-3 py-4 md:px-6">
            <SearchInput className="bg-bg-input-soft h-8 rounded-lg border-none" />
            <Button className="bg-bg-state-secondary hover:bg-bg-state-secondary-hover! border-border-default h-6 border px-1.5!">
              <XIcon className="text-icon-default-muted size-4" />
              <span className="text-text-default text-xs">Clear All</span>
            </Button>

            <div className="border-border-default h-[300px] space-y-3 overflow-y-auto rounded-sm border p-3">
              <div className="bg-bg-card border-border-darker flex items-center gap-3 rounded-lg border p-4">
                <Checkbox checked={false} onCheckedChange={(value: boolean) => {}} aria-label="Select" />
                <div className="flex items-center gap-2">
                  <Avatar username="Damilare John" className="size-10 md:size-8" />
                  <div className="">
                    <p className="text-text-default text-sm font-medium">Damilare John</p>
                    <p className="text-text-subtle text-xs font-normal">Lawanson</p>
                  </div>
                </div>
              </div>

              <div className="bg-bg-card border-border-darker flex items-center gap-3 rounded-lg border p-4">
                <Checkbox checked={false} onCheckedChange={(value: boolean) => {}} aria-label="Select" />
                <div className="flex items-center gap-2">
                  <Avatar username="Damilare John" className="size-10 md:size-8" />
                  <div className="">
                    <p className="text-text-default text-sm font-medium">Damilare John</p>
                    <p className="text-text-subtle text-xs font-normal">Lawanson</p>
                  </div>
                </div>
              </div>

              <div className="bg-bg-card border-border-darker flex items-center gap-3 rounded-lg border p-4">
                <Checkbox checked={false} onCheckedChange={(value: boolean) => {}} aria-label="Select" />
                <div className="flex items-center gap-2">
                  <Avatar username="Damilare John" className="size-10 md:size-8" />
                  <div className="">
                    <p className="text-text-default text-sm font-medium">Damilare John</p>
                    <p className="text-text-subtle text-xs font-normal">Lawanson</p>
                  </div>
                </div>
              </div>

              <div className="bg-bg-card border-border-darker flex items-center gap-3 rounded-lg border p-4">
                <Checkbox checked={false} onCheckedChange={(value: boolean) => {}} aria-label="Select" />
                <div className="flex items-center gap-2">
                  <Avatar username="Damilare John" className="size-10 md:size-8" />
                  <div className="">
                    <p className="text-text-default text-sm font-medium">Damilare John</p>
                    <p className="text-text-subtle text-xs font-normal">Lawanson</p>
                  </div>
                </div>
              </div>

              <div className="bg-bg-card border-border-darker flex items-center gap-3 rounded-lg border p-4">
                <Checkbox checked={false} onCheckedChange={(value: boolean) => {}} aria-label="Select" />
                <div className="flex items-center gap-2">
                  <Avatar username="Damilare John" className="size-10 md:size-8" />
                  <div className="">
                    <p className="text-text-default text-sm font-medium">Damilare John</p>
                    <p className="text-text-subtle text-xs font-normal">Lawanson</p>
                  </div>
                </div>
              </div>

              <div className="bg-bg-card border-border-darker flex items-center gap-3 rounded-lg border p-4">
                <Checkbox checked={false} onCheckedChange={(value: boolean) => {}} aria-label="Select" />
                <div className="flex items-center gap-2">
                  <Avatar username="Damilare John" className="size-10 md:size-8" />
                  <div className="">
                    <p className="text-text-default text-sm font-medium">Damilare John</p>
                    <p className="text-text-subtle text-xs font-normal">Lawanson</p>
                  </div>
                </div>
              </div>

              <div className="bg-bg-card border-border-darker flex items-center gap-3 rounded-lg border p-4">
                <Checkbox checked={false} onCheckedChange={(value: boolean) => {}} aria-label="Select" />
                <div className="flex items-center gap-2">
                  <Avatar username="Damilare John" className="size-10 md:size-8" />
                  <div className="">
                    <p className="text-text-default text-sm font-medium">Damilare John</p>
                    <p className="text-text-subtle text-xs font-normal">Lawanson</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-bg-subtle border-border-default space-y-2 border-t px-4 py-3">
            <h3 className="text-text-default text-sm font-medium">Selected</h3>
            <div className="flex flex-wrap gap-2">
              <div className="bg-bg-badge-default border-border-default text-text-subtle flex items-center gap-1 rounded-full border p-1 text-xs">
                <Avatar username="Damilare John" className="size-3.5" />
                <span>Damilare John</span>
                <XIcon className="text-icon-default-muted size-3.5 cursor-pointer" />
              </div>
              <div className="bg-bg-badge-default border-border-default text-text-subtle flex items-center gap-1 rounded-full border p-1 text-xs">
                <Avatar username="Damilare John" className="size-3.5" />
                <span>Damilare John</span>
                <XIcon className="text-icon-default-muted size-3.5 cursor-pointer" />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
