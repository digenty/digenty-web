"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckDouble } from "@/components/Icons/CheckDouble";
import { cn } from "@/lib/utils";
import { ComparisonTable } from "./ComparisonTable";
import { ADVANCED_FEATURES, BillingCycle, PRICE_PER_STUDENT, STANDARD_FEATURES, StudentTier, SubscriptionView } from "./type";

interface PlansViewProps {
  onViewChange: (view: SubscriptionView) => void;
}

const TIERS: StudentTier[] = ["1-200", "201-400", "401+"];
const CYCLES: BillingCycle[] = ["Termly", "Yearly"];

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

export const PlansView = ({ onViewChange }: PlansViewProps) => {
  const [studentTier, setStudentTier] = useState<StudentTier>("1-200");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("Termly");

  return (
    <div className="flex flex-col gap-8 md:gap-12">
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
          <div className="bg-bg-default border-border-default flex flex-col gap-4 rounded-xl border p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-text-default text-sm font-medium">Standard</h3>
              <Badge className="bg-bg-badge-blue text-bg-basic-blue-strong border-border-default h-5 rounded-md px-1.5 text-xs font-medium">
                Current Plan
              </Badge>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-text-default text-lg font-medium">₦{PRICE_PER_STUDENT.Standard.toLocaleString()}</span>
              <span className="text-text-muted text-xs">per student</span>
            </div>
            <Button
              onClick={() => onViewChange("subscribe")}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8 w-full rounded-md text-sm font-medium"
            >
              Subscribe
            </Button>
            <ul className="mt-2 flex flex-col gap-3">
              {STANDARD_FEATURES.map(feature => (
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

          <div className="bg-bg-default border-border-default flex flex-col gap-4 rounded-xl border p-4 sm:p-6">
            <h3 className="text-text-default text-sm font-medium">Advanced</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-text-default text-lg font-medium">₦{PRICE_PER_STUDENT.Advanced.toLocaleString()}</span>
              <span className="text-text-muted text-xs">per student</span>
            </div>
            <Button disabled className="bg-bg-state-disabled text-text-hint h-8 w-full rounded-md text-sm font-medium">
              Coming soon
            </Button>
            <ul className="mt-2 flex flex-col gap-3">
              {ADVANCED_FEATURES.map(feature => (
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
        <ComparisonTable onSubscribe={() => onViewChange("subscribe")} />
      </div>
    </div>
  );
};
