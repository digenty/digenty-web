"use client";

import { Alert } from "./Alert";
import { AlertType } from "./type";

const alertData = [
  {
    id: 0,
    title: "Report Cards Pending for SS 1 Art",
    description: "Class Teacher has not yet submitted report cards for SS1 Art.",
    action: "Notify Teacher",
    type: AlertType.results,
  },
  {
    id: 1,
    title: "Fee collection below 50% for SS3",
    description: "Only 23 out of 48 students have paid their fees.",
    action: "Send Reminder",
    type: AlertType.fees,
  },
  {
    id: 2,
    title: "Multiple Unmarked Attendance in SS1",
    description: "There are several unmarked attendances for today's class in SS1.",
    action: "Review Attendance",
    type: AlertType.attendance,
  },
  {
    id: 3,
    title: "Multiple Unmarked Attendance in SS1",
    description: "There are several unmarked attendances for today's class in SS1.",
    action: "Review Attendance",
    type: AlertType.attendance,
  },
  {
    id: 4,
    title: "Multiple Unmarked Attendance in SS1",
    description: "There are several unmarked attendances for today's class in SS1.",
    action: "Review Attendance",
    type: AlertType.attendance,
  },
];

export const Alerts = () => {
  return (
    <div className="base:pb-12 relative h-full space-y-6 overflow-hidden px-5 py-5 md:space-y-5">
      <h3 className="text-text-default text-xs font-semibold">Alerts</h3>

      <div className="flex h-full flex-col gap-3 overflow-y-auto">
        {alertData.map(alert => (
          <Alert key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
};
