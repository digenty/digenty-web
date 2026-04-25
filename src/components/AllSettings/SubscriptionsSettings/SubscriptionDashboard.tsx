"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/DataTable";
import { AddFill } from "@/components/Icons/AddFill";
import Eye from "@/components/Icons/Eye";
import Download2 from "@/components/Icons/Download2";
import { paymentStatus } from "@/components/Status";
import { BillingHistoryRow, billingStatusLabel, subscriptionStatusLabel } from "./type";
import Group from "@/components/Icons/Group";
import { VipDiamond } from "@/components/Icons/VipDiamond";
import ListCheck from "@/components/Icons/ListCheck";
import { useGetCurrentSubscription, useGetBillingHistory } from "@/hooks/queryHooks/useSubscription";
import { BillingHistoryDto, SubscriptionStatus } from "@/api/subscription";
import { cn, formatDate } from "@/lib/utils";

const PAGE_SIZE = 10;

const STATUS_BADGE_CLASS: Record<SubscriptionStatus, string> = {
  ACTIVE: "bg-bg-badge-green text-bg-basic-green-strong",
  PENDING: "bg-bg-badge-orange text-bg-basic-orange-strong",
  EXPIRED: "bg-bg-badge-red text-bg-basic-red-strong",
  CANCELLED: "bg-bg-badge-red text-bg-basic-red-strong",
};

const toRow = (dto: BillingHistoryDto): BillingHistoryRow => ({
  period: `${formatDate(dto.periodStart)} – ${formatDate(dto.periodEnd)}`,
  plan: dto.planName,
  status: billingStatusLabel[dto.status] ?? dto.status,
  amount: dto.amount,
});

const BillingHistoryMobileCard = ({ row }: { row: BillingHistoryRow }) => (
  <div className="border-border-default bg-bg-default overflow-hidden rounded-lg border">
    <div className="bg-bg-subtle flex items-center justify-between gap-3 px-4 py-3">
      <span className="text-text-default text-sm font-medium">{row.period}</span>
      <button type="button" className="text-text-muted cursor-pointer" aria-label="Actions">
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
    <div className="border-border-default flex items-center justify-between border-t px-4 py-3">
      <span className="text-text-muted text-sm">Plan</span>
      <span className="text-text-default text-sm">{row.plan}</span>
    </div>
    <div className="border-border-default flex items-center justify-between border-t px-4 py-3">
      <span className="text-text-muted text-sm">Status</span>
      {paymentStatus(row.status)}
    </div>
    <div className="border-border-default flex items-center justify-between border-t px-4 py-3">
      <span className="text-text-muted text-sm">Amount</span>
      <span className="text-text-default text-sm">₦{row.amount.toLocaleString()}</span>
    </div>
  </div>
);

const billingColumns: ColumnDef<BillingHistoryRow>[] = [
  {
    accessorKey: "period",
    header: () => <div className="text-text-muted text-sm font-medium">Period</div>,
    cell: ({ row }) => <div className="text-text-default text-sm font-medium">{row.original.period}</div>,
  },
  {
    accessorKey: "plan",
    header: () => <div className="text-text-muted text-sm font-medium">Plan</div>,
    cell: ({ row }) => <div className="text-text-default text-sm">{row.original.plan}</div>,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-text-muted text-sm font-medium">Status</div>,
    cell: ({ row }) => paymentStatus(row.original.status),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-text-muted text-sm font-medium">Amount</div>,
    cell: ({ row }) => <div className="text-text-default text-sm">₦{row.original.amount.toLocaleString()}</div>,
  },
  {
    accessorKey: "actions",
    header: () => <div />,
    cell: () => (
      <div className="flex items-center gap-6">
        <button className="cursor-pointer" aria-label="View">
          <Eye fill="var(--color-icon-default-muted)" />
        </button>
        <button className="cursor-pointer" aria-label="Download">
          <Download2 fill="var(--color-icon-default-muted)" />
        </button>
      </div>
    ),
  },
];

