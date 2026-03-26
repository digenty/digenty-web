"use client";
import { DataTable } from "@/components/DataTable";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetClassTeachersInClass } from "@/hooks/queryHooks/useClass";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useClassesStore } from "@/store/classes";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ClassPermissionWrapper } from "../ClassPermissionWrapper";
import { ClassOverviewCard } from "./ClassOverviewCard";
import { ClassOverviewHeader } from "./ClassOverviewHeader";
import { columns } from "./Columns";
import { NotifyTeacher } from "./NotifyTeacher";

export interface Subject {
  subjectId: number;
  subjectName: string;
  subjectTeacherName: string;
  status: "IN_PROGRESS" | "NOT_SUBMITTED" | "SUBMITTED" | "REQUESTED_EDIT_ACCESS";
}

export const ClassOverview = () => {
  useBreadcrumb([
    { label: "Classes and Subjects", url: "/staff/classes-and-subjects" },
    { label: "Classes", url: `/staff/classes-and-subjects` },
    { label: "My Class", url: "" },
  ]);

  const { openNotifyTeacher } = useClassesStore();
  const pathname = usePathname();
  const armId = pathname.split("/")[5];
  const searchParams = useSearchParams();
  const classArmName = searchParams.get("classArmName")?.replaceAll("-", " ") || "";

  const [page, setPage] = useState(1);

  const { data, isFetching, isError } = useGetClassTeachersInClass(Number(armId));
  const pageSize = data?.data?.pageable?.pageSize;

  const classTeachersData = data?.data?.data?.subjectReportResponseDtoList ?? [];

  return (
    <ClassPermissionWrapper armId={Number(armId)} isLoading={isFetching}>
      <div className="space-y-6 px-4 py-6 md:px-8 md:py-4">
        {openNotifyTeacher && <NotifyTeacher />}
        <ClassOverviewHeader classArmName={classArmName} classId={data?.data?.data?.classId} />

        <h3 className="text-text-default hidden text-lg font-semibold md:inline">{classArmName}</h3>

        {isFetching && <Skeleton className="bg-bg-input-soft mt-4 h-100 w-full" />}

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
            {/* TODO: Link this button to creating subjects page */}
            <ErrorComponent title="No Subjects" description="No subjects for this class yet" buttonText="Assign subjects to class" url="" />
          </div>
        )}

        <div className="">
          {!isFetching && !isError && classTeachersData.length > 0 && (
            <>
              <div className="hidden pt-5 md:block">
                <DataTable
                  columns={columns(Number(data?.data?.data?.classId))}
                  data={classTeachersData}
                  totalCount={classTeachersData?.length}
                  page={page}
                  setCurrentPage={setPage}
                  pageSize={pageSize}
                  showPagination={false}
                />
              </div>

              <div className="flex flex-col gap-4 md:hidden">
                {classTeachersData?.map((subject: Subject) => (
                  <ClassOverviewCard key={subject.subjectId} subject={subject} classId={Number(armId)} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </ClassPermissionWrapper>
  );
};
