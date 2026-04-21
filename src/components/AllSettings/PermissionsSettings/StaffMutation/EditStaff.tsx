"use client";

import { BranchWithClassLevels, Role, StaffBranch } from "@/api/types";
import Accordion from "@/components/Accordion";
import { AddStaffPayload, UpdateStaffPayload } from "@/components/AllSettings/types";
import DeleteBin from "@/components/Icons/DeleteBin";
import School from "@/components/Icons/School";
import { SchoolFill } from "@/components/Icons/SchoolFill";
import { StaffInputValues } from "@/components/StudentAndParent/types";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetRoles } from "@/hooks/queryHooks/useRole";
import { useGetStaffDetails, useUpdateStaff } from "@/hooks/queryHooks/useStaff";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { cn } from "@/lib/utils";
import { staffSchema } from "@/schema/staff";
import { useFormik } from "formik";
import { MailIcon, PlusIcon, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs } from "@/components/Tabs";
import { TeacherAssignments } from "../StaffDetails/TeacherAssignments";

export const EditStaff = () => {
  const router = useRouter();
  const params = useParams();
  const staffId = params.id as string;
  const [assignments, setAssignments] = useState<{ branchId: number | null; roleIds: Role[] }[]>([{ branchId: null, roleIds: [] }]);

  useBreadcrumb([
    {
      label: "Settings",
      url: "/staff/settings",
    },
    {
      label: "Permissions",
      url: "/staff/settings/permissions",
    },
    {
      label: "Staff",
      url: "/staff/settings/permissions",
    },
    {
      label: "Edit Staff",
      url: "",
    },
  ]);

  const { data: branches, isPending: loadingBranches } = useGetBranches();
  const { data: roles, isPending: loadingRoles } = useGetRoles();
  const { data: staffDetails, isPending: loadingStaffDetails } = useGetStaffDetails(Number(staffId));
  const { mutate, isPending } = useUpdateStaff();

  useEffect(() => {
    if (staffDetails?.data && roles?.data) {
      const details = staffDetails.data;
      formik.setValues({
        firstName: details.fullname.split(" ")[0] || "",
        lastName: details.fullname.split(" ").slice(1).join(" ") || "",
        email: details.email || "",
        phoneNumber: details.phoneNumber || "",
      });

      if (details.branches && details.branches.length > 0) {
        const newAssignments = details.branches.map((branch: StaffBranch) => ({
          branchId: branch.branchId,
          roleIds: branch.roleNames.map((roleName: string) => roles.data.find((r: Role) => r.roleName === roleName)).filter(Boolean),
        }));
        setAssignments(newAssignments);
      }
    }
  }, [staffDetails, roles]);

  const addAssignment = () => {
    setAssignments(prev => [...prev, { branchId: null, roleIds: roles ? [roles.data[0]] : [] }]);
  };

  const removeAssignment = (index: number) => {
    setAssignments(prev => prev.filter((_, i) => i !== index));
  };

  const addRole = (assignmentIndex: number) => {
    setAssignments(prev =>
      prev.map((assignment, i) => (i === assignmentIndex ? { ...assignment, roleIds: [...assignment.roleIds, roles.data[0]] } : assignment)),
    );
  };

  const removeRole = (assignmentIndex: number, roleIndex: number) => {
    setAssignments(prev =>
      prev.map((assignment, i) =>
        i === assignmentIndex ? { ...assignment, roleIds: assignment.roleIds.filter((_, j) => j !== roleIndex) } : assignment,
      ),
    );
  };

  const updateBranch = (assignmentIndex: number, id: number) => {
    setAssignments(prev => prev.map((assignment, i) => (i === assignmentIndex ? { ...assignment, branchId: id } : assignment)));
  };

  const updateRole = (assignmentIndex: number, roleIndex: number, roleName: string) => {
    const role = roles?.data.find((r: Role) => r.roleName === roleName);
    if (!role) return;
    setAssignments(prev =>
      prev.map((assignment, i) =>
        i === assignmentIndex
          ? {
              ...assignment,
              roleIds: assignment.roleIds.map((r, j) => (j === roleIndex ? role : r)),
            }
          : assignment,
      ),
    );
  };

  const formik = useFormik<StaffInputValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
    validationSchema: staffSchema,
    onSubmit: async values => {
      const branchAssignmentDtos = assignments
        .filter(assignment => assignment.branchId !== null)
        .map(assgnmnt => ({
          branchId: assgnmnt.branchId as number,
          roleIds: assgnmnt.roleIds.map(role => role.roleId),
        }));

      const payload: AddStaffPayload = { ...values, branchAssignmentDtos };

      await mutate(
        { payload, staffId: Number(staffId) },
        {
          onSuccess: data => {
            toast({
              title: "Staff updated successfully",
              description: data.message,
              type: "success",
            });
            router.back();
          },
          onError: error => {
            toast({
              title: error.message ?? "Something went wrong",
              description: "Could not update staff",
              type: "error",
            });
          },
        },
      );
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-bg-card-subtle border-border-default border-b p-3">
        <div className="justify-left mx-auto flex w-full items-center md:max-w-225">
          <div className="text-text-default text-md text-left font-semibold">Edit Staff</div>
        </div>
      </div>

      <div className="mx-auto mb-20 flex w-full items-center justify-center md:max-w-225">
        <div className="flex w-full flex-col gap-6 px-3">
          {loadingStaffDetails || loadingRoles || loadingBranches ? (
            <div className="flex flex-col gap-6">
              <Skeleton className="bg-bg-input-soft h-12 w-full" />
              <Skeleton className="bg-bg-input-soft h-12 w-full" />
              <div className="grid grid-cols-2 gap-6">
                <Skeleton className="bg-bg-input-soft h-12 w-full" />
                <Skeleton className="bg-bg-input-soft h-12 w-full" />
              </div>
              <Skeleton className="bg-bg-input-soft h-40 w-full" />
            </div>
          ) : (
            <>
              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-text-default text-sm font-medium">
                    First Name <small className="text-text-destructive text-xs">*</small>
                  </Label>
                  <Input
                    id="firstName"
                    onChange={formik.handleChange}
                    autoFocus
                    placeholder="Input First Name"
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                    type="text"
                    className={cn(
                      "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
                      formik.errors.firstName && formik.touched.firstName && "border-border-destructive border",
                    )}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="text-text-destructive text-xs font-light">{formik.errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-text-default text-sm font-medium">
                    Last Name<small className="text-text-destructive text-xs">*</small>
                  </Label>
                  <Input
                    id="lastName"
                    onChange={formik.handleChange}
                    placeholder="Input Last Name"
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                    type="text"
                    className={cn(
                      "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
                      formik.errors.lastName && formik.touched.lastName && "border-border-destructive border",
                    )}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="text-text-destructive text-xs font-light">{formik.errors.lastName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-text-default text-sm font-medium">
                    Email Address<small className="text-text-destructive text-xs">*</small>
                  </Label>
                  <Input
                    id="email"
                    onChange={formik.handleChange}
                    placeholder="Input Email Address"
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    type="email"
                    className={cn(
                      "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
                      formik.errors.email && formik.touched.email && "border-border-destructive border",
                    )}
                  />
                  {formik.touched.email && formik.errors.email && <p className="text-text-destructive text-xs font-light">{formik.errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-text-default text-sm font-medium">
                    Primary Phone Number<small className="text-text-destructive text-xs">*</small>
                  </Label>
                  <Input
                    id="phoneNumber"
                    onChange={formik.handleChange}
                    placeholder="Input Primary Phone Number"
                    onBlur={formik.handleBlur}
                    value={formik.values.phoneNumber}
                    type="text"
                    className={cn(
                      "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
                      formik.errors.phoneNumber && formik.touched.phoneNumber && "border-border-destructive border",
                    )}
                  />
                  {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                    <p className="text-text-destructive text-xs font-light">{formik.errors.phoneNumber}</p>
                  )}
                </div>
              </div>
              <div className="border-border-default border-b" />

              <div className="mt-2 w-full text-left">
                <Tabs
                  className="w-full"
                  items={[
                    {
                      label: "Branch Assignment",
                      content: (
                        <div className="mt-6 flex flex-col gap-6">
                          {loadingBranches ? (
                            <Skeleton className="bg-bg-input-soft h-80 w-full" />
                          ) : (
                            <div className="space-y-6">
                              {assignments.map((assignment, assignmentIndex) => (
                                <div key={assignmentIndex} className="flex items-center gap-2">
                                  <Accordion
                                    defaultOpen={assignmentIndex === 0}
                                    className="border-border-default flex-1 rounded-md border"
                                    title={
                                      <div className="flex w-full items-center justify-between pr-4">
                                        <div className="flex items-center gap-2">
                                          <SchoolFill fill="var(--color-icon-default-muted)" /> Branch Assignment {assignmentIndex + 1}
                                        </div>
                                      </div>
                                    }
                                  >
                                    <div className="flex flex-col gap-4 px-4 py-4">
                                      <div className="space-y-2">
                                        <Label htmlFor={`branch-${assignmentIndex}`} className="text-text-default mb-2 text-sm font-medium">
                                          Branch <small className="text-text-destructive text-xs">*</small>
                                        </Label>
                                        <Select
                                          value={assignment.branchId ? String(assignment.branchId) : ""}
                                          onValueChange={value => {
                                            updateBranch(assignmentIndex, Number(value));
                                          }}
                                        >
                                          <SelectTrigger className="text-text-default bg-bg-input-soft! h-8! w-full border-none text-sm font-normal">
                                            <SelectValue placeholder="Branch" />
                                          </SelectTrigger>
                                          <SelectContent className="bg-bg-card border-none">
                                            {branches?.data.map((branch: BranchWithClassLevels) => (
                                              <SelectItem key={branch.branch.id} className="text-text-default" value={String(branch.branch.id)}>
                                                {branch.branch.name}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div className="space-y-3">
                                        {assignment.roleIds.map((roleValue, roleIndex) => (
                                          <div key={roleIndex} className="flex flex-col gap-2">
                                            <Select value={roleValue.roleName} onValueChange={value => updateRole(assignmentIndex, roleIndex, value)}>
                                              <div className="flex items-center justify-between">
                                                <Label className="text-text-default text-sm font-medium">Select Role</Label>{" "}
                                                {assignment.roleIds.length > 1 && (
                                                  <Button
                                                    className="hover:bg-bg-none! bg-none!"
                                                    onClick={() => removeRole(assignmentIndex, roleIndex)}
                                                  >
                                                    <DeleteBin fill="var(--color-icon-default-muted)" />
                                                  </Button>
                                                )}
                                              </div>
                                              <SelectTrigger className="bg-bg-input-soft! text-text-default h-8 w-full border-none text-sm">
                                                <SelectValue placeholder="Select Role">{roleValue.roleName}</SelectValue>
                                              </SelectTrigger>
                                              <SelectContent className="bg-bg-card border-border-default">
                                                {roles?.data.map((role: Role) => (
                                                  <SelectItem
                                                    key={role.roleName}
                                                    value={role.roleName}
                                                    className="text-text-default text-sm font-semibold"
                                                  >
                                                    {role.roleName}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        ))}
                                      </div>

                                      <Button
                                        className="text-text-subtle bg-bg-state-soft! hover:bg-bg-state-soft-hover! mt-2 flex h-7! w-fit items-center justify-start gap-2 rounded font-medium"
                                        onClick={() => addRole(assignmentIndex)}
                                      >
                                        <PlusIcon className="text-icon-default-muted" />
                                        Add Role
                                      </Button>
                                    </div>
                                  </Accordion>

                                  {assignments.length > 1 && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={e => {
                                        e.stopPropagation();
                                        removeAssignment(assignmentIndex);
                                      }}
                                    >
                                      <Trash2 className="text-icon-default-muted size-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="border-border-darker bg-bg-state-secondary flex items-center justify-center rounded-md border border-dashed p-6">
                            <div className="flex flex-col items-center gap-2">
                              <div className="text-text-default flex items-center gap-1 text-xs">
                                <School fill="var(--color-icon-default-muted)" /> Add another branch assignment
                              </div>
                              <Button
                                onClick={addAssignment}
                                className="bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! text-text-default flex h-6! w-fit items-center justify-center text-xs font-medium shadow"
                              >
                                <PlusIcon className="text-icon-default-muted" /> Add Branch
                              </Button>
                            </div>
                          </div>
                        </div>
                      ),
                    },
                    {
                      label: "Teacher Assignment",
                      content: (
                        <div className="mt-6 w-full max-w-full px-4 md:px-8">
                          <div className="-mx-4 md:-mx-8">
                            <TeacherAssignments
                              teacherName={`${formik.values.firstName} ${formik.values.lastName}`.trim()}
                              staffId={Number(staffId)}
                            />
                          </div>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="border-border-default bg-bg-default absolute bottom-0 mx-auto flex w-full justify-between border-t px-4 py-3 md:px-36">
        <Button onClick={() => router.back()} disabled={isPending} className="bg-bg-state-soft! text-text-subtle h-7! rounded-md">
          Cancel
        </Button>
        <Button
          type="button"
          onClick={() => formik.handleSubmit()}
          className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-7"
        >
          {isPending ? <Spinner className="text-text-white-default" /> : <MailIcon className="text-icon-white-default" />} Save changes
        </Button>
      </div>
    </div>
  );
};
