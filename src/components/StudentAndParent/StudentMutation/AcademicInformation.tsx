"use client";
import { Arm, BranchWithClassLevels, ClassType } from "@/api/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetArmsByClass } from "@/hooks/queryHooks/useArm";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetClasses } from "@/hooks/queryHooks/useClass";
import { cn, getAcademicYears } from "@/lib/utils";
import { terms } from "@/types";
import { FormikProps } from "formik";
import { useState } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { AdmissionStatusValues, BoardingStatusValues } from "../constants";
import { StudentInputValues } from "../types";
import { AdmissionNumberField } from "./AdmissionNumberField";

export const AcademicInformation = ({ formik }: { formik: FormikProps<StudentInputValues> }) => {
  const [classId, setClassId] = useState<number | null>(null);
  const [branchId, setBranchId] = useState<number | undefined>();

  const { data: branches, isPending: loadingBranches } = useGetBranches();
  const { data: classes, isPending: loadingClasses } = useGetClasses(branchId);
  const { data: arms, isPending: loadingArms } = useGetArmsByClass(classId);

  const { handleBlur, handleChange, errors, touched, values } = formik;
  return (
    <div className="border-border-default space-y-6 border-b py-6">
      <h2 className="text-lg font-semibold">Academic Information</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5">
        <div className="space-y-2">
          <Label htmlFor="joinedSchoolSession" className="text-text-default text-sm font-medium">
            Joined School Session<small className="text-text-destructive text-xs">*</small>
          </Label>
          <Select onValueChange={value => formik.setFieldValue("joinedSchoolSession", value)}>
            <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
              <SelectValue placeholder="Select Session" />
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-none">
              {getAcademicYears().map(session => (
                <SelectItem key={session} className="text-text-default" value={session}>
                  {session}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality" className="text-text-default text-sm font-medium">
            Joined School Term<small className="text-text-destructive text-xs">*</small>
          </Label>
          <Select onValueChange={value => formik.setFieldValue("joinedSchoolTerm", value)}>
            <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
              <SelectValue placeholder="Select Term" />
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-none">
              {terms.map(term => (
                <SelectItem key={term.value} className="text-text-default" value={term.value}>
                  {term.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <AdmissionNumberField formik={formik} />

        <div className="space-y-2">
          <Label htmlFor="branch" className="text-text-default text-sm font-medium">
            Branch <small className="text-text-destructive text-xs">*</small>
          </Label>
          {!branches || loadingBranches ? (
            <Skeleton className="bg-bg-input-soft h-9 w-full" />
          ) : (
            <Select
              onValueChange={value => {
                const branch = branches.data?.find((branch: BranchWithClassLevels) => branch.branch.uuid === value);
                formik.setFieldValue("branchId", branch.branch.id);
                setBranchId(branch.branch.id);
              }}
            >
              <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-none">
                {branches.data.map((branch: BranchWithClassLevels) => (
                  <SelectItem key={branch.branch.id} className="text-text-default" value={branch.branch.uuid}>
                    {branch.branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="class" className="text-text-default text-sm font-medium">
            Class <small className="text-text-destructive text-xs">*</small>
            {!branchId && <span className="text-text-default text-xs font-light">(Select a branch first)</span>}
          </Label>
          {!classes || loadingClasses ? (
            <Skeleton className="bg-bg-input-soft h-9 w-full" />
          ) : (
            <Select
              disabled={!branchId}
              onValueChange={value => {
                const classObj = classes.data.content?.find((cls: ClassType) => cls.uuid === value);
                formik.setFieldValue("classId", classObj.id);
                setClassId(classObj.id);
              }}
            >
              <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-none">
                {classes.data.content.map((cls: ClassType) => (
                  <SelectItem key={cls.id} className="text-text-default" value={cls.uuid}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="arm" className="text-text-default text-sm font-medium">
            Arm <small className="text-text-destructive text-xs">*</small>{" "}
            <span className="text-text-default text-xs font-light">{!classId && "(Select a class first)"}</span>
          </Label>
          {!arms || loadingArms ? (
            <Skeleton className="bg-bg-input-soft h-9 w-full" />
          ) : (
            <Select
              disabled={!classId}
              onValueChange={value => {
                const arm = arms.data?.find((arm: Arm) => arm.uuid === value);
                formik.setFieldValue("armId", arm.id);
              }}
            >
              <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                <SelectValue placeholder="Arm" />
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-none">
                {arms.data.length === 0 && (
                  <SelectItem disabled className="text-text-default" value="none">
                    No Arms Found
                  </SelectItem>
                )}
                {arms.data.map((arm: Arm) => (
                  <SelectItem key={arm.id} className="text-text-default" value={arm.uuid}>
                    {arm.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="boardingStatus" className="text-text-default text-sm font-medium">
            Boarding Status
          </Label>
          <Select onValueChange={value => formik.setFieldValue("boardingStatus", value)}>
            <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
              <SelectValue placeholder="Boarding Status" />
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-none">
              {BoardingStatusValues.map(status => (
                <SelectItem key={status.value} className="text-text-default" value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="admissionStatus" className="text-text-default text-sm font-medium">
            Admission Status <small className="text-text-destructive text-xs">*</small>
          </Label>
          <Select onValueChange={value => formik.setFieldValue("admissionStatus", value)}>
            <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
              <SelectValue placeholder="Admission Status" />
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-none">
              {AdmissionStatusValues.map(status => (
                <SelectItem key={status.value} className="text-text-default" value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
