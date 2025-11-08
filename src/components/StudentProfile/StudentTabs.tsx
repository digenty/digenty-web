"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Biodata } from "./StudentTable/Biodata";
import StudentAcademicRecord from "./StudentTable/StudentAcademicRecord";
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
      <div className="border-border-default relative flex w-full border-b">
        {tabs.map(tab => (
          <div
            onClick={() => router.push(`?tab=${tab.value}`)}
            key={tab.value}
            className={cn(
              "relative cursor-pointer px-4 py-2 text-sm font-medium capitalize transition-all duration-150",
              activeTab === tab.value ? "text-text-informative border-border-informative border-b-[1.5px]" : "text-text-muted",
            )}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <div className="mt-4 md:mt-6">
        {activeTab === "biodata" && <Biodata />}
        {activeTab === "invoices" && <StudentInvoiceTable />}
        {activeTab === "academic-records" && <StudentAcademicRecord />}
      </div>
    </div>
  );
}
