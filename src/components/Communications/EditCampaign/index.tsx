"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { UpdateCampaignRequest } from "@/api/campaign";
import { toast } from "@/components/Toast";
import { Spinner } from "@/components/ui/spinner";
import { useGetCampaign, useUpdateCampaign } from "@/hooks/queryHooks/useCampaign";
import { campaignEditSchema } from "@/schema/communications";

import { buildTarget, combineDateTime } from "../campaignPayload";
import { ErrorComponent } from "../../Error/ErrorComponent";
import { CampaignFormFields } from "../NewCampaign/CampaignFormFields";
import { ScheduleDialog } from "../NewCampaign/ScheduleDialog";
import { SummaryCard } from "../NewCampaign/SummaryCard";
import { RATE_PER_MESSAGE } from "../mockData";
import { CampaignFormValues } from "../types";
import { EditCampaignHeader } from "./EditCampaignHeader";

type EditCampaignProps = {
  id: string;
};

const getErrorMessage = (error: unknown) => (error as { message?: string })?.message ?? "Please try again.";

export const EditCampaign = ({ id }: EditCampaignProps) => {
  const router = useRouter();
  const numericId = Number(id);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const { data: campaign, isLoading, isError, refetch } = useGetCampaign(Number.isNaN(numericId) ? undefined : numericId);
  const updateMutation = useUpdateCampaign(numericId);

  const formik = useFormik<CampaignFormValues>({
    initialValues: {
      title: campaign?.title ?? "",
      channel: campaign?.channel ?? "",
      message: campaign?.message ?? "",
      recipients: [],
      scheduledDate: campaign?.scheduledAt ?? null,
      scheduledTime: null,
    },
    enableReinitialize: true,
    validationSchema: campaignEditSchema,
    onSubmit: async values => {
      const payload: UpdateCampaignRequest = {
        title: values.title.trim(),
        channel: values.channel as UpdateCampaignRequest["channel"],
        message: values.message.trim(),
        scheduledAt: combineDateTime(values.scheduledDate, values.scheduledTime),
        ...(values.recipients.length > 0 ? { target: buildTarget(values.recipients) } : {}),
      };
      try {
        await updateMutation.mutateAsync(payload);
        toast({ title: "Campaign updated", description: values.title, type: "success" });
        router.push(`/staff/communications/${id}`);
      } catch (error: unknown) {
        toast({ title: "Failed to update campaign", description: getErrorMessage(error), type: "error" });
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner className="size-12" />
      </div>
    );
  }

  if (isError || !campaign) {
    return (
      <div className="flex h-[60vh] items-center justify-center px-4">
        <ErrorComponent
          title="Campaign not found"
          description="We couldn't load this campaign for editing. It may have been deleted or the link is invalid."
          buttonText="Back to Communications"
          url="/staff/communications"
          onClick={() => refetch()}
        />
      </div>
    );
  }

  const saving = updateMutation.isPending || formik.isSubmitting;

  return (
    <div className="pb-10">
      <EditCampaignHeader onCancel={() => router.push(`/staff/communications/${id}`)} onSave={formik.submitForm} saving={saving} />

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
            recipients={campaign.intendedRecipientCount}
            ratePerMessage={campaign.ratePerMessage || RATE_PER_MESSAGE}
            totalCost={campaign.totalCost}
            scheduled={Boolean(formik.values.scheduledDate)}
            paid={campaign.paid}
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
