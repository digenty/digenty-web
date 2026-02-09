"use client";

import React, { useState } from "react";
import { InvoicesOverviewTableProps } from "./types";
import { DataTable } from "../DataTable";
import { InvoiceOverviewTableColumns } from "./Column";
import { getBadge } from "../StudentAndParent/Students/StudentProfile/StudentInvoiceTable";
import { Ellipsis, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import Eye from "../Icons/Eye";
import Printer from "../Icons/Printer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Avatar } from "../Avatar";
import { MobileDrawer } from "../MobileDrawer";

import { DrawerClose, DrawerFooter } from "../ui/drawer";
import { BallPen } from "../Icons/BallPen";
import Notification2 from "../Icons/Notification2";
import { useRouter } from "next/navigation";

const InvoicesItems = [
  {
    id: "INV-2025-3321",
    studentName: "Damilare John",
    amount: 50000,
    status: "Paid",
    lastActivity: "14/05/2002",
  },
  {
    id: "INV-2025-3322",
    studentName: "Damilare John",
    amount: 50000,
    status: "Paid",
    lastActivity: "14/05/2002",
  },
  {
    id: "INV-2025-3323",
    studentName: "Damilare John",
    amount: 50000,
    status: "Draft",
    lastActivity: "14/05/2002",
  },
  {
    id: "INV-2025-3324",
    studentName: "Damilare John",
    amount: 50000,
    status: "Outstanding",
    lastActivity: "14/05/2002",
  },
  {
    id: "INV-2025-3325",
    studentName: "Damilare John",
    amount: 50000,
    status: "Fully Paid",
    lastActivity: "14/05/2002",
  },
  {
    id: "INV-2025-3326",
    studentName: "Damilare John",
    amount: 50000,
    status: "Unpaid",
    lastActivity: "14/05/2002",
  },
  {
    id: "INV-2025-3327",
    studentName: "Damilare John",
    amount: 50000,
    status: "Unpaid",
    lastActivity: "14/05/2002",
  },
  {
    id: "INV-2025-3328",
    studentName: "Damilare John",
    amount: 50000,
    status: "Paid",
    lastActivity: "14/05/2002",
  },
  {
    id: "INV-2025-3329",
    studentName: "Damilare John",
    amount: 50000,
    status: "Draft",
    lastActivity: "14/05/2002",
  },
  {
    id: "INV-2025-3330",
    studentName: "Damilare John",
    amount: 50000,
    status: "Outstanding",
    lastActivity: "14/05/2002",
  },
  {
    id: "INV-2025-3331",
    studentName: "Damilare John",
    amount: 50000,
    status: "Fully Paid",
    lastActivity: "14/05/2002",
  },
  {
    id: "INV-2025-3332",
    studentName: "Damilare John",
    amount: 50000,
    status: "Unpaid",
    lastActivity: "14/05/2002",
  },
];

export const InvoiceOverviewTable = () => {
  const isMobile = useIsMobile();
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedRows, setSelectedRows] = useState<InvoicesOverviewTableProps[]>([]);
  const pageSize = 50;
  const router = useRouter();

  return (
    <div>
      <div className="hidden md:block">
        <DataTable
          columns={InvoiceOverviewTableColumns}
          data={InvoicesItems}
          totalCount={InvoicesItems.length}
          page={page}
          setCurrentPage={setPage}
          pageSize={pageSize}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          onSelectRows={setSelectedRows}
          clickHandler={() => {}}
          showPagination={true}
        />
      </div>

      <div className="flex flex-col gap-4 md:hidden">
        {InvoicesItems.slice(0, visibleCount).map(invoice => {
          return (
            <div key={invoice.id} className="border-border-default bg-bg-subtle rounded-md border">
              <div className="flex h-[38px] items-center justify-between px-3 py-1.5">
                <span className="text-text-default text-sm font-medium">{invoice.id}</span>
                <Button onClick={() => setIsOpen(true)} className="text-text-muted cursor-pointer p-0! focus-visible:ring-0!">
                  <Ellipsis className="size-5" />
                </Button>
                <MobileDrawer open={isOpen} setIsOpen={setIsOpen} title="Actions">
                  <div className="flex w-full flex-col gap-4 px-3 py-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm">
                        <Eye className="size-4" fill="var(--color-icon-default-subtle)" /> View Invoice
                      </div>
                      <div
                        role="button"
                        onClick={() => router.push("/invoices/edit-invoice")}
                        className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
                      >
                        <Printer fill="var(--color-icon-default-subtle)" className="size-4" /> Edit Invoice
                      </div>

                      <div className="ext-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm">
                        <BallPen fill="var(--color-icon-default-subtle)" className="size-4" />
                        <span>Record payment</span>
                      </div>
                      <div className="ext-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm">
                        <Notification2 fill="var(--color-icon-default-subtle)" className="size-4" />
                        <span>Send reminder</span>
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
                  <span className="text-text-muted font-medium">Student Name</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-5" url="" />
                    <span className="text-text-default text-sm font-medium">{invoice.studentName}</span>
                  </div>{" "}
                </div>
              </div>

              <div className="">
                <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                  <span className="text-text-muted font-medium">Amount</span>
                  <span className="text-text-default text-sm font-medium">{invoice.amount}</span>
                </div>
              </div>

              <div className="flex justify-between px-3 py-2 text-sm">
                <span className="text-text-muted font-medium">Status</span>
                {getBadge(invoice.status)}
              </div>
            </div>
          );
        })}

        {visibleCount < InvoicesItems.length && (
          <Button
            onClick={() => setVisibleCount(InvoicesItems.length)}
            className="bg-bg-state-soft text-text-subtle mx-auto my-2 flex w-39 items-center justify-center rounded-md"
          >
            Load More
          </Button>
        )}
      </div>
    </div>
  );
};
