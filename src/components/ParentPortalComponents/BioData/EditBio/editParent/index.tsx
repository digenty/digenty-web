import { Parent } from "@/api/types";
import { BranchLookup } from "@/api/parent-lookup";
import { getCountries } from "@/app/actions/country";
import { Avatar } from "@/components/Avatar";
import { Country, ParentInputValues } from "@/components/StudentAndParent/types";
import { SearchableSelect } from "@/components/StudentAndParent/SearchableSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useGetParentPortalBranches } from "@/hooks/queryHooks/useParentLookup";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { cn } from "@/lib/utils";
import { genders } from "@/types";
import { FormikProps } from "formik";
import { useEffect, useState } from "react";

export const EditParentBiodata = ({
  onCancel,
  formik,
  data,
  loadingParent,
  isPending,
}: {
  data: Parent | undefined;
  loadingParent: boolean;
  isPending: boolean;
  onCancel: () => void;
  formik: FormikProps<ParentInputValues>;
}) => {
  const { handleBlur, handleChange, errors, touched, values } = formik;
  const [countries, setCountries] = useState<Country[]>([]);
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [branch, setBranch] = useState<string>();

  const [flagEmoji, setFlagEmoji] = useState<string>("");
  const { schoolId } = useLoggedInUser();
  const { data: branches, isPending: loadingBranches } = useGetParentPortalBranches(schoolId);

  useEffect(() => {
    getCountries().then(setCountries);
  }, []);

  useEffect(() => {
    if (values.nationality && countries.length > 0) {
      const country = countries.find(ctry => ctry.name === values.nationality);
      setAvailableStates(country?.states || []);
      setFlagEmoji(country?.flag || "");
    } else {
      setAvailableStates([]);
      setFlagEmoji("");
    }
  }, [countries, values.nationality]);

  useEffect(() => {
    if (data && branches) {
      const brnch = branches.find((brnch: BranchLookup) => brnch.name === data.branch);
      formik.setFieldValue("branchId", brnch?.id);
      setBranch(brnch?.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, branches]);

  return (
    <form onSubmit={formik.handleSubmit} className="bg-bg-muted w-full rounded-xl p-4">
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
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-8! w-full rounded-md border-none">
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
                  <Input
                    onBlur={handleBlur}
                    value={values.firstName}
                    onChange={handleChange}
                    placeholder="Input First Name"
                    className={cn(
                      "text-text-default h-8 border-none bg-transparent p-0 text-sm",
                      errors.firstName && touched.firstName && "border-border-destructive border",
                    )}
                  />

                  {touched.firstName && errors.firstName && <p className="text-text-destructive text-xs font-light">{errors.firstName}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">
                    Last Name <span className="text-text-destructive">*</span>{" "}
                  </Label>
                  <Input
                    onBlur={handleBlur}
                    value={values.lastName}
                    onChange={handleChange}
                    placeholder="Input Last Name"
                    className={cn(
                      "text-text-default h-8! border-none bg-transparent p-0 text-sm",
                      errors.lastName && touched.lastName && "border-border-destructive border",
                    )}
                  />

                  {touched.lastName && errors.lastName && <p className="text-text-destructive text-xs font-light">{errors.lastName}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">
                    Middle Name <span className="text-text-destructive">*</span>{" "}
                  </Label>
                  <Input
                    onBlur={handleBlur}
                    value={values.middleName}
                    onChange={handleChange}
                    placeholder="Input Middle Name"
                    className={cn(
                      "text-text-default h-8 border-none bg-transparent p-0 text-sm",
                      errors.middleName && touched.middleName && "border-border-destructive border",
                    )}
                  />{" "}
                  {touched.middleName && errors.middleName && <p className="text-text-destructive text-xs font-light">{errors.middleName}</p>}
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
                  {!branches?.length || loadingBranches ? (
                    <Skeleton className="bg-bg-input-soft h-8 w-full" />
                  ) : (
                    <Select
                      value={branch}
                      onValueChange={value => {
                        const branch = branches?.find((branch: BranchLookup) => branch.name === value);
                        if (branch) {
                          formik.setFieldValue("branchId", branch.id);
                        }
                      }}
                    >
                      <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                        <SelectValue placeholder="Branch" />
                      </SelectTrigger>
                      <SelectContent className="bg-bg-card border-none">
                        {branches.map((branch: BranchLookup) => (
                          <SelectItem key={branch.id} className="text-text-default" value={branch.name ?? ""}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {touched.branchId && errors.branchId && <p className="text-text-destructive text-xs font-light">{errors.branchId}</p>}
                </div>

                <div className="gap2 flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">
                    Nationality <span className="text-text-destructive">*</span>{" "}
                  </Label>
                  {countries && countries.length > 0 ? (
                    <SearchableSelect
                      options={countries.map(country => ({
                        label: country.name,
                        value: country.name,
                        flag: country.flag,
                      }))}
                      value={formik.values.nationality}
                      onValueChange={country => {
                        formik.setFieldValue("nationality", country);
                        formik.setFieldValue("stateOfOrigin", "");
                      }}
                      placeholder="Select Nationality"
                      searchPlaceholder="Search country..."
                    />
                  ) : (
                    <Skeleton className="bg-bg-input-soft h-9 w-full" />
                  )}

                  {touched.nationality && errors.nationality && <p className="text-text-destructive text-xs font-light">{errors.nationality}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">
                    State of Origin <span className="text-text-destructive">*</span>{" "}
                  </Label>
                  <Select
                    value={formik.values.stateOfOrigin}
                    disabled={!values.nationality}
                    onValueChange={value => formik.setFieldValue("stateOfOrigin", value)}
                  >
                    <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                      <SelectValue placeholder={!values.nationality ? "Select a country first" : "Select State of Origin"} />
                    </SelectTrigger>
                    <SelectContent className="bg-bg-card border-none">
                      {availableStates.length === 0 && values.nationality ? (
                        <div className="flex items-center justify-center p-2">
                          <span className="text-text-muted text-xs">No states available</span>
                        </div>
                      ) : (
                        availableStates.map(stateName => (
                          <SelectItem key={stateName} className="text-text-default" value={stateName}>
                            {stateName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>

                  {touched.stateOfOrigin && errors.stateOfOrigin && (
                    <p className="text-text-destructive text-xs font-light">{errors.stateOfOrigin}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:gap-6">
              <p className="text-text-default text-lg font-semibold">Contact Information</p>

              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">
                  Email Address<span className="text-text-destructive">*</span>{" "}
                </Label>
                <Input
                  onBlur={handleBlur}
                  value={values.address}
                  onChange={handleChange}
                  placeholder="Input Email Address"
                  className={cn(
                    "text-text-default border-none bg-transparent p-0 text-sm",
                    errors.address && touched.address && "border-border-destructive border",
                  )}
                />

                {touched.address && errors.address && <p className="text-text-destructive text-xs font-light">{errors.address}</p>}
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label className="text-text-default w-full text-sm font-medium">
                    Primary Phone Number <span className="text-text-destructive">*</span>
                  </Label>
                  <div className="bg-bg-input-soft! flex h-8 w-full items-center rounded-md border-none px-3 text-sm">
                    <span className="size-4">{flagEmoji || ""}</span>

                    <Input
                      id="phoneNumber"
                      onChange={handleChange}
                      placeholder="Input Primary Phone Number"
                      onBlur={handleBlur}
                      value={values.phoneNumber}
                      type="text"
                      className={cn(
                        "text-text-default border-none bg-transparent p-0 text-sm",
                        errors.phoneNumber && touched.phoneNumber && "border-border-destructive border",
                      )}
                    />
                  </div>

                  {touched.phoneNumber && errors.phoneNumber && <p className="text-text-destructive text-xs font-light">{errors.phoneNumber}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="secondaryPhoneNumber" className="text-text-default w-full text-sm font-medium">
                    Whatsapp Number <span className="text-text-destructive">*</span>
                  </Label>
                  <div className="bg-bg-input-soft! flex h-8 w-full items-center rounded-md border-none px-3 text-sm">
                    <span className="size-4">{flagEmoji || ""}</span>

                    <Input
                      id="secondaryPhoneNumber"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.secondaryPhoneNumber}
                      type="text"
                      className={cn(
                        "text-text-default border-none bg-transparent p-0 text-sm",
                        errors.secondaryPhoneNumber && touched.secondaryPhoneNumber && "border-border-destructive border",
                      )}
                    />
                  </div>
                  {touched.secondaryPhoneNumber && errors.secondaryPhoneNumber && (
                    <p className="text-text-destructive text-xs font-light">{errors.secondaryPhoneNumber}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="address" className="text-text-default w-full text-sm font-medium">
                  Home Address<span className="text-text-destructive">*</span>
                </Label>

                <Input
                  id="address"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.address}
                  placeholder="Input Home Address"
                  className={cn(
                    "bg-bg-input-soft! h-8 w-full rounded-md border-none text-sm",
                    errors.address && touched.address && "border-border-destructive border",
                  )}
                />
                {touched.address && errors.address && <p className="text-text-destructive text-xs font-light">{errors.address}</p>}
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
            <Button
              disabled={isPending || loadingParent}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default text-sm"
            >
              {isPending && <Spinner className="text-text-white-defaut" />} Save Changes
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
