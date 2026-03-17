"use client";

import { Avatar } from "@/components/Avatar";
import { Toggle } from "@/components/Toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/Toast";
import { useAddInvoiceSetting } from "@/hooks/queryHooks/useInvoice";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import { uploadImage } from "@/app/actions/upload-image";
import { DIGITS, DUE_DATES, FormValues } from "./types";
import { invoiceSettingSchema } from "@/schema/invoice";

const buildPreview = (prefix: string, startNumber: string, padding: string): string => {
  const seq = String(parseInt(startNumber) || 1).padStart(Number(padding) || 2, "0");
  const year = new Date().getFullYear();
  return `${prefix || "INV"}-${year}${seq}`;
};

export const InvoiceSetting = () => {
  const user = useLoggedInUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showReminderInput, setShowReminderInput] = useState(false);
  const { mutateAsync: addInvoiceSetting, isPending } = useAddInvoiceSetting();

  const formik = useFormik<FormValues>({
    initialValues: {
      invoicePrefix: "",
      numberFormat: "",
      startNumber: "1",
      padding: "",
      defaultDueDate: DUE_DATES[0],
      defaultInvoiceNote: "",
      noOfDaysBeforeDueDate: "",
      noOfDaysAfterDueDate: "",
      repeatFrequency: "",
      image: "",
    },
    validationSchema: invoiceSettingSchema,
    onSubmit: async values => {
      try {
        await addInvoiceSetting({
          invoicePrefix: values.invoicePrefix,
          numberFormat: values.numberFormat,
          startNumber: parseInt(values.startNumber),
          numberPadding: parseInt(values.padding),
          padding: values.padding,
          lastGeneratedNumber: 0,
          image: values.image,
          defaultDueDate: values.defaultDueDate,
          defaultInvoiceNote: values.defaultInvoiceNote,
          noOfDaysBeforeDueDate: parseInt(values.noOfDaysBeforeDueDate),
          noOfDaysAfterDueDate: parseInt(values.noOfDaysAfterDueDate),
          repeatFrequency: showReminderInput ? parseInt(values.repeatFrequency) : 0,
          ...(user?.branchId ? { branchId: user.branchId } : {}),
        });
        toast({ title: "Invoice settings saved", description: "Your invoice settings have been saved successfully.", type: "success" });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
        toast({ title: "Failed to save invoice settings", description: message, type: "error" });
      }
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const data = await uploadImage(formData);
      if (data?.url) {
        formik.setFieldValue("image", data.url);
      }
    } catch {
      toast({ title: "Image upload failed", description: "Please try uploading the image again.", type: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  const preview = buildPreview(formik.values.invoicePrefix, formik.values.startNumber, formik.values.padding);

  return (
    <div className="mx-auto my-6 flex w-full max-w-171 items-center justify-center">
      <div className="flex w-full flex-col gap-6">
        <div>
          <div className="mb-8">
            <div className="text-text-default text-lg font-semibold">Invoice Settings</div>
          </div>
          <div className="text-text-default mb-4 text-sm font-medium">School Logo</div>
          <div className="flex flex-col gap-4">
            <div className="border-border-default flex items-center gap-4 border-b pb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                aria-label="Upload school logo"
                onChange={handleFileChange}
              />
              <Avatar className="size-10" url={formik.values.image || undefined} />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! rounded-md border text-sm font-medium shadow"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
              <div className="text-text-muted text-xs">JPG or PNG. 1MB Max.</div>
            </div>
          </div>
        </div>

        <div className="text-text-default text-lg font-semibold">Invoice Numbering</div>

        <div className="border-border-default grid grid-cols-1 gap-6 border-b pb-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Invoice Prefix</Label>
            <Input
              name="invoicePrefix"
              value={formik.values.invoicePrefix}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-bg-input-soft! text-text-default w-full border-none"
              placeholder="Input Prefix"
            />
            {formik.touched.invoicePrefix && formik.errors.invoicePrefix && (
              <p className="text-text-destructive text-xs">{formik.errors.invoicePrefix}</p>
            )}
            <div className="text-text-muted text-xs">Common formats: INV-, FEE-, BILL-</div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Number Format</Label>
            <Input
              name="numberFormat"
              value={formik.values.numberFormat}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-bg-input-soft! text-text-default w-full border-none"
              placeholder="Input Format"
            />
            {formik.touched.numberFormat && formik.errors.numberFormat && (
              <p className="text-text-destructive text-xs">{formik.errors.numberFormat}</p>
            )}
            <div className="text-text-muted text-xs">Use tokens: YEAR, MONTH, SESSION, SEQ</div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Starting Number</Label>
            <Input
              name="startNumber"
              value={formik.values.startNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="number"
              className="bg-bg-input-soft! text-text-default w-full border-none"
              placeholder="Input First Number"
            />
            {formik.touched.startNumber && formik.errors.startNumber && <p className="text-text-destructive text-xs">{formik.errors.startNumber}</p>}
            <div className="text-text-muted text-xs">The first invoice number to use</div>
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
        </div>

        <div className="border-border-default bg-bg-basic-blue-subtle flex w-full items-center gap-2 rounded-md border px-3 py-2.5">
          <div className="bg-bg-basic-blue-accent border-border-default h-6 w-1 border-2" />
          <div className="text-text-subtle text-sm">Next Invoice Number: {preview.toLocaleUpperCase()}</div>
        </div>

        <div className="text-text-default text-lg font-semibold">Basic Setting</div>
        <div className="border-border-default grid w-full grid-cols-1 border-b pb-6 md:grid-cols-2 md:gap-6">
          <div className="flex flex-col gap-2">
            <Label className="text-text-default w-full text-sm font-medium">Default Due Date</Label>
            <Select value={formik.values.defaultDueDate} onValueChange={val => formik.setFieldValue("defaultDueDate", val)}>
              <SelectTrigger className="bg-bg-input-soft! h-9! w-full rounded-md border-none">
                <SelectValue>
                  <span className="text-text-default text-sm">{formik.values.defaultDueDate}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                {DUE_DATES.map(dd => (
                  <SelectItem key={dd} value={dd} className="text-text-default text-sm font-medium">
                    {dd}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-text-muted invisible text-xs">placeholder</div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Default Invoice Note</Label>
            <Input
              name="defaultInvoiceNote"
              value={formik.values.defaultInvoiceNote}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-bg-input-soft! text-text-default w-full border-none text-sm"
              placeholder="Enter invoice note"
            />
            {formik.touched.defaultInvoiceNote && formik.errors.defaultInvoiceNote && (
              <p className="text-text-destructive text-xs">{formik.errors.defaultInvoiceNote}</p>
            )}
            <div className="text-text-muted text-xs">
              This note will appear on all new invoices. You can edit it for individual invoices if needed.
            </div>
          </div>
        </div>

        <div className="text-text-default text-lg font-semibold">Invoice Reminders</div>

        <div className="grid-col-1 grid w-full gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Before Due Date</Label>
            <Input
              name="noOfDaysBeforeDueDate"
              value={formik.values.noOfDaysBeforeDueDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-bg-input-soft! text-text-default w-full rounded-md border-none"
              type="number"
              placeholder="1"
            />
            {formik.touched.noOfDaysBeforeDueDate && formik.errors.noOfDaysBeforeDueDate && (
              <p className="text-text-destructive text-xs">{formik.errors.noOfDaysBeforeDueDate}</p>
            )}
            <div className="text-text-default text-sm font-medium">Days</div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">After Due Date</Label>
            <Input
              name="noOfDaysAfterDueDate"
              value={formik.values.noOfDaysAfterDueDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-bg-input-soft! text-text-default w-full rounded-md border-none"
              type="number"
              placeholder="2"
            />
            {formik.touched.noOfDaysAfterDueDate && formik.errors.noOfDaysAfterDueDate && (
              <p className="text-text-destructive text-xs">{formik.errors.noOfDaysAfterDueDate}</p>
            )}
            <div className="text-text-default text-sm font-medium">Days</div>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <div className="text-text-default text-sm font-medium">Repeat Reminders</div>
            <div className="text-text-subtle text-sm">Send follow up reminders for unpaid invoice</div>
          </div>
          <Toggle checked={showReminderInput} onChange={e => setShowReminderInput((e.target as HTMLInputElement).checked)} />
        </div>

        {showReminderInput && (
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Repeat Every</Label>
            <Input
              name="repeatFrequency"
              value={formik.values.repeatFrequency}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border-border-default bg-bg-input-soft! text-text-default border"
              type="number"
              placeholder="0"
            />
            <span className="text-text-default text-sm font-medium">Days</span>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => formik.submitForm()}
            disabled={isPending || isUploading}
            className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default rounded-md"
          >
            {isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
};
