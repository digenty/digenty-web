"use client";

import { Avatar } from "@/components/Avatar";
import Edit from "@/components/Icons/Edit";
import { IdCard } from "@/components/Icons/IdCard";
import Mail from "@/components/Icons/Mail";
import { Phone } from "@/components/Icons/Phone";
import Save from "@/components/Icons/Save";
import { Timee } from "@/components/Icons/Timee";
import User from "@/components/Icons/User";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useGetUserProfile, useUpdateUserProfile } from "@/hooks/queryHooks/useProfile";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import React, { useEffect, useRef, useState } from "react";

import { uploadImage } from "@/app/actions/upload-image";
import { SearchableSelect } from "@/components/StudentAndParent/SearchableSelect";
import { Country } from "@/components/StudentAndParent/types";
import { useGetCountries } from "@/hooks/queryHooks/useCountry";

type Timezone = {
  abbreviation: string;
  gmtOffset: number;
  gmtOffsetName: string;
  tzName: string;
  zoneName: string;
};

type EditProps = "editName" | "editPhoneNum" | "editTimezone" | null;
export const UserProfile = () => {
  useBreadcrumb([
    { label: "Settings", url: "/staff/settings" },
    { label: "Profile", url: "/staff/profile" },
  ]);
  const [timeZone, setTimeZone] = useState("");
  const [edit, setEdit] = useState<EditProps>(null);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { data } = useGetUserProfile();
  const profileData = data?.data;

  const { mutate, isPending } = useUpdateUserProfile();

  const { data: countries = [] } = useGetCountries();

  const uniqueTimezones = Array.from(
    new globalThis.Map<string, Timezone>(
      countries
        .flatMap((country: Country) => country.timezones || [])
        .filter(Boolean)
        .map((timezone: Timezone) => [timezone.zoneName, timezone] as [string, Timezone]),
    ).values(),
  )
    .sort((a: Timezone, b: Timezone) => a.zoneName.localeCompare(b.zoneName))
    .map((timezone: Timezone) => ({
      label: timezone.zoneName,
      value: `${timezone.zoneName} ${timezone.gmtOffsetName}`,
    }));

  useEffect(() => {
    if (profileData) {
      setFirstName(profileData.firstName || "");
      setMiddleName(profileData.middleName || "");
      setLastName(profileData.lastName || "");
      setPhoneNumber(profileData.phoneNumber || "");
      setEmail(profileData.email || "");
      setRole(profileData.roles || "");
      setImage(profileData.image || undefined);
      setTimeZone(profileData.timezone || "");
    }
  }, [profileData]);

  const handleUploadClick = () => inputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png"];
    const maxSize = 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      toast({ title: "Invalid file type", description: "Please upload JPG or PNG images only.", type: "error" });
      e.currentTarget.value = "";
      return;
    }

    if (file.size > maxSize) {
      toast({ title: "File too large", description: "Max file size is 1MB.", type: "error" });
      e.currentTarget.value = "";
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const data = await uploadImage(formData);
      if (data?.url) {
        setImage(data.url);
        mutate(
          { image: data.url, firstName, middleName, lastName, phoneNumber, timezone: timeZone },
          {
            onSuccess: () => toast({ title: "Avatar updated", description: "Your profile picture has been updated.", type: "success" }),
            onError: () => toast({ title: "Failed to update", description: "Could not update profile picture.", type: "error" }),
          },
        );
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setIsUploading(false);
      // e.currentTarget.value = "";
    }
  };

  const handleSaveProfile = (overrides: { firstName?: string; lastName?: string; middleName?: string; phoneNumber?: string; timezone?: string }) => {
    mutate(
      { image, firstName, middleName, lastName, phoneNumber, timezone: timeZone, ...overrides },
      {
        onSuccess: () => {
          toast({ title: "Saved", description: "Profile updated successfully.", type: "success" });
          setEdit(null);
        },
        onError: () => toast({ title: "Failed to save", description: "Could not update your profile.", type: "error" }),
      },
    );
  };

  return (
    <div className="p-4 md:p-8">
      <div className="text-text-default mb-8 text-xl font-semibold">Profile</div>
      <div className="flex w-full flex-col md:max-w-150">
        <div className="">
          <div className="text-text-default mb-4 text-sm font-medium">Profile Picture</div>
          <div className="flex flex-col gap-4">
            <div className="border-border-default flex items-center gap-4 border-b pb-4">
              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={handleFileChange}
                aria-label="Upload profile picture"
              />

              <Avatar className="size-10" url={image} />
              <Button
                onClick={handleUploadClick}
                disabled={isUploading || isPending}
                className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! rounded-md border text-sm font-medium shadow"
              >
                {isUploading || isPending ? <Spinner className="size-3" /> : "Upload"}
              </Button>
              <div className="text-text-muted text-xs">JPG or PNG. 1MB Max.</div>
            </div>
            <div className="border-border-default flex flex-col gap-4 border-b pb-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <User fill="var(--color-icon-default-muted)" />
                    <div className="text-text-default text-sm font-medium">Name</div>
                  </div>
                  <div className="text-text-muted text-sm">{firstName || lastName ? `${firstName} ${lastName}`.trim() : "—-"}</div>
                </div>
                <Button
                  onClick={() => setEdit("editName")}
                  className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! rounded-md border text-sm font-medium shadow"
                >
                  <Edit fill="var(--color-icon-default-muted)" /> Edit
                </Button>
              </div>

              {edit === "editName" && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">First Name</Label>
                    <Input
                      className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm font-normal"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="First name"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">Middle Name</Label>
                    <Input
                      className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm font-normal"
                      value={middleName}
                      onChange={e => setMiddleName(e.target.value)}
                      placeholder="Middle name"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">Last Name</Label>
                    <Input
                      className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm font-normal"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Last name"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! w-fit rounded-md border text-sm font-medium"
                      onClick={() => {
                        setFirstName(profileData?.firstName || "");
                        setMiddleName(profileData?.middleName || "");
                        setLastName(profileData?.lastName || "");
                        setEdit(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-7!"
                      onClick={() => handleSaveProfile({ firstName, middleName, lastName })}
                      disabled={isPending}
                    >
                      {isPending ? <Spinner className="size-3" /> : <Save fill="var(--color-icon-white-default)" />}
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-border-default border-b py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Phone fill="var(--color-icon-default-muted)" />
                <div className="text-text-default text-sm font-medium">Phone Number</div>
              </div>
              <div className="text-text-muted text-sm">{phoneNumber || "—-"}</div>
            </div>
            <Button
              onClick={() => setEdit("editPhoneNum")}
              className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! rounded-md border text-sm font-medium shadow"
            >
              <Edit fill="var(--color-icon-default-muted)" /> Edit
            </Button>
          </div>
          {edit === "editPhoneNum" && (
            <div className="mt-4">
              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">Phone Number</Label>
                <Input
                  className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm font-normal"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 09040000000"
                />
              </div>

              <div className="mt-4 flex items-center gap-4">
                <Button
                  className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! w-fit rounded-md border text-sm font-medium"
                  onClick={() => {
                    setPhoneNumber(profileData?.phoneNumber || "");
                    setEdit(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! flex h-7! items-center gap-1"
                  onClick={() => handleSaveProfile({ phoneNumber })}
                  disabled={isPending}
                >
                  {isPending ? <Spinner className="size-3" /> : <Save fill="var(--color-icon-white-default)" />}
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="border-border-default flex items-center justify-between border-b py-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Mail fill="var(--color-icon-default-muted)" />
              <div className="text-text-default text-sm font-medium">Email Address</div>
            </div>
            <div className="text-text-muted text-sm">{email || "—-"}</div>
          </div>
        </div>

        <div className="border-border-default flex items-center justify-between border-b py-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <IdCard fill="var(--color-icon-default-muted)" />
              <div className="text-text-default text-sm font-medium">Role</div>
            </div>
            <div className="text-text-muted text-sm">{role.length > 0 ? role.map(rol => rol).join(", ") : "—-"}</div>
          </div>
        </div>

        <div className="border-border-default flex h-20 items-center justify-between border-b py-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Timee fill="var(--color-icon-default-muted)" />
              <div className="text-text-default text-sm font-medium">Time Zone</div>
            </div>
          </div>
          <SearchableSelect
            options={uniqueTimezones}
            value={timeZone}
            onValueChange={val => {
              setTimeZone(val);
              handleSaveProfile({ timezone: val });
            }}
            placeholder="Select Time Zone"
            searchPlaceholder="Search time zone..."
            className="border-border-darker h-8! w-auto rounded-md border"
          />
        </div>
      </div>
    </div>
  );
};
