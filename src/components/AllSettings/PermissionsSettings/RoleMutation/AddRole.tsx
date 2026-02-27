"use client";

import { Tabs } from "@/components/Tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { ModulePermission } from "./ModulePermission";
import { TeacherAssignments } from "./TeacherAssignments";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useFormik } from "formik";
import { roleSchema } from "@/schema/role";
import { cn } from "@/lib/utils";
import { useAddRole } from "@/hooks/queryHooks/useRole";
import { toast } from "@/components/Toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { MailIcon } from "lucide-react";

export const AddRoleSettings = () => {
  const router = useRouter();
  useBreadcrumb([
    { label: "Settings", url: "/settings" },
    { label: "Permissions", url: "/settings/permissions" },
    { label: "Roles & Permissions", url: "/settings/permissions?tab=roles-and-permissions" },
    { label: "Add Role", url: "" },
  ]);

  const [permissionIds, setPermissionIds] = useState<number[]>([]);
  const { mutate, isPending } = useAddRole();

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: roleSchema,
    onSubmit: async values => {
      await mutate(
        { ...values, permissionIds },
        {
          onSuccess: data => {
            toast({
              title: "Successfully created role",
              description: data.message,
              type: "success",
            });
            router.push("/settings/permissions?tab=roles-and-permissions");
          },
          onError: error => {
            toast({
              title: error.message ?? "Something went wrong",
              description: "Could not create role",
              type: "error",
            });
          },
        },
      );
    },
  });

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6">
          <div className="bg-bg-card-subtle border-border-default border-b p-3">
            <div className="justify-left mx-auto flex w-full items-center md:max-w-218">
              <div className="text-text-default text-md text-left font-semibold">Add Role</div>
            </div>
          </div>
          <div className="mx-auto flex w-full items-center justify-center md:max-w-225">
            <div className="flex w-full flex-col gap-6">
              <div className="flex w-full flex-col gap-6 px-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-text-default text-sm font-medium">
                    Role Name<small className="text-text-destructive text-xs">*</small>
                  </Label>
                  <Input
                    id="name"
                    onChange={formik.handleChange}
                    placeholder="Input Role Name"
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    type="text"
                    className={cn(
                      "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
                      formik.errors.name && formik.touched.name && "border-border-destructive border",
                    )}
                  />
                  {formik.touched.name && formik.errors.name && <p className="text-text-destructive text-xs font-light">{formik.errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-text-default text-sm font-medium">
                    Role Description
                  </Label>
                  <Input
                    id="description"
                    onChange={formik.handleChange}
                    placeholder="Input Role Description"
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                    type="text"
                    className={cn(
                      "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
                      formik.errors.description && formik.touched.description && "border-border-destructive border",
                    )}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <p className="text-text-destructive text-xs font-light">{formik.errors.description}</p>
                  )}
                </div>
              </div>

              <div className="border-border-default border-b" />

              <div className="px-4">
                <Tabs
                  className="w-full"
                  items={[
                    {
                      label: "Module Permission",
                      content: <ModulePermission permissionIds={permissionIds} setPermissionIds={setPermissionIds} />,
                    },
                    {
                      label: "Teacher Assignments",
                      content: <TeacherAssignments />,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-border-default bg-bg-card sticky bottom-0 border-t px-4 py-1">
        <div className="mx-auto flex h-10! w-full items-center justify-center md:max-w-225">
          <div className="flex w-full items-center justify-between">
            <Button className="bg-bg-state-soft text-text-subtle h-7" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              onClick={() => formik.handleSubmit()}
              className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-7"
            >
              {isPending && <Spinner className="text-text-white-default" />} Add Role
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
