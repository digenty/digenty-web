"use client";

import { FolderReduce, IndeterminateCircleFill } from "@digenty/icons";
import { useMemo } from "react";

import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { OverviewCard } from "@/components/OverviewCard";
import { useGetExpenseSummary } from "@/hooks/queryHooks/useExpense";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { canViewExpenses } from "@/lib/permissions/expenses";

import { ExpenseCategoryBadge } from "./Columns";
import { ExpensesHeader } from "./ExpensesHeader";
import { ExpensesSearchAndFilter } from "./ExpensesSearchAndFilter";
import { ExpensesTable } from "./ExpensesTable";
import { ExpenseSummary, extractExpenseRecord, formatNaira } from "./types";
import { useExpenseFilters } from "./useExpenseFilters";

export const ExpensesMain = () => {
  const { filters, setFilters, page, setPage } = useExpenseFilters();

  useBreadcrumb([{ label: "Expenses", url: "/staff/expense" }]);

  const { data: summaryResp } = useGetExpenseSummary({
    branchId: filters.branchId,
    categoryId: filters.categoryId,
    termId: filters.termId,
  });

  const summary = useMemo(
    () => extractExpenseRecord<ExpenseSummary & { id?: number }>(summaryResp) ?? (summaryResp as ExpenseSummary) ?? {},
    [summaryResp],
  );

  const totalAmount = summary?.totalAmount ?? summary?.totalExpenses ?? 0;
  const expenseCount = summary?.expenseCount ?? summary?.totalCount ?? 0;

  return (
    <ModulePermissionsWrapper permissionUtility={canViewExpenses}>
      <div className="flex flex-col gap-6 p-4 md:p-8">
        <ExpensesHeader filters={filters} setFilters={setFilters} />

        <div className="grid w-full grid-cols-2 gap-3 lg:grid-cols-3">
          <OverviewCard
            title="Total Expenses"
            Icon={() => (
              <div className="bg-bg-basic-rose-subtle border-bg-basic-rose-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                <IndeterminateCircleFill fill="var(--color-icon-default)" />
              </div>
            )}
            value={formatNaira(totalAmount)}
          />

          <OverviewCard
            title="Top Spending"
            Icon={() => (
              <div className="bg-bg-basic-pink-subtle border-bg-basic-pink-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                <FolderReduce fill="var(--color-icon-default)" />
              </div>
            )}
            value={
              <span className="flex flex-wrap items-center gap-2">
                {formatNaira(summary?.topCategoryAmount ?? 0)}
                <ExpenseCategoryBadge name={summary?.topCategoryName} />
              </span>
            }
          />

          <div className="col-span-2 lg:col-span-1">
            <OverviewCard
              title={
                <>
                  <span className="md:hidden">Total Expense Records</span>
                  <span className="hidden md:inline">Expense Count</span>
                </>
              }
              Icon={() => (
                <div className="bg-bg-basic-fuchsia-subtle border-bg-basic-fuchsia-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                  <IndeterminateCircleFill fill="var(--color-icon-default)" />
                </div>
              )}
              value={String(expenseCount)}
            />
          </div>
        </div>

        <ExpensesSearchAndFilter filters={filters} setFilters={setFilters} />

        <ExpensesTable filters={filters} page={page} setPage={setPage} />
      </div>
    </ModulePermissionsWrapper>
  );
};
