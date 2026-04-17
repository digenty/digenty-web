import { Branch, BranchWithClassLevels, Parent } from "@/api/types";
import { getCountries } from "@/app/actions/country";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { cn } from "@/lib/utils";
import { genders, relationships } from "@/types";
import { FormikProps } from "formik";
import { useEffect, useState } from "react";
import { Country, ParentInputValues } from "../../types";
import { SearchableSelect } from "../../SearchableSelect";

export const PersonalInformation = ({ formik, data }: { formik: FormikProps<ParentInputValues>; data: { data: Parent } | undefined }) => {
  const { handleBlur, handleChange, errors, touched, values, setFieldValue } = formik;
  const [countries, setCountries] = useState<Country[]>([]);
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [branch, setBranch] = useState<string>();

  const { data: branches, isPending: loadingBranches } = useGetBranches();

  useEffect(() => {
    const fetchData = async () => {
      const countryList = await getCountries();
      setCountries(countryList);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (countries.length > 0 && values.nationality) {
      const selectedCountry = countries.find(c => c.name === values.nationality);
      if (selectedCountry) {
        setAvailableStates(selectedCountry.states || []);
      } else {
        setAvailableStates([]);
      }
    } else {
      setAvailableStates([]);
    }
  }, [countries, values.nationality]);

  useEffect(() => {
    if (data && branches) {
      const brnch = branches.data?.find((brnch: BranchWithClassLevels) => brnch?.branch?.name === data.data.branch);
      formik.setFieldValue("branchId", brnch?.branch?.id);
      setBranch(brnch?.branch?.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, branches]);

  return (
    <div className="border-border-default space-y-6 border-b py-6">
      <h2 className="text-lg font-semibold">Personal Information</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-text-default text-sm font-medium">
            First Name <small className="text-text-destructive text-xs">*</small>
          </Label>
          <Input
            id="firstName"
            onChange={handleChange}
            autoFocus
            placeholder="Input First Name"
            onBlur={handleBlur}
            value={values.firstName}
            type="text"
            className={cn(
              "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
              errors.firstName && touched.firstName && "border-border-destructive border",
            )}
          />
          {touched.firstName && errors.firstName && <p className="text-text-destructive text-xs font-light">{errors.firstName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-text-default text-sm font-medium">
            Last Name<small className="text-text-destructive text-xs">*</small>
          </Label>
          <Input
            id="lastName"
            onChange={handleChange}
            placeholder="Input Last Name"
            onBlur={handleBlur}
            value={values.lastName}
            type="text"
            className={cn(
              "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
              errors.lastName && touched.lastName && "border-border-destructive border",
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
            onChange={handleChange}
            placeholder="Input Middle Name"
            onBlur={handleBlur}
            value={values.middleName}
            type="text"
            className={cn(
              "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
              errors.middleName && touched.middleName && "border-text-error/50 border",
            )}
          />
          {touched.middleName && errors.middleName && <p className="text-text-destructive text-xs font-light">{errors.middleName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender" className="text-text-default text-sm font-medium">
            Gender<small className="text-text-destructive text-xs">*</small>
          </Label>
          <Select
            value={formik.values.gender}
            onValueChange={gender => {
              if (gender) {
                formik.setFieldValue("gender", gender);
              }
            }}
          >
            <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-none">
              {genders.map(gender => (
                <SelectItem key={gender.value} className="text-text-default" value={gender.value}>
                  {gender.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender" className="text-text-default text-sm font-medium">
            Relationship<small className="text-text-destructive text-xs">*</small>
          </Label>
          <Select
            value={formik.values.relationship}
            onValueChange={rel => {
              if (rel) {
                formik.setFieldValue("relationship", rel);
              }
            }}
          >
            <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
              <SelectValue placeholder="Select Relationship with Student" />
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-none">
              {relationships.map(rel => (
                <SelectItem key={rel.value} className="text-text-default" value={rel.value}>
                  {rel.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="branch" className="text-text-default text-sm font-medium">
            Branch <small className="text-text-destructive text-xs">*</small>
          </Label>
          {!branches || loadingBranches ? (
            <Skeleton className="bg-bg-input-soft h-9 w-full" />
          ) : (
            <Select
              value={branch}
              onValueChange={value => {
                const branch = branches.data?.find((branch: BranchWithClassLevels) => branch?.branch?.name === value);
                if (branch) {
                  formik.setFieldValue("branchId", branch?.branch?.id);
                }
              }}
            >
              <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-none">
                {branches.data?.map((branch: BranchWithClassLevels) => (
                  <SelectItem key={branch?.branch?.id} className="text-text-default" value={branch?.branch?.name ?? ""}>
                    {branch?.branch?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality" className="text-text-default text-sm font-medium">
            Nationality <small className="text-text-destructive text-xs">*</small>
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
                setFieldValue("nationality", country);
                setFieldValue("stateOfOrigin", "");
              }}
              placeholder="Select Nationality"
              searchPlaceholder="Search country..."
            />
          ) : (
            <Skeleton className="bg-bg-input-soft h-9 w-full" />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stateOfOrigin" className="text-text-default text-sm font-medium">
            State of Origin <small className="text-text-destructive text-xs">*</small>
          </Label>
          <Select
            value={formik.values.stateOfOrigin}
            disabled={!values.nationality}
            onValueChange={value => {
              setFieldValue("stateOfOrigin", value);
            }}
          >
            <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
              <SelectValue placeholder="Select State of Origin" />
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
        </div>
      </div>
    </div>
  );
};
