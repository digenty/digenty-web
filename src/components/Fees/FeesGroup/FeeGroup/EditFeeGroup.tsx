"use client";

import { DeleteBin, Draggable } from "@digenty/icons";
import { FeesSheet } from "@/components/Invoices/NewInvoice/NewInvoiceItems/FeesSheet";
import { GroupFeesSheet } from "@/components/Invoices/NewInvoice/NewInvoiceItems/GroupFeesSheet";
import type { InvoiceItem } from "@/components/Invoices/NewInvoice/NewInvoiceItems/NewInvoiceMobileItem";
import { NewInvoiceItemMobile } from "@/components/Invoices/NewInvoice/NewInvoiceItems/NewInvoiceMobileItem";
import { StockSheet } from "@/components/Invoices/NewInvoice/NewInvoiceItems/StockSheet";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Formik, Form } from "formik";
import { toast } from "sonner";
import { addFeesToGroupSchema } from "@/schema/fees";
import { useGetFeeGroupById, useUpdateFeeGroup } from "@/hooks/queryHooks/useFee";
import { useFeeFormData } from "@/components/Fees/AddFee/useFeeForm";
import type { FeeGroupDto, FeeTermType } from "@/api/fee";

interface ItemRow {
  id: string;
  name: string;
  qty: number;
  price: number;
  required: boolean;
}

interface FeeGroupFormValues {
  name: string;
  description: string;
  branchId: number | "";
  sessionId: number | "";
  term: FeeTermType | "";
  items: ItemRow[];
}

