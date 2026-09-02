"use client";

import { ArrowRightS, CalendarEventFill, QuickReferenceAll, ResetLeft } from "@digenty/icons";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { PopoverContent, PopoverTrigger, Popover } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/Avatar";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/Toast";
import { useGetInvoiceDetail, useGetPaymentById, useUpdatePayment } from "@/hooks/queryHooks/useInvoice";
import { addPaymentSchema } from "@/schema/invoice";
import { payMethod } from "@/components/Invoices/paymentMethods";
import { InvoiceDetailResponse } from "@/components/Invoices/InvoiceId/invoiceIdTypes";
import { PaymentDetailResponse } from "@/api/invoice";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const EditPayment = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("invoiceId") ?? undefined;
  const paymentId = searchParams.get("paymentId") ?? undefined;

  const [calendarOpen, setCalendarOpen] = useState(false);

  const { mutate, isPending } = useUpdatePayment(invoiceId, paymentId);
  const { data: paymentData, isPending: loadingPayment } = useGetPaymentById(invoiceId, paymentId);
  const { data: invoiceData } = useGetInvoiceDetail(invoiceId);

  const payment = (paymentData as { data: PaymentDetailResponse } | undefined)?.data;
  const invoice = (invoiceData as { data: InvoiceDetailResponse } | undefined)?.data;
  const paidBy = payment?.paidBy ?? invoice?.issueTo;

  const invoiceItems = invoice?.items ?? [];
  const [allocations, setAllocations] = useState<Record<number, number>>({});
  const allocationsSeeded = useRef(false);
  useEffect(() => {
    if (!allocationsSeeded.current && invoiceItems.length > 0) {
      setAllocations(Object.fromEntries(invoiceItems.map(item => [item.id, item.total])));
      allocationsSeeded.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceItems.length]);

  const formik = useFormik({
    initialValues: {
      transactionDate: null as Date | null,
      method: "BANK_TRANSFER_TERMINAL",
      terminalTransactionId: "" as string | null,
      paidById: 0,
      amount: "" as number | string,
      note: "",
    },
    validationSchema: addPaymentSchema,
    onSubmit: values => {
      const allocationRows = invoiceItems
        .map(item => ({ studentFeeItemId: item.id, amount: allocations[item.id] ?? 0 }))
        .filter(row => row.amount > 0);

      mutate(
        {
          transactionDate: (values.transactionDate as Date).toISOString(),
          method: values.method as (typeof payMethod)[number]["value"],
          terminalTransactionId: values.terminalTransactionId || null,
          paidById: values.paidById,
          amount: Number(values.amount),
          note: values.note,
          allocations: allocationRows.length > 0 ? allocationRows : undefined,
        },
        {
          onSuccess: () => {
            toast({ title: "Payment updated successfully", type: "success" });
            router.back();
          },
          onError: (error: unknown) => {
            const description = error && typeof error === "object" && "message" in error ? String((error as { message: unknown }).message) : undefined;
            toast({ title: "Failed to update payment", description, type: "error" });
          },
        },
      );
    },
  });

  // Pre-fill form when payment data loads
  useEffect(() => {
    if (!payment) return;
    formik.setValues({
      transactionDate: payment.transactionDate ? new Date(payment.transactionDate) : null,
      method: payment.method ?? "BANK_TRANSFER_TERMINAL",
      terminalTransactionId: payment.terminalTransactionId ?? "",
      paidById: payment.paidBy?.id ?? 0,
      amount: payment.amount ?? "",
      note: payment.note ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payment]);

  const selectedMethod = payMethod.find(m => m.value === formik.values.method) ?? payMethod[0];

  if (loadingPayment) {
    return (
      <div className="flex w-full flex-col gap-6 p-8 md:mx-auto md:max-w-150">
        <div className="md:hidden">
          <BackButton />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="bg-bg-input-soft h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="px-4 pt-3 md:hidden">
        <BackButton />
      </div>

      <div className="bg-bg-card-subtle border-border-default flex h-13 w-full items-center justify-center border px-4 py-3">
        <div className="w-full md:w-150">
          <div className="text-text-default text-md font-semibold">Edit Payment</div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center p-4">
        <div className="flex w-full flex-col gap-6 md:max-w-150">
          {/* Transaction Date */}
          <div className="space-y-2">
            <Label className="text-text-default tex-sm font-medium">
              Transaction Date <span className="text-text-destructive">*</span>
            </Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  className={cn(
                    "bg-bg-input-soft! hover:bg-bg-input-soft! flex h-9 w-full items-center justify-between rounded-md border-none",
                    formik.errors.transactionDate && formik.touched.transactionDate && "border-border-destructive border",
                  )}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="text-text-default text-sm">
                      {formik.values.transactionDate ? (
                        (formik.values.transactionDate as Date).toLocaleDateString()
                      ) : (
                        <small className="text-text-muted text-sm">dd / mm / yyyy</small>
                      )}
                    </span>
                    <CalendarEventFill fill="var(--color-icon-default-muted)" className="size-4" />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="bg-bg-card border-border-default border p-0">
                <Calendar
                  mode="single"
                  selected={formik.values.transactionDate ?? undefined}
                  onSelect={d => {
                    formik.setFieldValue("transactionDate", d ?? null);
                    formik.setFieldTouched("transactionDate", true);
                    setCalendarOpen(false);
                  }}
                  className="text-text-default w-full text-sm!"
                />
              </PopoverContent>
            </Popover>
            {formik.touched.transactionDate && formik.errors.transactionDate && (
              <p className="text-text-destructive text-xs font-light">{formik.errors.transactionDate as string}</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label className="text-text-default tex-sm font-medium">
              Payment Method <span className="text-text-destructive">*</span>
            </Label>
            <Select
              value={formik.values.method}
              onValueChange={value => {
                formik.setFieldValue("method", value);
                formik.setFieldTouched("method", true);
              }}
            >
              <SelectTrigger
                className={cn(
                  "bg-bg-input-soft! hover:bg-bg-input-soft! flex h-9 w-full border-none",
                  formik.errors.method && formik.touched.method && "border-border-destructive border",
                )}
              >
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <selectedMethod.icon fill="var(--color-icon-default-muted)" className="size-4" />
                    <span className="text-text-default text-sm font-medium">{selectedMethod.label}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default text-text-default border">
                {payMethod.map(method => (
                  <SelectItem key={method.value} className="hover:bg-bg-input-soft cursor-pointer p-2" value={method.value}>
                    <method.icon fill="var(--color-icon-default-subtle)" className="size-4" />
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.method && formik.errors.method && <p className="text-text-destructive text-xs font-light">{formik.errors.method}</p>}
          </div>

          {/* Terminal Payment */}
          <div className="space-y-2">
            <Label className="text-text-default tex-sm font-medium">Terminal Payment</Label>
            <Sheet>
              <SheetTrigger asChild className="bg-bg-input-soft! hover:bg-bg-input-soft! flex h-9 w-full cursor-pointer rounded-md border-none">
                <div className="flex items-center justify-between px-3">
                  <Button className="hover:bg-bg-none! text-text-muted border-none p-0 text-sm font-normal">
                    {formik.values.terminalTransactionId ? formik.values.terminalTransactionId : "Select terminal payment"}
                  </Button>
                  <ArrowRightS fill="var(--color-icon-default-muted)" />
                </div>
              </SheetTrigger>
              <SheetContent className="bg-bg-card border-border-default mt-1.5 mr-1.5 h-[98vh] w-[97vw] rounded-md border md:w-130 [&>button]:hidden">
                <SheetHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="text-text-default text-md font-semibold">Select Terminal Payment</div>
                    <Button className="text-text-default border-border-darker bg-bg-secondary h-7 w-23 rounded-sm border px-2 py-1 text-sm">
                      <ResetLeft fill="var(--color-icon-default-muted)" /> Refresh
                    </Button>
                  </div>
                </SheetHeader>
                <div className="m-0 flex h-screen place-content-center items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <QuickReferenceAll fill="var(--color-icon-bg-default)" />
                    <div className="flex flex-col items-center">
                      <p className="text-text-default text-sm font-medium">No Terminal Transaction</p>
                      <span className="text-text-muted text-xs font-normal">There are no transactions to match to payments</span>
                    </div>
                    <SheetClose asChild>
                      <Button className="border-border-darker bg-bg-state-secondary! text-text-default h-7 w-14.5 rounded-sm border px-2 py-1 text-sm">
                        Close
                      </Button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label className="text-text-default tex-sm font-medium">
              Amount <span className="text-text-destructive">*</span>
            </Label>
            <div
              className={cn(
                "bg-bg-input-soft flex h-9 items-center rounded-md px-3",
                formik.errors.amount && formik.touched.amount && "border-border-destructive border",
              )}
            >
              <span className="text-text-muted mr-1 text-sm">₦</span>
              <Input
                id="amount"
                type="number"
                min={0}
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="0.00"
                className="h-full border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
              />
            </div>
            {formik.touched.amount && formik.errors.amount && <p className="text-text-destructive text-xs font-light">{formik.errors.amount}</p>}
          </div>

          {/* Allocation breakdown */}
          {invoiceItems.length > 0 && (
            <div className="space-y-2">
              <Label className="text-text-default tex-sm font-medium">Allocation Breakdown</Label>
              <p className="text-text-muted text-xs">Which fee lines is this payment for? Sending allocations again rewrites the breakdown.</p>
              <div className="border-border-default flex flex-col gap-2 rounded-md border p-3">
                {invoiceItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-3">
                    <span className="text-text-default flex-1 text-sm">{item.name}</span>
                    <div className="bg-bg-input-soft flex h-8 w-32 items-center rounded-md px-2">
                      <span className="text-text-muted mr-1 text-xs">₦</span>
                      <Input
                        type="number"
                        min={0}
                        value={allocations[item.id] ?? ""}
                        onChange={e => setAllocations(a => ({ ...a, [item.id]: Number(e.target.value) || 0 }))}
                        className="h-full border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                      />
                    </div>
                  </div>
                ))}
                {(() => {
                  const allocatedTotal = Object.values(allocations).reduce((sum, v) => sum + (v || 0), 0);
                  const amount = Number(formik.values.amount) || 0;
                  const overAllocated = allocatedTotal > amount + 0.001;
                  return (
                    <div className={cn("border-border-default flex items-center justify-between border-t pt-2 text-sm", overAllocated && "text-text-destructive")}>
                      <span>Allocated</span>
                      <span className="font-medium">
                        ₦{allocatedTotal.toLocaleString()} {overAllocated && "— exceeds the amount above"}
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Paid By */}
          <div className="space-y-2">
            <Label className="text-text-default tex-sm font-medium">
              Paid By <span className="text-text-destructive">*</span>
            </Label>
            <Select
              value={formik.values.paidById ? String(formik.values.paidById) : ""}
              onValueChange={value => {
                formik.setFieldValue("paidById", Number(value));
                formik.setFieldTouched("paidById", true);
              }}
            >
              <SelectTrigger
                className={cn(
                  "bg-bg-input-soft! hover:bg-bg-input-soft! text-text-default w-full border-none",
                  formik.errors.paidById && formik.touched.paidById && "border-border-destructive border",
                )}
              >
                <SelectValue placeholder="Select payer" />
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default text-text-default border">
                <SelectGroup>
                  {paidBy && (
                    <SelectItem value={String(paidBy.id)}>
                      <Avatar className="size-4" url={paidBy.avatar} />
                      <span>{paidBy.name}</span>
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            {formik.touched.paidById && formik.errors.paidById && (
              <p className="text-text-destructive text-xs font-light">{formik.errors.paidById}</p>
            )}
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label className="text-text-default tex-sm font-medium">Note</Label>
            <Textarea
              id="note"
              value={formik.values.note}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-bg-input-soft! hover:bg-bg-input-soft! h-16 w-full rounded-md"
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className="border-border-default fixed bottom-0 w-screen overflow-hidden border-t p-4">
        <div className="flex items-center justify-center">
          <div className="relative flex w-full justify-between md:ml-[-65] md:max-w-150">
            <Button onClick={() => router.back()} className="bg-bg-state-soft text-text-subtle h-8 w-18 rounded-md px-2.5 py-1.5 text-sm">
              Close
            </Button>
            <Button
              onClick={() => formik.handleSubmit()}
              disabled={isPending || Object.values(allocations).reduce((sum, v) => sum + (v || 0), 0) > (Number(formik.values.amount) || 0) + 0.001}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover/90! text-text-white-default h-8 rounded-md px-2.5 py-1.5 text-sm"
            >
              {isPending && <Spinner className="text-text-white-default mr-1 size-4" />}
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
