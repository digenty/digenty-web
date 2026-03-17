import { ClassLevel } from "@/api/types";
import { CloseFill } from "@/components/Icons/CloseFill";
import Settings4 from "@/components/Icons/Settings4";
import { MobileDrawer } from "@/components/MobileDrawer";
import { toast } from "@/components/Toast";
import { Toggle } from "@/components/Toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateLevel } from "@/hooks/queryHooks/useLevel";
import { useAddSubject } from "@/hooks/queryHooks/useSubject";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";

const startclasses = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const endClasses = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
export const ClassQuickSetupSheet = ({
  level,
  branchSpecific,
  setActiveLevel,
  branchId,
}: {
  level: ClassLevel;
  branchSpecific: boolean;
  setActiveLevel: (level: ClassLevel) => void;
  branchId?: number;
}) => {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [arms, setArms] = useState<string[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [departmentsEnabled, setDepartmentsEnabled] = useState(false);
  const [armsEnabled, setArmsEnabled] = useState(false);
  const isMobile = useIsMobile();

  const { mutate, isPending } = useUpdateLevel();
  const { mutate: mutateSubject, isPending: isSubjectPending } = useAddSubject();

  const formik = useFormik({
    initialValues: {
      levelName: level?.levelName || "",
      classNamePrefix: level?.classNamePrefix || "",
      startClass: level?.classStart,
      endClass: level?.classEnd,
      subject: "",
      arm: "",
      department: "",
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      levelName: yup.string().required("Level name is required"),
      classNamePrefix: yup.string().required("Class name prefix is required"),
      startClass: yup.string().required("Start class is required"),
      endClass: yup.string().required("End class is required"),
    }),
    onSubmit: values => {
      mutate(
        {
          levelId: level?.id,
          levelName: values.levelName,
          levelType: level?.levelType,
          classNamePrefix: values.classNamePrefix,
          classStart: values.startClass,
          classEnd: values.endClass,
          branchSpecific,
        },
        {
          onSuccess: () => {
            setActiveLevel({
              ...level,
              levelName: values.levelName,
              classNamePrefix: values.classNamePrefix,
              classStart: values.startClass,
              classEnd: values.endClass,
            });
            setSheetOpen(false);
            toast({
              title: "Level updated successfully",
              description: "The level has been updated",
              type: "success",
            });
          },
          onError: error => {
            toast({
              title: "Failed to update level",
              description: error?.message || "Could not update level",
              type: "error",
            });
          },
        },
      );
    },
  });

  const { values, errors, touched, handleChange, handleBlur } = formik;

  const addSubject = (subjectString: string) => {
    if (!subjectString.trim()) return;
    const newSubjects = subjectString
      .split(",")
      .map(str => str.trim().replace(/^,+|,+$/g, ""))
      .filter(str => str !== "" && !subjects.includes(str));

    newSubjects.forEach(name => {
      mutateSubject(
        { name, levelId: level?.id, branchId: branchId ?? 25 },
        {
          onSuccess: () => {
            setSubjects(prev => [...prev, name]);
            toast({
              title: "Subject added",
              description: `"${name}" has been added successfully`,
              type: "success",
            });
          },
          onError: error => {
            toast({
              title: "Failed to add subject",
              description: (error as { message?: string })?.message || `Could not add "${name}"`,
              type: "error",
            });
          },
        },
      );
    });

    formik.setFieldValue("subject", "");
  };

  const removeSubject = (subjectToRemove: string) => {
    setSubjects(subjects.filter(subject => subject !== subjectToRemove));
  };

  const addArm = (armString: string) => {
    if (!armString.trim()) return;
    const newArms = armString
      .split(",")
      .map(str => str.trim().replace(/^,+|,+$/g, ""))
      .filter(str => str !== "" && !arms.includes(str));

    setArms([...arms, ...newArms]);
    formik.setFieldValue("arm", "");
  };

  const removeArm = (armToRemove: string) => {
    setArms(arms.filter(arm => arm !== armToRemove));
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
        <span>Customize Level</span>
        <p className="text-text-muted text-sm font-normal">
          This level setup establishes default class labels, ranges, subjects, and arms for all classes in the level. Once created, each individual
          class can still be customized as needed
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="levelName" className="text-text-default text-sm font-medium">
          Level name<small className="text-text-destructive text-xs">*</small>
        </Label>
        <Input
          id="levelName"
          onChange={handleChange}
          placeholder={`${level?.levelName.replaceAll("_", " ").toLowerCase()}`}
          onBlur={handleBlur}
          value={values.levelName.replaceAll("_", " ").toLowerCase()}
          type="text"
          className={cn(
            "text-text-muted bg-bg-input-soft! border-none text-sm font-normal capitalize",
            errors.levelName && touched.levelName && "border-border-destructive border",
          )}
        />
        {touched.levelName && errors.levelName && <p className="text-text-destructive text-xs font-light">{errors.levelName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="classNamePrefix" className="text-text-default text-sm font-medium">
          Class Label<small className="text-text-destructive text-xs">*</small>
        </Label>
        <Input
          id="classNamePrefix"
          onChange={handleChange}
          placeholder="Enter class label"
          onBlur={handleBlur}
          value={values.classNamePrefix}
          type="text"
          className={cn(
            "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
            errors.classNamePrefix && touched.classNamePrefix && "border-border-destructive border",
          )}
        />
        {touched.classNamePrefix && errors.classNamePrefix && <p className="text-text-destructive text-xs font-light">{errors.classNamePrefix}</p>}
        <small className="text-text-muted text-xs">Select the label that appears before the class number or type a custom one</small>
      </div>

      <div className="border-border-default flex items-center justify-between gap-3 border-b pb-6">
        <div className="flex w-full flex-col gap-2">
          <Select value={`${values.startClass}`} onValueChange={startClass => formik.setFieldValue("startClass", startClass)}>
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">Start level</Label>
              <SelectTrigger className="bg-bg-input-soft! h-9! w-full border-none">
                <SelectValue>
                  <span className="text-text-muted text-sm font-normal">{values.startClass ? values.startClass : "Select start level"}</span>
                </SelectValue>
              </SelectTrigger>
            </div>
            <SelectContent className="bg-bg-card border-border-default">
              {startclasses.map(str => (
                <SelectItem key={str} value={str} className="text-text-default text-sm font-medium">
                  {str}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-text-muted text-xs">The first class number in this level</span>
        </div>
        <div className="flex w-full flex-col gap-2">
          <Select value={`${values.endClass}`} onValueChange={endClass => formik.setFieldValue("endClass", endClass)}>
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">End level</Label>
              <SelectTrigger className="bg-bg-input-soft! h-9! w-full border-none">
                <SelectValue>
                  <span className="text-text-muted text-sm font-normal">{values.endClass ? values.endClass : "Select end level"}</span>
                </SelectValue>
              </SelectTrigger>
            </div>
            <SelectContent className="bg-bg-card border-border-default">
              {endClasses.map(str => (
                <SelectItem key={str} value={str} className="text-text-default text-sm font-medium">
                  {str}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-text-muted text-xs">The last class number in this level</span>
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
                    <span className="text-text-subtle text-xs">{subject}</span>{" "}
                    <button
                      type="button"
                      className="m-0 flex cursor-pointer items-center justify-center border-none bg-transparent p-0"
                      onClick={e => {
                        e.preventDefault();
                        removeSubject(subject);
                      }}
                    >
                      <CloseFill fill="var(--color-icon-default-muted)" className="size-2!" />
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
                      <span className="text-text-subtle text-xs">{arm}</span>{" "}
                      <button
                        type="button"
                        className="m-0 flex cursor-pointer items-center justify-center border-none bg-transparent p-0"
                        onClick={e => {
                          e.preventDefault();
                          removeArm(arm);
                        }}
                      >
                        <CloseFill fill="var(--color-icon-default-muted)" className="size-2!" />
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
      <Button
        onClick={() => {
          setDepartmentsEnabled(false);
          setArmsEnabled(false);
          setSheetOpen(true);
        }}
        className="bg-bg-state-secondary! border-border-darker! text-text-default rounded-md! border shadow-sm lg:ml-[-149]"
      >
        <Settings4 fill="var(--color-icon-default-muted)" /> Quick Setup
      </Button>
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
