import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { XIcon } from "lucide-react";
import { Button } from "../ui/button";

export const MobileDrawer = ({
  open,
  setIsOpen,
  children,
  title,
}: {
  open: boolean;
  setIsOpen: (bool: boolean) => void;
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <Drawer open={open} onOpenChange={setIsOpen}>
      <DrawerContent className="bg-bg-card border-border-darker m-4 block rounded-xl md:hidden">
        <VisuallyHidden>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{title}</DrawerDescription>
          </DrawerHeader>
        </VisuallyHidden>
        <div className="bg-bg-card-subtle flex h-14 items-center justify-between rounded-t-xl px-4">
          <h2 className="text-text-default text-base font-semibold">{title}</h2>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            <XIcon className="text-icon-default-muted h-5 w-5" />
          </Button>
        </div>

        {children}
      </DrawerContent>
    </Drawer>
  );
};
