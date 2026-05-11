"use client";

import { Edit } from "@digenty/icons";
import Image from "next/image";
import { useFormik } from "formik";
import React, { useRef, useState } from "react";

import { uploadImage } from "@/app/actions/upload-image";
import { Avatar } from "@/components/Avatar";
import { toast } from "@/components/Toast";
import { Toggle } from "@/components/Toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

import { InvoiceSettingsResponse, UpdateInvoiceSettingsPayload } from "@/api/invoice";
import { useCreateInvoiceSettings, useGetInvoiceSettings, useUpdateInvoiceSettings } from "@/hooks/queryHooks/useInvoice";
import { invoiceSettingsSchema } from "@/schema/invoice";

const digits = [3, 4, 5, 6, 7, 8, 9];

type FormValues = {
  schoolLogoUrl: string;
  invoicePrefix: string;
  numberFormat: string;
  startingNumber: number;
  padding: number;
  defaultDueDate: Date | null;
  defaultNote: string;
  remindBeforeDays: number;
  remindAfterDays: number;
  repeatReminders: boolean;
  repeatEveryDays: number;
};

const emptyValues: FormValues = {
  schoolLogoUrl: "",
  invoicePrefix: "",
  numberFormat: "",
  startingNumber: 1,
  padding: 4,
  defaultDueDate: null,
  defaultNote: "",
  remindBeforeDays: 0,
  remindAfterDays: 0,
  repeatReminders: false,
  repeatEveryDays: 0,
};

