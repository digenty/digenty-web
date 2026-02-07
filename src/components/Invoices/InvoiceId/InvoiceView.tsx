"use client";
import { Avatar } from "@/components/Avatar";
import { getBadge } from "@/components/StudentProfile/StudentTable/StudentInvoiceTable";

const invoice = [
  {
    id: 0,
    status: "Outstanding",
    issuedDate: "18/05/2007",
    dueDate: "18/06/2007",
    issueTo: "Damilare John",
    termSection: "24/25 Third Term",
    branch: "Lawanson",
    lastUpdated: "18/05/2007",
    lastUpdatedBy: "Damilare John",
  },
];

export const InvoiceView = () => {
  return (
    <div>
      {invoice.map(inv => (
        <div key={inv.id} className="grid grid-cols-2 md:grid-cols-4">
          <div className="border-border-default rounded-tl-1 flex h-26 flex-col justify-center gap-4 border border-b-0 p-4 md:border-b md:p-8">
            <div className="text-text-muted text-xs font-medium">Status</div>
            <p className={`text-text-default text-md font-medium`}> {getBadge(inv.status)} </p>
          </div>
          <div className="border-border-default flex h-26 flex-col justify-center gap-4 border border-b-0 border-l-0 p-4 md:border-b md:p-8">
            <div className="text-text-muted text-xs font-medium">Issued Date</div>
            <p className="text-text-default text-md font-medium"> {inv.issuedDate}</p>
          </div>

          <div className="border-border-default flex h-26 flex-col gap-4 border p-4 md:border-l-0 md:p-8">
            <div className="text-text-muted text-xs font-medium">Due Date</div>
            <p className="text-text-default text-md font-medium">{inv.dueDate}</p>
          </div>

          <div className="border-border-default flex h-26 flex-col justify-center gap-4 border border-l-0 p-4 md:p-8">
            <div className="text-text-muted text-xs font-medium">Issued To</div>
            <p className="text-text-default text-md flex items-center gap-1 text-sm font-medium">
              <Avatar className="size-5" />
              {inv.issueTo}
            </p>
          </div>

          <div className="border-border-default flex h-26 flex-col justify-center gap-4 border border-t-0 p-4 md:p-8">
            <div className="text-text-muted text-xs font-medium">Term & Session</div>
            <p className="text-text-default text-md font-medium">{inv.termSection}</p>
          </div>
          <div className="border-border-default flex h-26 flex-col justify-center gap-4 border border-t-0 border-l-0 p-4 md:p-8">
            <div className="text-text-muted text-xs font-medium">Branch</div> <p className="text-text-default text-md font-medium">{inv.branch}</p>
          </div>
          <div className="border-border-default flex h-26 flex-col justify-center gap-4 border border-t-0 p-4 md:border-l-0 md:p-8">
            <div className="text-text-muted text-xs font-medium">Last Updated</div>{" "}
            <p className="text-text-default text-md font-medium">{inv.lastUpdated}</p>
          </div>
          <div className="border-border-default flex h-26 flex-col justify-center gap-4 border border-t-0 border-l-0 p-4 md:p-8">
            <div className="text-text-muted text-xs font-medium">Last Updated By </div>
            <p className="text-text-default text-md flex items-center gap-1 text-sm font-medium">
              <Avatar className="size-5" />
              {inv.lastUpdatedBy}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
