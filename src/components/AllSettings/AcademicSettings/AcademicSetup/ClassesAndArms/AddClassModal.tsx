import { ClassLevel } from "@/api/types";
import { MobileDrawer } from "@/components/MobileDrawer";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useCreateClass } from "@/hooks/queryHooks/useClass";
import { useIsMobile } from "@/hooks/useIsMobile";

export const AddClassModal = ({ open, setOpen, level }: { open: boolean; setOpen: (open: boolean) => void; level: ClassLevel }) => {
  const isMobile = useIsMobile();
  const { mutate: createClass, isPending } = useCreateClass();

  const nextClassName = `${level.classNamePrefix} ${(level.classEnd ?? 0) + 1}`;

  const handleCreate = () => {
    createClass(
      { levelId: level.id, name: nextClassName },
      {
        onSuccess: () => {
          toast({ title: "Class added", description: `"${nextClassName}" has been created successfully`, type: "success" });
          setOpen(false);
        },
        onError: error => {
          toast({
            title: "Failed to add class",
            description: (error as { message?: string })?.message || `Could not create "${nextClassName}"`,
            type: "error",
          });
        },
      },
    );
  };

  const content = (
    <div className="flex flex-col gap-4 px-3 py-4">
      <p className="text-text-subtle text-sm">
        The next class <span className="text-text-default font-medium capitalize">{nextClassName.toLowerCase()}</span> will be added to the{" "}
        <span className="text-text-default font-medium capitalize">{level.levelName.replaceAll("_", " ").toLowerCase()}</span> level.
      </p>
      <div className="flex items-center justify-between gap-2 pt-2">
        <Button
          variant="outline"
          onClick={() => setOpen(false)}
          className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle h-7 border-none px-3 text-sm"
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          disabled={isPending}
          className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default hover:text-text-white-default! h-7 border-none px-3 text-sm"
        >
          {isPending && <Spinner className="text-text-white-default size-3" />}
          Add Class
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <MobileDrawer open={open} setIsOpen={setOpen} title="Add Class" showCloseButton>
        {content}
      </MobileDrawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-bg-card border-border-default max-w-sm p-0!">
        <DialogHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
          <DialogTitle className="text-text-default text-md font-semibold">Add Class</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
