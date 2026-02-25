"use client";

import { Branch } from "@/api/types";
import ShareBox from "@/components/Icons/ShareBox";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/useIsMobile";

type PermissionModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  branches: Branch[];
  setBranchSelected: (branchSelected?: Branch) => void;
  branchSelected?: Branch;
  loadingBranches: boolean;
  filteredCount: number;
};
export const SettingPermissionModalExport = ({
  open,
  setOpen,
  branches,
  setBranchSelected,
  branchSelected,
  loadingBranches,
  filteredCount = 0,
}: PermissionModalProps) => {
  const isMobile = useIsMobile();
  return (
    <div>
      <div>
        {isMobile ? (
          <MobileDrawer open={open} setIsOpen={setOpen} title="Filter">
            <div className="flex w-full flex-col gap-4 px-3 py-4">
              <h2 className="text-text-default text-sm font-bold">Filter Selection</h2>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-text-default text-sm font-medium">Branch</Label>
                </div>
                {!branches || loadingBranches ? (
                  <Skeleton className="bg-bg-input-soft h-9 w-full" />
                ) : (
                  <Select
                    onValueChange={value => {
                      const branch = branches.find((branch: Branch) => branch.uuid === value);
                      setBranchSelected(branch);
                    }}
                  >
                    <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                      <span className="text-text-default text-sm font-medium">{branchSelected ? branchSelected?.name : "All Branches"}</span>
                    </SelectTrigger>
                    <SelectContent className="bg-bg-card border-border-default">
                      <SelectItem value="none" className="text-text-default text-sm font-medium">
                        All Branches
                      </SelectItem>
                      {branches.map((branch: Branch) => (
                        <SelectItem key={branch.id} value={branch.uuid} className="text-text-default text-sm font-medium">
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <Badge className="border-border-default bg-bg-badge-green text-bg-basic-green-strong flex items-center rounded-xs p-0.5">
                {filteredCount} Staff Found
              </Badge>
            </div>

            <DrawerFooter className="border-border-default border-t">
              <div className="flex justify-between">
                <DrawerClose asChild>
                  <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-2 py-1 text-sm font-medium">Cancel</Button>
                </DrawerClose>

                <Button className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm">
                  <ShareBox fill="var(--color-icon-white-default)" /> Export Staff
                </Button>
              </div>
            </DrawerFooter>
          </MobileDrawer>
        ) : (
          <Modal
            open={open}
            setOpen={setOpen}
            title={
              <span className="flex items-center gap-2">
                <span className="bg-bg-state-soft flex size-8 items-center justify-center rounded-full">
                  <ShareBox fill="var(--color-icon-default-subtle)" className="size-4" />
                </span>
                <span>Export Staff</span>
              </span>
            }
            ActionButton={
              <Button className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm">
                <ShareBox fill="var(--color-icon-white-default)" /> Export Staff
              </Button>
            }
          >
            <div className="flex w-full flex-col gap-4 px-6 py-4">
              <h2 className="text-text-default text-sm font-bold">Filter Selection</h2>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-text-default text-sm font-medium">Branch</Label>
                </div>
                {!branches || loadingBranches ? (
                  <Skeleton className="bg-bg-input-soft h-9 w-full" />
                ) : (
                  <Select
                    onValueChange={value => {
                      const branch = branches.find((branch: Branch) => branch.uuid === value);
                      setBranchSelected(branch);
                    }}
                  >
                    <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                      <span className="text-text-default text-sm font-medium">{branchSelected ? branchSelected?.name : "All Branches"}</span>
                    </SelectTrigger>
                    <SelectContent className="bg-bg-card border-border-default">
                      <SelectItem value="none" className="text-text-default text-sm font-medium">
                        All Branches
                      </SelectItem>
                      {branches.map((branch: Branch) => (
                        <SelectItem key={branch.id} value={branch.uuid} className="text-text-default text-sm font-medium">
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <Badge className="border-border-default bg-bg-badge-green text-bg-basic-green-strong flex items-center rounded-sm p-0.5">
                {filteredCount} Staff Found
              </Badge>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};
