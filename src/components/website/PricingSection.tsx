"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Sparkles, Tag } from "lucide-react";
import AnimateIn from "./AnimateIn";

type StudentCount = "1-200" | "201-400" | "401+";
type BillingCycle = "Termly" | "Yearly";

const plans: Record<
  StudentCount,
  {
    standard: { termly: string; yearly: string };
    advanced: { termly: string; yearly: string };
  }
> = {
  "1-200": {
    standard: { termly: "₦1,000", yearly: "₦2,700" },
    advanced: { termly: "₦1,350", yearly: "₦3,650" },
  },
  "201-400": {
    standard: { termly: "₦900", yearly: "₦2,430" },
    advanced: { termly: "₦1,200", yearly: "₦3,240" },
  },
  "401+": {
    standard: { termly: "₦800", yearly: "₦2,160" },
    advanced: { termly: "₦1,100", yearly: "₦2,970" },
  },
};

const standardFeatures = ["Everything in Freemium,", "Academics and exams management", "Financial summary and analytics", "16+ modules"];
const advancedFeatures = ["Everything in Standard,", "Online assignments & E-notes", "Computer-based testing and examination", "19+ modules"];

export default function PricingSection() {
  const [studentCount, setStudentCount] = useState<StudentCount>("1-200");
  const [billing, setBilling] = useState<BillingCycle>("Termly");

  const current = plans[studentCount];
  const stdPrice = billing === "Termly" ? current.standard.termly : current.standard.yearly;
  const advPrice = billing === "Termly" ? current.advanced.termly : current.advanced.yearly;

  return (
    <section id="pricing" className="px-4 py-8">
      <div className="mx-auto flex max-w-9xl flex-col items-center gap-10 rounded-2xl bg-white px-8 py-14 shadow-[0px_1px_4px_0px_rgba(12,12,13,0.1)] lg:px-16">
        {/* Header */}
        <AnimateIn className="flex flex-col items-center gap-3 text-center">
          <span className="bg-bg-basic-sky-contrast inline-flex items-center gap-2 rounded-full px-2 py-1.5 text-xs font-medium text-[#4e4e55]">
            <Sparkles
              size={12}
              className="size-5 rounded-full bg-[linear-gradient(to_right,#00EEFF_0%,#50BCFF_50%,#A9A5FF_100%)] p-1 text-black"
              fill="black"
            />{" "}
            Pricing
          </span>
          <h2 className="text-4xl leading-tight font-medium tracking-tight text-[#111115]">Simple, Transparent &amp; Flexible Pricing</h2>
        </AnimateIn>

        {/* Student count selector */}
        <AnimateIn delay={100} className="flex w-full max-w-lg flex-col items-center gap-3">
          <p className="text-base font-semibold text-[#111115]">Select Student Count</p>
          <div className="flex w-full gap-0.5 rounded-full bg-zinc-100 p-0.5">
            {(["1-200", "201-400", "401+"] as StudentCount[]).map(sc => (
              <button
                key={sc}
                onClick={() => setStudentCount(sc)}
                className={`flex-1 rounded-full py-1.5 text-sm font-medium transition-all ${
                  studentCount === sc ? "border border-zinc-200/70 bg-white text-[#111115] shadow" : "text-[#6f6f77] hover:text-[#111115]"
                }`}
              >
                {sc}
              </button>
            ))}
          </div>
        </AnimateIn>

        {/* Plans */}
        <AnimateIn delay={150} className="flex w-full max-w-2xl flex-col gap-6">
          {/* Billing toggle */}
          <div className="flex w-fit gap-0.5 rounded-full bg-zinc-100 p-0.5">
            {(["Termly", "Yearly"] as BillingCycle[]).map(bc => (
              <button
                key={bc}
                onClick={() => setBilling(bc)}
                className={`rounded-full px-5 py-1.5 text-sm font-medium transition-all ${
                  billing === bc ? "border border-zinc-200/70 bg-white text-[#111115] shadow" : "text-[#6f6f77] hover:text-[#111115]"
                }`}
              >
                {bc}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Standard */}
            <div className="overflow-hidden rounded-lg border border-zinc-200">
              <div className="flex flex-col gap-5 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[#111115]">Standard</p>
                  <span className="rounded-md border border-zinc-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">Current Plan</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-medium text-[#111115]">{stdPrice}</span>
                  <span className="text-xs text-[#6f6f77]">per student</span>
                </div>
                <Link
                  href="/auth/staff?step=signup"
                  className="w-full rounded-md bg-[#437dfc] py-2 text-center text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-600"
                >
                  Subscribe
                </Link>
              </div>
              <div className="h-1.5 border-t border-zinc-100 bg-zinc-50" />
              <div className="flex flex-col gap-5 p-6">
                {standardFeatures.map(f => (
                  <div key={f} className="flex items-start gap-2.5">
                    <Check size={16} className="mt-0.5 shrink-0 text-[#437dfc]" />
                    <span className="text-sm text-[#4e4e55]">{f}</span>
                  </div>
                ))}
                <button className="text-left text-xs font-medium text-[#111115] transition-colors hover:text-[#437dfc]">
                  See all available features
                </button>
              </div>
            </div>

            {/* Advanced */}
            <div className="overflow-hidden rounded-lg border border-zinc-200">
              <div className="flex flex-col gap-5 p-4">
                <p className="text-sm font-medium text-[#111115]">Advanced</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-medium text-[#111115]">{advPrice}</span>
                  <span className="text-xs text-[#6f6f77]">per student</span>
                </div>
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-md border border-zinc-200 bg-zinc-100 py-2 text-sm font-medium text-zinc-400"
                >
                  Coming soon
                </button>
              </div>
              <div className="h-1.5 border-t border-zinc-100 bg-zinc-50" />
              <div className="flex flex-col gap-5 p-6">
                {advancedFeatures.map(f => (
                  <div key={f} className="flex items-start gap-2.5">
                    <Check size={16} className="mt-0.5 shrink-0 text-[#437dfc]" />
                    <span className="text-sm text-[#4e4e55]">{f}</span>
                  </div>
                ))}
                <button className="text-left text-xs font-medium text-[#111115] transition-colors hover:text-[#437dfc]">
                  See all available features
                </button>
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
