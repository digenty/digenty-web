import { Edit, Information } from "@digenty/icons";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal";
import { MobileDrawer } from "@/components/MobileDrawer";
import { SheetFooter, SheetClose } from "@/components/ui/sheet";
import { FeesMode } from "../FeesMode";
import { EditAccountSheet } from "../EditAccountSheet";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useFormikContext } from "formik";
import { useGetFeeRoutes } from "@/hooks/queryHooks/useFee";
import { FeesSetupFormValues } from "../index";
import React, { useState } from "react";

type FlowType = "oneAccount" | "differentAccounts";

interface Props {
  selected: FlowType | null;
  onSelect: (value: FlowType) => void;
}

export const OneAccountReview = ({ selected, onSelect }: Props) => {
  const [openMode, setOpenMode] = useState(false);
  const [editAccountOpen, setEditAccountOpen] = useState(false);
  const isMobile = useIsMobile();
  const { values, setFieldValue } = useFormikContext<FeesSetupFormValues>();
  const { data: routes = [] } = useGetFeeRoutes();

  const account = values.branchAccounts[0];
  const customRoutes = routes.filter(r => !r.isDefault).length;
  const defaultRoutes = routes.filter(r => r.isDefault).length;

  const handleSelect = (value: FlowType) => {
    onSelect(value);
    setOpenMode(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="border-border-darker flex flex-col gap-4 rounded-md border p-3">
        <div className="bg-bg-muted border-border-darker flex flex-col gap-3 rounded-md border p-4 md:flex-row md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="text-text-default text-md font-semibold">Branch collection</div>
            <div className="text-text-muted text-sm font-normal">Single account for all branches</div>
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

        {account ? (
          <>
            <div className="border-border-darker flex justify-between gap-3 rounded-md border p-4">
              <div className="flex flex-col gap-1">
                <div className="text-text-default text-sm font-medium">All branches use</div>
                <div className="text-text-muted text-xs font-medium">
                  {account.bankName} • {account.accountNumber}
                </div>
              </div>
              <Button
                type="button"
                onClick={() => setEditAccountOpen(true)}
                className="hover:bg-bg-none! bg-none"
              >
                <Edit fill="var(--color-icon-default-muted)" />
              </Button>
            </div>

            <EditAccountSheet
              open={editAccountOpen}
              onClose={() => setEditAccountOpen(false)}
              initial={{ bankCode: account.bankCode, bankName: account.bankName, accountNumber: account.accountNumber }}
              onSave={updated => {
                setFieldValue("branchAccounts", [{ ...account, ...updated }]);
              }}
              title="Edit Collection Account"
            />
          </>
        ) : (
          <div className="text-text-muted border-border-darker rounded-md border p-4 text-sm">
            No account added. Go back to add a collection account.
          </div>
        )}
      </div>

      {routes.length > 0 && (
        <div className="border-border-darker flex flex-col gap-4 rounded-md border p-3">
          <div className="bg-bg-muted border-border-darker flex justify-between gap-3 rounded-t-md border p-4">
            <div className="flex flex-col gap-2">
              <div className="text-text-default text-md font-semibold">Fee Routing</div>
              <div className="text-text-muted text-sm font-normal">Custom collection accounts for specific fees</div>
            </div>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:justify-between">
            <div className="border-border-darker flex w-full flex-col gap-3 rounded-sm border p-3">
              <div className="text-text-default text-2xl font-medium">{customRoutes}</div>
              <div className="text-text-muted text-xs font-medium">Custom routes</div>
            </div>
            <div className="border-border-darker flex w-full flex-col gap-3 rounded-sm border p-3">
              <div className="text-text-default text-2xl font-medium">{defaultRoutes}</div>
              <div className="text-text-muted text-xs font-medium">Default routes</div>
            </div>
            <div className="border-border-darker flex w-full flex-col gap-3 rounded-sm border p-3">
              <div className="text-text-default text-2xl font-medium">{routes.length}</div>
              <div className="text-text-muted text-xs font-medium">Total routes</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-bg-basic-gray-subtle flex h-10 w-full items-center gap-2 rounded-md p-3 md:w-89">
        <Information fill="var(--color-icon-default)" />
        <div className="text-text-subtle text-xs">All other fees use the default account</div>
      </div>
    </div>
  );
};
