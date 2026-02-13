import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ReactNode } from "react";

export const Modal = ({
  open,
  setOpen,
  title,
  ActionButton,
  children,
  className,
  cancelButton,
  showCloseButton = true,
}: {
  open: boolean;
  setOpen: (bool: boolean) => void;
  title: ReactNode | string;
  ActionButton: ReactNode;
  children: ReactNode;
  className?: string;
  cancelButton?: ReactNode;
  showCloseButton?: boolean;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={showCloseButton}
        className={cn("bg-bg-card hidden border-none p-0 shadow-sm sm:max-w-138.5 md:block", className)}
      >
        <DialogHeader className="bg-bg-card-subtle border-border-default rounded-t-xl border-b px-4 py-3 text-left">
          <DialogTitle className="text-text-default text-base font-semibold">{title}</DialogTitle>
          <VisuallyHidden>
            <DialogDescription>{title}</DialogDescription>
          </VisuallyHidden>
        </DialogHeader>

        <div className="">{children}</div>

        <DialogFooter className="border-border-default justify-between border-t p-4">
          {cancelButton ? (
            cancelButton
          ) : (
            <DialogClose asChild>
              <Button
                variant="outline"
                className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle hover:text-text-subtle h-7 border-none px-2 py-1 text-sm font-medium"
              >
                Cancel
              </Button>
            </DialogClose>
          )}

          {ActionButton}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
