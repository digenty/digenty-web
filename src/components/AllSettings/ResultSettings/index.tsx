"use client";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { PrincipalComment } from "./PrincipalsComment";
import { Submission } from "./Submission";
import { ResultCalculations } from "./ResultCalculations";

const tabs = ["Result Calculation", "Submission Deadline", "Principal’s Comment"];

export const SettingsResult = () => {
  const [activeTab, setActiveTab] = useState("Result Calculation");
  useBreadcrumb([
    { label: "Settings", url: "/staff/settings" },
    { label: "Result Settings", url: "/staff/settings/result" },
  ]);
  return (
    <div className="px-4 md:p-8">
      <div className="border-border-default flex w-auto max-w-120 items-center gap-3 border-b">
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          return (
            <div
              role="button"
              onClick={() => {
                setActiveTab(tab);
              }}
              key={tab}
              className={cn(
                "w-1/2 cursor-pointer py-2.5 text-center transition-all duration-150",
                isActive && "border-border-informative border-b-[1.5px]",
              )}
            >
              <span className={cn("text-sm font-medium", isActive ? "text-text-informative" : "text-text-muted")}>{tab}</span>
            </div>
          );
        })}
      </div>
      {activeTab === "Result Calculation" && <ResultCalculations />}
      {activeTab === "Submission Deadline" && <Submission />}
      {activeTab === "Principal’s Comment" && <PrincipalComment />}
    </div>
  );
};
