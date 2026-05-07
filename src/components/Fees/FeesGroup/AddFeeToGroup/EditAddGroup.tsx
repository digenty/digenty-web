"use client";

import { DeleteBin, Draggable } from "@digenty/icons";
import { Toggle } from "@/components/Toggle";
import { FeesSheet } from "@/components/Invoices/NewInvoice/NewInvoiceItems/FeesSheet";
import { GroupFeesSheet } from "@/components/Invoices/NewInvoice/NewInvoiceItems/GroupFeesSheet";
import { NewInvoiceItemMobile } from "@/components/Invoices/NewInvoice/NewInvoiceItems/NewInvoiceMobileItem";
import { StockSheet } from "@/components/Invoices/NewInvoice/NewInvoiceItems/StockSheet";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useRouter, useParams } from "next/navigation";
import { cn, unwrapArray, extractSessionId } from "@/lib/utils";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "sonner";
import { useGetFeeGroupById, useUpdateFeeGroup } from "@/hooks/queryHooks/useFee";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useGetActiveSession } from "@/hooks/queryHooks/useAcademic";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { FeeTermType } from "@/api/fee";
import { Branch, BranchWithClassLevels } from "@/api/types";
import React, { useEffect, useState } from "react";
import { addFeesToGroupSchema } from "@/schema/fees";

function toBranches(list: unknown[]): Branch[] {
  return list
    .map(item => {
      if (item && typeof item === "object" && "branch" in item) return (item as BranchWithClassLevels).branch;
      return item as Branch;
    })
    .filter((b): b is Branch => !!b && typeof b === "object" && typeof (b as Branch).id === "number");
}

function extractBranches(data: unknown): Branch[] {
  if (!data) return [];
  if (Array.isArray(data)) return toBranches(data);
  const root = data as Record<string, unknown>;
  if (Array.isArray(root.data)) return toBranches(root.data as unknown[]);
  if (root.data && typeof root.data === "object") {
    const inner = root.data as Record<string, unknown>;
    if (Array.isArray(inner.content)) return toBranches(inner.content as unknown[]);
  }
  return [];
}

const TERM_MAP: Record<FeeTermType, string> = {
  FIRST: "First Term",
  SECOND: "Second Term",
  THIRD: "Third Term",
};

type ItemRow = {
  id: string;
  name: string;
  qty: number;
  price: number;
  required: boolean;
};

