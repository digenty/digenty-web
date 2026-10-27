"use client";
import { PillTabs } from "@/components/PillTabs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ParentsTable } from "./Parent";
import { StudentsTable } from "./Students";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewStudentParentRecords } from "@/lib/permissions/students-and-parents";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "@digenty/icons";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";

const tabs = [
  { id: "Students", label: "Students" },
  { id: "Parents", label: "Parents" },
];

const StudentAndParentRecord = () => {
  const router = useRouter();
  const params = useSearchParams();
  const activeTab = params.get("tab") ?? "Students";
  const { isMain, isAdmin, adminBranchIds } = useLoggedInUser();
  const hasFullAccess = isMain || isAdmin || (adminBranchIds?.length ?? 0) > 0;

  useEffect(() => {
    if (!activeTab) {
      router.push(`/staff/student-and-parent-record?tab=Students`);
    }
  }, [activeTab, router]);

  return (
    <ModulePermissionsWrapper permissionUtility={canViewStudentParentRecords}>
      <div className="space-y-4.5 px-3 py-6 md:space-y-8 md:px-8">
        {hasFullAccess && (
          <Button
            onClick={() => router.push("/staff")}
            className="border-border-darker text-text-default bg-bg-state-secondary hover:bg-bg-state-secondary-hover! flex w-fit shrink-0 items-center gap-1.5 border text-sm font-medium transition-colors md:hidden"
          >
            <ArrowLeft fill="var(--color-icon-default-subtle)" className="size-4 shrink-0" />
            Back to Dashboard
          </Button>
        )}

        {/* Tabs */}
        <PillTabs tabs={tabs} activeId={activeTab} onChange={tab => router.push(`/staff/student-and-parent-record?tab=${tab}`)} />

        {/* Separate the table components into two different files with their separate states, then render conditionally here */}
        <div>{activeTab === "Students" ? <StudentsTable /> : <ParentsTable />}</div>
      </div>
    </ModulePermissionsWrapper>
  );
};

export default StudentAndParentRecord;
