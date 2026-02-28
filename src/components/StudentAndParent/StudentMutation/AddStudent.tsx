"use client";
import { toast } from "@/components/Toast";
import { Spinner } from "@/components/ui/spinner";
import { useAddStudent } from "@/hooks/queryHooks/useStudent";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { studentSchema } from "@/schema/student";
import { AdmissionStatus, BoardingStatus, Gender } from "@/types";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../../ui/button";
import { StudentInputValues } from "../types";
import { AcademicInformation } from "./AcademicInformation";
import { ContactInformation } from "./ContactInformation";
import { LinkedParents } from "./LinkedParents";
import { LinkParents } from "./LinkParents";
import { PersonalInformation } from "./PersonalInformation";
import { ProfilePicture } from "./ProfilePicture";
import { Tags } from "./Tags";
import { format } from "date-fns";

export const AddStudent = () => {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [selectedParents, setSelectedParents] = useState<{ id: number; name: string; avatar: string | null }[]>([]);

  useBreadcrumb([
    { label: "Student & Parent Record", url: "/student-and-parent-record" },
    { label: "Students", url: "/student-and-parent-record?tab=Students" },
    { label: "Add Student", url: "" },
  ]);

  const { mutate, isPending } = useAddStudent();

  const formik = useFormik<StudentInputValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      gender: Gender.Female,
      boardingStatus: BoardingStatus.Day,
      dateOfBirth: `${new Date()}`,
      address: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      phoneNumber: "",
      secondaryPhoneNumber: "",
      admissionNumber: "",
      admissionStatus: AdmissionStatus.Active,
      medicalInformation: "",
      nationality: "",
      stateOfOrigin: "",
      joinedSchoolTerm: "",
      joinedSchoolSession: "",

      branchId: null,
      classId: null,
      departmentId: null,
      armId: null,
    },
    validationSchema: studentSchema,
    onSubmit: values => {
      mutate(
        {
          ...values,
          dateOfBirth: format(new Date(formik.values.dateOfBirth), "yyyy-MM-dd"),
          tags,
          linkedParents: selectedParents.map(parent => parent.id),
          image: avatar,
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
              description: "Could not add student",
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
      {open && <LinkParents open={open} setOpen={setOpen} selectedParents={selectedParents} setSelectedParents={setSelectedParents} />}

      <div className="border-border-default bg-bg-card-subtle flex justify-between border-b px-4 py-3 md:px-30 xl:px-70">
        <h1 className="text-text-default text-base font-semibold">
          Add <span className="hidden md:inline">New</span> Student
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
              <PersonalInformation date={date} setDate={setDate} formik={formik} />
            </div>
          )}

          {step === 2 && <ContactInformation formik={formik} />}

          {step === 3 && <AcademicInformation formik={formik} />}

          {/* Tags */}
          {step === 3 && <Tags tags={tags} setTags={setTags} />}

          {/* Linked Parents */}
          {step === 2 && <LinkedParents setOpen={setOpen} setSelectedParents={setSelectedParents} selectedParents={selectedParents} />}
        </div>

        <div className="hidden md:block">
          <ProfilePicture setAvatar={setAvatar} />
          <PersonalInformation date={date} setDate={setDate} formik={formik} />
          <ContactInformation formik={formik} />
          <AcademicInformation formik={formik} />
          <Tags tags={tags} setTags={setTags} />
          <LinkedParents setOpen={setOpen} setSelectedParents={setSelectedParents} selectedParents={selectedParents} />
        </div>

        <div className="border-border-default bg-bg-default sticky bottom-0 w-full border-t py-3">
          <div className="flex items-center justify-between gap-2">
            <Button onClick={() => handleBack()} className="bg-bg-state-soft text-text-subtle hover:bg-bg-state-soft-hover! h-7! text-sm">
              {step > 1 ? "Back" : "Cancel"}
            </Button>

            {/* Desktop Submit button */}
            <Button
              type="submit"
              disabled={!isValid}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default hidden h-7! md:flex"
            >
              {isPending && <Spinner className="text-text-white-default" />}
              Add Student
            </Button>

            {/* Mobile Next/Submit button */}
            <Button
              onClick={() => handleSteps()}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default flex h-7! md:hidden"
            >
              {isPending && <Spinner className="text-text-white-default" />}
              {step === 3 ? "Add Student" : "Next"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
