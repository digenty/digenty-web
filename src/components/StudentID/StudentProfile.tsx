"use client";

import { useState } from "react";
import { Avatar } from "../Avatar";
import StatusBadge from "./StatusBadge";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../ui/dialog";

import StudentTabs from "./StudentTabs";
import StudentProfileIcon from "../Icons/StudentProfileIcon";
import Delete from "../Icons/Delete";
import EditStudent from "../Icons/EditStudent";
import WarningIcon from "../Icons/WarningIcon";
import { Checkbox } from "../ui/checkbox";

export default function StudentProfile() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="">
      <div>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
          <div className="flex gap-3">
            <Avatar username="Damilare John" className="size-18" />
            <div>
              <h2 className="text-text-default text-lg font-semibold">
                Damilare John <StatusBadge status="Perfect" />
              </h2>
              <p className="text-text-subtle text-sm font-normal">JSS 1 A</p>
              <div className="text-text-subtle text-sm font-normal">GFA/2023/01045</div>
            </div>
          </div>

          <div className="border-border-default md:p-none flex items-center gap-1 border-t-2 pt-4 md:border-none">
            <Button
              onClick={() => setOpenModal("student")}
              className="bg-bg-state-secondary border-border-darker text-text-default rounded border-1 text-sm"
            >
              <StudentProfileIcon />
            </Button>
            <Button
              onClick={() => setOpenModal("delete student")}
              className="bg-bg-state-secondary border-border-darker text-text-default rounded border-1 text-sm"
            >
              <Delete />
            </Button>
            <Button className="bg-bg-state-secondary border-border-darker text-text-default rounded border-1 text-sm">
              <EditStudent /> Edit Student Information
            </Button>
          </div>
        </div>

        {/* Withdraw open modal  */}
        <Dialog open={openModal === "student"} onOpenChange={() => setOpenModal(null)}>
          <DialogContent className="bg-bg-card w-[554px] rounded-md border-none p-0 shadow-lg sm:max-w-md dark:bg-neutral-900">
            <DialogHeader className="border-border-default bg-bg-card-subtle rounded-t-md border-b-1 px-4 py-4">
              <DialogTitle className="text-text-default text-md font-semibold">Withdraw Student?</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <DialogDescription className="text-text-subtle mb-6 text-sm font-normal">
                Are you sure you want to withdraw <span className="font-bold">Damilare John</span>{" "}
              </DialogDescription>
              <div className="bg-bg-basic-orange-subtle border-border-default text-text-subtle rounded-sm px-[10px] py-[12px] text-sm font-normal">
                <p>
                  Once withdrawn, the profile will remain in the system, but the student will no longer appear in active classes or reports. You can
                  re-enroll the student later if needed.
                </p>
              </div>
            </div>
            <DialogFooter>
              <div className="border-border-default mb-4 flex w-full items-center justify-between border-t-1 px-4 pt-3">
                <div>
                  <DialogClose asChild>
                    <Button variant="outline" className="bg-bg-state-soft text-text-subtle rounded-sm border-none text-sm font-medium">
                      Cancel
                    </Button>
                  </DialogClose>
                </div>

                <Button
                  type="submit"
                  className="bg-bg-state-destructive text-text-white-default hover:bg-bg-state-destructive rounded-sm px-8 py-4 text-sm font-medium"
                >
                  Withdraw Student
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Deletw open modal */}

        <Dialog open={openModal === "delete student"} onOpenChange={() => setOpenModal(null)}>
          <DialogContent className="bg-bg-card w-[554px] rounded-md border-none p-0 shadow-lg sm:max-w-md dark:bg-neutral-900">
            {/* Header */}
            <DialogHeader className="border-border-default bg-bg-card-subtle rounded-t-md border-b-1 px-4 py-4">
              <DialogTitle className="text-text-default text-md font-semibold">Delete Student?</DialogTitle>
            </DialogHeader>

            {/* Body */}
            <div className="p-4">
              <DialogDescription className="text-text-subtle mb-6 text-sm font-normal">
                Are you sure you want to permanently delete this student’s profile? This action cannot be undone.
              </DialogDescription>

              <div className="bg-bg-basic-orange-subtle border-border-default text-text-subtle flex items-center gap-3 rounded-sm border px-[10px] py-[12px] text-sm font-normal">
                <WarningIcon />
                <p>Deleting will remove the student’s profile and records. This cannot be undone.</p>
              </div>

              <div className="my-6 flex items-center gap-3">
                <Checkbox id="terms" checked={isChecked} onCheckedChange={(checked: boolean) => setIsChecked(checked)} />
                <label htmlFor="terms" className="text-text-subtle text-sm font-normal">
                  I understand that deleting this student is permanent and cannot be undone.
                </label>
              </div>
            </div>

            {/* Footer */}
            <DialogFooter>
              <div className="border-border-default mb-4 flex w-full items-center justify-between border-t px-4 pt-3">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="bg-bg-state-soft text-text-subtle hover:bg-bg-state-soft hover:text-text-subtle rounded-sm border-none text-sm font-medium transition-none"
                  >
                    Cancel
                  </Button>
                </DialogClose>

                <Button
                  disabled={!isChecked}
                  className={`rounded-sm px-8 py-4 text-sm font-medium ${
                    isChecked ? "bg-bg-state-destructive text-text-white-default" : "bg-bg-state-soft text-text-subtle"
                  } transition-none hover:bg-none hover:text-inherit`}
                >
                  Delete Student
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col gap-[24px] md:flex-row md:items-center">
        <div className="itmes-center border-border-default flex gap-3 border-b-2 pb-4 md:border-none md:p-0">
          <p className="text-text-subtle text-sm font-semibold">Status:</p> <StatusBadge status="Active" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <p className="text-text-subtle text-sm font-semibold">Linked Parents:</p>
            <div className="bg-bg-state-secondary border-border-default text-text-default flex h-[24px] items-center gap-1 rounded-sm border-1 p-1 text-sm">
              <Avatar username="Damilare John" className="size-4" />
              <span className="text-[10px] md:text-sm">Damilare John</span>
            </div>
            <div className="bg-bg-state-secondary border-border-default text-text-default flex h-[24px] items-center gap-1 rounded-sm border-1 p-1 text-sm">
              <Avatar username="Damilare John" className="size-4" />
              <span className="text-[10px] md:text-sm">Damilare John</span>
            </div>
          </div>
        </div>
      </div>
      <StudentTabs />
    </div>
  );
}
