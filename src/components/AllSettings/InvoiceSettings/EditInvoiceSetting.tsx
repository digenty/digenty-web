"use client";

import { Avatar } from "@/components/Avatar";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/Toggle";
import { useGetInvoiceSettings, useCreateInvoiceSettings, useUpdateInvoiceSettings } from "@/hooks/queryHooks/useInvoice";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { invoiceSettingsSchema } from "@/schema/invoice";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const DIGITS = [3, 4, 5, 6, 7, 8, 9];

export const EditInvoiceSetting = () => {
  const router = useRouter();
  const { branchIds } = useLoggedInUser();
  const branchId = branchIds?.[0];

  const { data: settings, isPending: loadingSettings } = useGetInvoiceSettings(branchId);
  const { mutate: create, isPending: creating } = useCreateInvoiceSettings();
  const { mutate: update, isPending: updating } = useUpdateInvoiceSettings(branchId);
  const isPending = creating || updating;

  const formik = useFormik({
    initialValues: {
      invoicePrefix: "",
      numberFormat: "",
      startingNumber: 1 as number | string,
      padding: 4 as number | string,
      defaultDueDate: "",
      defaultNote: "",
      remindBeforeDays: 1 as number | string,
      remindAfterDays: 2 as number | string,
      repeatReminders: false,
      repeatEveryDays: 0 as number | string,
    },
    validationSchema: invoiceSettingsSchema,
    enableReinitialize: true,
    onSubmit: values => {
      const payload = {
        invoicePrefix: values.invoicePrefix,
        numberFormat: values.numberFormat,
        startingNumber: Number(values.startingNumber),
        padding: Number(values.padding),
        defaultDueDate: values.defaultDueDate,
        defaultNote: values.defaultNote,
        remindBeforeDays: Number(values.remindBeforeDays),
        remindAfterDays: Number(values.remindAfterDays),
        repeatReminders: values.repeatReminders,
        repeatEveryDays: Number(values.repeatEveryDays),
      };

      const onSuccess = () => {
        toast({ title: "Invoice settings saved", type: "success" });
        router.push("/staff/settings/invoice");
      };
      const onError = (err: unknown) => {
        const msg = err instanceof Error ? err.message : "Failed to save settings";
        toast({ title: msg, type: "error" });
      };

      if (!settings) {
        create({ ...payload, branchId: branchId! }, { onSuccess, onError });
      } else {
        update(payload, { onSuccess, onError });
      }
    },
  });

  // Prefill from existing settings
  useEffect(() => {
    if (!settings) return;
    formik.setValues({
      invoicePrefix: settings.invoicePrefix ?? "",
      numberFormat: settings.numberFormat ?? "",
      startingNumber: settings.startingNumber ?? 1,
      padding: settings.padding ?? 4,
      defaultDueDate: settings.defaultDueDate ?? "",
      defaultNote: settings.defaultNote ?? "",
      remindBeforeDays: settings.remindBeforeDays ?? 1,
      remindAfterDays: settings.remindAfterDays ?? 2,
      repeatReminders: settings.repeatReminders ?? false,
      repeatEveryDays: settings.repeatEveryDays ?? 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  if (loadingSettings) {
    return (
      <div className="mx-auto my-6 w-full max-w-171">
        <Skeleton className="bg-bg-input-soft h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto my-6 flex w-full max-w-171 items-center justify-center">
      <div className="flex w-full flex-col gap-6">
        {/* School Logo */}
        <div>
          <div className="text-text-default mb-4 text-sm font-medium">School Logo</div>
          <div className="border-border-default flex items-center gap-4 border-b pb-4">
            <input type="file" accept="image/png,image/jpeg" className="hidden" id="logo-upload" aria-label="Upload school logo" />
            <Avatar className="size-10" url={settings?.schoolLogoUrl ?? undefined} />
            <Button
              type="button"
              onClick={() => document.getElementById("logo-upload")?.click()}
              className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! rounded-md border text-sm font-medium shadow"
            >
              Upload
            </Button>
            <div className="text-text-muted text-xs">JPG or PNG. 1MB Max.</div>
          </div>
        </div>

        {/* Invoice Numbering */}
        <div className="text-text-default text-lg font-semibold">Invoice Numbering</div>
        <div className="border-border-default grid grid-cols-1 gap-6 border-b pb-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="invoicePrefix" className="text-text-default text-sm font-medium">Invoice Prefix</Label>
            <Input
              id="invoicePrefix"
              value={formik.values.invoicePrefix}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={cn("bg-bg-input-soft! text-text-default w-full border-none", formik.touched.invoicePrefix && formik.errors.invoicePrefix && "border-border-destructive border")}
              placeholder="INV-"
            />
            <div className="text-text-muted text-xs">Common formats: INV-, FEE-, BILL-</div>
            {formik.touched.invoicePrefix && formik.errors.invoicePrefix && <p className="text-text-destructive text-xs font-light">{formik.errors.invoicePrefix}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="numberFormat" className="text-text-default text-sm font-medium">Number Format</Label>
            <Input
              id="numberFormat"
              value={formik.values.numberFormat}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-bg-input-soft! text-text-default w-full border-none"
              placeholder="YEAR-SEQ"
            />
            <div className="text-text-muted text-xs">Use tokens: YEAR, MONTH, SESSION, SEQ</div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="startingNumber" className="text-text-default text-sm font-medium">Starting Number</Label>
            <Input
              id="startingNumber"
              type="number"
              value={formik.values.startingNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={cn("bg-bg-input-soft! text-text-default w-full border-none", formik.touched.startingNumber && formik.errors.startingNumber && "border-border-destructive border")}
              placeholder="1"
            />
            <div className="text-text-muted text-xs">The first invoice number to use</div>
            {formik.touched.startingNumber && formik.errors.startingNumber && <p className="text-text-destructive text-xs font-light">{formik.errors.startingNumber as string}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Padding</Label>
            <Select
              value={String(formik.values.padding)}
              onValueChange={v => { formik.setFieldValue("padding", Number(v)); formik.setFieldTouched("padding", true); }}
            >
              <SelectTrigger className="bg-bg-input-soft! h-9! w-full rounded-md border-none">
                <SelectValue><span className="text-text-default text-sm">{formik.values.padding} Digits</span></SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                {DIGITS.map(d => (
                  <SelectItem key={d} value={String(d)} className="text-text-default text-sm font-medium">{d} Digits</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {settings?.nextInvoiceNumber && (
          <div className="border-border-default bg-bg-basic-blue-subtle flex w-full items-center gap-2 rounded-md border px-3 py-2.5">
            <div className="bg-bg-basic-blue-accent border-border-default h-6 w-1 border-2" />
            <div className="text-text-subtle text-sm">Next Invoice Number: {settings.nextInvoiceNumber}</div>
          </div>
        )}

        {/* Basic Settings */}
        <div className="text-text-default text-lg font-semibold">Basic Settings</div>
        <div className="border-border-default flex w-full flex-col border-b pb-6 md:flex-row md:items-start md:justify-between md:gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="defaultDueDate" className="text-text-default w-full text-sm font-medium">Default Due Date</Label>
            <Input
              id="defaultDueDate"
              value={formik.values.defaultDueDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-bg-input-soft! text-text-default w-full border-none"
              placeholder="e.g. TODAY, TOMORROW, 7_DAYS"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="defaultNote" className="text-text-default text-sm font-medium">Default Invoice Note</Label>
            <Input
              id="defaultNote"
              value={formik.values.defaultNote}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-bg-input-soft! text-text-default w-full border-none text-sm"
              placeholder="Note for all new invoices"
            />
            <div className="text-text-muted text-xs">This note will appear on all new invoices.</div>
          </div>
        </div>

        {/* Reminders */}
        <div className="text-text-default text-lg font-semibold">Invoice Reminders</div>
        <div className="grid-col-1 grid w-full gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="remindBeforeDays" className="text-text-default text-sm font-medium">Before Due Date</Label>
            <Input
              id="remindBeforeDays"
              type="number"
              value={formik.values.remindBeforeDays}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={cn("bg-bg-input-soft! w-full rounded-md border-none", formik.touched.remindBeforeDays && formik.errors.remindBeforeDays && "border-border-destructive border")}
              placeholder="1"
            />
            <div className="text-text-default text-sm font-medium">Days</div>
            {formik.touched.remindBeforeDays && formik.errors.remindBeforeDays && <p className="text-text-destructive text-xs font-light">{formik.errors.remindBeforeDays as string}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="remindAfterDays" className="text-text-default text-sm font-medium">After Due Date</Label>
            <Input
              id="remindAfterDays"
              type="number"
              value={formik.values.remindAfterDays}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={cn("bg-bg-input-soft! w-full rounded-md border-none", formik.touched.remindAfterDays && formik.errors.remindAfterDays && "border-border-destructive border")}
              placeholder="2"
            />
            <div className="text-text-default text-sm font-medium">Days</div>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <div className="text-text-default text-sm font-medium">Repeat Reminders</div>
            <div className="text-text-subtle text-sm">Send follow up reminders for unpaid invoices</div>
          </div>
          <Toggle
            checked={formik.values.repeatReminders}
            onChange={e => formik.setFieldValue("repeatReminders", (e.target as HTMLInputElement).checked)}
          />
        </div>

        {formik.values.repeatReminders && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="repeatEveryDays" className="text-text-default text-sm font-medium">Repeat Every</Label>
            <Input
              id="repeatEveryDays"
              type="number"
              value={formik.values.repeatEveryDays}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border-border-default bg-bg-input-soft! text-text-default border"
              placeholder="0"
            />
            <span className="text-text-default text-sm font-medium">Days</span>
          </div>
        )}

        {/* Footer */}
        <div className="border-border-default mt-5 flex items-center justify-between border-t py-4">
          <Button
            type="button"
            onClick={() => router.back()}
            className="bg-bg-state-soft! text-text-subtle rounded-md"
          >
            Cancel
          </Button>
          <Button
            onClick={() => formik.handleSubmit()}
            disabled={isPending}
            className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default rounded-md"
          >
            {isPending && <Spinner className="text-text-white-default mr-1 size-4" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
