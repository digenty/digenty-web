"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { toast } from "@/components/Toast";
import { campaignSchema } from "@/schema/communications";

import { RATE_PER_MESSAGE } from "../mockData";
import { CampaignFormValues } from "../types";
import { CampaignFormFields } from "./CampaignFormFields";
import { NewCampaignHeader } from "./NewCampaignHeader";
import { ScheduleDialog } from "./ScheduleDialog";
import { SummaryCard } from "./SummaryCard";

const MOCK_RECIPIENT_COUNT_PER_GROUP = 93;

export const NewCampaign = () => {
  const router = useRouter();
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const formik = useFormik<CampaignFormValues>({
    initialValues: {
      title: "",
      channel: "",
      message: "",
      recipients: [],
      scheduledDate: null,
      scheduledTime: null,
    },
    validationSchema: campaignSchema,
    onSubmit: async values => {
      toast({ title: "Campaign created", description: values.title || "Untitled campaign", type: "success" });
      router.push("/staff/communications");
    },
  });

  const recipientsCount = Math.max(formik.values.recipients.length * MOCK_RECIPIENT_COUNT_PER_GROUP, 0);
  const totalCost = recipientsCount * RATE_PER_MESSAGE;
  const scheduled = Boolean(formik.values.scheduledDate && formik.values.scheduledTime);

  const handleSaveDraft = () => {
    toast({ title: "Saved as draft", description: formik.values.title || "Untitled campaign", type: "success" });
    router.push("/staff/communications");
  };

  const summary =
    formik.values.recipients.length === 0
      ? "Select recipients to see breakdown"
      : `${formik.values.recipients.length} groups, ${recipientsCount} recipients`;

  return (
    <div className="pb-10">
      <NewCampaignHeader
        totalCost={totalCost || 1104}
        scheduled={scheduled}
        onSaveDraft={handleSaveDraft}
        onSchedule={() => setScheduleOpen(true)}
        onSubmit={formik.submitForm}
        submitting={formik.isSubmitting}
      />

      <div className="grid grid-cols-1 gap-4 px-4 pt-4 md:grid-cols-3 md:gap-6 md:px-8 md:pt-6">
        <div className="md:col-span-2">
          <CampaignFormFields
            formik={formik}
            selectedRecipientsSummary={summary}
            onEditSchedule={() => setScheduleOpen(true)}
            onCancelSchedule={() => {
              formik.setFieldValue("scheduledDate", null);
              formik.setFieldValue("scheduledTime", null);
            }}
          />
        </div>

        <div className="md:col-span-1">
          <SummaryCard
            recipients={recipientsCount || 930}
            ratePerMessage={RATE_PER_MESSAGE}
            totalCost={totalCost || 1104}
            scheduled={scheduled}
            submitting={formik.isSubmitting}
            onSubmit={formik.submitForm}
          />
        </div>
      </div>

      <ScheduleDialog
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        initialDate={formik.values.scheduledDate}
        initialTime={formik.values.scheduledTime}
        onConfirm={(date, time) => {
          formik.setFieldValue("scheduledDate", date);
          formik.setFieldValue("scheduledTime", time);
        }}
      />
    </div>
  );
};
