import { BoardingStatus, Gender, AdmissionStatus, JoinedTermEnum } from "@/types";
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
  nationality: yup.string().required("Nationality is required!"),
  stateOfOrigin: yup.string().required("State of Origin is required!"),
  emergencyContactNumber: yup.string(),
  phoneNumber: yup.string(),
  secondaryPhoneNumber: yup.string(),
  admissionStatus: yup
    .string()
    .oneOf(Object.values(AdmissionStatus), "Student's status is not a valid value!")
    .required("Student's status is required!"),
  admissionNumber: yup.string(),
  medicalInformation: yup.string(),
  branchId: yup.number().required("Branch is required!"),
  classId: yup.number().required("Class is required!"),
  armId: yup.number().required("Arm is required!"),
  departmentId: yup.number().nullable(),
  joinedSchoolTerm: yup
    .string()
    .oneOf(Object.values(JoinedTermEnum), "Term must be either FIRST, SECOND or THIRD")
    .required("Joined School Term is requred!"),
  joinedSchoolSession: yup.string().required("Joined School Session is required!"),
});

export const studentUploadSchema = yup.object().shape({
  firstName: yup.string().trim().required("First Name is required!"),
  lastName: yup.string().trim().required("Last Name is required!"),
  middleName: yup.string(),
  gender: yup.string().oneOf(Object.values(Gender), "Gender is not a valid value!").required("Gender is required!"),
  email: yup.string(),
  dateOfBirth: yup.string().required("Date of Birth is required!"),
  address: yup.string().required("Address is required!"),
  nationality: yup.string().required("Nationality is required!"),
  stateOfOrigin: yup.string().required("State of Origin is required!"),
  emergencyContactNumber: yup.string(),
  phoneNumber: yup.string(),
  admissionNumber: yup.string(),
  branch: yup.number().required("Branch is required!"),
  class: yup.string().required("Class is required!"),
  arm: yup.string().required("Arm is required!"),
});
