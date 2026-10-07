"use client";

import { WeeklyGlance, WeeklyLearningAreaRow } from "@/api/diary";
import { Avatar } from "@/components/Avatar";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useIsMobile";

import { DiaryCard, DiaryCardHeader, formatShortDate } from "../shared";
import { LearningAreasTable } from "./LearningAreasTable";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  weekNumber: number;
  weekStart: string;
  weekEnd: string;
  teacherName: string;
  teacherRole: string;
  armName: string;
  glance: WeeklyGlance;
  areas: WeeklyLearningAreaRow[];
  teacherComment: string;
  nextWeekFocus: string;
};

const GlanceTile = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-bg-basic-gray-alpha-2 flex flex-1 flex-col gap-1 rounded-md p-3">
    <p className="text-text-muted text-[11px] leading-4 font-medium">{label}</p>
    <p className="text-text-default text-lg leading-6.5 font-medium">{value}</p>
  </div>
);

export const WeeklyParentPreviewModal = ({
  open,
  setOpen,
  weekNumber,
  weekStart,
  weekEnd,
  teacherName,
  teacherRole,
  armName,
  glance,
  areas,
  teacherComment,
  nextWeekFocus,
}: Props) => {
  const isMobile = useIsMobile();

  const body = (
    <div className="bg-bg-basic-gray-alpha-2 max-h-[70vh] overflow-y-auto rounded-b-xl p-4 md:max-h-[75vh]">
      <div className="flex w-full flex-col gap-4">
        <div className="border-border-blue bg-bg-badge-blue rounded-lg border px-3 py-2.5">
          <p className="text-text-default text-xs leading-4">This is how parents will see this report. Nothing here can be changed or signed.</p>
        </div>

        <h2 className="text-text-default text-base leading-6 font-semibold">
          Week {weekNumber} · {formatShortDate(weekStart)} – {formatShortDate(weekEnd)}
        </h2>

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
          <div className="p-4">
            <p className="text-text-default text-sm leading-5 font-semibold">Your child&apos;s week</p>
          </div>
          <div className="flex flex-col gap-3 px-4 pb-4 sm:flex-row">
            <GlanceTile label="Days present" value={`${glance.daysPresent} of ${glance.daysTotal}`} />
            <GlanceTile label="Homework set" value={String(glance.homeworkSet)} />
            <GlanceTile label="Notes from teacher" value={String(glance.notesToParents)} />
          </div>
        </DiaryCard>

        <LearningAreasTable
          rows={areas}
          onChange={() => {}}
          readOnly
          title="How your child is getting on"
          description="Progress for this half term. “Emerging” simply means it is still new — it is not a grade."
        />

        <DiaryCard>
          <DiaryCardHeader title={`What ${teacherName} says`} />
          <div className="flex flex-col gap-3 px-4 pb-4">
            {teacherComment.trim() ? (
              <p className="text-text-default text-[13px] leading-4.5 whitespace-pre-wrap">{teacherComment}</p>
            ) : (
              <p className="text-text-muted text-[13px] leading-4.5">No weekly comment has been written yet.</p>
            )}
            {nextWeekFocus.trim() && (
              <div className="bg-bg-basic-gray-alpha-2 flex flex-col gap-1 rounded-md p-3">
                <p className="text-text-default text-xs leading-4 font-medium">Next week&apos;s focus</p>
                <p className="text-text-muted text-[13px] leading-4.5 whitespace-pre-wrap">{nextWeekFocus}</p>
              </div>
            )}
          </div>
        </DiaryCard>

        <div className="border-border-default bg-bg-sidebar-subtle flex flex-col gap-3 rounded-lg border p-4">
          <p className="text-text-default text-sm leading-5 font-semibold">Your response</p>
          <div className="flex flex-wrap items-center gap-2.5">
            <Button disabled className="bg-bg-state-primary text-text-white-default rounded-full px-3.5">
              Seen &amp; signed
            </Button>
            <Button disabled className="bg-bg-card text-text-default rounded-full px-3.5">
              Add a comment
            </Button>
          </div>
        </div>
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
