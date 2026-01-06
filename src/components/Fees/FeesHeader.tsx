"use client";

import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { useState } from "react";
import School from "../Icons/School";
import { MobileDrawer } from "../MobileDrawer";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import Calendar from "../Icons/Calendar";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { SearchInput } from "../SearchInput";
import { Toggle } from "../Toggle";
import ShareBox from "../Icons/ShareBox";
import { AddFill } from "../Icons/AddFill";
import { Modal } from "../Modal";
import { Badge } from "../ui/badge";
import { PlusIcon } from "lucide-react";

type FeesHeaderProps = {
  title?: string;

  branches: string[];
  branchSelected: string;
  setBranchSelected: (value: string) => void;

  termsOptions: string[];
  termSelected: string;
  setTermSelected: (value: string) => void;
  // onExportConfirm?: () => void;
  exportTitle?: string;
  exportActionButton?: string;
  addButttonText?: string;

  arms?: string[];
  selectedArm?: string;
  setSelectedArm?: (value: string) => void;

  classes?: string[];
  selectedClass?: string;
  setSelectedClass?: (value: string) => void;

  showBranchFilter?: boolean;
  showTermFilter?: boolean;
  showSearch?: boolean;
  showExport?: boolean;
  showToggle?: boolean;

  onAddClick?: () => void;
};

const exprtBranches = ["All Branches", "Lawanson", "Ilasamaja"];
const exportTermsOptions = ["24/25 Third Term", "24/25 Second Term", "24/25 First Term"];

