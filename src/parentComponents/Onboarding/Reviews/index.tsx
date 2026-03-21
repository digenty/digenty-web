import React, { useState } from "react";
import { StudentReview } from "./StudentReview";
import { ParentReview } from "./ParentReview";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const tabs = ["Your Details", "Student Details"];

export const Review = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="border-border-default flex flex-col gap-4 rounded-md border px-4">
      <div className="border-border-default flex flex-col gap-1 border-b p-3">
        <div className="text-text-default text-md font-semibold">Review Your Information</div>
        <div className="text-text-muted text-xs font-normal">Please verify all details before submitting</div>
      </div>

      <div className="bg-bg-state-soft border-border-default flex w-full rounded-md border">
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

      <div className="pt-4">
        {activeTab === "Your Details" && <ParentReview />}
        {activeTab === "Student Details" && <StudentReview />}
      </div>

      <div className="border-border-default flex w-full justify-between border-t pt-4">
        <Button onClick={() => router.back()} className="bg-bg-state-soft hover:bg-bg-state-soft-hover! text-text-subtle h-8">
          Back
        </Button>
        <Button
          onClick={() => router.push(`${pathname}?success`)}
          className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};
