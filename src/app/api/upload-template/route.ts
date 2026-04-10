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
      { header: "dob", key: "dob" },
      { header: "nationality", key: "nationality" },
      { header: "stateOfOrigin", key: "stateOfOrigin" },
      { header: "address", key: "address" },
      { header: "class", key: "class" },
      { header: "arm", key: "arm" },
      { header: "admissionNumber", key: "admissionNumber" },
      { header: "email", key: "email" },
      { header: "parentEmail", key: "parentEmail" },
      { header: "phoneNumber", key: "phoneNumber" },
      { header: "secondaryPhoneNumber", key: "secondaryPhoneNumber" },
    ];

    worksheet.addRow({
      firstName: "Chinedu",
      lastName: "Okafor",
      middleName: "Emeka",
      gender: "MALE",
      dob: "2008-03-12",
      nationality: "Nigeria",
      stateOfOrigin: "Anambra",
      address: "12 Palm Street, Ikeja",
      class: "SS1",
      arm: "A",
      admissionNumber: "ADM001",
      email: "chinedu.okwu@example.com",
      parentEmail: "emeka.okwu@example.com",
      phoneNumber: "08034567891",
      secondaryPhoneNumber: "08034567891",
    });
  } else {
    worksheet.columns = [
      { header: "firstName", key: "firstName" },
      { header: "lastName", key: "lastName" },
      { header: "middleName", key: "middleName" },
      { header: "gender", key: "gender" },
      { header: "nationality", key: "nationality" },
      { header: "stateOfOrigin", key: "stateOfOrigin" },
      { header: "address", key: "address" },
      { header: "phoneNumber", key: "phoneNumber" },
      { header: "whatsappNumber", key: "secondaryPhoneNumber" },
      { header: "email", key: "email" },
    ];

    worksheet.addRow({
      firstName: "Chinedu",
      lastName: "Okafor",
      middleName: "Emeka",
      gender: "MALE",
      nationality: "Nigeria",
      stateOfOrigin: "Anambra",
      address: "12 Palm Street, Ikeja",
      phoneNumber: "08034567891",
      secondaryPhoneNumber: "08034567891",
      email: "chinedu.okwu@example.com",
    });
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
