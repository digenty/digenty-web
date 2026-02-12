import { Avatar } from "@/components/Avatar";
import { Gtbank } from "@/components/Icons/Gtbank";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

export const OneCollectionAccount = () => {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="">
        <div className="text-text-default text-lg font-semibold">Add your collection account</div>
        <div className="text-text-muted text-sm font-normal">This account will be used for all branches by default.</div>
      </div>
      <div className="">
        <Select>
          <Label className="text-text-default mb-2 text-sm font-medium">Bank Name</Label>
          <SelectTrigger className="bg-bg-input-soft! hover:bg-bg-input-soft! text-text-default w-full rounded-md border-none">
            <SelectValue placeholder="Select Bank" />
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default text-text-default border">
            <SelectGroup>
              <SelectItem value="Dami">
                <Gtbank /> <span>GTbank</span>
              </SelectItem>
              <SelectItem value="John">
                <Gtbank /> <span>GTbank</span>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-text-default text-sm font-medium">Account Number</Label>
        <Input className="bg-bg-input-soft! text-text-muted w-full rounded-md border-none" placeholder="Enter 10-digits account number" />
        <div className="bg-bg-input-soft mt-2 flex w-full items-center gap-2 rounded-md p-2">
          <Avatar className="size-4" /> <span className="text-text-default text-sm font-medium">Damilare John</span>
        </div>
      </div>
    </div>
  );
};
