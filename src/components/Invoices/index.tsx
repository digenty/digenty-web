"use client";

import { AlertFill, Approve, FileList3Fill } from "@digenty/icons";
import { Branch, BranchWithClassLevels, ClassType, Term } from "@/api/types";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetClasses } from "@/hooks/queryHooks/useClass";
import { useGetInvoices } from "@/hooks/queryHooks/useInvoice";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import useDebounce from "@/hooks/useDebounce";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useEffect, useMemo, useState } from "react";
import { OverviewCard } from "../OverviewCard";
import { InvoiceOverviewTable } from "./InvoiceOverviewTable";
import { InvoicesHeader } from "./InvoicesHeader";
import { InvoiceSearchAndExport } from "./InvoiceSearchAndExport";
import { ErrorComponent } from "../Error/ErrorComponent";
import { toast } from "../Toast";
import { formatNaira, InvoicesResponse } from "./types";
import { Skeleton } from "../ui/skeleton";

type InvoiceFilter = {
  branchSelected?: Branch;
  classSelected?: ClassType;
  termSelected?: Term;
};

export const Invoices = () => {
  const { schoolId, branchIds, isMain, isAdmin, adminBranchIds } = useLoggedInUser();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const [statusFilter, setStatusFilter] = useState("");
  const [filter, setFilter] = useState<InvoiceFilter>({});

  // A staff member with no branch-admin/main access is restricted to their own assigned
  // branch(es) — they shouldn't default to, or be able to pick, another branch's invoices.
  const userBranchIds = useMemo(() => branchIds ?? [], [branchIds]);
  const hasFullAccess = isMain || isAdmin || (adminBranchIds?.length ?? 0) > 0;
  const isBranchRestricted = !hasFullAccess && userBranchIds.length > 0;
  const restrictedBranchId = isBranchRestricted ? userBranchIds[0] : undefined;

  const { data: allBranches, isPending: loadingBranches } = useGetBranches();
  const branches = useMemo(() => {
    if (!allBranches || !isBranchRestricted) return allBranches;
    return { data: allBranches.data.filter((b: BranchWithClassLevels) => userBranchIds.includes(b.branch.id)) };
  }, [allBranches, isBranchRestricted, userBranchIds]);

  const effectiveBranchId = filter.branchSelected?.id ?? restrictedBranchId;

  const { data: classes, isPending: loadingClasses } = useGetClasses(effectiveBranchId);
  const { data: terms, isPending: loadingTerms } = useGetTerms(schoolId);

  useEffect(() => {
    if (!filter.branchSelected && branches?.data?.length) {
      const own = restrictedBranchId ? branches.data.find((b: BranchWithClassLevels) => b.branch.id === restrictedBranchId) : undefined;
      const first: BranchWithClassLevels = own ?? branches.data[0];
      setFilter(prev => ({ ...prev, branchSelected: first.branch }));
    }
  }, [branches, filter.branchSelected, restrictedBranchId]);

  const onFilterChange = (key: keyof InvoiceFilter, value: Branch | ClassType | Term | undefined) => {
    setPage(1);
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  // Fetch all invoices at once so search and status can filter client-side
  const {
    data,
    isFetching: loadingInvoices,
    isError: invoicesError,
    error: invoicesErrorObj,
    refetch: refetchInvoices,
  } = useGetInvoices({
    branchId: effectiveBranchId,
    classId: filter.classSelected?.id,
    termId: filter.termSelected?.termId,
    page: 0,
    size: 1000,
  });

  const invoicesErrorMessage = (invoicesErrorObj as { message?: string } | null)?.message ?? "We couldn't load your invoices. Please try again.";

  useEffect(() => {
    if (invoicesError) {
      toast({ title: invoicesErrorMessage, type: "error" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoicesError]);

  const invoiceData = (data as { data: InvoicesResponse } | undefined)?.data;
  const allInvoices = invoiceData?.invoices ?? [];

  const filteredInvoices = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return allInvoices.filter(inv => {
      const matchesSearch = !q || inv.studentName.toLowerCase().includes(q) || (inv.invoiceId ?? "").toLowerCase().includes(q);
      const matchesStatus = !statusFilter || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allInvoices, debouncedSearch, statusFilter]);

  const paginatedInvoices = filteredInvoices.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <div className="space-y-4 px-4 pt-4 pb-8 md:px-8 md:pt-6 md:pb-12">
        <InvoicesHeader
          filter={filter}
          onFilterChange={onFilterChange}
          branches={branches}
          loadingBranches={loadingBranches}
          classes={classes}
          loadingClasses={loadingClasses}
          terms={terms}
          loadingTerms={loadingTerms}
        />
        <div className="space-y-4 md:space-y-6">
          <div className="grid w-full grid-cols-2 gap-3 lg:grid-cols-3">
            <OverviewCard
              title="Total Issued"
              Icon={() => (
                <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                  <FileList3Fill fill="var(--color-icon-default)" />
                </div>
              )}
              value={formatNaira(invoiceData?.totalIssued)}
            />

            <OverviewCard
              title="Total Paid"
              Icon={() => (
                <div className="bg-bg-basic-sky-subtle border-bg-basic-sky-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                  <Approve fill="var(--color-icon-default)" />
                </div>
              )}
              value={formatNaira(invoiceData?.totalPaid)}
            />

            <div className="col-span-2 lg:col-span-1">
              <OverviewCard
                title="Outstanding Fees"
                Icon={() => (
                  <div className="bg-bg-basic-yellow-subtle border-bg-basic-yellow-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                    <AlertFill fill="var(--color-icon-default)" />
                  </div>
                )}
                value={formatNaira(invoiceData?.outstandingFees)}
              />
            </div>
          </div>

          <InvoiceSearchAndExport
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            branches={branches}
            terms={terms}
            currentBranchId={effectiveBranchId}
          />

          {loadingInvoices && <Skeleton className="bg-bg-input-soft! h-screen w-full" />}

          {!loadingInvoices && invoicesError && (
            <div className="flex justify-center py-12">
              <ErrorComponent
                title="Failed to load invoices"
                description={invoicesErrorMessage}
                buttonText="Retry"
                onClick={() => refetchInvoices()}
              />
            </div>
          )}

          {!invoicesError && !loadingInvoices && (
            <InvoiceOverviewTable
              invoices={paginatedInvoices}
              loading={loadingInvoices}
              page={page}
              setPage={setPage}
              pageSize={pageSize}
              totalCount={filteredInvoices.length}
            />
          )}
        </div>
      </div>
    </div>
  );
};
