import { useEffect, useMemo } from "react";
import { Button, Form } from "../../../components";
import { ResetFormButton } from "../components/ResetFormButton";
import { calculateSiloBudgetSchema, type SiloBudgetFormData } from "../schema";
import type { SiloBudget } from "../../../helpers/types";
import { usePDFContext } from "../../../common/context";
import { useSiloBudgetSubmit } from "../../../common/hooks";
import { SiloBudgetFormContent } from "../components/SiloBudgetFormContent";
import { PDFSiloComponent } from "../components/PDFSiloComponent";

interface Props {
  budget: SiloBudget;
  getBudget: (id: string, type: "silo" | "structure") => void;
  handleView: () => void;
  viewDetail: boolean;
}

export const SiloBudgetEditForm = ({
  budget,
  getBudget,
  handleView,
  viewDetail,
}: Props) => {
  const { setPdfInfo, setShowPDF } = usePDFContext();
  const { handleSiloBudgetSubmit } = useSiloBudgetSubmit();

  useEffect(() => {
    setPdfInfo({
      customer: budget.customer,
      includes_taxes: budget.includes_taxes,
      freight_price: budget.freight_price,
      includes_freight: budget.includes_freight,
      total: budget.total * (1 + budget.budget_markup / 100),
      dataToSubmit: budget,
    });
  }, [budget, setPdfInfo]);

  const defaultValues = useMemo(
    () => ({
      silos: budget.silos,
      includes_taxes: budget.includes_taxes,
      includes_freight: budget.includes_freight,
      customer: budget.customer,
      address: budget.address?.address,
      lng: budget.address?.lng,
      lat: budget.address?.lat,
      budget_markup: budget.budget_markup,
      distanceCalculation:
        budget.distance && budget.distance > 0 ? "distance" : "address",
      distanceInKms:
        budget.includes_freight && budget.distance ? budget.distance : 0,
    }),
    [budget]
  );

  return (
    <div className="flex lg:flex-row flex-col w-full gap-8 ">
      <Form
        onSubmit={handleSiloBudgetSubmit}
        schema={calculateSiloBudgetSchema}
        defaultValues={defaultValues}
        className="mt-4 w-full lg:w-1/2">
        <SiloBudgetFormContent />
        <Button
          type="submit"
          color="info"
          styles="mt-4">
          Crear Vista Previa
        </Button>
        <ResetFormButton<SiloBudgetFormData>
          setShowPDF={setShowPDF}
          defaultValues={defaultValues}
        />
      </Form>
      {viewDetail && (
        <PDFSiloComponent
          getBudget={getBudget}
          handleView={handleView}
        />
      )}
    </div>
  );
};
