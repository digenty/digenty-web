import React from "react";
import { StocksSearchAndFilter } from "./StocksSearchAndFilter";
import { OverviewCard } from "../OverviewCard";
import Store3 from "../Icons/Store3";
import AlertFill from "../Icons/AlertFill";
import IndeterminateCircleFill from "../Icons/IndeterminateCircleFill";
import { StockHeader } from "./StockHeader";
import { StockOverviewTable } from "./StockOverviewTable";

export const StockMain = () => {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <StockHeader />
      <div className="grid w-full grid-cols-2 gap-3 lg:grid-cols-3">
        <div>
          <OverviewCard
            title="Total Items"
            Icon={() => (
              <div className="bg-bg-basic-rose-subtle border-bg-basic-rose-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                <Store3 fill="var(--color-icon-default)" />
              </div>
            )}
            value="500"
          />
        </div>

        <div>
          <OverviewCard
            title="Low Stock Items"
            Icon={() => (
              <div className="bg-bg-basic-pink-subtle border-bg-basic-pink-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                <AlertFill fill="var(--color-icon-default)" />
              </div>
            )}
            value="5"
          />
        </div>

        <div className="col-span-2 lg:col-span-1">
          <OverviewCard
            title="Out of Stock Items"
            Icon={() => (
              <div className="bg-bg-basic-fuchsia-subtle border-bg-basic-fuchsia-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                <IndeterminateCircleFill fill="var(--color-icon-default)" />
              </div>
            )}
            value="20"
          />
        </div>
      </div>
      <StocksSearchAndFilter />

      <StockOverviewTable />
    </div>
  );
};
