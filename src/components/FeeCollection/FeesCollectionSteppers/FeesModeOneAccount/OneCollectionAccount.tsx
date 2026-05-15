import { useFormikContext } from "formik";
import React, { useState } from "react";

import { Avatar } from "@/components/Avatar";
import { SearchInput } from "@/components/SearchInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BranchAccountDto } from "@/api/fee-collection";
import { FeesSetupFormValues } from "../index";
import { useGetAllBanks } from "@/hooks/queryHooks/useFeeCollection";

export const OneCollectionAccount = () => {
  const { values, setFieldValue, errors, touched } = useFormikContext<FeesSetupFormValues>();
  const account: BranchAccountDto = values.branchAccounts[0] ?? { bankName: "", bankCode: "", accountNumber: "", isDefault: true };
  const { data: bankOptions = [] } = useGetAllBanks();
  const [bankSearch, setBankSearch] = useState("");

  const filteredBanks = bankOptions.filter(b => b.name.toLowerCase().includes(bankSearch.toLowerCase()));

  const updateAccount = (patch: Partial<BranchAccountDto>) => {
    const next = [{ ...account, ...patch, isDefault: true }];
    setFieldValue("branchAccounts", next);
  };

  const handleBankChange = (bankCode: string) => {
    const bank = bankOptions.find(b => b.code === bankCode);
    updateAccount({ bankCode, bankName: bank?.name ?? "" });
    setBankSearch("");
  };

  const accountErrors = (touched.branchAccounts && (errors.branchAccounts as unknown as { bankName?: string; accountNumber?: string }[])?.[0]) || {};

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="">
        <div className="text-text-default text-lg font-semibold">Add your collection account</div>
        <div className="text-text-muted text-sm font-normal">This account will be used for all branches by default.</div>
      </div>
      <div className="">
        <Label className="text-text-default mb-2 text-sm font-medium">Bank Name</Label>
        <Select value={account.bankCode} onValueChange={handleBankChange}>
          <SelectTrigger className="bg-bg-input-soft! hover:bg-bg-input-soft! text-text-default w-full rounded-md border-none">
            <SelectValue placeholder="Select Bank" />
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default text-text-default border">
            <div className="border-border-default border-b">
              <SearchInput className="w-full rounded-md border-none" value={bankSearch} onChange={e => setBankSearch(e.target.value)} />
            </div>
            <SelectGroup>
              {filteredBanks.map(bank => (
                <SelectItem key={bank.slug} value={bank.code}>
                  <span>{bank.name}</span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {accountErrors?.bankName && <p className="mt-1 text-xs text-red-500">{accountErrors.bankName}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-text-default text-sm font-medium">Account Number</Label>
        <Input
          value={account.accountNumber}
          onChange={e => updateAccount({ accountNumber: e.target.value.replace(/\D/g, "").slice(0, 10) })}
          inputMode="numeric"
          className="bg-bg-input-soft! text-text-muted w-full rounded-md border-none"
          placeholder="Enter 10-digits account number"
        />
        {accountErrors?.accountNumber && <p className="text-xs text-red-500">{accountErrors.accountNumber}</p>}
        {account.accountNumber.length === 10 && (
          <div className="bg-bg-input-soft mt-2 flex w-full items-center gap-2 rounded-md p-2">
            <Avatar className="size-4" /> <span className="text-text-default text-sm font-medium">Account holder name</span>
          </div>
        )}
      </div>
    </div>
  );
};
