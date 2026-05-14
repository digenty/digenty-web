"use client";

import { ArrowUpSFill, BookOpen, GraduationCap, School } from "@digenty/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormikProps } from "formik";
import { BranchWithClassLevels, ClassInLevelDetails, FeeFormValues, SelectedArmInfo } from "@/api/types";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetClassesByLevel } from "@/hooks/queryHooks/useClass";
import { unwrapArray } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useState } from "react";

interface Props {
  formik: FormikProps<FeeFormValues>;
}

function extractBranchEntries(data: unknown): BranchWithClassLevels[] {
  if (!data) return [];
  const root = data as Record<string, unknown>;
  const list = (Array.isArray(root.data) ? root.data : Array.isArray(data) ? data : []) as unknown[];
  return list.filter(
    (item): item is BranchWithClassLevels =>
      !!item && typeof item === "object" && "branch" in item && "classLevels" in item,
  );
}

type ClassRowEntry = ClassInLevelDetails & { branchId: number; branchName: string };

function ClassRow({ cls, formik }: { cls: ClassRowEntry; formik: FormikProps<FeeFormValues> }) {
  const [open, setOpen] = useState(false);
  const selectedArmIds = formik.values.armIds ?? [];
  const allArmIds = cls.arms.map(a => a.id);
  const hasNoArms = cls.arms.length === 0;

  // For arm-less classes use classId as a sentinel arm ID
  const allSelected = hasNoArms
    ? selectedArmIds.includes(cls.classId)
    : allArmIds.length > 0 && allArmIds.every(id => selectedArmIds.includes(id));

  const updateArm = (armId: number, armName: string, checked: boolean) => {
    const currentIds = formik.values.armIds ?? [];
    const currentInfo = formik.values.selectedArmsInfo ?? [];
    const meta: SelectedArmInfo = {
      armId,
      armName,
      classId: cls.classId,
      className: cls.className,
      branchId: cls.branchId,
      branchName: cls.branchName,
    };
    if (checked) {
      formik.setFieldValue("armIds", [...currentIds, armId]);
      formik.setFieldValue("selectedArmsInfo", [...currentInfo, meta]);
    } else {
      formik.setFieldValue("armIds", currentIds.filter(id => id !== armId));
      formik.setFieldValue("selectedArmsInfo", currentInfo.filter(a => a.armId !== armId));
    }
  };

  const toggleAll = (checked: boolean) => {
    const currentIds = formik.values.armIds ?? [];
    const currentInfo = formik.values.selectedArmsInfo ?? [];

    if (hasNoArms) {
      // No arms — treat the class itself as the selectable unit
      if (checked) {
        const meta: SelectedArmInfo = {
          armId: cls.classId,
          armName: cls.className,
          classId: cls.classId,
          className: cls.className,
          branchId: cls.branchId,
          branchName: cls.branchName,
        };
        formik.setFieldValue("armIds", [...currentIds, cls.classId]);
        formik.setFieldValue("selectedArmsInfo", [...currentInfo, meta]);
      } else {
        formik.setFieldValue("armIds", currentIds.filter(id => id !== cls.classId));
        formik.setFieldValue("selectedArmsInfo", currentInfo.filter(a => a.armId !== cls.classId));
      }
      return;
    }

    if (checked) {
      const newArms = cls.arms.filter(a => !currentIds.includes(a.id));
      const newInfo: SelectedArmInfo[] = newArms.map(a => ({
        armId: a.id,
        armName: a.name,
        classId: cls.classId,
        className: cls.className,
        branchId: cls.branchId,
        branchName: cls.branchName,
      }));
      formik.setFieldValue("armIds", [...currentIds, ...newArms.map(a => a.id)]);
      formik.setFieldValue("selectedArmsInfo", [...currentInfo, ...newInfo]);
    } else {
      formik.setFieldValue("armIds", currentIds.filter(id => !allArmIds.includes(id)));
      formik.setFieldValue("selectedArmsInfo", currentInfo.filter(a => !allArmIds.includes(a.armId)));
    }
  };

  return (
    <div className="border-border-default border-b p-3">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Checkbox checked={allSelected} onCheckedChange={(v: boolean) => toggleAll(!!v)} />
          <GraduationCap fill="var(--color-icon-default-muted)" />
          <span className="text-text-default text-sm font-medium">{cls.className}</span>
        </div>
        {!hasNoArms && (
          <Button
            type="button"
            onClick={() => setOpen(p => !p)}
            className={`bg-bg-state-soft! hover:bg-bg-state-soft-hover! flex h-6! w-6! items-center justify-center rounded-sm ${open ? "rotate-180" : ""}`}
          >
            <ArrowUpSFill fill="var(--color-icon-default-subtle)" />
          </Button>
        )}
      </div>

      {open && !hasNoArms && (
        <div className="flex flex-col gap-3 px-8 pt-3">
          {cls.arms.map(arm => (
            <div key={arm.id} className="flex items-center gap-2">
              <Checkbox
                checked={selectedArmIds.includes(arm.id)}
                onCheckedChange={(v: boolean) => updateArm(arm.id, arm.name, !!v)}
              />
              <BookOpen />
              <span className="text-text-default text-sm font-medium">{arm.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LevelClasses({
  level,
  branchId,
  branchName,
  formik,
}: {
  level: { id: number };
  branchId: number;
  branchName: string;
  formik: FormikProps<FeeFormValues>;
}) {
  const { data: classesData, isLoading } = useGetClassesByLevel(level.id);
  const classes = unwrapArray<ClassInLevelDetails>(classesData);

  if (isLoading) {
    return (
      <div className="border-border-default border-b px-6 py-3">
        <Skeleton className="h-4 w-40" />
      </div>
    );
  }

  if (classes.length === 0) return null;

  return (
    <>
      {classes.map(c => (
        <ClassRow
          key={`${branchId}-${level.id}-${c.classId}`}
          cls={{ ...c, branchId, branchName }}
          formik={formik}
        />
      ))}
    </>
  );
}

function BranchSection({ entry, formik }: { entry: BranchWithClassLevels; formik: FormikProps<FeeFormValues> }) {
  const branch = entry.branch;
  const branchName = branch.name ?? "Branch";

  return (
    <>
      <div className="bg-bg-muted flex w-full items-center gap-3 px-6 py-3">
        <School fill="var(--color-icon-default)" />
        <div className="text-text-default text-sm font-medium">{branchName}</div>
      </div>

      {entry.classLevels.length === 0 && (
        <p className="text-text-muted px-6 py-3 text-sm">No classes set up for this branch.</p>
      )}

      {entry.classLevels.map(level => (
        <LevelClasses
          key={`${branch.id}-${level.id}`}
          level={level}
          branchId={branch.id}
          branchName={branchName}
          formik={formik}
        />
      ))}
    </>
  );
}

const FeesClassApplyTo = ({ formik }: Props) => {
  const { data: branchesData, isLoading } = useGetBranches();
  const allEntries = extractBranchEntries(branchesData);
  const selectedBranchIds = formik.values.branchIds ?? [];
  const selectedEntries = allEntries.filter(e => selectedBranchIds.includes(e.branch.id));

  if (isLoading) {
    return <Skeleton className="bg-bg-input-soft h-40 w-full" />;
  }

  if (selectedBranchIds.length === 0) {
    return (
      <div className="border-border-default rounded-md border p-6 text-center">
        <p className="text-text-muted text-sm">No branches selected. Please go back and select at least one branch.</p>
      </div>
    );
  }

  return (
    <div className="border-border-default border-b pb-6">
      <div className="border-border-default border-t border-r border-l">
        {selectedEntries.map(entry => (
          <BranchSection key={entry.branch.id} entry={entry} formik={formik} />
        ))}
      </div>

      {formik.errors.armIds && formik.touched.armIds && (
        <p className="mt-1 px-4 text-xs text-red-500">{String(formik.errors.armIds)}</p>
      )}
    </div>
  );
};

export default FeesClassApplyTo;
