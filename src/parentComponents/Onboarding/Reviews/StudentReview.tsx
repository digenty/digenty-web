import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export const StudentReview = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="border-border-default flex flex-col gap-6 rounded-md border">
      <div className="border-border-default border-b">
        <div className="flex justify-between px-4 py-2">
          <div className="text-text-default text-lg font-semibold">Student 1 Details</div>
          <Button onClick={() => router.push(`${pathname}?step=student`)} className="text-text-muted bg-none font-medium hover:bg-none!">
            <Pencil />
            Edit Details
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6 p-4">
        <Avatar className="size-8" />
        <div className="text-text-default text-lg font-semibold">Personal Information</div>

        <div className="flex flex-col gap-3">
          <div className="border-border-default flex items-center border-b pb-2">
            <div className="text-text-subtle flex-1 text-sm">First Name</div>
            <div className="text-text-default flex-1 text-sm">Damilare</div>
          </div>

          <div className="border-border-default flex items-center border-b pb-2">
            <div className="text-text-subtle flex-1 text-sm">Last Name</div>
            <div className="text-text-default flex-1 text-sm">Damilare</div>
          </div>

          <div className="border-border-default flex items-center border-b pb-2">
            <div className="text-text-subtle flex-1 text-sm">Middle Name</div>
            <div className="text-text-default flex-1 text-sm">Damilare</div>
          </div>
          <div className="border-border-default flex items-center border-b pb-2">
            <div className="text-text-subtle flex-1 text-sm">Gender</div>
            <div className="text-text-default flex-1 text-sm">M</div>
          </div>
          <div className="border-border-default flex items-center border-b pb-2">
            <div className="text-text-subtle flex-1 text-sm">Date of Birth</div>
            <div className="text-text-default flex-1 text-sm">Damilare</div>
          </div>

          <div className="border-border-default flex items-center border-b pb-2">
            <div className="text-text-subtle flex-1 text-sm">Medical Information</div>
            <div className="text-text-default flex-1 text-sm">Damilare</div>
          </div>

          <div className="border-border-default flex items-center border-b pb-2">
            <div className="text-text-subtle flex-1 text-sm">Nationality</div>
            <div className="text-text-default flex-1 text-sm">Damilare</div>
          </div>
          <div className="border-border-default flex items-center border-b pb-2">
            <div className="text-text-subtle flex-1 text-sm">State of Origin</div>
            <div className="text-text-default flex-1 text-sm">Damilare</div>
          </div>
        </div>
        <div className="border-border-default border"></div>

        <div className="text-text-default text-lg font-semibold">Contact Information</div>

        <div className="flex flex-col gap-3">
          <div className="border-border-default flex items-center border-b pb-2">
            <div className="text-text-subtle flex-1 text-sm">Home Address</div>
            <div className="text-text-default flex-1 text-sm">Damilare</div>
          </div>

          <div className="border-border-default flex items-center border-b pb-2">
            <div className="text-text-subtle flex-1 text-sm">Email Address</div>
            <div className="text-text-default flex-1 text-sm">Damilare</div>
          </div>

          <div className="border-border-default flex items-center border-b pb-2">
            <div className="text-text-subtle flex-1 text-sm">Primary Phone Number</div>
            <div className="text-text-default flex-1 text-sm">Damilare</div>
          </div>

          <div className="border-border-default flex items-center border-b pb-2">
            <div className="text-text-subtle flex-1 text-sm">Whatsapp Number</div>
            <div className="text-text-default flex-1 text-sm">Damilare</div>
          </div>

          <div className="border-border-default flex items-center border-b pb-2">
            <div className="text-text-subtle flex-1 text-sm">Emergency Contact Name</div>
            <div className="text-text-default flex-1 text-sm">-</div>
          </div>

          <div className="border-border-default flex items-center border-b pb-2">
            <div className="text-text-subtle flex-1 text-sm">Emergency Contact Number</div>
            <div className="text-text-default flex-1 text-sm">-</div>
          </div>
        </div>

        <div className="text-text-default text-lg font-semibold">Academic Information</div>

        <div className="flex flex-col gap-3">
          <div className="border-border-default flex items-center border-b pb-2">
            <div className="text-text-subtle flex-1 text-sm">Joined School Session</div>
            <div className="text-text-default flex-1 text-sm">Damilare</div>
          </div>

          <div className="border-border-default flex items-center border-b pb-2">
            <div className="text-text-subtle flex-1 text-sm">Joined School Term</div>
            <div className="text-text-default flex-1 text-sm">Damilare</div>
          </div>

          <div className="border-border-default flex items-center border-b pb-2">
            <div className="text-text-subtle flex-1 text-sm">Admission Number</div>
            <div className="text-text-default flex-1 text-sm">Damilare</div>
          </div>

          <div className="border-border-default flex items-center border-b pb-2">
            <div className="text-text-subtle flex-1 text-sm">Branch</div>
            <div className="text-text-default flex-1 text-sm">Damilare</div>
          </div>

          <div className="border-border-default flex items-center border-b pb-2">
            <div className="text-text-subtle flex-1 text-sm">Class</div>
            <div className="text-text-default flex-1 text-sm">-</div>
          </div>

          <div className="border-border-default flex items-center border-b pb-2">
            <div className="text-text-subtle flex-1 text-sm">Arm</div>
            <div className="text-text-default flex-1 text-sm">-</div>
          </div>

          <div className="border-border-default flex items-center border-b pb-2">
            <div className="text-text-subtle flex-1 text-sm">Admission Status</div>
            <div className="text-text-default flex-1 text-sm">-</div>
          </div>
          <div className="border-border-default flex items-center border-b pb-2">
            <div className="text-text-subtle flex-1 text-sm">Boarding Status</div>
            <div className="text-text-default flex-1 text-sm">-</div>
          </div>
          <div className="border-border-default flex items-center border-b pb-2">
            <div className="text-text-subtle flex-1 text-sm">Role</div>
            <div className="text-text-default flex-1 text-sm">-</div>
          </div>
        </div>
      </div>
    </div>
  );
};
