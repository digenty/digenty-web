import { Lock } from "@digenty/icons";
import { ArmDetails, ClassLevel, DepartmentWithSubjects } from "@/api/types";

import { MobileDrawer } from "@/components/MobileDrawer";
import { PermissionCheck } from "@/components/ModulePermissionsWrapper/PermissionCheck";
import { toast } from "@/components/Toast";
import { Toggle } from "@/components/Toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { useAddArm, useDeleteArm, useGetAllArms, useGetArmsByLevel } from "@/hooks/queryHooks/useArm";
import {
  useAddDepartmentsToLevel,
  useCreateDepartmentSubjects,
  useDeleteDepartmentFromLevel,
  useDeleteDepartmentSubjects,
  useGetDepartmentSubjectsByLevel,
  useGetDepartmentsByLevel,
  useGetDepartments,
  useToggleDepartmentForLevel,
} from "@/hooks/queryHooks/useDepartment";
import { useUpdateLevel } from "@/hooks/queryHooks/useLevel";
import { useAddSubject, useDeleteSubject, useGetAllSubjects, useGetSubjectsByLevel, useUpdateSubjectByLevel } from "@/hooks/queryHooks/useSubject";
import { useIsMobile } from "@/hooks/useIsMobile";
import { canManageSettings } from "@/lib/permissions/settings";
import { cn, toTitleCase } from "@/lib/utils";
import { armKeys } from "@/queries/arm";
import { departmentKeys } from "@/queries/department";
import { subjectKeys } from "@/queries/subject";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { AssignArmsToDepartments } from "./AssignArmsToDepartments";
import { LevelItemsSection } from "./LevelItemsSection";
import { getApiErrorMessage } from "@/lib/apiError";

