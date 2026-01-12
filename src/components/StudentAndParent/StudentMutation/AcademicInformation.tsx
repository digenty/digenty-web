"use client";
import { cn, getAcademicYears } from "@/lib/utils";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { StudentInputValues } from "../types";
import { FormikProps } from "formik";
import { BoardingStatusValues, StudentStatusValues } from "../constants";

export const AcademicInformation = ({ formik }: { formik: FormikProps<StudentInputValues> }) => {
  const { handleBlur, handleChange, errors, touched, values } = formik;
  return (
    <div className="border-border-default space-y-6 border-b py-6">
      <h2 className="text-lg font-semibold">Academic Information</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5">
        <div className="space-y-2">
          <Label htmlFor="sessionJoined" className="text-text-default text-sm font-medium">
            Joined School Session
          </Label>
          <Select onValueChange={value => formik.setFieldValue("sessionJoined", value)}>
            <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
              <SelectValue placeholder="2024/2025" />
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
            Joined School Term
          </Label>
          <Select onValueChange={value => formik.setFieldValue("termJoined", value)}>
            <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
              <SelectValue placeholder="First Term" />
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-none">
              {["First Term", "Second Term", "Third Term"].map(term => (
                <SelectItem key={term} className="text-text-default" value={term}>
                  {term}
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
          <Select>
            <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-none">
              {["Male", "Female"].map(gender => (
                <SelectItem key={gender} className="text-text-default" value={gender}>
                  {gender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="class" className="text-text-default text-sm font-medium">
            Class <small className="text-text-destructive text-xs">*</small>
          </Label>
          <Select>
            <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-none">
              {["Male", "Female"].map(gender => (
                <SelectItem key={gender} className="text-text-default" value={gender}>
                  {gender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="department" className="text-text-default text-sm font-medium">
            Department
          </Label>
          <Select>
            <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-none">
              {["Male", "Female"].map(gender => (
                <SelectItem key={gender} className="text-text-default" value={gender}>
                  {gender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="arm" className="text-text-default text-sm font-medium">
            Arm <small className="text-text-destructive text-xs">*</small>
          </Label>
          <Select>
            <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
              <SelectValue placeholder="Arm" />
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-none">
              {["Male", "Female"].map(gender => (
                <SelectItem key={gender} className="text-text-default" value={gender}>
                  {gender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Select>
            <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
              <SelectValue placeholder="Admission Status" />
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-none">
              {StudentStatusValues.map(status => (
                <SelectItem key={status.value} className="text-text-default" value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
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
        </div>
      </div>
    </div>
  );
};