export const EditAddGroup = () => {
  const router = useRouter();
  const params = useParams();
  const groupId = params?.id ? Number(params.id) : undefined;

  const { schoolId } = useLoggedInUser();
  const { mutate: updateFeeGroup, isPending } = useUpdateFeeGroup();
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [itemsReady, setItemsReady] = useState(false);

  const { data: groupData, isLoading: isLoadingGroup } = useGetFeeGroupById(groupId);
  const { data: branchesData } = useGetBranches();
  const branches: Branch[] = extractBranches(branchesData);

  const { data: termsData } = useGetTerms(schoolId);
  const { data: activeSessionData } = useGetActiveSession();
  const sessionId = extractSessionId(activeSessionData) ?? 0;
  const rawTerms = unwrapArray<{ termId: number; term: FeeTermType }>(termsData);

  const termOptions = rawTerms.map(t => ({
    label: TERM_MAP[t.term] ?? t.term,
    sessionId,
    term: t.term,
  }));

  useBreadcrumb([
    { label: "Fees", url: "/staff/fees" },
    { label: "Fee Groups", url: "/staff/fees?tab=Fee Groups" },
    { label: groupData?.name ?? "Edit Fee Group", url: "#" },
  ]);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      branchId: "" as number | "",
      session: "" as number | "",
      term: "" as FeeTermType | "",
    },
    validationSchema: addFeesToGroupSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: values => {
      if (!groupId) return;
      updateFeeGroup(
        {
          id: groupId,
          payload: {
            name: values.name,
            description: values.description,
            session: values.session as number,
            term: values.term as FeeTermType,
            branchId: values.branchId as number,
            armIds: [],
            items: items
              .filter(i => i.name.trim())
              .map(i => ({
                itemType: "CUSTOM" as const,
                name: i.name,
                unitPrice: i.price,
                quantity: i.qty,
                optional: !i.required,
              })),
          },
        },
        {
          onSuccess: () => {
            toast.success("Fee group updated successfully");
            router.push(`/staff/fees/fee-group/${groupId}`);
          },
          onError: (err: unknown) => {
            const msg = (err as { message?: string })?.message ?? "Failed to update fee group";
            toast.error(msg);
          },
        },
      );
    },
  });

  useEffect(() => {
    if (!groupData || itemsReady) return;

    const raw = (groupData as Record<string, unknown>)?.data ?? groupData;
    const g = raw as Record<string, unknown>;

    formik.setValues({
      name: (g?.name as string) ?? "",
      description: (g?.description as string) ?? "",
      branchId: (g?.branchId as number) ?? "",
      session: ((g?.session ?? g?.sessionId) as number) ?? "",
      term: (g?.term as FeeTermType) ?? "",
    });

    type RawItem = { id?: number; itemName?: string; name?: string; quantity?: number; unitPrice?: number; optional?: boolean };
    const rawItems: ItemRow[] = ((g?.items as RawItem[]) ?? []).map(item => ({
      id: String(item.id ?? crypto.randomUUID()),
      name: item.itemName ?? item.name ?? "",
      qty: item.quantity ?? 1,
      price: item.unitPrice ?? 0,
      required: !item.optional,
    }));

    setItems(rawItems.length > 0 ? rawItems : [{ id: crypto.randomUUID(), name: "", qty: 1, price: 0, required: false }]);
    setItemsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupData]);

  const { values, errors, touched, handleChange, handleBlur, setFieldValue, handleSubmit } = formik;

  const selectedBranchObj = branches.find(b => b.id === values.branchId);
  const selectedTermObj = termOptions.find(t => t.term === values.term);

  const subtotal = items.reduce((acc, item) => acc + item.qty * item.price, 0);

  const updateItem = (id: string, data: Partial<ItemRow>) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, ...data } : i)));
  };
  const addItem = () => setItems(prev => [...prev, { id: crypto.randomUUID(), name: "", qty: 1, price: 0, required: false }]);
  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  if (isLoadingGroup) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center p-3">
      <div>
        <div className="text-text-default text-normal mb-4 text-lg font-semibold">Edit Fee Group</div>

        <div className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Fee Group Name</Label>
            <Input
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={cn("bg-bg-input-soft! text-text-muted rounded-md border-none p-2", errors.name && touched.name && "border border-red-500")}
              placeholder="Input Fee Group Name"
            />
            {touched.name && errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Description</Label>
            <Input
              id="description"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              className="bg-bg-input-soft! text-text-muted rounded-md border-none p-2"
              placeholder="Input Description"
            />
          </div>

          {/* Branch */}
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Branch</Label>
            <Select value={values.branchId ? String(values.branchId) : ""} onValueChange={val => setFieldValue("branchId", Number(val))}>
              <SelectTrigger
                className={cn("bg-bg-input-soft! h-8! w-auto border border-none", errors.branchId && touched.branchId && "border border-red-500")}
              >
                <SelectValue placeholder="Select Branch">
                  <Image src="/staff/icons/school.svg" alt="branch" width={14} height={14} />
                  <span className="text-text-default text-sm font-medium">{selectedBranchObj?.name ?? "Select Branch"}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                {branches.length === 0 && (
                  <div className="px-4 py-2">
                    <Skeleton className="h-4 w-32" />
                  </div>
                )}
                {branches.map(b => (
                  <SelectItem key={String(b.id)} value={String(b.id)} className="text-text-default text-sm font-medium">
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {touched.branchId && errors.branchId && <p className="text-xs text-red-500">{String(errors.branchId)}</p>}
          </div>

          {/* Term */}
          <div className="mb-6 flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Term</Label>
            <Select
              value={selectedTermObj?.label ?? ""}
              onValueChange={label => {
                const entry = termOptions.find(t => t.label === label);
                if (entry) {
                  setFieldValue("session", entry.sessionId);
                  setFieldValue("term", entry.term);
                }
              }}
            >
              <SelectTrigger
                className={cn("bg-bg-input-soft! h-8! w-auto border border-none", errors.term && touched.term && "border border-red-500")}
              >
                <SelectValue placeholder="Select Term">
                  <span className="text-text-default text-sm font-medium">{selectedTermObj?.label ?? "Select Term"}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                {termOptions.map(t => (
                  <SelectItem key={`${t.sessionId}-${t.term}`} value={t.label} className="text-text-default text-sm font-medium">
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {touched.term && errors.term && <p className="text-xs text-red-500">{String(errors.term)}</p>}
          </div>
        </div>

        {/* Group Items */}
        <div className="mb-6">
          <div className="text-text-default text-md mb-3 font-semibold">Group Items</div>
          <div className="hidden flex-wrap gap-1 md:flex">
            <StockSheet />
            <FeesSheet />
            <GroupFeesSheet />
          </div>
          <div className="flex md:hidden">
            <Button
              type="button"
              onClick={() => setOpenMobileDrawer(true)}
              className="hover:bg-bg-none! border-border-darker text-text-muted flex items-center gap-2 border p-0 px-3 text-sm font-normal"
            >
              Select from Stock, Fees and Fee Groups
            </Button>
            {openMobileDrawer && (
              <MobileDrawer title="Action" open={openMobileDrawer} setIsOpen={setOpenMobileDrawer}>
                <div className="flex flex-col content-center gap-2 p-4">
                  <StockSheet />
                  <FeesSheet />
                  <GroupFeesSheet />
                </div>
              </MobileDrawer>
            )}
          </div>
        </div>

        {/* Items Table (Desktop) */}
        <div className="border-border-darker mb-8 hidden w-full overflow-hidden rounded-md border md:block">
          <Table className="w-full rounded-md">
            <TableHeader className="bg-bg-input-soft text-text-muted text-xs font-medium">
              <TableRow className="border-border-default flex h-10 w-full flex-row gap-2 border-b py-3">
                <TableHead className="w-6"></TableHead>
                <TableHead className="w-full max-w-78 text-left">Item</TableHead>
                <TableHead className="w-full max-w-40 text-left">Qty</TableHead>
                <TableHead className="w-full max-w-57 text-left">Unit Price</TableHead>
                <TableHead className="w-full text-left">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="[&_tr:first-child]:pt-5">
              {items.map(item => (
                <TableRow key={item.id} className="flex w-full flex-row items-center gap-2 border-none px-4 py-2">
                  <td className="w-6 cursor-grab">
                    <Draggable fill="var(--color-icon-default-muted)" />
                  </td>
                  <td className="bg-bg-input-soft flex h-8! w-full max-w-78 items-center rounded-md">
                    <Input
                      type="text"
                      placeholder="Item Name"
                      value={item.name}
                      onChange={e => updateItem(item.id, { name: e.target.value })}
                      className="text-text-muted flex h-8! items-center border-none text-sm shadow-none"
                    />
                  </td>
                  <td className="bg-bg-input-soft h-8! w-full max-w-40 rounded-md">
                    <Input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={e => updateItem(item.id, { qty: Number(e.target.value) })}
                      className="text-text-muted h-8! rounded-md border-none text-sm shadow-none"
                    />
                  </td>
                  <td className="bg-bg-input-soft h-8! w-full max-w-57 rounded-md px-2">
                    <div className="flex items-center">
                      <span className="text-text-muted text-sm">₦</span>
                      <Input
                        type="number"
                        value={item.price}
                        onChange={e => updateItem(item.id, { price: Number(e.target.value) })}
                        className="text-text-muted h-8! border-none text-sm shadow-none"
                      />
                    </div>
                  </td>
                  <td className="flex w-full items-center justify-between gap-2">
                    <div className="bg-bg-input-soft flex h-8 w-full max-w-78 cursor-not-allowed items-center gap-2 rounded-md px-2">
                      <span className="text-text-muted text-sm">₦</span>
                      <div className="text-text-muted text-sm">{(item.qty * item.price).toLocaleString()}</div>
                    </div>
                    <div className="flex h-8! items-center pr-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={cn(
                              "border-border-default h-5 w-16 rounded-md border px-2 py-0.5 text-xs font-medium",
                              item.required ? "bg-bg-badge-fuchsia text-bg-basic-fuchsia-strong" : "text-text-subtle bg-bg-badge-default",
                            )}
                          >
                            {item.required ? "Required" : "Optional"}
                          </Badge>
                          <Toggle
                            checked={item.required}
                            onChange={e => updateItem(item.id, { required: e.target.checked })}
                            className="border-none"
                          />
                        </div>
                        <div className="bg-bg-state-soft flex size-7 cursor-pointer items-center justify-center rounded-md">
                          <DeleteBin fill="var(--color-icon-default-subtle)" onClick={() => removeItem(item.id)} className="size-4" />
                        </div>
                      </div>
                    </div>
                  </td>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between">
            <Button
              type="button"
              onClick={addItem}
              className="text-text-default bg-bg-state-ghost! hover:bg-bg-state-ghost! flex cursor-pointer items-center gap-1.5 px-4 text-sm font-medium"
            >
              <Plus className="text-icon-default-muted size-4" /> Add Item
            </Button>
            <div className="flex items-center justify-end gap-4 py-3 pr-8 pl-4 text-sm">
              <span className="text-text-subtle text-sm font-normal">Subtotal</span>
              <div className="text-text-default text-sm font-medium">₦{subtotal.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <NewInvoiceItemMobile items={items} subtotal={subtotal} onUpdateItem={updateItem} onAddItem={addItem} onRemoveItem={removeItem} />

        <div className="bg-bg-default border-border-default fixed bottom-0 left-1/2 w-full -translate-x-1/2 border-t md:max-w-250">
          <div className="bg-bg-default flex items-center justify-between px-4 py-3">
            <Button
              type="button"
              onClick={() => router.push(`/staff/fees/fee-group/${groupId}`)}
              className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! text-text-subtle h-7! rounded-md"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7! rounded-md"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
