"use client";

import { DataTable } from "@/components/DataTable";
import { OverviewCard } from "@/components/OverviewCard";
import { SearchInput } from "@/components/SearchInput";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import CashFill from "@/components/Icons/CashFill";
import FileList3Fill from "@/components/Icons/FileList3Fill";
import School from "@/components/Icons/School";
import { Progress4 } from "@/components/Icons/Progress4";
import { ListFilterIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { paymentColumns } from "./columns";
import { PaymentMobileCard } from "./MobileCard";
import { FeeType, PaymentRecord } from "./types";

const BRANCHES = ["All Branches", "Lawanson", "Ilasamaja"];

const FEE_TYPES: Array<{ label: string; value: FeeType | "All" }> = [
  { label: "All Fees", value: "All" },
  { label: "Examination Fee", value: "Examination Fee" },
  { label: "Entrance Fee", value: "Entrance Fee" },
  { label: "Application Fee", value: "Application Fee" },
];

const CLASSES = [
  "All Classes",
  "JSS 1",
  "JSS 2",
  "JSS 3",
  "SS 1 Art",
  "SS 1 Commercial",
  "SS 1 Science",
  "SS 2 Art",
  "SS 2 Commercial",
  "SS 2 Science",
  "SS 3 Art",
  "SS 3 Commercial",
  "SS 3 Science",
];

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
];

const MOCK_PAYMENTS: PaymentRecord[] = NAMES.flatMap((name, i) =>
  (["Examination Fee", "Application Fee", "Entrance Fee"] as FeeType[]).map((fee, j) => ({
    id: `${i}-${j}`,
    studentName: name,
    applicantId: `APP-2025-${String(i + 1).padStart(3, "0")}`,
    className: "SS 1 Science",
    fee,
    amount: 50000,
    status: j === 0 ? "Paid" : j === 1 ? "Pending" : "Overdue",
    date: "June 20, 2024",
  })),
);

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
  const [branch, setBranch] = useState("All Branches");
  const [feeFilter, setFeeFilter] = useState<FeeType | "All">("All");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return MOCK_PAYMENTS.filter(r => feeFilter === "All" || r.fee === feeFilter)
      .filter(r => classFilter === "All Classes" || r.className === classFilter)
      .filter(r => r.studentName.toLowerCase().includes(search.toLowerCase()) || r.applicantId.toLowerCase().includes(search.toLowerCase()));
  }, [feeFilter, classFilter, search]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalRevenue = MOCK_PAYMENTS.filter(r => r.status === "Paid").reduce((s, r) => s + r.amount, 0);
  const appFeeTotal = MOCK_PAYMENTS.filter(r => r.fee === "Application Fee" && r.status === "Paid").reduce((s, r) => s + r.amount, 0);
  const examFeeTotal = MOCK_PAYMENTS.filter(r => r.fee === "Examination Fee" && r.status === "Paid").reduce((s, r) => s + r.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-text-default text-xl font-semibold">Overview</h2>
        <Select value={branch} onValueChange={setBranch}>
          <SelectTrigger className="border-border-darker bg-bg-state-secondary! h-8 w-auto gap-1.5 border text-sm font-medium focus-visible:ring-0">
            <School fill="var(--color-icon-default-subtle)" className="size-3.5 shrink-0" />
            <span className="text-text-default">{branch}</span>
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default">
            {BRANCHES.map(b => (
              <SelectItem key={b} value={b} className="text-text-default text-sm font-medium">
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <OverviewCard title="Total Revenue" value={`₦${totalRevenue.toLocaleString()}`} Icon={TotalRevenueIcon} />
        <OverviewCard title="Application Fee" value={`₦${appFeeTotal.toLocaleString()}`} Icon={AppFeeIcon} />
        <OverviewCard title="Examination Fee" value={`₦${examFeeTotal.toLocaleString()}`} Icon={ExamFeeIcon} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search"
          className="border-border-default bg-bg-input-soft w-full max-w-71 rounded-md border"
        />

        <Select
          value={feeFilter}
          onValueChange={val => {
            setFeeFilter(val as FeeType | "All");
            setPage(1);
          }}
        >
          <SelectTrigger className="border-border-default h-8 w-auto gap-2 rounded-full border text-sm font-medium focus-visible:ring-0">
            <ListFilterIcon className="text-icon-default-subtle size-4 shrink-0" />
            <span className="text-text-default">{feeFilter === "All" ? "Fee" : feeFilter}</span>
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
            <span className="text-text-default">{classFilter === "All Classes" ? "Class" : classFilter}</span>
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default">
            {CLASSES.map(c => (
              <SelectItem key={c} value={c} className="text-text-default text-sm font-medium">
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="hidden md:block">
        <DataTable
          columns={paymentColumns}
          data={paginated}
          totalCount={filtered.length}
          page={page}
          setCurrentPage={p => setPage(p)}
          pageSize={PAGE_SIZE}
        />
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {paginated.length === 0 ? (
          <p className="text-text-muted py-8 text-center text-sm">No payment records found.</p>
        ) : (
          paginated.map(record => <PaymentMobileCard key={record.id} record={record} />)
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
    </div>
  );
};
