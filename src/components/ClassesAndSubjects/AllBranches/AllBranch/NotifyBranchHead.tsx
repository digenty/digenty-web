"use client";

import { toast } from "@/components/Toast";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@/components/ui/dialog";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNotifyBranchHead } from "@/hooks/queryHooks/useNotification";
import { useIsMobile } from "@/hooks/useIsMobile";
import { notifyBranchHeadSchema } from "@/schema/notification";
import { useFormik } from "formik";

type NotifyBranchHeadProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  branchHeadId: number;
};

export const NotifyBranchHead = ({ open, setOpen, branchHeadId }: NotifyBranchHeadProps) => {
  const isMobile = useIsMobile();
  const { mutate, isPending } = useNotifyBranchHead();

  const formik = useFormik<{ title: string; message: string }>({
    initialValues: { title: "", message: "" },
    validationSchema: notifyBranchHeadSchema,
    onSubmit: (values, { resetForm }) => {
      mutate(
        { receiverId: branchHeadId, title: values.title, type: "DIRECT_MESSAGE", message: values.message },
        {
          onSuccess: () => {
            toast({ title: "Notification sent", description: "Branch head has been notified.", type: "success" });
            resetForm();
            setOpen(false);
          },
          onError: error => {
            toast({ title: error.message ?? "Something went wrong", description: "Could not send notification.", type: "error" });
          },
        },
      );
    },
  });

  const handleClose = (value: boolean) => {
    if (!value) {
      formik.resetForm();
    }
    setOpen(value);
  };

  const formFields = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-text-default text-sm font-medium">
          Title <small className="text-text-destructive text-xs">*</small>
        </Label>
        <Input
          id="title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="bg-bg-input-soft! border-none text-sm font-normal text-text-muted"
          placeholder="Add title"
        />
        {formik.touched.title && formik.errors.title && (
          <p className="text-text-destructive text-xs font-light">{formik.errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-text-default text-sm font-medium">Message</Label>
        <Textarea
          id="message"
          name="message"
          value={formik.values.message}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="bg-bg-input-soft! focus-visible:border-ring focus-visible:ring-border-highlight text-text-muted flex h-18 w-full items-start rounded-md p-2 text-sm font-normal focus-visible:border-none! focus-visible:ring-2 focus-visible:ring-offset-2"
          placeholder="Add message"
        />
        {formik.touched.message && formik.errors.message && (
          <p className="text-text-destructive text-xs font-light">{formik.errors.message}</p>
        )}
      </div>
    </div>
  );

  return (
    <>
      {!isMobile ? (
        <Modal
          open={open}
          setOpen={handleClose}
          className="block"
          title="Send Notification"
          ActionButton={
            <Button
              onClick={() => formik.handleSubmit()}
              disabled={isPending || !formik.isValid || !formik.dirty}
              className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm"
            >
              {isPending && <Spinner className="text-text-white-default" />}
              Notify
            </Button>
          }
        >
          <div className="flex flex-col gap-5 px-5 py-4">
            <DialogDescription className="text-text-subtle text-sm font-normal">Add a short message</DialogDescription>
            {formFields}
          </div>
        </Modal>
      ) : (
        <MobileDrawer open={open} setIsOpen={handleClose} title="Send Notification">
          <div className="flex flex-col gap-5 px-5 py-4">
            <DialogDescription className="text-text-subtle text-sm font-normal">Add a short message</DialogDescription>
            {formFields}
          </div>

          <DrawerFooter className="border-border-default border-t">
            <div className="flex justify-between">
              <DrawerClose asChild>
                <Button className="bg-bg-state-soft text-text-subtle h-7 rounded-md! px-2 py-2 text-sm font-medium">Cancel</Button>
              </DrawerClose>

              <Button
                onClick={() => formik.handleSubmit()}
                disabled={isPending || !formik.isValid || !formik.dirty}
                className="bg-bg-state-primary text-text-white-default h-7 rounded-md! px-2 text-sm tracking-[0.1rem]"
              >
                {isPending && <Spinner className="text-text-white-default" />}
                <span>Notify</span>
              </Button>
            </div>
          </DrawerFooter>
        </MobileDrawer>
      )}
    </>
  );
};
