"use client";

import { ArrowDownS, QuickReferenceAll } from "@digenty/icons";
import { Avatar } from "@/components/Avatar";
import { MobileDrawer } from "@/components/MobileDrawer";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/useIsMobile";
import React, { useState } from "react";
import { useFormikContext } from "formik";

import { BranchAccountDto } from "@/api/fee-collection";
import { BranchWithClassLevels } from "@/api/types";
import { FeesSetupFormValues } from "../index";
import { PageEmptyState } from "@/components/Error/PageEmptyState";
import { useGetAllBanks } from "@/hooks/queryHooks/useFeeCollection";
import { AddAccountSheet, PoolAccount } from "../AddAccountSheet";

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
                              <div className="font-medium">{item.accountName}</div>
                              <div className="text-text-muted">
                                {item.bankName} — {item.accountNumber}
                              </div>
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
                          return found ? `${found.accountName} — ${found.bankName}` : getSelectedKey(branch.id);
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
                                <div className="font-medium">{item.accountName}</div>
                                <div className="text-text-muted">
                                  {item.bankName} — {item.accountNumber}
                                </div>
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
