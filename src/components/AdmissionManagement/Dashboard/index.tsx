"use client";

import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { Progress4 } from "@/components/Icons/Progress4";
import { OverviewCard } from "@/components/OverviewCard";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetDashboardApplicantsByClass,
  useGetDashboardApplicantsByStatus,
  useGetDashboardOverview,
} from "@/hooks/queryHooks/useAdmission";
import { CashFill, School, UserFill } from "@digenty/icons";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useActiveAdmissionCycle, useAdmissionBranchOptions } from "../hooks";

const ADMITTED_COLOR = "#3B82F6";
const PENDING_COLOR = "#F59E0B";
const REJECTED_COLOR = "#D1D5DB";

interface TooltipEntry {
  name: string;
  value: number;
  fill: string;
}

interface ClassChartTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

const ClassChartTooltip = ({ active, payload, label }: ClassChartTooltipProps) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum, e) => sum + e.value, 0);
  return (
    <div className="border-border-default bg-bg-card rounded-lg border p-3 text-xs shadow-lg">
      <div className="text-text-default mb-1 flex items-center justify-between gap-6 font-bold">
        <span>{label}</span>
        <span>{total}</span>
      </div>
      <hr className="border-border-default mb-2" />
      {payload.map(entry => (
        <div key={entry.name} className="flex items-center justify-between gap-6">
          <span className="text-text-subtle flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-sm" style={{ background: entry.fill }} />
            {entry.name.charAt(0).toUpperCase() + entry.name.slice(1)}
          </span>
          <span className="text-text-muted font-normal">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export const AdmissionDashboard = () => {
  const { cycle, isPending: cyclePending, isError: cycleError, refetch: refetchCycle } = useActiveAdmissionCycle();
  const { options: branchOptions } = useAdmissionBranchOptions();
  const [branchName, setBranchName] = useState("All Branches");

  const branchId = branchOptions.find(b => b.name === branchName)?.id;
  const cycleId = cycle?.id;

  const overviewQuery = useGetDashboardOverview(cycleId, branchId);
  const byClassQuery = useGetDashboardApplicantsByClass(cycleId, branchId);
  const byStatusQuery = useGetDashboardApplicantsByStatus(cycleId, branchId);

  const classChartData = useMemo(
    () => (byClassQuery.data ?? []).map(c => ({ name: c.className, admitted: c.admitted, pending: c.pending, rejected: c.rejected })),
    [byClassQuery.data],
  );

  const statusData = useMemo(() => {
    const s = byStatusQuery.data;
    return [
      { name: "Rejected", value: s?.rejected ?? 0, fill: REJECTED_COLOR },
      { name: "Pending", value: s?.pending ?? 0, fill: PENDING_COLOR },
      { name: "Admitted", value: s?.admitted ?? 0, fill: ADMITTED_COLOR },
    ];
  }, [byStatusQuery.data]);

  const totalApplicants = statusData.reduce((sum, s) => sum + s.value, 0);

  const BranchSelect = () => (
    <Select value={branchName} onValueChange={setBranchName}>
      <SelectTrigger className="border-border-darker bg-bg-state-secondary! h-8 w-fit gap-1.5 border text-sm font-semibold focus-visible:ring-0">
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
  );

  if (cyclePending) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-40" />
        <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  if (cycleError) {
    return (
      <div className="flex justify-center py-16">
        <ErrorComponent
          title="Couldn't load admission overview"
          description="Something went wrong while loading the active admission cycle. Please try again."
          buttonText="Retry"
          onClick={() => refetchCycle()}
        />
      </div>
    );
  }

  if (!cycle) {
    return (
      <div className="border-border-default mx-auto mt-10 flex max-w-md flex-col items-center gap-2 rounded-xl border border-dashed py-16">
        <p className="text-text-default text-sm font-medium">No active admission cycle</p>
        <p className="text-text-muted text-center text-xs">Create and activate an admission cycle from Set Up &amp; Configuration to see the dashboard.</p>
      </div>
    );
  }

  const overview = overviewQuery.data;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-text-default text-xl font-semibold">Overview</h2>
        <BranchSelect />
      </div>

      <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        <OverviewCard
          title="Total Applicants"
          Icon={() => (
            <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <UserFill fill="var(--color-icon-default)" className="" />
            </div>
          )}
          value={overviewQuery.isPending ? "—" : String(overview?.totalApplicants ?? 0)}
        />
        <OverviewCard
          title="Pending Review"
          Icon={() => (
            <div className="bg-bg-basic-yellow-subtle border-bg-basic-yellow-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <Progress4 fill="var(--color-icon-default)" className="" />
            </div>
          )}
          value={overviewQuery.isPending ? "—" : String(overview?.pendingReview ?? 0)}
        />
        <OverviewCard
          title="Admitted"
          Icon={() => (
            <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <UserFill fill="var(--color-icon-default)" className="" />
            </div>
          )}
          value={overviewQuery.isPending ? "—" : String(overview?.admitted ?? 0)}
        />

        <OverviewCard
          title="Revenue"
          Icon={() => (
            <div className="bg-bg-basic-emerald-subtle border-bg-basic-emerald-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <CashFill fill="var(--color-icon-default)" className="" />
            </div>
          )}
          value={overviewQuery.isPending ? "—" : `₦${(overview?.revenue ?? 0).toLocaleString()}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="border-border-default flex flex-col gap-4 rounded-xl border p-4 lg:col-span-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="text-text-default text-sm font-semibold">Applicants by Class</p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 text-xs">
                {[
                  { label: "Admitted", color: ADMITTED_COLOR },
                  { label: "Pending", color: PENDING_COLOR },
                  { label: "Rejected", color: REJECTED_COLOR },
                ].map(({ label, color }) => (
                  <span key={label} className="text-text-subtle flex items-center gap-1">
                    <span className="inline-block size-2.5 rounded-sm" style={{ background: color }} />
                    {label}
                  </span>
                ))}
              </div>
              <BranchSelect />
            </div>
          </div>

          <div className="h-72 w-full min-w-0">
            {byClassQuery.isPending ? (
              <Skeleton className="h-full w-full rounded-lg" />
            ) : classChartData.length === 0 ? (
              <div className="text-text-muted flex h-full items-center justify-center text-sm">No applicant data yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classChartData} barCategoryGap="20%" margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="var(--color-border-default)" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-xs" tick={{ fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} className="text-xs" tick={{ fontSize: 11 }} />
                  <Tooltip content={<ClassChartTooltip />} cursor={{ fill: "transparent" }} />
                  <Bar dataKey="admitted" stackId="a" fill={ADMITTED_COLOR} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="pending" stackId="a" fill={PENDING_COLOR} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="rejected" stackId="a" fill={REJECTED_COLOR} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="border-border-default flex flex-col gap-4 rounded-xl border px-8 py-4 lg:col-span-2">
          <div className="flex flex-col gap-8">
            <p className="text-text-default text-sm font-semibold">Applicants by Status</p>
            <BranchSelect />
          </div>

          <p className="text-text-default text-3xl font-semibold">{byStatusQuery.isPending ? "—" : totalApplicants}</p>

          <div className="h-52 w-full min-w-0">
            {byStatusQuery.isPending ? (
              <Skeleton className="h-full w-full rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    width={65}
                    tick={{ fontSize: 12, fill: "var(--color-text-muted)" }}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--color-bg-state-soft)" }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="border-border-default bg-bg-card rounded-lg border p-2 text-xs shadow-lg">
                          <span className="text-text-default font-medium">{payload[0].name}: </span>
                          <span className="text-text-muted">{payload[0].value as number}</span>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={40}>
                    {statusData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} className="text-text-default" />
                    ))}
                    <LabelList dataKey="value" position="center" style={{ fill: "#000", fontSize: 12, fontWeight: 700 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
