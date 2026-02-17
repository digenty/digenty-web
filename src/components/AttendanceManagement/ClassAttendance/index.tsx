"use client";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetArmAttendance } from "@/hooks/queryHooks/useAttendance";
import { format } from "date-fns";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AttendanceTable } from "./AttendanceTable";
import { ClassAttendanceHeader } from "./ClassAttendanceHeader";

export const ClassAttendance = () => {
  const path = usePathname();
  const armId = path.split("/")[3] ?? "";
  const classArmName = path.split("/")[2] ?? "";
  const [date, setDate] = useState<Date>(new Date());

  const { data, isPending, isError } = useGetArmAttendance({ armId: Number(armId), limit: 200, page: 0, date: format(date, "yyyy-MM-dd") });
  const [attendanceList, setAttendanceList] = useState<{ studentId: number; isPresent: boolean }[]>([]);

  return (
    <div className="space-y-6">
      <ClassAttendanceHeader
        classArmName={classArmName.split("-").join(" ")}
        attendanceList={attendanceList}
        setAttendanceList={setAttendanceList}
        students={data?.data?.content || []}
        date={date}
        setDate={setDate}
      />

      <div className="px-4 pb-10 md:px-8">
        {isError && (
          <div className="flex h-80 items-center justify-center">
            <ErrorComponent
              title="Could not load attendance sheet"
              description="This is our problem, we are looking into it so as to serve you better"
              buttonText="Go to the Home page"
            />
          </div>
        )}
        {isPending && <Skeleton className="bg-bg-input-soft h-200 w-full" />}

        {!isPending && !isError && data.data.content.length === 0 && (
          <div className="flex h-80 items-center justify-center">
            <ErrorComponent
              title="No Students in this arm yet"
              description="No students have been added to this arm"
              buttonText="Add a student"
              url="/student-and-parent-record/add-student"
            />
          </div>
        )}

        {!isPending && !isError && data.data.content.length > 0 && (
          <AttendanceTable students={data.data.content} attendanceList={attendanceList} setAttendanceList={setAttendanceList} />
        )}
      </div>
    </div>
  );
};
