"use client";

import { DeleteBin, Edit } from "@digenty/icons";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { BackLink } from "@/components/BackLink";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGetExpenseCategories } from "@/hooks/queryHooks/useExpense";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { canViewExpenses } from "@/lib/permissions/expenses";

import { ExpenseCategoryItem, extractExpenseList } from "../types";
import { AddExpenseCategoryModal, DeleteExpenseCategoryModal, EditExpenseCategoryModal } from "./ExpenseCategoriesModals";

export const ExpenseCategories = () => {
  const router = useRouter();
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategoryItem | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<ExpenseCategoryItem | null>(null);
  const [search, setSearch] = useState("");

  useBreadcrumb([
    { label: "Expenses", url: "/staff/expense" },
    { label: "Expense Categories", url: "/staff/expense/expense-categories" },
  ]);

  const { data, isLoading } = useGetExpenseCategories(0, 100);

  const categories = useMemo(() => extractExpenseList<ExpenseCategoryItem>(data).items, [data]);

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    return categories.filter(category => category.name?.toLowerCase().includes(search.toLowerCase()));
  }, [categories, search]);

  return (
    <ModulePermissionsWrapper permissionUtility={canViewExpenses}>
      {openAddCategory && <AddExpenseCategoryModal openAdd={openAddCategory} setOpenAdd={setOpenAddCategory} />}
      {editingCategory && (
        <EditExpenseCategoryModal openEdit={!!editingCategory} setOpenEdit={open => !open && setEditingCategory(null)} category={editingCategory} />
      )}
      {deletingCategory && (
        <DeleteExpenseCategoryModal
          openDelete={!!deletingCategory}
          setOpenDelete={open => !open && setDeletingCategory(null)}
          category={deletingCategory}
        />
      )}

      <div className="mx-auto flex w-full items-center justify-center p-4 md:max-w-169 md:py-8">
        <div className="flex w-full flex-col gap-6">
          <div className="md:hidden">
            <BackLink href="/staff/expense" />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-text-default text-xl font-semibold">Categories</div>
            <Button
              onClick={() => setOpenAddCategory(true)}
              className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary-hover! h-8! gap-1 text-sm"
            >
              <Plus className="text-texticon-white-default size-4" /> Add Category
            </Button>
          </div>

          <SearchInput
            value={search}
            onChange={evt => setSearch(evt.target.value)}
            className="bg-bg-input-soft! w-full border-none md:w-71"
            placeholder="Search"
          />

          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Spinner className="size-8" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-text-muted py-6 text-center text-sm">No categories found</div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map(category => {
                const count = category.expenseCount ?? category.totalExpenses;
                return (
                  <div
                    key={category.id}
                    role="button"
                    onClick={() => router.push(`/staff/expense/expense-categories/${category.id}`)}
                    className="border-border-default hover:bg-bg-state-ghost-hover flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 transition-colors md:px-6 md:py-4"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="text-text-default text-md font-medium">{category.name}</div>
                      {typeof count === "number" && <div className="text-text-muted text-xs">{count} Expenses</div>}
                    </div>

                    <div className="flex items-center gap-4">
                      <Button
                        onClick={evt => {
                          evt.stopPropagation();
                          setDeletingCategory(category);
                        }}
                        className="hover:bg-bg-state-secondary-hover! rounded-md p-1"
                      >
                        <DeleteBin fill="var(--color-icon-default)" />
                      </Button>

                      <Button
                        onClick={evt => {
                          evt.stopPropagation();
                          setEditingCategory(category);
                        }}
                        className="hover:bg-bg-state-secondary-hover! rounded-md p-1"
                      >
                        <Edit fill="var(--color-icon-default)" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ModulePermissionsWrapper>
  );
};
