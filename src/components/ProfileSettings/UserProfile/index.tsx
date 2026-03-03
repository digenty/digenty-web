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
import { useGetUserProfile } from "@/hooks/queryHooks/useProfile";
import React, { useEffect, useRef, useState } from "react";

type EditProps = "editName" | "editPhoneNum" | "editTimezone" | null;

const timeZones = ["CEST"];
export const UserProfile = () => {
  const [timeZone, setTimeZone] = useState(timeZones[0]);
  const [edit, setEdit] = useState<EditProps>(null);
  const [image, setImage] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const prevUrl = useRef<string | null>(null);

  const { data } = useGetUserProfile();
  const profileData = data?.data;
  console.log(profileData);

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
    toast({ title: "Avatar updated", description: "Your school logo has been uploaded.", type: "success" });
    e.currentTarget.value = "";
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
                aria-label="Upload school logo"
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
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <User fill="var(--color-icon-default-muted)" />
                    <div className="text-text-default text-sm font-medium">Name</div>
                  </div>
                  <div className="text-text-muted text-sm">Damilare John</div>
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
                  <div className="flex items-center gap-2">
                    <User fill="var(--color-icon-default-muted)" />
                    <div className="text-text-default text-sm font-medium">Name</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">First Name</Label>
                    <Input className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm font-normal" placeholder="Damilare" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">Last Name</Label>
                    <Input className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm font-normal" placeholder="John" />
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! w-fit rounded-md border text-sm font-medium"
                      onClick={() => setEdit(null)}
                    >
                      Cancel
                    </Button>
                    <Button className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-7!">
                      <Save fill="var(--color-icon-white-default)" />
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
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Phone fill="var(--color-icon-default-muted)" />
                <div className="text-text-default text-sm font-medium">Phone Number</div>
              </div>
              <div className="text-text-muted text-sm">0904 000 0000</div>
            </div>
            <Button
              onClick={() => setEdit("editPhoneNum")}
              className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! rounded-md border text-sm font-medium shadow"
            >
              {" "}
              <Edit fill="var(--color-icon-default-muted)" /> Edit
            </Button>
          </div>
          {edit === "editPhoneNum" && (
            <div className="mt-4">
              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">
                  {" "}
                  <Phone fill="var(--color-icon-default-muted)" /> Phone Number
                </Label>
                <Input className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm font-normal" placeholder="0904 000 0000" />
              </div>

              <div className="mt-4 flex items-center gap-4">
                <Button
                  className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! w-fit rounded-md border text-sm font-medium"
                  onClick={() => setEdit(null)}
                >
                  Cancel
                </Button>
                <Button className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default flex h-7! items-center gap-1">
                  <Save fill="var(--color-icon-white-default)" />
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="border-border-default flex items-center justify-between border-b py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Mail fill="var(--color-icon-default-muted)" />
              <div className="text-text-default text-sm font-medium">Email Address</div>
            </div>
            <div className="text-text-muted text-sm">damilarejohn@example.com</div>
          </div>
        </div>

        <div className="border-border-default flex items-center justify-between border-b py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <IdCard fill="var(--color-icon-default-muted)" />
              <div className="text-text-default text-sm font-medium">Role </div>
            </div>
            <div className="text-text-muted text-sm">Class Teacher</div>
          </div>
        </div>

        <div className="border-border-default flex h-20 items-center justify-between border-b py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Timee fill="var(--color-icon-default-muted)" />
              <div className="text-text-default text-sm font-medium">Time Zone</div>
            </div>
          </div>
          <Select value={timeZone} onValueChange={setTimeZone}>
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
