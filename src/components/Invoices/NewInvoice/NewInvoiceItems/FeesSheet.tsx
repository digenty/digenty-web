import { ArrowDownS } from "@digenty/icons";

import { MobileDrawer } from "@/components/MobileDrawer";
import { SearchInput } from "@/components/SearchInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetFeesForPicker } from "@/hooks/queryHooks/useFee";
import { Branch } from "@/api/types";
import { unwrapArray } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FeeInvoiceItem {
  id: number;
  name: string;
  amount: number;
  required: boolean;
}

interface FeeInvoiceEntry {
  id: number;
  classStudent: string;
  termLabel: string;
  totalAmount: number;
  items: FeeInvoiceItem[];
}

interface Props {
  branchId?: number;
  termId?: number;
}

function FeeList({ fees, isLoading }: { fees: FeeInvoiceEntry[]; isLoading: boolean }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const toggle = (id: number) => setOpenId(prev => (prev === id ? null : id));

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (fees.length === 0) {
    return <p className="text-text-muted text-sm">No fees found for the selected filters.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {fees.map(sf => (
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
                  <div className="flex items-center gap-1">
                    <div className="text-text-default text-sm font-medium">{sf.classStudent}</div>
                    {sf.termLabel && <div className="text-text-muted text-sm font-medium">· {sf.termLabel}</div>}
                  </div>
                  <Badge className="text-text-subtle border-border-default h-5 w-14 rounded-md border p-1 text-xs font-medium">
                    {sf.items.length} items
                  </Badge>
                </div>
                <div className="text-text-informative text-sm font-medium">₦{sf.totalAmount?.toLocaleString()}</div>
              </div>

              {openId === sf.id && (
                <div className="flex flex-col">
                  {sf.items.map(item => (
                    <div key={item.id} className="border-border-default flex justify-start gap-2.5 border-b py-4">
                      <Checkbox />
                      <div className="mt-[-2] flex flex-col gap-1">
                        <div className="text-text-default text-sm font-medium">{item.name}</div>
                        <Badge className="text-text-subtle border-border-default h-5 w-14 rounded-md border p-1 text-xs font-medium">
                          {item.required ? "Required" : "Optional"}
                        </Badge>
                        <div className="text-text-muted text-sm">₦{item.amount?.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button type="button" className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! mt-4 flex h-8 w-30 items-center gap-1 rounded-sm">
                Add to Invoice
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export const FeesSheet = ({ branchId: propBranchId, termId }: Props = {}) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [search, setSearch] = useState("");
  const isMobile = useIsMobile();

  const { data: branchesData } = useGetBranches();
  const branches: Branch[] = unwrapArray<Branch>(branchesData);
  const defaultBranchId = propBranchId ?? branches[0]?.id;

  const { data: feesData, isLoading } = useGetFeesForPicker(defaultBranchId, undefined, termId);

  const allFees: FeeInvoiceEntry[] = unwrapArray<FeeInvoiceEntry>(feesData);

  const fees = search
    ? allFees.filter(f => f.classStudent?.toLowerCase().includes(search.toLowerCase()))
    : allFees;

  const content = (
    <div className="flex w-full flex-col gap-6 p-6">
      <SearchInput
        className="bg-bg-input-soft border-border-default border"
        placeholder="Search fees"
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
      />
      <FeeList fees={fees} isLoading={isLoading} />
    </div>
  );

  const footer = (
    <div className="flex items-center justify-between">
      <SheetClose asChild>
        <Button variant="outline" className="bg-bg-state-soft! text-text-subtle hover:text-text-subtle! h-7 w-17 border-none px-2 py-1">
          Close
        </Button>
      </SheetClose>
      <Button type="button" className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary/90! flex h-7 w-17 items-center gap-1 rounded-sm px-2 py-1">
        Done
      </Button>
    </div>
  );

  return (
    <div>
      <Button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="bg-bg-state-secondary! border-border-darker text-text-default flex h-8 w-full cursor-pointer items-center justify-center rounded-md border text-sm font-medium"
      >
        Select from Fees <ChevronDown className="text-icon-default-muted hidden size-4 md:block" />
      </Button>

      {!isMobile && (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className="bg-bg-card border-border-default mt-4 mr-4 hidden overflow-y-auto rounded-md border md:block md:min-w-130">
            <SheetHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
              <VisuallyHidden>
                <SheetTitle>Select from Fees</SheetTitle>
              </VisuallyHidden>
              <div className="text-text-default text-md font-semibold">Select from Fees</div>
            </SheetHeader>
            {content}
            <SheetFooter className="border-border-default border-t pb-8">
              {footer}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}

      {isMobile && (
        <MobileDrawer open={sheetOpen} setIsOpen={setSheetOpen} title="Select from Fees">
          {content}
          <SheetFooter className="border-border-default border-t">
            {footer}
          </SheetFooter>
        </MobileDrawer>
      )}
    </div>
  );
};
