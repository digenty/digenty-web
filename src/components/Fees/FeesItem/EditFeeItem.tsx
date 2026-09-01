"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Toggle } from "@/components/Toggle";
import { useGetFeeItemById, useUpdateFeeItem } from "@/hooks/queryHooks/useFee";
import { BackLink } from "@/components/BackLink";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Formik, Form } from "formik";
import { toast } from "sonner";
import * as yup from "yup";
import type { UpdateFeeItemDto, FeeItemDetailResponse, FeePaymentMode, FeeInstallmentDetail } from "@/api/fee";
import { emptyInstallmentRow, PaymentModeFields, type InstallmentRowInput } from "@/components/Fees/PaymentMode/PaymentModeFields";
import { buildInstallmentsPayload } from "@/components/Fees/AddFee/useFeeForm";
import { AlertFill } from "@digenty/icons";

interface EditFeeItemFormValues {
  name: string;
  quantity: number;
  required: boolean;
  amount: number | "";
  setDifferentPricesPerClass: boolean;
  classArmAmounts: { armId: number; amount: number | ""; label: string }[];
  paymentMode: FeePaymentMode;
  installments: InstallmentRowInput[];
}

// The server locks paymentMode/installments/amount/quantity once a parent has paid into an
// instalment schedule and rejects edits with this message — there's no separate flag on the
// GET response to detect it proactively, so we react to the 400 instead.
const SCHEDULE_LOCKED_MESSAGE = "already paid into";

const toInstallmentRow = (row: FeeInstallmentDetail): InstallmentRowInput => ({
  percentage: row.percentage,
  dueDate: row.dueDate ? new Date(row.dueDate) : undefined,
  label: row.label ?? "",
});

const validationSchema = yup.object({
  name: yup.string().required("Fee name is required"),
});

