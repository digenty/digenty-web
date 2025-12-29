"use client";

import React, { useState } from "react";
import { NoteEditor } from "./NoteEditor";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ArrowRightS } from "@/components/Icons/ArrowRightS";
import { ResetLeft } from "@/components/Icons/ResetLeft";
import { QuickReferenceAll } from "@/components/Icons/QuickReferenceAll";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select";
import { Bank } from "@/components/Icons/Bank";
import { Avatar } from "@/components/Avatar";
import { Switch } from "@/components/ui/switch";
const payMethod = ["Bank Transfer", "Credit Card", "Cash"];

export const PartiallyPaid = () => {
  const [paymentMethod, setPaymentMethod] = useState(payMethod[0]);
  const [note, setNote] = useState("Your note");
  return (
    <div className="mt-6 flex w-full flex-col gap-6">
      <div className="flex w-full flex-col items-center gap-6 md:flex-row md:justify-between md:gap-3">
        <div className="flex w-full flex-col gap-2">
          <Label className="text-text-default tex-sm font-medium">Payment Method</Label>

          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger className="bg-bg-input-soft! hover:bg-bg-input-soft! flex h-9 w-full border-none">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <Bank fill="var(--color-icon-default-muted )" className="size-4" />
                  <span className="text-text-default text-sm font-medium">{paymentMethod}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default text-text-default border">
              {payMethod.map(method => (
                <SelectItem key={method} className="hover:bg-bg-input-soft cursor-pointer p-2" value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-full flex-col gap-2">
          <Label className="text-text-default tex-sm font-medium">Terminal Payment</Label>
          <Sheet>
            <SheetTrigger asChild className="bg-bg-input-soft! hover:bg-bg-input-soft! flex h-9 w-full cursor-pointer rounded-md border-none">
              <div className="flex items-center justify-between px-3">
                <Button className="hover:bg-bg-none! text-text-muted border-none p-0 text-sm font-normal">Select terminal payment</Button>{" "}
                <ArrowRightS fill="var(--color-icon-default-muted )" />
              </div>
            </SheetTrigger>

            <SheetContent className="bg-bg-card border-border-default mt-1.5 mr-1.5 h-[98vh] w-[97vw] rounded-md border md:w-130 [&>button]:hidden">
              <SheetHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
                <div className="flex items-center justify-between">
                  {" "}
                  <div className="text-text-default text-md font-semibold">Select Terminal Payment</div>
                  <Button className="text-text-default border-border-darker bg-bg-secondary h-7 w-23 rounded-sm border px-2 py-1 text-sm">
                    <ResetLeft fill="var(--color-icon-default-muted )" /> Refresh
                  </Button>
                </div>
              </SheetHeader>
              <div className="m-0 flex h-screen place-content-center items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <QuickReferenceAll fill="var(--color-icon-bg-default )" />
                  <div className="flex flex-col items-center">
                    <p className="text-text-default text-sm font-medium">No Terminal Transaction</p>
                    <span className="text-text-muted text-xs font-normal">There are no transactions to match to payments</span>
                  </div>
                  <SheetClose asChild>
                    <Button className="border-border-darker bg-bg-state-secondary! text-text-default h-7 w-14.5 rounded-sm border px-2 py-1 text-sm">
                      Close
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="border-border-default w-full border-b pb-6">
        <Select>
          <Label className="text-text-default tex-sm mb-2 font-medium">
            Paid By <span className="text-text-destructive">*</span>
          </Label>
          <SelectTrigger className="bg-bg-input-soft! hover:bg-bg-input-soft! text-text-default w-full border-none">
            <SelectValue placeholder="Select player" />
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default text-text-default border">
            <SelectGroup>
              <SelectItem value="apple">
                <Avatar username="Damilare John" className="size-4" /> <span>Damilare John</span>
              </SelectItem>
              <SelectItem value="banana">
                <Avatar username="Damilare John" className="size-4" /> <span>Damilare John</span>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <NoteEditor value={note} onChange={setNote} />
      <div className="flex items-center">
        <div className="w-full max-w-107">
          <div className="text-text-default text-sm font-medium">Show Account Details</div>
          <div className="text-text-subtle text-sm font-normal">
            Show the school account in payment and checkout on the invoice for offline payments
          </div>
        </div>

        <Switch />
      </div>
    </div>
  );
};
