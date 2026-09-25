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
import React, { useEffect, useState } from "react";

import { useGetFeeItems, useGetFeeRoutes, useUpdateFeeRoute, useCreateFeeRoute } from "@/hooks/queryHooks/useFee";
import { useCreateSubAccount, useGetAllBanks, useGetFeeCollectionBankAccounts } from "@/hooks/queryHooks/useFeeCollection";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { BankAccountInfo } from "@/api/fee-collection";
import { BranchWithClassLevels } from "@/api/types";
import { FeeItemDetail, FeeRouteResponseDto } from "@/api/fee";
import { PageEmptyState } from "@/components/Error/PageEmptyState";
import { toast } from "sonner";
import { AddAccountSheet, PoolAccount } from "../AddAccountSheet";

export const OneFeesRouting = () => {
  const [query, setQuery] = useState("");
  const { data: feeItems = [], isLoading, isError } = useGetFeeItems();
  const { data: routes = [] } = useGetFeeRoutes();
  const { data: branchesData } = useGetBranches();
  const branches: BranchWithClassLevels[] = branchesData?.data ?? [];
  const mainBranchId = branches[0]?.branch?.id ?? 0;

  const getRoute = (feeClassId: number) => routes.find(r => r.feeClassId === feeClassId);

  const filtered = feeItems.filter(item => item.feeName.toLowerCase().includes(query.toLowerCase()));

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
          title="Could not load fees"
          description="There was a problem fetching your fees. Please try again."
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
            title={feeItems.length === 0 ? "No Fees Found" : "No Results"}
            description={
              feeItems.length === 0 ? "No fees have been created yet. Create fees first before setting up routing." : "No fees match your search."
            }
            buttonText={feeItems.length === 0 ? "Create Fees" : "Clear Search"}
            url={feeItems.length === 0 ? "/staff/fees" : undefined}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(item => {
            const route = getRoute(item.feeClassId);
            return (
              <div className="border-border-default flex items-center justify-between rounded-sm border px-6 py-3" key={item.feeItemId}>
                <div className="flex flex-col gap-1">
                  <div className="text-text-default text-md font-medium">{item.feeName}</div>
                  <div className="text-text-muted flex items-center gap-1 text-xs">
                    {route ? `${route.bankAccountNumber} — ${route.bankAccountName}` : "Default account"}
                  </div>
                </div>
                <RoutingSheet feeItem={item} existingRoute={route} branchId={mainBranchId} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface RoutingSheetProps {
  feeItem: FeeItemDetail;
  existingRoute?: FeeRouteResponseDto;
  branchId: number;
}

export const RoutingSheet = ({ feeItem, existingRoute, branchId }: RoutingSheetProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const { data: accounts = [], isLoading: loadingAccounts, refetch: refetchAccounts } = useGetFeeCollectionBankAccounts();
  const { data: bankOptions = [] } = useGetAllBanks();
  const { mutate: updateRoute, isPending: updating } = useUpdateFeeRoute();
  const { mutate: createRoute, isPending: creating } = useCreateFeeRoute();
  const { mutate: addSubAccount, isPending: addingAccount } = useCreateSubAccount();
  const isPending = updating || creating;

  // Pre-select the fee's currently-routed account once the account list has loaded — routes
  // only carry the account's number/name, not its id, so match on account number.
  useEffect(() => {
    if (!existingRoute || accounts.length === 0) return;
    const match = accounts.find(a => a.accountNumber === existingRoute.bankAccountNumber);
    if (match) setSelectedAccountId(match.id);
  }, [existingRoute, accounts]);

  const handleAddAccount = (acc: PoolAccount) => {
    addSubAccount(
      { branchId, bankCode: acc.bankCode, accountNumber: acc.accountNumber, accountName: acc.accountName },
      {
        onSuccess: async () => {
          toast.success("Account added");
          const { data: refreshed = [] } = await refetchAccounts();
          const created = refreshed.find(a => a.accountNumber === acc.accountNumber);
          if (created) setSelectedAccountId(created.id);
        },
        onError: (err: unknown) => {
          toast.error((err as { message?: string })?.message ?? "Failed to add account");
        },
      },
    );
  };

  const handleSave = () => {
    if (!selectedAccountId) return;
    const payload = { branchId, bankAccountId: selectedAccountId, feeClassId: feeItem.feeClassId, isDefault: true };
    if (existingRoute) {
      updateRoute(
        { id: existingRoute.id, payload },
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
    } else {
      createRoute(payload, {
        onSuccess: () => {
          toast.success("Fee route created");
          setSheetOpen(false);
        },
        onError: (err: unknown) => {
          toast.error((err as { message?: string })?.message ?? "Failed to create route");
        },
      });
    }
  };

  const accountList = (
    <div className="flex flex-col gap-4 p-6">
      <div className="text-text-default text-md font-semibold">{feeItem.feeName}</div>

      {loadingAccounts ? (
        <div className="flex justify-center py-4">
          <Spinner className="size-6" />
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

      {!loadingAccounts && <AddAccountSheet bankOptions={bankOptions} onAdd={handleAddAccount} isPending={addingAccount} />}
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
            <SheetFooter className="border-border-default bg-bg-card absolute bottom-0 w-full border-t px-6 pt-4 pb-8">{footer}</SheetFooter>
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
