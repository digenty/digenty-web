import { Term } from "@/api/types";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { Draft } from "@/components/Icons/Draft";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTerms } from "@/hooks/queryHooks/useTerms";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { Calendar, Check, CheckCheck, TriangleAlert, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Invoice } from "./types";

const invoices = [
  { id: 0, title: "INV-2025-1001", issueDate: "30/5/2024", status: "Paid" },
  { id: 1, title: "INV-2025-1002", issueDate: "30/5/2024", status: "Unpaid" },
  { id: 2, title: "INV-2025-1003", issueDate: "30/5/2024", status: "Outstanding" },
  { id: 3, title: "INV-2025-1004", issueDate: "30/5/2024", status: "Fully Paid" },
  { id: 4, title: "INV-2025-1005", issueDate: "30/5/2024", status: "Paid" },
  { id: 5, title: "INV-2025-1005", issueDate: "30/5/2024", status: "Unpaid" },
  { id: 6, title: "INV-2025-1005", issueDate: "30/5/2024", status: "Paid" },
  { id: 7, title: "INV-2025-1005", issueDate: "30/5/2024", status: "Outstanding" },
  { id: 8, title: "INV-2025-1005", issueDate: "30/5/2024", status: "Paid" },
];

const termsOptions = ["24/25 Third Term", "24/25 Second Term", "24/25 First Term"];

export const getBadge = (status: string) => {
  switch (status) {
    case "Paid":
      return (
        <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default h-5 rounded-md text-xs font-medium">
          <Check className="size-3" />
          <span>Paid</span>
        </Badge>
      );
    case "Successful":
      return (
        <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default h-5 rounded-md text-xs font-medium">
          <Check className="size-3" />
          <span>Successful</span>
        </Badge>
      );
    case "Unpaid":
      return (
        <Badge className="bg-bg-badge-red text-bg-basic-red-strong border-border-default h-5 rounded-md text-xs font-medium">
          <X className="size-3" />
          <span>Unpaid</span>
        </Badge>
      );
    case "Outstanding":
      return (
        <Badge className="bg-bg-badge-orange text-bg-basic-orange-strong border-border-default h-5 rounded-md text-xs font-medium">
          <TriangleAlert className="size-3" />
          <span>Outstanding</span>
        </Badge>
      );
    case "Fully Paid":
      return (
        <Badge className="bg-bg-badge-lime text-bg-basic-lime-strong border-border-default h-5 rounded-md text-xs font-medium">
          <CheckCheck className="size-3" />
          <span>Fully Paid</span>
        </Badge>
      );
    case "Draft":
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
        <Badge className="bg-bg-red-green text-bg-basic-red-strong border-border-default h-5 rounded-md text-xs font-medium">
          <X className="size-3" />
          <span>Unpaid</span>
        </Badge>
      );
  }
};

export default function StudentInvoiceTable() {
  // const router = useRouter();
  const [termSelected, setTermSelected] = useState<Term | null>(null);
  const [page, setPage] = useState(1);
  // const [rowSelection, setRowSelection] = useState({});
  // const [selectedRows, setSelectedRows] = useState<Invoice[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // const pageSize = 10;
  const user = useLoggedInUser();

  const { data: terms, isPending: loadingTerms } = useGetTerms(user.schoolId);

  useEffect(() => {
    if (terms) {
      const activeTerm = terms.data.terms.find((term: Term) => term.isActiveTerm);
      setTermSelected(activeTerm);
      setActiveSession(terms.data.academicSessionName);
    }
  }, [setActiveSession, setTermSelected, terms]);

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
            <Image src="/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
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

      <div className="flex items-center justify-center pt-25">
        <ErrorComponent title="No Invoices" description="No Invoices for this student yet" />
      </div>

      {/* TODO: When working on invoices module, update this to show user's data */}
      {/* desktop table */}
      {/* <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={invoices}
          totalCount={invoices.length}
          page={page}
          setCurrentPage={setPage}
          pageSize={pageSize}
          clickHandler={row => {
            console.log(row);
            // setIsDetailsOpen(true);
            // setSelectedRole(row.original);
          }}
          showPagination={false}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          onSelectRows={setSelectedRows}
        />
      </div> */}

      {/* Mobile View */}
      {/* <div className="flex flex-col gap-4 md:hidden">
        {invoices.map(invoice => {
          return (
            <div key={invoice.id} className="border-border-default bg-bg-card rounded-md border">
              <div className="flex h-[38px] items-center justify-between px-3 py-1.5">
                <span className="text-text-default text-sm font-medium">{invoice.title}</span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="text-text-muted cursor-pointer p-0! focus-visible:ring-0!">
                      <Ellipsis className="size-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-bg-card border-border-default w-[192px] rounded-sm border shadow-sm">
                    <DropdownMenuItem
                      onClick={() => router.push(`/invoices/${invoice.id}`)}
                      className="text-text-default hover:bg-bg-muted flex items-center gap-2 p-2 text-sm"
                    >
                      <Eye className="size-4" /> View Invoice
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-text-default hover:bg-bg-muted flex items-center gap-2 p-2 text-sm">
                      <Printer fill="var(--color-icon-default-subtle)" className="size-4" /> Print receipt
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-bg-muted flex items-center gap-2 p-2 text-sm text-red-600">
                      <Trash2 className="size-4" /> Delete invoice
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="border-border-default border-t-1">
                <div className="border-border-default flex justify-between border-b-1 px-3 py-2 text-sm">
                  <span className="text-text-muted font-medium">Issued Date:</span>
                  <span className="text-text-muted font-normal">{invoice.issueDate}</span>
                </div>
              </div>

              <div className="flex justify-between px-3 py-2 text-sm">
                <span className="text-text-muted font-medium">Status:</span>
                {getBadge(invoice.status)}
              </div>
            </div>
          );
        })}
      </div> */}
    </div>
  );
}
