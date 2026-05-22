import * as yup from "yup";

export const notifyBranchHeadSchema = yup.object().shape({
  message: yup.string().trim().min(1, "Message is required!").required("Message is required!"),
});
