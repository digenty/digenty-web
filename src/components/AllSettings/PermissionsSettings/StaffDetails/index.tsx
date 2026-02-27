"use client";

import { Avatar } from "@/components/Avatar";
import { PageEmptyState } from "@/components/Error/PageEmptyState";
import Building from "@/components/Icons/Building";
import Edit from "@/components/Icons/Edit";
import Mail from "@/components/Icons/Mail";
import { Phone } from "@/components/Icons/Phone";
import { UserForbid } from "@/components/Icons/UserForbid";
import { getStatusBadge } from "@/components/Status";
import { toast } from "@/components/Toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeactivateStaff, useGetStaffDetails } from "@/hooks/queryHooks/useStaff";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useStaffStore } from "@/store/staff";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { DeactivateStaffModal } from "./DeactivateStaffModal";

type StaffBranch = {
  branchId: number;
  branchName: string;
  roleNames: string[];
  subjectTeachings: string[];
  classTeacherArms: string[];
  permissions: [
    {
      moduleName: string;
      permissions: string[];
    },
  ];
};
export const StaffDetails = () => {
  const router = useRouter();
  const pathname = usePathname();
  const staffId = pathname.split("/")[4];

  useBreadcrumb([
    { label: "Settings", url: "/settings" },
    { label: "Permissions", url: "/settings/permissions" },
    { label: "Staff", url: "/settings/permissions?tab=staff" },
    { label: "Staff Details", url: "" },
  ]);

  const { openDeactivation, setOpenDeactivation, setStaffIdToDeactivate } = useStaffStore();

  const { data, isPending, isError } = useGetStaffDetails(Number(staffId));
  const { mutate, isPending: deactivating } = useDeactivateStaff(Number(staffId));

  const deactivateStaff = () => {
    mutate(undefined, {
      onSuccess: () => {
        setOpenDeactivation(false);
        toast({
          title: "Operation successful",
          description: "Staff has been deactivated successfully",
          type: "success",
        });
      },
      onError: error => {
        toast({
          title: "Failed to deactivate staff",
          description: error.message,
          type: "error",
        });
      },
    });
  };
  console.log(data);

  return (
    <>
      {openDeactivation && (
        <DeactivateStaffModal open={openDeactivation} setOpen={setOpenDeactivation} deactivateStaff={deactivateStaff} deactivating={deactivating} />
      )}

      {isError && (
        <PageEmptyState
          title="Cannot get staff details"
          description="Try reloading the page"
          buttonText="Reload"
          url={`/settings/permissions/staff/${staffId}`}
        />
      )}

      {isPending && !isError && (
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-6 px-4 py-4 md:max-w-250 md:py-6">
          <Skeleton className="bg-bg-input-soft h-80 w-full rounded-md" />
          <Skeleton className="bg-bg-input-soft h-100 w-full rounded-md" />
        </div>
      )}

      {data && !isPending && !isError && (
        <div className="flex w-full items-center justify-center px-4 py-4 md:mx-auto md:max-w-250 md:px-8 md:py-6">
          <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="size-14 md:size-26" />

                <div className="flex flex-col gap-1 md:gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-text-default w-40 truncate text-lg font-semibold sm:w-auto">{data.data.fullname}</span>
                    {data.data.branches
                      .map((branch: StaffBranch) => (
                        <Badge
                          key={branch.branchId}
                          className="bg-bg-badge-lime border-border-default text-bg-basic-lime-strong flex-1 rounded-md border text-xs font-medium"
                        >
                          {branch.roleNames[0] || "No role assigned yet"}
                        </Badge>
                      ))
                      .slice(0, 1)}
                  </div>
                  <div className="text-text-subtle text-xs">{data.data.email}</div>
                  {data.data.status ? getStatusBadge(data.data.status.toLowerCase()) : "--"}
                </div>
              </div>

              <div className="hide-scrollbar flex w-screen items-center gap-1 overflow-x-auto md:w-auto md:overflow-x-hidden">
                {/* <Button className="bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! text-text-default border-border-darker rounded-md border">
                <DeleteBin fill="var(--color-icon-default-muted)" className="size-4" /> Delete
              </Button> */}
                <Button
                  onClick={() => {
                    setOpenDeactivation(true);
                    setStaffIdToDeactivate(data.data.staffId);
                  }}
                  className="bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! text-text-default border-border-darker rounded-md border"
                >
                  <UserForbid fill="var(--color-icon-default-muted)" className="size-4" /> Deactivate
                </Button>
                <Button
                  onClick={() => router.push(`/settings/permissions/edit-staff/${staffId}`)}
                  className="bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! text-text-default border-border-darker rounded-md border"
                >
                  <Edit fill="var(--color-icon-default-muted)" className="size-4" /> Edit Staff
                </Button>
              </div>
            </div>

            <div className="bg-bg-muted border-border-default rounded-md border px-2 text-sm md:px-6">
              <div className="border-border-default flex items-center justify-between gap-2 border-b py-4">
                <div className="flex flex-1 items-center gap-2">
                  <Building fill="var(--color-icon-default-muted)" />
                  <div className="text-text-muted">Branch</div>
                </div>
                <div className="text-text-default max-w-1/3 truncate text-right font-medium">
                  {data.data.branches.map((branch: StaffBranch) => branch.branchName).join(", ")}
                </div>
              </div>
              <div className="border-border-default flex items-center justify-between gap-2 border-b py-4">
                <div className="flex flex-1 items-center gap-2">
                  <Mail fill="var(--color-icon-default-muted)" />
                  <div className="text-text-muted">Email Address</div>
                </div>
                <div className="text-text-informative max-w-1/3 truncate text-right font-medium">{data.data.email}</div>
              </div>
              <div className="flex items-center justify-between gap-2 py-4">
                <div className="flex flex-1 items-center gap-2">
                  <Phone fill="var(--color-icon-default-muted)" />
                  <div className="text-text-muted">Primary Phone Number</div>
                </div>
                <div className="text-text-informative max-w-1/3 truncate text-right font-medium">{data.data.phoneNumber}</div>
              </div>
            </div>

            {/* <div className="border-border-default gap-4 rounded-md border p-4">
            <div className="border-border-default flex items-center gap-3 border-b pb-4">
              <div className="bg-bg-badge-gray flex size-8 items-center justify-center rounded-sm p-1">
                <BookOpen fill="var(--color-icon-default-muted)" className="" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-text-default text-md font-medium">Lawanson</div>
                <div className="text-text-muted text-sm">5 classes • 1 class teacher role • 5 Permissions</div>
              </div>
            </div>

            <div className="flex items-center gap-3 py-4">
              <div className="bg-bg-badge-gray flex size-8 items-center justify-center rounded-sm p-1">
                <BookOpen fill="var(--color-bg-basic-sky-accent)" className="" />
              </div>
              <div className="text-text-default text-md font-medium">Subject Teaching</div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-bg-muted flex flex-col gap-2 rounded-md px-4 py-2">
                <div className="text-text-default text-sm font-medium">Mathematics</div>
                <div className="flex flex-wrap gap-3">
                  <Badge className="text-text-subtle bg-bg-badge-default rounded-sm">JSS 1</Badge>{" "}
                  <Badge className="text-text-subtle bg-bg-badge-default rounded-sm">JSS 1</Badge>
                </div>
              </div>
              <div className="bg-bg-muted flex flex-col gap-2 rounded-md px-4 py-2">
                <div className="text-text-default text-sm font-medium">Mathematics</div>
                <div className="flex flex-wrap gap-3">
                  <Badge className="text-text-subtle bg-bg-badge-default rounded-sm">JSS 1</Badge>{" "}
                  <Badge className="text-text-subtle bg-bg-badge-default rounded-sm">JSS 1</Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 py-4">
              <div className="bg-bg-badge-gray flex size-8 items-center justify-center rounded-sm p-1">
                <Group fill="var(--color-bg-basic-violet-accent)" className="" />
              </div>
              <div className="text-text-default text-md font-medium">Class Teacher For</div>
            </div>

            <div className="bg-bg-muted flex items-center justify-between gap-2 rounded-md px-4 py-2">
              <div className="flex flex-col gap-2">
                <div className="text-text-default text-sm font-medium">JSS 1</div>
                <div className="text-text-muted text-xs">32 Students</div>{" "}
              </div>
              <Badge className="text-bg-basic-green-strong bg-bg-badge-green border-border-default rounded-md border text-sm font-medium">
                Active
              </Badge>
            </div>

            <div className="flex items-center gap-3 py-4">
              <div className="bg-bg-badge-gray flex size-8 items-center justify-center rounded-sm p-1">
                <Shield fill="var(--color-bg-basic-emerald-accent)" className="" />
              </div>
              <div className="text-text-default text-md font-medium">Permissions</div>
            </div>

            <div className="bg-bg-muted flex flex-col gap-2 rounded-md px-4 py-2">
              <div className="itesm-center flex gap-2">
                <div className="bg-bg-badge-gray flex size-5 items-center justify-center rounded-sm p-1">
                  <Group fill="var(--color-icon-default-subtle)" className="" />
                </div>
                <div className="text-text-default text-sm font-medium">Student & Parent Records</div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge className="text-text-subtle bg-bg-badge-default rounded-sm">view</Badge>{" "}
                <Badge className="text-text-subtle bg-bg-badge-default rounded-sm">Manage</Badge>
                <Badge className="text-text-subtle bg-bg-badge-default rounded-sm">Delete</Badge>
              </div>
            </div>


            <div className="bg-bg-muted mt-4 flex flex-col gap-2 rounded-md px-4 py-2">
              <div className="itesm-center flex gap-2">
                <div className="bg-bg-badge-gray flex size-5 items-center justify-center rounded-sm p-1">
                  <GraduationCap fill="var(--color-icon-default-subtle)" className="" />
                </div>
                <div className="text-text-default text-sm font-medium">Classes & Subjects</div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge className="text-text-subtle bg-bg-badge-default rounded-sm">view</Badge>{" "}
              </div>
            </div>
          </div> */}
          </div>
        </div>
      )}
    </>
  );
};