export const EditFeeGroup = () => {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);

  const { data: group, isPending: loadingGroup } = useGetFeeGroupById(id);
  const { branchList, termList, sessionName, sessionId } = useFeeFormData();
  const { mutate: updateFeeGroup, isPending } = useUpdateFeeGroup();

  useBreadcrumb([
    { label: "Fees", url: "/staff/fees" },
    { label: "Fee Groups", url: "/staff/fees?tab=Fee Groups" },
    { label: group?.name ?? "Fee Group", url: `/staff/fees/fee-group/${id}` },
    { label: "Edit", url: `/staff/fees/fee-group/${id}/edit` },
  ]);

  const initialValues: FeeGroupFormValues = useMemo(() => {
    if (!group) {
      return {
        name: "",
        description: "",
        branchId: "",
        sessionId: sessionId ?? "",
        term: "",
        items: [{ id: crypto.randomUUID(), name: "", qty: 1, price: 0, required: false }],
      };
    }
    return {
      name: group.name,
      description: group.description ?? "",
      branchId: group.branchId,
      sessionId: sessionId ?? "",
      term: (termList.find(t => t.termId === group.termId)?.term as FeeTermType | undefined) ?? "",
      items:
        group.items.length > 0
          ? group.items.map(itm => ({
              id: String(itm.id),
              name: itm.itemName,
              qty: itm.quantity,
              price: itm.unitPrice,
              required: !itm.optional,
            }))
          : [{ id: crypto.randomUUID(), name: "", qty: 1, price: 0, required: false }],
    };
  }, [group, sessionId, termList]);

  if (loadingGroup) {
    return (
      <div className="mx-auto flex w-full max-w-250 flex-col gap-4 px-4 py-4 md:px-8">
        <Skeleton className="bg-bg-input-soft h-8 w-56" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="bg-bg-input-soft h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={addFeesToGroupSchema}
      onSubmit={values => {
        const payload: FeeGroupDto = {
          name: values.name.trim(),
          description: values.description.trim() || undefined,
          session: Number(values.sessionId),
          term: values.term as FeeTermType,
          branchId: Number(values.branchId),
          armIds: [],
          items: values.items.map(i => ({
            itemType: "CUSTOM" as const,
            name: i.name.trim(),
            unitPrice: i.price,
            quantity: i.qty,
            optional: !i.required,
          })),
        };

        updateFeeGroup(
          { id, payload },
          {
            onSuccess: () => {
              toast.success("Fee group updated successfully");
              router.push(`/staff/fees/fee-group/${id}`);
            },
            onError: (error: unknown) => {
              toast.error((error as { message?: string })?.message ?? "Failed to update fee group");
            },
          },
        );
      }}
    >
      {({ values, errors, touched, setFieldValue, handleChange, handleBlur }) => {
        const subtotal = values.items.reduce((acc, item) => acc + item.qty * item.price, 0);

        const updateItem = (itemId: string, data: Partial<ItemRow>) =>
          setFieldValue(
            "items",
            values.items.map(i => (i.id === itemId ? { ...i, ...data } : i)),
          );
        const addItem = () => setFieldValue("items", [...values.items, { id: crypto.randomUUID(), name: "", qty: 1, price: 0, required: false }]);
        const removeItem = (itemId: string) =>
          setFieldValue(
            "items",
            values.items.filter(i => i.id !== itemId),
          );
        const addItems = (incoming: InvoiceItem[]) =>
          setFieldValue("items", [
            ...values.items.filter(i => i.name.trim() !== "" || i.price > 0),
            ...incoming.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price, required: i.required })),
          ]);

        const branchId = typeof values.branchId === "number" ? values.branchId : undefined;
        const itemsError = typeof errors.items === "string" ? errors.items : undefined;

        return (
          <Form className="flex items-center justify-center p-3">
            <div>
              <div>
                <div className="text-text-default text-normal mb-4 text-lg font-semibold">Edit Fee Group</div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">Fee Name</Label>
                    <Input
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="bg-bg-input-soft! text-text-default rounded-md border-none p-2"
                      placeholder="Input Fee Name"
                    />
                    {touched.name && errors.name && <span className="text-text-destructive text-xs">{errors.name}</span>}
                  </div>
                  <div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-text-default text-sm font-medium">Description</Label>
                      <Input
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="bg-bg-input-soft! text-text-default rounded-md border-none p-2"
                        placeholder="Input Description"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 md:flex-row">
                    <div className="flex w-full flex-col gap-2">
                      <Label className="text-text-default text-sm font-medium">Branch</Label>
                      <Select
                        value={values.branchId ? String(values.branchId) : ""}
                        onValueChange={value => setFieldValue("branchId", Number(value))}
                      >
                        <SelectTrigger className="bg-bg-input-soft! h-8! w-full rounded-md border-none">
                          <SelectValue placeholder="Select Branch">
                            <span className="text-text-default text-sm font-medium">
                              {branchList.find(b => b.id === values.branchId)?.name ?? "Select Branch"}
                            </span>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-bg-card border-border-default">
                          {branchList.map(branch => (
                            <SelectItem key={branch.id} value={String(branch.id)} className="text-text-default text-sm font-medium">
                              {branch.name ?? `Branch ${branch.id}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {touched.branchId && errors.branchId && <span className="text-text-destructive text-xs">{errors.branchId}</span>}
                    </div>

                    <div className="flex w-full flex-col gap-2">
                      <Label className="text-text-default text-sm font-medium">Session</Label>
                      <Select value={sessionId ? String(sessionId) : ""} onValueChange={value => setFieldValue("sessionId", Number(value))}>
                        <SelectTrigger className="bg-bg-input-soft! h-8! w-full rounded-md border-none">
                          <SelectValue placeholder="Select session">
                            <span className="text-text-muted text-sm font-normal">{sessionName || "Select session"}</span>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-bg-card border-border-default">
                          {sessionId && (
                            <SelectItem value={String(sessionId)} className="text-text-default text-sm font-normal">
                              {sessionName || `Session ${sessionId}`}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {touched.sessionId && errors.sessionId && <span className="text-text-destructive text-xs">{errors.sessionId}</span>}
                    </div>

                    <div className="flex w-full flex-col gap-2">
                      <Label className="text-text-default text-sm font-medium">Term</Label>
                      <Select value={values.term} onValueChange={value => setFieldValue("term", value as FeeTermType)}>
                        <SelectTrigger className="bg-bg-input-soft! h-8! w-full rounded-md border-none">
                          <SelectValue placeholder="Select term">
                            <span className="text-text-muted text-sm font-normal capitalize">
                              {values.term ? values.term.toLowerCase() : "Select term"}
                            </span>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-bg-card border-border-default">
                          {termList.map(t => (
                            <SelectItem key={t.termId} value={t.term} className="text-text-default text-sm font-normal capitalize">
                              {t.term.toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {touched.term && errors.term && <span className="text-text-destructive text-xs">{errors.term}</span>}
                    </div>
                  </div>
                </div>

                <div className="mt-6 mb-6">
                  <div className="text-text-default text-md mb-3 font-semibold">Group Items</div>
                  <div className="hidden flex-wrap gap-1 md:flex">
                    <StockSheet branchId={branchId} onAddItems={addItems} />
                    <FeesSheet branchId={branchId} onAddItems={addItems} />
                    <GroupFeesSheet branchId={branchId} onAddItems={addItems} />
                  </div>
                  <div className="flex md:hidden">
                    <Button
                      type="button"
                      onClick={() => setOpenMobileDrawer(true)}
                      className="hover:bg-bg-none! border-border-darker text-text-muted flex items-center gap-2 border p-0 px-3 text-sm font-normal"
                    >
                      <span>Select from Stock, Fees and Fee Groups</span>
                    </Button>

                    {openMobileDrawer && (
                      <MobileDrawer title="Action" open={openMobileDrawer} setIsOpen={setOpenMobileDrawer}>
                        <div className="flex flex-col content-center gap-2 p-4">
                          <StockSheet branchId={branchId} onAddItems={addItems} />
                          <FeesSheet branchId={branchId} onAddItems={addItems} />
                          <GroupFeesSheet branchId={branchId} onAddItems={addItems} />
                        </div>
                      </MobileDrawer>
                    )}
                  </div>
                  {itemsError && <span className="text-text-destructive mt-2 block text-xs">{itemsError}</span>}
                </div>

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
                      {values.items.map(item => (
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
                              className="text-text-default flex h-8! items-center border-none text-sm shadow-none"
                            />
                          </td>

                          <td className="bg-bg-input-soft h-8! w-full max-w-40 rounded-md">
                            <Input
                              type="number"
                              min={1}
                              value={item.qty}
                              onChange={e => updateItem(item.id, { qty: Number(e.target.value) })}
                              className="text-text-default h-8! rounded-md border-none text-sm shadow-none"
                            />
                          </td>

                          <td className="bg-bg-input-soft h-8! w-full max-w-57 rounded-md px-2">
                            <div className="flex items-center">
                              <span className="text-text-muted text-sm">₦</span>
                              <Input
                                type="number"
                                value={item.price}
                                onChange={e => updateItem(item.id, { price: Number(e.target.value) })}
                                className="text-text-default h-8! border-none text-sm shadow-none"
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
                                <button type="button" onClick={() => updateItem(item.id, { required: !item.required })}>
                                  <Badge
                                    className={cn(
                                      "border-border-default h-5 w-16 cursor-pointer rounded-md border px-2 py-0.5 text-xs font-medium",
                                      item.required ? "bg-bg-badge-fuchsia text-bg-basic-fuchsia-strong" : "text-text-subtle bg-bg-badge-default",
                                    )}
                                  >
                                    {item.required ? "Required" : "Optional"}
                                  </Badge>
                                </button>

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
              </div>

              <NewInvoiceItemMobile
                items={values.items}
                subtotal={subtotal}
                onUpdateItem={updateItem}
                onAddItem={addItem}
                onRemoveItem={removeItem}
              />

              <div className="bg-bg-default border-border-default fixed bottom-0 left-1/2 w-full -translate-x-1/2 border-t md:max-w-250">
                <div className="bg-bg-default flex items-center justify-between px-4 py-3">
                  <Button
                    type="button"
                    onClick={() => router.push(`/staff/fees/fee-group/${id}`)}
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
          </Form>
        );
      }}
    </Formik>
  );
};
