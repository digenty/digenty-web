"use client";

import { AlertFill, GraduationCapFill } from "@digenty/icons";
import { BranchArmReport, BranchWithClassLevels, ClassLevel, Term } from "@/api/types";

import { BackButton } from "@/components/BackButton";
import { OverviewCard } from "@/components/OverviewCard";
import { useGetBranchDetails, useGetBranches } from "@/hooks/queryHooks/useBranch";
import useDebounce from "@/hooks/useDebounce";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { AllClassesMainTableProps } from "../types";
import { AllClassesHeader } from "./AllClassesHeader";
import { AllClassesMainTable } from "./AllClassesMainTable";
import { useParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const AllClassesMain = () => {
  const user = useLoggedInUser();

  const { data: branchesData, isPending: loadingBranches } = useGetBranches();
  const params = useParams<{ branchId?: string }>();
  const branchId = params?.branchId;

  const [activeBranchId, setActiveBranchId] = useState<number | null>(branchId ? Number(branchId) : null);

  useBreadcrumb(
    branchId
      ? [
          { label: "Classes and Subjects", url: "/staff/classes-and-subjects" },
          { label: "All Branches", url: "/staff/classes-and-subjects/all-branches" },
          { label: "All Classes", url: "" },
        ]
      : [
          { label: "Classes and Subjects", url: "/staff/classes-and-subjects" },
          { label: "All Classes", url: "" },
        ],
  );

  const hasBranchRestriction = (user?.adminBranchIds?.length ?? 0) > 0;
  const userBranchIds = useMemo(
    () => (hasBranchRestriction ? (user!.adminBranchIds! as number[]) : (branchesData?.data?.map((b: BranchWithClassLevels) => b.branch.id) ?? [])),
    [hasBranchRestriction, user, branchesData],
  );
  const userBranches = branchesData?.data?.filter((b: BranchWithClassLevels) => userBranchIds.includes(b.branch.id)) || [];

  // Sync from the URL only when the URL's branchId itself changes (e.g. navigation) —
  // not on every render, so selecting a branch tab isn't immediately overwritten.
  useEffect(() => {
    if (branchId) {
      setActiveBranchId(Number(branchId));
    }
  }, [branchId]);

  useEffect(() => {
    if (!branchId && !activeBranchId && userBranchIds.length > 0) {
      setActiveBranchId(userBranchIds[0]);
    }
  }, [branchId, activeBranchId, userBranchIds]);

  const [termSelected, setTermSelected] = useState<Term | null>(null);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [levelSelected, setLevelSelected] = useState<ClassLevel | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {
    data,
    isPending: isFetchingBranch,
    isError,
    error,
  } = useGetBranchDetails(activeBranchId!, termSelected?.termId, debouncedSearchQuery, levelSelected?.id); // Add leveId to this query levelSelected?.ids[0]
  const branchDetail = data?.data?.data;

  const tableData: AllClassesMainTableProps[] =
    branchDetail?.branchArmReportResponseDtos?.content?.map((arm: BranchArmReport) => ({
      armId: arm.armId,
      classId: arm.classId,
      classArmName: arm.classArmName,
      classTeacherName: arm.classTeacherName,
      classTeacherId: arm.classTeacherId,
      numberOfSubjects: arm.numberOfSubjects,
      numberOfSubmittedSubjects: arm.numberOfSubmittedSubjects,
      classArmReportId: arm?.classArmReportId,
      numberOfEditRequest: arm.numberOfEditRequest > 0 ? `${arm.numberOfEditRequest} Pending` : "-",
      status: arm.status,
    })) ?? [];

  return (
    <div className="flex flex-col">
      <div className="px-4 pt-3 md:hidden">
        <BackButton />
      </div>

      <AllClassesHeader
        termSelected={termSelected}
        setTermSelected={setTermSelected}
        activeSession={activeSession}
        setActiveSession={setActiveSession}
      />

      {userBranchIds.length > 1 && (
        <>
          <div className="mt-6 ml-4 md:hidden">
            <Select value={activeBranchId ? String(activeBranchId) : undefined} onValueChange={value => setActiveBranchId(Number(value))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {userBranches.map((branchWrapper: BranchWithClassLevels) => {
                  const branch = branchWrapper.branch;
                  return (
                    <SelectItem key={branch.id} value={String(branch.id)} className="bg-bg-card!">
                      {branch.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-bg-state-soft mt-6 ml-4 hidden w-fit items-center gap-1.5 rounded-full p-1 md:ml-8 md:flex">
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
        </>
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
