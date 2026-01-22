"use client";

import { ArrowDownS } from "@/components/Icons/ArrowDownS";
import { ArrowUpS } from "@/components/Icons/ArrowUpS";
import Information from "@/components/Icons/Information";
import { Subtract } from "@/components/Icons/Subtract";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/useIsMobile";
import Image from "next/image";
import React, { useState } from "react";

type Qtyprops = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const reasons = [
  "Select reason for decrease",
  "Sold",
  "Damaged",
  "Issued to Teacher",
  "Expired",
  "Lost",
  "Transferred to Another Branch",
  "Correction of Previous Error",
  "Disposed (Old or Obsolete)",
];

export const StockDetailsAdjustQtyModal = ({ open, setOpen }: Qtyprops) => {
  const [stockLevel, setStockLevel] = useState(false);
  const [selectReasons, setSelectReason] = useState(reasons[0]);
  const isMobile = useIsMobile();
  return (
    <div>
      {isMobile ? (
        <MobileDrawer open={open} setIsOpen={setOpen} title="Adjust Quantity">
          <div className="flex w-full flex-col gap-4 px-3 py-4">
            <div className="border-border-default tems-center flex justify-between gap-3 rounded-md border p-3 md:p-6">
              <div className="flex items-center gap-2">
                <Image src="/images/image.png" alt="stock image" width={32} height={32} />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <div className="text-text-default text-sm font-semibold">Textbook</div>
                  </div>
                  <div className="text-text-subtle text-xs">
                    Current Stock
                    <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default rounded-md border font-medium">89</Badge>
                  </div>
                </div>
              </div>

              <Badge className="border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! text-text-default h-7! rounded-md border">
                Lawanson
              </Badge>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">Quantity Adjustment</Label>
              <div className="bg-bg-input-soft flex h-8 items-center rounded-md">
                <Input className="bg-bg-none! text-text-default h-7! w-full border-none" placeholder="0" />
                <div className="border-border-default flex h-8 w-7 flex-col items-center gap-2 border-l p-1">
                  <ArrowUpS
                    fill="var(--color-icon-default-muted)"
                    className="border-border-default cursor-pointer border-b"
                    onClick={() => setStockLevel(true)}
                  />

                  <ArrowDownS fill="var(--color-icon-default-muted)" className="cursor-pointer" />
                </div>
              </div>
              <div className="text-text-muted text-xs">Use + for increases (e.g., +10) or - for decreases (e.g., -5)</div>
            </div>

            {stockLevel && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <Badge className="border-border-default bg-bg-badge-red text-bg-basic-red-strong rounded-md border text-xs font-medium">
                    <Subtract fill="var(--color-bg-basic-red-strong)" /> Stock Decrease
                  </Badge>
                  <div className="flex items-center gap-2">
                    <div className="text-text-subtle text-xs font-medium">New Total</div>
                    <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default rounded-md border">89</Badge>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">Reason for Decrease</Label>
                  <Select value={selectReasons} onValueChange={setSelectReason}>
                    <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
                      <SelectValue>
                        <span className="text-text-default text-sm">{selectReasons}</span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-bg-default border-border-default">
                      {reasons.map(rs => (
                        <SelectItem key={rs} value={rs} className="text-text-default text-sm">
                          {rs}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-bg-badge-blue border-border-default flex items-start gap-2 rounded-md border px-3 py-2">
                  <Information fill="var(--color-bg-basic-blue-accent)" />
                  <div className="flex flex-col gap-1">
                    <div className="text-text-default text-sm font-medium">Adjustment Summary</div>
                    <div className="text-text-muted text-sm">Removing 1 Pcs - Damage</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DrawerFooter className="border-border-default border-t">
            <div className="flex justify-between">
              <DrawerClose asChild>
                <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-2 py-1 text-sm font-medium">Cancel</Button>
              </DrawerClose>

              <Button className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm">
                Adjust Quantity
              </Button>
            </div>
          </DrawerFooter>
        </MobileDrawer>
      ) : (
        <Modal
          open={open}
          setOpen={setOpen}
          title="Adjust Quantity"
          ActionButton={
            <Button className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm">
              Adjust Quantity
            </Button>
          }
        >
          <div className="flex w-full flex-col gap-4 px-3 py-4">
            <div className="border-border-default tems-center flex justify-between gap-3 rounded-md border p-3 md:p-6">
              <div className="flex items-center gap-2">
                <Image src="/images/image.png" alt="stock image" width={32} height={32} />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <div className="text-text-default text-sm font-semibold">Textbook</div>
                  </div>
                  <div className="text-text-subtle text-xs">
                    Current Stock
                    <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default rounded-md border font-medium">89</Badge>
                  </div>
                </div>
              </div>

              <Badge className="border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! text-text-default h-7! rounded-md border">
                Lawanson
              </Badge>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">Quantity Adjustment</Label>
              <div className="bg-bg-input-soft flex h-8 items-center rounded-md">
                <Input className="bg-bg-none! text-text-default h-7! w-full border-none" placeholder="0" />
                <div className="border-border-default flex h-8 w-7 flex-col items-center gap-2 border-l p-1">
                  <ArrowUpS
                    fill="var(--color-icon-default-muted)"
                    className="border-border-default cursor-pointer border-b"
                    onClick={() => setStockLevel(true)}
                  />

                  <ArrowDownS fill="var(--color-icon-default-muted)" className="cursor-pointer" />
                </div>
              </div>
              <div className="text-text-muted text-xs">Use + for increases (e.g., +10) or - for decreases (e.g., -5)</div>
            </div>

            {stockLevel && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <Badge className="border-border-default bg-bg-badge-red text-bg-basic-red-strong rounded-md border text-xs font-medium">
                    <Subtract fill="var(--color-bg-basic-red-strong)" /> Stock Decrease
                  </Badge>
                  <div className="flex items-center gap-2">
                    <div className="text-text-subtle text-xs font-medium">New Total</div>
                    <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default rounded-md border">89</Badge>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">Reason for Decrease</Label>
                  <Select value={selectReasons} onValueChange={setSelectReason}>
                    <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
                      <SelectValue>
                        <span className="text-text-default text-sm">{selectReasons}</span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-bg-default border-border-default">
                      {reasons.map(rs => (
                        <SelectItem key={rs} value={rs} className="text-text-default text-sm">
                          {rs}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-bg-badge-blue border-border-default flex items-start gap-2 rounded-md border px-3 py-2">
                  <Information fill="var(--color-bg-basic-blue-accent)" />
                  <div className="flex flex-col gap-1">
                    <div className="text-text-default text-sm font-medium">Adjustment Summary</div>
                    <div className="text-text-muted text-sm">Removing 1 Pcs - Damage</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
