import { CalendarEventFill, CloseFill, Edit, TimeFill } from "@digenty/icons";

import { Button } from "../../ui/button";

type CampaignScheduleCardProps = {
  date: string;
  time: string;
  onCancel: () => void;
  onEdit: () => void;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
};

const formatTime = (time: string) => {
  if (!time) return "";
  const [hStr, m] = time.split(":");
  const h = parseInt(hStr, 10);
  if (Number.isNaN(h)) return time;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m} ${period}`;
};

export const CampaignScheduleCard = ({ date, time, onCancel, onEdit }: CampaignScheduleCardProps) => {
  return (
    <div className="border-border-default bg-bg-card-subtle flex flex-col gap-3 rounded-md border p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-2">
        <span className="text-text-default text-sm font-semibold">Campaign Schedule</span>
        <div className="text-text-muted flex flex-col gap-1 text-sm">
          <div className="flex items-center gap-2">
            <CalendarEventFill fill="var(--color-icon-default-muted)" className="size-4" />
            <span>{formatDate(date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <TimeFill fill="var(--color-icon-default-muted)" className="size-4" />
            <span>{formatTime(time)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={onCancel}
          className="bg-bg-state-secondary text-text-default border-border-darker flex h-8 items-center gap-1 border px-2.5 py-1.5 text-sm font-medium"
        >
          <CloseFill fill="var(--color-icon-default-muted)" className="size-4" />
          Cancel Schedule
        </Button>
        <Button
          onClick={onEdit}
          className="bg-bg-state-secondary text-text-default border-border-darker flex h-8 items-center gap-1 border px-2.5 py-1.5 text-sm font-medium"
        >
          <Edit fill="var(--color-icon-default-muted)" className="size-4" />
          Edit
        </Button>
      </div>
    </div>
  );
};
