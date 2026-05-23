import { ArmDetails, ClassLevel, DepartmentWithSubjects } from "@/api/types";

import { MobileDrawer } from "@/components/MobileDrawer";
import { toast } from "@/components/Toast";
import { Toggle } from "@/components/Toggle";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { useAddArm, useGetAllArms, useGetArmsByLevel } from "@/hooks/queryHooks/useArm";
import {
  useAddDepartmentsToLevel,
  useCreateDepartmentSubjects,
  useDeleteDepartmentSubjects,
  useGetDepartmentSubjectsByLevel,
  useGetDepartmentsByLevel,
  useGetDepartments,
  useToggleDepartmentForLevel,
} from "@/hooks/queryHooks/useDepartment";
import { useUpdateLevel } from "@/hooks/queryHooks/useLevel";
import { useAddSubject, useGetAllSubjects, useGetSubjectsByLevel } from "@/hooks/queryHooks/useSubject";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { AssignArmsToDepartments } from "./AssignArmsToDepartments";

const startclasses = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const endClasses = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

const LevelItemsSection = ({
  existingItems,
  globalOptions,
  isLoadingOptions,
  onSave,
  isPending,
  placeholder,
  resetSignal,
  defaultChecked = [],
}: {
  existingItems: string[];
  globalOptions: string[];
  isLoadingOptions: boolean;
  onSave: (names: string[]) => void;
  isPending: boolean;
  placeholder: string;
  resetSignal: number;
  defaultChecked?: string[];
}) => {
  const [typedItems, setTypedItems] = useState<string[]>([]);
  const [checked, setChecked] = useState<string[]>(defaultChecked);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setTypedItems([]);
    setChecked(defaultChecked);
    setInputValue("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal]);

  const addFromInput = () => {
    const names = inputValue
      .split(",")
      .map(s => s.trim())
      .filter(s => s !== "" && !existingItems.includes(s) && !typedItems.includes(s) && !globalOptions.includes(s));
    if (!names.length) {
      setInputValue("");
      return;
    }
    setTypedItems(prev => [...prev, ...names]);
    setChecked(prev => [...prev, ...names]);
    setInputValue("");
  };

  const toggle = (name: string) => setChecked(prev => (prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]));

  const allOptions = [...new Set([...existingItems, ...globalOptions, ...typedItems])];

  const hasNewChecked = checked.some(n => !defaultChecked.includes(n));
  const hasUncheckedExisting = defaultChecked.some(n => !checked.includes(n));
  const hasChanges = hasNewChecked || hasUncheckedExisting;

  const handleSave = () => {
    if (!hasChanges) return;
    onSave(checked);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-bg-input-soft flex h-9 items-center gap-2 rounded-md p-2">
        <Input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              addFromInput();
            }
          }}
          placeholder={placeholder}
          className="text-text-default h-7! w-full rounded-md border-none text-sm font-normal"
        />
        {inputValue.trim() && (
          <Button
            type="button"
            onClick={addFromInput}
            className="text-text-white-default! bg-bg-state-primary! hover:bg-bg-state-primary-hover! h-6! shrink-0 rounded-md px-2 text-xs"
          >
            Add
          </Button>
        )}
      </div>

      {isLoadingOptions ? (
        <div className="flex items-center gap-2">
          <Spinner className="text-text-muted size-3" />
          <span className="text-text-muted text-xs">Loading suggestions...</span>
        </div>
      ) : allOptions.length > 0 ? (
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {allOptions.map(name => (
            <label key={name} className="flex cursor-pointer items-center gap-2">
              <Checkbox checked={checked.includes(name)} onCheckedChange={() => toggle(name)} />
              <span className="text-text-default text-sm capitalize">{name.toLowerCase()}</span>
            </label>
          ))}
        </div>
      ) : null}

      {hasChanges && (
        <Button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-7 self-end rounded-sm px-3 text-xs"
        >
          {isPending && <Spinner className="text-text-white-default size-3" />}
          Save
        </Button>
      )}
      <div className="text-text-muted text-xs">Select the ones you want to add, or type new ones above. Comma-separate multiple entries.</div>
    </div>
  );
};

