import Edit from "@/components/Icons/Edit";
import { GroupWorkT } from "@/components/Icons/GroupWorkT";
import { Gtbank } from "@/components/Icons/Gtbank";
import { Tabs } from "@/components/Tab";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { FeesMode } from "../FeesMode";
import { SheetFooter, SheetClose } from "@/components/ui/sheet";
import { MobileDrawer } from "@/components/MobileDrawer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Modal } from "@/components/Modal";

type FlowType = "oneAccount" | "differentAccounts";

export const DifferentFeesReview = ({ selected, onSelect }: { selected: FlowType | null; onSelect: (value: FlowType) => void }) => {
  const [openMode, setOpenMode] = useState(false);
  const isMobile = useIsMobile();

  const handleSelect = (value: FlowType) => {
    onSelect(value);
    setOpenMode(false);
  };

  return (
    <div className="">
      <div className="flex flex-col gap-4">
        <div className="border-border-darker flex flex-col gap-4 rounded-md border p-3">
          <div className="bg-bg-muted border-border-darker flex flex-col gap-3 rounded-md border p-4 md:flex-row md:justify-between">
            <div className="flex flex-col gap-2">
              <div className="text-text-default text-md font-semibold">Branch collection</div>
              <div className="text-text-muted text-sm font-normal">Single account for all branches</div>
            </div>
            <Button
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
                        variant="outline"
                        className="bg-bg-state-soft! text-text-subtle hover:text-text-subtle! rounde-sm h-7 w-17 border-none px-2 py-1"
                      >
                        Cancel
                      </Button>
                    </SheetClose>
                    <Button
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
          <div className="border-border-darker flex justify-between gap-3 rounded-md border p-4">
            <div className="flex flex-col gap-1">
              <div className="text-text-default text-sm font-medium">All branches use</div>
              <div className="flex gap-1">
                <Gtbank />
                <div className="text-text-muted text-xs font-medium">23234343334 • Damilare John</div>
              </div>
            </div>
            <Button className="hover:bg-bg-none! bg-none">
              <Edit fill="var(--color-icon-default-muted)" />
            </Button>
          </div>
          <div className="border-border-darker flex justify-between gap-3 rounded-md border p-4">
            <div className="flex flex-col gap-1">
              <div className="text-text-default text-sm font-medium">All branches use</div>
              <div className="flex gap-1">
                <Gtbank />
                <div className="text-text-muted text-xs font-medium">23234343334 • Damilare John</div>
              </div>
            </div>
            <Button className="hover:bg-bg-none! bg-none">
              <Edit fill="var(--color-icon-default-muted)" />
            </Button>
          </div>
        </div>
        <div className="border-border-darker flex flex-col gap-4 rounded-md border p-3">
          <div className="bg-bg-muted border-border-darker flex justify-between gap-3 rounded-t-md border p-4">
            <div className="flex flex-col gap-2">
              <div className="text-text-default text-md font-semibold">Fee Routing</div>
              <div className="text-text-muted text-sm font-normal">Custom collection accounts for specific fees</div>
            </div>
          </div>
          <Tabs
            className="w-fit"
            items={[
              {
                label: "Ilasamaja",
                content: <CustomBranchFeeRouting />,
              },
              {
                label: "Lawanson",
                content: <CustomBranchFeeRouting />,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export const CustomBranchFeeRouting = () => {
  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="">
        <div className="flex items-center justify-center py-10">
          <div className="flex flex-col items-center gap-2">
            <GroupWorkT />
            <div className="text-text-default text-md font-medium">No fees routed</div>

            <Button className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default"> Add Fee</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
