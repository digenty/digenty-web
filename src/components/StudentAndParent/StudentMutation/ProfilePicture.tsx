"use client";
import { Avatar } from "@/components/Avatar";
import { useRef, useState } from "react";
import { Button } from "../../ui/button";
import { uploadImage } from "@/app/actions/upload-image";

export const ProfilePicture = ({ setAvatar }: { setAvatar: (url: string | null) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>("/images/profile-picture.png");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const data = await uploadImage(formData);
      if (data?.url) {
        setImageUrl(data.url);
        setAvatar(data.url);
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCustomButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border-border-default space-y-4 border-b pb-6 md:space-y-6">
      <h2 className="text-lg font-semibold">Profile Picture</h2>

      <div className="flex items-center gap-4">
        <div className="flex size-10 items-center justify-between rounded-full">
          <Avatar url={imageUrl} className="border-border-default size-10 border" />
          <input id="file-upload" type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        </div>

        <Button
          onClick={handleCustomButtonClick}
          disabled={isUploading}
          className="border-border-darker text-text-default h-7 border px-2! text-sm font-medium"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
        <p className="text-text-muted text-xs font-normal">JPG or PNG. 1MB Max.</p>
      </div>
    </div>
  );
};
