import { Gender, Relationship } from "@/types";
import * as yup from "yup";

// A parent needs an email address or a phone number, not both — the other is optional.
const CONTACT_REQUIRED_MESSAGE = "Provide an email address or a phone number";

export const parentSchema = yup.object().shape(
  {
    firstName: yup.string().trim().required("First Name is required!"),
    lastName: yup.string().trim().required("Last Name is required!"),
    middleName: yup.string(),
    gender: yup.string().oneOf(Object.values(Gender), "Gender is not a valid value!").required("Gender is required!"),
    relationship: yup.string().oneOf(Object.values(Relationship), "Relationship is not a valid value!").required("Relationship is required!"),
    email: yup
      .string()
      .trim()
      .email("Invalid email address!")
      .when("phoneNumber", { is: (phoneNumber?: string) => !phoneNumber, then: schema => schema.required(CONTACT_REQUIRED_MESSAGE) }),
    address: yup.string().required("Address is required!"),
    nationality: yup.string().required("Nationality is required!"),
    stateOfOrigin: yup.string().required("State of Origin is required!"),
    phoneNumber: yup.string().when("email", { is: (email?: string) => !email, then: schema => schema.required(CONTACT_REQUIRED_MESSAGE) }),
    secondaryPhoneNumber: yup.string(),
    branchId: yup.number().required("Branch is required!"),
  },
  [["email", "phoneNumber"]],
);

export const parentUploadSchema = yup.object().shape(
  {
    firstName: yup.string().trim().required("First Name is required!"),
    lastName: yup.string().trim().required("Last Name is required!"),
    middleName: yup.string(),
    gender: yup.string().oneOf(Object.values(Gender), "Gender is not a valid value!").required("Gender is required!"),
    email: yup
      .string()
      .trim()
      .email("Invalid email address!")
      .when("phoneNumber", { is: (phoneNumber?: string) => !phoneNumber, then: schema => schema.required(CONTACT_REQUIRED_MESSAGE) }),
    address: yup.string().required("Address is required!"),
    nationality: yup.string().required("Nationality is required!"),
    stateOfOrigin: yup.string().required("State of Origin is required!"),
    phoneNumber: yup.string().when("email", { is: (email?: string) => !email, then: schema => schema.required(CONTACT_REQUIRED_MESSAGE) }),
    secondaryPhoneNumber: yup.string(),
  },
  [["email", "phoneNumber"]],
);
