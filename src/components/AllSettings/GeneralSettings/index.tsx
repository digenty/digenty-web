"use client";

import { Avatar } from "@/components/Avatar";
import { Cash } from "@/components/Icons/Cash";
import DeleteBin from "@/components/Icons/DeleteBin";
import Edit from "@/components/Icons/Edit";
import Flag from "@/components/Icons/Flag";
import { LightBulb } from "@/components/Icons/LightBulb";
import Mail from "@/components/Icons/Mail";
import Map from "@/components/Icons/Map";
import { Nigeria } from "@/components/Icons/Nigeria";
import { Phone } from "@/components/Icons/Phone";
import School from "@/components/Icons/School";
import { Timee } from "@/components/Icons/Timee";
import User from "@/components/Icons/User";
import { toast } from "@/components/Toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type EditProps = "editName" | "editSchoolName" | "moto" | "editPhoneNum" | "editBranch" | null;

const countries = [
  { label: "Nigeria", logo: Nigeria },
  { label: "Ghana", logo: Nigeria },
];

const currencies = ["Nigerian Naira (₦)"];
const timeZones = ["CEST"];
export const General = () => {
  const [country, setCountry] = useState(countries[0]);
  const [currency, setCurrency] = useState(currencies[0]);
  const [timeZone, setTimeZone] = useState(timeZones[0]);
  const [edit, setEdit] = useState<EditProps>(null);
  const [image, setImage] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const prevUrl = useRef<string | null>(null);

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
      <div className="text-text-default mb-8 text-xl font-semibold">General Settings</div>
      <div className="flex w-full flex-col md:max-w-150">
        <div className="">
          <div className="text-text-default mb-4 text-sm font-medium">School Logo</div>
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

              <Avatar username="Damilare" className="size-10" url={image} />
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
                    <div className="text-text-default text-sm font-medium">Admin Name</div>
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
                    <div className="text-text-default text-sm font-medium">Admin Name</div>
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
                    <Button className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-7!">Save</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="border-border-default flex flex-col gap-4 border-b py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <School fill="var(--color-icon-default-muted)" />
                <div className="text-text-default text-sm font-medium">School name</div>
              </div>
              <div className="text-text-muted text-sm">Digenty Technology</div>
            </div>
            <Button
              onClick={() => setEdit("editSchoolName")}
              className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! rounded-md border text-sm font-medium shadow"
            >
              {" "}
              <Edit fill="var(--color-icon-default-muted)" /> Edit
            </Button>
          </div>

          {edit === "editSchoolName" && (
            <div className="mt-4">
              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">
                  {" "}
                  <School fill="var(--color-icon-default-muted)" /> School name
                </Label>
                <Input className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm font-normal" placeholder="Digenty Technology" />
              </div>

              <div className="mt-4 flex items-center gap-4">
                <Button
                  className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! w-fit rounded-md border text-sm font-medium"
                  onClick={() => setEdit(null)}
                >
                  Cancel
                </Button>
                <Button className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-7!">Save</Button>
              </div>
            </div>
          )}
        </div>
        <div className="border-border-default border-b py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <LightBulb fill="var(--color-icon-default-muted)" />
                <div className="text-text-default text-sm font-medium">Motto</div>
              </div>
              <div className="text-text-muted text-sm">Love & Light</div>
            </div>
            <Button
              onClick={() => setEdit("moto")}
              className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! rounded-md border text-sm font-medium shadow"
            >
              {" "}
              <Edit fill="var(--color-icon-default-muted)" /> Edit
            </Button>
          </div>

          {edit === "moto" && (
            <div className="mt-4">
              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">
                  {" "}
                  <LightBulb fill="var(--color-icon-default-muted)" /> Motto
                </Label>
                <Input className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm font-normal" placeholder="Love & Light" />
              </div>

              <div className="mt-4 flex items-center gap-4">
                <Button
                  className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! w-fit rounded-md border text-sm font-medium"
                  onClick={() => setEdit(null)}
                >
                  Cancel
                </Button>
                <Button className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-7!">Save</Button>
              </div>
            </div>
          )}
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
                <Button className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-7!">Save</Button>
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
            <div className="text-text-muted text-sm">0904 000 0000</div>
          </div>
        </div>
        <div className="border-border-default flex items-center justify-between border-b py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Flag fill="var(--color-icon-default-muted)" />
              <div className="text-text-default text-sm font-medium">Country</div>
            </div>
            <div className="text-text-muted text-sm">0904 000 0000</div>
          </div>
          <Select value={country.label} onValueChange={(val: string) => setCountry(countries.find(c => c.label === val) || countries[0])}>
            <SelectTrigger className="border-border-darker h-8! w-auto border">
              <SelectValue>
                <country.logo />
                <span className="text-text-default text-sm font-medium">{country.label}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default">
              {countries.map(ctry => (
                <SelectItem key={ctry.label} value={ctry.label} className="text-text-default text-sm font-medium">
                  <ctry.logo /> {ctry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="border-border-default flex h-20 items-center justify-between border-b py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Cash fill="var(--color-icon-default-muted)" />
              <div className="text-text-default text-sm font-medium">Currency</div>
            </div>
          </div>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="border-border-darker h-8! w-auto border">
              <SelectValue>
                <span className="text-text-default text-sm font-medium">{currency}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default">
              {currencies.map(cur => (
                <SelectItem key={cur} value={cur} className="text-text-default text-sm font-medium">
                  {cur}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

        <div className="text-text-default border-border-default flex h-20 items-center border-b py-4 text-lg font-semibold">Branch Information</div>

        <div className="border-border-default border-b py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-4">
              <Badge className="border-border-default bg-bg-badge-default! text-text-subtle w-16! rounded-md border p-1 text-xs">Branch 1</Badge>

              <div className="flex items-center gap-2">
                <School fill="var(--color-icon-default-muted)" />
                <div className="text-text-muted text-sm">Digenty Technology</div>
              </div>

              <div className="flex items-center gap-2">
                <Map fill="var(--color-icon-default-muted)" />
                <div className="text-text-muted text-sm">Surulere, Lagos</div>
              </div>
            </div>
            <Button
              onClick={() => setEdit("editBranch")}
              className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! rounded-md border text-sm font-medium shadow"
            >
              <Edit fill="var(--color-icon-default-muted)" /> Edit
            </Button>
          </div>

          {edit === "editBranch" && (
            <div className="flex flex-col gap-4 py-4">
              <div className="flex items-center justify-between gap-2">
                <Badge className="border-border-default bg-bg-badge-default! text-text-subtle w-16! rounded-md border p-1 text-xs">Branch 1</Badge>
                <Button className="bg-bg-state-ghost! hover:bg-bg-state-ghost-hover! text-text-default flex items-center gap-1 border-none text-xs font-medium">
                  {" "}
                  <DeleteBin fill="var(--color-icon-default-muted)" /> Delete Branch
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-text-default flex items-center gap-2 text-sm font-medium">
                  <School fill="var(--color-icon-default-muted)" /> Branch Name
                </Label>
                <Input className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm font-normal" placeholder="Digenty" />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-text-default flex items-center gap-2 text-sm font-medium">
                  {" "}
                  <Map fill="var(--color-icon-default-muted)" /> Branch Address
                </Label>
                <Input className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm font-normal" placeholder="Surulere, Lagos." />
              </div>

              <div className="flex items-center gap-4">
                <Button
                  className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! w-fit rounded-md border text-sm font-medium"
                  onClick={() => setEdit(null)}
                >
                  Cancel
                </Button>
                <Button className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-7!">Save</Button>
              </div>
            </div>
          )}
        </div>

        <Button className="bg-bg-state-soft mt-4 self-start">
          <PlusIcon className="text-icon-default-muted size-4" /> Add Branch
        </Button>
      </div>
    </div>
  );
};
