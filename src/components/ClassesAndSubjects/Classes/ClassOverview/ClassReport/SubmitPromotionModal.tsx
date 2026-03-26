import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@/components/ui/dialog";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/useIsMobile";

type SubmitPromotionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
};

export const SubmitPromotionModal = ({ open, onOpenChange, onConfirm, isLoading }: SubmitPromotionModalProps) => {
  const isMobile = useIsMobile();
  return (
    <>
      {!isMobile && (
        <Modal
          open={open}
          setOpen={onOpenChange}
          title="Submit Promotions?"
          ActionButton={
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm disabled:opacity-50"
            >
              {isLoading && <Spinner className="text-text-white-default" />}
              Submit Promotions
            </Button>
          }
        >
          <div className="flex flex-col gap-4 px-5 py-4">
            <DialogDescription className="text-text-subtle text-sm font-normal">
              Are you sure you want to submit the student promotions?
            </DialogDescription>

            <div className="border-border-default bg-bg-basic-blue-subtle rounded-sm border px-3 py-2">
              <p className="text-text-subtle text-sm font-normal">You will no longer be able to make changes to these decisions.</p>
            </div>
          </div>
        </Modal>
      )}

      {isMobile && (
        <MobileDrawer open={open} setIsOpen={onOpenChange} title="Submit Promotions" className="">
          <div className="flex flex-col gap-4 px-5 py-4">
            <DialogDescription className="text-text-subtle text-sm font-normal">
              Are you sure you want to submit the student promotions?
            </DialogDescription>

            <div className="border-border-default bg-bg-basic-blue-subtle rounded-sm border px-3 py-2">
              <p className="text-text-subtle text-sm font-normal">You will no longer be able to make changes to these decisions.</p>
            </div>
          </div>

          <DrawerFooter className="border-border-default border-t">
            <div className="flex items-center justify-between">
              <DrawerClose asChild>
                <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-4 text-sm font-medium">Cancel</Button>
              </DrawerClose>

              <Button
                onClick={onConfirm}
                disabled={isLoading}
                className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm disabled:opacity-50"
              >
                {isLoading && <Spinner className="text-text-white-default" />}
                Submit Promotions
              </Button>
            </div>
          </DrawerFooter>
        </MobileDrawer>
      )}
    </>
  );
};
