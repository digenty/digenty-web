import AlertFill from "@/components/Icons/AlertFill";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/useIsMobile";

type AddProps = {
  openAdd: boolean;
  setOpenAdd: (openAdd: boolean) => void;
};

type EditProps = {
  openEdit: boolean;
  setOpenEdit: (openEdit: boolean) => void;
};

type DeleteProps = {
  openDelete: boolean;
  setOpenDelete: (openDelete: boolean) => void;
};

export const AddNewCategoryModal = ({ openAdd, setOpenAdd }: AddProps) => {
  const isMobile = useIsMobile();
  return (
    <>
      {isMobile ? (
        <MobileDrawer open={openAdd} setIsOpen={setOpenAdd} title="Add New Category">
          <div className="w-full px-3 py-4">
            <div className="space-y-2">
              <Label className="text-text-default text-sm font-medium">
                Category Name <span className="text-text-destructive">*</span>{" "}
              </Label>
              <Input className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm" placeholder="Input category name" />
            </div>
          </div>

          <DrawerFooter className="border-border-default border-t">
            <div className="flex justify-between">
              <DrawerClose asChild>
                <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-2 py-1 text-sm font-medium">Cancel</Button>
              </DrawerClose>

              <Button className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm">
                Create Category
              </Button>
            </div>
          </DrawerFooter>
        </MobileDrawer>
      ) : (
        <Modal
          open={openAdd}
          setOpen={setOpenAdd}
          title="Add New Category"
          ActionButton={
            <Button className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm">
              Create Category
            </Button>
          }
        >
          <div className="w-full px-3 py-4">
            <div className="space-y-2">
              <Label className="text-text-default text-sm font-medium">
                Category Name<span className="text-text-destructive">*</span>
              </Label>
              <Input className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm" placeholder="Input category name" />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export const EditCategoryModal = ({ openEdit, setOpenEdit }: EditProps) => {
  const isMobile = useIsMobile();
  return (
    <>
      {isMobile ? (
        <MobileDrawer open={openEdit} setIsOpen={setOpenEdit} title="Edit Category">
          <div className="w-full px-3 py-4">
            <div className="space-y-2">
              <Label className="text-text-default text-sm font-medium">
                Category Name <span className="text-text-destructive">*</span>{" "}
              </Label>
              <Input className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm" />
            </div>
          </div>

          <DrawerFooter className="border-border-default border-t">
            <div className="flex justify-between">
              <DrawerClose asChild>
                <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-2 py-1 text-sm font-medium">Cancel</Button>
              </DrawerClose>

              <Button className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm">
                Done
              </Button>
            </div>
          </DrawerFooter>
        </MobileDrawer>
      ) : (
        <Modal
          open={openEdit}
          setOpen={setOpenEdit}
          title="Edit Category"
          ActionButton={
            <Button className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm">
              Done
            </Button>
          }
        >
          <div className="w-full px-3 py-4">
            <div className="space-y-2">
              <Label className="text-text-default text-sm font-medium">
                Category Name<span className="text-text-destructive">*</span>
              </Label>
              <Input className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm" />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export const DeleteCategoryModal = ({ openDelete, setOpenDelete }: DeleteProps) => {
  const isMobile = useIsMobile();
  return (
    <>
      {isMobile ? (
        <MobileDrawer open={openDelete} setIsOpen={setOpenDelete} title="Delete Stock Category?">
          <div className="flex w-full flex-col gap-4 px-3 py-4">
            <div className="text-text-subtle text-sm">
              Are you sure you want to permanently delete this stock category? This action cannot be undone.
            </div>
            <div className="border-border-default bg-bg-basic-orange-subtle flex items-center gap-2 rounded-md border p-1">
              <AlertFill fill="var(--color-bg-basic-orange-accent)" className="size-12" />
              <div className="text-text-subtle text-sm">
                Deleting this category will remove it from your list of categories. Items currently under it will remain in stock but will lose this
                categorization.{" "}
              </div>
            </div>
            <div className="flex items-start gap-1 space-y-2">
              <Checkbox />
              <div className="text-text-subtle text-sm">I understand that deleting this stock item is permanent and cannot be undone.</div>
            </div>
          </div>

          <DrawerFooter className="border-border-default border-t">
            <div className="flex justify-between">
              <DrawerClose asChild>
                <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-2 py-1 text-sm font-medium">Cancel</Button>
              </DrawerClose>

              <Button className="text-text-white-default bg-bg-state-destructive hover:bg-bg-state-destructive-hover! h-7! rounded-md px-2 py-1 text-sm">
                Delete Stock Category
              </Button>
            </div>
          </DrawerFooter>
        </MobileDrawer>
      ) : (
        <Modal
          open={openDelete}
          setOpen={setOpenDelete}
          title="Delete Stock Category?"
          ActionButton={
            <Button className="text-text-white-default bg-bg-state-destructive hover:bg-bg-state-destructive-hover! h-7! rounded-md px-2 py-1 text-sm">
              Done
            </Button>
          }
        >
          <div className="flex w-full flex-col gap-4 px-3 py-4">
            <div className="text-text-subtle text-sm">
              Are you sure you want to permanently delete this stock category? This action cannot be undone.
            </div>
            <div className="border-border-default bg-bg-basic-orange-subtle flex items-center gap-2 rounded-md border p-2">
              <AlertFill fill="var(--color-bg-basic-orange-accent)" className="size-12" />
              <div className="text-text-subtle text-sm">
                Deleting this category will remove it from your list of categories. Items currently under it will remain in stock but will lose this
                categorization.{" "}
              </div>
            </div>
            <div className="flex items-start gap-1 space-y-2">
              <Checkbox />
              <div className="text-text-subtle text-sm">I understand that deleting this stock item is permanent and cannot be undone.</div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
