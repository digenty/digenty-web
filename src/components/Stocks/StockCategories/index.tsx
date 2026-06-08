"use client";

import { AddFill, DeleteBin, Edit } from "@digenty/icons";
import { useMemo, useState } from "react";

import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGetStockCategories } from "@/hooks/queryHooks/useStock";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

import { AddNewCategoryModal, CategoryItem, DeleteCategoryModal, EditCategoryModal } from "./StockCategoriesModals";

export const StockCategories = () => {
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);
  const [search, setSearch] = useState("");

  useBreadcrumb([
    { label: "Stock", url: "/staff/stock" },
    { label: "Categories", url: "/staff/stock/stock-categories" },
  ]);

  const { data, isLoading } = useGetStockCategories(0, 100);

  type ApiCategory = { id: number; name: string; itemCount?: number; totalItems?: number };
  const categories = useMemo<ApiCategory[]>(() => {
    const list: unknown = data?.content ?? data?.data?.content ?? data?.data ?? data;
    return Array.isArray(list) ? (list as ApiCategory[]) : [];
  }, [data]);

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    return categories.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()));
  }, [categories, search]);

  return (
    <>
      {openAddCategory && <AddNewCategoryModal openAdd={openAddCategory} setOpenAdd={setOpenAddCategory} />}
      {editingCategory && (
        <EditCategoryModal openEdit={!!editingCategory} setOpenEdit={open => !open && setEditingCategory(null)} category={editingCategory} />
      )}
      {deletingCategory && (
        <DeleteCategoryModal openDelete={!!deletingCategory} setOpenDelete={open => !open && setDeletingCategory(null)} category={deletingCategory} />
      )}

      <div className="mx-auto flex w-full items-center justify-center p-4 md:max-w-169">
        <div className="flex w-full flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="text-text-default text-xl font-semibold">Categories</div>
            <Button
              onClick={() => setOpenAddCategory(true)}
              className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary-hover! h-8! text-sm"
            >
              <AddFill fill="var(--color-icon-white-default)" /> Add Category
            </Button>
          </div>
          <SearchInput
            value={search}
            onChange={evt => setSearch(evt.target.value)}
            className="bg-bg-input-soft! w-full border-none md:w-71"
            placeholder="Search categories"
          />

          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Spinner className="size-8" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-text-muted py-6 text-center text-sm">No categories found</div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map(cat => (
                <div key={cat.id} className="border-border-default flex items-center justify-between rounded-md border p-3 py-2 md:px-6 md:py-4">
                  <div className="flex flex-col gap-1">
                    <div className="text-text-default text-md font-medium">{cat.name}</div>
                    {typeof (cat.itemCount ?? cat.totalItems) === "number" && (
                      <div className="text-text-muted text-xs">{cat.itemCount ?? cat.totalItems} items</div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <Button onClick={() => setDeletingCategory({ id: cat.id, name: cat.name })}>
                      <DeleteBin fill="var(--color-icon-default)" />
                    </Button>

                    <Button
                      onClick={() => setEditingCategory({ id: cat.id, name: cat.name })}
                      className="hover:bg-bg-state-secondary-hover! rounded-md p-1"
                    >
                      <Edit fill="var(--color-icon-default)" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
