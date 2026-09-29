"use client";

import { useState } from "react";
import { BillFill, QuickReferenceAll } from "@digenty/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/DataTable";
import { OverviewCard } from "@/components/OverviewCard";
import { SearchInput } from "@/components/SearchInput";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useGetPendingPayments } from "@/hooks/queryHooks/useInvoice";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import useDebounce from "@/hooks/useDebounce";
import { BranchWithClassLevels, Term } from "@/api/types";
import { PendingPaymentEntry } from "@/api/invoice";
import { formatNaira } from "../types";
import { getPendingPaymentsColumns } from "./PendingPaymentsColumns";
import { ApprovePaymentModal, RejectPaymentModal } from "./PendingPaymentModals";

const PAGE_SIZE = 10;

export const PendingPayments = () => {
  const { schoolId, branchIds, isMain, isAdmin, adminBranchIds } = useLoggedInUser();
  const [page, setPage] = useState(1);
  const [branchId, setBranchId] = useState<number | undefined>(undefined);
  const [termId, setTermId] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const [approving, setApproving] = useState<PendingPaymentEntry | null>(null);
  const [rejecting, setRejecting] = useState<PendingPaymentEntry | null>(null);

  const userBranchIds = branchIds ?? [];
  const hasFullAccess = isMain || isAdmin || (adminBranchIds?.length ?? 0) > 0;
  const isBranchRestricted = !hasFullAccess && userBranchIds.length > 0;

  const { data: allBranches, isPending: loadingBranches } = useGetBranches();
  const branches = isBranchRestricted
    ? { data: (allBranches?.data ?? []).filter((b: BranchWithClassLevels) => userBranchIds.includes(b.branch.id)) }
    : allBranches;

  const { data: terms, isPending: loadingTerms } = useGetTerms(schoolId);

  const {
    data,
    isFetching: loading,
    isError,
    error: errorObj,
    refetch,
  } = useGetPendingPayments({
    branchId,
    termId,
    search: debouncedSearch || undefined,
    page: page - 1,
    size: PAGE_SIZE,
  });

  const errorMessage = (errorObj as { message?: string } | null)?.message ?? "We couldn't load pending payments. Please try again.";
  const payments = data?.content ?? [];
  const totalCount = data?.totalElements ?? payments.length;

  const columns = getPendingPaymentsColumns(setApproving, setRejecting);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
        <OverviewCard
          title="Awaiting Review"
          Icon={() => (
            <div className="bg-bg-basic-orange-subtle border-bg-basic-orange-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
              <BillFill fill="var(--color-icon-default)" />
            </div>
          )}
          value={formatNaira(data?.totalAmount)}
        />
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <SearchInput
          className="border-border-default w-full rounded-md border text-sm md:w-64"
          value={searchQuery}
          onChange={evt => {
            setPage(1);
            setSearchQuery(evt.target.value);
          }}
          placeholder="Search student or invoice number"
        />

        {loadingBranches ? (
          <Skeleton className="bg-bg-input-soft h-8 w-40 rounded-md" />
        ) : (
          <Select
            value={branchId ? String(branchId) : "all"}
            onValueChange={value => {
              setPage(1);
              setBranchId(value === "all" ? undefined : Number(value));
            }}
          >
            <SelectTrigger className="border-border-darker h-8! w-full border md:w-48">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default border">
              <SelectItem value="all">All Branches</SelectItem>
              {(branches?.data ?? []).map((b: BranchWithClassLevels) => (
                <SelectItem key={b.branch.id} value={String(b.branch.id)}>
                  {b.branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {loadingTerms ? (
          <Skeleton className="bg-bg-input-soft h-8 w-40 rounded-md" />
        ) : (
          <Select
            value={termId ? String(termId) : "all"}
            onValueChange={value => {
              setPage(1);
              setTermId(value === "all" ? undefined : Number(value));
            }}
          >
            <SelectTrigger className="border-border-darker h-8! w-full border md:w-48">
              <SelectValue placeholder="All Terms" />
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default border">
              <SelectItem value="all">All Terms</SelectItem>
              {(terms?.data?.terms ?? []).map((t: Term) => (
                <SelectItem key={t.termId} value={String(t.termId)}>
                  {t.term}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {loading && <Skeleton className="bg-bg-input-soft! h-96 w-full" />}

      {!loading && isError && (
        <div className="flex justify-center py-12">
          <ErrorComponent title="Failed to load pending payments" description={errorMessage} buttonText="Retry" onClick={() => refetch()} />
        </div>
      )}

      {!loading && !isError && payments.length === 0 && (
        <div className="border-border-default flex flex-col items-center gap-2 rounded-md border p-10 text-center">
          <QuickReferenceAll fill="var(--color-icon-default-muted)" />
          <p className="text-text-default text-sm font-medium">Nothing to review</p>
          <p className="text-text-muted text-xs">Parent-reported payments awaiting confirmation will show up here.</p>
        </div>
      )}

      {!loading && !isError && payments.length > 0 && (
        <DataTable
          columns={columns}
          data={payments}
          totalCount={totalCount}
          page={page}
          setCurrentPage={setPage}
          pageSize={PAGE_SIZE}
          border
        />
      )}

      {approving && <ApprovePaymentModal payment={approving} open={!!approving} setOpen={open => !open && setApproving(null)} />}
      {rejecting && <RejectPaymentModal payment={rejecting} open={!!rejecting} setOpen={open => !open && setRejecting(null)} />}
    </div>
  );
};
