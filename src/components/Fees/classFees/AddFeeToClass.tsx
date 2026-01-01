"use client";

import { ArrowDownS } from "@/components/Icons/ArrowDownS";
import { SearchInput } from "@/components/SearchInput";
import { Toggle } from "@/components/Toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetOverlay, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { useState } from "react";

const terms = ["First Term", "Second Term", "Third Term"];
const sessions = ["2024/2025", "2023/2024", "2022/2023"];
const sheetFees = [
  {
    id: 0,
    itemName: "School Uniform",
    amount: 150000,
    tFees: 150000,
    status: "Optional",
    items: 553,
    stock: "Out of Stock",
  },
  {
    id: 1,
    itemName: "School Uniform",
    amount: 150000,
    tFees: 150000,
    status: "Optional",
    items: 553,
    stock: "Out of Stock",
  },
  {
    id: 2,
    itemName: "School Uniform",
    amount: 150000,
    tFees: 150000,
    status: "Optional",
    items: 553,
    stock: "Out of Stock",
  },
  {
    id: 3,
    itemName: "School Uniform",
    amount: 150000,
    tFees: 150000,
    status: "Optional",
    items: 553,
    stock: "Out of Stock",
  },
];

const AddFeeToClass = () => {
  const [draft, setDraft] = useState(false);
  const [termSelected, setTermSelected] = useState(terms[0]);
  const [sessionSelected, setSessionSelected] = useState(sessions[0]);
  const [quantity, setQuantity] = useState(1);

  const increase = () => {
    setQuantity(quantity + 1);
  };
  const decrease = () => {
    setQuantity(quantity > 1 ? quantity - 1 : 1);
  };
  return (
    <div className="">
      <div className="bg-bg-card-subtle border-border-default flex w-full items-center justify-center border-b p-3">
        <div className="mx-auto w-full font-semibold md:max-w-150">
          <div className="text-text-default text-md">Add Fee To JSS 1 A</div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="border-border-default mx-auto flex flex-col gap-6 px-4 py-3 md:px-8">
          <div className="">
            <Sheet>
              <SheetTrigger asChild className="bg-bg-state-secondary! border-border-darker flex h-8 w-41 cursor-pointer rounded-md border">
                <Button className="hover:bg-bg-none! text-text-muted border-border-darker flex items-center justify-center gap-2 border p-0 px-3 text-sm font-normal">
                  Select from Stock
                  <ArrowDownS fill="var(--color-icon-default-muted )" className="size-3" />
                </Button>
              </SheetTrigger>

              <div className="">
                <SheetOverlay />
                <div className=" ">
                  <SheetContent className="bg-bg-card border-border-default h-98vh w-full rounded-md border md:mx-auto md:h-[98vh] md:max-w-2/5">
                    <SheetHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
                      <div className="flex items-center justify-between">
                        {" "}
                        <div className="text-text-default text-md font-semibold">Select Stocks items</div>
                      </div>
                    </SheetHeader>

                    <div className="flex w-full flex-col gap-6 overflow-y-auto p-4 md:p-6">
                      <SearchInput className="bg-bg-input-soft border-border-default w-full border" placeholder="Search fee group" />
                      <div className="flex flex-col gap-4">
                        {sheetFees.map(sf => (
                          <div key={sf.id} className="border-border-darker bg-bg-card w-85 rounded-md border p-4 md:w-full md:min-w-118">
                            <div className="flex w-full items-start gap-2.5">
                              <Image src="/images/image.png" alt="no image" width={32} height={32} className="rounded-full" />

                              <div className="w-full">
                                <div className="border-border-default flex w-full flex-col gap-2 border-b pb-4">
                                  <div className="flex w-full items-center justify-between">
                                    <div className="text-text-default text-sm font-medium">{sf.itemName}</div>
                                    <Badge className="text-bg-basic-lime-strong border-border-default bg-bg-badge-lime h-5 rounded-md border p-1 text-xs font-medium">
                                      {sf.items} items
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-text-muted text-sm font-medium">₦{sf.amount.toLocaleString()}</div>

                                    <Badge className="bg-bg-badge-red text-bg-basic-red-strong border-border-default h-5 rounded-md border p-1 text-xs font-medium">
                                      {sf.stock}
                                    </Badge>
                                  </div>
                                </div>

                                <Button className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! mt-4 flex h-8 w-30 items-center gap-1 rounded-sm">
                                  Add to Fees
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <SheetFooter className="border-border-default border-t">
                      <div className="flex items-center justify-between">
                        <SheetClose asChild>
                          <Button
                            variant="outline"
                            className="bg-bg-state-soft! text-text-subtle hover:text-text-subtle! rounde-sm h-7 w-17 border-none px-2 py-1"
                          >
                            Close
                          </Button>
                        </SheetClose>
                        <Button
                          type="submit"
                          className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! flex h-7 w-17 items-center gap-1 rounded-sm px-2 py-1"
                        >
                          Done
                        </Button>
                      </div>
                    </SheetFooter>
                  </SheetContent>
                </div>
              </div>
            </Sheet>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Fee Name</Label>
            <Input className="bg-bg-input-soft! text-text-muted rounded-md border-none" placeholder="Input Fee Name" />
          </div>
          <div className="flex max-w-fit gap-2">
            {draft ? (
              <Badge className="text-bg-basic-fuchsia-strong bg-bg-badge-fuchsia border-border-default w h-5! w-16! rounded-sm border">
                Required
              </Badge>
            ) : (
              <Badge className="text-text-default border-border-default w h-5! w-16! rounded-sm border">Optional</Badge>
            )}
            <Toggle checked={draft} onChange={e => setDraft(e.target.checked)} className="border-none" />
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <div className="w-full">
              <Select value={sessionSelected} onValueChange={setSessionSelected}>
                <Label className="text-text-default mb-2 text-sm font-medium">Session</Label>
                <SelectTrigger className="bg-bg-input-soft! h-8! w-full rounded-md border-none">
                  <SelectValue>
                    <span className="text-text-muted text-sm font-normal">{sessionSelected}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-border-default">
                  {sessions.map(s => (
                    <SelectItem key={s} value={s} className="text-text-default text-sm font-normal">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <Select value={termSelected} onValueChange={setTermSelected}>
                <Label className="text-text-default mb-2 text-sm font-medium">Term</Label>
                <SelectTrigger className="bg-bg-input-soft! h-8! w-full rounded-md border-none">
                  <SelectValue>
                    <span className="text-text-muted text-sm font-normal">{termSelected}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-border-default">
                  {terms.map(t => (
                    <SelectItem key={t} value={t} className="text-text-default text-sm font-normal">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="w-full">
              <Label className="text-text-default mb-2 text-sm font-medium">Quantity</Label>
              <div className="bg-bg-input-soft m flex w-full justify-between gap-2 rounded-md p-2">
                <div className="text-text-subtle cursor-pointer" onClick={decrease}>
                  -
                </div>
                <div className="text-text-default text-sm font-normal">{quantity}</div>
                <div className="text-text-subtle cursor-pointer" onClick={increase}>
                  +
                </div>
              </div>
            </div>
            <div className="w-full">
              <Label className="text-text-default mb-2 text-sm font-medium">Amount</Label>
              <Input className="bg-bg-input-soft! text-text-muted rounded-md border-none" placeholder="Input Fee Name" />
            </div>
          </div>

          <div className="border-border-default flex items-start justify-between rounded-md border p-4">
            <div className="flex w-full flex-col gap-2">
              <div className="text-text-default text-sm font-medium">Allow part payment</div>
              <div className="text-text-subtle text-sm font-normal">
                Let parents pay this fee in instalments instead of paying the full amount at once.
              </div>
            </div>
            <Checkbox />
          </div>

          <div className="border-border-default bg-bg-default absolute bottom-0 w-full max-w-150 border-t py-3">
            <div className="flex w-full justify-between">
              <Button className="bg-bg-state-soft! text-text-subtle! hover:bg-bg-state-soft-hover! h-7! text-sm">Cancel</Button>
              <div className="flex items-center gap-2">
                <Button className="bg-bg-state-soft! text-text-subtle! hover:bg-bg-state-soft-hover! hidden h-7! w-39! text-sm md:flex">
                  Save & Add Another
                </Button>
                <Button className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-7! w-19!">Add Fee</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFeeToClass;
