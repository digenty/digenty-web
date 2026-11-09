import { ArmDetails, ClassLevel, DepartmentWithSubjects } from "@/api/types";

import { MobileDrawer } from "@/components/MobileDrawer";
import { PermissionCheck } from "@/components/ModulePermissionsWrapper/PermissionCheck";
import { toast } from "@/components/Toast";
import { Toggle } from "@/components/Toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { useAddArmToClass, useDeleteArmFromClass, useGetAllArms, useGetArmsByClass } from "@/hooks/queryHooks/useArm";
import { useGetClassDetails, useUpdateClass } from "@/hooks/queryHooks/useClass";
import {
  useAddDepartmentToClass,
  useCreateDepartmentSubjects,
  useDeleteDepartmentFromClass,
  useDeleteDepartmentSubjects,
  useGetDepartments,
  useGetDepartmentsByClass,
  useGetDepartmentSubjectsByClass,
} from "@/hooks/queryHooks/useDepartment";
import {
  useAddSubjectToClass,
  useDeleteSubjectFromClass,
  useGetAllSubjects,
  useGetSubjectsByClass,
  useUpdateSubjectByClass,
} from "@/hooks/queryHooks/useSubject";
import { armKeys } from "@/queries/arm";
import { departmentKeys } from "@/queries/department";
import { subjectKeys } from "@/queries/subject";
import { useIsMobile } from "@/hooks/useIsMobile";
import { canManageSettings } from "@/lib/permissions/settings";
import { cn, toTitleCase } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as yup from "yup";
import { AssignArmsToDepartments } from "./AssignArmsToDepartments";
import { LevelItemsSection } from "./LevelItemsSection";
import { getApiErrorMessage } from "@/lib/apiError";

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
  const { data: deptSubjectsData } = useGetDepartmentSubjectsByClass(dept.departmentId, levelId);
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
          toast({ title: "Subjects added", description: `Subjects for ${toTitleCase(dept.name)} updated successfully`, type: "success" });
        },
        onError: error => {
          toast({
            title: "Failed to add subjects",
            description: getApiErrorMessage(error, `Could not add subjects to ${toTitleCase(dept.name)}`),
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
          toast({ title: "Subject removed", description: `"${toTitleCase(name)}" removed from ${toTitleCase(dept.name)}`, type: "success" });
        },
        onError: error => {
          setDeletingSubjectName(null);
          toast({
            title: "Failed to remove subject",
            description: getApiErrorMessage(error, `Could not remove "${toTitleCase(name)}"`),
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

export const ClassEditSheet = ({
  level,
  branchId,
  sheetOpen,
  setSheetOpen,
  classId,
  branchSpecific,
}: {
  level: ClassLevel | null;
  branchId?: number;
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  classId: number | null;
  branchSpecific: boolean;
}) => {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [arms, setArms] = useState<string[]>([]);
  const [armsDetails, setArmsDetails] = useState<ArmDetails[]>([]);
  const [departmentsDetails, setDepartmentsDetails] = useState<DepartmentWithSubjects[]>([]);
  const [departmentsEnabled, setDepartmentsEnabled] = useState(false);
  const [armsEnabled, setArmsEnabled] = useState(false);
  const [deletingSubjectName, setDeletingSubjectName] = useState<string | null>(null);
  const [renamingSubjectName, setRenamingSubjectName] = useState<string | null>(null);
  const [deletingArmName, setDeletingArmName] = useState<string | null>(null);
  const [deletingDepartmentName, setDeletingDepartmentName] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const { mutate: updateClass, isPending: isUpdatingClass } = useUpdateClass();
  const { mutate: mutateSubject, isPending: isAddingSubject } = useAddSubjectToClass();
  const { mutate: deleteSubject } = useDeleteSubjectFromClass();
  const { mutate: renameSubject } = useUpdateSubjectByClass();
  const { mutate: deleteArm } = useDeleteArmFromClass();
  const { mutate: mutateArm, isPending: isAddingArm } = useAddArmToClass();
  const { mutate: mutateDepartment, isPending: isAddingDepartment } = useAddDepartmentToClass();
  const { mutate: deleteDepartment } = useDeleteDepartmentFromClass();
  const { data: classData } = useGetClassDetails(classId);
  const { data: subjectsData } = useGetSubjectsByClass(classData?.data?.name, level?.levelType, branchId);
  const { data: armsData } = useGetArmsByClass(classId);
  const { data: departmentsData } = useGetDepartmentsByClass(classData?.data?.name, level?.levelType, branchId);

  const { data: allSubjectsData, isFetching: isLoadingAllSubjects } = useGetAllSubjects();
  const { data: allArmsData, isFetching: isLoadingAllArms } = useGetAllArms(branchId);
  const { data: allDepartmentsData, isFetching: isLoadingAllDepts } = useGetDepartments();

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
      const armsWithDetails = Array.isArray(armsData?.data[0]?.arms) ? armsData?.data[0]?.arms : (armsData?.content ?? armsData?.data ?? []);

      const names: string[] = armsWithDetails.map((s: { name: string }) => s.name);
      setArms(names);
      setArmsDetails(armsWithDetails);
      if (armsWithDetails.length > 0) {
        setArmsEnabled(true);
      }
    }
  }, [armsData]);

  useEffect(() => {
    if (departmentsData) {
      const departmentsList = Array.isArray(departmentsData?.data[0]?.departments)
        ? departmentsData?.data[0]?.departments
        : (departmentsData?.data ?? []);

      const names = departmentsList.map((dept: { name: string }) => dept.name);

      if (names.length > 0) {
        setDepartments(names);
        setDepartmentsDetails(departmentsList);
        setDepartmentsEnabled(true);
      }
    }
  }, [departmentsData]);

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
      className: classData?.data?.name || "",
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      className: yup.string().required("Class name is required"),
    }),
    onSubmit: values => {
      if (values.className !== classData?.data?.name) {
        updateClass(
          { classId, name: values.className },
          {
            onSuccess: () => {
              toast({
                title: "Class updated",
                description: "The class name has been updated successfully",
                type: "success",
              });
              setSheetOpen(false);
            },
            onError: error => {
              toast({
                title: "Failed to update class",
                description: getApiErrorMessage(error, "Could not update class"),
                type: "error",
              });
            },
          },
        );
      } else {
        setSheetOpen(false);
      }
    },
  });

  const { values, errors, touched, handleChange, handleBlur } = formik;

  const addSubject = (names: string[]) => {
    const newSubjects = names.filter(n => !subjects.includes(n));
    if (!newSubjects.length) return;

    mutateSubject(
      { names: newSubjects, className: classData?.data?.name, levelType: level?.levelType || "" },
      {
        onSuccess: () => {
          queryClient.refetchQueries({ queryKey: subjectKeys.subjectsByClass(classData?.data?.name, level?.levelType, branchId) });
          toast({ title: "Subjects added", description: `Subject(s) have been added successfully`, type: "success" });
        },
        onError: error => {
          toast({
            title: "Failed to add subjects",
            description: getApiErrorMessage(error, `Could not add subjects`),
            type: "error",
          });
        },
      },
    );
  };

  const removeSubject = (subjectToRemove: string) => {
    const subjectsList: { id: number; name: string }[] = Array.isArray(subjectsData?.data[0]?.subjects)
      ? subjectsData.data[0].subjects
      : (subjectsData?.content ?? subjectsData?.data ?? []);

    const subjectObj = subjectsList.find(s => s.name === subjectToRemove);
    if (!subjectObj || !classId) return;

    setDeletingSubjectName(subjectToRemove);
    deleteSubject(
      { subjectId: subjectObj.id, classId },
      {
        onSuccess: () => {
          setDeletingSubjectName(null);
          queryClient.refetchQueries({ queryKey: subjectKeys.subjectsByClass(classData?.data?.name, level?.levelType, branchId) });
          toast({ title: "Subject deleted", description: `"${toTitleCase(subjectToRemove)}" has been deleted successfully`, type: "success" });
        },
        onError: error => {
          setDeletingSubjectName(null);
          toast({
            title: "Failed to delete subject",
            description: getApiErrorMessage(error, `Could not delete "${toTitleCase(subjectToRemove)}"`),
            type: "error",
          });
        },
      },
    );
  };

  const handleRenameSubject = (oldName: string, newName: string) => {
    const subjectsList: { id: number; name: string }[] = Array.isArray(subjectsData?.data[0]?.subjects)
      ? subjectsData.data[0].subjects
      : (subjectsData?.content ?? subjectsData?.data ?? []);

    const subjectObj = subjectsList.find(s => s.name === oldName);
    if (!subjectObj || !classId) return;

    setRenamingSubjectName(oldName);
    renameSubject(
      { subjectId: subjectObj.id, classId, name: newName },
      {
        onSuccess: () => {
          setRenamingSubjectName(null);
          queryClient.refetchQueries({ queryKey: subjectKeys.subjectsByClass(classData?.data?.name, level?.levelType, branchId) });
          toast({ title: "Subject renamed", description: `"${toTitleCase(oldName)}" renamed to "${toTitleCase(newName)}"`, type: "success" });
        },
        onError: error => {
          setRenamingSubjectName(null);
          toast({ title: "Failed to rename subject", description: getApiErrorMessage(error, "Could not rename subject"), type: "error" });
        },
      },
    );
  };

  const addArm = (names: string[]) => {
    const newArms = names.filter(n => !arms.includes(n));
    if (!newArms.length) return;

    mutateArm(
      { names: newArms, className: classData?.data?.name, levelType: level?.levelType || "" },
      {
        onSuccess: () => {
          queryClient.refetchQueries({ queryKey: armKeys.armsByClass(classId) });
          toast({ title: "Arms added", description: `Arm(s) have been added successfully`, type: "success" });
        },
        onError: error => {
          toast({ title: "Failed to add arms", description: getApiErrorMessage(error, `Could not add arms`), type: "error" });
        },
      },
    );
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
            setDeletingArmName(null);
            queryClient.refetchQueries({ queryKey: armKeys.armsByClass(classId) });
            toast({
              title: "Arm deleted",
              description: `"${toTitleCase(armToRemove)}" has been deleted successfully`,
              type: "success",
            });
          },
          onError: error => {
            setDeletingArmName(null);
            toast({
              title: "Failed to delete arm",
              description: getApiErrorMessage(error, `Could not delete "${toTitleCase(armToRemove)}"`),
              type: "error",
            });
          },
        },
      );
    } else {
      setArms(arms.filter(arm => arm !== armToRemove));
    }
  };

  const addDepartment = (names: string[]) => {
    if (!level?.levelType || !classData?.data?.name) return;
    const newDepartments = names.filter(n => !departments.includes(n));
    if (!newDepartments.length) return;

    mutateDepartment(
      { names: newDepartments, className: classData.data.name, levelType: level.levelType, branchId, branchSpecific },
      {
        onSuccess: () => {
          queryClient.refetchQueries({ queryKey: departmentKeys.departmentsByClass(classData?.data?.name, level?.levelType, branchId) });
          toast({ title: "Department(s) added", description: "Departments have been updated successfully", type: "success" });
        },
        onError: error => {
          toast({
            title: "Failed to add department",
            description: getApiErrorMessage(error, "Could not add departments"),
            type: "error",
          });
        },
      },
    );
  };

  const removeDepartment = (departmentToRemove: string) => {
    const departmentObj = departmentsDetails.find(d => d.name === departmentToRemove);
    if (!departmentObj || !classId) return;

    setDeletingDepartmentName(departmentToRemove);
    deleteDepartment(
      { departmentId: departmentObj.departmentId, classId },
      {
        onSuccess: () => {
          setDeletingDepartmentName(null);
          queryClient.refetchQueries({ queryKey: departmentKeys.departmentsByClass(classData?.data?.name, level?.levelType, branchId) });
          toast({
            title: "Department deleted",
            description: `"${toTitleCase(departmentToRemove)}" has been deleted successfully`,
            type: "success",
          });
        },
        onError: error => {
          setDeletingDepartmentName(null);
          toast({
            title: "Failed to delete department",
            description: getApiErrorMessage(error, `Could not delete "${toTitleCase(departmentToRemove)}"`),
            type: "error",
          });
        },
      },
    );
  };

  const className = toTitleCase(classData?.data?.name ?? "");
  const exampleArmPrefix = className || "this class";

  const contentNode = (
    <div className={cn("flex w-full flex-col gap-6 py-6", isMobile ? "px-4" : "px-6")}>
      <div className="text-text-default flex flex-col gap-2 text-xl font-semibold">
        <span>Customize Class</span>
        {level && <span className="text-text-muted text-sm font-normal">Level: {toTitleCase(level.levelName)}</span>}
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
                  Departments split this class into separate academic paths, each with its own subjects. Example: Science and Arts.
                </div>
              </div>
              <Toggle withBorder={false} checked={departmentsEnabled} onChange={e => setDepartmentsEnabled((e.target as HTMLInputElement).checked)} />
            </div>
            {departmentsEnabled && (
              <>
                <div className="border-border-default flex flex-col gap-3 border-b pb-6">
                  <div className="text-text-default text-sm font-medium">Departments</div>
                  <LevelItemsSection
                    existingItems={departments}
                    globalOptions={availableDepts}
                    isLoadingOptions={isLoadingAllDepts}
                    onAdd={addDepartment}
                    onDelete={removeDepartment}
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
            <div className="text-text-default text-xl font-semibold">Subjects</div>
            <LevelItemsSection
              existingItems={subjects}
              globalOptions={availableSubjects}
              isLoadingOptions={isLoadingAllSubjects}
              onAdd={addSubject}
              onDelete={removeSubject}
              onRename={handleRenameSubject}
              isAdding={isAddingSubject}
              deletingName={deletingSubjectName}
              renamingName={renamingSubjectName}
              placeholder="Search or type new subjects e.g Mathematics, English"
              twoPerRow
            />
          </div>
        )}

        <div>
          {/* Arms */}
          <div className="space-y-6">
            <div className={cn("border-border-default flex justify-between border-b pb-6", !armsEnabled && "border-none")}>
              <div>
                <div className="text-text-default text-sm font-medium">Enable Arms</div>
                <span className="text-text-subtle text-sm">
                  Arms split this class into smaller parallel groups. Example: {exampleArmPrefix}A, {exampleArmPrefix}B.
                </span>
              </div>
              <Toggle withBorder={false} checked={armsEnabled} onChange={e => setArmsEnabled((e.target as HTMLInputElement).checked)} />
            </div>
            {armsEnabled && (
              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">Arms</Label>
                <LevelItemsSection
                  existingItems={arms}
                  globalOptions={availableArms}
                  isLoadingOptions={isLoadingAllArms}
                  onAdd={addArm}
                  onDelete={removeArm}
                  isAdding={isAddingArm}
                  deletingName={deletingArmName}
                  placeholder="Search or type new arms e.g A, B or Gold, Silver"
                />
              </div>
            )}
          </div>
        </div>

        {departmentsEnabled && armsDetails.length > 0 && departmentsDetails.length > 0 && (
          <AssignArmsToDepartments arms={armsDetails} departments={departmentsDetails} levelId={level!.id} branchId={branchId} />
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
                  <SheetTitle>Edit {className}</SheetTitle>
                </VisuallyHidden>
                <div className="flex items-center justify-between">
                  <div className="text-text-default text-md font-semibold">Edit {className}</div>
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
                  <PermissionCheck permissionUtility={canManageSettings}>
                    <Button
                      type="button"
                      onClick={() => formik.handleSubmit()}
                      className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! flex h-7 w-17 items-center gap-1 rounded-sm px-2 py-1"
                    >
                      {isUpdatingClass && <Spinner className="text-text-white-default" />}
                      Save
                    </Button>
                  </PermissionCheck>
                </div>
              </SheetFooter>
            </SheetContent>
          </div>
        </Sheet>
      )}

      {/* Mobile */}
      {isMobile && (
        <MobileDrawer open={sheetOpen} setIsOpen={setSheetOpen} title={`Edit ${className}`}>
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
                {isUpdatingClass && <Spinner className="text-text-white-default" />}
                Save
              </Button>
            </div>
          </SheetFooter>
        </MobileDrawer>
      )}
    </div>
  );
};
