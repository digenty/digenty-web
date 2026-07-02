"use client";
import { Edit, Eye, FileCopy } from "@digenty/icons";
import React, { useEffect, useState } from "react";
import { FeesHeader } from "../FeesHeader";
import { DataTable } from "@/components/DataTable";
import { FeeGroupProp } from "./feeGroupType";
import { FeeGroupColumn } from "./FeeGroupColumns";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Ellipsis, Trash2, TriangleAlertIcon } from "lucide-react";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useRouter } from "next/navigation";
import { useDeleteFeeGroup, useDuplicateFeeGroup, useGetFeeGroups } from "@/hooks/queryHooks/useFee";
import { useFeesFilters } from "../useFeesFilters";
import { EmptyFeeState } from "../EmptyFeeState";
import type { FeeGroupSummary } from "@/api/fee";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { toast } from "sonner";

export const FeesGroup = () => {
  const router = useRouter();
  useBreadcrumb([
    { label: "Fees", url: "/staff/fees" },
    { label: "Fee Groups", url: "/staff/fees?tab=Fee Groups" },
  ]);

  const { branchOptions, termOptions, branchSelected, setBranchSelected, termSelected, setTermSelected, branchId, termId } = useFeesFilters();
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<FeeGroupProp[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [activeItemId, setActiveItemId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [understood, setUnderstood] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isPending, isError } = useGetFeeGroups(branchId, termId, search || undefined);
  const feesGroup: FeeGroupProp[] = (data as FeeGroupSummary[] | undefined) ?? [];

  const { mutate: deleteFeeGroup, isPending: deleting } = useDeleteFeeGroup();
  const { mutate: duplicateFeeGroup, isPending: duplicating } = useDuplicateFeeGroup();

  const openDeleteModal = () => {
    setPendingDeleteId(activeItemId);
    setActiveItemId(null);
    setUnderstood(false);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (!pendingDeleteId) return;
    deleteFeeGroup(pendingDeleteId, {
      onSuccess: () => {
        toast.success("Fee group deleted");
        setDeleteModalOpen(false);
        setPendingDeleteId(null);
        setUnderstood(false);
      },
      onError: (error: unknown) => toast.error((error as { message?: string })?.message ?? "Failed to delete fee group"),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Delete confirmation modal */}
      <Modal
        open={deleteModalOpen}
        setOpen={open => {
          setDeleteModalOpen(open);
          if (!open) setUnderstood(false);
        }}
        title="Delete Fee Group?"
        ActionButton={
          <Button
            onClick={handleDelete}
            disabled={!understood || deleting}
            className="bg-bg-state-destructive! hover:bg-bg-state-destructive-hover! text-text-white-default h-7! rounded-md px-2 py-1 text-sm disabled:opacity-40"
          >
            {deleting ? "Deleting..." : "Delete Fee Group"}
          </Button>
        }
      >
        <div className="flex flex-col gap-4 px-4 py-4">
          <p className="text-text-subtle text-sm">Are you sure you want to permanently delete this fee group? This action cannot be undone.</p>
          <div className="bg-bg-badge-warning border-border-warning flex items-start gap-3 rounded-md border p-3">
            <TriangleAlertIcon className="text-icon-warning mt-0.5 size-4 shrink-0" />
            <p className="text-text-default text-sm">
              Deleting this fee group will remove it from your available groups. It won&apos;t be available for future invoices but won&apos;t affect
              issued invoices.
            </p>
          </div>
          <label className="flex cursor-pointer items-start gap-2">
            <Checkbox checked={understood} onCheckedChange={v => setUnderstood(!!v)} className="mt-0.5" />
            <span className="text-text-default text-sm">I understand that deleting this fee group is permanent and cannot be undone.</span>
          </label>
        </div>
      </Modal>

      <FeesHeader
        title="Fee Groups"
        branches={branchOptions}
        branchSelected={branchSelected}
        setBranchSelected={setBranchSelected}
        termsOptions={termOptions}
        termSelected={termSelected}
        setTermSelected={setTermSelected}
        onAddClick={() => router.push("/staff/fees/add-fee-to-group")}
        showToggle={false}
        showExport={false}
        search={searchInput}
        onSearchChange={setSearchInput}
        showTermFilter={false}
        exportTitle="Export Group Fee"
        exportActionButton="Export Group"
        addButttonText="Add Fee Group"
      />

      {isPending && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="bg-bg-input-soft h-12 w-full rounded-md" />
          ))}
        </div>
      )}

      {!isPending && isError && <ErrorComponent title="Error" description="An error occurred while fetching fee groups." />}

      {!isPending && !isError && feesGroup.length === 0 && (
        <EmptyFeeState
          title="No Fee Groups Yet"
          description="Create groups to organise related fees into bundles you can reuse when setting up invoices."
          buttonText="Add Fee Group"
          url="/staff/fees/add-fee-to-group"
        />
      )}
      {!isPending && !isError && feesGroup.length > 0 && (
        <>
          <div className="hidden md:block">
            <DataTable
              columns={FeeGroupColumn}
              data={feesGroup}
              totalCount={feesGroup.length}
              page={page}
              setCurrentPage={setPage}
              pageSize={pageSize}
              clickHandler={row => {
                router.push(`/staff/fees/fee-group/${row.original.feeGroupId}`);
              }}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              onSelectRows={setSelectedRows}
              showPagination={true}
              classNames={{
                tableRow: "cursor-pointer",
              }}
            />
          </div>
          <div className="flex flex-col gap-4 md:hidden">
            {feesGroup.slice(0, visibleCount).map(item => {
              return (
                <div key={item.feeGroupId} className="border-border-default bg-bg-subtle rounded-md border">
                  <div className="flex h-[38px] items-center justify-between px-3 py-1.5">
                    <span className="text-text-default text-sm font-medium">{item.name}</span>
                    <Button onClick={() => setActiveItemId(item.feeGroupId)} className="text-text-muted cursor-pointer p-0! focus-visible:ring-0!">
                      <Ellipsis className="size-5" />
                    </Button>
                  </div>

                  <div className="border-border-default border-t">
                    <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                      <span className="text-text-muted font-medium">Fee</span>
                      <div className="flex items-center gap-2">
                        <Badge className="text-text-default bg-bg-badge-default border-border-default rounded-md border text-sm font-medium">
                          {item.appliedToArmsCount} {item.feeNames?.[0] ?? "fees"}
                        </Badge>
                      </div>{" "}
                    </div>
                  </div>

                  <div className="">
                    <div className="border-border-default flex justify-between px-3 py-2 text-sm">
                      <span className="text-text-muted font-medium">Total Amount</span>
                      <span className="text-text-default text-sm font-medium">₦{item.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {visibleCount < feesGroup.length && (
              <Button
                onClick={() => setVisibleCount(feesGroup.length)}
                className="bg-bg-state-soft! text-text-subtle! mx-auto my-2 flex w-39 items-center justify-center rounded-md"
              >
                Load More
              </Button>
            )}
          </div>

          {/* Single shared mobile drawer */}
          <MobileDrawer
            open={activeItemId !== null}
            setIsOpen={open => {
              if (!open) setActiveItemId(null);
            }}
            title="Actions"
          >
            <div className="flex w-full flex-col gap-4 px-3 py-4">
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => {
                    setActiveItemId(null);
                    router.push(`/staff/fees/fee-group/${activeItemId}`);
                  }}
                  className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
                >
                  <Eye className="size-4" fill="var(--color-icon-default-subtle)" /> View fee group
                </button>
                <button
                  onClick={() => {
                    setActiveItemId(null);
                    router.push(`/staff/fees/add-fee-to-group?id=${activeItemId}`);
                  }}
                  className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
                >
                  <Edit className="size-4" fill="var(--color-icon-default-subtle)" /> Edit fee group
                </button>
                <button
                  disabled={duplicating}
                  onClick={() => {
                    if (!activeItemId) return;
                    duplicateFeeGroup(activeItemId, {
                      onSuccess: result => {
                        setActiveItemId(null);
                        toast.success("Fee group duplicated");
                        router.push(`/staff/fees/fee-group/${result.feeGroupId}`);
                      },
                      onError: (error: unknown) => toast.error((error as { message?: string })?.message ?? "Failed to duplicate fee group"),
                    });
                  }}
                  className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm disabled:opacity-50"
                >
                  <FileCopy className="size-4" fill="var(--color-icon-default-subtle)" />
                  {duplicating ? "Duplicating..." : "Duplicate fee group"}
                </button>
                <button
                  onClick={openDeleteModal}
                  className="hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm text-red-600"
                >
                  <Trash2 className="size-4" /> Delete fee group
                </button>
              </div>
            </div>
          </MobileDrawer>
        </>
      )}
    </div>
  );
};
