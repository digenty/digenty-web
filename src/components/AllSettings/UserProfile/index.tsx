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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useGetUserProfile } from "@/hooks/queryHooks/useProfile";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import React, { useEffect, useRef, useState } from "react";

type EditProps = "editName" | "editPhoneNum" | "editTimezone" | null;

const timeZones = ["CEST"];
export const UserProfile = () => {
  useBreadcrumb([
    { label: "Settings", url: "/staff/settings" },
    { label: "Profile Settings", url: "/staff/settings/profile" },
  ]);
  const [timeZone, setTimeZone] = useState(timeZones[0]);
  const [edit, setEdit] = useState<EditProps>(null);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const prevUrl = useRef<string | null>(null);

  const { data } = useGetUserProfile();
  const profileData = data?.data;

  console.log(profileData);
  useEffect(() => {
    if (profileData) {
      setFirstName(profileData.firstName || "");
      setLastName(profileData.lastName || "");
      setPhoneNumber(profileData.phoneNumber || "");
      setEmail(profileData.email || "");
      setRole(profileData.role || "");
      setImage(profileData.avatar || undefined);
    }
  }, [profileData]);

  useEffect(() => {
    return () => {
      if (prevUrl.current) URL.revokeObjectURL(prevUrl.current);
    };
  }, []);

  const handleUploadClick = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const url = URL.createObjectURL(file);
    if (prevUrl.current) URL.revokeObjectURL(prevUrl.current);
    prevUrl.current = url;
    setImage(url);
    toast({ title: "Avatar updated", description: "Your profile picture has been uploaded.", type: "success" });
    e.currentTarget.value = "";
  };

  const handleSaveProfile = (updatedFields: Partial<{ firstName: string; lastName: string; phoneNumber: string; timezone: string }>) => {
    setIsSaving(true);
    // Mock update function
    setTimeout(() => {
      console.log("Saving profile changes:", updatedFields);
      toast({ title: "Saved", description: "Profile updated successfully.", type: "success" });
      setIsSaving(false);
      setEdit(null);
    }, 1000);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="text-text-default mb-8 text-xl font-semibold">Profile Settings</div>
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
                className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! rounded-md border text-sm font-medium shadow"
              >
                Upload
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
                        setLastName(profileData?.lastName || "");
                        setEdit(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-7!"
                      onClick={() => handleSaveProfile({ firstName, lastName })}
                      disabled={isSaving}
                    >
                      {isSaving ? <Spinner className="size-3" /> : <Save fill="var(--color-icon-white-default)" />}
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
                  disabled={isSaving}
                >
                  {isSaving ? <Spinner className="size-3" /> : <Save fill="var(--color-icon-white-default)" />}
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
            <div className="text-text-muted text-sm">{role || "—-"}</div>
          </div>
        </div>

        <div className="border-border-default flex h-20 items-center justify-between border-b py-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Timee fill="var(--color-icon-default-muted)" />
              <div className="text-text-default text-sm font-medium">Time Zone</div>
            </div>
          </div>
          <Select
            value={timeZone}
            onValueChange={val => {
              setTimeZone(val);
              handleSaveProfile({ timezone: val });
            }}
          >
            <SelectTrigger className="border-border-darker h-8! w-auto border">
              <SelectValue>
                <span className="text-text-default text-sm font-medium">{timeZone}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default">
              {timeZones.map(time => (
                <SelectItem key={time} value={time} className="text-text-default text-sm font-medium">
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
