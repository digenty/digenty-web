"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/Toast";
import { useAddmissionNumber } from "@/hooks/queryHooks/useAdmission";

const DIGITS = [2, 3, 4, 5, 6, 7, 8, 9];

export type AdmissionNumberSetupHandle = {
  submit: () => Promise<boolean>;
};

type FormValues = {
  prefix: string;
  numberFormat: string;
  startingNumber: string;
  padding: string;
};

const buildPreview = (prefix: string, startingNumber: string, padding: string): string => {
  const seq = String(parseInt(startingNumber) || 1).padStart(Number(padding) || 2, "0");
  const year = new Date().getFullYear();
  return `${prefix || "ADM"}-${year}${seq}`;
};

export const AdmissionNumberSetup = forwardRef<AdmissionNumberSetupHandle>((_, ref) => {
  const { mutateAsync } = useAddmissionNumber();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      prefix: "",
      numberFormat: "",
      startingNumber: "1",
      padding: "",
    },
  });

  const [prefix, startingNumber, padding] = watch(["prefix", "startingNumber", "padding"]);
  const preview = buildPreview(prefix, startingNumber, padding);

  useImperativeHandle(ref, () => ({
    submit: () =>
      new Promise<boolean>(resolve => {
        handleSubmit(
          async values => {
            try {
              await mutateAsync({
                prefix: values.prefix,
                numberFormat: values.numberFormat,
                startingNumber: parseInt(values.startingNumber),
                padding: parseInt(values.padding),
              });
              toast({ title: "Admission setup saved", description: "Your admission number format has been saved.", type: "success" });
              resolve(true);
            } catch (error: unknown) {
              const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
              toast({
                title: "Failed to save admission setup",
                description: message,
                type: "error",
              });
              resolve(false);
            }
          },
          () => resolve(false),
        )();
      }),
  }));

  return (
    <div className="mx-auto flex items-center justify-center md:w-151">
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label className="text-text-default text-sm font-medium">Admission Number Prefix</Label>
          <Input
            {...register("prefix", { required: "Prefix is required" })}
            className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm"
            placeholder="Input prefix"
          />
          {errors.prefix && <p className="text-text-destructive text-xs">{errors.prefix.message}</p>}
          <div className="text-text-muted text-xs">Common formats: ADM-, STD-, PUP-</div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-text-default text-sm font-medium">Number Format</Label>
          <Input
            {...register("numberFormat", { required: "Number format is required" })}
            className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm"
            placeholder="Input format"
          />
          {errors.numberFormat && <p className="text-text-destructive text-xs">{errors.numberFormat.message}</p>}
          <div className="text-text-muted text-xs">Use tokens: PREFIX, YEAR, MONTH, SESSION, SEQ</div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-text-default text-sm font-medium">Starting Number</Label>
          <Input
            {...register("startingNumber", {
              required: "Starting number is required",
              min: { value: 1, message: "Must be at least 1" },
            })}
            type="number"
            className="bg-bg-input-soft! text-text-default rounded-md border-none text-sm"
            placeholder="Input first Number"
          />
          {errors.startingNumber && <p className="text-text-destructive text-xs">{errors.startingNumber.message}</p>}
          <div className="text-text-muted text-xs">The first admission number to use</div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-text-default text-sm font-medium">Padding</Label>
          <Controller
            control={control}
            name="padding"
            rules={{ required: true }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="bg-bg-input-soft! h-9! w-full rounded-md border-none">
                  <SelectValue placeholder="2">
                    <span className="text-text-default text-sm">{field.value} Digits</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-border-default">
                  {DIGITS.map(dgt => (
                    <SelectItem key={dgt} value={String(dgt)} className="text-text-default text-sm font-medium">
                      {dgt} Digits
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="border-border-default bg-bg-basic-blue-subtle flex w-full items-center gap-2 rounded-md border px-3 py-2.5">
          <div className="bg-bg-basic-blue-accent border-border-default h-6 w-1 border-2" />
          <div className="text-text-subtle text-sm uppercase">Next Admission Number: {preview}</div>
        </div>
      </div>
    </div>
  );
});

AdmissionNumberSetup.displayName = "AdmissionNumberSetup";
