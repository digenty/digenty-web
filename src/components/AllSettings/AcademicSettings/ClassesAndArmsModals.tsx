import AlertFill from "@/components/Icons/AlertFill";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/useIsMobile";
import React from "react";

interface DeleteClassProps {
  setOpenDeleteModal: (open: boolean) => void;
  open: boolean;
}
export const DeleteClass = ({ setOpenDeleteModal, open }: DeleteClassProps) => {
  const isMobile = useIsMobile();
  return (
    <div>
      {!isMobile ? (
        <Modal
          open={open}
          setOpen={setOpenDeleteModal}
          title="Delete Class?"
          ActionButton={<Button className="bg-bg-state-destructive! text-text-white-default h-7!">Delete Class</Button>}
        >
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
              <Checkbox />
              <div className="text-text-subtle text-sm"> I understand that deleting this class is permanent and cannot be undone.</div>
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
              <Checkbox />
              <div className="text-text-subtle text-sm"> I understand that deleting this class is permanent and cannot be undone.</div>
            </div>
          </div>

          <DrawerFooter className="border-border-default border-t">
            <div className="flex justify-between">
              <DrawerClose asChild>
                <Button className="bg-bg-state-soft text-text-subtle rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
              </DrawerClose>

              <Button className="bg-bg-state-destructive! text-text-white-default h-7!">Delete Class</Button>
            </div>
          </DrawerFooter>
        </MobileDrawer>
      )}
    </div>
  );
};
