"use client";

import { DataTable } from "@/components/DataTable";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { PageEmptyState } from "@/components/Error/PageEmptyState";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApproveEditRequest, useApproveEditRequestBulk } from "@/hooks/queryHooks/useBranch";
import { useGetEditRequests } from "@/hooks/queryHooks/useRequests";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { createManageEditTableColumns } from "./Columns";
import { ManageEditMobileCard } from "./ManageEditMobileCard";
import { ManageEditModal } from "./ManageEditModal";
import { BranchEditRequestTypes } from "./types";

export const ManageEditRequest = () => {
  const params = useParams();
  const branchId = Number(params.branchId);

  useBreadcrumb([
    {
      label: "Classes and Subjects",
      url: "/classes-and-subjects",
    },
    {
      label: "Manage Edit Requests",
      url: "",
    },
  ]);

  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const [selectedRows, setSelectedRows] = useState<BranchEditRequestTypes[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [decisions, setDecisions] = useState<Record<number, "accepted" | "rejected" | null>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<BranchEditRequestTypes | null>(null);
  const [pendingAction, setPendingAction] = useState<"accepted" | "rejected" | null>(null);
  const [bulkAction, setBulkAction] = useState<"approve" | "reject" | null>(null);

  const { data: requestList, isPending, isError } = useGetEditRequests(branchId, searchQuery);
  const { mutate: approveSingle, isPending: isApprovingSingle } = useApproveEditRequest();
  const { mutate: approveBulk } = useApproveEditRequestBulk();

  const data = requestList?.data || [];

  const openModal = (editRequestId: number, action: "accepted" | "rejected") => {
    const staff = data.find((s: BranchEditRequestTypes) => s.editRequestId === editRequestId);
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
      toast.error("No teacher selected");
      return;
    }
    setBulkAction("approve");
    approveBulk(
      { editAccessIds, isApproved: true },
      {
        onSuccess: () => {
          setBulkAction(null);
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
          setBulkAction(null);
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
    setBulkAction("approve");
    approveBulk(
      { editAccessIds, isApproved: false },
      {
        onSuccess: () => {
          setBulkAction(null);
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
          setBulkAction(null);
          toast("Failed to reject requests");
          console.error(error);
        },
      },
    );
  };

  const handleMobileSelect = (editRequestId: number, selected: boolean) => {
    setRowSelection(prev => {
      const newSelection = { ...prev };
      if (selected) {
        const index = filteredData.findIndex((item: BranchEditRequestTypes) => item.editRequestId === editRequestId);
        if (index !== -1) {
          newSelection[index] = true;
        }
      } else {
        const index = filteredData.findIndex((item: BranchEditRequestTypes) => item.editRequestId === editRequestId);
        if (index !== -1) {
          delete newSelection[index];
        }
      }
      return newSelection;
    });
    if (selected) {
      const staff = filteredData.find((s: BranchEditRequestTypes) => s.editRequestId === editRequestId);
      if (staff && !selectedRows.find(r => r.editRequestId === editRequestId)) {
        setSelectedRows(prev => [...prev, staff]);
      }
    } else {
      setSelectedRows(prev => prev.filter(r => r.editRequestId !== editRequestId));
    }
  };

  const filteredData = data;

  const selectedCount = Object.keys(rowSelection).length;

  const columns = useMemo(() => createManageEditTableColumns(decisions, openModal), [decisions]);

  return (
    <div className="flex flex-col gap-4">
      <div className="text-text-default border-border-default border-b px-4 py-2 text-xl font-semibold md:px-8">Manage Edit Requests</div>

      <div className="flex flex-col gap-4 px-4 md:px-8">
        <SearchInput
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="bg-bg-input-soft h-8 w-full rounded-md border-none md:w-71"
        />

        {selectedCount > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-text-subtle bg-bg-state-soft flex h-7 items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium">
              {selectedCount} Selected
            </span>
            <div className="bg-border-default h-6 w-px" />
            <div className="flex items-center gap-1">
              <Button
                onClick={handleApproveAll}
                disabled={bulkAction !== null}
                size="sm"
                className="border-border-default text-text-default bg-bg-state-secondary hover:bg-bg-state-secondary-hover! flex h-7 items-center gap-1.5 rounded-md border shadow-xs disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="text-bg-basic-green-accent font-semibold">✓</span>
                <span>{bulkAction === "approve" ? "Approving..." : "Approve All"}</span>
              </Button>
              <Button
                onClick={handleRejectAll}
                disabled={bulkAction !== null}
                size="sm"
                className="border-border-default text-text-default bg-bg-state-secondary hover:bg-bg-state-secondary-hover! flex h-7 items-center gap-1.5 border disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="text-bg-basic-red-accent text-sm font-semibold">✕</span>
                <span>{bulkAction === "reject" ? "Rejecting..." : "Reject All"}</span>
              </Button>
            </div>
          </div>
        )}

        {isPending && <Skeleton className="bg-bg-input-soft h-100 w-full" />}
        {isError && (
          <div className="flex h-80 items-center justify-center">
            <ErrorComponent
              title="Could not get Requests"
              description="This is our problem, we are looking into it so as to serve you better"
              buttonText="Go to the Home page"
            />
          </div>
        )}
        {!isPending && !isError && filteredData.length === 0 && (
          <PageEmptyState
            title="All caught up!"
            buttonText="Go Back"
            description="You’ve reviewed every edit request. New requests will appear here when submitted."
          />
        )}
        <div>
          {!isPending && !isError && filteredData.length > 0 && (
            <>
              <div className="hidden md:block">
                <DataTable
                  columns={columns}
                  data={filteredData}
                  totalCount={filteredData?.length}
                  page={page}
                  setCurrentPage={setPage}
                  pageSize={10}
                  rowSelection={rowSelection}
                  setRowSelection={setRowSelection}
                  onSelectRows={setSelectedRows}
                  clickHandler={() => {}}
                  showPagination={false}
                />
              </div>

              <div className="flex flex-col gap-3 md:hidden">
                {filteredData.map((request: BranchEditRequestTypes, index: number) => (
                  <ManageEditMobileCard
                    key={request.editRequestId}
                    request={request}
                    decision={decisions[request.editRequestId] || null}
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
