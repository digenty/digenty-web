"use client";

import { Calendar, Filter, FolderReduce, School } from "@digenty/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { BranchWithClassLevels, Term } from "@/api/types";
import { DateRangePicker } from "@/components/DatePicker";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";

import { ExpenseFilters } from "./useExpenseFilters";

type Props = {
  title?: string;
  filters: ExpenseFilters;
  setFilters: (patch: Partial<ExpenseFilters>) => void;
  /** Rendered next to the title on the category detail page, where the title carries a count badge. */
  titleAdornment?: React.ReactNode;
  showCategoriesLink?: boolean;
};

export const ExpensesHeader = ({ title = "Overview", filters, setFilters, titleAdornment, showCategoriesLink = true }: Props) => {
  const router = useRouter();
  const user = useLoggedInUser();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: branchesResp } = useGetBranches();
  const branches = ((branchesResp?.data ?? []) as BranchWithClassLevels[]).map(branch => branch.branch);

  const { data: termsResp } = useGetTerms(user.schoolId);
  const terms: Term[] = termsResp?.data?.terms ?? [];
  const activeSession: string | undefined = termsResp?.data?.academicSessionName;

  const selectedBranch = branches.find(branch => branch.id === filters.branchId);
  const selectedTerm = terms.find(term => term.termId === filters.termId);

  const activeFilterCount = [filters.branchId, filters.startDate, filters.endDate].filter(Boolean).length;

  const termLabel = selectedTerm ? `${activeSession ?? ""} ${selectedTerm.term.toLowerCase()}`.trim() : "All Terms";

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex items-center gap-3">
        <h2 className="text-text-default text-xl font-semibold">{title}</h2>
        {titleAdornment}
      </div>

      <div className="flex items-center gap-2">
        {showCategoriesLink && (
          <Button
            onClick={() => router.push("/staff/expense/expense-categories")}
            className="border-border-darker text-text-default h-8! w-auto border text-sm font-medium"
          >
            <FolderReduce fill="var(--color-icon-black-muted)" className="size-4" />
            Expense Categories
          </Button>
        )}

        <div className="hidden items-center gap-2 md:flex">
          <Select
            value={filters.branchId ? String(filters.branchId) : "ALL"}
            onValueChange={value => setFilters({ branchId: value === "ALL" ? undefined : Number(value) })}
          >
            <SelectTrigger className="border-border-darker bg-bg-default! h-8! w-fit border focus-visible:ring-0">
              <School fill="var(--color-icon-default-muted)" className="size-4" />
              <span className="text-text-default text-sm font-medium">{selectedBranch?.name ?? "All Branches"}</span>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default">
              <SelectItem value="ALL" className="text-text-default text-sm font-medium">
                All Branches
              </SelectItem>
              {branches.map(branch => (
                <SelectItem key={branch.id} value={String(branch.id)} className="text-text-default text-sm font-medium">
                  {branch.name ?? `Branch ${branch.id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.termId ? String(filters.termId) : "ALL"}
            onValueChange={value => setFilters({ termId: value === "ALL" ? undefined : Number(value) })}
          >
            <SelectTrigger className="border-border-darker bg-bg-default! h-8! w-fit border focus-visible:ring-0">
              <Calendar fill="var(--color-icon-default-muted)" className="size-4" />
              <span className="text-text-default text-sm font-medium capitalize">{termLabel}</span>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default">
              <SelectItem value="ALL" className="text-text-default text-sm font-medium">
                All Terms
              </SelectItem>
              {terms.map(term => (
                <SelectItem key={term.termId} value={String(term.termId)} className="text-text-default text-sm font-medium capitalize">
                  {activeSession} {term.term.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button className="bg-bg-state-soft flex size-7 items-center justify-center rounded-md p-1.5 md:hidden" onClick={() => setIsFilterOpen(true)}>
          <Filter className="size-4" fill="var(--color-icon-default-muted)" />
        </Button>
      </div>

      <MobileDrawer open={isFilterOpen} setIsOpen={setIsFilterOpen} title="Filter">
        <div className="flex w-full flex-col gap-4 px-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <School fill="var(--color-icon-black-muted)" className="size-4" />
              <Label className="text-text-default text-sm font-medium">Branch</Label>
            </div>
            <Select
              value={filters.branchId ? String(filters.branchId) : "ALL"}
              onValueChange={value => setFilters({ branchId: value === "ALL" ? undefined : Number(value) })}
            >
              <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                <span className="text-text-default text-sm">{selectedBranch?.name ?? "All Branches"}</span>
              </SelectTrigger>
              <SelectContent className="bg-bg-default border-border-default">
                <SelectItem value="ALL" className="text-text-default text-sm">
                  All Branches
                </SelectItem>
                {branches.map(branch => (
                  <SelectItem key={branch.id} value={String(branch.id)} className="text-text-default text-sm">
                    {branch.name ?? `Branch ${branch.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-text-default text-sm font-medium">Period</Label>
            <Select
              value={filters.termId ? String(filters.termId) : "ALL"}
              onValueChange={value => setFilters({ termId: value === "ALL" ? undefined : Number(value) })}
            >
              <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                <span className="text-text-default text-sm capitalize">{selectedTerm ? termLabel : "Select Period"}</span>
              </SelectTrigger>
              <SelectContent className="bg-bg-default border-border-default">
                <SelectItem value="ALL" className="text-text-default text-sm">
                  All Terms
                </SelectItem>
                {terms.map(term => (
                  <SelectItem key={term.termId} value={String(term.termId)} className="text-text-default text-sm capitalize">
                    {activeSession} {term.term.toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <DateRangePicker
              label="From"
              date={filters.startDate ? new Date(filters.startDate) : undefined}
              setDate={date => setFilters({ startDate: date ? date.toISOString().slice(0, 10) : undefined })}
            />
            <DateRangePicker
              label="To"
              date={filters.endDate ? new Date(filters.endDate) : undefined}
              setDate={date => setFilters({ endDate: date ? date.toISOString().slice(0, 10) : undefined })}
            />
          </div>
        </div>

        <DrawerFooter className="border-border-default border-t">
          <div className="flex justify-between">
            <DrawerClose asChild>
              <Button className="bg-bg-state-soft text-text-subtle h-8 rounded-md! px-2.5 py-1 text-sm font-medium">Cancel</Button>
            </DrawerClose>

            <Button
              onClick={() => setIsFilterOpen(false)}
              className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-8 rounded-md px-2.5 py-1 text-sm"
            >
              Apply Filter
              {activeFilterCount > 0 && (
                <Badge className="bg-bg-state-primary-hover text-text-white-default ml-1 rounded-sm px-1.5 text-xs">{activeFilterCount}</Badge>
              )}
            </Button>
          </div>
        </DrawerFooter>
      </MobileDrawer>
    </div>
  );
};
