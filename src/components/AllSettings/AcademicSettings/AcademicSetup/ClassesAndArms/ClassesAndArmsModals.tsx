import { AlertFill } from "@digenty/icons";

import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteClass } from "@/hooks/queryHooks/useClass";
import { useIsMobile } from "@/hooks/useIsMobile";
import React, { useState } from "react";

interface DeleteClassProps {
  setOpenDeleteModal: (open: boolean) => void;
  open: boolean;
  classId: number | null;
}
export const DeleteClass = ({ setOpenDeleteModal, open, classId }: DeleteClassProps) => {
  const isMobile = useIsMobile();
  const [confirmed, setConfirmed] = useState(false);
  const { mutate, isPending } = useDeleteClass();

  const handleDelete = () => {
    if (!classId) return;
    mutate(classId, {
      onSuccess: () => {
        setOpenDeleteModal(false);
        toast({
          title: "Class deleted",
          description: "The class has been deleted successfully",
          type: "success",
        });
      },
      onError: error => {
        toast({
          title: "Failed to delete class",
          description: error?.message || "Could not delete class",
          type: "error",
        });
      },
    });
  };

  const deleteButton = (
    <Button
      disabled={!confirmed}
      onClick={handleDelete}
      className="bg-bg-state-destructive! hover:bg-bg-state-destructive-hover! text-text-white-default! disabled:bg-bg-state-destructive-hover! h-7! cursor-pointer disabled:cursor-not-allowed"
    >
      {isPending && <Spinner className="text-text-white-default size-4" />}
      Delete Class
    </Button>
  );

  return (
    <div>
      {!isMobile ? (
        <Modal open={open} setOpen={setOpenDeleteModal} title="Delete Class?" ActionButton={deleteButton}>
          <div className="flex flex-col gap-6 p-6">
            <div className="text-text-subtle text-sm">Are you sure you want to permanently delete this class? This action cannot be undone.</div>

            <div className="border-border-default bg-bg-basic-orange-subtle flex items-center gap-3 rounded-md p-3">
              <AlertFill fill="var(--color-bg-basic-orange-accent)" className="size-13" />

              <div className="text-text-subtle text-sm">
                Deleting this class will remove it from your academic setup and unlink all students, teachers, and subjects. Past records stay intact,
                but the class won’t be available going forward.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox id="confirm-delete" checked={confirmed} onCheckedChange={checked => setConfirmed(!!checked)} />
              <label htmlFor="confirm-delete" className="text-text-subtle text-sm">
                {" "}
                I understand that deleting this class is permanent and cannot be undone.
              </label>
            </div>
          </div>
        </Modal>
      ) : (
        <MobileDrawer open={open} setIsOpen={setOpenDeleteModal} title="Delete Class?">
          <div className="flex flex-col gap-6 p-6">
            <div className="text-text-subtle">Are you sure you want to permanently delete this class? This action cannot be undone.</div>

            <div className="border-border-default bg-bg-basic-orange-subtle flex items-center gap-3 rounded-md p-3">
              <AlertFill fill="var(--color-bg-basic-orange-accent)" className="size-13" />

              <div className="text-text-subtle text-sm">
                Deleting this class will remove it from your academic setup and unlink all students, teachers, and subjects. Past records stay intact,
                but the class won’t be available going forward.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox id="confirm-delete-mobile" checked={confirmed} onCheckedChange={checked => setConfirmed(!!checked)} />
              <label htmlFor="confirm-delete-mobile" className="text-text-subtle text-sm">
                {" "}
                I understand that deleting this class is permanent and cannot be undone.
              </label>
            </div>
          </div>

          <DrawerFooter className="border-border-default border-t">
            <div className="flex justify-between">
              <DrawerClose asChild>
                <Button className="bg-bg-state-soft text-text-subtle rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
              </DrawerClose>

              {deleteButton}
            </div>
          </DrawerFooter>
        </MobileDrawer>
      )}
    </div>
  );
};
