"use client";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { getCountries } from "@/app/actions/country";
import { FormikProps } from "formik";

import { Skeleton } from "../ui/skeleton";
import { CreateSchoolTypes, OnBoardingCountry } from "./types";
import { currencies } from "@/store/currenciesCode";

const schoolSizes = [1, 2, 3, 4];

export const WelcomeInputs = ({ formik }: { formik: FormikProps<CreateSchoolTypes> }) => {
  const { handleBlur, handleChange, errors, touched, values, setFieldValue } = formik;
  const [countries, setCountries] = useState<OnBoardingCountry[]>([]);
  const [currency, setCurrency] = useState<string>();
  const [activeCountry, setActiveCountry] = useState<OnBoardingCountry>();

  const getCountryList = async () => {
    const countryList = await getCountries();
    setCountries(countryList);
  };
  useEffect(() => {
    if (activeCountry) {
      setCurrency(activeCountry.currency);
      setFieldValue("currency", activeCountry.currency);
    }
  }, [activeCountry, setFieldValue]);

  useEffect(() => {
    getCountryList();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="text-text-default text-lg font-semibold">Welcome to Digenty</div>
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
            placeholder="e.g Digenty Schools"
          />
          {touched.schoolName && errors.schoolName && <p className="text-text-destructive text-xs font-light">{errors.schoolName}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="schoolSize" className="text-text-default text-sm font-semibold">
            School Size<small className="text-text-destructive text-xs">*</small>
          </Label>
          <Select
            value={values.schoolSize?.toString()}
            onValueChange={value => {
              formik.setFieldValue("schoolSize", Number(value));
            }}
          >
            <SelectTrigger className="bg-bg-input-soft! text-text-default w-full border-none">
              <SelectValue placeholder="School size" />
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default border">
              {schoolSizes.map(ss => (
                <SelectItem key={ss} value={ss.toString()} className="text-text-default">
                  {ss}
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
            <Select
              onValueChange={value => {
                const selectedCountry = countries.find(country => country.id === value);

                setFieldValue("country", value);
                setActiveCountry(selectedCountry);
              }}
            >
              <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                <span className="text-text-muted text-sm font-medium">{activeCountry ? activeCountry?.name : "Select Country"}</span>
              </SelectTrigger>

              <SelectContent className="bg-bg-card border-none">
                {countries.map(country => (
                  <SelectItem key={country.id} value={country.id} className="text-text-default">
                    {country.code} {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
