import { Avatar } from "@/components/Avatar";
import { AddFill } from "@/components/Icons/AddFill";
import { ArrowDownS } from "@/components/Icons/ArrowDownS";
import { Gtbank } from "@/components/Icons/Gtbank";
import { QuickReferenceAll } from "@/components/Icons/QuickReferenceAll";
import { MobileDrawer } from "@/components/MobileDrawer";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Label } from "@radix-ui/react-label";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";

const branchAcc = [
  {
    id: 1,
    branchName: "Ilasamaja",
  },
  {
    id: 2,
    branchName: "Ilasamaja",
  },
];

const filterItems = [
  {
    bankLogo: <Gtbank />,
    accName: "Damilare John",
    accNum: 3213123123,
  },
  {
    bankLogo: <Gtbank />,
    accName: "Damilare John",
    accNum: 3213123123,
  },
];

export const DifferentFeesAccount = () => {
  const [openFilter, setOpenFilter] = useState<Record<number, boolean>>({});
  const [query, setQuery] = useState("");
  const [selectedAccounts, setSelectedAccounts] = useState<Record<number, string>>({});
  const isMobile = useIsMobile();

  const filteredItems = filterItems.filter(item => `${item.accName} ${item.accNum}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col gap-6">
        <div className="">
          <div className="text-text-default mb-2 text-lg font-semibold">Set a collection account for each branch</div>
          <div className="text-text-muted text-sm font-normal">This is where most fees will go by default for each branch.</div>
        </div>
        {branchAcc.map(branch => (
          <div
            key={branch.id}
            className="border-border-default flex flex-col gap-4 rounded-md border p-2 md:h-19 md:flex-row md:items-center md:justify-between md:p-6"
          >
            <span className="text-text-default text-md font-medium">{branch.branchName}</span>
            {!isMobile ? (
              <Select
                open={!!openFilter[branch.id]}
                onOpenChange={open => {
                  setOpenFilter(prev => ({ ...prev, [branch.id]: open }));
                  if (!open) setQuery("");
                }}
                value={selectedAccounts[branch.id]}
                onValueChange={val => setSelectedAccounts(prev => ({ ...prev, [branch.id]: val }))}
              >
                <SelectTrigger className="bg-bg-input-soft! text-text-default flex h-9! w-full! items-center justify-between rounded-md border-none p-2 md:w-57!">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>

                <SelectContent className="bg-bg-card border-border-default text-text-default w-71! p-0! shadow-sm">
                  <div className="border-border-default border-b">
                    <SearchInput className="w-full rounded-md border-none" value={query} onChange={e => setQuery(e.target.value)} />
                  </div>

                  <SelectGroup className="p-0!">
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item, i) => (
                        <SelectItem key={i} value={String(item.accNum)} className="text-text-default my-2 py-3 text-sm">
                          <div className="flex w-full items-center justify-between gap-2">
                            <div className=""> {item.bankLogo}</div>
                            <div className="w-full text-xs">
                              {item.accName} - {item.accNum}
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="not-found" disabled>
                        <div className="my-4 flex flex-col items-center gap-2">
                          <QuickReferenceAll fill="var(--color-icon-bg-default)" className="border-border-strong border" />
                          <div className="text-text-subtle text-sm">No accounts added yet</div>
                          <div className="text-text-muted text-center text-xs">Your added will show here once added</div>
                        </div>
                      </SelectItem>
                    )}

                    <AddAccountSheet />
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : (
              <>
                <Button
                  onClick={() => setOpenFilter(prev => ({ ...prev, [branch.id]: true }))}
                  className="bg-bg-input-soft! text-text-default flex h-9! w-full! items-center justify-between rounded-md border-none p-2 md:w-57!"
                >
                  <div
                    className={`${selectedAccounts[branch.id] ? "text-text-default text-sm" : "text-text-subtle text-sm"} flex items-center justify-between`}
                  >
                    {selectedAccounts[branch.id]
                      ? (() => {
                          const found = filterItems.find(i => String(i.accNum) === selectedAccounts[branch.id]);
                          return found ? `  ${found.accName} - ${found.accNum}` : selectedAccounts[branch.id];
                        })()
                      : "Select account"}
                  </div>
                  <ArrowDownS fill="var(--color-icon-default-muted)" />
                </Button>

                <MobileDrawer
                  open={!!openFilter[branch.id]}
                  setIsOpen={open => {
                    setOpenFilter(prev => ({ ...prev, [branch.id]: open }));
                    if (!open) setQuery("");
                  }}
                  title="Select account"
                >
                  <div className="flex flex-col gap-3 p-3">
                    <div className="border-border-default">
                      <SearchInput className="w-full rounded-md border-none" value={query} onChange={e => setQuery(e.target.value)} />
                    </div>

                    <div className="">
                      {filteredItems.length > 0 ? (
                        filteredItems.map((item, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              setSelectedAccounts(prev => ({ ...prev, [branch.id]: String(item.accNum) }));
                              setOpenFilter(prev => ({ ...prev, [branch.id]: false }));
                              setQuery("");
                            }}
                            className="bg-bg-card border-border-default mb-2 flex cursor-pointer items-center justify-between rounded-md border p-4"
                          >
                            <div className="flex items-center gap-2">
                              <div>{item.bankLogo}</div>
                              <div className="text-text-default w-full text-xs">
                                {item.accName} - {item.accNum}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="mt-4 mb-6 flex flex-col items-center gap-2">
                          <QuickReferenceAll fill="var(--color-icon-bg-default)" className="border-border-strong border" />
                          <div className="text-text-subtle text-sm">No accounts added yet</div>
                          <div className="text-text-muted text-center text-xs">Your added will show here once added</div>
                        </div>
                      )}

                      <AddAccountSheet />
                    </div>
                  </div>
                </MobileDrawer>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const AddAccountSheet = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const isMobile = useIsMobile();
  return (
    <div className="">
      <div
        onClick={() => setSheetOpen(true)}
        role="button"
        className="hover:bg-bg-input-soft border-border-default text-text-default flex cursor-pointer items-center justify-center gap-1.5 border-t py-2 text-sm"
      >
        <PlusIcon className="text-icon-default-muted size-4" /> Add new account
      </div>

      <div>
        {!isMobile && (
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <div>
              <SheetContent className="bg-bg-card border-border-default my-4 mr-4 hidden overflow-y-auto rounded-md border md:block md:min-w-130">
                <SheetHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
                  <div className="text-text-default text-md font-semibold">Add New Account</div>
                </SheetHeader>

                <div className="">
                  <div>
                    <div className="flex flex-col gap-6 p-6">
                      <div className="">
                        <Select>
                          <Label className="text-text-default mb-2 text-sm font-medium">Bank Name</Label>
                          <SelectTrigger className="bg-bg-input-soft! hover:bg-bg-input-soft! text-text-default w-full rounded-md border-none">
                            <SelectValue placeholder="Select Bank" />
                          </SelectTrigger>
                          <SelectContent className="bg-bg-card border-border-default text-text-default border">
                            <SelectGroup>
                              <SelectItem value="Dami">
                                <Gtbank /> <span>GTBank</span>
                              </SelectItem>
                              <SelectItem value="John">
                                <Avatar username="Damilare John" className="size-4" /> <span>Access Bank</span>
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
          <MobileDrawer open={sheetOpen} setIsOpen={setSheetOpen} title="Add New Account">
            <div className="">
              <div>
                <div className="flex flex-col gap-6 p-6">
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
                    <Input className="bg-bg-input-soft! text-text-muted w-full rounded-md border-none" placeholder="Enter 10-digits account number" />
                    <div className="bg-bg-input-soft mt-2 flex w-full items-center gap-2 rounded-md p-2">
                      <Avatar username="Damilare John" className="size-4" />{" "}
                      <span className="text-text-default text-sm font-medium">Damilare John</span>
                    </div>
                  </div>
                </div>
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
