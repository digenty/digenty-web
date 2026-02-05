"use client";

import { AddFill } from "@/components/Icons/AddFill";
import DeleteBin from "@/components/Icons/DeleteBin";
import Edit from "@/components/Icons/Edit";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { AddNewCategoryModal, DeleteCategoryModal, EditCategoryModal } from "./StockCategoriesModals";

const categories = [
  {
    id: 1,
    categoryName: "SS 3 items",
    totalItems: 128,
  },
  {
    id: 2,
    categoryName: "SS 3 items",
    totalItems: 128,
  },
];

export const StockCategories = () => {
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [openEditCategory, setOpenEditCategory] = useState(false);
  const [openDeleteCategory, setOpenDeleteCategory] = useState(false);

  return (
    <>
      {openAddCategory && <AddNewCategoryModal openAdd={openAddCategory} setOpenAdd={setOpenAddCategory} />}
      {openEditCategory && <EditCategoryModal openEdit={openEditCategory} setOpenEdit={setOpenEditCategory} />}
      {openDeleteCategory && <DeleteCategoryModal openDelete={openDeleteCategory} setOpenDelete={setOpenDeleteCategory} />}
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
          <SearchInput className="bg-bg-input-soft! w-full border-none md:w-71" />

          <div className="flex flex-col gap-4">
            {categories.map(cat => (
              <div key={cat.id} className="border-border-default flex items-center justify-between rounded-md border p-3 py-2 md:px-6 md:py-4">
                <div className="flex flex-col gap-1">
                  <div className="text-text-default text-md font-medium">{cat.categoryName}</div>
                  <div className="text-text-muted text-xs">{cat.totalItems} items</div>
                </div>
                <div className="flex items-center gap-4">
                  <Button onClick={() => setOpenDeleteCategory(true)}>
                    {" "}
                    <DeleteBin fill="var(--color-icon-default)" />
                  </Button>

                  <Button onClick={() => setOpenEditCategory(true)} className="hover:bg-bg-state-secondary-hover! rounded-md p-1">
                    {" "}
                    <Edit fill="var(--color-icon-default)" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
