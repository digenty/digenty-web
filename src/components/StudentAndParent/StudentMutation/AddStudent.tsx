"use client";
import { studentSchema } from "@/schema/student";
import { BoardingStatus, Gender, StudentStatus } from "@/types";
import { useFormik } from "formik";
import { PlusIcon } from "lucide-react";
import { SetStateAction, useState } from "react";
import { Avatar } from "../../Avatar";
import DeleteBin from "../../Icons/DeleteBin";
import { Button } from "../../ui/button";
import { StudentInputValues } from "../types";
import { AcademicInformation } from "./AcademicInformation";
import { ContactInformation } from "./ContactInformation";
import { LinkEntity } from "./LinkEntity";
import { PersonalInformation } from "./PersonalInformation";
import { ProfilePicture } from "./ProfilePicture";
import { Tags } from "./Tags";
import { useRouter } from "next/navigation";

type Fields = {
  branch: string;
  class: string;
  department: string;
  arm: string;
  profilePicture: File | null;
};

export const AddStudent = () => {
  const router = useRouter();
  const [date, setDate] = useState<Date | string>("");
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const [fields, setFields] = useState<Fields>({
    branch: "",
    class: "",
    department: "",
    arm: "",
    profilePicture: null,
  });

  const formik = useFormik<StudentInputValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      gender: Gender.Female,
      boardingStatus: BoardingStatus.Day,
      dateOfBirth: "",
      address: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      primaryPhoneNumber: "",
      secondaryPhoneNumber: "",
      admissionNumber: "",
      studentStatus: StudentStatus.Active,
      medicalInformation: "",
      role: "",
      nationality: "",
      stateOfOrigin: "",
      termJoined: "",
      sessionJoined: "",
    },
    validationSchema: studentSchema,
    onSubmit: values => {
      console.log({ ...values, ...fields, tags });
    },
  });

  return (
    <div className="flex h-screen flex-col">
      {open && <LinkEntity entity="Parents" open={open} setOpen={setOpen} />}

      <div className="border-border-default bg-bg-card-subtle flex justify-between border-b px-4 py-3 md:px-30 xl:px-70">
        <h1 className="text-text-default text-base font-semibold">
          Add <span className="hidden md:inline">New</span> Student
        </h1>
        <div className="bg-bg-badge-default text-text-subtle border-border-default flex h-6 w-8.5 items-center justify-center rounded-md border p-1 text-sm md:hidden">
          1/3
        </div>
      </div>

      <form noValidate onSubmit={formik.handleSubmit} className="text-text-default flex-1 overflow-y-auto pt-4 md:px-30 md:pt-8 xl:px-70">
        <ProfilePicture
          setAvatar={(file: SetStateAction<File | null>) =>
            setFields(prev => ({
              ...prev,
              profilePicture: typeof file === "function" ? (file as (prevPic: File | null) => File | null)(prev.profilePicture) : file,
            }))
          }
        />

        <PersonalInformation date={date} setDate={setDate} formik={formik} />

        <ContactInformation formik={formik} />

        <AcademicInformation formik={formik} />

        {/* Tags */}
        <Tags tags={tags} setTags={setTags} />

        {/* Linked Parents */}
        <div className="space-y-6 py-6">
          <h2 className="text-lg font-semibold">Linked Parents</h2>

          <div className="grid grid-cols-1 gap-6 sm:gap-5">
            <div className="bg-bg-card shadow-light border-border-default flex items-center justify-between rounded-xl border py-2 pr-4 pl-2">
              <div className="flex items-center gap-2">
                <Avatar username="Damilare John" className="size-10" url="" />
                <p className="text-text-default text-sm font-medium">Damilare John</p>
              </div>

              <Button>
                <DeleteBin fill="var(--color-icon-default-subtle)" className="size-4" />
              </Button>
            </div>

            <Button
              onClick={() => setOpen(true)}
              className="text-text-default border-border-darker bg-bg-state-secondary h-10 w-full border border-dashed! text-sm font-medium"
            >
              <PlusIcon className="text-icon-default-muted" />
              <span>Link Parent</span>
            </Button>
          </div>
        </div>

        <div className="border-border-default bg-bg-default sticky bottom-0 w-full border-t py-3">
          <div className="flex items-center justify-between gap-2">
            <Button onClick={() => router.back()} className="bg-bg-state-soft! text-text-subtle! hover:bg-bg-state-soft-hover! h-7! text-sm">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formik.isValid}
              className="bg-bg-state-primary! disabled:bg-bg-state-primary-hover disabled:text-text-white-default hover:bg-bg-state-primary-hover! text-text-white-default h-7!"
            >
              Add Student
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
