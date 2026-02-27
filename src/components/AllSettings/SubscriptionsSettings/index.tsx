"use client";

import { DataTable } from "@/components/DataTable";
import { CheckDouble } from "@/components/Icons/CheckDouble";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { SubscriptionColumns } from "./Columns";
import { subscriptionTableData } from "./type";
import { Tabs } from "@/components/Tabs";
import Information from "@/components/Icons/Information";
import { useRouter } from "next/navigation";

export const pricingPlans = [
  {
    id: "freemium",
    name: "Freemium",
    price: 0,
    currency: "₦",
    per: "per student/ one term trial",
    comingSoon: false,
    cta: {
      label: "Start Trial",
      disabled: false,
    },
    features: ["Administrator Tools", "Students Attendance Management", "Result Processing & Publishing ", "9+ modules"],
  },
  {
    id: "standard",
    name: "Standard",
    price: 300,
    currency: "₦",
    per: "per student",
    comingSoon: false,
    cta: {
      label: "Subscribe",
      disabled: false,
    },
    features: ["Everything in Freemium,", "Academics and exams management", "Financial summary and analytics", "16+ modules"],
  },
  {
    id: "advanced",
    name: "Advanced",
    price: 500,
    currency: "₦",
    per: "per student",
    comingSoon: false,
    cta: {
      label: "Subscribe",
      disabled: false,
    },
    features: ["Everything in Standard,", "Online assignments & E-notes", "Computer-based testing and examination", "19+ modules"],
  },

  {
    id: "premium",
    name: "Premium",
    price: 800,
    currency: "₦",
    per: "per student",
    comingSoon: true,
    cta: {
      label: "Subscribe",
      disabled: true,
    },
    features: ["Everything in Advanced,", "Students Transcripts & Alumni", "LMS (Live classes & online courses etc.)", "26+ modules"],
  },
];

export const SettingSubscription = () => {
  const [page, setPage] = useState(1);
  const router = useRouter();

  const pageSize = 50;
  return (
    <div className="flex flex-col gap-8">
      <div className="text-text-default text-xl font-semibold">Subscription</div>
      <div className="bg-bg-subtle border-border-default flex flex-col gap-2 rounded-md border p-6">
        <Information fill="var(--color-icon-default-subtle)" />
        <div className="text-text-default text-sm font-medium">You do not have a subscription plan</div>
        <div className="text-text-subtle text-xs">To continue, select a subscription plan and get the full benefit of digenty </div>
      </div>

      <Tabs
        className="mx-auto mb-6 flex w-fit items-center justify-center"
        items={[
          {
            label: "Termly",
            content: (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {pricingPlans.map(plan => (
                  <div key={plan.id} className="border-border-default hover:bg-bg-state-ghost-hover rounded-sm border">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-text-default text-sm font-medium">{plan.name}</h3>
                        {plan.comingSoon && (
                          <Badge className="text-bg-basic-lime-strong bg-bg-badge-lime border-border-default rounded-md border text-xs">
                            Coming Soon
                          </Badge>
                        )}
                      </div>

                      <div className="mt-2">
                        <span className="text-text-default text-md font-medium">
                          {plan.currency}
                          {plan.price}
                        </span>
                        <span className="text-text-muted text-xs"> {plan.per}</span>
                      </div>

                      <Button
                        onClick={() => router.push("subscription/subscription-plan")}
                        disabled={plan.cta.disabled}
                        className="bg-bg-state-primary text-text-white-default disabled:bg-bg-state-disabled disabled:text-text-hint hover:bg-bg-state-primary-hover! mt-6 h-7! w-fit rounded-md"
                      >
                        {plan.cta.label}
                      </Button>
                    </div>

                    <div className="border-border-default border-b"></div>

                    <div className="mt-6 p-4">
                      <ul className="flex flex-col gap-5">
                        {plan.features.map(feature => (
                          <li key={feature} className="text-text-subtle flex items-center gap-3 text-sm">
                            <CheckDouble fill="var(--color-icon-default)" /> {feature}
                          </li>
                        ))}
                      </ul>

                      <Button className="hover:bg-bg-none! text-text-default mt-3 bg-none p-0 text-sm">See all available features</Button>
                    </div>
                  </div>
                ))}
              </div>
            ),
          },
          {
            label: "Yearly",
            content: "",
          },
        ]}
      />

      <div className="">
        <Tabs
          className="mx-auto mb-6 flex w-fit items-center justify-center"
          items={[
            {
              label: "Termly",
              content: (
                <DataTable
                  columns={SubscriptionColumns}
                  data={subscriptionTableData}
                  totalCount={subscriptionTableData.length}
                  page={page}
                  setCurrentPage={setPage}
                  pageSize={pageSize}
                  showPagination={false}
                  rowSelection={{}}
                  onSelectRows={() => {}}
                  setRowSelection={() => {}}
                  fullBorder
                  clickHandler={() => {}}
                />
              ),
            },

            {
              label: "Yearly",
              content: (
                <DataTable
                  columns={SubscriptionColumns}
                  data={subscriptionTableData}
                  totalCount={subscriptionTableData.length}
                  page={page}
                  setCurrentPage={setPage}
                  pageSize={pageSize}
                  showPagination={false}
                  rowSelection={{}}
                  setRowSelection={() => {}}
                  fullBorder
                  clickHandler={() => {}}
                  onSelectRows={() => {}}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};