const startclasses = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const endClasses = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

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
  const [deletingSubjectName, setDeletingSubjectName] = useState<string | null>(null);

  const { data: deptSubjectsData } = useGetDepartmentSubjectsByLevel(dept.departmentId, levelId);
  const { data: allSubjectsData, isFetching: isLoadingAllSubjects } = useGetAllSubjects();
  const { mutate: mutateCreateDeptSubjects, isPending: isAddingSubject } = useCreateDepartmentSubjects();
  const { mutate: mutateDeleteDeptSubject } = useDeleteDepartmentSubjects();

  const existingSubjects = (deptSubjectsData?.data as { subjectId: number; subjectName: string }[] | undefined) ?? [];
  const existingSubjectNames = existingSubjects.map(s => s.subjectName);

  const allSubjectNames: string[] = (
    Array.isArray(allSubjectsData) ? allSubjectsData : Array.isArray(allSubjectsData?.data) ? allSubjectsData.data : []
  ).map((s: { name: string }) => s.name);

  const availableSubjects = allSubjectNames.filter(n => !existingSubjectNames.includes(n));

  const handleAdd = (names: string[]) => {
    mutateCreateDeptSubjects(
      { departmentName: dept.name, subjectNames: names, branchId, branchSpecific },
      {
        onSuccess: () => {
          toast({ title: "Subject(s) added", description: `Subjects added to ${dept.name} successfully`, type: "success" });
        },
        onError: error => {
          toast({
            title: "Failed to add subjects",
            description: getApiErrorMessage(error, "Could not add subjects"),
            type: "error",
          });
        },
      },
    );
  };

  const handleDelete = (name: string) => {
    const subject = existingSubjects.find(s => s.subjectName === name);
    if (!subject) return;
    setDeletingSubjectName(name);
    mutateDeleteDeptSubject(
      { departmentId: dept.departmentId, subjectId: subject.subjectId },
      {
        onSuccess: () => {
          setDeletingSubjectName(null);
          toast({ title: "Subject removed", description: `"${name}" removed from ${dept.name}`, type: "success" });
        },
        onError: error => {
          setDeletingSubjectName(null);
          toast({
            title: "Failed to remove subject",
            description: getApiErrorMessage(error, "Could not remove subject"),
            type: "error",
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <Label className="text-text-default text-sm font-medium">{toTitleCase(dept.name)} Subjects</Label>
      <LevelItemsSection
        existingItems={existingSubjectNames}
        globalOptions={availableSubjects}
        isLoadingOptions={isLoadingAllSubjects}
        onAdd={handleAdd}
        onDelete={handleDelete}
        isAdding={isAddingSubject}
        deletingName={deletingSubjectName}
        placeholder={`Search or add subjects to ${toTitleCase(dept.name)}`}
        twoPerRow
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
  const [subjectsDetails, setSubjectsDetails] = useState<{ id: number; name: string }[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [arms, setArms] = useState<string[]>([]);
  const [armsDetails, setArmsDetails] = useState<ArmDetails[]>([]);
  const [departmentsDetails, setDepartmentsDetails] = useState<DepartmentWithSubjects[]>([]);
  const [departmentsEnabled, setDepartmentsEnabled] = useState(false);
  const [isLevelDetailsSaved, setIsLevelDetailsSaved] = useState(
    Boolean(level?.levelName && level?.classNamePrefix && level?.classStart && level?.classEnd),
  );
  // Separate from isLevelDetailsSaved: that one is a data-presence check (true the moment a
  // level exists, since the backend defaults classNamePrefix/classStart/classEnd on creation)
  // and is only meant to unlock the arms/subjects section when reopening an already-configured
  // level. Closing should only be blocked once the user has actually saved in *this* sheet.
  const [hasSavedLevelDetailsThisSession, setHasSavedLevelDetailsThisSession] = useState(false);
  const [deletingSubjectName, setDeletingSubjectName] = useState<string | null>(null);
  const [renamingSubjectName, setRenamingSubjectName] = useState<string | null>(null);
  const [deletingArmName, setDeletingArmName] = useState<string | null>(null);
  const [deletingDepartmentName, setDeletingDepartmentName] = useState<string | null>(null);

  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useUpdateLevel();
  const { mutate: mutateSubject, isPending: isAddingSubject } = useAddSubject();
  const { mutate: deleteSubject } = useDeleteSubject();
  const { mutate: renameSubject } = useUpdateSubjectByLevel();
  const { mutate: mutateArm, isPending: isAddingArm } = useAddArm();
  const { mutate: deleteArm } = useDeleteArm();
  const { mutate: mutateDepartment, isPending: isAddingDepartment } = useAddDepartmentsToLevel();
  const { mutate: deleteDepartment } = useDeleteDepartmentFromLevel();
  const { mutate: toggleDepartment } = useToggleDepartmentForLevel();

  const { data: subjectsData } = useGetSubjectsByLevel(level?.levelType, branchId);
  // Bug 1 fix: always fetch arms — previously gated behind levelDataEnabled which meant
  // existing arms were invisible when reopening the sheet for an already-configured level.
  const { data: armsData } = useGetArmsByLevel(level?.levelType, branchId);
  const { data: departmentsData } = useGetDepartmentsByLevel(level?.levelType, branchId);

  useEffect(() => {
    if (subjectsData) {
      const list: { id: number; name: string }[] = Array.isArray(subjectsData?.data[0]?.subjects)
        ? subjectsData?.data[0]?.subjects
        : (subjectsData?.content ?? subjectsData?.data ?? []);
      setSubjectsDetails(list);
      setSubjects(list.map(s => s.name));
    }
  }, [subjectsData]);

  useEffect(() => {
    if (armsData) {
      const armsWithDetails = Array.isArray(armsData?.data[0]?.arms) ? armsData?.data[0]?.arms : (armsData?.data ?? []);
      setArms(armsWithDetails.map((arm: ArmDetails) => arm.name));
      setArmsDetails(armsWithDetails);
    }
  }, [armsData]);

  useEffect(() => {
    if (departmentsData) {
      const deptList = Array.isArray(departmentsData?.data[0]?.departments) ? departmentsData?.data[0]?.departments : (departmentsData?.data ?? []);
      const names: string[] = deptList.map((dept: DepartmentWithSubjects) => dept.name);
      setDepartments(names);
      setDepartmentsDetails(deptList);
      if (names.length > 0) {
        setDepartmentsEnabled(true);
      }
    }
  }, [departmentsData]);

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
            setIsLevelDetailsSaved(true);
            setHasSavedLevelDetailsThisSession(true);
            toast({ title: "Level updated successfully", description: "The level has been updated", type: "success" });
          },
          onError: error => {
            toast({ title: "Failed to update level", description: getApiErrorMessage(error, "Could not update level"), type: "error" });
          },
        },
      );
    },
  });

  const { values, errors, touched, handleChange, handleBlur } = formik;

  const handleAddSubject = (names: string[]) => {
    const newNames = names.filter(n => !subjects.includes(n));
    if (!newNames.length) return;
    mutateSubject(
      { names: newNames, levelType: level.levelType, branchId, branchSpecific },
      {
        onSuccess: () => {
          queryClient.refetchQueries({ queryKey: subjectKeys.subjectsByLevel(level.levelType, branchId) });
          toast({ title: "Subject(s) added", description: "Subjects have been updated successfully", type: "success" });
        },
        onError: error => {
          toast({
            title: "Failed to add subjects",
            description: getApiErrorMessage(error, "Could not add subjects"),
            type: "error",
          });
        },
      },
    );
  };

  const handleDeleteSubject = (name: string) => {
    const subject = subjectsDetails.find(s => s.name === name);
    if (!subject) return;
    setDeletingSubjectName(name);
    deleteSubject(
      { subjectId: subject.id, levelId: level.id },
      {
        onSuccess: () => {
          setDeletingSubjectName(null);
          queryClient.refetchQueries({ queryKey: subjectKeys.subjectsByLevel(level.levelType, branchId) });
          toast({ title: "Subject removed", description: `"${name}" removed successfully`, type: "success" });
        },
        onError: error => {
          setDeletingSubjectName(null);
          toast({
            title: "Failed to remove subject",
            description: getApiErrorMessage(error, "Could not remove subject"),
            type: "error",
          });
        },
      },
    );
  };

  const handleRenameSubject = (oldName: string, newName: string) => {
    const subject = subjectsDetails.find(s => s.name === oldName);
    if (!subject) return;
    setRenamingSubjectName(oldName);
    renameSubject(
      { subjectId: subject.id, levelId: level.id, name: newName },
      {
        onSuccess: () => {
          setRenamingSubjectName(null);
          queryClient.refetchQueries({ queryKey: subjectKeys.subjectsByLevel(level.levelType, branchId) });
          toast({ title: "Subject renamed", description: `"${toTitleCase(oldName)}" renamed to "${toTitleCase(newName)}"`, type: "success" });
        },
        onError: error => {
          setRenamingSubjectName(null);
          toast({ title: "Failed to rename subject", description: getApiErrorMessage(error, "Could not rename subject"), type: "error" });
        },
      },
    );
  };

  const handleAddArm = (names: string[]) => {
    const newNames = names.filter(n => !arms.includes(n));
    if (!newNames.length) return;
    mutateArm(
      { names: newNames, levelType: level.levelType, branchId, branchSpecific },
      {
        onSuccess: () => {
          queryClient.refetchQueries({ queryKey: armKeys.armsByLevel(level.levelType, branchId) });
          toast({ title: "Arm(s) added", description: "Arms have been updated successfully", type: "success" });
        },
        onError: error => {
          toast({ title: "Failed to add arms", description: getApiErrorMessage(error, "Could not add arms"), type: "error" });
        },
      },
    );
  };

  const handleDeleteArm = (name: string) => {
    setDeletingArmName(name);
    deleteArm(
      { armName: name, levelId: level.id },
      {
        onSuccess: () => {
          setDeletingArmName(null);
          queryClient.refetchQueries({ queryKey: armKeys.armsByLevel(level.levelType, branchId) });
          toast({ title: "Arm removed", description: `"${name}" removed successfully`, type: "success" });
        },
        onError: error => {
          setDeletingArmName(null);
          toast({ title: "Failed to remove arm", description: getApiErrorMessage(error, "Could not remove arm"), type: "error" });
        },
      },
    );
  };

  const handleAddDepartment = (names: string[]) => {
    const newNames = names.filter(n => !departments.includes(n));
    if (!newNames.length) return;
    mutateDepartment(
      { names: newNames, levelType: level.levelType, branchId, branchSpecific },
      {
        onSuccess: () => {
          setDepartmentsEnabled(true);
          queryClient.refetchQueries({ queryKey: departmentKeys.departmentsByLevel(level.levelType, branchId) });
          toast({ title: "Department(s) added", description: "Departments have been updated successfully", type: "success" });
        },
        onError: error => {
          toast({
            title: "Failed to add departments",
            description: getApiErrorMessage(error, "Could not add departments"),
            type: "error",
          });
        },
      },
    );
  };

  const handleDeleteDepartment = (name: string) => {
    const dept = departmentsDetails.find(d => d.name === name);
    if (!dept) return;
    setDeletingDepartmentName(name);
    deleteDepartment(
      { departmentId: dept.departmentId, levelId: level.id },
      {
        onSuccess: () => {
          setDeletingDepartmentName(null);
          queryClient.refetchQueries({ queryKey: departmentKeys.departmentsByLevel(level.levelType, branchId) });
          toast({ title: "Department removed", description: `"${name}" removed successfully`, type: "success" });
        },
        onError: error => {
          setDeletingDepartmentName(null);
          toast({
            title: "Failed to remove department",
            description: getApiErrorMessage(error, "Could not remove department"),
            type: "error",
          });
        },
      },
    );
  };

  const previewClassNames = useMemo(() => {
    const prefix = values.classNamePrefix.trim();
    const start = Number(values.startClass);
    const end = Number(values.endClass);
    if (!prefix || !values.startClass || !values.endClass || Number.isNaN(start) || Number.isNaN(end) || start > end) return [];
    const names: string[] = [];
    for (let n = start; n <= end; n++) names.push(`${toTitleCase(prefix)} ${n}`);
    return names;
  }, [values.classNamePrefix, values.startClass, values.endClass]);

  const exampleArmPrefix = values.classNamePrefix.trim() ? `${toTitleCase(values.classNamePrefix.trim())} 1` : "Primary 1";

  const contentNode = (
    <div className={cn("flex w-full flex-col gap-8 py-6", isMobile ? "px-4" : "px-6")}>
      <div className="text-text-default flex flex-col gap-2 text-xl font-semibold">
        <span>Customize Level</span>
        <p className="text-text-muted text-sm font-normal">
          This sets up how classes in this level are named, and what subjects and groups they have. You can still fine-tune each individual class
          afterwards.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <span className="bg-bg-state-soft text-text-default flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
            1
          </span>
          <span className="text-text-default text-xl font-semibold">Level Basics</span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="levelName" className="text-text-default text-sm font-medium">
            Level name<small className="text-text-destructive text-xs">*</small>
          </Label>
          <Input
            id="levelName"
            onChange={handleChange}
            placeholder={toTitleCase(level?.levelName ?? "")}
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
          <span className="text-text-muted text-xs">What this stage of schooling is called throughout the app, e.g. &quot;Primary&quot;.</span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="classNamePrefix" className="text-text-default text-sm font-medium">
            Class Label<small className="text-text-destructive text-xs">*</small>
          </Label>
          <Input
            id="classNamePrefix"
            onChange={handleChange}
            placeholder="e.g Primary, JSS, SSS"
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
          <span className="text-text-muted text-xs">
            The word that comes before the class number (e.g. Creche, Nursery, Grade, Primary, Form, JSS, SSS).
          </span>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">First class number</Label>
            <Select
              value={values.startClass != null ? `${values.startClass}` : undefined}
              onValueChange={startClass => formik.setFieldValue("startClass", startClass)}
            >
              <SelectTrigger className="bg-bg-input-soft! h-9! w-full border-none">
                <SelectValue placeholder="e.g. 1" />
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                {startclasses.map(str => (
                  <SelectItem key={str} value={str} className="text-text-default text-sm font-medium">
                    {str}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-text-muted text-xs">
              The number of the first class in this level — not a separate level (e.g. 1 for Primary 1).
            </span>
          </div>
          <div className="flex w-full flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Last class number</Label>
            <Select
              value={values.endClass != null ? `${values.endClass}` : undefined}
              onValueChange={endClass => formik.setFieldValue("endClass", endClass)}
            >
              <SelectTrigger className="bg-bg-input-soft! h-9! w-full border-none">
                <SelectValue placeholder="e.g. 6" />
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                {endClasses.map(str => (
                  <SelectItem key={str} value={str} className="text-text-default text-sm font-medium">
                    {str}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-text-muted text-xs">The number of the last class in this level (e.g. 6 for Primary 6).</span>
          </div>
        </div>

        {previewClassNames.length > 0 && (
          <div className="bg-bg-input-soft border-border-default flex flex-col gap-2 rounded-md border p-3">
            <span className="text-text-default text-xs font-medium">This will create these classes:</span>
            <div className="flex flex-wrap gap-2">
              {previewClassNames.map(name => (
                <span key={name} className="bg-bg-badge-gray text-text-default rounded-md px-2 py-1 text-xs">
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="border-border-default flex border-b pb-6">
          <PermissionCheck permissionUtility={canManageSettings}>
            <Button
              disabled={!formik.dirty || isPending}
              type="button"
              onClick={() => formik.handleSubmit()}
              className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! flex h-7 w-fit items-center gap-1 self-end rounded-sm px-3 py-1"
            >
              {isPending && <Spinner className="text-text-white-default" />}
              Save Level Basics
            </Button>
          </PermissionCheck>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <span className="bg-bg-state-soft text-text-default flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
            2
          </span>
          <span className="text-text-default text-xl font-semibold">Subjects &amp; Departments</span>
          {!isLevelDetailsSaved && <Lock fill="var(--color-icon-default-muted)" className="size-3.5" />}
        </div>

        {!isLevelDetailsSaved ? (
          <p className="text-text-subtle text-xs">Save Level Basics above first to unlock this step.</p>
        ) : (
          <fieldset className="m-0 flex flex-col gap-6 border-0 p-0">
            {/* Departments */}
            {(level?.levelType === "JUNIOR_SECONDARY" || level?.levelType === "SENIOR_SECONDARY") && (
              <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between gap-2">
                  <div className="">
                    <div className="text-text-default text-sm font-medium">Enable Departments</div>
                    <div className="text-text-subtle text-sm">
                      Departments split this level into separate academic paths, each with its own subjects. Example: Science and Arts classes under
                      Senior Secondary.
                    </div>
                  </div>
                  <PermissionCheck permissionUtility={canManageSettings}>
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
                                description: getApiErrorMessage(error, "Could not update department setting"),
                                type: "error",
                              });
                            },
                          },
                        );
                      }}
                    />
                  </PermissionCheck>
                </div>
                {departmentsEnabled && (
                  <>
                    <div className="border-border-default flex flex-col gap-4 border-b pb-6">
                      <div className="text-text-default text-sm font-medium">Departments</div>
                      <LevelItemsSection
                        existingItems={departments}
                        globalOptions={availableDepts}
                        isLoadingOptions={isLoadingAllDepts}
                        onAdd={handleAddDepartment}
                        onDelete={handleDeleteDepartment}
                        isAdding={isAddingDepartment}
                        deletingName={deletingDepartmentName}
                        placeholder="Search or type new departments e.g Science, Arts"
                      />
                    </div>

                    {departmentsDetails.length > 0 && (
                      <>
                        <div className="text-text-default text-sm font-medium">Department Subjects</div>
                        {departmentsDetails.map((dept, index) => (
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
                <div className="text-text-default text-sm font-medium">Subjects taught in this level</div>
                <LevelItemsSection
                  existingItems={subjects}
                  globalOptions={availableSubjects}
                  isLoadingOptions={isLoadingAllSubjects}
                  onAdd={handleAddSubject}
                  onDelete={handleDeleteSubject}
                  onRename={handleRenameSubject}
                  isAdding={isAddingSubject}
                  deletingName={deletingSubjectName}
                  renamingName={renamingSubjectName}
                  placeholder="Search or type new subjects e.g Mathematics, English"
                  twoPerRow
                />
              </div>
            )}
          </fieldset>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <span className="bg-bg-state-soft text-text-default flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
            3
          </span>
          <span className="text-text-default text-xl font-semibold">
            Arms<small className="text-text-destructive text-xs">*</small>
          </span>
          {!isLevelDetailsSaved && <Lock fill="var(--color-icon-default-muted)" className="size-3.5" />}
        </div>

        {!isLevelDetailsSaved ? (
          <p className="text-text-subtle text-xs">Save Level Basics above first to unlock this step.</p>
        ) : (
          <fieldset className="m-0 flex flex-col gap-6 border-0 p-0">
            <span className="text-text-subtle text-sm">
              Arms split a class into smaller parallel groups. Example: {exampleArmPrefix}A, {exampleArmPrefix}B. Name them however your school does —
              letters, colours, numbers, or anything else. At least one arm is required.
            </span>
            <LevelItemsSection
              existingItems={arms}
              globalOptions={availableArms}
              isLoadingOptions={isLoadingAllArms}
              onAdd={handleAddArm}
              onDelete={handleDeleteArm}
              isAdding={isAddingArm}
              deletingName={deletingArmName}
              placeholder="Search or type new arms e.g A, B or Gold, Silver"
            />
            {arms.length === 0 && <p className="text-text-destructive text-xs font-light">Add at least one arm before you can close this setup.</p>}

            {departmentsEnabled && armsDetails.length > 0 && departmentsDetails.length > 0 && (
              <AssignArmsToDepartments arms={armsDetails} departments={departmentsDetails} levelId={level.id} branchId={branchId} />
            )}
          </fieldset>
        )}
      </div>
    </div>
  );

  const handleSheetOpenChange = (open: boolean) => {
    // Arms only become required once the class itself has been saved in this session — before
    // that, nothing has actually been added yet, so there's nothing to enforce.
    if (!open && hasSavedLevelDetailsThisSession && arms.length === 0) {
      toast({ title: "Arms required", description: "Add at least one arm before closing this setup.", type: "error" });
      return;
    }
    setSheetOpen(open);
  };

  return (
    <div className="">
      {!isMobile && (
        <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
          <div>
            <SheetContent className="bg-bg-card border-border-default mt-4 mr-4 hidden overflow-y-auto rounded-md border md:block md:min-w-130">
              <SheetHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
                <VisuallyHidden>
                  <SheetTitle>Set Up Classes</SheetTitle>
                </VisuallyHidden>
                <div className="flex items-center justify-between">
                  <div className="text-text-default text-md font-semibold">Set Up Classes</div>
                </div>
              </SheetHeader>

              {contentNode}

              <div className="border-border-default bg-bg-card flex items-center justify-between border-t px-6 py-4">
                <Button
                  onClick={() => handleSheetOpenChange(false)}
                  variant="outline"
                  className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle hover:text-text-subtle h-7 border-none px-2 py-1 text-sm font-medium"
                >
                  Cancel
                </Button>

                <Button
                  onClick={() => handleSheetOpenChange(false)}
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
        <MobileDrawer
          open={sheetOpen}
          setIsOpen={handleSheetOpenChange}
          title="Set Up Classes"
          showCloseButton={true}
          className="flex max-h-[85vh] flex-col overflow-hidden"
        >
          <div className="min-h-0 flex-1 overflow-y-auto">{contentNode}</div>

          <div className="border-border-default bg-bg-card flex shrink-0 items-center justify-between border-t px-6 py-4">
            <Button
              onClick={() => handleSheetOpenChange(false)}
              variant="outline"
              className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle hover:text-text-subtle h-7 border-none px-2 py-1 text-sm font-medium"
            >
              Cancel
            </Button>

            <Button
              onClick={() => handleSheetOpenChange(false)}
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
