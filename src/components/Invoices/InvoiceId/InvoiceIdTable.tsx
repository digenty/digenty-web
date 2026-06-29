"use client";

import { DeleteBin, Edit } from "@digenty/icons";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { breakdownColumns, getPaymentMethodIcon, paymentHistoryColumns } from "./InvoiceIdColumns";
import { invoiceBreakdownType, paymentHistoryType } from "./invoiceIdTypes";
import { Skeleton } from "@/components/ui/skeleton";
import { getBadge } from "@/components/StudentAndParent/Students/StudentProfile/StudentInvoiceTable";
import { EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Button } from "@/components/ui/button";
import { useClassesStore } from "@/store/classes";
import { useGetPaymentHistory } from "@/hooks/queryHooks/useInvoice";
import { DeletePaymentModal, PaymentDetailsModal } from "./InvoiceIdModals";

type BreakdownTableProps = {
  items: invoiceBreakdownType[];
  loading: boolean;
};

export const InvoiceIdBreakDownTable = ({ items, loading }: BreakdownTableProps) => {
  const [rowSelection, setRowSelection] = useState({});
  const [page, setPage] = useState(1);
  const pageSize = 10;

  return (
    <div className="w-full lg:w-3/4">
      {/* Desktop */}
      <div className="border-border-default hidden h-full w-full border p-6 md:block">
        <div className="text-text-default text-md mb-6 font-semibold">Invoice Breakdown</div>

        {loading ? (
          <Skeleton className="bg-bg-input-soft h-48 w-full" />
        ) : (
          <DataTable
            columns={breakdownColumns}
            data={items}
            totalCount={items.length}
            page={page}
            setCurrentPage={setPage}
            pageSize={pageSize}
            showPagination={false}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            onSelectRows={() => {}}
            clickHandler={() => {}}
          />
        )}
      </div>

      {/* Mobile */}
      <div className="block md:hidden">
        <div className="text-text-default text-md mb-4 font-semibold">Invoice Breakdown</div>

        {loading ? (
          <Skeleton className="bg-bg-input-soft h-48 w-full" />
        ) : (
          <div className="flex flex-col gap-4">
            {items.map(item => (
              <div key={item.id} className="border-border-default bg-bg-subtle flex flex-col rounded-sm border">
                <div className="border-border-default border-b">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="text-text-muted text-sm font-medium">Fee Name</div>
                    <div className="text-text-default text-sm font-medium">{item.name}</div>
                  </div>
                </div>

                <div className="border-border-default border-b">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="text-text-muted text-sm font-medium">Quantity</div>
                    <div className="text-text-default text-sm font-medium">{item.quantity}</div>
                  </div>
                </div>

                <div className="border-border-default border-b">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="text-text-muted text-sm font-medium">Price</div>
                    <div className="text-text-default text-sm font-medium">₦{item.price.toLocaleString()}</div>
                  </div>
                </div>

                <div className="border-border-default border-b">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="text-text-muted text-sm font-medium">Total</div>
                    <div className="text-text-default text-sm font-medium">₦{item.total.toLocaleString()}</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="text-text-muted text-sm font-medium">Type</div>
                    <div className="text-text-default text-sm font-medium">{getBadge(item.required ? "Required" : "Optional")}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const InvoiceIdPaymentHistoryTable = ({ invoiceId }: { invoiceId?: string }) => {
  const [rowSelection, setRowSelection] = useState({});
  const [openActions, setOpenActions] = useState(false);
  const [page, setPage] = useState(1);
  const { deletePayment, setDeletePayment, isPaymentDetailsOpen, setIsPaymentDetailsOpen } = useClassesStore();
  const pageSize = 10;

  const { data: historyData, isPending: loadingHistory } = useGetPaymentHistory(invoiceId, page - 1, pageSize);

  const paymentHistoryData: paymentHistoryType[] = (historyData?.content ?? []).map(entry => ({
    id: entry.id,
    date: entry.date ? new Date(entry.date).toLocaleDateString() : "",
    amount: entry.amount,
    method: entry.method,
    paidBy: entry.paidBy?.name ?? "",
    status: entry.status === "SUCCESSFUL" ? "Successful" : entry.status === "PENDING" ? "Pending" : "Failed",
    addedBy: entry.addedBy ?? "",
    note: entry.note,
  }));

  return (
    <div>
      {/* Desktop */}
      <div className="md:border-border-default hidden md:block md:rounded-sm md:border md:p-6">
        <div className="text-text-default text-md mb-6 font-semibold">Payment History</div>

        <DataTable
          columns={paymentHistoryColumns}
          data={paymentHistoryData}
          loadingContent={loadingHistory && paymentHistoryData.length === 0}
          totalCount={historyData?.totalElements ?? paymentHistoryData.length}
          page={page}
          setCurrentPage={setPage}
          pageSize={pageSize}
          showPagination={false}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          onSelectRows={() => {}}
          clickHandler={() => {}}
        />
      </div>

      {/* Mobile */}
      <div className="block md:hidden">
        {isPaymentDetailsOpen && <PaymentDetailsModal />}
        {deletePayment && <DeletePaymentModal />}

        {openActions && (
          <MobileDrawer open={openActions} setIsOpen={setOpenActions} title="Actions">
            <div className="flex flex-col justify-center gap-2 p-3">
              <div
                className="border-border-darker bg-bg-state-secondary flex items-center justify-center gap-1 rounded-md border px-2.5 py-1.5"
                onClick={() => setIsPaymentDetailsOpen(true)}
              >
                <EyeIcon className="text-icon-default-muted size-4" />
                <span className="text-text-default text-sm">View payment</span>
              </div>
              <div className="border-border-darker bg-bg-state-secondary flex items-center justify-center gap-1 rounded-md border px-2.5 py-1.5">
                <Edit fill="var(--color-icon-default-muted)" className="size-4" />
                <span className="text-text-default text-sm">Edit payment</span>
              </div>
              <div
                className="border-border-darker bg-bg-state-secondary flex items-center justify-center gap-1 rounded-md border px-2.5 py-1.5"
                onClick={() => setDeletePayment(true)}
              >
                <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
                <span className="text-icon-destructive text-sm">Delete payment</span>
              </div>
            </div>
          </MobileDrawer>
        )}

        <div>
          <div className="text-text-default text-md mb-4 font-semibold">Payment History</div>

          <div className="flex flex-col gap-4">
            {paymentHistoryData.map(history => (
              <div key={history.id} className="border-border-default bg-bg-subtle flex flex-col rounded-sm border">
                <div className="border-border-default border-b">
                  <div className="flex items-center justify-between px-3">
                    <div className="text-text-default text-sm font-medium">{history.date}</div>
                    <Button onClick={() => setOpenActions(true)}>
                      <MoreHorizontalIcon className="text-icon-default" />
                    </Button>
                  </div>
                </div>

                <div className="border-border-default border-b">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="text-text-muted text-sm font-medium">Amount</div>
                    <div className="text-text-default text-sm font-medium">₦{history.amount.toLocaleString()}</div>
                  </div>
                </div>

                <div className="border-border-default border-b">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="text-text-muted text-sm font-medium">Payment Method</div>
                    <div className="text-text-default flex items-center gap-1 truncate text-sm font-medium">
                      {getPaymentMethodIcon(history.method)} {history.method}
                    </div>
                  </div>
                </div>

                <div className="border-border-default border-b">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="text-text-muted text-sm font-medium">Paid By</div>
                    <div className="text-text-default flex items-center gap-1 text-sm font-medium">
                      <Avatar className="size-5" /> {history.paidBy}
                    </div>
                  </div>
                </div>

                <div className="border-border-default border-b">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="text-text-muted text-sm font-medium">Status</div>
                    <div className="text-text-default text-sm font-medium">{getBadge(history.status)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between px-3 py-2">
                  <div className="text-text-muted text-sm font-medium">Added By</div>
                  <div className="text-text-default flex items-center gap-1 text-sm font-medium">
                    {history.addedBy === "System" ? (
                      <>{history.addedBy}</>
                    ) : (
                      <>
                        <Avatar className="size-5" /> {history.paidBy}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
