import * as yup from "yup";

export const notifyBranchHeadSchema = yup.object().shape({
  title: yup.string().trim().min(1, "Title is required!").required("Title is required!"),
  message: yup.string().trim().min(1, "Message is required!").required("Message is required!"),
});
