"use client";
import { useFormik } from "formik";
import { roleSchema } from "@/schema/role";
import { useGetRole, useUpdateRole } from "@/hooks/queryHooks/useRole";
import { toast } from "@/components/Toast";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ModulePermission } from "./ModulePermission";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

export const EditRoleSettings = () => {
  const router = useRouter();
  const params = useParams();
  const roleId = Number(params?.id);

  useBreadcrumb([
    { label: "Settings", url: "/staff/settings" },
    { label: "Permissions", url: "/staff/settings/permissions" },
    { label: "Roles & Permissions", url: "/staff/settings/permissions?tab=roles-and-permissions" },
    { label: "Edit Role", url: "" },
  ]);

  const [permissionIds, setPermissionIds] = useState<number[]>([]);
  const { data: roleData, isLoading: loadingRole } = useGetRole(roleId);
  const { mutate: updateRole, isPending: updatingRole } = useUpdateRole();

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: roleSchema,
    enableReinitialize: true,
    onSubmit: async values => {
      await updateRole(
        { ...values, roleId, permissionIds },
        {
          onSuccess: data => {
            toast({
              title: "Successfully updated role",
              description: data.message,
              type: "success",
            });
            router.push("/staff/settings/permissions?tab=roles-and-permissions");
          },
          onError: error => {
            toast({
              title: error.message ?? "Something went wrong",
              description: "Could not update role",
              type: "error",
            });
          },
        },
      );
    },
  });

  useEffect(() => {
    if (roleData?.data) {
      formik.setValues({
        name: roleData.data.roleName || "",
        description: roleData.data.description || "",
      });
      setPermissionIds(roleData.data.permissionIds || []);
    }
  }, [roleData]);

  if (loadingRole) {
    return (
      <div className="flex h-100 items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-bg-card-subtle border-border-default border-b p-3">
        <div className="justify-left mx-auto flex w-full items-center md:max-w-225">
          <div className="text-text-default text-md text-left font-semibold">Edit Role</div>
        </div>
      </div>
      <div className="mx-auto flex w-full items-center justify-center md:max-w-225">
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Role Name</Label>
            <Input
              id="name"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className={cn("bg-bg-input-soft! w-full border-none", formik.errors.name && formik.touched.name && "border-border-destructive border")}
              placeholder="Input Role Name"
            />
            {formik.touched.name && formik.errors.name && <p className="text-text-destructive text-xs font-light">{formik.errors.name}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Role Description</Label>
            <Input
              id="description"
              name="description"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              className={cn(
                "bg-bg-input-soft! w-full border-none",
                formik.errors.description && formik.touched.description && "border-border-destructive border",
              )}
              placeholder="Input Role Description"
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-text-destructive text-xs font-light">{formik.errors.description}</p>
            )}
          </div>

          <div className="border-border-default border-b"></div>
          <ModulePermission permissionIds={permissionIds} setPermissionIds={setPermissionIds} />

          {/* <Tabs
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
          /> */}
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
              className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-7"
              disabled={updatingRole}
            >
              {updatingRole && <Spinner className="text-text-white-default" />} Update Role
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
