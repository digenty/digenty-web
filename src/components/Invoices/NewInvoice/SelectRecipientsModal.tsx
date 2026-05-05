"use client";

import { Avatar } from "@/components/Avatar";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { X } from "lucide-react";
import { useState } from "react";
import { AllStudentsListTab } from "./AllStudentsListTab";

export type Recipient = {
  type: "branch" | "class" | "arm" | "student" | "tag";
  id: number;
  name: string;
  count?: number;
  avatar?: string | null;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: Recipient[];
  onConfirm: (recipients: Recipient[]) => void;
};

const recipientKey = (r: Recipient) => `${r.type}-${r.id}`;

function SelectedFooter({ recipients, onRemove }: { recipients: Recipient[]; onRemove: (r: Recipient) => void }) {
  if (recipients.length === 0) return null;
  const visible = recipients.slice(0, 4);
  const overflow = recipients.length - 4;
  return (
    <div className="border-border-default border-t px-4 py-3">
      <p className="text-text-muted mb-2 text-xs font-medium">Selected</p>
      <div className="flex flex-wrap gap-1">
        {visible.map(r => (
          <Badge
            key={recipientKey(r)}
            className="border-border-default bg-bg-state-secondary text-text-default flex h-6 items-center gap-1 rounded-full border px-2 text-xs font-normal"
          >
            {r.type === "student" && <Avatar className="size-3.5" url={r.avatar ?? undefined} />}
            <span>
              {r.name}
              {r.count ? ` (${r.count})` : ""}
            </span>
            <X className="size-3 cursor-pointer" onClick={() => onRemove(r)} />
          </Badge>
        ))}
        {overflow > 0 && (
          <Badge className="border-border-default bg-bg-state-secondary text-text-muted h-6 rounded-full border px-2 text-xs">+{overflow}</Badge>
        )}
      </div>
    </div>
  );
}

export const SelectRecipientsModal = ({ open, onOpenChange, selected, onConfirm }: Props) => {
  const isMobile = useIsMobile();
  const [localSelected, setLocalSelected] = useState<Recipient[]>(selected);

  const selectedKeys = new Set(localSelected.map(recipientKey));

  const handleToggle = (r: Recipient, checked: boolean) =>
    setLocalSelected(prev =>
      checked ? (prev.some(x => recipientKey(x) === recipientKey(r)) ? prev : [...prev, r]) : prev.filter(x => recipientKey(x) !== recipientKey(r)),
    );

  const handleRemove = (r: Recipient) => setLocalSelected(prev => prev.filter(x => recipientKey(x) !== recipientKey(r)));
  const handleClearAll = () => setLocalSelected([]);
  const handleConfirm = () => {
    onConfirm(localSelected);
    onOpenChange(false);
  };

  const content = (
    <div>
      <AllStudentsListTab selectedKeys={selectedKeys} onToggle={handleToggle} onClearAll={handleClearAll} />
      <SelectedFooter recipients={localSelected} onRemove={handleRemove} />
    </div>
  );

  const doneButton = (
    <Button
      onClick={handleConfirm}
      className="bg-bg-state-primary hover:bg-bg-state-primary/90! text-text-white-default flex h-7 items-center gap-1.5 rounded-md px-3 text-sm"
    >
      Done
      {localSelected.length > 0 && (
        <Badge className="bg-bg-badge-white border-border-white text-text-default ml-1 h-4 min-w-4 rounded-sm px-1 text-xs">
          {localSelected.length}
        </Badge>
      )}
    </Button>
  );

  if (isMobile) {
    return (
      <MobileDrawer open={open} setIsOpen={onOpenChange} title="Select Recipients">
        {content}
        <DrawerFooter className="border-border-default border-t">
          <div className="flex justify-between">
            <DrawerClose asChild>
              <Button className="bg-bg-state-soft text-text-subtle h-7 rounded-md px-3 text-sm">Cancel</Button>
            </DrawerClose>
            {doneButton}
          </div>
        </DrawerFooter>
      </MobileDrawer>
    );
  }

  return (
    <Modal open={open} setOpen={onOpenChange} title="Select Recipients" ActionButton={doneButton} className="p-0 sm:max-w-2xl" showFooter>
      {content}
    </Modal>
  );
};
