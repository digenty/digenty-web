"use client";

import React from "react";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { SubscriptionPlanProps, subscriptionTableData } from "./type";
import { Check } from "@/components/Icons/Check";
import { Badge } from "@/components/ui/badge";

const renderFeatureValue = (value: boolean | string | undefined) => {
  if (value === true) {
    return (
      <span className="text-text-default flex items-center gap-2 text-sm">
        <Check fill="var(--color-icon-default)" className="h-4 w-4" /> Included
      </span>
    );
  }

  if (value === false) {
    return <span className="text-text-default text-lg">×</span>;
  }

  if (value === "Unlimited") {
    return <Badge className="bg-bg-badge-default text-text-subtle border-border-default w-fit rounded-md border px-2 py-0">Unlimited</Badge>;
  }

  return <span className="text-text-default">{value}</span>;
};

const comparisonColumns: ColumnDef<SubscriptionPlanProps>[] = [
  {
    accessorKey: "feature",
    header: () => <div className="text-text-default text-sm font-medium">Feature</div>,
    cell: ({ row }) => <div className="text-text-default py-2 text-sm font-medium">{row.original.feature}</div>,
  },
  {
    accessorKey: "standard",
    header: () => <div className="text-text-default text-sm font-medium">Standard</div>,
    cell: ({ row }) => renderFeatureValue(row.original.standard),
  },
  {
    accessorKey: "advanced",
    header: () => <div className="text-text-default text-sm font-medium">Advanced</div>,
    cell: ({ row }) => renderFeatureValue(row.original.advanced),
  },
];

export const ComparisonTable = () => {
  return (
    <div className="mt-12">
      <DataTable
        columns={comparisonColumns}
        data={subscriptionTableData}
        totalCount={subscriptionTableData.length}
        page={1}
        setCurrentPage={() => {}}
        pageSize={100}
        showPagination={false}
        fullBorder={false}
      />
    </div>
  );
};
