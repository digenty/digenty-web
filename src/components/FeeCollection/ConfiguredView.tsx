"use client";

import { Edit, GroupWorkT } from "@digenty/icons";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Modal } from "@/components/Modal";
import { EditAccountSheet } from "@/components/FeeCollection/FeesCollectionSteppers/EditAccountSheet";
import { RoutingSheet } from "@/components/FeeCollection/FeesCollectionSteppers/FeesModeOneAccount/OneFeesRouting";
import { BankAccountInfo, FeeCollectionConfigResponse, FeeCollectionMode, FeeRouteInfo } from "@/api/fee-collection";
import { FeeItemDetail } from "@/api/fee";
import { BranchWithClassLevels } from "@/api/types";
import { useGetAllBanks, useUpdateFeeCollectionBankAccount, useUpdateFeeCollectionMode } from "@/hooks/queryHooks/useFeeCollection";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { SearchInput } from "../SearchInput";

const AVATAR_COLORS = ["bg-orange-400", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-teal-500"];

const nameColor = (name: string) => {
  const sum = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
};

const InitialAvatar = ({ name }: { name: string }) => (
  <div className={`${nameColor(name)} flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white`}>
    {name[0]?.toUpperCase() ?? "?"}
  </div>
);

interface Props {
  config: FeeCollectionConfigResponse;
}

export const ConfiguredView = ({ config }: Props) => {
  useBreadcrumb([{ label: "Fee Collection", url: "/staff/fee-collection" }]);
  const router = useRouter();

  const [modeOpen, setModeOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<BankAccountInfo | null>(null);
  // Track selected branch ID for the fee routing tabs
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(
    config.mode === "BRANCH_ACCOUNTS" ? (config.branchAccounts?.[0]?.branchId ?? null) : null,
  );
  const [routeSearch, setRouteSearch] = useState("");

  const { data: bankOptions = [] } = useGetAllBanks();
  const { mutate: updateAccount } = useUpdateFeeCollectionBankAccount();
  const { data: branchesData } = useGetBranches();
  const branches: BranchWithClassLevels[] = branchesData?.data ?? [];

  // Real branch ID to use in fee route payloads — never send 0
  const firstBranchId = branches[0]?.branch?.id ?? 0;
  const routingBranchId = config.mode === "BRANCH_ACCOUNTS" ? (selectedBranchId ?? firstBranchId) : firstBranchId;

  const allRoutes: FeeRouteInfo[] = config.feeRoutes ?? [];
  const filteredRoutes = allRoutes.filter(r => r.feeName.toLowerCase().includes(routeSearch.toLowerCase()));
  const hasFeeStats = (config.totalFees ?? 0) > 0;

  // Branch collection rows: for BRANCH_ACCOUNTS with empty branchAccounts, show defaultAccount
  const branchAccountsToShow =
    config.mode === "BRANCH_ACCOUNTS" && (config.branchAccounts?.length ?? 0) === 0 && config.defaultAccount
      ? [{ branchId: 0, branchName: "All branches", account: config.defaultAccount }]
      : (config.branchAccounts ?? []);

  // Fee routing tabs: prefer config.branchAccounts; fall back to fetched branches
  const routingBranchTabs =
    config.mode === "BRANCH_ACCOUNTS"
      ? (config.branchAccounts?.length ?? 0) > 0
        ? config.branchAccounts!.map(b => ({ id: b.branchId, name: b.branchName }))
        : branches.map(b => ({ id: b.branch.id, name: b.branch.name ?? "Branch" }))
      : [];

  return (
    <div className="mx-auto flex w-full max-w-175 flex-col gap-6 p-6">
      {/* Branch collection card */}
      <div className="border-border-default overflow-hidden rounded-xl border">
        <div className="border-border-default flex flex-col gap-1 border-b p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-text-default text-sm font-semibold">Branch collection</div>
            <div className="text-text-muted text-xs">
              {config.mode === "BRANCH_ACCOUNTS" ? "Different accounts for each branch" : "Single account for all branches"}
            </div>
          </div>
          <Button
            onClick={() => setModeOpen(true)}
            className="border-border-default bg-bg-state-secondary! text-text-default flex h-8! w-fit items-center gap-1.5 rounded-md border text-sm"
          >
            <Edit fill="var(--color-icon-default-muted)" /> Change Mode
          </Button>
        </div>

        {config.mode === "SINGLE_ACCOUNT" && config.defaultAccount && (
          <BranchAccountRow label="All branches" account={config.defaultAccount} onEdit={() => setEditAccount(config.defaultAccount!)} />
        )}

        {config.mode === "BRANCH_ACCOUNTS" &&
          branchAccountsToShow.map(info => (
            <BranchAccountRow key={info.branchId} label={info.branchName} account={info.account} onEdit={() => setEditAccount(info.account)} />
          ))}
      </div>

      {/* Fee Routing card */}
      <div className="border-border-default overflow-hidden rounded-xl border">
        <div className="border-border-default border-b p-4">
          <div className="text-text-default text-sm font-semibold">Fee Routing</div>
          <div className="text-text-muted text-xs">Custom collection accounts for specific fees</div>
        </div>

        {/* Branch tabs for BRANCH_ACCOUNTS mode */}
        {routingBranchTabs.length > 0 && (
          <div className="border-border-default flex gap-1 border-b px-4 pt-3">
            {routingBranchTabs.map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedBranchId(b.id)}
                className={`border-b-2 px-2 pb-2.5 text-sm font-medium transition-colors ${
                  (selectedBranchId ?? firstBranchId) === b.id
                    ? "border-text-default text-text-default"
                    : "text-text-muted hover:text-text-default border-transparent"
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        )}

        {/* Stats */}
        {hasFeeStats && (
          <div className="border-border-default divide-border-default grid grid-cols-3 divide-x border-b">
            <div className="flex flex-col gap-0.5 p-4">
              <div className="text-text-default text-2xl font-semibold">{config.customRouteCount ?? 0}</div>
              <div className="text-text-muted text-xs">Custom routes</div>
            </div>
            <div className="flex flex-col gap-0.5 p-4">
              <div className="text-text-default text-2xl font-semibold">{config.defaultRouteCount ?? 0}</div>
              <div className="text-text-muted text-xs">Use default</div>
            </div>
            <div className="flex flex-col gap-0.5 p-4">
              <div className="text-text-default text-2xl font-semibold">{config.totalFees ?? 0}</div>
              <div className="text-text-muted text-xs">Total fees</div>
            </div>
          </div>
        )}

        {/* Search */}
        {hasFeeStats && (
          <div className="border-border-default border-b px-4 py-3">
            <SearchInput
              className="bg-bg-input-soft! text-text-default w-full rounded-md border-none focus:ring-0"
              value={routeSearch}
              onChange={e => setRouteSearch(e.target.value)}
              placeholder="Search fees"
            />
          </div>
        )}

        {/* Routes list */}
        {filteredRoutes.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="text-icon-default-muted h-8 w-8">
              <GroupWorkT />
            </div>
            <div className="text-text-muted text-sm">No fees routed</div>
            <Button
              onClick={() => router.push("/staff/fee-collection/fees-setup?step=fee-routing")}
              className="bg-bg-state-primary hover:bg-bg-state-primary/90! text-text-white-default h-8! rounded-md px-4 text-sm"
            >
              Route Fees
            </Button>
          </div>
        ) : (
          <>
            <div className="divide-border-default divide-y">
              {filteredRoutes.map(route => (
                <FeeRouteRow key={route.feeClassId} route={route} branchId={routingBranchId} />
              ))}
            </div>
            <div className="border-border-default bg-bg-muted flex items-center gap-2 border-t px-4 py-3">
              <Building2 size={14} className="text-icon-default-muted shrink-0" />
              <span className="text-text-muted text-xs">All other fees use the default account</span>
            </div>
          </>
        )}
      </div>

      <ChangeModeModal open={modeOpen} setOpen={setModeOpen} currentMode={config.mode} />
      <EditAccountSheet
        open={!!editAccount}
        onClose={() => setEditAccount(null)}
        initial={{
          bankCode: bankOptions.find(b => b.name === editAccount?.bankName)?.code ?? "",
          bankName: editAccount?.bankName ?? "",
          accountNumber: editAccount?.accountNumber ?? "",
        }}
        onSave={({ bankCode, bankName, accountNumber }) => {
          if (!editAccount) return;
          updateAccount(
            { accountId: editAccount.id, payload: { bankCode, bankName, accountNumber } },
            {
              onSuccess: () => {
                toast.success("Account updated");
                setEditAccount(null);
              },
              onError: (err: unknown) => {
                toast.error((err as { message?: string })?.message ?? "Failed to update account");
              },
            },
          );
        }}
      />
    </div>
  );
};

const BranchAccountRow = ({ label, account, onEdit }: { label: string; account: BankAccountInfo; onEdit: () => void }) => (
  <div className="flex items-center justify-between px-4 py-3">
    <div className="flex items-center gap-3">
      <InitialAvatar name={label} />
      <div>
        <div className="text-text-default text-sm font-medium">{label}</div>
        <div className="text-text-muted text-xs">
          {account.accountNumber} • {account.accountName}
        </div>
      </div>
    </div>
    <Button
      onClick={onEdit}
      className="border-border-default bg-bg-state-secondary! text-text-default flex h-7! items-center gap-1 rounded-md border text-xs"
    >
      <Edit fill="var(--color-icon-default-muted)" /> Edit
    </Button>
  </div>
);

const FeeRouteRow = ({ route, branchId }: { route: FeeRouteInfo; branchId: number }) => {
  const syntheticFeeItem: FeeItemDetail = {
    feeItemId: route.feeClassId,
    feeClassId: route.feeClassId,
    feeName: route.feeName,
    amount: 0,
    quantity: 1,
    required: false,
    allowPartPayment: false,
    minimumPartPayment: 0,
  };

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex flex-col gap-0.5">
        <div className="text-text-default text-sm font-medium">{route.feeName}</div>
        <div className="text-text-muted flex items-center gap-1.5 text-xs">
          {route.isDefault ? (
            <>
              <Building2 size={11} />
              <span>Default Collection Account</span>
            </>
          ) : (
            <>
              <span className={`${nameColor(route.account.accountName)} inline-block h-3 w-3 rounded-full`} />
              <span>
                {route.account.accountNumber} • {route.account.accountName}
              </span>
            </>
          )}
        </div>
      </div>
      <RoutingSheet feeItem={syntheticFeeItem} branchId={branchId} />
    </div>
  );
};

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
          toast.error((err as { message?: string })?.message ?? "Failed to update mode");
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
          <SelectContent className="bg-bg-card text-text-default border-none!">
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
