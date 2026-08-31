"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, CloseFill } from "@digenty/icons";
import { cn } from "@/lib/utils";
import { FeatureAvailability, planFeaturesData } from "./type";

type PlanName = "Starter" | "Standard" | "Advanced";

interface ComparisonTableProps {
  onSubscribe?: (plan: PlanName) => void;
  starterPrice?: number;
  standardPrice?: number;
  advancedPrice?: number;
}

const formatPrice = (price?: number) => (typeof price === "number" ? `₦${price.toLocaleString()}` : "—");

const featureCell = (value: FeatureAvailability) => {
  if (!value) {
    return <CloseFill fill="var(--color-icon-default-muted)" className="size-3" />;
  }
  return (
    <div className="text-text-default flex items-center gap-1.5 text-sm">
      <Check fill="var(--color-icon-default)" className="h-3 w-3 shrink-0" />
      <span>{typeof value === "string" ? value : "Included"}</span>
    </div>
  );
};

const MOBILE_TABS: PlanName[] = ["Starter", "Standard", "Advanced"];

const FEATURE_KEY_BY_PLAN: Record<PlanName, "starter" | "standard" | "advanced"> = {
  Starter: "starter",
  Standard: "standard",
  Advanced: "advanced",
};

const MobileComparison = ({ onSubscribe, starterPrice, standardPrice, advancedPrice }: ComparisonTableProps) => {
  const [activeTab, setActiveTab] = useState<PlanName>("Starter");
  const isAdvanced = activeTab === "Advanced";
  const prices: Record<PlanName, number | undefined> = { Starter: starterPrice, Standard: standardPrice, Advanced: advancedPrice };
  const activePrice = prices[activeTab];

  return (
    <div className="border-border-default w-full overflow-hidden rounded-lg border">
      <div className="border-border-default flex items-center border-b">
        {MOBILE_TABS.map(plan => (
          <button
            key={plan}
            type="button"
            onClick={() => setActiveTab(plan)}
            className={cn(
              "h-10 flex-1 text-sm font-medium transition-colors",
              activeTab === plan ? "text-text-default border-border-informative border-b-2" : "text-text-muted",
            )}
          >
            {plan}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-baseline gap-1">
          <span className="text-text-default text-base font-medium">{formatPrice(activePrice)}</span>
          <span className="text-text-muted text-xs">per student</span>
        </div>
        {isAdvanced ? (
          <Button disabled className="bg-bg-state-disabled text-text-hint h-8 w-full rounded-md text-sm font-medium">
            Coming soon
          </Button>
        ) : (
          <Button
            onClick={() => onSubscribe?.(activeTab)}
            className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8 w-full rounded-md text-sm font-medium"
          >
            Subscribe
          </Button>
        )}
      </div>

      <div className="border-border-default flex items-center justify-between border-t px-4 py-3">
        <p className="text-text-default text-sm font-medium">Number of users</p>
        <Badge className="bg-bg-badge-default text-text-subtle border-border-default h-5 rounded-md px-1.5 text-xs font-medium">Unlimited</Badge>
      </div>

      {planFeaturesData.map(row => {
        const included = row[FEATURE_KEY_BY_PLAN[activeTab]];
        return (
          <div key={row.feature} className="border-border-default flex items-center justify-between gap-3 border-t px-4 py-3">
            <p className="text-text-default text-sm">{row.feature}</p>
            <div className="shrink-0">{featureCell(included)}</div>
          </div>
        );
      })}
    </div>
  );
};

export const ComparisonTable = ({ onSubscribe, starterPrice, standardPrice, advancedPrice }: ComparisonTableProps) => {
  const prices: Record<PlanName, number | undefined> = { Starter: starterPrice, Standard: standardPrice, Advanced: advancedPrice };

  return (
    <>
      <div className="w-full md:hidden">
        <MobileComparison onSubscribe={onSubscribe} starterPrice={starterPrice} standardPrice={standardPrice} advancedPrice={advancedPrice} />
      </div>

      <div className="border-border-default hidden w-full overflow-x-auto rounded-lg border md:block">
        <div className="min-w-180">
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr]">
            <div className="p-4" />
            {MOBILE_TABS.map(plan => {
              const isAdvanced = plan === "Advanced";
              return (
                <div key={plan} className="border-border-default flex flex-col gap-4 border-l p-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-text-default text-sm font-medium">{plan}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-text-default text-base font-medium">{formatPrice(prices[plan])}</span>
                      <span className="text-text-muted text-xs">per student</span>
                    </div>
                  </div>
                  {isAdvanced ? (
                    <Button disabled className="bg-bg-state-disabled text-text-hint h-7 w-full rounded-md text-xs font-medium">
                      Coming soon
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onSubscribe?.(plan)}
                      className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7 w-full rounded-md text-xs font-medium"
                    >
                      Subscribe
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-border-default grid grid-cols-[1fr_1fr_1fr_1fr] border-t">
            <div className="p-4">
              <p className="text-text-default text-sm font-medium">Number of users</p>
            </div>
            {MOBILE_TABS.map(plan => (
              <div key={plan} className="border-border-default flex items-center border-l p-4">
                <Badge className="bg-bg-badge-default text-text-subtle border-border-default h-5 rounded-md px-1.5 text-xs font-medium">
                  Unlimited
                </Badge>
              </div>
            ))}
          </div>

          {planFeaturesData.map(row => (
            <div key={row.feature} className="border-border-default grid grid-cols-[1fr_1fr_1fr_1fr] border-t">
              <div className="p-4">
                <p className="text-text-default text-sm">{row.feature}</p>
              </div>
              {MOBILE_TABS.map(plan => (
                <div key={plan} className="border-border-default flex items-center border-l p-4">
                  {featureCell(row[FEATURE_KEY_BY_PLAN[plan]])}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
