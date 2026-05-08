"use client";

import { ArrowRightUpFill, Edit, Subtract } from "@digenty/icons";
import Image from "next/image";

import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/useIsMobile";

import { ADJUST_REASON_LABELS } from "./constants";
import { StockTransactionRecord } from "./type";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  transaction: StockTransactionRecord | null;
  stockName?: string;
  stockImage?: string;
  onEdit?: () => void;
};

const formatReason = (reason?: string) => {
  if (!reason) return "-";
  return ADJUST_REASON_LABELS[reason as keyof typeof ADJUST_REASON_LABELS] ?? reason;
};

export const StockHistoryDetailsModal = ({ open, setOpen, transaction, stockName, stockImage, onEdit }: Props) => {
  const isMobile = useIsMobile();

  if (!transaction) return null;

  const change = transaction.change ?? transaction.quantityAdjustment ?? 0;
  const before = transaction.before ?? transaction.quantityBefore ?? 0;
  const after = transaction.after ?? transaction.quantityAfter ?? 0;
  const isIncrease = transaction.type ? transaction.type === "INCREASE" : change >= 0;
  const branchName = transaction.branchName ?? transaction.branch ?? "-";
  const changedByName = transaction.changedBy ?? transaction.userName ?? transaction.user?.name ?? "-";
  const itemName = transaction.itemName ?? stockName ?? "-";
  const itemImage = transaction.imagePath ?? stockImage ?? "/staff/images/image.png";

  const body = (
    <div className="flex w-full flex-col gap-4 px-3 py-4">
      <div className="border-border-default flex items-center justify-between gap-3 rounded-md border p-3 md:p-4">
        <div className="flex items-center gap-2">
          <Image src={itemImage} alt="stock" width={40} height={40} className="rounded-md object-cover" />
          <div className="flex flex-col gap-1">
            <div className="text-text-default text-sm font-semibold">{itemName}</div>
            <div className="flex items-center gap-2">
              {isIncrease ? (
                <Badge className="border-border-default bg-bg-badge-green text-bg-basic-green-strong rounded-md border text-xs font-medium">
                  <ArrowRightUpFill fill="var(--color-bg-basic-green-strong)" /> Stock Increase
                </Badge>
              ) : (
                <Badge className="border-border-default bg-bg-badge-red text-bg-basic-red-strong rounded-md border text-xs font-medium">
                  <Subtract fill="var(--color-bg-basic-red-strong)" /> Stock Decrease
                </Badge>
              )}
              <span className={`text-xs font-medium ${isIncrease ? "text-text-success" : "text-text-destructive"}`}>
                {isIncrease ? "+" : ""}
                {change}
              </span>
            </div>
          </div>
        </div>

        <Badge className="border-border-darker bg-bg-state-secondary! text-text-default h-7! rounded-md border">{branchName}</Badge>
      </div>

      <div className="border-border-default grid grid-cols-2 overflow-hidden rounded-md border">
        <div className="border-border-default flex flex-col gap-1 border-r p-3">
          <div className="text-text-muted text-xs">Before</div>
          <div className="text-text-default text-md font-semibold">{before}</div>
        </div>
        <div className="flex flex-col gap-1 p-3">
          <div className="text-text-muted text-xs">After</div>
          <div className="text-text-default text-md font-semibold">{after}</div>
        </div>
      </div>

      <div className="border-border-default bg-bg-card-subtle flex flex-col gap-3 rounded-md border p-3">
        <div className="flex items-center justify-between">
          <span className="text-text-muted text-sm">Reason</span>
          <span className="text-text-default text-sm font-medium">{formatReason(transaction.reason)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-muted text-sm">Changed By</span>
          <div className="flex items-center gap-2">
            <Avatar className="size-5" />
            <span className="text-text-default text-sm font-medium">{changedByName}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const editButton = onEdit ? (
    <Button onClick={onEdit} className="bg-bg-state-soft! text-text-subtle h-7! rounded-md! px-2 py-1 text-sm font-medium">
      <Edit fill="var(--color-icon-default-muted)" /> Edit
    </Button>
  ) : null;

  const doneButton = (
    <Button
      onClick={() => setOpen(false)}
      className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm"
    >
      Done
    </Button>
  );

  return isMobile ? (
    <MobileDrawer open={open} setIsOpen={setOpen} title="Inventory Change Details">
      {body}
      <DrawerFooter className="border-border-default border-t">
        <div className="flex justify-between">
          {editButton ?? (
            <DrawerClose asChild>
              <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-2 py-1 text-sm font-medium">Cancel</Button>
            </DrawerClose>
          )}
          {doneButton}
        </div>
      </DrawerFooter>
    </MobileDrawer>
  ) : (
    <Modal open={open} setOpen={setOpen} title="Inventory Change Details" cancelButton={editButton ?? undefined} ActionButton={doneButton}>
      {body}
    </Modal>
  );
};
