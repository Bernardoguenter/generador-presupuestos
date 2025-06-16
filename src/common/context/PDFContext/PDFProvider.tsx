import { useState, type ReactNode } from "react";
import { PDFContext } from "./PDFContext";
import type { PDFInfo } from "../../../helpers/types";

export function PDFProvider({ children }: { children: ReactNode }) {
  const [showPDF, setShowPDF] = useState(false);
  const [pdfInfo, setPdfInfo] = useState<PDFInfo | null>(null);

  const values = { showPDF, setShowPDF, pdfInfo, setPdfInfo };

  return <PDFContext.Provider value={values}>{children}</PDFContext.Provider>;
}
