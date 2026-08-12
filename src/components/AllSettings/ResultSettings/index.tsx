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
    <div className="md:py-8">
      <div className="w-full min-w-0">
        <div className="relative w-full max-w-full overflow-hidden">
          <div className="border-border-default hide-scrollbar flex w-full items-center overflow-x-auto overscroll-x-contain border-b px-4 [-webkit-overflow-scrolling:touch]">
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
                    "cursor-pointer px-3 py-2.5 text-center whitespace-nowrap transition-all duration-150",
                    isActive && "border-border-informative border-b-[1.5px]",
                  )}
                >
                  <span className={cn("text-sm font-medium", isActive ? "text-text-informative" : "text-text-muted")}>{tab}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {activeTab === "Result Calculation" && <ResultCalculations />}
      {activeTab === "Submission Deadline" && <Submission />}
      {activeTab === "Principal’s Comment" && <PrincipalComment />}
    </div>
  );
};
