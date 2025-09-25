import { createContext, use } from "react";
import type { SiloPDFInfo, StructurePDFInfo } from "../../../helpers/types";

export interface PDFContextInterface {
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
    throw new Error("usePDFContext must be used within an AuthProvider");
  }
  return context;
}
