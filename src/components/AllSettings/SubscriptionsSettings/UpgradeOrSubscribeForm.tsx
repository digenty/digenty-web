"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Information from "@/components/Icons/Information";
import { AddFill } from "@/components/Icons/AddFill";
import { Subtract } from "@/components/Icons/Subtract";
import { User3 } from "@/components/Icons/User3";
import { BuildingFill } from "@/components/Icons/BuildingFill";
import { OrderSummary } from "./OrderSummary";
import { BillingCycle, PRICE_PER_STUDENT, PlanName, SubscriptionView } from "./type";

interface UpgradeOrSubscribeFormProps {
  isUpgrade?: boolean;
  onViewChange: (view: SubscriptionView) => void;
}

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

const ACTIVE_STUDENTS = 1868;
const BRANCH_COUNT = 3;
const REFERRAL_BALANCE = 1104;

export const UpgradeOrSubscribeForm = ({ isUpgrade, onViewChange }: UpgradeOrSubscribeFormProps) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanName>(isUpgrade ? "Advanced" : "Standard");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("Termly");
  const [studentCount, setStudentCount] = useState(1);
  const [useReferral, setUseReferral] = useState(false);

  const subtotal = useMemo(() => PRICE_PER_STUDENT[selectedPlan] * studentCount, [selectedPlan, studentCount]);

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-text-default text-lg font-semibold sm:text-2xl">{isUpgrade ? "Upgrade Your Plan" : "Choose Your Subscription Plan"}</h2>
        <p className="text-text-subtle max-w-sm text-sm">Select a plan and specify the number of students across all your branches</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {isUpgrade && (
            <div className="bg-bg-default border-border-default flex flex-col gap-1 rounded-xl border p-4 sm:p-5">
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row">
                <div className="flex flex-col gap-1">
                  <p className="text-text-muted text-xs">Your Current Plan</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-text-default text-sm font-medium">Standard Plan</span>
                    <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default h-5 rounded-md px-1.5 text-xs font-medium">
                      Active
                    </Badge>
                    <span className="text-text-muted text-xs">• 200 students • ₦1,500/student/mo</span>
                  </div>
                </div>
                <Badge className="bg-bg-badge-rose text-bg-basic-rose-strong border-border-default h-5 shrink-0 rounded-md px-1.5 text-xs font-medium">
                  Expires March 24
                </Badge>
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
              <PlanRadio
                name="Standard"
                price={PRICE_PER_STUDENT.Standard}
                selected={selectedPlan === "Standard"}
                onSelect={() => setSelectedPlan("Standard")}
              />

              <PlanRadio
                name="Advanced"
                price={PRICE_PER_STUDENT.Advanced}
                selected={selectedPlan === "Advanced"}
                onSelect={() => setSelectedPlan("Advanced")}
              >
                <StudentCountConfigurator value={studentCount} onChange={setStudentCount} />
              </PlanRadio>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <OrderSummary
            planName={selectedPlan}
            studentCount={studentCount}
            billingCycle={billingCycle}
            subtotal={subtotal}
            useReferral={useReferral}
            onToggleReferral={setUseReferral}
            referralBalance={REFERRAL_BALANCE}
            onPay={() => onViewChange("dashboard")}
          />
        </div>
      </div>
    </div>
  );
};

interface PlanRadioProps {
  name: PlanName;
  price: number;
  selected: boolean;
  onSelect: () => void;
  children?: React.ReactNode;
}

const PlanRadio = ({ name, price, selected, onSelect, children }: PlanRadioProps) => (
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
    <p className="text-text-subtle text-xs">16+ modules</p>
    {selected && children}
  </div>
);

interface StudentCountConfiguratorProps {
  value: number;
  onChange: (v: number) => void;
}

export const StudentCountConfigurator = ({ value, onChange }: StudentCountConfiguratorProps) => (
  <div className="flex flex-col gap-3">
    <div className="flex flex-wrap items-center gap-2">
      <Badge className="bg-bg-subtle text-text-subtle border-border-default h-6 rounded-md px-2 text-xs font-medium">
        <User3 fill="var(--color-icon-default-muted)" className="h-3 w-3" />
        {ACTIVE_STUDENTS.toLocaleString()} students
      </Badge>
      <Badge className="bg-bg-subtle text-text-subtle border-border-default h-6 rounded-md px-2 text-xs font-medium">
        <BuildingFill fill="var(--color-icon-default-muted)" className="h-3 w-3" />
        {BRANCH_COUNT} Branches
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
        onClick={e => e.stopPropagation()}
        variant="ghost"
        className="bg-bg-state-soft hover:bg-bg-state-soft-hover! text-text-subtle h-10 w-full rounded-md px-3 text-xs font-medium sm:w-auto"
      >
        Auto-Fill Active Students
      </Button>
    </div>
    <Badge className="bg-bg-badge-lime text-bg-basic-lime-strong border-border-default h-5 w-fit rounded-md px-1.5 text-xs font-medium">
      0 - 200 Students Tier
    </Badge>

    <div className="bg-bg-badge-blue flex gap-2 rounded-md p-3">
      <Information fill="var(--color-icon-informative)" className="h-4 w-4 shrink-0" />
      <p className="text-text-subtle text-xs leading-relaxed">You&apos;re paying for the exact number of active students</p>
    </div>
  </div>
);
