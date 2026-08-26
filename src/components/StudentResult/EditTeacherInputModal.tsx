import { RatingLegendEntry, StudentDevelopment } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/Modal";
import { MobileDrawer } from "@/components/MobileDrawer";
import { DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/useIsMobile";

import { useAddTeacherInput, useGetTeacherInputByStudentArm } from "@/hooks/queryHooks/useStudent";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { toast } from "../Toast";

type RatingsState = Record<number, number | null>;

const buildInitialRatings = (developments: StudentDevelopment[]): RatingsState =>
  developments.reduce<RatingsState>((acc, category) => {
    category.skills.forEach(skill => {
      acc[skill.skillId] = skill.rating;
    });
    return acc;
  }, {});

const SkillRatingFields = ({
  developments,
  ratingLegend,
  ratings,
  onChange,
}: {
  developments: StudentDevelopment[];
  ratingLegend: RatingLegendEntry[];
  ratings: RatingsState;
  onChange: (skillId: number, rating: number) => void;
}) => {
  if (developments.length === 0) {
    return <div className="text-text-muted text-sm">No development skills have been configured for this class level yet.</div>;
  }

  return (
    <>
      {developments.map(category => (
        <div key={category.categoryId}>
          <h3 className="text-bg-basic-red-accent text-sm font-semibold">{category.categoryName}</h3>
          <div className="mt-4 space-y-4">
            {category.skills.map(skill => (
              <div key={skill.skillId} className="flex items-center justify-between gap-4">
                <Label className="text-text-default w-1/3 text-sm font-medium">{skill.skillName}</Label>
                <Select
                  value={ratings[skill.skillId] != null ? String(ratings[skill.skillId]) : ""}
                  onValueChange={val => onChange(skill.skillId, Number(val))}
                >
                  <SelectTrigger className="text-text-default border-border-default bg-bg-card h-10 w-full rounded-lg border px-3 py-2 text-sm">
                    <SelectValue placeholder="Select a rating" />
                  </SelectTrigger>
                  <SelectContent className="bg-bg-card border-none">
                    {ratingLegend.map(entry => (
                      <SelectItem className="text-text-default" key={entry.value} value={String(entry.value)}>
                        {entry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export const EditTeacherInputModal = ({
  open,
  setIsOpen,
  studentId,
  armId,
}: {
  open: boolean;
  setIsOpen: (val: boolean) => void;
  studentId?: number;
  armId?: number;
}) => {
  const isMobile = useIsMobile();
  const { mutate: addTeacherInput, isPending } = useAddTeacherInput();
  const { data: teacherInputData, isFetching: isLoadingTeacherInput } = useGetTeacherInputByStudentArm({ studentId, armId, enabled: open });

  const teacherInput = teacherInputData?.data;

  const [ratings, setRatings] = useState<RatingsState>({});
  const [classTeacherComment, setClassTeacherComment] = useState("");

  useEffect(() => {
    if (open && teacherInput) {
      setRatings(buildInitialRatings(teacherInput.developments));
      setClassTeacherComment(teacherInput.classTeacherComment || "");
    }
  }, [open, teacherInput]);

  const handleSubmit = () => {
    if (!studentId || !armId) {
      toast({
        title: "Missing values",
        description: "Missing required information (Student ID or Arm ID)",
        type: "error",
      });
      return;
    }

    const ratingsPayload = Object.entries(ratings)
      .filter(([, rating]) => rating != null)
      .map(([skillId, rating]) => ({ skillId: Number(skillId), rating: rating as number }));

    addTeacherInput(
      {
        studentId,
        armId,
        ratings: ratingsPayload,
        classTeacherComment,
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

  const fieldsProps = {
    developments: teacherInput?.developments ?? [],
    ratingLegend: teacherInput?.ratingLegend ?? [],
    ratings,
    onChange: (skillId: number, rating: number) => setRatings(prev => ({ ...prev, [skillId]: rating })),
  };

  const fields = isLoadingTeacherInput ? (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  ) : (
    <SkillRatingFields {...fieldsProps} />
  );

  return (
    <>
      {/* Mobile view */}
      <div className="md:hidden">
        {isMobile && (
          <MobileDrawer open={open} title="Edit Teacher's Input" setIsOpen={setIsOpen}>
            <div className="flex flex-col gap-6 px-6 py-4">
              {fields}

              <div className="border-border-default border-t pt-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="mobileClassTeacherComment" className="text-text-default text-sm font-medium">
                    Class Teacher Comment
                  </Label>
                  <Textarea
                    id="mobileClassTeacherComment"
                    value={classTeacherComment}
                    onChange={e => setClassTeacherComment(e.target.value)}
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
              {fields}

              <div className="border-border-default border-t pt-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="classTeacherComment" className="text-text-default text-sm font-semibold">
                    Class Teacher Comment
                  </Label>
                  <Textarea
                    id="classTeacherComment"
                    value={classTeacherComment}
                    onChange={e => setClassTeacherComment(e.target.value)}
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
