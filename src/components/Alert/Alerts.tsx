"use client";

import React, { useEffect, useState } from "react";
import AlertList from "./AlertList";
import AlertIcons from "./AlertIcons";
import ReportIcon from "./ReportIcon";
import CalendarIcon from "./CalendarIcon";
import Image from "next/image";

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
];

export default function Alerts() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // handlers
  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % alertData.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + alertData.length) % alertData.length);
  };

  if (isMobile) {
    const currentAlert = alertData[currentIndex];
    return (
      <div className="border-border-default bg-bg-default relative h-full w-full rounded-md border p-4 text-zinc-800">
        <h3 className="text-text-default mb-6 ml-4 text-2xl font-semibold">Alerts</h3>

        {/* Active alert */}
        <div className="m-4 flex h-auto flex-col gap-4">
          <AlertList item={currentAlert} />
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handlePrev}
            className="bg-bg-state-soft text-text-default flex items-center gap-2 rounded-md px-3 py-1 text-sm font-semibold active:scale-95"
          >
            <Image src="/icons/ArrowLeft.svg" alt="next icon" width={13} height={13} />
            Prev
          </button>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2">
            {alertData.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-200 ${index === currentIndex ? "bg-bg-basic-gray-accent w-3" : "bg-bg-basic-gray-subtle2"}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="bg-bg-state-soft text-text-default flex items-center gap-2 rounded-md px-3 py-1 text-sm font-semibold active:scale-95"
          >
            Next <Image src="/icons/ArrowRight.svg" alt="next icon" width={13} height={13} />
          </button>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="border-border-default bg-bg-default rounded-md border p-4">
      <h3 className="text-text-default mb-6 ml-2 text-2xl font-semibold">Alerts</h3>
      <ul className="flex flex-col gap-3">
        {alertData.map(item => (
          <AlertList key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}
