"use client";

import { useState } from "react";
import { DataTable } from "../DataTable";
import { breakdownColumns, getPaymentMethodIcon, paymentHistoryColumns } from "./InvoiceIdColumns";
import { invoiceBreakdownType } from "./invoiceIdTypes";
import { getBadge } from "../StudentProfile/StudentTable/StudentInvoiceTable";
import { EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { Avatar } from "../Avatar";
import { useIsMobile } from "@/hooks/useIsMobile";
import { MobileDrawer } from "../MobileDrawer";
import DeleteBin from "../Icons/DeleteBin";
import Edit from "../Icons/Edit";
import { Button } from "../ui/button";
import { useClassesStore } from "@/store/classes";
import { DeletePaymentModal, PaymentDetailsModal } from "./InvoiceIdModals";

const baseData: invoiceBreakdownType[] = [
  {
    name: "Item name",
    quantity: 1,
    price: 50000,
    total: 10000,
    status: "Required",
  },
];

const breakdownData = Array.from({ length: 5 }, (_, i) =>
  baseData.map((item, idx) => ({
    ...item,
    id: i * baseData.length + idx,
  })),
).flat();

const paymentHistoryData = [
  {
    id: 1,
    date: "June 25 2005",
    amount: 50000,
    method: "Bank Transfer Terminal",
    paidBy: "Damilare John",
    status: "Successful",
    addedBy: "System",
  },
  {
    id: 2,
    date: "June 25 2005",
    amount: 50000,
    method: "Cash",
    paidBy: "Damilare John",
    status: "Successful",
    addedBy: "",
  },
  {
    id: 3,
    date: "June 25 2005",
    amount: 50000,
    method: "Other Bank Transfer",
    paidBy: "Damilare John",
    status: "Successful",
    addedBy: "System",
  },
  {
    id: 4,
    date: "June 25 2005",
    amount: 50000,
    method: "POS",
    paidBy: "Damilare John",
    status: "Successful",
    addedBy: "System",
  },
];

export const InvoiceIdBreakDownTable = () => {
  const isMobile = useIsMobile();
  const [rowSelection, setRowSelection] = useState({});
  const [page, setPage] = useState(1);
  const pageSize = 10;

  return (
    <div className="w-full lg:w-3/4">
      <div className="border-border-default hidden h-full w-full border p-6 md:block">
        <div className="text-text-default text-md mb-6 font-semibold">Invoice Breakdown</div>

        <DataTable
          columns={breakdownColumns}
          data={breakdownData}
          totalCount={breakdownData.length}
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

      <div className="block md:hidden">
        <div className="text-text-default text-md mb-4 font-semibold">Invoice Breakdown</div>

        <div className="flex flex-col gap-4">
          {breakdownData.map(breakdown => (
            <div key={breakdown.id} className="border-border-default bg-bg-subtle flex flex-col rounded-sm border">
              <div className="border-border-default border-b">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="text-text-muted text-sm font-medium">Fee Name</div>

                  <div className="text-text-default text-sm font-medium">{breakdown.name}</div>
                </div>
              </div>

              <div className="border-border-default border-b">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="text-text-muted text-sm font-medium">Quality</div>
                  <div className="text-text-default text-sm font-medium">{breakdown.quantity}</div>
                </div>
              </div>

              <div className="border-border-default border-b">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="text-text-muted text-sm font-medium">Price</div>
                  <div className="text-text-default text-sm font-medium">₦{breakdown.price}</div>
                </div>
              </div>

              <div className="border-border-default border-b">
                {" "}
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="text-text-muted text-sm font-medium">Total</div>
                  <div className="text-text-default text-sm font-medium">₦{breakdown.total}</div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="text-text-muted text-sm font-medium">status</div>
                  <div className="text-text-default text-sm font-medium">{getBadge(breakdown.status)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const InvoiceIdPaymentHistoryTable = () => {
  const [rowSelection, setRowSelection] = useState({});
  const [openActions, setOpenActions] = useState(false);
  const [page, setPage] = useState(1);
  const { deletePayment, setDeletePayment, isPaymentDetailsOpen, setIsPaymentDetailsOpen } = useClassesStore();
  const isMobile = useIsMobile();
  const pageSize = 10;

  return (
    <div>
      <div className="md:border-border-default hidden md:block md:rounded-sm md:border md:p-6">
        <div className="text-text-default text-md mb-6 font-semibold">Payment History</div>

        <DataTable
          columns={paymentHistoryColumns}
          data={paymentHistoryData}
          totalCount={paymentHistoryData.length}
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

      <div className="block md:hidden">
        {isPaymentDetailsOpen && <PaymentDetailsModal />}
        {deletePayment && <DeletePaymentModal />}
        {/* Modal for actions */}
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
                      {" "}
                      <MoreHorizontalIcon className="text-icon-default" />
                    </Button>
                  </div>
                </div>

                <div className="border-border-default border-b">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="text-text-muted text-sm font-medium">Amount</div>
                    <div className="text-text-default text-sm font-medium">₦{history.amount}</div>
                  </div>
                </div>

                <div className="border-border-default border-b">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="text-text-muted text-sm font-medium">Payment Method</div>
                    <div className="text-text-default flex items-center gap-1 truncate text-sm font-medium">
                      <div>{getPaymentMethodIcon(history.method)}</div> <div>{history.method}</div>
                    </div>
                  </div>
                </div>

                <div className="border-border-default border-b">
                  {" "}
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="text-text-muted text-sm font-medium">Paid By</div>
                    <div className="text-text-default flex items-center gap-1 text-sm font-medium">
                      {" "}
                      <Avatar username={history.paidBy} className="size-5" /> {history.paidBy}
                    </div>
                  </div>
                </div>

                <div className="border-border-default border-b">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="text-text-muted text-sm font-medium">status</div>
                    <div className="text-text-default text-sm font-medium">{getBadge(history.status)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between px-3 py-2">
                  <div className="text-text-muted text-sm font-medium">Added By</div>
                  <div className="text-text-default flex items-center gap-1 text-sm font-medium">
                    {history.addedBy === "System" ? (
                      <>{history.addedBy} </>
                    ) : (
                      <>
                        {" "}
                        <Avatar username={history.paidBy} className="size-5" /> {history.paidBy}
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
