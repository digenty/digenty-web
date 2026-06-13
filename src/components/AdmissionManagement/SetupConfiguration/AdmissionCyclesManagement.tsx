"use client";

import { CycleResponse } from "@/api/admission";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { PageEmptyState } from "@/components/Error/PageEmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAdmissionCycles } from "@/hooks/queryHooks/useAdmission";
import { cn } from "@/lib/utils";
import { useBreadcrumbStore } from "@/store/breadcrumb";
import { FileList3, Settings4 } from "@digenty/icons";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CreateCycleModal } from "./CreateCycleModal";
import { useState } from "react";

const formatSessionDates = (cycle: CycleResponse) => {
  const fmt = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  };
  if (!cycle.startDate && !cycle.endDate) return "—";
  return `${fmt(cycle.startDate)} - ${fmt(cycle.endDate)}`;
};

export const AdmissionCyclesManagement = () => {
  const { setBreadcrumbs } = useBreadcrumbStore();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: cycles = [], isPending, isError, refetch } = useGetAdmissionCycles();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Admission Management", url: "/staff/admission-management" },
      { label: "Set Up & Configuration" },
    ]);
  }, [setBreadcrumbs]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-text-default text-xl font-semibold">Admission Cycles Management</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium"
        >
          + Create New Cycle
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-text-default text-sm font-semibold">All Admission Cycles</h3>

        {isPending && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="bg-bg-input-soft h-12 w-full rounded-md" />
            ))}
          </div>
        )}

        {isError && (
          <div className="flex justify-center py-16">
            <ErrorComponent
              title="Couldn't load admission cycles"
              description="Something went wrong while fetching your admission cycles. Please try again."
              buttonText="Retry"
              onClick={() => refetch()}
            />
          </div>
        )}

        {!isPending && !isError && cycles.length === 0 && (
          <div className="flex justify-center py-16">
            <PageEmptyState
              title="No admission cycles yet"
              description="Create your first admission cycle to start configuring requirements."
              buttonText="Create Cycle"
            />
          </div>
        )}

        {!isPending && !isError && cycles.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow className="border-border-default hover:bg-transparent!">
                <TableHead className="text-text-muted text-xs font-medium">Cycle Name</TableHead>
                <TableHead className="text-text-muted text-xs font-medium">Session Dates</TableHead>
                <TableHead className="text-text-muted text-xs font-medium">Status</TableHead>
                <TableHead className="text-text-muted text-right text-xs font-medium" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {cycles.map(cycle => (
                <TableRow key={cycle.id} className="border-border-default hover:bg-bg-subtle!">
                  <TableCell className="text-text-default py-4 text-sm font-medium">{cycle.name}</TableCell>
                  <TableCell className="text-text-muted py-4 text-sm">{formatSessionDates(cycle)}</TableCell>
                  <TableCell className="py-4">
                    <span
                      className={cn(
                        "inline-flex w-fit items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
                        cycle.status === "ACTIVE" ? "bg-bg-badge-green text-bg-basic-green-strong" : "bg-bg-state-soft text-text-muted",
                      )}
                    >
                      <span className={cn("size-1.5 shrink-0 rounded-full", cycle.status === "ACTIVE" ? "bg-green-500" : "bg-icon-default-muted")} />
                      {cycle.status === "ACTIVE" ? "Active" : "Closed"}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    {cycle.status === "ACTIVE" ? (
                      <Button
                        onClick={() => router.push(`/staff/admission-management/setup/${cycle.id}`)}
                        className="border-border-darker bg-bg-state-secondary! text-text-default hover:bg-bg-state-secondary-hover! ml-auto flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium"
                      >
                        <Settings4 fill="var(--color-icon-default-subtle)" className="size-3.5 shrink-0" />
                        Configure
                      </Button>
                    ) : (
                      <Button
                        onClick={() => router.push(`/staff/admission-management/setup/${cycle.id}`)}
                        className="border-border-darker bg-bg-state-secondary! text-text-default hover:bg-bg-state-secondary-hover! ml-auto flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium"
                      >
                        <FileList3 fill="var(--color-icon-default-subtle)" className="size-3.5 shrink-0" />
                        See Report
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <CreateCycleModal open={isModalOpen} setOpen={setIsModalOpen} />
    </div>
  );
};
