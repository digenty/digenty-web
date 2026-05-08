"use client";

import { AddFill, DownloadT } from "@digenty/icons";
import { useFormik } from "formik";
import { Minus } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useMemo, useState } from "react";

import { CreateStockDto, EditStockDto } from "@/api/stock";
import { BranchWithClassLevels } from "@/api/types";
import { uploadImage } from "@/app/actions/upload-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useCreateStock, useEditStock, useGetStockById, useGetStockCategories, useGetStockUnits } from "@/hooks/queryHooks/useStock";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { cn } from "@/lib/utils";
import { editStockSchema, stockSchema } from "@/schema/stock";
import { toast } from "@/components/Toast";

type StockUnit = { id: number; name: string; description?: string };
type StockCategory = { id: number; name: string };
type FormValues = CreateStockDto & { stockId?: number };

export const AddStock = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stockId = searchParams.get("id") ? Number(searchParams.get("id")) : undefined;
  const isEdit = !!stockId;

  const user = useLoggedInUser();

  const { data: existingRaw, isLoading: loadingExisting } = useGetStockById(stockId);
  const existing = useMemo(() => {
    if (!existingRaw || typeof existingRaw !== "object") return null;
    const r = existingRaw as { data?: object } & object;
    return ("data" in r && r.data && typeof r.data === "object" && "id" in r.data ? r.data : r) as Record<string, unknown>;
  }, [existingRaw]);

  const { data: branchesResp } = useGetBranches();
  const branches = ((branchesResp?.data ?? []) as BranchWithClassLevels[]).map(b => b.branch);

  const { data: categoriesResp } = useGetStockCategories(0, 100);
  const categories: StockCategory[] = categoriesResp?.content ?? categoriesResp?.data?.content ?? categoriesResp?.data ?? [];

  const { data: unitsResp } = useGetStockUnits(0, 100);
  const units: StockUnit[] = unitsResp?.content ?? unitsResp?.data?.content ?? unitsResp?.data ?? [];

  const { mutateAsync: createStock, isPending: creating } = useCreateStock();
  const { mutateAsync: editStock, isPending: editing } = useEditStock();
  const isPending = creating || editing;

  const [uploading, setUploading] = useState(false);

  const formik = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues: {
      stockId: isEdit ? stockId : undefined,
      name: (existing?.name ?? existing?.itemName ?? "") as string,
      description: (existing?.description ?? "") as string,
      categoryId: ((existing?.categoryId ?? (existing?.category as { id?: number } | null)?.id ?? 0) as number),
      imagePath: (existing?.imagePath ?? existing?.image ?? "") as string,
      stockUnitId: ((existing?.stockUnitId ?? (existing?.unit as { id?: number } | null)?.id ?? 0) as number),
      quantity: ((existing?.quantity ?? (isEdit ? 0 : 1)) as number),
      price: ((existing?.price ?? 0) as number),
      costPrice: ((existing?.costPrice ?? 0) as number),
      branchId: ((existing?.branchId ?? user.branchIds?.[0] ?? 0) as number),
    },
    validationSchema: isEdit ? editStockSchema : stockSchema,
    onSubmit: async values => {
      try {
        if (isEdit) {
          const { branchId: _b, ...rest } = values;
          void _b;
          await editStock(rest as EditStockDto);
          toast({ title: "Stock updated successfully", type: "success" });
          router.push(`/staff/stock/${stockId}`);
        } else {
          const { stockId: _id, ...rest } = values;
          void _id;
          await createStock(rest as CreateStockDto);
          toast({ title: "Stock created successfully", type: "success" });
          router.push("/staff/stock");
        }
      } catch (error) {
        const message = (error as { message?: string } | null)?.message ?? (isEdit ? "Could not update stock" : "Could not create stock");
        toast({ title: message, type: "error" });
      }
    },
  });

  const handleSaveAndAddAnother = async () => {
    if (isEdit) return;
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched(Object.keys(formik.values).reduce<Record<string, boolean>>((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }
    try {
      const { stockId: _id, ...rest } = formik.values;
      void _id;
      await createStock(rest as CreateStockDto);
      toast({ title: "Stock created successfully", type: "success" });
      formik.resetForm();
    } catch (error) {
      const message = (error as { message?: string } | null)?.message ?? "Could not create stock";
      toast({ title: message, type: "error" });
    }
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const result = await uploadImage(fd);
      if (result?.url) {
        formik.setFieldValue("imagePath", result.url);
        toast({ title: "Image uploaded", type: "success" });
      } else {
        toast({ title: "Image upload failed", type: "error" });
      }
    } finally {
      setUploading(false);
    }
  };

  const adjustQuantity = (delta: number) => {
    formik.setFieldValue("quantity", Math.max(0, Number(formik.values.quantity || 0) + delta));
  };

  const selectedCategory = categories.find(c => c.id === formik.values.categoryId);
  const selectedBranch = branches.find(b => b.id === formik.values.branchId);
  const selectedUnit = units.find(u => u.id === formik.values.stockUnitId);

  const fieldError = (field: keyof FormValues) =>
    formik.touched[field] && formik.errors[field] ? (
      <p className="text-text-destructive text-xs font-light">{String(formik.errors[field])}</p>
    ) : null;

  const inputCls = (field: keyof FormValues) =>
    cn(
      "bg-bg-input-soft! text-text-default rounded-md border-none text-sm",
      formik.touched[field] && formik.errors[field] && "border-border-destructive border",
    );

  if (isEdit && loadingExisting) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Spinner className="size-12" />
      </div>
    );
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="bg-bg-card-subtle border-border-default mb-6 w-full border-b">
        <div className="justify-left mx-auto flex w-full items-center p-4 md:max-w-150">
          <div className="text-text-default text-md font-semibold">{isEdit ? "Edit Stock" : "Add Stock"}</div>
        </div>
      </div>

      <div className="mx-auto flex w-full items-center justify-center md:max-w-150">
        <div className="flex w-full flex-col gap-6 p-4">
          <div className="text-text-default text-xl font-semibold">Basic Info</div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">
              Item Name <span className="text-text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputCls("name")}
              placeholder="Input Item Name"
            />
            {fieldError("name")}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">
              Description <span className="text-text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputCls("description")}
              placeholder="Input Description"
            />
            {fieldError("description")}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">
              Category <span className="text-text-destructive">*</span>
            </Label>
            <Select
              value={formik.values.categoryId ? String(formik.values.categoryId) : ""}
              onValueChange={value => formik.setFieldValue("categoryId", Number(value))}
            >
              <SelectTrigger
                className={cn(
                  "bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!",
                  formik.touched.categoryId && formik.errors.categoryId && "border-border-destructive border",
                )}
              >
                <SelectValue placeholder="Select category">
                  <span className="text-text-default text-sm">{selectedCategory?.name ?? "Select category"}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-default border-border-default">
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={String(cat.id)} className="text-text-default text-sm">
                    {cat.name}
                  </SelectItem>
                ))}
                {!isEdit && (
                  <div className="border-border-default h-9 border-t">
                    <Button
                      type="button"
                      onClick={() => router.push("/staff/stock/stock-categories")}
                      className="text-text-default hover:bg-bg-none! w-full bg-none text-sm font-medium"
                    >
                      <AddFill fill="var(--color-icon-default-muted)" /> Add new
                    </Button>
                  </div>
                )}
              </SelectContent>
            </Select>
            {fieldError("categoryId")}
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-text-default text-sm font-medium">
              Stock Image <span className="text-text-destructive">*</span>
            </div>
            <label className="border-border-default flex cursor-pointer items-center justify-center rounded-sm border border-dashed px-6 py-8">
              <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleImageChange} />
              <div className="flex flex-col items-center gap-3">
                {uploading ? (
                  <Spinner className="size-6" />
                ) : formik.values.imagePath ? (
                  <Image src={formik.values.imagePath} alt="stock" width={64} height={64} className="rounded-md object-cover" />
                ) : (
                  <DownloadT />
                )}
                <div className="text-text-default text-sm font-medium">
                  Drop your files here, or <span className="text-text-informative">click to browse</span>
                </div>
                <div className="text-text-muted text-xs">JPG or PNG. 5MB Max.</div>
              </div>
            </label>
            {fieldError("imagePath")}
          </div>

          <div className="text-text-default text-lg font-semibold">Stock & Unit</div>

          {!isEdit && (
            <div className="space-y-2">
              <Label className="text-text-default text-sm font-medium">
                Branch <span className="text-text-destructive">*</span>
              </Label>
              <Select
                value={formik.values.branchId ? String(formik.values.branchId) : ""}
                onValueChange={value => formik.setFieldValue("branchId", Number(value))}
              >
                <SelectTrigger
                  className={cn(
                    "bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal",
                    formik.touched.branchId && formik.errors.branchId && "border-border-destructive border",
                  )}
                >
                  <SelectValue placeholder="Select Branch">
                    <span className="text-text-default text-sm">{selectedBranch?.name ?? "Select branch"}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {branches.map(branch => (
                    <SelectItem key={branch.id} value={String(branch.id)} className="text-text-default text-sm">
                      {branch.name ?? `Branch ${branch.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldError("branchId")}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                Unit <span className="text-text-destructive">*</span>
              </Label>
              <Select
                value={formik.values.stockUnitId ? String(formik.values.stockUnitId) : ""}
                onValueChange={value => formik.setFieldValue("stockUnitId", Number(value))}
              >
                <SelectTrigger
                  className={cn(
                    "bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal",
                    formik.touched.stockUnitId && formik.errors.stockUnitId && "border-border-destructive border",
                  )}
                >
                  <SelectValue placeholder="Select unit">
                    <span className="text-text-default text-sm">{selectedUnit?.name ?? "Select unit"}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {units.map(unt => (
                    <SelectItem key={unt.id} value={String(unt.id)} className="text-text-default text-sm">
                      {unt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldError("stockUnitId")}
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                Quantity <span className="text-text-destructive">*</span>
              </Label>
              <div className="bg-bg-input-soft flex h-9 items-center justify-between rounded-md p-2">
                <button type="button" onClick={() => adjustQuantity(-1)} className="text-text-muted">
                  <Minus className="size-4" />
                </button>
                <span className="text-text-default text-sm">{formik.values.quantity}</span>
                <button type="button" onClick={() => adjustQuantity(1)}>
                  <AddFill fill="var(--color-icon-default-muted)" />
                </button>
              </div>
              {fieldError("quantity")}
            </div>
          </div>

          <div className="text-text-default text-lg font-semibold">Pricing</div>

          <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                Price <span className="text-text-destructive">*</span>
              </Label>
              <Input
                id="price"
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("price")}
                type="number"
                placeholder="₦0.00"
              />
              {fieldError("price")}
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                Cost Price <span className="text-text-destructive">*</span>
              </Label>
              <Input
                id="costPrice"
                name="costPrice"
                value={formik.values.costPrice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("costPrice")}
                type="number"
                placeholder="₦0.00"
              />
              {fieldError("costPrice")}
            </div>
          </div>

          <div className="border-border-default flex w-full items-center justify-between border-t py-4">
            <Button type="button" onClick={() => router.back()} className="bg-bg-state-soft! text-text-subtle h-8!">
              Cancel
            </Button>

            <div className="flex items-center gap-2">
              {!isEdit && (
                <Button type="button" onClick={handleSaveAndAddAnother} disabled={isPending} className="bg-bg-state-soft! text-text-subtle h-8!">
                  {isPending ? <Spinner /> : "Save and Add Another"}
                </Button>
              )}
              <Button
                type="submit"
                disabled={isPending || uploading}
                className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-8!"
              >
                {isPending ? <Spinner /> : isEdit ? "Save Changes" : "Done"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
