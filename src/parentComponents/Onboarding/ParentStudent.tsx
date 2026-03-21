"use client";

import { Arm, BranchWithClassLevels, ClassType } from "@/api/types";
import { Avatar } from "@/components/Avatar";
import { DateRangePicker } from "@/components/DatePicker";
import { ArrowUpS } from "@/components/Icons/ArrowUpS";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetArmsByClass } from "@/hooks/queryHooks/useArm";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetClasses } from "@/hooks/queryHooks/useClass";
import { cn, getAcademicYears } from "@/lib/utils";
import { admissions, boardings, genders, terms } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

type AccordionItem = {
  id: number;
  title: string;
  content: string;
};

export const ParentStudent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [items, setItems] = useState<AccordionItem[]>([{ id: 1, title: "Student", content: "" }]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState();
  const [branchId, setBranchId] = useState<number | undefined>();
  const [classId, setClassId] = useState<number | undefined>();
  const { data: branches, isPending: loadingBranches } = useGetBranches();
  const { data: classes, isPending: loadingClasses } = useGetClasses(branchId);
  const { data: arms, isPending: loadingArms } = useGetArmsByClass(classId);

  function addItem() {
    setItems(prev => [
      ...prev,
      {
        id: prev.length + 1,
        title: "Student",
        content: "",
      },
    ]);
  }

  function toggle(id: number) {
    setOpenId(prev => (prev === id ? null : id));
  }
  return (
    <div className="border-border-default flex flex-col gap-6 rounded-md border p-4">
      <div className="border-border-default border-b">
        <div className="flex flex-col gap-1 pb-4">
          <div className="text-text-default text-md font-semibold">Student Information</div>
          <div className="text-text-muted text-xs">Add one or more children attending this school</div>
        </div>
      </div>

      <div className="pt-4s flex flex-col gap-2">
        {items.map((item, index) => (
          <div key={item.id} className="border-border-default rounded-md border">
            <div
              role="button"
              onClick={() => toggle(item.id)}
              className="border-border-default flex w-full items-center justify-between border-b p-4"
            >
              <div className="flex items-center gap-2">
                <span className="bg-bg-state-gray text-text-inverted-default flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
                  {" "}
                  {index + 1}
                </span>
                <span className="text-text-default text-lg font-medium">
                  {item.title} {index + 1}
                </span>
              </div>
              <ArrowUpS fill="var(--color-icon-default-muted)" className={`transition-transform ${openId === item.id ? "rotate-180" : ""}`} />
            </div>
            {openId === item.id && (
              <div className="p-3 md:px-6 md:py-4">
                <div className="border-border-default flex flex-col gap-6 border-b pb-6">
                  <div className="text-text-default text-lg font-semibold">Profile Picture</div>
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
                      <DateRangePicker
                        value={dateOfBirth}
                        label="Date of Birth"
                        onChange={() => setDateOfBirth}
                        className="bg-bg-input-soft! text-text-default h-9!"
                      />
                    </div>

                    <div className="flex w-full flex-col gap-2">
                      <Label className="text-text-default text-sm font-medium">Medical Information</Label>
                      <Input placeholder="Input Any Medical Information" className="bg-bg-input-soft! text-text-default h-9! border-none" />
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
                  <div className="border-border-default flex flex-col gap-6 border-b pb-8">
                    <div className="flex w-full flex-col gap-2">
                      <Label className="text-text-default text-sm font-medium">
                        Home Address
                        <span className="text-text-destructive text-xs">*</span>
                      </Label>
                      <Input className="text-text-default bg-bg-input-soft! h-9 border-none" placeholder="Input Home Address" />
                    </div>

                    <div className="flex w-full flex-col gap-2">
                      <Label className="text-text-default text-sm font-medium">Email Address</Label>
                      <Input className="text-text-default bg-bg-input-soft! h-9 border-none" placeholder="Input Email Address" />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex w-full flex-col gap-2">
                        <Label className="text-text-default text-sm font-medium">Primary Phone Number</Label>

                        <Input className="text-text-default bg-bg-input-soft! h-9 border-none" placeholder="000-000-0000" />
                      </div>
                      <div className="flex w-full flex-col gap-2">
                        <Label className="text-text-default text-sm font-medium">Secondary Phone Number</Label>
                        <Input className="text-text-default bg-bg-input-soft! h-9 border-none" placeholder="000-000-0000" />
                      </div>

                      <div className="flex w-full flex-col gap-2">
                        <Label className="text-text-default text-sm font-medium">Emergency Contact Name</Label>

                        <Input
                          className="text-text-default bg-bg-input-soft! h-9 border-none"
                          placeholder="Input Emergency Contact Name"
                          type="name"
                        />
                      </div>

                      <div className="flex w-full flex-col gap-2">
                        <Label className="text-text-default text-sm font-medium">Emergency Contact Number</Label>

                        <Input
                          className="text-text-default bg-bg-input-soft! h-9 border-none"
                          placeholder="Input Emergency Contact Number"
                          type="number"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-text-default text-lg font-semibold">Academic Information</div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="joinedSchoolSession" className="text-text-default text-sm font-medium">
                        Joined School Session<small className="text-text-destructive text-xs">*</small>
                      </Label>
                      <Select>
                        <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                          <SelectValue placeholder="Select Session" />
                        </SelectTrigger>
                        <SelectContent className="bg-bg-card border-none">
                          {getAcademicYears().map(session => (
                            <SelectItem key={session} className="text-text-default" value={session}>
                              {session}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nationality" className="text-text-default text-sm font-medium">
                        Joined School Term<small className="text-text-destructive text-xs">*</small>
                      </Label>
                      <Select>
                        <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                          <SelectValue placeholder="Select Term" />
                        </SelectTrigger>
                        <SelectContent className="bg-bg-card border-none">
                          {terms.map(term => (
                            <SelectItem key={term.value} className="text-text-default" value={term.value}>
                              {term.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admissionNumber" className="text-text-default text-sm font-medium">
                        Admission Number
                      </Label>
                      <Input
                        id="admissionNumber"
                        placeholder="GFA/2023/01045"
                        type="text"
                        className={cn("text-text-muted bg-bg-input-soft! placeholder-text-hint! border-none text-sm font-normal")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="branch" className="text-text-default text-sm font-medium">
                        Branch <small className="text-text-destructive text-xs">*</small>
                      </Label>
                      {!branches || loadingBranches ? (
                        <Skeleton className="bg-bg-input-soft h-9 w-full" />
                      ) : (
                        <Select
                          onValueChange={value => {
                            const branch = branches.data?.find((branch: BranchWithClassLevels) => branch.branch.uuid === value);

                            setBranchId(branch.branch.id);
                          }}
                        >
                          <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                            <SelectValue placeholder="Branch" />
                          </SelectTrigger>
                          <SelectContent className="bg-bg-card border-none">
                            {branches?.data?.map((br: BranchWithClassLevels) => (
                              <SelectItem key={br.branch.name} value={String(br.branch.name)} className="text-text-default">
                                {br.branch.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="class" className="text-text-default text-sm font-medium">
                        Class <small className="text-text-destructive text-xs">*</small>
                      </Label>
                      {!classes || loadingClasses ? (
                        <Skeleton className="bg-bg-input-soft h-9 w-full" />
                      ) : (
                        <Select
                          onValueChange={value => {
                            const classObj = classes.data.content?.find((cls: ClassType) => cls.uuid === value);

                            setClassId(classObj.id);
                          }}
                        >
                          <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                            <SelectValue placeholder="Class" />
                          </SelectTrigger>
                          <SelectContent className="bg-bg-card border-none">
                            {classes.data.content.map((cls: ClassType) => (
                              <SelectItem key={cls.id} className="text-text-default" value={cls.uuid}>
                                {cls.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="arm" className="text-text-default text-sm font-medium">
                        Arm <small className="text-text-destructive text-xs">*</small>{" "}
                        <span className="text-text-default text-xs font-light">{!classId && "(Select a class first)"}</span>
                      </Label>
                      {!arms || loadingArms ? (
                        <Skeleton className="bg-bg-input-soft h-9 w-full" />
                      ) : (
                        <Select
                          disabled={!classId}
                          onValueChange={value => {
                            const arm = arms.data?.content?.find((arm: Arm) => arm.uuid === value);
                          }}
                        >
                          <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                            <SelectValue placeholder="Arm" />
                          </SelectTrigger>
                          <SelectContent className="bg-bg-card border-none">
                            {arms.data.content.length === 0 && (
                              <SelectItem disabled className="text-text-default" value="none">
                                No Arms Found
                              </SelectItem>
                            )}
                            {arms.data.content.map((arm: Arm) => (
                              <SelectItem key={arm.id} className="text-text-default" value={arm.uuid}>
                                {arm.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="boardingStatus" className="text-text-default text-sm font-medium">
                        Boarding Status
                      </Label>
                      <Select>
                        <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                          <SelectValue placeholder="Boarding Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-bg-card border-none">
                          {boardings.map(status => (
                            <SelectItem key={status.value} className="text-text-default" value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admissionStatus" className="text-text-default text-sm font-medium">
                        Admission Status <small className="text-text-destructive text-xs">*</small>
                      </Label>
                      <Select>
                        <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                          <SelectValue placeholder="Admission Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-bg-card border-none">
                          {admissions.map(ad => (
                            <SelectItem key={ad.value} className="text-text-default" value={ad.value}>
                              {ad.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">
                      Input Role
                      <span className="text-text-destructive text-xs">*</span>
                    </Label>
                    <Input className="text-text-default bg-bg-input-soft! h-9 w-full border-none" placeholder="Input Position" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <Button onClick={addItem} className="text-text-default border-border-default w-full border border-dashed text-center">
          + Add item
        </Button>
      </div>

      <div className="border-border-default flex w-full justify-between border-t pt-4">
        <Button onClick={() => router.back()} className="bg-bg-state-soft hover:bg-bg-state-soft-hover! text-text-subtle h-8">
          Back
        </Button>
        <Button
          onClick={() => router.push(`${pathname}?step=review`)}
          className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
