"use client";

import { useState } from "react";

import { Avatar } from "@/components/Avatar";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/useIsMobile";

import { DiaryPupil } from "./SelectDiaryRecipientsModal";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceName: string;
  targets: DiaryPupil[];
  defaultSelectedIds: Set<number>;
  onConfirm: (targetStudentIds: number[]) => void;
  isPending?: boolean;
};

/** Copies the active pupil's entries, snapshot, private note and sign-off settings onto other pupils' drafts. */
export const CopyToPupilsModal = ({ open, onOpenChange, sourceName, targets, defaultSelectedIds, onConfirm, isPending }: Props) => {
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState(defaultSelectedIds);

  const toggle = (studentId: number, checked: boolean) =>
    setSelected(prev => {
      const next = new Set(prev);
      if (checked) next.add(studentId);
      else next.delete(studentId);
      return next;
    });

  const doneButton = (
    <Button
      onClick={() => onConfirm(Array.from(selected))}
      disabled={isPending || selected.size === 0}
      className="bg-bg-state-primary hover:bg-bg-state-primary/90! text-text-white-default h-7 rounded-md px-3 text-sm"
    >
      {isPending ? "Copying…" : `Copy to ${selected.size}`}
    </Button>
  );

  const content = (
    <div>
      <div className="border-border-blue bg-bg-badge-blue mx-4 mt-3 rounded-lg border px-3 py-2.5">
        <p className="text-text-default text-xs leading-4">
          This replaces the entries, snapshot, private note and sign-off settings for anyone selected below with {sourceName}&apos;s. Only pupils you
          haven&apos;t already customised are pre-selected.
        </p>
      </div>

      <div className="flex items-center gap-2 px-4 pt-3 pb-3">
        <Button
          className="border-border-darker bg-bg-state-secondary text-text-default h-6 gap-1 rounded-full border px-2.5 text-xs"
          onClick={() => setSelected(new Set(targets.map(pupil => pupil.studentId)))}
        >
          ✓ Select all
        </Button>
        <Button
          className="border-border-darker bg-bg-state-secondary text-text-muted h-6 gap-1 rounded-full border px-2.5 text-xs"
          onClick={() => setSelected(new Set())}
        >
          ✕ Clear all
        </Button>
      </div>

      <div className="max-h-80 space-y-2 overflow-y-auto px-4 pb-3">
        {targets.length === 0 ? (
          <p className="text-text-muted py-8 text-center text-sm">No other pupils to copy to</p>
        ) : (
          targets.map(pupil => {
            const isSelected = selected.has(pupil.studentId);
            return (
              <div
                key={pupil.studentId}
                className={`border-border-default flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                  isSelected ? "bg-bg-state-soft" : "hover:bg-bg-state-ghost-hover"
                }`}
                onClick={() => toggle(pupil.studentId, !isSelected)}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={checked => toggle(pupil.studentId, checked === true)}
                  onClick={event => event.stopPropagation()}
                  className="shrink-0"
                />
                <Avatar className="size-8" url={pupil.studentImage ?? undefined} />
                <p className="text-text-default text-sm font-medium">{pupil.studentName}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <MobileDrawer open={open} setIsOpen={onOpenChange} title={`Copy ${sourceName}'s report to…`}>
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
    <Modal
      open={open}
      setOpen={onOpenChange}
      title={`Copy ${sourceName}'s report to…`}
      ActionButton={doneButton}
      className="p-0 sm:max-w-2xl"
      showFooter
    >
      {content}
    </Modal>
  );
};
