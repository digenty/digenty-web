"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowGoBack, DeleteBin, Edit, FileCopy } from "@digenty/icons";
import { EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Checkbox } from "../ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

import { ChannelLabel } from "./ChannelLabel";
import { getCampaignStatusBadge } from "./StatusBadge";
import { Campaign } from "./types";

const RowActions = ({ row }: { row: Row<Campaign> }) => {
  const router = useRouter();
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
            router.push(`/staff/communications/${row.original.id}`);
          }}
          className="hover:bg-bg-state-ghost-hover cursor-pointer gap-2.5 px-3"
        >
          <EyeIcon className="text-icon-default-subtle size-4" />
          <span>View campaign</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={evt => {
            evt.stopPropagation();
            router.push(`/staff/communications/${row.original.id}/edit`);
          }}
          className="hover:bg-bg-state-ghost-hover cursor-pointer gap-2.5 px-3"
        >
          <Edit fill="var(--color-icon-default-subtle)" className="size-4" />
          <span>Edit campaign</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:bg-bg-state-ghost-hover cursor-pointer gap-2.5 px-3">
          <FileCopy fill="var(--color-icon-default-subtle)" className="size-4" />
          <span>Duplicate</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:bg-bg-state-ghost-hover cursor-pointer gap-2.5 px-3">
          <ArrowGoBack fill="var(--color-icon-default-subtle)" className="size-4" />
          <span>Resend</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="border-border-default bg-border-default" />

        <DropdownMenuItem className="cursor-pointer gap-2.5 px-3">
          <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
          <span className="text-icon-destructive">Delete campaign</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const campaignColumns: ColumnDef<Campaign>[] = [
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
      <div className="flex items-center justify-center">
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(value: boolean) => row.toggleSelected(!!value)} aria-label="Select row" />
      </div>
    ),
    size: 26,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: () => <div className="text-text-muted text-sm font-medium">Campaign Title</div>,
    cell: ({ row }) => <span className="text-text-default text-sm font-medium">{row.original.title}</span>,
  },
  {
    accessorKey: "date",
    header: () => <div className="text-text-muted text-sm font-medium">Date</div>,
    cell: ({ row }) => <span className="text-text-muted text-sm font-normal">{row.original.date}</span>,
  },
  {
    accessorKey: "channel",
    header: () => <div className="text-text-muted text-sm font-medium">Channel</div>,
    cell: ({ row }) => <ChannelLabel channel={row.original.channel} />,
  },
  {
    accessorKey: "recipients",
    header: () => <div className="text-text-muted text-sm font-medium">Recipients</div>,
    cell: ({ row }) => <span className="text-text-default text-sm font-medium">{row.original.recipients}</span>,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-text-muted text-sm font-medium">Status</div>,
    cell: ({ row }) => getCampaignStatusBadge(row.original.status),
  },
  {
    id: "actions",
    header: () => <div className="text-text-muted text-sm font-medium" />,
    cell: ({ row }) => <RowActions row={row} />,
    size: 11,
  },
];
