"use client";

import { AddFill } from "@/components/Icons/AddFill";
import { Alert } from "@/components/Icons/Alert";
import BankCard from "@/components/Icons/BankCard";
import { Gift2 } from "@/components/Icons/Gift2";
import Information from "@/components/Icons/Information";
import School from "@/components/Icons/School";
import { Substract } from "@/components/Icons/Substract";
import { User3 } from "@/components/Icons/User3";
import { RoundedCheckbox } from "@/components/RoundedCheckbox";
import { Toggle } from "@/components/Toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";

const plans = [
  {
    id: 1,
    title: "Freemium Plan",
    price: "₦0",
    module: "9+ modules",
  },
];

export const AddStudentToPlan = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <>
      <div className="mx-auto mb-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="text-text-default text-xl font-semibold">Add Students to your Plan</div>
          <div className="text-text-subtle textsm text-center">Specify the number of students across all your branches</div>
        </div>
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-start">
        <div className="border-border-default flex w-full flex-col gap-6 rounded-md border p-6 md:flex-1">
          <div className="border-border-default flex flex-col gap-6 rounded-md border">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`cursor-pointer rounded-md border transition-all ${
                  selectedId === plan.id ? "border-bg-basic-blue-accent border-2" : "border-border-darker bg-bg-card"
                }`}
              >
                <div className="border-border-default flex flex-col gap-4 border-b">
                  <div className="flex items-center justify-between p-4">
                    <h3 className="text-text-default flex items-center gap-2 text-sm font-medium">
                      <RoundedCheckbox
                        onChange={checked => {
                          setSelectedId(checked ? plan.id : null);
                        }}
                        checked={selectedId === plan.id}
                      />
                      {plan.title}
                    </h3>
                    <p className="text-text-default text-sm">
                      {plan.price} <span className="text-text-muted">per student</span>{" "}
                    </p>
                  </div>
                </div>
                <div className="text-text-subtle p-4 text-sm">{plan.module}</div>

                <div className="flex flex-col gap-4 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Badge className="border-border-default bg-bg-badge-default text-text-subtle rounded-md border text-xs">
                      <User3 fill="var(--color-icon-default-muted)" />
                      1,868 students
                    </Badge>
                    <Badge className="border-border-default bg-bg-badge-default text-text-subtle rounded-md border text-xs">
                      <School fill="var(--color-icon-default-muted)" />3 Branches
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">Number of Students</Label>
                    <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
                      <div className="bg-bg-input-soft flex w-full items-center justify-between rounded-md">
                        <Button className="thover:bg-bg-none! bg-bg-none! border-none">
                          <Substract fill="var(--color-icon-default-subtle)" className="size-10" />
                        </Button>
                        <div className="text-text-default text-sm">1</div>
                        <Button className="hover:bg-bg-none! bg-bg-none! border-none">
                          <AddFill fill="var(--color-icon-default-subtle)" />
                        </Button>
                      </div>
                      <Button className="bg-bg-input-soft! text-text-subtle w-fit rounded-md text-sm font-medium md:w-49">
                        Auto-Fill Active Students
                      </Button>
                    </div>
                  </div>
                  <p className="text-text-muted text-xs">Specify how many students you want to pay for</p>
                  <div className="bg-bg-badge-blue border-border-default text-text-subtle flex items-center gap-2 rounded-md border p-4 text-sm">
                    <Information fill="var(--color-icon-informative)" className="size-6" /> You&apos;re paying for the exact number of active students
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-border-default bg-bg-subtle w-full rounded-md border p-1.5 md:w-109">
          <div className="border-border-default bg-bg-default flex flex-col gap-4 rounded-md border p-4">
            <div className="text-text-default text-md font-semibold">Order Summary</div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-2">
                <div className="text-text-subtle text-sm">Plan</div>
                <div className="text-text-default text-sm font-medium">Standard Plan</div>
              </div>
              <div className="flex items-center justify-between p-2">
                <div className="text-text-subtle text-sm">Students</div>
                <div className="text-text-default text-sm font-medium">2,565</div>
              </div>
              <div className="flex items-center justify-between p-2">
                <div className="text-text-subtle text-sm">Billing</div>
                <div className="text-text-default text-sm font-medium">Monthly</div>
              </div>
              <div className="border-border-default border-b"></div>
              <div className="flex items-center justify-between p-2">
                <div className="text-text-subtle text-sm">Subtotal</div>
                <div className="text-text-default text-sm font-medium">₦1,104</div>
              </div>
              <div className="flex items-center justify-between p-2">
                <div className="text-text-default text-sm font-semibold">Total Cost</div>
                <div className="text-text-default text-sm font-semibold">₦1,104</div>
              </div>
              <div className="border-border-default flex items-center justify-between border-t p-2">
                <div className="flex items-center gap-2">
                  <Gift2 fill="var(--color-icon-default)" />
                  <div className="text-text-default text-sm font-semibold">Use Referral Earningst</div>
                </div>
                <Toggle />
              </div>

              <div className="bg-bg-badge-green border-border-default text-text-subtle rounded-md border px-3 py-2.5 text-sm">
                Referral Balance (₦1,104)
              </div>

              <div className="border-border-default flex items-start gap-2 rounded-md border px-3 py-2.5">
                <Alert fill="var(--color-icon-default)" className="mt-0 size-12" />
                <div className="text-text-subtle text-sm">
                  You&apos;ll be redirected to a secure payment gateway to complete this transaction. Your subscription begins once payment is
                  confirmed.
                </div>
              </div>
              <Button className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default mt-2 rounded-md">
                {" "}
                <BankCard fill="var(--color-icon-white-default)" /> Pay ₦1,104{" "}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
