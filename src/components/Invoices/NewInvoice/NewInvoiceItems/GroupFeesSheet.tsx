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
import { useGetFeeGroupsForPicker } from "@/hooks/queryHooks/useFee";
import { Branch } from "@/api/types";
import { unwrapArray } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface GroupItem {
  id: number;
  name: string;
  amount: number;
  required: boolean;
}

interface FeeGroupEntry {
  id: number;
  name: string;
  totalAmount: number;
  items: GroupItem[];
}

interface Props {
  branchId?: number;
}

function GroupList({ groups, isLoading }: { groups: FeeGroupEntry[]; isLoading: boolean }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const toggle = (id: number) => setOpenId(prev => (prev === id ? null : id));

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (groups.length === 0) {
    return <p className="text-text-muted text-sm">No fee groups found.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {groups.map(sf => (
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
                  <div className="text-text-default text-sm font-medium">{sf.name}</div>
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

export const GroupFeesSheet = ({ branchId: propBranchId }: Props = {}) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [search, setSearch] = useState("");
  const isMobile = useIsMobile();

  const { data: branchesData } = useGetBranches();
  const branches: Branch[] = unwrapArray<Branch>(branchesData);
  const defaultBranchId = propBranchId ?? branches[0]?.id;

  const { data: groupsData, isLoading } = useGetFeeGroupsForPicker(defaultBranchId, search || undefined);

  const groups: FeeGroupEntry[] = unwrapArray<FeeGroupEntry>(groupsData);

  const content = (
    <div className="flex w-full flex-col gap-6 px-6 pt-2 pb-6">
      <SearchInput
        className="bg-bg-input-soft border-border-default border"
        placeholder="Search fee groups"
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
      />
      <GroupList groups={groups} isLoading={isLoading} />
    </div>
  );

  const footer = (
    <div className="flex w-full items-center justify-between">
      <SheetClose asChild>
        <Button variant="outline" className="bg-bg-state-soft! text-text-subtle hover:text-text-subtle! h-7 w-17 border-none px-2 py-1">
          Cancel
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
        Select from Fee Groups <ChevronDown className="text-icon-default-muted hidden size-4 md:block" />
      </Button>

      {!isMobile && (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className="bg-bg-card border-border-default my-4 mr-4 hidden overflow-y-auto rounded-md border md:block md:min-w-130">
            <SheetHeader className="border-border-darker bg-bg-card-subtle rounded-t-md border-b px-4 py-3">
              <VisuallyHidden>
                <SheetTitle>Select Fee Groups</SheetTitle>
              </VisuallyHidden>
              <div className="text-text-default text-md font-semibold">Select Fee Groups</div>
            </SheetHeader>
            {content}
            <SheetFooter className="border-border-default bg-bg-card border-t pb-8">
              {footer}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}

      {isMobile && (
        <MobileDrawer open={sheetOpen} setIsOpen={setSheetOpen} title="Select Fee Groups">
          {content}
          <SheetFooter className="border-border-default bg-bg-card border-t">
            {footer}
          </SheetFooter>
        </MobileDrawer>
      )}
    </div>
  );
};
