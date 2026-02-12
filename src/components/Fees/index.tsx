"use client";

import { cn } from "@/lib/utils";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FeesItem } from "./FeesItem";
import { FeesGroup } from "./FeesGroup";
import { ClassFees } from "./ClassFees";

const tabs = ["Class Fees", "Fee Items", "Fee Groups"];

export const FeesIndex = () => {
  const router = useRouter();
  const params = useSearchParams();
  const activeTab = params.get("tab") ?? "Class Fees";

  useBreadcrumb([
    { label: "Fees", url: "/fees" },
    { label: activeTab, url: `/fees?tab=${activeTab}` },
  ]);

  useEffect(() => {
    router.push(`/fees?tab=${activeTab}`);
  }, [activeTab, router]);

  return (
    <div className="space-y-4 px-4 md:space-y-6 md:px-8">
      <div className="border-border-default flex w-auto max-w-105 items-center gap-3 border-b">
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          return (
            <div
              role="button"
              onClick={() => {
                router.push(`/fees?tab=${tab}`);
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

      {activeTab === "Class Fees" && <ClassFees />}
      {activeTab === "Fee Items" && <FeesItem />}
      {activeTab === "Fee Groups" && <FeesGroup />}
    </div>
  );
};
