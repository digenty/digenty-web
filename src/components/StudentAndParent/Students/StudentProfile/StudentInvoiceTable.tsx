import { Draft } from "@digenty/icons";
import { StudentInvoicesPage } from "@/api/invoice";
import { Term } from "@/api/types";
import { DataTable } from "@/components/DataTable";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { formatInvoiceStatus, formatNaira } from "@/components/Invoices/types";

import { MobileDrawer } from "@/components/MobileDrawer";
import { toast } from "@/components/Toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetInvoicesByStudent } from "@/hooks/queryHooks/useInvoice";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { Calendar, Check, TriangleAlert, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { columns } from "./InvoiceColumns";

export const getBadge = (status: string) => {
  switch (status) {
    case "Paid":
    case "PAID":
      return (
        <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default h-5 rounded-md text-xs font-medium">
          <Check className="size-3" />
          <span>Paid</span>
        </Badge>
      );
    case "Successful":
    case "SUCCESSFUL":
      return (
        <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default h-5 rounded-md text-xs font-medium">
          <Check className="size-3" />
          <span>Successful</span>
        </Badge>
      );
    case "Unpaid":
    case "UNPAID":
      return (
        <Badge className="bg-bg-badge-red text-bg-basic-red-strong border-border-default h-5 rounded-md text-xs font-medium">
          <X className="size-3" />
          <span>Unpaid</span>
        </Badge>
      );
    case "Pending":
    case "PENDING":
      return (
        <Badge className="bg-bg-badge-orange text-bg-basic-orange-strong border-border-default h-5 rounded-md text-xs font-medium">
          <TriangleAlert className="size-3" />
          <span>Pending</span>
        </Badge>
      );
    case "Failed":
    case "FAILED":
      return (
        <Badge className="bg-bg-badge-red text-bg-basic-red-strong border-border-default h-5 rounded-md text-xs font-medium">
          <X className="size-3" />
          <span>Failed</span>
        </Badge>
      );
    case "Partially Paid":
    case "PARTIALLY_PAID":
      return (
        <Badge className="bg-bg-badge-yellow text-bg-basic-yellow-strong border-border-default h-5 rounded-md text-xs font-medium">
          <TriangleAlert className="size-3" />
          <span>Partially Paid</span>
        </Badge>
      );
    case "Draft":
    case "DRAFT":
      return (
        <Badge className="border-border-default bg-bg-badge-default text-text-subtle h-5 rounded-md text-xs font-medium">
          <Draft className="size-3" fill="var(--color-icon-default-muted)" />
          <span>Draft</span>
        </Badge>
      );
    case "Required":
      return (
        <Badge className="bg-bg-badge-fuchsia text-bg-basic-fuchsia-strong border-border-default h-5 rounded-md text-xs font-medium">
          <span>Required</span>
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

export default function StudentInvoiceTable({ studentId }: { studentId?: number }) {
  const router = useRouter();
  const [termSelected, setTermSelected] = useState<Term | null>(null);
  const [page, setPage] = useState(1);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const pageSize = 10;
  const user = useLoggedInUser();

  const { data: terms, isPending: loadingTerms } = useGetTerms(user.schoolId);

  useEffect(() => {
    if (terms) {
      const activeTerm = terms.data.terms.find((term: Term) => term.isActiveTerm);
      setTermSelected(activeTerm);
      setActiveSession(terms.data.academicSessionName);
    }
  }, [setActiveSession, setTermSelected, terms]);

  const {
    data: invoicesRaw,
    isFetching: loadingInvoices,
    isError: invoicesError,
    error: invoicesErrorObj,
    refetch: refetchInvoices,
  } = useGetInvoicesByStudent(studentId, page - 1, pageSize);

  const invoicesErrorMessage =
    (invoicesErrorObj as { message?: string } | null)?.message ?? "We couldn't load this student's invoices. Please try again.";

  useEffect(() => {
    if (invoicesError) {
      toast({ title: invoicesErrorMessage, type: "error" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoicesError]);

  const invoicesData = (invoicesRaw as { data: StudentInvoicesPage } | undefined)?.data;
  const invoices = invoicesData?.content ?? [];
  const totalCount = invoicesData?.totalElements ?? 0;

  return (
    <div className="space-y-4 md:space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-text-default text-lg font-semibold">Student Invoices</h2>

        <div className="hidden md:block">
          {!terms || loadingTerms ? (
            <Skeleton className="bg-bg-input-soft h-9 w-full" />
          ) : (
            <Select
              onValueChange={value => {
                const term = terms.data.terms?.find((term: Term) => term.termId === Number(value));
                setTermSelected(term);
              }}
            >
              <SelectTrigger className="border-border-darker h-8! w-fit border focus-visible:ring-0">
                <Calendar className="text-icon-black-muted size-4" />
                <span className="text-text-default text-sm font-medium capitalize">
                  {activeSession} {termSelected?.term.toLowerCase()}
                </span>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                {terms.data.terms.map((term: Term) => (
                  <SelectItem key={term.termId} value={String(term.termId)} className="text-text-default text-sm font-medium capitalize">
                    {activeSession} {term.term.toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="md:hidden">
          <Button className="bg-bg-state-soft block size-7 rounded-md p-1.5 md:hidden" onClick={() => setIsFilterOpen(true)}>
            <Image src="/staff/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
          </Button>

          <MobileDrawer open={isFilterOpen} setIsOpen={setIsFilterOpen} title="Filter">
            <div className="flex w-full flex-col gap-4 px-4 py-4">
              {!terms || loadingTerms ? (
                <Skeleton className="bg-bg-input-soft h-9 w-full" />
              ) : (
                <div className="flex flex-col gap-2">
                  {terms.data.terms.map((term: Term) => (
                    <Button
                      onClick={() => {
                        setTermSelected(term);
                        setIsFilterOpen(false);
                      }}
                      key={term.termId}
                      className="text-text-default justify-start text-sm font-medium capitalize"
                    >
                      {activeSession} {term.term.toLowerCase()}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </MobileDrawer>
        </div>
      </div>

      {loadingInvoices && invoices.length === 0 ? (
        <>
          <div className="hidden md:block">
            <Skeleton className="bg-bg-input-soft h-100 w-full" />
          </div>
          <div className="md:hidden">
            <Skeleton className="bg-bg-input-soft h-80 w-full" />
          </div>
        </>
      ) : invoicesError ? (
        <div className="flex justify-center py-12">
          <ErrorComponent title="Failed to load invoices" description={invoicesErrorMessage} buttonText="Retry" onClick={() => refetchInvoices()} />
        </div>
      ) : invoices.length === 0 ? (
        <div className="flex items-center justify-center pt-25">
          <ErrorComponent title="No Invoices" description="No Invoices for this student yet" />
        </div>
      ) : (
        <>
          {/* desktop table */}
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={invoices}
              totalCount={totalCount}
              page={page}
              setCurrentPage={setPage}
              pageSize={pageSize}
              clickHandler={row => router.push(`/staff/invoices/${row.original.invoiceId}`)}
              showPagination={true}
              loadingContent={loadingInvoices}
            />
          </div>

          {/* Mobile View */}
          <div className="flex flex-col gap-4 md:hidden">
            {invoices.map(invoice => (
              <div
                key={invoice.invoiceId}
                role="button"
                onClick={() => router.push(`/staff/invoices/${invoice.invoiceId}`)}
                className="border-border-default bg-bg-card cursor-pointer rounded-md border"
              >
                <div className="flex h-[38px] items-center px-3 py-1.5">
                  <span className="text-text-default text-sm font-medium">{invoice.invoiceNumber}</span>
                </div>

                <div className="border-border-default border-t-1">
                  <div className="border-border-default flex justify-between border-b-1 px-3 py-2 text-sm">
                    <span className="text-text-muted font-medium">Amount:</span>
                    <span className="text-text-muted font-normal">{formatNaira(invoice.amount)}</span>
                  </div>
                  <div className="border-border-default flex justify-between border-b-1 px-3 py-2 text-sm">
                    <span className="text-text-muted font-medium">Last Activity:</span>
                    <span className="text-text-muted font-normal">
                      {invoice.lastActivity ? new Date(invoice.lastActivity).toLocaleDateString() : "-"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between px-3 py-2 text-sm">
                  <span className="text-text-muted font-medium">Status:</span>
                  {getBadge(formatInvoiceStatus(invoice.status))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
