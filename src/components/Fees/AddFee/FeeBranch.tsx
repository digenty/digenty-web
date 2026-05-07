import { School } from "@digenty/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { FormikProps } from "formik";
import { Branch, BranchWithClassLevels, FeeFormValues } from "@/api/types";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import React from "react";

interface Props {
  formik: FormikProps<FeeFormValues>;
}

function toBranches(list: unknown[]): Branch[] {
  return list
    .map(item => {
      if (item && typeof item === "object" && "branch" in item) return (item as BranchWithClassLevels).branch;
      return item as Branch;
    })
    .filter((b): b is Branch => !!b && typeof b === "object" && typeof (b as Branch).id === "number");
}

function extractBranches(data: unknown): Branch[] {
  if (!data) return [];
  if (Array.isArray(data)) return toBranches(data);
  const root = data as Record<string, unknown>;
  if (Array.isArray(root.data)) return toBranches(root.data as unknown[]);
  if (root.data && typeof root.data === "object") {
    const inner = root.data as Record<string, unknown>;
    if (Array.isArray(inner.content)) return toBranches(inner.content as unknown[]);
  }
  return [];
}

export const FeeBranch = ({ formik }: Props) => {
  const { data: branchesData, isLoading, isError } = useGetBranches();
  const branches: Branch[] = extractBranches(branchesData);
  const branchIds: number[] = formik.values.branchIds ?? [];

  const toggleBranch = (branchId: number, checked: boolean) => {
    if (checked) {
      formik.setFieldValue("branchIds", [...branchIds, branchId]);
    } else {
      formik.setFieldValue("branchIds", branchIds.filter(id => id !== branchId));
      // Remove arms belonging to this branch
      const remaining = (formik.values.selectedArmsInfo ?? []).filter(a => a.branchId !== branchId);
      formik.setFieldValue("selectedArmsInfo", remaining);
      formik.setFieldValue("armIds", remaining.map(a => a.armId));
    }
  };

  return (
    <div className="border-border-default flex flex-col gap-6 rounded-md border p-4 md:rounded-none md:border-none md:p-0">
      <div>
        <div className="text-text-default text-md font-semibold">Select Branch</div>
        <div className="text-text-muted text-sm font-normal">Select branches that apply</div>
      </div>

      {isLoading && <Skeleton className="bg-bg-input-soft h-20 w-full" />}

      {!isLoading && isError && (
        <p className="text-xs text-red-500">Failed to load branches. Please refresh.</p>
      )}

      {!isLoading && !isError && branches.length === 0 && (
        <p className="text-text-muted text-sm">No branches found for your school.</p>
      )}

      {!isLoading && !isError && branches.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {branches.map(branch => (
            <div key={branch.id} className="flex items-center gap-2">
              <Checkbox
                checked={branchIds.includes(branch.id)}
                onCheckedChange={(v: boolean) => toggleBranch(branch.id, !!v)}
              />
              <School fill="var(--color-icon-default)" />
              <span className="text-text-default text-sm font-medium">{branch.name}</span>
            </div>
          ))}
        </div>
      )}

      <div className="md:border-border-default md:border-b md:pb-6">
        <div className="bg-bg-subtle border-border-default flex items-start justify-between gap-3 rounded-sm border px-4 py-3">
          <div>
            <div className="text-text-default text-sm font-medium">Set different prices for different branches</div>
            <div className="text-text-subtle text-sm font-normal">Assign unique fee amounts to each branch when their pricing differs.</div>
          </div>
          <Checkbox
            checked={formik.values.setDifferentPricesPerBranch}
            onCheckedChange={(v: boolean) => formik.setFieldValue("setDifferentPricesPerBranch", v)}
          />
        </div>
      </div>
    </div>
  );
};
