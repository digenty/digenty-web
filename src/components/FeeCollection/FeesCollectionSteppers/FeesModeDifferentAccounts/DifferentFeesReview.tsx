"use client";

import { Edit, GroupWorkT } from "@digenty/icons";
import { Tabs } from "@/components/Tabs";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { FeesMode } from "../FeesMode";
import { SheetFooter, SheetClose } from "@/components/ui/sheet";
import { MobileDrawer } from "@/components/MobileDrawer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Modal } from "@/components/Modal";
import { useFormikContext } from "formik";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetFeeRoutesByBranch } from "@/hooks/queryHooks/useFee";
import { EditAccountSheet } from "../EditAccountSheet";
import { FeesSetupFormValues } from "../index";
import { BranchWithClassLevels } from "@/api/types";
import { FeeRouteResponseDto } from "@/api/fee";

type FlowType = "oneAccount" | "differentAccounts";

export const DifferentFeesReview = ({ selected, onSelect }: { selected: FlowType | null; onSelect: (value: FlowType) => void }) => {
  const [openMode, setOpenMode] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const { values, setFieldValue } = useFormikContext<FeesSetupFormValues>();
  const { data: branchesData } = useGetBranches();
  const branches: BranchWithClassLevels[] = branchesData?.data ?? [];

  const handleSelect = (value: FlowType) => {
    onSelect(value);
    setOpenMode(false);
  };

  const editingAccount = editingBranchId !== null
    ? values.branchAccounts.find(a => a.branchId === editingBranchId)
    : null;

  const handleSaveAccount = (updated: { bankCode: string; bankName: string; accountNumber: string }) => {
    setFieldValue(
      "branchAccounts",
      values.branchAccounts.map(a =>
        a.branchId === editingBranchId ? { ...a, ...updated } : a,
      ),
    );
    setEditingBranchId(null);
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="border-border-darker flex flex-col gap-4 rounded-md border p-3">
          <div className="bg-bg-muted border-border-darker flex flex-col gap-3 rounded-md border p-4 md:flex-row md:justify-between">
            <div className="flex flex-col gap-2">
              <div className="text-text-default text-md font-semibold">Branch collection</div>
              <div className="text-text-muted text-sm font-normal">Different account per branch</div>
            </div>
            <Button
              type="button"
              onClick={() => setOpenMode(true)}
              className="border-border-darker bg-bg-state-secondary! text-text-default flex h-8! w-fit items-center gap-4 rounded-md border text-sm font-medium"
            >
              <Edit fill="var(--color-icon-default-muted)" /> Change Mode
            </Button>

            {!isMobile && (
              <Modal open={openMode} setOpen={setOpenMode} title="Choose mode" ActionButton={null}>
                <div className="p-6">
                  <FeesMode selected={selected} onSelect={handleSelect} />
                </div>
              </Modal>
            )}

            {isMobile && (
              <MobileDrawer open={openMode} setIsOpen={setOpenMode} title="Choose mode">
                <div className="p-4">
                  <FeesMode selected={selected} onSelect={handleSelect} />
                </div>
                <SheetFooter className="border-border-default bg-bg-card border-t">
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
                      onClick={() => setOpenMode(false)}
                      className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! flex h-7 w-17 items-center gap-1 rounded-sm px-2 py-1"
                    >
                      Update
                    </Button>
                  </div>
                </SheetFooter>
              </MobileDrawer>
            )}
          </div>

          {values.branchAccounts.length === 0 ? (
            <div className="text-text-muted border-border-darker rounded-md border p-4 text-sm">
              No accounts added. Go back to add collection accounts per branch.
            </div>
          ) : (
            values.branchAccounts.map(acc => {
              const branchName = branches.find(({ branch }) => branch.id === acc.branchId)?.branch.name ?? `Branch ${acc.branchId}`;
              return (
                <div key={acc.branchId} className="border-border-darker flex justify-between gap-3 rounded-md border p-4">
                  <div className="flex flex-col gap-1">
                    <div className="text-text-default text-sm font-medium">{branchName}</div>
                    <div className="text-text-muted text-xs font-medium">
                      {acc.bankName} • {acc.accountNumber}
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => setEditingBranchId(acc.branchId ?? null)}
                    className="hover:bg-bg-none! bg-none"
                  >
                    <Edit fill="var(--color-icon-default-muted)" />
                  </Button>
                </div>
              );
            })
          )}
        </div>

        {branches.length > 0 && (
          <div className="border-border-darker flex flex-col gap-4 rounded-md border p-3">
            <div className="bg-bg-muted border-border-darker flex justify-between gap-3 rounded-t-md border p-4">
              <div className="flex flex-col gap-2">
                <div className="text-text-default text-md font-semibold">Fee Routing</div>
                <div className="text-text-muted text-sm font-normal">Custom collection accounts for specific fees</div>
              </div>
            </div>
            <Tabs
              className="w-fit"
              items={branches.map(({ branch }) => ({
                label: branch.name ?? "Branch",
                content: <BranchRoutingReview branchId={branch.id} />,
              }))}
            />
          </div>
        )}
      </div>

      {editingAccount && (
        <EditAccountSheet
          open={editingBranchId !== null}
          onClose={() => setEditingBranchId(null)}
          initial={{
            bankCode: editingAccount.bankCode,
            bankName: editingAccount.bankName,
            accountNumber: editingAccount.accountNumber,
          }}
          onSave={handleSaveAccount}
          title={`Edit Account — ${branches.find(({ branch }) => branch.id === editingBranchId)?.branch.name ?? "Branch"}`}
        />
      )}
    </div>
  );
};

const BranchRoutingReview = ({ branchId }: { branchId: number }) => {
  const { data: routes = [] } = useGetFeeRoutesByBranch(branchId);

  if (routes.length === 0) {
    return (
      <div className="mt-6 flex items-center justify-center py-10">
        <div className="flex flex-col items-center gap-2">
          <GroupWorkT />
          <div className="text-text-default text-md font-medium">No fees routed</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      {routes.map((route: FeeRouteResponseDto) => (
        <div key={route.id} className="border-border-darker flex justify-between gap-3 rounded-md border p-4">
          <div className="flex flex-col gap-1">
            <div className="text-text-default text-sm font-medium">{route.feeClassName}</div>
            <div className="text-text-muted text-xs font-medium">
              {route.bankAccountNumber} — {route.bankAccountName}
            </div>
          </div>
          <Button type="button" className="hover:bg-bg-none! bg-none">
            <Edit fill="var(--color-icon-default-muted)" />
          </Button>
        </div>
      ))}
    </div>
  );
};
