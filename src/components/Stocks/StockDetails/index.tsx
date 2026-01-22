"use client";

import React, { useState } from "react";
import { StockDetailHeader } from "./StockDetailHeader";
import { OverviewCard } from "@/components/OverviewCard";
import Store3 from "@/components/Icons/Store3";
import IndeterminateCircleFill from "@/components/Icons/IndeterminateCircleFill";
import { ReplyFill } from "@/components/Icons/ReplyFill";
import { StockDetailsManagement } from "./StockDetailsManagement";
import { StockHistories } from "./StockHistories";
import { Tabs } from "@/components/Tab";
import { Button } from "@/components/ui/button";
import { StockQuantityManagementItems } from "./type";
import { ArrowUpDown } from "@/components/Icons/ArrowUpDown";
import { stockStatus } from "@/components/Status";
import { StockDetailsAdjustQtyModal } from "./StockDetailsAdjustQtyModal";

export const StockDetails = () => {
  const [adjustQty, setAdjustQty] = useState(false);
  return (
    <div className="">
      <div className="hidden flex-col gap-6 md:flex">
        <StockDetailHeader />

        <div className="grid w-full grid-cols-2 gap-3 lg:grid-cols-3">
          <div>
            <OverviewCard
              title="Total Sold"
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
              title="Total Removed"
              Icon={() => (
                <div className="bg-bg-basic-pink-subtle border-bg-basic-pink-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                  <IndeterminateCircleFill fill="var(--color-icon-default)" />
                </div>
              )}
              value="5"
            />
          </div>

          <div className="col-span-2 lg:col-span-1">
            <OverviewCard
              title="Total Returned"
              Icon={() => (
                <div className="bg-bg-basic-fuchsia-subtle border-bg-basic-fuchsia-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                  <ReplyFill fill="var(--color-icon-default)" />
                </div>
              )}
              value="20"
            />
          </div>
        </div>

        <StockDetailsManagement />

        <StockHistories />
      </div>

      <div className="w-full items-center md:hidden">
        <Tabs
          className="w-full"
          items={[
            {
              label: "Overview",
              content: (
                <div className="my-4 flex w-full flex-col gap-4">
                  <StockDetailHeader />

                  <div className="grid w-full grid-cols-2 gap-3 lg:grid-cols-3">
                    <div>
                      <OverviewCard
                        title="Total Sold"
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
                        title="Total Removed"
                        Icon={() => (
                          <div className="bg-bg-basic-pink-subtle border-bg-basic-pink-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                            <IndeterminateCircleFill fill="var(--color-icon-default)" />
                          </div>
                        )}
                        value="5"
                      />
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                      <OverviewCard
                        title="Total Returned"
                        Icon={() => (
                          <div className="bg-bg-basic-fuchsia-subtle border-bg-basic-fuchsia-accent flex h-5 w-5 items-center justify-center rounded-xs border p-1">
                            <ReplyFill fill="var(--color-icon-default)" />
                          </div>
                        )}
                        value="20"
                      />
                    </div>
                  </div>

                  <div className="border-border-default flex h-full w-full flex-col gap-5 rounded-sm border p-4 md:w-118">
                    <div className="text-text-default text-sm font-semibold">Item Details</div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="text-text-muted text-sm">Lawanson Price</div>
                        <div className="text-text-default text-md font-medium">₦50,000</div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="text-text-muted text-sm">Cost Price</div>
                        <div className="text-text-default text-md font-medium">₦50,000</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-text-muted text-sm">Ilasamaja Price</div>
                      <div className="text-text-default text-md font-medium">₦50,000</div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="text-text-muted text-sm">Unit</div>
                      <div className="text-text-default text-md font-medium">Pcs</div>
                    </div>

                    <div className="border-border-default border-b"></div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="text-text-muted text-sm">Last Modified Lawanson </div>
                        <div className="text-text-default text-md font-medium">24/10/2024</div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="text-text-muted text-sm">Date Added Lawanson </div>
                        <div className="text-text-default text-md font-medium">24/10/2024</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="text-text-muted text-sm">Last Modified Lawanson </div>
                        <div className="text-text-default text-md font-medium">24/10/2024</div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="text-text-muted text-sm">Date Added Lawanson </div>
                        <div className="text-text-default text-md font-medium">24/10/2024</div>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            },

            {
              label: "Quantity",
              content: (
                <>
                  {adjustQty && <StockDetailsAdjustQtyModal open={adjustQty} setOpen={setAdjustQty} />}
                  <div className="border-border-default my-4 flex w-full flex-1 flex-col gap-6 rounded-sm border p-4">
                    <div className="text-text-default text-sm font-semibold">Quantity Management</div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="text-text-muted text-sm">Current Quantity</div>
                        <div className="text-text-default text-2xl font-semibold">89</div>
                      </div>
                      <Button
                        onClick={() => setAdjustQty(true)}
                        className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8!"
                      >
                        <ArrowUpDown fill="var(--color-icon-white-default)" />
                        Adjust Quantity
                      </Button>
                    </div>

                    <div className="flex flex-col gap-4 md:hidden">
                      {StockQuantityManagementItems.map((stock, i) => {
                        return (
                          <div key={i} className="border-border-default bg-bg-subtle rounded-md border">
                            <div className="">
                              <div className="border-border-default flex justify-between border-b px-3 py-1">
                                <div className="text-text-muted text-sm font-medium">{stock.location}</div>
                                <ArrowUpDown fill="var(--color-icon-default)" />
                              </div>
                            </div>

                            <div className="">
                              <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                                <span className="text-text-muted font-medium">Quantity</span>
                                <div className="text-text-default text-sm font-medium">{stock.quantity}</div>
                              </div>
                            </div>

                            <div className="">
                              <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                                <span className="text-text-muted font-medium">Amount</span>

                                <span className="text-text-default text-sm font-medium">{stock.amount}</span>
                              </div>
                            </div>

                            <div className="">
                              <div className="flex justify-between px-3 py-2 text-sm">
                                <span className="text-text-muted font-medium">Branch</span>
                                <span>{stockStatus(stock.status)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ),
            },

            {
              label: "Stock History",
              content: (
                <div className="my-4 w-full">
                  <StockHistories />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};
