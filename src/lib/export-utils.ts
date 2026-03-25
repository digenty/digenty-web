/**
 * Exports data to a CSV file and triggers a browser download.
 *
 * @param filename - The name of the file to be saved (e.g., "export.csv")
 * @param headers - An array of strings representing the CSV headers
 * @param rows - A 2D array of strings or numbers representing the CSV data rows
 */
export const exportToCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
  const escapeCSV = (field: string | number) => {
    const stringField = String(field);
    if (stringField.includes(",") || stringField.includes('"') || stringField.includes("\n")) {
      return `"${stringField.replace(/"/staff/g, '""')}"`;
    }
    return stringField;
  };

  const csvContent = [headers.map(escapeCSV).join(","), ...rows.map(row => row.map(escapeCSV).join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// /**
//  * Exports a DOM element to a PDF file.
//  *
//  * @param elementId - The ID of the DOM element to capture
//  * @param filename - The name of the file to be saved (e.g., "report.pdf")
//  */
// export const exportToPDF = async (elementId: string, filename: string) => {
//   const element = document.getElementById(elementId);
//   if (!element) {
//     console.error(`Element with id ${elementId} not found`);
//     return;
//   }

//   const { default: html2canvas } = await import("html2canvas");
//   const { jsPDF } = await import("jspdf");

//   try {
//     const canvas = await html2canvas(element, {
//       scale: 2,
//       useCORS: true,
//       logging: false,
//     });

//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF({
//       orientation: "portrait",
//       unit: "px",
//       format: [canvas.width / 2, canvas.height / 2],
//     });

//     pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
//     pdf.save(filename);
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//   }
// };
