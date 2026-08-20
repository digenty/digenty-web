"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Pencil, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { StudentFilter } from "../FilterStudents";
import { Lock, Mail, Phone, ShieldUser } from "@digenty/icons";
import { toast } from "@/components/Toast";
import { uploadImage } from "@/app/actions/upload-image";
import { useGetUserProfile, useUpdateUserProfile } from "@/hooks/queryHooks/useProfile";
import { useSendChangePasswordOtp } from "@/hooks/queryHooks/useAuth";
import { ChangePasswordDialog } from "@/components/AllSettings/SecuritySettings/ChangePasswordDialog";

export const ParentSettings = () => {
  const [editing, setEditing] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { data } = useGetUserProfile();
  const profileData = data?.data;

  const { mutate, isPending } = useUpdateUserProfile();
  const { mutate: sendOtp, isPending: isSendingOtp } = useSendChangePasswordOtp();

  useEffect(() => {
    if (profileData) {
      setPhoneNumber(profileData.phoneNumber || "");
    }
  }, [profileData]);

  const fullName = [profileData?.firstName, profileData?.lastName].filter(Boolean).join(" ");

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
      const uploaded = await uploadImage(formData);
      if (uploaded?.url) {
        mutate(
          { image: uploaded.url },
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
    }
  };

  const handleSavePhone = () => {
    mutate(
      { phoneNumber },
      {
        onSuccess: () => {
          toast({ title: "Saved", description: "Phone number updated successfully.", type: "success" });
          setEditing(null);
        },
        onError: () => toast({ title: "Failed to save", description: "Could not update your phone number.", type: "error" }),
      },
    );
  };

  const handleChangePassword = () => {
    sendOtp(undefined, {
      onSuccess: response => {
        toast({ title: "OTP sent", description: response?.message ?? "A code has been sent to your email", type: "success" });
        setPasswordDialogOpen(true);
      },
      onError: error => {
        toast({
          title: typeof error === "string" ? error : (error?.message ?? "Something went wrong"),
          description: "Could not send OTP",
          type: "error",
        });
      },
    });
  };

  return (
    <div className="flex w-full flex-col gap-10 p-4 md:p-8">
      <div className="flex w-full items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-text-default text-2xl font-semibold">Settings</div>
          <div className="text-text-muted text-xs">View and update profile information</div>
        </div>
      </div>

      <div className="border-border-default flex items-center gap-3 rounded-lg border p-5">
        <Avatar className="size-10" url={profileData?.image} />
        <div className="flex flex-col gap-2">
          <div className="text-text-default text-md font-semibold">{fullName || "—"}</div>
          <div className="text-text-subtle text-xs">{profileData?.email || "—"}</div>
        </div>
      </div>

      <div className="border-border-default flex flex-col rounded-xl border">
        <div className="text-text-default flex items-center gap-2 p-4 text-sm font-semibold">
          <ShieldUser fill="var(--color-icon-default-muted)" />
          Account & Security
        </div>
        <div className="border-border-default border-t">
          <div className="flex items-center gap-3 p-5">
            <Avatar url={profileData?.image} />
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={handleFileChange}
              aria-label="Upload profile picture"
            />
            <span
              className="text-text-default border-border-default bg-bg-state-secondary flex h-7 cursor-pointer items-center gap-1 rounded-md border p-1 text-sm font-medium"
              onClick={!isUploading ? handleUploadClick : undefined}
            >
              {isUploading && <Spinner className="size-3" />}
              Upload
            </span>
            <span className="text-text-muted text-xs">JPG or PNG. 1MB Max.</span>
          </div>
        </div>
        <div className="border-border-default flex items-center justify-between border-t p-5">
          <div className="flex flex-1 items-center gap-3">
            <div className="bg-bg-badge-blue flex h-8 w-8 shrink-0 items-center rounded-md p-2">
              <Mail fill="var(--color-icon-informative)" className="h-7 w-7" />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-text-default text-sm font-medium">Email Address</p>

              <span className="text-text-muted text-xs">{profileData?.email || "—"}</span>
            </div>
          </div>
        </div>

        <div className="border-border-default flex items-center justify-between border-t p-5">
          <div className="flex flex-1 items-center gap-3">
            <div className="bg-bg-badge-green flex h-8 w-8 shrink-0 items-center rounded-md p-2">
              <Phone fill="var(--color-bg-basic-emerald-accent)" className="h-7 w-7" />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-text-default text-sm font-medium">Phone Number</p>

              <span className="text-text-muted text-xs">{profileData?.phoneNumber || "—"}</span>
            </div>
          </div>
          {editing !== "phone" ? (
            <Pencil className="text-icon-default-muted size-4 cursor-pointer" onClick={() => setEditing("phone")} />
          ) : (
            <X
              onClick={() => {
                setPhoneNumber(profileData?.phoneNumber || "");
                setEditing(null);
              }}
              className="text-icon-default-muted size-4 cursor-pointer"
            />
          )}
        </div>

        {editing === "phone" && (
          <div className="border-border-default flex flex-col gap-3 border-t p-5">
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                Phone Number <span className="text-text-destructive">*</span>{" "}
              </Label>
              <Input
                placeholder="Enter Phone Number"
                className="bg-bg-input-soft! text-text-default full h-7 rounded-md border-none text-xs"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between gap-3 md:justify-end">
              <Button
                className="bg-bg-state-secondary hover:bg-bg-state-secondary-hover! border-border-darker text-text-default h-7 rounded-md border text-xs"
                onClick={() => {
                  setPhoneNumber(profileData?.phoneNumber || "");
                  setEditing(null);
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7 text-xs"
                onClick={handleSavePhone}
                disabled={isPending}
              >
                {isPending && <Spinner className="size-3" />}
                Save Changes
              </Button>
            </div>
          </div>
        )}

        <div className="border-border-default flex items-center justify-between border-t p-5">
          <div className="flex flex-1 items-center gap-3">
            <div className="bg-bg-badge-purple flex h-8 w-8 shrink-0 items-center rounded-md p-2">
              <Lock fill="var(--color-bg-basic-purple-accent)" className="h-7 w-7" />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-text-default text-sm font-medium">Password</p>

              <span className="text-text-muted text-xs">••••••••••••</span>
            </div>
          </div>

          <Button
            disabled={isSendingOtp}
            onClick={handleChangePassword}
            className="border-border-darker text-text-default bg-bg-state-secondary! h-7 w-fit rounded-md border text-xs disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSendingOtp && <Spinner className="size-3" />} Change Password
          </Button>
        </div>
      </div>

      <ChangePasswordDialog open={passwordDialogOpen} setOpen={setPasswordDialogOpen} />
    </div>
  );
};