export const SubscriptionDashboard = () => {
  const [page, setPage] = useState(1);

  const { data: subscription, isLoading: isLoadingSubscription } = useGetCurrentSubscription();
  const { data: billing, isLoading: isLoadingBilling } = useGetBillingHistory({ page: page - 1, size: PAGE_SIZE });

  const studentCapacityUsed = subscription?.activeStudentCount ?? 0;
  const studentCapacityTotal = subscription?.studentCapacity ?? 0;
  const percentUsed = studentCapacityTotal > 0 ? Math.min(100, (studentCapacityUsed / studentCapacityTotal) * 100) : 0;

  const billingRows = useMemo(() => billing?.content?.map(toRow) ?? [], [billing]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-text-default text-lg font-semibold sm:text-xl">Subscription</h2>
        <Button
          asChild
          variant="ghost"
          className="bg-bg-state-soft hover:bg-bg-state-soft-hover! text-text-subtle h-8 shrink-0 rounded-md px-2.5! text-sm font-medium"
        >
          <Link href="/staff/settings/subscription/plans">
            <ListCheck fill="var(--color-icon-default-muted)" className="size-3" />
            See All Plans
          </Link>
        </Button>
      </div>

      <div className="bg-bg-subtle border-border-default flex w-full max-w-81 flex-col gap-6 rounded-lg border p-4 sm:p-6">
        {isLoadingSubscription ? (
          <div className="flex flex-col gap-3">
            <div className="bg-bg-state-soft h-4 w-24 animate-pulse rounded" />
            <div className="bg-bg-state-soft h-3 w-40 animate-pulse rounded" />
            <div className="bg-bg-state-soft h-1 w-full animate-pulse rounded-full" />
          </div>
        ) : (
          subscription && (
            <>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="text-text-default text-xs font-medium">Main Campus</p>
                  <Badge
                    className={cn(
                      "border-border-default h-5 rounded-md px-1.5 text-xs font-medium",
                      STATUS_BADGE_CLASS[subscription.status] ?? STATUS_BADGE_CLASS.PENDING,
                    )}
                  >
                    {subscriptionStatusLabel[subscription.status] ?? subscription.status}
                  </Badge>
                </div>
                <p className="text-text-muted text-xs">{subscription.planName} Plan</p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Group fill="var(--color-icon-default-muted)" className="h-4 w-4" />
                    <span className="text-text-default text-sm font-medium">Student Capacity</span>
                  </div>
                  <span className="text-text-muted text-sm">
                    {studentCapacityUsed} / {studentCapacityTotal}
                  </span>
                </div>
                <div className="bg-bg-basic-gray-alpha-10 h-1 w-full overflow-hidden rounded-full">
                  <div className="bg-bg-basic-emerald-accent h-full rounded-full" style={{ width: `${percentUsed}%` }} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  asChild
                  variant="ghost"
                  className="bg-bg-state-soft hover:bg-bg-state-soft-hover! text-text-subtle h-7 flex-1 rounded-md text-xs font-medium"
                >
                  <Link href="/staff/settings/subscription/add-students">
                    <AddFill fill="var(--color-icon-default-subtle)" className="size-3" />
                    Add Students
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="bg-bg-state-soft hover:bg-bg-state-soft-hover! text-text-informative h-7 flex-1 rounded-md text-xs font-medium"
                >
                  <Link href="/staff/settings/subscription/upgrade">
                    <VipDiamond fill="var(--color-icon-informative)" className="h-3.5 w-3.5" />
                    Upgrade Plan
                  </Link>
                </Button>
              </div>
            </>
          )
        )}
      </div>

      <div className="flex flex-col gap-4 sm:gap-6">
        <h3 className="text-text-default text-lg font-semibold sm:text-xl">Billing History</h3>
        <div className="hidden md:block">
          <DataTable
            columns={billingColumns}
            data={billingRows}
            totalCount={billing?.totalElements ?? 0}
            page={page}
            setCurrentPage={setPage}
            pageSize={PAGE_SIZE}
            loadingContent={isLoadingBilling}
            fullBorder={false}
          />
        </div>
        <div className="flex flex-col gap-3 md:hidden">
          {billingRows.length === 0 && !isLoadingBilling ? (
            <p className="text-text-muted text-sm">No billing history yet.</p>
          ) : (
            billingRows.map((row, idx) => <BillingHistoryMobileCard key={`${row.period}-${idx}`} row={row} />)
          )}
        </div>
      </div>
    </div>
  );
};
