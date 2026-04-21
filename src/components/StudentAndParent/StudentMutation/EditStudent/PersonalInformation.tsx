"use client";
import { getCountries } from "@/app/actions/country";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { FormikProps } from "formik";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { GenderValues } from "../../constants";
import { Country, StudentInputValues } from "../../types";
import { Student } from "@/api/types";
import { SearchableSelect } from "../../SearchableSelect";

export const PersonalInformation = ({
  date,
  setDate,
  formik,
  data,
}: {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  formik: FormikProps<StudentInputValues>;
  data: { data: Student } | undefined;
}) => {
  const { handleBlur, handleChange, errors, touched, values, setFieldValue } = formik;
  const [countries, setCountries] = useState<Country[]>([]);
  const [availableStates, setAvailableStates] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const countryList = await getCountries();
      setCountries(countryList);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (countries.length > 0 && values.nationality) {
      const selectedCountry = countries.find(c => c.name.trim().toLowerCase() === values.nationality.trim().toLowerCase());
      if (selectedCountry) {
        setAvailableStates(selectedCountry.states || []);
      } else {
        setAvailableStates([]);
      }
    } else {
      setAvailableStates([]);
    }
  }, [countries, values.nationality]);

  // Synchronize stateOfOrigin if the casing differs from what is in availableStates
  useEffect(() => {
    if (availableStates.length > 0 && values.stateOfOrigin) {
      const match = availableStates.find(s => s.trim().toLowerCase() === values.stateOfOrigin.trim().toLowerCase());
      if (match && match !== values.stateOfOrigin) {
        setFieldValue("stateOfOrigin", match);
      }
    }
  }, [availableStates, values.stateOfOrigin, setFieldValue]);

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
              {GenderValues.map(gender => (
                <SelectItem key={gender.value} className="text-text-default" value={gender.value}>
                  {gender.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob" className="text-text-default text-sm font-medium">
            Date of Birth <small className="text-text-destructive text-xs">*</small>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "text-text-muted bg-bg-input-soft! focus-visible:border-border-default! hover:bg-bg-input-soft! w-full border-none text-sm font-normal shadow-none focus-visible:border!",
                )}
              >
                {date ? format(date, "PPP") : <span>dd / mm / yy</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-bg-card! p-0!" align="start">
              <Calendar
                disabled={{
                  after: new Date(),
                }}
                mode="single"
                required
                selected={date}
                onSelect={date => {
                  setDate(date);
                  formik.setFieldValue("dateOfBirth", date);
                }}
                captionLayout="dropdown"
                className="bg-bg-card w-full border-none"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="medicalInformation" className="text-text-default text-sm font-medium">
            Medical Information
          </Label>
          <Input
            id="medicalInformation"
            onChange={handleChange}
            autoFocus
            placeholder="Input Any Medical Information"
            onBlur={handleBlur}
            value={values.medicalInformation}
            type="text"
            className={cn(
              "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
              errors.medicalInformation && touched.medicalInformation && "border-border-destructive border",
            )}
          />
          {touched.medicalInformation && errors.medicalInformation && (
            <p className="text-text-destructive text-xs font-light">{errors.medicalInformation}</p>
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
                if (formik.values.nationality !== country) {
                  setFieldValue("nationality", country);
                  setFieldValue("stateOfOrigin", ""); // Reset state if country changes
                }
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
            disabled={!values.nationality}
            value={formik.values.stateOfOrigin}
            onValueChange={value => {
              if (formik.values.nationality && availableStates.includes(value)) {
                setFieldValue("stateOfOrigin", value);
              }
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
