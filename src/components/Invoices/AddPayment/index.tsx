"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { PopoverContent, PopoverTrigger, Popover } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/Avatar";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { CalendarEventFill } from "@/components/Icons/CalendarEventFill";
import { ArrowRightS } from "@/components/Icons/ArrowRightS";
import { QuickReferenceAll } from "@/components/Icons/QuickReferenceAll";
import { ResetLeft } from "@/components/Icons/ResetLeft";
import { Bank } from "@/components/Icons/Bank";
import { Cash } from "@/components/Icons/Cash";
import BankCard from "@/components/Icons/BankCard";
import { Folder3 } from "@/components/Icons/Folder3";
import { useRouter } from "next/navigation";

const payMethod = [
  { label: "Bank Transfer - Terminal", icon: Bank },
  // { label: "Credit Card", icon: Cash },
  { label: "Cash", icon: Cash },
  { label: "POS", icon: BankCard },
  { label: "Other Bank Transfer", icon: Folder3 },
];

export const AddPAyment = () => {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(payMethod[0]);
  return (
    <div>
      <div className="bg-bg-card-subtle border-border-default flex h-13 w-full items-center justify-center border px-4 py-3">
        <div className="w-full md:w-150">
          <div className="flex w-full items-center justify-between md:gap-30">
            <div className="text-text-default text-md font-semibold">Add Payment</div>
            <Button className="bg-bg-state-soft text-text-subtle hidden h-7 rounded-sm px-2 py-1 text-sm font-medium md:block">
              Change (this will be deleted)
            </Button>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center p-4">
        <div className="flex w-full flex-col gap-6 md:max-w-150">
          <div>
            <Popover open={open} onOpenChange={setOpen}>
              <Label className="text-text-default tex-sm mb-2 font-medium">
                Transaction Date <span className="text-text-destructive">*</span>
              </Label>
              <PopoverTrigger asChild>
                <Button className="bg-bg-input-soft! hover:bg-bg-input-soft! flex h-9 w-full items-center justify-between rounded-md border-none">
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="text-text-default text-sm">
                      {date ? date.toLocaleDateString() : <small className="text-text-muted text-sm">dd / mm / yyyy</small>}
                    </span>
                    <CalendarEventFill fill="var(--color-icon-default-muted)" className="size-4" />
                  </div>
                </Button>
              </PopoverTrigger>

              <PopoverContent className="bg-bg-card border-border-default w-full border p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={d => {
                    setDate(d);
                    setOpen(false);
                  }}
                  className="text-text-default w-full text-sm!"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label className="text-text-default tex-sm mb-2 font-medium">
              Payment Method <span className="text-text-destructive">*</span>
            </Label>

            <Select
              value={paymentMethod.label}
              onValueChange={value => {
                const selectedMethod = payMethod.find(method => method.label === value);
                if (selectedMethod) {
                  setPaymentMethod(selectedMethod);
                }
              }}
            >
              <SelectTrigger className="bg-bg-input-soft! hover:bg-bg-input-soft! flex h-9 w-full border-none">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <Bank fill="var(--color-icon-default-muted )" className="size-4" />
                    <span className="text-text-muted text-sm font-medium">{paymentMethod.label}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default text-text-default border">
                {payMethod.map(method => (
                  <SelectItem key={method.label} className="hover:bg-bg-input-soft cursor-pointer p-2" value={method.label}>
                    <method.icon fill="var(--color-icon-default-subtle )" className="size-4" />
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-text-default tex-sm mb-2 font-medium">
              Terminal Payment<span className="text-text-destructive">*</span>
            </Label>
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

          <div className="">
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
                    <Avatar className="size-4" /> <span>Damilare John</span>
                  </SelectItem>
                  <SelectItem value="banana">
                    <Avatar className="size-4" /> <span>Damilare John</span>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-text-default tex-sm mb-2 font-medium">Note </Label>
            <Textarea className="bg-bg-input-soft! hover:bg-bg-input-soft! h-16 w-full rounded-md md:w-150" rows={20} />
          </div>
        </div>
      </div>

      <div className="border-border-default fixed bottom-0 w-screen overflow-hidden border-t p-4">
        <div className="flex items-center justify-center">
          <div className="relative flex w-full justify-between md:ml-[-65] md:max-w-150">
            <Button onClick={() => router.back()} className="bg-bg-state-soft text-text-subtle h-7 w-18 rounded-md px-2.5 py-1.5 text-sm">
              Close
            </Button>
            <Button className="bg-bg-state-primary hover:bg-bg-state-primary-hover/90! text-text-white-default h-7 rounded-md px-2.5 py-1.5 text-sm">
              Add Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
