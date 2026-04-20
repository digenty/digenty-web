"use client";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetArmAttendance } from "@/hooks/queryHooks/useAttendance";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { format } from "date-fns";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AttendanceTable } from "./AttendanceTable";
import { ClassAttendanceHeader } from "./ClassAttendanceHeader";
import { ClassAttendanceWrapper } from "./ClassAttendanceWrapper";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { Term } from "@/api/types";

export const ClassAttendance = () => {
  const path = usePathname();
  const armId = path.split("/")[4] ?? "";
  const classArmName = path.split("/")[3] ?? "";
  const [date, setDate] = useState<Date>(new Date());
  const [attendanceList, setAttendanceList] = useState<{ studentId: number; isPresent: boolean }[]>([]);
  const user = useLoggedInUser();

  const { data, isLoading, isError } = useGetArmAttendance({ armId: Number(armId), limit: 200, page: 0, date: format(date, "yyyy-MM-dd") });
  const { data: terms } = useGetTerms(user?.schoolId);

  const currentTerm = terms?.data?.terms?.find((term: Term) => term.isActiveTerm);

  useEffect(() => {
    setAttendanceList([]);
  }, [date]);

  return (
    <ClassAttendanceWrapper armId={Number(armId)} isLoading={isLoading}>
      <div className="space-y-6">
        <ClassAttendanceHeader
          classArmName={classArmName.split("-").join(" ")}
          attendanceList={attendanceList}
          setAttendanceList={setAttendanceList}
          students={data?.data?.studentsPresent || []}
          date={date}
          setDate={setDate}
          activeTerm={currentTerm}
        />

        <div className="px-4 pb-10 md:px-8">
          {isError && !data && (
            <div className="flex h-80 items-center justify-center">
              <ErrorComponent
                title="Could not load attendance sheet"
                description="This is our problem, we are looking into it so as to serve you better"
                buttonText="Go to the Home page"
              />
            </div>
          )}
          {isLoading && <Skeleton className="bg-bg-input-soft h-200 w-full" />}

          {!isLoading && !isError && data.data.studentsPresent.length === 0 && (
            <div className="flex h-80 items-center justify-center">
              <ErrorComponent
                title="No Students in this arm yet"
                description="No students have been added to this arm"
                buttonText="Add a student"
                url="/staff/student-and-parent-record/add-student"
              />
            </div>
          )}

          {data && !isLoading && !isError && data.data.studentsPresent.length > 0 && (
            <AttendanceTable students={data.data.studentsPresent} attendanceList={attendanceList} setAttendanceList={setAttendanceList} />
          )}
        </div>
      </div>
    </ClassAttendanceWrapper>
  );
};
