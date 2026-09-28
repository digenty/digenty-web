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
      return `"${stringField.replace(/"/g, '""')}"`;
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

/**
 * Exports a DOM element to a PDF file.
 *
 * @param elementId - The ID of the DOM element to capture
 * @param filename - The name of the file to be saved (e.g., "report.pdf")
 */
export const exportToPDF = async (elementId: string, filename: string, ignoreClass = "pdf-ignore") => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  const { default: html2canvas } = await import("html2canvas");
  const { jsPDF } = await import("jspdf");

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    ignoreElements: el => el.classList.contains(ignoreClass),
  });

  // JPEG instead of PNG: a rendered document canvas at scale 2 produces a multi-megabyte PNG
  // (some viewers, especially on mobile, fail to open a resulting PDF that large), while JPEG
  // at high quality is visually lossless for this content and a fraction of the size.
  const imgData = canvas.toDataURL("image/jpeg", 0.92);
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [canvas.width / 2, canvas.height / 2],
    compress: true,
  });

  pdf.addImage(imgData, "JPEG", 0, 0, canvas.width / 2, canvas.height / 2);
  pdf.save(filename);
};

/**
 * Exports a DOM element to a PNG image and triggers a browser download.
 * The image is sized to the element's full content, so nothing gets cropped or paginated.
 *
 * @param elementId - The ID of the DOM element to capture
 * @param filename - The name of the file to be saved (e.g., "invoice.png")
 */
export const exportToImage = async (elementId: string, filename: string, ignoreClass = "pdf-ignore") => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  const { default: html2canvas } = await import("html2canvas");

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    ignoreElements: el => el.classList.contains(ignoreClass),
  });

  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
