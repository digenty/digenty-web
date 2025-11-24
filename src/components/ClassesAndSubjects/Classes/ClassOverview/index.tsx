"use client";
import { DataTable } from "@/components/DataTable";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useClassesStore } from "@/store/classes";
import { useState } from "react";
import { ClassOverviewCard } from "./ClassOverviewCard";
import { ClassOverviewHeader } from "./ClassOverviewHeader";
import { columns } from "./Columns";
import { NotifyTeacher } from "./NotifyTeacher";

export interface Subject {
  id: number;
  title: string;
  teacher: string;
  status: "In Progress" | "Not Started" | "Submitted";
}

const subjects: Subject[] = [
  {
    id: 1,
    title: "Mathematics",
    teacher: "Mr. Obafemi",
    status: "In Progress",
  },
  {
    id: 2,
    title: "English Language",
    teacher: "Mr. Obafemi",
    status: "Not Started",
  },
  {
    id: 3,
    title: "History",
    teacher: "Mr. Obafemi",
    status: "Submitted",
  },
  {
    id: 4,
    title: "Social Sciences",
    teacher: "Mr. Obafemi",
    status: "In Progress",
  },
  {
    id: 5,
    title: "Foods and Nutrition",
    teacher: "Mr. Obafemi",
    status: "Not Started",
  },
];
export const ClassOverview = () => {
  useBreadcrumb([
    { label: "Classes and Subjects", url: "/classes-and-subjects" },
    { label: "Classes", url: `/classes-and-subjects` },
    { label: "My Class", url: "" },
  ]);
  const { openNotifyTeacher } = useClassesStore();

  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  console.log(setRowSelection);

  return (
    <div className="space-y-6 px-4 py-6 md:px-8 md:py-4">
      {openNotifyTeacher && <NotifyTeacher />}
      <ClassOverviewHeader />

      <h3 className="text-text-default hidden text-lg font-semibold md:inline">SS 1 Art A</h3>

      <div className="hidden pt-5 md:block">
        <DataTable
          columns={columns}
          data={subjects}
          totalCount={subjects.length}
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
        {subjects.map(subject => (
          <ClassOverviewCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  );
};
