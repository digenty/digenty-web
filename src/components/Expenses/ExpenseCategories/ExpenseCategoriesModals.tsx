"use client";

import { AlertFill } from "@digenty/icons";
import { useFormik } from "formik";
import { useState } from "react";

import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useCreateExpenseCategory, useDeleteExpenseCategory, useEditExpenseCategory } from "@/hooks/queryHooks/useExpense";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { expenseCategorySchema } from "@/schema/expense";

import { ExpenseCategoryItem } from "../types";

type AddProps = {
  openAdd: boolean;
  setOpenAdd: (openAdd: boolean) => void;
};

type EditProps = {
  openEdit: boolean;
  setOpenEdit: (openEdit: boolean) => void;
  category: ExpenseCategoryItem | null;
};

type DeleteProps = {
  openDelete: boolean;
  setOpenDelete: (openDelete: boolean) => void;
  category: ExpenseCategoryItem | null;
  onDeleted?: () => void;
};

export const AddExpenseCategoryModal = ({ openAdd, setOpenAdd }: AddProps) => {
  const isMobile = useIsMobile();
  const { mutateAsync: createCategory, isPending } = useCreateExpenseCategory();

  const formik = useFormik<{ name: string }>({
    initialValues: { name: "" },
    validationSchema: expenseCategorySchema,
    onSubmit: async values => {
      try {
        await createCategory({ name: values.name.trim() });
        toast({ title: "Category created", type: "success" });
        formik.resetForm();
        setOpenAdd(false);
      } catch (error) {
        const message = (error as { message?: string } | null)?.message ?? "Could not create category";
        toast({ title: message, type: "error" });
      }
    },
  });

  const inputClassName = cn(
    "bg-bg-input-soft! text-text-default rounded-md border-none text-sm",
    formik.touched.name && formik.errors.name && "border-border-destructive border",
  );

  const submitButton = (
    <Button
      type="button"
      onClick={() => formik.handleSubmit()}
      disabled={isPending}
      className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm"
    >
      {isPending ? <Spinner /> : "Create Category"}
    </Button>
  );

  const body = (
    <div className="w-full px-4 py-5 md:px-6">
      <div className="space-y-2">
        <Label className="text-text-default text-sm font-medium">
          Category Name <span className="text-text-destructive">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={inputClassName}
          placeholder="Input category name"
        />
        {formik.touched.name && formik.errors.name && <p className="text-text-destructive text-xs font-light">{formik.errors.name}</p>}
      </div>
    </div>
  );

  return isMobile ? (
    <MobileDrawer open={openAdd} setIsOpen={setOpenAdd} title="Add New Category">
      {body}
      <DrawerFooter className="border-border-default border-t">
        <div className="flex justify-between">
          <DrawerClose asChild>
            <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-2 py-1 text-sm font-medium">Cancel</Button>
          </DrawerClose>
          {submitButton}
        </div>
      </DrawerFooter>
    </MobileDrawer>
  ) : (
    <Modal open={openAdd} setOpen={setOpenAdd} title="Add New Category" ActionButton={submitButton}>
      {body}
    </Modal>
  );
};