export const FeesHeader = ({
  title = "Class Fees Overview",

  branches,
  branchSelected,
  setBranchSelected,
  exportTitle,
  addButttonText = "Add Fee",
  exportActionButton,
  termsOptions,
  termSelected,
  setTermSelected,
  selectedClass,
  selectedArm,
  setSelectedArm,
  setSelectedClass,
  classes,
  arms,

  showBranchFilter = true,
  showTermFilter = true,
  showSearch = true,
  showExport = true,
  showToggle = true,

  onAddClick,
}: FeesHeaderProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [exportBranchSelected, setExportBranchSelected] = useState(exprtBranches[0]);
  const [exportTermSelected, setExportTermSelected] = useState(exportTermsOptions[0]);

  useBreadcrumb([{ label: "Fees", url: "/fees" }]);

  return (
    <div>
      <Modal
        open={isOpen}
        setOpen={setIsOpen}
        title={
          <div className="flex items-center gap-2">
            <ShareBox fill="var(--color-icon-default-subtle)" className="bg-bg-state-soft h-8 w-8 rounded-full p-2" />
            <span>{exportTitle ?? "Export"}</span>
          </div>
        }
        ActionButton={
          <Button className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-brand-hover! h-7!">
            <ShareBox fill="var(--color-icon-white-default)" className="" /> {exportActionButton ?? "Export"}
          </Button>
        }
      >
        <div className="flex flex-col gap-5 px-6 py-4">
          <div className="text-text-default text-sm font-bold">Filter Selection</div>
          <div className="">
            {showBranchFilter && (
              <Select value={exportBranchSelected} onValueChange={setExportBranchSelected}>
                <Label className="text-text-default mb-2 text-sm font-medium">Branch</Label>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                  <SelectValue>
                    <span className="text-text-default text-sm font-medium">{exportBranchSelected}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-border-default">
                  {exprtBranches.map(branch => (
                    <SelectItem key={branch} value={branch} className="text-text-default text-sm font-medium">
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {classes && classes.length > 0 && (
            <div className="space-y-2">
              <Label className="text-text-default text-sm font-medium">Class</Label>

              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                  <SelectValue>
                    <span className="text-text-default text-sm">{selectedClass}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {classes.map(value => (
                    <SelectItem key={value} value={value} className="text-text-default text-sm">
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {arms && arms.length > 0 && (
            <div className="space-y-2">
              <Label className="text-text-default text-sm font-medium">Arm</Label>

              <Select value={selectedArm} onValueChange={setSelectedArm}>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                  <SelectValue placeholder="Select Arm">
                    <span className="text-text-default text-sm">{selectedArm}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {arms.map(arm => (
                    <SelectItem key={arm} value={arm} className="text-text-default text-sm">
                      {arm}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="">
            {showTermFilter && (
              <Select value={exportTermSelected} onValueChange={setExportTermSelected}>
                <Label className="text-text-default mb-2 text-sm font-medium">Period</Label>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                  <SelectValue>
                    <span className="text-text-default text-sm font-medium">{exportTermSelected}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-border-default">
                  {exportTermsOptions.map(status => (
                    <SelectItem key={status} value={status} className="text-text-default text-sm font-medium">
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <Badge className="bg-bg-badge-green text-bg-basic-green-strong rounded-md">14 Fee Items Found</Badge>
        </div>
      </Modal>
      <MobileDrawer
        open={isOpen}
        setIsOpen={setIsOpen}
        title={
          <div className="flex items-center gap-2">
            <ShareBox fill="var(--color-icon-default-subtle)" className="bg-bg-state-soft h-8 w-8 rounded-full p-2" />
            <span>{exportTitle ?? "Export"}</span>
          </div>
        }
      >
        <div className="flex flex-col gap-5 px-4 py-4 md:px-6">
          <div className="text-text-default text-sm font-bold">Filter Selection</div>
          <div className="">
            {showBranchFilter && (
              <Select value={exportBranchSelected} onValueChange={setExportBranchSelected}>
                <Label className="text-text-default mb-2 text-sm font-medium">Branch</Label>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                  <SelectValue>
                    <span className="text-text-default text-sm font-medium">{exportBranchSelected}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-border-default">
                  {exprtBranches.map(branch => (
                    <SelectItem key={branch} value={branch} className="text-text-default text-sm font-medium">
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {classes && classes.length > 0 && (
            <div className="space-y-2">
              <Label className="text-text-default text-sm font-medium">Class</Label>

              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                  <SelectValue>
                    <span className="text-text-default text-sm">{selectedClass}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {classes.map(value => (
                    <SelectItem key={value} value={value} className="text-text-default text-sm">
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {arms && arms.length > 0 && (
            <div className="space-y-2">
              <Label className="text-text-default text-sm font-medium">Arm</Label>

              <Select value={selectedArm} onValueChange={setSelectedArm}>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                  <SelectValue placeholder="Select Arm">
                    <span className="text-text-default text-sm">{selectedArm}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {arms.map(arm => (
                    <SelectItem key={arm} value={arm} className="text-text-default text-sm">
                      {arm}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="">
            {showTermFilter && (
              <Select value={exportTermSelected} onValueChange={setExportTermSelected}>
                <Label className="text-text-default mb-2 text-sm font-medium">Period</Label>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                  <SelectValue>
                    <span className="text-text-default text-sm font-medium">{exportTermSelected}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-border-default">
                  {exportTermsOptions.map(status => (
                    <SelectItem key={status} value={status} className="text-text-default text-sm font-medium">
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <Badge className="bg-bg-badge-green text-bg-basic-green-strong rounded-md">14 Fee Items Found</Badge>
        </div>
        <DrawerFooter className="border-border-default border-t">
          <div className="flex justify-between">
            <DrawerClose asChild>
              <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
            </DrawerClose>
            <Button className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-brand-hover! h-7!">
              <ShareBox fill="var(--color-icon-white-default)" className="" /> {exportActionButton ?? "Export"}
            </Button>
          </div>
        </DrawerFooter>
      </MobileDrawer>

      <div className="flex w-full justify-between align-middle">
        <h2 className="text-text-default text-xl font-semibold">{title}</h2>

        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            {/* {showToggle && <Toggle />} */}

            <div className="hidden gap-2 align-middle md:flex">
              {showBranchFilter && (
                <Select value={branchSelected} onValueChange={setBranchSelected}>
                  <SelectTrigger className="border-border-darker h-8! w-auto border">
                    <SelectValue>
                      <Image src="/icons/school.svg" alt="branch" width={14} height={14} />
                      <span className="text-text-default text-sm font-medium">{branchSelected}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-card border-border-default">
                    {branches.map(branch => (
                      <SelectItem key={branch} value={branch} className="text-text-default text-sm font-medium">
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {showTermFilter && (
                <Select value={termSelected} onValueChange={setTermSelected}>
                  <SelectTrigger className="border-border-darker h-8! w-auto border">
                    <SelectValue>
                      <Calendar fill="var(--color-icon-black-muted)" className="size-4" />
                      <span className="text-text-default text-sm font-medium">{termSelected}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-card border-border-default">
                    {termsOptions.map(status => (
                      <SelectItem key={status} value={status} className="text-text-default text-sm font-medium">
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <Button className="bg-bg-state-soft block size-7 rounded-md p-1.5 md:hidden" onClick={() => setIsFilterOpen(true)}>
            <Image src="/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
          </Button>

          <MobileDrawer open={isFilterOpen} setIsOpen={setIsFilterOpen} title="Filter">
            <div className="flex w-full flex-col gap-4 px-3 py-4">
              {showBranchFilter && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <School fill="var(--color-icon-black-muted)" className="size-4" />
                    <Label className="text-text-default text-sm font-medium">Branch</Label>
                  </div>
                  <Select value={branchSelected} onValueChange={setBranchSelected}>
                    <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
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
              )}

              {showTermFilter && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar fill="var(--color-icon-black-muted)" className="size-4" />
                    <Label className="text-text-default text-sm font-medium">Period</Label>
                  </div>
                  <Select value={termSelected} onValueChange={setTermSelected}>
                    <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                      <SelectValue>
                        <span className="text-text-default text-sm">{termSelected}</span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-bg-default border-border-default">
                      {termsOptions.map(status => (
                        <SelectItem key={status} value={status} className="text-text-default text-sm">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
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

      <div className="mt-4 flex flex-col gap-3 md:mt-6 md:flex-row md:justify-between md:gap-2">
        {showSearch && <SearchInput className="bg-bg-input-soft! w-full rounded-md border-none md:w-71" />}

        <div className="flex gap-2">
          {showExport && (
            <Button
              onClick={() => setIsOpen(true)}
              className="bg-bg-state-secondary! border-border-default hover:bg-bg-state-secondary-hover! text-text-default h-7 rounded-md border text-sm font-normal md:h-8"
            >
              <ShareBox fill="var(--color-icon-default-muted)" /> Export
            </Button>
          )}

          <Button
            onClick={onAddClick}
            className="text-tex-white-default bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary-hover! h-7 rounded-md text-sm md:h-8"
          >
            <PlusIcon className="text-icon-white-default" /> {addButttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};
