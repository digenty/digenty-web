"use client";
import { DataTable } from "@/components/DataTable";
import { cn } from "@/lib/utils";
import { useBreadcrumbStore } from "@/store/breadcrumb";
import { MoreHorizontal, PlusIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DeleteBin from "../Icons/DeleteBin";
import GraduationCap from "../Icons/GraduationCap";
import Import from "../Icons/Import";
import ShareBox from "../Icons/ShareBox";
import UserFill from "../Icons/UserFill";
import UserMinus from "../Icons/UserMinus";
import { MobileDrawer } from "../MobileDrawer";
import { Modal } from "../Modal";
import { OverviewCard } from "../OverviewCard";
import { SearchInput } from "../SearchInput";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Student, Parent } from "@/components/StudentAndParent/types";
import { columns } from "./Columns";
import { MobileCard } from "./MobileCard";
import { RecordHeader } from "./RecordHeader";
import { TableExportFilter } from "./TableExportFilter";
import { parentColumns } from "./Parent/ParentColumns";
import { ParentsMobileCard } from "./Parent/ParentMobileCard";

const students: Student[] = Array.from({ length: 60 }).map(() => ({
  id: Math.random().toString(36).substring(2, 9),
  name: "Damilare John",
  gender: "Male",
  class: "SS 1 Arts A",
  admissionNumber: "GFA/2023/10145",
  dob: "18/05/2007",
  branch: "Lawanson",
  tags: [{ label: "Prefect", color: "bg-basic-cyan-strong", bgColor: "bg-badge-cyan" }],
}));

const parents: Parent[] = Array.from({ length: 60 }).map(() => ({
  id: Math.random().toString(36).substring(2, 9),
  name: "Damilare John",
  gender: "Male",
  phoneNumber: "0701 234 5678",
  emailAddress: "damilare.john@yopmail.com",
  branch: "Ijesha",
  tags: [{ label: "VIP" }],
}));

const tabs = ["Students", "Parents"];

