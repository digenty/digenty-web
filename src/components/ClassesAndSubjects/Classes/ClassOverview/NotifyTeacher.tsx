import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@/components/ui/dialog";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useClassesStore } from "@/store/classes";

export const NotifyTeacher = () => {
  const isMobile = useIsMobile();
  const { openNotifyTeacher, setOpenNotifyTeacher } = useClassesStore();
  return (
    <>
      {!isMobile ? (
        <Modal
          open={openNotifyTeacher}
          setOpen={setOpenNotifyTeacher}
          className="block"
          title="Send Notification"
          ActionButton={
            <Button
              // onClick={() => onOpenChange(false)}
              className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm"
            >
              Notify
            </Button>
          }
        >
          <div className="flex flex-col gap-5 px-5 py-4">
            <DialogDescription className="text-text-subtle text-sm font-normal">Add a short message</DialogDescription>

            <div className="space-y-2">
              <Label className="text-text-default text-sm font-medium">Message</Label>
              <Textarea
                className="bg-bg-input-soft! focus-visible:border-ring focus-visible:ring-border-highlight text-text-muted flex h-18 w-full items-start rounded-md p-2 text-sm font-normal focus-visible:border-none! focus-visible:ring-2 focus-visible:ring-offset-2"
                placeholder="Add message"
              />
            </div>
          </div>
        </Modal>
      ) : (
        <MobileDrawer open={openNotifyTeacher} setIsOpen={setOpenNotifyTeacher} title="Send Notification">
          <div className="flex flex-col gap-5 px-5 py-4">
            <DialogDescription className="text-text-subtle text-sm font-normal">Add a short message</DialogDescription>

            <div className="space-y-2">
              <Label className="text-text-default text-sm font-medium">Message</Label>
              <Textarea
                className="bg-bg-input-soft! focus-visible:border-ring focus-visible:ring-border-highlight text-text-muted flex h-18 w-full items-start rounded-md border-none p-2 text-sm font-normal focus-visible:border-none! focus-visible:ring-2 focus-visible:ring-offset-2"
                placeholder="Add message"
              />
            </div>
          </div>

          <DrawerFooter className="border-border-default border-t">
            <div className="flex justify-between">
              <DrawerClose asChild>
                <Button className="bg-bg-state-soft text-text-subtle h-7 rounded-md! px-2 py-2 text-sm font-medium">Cancel</Button>
              </DrawerClose>

              <Button className="bg-bg-state-primary text-text-white-default h-7 rounded-md! px-2 text-sm tracking-[0.1rem]">
                <span>Notify</span>
              </Button>
            </div>
          </DrawerFooter>
        </MobileDrawer>
      )}
    </>
  );
};
