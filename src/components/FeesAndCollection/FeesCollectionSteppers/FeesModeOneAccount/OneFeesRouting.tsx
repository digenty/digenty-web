import { Avatar } from "@/components/Avatar";
import { AddFill } from "@/components/Icons/AddFill";
import { ArrowLeftS } from "@/components/Icons/ArrowLeftS";
import Edit from "@/components/Icons/Edit";
import { Gtbank } from "@/components/Icons/Gtbank";
import { MobileDrawer } from "@/components/MobileDrawer";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useIsMobile";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import React, { useState } from "react";

const routesFees = [
  {
    id: 1,
    feeName: "Tuition Fee",
    accNumber: 23234343334,
    accName: "Damilare John",
    accLogo: <Gtbank />,
  },
  {
    id: 2,
    feeName: "Tuition Fee",
    accNumber: 23234343334,
    accName: "Damilare John",
    accLogo: <Gtbank />,
  },
  {
    id: 3,
    feeName: "Tuition Fee",
    accNumber: 23234343334,
    accName: "Damilare John",
    accLogo: <Gtbank />,
  },
  {
    id: 4,
    feeName: "Tuition Fee",
    accNumber: 23234343334,
    accName: "Damilare John",
    accLogo: <Gtbank />,
  },
];

const routeFee = [
  {
    id: 1,
    bankName: "GTBank",
    accNumber: 23234343334,
    accName: "Damilare John",
    type: "Default",
    accLogo: <Gtbank />,
  },
  {
    id: 2,
    bankName: "Sterlink Bank",
    accNumber: 23234343334,
    accName: "Damilare John",
    accLogo: <Gtbank />,
  },
];

export const OneFeesRouting = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="">
        <div className="text-text-default mb-2 text-lg font-semibold">Route fees</div>
        <div className="text-text-muted text-sm font-normal">
          By default, all fees go to the school&apos;s collection account. Only choose a fee if it should be collected separately.
        </div>
      </div>
      <div className="">
        <SearchInput className="bg-bg-input-soft! text-text-muted border-none" placeholder="Search fees" />
      </div>
      <div className="flex flex-col gap-4">
        {routesFees.map(route => (
          <div className="border-border-default flex items-center justify-between rounded-sm border px-6 py-3" key={route.id}>
            <div className="flex flex-col gap-1">
              <div className="text-text-default text-md font-medium">{route.feeName}</div>
              <div className="flex items-center gap-2">
                <div className="">{route.accLogo}</div>
                <div className="text-text-muted flex items-center gap-1">
                  <span className="text-text-muted text-xs"> {route.accNumber}</span> -{" "}
                  <span className="text-text-muted text-xs">{route.accName}</span>{" "}
                </div>
              </div>
            </div>
            <RountingSheet />
          </div>
        ))}
      </div>
    </div>
  );
};

