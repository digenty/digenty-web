"use client";
import Eye from "@/components/Icons/Eye";
import Notification2 from "@/components/Icons/Notification2";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Subject } from ".";
import { Avatar } from "@/components/Avatar";
import { useClassesStore } from "@/store/classes";

export const ClassOverviewCard = ({ subject }: { subject: Subject }) => {
  const { setOpenNotifyTeacher } = useClassesStore();
  return (
    <div className="border-border-darker bg-bg-subtle w-full rounded-md border text-sm">
      <div className="border-border-darker flex items-center justify-between border-b px-3 py-[8.5px]">
        <p className="text-text-muted font-medium">Subject</p>
        <p className="text-text-default font-medium">{subject?.title}</p>
      </div>

      <div className="border-border-darker flex items-center justify-between border-b px-3 py-[9px]">
        <p className="text-text-muted font-medium">Teacher</p>
        <div className="flex items-center gap-2">
          <Avatar username="Damilare John" className="size-5" url="" />
          <span className="text-text-default cursor-pointer pl-0 text-sm">{subject.teacher}</span>
        </div>
      </div>

      <div className="border-border-darker flex items-center justify-between border-b px-3 py-[9px]">
        <p className="text-text-muted font-medium">Status</p>
        <p className="text-text-default font-medium">
          <span
            className={cn(
              "border-border-default rounded-md border px-2 py-0.5 text-xs",
              subject?.status === "Submitted"
                ? "bg-bg-badge-green text-bg-basic-green-strong"
                : subject?.status === "In Progress"
                  ? "bg-bg-badge-orange text-bg-basic-orange-strong"
                  : "bg-bg-badge-default text-text-subtle",
            )}
          >
            {subject?.status}
          </span>
        </p>
      </div>

      <div className="flex justify-between gap-4 px-3 py-2">
        <Button
          className="border-border-darker bg-bg-state-secondary text-text-default h-8! flex-1 rounded-md border px-1.5! font-medium"
          onClick={() => setOpenNotifyTeacher(true)}
        >
          <Notification2 fill="var(--color-icon-default-muted)" className="size-4" />
          <span className="text-text-default">Notify Teacher</span>
        </Button>

        <Button
          className="border-border-darker bg-bg-state-secondary text-text-default h-8! flex-1 rounded-md border px-1.5! font-medium"
          // onClick={() => setIsFilterOpen(true)}
        >
          <Eye fill="var(--color-icon-default-muted)" className="size-4" />
          <span className="text-text-default">View</span>
        </Button>
      </div>
    </div>
  );
};
