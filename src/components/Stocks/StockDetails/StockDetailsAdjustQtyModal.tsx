"use client";

import { AddFill, ArrowDownS, ArrowUpS, Information, Subtract, UserFill } from "@digenty/icons";
import { useFormik } from "formik";
import Image from "next/image";
import { useEffect, useState } from "react";

import { AdjustQuantityDto, StockAdjustReason } from "@/api/stock";
import { Student } from "@/api/types";
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
import { useGetStudents } from "@/hooks/queryHooks/useStudent";
import { useAdjustStockQuantity } from "@/hooks/queryHooks/useStock";
import useDebounce from "@/hooks/useDebounce";
import { useIsMobile } from "@/hooks/useIsMobile";

import { DECREASE_REASONS, INCREASE_REASONS } from "./constants";
import { StockTransactionRecord } from "./type";

type Qtyprops = {
  open: boolean;
  setOpen: (open: boolean) => void;
  stockId: number;
  branchId?: number;
  stockName?: string;
  stockImage?: string;
  branchName?: string;
  unitName?: string;
  currentQuantity: number;
  onAdjusted?: (transaction: StockTransactionRecord) => void;
};

type AdjustValues = {
  amount: number;
  direction: "increase" | "decrease" | null;
  reason: string;
  studentId?: number;
  studentName?: string;
};

