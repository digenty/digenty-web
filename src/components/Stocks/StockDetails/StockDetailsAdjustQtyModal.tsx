"use client";

import { AddFill, ArrowDownS, ArrowUpS, Information, Subtract } from "@digenty/icons";
import { useFormik } from "formik";
import Image from "next/image";

import { AdjustQuantityDto, StockAdjustReason } from "@/api/stock";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { toast } from "@/components/Toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useAdjustStockQuantity } from "@/hooks/queryHooks/useStock";
import { useIsMobile } from "@/hooks/useIsMobile";

import { DECREASE_REASONS, INCREASE_REASONS } from "./constants";

type Qtyprops = {
  open: boolean;
  setOpen: (open: boolean) => void;
  stockId: number;
  stockName?: string;
  stockImage?: string;
  branchName?: string;
  unitName?: string;
  currentQuantity: number;
};

type AdjustValues = {
  amount: number;
  direction: "increase" | "decrease" | null;
  reason: string;
};

export const StockDetailsAdjustQtyModal = ({
  open,
  setOpen,
  stockId,
  stockName,
  stockImage,
  branchName,
  unitName,
  currentQuantity,
}: Qtyprops) => {
  const isMobile = useIsMobile();
  const { mutateAsync: adjustQuantity, isPending } = useAdjustStockQuantity();

  const formik = useFormik<AdjustValues>({
    initialValues: { amount: 0, direction: null, reason: "" },
    validate: values => {
      const errors: Partial<Record<keyof AdjustValues, string>> = {};
      if (!values.direction) errors.direction = "Choose increase or decrease";
      if (!values.amount || values.amount <= 0) errors.amount = "Enter an amount";
      if (values.direction && !values.reason) errors.reason = "Reason is required";
      return errors;
    },
    onSubmit: async values => {
      const signed = values.direction === "decrease" ? -Math.abs(values.amount) : Math.abs(values.amount);
      try {
        const payload: AdjustQuantityDto = {
          stockId,
          quantityAdjustment: signed,
          reason: values.reason as StockAdjustReason,
        };
        await adjustQuantity(payload);
        toast({ title: "Quantity adjusted", type: "success" });
        formik.resetForm();
        setOpen(false);
      } catch (error) {
        const message = (error as { message?: string } | null)?.message ?? "Could not adjust quantity";
        toast({ title: message, type: "error" });
      }
    },
  });

  const setDirection = (direction: "increase" | "decrease") => {
    formik.setFieldValue("direction", direction);
    formik.setFieldValue("reason", "");
  };

  const handleAmountChange = (value: string) => {
    const num = Math.max(0, Number(value || 0));
    formik.setFieldValue("amount", num);
    if (!formik.values.direction && num > 0) {
      formik.setFieldValue("direction", "increase");
    }
  };

  const direction = formik.values.direction;
  const isIncrease = direction === "increase";
  const isDecrease = direction === "decrease";
  const signedAmount = isDecrease ? -formik.values.amount : formik.values.amount;
  const newTotal = currentQuantity + signedAmount;
  const reasons = isDecrease ? DECREASE_REASONS : INCREASE_REASONS;
  const selectedReasonLabel = reasons.find(r => r.value === formik.values.reason)?.label;
  const summaryWord = isDecrease ? "Removing" : "Increasing";

  const stockImg = stockImage || "/staff/images/image.png";

  const body = (
    <div className="flex w-full flex-col gap-4 px-3 py-4">
      <div className="border-border-default flex items-center justify-between gap-3 rounded-md border p-3 md:p-4">
        <div className="flex items-center gap-2">
          <Image src={stockImg} alt="stock" width={32} height={32} className="rounded-md object-cover" />
          <div className="flex flex-col gap-1">
            <div className="text-text-default text-sm font-semibold">{stockName ?? "Stock"}</div>
            <div className="text-text-subtle flex items-center gap-1 text-xs">
              Current Stock
              <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default rounded-md border font-medium">
                {currentQuantity}
              </Badge>
            </div>
          </div>
        </div>

        {branchName && (
          <Badge className="border-border-darker bg-bg-state-secondary! text-text-default h-7! rounded-md border">{branchName}</Badge>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-text-default text-sm font-medium">Quantity Adjustment</Label>
        <div className="bg-bg-input-soft flex h-9 items-center rounded-md">
          <Input
            type="number"
            min={0}
            value={formik.values.amount}
            onChange={evt => handleAmountChange(evt.target.value)}
            onBlur={formik.handleBlur}
            name="amount"
            className="bg-bg-none! text-text-default h-7! w-full border-none"
            placeholder="0"
          />
          <div className="border-border-default flex h-9 w-7 flex-col items-center gap-1 border-l p-1">
            <ArrowUpS
              fill="var(--color-icon-default-muted)"
              className="border-border-default cursor-pointer border-b"
              onClick={() => setDirection("increase")}
            />
            <ArrowDownS fill="var(--color-icon-default-muted)" className="cursor-pointer" onClick={() => setDirection("decrease")} />
          </div>
        </div>
        <div className="text-text-muted text-xs">Use + for increases (e.g., +10) or - for decreases (e.g., -5)</div>
        {formik.touched.amount && formik.errors.amount && <p className="text-text-destructive text-xs font-light">{formik.errors.amount}</p>}
      </div>

      {direction && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            {isIncrease ? (
              <Badge className="border-border-default bg-bg-badge-green text-bg-basic-green-strong rounded-md border text-xs font-medium">
                <AddFill fill="var(--color-bg-basic-green-strong)" /> Stock Increase
              </Badge>
            ) : (
              <Badge className="border-border-default bg-bg-badge-red text-bg-basic-red-strong rounded-md border text-xs font-medium">
                <Subtract fill="var(--color-bg-basic-red-strong)" /> Stock Decrease
              </Badge>
            )}

            <div className="flex items-center gap-2">
              <div className="text-text-subtle text-xs font-medium">New Total</div>
              <Badge
                className={`border-border-default rounded-md border ${
                  newTotal < 0 ? "bg-bg-badge-red text-bg-basic-red-strong" : "bg-bg-badge-green text-bg-basic-green-strong"
                }`}
              >
                {newTotal}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">{isIncrease ? "Reason for Increase" : "Reason for Decrease"}</Label>
            <Select value={formik.values.reason} onValueChange={value => formik.setFieldValue("reason", value)}>
              <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
                <SelectValue placeholder={isIncrease ? "Select reason for increase" : "Select reason for decrease"}>
                  {selectedReasonLabel ? <span className="text-text-default text-sm">{selectedReasonLabel}</span> : null}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-default border-border-default">
                {reasons.map(r => (
                  <SelectItem key={r.value} value={r.value} className="text-text-default text-sm">
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.reason && formik.errors.reason && <p className="text-text-destructive text-xs font-light">{formik.errors.reason}</p>}
          </div>

          {formik.values.amount > 0 && formik.values.reason && (
            <div className="bg-bg-badge-blue border-border-default flex items-start gap-2 rounded-md border px-3 py-2">
              <Information fill="var(--color-bg-basic-blue-accent)" />
              <div className="flex flex-col gap-1">
                <div className="text-text-default text-sm font-medium">Adjustment Summary</div>
                <div className="text-text-muted text-sm">
                  {summaryWord} {formik.values.amount} {unitName ?? "Pcs"} - {selectedReasonLabel}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const submitButton = (
    <Button
      type="button"
      onClick={() => formik.handleSubmit()}
      disabled={isPending}
      className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm"
    >
      {isPending ? <Spinner /> : "Adjust Quantity"}
    </Button>
  );

  return isMobile ? (
    <MobileDrawer open={open} setIsOpen={setOpen} title="Adjust Quantity">
      {body}
      <DrawerFooter className="border-border-default border-t">
        <div className="flex justify-between">
          <DrawerClose asChild>
            <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-2 py-1 text-sm font-medium">Cancel</Button>
          </DrawerClose>
          {submitButton}
        </div>
      </DrawerFooter>
    </MobileDrawer>
  ) : (
    <Modal open={open} setOpen={setOpen} title="Adjust Quantity" ActionButton={submitButton}>
      {body}
    </Modal>
  );
};
