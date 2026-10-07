"use client";

import { DiaryEntryPayload, SnapshotField, SnapshotValues } from "@/api/diary";
import { Avatar } from "@/components/Avatar";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/useIsMobile";

import { DiaryCard, DiaryCardHeader, DotBadge, EntryTypeBadge, formatDayAndMonth } from "../shared";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  date: string;
  teacherName: string;
  teacherRole: string;
  armName: string;
  entries: DiaryEntryPayload[];
  snapshotFields: SnapshotField[];
  snapshot: SnapshotValues;
  requireAcknowledgement: boolean;
  requestComment: boolean;
};

export const ParentPreviewModal = ({
  open,
  setOpen,
  date,
  teacherName,
  teacherRole,
  armName,
  entries,
  snapshotFields,
  snapshot,
  requireAcknowledgement,
  requestComment,
}: Props) => {
  const isMobile = useIsMobile();

  const visibleEntries = entries.filter(entry => entry.activity.trim() || entry.note.trim());
  const snapshotItems = snapshotFields
    .filter(field => snapshot[field.key])
    .map(field => ({ key: field.key, label: field.label, value: snapshot[field.key] }));

  const body = (
    <div className="bg-bg-basic-gray-alpha-2 max-h-[70vh] overflow-y-auto rounded-b-xl p-4 md:max-h-[75vh]">
      <div className="flex w-full flex-col gap-4">
        <div className="border-border-blue bg-bg-badge-blue rounded-lg border px-3 py-2.5">
          <p className="text-text-default text-xs leading-4">This is how parents will see this report. Nothing here can be changed or signed.</p>
        </div>

        <h2 className="text-text-default text-base leading-6 font-semibold">{formatDayAndMonth(date)}</h2>

        <DiaryCard>
          <div className="flex items-center gap-3 p-4">
            <Avatar className="size-9 shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-text-default text-[13px] leading-4.5 font-medium">
                {teacherName} · {teacherRole}
                {armName ? `, ${armName}` : ""}
              </p>
              <p className="text-text-muted text-xs leading-4">Signed and sent when published</p>
            </div>
          </div>
        </DiaryCard>

        <DiaryCard>
          <DiaryCardHeader title="Today's notes and reminders" />
          {visibleEntries.map((entry, index) => {
            const tickable = entry.type === "HOMEWORK" || entry.type === "REMINDER";
            return (
              <div key={entry.id ?? index} className="border-border-default flex gap-3 border-t px-4 py-3.5">
                {tickable ? (
                  <Checkbox checked={false} disabled className="mt-0.5 size-4.5 shrink-0" />
                ) : (
                  <span className="size-4.5 shrink-0" aria-hidden />
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-text-default text-[13px] leading-4.5 font-medium">{entry.activity}</p>
                    <EntryTypeBadge type={entry.type} dueDate={entry.dueDate} />
                  </div>
                  {entry.note && <p className="text-text-muted text-[13px] leading-4.5">{entry.note}</p>}
                </div>
              </div>
            );
          })}
          {visibleEntries.length === 0 && (
            <p className="text-text-muted border-border-default border-t px-4 py-8 text-center text-[13px]">No notes were added for today.</p>
          )}
        </DiaryCard>

        {snapshotItems.length > 0 && (
          <DiaryCard>
            <div className="p-4">
              <p className="text-text-default text-sm leading-5 font-semibold">Your child&apos;s day</p>
            </div>
            <div className="flex flex-wrap gap-2 px-4 pb-4">
              {snapshotItems.map(item => (
                <span
                  key={item.key}
                  className="border-border-default bg-bg-basic-gray-alpha-4 text-text-default rounded-full border px-3 py-1.5 text-xs leading-4 font-medium"
                >
                  {item.label}: {item.value}
                </span>
              ))}
            </div>
          </DiaryCard>
        )}

        {requestComment && (
          <DiaryCard>
            <DiaryCardHeader title="Your comment" description="Only your child's teachers can see this." />
            <div className="px-4 pb-4">
              <Textarea
                disabled
                placeholder={`Write a reply to ${teacherName}…`}
                aria-label="Parent comment preview"
                rows={3}
                className="border-border-default bg-bg-input-soft! w-full resize-none rounded-md border px-3 py-2 text-[13px]"
              />
            </div>
          </DiaryCard>
        )}

        {requireAcknowledgement ? (
          <div className="border-border-default bg-bg-sidebar-subtle flex flex-col gap-3 rounded-lg border p-4">
            <div className="flex flex-col gap-1">
              <p className="text-text-default text-sm leading-5 font-semibold">Parent&apos;s signature</p>
              <p className="text-text-muted text-xs leading-4">Parents tap &ldquo;Seen &amp; signed&rdquo; to confirm they have read this report.</p>
            </div>
            <Button disabled className="bg-bg-state-primary text-text-white-default w-fit rounded-full px-3.5">
              Seen &amp; signed
            </Button>
          </div>
        ) : (
          <DotBadge label="Parents are not asked to sign" dot="bg-bg-basic-gray-accent" />
        )}
      </div>
    </div>
  );

  return isMobile ? (
    <MobileDrawer open={open} setIsOpen={setOpen} title="Preview as parent">
      {body}
    </MobileDrawer>
  ) : (
    <Modal open={open} setOpen={setOpen} title="Preview as parent" showFooter={false} className="gap-0 overflow-hidden sm:max-w-170">
      {body}
    </Modal>
  );
};
