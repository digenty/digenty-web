"use client";

import { useFormik } from "formik";

import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateStockUnit } from "@/hooks/queryHooks/useStock";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { stockUnitSchema } from "@/schema/stock";

type AddProps = {
  openAdd: boolean;
  setOpenAdd: (openAdd: boolean) => void;
};

export const AddNewUnitModal = ({ openAdd, setOpenAdd }: AddProps) => {
  const isMobile = useIsMobile();
  const { mutateAsync: createUnit, isPending } = useCreateStockUnit();

  const formik = useFormik<{ name: string; description: string }>({
    initialValues: { name: "", description: "" },
    validationSchema: stockUnitSchema,
    onSubmit: async values => {
      try {
        await createUnit({ name: values.name.trim(), description: values.description.trim() });
        toast({ title: "Unit created", type: "success" });
        formik.resetForm();
        setOpenAdd(false);
      } catch (error) {
        const message = (error as { message?: string } | null)?.message ?? "Could not create unit";
        toast({ title: message, type: "error" });
      }
    },
  });

  const inputCls = (field: "name" | "description") =>
    cn(
      "bg-bg-input-soft! text-text-default rounded-md border-none text-sm",
      formik.touched[field] && formik.errors[field] && "border-border-destructive border",
    );

  const submitButton = (
    <Button
      type="button"
      onClick={() => formik.handleSubmit()}
      disabled={isPending}
      className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm"
    >
      {isPending ? <Spinner /> : "Create Unit"}
    </Button>
  );

  const body = (
    <div className="w-full px-3 py-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-text-default text-sm font-medium">
            Unit Name <span className="text-text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputCls("name")}
            placeholder="e.g. Pieces, Box, Bottle"
          />
          {formik.touched.name && formik.errors.name && <p className="text-text-destructive text-xs font-light">{formik.errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-text-default text-sm font-medium">
            Description <span className="text-text-destructive">*</span>
          </Label>
          <Input
            id="description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputCls("description")}
            placeholder="Describe the unit"
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-text-destructive text-xs font-light">{formik.errors.description}</p>
          )}
        </div>
      </div>
    </div>
  );

  return isMobile ? (
    <MobileDrawer open={openAdd} setIsOpen={setOpenAdd} title="Add New Unit">
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
    <Modal open={openAdd} setOpen={setOpenAdd} title="Add New Unit" ActionButton={submitButton}>
      {body}
    </Modal>
  );
};
