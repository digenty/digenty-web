"use client";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ParentsTable } from "./Parent";
import { StudentsTable } from "./Students";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";

const tabs = ["Students", "Parents"];

const StudentAndParentRecord = () => {
  const router = useRouter();
  const params = useSearchParams();
  const activeTab = params.get("tab") ?? "Students";

  useEffect(() => {
    if (!activeTab) {
      router.push(`/student-and-parent-record?tab=Students`);
    }
  }, [activeTab, router]);

  return (
    <ModulePermissionsWrapper>
      <div className="space-y-4.5 px-4 py-6 md:space-y-8 md:px-8">
        {/* Tabs */}
        <div className="border-border-default flex w-auto max-w-105 items-center gap-3 border-b">
          {tabs.map(tab => {
            const isActive = activeTab === tab;
            return (
              <div
                role="button"
                onClick={() => {
                  router.push(`/student-and-parent-record?tab=${tab}`);
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

        {/* Separate the table components into two different files with their separate states, then render conditionally here */}
        <div>{activeTab === "Students" ? <StudentsTable /> : <ParentsTable />}</div>
      </div>
    </ModulePermissionsWrapper>
  );
};

export default StudentAndParentRecord;