export const RountingSheet = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [active, setActive] = useState<(typeof routeFee)[number] | null>(null);
  const isMobile = useIsMobile();
  return (
    <div className="">
      <Button onClick={() => setSheetOpen(true)} className="hover:bg-bg-none! bg-none!">
        <Edit fill="var(--color-icon-default-subtle)" />
      </Button>
      <div>
        {!isMobile && (
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <div>
              <SheetContent className="bg-bg-card border-border-default my-4 mr-4 hidden overflow-y-auto rounded-md border md:block md:min-w-130">
                <SheetHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
                  <VisuallyHidden></VisuallyHidden>
                  <div className="flex items-center justify-between">
                    {" "}
                    <div className="text-text-default text-md font-semibold">
                      <div className="">
                        {active && (
                          <Button onClick={() => setActive(null)} className="hover:bg-bg-none! m-0 bg-none! p-0">
                            <ArrowLeftS fill="var(--color-icon-default-muted)" />
                          </Button>
                        )}{" "}
                        Tuition
                      </div>
                    </div>
                  </div>
                </SheetHeader>

                <div className="relative">
                  <div
                    className="absolute inset-0 transition-transform duration-300"
                    style={{
                      transform: active ? "translateX(-100%)" : "translateX(0)",
                    }}
                  >
                    <div className="flex flex-col gap-6 p-6">
                      <SearchInput className="bg-bg-input-soft border-border-default border" placeholder="Search fee group" />

                      <Button className="border-border-default bg-bg-state-secondary! text-text-default flex w-full items-center justify-center gap-3 rounded-md border border-dashed text-sm font-medium">
                        <AddFill fill="var(--color-icon-default-muted)" /> New Account
                      </Button>

                      <div className="relative">
                        <div className="relative transition-transform duration-300">
                          <div className="flex flex-col gap-6">
                            {routeFee.map(item => (
                              <div
                                key={item.id}
                                onClick={() => setActive(item)}
                                className="bg-bg-card border-border-darker mb-2 flex cursor-pointer items-start justify-between rounded-md border p-4"
                              >
                                <div className="flex items-start gap-2">
                                  <div>{item.accLogo}</div>
                                  <div className="flex flex-col gap-2">
                                    <div className="text-text-default text-sm font-medium">
                                      {item.accNumber} - {item.accName}
                                    </div>
                                    <div className="text-text-subtle text-sm font-normal">{item.bankName}</div>
                                  </div>
                                </div>
                                <div className="text-text-default text-sm font-medium">{item.type && `${item.type}`}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detail vieww*/}
                  <div
                    className="absolute inset-0 transition-transform duration-300"
                    style={{
                      transform: active ? "translateX(0)" : "translateX(100%)",
                    }}
                  >
                    {active && (
                      <div className="flex flex-col gap-6 p-6">
                        <div className="text-text-default text-md font-semibold"> Add New Account</div>
                        <div className="">
                          <Select>
                            <Label className="text-text-default mb-2 text-sm font-medium">Bank Name</Label>
                            <SelectTrigger className="bg-bg-input-soft! hover:bg-bg-input-soft! text-text-default w-full rounded-md border-none">
                              <SelectValue placeholder="Select Bank" />
                            </SelectTrigger>
                            <SelectContent className="bg-bg-card border-border-default text-text-default border">
                              <SelectGroup>
                                <SelectItem value="Dami">
                                  <Avatar username="Damilare John" className="size-4" /> <span>Damilare John</span>
                                </SelectItem>
                                <SelectItem value="John">
                                  <Avatar username="Damilare John" className="size-4" /> <span>Damilare John</span>
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="text-text-default text-sm font-medium">Account Number</Label>
                          <Input
                            className="bg-bg-input-soft! text-text-muted w-full rounded-md border-none"
                            placeholder="Enter 10-digits account number"
                          />
                          <div className="bg-bg-input-soft mt-2 flex w-full items-center gap-2 rounded-md p-2">
                            <Avatar username="Damilare John" className="size-4" />{" "}
                            <span className="text-text-default text-sm font-medium">Damilare John</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <SheetFooter className="border-border-default bg-bg-card absolute bottom-0 w-full border-t pb-8">
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
                      className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! flex h-7 items-center gap-1 rounded-sm px-2 py-1"
                    >
                      Route Fee
                    </Button>
                  </div>
                </SheetFooter>
              </SheetContent>
            </div>
          </Sheet>
        )}

        {/* Mobile */}
        {isMobile && (
          <MobileDrawer open={sheetOpen} setIsOpen={setSheetOpen} title="Tuition">
            <div className="relative min-h-[60vh] pb-20">
              <div
                className="absolute inset-0 overflow-y-auto transition-transform duration-300"
                style={{
                  transform: active ? "translateX(-100%)" : "translateX(0)",
                }}
              >
                <div className="flex flex-col gap-6 p-6">
                  <SearchInput className="bg-bg-input-soft border-border-default border" placeholder="Search fee group" />

                  <Button className="border-border-default bg-bg-state-secondary! text-text-default flex w-full items-center justify-center gap-3 rounded-md border border-dashed text-sm font-medium">
                    <AddFill fill="var(--color-icon-default-muted)" /> New Account
                  </Button>

                  <div className="relative">
                    <div className="relative transition-transform duration-300">
                      <div className="flex flex-col gap-6">
                        {routeFee.map(item => (
                          <div
                            key={item.id}
                            onClick={() => setActive(item)}
                            className="bg-bg-card border-border-darker mb-2 flex cursor-pointer items-start justify-between rounded-md border p-4"
                          >
                            <div className="flex items-start gap-2">
                              <div>{item.accLogo}</div>
                              <div className="flex flex-col gap-2">
                                <div className="text-text-default text-sm font-medium">
                                  {item.accNumber} - {item.accName}
                                </div>
                                <div className="text-text-subtle text-sm font-normal">{item.bankName}</div>
                              </div>
                            </div>
                            <div className="text-text-default text-sm font-medium">{item.type && `${item.type}`}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detail vieww*/}
              <div
                className="absolute inset-0 overflow-y-auto transition-transform duration-300"
                style={{
                  transform: active ? "translateX(0)" : "translateX(100%)",
                }}
              >
                {active && (
                  <div className="flex flex-col gap-6 p-6">
                    <div className="text-text-default text-md font-semibold"> Add New Account</div>
                    <div className="">
                      <Select>
                        <Label className="text-text-default mb-2 text-sm font-medium">Bank Name</Label>
                        <SelectTrigger className="bg-bg-input-soft! hover:bg-bg-input-soft! text-text-default w-full rounded-md border-none">
                          <SelectValue placeholder="Select Bank" />
                        </SelectTrigger>
                        <SelectContent className="bg-bg-card border-border-default text-text-default border">
                          <SelectGroup>
                            <SelectItem value="Dami">
                              <Avatar username="Damilare John" className="size-4" /> <span>Damilare John</span>
                            </SelectItem>
                            <SelectItem value="John">
                              <Avatar username="Damilare John" className="size-4" /> <span>Damilare John</span>
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-text-default text-sm font-medium">Account Number</Label>
                      <Input
                        className="bg-bg-input-soft! text-text-muted w-full rounded-md border-none"
                        placeholder="Enter 10-digits account number"
                      />
                      <div className="bg-bg-input-soft mt-2 flex w-full items-center gap-2 rounded-md p-2">
                        <Avatar username="Damilare John" className="size-4" />{" "}
                        <span className="text-text-default text-sm font-medium">Damilare John</span>
                      </div>
                    </div>
                  </div>
                )}
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
          </MobileDrawer>
        )}
      </div>
    </div>
  );
};
