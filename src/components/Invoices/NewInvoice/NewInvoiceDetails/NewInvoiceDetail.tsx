"use client";

import { DateRangePicker } from "@/components/DateRange";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { cn } from "@/lib/utils";
import { useGetNextInvoiceNumber } from "@/hooks/queryHooks/useInvoice";
import { FormikProps } from "formik";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { InvoiceFormValues } from "../index";
import { Recipient, SelectRecipientsModal } from "../SelectRecipientsModal";
import { Term } from "@/api/types";

type Props = { formik: FormikProps<InvoiceFormValues> };

export const NewInvoiceDetail = ({ formik }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { schoolId, branchIds } = useLoggedInUser();
  const branchId = branchIds?.[0];
  const { data: termsData } = useGetTerms(schoolId);

  // Auto-fill invoice number from backend
  const { data: nextNumberData } = useGetNextInvoiceNumber(branchId);
  useEffect(() => {
    if (nextNumberData && !formik.values.invoiceNumber) {
      const number = Object.values(nextNumberData)[0] ?? "";
      formik.setFieldValue("invoiceNumber", number);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextNumberData]);

  // Auto-set active term
  useEffect(() => {
    if (!formik.values.termId && termsData?.data?.terms) {
      const activeTerm = termsData.data.terms.find((t: Term) => t.isActiveTerm);
      if (activeTerm) formik.setFieldValue("termId", activeTerm.termId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [termsData]);

  const { values, errors, touched, setFieldValue, setFieldTouched } = formik;

  const removeRecipient = (id: number, type: Recipient["type"]) =>
    setFieldValue(
      "billTo",
      values.billTo.filter(r => !(r.id === id && r.type === type)),
    );

  return (
    <div className="md:border-border-default w-full pb-6 md:border-b">
      {modalOpen && (
        <SelectRecipientsModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          selected={values.billTo}
          onConfirm={v => {
            setFieldValue("billTo", v);
            setFieldTouched("billTo", true);
          }}
        />
      )}

      <div className="text-text-default mb-4 text-lg font-semibold">Invoice Details</div>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Bill To */}
          <div className="space-y-2">
            <Label className="text-text-default text-sm font-medium">
              Bill to <span className="text-text-destructive">*</span>
            </Label>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className={cn(
                "bg-bg-input-soft hover:bg-bg-input-soft text-text-default min-h-9 w-full cursor-pointer rounded-md px-3 py-1.5 text-left text-sm",
                touched.billTo && errors.billTo && "border-border-destructive border",
                values.billTo.length > 0 ? "flex flex-wrap gap-1.5" : "flex items-center",
              )}
            >
              {values.billTo.length === 0 ? (
                <span className="text-text-muted text-sm">Select recipients...</span>
              ) : (
                <>
                  {values.billTo.slice(0, 3).map(r => (
                    <Badge
                      key={`${r.type}-${r.id}`}
                      className="border-border-default bg-bg-state-secondary text-text-default flex h-5 items-center gap-1 rounded-full border px-2 text-xs font-normal"
                    >
                      {r.name}
                      <X
                        className="size-2.5 cursor-pointer"
                        onClick={e => {
                          e.stopPropagation();
                          removeRecipient(r.id, r.type);
                        }}
                      />
                    </Badge>
                  ))}
                  {values.billTo.length > 3 && (
                    <Badge className="border-border-default bg-bg-state-secondary text-text-muted h-5 rounded-full border px-2 text-xs">
                      +{values.billTo.length - 3}
                    </Badge>
                  )}
                </>
              )}
            </button>
            {touched.billTo && errors.billTo && <p className="text-text-destructive text-xs font-light">{errors.billTo as string}</p>}
          </div>

          {/* Invoice ID */}
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber" className="text-text-default text-sm font-medium">
              Invoice ID
            </Label>
            <Input
              id="invoiceNumber"
              value={values.invoiceNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="INV-2024-033W21"
              className={cn(
                "bg-bg-input-soft! text-text-default hover:bg-bg-input-soft! placeholder:text-text-hint h-9 border-none text-sm",
                touched.invoiceNumber && errors.invoiceNumber && "border-border-destructive border",
              )}
            />
            {touched.invoiceNumber && errors.invoiceNumber && <p className="text-text-destructive text-xs font-light">{errors.invoiceNumber}</p>}
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <DateRangePicker
            from={values.issuedDate ?? undefined}
            to={values.dueDate ?? undefined}
            onChange={({ from, to }) => {
              setFieldValue("issuedDate", from ?? null);
              setFieldValue("dueDate", to ?? null);
              setFieldTouched("issuedDate", true);
              setFieldTouched("dueDate", true);
            }}
          />
          {touched.issuedDate && errors.issuedDate && <p className="text-text-destructive text-xs font-light">{errors.issuedDate as string}</p>}
          {touched.dueDate && errors.dueDate && <p className="text-text-destructive text-xs font-light">{errors.dueDate as string}</p>}
        </div>
      </div>
    </div>
  );
};
