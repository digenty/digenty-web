"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { genders } from "@/types";
import { Phone } from "@/components/Icons/Phone";
import Mail from "@/components/Icons/Mail";
import { MapPin, Pencil } from "lucide-react";
import Flag from "@/components/Icons/Flag";
import { Avatar } from "@/components/Avatar";
import { GenderLess } from "@/components/Icons/GenderLess";
import School from "@/components/Icons/School";
import { Label } from "@/components/ui/label";

const viewMock = {
  title: "Mrs.",
  firstName: "Adaeze",
  lastName: "Johnson",
  relationship: "Mother",
  avatar: null,
  fields: [
    { icon: Phone, label: "Primary Phone Number", value: "+234 803 456 7890" },
    { icon: Phone, label: "Secondary Phone Number", value: "+234 803 456 7890" },
    { icon: Mail, label: "Email Address", value: "adaeze.johnson@email.com" },
    { icon: MapPin, label: "Home Address", value: "14 Lekki Phase 1, Lagos State" },
    { icon: Flag, label: "Nationality", value: "Nigerian" },
    { icon: Flag, label: "State of Origin", value: "Kwara State" },
    { icon: GenderLess, label: "Gender", value: "Female" },
    { icon: School, label: "Branch", value: "Lawanson" },
  ],
};

