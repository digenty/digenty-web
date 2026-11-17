"use client";

import { getApiErrorMessage, getApiErrorReason, getRetryErrorProps } from "@/lib/apiError";
import { AlertFill, Approve, FileList3Fill } from "@digenty/icons";
import { Branch, BranchWithClassLevels, ClassType, Term } from "@/api/types";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetClasses } from "@/hooks/queryHooks/useClass";
import { useGetInvoices } from "@/hooks/queryHooks/useInvoice";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import useDebounce from "@/hooks/useDebounce";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePersistedLoad, usePersistValue } from "@/hooks/usePersistedState";
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

type SavedInvoiceView = { page: number; searchQuery: string; statusFilter: string; filter: InvoiceFilter };

const STORAGE_KEY = "invoices:all-view";

// Wait for the saved view to be read before mounting, so the first fetch already uses the restored filters.
export const AllInvoices = () => {
  const { loaded, value } = usePersistedLoad<SavedInvoiceView>(STORAGE_KEY);
  if (!loaded) return <Skeleton className="bg-bg-input-soft! h-screen w-full" />;
  return <AllInvoicesView saved={value} />;
};

const AllInvoicesView = ({ saved }: { saved?: SavedInvoiceView }) => {
  const { schoolId, branchIds, isMain, isAdmin, adminBranchIds } = useLoggedInUser();
  const [page, setPage] = useState(saved?.page ?? 1);
  const pageSize = 10;

  const [searchQuery, setSearchQuery] = useState(saved?.searchQuery ?? "");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const [statusFilter, setStatusFilter] = useState(saved?.statusFilter ?? "");
  const [filter, setFilter] = useState<InvoiceFilter>(saved?.filter ?? {});

  const view = useMemo(() => ({ page, searchQuery, statusFilter, filter }), [page, searchQuery, statusFilter, filter]);
  usePersistValue(STORAGE_KEY, view);

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

  // Reset to page 1 when search/status change, but not on mount (that would throw away the restored page).
  const lastCriteria = useRef(`${debouncedSearch}|${statusFilter}`);
  useEffect(() => {
    const criteria = `${debouncedSearch}|${statusFilter}`;
    if (criteria === lastCriteria.current) return;
    lastCriteria.current = criteria;
    setPage(1);
  }, [debouncedSearch, statusFilter]);

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
    page: page - 1,
    size: pageSize,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
  });

  const invoicesErrorMessage = getApiErrorMessage(invoicesErrorObj, "We couldn't load your invoices. Please try again.");

  useEffect(() => {
    if (invoicesError) {
      toast({ title: "Failed to load invoices", description: getApiErrorReason(invoicesErrorObj), type: "error" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoicesError]);

  const invoiceData = (data as { data: InvoicesResponse } | undefined)?.data;
  const invoices = invoiceData?.invoices ?? [];
  const totalCount = invoiceData?.totalElements ?? invoices.length;

  return (
    <div className="space-y-4 md:space-y-6">
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

      <div className="grid w-full grid-cols-2 gap-3 lg:grid-cols-5">
        <OverviewCard
          title="Required Issued"
          Icon={() => (
            <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
              <FileList3Fill fill="var(--color-icon-default)" />
            </div>
          )}
          value={formatNaira(invoiceData?.totalRequiredIssued ?? invoiceData?.totalIssued)}
        />

        <OverviewCard
          title="Required Paid"
          Icon={() => (
            <div className="bg-bg-basic-sky-subtle border-bg-basic-sky-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
              <Approve fill="var(--color-icon-default)" />
            </div>
          )}
          value={formatNaira(invoiceData?.totalRequiredPaid ?? invoiceData?.totalPaid)}
        />

        <OverviewCard
          title="Optional Issued"
          Icon={() => (
            <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
              <FileList3Fill fill="var(--color-icon-default)" />
            </div>
          )}
          value={formatNaira(invoiceData?.totalOptionalIssued)}
        />

        <OverviewCard
          title="Optional Paid"
          Icon={() => (
            <div className="bg-bg-basic-sky-subtle border-bg-basic-sky-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
              <Approve fill="var(--color-icon-default)" />
            </div>
          )}
          value={formatNaira(invoiceData?.totalOptionalPaid)}
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
          <ErrorComponent title="Failed to load invoices" {...getRetryErrorProps(invoicesErrorObj, invoicesErrorMessage, () => refetchInvoices())} />
        </div>
      )}

      {!invoicesError && !loadingInvoices && (
        <InvoiceOverviewTable
          invoices={invoices}
          loading={loadingInvoices}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          totalCount={totalCount}
        />
      )}
    </div>
  );
};
