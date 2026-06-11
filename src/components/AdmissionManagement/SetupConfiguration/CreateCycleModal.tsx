"use client";

import { DateRangePicker } from "@/components/DatePicker";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/useIsMobile";
import { AdmissonNewCycleSchema } from "@/schema/admission";
import { useFormik } from "formik";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  onSuccess?: () => void;
}

export const CreateCycleModal = ({ open, setOpen, onSuccess }: Props) => {
  const isMobile = useIsMobile();

  const formik = useFormik({
    initialValues: {
      name: "",
      startDate: undefined as Date | undefined,
      endDate: undefined as Date | undefined,
    },
    validationSchema: AdmissonNewCycleSchema,
    onSubmit: (_values, { resetForm }) => {
      resetForm();
      setOpen(false);
      onSuccess?.();
    },
  });

  const handleOpenChange = (val: boolean) => {
    if (!val) formik.resetForm();
    setOpen(val);
  };

  const formFields = (
    <div className="flex flex-col gap-5 p-4">
      <div className="flex flex-col gap-1.5">
        <Label className="text-text-default text-sm font-medium">
          Cycle Name <span className="text-text-destructive">*</span>
        </Label>
        <Input
          name="name"
          placeholder="e.g., 2026-2027 Admissions"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="bg-bg-input-soft! border-none text-sm shadow-none"
        />
        {formik.touched.name && formik.errors.name && <p className="text-text-destructive text-xs">{formik.errors.name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-text-default text-sm font-medium">
            Start Date <span className="text-text-destructive">*</span>
          </Label>
          <DateRangePicker
            date={formik.values.startDate}
            setDate={val => {
              formik.setFieldValue("startDate", val);
              formik.setFieldTouched("startDate", true);
            }}
          />
          {formik.touched.startDate && formik.errors.startDate && <p className="text-text-destructive text-xs">{String(formik.errors.startDate)}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-text-default text-sm font-medium">
            End Date <span className="text-text-destructive">*</span>
          </Label>
          <DateRangePicker
            date={formik.values.endDate}
            setDate={val => {
              formik.setFieldValue("endDate", val);
              formik.setFieldTouched("endDate", true);
            }}
            disabled={formik.values.startDate ? { before: formik.values.startDate } : undefined}
          />
          {formik.touched.endDate && formik.errors.endDate && <p className="text-text-destructive text-xs">{String(formik.errors.endDate)}</p>}
        </div>
      </div>
    </div>
  );

  const submitButton = (
    <Button
      onClick={() => formik.handleSubmit()}
      className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default rounded-md px-4 py-2 text-sm font-medium"
    >
      Add Admission Cycle
    </Button>
  );

  const cancelButton = (
    <Button
      variant="outline"
      onClick={() => handleOpenChange(false)}
      className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle hover:text-text-subtle! h-7 border-none px-2 py-1 text-sm font-medium"
    >
      Cancel
    </Button>
  );

  if (isMobile) {
    return (
      <MobileDrawer open={open} setIsOpen={handleOpenChange} title="New Cycle Details">
        {formFields}
        <div className="border-border-default flex items-center justify-between border-t p-4">
          {cancelButton}
          {submitButton}
        </div>
      </MobileDrawer>
    );
  }

  return (
    <Modal open={open} setOpen={handleOpenChange} title="New Cycle Details" ActionButton={submitButton} cancelButton={cancelButton}>
      {formFields}
    </Modal>
  );
};
