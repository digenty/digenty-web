"use client";

import { ClassApplicantSummaryDto } from "@/api/admission";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { PageEmptyState } from "@/components/Error/PageEmptyState";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetApplicantsByClass } from "@/hooks/queryHooks/useAdmission";
import { Eye, School } from "@digenty/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useActiveAdmissionCycle, useAdmissionBranchOptions } from "../hooks";

const ClassCard = ({ summary }: { summary: ClassApplicantSummaryDto }) => {
  const router = useRouter();
  const pct = summary.capacityTotal > 0 ? Math.min(Math.round((summary.capacityUsed / summary.capacityTotal) * 100), 100) : 0;

  return (
    <div className="border-border-default flex flex-col gap-4 rounded-xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-text-default text-base leading-tight font-semibold">{summary.className}</p>
          <p className="text-text-muted text-xs">{summary.branchName}</p>
        </div>
        <Button
          onClick={() => router.push(`/staff/admission-management/${summary.classId}`)}
          className="text-text-subtle bg-bg-state-soft flex h-6 shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium"
        >
          <Eye fill="var(--color-icon-default-subtle)" className="size-3.5 shrink-0" />
          View Class
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-bg-badge-sky flex flex-col items-center gap-1 rounded-lg py-3">
          <span className="text-text-default text-xl leading-none font-semibold">{summary.admittedCount}</span>
          <span className="text-text-muted text-xs">Admitted</span>
        </div>

        <div className="bg-bg-badge-yellow flex flex-col items-center gap-1 rounded-lg py-3">
          <span className="text-text-default text-xl leading-none font-semibold">{summary.pendingCount}</span>
          <span className="text-text-muted text-xs">Pending</span>
        </div>

        <div className="bg-bg-badge-gray flex flex-col items-center gap-1 rounded-lg py-3">
          <span className="text-text-default text-xl leading-none font-semibold">{summary.rejectedCount}</span>
          <span className="text-text-muted text-xs">Rejected</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-text-default text-xs font-semibold">Student Capacity</span>
          <span className="text-text-muted text-xs">
            {summary.capacityUsed.toLocaleString()} / {summary.capacityTotal.toLocaleString()}
          </span>
        </div>
        <div className="bg-bg-state-soft h-1.5 w-full overflow-hidden rounded-full">
          <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
};

export const ProcessApplicants = () => {
  const { cycle, isPending: cyclePending, isError: cycleError, refetch: refetchCycle } = useActiveAdmissionCycle();
  const { options: branchOptions } = useAdmissionBranchOptions();
  const [branchName, setBranchName] = useState("All Branches");

  const branchId = branchOptions.find(b => b.name === branchName)?.id;
  const { data: classes = [], isPending, isError, refetch } = useGetApplicantsByClass(cycle?.id, branchId);

  return (
    <div className="flex flex-col gap-6">
      {cyclePending && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="bg-bg-input-soft h-48 w-full rounded-xl" />
          ))}
        </div>
      )}

      {cycleError && (
        <div className="flex justify-center py-16">
          <ErrorComponent
            title="Couldn't load applicants"
            description="Something went wrong while loading the active cycle. Please try again."
            buttonText="Retry"
            onClick={() => refetchCycle()}
          />
        </div>
      )}

      {!cyclePending && !cycleError && !cycle && (
        <div className="flex justify-center py-16">
          <PageEmptyState
            title="No active admission cycle"
            description="Activate an admission cycle to start processing applicants."
            buttonText="Go to Setup"
            url="/staff/admission-management?tab=setup"
          />
        </div>
      )}

      {!cyclePending && !cycleError && cycle && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-text-default text-xl font-semibold">Process Applicants by Class</h2>

            <Select value={branchName} onValueChange={setBranchName}>
              <SelectTrigger className="border-border-darker bg-bg-state-secondary! h-8 w-auto gap-1.5 border text-sm font-medium focus-visible:ring-0">
                <School fill="var(--color-icon-default-subtle)" className="size-3.5 shrink-0" />
                <span className="text-text-default">{branchName}</span>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                {branchOptions.map(b => (
                  <SelectItem key={b.name} value={b.name} className="text-text-default text-sm font-medium">
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isPending ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <div className="flex justify-center py-12">
              <ErrorComponent
                title="Couldn't load classes"
                description="Something went wrong while fetching applicants by class. Please try again."
                buttonText="Retry"
                onClick={() => refetch()}
              />
            </div>
          ) : classes.length === 0 ? (
            <div className="flex justify-center py-12">
              <PageEmptyState title="No applicants found" description="There are no applicants for the selected branch yet." buttonText="Go to Setup" url="/staff/admission-management?tab=setup" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {classes.map(cls => (
                <ClassCard key={cls.classId} summary={cls} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
