"use client";

import { AddFill } from "@digenty/icons";
import { Avatar } from "@/components/Avatar";
import { MobileDrawer } from "@/components/MobileDrawer";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";

import { BankOption } from "@/api/fee-collection";
import { useGetAccountDetails } from "@/hooks/queryHooks/useFeeCollection";
import { PermissionCheck } from "@/components/ModulePermissionsWrapper/PermissionCheck";
import { canManageFeeCollection } from "@/lib/permissions/fee-collection";

export type PoolAccount = {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
};

interface AddAccountSheetProps {
  bankOptions: BankOption[];
  onAdd: (acc: PoolAccount) => void;
  isPending?: boolean;
  triggerLabel?: string;
}

export const AddAccountSheet = ({ bankOptions, onAdd, isPending = false, triggerLabel = "Add new account" }: AddAccountSheetProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [bankCode, setBankCode] = useState("");
  const [bankSearch, setBankSearch] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const isMobile = useIsMobile();
  const {
    mutate: lookupAccount,
    data: accountNameData,
    isPending: isLoadingName,
    isError: isLookupError,
    reset: resetLookup,
  } = useGetAccountDetails();

  const filteredBanks = bankOptions.filter(b => b.name.toLowerCase().includes(bankSearch.toLowerCase()));
  const bankName = bankOptions.find(b => b.code === bankCode)?.name ?? "";
  const canSave = !!bankCode && accountNumber.length === 10 && !!accountNameData?.accountName;

  useEffect(() => {
    if (bankCode && accountNumber.length === 10) {
      lookupAccount({ accountNumber, bankCode });
    } else {
      resetLookup();
    }
  }, [bankCode, accountNumber, lookupAccount, resetLookup]);

  const handleSave = () => {
    if (!canSave) return;
    onAdd({ bankCode, bankName, accountNumber, accountName: accountNameData!.accountName });
    setBankCode("");
    setBankSearch("");
    setAccountNumber("");
    resetLookup();
    setSheetOpen(false);
  };

  const form = (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <Label className="text-text-default mb-2 block text-sm font-medium">Bank Name</Label>
        <Select
          value={bankCode}
          onValueChange={val => {
            setBankCode(val);
            setBankSearch("");
          }}
        >
          <SelectTrigger className="bg-bg-input-soft! hover:bg-bg-input-soft! text-text-default w-full rounded-md border-none">
            <SelectValue placeholder="Select Bank" />
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default text-text-default border">
            <div className="border-border-default border-b">
              <SearchInput className="w-full rounded-md border-none" value={bankSearch} onChange={e => setBankSearch(e.target.value)} />
            </div>
            <SelectGroup>
              {filteredBanks.map(b => (
                <SelectItem key={b.slug} value={b.code}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-text-default text-sm font-medium">Account Number</Label>
        <Input
          value={accountNumber}
          onChange={e => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
          inputMode="numeric"
          maxLength={10}
          className="bg-bg-input-soft! text-text-muted w-full rounded-md border-none"
          placeholder="Enter 10-digit account number"
        />
        {bankCode && accountNumber.length === 10 && (
          <div className="bg-bg-input-soft mt-2 flex w-full items-center gap-2 rounded-md p-2">
            {isLoadingName ? (
              <span className="text-text-muted text-xs">Verifying account…</span>
            ) : accountNameData?.accountName ? (
              <>
                <Avatar className="size-4" />
                <span className="text-text-default text-xs font-medium">{accountNameData.accountName}</span>
              </>
            ) : isLookupError ? (
              <div className="flex w-full items-center justify-between">
                <span className="text-text-destructive text-xs">Couldn&apos;t verify account. Please try again.</span>
                <button
                  type="button"
                  onClick={() => lookupAccount({ accountNumber, bankCode })}
                  className="text-text-informative text-xs font-medium underline"
                >
                  Retry
                </button>
              </div>
            ) : (
              <span className="text-text-destructive text-xs">Account not found</span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const footer = (isMobileLayout: boolean) => (
    <div className={`flex w-full items-center justify-between ${isMobileLayout ? "" : "pb-8"}`}>
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
        disabled={!canSave || isPending}
        onClick={handleSave}
        className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! flex h-7 items-center gap-1 rounded-sm px-2 py-1 disabled:opacity-50"
      >
        {isPending ? "Adding..." : "Add Account"}
      </Button>
    </div>
  );

  return (
    <div>
      <PermissionCheck permissionUtility={canManageFeeCollection}>
        <div
          onClick={() => setSheetOpen(true)}
          role="button"
          className="hover:bg-bg-input-soft border-border-default text-text-default flex cursor-pointer items-center justify-center gap-1.5 border-t py-2 text-sm"
        >
          <AddFill fill="var(--color-icon-default-muted)" className="size-4" /> {triggerLabel}
        </div>
      </PermissionCheck>

      {!isMobile && (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className="bg-bg-card border-border-default my-4 mr-4 overflow-y-auto rounded-md border md:min-w-130">
            <SheetHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
              <div className="text-text-default text-md font-semibold">Add New Account</div>
            </SheetHeader>
            {form}
            <SheetFooter className="border-border-default bg-bg-card absolute bottom-0 w-full border-t px-6 py-4">{footer(false)}</SheetFooter>
          </SheetContent>
        </Sheet>
      )}

      {isMobile && (
        <MobileDrawer open={sheetOpen} setIsOpen={setSheetOpen} title="Add New Account">
          {form}
          <SheetFooter className="border-border-default bg-bg-card border-t px-4 py-3">{footer(true)}</SheetFooter>
        </MobileDrawer>
      )}
    </div>
  );
};
