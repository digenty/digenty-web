"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/DataTable";
import { SubscriptionHistoryColumns } from "./Columns";
import { subscriptionHistoryTableData, SubscriptionView } from "./type";
import { ListCheck3 } from "@/components/Icons/ListCheck3";
import Wallet from "@/components/Icons/Wallet";
import { UsersIcon } from "lucide-react";

interface SubscriptionDashboardProps {
  onViewChange: (view: SubscriptionView) => void;
}

export const SubscriptionDashboard = ({ onViewChange }: SubscriptionDashboardProps) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-text-default text-xl font-bold">Subscription</h2>
        <Button
          variant="outline"
          onClick={() => onViewChange("plans")}
          className="border-border-default hover:bg-bg-subtle flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium"
        >
          <ListCheck3 className="h-4 w-4" />
          See All Plans
        </Button>
      </div>

      <div className="border-border-default w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-text-default text-sm font-bold">Main Campus</h3>
            <p className="text-text-subtle text-xs">Advanced Plan</p>
          </div>
          <Badge className="bg-bg-badge-green text-text-success rounded-md border-none px-2 py-0.5 text-xs font-semibold uppercase">Active</Badge>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-text-default flex items-center gap-2 text-sm font-medium">
              <UsersIcon className="h-4 w-4 text-zinc-400" />
              Student Capacity
            </div>
            <span className="text-text-subtle text-sm">1247 / 2000</span>
          </div>
          <div className="bg-bg-muted h-1.5 w-full overflow-hidden rounded-full font-bold">
            <div className="h-full bg-green-500" style={{ width: `${(1247 / 2000) * 100}%` }}></div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => onViewChange("add-students")}
            className="bg-bg-muted text-text-dark-default h-9 flex-1 rounded-md text-sm font-bold hover:bg-zinc-200"
          >
            + Add Students
          </Button>
          <Button
            onClick={() => onViewChange("upgrade")}
            className="border-border-informative text-color-informative h-9 flex-1 gap-2 rounded-md border bg-transparent text-sm font-bold hover:bg-blue-50"
          >
            <Wallet fill="var(--color-icon-informative)" />
            Upgrade Plan
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-text-default mb-6 text-xl font-bold">Billing History</h3>
        <DataTable
          columns={SubscriptionHistoryColumns}
          data={subscriptionHistoryTableData}
          totalCount={subscriptionHistoryTableData.length}
          page={1}
          setCurrentPage={() => {}}
          pageSize={50}
          showPagination={false}
          fullBorder={false}
        />
      </div>
    </div>
  );
};
