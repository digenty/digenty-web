"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Biodata } from "./StudentTable/Biodata";
import StudentAcademiRecord from "./StudentTable/StudentAcademiRecord";
import StudentInvoiceTable from "./StudentTable/StudentInvoiceTable";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Biodata", value: "biodata" },
  { label: "Invoices", value: "invoices" },
  { label: "Academic Records", value: "academic-records" },
];

export default function StudentTabs() {
  const router = useRouter();
  const params = useSearchParams();
  const activeTab = params.get("tab");

  useEffect(() => {
    if (!activeTab) {
      router.push("?tab=biodata");
    }
  }, [activeTab, router]);

  return (
    <div className="mt-6 w-full md:mt-10">
      <div className="border-border-default relative w-full border-b">
        <div className="flex items-center justify-start">
          {tabs.map(tab => (
            <div
              onClick={() => router.push(`?tab=${tab.value}`)}
              key={tab.value}
              className={cn(
                "relative cursor-pointer px-4 py-2 text-sm font-medium capitalize transition-all duration-200",
                activeTab === tab.value ? "text-text-informative" : "text-text-muted",
              )}
            >
              {tab.label}

              <div className={cn(activeTab === tab.value && "border-border-informative absolute right-0 -bottom-[1px] left-0 w-full border-b-2")} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 md:mt-6">
        {activeTab === "biodata" && <Biodata />}
        {activeTab === "invoices" && <StudentInvoiceTable />}
        {activeTab === "academic-records" && <StudentAcademiRecord />}
      </div>
    </div>
  );
}
