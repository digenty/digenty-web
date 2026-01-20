"use client";

import { DataTable } from "@/components/DataTable";
import { AddFill } from "@/components/Icons/AddFill";
import Group from "@/components/Icons/Group";
import ListCheck from "@/components/Icons/ListCheck";
import { VipDiamond } from "@/components/Icons/VipDiamond";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { SubscriptionHistoryColumns } from "../Columns";
import { subscriptionHistoryTableData } from "../type";
import { NormalProgressBar } from "@/components/ProgressBar/NormalProgressBar";
import { useRouter } from "next/navigation";

export const SubDetails = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const pageSize = 5;
  return (
    <div className="flex flex-col gap-5 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div className="text-text-default text-xl font-semibold">Subscription</div>
        <Button className="bg-bg-state-soft hover:bg-bg-state-soft-hover! text-text-subtle h-8!">
          <ListCheck fill="var(--color-icon-default-muted)" className="size-3" /> See All Plans
        </Button>
      </div>

      <div className="bg-bg-subtle border-border-default flex w-full flex-col gap-6 rounded-md border p-6 md:w-81">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="text-text-default text-xs font-medium">Main Campus</div>
            <div className="text-text-muted text-xs">Advanced Plan</div>
          </div>
          <Badge className="border-border-default bg-bg-badge-green text-bg-basic-green-strong rounded-md border">Active</Badge>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Group fill="var(--color-icon-default-muted)" />
              <div className="text-text-default text-sm font-medium">Student Capacity</div>
            </div>
            <div className="text-text-muted text-sm">1247 / 2000</div>
          </div>
          <NormalProgressBar max={2000} value={1247} indicatorColor="bg-bg-basic-emerald-accent" trackColor="bg-bg-basic-gray-alpha-10" />
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push("subscription/add-student-to-plan")}
            className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! text-text-subtle h-7! text-xs"
          >
            <AddFill fill="var(--color-icon-default-muted)" />
            Add Students
          </Button>
          <Button className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! text-bg-basic-blue-accent h-7! text-xs">
            <VipDiamond fill="var(--color-icon-informative)" />
            Upgrade Plan
          </Button>
        </div>
      </div>

      <div className="text-text-default mb-9 text-xl font-semibold">Billing History</div>

      <div className="">
        <DataTable
          columns={SubscriptionHistoryColumns}
          data={subscriptionHistoryTableData}
          totalCount={subscriptionHistoryTableData.length}
          page={page}
          setCurrentPage={setPage}
          pageSize={pageSize}
          showPagination={false}
          rowSelection={{}}
          onSelectRows={() => {}}
          setRowSelection={() => {}}
          clickHandler={() => {}}
        />
      </div>
    </div>
  );
};
