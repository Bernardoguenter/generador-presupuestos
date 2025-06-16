import jsPDF from "jspdf";

export function convertPDF(client: string) {
  const pdfBody = document.getElementById("pdf");

  if (!pdfBody) {
    console.error("No se encontró el elemento con id 'pdf'.");
    return;
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  doc.html(pdfBody, {
    callback: (pdf) => {
      pdf.save(`presupuesto ${client}.pdf`);
    },
    x: 10,
    y: 10,
    html2canvas: {
      scale: 0.25,
      useCORS: true,
    },
    width: 210,
    windowWidth: 794,
  });
}

export async function getPDFBase64(): Promise<string | null> {
  const pdfBody = document.getElementById("pdf");

  if (!pdfBody) {
    console.error("No se encontró el elemento con id 'pdf'.");
    return null;
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  return new Promise((resolve) => {
    doc.html(pdfBody, {
      callback: (pdf) => {
        const pdfBlob = pdf.output("blob");
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(",")[1];
          resolve(base64String);
        };
        reader.readAsDataURL(pdfBlob);
      },
      x: 10,
      y: 10,
      html2canvas: {
        scale: 0.25,
        useCORS: true,
      },
      width: 210,
      windowWidth: 794,
    });
  });
}
export async function generatePDFBlobURL(): Promise<string | null> {
  const pdfBody = document.getElementById("pdf");

  if (!pdfBody) {
    console.error("No se encontró el elemento con id 'pdf'");
    return null;
  }

  return new Promise((resolve) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.html(pdfBody, {
      callback: (pdf) => {
        const blob = pdf.output("blob");
        const blobURL = URL.createObjectURL(blob);
        resolve(blobURL);
      },
      x: 10,
      y: 10,
      html2canvas: {
        scale: 0.25,
        useCORS: true,
      },
      width: 210,
      windowWidth: 794,
    });
  });
}
