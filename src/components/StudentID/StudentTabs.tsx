"use client";

import { useState } from "react";
import { BiodataTable } from "./StudentTable/BiodataTable";
import StudentInvoiceTable from "./StudentTable/StudentInvoiceTable";
import StudentAcademiRecord from "./StudentTable/StudentAcademiRecord";

export default function StudentTabs() {
  const [activeTab, setActiveTab] = useState("biodata");

  return (
    <div className="mt-10 w-full">
      <div className="border-border-default relative w-full border-b">
        <div className="flex items-center justify-start">
          <button
            onClick={() => setActiveTab("biodata")}
            className={`relative cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeTab === "biodata"
                ? "border-border-informative text-text-informative border-b-2"
                : "border-border-default hover:text-text-informative text-text-muted border-b-2"
            }`}
          >
            Biodata
          </button>

          <button
            onClick={() => setActiveTab("invoices")}
            className={`relative cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeTab === "invoices"
                ? "border-border-informative text-text-informative border-b-2"
                : "border-border-default hover:text-text-informative text-text-muted border-b-2"
            }`}
          >
            Invoices
          </button>

          <button
            onClick={() => setActiveTab("records")}
            className={`relative flex-1 cursor-pointer px-4 py-2 text-left text-sm font-medium transition-all duration-200 ${
              activeTab === "records"
                ? "border-border-informative text-text-informative border-b-2"
                : "border-border-default hover:text-text-informative text-text-muted border-b-2"
            }`}
          >
            Academic Records
          </button>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === "biodata" && <BiodataTable />}
        {activeTab === "invoices" && <StudentInvoiceTable />}
        {activeTab === "records" && <StudentAcademiRecord />}
      </div>
    </div>
  );
}
