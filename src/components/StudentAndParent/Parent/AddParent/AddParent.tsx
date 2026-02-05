"use client";
import { toast } from "@/components/Toast";
import { Spinner } from "@/components/ui/spinner";
import { useAddParent } from "@/hooks/queryHooks/useParent";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { parentSchema } from "@/schema/parent";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../../../ui/button";
import { Tags } from "../../StudentMutation/Tags";
import { ParentInputValues } from "../../types";
import { ContactInformation } from "./ContactInformation";
import { LinkedStudents } from "./LinkedStudents";
import { LinkStudents } from "./LinkStudents";
import { PersonalInformation } from "./PersonalInformation";
import { ProfilePicture } from "./ProfilePicture";

export const AddParent = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<{ id: number; name: string; avatar: string | null }[]>([]);

  const [avatar, setAvatar] = useState<File | null>(null);
  const [step, setStep] = useState(1);

  useBreadcrumb([
    { label: "Student & Parent Record", url: "/student-and-parent-record" },
    { label: "Parents", url: "/student-and-parent-record?tab=Parents" },
    { label: "Add Parent", url: "" },
  ]);

  const { mutate, isPending } = useAddParent();

  const formik = useFormik<ParentInputValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      gender: null,
      address: "",
      phoneNumber: "",
      secondaryPhoneNumber: "",
      nationality: "",
      stateOfOrigin: "",
      relationship: null,
      branchId: null,
    },
    validationSchema: parentSchema,
    onSubmit: values => {
      mutate(
        {
          ...values,
          tags,
          linkedStudents: selectedStudents.map(student => student.id),
          // image: avatar,
          image: null,
        },
        {
          onSuccess: data => {
            toast({
              title: `Successfully added ${data.data.firstName} ${data.data.lastName}`,
              description: data.message,
              type: "success",
            });
            router.back();
          },
          onError: error => {
            toast({
              title: error.message ?? "Something went wrong",
              description: "Could not add parent",
              type: "error",
            });
          },
        },
      );
    },
  });

  const handleSteps = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      formik.handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    } else {
      router.back();
    }
  };

  const isValid = Object.keys(formik.errors).length === 0 && Object.keys(formik.touched).length !== 0;

  return (
    <div className="flex h-screen flex-col">
      {open && <LinkStudents selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents} open={open} setOpen={setOpen} />}

      <div className="border-border-default bg-bg-card-subtle flex justify-between border-b px-4 py-3 md:px-30 xl:px-70">
        <h1 className="text-text-default text-base font-semibold">
          Add <span className="hidden md:inline">New</span> Parent
        </h1>
        <div className="bg-bg-badge-default text-text-subtle border-border-default flex h-6 w-8.5 items-center justify-center rounded-md border p-1 text-sm md:hidden">
          {step}/3
        </div>
      </div>

      <form noValidate onSubmit={formik.handleSubmit} className="text-text-default flex-1 overflow-y-auto px-4 pt-4 md:px-30 md:pt-8 xl:px-70">
        <div className="block md:hidden">
          {step === 1 && (
            <div>
              <ProfilePicture setAvatar={setAvatar} />
              <PersonalInformation formik={formik} />
            </div>
          )}

          {step === 2 && <ContactInformation formik={formik} />}

          {/* Tags */}
          {step === 3 && <Tags tags={tags} setTags={setTags} />}

          {/* Linked Parents */}
          {step === 3 && <LinkedStudents setOpen={setOpen} setSelectedStudents={setSelectedStudents} selectedStudents={selectedStudents} />}
        </div>

        <div className="hidden md:block">
          <ProfilePicture setAvatar={setAvatar} />
          <PersonalInformation formik={formik} />
          <ContactInformation formik={formik} />
          <Tags tags={tags} setTags={setTags} />
          <LinkedStudents setOpen={setOpen} selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents} />
        </div>
      </form>
      <div className="border-border-default bg-bg-default sticky bottom-0 w-full border-t px-4 py-3 md:px-30 xl:px-70">
        <div className="flex items-center justify-between gap-2">
          <Button onClick={() => handleBack()} className="bg-bg-state-soft text-text-subtle hover:bg-bg-state-soft-hover! h-7! text-sm">
            {step > 1 ? "Back" : "Cancel"}
          </Button>
          <Button
            onClick={() => formik.handleSubmit()}
            disabled={!isValid}
            className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default hidden h-7! md:flex"
          >
            {isPending && <Spinner className="text-text-white-default" />}
            Add Parent
          </Button>

          <Button
            onClick={() => handleSteps()}
            disabled={!isValid && step === 3}
            className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default flex h-7! md:hidden"
          >
            {isPending && <Spinner className="text-text-white-default" />}
            {step === 3 ? "Add Parent" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};
