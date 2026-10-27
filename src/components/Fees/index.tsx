"use client";

import { PillTabs } from "@/components/PillTabs";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useRouter, useSearchParams } from "next/navigation";
import { FeesItem } from "./FeesItem";
import { FeesGroup } from "./FeesGroup";
import { ClassFees } from "./ClassFees";
import { useFeesFilters } from "./useFeesFilters";
import { useGetFeeClassOverview } from "@/hooks/queryHooks/useFee";

const tabs = [
  { id: "Class Fees", label: "Class Fees" },
  { id: "Fee Items", label: "Fee Items" },
  { id: "Fee Groups", label: "Fee Groups" },
];

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
  const { sessionId, term, branchId } = useFeesFilters({ allowAllTerms: false });
  useGetFeeClassOverview(sessionId ?? 0, term ?? "FIRST", branchId, undefined);

  return (
    <div className="mx-auto flex w-full max-w-350 flex-col gap-6 px-4 py-6 md:gap-8 md:px-8">
      <div className="space-y-1">
        <h1 className="text-text-default text-xl font-semibold tracking-tight md:text-2xl">Fees</h1>
        <p className="text-text-muted text-xs md:text-sm">Set up what each class pays, and group fee items together.</p>
      </div>

      <PillTabs tabs={tabs} activeId={activeTab} onChange={tab => router.push(`/staff/fees?tab=${tab}`)} className="max-w-md" />

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
