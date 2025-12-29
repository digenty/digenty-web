import School from "@/components/Icons/School";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

export const FeeBranch = () => {
  return (
    <div className="border-border-default flex flex-col gap-6 rounded-md border p-4 md:rounded-none md:border-none md:p-0">
      <div className="">
        <div className="text-text-default text-md font-semibold">Select Branch</div>
        <div className="text-text-muted text-sm font-normal">Select branches that apply</div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2">
          <Checkbox />
          <School fill="var(--color-icon-default)" />
          <span className="text-text-default text-sm font-medium">Lawanson</span>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox />
          <School fill="var(--color-icon-default)" />
          <span className="text-text-default text-sm font-medium">Lawanson</span>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox />
          <School fill="var(--color-icon-default)" />
          <span className="text-text-default text-sm font-medium">Lawanson</span>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox />
          <School fill="var(--color-icon-default)" />
          <span className="text-text-default text-sm font-medium">Lawanson</span>
        </div>
      </div>

      <div className="md:border-border-default md:border-b md:pb-6">
        <div className="bg-bg-subtle border-border-default flex items-start justify-between gap-3 rounded-sm border px-4 py-3">
          <div className="">
            <div className="text-text-default text-sm font-medium">Set different prices for different branches</div>
            <div className="text-text-subtle text-sm font-normal">Assign unique fee amounts to each branch when their pricing differs.</div>
          </div>
          <Checkbox />
        </div>
      </div>
    </div>
  );
};
