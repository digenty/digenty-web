"use client";
import Approve from "../Icons/Approve";
import BarChartIcon from "../Icons/BarChartIcon";

import { Branch, Term } from "@/api/types";
import { useGetAllAttendance } from "@/hooks/queryHooks/useAttendance";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useState } from "react";
import { ErrorComponent } from "../Error/ErrorComponent";
import GraduationCapFill from "../Icons/GraduationCapFill";
import NumStudentIcon from "../Icons/NumStudentIcon";
import { OverviewCard } from "../OverviewCard";
import { SearchInput } from "../SearchInput";
import { Skeleton } from "../ui/skeleton";
import { AttendanceCards } from "./AttendanceCards";
import { AttendanceHeader } from "./AttendanceHeader";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";

export const AttendanceManagement = () => {
  useBreadcrumb([{ label: "Attendance Management", url: "/attendance" }]);

  const [branchSelected, setBranchSelected] = useState<Branch | null>(null);
  const [termSelected, setTermSelected] = useState<Term | null>(null);
  const [activeSession, setActveSesion] = useState<string | null>(null);
  const user = useLoggedInUser();
  console.log(user, "!!!!!!!");

  const { data, isPending, isError } = useGetAllAttendance(branchSelected?.id, termSelected?.termId);

  const attendanceStats = {
    totalClasses: data?.data.totalClasses ?? 0,
    attendanceTken: data?.data.numberOfClassAttendanceTaken ?? 0,
    totalStudents: data?.data.totalStudents ?? 0,
    overallAttendance: data?.data.overallAttendancePercentage ?? 0,
  };

  return (
    <div className="flex flex-col">
      <AttendanceHeader
        setBranchSelected={setBranchSelected}
        branchSelected={branchSelected}
        termSelected={termSelected}
        setTermSelected={setTermSelected}
        activeSession={activeSession}
        setActiveSession={setActveSesion}
      />

      <div className="space-y-6 px-4 pt-4 pb-8 md:space-y-7.5 md:px-8 md:pt-6 md:pb-12">
        <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          <OverviewCard
            title="Total Classes"
            Icon={() => (
              <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex w-6 items-center justify-center rounded-xs border p-1">
                <GraduationCapFill fill="var(--color-icon-default)" />
              </div>
            )}
            value={`${attendanceStats.totalClasses}`}
          />

          <OverviewCard
            title="Attendance Taken"
            Icon={() => (
              <div className="bg-bg-basic-yellow-subtle border-bg-basic-yellow-accent flex w-6 items-center justify-center rounded-xs border p-1">
                <Approve fill="var(--color-icon-default)" />
              </div>
            )}
            value={`${attendanceStats.attendanceTken}`}
          />

          <OverviewCard
            title="Total Students"
            Icon={() => (
              <div className="bg-bg-basic-sky-subtle border-bg-basic-sky-accent flex w-6 items-center justify-center rounded-xs border p-1">
                <NumStudentIcon width={10} height={10} fill="var(--color-icon-default)" />
              </div>
            )}
            value={`${attendanceStats.totalStudents}`}
          />

          <OverviewCard
            title="Overall Attendance"
            Icon={() => (
              <div className="bg-bg-basic-pink-subtle border-bg-basic-pink-accent flex w-6 items-center justify-center rounded-xs border p-1">
                <BarChartIcon fill="var(--color-icon-default)" />
              </div>
            )}
            value={`${attendanceStats.overallAttendance.toFixed(0)}%`}
          />
        </div>

        <SearchInput className="bg-bg-input-soft! w-full rounded-md border-none md:w-80" />

        {isError && (
          <div className="flex h-80 items-center justify-center">
            <ErrorComponent
              title="Could not get Attendance data"
              description="This is our problem, we are looking into it so as to serve you better"
              buttonText="Go to the Home page"
            />
          </div>
        )}

        {isPending && (
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="bg-bg-input-soft h-50 w-full" />
            ))}
          </div>
        )}

        {!isPending && !isError && data?.data.classArmAttendanceCardList?.length === 0 && (
          <div className="flex h-80 items-center justify-center">
            <ErrorComponent title="No Attendance data found" description="No attendance has been taken yet." buttonText="Create Attendance" />
          </div>
        )}

        <AttendanceCards attendance={data?.data.classArmAttendanceCardList || []} />
      </div>
    </div>
  );
};
