"use client";
import { Arm, Branch, ClassType, Department, Student } from "@/api/types";
import { DataTable } from "@/components/DataTable";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import GraduationCap from "@/components/Icons/GraduationCap";
import Import from "@/components/Icons/Import";
import ShareBox from "@/components/Icons/ShareBox";
import UserFill from "@/components/Icons/UserFill";
import UserMinus from "@/components/Icons/UserMinus";
import WarningIcon from "@/components/Icons/WarningIcon";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { OverviewCard } from "@/components/OverviewCard";
import { SearchInput } from "@/components/SearchInput";
import { StudentsStatus } from "@/components/StudentAndParent/types";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogDescription } from "@/components/ui/dialog";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useGetArmsByClass } from "@/hooks/queryHooks/useArm";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetClasses } from "@/hooks/queryHooks/useClass";
import { useGetDepartments } from "@/hooks/queryHooks/useDepartment";
import { useDeleteStudents, useExportStudents, useGetStudents, useGetStudentsDistribution, useWithdrawStudents } from "@/hooks/queryHooks/useStudent";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import useDebounce from "@/hooks/useDebounce";
import { studentKeys } from "@/queries/student";
import { useStudentStore } from "@/store/student";
import { useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { columns } from "./Columns";
import { MobileCard } from "../MobileCard";
import { RecordHeader } from "../RecordHeader";
import { TableExportFilter } from "../TableExportFilter";

export const StudentsTable = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openWithdraw, setOpenWithdraw, openDelete, setOpenDelete } = useStudentStore();

  const [page, setPage] = useState(1);
  const [openExportFilter, setOpenExportFilter] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<Student[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [studentDistribution, setStudentDistribution] = useState({
    total: 0,
    active: 0,
    graduated: 0,
    withdrawn: 0,
  });
  const pageSize = 15;

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [filter, setFilter] = useState<{
    branchSelected?: Branch;
    classSelected?: ClassType;
    departmentSelected?: Department;
    armSelected?: Arm;
    statusSelected?: { value: StudentsStatus; label: string };
  }>({});

  const {
    data,
    isPending: loadingStudents,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetStudents({
    limit: pageSize,
    branchId: filter?.branchSelected?.id,
    classId: filter?.classSelected?.id,
    departmentId: filter?.departmentSelected?.id,
    armId: filter?.armSelected?.id,
    status: filter?.statusSelected?.value,
    search: debouncedSearchQuery,
  });
  const students = data?.pages.flatMap(page => page.content) ?? [];

  const { data: distribution } = useGetStudentsDistribution(filter?.branchSelected?.id);
  const { data: branches, isPending: loadingBranches } = useGetBranches();
  const { data: classes, isPending: loadingClasses } = useGetClasses();
  const { data: departments, isPending: loadingDepartments } = useGetDepartments();
  const { data: arms, isPending: loadingArms } = useGetArmsByClass(filter?.classSelected?.id);

  const { mutate, isPending: exporting } = useExportStudents({
    armId: filter.armSelected?.id,
    branchId: filter.branchSelected?.id,
    classId: filter.classSelected?.id,
    status: filter.statusSelected?.value,
  });

  const { mutate: withdrawStudents, isPending: withdrawing } = useWithdrawStudents();
  const { mutate: deleteStudents, isPending: deleting } = useDeleteStudents();

  const exportStudents = async () => {
    await mutate(undefined, {
      onSuccess: () => {
        toast({
          title: "Exporting Students...",
          type: "success",
        });
        // setOpenExportFilter(false);
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

  const handleWithdrawal = (ids: number[]) => {
    withdrawStudents(ids, {
      onSuccess: data => {
        toast({
          title: "Successfully withdrawn students",
          description: data.data.message,
          type: "success",
        });
        setOpenWithdraw(false);
      },
      onError: error => {
        toast({
          title: error.message ?? "Something went wrong",
          description: "Could not withdraw selected students",
          type: "error",
        });
        setOpenWithdraw(false);
      },
    });
  };

  const handleDeletion = (ids: number[]) => {
    deleteStudents(ids, {
      onSuccess: data => {
        queryClient.invalidateQueries({ queryKey: studentKeys.all, refetchType: "active" });

        toast({
          title: "Successfully deleted students",
          description: data.data.message,
          type: "success",
        });
        setOpenDelete(false);
      },
      onError: error => {
        toast({
          title: error.message ?? "Something went wrong",
          description: "Could not delete selected students",
          type: "error",
        });
        setOpenDelete(false);
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
    if (distribution) {
      const studentDistr = {
        total: distribution.data?.find((distr: { status: StudentsStatus; count: number }) => distr.status === StudentsStatus.Total)?.count ?? 0,
        active: distribution.data?.find((distr: { status: StudentsStatus; count: number }) => distr.status === StudentsStatus.Active)?.count ?? 0,
        graduated:
          distribution.data?.find((distr: { status: StudentsStatus; count: number }) => distr.status === StudentsStatus.Graduated)?.count ?? 0,
        withdrawn:
          distribution.data?.find((distr: { status: StudentsStatus; count: number }) => distr.status === StudentsStatus.Withdrawn)?.count ?? 0,
      };
      setStudentDistribution(studentDistr);
    }
  }, [distribution]);

  useBreadcrumb([
    { label: "Student & Parent Record", url: "/student-and-parent-record" },
    { label: "Students", url: `/student-and-parent-record?tab=Students` },
  ]);

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
                <ShareBox fill="var(--color-icon-default-subtle)" className="size-4" />
              </span>
              <span>Export Students</span>
            </span>
          }
          ActionButton={
            <Button
              onClick={() => exportStudents()}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7 px-2 py-1"
            >
              {exporting ? <Spinner className="text-text-white-default" /> : <ShareBox fill="var(--color-icon-white-default)" className="size-4" />}
              <span className="text-sm font-medium">Export Students</span>
            </Button>
          }
        >
          <TableExportFilter
            tab="Students"
            filter={filter}
            onFilterChange={handleFilterChange}
            branches={branches}
            loadingBranches={loadingBranches}
            classes={classes}
            loadingClasses={loadingClasses}
            arms={arms}
            loadingArms={loadingArms}
            filteredCount={data?.pages[0].totalElements}
          />
        </Modal>
      )}

      {/* Withdraw open modal  */}

      <Modal
        open={openWithdraw}
        className="block"
        setOpen={setOpenWithdraw}
        title="Withdraw Student?"
        ActionButton={
          <Button
            onClick={() => handleWithdrawal(selectedRows.map(row => row.id))}
            className={"bg-bg-state-destructive text-text-white-default hover:bg-bg-state-destructive-hover! h-7 rounded-md text-sm font-medium"}
          >
            {withdrawing && <Spinner />}
            Withdraw Student
          </Button>
        }
      >
        <div className="space-y-5 px-6 py-5">
          <DialogDescription className="text-text-subtle text-sm font-normal">
            Are you sure you want to withdraw <span className="font-normal">Damilare John?</span>{" "}
          </DialogDescription>
          <div className="bg-bg-basic-orange-subtle shadow-light border-border-default text-text-subtle rounded-sm border px-2.5 py-2.5 text-sm font-normal">
            <p>
              Once withdrawn, the profile will remain in the system, but the student will no longer appear in active classes or reports. You can
              re-enroll the student later if needed.
            </p>
          </div>
        </div>
      </Modal>

      {/* Delete open modal */}
      <Modal
        open={openDelete}
        setOpen={setOpenDelete}
        title="Delete Student?"
        className="block"
        ActionButton={
          <Button
            disabled={!isChecked}
            onClick={() => handleDeletion(selectedRows.map(row => row.id))}
            className={`h-7 rounded-md text-sm font-medium ${
              isChecked ? "bg-bg-state-destructive text-text-white-default hover:bg-bg-state-destructive-hover!" : "bg-bg-state-soft text-text-subtle"
            }`}
          >
            {deleting && <Spinner />}
            Delete Student
          </Button>
        }
      >
        <div className="space-y-5 px-6 py-5">
          <DialogDescription className="text-text-subtle text-sm font-normal">
            Are you sure you want to permanently delete this student’s profile? This action cannot be undone.
          </DialogDescription>

          <div className="bg-bg-basic-orange-subtle border-border-default text-text-subtle shadow-light flex items-center gap-3 rounded-sm border px-2.5 py-2.5 text-sm font-normal">
            <WarningIcon />
            <p>Deleting will remove the student’s profile and records. This cannot be undone.</p>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox id="terms" checked={isChecked} onCheckedChange={(checked: boolean) => setIsChecked(checked)} />
            <label htmlFor="terms" className="text-text-subtle text-sm font-normal">
              I understand that deleting this student is permanent and cannot be undone.
            </label>
          </div>
        </div>
      </Modal>

      <MobileDrawer open={openExportFilter} setIsOpen={setOpenExportFilter} title="Export Students">
        <TableExportFilter
          tab="Students"
          filter={filter}
          onFilterChange={handleFilterChange}
          branches={branches}
          loadingBranches={loadingBranches}
          classes={classes}
          loadingClasses={loadingClasses}
          arms={arms}
          loadingArms={loadingArms}
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
              <span className="text-sm font-medium">Export Students</span>
            </Button>
          </div>
        </DrawerFooter>
      </MobileDrawer>

      {/* Title and Filter buttons */}
      <div className="space-y-4">
        <RecordHeader
          tab="Students"
          filter={filter}
          onFilterChange={handleFilterChange}
          branches={branches}
          loadingBranches={loadingBranches}
          classes={classes}
          loadingClasses={loadingClasses}
          arms={arms}
          loadingArms={loadingArms}
          departments={departments}
          loadingDepartments={loadingDepartments}
        />

        <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          <OverviewCard
            title="Total Students"
            Icon={() => (
              <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex w-6 items-center justify-center rounded-xs border p-1">
                <UserFill fill="var(--color-icon-default)" className="size-2.5" />
              </div>
            )}
            value={`${studentDistribution?.total}`}
          />
          <OverviewCard
            title="Active Students"
            Icon={() => (
              <div className="bg-bg-basic-emerald-subtle border-bg-basic-emerald-accent flex w-6 items-center justify-center rounded-xs border p-1">
                <UserFill fill="var(--color-icon-default)" className="size-2.5" />
              </div>
            )}
            value={`${studentDistribution?.active}`}
          />
          <OverviewCard
            title="Withdrawn Students"
            Icon={() => (
              <div className="bg-bg-basic-yellow-subtle border-bg-basic-yellow-accent flex w-6 items-center justify-center rounded-xs border p-1">
                <UserMinus fill="var(--color-icon-default)" className="size-2.5" />
              </div>
            )}
            value={`${studentDistribution?.withdrawn}`}
          />

          <OverviewCard
            title="Graduated Students"
            Icon={() => (
              <div className="bg-bg-basic-sky-subtle border-bg-basic-sky-accent flex w-6 items-center justify-center rounded-xs border p-1">
                <GraduationCap fill="var(--color-icon-default)" className="size-2.5" />
              </div>
            )}
            value={`${studentDistribution?.graduated}`}
          />
        </div>

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

            <Button
              onClick={() => router.push(`student-and-parent-record/upload-students`)}
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
              <span className="text-text-white-default font-medium">Add Student</span>
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
            <Button
              onClick={() => setOpenExportFilter(true)}
              className="bg-bg-state-secondary border-border-darker text-text-default h-8 justify-start gap-2 text-sm font-medium"
            >
              <ShareBox fill="var(--color-icon-default-muted)" className="size-4" />
              <span>Export</span>
            </Button>
            <Button
              onClick={() => router.push(`student-and-parent-record/upload-students`)}
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

          <Button
            onClick={() => setOpenWithdraw(true)}
            className="bg-bg-state-secondary border-border-darker text-text-default h-7 border px-2.5 text-sm font-medium"
          >
            <span>Withdraw student{selectedRows.length !== 1 && "s"}</span>
          </Button>

          <Button
            onClick={() => setOpenDelete(true)}
            className="bg-bg-state-secondary border-border-darker text-text-default h-7 border px-2.5 text-sm font-medium"
          >
            <span>Delete Student{selectedRows.length !== 1 && "s"}</span>
          </Button>
        </div>
      )}

      {/* Separate the table components into two different files with their separate states, then render conditionally here */}
      {isError ? (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent
            title="Could not get Students"
            description="This is our problem, we are looking into it so as to serve you better"
            buttonText="Go to the Home page"
          />
        </div>
      ) : !data || loadingStudents ? (
        <Skeleton className="bg-bg-input-soft hidden h-100 w-full md:block" />
      ) : (
        <div className="hidden md:block">
          <DataTable
            columns={columns}
            data={dataForDesktop}
            totalCount={data?.pages[0].totalElements}
            page={page}
            setCurrentPage={setPage}
            pageSize={pageSize}
            clickHandler={row => {
              router.push(`/student-and-parent-record/${row.original.id}`);
            }}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            onSelectRows={setSelectedRows}
            loadingContent={isFetchingNextPage}
          />
        </div>
      )}

      <div className="flex flex-col justify-center gap-4 md:hidden">
        {!data || loadingStudents ? (
          <div className="space-y-4">
            <Skeleton className="bg-bg-input-soft h-36 w-full" />
            <Skeleton className="bg-bg-input-soft h-36 w-full" />
            <Skeleton className="bg-bg-input-soft h-36 w-full" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {students.map((student: Student) => (
              <MobileCard key={student.id} student={student} />
            ))}

            {hasNextPage && (
              <Button onClick={() => fetchNextPage()} className="bg-bg-state-soft text-text-subtle w-fit self-center px-10">
                Load More
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
