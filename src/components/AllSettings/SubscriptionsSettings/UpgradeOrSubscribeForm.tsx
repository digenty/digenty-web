"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import Information from "@/components/Icons/Information";
import { AddFill } from "@/components/Icons/AddFill";
import { Subtract } from "@/components/Icons/Subtract";
import { User3 } from "@/components/Icons/User3";
import { BuildingFill } from "@/components/Icons/BuildingFill";
import { OrderSummary } from "./OrderSummary";
import { BILLING_CYCLE_TO_PLAN_TYPE, BillingCycle, STUDENT_TIER_RANGES } from "./type";
import { useCheckoutSubscription, useGetCurrentSubscription, useGetPlans } from "@/hooks/queryHooks/useSubscription";
import { useGetStudentsDistribution } from "@/hooks/queryHooks/useStudent";
import { StudentsStatus } from "@/components/StudentAndParent/types";
import { PlanResponseDto } from "@/api/subscription";
import { toast } from "@/components/Toast";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

interface UpgradeOrSubscribeFormProps {
  isUpgrade?: boolean;
}

const isBillingCycle = (value: string | null): value is BillingCycle => value === "Termly" || value === "Yearly";

const CYCLES: BillingCycle[] = ["Termly", "Yearly"];

const BillingCycleTabs = ({ value, onChange }: { value: BillingCycle; onChange: (v: BillingCycle) => void }) => (
  <div className="bg-bg-state-soft flex items-center gap-1 rounded-full p-0.5">
    {CYCLES.map(cycle => (
      <button
        key={cycle}
        type="button"
        onClick={() => onChange(cycle)}
        className={cn(
          "h-7 rounded-full px-4 text-xs font-medium transition-colors",
          value === cycle ? "bg-bg-state-secondary border-border-darker text-text-default border shadow-sm" : "text-text-muted",
        )}
      >
        {cycle}
      </button>
    ))}
  </div>
);

const REFERRAL_BALANCE = 0;

const tierForCount = (count: number) => {
  for (const [tier, range] of Object.entries(STUDENT_TIER_RANGES)) {
    if (count >= range.min && count <= range.max) return tier;
  }
  return "1-200";
};

