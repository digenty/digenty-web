"use client";

import React, { useState } from "react";
import { Modal } from "../Modal";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DrawerClose, DrawerFooter } from "../ui/drawer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { MobileDrawer } from "../MobileDrawer";
import ShareBox from "../Icons/ShareBox";
import { DateRangePicker } from "../DatePicker";
import { DateRange } from "react-day-picker";
import FileList3 from "../Icons/FileList3";
import CloseLarge from "../Icons/CloseLarge";
import AlertFill from "../Icons/AlertFill";
import { Check } from "../Icons/Check";
import { CheckDouble } from "../Icons/CheckDouble";
import { Draft } from "../Icons/Draft";
import { Badge } from "../ui/badge";

type InvoiceModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const branches = ["All Branches", "Lawanson", "Ilasamaja"];
const classes = ["JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3"];
const termsOptions = ["24/25 Third Term", "24/25 Second Term", "24/25 First Term"];
const arms = ["All Arms", "A", "B", "C"];

export const InvoiceExportModal = ({ open, setOpen }: InvoiceModalProps) => {
  const isMobile = useIsMobile();
  const [branchSelected, setBranchSelected] = useState(branches[0]);
  const [classSelected, setClassSelected] = useState(classes[0]);
  const [termSelected, setTermSelected] = useState(termsOptions[0]);

  const [armSelected, setArmSelected] = useState(arms[0]);
  const [fromValue, setFromValue] = useState<DateRange | undefined>();
  const [toValue, setToValue] = useState<DateRange | undefined>();

  return (
    <div>
      {isMobile ? (
        <MobileDrawer open={open} setIsOpen={setOpen} title="Filter">
          <div className="flex w-full flex-col gap-4 px-3 py-4">
            <h2 className="text-text-default text-sm font-bold">Filter Selection</h2>

            <div className="space-y-2">
              <Label className="text-text-default text-sm font-medium">Branch</Label>

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

            <div className="space-y-2">
              <Label className="text-text-default text-sm font-medium">Class</Label>

              <Select value={classSelected} onValueChange={setClassSelected}>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                  <SelectValue>
                    <span className="text-text-default text-sm">{classSelected}</span>
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

            <div className="space-y-2">
              <Label className="text-text-default text-sm font-medium">Arm</Label>

              <Select value={armSelected} onValueChange={setArmSelected}>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                  <SelectValue placeholder="Select Arm">
                    <span className="text-text-default text-sm">{classSelected}</span>
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

            <div className="space-y-2">
              <div className="">
                <Label className="text-text-default text-sm font-medium">Status</Label>
              </div>
              <Select>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                  <SelectValue placeholder="Select Invoice Status" className="text-text-default text-sm" />
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  <SelectGroup>
                    <SelectItem value="All Invoices" className="text-text-default text-sm">
                      <FileList3 fill="var(--color-icon-default-subtle)" /> All Invoices
                    </SelectItem>
                    <SelectItem value="Unpaid" className="text-text-default text-sm">
                      <CloseLarge fill="var(--color-icon-default-subtle)" /> Unpaid
                    </SelectItem>

                    <SelectItem value="Outstanding" className="text-text-default text-sm">
                      <AlertFill fill="var(--color-icon-default-subtle)" /> Outstanding
                    </SelectItem>

                    <SelectItem value="Paid Invoices" className="text-text-default text-sm">
                      <Check fill="var(--color-icon-default-subtle)" /> Paid Invoices
                    </SelectItem>
                    <SelectItem value="Fully Paid Invoices" className="text-text-default text-sm">
                      <CheckDouble fill="var(--color-icon-default-subtle)" />
                      Fully Paid Invoices
                    </SelectItem>
                    <SelectItem value="Draft Invoives" className="text-text-default text-sm">
                      <Draft fill="var(--color-icon-default-subtle)" /> Draft Invoives
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-text-default text-sm font-medium">Period</Label>

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

            <div className="flex gap-4">
              <DateRangePicker label="From" value={fromValue} onChange={setFromValue} className="bg-bg-input-soft! text-text-default" />

              <DateRangePicker label="To" value={toValue} onChange={setToValue} className="bg-bg-input-soft!" />
            </div>

            <Badge className="border-border-default bg-bg-badge-green text-bg-basic-green-strong flex items-center rounded-xs p-0.5">
              14 Invoices Found
            </Badge>
          </div>

          <DrawerFooter className="border-border-default border-t">
            <div className="flex justify-between">
              <DrawerClose asChild>
                <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-2 py-1 text-sm font-medium">Cancel</Button>
              </DrawerClose>

              <Button className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm">
                <ShareBox fill="var(--color-icon-white-default)" /> Export Invoice
              </Button>
            </div>
          </DrawerFooter>
        </MobileDrawer>
      ) : (
        <Modal
          open={open}
          setOpen={setOpen}
          title="Export Invoice"
          ActionButton={
            <Button className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm">
              <ShareBox fill="var(--color-icon-white-default)" /> Export Invoice
            </Button>
          }
        >
          <div className="flex w-full flex-col gap-4 px-3 py-4">
            <h2 className="text-text-default text-sm font-bold">Filter Selection</h2>

            <div className="space-y-2">
              <Label className="text-text-default text-sm font-medium">Branch</Label>

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

            <div className="space-y-2">
              <Label className="text-text-default text-sm font-medium">Class</Label>

              <Select value={classSelected} onValueChange={setClassSelected}>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                  <SelectValue>
                    <span className="text-text-default text-sm">{classSelected}</span>
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

            <div className="space-y-2">
              <Label className="text-text-default text-sm font-medium">Arm</Label>

              <Select value={armSelected} onValueChange={setArmSelected}>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                  <SelectValue placeholder="Select Arm">
                    <span className="text-text-default text-sm">{classSelected}</span>
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

            <div className="space-y-2">
              <div className="">
                <Label className="text-text-default text-sm font-medium">Status</Label>
              </div>
              <Select>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                  <SelectValue placeholder="Select Invoice Status" className="text-text-default text-sm" />
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  <SelectGroup>
                    <SelectItem value="All Invoices" className="text-text-default text-sm">
                      <FileList3 fill="var(--color-icon-default-subtle)" /> All Invoices
                    </SelectItem>
                    <SelectItem value="Unpaid" className="text-text-default text-sm">
                      <CloseLarge fill="var(--color-icon-default-subtle)" /> Unpaid
                    </SelectItem>

                    <SelectItem value="Outstanding" className="text-text-default text-sm">
                      <AlertFill fill="var(--color-icon-default-subtle)" /> Outstanding
                    </SelectItem>

                    <SelectItem value="Paid Invoices" className="text-text-default text-sm">
                      <Check fill="var(--color-icon-default-subtle)" /> Paid Invoices
                    </SelectItem>
                    <SelectItem value="Fully Paid Invoices" className="text-text-default text-sm">
                      <CheckDouble fill="var(--color-icon-default-subtle)" />
                      Fully Paid Invoices
                    </SelectItem>
                    <SelectItem value="Draft Invoives" className="text-text-default text-sm">
                      <Draft fill="var(--color-icon-default-subtle)" /> Draft Invoives
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-text-default text-sm font-medium">Period</Label>

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

            <div className="flex gap-4">
              <DateRangePicker label="From" value={fromValue} onChange={setFromValue} className="bg-bg-input-soft! text-text-default" />

              <DateRangePicker label="To" value={toValue} onChange={setToValue} className="bg-bg-input-soft!" />
            </div>

            <Badge className="border-border-default bg-bg-badge-green text-bg-basic-green-strong flex items-center rounded-sm p-0.5">
              14 Invoices Found
            </Badge>
          </div>
        </Modal>
      )}
    </div>
  );
};
