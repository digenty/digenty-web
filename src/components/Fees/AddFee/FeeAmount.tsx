"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useFormikContext } from "formik";
import React, { useMemo } from "react";
import type { FeeItemFormValues } from "./useFeeForm";
import { buildClassesWithArms, useFeeFormData } from "./useFeeForm";

const FeeAmount = () => {
  const { values, errors, touched, setFieldValue, handleChange, handleBlur } = useFormikContext<FeeItemFormValues>();
  const { classList, armList, branchList } = useFeeFormData();

  const classesWithArms = useMemo(() => buildClassesWithArms(classList, armList, values.branchIds), [classList, armList, values.branchIds]);

  // Selected arms, with a readable "Class Arm" label, for the per-class pricing table.
  const selectedArms = useMemo(() => {
    const rows: { armId: number; label: string }[] = [];
    classesWithArms.forEach(cl => {
      cl.arms.forEach(arm => {
        if (values.armIds.includes(arm.armId)) rows.push({ armId: arm.armId, label: `${cl.className} ${arm.armName}` });
      });
    });
    return rows;
  }, [classesWithArms, values.armIds]);

  const selectedBranches = useMemo(() => branchList.filter(b => values.branchIds.includes(b.id)), [branchList, values.branchIds]);

  const armAmount = (armId: number) => values.classArmAmounts.find(c => c.armId === armId)?.amount ?? "";
  const setArmAmount = (armId: number, amount: number | "") => {
    const others = values.classArmAmounts.filter(c => c.armId !== armId);
    setFieldValue("classArmAmounts", [...others, { armId, amount }]);
  };

  const branchAmount = (branchId: number) => values.branchAmounts.find(b => b.branchId === branchId)?.amount ?? "";
  const setBranchAmount = (branchId: number, amount: number | "") => {
    const others = values.branchAmounts.filter(b => b.branchId !== branchId);
    setFieldValue("branchAmounts", [...others, { branchId, amount }]);
  };

  const showFlatAmount = !values.setDifferentPricesPerBranch && !values.setDifferentPricesPerClass;

  return (
    <div className="border-border-default flex flex-col gap-6 rounded-md border p-4 md:rounded-none md:border-none md:p-0">
      {showFlatAmount && (
        <div className="flex flex-col gap-2">
          <div className="text-text-default text-sm font-medium">Amount</div>
          <Input
            name="amount"
            type="number"
            value={values.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            className="bg-bg-input-soft! text-text-default w-full border-none"
            placeholder="₦0.00"
          />
          {touched.amount && errors.amount && <span className="text-text-destructive text-xs">{errors.amount}</span>}
        </div>
      )}

      <label className="flex cursor-pointer items-center gap-2">
        <Checkbox checked={values.setDifferentPricesPerClass} onCheckedChange={v => setFieldValue("setDifferentPricesPerClass", !!v)} />
        <div className="text-text-muted text-xs font-normal">Set different prices per class</div>
      </label>

      {values.setDifferentPricesPerClass && (
        <div>
          <div className="text-text-default text-md font-semibold">Fee Amount Configuration</div>
          <div className="text-text-muted mb-3 text-sm font-normal">Input amount per class</div>
          <div className="border-border-default rounded-md border">
            <div className="bg-bg-input-soft text-text-muted flex items-center justify-between gap-2 p-3 text-sm">
              <div>Class</div>
              <div className="text-left">Amount</div>
            </div>
            <div className="flex w-full flex-col gap-5 p-3">
              {selectedArms.length === 0 ? (
                <div className="text-text-muted text-sm">Select classes/arms first.</div>
              ) : (
                selectedArms.map(row => (
                  <div key={row.armId} className="flex w-full justify-between gap-4">
                    <div className="bg-bg-input-soft text-text-default w-full rounded-md p-2 text-sm font-normal">{row.label}</div>
                    <Input
                      type="number"
                      value={armAmount(row.armId)}
                      onChange={e => setArmAmount(row.armId, e.target.value === "" ? "" : Number(e.target.value))}
                      className="bg-bg-input-soft text-text-default w-full rounded-md border-none p-2 text-sm font-normal"
                      placeholder="₦ 0.00"
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {values.setDifferentPricesPerBranch && (
        <div>
          <div className="text-text-default text-md font-semibold">Branch Amount Configuration</div>
          <div className="text-text-muted mb-3 text-sm font-normal">Input amount per branch</div>
          <div className="border-border-default rounded-md border">
            <div className="bg-bg-input-soft text-text-muted flex items-center justify-between gap-2 p-3 text-sm">
              <div>Branch</div>
              <div className="text-left">Amount</div>
            </div>
            <div className="flex w-full flex-col gap-5 p-3">
              {selectedBranches.length === 0 ? (
                <div className="text-text-muted text-sm">Select branches first.</div>
              ) : (
                selectedBranches.map(branch => (
                  <div key={branch.id} className="flex w-full justify-between gap-4">
                    <div className="bg-bg-input-soft text-text-default w-full rounded-md p-2 text-sm font-normal">
                      {branch.name ?? `Branch ${branch.id}`}
                    </div>
                    <Input
                      type="number"
                      value={branchAmount(branch.id)}
                      onChange={e => setBranchAmount(branch.id, e.target.value === "" ? "" : Number(e.target.value))}
                      className="bg-bg-input-soft text-text-default w-full rounded-md border-none p-2 text-sm font-normal"
                      placeholder="₦ 0.00"
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <label className="border-border-default flex cursor-pointer items-start justify-between rounded-md border p-4">
        <div className="flex w-full flex-col gap-2">
          <div className="text-text-default text-sm font-medium">Allow part payment</div>
          <div className="text-text-subtle text-sm font-normal">
            Let parents pay this fee in instalments instead of paying the full amount at once.
          </div>
        </div>
        <Checkbox checked={values.allowPartPayment} onCheckedChange={v => setFieldValue("allowPartPayment", !!v)} />
      </label>

      {values.allowPartPayment && (
        <div className="flex flex-col gap-2">
          <div className="text-text-default text-sm font-medium">Minimum Initial Payment</div>
          <Input
            name="minimumPartPayment"
            type="number"
            value={values.minimumPartPayment}
            onChange={handleChange}
            onBlur={handleBlur}
            className="bg-bg-input-soft! text-text-default w-full border-none"
            placeholder="₦0.00"
          />
          {touched.minimumPartPayment && errors.minimumPartPayment && (
            <span className="text-text-destructive text-xs">{errors.minimumPartPayment}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default FeeAmount;
