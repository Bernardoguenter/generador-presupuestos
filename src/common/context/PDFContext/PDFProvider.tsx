import { useState, type ReactNode } from "react";
import { PDFContext } from "./PDFContext";
import type { SiloPDFInfo, StructurePDFInfo } from "../../../helpers/types";

export function PDFProvider({ children }: { children: ReactNode }) {
  const [showPDF, setShowPDF] = useState(false);
  const [pdfInfo, setPdfInfo] = useState<SiloPDFInfo | StructurePDFInfo | null>(
    null
  );

  const values = { showPDF, setShowPDF, pdfInfo, setPdfInfo };

  return <PDFContext.Provider value={values}>{children}</PDFContext.Provider>;
}
