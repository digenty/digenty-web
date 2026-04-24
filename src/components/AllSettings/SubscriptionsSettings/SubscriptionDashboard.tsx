"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/DataTable";
import { ListCheck3 } from "@/components/Icons/ListCheck3";
import Wallet from "@/components/Icons/Wallet";
import { User3 } from "@/components/Icons/User3";
import { AddFill } from "@/components/Icons/AddFill";
import Eye from "@/components/Icons/Eye";
import Download2 from "@/components/Icons/Download2";
import { paymentStatus } from "@/components/Status";
import { billingHistoryData, BillingHistoryRow, SubscriptionView } from "./type";
import Group from "@/components/Icons/Group";
import { VipDiamond } from "@/components/Icons/VipDiamond";
import ListCheck from "@/components/Icons/ListCheck";

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

interface SubscriptionDashboardProps {
  onViewChange: (view: SubscriptionView) => void;
}

const STUDENT_CAPACITY_USED = 1247;
const STUDENT_CAPACITY_TOTAL = 2000;

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

export const SubscriptionDashboard = ({ onViewChange }: SubscriptionDashboardProps) => {
  const percentUsed = Math.min(100, (STUDENT_CAPACITY_USED / STUDENT_CAPACITY_TOTAL) * 100);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-text-default text-lg font-semibold sm:text-xl">Subscription</h2>
        <Button
          variant="ghost"
          onClick={() => onViewChange("plans")}
          className="bg-bg-state-soft hover:bg-bg-state-soft-hover! text-text-subtle h-8 shrink-0 rounded-md px-2.5! text-sm font-medium"
        >
          <ListCheck fill="var(--color-icon-default-muted)" className="size-3" />
          See All Plans
        </Button>
      </div>

      <div className="bg-bg-subtle border-border-default flex w-full max-w-81 flex-col gap-6 rounded-lg border p-4 sm:p-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-text-default text-xs font-medium">Main Campus</p>
            <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default h-5 rounded-md px-1.5 text-xs font-medium">
              Active
            </Badge>
          </div>
          <p className="text-text-muted text-xs">Advanced Plan</p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Group fill="var(--color-icon-default-muted)" className="h-4 w-4" />
              <span className="text-text-default text-sm font-medium">Student Capacity</span>
            </div>
            <span className="text-text-muted text-sm">
              {STUDENT_CAPACITY_USED} / {STUDENT_CAPACITY_TOTAL}
            </span>
          </div>
          <div className="bg-bg-basic-gray-alpha-10 h-1 w-full overflow-hidden rounded-full">
            <div className="bg-bg-basic-emerald-accent h-full rounded-full" style={{ width: `${percentUsed}%` }} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => onViewChange("add-students")}
            className="bg-bg-state-soft hover:bg-bg-state-soft-hover! text-text-subtle h-7 flex-1 rounded-md text-xs font-medium"
          >
            <AddFill fill="var(--color-icon-default-subtle)" className="size-3" />
            Add Students
          </Button>
          <Button
            variant="ghost"
            onClick={() => onViewChange("upgrade")}
            className="bg-bg-state-soft hover:bg-bg-state-soft-hover! text-text-informative h-7 flex-1 rounded-md text-xs font-medium"
          >
            <VipDiamond fill="var(--color-icon-informative)" className="h-3.5 w-3.5" />
            Upgrade Plan
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:gap-6">
        <h3 className="text-text-default text-lg font-semibold sm:text-xl">Billing History</h3>
        <div className="hidden md:block">
          <DataTable
            columns={billingColumns}
            data={billingHistoryData}
            totalCount={billingHistoryData.length}
            page={1}
            setCurrentPage={() => {}}
            pageSize={50}
            showPagination={false}
            fullBorder={false}
          />
        </div>
        <div className="flex flex-col gap-3 md:hidden">
          {billingHistoryData.map((row, idx) => (
            <BillingHistoryMobileCard key={`${row.period}-${idx}`} row={row} />
          ))}
        </div>
      </div>
    </div>
  );
};
