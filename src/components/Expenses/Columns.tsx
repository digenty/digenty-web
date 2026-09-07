import { DeleteBin, Edit, ExpandUpAndDown } from "@digenty/icons";
import { ColumnDef, Row } from "@tanstack/react-table";
import { EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Avatar } from "../Avatar";
import { payMethod } from "../Invoices/paymentMethods";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import {
  expenseAddedByOf,
  expenseBranchNameOf,
  expenseCategoryNameOf,
  ExpenseListItem,
  expenseTitleOf,
  formatExpenseDate,
  formatNaira,
} from "./types";

/**
 * The design gives each category its own badge hue (Power lime, Logistics purple, …).
 * Categories are user-created, so the hue is derived from the name — stable per category,
 * and it stays stable when categories are added or reordered.
 */
const CATEGORY_BADGE_COLORS = [
  "bg-bg-badge-lime text-bg-basic-lime-strong",
  "bg-bg-badge-purple text-bg-basic-purple-strong",
  "bg-bg-badge-sky text-bg-basic-sky-strong",
  "bg-bg-badge-amber text-bg-basic-amber-strong",
  "bg-bg-badge-teal text-bg-basic-teal-strong",
  "bg-bg-badge-rose text-bg-basic-rose-strong",
  "bg-bg-badge-indigo text-bg-basic-indigo-strong",
  "bg-bg-badge-emerald text-bg-basic-emerald-strong",
];

export const categoryBadgeColor = (name: string) => {
  let hash = 0;
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash * 31 + name.charCodeAt(index)) % 100000;
  }
  return CATEGORY_BADGE_COLORS[hash % CATEGORY_BADGE_COLORS.length];
};

export const ExpenseCategoryBadge = ({ name }: { name?: string | null }) =>
  name ? <Badge className={cn("border-border-default w-fit rounded-md border text-xs font-medium", categoryBadgeColor(name))}>{name}</Badge> : null;

export const PaymentMethodCell = ({ method }: { method?: ExpenseListItem["paymentMethod"] }) => {
  const entry = payMethod.find(option => option.value === method);
  if (!entry) return <span className="text-text-muted text-sm">-</span>;
  const Icon = entry.icon;
  return (
    <span className="flex items-center gap-1.5">
      <Icon fill="var(--color-icon-default-muted)" className="size-4 shrink-0" />
      <span className="text-text-default truncate text-sm font-normal">{entry.label}</span>
    </span>
  );
};

const RenderOptions = ({
  row,
  onView,
  onEdit,
  onDelete,
}: {
  row: Row<ExpenseListItem>;
  onView?: (row: Row<ExpenseListItem>) => void;
  onEdit?: (row: Row<ExpenseListItem>) => void;
  onDelete?: (row: Row<ExpenseListItem>) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger onClick={evt => evt.stopPropagation()} className="focus-visible:ring-0 focus-visible:outline-none">
        <MoreHorizontalIcon className="text-icon-default-muted size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-bg-card border-border-default text-text-default py-2.5 shadow-sm">
        <DropdownMenuItem
          onClick={evt => {
            evt.stopPropagation();
            onView?.(row);
          }}
          className="hover:bg-bg-state-ghost-hover! cursor-pointer gap-2.5 px-3"
        >
          <EyeIcon className="text-icon-default-subtle size-4" />
          <span>View expense</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={evt => {
            evt.stopPropagation();
            onEdit?.(row);
          }}
          className="hover:bg-bg-state-ghost-hover! cursor-pointer gap-2.5 px-3"
        >
          <Edit fill="var(--color-icon-default-subtle)" className="size-4" />
          <span>Edit expense</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="border-border-default bg-border-default" />

        <DropdownMenuItem
          onClick={evt => {
            evt.stopPropagation();
            onDelete?.(row);
          }}
          className="cursor-pointer gap-2.5 px-3"
        >
          <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
          <span className="text-icon-destructive">Delete expense</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const buildExpensesOverviewTableColumns = ({
  onView,
  onEdit,
  onDelete,
  showCategory = true,
  showBranch = true,
}: {
  onView?: (row: Row<ExpenseListItem>) => void;
  onEdit?: (row: Row<ExpenseListItem>) => void;
  onDelete?: (row: Row<ExpenseListItem>) => void;
  showCategory?: boolean;
  showBranch?: boolean;
}): ColumnDef<ExpenseListItem>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()}
          onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center" onClick={evt => evt.stopPropagation()}>
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(value: boolean) => row.toggleSelected(!!value)} aria-label="Select row" />
      </div>
    ),
    size: 26,
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "title",
    header: () => <div className="text-text-muted text-sm font-medium">Expense Title</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer truncate text-sm font-medium">{expenseTitleOf(row.original)}</span>,
    size: 300,
  },

  ...(showCategory
    ? [
        {
          id: "category",
          header: () => <div></div>,
          cell: ({ row }: { row: Row<ExpenseListItem> }) => <ExpenseCategoryBadge name={expenseCategoryNameOf(row.original)} />,
          size: 152,
        } satisfies ColumnDef<ExpenseListItem>,
      ]
    : []),

  {
    accessorKey: "date",
    header: () => (
      <div className="text-text-muted flex items-center gap-1.5 text-sm font-medium">
        Date <ExpandUpAndDown fill="var(--color-icon-default-muted)" />
      </div>
    ),
    cell: ({ row }) => <span className="text-text-muted text-sm font-normal">{formatExpenseDate(row.original.date)}</span>,
    size: 106,
  },

  {
    accessorKey: "amount",
    header: () => (
      <div className="text-text-muted flex items-center gap-1.5 text-sm font-medium">
        Amount <ExpandUpAndDown fill="var(--color-icon-default-muted)" />
      </div>
    ),
    cell: ({ row }) => <span className="text-text-default text-sm font-medium">{formatNaira(row.original.amount)}</span>,
    size: 105,
  },

  {
    accessorKey: "paymentMethod",
    header: () => (
      <div className="text-text-muted flex items-center gap-1.5 text-sm font-medium">
        Payment Method <ExpandUpAndDown fill="var(--color-icon-default-muted)" />
      </div>
    ),
    cell: ({ row }) => <PaymentMethodCell method={row.original.paymentMethod} />,
    size: 220,
  },

  {
    id: "addedBy",
    header: () => (
      <div className="text-text-muted flex items-center gap-1.5 text-sm font-medium">
        Added By <ExpandUpAndDown fill="var(--color-icon-default-muted)" />
      </div>
    ),
    cell: ({ row }) => {
      const addedBy = expenseAddedByOf(row.original);
      return (
        <div className="flex items-center gap-1.5">
          <Avatar url={addedBy.imagePath} className="size-5" />
          <span className="text-text-default truncate text-sm font-normal">{addedBy.name || "-"}</span>
        </div>
      );
    },
    size: 149,
  },

  ...(showBranch
    ? [
        {
          id: "branch",
          header: () => <div className="text-text-muted text-sm font-medium">Branch</div>,
          cell: ({ row }: { row: Row<ExpenseListItem> }) => (
            <span className="text-text-muted truncate text-sm font-normal">{expenseBranchNameOf(row.original) || "-"}</span>
          ),
          size: 133,
        } satisfies ColumnDef<ExpenseListItem>,
      ]
    : []),

  {
    id: "actions",
    header: () => <div></div>,
    cell: ({ row }) => <RenderOptions row={row} onView={onView} onEdit={onEdit} onDelete={onDelete} />,
    size: 44,
  },
];
