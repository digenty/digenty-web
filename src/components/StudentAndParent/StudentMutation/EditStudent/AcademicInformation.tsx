"use client";
import { Arm, Branch, BranchWithClassLevels, ClassType, Student } from "@/api/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetArmsByClass } from "@/hooks/queryHooks/useArm";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetClasses } from "@/hooks/queryHooks/useClass";
import { cn, getAcademicYears } from "@/lib/utils";
import { terms } from "@/types";
import { FormikProps } from "formik";
import { useEffect, useState } from "react";
import { AdmissionStatusValues, BoardingStatusValues } from "../../constants";
import { StudentInputValues } from "../../types";
import { AdmissionNumberField } from "../AdmissionNumberField";

export const AcademicInformation = ({ formik, data }: { formik: FormikProps<StudentInputValues>; data: { data: Student } | undefined }) => {
  const [classId, setClassId] = useState<number | null>(null);

  const { data: branches, isPending: loadingBranches } = useGetBranches();
  const { data: classes, isPending: loadingClasses } = useGetClasses();
  const { data: arms, isPending: loadingArms } = useGetArmsByClass(classId);

  const [branch, setBranch] = useState<string>();
  const [className, setClassName] = useState<string>();
  const [arm, setArm] = useState<string>();

  const { handleBlur, handleChange, errors, touched, values } = formik;

  useEffect(() => {
    if (data && branches && classes) {
      const branch = branches.data?.find((brnch: BranchWithClassLevels) => brnch.branch.name === data.data.branch);
      setBranch(branch?.branch?.name);
      if (branch) {
        formik.setFieldValue("branchId", branch.branch.id);
      }

      const cls = classes.data.content?.find((cls: ClassType) => cls.name === data.data.class && cls.branchId === branch?.branch?.id);
      setClassName(cls?.name);
      setClassId(cls?.id);
      if (cls) {
        formik.setFieldValue("classId", cls.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, branches, classes]);

  useEffect(() => {
    if (arms && data) {
      const arm = arms.data.find((arm: Arm) => arm.id === data.data.armId);
      setArm(arm?.id.toString());
      if (arm) {
        formik.setFieldValue("armId", arm.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arms, data]);

  return (
    <div className="border-border-default space-y-6 border-b py-6">
      <h2 className="text-lg font-semibold">Academic Information</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5">
        <div className="space-y-2">
          <Label htmlFor="joinedSchoolSession" className="text-text-default text-sm font-medium">
            Joined School Session<small className="text-text-destructive text-xs">*</small>
          </Label>
          <Select
            value={values.joinedSchoolSession}
            onValueChange={value => {
              if (value) {
                formik.setFieldValue("joinedSchoolSession", value);
              }
            }}
          >
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
          <Select
            value={values.joinedSchoolTerm}
            onValueChange={value => {
              if (value) {
                formik.setFieldValue("joinedSchoolTerm", value);
              }
            }}
          >
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
              value={branch}
              onValueChange={value => {
                if (value) {
                  const branchObj = branches.data?.find((branch: BranchWithClassLevels) => branch?.branch?.name === value);
                  if (branchObj) {
                    formik.setFieldValue("branchId", branchObj?.branch?.id);
                    setBranch(branchObj?.branch?.name);
                  }
                }
              }}
            >
              <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-none">
                {branches.data.map((branch: BranchWithClassLevels) => (
                  <SelectItem key={branch?.branch.id} className="text-text-default" value={branch.branch.name ?? ""}>
                    {branch?.branch?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="class" className="text-text-default text-sm font-medium">
            Class <small className="text-text-destructive text-xs">*</small>
          </Label>
          {!classes || loadingClasses ? (
            <Skeleton className="bg-bg-input-soft h-9 w-full" />
          ) : (
            <Select
              value={classId?.toString()}
              onValueChange={value => {
                if (value) {
                  const classObj = classes.data.content?.find((cls: ClassType) => cls.id.toString() === value);
                  if (classObj) {
                    formik.setFieldValue("classId", classObj.id);
                    setClassName(classObj.name);
                    setClassId(classObj.id);
                  }
                }
              }}
            >
              <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-none">
                {classes.data.content.map((cls: ClassType, index: number) => (
                  <SelectItem key={`${cls.id}-${index}`} className="text-text-default" value={cls.id.toString()}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="arm" className="text-text-default text-sm font-medium">
            Arm <small className="text-text-destructive text-xs">*</small>
          </Label>
          {!arms || loadingArms ? (
            <Skeleton className="bg-bg-input-soft h-9 w-full" />
          ) : (
            <Select
              disabled={!classId}
              value={arm}
              onValueChange={value => {
                if (value) {
                  const armObj = arms?.data?.find((arm: Arm) => arm.id.toString() === value);
                  if (armObj) {
                    formik.setFieldValue("armId", armObj.id);
                    setArm(armObj.id.toString());
                  }
                }
              }}
            >
              <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                <SelectValue placeholder="Arm" />
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-none">
                {arms.data.length === 0 && (
                  <SelectItem className="text-text-default" value="none">
                    No Arms Found
                  </SelectItem>
                )}
                {arms.data.map((arm: Arm) => (
                  <SelectItem key={arm.id} className="text-text-default" value={arm.id.toString()}>
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
          <Select value={values.boardingStatus} onValueChange={value => formik.setFieldValue("boardingStatus", value)}>
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
          <Select value={values.admissionStatus} onValueChange={value => formik.setFieldValue("admissionStatus", value)}>
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
