import jsPDF from "jspdf";
import { retrieveFileFromBucket } from "@/common/lib";
import type { PDFImage, Silo } from "@/types";

export const waitNextFrame = () =>
  new Promise((resolve) => requestAnimationFrame(resolve));

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
      addImagesToPDF(pdf, images);

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

/**
 * Agrega las imágenes al final del PDF, después del presupuesto.
 * - Sin layout (silos): una por hoja, como siempre.
 * - "half" (fotos 3D): dos por hoja vertical, sin deformar.
 * - "landscape" (croquis): una hoja A4 apaisada entera.
 */
export function addImagesToPDF(pdf: jsPDF, images: PDFImage[]) {
  let halfSlot = 0;
  images.forEach((img) => {
    if (img.layout === "landscape") {
      pdf.addPage("a4", "landscape");
      pdf.addImage(img.src, "JPEG", 0, 0, 297, 210);
      halfSlot = 0;
      return;
    }

    if (img.layout === "half") {
      if (halfSlot === 0) pdf.addPage("a4", "portrait");
      const top = halfSlot === 0 ? 15 : 152;
      const ratio = img.width && img.height ? img.height / img.width : 2 / 3;
      const w = Math.min(190, 120 / ratio);
      const h = w * ratio;
      if (img.title) {
        pdf.setFontSize(12);
        pdf.text(img.title, 10, top);
      }
      pdf.addImage(img.src, "JPEG", (210 - w) / 2, top + 4, w, h);
      halfSlot = halfSlot === 0 ? 1 : 0;
      return;
    }

    pdf.addPage("a4", "portrait");
    if (img.title) {
      pdf.text(img.title, 10, 20);
    }
    pdf.addImage(img.src, "JPEG", 10, 30, 190, 120);
    halfSlot = 0;
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

export async function getSiloPDFImages(silos: Silo[]): Promise<PDFImage[]> {
  const images = await Promise.all(
    silos.map(async (silo) => {
      const { data } = await retrieveFileFromBucket(
        "silos_img",
        `${silo.type}/${silo.capacity}.webp`,
      );

      return {
        src: data.publicUrl,
        title: buildSiloTitle(silo),
      };
    }),
  );

  if (shouldAddFiberBaseImage(silos)) {
    const { data } = await retrieveFileFromBucket(
      "silos_img",
      "feeder_silos/silobasefibra.jpeg",
    );

    images.push({
      src: data.publicUrl,
      title: "Base de Fibra",
    });
  }

  return images;
}

function shouldAddFiberBaseImage(silos: Silo[]) {
  return silos.some(
    (silo) => silo.type === "feeder_silos" && silo.has_fiber_base === true,
  );
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
