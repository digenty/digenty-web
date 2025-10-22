"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import Image from "next/image";
import { useState } from "react";
import { Alert } from "./Alert";
import AlertIcons from "./AlertIcons";
import CalendarIcon from "./CalendarIcon";
import ReportIcon from "./ReportIcon";
import { Button } from "../ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

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
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);

  // handlers
  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % alertData.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + alertData.length) % alertData.length);
  };

  const currentAlert = alertData[currentIndex];
  return (
    <div className="relative h-full space-y-6 overflow-hidden px-5 pt-5 min-[920px]:pb-12 md:space-y-5">
      <h3 className="text-text-default text-xs font-semibold">Alerts</h3>

      {/* mobile */}
      <div className="block space-y-3 min-[920px]:hidden">
        {/* Active alert */}
        <div className="flex h-auto flex-col gap-4">
          <Alert activeAlert={currentAlert} />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePrev}
            className="bg-bg-state-soft text-text-default flex items-center gap-2 rounded-md px-3 py-1 text-sm font-semibold active:scale-95"
          >
            <ArrowLeftIcon className="text-icon-default-muted size-4" />
            Prev
          </Button>

          {/* Dots */}
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
      </div>

      <div className="hidden h-full flex-col gap-3 overflow-y-auto min-[920px]:flex">
        {alertData.map(alert => (
          <Alert key={alert.id} activeAlert={alert} />
        ))}
      </div>
    </div>
  );
};
