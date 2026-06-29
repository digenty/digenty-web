"use client";

import { ArrowUpSFill, BookOpen, GraduationCap, School } from "@digenty/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormikContext } from "formik";
import React, { useMemo, useState } from "react";
import type { FeeItemFormValues } from "./useFeeForm";
import { buildClassesWithArms, useFeeFormData } from "./useFeeForm";

const FeesClassApplyTo = () => {
  const { values, errors, touched, setFieldValue } = useFormikContext<FeeItemFormValues>();
  const { classList, armList } = useFeeFormData();
  const [openId, setOpenId] = useState<number | null>(null);

  const classesWithArms = useMemo(() => buildClassesWithArms(classList, armList, values.branchIds), [classList, armList, values.branchIds]);

  const toggleOpen = (id: number) => setOpenId(prev => (prev === id ? null : id));

  const toggleArm = (armId: number, checked: boolean) => {
    const next = checked ? [...values.armIds, armId] : values.armIds.filter(id => id !== armId);
    setFieldValue("armIds", next);
    if (!checked) {
      setFieldValue(
        "classArmAmounts",
        values.classArmAmounts.filter(c => c.armId !== armId),
      );
    }
  };

  const toggleClass = (armIds: number[], checked: boolean) => {
    const set = new Set(values.armIds);
    armIds.forEach(id => (checked ? set.add(id) : set.delete(id)));
    setFieldValue("armIds", Array.from(set));
    if (!checked) {
      setFieldValue(
        "classArmAmounts",
        values.classArmAmounts.filter(c => !armIds.includes(c.armId)),
      );
    }
  };

  return (
    <div className="border-border-default border-b pb-6">
      <div className="border-border-default border-t border-r border-l">
        <div className="bg-bg-muted flex w-full items-center gap-3 px-6 py-3">
          <School fill="var(--color-icon-default)" />
          <div className="text-text-default">Classes</div>
        </div>

        {classesWithArms.length === 0 ? (
          <div className="text-text-muted px-6 py-4 text-sm">
            {values.branchIds.length === 0 ? "Select a branch to see its classes." : "No classes found for the selected branch(es)."}
          </div>
        ) : (
          <div>
            {classesWithArms.map(cl => {
              const armIds = cl.arms.map(a => a.armId);
              const allSelected = armIds.length > 0 && armIds.every(id => values.armIds.includes(id));
              return (
                <div className="border-border-default border-b p-3" key={cl.classId}>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox checked={allSelected} onCheckedChange={v => toggleClass(armIds, !!v)} />
                      <GraduationCap fill="var(--color-icon-default-muted)" />
                      <span className="text-text-default text-sm font-medium">{cl.className}</span>
                    </div>

                    <Button
                      type="button"
                      onClick={() => toggleOpen(cl.classId)}
                      className={`bg-bg-state-soft! hover:bg-bg-state-soft-hover! flex h-6! w-6! items-center justify-center rounded-sm ${
                        openId === cl.classId ? "rotate-180" : ""
                      }`}
                    >
                      <ArrowUpSFill fill="var(--color-icon-default-subtle)" />
                    </Button>
                  </div>

                  {openId === cl.classId && (
                    <div className="flex flex-col gap-3 px-8 pt-3">
                      {cl.arms.map(arm => (
                        <label key={arm.armId} className="flex cursor-pointer items-center gap-2">
                          <Checkbox checked={values.armIds.includes(arm.armId)} onCheckedChange={v => toggleArm(arm.armId, !!v)} />
                          <BookOpen />
                          <span className="text-text-default text-sm font-medium">{arm.armName}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {touched.armIds && typeof errors.armIds === "string" && <span className="text-text-destructive mt-2 block text-xs">{errors.armIds}</span>}
    </div>
  );
};

export default FeesClassApplyTo;
