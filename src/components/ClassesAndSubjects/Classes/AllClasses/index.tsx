"use client";

import AlertFill from "@/components/Icons/AlertFill";
import GraduationCapFill from "@/components/Icons/GraduationCapFill";
import { OverviewCard } from "@/components/OverviewCard";
import { useEffect, useState } from "react";
import { AllClassesHeader } from "./AllClassesHeader";
import { AllClassesMainTable } from "./AllClassesMainTable";
import { AllClassesMainTableProps } from "../types";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useGetBranchDetail } from "@/hooks/queryHooks/useBranch";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { usePathname } from "next/navigation";
import { BranchArmReport } from "@/api/types";

const mapStatus = (apiStatus: string): AllClassesMainTableProps["status"] => {
  const map: Record<string, AllClassesMainTableProps["status"]> = {
    APPROVED: "APPROVED",
    PENDING_APPROVAL: "PENDING_APPROVAL",
    NOT_SUBMITTED: "NOT_SUBMITTED",
    EDIT_REQUEST: "EDIT_REQUEST",
  };
  return map[apiStatus] ?? "NOT_SUBMITTED";
};

export const AllClassesMain = () => {
  const user = useLoggedInUser();
  const pathname = usePathname();

  const schoolId = user?.schoolId;
  const branchId = pathname.split('/')[3];

  const { data: termList, isFetching: isLoadingTerms } = useGetTerms(schoolId!);
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);
  const terms = termList?.terms;

  useEffect(() => {
    if (terms?.length && selectedTermId === null) {
      setSelectedTermId(terms[0].termId);
    }
  }, [terms]);

  const { data, isPending: isFetchingBranch, isError } = useGetBranchDetail(Number(branchId)!, selectedTermId!);
  const branchDetail = data?.data?.data;

  const tableData: AllClassesMainTableProps[] =
    branchDetail?.branchArmReportResponseDtos?.map((item: BranchArmReport, index: number) => ({
      id: index + 1,
      classArmName: item.classArmName,
      classTeacherName: item.classTeacherName,
      numberOfSubjects: item.numberOfSubjects,
      numberOfEditRequest: item.numberOfEditRequest > 0 ? `${item.numberOfEditRequest} Pending` : "-",
      status: mapStatus(item.status),
    })) ?? [];

  return (
    <div className="flex flex-col">
      <AllClassesHeader terms={terms ?? []} selectedTermId={selectedTermId} onTermChange={setSelectedTermId} isLoadingTerms={isLoadingTerms} />

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

      <AllClassesMainTable data={tableData} isFetchingBranch={isFetchingBranch} isError={isError} />
    </div>
  );
};
