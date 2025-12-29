import { ArrowDownS } from "@/components/Icons/ArrowDownS";
import { MobileDrawer } from "@/components/MobileDrawer";
import { SearchInput } from "@/components/SearchInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetOverlay, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useIsMobile";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const sheetFees = [
  {
    id: 0,
    classStudent: "JSS 1 A",
    amount: 150000,
    tFees: 150000,
    status: "Optional",
    items: 10,
    term: "· 24/25 Third Term",
  },
  {
    id: 1,
    classStudent: "JSS 1 A",
    amount: 150000,
    tFees: 150000,
    status: "Optional",
    items: 10,
    term: "· 24/25 Third Term",
  },
  {
    id: 2,
    classStudent: "JSS 1 A",
    amount: 150000,
    tFees: 150000,
    status: "Optional",
    items: 10,
    term: "· 24/25 Third Term",
  },
];

export const FeesSheet = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggle = (id: number) => {
    setOpenId(prev => (prev === id ? null : id));
  };
  return (
    <div>
      <Button
        onClick={() => setSheetOpen(true)}
        className="bg-bg-state-secondary! border-border-darker text-text-default flex h-8 w-full cursor-pointer items-center justify-center rounded-md border text-sm font-medium"
      >
        Select from Fees <ChevronDown className="text-icon-default-muted hidden size-4 md:block" />
      </Button>

      {!isMobile && (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <div>
            <SheetContent className="bg-bg-card border-border-default mt-4 mr-4 hidden overflow-y-auto rounded-md border md:block md:min-w-130">
              <SheetHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
                <VisuallyHidden>
                  <SheetTitle>Select from Fees</SheetTitle>
                </VisuallyHidden>
                <div className="flex items-center justify-between">
                  {" "}
                  <div className="text-text-default text-md font-semibold">Select from Fees</div>
                </div>
              </SheetHeader>

              <div className="flex w-full flex-col gap-6 p-6">
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
                              <div className="flex items-center">
                                <div className="text-text-default text-sm font-medium">{sf.classStudent}</div>
                                <div className="text-text-muted text-sm font-medium">{sf.term}</div>
                              </div>
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

              <SheetFooter className="border-border-default border-t pb-8">
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
        </Sheet>
      )}

      {/* Mobile */}
      {isMobile && (
        <MobileDrawer open={sheetOpen} setIsOpen={setSheetOpen} title="Select from Fees">
          <div className="flex w-full flex-col gap-6 p-6">
            <SearchInput className="bg-bg-input-soft border-border-default border" placeholder="Search fees" />
            <div className="flex flex-col gap-4">
              {sheetFees.map(sf => (
                <div key={sf.id} className="border-border-darker bg-bg-card rounded-md border p-4">
                  <div className="flex w-full items-start gap-2.5">
                    <div
                      className="bg-bg-state-soft flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm p-1"
                      onClick={() => toggle(sf.id)}
                    >
                      <ArrowDownS fill="var(--color-icon-default-muted)" className={`transition-transform ${openId === sf.id ? "" : "rotate-270"}`} />
                    </div>

                    <div className="w-full">
                      <div className="border-border-default flex w-full flex-col gap-2 border-b pb-4">
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center">
                            <div className="text-text-default text-sm font-medium">{sf.classStudent}</div>
                            <div className="text-text-muted text-sm font-medium">{sf.term}</div>
                          </div>
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
        </MobileDrawer>
      )}
    </div>
  );
};
