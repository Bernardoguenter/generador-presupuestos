import jsPDF from "jspdf";
import { retriveFileFromBucket } from "@/common/lib";
import type { Silo } from "@/helpers/types";

export function convertPDF(client: string, images: PDFImage[] = []) {
  const pdfBody = document.getElementById("pdf");
  if (!pdfBody) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  doc.html(pdfBody, {
    callback: (pdf) => {
      if (images.length > 0) {
        images.forEach((img) => {
          pdf.addPage();
          if (img.title) {
            pdf.text(img.title, 10, 20);
          }
          pdf.addImage(img.src, "JPEG", 10, 30, 190, 120);
        });
      }

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

export type PDFImage = {
  src: string;
  title?: string;
};

export async function getSiloPDFImages(silos: Silo[]): Promise<PDFImage[]> {
  const images = await Promise.all(
    silos.map(async (silo) => {
      const { data } = await retriveFileFromBucket(
        "silos_img",
        `${silo.type}/${silo.capacity}.webp`,
      );

      return {
        src: data.publicUrl,
        title: buildSiloTitle(silo),
      };
    }),
  );

  return images;
}

function buildSiloTitle(silo: Silo) {
  let title =
    silo.type === "airbase_silos"
      ? `Silo Base Aérea ${silo.capacity}`
      : `Silo Comedero ${silo.capacity}`;

  if (silo.type === "airbase_silos" && silo.cone_base !== "estandar") {
    title += ` con Base Cono ${silo.cone_base}°`;
  }

  return title;
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
