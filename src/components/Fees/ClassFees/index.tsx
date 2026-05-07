"use client";

import { FileList3Fill, GraduationCapFill } from "@digenty/icons";
import React, { useMemo, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { useRouter } from "next/navigation";
import { OverviewCard } from "@/components/OverviewCard";
import { FeesHeader } from "../FeesHeader";
import { Button } from "@/components/ui/button";
import { Ellipsis, Trash2 } from "lucide-react";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Badge } from "@/components/ui/badge";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { EmptyFeeState } from "../EmptyFeeState";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useGetActiveSession } from "@/hooks/queryHooks/useAcademic";
import { useGetFeeClassOverview } from "@/hooks/queryHooks/useFee";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { Branch } from "@/api/types";
import { FeeTermType } from "@/api/fee";
import { Spinner } from "@/components/ui/spinner";
import * as XLSX from "xlsx";
import { unwrapArray, extractSessionId } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { columnsClassFees } from "./ClassColumns";

const TERM_LABEL: Record<FeeTermType, string> = {
  FIRST: "First Term",
  SECOND: "Second Term",
  THIRD: "Third Term",
};

interface TermOption {
  id: number;
  sessionId: number;
  term: FeeTermType;
  label: string;
}

export const ClassFees = () => {
  useBreadcrumb([
    { label: "Fees", url: "/staff/fees" },
    { label: "Class Fees", url: "/staff/fees?tab=Class Fees" },
  ]);

  const router = useRouter();
  const { schoolId } = useLoggedInUser();

  const { data: branchesData } = useGetBranches();
  const { data: termsData } = useGetTerms(schoolId);
  const { data: activeSessionData } = useGetActiveSession();

  const branches: Branch[] = unwrapArray<Branch>(branchesData);
  const sessionId = extractSessionId(activeSessionData) ?? 0;

  const termOptions: TermOption[] = useMemo(() => {
    return unwrapArray<{ termId: number; term: FeeTermType }>(termsData).map(t => ({
      id: t.termId,
      sessionId,
      term: t.term,
      label: TERM_LABEL[t.term] ?? t.term,
    }));
  }, [termsData, sessionId]);

  const branchOptions = ["All Branches", ...branches.filter(b => b.name).map((b: Branch) => b.name!)];
  const termLabelOptions = termOptions.map(t => t.label);

  const [branchSelected, setBranchSelected] = useState("All Branches");
  const [termSelected, setTermSelected] = useState(termLabelOptions[0] ?? "");
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [visibleCount, setVisibleCount] = useState(3);
  const [isOpen, setIsOpen] = useState(false);
  const pageSize = 4;

  const selectedTermObj = termOptions.find(t => t.label === termSelected) ?? termOptions[0];
  const selectedBranch = branches.find((b: Branch) => b.name === branchSelected);

  const { data: overview, isLoading } = useGetFeeClassOverview(selectedTermObj?.sessionId, selectedTermObj?.term, selectedBranch?.id);

  const overviewBranches: {
    branchId: number;
    branchName: string;
    totalFees: number;
    totalClassVariations: number;
    classes: { classId: number; className: string; feeNames: string[]; totalAmount: number }[];
  }[] = overview?.branches ?? [];

  const handleExport = () => {
    const rows = overviewBranches.flatMap(b =>
      b.classes.map(c => ({
        Branch: b.branchName,
        Class: c.className,
        "Fee Items": c.feeNames.join(", "),
        "Total Amount (₦)": c.totalAmount,
      })),
    );
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Class Fees");
    XLSX.writeFile(wb, "class-fees.xlsx");
  };

  return (
    <>
      {isLoading && <Skeleton className="bg-bg-input-soft h-100 w-full" />}

      {!isLoading && overviewBranches.length === 0 && (
        <EmptyFeeState
          title="Let's set up your fees"
          description="You can add fees for one or more classes, branches and arms. We'll guide you step-by-step."
          buttonText="Add First Fee"
          url="/staff/fees/add"
        />
      )}

      <div>
        <FeesHeader
          title="Class Fees Overview"
          branches={branchOptions}
          branchSelected={branchSelected}
          classes={[]}
          selectedClass=""
          setSelectedClass={() => {}}
          arms={[]}
          setSelectedArm={() => {}}
          selectedArm=""
          setBranchSelected={setBranchSelected}
          termsOptions={termLabelOptions.length ? termLabelOptions : ["No terms"]}
          termSelected={termSelected}
          setTermSelected={v => {
            setTermSelected(v);
            setPage(1);
          }}
          onAddClick={() => router.push("/staff/fees/add")}
          exportTitle="Export Class Fees"
          exportActionButton="Export Class Fees"
        />

        <div className="mt-4 md:mt-6">
          {overviewBranches.map(branch => (
            <div key={branch.branchId} className="mb-10 flex flex-col gap-4">
              <h2 className="text-text-default text-lg font-semibold">{branch.branchName}</h2>
              <div className="flex gap-3">
                <OverviewCard
                  title="Total Class Variations"
                  Icon={() => (
                    <div className="bg-bg-basic-sky-subtle border-bg-basic-sky-accent flex w-6 items-center justify-center rounded-xs border p-1">
                      <GraduationCapFill fill="var(--color-icon-default)" className="size-3" />
                    </div>
                  )}
                  value={String(branch.totalClassVariations)}
                />
                <OverviewCard
                  title="Total Fees"
                  Icon={() => (
                    <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex w-6 items-center justify-center rounded-xs border p-1">
                      <FileList3Fill fill="var(--color-icon-default)" className="size-3" />
                    </div>
                  )}
                  value={`₦${branch.totalFees?.toLocaleString() ?? 0}`}
                />
              </div>

              {/* Desktop */}
              <div className="hidden md:block">
                <DataTable
                  columns={columnsClassFees}
                  data={branch.classes.map(c => ({
                    id: c.classId,
                    classname: c.className,
                    fee: { tution: c.feeNames.join(", "), item: "", count: c.feeNames.length },
                    totalAmount: c.totalAmount,
                  }))}
                  totalCount={branch.classes.length}
                  page={page}
                  setCurrentPage={setPage}
                  pageSize={pageSize}
                  clickHandler={row => router.push(`/staff/fees/${row.original.id}`)}
                  rowSelection={rowSelection}
                  setRowSelection={setRowSelection}
                  onSelectRows={() => {}}
                  showPagination={false}
                  classNames={{ tableRow: "cursor-pointer" }}
                />
              </div>

              <div className="flex flex-col gap-4 md:hidden">
                {branch.classes.slice(0, visibleCount).map(c => (
                  <div key={c.classId} className="border-border-default bg-bg-subtle rounded-md border last:border-none">
                    <div className="flex h-10 items-center justify-between px-3 py-1.5">
                      <span className="text-text-default text-sm font-medium">{c.className}</span>
                      <Button onClick={() => setIsOpen(true)} className="text-text-muted cursor-pointer p-0! focus-visible:ring-0!">
                        <Ellipsis className="size-5" />
                      </Button>
                      <MobileDrawer open={isOpen} setIsOpen={setIsOpen} title="Actions">
                        <div className="flex w-full flex-col gap-4 px-3 py-4">
                          <div
                            onClick={() => {
                              setIsOpen(false);
                              router.push(`/staff/fees/${c.classId}`);
                            }}
                            className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-md border p-2 text-sm"
                          >
                            View Class Fee
                          </div>
                          <div className="hover:bg-bg-muted border-border-darker flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-md border p-2 text-sm text-red-600">
                            <Trash2 className="size-4" /> Delete
                          </div>
                        </div>
                      </MobileDrawer>
                    </div>
                    <div className="border-border-default border-t">
                      <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                        <span className="text-text-muted font-medium">Fee</span>
                        <div className="flex items-center gap-2">
                          <Badge className="text-text-default bg-bg-badge-default border-border-default rounded-md border text-sm font-medium">
                            {c.feeNames.length} items
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="border-border-default flex justify-between px-3 py-2 text-sm">
                      <span className="text-text-muted font-medium">Total Amount</span>
                      <span className="text-text-default text-sm font-medium">₦{c.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                {visibleCount < branch.classes.length && (
                  <Button
                    onClick={() => setVisibleCount(branch.classes.length)}
                    className="bg-bg-state-soft! text-text-subtle! mx-auto my-2 flex w-39 items-center justify-center rounded-md"
                  >
                    Load More
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