const ViewBiodata = ({ onEdit }: { onEdit: () => void }) => (
  <div className="bg-bg-muted rounded-xl p-4">
    <div className="">
      <div className="bg-bg-muted flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar />

          <div>
            <p className="text-text-default text-sm font-semibold">
              {viewMock.title} {viewMock.firstName} {viewMock.lastName}
            </p>
            <p className="text-text-subtle text-xs">{viewMock.relationship}</p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={onEdit}
          className="text-text-default border-border-darker bg-bg-state-secondary hover:bg-bg-state-secondary-hover! flex items-center gap-1.5 rounded-full border font-medium"
        >
          <Pencil className="size-3" />
          Edit <span className="hidden md:block">Biodata</span>
        </Button>
      </div>

      <div className="bg-bg-card w-full rounded-lg">
        {viewMock.fields.map(({ icon: Icon, label, value }) => (
          <div key={label} className="border-border-default flex items-center gap-3 border-b px-4 py-3 last:border-b-0">
            <Icon className="bg-bg-muted mt-0.5 size-4 h-8 w-8 shrink-0 rounded-md p-2" fill="var(--color-icon-default-muted)" />
            <div className="flex flex-col gap-0.5">
              <p className="text-text-muted text-xs">{label}</p>
              <p className="text-text-default text-sm font-medium">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const EditBiodata = ({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) => (
  <div className="bg-bg-muted w-full rounded-xl p-4">
    <div className="">
      <div className="border-border-default border-b px-5 py-4">
        <p className="text-text-default text-md font-semibold">Editing Biodata</p>
        <p className="text-text-subtle text-xs">Changes will be submitted for review</p>
      </div>

      <div className="bg-bg-card rounded-lg">
        <div className="flex flex-col gap-3 px-5 py-5 md:gap-6">
          <div className="border-border-default flex flex-col gap-1.5 border-b pb-3 md:pb-6">
            <p className="text-text-default text-sm font-medium">Picture</p>
            <div className="flex items-center gap-3">
              <Avatar />
              <span className="text-text-default border-border-default bg-bg-state-secondary h-7 cursor-pointer rounded-md border p-1 text-sm font-medium">
                Upload
              </span>
              <span className="text-text-muted text-xs">JPG or PNG. 1MB Max.</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-text-default text-sm font-semibold">Personal Information</p>

            <Select>
              <SelectTrigger className="bg-bg-input-soft! text-text-default h-8 w-full rounded-md border-none">
                <SelectValue placeholder="Select Title" className="text-sm" />
              </SelectTrigger>
              <SelectContent className="bg-bg-card text-text-default border-border-default border text-sm">
                {["Mr.", "Mrs.", "Miss", "Dr."].map(pf => (
                  <SelectItem key={pf} value={pf}>
                    {pf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="border-border-default grid grid-cols-1 gap-3 border-b pb-3 md:grid-cols-2 md:gap-6 md:pb-6">
              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">
                  First Name <span className="text-text-destructive">*</span>{" "}
                </Label>
                <Input placeholder="Input First Name" className="bg-bg-input-soft! h-8 w-full rounded-md border-none text-sm" />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">
                  Last Name <span className="text-text-destructive">*</span>{" "}
                </Label>
                <Input placeholder="Input Last Name" className="bg-bg-input-soft! h-8 w-full rounded-md border-none text-sm" />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">
                  Middle Name <span className="text-text-destructive">*</span>{" "}
                </Label>
                <Input placeholder="Input Middle Name" className="bg-bg-input-soft! h-8 w-full rounded-md border-none text-sm" />{" "}
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">
                  Gender <span className="text-text-destructive">*</span>{" "}
                </Label>
                <Select>
                  <SelectTrigger className="bg-bg-input-soft! text-text-default h-8 w-full rounded-md border-none text-sm">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-bg-card text-text-default border-border-default border text-sm">
                    {genders.map(g => (
                      <SelectItem key={g.label} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">
                  Relationship <span className="text-text-destructive">*</span>{" "}
                </Label>
                <Select>
                  <SelectTrigger className="bg-bg-input-soft! h-8 w-full rounded-md border-none text-sm">
                    <SelectValue placeholder="Select Relationship with Student" />
                  </SelectTrigger>
                  <SelectContent className="bg-bg-card text-text-default border-border-default border text-sm">
                    {["Mother", "Father", "Guardian"].map(g => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">
                  School Branch of Children <span className="text-text-destructive">*</span>{" "}
                </Label>
                <Select>
                  <SelectTrigger className="bg-bg-input-soft! text-text-default h-8 w-full rounded-md border-none text-sm">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent className="bg-bg-card text-text-default border-border-default border text-sm">
                    {["Lawanson", "Ikeja", "Lekki"].map(o => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="gap2 flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">
                  Nationality <span className="text-text-destructive">*</span>{" "}
                </Label>
                <Select>
                  <SelectTrigger className="bg-bg-input-soft! text-text-default h-8 w-full rounded-md border-none text-sm">
                    <SelectValue placeholder="Select Nationality" />
                  </SelectTrigger>
                  <SelectContent className="bg-bg-card text-text-default border-border-default border text-sm">
                    {["Nigerian", "Ghanaian", "Kenyan"].map(o => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">
                  State of Origin <span className="text-text-destructive">*</span>{" "}
                </Label>
                <Select>
                  <SelectTrigger className="bg-bg-input-soft! text-text-default h-8 w-full rounded-md border-none text-sm">
                    <SelectValue placeholder="Select State of Origin" />
                  </SelectTrigger>
                  <SelectContent className="bg-bg-card text-text-default border-border-default border text-sm">
                    {["Lagos State", "Ogun State"].map(o => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:gap-6">
            <p className="text-text-default text-lg font-semibold">Contact Information</p>

            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                Email Address<span className="text-text-destructive">*</span>{" "}
              </Label>
              <Input placeholder="Input Email Address" className="bg-bg-input-soft! h-8 w-full rounded-md border-none text-sm" />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label className="text-text-default w-full text-sm font-medium">
                  Primary Phone Number <span className="text-text-destructive">*</span>
                </Label>
                <div className="bg-bg-input-soft! flex h-8 w-full items-center rounded-md border-none px-3 text-sm">
                  <Select>
                    <SelectTrigger className="text-text-default h-7! w-fit rounded-none! border-none! bg-transparent text-sm hover:bg-transparent!">
                      <SelectValue placeholder="NG" />
                    </SelectTrigger>
                    <SelectContent className="bg-bg-card text-text-default border-border-default border text-sm">
                      {["NG"].map(o => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input placeholder="000-000-0000" className="text-text-default border-none p-0 text-sm" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-text-default w-full text-sm font-medium">
                  Whatsapp Number <span className="text-text-destructive">*</span>
                </Label>
                <div className="bg-bg-input-soft! flex h-8 w-full items-center rounded-md border-none px-3 text-sm">
                  <Select>
                    <SelectTrigger className="text-text-default h-7! w-fit rounded-none! border-none! bg-transparent text-sm hover:bg-transparent!">
                      <SelectValue placeholder="NG" />
                    </SelectTrigger>
                    <SelectContent className="bg-bg-card text-text-default border-border-default border text-sm">
                      {["NG"].map(o => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input placeholder="000-000-0000" className="text-text-default border-none p-0 text-sm" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-text-default w-full text-sm font-medium">
                Home Address<span className="text-text-destructive">*</span>
              </Label>

              <Input placeholder="Input Home Address" className="bg-bg-input-soft! h-8 w-full rounded-md border-none text-sm" />
            </div>
          </div>
        </div>

        <div className="border-border-default flex items-center justify-between gap-3 border-t px-5 py-4 md:justify-end">
          <Button
            onClick={onCancel}
            className="bg-bg-state-secondary hover:bg-bg-state-secondary-hover! border-border-darker text-text-default border text-sm"
          >
            Cancel
          </Button>
          <Button onClick={onSave} className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default text-sm">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export const ParentBioData = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="">
      {isEditing ? (
        <EditBiodata onSave={() => setIsEditing(false)} onCancel={() => setIsEditing(false)} />
      ) : (
        <ViewBiodata onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
};
