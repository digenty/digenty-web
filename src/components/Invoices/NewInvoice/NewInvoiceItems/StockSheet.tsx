import { ArrowDownS } from "@/components/Icons/ArrowDownS";
import { MobileDrawer } from "@/components/MobileDrawer";
import { SearchInput } from "@/components/SearchInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetOverlay, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useIsMobile";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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
  {
    id: 4,
    itemName: "School Uniform",
    amount: 150000,
    tFees: 150000,
    status: "Optional",
    items: 553,
    stock: "Out of Stock",
  },
  {
    id: 5,
    itemName: "School Uniform",
    amount: 150000,
    tFees: 150000,
    status: "Optional",
    items: 553,
    stock: "Out of Stock",
  },
];

export const StockSheet = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div>
      <Button
        onClick={() => setOpen(true)}
        className="bg-bg-state-secondary! border-border-darker text-text-default flex h-8 w-full cursor-pointer items-center justify-center rounded-md border text-sm font-medium"
      >
        Select from Stock <ChevronDown className="text-icon-default-muted hidden size-4 md:block" />
      </Button>
      {!isMobile && (
        <Sheet open={open} onOpenChange={setOpen}>
          <div>
            <SheetContent className="bg-bg-card border-border-default mx-4 mt-4 hidden w-full overflow-y-auto rounded-md border md:block md:min-w-130">
              <SheetHeader className="border-border-darker bg-bg-card-subtle px4 rounded-t-md border-b py-3">
                <VisuallyHidden>
                  <SheetTitle>Select Stock Items</SheetTitle>
                </VisuallyHidden>

                <div className="flex items-center justify-between">
                  {" "}
                  <div className="text-text-default text-md font-semibold">Select Stock Items</div>
                </div>
              </SheetHeader>

              <div className="flex w-full flex-col gap-6 p-6">
                <SearchInput className="bg-bg-input-soft border-border-default border" placeholder="Search fee group" />
                <div className="flex flex-col gap-4">
                  {sheetFees.map(sf => (
                    <div key={sf.id} className="border-border-darker bg-bg-card rounded-md border p-4">
                      <div className="flex w-full items-start gap-2.5">
                        <Image
                          src="/images/noImage.png"
                          alt="no image"
                          width={32}
                          height={32}
                          className="border-border-default rounded-full border"
                        />

                        <div className="w-full">
                          <div className="border-border-default flex w-full flex-col gap-2 border-b pb-4">
                            <div className="flex w-full items-center justify-between">
                              <div className="text-text-default text-sm font-medium">{sf.itemName}</div>
                              <Badge className="text-bg-basic-lime-strong border-border-default bg-bg-badge-lime h-5 rounded-md border p-1 text-xs font-medium">
                                {sf.items} items
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-text-muted text-sm font-medium">₦{sf.amount}</div>

                              <Badge className="bg-bg-badge-red text-bg-basic-red-strong border-border-default h-5 rounded-md border p-1 text-xs font-medium">
                                {sf.stock}
                              </Badge>
                            </div>
                          </div>

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
        <MobileDrawer open={open} setIsOpen={setOpen} title="Select Stock Items">
          <div className="flex w-full flex-col gap-6 overflow-y-auto p-6">
            <SearchInput className="bg-bg-input-soft border-border-default border" placeholder="Search stock items" />
            <div className="flex flex-col gap-4">
              {sheetFees.map(sf => (
                <div key={sf.id} className="border-border-darker bg-bg-card rounded-md border p-4">
                  <div className="flex w-full items-start gap-2.5">
                    <Image src="/images/noImage.png" alt="no image" width={32} height={32} className="rounded-full" />

                    <div className="w-full">
                      <div className="border-border-default flex w-full flex-col gap-2 border-b pb-4">
                        <div className="flex w-full items-center justify-between">
                          <div className="text-text-default text-sm font-medium">{sf.itemName}</div>
                          <Badge className="text-bg-basic-lime-strong border-border-default bg-bg-badge-lime h-5 rounded-md border p-1 text-xs font-medium">
                            {sf.items} items
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-text-muted text-sm font-medium">₦{sf.amount}</div>

                          <Badge className="bg-bg-badge-red text-bg-basic-red-strong border-border-default h-5 rounded-md border p-1 text-xs font-medium">
                            {sf.stock}
                          </Badge>
                        </div>
                      </div>

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
