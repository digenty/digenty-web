import React from "react";
import AlertList from "./AlertList";
import AlertIcons from "./AlertIcons";
import ReportIcon from "./ReportIcon";
import CalendarIcon from "./CalendarIcon";

const alertData = [
  {
    id: 0,
    title: "Report Cards Pending for SS 1 Art",
    description: "Class Teacher has not yet submitted report cards for SS1 Art.",
    icon: ReportIcon,
    label: "Notify Teacher",
    iconColor: "var(--chart-1)",
  },
  {
    id: 1,
    title: "Free collection below 50% for SS3",
    description: "Only 23 out of 48 students have paid their fees.",
    icon: AlertIcons,
    label: "Send Reminder",
    iconColor: "var(--color-success)",
  },
  {
    id: 2,
    title: "Multiple Unmarked Attendace  in SS1",
    description: "There are several umnarked attendance for today's attendance in SS1",
    icon: CalendarIcon,
    label: "Review Attendance",
    iconColor: "var(--color-warning)",
  },
];

export default function Alerts() {
  return (
    <div className="border-default-transparent/5 rounded-md border p-4 text-zinc-800">
      <h3 className="mb-8 ml-4 text-2xl font-semibold">Alert</h3>
      <ul className="m-4 flex h-100 flex-col gap-4 overflow-y-auto">
        {alertData.map((item, idx) => (
          <AlertList item={item} key={idx} />
        ))}
      </ul>
    </div>
  );
}
