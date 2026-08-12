import { Edit, Eye, FileCopy } from "@digenty/icons";
import React, { useEffect, useState } from "react";
import { FeesHeader } from "../FeesHeader";
import { FeeItemProp } from "./feeItemType";
import { DataTable } from "@/components/DataTable";
import { FeeItemsColumns } from "./FeetItemColumns";
import { Button } from "@/components/ui/button";
import { Ellipsis, Trash2 } from "lucide-react";
import { MobileDrawer } from "@/components/MobileDrawer";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatusBadge } from "@/components/Status";

import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useRouter } from "next/navigation";
import { useDeleteFeeItem, useDuplicateFeeItem, useGetFeeItems } from "@/hooks/queryHooks/useFee";
import { useFeesFilters } from "../useFeesFilters";
import { exportToCSV } from "@/lib/export-utils";
import { EmptyFeeState } from "../EmptyFeeState";
import type { FeeItemDetail } from "@/api/fee";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { toast } from "sonner";

export const FeesItem = () => {
  const router = useRouter();
  useBreadcrumb([
    { label: "Fees", url: "/staff/fees" },
    { label: "Fee Items", url: "/staff/fees?tab=Fee Items" },
  ]);
  const { branchOptions, termOptions, branchSelected, setBranchSelected, termSelected, setTermSelected, branchId, termId } = useFeesFilters();
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<FeeItemProp[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [activeItemId, setActiveItemId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isPending, isError, error, refetch } = useGetFeeItems({ branchId, termId, search: search || undefined });
  const feesItems: FeeItemProp[] = (data as FeeItemDetail[] | undefined) ?? [];
  const errorMessage = (error as { message?: string } | null)?.message ?? "An error occurred while fetching fee items.";

  useEffect(() => {
    if (isError) toast.error(errorMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  const { mutate: deleteFeeItem, isPending: deleting } = useDeleteFeeItem();
  const { mutate: duplicateFeeItem, isPending: duplicating } = useDuplicateFeeItem();

  const handleExport = () => {
    const headers = ["S/N", "Fee Name", "Required", "Quantity", "Amount (₦)"];
    const rows = feesItems.map((item, i) => [i + 1, item.feeName, item.required ? "Required" : "Optional", item.quantity, item.amount]);
    exportToCSV(`FeeItems_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  const activeItem = feesItems.find(i => i.feeItemId === activeItemId);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <FeesHeader
        title="Fee Items"
        branches={branchOptions}
        branchSelected={branchSelected}
        setBranchSelected={setBranchSelected}
        termsOptions={termOptions}
        termSelected={termSelected}
        setTermSelected={setTermSelected}
        onAddClick={() => router.push("/staff/fees/add")}
        showToggle={false}
        search={searchInput}
        onSearchChange={setSearchInput}
        exportTitle="Export Fee Items"
        exportActionButton="Export Fees"
        exportCount={feesItems.length}
        onExportConfirm={handleExport}
      />
      {isPending && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="bg-bg-input-soft h-12 w-full rounded-md" />
          ))}
        </div>
      )}

      {!isPending && isError && <ErrorComponent title="Error" description={errorMessage} buttonText="Retry" onClick={() => refetch()} />}

      {!isPending && !isError && feesItems.length === 0 && (
        <EmptyFeeState
          title="No Fees Created"
          description="Add fees here to start managing tuition, exams, levies, or other charges for your classes."
          buttonText="Add First Fee"
          url="/staff/fees/add"
        />
      )}

      {!isPending && !isError && feesItems.length > 0 && (
        <>
          <div className="hidden md:block">
            <DataTable
              columns={FeeItemsColumns}
              data={feesItems}
              totalCount={feesItems.length}
              page={page}
              setCurrentPage={setPage}
              pageSize={pageSize}
              clickHandler={row => {
                router.push(`/staff/fees/fee-item/${row.original.feeItemId}`);
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
            {feesItems.slice(0, visibleCount).map(item => {
              return (
                <div key={item.feeItemId} className="border-border-default bg-bg-subtle rounded-md border">
                  <div className="flex h-[38px] items-center justify-between px-3 py-1.5">
                    <span className="text-text-default text-sm font-medium">{item.feeName}</span>
                    <Button onClick={() => setActiveItemId(item.feeItemId)} className="text-text-muted cursor-pointer p-0! focus-visible:ring-0!">
                      <Ellipsis className="size-5" />
                    </Button>
                  </div>
                  <div className="border-border-default flex justify-between border-t px-3 py-2 text-sm">
                    <span className="text-text-muted font-medium">Requirement</span>
                    {getStatusBadge(item.required ? "Required" : "Optional")}
                  </div>
                  <div className="border-border-default border-t">
                    <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                      <span className="text-text-muted font-medium">Quantity</span>
                      <div className="flex items-center gap-2">
                        <Badge className="text-text-default bg-bg-badge-default border-border-default rounded-md border text-sm font-medium">
                          {item.quantity}
                        </Badge>
                      </div>{" "}
                    </div>
                  </div>

                  <div className="">
                    <div className="border-border-default flex justify-between px-3 py-2 text-sm">
                      <span className="text-text-muted font-medium">Amount</span>
                      <span className="text-text-default text-sm font-medium">₦{item.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {visibleCount < feesItems.length && (
              <Button
                onClick={() => setVisibleCount(feesItems.length)}
                className="bg-bg-state-soft! text-text-subtle! mx-auto my-2 flex w-39 items-center justify-center rounded-md"
              >
                Load More
              </Button>
            )}
          </div>

          {/* Single shared mobile drawer, bound to activeItem */}
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
                    router.push(`/staff/fees/fee-item/${activeItemId}`);
                  }}
                  className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
                >
                  <Eye className="size-4" fill="var(--color-icon-default-subtle)" /> View fee item
                </button>
                <button
                  onClick={() => {
                    setActiveItemId(null);
                    router.push(`/staff/fees/fee-item/${activeItemId}/edit`);
                  }}
                  className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
                >
                  <Edit className="size-4" fill="var(--color-icon-default-subtle)" /> Edit fee item
                </button>
                <button
                  disabled={duplicating}
                  onClick={() => {
                    if (!activeItemId) return;
                    duplicateFeeItem(activeItemId, {
                      onSuccess: result => {
                        setActiveItemId(null);
                        toast.success("Fee item duplicated");
                        router.push(`/staff/fees/fee-item/${result.feeItemId}`);
                      },
                      onError: (error: unknown) => toast.error((error as { message?: string })?.message ?? "Failed to duplicate fee item"),
                    });
                  }}
                  className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm disabled:opacity-50"
                >
                  <FileCopy className="size-4" fill="var(--color-icon-default-subtle)" />
                  {duplicating ? "Duplicating..." : "Duplicate fee item"}
                </button>
                <button
                  disabled={deleting}
                  onClick={() => {
                    if (!activeItemId) return;
                    deleteFeeItem(activeItemId, {
                      onSuccess: () => {
                        setActiveItemId(null);
                        toast.success("Fee item deleted");
                      },
                      onError: (error: unknown) => toast.error((error as { message?: string })?.message ?? "Failed to delete fee item"),
                    });
                  }}
                  className="hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm text-red-600 disabled:opacity-50"
                >
                  <Trash2 className="size-4" /> {deleting ? "Deleting..." : "Delete fee item"}
                </button>
              </div>
            </div>
          </MobileDrawer>
        </>
      )}
    </div>
  );
};
