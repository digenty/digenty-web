"use client";

import { Toggle } from "@/components/Toggle";
import { StockSheet } from "@/components/Invoices/NewInvoice/NewInvoiceItems/StockSheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "sonner";
import { useCreateFeeItem } from "@/hooks/queryHooks/useFee";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useGetActiveSession } from "@/hooks/queryHooks/useAcademic";
import { useGetArmsByClass } from "@/hooks/queryHooks/useArm";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { FeeTermType } from "@/api/fee";
import { cn, unwrapArray, extractSessionId } from "@/lib/utils";
import { addFeeToClassSchema } from "@/schema/fees";

const TERM_MAP: Record<FeeTermType, string> = {
  FIRST: "First Term",
  SECOND: "Second Term",
  THIRD: "Third Term",
};

const AddFeeToClass = () => {
  const router = useRouter();
  const params = useParams();
  const classId = params?.id ? Number(params.id) : undefined;
  const { schoolId } = useLoggedInUser();
  const { mutate: createFeeItem, isPending } = useCreateFeeItem();

  const { data: termsData } = useGetTerms(schoolId);
  const { data: activeSessionData } = useGetActiveSession();
  const { data: armsData } = useGetArmsByClass(classId ?? null);

  const sessionId = extractSessionId(activeSessionData) ?? 0;
  const rawTerms = unwrapArray<{ termId: number; term: FeeTermType }>(termsData);
  const arms = unwrapArray<{ id: number; name: string }>(armsData);

  const termOptions = rawTerms.map(t => ({
    label: TERM_MAP[t.term] ?? t.term,
    sessionId,
    term: t.term,
  }));

  useBreadcrumb([
    { label: "Fees", url: "/staff/fees" },
    { label: "Class Fees", url: "/staff/fees?tab=Class Fees" },
    { label: classId ? `Class #${classId}` : "Class", url: classId ? `/staff/fees/${classId}` : "/staff/fees" },
    { label: "Add Fee", url: "/staff/fees/add-fee-to-class" },
  ]);

  const formik = useFormik({
    initialValues: {
      name: "",
      session: "" as number | "",
      term: "" as FeeTermType | "",
      quantity: 1,
      amount: "" as number | "",
      required: false,
      allowPartPayment: false,
    },
    validationSchema: addFeeToClassSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: values => {
      const armIds = arms.map(a => a.id);
      createFeeItem(
        {
          name: values.name,
          session: values.session as number,
          term: values.term as FeeTermType,
          quantity: values.quantity,
          required: values.required,
          armIds,
          amount: values.amount as number,
          allowPartPayment: values.allowPartPayment,
        },
        {
          onSuccess: () => {
            toast.success("Fee added to class successfully");
            router.back();
          },
          onError: (err: unknown) => {
            const msg = (err as { message?: string })?.message ?? "Failed to add fee";
            toast.error(msg);
          },
        },
      );
    },
  });

  const { values, errors, touched, handleChange, handleBlur, setFieldValue, handleSubmit } = formik;

  const selectedTermObj = termOptions.find(t => t.term === values.term && t.sessionId === values.session);

  return (
    <div>
      <div className="bg-bg-card-subtle border-border-default flex w-full items-center justify-center border-b p-3">
        <div className="mx-auto w-full font-semibold md:max-w-150">
          <div className="text-text-default text-md">Add Fee To {classId ? `Class #${classId}` : "Class"}</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-center pb-20">
          <div className="px-4 py-4 md:px-8">
            <div className="border-border-default mx-auto flex flex-col gap-6">
              {/* Stock Picker Sheet */}
              <div className="w-41">
                <StockSheet />
              </div>

              {/* Fee Name */}
              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">Fee Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={cn(
                    "bg-bg-input-soft! text-text-muted rounded-md border-none text-sm",
                    errors.name && touched.name && "border border-red-500",
                  )}
                  placeholder="Input Fee Name"
                />
                {touched.name && errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Required toggle */}
              <div className="flex max-w-fit items-center gap-2">
                {values.required ? (
                  <Badge className="text-bg-basic-fuchsia-strong bg-bg-badge-fuchsia border-border-default h-5! w-16! rounded-sm border">
                    Required
                  </Badge>
                ) : (
                  <Badge className="text-text-default border-border-default h-5! w-16! rounded-sm border">Optional</Badge>
                )}
                <Toggle checked={values.required} onChange={e => setFieldValue("required", e.target.checked)} className="border-none" />
              </div>

              {/* Term select */}
              <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                <div className="w-full">
                  <Label className="text-text-default mb-2 text-sm font-medium">Term</Label>
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
                      className={cn("bg-bg-input-soft! h-8! w-full rounded-md border-none", errors.term && touched.term && "border border-red-500")}
                    >
                      <SelectValue placeholder="Select term">
                        <span className="text-text-muted text-sm font-normal">{selectedTermObj?.label ?? "Select term"}</span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-bg-card border-border-default">
                      {termOptions.map(t => (
                        <SelectItem key={`${t.sessionId}-${t.term}`} value={t.label} className="text-text-default text-sm font-normal">
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {touched.term && errors.term && <p className="text-xs text-red-500">{String(errors.term)}</p>}
                </div>
              </div>

              {/* Quantity + Amount */}
              <div className="flex items-center justify-between gap-4">
                <div className="w-full">
                  <Label className="text-text-default mb-2 text-sm font-medium">Quantity</Label>
                  <div className="bg-bg-input-soft m flex w-full justify-between gap-2 rounded-md p-2">
                    <button
                      type="button"
                      className="text-text-subtle cursor-pointer"
                      onClick={() => setFieldValue("quantity", Math.max(1, values.quantity - 1))}
                    >
                      -
                    </button>
                    <div className="text-text-default text-sm font-normal">{values.quantity}</div>
                    <button type="button" className="text-text-subtle cursor-pointer" onClick={() => setFieldValue("quantity", values.quantity + 1)}>
                      +
                    </button>
                  </div>
                </div>
                <div className="w-full">
                  <Label className="text-text-default mb-2 text-sm font-medium">Amount</Label>
                  <Input
                    type="number"
                    value={values.amount === "" ? "" : String(values.amount)}
                    onChange={e => setFieldValue("amount", e.target.value === "" ? "" : Number(e.target.value))}
                    className={cn(
                      "bg-bg-input-soft! text-text-muted rounded-md border-none text-sm",
                      errors.amount && touched.amount && "border border-red-500",
                    )}
                    placeholder="₦ 0.00"
                  />
                  {touched.amount && errors.amount && <p className="text-xs text-red-500">{String(errors.amount)}</p>}
                </div>
              </div>

              {/* Allow part payment */}
              <div className="border-border-default flex items-start justify-between rounded-md border p-4">
                <div className="flex w-full flex-col gap-2">
                  <div className="text-text-default text-sm font-medium">Allow part payment</div>
                  <div className="text-text-subtle text-sm font-normal">
                    Let parents pay this fee in instalments instead of paying the full amount at once.
                  </div>
                </div>
                <Checkbox checked={values.allowPartPayment} onCheckedChange={(v: boolean) => setFieldValue("allowPartPayment", v)} />
              </div>
            </div>

            <div className="border-border-default bg-bg-default fixed bottom-0 w-full max-w-150 border-t py-3 pr-8 pl-4 md:px-0">
              <div className="flex w-full justify-between">
                <Button
                  type="button"
                  onClick={() => router.back()}
                  className="bg-bg-state-soft! text-text-subtle! hover:bg-bg-state-soft-hover! h-8! text-sm"
                >
                  Cancel
                </Button>
                <div className="flex items-center gap-2">
                  <Button type="button" className="bg-bg-state-soft! text-text-subtle! hover:bg-bg-state-soft-hover! hidden h-8! text-sm md:flex">
                    Save & Add Another
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-8!"
                  >
                    {isPending ? "Saving..." : "Add Fee"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddFeeToClass;