export const EditExpenseCategoryModal = ({ openEdit, setOpenEdit, category }: EditProps) => {
  const isMobile = useIsMobile();
  const { mutateAsync: editCategory, isPending } = useEditExpenseCategory();

  const formik = useFormik<{ name: string }>({
    enableReinitialize: true,
    initialValues: { name: category?.name ?? "" },
    validationSchema: expenseCategorySchema,
    onSubmit: async values => {
      if (!category) return;
      try {
        await editCategory({ expenseCategoryId: category.id, name: values.name.trim() });
        toast({ title: "Category updated", type: "success" });
        setOpenEdit(false);
      } catch (error) {
        const message = (error as { message?: string } | null)?.message ?? "Could not update category";
        toast({ title: message, type: "error" });
      }
    },
  });

  const inputClassName = cn(
    "bg-bg-input-soft! text-text-default rounded-md border-none text-sm",
    formik.touched.name && formik.errors.name && "border-border-destructive border",
  );

  const submitButton = (
    <Button
      type="button"
      onClick={() => formik.handleSubmit()}
      disabled={isPending}
      className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm"
    >
      {isPending ? <Spinner /> : "Done"}
    </Button>
  );

  const body = (
    <div className="w-full px-4 py-5 md:px-6">
      <div className="space-y-2">
        <Label className="text-text-default text-sm font-medium">
          Category Name <span className="text-text-destructive">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={inputClassName}
        />
        {formik.touched.name && formik.errors.name && <p className="text-text-destructive text-xs font-light">{formik.errors.name}</p>}
      </div>
    </div>
  );

  return isMobile ? (
    <MobileDrawer open={openEdit} setIsOpen={setOpenEdit} title="Edit Category">
      {body}
      <DrawerFooter className="border-border-default border-t">
        <div className="flex justify-between">
          <DrawerClose asChild>
            <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-2 py-1 text-sm font-medium">Cancel</Button>
          </DrawerClose>
          {submitButton}
        </div>
      </DrawerFooter>
    </MobileDrawer>
  ) : (
    <Modal open={openEdit} setOpen={setOpenEdit} title="Edit Category" ActionButton={submitButton}>
      {body}
    </Modal>
  );
};

export const DeleteExpenseCategoryModal = ({ openDelete, setOpenDelete, category, onDeleted }: DeleteProps) => {
  const isMobile = useIsMobile();
  const [acknowledged, setAcknowledged] = useState(false);
  const { mutateAsync: removeCategory, isPending } = useDeleteExpenseCategory();

  const handleDelete = async () => {
    if (!category) return;
    try {
      await removeCategory(category.id);
      toast({ title: "Category deleted", type: "success" });
      setOpenDelete(false);
      onDeleted?.();
    } catch (error) {
      const message = (error as { message?: string } | null)?.message ?? "Could not delete category";
      toast({ title: message, type: "error" });
    }
  };

  const submitButton = (
    <Button
      type="button"
      onClick={handleDelete}
      disabled={isPending || !acknowledged}
      className="text-text-white-default bg-bg-state-destructive hover:bg-bg-state-destructive-hover! h-7! rounded-md px-2 py-1 text-sm disabled:opacity-50"
    >
      {isPending ? <Spinner /> : "Delete Expense Category"}
    </Button>
  );

  const body = (
    <div className="flex w-full flex-col gap-5 px-4 py-5 md:px-6">
      <p className="text-text-subtle text-sm">
        Are you sure you want to permanently delete{" "}
        {category?.name ? <span className="text-text-default font-medium">{category.name}</span> : "this expense category"}? This action cannot be
        undone.
      </p>

      <div className="border-border-default bg-bg-basic-orange-subtle flex items-start gap-3 rounded-md border p-3">
        <AlertFill fill="var(--color-bg-basic-orange-accent)" className="mt-0.5 size-6 shrink-0" />
        <p className="text-text-subtle text-sm">
          Deleting this category will remove it from your list. Existing expenses will stay recorded but uncategorized, and it will no longer be
          available for future use.
        </p>
      </div>

      <label className="flex cursor-pointer items-start gap-3">
        <Checkbox
          checked={acknowledged}
          onCheckedChange={(value: boolean) => setAcknowledged(!!value)}
          aria-label="Acknowledge permanent deletion"
          className="mt-0.5"
        />
        <span className="text-text-subtle text-sm">I understand that deleting this category is permanent and cannot be undone.</span>
      </label>
    </div>
  );

  return isMobile ? (
    <MobileDrawer open={openDelete} setIsOpen={setOpenDelete} title="Delete Expense Category?">
      {body}
      <DrawerFooter className="border-border-default border-t">
        <div className="flex justify-between">
          <DrawerClose asChild>
            <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-2 py-1 text-sm font-medium">Cancel</Button>
          </DrawerClose>
          {submitButton}
        </div>
      </DrawerFooter>
    </MobileDrawer>
  ) : (
    <Modal open={openDelete} setOpen={setOpenDelete} title="Delete Expense Category?" ActionButton={submitButton}>
      {body}
    </Modal>
  );
};
