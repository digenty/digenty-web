import { BranchWithClassLevels } from "@/api/types";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { genders, relationships } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export const YourDetails = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isLoading: isLoadingBranches } = useGetBranches();

  return (
    <div className="border-border-default flex flex-col rounded-md border">
      <div className="border-border-default flex flex-col gap-1 border-b p-3 md:px-6 md:py-4">
        <div className="text-text-default text-md font-semibold">Your Personal Details</div>
        <div className="text-text-muted text-xs font-normal">Tell us about yourself</div>
      </div>

      <div className="flex flex-col p-3 md:px-6 md:py-4">
        <div className="border-border-default flex flex-col gap-1 border-b pb-4">
          <div className="text-text-default text-sm">Profile</div>
          <div className="flex items-center gap-4">
            <Avatar className="size-8" />
            <Button className="text-text-default bg-bg-state-secondary hover:bg-bg-state-secondary-hover! border-border-darker h-7 w-17 border text-sm">
              Upload
            </Button>
            <div className="text-text-muted text-xs font-normal">JPG or PNG. 1MB Max.</div>
          </div>
        </div>
        <div className="flex flex-col gap-8 pt-8">
          <div className="text-text-default text-lg font-semibold">Personal Information</div>
          <div className="border-border-default grid gap-8 border-b pb-8 md:grid-cols-2">
            <div className="flex w-full flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                First Name
                <span className="text-text-destructive text-xs">*</span>
              </Label>
              <Input className="text-text-default bg-bg-input-soft! h-9 border-none" placeholder="Input First Name" />
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                Last Name
                <span className="text-text-destructive text-xs">*</span>
              </Label>
              <Input className="text-text-default bg-bg-input-soft! h-9 border-none" placeholder="Input  Last Name" />
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">Middle Name</Label>
              <Input className="text-text-default bg-bg-input-soft! h-9 border-none" placeholder="Input Middle Name" />
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                Gender <span className="text-text-destructive text-xs">*</span>
              </Label>
              <Select>
                <SelectTrigger className="text-text-default bg-bg-input-soft! h-9 w-full border-none">
                  <SelectValue placeholder="Select Gender"></SelectValue>
                </SelectTrigger>

                <SelectContent className="bg-bg-default border-border-default">
                  {genders.map(g => (
                    <SelectItem key={g.label} value={g.value} className="text-text-default">
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                Relationship <span className="text-text-destructive text-xs">*</span>
              </Label>
              <Select>
                <SelectTrigger className="text-text-default bg-bg-input-soft! h-9 w-full border-none">
                  <SelectValue placeholder="Select Relationship with Student"></SelectValue>
                </SelectTrigger>

                <SelectContent className="bg-bg-default border-border-default">
                  {relationships.map(r => (
                    <SelectItem key={r.label} value={r.value} className="text-text-default">
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                School Branch of Students <span className="text-text-destructive text-xs">*</span>
              </Label>
              {isLoadingBranches && <Skeleton className="bg-bg-input-soft h-9 w-full" />}
              {!isLoadingBranches && (
                <Select>
                  <SelectTrigger className="text-text-default bg-bg-input-soft! h-9 w-full border-none">
                    <SelectValue placeholder="Select Branch"></SelectValue>
                  </SelectTrigger>

                  <SelectContent className="bg-bg-default border-border-default">
                    {data?.data?.map((br: BranchWithClassLevels) => (
                      <SelectItem key={br.branch.name} value={String(br.branch.name)} className="text-text-default">
                        {br.branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                Nationality <span className="text-text-destructive text-xs">*</span>
              </Label>
              <Select>
                <SelectTrigger className="text-text-default bg-bg-input-soft! h-9 w-full border-none">
                  <SelectValue placeholder="Select Nationality"></SelectValue>
                </SelectTrigger>

                <SelectContent></SelectContent>
              </Select>
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                State of Origin <span className="text-text-destructive text-xs">*</span>
              </Label>
              <Select>
                <SelectTrigger className="text-text-default bg-bg-input-soft! h-9 w-full border-none">
                  <SelectValue placeholder=" Select State of Origin"></SelectValue>
                </SelectTrigger>

                <SelectContent></SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-text-default text-lg font-semibold">Contact Information</div>
          <div className="flex flex-col gap-6 pb-8">
            <div className="flex w-full flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                Email Address
                <span className="text-text-destructive text-xs">*</span>
              </Label>
              <Input className="text-text-default bg-bg-input-soft! h-9 border-none" placeholder="Input Email Address" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex w-full flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">
                  Primary Phone Number
                  <span className="text-text-destructive text-xs">*</span>
                </Label>

                <Input className="text-text-default bg-bg-input-soft! h-9 border-none" placeholder="000-000-0000" />
              </div>
              <div className="flex w-full flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">
                  Whatsapp Number
                  <span className="text-text-destructive text-xs">*</span>
                </Label>
                <Input className="text-text-default bg-bg-input-soft! h-9 border-none" placeholder="000-000-0000" />
              </div>
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                Home Address
                <span className="text-text-destructive text-xs">*</span>
              </Label>

              <Input className="text-text-default bg-bg-input-soft! h-9 border-none" placeholder="Input Home Address" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-border-default border-t">
        <div className="flex justify-end p-4">
          <Button
            onClick={() => router.push(`${pathname}?step=student`)}
            className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary-hover!"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};
