"use client";
import { cn } from "@/lib/utils";
import { FormikProps } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StudentInputValues } from "../../types";

export const ContactInformation = ({ formik }: { formik: FormikProps<StudentInputValues> }) => {
  const { handleBlur, handleChange, errors, touched, values } = formik;

  return (
    <div className="border-border-default space-y-6 border-b py-6">
      <h2 className="text-lg font-semibold">Contact Information</h2>

      <div className="grid grid-cols-1 gap-6 sm:gap-5">
        <div className="space-y-2">
          <Label htmlFor="address" className="text-text-default text-sm font-medium">
            Home Address <small className="text-text-destructive text-xs">*</small>
          </Label>
          <Input
            id="address"
            onChange={handleChange}
            placeholder="Input Home Address"
            onBlur={handleBlur}
            value={values.address}
            type="text"
            className={cn(
              "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
              errors.address && touched.address && "border-border-destructive border",
            )}
          />
          {touched.address && errors.address && <p className="text-text-destructive text-xs font-light">{errors.address}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-text-default text-sm font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            onChange={handleChange}
            placeholder="Input Email Address"
            onBlur={handleBlur}
            value={values.email}
            type="email"
            className={cn(
              "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
              errors.email && touched.email && "border-border-destructive border",
            )}
          />
          {touched.email && errors.email && <p className="text-text-destructive text-xs font-light">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-text-default text-sm font-medium">
            Primary Phone Number
          </Label>
          <Input
            id="phoneNumber"
            onChange={handleChange}
            placeholder="Input Primary Phone Number"
            onBlur={handleBlur}
            value={values.phoneNumber}
            type="text"
            className={cn(
              "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
              errors.phoneNumber && touched.phoneNumber && "border-border-destructive border",
            )}
          />
          {touched.phoneNumber && errors.phoneNumber && <p className="text-text-destructive text-xs font-light">{errors.phoneNumber}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondaryPhoneNumber" className="text-text-default text-sm font-medium">
            Secondary Phone Number
          </Label>
          <Input
            id="secondaryPhoneNumber"
            onChange={handleChange}
            placeholder="Input Secondary Phone Number"
            onBlur={handleBlur}
            value={values.secondaryPhoneNumber}
            type="text"
            className={cn(
              "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
              errors.secondaryPhoneNumber && touched.secondaryPhoneNumber && "border-border-destructive border",
            )}
          />
          {touched.secondaryPhoneNumber && errors.secondaryPhoneNumber && (
            <p className="text-text-destructive text-xs font-light">{errors.secondaryPhoneNumber}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergencyContactName" className="text-text-default text-sm font-medium">
            Emergency Contact Name
          </Label>
          <Input
            id="emergencyContactName"
            onChange={handleChange}
            placeholder="Input Emergency Contact Name"
            onBlur={handleBlur}
            value={values.emergencyContactName}
            type="text"
            className={cn(
              "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
              errors.emergencyContactName && touched.emergencyContactName && "border-border-destructive border",
            )}
          />
          {touched.emergencyContactName && errors.emergencyContactName && (
            <p className="text-text-destructive text-xs font-light">{errors.emergencyContactName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergencyContactNumber" className="text-text-default text-sm font-medium">
            Emergency Contact Number
          </Label>
          <Input
            id="emergencyContactNumber"
            onChange={handleChange}
            placeholder="Input Emergency Contact Number"
            onBlur={handleBlur}
            value={values.emergencyContactNumber}
            type="text"
            className={cn(
              "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
              errors.emergencyContactNumber && touched.emergencyContactNumber && "border-border-destructive border",
            )}
          />
          {touched.emergencyContactNumber && errors.emergencyContactNumber && (
            <p className="text-text-destructive text-xs font-light">{errors.emergencyContactNumber}</p>
          )}
        </div>
      </div>
    </div>
  );
};