export const UpgradeOrSubscribeForm = ({ isUpgrade }: UpgradeOrSubscribeFormProps) => {
  useBreadcrumb([
    { label: "Settings", url: "/staff/settings" },
    { label: "Subscriptions", url: "/staff/settings/subscription" },
    {
      label: isUpgrade ? "Upgrade Plan" : "Subscribe",
      url: isUpgrade ? "/staff/settings/subscription/upgrade" : "/staff/settings/subscription/subscribe",
    },
  ]);
  const searchParams = useSearchParams();
  const cycleParam = searchParams.get("cycle");
  const planParam = searchParams.get("plan");

  const { data: plans, isLoading: isLoadingPlans } = useGetPlans();
  const { data: currentSubscription } = useGetCurrentSubscription();
  const { mutate: checkout, isPending } = useCheckoutSubscription();
  const { data: distribution } = useGetStudentsDistribution();
  const totalActiveStudents =
    distribution?.data?.find((d: { status: StudentsStatus; count: number }) => d.status === StudentsStatus.Active)?.count ?? 0;

  const [billingCycle, setBillingCycle] = useState<BillingCycle>(isBillingCycle(cycleParam) ? cycleParam : "Termly");
  const [selectedPlanName, setSelectedPlanName] = useState<string | null>(planParam);
  const [studentCount, setStudentCount] = useState(1);
  const [useReferral, setUseReferral] = useState(false);

  const planType = BILLING_CYCLE_TO_PLAN_TYPE[billingCycle];

  const plansForCycle = useMemo(() => {
    if (!plans?.data) return [];
    const matched = plans?.data?.filter(
      (plan: PlanResponseDto) => plan.planType === planType && studentCount >= plan.minStudentCount && studentCount <= plan.maxStudentCount,
    );
    if (matched?.length > 0) return matched;
    return plans?.data?.filter((plan: PlanResponseDto) => plan.planType === planType);
  }, [plans, planType, studentCount]);

  const distinctNamedPlans = useMemo(() => {
    const byName = new Map<string, PlanResponseDto>();
    for (const plan of plansForCycle) {
      const existing = byName.get(plan.name);
      if (!existing || plan.pricePerStudent < existing.pricePerStudent) {
        byName.set(plan.name, plan);
      }
    }
    return Array.from(byName.values());
  }, [plansForCycle]);

  useEffect(() => {
    if (selectedPlanName && distinctNamedPlans.some(p => p.name === selectedPlanName)) return;
    if (distinctNamedPlans.length === 0) return;
    const preferred = isUpgrade
      ? (distinctNamedPlans.find(p => p.name.toLowerCase().includes("advanced")) ?? distinctNamedPlans[0])
      : (distinctNamedPlans.find(p => p.name.toLowerCase().includes("standard")) ?? distinctNamedPlans[0]);
    setSelectedPlanName(preferred.name);
  }, [distinctNamedPlans, isUpgrade, selectedPlanName]);

  const selectedPlan = useMemo(
    () => distinctNamedPlans.find(p => p.name === selectedPlanName) ?? distinctNamedPlans[0],
    [distinctNamedPlans, selectedPlanName],
  );

  const subtotal = useMemo(() => (selectedPlan ? selectedPlan.pricePerStudent * studentCount : 0), [selectedPlan, studentCount]);

  const handlePay = () => {
    if (!selectedPlan) {
      toast({
        title: "Please select a plan",
        type: "error",
      });
      return;
    }
    checkout(
      {
        planId: selectedPlan.id,
        studentCapacity: studentCount,
        // useReferralCredit: useReferral,
        // callbackUrl: `${window.location.origin}/staff/settings/subscription/verify`,
      },
      {
        onSuccess: ({ authorizationUrl }) => {
          window.location.href = authorizationUrl;
        },
        onError: (error: unknown) => {
          const message = error && typeof error === "object" && "message" in error ? String((error as { message: unknown }).message) : null;
          toast({
            title: "Failed to initiate payment",
            description: message || "Could not complete payment",
            type: "error",
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-text-default text-lg font-semibold sm:text-2xl">{isUpgrade ? "Upgrade Your Plan" : "Choose Your Subscription Plan"}</h2>
        <p className="text-text-subtle max-w-sm text-sm">Select a plan and specify the number of students across all your branches</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {isUpgrade && currentSubscription && (
            <div className="bg-bg-default border-border-default flex flex-col gap-1 rounded-xl border p-4 sm:p-5">
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row">
                <div className="flex flex-col gap-1">
                  <p className="text-text-muted text-xs">Your Current Plan</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-text-default text-sm font-medium">{currentSubscription.planName} Plan</span>
                    <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default h-5 rounded-md px-1.5 text-xs font-medium">
                      {currentSubscription.status}
                    </Badge>
                    <span className="text-text-muted text-xs">• {currentSubscription.studentCapacity} students</span>
                  </div>
                </div>
                {currentSubscription.endDate && (
                  <Badge className="bg-bg-badge-rose text-bg-basic-rose-strong border-border-default h-5 shrink-0 rounded-md px-1.5 text-xs font-medium">
                    Expires {formatDate(currentSubscription.endDate)}
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="bg-bg-default border-border-default flex flex-col gap-6 rounded-xl border p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-text-default text-base font-semibold">Billing Period</h3>
                <p className="text-text-subtle text-xs">Choose your preferred billing cycle</p>
              </div>
              <BillingCycleTabs value={billingCycle} onChange={setBillingCycle} />
            </div>

            <div className="border-border-default border-t" />

            <div className="flex flex-col gap-1">
              <h3 className="text-text-default text-base font-semibold">Select Your Plan</h3>
              <p className="text-text-subtle text-xs">All branches will use the same plan</p>
            </div>

            <div className="flex flex-col gap-4">
              {isLoadingPlans ? (
                <>
                  <div className="bg-bg-state-soft h-20 animate-pulse rounded-xl" />
                  <div className="bg-bg-state-soft h-20 animate-pulse rounded-xl" />
                </>
              ) : distinctNamedPlans.length === 0 ? (
                <p className="text-text-muted text-sm">No plans available right now.</p>
              ) : (
                distinctNamedPlans.map(plan => (
                  <PlanRadio
                    key={plan.id}
                    name={plan.name}
                    price={plan.pricePerStudent}
                    selected={selectedPlanName === plan.name}
                    onSelect={() => setSelectedPlanName(plan.name)}
                    featureSummary={plan.features?.length ? `${plan.features.length}+ modules` : undefined}
                  >
                    <StudentCountConfigurator value={studentCount} onChange={setStudentCount} activeStudents={totalActiveStudents} />
                  </PlanRadio>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <OrderSummary
            planName={selectedPlan?.name ?? "—"}
            studentCount={studentCount}
            billingCycle={billingCycle}
            subtotal={subtotal}
            useReferral={useReferral}
            onToggleReferral={setUseReferral}
            referralBalance={REFERRAL_BALANCE}
            onPay={handlePay}
            isPending={isPending}
            disabled={!selectedPlan}
          />
        </div>
      </div>
    </div>
  );
};

interface PlanRadioProps {
  name: string;
  price: number;
  selected: boolean;
  onSelect: () => void;
  featureSummary?: string;
  children?: React.ReactNode;
}

const PlanRadio = ({ name, price, selected, onSelect, featureSummary, children }: PlanRadioProps) => {
  console.log(name);
  return (
    <div
      onClick={onSelect}
      className={cn(
        "flex cursor-pointer flex-col gap-4 rounded-xl border p-4 transition-colors",
        selected ? "border-border-informative ring-1 ring-[var(--color-border-informative)]" : "border-border-default bg-bg-default",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-4 shrink-0 items-center justify-center rounded-full border-2",
              selected ? "border-border-informative" : "border-border-strong",
            )}
          >
            {selected && <span className="bg-bg-state-primary size-2 rounded-full" />}
          </span>
          <span className="text-text-default text-sm font-medium">{name} Plan</span>
        </div>
        <span className="text-text-default text-sm font-medium">
          ₦{price.toLocaleString()} <span className="text-text-muted text-xs font-normal">per student</span>
        </span>
      </div>
      {featureSummary && <p className="text-text-subtle text-xs">{featureSummary}</p>}
      {name !== "FREEMIUM" && selected && children}
    </div>
  );
};

interface StudentCountConfiguratorProps {
  value: number;
  onChange: (v: number) => void;
  activeStudents: number;
}

export const StudentCountConfigurator = ({ value, onChange, activeStudents }: StudentCountConfiguratorProps) => {
  const tier = tierForCount(value);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="bg-bg-subtle text-text-subtle border-border-default h-6 rounded-md px-2 text-xs font-medium">
          <User3 fill="var(--color-icon-default-muted)" className="h-3 w-3" />
          {activeStudents.toLocaleString()} students
        </Badge>
        <Badge className="bg-bg-subtle text-text-subtle border-border-default h-6 rounded-md px-2 text-xs font-medium">
          <BuildingFill fill="var(--color-icon-default-muted)" className="h-3 w-3" />
          Active
        </Badge>
      </div>

      <label className="text-text-default text-xs font-medium">Number of Students</label>
      <div className="flex flex-wrap items-center gap-3">
        <div className="bg-bg-subtle border-border-default flex h-10 w-full items-center overflow-hidden rounded-md border sm:max-w-72">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onChange(Math.max(1, value - 1));
            }}
            className="hover:bg-bg-state-soft border-border-default flex h-full items-center justify-center border-r px-4"
          >
            <Subtract fill="var(--color-icon-default)" className="h-3 w-3" />
          </button>
          <input
            type="number"
            value={value}
            onClick={e => e.stopPropagation()}
            onChange={e => onChange(Math.max(1, parseInt(e.target.value) || 1))}
            className="text-text-default flex-1 bg-transparent text-center text-sm font-medium outline-none"
          />
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onChange(value + 1);
            }}
            className="hover:bg-bg-state-soft border-border-default flex h-full items-center justify-center border-l px-4"
          >
            <AddFill fill="var(--color-icon-default)" className="h-3 w-3" />
          </button>
        </div>
        <Button
          type="button"
          onClick={e => {
            e.stopPropagation();
            if (activeStudents > 0) onChange(activeStudents);
          }}
          variant="ghost"
          className="bg-bg-state-soft hover:bg-bg-state-soft-hover! text-text-subtle h-10 w-full rounded-md px-2.5! px-3 text-xs font-medium sm:w-auto"
        >
          Auto-Fill Active Students
        </Button>
      </div>
      <Badge className="bg-bg-badge-lime text-bg-basic-lime-strong border-border-default h-5 w-fit rounded-md px-1.5 text-xs font-medium">
        {tier} Students Tier
      </Badge>

      <div className="bg-bg-badge-blue flex gap-2 rounded-md p-3">
        <Information fill="var(--color-icon-informative)" className="h-4 w-4 shrink-0" />
        <p className="text-text-subtle text-xs leading-relaxed">You&apos;re paying for the exact number of active students</p>
      </div>
    </div>
  );
};
