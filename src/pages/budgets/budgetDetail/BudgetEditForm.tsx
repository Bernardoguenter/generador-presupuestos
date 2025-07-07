import { useEffect, useMemo } from "react";
import {
  useAuthContext,
  usePreferencesContext,
  useCompanyContext,
  usePDFContext,
} from "../../../common/context";
import {
  NumberInput,
  TextInput,
  CheckboxInput,
  Button,
  Form,
} from "../../../components";
import { FreightInput } from "../../../components/FreightInput";
import { formatDetails } from "../../../helpers/formatData";
import {
  calculateDistance,
  calculateFreightPrice,
  getBudgetTotal,
} from "../../../helpers/formulas";
import { ColorSideSheetInput } from "../calculator/components/ColorSideSheetInput";
import { EnclousureHeightInput } from "../calculator/components/EnclousureHeightInput";
import { GutterInput } from "../calculator/components/GutterInput";
import { IncludesGatesInput } from "../calculator/components/IncludesGatesInput";
import { MaterialsSelect } from "../calculator/components/MaterialsSelect";
import { PDFComponent } from "../calculator/components/PDFComponent";
import { ResetFormButton } from "../calculator/components/ResetFormButton";
import { StructureSelect } from "../calculator/components/StructureSelect";
import { type BudgetFormData, calculateBudgetSchema } from "../schema";
import type { Budget } from "../../../helpers/types";

interface Props {
  budget: Budget;
  getBudget: (id: string) => void;
  handleView: () => void;
  viewDetail: boolean;
}

export const BudgetEditForm = ({
  budget,
  getBudget,
  handleView,
  viewDetail,
}: Props) => {
  const { authUser } = useAuthContext();
  const { preferences } = usePreferencesContext();
  const { company } = useCompanyContext();
  const { setPdfInfo, setShowPDF } = usePDFContext();

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
  }, []);

  const handleSubmit = async (formData: BudgetFormData) => {
    const {
      color_roof_sheet,
      color_side_sheet,
      enclousure_height,
      gates_measurements,
      gutter_metters,
      has_gutter,
      height,
      includes_freight,
      includes_gate,
      includes_taxes,
      length,
      material,
      number_of_gates,
      structure_type,
      width,
      address,
      lat,
      lng,
      customer,
      budget_markup,
    } = formData;

    const newAddress = includes_freight
      ? {
          address: address ?? "",
          lat: lat ?? 0,
          lng: lng ?? 0,
        }
      : null;

    let newDistance = 0;
    if (company && company.address && includes_freight && newAddress !== null) {
      newDistance = await calculateDistance(company?.address, newAddress);
    }
    const freight_price = includes_freight
      ? calculateFreightPrice(newDistance, preferences.km_price)
      : 0;

    const newGutter_metters = has_gutter ? gutter_metters : 0;
    const newEnclousure_height =
      structure_type === "Galpón" ? enclousure_height : 0;
    const newGates_measurements =
      structure_type === "Galpón" ? gates_measurements : [];
    const newNumber_of_gates =
      structure_type === "Galpón" ? number_of_gates : 0;
    const newColor_side_sheet =
      structure_type === "Galpón" ? color_side_sheet : false;

    const total = getBudgetTotal(
      preferences,
      width,
      length,
      height,
      newEnclousure_height,
      structure_type,
      material,
      color_roof_sheet,
      newColor_side_sheet,
      newGutter_metters,
      newGates_measurements,
      includes_gate,
      includes_taxes,
      freight_price,
      has_gutter
    );

    const newDetails = formatDetails(
      structure_type,
      material,
      color_roof_sheet,
      color_side_sheet,
      includes_gate,
      gates_measurements,
      has_gutter,
      gutter_metters,
      width
    );

    if (authUser) {
      const dataToSubmit = {
        material,
        customer,
        structure_type,
        width,
        length,
        height,
        includes_freight,
        includes_gate,
        includes_taxes,
        created_by: authUser?.id,
        details: newDetails,
        freight_price,
        total: total.finalPriceInDollars,
        gutter_metters: newGutter_metters,
        enclousure_height: newEnclousure_height,
        gates_measurements: newGates_measurements,
        number_of_gates: newNumber_of_gates,
        color_side_sheet: newColor_side_sheet,
        color_roof_sheet,
        has_gutter,
        address: newAddress,
        description: "",
        paymentMethods: "",
        caption: "",
        budget_markup,
      };

      setPdfInfo({
        customer,
        details: newDetails,
        structure_type,
        width,
        length,
        height,
        enclousure_height,
        includes_gate,
        includes_taxes,
        freight_price,
        includes_freight,
        total: total.priceWithMarkup,
        distance: newDistance,
        customer_address: newAddress?.address || null,
        dataToSubmit: dataToSubmit,
      });

      if (total) {
        setShowPDF(true);
      }
    }
  };

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
    }),
    [budget]
  );

  return (
    <div className="flex lg:flex-row flex-col w-full gap-8 ">
      <Form
        onSubmit={handleSubmit}
        schema={calculateBudgetSchema}
        defaultValues={defaultValues}
        className="mt-4 w-full lg:w-2/5">
        <MaterialsSelect />
        <StructureSelect />
        <NumberInput
          label="Ancho"
          name="width"
        />
        <NumberInput
          label="Largo"
          name="length"
        />
        <NumberInput
          label="Alto"
          name="height"
        />
        <EnclousureHeightInput />
        <FreightInput />
        <TextInput
          name="customer"
          label="Cliente"
        />
        <div className="flex justify-between items-start">
          <GutterInput />
        </div>
        <IncludesGatesInput />
        <CheckboxInput
          name="color_roof_sheet"
          label="Techo a color?"
        />
        <ColorSideSheetInput />
        <NumberInput
          label="Margen extra de presupuesto"
          name="budget_markup"
        />
        <CheckboxInput
          name="includes_taxes"
          label="Incluye IVA?"
        />
        <Button
          type="submit"
          color="info"
          styles="mt-4">
          Crear Vista Previa
        </Button>
        <ResetFormButton
          setShowPDF={setShowPDF}
          defaultValues={defaultValues}
        />
      </Form>
      {viewDetail && (
        <PDFComponent
          getBudget={getBudget}
          handleView={handleView}
        />
      )}
    </div>
  );
};
