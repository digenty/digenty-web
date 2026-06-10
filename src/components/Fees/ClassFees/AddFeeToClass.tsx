"use client";

import { Toggle } from "@/components/Toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef } from "react";
import { Formik, Form, type FormikHelpers } from "formik";
import { toast } from "sonner";
import { addFeeToClassSchema } from "@/schema/fees";
import { useCreateFeeItem } from "@/hooks/queryHooks/useFee";
import { useGetArmsByClass } from "@/hooks/queryHooks/useArm";
import { useFeeFormData } from "../AddFee/useFeeForm";
import { useSearchStocks } from "@/hooks/queryHooks/useStock";
import type { FeeItemDto, FeeTermType } from "@/api/fee";
import { Spinner } from "@/components/ui/spinner";

interface AddFeeToClassValues {
  armIds: number[];
  name: string;
  sessionId: number | "";
  term: FeeTermType | "";
  quantity: number;
  amount: number | "";
  required: boolean;
  allowPartPayment: boolean;
  minimumPartPayment: number | "";
}

const AddFeeToClass = () => {
  const router = useRouter();
  const params = useSearchParams();
  const classId = params.get("classId") ? Number(params.get("classId")) : null;
  const classNameParam = params.get("className") ?? "This Class";

  const { termList, sessionName, sessionId, classList, branchList } = useFeeFormData();
  const { mutate: createFeeItem, isPending } = useCreateFeeItem();
  const addAnotherRef = useRef(false);

  const { data: armsResp, isLoading: loadingArms } = useGetArmsByClass(classId);
  const arms: { armId: number; armName: string }[] = useMemo(() => {
    if (!armsResp) return [];
    if (Array.isArray(armsResp)) return armsResp;
    return (armsResp as { content?: { armId: number; armName: string }[] })?.content ?? [];
  }, [armsResp]);

  // Derive branchId for the stock picker from the class
  const classBranchId = useMemo(() => classList.find(c => c.id === classId)?.branchId ?? branchList[0]?.id, [classList, classId, branchList]);

  const { data: stockData } = useSearchStocks({ branchId: classBranchId, size: 50 });
  const stockItems = stockData?.content ?? [];

  useBreadcrumb([
    { label: "Fees", url: "/staff/fees" },
    { label: "Class Fees", url: "/staff/fees" },
    { label: "Add Fee", url: "/staff/fees/add-fee-to-class" },
  ]);

  // Pre-select all arms; reinitialises when arms load
  const initialValues: AddFeeToClassValues = useMemo(
    () => ({
      armIds: arms.map(a => a.armId),
      name: "",
      sessionId: sessionId ?? "",
      term: "",
      quantity: 1,
      amount: "",
      required: false,
      allowPartPayment: false,
      minimumPartPayment: "",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [arms, sessionId],
  );

  const handleSubmit = (values: AddFeeToClassValues, helpers: FormikHelpers<AddFeeToClassValues>) => {
    const payload: FeeItemDto = {
      name: values.name.trim(),
      session: Number(values.sessionId),
      term: values.term as FeeTermType,
      quantity: values.quantity,
      armIds: values.armIds,
      amount: Number(values.amount) || 0,
      required: values.required,
      allowPartPayment: values.allowPartPayment,
      minimumPartPayment: values.allowPartPayment ? Number(values.minimumPartPayment) || 0 : undefined,
    };

    createFeeItem(payload, {
      onSuccess: () => {
        toast.success("Fee added to class successfully");
        if (addAnotherRef.current) {
          helpers.resetForm({ values: { ...initialValues, armIds: values.armIds } });
        } else {
          router.push("/staff/fees?tab=Fee Items");
        }
      },
      onError: (error: unknown) => {
        toast.error((error as { message?: string })?.message ?? "Failed to add fee to class");
      },
      onSettled: () => {
        addAnotherRef.current = false;
      },
    });
  };

  const toggleArm = (armId: number, checked: boolean, currentIds: number[], setField: (f: string, v: unknown) => void) => {
    const next = checked ? [...currentIds, armId] : currentIds.filter(id => id !== armId);
    setField("armIds", next);
  };

  return (
    <Formik initialValues={initialValues} enableReinitialize validationSchema={addFeeToClassSchema} onSubmit={handleSubmit}>
      {({ values, errors, touched, setFieldValue, handleChange, handleBlur, handleSubmit: submitForm }) => {
        const increase = () => setFieldValue("quantity", values.quantity + 1);
        const decrease = () => setFieldValue("quantity", values.quantity > 1 ? values.quantity - 1 : 1);

        return (
          <Form>
            <div className="bg-bg-card-subtle border-border-default flex w-full items-center justify-center border-b p-3">
              <div className="mx-auto w-full font-semibold md:max-w-150">
                <div className="text-text-default text-md">Add Fee To {classNameParam}</div>
              </div>
            </div>

            <div className="flex items-center justify-center pb-20">
              <div className="px-4 py-4 md:px-8">
                <div className="border-border-default mx-auto flex flex-col gap-6 md:w-150">
                  {/* Select from Stock */}
                  {stockItems.length > 0 && (
                    <Select
                      onValueChange={stockId => {
                        const item = stockItems.find(s => s.id === Number(stockId));
                        if (item) {
                          setFieldValue("name", item.itemName);
                          setFieldValue("amount", item.amount);
                        }
                      }}
                    >
                      <SelectTrigger className="bg-bg-input-soft! h-8! w-fit min-w-40 rounded-md border-none">
                        <SelectValue placeholder="Select from Stock" />
                      </SelectTrigger>
                      <SelectContent className="bg-bg-card border-border-default max-h-72">
                        {stockItems.map(item => (
                          <SelectItem key={item.id} value={String(item.id)} className="text-text-default text-sm font-normal">
                            {item.itemName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {/* Fee Name */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">Fee Name</Label>
                    <Input
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm"
                      placeholder="Input Fee Name"
                    />
                    {touched.name && errors.name && <span className="text-text-destructive text-xs">{errors.name}</span>}
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

                  {/* Session / Term */}
                  <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                    <div className="w-full">
                      <Select value={sessionId ? String(sessionId) : ""} onValueChange={value => setFieldValue("sessionId", Number(value))}>
                        <Label className="text-text-default mb-2 text-sm font-medium">Session</Label>
                        <SelectTrigger className="bg-bg-input-soft! h-8! w-full rounded-md border-none">
                          <SelectValue placeholder="Select Session">
                            <span className="text-text-muted text-sm font-normal">{sessionName || "Select Session"}</span>
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
                    <div className="w-full">
                      <Select value={values.term} onValueChange={value => setFieldValue("term", value as FeeTermType)}>
                        <Label className="text-text-default mb-2 text-sm font-medium">Term</Label>
                        <SelectTrigger className="bg-bg-input-soft! h-8! w-full rounded-md border-none">
                          <SelectValue placeholder="Select Term">
                            <span className="text-text-muted text-sm font-normal capitalize">
                              {values.term ? values.term.toLowerCase() : "Select Term"}
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

                  {/* Apply to Arms */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-text-default text-sm font-medium">Apply to Arms</Label>
                      {!loadingArms && arms.length > 0 && (
                        <button
                          type="button"
                          className="text-text-muted hover:text-text-default text-xs underline"
                          onClick={() => {
                            const allSelected = values.armIds.length === arms.length;
                            setFieldValue("armIds", allSelected ? [] : arms.map(a => a.armId));
                          }}
                        >
                          {values.armIds.length === arms.length ? "Deselect all" : "Select all"}
                        </button>
                      )}
                    </div>
                    {loadingArms ? (
                      <div className="flex flex-col gap-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Skeleton key={i} className="bg-bg-input-soft h-10 w-full rounded-md" />
                        ))}
                      </div>
                    ) : (
                      <div className="border-border-default rounded-md border">
                        {arms.map((arm, i) => (
                          <label
                            key={arm.armId}
                            className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 ${i < arms.length - 1 ? "border-border-default border-b" : ""}`}
                          >
                            <Checkbox
                              checked={values.armIds.includes(arm.armId)}
                              onCheckedChange={v => toggleArm(arm.armId, !!v, values.armIds, setFieldValue)}
                            />
                            <span className="text-text-default text-sm">{arm.armName}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    {touched.armIds && errors.armIds && <span className="text-text-destructive text-xs">{errors.armIds as string}</span>}
                  </div>

                  {/* Quantity / Amount */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-full">
                      <Label className="text-text-default mb-2 text-sm font-medium">Quantity</Label>
                      <div className="bg-bg-input-soft flex w-full justify-between gap-2 rounded-md p-2">
                        <div className="text-text-subtle cursor-pointer select-none" onClick={decrease}>
                          -
                        </div>
                        <div className="text-text-default text-sm font-normal">{values.quantity}</div>
                        <div className="text-text-subtle cursor-pointer select-none" onClick={increase}>
                          +
                        </div>
                      </div>
                    </div>
                    <div className="w-full">
                      <Label className="text-text-default mb-2 text-sm font-medium">Amount</Label>
                      <Input
                        name="amount"
                        type="number"
                        value={values.amount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm"
                        placeholder="₦ 0.00"
                      />
                      {touched.amount && errors.amount && <span className="text-text-destructive text-xs">{errors.amount}</span>}
                    </div>
                  </div>

                  {/* Allow part payment */}
                  <label className="border-border-default flex cursor-pointer items-start justify-between rounded-md border p-4">
                    <div className="flex w-full flex-col gap-2">
                      <div className="text-text-default text-sm font-medium">Allow part payment</div>
                      <div className="text-text-subtle text-sm font-normal">
                        Let parents pay this fee in instalments instead of paying the full amount at once.
                      </div>
                    </div>
                    <Checkbox checked={values.allowPartPayment} onCheckedChange={v => setFieldValue("allowPartPayment", !!v)} />
                  </label>

                  {/* Minimum Initial Payment — always visible */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-text-default text-sm font-medium">Minimum Initial Payment</Label>
                      {!values.allowPartPayment && <span className="text-text-muted text-xs">Optional</span>}
                    </div>
                    <Input
                      name="minimumPartPayment"
                      type="number"
                      value={values.minimumPartPayment}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm"
                      placeholder="₦0.00"
                    />
                    {touched.minimumPartPayment && errors.minimumPartPayment && (
                      <span className="text-text-destructive text-xs">{errors.minimumPartPayment}</span>
                    )}
                  </div>
                </div>

                <div className="border-border-default bg-bg-default fixed bottom-0 w-full max-w-150 border-t py-3 pr-8 pl-4 md:px-0">
                  <div className="flex w-full justify-between">
                    <Button
                      type="button"
                      onClick={() => router.push("/staff/fees")}
                      className="bg-bg-state-soft! text-text-subtle! hover:bg-bg-state-soft-hover! h-8! text-sm"
                    >
                      Cancel
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        disabled={isPending || loadingArms}
                        onClick={() => {
                          addAnotherRef.current = true;
                          submitForm();
                        }}
                        className="bg-bg-state-soft! text-text-subtle! hover:bg-bg-state-soft-hover! hidden h-8! text-sm md:flex"
                      >
                        Save & Add Another
                      </Button>
                      <Button
                        type="submit"
                        disabled={isPending || loadingArms}
                        className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-8!"
                      >
                        {isPending ? (
                          <>
                            {" "}
                            <Spinner className="text-text-white-default h-4 w-4" /> <span>Adding Fee...</span>{" "}
                          </>
                        ) : (
                          "Add Fee"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddFeeToClass;
