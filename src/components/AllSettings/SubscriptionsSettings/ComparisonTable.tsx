"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "@/components/Icons/Check";
import { CloseFill } from "@/components/Icons/CloseFill";
import { cn } from "@/lib/utils";
import { PlanName, planFeaturesData, PRICE_PER_STUDENT } from "./type";

interface ComparisonTableProps {
  onSubscribe?: () => void;
}

const featureCell = (included: boolean) =>
  included ? (
    <div className="text-text-default flex items-center gap-1.5 text-sm">
      <Check fill="var(--color-icon-default)" className="h-3 w-3" />
      <span>Included</span>
    </div>
  ) : (
    <CloseFill fill="var(--color-icon-default-muted)" className="size-3" />
  );

const MOBILE_TABS: PlanName[] = ["Standard", "Advanced"];

const MobileComparison = ({ onSubscribe }: ComparisonTableProps) => {
  const [activeTab, setActiveTab] = useState<PlanName>("Standard");
  const isStandard = activeTab === "Standard";

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
          <span className="text-text-default text-base font-medium">₦{PRICE_PER_STUDENT[activeTab].toLocaleString()}</span>
          <span className="text-text-muted text-xs">per student</span>
        </div>
        {isStandard ? (
          <Button
            onClick={onSubscribe}
            className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8 w-full rounded-md text-sm font-medium"
          >
            Subscribe
          </Button>
        ) : (
          <Button disabled className="bg-bg-state-disabled text-text-hint h-8 w-full rounded-md text-sm font-medium">
            Coming soon
          </Button>
        )}
      </div>

      <div className="border-border-default flex items-center justify-between border-t px-4 py-3">
        <p className="text-text-default text-sm font-medium">Number of users</p>
        <Badge className="bg-bg-badge-default text-text-subtle border-border-default h-5 rounded-md px-1.5 text-xs font-medium">Unlimited</Badge>
      </div>

      {planFeaturesData.map(row => {
        const included = isStandard ? row.standard : row.advanced;
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

export const ComparisonTable = ({ onSubscribe }: ComparisonTableProps) => {
  return (
    <>
      <div className="w-full md:hidden">
        <MobileComparison onSubscribe={onSubscribe} />
      </div>

      <div className="border-border-default hidden w-full overflow-x-auto rounded-lg border md:block">
        <div className="min-w-160">
          <div className="grid grid-cols-[1fr_1fr_1fr]">
            <div className="p-4" />
            <div className="border-border-default flex flex-col gap-4 border-l p-4">
              <div className="flex flex-col gap-1">
                <p className="text-text-default text-sm font-medium">Standard</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-text-default text-base font-medium">₦{PRICE_PER_STUDENT.Standard.toLocaleString()}</span>
                  <span className="text-text-muted text-xs">per student</span>
                </div>
              </div>
              <Button
                onClick={onSubscribe}
                className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7 w-full rounded-md text-xs font-medium"
              >
                Subscribe
              </Button>
            </div>
            <div className="border-border-default flex flex-col gap-4 border-l p-4">
              <div className="flex flex-col gap-1">
                <p className="text-text-default text-sm font-medium">Advanced</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-text-default text-base font-medium">₦{PRICE_PER_STUDENT.Advanced.toLocaleString()}</span>
                  <span className="text-text-muted text-xs">per student</span>
                </div>
              </div>
              <Button disabled className="bg-bg-state-disabled text-text-hint h-7 w-full rounded-md text-xs font-medium">
                Coming soon
              </Button>
            </div>
          </div>

          <div className="border-border-default grid grid-cols-[1fr_1fr_1fr] border-t">
            <div className="p-4">
              <p className="text-text-default text-sm font-medium">Number of users</p>
            </div>
            <div className="border-border-default flex items-center border-l p-4">
              <Badge className="bg-bg-badge-default text-text-subtle border-border-default h-5 rounded-md px-1.5 text-xs font-medium">
                Unlimited
              </Badge>
            </div>
            <div className="border-border-default flex items-center border-l p-4">
              <Badge className="bg-bg-badge-default text-text-subtle border-border-default h-5 rounded-md px-1.5 text-xs font-medium">
                Unlimited
              </Badge>
            </div>
          </div>

          {planFeaturesData.map(row => (
            <div key={row.feature} className="border-border-default grid grid-cols-[1fr_1fr_1fr] border-t">
              <div className="p-4">
                <p className="text-text-default text-sm">{row.feature}</p>
              </div>
              <div className="border-border-default flex items-center border-l p-4">{featureCell(row.standard)}</div>
              <div className="border-border-default flex items-center border-l p-4">{featureCell(row.advanced)}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
