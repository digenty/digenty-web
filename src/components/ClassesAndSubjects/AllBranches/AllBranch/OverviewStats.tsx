"use client";

import { AllBranchesReport } from "@/api/types";
import AlertFill from "@/components/Icons/AlertFill";
import { BuildingFill } from "@/components/Icons/BuildingFill";
import CheckboxCircleFill from "@/components/Icons/CheckboxCircleFill";
import GraduationCapFill from "@/components/Icons/GraduationCapFill";
import { RocketFill } from "@/components/Icons/RocketFill";
import { OverviewCard } from "@/components/OverviewCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllBranchesDetails } from "@/hooks/queryHooks/useBranch";
import React from "react";

export const OverviewStats = ({ loadingStats, stats }: { loadingStats: boolean; stats: AllBranchesReport }) => {
  if (loadingStats) {
    return (
      <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <Skeleton className="bg-bg-input-soft h-30 w-full" />
        <Skeleton className="bg-bg-input-soft h-30 w-full" />
        <Skeleton className="bg-bg-input-soft h-30 w-full" />
        <Skeleton className="bg-bg-input-soft h-30 w-full" />
        <Skeleton className="bg-bg-input-soft h-30 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <OverviewCard
          title="Total Branches"
          Icon={() => (
            <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <BuildingFill fill="var(--color-icon-default)" className="" />
            </div>
          )}
          value={`${stats?.totalBranchesInSchool || 0}`}
        />
        <OverviewCard
          title="Total Classes"
          Icon={() => (
            <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <GraduationCapFill fill="var(--color-icon-default)" className="size-[10px]" />
            </div>
          )}
          value={`${stats?.totalArmsInSchool || 0}`}
        />
        <OverviewCard
          title="Pending Submission"
          Icon={() => (
            <div className="bg-bg-basic-yellow-subtle border-bg-basic-yellow-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <AlertFill fill="var(--color-icon-default)" className="size-[10px]" />
            </div>
          )}
          value={`${stats?.totalPendingArmSubmission || 0}`}
        />

        <OverviewCard
          title="Completed Submission"
          Icon={() => (
            <div className="bg-bg-basic-emerald-subtle border-bg-basic-emerald-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <CheckboxCircleFill fill="var(--color-icon-default)" className="size-[10px]" />
            </div>
          )}
          value={`${stats?.totalArmSubmitted || 0}`}
        />
        <OverviewCard
          title="Published Reports"
          Icon={() => (
            <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <RocketFill fill="var(--color-icon-default)" className="size-[10px]" />
            </div>
          )}
          value={`${stats?.totalPublishedReport || 0}`}
        />
      </div>
    </div>
  );
};
