"use client";

import { FileList3Fill, GraduationCapFill } from "@digenty/icons";
import React, { useEffect, useMemo, useState } from "react";
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
import { useGetFeeClassOverview, useExportClassFees } from "@/hooks/queryHooks/useFee";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { Branch, BranchWithClassLevels } from "@/api/types";

function extractBranches(data: unknown): Branch[] {
  const list = (() => {
    if (Array.isArray(data)) return data;
    const d = data as Record<string, unknown> | undefined;
    if (Array.isArray(d?.data)) return d!.data as unknown[];
    if (d?.data && typeof d.data === "object") {
      const inner = d.data as Record<string, unknown>;
      if (Array.isArray(inner.content)) return inner.content as unknown[];
    }
    return [];
  })();
  return list
    .map(item => {
      if (item && typeof item === "object" && "branch" in item) return (item as BranchWithClassLevels).branch;
      return item as Branch;
    })
    .filter((b): b is Branch => !!b && typeof b === "object" && typeof (b as Branch).id === "number");
}
import { FeeTermType } from "@/api/fee";
import { Spinner } from "@/components/ui/spinner";
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

  const branches: Branch[] = extractBranches(branchesData);
  const sessionId = extractSessionId(activeSessionData);

  const termOptions: TermOption[] = useMemo(() => {
    return unwrapArray<{ termId: number; term: FeeTermType }>(termsData).map(t => ({
      id: t.termId,
      term: t.term,
      label: TERM_LABEL[t.term] ?? t.term,
    }));
  }, [termsData]);

  const branchOptions = ["All Branches", ...branches.filter(b => b.name).map((b: Branch) => b.name!)];
  const termLabelOptions = termOptions.map(t => t.label);

  const [branchSelected, setBranchSelected] = useState("All Branches");
  const [termSelected, setTermSelected] = useState("");

  useEffect(() => {
    if (termSelected === "" && termLabelOptions.length > 0) {
      setTermSelected(termLabelOptions[0]);
    }
  }, [termLabelOptions, termSelected]);
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [visibleCount, setVisibleCount] = useState(3);
  const [isOpen, setIsOpen] = useState(false);
  const pageSize = 4;

  const selectedTermObj = termOptions.find(t => t.label === termSelected) ?? termOptions[0];
  const selectedBranch = branches.find((b: Branch) => b.name === branchSelected);

  const { data: overviewRaw, isLoading } = useGetFeeClassOverview(sessionId, selectedTermObj?.term, selectedBranch?.id);

  // Unwrap both { data: { branches } } and direct { branches } response shapes
  const overviewData = (overviewRaw as { data?: unknown } | undefined)?.data ?? overviewRaw;

  interface ArmEntry {
    armId: number;
    armName: string;
    totalAmount: number;
  }
  interface ClassEntry {
    classId: number;
    className: string;
    arms: ArmEntry[];
    feeNames: string[];
    totalAmount: number;
  }
  interface OverviewBranch {
    branchId: number;
    branchName: string;
    totalFees: number;
    totalClassVariations: number;
    classes: ClassEntry[];
  }

  const overviewBranches: OverviewBranch[] = (overviewData as { branches?: OverviewBranch[] } | undefined)?.branches ?? [];

  const exportClassNames = [...new Set(overviewBranches.flatMap(b => b.classes.map(c => c.className)))];
  const exportArmNames = [...new Set(overviewBranches.flatMap(b => b.classes.flatMap(c => c.arms.map(a => a.armName))))];
  const totalClassCount = overviewBranches.reduce((acc, b) => acc + b.classes.length, 0);

  const { mutate: doExport, isPending: isExporting } = useExportClassFees();

  const handleExportConfirm = ({ branchName, termLabel, className, armName }: { branchName: string; termLabel: string; className?: string; armName?: string }) => {
    const branch = branches.find((b: Branch) => b.name === branchName);
    const termObj = termOptions.find(t => t.label === termLabel);
    const classEntry = overviewBranches.flatMap(b => b.classes).find(c => c.className === className);
    const armEntry = overviewBranches.flatMap(b => b.classes.flatMap(c => c.arms)).find(a => a.armName === armName);
    doExport({ sessionId, term: termObj?.term, branchId: branch?.id, classId: classEntry?.classId, armId: armEntry?.armId });
  };

  return (
    <>
      {isLoading && <Skeleton className="bg-bg-input-soft h-100 w-full" />}

      <div>
        <FeesHeader
          title="Class Fees Overview"
          branches={branchOptions}
          branchSelected={branchSelected}
          classes={exportClassNames}
          selectedClass=""
          setSelectedClass={() => {}}
          arms={exportArmNames}
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
          onExportConfirm={handleExportConfirm}
          isExporting={isExporting}
          exportResultCount={totalClassCount}
          exportResultLabel="Classes Found"
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

      {!isLoading && overviewBranches.length === 0 && (
        <EmptyFeeState
          title="Let's set up your fees"
          description="You can add fees for one or more classes, branches and arms. We'll guide you step-by-step."
          buttonText="Add First Fee"
          url="/staff/fees/add"
        />
      )}
    </>
  );
};
