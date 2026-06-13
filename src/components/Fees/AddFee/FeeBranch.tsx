"use client";

import { School } from "@digenty/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useFormikContext } from "formik";
import React from "react";
import type { FeeItemFormValues } from "./useFeeForm";
import { useFeeFormData } from "./useFeeForm";

export const FeeBranch = () => {
  const { values, errors, touched, setFieldValue } = useFormikContext<FeeItemFormValues>();
  const { branchList, loadingBranches } = useFeeFormData();

  const toggleBranch = (branchId: number, checked: boolean) => {
    const next = checked ? [...values.branchIds, branchId] : values.branchIds.filter(id => id !== branchId);
    setFieldValue("branchIds", next);

    // Drop any arm/branch pricing that no longer belongs to a selected branch.
    if (!checked) {
      setFieldValue(
        "branchAmounts",
        values.branchAmounts.filter(b => b.branchId !== branchId),
      );
    }
  };

  return (
    <div className="border-border-default flex flex-col gap-6 rounded-md border p-4 md:rounded-none md:border-none md:p-0">
      <div>
        <div className="text-text-default text-md font-semibold">Select Branch</div>
        <div className="text-text-muted text-sm font-normal">Select branches that apply</div>
      </div>

      {loadingBranches ? (
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="bg-bg-input-soft h-6 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {branchList.map(branch => (
            <label key={branch.id} className="flex cursor-pointer items-center gap-2">
              <Checkbox checked={values.branchIds.includes(branch.id)} onCheckedChange={v => toggleBranch(branch.id, !!v)} />
              <School fill="var(--color-icon-default)" />
              <span className="text-text-default text-sm font-medium">{branch.name ?? `Branch ${branch.id}`}</span>
            </label>
          ))}
        </div>
      )}
      {touched.branchIds && typeof errors.branchIds === "string" && <span className="text-text-destructive text-xs">{errors.branchIds}</span>}

      <div className="md:border-border-default md:border-b md:pb-6">
        <label className="bg-bg-subtle border-border-default flex cursor-pointer items-start justify-between gap-3 rounded-sm border px-4 py-3">
          <div>
            <div className="text-text-default text-sm font-medium">Set different prices for different branches</div>
            <div className="text-text-subtle text-sm font-normal">Assign unique fee amounts to each branch when their pricing differs.</div>
          </div>
          <Checkbox checked={values.setDifferentPricesPerBranch} onCheckedChange={v => setFieldValue("setDifferentPricesPerBranch", !!v)} />
        </label>
      </div>
    </div>
  );
};
