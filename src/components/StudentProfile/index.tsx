"use client";

import { useEffect, useState } from "react";
import { Avatar } from "../Avatar";
import { Button } from "../ui/button";
import { DialogDescription } from "../ui/dialog";
import StatusBadge from "./StatusBadge";

import DeleteBin from "../Icons/DeleteBin";
import Edit from "../Icons/Edit";
import UserMinus from "../Icons/UserMinus";
import WarningIcon from "../Icons/WarningIcon";
import { Modal } from "../Modal";
import { Checkbox } from "../ui/checkbox";
import StudentTabs from "./StudentTabs";
import { usePathname, useRouter } from "next/navigation";
import { useDeleteStudents, useGetStudent, useWithdrawStudents } from "@/hooks/queryHooks/useStudent";
import { Skeleton } from "../ui/skeleton";
import { Student } from "@/api/types";
import { useStudentStore } from "@/store/student";
import { queryClient } from "@/lib/tanstack";
import { studentKeys } from "@/queries/student";
import { toast } from "../Toast";
import { Spinner } from "../ui/spinner";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

export const Profile = () => {
  const pathname = usePathname();
  const router = useRouter();
  const studentId = pathname.split("/")[2] ?? "";

  const { openWithdraw, setOpenWithdraw, openDelete, setOpenDelete } = useStudentStore();

  const [isChecked, setIsChecked] = useState(false);

  const { data, isPending } = useGetStudent(Number(studentId));
  const { mutate: withdrawStudents, isPending: withdrawing } = useWithdrawStudents();
  const { mutate: deleteStudents, isPending: deleting } = useDeleteStudents();

  useBreadcrumb([
    { label: "Student & Parent Record", url: "/student-and-parent-record" },
    { label: "Students", url: "/student-and-parent-record?tab=Students" },
    { label: "Student", url: "" },
  ]);

  const handleWithdrawal = (ids: number[]) => {
    withdrawStudents(ids, {
      onSuccess: data => {
        toast({
          title: "Successfully withdrawn students",
          description: data.data.message,
          type: "success",
        });
        setOpenDelete(false);
      },
      onError: error => {
        toast({
          title: error.message ?? "Something went wrong",
          description: "Could not withdraw selected students",
          type: "error",
        });
        setOpenDelete(false);
      },
    });
  };

  const handleDeletion = (ids: number[]) => {
    deleteStudents(ids, {
      onSuccess: data => {
        queryClient.invalidateQueries({ queryKey: studentKeys.all, refetchType: "active" });

        toast({
          title: "Successfully deleted students",
          description: data.data.message,
          type: "success",
        });
      },
      onError: error => {
        toast({
          title: error.message ?? "Something went wrong",
          description: "Could not delete selected students",
          type: "error",
        });
      },
    });
  };

  if (!data || isPending) {
    return (
      <div className="base:px-20.5 mb-5 space-y-8 px-4 py-4">
        <div className="flex items-center justify-between gap-12">
          <div className="flex items-center gap-6">
            <Skeleton className="bg-bg-input-soft size-12 rounded-full md:size-26.5" />
            <Skeleton className="bg-bg-input-soft h-20 w-45 rounded-md" />
          </div>
          <Skeleton className="bg-bg-input-soft h-10 w-100 rounded-md" />
        </div>
        <Skeleton className="bg-bg-input-soft h-10 w-100 rounded-md" />
        <Skeleton className="bg-bg-input-soft h-140 w-full rounded-md" />
      </div>
    );
  }

  const student: Student = data?.data;

  return (
    <div className="base:px-20.5 mb-5 px-4 py-4">
      <div>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
          <div className="flex items-center gap-3.5">
            <Avatar className="size-12 md:size-26.5" url={student.image ?? ""} />
            <div>
              <div className="text-text-default flex items-center gap-2 text-lg font-semibold md:font-bold">
                <span>
                  {student.firstName} {student.lastName}
                </span>
                <StatusBadge status="Prefect" />
              </div>
              <p className="text-text-subtle text-sm font-normal">JSS 1 A</p>
              <div className="text-text-subtle text-sm font-normal">{student.admissionNumber ?? "--"}</div>
            </div>
          </div>

          <div className="border-border-default md:p-none flex items-center gap-1 border-t pt-3 md:border-none">
            <Button
              onClick={() => setOpenWithdraw(true)}
              className="bg-bg-state-secondary border-border-darker text-text-default size-9! rounded-md border text-sm"
            >
              {withdrawing ? <Spinner /> : <UserMinus fill="var(--color-icon-default-subtle)" className="size-4" />}
            </Button>
            <Button
              onClick={() => setOpenDelete(true)}
              className="bg-bg-state-secondary border-border-darker text-text-default size-9! rounded-md border text-sm"
            >
              {deleting ? <Spinner /> : <DeleteBin fill="var(--color-icon-default-subtle)" className="size-4" />}
            </Button>
            <Button
              onClick={() => router.push(`/student-and-parent-record/${student.id}/edit`)}
              className="bg-bg-state-secondary border-border-darker text-text-default rounded-md border text-sm"
            >
              <Edit fill="var(--color-icon-default-subtle)" className="size-4" /> Edit Student Information
            </Button>
          </div>
        </div>

        {/* Withdraw open modal  */}

        <Modal
          open={openWithdraw}
          className="block"
          setOpen={setOpenWithdraw}
          title="Withdraw Student?"
          ActionButton={
            <Button
              onClick={() => handleWithdrawal([student.id])}
              className={"bg-bg-state-destructive text-text-white-default hover:bg-bg-state-destructive-hover! h-7 rounded-md text-sm font-medium"}
            >
              Withdraw Student
            </Button>
          }
        >
          <div className="space-y-5 px-6 py-5">
            <DialogDescription className="text-text-subtle text-sm font-normal">
              Are you sure you want to withdraw <span className="font-normal">Damilare John?</span>{" "}
            </DialogDescription>
            <div className="bg-bg-basic-orange-subtle shadow-light border-border-default text-text-subtle rounded-sm border px-2.5 py-2.5 text-sm font-normal">
              <p>
                Once withdrawn, the profile will remain in the system, but the student will no longer appear in active classes or reports. You can
                re-enroll the student later if needed.
              </p>
            </div>
          </div>
        </Modal>

        {/* Delete open modal */}
        <Modal
          open={openDelete}
          setOpen={setOpenDelete}
          title="Delete Student?"
          className="block"
          ActionButton={
            <Button
              disabled={!isChecked}
              onClick={() => handleDeletion([student.id])}
              className={`hover:bg-bg-state-destructive-hover! h-7 rounded-md text-sm font-medium ${
                isChecked ? "bg-bg-state-destructive text-text-white-default" : "bg-bg-state-soft text-text-subtle"
              }`}
            >
              Delete Student
            </Button>
          }
        >
          <div className="space-y-5 px-6 py-5">
            <DialogDescription className="text-text-subtle text-sm font-normal">
              Are you sure you want to permanently delete this student’s profile? This action cannot be undone.
            </DialogDescription>

            <div className="bg-bg-basic-orange-subtle border-border-default text-text-subtle shadow-light flex items-center gap-3 rounded-sm border px-2.5 py-2.5 text-sm font-normal">
              <WarningIcon />
              <p>Deleting will remove the student’s profile and records. This cannot be undone.</p>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox id="terms" checked={isChecked} onCheckedChange={(checked: boolean) => setIsChecked(checked)} />
              <label htmlFor="terms" className="text-text-subtle text-sm font-normal">
                I understand that deleting this student is permanent and cannot be undone.
              </label>
            </div>
          </div>
        </Modal>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="itmes-center border-border-default flex gap-2 border-b pb-4 md:border-none md:p-0">
          <p className="text-text-subtle text-sm font-medium">Status:</p> <StatusBadge status={student.studentStatus} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-text-subtle text-sm font-medium">Linked Parents:</p>
            <div className="bg-bg-state-secondary border-border-default shadow-light text-text-default flex h-6 items-center justify-center gap-1 rounded-md border p-1">
              <Avatar className="size-4" />
              <span className="xs:text-xs line-clamp-1 truncate text-[10px] font-medium">Damilare John</span>
            </div>
            <div className="bg-bg-state-secondary border-border-default shadow-light text-text-default flex h-6 items-center justify-center gap-1 rounded-md border p-1">
              <Avatar className="size-4" />
              <span className="xs:text-xs line-clamp-1 truncate text-[10px] font-medium">Damilare John</span>
            </div>
          </div>
        </div>
      </div>

      <StudentTabs student={student} />
    </div>
  );
};
