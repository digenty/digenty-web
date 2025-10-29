"use client";

import { useState } from "react";
import { Avatar } from "../Avatar";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import StatusBadge from "./StatusBadge";

import DeleteBin from "../Icons/DeleteBin";
import Edit from "../Icons/Edit";
import UserMinus from "../Icons/UserMinus";
import WarningIcon from "../Icons/WarningIcon";
import { Checkbox } from "../ui/checkbox";
import StudentTabs from "./StudentTabs";

export default function StudentProfile() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="mb-5">
      <div>
        <div className="base:flex-row base:items-center base:justify-between base:gap-0 mb-8 flex flex-col gap-4">
          <div className="flex items-center gap-3.5">
            <Avatar username="Damilare John" className="size-12 md:size-26.5" />
            <div>
              <div className="text-text-default flex items-center gap-2 text-lg font-semibold md:font-bold">
                <span>Damilare John</span>
                <StatusBadge status="Prefect" />
              </div>
              <p className="text-text-subtle text-sm font-normal">JSS 1 A</p>
              <div className="text-text-subtle text-sm font-normal">GFA/2023/01045</div>
            </div>
          </div>

          <div className="border-border-default base:p-none base:border-none flex items-center gap-1 border-t pt-3">
            <Button
              onClick={() => setOpenModal("student")}
              className="bg-bg-state-secondary border-border-darker text-text-default rounded-md border-1 text-sm"
            >
              <UserMinus fill="var(--color-icon-default-subtle)" className="size-4" />
            </Button>
            <Button
              onClick={() => setOpenModal("delete student")}
              className="bg-bg-state-secondary border-border-darker text-text-default rounded-md border-1 text-sm"
            >
              <DeleteBin fill="var(--color-icon-default-subtle)" className="size-4" />
            </Button>
            <Button className="bg-bg-state-secondary border-border-darker text-text-default rounded-md border-1 text-sm">
              <Edit fill="var(--color-icon-default-subtle)" className="size-4" /> Edit Student Information
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

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="itmes-center border-border-default flex gap-2 border-b pb-4 md:border-none md:p-0">
          <p className="text-text-subtle text-sm font-medium">Status:</p> <StatusBadge status="Active" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-text-subtle text-sm font-medium">Linked Parents:</p>
            <div className="bg-bg-state-secondary border-border-default shadow-light text-text-default flex h-6 items-center justify-center gap-1 rounded-md border-1 p-1 text-sm">
              <Avatar username="Damilare John" className="size-4" />
              <span className="text-2xs xs:text-xs font-medium">Damilare John</span>
            </div>
            <div className="bg-bg-state-secondary border-border-default shadow-light text-text-default flex h-6 items-center justify-center gap-1 rounded-md border-1 p-1 text-sm">
              <Avatar username="Damilare John" className="size-4" />
              <span className="text-2xs xs:text-xs font-medium">Damilare John</span>
            </div>
          </div>
        </div>
      </div>

      <StudentTabs />
    </div>
  );
}
