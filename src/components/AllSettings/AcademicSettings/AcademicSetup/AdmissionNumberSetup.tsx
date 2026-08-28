"use client";

import { toast } from "@/components/Toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAddmissionNumber } from "@/hooks/queryHooks/useAdmission";
import { useGetAdmissionNumberDetails, useUpdateAdmissionNumber } from "@/hooks/queryHooks/useAdmisssion";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { admissionFormSchema } from "@/schema/academic";
import { DIGITS } from "@/store/admission";
import { useFormik } from "formik";
import { usePathname, useRouter } from "next/navigation";
import { WizardStepFooter } from "./WizardStepFooter";

type FormValues = {
  prefix: string;
  numberFormat: string;
  startingNumber: string;
  padding: string;
  includeClassOfEntry: string;
  separator: string;
};

const buildPreview = (prefix: string, numberFormat: string, startingNumber: string, padding: string, separator: string): string => {
  const seq = String(parseInt(startingNumber) || 1).padStart(Number(padding) || 2, "0");
  const year = numberFormat;
  const sep = separator || "";
  return [prefix || "ADM", year, seq].filter(Boolean).join(sep);
};

export const AdmissionNumberSetup = ({
  setCompletedSteps,
  completedSteps,
}: {
  setCompletedSteps: (steps: string[]) => void;
  completedSteps: string[];
}) => {
  const router = useRouter();
  const pathname = usePathname();

  useBreadcrumb([
    { label: "Academic Settings", url: "/staff/settings/academic" },
    { label: "Admission Number Setup", url: "/staff/settings/academic?step=admission-number" },
  ]);

  const { data: admissionResponse } = useGetAdmissionNumberDetails();
  const admission = admissionResponse?.data ?? admissionResponse?.[0];

  const { mutate: addAdmissionNumber } = useAddmissionNumber();
  const { mutate: updateAdmissionNumber } = useUpdateAdmissionNumber();

  const formik = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues: {
      prefix: admission?.prefix ?? "",
      numberFormat: admission?.numberFormat ?? "",
      startingNumber: admission?.startingNumber ? String(admission.startingNumber) : "1",
      padding: admission?.padding ? String(admission.padding) : "",
      includeClassOfEntry: admission?.includeClassOfEntry !== undefined ? String(admission.includeClassOfEntry) : "",
      separator: admission?.separator ?? "",
    },
    validationSchema: admissionFormSchema,
    onSubmit: async values => {
      const payload = {
        prefix: values.prefix,
        numberFormat: values.numberFormat,
        startingNumber: parseInt(values.startingNumber),
        padding: parseInt(values.padding),
        includeClassOfEntry: values.includeClassOfEntry === "true",
        separator: values.separator,
      };

      const onSuccess = () => {
        toast({ title: "Admission number setup saved", description: "Your admission number format has been saved.", type: "success" });
        setCompletedSteps([...completedSteps, "admission-number"]);
        router.push("/staff/settings/academic");
      };
      const onError = (error: unknown) => {
        const message = error instanceof Error ? error.message : "Could not save admission number settings";
        toast({ title: "Failed to save admission setup", description: message, type: "error" });
      };

      if (admission?.id) {
        updateAdmissionNumber({ payload, id: admission.id }, { onSuccess, onError });
      } else {
        addAdmissionNumber(payload, { onSuccess, onError });
      }
    },
  });

  const preview = buildPreview(
    formik.values.prefix,
    formik.values.numberFormat,
    formik.values.startingNumber,
    formik.values.padding,
    formik.values.separator,
  );

  return (
    <section className="">
      <div className="mx-auto flex items-center justify-center pb-20 md:w-151">
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
              placeholder={new Date().getFullYear().toString()}
            />
            {formik.touched.numberFormat && formik.errors.numberFormat && (
              <p className="text-text-destructive text-xs">{formik.errors.numberFormat}</p>
            )}
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

          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Separator</Label>
            <Input
              name="separator"
              value={formik.values.separator}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm"
              placeholder="e.g. - or /"
            />
            {formik.touched.separator && formik.errors.separator && <p className="text-text-destructive text-xs">{formik.errors.separator}</p>}
            <div className="text-text-muted text-xs">Character used between parts of the admission number, e.g. - or /</div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Include Class of Entry</Label>
            <Select value={formik.values.includeClassOfEntry} onValueChange={val => formik.setFieldValue("includeClassOfEntry", val)}>
              <SelectTrigger className="bg-bg-input-soft! h-9! w-full rounded-md border-none">
                <SelectValue placeholder="Select option">
                  <span className="text-text-default text-sm">
                    {formik.values.includeClassOfEntry ? (formik.values.includeClassOfEntry === "true" ? "Yes" : "No") : "Select option"}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                <SelectItem value="true" className="text-text-default text-sm font-medium">
                  Yes
                </SelectItem>
                <SelectItem value="false" className="text-text-default text-sm font-medium">
                  No
                </SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.includeClassOfEntry && formik.errors.includeClassOfEntry && (
              <p className="text-text-destructive text-xs">{formik.errors.includeClassOfEntry}</p>
            )}
            <div className="text-text-muted text-xs">Whether the student&apos;s class of entry appears in the admission number</div>
          </div>

          <div className="border-border-default bg-bg-basic-blue-subtle flex w-full items-center gap-2 rounded-md border px-3 py-2.5">
            <div className="bg-bg-basic-blue-accent border-border-default h-6 w-1 border-2" />
            <div className="text-text-subtle text-sm uppercase">Next Admission Number: {preview}</div>
          </div>
        </div>
      </div>

      <WizardStepFooter
        onBack={() => router.push(`${pathname}?step=development-skills`)}
        onContinue={() => formik.handleSubmit()}
        continueLabel="Finish"
        showContinueArrow={false}
      />
    </section>
  );
};
