"use client";

import AlertFill from "@/components/Icons/AlertFill";
import GraduationCapFill from "@/components/Icons/GraduationCapFill";
import { OverviewCard } from "@/components/OverviewCard";
import React from "react";
import { AllClassesHeader } from "./AllClassesHeader";
import { AllClassesMainTable } from "./AllClassesMainTable";
import { useGetAllClassDetails } from "@/hooks/queryHooks/useClass";
import { useParams, useSearchParams } from "next/navigation";

export const AllClassesMain = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const branchId = Number(params.branchId);
  const termId = searchParams.get("termId");

  const { data: allClassesDetails, isFetching } = useGetAllClassDetails(branchId, Number(termId));
  console.log(allClassesDetails);
  return (
    <div className="flex flex-col">
      <AllClassesHeader />
      <div className="mt-4 grid w-full grid-cols-2 gap-3 px-4 md:px-8 lg:grid-cols-3">
        <OverviewCard
          title="Total Classes"
          Icon={() => (
            <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <GraduationCapFill fill="var(--color-icon-default)" className="" />
            </div>
          )}
          value={allClassesDetails?.totalArms}
        />
        <OverviewCard
          title="Pending Submission"
          Icon={() => (
            <div className="bg-bg-basic-yellow-subtle border-bg-basic-yellow-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <AlertFill fill="var(--color-icon-default)" className="" />
            </div>
          )}
          value={allClassesDetails?.totalPendingSubmissions}
        />
        <OverviewCard
          className="col-span-2 lg:col-auto"
          title="Completed Submission"
          Icon={() => (
            <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <GraduationCapFill fill="var(--color-icon-default)" className="" />
            </div>
          )}
          value={allClassesDetails?.totalCompletedSubmissions}
        />
      </div>

      <AllClassesMainTable allClassesDetails={allClassesDetails?.branchArmReportResponseDtos} isFetching={isFetching} />
    </div>
  );
};
