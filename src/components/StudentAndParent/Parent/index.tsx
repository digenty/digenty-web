"use client";
import { DataTable } from "@/components/DataTable";
import DeleteBin from "@/components/Icons/DeleteBin";
import Import from "@/components/Icons/Import";
import ShareBox from "@/components/Icons/ShareBox";
import UserMinus from "@/components/Icons/UserMinus";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { SearchInput } from "@/components/SearchInput";
import { Parent, Student } from "@/components/StudentAndParent/types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useBreadcrumbStore } from "@/store/breadcrumb";
import { MoreHorizontal, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RecordHeader } from "../RecordHeader";
import { TableExportFilter } from "../TableExportFilter";
import { parentColumns } from "./ParentColumns";
import { ParentsMobileCard } from "./ParentMobileCard";

const parents: Parent[] = Array.from({ length: 60 }).map(() => ({
  id: Math.random().toString(36).substring(2, 9),
  name: "Damilare John",
  gender: "Male",
  phoneNumber: "0701 234 5678",
  emailAddress: "damilare.john@yopmail.com",
  branch: "Ijesha",
  tags: [{ label: "VIP" }],
}));

export const ParentsTable = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [openExportFilter, setOpenExportFilter] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<Parent[]>([]);
  const pageSize = 50;

  useBreadcrumb([
    { label: "Student & Parent Record", url: "/student-and-parent-record" },
    { label: "Parents", url: `/student-and-parent-record?tab=Parents` },
  ]);

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
              <span>Export Parents</span>
            </span>
          }
          ActionButton={
            <Button className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7 px-2 py-1">
              {true ? <Spinner /> : <ShareBox fill="var(--color-icon-white-default)" className="size-4" />}
              <span className="text-sm font-medium">Export Parents</span>
            </Button>
          }
        >
          <TableExportFilter tab="Parents" />
        </Modal>
      )}

      {/* Title and Filter buttons */}
      <div className="space-y-4">
        {/* <RecordHeader tab="Parents" /> */}

        <div className="border-border-default border-b" />

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
              onClick={() => router.push(`student-and-parent-record/upload-parents`)}
              className="bg-bg-state-secondary border-border-darker shadow-light hidden h-8 gap-2 rounded-md border px-2.5! md:flex"
            >
              <Import fill="var(--color-icon-default-muted)" className="size-[15px]" />
              <span className="text-text-default font-medium">Import</span>
            </Button>

            <Button
              onClick={() => router.push("student-and-parent-record/add-parent")}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! shadow-xlight h-8 gap-2 rounded-md px-2.5!"
            >
              <PlusIcon className="text-icon-white-default size-4" />
              <span className="text-text-white-default font-medium">Add Parent</span>
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
            <DeleteBin fill="var(--color-bg-basic-red-accent)" className="size-4" />
            <span>Delete Parent{selectedRows.length !== 1 && "s"}</span>
          </Button>
        </div>
      )}

      {/* Separate the table components into two different files with their separate states, then render conditionally here */}
      <div className="hidden md:block">
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
          onSelectRows={setSelectedRows}
        />
      </div>

      <div className="flex flex-col gap-4 pb-16 md:hidden">
        {parents.map(parent => (
          <ParentsMobileCard key={parent.id} parent={parent} />
        ))}
      </div>
    </div>
  );
};