const StudentAndParentRecord = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [openExportFilter, setOpenExportFilter] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<Student[]>([]);
  const [selectedParentsRows, setSelectedParentsRows] = useState<Parent[]>([]);
  const { setBreadcrumbs } = useBreadcrumbStore();
  const pageSize = 50;
  const params = useSearchParams();
  const activeTab = params.get("tab") ?? "Students";

  console.log(selectedParentsRows);

  useEffect(() => {
    router.push(`/student-and-parent-record?tab=${activeTab}`);
    setBreadcrumbs([
      { label: "Student & Parent Record", url: "/student-and-parent-record" },
      { label: activeTab, url: `/student-and-parent-record?tab=${activeTab}` },
    ]);
  }, [activeTab, router, setBreadcrumbs]);

  return (
    <div className="space-y-4.5 px-4 py-6 md:space-y-8 md:px-8">
      {openExportFilter && (
        <Modal
          open={openExportFilter}
          setOpen={setOpenExportFilter}
          title={
            <span className="flex items-center gap-2">
              <span className="bg-bg-state-soft flex size-8 items-center justify-center rounded-full">
                <ShareBox fill="var(--color-icon-default-subtle)" className="size-4" />
              </span>
              <span>{activeTab === "Students" ? "Export Students" : "Export Parents"}</span>
            </span>
          }
          ActionButton={
            <Button className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7 px-2 py-1">
              {true ? <Spinner /> : <ShareBox fill="var(--color-icon-white-default)" className="size-4" />}
              <span className="text-sm font-medium">{activeTab === "Students" ? "Export Students" : "Export Parents"}</span>
            </Button>
          }
        >
          <TableExportFilter tab={activeTab} />
        </Modal>
      )}

      {/* Tabs */}
      <div className="border-border-default flex w-auto max-w-105 items-center gap-3 border-b">
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          return (
            <div
              role="button"
              onClick={() => {
                router.push(`/student-and-parent-record?tab=${tab}`);
                //  setBreadcrumbs((prev: Crumb[]) => [...prev, { label: tab, url: `/student-and-parent-record?tab=${tab}` }])
                setBreadcrumbs([
                  { label: "Student & Parent Record", url: "/student-and-parent-record" },
                  { label: tab, url: `/student-and-parent-record?tab=${tab}` },
                ]);
              }}
              key={tab}
              className={cn("w-1/2 cursor-pointer py-2.5 text-center", isActive && "border-border-informative border-b-[1.5px]")}
            >
              <span className={cn("text-sm font-medium", isActive ? "text-text-informative" : "text-text-muted")}>{tab}</span>
            </div>
          );
        })}
      </div>

      {/* Title and Filter buttons */}
      <div className="space-y-4">
        <RecordHeader tab={activeTab} />

        <div className={cn(activeTab === "Parents" && "border-border-default border-b")} />

        {activeTab === "Students" && (
          <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            <OverviewCard
              title="Total Students"
              Icon={() => (
                <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex w-6 items-center justify-center rounded-xs border p-1">
                  <UserFill fill="var(--color-icon-default)" className="size-[10px]" />
                </div>
              )}
              value="583"
            />
            <OverviewCard
              title="Active Students"
              Icon={() => (
                <div className="bg-bg-basic-emerald-subtle border-bg-basic-emerald-accent flex w-6 items-center justify-center rounded-xs border p-1">
                  <UserFill fill="var(--color-icon-default)" className="size-[10px]" />
                </div>
              )}
              value="580"
            />
            <OverviewCard
              title="Withdrawn Students"
              Icon={() => (
                <div className="bg-bg-basic-yellow-subtle border-bg-basic-yellow-accent flex w-6 items-center justify-center rounded-xs border p-1">
                  <UserMinus fill="var(--color-icon-default)" className="size-[10px]" />
                </div>
              )}
              value="3"
            />

            <OverviewCard
              title="Graduated Students"
              Icon={() => (
                <div className="bg-bg-basic-sky-subtle border-bg-basic-sky-accent flex w-6 items-center justify-center rounded-xs border p-1">
                  <GraduationCap fill="var(--color-icon-default)" className="size-[10px]" />
                </div>
              )}
              value="100"
            />
          </div>
        )}

        {/* Search and Export */}
        <div className="mt-6 flex flex-col justify-between gap-3 md:mt-8 md:flex-row md:items-center">
          <SearchInput className="bg-bg-input-soft! h-8 rounded-lg border-none md:w-70.5" />

          <div className="flex items-center gap-1">
            <Button
              onClick={() => setOpenExportFilter(true)}
              className="bg-bg-state-secondary border-border-darker shadow-light hidden h-8 gap-2 rounded-md border px-2.5! md:flex"
            >
              <ShareBox fill="var(--color-icon-default-muted)" className="size-[15px]" />
              <span className="text-text-default font-medium">Export</span>
            </Button>

            <Button
              onClick={() => router.push(`student-and-parent-record/upload-${activeTab === "Parents" ? "parents" : "students"}`)}
              className="bg-bg-state-secondary border-border-darker shadow-light hidden h-8 gap-2 rounded-md border px-2.5! md:flex"
            >
              <Import fill="var(--color-icon-default-muted)" className="size-[15px]" />
              <span className="text-text-default font-medium">Import</span>
            </Button>

            <Button
              onClick={() => router.push("student-and-parent-record/add-student")}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! shadow-xlight h-8 gap-2 rounded-md px-2.5!"
            >
              <PlusIcon className="text-icon-white-default size-4" />
              <span className="text-text-white-default font-medium">Add {activeTab === "Parents" ? "Parent" : "Student"}</span>
            </Button>

            <Button onClick={() => setIsActionsOpen(true)} className="bg-bg-state-soft flex h-8 rounded-md px-2! md:hidden">
              <MoreHorizontal className="text-icon-default-subtle size-4" />
            </Button>
          </div>
        </div>
      </div>

      {isActionsOpen && (
        <MobileDrawer open={isActionsOpen} setIsOpen={setIsActionsOpen} title="Actions">
          <div className="flex flex-col gap-2 px-3 py-4">
            <Button className="bg-bg-state-secondary border-border-darker text-text-default h-8 border text-sm font-medium">
              <ShareBox fill="var(--color-icon-default-muted)" className="size-4" />
              <span>Export</span>
            </Button>
            <Button className="bg-bg-state-secondary border-border-darker text-text-default h-8 border text-sm font-medium">
              <Import fill="var(--color-icon-default-muted)" className="size-4" />
              <span>Import</span>
            </Button>
          </div>
        </MobileDrawer>
      )}

      {/* Row manipulation */}
      {selectedRows.length > 0 && (
        <div className="mb-4 hidden items-center gap-1 md:flex">
          <div className="bg-bg-state-soft text-text-default flex h-7 items-center justify-center gap-1 rounded-md px-2.5 text-sm font-medium">
            <span> {selectedRows.length}</span>
            <span>Selected Item{selectedRows.length !== 1 && "s"}</span>
          </div>

          <Button className="bg-bg-state-secondary border-border-darker text-text-default h-7 border px-2.5 text-sm font-medium">
            <UserMinus fill="var(--color-icon-default-muted)" className="size-4" />
            <span>Withdraw students</span>
          </Button>

          <Button className="bg-bg-state-secondary border-border-darker text-text-default h-7 border px-2.5 text-sm font-medium">
            <DeleteBin fill="var(--color-bg-basic-red-accent)" className="size-4" />
            <span>Delete students</span>
          </Button>
        </div>
      )}

      {/* Separate the table components into two different files with their separate states, then render conditionally here */}
      <div className="hidden md:block">
        {activeTab === "Students" ? (
          <DataTable
            columns={columns}
            data={students}
            totalCount={students.length}
            page={page}
            setCurrentPage={setPage}
            pageSize={pageSize}
            clickHandler={row => {
              router.push(`/student-and-parent-record/${row.original.id}`);
            }}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            onSelectRows={setSelectedRows}
          />
        ) : (
          <DataTable
            columns={parentColumns}
            data={parents}
            totalCount={parents.length}
            page={page}
            setCurrentPage={setPage}
            pageSize={pageSize}
            clickHandler={row => {
              router.push(`/student-and-parent-record/${row.original.id}`);
            }}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            onSelectRows={setSelectedParentsRows}
          />
        )}
      </div>

      {activeTab === "Students" ? (
        <div className="flex flex-col gap-4 pb-16 md:hidden">
          {students.map(student => (
            <MobileCard key={student.id} student={student} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 pb-16 md:hidden">
          {parents.map(parent => (
            <ParentsMobileCard key={parent.id} parent={parent} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAndParentRecord;
