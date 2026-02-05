"use client";
import { cn, getAcademicYears } from "@/lib/utils";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { StudentInputValues } from "../types";
import { FormikProps } from "formik";
import { BoardingStatusValues, AdmissionStatusValues } from "../constants";
import { terms } from "@/types";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { Skeleton } from "@/components/ui/skeleton";
import { Arm, Branch, ClassType, Department } from "@/api/types";
import { useGetClasses } from "@/hooks/queryHooks/useClass";
import { useGetDepartments } from "@/hooks/queryHooks/useDepartment";
import { useState } from "react";
import { useGetArmsByClass } from "@/hooks/queryHooks/useArm";

export const AcademicInformation = ({ formik }: { formik: FormikProps<StudentInputValues> }) => {
  const [classId, setClassId] = useState<number | undefined>();

  const { data: branches, isPending: loadingBranches } = useGetBranches();
  const { data: classes, isPending: loadingClasses } = useGetClasses();
  const { data: departments, isPending: loadingDepartments } = useGetDepartments();
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

        <div className="space-y-2">
          <Label htmlFor="admissionNumber" className="text-text-default text-sm font-medium">
            Admission Number
          </Label>
          <Input
            id="admissionNumber"
            onChange={handleChange}
            placeholder="GFA/2023/01045"
            onBlur={handleBlur}
            value={values.admissionNumber}
            type="text"
            className={cn(
              "text-text-muted bg-bg-input-soft! placeholder-text-hint! border-none text-sm font-normal",
              errors.admissionNumber && touched.admissionNumber && "border-border-destructive border",
            )}
          />
          {touched.admissionNumber && errors.admissionNumber && <p className="text-text-destructive text-xs font-light">{errors.admissionNumber}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="branch" className="text-text-default text-sm font-medium">
            Branch <small className="text-text-destructive text-xs">*</small>
          </Label>
          {!branches || loadingBranches ? (
            <Skeleton className="bg-bg-input-soft h-9 w-full" />
          ) : (
            <Select
              onValueChange={value => {
                const branch = branches.data.content?.find((branch: Branch) => branch.uuid === value);
                formik.setFieldValue("branchId", branch.id);
              }}
            >
              <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-none">
                {branches.data.content.map((branch: Branch) => (
                  <SelectItem key={branch.id} className="text-text-default" value={branch.uuid}>
                    {branch.name}
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
          <Label htmlFor="department" className="text-text-default text-sm font-medium">
            Department
          </Label>
          {!departments || loadingDepartments ? (
            <Skeleton className="bg-bg-input-soft h-9 w-full" />
          ) : (
            <Select
              onValueChange={value => {
                const department = departments.data?.find((dept: Department) => dept.uuid === value);
                formik.setFieldValue("departmentId", department.id);
              }}
            >
              <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-none">
                {departments.data.map((dept: Department) => (
                  <SelectItem key={dept.id} className="text-text-default" value={dept.uuid}>
                    {dept.name}
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
              onValueChange={value => {
                const arm = arms.data?.content?.find((arm: Arm) => arm.uuid === value);
                formik.setFieldValue("armId", arm.id);
              }}
            >
              <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                <SelectValue placeholder="Arm" />
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-none">
                {arms.data.content.length === 0 && (
                  <SelectItem className="text-text-default" value="none">
                    No Arms Found
                  </SelectItem>
                )}
                {arms.data.content.map((arm: Arm) => (
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
          <Select>
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
          <Select onValueChange={value => formik.setFieldValue("studentStatus", value)}>
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

        {/* <div className="space-y-2">
          <Label htmlFor="role" className="text-text-default text-sm font-medium">
            Input Role
          </Label>
          <Input
            id="role"
            onChange={handleChange}
            placeholder="Input Position"
            onBlur={handleBlur}
            value={values.role}
            type="text"
            className={cn(
              "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
              errors.role && touched.role && "border-border-destructive border",
            )}
          />
          {touched.role && errors.role && <p className="text-text-destructive text-xs font-light">{errors.role}</p>}
        </div> */}
      </div>
    </div>
  );
};
