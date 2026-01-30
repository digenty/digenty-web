"use client";
import { getCountries, getStatesForCountry } from "@/app/actions/country";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { FormikProps } from "formik";
import { useCallback, useEffect, useState } from "react";
import { Country, ParentInputValues, State } from "../../types";
import { genders, relationships } from "@/types";

export const PersonalInformation = ({ formik }: { formik: FormikProps<ParentInputValues> }) => {
  const { handleBlur, handleChange, errors, touched, values } = formik;
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [activeCountryCode, setActiveCountryCode] = useState<string>("");

  const getCountryCode = async () => {
    const countryList = await getCountries();
    setCountries(countryList);
  };

  const getStates = useCallback(async () => {
    const stateList = await getStatesForCountry(activeCountryCode);
    setStates(stateList);
  }, [activeCountryCode]);

  useEffect(() => {
    getCountryCode();
  }, []);

  useEffect(() => {
    if (activeCountryCode) {
      getStates();
    }
  }, [activeCountryCode, getStates]);

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
            onValueChange={gender => {
              formik.setFieldValue("gender", gender);
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
            onValueChange={rel => {
              formik.setFieldValue("relationship", rel);
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
          <Select
            onValueChange={value => {
              formik.setFieldValue("branchId", value);
            }}
          >
            <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-none">
              {["Male", "Female"].map((gender, index) => (
                <SelectItem key={gender} className="text-text-default" value={`${index}`}>
                  {gender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality" className="text-text-default text-sm font-medium">
            Nationality <small className="text-text-destructive text-xs">*</small>
          </Label>
          {countries && countries.length > 0 ? (
            <Select
              onValueChange={country => {
                const countryCode = countries?.find(ctry => ctry.name === country);
                setActiveCountryCode(countryCode?.iso2 || "");
                formik.setFieldValue("nationality", country);
              }}
            >
              <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                <SelectValue placeholder="Select Nationality" />
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-none">
                {countries.map(country => (
                  <SelectItem key={country.id} className="text-text-default" value={country.name}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Skeleton className="bg-bg-input-soft h-9 w-full" />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stateOfOrigin" className="text-text-default text-sm font-medium">
            State of Origin <small className="text-text-destructive text-xs">*</small>
          </Label>
          <Select
            disabled={!activeCountryCode}
            onValueChange={value => {
              const state = states?.find(stat => stat.name === value);
              formik.setFieldValue("stateOfOrigin", state?.name);
            }}
          >
            <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
              <SelectValue placeholder="Select State of Origin" />
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-none">
              {states && states.length === 0 ? (
                <div className="flex items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                states.map(state => (
                  <SelectItem key={state.id} className="text-text-default" value={state.name}>
                    {state.name}
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
