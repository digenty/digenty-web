"use client";

import React, { useState } from "react";
import { AllBranchesTableProps } from "./types";

import { AllBranchDetailsColumns } from "./Columns";
import { DataTable } from "@/components/DataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { MobileDrawer } from "@/components/MobileDrawer";
import Eye from "@/components/Icons/Eye";
import Notification2 from "@/components/Icons/Notification2";
import { Key } from "@/components/Icons/Key";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { PageEmptyState } from "@/components/Error/PageEmptyState";

export const AllBranchesTable = ({ isFetching, allBranchList }: { allBranchList: AllBranchesTableProps[]; isFetching: boolean }) => {
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<AllBranchesTableProps[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const pageSize = 15;
  return (
    <div className="flex flex-col gap-4">
      <SearchInput className="bg-bg-input-soft w-full rounded-md md:w-71" />

      {isFetching ? (
        <Skeleton className="bg-bg-input-soft h-100 w-full" />
      ) : !allBranchList.length ? (
        <PageEmptyState title="No Branch" description="You do not have any branch." buttonText="Go back" />
      ) : (
        <div className="">
          <div className="hidden md:block">
            <DataTable
              columns={AllBranchDetailsColumns}
              data={allBranchList}
              totalCount={allBranchList.length}
              page={page}
              setCurrentPage={setPage}
              pageSize={pageSize}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              onSelectRows={setSelectedRows}
              clickHandler={() => {}}
              showPagination={false}
            />
          </div>

          <div className="flex flex-col gap-4 md:hidden">
            {allBranchList.slice(0, visibleCount).map((item: AllBranchesTableProps) => {
              return (
                <div key={item.branchId} className="border-border-default bg-bg-subtle rounded-md border">
                  <div className="flex h-[38px] items-center justify-between px-3 py-1.5">
                    <span className="text-text-default text-sm font-medium">{item.branchName}</span>
                    <Button onClick={() => setIsOpen(true)} className="text-text-muted cursor-pointer p-0! focus-visible:ring-0!">
                      <Ellipsis className="size-5" />
                    </Button>
                    <MobileDrawer open={isOpen} setIsOpen={setIsOpen} title="Actions">
                      <div className="flex w-full flex-col gap-4 px-3 py-4">
                        <div className="flex flex-col items-center gap-2">
                          <div className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm">
                            <Eye className="size-4" fill="var(--color-icon-default-subtle)" /> View Branch
                          </div>
                          <div className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm">
                            <Notification2 className="size-4" fill="var(--color-icon-default-subtle)" /> Notify Branch Head
                          </div>

                          <div
                            onClick={() => router.push(`/classes-and-subjects/all-branches/${item.branchId}/manage-edits`)}
                            role="button"
                            className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
                          >
                            <Key className="size-4" fill="var(--color-icon-default-subtle)" /> Manage Edit Requests
                          </div>
                        </div>
                      </div>
                    </MobileDrawer>
                  </div>
                  <div className="border-border-default flex justify-between border-t px-3 py-2 text-sm">
                    <span className="text-text-muted font-medium">Branch Head </span>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-4" />
                      <span className="text-text-default text-sm font-medium">{item.BranchHeadName}</span>
                    </div>
                  </div>
                  <div className="border-border-default border-t">
                    <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                      <span className="text-text-muted font-medium">Classes</span>
                      <div className="text-text-default font-medium">{item.numberOfClassArm}</div>
                    </div>
                  </div>

                  <div className="border-border-default border-t">
                    <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                      <span className="text-text-muted font-medium">Class Teachers Submitted</span>
                      <div className="text-text-default font-medium">{item.numberOfClassTeacherSubmitted}</div>
                    </div>
                  </div>

                  <div className="border-border-default border-t">
                    <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                      <span className="text-text-muted font-medium">Pending Approval</span>
                      <div className="text-text-default font-medium">{item.numberOfPendingApprovals}</div>
                    </div>
                  </div>
                </div>
              );
            })}

            {visibleCount < allBranchList.length && (
              <Button
                onClick={() => setVisibleCount(allBranchList.length)}
                className="bg-bg-state-soft! text-text-subtle! mx-auto my-2 flex w-39 items-center justify-center rounded-md"
              >
                Load More
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
