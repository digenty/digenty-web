"use client";

import { useState } from "react";
import { StudentFilter } from "../FilterStudents";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Calendar from "@/components/Icons/Calendar";
import { Button } from "@/components/ui/button";
import { FeesBreakdown } from "./FeesBreakdown";
import { PaymentHistory } from "./PaymentHistory";
import { useRouter } from "next/navigation";

const filterValues = ["24/25 Third Term", "24/25 Second Term", "24/25 First Term"];
const tabs = ["Fees Breakdown", "Payment History"];
export const ParentFees = () => {
  const [selected, setSelected] = useState(filterValues[0]);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const router = useRouter();

  return (
    <div className="flex w-full flex-col gap-10 p-4 md:p-8">
      <div className="flex w-full items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-text-default text-2xl font-semibold">Fees</div>
          <div className="text-text-muted text-xs">Manage and view your child&apos;s school fees, payment history, and invoices.</div>
        </div>
        <StudentFilter />
      </div>

      <div className="flex items-center justify-between">
        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger className="border-border-darker h-8! w-auto border">
            <SelectValue className="text-text-default flex font-medium">
              <Calendar className="text-icon-black-muted size-4" />
              <p className="text-text-default text-sm">{selected}</p>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default border">
            <SelectItem className="text-text-default" value="24/25 Third Term">
              24/25 Third Term
            </SelectItem>
            <SelectItem className="text-text-default" value="24/25 Second Term">
              24/25 Second Term
            </SelectItem>
            <SelectItem className="text-text-default" value="24/25 First Term">
              24/25 First Term
            </SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={() => router.push("/parent-fees/fees-to-pay")}
          className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default rounded-full"
        >
          Pay Online
        </Button>
      </div>

      <div className="bg-bg-state-soft flex h-9 w-full rounded-md p-0.5 md:w-87">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full items-center px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab ? "text-text-default bg-bg-state-secondary! rounded-md" : "text-text-muted hover:text-text-default"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Fees Breakdown" && <FeesBreakdown />}
      {activeTab === "Payment History" && <PaymentHistory />}
    </div>
  );
};
