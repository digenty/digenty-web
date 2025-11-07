"use client";
import { cn } from "@/lib/utils";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

export const AcademicInformation = () => {
  return (
    <div className="border-border-default space-y-6 border-b py-6">
      <h2 className="text-lg font-semibold">Academic Information</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5">
        <div className="space-y-2">
          <Label htmlFor="nationality" className="text-text-default text-sm font-medium">
            Joined School Session
          </Label>
          <Select>
            <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
              <SelectValue placeholder="2024/2025" />
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
          <Label htmlFor="nationality" className="text-text-default text-sm font-medium">
            Joined School Term
          </Label>
          <Select>
            <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
              <SelectValue placeholder="First Term" />
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
          <Label htmlFor="admissionNumber" className="text-text-default text-sm font-medium">
            Admission Number
          </Label>
          <Input
            id="admissionNumber"
            // onChange={handleChange}
            autoFocus
            placeholder="GFA/2023/01045"
            // onBlur={handleBlur}
            // value={values.email}
            type="text"
            className={cn(
              "text-text-muted bg-bg-input-soft! placeholder-text-hint! border-none text-sm font-normal",
              // errors.email && touched.email && "border-text-error/50 border",
            )}
          />
          {/* {touched.email && errors.email && <p className="text-text-error/80 font-satoshi text-xs font-light">{errors.email}</p>} */}
        </div>

        <div className="space-y-2">
          <Label htmlFor="branch" className="text-text-default text-sm font-medium">
            Branch
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
            Class
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
            Arm
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
              {["Male", "Female"].map(gender => (
                <SelectItem key={gender} className="text-text-default" value={gender}>
                  {gender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="admissionStatus" className="text-text-default text-sm font-medium">
            Admission Status
          </Label>
          <Select>
            <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
              <SelectValue placeholder="Admission Status" />
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
          <Label htmlFor="inputRole" className="text-text-default text-sm font-medium">
            Input Role
          </Label>
          <Input
            id="inputRole"
            // onChange={handleChange}
            autoFocus
            placeholder="Input Position"
            // onBlur={handleBlur}
            // value={values.email}
            type="text"
            className={cn(
              "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
              // errors.email && touched.email && "border-text-error/50 border",
            )}
          />
          {/* {touched.email && errors.email && <p className="text-text-error/80 font-satoshi text-xs font-light">{errors.email}</p>} */}
        </div>
      </div>
    </div>
  );
};
