"use client";

import { CheckboxCircleFill, Information, Loader2Fill } from "@digenty/icons";
import React, { useMemo } from "react";
import { useFormik, FormikProvider } from "formik";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FeesMode } from "./FeesMode";
import { OneCollectionAccount } from "./FeesModeOneAccount/OneCollectionAccount";
import { OneFeesRouting } from "./FeesModeOneAccount/OneFeesRouting";

import { Button } from "@/components/ui/button";

import { OneAccountReview } from "./FeesModeOneAccount/OneAccountReview";
import { DifferentFeesAccount } from "./FeesModeDifferentAccounts/DifferentFeesAccount";
import { DifferentFeesRounting } from "./FeesModeDifferentAccounts/DifferentFeesRounting";
import { DifferentFeesReview } from "./FeesModeDifferentAccounts/DifferentFeesReview";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useSetupFeeCollection } from "@/hooks/queryHooks/useFeeCollection";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { BranchAccountDto, FeeCollectionMode, FeeRouteDto } from "@/api/fee-collection";
import { BranchWithClassLevels } from "@/api/types";
import { FEE_COLLECTION_STEPS, useFeeCollectionStep } from "./FeesCollectionSteps";

export type FeesSetupFormValues = {
  mode: FeeCollectionMode | "";
  branchAccounts: BranchAccountDto[];
  feeRoutes: FeeRouteDto[];
};

function isAccountFilled(acc: BranchAccountDto | undefined): boolean {
  return !!acc?.bankCode && acc?.accountNumber?.length === 10;
}