export const InvoiceSetting = () => {
  const { data: rawData, isPending: loadingSettings, isError } = useGetInvoiceSettings();
  const settings: InvoiceSettingsResponse | undefined = (rawData as { data?: InvoiceSettingsResponse } | undefined)?.data ?? rawData;
  const hasSettings = !!settings && !isError;
  const { mutate: createSettings, isPending: creating } = useCreateInvoiceSettings();
  const { mutate: updateSettings, isPending: updating } = useUpdateInvoiceSettings();
  const saving = creating || updating;

  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik<FormValues>({
    initialValues: settings
      ? {
          schoolLogoUrl: settings.schoolLogoUrl ?? "",
          invoicePrefix: settings.invoicePrefix ?? "",
          numberFormat: settings.numberFormat ?? "",
          startingNumber: settings.startingNumber ?? 1,
          padding: settings.padding ?? 4,
          defaultDueDate: settings.defaultDueDate ? new Date(settings.defaultDueDate) : null,
          defaultNote: settings.defaultNote ?? "",
          remindBeforeDays: settings.remindBeforeDays ?? 0,
          remindAfterDays: settings.remindAfterDays ?? 0,
          repeatReminders: settings.repeatReminders ?? false,
          repeatEveryDays: settings.repeatEveryDays ?? 0,
        }
      : emptyValues,
    enableReinitialize: true,
    validationSchema: invoiceSettingsSchema,
    onSubmit: values => {
      const onSuccess = () => {
        toast({ title: "Invoice settings saved", type: "success" });
        setIsEditing(false);
      };
      const onError = (error: unknown) => {
        const message = error instanceof Error ? error.message : "Failed to save settings";
        toast({ title: message, type: "error" });
      };

      if (hasSettings) {
        const updatePayload: UpdateInvoiceSettingsPayload = {
          schoolLogoUrl: values.schoolLogoUrl || undefined,
          invoicePrefix: values.invoicePrefix || undefined,
          numberFormat: values.numberFormat || undefined,
          startingNumber: values.startingNumber,
          padding: values.padding,
          defaultDueDate: values.defaultDueDate ? values.defaultDueDate.toISOString() : undefined,
          defaultNote: values.defaultNote || undefined,
          remindBeforeDays: values.remindBeforeDays,
          remindAfterDays: values.remindAfterDays,
          repeatReminders: values.repeatReminders,
          repeatEveryDays: values.repeatEveryDays,
        };
        updateSettings(updatePayload, { onSuccess, onError });
      } else {
        createSettings(
          {
            image: values.schoolLogoUrl || undefined,
            invoicePrefix: values.invoicePrefix || undefined,
            numberFormat: values.numberFormat || undefined,
            startNumber: values.startingNumber,
            numberPadding: values.padding,
            defaultDueDate: values.defaultDueDate ? values.defaultDueDate.toISOString() : undefined,
            defaultInvoiceNote: values.defaultNote || undefined,
            noOfDaysBeforeDueDate: values.remindBeforeDays,
            noOfDaysAfterDueDate: values.remindAfterDays,
            repeatFrequency: values.repeatEveryDays,
          },
          { onSuccess, onError },
        );
      }
    },
  });

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const result = await uploadImage(formData);
      if (result?.url) {
        formik.setFieldValue("schoolLogoUrl", result.url);
      } else {
        toast({ title: "Upload failed", type: "error" });
      }
    } catch {
      toast({ title: "Upload failed", type: "error" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loadingSettings) {
    return (
      <div className="mx-auto my-6 flex w-full max-w-171 flex-col gap-4 px-4">
        <Skeleton className="bg-bg-input-soft h-8 w-48" />
        <Skeleton className="bg-bg-input-soft h-32 w-full" />
        <Skeleton className="bg-bg-input-soft h-64 w-full" />
      </div>
    );
  }

  const logo = formik.values.schoolLogoUrl;
  const disabled = !isEditing;

  const previewNext =
    settings?.nextInvoiceNumber ||
    `${formik.values.invoicePrefix || ""}${String(formik.values.startingNumber || 1).padStart(formik.values.padding || 4, "0")}`;

  return (
    <div className="mx-auto my-6 flex w-full max-w-171 items-center justify-center px-4">
      <div className="flex w-full flex-col gap-6">
        <div>
          <div className="mb-8 flex items-center justify-between">
            <div className="text-text-default text-lg font-semibold">Invoice Settings</div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} className="bg-bg-state-secondary! border-border-darker text-text-default rounded-md border">
                <Edit fill="var(--color-icon-default-muted)" /> Edit
              </Button>
            )}
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

              {logo ? (
                <Image src={logo} alt="School logo" width={40} height={40} className="size-10 rounded-full object-cover" />
              ) : (
                <Avatar className="size-10" />
              )}

              {isEditing && (
                <Button
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! rounded-md border text-sm font-medium shadow"
                >
                  {isUploading && <Spinner className="mr-1 size-4" />}
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
              )}
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
              disabled={disabled}
              className="bg-bg-input-soft! text-text-default w-full border-none disabled:opacity-100"
              placeholder="Input Prefix"
            />
            {formik.touched.invoicePrefix && formik.errors.invoicePrefix && (
              <p className="text-text-destructive text-xs font-light">{formik.errors.invoicePrefix}</p>
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
              disabled={disabled}
              className="bg-bg-input-soft! text-text-default w-full border-none disabled:opacity-100"
              placeholder="Input Format"
            />
            {formik.touched.numberFormat && formik.errors.numberFormat && (
              <p className="text-text-destructive text-xs font-light">{formik.errors.numberFormat}</p>
            )}
            <div className="text-text-muted text-xs">Use tokens: YEAR, MONTH, SESSION, SEQ</div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Starting Number</Label>
            <Input
              name="startingNumber"
              type="number"
              min={1}
              value={formik.values.startingNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={disabled}
              className="bg-bg-input-soft! text-text-default w-full border-none disabled:opacity-100"
              placeholder="Input First Number"
            />
            {formik.touched.startingNumber && formik.errors.startingNumber && (
              <p className="text-text-destructive text-xs font-light">{formik.errors.startingNumber}</p>
            )}
            <div className="text-text-muted text-xs">The first invoice number to use</div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Padding</Label>
            <Select value={String(formik.values.padding)} onValueChange={v => formik.setFieldValue("padding", Number(v))} disabled={disabled}>
              <SelectTrigger className="bg-bg-input-soft! h-9! w-full rounded-md border-none disabled:opacity-100">
                <SelectValue>
                  <span className="text-text-default text-sm">{formik.values.padding} Digits</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                {digits.map(dgt => (
                  <SelectItem key={dgt} value={String(dgt)} className="text-text-default text-sm font-medium">
                    {dgt} Digits
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.padding && formik.errors.padding && <p className="text-text-destructive text-xs font-light">{formik.errors.padding}</p>}
          </div>
        </div>

        <div className="border-border-default bg-bg-basic-blue-subtle flex w-full items-center gap-2 rounded-md border px-3 py-2.5">
          <div className="bg-bg-basic-blue-accent border-border-default h-6 w-1 border-2"></div>
          <div className="text-text-subtle text-sm">Next Invoice Number: {previewNext}</div>
        </div>

        <div className="text-text-default text-lg font-semibold">Basic Setting</div>
        <div className="border-border-default grid w-full grid-cols-1 border-b pb-6 md:grid-cols-2 md:gap-6">
          <div className="flex flex-col gap-2">
            <Label className="text-text-default w-full text-sm font-medium">Default Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  disabled={disabled}
                  className="bg-bg-input-soft! hover:bg-bg-input-soft! flex h-9 w-full items-center justify-between rounded-md border-none px-3 disabled:opacity-100"
                >
                  <span className="text-text-default text-sm font-normal">
                    {formik.values.defaultDueDate ? (
                      formik.values.defaultDueDate.toLocaleDateString()
                    ) : (
                      <span className="text-text-muted">dd / mm / yyyy</span>
                    )}
                  </span>
                  <CalendarIcon className="text-text-muted size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="bg-bg-card border-border-default w-full border p-0">
                <Calendar
                  mode="single"
                  selected={formik.values.defaultDueDate ?? undefined}
                  onSelect={d => formik.setFieldValue("defaultDueDate", d ?? null)}
                  className="text-text-default text-sm!"
                />
              </PopoverContent>
            </Popover>
            <div className="text-text-muted invisible text-xs">spacer</div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Default Invoice Note</Label>
            <Input
              name="defaultNote"
              value={formik.values.defaultNote}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={disabled}
              className="bg-bg-input-soft! text-text-default w-full border-none text-sm disabled:opacity-100"
              placeholder="Add a default note"
            />
            {formik.touched.defaultNote && formik.errors.defaultNote && (
              <p className="text-text-destructive text-xs font-light">{formik.errors.defaultNote}</p>
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
              name="remindBeforeDays"
              type="number"
              min={0}
              value={formik.values.remindBeforeDays}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={disabled}
              className="bg-bg-input-soft! w-full rounded-md border-none disabled:opacity-100"
              placeholder="1"
            />
            {formik.touched.remindBeforeDays && formik.errors.remindBeforeDays && (
              <p className="text-text-destructive text-xs font-light">{formik.errors.remindBeforeDays}</p>
            )}
            <div className="text-text-default text-sm font-medium">Days</div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">After Due Date</Label>
            <Input
              name="remindAfterDays"
              type="number"
              min={0}
              value={formik.values.remindAfterDays}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={disabled}
              className="bg-bg-input-soft! w-full rounded-md border-none disabled:opacity-100"
              placeholder="2"
            />
            {formik.touched.remindAfterDays && formik.errors.remindAfterDays && (
              <p className="text-text-destructive text-xs font-light">{formik.errors.remindAfterDays}</p>
            )}
            <div className="text-text-default text-sm font-medium">Days</div>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <div className="text-text-default text-sm font-medium">Repeat Reminders</div>
            <div className="text-text-subtle text-sm">Send follow up reminders for unpaid invoice</div>
          </div>
          <Toggle
            checked={formik.values.repeatReminders}
            disabled={disabled}
            onChange={e => formik.setFieldValue("repeatReminders", (e.target as HTMLInputElement).checked)}
          />
        </div>

        {formik.values.repeatReminders && (
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Repeat Every</Label>
            <Input
              name="repeatEveryDays"
              type="number"
              min={0}
              value={formik.values.repeatEveryDays}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={disabled}
              className="border-border-default bg-bg-input-soft! text-text-default border disabled:opacity-100"
              placeholder="0"
            />
            {formik.touched.repeatEveryDays && formik.errors.repeatEveryDays && (
              <p className="text-text-destructive text-xs font-light">{formik.errors.repeatEveryDays}</p>
            )}
            <span className="text-text-default text-sm font-medium">Days</span>
          </div>
        )}

        {isEditing && (
          <div className="border-border-default mt-5 flex items-center justify-between border-t py-4">
            <Button
              onClick={() => {
                formik.resetForm();
                setIsEditing(false);
              }}
              disabled={saving}
              className="bg-bg-state-soft! text-text-subtle rounded-md"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => formik.handleSubmit()}
              disabled={saving}
              className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default rounded-md"
            >
              {saving && <Spinner className="text-text-white-default mr-1 size-4" />}
              Save changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
