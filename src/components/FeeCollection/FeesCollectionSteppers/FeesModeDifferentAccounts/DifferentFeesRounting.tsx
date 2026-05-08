"use client";

import { Edit } from "@digenty/icons";
import { SearchInput } from "@/components/SearchInput";
import { Tabs } from "@/components/Tabs";
import { Spinner } from "@/components/ui/spinner";
import React, { useState } from "react";

import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetFeeRoutesByBranch } from "@/hooks/queryHooks/useFee";
import { BranchWithClassLevels } from "@/api/types";
import { FeeRouteResponseDto } from "@/api/fee";
import { Skeleton } from "@/components/ui/skeleton";
import { PageEmptyState } from "@/components/Error/PageEmptyState";

// ─── Mock data (commented out — replaced by GET /fee/route/branch/{branchId}) ─
// const routesFees = [
//   { id: 1, feeName: "Tuition Fee", accNumber: 23234343334, accName: "Damilare John", accLogo: <Gtbank /> },
//   ...
// ];

// ─── Hardcoded branch tabs (commented out — replaced by useGetBranches) ──────
// items={[
//   { label: "Ilasamaja", content: <BranchFeeRouting /> },
//   { label: "Lawanson", content: <BranchFeeRouting /> },
// ]}

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
  const { data: routes = [], isLoading } = useGetFeeRoutesByBranch(branchId);

  const filtered = routes.filter((r: FeeRouteResponseDto) => `${r.feeClassName} ${r.bankAccountName}`.toLowerCase().includes(query.toLowerCase()));

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
              {filtered.map((route: FeeRouteResponseDto) => (
                <div className="border-border-default flex items-center justify-between rounded-sm border px-6 py-3" key={route.id}>
                  <div className="flex flex-col gap-1">
                    <div className="text-text-default text-md font-medium">{route.feeClassName}</div>
                    <div className="text-text-muted flex items-center gap-1 text-xs">
                      {route.bankAccountNumber} — {route.bankAccountName}
                    </div>
                  </div>
                  <Edit fill="var(--color-icon-default-subtle)" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-60 items-center justify-center">
              <PageEmptyState
                title={routes.length === 0 ? "No Fee Routes" : "No Results"}
                description={
                  routes.length === 0
                    ? "No fee routes have been set up for this branch yet."
                    : "No fee routes match your search."
                }
                buttonText={routes.length === 0 ? "Set Up Fees" : "Clear Search"}
                url={routes.length === 0 ? "/staff/fees" : undefined}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── MISSING BACKEND ENDPOINT ──────────────────────────────────────────────
// "New Account" / "Add Fee" routing for unrouted fee classes requires:
//   GET /fee/class/routing-list?branchId=X
//   → returns { id: number; name: string }[] of fee class items available to route
// Without this we can only display existing routes from GET /fee/route/branch/{branchId}.
// ─────────────────────────────────────────────────────────────────────────────
