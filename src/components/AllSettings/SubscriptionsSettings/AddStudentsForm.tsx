"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddFill } from "@/components/Icons/AddFill";
import { Subtract } from "@/components/Icons/Subtract";
import { User3 } from "@/components/Icons/User3";
import { BuildingFill } from "@/components/Icons/BuildingFill";
import Information from "@/components/Icons/Information";
import { OrderSummary } from "./OrderSummary";
import { PRICE_PER_STUDENT, SubscriptionView } from "./type";

interface AddStudentsFormProps {
  onViewChange: (view: SubscriptionView) => void;
}

const ACTIVE_STUDENTS = 1868;
const BRANCH_COUNT = 3;
const REFERRAL_BALANCE = 1104;
const CURRENT_PLAN = "Advanced" as const;

export const AddStudentsForm = ({ onViewChange }: AddStudentsFormProps) => {
  const [studentCount, setStudentCount] = useState(1);
  const [useReferral, setUseReferral] = useState(false);

  const subtotal = useMemo(() => PRICE_PER_STUDENT[CURRENT_PLAN] * studentCount, [studentCount]);

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
              <h3 className="text-text-default text-sm font-medium">{CURRENT_PLAN} Plan</h3>
              <span className="text-text-default text-sm font-medium">
                ₦{PRICE_PER_STUDENT[CURRENT_PLAN].toLocaleString()} <span className="text-text-muted text-xs font-normal">per student</span>
              </span>
            </div>
            <p className="text-text-subtle text-xs">16+ modules</p>

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
                  className="bg-bg-state-soft hover:bg-bg-state-soft-hover! text-text-subtle h-10 w-full rounded-md px-3 text-xs font-medium sm:w-auto"
                >
                  Auto-Fill Active Students
                </Button>
              </div>
              <p className="text-text-muted text-xs">Specify how many students you want to pay for</p>
              <Badge className="bg-bg-badge-lime text-bg-basic-lime-strong border-border-default h-5 w-fit rounded-md px-1.5 text-xs font-medium">
                0 - 200 Students Tier
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
            planName={CURRENT_PLAN}
            studentCount={studentCount}
            billingCycle="Termly"
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
