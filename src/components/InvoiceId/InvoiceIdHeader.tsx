"use client";
import React from "react";
import { Button } from "../ui/button";
import DeleteBin from "../Icons/DeleteBin";
import Edit from "../Icons/Edit";
import Printer from "../Icons/Printer";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useRouter } from "next/navigation";

export const InvoiceIdHeader = () => {
  const router = useRouter();
  useBreadcrumb([
    { label: "Invoices", url: "/invoices" },
    { label: "Invoice Details", url: "" },
  ]);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:justify-between">
      <div className="text-text-default text-lg font-semibold">INV-001-20323E</div>

      <div className="flex items-center gap-1">
        <Button className="bg-bg-state-destructive text-text-white-default hover:bg-bg-state-destructive-hover! flex h-8 w-22! items-center gap-1 px-2.5! py-1.5!">
          <DeleteBin fill="var(--color-icon-white-default)" /> Delete
        </Button>
        <Button
          role="button"
          onClick={() => router.push("/invoices/add-payment")}
          className="bg-bg-state-secondary border-border-darker text-text-default hover:bg-bg-state-secondary-hover! flex h-8 w-30.5 items-center gap-1 border"
        >
          <Edit fill="var(--color-icon-default-muted)" />
          Edit Invoice
        </Button>
        <Button className="border-border-darker bg-bg-state-secondary text-text-default hover:bg-bg-state-secondary-hover! flex h-8 w-19 items-center gap-1 border">
          <Printer fill="var(--color-icon-default-muted)" /> Print
        </Button>
      </div>
    </div>
  );
};
