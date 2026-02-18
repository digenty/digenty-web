"use client";
import { Arm, Branch, ClassType, Department, Parent } from "@/api/types";
import { DataTable } from "@/components/DataTable";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import DeleteBin from "@/components/Icons/DeleteBin";
import Import from "@/components/Icons/Import";
import ShareBox from "@/components/Icons/ShareBox";
import WarningIcon from "@/components/Icons/WarningIcon";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { SearchInput } from "@/components/SearchInput";
import { StudentsStatus } from "@/components/StudentAndParent/types";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogDescription } from "@/components/ui/dialog";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useDeleteParents, useExportParents, useGetParents } from "@/hooks/queryHooks/useParent";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import useDebounce from "@/hooks/useDebounce";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useParentStore } from "@/store/useParentStore";
import { MoreHorizontal, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RecordHeader } from "../RecordHeader";
import { TableExportFilter } from "../TableExportFilter";
import { parentColumns } from "./ParentColumns";
import { ParentsMobileCard } from "./ParentMobileCard";
import { PermissionCheck } from "@/components/ModulePermissionsWrapper/PermissionCheck";
import { canManageStudentParentRecords } from "@/lib/permissions/students-and-parents";

export const ParentsTable = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { openDelete, setOpenDelete, parentIds, setParentIds } = useParentStore();
  useBreadcrumb([
    { label: "Student & Parent Record", url: "/student-and-parent-record" },
    { label: "Parents", url: `/student-and-parent-record?tab=Parents` },
  ]);

  const [page, setPage] = useState(1);
  const [isChecked, setIsChecked] = useState(false);
  const [openExportFilter, setOpenExportFilter] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<Parent[]>([]);
  const pageSize = 50;

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [filter, setFilter] = useState<{
    branchSelected?: Branch;
  }>({});

  const {
    data,
    isPending: loadingParents,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetParents({
    limit: pageSize,
    branchId: filter?.branchSelected?.id,
    search: debouncedSearchQuery,
  });
  const parents = data?.pages.flatMap(page => page.content) ?? [];

  const { data: branches, isPending: loadingBranches } = useGetBranches();

  const { mutate, isPending: exporting } = useExportParents({
    branchId: filter.branchSelected?.id,
  });

  const { mutate: deleteParents, isPending: deleting } = useDeleteParents(parentIds);

  const exportStudents = async () => {
    await mutate(undefined, {
      onSuccess: () => {
        toast({
          title: "Exporting Parents...",
          type: "success",
        });
        setOpenExportFilter(false);
      },
      onError: error => {
        setOpenExportFilter(false);
        toast({
          title: error.message ?? "Something went wrong",
          description: "Could not export students",
          type: "error",
        });
      },
    });
  };

  const handleDeletion = () => {
    deleteParents(undefined, {
      onSuccess: data => {
        toast({
          title: "Successfully deleted parents",
          description: data.data.message,
          type: "success",
        });
        setOpenDelete(false);
        setParentIds([]);
      },
      onError: error => {
        toast({
          title: error.message ?? "Something went wrong",
          description: "Could not delete selected parents",
          type: "error",
        });
        setOpenDelete(false);
        setParentIds([]);
      },
    });
  };

  const handleFilterChange = (
    filter: string,
    value: Branch | ClassType | Department | Arm | { value: StudentsStatus; label: string } | undefined,
  ) => {
    setFilter(prev => ({ ...prev, [filter]: value }));
  };

  useEffect(() => {
    // Make sure that page is fetched
    if (page > (data?.pages.length ?? 0)) {
      fetchNextPage();
    }
  }, [page, data?.pages.length, fetchNextPage]);

  const dataForDesktop = data?.pages[page - 1]?.content ?? [];

  return (
    <div className="space-y-4.5 px-4 py-6 md:space-y-8 md:px-8">
      {openExportFilter && (
        <Modal
          open={openExportFilter}
          setOpen={setOpenExportFilter}
          title={
            <span className="flex items-center gap-2">
              <span className="bg-bg-state-soft flex size-8 items-center justify-center rounded-full">
                {exporting ? <Spinner /> : <ShareBox fill="var(--color-icon-default-subtle)" className="size-4" />}
              </span>
              <span>Export Parents</span>
            </span>
          }
          ActionButton={
            <Button
              onClick={() => exportStudents()}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7 px-2 py-1"
            >
              {exporting ? <Spinner className="text-text-white-default" /> : <ShareBox fill="var(--color-icon-white-default)" className="size-4" />}
              <span className="text-sm font-medium">Export Parents</span>
            </Button>
          }
        >
          <TableExportFilter
            tab="Parents"
            filter={filter}
            onFilterChange={handleFilterChange}
            branches={branches}
            loadingBranches={loadingBranches}
            filteredCount={data?.pages[0].totalElements}
          />
        </Modal>
      )}

      {/* Delete open modal */}
      <Modal
        open={openDelete}
        setOpen={setOpenDelete}
        title="Delete Parent?"
        className="block"
        ActionButton={
          <Button
            disabled={!isChecked}
            onClick={() => handleDeletion()}
            className={`h-7 rounded-md text-sm font-medium ${
              isChecked ? "bg-bg-state-destructive text-text-white-default hover:bg-bg-state-destructive-hover!" : "bg-bg-state-soft text-text-subtle"
            }`}
          >
            {deleting && <Spinner className="text-text-white-default" />}
            Delete Parent
          </Button>
        }
      >
        <div className="space-y-5 px-6 py-5">
          <DialogDescription className="text-text-subtle text-sm font-normal">
            Are you sure you want to permanently delete this parent’s profile? This action cannot be undone.
          </DialogDescription>

          <div className="bg-bg-basic-orange-subtle border-border-default text-text-subtle shadow-light flex items-center gap-3 rounded-sm border px-2.5 py-2.5 text-sm font-normal">
            <WarningIcon />
            <p>Deleting will remove the parent’s profile and records. This cannot be undone.</p>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox id="terms" checked={isChecked} onCheckedChange={(checked: boolean) => setIsChecked(checked)} />
            <label htmlFor="terms" className="text-text-subtle text-sm font-normal">
              I understand that deleting this parent is permanent and cannot be undone.
            </label>
          </div>
        </div>
      </Modal>

      {isMobile && (
        <MobileDrawer open={openExportFilter} setIsOpen={setOpenExportFilter} title="Export Students">
          <TableExportFilter
            tab="Parents"
            filter={filter}
            onFilterChange={handleFilterChange}
            branches={branches}
            loadingBranches={loadingBranches}
            filteredCount={data?.pages[0].totalElements}
          />
          <DrawerFooter className="border-border-default border-t">
            <div className="flex justify-between">
              <DrawerClose asChild>
                <Button className="bg-bg-state-soft text-text-subtle h-8 rounded-md! px-4 text-sm font-medium">Cancel</Button>
              </DrawerClose>

              <Button
                onClick={() => exportStudents()}
                className="bg-bg-state-primary text-text-white-default h-8 rounded-md! px-4 text-sm tracking-[0.1rem]"
              >
                {exporting ? <Spinner className="text-text-white-default" /> : <ShareBox fill="var(--color-icon-white-default)" className="size-4" />}
                <span className="text-sm font-medium">Export Parents</span>
              </Button>
            </div>
          </DrawerFooter>
        </MobileDrawer>
      )}

      {/* Title and Filter buttons */}
      <div className="space-y-4">
        <RecordHeader
          tab="Parents"
          filter={filter}
          onFilterChange={handleFilterChange}
          branches={branches}
          loadingBranches={loadingBranches}
          totalParents={data?.pages[0].totalElements}
        />

        <div className="border-border-default border-b" />

        {/* Search and Export */}
        <div className="mt-6 flex flex-col justify-between gap-3 md:mt-8 md:flex-row md:items-center">
          <SearchInput
            className="bg-bg-input-soft! h-8 rounded-lg border-none md:w-70.5"
            value={searchQuery}
            onChange={evt => {
              setSearchQuery(evt.target.value);
            }}
          />

          <div className="flex items-center gap-1">
            <Button
              onClick={() => setOpenExportFilter(true)}
              className="bg-bg-state-secondary border-border-darker shadow-light hidden h-8 gap-2 rounded-md border px-2.5! md:flex"
            >
              <ShareBox fill="var(--color-icon-default-muted)" className="size-[15px]" />
              <span className="text-text-default font-medium">Export</span>
            </Button>

            <PermissionCheck permissionUtility={canManageStudentParentRecords}>
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
            </PermissionCheck>

            <Button onClick={() => setIsActionsOpen(true)} className="bg-bg-state-soft flex h-8 rounded-md px-2! md:hidden">
              <MoreHorizontal className="text-icon-default-subtle size-4" />
            </Button>
          </div>
        </div>
      </div>

      {isActionsOpen && (
        <MobileDrawer open={isActionsOpen} setIsOpen={setIsActionsOpen} title="Actions">
          <div className="flex flex-col gap-2 px-3 py-4">
            <Button
              onClick={() => setOpenExportFilter(true)}
              className="bg-bg-state-secondary border-border-darker text-text-default h-8 justify-start gap-2 text-sm font-medium"
            >
              <ShareBox fill="var(--color-icon-default-muted)" className="size-4" />
              <span>Export</span>
            </Button>
            <Button
              onClick={() => router.push(`student-and-parent-record/upload-parents`)}
              className="bg-bg-state-secondary border-border-darker text-text-default h-8 justify-start gap-2 text-sm font-medium"
            >
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

          <PermissionCheck permissionUtility={canManageStudentParentRecords}>
            <Button
              onClick={() => {
                setOpenDelete(true);
                setParentIds(selectedRows.map(row => row.id));
              }}
              className="bg-bg-state-secondary border-border-darker text-text-default h-7 border px-2.5 text-sm font-medium"
            >
              <DeleteBin fill="var(--color-bg-basic-red-accent)" className="size-4" />
              <span>Delete Parent{selectedRows.length !== 1 && "s"}</span>
            </Button>
          </PermissionCheck>
        </div>
      )}

      {isError && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent
            title="Could not get Parents"
            description="This is our problem, we are looking into it so as to serve you better"
            buttonText="Go to the Home page"
          />
        </div>
      )}

      {loadingParents && <Skeleton className="bg-bg-input-soft hidden h-100 w-full md:block" />}

      {parents.length === 0 && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent title="No Parents" description="No parent has been added yet" buttonText="Add a parent" />
        </div>
      )}

      {!loadingParents && !isError && parents.length > 0 && (
        <div>
          <div className="hidden md:block">
            <DataTable
              columns={parentColumns}
              data={dataForDesktop}
              totalCount={data?.pages[0].totalElements}
              page={page}
              setCurrentPage={setPage}
              pageSize={pageSize}
              clickHandler={row => {
                router.push(`/student-and-parent-record/parents/${row.original.id}`);
              }}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              onSelectRows={setSelectedRows}
              loadingContent={isFetchingNextPage}
            />
          </div>

          <div className="flex flex-col justify-center gap-4 md:hidden">
            <div className="flex flex-col gap-4">
              {parents.map((parent: Parent) => (
                <ParentsMobileCard key={parent.id} parent={parent} />
              ))}

              {hasNextPage && (
                <Button onClick={() => fetchNextPage()} className="bg-bg-state-soft text-text-subtle w-fit self-center px-10">
                  Load More
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
