"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CampaignChannel } from "@/api/campaign";
import { toast } from "@/components/Toast";
import { useCreateCampaign, useEstimateCampaign, usePayForCampaign } from "@/hooks/queryHooks/useCampaign";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { campaignSchema } from "@/schema/communications";

import { buildTarget, mapFormToCampaignRequest } from "../campaignPayload";
import { RATE_PER_MESSAGE } from "../mockData";
import { CampaignFormValues, extractPaymentUrl } from "../types";
import { CampaignFormFields } from "./CampaignFormFields";
import { NewCampaignHeader } from "./NewCampaignHeader";
import { ScheduleDialog } from "./ScheduleDialog";
import { SummaryCard } from "./SummaryCard";

const getErrorMessage = (error: unknown) => (error as { message?: string })?.message ?? "Please try again.";

export const NewCampaign = () => {
  const { email: userEmail } = useLoggedInUser();
  const router = useRouter();
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const { mutateAsync: createCampaign, isPending: creating } = useCreateCampaign();
  const { mutateAsync: payForCampaign, isPending: paying } = usePayForCampaign();
  const { mutate: estimate, data: estimateData, reset: resetEstimate } = useEstimateCampaign();

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
      let created;
      try {
        created = await createCampaign(mapFormToCampaignRequest(values));
      } catch (error: unknown) {
        toast({ title: "Failed to create campaign", description: getErrorMessage(error), type: "error" });
        return;
      }

      try {
        const callbackUrl = `${window.location.origin}/staff/communications/${created.id}`;
        const res = await payForCampaign({ id: created.id, payload: { email: userEmail, callbackUrl } });
        const url = extractPaymentUrl(res);
        if (url) {
          window.location.href = url;
          return;
        }
        router.push(`/staff/communications/${created.id}`);
      } catch (error: unknown) {
        toast({ title: "Campaign saved — payment failed", description: getErrorMessage(error), type: "error" });
        router.push(`/staff/communications/${created.id}`);
      }
    },
  });

  const { channel, message, recipients } = formik.values;

  // Live cost estimate from the API once channel, message and recipients are set.
  useEffect(() => {
    if (!channel || !message.trim() || recipients.length === 0) {
      resetEstimate();
      return;
    }
    const timeout = setTimeout(() => {
      estimate({ channel: channel as CampaignChannel, message: message.trim(), target: buildTarget(recipients) });
    }, 600);
    return () => clearTimeout(timeout);
  }, [channel, message, recipients, estimate, resetEstimate]);

  const recipientsCount = estimateData?.recipientCount ?? 0;
  const ratePerMessage = estimateData?.ratePerMessage ?? RATE_PER_MESSAGE;
  const totalCost = estimateData?.totalCost ?? 0;
  const scheduled = Boolean(formik.values.scheduledDate && formik.values.scheduledTime);
  const submitting = creating || paying || formik.isSubmitting;

  const handleSaveDraft = async () => {
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched({ title: true, channel: true, message: true });
      return;
    }
    try {
      const created = await createCampaign({ ...mapFormToCampaignRequest(formik.values), scheduledAt: null });
      toast({ title: "Saved as draft", description: formik.values.title, type: "success" });
      router.push(`/staff/communications/${created.id}`);
    } catch (error: unknown) {
      toast({ title: "Failed to save draft", description: getErrorMessage(error), type: "error" });
    }
  };

  return (
    <div className="pb-10">
      <NewCampaignHeader
        totalCost={totalCost}
        scheduled={scheduled}
        onSaveDraft={handleSaveDraft}
        onSchedule={() => setScheduleOpen(true)}
        onSubmit={formik.submitForm}
        submitting={submitting}
      />

      <div className="grid grid-cols-1 gap-4 px-4 pt-4 md:grid-cols-3 md:gap-6 md:px-8 md:pt-6">
        <div className="md:col-span-2">
          <CampaignFormFields
            formik={formik}
            onEditSchedule={() => setScheduleOpen(true)}
            onCancelSchedule={() => {
              formik.setFieldValue("scheduledDate", null);
              formik.setFieldValue("scheduledTime", null);
            }}
          />
        </div>

        <div className="md:col-span-1">
          <SummaryCard
            recipients={recipientsCount}
            ratePerMessage={ratePerMessage}
            totalCost={totalCost}
            scheduled={scheduled}
            submitting={submitting}
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
