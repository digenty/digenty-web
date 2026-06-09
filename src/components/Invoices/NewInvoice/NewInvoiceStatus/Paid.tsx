"use client";

import { ArrowRightS, Bank, BankCard, CalendarEventFill, Cash, Folder3, QuickReferenceAll, ResetLeft } from "@digenty/icons";
import { Avatar } from "@/components/Avatar";
import { NoteEditor } from "./NoteEditor";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { FormikProps } from "formik";
import type { InvoiceFormValues } from "../index";
import { useState } from "react";

const PAY_METHODS = [
  { label: "Bank Transfer - Terminal", value: "BANK_TRANSFER_TERMINAL", icon: Bank },
  { label: "Cash", value: "CASH", icon: Cash },
  { label: "POS", value: "POS", icon: BankCard },
  { label: "Other Bank Transfer", value: "OTHER_BANK_TRANSFER", icon: Folder3 },
];

type Props = { formik: FormikProps<InvoiceFormValues> };

export const Paid = ({ formik }: Props) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { values, errors, touched, setFieldValue, setFieldTouched } = formik;
  const selectedMethod = PAY_METHODS.find(m => m.value === values.paymentMethod) ?? PAY_METHODS[0];

  return (
    <div className="mt-6 flex w-full flex-col gap-6">
      <div className="flex w-full flex-col items-center gap-6 md:flex-row md:justify-between md:gap-3">
        {/* Payment Method */}
        <div className="w-full space-y-2">
          <Label className="text-text-default text-sm font-medium">Payment Method</Label>
          <Select value={values.paymentMethod} onValueChange={v => setFieldValue("paymentMethod", v)}>
            <SelectTrigger className="bg-bg-input-soft! hover:bg-bg-input-soft! flex h-9 w-full border-none">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <selectedMethod.icon fill="var(--color-icon-default-muted)" className="size-4" />
                  <span className="text-text-default text-sm font-medium">{selectedMethod.label}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default text-text-default border">
              {PAY_METHODS.map(m => (
                <SelectItem key={m.value} className="hover:bg-bg-input-soft cursor-pointer p-2" value={m.value}>
                  <m.icon fill="var(--color-icon-default-subtle)" className="size-4" /> {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Terminal Payment */}
        <div className="flex w-full flex-col gap-2">
          <Label className="text-text-default text-sm font-medium">Terminal Payment</Label>
          <Sheet>
            <SheetTrigger asChild className="bg-bg-input-soft! hover:bg-bg-input-soft! flex h-9 w-full cursor-pointer rounded-md border-none">
              <div className="flex items-center justify-between px-3">
                <Button className="hover:bg-bg-none! text-text-muted border-none p-0 text-sm font-normal">Select terminal payment</Button>
                <ArrowRightS fill="var(--color-icon-default-muted)" />
              </div>
            </SheetTrigger>
            <SheetContent className="bg-bg-card border-border-default mt-1.5 mr-1.5 h-[98vh] w-[97vw] rounded-md border md:w-130 [&>button]:hidden">
              <SheetHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="text-text-default text-md font-semibold">Select Terminal Payment</div>
                  <Button className="text-text-default border-border-darker bg-bg-secondary h-7 w-23 rounded-sm border px-2 py-1 text-sm">
                    <ResetLeft fill="var(--color-icon-default-muted)" /> Refresh
                  </Button>
                </div>
              </SheetHeader>
              <div className="m-0 flex h-screen place-content-center items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <QuickReferenceAll fill="var(--color-icon-bg-default)" />
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

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-text-default text-sm font-medium">
          Amount <span className="text-text-destructive">*</span>
        </Label>
        <div
          className={cn(
            "bg-bg-input-soft flex h-9 items-center rounded-md px-3",
            touched.amount && errors.amount && "border-border-destructive border",
          )}
        >
          <span className="text-text-muted mr-1 text-sm">₦</span>
          <Input
            id="amount"
            type="number"
            min={0}
            value={values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="0.00"
            className="h-full border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
          />
        </div>
        {touched.amount && errors.amount && <p className="text-text-destructive text-xs font-light">{errors.amount as string}</p>}
      </div>

      {/* Transaction Date */}
      <div className="space-y-2">
        <Label className="text-text-default text-sm font-medium">Transaction Date</Label>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button className="bg-bg-input-soft! hover:bg-bg-input-soft! flex h-9 w-full items-center justify-between rounded-md border-none">
              <span className="text-text-default text-sm">
                {values.transactionDate ? (
                  values.transactionDate.toLocaleDateString()
                ) : (
                  <small className="text-text-muted text-sm">dd / mm / yyyy</small>
                )}
              </span>
              <CalendarEventFill fill="var(--color-icon-default-muted)" className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-bg-card border-border-default border p-0">
            <Calendar
              mode="single"
              selected={values.transactionDate ?? undefined}
              onSelect={d => {
                setFieldValue("transactionDate", d ?? null);
                setFieldTouched("transactionDate", true);
                setCalendarOpen(false);
              }}
              className="text-text-default w-full text-sm!"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Paid By — API not ready yet */}
      <div className="border-border-default w-full border-b pb-6">
        <Select>
          <Label className="text-text-default mb-2 text-sm font-medium">
            Paid By <span className="text-text-destructive">*</span>
          </Label>
          <SelectTrigger className="bg-bg-input-soft! hover:bg-bg-input-soft! text-text-default w-full border-none">
            <SelectValue placeholder="Select payer" />
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default text-text-default border">
            <SelectGroup>
              <SelectItem value="1">
                <Avatar className="size-4" /> <span>Damilare John</span>
              </SelectItem>
              <SelectItem value="2">
                <Avatar className="size-4" /> <span>Damilare John</span>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <NoteEditor value={values.note} onChange={v => setFieldValue("note", v)} />

      <div className="flex items-center">
        <div className="w-full max-w-107">
          <div className="text-text-default text-sm font-medium">Show Account Details</div>
          <div className="text-text-subtle text-sm font-normal">
            Show the school account in payment and checkout on the invoice for offline payments
          </div>
        </div>
        <Switch checked={values.showAccountDetails} onCheckedChange={v => setFieldValue("showAccountDetails", v)} />
      </div>
    </div>
  );
};
