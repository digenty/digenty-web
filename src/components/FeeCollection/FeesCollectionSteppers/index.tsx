"use client";

import { CheckboxCircleFill, Information, Loader2Fill } from "@digenty/icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import {
  useGetAllBanks,
  useGetFeeCollectionSetupStatus,
  useSetupFeeCollection,
  useUpdateFeeCollectionBankAccount,
} from "@/hooks/queryHooks/useFeeCollection";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { BranchAccountDto, FeeCollectionMode, FeeRouteDto } from "@/api/fee-collection";
import { BranchWithClassLevels } from "@/api/types";
import { FEE_COLLECTION_STEPS, useFeeCollectionStep } from "./FeesCollectionSteps";
import { Spinner } from "@/components/ui/spinner";

export type FeesSetupFormValues = {
  mode: FeeCollectionMode | "";
  branchAccounts: BranchAccountDto[];
  feeRoutes: FeeRouteDto[];
  accountVerified: boolean;
};

function isAccountFilled(acc: BranchAccountDto | undefined): boolean {
  return !!acc?.bankCode && acc?.accountNumber?.length === 10;
}

export const FeesSetup = () => {
  const router = useRouter();
  const { activeStep, goToStep } = useFeeCollectionStep();
  useBreadcrumb([{ label: "Fee Collection", url: "/staff/fee-collection" }]);

  const { mutateAsync: setupFeeCollection } = useSetupFeeCollection();
  const { mutateAsync: updateBankAccount } = useUpdateFeeCollectionBankAccount();
  const { data: setupStatus, refetch: refetchSetupStatus } = useGetFeeCollectionSetupStatus();
  const { data: bankOptions = [] } = useGetAllBanks();
  const { data: branchesData } = useGetBranches();
  const branches: BranchWithClassLevels[] = useMemo(() => branchesData?.data ?? [], [branchesData?.data]);

  const [isPersisting, setIsPersisting] = useState(false);
  const hasPersistedSetup = !!setupStatus?.mode;

  const formik = useFormik<FeesSetupFormValues>({
    initialValues: {
      mode: "",
      branchAccounts: [],
      feeRoutes: [],
      accountVerified: false,
    },
    validateOnChange: false,
    onSubmit: () => {},
  });

  // If the school already has a fee collection setup (e.g. arriving via a deep link like
  // ?step=fee-routing from the configured view), hydrate mode/accounts so the right flow renders
  // instead of a blank step.
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (hydratedRef.current || !setupStatus?.mode || formik.values.mode) return;
    hydratedRef.current = true;

    const resolveBankCode = (bankName: string) => bankOptions.find(b => b.name === bankName)?.code ?? "";

    const branchAccounts: BranchAccountDto[] =
      setupStatus.mode === "SINGLE_ACCOUNT" && setupStatus.defaultAccount
        ? [
            {
              bankName: setupStatus.defaultAccount.bankName,
              bankCode: resolveBankCode(setupStatus.defaultAccount.bankName),
              accountNumber: setupStatus.defaultAccount.accountNumber,
              isDefault: true,
            },
          ]
        : (setupStatus.branchAccounts ?? []).map(b => ({
            branchId: b.branchId,
            bankName: b.account.bankName,
            bankCode: resolveBankCode(b.account.bankName),
            accountNumber: b.account.accountNumber,
          }));

    formik.setValues({ mode: setupStatus.mode, branchAccounts, feeRoutes: [], accountVerified: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setupStatus, bankOptions]);

  const flow: "oneAccount" | "differentAccounts" | null =
    formik.values.mode === "SINGLE_ACCOUNT" ? "oneAccount" : formik.values.mode === "BRANCH_ACCOUNTS" ? "differentAccounts" : null;

  const handleSelectMode = (value: "oneAccount" | "differentAccounts") => {
    const mode: FeeCollectionMode = value === "oneAccount" ? "SINGLE_ACCOUNT" : "BRANCH_ACCOUNTS";
    formik.setFieldValue("mode", mode);
    formik.setFieldValue("branchAccounts", []);
    formik.setFieldValue("feeRoutes", []);
    formik.setFieldValue("accountVerified", false);
  };

  // Persists the account-setup step to the backend as soon as it's completed (rather than waiting
  // until the final review step). Without this, the Fee Routing step has no real bank accounts to
  // route fees to, since it queries the backend directly.
  const persistOrSync = async (): Promise<boolean> => {
    if (!formik.values.mode) return false;
    try {
      const modeChanged = hasPersistedSetup && formik.values.mode !== setupStatus!.mode;
      if (!hasPersistedSetup || modeChanged) {
        await setupFeeCollection({ mode: formik.values.mode, branchAccounts: formik.values.branchAccounts });
      } else if (formik.values.mode === "SINGLE_ACCOUNT") {
        const acc = formik.values.branchAccounts[0];
        const existing = setupStatus!.defaultAccount;
        if (acc && existing && (acc.accountNumber !== existing.accountNumber || acc.bankName !== existing.bankName)) {
          await updateBankAccount({
            accountId: existing.id,
            payload: { bankName: acc.bankName, bankCode: acc.bankCode, accountNumber: acc.accountNumber },
          });
        }
      } else {
        for (const acc of formik.values.branchAccounts) {
          const existing = setupStatus!.branchAccounts?.find(b => b.branchId === acc.branchId);
          if (existing && (acc.accountNumber !== existing.account.accountNumber || acc.bankName !== existing.account.bankName)) {
            await updateBankAccount({
              accountId: existing.account.id,
              payload: { bankName: acc.bankName, bankCode: acc.bankCode, accountNumber: acc.accountNumber },
            });
          }
        }
      }
      await refetchSetupStatus();
      return true;
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "Failed to save fee collection setup";
      toast.error(msg);
      return false;
    }
  };

  // Per-step validity — controls whether Continue is enabled
  const isCurrentStepValid = useMemo(() => {
    if (activeStep === -1) return !!flow;
    if (activeStep === 0) {
      if (flow === "oneAccount") {
        return isAccountFilled(formik.values.branchAccounts[0]) && formik.values.accountVerified;
      }
      if (flow === "differentAccounts") {
        return (
          branches.length > 0 &&
          branches.every(({ branch }) => formik.values.branchAccounts.some(a => a.branchId === branch.id && isAccountFilled(a)))
        );
      }
      return false;
    }
    return true;
  }, [activeStep, flow, formik.values.branchAccounts, formik.values.accountVerified, branches]);

  const next = () => goToStep(Math.min(activeStep + 1, 3));
  const prev = () => goToStep(Math.max(activeStep - 1, -1));
  const isFinal = activeStep === 3;

  const handleContinue = async () => {
    if (activeStep === 0) {
      setIsPersisting(true);
      const ok = await persistOrSync();
      setIsPersisting(false);
      if (!ok) return;
    }
    next();
  };

  const handleFinish = async () => {
    setIsPersisting(true);
    const ok = await persistOrSync();
    setIsPersisting(false);
    if (!ok) return;
    toast.success("Fee collection setup complete");
    router.push("/staff/fee-collection");
  };

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
      <form onSubmit={e => e.preventDefault()} className="mx-auto flex items-center justify-center p-3">
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
                      By default, all fees go to the school&apos;s collection account. Only choose a fee if it should be collected separately.
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
                {activeStep !== 1 &&
                  (isFinal ? (
                    <Button
                      type="button"
                      disabled={isPersisting}
                      onClick={handleFinish}
                      className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-9! rounded-md text-sm"
                    >
                      {isPersisting ? <Spinner className="text-text-white-default" /> : "Finish Setup"}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleContinue}
                      disabled={!isCurrentStepValid || isPersisting}
                      className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-9! rounded-md text-sm disabled:opacity-50"
                    >
                      {isPersisting && activeStep === 0 ? <Spinner className="text-text-white-default" /> : "Continue"}
                    </Button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormikProvider>
  );
};
