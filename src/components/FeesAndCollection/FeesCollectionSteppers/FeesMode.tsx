import School from "@/components/Icons/School";
import { Stack } from "@/components/Icons/Stack";
import { RoundedCheckbox } from "@/components/RoundedCheckbox";
import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  selected: "oneAccount" | "differentAccounts" | null;
  onSelect: (value: "oneAccount" | "differentAccounts") => void;
}

export const FeesMode = ({ selected, onSelect }: Props) => {
  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="text-text-default text-lg font-semibold">How should fees be collected across branches?</div>

        <div className="text-text-muted text-sm">
          This controls the default account used for each branch. You can still route specific fees to other accounts.
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div
          onClick={() => onSelect("oneAccount")}
          className={cn(
            "bg-bg-card flex cursor-pointer items-start justify-between rounded-md border p-4 shadow-sm",
            selected === "oneAccount" ? "border-border-informative border-2" : "border-border-default",
          )}
        >
          <div className="flex flex-col gap-1">
            <School fill="var(--color-icon-default-subtle)" />
            <div className="text-text-default text-sm font-medium">Use one account for all branches</div>
            <div className="text-text-subtle text-sm">Recommended for most schools. Simple setup with one main collection account.</div>
          </div>

          <div onClick={e => e.stopPropagation()}>
            <RoundedCheckbox checked={selected === "oneAccount"} onChange={() => onSelect("oneAccount")} />
          </div>
        </div>

        <div
          onClick={() => onSelect("differentAccounts")}
          className={cn(
            "bg-bg-card flex cursor-pointer items-start justify-between rounded-md border p-4",
            selected === "differentAccounts" ? "border-border-informative border-2" : "border-border-default",
          )}
        >
          <div className="flex flex-col gap-1">
            <Stack fill="var(--color-icon-default-subtle)" />
            <div className="text-text-default text-sm font-medium">Use different accounts per branch</div>
            <div className="text-text-subtle text-sm">Each branch can collect fees into its own account.</div>
          </div>

          <RoundedCheckbox checked={selected === "differentAccounts"} onChange={() => onSelect("differentAccounts")} />
        </div>
      </div>
    </div>
  );
};
