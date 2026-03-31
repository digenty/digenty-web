"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone } from "@/components/Icons/Phone";
import Mail from "@/components/Icons/Mail";
import { Pencil } from "lucide-react";
import Flag from "@/components/Icons/Flag";
import { Avatar } from "@/components/Avatar";
import FirstAidKit from "@/components/Icons/FirstAidKit";
import { MapPin } from "@/components/Icons/MapPin";
import { useGetStudent } from "@/hooks/queryHooks/useStudent";
import { useGetParent } from "@/hooks/queryHooks/useParent";
import { Student } from "@/api/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { EditStudentBiodata } from "./EditBio/editStudent/EditStudentData";
import { StudentBioDataProps } from "./types";

const ViewBiodata = ({ onEdit, student }: { onEdit: () => void; student: { data: Student } }) => (
  <div className="bg-bg-muted rounded-xl p-4">
    <div className="">
      <div className="bg-bg-muted flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar />

          <p className="text-text-default text-sm font-semibold">
            {student?.data.firstName} {student?.data.lastName}
          </p>
        </div>
        <Button
          size="sm"
          onClick={onEdit}
          className="text-text-default border-border-darker bg-bg-state-secondary hover:bg-bg-state-secondary-hover! flex items-center gap-1.5 rounded-full border font-medium"
        >
          <Pencil className="size-3" />
          Edit <span className="hidden md:block">Biodata</span>
        </Button>
      </div>

      <div className="bg-bg-card w-full rounded-lg">
        <div className="border-border-default grid grid-cols-2 border-b md:grid-cols-3">
          <div className="flex flex-col gap-3 px-4 py-2">
            <p className="text-text-muted text-xs">Admission Number</p>
            <p className="text-text-default text-sm font-medium">{student?.data.admissionNumber}</p>
          </div>
          <div className="border-border-default flex flex-col gap-2 border-l px-4 py-3 md:border-r">
            <p className="text-text-muted text-xs">Gender</p>

            <p className="text-text-default text-sm font-medium"> {student?.data.gender}</p>
          </div>
          <div className="border-border-default col-span-2 flex flex-col gap-2 border-t px-4 py-3 md:col-span-1 md:border-none">
            <p className="text-text-muted text-xs">Date of Birth</p>
            <p className="text-text-default text-sm font-medium"> {student?.data.dateOfBirth}</p>
          </div>
        </div>
        <div className="border-border-default flex items-center gap-3 border-b px-4 py-3 last:border-b-0">
          <MapPin className="bg-bg-muted mt-0.5 size-4 h-8 w-8 shrink-0 rounded-md p-2" fill="var(--color-icon-default-muted)" />
          <div className="flex flex-col gap-0.5">
            <p className="text-text-muted text-xs">Home Address</p>
            <p className="text-text-default text-sm font-medium">{student?.data.address}</p>
          </div>
        </div>

        <div className="border-border-default flex items-center gap-3 border-b px-4 py-3 last:border-b-0">
          <FirstAidKit className="bg-bg-muted mt-0.5 size-4 h-8 w-8 shrink-0 rounded-md p-2" fill="var(--color-icon-default-muted)" />
          <div className="flex flex-col gap-0.5">
            <p className="text-text-muted text-xs">Medical Information</p>
            <p className="text-text-default text-sm font-medium">{student?.data.medicalInformation}</p>
          </div>
        </div>

        <div className="border-border-default flex items-center gap-3 border-b px-4 py-3 last:border-b-0">
          <Flag className="bg-bg-muted mt-0.5 size-4 h-8 w-8 shrink-0 rounded-md p-2" fill="var(--color-icon-default-muted)" />
          <div className="flex flex-col gap-0.5">
            <p className="text-text-muted text-xs">Nationality</p>
            <p className="text-text-default text-sm font-medium">{student?.data.nationality}</p>
          </div>
        </div>

        <div className="border-border-default flex items-center gap-3 border-b px-4 py-3 last:border-b-0">
          <Flag className="bg-bg-muted mt-0.5 size-4 h-8 w-8 shrink-0 rounded-md p-2" fill="var(--color-icon-default-muted)" />
          <div className="flex flex-col gap-0.5">
            <p className="text-text-muted text-xs">State of Origin</p>
            <p className="text-text-default text-sm font-medium">{student?.data.stateOfOrigin}</p>
          </div>
        </div>

        <div className="border-border-default flex items-center gap-3 border-b px-4 py-3 last:border-b-0">
          <Mail className="bg-bg-muted mt-0.5 size-4 h-8 w-8 shrink-0 rounded-md p-2" fill="var(--color-icon-default-muted)" />
          <div className="flex flex-col gap-0.5">
            <p className="text-text-muted text-xs">Email Address</p>
            <p className="text-text-default text-sm font-medium">{student?.data.email}</p>
          </div>
        </div>

        <div className="border-border-default flex items-center gap-3 border-b px-4 py-3 last:border-b-0">
          <Phone className="bg-bg-muted mt-0.5 size-4 h-8 w-8 shrink-0 rounded-md p-2" fill="var(--color-icon-default-muted)" />
          <div className="flex flex-col gap-0.5">
            <p className="text-text-muted text-xs">Primary Phone Number</p>
            <p className="text-text-default text-sm font-medium">{student?.data.phoneNumber}</p>
          </div>
        </div>

        <div className="border-border-default flex items-center gap-3 border-b px-4 py-3 last:border-b-0">
          <Phone className="bg-bg-muted mt-0.5 size-4 h-8 w-8 shrink-0 rounded-md p-2" fill="var(--color-icon-default-muted)" />
          <div className="flex flex-col gap-0.5">
            <p className="text-text-muted text-xs">Secondary Phone Number</p>
            <p className="text-text-default text-sm font-medium">{student?.data.secondaryPhoneNumber}</p>
          </div>
        </div>

        <div className="border-border-default flex items-center gap-3 border-b px-4 py-3 last:border-b-0">
          <FirstAidKit className="bg-bg-muted mt-0.5 size-4 h-8 w-8 shrink-0 rounded-md p-2" fill="var(--color-icon-default-muted)" />
          <div className="flex flex-col gap-0.5">
            <p className="text-text-muted text-xs">Emergency Contact Name</p>
            <p className="text-text-default text-sm font-medium">{student?.data.emergencyContactName}</p>
          </div>
        </div>

        <div className="border-border-default flex items-center gap-3 border-b px-4 py-3 last:border-b-0">
          <FirstAidKit className="bg-bg-muted mt-0.5 size-4 h-8 w-8 shrink-0 rounded-md p-2" fill="var(--color-icon-default-muted)" />
          <div className="flex flex-col gap-0.5">
            <p className="text-text-muted text-xs">Emergency Contact Number</p>
            <p className="text-text-default text-sm font-medium">{student?.data.emergencyContact}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const StudentBioData = ({ parentId, selectedStudentId }: StudentBioDataProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { data: parentData } = useGetParent(parentId);
  const linkedStudent = parentData?.linkedStudents?.find((s: Student) => s.id === selectedStudentId);
  const { data: studentData, isLoading, isError } = useGetStudent(linkedStudent?.id);
  const student = studentData;

  return (
    <div>
      {isLoading && <Skeleton className="bg-bg-input-soft h-full w-full" />}

      {!isLoading && isError && (
        <div className="flex h-screen items-center justify-center">
          <ErrorComponent
            title="Could not get Student's details"
            description="This is our problem, we are looking into it so as to serve you better"
            buttonText="Go to the Home page"
          />
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {isEditing ? (
            <EditStudentBiodata data={student} onSave={() => setIsEditing(false)} onCancel={() => setIsEditing(false)} />
          ) : (
            <ViewBiodata student={student} onEdit={() => setIsEditing(true)} />
          )}
        </>
      )}
    </div>
  );
};
