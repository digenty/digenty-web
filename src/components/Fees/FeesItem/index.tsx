"use client";

import { Edit, Eye } from "@digenty/icons";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import React, { useEffect, useMemo, useState } from "react";
import { FeesHeader } from "../FeesHeader";
import { DataTable } from "@/components/DataTable";
import { FeeItemsColumns } from "./FeetItemColumns";
import { Ellipsis, Trash2 } from "lucide-react";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Badge } from "@/components/ui/badge";
import { getStatusBadge } from "@/components/Status";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useRouter } from "next/navigation";
import { EmptyFeeState } from "../EmptyFeeState";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useGetFeeItems, useDeleteFeeItem, useExportFeeItems } from "@/hooks/queryHooks/useFee";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { toast } from "sonner";
import { Branch } from "@/api/types";
import { unwrapArray } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { FeeItemApiItem } from "./feeItemType";

const TERM_LABEL: Record<string, string> = { FIRST: "First Term", SECOND: "Second Term", THIRD: "Third Term" };

import type { FeeItemProp as FeeItemRow } from "./feeItemType";

export const FeesItem = () => {
  const router = useRouter();
  const { schoolId } = useLoggedInUser();

  useBreadcrumb([
    { label: "Fees", url: "/staff/fees" },
    { label: "Fee Items", url: "/staff/fees?tab=Fee Items" },
  ]);

  const { data: branchesData } = useGetBranches();
  const { data: termsData, isLoading: isTermsLoading } = useGetTerms(schoolId);

  const branches: Branch[] = unwrapArray<Branch>(branchesData);
  const rawTerms = unwrapArray<{ termId: number; term: string; label?: string; name?: string }>(termsData);

  const branchOptions = ["All Branches", ...branches.filter(b => b.name).map((b: Branch) => b.name!)];
  const termOptions = rawTerms.map(t => t.label ?? t.name ?? TERM_LABEL[t.term] ?? t.term);

  const [branchSelected, setBranchSelected] = useState("All Branches");
  const [termSelected, setTermSelected] = useState("");

  useEffect(() => {
    if (termOptions.length > 0 && !termSelected) {
      setTermSelected(termOptions[0]);
    }
  }, [termOptions, termSelected]);

  const [rowSelection, setRowSelection] = useState({});
  const [visibleCount, setVisibleCount] = useState(3);
  const [openItemId, setOpenItemId] = useState<number | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const { mutate: deleteFeeItem, isPending: isDeleting } = useDeleteFeeItem();
  const pageSize = 6;

  const selectedBranch = branches.find((b: Branch) => b.name === branchSelected);
  const selectedTermObj = rawTerms.find(t => (t.label ?? t.name ?? TERM_LABEL[t.term]) === termSelected);

  const { data: feeItemsData, isLoading: isFeeItemsLoading, isError } = useGetFeeItems(selectedBranch?.id, selectedTermObj?.termId);
  const isLoading = isTermsLoading || isFeeItemsLoading;
  const feeItems: FeeItemRow[] = useMemo(() => {
    const raw = unwrapArray<FeeItemApiItem>(feeItemsData);
    return raw.map(item => ({
      id: item.feeItemId,
      feeName: item.feeName,
      status: item.required ? "Required" : "Optional",
      applyTo: { school: branchSelected !== "All Branches" ? branchSelected : "All Branches", count: 1 },
      totalAmount: item.amount ?? 0,
    }));
  }, [feeItemsData, branchSelected]);

  const { mutate: doExport, isPending: isExporting } = useExportFeeItems();

  const handleExportConfirm = ({ branchName, termLabel }: { branchName: string; termLabel: string }) => {
    const branch = branches.find((b: Branch) => b.name === branchName);
    const termObj = rawTerms.find(t => (t.label ?? t.name ?? TERM_LABEL[t.term]) === termLabel);
    doExport({ branchId: branch?.id, termId: termObj?.termId });
  };

  if (isLoading) {
    return <Skeleton className="bg-bg-input-soft h-100 w-full" />;
  }

  if (isError || feeItems.length === 0) {
    return (
      <EmptyFeeState
        title="No Fee Items Yet"
        description="Add fees here to start managing tuition, exams, levies, or other charges for your classes."
        buttonText="Add Fee Item"
        url="/staff/fees/add"
      />
    );
  }
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <FeesHeader
        title="Fee Items"
        branches={branchOptions}
        branchSelected={branchSelected}
        setBranchSelected={v => {
          setBranchSelected(v);
          setPage(1);
        }}
        termsOptions={termOptions.length ? termOptions : ["No terms"]}
        termSelected={termSelected}
        setTermSelected={v => {
          setTermSelected(v);
          setPage(1);
        }}
        onAddClick={() => router.push("/staff/fees/add")}
        showToggle={false}
        exportTitle="Export Fee Items"
        exportActionButton="Export Fees"
        onExportConfirm={handleExportConfirm}
        isExporting={isExporting}
        exportResultCount={feeItems.length}
        exportResultLabel="Fee Items Found"
      />

      {/* Desktop */}
      <div className="hidden md:block">
        <DataTable
          columns={FeeItemsColumns}
          data={feeItems}
          totalCount={feeItems.length}
          page={page}
          setCurrentPage={setPage}
          pageSize={pageSize}
          clickHandler={row => router.push(`/staff/fees/fee-item/${row.original.id}`)}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          onSelectRows={() => {}}
          showPagination={feeItems.length > pageSize}
          classNames={{ tableRow: "cursor-pointer" }}
        />
      </div>

      {/* Mobile */}
      <div className="flex flex-col gap-4 md:hidden">
        {feeItems.slice(0, visibleCount).map(item => (
          <div key={item.id} className="border-border-default bg-bg-subtle rounded-md border">
            <div className="flex h-9.5 items-center justify-between px-3 py-1.5">
              <span className="text-text-default text-sm font-medium">{item.feeName}</span>
              <Button onClick={() => setOpenItemId(item.id)} className="text-text-muted cursor-pointer p-0! focus-visible:ring-0!">
                <Ellipsis className="size-5" />
              </Button>
              <MobileDrawer
                open={openItemId === item.id}
                setIsOpen={v => {
                  if (!v) setOpenItemId(null);
                }}
                title="Actions"
              >
                <div className="flex w-full flex-col gap-4 px-3 py-4">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      onClick={() => {
                        setOpenItemId(null);
                        router.push(`/staff/fees/fee-item/${item.id}`);
                      }}
                      className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-md border p-2 text-sm"
                    >
                      <Eye className="size-4" fill="var(--color-icon-default-subtle)" /> View fee item
                    </div>
                    <div
                      onClick={() => {
                        setOpenItemId(null);
                        router.push(`/staff/fees/fee-item/${item.id}`);
                      }}
                      className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-md border p-2 text-sm"
                    >
                      <Edit className="size-4" fill="var(--color-icon-default-subtle)" /> Edit fee item
                    </div>
                    <div
                      onClick={() => {
                        setOpenItemId(null);
                        setDeleteItemId(item.id);
                      }}
                      className="hover:bg-bg-muted border-border-darker flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-md border p-2 text-sm text-red-600"
                    >
                      <Trash2 className="size-4" /> Delete
                    </div>
                  </div>
                </div>
              </MobileDrawer>
            </div>

            <div className="border-border-default flex justify-between border-t px-3 py-2 text-sm">
              <span className="text-text-muted font-medium">Requirement</span>
              {getStatusBadge(item.status)}
            </div>
            <div className="border-border-default border-t">
              <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                <span className="text-text-muted font-medium">Applies To</span>
                <div className="flex items-center gap-2">
                  <Badge className="text-text-default bg-bg-badge-default border-border-default rounded-md border text-sm font-medium">
                    {item.applyTo.school}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="border-border-default flex justify-between px-3 py-2 text-sm">
              <span className="text-text-muted font-medium">Total Amount</span>
              <span className="text-text-default text-sm font-medium">₦{item.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        ))}

        {visibleCount < feeItems.length && (
          <Button
            onClick={() => setVisibleCount(feeItems.length)}
            className="bg-bg-state-soft! text-text-subtle! mx-auto my-2 flex w-39 items-center justify-center rounded-md"
          >
            Load More
          </Button>
        )}
      </div>

      <Modal
        open={deleteItemId !== null}
        setOpen={v => {
          if (!v) setDeleteItemId(null);
        }}
        title="Delete Fee Item?"
        ActionButton={
          <Button
            onClick={() => {
              if (!deleteItemId) return;
              deleteFeeItem(deleteItemId, {
                onSuccess: () => {
                  toast.success("Fee item deleted");
                  setDeleteItemId(null);
                },
                onError: (err: unknown) => {
                  toast.error((err as { message?: string })?.message ?? "Failed to delete");
                  setDeleteItemId(null);
                },
              });
            }}
            disabled={isDeleting}
            className="hover:bg-bg-state-destructive! bg-bg-state-disabled! text-text-hint! hover:text-text-white-default! h-7!"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        }
      >
        <div className="text-text-subtle px-6 py-4 text-sm font-medium">
          Are you sure you want to permanently delete this fee item? This action cannot be undone.
        </div>
      </Modal>
    </div>
  );
};
