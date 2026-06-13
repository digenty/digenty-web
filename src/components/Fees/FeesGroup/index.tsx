"use client";
import { Edit, Eye, FileCopy } from "@digenty/icons";
import React, { useState } from "react";
import { FeesHeader } from "../FeesHeader";
import { DataTable } from "@/components/DataTable";
import { FeeGroupProp } from "./feeGroupType";
import { FeeGroupColumn } from "./FeeGroupColumns";
import { Button } from "@/components/ui/button";
import { Ellipsis, Trash2 } from "lucide-react";
import { MobileDrawer } from "@/components/MobileDrawer";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useRouter } from "next/navigation";
import { useGetFeeGroups } from "@/hooks/queryHooks/useFee";
import { useFeesFilters } from "../useFeesFilters";
import { EmptyFeeState } from "../EmptyFeeState";
import type { FeeGroupSummary } from "@/api/fee";

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
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const { data, isPending } = useGetFeeGroups(branchId, termId);
  const feesGroup: FeeGroupProp[] = (data as FeeGroupSummary[] | undefined) ?? [];

  return (
    <div className="flex flex-col gap-6">
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
        showTermFilter={false}
        exportTitle="Export Group Fee"
        exportActionButton="Export Group"
        addButttonText="Add Fee Group"
      />

      {isPending ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="bg-bg-input-soft h-12 w-full rounded-md" />
          ))}
        </div>
      ) : feesGroup.length === 0 ? (
        <EmptyFeeState
          title="No Fee Groups Yet"
          description="Create groups to organise related fees into bundles you can reuse when setting up invoices."
          buttonText="Add Fee Group"
          url="/staff/fees/add-fee-to-group"
        />
      ) : (
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
                    <Button onClick={() => setIsOpen(true)} className="text-text-muted cursor-pointer p-0! focus-visible:ring-0!">
                      <Ellipsis className="size-5" />
                    </Button>
                    <MobileDrawer open={isOpen} setIsOpen={setIsOpen} title="Actions">
                      <div className="flex w-full flex-col gap-4 px-3 py-4">
                        <div className="flex flex-col items-center gap-2">
                          <div className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm">
                            <Eye className="size-4" fill="var(--color-icon-default-subtle)" /> View fee item
                          </div>
                          <div className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm">
                            <Edit className="size-4" fill="var(--color-icon-default-subtle)" /> Edit fee item
                          </div>

                          <div className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm">
                            <FileCopy className="size-4" fill="var(--color-icon-default-subtle)" /> Duplicate fee item
                          </div>
                          <div className="hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm text-red-600">
                            <Trash2 className="size-4" /> Delete invoice
                          </div>
                        </div>
                      </div>
                    </MobileDrawer>
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
        </>
      )}
    </div>
  );
};
