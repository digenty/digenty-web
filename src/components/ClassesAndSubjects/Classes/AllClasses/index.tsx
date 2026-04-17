"use client";

import { BranchArmReport, BranchWithClassLevels, ClassLevel, Term } from "@/api/types";
import AlertFill from "@/components/Icons/AlertFill";
import GraduationCapFill from "@/components/Icons/GraduationCapFill";
import { OverviewCard } from "@/components/OverviewCard";
import { useGetBranchDetails, useGetBranches } from "@/hooks/queryHooks/useBranch";
import useDebounce from "@/hooks/useDebounce";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { AllClassesMainTableProps } from "../types";
import { AllClassesHeader } from "./AllClassesHeader";
import { AllClassesMainTable } from "./AllClassesMainTable";
import { usePathname } from "next/navigation";

export const AllClassesMain = () => {
  const user = useLoggedInUser();
  const { data: branchesData, isPending: loadingBranches } = useGetBranches();
  const pathname = usePathname();
  const branchId = pathname.split("/")[4];
  console.log(branchId);
  const [activeBranchId, setActiveBranchId] = useState<number | null>(null);

  const userBranchIds = user?.adminBranchIds || [];
  const userBranches = branchesData?.data?.filter((b: BranchWithClassLevels) => userBranchIds.includes(b.branch.id)) || [];

  useEffect(() => {
    if (branchId) {
      setActiveBranchId(Number(branchId));
    } else if (userBranchIds.length === 1) {
      setActiveBranchId(userBranchIds[0]);
    } else if (userBranchIds.length > 1 && !activeBranchId) {
      setActiveBranchId(userBranchIds[0]);
    }
  }, [userBranchIds, activeBranchId]);

  const [termSelected, setTermSelected] = useState<Term | null>(null);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [levelSelected, setLevelSelected] = useState<ClassLevel | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {
    data,
    isPending: isFetchingBranch,
    isError,
  } = useGetBranchDetails(activeBranchId!, termSelected?.termId, debouncedSearchQuery, levelSelected?.id); // Add leveId to this query levelSelected?.ids[0]
  const branchDetail = data?.data?.data;

  const tableData: AllClassesMainTableProps[] =
    branchDetail?.branchArmReportResponseDtos?.map((arm: BranchArmReport) => ({
      armId: arm.armId,
      classId: arm.classId,
      classArmName: arm.classArmName,
      classTeacherName: arm.classTeacherName,
      numberOfSubjects: arm.numberOfSubjects,
      numberOfSubmittedSubjects: arm.numberOfSubmittedSubjects,
      classArmReportId: arm?.classArmReportId,
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

      {userBranchIds.length > 1 && (
        <div className="bg-bg-state-soft mt-6 ml-4 flex w-fit items-center gap-1.5 rounded-full p-1 md:ml-8">
          {userBranches.map((branchWrapper: BranchWithClassLevels) => {
            const branch = branchWrapper.branch;
            const isActive = activeBranchId === branch.id;
            return (
              <div
                key={branch.id}
                onClick={() => setActiveBranchId(branch.id)}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-bg-state-secondary text-text-default shadow-sm"
                    : "text-text-muted hover:text-text-default hover:bg-bg-state-ghost-hover/50",
                )}
              >
                {branch.name}
              </div>
            );
          })}
        </div>
      )}

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
        branchId={activeBranchId!}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
};
