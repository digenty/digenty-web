"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddFill } from "@/components/Icons/AddFill";
import { DownloadT } from "@/components/Icons/DownloadT";
import { Minus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const categories = ["SS 3 Items", "SS 2 Items"];
const branches = ["All Branches", "Lawanson", "Ilasamaja"];
const unities = ["Pieces (pcs)", "Pack / Packet", "Box / Carton", "Dozen", "Ream (for paper)", "Bottle", "Roll"];
export const AddStock = () => {
  const [categorySelected, setCategorySelected] = useState(categories[0]);
  const [branchSelected, setBranchSelected] = useState(branches[0]);
  const [unit, setUnit] = useState(unities[0]);
  return (
    <>
      <div className="bg-bg-card-subtle border-border-default mb-6 w-full border-b">
        <div className="justify-left mx-auto flex w-full items-center p-4 md:max-w-150">
          <div className="text-text-default text-md font-semibold">Add Stock</div>
        </div>
      </div>

      <div className="mx-auto flex w-full items-center justify-center md:max-w-150">
        <div className="flex w-full flex-col gap-6 p-4">
          <div className="text-text-default text-xl font-semibold">Basic Info</div>
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Item Name</Label>
            <Input className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm" placeholder="Input Item Name" />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Description</Label>
            <Input className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm" placeholder="Input Description" />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Category</Label>

            <Select value={categorySelected} onValueChange={setCategorySelected}>
              <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                <SelectValue>
                  <span className="text-text-default text-sm">{categorySelected}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-default border-border-default">
                {categories.map(value => (
                  <SelectItem key={value} value={value} className="text-text-default text-sm">
                    {value}
                  </SelectItem>
                ))}

                <div className="border-border-default h-9 border-t">
                  <Button className="text-text-default hover:bg-bg-none! w-full bg-none text-sm font-medium">
                    {" "}
                    <AddFill fill="var(--color-icon-default-muted)" /> Add new
                  </Button>
                </div>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-text-default text-sm font-medium">Stock Image</div>
            <div className="border-border-default flex items-center justify-center rounded-sm border border-dashed px-6 py-8">
              <div className="flex flex-col items-center gap-3">
                <DownloadT />
                <div className="text-text-default text-sm font-medium">
                  Drop your files here, or <span className="text-text-informative">click to browse</span>{" "}
                </div>
                <div className="text-text-muted text-xs">JPG or PNG. 5MB Max.</div>
              </div>
            </div>
          </div>
          <div className="text-text-default text-lg font-semibold">Stock & Unit</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-text-default text-sm font-medium">Branch</Label>
              <div className="text-text-muted text-sm">You can select more than one</div>
            </div>

            <Select value={branchSelected} onValueChange={setBranchSelected}>
              <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
                <SelectValue>
                  <span className="text-text-default text-sm">{branchSelected}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-default border-border-default">
                {branches.map(branch => (
                  <SelectItem key={branch} value={branch} className="text-text-default text-sm">
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
                  <SelectValue>
                    <span className="text-text-default text-sm">{unit}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {unities.map(unt => (
                    <SelectItem key={unt} value={unt} className="text-text-default text-sm">
                      {unt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">Quantity</Label>
              <div className="bg-bg-input-soft flex h-9 items-center justify-between rounded-md p-2">
                <Minus className="text-text-muted" /> <span className="text-text-default text-sm">1</span>
                <AddFill fill="var(--color-icon-default-muted)" />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox />
                <div className="text-text-muted text-xs">All Branches have different prices</div>
              </div>
            </div>
          </div>
          <div className="text-text-default text-lg font-semibold">Pricing</div>

          <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">Price</Label>
              <Input className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm" type="number" placeholder="₦0.00" />
              <div className="flex items-center gap-2">
                <Checkbox />
                <div className="text-text-muted text-xs">All Branches have different quantities</div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">Cost Price</Label>
              <Input className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm" type="number" placeholder="₦0.00" />
            </div>
          </div>

          <div className="text-text-default text-lg font-semibold">Branch Variation</div>

          <div className="border-border-default flex flex-col gap-5 rounded-lg border">
            <div className="bg-bg-input-soft rounded-t-md">
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-text-muted text-sm font-medium md:w-67">Branch</span>
                <span className="text-text-muted text-sm font-medium md:w-32">Quantity</span>
                <span className="text-text-muted text-sm font-medium md:w-32">Price</span>
              </div>
            </div>

            <div className="py- flex items-center gap-3 px-4">
              <Input className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm md:w-67" disabled />
              <Input className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm md:w-32" placeholder="1" type="number" />
              <Input className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm md:w-32" placeholder="₦0.00" type="number" />
            </div>
            <div className="py- flex items-center gap-3 px-4">
              <Input className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm md:w-67" disabled />
              <Input className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm md:w-32" placeholder="1" type="number" />
              <Input className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm md:w-32" placeholder="₦0.00" type="number" />
            </div>
          </div>

          <div className="border-border-default flex w-full items-center justify-between border-t py-4">
            <Button className="bg-bg-state-soft! text-text-subtle h-8!">Cancel</Button>

            <div className="flex items-center gap-2">
              <Button className="bg-bg-state-soft! text-text-subtle h-8!">Save and Add Another</Button>
              <Button className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-8!">Done</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
