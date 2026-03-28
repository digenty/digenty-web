import { Parent } from "@/api/types";
import { Avatar } from "@/components/Avatar";
import { PageEmptyState } from "@/components/Error/PageEmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { Pencil } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export const ParentReview = ({ data, isLoading }: { data: Parent; isLoading: boolean }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="border-border-default flex flex-col gap-6 rounded-md border">
      <div className="border-border-default border-b">
        <div className="flex justify-between px-4 py-2">
          <div className="text-text-default text-lg font-semibold">Your Details</div>
          {isLoading || !data ? (
            <Skeleton className="bg-bg-input-soft h-8 w-30" />
          ) : (
            <Button onClick={() => router.push(`${pathname}?step=your-details`)} className="text-text-muted bg-none font-medium hover:bg-none!">
              <Pencil />
              Edit Details
            </Button>
          )}
        </div>
      </div>

      {isLoading && <Skeleton className="bg-bg-input-soft h-100 w-full" />}

      {!isLoading && !data && (
        <PageEmptyState
          title="No Data"
          description="You do not have any data yet. Kindly fill your data"
          buttonText="Enter details"
          url={`${pathname}?step=your-details`}
        />
      )}

      {!isLoading && data && (
        <div className="flex flex-col gap-6 p-4">
          <Avatar className="size-8" />
          <div className="text-text-default text-lg font-semibold">Personal Information</div>

          <div className="flex flex-col gap-3">
            <div className="border-border-default flex items-center border-b pb-2">
              <div className="text-text-subtle flex-1 text-sm">First Name</div>
              <div className="text-text-default flex-1 text-sm">{data.firstName || "_"}</div>
            </div>

            <div className="border-border-default flex items-center border-b pb-2">
              <div className="text-text-subtle flex-1 text-sm">Last Name</div>
              <div className="text-text-default flex-1 text-sm">{data.lastName || "_"}</div>
            </div>

            <div className="border-border-default flex items-center border-b pb-2">
              <div className="text-text-subtle flex-1 text-sm">Middle Name</div>
              <div className="text-text-default flex-1 text-sm">{data.middleName || "_"}</div>
            </div>
            <div className="border-border-default flex items-center border-b pb-2">
              <div className="text-text-subtle flex-1 text-sm">Gender</div>
              <div className="text-text-default flex-1 text-sm">{data.gender || "_"}</div>
            </div>
            <div className="border-border-default flex items-center border-b pb-2">
              <div className="text-text-subtle flex-1 text-sm">Relationship with Students</div>
              <div className="text-text-default flex-1 text-sm">
                {data?.linkedStudents.map(r => (
                  <span key={r.id}>{r.relationship}</span>
                ))}
              </div>
            </div>

            <div className="border-border-default flex items-center border-b pb-2">
              <div className="text-text-subtle flex-1 text-sm">School Branch of Students</div>
              <div className="text-text-default flex-1 text-sm">{data.branch || "_"}</div>
            </div>

            <div className="border-border-default flex items-center border-b pb-2">
              <div className="text-text-subtle flex-1 text-sm">Nationality</div>
              <div className="text-text-default flex-1 text-sm">{data.nationality || "_"}</div>
            </div>
            <div className="border-border-default flex items-center border-b pb-2">
              <div className="text-text-subtle flex-1 text-sm">State of Origin</div>
              <div className="text-text-default flex-1 text-sm">{data.stateOfOrigin || "_"}</div>
            </div>
          </div>
          <div className="border-border-default border"></div>

          <div className="text-text-default text-lg font-semibold">Contact Information</div>

          <div className="flex flex-col gap-3">
            <div className="border-border-default flex items-center border-b pb-2">
              <div className="text-text-subtle flex-1 text-sm">Home Address</div>
              <div className="text-text-default flex-1 text-sm">{data.address || "_"}</div>
            </div>

            <div className="border-border-default flex items-center border-b pb-2">
              <div className="text-text-subtle flex-1 text-sm">Primary Phone Number</div>
              <div className="text-text-default flex-1 text-sm">{data.phoneNumber || "_"}</div>
            </div>

            <div className="border-border-default flex items-center border-b pb-2">
              <div className="text-text-subtle flex-1 text-sm">Whatsapp Number</div>
              <div className="text-text-default flex-1 text-sm">{data.secondaryPhoneNumber || "_"}</div>
            </div>
            <div className="border-border-default flex items-center border-b pb-2">
              <div className="text-text-subtle flex-1 text-sm">Email Address</div>
              <div className="text-text-default flex-1 text-sm">{data.email || "_"}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
