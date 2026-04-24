"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/Tabs";
import { ComparisonTable } from "./ComparisonTable";
import { SubscriptionView } from "./type";
import { CheckDouble } from "@/components/Icons/CheckDouble";

interface PlansViewProps {
  onViewChange: (view: SubscriptionView) => void;
}

export const PlansView = ({ onViewChange }: PlansViewProps) => {
  const [studentTier, setStudentTier] = useState("1-200");
  const [billingCycle, setBillingCycle] = useState("Termly");

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 w-full">
        <h2 className="text-text-default text-xl font-bold">Subscription</h2>
      </div>

      <div className="mb-12 flex flex-col items-center gap-4">
        <p className="text-text-default text-sm font-bold">Select Student Count</p>
        <div className="bg-bg-muted flex rounded-full p-1">
          {["1-200", "201-400", "401+"].map(tier => (
            <button
              key={tier}
              onClick={() => setStudentTier(tier)}
              className={`rounded-full px-8 py-1.5 text-sm font-medium transition-colors ${
                studentTier === tier ? "bg-white shadow-sm" : "text-text-subtle hover:text-text-default"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8 flex items-center gap-2 rounded-full bg-zinc-100 p-1">
        {["Termly", "Yearly"].map(cycle => (
          <button
            key={cycle}
            onClick={() => setBillingCycle(cycle)}
            className={`rounded-full px-6 py-1 text-xs font-medium transition-colors ${
              billingCycle === cycle ? "bg-white shadow-sm" : "text-text-subtle"
            }`}
          >
            {cycle}
          </button>
        ))}
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
        {/* Standard Plan */}
        <div className="border-border-default flex flex-col rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-text-default text-sm font-bold">Standard</h3>
            <Badge className="rounded-md border-none bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">Current Plan</Badge>
          </div>
          <div className="mb-6 flex items-baseline gap-1">
            <span className="text-text-default text-lg font-bold">₦1,000</span>
            <span className="text-text-subtle text-xs">per student</span>
          </div>

          <Button
            onClick={() => onViewChange("subscribe")}
            className="bg-bg-state-primary hover:bg-bg-state-primary-hover mb-8 w-full rounded-md py-2.5 text-sm font-bold text-white transition-colors"
          >
            Subscribe
          </Button>

          <ul className="flex flex-col gap-4">
            {["Computer-based testing and examination", "School Website", "Students Attendance Management", "16+ modules"].map(feature => (
              <li key={feature} className="text-text-subtle flex items-center gap-3 text-xs font-medium">
                <CheckDouble fill="var(--color-icon-default)" className="h-4 w-4" />
                {feature}
              </li>
            ))}
          </ul>
          <button className="text-text-default mt-4 text-left text-xs font-bold hover:underline">See all available features</button>
        </div>

        {/* Advanced Plan */}
        <div className="border-border-default flex flex-col rounded-xl border bg-white p-6 opacity-60 shadow-sm">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-text-default text-sm font-bold">Advanced</h3>
          </div>
          <div className="mb-6 flex items-baseline gap-1">
            <span className="text-text-default text-lg font-bold">₦1,350</span>
            <span className="text-text-subtle text-xs">per student</span>
          </div>

          <Button disabled className="bg-bg-muted text-text-hint mb-8 w-full rounded-md py-2.5 text-sm font-bold">
            Coming soon
          </Button>

          <ul className="flex flex-col gap-4">
            {["Everything in Standard,", "Live class sessions and online courses", "Transport management", "20+ modules"].map(feature => (
              <li key={feature} className="text-text-subtle flex items-center gap-3 text-xs font-bold">
                <CheckDouble fill="var(--color-icon-default)" className="h-4 w-4" />
                {feature}
              </li>
            ))}
          </ul>
          <button className="text-text-default mt-4 text-left text-xs font-bold hover:underline">See all available features</button>
        </div>
      </div>

      <div className="mt-12 w-full max-w-4xl">
        <h3 className="text-text-default mb-4 text-center text-sm font-bold">Select Student Count</h3>
        <div className="bg-bg-muted mx-auto mb-8 flex w-fit rounded-full p-1">
          {["1-200", "201-400", "401+"].map(tier => (
            <button
              key={tier}
              onClick={() => setStudentTier(tier)}
              className={`rounded-full px-8 py-1.5 text-sm font-medium transition-colors ${
                studentTier === tier ? "bg-white shadow-sm" : "text-text-subtle hover:text-text-default"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        <div className="mb-8 flex w-fit gap-2 rounded-full bg-zinc-100 p-1">
          {["Termly", "Yearly"].map(cycle => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              className={`rounded-full px-6 py-1 text-xs font-medium transition-colors ${
                billingCycle === cycle ? "bg-white shadow-sm" : "text-text-subtle"
              }`}
            >
              {cycle}
            </button>
          ))}
        </div>
        <ComparisonTable />
      </div>
    </div>
  );
};
