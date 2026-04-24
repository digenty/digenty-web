"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddFill } from "@/components/Icons/AddFill";
import { Subtract } from "@/components/Icons/Subtract";
import { User3 } from "@/components/Icons/User3";
import { BuildingFill } from "@/components/Icons/BuildingFill";
import Information from "@/components/Icons/Information";
import { OrderSummary } from "./OrderSummary";
import { STUDENT_TIER_RANGES, SubscriptionView } from "./type";
import { useCreateSubscription, useGetCurrentSubscription, useGetPlans } from "@/hooks/queryHooks/useSubscription";

interface AddStudentsFormProps {
  onViewChange: (view: SubscriptionView) => void;
}

const REFERRAL_BALANCE = 0;

const tierForCount = (count: number) => {
  for (const [tier, range] of Object.entries(STUDENT_TIER_RANGES)) {
    if (count >= range.min && count <= range.max) return tier;
  }
  return "1-200";
};

export const AddStudentsForm = ({ onViewChange }: AddStudentsFormProps) => {
  const { data: subscription, isLoading: isLoadingSubscription } = useGetCurrentSubscription();
  const { data: plans } = useGetPlans();
  const { mutate: createSubscription, isPending } = useCreateSubscription();

  const currentPlan = useMemo(() => plans?.find(p => p.name === subscription?.planName), [plans, subscription?.planName]);

  const initialCount = (subscription?.studentCapacity ?? 0) + 1;
  const [studentCount, setStudentCount] = useState(initialCount);
  const [useReferral, setUseReferral] = useState(false);

  useEffect(() => {
    if (subscription?.studentCapacity) {
      setStudentCount(prev => (prev <= 1 ? subscription.studentCapacity + 1 : prev));
    }
  }, [subscription?.studentCapacity]);

  const pricePerStudent = currentPlan?.pricePerStudent ?? 0;
  const additionalStudents = Math.max(0, studentCount - (subscription?.studentCapacity ?? 0));
  const subtotal = pricePerStudent * additionalStudents;

  const handlePay = () => {
    if (!currentPlan || !subscription) {
      toast.error("Unable to find your current plan");
      return;
    }
    if (additionalStudents <= 0) {
      toast.error("Please increase the student count beyond your current capacity");
      return;
    }
    createSubscription(
      { planId: currentPlan.id, studentCapacity: studentCount },
      {
        onSuccess: () => {
          toast.success("Students added to your plan");
          onViewChange("dashboard");
        },
        onError: (error: unknown) => {
          const message = error && typeof error === "object" && "message" in error ? String((error as { message: unknown }).message) : null;
          toast.error(message || "Failed to add students");
        },
      },
    );
  };

  const planName = subscription?.planName ?? "—";
  const tier = tierForCount(studentCount);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-text-default text-xl font-semibold sm:text-2xl">Add Students to your Plan</h2>
        <p className="text-text-subtle text-sm">Specify the number of students across all your branches</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-bg-default border-border-default flex flex-col gap-6 rounded-xl border p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-text-default text-sm font-medium">{planName} Plan</h3>
              <span className="text-text-default text-sm font-medium">
                ₦{pricePerStudent.toLocaleString()} <span className="text-text-muted text-xs font-normal">per student</span>
              </span>
            </div>
            {currentPlan?.features?.length ? <p className="text-text-subtle text-xs">{currentPlan.features.length}+ modules</p> : null}

            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-bg-subtle text-text-subtle border-border-default h-6 rounded-md px-2 text-xs font-medium">
                <User3 fill="var(--color-icon-default-muted)" className="h-3 w-3" />
                {(subscription?.activeStudentCount ?? 0).toLocaleString()} students
              </Badge>
              <Badge className="bg-bg-subtle text-text-subtle border-border-default h-6 rounded-md px-2 text-xs font-medium">
                <BuildingFill fill="var(--color-icon-default-muted)" className="h-3 w-3" />
                Capacity {(subscription?.studentCapacity ?? 0).toLocaleString()}
              </Badge>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-text-default text-xs font-medium">Number of Students</label>
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-bg-subtle border-border-default flex h-10 w-full items-center overflow-hidden rounded-md border sm:max-w-72">
                  <button
                    type="button"
                    onClick={() => setStudentCount(Math.max(1, studentCount - 1))}
                    className="hover:bg-bg-state-soft border-border-default flex h-full items-center justify-center border-r px-4"
                  >
                    <Subtract fill="var(--color-icon-default)" className="h-3 w-3" />
                  </button>
                  <input
                    type="number"
                    value={studentCount}
                    onChange={e => setStudentCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="text-text-default flex-1 bg-transparent text-center text-sm font-medium outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setStudentCount(studentCount + 1)}
                    className="hover:bg-bg-state-soft border-border-default flex h-full items-center justify-center border-l px-4"
                  >
                    <AddFill fill="var(--color-icon-default)" className="h-3 w-3" />
                  </button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    if (subscription?.activeStudentCount) setStudentCount(subscription.activeStudentCount);
                  }}
                  className="bg-bg-state-soft hover:bg-bg-state-soft-hover! text-text-subtle h-10 w-full rounded-md px-3 text-xs font-medium sm:w-auto"
                >
                  Auto-Fill Active Students
                </Button>
              </div>
              <p className="text-text-muted text-xs">Specify how many students you want to pay for</p>
              <Badge className="bg-bg-badge-lime text-bg-basic-lime-strong border-border-default h-5 w-fit rounded-md px-1.5 text-xs font-medium">
                {tier} Students Tier
              </Badge>
            </div>

            <div className="bg-bg-badge-blue flex gap-2 rounded-md p-3">
              <Information fill="var(--color-icon-informative)" className="h-4 w-4 shrink-0" />
              <p className="text-text-subtle text-xs leading-relaxed">You&apos;re paying for the exact number of active students</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <OrderSummary
            planName={planName}
            studentCount={studentCount}
            billingCycle="Termly"
            subtotal={subtotal}
            useReferral={useReferral}
            onToggleReferral={setUseReferral}
            referralBalance={REFERRAL_BALANCE}
            onPay={handlePay}
            isPending={isPending}
            disabled={isLoadingSubscription || !currentPlan || additionalStudents <= 0}
          />
        </div>
      </div>
    </div>
  );
};
