"use client";
import { DataTable } from "@/components/DataTable";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useClassesStore } from "@/store/classes";
import { useState } from "react";
import { ClassOverviewCard } from "./ClassOverviewCard";
import { ClassOverviewHeader } from "./ClassOverviewHeader";
import { columns } from "./Columns";
import { NotifyTeacher } from "./NotifyTeacher";
import { useGetClassTeachersInClass } from "@/hooks/queryHooks/useClass";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";

export interface Subject {
  id: number;
  subjectName: string;
  subjectTeacherName: string;
  status: "IN PROGRESS" | "NOT STARTED" | "SUBMITTED";
}

export const ClassOverview = () => {
  useBreadcrumb([
    { label: "Classes and Subjects", url: "/classes-and-subjects" },
    { label: "Classes", url: `/classes-and-subjects` },
    { label: "My Class", url: "" },
  ]);
  const { openNotifyTeacher } = useClassesStore();
  const searchParams = useSearchParams();
  const classArmName = searchParams.get("classArmName");
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  console.log(setRowSelection);
  const { data: classTeachersData, isLoading } = useGetClassTeachersInClass(1);

  return (
    <div className="space-y-6 px-4 py-6 md:px-8 md:py-4">
      {openNotifyTeacher && <NotifyTeacher />}
      <ClassOverviewHeader />

      <h3 className="text-text-default hidden text-lg font-semibold md:inline">{classArmName}</h3>

      <div className="hidden pt-5 md:block">
        {isLoading ? (
          <Skeleton className="h-52 w-full" />
        ) : (
          <DataTable
            columns={columns}
            data={classTeachersData?.content}
            totalCount={classTeachersData?.length}
            page={page}
            setCurrentPage={setPage}
            pageSize={pageSize}
            clickHandler={row => {
              console.log(row);
              //   router.push(`/student-and-parent-record/${row.original.id}`);
            }}
            rowSelection={rowSelection}
            setRowSelection={() => {}}
            onSelectRows={() => {}}
            showPagination={false}
          />
        )}
      </div>

      {isLoading || classTeachersData === 0 ? (
        <Skeleton className="h-52 w-full rounded-md" />
      ) : (
        <div className="flex flex-col gap-4 md:hidden">
          {classTeachersData?.content.map((subject: Subject) => (
            <ClassOverviewCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}
    </div>
  );
};
