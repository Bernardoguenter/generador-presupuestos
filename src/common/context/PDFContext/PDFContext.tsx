import { createContext, use } from "react";
import type { PDFInfo } from "../../../helpers/types";

export interface PDFContextInterface {
  showPDF: boolean;
  setShowPDF: React.Dispatch<React.SetStateAction<boolean>>;
  pdfInfo: PDFInfo | null;
  setPdfInfo: React.Dispatch<React.SetStateAction<PDFInfo | null>>;
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
