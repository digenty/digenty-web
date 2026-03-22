"use client";

import { BranchArmReport, ClassLevel, Term } from "@/api/types";
import AlertFill from "@/components/Icons/AlertFill";
import GraduationCapFill from "@/components/Icons/GraduationCapFill";
import { OverviewCard } from "@/components/OverviewCard";
import { useGetBranchDetails } from "@/hooks/queryHooks/useBranch";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AllClassesMainTableProps } from "../types";
import { AllClassesHeader } from "./AllClassesHeader";
import { AllClassesMainTable } from "./AllClassesMainTable";
import useDebounce from "@/hooks/useDebounce";

export const AllClassesMain = () => {
  const user = useLoggedInUser();
  const pathname = usePathname();

  const schoolId = user?.schoolId;
  // const branchId = pathname.split("/")[3];
  const branchId = 30;

  const [termSelected, setTermSelected] = useState<Term | null>(null);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [levelSelected, setLevelSelected] = useState<ClassLevel | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data, isPending: isFetchingBranch, isError } = useGetBranchDetails(branchId, termSelected?.termId, debouncedSearchQuery); // Add leveId to this query levelSelected?.ids[0]
  const branchDetail = data?.data?.data;

  const tableData: AllClassesMainTableProps[] =
    branchDetail?.branchArmReportResponseDtos?.map((arm: BranchArmReport) => ({
      armId: arm.armId,
      classId: arm.classId,
      classArmName: arm.classArmName,
      classTeacherName: arm.classTeacherName,
      numberOfSubjects: arm.numberOfSubjects,
      numberOfSubmittedSubjects: arm.numberOfSubmittedSubjects,
      numberOfEditRequest: arm.numberOfEditRequest > 0 ? `${arm.numberOfEditRequest} Pending` : "-",
      status: arm.status,
    })) ?? [];

  return (
    <div className="flex flex-col">
      <AllClassesHeader
        termSelected={termSelected}
        setTermSelected={setTermSelected}
        activeSession={activeSession}
        setActiveSession={setActiveSession}
      />

      <div className="mt-4 grid w-full grid-cols-2 gap-3 px-4 md:px-8 lg:grid-cols-3">
        <OverviewCard
          title="Total Classes"
          Icon={() => (
            <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <GraduationCapFill fill="var(--color-icon-default)" />
            </div>
          )}
          value={branchDetail?.totalArms ?? 0}
        />
        <OverviewCard
          title="Pending Submission"
          Icon={() => (
            <div className="bg-bg-basic-yellow-subtle border-bg-basic-yellow-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <AlertFill fill="var(--color-icon-default)" />
            </div>
          )}
          value={branchDetail?.totalPendingSubmissions ?? 0}
        />
        <OverviewCard
          className="col-span-2 lg:col-auto"
          title="Completed Submission"
          Icon={() => (
            <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <GraduationCapFill fill="var(--color-icon-default)" />
            </div>
          )}
          value={branchDetail?.totalCompletedSubmissions ?? 0}
        />
      </div>

      <AllClassesMainTable
        data={tableData}
        isFetchingBranch={isFetchingBranch}
        isError={isError}
        levelSelected={levelSelected}
        setLevelSelected={setLevelSelected}
        branchId={branchId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
};
