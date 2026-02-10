import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const entity = searchParams.get("entity");

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`${entity} Template`);

  if (entity === "Students") {
    worksheet.columns = [
      { header: "firstName", key: "firstName" },
      { header: "lastName", key: "lastName" },
      { header: "middleName", key: "middleName" },
      { header: "gender", key: "gender" },
      { header: "dateOfBirth", key: "dateOfBirth" },
      { header: "nationality", key: "nationality" },
      { header: "stateOfOrigin", key: "stateOfOrigin" },
      { header: "address", key: "address" },
      { header: "branch", key: "branch" },
      { header: "class", key: "class" },
      { header: "arm", key: "arm" },
      { header: "department", key: "department" },
      { header: "admissionNumber", key: "admissionNumber" },
      { header: "email", key: "email" },
      { header: "emergencyContactNumber", key: "emergencyContactNumber" },
    ];
  } else {
    worksheet.columns = [
      { header: "firstName", key: "firstName" },
      { header: "lastName", key: "lastName" },
      { header: "middleName", key: "middleName" },
      { header: "gender", key: "gender" },
      { header: "relationship", key: "relationship" },
      { header: "nationality", key: "nationality" },
      { header: "stateOfOrigin", key: "stateOfOrigin" },
      { header: "address", key: "address" },
      { header: "branch", key: "branch" },
      { header: "phoneNumber", key: "phoneNumber" },
      { header: "secondaryPhoneNumber", key: "secondaryPhoneNumber" },
      { header: "email", key: "email" },
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
