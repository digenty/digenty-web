"use client";

import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FEES_STEPS, useFeesStep } from "./FeesSteps";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useRouter } from "next/navigation";
import { useCreateFeeItem } from "@/hooks/queryHooks/useFee";
import { FeeTermType } from "@/api/fee";
import { toast } from "sonner";
import FeeDetails from "./FeeDetails";
import { FeeBranch } from "./FeeBranch";
import FeesClassApplyTo from "./FeesClassApplyTo";
import FeeAmount from "./FeeAmount";
import { feeSchema } from "@/schema/fees";
import { FeeFormValues } from "@/api/types";

export const AddFee = () => {
  const router = useRouter();
  const { step, goToStep } = useFeesStep();
  const { mutateAsync: createFeeItem, isPending } = useCreateFeeItem();

  useBreadcrumb([
    { label: "Fees", url: "/staff/fees" },
    { label: "Class Fees", url: "/staff/fees?tab=Class Fees" },
    { label: "Add fees", url: "/staff/fees/add" },
  ]);

  const stepIndex = FEES_STEPS.findIndex(s => s.key === step);
  const current = stepIndex + 1;
  const total = FEES_STEPS.length;

  const formik = useFormik<FeeFormValues>({
    initialValues: {
      name: "",
      session: "",
      term: "",
      quantity: 1,
      required: false,
      branchIds: [],
      armIds: [],
      selectedArmsInfo: [],
      amount: "",
      setDifferentPricesPerBranch: false,
      setDifferentPricesPerClass: false,
      branchAmounts: [],
      classArmAmounts: [],
      allowPartPayment: false,
      minimumPartPayment: "",
    },
    validationSchema: feeSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async values => {
      const unitPrice = values.amount === "" ? 0 : (values.amount as number);

      // Group selected arms by branch — backend requires all armIds in one
      // call to belong to the same branch.
      const byBranch = new Map<number, number[]>();
      for (const arm of values.selectedArmsInfo) {
        if (!byBranch.has(arm.branchId)) byBranch.set(arm.branchId, []);
        byBranch.get(arm.branchId)!.push(arm.armId);
      }

      const buildPayload = (branchIds: number[], armIds: number[]) => ({
        name: values.name,
        session: values.session as number,
        term: values.term as FeeTermType,
        quantity: values.quantity,
        required: values.required,
        amount: unitPrice,
        branchIds,
        armIds,
        setDifferentPricesPerBranch: values.setDifferentPricesPerBranch,
        setDifferentPricesPerClass: values.setDifferentPricesPerClass,
        branchAmounts: values.branchAmounts,
        classArmAmounts: values.classArmAmounts,
        allowPartPayment: values.allowPartPayment,
        minimumPartPayment: values.minimumPartPayment === "" ? 0 : (values.minimumPartPayment as number),
      });

      try {
        if (byBranch.size <= 1) {
          await createFeeItem(buildPayload(values.branchIds, values.armIds));
        } else {
          // Arms from multiple branches — one call per branch
          await Promise.all(
            Array.from(byBranch.entries()).map(([branchId, armIds]) =>
              createFeeItem(
                buildPayload(
                  [branchId],
                  armIds,
                ),
              ),
            ),
          );
        }

        toast.success("Fee added successfully");
        router.push("/staff/fees");
      } catch (err: unknown) {
        const msg = (err as { message?: string })?.message ?? "Failed to add fee";
        toast.error(msg);
      }
    },
  });

  return (
    <div>
      <div className="bg-bg-card-subtle border-border-default flex w-full items-center justify-between border-b p-3">
        <div className="text-text-default text-md mx-auto flex w-full font-semibold md:block md:max-w-150 md:items-center md:justify-center">
          Add Fees
        </div>
        <Badge className="text-text-subtle bg-bg-badge-default border-border-default block h-6 rounded-sm border p-1 md:hidden">
          {current}/{total}
        </Badge>
      </div>

      <form onSubmit={formik.handleSubmit}>
        {/* Desktop — all steps visible at once */}
        <div className="mx-auto my-4 hidden w-full md:block md:max-w-150">
          <div className="mx-3 mb-20 hidden flex-col gap-6 md:mx-0 md:flex">
            <FeeDetails formik={formik} />
            <FeeBranch formik={formik} />
            <FeesClassApplyTo formik={formik} />
            <FeeAmount formik={formik} />
          </div>

          <div className="border-border-default bg-bg-default fixed bottom-0 w-full max-w-150 border-t py-3 pr-8 pl-4 md:px-0">
            <div className="flex justify-between">
              <Button
                type="button"
                onClick={() => router.push("/staff/fees")}
                className="bg-bg-state-soft! text-text-subtle! hover:bg-bg-state-soft-hover! h-7! text-sm"
              >
                Cancel
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-bg-state-soft! text-text-subtle! hover:bg-bg-state-soft-hover! h-7! w-39! text-sm"
                  onClick={() => {
                    /* stays on page logic */
                  }}
                >
                  Save & Add Another
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-7! w-19!"
                >
                  {isPending ? "Saving..." : "Add Fee"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile — step by step */}
        <div className="flex md:hidden">
          <div className="w-full p-3">
            {step === "details" && <FeeDetails formik={formik} />}
            {step === "branch" && <FeeBranch formik={formik} />}
            {step === "classes" && <FeesClassApplyTo formik={formik} />}
            {step === "amount" && <FeeAmount formik={formik} />}
          </div>

          <div className="border-border-default bg-bg-default absolute right-0 bottom-0 left-0 z-20 mt-4 flex w-full justify-between gap-2 border-t p-2">
            {stepIndex > 0 && (
              <Button
                type="button"
                variant="outline"
                className="bg-bg-state-soft! text-text-subtle h-8! rounded-sm border-none px-2.5! py-1.5 text-sm"
                onClick={() => goToStep(FEES_STEPS[stepIndex - 1].key)}
              >
                Back
              </Button>
            )}
            <div>
              {stepIndex === 0 && (
                <Button
                  type="button"
                  onClick={() => router.push("/staff/fees")}
                  className="bg-bg-state-soft! text-text-subtle h-8! border-none px-2.5! py-1.5 text-sm"
                >
                  Cancel
                </Button>
              )}
            </div>

            <div className="flex flex-row items-center justify-between">
              {stepIndex < FEES_STEPS.length - 1 ? (
                <Button
                  type="button"
                  className="text-text-white-default bg-bg-state-primary! h-8! border-none px-2.5! py-1.5 text-sm"
                  onClick={() => goToStep(FEES_STEPS[stepIndex + 1].key)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isPending}
                  className="text-text-white-default bg-bg-state-primary! h-8! border-none px-2.5! py-1.5 text-sm"
                >
                  {isPending ? "Saving..." : "Add Fee"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
