"use client";
import { getCountries, getStatesForCountry } from "@/app/actions/country";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useAddParent, useEditParent, useGetParent } from "@/hooks/queryHooks/useParent";
import { cn } from "@/lib/utils";
import { parentSchema } from "@/schema/parent";
import { Gender, genders, Relationship, relationships } from "@/types";
import { Branch } from "@/api/types";
import { useFormik } from "formik";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ProfilePicture } from "@/components/StudentAndParent/ProfilePicture";
import { Country, ParentInputValues, State } from "@/components/StudentAndParent/types";
import { toast } from "@/components/Toast";

export const YourDetails = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [activeCountryCode, setActiveCountryCode] = useState<string>("");
  const [avatar, setAvatar] = useState<string | undefined>();
  const { data: branches, isPending: loadingBranches } = useGetBranches();
  const { mutate: createParent, isPending: creating } = useAddParent();
  const { data: parentData, isLoading: loadingParent } = useGetParent();
  const { mutate: editParent, isPending: updating } = useEditParent();

  useEffect(() => {
    getCountries().then(setCountries);
  }, []);

  const fetchStates = useCallback(async () => {
    const stateList = await getStatesForCountry(activeCountryCode);
    setStates(stateList);
  }, [activeCountryCode]);

  useEffect(() => {
    if (activeCountryCode) {
      setStates([]);
      fetchStates();
    }
  }, [activeCountryCode, fetchStates]);

  const formik = useFormik<ParentInputValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      gender: Gender.Male,
      address: "",
      phoneNumber: "",
      secondaryPhoneNumber: "",
      nationality: "",
      stateOfOrigin: "",
      relationship: Relationship.Father,
      branchId: null,
    },
    validationSchema: parentSchema,
    onSubmit: values => {
      const parentId = parentData?.data?.id;

      const payload = {
        ...values,
        image: avatar,
        linkedStudents: [],
        tags: [],
      };

      if (!parentId) {
        createParent(payload, {
          onSuccess: data => {
            toast({
              title: `Successfully added ${data.data.firstName} ${data.data.lastName}`,
              description: data.message,
              type: "success",
            });

            router.push(`${pathname}?step=student`);
          },
          onError: error => {
            toast({
              title: error.message ?? "Something went wrong",
              description: "Could not add parent",
              type: "error",
            });
          },
        });
      } else {
        editParent(
          { id: parentId, ...payload },
          {
            onSuccess: () => {
              toast({
                title: "Updated successfully",
                description: "Parent details updated",
                type: "success",
              });

              router.push(`${pathname}?step=student`);
            },
            onError: error => {
              toast({
                title: error.message ?? "Something went wrong",
                description: "Could not update parent",
                type: "error",
              });
            },
          },
        );
      }
    },
  });

  useEffect(() => {
    if (parentData) {
      formik.setValues({
        firstName: parentData.firstName || "",
        lastName: parentData.lastName || "",
        middleName: parentData.middleName || "",
        email: parentData.email || "",
        gender: parentData.gender || Gender.Male,
        address: parentData.address || "",
        phoneNumber: parentData.phoneNumber || "",
        secondaryPhoneNumber: parentData.secondaryPhoneNumber || "",
        nationality: parentData.nationality || "",
        stateOfOrigin: parentData.stateOfOrigin || "",
        relationship: parentData.relationship || Relationship.Father,
        branchId: parentData.branchId || null,
      });
    }
  }, [parentData]);

  const { values, errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched, handleSubmit } = formik;

  const handleCountryChange = (countryName: string) => {
    const selected = countries.find(c => c.name === countryName);
    setActiveCountryCode(selected?.iso2 || "");
    setFieldValue("nationality", countryName);
    setFieldValue("stateOfOrigin", "");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="border-border-default flex flex-col rounded-md border">
        <div className="border-border-default flex flex-col gap-1 border-b p-3 md:px-6 md:py-4">
          <div className="text-text-default text-md font-semibold">Your Personal Details</div>
          <div className="text-text-muted text-xs font-normal">Tell us about yourself</div>
        </div>

        <div className="flex flex-col p-3 md:px-6 md:py-4">
          <ProfilePicture setAvatar={setAvatar} />

          <div className="flex flex-col gap-8 pt-8">
            <h2 className="text-text-default text-lg font-semibold">Personal Information</h2>

            <div className="border-border-default grid gap-6 border-b pb-8 sm:grid-cols-2 sm:gap-5">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-text-default text-sm font-medium">
                  First Name <small className="text-text-destructive text-xs">*</small>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  autoFocus
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Input First Name"
                  className={cn(
                    "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
                    touched.firstName && errors.firstName && "border-border-destructive border",
                  )}
                />
                {touched.firstName && errors.firstName && <p className="text-text-destructive text-xs font-light">{errors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-text-default text-sm font-medium">
                  Last Name <small className="text-text-destructive text-xs">*</small>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Input Last Name"
                  className={cn(
                    "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
                    touched.lastName && errors.lastName && "border-border-destructive border",
                  )}
                />
                {touched.lastName && errors.lastName && <p className="text-text-destructive text-xs font-light">{errors.lastName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="middleName" className="text-text-default text-sm font-medium">
                  Middle Name
                </Label>
                <Input
                  id="middleName"
                  name="middleName"
                  value={values.middleName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Input Middle Name"
                  className="text-text-muted bg-bg-input-soft! border-none text-sm font-normal"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-text-default text-sm font-medium">
                  Gender <small className="text-text-destructive text-xs">*</small>
                </Label>
                <Select value={values.gender} onValueChange={v => setFieldValue("gender", v)}>
                  <SelectTrigger
                    className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal"
                    onBlur={() => setFieldTouched("gender", true)}
                  >
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-bg-card border-none">
                    {genders.map(g => (
                      <SelectItem key={g.value} value={g.value} className="text-text-default">
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {touched.gender && errors.gender && <p className="text-text-destructive text-xs font-light">{errors.gender}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-text-default text-sm font-medium">
                  Relationship <small className="text-text-destructive text-xs">*</small>
                </Label>
                <Select value={values.relationship} onValueChange={v => setFieldValue("relationship", v)}>
                  <SelectTrigger
                    className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal"
                    onBlur={() => setFieldTouched("relationship", true)}
                  >
                    <SelectValue placeholder="Select Relationship with Student" />
                  </SelectTrigger>
                  <SelectContent className="bg-bg-card border-none">
                    {relationships.map(r => (
                      <SelectItem key={r.value} value={r.value} className="text-text-default">
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {touched.relationship && errors.relationship && <p className="text-text-destructive text-xs font-light">{errors.relationship}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-text-default text-sm font-medium">
                  Branch <small className="text-text-destructive text-xs">*</small>
                </Label>
                {!branches || loadingBranches ? (
                  <Skeleton className="bg-bg-input-soft h-9 w-full" />
                ) : (
                  <Select
                    value={branches.data.content?.find((b: Branch) => b.id === values.branchId)?.uuid || ""}
                    onValueChange={value => {
                      const branch = branches.data.content?.find((b: Branch) => b.uuid === value);
                      setFieldValue("branchId", branch.id);
                    }}
                  >
                    <SelectTrigger
                      className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal"
                      onBlur={() => setFieldTouched("branchId", true)}
                    >
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent className="bg-bg-card border-none">
                      {branches.data.content.map((branch: Branch) => (
                        <SelectItem key={branch.id} value={branch.uuid} className="text-text-default">
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {touched.branchId && errors.branchId && <p className="text-text-destructive text-xs font-light">{errors.branchId}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-text-default text-sm font-medium">
                  Nationality <small className="text-text-destructive text-xs">*</small>
                </Label>
                {countries.length > 0 ? (
                  <Select value={values.nationality} onValueChange={handleCountryChange}>
                    <SelectTrigger
                      className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal"
                      onBlur={() => setFieldTouched("nationality", true)}
                    >
                      <SelectValue placeholder="Select Nationality" />
                    </SelectTrigger>
                    <SelectContent className="bg-bg-card border-none">
                      {countries.map(country => (
                        <SelectItem key={country.id} value={country.name} className="text-text-default">
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Skeleton className="bg-bg-input-soft h-9 w-full" />
                )}
                {touched.nationality && errors.nationality && <p className="text-text-destructive text-xs font-light">{errors.nationality}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-text-default text-sm font-medium">
                  State of Origin <small className="text-text-destructive text-xs">*</small>
                </Label>
                <Select disabled={!activeCountryCode} value={values.stateOfOrigin} onValueChange={v => setFieldValue("stateOfOrigin", v)}>
                  <SelectTrigger
                    className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal"
                    onBlur={() => setFieldTouched("stateOfOrigin", true)}
                  >
                    <SelectValue placeholder={!activeCountryCode ? "Select a country first" : "Select State of Origin"} />
                  </SelectTrigger>
                  <SelectContent className="bg-bg-card border-none">
                    {states.length === 0 ? (
                      <div className="flex items-center justify-center p-2">
                        <Spinner />
                      </div>
                    ) : (
                      states.map(state => (
                        <SelectItem key={state.id} value={state.name} className="text-text-default">
                          {state.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {touched.stateOfOrigin && errors.stateOfOrigin && <p className="text-text-destructive text-xs font-light">{errors.stateOfOrigin}</p>}
              </div>
            </div>

            <h2 className="text-text-default text-lg font-semibold">Contact Information</h2>

            <div className="flex flex-col gap-6 pb-8">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-text-default text-sm font-medium">
                  Email Address <small className="text-text-destructive text-xs">*</small>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Input Email Address"
                  className={cn(
                    "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
                    touched.email && errors.email && "border-border-destructive border",
                  )}
                />
                {touched.email && errors.email && <p className="text-text-destructive text-xs font-light">{errors.email}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-text-default text-sm font-medium">
                    Primary Phone Number <small className="text-text-destructive text-xs">*</small>
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={values.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="000-000-0000"
                    className={cn(
                      "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
                      touched.phoneNumber && errors.phoneNumber && "border-border-destructive border",
                    )}
                  />
                  {touched.phoneNumber && errors.phoneNumber && <p className="text-text-destructive text-xs font-light">{errors.phoneNumber}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryPhoneNumber" className="text-text-default text-sm font-medium">
                    WhatsApp Number <small className="text-text-destructive text-xs">*</small>
                  </Label>
                  <Input
                    id="secondaryPhoneNumber"
                    name="secondaryPhoneNumber"
                    value={values.secondaryPhoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="000-000-0000"
                    className={cn(
                      "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
                      touched.secondaryPhoneNumber && errors.secondaryPhoneNumber && "border-border-destructive border",
                    )}
                  />
                  {touched.secondaryPhoneNumber && errors.secondaryPhoneNumber && (
                    <p className="text-text-destructive text-xs font-light">{errors.secondaryPhoneNumber}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-text-default text-sm font-medium">
                  Home Address <small className="text-text-destructive text-xs">*</small>
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Input Home Address"
                  className={cn(
                    "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
                    touched.address && errors.address && "border-border-destructive border",
                  )}
                />
                {touched.address && errors.address && <p className="text-text-destructive text-xs font-light">{errors.address}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="border-border-default border-t">
          <div className="flex justify-end p-4">
            <Button
              type="submit"
              disabled={creating || updating || loadingParent}
              className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary-hover!"
            >
              {creating || (updating && <Spinner className="text-text-white-default mr-2" />)}
              {creating || updating ? "Saving..." : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
