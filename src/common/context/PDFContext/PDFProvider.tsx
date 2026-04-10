import { useMemo, useState, type ReactNode } from "react";
import { PDFContext } from "./PDFContext";
import type { SiloPDFInfo, StructurePDFInfo } from "@/types";

export function PDFProvider({ children }: { children: ReactNode }) {
  const [showPDF, setShowPDF] = useState(false);
  const [pdfInfo, setPdfInfo] = useState<SiloPDFInfo | StructurePDFInfo | null>(
    null
  );

  const values = useMemo(
    () => ({ showPDF, setShowPDF, pdfInfo, setPdfInfo }),
    [showPDF, pdfInfo]
  );

  return <PDFContext.Provider value={values}>{children}</PDFContext.Provider>;
}

