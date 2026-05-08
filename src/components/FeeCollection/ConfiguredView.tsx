"use client";

import { Edit } from "@digenty/icons";
import React, { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Modal } from "@/components/Modal";
import { BankAccountInfo, BranchAccountInfo, FeeCollectionConfigResponse, FeeCollectionMode, UpdateBankAccountDto } from "@/api/fee-collection";
import { useGetFeeCollectionBankAccounts, useUpdateFeeCollectionBankAccount, useUpdateFeeCollectionMode } from "@/hooks/queryHooks/useFeeCollection";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const BANK_OPTIONS: { name: string; code: string }[] = [
  { name: "GTBank", code: "058" },
  { name: "Access Bank", code: "044" },
  { name: "First Bank", code: "011" },
  { name: "UBA", code: "033" },
  { name: "Zenith Bank", code: "057" },
];

const MODE_LABELS: Record<FeeCollectionMode, string> = {
  SINGLE_ACCOUNT: "Single account for all branches",
  BRANCH_ACCOUNTS: "Different account per branch",
};

interface Props {
  config: FeeCollectionConfigResponse;
}

export const ConfiguredView = ({ config }: Props) => {
  useBreadcrumb([{ label: "Fee Collection", url: "/staff/fee-collection" }]);
  const { data: accounts = [] } = useGetFeeCollectionBankAccounts();
  const [modeOpen, setModeOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<BankAccountInfo | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-175 flex-col gap-6 p-6">
      <div className="border-border-darker flex flex-col gap-4 rounded-md border p-3">
        <div className="bg-bg-muted border-border-darker flex flex-col gap-3 rounded-md border p-4 md:flex-row md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="text-text-default text-md font-semibold">Branch collection</div>
            <div className="text-text-muted text-sm font-normal">{MODE_LABELS[config.mode]}</div>
          </div>
          <Button
            onClick={() => setModeOpen(true)}
            className="border-border-darker bg-bg-state-secondary! text-text-default flex h-8! w-fit items-center gap-4 rounded-md border text-sm font-medium"
          >
            <Edit fill="var(--color-icon-default-muted)" /> Change Mode
          </Button>
        </div>

        {config.mode === "SINGLE_ACCOUNT" && config.defaultAccount && (
          <BankAccountRow account={config.defaultAccount} label="All branches use" onEdit={() => setEditAccount(config.defaultAccount!)} />
        )}

        {config.mode === "BRANCH_ACCOUNTS" &&
          config.branchAccounts?.map((info: BranchAccountInfo) => (
            <BankAccountRow key={info.branchId} account={info.account} label={info.branchName} onEdit={() => setEditAccount(info.account)} />
          ))}
      </div>

      {accounts.length > 0 && (
        <div className="border-border-darker flex flex-col gap-4 rounded-md border p-3">
          <div className="text-text-default text-md font-semibold">All accounts ({accounts.length})</div>
          {accounts.map(acc => (
            <BankAccountRow key={acc.id} account={acc} label={acc.isDefault ? "Default" : "Account"} onEdit={() => setEditAccount(acc)} />
          ))}
        </div>
      )}

      <ChangeModeModal open={modeOpen} setOpen={setModeOpen} currentMode={config.mode} />

      {editAccount && <EditAccountModal account={editAccount} onClose={() => setEditAccount(null)} />}
    </div>
  );
};

const BankAccountRow = ({ account, label, onEdit }: { account: BankAccountInfo; label: string; onEdit: () => void }) => (
  <div className="border-border-darker flex justify-between gap-3 rounded-md border p-4">
    <div className="flex flex-col gap-1">
      <div className="text-text-default text-sm font-medium">{label}</div>
      <div className="text-text-muted text-xs font-medium">
        {account.bankName} • {account.accountNumber} • {account.accountName}
      </div>
    </div>
    <Button onClick={onEdit} className="hover:bg-bg-none! bg-none">
      <Edit fill="var(--color-icon-default-muted)" />
    </Button>
  </div>
);

const ChangeModeModal = ({ open, setOpen, currentMode }: { open: boolean; setOpen: (b: boolean) => void; currentMode: FeeCollectionMode }) => {
  const [mode, setMode] = useState<FeeCollectionMode>(currentMode);
  const { mutate: updateMode, isPending } = useUpdateFeeCollectionMode();

  const handleSave = () => {
    if (mode === currentMode) {
      setOpen(false);
      return;
    }
    updateMode(
      { mode },
      {
        onSuccess: () => {
          toast.success("Mode updated");
          setOpen(false);
        },
        onError: (err: unknown) => {
          const msg = (err as { message?: string })?.message ?? "Failed to update mode";
          toast.error(msg);
        },
      },
    );
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Change Mode"
      ActionButton={
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! flex h-8 items-center gap-1 rounded-sm px-3"
        >
          {isPending ? "Saving..." : "Save"}
        </Button>
      }
    >
      <div className="flex flex-col gap-3 p-6">
        <Label className="text-text-default text-sm font-medium">Mode</Label>
        <Select value={mode} onValueChange={v => setMode(v as FeeCollectionMode)}>
          <SelectTrigger className="bg-bg-input-soft! text-text-default w-full rounded-md border-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="SINGLE_ACCOUNT">Single account for all branches</SelectItem>
              <SelectItem value="BRANCH_ACCOUNTS">Different account per branch</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </Modal>
  );
};

const EditAccountModal = ({ account, onClose }: { account: BankAccountInfo; onClose: () => void }) => {
  const initialBank = BANK_OPTIONS.find(b => b.name === account.bankName);
  const [form, setForm] = useState<UpdateBankAccountDto>({
    bankName: account.bankName,
    bankCode: initialBank?.code ?? "",
    accountNumber: account.accountNumber,
  });
  const { mutate: updateAccount, isPending } = useUpdateFeeCollectionBankAccount();

  const handleSave = () => {
    updateAccount(
      { accountId: account.id, payload: form },
      {
        onSuccess: () => {
          toast.success("Account updated");
          onClose();
        },
        onError: (err: unknown) => {
          const msg = (err as { message?: string })?.message ?? "Failed to update account";
          toast.error(msg);
        },
      },
    );
  };

  const handleBankChange = (bankCode: string) => {
    const bank = BANK_OPTIONS.find(b => b.code === bankCode);
    setForm(f => ({ ...f, bankCode, bankName: bank?.name ?? f.bankName }));
  };

  return (
    <Modal
      open
      setOpen={open => !open && onClose()}
      title="Edit Account"
      ActionButton={
        <Button
          onClick={handleSave}
          disabled={isPending || !form.bankCode || form.accountNumber.length !== 10}
          className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! flex h-8 items-center gap-1 rounded-sm px-3"
        >
          {isPending ? "Saving..." : "Save"}
        </Button>
      }
    >
      <div className="flex flex-col gap-4 p-6">
        <div>
          <Label className="text-text-default mb-2 text-sm font-medium">Bank Name</Label>
          <Select value={form.bankCode} onValueChange={handleBankChange}>
            <SelectTrigger className="bg-bg-input-soft! text-text-default w-full rounded-md border-none">
              <SelectValue placeholder="Select Bank" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {BANK_OPTIONS.map(b => (
                  <SelectItem key={b.code} value={b.code}>
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
            value={form.accountNumber}
            onChange={e => setForm(f => ({ ...f, accountNumber: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
            inputMode="numeric"
            className="bg-bg-input-soft! text-text-muted w-full rounded-md border-none"
            placeholder="Enter 10-digits account number"
          />
        </div>
      </div>
    </Modal>
  );
};
