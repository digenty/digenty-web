"use client";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

export const PersonalInformation = ({ date, setDate }: { date: Date; setDate: React.Dispatch<React.SetStateAction<Date>> }) => {
  return (
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
                required
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
  );
};
