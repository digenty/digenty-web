"use client";

import { Eye, FileList3Fill, GraduationCapFill } from "@digenty/icons";
import React, { useEffect, useState } from "react";
import { ClassFeeTypes } from "./classTypes";
import { DataTable } from "@/components/DataTable";
import { columnsClassFees } from "./ClassColumns";
import { useRouter } from "next/navigation";
import { OverviewCard } from "@/components/OverviewCard";

import { FeesHeader } from "../FeesHeader";
import { Button } from "@/components/ui/button";
import { Ellipsis, Trash2, TriangleAlertIcon } from "lucide-react";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useDeleteFee, useGetFeeClassOverview } from "@/hooks/queryHooks/useFee";
import { useFeesFilters } from "../useFeesFilters";
import { exportToCSV } from "@/lib/export-utils";
import { EmptyFeeState } from "../EmptyFeeState";
import type { BranchFeeOverview, ClassFeeOverview, FeeClassOverviewResponse } from "@/api/fee";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { toast } from "sonner";

const toRows = (classes: ClassFeeOverview[] = []): ClassFeeTypes[] =>
  classes.map(c => ({ id: c.classId, classname: c.className, feeNames: c.feeNames ?? [], totalAmount: c.totalAmount }));

export const ClassFees = () => {
  useBreadcrumb([
    { label: "Fees", url: "/staff/fees" },
    { label: "Class Fees", url: "/staff/fees?tab=Class Fees" },
  ]);
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<ClassFeeTypes[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [activeClassFeeId, setActiveClassFeeId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const pageSize = 4;

  const { branchOptions, termOptions, branchSelected, setBranchSelected, termSelected, setTermSelected, branchId, term, sessionId } =
    useFeesFilters();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isPending, isError } = useGetFeeClassOverview(sessionId ?? 0, term ?? "FIRST", branchId, search || undefined);
  const overview = data as FeeClassOverviewResponse | undefined;
  const branchGroups: BranchFeeOverview[] = overview?.branches ?? [];

  const { mutate: deleteFee, isPending: deleting } = useDeleteFee();

  const totalClasses = branchGroups.reduce((acc, g) => acc + g.classes.length, 0);

  const handleExport = () => {
    const headers = ["S/N", "Branch", "Class Name", "Fee Names", "Total Amount (₦)"];
    const rows = branchGroups.flatMap(group =>
      group.classes.map((c, i) => [i + 1, group.branchName, c.className, (c.feeNames ?? []).join(", "), c.totalAmount]),
    );
    exportToCSV(`ClassFees_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  const openDeleteModal = (id: number) => {
    setPendingDeleteId(id);
    setActiveClassFeeId(null);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (!pendingDeleteId) return;
    deleteFee(pendingDeleteId, {
      onSuccess: () => {
        toast.success("Class fee deleted");
        setDeleteModalOpen(false);
        setPendingDeleteId(null);
      },
      onError: (error: unknown) => toast.error((error as { message?: string })?.message ?? "Failed to delete class fee"),
    });
  };

  return (
    <div>
      {/* Delete confirmation modal */}
      <Modal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        title="Delete Class Fee?"
        ActionButton={
          <Button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-bg-state-destructive! hover:bg-bg-state-destructive-hover! text-text-white-default h-7! rounded-md px-2 py-1 text-sm disabled:opacity-40"
          >
            {deleting ? "Deleting..." : "Delete Class Fee"}
          </Button>
        }
      >
        <div className="flex flex-col gap-4 px-4 py-4">
          <p className="text-text-subtle text-sm">Are you sure you want to delete this class fee? This action cannot be undone.</p>
          <div className="bg-bg-badge-warning border-border-warning flex items-start gap-3 rounded-md border p-3">
            <TriangleAlertIcon className="text-icon-warning mt-0.5 size-4 shrink-0" />
            <p className="text-text-default text-sm">
              Deleting this class fee will remove all associated fee configurations. Issued invoices won&apos;t be affected.
            </p>
          </div>
        </div>
      </Modal>

      <FeesHeader
        title="Class Fees Overview"
        branches={branchOptions}
        branchSelected={branchSelected}
        setBranchSelected={setBranchSelected}
        termsOptions={termOptions}
        termSelected={termSelected}
        setTermSelected={setTermSelected}
        onAddClick={() => router.push("/staff/fees/add")}
        search={searchInput}
        onSearchChange={setSearchInput}
        exportTitle="Export Class Fees"
        exportActionButton="Export Class Fees"
        exportCount={totalClasses}
        onExportConfirm={handleExport}
      />

      {isPending && (
        <div className="mt-4 flex flex-col gap-3 md:mt-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="bg-bg-input-soft h-12 w-full rounded-md" />
          ))}
        </div>
      )}

      {!isPending && branchGroups.length === 0 && (
        <EmptyFeeState
          title="Let's set up your fees"
          description="You can add fees for one or more classes, branches and arms. We'll guide you step-by step"
          buttonText="Add First Fee"
          url="/staff/fees/add"
        />
      )}

      {!isPending && isError && <ErrorComponent title="Error" description="An error occurred while fetching class fees." />}

      {!isPending && branchGroups.length > 0 && (
        <div className="mt-4 md:mt-6">
          {branchGroups.map(group => {
            const rows = toRows(group.classes);
            return (
              <div key={group.branchId} className="mb-10 flex flex-col gap-4">
                <h2 className="text-text-default text-lg font-semibold">{group.branchName}</h2>
                <div className="flex gap-3">
                  <OverviewCard
                    title="Total Class Variations"
                    Icon={() => (
                      <div className="bg-bg-basic-sky-subtle border-bg-basic-sky-accent flex w-6 items-center justify-center rounded-xs border p-1">
                        <GraduationCapFill fill="var(--color-icon-default)" className="size-3" />
                      </div>
                    )}
                    value={String(group.totalClassVariations)}
                  />
                  <OverviewCard
                    title="Total Fees"
                    Icon={() => (
                      <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex w-6 items-center justify-center rounded-xs border p-1">
                        <FileList3Fill fill="var(--color-icon-default)" className="size-3" />
                      </div>
                    )}
                    value={`₦${group.totalFees.toLocaleString()}`}
                  />
                </div>
                <div className="hidden md:block">
                  <DataTable
                    columns={columnsClassFees}
                    data={rows}
                    totalCount={rows.length}
                    page={page}
                    setCurrentPage={setPage}
                    pageSize={pageSize}
                    clickHandler={row => {
                      router.push(`/staff/fees/${row.original.id}`);
                    }}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                    onSelectRows={setSelectedRows}
                    showPagination={false}
                    classNames={{
                      tableRow: "cursor-pointer",
                    }}
                  />
                </div>

                <div className="flex flex-col gap-4 md:hidden">
                  {rows.slice(0, visibleCount).map(fee => {
                    return (
                      <div key={fee.id} className="border-border-default bg-bg-subtle rounded-md border last:border-none">
                        <div className="flex h-[38px] items-center justify-between px-3 py-1.5">
                          <span className="text-text-default text-sm font-medium">{fee.classname}</span>
                          <Button
                            onClick={() => setActiveClassFeeId(fee.id)}
                            className="text-text-muted cursor-pointer p-0! focus-visible:ring-0!"
                          >
                            <Ellipsis className="size-5" />
                          </Button>
                        </div>
                        <div className="border-border-default border-t">
                          <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                            <span className="text-text-muted font-medium">Fee</span>
                            <div className="flex items-center gap-2">
                              <Badge className="text-text-default bg-bg-badge-default border-border-default rounded-md border text-sm font-medium">
                                {fee.feeNames.length} {fee.feeNames[0] ?? "fees"}
                              </Badge>
                            </div>{" "}
                          </div>
                        </div>

                        <div className="">
                          <div className="border-border-default flex justify-between px-3 py-2 text-sm">
                            <span className="text-text-muted font-medium">Total Amount</span>
                            <span className="text-text-default text-sm font-medium">₦{fee.totalAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {visibleCount < rows.length && (
                    <Button
                      onClick={() => setVisibleCount(rows.length)}
                      className="bg-bg-state-soft! text-text-subtle! mx-auto my-2 flex w-39 items-center justify-center rounded-md"
                    >
                      Load More
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Single shared mobile drawer */}
          <MobileDrawer
            open={activeClassFeeId !== null}
            setIsOpen={open => { if (!open) setActiveClassFeeId(null); }}
            title="Actions"
          >
            <div className="flex w-full flex-col gap-4 px-3 py-4">
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => { setActiveClassFeeId(null); router.push(`/staff/fees/${activeClassFeeId}`); }}
                  className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
                >
                  <Eye className="size-4" fill="var(--color-icon-default-subtle)" /> View class fee
                </button>
                <button
                  onClick={() => activeClassFeeId && openDeleteModal(activeClassFeeId)}
                  className="hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm text-red-600"
                >
                  <Trash2 className="size-4" /> Delete class fee
                </button>
              </div>
            </div>
          </MobileDrawer>
        </div>
      )}
    </div>
  );
};