const DepartmentSubjectsSection = ({
  dept,
  levelId,
  branchId,
  branchSpecific,
}: {
  dept: { departmentId: number; name: string };
  levelId: number;
  branchId?: number;
  branchSpecific: boolean;
}) => {
  const [sessionSubjects, setSessionSubjects] = useState<string[]>([]);
  const [resetSignal] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const initialized = useRef(false);

  const { data: deptSubjectsData } = useGetDepartmentSubjectsByLevel(dept.departmentId, levelId);
  const { data: allSubjectsData, isFetching: isLoadingAllSubjects } = useGetAllSubjects();
  const { mutate: mutateCreateDeptSubjects } = useCreateDepartmentSubjects();
  const { mutate: mutateDeleteDeptSubject } = useDeleteDepartmentSubjects();

  // On first load, surface any subjects the backend auto-linked so the user can see and manage them
  useEffect(() => {
    if (!initialized.current && deptSubjectsData?.data) {
      const names: string[] = (deptSubjectsData.data as { subjectName: string }[]).map(s => s.subjectName);
      if (names.length) {
        setSessionSubjects(names);
      }
      initialized.current = true;
    }
  }, [deptSubjectsData]);

  const allSubjectNames: string[] = (
    Array.isArray(allSubjectsData) ? allSubjectsData : Array.isArray(allSubjectsData?.data) ? allSubjectsData.data : []
  ).map((s: { name: string }) => s.name);

  const availableSubjects = allSubjectNames.filter(n => !sessionSubjects.includes(n));

  const handleUpdate = (currentChecked: string[]) => {
    const toAdd = currentChecked.filter(n => !sessionSubjects.includes(n));
    const toRemove = sessionSubjects.filter(n => !currentChecked.includes(n));

    if (!toAdd.length && !toRemove.length) return;
    setIsSyncing(true);

    const deptData = deptSubjectsData?.data as { subjectId: number; subjectName: string }[] | undefined;

    toRemove.forEach(name => {
      const subjectData = deptData?.find(s => s.subjectName === name);
      if (subjectData) {
        mutateDeleteDeptSubject(
          { departmentId: dept.departmentId, subjectId: subjectData.subjectId },
          { onSuccess: () => setSessionSubjects(prev => prev.filter(s => s !== name)) },
        );
      }
    });

    if (toAdd.length) {
      mutateCreateDeptSubjects(
        { departmentName: dept.name, subjectNames: toAdd, branchId, branchSpecific },
        {
          onSuccess: () => {
            setSessionSubjects(prev => [...new Set([...prev.filter(n => !toRemove.includes(n)), ...toAdd])]);
            setIsSyncing(false);
            toast({ title: "Subjects updated", description: `Subjects for ${dept.name} updated successfully`, type: "success" });
          },
          onError: error => {
            setIsSyncing(false);
            toast({
              title: "Failed to update subjects",
              description: (error as { message?: string })?.message || `Could not update subjects`,
              type: "error",
            });
          },
        },
      );
    } else {
      setIsSyncing(false);
      toast({ title: "Subjects updated", description: `Subjects for ${dept.name} updated successfully`, type: "success" });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Label className="text-text-default text-sm font-medium capitalize">{dept.name.toLowerCase()} Subjects</Label>
      <LevelItemsSection
        existingItems={[]}
        globalOptions={availableSubjects}
        isLoadingOptions={isLoadingAllSubjects}
        onSave={handleUpdate}
        isPending={isSyncing}
        placeholder={`Search or add subjects to ${dept.name.toLowerCase()}`}
        resetSignal={resetSignal}
        defaultChecked={sessionSubjects}
      />
    </div>
  );
};

export const ClassQuickSetupSheet = ({
  level,
  branchSpecific,
  setActiveLevel,
  branchId,
  sheetOpen,
  setSheetOpen,
}: {
  level: ClassLevel;
  branchSpecific: boolean;
  setActiveLevel: (level: ClassLevel) => void;
  branchId?: number;
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
}) => {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [arms, setArms] = useState<string[]>([]);
  const [armsDetails, setArmsDetails] = useState<ArmDetails[]>([]);
  const [departmentsDetails, setDepartmentsDetails] = useState<DepartmentWithSubjects[]>([]);

  const [departmentsEnabled, setDepartmentsEnabled] = useState(false);
  const [armsEnabled, setArmsEnabled] = useState(false);
  const isMobile = useIsMobile();

  const { mutate, isPending } = useUpdateLevel();
  const { mutate: mutateSubject, isPending: isAddingSubject } = useAddSubject();
  const { mutate: mutateArm, isPending: isAddingArm } = useAddArm();
  const { mutate: mutateDepartment, isPending: isAddingDepartment } = useAddDepartmentsToLevel();
  const { mutate: toggleDepartment } = useToggleDepartmentForLevel();

  // Level data only fetched after the user makes a POST (to get IDs for sub-sections)
  const [levelDataEnabled, setLevelDataEnabled] = useState(false);
  const { data: subjectsData } = useGetSubjectsByLevel(undefined, branchId);
  const { data: armsData } = useGetArmsByLevel(levelDataEnabled ? level?.levelType : undefined, branchId);
  const { data: departmentsData } = useGetDepartmentsByLevel(level?.levelType, branchId);

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
      const armsWithDetails = Array.isArray(armsData?.data[0]?.arms) ? armsData?.data[0]?.arms : (armsData?.data ?? []);
      setArms(armsWithDetails.map((arm: ArmDetails) => arm.name));
      setArmsDetails(armsWithDetails);
      if (armsWithDetails.length > 0) {
        setArmsEnabled(true);
      }
    }
  }, [armsData]);

  useEffect(() => {
    if (departmentsData) {
      const departmentsDetails = Array.isArray(departmentsData?.data[0]?.departments)
        ? departmentsData?.data[0]?.departments
        : (departmentsData?.data ?? []);

      const names: string[] = departmentsDetails.map((dept: DepartmentWithSubjects) => dept.name);
      setDepartments(names);
      setDepartmentsDetails(departmentsDetails);

      if (names.length > 0) {
        setDepartmentsEnabled(true);
      }
    }
  }, [departmentsData]);

  const [subjectResetSignal, setSubjectResetSignal] = useState(0);
  const [armResetSignal, setArmResetSignal] = useState(0);
  const [deptResetSignal, setDeptResetSignal] = useState(0);
  const [sessionAddedDepartments, setSessionAddedDepartments] = useState<string[]>([]);

  const { data: allSubjectsData, isFetching: isLoadingAllSubjects } = useGetAllSubjects();
  const { data: allArmsData, isFetching: isLoadingAllArms } = useGetAllArms(branchId);
  const { data: allDepartmentsData, isFetching: isLoadingAllDepts } = useGetDepartments();

  const allSubjectNames: string[] = (
    Array.isArray(allSubjectsData) ? allSubjectsData : Array.isArray(allSubjectsData?.data) ? allSubjectsData.data : []
  ).map((s: { name: string }) => s.name);

  const allArmNames: string[] = [
    ...new Set<string>(
      (Array.isArray(allArmsData) ? allArmsData : Array.isArray(allArmsData?.data) ? allArmsData.data : []).map(
        (a: { armName: string }) => a.armName,
      ),
    ),
  ];

  const allDeptNames: string[] = (
    Array.isArray(allDepartmentsData) ? allDepartmentsData : Array.isArray(allDepartmentsData?.data) ? allDepartmentsData.data : []
  ).map((d: { name: string }) => d.name);

  const availableSubjects = allSubjectNames.filter(n => !subjects.includes(n));
  const availableArms = allArmNames.filter(n => !arms.includes(n));
  const availableDepts = allDeptNames.filter(n => !departments.includes(n));

  const formik = useFormik({
    initialValues: {
      levelName: level?.levelName || "",
      classNamePrefix: level?.classNamePrefix || "",
      startClass: level?.classStart,
      endClass: level?.classEnd,
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

  const handleSaveSubjects = (names: string[]) => {
    if (!names.length) return;
    mutateSubject(
      { names, levelType: level.levelType, branchId, branchSpecific },
      {
        onSuccess: () => {
          setSubjectResetSignal(s => s + 1);
          toast({ title: "Subject(s) added", description: "Subjects have been updated successfully", type: "success" });
        },
        onError: error => {
          toast({
            title: "Failed to add subjects",
            description: (error as { message?: string })?.message || "Could not add subjects",
            type: "error",
          });
        },
      },
    );
  };

  const handleSaveArms = (names: string[]) => {
    if (!names.length) return;
    mutateArm(
      { names, levelType: level.levelType, branchId, branchSpecific },
      {
        onSuccess: () => {
          setLevelDataEnabled(true);
          setArmResetSignal(s => s + 1);
          toast({ title: "Arm(s) added", description: "Arms have been updated successfully", type: "success" });
        },
        onError: error => {
          toast({ title: "Failed to add arms", description: (error as { message?: string })?.message || "Could not add arms", type: "error" });
        },
      },
    );
  };

  const handleSaveDepartments = (names: string[]) => {
    if (!names.length) return;
    mutateDepartment(
      { names, levelType: level.levelType, branchId, branchSpecific },
      {
        onSuccess: () => {
          setLevelDataEnabled(true);
          setDepartmentsEnabled(true);
          setSessionAddedDepartments(prev => [...new Set([...prev, ...names])]);
          setDeptResetSignal(s => s + 1);
          toast({ title: "Department(s) added", description: "Departments have been updated successfully", type: "success" });
        },
        onError: error => {
          toast({
            title: "Failed to add departments",
            description: (error as { message?: string })?.message || "Could not add departments",
            type: "error",
          });
        },
      },
    );
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
        {touched.levelName && errors.levelName && typeof errors.levelName === "string" && (
          <p className="text-text-destructive text-xs font-light">{errors.levelName}</p>
        )}
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
        {touched.classNamePrefix && errors.classNamePrefix && typeof errors.classNamePrefix === "string" && (
          <p className="text-text-destructive text-xs font-light">{errors.classNamePrefix}</p>
        )}
        {/* <small className="text-text-muted text-xs">Select the label that appears before the class number or type a custom one</small> */}
        <small className="text-text-muted text-xs">Enter the label that appears before the class number</small>
        <br />
        <small className="text-text-muted text-xs">(eg: Creche, Nursery, Grade, Primary, Form, JSS, SSS etc.)</small>
      </div>

      <div className="border-border-default flex flex-col gap-6 border-b pb-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex w-full flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Start level</Label>
            <Select
              value={values.startClass != null ? `${values.startClass}` : undefined}
              onValueChange={startClass => formik.setFieldValue("startClass", startClass)}
            >
              <SelectTrigger className="bg-bg-input-soft! h-9! w-full border-none">
                <SelectValue>
                  <span className="text-text-muted text-sm font-normal">{values.startClass ? values.startClass : "Select start level"}</span>
                </SelectValue>
              </SelectTrigger>
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
            <Label className="text-text-default text-sm font-medium">End level</Label>
            <Select
              value={values.endClass != null ? `${values.endClass}` : undefined}
              onValueChange={endClass => formik.setFieldValue("endClass", endClass)}
            >
              <SelectTrigger className="bg-bg-input-soft! h-9! w-full border-none">
                <SelectValue>
                  <span className="text-text-muted text-sm font-normal">{values.endClass ? values.endClass : "Select end level"}</span>
                </SelectValue>
              </SelectTrigger>
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

        <Button
          disabled={!formik.dirty || isPending}
          type="button"
          onClick={() => formik.handleSubmit()}
          className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! flex h-7 w-17 items-center gap-1 self-end rounded-sm px-2 py-1"
        >
          {isPending && <Spinner className="text-text-white-default" />}
          Save
        </Button>
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
              <Toggle
                withBorder={false}
                checked={departmentsEnabled}
                onChange={e => {
                  const enable = (e.target as HTMLInputElement).checked;
                  setDepartmentsEnabled(enable);
                  toggleDepartment(
                    { levelId: level.id, enable },
                    {
                      onError: (error: unknown) => {
                        setDepartmentsEnabled(!enable);
                        toast({
                          title: "Failed to update departments",
                          description: (error as { message?: string })?.message || "Could not update department setting",
                          type: "error",
                        });
                      },
                    },
                  );
                }}
              />
            </div>
            {departmentsEnabled && (
              <>
                <div className="border-border-default flex flex-col gap-4 border-b pb-6">
                  <div className="text-text-default text-sm font-medium">Departments</div>
                  <LevelItemsSection
                    existingItems={departments}
                    globalOptions={availableDepts}
                    isLoadingOptions={isLoadingAllDepts}
                    onSave={handleSaveDepartments}
                    isPending={isAddingDepartment}
                    placeholder="Search or type new departments e.g Science, Arts"
                    resetSignal={deptResetSignal}
                    defaultChecked={sessionAddedDepartments}
                  />
                </div>

                {sessionAddedDepartments.length > 0 && departmentsDetails.filter(d => sessionAddedDepartments.includes(d.name)).length > 0 && (
                  <>
                    <div className="text-text-default text-xl font-semibold">Department Subjects</div>
                    {departmentsDetails
                      .filter(d => sessionAddedDepartments.includes(d.name))
                      .map((dept, index) => (
                        <DepartmentSubjectsSection
                          key={`${dept.departmentId}-${index}`}
                          dept={dept}
                          levelId={level.id}
                          branchId={branchId}
                          branchSpecific={branchSpecific}
                        />
                      ))}
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* Subjects */}
        {!departmentsEnabled && (
          <div className="flex flex-col gap-4">
            <div className="text-text-default text-xl font-semibold">Subjects</div>
            <LevelItemsSection
              existingItems={subjects}
              globalOptions={availableSubjects}
              isLoadingOptions={isLoadingAllSubjects}
              onSave={handleSaveSubjects}
              isPending={isAddingSubject}
              placeholder="Search or type new subjects e.g Mathematics, English"
              resetSignal={subjectResetSignal}
            />
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
              <LevelItemsSection
                existingItems={arms}
                globalOptions={availableArms}
                isLoadingOptions={isLoadingAllArms}
                onSave={handleSaveArms}
                isPending={isAddingArm}
                placeholder="Search or type new arms e.g A, B, C"
                resetSignal={armResetSignal}
              />
            )}
          </div>
        </div>

        {/* {departmentsEnabled && <AssignArmsToDepartments arms={arms} departments={departments} />} */}
        {departmentsEnabled && armsDetails.length > 0 && departmentsDetails.length > 0 && (
          <AssignArmsToDepartments arms={armsDetails} departments={departmentsDetails} levelId={level.id} branchId={branchId} />
        )}
      </div>
    </div>
  );

  return (
    <div className="">
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

              <div className="border-border-default bg-bg-card flex items-center justify-between border-t px-6 py-4">
                <Button
                  onClick={() => setSheetOpen(false)}
                  variant="outline"
                  className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle hover:text-text-subtle h-7 border-none px-2 py-1 text-sm font-medium"
                >
                  Cancel
                </Button>

                <Button
                  onClick={() => setSheetOpen(false)}
                  variant="outline"
                  className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-7 border-none px-2 py-1 text-sm font-medium"
                >
                  Save
                </Button>
              </div>
            </SheetContent>
          </div>
        </Sheet>
      )}

      {/* Mobile */}
      {isMobile && (
        <MobileDrawer open={sheetOpen} setIsOpen={setSheetOpen} title="Quick Setup" showCloseButton={true}>
          {contentNode}

          <div className="border-border-default bg-bg-card flex items-center justify-between border-t px-6 py-4">
            <Button
              onClick={() => setSheetOpen(false)}
              variant="outline"
              className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle hover:text-text-subtle h-7 border-none px-2 py-1 text-sm font-medium"
            >
              Cancel
            </Button>

            <Button
              onClick={() => setSheetOpen(false)}
              variant="outline"
              className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-7 border-none px-2 py-1 text-sm font-medium"
            >
              Save
            </Button>
          </div>
        </MobileDrawer>
      )}
    </div>
  );
};
