"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Gender, Relationship } from "@/types";
import { Phone } from "@/components/Icons/Phone";
import Mail from "@/components/Icons/Mail";
import { Pencil } from "lucide-react";
import Flag from "@/components/Icons/Flag";
import { GenderLess } from "@/components/Icons/GenderLess";
import School from "@/components/Icons/School";
import { useEditParent, useGetParent } from "@/hooks/queryHooks/useParent";
import { ParentInputValues } from "@/components/StudentAndParent/types";
import { parentSchema } from "@/schema/parent";
import { toast } from "@/components/Toast";
import { useFormik } from "formik";
import { EditParentBiodata } from "./EditBio/editParent";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfilePicture } from "@/components/StudentAndParent/ProfilePicture";
import { Parent } from "@/api/types";
import { MapPin } from "@/components/Icons/MapPin";
import { ParentBioDataProps } from "./types";

const ViewBiodata = ({ onEdit, data, setAvatar }: { onEdit: () => void; data: { data: Parent } | undefined; setAvatar: (url?: string) => void }) => {
  console.log(data);

  return (
    <div className="bg-bg-muted rounded-xl p-4">
      <div className="">
        <div className="bg-bg-muted flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <ProfilePicture setAvatar={setAvatar} />

            <div>
              <p className="text-text-default text-sm font-semibold">
                {data?.data?.firstName} {data?.data?.lastName}
              </p>
              <p className="text-text-subtle text-xs">{data?.data?.relationship}</p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={onEdit}
            className="text-text-default border-border-darker bg-bg-state-secondary hover:bg-bg-state-secondary-hover! flex items-center gap-1.5 rounded-full border font-medium"
          >
            <Pencil className="size-3" />
            Edit <span className="hidden md:block">Biodata</span>
          </Button>
        </div>

        <div className="bg-bg-card w-full rounded-lg">
          <div className="border-border-default flex items-center gap-3 border-b px-4 py-3 last:border-b-0">
            <Phone className="bg-bg-muted mt-0.5 size-4 h-8 w-8 shrink-0 rounded-md p-2" fill="var(--color-icon-default-muted)" />
            <div className="flex flex-col gap-0.5">
              <p className="text-text-muted text-xs">Primary Phone Number</p>
              <p className="text-text-default text-sm font-medium">{data?.data?.phoneNumber}</p>
            </div>
          </div>

          <div className="border-border-default flex items-center gap-3 border-b px-4 py-3 last:border-b-0">
            <Phone className="bg-bg-muted mt-0.5 size-4 h-8 w-8 shrink-0 rounded-md p-2" fill="var(--color-icon-default-muted)" />
            <div className="flex flex-col gap-0.5">
              <p className="text-text-muted text-xs">Secondary Phone Number</p>
              <p className="text-text-default text-sm font-medium">{data?.data?.secondaryPhoneNumber}</p>
            </div>
          </div>

          <div className="border-border-default flex items-center gap-3 border-b px-4 py-3 last:border-b-0">
            <Mail className="bg-bg-muted mt-0.5 size-4 h-8 w-8 shrink-0 rounded-md p-2" fill="var(--color-icon-default-muted)" />
            <div className="flex flex-col gap-0.5">
              <p className="text-text-muted text-xs">Email Address</p>
              <p className="text-text-default text-sm font-medium">{data?.data?.email}</p>
            </div>
          </div>

          <div className="border-border-default flex items-center gap-3 border-b px-4 py-3 last:border-b-0">
            <MapPin className="bg-bg-muted mt-0.5 size-4 h-8 w-8 shrink-0 rounded-md p-2" fill="var(--color-icon-default-muted)" />
            <div className="flex flex-col gap-0.5">
              <p className="text-text-muted text-xs">Home Address</p>
              <p className="text-text-default text-sm font-medium">{data?.data?.address}</p>
            </div>
          </div>

          <div className="border-border-default flex items-center gap-3 border-b px-4 py-3 last:border-b-0">
            <Flag className="bg-bg-muted mt-0.5 size-4 h-8 w-8 shrink-0 rounded-md p-2" fill="var(--color-icon-default-muted)" />
            <div className="flex flex-col gap-0.5">
              <p className="text-text-muted text-xs">Nationality</p>
              <p className="text-text-default text-sm font-medium">{data?.data?.nationality}</p>
            </div>
          </div>

          <div className="border-border-default flex items-center gap-3 border-b px-4 py-3 last:border-b-0">
            <Flag className="bg-bg-muted mt-0.5 size-4 h-8 w-8 shrink-0 rounded-md p-2" fill="var(--color-icon-default-muted)" />
            <div className="flex flex-col gap-0.5">
              <p className="text-text-muted text-xs">State of Origin</p>
              <p className="text-text-default text-sm font-medium">{data?.data?.stateOfOrigin}</p>
            </div>
          </div>

          <div className="border-border-default flex items-center gap-3 border-b px-4 py-3 last:border-b-0">
            <GenderLess className="bg-bg-muted mt-0.5 size-4 h-8 w-8 shrink-0 rounded-md p-2" fill="var(--color-icon-default-muted)" />
            <div className="flex flex-col gap-0.5">
              <p className="text-text-muted text-xs">Gender</p>
              <p className="text-text-default text-sm font-medium">{data?.data?.gender}</p>
            </div>
          </div>

          <div className="border-border-default flex items-center gap-3 border-b px-4 py-3 last:border-b-0">
            <School className="bg-bg-muted mt-0.5 size-4 h-8 w-8 shrink-0 rounded-md p-2" fill="var(--color-icon-default-muted)" />
            <div className="flex flex-col gap-0.5">
              <p className="text-text-muted text-xs">Branch</p>
              <p className="text-text-default text-sm font-medium">{data?.data?.branch}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ParentBioData = ({ parentId }: ParentBioDataProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<string>();
  const { data: parentData, isLoading: loadingParent } = useGetParent(parentId);
  const data = parentData?.data;
  const { mutate, isPending } = useEditParent();

  const formik = useFormik<ParentInputValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      gender: Gender.Female,
      address: "",
      phoneNumber: "",
      secondaryPhoneNumber: "",
      nationality: "",
      stateOfOrigin: "",
      relationship: Relationship.Mother,
      branchId: null,
    },
    validationSchema: parentSchema,
    enableReinitialize: true,
    onSubmit: values => {
      mutate(
        {
          ...values,
          tags: [],
          linkedStudents: [],
          image: avatar,
          id: Number(parentId),
        },
        {
          onSuccess: data => {
            toast({
              title: `Successfully updated ${data.data.firstName} ${data.data.lastName}`,
              description: data.message,
              type: "success",
            });
          },
          onError: error => {
            toast({
              title: error.message ?? "Something went wrong",
              description: "Could not update parent' details",
              type: "error",
            });
          },
        },
      );
    },
  });

  useEffect(
    () => {
      if (data) {
        formik.setFieldValue("firstName", data.data.firstName);
        formik.setFieldValue("lastName", data.data.lastName);
        formik.setFieldValue("middleName", data.data.middleName);
        formik.setFieldValue("email", data.data.email);
        formik.setFieldValue("phoneNumber", data.data.phoneNumber);
        formik.setFieldValue("secondaryPhoneNumber", data.data.secondaryPhoneNumber ?? "");
        formik.setFieldValue("gender", data.data.gender);
        formik.setFieldValue("relationship", data.data.relationship);
        formik.setFieldValue("address", data.data.address);
        formik.setFieldValue("nationality", data.data.nationality);
        formik.setFieldValue("stateOfOrigin", data.data.stateOfOrigin);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );

  if (loadingParent || !data) {
    return (
      <div className="flex h-screen flex-col">
        <Skeleton className="bg-bg-input-soft h-full w-full rounded-md" />
      </div>
    );
  }

  return (
    <div className="">
      {isEditing ? (
        <EditParentBiodata formik={formik} data={data} isPending={isPending} loadingParent={loadingParent} onCancel={() => setIsEditing(false)} />
      ) : (
        <ViewBiodata onEdit={() => setIsEditing(true)} data={data} setAvatar={setAvatar} />
      )}
    </div>
  );
};
