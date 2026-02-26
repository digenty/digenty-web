import AlertFill from "@/components/Icons/AlertFill";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/useIsMobile";

type DeleteProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  deactivateStaff: () => void;
  deactivating: boolean;
};

export const DeactivateStaffModal = ({ open, setOpen, deactivateStaff, deactivating }: DeleteProps) => {
  const isMobile = useIsMobile();
  return (
    <div>
      {open && (
        <>
          {!isMobile ? (
            <Modal
              title="Deactivate Staff"
              setOpen={setOpen}
              open={open}
              ActionButton={
                <Button
                  onClick={deactivateStaff}
                  className="bg-bg-state-destructive hover:bg-bg-state-destructive-hover! text-text-white-default h-7!"
                >
                  {deactivating && <Spinner className="text-text-white-default" />}Deactivate
                </Button>
              }
            >
              <div className="flex flex-col gap-6 p-6">
                <div className="text-text-subtle text-sm">Are you sure you want to deactivate this staff member?</div>
                <div className="border-border-default bg-bg-basic-orange-subtle flex items-center gap-2 rounded-md border p-4">
                  <AlertFill fill="var(--color-bg-basic-orange-accent)" className="size-10" />

                  <div className="text-text-subtle text-sm">
                    Once deactivated, this staff member will no longer be able to log in or perform any actions in the system.
                  </div>
                </div>
                {/* <div className="border-border-default rounded-md border p-4">
                  <div className="text-text-subtle text-sm">
                    You can either remove all their roles now or keep the roles assigned (you&apos;ll need to reassign them later).
                  </div>
                </div> */}
              </div>
            </Modal>
          ) : (
            <MobileDrawer open={open} setIsOpen={setOpen} title="Deactivate Staff">
              <div className="flex flex-col gap-6 p-6">
                <div className="text-text-subtle text-sm">Are you sure you want to deactivate this staff member?</div>
                <div className="border-border-default bg-bg-basic-orange-subtle flex items-center gap-2 rounded-md border p-4">
                  <AlertFill fill="var(--color-bg-basic-orange-accent)" className="size-15" />

                  <div className="text-text-subtle text-sm">
                    Once deactivated, this staff member will no longer be able to log in or perform any actions in the system.
                  </div>
                </div>
              </div>

              <DrawerFooter className="border-border-default border-t">
                <div className="flex justify-between">
                  <DrawerClose asChild>
                    <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
                  </DrawerClose>

                  <Button
                    onClick={deactivateStaff}
                    className="bg-bg-state-destructive hover:bg-bg-state-destructive-hover! text-text-white-default h-7!"
                  >
                    {deactivating && <Spinner className="text-text-white-default" />}
                    Deactivate
                  </Button>
                </div>
              </DrawerFooter>
            </MobileDrawer>
          )}
        </>
      )}
    </div>
  );
};
