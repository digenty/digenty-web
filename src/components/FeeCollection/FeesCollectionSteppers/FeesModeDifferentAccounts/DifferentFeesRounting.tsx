"use client";

import { SearchInput } from "@/components/SearchInput";
import { Tabs } from "@/components/Tabs";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { PageEmptyState } from "@/components/Error/PageEmptyState";
import React, { useState } from "react";

import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetFeeItems, useGetFeeRoutesByBranch } from "@/hooks/queryHooks/useFee";
import { BranchWithClassLevels } from "@/api/types";
import { FeeItemDetail, FeeRouteResponseDto } from "@/api/fee";
import { RoutingSheet } from "../FeesModeOneAccount/OneFeesRouting";

export const DifferentFeesRounting = () => {
  const { data: branchesData, isLoading } = useGetBranches();
  const branches: BranchWithClassLevels[] = branchesData?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-text-default mb-2 text-lg font-semibold">Route fees</div>
        <div className="text-text-muted text-sm font-normal">
          By default, all fees go to the school&apos;s collection account. Only choose a fee if it should be collected separately.
        </div>
      </div>

      {branches.length === 0 ? (
        <div className="flex h-60 items-center justify-center">
          <PageEmptyState
            title="No Branches Found"
            description="You need at least one branch to configure fee routing per branch."
            buttonText="Go to Settings"
            url="/staff/settings/academic"
          />
        </div>
      ) : (
        <Tabs
          className="w-fit"
          items={branches.map(({ branch }) => ({
            label: branch.name ?? "Branch",
            content: <BranchFeeRouting branchId={branch.id} />,
          }))}
        />
      )}
    </div>
  );
};

interface BranchFeeRoutingProps {
  branchId: number;
}

export const BranchFeeRouting = ({ branchId }: BranchFeeRoutingProps) => {
  const [query, setQuery] = useState("");
  const { data: feeItems = [], isLoading } = useGetFeeItems({ branchId });
  const { data: routes = [] } = useGetFeeRoutesByBranch(branchId);

  const getRoute = (feeClassId: number): FeeRouteResponseDto | undefined => routes.find(r => r.feeClassId === feeClassId);

  const filtered = feeItems.filter((item: FeeItemDetail) => item.feeName.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="mt-6 flex flex-col gap-4">
      <SearchInput
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="bg-bg-input-soft! text-text-muted border-none"
        placeholder="Search fees"
      />

      {isLoading && <Skeleton className="bg-bg-input-soft h-80 w-full" />}

      {!isLoading && (
        <>
          {filtered.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filtered.map((item: FeeItemDetail) => {
                const route = getRoute(item.feeClassId);
                return (
                  <div className="border-border-default flex items-center justify-between rounded-sm border px-6 py-3" key={item.feeItemId}>
                    <div className="flex flex-col gap-1">
                      <div className="text-text-default text-md font-medium">{item.feeName}</div>
                      <div className="text-text-muted flex items-center gap-1 text-xs">
                        {route ? `${route.bankAccountNumber} — ${route.bankAccountName}` : "Default account"}
                      </div>
                    </div>
                    <RoutingSheet feeItem={item} existingRoute={route} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-60 items-center justify-center">
              <PageEmptyState
                title={feeItems.length === 0 ? "No Fees Found" : "No Results"}
                description={
                  feeItems.length === 0
                    ? "No fees have been created yet for this branch. Create fees first before setting up routing."
                    : "No fees match your search."
                }
                buttonText={feeItems.length === 0 ? "Create Fees" : "Clear Search"}
                url={feeItems.length === 0 ? "/staff/fees" : undefined}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
