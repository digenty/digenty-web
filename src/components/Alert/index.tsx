"use client";

import AlertIcons from "../Icons/AlertIcons";
import CalendarIcon from "../Icons/CalendarIcon";
import ReportIcon from "../Icons/ReportIcon";
import { Alert } from "./Alert";

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
    title: "Fee collection below 50% for SS3",
    description: "Only 23 out of 48 students have paid their fees.",
    icon: AlertIcons,
    label: "Send Reminder",
    iconColor: "var(--color-success)",
  },
  {
    id: 2,
    title: "Multiple Unmarked Attendance in SS1",
    description: "There are several unmarked attendances for today's class in SS1.",
    icon: CalendarIcon,
    label: "Review Attendance",
    iconColor: "var(--color-warning)",
  },
  {
    id: 3,
    title: "Multiple Unmarked Attendance in SS1",
    description: "There are several unmarked attendances for today's class in SS1.",
    icon: CalendarIcon,
    label: "Review Attendance",
    iconColor: "var(--color-warning)",
  },
  {
    id: 4,
    title: "Multiple Unmarked Attendance in SS1",
    description: "There are several unmarked attendances for today's class in SS1.",
    icon: CalendarIcon,
    label: "Review Attendance",
    iconColor: "var(--color-warning)",
  },
];

export const Alerts = () => {
  return (
    <div className="base:pb-12 relative h-full space-y-6 overflow-hidden px-5 py-5 md:space-y-5">
      <h3 className="text-text-default text-xs font-semibold">Alerts</h3>

      {/* mobile */}
      {/* <div className="block space-y-3 base:hidden">
        <div className="flex h-auto flex-col gap-4">
          <Alert activeAlert={currentAlert} />
        </div>

        <div className="flex items-center justify-between">
          <Button
            onClick={handlePrev}
            className="bg-bg-state-soft text-text-default flex items-center gap-2 rounded-md px-3 py-1 text-sm font-semibold active:scale-95"
          >
            <ArrowLeftIcon className="text-icon-default-muted size-4" />
            Prev
          </Button>

          <div className="flex items-center justify-center gap-2">
            {alertData.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-200 ${index === currentIndex ? "bg-bg-basic-gray-accent" : "bg-bg-basic-gray-subtle2"}`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="bg-bg-state-soft text-text-default flex items-center gap-2 rounded-md px-3 py-1 text-sm font-semibold active:scale-95"
          >
            Next
            <ArrowRightIcon className="text-icon-default-muted size-4" />
          </Button>
        </div>
      </div> */}

      <div className="flex h-full flex-col gap-3 overflow-y-auto">
        {alertData.map(alert => (
          <Alert key={alert.id} activeAlert={alert} />
        ))}
      </div>
    </div>
  );
};
