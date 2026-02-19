"use client";

import { DataTable } from "@/components/DataTable";
import { SearchInput } from "@/components/SearchInput";
import React, { useMemo, useState } from "react";
import { createManageEditTableColumns } from "./Columns";
import { Button } from "@/components/ui/button";
import { BranchEditRequestTypes } from "./types";
import { useParams } from "next/navigation";
import { ManageEditModal } from "./ManageEditModal";
import { ManageEditMobileCard } from "./ManageEditMobileCard";
import { toast } from "sonner";
import { useApproveEditRequest, useApproveEditRequestBulk, useGetEditRequest } from "@/hooks/queryHooks/useBranch";
import { Skeleton } from "@/components/ui/skeleton";
import { PageEmptyState } from "@/components/Error/PageEmptyState";

export const ManageEditRequest = () => {
  const params = useParams();
  const branchId = Number(params.branchId);

  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const [selectedRows, setSelectedRows] = useState<BranchEditRequestTypes[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [decisions, setDecisions] = useState<Record<number, "accepted" | "rejected" | null>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<BranchEditRequestTypes | null>(null);
  const [pendingAction, setPendingAction] = useState<"accepted" | "rejected" | null>(null);

  const { data: requestList, isFetching } = useGetEditRequest(branchId);
  const { mutate: approveSingle, isPending: isApprovingSingle } = useApproveEditRequest();
  const { mutate: approveBulk, isPending: isApprovingBulk } = useApproveEditRequestBulk();

  const pageSize = 15;

  // Mock data - remove this when using real API
  const mockData: BranchEditRequestTypes[] = [
    {
      editRequestId: 1,
      teacherName: "John Doe",
      classArmName: "JSS 1A",
      subjectName: "Mathematics",
      reason: "Need to update student scores for mid-term exam",
      dateCreated: "2024-02-19",
      isApproved: false,
    },
    {
      editRequestId: 2,
      teacherName: "Jane Smith",
      classArmName: "SSS 2B",
      subjectName: "English Language",
      reason: "Correction of wrongly entered grades",
      dateCreated: "2024-02-18",
      isApproved: false,
    },
    {
      editRequestId: 3,
      teacherName: "Michael Eze",
      classArmName: "JSS 3C",
      subjectName: "Biology",
      reason: "Student was absent during initial entry",
      dateCreated: "2024-02-17",
      isApproved: true,
    },
  ];

  const data = requestList;

  const openModal = (editRequestId: number, action: "accepted" | "rejected") => {
    const staff = data.find(s => s.editRequestId === editRequestId);
    setSelectedStaff(staff || null);
    setPendingAction(action);
    setModalOpen(true);
  };

  const handleConfirm = (action: "accepted" | "rejected") => {
    if (!selectedStaff) return;

    const isApproved = action === "accepted";

    approveSingle(
      { editAccessId: selectedStaff.editRequestId, isApproved },
      {
        onSuccess: () => {
          setDecisions(prev => ({
            ...prev,
            [selectedStaff.editRequestId]: action,
          }));
          toast.success(`Request ${isApproved ? "approved" : "rejected"} successfully`);
          closeModal();
        },
        onError: error => {
          toast.error(`Failed to ${isApproved ? "approve" : "reject"} request`);
          console.error(error);
        },
      },
    );
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedStaff(null);
    setPendingAction(null);
  };

  const handleApproveAll = () => {
    const editAccessIds = selectedRows.map(row => row.editRequestId);

    if (editAccessIds.length === 0) {
      toast.error("No items selected");
      return;
    }

    approveBulk(
      { editAccessIds, isApproved: true },
      {
        onSuccess: () => {
          const newDecisions = { ...decisions };
          selectedRows.forEach(row => {
            newDecisions[row.editRequestId] = "accepted";
          });
          setDecisions(newDecisions);
          setRowSelection({});
          setSelectedRows([]);
          toast.success(`${editAccessIds.length} request(s) approved successfully`);
        },
        onError: error => {
          toast.error("Failed to approve requests");
          console.error(error);
        },
      },
    );
  };

  const handleRejectAll = () => {
    const editAccessIds = selectedRows.map(row => row.editRequestId);

    if (editAccessIds.length === 0) {
      toast.error("No items selected");
      return;
    }

    approveBulk(
      { editAccessIds, isApproved: false },
      {
        onSuccess: () => {
          const newDecisions = { ...decisions };
          selectedRows.forEach(row => {
            newDecisions[row.editRequestId] = "rejected";
          });
          setDecisions(newDecisions);
          setRowSelection({});
          setSelectedRows([]);
          toast.success(`${editAccessIds.length} request(s) rejected successfully`);
        },
        onError: error => {
          toast.error("Failed to reject requests");
          console.error(error);
        },
      },
    );
  };

  const handleMobileSelect = (editRequestId: number, selected: boolean) => {
    setRowSelection(prev => {
      const newSelection = { ...prev };
      if (selected) {
        const index = filteredData.findIndex(item => item.editRequestId === editRequestId);
        if (index !== -1) {
          newSelection[index] = true;
        }
      } else {
        const index = filteredData.findIndex(item => item.editRequestId === editRequestId);
        if (index !== -1) {
          delete newSelection[index];
        }
      }
      return newSelection;
    });
    if (selected) {
      const staff = filteredData.find(s => s.editRequestId === editRequestId);
      if (staff && !selectedRows.find(r => r.editRequestId === editRequestId)) {
        setSelectedRows(prev => [...prev, staff]);
      }
    } else {
      setSelectedRows(prev => prev.filter(r => r.editRequestId !== editRequestId));
    }
  };

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase();
    return data.filter(
      (item: BranchEditRequestTypes) =>
        item.teacherName.toLowerCase().includes(query) || (typeof item.classArmName === "string" && item.classArmName.toLowerCase().includes(query)),
    );
  }, [data, searchQuery]);

  const selectedCount = Object.keys(rowSelection).length;

  const columns = useMemo(() => createManageEditTableColumns(decisions, openModal), [decisions]);

  return (
    <div className="flex flex-col gap-4">
      <div className="text-text-default border-border-default border-b p-4 text-xl font-semibold md:px-8">Manage Edit Requests</div>

      <div className="flex flex-col gap-4 px-4 md:px-8">
        <SearchInput
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="bg-bg-input-soft w-full rounded-md border-none md:w-71"
        />

        {selectedCount > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-text-subtle bg-bg-state-soft flex h-7 items-center gap-1 rounded-md p-1.5 text-sm font-medium">
              {selectedCount} Selected {selectedCount === 1 ? "Item" : "Items"}
            </span>
            <Button
              onClick={handleApproveAll}
              disabled={isApprovingBulk}
              size="sm"
              className="border-border-default text-text-default bg-bg-state-secondary hover:bg-bg-state-secondary-hover! flex h-7 items-center gap-1.5 rounded-md border shadow-xs disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="text-bg-basic-green-accent font-semibold">✓</span>
              <span>{isApprovingBulk ? "Approving..." : "Approve All"}</span>
            </Button>
            <Button
              onClick={handleRejectAll}
              disabled={isApprovingBulk}
              size="sm"
              className="border-border-default text-text-default bg-bg-state-secondary hover:bg-bg-state-secondary-hover! flex h-7 items-center gap-1.5 border disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="text-bg-basic-red-accent text-sm font-semibold">✕</span>
              <span>{isApprovingBulk ? "Rejecting..." : "Reject All"}</span>
            </Button>
          </div>
        )}

        <div>
          {isFetching ? (
            <Skeleton className="bg-bg-input-soft h-100 w-full" />
          ) : filteredData === 0 ? (
            <PageEmptyState
              title="All caught up!"
              buttonText="Go Back"
              description="You’ve reviewed every edit request. New requests will appear here when submitted."
            />
          ) : (
            <>
              <div className="hidden md:block">
                <DataTable
                  columns={columns}
                  data={filteredData || []}
                  totalCount={filteredData?.length}
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

              <div className="flex flex-col gap-3 p-4 md:hidden">
                {filteredData.map((staff: BranchEditRequestTypes, index) => (
                  <ManageEditMobileCard
                    key={staff.editRequestId}
                    staff={staff}
                    decision={decisions[staff.editRequestId] || null}
                    onDecision={openModal}
                    isSelected={!!rowSelection[index]}
                    onSelect={handleMobileSelect}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <ManageEditModal
        open={modalOpen}
        closeModal={closeModal}
        selectedStaff={selectedStaff}
        pendingAction={pendingAction}
        handleConfirm={handleConfirm}
        isSubmitting={isApprovingSingle}
      />
    </div>
  );
};
