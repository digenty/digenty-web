import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState } from "react";

const digits = [3, 4, 5, 6, 7, 8, 9];

export const AdmissionNumberSetup = () => {
  const [digit, setDigit] = useState<number>(digits[1]);
  return (
    <div className="mx-auto flex items-center justify-center md:w-151">
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label className="text-text-default font-medum text-sm">Admission Number Prefix</Label>
          <Input className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm" placeholder="Input prefix" />
          <div className="text-text-muted text-xs">Common formats: ADM-, STD-, PUP-</div>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-text-default text-sm font-medium">Number Format</Label>
          <Input className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm" placeholder="Input format" />
          <div className="text-text-muted text-xs">Use tokens: PREFIX, YEAR, MONTH, SESSION, SEQ</div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-text-default text-sm font-medium">Starting Number</Label>
          <Input className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm" placeholder="Input first Number" />
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

        <div className="border-border-default bg-bg-basic-blue-subtle flex w-full items-center gap-2 rounded-md border px-3 py-2.5">
          <div className="bg-bg-basic-blue-accent border-border-default h-6 w-1 border-2"></div>{" "}
          <div className="text-text-subtle text-sm">Next Invoice Number: ADM-20250001</div>
        </div>
      </div>
    </div>
  );
};
