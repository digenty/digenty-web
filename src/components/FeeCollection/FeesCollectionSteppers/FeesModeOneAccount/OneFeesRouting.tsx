"use client";

import { Edit } from "@digenty/icons";
import { Avatar } from "@/components/Avatar";
import { MobileDrawer } from "@/components/MobileDrawer";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/useIsMobile";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import React, { useState } from "react";

import { useGetFeeRoutes, useUpdateFeeRoute } from "@/hooks/queryHooks/useFee";
import { useGetFeeCollectionBankAccounts } from "@/hooks/queryHooks/useFeeCollection";
import { BankAccountInfo } from "@/api/fee-collection";
import { FeeRouteResponseDto } from "@/api/fee";
import { PageEmptyState } from "@/components/Error/PageEmptyState";
import { toast } from "sonner";

// ─── Mock data (commented out — replaced by GET /fee/route) ──────────────────
// const routesFees = [
//   { id: 1, feeName: "Tuition Fee", accNumber: 23234343334, accName: "Damilare John", accLogo: <Gtbank /> },
//   ...
// ];

// ─── Mock data (commented out — replaced by GET /api/fee-collection/accounts) ─
// const routeFee = [
//   { id: 1, bankName: "GTBank", accNumber: 23234343334, accName: "Damilare John", type: "Default", accLogo: <Gtbank /> },
//   ...
// ];

export const OneFeesRouting = () => {
  const [query, setQuery] = useState("");
  const { data: routes = [], isLoading, isError } = useGetFeeRoutes();

  const filtered = routes.filter(r =>
    `${r.feeClassName} ${r.bankAccountName} ${r.bankAccountNumber}`.toLowerCase().includes(query.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-60 items-center justify-center">
        <PageEmptyState
          title="Could not load fee routes"
          description="There was a problem fetching your fee routes. Please try again."
          buttonText="Retry"
          url="/staff/fee-collection/fees-setup"
        />
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

      <SearchInput
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="bg-bg-input-soft! text-text-muted border-none"
        placeholder="Search fees"
      />

      {filtered.length === 0 ? (
        <div className="flex h-60 items-center justify-center">
          <PageEmptyState
            title={routes.length === 0 ? "No Fee Routes" : "No Results"}
            description={
              routes.length === 0
                ? "No fee routes have been set up yet. You can configure them here or skip and do it later."
                : "No fee routes match your search."
            }
            buttonText={routes.length === 0 ? "Set Up Fees" : "Clear Search"}
            url={routes.length === 0 ? "/staff/fees" : undefined}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(route => (
            <div
              className="border-border-default flex items-center justify-between rounded-sm border px-6 py-3"
              key={route.id}
            >
              <div className="flex flex-col gap-1">
                <div className="text-text-default text-md font-medium">{route.feeClassName}</div>
                <div className="text-text-muted flex items-center gap-1 text-xs">
                  {route.bankAccountNumber} — {route.bankAccountName}
                </div>
              </div>
              <RountingSheet route={route} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface RountingSheetProps {
  route: FeeRouteResponseDto;
}

export const RountingSheet = ({ route }: RountingSheetProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const { data: accounts = [], isLoading: loadingAccounts } = useGetFeeCollectionBankAccounts();
  const { mutate: updateRoute, isPending } = useUpdateFeeRoute();

  const handleSave = () => {
    if (!selectedAccountId) return;
    updateRoute(
      { id: route.id, payload: { branchId: 0, bankAccountId: selectedAccountId, feeClassId: route.feeClassId, isDefault: route.isDefault } },
      {
        onSuccess: () => {
          toast.success("Fee route updated");
          setSheetOpen(false);
        },
        onError: (err: unknown) => {
          toast.error((err as { message?: string })?.message ?? "Failed to update route");
        },
      },
    );
  };

  const accountList = (
    <div className="flex flex-col gap-4 p-6">
      <div className="text-text-default text-md font-semibold">{route.feeClassName}</div>

      {loadingAccounts ? (
        <div className="flex justify-center py-4">
          <Spinner className="size-6" />
        </div>
      ) : accounts.length === 0 ? (
        <div className="text-text-muted py-4 text-center text-sm">
          {/* ❌ BACKEND NEEDED: No endpoint to list available bank accounts for routing assignment in initial setup.
              POST /api/fee-collection/setup creates accounts but doesn't return their IDs.
              Need: GET /api/fee-collection/accounts to return accounts after setup completes. */}
          No collection accounts found. Complete fee collection setup first.
        </div>
      ) : (
        accounts.map((acc: BankAccountInfo) => (
          <div
            key={acc.id}
            onClick={() => setSelectedAccountId(acc.id)}
            className={`border-border-darker flex cursor-pointer items-start justify-between rounded-md border p-4 ${selectedAccountId === acc.id ? "border-border-informative border-2" : ""}`}
          >
            <div className="flex items-start gap-2">
              <Avatar className="size-6" />
              <div className="flex flex-col gap-1">
                <div className="text-text-default text-sm font-medium">
                  {acc.accountNumber} — {acc.accountName}
                </div>
                <div className="text-text-subtle text-sm">{acc.bankName}</div>
              </div>
            </div>
            {acc.isDefault && <span className="text-text-default text-sm font-medium">Default</span>}
          </div>
        ))
      )}
    </div>
  );

  const footer = (
    <div className="flex w-full items-center justify-between">
      <SheetClose asChild>
        <Button
          type="button"
          variant="outline"
          className="bg-bg-state-soft! text-text-subtle hover:text-text-subtle! rounde-sm h-7 w-17 border-none px-2 py-1"
        >
          Cancel
        </Button>
      </SheetClose>
      <Button
        type="button"
        disabled={!selectedAccountId || isPending}
        onClick={handleSave}
        className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! flex h-7 items-center gap-1 rounded-sm px-2 py-1 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Route Fee"}
      </Button>
    </div>
  );

  return (
    <div>
      <Button type="button" onClick={() => setSheetOpen(true)} className="hover:bg-bg-none! bg-none!">
        <Edit fill="var(--color-icon-default-subtle)" />
      </Button>

      {!isMobile && (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className="bg-bg-card border-border-default my-4 mr-4 overflow-y-auto rounded-md border md:min-w-130">
            <SheetHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
              <VisuallyHidden />
              <div className="text-text-default text-md font-semibold">Assign account</div>
            </SheetHeader>
            {accountList}
            <SheetFooter className="border-border-default bg-bg-card absolute bottom-0 w-full border-t px-6 pb-8 pt-4">
              {footer}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}

      {isMobile && (
        <MobileDrawer open={sheetOpen} setIsOpen={setSheetOpen} title="Assign account">
          <div className="min-h-[50vh]">{accountList}</div>
          <SheetFooter className="border-border-default bg-bg-card border-t px-4 py-3">{footer}</SheetFooter>
        </MobileDrawer>
      )}
    </div>
  );
};

// ─── MISSING BACKEND ENDPOINT ──────────────────────────────────────────────
// AddFill "New Account" button previously allowed creating routes for fee classes
// that don't have a route yet. This requires:
//   GET /fee/class/routing-list?branchId=X
//   → returns { id: number; name: string }[] of fee class items available for routing
// Without this, we can only edit EXISTING routes (via GET /fee/route → PUT /fee/route/{id}).
// ─────────────────────────────────────────────────────────────────────────────
