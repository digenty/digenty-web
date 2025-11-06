"use client";

import { useState } from "react";
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

export const Profile = () => {
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="mb-5">
      <div>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
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

          <div className="border-border-default md:p-none flex items-center gap-1 border-t pt-3 md:border-none">
            <Button
              onClick={() => setOpenWithdraw(true)}
              className="bg-bg-state-secondary border-border-darker text-text-default size-9! rounded-md border-1 text-sm"
            >
              <UserMinus fill="var(--color-icon-default-subtle)" className="size-4" />
            </Button>
            <Button
              onClick={() => setOpenDelete(true)}
              className="bg-bg-state-secondary border-border-darker text-text-default size-9! rounded-md border-1 text-sm"
            >
              <DeleteBin fill="var(--color-icon-default-subtle)" className="size-4" />
            </Button>
            <Button className="bg-bg-state-secondary border-border-darker text-text-default rounded-md border-1 text-sm">
              <Edit fill="var(--color-icon-default-subtle)" className="size-4" /> Edit Student Information
            </Button>
          </div>
        </div>

        {/* Withdraw open modal  */}

        <Modal
          open={openWithdraw}
          setOpen={setOpenWithdraw}
          title="Withdraw Student?"
          ActionButton={
            <Button
              disabled={!isChecked}
              className={`h-7 rounded-md py-4 text-sm font-medium ${
                isChecked ? "bg-bg-state-destructive text-text-white-default" : "bg-bg-state-soft text-text-subtle"
              } transition-none hover:bg-none hover:text-inherit`}
            >
              Withdraw Student
            </Button>
          }
        >
          <div className="space-y-5">
            <DialogDescription className="text-text-subtle text-sm font-normal">
              Are you sure you want to withdraw <span className="font-normal">Damilare John</span>{" "}
            </DialogDescription>
            <div className="bg-bg-basic-orange-subtle shadow-light border-border-default text-text-subtle rounded-sm border px-2.5 py-2.5 text-sm font-normal">
              <p>
                Once withdrawn, the profile will remain in the system, but the student will no longer appear in active classes or reports. You can
                re-enroll the student later if needed.
              </p>
            </div>
          </div>
        </Modal>

        {/* Deletw open modal */}
        <Modal
          open={openDelete}
          setOpen={setOpenDelete}
          title="Delete Student?"
          ActionButton={
            <Button
              disabled={!isChecked}
              className={`h-7 rounded-md py-4 text-sm font-medium ${
                isChecked ? "bg-bg-state-destructive text-text-white-default" : "bg-bg-state-soft text-text-subtle"
              } transition-none hover:bg-none hover:text-inherit`}
            >
              Delete Student
            </Button>
          }
        >
          <div className="space-y-5">
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
          <p className="text-text-subtle text-sm font-medium">Status:</p> <StatusBadge status="Active" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-text-subtle text-sm font-medium">Linked Parents:</p>
            <div className="bg-bg-state-secondary border-border-default shadow-light text-text-default flex h-6 items-center justify-center gap-1 rounded-md border-1 p-1">
              <Avatar username="Damilare John" className="size-4" />
              <span className="xs:text-xs line-clamp-1 truncate text-[10px] font-medium">Damilare John</span>
            </div>
            <div className="bg-bg-state-secondary border-border-default shadow-light text-text-default flex h-6 items-center justify-center gap-1 rounded-md border-1 p-1">
              <Avatar username="Damilare John" className="size-4" />
              <span className="xs:text-xs line-clamp-1 truncate text-[10px] font-medium">Damilare John</span>
            </div>
          </div>
        </div>
      </div>

      <StudentTabs />
    </div>
  );
};
