"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { toast } from "@/components/Toast";
import { campaignSchema } from "@/schema/communications";

import { CampaignFormFields } from "../NewCampaign/CampaignFormFields";
import { ScheduleDialog } from "../NewCampaign/ScheduleDialog";
import { SummaryCard } from "../NewCampaign/SummaryCard";

import { getCampaignById, RATE_PER_MESSAGE } from "../mockData";
import { CampaignFormValues } from "../types";
import { EditCampaignHeader } from "./EditCampaignHeader";

type EditCampaignProps = {
  id: string;
};

export const EditCampaign = ({ id }: EditCampaignProps) => {
  const router = useRouter();
  const campaign = getCampaignById(id);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const formik = useFormik<CampaignFormValues>({
    initialValues: {
      title: campaign?.title ?? "",
      channel: campaign?.channel ?? "",
      message: campaign?.messageContent ?? "",
      recipients: ["all-students", "all-parents"],
      scheduledDate: campaign?.status === "Scheduled" ? new Date(2025, 8, 17).toISOString() : null,
      scheduledTime: campaign?.status === "Scheduled" ? "14:30" : null,
    },
    enableReinitialize: true,
    validationSchema: campaignSchema,
    onSubmit: async values => {
      toast({ title: "Campaign updated", description: values.title, type: "success" });
      router.push(`/staff/communications/${id}`);
    },
  });

  return (
    <div className="pb-10">
      <EditCampaignHeader
        onCancel={() => router.push(`/staff/communications/${id}`)}
        onSave={formik.submitForm}
        saving={formik.isSubmitting}
      />

      <div className="grid grid-cols-1 gap-4 px-4 pt-4 md:grid-cols-3 md:gap-6 md:px-8 md:pt-6">
        <div className="md:col-span-2">
          <CampaignFormFields
            formik={formik}
            selectedRecipientsSummary={campaign?.selectedRecipientsSummary ?? "2 Students, 2 Parents, 2 Tag Groups"}
            onEditSchedule={() => setScheduleOpen(true)}
            onCancelSchedule={() => {
              formik.setFieldValue("scheduledDate", null);
              formik.setFieldValue("scheduledTime", null);
            }}
          />
        </div>

        <div className="md:col-span-1">
          <SummaryCard
            recipients={campaign?.recipients ?? 930}
            ratePerMessage={RATE_PER_MESSAGE}
            totalCost={(campaign?.recipients ?? 92) * RATE_PER_MESSAGE}
            scheduled={Boolean(formik.values.scheduledDate)}
            paid={campaign?.paid ?? true}
            hideInfoBanner
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
