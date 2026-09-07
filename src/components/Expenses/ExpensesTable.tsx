"use client";

import { DeleteBin, Edit, Eye } from "@digenty/icons";
import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Avatar } from "@/components/Avatar";
import { DataTable } from "@/components/DataTable";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { PageEmptyState } from "@/components/Error/PageEmptyState";
import { MobileDrawer } from "@/components/MobileDrawer";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchExpenses } from "@/hooks/queryHooks/useExpense";

import { buildExpensesOverviewTableColumns, ExpenseCategoryBadge } from "./Columns";
import { DeleteExpenseModal } from "./DeleteExpenseModal";
import {
  expenseAddedByOf,
  expenseCategoryNameOf,
  ExpenseListItem,
  expenseTitleOf,
  extractExpenseList,
  formatExpenseDate,
  formatNaira,
} from "./types";
import { ExpenseFilters } from "./useExpenseFilters";

const PAGE_SIZE = 15;

type Props = {
  filters: ExpenseFilters;
  page: number;
  setPage: (page: number) => void;
  showCategory?: boolean;
  showBranch?: boolean;
};

export const ExpensesTable = ({ filters, page, setPage, showCategory = true, showBranch = true }: Props) => {
  const router = useRouter();

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [, setSelectedRows] = useState<ExpenseListItem[]>([]);
  const [drawerExpense, setDrawerExpense] = useState<ExpenseListItem | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<ExpenseListItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(3);

  const query = useSearchExpenses({
    branchId: filters.branchId,
    categoryId: filters.categoryId,
    termId: filters.termId,
    search: filters.search,
    startDate: filters.startDate,
    endDate: filters.endDate,
    page: page - 1,
    size: PAGE_SIZE,
  });

  const { items, total } = useMemo(() => extractExpenseList<ExpenseListItem>(query.data), [query.data]);

  const errorMessage = (query.error as { message?: string } | null)?.message ?? "Could not load expenses";

  useEffect(() => {
    if (query.isError) {
      toast({ title: errorMessage, type: "error" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.isError]);

  const goToDetail = (id: number) => router.push(`/staff/expense/${id}`);
  const goToEdit = (id: number) => router.push(`/staff/expense/add-expense?id=${id}`);

  const columns = useMemo(
    () =>
      buildExpensesOverviewTableColumns({
        onView: row => goToDetail(row.original.id),
        onEdit: row => goToEdit(row.original.id),
        onDelete: row => setExpenseToDelete(row.original),
        showCategory,
        showBranch,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, showCategory, showBranch],
  );

  return (
    <div>
      {expenseToDelete && (
        <DeleteExpenseModal
          open={!!expenseToDelete}
          setOpen={open => !open && setExpenseToDelete(null)}
          expense={expenseToDelete}
          onDeleted={() => setExpenseToDelete(null)}
        />
      )}

      {query.isLoading && <Skeleton className="bg-bg-input-soft! h-100 w-full" />}

      {!query.isLoading && query.isError && (
        <div className="flex justify-center py-12">
          <ErrorComponent title="Couldn't load expenses" description={errorMessage} buttonText="Retry" onClick={() => query.refetch()} />
        </div>
      )}

      {!query.isLoading && !query.isError && items.length === 0 && (
        <PageEmptyState
          title="No expenses found"
          description="Try adjusting your search or filter to find what you're looking for."
          buttonText="Add expense"
          url="/staff/expense/add-expense"
        />
      )}

      {!query.isLoading && !query.isError && items.length > 0 && (
        <>
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={items}
              totalCount={total}
              page={page}
              setCurrentPage={setPage}
              pageSize={PAGE_SIZE}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              onSelectRows={setSelectedRows}
              clickHandler={row => goToDetail(row.original.id)}
            />
          </div>

          <div className="flex flex-col gap-4 md:hidden">
            {items.slice(0, visibleCount).map(expense => {
              const addedBy = expenseAddedByOf(expense);
              return (
                <div key={expense.id} className="border-border-default bg-bg-subtle rounded-md border">
                  <MobileDrawer open={drawerExpense?.id === expense.id} setIsOpen={open => setDrawerExpense(open ? expense : null)} title="Actions">
                    <div className="flex w-full flex-col gap-4 px-3 py-4">
                      <div className="flex flex-col items-center gap-2">
                        <div
                          role="button"
                          onClick={() => goToDetail(expense.id)}
                          className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
                        >
                          <Eye className="size-4" fill="var(--color-icon-default-subtle)" /> View expense
                        </div>
                        <div
                          role="button"
                          onClick={() => goToEdit(expense.id)}
                          className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
                        >
                          <Edit fill="var(--color-icon-default-subtle)" className="size-4" /> Edit expense
                        </div>
                        <div
                          role="button"
                          onClick={() => {
                            setExpenseToDelete(expense);
                            setDrawerExpense(null);
                          }}
                          className="text-text-destructive hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
                        >
                          <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
                          <span>Delete expense</span>
                        </div>
                      </div>
                    </div>
                  </MobileDrawer>

                  <div className="border-border-default flex items-center justify-between border-b px-3 py-1 text-sm">
                    <span className="text-text-default text-sm font-medium">{expenseTitleOf(expense)}</span>
                    <Button onClick={() => setDrawerExpense(expense)} className="text-text-muted cursor-pointer p-0! focus-visible:ring-0!">
                      <Ellipsis className="size-5" />
                    </Button>
                  </div>

                  {showCategory && (
                    <div className="border-border-default flex items-center justify-between border-b px-3 py-2 text-sm">
                      <span className="text-text-muted font-medium">Category</span>
                      <ExpenseCategoryBadge name={expenseCategoryNameOf(expense)} />
                    </div>
                  )}

                  <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                    <span className="text-text-muted font-medium">Date</span>
                    <span className="text-text-default text-sm font-medium">{formatExpenseDate(expense.date)}</span>
                  </div>

                  <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                    <span className="text-text-muted font-medium">Amount</span>
                    <span className="text-text-default text-sm font-medium">{formatNaira(expense.amount)}</span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 text-sm">
                    <span className="text-text-muted font-medium">Added by</span>
                    <span className="flex items-center gap-1.5">
                      <Avatar url={addedBy.imagePath} className="size-5" />
                      <span className="text-text-default text-sm font-medium">{addedBy.name || "-"}</span>
                    </span>
                  </div>
                </div>
              );
            })}

            {visibleCount < items.length && (
              <Button
                onClick={() => setVisibleCount(items.length)}
                className="bg-bg-state-soft text-text-subtle mx-auto my-2 flex w-39 items-center justify-center rounded-md"
              >
                Load More
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
