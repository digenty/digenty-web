import { ArrowDownS } from "@/components/Icons/ArrowDownS";
import { SearchInput } from "@/components/SearchInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetOverlay, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import React, { useState } from "react";

const sheetFees = [
  {
    id: 0,
    classStudent: "New JSS 1 Student",
    amount: 150000,
    tFees: 150000,
    status: "Optional",
    items: 10,
  },
  {
    id: 1,
    classStudent: "New JSS 1 Student",
    amount: 150000,
    tFees: 150000,
    status: "Optional",
    items: 10,
  },
  {
    id: 2,
    classStudent: "New JSS 1 Student",
    amount: 150000,
    tFees: 150000,
    status: "Optional",
    items: 10,
  },
];

export const GroupFeesSheet = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId(prev => (prev === id ? null : id));
  };
  return (
    <div>
      <div className="flex w-full flex-col gap-2">
        <Sheet>
          <SheetTrigger asChild className="bg-bg-state-secondary! border-border-darker flex h-8 w-full cursor-pointer rounded-md border">
            <div className="flex items-center justify-center gap-2 px-3">
              <Button className="hover:bg-bg-none! text-text-default border-none p-0 text-sm font-medium">Select from Fee Groups</Button>{" "}
              <ArrowDownS fill="var(--color-icon-default-muted )" className="hidden md:block" />
            </div>
          </SheetTrigger>

          <div className="">
            <SheetOverlay />
            <SheetContent className="bg-bg-card border-border-default my-4 mr-4 overflow-y-scroll rounded-md border md:min-w-130">
              <SheetHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
                <VisuallyHidden>
                  <SheetTitle>Select Fee Groups</SheetTitle>
                </VisuallyHidden>
                <div className="flex items-center justify-between">
                  {" "}
                  <div className="text-text-default text-md font-semibold">Select Fee Groups</div>
                </div>
              </SheetHeader>

              <div className="flex w-full flex-col gap-6 px-6 pt-2 pb-6">
                <SearchInput className="bg-bg-input-soft border-border-default border" placeholder="Search fee group" />
                <div className="flex flex-col gap-4">
                  {sheetFees.map(sf => (
                    <div key={sf.id} className="border-border-darker bg-bg-card rounded-md border p-4">
                      <div className="flex w-full items-start gap-2.5">
                        <div
                          className="bg-bg-state-soft flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm p-1"
                          onClick={() => toggle(sf.id)}
                        >
                          <ArrowDownS
                            fill="var(--color-icon-default-muted)"
                            className={`transition-transform ${openId === sf.id ? "" : "rotate-270"}`}
                          />
                        </div>

                        <div className="w-full">
                          <div className="border-border-default flex w-full flex-col gap-2 border-b pb-4">
                            <div className="flex w-full items-center justify-between">
                              <div className="text-text-default text-sm font-medium">{sf.classStudent}</div>
                              <Badge className="text-text-subtle border-border-default h-5 w-14 rounded-md border p-1 text-xs font-medium">
                                {sf.items} items
                              </Badge>
                            </div>
                            <div className="text-text-informative text-sm font-medium">₦{sf.amount}</div>
                          </div>

                          {openId === sf.id && (
                            <>
                              <div className="border-border-default flex justify-start gap-2.5 border-b py-4">
                                <Checkbox />
                                <div className="mt-[-2] flex flex-col gap-1">
                                  <div className="text-text-default text-sm font-medium">Tuition fees</div>
                                  <Badge className="text-text-subtle border-border-default h-5 w-14 rounded-md border p-1 text-xs font-medium">
                                    {sf.status}
                                  </Badge>
                                  <div className="text-text-muted text-sm">₦{sf.tFees.toLocaleString()}</div>
                                </div>
                              </div>

                              <div className="border-border-default flex justify-start gap-2.5 border-b py-4">
                                <Checkbox />
                                <div className="mt-[-2] flex flex-col gap-1">
                                  <div className="text-text-default text-sm font-medium">Tuition fees</div>
                                  <Badge className="text-text-subtle border-border-default h-5 w-14 rounded-md border p-1 text-xs font-medium">
                                    {sf.status}
                                  </Badge>
                                  <div className="text-text-muted text-sm">₦{sf.tFees.toLocaleString()}</div>
                                </div>
                              </div>
                            </>
                          )}

                          <Button className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! mt-4 flex h-8 w-30 items-center gap-1 rounded-sm">
                            Add to Invoice
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <SheetFooter className="border-border-default bg-bg-card border-t">
                <div className="flex w-full items-center justify-between">
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      className="bg-bg-state-soft! text-text-subtle hover:text-text-subtle! rounde-sm h-7 w-17 border-none px-2 py-1"
                    >
                      Cancel
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
        </Sheet>
      </div>
    </div>
  );
};
