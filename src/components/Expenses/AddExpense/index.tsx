"use client";

import { AddFill, DownloadT, File as FileIcon, Information } from "@digenty/icons";
import { useFormik } from "formik";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useMemo, useRef, useState } from "react";

import { CreateExpenseDto, EditExpenseDto, RecurringInterval } from "@/api/expense";
import type { PaymentMethod } from "@/api/invoice";
import { BranchWithClassLevels } from "@/api/types";
import { uploadImage } from "@/app/actions/upload-image";
import { BackButton } from "@/components/BackButton";
import { DateRangePicker } from "@/components/DatePicker";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { payMethod } from "@/components/Invoices/paymentMethods";
import { toast } from "@/components/Toast";
import { Toggle } from "@/components/Toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useCreateExpense, useEditExpense, useGetExpenseById, useGetExpenseCategories } from "@/hooks/queryHooks/useExpense";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { cn } from "@/lib/utils";
import { canManageExpenses } from "@/lib/permissions/expenses";
import { RECURRING_INTERVAL_CONFIG } from "@/queries/expense";
import { editExpenseSchema, expenseSchema } from "@/schema/expense";

import { ExpenseCategoryItem, ExpenseListItem, extractExpenseList, extractExpenseRecord, formatExpenseDate } from "../types";

const MAX_RECEIPT_BYTES = 5 * 1024 * 1024;
const ACCEPTED_RECEIPTS = "application/pdf,image/png,image/jpeg";

type FormValues = {
  expenseId?: number;
  title: string;
  description: string;
  amount: number | "";
  date: string;
  categoryId?: number;
  branchId?: number;
  paymentMethod: PaymentMethod;
  receiptPath: string;
  receiptName: string;
  recurring: boolean;
  recurringInterval?: RecurringInterval;
};

const isImagePath = (path?: string) => !!path && /\.(png|jpe?g|gif|webp|avif)$/i.test(path.split("?")[0]);

const AddExpenseForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const expenseId = searchParams.get("id") ? Number(searchParams.get("id")) : undefined;
  const isEdit = !!expenseId;

  const user = useLoggedInUser();

  useBreadcrumb([
    { label: "Expenses", url: "/staff/expense" },
    { label: isEdit ? "Edit Expense" : "Add Expense", url: "" },
  ]);

  const { data: existingRaw, isLoading: loadingExisting } = useGetExpenseById(expenseId);
  const existing = useMemo(() => extractExpenseRecord<ExpenseListItem>(existingRaw), [existingRaw]);

  const { data: branchesResp } = useGetBranches();
  const branches = ((branchesResp?.data ?? []) as BranchWithClassLevels[]).map(branch => branch.branch);

  const { data: categoriesResp } = useGetExpenseCategories(0, 100);
  const categories = useMemo(() => extractExpenseList<ExpenseCategoryItem>(categoriesResp).items, [categoriesResp]);

  const { mutateAsync: createExpense, isPending: creating } = useCreateExpense();
  const { mutateAsync: editExpense, isPending: editing } = useEditExpense();
  const isPending = creating || editing;

  const [uploading, setUploading] = useState(false);

  // Guards against "Save & Add Another" and the form submit both firing on a fast double click.
  const submittingRef = useRef(false);

  const toCreatePayload = (values: FormValues): CreateExpenseDto => ({
    title: values.title.trim(),
    description: values.description.trim() || undefined,
    amount: Number(values.amount),
    date: values.date,
    categoryId: values.categoryId,
    branchId: values.branchId,
    paymentMethod: values.paymentMethod,
    receiptPath: values.receiptPath || undefined,
    recurring: values.recurring,
    recurringInterval: values.recurring ? values.recurringInterval : undefined,
  });

  const toEditPayload = (values: FormValues): EditExpenseDto => ({
    expenseId: expenseId as number,
    ...toCreatePayload(values),
  });

  const formik = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues: {
      expenseId: isEdit ? expenseId : undefined,
      title: existing?.title ?? existing?.name ?? "",
      description: existing?.description ?? "",
      amount: existing?.amount ?? "",
      date: existing?.date ? existing.date.slice(0, 10) : "",
      categoryId: existing?.categoryId ?? existing?.category?.id,
      branchId: existing?.branchId ?? existing?.branch?.id ?? user.branchIds?.[0],
      paymentMethod: existing?.paymentMethod ?? "POS",
      receiptPath: existing?.receiptPath ?? "",
      receiptName: existing?.receiptName ?? "",
      recurring: existing?.recurring ?? false,
      recurringInterval: existing?.recurringInterval,
    },
    validationSchema: isEdit ? editExpenseSchema : expenseSchema,
    onSubmit: async values => {
      if (submittingRef.current) return;
      submittingRef.current = true;
      try {
        if (isEdit) {
          await editExpense(toEditPayload(values));
          toast({ title: "Expense updated successfully", type: "success" });
          router.push(`/staff/expense/${expenseId}`);
        } else {
          await createExpense(toCreatePayload(values));
          toast({ title: "Expense created successfully", type: "success" });
          router.push("/staff/expense");
        }
      } catch (error) {
        const message = (error as { message?: string } | null)?.message ?? (isEdit ? "Could not update expense" : "Could not create expense");
        toast({ title: message, type: "error" });
      } finally {
        submittingRef.current = false;
      }
    },
  });

  const handleSaveAndAddAnother = async () => {
    if (isEdit || submittingRef.current) return;
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched(Object.keys(formik.values).reduce<Record<string, boolean>>((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }
    submittingRef.current = true;
    try {
      await createExpense(toCreatePayload(formik.values));
      toast({ title: "Expense created successfully", type: "success" });
      formik.resetForm();
    } catch (error) {
      const message = (error as { message?: string } | null)?.message ?? "Could not create expense";
      toast({ title: message, type: "error" });
    } finally {
      submittingRef.current = false;
    }
  };

  const handleReceiptChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_RECEIPT_BYTES) {
      toast({ title: "Receipt must be 5MB or smaller", type: "error" });
      event.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadImage(formData);
      if (result?.url) {
        formik.setFieldValue("receiptPath", result.url);
        formik.setFieldValue("receiptName", file.name);
        toast({ title: "Receipt uploaded", type: "success" });
      } else {
        toast({ title: "Receipt upload failed", type: "error" });
      }
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const fieldError = (field: keyof FormValues) =>
    formik.touched[field] && formik.errors[field] ? <p className="text-text-destructive text-xs font-light">{String(formik.errors[field])}</p> : null;

  const inputCls = (field: keyof FormValues) =>
    cn(
      "bg-bg-input-soft! text-text-default rounded-md border-none p-2 text-sm",
      formik.touched[field] && formik.errors[field] && "border-border-destructive border",
    );

  const selectCls = (field: keyof FormValues) =>
    cn(
      "bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!",
      formik.touched[field] && formik.errors[field] && "border-border-destructive border",
    );

  const selectedCategory = categories.find(category => category.id === formik.values.categoryId);
  const selectedBranch = branches.find(branch => branch.id === formik.values.branchId);
  const selectedMethod = payMethod.find(method => method.value === formik.values.paymentMethod);
  const SelectedMethodIcon = selectedMethod?.icon;

  if (isEdit && loadingExisting) {
    return (
      <div>
        <div className="px-4 pt-3 md:hidden">
          <BackButton />
        </div>
        <div className="flex h-60 items-center justify-center">
          <Spinner className="size-12" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="px-4 pt-3 md:hidden">
        <BackButton />
      </div>

      <div className="bg-bg-card-subtle border-border-default mb-6 w-full border-b">
        <div className="mx-auto flex w-full items-center p-4 md:max-w-150">
          <div className="text-text-default text-md font-semibold">{isEdit ? "Edit Expense" : "Add Expense"}</div>
        </div>
      </div>

      <div className="mx-auto flex w-full items-center justify-center md:max-w-150">
        <div className="flex w-full flex-col gap-6 p-4">
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">
              Expense Title <span className="text-text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputCls("title")}
              placeholder="Input Expense Title"
            />
            {fieldError("title")}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputCls("description")}
              placeholder="Input Expense Description"
            />
            {fieldError("description")}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">
              Amount Spent <span className="text-text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="text-text-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm">₦</span>
              <Input
                id="amount"
                name="amount"
                type="number"
                min={0}
                step="0.01"
                value={formik.values.amount}
                onChange={event => formik.setFieldValue("amount", event.target.value === "" ? "" : Number(event.target.value))}
                onBlur={formik.handleBlur}
                className={cn(inputCls("amount"), "pl-7")}
                placeholder="0.00"
              />
            </div>
            {fieldError("amount")}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                Date <span className="text-text-destructive">*</span>
              </Label>
              <DateRangePicker
                date={formik.values.date ? new Date(formik.values.date) : undefined}
                setDate={date => formik.setFieldValue("date", date ? date.toISOString().slice(0, 10) : "")}
              />
              {fieldError("date")}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">Category</Label>
              <Select
                value={formik.values.categoryId ? String(formik.values.categoryId) : ""}
                onValueChange={value => formik.setFieldValue("categoryId", Number(value))}
              >
                <SelectTrigger className={selectCls("categoryId")}>
                  <SelectValue placeholder="Select Category">
                    <span className="text-text-default text-sm">{selectedCategory?.name ?? "Select Category"}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {categories.map(category => (
                    <SelectItem key={category.id} value={String(category.id)} className="text-text-default text-sm">
                      {category.name}
                    </SelectItem>
                  ))}
                  <div className="border-border-default h-9 border-t">
                    <Button
                      type="button"
                      onMouseDown={event => event.preventDefault()}
                      onClick={() => router.push("/staff/expense/expense-categories")}
                      className="text-text-default hover:bg-bg-none! w-full bg-none text-sm font-medium"
                    >
                      <AddFill fill="var(--color-icon-default-muted)" /> Add new
                    </Button>
                  </div>
                </SelectContent>
              </Select>
              {fieldError("categoryId")}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">Branch</Label>
              <Select
                value={formik.values.branchId ? String(formik.values.branchId) : ""}
                onValueChange={value => formik.setFieldValue("branchId", Number(value))}
              >
                <SelectTrigger className={selectCls("branchId")}>
                  <SelectValue placeholder="Select Branch">
                    <span className="text-text-default text-sm">{selectedBranch?.name ?? "Select Branch"}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {branches.map(branch => (
                    <SelectItem key={branch.id} value={String(branch.id)} className="text-text-default text-sm">
                      {branch.name ?? `Branch ${branch.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldError("branchId")}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                Payment Method <span className="text-text-destructive">*</span>
              </Label>
              <Select value={formik.values.paymentMethod} onValueChange={value => formik.setFieldValue("paymentMethod", value as PaymentMethod)}>
                <SelectTrigger className={selectCls("paymentMethod")}>
                  <SelectValue>
                    <span className="text-text-default flex items-center gap-2 text-sm">
                      {SelectedMethodIcon && <SelectedMethodIcon fill="var(--color-icon-default-muted)" className="size-4" />}
                      {selectedMethod?.label ?? "Select Payment Method"}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {payMethod.map(method => {
                    const MethodIcon = method.icon;
                    return (
                      <SelectItem key={method.value} value={method.value} className="text-text-default text-sm">
                        <span className="flex items-center gap-2">
                          <MethodIcon fill="var(--color-icon-default-muted)" className="size-4" />
                          {method.label}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {fieldError("paymentMethod")}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">
              Receipt <span className="text-text-destructive">*</span>
            </Label>

            <label className="border-border-default flex cursor-pointer items-center justify-center rounded-sm border border-dashed px-6 py-10">
              <input type="file" accept={ACCEPTED_RECEIPTS} className="hidden" onChange={handleReceiptChange} />
              <div className="flex flex-col items-center gap-3">
                {uploading ? <Spinner className="size-6" /> : <DownloadT />}
                <div className="text-text-default text-sm font-medium">
                  Drop your files here, or <span className="text-text-informative">click to browse</span>
                </div>
                <div className="text-text-muted text-xs">PDF, JPG or PNG. 5MB Max.</div>
              </div>
            </label>

            {formik.values.receiptPath && (
              <div className="border-border-default flex items-center gap-3 rounded-md border p-2">
                <div className="bg-bg-input-soft flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md">
                  {isImagePath(formik.values.receiptPath) ? (
                    <Image
                      src={formik.values.receiptPath}
                      alt={formik.values.receiptName || "receipt"}
                      width={40}
                      height={40}
                      className="size-10 object-cover"
                    />
                  ) : (
                    <FileIcon fill="var(--color-icon-default-muted)" className="size-5" />
                  )}
                </div>

                <span className="text-text-default min-w-0 flex-1 truncate text-sm font-medium">{formik.values.receiptName || "Receipt"}</span>

                <Button
                  type="button"
                  onClick={() => {
                    formik.setFieldValue("receiptPath", "");
                    formik.setFieldValue("receiptName", "");
                  }}
                  className="hover:bg-bg-state-ghost-hover text-text-muted size-8 rounded-md p-0!"
                  aria-label="Remove receipt"
                >
                  <X className="size-4" />
                </Button>
              </div>
            )}

            {fieldError("receiptPath")}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Label className="text-text-default text-sm font-medium">Mark as Recurring Expense</Label>
              <Toggle
                withBorder={false}
                checked={formik.values.recurring}
                onChange={event => {
                  const { checked } = event.target;
                  formik.setFieldValue("recurring", checked);
                  if (!checked) formik.setFieldValue("recurringInterval", undefined);
                }}
              />
            </div>

            <div className="bg-bg-basic-sky-subtle border-bg-basic-sky-accent flex items-start gap-2 rounded-md border p-3">
              <Information fill="var(--color-icon-default-muted)" className="mt-0.5 size-4 shrink-0" />
              <div className="text-text-default text-sm">You&apos;ll be notified at each interval, but the expense must still be added manually.</div>
            </div>

            {formik.values.recurring && (
              <>
                <div className="flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">Interval</Label>
                  <Select
                    value={formik.values.recurringInterval ?? ""}
                    onValueChange={value => formik.setFieldValue("recurringInterval", value as RecurringInterval)}
                  >
                    <SelectTrigger className={selectCls("recurringInterval")}>
                      <SelectValue placeholder="Select Interval">
                        <span className="text-text-default text-sm">
                          {formik.values.recurringInterval ? RECURRING_INTERVAL_CONFIG[formik.values.recurringInterval].label : "Select Interval"}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-bg-default border-border-default">
                      {(Object.keys(RECURRING_INTERVAL_CONFIG) as RecurringInterval[]).map(interval => (
                        <SelectItem key={interval} value={interval} className="text-text-default text-sm">
                          {RECURRING_INTERVAL_CONFIG[interval].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldError("recurringInterval")}
                </div>

                <div className="border-border-default bg-bg-card-subtle text-text-subtle rounded-md border p-3 text-sm">
                  You&apos;ll receive recurring reminders every{" "}
                  <span className="text-text-default font-medium">
                    {formik.values.recurringInterval ? RECURRING_INTERVAL_CONFIG[formik.values.recurringInterval].everyLabel : "[week/month/etc.]"}
                  </span>{" "}
                  starting from <span className="text-text-default font-medium">{formatExpenseDate(formik.values.date)}</span>, and you can record the
                  expense when notified.
                </div>
              </>
            )}
          </div>

          <div className="border-border-default flex w-full items-center justify-between border-t py-4">
            <Button type="button" onClick={() => router.back()} className="bg-bg-state-soft! text-text-subtle h-8!">
              Cancel
            </Button>

            <div className="flex items-center gap-2">
              {!isEdit && (
                <Button
                  type="button"
                  onClick={handleSaveAndAddAnother}
                  disabled={isPending || uploading}
                  className="bg-bg-state-soft! text-text-subtle h-8!"
                >
                  {isPending ? <Spinner /> : "Save & Add Another"}
                </Button>
              )}
              <Button
                type="submit"
                disabled={isPending || uploading}
                className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-8!"
              >
                {isPending ? <Spinner /> : isEdit ? "Save" : "Add Expense"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export const AddExpense = () => (
  <ModulePermissionsWrapper permissionUtility={canManageExpenses}>
    <AddExpenseForm />
  </ModulePermissionsWrapper>
);
