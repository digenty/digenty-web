"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

export const AddStudent = () => {
  const [date, setDate] = useState<Date | undefined>();
  return (
    <div className="">
      <div className="border-border-default bg-bg-card-subtle flex justify-between border-b px-4 py-3 md:px-30 xl:px-70">
        <h1 className="text-text-default text-base font-semibold">
          Add <span className="hidden md:inline">New</span> Student
        </h1>
        <div className="bg-bg-badge-default text-text-subtle border-border-default flex h-6 w-8.5 items-center justify-center rounded-md border p-1 text-sm md:hidden">
          1/3
        </div>
      </div>

      <div className="text-text-default p-4 md:px-30 md:py-8 xl:px-70">
        {/* Profile Picture */}
        <div className="border-border-default space-y-4 border-b pb-6 md:space-y-6">
          <h2 className="text-lg font-semibold">Profile Picture</h2>

          <div className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-between rounded-full">
              <Image src="/images/profile-picture.png" alt="profile" className="rounded-full" width={40} height={40} />
            </div>

            <Button className="border-border-darker text-text-default h-7 border px-2! text-sm font-medium">Upload</Button>
            <p className="text-text-muted text-xs font-normal">JPG or PNG. 1MB Max.</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="border-border-default space-y-6 border-b py-6">
          <h2 className="text-lg font-semibold">Personal Information</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-text-default text-sm font-medium">
                First Name
              </Label>
              <Input
                id="firstName"
                // onChange={handleChange}
                autoFocus
                placeholder="Input First Name"
                // onBlur={handleBlur}
                // value={values.email}
                type="text"
                className={cn(
                  "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
                  // errors.email && touched.email && "border-text-error/50 border",
                )}
              />
              {/* {touched.email && errors.email && <p className="text-text-error/80 font-satoshi text-xs font-light">{errors.email}</p>} */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-text-default text-sm font-medium">
                Last Name
              </Label>
              <Input
                id="lastName"
                // onChange={handleChange}
                autoFocus
                placeholder="Input Last Name"
                // onBlur={handleBlur}
                // value={values.email}
                type="text"
                className={cn(
                  "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
                  // errors.email && touched.email && "border-text-error/50 border",
                )}
              />
              {/* {touched.email && errors.email && <p className="text-text-error/80 font-satoshi text-xs font-light">{errors.email}</p>} */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="middleName" className="text-text-default text-sm font-medium">
                Middle Name
              </Label>
              <Input
                id="middleName"
                // onChange={handleChange}
                autoFocus
                placeholder="Input Middle Name"
                // onBlur={handleBlur}
                // value={values.email}
                type="text"
                className={cn(
                  "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
                  // errors.email && touched.email && "border-text-error/50 border",
                )}
              />
              {/* {touched.email && errors.email && <p className="text-text-error/80 font-satoshi text-xs font-light">{errors.email}</p>} */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-text-default text-sm font-medium">
                Gender
              </Label>
              <Select>
                <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-none">
                  {["Male", "Female"].map(gender => (
                    <SelectItem key={gender} className="text-text-default" value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-text-default text-sm font-medium">
                Date of Birth
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
                    selected={date}
                    onSelect={setDate}
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
                // onChange={handleChange}
                autoFocus
                placeholder="Input Any Medical Information"
                // onBlur={handleBlur}
                // value={values.email}
                type="text"
                className={cn(
                  "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
                  // errors.email && touched.email && "border-text-error/50 border",
                )}
              />
              {/* {touched.email && errors.email && <p className="text-text-error/80 font-satoshi text-xs font-light">{errors.email}</p>} */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality" className="text-text-default text-sm font-medium">
                Nationality
              </Label>
              <Select>
                <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                  <SelectValue placeholder="Select Nationality" />
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-none">
                  {["Male", "Female"].map(gender => (
                    <SelectItem key={gender} className="text-text-default" value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stateOfOrigin" className="text-text-default text-sm font-medium">
                State of Origin
              </Label>
              <Select>
                <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                  <SelectValue placeholder="Select State of Origin" />
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-none">
                  {["Male", "Female"].map(gender => (
                    <SelectItem key={gender} className="text-text-default" value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-border-default space-y-6 border-b py-6">
          <h2 className="text-lg font-semibold">Contact Information</h2>

          <div className="grid grid-cols-1 gap-6 sm:gap-5">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-text-default text-sm font-medium">
                Home Address
              </Label>
              <Input
                id="address"
                // onChange={handleChange}
                autoFocus
                placeholder="Input Home Address"
                // onBlur={handleBlur}
                // value={values.email}
                type="text"
                className={cn(
                  "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
                  // errors.email && touched.email && "border-text-error/50 border",
                )}
              />
              {/* {touched.email && errors.email && <p className="text-text-error/80 font-satoshi text-xs font-light">{errors.email}</p>} */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-text-default text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                // onChange={handleChange}
                autoFocus
                placeholder="Input Email Address"
                // onBlur={handleBlur}
                // value={values.email}
                type="email"
                className={cn(
                  "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
                  // errors.email && touched.email && "border-text-error/50 border",
                )}
              />
              {/* {touched.email && errors.email && <p className="text-text-error/80 font-satoshi text-xs font-light">{errors.email}</p>} */}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5">
            <div className="space-y-2">
              <Label htmlFor="primaryPhone" className="text-text-default text-sm font-medium">
                Primary Phone Number
              </Label>
              <Input
                id="primaryPhone"
                // onChange={handleChange}
                autoFocus
                placeholder="Input Primary Phone Number"
                // onBlur={handleBlur}
                // value={values.email}
                type="text"
                className={cn(
                  "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
                  // errors.email && touched.email && "border-text-error/50 border",
                )}
              />
              {/* {touched.email && errors.email && <p className="text-text-error/80 font-satoshi text-xs font-light">{errors.email}</p>} */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondaryPhone" className="text-text-default text-sm font-medium">
                Secondary Phone Number
              </Label>
              <Input
                id="secondaryPhone"
                // onChange={handleChange}
                autoFocus
                placeholder="Input Secondary Phone Number"
                // onBlur={handleBlur}
                // value={values.email}
                type="text"
                className={cn(
                  "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
                  // errors.email && touched.email && "border-text-error/50 border",
                )}
              />
              {/* {touched.email && errors.email && <p className="text-text-error/80 font-satoshi text-xs font-light">{errors.email}</p>} */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact" className="text-text-default text-sm font-medium">
                Emergency Contact Name
              </Label>
              <Input
                id="emergencyContact"
                // onChange={handleChange}
                autoFocus
                placeholder="Input Emergency Contact Name"
                // onBlur={handleBlur}
                // value={values.email}
                type="text"
                className={cn(
                  "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
                  // errors.email && touched.email && "border-text-error/50 border",
                )}
              />
              {/* {touched.email && errors.email && <p className="text-text-error/80 font-satoshi text-xs font-light">{errors.email}</p>} */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyNumber" className="text-text-default text-sm font-medium">
                Emergency Contact Number
              </Label>
              <Input
                id="emergencyNumber"
                // onChange={handleChange}
                autoFocus
                placeholder="Input Emergency Contact Number"
                // onBlur={handleBlur}
                // value={values.email}
                type="text"
                className={cn(
                  "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
                  // errors.email && touched.email && "border-text-error/50 border",
                )}
              />
              {/* {touched.email && errors.email && <p className="text-text-error/80 font-satoshi text-xs font-light">{errors.email}</p>} */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality" className="text-text-default text-sm font-medium">
                Nationality
              </Label>
              <Select>
                <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                  <SelectValue placeholder="Select Nationality" />
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-none">
                  {["Male", "Female"].map(gender => (
                    <SelectItem key={gender} className="text-text-default" value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stateOfOrigin" className="text-text-default text-sm font-medium">
                State of Origin
              </Label>
              <Select>
                <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                  <SelectValue placeholder="Select State of Origin" />
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-none">
                  {["Male", "Female"].map(gender => (
                    <SelectItem key={gender} className="text-text-default" value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="border-border-default space-y-6 border-b py-6">
          <h2 className="text-lg font-semibold">Academic Information</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5">
            <div className="space-y-2">
              <Label htmlFor="nationality" className="text-text-default text-sm font-medium">
                Joined School Session
              </Label>
              <Select>
                <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                  <SelectValue placeholder="2024/2025" />
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-none">
                  {["Male", "Female"].map(gender => (
                    <SelectItem key={gender} className="text-text-default" value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality" className="text-text-default text-sm font-medium">
                Joined School Term
              </Label>
              <Select>
                <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                  <SelectValue placeholder="First Term" />
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-none">
                  {["Male", "Female"].map(gender => (
                    <SelectItem key={gender} className="text-text-default" value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admissionNumber" className="text-text-default text-sm font-medium">
                Admission Number
              </Label>
              <Input
                id="admissionNumber"
                // onChange={handleChange}
                autoFocus
                placeholder="GFA/2023/01045"
                // onBlur={handleBlur}
                // value={values.email}
                type="text"
                className={cn(
                  "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
                  // errors.email && touched.email && "border-text-error/50 border",
                )}
              />
              {/* {touched.email && errors.email && <p className="text-text-error/80 font-satoshi text-xs font-light">{errors.email}</p>} */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch" className="text-text-default text-sm font-medium">
                Branch
              </Label>
              <Select>
                <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-none">
                  {["Male", "Female"].map(gender => (
                    <SelectItem key={gender} className="text-text-default" value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="class" className="text-text-default text-sm font-medium">
                Class
              </Label>
              <Select>
                <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-none">
                  {["Male", "Female"].map(gender => (
                    <SelectItem key={gender} className="text-text-default" value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-text-default text-sm font-medium">
                Department
              </Label>
              <Select>
                <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-none">
                  {["Male", "Female"].map(gender => (
                    <SelectItem key={gender} className="text-text-default" value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="arm" className="text-text-default text-sm font-medium">
                Arm
              </Label>
              <Select>
                <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                  <SelectValue placeholder="Arm" />
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-none">
                  {["Male", "Female"].map(gender => (
                    <SelectItem key={gender} className="text-text-default" value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="boardingStatus" className="text-text-default text-sm font-medium">
                Boarding Status
              </Label>
              <Select>
                <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                  <SelectValue placeholder="Boarding Status" />
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-none">
                  {["Male", "Female"].map(gender => (
                    <SelectItem key={gender} className="text-text-default" value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admissionStatus" className="text-text-default text-sm font-medium">
                Admission Status
              </Label>
              <Select>
                <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
                  <SelectValue placeholder="Admission Status" />
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-none">
                  {["Male", "Female"].map(gender => (
                    <SelectItem key={gender} className="text-text-default" value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inputRole" className="text-text-default text-sm font-medium">
                Input Role
              </Label>
              <Input
                id="inputRole"
                // onChange={handleChange}
                autoFocus
                placeholder="Input Position"
                // onBlur={handleBlur}
                // value={values.email}
                type="text"
                className={cn(
                  "text-text-muted bg-bg-input-soft! border-none text-sm font-normal",
                  // errors.email && touched.email && "border-text-error/50 border",
                )}
              />
              {/* {touched.email && errors.email && <p className="text-text-error/80 font-satoshi text-xs font-light">{errors.email}</p>} */}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="border-border-default space-y-6 border-b py-6">
          <h2 className="text-lg font-semibold">Tag</h2>

          <div className="grid grid-cols-1 gap-6 sm:gap-5"></div>
        </div>
      </div>
    </div>
  );
};
