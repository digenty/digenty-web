import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const entity = searchParams.get("entity");

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`${entity} Template`);

  if (entity === "Students") {
    worksheet.columns = [
      { header: "First Name", key: "firstName" },
      { header: "Last Name", key: "lastName" },
      { header: "Middle Name (Optional)", key: "middleName" },
      { header: "Gender", key: "gender" },
      { header: "Date of Birth", key: "dateOfBirth" },
      { header: "Nationality", key: "nationality" },
      { header: "State of Origin", key: "stateOfOrigin" },
      { header: "Home Address", key: "address" },
      { header: "School Branch (e.g Lagos, Ekiti, London, Nairobi)", key: "branch" },
      { header: "Class", key: "class" },
      { header: "Arm (e.g A, B, C)", key: "arm" },
      { header: "Department (e.g Science, Art)", key: "department" },
      { header: "Admission Number", key: "admissionNumber" },
      { header: "Parent Email Address", key: "email" },
      { header: "Parent Primary Phone Number", key: "emergencyContactNumber" },
    ];
  } else {
    worksheet.columns = [
      { header: "First Name", key: "firstName" },
      { header: "Last Name", key: "lastName" },
      { header: "Middle Name (Optional)", key: "middleName" },
      { header: "Gender", key: "gender" },
      { header: "Relationship", key: "relationship" },
      { header: "Nationality", key: "nationality" },
      { header: "State of Origin", key: "stateOfOrigin" },
      { header: "Home Address", key: "address" },
      { header: "School Branch (e.g Lagos, Ekiti, London, Nairobi)", key: "branch" },
      { header: "Primary Phone Number", key: "phoneNumber" },
      { header: "Secondary Phone Number", key: "secondaryPhoneNumber" },
      { header: "Email Address", key: "email" },
    ];
  }

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename='${entity}-template.xlsx'`,
    },
  });
}
