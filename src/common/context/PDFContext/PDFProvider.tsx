import { useMemo, useState, type ReactNode } from "react";
import {
  PDFContext,
  defaultStructurePDFOptions,
  type StructurePDFOptions,
} from "./PDFContext";
import type { SiloPDFInfo, StructurePDFInfo } from "@/types";

export function PDFProvider({ children }: { children: ReactNode }) {
  const [showPDF, setShowPDF] = useState(false);
  const [pdfInfo, setPdfInfo] = useState<SiloPDFInfo | StructurePDFInfo | null>(
    null
  );

  const [pdfOptions, setPdfOptions] = useState<StructurePDFOptions>(
    defaultStructurePDFOptions
  );

  const values = useMemo(
    () => ({ showPDF, setShowPDF, pdfInfo, setPdfInfo, pdfOptions, setPdfOptions }),
    [showPDF, pdfInfo, pdfOptions]
  );

  return <PDFContext.Provider value={values}>{children}</PDFContext.Provider>;
}

