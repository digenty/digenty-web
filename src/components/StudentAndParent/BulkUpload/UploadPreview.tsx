"use client";
import { AlertFill, Bill, CheckboxCircleFill, Download2 } from "@digenty/icons";
import { OverviewCard } from "@/components/OverviewCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ValidateUploadResponse } from "./types";

type Tab = "ready" | "failed";

const DISPLAY_COLS = 4;

const formatColLabel = (col: string) =>
  col
    .replace(/([A-Z])/g, " $1")
    .trim()
    .replace(/^./, c => c.toUpperCase());

export const UploadPreview = ({
  entity,
  validateResponse,
}: {
  entity: "Students" | "Parents";
  validateResponse: ValidateUploadResponse;
}) => {
  const { summary, validRows, invalidRows, columns } = validateResponse;
  const hasFailures = invalidRows.length > 0;
  const [activeTab, setActiveTab] = useState<Tab>(hasFailures ? "failed" : "ready");

  const displayColumns = columns.slice(0, DISPLAY_COLS);

  const downloadFailedRows = () => {
    const allColumns = [...columns, "Errors"];
    const header = allColumns.map(col => `"${col}"`).join(",");
    const csvRows = invalidRows.map(row => {
      const cells = columns.map(col => `"${String(row.data[col] ?? "").replace(/"/g, '""')}"`);
      const errorMsg = row.errors.map(e => e.message).join("; ");
      cells.push(`"${errorMsg.replace(/"/g, '""')}"`);
      return cells.join(",");
    });
    const csv = [header, ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${entity.toLowerCase()}-failed-rows.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-text-default text-lg font-semibold">Review {entity} Import</h3>
        <p className="text-text-subtle max-w-100 text-center text-xs">
          We checked every row against your school data. Here&apos;s what will happen when you import.
        </p>
      </div>

      <div className="grid w-full gap-3 sm:grid-cols-3">
        <OverviewCard
          title="Total Records"
          Icon={() => (
            <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <Bill fill="var(--color-icon-default)" className="size-2.5" />
            </div>
          )}
          value={summary.total.toString()}
        />
        <OverviewCard
          title="Ready to Import"
          Icon={() => (
            <div className="bg-bg-basic-green-subtle border-bg-basic-green-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <CheckboxCircleFill fill="var(--color-icon-default)" className="size-2.5" />
            </div>
          )}
          value={summary.valid.toString()}
        />
        <OverviewCard
          title="Will Fail"
          Icon={() => (
            <div className="bg-bg-basic-red-subtle border-bg-basic-red-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <AlertFill fill="var(--color-icon-default)" className="size-2.5" />
            </div>
          )}
          value={summary.invalid.toString()}
          className="col-span-2 sm:col-span-1"
        />
      </div>

      {hasFailures && (
        <div className="bg-bg-basic-orange-subtle border-border-default shadow-light flex w-full items-center gap-2.5 rounded-md border px-3 py-2.5">
          <AlertFill fill="var(--color-bg-basic-orange-accent)" className="size-6 shrink-0" />
          <p className="text-text-subtle text-sm">
            {summary.invalid} {summary.invalid === 1 ? "row" : "rows"} will not be imported. Download them, fix the errors, and re-upload.
          </p>
        </div>
      )}

      <div className="border-border-default w-full overflow-hidden rounded-md border">
        {/* Tabs */}
        <div className="border-border-default flex border-b">
          <button
            onClick={() => setActiveTab("ready")}
            className={cn(
              "px-4 py-3 text-sm font-medium transition-colors",
              activeTab === "ready"
                ? "border-b-2 border-[var(--color-text-informative)] text-[var(--color-text-informative)]"
                : "text-text-subtle hover:text-text-default",
            )}
          >
            Ready to import ({summary.valid})
          </button>
          <button
            onClick={() => setActiveTab("failed")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === "failed"
                ? "border-b-2 border-[var(--color-text-destructive)] text-[var(--color-text-destructive)]"
                : "text-text-subtle hover:text-text-default",
            )}
          >
            Will fail ({summary.invalid})
            {hasFailures && (
              <span className="bg-bg-basic-red-subtle text-text-destructive rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none">
                {summary.invalid}
              </span>
            )}
          </button>
        </div>

        {/* Tab content */}
        <div className="max-h-80 overflow-auto">
          {activeTab === "ready" ? (
            validRows.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 p-8">
                <p className="text-text-subtle text-sm">No valid rows found. Fix the errors and re-upload.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0">
                  <tr className="border-border-default border-b bg-bg-state-secondary">
                    <th className="text-text-subtle px-3 py-2 text-left text-xs font-medium">Row</th>
                    {displayColumns.map(col => (
                      <th key={col} className="text-text-subtle px-3 py-2 text-left text-xs font-medium">
                        {formatColLabel(col)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {validRows.map(row => (
                    <tr key={row.rowNumber} className="border-border-default border-b last:border-0">
                      <td className="text-text-subtle px-3 py-2.5 text-xs">{row.rowNumber}</td>
                      {displayColumns.map(col => (
                        <td key={col} className="text-text-default px-3 py-2.5 text-xs">
                          {String(row.data[col] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : invalidRows.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 p-8">
              <CheckboxCircleFill fill="var(--color-icon-success)" className="size-6" />
              <p className="text-text-subtle text-sm">All rows are ready to import.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0">
                <tr className="border-border-default border-b bg-bg-state-secondary">
                  <th className="text-text-subtle px-3 py-2 text-left text-xs font-medium">Row</th>
                  {displayColumns.map(col => (
                    <th key={col} className="text-text-subtle px-3 py-2 text-left text-xs font-medium">
                      {formatColLabel(col)}
                    </th>
                  ))}
                  <th className="text-text-subtle px-3 py-2 text-left text-xs font-medium">Reason</th>
                </tr>
              </thead>
              <tbody>
                {invalidRows.map(row => (
                  <tr key={row.rowNumber} className="border-border-default border-b last:border-0">
                    <td className="text-text-subtle px-3 py-2.5 text-xs">{row.rowNumber}</td>
                    {displayColumns.map(col => (
                      <td key={col} className="text-text-default px-3 py-2.5 text-xs">
                        {String(row.data[col] ?? "")}
                      </td>
                    ))}
                    <td className="px-3 py-2.5">
                      <ul className="space-y-0.5">
                        {row.errors.map((err, i) => (
                          <li key={i} className="text-text-destructive text-xs">
                            {err.message}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Download button anchored to bottom of failed tab */}
        {activeTab === "failed" && hasFailures && (
          <div className="border-border-default border-t px-4 py-3">
            <Button
              onClick={downloadFailedRows}
              className="bg-bg-state-secondary border-border-darker text-text-default rounded-md border text-sm font-medium"
            >
              <Download2 fill="var(--color-icon-default-muted)" />
              Download failed rows (CSV)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
