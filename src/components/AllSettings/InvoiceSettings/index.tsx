"use client";

import { Avatar } from "@/components/Avatar";
import Edit from "@/components/Icons/Edit";
import { Toggle } from "@/components/Toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState } from "react";
const digits = [3, 4, 5, 6, 7, 8, 9];
const dueDates = ["Today", "Tomorrow"];
export const InvoiceSetting = () => {
  const [digit, setDigit] = useState<number>(digits[1]);
  const [dueDate, setDueDate] = useState(dueDates[0]);
  const [showReminderInput, setShowReminderInput] = useState(false);
  return (
    <div className="mx-auto my-6 flex w-full max-w-171 items-center justify-center">
      <div className="flex w-full flex-col gap-6">
        <div className="">
          <div className="mb-8 flex items-center justify-between">
            <div className="text-text-default text-lg font-semibold">Invoice Settings</div>
            <Button className="bg-bg-state-secondary! border-border-darker text-text-default rounded-md border">
              <Edit fill="var(--color-icon-default-muted)" /> Edit
            </Button>
          </div>
          <div className="text-text-default mb-4 text-sm font-medium">School Logo</div>
          <div className="flex flex-col gap-4">
            <div className="border-border-default flex items-center gap-4 border-b pb-4">
              <input type="file" accept="image/png,image/jpeg" className="hidden" aria-label="Upload school logo" />

              <Avatar className="size-10" />
              <Button className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! rounded-md border text-sm font-medium shadow">
                Upload
              </Button>
              <div className="text-text-muted text-xs">JPG or PNG. 1MB Max.</div>
            </div>
          </div>
        </div>
        <div className="text-text-default text-lg font-semibold">Invoice Numbering</div>

        <div className="border-border-default grid grid-cols-1 gap-6 border-b pb-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Invoice Prefix</Label>
            <Input className="bg-bg-input-soft! text-text-default w-full border-none" placeholder="Input Prefix" />
            <div className="text-text-muted text-xs">Common formats: INV-, FEE-, BILL-</div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Number Format</Label>
            <Input className="bg-bg-input-soft! text-text-default w-full border-none" placeholder="Input Format" />
            <div className="text-text-muted text-xs">Use tokens: YEAR, MONTH, SESSION, SEQ</div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Starting Number</Label>
            <Input className="bg-bg-input-soft! text-text-default w-full border-none" placeholder="Input First Number" />
            <div className="text-text-muted text-xs">The first invoice number to use</div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Padding</Label>
            <Select value={String(digit)} onValueChange={v => setDigit(Number(v))}>
              <SelectTrigger className="bg-bg-input-soft! h-9! w-full rounded-md border-none">
                <SelectValue>
                  <span className="text-text-default text-sm">{digit} Digits</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                {digits.map(dgt => (
                  <SelectItem key={dgt} value={String(dgt)} className="text-text-default text-sm font-medium">
                    {dgt} Digits
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border-border-default bg-bg-basic-blue-subtle flex w-full items-center gap-2 rounded-md border px-3 py-2.5">
          <div className="bg-bg-basic-blue-accent border-border-default h-6 w-1 border-2"></div>{" "}
          <div className="text-text-subtle text-sm">Next Invoice Number: ADM-20250001</div>
        </div>

        <div className="text-text-default text-lg font-semibold">Basic Setting</div>
        <div className="border-border-default flex w-full flex-col border-b pb-6 md:flex-row md:items-start md:justify-between md:gap-6">
          <div className="flex flex-col gap-2">
            <Label className="text-text-default w-full text-sm font-medium">Default Due Date</Label>
            <Select value={dueDate} onValueChange={setDueDate}>
              <SelectTrigger className="bg-bg-input-soft! h-9! w-full rounded-md border-none">
                <SelectValue>
                  <span className="text-text-default text-sm">{dueDate}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                {dueDates.map(dd => (
                  <SelectItem key={dd} value={dd} className="text-text-default text-sm font-medium">
                    {dd}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-text-muted invisible text-xs">
              This note will appear on all new invoices. You can edit it for individual invoices if needed.
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Default Invoice Note</Label>
            <Input className="bg-bg-input-soft! text-text-default w-full border-none text-sm" placeholder="Pay me my moeny" />
            <div className="text-text-muted text-xs">
              This note will appear on all new invoices. You can edit it for individual invoices if needed.
            </div>
          </div>
        </div>

        <div className="text-text-default text-lg font-semibold">Invoice Reminders</div>

        <div className="grid-col-1 grid w-full gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Before Due Date</Label>
            <Input className="bg-bg-input-soft! w-full rounded-md border-none" type="number" placeholder="1" />
            <div className="text-text-default text-sm font-medium">Days</div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">After Due Date</Label>
            <Input className="bg-bg-input-soft! w-full rounded-md border-none" type="number" placeholder="2" />
            <div className="text-text-default text-sm font-medium">Days</div>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <div className="text-text-default text-sm font-medium">Repeat Reminders</div>
            <div className="text-text-subtle text-sm">Send follow up reminders for unpaid invoice</div>
          </div>
          <Toggle checked={showReminderInput} onChange={e => setShowReminderInput((e.target as HTMLInputElement).checked)} />
        </div>
        {showReminderInput && (
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Repeat Every</Label>
            <Input className="border-border-default bg-bg-input-soft! text-text-default border" type="number" placeholder="0" />
            <span className="text-text-default text-sm font-medium">Days</span>
          </div>
        )}
      </div>
    </div>
  );
};
