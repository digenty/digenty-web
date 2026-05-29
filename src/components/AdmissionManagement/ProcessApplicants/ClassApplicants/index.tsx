"use client";

import { DataTable } from "@/components/DataTable";
import { SearchInput } from "@/components/SearchInput";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ListFilterIcon } from "lucide-react";
import { createApplicantColumns } from "./columns";
import { MobileCard } from "./MobileCard";
import { ApplicantSheet } from "./ApplicantSheet";
import { Applicant, AdmissionStatus } from "./types";

const CLASS_NAME_MAP: Record<string, string> = {
  "1": "JSS 1",
  "2": "JSS 2",
  "3": "JSS 3",
  "4": "SS 1 Art",
  "5": "SS 1 Commercial",
  "6": "SS 1 Science",
  "7": "SS 2 Art",
  "8": "SS 2 Commercial",
  "9": "SS 2 Science",
};

const NAMES = [
  "Damilare John",
  "Chidi Okafor",
  "Amara Nwosu",
  "Babajide Adeyemi",
  "Chiamaka Okonkwo",
  "Emeka Eze",
  "Fatima Sule",
  "Gbenga Adeleke",
  "Halima Musa",
  "Ifeoma Anyanwu",
  "Jide Olusegun",
  "Kemi Adesola",
  "Ladi Ibrahim",
  "Mustapha Bello",
  "Ngozi Obi",
];

const STATUSES: AdmissionStatus[] = [
  "Pending",
  "Pending",
  "Pending",
  "Admitted",
  "Admitted",
  "Rejected",
  "Pending",
  "Pending",
  "Admitted",
  "Pending",
  "Rejected",
  "Pending",
  "Admitted",
  "Pending",
  "Pending",
];
const SCORES: (number | null)[] = [null, 230, 230, 230, 230, 230, 230, 195, 245, 210, 230, 185, 270, 230, 220];

const MOCK_APPLICANTS: Applicant[] = Object.keys(CLASS_NAME_MAP).flatMap(classId =>
  NAMES.map((name, i) => ({
    id: `${classId}-${i + 1}`,
    name,
    applicantId: `APP-2025-${String(i + 1).padStart(3, "0")}`,
    classId,
    status: STATUSES[i],
    totalScore: SCORES[i],
    dateApplied: "June 20, 2024",
  })),
);

const STATUS_FILTERS: Array<{ label: string; value: AdmissionStatus | "All" }> = [
  { label: "All Statuses", value: "All" },
  { label: "Pending", value: "Pending" },
  { label: "Admitted", value: "Admitted" },
  { label: "Rejected", value: "Rejected" },
];

const PAGE_SIZE = 10;

export const ClassApplicants = () => {
  const params = useParams();
  const router = useRouter();
  const classId = params.classId as string;
  const className = CLASS_NAME_MAP[classId] ?? `Class ${classId}`;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AdmissionStatus | "All">("All");
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const openSheet = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsSheetOpen(true);
  };

  const columns = createApplicantColumns(openSheet);

  const filtered = useMemo(() => {
    return MOCK_APPLICANTS.filter(a => a.classId === classId)
      .filter(a => statusFilter === "All" || a.status === statusFilter)
      .filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.applicantId.toLowerCase().includes(search.toLowerCase()));
  }, [classId, statusFilter, search]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-text-default text-xl font-semibold">{className} Applicants</h2>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={e => setSearch(e.target.value)}
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
      </div>

      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={paginated}
          totalCount={filtered.length}
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
        {paginated.length === 0 ? (
          <p className="text-text-muted py-8 text-center text-sm">No applicants found.</p>
        ) : (
          paginated.map(applicant => <MobileCard key={applicant.id} applicant={applicant} onView={openSheet} />)
        )}

        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between pt-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-text-subtle text-sm disabled:opacity-40">
              Previous
            </button>
            <span className="text-text-muted text-xs">
              Page {page} of {Math.ceil(filtered.length / PAGE_SIZE)}
            </span>
            <button
              onClick={() => setPage(p => Math.min(Math.ceil(filtered.length / PAGE_SIZE), p + 1))}
              disabled={page >= Math.ceil(filtered.length / PAGE_SIZE)}
              className="text-text-subtle text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <ApplicantSheet
        key={selectedApplicant?.id}
        applicant={selectedApplicant}
        open={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </div>
  );
};
