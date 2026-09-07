"use client";

import { ShareBox } from "@digenty/icons";
import { useMemo, useState } from "react";

import { BranchWithClassLevels, Term } from "@/api/types";
import { DateRangePicker } from "@/components/DatePicker";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { toast } from "@/components/Toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetExpenseCategories, useSearchExpenses } from "@/hooks/queryHooks/useExpense";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { exportToCSV } from "@/lib/export-utils";

import { payMethod } from "../Invoices/paymentMethods";
import {
  expenseAddedByOf,
  expenseBranchNameOf,
  ExpenseCategoryItem,
  expenseCategoryNameOf,
  ExpenseListItem,
  expenseTitleOf,
  extractExpenseList,
  formatExpenseDate,
} from "./types";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const toIsoDate = (date?: Date) => (date ? date.toISOString().slice(0, 10) : undefined);

export const ExpenseExportModal = ({ open, setOpen }: Props) => {
  const isMobile = useIsMobile();
  const user = useLoggedInUser();

  const { data: branchesResp } = useGetBranches();
  const branches = ((branchesResp?.data ?? []) as BranchWithClassLevels[]).map(branch => branch.branch);

  const { data: categoriesResp } = useGetExpenseCategories(0, 100);
  const categories = useMemo(() => extractExpenseList<ExpenseCategoryItem>(categoriesResp).items, [categoriesResp]);

  const { data: termsResp } = useGetTerms(user.schoolId);
  const terms: Term[] = termsResp?.data?.terms ?? [];
  const activeSession: string | undefined = termsResp?.data?.academicSessionName;

  const [branchId, setBranchId] = useState<number | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [termId, setTermId] = useState<number | undefined>(undefined);
  const [from, setFrom] = useState<Date | undefined>(undefined);
  const [to, setTo] = useState<Date | undefined>(undefined);

  // A large page size stands in for "everything matching the filters" — the export is one file.
  const query = useSearchExpenses({
    branchId,
    categoryId,
    termId,
    search: "",
    startDate: toIsoDate(from),
    endDate: toIsoDate(to),
    page: 0,
    size: 1000,
  });

  const expenses = useMemo(() => extractExpenseList<ExpenseListItem>(query.data).items, [query.data]);

  const selectedBranch = branches.find(branch => branch.id === branchId);
  const selectedCategory = categories.find(category => category.id === categoryId);
  const selectedTerm = terms.find(term => term.termId === termId);

  const handleExport = () => {
    if (expenses.length === 0) {
      toast({ title: "No expenses to export", type: "warning" });
      return;
    }
    const headers = ["S/N", "Expense Title", "Category", "Date", "Amount (₦)", "Payment Method", "Added By", "Branch"];
    const rows = expenses.map((expense, index) => [
      index + 1,
      expenseTitleOf(expense) || "-",
      expenseCategoryNameOf(expense) || "-",
      formatExpenseDate(expense.date),
      Number(expense.amount ?? 0).toLocaleString(),
      payMethod.find(method => method.value === expense.paymentMethod)?.label ?? "-",
      expenseAddedByOf(expense).name || "-",
      expenseBranchNameOf(expense) || "-",
    ]);
    const branchSlug = selectedBranch?.name?.replaceAll(" ", "_") ?? "All_Branches";
    exportToCSV(`Expenses_${branchSlug}_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    toast({ title: "Export started", type: "success" });
    setOpen(false);
  };

  const exportButton = (
    <Button
      type="button"
      onClick={handleExport}
      disabled={query.isFetching || expenses.length === 0}
      className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm"
    >
      <ShareBox fill="var(--color-icon-white-default)" /> Export Expenses
    </Button>
  );

  const body = (
    <div className="flex w-full flex-col gap-4 px-3 py-4 md:px-6">
      <h2 className="text-text-default text-sm font-bold">Filter Selection</h2>

      <div className="space-y-2">
        <Label className="text-text-default text-sm font-medium">Branch</Label>
        <Select value={branchId ? String(branchId) : "ALL"} onValueChange={value => setBranchId(value === "ALL" ? undefined : Number(value))}>
          <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
            <SelectValue>
              <span className="text-text-default text-sm">{selectedBranch?.name ?? "Select Branch"}</span>
            </SelectValue>
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
        <Label className="text-text-default text-sm font-medium">Category</Label>
        <Select value={categoryId ? String(categoryId) : "ALL"} onValueChange={value => setCategoryId(value === "ALL" ? undefined : Number(value))}>
          <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
            <SelectValue>
              <span className="text-text-default text-sm">{selectedCategory?.name ?? "Select Category"}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-default border-border-default">
            <SelectItem value="ALL" className="text-text-default text-sm">
              All Categories
            </SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={String(category.id)} className="text-text-default text-sm">
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-text-default text-sm font-medium">Period</Label>
        <Select value={termId ? String(termId) : "ALL"} onValueChange={value => setTermId(value === "ALL" ? undefined : Number(value))}>
          <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
            <SelectValue>
              <span className="text-text-default text-sm capitalize">
                {selectedTerm ? `${activeSession ?? ""} ${selectedTerm.term.toLowerCase()}`.trim() : "Select Period"}
              </span>
            </SelectValue>
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

      <div className="grid grid-cols-2 gap-4">
        <DateRangePicker label="From" date={from} setDate={setFrom} />
        <DateRangePicker label="To" date={to} setDate={setTo} />
      </div>

      <Badge className="border-border-default bg-bg-badge-green text-bg-basic-green-strong flex w-fit items-center rounded-sm p-0.5">
        {query.isFetching ? "Loading..." : `${expenses.length} Expenses Found`}
      </Badge>
    </div>
  );

  return isMobile ? (
    <MobileDrawer open={open} setIsOpen={setOpen} title="Export Expenses">
      {body}
      <DrawerFooter className="border-border-default border-t">
        <div className="flex justify-between">
          <DrawerClose asChild>
            <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-2 py-1 text-sm font-medium">Cancel</Button>
          </DrawerClose>
          {exportButton}
        </div>
      </DrawerFooter>
    </MobileDrawer>
  ) : (
    <Modal
      open={open}
      setOpen={setOpen}
      title={
        <span className="flex items-center gap-2">
          <span className="bg-bg-state-soft flex size-8 items-center justify-center rounded-full">
            <ShareBox fill="var(--color-icon-default-subtle)" className="size-4" />
          </span>
          <span>Export Expenses</span>
        </span>
      }
      ActionButton={exportButton}
    >
      {body}
    </Modal>
  );
};
