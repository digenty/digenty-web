"use client";
import { toast } from "@/components/Toast";
import { Modal } from "@/components/Modal";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAddParent } from "@/hooks/queryHooks/useParent";
import { useIsMobile } from "@/hooks/useIsMobile";
import { applyConflictFieldError } from "@/lib/formErrors";
import { parentSchema } from "@/schema/parent";
import { Gender, Relationship } from "@/types";
import { useFormik } from "formik";
import { useState } from "react";
import { ProfilePicture } from "../ProfilePicture";
import { ContactInformation } from "../Parent/AddParent/ContactInformation";
import { PersonalInformation } from "../Parent/AddParent/PersonalInformation";
import { ParentInputValues } from "../types";

export const CreateParentModal = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  const isMobile = useIsMobile();
  const [avatar, setAvatar] = useState<string>();
  const { mutate, isPending } = useAddParent();

  const formik = useFormik<ParentInputValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      gender: Gender.Female,
      address: "",
      phoneNumber: "",
      secondaryPhoneNumber: "",
      nationality: "",
      stateOfOrigin: "",
      relationship: Relationship.Father,
      branchId: null,
    },
    validationSchema: parentSchema,
    onSubmit: values => {
      mutate(
        { ...values, tags: [], linkedStudents: [], image: avatar },
        {
          onSuccess: data => {
            toast({
              title: `Successfully added ${data.data.firstName} ${data.data.lastName}`,
              description: data.message,
              type: "success",
            });
            formik.resetForm();
            setAvatar(undefined);
            setOpen(false);
          },
          onError: error => {
            applyConflictFieldError(error, formik.setFieldError);
            toast({ title: error.message ?? "Something went wrong", description: "Could not add parent", type: "error" });
          },
        },
      );
    },
  });

  const isValid = Object.keys(formik.errors).length === 0 && Object.keys(formik.touched).length !== 0;

  const body = (
    <div className="px-4 md:px-6">
      <ProfilePicture setAvatar={setAvatar} />
      <PersonalInformation formik={formik} modal />
      <ContactInformation formik={formik} />
    </div>
  );

  const actionButton = (
    <Button
      onClick={() => formik.handleSubmit()}
      disabled={!isValid || isPending}
      className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7 px-2 py-1"
    >
      {isPending && <Spinner className="text-text-white-default" />}
      <span className="text-sm font-medium">Create Parent</span>
    </Button>
  );

  if (isMobile) {
    return (
      <MobileDrawer open={open} setIsOpen={setOpen} title="Create New Parent">
        {body}
        <div className="bg-bg-card border-border-default flex items-center justify-between border-t px-3 py-4">
          <Button
            onClick={() => setOpen(false)}
            variant="outline"
            className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle hover:text-text-subtle h-7 border-none px-2 py-1 text-sm font-medium"
          >
            Cancel
          </Button>
          {actionButton}
        </div>
      </MobileDrawer>
    );
  }

  return (
    <Modal open={open} setOpen={setOpen} title="Create New Parent" className="max-h-[85vh] max-w-138.5! overflow-y-auto" ActionButton={actionButton}>
      {body}
    </Modal>
  );
};
