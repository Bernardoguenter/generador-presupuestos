import { createContext, use } from "react";
import type { SiloPDFInfo, StructurePDFInfo } from "@/types";

/** Opciones del PDF de galpón que no se guardan con el presupuesto */
export interface StructurePDFOptions {
  /** 2 = dos aguas, 1 = un agua */
  roofSlopes: 1 | 2;
  /** Agregar la hoja de fotos 3D con medidas */
  includeRenders: boolean;
}

export const defaultStructurePDFOptions: StructurePDFOptions = {
  roofSlopes: 2,
  includeRenders: true,
};

export interface PDFContextInterface {
  pdfOptions: StructurePDFOptions;
  setPdfOptions: React.Dispatch<React.SetStateAction<StructurePDFOptions>>;
  showPDF: boolean;
  setShowPDF: React.Dispatch<React.SetStateAction<boolean>>;
  pdfInfo: SiloPDFInfo | StructurePDFInfo | null;
  setPdfInfo: React.Dispatch<
    React.SetStateAction<SiloPDFInfo | StructurePDFInfo | null>
  >;
}

export const PDFContext = createContext<PDFContextInterface | undefined>(
  undefined
);

export function usePDFContext() {
  const context = use(PDFContext);
  if (!context) {
    throw new Error("usePDFContext must be used within a PDFProvider");
  }
  return context;
}

