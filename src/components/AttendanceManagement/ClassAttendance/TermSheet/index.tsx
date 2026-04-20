"use client";
import { Term } from "@/api/types";
import { DataTable } from "@/components/DataTable";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTermSheet } from "@/hooks/queryHooks/useAttendance";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TermSheetCard } from "./TermSheetCard";
import { generateColumns } from "./TermSheetColumns";
import { TermSheetHeader } from "./TermSheetHeader";
import { StudentAttendance } from "./students";
import { ClassAttendanceWrapper } from "../ClassAttendanceWrapper";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

export interface Student {
  id: number;
  name: string;
  avatar: string;
  present: boolean;
}

export const TermSheet = () => {
  const path = usePathname();
  const router = useRouter();
  const classGroup = path.split("/")[3] ?? "";
  const armId = path.split("/")[4] ?? "";

  useBreadcrumb([
    { label: "Attendance Management", url: "/staff/attendance" },
    { label: "Class Attendance", url: "/staff/attendance" },
    { label: "Term Sheet", url: "" },
  ]);

  const [page, setPage] = useState(1);
  const [activeWeek, setActiveWeek] = useState<string | undefined>();
  const [activeStudent, setActiveStudent] = useState<number>();
  const [termSelected, setTermSelected] = useState<Term | null>(null);
  const [activeSession, setActveSesion] = useState<string | null>(null);

  const pageSize = 10;

  const { data, isPending, isError, error } = useGetTermSheet(Number(armId), termSelected?.termId);

  useEffect(() => {
    if (data) {
      setActiveWeek(data.data[0]?.weeks[0]?.week);
    }
  }, [data]);

  return (
    <ClassAttendanceWrapper armId={Number(armId)} isLoading={isPending}>
      {isError && (
        <div className="flex h-80 items-center justify-center pt-15">
          <ErrorComponent
            title="Could not get the Class' Term Sheet"
            description={error?.message || "This is our problem, we are looking into it so as to serve you better"}
            buttonText="Go to the Home page"
          />
        </div>
      )}
      {isPending && !isError && <Skeleton className="bg-bg-input-soft mx-4 mt-8 hidden h-100 w-full md:mx-8 md:block" />}

      <div className="space-y-6">
        <TermSheetHeader
          classname={classGroup.replaceAll("-", " ")}
          termWeeks={data ? data?.data[0]?.weeks : []}
          activeWeek={activeWeek}
          setActiveWeek={setActiveWeek}
          termSelected={termSelected}
          activeSession={activeSession}
          setActiveSession={setActveSesion}
          setTermSelected={setTermSelected}
        />

        {!isPending && !isError && data.data.length === 0 && (
          <div className="flex h-80 items-center justify-center">
            <ErrorComponent
              title="No Attendance record"
              description="No term sheet to display. Mark attendance to generate a term sheet"
              buttonText="Mark Attendance"
              onClick={() => router.back()}
            />
          </div>
        )}

        {!isPending && !isError && data.data.length > 0 && (
          <>
            <div className="hidden px-4 md:block md:px-8">
              <DataTable
                columns={generateColumns({ weeks: data.data[0].weeks, totalStudents: data.data.length })}
                data={data.data}
                totalCount={data.data.length}
                page={page}
                setCurrentPage={setPage}
                pageSize={pageSize}
                showPagination={false}
                fullBorder
                classNames={{
                  tableWrapper: "overflow-auto",
                }}
              />
            </div>

            <div className="block space-y-3 px-4 md:hidden">
              {data.data.map((student: StudentAttendance) => {
                const days = student.weeks.find(wk => wk.week === activeWeek)?.days;
                return (
                  <TermSheetCard
                    key={student.studentId}
                    student={student}
                    days={days}
                    activeStudent={activeStudent}
                    setActiveStudent={setActiveStudent}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </ClassAttendanceWrapper>
  );
};
