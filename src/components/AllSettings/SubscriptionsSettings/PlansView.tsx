"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckDouble } from "@/components/Icons/CheckDouble";
import BankCard from "@/components/Icons/BankCard";
import { cn } from "@/lib/utils";
import { ComparisonTable } from "./ComparisonTable";
import { BILLING_CYCLE_TO_PLAN_TYPE, BillingCycle, STUDENT_TIER_RANGES, StudentTier } from "./type";
import { useGetCurrentSubscription, useGetPlans } from "@/hooks/queryHooks/useSubscription";
import { PlanResponseDto } from "@/api/subscription";

interface PlansViewProps {
  showNoSubscriptionBanner?: boolean;
}

const TIERS: StudentTier[] = ["1-200", "201-400", "401+"];
const CYCLES: BillingCycle[] = ["Termly", "Yearly"];

const tierMatchesPlan = (tier: StudentTier, plan: PlanResponseDto) => {
  const range = STUDENT_TIER_RANGES[tier];
  return plan.maxStudentCount >= range.min && plan.minStudentCount <= range.max;
};

const buildSubscribeHref = (planName: string, cycle: BillingCycle) =>
  `/staff/settings/subscription/subscribe?plan=${encodeURIComponent(planName)}&cycle=${encodeURIComponent(cycle)}`;

const NoSubscriptionBanner = () => (
  <div className="bg-bg-badge-blue flex items-start gap-3 rounded-lg p-4">
    <BankCard fill="var(--color-icon-informative)" className="mt-0.5 h-5 w-5 shrink-0" />
    <div className="flex flex-col gap-1">
      <p className="text-text-default text-sm font-semibold">You do not have an active subscription plan</p>
      <p className="text-text-subtle text-xs">To continue, select a subscription plan and get the full benefit of digenty</p>
    </div>
  </div>
);

const StudentTierTabs = ({ value, onChange }: { value: StudentTier; onChange: (v: StudentTier) => void }) => (
  <div className="bg-bg-state-soft flex w-full max-w-full items-center gap-1 overflow-x-auto rounded-full p-0.5 sm:w-auto">
    {TIERS.map(tier => (
      <button
        key={tier}
        type="button"
        onClick={() => onChange(tier)}
        className={cn(
          "h-8 flex-1 shrink-0 rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors sm:flex-none sm:px-8",
          value === tier ? "bg-bg-state-secondary border-border-darker text-text-default border shadow-sm" : "text-text-muted",
        )}
      >
        {tier}
      </button>
    ))}
  </div>
);

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

const PlanCardSkeleton = () => (
  <div className="bg-bg-default border-border-default flex flex-col gap-4 rounded-xl border p-4 sm:p-6">
    <div className="bg-bg-state-soft h-4 w-20 animate-pulse rounded" />
    <div className="bg-bg-state-soft h-5 w-24 animate-pulse rounded" />
    <div className="bg-bg-state-soft h-8 w-full animate-pulse rounded-md" />
    <div className="bg-bg-state-soft h-3 w-3/4 animate-pulse rounded" />
    <div className="bg-bg-state-soft h-3 w-2/3 animate-pulse rounded" />
  </div>
);

export const PlansView = ({ showNoSubscriptionBanner }: PlansViewProps) => {
  const router = useRouter();
  const [studentTier, setStudentTier] = useState<StudentTier>("1-200");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("Termly");

  const { data: plans, isLoading } = useGetPlans();
  const { data: currentSubscription } = useGetCurrentSubscription();

  const filteredPlans = useMemo(() => {
    if (!plans) return [];
    const planType = BILLING_CYCLE_TO_PLAN_TYPE[billingCycle];
    const matched = plans?.data?.filter((plan: PlanResponseDto) => plan.planType === planType && tierMatchesPlan(studentTier, plan));

    const byName = new Map<string, PlanResponseDto>();
    for (const plan of matched) {
      const existing = byName.get(plan.name);
      if (!existing || plan.pricePerStudent < existing.pricePerStudent) {
        byName.set(plan.name, plan);
      }
    }
    return Array.from(byName.values());
  }, [plans, billingCycle, studentTier]);

  const standardPrice = filteredPlans.find(p => p.name.toLowerCase().includes("standard"))?.pricePerStudent;
  const advancedPrice = filteredPlans.find(p => p.name.toLowerCase().includes("advanced"))?.pricePerStudent;

  const goToSubscribe = (planName: string) => router.push(buildSubscribeHref(planName, billingCycle));

  return (
    <div className="flex flex-col gap-4 md:gap-12">
      {showNoSubscriptionBanner && <NoSubscriptionBanner />}

      <div className="flex items-center justify-between">
        <h2 className="text-text-default text-lg font-semibold sm:text-xl">Subscription</h2>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="flex w-full flex-col items-center gap-3">
          <p className="text-text-default text-sm font-medium">Select Student Count</p>
          <StudentTierTabs value={studentTier} onChange={setStudentTier} />
        </div>

        <BillingCycleTabs value={billingCycle} onChange={setBillingCycle} />

        <div className="mt-4 grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {isLoading ? (
            <>
              <PlanCardSkeleton />
              <PlanCardSkeleton />
            </>
          ) : filteredPlans.length === 0 ? (
            <p className="text-text-muted col-span-full text-center text-sm">No plans available for this selection.</p>
          ) : (
            filteredPlans.map(plan => {
              const isCurrent = currentSubscription?.planName === plan.name;
              return (
                <div key={plan.id} className="bg-bg-default border-border-default flex flex-col gap-4 rounded-xl border p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-text-default text-sm font-medium">{plan.name}</h3>
                    {isCurrent && (
                      <Badge className="bg-bg-badge-blue text-bg-basic-blue-strong border-border-default h-5 rounded-md px-1.5 text-xs font-medium">
                        Current Plan
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-text-default text-lg font-medium">₦{plan.pricePerStudent.toLocaleString()}</span>
                    <span className="text-text-muted text-xs">per student</span>
                  </div>
                  <Button
                    onClick={() => goToSubscribe(plan.name)}
                    className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8 w-full rounded-md text-sm font-medium"
                  >
                    Subscribe
                  </Button>
                  <ul className="mt-2 flex flex-col gap-3">
                    {plan.features?.map(feature => (
                      <li key={feature} className="text-text-subtle flex items-center gap-2 text-xs">
                        <CheckDouble fill="var(--color-icon-default)" className="h-3.5 w-3.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button type="button" className="text-text-default text-left text-xs font-medium underline-offset-2 hover:underline">
                    See all available features
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="flex w-full flex-col items-center gap-3">
          <p className="text-text-default text-sm font-medium">Select Student Count</p>
          <StudentTierTabs value={studentTier} onChange={setStudentTier} />
        </div>
        <div className="self-start">
          <BillingCycleTabs value={billingCycle} onChange={setBillingCycle} />
        </div>
        <ComparisonTable standardPrice={standardPrice} advancedPrice={advancedPrice} onSubscribe={() => goToSubscribe("Standard")} />
      </div>
    </div>
  );
};
