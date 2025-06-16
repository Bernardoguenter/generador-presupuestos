import {
  Button,
  Form,
  GooglePlacesInput,
  HiddenInput,
  NumberInput,
  TextInput,
  CheckboxInput,
} from "../../../../components";
import { calculateBudgetSchema, type BudgetFormData } from "../../schema";
import { useMemo } from "react";
import { MaterialsSelect } from "./MaterialsSelect";
import { StructureSelect } from "./StructureSelect";
import { GutterInput } from "./GutterInput";
import {
  useAuthContext,
  useCompanyContext,
  usePDFContext,
  usePreferencesContext,
} from "../../../../common/context";
import { IncludesGatesInput } from "./IncludesGatesInput";
import { EnclousureHeightInput } from "./EnclousureHeightInput";
import { ColorSideSheetInput } from "./ColorSideSheetInput";
import {
  calculateDistance,
  calculateFreightPrice,
  getBudgetTotal,
} from "../../../../helpers/formulas";
import { formatDetails } from "../../../../helpers/formatData";
import { PDFComponent } from "./PDFComponent";

export const BudgetCalculatorForm = () => {
  const { authUser } = useAuthContext();
  const { preferences } = usePreferencesContext();
  const { company } = useCompanyContext();
  const { setPdfInfo, setShowPDF, showPDF, pdfInfo } = usePDFContext();

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
    } = formData;

    const newAddress = {
      address: address,
      lat: lat,
      lng: lng,
    };

    let newDistance = 0;
    if (company && company.address && includes_freight) {
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
        total: total.priceWithMarkup,
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
        totals: total,
        distance: newDistance,
        customer_address: newAddress.address,
        dataToSubmit: dataToSubmit,
      });

      if (total) {
        setShowPDF(true);
      }
    }
  };

  const defaultValues = useMemo(
    () => ({
      material: "Hierro torsionado",
      structure_type: "Galpón",
      width: 15,
      length: 25,
      height: 5,
      enclousure_height: 4.5,
      address: "",
      includes_freight: false,
      color_roof_sheet: false,
      color_side_sheet: false,
      includes_taxes: false,
      customer: "",
      has_gutter: false,
      gutter_metters: 0,
      gates_measurements: [],
      includes_gate: false,
      number_of_gates: 0,
      lng: 0,
      lat: 0,
    }),
    []
  );

  return (
    <div className="flex w-full  gap-8 ">
      <Form
        onSubmit={handleSubmit}
        schema={calculateBudgetSchema}
        defaultValues={defaultValues}
        className="mt-4 w-full lg:w-2/5">
        <h2 className="my-4 text-2xl font-medium">Nuevo Presupuesto</h2>
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
        <GooglePlacesInput
          name="address"
          label="Dirección"
        />
        <HiddenInput name="lng" />
        <HiddenInput name="lat" />
        <TextInput
          name="customer"
          label="Cliente"
        />
        <div className="flex justify-between items-start">
          <GutterInput />
        </div>
        <IncludesGatesInput />
        <CheckboxInput
          name="includes_freight"
          label="Incluye flete?"
        />
        <CheckboxInput
          name="color_roof_sheet"
          label="Techo a color?"
        />
        <ColorSideSheetInput />
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
      </Form>
      {showPDF && pdfInfo && <PDFComponent />}
    </div>
  );
};
