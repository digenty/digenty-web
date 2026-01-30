import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { getCountries } from "@/app/actions/country";
import { Country } from "../StudentAndParent/types";
import { FormikProps } from "formik";
import { CreateSchoolProps } from "./types";
import { Skeleton } from "../ui/skeleton";

const schoolSizes = ["1", "2", "3", " 4"];
const currencies = ["NGN"];

export const WelcomeInputs = ({ formik }: { formik: FormikProps<CreateSchoolProps> }) => {
  const [schoolSize, setSchoolSize] = useState(schoolSizes[0]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [currency, setCurrency] = useState(currencies[1]);

  useEffect(() => {
    getCountries().then(setCountries);
  }, []);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="text-text-default text-lg font-semibold">Welcome to Digenty</div>
        <div className="text-text-muted text-sm">Let&apos;s get your school set up in a few simple steps</div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label className="text-text-default text-sm font-semibold">First Name</Label>
          <Input className="bg-bg-input-soft! text-text-default w-full border-none text-sm" placeholder="e.g Damilare" />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-text-default text-sm font-semibold">Last Name</Label>
          <Input className="bg-bg-input-soft! text-text-default w-full border-none text-sm" placeholder="e.g John" />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-text-default text-sm font-semibold">School Name</Label>
          <Input className="bg-bg-input-soft! text-text-default w-full border-none text-sm" placeholder="e.g Digenty Schools" />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-text-default text-sm font-semibold">School Size</Label>
          <Select value={schoolSize} onValueChange={setSchoolSize}>
            <SelectTrigger className="bg-bg-input-soft! w-full border-none">
              <SelectValue placeholder="Select one">
                {" "}
                <span className="text-text-default flex text-sm font-medium"> {schoolSize}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default border">
              {schoolSizes.map(ss => (
                <SelectItem key={ss} value={ss} className="text-text-default">
                  {ss}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-text-default text-sm font-semibold">Role</Label>
        <Input className="bg-bg-input-soft! text-text-default w-full border-none text-sm" placeholder="e.g Principal" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nationality" className="text-text-default text-sm font-medium">
            School Country
          </Label>
          {countries && countries.length > 0 ? (
            <Select
              onValueChange={countryName => {
                const selectedCountry = countries?.find(c => c.name === countryName);

                formik.setFieldValue("nationality", countryName);
                formik.setFieldValue("countryCode", selectedCountry?.iso2);
              }}
            >
              <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
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
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-text-default text-sm font-semibold">School Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="bg-bg-input-soft! w-full border-none">
              <SelectValue placeholder="School Currency">
                {" "}
                <span className="text-text-default flex text-sm font-medium"> {currency}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default border">
              {currencies.map(c => (
                <SelectItem key={c} value={c} className="text-text-default">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
