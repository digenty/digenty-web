import * as yup from "yup";

export const campaignSchema = yup.object().shape({
  title: yup.string().trim().required("Campaign title is required"),
  channel: yup.string().required("Communication channel is required"),
  message: yup.string().trim().required("Message content is required"),
  recipients: yup.array().of(yup.string()).min(1, "Select at least one recipient group").required("Recipients are required"),
  scheduledDate: yup.string().nullable(),
  scheduledTime: yup.string().nullable(),
});
