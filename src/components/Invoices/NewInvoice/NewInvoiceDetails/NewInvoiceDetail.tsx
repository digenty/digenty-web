"use client";

import { DateRangePicker } from "@/components/DateRange";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export const NewInvoiceDetail = () => {
  const [range, setRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});
  return (
    <div className="md:border-border-default w-full pb-6 md:border-b">
      <div className="text-text-default mb-4 text-lg font-semibold">Invoice Details</div>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">
              Bill to <span className="text-text-destructive">*</span>
            </Label>
            <Input
              aria-required
              className="bg-bg-input-soft! hover:bg-bg-input-soft! text-text-default placeholder:text-text-default h-9 border-none text-sm"
              placeholder="Damilare John, Damilare John, Damilare John, Damilare John, Damilare John"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Invoice ID</Label>
            <Input
              className="bg-bg-input-soft! text-text-default hover:bg-bg-input-soft! placeholder:text-text-hint h-9 border-none text-sm"
              placeholder="INV-2024-033W21"
            />
          </div>
        </div>
        <DateRangePicker from={range.from} to={range.to} onChange={setRange} />
      </div>
    </div>
  );
};
