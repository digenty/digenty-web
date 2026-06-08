"use client";

import { AlertFill } from "@digenty/icons";
import { useFormik } from "formik";

import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useCreateStockCategory, useDeleteStockCategory, useEditStockCategory } from "@/hooks/queryHooks/useStock";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { stockCategorySchema } from "@/schema/stock";

export type CategoryItem = { id: number; name: string };

type AddProps = {
  openAdd: boolean;
  setOpenAdd: (openAdd: boolean) => void;
};

type EditProps = {
  openEdit: boolean;
  setOpenEdit: (openEdit: boolean) => void;
  category: CategoryItem | null;
};

type DeleteProps = {
  openDelete: boolean;
  setOpenDelete: (openDelete: boolean) => void;
  category: CategoryItem | null;
};

export const AddNewCategoryModal = ({ openAdd, setOpenAdd }: AddProps) => {
  const isMobile = useIsMobile();
  const { mutateAsync: createCategory, isPending } = useCreateStockCategory();

  const formik = useFormik<{ name: string }>({
    initialValues: { name: "" },
    validationSchema: stockCategorySchema,
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
    <div className="w-full px-3 py-4">
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

export const EditCategoryModal = ({ openEdit, setOpenEdit, category }: EditProps) => {
  const isMobile = useIsMobile();
  const { mutateAsync: editCategory, isPending } = useEditStockCategory();

  const formik = useFormik<{ name: string }>({
    enableReinitialize: true,
    initialValues: { name: category?.name ?? "" },
    validationSchema: stockCategorySchema,
    onSubmit: async values => {
      if (!category) return;
      try {
        await editCategory({ stockCategoryId: category.id, name: values.name.trim() });
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
    <div className="w-full px-3 py-4">
      <div className="space-y-2">
        <Label className="text-text-default text-sm font-medium">
          Category Name<span className="text-text-destructive">*</span>
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

export const DeleteCategoryModal = ({ openDelete, setOpenDelete, category }: DeleteProps) => {
  const isMobile = useIsMobile();
  const { mutateAsync: deleteCategory, isPending } = useDeleteStockCategory();

  const handleDelete = async () => {
    if (!category) return;
    try {
      await deleteCategory(category.id);
      toast({ title: "Category deleted", type: "success" });
      setOpenDelete(false);
    } catch (error) {
      const message = (error as { message?: string } | null)?.message ?? "Could not delete category";
      toast({ title: message, type: "error" });
    }
  };

  const submitButton = (
    <Button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="text-text-white-default bg-bg-state-destructive hover:bg-bg-state-destructive-hover! h-7! rounded-md px-2 py-1 text-sm"
    >
      {isPending ? <Spinner /> : "Delete Stock Category"}
    </Button>
  );

  const body = (
    <div className="flex w-full flex-col gap-4 px-3 py-4">
      <div className="text-text-subtle text-sm">
        Are you sure you want to permanently delete <span className="text-text-default font-medium">{category?.name ?? "this stock category"}</span>?
        This action cannot be undone.
      </div>
      <div className="border-border-default bg-bg-basic-orange-subtle flex items-center gap-2 rounded-md border p-2">
        <AlertFill fill="var(--color-bg-basic-orange-accent)" className="size-12" />
        <div className="text-text-subtle text-sm">
          Deleting this category will remove it from your list of categories. Items currently under it will remain in stock but will lose this
          categorization.
        </div>
      </div>
    </div>
  );

  return isMobile ? (
    <MobileDrawer open={openDelete} setIsOpen={setOpenDelete} title="Delete Stock Category?">
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
    <Modal open={openDelete} setOpen={setOpenDelete} title="Delete Stock Category?" ActionButton={submitButton}>
      {body}
    </Modal>
  );
};
