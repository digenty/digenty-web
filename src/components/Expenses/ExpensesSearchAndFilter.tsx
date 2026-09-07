"use client";

import { Filter, ShareBox } from "@digenty/icons";
import { Ellipsis, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { MobileDrawer } from "@/components/MobileDrawer";
import { SearchInput } from "@/components/SearchInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useGetExpenseCategories } from "@/hooks/queryHooks/useExpense";
import { useIsMobile } from "@/hooks/useIsMobile";

import { ExpenseExportModal } from "./ExpenseExportModal";
import { ExpenseCategoryItem, extractExpenseList } from "./types";
import { ExpenseFilters } from "./useExpenseFilters";

type Props = {
  filters: ExpenseFilters;
  setFilters: (patch: Partial<ExpenseFilters>) => void;
  /** The category detail page is already scoped to one category, so it hides the chip. */
  showCategoryFilter?: boolean;
};

export const ExpensesSearchAndFilter = ({ filters, setFilters, showCategoryFilter = true }: Props) => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const { data: categoriesResp } = useGetExpenseCategories(0, 100);
  const categories = useMemo(() => extractExpenseList<ExpenseCategoryItem>(categoriesResp).items, [categoriesResp]);

  const [openExport, setOpenExport] = useState(false);
  const [openActions, setOpenActions] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  const selectedCategory = categories.find(category => category.id === filters.categoryId);

  return (
    <>
      {openExport && <ExpenseExportModal open={openExport} setOpen={setOpenExport} />}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
        <div className="flex items-center gap-1">
          <SearchInput
            value={filters.search}
            onChange={evt => setFilters({ search: evt.target.value })}
            className="border-border-default w-full rounded-md border text-sm md:w-71"
            placeholder="Search"
          />

          {showCategoryFilter && (
            <DropdownMenu open={openCategory} onOpenChange={setOpenCategory}>
              <DropdownMenuTrigger asChild>
                <Badge className="border-border-darker bg-bg-state-secondary text-text-muted hidden h-8 cursor-pointer items-center rounded-full border border-dashed md:flex">
                  <Filter className="size-4" fill="var(--color-icon-default-muted)" />
                  {selectedCategory?.name ?? "Category"}
                </Badge>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-bg-card border-border-default text-text-default hidden w-48 py-2.5 shadow-sm md:block">
                <div className="flex flex-col gap-1 px-1 py-2">
                  <div
                    onClick={() => {
                      setFilters({ categoryId: undefined });
                      setOpenCategory(false);
                    }}
                    className="hover:bg-bg-state-ghost-hover flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-sm"
                  >
                    <span className="text-text-default font-normal">All Categories</span>
                  </div>
                  {categories.map(category => (
                    <div
                      key={category.id}
                      onClick={() => {
                        setFilters({ categoryId: category.id });
                        setOpenCategory(false);
                      }}
                      className="hover:bg-bg-state-ghost-hover flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-sm"
                    >
                      <span className="text-text-default font-normal">{category.name}</span>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center justify-between gap-1">
          {showCategoryFilter && (
            <Button
              onClick={() => setOpenCategory(true)}
              className="bg-bg-state-soft flex size-7 items-center justify-center rounded-md p-1.5 md:hidden"
            >
              <Filter className="size-4" fill="var(--color-icon-default-muted)" />
            </Button>
          )}

          <Button
            onClick={() => setOpenExport(true)}
            className="border-border-darker text-text-default hidden h-8 items-center rounded-md border px-2.5 text-sm font-medium md:flex"
          >
            <ShareBox fill="var(--color-icon-default-muted)" /> Export
          </Button>

          <div className="flex items-center gap-1">
            <Button
              onClick={() => router.push("/staff/expense/add-expense")}
              className="bg-bg-state-primary hover:bg-bg-state-primary/90! text-text-white-default flex h-8 items-center gap-1 rounded-md px-2.5"
            >
              <Plus className="text-texticon-white-default size-4" />
              Add Expense
            </Button>

            <Button
              onClick={() => setOpenActions(true)}
              className="bg-bg-state-soft text-text-muted flex h-7 w-7 cursor-pointer p-0! text-center focus-visible:ring-0! md:hidden"
            >
              <Ellipsis className="size-5" />
            </Button>
          </div>
        </div>

        {openActions && (
          <MobileDrawer open={openActions} setIsOpen={setOpenActions} title="Actions">
            <div className="flex w-full flex-col gap-4 px-3 py-4">
              <div
                role="button"
                onClick={() => {
                  setOpenActions(false);
                  setOpenExport(true);
                }}
                className="text-text-default hover:bg-bg-state-ghost-hover border-border-darker flex w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
              >
                <ShareBox className="size-4" fill="var(--color-icon-default-muted)" />
                Export
              </div>
            </div>
          </MobileDrawer>
        )}

        {isMobile && showCategoryFilter && (
          <MobileDrawer open={openCategory} setIsOpen={setOpenCategory} title="Filter">
            <div className="flex w-full flex-col px-4 py-2">
              <div
                role="button"
                onClick={() => setFilters({ categoryId: undefined })}
                className="text-text-default hover:bg-bg-state-ghost-hover cursor-pointer rounded-md px-3 py-3 text-sm"
              >
                All Categories
              </div>
              {categories.map(category => (
                <div
                  key={category.id}
                  role="button"
                  onClick={() => setFilters({ categoryId: category.id })}
                  className="text-text-default hover:bg-bg-state-ghost-hover cursor-pointer rounded-md px-3 py-3 text-sm"
                >
                  {category.name}
                </div>
              ))}
            </div>

            <DrawerFooter className="border-border-default border-t">
              <div className="flex justify-between">
                <DrawerClose asChild>
                  <Button className="bg-bg-state-soft text-text-subtle h-8 rounded-md! px-2.5 py-1 text-sm font-medium">Cancel</Button>
                </DrawerClose>

                <Button
                  onClick={() => setOpenCategory(false)}
                  className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-8 rounded-md px-2.5 py-1 text-sm"
                >
                  Apply
                </Button>
              </div>
            </DrawerFooter>
          </MobileDrawer>
        )}
      </div>
    </>
  );
};
