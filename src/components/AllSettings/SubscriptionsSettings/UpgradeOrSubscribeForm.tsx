"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { OrderSummary } from "./OrderSummary";
import { SubscriptionView } from "./type";
import { AddFill } from "@/components/Icons/AddFill";
import { Subtract } from "@/components/Icons/Subtract";
import Information from "@/components/Icons/Information";
import { InfoIcon, UsersIcon, Building2Icon } from "lucide-react";

interface UpgradeOrSubscribeFormProps {
  isUpgrade?: boolean;
  onViewChange: (view: SubscriptionView) => void;
}

export const UpgradeOrSubscribeForm = ({ isUpgrade, onViewChange }: UpgradeOrSubscribeFormProps) => {
  const [selectedPlan, setSelectedPlan] = useState("Standard");
  const [billingCycle, setBillingCycle] = useState("Termly");
  const [studentCount, setStudentCount] = useState(1);

  const planPrices = {
    Standard: 1000,
    Advanced: 1350,
  };

  const subtotal = planPrices[selectedPlan as keyof typeof planPrices] * studentCount;

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-8 text-center">
        <h2 className="text-text-default mb-2 text-3xl font-extrabold">{isUpgrade ? "Upgrade Your Plan" : "Choose Your Subscription Plan"}</h2>
        <p className="text-text-subtle text-sm font-medium">Select a plan and specify the number of students across all your branches</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          {isUpgrade && (
            <div className="border-border-default rounded-xl border bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <p className="text-text-muted mb-1 text-xs font-medium">Your Current Plan</p>
                  <div className="flex items-center gap-2">
                    <span className="text-text-default text-sm font-bold">Standard Plan</span>
                    <Badge className="bg-bg-badge-green text-text-success rounded-md border-none px-2 py-0.5 text-[10px] font-bold uppercase">
                      Active
                    </Badge>
                    <span className="text-text-subtle text-xs">• 200 students • ₦1,500/student/mo</span>
                  </div>
                </div>
                <Badge className="rounded-md border-none bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600">Expires March 24</Badge>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-text-default text-base font-bold">Billing Period</h3>
              <p className="text-text-subtle text-xs font-medium">Choose your preferred billing cycle</p>
            </div>
            <div className="flex w-fit gap-2 rounded-full bg-zinc-100 p-1">
              {["Termly", "Yearly"].map(cycle => (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  className={`rounded-full px-6 py-1.5 text-xs font-bold transition-colors ${
                    billingCycle === cycle ? "text-text-default bg-white shadow-sm" : "text-text-subtle"
                  }`}
                >
                  {cycle}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-text-default text-base font-bold">Select Your Plan</h3>
              <p className="text-text-subtle text-xs font-medium">All branches will use the same plan</p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Standard Plan Radio */}
              <div
                onClick={() => setSelectedPlan("Standard")}
                className={`cursor-pointer rounded-xl border p-6 transition-all ${
                  selectedPlan === "Standard" ? "border-blue-500 bg-blue-50/10 ring-1 ring-blue-500" : "border-border-default bg-white"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${selectedPlan === "Standard" ? "border-blue-500" : "border-zinc-300"}`}
                    >
                      {selectedPlan === "Standard" && <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>}
                    </div>
                    <span className="text-text-default text-sm font-bold">Standard Plan</span>
                  </div>
                  <span className="text-text-default text-sm font-bold">
                    ₦1,000 <span className="text-xs font-medium text-zinc-400">per student</span>
                  </span>
                </div>
                <p className="text-text-subtle text-xs font-medium">16+ modules</p>
              </div>

              {/* Advanced Plan Radio */}
              <div
                onClick={() => setSelectedPlan("Advanced")}
                className={`cursor-pointer rounded-xl border p-6 transition-all ${
                  selectedPlan === "Advanced" ? "border-blue-500 bg-blue-50/10 ring-1 ring-blue-500" : "border-border-default bg-white"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${selectedPlan === "Advanced" ? "border-blue-500" : "border-zinc-300"}`}
                    >
                      {selectedPlan === "Advanced" && <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>}
                    </div>
                    <span className="text-text-default text-sm font-bold">Advanced Plan</span>
                  </div>
                  <span className="text-text-default text-sm font-bold">
                    ₦1,350 <span className="text-xs font-medium text-zinc-400">per student</span>
                  </span>
                </div>
                <p className="text-text-subtle mb-4 text-xs font-medium">16+ modules</p>

                {selectedPlan === "Advanced" && (
                  <div className="mt-4 flex flex-col gap-4 border-t border-zinc-100 pt-4">
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
                          <button
                            onClick={() => setStudentCount(studentCount + 1)}
                            className="h-full border-l border-zinc-200 px-4 hover:bg-zinc-200"
                          >
                            <AddFill fill="var(--color-icon-default)" className="h-4 w-4" />
                          </button>
                        </div>
                        <Button className="text-text-dark-default h-10 rounded-md bg-zinc-100 px-4 text-xs font-bold hover:bg-zinc-200">
                          Auto-Fill Active Students
                        </Button>
                      </div>
                      <div className="text-text-success w-fit rounded border-none bg-lime-50 px-2 py-0.5 text-[10px] font-bold">
                        0 - 200 Students Tier
                      </div>
                    </div>

                    <div className="flex gap-3 rounded-xl bg-blue-50 p-4">
                      <InfoIcon className="h-5 w-5 flex-shrink-0 text-blue-500" />
                      <p className="text-text-subtle text-xs leading-relaxed font-medium">
                        You&apos;re paying for the exact number of active students
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <OrderSummary
            planName={selectedPlan + " Plan"}
            studentCount={studentCount}
            billingCycle={billingCycle === "Termly" ? "Monthly" : "Yearly"} // Assuming Termly maps to Monthly for UI match
            subtotal={subtotal}
            onPay={() => {}}
          />
        </div>
      </div>
    </div>
  );
};
