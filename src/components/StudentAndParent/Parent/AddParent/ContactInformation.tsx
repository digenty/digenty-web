"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FormikProps } from "formik";
import { ParentInputValues } from "../../types";

export const ContactInformation = ({ formik }: { formik: FormikProps<ParentInputValues> }) => {
  const { handleBlur, handleChange, errors, touched, values } = formik;

  return (
    <div className="border-border-default space-y-6 py-6 md:border-b">
      <h2 className="text-lg font-semibold">Contact Information</h2>

      <div className="grid grid-cols-1 gap-6 sm:gap-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-text-default text-sm font-medium">
            Email Address<small className="text-text-destructive text-xs">*</small>
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
            Primary Phone Number<small className="text-text-destructive text-xs">*</small>
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
      </div>
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
    </div>
  );
};
