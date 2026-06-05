"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowGoBack, DeleteBin, Edit, FileCopy } from "@digenty/icons";
import { EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { CampaignResponseDto } from "@/api/campaign";
import { toast } from "@/components/Toast";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";

import { Checkbox } from "../ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

import { ChannelLabel } from "./ChannelLabel";
import { DeleteCampaignModal } from "./DeleteCampaignModal";
import { getCampaignStatusBadge } from "./StatusBadge";
import { extractPaymentUrl, formatCampaignDate } from "./types";
import { useDeleteCampaign, useDuplicateCampaign, useResendCampaign } from "@/hooks/queryHooks/useCampaign";

const RowActions = ({ row }: { row: Row<CampaignResponseDto> }) => {
  const router = useRouter();
  const user = useLoggedInUser();
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const id = row.original.id;
  const deleteMutation = useDeleteCampaign();
  const duplicateMutation = useDuplicateCampaign();
  const resendMutation = useResendCampaign();

  const handleDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast({ title: "Campaign deleted", description: row.original.title, type: "success" });
        setDeleteOpen(false);
      },
      onError: (error: unknown) => {
        toast({ title: "Failed to delete campaign", description: (error as { message?: string })?.message ?? "Please try again.", type: "error" });
      },
    });
  };

  const handleDuplicate = () => {
    duplicateMutation.mutate(id, {
      onSuccess: () => toast({ title: "Campaign duplicated", description: row.original.title, type: "success" }),
      onError: (error: unknown) =>
        toast({ title: "Failed to duplicate campaign", description: (error as { message?: string })?.message ?? "Please try again.", type: "error" }),
    });
  };

  const handleResend = () => {
    resendMutation.mutate(
      { id, payload: { email: user.email ?? "", callbackUrl: `${window.location.origin}/staff/communications` } },
      {
        onSuccess: response => {
          const url = extractPaymentUrl(response);
          if (url) {
            window.location.href = url;
            return;
          }
          toast({ title: "Campaign resent", description: row.original.title, type: "success" });
        },
        onError: (error: unknown) =>
          toast({ title: "Failed to resend campaign", description: (error as { message?: string })?.message ?? "Please try again.", type: "error" }),
      },
    );
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger onClick={evt => evt.stopPropagation()} className="focus-visible:ring-0 focus-visible:outline-none">
          <MoreHorizontalIcon className="text-icon-default-muted size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-bg-card border-border-default text-text-default py-2.5 shadow-sm">
          <DropdownMenuItem
            onClick={evt => {
              evt.stopPropagation();
              router.push(`/staff/communications/${id}`);
            }}
            className="hover:bg-bg-state-ghost-hover cursor-pointer gap-2.5 px-3"
          >
            <EyeIcon className="text-icon-default-subtle size-4" />
            <span>View campaign</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={evt => {
              evt.stopPropagation();
              router.push(`/staff/communications/${id}/edit`);
            }}
            className="hover:bg-bg-state-ghost-hover cursor-pointer gap-2.5 px-3"
          >
            <Edit fill="var(--color-icon-default-subtle)" className="size-4" />
            <span>Edit campaign</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={evt => {
              evt.stopPropagation();
              setOpen(false);
              handleDuplicate();
            }}
            className="hover:bg-bg-state-ghost-hover cursor-pointer gap-2.5 px-3"
          >
            <FileCopy fill="var(--color-icon-default-subtle)" className="size-4" />
            <span>Duplicate</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={evt => {
              evt.stopPropagation();
              setOpen(false);
              handleResend();
            }}
            className="hover:bg-bg-state-ghost-hover cursor-pointer gap-2.5 px-3"
          >
            <ArrowGoBack fill="var(--color-icon-default-subtle)" className="size-4" />
            <span>Resend</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="border-border-default bg-border-default" />

          <DropdownMenuItem
            onClick={evt => {
              evt.stopPropagation();
              setOpen(false);
              setDeleteOpen(true);
            }}
            className="cursor-pointer gap-2.5 px-3"
          >
            <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
            <span className="text-icon-destructive">Delete campaign</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteCampaignModal open={deleteOpen} setOpen={setDeleteOpen} onDelete={handleDelete} loading={deleteMutation.isPending} />
    </>
  );
};

export const campaignColumns: ColumnDef<CampaignResponseDto>[] = [
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
    accessorKey: "createdAt",
    header: () => <div className="text-text-muted text-sm font-medium">Date</div>,
    cell: ({ row }) => <span className="text-text-muted text-sm font-normal">{formatCampaignDate(row.original.createdAt)}</span>,
  },
  {
    accessorKey: "channel",
    header: () => <div className="text-text-muted text-sm font-medium">Channel</div>,
    cell: ({ row }) => <ChannelLabel channel={row.original.channel} />,
  },
  {
    accessorKey: "intendedRecipientCount",
    header: () => <div className="text-text-muted text-sm font-medium">Recipients</div>,
    cell: ({ row }) => <span className="text-text-default text-sm font-medium">{row.original.intendedRecipientCount}</span>,
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
