import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/Modal";
import { MobileDrawer } from "@/components/MobileDrawer";
import { DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/useIsMobile";

import { useAddTeacherInput } from "@/hooks/queryHooks/useStudent";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { toast } from "../Toast";

const ratingOptions = ["Excellent", "Good", "Fair", "Poor"];

export const EditTeacherInputModal = ({
  open,
  setIsOpen,
  studentId,
  armId,
  branchId,
  initialData,
}: {
  open: boolean;
  setIsOpen: (val: boolean) => void;
  studentId?: number;
  armId?: number;
  branchId?: number;
  initialData?: {
    neatness?: string | null;
    punctuality?: string | null;
    diligence?: string | null;
    classTeacherComment?: string | null;
  };
}) => {
  const isMobile = useIsMobile();
  const { mutate: addTeacherInput, isPending } = useAddTeacherInput();

  const [formData, setFormData] = useState({
    neatness: "",
    punctuality: "",
    diligence: "",
    classTeacherComment: "",
  });

  useEffect(() => {
    if (open && initialData) {
      setFormData({
        neatness: initialData.neatness?.toLowerCase() || "",
        punctuality: initialData.punctuality?.toLowerCase() || "",
        diligence: initialData.diligence?.toLowerCase() || "",
        classTeacherComment: initialData.classTeacherComment || "",
      });
    }
  }, [open, initialData]);

  const handleSubmit = () => {
    if (!studentId || !armId || branchId === undefined) {
      toast({
        title: "Missing values",
        description: "Missing required information (Student ID, Arm ID, or Branch ID)",
        type: "error",
      });
      return;
    }

    addTeacherInput(
      {
        studentId,
        armId,
        branchId,
        neatness: formData.neatness.toUpperCase(),
        punctuality: formData.punctuality.toUpperCase(),
        diligence: formData.diligence.toUpperCase(),
        classTeacherComment: formData.classTeacherComment,
      },
      {
        onSuccess: () => {
          toast({
            title: "Updated",
            description: "Teacher input updated successfully",
            type: "success",
          });
          setIsOpen(false);
        },
        onError: error => {
          toast({
            title: "Could not update",
            description: error?.message || "Failed to update teacher input",
            type: "error",
          });
        },
      },
    );
  };
  return (
    <>
      {/* Mobile view */}
      <div className="md:hidden">
        {isMobile && (
          <MobileDrawer open={open} title="Edit Teacher's Input" setIsOpen={setIsOpen}>
            <div className="flex flex-col gap-6 px-6 py-4">
              <div>
                <h3 className="text-bg-basic-red-accent text-sm font-semibold">Conduct</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">Neatness</Label>
                    <Select value={formData.neatness} onValueChange={val => setFormData(prev => ({ ...prev, neatness: val }))}>
                      <SelectTrigger className="border-border-default text-text-default bg-bg-card w-full rounded-lg border px-3 py-2 text-sm">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent className="bg-bg-card border-none">
                        {ratingOptions.map(option => (
                          <SelectItem className="text-text-default" key={option} value={option.toLowerCase()}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">Punctuality</Label>
                    <Select value={formData.punctuality} onValueChange={val => setFormData(prev => ({ ...prev, punctuality: val }))}>
                      <SelectTrigger className="border-border-default text-text-default bg-bg-card w-full rounded-lg border px-3 py-2 text-sm">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent className="bg-bg-card border-none">
                        {ratingOptions.map(option => (
                          <SelectItem className="text-text-default" key={option} value={option.toLowerCase()}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">Diligence</Label>
                    <Select value={formData.diligence} onValueChange={val => setFormData(prev => ({ ...prev, diligence: val }))}>
                      <SelectTrigger className="border-border-default text-text-default bg-bg-card w-full rounded-lg border px-3 py-2 text-sm">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent className="bg-bg-card border-none">
                        {ratingOptions.map(option => (
                          <SelectItem className="text-text-default" key={option} value={option.toLowerCase()}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="border-border-default border-t pt-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="mobileClassTeacherComment" className="text-text-default text-sm font-medium">
                    Class Teacher Comment
                  </Label>
                  <Textarea
                    id="mobileClassTeacherComment"
                    value={formData.classTeacherComment}
                    onChange={e => setFormData(prev => ({ ...prev, classTeacherComment: e.target.value }))}
                    className="text-text-default border-border-default bg-bg-input-soft! focus:border-border-highlight! h-32 w-full resize-none rounded-lg border p-3 text-sm"
                    placeholder="Enter your comment"
                  />
                </div>
              </div>
            </div>

            <DrawerFooter className="border-border-default flex flex-row items-center justify-between border-t p-4">
              <DrawerClose asChild>
                <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-lg px-6 text-sm font-medium">Cancel</Button>
              </DrawerClose>
              <Button
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary-hover! h-7! rounded-lg px-6 text-sm font-medium"
              >
                {isPending && <Spinner className="text-text-white-default h-4 w-4" />}
                Save
              </Button>
            </DrawerFooter>
          </MobileDrawer>
        )}
      </div>

      {/* Desktop view */}
      <div className="hidden md:block">
        {!isMobile && (
          <Modal
            open={open}
            setOpen={setIsOpen}
            title="Edit Teacher's Input"
            cancelButton={
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="bg-bg-state-soft! text-text-subtle h-7! rounded-lg border-none px-6 text-sm font-medium"
              >
                Cancel
              </Button>
            }
            ActionButton={
              <Button
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary-hover! h-7! rounded-lg px-6 text-sm font-medium"
              >
                {isPending && <Spinner className="text-text-white-default h-4 w-4" />}
                Save
              </Button>
            }
          >
            <div className="flex flex-col gap-6 p-6">
              <div>
                <h3 className="text-bg-basic-red-accent text-sm font-semibold">Conduct</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <Label className="text-text-default w-1/3 text-sm font-medium">Neatness</Label>
                    <Select value={formData.neatness} onValueChange={val => setFormData(prev => ({ ...prev, neatness: val }))}>
                      <SelectTrigger className="text-text-default border-border-default bg-bg-card h-10 w-full rounded-lg border px-3 py-2 text-sm">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent className="bg-bg-card border-none">
                        {ratingOptions.map(option => (
                          <SelectItem className="text-text-default" key={option} value={option.toLowerCase()}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <Label className="text-text-default w-1/3 text-sm font-medium">Punctuality</Label>
                    <Select value={formData.punctuality} onValueChange={val => setFormData(prev => ({ ...prev, punctuality: val }))}>
                      <SelectTrigger className="border-border-default text-text-default bg-bg-card h-10 w-full rounded-lg border px-3 py-2 text-sm">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent className="bg-bg-card border-none">
                        {ratingOptions.map(option => (
                          <SelectItem className="text-text-default" key={option} value={option.toLowerCase()}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <Label className="text-text-default w-1/3 text-sm font-medium">Diligence</Label>
                    <Select value={formData.diligence} onValueChange={val => setFormData(prev => ({ ...prev, diligence: val }))}>
                      <SelectTrigger className="border-border-default text-text-default bg-bg-card h-10 w-full rounded-lg border px-3 py-2 text-sm">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent className="bg-bg-card border-none">
                        {ratingOptions.map(option => (
                          <SelectItem className="text-text-default" key={option} value={option.toLowerCase()}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="border-border-default border-t pt-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="classTeacherComment" className="text-text-default text-sm font-semibold">
                    Class Teacher Comment
                  </Label>
                  <Textarea
                    id="classTeacherComment"
                    value={formData.classTeacherComment}
                    onChange={e => setFormData(prev => ({ ...prev, classTeacherComment: e.target.value }))}
                    className="text-text-default border-border-default bg-bg-input-soft! focus:border-border-highlight! h-32 w-full resize-none rounded-lg border p-3 text-sm"
                    placeholder="Enter your comment"
                  />
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};