export const FeesSetup = () => {
  const router = useRouter();
  const { activeStep, goToStep } = useFeeCollectionStep();
  useBreadcrumb([{ label: "Fee Collection", url: "/staff/fee-collection" }]);

  const { mutate: setupFeeCollection, isPending } = useSetupFeeCollection();
  const { data: branchesData } = useGetBranches();
  const branches: BranchWithClassLevels[] = useMemo(() => branchesData?.data ?? [], [branchesData?.data]);

  const formik = useFormik<FeesSetupFormValues>({
    initialValues: {
      mode: "",
      branchAccounts: [],
      feeRoutes: [],
    },
    validateOnChange: false,
    onSubmit: values => {
      if (!values.mode) return;
      setupFeeCollection(
        {
          mode: values.mode,
          branchAccounts: values.branchAccounts,
          feeRoutes: values.feeRoutes.length ? values.feeRoutes : undefined,
        },
        {
          onSuccess: () => {
            toast.success("Fee collection setup complete");
            router.push("/staff/fee-collection");
          },
          onError: (err: unknown) => {
            const msg = (err as { message?: string })?.message ?? "Failed to set up fee collection";
            toast.error(msg);
          },
        },
      );
    },
  });

  const flow: "oneAccount" | "differentAccounts" | null =
    formik.values.mode === "SINGLE_ACCOUNT" ? "oneAccount" : formik.values.mode === "BRANCH_ACCOUNTS" ? "differentAccounts" : null;

  const handleSelectMode = (value: "oneAccount" | "differentAccounts") => {
    const mode: FeeCollectionMode = value === "oneAccount" ? "SINGLE_ACCOUNT" : "BRANCH_ACCOUNTS";
    formik.setFieldValue("mode", mode);
    formik.setFieldValue("branchAccounts", []);
    formik.setFieldValue("feeRoutes", []);
  };

  // Per-step validity — controls whether Continue is enabled
  const isCurrentStepValid = useMemo(() => {
    if (activeStep === -1) return !!flow;
    if (activeStep === 0) {
      if (flow === "oneAccount") {
        return isAccountFilled(formik.values.branchAccounts[0]);
      }
      if (flow === "differentAccounts") {
        return (
          branches.length > 0 &&
          branches.every(({ branch }) =>
            isAccountFilled(formik.values.branchAccounts.find(a => a.branchId === branch.id)),
          )
        );
      }
      return false;
    }
    return true;
  }, [activeStep, flow, formik.values.branchAccounts, branches]);

  const next = () => goToStep(Math.min(activeStep + 1, 3));
  const prev = () => goToStep(Math.max(activeStep - 1, -1));
  const isFinal = activeStep === 3;

  const renderStepIndicator = (index: number) => {
    // routing-decision (step 1) maps to the same indicator slot as routing (index 2)
    const indicatorActive = activeStep === 1 ? 2 : activeStep + 1;
    if (index < indicatorActive) {
      return <CheckboxCircleFill fill="var(--color-icon-success)" />;
    }
    if (index === indicatorActive) {
      return <Loader2Fill fill="var(--color-icon-informative)" />;
    }
    return (
      <div className="border-border-default text-text-default flex h-6 w-6 items-center justify-center rounded-full border text-sm font-medium">
        {index + 1}
      </div>
    );
  };

  return (
    <FormikProvider value={formik}>
      <form
        onSubmit={e => e.preventDefault()}
        className="mx-auto flex items-center justify-center p-3"
      >
        <div className="flex w-full max-w-175 flex-col gap-8">
          {/* Step indicator */}
          <div className="bg-bg-card border-border-default relative flex w-full items-center rounded-md border p-4">
            {FEE_COLLECTION_STEPS.map((step, index) => {
              const isLast = index === FEE_COLLECTION_STEPS.length - 1;
              return (
                <div key={step.key} className="relative flex w-full flex-1 flex-col items-start">
                  {!isLast && <div className="border-border-default absolute top-2.5 left-1/9 h-0.5 w-xs border-b" />}
                  <div className="relative z-10">{renderStepIndicator(index)}</div>
                  <span className="text-md text-text-default mt-4 font-medium">{step.label}</span>
                </div>
              );
            })}
          </div>

          {/* Step content */}
          <div className="bg-bg-card border-border-default flex flex-col gap-8 rounded-md border">
            <div className="px-6 pt-6">
              {/* Step -1: Choose mode */}
              {activeStep === -1 && <FeesMode selected={flow} onSelect={handleSelectMode} />}

              {/* Step 0: Account setup */}
              {activeStep === 0 && flow === "oneAccount" && <OneCollectionAccount />}
              {activeStep === 0 && flow === "differentAccounts" && <DifferentFeesAccount branches={branches} />}

              {/* Step 1: Routing decision */}
              {activeStep === 1 && (
                <div className="flex flex-col gap-8">
                  <div>
                    <div className="text-text-default text-lg font-semibold">Do any fees need a different account?</div>
                    <div className="text-text-muted text-sm font-normal">
                      By default, all fees go to the school&apos;s collection account. Only choose a fee if it should be collected
                      separately.
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 md:flex-row">
                    <Button
                      type="button"
                      onClick={() => goToStep(3)}
                      className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-10! w-full rounded-md text-center md:w-80!"
                    >
                      Skip for now
                    </Button>
                    <Button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! text-text-subtle h-10! w-full rounded-md md:w-80!"
                    >
                      Set up fee routing
                    </Button>
                  </div>
                  <div className="bg-bg-basic-gray-subtle flex h-10 w-full items-center gap-2 rounded-md p-3">
                    <Information fill="var(--color-icon-default)" />
                    <div className="text-text-subtle text-xs">You can set this up later in fee collection</div>
                  </div>
                </div>
              )}

              {/* Step 2: Fee routing */}
              {activeStep === 2 && flow === "oneAccount" && <OneFeesRouting />}
              {activeStep === 2 && flow === "differentAccounts" && <DifferentFeesRounting />}

              {/* Step 3: Review */}
              {activeStep === 3 && flow === "oneAccount" && (
                <OneAccountReview
                  selected={flow}
                  onSelect={value => {
                    handleSelectMode(value);
                    goToStep(0);
                  }}
                />
              )}
              {activeStep === 3 && flow === "differentAccounts" && (
                <DifferentFeesReview
                  selected={flow}
                  onSelect={value => {
                    handleSelectMode(value);
                    goToStep(0);
                  }}
                />
              )}
            </div>

            {/* Nav buttons */}
            <div className="border-border-default border-t">
              <div className="flex justify-between p-6">
                <Button
                  type="button"
                  onClick={prev}
                  disabled={activeStep === -1}
                  className="bg-bg-state-soft hover:bg-bg-state-soft-hover! text-text-subtle h-9! rounded-md text-sm"
                >
                  Previous
                </Button>

                {/* Routing-decision step has its own inline buttons; hide the bottom nav Continue */}
                {activeStep !== 1 && (
                  isFinal ? (
                    <Button
                      type="button"
                      disabled={isPending}
                      onClick={() => formik.submitForm()}
                      className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-9! rounded-md text-sm"
                    >
                      {isPending ? "Saving..." : "Finish"}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={next}
                      disabled={!isCurrentStepValid}
                      className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-9! rounded-md text-sm disabled:opacity-50"
                    >
                      Continue
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormikProvider>
  );
};
