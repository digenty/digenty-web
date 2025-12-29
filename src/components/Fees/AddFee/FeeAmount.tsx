import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import React from "react";

const FeeAmount = () => {
  return (
    <div className="border-border-default flex flex-col gap-6 rounded-md border p-4 md:rounded-none md:border-none md:p-0">
      <div className="flex flex-col gap-2">
        <div className="text-text-default text-sm font-medium">Amount</div>
        <Input className="bg-bg-input-soft! text-text-muted w-full border-none" placeholder="₦0.00" />
        <div className="flex items-center gap-2">
          <Checkbox />
          <div className="text-text-muted text-xs font-normal">Set different prices per class</div>
        </div>
      </div>
      <div>
        <div className="text-text-default text-md font-semibold">Fee Amount Configuration</div>
        <div className="text-text-muted text-sm font-normal">Input amount per class</div>
      </div>
      <div className="border-border-default rounded-md border">
        <div className="bg-bg-input-soft text-text-muted flex items-center justify-between gap-2 p-3 text-sm">
          <div>Class</div>
          <div className="text-left">Amount</div>
        </div>

        <div className="flex w-full flex-col gap-5 p-3">
          <div className="flex w-full justify-between gap-4">
            <div className="bg-bg-input-soft text-text-default w-full rounded-md p-2 text-sm font-normal">SS 1 Art</div>
            <Input className="bg-bg-input-soft text-text-muted w-full rounded-md border-none p-2 text-sm font-normal" placeholder="₦ 0.00" />
          </div>

          <div className="flex justify-between gap-4">
            <div className="bg-bg-input-soft text-text-default w-full rounded-md p-2 text-sm font-normal">SS 1 Art</div>
            <Input className="bg-bg-input-soft text-text-muted w-full rounded-md border-none p-2 text-sm font-normal" placeholder="₦ 0.00" />
          </div>
        </div>
      </div>
      <div className="border-border-default flex items-start justify-between rounded-md border p-4">
        <div className="flex w-full flex-col gap-2">
          <div className="text-text-default text-sm font-medium">Allow part payment</div>
          <div className="text-text-subtle text-sm font-normal">
            Let parents pay this fee in instalments instead of paying the full amount at once.
          </div>
        </div>
        <Checkbox />
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-text-default text-sm font-medium">Minimum Initial Payment</div>
        <Input className="bg-bg-input-soft! text-text-muted w-full border-none" placeholder="₦0.00" />
      </div>
    </div>
  );
};

export default FeeAmount;
