import { School } from "@digenty/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormikProps } from "formik";
import { FeeFormValues, SelectedArmInfo } from "@/api/types";
import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  formik: FormikProps<FeeFormValues>;
}

function groupByBranch(armsInfo: SelectedArmInfo[]): { branchId: number; branchName: string; arms: SelectedArmInfo[] }[] {
  const map = new Map<number, { branchId: number; branchName: string; arms: SelectedArmInfo[] }>();
  for (const arm of armsInfo) {
    if (!map.has(arm.branchId)) {
      map.set(arm.branchId, { branchId: arm.branchId, branchName: arm.branchName, arms: [] });
    }
    map.get(arm.branchId)!.arms.push(arm);
  }
  return Array.from(map.values());
}

const FeeAmount = ({ formik }: Props) => {
  const { values, errors, touched, setFieldValue } = formik;
  const showConfig = values.setDifferentPricesPerBranch || values.setDifferentPricesPerClass;
  const branchGroups = groupByBranch(values.selectedArmsInfo);

  const handleDifferentPerClassToggle = (checked: boolean) => {
    setFieldValue("setDifferentPricesPerClass", checked);
    if (checked && values.selectedArmsInfo.length > 0) {
      const existing = new Map(values.classArmAmounts.map(ca => [ca.armId, ca.amount]));
      setFieldValue(
        "classArmAmounts",
        values.selectedArmsInfo.map(a => ({ armId: a.armId, amount: existing.get(a.armId) ?? 0 })),
      );
    }
  };

  const handleDifferentPerBranchToggle = (checked: boolean) => {
    setFieldValue("setDifferentPricesPerBranch", checked);
    if (checked) {
      const uniqueBranches = Array.from(new Map(values.selectedArmsInfo.map(a => [a.branchId, a.branchName])).entries());
      const existing = new Map(values.branchAmounts.map(ba => [ba.branchId, ba.amount]));
      setFieldValue(
        "branchAmounts",
        uniqueBranches.map(([branchId]) => ({ branchId, amount: existing.get(branchId) ?? 0 })),
      );
    }
  };

  const updateBranchAmount = (branchId: number, amount: number) => {
    const updated = values.branchAmounts.map(ba => (ba.branchId === branchId ? { ...ba, amount } : ba));
    setFieldValue("branchAmounts", updated);
  };

  const updateArmAmount = (armId: number, amount: number) => {
    const updated = values.classArmAmounts.map(ca => (ca.armId === armId ? { ...ca, amount } : ca));
    if (!updated.some(ca => ca.armId === armId)) {
      updated.push({ armId, amount });
    }
    setFieldValue("classArmAmounts", updated);
  };

  const getArmAmount = (armId: number) => values.classArmAmounts.find(ca => ca.armId === armId)?.amount ?? 0;
  const getBranchAmount = (branchId: number) => values.branchAmounts.find(ba => ba.branchId === branchId)?.amount ?? 0;

  return (
    <div className="border-border-default flex flex-col gap-6 rounded-md border p-4 md:rounded-none md:border-none md:p-0">
      <div className="bg-bg-subtle border-border-default flex items-start justify-between gap-3 rounded-sm border px-4 py-3">
        <div>
          <div className="text-text-default text-sm font-medium">Set different prices for different classes</div>
          <div className="text-text-subtle text-sm font-normal">Assign unique fee amounts to each class when their pricing differs.</div>
        </div>
        <Checkbox checked={values.setDifferentPricesPerClass} onCheckedChange={(v: boolean) => handleDifferentPerClassToggle(!!v)} />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-text-default text-sm font-medium">Amount</Label>
        <Input
          type="number"
          value={values.amount === "" ? "" : String(values.amount)}
          onChange={e => setFieldValue("amount", e.target.value === "" ? "" : Number(e.target.value))}
          className={cn("bg-bg-input-soft! text-text-muted w-full border-none", errors.amount && touched.amount && "border border-red-500")}
          placeholder="₦0.00"
        />
        {touched.amount && errors.amount && <p className="text-xs text-red-500">{String(errors.amount)}</p>}
      </div>

      {showConfig && branchGroups.length > 0 && (
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-text-default text-md font-semibold">Fee Amount Configuration</div>
            <div className="text-text-muted text-sm font-normal">Input amount per {values.setDifferentPricesPerClass ? "class" : "branch"}</div>
          </div>

          {branchGroups.map(group => (
            <div key={group.branchId} className="overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5">
                <School fill="var(--color-icon-default)" className="size-4" />
                <span className="text-text-default text-sm font-medium">{group.branchName}</span>
              </div>

              {values.setDifferentPricesPerBranch && !values.setDifferentPricesPerClass && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="text-text-muted w-full text-sm">Branch amount</span>
                  <div className="flex w-full items-center gap-1 rounded-md bg-white px-2 shadow-sm ring-1 ring-gray-200">
                    <span className="text-text-muted text-sm">₦</span>
                    <Input
                      type="number"
                      value={getBranchAmount(group.branchId) || ""}
                      onChange={e => updateBranchAmount(group.branchId, Number(e.target.value))}
                      className="bg-bg-input-soft h-8! border-none text-sm shadow-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}

              {values.setDifferentPricesPerClass && (
                <div className="border-border-default rounded-lg border">
                  <div className="bg-bg-input-soft text-text-muted grid grid-cols-2 rounded-t-lg px-4 py-2 text-sm font-medium">
                    <span>Class</span>
                    <span>Amount</span>
                  </div>
                  {group.arms.map(arm => (
                    <div key={arm.armId} className="border-border-default grid grid-cols-2 items-center gap-3 border-t px-4 py-2">
                      <div className="bg-bg-input-soft text-text-default rounded-md px-3 py-2 text-sm">
                        {arm.className}
                        {arm.armName && arm.armName !== arm.className ? ` — ${arm.armName}` : ""}
                      </div>
                      <div className="bg-bg-input-soft flex items-center gap-1 rounded-md px-2">
                        <span className="text-text-muted text-sm">₦</span>
                        <Input
                          type="number"
                          value={getArmAmount(arm.armId) || ""}
                          onChange={e => updateArmAmount(arm.armId, Number(e.target.value))}
                          className="h-8! border-none text-sm shadow-none"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {branchGroups.length === 0 && (
            <p className="text-text-muted text-sm">No classes selected yet. Go back to the Classes step to select classes and arms.</p>
          )}
        </div>
      )}

      <div className="border-border-default flex items-start justify-between rounded-md border p-4">
        <div className="flex w-full flex-col gap-2">
          <div className="text-text-default text-sm font-medium">Allow part payment</div>
          <div className="text-text-subtle text-sm font-normal">
            Let parents pay this fee in instalments instead of paying the full amount at once.
          </div>
        </div>
        <Checkbox checked={values.allowPartPayment} onCheckedChange={(v: boolean) => setFieldValue("allowPartPayment", v)} />
      </div>

      {values.allowPartPayment && (
        <div className="flex flex-col gap-2">
          <Label className="text-text-default text-sm font-medium">Minimum Initial Payment</Label>
          <Input
            type="number"
            value={values.minimumPartPayment === "" ? "" : String(values.minimumPartPayment)}
            onChange={e => setFieldValue("minimumPartPayment", e.target.value === "" ? "" : Number(e.target.value))}
            className="bg-bg-input-soft! text-text-muted w-full border-none"
            placeholder="₦0.00"
          />
        </div>
      )}
    </div>
  );
};

export default FeeAmount;
