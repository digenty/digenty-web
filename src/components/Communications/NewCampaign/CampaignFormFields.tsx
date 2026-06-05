"use client";

import { FormikProps } from "formik";

import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

import { channelOptions } from "../mockData";
import { CampaignFormValues } from "../types";
import { CampaignScheduleCard } from "./CampaignScheduleCard";
import { MessageEditor } from "./MessageEditor";
import { RecipientsSelect } from "./RecipientsSelect";

type CampaignFormFieldsProps = {
  formik: FormikProps<CampaignFormValues>;
  onEditSchedule: () => void;
  onCancelSchedule: () => void;
};

export const CampaignFormFields = ({ formik, onEditSchedule, onCancelSchedule }: CampaignFormFieldsProps) => {
  const scheduled = Boolean(formik.values.scheduledDate && formik.values.scheduledTime);

  return (
    <div className="border-border-default bg-bg-card flex w-full flex-col gap-5 rounded-md border p-4 md:p-6">
      {scheduled && formik.values.scheduledDate && formik.values.scheduledTime && (
        <CampaignScheduleCard
          date={formik.values.scheduledDate}
          time={formik.values.scheduledTime}
          onEdit={onEditSchedule}
          onCancel={onCancelSchedule}
        />
      )}

      <div className="flex flex-col gap-2">
        <Label className="text-text-default text-sm font-medium">Campaign Title</Label>
        <Input
          name="title"
          placeholder="Input Campaign Title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="bg-bg-input-soft! text-text-default h-9 rounded-md border-none text-sm"
        />
        {formik.touched.title && formik.errors.title && <p className="text-text-destructive text-xs">{formik.errors.title}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-text-default text-sm font-medium">Communication Channel</Label>
        <Select value={formik.values.channel} onValueChange={value => formik.setFieldValue("channel", value)}>
          <SelectTrigger className="bg-bg-input-soft! text-text-default h-9! w-full rounded-md border-none px-3 text-sm font-normal!">
            <SelectValue placeholder="Select Channel" />
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default">
            {channelOptions.map(opt => {
              const isComingSoon = opt.value === "WHATSAPP";
              return (
                <SelectItem key={opt.value} value={opt.value} disabled={isComingSoon} className="text-text-default text-sm">
                  <span className="flex items-center gap-2">
                    {opt.label}
                    {isComingSoon && (
                      <span className="bg-bg-badge-orange text-bg-basic-orange-strong rounded px-1.5 py-0.5 text-xs font-medium">
                        Coming soon
                      </span>
                    )}
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {formik.touched.channel && formik.errors.channel && <p className="text-text-destructive text-xs">{formik.errors.channel}</p>}
      </div>

      <MessageEditor
        value={formik.values.message}
        onChange={value => formik.setFieldValue("message", value)}
        error={formik.touched.message ? (formik.errors.message as string | undefined) : undefined}
        channel={formik.values.channel}
      />

      <RecipientsSelect
        value={formik.values.recipients}
        onChange={value => formik.setFieldValue("recipients", value)}
        error={formik.touched.recipients ? (formik.errors.recipients as string | undefined) : undefined}
      />
    </div>
  );
};
