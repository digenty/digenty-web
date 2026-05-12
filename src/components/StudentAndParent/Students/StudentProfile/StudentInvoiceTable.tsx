"use client";

import { Draft } from "@digenty/icons";
import { Term } from "@/api/types";
import { DataTable } from "@/components/DataTable";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetInvoicesByStudent } from "@/hooks/queryHooks/useInvoice";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { formatInvoiceStatus } from "@/components/Invoices/types";
import { Calendar, Check, CheckCheck, TriangleAlert, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { columns } from "./InvoiceColumns";
import { Invoice } from "./types";

export const getBadge = (status: string) => {
  switch (status) {
    case "Paid":
      return (
        <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default h-5 rounded-md text-xs font-medium">
          <Check className="size-3" /><span>Paid</span>
        </Badge>
      );
    case "Successful":
      return (
        <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default h-5 rounded-md text-xs font-medium">
          <Check className="size-3" /><span>Successful</span>
        </Badge>
      );
    case "Unpaid":
      return (
        <Badge className="bg-bg-badge-red text-bg-basic-red-strong border-border-default h-5 rounded-md text-xs font-medium">
          <X className="size-3" /><span>Unpaid</span>
        </Badge>
      );
    case "Outstanding":
      return (
        <Badge className="bg-bg-badge-orange text-bg-basic-orange-strong border-border-default h-5 rounded-md text-xs font-medium">
          <TriangleAlert className="size-3" /><span>Outstanding</span>
        </Badge>
      );
    case "Partially Paid":
      return (
        <Badge className="bg-bg-badge-orange text-bg-basic-orange-strong border-border-default h-5 rounded-md text-xs font-medium">
          <TriangleAlert className="size-3" /><span>Partially Paid</span>
        </Badge>
      );
    case "Fully Paid":
      return (
        <Badge className="bg-bg-badge-lime text-bg-basic-lime-strong border-border-default h-5 rounded-md text-xs font-medium">
          <CheckCheck className="size-3" /><span>Fully Paid</span>
        </Badge>
      );
    case "Draft":
      return (
        <Badge className="border-border-default bg-bg-badge-default text-text-subtle h-5 rounded-md text-xs font-medium">
          <Draft className="size-3" fill="var(--color-icon-default-muted)" /><span>Draft</span>
        </Badge>
      );
    case "Required":
      return (
        <Badge className="bg-bg-badge-fuchsia text-bg-basic-fuchsia-strong border-border-default h-5 rounded-md text-xs font-medium">
          <span>Required</span>
        </Badge>
      );
    case "Pending":
      return (
        <Badge className="bg-bg-badge-default text-text-subtle border-border-default h-5 rounded-md text-xs font-medium">
          <span>Pending</span>
        </Badge>
      );
    case "Failed":
      return (
        <Badge className="bg-bg-badge-red text-bg-basic-red-strong border-border-default h-5 rounded-md text-xs font-medium">
          <X className="size-3" /><span>Failed</span>
        </Badge>
      );
    default:
      return (
        <Badge className="bg-bg-badge-default text-text-subtle border-border-default h-5 rounded-md text-xs font-medium">
          <span>{status}</span>
        </Badge>
      );
  }
};

type Props = { studentId?: number };

export default function StudentInvoiceTable({ studentId }: Props) {
  const router = useRouter();
  const [termSelected, setTermSelected] = useState<Term | null>(null);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const pageSize = 10;

  const user = useLoggedInUser();
  const { data: terms, isPending: loadingTerms } = useGetTerms(user.schoolId);
  const { data: invoicesData, isPending: loadingInvoices } = useGetInvoicesByStudent(studentId, 0, 200);

  useEffect(() => {
    if (terms) {
      const activeTerm = terms.data?.terms?.find((t: Term) => t.isActiveTerm);
      setTermSelected(activeTerm ?? null);
      setActiveSession(terms.data?.academicSessionName ?? null);
    }
  }, [terms]);

  const allInvoices: Invoice[] = useMemo(() => {
    const raw = (invoicesData as { data?: { content?: Invoice[] } } | undefined)?.data?.content ?? [];
    return raw;
  }, [invoicesData]);

  const filteredInvoices = useMemo(() => {
    if (!termSelected) return allInvoices;
    return allInvoices.filter(inv => !inv.termId || inv.termId === termSelected.termId);
  }, [allInvoices, termSelected]);

  const paginatedInvoices = filteredInvoices.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4 md:space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-text-default text-lg font-semibold">Student Invoices</h2>

        <div className="hidden md:block">
          {!terms || loadingTerms ? (
            <Skeleton className="bg-bg-input-soft h-8 w-40" />
          ) : (
            <Select
              value={termSelected ? String(termSelected.termId) : ""}
              onValueChange={value => {
                const term = terms.data?.terms?.find((t: Term) => t.termId === Number(value));
                setTermSelected(term ?? null);
                setPage(1);
              }}
            >
              <SelectTrigger className="border-border-darker h-8! w-fit border focus-visible:ring-0">
                <Calendar className="text-icon-black-muted size-4" />
                <span className="text-text-default text-sm font-medium capitalize">
                  {activeSession} {termSelected?.term.toLowerCase()}
                </span>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                {terms.data?.terms?.map((term: Term) => (
                  <SelectItem key={term.termId} value={String(term.termId)} className="text-text-default text-sm font-medium capitalize">
                    {activeSession} {term.term.toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="md:hidden">
          <Button className="bg-bg-state-soft block size-7 rounded-md p-1.5" onClick={() => setIsFilterOpen(true)}>
            <Image src="/staff/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
          </Button>
          <MobileDrawer open={isFilterOpen} setIsOpen={setIsFilterOpen} title="Filter">
            <div className="flex w-full flex-col gap-2 px-4 py-4">
              {terms?.data?.terms?.map((term: Term) => (
                <Button
                  key={term.termId}
                  onClick={() => { setTermSelected(term); setIsFilterOpen(false); setPage(1); }}
                  className={`text-text-default justify-start text-sm font-medium capitalize ${termSelected?.termId === term.termId ? "bg-bg-state-ghost-hover" : ""}`}
                >
                  {activeSession} {term.term.toLowerCase()}
                </Button>
              ))}
            </div>
          </MobileDrawer>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        {loadingInvoices ? (
          <Skeleton className="bg-bg-input-soft h-60 w-full" />
        ) : (
          <DataTable
            columns={columns}
            data={paginatedInvoices}
            totalCount={filteredInvoices.length}
            page={page}
            setCurrentPage={setPage}
            pageSize={pageSize}
            showPagination={filteredInvoices.length > pageSize}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            onSelectRows={() => {}}
            clickHandler={row => router.push(`/staff/invoices/${row.original.invoiceId}`)}
          />
        )}
      </div>

      {/* Mobile view */}
      <div className="flex flex-col gap-4 md:hidden">
        {loadingInvoices ? (
          <Skeleton className="bg-bg-input-soft h-60 w-full" />
        ) : paginatedInvoices.length === 0 ? (
          <p className="text-text-muted py-8 text-center text-sm">No invoices found</p>
        ) : (
          paginatedInvoices.map(invoice => (
            <div
              key={invoice.id}
              className="border-border-default bg-bg-card cursor-pointer rounded-md border overflow-hidden"
              onClick={() => router.push(`/staff/invoices/${invoice.invoiceId}`)}
            >
              <div className="flex h-9.5 items-center justify-between px-3 py-1.5">
                <span className="text-text-default text-sm font-medium">{invoice.invoiceNumber}</span>
                {getBadge(formatInvoiceStatus(invoice.status))}
              </div>
              <div className="border-border-default border-t">
                <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                  <span className="text-text-muted font-medium">Issued Date</span>
                  <span className="text-text-default font-normal">
                    {invoice.issuedDate ? new Date(invoice.issuedDate).toLocaleDateString() : "—"}
                  </span>
                </div>
                <div className="flex justify-between px-3 py-2 text-sm">
                  <span className="text-text-muted font-medium">Amount</span>
                  <span className="text-text-default font-medium">₦{invoice.totalAmount?.toLocaleString() ?? "—"}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
