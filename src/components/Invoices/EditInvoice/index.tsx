"use client";

import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { useGetInvoiceDetail, useUpdateInvoice } from "@/hooks/queryHooks/useInvoice";
import { editInvoiceSchema } from "@/schema/invoice";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs } from "@/components/Tabs";
import type { InvoiceFormValues } from "@/components/Invoices/NewInvoice/index";
import type { InvoiceItem } from "@/components/Invoices/NewInvoice/NewInvoiceItems/NewInvoiceMobileItem";
import { EditInvoiceDetail } from "./EditInvoiceDetails/EditInvoiceDetail";
import { EditInvoiceHeader } from "./EditInvoiceHeader";
import { EditInvoiceItem } from "./EditInvoiceItems/EditInvoiceItem";
import { EditStatus } from "./EditInvoiceStatus";

export const EditInvoice = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("id") ?? undefined;
  const [openPreview, setOpenPreview] = useState(false);

  const { data: invoiceData } = useGetInvoiceDetail(invoiceId);
  const { mutate, isPending } = useUpdateInvoice(invoiceId);

  const formik = useFormik<InvoiceFormValues>({
    initialValues: {
      billTo: [],
      invoiceNumber: "",
      termId: null,
      issuedDate: null,
      dueDate: null,
      items: [{ id: "init", name: "", qty: 1, price: 0, required: false }],
      note: "",
      showAccountDetails: false,
      paymentStatus: "UNPAID",
      paymentMethod: "BANK_TRANSFER_TERMINAL",
      amount: "",
      transactionDate: null,
    },
    validationSchema: editInvoiceSchema,
    onSubmit: values => {
      const studentIds = values.billTo.filter(r => r.type === "student").map(r => r.id);
      const subtotal = values.items.reduce((acc, i) => acc + i.qty * i.price, 0);

      mutate(
        {
          studentIds,
          invoiceNumber: values.invoiceNumber.trim(),
          termId: values.termId!,
          issuedDate: values.issuedDate!.toISOString(),
          dueDate: values.dueDate!.toISOString(),
          items: values.items
            .filter(i => i.name.trim())
            .map(i => ({ id: 0, name: i.name, quantity: i.qty, price: i.price, required: i.required, stockItemId: 0, feeId: 0, feeGroupItemId: 0 })),
          subtotal,
          note: values.note,
          showAccountDetails: values.showAccountDetails,
          paymentStatus: values.paymentStatus,
        },
        {
          onSuccess: () => {
            toast({ title: "Invoice updated successfully", type: "success" });
            router.push(`/staff/invoices/${invoiceId}`);
          },
          onError: (error: unknown) => {
            const msg = error instanceof Error ? error.message : "Failed to update invoice";
            toast({ title: msg, type: "error" });
          },
        },
      );
    },
  });

  // Prefill form when invoice detail loads
  useEffect(() => {
    if (!invoiceData) return;
    const inv = invoiceData;
    formik.setValues({
      billTo: inv.issueTo ? [{ type: "student", id: inv.issueTo.id, name: inv.issueTo.name, avatar: inv.issueTo.avatar }] : [],
      invoiceNumber: inv.invoiceNumber ?? "",
      termId: inv.termId ?? null,
      issuedDate: inv.issuedDate ? new Date(inv.issuedDate) : null,
      dueDate: inv.dueDate ? new Date(inv.dueDate) : null,
      items: inv.items?.length
        ? inv.items.map((item: { id: number; name: string; quantity: number; price: number; total: number; required: boolean }) => ({
            id: String(item.id),
            name: item.name,
            qty: item.quantity,
            price: item.price,
            required: item.required,
          }) as InvoiceItem)
        : [{ id: crypto.randomUUID(), name: "", qty: 1, price: 0, required: false }],
      note: inv.note ?? "",
      showAccountDetails: inv.showAccountDetails ?? false,
      paymentStatus: (inv.status ?? "UNPAID") as "UNPAID" | "PAID" | "PARTIALLY_PAID",
      paymentMethod: "BANK_TRANSFER_TERMINAL",
      amount: "",
      transactionDate: null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceData]);

  return (
    <div>
      <EditInvoiceHeader
        openPreview={openPreview}
        onPreviewToggle={setOpenPreview}
        onSaveChanges={() => formik.handleSubmit()}
        isPending={isPending}
      />

      {/* Desktop */}
      <div className="border-border-default mx-4 hidden h-fit flex-col gap-6 rounded-md border p-6 md:mx-8 md:flex">
        <EditInvoiceDetail formik={formik} />
        <EditInvoiceItem formik={formik} />
        <EditStatus formik={formik} />
      </div>

      {/* Mobile */}
      <div className="mx-4 flex flex-col justify-between gap-2 md:hidden">
        <Tabs
          items={[
            { label: "Details", content: <div className="mt-4"><EditInvoiceDetail formik={formik} /></div> },
            { label: "Invoice Items", content: <div className="mt-4"><EditInvoiceItem formik={formik} /></div> },
            { label: "Payment", content: <div className="mt-4"><EditStatus formik={formik} /></div> },
          ]}
          className="max-w-full"
          buttonClassName="sm:w-1/3!"
        />
        <div className="border-border-default bg-bg-default absolute right-0 bottom-0 left-0 z-20 flex w-full justify-between gap-2 border-t p-2">
          <Button className="bg-bg-state-soft! text-text-subtle h-8! rounded-sm border-none px-2.5! py-1.5 text-sm">Cancel</Button>
          <Button
            onClick={() => formik.handleSubmit()}
            disabled={isPending}
            className="text-text-white-default bg-bg-state-primary! h-8! border-none px-2.5! py-1.5 text-sm"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
