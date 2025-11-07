"use client";
import Image from "next/image";
import { Button } from "../../ui/button";

export const ProfilePicture = () => {
  return (
    <div className="border-border-default space-y-4 border-b pb-6 md:space-y-6">
      <h2 className="text-lg font-semibold">Profile Picture</h2>

      <div className="flex items-center gap-4">
        <div className="flex size-10 items-center justify-between rounded-full">
          <Image src="/images/profile-picture.png" alt="profile" className="rounded-full" width={40} height={40} />
        </div>

        <Button className="border-border-darker text-text-default h-7 border px-2! text-sm font-medium">Upload</Button>
        <p className="text-text-muted text-xs font-normal">JPG or PNG. 1MB Max.</p>
      </div>
    </div>
  );
};
