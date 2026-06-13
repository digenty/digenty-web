"use client";

import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { DataTable } from "@/components/DataTable";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkUpdateApplicantStatus, useGetApplicantsByClass, useGetCycleApplicants } from "@/hooks/queryHooks/useAdmission";
import useDebounce from "@/hooks/useDebounce";
import { CheckIcon, ListFilterIcon, XIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useActiveAdmissionCycle } from "../../hooks";
import { ApplicantSheet } from "./ApplicantSheet";
import { createApplicantColumns } from "./columns";
import { MobileCard } from "./MobileCard";
import { AdmissionStatus, Applicant, DISPLAY_TO_API_STATUS, mapApplicant } from "./types";

const STATUS_FILTERS: Array<{ label: string; value: AdmissionStatus | "All" }> = [
  { label: "All Statuses", value: "All" },
  { label: "Pending", value: "Pending" },
  { label: "Admitted", value: "Admitted" },
  { label: "Rejected", value: "Rejected" },
];

const PAGE_SIZE = 10;

export const ClassApplicants = () => {
  const params = useParams();
  const classId = Number(params.classId);

  const { cycle, isPending: cyclePending, isError: cycleError, refetch: refetchCycle } = useActiveAdmissionCycle();
  const cycleId = cycle?.id;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AdmissionStatus | "All">("All");
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  // Resolve the class name for the title from the cycle's by-class summary.
  const { data: classSummaries } = useGetApplicantsByClass(cycleId);
  const className = useMemo(
    () => classSummaries?.find(c => c.classId === classId)?.className ?? `Class ${classId}`,
    [classSummaries, classId],
  );

  const filters = {
    page: page - 1,
    size: PAGE_SIZE,
    classId,
    status: statusFilter === "All" ? undefined : DISPLAY_TO_API_STATUS[statusFilter],
    q: debouncedSearch || undefined,
  };

  const { data: applicantsPage, isPending, isError, refetch } = useGetCycleApplicants(cycleId, filters);
  const { mutate: bulkUpdate, isPending: bulkUpdating } = useBulkUpdateApplicantStatus();

  const records = useMemo(() => (applicantsPage?.content ?? []).map(mapApplicant), [applicantsPage]);
  const totalCount = applicantsPage?.totalElements ?? 0;
  const totalPages = applicantsPage?.totalPages ?? 1;

  const openSheet = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsSheetOpen(true);
  };

  const columns = createApplicantColumns(openSheet);

  const selectedIds = Object.keys(rowSelection)
    .filter(key => rowSelection[key])
    .map(index => records[Number(index)]?.id)
    .filter((id): id is number => typeof id === "number");

  const handleBulk = (status: AdmissionStatus) => {
    if (!cycleId || selectedIds.length === 0) return;
    bulkUpdate(
      { cycleId, payload: { applicantIds: selectedIds, status: DISPLAY_TO_API_STATUS[status] } },
      {
        onSuccess: () => {
          toast.success(`${selectedIds.length} applicant(s) ${status.toLowerCase()}`);
          setRowSelection({});
        },
        onError: (error: unknown) => toast.error((error as { message?: string })?.message ?? "Failed to update applicants"),
      },
    );
  };

  if (cyclePending) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  if (cycleError) {
    return (
      <div className="flex justify-center py-16">
        <ErrorComponent title="Couldn't load applicants" description="Something went wrong while loading the active cycle. Please try again." buttonText="Retry" onClick={() => refetchCycle()} />
      </div>
    );
  }

  if (!cycle) {
    return (
      <div className="border-border-default mx-auto mt-10 flex max-w-md flex-col items-center gap-2 rounded-xl border border-dashed py-16">
        <p className="text-text-default text-sm font-medium">No active admission cycle</p>
        <p className="text-text-muted text-center text-xs">Activate an admission cycle to process applicants.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-text-default text-xl font-semibold">{className} Applicants</h2>

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
          value={statusFilter}
          onValueChange={val => {
            setStatusFilter(val as AdmissionStatus | "All");
            setPage(1);
          }}
        >
          <SelectTrigger className="border-border-default h-8 w-auto gap-2 rounded-full border text-sm font-medium focus-visible:ring-0">
            <ListFilterIcon className="text-icon-default-subtle size-4 shrink-0" />
            <span className="text-text-default">{statusFilter === "All" ? "Admission Status" : statusFilter}</span>
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default">
            {STATUS_FILTERS.map(s => (
              <SelectItem key={s.value} value={s.value} className="text-text-default text-sm font-medium">
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedIds.length > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-text-muted text-xs">{selectedIds.length} selected</span>
            <Button
              onClick={() => handleBulk("Admitted")}
              disabled={bulkUpdating}
              className="bg-bg-badge-green text-bg-basic-green-strong flex h-8 items-center gap-1.5 rounded-md border border-green-200 px-3 text-sm font-medium disabled:opacity-50"
            >
              <CheckIcon className="size-3.5" />
              Admit
            </Button>
            <Button
              onClick={() => handleBulk("Rejected")}
              disabled={bulkUpdating}
              className="bg-bg-badge-red text-bg-basic-red-strong flex h-8 items-center gap-1.5 rounded-md border border-red-200 px-3 text-sm font-medium disabled:opacity-50"
            >
              <XIcon className="size-3.5" />
              Reject
            </Button>
          </div>
        )}
      </div>

      {isError ? (
        <div className="flex justify-center py-12">
          <ErrorComponent title="Couldn't load applicants" description="Something went wrong while fetching applicants. Please try again." buttonText="Retry" onClick={() => refetch()} />
        </div>
      ) : isPending ? (
        <Skeleton className="h-80 w-full rounded-xl" />
      ) : records.length === 0 ? (
        <div className="border-border-default flex flex-col items-center gap-2 rounded-xl border border-dashed py-16">
          <p className="text-text-default text-sm font-medium">No applicants found</p>
          <p className="text-text-muted text-xs">Try adjusting your search or status filter.</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={records}
              totalCount={totalCount}
              page={page}
              setCurrentPage={p => {
                setPage(p);
                setRowSelection({});
              }}
              pageSize={PAGE_SIZE}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
            />
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            {records.map(applicant => (
              <MobileCard key={applicant.id} applicant={applicant} onView={openSheet} />
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-text-subtle text-sm disabled:opacity-40">
                  Previous
                </button>
                <span className="text-text-muted text-xs">
                  Page {page} of {totalPages}
                </span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="text-text-subtle text-sm disabled:opacity-40">
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <ApplicantSheet key={selectedApplicant?.id} cycleId={cycle.id} applicant={selectedApplicant} open={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
    </div>
  );
};
