"use client";

import { AlertFill, IndeterminateCircleFill, Store3 } from "@digenty/icons";
import React, { useMemo, useState } from "react";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { OverviewCard } from "../OverviewCard";
import { StockHeader } from "./StockHeader";
import { StockOverviewTable } from "./StockOverviewTable";
import { StocksSearchAndFilter } from "./StocksSearchAndFilter";
import { StockStatus } from "@/api/stock";
import { useGetStockByStatus } from "@/hooks/queryHooks/useStock";

export const StockMain = () => {
  const user = useLoggedInUser();
  const defaultBranchId = useMemo(() => user.branchIds?.[0], [user.branchIds]);

  const [branchId, setBranchId] = useState<number | undefined>(undefined);
  const effectiveBranchId = branchId ?? defaultBranchId;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StockStatus | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>(undefined);

  const { data: inStockData } = useGetStockByStatus("IN_STOCK");
  const { data: lowStockData } = useGetStockByStatus("LOW_STOCK");
  const { data: outOfStockData } = useGetStockByStatus("OUT_OF_STOCK");

  const inStockCount = Array.isArray(inStockData?.content) ? inStockData.content.length : (inStockData?.totalElements ?? 0);
  const lowStockCount = Array.isArray(lowStockData?.content) ? lowStockData.content.length : (lowStockData?.totalElements ?? 0);
  const outOfStockCount = Array.isArray(outOfStockData?.content) ? outOfStockData.content.length : (outOfStockData?.totalElements ?? 0);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <StockHeader branchId={effectiveBranchId} setBranchId={setBranchId} />

      <div className="grid w-full grid-cols-2 gap-3 lg:grid-cols-3">
        <div>
          <OverviewCard
            title="Total Items"
            Icon={() => (
              <div className="bg-bg-basic-rose-subtle border-bg-basic-rose-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                <Store3 fill="var(--color-icon-default)" />
              </div>
            )}
            value={String(inStockCount + lowStockCount + outOfStockCount)}
          />
        </div>

        <div>
          <OverviewCard
            title="Low Stock Items"
            Icon={() => (
              <div className="bg-bg-basic-pink-subtle border-bg-basic-pink-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                <AlertFill fill="var(--color-icon-default)" />
              </div>
            )}
            value={String(lowStockCount)}
          />
        </div>

        <div className="col-span-2 lg:col-span-1">
          <OverviewCard
            title="Out of Stock Items"
            Icon={() => (
              <div className="bg-bg-basic-fuchsia-subtle border-bg-basic-fuchsia-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                <IndeterminateCircleFill fill="var(--color-icon-default)" />
              </div>
            )}
            value={String(outOfStockCount)}
          />
        </div>
      </div>

      <StocksSearchAndFilter
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      <StockOverviewTable branchId={effectiveBranchId} search={search} statusFilter={statusFilter} categoryFilter={categoryFilter} />
    </div>
  );
};