export const StockDetailsAdjustQtyModal = ({
  open,
  setOpen,
  stockId,
  branchId,
  stockName,
  stockImage,
  branchName,
  unitName,
  currentQuantity,
  onAdjusted,
}: Qtyprops) => {
  const isMobile = useIsMobile();
  const { mutateAsync: adjustQuantity, isPending } = useAdjustStockQuantity();

  const [studentSearch, setStudentSearch] = useState("");
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const debouncedStudentSearch = useDebounce(studentSearch, 400);

  const formik = useFormik<AdjustValues>({
    initialValues: { amount: 0, direction: null, reason: "", studentId: undefined, studentName: "" },
    validate: values => {
      const errors: Partial<Record<keyof AdjustValues, string>> = {};
      if (!values.direction) errors.direction = "Choose increase or decrease";
      if (!values.amount || values.amount <= 0) errors.amount = "Enter an amount";
      if (values.direction && !values.reason) errors.reason = "Reason is required";
      if (values.direction === "decrease" && values.reason === "SOLD" && !values.studentId) {
        errors.studentId = "Please select a student";
      }
      return errors;
    },
    onSubmit: async values => {
      const signed = values.direction === "decrease" ? -Math.abs(values.amount) : Math.abs(values.amount);
      try {
        const payload: AdjustQuantityDto = {
          stockId,
          branchId,
          quantityAdjustment: signed,
          reason: values.reason as StockAdjustReason,
          studentId: values.studentId,
        };
        const result = await adjustQuantity(payload);

        const raw = result as Record<string, unknown> | null;
        const tx: StockTransactionRecord = {
          id: (raw?.id as number) ?? (raw?.data as Record<string, unknown>)?.id as number ?? 0,
          reason: values.reason,
          before: (raw?.quantityBefore as number) ?? currentQuantity,
          after: (raw?.quantityAfter as number) ?? currentQuantity + signed,
          change: (raw?.quantityChange as number) ?? signed,
          branchName: (raw?.branchName as string) ?? branchName,
          changedByName: (raw?.changedByName as string) ?? undefined,
          studentName: (raw?.studentName as string) ?? values.studentName,
          type: values.direction === "decrease" ? "DECREASE" : "INCREASE",
          itemName: stockName,
          imagePath: stockImage,
        };

        toast({ title: "Quantity adjusted", type: "success" });
        formik.resetForm();
        setStudentSearch("");
        setOpen(false);
        onAdjusted?.(tx);
      } catch (error) {
        const message = (error as { message?: string } | null)?.message ?? "Could not adjust quantity";
        toast({ title: message, type: "error" });
      }
    },
  });

  useEffect(() => {
    if (!open) {
      setStudentSearch("");
      setShowStudentDropdown(false);
    }
  }, [open]);

  const isSold = formik.values.direction === "decrease" && formik.values.reason === "SOLD";

  const { data: studentData, isLoading: studentsLoading } = useGetStudents({
    limit: 15,
    search: debouncedStudentSearch,
    enabled: isSold,
  });
  const students: Student[] = studentData?.pages?.[0]?.content ?? [];

  const selectStudent = (student: Student) => {
    const name = `${student.firstName} ${student.lastName}`;
    formik.setFieldValue("studentId", student.id);
    formik.setFieldValue("studentName", name);
    setStudentSearch(name);
    setShowStudentDropdown(false);
  };

  const setDirection = (direction: "increase" | "decrease") => {
    formik.setFieldValue("direction", direction);
    formik.setFieldValue("reason", "");
    formik.setFieldValue("studentId", undefined);
    formik.setFieldValue("studentName", "");
    setStudentSearch("");
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

  const summaryText =
    isDecrease && formik.values.reason === "SOLD" && formik.values.studentName
      ? `Removing ${formik.values.amount} ${unitName ?? "Pcs"} - sold to ${formik.values.studentName}`
      : `${isDecrease ? "Removing" : "Increasing"} ${formik.values.amount} ${unitName ?? "Pcs"} - ${selectedReasonLabel}`;

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
            <Select
              value={formik.values.reason}
              onValueChange={value => {
                formik.setFieldValue("reason", value);
                if (value !== "SOLD") {
                  formik.setFieldValue("studentId", undefined);
                  formik.setFieldValue("studentName", "");
                  setStudentSearch("");
                }
              }}
            >
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

          {isSold && (
            <div className="flex flex-col gap-2">
              <Label className="text-text-default flex items-center gap-1.5 text-sm font-medium">
                <UserFill fill="var(--color-icon-default-muted)" className="size-4" /> Sold to
              </Label>
              <div className="relative">
                <div className="bg-bg-input-soft flex h-9 items-center gap-2 rounded-md px-3">
                  <UserFill fill="var(--color-icon-default-muted)" className="size-4 shrink-0" />
                  <input
                    className="text-text-default placeholder:text-text-muted h-full w-full bg-transparent text-sm outline-none"
                    placeholder="Select student sold to"
                    value={studentSearch}
                    onChange={e => {
                      setStudentSearch(e.target.value);
                      formik.setFieldValue("studentId", undefined);
                      formik.setFieldValue("studentName", "");
                      setShowStudentDropdown(true);
                    }}
                    onFocus={() => setShowStudentDropdown(true)}
                    onBlur={() => setTimeout(() => setShowStudentDropdown(false), 150)}
                  />
                </div>
                {showStudentDropdown && (
                  <div className="bg-bg-card border-border-default absolute top-full z-50 mt-1 max-h-40 w-full overflow-y-auto rounded-md border shadow-md">
                    {studentsLoading ? (
                      <div className="text-text-muted p-3 text-center text-sm">Loading...</div>
                    ) : students.length === 0 ? (
                      <div className="text-text-muted p-3 text-center text-sm">No students found</div>
                    ) : (
                      students.map(s => (
                        <div
                          key={s.id}
                          className="hover:bg-bg-card-subtle text-text-default cursor-pointer px-3 py-2 text-sm"
                          onMouseDown={() => selectStudent(s)}
                        >
                          {s.firstName} {s.lastName}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              {formik.touched.studentId && formik.errors.studentId && (
                <p className="text-text-destructive text-xs font-light">{formik.errors.studentId}</p>
              )}
            </div>
          )}

          {formik.values.amount > 0 && formik.values.reason && (
            <div className="bg-bg-badge-blue border-border-default flex items-start gap-2 rounded-md border px-3 py-2">
              <Information fill="var(--color-bg-basic-blue-accent)" />
              <div className="flex flex-col gap-1">
                <div className="text-text-default text-sm font-medium">Adjustment Summary</div>
                <div className="text-text-muted text-sm">{summaryText}</div>
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
