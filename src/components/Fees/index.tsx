"use client";

import { cn } from "@/lib/utils";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useRouter, useSearchParams } from "next/navigation";
import { FeesItem } from "./FeesItem";
import { FeesGroup } from "./FeesGroup";
import { ClassFees } from "./ClassFees";
import { useFeesFilters } from "./useFeesFilters";
import { useGetFeeClassOverview } from "@/hooks/queryHooks/useFee";

const tabs = ["Class Fees", "Fee Items", "Fee Groups"];

export const FeesIndex = () => {
  const router = useRouter();
  const params = useSearchParams();
  const activeTab = params.get("tab") ?? "Class Fees";

  useBreadcrumb([
    { label: "Fees", url: "/staff/fees" },
    { label: activeTab, url: `/staff/fees?tab=${activeTab}` },
  ]);

  // Keep the slow class-overview query alive at the parent level so it
  // survives tab switches — TQ deduplicates with the identical call in ClassFees.
  const { sessionId, term, branchId } = useFeesFilters();
  useGetFeeClassOverview(sessionId ?? 0, term ?? "FIRST", branchId, undefined);

  return (
    <div className="flex flex-col gap-8 px-6 py-10 md:px-8">
      <div className="border-border-default flex w-auto max-w-105 items-center gap-3 border-b">
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          return (
            <div
              role="button"
              onClick={() => {
                router.push(`/staff/fees?tab=${tab}`);
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

      {/* ClassFees stays mounted (CSS-hidden when inactive) so the in-flight
          overview request is not cancelled on tab switch */}
      <div className={activeTab !== "Class Fees" ? "hidden" : undefined}>
        <ClassFees />
      </div>
      {activeTab === "Fee Items" && <FeesItem />}
      {activeTab === "Fee Groups" && <FeesGroup />}
    </div>
  );
};
