"use client";

import Link from "next/link";

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Required columns",
    body: "Title, Amount, Date and Payment Method must be filled in on every row. Category, Description, Recurring and Recurring Interval are optional.",
  },
  {
    title: "Amount",
    body: "A positive number in naira, e.g. 45000 or 45,000.50. Do not include the ₦ sign.",
  },
  {
    title: "Date",
    body: "Use YYYY-MM-DD (2026-09-15) or day first, DD/MM/YYYY (15/09/2026). Dates that don't exist, like 31/02/2026, are rejected rather than adjusted.",
  },
  {
    title: "Payment Method",
    body: "Cash, POS, Cheque, Bank Transfer, Bank Transfer Terminal or Online. Case and spacing are ignored.",
  },
  {
    title: "Category",
    body: (
      <>
        Must match a category that already exists, as listed under{" "}
        <Link href="/staff/expense/expense-categories" className="text-text-informative font-medium">
          Expense Categories
        </Link>
        . Leave it blank to import the expense without a category.
      </>
    ),
  },
  {
    title: "Recurring",
    body: "Yes or No (blank means No). When Recurring is Yes, Recurring Interval is required: Daily, Weekly, Monthly, Quarterly or Yearly.",
  },
  {
    title: "Branch and receipts",
    body: "Every row in the file is recorded against the branch you pick on the next step. Receipts can't be attached through the file — open the expense afterwards to add one.",
  },
  {
    title: "Column headings",
    body: "Do not rename the headings in row 1. Column order does not matter. An unrecognised heading is rejected so nothing is silently dropped.",
  },
];

export const ExpenseUploadInstructions = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-text-default text-lg font-semibold">Bulk expense import</h3>
        <p className="text-text-subtle max-w-100 text-center text-xs">Read this before you upload.</p>
      </div>

      <div className="border-border-darker w-full space-y-4 rounded-md border p-6">
        <p className="text-text-subtle text-sm">
          Fill in the template, one expense per row, then upload it. Delete the two example rows before uploading — they are only there to show the
          format.
        </p>
        <p className="text-text-subtle text-sm">
          The file is checked before anything is saved. You get a per-row report of any problems, and nothing is imported until you confirm.
        </p>
      </div>

      <div className="border-border-darker w-full rounded-md border">
        {SECTIONS.map(section => (
          <div key={section.title} className="border-border-default space-y-1.5 border-b p-6 last:border-0">
            <h4 className="text-text-default text-sm font-semibold">{section.title}</h4>
            <p className="text-text-subtle text-sm">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
