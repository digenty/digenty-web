import * as yup from "yup";

export const campaignSchema = yup.object().shape({
  title: yup.string().trim().required("Campaign title is required"),
  channel: yup.string().required("Communication channel is required"),
  message: yup.string().trim().required("Message content is required"),
  recipients: yup.array().min(1, "Select at least one recipient group").required("Recipients are required"),
  scheduledDate: yup.string().nullable(),
  scheduledTime: yup.string().nullable(),
});

/**
 * Edit re-uses the same form, but the campaign detail response does not return the
 * original recipient target, so recipients are optional when updating — the target is
 * only sent if the user explicitly re-selects recipients.
 */
export const campaignEditSchema = yup.object().shape({
  title: yup.string().trim().required("Campaign title is required"),
  channel: yup.string().required("Communication channel is required"),
  message: yup.string().trim().required("Message content is required"),
  recipients: yup.array(),
  scheduledDate: yup.string().nullable(),
  scheduledTime: yup.string().nullable(),
});
