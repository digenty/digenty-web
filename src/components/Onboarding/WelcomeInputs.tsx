"use client";
import { getCountries } from "@/app/actions/country";
import { FormikProps } from "formik";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

import { currencies } from "@/store/currenciesCode";
import { SearchableSelect } from "../StudentAndParent/SearchableSelect";
import { Country } from "../StudentAndParent/types";
import { Skeleton } from "../ui/skeleton";
import { schoolSizes } from "./constants";
import { CreateSchoolTypes } from "./types";

export const WelcomeInputs = ({ formik }: { formik: FormikProps<CreateSchoolTypes> }) => {
  const { handleBlur, handleChange, errors, touched, values, setFieldValue } = formik;
  const [countries, setCountries] = useState<Country[]>([]);
  const [currency, setCurrency] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      const countryList = await getCountries();
      setCountries(countryList);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (countries.length > 0 && values.country) {
      const selectedCountry = countries.find(country => country.name === values.country);
      if (selectedCountry) {
        setCurrency(selectedCountry.currencyCode);
        setFieldValue("currency", selectedCountry.currencyCode);
      }
    }
  }, [countries, values.country]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="text-text-default text-lg font-semibold">Welcome to Axis</div>
        <div className="text-text-muted text-sm">Let&apos;s get your school set up in a few simple steps</div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstName" className="text-text-default text-sm font-semibold">
            First Name<small className="text-text-destructive text-xs">*</small>
          </Label>
          <Input
            id="firstName"
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            className="bg-bg-input-soft! text-text-default w-full border-none text-sm"
            placeholder="e.g Damilare"
          />
          {touched.firstName && errors.firstName && <p className="text-text-destructive text-xs font-light">{errors.firstName}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="lastName" className="text-text-default text-sm font-semibold">
            Last Name<small className="text-text-destructive text-xs">*</small>
          </Label>
          <Input
            id="lastName"
            name="lastName"
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            className="bg-bg-input-soft! text-text-default w-full border-none text-sm"
            placeholder="e.g John"
          />
          {touched.lastName && errors.lastName && <p className="text-text-destructive text-xs font-light">{errors.lastName}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="schoolName" className="text-text-default text-sm font-semibold">
            School Name<small className="text-text-destructive text-xs">*</small>
          </Label>
          <Input
            id="schoolName"
            name="schoolName"
            value={values.schoolName}
            onChange={handleChange}
            onBlur={handleBlur}
            className="bg-bg-input-soft! text-text-default w-full border-none text-sm"
            placeholder="e.g Axis' Schools"
          />
          {touched.schoolName && errors.schoolName && <p className="text-text-destructive text-xs font-light">{errors.schoolName}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="schoolSize" className="text-text-default text-sm font-semibold">
            Student Population<small className="text-text-destructive text-xs">*</small>
          </Label>
          <Select
            value={values.schoolSize}
            onValueChange={value => {
              formik.setFieldValue("schoolSize", value);
            }}
          >
            <SelectTrigger className="bg-bg-input-soft! text-text-default w-full border-none">
              <SelectValue placeholder="Student Population" />
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default border">
              {schoolSizes.map(size => (
                <SelectItem key={size.value} value={size.value} className="text-text-default">
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {touched.schoolSize && errors.schoolSize && <p className="text-text-destructive text-xs font-light">{errors.schoolSize}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="role" className="text-text-default text-sm font-semibold">
          Role<small className="text-text-destructive text-xs">*</small>
        </Label>
        <Input
          id="role"
          name="role"
          value={values.role}
          onChange={handleChange}
          onBlur={handleBlur}
          className="bg-bg-input-soft! text-text-default w-full border-none text-sm"
          placeholder="e.g Principal"
        />
        {touched.role && errors.role && <p className="text-text-destructive text-xs font-light">{errors.role}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="country" className="text-text-default text-sm font-medium">
            School Country<small className="text-text-destructive text-xs">*</small>
          </Label>

          {countries.length > 0 ? (
            <SearchableSelect
              options={countries.map(country => ({
                label: country.name,
                value: country.name,
                flag: country.flag,
              }))}
              value={values.country}
              // onValueChange={value => {
              //   const selectedCountry = countries.find(country => country.countryCode === value);
              //   setFieldValue("country", value);
              //   setActiveCountry(selectedCountry);
              // }}
              onValueChange={country => {
                setFieldValue("country", country);
                // setFieldValue("stateOfOrigin", ""); // Reset state if country changes
              }}
              placeholder="Select Country"
              searchPlaceholder="Search country..."
              modal={true}
            />
          ) : (
            <Skeleton className="bg-bg-input-soft h-9 w-full" />
          )}

          {touched.country && errors.country && <p className="text-text-destructive text-xs font-light">{errors.country}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="currency" className="text-text-default text-sm font-semibold">
            School Currency<small className="text-text-destructive text-xs">*</small>
          </Label>
          <Select
            value={currency}
            onValueChange={value => {
              formik.setFieldValue("currency", value);
            }}
          >
            <SelectTrigger disabled className="bg-bg-input-soft! text-text-default w-full border-none text-sm">
              <SelectValue placeholder="School Currency" />
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default border">
              {currencies.map(c => (
                <SelectItem key={c} value={c} className="text-text-default">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {touched.currency && errors.currency && <p className="text-text-destructive text-xs font-light">{errors.currency}</p>}
        </div>
      </div>
    </div>
  );
};
