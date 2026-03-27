import { ClassLevel } from "@/api/types";
import { CloseFill } from "@/components/Icons/CloseFill";
import { MobileDrawer } from "@/components/MobileDrawer";
import { toast } from "@/components/Toast";
import { Toggle } from "@/components/Toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { useAddArmToClass, useDeleteArmFromClass, useGetArmsByClass } from "@/hooks/queryHooks/useArm";
import { useGetClassDetails } from "@/hooks/queryHooks/useClass";
import { useUpdateLevel } from "@/hooks/queryHooks/useLevel";
import { useAddSubjectToClass, useDeleteSubjectFromClass, useGetSubjectsByClass } from "@/hooks/queryHooks/useSubject";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";

export const ClassEditSheet = ({
  level,
  branchId,
  sheetOpen,
  setSheetOpen,
  classId,
}: {
  level: ClassLevel | null;
  branchId?: number;
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  classId: number | null;
}) => {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [arms, setArms] = useState<string[]>([]);
  const [departmentsEnabled, setDepartmentsEnabled] = useState(false);
  const [armsEnabled, setArmsEnabled] = useState(false);
  const [deletingSubjectName, setDeletingSubjectName] = useState<string | null>(null);
  const [deletingArmName, setDeletingArmName] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const { mutate, isPending } = useUpdateLevel();
  const { mutate: mutateSubject, isPending: isAddingSubject } = useAddSubjectToClass();
  const { mutate: deleteSubject } = useDeleteSubjectFromClass();
  const { mutate: deleteArm } = useDeleteArmFromClass();
  const { mutate: mutateArm, isPending: isAddingArm } = useAddArmToClass();
  const { data: classData, isLoading: isLoadingClass } = useGetClassDetails(classId);
  const { data: subjectsData, isFetching: isLoadingSubjects } = useGetSubjectsByClass(classData?.data?.name, level?.levelType, branchId);
  const { data: armsData, isFetching: isLoadingArms } = useGetArmsByClass(classId);

  useEffect(() => {
    if (subjectsData) {
      const names: string[] = Array.isArray(subjectsData?.data[0]?.subjects)
        ? subjectsData?.data[0]?.subjects.map((s: { name: string }) => s.name)
        : (subjectsData?.content ?? subjectsData?.data ?? []).map((s: { name: string }) => s.name);
      setSubjects(names);
    }
  }, [subjectsData]);

  useEffect(() => {
    if (armsData) {
      const names: string[] = Array.isArray(armsData?.data[0]?.arms)
        ? armsData?.data[0]?.arms.map((s: { name: string }) => s.name)
        : (armsData?.content ?? armsData?.data ?? []).map((s: { name: string }) => s.name);
      setArms(names);
      setArmsEnabled(true);
    }
  }, [armsData]);

  const formik = useFormik({
    initialValues: {
      className: classData?.data?.name || "",
      subject: "",
      arm: "",
      department: "",
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      className: yup.string().required("Class name is required"),
    }),
    onSubmit: values => {},
  });

  const { values, errors, touched, handleChange, handleBlur } = formik;

  const addSubject = (subjectString: string) => {
    if (!subjectString.trim()) return;
    const newSubjects = subjectString
      .split(",")
      .map(str => str.trim().replace(/^,+|,+$/g, ""))
      .filter(str => str !== "" && !subjects.includes(str));

    mutateSubject(
      { names: newSubjects, className: classData?.data?.name, levelType: level?.levelType || "" },
      {
        onSuccess: () => {
          setSubjects(prev => [...prev, ...newSubjects]);
          toast({
            title: "Subjects added",
            description: `Subject(s) have been added successfully`,
            type: "success",
          });
        },
        onError: error => {
          toast({
            title: "Failed to add subjects",
            description: (error as { message?: string })?.message || `Could not add subjects`,
            type: "error",
          });
        },
      },
    );

    formik.setFieldValue("subject", "");
  };

  const removeSubject = (subjectToRemove: string) => {
    const subjectsList = subjectsData?.data[0]?.subjects || [];

    const subjectObj = subjectsList.find((s: { id: number; name: string }) => s.name === subjectToRemove);

    if (subjectObj && classId) {
      setDeletingSubjectName(subjectToRemove);
      deleteSubject(
        { subjectId: subjectObj.id, classId: classId },
        {
          onSuccess: () => {
            setSubjects(subjects.filter(subject => subject !== subjectToRemove));
            setDeletingSubjectName(null);
            toast({
              title: "Subject deleted",
              description: `"${subjectToRemove}" has been deleted successfully`,
              type: "success",
            });
          },
          onError: error => {
            setDeletingSubjectName(null);
            toast({
              title: "Failed to delete subject",
              description: (error as { message?: string })?.message || `Could not delete "${subjectToRemove}"`,
              type: "error",
            });
          },
        },
      );
    } else {
      setSubjects(subjects.filter(subject => subject !== subjectToRemove));
    }
  };

  const addArm = (armString: string) => {
    if (!armString.trim()) return;
    const newArms = armString
      .split(",")
      .map(str => str.trim().replace(/^,+|,+$/g, ""))
      .filter(str => str !== "" && !arms.includes(str));

    if (!newArms.length) return;

    mutateArm(
      { names: newArms, className: classData?.data?.name, levelType: level?.levelType || "" },
      {
        onSuccess: () => {
          setArms(prev => [...prev, ...newArms]);
          toast({
            title: "Arms added",
            description: `Arm(s) have been added successfully`,
            type: "success",
          });
        },
        onError: error => {
          toast({
            title: "Failed to add arms",
            description: (error as { message?: string })?.message || `Could not add arms`,
            type: "error",
          });
        },
      },
    );

    formik.setFieldValue("arm", "");
  };

  const removeArm = (armToRemove: string) => {
    const armsList = armsData?.data || [];

    const armObj = armsList.find((a: { id: number; name: string }) => a.name === armToRemove);
    if (armObj && classId) {
      setDeletingArmName(armToRemove);
      deleteArm(
        { armId: armObj.id, classId: classId },
        {
          onSuccess: () => {
            setArms(arms.filter(arm => arm !== armToRemove));
            setDeletingArmName(null);
            toast({
              title: "Arm deleted",
              description: `"${armToRemove}" has been deleted successfully`,
              type: "success",
            });
          },
          onError: error => {
            setDeletingArmName(null);
            toast({
              title: "Failed to delete arm",
              description: (error as { message?: string })?.message || `Could not delete "${armToRemove}"`,
              type: "error",
            });
          },
        },
      );
    } else {
      setArms(arms.filter(arm => arm !== armToRemove));
    }
  };

  const addDepartment = (departmentString: string) => {
    if (!departmentString.trim()) return;
    const newDepartments = departmentString
      .split(",")
      .map(str => str.trim().replace(/^,+|,+$/g, ""))
      .filter(str => str !== "" && !departments.includes(str));

    setDepartments([...departments, ...newDepartments]);
    formik.setFieldValue("department", "");
  };

  const removeDepartment = (departmentToRemove: string) => {
    setDepartments(departments.filter(department => department !== departmentToRemove));
  };

  const contentNode = (
    <div className={cn("flex w-full flex-col gap-6 py-6", isMobile ? "px-4" : "px-6")}>
      <div className="text-text-default flex flex-col gap-2 text-xl font-semibold">
        <span>Customize Class</span>
      </div>

      <div className="border-border-default border-b pb-6">
        <div className="space-y-2">
          <Label htmlFor="className" className="text-text-default text-sm font-medium">
            Class Name
          </Label>
          <Input
            id="className"
            onChange={handleChange}
            placeholder={classData?.data?.name}
            onBlur={handleBlur}
            value={values.className}
            type="text"
            className={cn(
              "text-text-muted bg-bg-input-soft! border-none text-sm font-normal capitalize",
              errors.className && touched.className && "border-border-destructive border",
            )}
          />
          {touched.className && errors.className && typeof errors.className === "string" && (
            <p className="text-text-destructive text-xs font-light">{errors.className}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Departments */}
        {(level?.levelType === "JUNIOR_SECONDARY" || level?.levelType === "SENIOR_SECONDARY") && (
          <div className="flex flex-col gap-6">
            <div className="text-text-default text-xl font-semibold">Departments</div>
            <div className="flex items-start justify-between gap-2">
              <div className="">
                <div className="text-text-default text-sm font-medium">Enable Departments</div>
                <div className="text-text-subtle text-sm">
                  Departments let you organize students within the same level into different academic paths. This way, classes under the same level
                  can offer different sets of subjects or focus areas.
                </div>
              </div>
              <Toggle withBorder={false} checked={departmentsEnabled} onChange={e => setDepartmentsEnabled((e.target as HTMLInputElement).checked)} />
            </div>
            {departmentsEnabled && (
              <>
                <div className="border-border-default flex flex-col gap-3 border-b pb-6">
                  <div className="text-text-default text-sm font-medium">Departments</div>
                  <div className="bg-bg-input-soft flex h-9 items-center gap-2 rounded-md p-2">
                    <Input
                      id="department"
                      onChange={formik.handleChange}
                      placeholder="Enter Departments"
                      value={formik.values.department}
                      type="text"
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addDepartment(formik.values.department);
                        }
                      }}
                      className={cn("text-text-default h-7! w-full rounded-md border-none text-sm font-normal")}
                    />
                    <Button className="text-text-white-default bg-bg-state-primary! hover:bg-bg-state-primary-hover! h-6! rounded-md px-2 text-xs">
                      Add
                    </Button>
                  </div>
                  <div className="flex items-center gap-1">
                    {" "}
                    {departments.map(department => (
                      <Badge
                        key={department}
                        className="bg-bg-badge-default border-border-default flex h-5 items-center justify-between gap-3 rounded-md border p-1"
                      >
                        <span className="text-text-subtle text-xs">{department}</span>{" "}
                        <CloseFill
                          onClick={() => removeDepartment(department)}
                          fill="var(--color-icon-default-muted)"
                          className="size-2! cursor-pointer"
                        />
                      </Badge>
                    ))}
                  </div>
                  <small className="text-text-muted text-xs">
                    You can add multiple departments at once by separating with a comma e.g Art, Commercial, Science
                  </small>
                </div>

                {departments.length > 0 && (
                  <>
                    <div className="text-text-default text-xl font-semibold">Department Subjects</div>
                    {departments.map(dept => (
                      <div key={dept} className="flex flex-col gap-3">
                        <Label className="text-text-default text-sm font-medium">{dept} Subjects</Label>
                        <div className="bg-bg-input-soft flex h-9 items-center gap-2 rounded-md p-2">
                          <Input
                            type="text"
                            className="text-text-default h-7! w-full rounded-md border-none bg-none! text-sm"
                            placeholder="Add Department"
                          />
                          <Button className="text-text-white-default bg-bg-state-primary! hover:bg-bg-state-primary-hover! h-6! rounded-md px-2 text-xs">
                            Add
                          </Button>
                        </div>
                        <div className="flex items-center gap-1">
                          {" "}
                          {["Mathematics", "English Language", "Basic Science"].map(subject => (
                            <Badge
                              key={subject}
                              className="bg-bg-badge-default border-border-default flex h-5 items-center justify-between gap-3 rounded-md border p-1"
                            >
                              <span className="text-text-subtle text-xs">{subject}</span>{" "}
                              <CloseFill fill="var(--color-icon-default-muted)" className="size-2! cursor-pointer" />
                            </Badge>
                          ))}
                        </div>
                        <div className="text-text-muted text-xs">
                          You can add multiple subjects at once by separating with a comma e.g English Language, Mathematics etc.{" "}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* Subjects */}
        {!departmentsEnabled && (
          <div className="">
            <div className="text-text-default mb-6 text-xl font-semibold">Subjects</div>
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">Subjects</Label>
              <div className="bg-bg-input-soft flex h-9 items-center gap-2 rounded-md p-2">
                <Input
                  id="subject"
                  onChange={formik.handleChange}
                  placeholder="Enter Subjects"
                  value={formik.values.subject}
                  type="text"
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSubject(formik.values.subject);
                    }
                  }}
                  className={cn("text-text-default h-7! w-full rounded-md border-none text-sm font-normal")}
                />

                <Button
                  type="button"
                  onClick={() => addSubject(formik.values.subject)}
                  className="text-text-white-default bg-bg-state-primary! hover:bg-bg-state-primary-hover! h-6! rounded-md px-2 text-xs"
                >
                  {isAddingSubject && <Spinner className="text-text-white-default size-3" />}
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-1">
                {" "}
                {subjects.map(subject => (
                  <Badge
                    key={subject}
                    className="bg-bg-badge-default border-border-default flex h-5 items-center justify-between gap-3 rounded-md border p-1"
                  >
                    <span className="text-text-subtle text-xs capitalize">{subject.toLowerCase()}</span>{" "}
                    <button
                      type="button"
                      className="m-0 flex cursor-pointer items-center justify-center border-none bg-transparent p-0 disabled:opacity-50"
                      disabled={deletingSubjectName === subject}
                      onClick={e => {
                        e.preventDefault();
                        removeSubject(subject);
                      }}
                    >
                      {deletingSubjectName === subject ? (
                        <Spinner className="text-text-subtle size-2" />
                      ) : (
                        <CloseFill fill="var(--color-icon-default-muted)" className="size-2!" />
                      )}
                    </button>
                  </Badge>
                ))}
                <div className="text-text-muted mt-1 text-xs">
                  You can add multiple subjects at once by separating with a comma e.g English Language, Mathematics etc.
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          {/* Arms */}
          <div className="space-y-6">
            <div className="space-y-6">
              <div className="text-text-default text-xl font-semibold">Arms</div>
              <div className={cn("border-border-default flex justify-between border-b pb-6", !armsEnabled && "border-none")}>
                <div>
                  <Label className="text-text-default text-sm font-medium">Enable Arms</Label>
                  <span className="text-text-subtle text-sm">
                    Arms let you split a class or department into smaller groups while still keeping them under the same level. They’re simply
                    parallel divisions of the same class (e.g., Class A, Class B).
                  </span>
                </div>
                <Toggle withBorder={false} checked={armsEnabled} onChange={e => setArmsEnabled((e.target as HTMLInputElement).checked)} />
              </div>
            </div>
            {armsEnabled && (
              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">Arms</Label>
                <div className="bg-bg-input-soft flex h-9 items-center gap-2 rounded-md p-2">
                  <Input
                    id="arm"
                    onChange={formik.handleChange}
                    placeholder="Enter Arms"
                    value={formik.values.arm}
                    type="text"
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addArm(formik.values.arm);
                      }
                    }}
                    className={cn("text-text-default h-7! w-full rounded-md border-none text-sm font-normal")}
                  />

                  <Button
                    type="button"
                    onClick={() => addArm(formik.values.arm)}
                    className="text-text-white-default bg-bg-state-primary! hover:bg-bg-state-primary-hover! h-6! rounded-md px-2 text-xs"
                  >
                    {isAddingArm && <Spinner className="text-text-white-default size-3" />}
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1">
                  {" "}
                  {arms.map(arm => (
                    <Badge
                      key={arm}
                      className="bg-bg-badge-default border-border-default flex h-5 items-center justify-between gap-3 rounded-md border p-1"
                    >
                      <span className="text-text-subtle text-xs capitalize">{arm.toLowerCase()}</span>{" "}
                      <button
                        type="button"
                        className="m-0 flex cursor-pointer items-center justify-center border-none bg-transparent p-0 disabled:opacity-50"
                        disabled={deletingArmName === arm}
                        onClick={e => {
                          e.preventDefault();
                          removeArm(arm);
                        }}
                      >
                        {deletingArmName === arm ? (
                          <Spinner className="text-text-subtle size-2" />
                        ) : (
                          <CloseFill fill="var(--color-icon-default-muted)" className="size-2!" />
                        )}
                      </button>
                    </Badge>
                  ))}
                  <div className="text-text-muted mt-1 text-xs">You can add multiple arms at once by separating with a comma e.g A, B, C etc.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="">
      {/* <Button
        onClick={() => {
          setDepartmentsEnabled(false);
          setArmsEnabled(false);
          setSheetOpen(true);
        }}
        className="bg-bg-state-secondary! border-border-darker! text-text-default rounded-md! border shadow-sm lg:ml-[-149]"
      >
        <Settings4 fill="var(--color-icon-default-muted)" /> Quick Setup
      </Button> */}
      {!isMobile && (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <div>
            <SheetContent className="bg-bg-card border-border-default mt-4 mr-4 hidden overflow-y-auto rounded-md border md:block md:min-w-130">
              <SheetHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
                <VisuallyHidden>
                  <SheetTitle>Quick Setup</SheetTitle>
                </VisuallyHidden>
                <div className="flex items-center justify-between">
                  <div className="text-text-default text-md font-semibold">Quick Setup</div>
                </div>
              </SheetHeader>

              {contentNode}

              <SheetFooter className="border-border-default border-t pb-8">
                <div className="flex items-center justify-between">
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      className="bg-bg-state-soft! text-text-subtle hover:text-text-subtle! rounde-sm h-7 w-17 border-none px-2 py-1"
                    >
                      Close
                    </Button>
                  </SheetClose>
                  <Button
                    type="button"
                    onClick={() => formik.handleSubmit()}
                    className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! flex h-7 w-17 items-center gap-1 rounded-sm px-2 py-1"
                  >
                    {isPending && <Spinner className="text-text-white-default" />}
                    Save
                  </Button>
                </div>
              </SheetFooter>
            </SheetContent>
          </div>
        </Sheet>
      )}

      {/* Mobile */}
      {isMobile && (
        <MobileDrawer open={sheetOpen} setIsOpen={setSheetOpen} title="Quick Setup">
          {contentNode}
          <SheetFooter className="border-border-default border-t">
            <div className="flex items-center justify-between">
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className="bg-bg-state-soft! text-text-subtle hover:text-text-subtle! rounde-sm h-7 w-17 border-none px-2 py-1"
                >
                  Close
                </Button>
              </SheetClose>
              <Button
                type="button"
                onClick={() => formik.handleSubmit()}
                className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! flex h-7 w-17 items-center gap-1 rounded-sm px-2 py-1"
              >
                {isPending && <Spinner className="text-text-white-default" />}
                Save
              </Button>
            </div>
          </SheetFooter>
        </MobileDrawer>
      )}
    </div>
  );
};
