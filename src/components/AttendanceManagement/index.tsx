"use client";
import Approve from "../Icons/Approve";
import BarChartIcon from "../Icons/BarChartIcon";

import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import GraduationCapFill from "../Icons/GraduationCapFill";
import NumStudentIcon from "../Icons/NumStudentIcon";
import { OverviewCard } from "../OverviewCard";
import AttendanceCards from "./AttendanceCards";
import AttendanceHeader from "./AttendanceHeader";

export const AttendanceManagement = () => {
  useBreadcrumb([{ label: "Attendance Management", url: "/attendance" }]);

  return (
    <div className="flex flex-col">
      <AttendanceHeader />

      <div className="space-y-6 px-4 pt-4 pb-8 md:space-y-7.5 md:px-8 md:pt-6 md:pb-12">
        <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          <OverviewCard
            title="Total Classes"
            Icon={() => (
              <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex w-6 items-center justify-center rounded-xs border p-1">
                <GraduationCapFill fill="var(--color-icon-default)" />
              </div>
            )}
            value="12"
          />

          <OverviewCard
            title="Attendance Taken"
            Icon={() => (
              <div className="bg-bg-basic-yellow-subtle border-bg-basic-yellow-accent flex w-6 items-center justify-center rounded-xs border p-1">
                <Approve fill="var(--color-icon-default)" />
              </div>
            )}
            value="8"
          />

          <OverviewCard
            title="Total Students"
            Icon={() => (
              <div className="bg-bg-basic-sky-subtle border-bg-basic-sky-accent flex w-6 items-center justify-center rounded-xs border p-1">
                <NumStudentIcon width={10} height={10} fill="var(--color-icon-default)" />
              </div>
            )}
            value="50,000"
          />

          <OverviewCard
            title="Overall Attendance"
            Icon={() => (
              <div className="bg-bg-basic-pink-subtle border-bg-basic-pink-accent flex w-6 items-center justify-center rounded-xs border p-1">
                <BarChartIcon fill="var(--color-icon-default)" />
              </div>
            )}
            value="78%"
          />
        </div>

        <AttendanceCards />
      </div>
    </div>
  );
};
