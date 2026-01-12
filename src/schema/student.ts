import { BoardingStatus, Gender, StudentStatus } from "@/types";
import * as yup from "yup";

export const studentSchema = yup.object().shape({
  firstName: yup.string().trim().required("First Name is required!"),
  lastName: yup.string().trim().required("Last Name is required!"),
  middleName: yup.string(),
  gender: yup.string().oneOf(Object.values(Gender), "Gender is not a valid value!").required("Gender is required!"),
  email: yup.string(),
  boardingStatus: yup.string().oneOf(Object.values(BoardingStatus), "Boarding status is not a valid value!").required("Boarding status is required!"),
  dateOfBirth: yup.string().required("Date of Birth is required!"),
  address: yup.string().required("Address is required!"),
  emergencyContactName: yup.string(),
  nationality: yup.string(),
  stateOfOrigin: yup.string(),
  emergencyContactNumber: yup.string(),
  primaryPhoneNumber: yup.string(),
  secondaryPhoneNumber: yup.string(),
  studentStatus: yup.string().oneOf(Object.values(StudentStatus), "Student's status is not a valid value!").required("Student's status is required!"),
  admissionNumber: yup.string(),
  medicalInformation: yup.string(),
  role: yup.string(),
});
