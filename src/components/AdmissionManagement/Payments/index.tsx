"use client";

import { AdmissionFeeType } from "@/api/admission";
import { DataTable } from "@/components/DataTable";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { Progress4 } from "@/components/Icons/Progress4";
import { OverviewCard } from "@/components/OverviewCard";
import { SearchInput } from "@/components/SearchInput";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetApplicantsByClass, useGetCyclePayments, useGetPaymentsSummary } from "@/hooks/queryHooks/useAdmission";
import useDebounce from "@/hooks/useDebounce";
import { CashFill, FileList3Fill, School } from "@digenty/icons";
import { ListFilterIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useActiveAdmissionCycle, useAdmissionBranchOptions } from "../hooks";
import { FEE_LABEL, paymentColumns } from "./columns";
import { PaymentMobileCard } from "./MobileCard";

const FEE_TYPES: Array<{ label: string; value: AdmissionFeeType | "All" }> = [
  { label: "All Fees", value: "All" },
  { label: "Examination Fee", value: "EXAMINATION_FEE" },
  { label: "Entrance Fee", value: "ENTRANCE_FEE" },
  { label: "Application Fee", value: "APPLICATION_FEE" },
];

const PAGE_SIZE = 10;

const TotalRevenueIcon = () => (
  <div className="bg-bg-basic-emerald-subtle border-bg-basic-emerald-accent flex w-6 items-center justify-center rounded-xs border p-1">
    <CashFill fill="var(--color-icon-default)" />
  </div>
);

const AppFeeIcon = () => (
  <div className="bg-bg-basic-yellow-subtle border-bg-basic-yellow-accent flex w-6 items-center justify-center rounded-xs border p-1">
    <Progress4 fill="var(--color-icon-default)" />
  </div>
);

const ExamFeeIcon = () => (
  <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex w-6 items-center justify-center rounded-xs border p-1">
    <FileList3Fill fill="var(--color-icon-default)" />
  </div>
);

export const AdmissionPayments = () => {
  const { cycle, isPending: cyclePending, isError: cycleError, refetch: refetchCycle } = useActiveAdmissionCycle();
  const { options: branchOptions } = useAdmissionBranchOptions();

  const [branchName, setBranchName] = useState("All Branches");
  const [feeFilter, setFeeFilter] = useState<AdmissionFeeType | "All">("All");
  const [classFilter, setClassFilter] = useState<string>("All Classes");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);

  const branchId = branchOptions.find(b => b.name === branchName)?.id;
  const cycleId = cycle?.id;

  // Class filter options for this cycle (deduped by classId).
  const { data: classSummaries } = useGetApplicantsByClass(cycleId, branchId);
  const classOptions = useMemo(() => {
    const map = new Map<number, string>();
    (classSummaries ?? []).forEach(c => map.set(c.classId, c.className));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [classSummaries]);

  const classId = classFilter === "All Classes" ? undefined : Number(classFilter);

  const filters = {
    page: page - 1,
    size: PAGE_SIZE,
    fee: feeFilter === "All" ? undefined : feeFilter,
    classId,
    branchId,
    q: debouncedSearch || undefined,
  };

  const { data: paymentsPage, isPending, isError, refetch } = useGetCyclePayments(cycleId, filters);
  const { data: summary } = useGetPaymentsSummary(cycleId, branchId);

  const records = paymentsPage?.content ?? [];
  const totalCount = paymentsPage?.totalElements ?? 0;
  const totalPages = paymentsPage?.totalPages ?? 1;

  if (cyclePending) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-40" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  if (cycleError) {
    return (
      <div className="flex justify-center py-16">
        <ErrorComponent title="Couldn't load payments" description="Something went wrong while loading the active cycle. Please try again." buttonText="Retry" onClick={() => refetchCycle()} />
      </div>
    );
  }

  if (!cycle) {
    return (
      <div className="border-border-default mx-auto mt-10 flex max-w-md flex-col items-center gap-2 rounded-xl border border-dashed py-16">
        <p className="text-text-default text-sm font-medium">No active admission cycle</p>
        <p className="text-text-muted text-center text-xs">Activate an admission cycle to view payment records.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-text-default text-xl font-semibold">Overview</h2>
        <Select value={branchName} onValueChange={val => { setBranchName(val); setPage(1); }}>
          <SelectTrigger className="border-border-darker bg-bg-state-secondary! h-8 w-auto gap-1.5 border text-sm font-medium focus-visible:ring-0">
            <School fill="var(--color-icon-default-subtle)" className="size-3.5 shrink-0" />
            <span className="text-text-default">{branchName}</span>
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default">
            {branchOptions.map(b => (
              <SelectItem key={b.name} value={b.name} className="text-text-default text-sm font-medium">
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <OverviewCard title="Total Revenue" value={`₦${(summary?.totalRevenue ?? 0).toLocaleString()}`} Icon={TotalRevenueIcon} />
        <OverviewCard title="Application Fee" value={`₦${(summary?.applicationFeeTotal ?? 0).toLocaleString()}`} Icon={AppFeeIcon} />
        <OverviewCard title="Examination Fee" value={`₦${(summary?.examinationFeeTotal ?? 0).toLocaleString()}`} Icon={ExamFeeIcon} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search"
          className="border-border-default bg-bg-input-soft w-full max-w-71 rounded-md border"
        />

        <Select
          value={feeFilter}
          onValueChange={val => {
            setFeeFilter(val as AdmissionFeeType | "All");
            setPage(1);
          }}
        >
          <SelectTrigger className="border-border-default h-8 w-auto gap-2 rounded-full border text-sm font-medium focus-visible:ring-0">
            <ListFilterIcon className="text-icon-default-subtle size-4 shrink-0" />
            <span className="text-text-default">{feeFilter === "All" ? "Fee" : FEE_LABEL[feeFilter]}</span>
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default">
            {FEE_TYPES.map(f => (
              <SelectItem key={f.value} value={f.value} className="text-text-default text-sm font-medium">
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={classFilter}
          onValueChange={val => {
            setClassFilter(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="border-border-default h-8 w-auto gap-2 rounded-full border text-sm font-medium focus-visible:ring-0">
            <ListFilterIcon className="text-icon-default-subtle size-4 shrink-0" />
            <span className="text-text-default">
              {classFilter === "All Classes" ? "Class" : classOptions.find(c => String(c.id) === classFilter)?.name ?? "Class"}
            </span>
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default">
            <SelectItem value="All Classes" className="text-text-default text-sm font-medium">
              All Classes
            </SelectItem>
            {classOptions.map(c => (
              <SelectItem key={c.id} value={String(c.id)} className="text-text-default text-sm font-medium">
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isError ? (
        <div className="flex justify-center py-12">
          <ErrorComponent title="Couldn't load payments" description="Something went wrong while fetching payment records. Please try again." buttonText="Retry" onClick={() => refetch()} />
        </div>
      ) : isPending ? (
        <Skeleton className="h-80 w-full rounded-xl" />
      ) : records.length === 0 ? (
        <div className="border-border-default flex flex-col items-center gap-2 rounded-xl border border-dashed py-16">
          <p className="text-text-default text-sm font-medium">No payment records found</p>
          <p className="text-text-muted text-xs">Try adjusting your filters or search.</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <DataTable columns={paymentColumns} data={records} totalCount={totalCount} page={page} setCurrentPage={p => setPage(p)} pageSize={PAGE_SIZE} />
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            {records.map(record => (
              <PaymentMobileCard key={record.id} record={record} />
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-text-subtle text-sm disabled:opacity-40">
                  Previous
                </button>
                <span className="text-text-muted text-xs">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="text-text-subtle text-sm disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
