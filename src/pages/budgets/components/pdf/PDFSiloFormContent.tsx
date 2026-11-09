import { useEffect, useRef, useState } from "react";
import type { SiloBudget } from "@/types";
import { PDFViewComponent } from "../../budgetDetail/pdf/PDFViewComponent";
import { Button } from "@/components";
import { usePDFContext } from "@/common/context";
import { useFormContext, useWatch } from "react-hook-form";
import { BudgetHeader } from "../../budgetDetail/pdf/BudgetHeader";
import { BudgetFooter } from "../../budgetDetail/pdf/BudgetFooter";
import { PDFPaymentMethods } from "./PDFPaymentMethods";
import { PDFSiloTable } from "./PDFSiloTable";
import { PDFEstimatedDelivery } from "./PDFEstimatedDelivery";

type Draft = { key: string; budget: SiloBudget };

interface Props {
  /** Arma el borrador del presupuesto con los valores del formulario */
  buildDraft?: (values: unknown) => Draft | "ready" | "pending";
  /** Se llama cuando el borrador ya está dibujado (oculto) */
  onDraftRendered?: (element: HTMLElement, key: string, budget: SiloBudget) => Promise<boolean>;
}

export const PDFSiloFormContent = ({ buildDraft, onDraftRendered }: Props) => {
  const { pdfInfo } = usePDFContext();
  const { control, setValue } = useFormContext();
  const paymentMethods = useWatch({ control, name: "paymentMethods" });

  const caption = useWatch({ control, name: "caption" });
  const estimatedDelivery = useWatch({ control, name: "estimatedDelivery" });

  useEffect(() => {
    setValue("caption", caption);
  }, [caption, setValue]);

  useEffect(() => {
    setValue("paymentMethods", paymentMethods);
  }, [paymentMethods, setValue]);

  useEffect(() => {
    setValue("estimatedDelivery", estimatedDelivery);
  }, [estimatedDelivery, setValue]);

  // Arma el PDF de antemano (un segundo después del último cambio), así al
  // confirmar se abre directo el menú de compartir.
  const allValues = useWatch({ control });
  const valuesKey = JSON.stringify(allValues);
  const [draft, setDraft] = useState<Draft | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef<HTMLDivElement>(null);

  // Mientras se arma, el botón espera: así el toque abre directo "Compartir".
  const [preparing, setPreparing] = useState<boolean>(!!buildDraft);

  useEffect(() => {
    if (!buildDraft) return;
    setPreparing(true);
    const t = setTimeout(() => {
      const d = buildDraft(JSON.parse(valuesKey));
      if (d === "ready") setPreparing(false);
      else if (d !== "pending") setDraft(d);
    }, 500);
    return () => clearTimeout(t);
  }, [buildDraft, valuesKey]);

  useEffect(() => {
    const el = draftRef.current?.querySelector<HTMLElement>("#pdf-draft");
    if (!draft || !el || !onDraftRendered) return;
    let active = true;
    onDraftRendered(el, draft.key, draft.budget).then((ok) => {
      if (ok && active) setPreparing(false);
    });
    return () => {
      active = false;
    };
  }, [draft, onDraftRendered]);

  return (
    <div
      ref={wrapperRef}
      className="mt-16 bg-white  p-4 lg:p-8 w-full text-black">
      <BudgetHeader customer={pdfInfo?.dataToSubmit?.customer ?? ""} />
      <PDFSiloTable />
      <PDFPaymentMethods />
      <PDFEstimatedDelivery />
      <BudgetFooter />
      <Button
        type="submit"
        color="info"
        disabled={preparing}>
        {preparing ? (
          <span className="inline-flex items-center justify-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
            />
            Preparando el PDF...
          </span>
        ) : (
          "Confirmar Presupuesto"
        )}
      </Button>
      {draft && (
        <div
          ref={draftRef}
          aria-hidden="true"
          style={{
            position: "fixed",
            left: "-10000px",
            top: 0,
            width: wrapperRef.current?.offsetWidth ?? 390,
          }}>
          <PDFViewComponent
            budget={draft.budget}
            type="silo"
            id="pdf-draft"
          />
        </div>
      )}
    </div>
  );
};
