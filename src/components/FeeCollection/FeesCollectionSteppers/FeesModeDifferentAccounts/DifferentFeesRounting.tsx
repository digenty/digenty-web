import { AddFill } from "@/components/Icons/AddFill";
import Edit from "@/components/Icons/Edit";
import { Gtbank } from "@/components/Icons/Gtbank";
import { QuickReferenceAll } from "@/components/Icons/QuickReferenceAll";
import { SearchInput } from "@/components/SearchInput";
import { Tabs } from "@/components/Tabs";
import { Button } from "@/components/ui/button";
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

export const DifferentFeesRounting = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="">
        <div className="text-text-default mb-2 text-lg font-semibold">Route fees</div>
        <div className="text-text-muted text-sm font-normal">
          By default, all fees go to the school&apos;s collection account. Only choose a fee if it should be collected separately.
        </div>
      </div>

      <Tabs
        className="w-fit"
        items={[
          {
            label: "Ilasamaja",
            content: <BranchFeeRouting />,
          },
          {
            label: "Lawanson",
            content: <BranchFeeRouting />,
          },
        ]}
      />
    </div>
  );
};

export const BranchFeeRouting = () => {
  const [query, setQuery] = useState("");

  const filteredItems = routesFees.filter(item => `${item.accName} ${item.feeName}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="">
        <SearchInput
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="bg-bg-input-soft! text-text-muted border-none"
          placeholder="Search fees"
        />
      </div>
      <div className="">
        {filteredItems.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredItems.map(route => (
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
                <Edit fill="var(--color-icon-default-subtle)" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-10">
            <div className="flex flex-col items-center gap-2">
              <QuickReferenceAll fill="var(--color-border-strong)" />
              <div className="text-text-default text-md font-medium">No fees found</div>
              <div className="text-text-muted text-xs font-normal">All fees created will be found here</div>
              <Button className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default">
                {" "}
                <AddFill fill="var(--color-icon-white-default)" /> Add Fee
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
