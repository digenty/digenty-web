"use client";

import { IndeterminateCircleFill } from "@digenty/icons";
import { useParams } from "next/navigation";
import { useMemo } from "react";

import { BackLink } from "@/components/BackLink";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { OverviewCard } from "@/components/OverviewCard";
import { Badge } from "@/components/ui/badge";
import { useGetExpenseCategoryById, useGetExpenseSummary } from "@/hooks/queryHooks/useExpense";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { canViewExpenses } from "@/lib/permissions/expenses";

import { ExpensesHeader } from "../ExpensesHeader";
import { ExpensesSearchAndFilter } from "../ExpensesSearchAndFilter";
import { ExpensesTable } from "../ExpensesTable";
import { ExpenseCategoryItem, ExpenseSummary, extractExpenseRecord, formatNaira } from "../types";
import { useExpenseFilters } from "../useExpenseFilters";

export const CategoryExpenses = () => {
  const params = useParams();
  const categoryId = Number(params?.id);

  const { filters, setFilters, page, setPage } = useExpenseFilters({ categoryId: categoryId || undefined });

  const { data: categoryResp } = useGetExpenseCategoryById(categoryId || undefined);
  const category = useMemo(() => extractExpenseRecord<ExpenseCategoryItem>(categoryResp), [categoryResp]);

  const { data: summaryResp } = useGetExpenseSummary({
    branchId: filters.branchId,
    termId: filters.termId,
    categoryId: categoryId || undefined,
  });
  const summary = useMemo(
    () => extractExpenseRecord<ExpenseSummary & { id?: number }>(summaryResp) ?? (summaryResp as ExpenseSummary) ?? {},
    [summaryResp],
  );

  const categoryName = category?.name ?? "Category";
  const expenseCount = summary?.expenseCount ?? summary?.totalCount ?? category?.expenseCount ?? category?.totalExpenses ?? 0;

  useBreadcrumb([
    { label: "Expenses", url: "/staff/expense" },
    { label: "Expense Categories", url: "/staff/expense/expense-categories" },
    { label: categoryName, url: "" },
  ]);

  return (
    <ModulePermissionsWrapper permissionUtility={canViewExpenses}>
      <div className="flex flex-col gap-6 p-4 md:p-8">
        <div className="md:hidden">
          <BackLink href="/staff/expense/expense-categories" />
        </div>

        <ExpensesHeader
          title={categoryName}
          filters={filters}
          setFilters={setFilters}
          showCategoriesLink={false}
          titleAdornment={
            <Badge className="border-border-default bg-bg-badge-lime text-bg-basic-lime-strong rounded-md border text-xs font-medium">
              {expenseCount} Expenses
            </Badge>
          }
        />

        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
          <OverviewCard
            title="Total Expenses"
            Icon={() => (
              <div className="bg-bg-basic-rose-subtle border-bg-basic-rose-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                <IndeterminateCircleFill fill="var(--color-icon-default)" />
              </div>
            )}
            value={formatNaira(summary?.totalAmount ?? summary?.totalExpenses ?? 0)}
          />

          <OverviewCard
            title="Expense Count"
            Icon={() => (
              <div className="bg-bg-basic-fuchsia-subtle border-bg-basic-fuchsia-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                <IndeterminateCircleFill fill="var(--color-icon-default)" />
              </div>
            )}
            value={String(expenseCount)}
          />
        </div>

        <ExpensesSearchAndFilter filters={filters} setFilters={setFilters} showCategoryFilter={false} />

        <ExpensesTable filters={filters} page={page} setPage={setPage} showCategory={false} />
      </div>
    </ModulePermissionsWrapper>
  );
};
