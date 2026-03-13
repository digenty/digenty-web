"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/Toast";
import { useAddmissionNumber } from "@/hooks/queryHooks/useAdmission";
import { DIGITS } from "@/store/admission";
import { admissionFormSchema } from "@/schema/academic";

export type AdmissionNumberSetupHandle = {
  submit: () => Promise<boolean>;
};

type FormValues = {
  prefix: string;
  numberFormat: string;
  startingNumber: string;
  padding: string;
};

const buildPreview = (prefix: string, startingNumber: string, padding: string): string => {
  const seq = String(parseInt(startingNumber) || 1).padStart(Number(padding) || 2, "0");
  const year = new Date().getFullYear();
  return `${prefix || "ADM"}-${year}${seq}`;
};

export const AdmissionNumberSetup = forwardRef<AdmissionNumberSetupHandle>((_, ref) => {
  const { mutateAsync } = useAddmissionNumber();

  const formik = useFormik<FormValues>({
    initialValues: {
      prefix: "",
      numberFormat: "",
      startingNumber: "1",
      padding: "",
    },
    validationSchema: admissionFormSchema,
    onSubmit: () => {},
  });

  const preview = buildPreview(formik.values.prefix, formik.values.startingNumber, formik.values.padding);
  useImperativeHandle(ref, () => ({
    submit: async (): Promise<boolean> => {
      const errors = await formik.validateForm();

      if (Object.keys(errors).length > 0) {
        formik.setTouched({
          prefix: true,
          numberFormat: true,
          startingNumber: true,
          padding: true,
        });
        toast({ title: "Please fill in required fields", description: "All admission number fields are required.", type: "warning" });
        return false;
      }

      try {
        await mutateAsync({
          prefix: formik.values.prefix,
          numberFormat: formik.values.numberFormat,
          startingNumber: parseInt(formik.values.startingNumber),
          padding: parseInt(formik.values.padding),
        });
        toast({ title: "Admission setup saved", description: "Your admission number format has been saved.", type: "success" });
        return true;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
        toast({ title: "Failed to save admission setup", description: message, type: "error" });
        return false;
      }
    },
  }));

  return (
    <div className="mx-auto flex items-center justify-center md:w-151">
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label className="text-text-default text-sm font-medium">Admission Number Prefix</Label>
          <Input
            name="prefix"
            value={formik.values.prefix}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm"
            placeholder="Input prefix"
          />
          {formik.touched.prefix && formik.errors.prefix && <p className="text-text-destructive text-xs">{formik.errors.prefix}</p>}
          <div className="text-text-muted text-xs">Common formats: ADM-, STD-, PUP-</div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-text-default text-sm font-medium">Number Format</Label>
          <Input
            name="numberFormat"
            value={formik.values.numberFormat}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm"
            placeholder="Input format"
          />
          {formik.touched.numberFormat && formik.errors.numberFormat && <p className="text-text-destructive text-xs">{formik.errors.numberFormat}</p>}
          <div className="text-text-muted text-xs">Use tokens: PREFIX, YEAR, MONTH, SESSION, SEQ</div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-text-default text-sm font-medium">Starting Number</Label>
          <Input
            name="startingNumber"
            value={formik.values.startingNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="number"
            className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm"
            placeholder="Input first Number"
          />
          {formik.touched.startingNumber && formik.errors.startingNumber && (
            <p className="text-text-destructive text-xs">{formik.errors.startingNumber}</p>
          )}
          <div className="text-text-muted text-xs">The first admission number to use</div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-text-default text-sm font-medium">Padding</Label>
          <Select value={formik.values.padding} onValueChange={val => formik.setFieldValue("padding", val)}>
            <SelectTrigger className="bg-bg-input-soft! h-9! w-full rounded-md border-none">
              <SelectValue placeholder="Select padding">
                <span className="text-text-default text-sm">{formik.values.padding ? `${formik.values.padding} Digits` : "Select padding"}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default">
              {DIGITS.map(dgt => (
                <SelectItem key={dgt} value={String(dgt)} className="text-text-default text-sm font-medium">
                  {dgt} Digits
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formik.touched.padding && formik.errors.padding && <p className="text-text-destructive text-xs">{formik.errors.padding}</p>}
        </div>

        <div className="border-border-default bg-bg-basic-blue-subtle flex w-full items-center gap-2 rounded-md border px-3 py-2.5">
          <div className="bg-bg-basic-blue-accent border-border-default h-6 w-1 border-2" />
          <div className="text-text-subtle text-sm uppercase">Next Admission Number: {preview}</div>
        </div>
      </div>
    </div>
  );
});

AdmissionNumberSetup.displayName = "AdmissionNumberSetup";
