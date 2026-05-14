"use client";

import { Edit, Eye } from "@digenty/icons";
import React, { useMemo, useState } from "react";
import { FeesHeader } from "../FeesHeader";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Ellipsis, Trash2 } from "lucide-react";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Badge } from "@/components/ui/badge";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useRouter } from "next/navigation";
import { EmptyFeeState } from "../EmptyFeeState";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetFeeGroups, useDeleteFeeGroup, useExportFeeGroups } from "@/hooks/queryHooks/useFee";
import { Branch, BranchWithClassLevels } from "@/api/types";
import { Modal } from "@/components/Modal";
import { toast } from "sonner";

function toBranches(list: unknown[]): Branch[] {
  return list
    .map(item => {
      if (item && typeof item === "object" && "branch" in item) return (item as BranchWithClassLevels).branch;
      return item as Branch;
    })
    .filter((b): b is Branch => !!b && typeof b === "object" && typeof (b as Branch).id === "number");
}

function extractBranches(data: unknown): Branch[] {
  if (!data) return [];
  if (Array.isArray(data)) return toBranches(data);
  const root = data as Record<string, unknown>;
  if (Array.isArray(root.data)) return toBranches(root.data as unknown[]);
  if (root.data && typeof root.data === "object") {
    const inner = root.data as Record<string, unknown>;
    if (Array.isArray(inner.content)) return toBranches(inner.content as unknown[]);
  }
  return [];
}
import { Spinner } from "@/components/ui/spinner";
import { unwrapArray } from "@/lib/utils";
import { FeeGroupApiItem, FeeGroupProp } from "./feeGroupType";
import { FeeGroupColumn } from "./FeeGroupColumns";
import { Skeleton } from "@/components/ui/skeleton";

export const FeesGroup = () => {
  const router = useRouter();

  useBreadcrumb([
    { label: "Fees", url: "/staff/fees" },
    { label: "Fee Groups", url: "/staff/fees?tab=Fee Groups" },
  ]);

  const { data: branchesData } = useGetBranches();
  const branches: Branch[] = extractBranches(branchesData);
  const branchOptions = ["All Branches", ...branches.filter(b => b.name).map((b: Branch) => b.name!)];

  const [branchSelected, setBranchSelected] = useState("All Branches");
  const [rowSelection, setRowSelection] = useState({});
  const [visibleCount, setVisibleCount] = useState(3);
  const [openItemId, setOpenItemId] = useState<number | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const { mutate: deleteFeeGroup, isPending: isDeleting } = useDeleteFeeGroup();
  const pageSize = 5;

  const selectedBranch = branches.find((b: Branch) => b.name === branchSelected);
  const branchIdForQuery = branchSelected !== "All Branches" ? selectedBranch?.id : undefined;

  const { data: groupsData, isLoading } = useGetFeeGroups(branchIdForQuery);

  const feeGroups: FeeGroupProp[] = useMemo(() => {
    const raw = unwrapArray<FeeGroupApiItem>(groupsData);
    return raw.map(g => ({
      id: g.feeGroupId,
      name: g.name,
      feeNames: g.feeNames ?? [],
      totalAmount: g.totalAmount ?? 0,
      appliedToArmsCount: g.appliedToArmsCount ?? 0,
    }));
  }, [groupsData]);

  const { mutate: doExport, isPending: isExporting } = useExportFeeGroups();

  const handleExportConfirm = ({ branchName }: { branchName: string }) => {
    const branch = branches.find((b: Branch) => b.name === branchName);
    doExport({ branchId: branch?.id });
  };

  return (
    <div className="flex flex-col gap-6">
      {isLoading ? (
        <Skeleton className="bg-bg-input-soft h-10 w-full" />
      ) : (
        <FeesHeader
          title="Fee Groups"
          branches={branchOptions}
          branchSelected={branchSelected}
          setBranchSelected={v => {
            setBranchSelected(v);
            setPage(1);
          }}
          termSelected=""
          setTermSelected={() => {}}
          onAddClick={() => router.push("/staff/fees/add-fee-to-group")}
          showToggle={false}
          showExport={true}
          showTermFilter={false}
          exportTitle="Export Fee Groups"
          exportActionButton="Export Groups"
          onExportConfirm={handleExportConfirm}
          isExporting={isExporting}
          exportResultCount={feeGroups.length}
          exportResultLabel="Fee Groups Found"
          termsOptions={[]}
          addButttonText="Add Fee Group"
        />
      )}

      {isLoading && <Skeleton className="bg-bg-input-soft h-100 w-full" />}

      {!isLoading && feeGroups.length === 0 && (
        <EmptyFeeState
          title="No Fee Groups Yet"
          description="Create groups to organise related fees into bundles you can reuse when setting up invoices."
          buttonText="Add Fee Group"
          url="/staff/fees/add-fee-to-group"
        />
      )}

      {!isLoading && feeGroups.length > 0 && (
        <>
          <div className="hidden md:block">
            <DataTable
              columns={FeeGroupColumn}
              data={feeGroups}
              totalCount={feeGroups.length}
              page={page}
              setCurrentPage={setPage}
              pageSize={pageSize}
              clickHandler={row => router.push(`/staff/fees/fee-group/${row.original.id}`)}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              onSelectRows={() => {}}
              showPagination={feeGroups.length > pageSize}
              classNames={{ tableRow: "cursor-pointer" }}
            />
          </div>

          <div className="flex flex-col gap-4 md:hidden">
            {feeGroups.slice(0, visibleCount).map(item => (
              <div key={item.id} className="border-border-default bg-bg-subtle rounded-md border">
                <div className="flex h-9.5 items-center justify-between px-3 py-1.5">
                  <span className="text-text-default text-sm font-medium">{item.name}</span>
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
                            router.push(`/staff/fees/fee-group/${item.id}`);
                          }}
                          className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-md border p-2 text-sm"
                        >
                          <Eye className="size-4" fill="var(--color-icon-default-subtle)" /> View fee group
                        </div>
                        <div
                          onClick={() => {
                            setOpenItemId(null);
                            router.push(`/staff/fees/fee-group/${item.id}/edit`);
                          }}
                          className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-md border p-2 text-sm"
                        >
                          <Edit className="size-4" fill="var(--color-icon-default-subtle)" /> Edit fee group
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

                <div className="border-border-default border-t">
                  <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                    <span className="text-text-muted font-medium">Items</span>
                    <div className="flex items-center gap-2">
                      <Badge className="text-text-default bg-bg-badge-default border-border-default rounded-md border text-sm font-medium">
                        {item.feeNames.length} items
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

            {visibleCount < feeGroups.length && (
              <Button
                onClick={() => setVisibleCount(feeGroups.length)}
                className="bg-bg-state-soft! text-text-subtle! mx-auto my-2 flex w-39 items-center justify-center rounded-md"
              >
                Load More
              </Button>
            )}
          </div>
        </>
      )}

      <Modal
        open={deleteItemId !== null}
        setOpen={v => {
          if (!v) setDeleteItemId(null);
        }}
        title="Delete Fee Group?"
        ActionButton={
          <Button
            onClick={() => {
              if (!deleteItemId) return;
              deleteFeeGroup(deleteItemId, {
                onSuccess: () => {
                  toast.success("Fee group deleted");
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
          Are you sure you want to permanently delete this fee group? This action cannot be undone.
        </div>
      </Modal>
    </div>
  );
};
