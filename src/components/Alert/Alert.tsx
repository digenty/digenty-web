import Bill from "../Icons/Bill";
import CalendarCheck from "../Icons/CalendarCheck";
import FileList3 from "../Icons/FileList3";
import { Button } from "../ui/button";
import { ActiveAlert } from "./type";

type AlertListProps = {
  alert: ActiveAlert;
};

export const Alert = ({ alert }: AlertListProps) => {
  return (
    <li className="border-border-default flex items-start gap-3 rounded-md border px-3 py-4">
      <div className="bg-bg-state-soft flex size-7 items-center justify-center rounded-full p-1">
        {alert.type === "results" && <FileList3 fill="var(--color-bg-basic-sky-strong)" className="size-4" />}
        {alert.type === "fees" && <Bill fill="var(--color-bg-basic-teal-strong)" className="size-4" />}
        {alert.type === "attendance" && <CalendarCheck fill="var(--color-bg-basic-yellow-strong)" className="size-4" />}
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <p className="text-text-default text-sm font-medium">{alert.title}</p>
        <p className="text-text-subtle text-sm font-normal">{alert.description}</p>
        <Button className="bg-bg-state-soft hover:bg-bg-state-soft-hover text-text-subtle h-6 w-fit rounded-md px-1.5 text-xs">{alert.action}</Button>
      </div>
    </li>
  );
};
