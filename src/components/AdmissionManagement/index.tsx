"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { AdmissionCyclesManagement } from "./SetupConfiguration/AdmissionCyclesManagement";
import { AdmissionDashboard } from "./Dashboard";
import { ProcessApplicants } from "./ProcessApplicants";
import { AdmissionPayments } from "./Payments";
import { Button } from "../ui/button";

const tabs = [
  { label: "Dashboard", value: "dashboard" },
  { label: "Process Applicants", value: "process-applicants" },
  { label: "Set Up & Configuration", value: "setup" },
  { label: "Payments", value: "payments" },
];

export const AdmissionManagement = () => {
  const router = useRouter();
  const params = useSearchParams();
  const activeTab = params.get("tab") ?? "setup";

  return (
    <div>
      <div className="border-border-default flex min-h-14 items-center border-b px-4 py-2 sm:px-8">
        {activeTab !== "dashboard" && (
          <Button
            onClick={() => router.back()}
            className="border-border-darker text-text-default bg-bg-state-secondary hover:bg-bg-state-secondary-hover! mr-2 flex shrink-0 items-center gap-1.5 border text-sm font-medium transition-colors"
          >
            <span className="text-base leading-none">←</span>
            Back
          </Button>
        )}

        <div className="w-0 flex-1 overflow-x-auto">
          <div className="flex items-center">
            {tabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => router.push(`?tab=${tab.value}`)}
                className={cn(
                  "relative h-8 shrink-0 cursor-pointer px-3 text-sm font-medium whitespace-nowrap transition-all duration-150 sm:px-4",
                  activeTab === tab.value ? "text-text-default bg-bg-state-soft rounded-md" : "text-text-muted hover:text-text-subtle",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-screen p-3 md:p-6">
        {activeTab === "dashboard" && <AdmissionDashboard />}
        {activeTab === "process-applicants" && <ProcessApplicants />}
        {activeTab === "setup" && <AdmissionCyclesManagement />}
        {activeTab === "payments" && <AdmissionPayments />}
      </div>
    </div>
  );
};
