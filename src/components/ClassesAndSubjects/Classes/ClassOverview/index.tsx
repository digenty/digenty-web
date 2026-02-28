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
import { useParams, useSearchParams } from "next/navigation";
import { PageEmptyState } from "@/components/Error/PageEmptyState";
import { ErrorComponent } from "@/components/Error/ErrorComponent";

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
  const params = useParams();
  const classId = Number(params.classId);
  const searchParams = useSearchParams();
  const classArmName = searchParams.get("classArmName");
  const { data, isFetching, isError } = useGetClassTeachersInClass(classId);
  const pageSize = data?.data?.pageable?.pageSize;
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  console.log(setRowSelection);

  const classTeachersData = data?.data?.data?.content ?? [];

  return (
    <div className="space-y-6 px-4 py-6 md:px-8 md:py-4">
      {openNotifyTeacher && <NotifyTeacher />}
      <ClassOverviewHeader />

      <h3 className="text-text-default hidden text-lg font-semibold md:inline">{classArmName}</h3>

      {isFetching && <Skeleton className="bg-bg-input-soft h-100 w-full" />}

      {isError && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent
            title="Could not get Class Subjects"
            description="This is our problem, we are looking into it so as to serve you better"
            buttonText="Go to the Home page"
          />
        </div>
      )}

      {!isFetching && !isError && classTeachersData.length === 0 && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent title="No Subjects" description="No subject teacher has submitted yet" buttonText="Submit report" />
        </div>
      )}

      <div className="">
        {!isFetching && !isError && classTeachersData.length > 0 && (
          <>
            <div className="hidden pt-5 md:block">
              <DataTable
                columns={columns}
                data={classTeachersData}
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
            </div>
            <div className="flex flex-col gap-4 md:hidden">
              {classTeachersData?.map((subject: Subject) => (
                <ClassOverviewCard key={subject.id} subject={subject} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
