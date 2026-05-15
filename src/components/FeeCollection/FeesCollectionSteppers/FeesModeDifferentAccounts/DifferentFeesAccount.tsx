"use client";

import { AddFill, ArrowDownS, QuickReferenceAll } from "@digenty/icons";
import { Avatar } from "@/components/Avatar";
import { MobileDrawer } from "@/components/MobileDrawer";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useFormikContext } from "formik";

import { BankOption, BranchAccountDto } from "@/api/fee-collection";
import { BranchWithClassLevels } from "@/api/types";
import { FeesSetupFormValues } from "../index";
import { PageEmptyState } from "@/components/Error/PageEmptyState";
import { useGetAllBanks } from "@/hooks/queryHooks/useFeeCollection";

type PoolAccount = {
  bankCode: string;
  bankName: string;
  accountNumber: string;
};

interface Props {
  branches: BranchWithClassLevels[];
}

export const DifferentFeesAccount = ({ branches }: Props) => {
  const { values, setFieldValue } = useFormikContext<FeesSetupFormValues>();
  const [accountPool, setAccountPool] = useState<PoolAccount[]>([]);
  const [openFilter, setOpenFilter] = useState<Record<number, boolean>>({});
  const [query, setQuery] = useState("");
  const isMobile = useIsMobile();
  const { data: bankOptions = [] } = useGetAllBanks();

  const filteredPool = accountPool.filter(a => `${a.bankName} ${a.accountNumber}`.toLowerCase().includes(query.toLowerCase()));

  const getSelectedKey = (branchId: number) => values.branchAccounts.find(a => a.branchId === branchId)?.accountNumber ?? "";

  const handleSelectAccount = (branchId: number, accountNumber: string) => {
    const acc = accountPool.find(a => a.accountNumber === accountNumber);
    if (!acc) return;
    const updated: BranchAccountDto = { ...acc, branchId };
    const exists = values.branchAccounts.find(a => a.branchId === branchId);
    setFieldValue(
      "branchAccounts",
      exists ? values.branchAccounts.map(a => (a.branchId === branchId ? updated : a)) : [...values.branchAccounts, updated],
    );
  };

  const handleAddToPool = (acc: PoolAccount) => {
    if (!accountPool.some(a => a.accountNumber === acc.accountNumber)) {
      setAccountPool(prev => [...prev, acc]);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-6">
        <div>
          <div className="text-text-default mb-2 text-lg font-semibold">Set a collection account for each branch</div>
          <div className="text-text-muted text-sm font-normal">This is where most fees will go by default for each branch.</div>
        </div>

        {branches.length === 0 && (
          <div className="flex h-60 items-center justify-center">
            <PageEmptyState
              title="No Branches Found"
              description="You need at least one branch before setting up fee collection accounts."
              buttonText="Go to Settings"
              url="/staff/settings/academic"
            />
          </div>
        )}

        {branches.map(({ branch }) => (
          <div
            key={branch.id}
            className="border-border-default flex flex-col gap-4 rounded-md border p-2 md:h-19 md:flex-row md:items-center md:justify-between md:p-6"
          >
            <span className="text-text-default text-md font-medium">{branch.name ?? "Branch"}</span>

            {!isMobile ? (
              <Select
                open={!!openFilter[branch.id]}
                onOpenChange={open => {
                  setOpenFilter(prev => ({ ...prev, [branch.id]: open }));
                  if (!open) setQuery("");
                }}
                value={getSelectedKey(branch.id)}
                onValueChange={val => handleSelectAccount(branch.id, val)}
              >
                <SelectTrigger className="bg-bg-input-soft! text-text-default flex h-9! w-full! items-center justify-between rounded-md border-none p-2 md:w-57!">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>

                <SelectContent className="bg-bg-card border-border-default text-text-default w-71! p-0! shadow-sm">
                  <div className="border-border-default border-b">
                    <SearchInput className="w-full rounded-md border-none" value={query} onChange={e => setQuery(e.target.value)} />
                  </div>

                  <SelectGroup className="p-0!">
                    {filteredPool.length > 0 ? (
                      filteredPool.map((item, i) => (
                        <SelectItem key={i} value={item.accountNumber} className="text-text-default my-2 py-3 text-sm">
                          <div className="flex w-full items-center gap-2">
                            <Avatar className="size-4" />
                            <div className="w-full text-xs">
                              {item.bankName} — {item.accountNumber}
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="__empty__" disabled>
                        <div className="my-4 flex flex-col items-center gap-2">
                          <QuickReferenceAll fill="var(--color-icon-bg-default)" className="border-border-strong border" />
                          <div className="text-text-subtle text-sm">No accounts added yet</div>
                          <div className="text-text-muted text-center text-xs">Added accounts will show here</div>
                        </div>
                      </SelectItem>
                    )}

                    <AddAccountSheet bankOptions={bankOptions} onAdd={handleAddToPool} />
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : (
              <>
                <Button
                  type="button"
                  onClick={() => setOpenFilter(prev => ({ ...prev, [branch.id]: true }))}
                  className="bg-bg-input-soft! text-text-default flex h-9! w-full! items-center justify-between rounded-md border-none p-2 md:w-57!"
                >
                  <span className={getSelectedKey(branch.id) ? "text-text-default text-sm" : "text-text-subtle text-sm"}>
                    {getSelectedKey(branch.id)
                      ? (() => {
                          const found = accountPool.find(a => a.accountNumber === getSelectedKey(branch.id));
                          return found ? `${found.bankName} — ${found.accountNumber}` : getSelectedKey(branch.id);
                        })()
                      : "Select account"}
                  </span>
                  <ArrowDownS fill="var(--color-icon-default-muted)" />
                </Button>

                <MobileDrawer
                  open={!!openFilter[branch.id]}
                  setIsOpen={open => {
                    setOpenFilter(prev => ({ ...prev, [branch.id]: open }));
                    if (!open) setQuery("");
                  }}
                  title="Select account"
                >
                  <div className="flex flex-col gap-3 p-3">
                    <div className="border-border-default">
                      <SearchInput className="w-full rounded-md border-none" value={query} onChange={e => setQuery(e.target.value)} />
                    </div>

                    <div>
                      {filteredPool.length > 0 ? (
                        filteredPool.map((item, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              handleSelectAccount(branch.id, item.accountNumber);
                              setOpenFilter(prev => ({ ...prev, [branch.id]: false }));
                              setQuery("");
                            }}
                            className="bg-bg-card border-border-default mb-2 flex cursor-pointer items-center justify-between rounded-md border p-4"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="size-4" />
                              <div className="text-text-default w-full text-xs">
                                {item.bankName} — {item.accountNumber}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="mt-4 mb-6 flex flex-col items-center gap-2">
                          <QuickReferenceAll fill="var(--color-icon-bg-default)" className="border-border-strong border" />
                          <div className="text-text-subtle text-sm">No accounts added yet</div>
                          <div className="text-text-muted text-center text-xs">Added accounts will show here</div>
                        </div>
                      )}

                      <AddAccountSheet bankOptions={bankOptions} onAdd={handleAddToPool} />
                    </div>
                  </div>
                </MobileDrawer>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface AddAccountSheetProps {
  bankOptions: BankOption[];
  onAdd: (acc: PoolAccount) => void;
}

export const AddAccountSheet = ({ bankOptions, onAdd }: AddAccountSheetProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [bankCode, setBankCode] = useState("");
  const [bankSearch, setBankSearch] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const isMobile = useIsMobile();

  const filteredBanks = bankOptions.filter(b => b.name.toLowerCase().includes(bankSearch.toLowerCase()));
  const bankName = bankOptions.find(b => b.code === bankCode)?.name ?? "";
  const canSave = !!bankCode && accountNumber.length === 10;

  const handleSave = () => {
    if (!canSave) return;
    onAdd({ bankCode, bankName, accountNumber });
    setBankCode("");
    setBankSearch("");
    setAccountNumber("");
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
        {accountNumber.length === 10 && (
          <div className="bg-bg-input-soft mt-2 flex w-full items-center gap-2 rounded-md p-2">
            <Avatar className="size-4" />
            <span className="text-text-default text-sm font-medium">Account holder name</span>
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
        disabled={!canSave}
        onClick={handleSave}
        className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! flex h-7 items-center gap-1 rounded-sm px-2 py-1 disabled:opacity-50"
      >
        Add Account
      </Button>
    </div>
  );

  return (
    <div>
      <div
        onClick={() => setSheetOpen(true)}
        role="button"
        className="hover:bg-bg-input-soft border-border-default text-text-default flex cursor-pointer items-center justify-center gap-1.5 border-t py-2 text-sm"
      >
        {/* <PlusIcon className="text-icon-default-muted size-4" /> */}
        <AddFill fill="var(--color-icon-default-muted)" className="size-4" /> Add new account
      </div>

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
