import { Gender, Relationship } from "@/types";
import * as yup from "yup";

export const parentSchema = yup.object().shape({
  firstName: yup.string().trim().required("First Name is required!"),
  lastName: yup.string().trim().required("Last Name is required!"),
  middleName: yup.string(),
  gender: yup.string().oneOf(Object.values(Gender), "Gender is not a valid value!").required("Gender is required!"),
  relationship: yup.string().oneOf(Object.values(Relationship), "Relationship is not a valid value!").required("Relationship is required!"),
  email: yup.string(),
  address: yup.string().required("Address is required!"),
  nationality: yup.string().required("Nationality is required!"),
  stateOfOrigin: yup.string().required("State of Origin is required!"),
  phoneNumber: yup.string(),
  secondaryPhoneNumber: yup.string(),
  branchId: yup.number().required("Branch is required!"),
});
