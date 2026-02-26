"use client";

import { Avatar } from "@/components/Avatar";
import { Cash } from "@/components/Icons/Cash";
import DeleteBin from "@/components/Icons/DeleteBin";
import Edit from "@/components/Icons/Edit";
import Flag from "@/components/Icons/Flag";
import { LightBulb } from "@/components/Icons/LightBulb";
import Mail from "@/components/Icons/Mail";
import Map from "@/components/Icons/Map";
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
import { useAddBranch, useGetBranches, useUpdateBranch } from "@/hooks/queryHooks/useBranch";
import { useGetSchools, usePutSchool } from "@/hooks/queryHooks/useSchool";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { PlusIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { SchoolData } from "./types";
import { uploadImage } from "@/app/actions/upload-image";
import { useGetCountries } from "@/hooks/queryHooks/useCountry";
import { currencies } from "@/store/currenciesCode";
import { Spinner } from "@/components/ui/spinner";
import { Timezones } from "@/store/timeZone";
import { Skeleton } from "@/components/ui/skeleton";

type EditProps = "editName" | "editSchoolName" | "moto" | "editPhoneNum" | "editBranch" | "newBranch" | null;

export const General = () => {
  const user = useLoggedInUser();
  const schoolId = user?.schoolId as number;
  const adminId = user?.id;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const prevUrl = useRef<string | null>(null);
  const [currency, setCurrency] = useState(currencies[0]);
  const [edit, setEdit] = useState<EditProps>(null);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [motto, setMotto] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryId, setCountryId] = useState("");
  const [timezone, setTimezone] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [branchName, setBranchName] = useState("");
  const [branchAddress, setBranchAddress] = useState("");
  const [activeBranchId, setActiveBranchId] = useState<number | null>(null);
  const { data: schoolsResponse } = useGetSchools();
  const { data: branchesResponse, isFetching: isLoadingBranch } = useGetBranches();
  const { data: countries = [] } = useGetCountries();
  const schools: SchoolData[] = schoolsResponse?.data ?? [];
  const school = schools.find(s => s.id === schoolId);
  const branches = branchesResponse?.data?.content ?? [];
  const putSchool = usePutSchool();
  const addBranch = useAddBranch();
  const updateBranch = useUpdateBranch();

  useEffect(() => {
    if (!school) return;
    setSchoolName(school.name ?? "");
    setMotto(school.motto ?? "");
    setPhoneNumber(school.phoneNumber ?? "");
    setCountryId(school.country ?? "");
    setCurrency(school.currency ?? "");
    setTimezone(school.timezone ?? "");
    setLogoUrl(school.logo ?? "");
  }, [school]);

  useEffect(() => {
    return () => {
      if (prevUrl.current) URL.revokeObjectURL(prevUrl.current);
    };
  }, []);

  const buildSchoolPayload = (overrides: Partial<Parameters<typeof putSchool.mutate>[0]> = {}) => ({
    schoolId,
    adminId: Number(adminId),
    logo: logoUrl,
    schoolName,
    motto,
    phoneNumber: Number(phoneNumber),
    country: countryId,
    currency,
    timezone,
    ...overrides,
  });
  const resetBranchForm = () => {
    setEdit(null);
    setBranchName("");
    setBranchAddress("");
    setActiveBranchId(null);
  };

  const handleSaveSchool = (overrides?: Partial<Parameters<typeof putSchool.mutate>[0]>) => {
    putSchool.mutate(buildSchoolPayload(overrides), {
      onSuccess: () => {
        toast({ title: "Saved", description: "Settings updated.", type: "success" });
        setEdit(null);
      },
      onError: () => {
        toast({ title: "Error", description: "Could not save changes.", type: "error" });
      },
    });
  };

  const handleSaveBranch = () => {
    if (activeBranchId) {
      updateBranch.mutate(
        { branchId: activeBranchId, name: branchName, address: branchAddress },
        {
          onSuccess: () => {
            toast({ title: "Saved", description: "Branch updated.", type: "success" });
            resetBranchForm();
          },
          onError: () => {
            toast({ title: "Error", description: "Could not update branch.", type: "error" });
          },
        },
      );
    } else {
      addBranch.mutate(
        {
          branchDtos: [{ branchName: branchName, address: branchAddress }],
        },
        {
          onSuccess: () => {
            toast({ title: "Saved", description: "Branch added.", type: "success" });
            resetBranchForm();
          },
          onError: () => {
            toast({ title: "Error", description: "Could not add branch.", type: "error" });
          },
        },
      );
    }
  };

  const handleUploadClick = () => inputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast({ title: "Invalid file type", description: "JPG or PNG only.", type: "error" });
      e.currentTarget.value = "";
      return;
    }
    if (file.size > 1024 * 1024) {
      toast({ title: "File too large", description: "Max 1MB.", type: "error" });
      e.currentTarget.value = "";
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    if (prevUrl.current) URL.revokeObjectURL(prevUrl.current);
    prevUrl.current = previewUrl;
    setImage(previewUrl);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadImage(formData);
      const uploadedUrl = result.url;
      setLogoUrl(uploadedUrl);
      handleSaveSchool({ logo: uploadedUrl });
      toast({ title: "Logo updated", description: "School logo saved.", type: "success" });
    } catch {
      toast({ title: "Upload failed", description: "Could not upload image.", type: "error" });
      setImage(undefined);
    }
    e.currentTarget.value = "";
  };

  const selectedCountry = countries.find(c => c.id === countryId);
  const isSavingSchool = putSchool.isPending;
  const isSavingBranch = addBranch.isPending || updateBranch.isPending;

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
              <Avatar className="size-10" url={image ?? logoUrl} />
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
                  <div className="text-text-muted text-sm">{firstName || lastName ? `${firstName} ${lastName}`.trim() : "—"}</div>
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
                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">First Name</Label>
                    <Input
                      className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="First name"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">Last Name</Label>
                    <Input
                      className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Last name"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! w-fit rounded-md border text-sm font-medium"
                      onClick={() => setEdit(null)}
                    >
                      Cancel
                    </Button>

                    <Button
                      className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-7!"
                      onClick={() => setEdit(null)}
                    >
                      Save
                    </Button>
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
              <div className="text-text-muted text-sm">{schoolName || "—"}</div>
            </div>
            <Button
              onClick={() => setEdit("editSchoolName")}
              className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! rounded-md border text-sm font-medium shadow"
            >
              <Edit fill="var(--color-icon-default-muted)" /> Edit
            </Button>
          </div>
          {edit === "editSchoolName" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">School name</Label>
                <Input
                  className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm"
                  value={schoolName}
                  onChange={e => setSchoolName(e.target.value)}
                  placeholder="School name"
                />
              </div>
              <div className="flex items-center gap-4">
                <Button
                  className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! w-fit rounded-md border text-sm font-medium"
                  onClick={() => setEdit(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default flex h-7! items-center gap-1"
                  onClick={() => handleSaveSchool({ schoolName })}
                  disabled={isSavingSchool}
                >
                  {isSavingSchool && <Spinner className="text-text-white-default size-3" />} Save
                </Button>
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
              <div className="text-text-muted text-sm">{motto || "—"}</div>
            </div>
            <Button
              onClick={() => setEdit("moto")}
              className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! rounded-md border text-sm font-medium shadow"
            >
              <Edit fill="var(--color-icon-default-muted)" /> Edit
            </Button>
          </div>
          {edit === "moto" && (
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">Motto</Label>
                <Input
                  className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm"
                  value={motto}
                  onChange={e => setMotto(e.target.value)}
                  placeholder="Your school motto"
                />
              </div>
              <div className="flex items-center gap-4">
                <Button
                  className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! w-fit rounded-md border text-sm font-medium"
                  onClick={() => setEdit(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-7!"
                  onClick={() => handleSaveSchool({ motto })}
                  disabled={isSavingSchool}
                >
                  {isSavingSchool && <Spinner className="text-text-white-default size-3" />} Save
                </Button>
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
              <div className="text-text-muted text-sm">{phoneNumber || "—"}</div>
            </div>
            <Button
              onClick={() => setEdit("editPhoneNum")}
              className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! rounded-md border text-sm font-medium shadow"
            >
              <Edit fill="var(--color-icon-default-muted)" /> Edit
            </Button>
          </div>
          {edit === "editPhoneNum" && (
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">Phone Number</Label>
                <Input
                  className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 09040000000"
                />
              </div>
              <div className="flex items-center gap-4">
                <Button
                  className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! w-fit rounded-md border text-sm font-medium"
                  onClick={() => setEdit(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-7!"
                  onClick={() => handleSaveSchool({ phoneNumber: Number(phoneNumber) })}
                  disabled={isSavingSchool}
                >
                  {isSavingSchool && <Spinner className="text-text-white-default size-3" />} Save
                </Button>
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
            <div className="text-text-muted text-sm">{school?.email || "—"}</div>
          </div>
        </div>

        <div className="border-border-default flex items-center justify-between border-b py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Flag fill="var(--color-icon-default-muted)" />
              <div className="text-text-default text-sm font-medium">Country</div>
            </div>
            <div className="text-text-muted text-sm">{selectedCountry?.name || "—"}</div>
          </div>
          <Select
            value={countryId}
            onValueChange={val => {
              setCountryId(val);
              handleSaveSchool({ country: val });
            }}
          >
            <SelectTrigger className="border-border-darker h-8! w-auto border">
              <SelectValue>
                <span className="text-text-default text-sm font-medium">{selectedCountry?.name ?? "Select country"}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default">
              {countries.map(c => (
                <SelectItem key={c.id} value={c.id} className="text-text-default text-sm font-medium">
                  {c.name}
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
          <Select
            value={currency}
            onValueChange={val => {
              setCurrency(val);
              handleSaveSchool({ currency: val });
            }}
          >
            <SelectTrigger className="border-border-darker h-8! w-auto border">
              <SelectValue>
                <span className="text-text-default text-sm font-medium">{currency || "Select"}</span>
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
          <Select
            value={timezone}
            onValueChange={val => {
              setTimezone(val);
              handleSaveSchool({ timezone: val });
            }}
          >
            <SelectTrigger className="border-border-darker h-8! w-auto border">
              <SelectValue>
                <span className="text-text-default text-sm font-medium">{timezone || "Select"}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default">
              {Timezones.map(tz => (
                <SelectItem key={tz} value={tz} className="text-text-default text-sm font-medium">
                  {tz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-text-default border-border-default flex h-20 items-center border-b py-4 text-lg font-semibold">Branch Information</div>

        {isLoadingBranch ? (
          <Skeleton className="bg-bg-input-soft h-50 w-full" />
        ) : (
          <>
            {" "}
            {branches.map((branch: { id: number; name: string; address: string | null }, index: number) => (
              <div key={branch.id} className="border-border-default border-b py-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-4">
                    <Badge className="border-border-default bg-bg-badge-default! text-text-subtle w-20! rounded-md border p-1 text-xs">
                      Branch {index + 1}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <School fill="var(--color-icon-default-muted)" />
                      <div className="text-text-muted text-sm">{branch.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Map fill="var(--color-icon-default-muted)" />
                      <div className="text-text-muted text-sm">{branch.address || "—"}</div>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setActiveBranchId(branch.id);
                      setBranchName(branch.name);
                      setBranchAddress(branch.address ?? "");
                      setEdit("editBranch");
                    }}
                    className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! rounded-md border text-sm font-medium shadow"
                  >
                    <Edit fill="var(--color-icon-default-muted)" /> Edit
                  </Button>
                </div>

                {edit === "editBranch" && activeBranchId === branch.id && (
                  <div className="flex flex-col gap-4 py-4">
                    <div className="flex items-center justify-between gap-2">
                      <Badge className="border-border-default bg-bg-badge-default! text-text-subtle w-20! rounded-md border p-1 text-xs">
                        Branch {index + 1}
                      </Badge>
                      <Button
                        onClick={resetBranchForm}
                        className="bg-bg-state-ghost! hover:bg-bg-state-ghost-hover! text-text-default flex items-center gap-1 border-none text-xs font-medium"
                      >
                        <DeleteBin fill="var(--color-icon-default-muted)" /> Delete Branch
                      </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-text-default flex items-center gap-2 text-sm font-medium">
                        <School fill="var(--color-icon-default-muted)" /> Branch Name
                      </Label>
                      <Input
                        className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm"
                        value={branchName}
                        onChange={e => setBranchName(e.target.value)}
                        placeholder="Branch name"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-text-default flex items-center gap-2 text-sm font-medium">
                        <Map fill="var(--color-icon-default-muted)" /> Branch Address
                      </Label>
                      <Input
                        className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm"
                        value={branchAddress}
                        onChange={e => setBranchAddress(e.target.value)}
                        placeholder="Branch address"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! w-fit rounded-md border text-sm font-medium"
                        onClick={resetBranchForm}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-7!"
                        onClick={handleSaveBranch}
                        disabled={isSavingBranch}
                      >
                        {isSavingBranch ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {edit === "newBranch" && (
          <div className="border-border-default flex flex-col gap-4 border-b py-4">
            <div className="flex flex-col gap-2">
              <Label className="text-text-default flex items-center gap-2 text-sm font-medium">
                <School fill="var(--color-icon-default-muted)" /> Branch Name
              </Label>
              <Input
                className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm"
                value={branchName}
                onChange={e => setBranchName(e.target.value)}
                placeholder="Branch name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-text-default flex items-center gap-2 text-sm font-medium">
                <Map fill="var(--color-icon-default-muted)" /> Branch Address
              </Label>
              <Input
                className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm"
                value={branchAddress}
                onChange={e => setBranchAddress(e.target.value)}
                placeholder="Branch address"
              />
            </div>
            <div className="flex items-center gap-4">
              <Button
                className="text-text-default border-border-darker bg-bg-state-secondary! hover:bg-bg-state-secondary-hover! h-7! w-fit rounded-md border text-sm font-medium"
                onClick={resetBranchForm}
              >
                Cancel
              </Button>
              <Button
                className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-7!"
                onClick={handleSaveBranch}
                disabled={isSavingBranch}
              >
                {isSavingBranch ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        )}

        <Button
          className="bg-bg-state-soft text-text-default mt-4 self-start"
          onClick={() => {
            setActiveBranchId(null);
            setBranchName("");
            setBranchAddress("");
            setEdit("newBranch");
          }}
        >
          <PlusIcon className="text-icon-default-muted size-4" /> Add Branch
        </Button>
      </div>
    </div>
  );
};
