import { useEffect, useMemo } from "react";
import { Button, Form } from "../../../components";
import { PDFStructureComponent } from "../components/PDFStructureComponent";
import { ResetFormButton } from "../components/ResetFormButton";
import {
  calculateStructureBudgetSchema,
  type StructureBudgetFormData,
} from "../schema";
import type { StructureBudget } from "../../../helpers/types";
import { usePDFContext } from "../../../common/context";
import { useStructureBudgetSubmit } from "../../../common/hooks";
import { StructureBudgetFormContent } from "../components/StructureBudgetFormContent";

interface Props {
  budget: StructureBudget;
  getBudget: (id: string, type: "silo" | "structure") => void;
  handleView: () => void;
  viewDetail: boolean;
}

export const BudgetEditForm = ({
  budget,
  getBudget,
  handleView,
  viewDetail,
}: Props) => {
  const { setPdfInfo, setShowPDF } = usePDFContext();
  const { handleStructureBudgetSubmit } = useStructureBudgetSubmit();

  useEffect(() => {
    setPdfInfo({
      customer: budget.customer,
      details: budget.details,
      structure_type: budget.structure_type,
      width: budget.width,
      length: budget.length,
      height: budget.height,
      enclousure_height: budget.enclousure_height,
      includes_gate: budget.includes_gate,
      includes_taxes: budget.includes_taxes,
      freight_price: budget.freight_price,
      includes_freight: budget.includes_freight,
      total: budget.total * (1 + budget.budget_markup / 100),
      dataToSubmit: budget,
    });
  }, [budget, setPdfInfo]);

  const defaultValues = useMemo(
    () => ({
      material: budget.material,
      structure_type: budget.structure_type,
      width: budget.width,
      length: budget.length,
      height: budget.height,
      enclousure_height: budget.enclousure_height,
      includes_freight: budget.includes_freight,
      color_roof_sheet: budget.color_roof_sheet,
      color_side_sheet: budget.color_side_sheet,
      includes_taxes: budget.includes_taxes,
      customer: budget.customer,
      has_gutter: budget.has_gutter,
      gutter_metters: budget.gutter_metters,
      gates_measurements: budget.gates_measurements ?? [],
      includes_gate: budget.includes_gate,
      number_of_gates: budget.number_of_gates,
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
        onSubmit={handleStructureBudgetSubmit}
        schema={calculateStructureBudgetSchema}
        defaultValues={defaultValues}
        className="mt-4 w-full lg:w-1/2">
        <StructureBudgetFormContent />
        <Button
          type="submit"
          color="info"
          styles="mt-4">
          Crear Vista Previa
        </Button>
        <ResetFormButton<StructureBudgetFormData>
          setShowPDF={setShowPDF}
          defaultValues={defaultValues}
        />
      </Form>
      {viewDetail && (
        <PDFStructureComponent
          getBudget={getBudget}
          handleView={handleView}
        />
      )}
    </div>
  );
};
