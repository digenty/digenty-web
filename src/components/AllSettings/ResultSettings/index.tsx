"use client";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { PrincipalComment } from "./PrincipalsComment";
import { Submission } from "./Submission";
import { ResultCalculations } from "./ResultCalculations";

const tabs = [
  { label: "Result Calculation", value: "result-calculation" },
  { label: "Submission Deadline", value: "submission-deadline" },
  { label: "Report Comment", value: "report-comment" },
];

export const SettingsResult = () => {
  const router = useRouter();
  const params = useSearchParams();
  const activeTab = params.get("tab") ?? "result-calculation";

  useBreadcrumb([
    { label: "Settings", url: "/staff/settings" },
    { label: "Result Settings", url: "/staff/settings/result" },
  ]);
  return (
    <div className="md:py-8">
      <div className="w-full min-w-0">
        <div className="relative w-full max-w-full overflow-hidden">
          <div className="border-border-default hide-scrollbar flex w-full items-center overflow-x-auto overscroll-x-contain border-b px-4 [-webkit-overflow-scrolling:touch]">
            {tabs.map(tab => {
              const isActive = activeTab === tab.value;
              return (
                <div
                  role="button"
                  onClick={() => {
                    router.push(`/staff/settings/result?tab=${tab.value}`);
                  }}
                  key={tab.value}
                  className={cn(
                    "cursor-pointer px-3 py-2.5 text-center whitespace-nowrap transition-all duration-150",
                    isActive && "border-border-informative border-b-[1.5px]",
                  )}
                >
                  <span className={cn("text-sm font-medium", isActive ? "text-text-informative" : "text-text-muted")}>{tab.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {activeTab === "result-calculation" && <ResultCalculations />}
      {activeTab === "submission-deadline" && <Submission />}
      {activeTab === "report-comment" && <PrincipalComment />}
    </div>
  );
};