export const EditFeeItem = () => {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);

  const { data, isPending: loadingItem } = useGetFeeItemById(id);
  const item = data as FeeItemDetailResponse | undefined;
  const { mutate: updateFeeItem, isPending } = useUpdateFeeItem(id);
  const [locked, setLocked] = useState(false);

  useBreadcrumb([
    { label: "Fees", url: "/staff/fees" },
    { label: "Fee Items", url: "/staff/fees?tab=Fee Items" },
    { label: item?.feeName ?? "Fee Item", url: `/staff/fees/fee-item/${id}` },
    { label: "Edit", url: `/staff/fees/fee-item/${id}/edit` },
  ]);

  const hasDifferentPrices = item ? item.amount === null && (item.appliedClasses?.some(g => g.classes.some(c => c.amount > 0)) ?? false) : false;

  const initialValues: EditFeeItemFormValues = useMemo(() => {
    if (!item) {
      return {
        name: "",
        quantity: 1,
        required: false,
        amount: "",
        setDifferentPricesPerClass: false,
        classArmAmounts: [],
        paymentMode: "FULL",
        installments: [{ ...emptyInstallmentRow }, { ...emptyInstallmentRow }],
      };
    }

    const classArmAmounts = item.appliedClasses.flatMap(g =>
      g.classes
        .filter(c => c.armId !== null)
        .map(c => ({
          armId: c.armId as number,
          amount: c.amount,
          label: `${c.className}${c.armName ? ` ${c.armName}` : ""}`,
        })),
    );

    return {
      name: item.feeName,
      quantity: item.quantity,
      required: item.required,
      amount: item.amount ?? (hasDifferentPrices ? "" : (item.minAmount ?? "")),
      setDifferentPricesPerClass: hasDifferentPrices,
      classArmAmounts,
      paymentMode: item.paymentMode ?? "FULL",
      installments:
        item.installments && item.installments.length > 0 ? item.installments.map(toInstallmentRow) : [{ ...emptyInstallmentRow }, { ...emptyInstallmentRow }],
    };
  }, [item, hasDifferentPrices]);

  if (loadingItem) {
    return (
      <div className="mx-auto flex w-full max-w-225 flex-col gap-4 px-4 py-4 md:px-8">
        <div className="md:hidden">
          <BackLink href={`/staff/fees/fee-item/${id}`} />
        </div>
        <Skeleton className="bg-bg-input-soft h-8 w-56" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="bg-bg-input-soft h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={values => {
        const branchIds = item?.branches?.map(b => b.branchId) ?? [];
        const armIds = item?.appliedClasses?.flatMap(g => g.classes.filter(c => c.armId !== null).map(c => c.armId as number)) ?? [];

        const payload: UpdateFeeItemDto = {
          name: values.name.trim(),
          quantity: values.quantity,
          required: values.required,
          paymentMode: values.paymentMode,
          installments: values.paymentMode === "INSTALLMENT" ? buildInstallmentsPayload(values.installments) : undefined,
          branchIds,
          armIds,
        };

        if (values.setDifferentPricesPerClass) {
          payload.setDifferentPricesPerClass = true;
          payload.classArmAmounts = values.classArmAmounts.map(c => ({
            armId: c.armId,
            amount: Number(c.amount),
          }));
        } else {
          payload.amount = Number(values.amount);
        }

        updateFeeItem(payload, {
          onSuccess: () => {
            toast.success("Fee item updated successfully");
            router.push(`/staff/fees/fee-item/${id}`);
          },
          onError: (error: unknown) => {
            const message = (error as { message?: string })?.message;
            if (message?.toLowerCase().includes(SCHEDULE_LOCKED_MESSAGE)) {
              setLocked(true);
            }
            toast.error(message ?? "Failed to update fee item");
          },
        });
      }}
    >
      {({ values, errors, touched, setFieldValue, handleChange, handleBlur }) => {
        const decrease = () => setFieldValue("quantity", values.quantity > 1 ? values.quantity - 1 : 1);
        const increase = () => setFieldValue("quantity", values.quantity + 1);

        const setArmAmount = (armId: number, amount: number | "") => {
          setFieldValue(
            "classArmAmounts",
            values.classArmAmounts.map(c => (c.armId === armId ? { ...c, amount } : c)),
          );
        };

        return (
          <Form className="flex flex-col items-center p-4 pb-24 md:p-8">
            <div className="flex w-full max-w-225 flex-col gap-6">
              <div className="md:hidden">
                <BackLink href={`/staff/fees/fee-item/${id}`} />
              </div>
              <div className="text-text-default text-lg font-semibold">Edit Fee Item</div>

              {locked && (
                <div className="border-border-destructive bg-bg-basic-red-subtle flex items-start gap-2 rounded-md border p-3">
                  <AlertFill fill="var(--color-bg-basic-red-strong)" className="mt-0.5 size-4 shrink-0" />
                  <p className="text-text-destructive text-sm">
                    This fee is on an instalment plan that parents have already paid into. Its payment mode, schedule, amount and quantity can no
                    longer be changed — you can still update the name and required status.
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">Fee Name</Label>
                <Input
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-bg-input-soft! text-text-default rounded-md border-none"
                  placeholder="Input Fee Name"
                />
                {touched.name && errors.name && <span className="text-text-destructive text-xs">{errors.name}</span>}
              </div>

              <div className="flex max-w-fit items-center gap-2">
                {values.required ? (
                  <Badge className="text-bg-basic-fuchsia-strong bg-bg-badge-fuchsia border-border-default h-5! w-16! rounded-sm border">
                    Required
                  </Badge>
                ) : (
                  <Badge className="text-text-default border-border-default h-5! w-16! rounded-sm border">Optional</Badge>
                )}
                <Toggle checked={values.required} onChange={e => setFieldValue("required", e.target.checked)} className="border-none" />
              </div>

              {item && (
                <div className="bg-bg-input-soft flex items-center gap-2 rounded-md px-3 py-2">
                  <span className="text-text-muted text-sm">Term &amp; Session:</span>
                  <span className="text-text-default text-sm font-medium">{item.termLabel}</span>
                </div>
              )}

              {/* <div>
                <Label className="text-text-default mb-2 text-sm font-medium">Quantity</Label>
                <div className="bg-bg-input-soft flex w-full max-w-57 justify-between gap-2 rounded-md p-2">
                  <div className="text-text-subtle cursor-pointer select-none" onClick={decrease}>
                    -
                  </div>
                  <div className="text-text-default text-sm font-normal">{values.quantity}</div>
                  <div className="text-text-subtle cursor-pointer select-none" onClick={increase}>
                    +
                  </div>
                </div>
              </div> */}

              {!values.setDifferentPricesPerClass && (
                <div className="flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">Amount</Label>
                  <Input
                    name="amount"
                    type="number"
                    value={values.amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={locked}
                    className="bg-bg-input-soft! text-text-default w-full border-none"
                    placeholder="₦0.00"
                  />
                  {touched.amount && errors.amount && <span className="text-text-destructive text-xs">{String(errors.amount)}</span>}
                </div>
              )}

              <label className={`flex items-center gap-2 ${locked ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
                <Checkbox
                  checked={values.setDifferentPricesPerClass}
                  disabled={locked}
                  onCheckedChange={v => setFieldValue("setDifferentPricesPerClass", !!v)}
                />
                <div className="text-text-muted text-xs font-normal">Set different prices per class</div>
              </label>

              {values.setDifferentPricesPerClass && values.classArmAmounts.length > 0 && (
                <div>
                  <div className="text-text-default text-md mb-1 font-semibold">Fee Amount Configuration</div>
                  <div className="text-text-muted mb-3 text-sm font-normal">Input amount per class</div>
                  <div className="border-border-default rounded-md border">
                    <div className="bg-bg-input-soft text-text-muted flex items-center justify-between gap-2 p-3 text-sm">
                      <div>Class</div>
                      <div>Amount</div>
                    </div>
                    <div className="flex w-full flex-col gap-5 p-3">
                      {values.classArmAmounts.map(row => (
                        <div key={row.armId} className="flex w-full justify-between gap-4">
                          <div className="bg-bg-input-soft text-text-default w-full rounded-md p-2 text-sm font-normal">{row.label}</div>
                          <Input
                            type="number"
                            value={row.amount}
                            onChange={e => setArmAmount(row.armId, e.target.value === "" ? "" : Number(e.target.value))}
                            className="bg-bg-input-soft text-text-default w-full rounded-md border-none p-2 text-sm font-normal"
                            placeholder="₦ 0.00"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <PaymentModeFields
                mode={values.paymentMode}
                installments={values.installments}
                onModeChange={mode => setFieldValue("paymentMode", mode)}
                onInstallmentsChange={rows => setFieldValue("installments", rows)}
                error={typeof errors.installments === "string" ? errors.installments : undefined}
                disabled={locked}
              />
            </div>

            <div className="bg-bg-default border-border-default fixed right-0 bottom-0 left-(--sidebar-w) z-10 border-t">
              <div className="flex items-center justify-between px-4 py-3">
                <Button
                  type="button"
                  onClick={() => router.push(`/staff/fees/fee-item/${id}`)}
                  className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! text-text-subtle h-7! rounded-md"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7! rounded-md"
                >
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
