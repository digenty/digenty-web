import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Time from "../Icons/Time";
import NumStudentIcon from "../Icons/NumStudentIcon";
import Approve from "../Icons/Approve";
import ArrowLeft from "../Icons/ArrowLeft";

import { OverviewCard } from "../OverviewHead/OverviewCard";
import Image from "next/image";
import BarChartIcon from "../Icons/BarChartIcon";

import GraduationCapFill from "../Icons/GraduationCapFill";
import SearchIcon from "../Icons/SearchIcon";
import AttendanceHeader from "./AttendanceHeader";

const attendanceUpdates = [
  {
    id: 0,
    classname: "JSS 1A",
    totalStudents: "32 Students",
    teacherName: "Mrs. Adebayo • Main Campus",
    lastUpdate: "Last Updated Today",
    attendancePercentage: "89% Attendance",
    view: "Open",
  },
  {
    id: 1,
    classname: "JSS 1A",
    totalStudents: "32 Students",
    teacherName: "Mrs. Adebayo • Main Campus",
    lastUpdate: "Last Updated Today",
    attendancePercentage: "89% Attendance",
    view: "Open",
  },
  {
    id: 2,
    classname: "JSS 1A",
    totalStudents: "32 Students",
    teacherName: "Mrs. Adebayo • Main Campus",
    lastUpdate: "Last Updated Today",
    attendancePercentage: "89% Attendance",
    view: "Open",
  },
  {
    id: 3,
    classname: "JSS 1A",
    totalStudents: "32 Students",
    teacherName: "Mrs. Adebayo • Main Campus",
    lastUpdate: "Last Updated Today",
    attendancePercentage: "89% Attendance",
    view: "Open",
  },
  {
    id: 4,
    classname: "JSS 1A",
    totalStudents: "32 Students",
    teacherName: "Mrs. Adebayo • Main Campus",
    lastUpdate: "Last Updated Today",
    attendancePercentage: "89% Attendance",
    view: "Open",
  },
  {
    id: 5,
    classname: "JSS 1A",
    totalStudents: "32 Students",
    teacherName: "Mrs. Adebayo • Main Campus",
    lastUpdate: "Last Updated Today",
    attendancePercentage: "89% Attendance",
    view: "Open",
  },
  {
    id: 6,
    classname: "JSS 1A",
    totalStudents: "32 Students",
    teacherName: "Mrs. Adebayo • Main Campus",
    lastUpdate: "Last Updated Today",
    attendancePercentage: "89% Attendance",
    view: "Open",
  },
  {
    id: 7,
    classname: "JSS 1A",
    totalStudents: "32 Students",
    teacherName: "Mrs. Adebayo • Main Campus",
    lastUpdate: "Last Updated Today",
    attendancePercentage: "89% Attendance",
    view: "Open",
  },
  {
    id: 8,
    classname: "JSS 1A",
    totalStudents: "32 Students",
    teacherName: "Mrs. Adebayo • Main Campus",
    lastUpdate: "Last Updated Today",
    attendancePercentage: "89% Attendance",
    view: "Open",
  },
];

export default function AttendanceUpdate() {
  return (
    <div className="flex flex-col gap-[32px]">
      <AttendanceHeader />

      <div className="grid w-full grid-cols-2 gap-3 px-[12px] py-[12px] md:grid-cols-3 md:px-[32px] lg:grid-cols-4">
        <OverviewCard
          title="Total Classes"
          icon={<GraduationCapFill fill="var(--color-icon-black-default)" />}
          value="12"
          color="var(--color-green-500)"
          iconBg="var(--teal-100)"
          percentage=""
        />
        <OverviewCard
          title="Attendance Taken"
          icon={<Approve fill="var(--color-icon-black-default)" />}
          value="8"
          color="var(--color-green-500)"
          percentage=""
          iconBg="var(--yellow-100)"
        />
        <OverviewCard
          title="Total Students"
          icon={<Image src="/icons/user-fill.svg" width={10} height={10} alt="Icon" style={{ textAlign: "center", display: "flex" }} />}
          value="50,000"
          color="var(--red-500)"
          percentage=""
          iconBg="var(--sky-100)"
        />

        <OverviewCard
          title="Overall Attendance"
          icon={<BarChartIcon fill="var(--color-icon-black-default)" />}
          value="78%"
          color=""
          percentage=""
          iconBg="var(--pink-100)"
        />
      </div>

      <div className="px-[12px] py-[12px] md:px-[32px]">
        <div className="border-border-default bg-bg-input-soft flex w-full items-center gap-[8px] rounded-md border-1 px-[8px] py-[6px] md:w-[283px]">
          <SearchIcon fill="var(--color-icon-default-muted)" />

          <input
            type="search"
            placeholder="Search"
            className="text-text-muted w-full border-none text-sm font-normal shadow-none focus:ring-0 focus:outline-none md:w-[219px]"
          />
          <span className="border-border-default min-w-[20px] rounded-xs border-1 px-[4px]">/</span>
        </div>
        <ul className="mt-5 grid grid-cols-1 gap-[30px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {attendanceUpdates.map(att => (
            <li key={att.id} className="bg-bg-subtle border-border-default flex flex-col gap-[16px] rounded-[8px] border-1 p-[24px]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-text-default text-xs font-medium">{att.classname}</p>
                  <p className="text-text-muted pt-2 text-xs font-normal">{att.teacherName}</p>
                </div>
                <Badge className="border-border-default bg-bg-badge-default text-text-muted flex items-center gap-[5px] rounded-sm text-xs font-normal">
                  <NumStudentIcon fill="var(--color-icon-default-muted)" /> {att.totalStudents}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-[16px]">
                <p className="bg-bg-badge-green text-bg-basic-green-strong border-border-default flex w-full items-center gap-[5px] rounded-sm border-1 p-[4px] text-xs font-medium">
                  <Time fill="var(--color-bg-basic-green-strong)" /> {att.lastUpdate}
                </p>
                <p className="border-border-default text-bg-basic-cyan-strong bg-bg-badge-cyan flex w-full items-center gap-[5px] rounded-sm border-1 p-[4px] text-xs font-medium">
                  <Approve fill="var(--color-bg-basic-cyan-strong)" /> {att.attendancePercentage}
                </p>
              </div>
              <Button className="border-border-darker bg-bg-state-secondary text-text-default flex items-center gap-[10px] rounded-sm border-1 px-8 py-4 text-sm font-medium">
                {att.view} <ArrowLeft fill="var(--color-icon-default-muted)" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
