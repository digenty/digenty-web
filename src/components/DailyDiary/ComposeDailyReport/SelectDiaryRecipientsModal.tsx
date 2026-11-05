"use client";

import { useState } from "react";

import { Avatar } from "@/components/Avatar";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/useIsMobile";

export type DiaryPupil = { studentId: number; studentName: string; studentImage: string | null };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pupils: DiaryPupil[];
  includedIds: Set<number>;
  onConfirm: (includedIds: Set<number>) => void;
};

/**
 * Who actually receives this batch. Everyone starts selected (same behaviour as today's "whole class"
 * publish) — deselecting a pupil here means their parent gets nothing at all when this batch is published.
 */
export const SelectDiaryRecipientsModal = ({ open, onOpenChange, pupils, includedIds, onConfirm }: Props) => {
  const isMobile = useIsMobile();
  const [localIncluded, setLocalIncluded] = useState(includedIds);
  const [search, setSearch] = useState("");

  const toggle = (studentId: number, checked: boolean) =>
    setLocalIncluded(prev => {
      const next = new Set(prev);
      if (checked) next.add(studentId);
      else next.delete(studentId);
      return next;
    });

  const visible = pupils.filter(pupil => pupil.studentName.toLowerCase().includes(search.trim().toLowerCase()));

  const handleConfirm = () => {
    onConfirm(localIncluded);
    onOpenChange(false);
  };

  const doneButton = (
    <Button
      onClick={handleConfirm}
      className="bg-bg-state-primary hover:bg-bg-state-primary/90! text-text-white-default flex h-7 items-center gap-1.5 rounded-md px-3 text-sm"
    >
      Done
      <span className="bg-bg-badge-white border-border-white text-text-default ml-1 flex h-4 min-w-4 items-center justify-center rounded-sm px-1 text-xs">
        {localIncluded.size}
      </span>
    </Button>
  );

  const content = (
    <div>
      <div className="px-4 py-3">
        <SearchInput
          className="border-border-default bg-bg-input-soft! w-full border-none text-sm"
          placeholder="Search pupils…"
          value={search}
          onChange={event => setSearch(event.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 px-4 pb-3">
        <Button
          className="border-border-darker bg-bg-state-secondary text-text-default h-6 gap-1 rounded-full border px-2.5 text-xs"
          onClick={() => setLocalIncluded(new Set(pupils.map(pupil => pupil.studentId)))}
        >
          ✓ Select all
        </Button>
        <Button
          className="border-border-darker bg-bg-state-secondary text-text-muted h-6 gap-1 rounded-full border px-2.5 text-xs"
          onClick={() => setLocalIncluded(new Set())}
        >
          ✕ Clear all
        </Button>
        <div className="flex-1" />
        <p className="text-text-muted text-xs">
          {localIncluded.size} of {pupils.length} selected
        </p>
      </div>

      <div className="max-h-80 space-y-2 overflow-y-auto px-4 pb-3">
        {visible.length === 0 ? (
          <p className="text-text-muted py-8 text-center text-sm">No pupils match your search</p>
        ) : (
          visible.map(pupil => {
            const isSelected = localIncluded.has(pupil.studentId);
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
      <MobileDrawer open={open} setIsOpen={onOpenChange} title="Select recipients">
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
    <Modal open={open} setOpen={onOpenChange} title="Select recipients" ActionButton={doneButton} className="p-0 sm:max-w-2xl" showFooter>
      {content}
    </Modal>
  );
};
