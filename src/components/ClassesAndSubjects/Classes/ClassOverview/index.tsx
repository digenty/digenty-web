"use client";
import { DataTable } from "@/components/DataTable";
import { ClassOverviewHeader } from "./ClassOverviewHeader";
import { columns } from "./Columns";
import { useEffect, useState } from "react";
import { useBreadcrumbStore } from "@/store/breadcrumb";

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
    title: "Mathematics",
    teacher: "Mr. Obafemi",
    status: "Not Started",
  },
  {
    id: 3,
    title: "Mathematics",
    teacher: "Mr. Obafemi",
    status: "Submitted",
  },
  {
    id: 4,
    title: "Mathematics",
    teacher: "Mr. Obafemi",
    status: "In Progress",
  },
  {
    id: 5,
    title: "Mathematics",
    teacher: "Mr. Obafemi",
    status: "Not Started",
  },
];
export const ClassOverview = () => {
  const { setBreadcrumbs } = useBreadcrumbStore();

  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    setBreadcrumbs([
      { label: "Classes and Subjects", url: "/classes-and-subjects" },
      { label: "Classes", url: `/classes-and-subjects` },
      { label: "Class Overview", url: "" },
    ]);
  }, [setBreadcrumbs]);

  return (
    <div className="space-y-6 px-4 py-4 md:px-8">
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
            //   router.push(`/student-and-parent-record/${row.original.id}`);
          }}
          rowSelection={rowSelection}
          setRowSelection={() => {}}
          onSelectRows={() => {}}
          showPagination={false}
        />
      </div>
    </div>
  );
};
