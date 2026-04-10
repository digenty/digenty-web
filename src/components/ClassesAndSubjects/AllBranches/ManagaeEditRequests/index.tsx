"use client";

import { EditRequestResponseTypes } from "@/api/types";
import { DataTable } from "@/components/DataTable";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useApproveEditRequest, useApproveEditRequestBulk, useGetEditRequests } from "@/hooks/queryHooks/useRequests";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { createManageEditTableColumns } from "./Columns";
import { ManageEditMobileCard } from "./ManageEditMobileCard";
import { ManageEditModal } from "./ManageEditModal";
import { toast } from "@/components/Toast";

export const ManageEditRequest = () => {
  const params = useParams();
  const branchId = Number(params.branchId);

  useBreadcrumb([
    {
      label: "Classes and Subjects",
      url: "/staff/classes-and-subjects",
    },
    {
      label: "All Classes",
      url: `/staff/classes-and-subjects/all-classes`,
    },
    {
      label: "Manage Edit Requests",
      url: "",
    },
  ]);

  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const [selectedRows, setSelectedRows] = useState<EditRequestResponseTypes[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [requestStatus, setRequestStatus] = useState<Record<number, "accepted" | "rejected" | null>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<EditRequestResponseTypes | null>(null);
  const [pendingAction, setPendingAction] = useState<"accepted" | "rejected" | null>(null);
  const [bulkAction, setBulkAction] = useState<"approve" | "reject" | null>(null);

  const { data: requestList, isPending, isError } = useGetEditRequests(branchId, searchQuery);
  const { mutate: approveSingle, isPending: isApprovingSingle } = useApproveEditRequest();
  const { mutate: approveBulk, isPending: isApprovingBulk } = useApproveEditRequestBulk();

  const data = requestList?.data || [];

  const openModal = (request: EditRequestResponseTypes, action: "accepted" | "rejected") => {
    setSelectedRequest(request);
    setPendingAction(action);
    setModalOpen(true);
  };

  const handleConfirm = (action: "accepted" | "rejected") => {
    if (!selectedRequest) return;

    const isApproved = action === "accepted";

    approveSingle(
      { editAccessId: selectedRequest.editRequestId, isApproved },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: `Request ${isApproved ? "approved" : "rejected"} successfully`,
            type: "success",
          });
          closeModal();
        },
        onError: error => {
          toast({
            title: "Error",
            description: error?.message || `Failed to ${isApproved ? "approve" : "reject"} request`,
            type: "error",
          });
        },
      },
    );
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRequest(null);
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
        const index = filteredData.findIndex((item: EditRequestResponseTypes) => item.editRequestId === editRequestId);
        if (index !== -1) {
          newSelection[index] = true;
        }
      } else {
        const index = filteredData.findIndex((item: EditRequestResponseTypes) => item.editRequestId === editRequestId);
        if (index !== -1) {
          delete newSelection[index];
        }
      }
      return newSelection;
    });
    if (selected) {
      const staff = filteredData.find((s: EditRequestResponseTypes) => s.editRequestId === editRequestId);
      if (staff && !selectedRows.find(r => r.editRequestId === editRequestId)) {
        setSelectedRows(prev => [...prev, staff]);
      }
    } else {
      setSelectedRows(prev => prev.filter(r => r.editRequestId !== editRequestId));
    }
  };

  const filteredData = data;

  const selectedCount = Object.keys(rowSelection).length;

  const columns = useMemo(() => createManageEditTableColumns(requestStatus, openModal), [requestStatus]);

  return (
    <div className="flex flex-col gap-4">
      <div className="text-text-default border-border-default border-b px-4 py-2 text-xl font-semibold md:px-8">Manage Edit Requests</div>

      <div className="flex flex-col gap-4 px-4 md:px-8">
        <SearchInput
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="bg-bg-input-soft w-full rounded-md border-none md:w-71"
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
                {isApprovingBulk ? <Spinner className="" /> : <span className="text-bg-basic-green-accent font-semibold">✓</span>}
                <span>Approve All</span>
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
          <div className="flex items-center justify-center pt-15">
            <ErrorComponent title="All caught up!" description="You’ve reviewed every edit request. New requests will appear here when submitted." />
          </div>
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
                  pageSize={100}
                  rowSelection={rowSelection}
                  setRowSelection={setRowSelection}
                  onSelectRows={setSelectedRows}
                  clickHandler={() => {}}
                  showPagination={false}
                />
              </div>

              <div className="flex flex-col gap-3 md:hidden">
                {filteredData.map((request: EditRequestResponseTypes, index: number) => (
                  <ManageEditMobileCard
                    key={request.editRequestId}
                    request={request}
                    openModal={openModal}
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
        selectedRequest={selectedRequest}
        pendingAction={pendingAction}
        handleConfirm={handleConfirm}
        isSubmitting={isApprovingSingle}
      />
    </div>
  );
};
