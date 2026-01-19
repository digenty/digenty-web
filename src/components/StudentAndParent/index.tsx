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
import { StudentsTable } from "./Students";
import { ParentsTable } from "./Parent";

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

  console.log(params);

  useEffect(() => {
    if (!activeTab) {
      router.push(`/student-and-parent-record?tab=Students`);
    }
    // router.push(`/student-and-parent-record?tab=${activeTab}`);
  }, [activeTab, router]);

  return (
    <div className="space-y-4.5 px-4 py-6 md:space-y-8 md:px-8">
      {/* {openExportFilter && (
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
      )} */}

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
              className={cn(
                "w-1/2 cursor-pointer py-2.5 text-center transition-all duration-150",
                isActive && "border-border-informative border-b-[1.5px]",
              )}
            >
              <span className={cn("text-sm font-medium", isActive ? "text-text-informative" : "text-text-muted")}>{tab}</span>
            </div>
          );
        })}
      </div>

      {/* Title and Filter buttons */}

      {/* Row manipulation */}
      {/* {selectedRows.length > 0 && (
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
      )} */}

      {/* Separate the table components into two different files with their separate states, then render conditionally here */}
      <div className="hidden md:block">{activeTab === "Students" ? <StudentsTable /> : <ParentsTable />}</div>

      {/* {activeTab === "Students" ? (
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
      )} */}
    </div>
  );
};

export default StudentAndParentRecord;
