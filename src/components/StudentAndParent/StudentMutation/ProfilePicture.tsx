"use client";
import Image from "next/image";
import { Button } from "../../ui/button";
import { useRef, useState } from "react";
import { Avatar } from "@/components/Avatar";

export const ProfilePicture = ({ setAvatar }: { setAvatar: React.Dispatch<React.SetStateAction<File | null>> }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>("/images/profile-picture.png");

  const handleFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (!file) return;

    setImageUrl(URL.createObjectURL(file));
    setAvatar(file);
  };

  const handleCustomButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border-border-default space-y-4 border-b pb-6 md:space-y-6">
      <h2 className="text-lg font-semibold">Profile Picture</h2>

      <div className="flex items-center gap-4">
        <div className="flex size-10 items-center justify-between rounded-full">
          {/* <Image src={imageUrl} alt="profile" className="rounded-full" width={40} height={40} /> */}
          <Avatar url={imageUrl} username="" className="border-border-default size-10 border" />
          <input id="file-upload" type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        </div>

        <Button onClick={handleCustomButtonClick} className="border-border-darker text-text-default h-7 border px-2! text-sm font-medium">
          Upload
        </Button>
        <p className="text-text-muted text-xs font-normal">JPG or PNG. 1MB Max.</p>
      </div>
    </div>
  );
};
