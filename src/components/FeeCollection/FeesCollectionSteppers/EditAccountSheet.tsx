"use client";

import React, { useEffect, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { MobileDrawer } from "@/components/MobileDrawer";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useGetAllBanks } from "@/hooks/queryHooks/useFeeCollection";

interface AccountDraft {
  bankCode: string;
  bankName: string;
  accountNumber: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  initial: AccountDraft;
  onSave: (updated: AccountDraft) => void;
  title?: string;
}

export const EditAccountSheet = ({ open, onClose, initial, onSave, title = "Edit Account" }: Props) => {
  const isMobile = useIsMobile();
  const [bankCode, setBankCode] = useState(initial.bankCode);
  const [bankSearch, setBankSearch] = useState("");
  const [accountNumber, setAccountNumber] = useState(initial.accountNumber);
  const { data: bankOptions = [] } = useGetAllBanks();

  const filteredBanks = bankOptions.filter(b => b.name.toLowerCase().includes(bankSearch.toLowerCase()));

  // Sync when the sheet is opened for a different account
  useEffect(() => {
    if (open) {
      setBankCode(initial.bankCode);
      setBankSearch("");
      setAccountNumber(initial.accountNumber);
    }
  }, [open, initial.bankCode, initial.accountNumber]);

  const bankName = bankOptions.find(b => b.code === bankCode)?.name ?? initial.bankName;
  const canSave = !!bankCode && accountNumber.length === 10;

  const handleSave = () => {
    if (!canSave) return;
    onSave({ bankCode, bankName, accountNumber });
    onClose();
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
        {accountNumber.length === 10 && (
          <div className="bg-bg-input-soft flex w-full items-center gap-2 rounded-md p-2">
            <Avatar className="size-4" />
            <span className="text-text-default text-sm font-medium">Account holder name</span>
          </div>
        )}
      </div>
    </div>
  );

  const footer = (
    <div className="flex w-full items-center justify-between">
      <SheetClose asChild>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="bg-bg-state-soft! text-text-subtle hover:text-text-subtle! rounde-sm h-7 w-17 border-none px-2 py-1"
        >
          Cancel
        </Button>
      </SheetClose>
      <Button
        type="button"
        disabled={!canSave}
        onClick={handleSave}
        className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! flex h-7 items-center gap-1 rounded-sm px-2 py-1 disabled:opacity-50"
      >
        Save
      </Button>
    </div>
  );

  if (!isMobile) {
    return (
      <Sheet open={open} onOpenChange={v => !v && onClose()}>
        <SheetContent className="bg-bg-card border-border-default my-4 mr-4 overflow-y-auto rounded-md border md:min-w-130">
          <SheetHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
            <div className="text-text-default text-md font-semibold">{title}</div>
          </SheetHeader>
          {form}
          <SheetFooter className="border-border-default bg-bg-card absolute bottom-0 w-full border-t px-6 pb-8 pt-4">
            {footer}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <MobileDrawer open={open} setIsOpen={v => !v && onClose()} title={title}>
      {form}
      <SheetFooter className="border-border-default bg-bg-card border-t px-4 py-3">{footer}</SheetFooter>
    </MobileDrawer>
  );
};
