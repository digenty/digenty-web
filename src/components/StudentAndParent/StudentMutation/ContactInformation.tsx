"use client";
import { cn } from "@/lib/utils";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

export const ContactInformation = () => {
  return (
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
  );
};
