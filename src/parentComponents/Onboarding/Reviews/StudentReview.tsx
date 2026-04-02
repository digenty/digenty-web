"use client";

import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { useGetStudent } from "@/hooks/queryHooks/useStudent";
import { useGetParent } from "@/hooks/queryHooks/useParent";
import { Pencil } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Student } from "@/api/types";
import { Skeleton } from "@/components/ui/skeleton";
import { PageEmptyState } from "@/components/Error/PageEmptyState";
import { ErrorComponent } from "@/components/Error/ErrorComponent";

const Row = ({ label, value }: { label: string; value?: string }) => (
  <div className="border-border-default flex items-center border-b pb-2">
    <div className="text-text-subtle flex-1 text-sm">{label}</div>
    <div className="text-text-default flex-1 text-sm">{value || "-"}</div>
  </div>
);

const StudentItem = ({
  studentId,
  index,
  openId,
  setOpenId,
  pathname,
  router,
}: {
  studentId: number;
  index: number;
  openId: number | null;
  setOpenId: (id: number | null) => void;
  pathname: string;
  router: ReturnType<typeof useRouter>;
}) => {
  const { data, isLoading, isError } = useGetStudent(studentId);
  const student = data?.data;

  const isOpen = openId === studentId;

  return (
    <div className="border-border-default flex flex-col gap-6 rounded-md border">
      <div className="border-border-default border-b">
        <div className="flex cursor-pointer justify-between px-4 py-2" onClick={() => setOpenId(isOpen ? null : studentId)}>
          <div className="text-text-default text-lg font-semibold">Student {index + 1} Details</div>

          <Button
            onClick={e => {
              e.stopPropagation();
              router.push(`${pathname}?step=student&id=${studentId}`);
            }}
            className="text-text-muted bg-none font-medium hover:bg-none!"
          >
            <Pencil />
            Edit Details
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="flex flex-col gap-6 p-4">
          {isLoading && <Skeleton className="bg-bg-input-soft h-100 w-full" />}
          {isError && <ErrorComponent title="Error" description="Failed to load student details." />}
          {!isError && !isLoading && (
            <>
              <Avatar className="size-8" />
              <div className="text-text-default text-lg font-semibold">Personal Information</div>
              <div className="flex flex-col gap-3">
                <Row label="First Name" value={student?.firstName} />
                <Row label="Last Name" value={student?.lastName} />
                <Row label="Middle Name" value={student?.middleName} />
                <Row label="Gender" value={student?.gender} />
                <Row label="Date of Birth" value={student?.dateOfBirth} />
                <Row label="Medical Information" value={student?.medicalInformation} />
                <Row label="Nationality" value={student?.nationality} />
                <Row label="State of Origin" value={student?.stateOfOrigin} />
              </div>

              <div className="border-border-default border"></div>

              <div className="text-text-default text-lg font-semibold">Contact Information</div>

              <div className="flex flex-col gap-3">
                <Row label="Home Address" value={student?.address} />
                <Row label="Email Address" value={student?.email} />
                <Row label="Primary Phone Number" value={student?.phoneNumber} />
                <Row label="Whatsapp Number" value={student?.secondaryPhoneNumber} />
                <Row label="Emergency Contact Name" value={student?.emergencyContactName} />
                <Row label="Emergency Contact Number" value={student?.emergencyContact} />
              </div>

              <div className="text-text-default text-lg font-semibold">Academic Information</div>

              <div className="flex flex-col gap-3">
                <Row label="Joined School Session" value={student?.joinedSchoolSession} />
                <Row label="Joined School Term" value={student?.joinedSchoolTerm} />
                <Row label="Admission Number" value={student?.admissionNumber} />
                <Row label="Branch" value={student?.branch} />
                <Row label="Class" value={student?.className} />
                <Row label="Arm" value={student?.armName} />
                <Row label="Admission Status" value={student?.admissionStatus} />
                <Row label="Boarding Status" value={student?.boardingStatus} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export const StudentReview = () => {
  const router = useRouter();
  const pathname = usePathname();
  const parentId = Number(pathname.split("/")[3]);
  const { data: parentData } = useGetParent(parentId);
  const [openId, setOpenId] = useState<number | null>(null);

  const students = parentData?.linkedStudents || [];

  if (!students.length) {
    return (
      <PageEmptyState
        title="No Data"
        description="You do not have any data yet. Kindly add a student to review their details here."
        buttonText="Enter student's details"
        url={`${pathname}?step=your-details`}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {students.map((s: Student, index: number) => (
        <StudentItem key={s.id} studentId={s.id} index={index} openId={openId} setOpenId={setOpenId} pathname={pathname} router={router} />
      ))}
    </div>
  );
};
