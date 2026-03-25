"use client";

import { BillFill } from "@/components/Icons/BillFill";
import { BookOpenFill } from "@/components/Icons/BookOpenFill";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { PendingFees } from "./PendingFees";
import { StudentFilter } from "../FilterStudents";
import { useRouter } from "next/navigation";

export const Overview = () => {
  const router = useRouter();
  return (
    <div className="flex w-full flex-col gap-10 p-4 md:p-8">
      <div className="flex w-full items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-text-default text-2xl font-semibold">Welcome, John</div>
          <div className="text-text-muted text-xs">Student Overview</div>
        </div>
        <StudentFilter />
      </div>

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        <div className="border-border-darker bg-bg-subtle flex flex-col gap-4 rounded-xl border p-3 md:p-6">
          <div className="flex items-center gap-2">
            <div className="bg-bg-basic-red-subtle border-bg-basic-red-accent rounded-2xs border p-1">
              <BillFill fill="var(--color-icon-default)" width={9} height={9} />
            </div>
            <div className="text-text-muted text-xs font-medium capitalize">Outstanding Fees </div>
          </div>
          <div className="text-text-default text-lg font-semibold">₦30,000</div>
          <Button
            onClick={() => router.push("/parent-fees/fees-to-pay")}
            className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default w-full rounded-full"
          >
            Pay now <ArrowRight />
          </Button>
        </div>

        <div className="border-border-darker bg-bg-subtle flex flex-col gap-4 rounded-xl border p-3 md:p-6">
          <div className="flex items-center gap-2">
            <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent rounded-2xs border p-1">
              <BookOpenFill fill="var(--color-icon-default)" width={9} height={9} />
            </div>
            <div className="text-text-muted text-xs font-medium capitalize">Academic Result</div>
          </div>
          <div className="text-text-default text-lg font-semibold">Second Term Result Available</div>
          <Button
            onClick={() => router.push("/parent-fees")}
            className="bg-bg-state-secondary border-border-darker hover:bg-bg-state-secondary-hover! text-text-default w-full rounded-full border"
          >
            View Results <ArrowRight />
          </Button>
        </div>
      </div>
      <PendingFees />
    </div>
  );
};
