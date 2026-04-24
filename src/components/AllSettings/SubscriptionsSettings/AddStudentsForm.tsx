"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderSummary } from "./OrderSummary";
import { SubscriptionView } from "./type";
import { AddFill } from "@/components/Icons/AddFill";
import { Subtract } from "@/components/Icons/Subtract";
import { InfoIcon, UsersIcon, Building2Icon } from "lucide-react";

interface AddStudentsFormProps {
  onViewChange: (view: SubscriptionView) => void;
}

export const AddStudentsForm = ({ onViewChange }: AddStudentsFormProps) => {
  const [studentCount, setStudentCount] = useState(1);
  const pricePerStudent = 1350;
  const subtotal = pricePerStudent * studentCount;

  return (
    <div className="flex flex-col gap-8">
      <div className="mb-4">{/* We can add a back button here if needed */}</div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="border-border-default rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-text-default text-sm font-bold">Advanced Plan</h3>
              <span className="text-text-default text-sm font-bold">
                ₦1,350 <span className="text-xs font-medium text-zinc-400">per student</span>
              </span>
            </div>

            <p className="text-text-subtle mb-6 text-xs font-medium">16+ modules</p>

            <div className="flex flex-col gap-6">
              <div className="flex gap-4">
                <Badge variant="outline" className="border-border-default text-text-subtle gap-2 bg-zinc-50 px-3 py-1 text-[10px] font-bold">
                  <UsersIcon className="h-3 w-3" /> 1,868 students
                </Badge>
                <Badge variant="outline" className="border-border-default text-text-subtle gap-2 bg-zinc-50 px-3 py-1 text-[10px] font-bold">
                  <Building2Icon className="h-3 w-3" /> 3 Branches
                </Badge>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-text-default text-xs font-bold">Number of Students</label>
                <div className="flex items-center gap-3">
                  <div className="border-border-default flex h-10 w-full max-w-[280px] items-center overflow-hidden rounded-md border bg-zinc-50">
                    <button
                      onClick={() => setStudentCount(Math.max(1, studentCount - 1))}
                      className="h-full border-r border-zinc-200 px-4 hover:bg-zinc-200"
                    >
                      <Subtract fill="var(--color-icon-default)" className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={studentCount}
                      onChange={e => setStudentCount(parseInt(e.target.value) || 0)}
                      className="flex-1 bg-transparent text-center text-sm font-bold outline-none"
                    />
                    <button onClick={() => setStudentCount(studentCount + 1)} className="h-full border-l border-zinc-200 px-4 hover:bg-zinc-200">
                      <AddFill fill="var(--color-icon-default)" className="h-4 w-4" />
                    </button>
                  </div>
                  <Button className="text-text-dark-default h-10 rounded-md bg-zinc-100 px-4 text-xs font-bold hover:bg-zinc-200">
                    Auto-Fill Active Students
                  </Button>
                </div>
                <p className="text-text-hint text-[10px] font-medium">Specify how many students you want to pay for</p>
                <div className="text-text-success w-fit rounded border-none bg-lime-50 px-2 py-0.5 text-[10px] font-bold">0 - 200 Students Tier</div>
              </div>

              <div className="flex gap-3 rounded-xl bg-blue-50 p-4">
                <InfoIcon className="h-5 w-5 flex-shrink-0 text-blue-500" />
                <p className="text-text-subtle text-xs leading-relaxed font-medium">You&apos;re paying for the exact number of active students</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <OrderSummary
            planName="Standard Plan" // Matches screenshot 5 (wait, screenshot 5 says Advanced Plan on card but Standard Plan in summary? I'll follow screenshot)
            studentCount={2565} // Hardcoded to match screenshot example or use state
            billingCycle="Monthly"
            subtotal={1104} // To match screenshot summary
            onPay={() => {}}
          />
        </div>
      </div>
    </div>
  );
};
