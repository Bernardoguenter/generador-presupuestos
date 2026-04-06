import { formatDetails } from "../../helpers/formatData";
import {
  calculateDistance,
  calculateFreightPrice,
  getSheetsFactor,
  getStructureBudgetTotal,
} from "../../helpers/formulas";
import type { StructurePDFInfo } from "../../helpers/types";
import type { StructureBudgetFormData } from "../../pages/budgets/schema";
import {
  useAuthContext,
  usePreferencesContext,
  useCompanyContext,
  usePDFContext,
} from "../context";

export const useStructureBudgetSubmit = () => {
  const { authUser } = useAuthContext();
  const { preferences } = usePreferencesContext();
  const { company } = useCompanyContext();
  const { setPdfInfo: setPdfInfoGeneric, setShowPDF } = usePDFContext();

  const setPdfInfo = setPdfInfoGeneric as React.Dispatch<
    React.SetStateAction<StructurePDFInfo | null>
  >;

  const handleStructureBudgetSubmit = async (
    formData: StructureBudgetFormData,
  ) => {
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
      distanceCalculation,
      distanceInKms,
      has_roof_membrane,
      has_sides_membrane,
      roof_sheets_option,
      sides_sheets_option,
    } = formData;

    const newAddress =
      includes_freight && distanceCalculation === "address"
        ? {
            address: address ?? "",
            lat: lat ?? 0,
            lng: lng ?? 0,
          }
        : null;

    let newDistance = 0;
    if (company && company.address && includes_freight && newAddress !== null) {
      newDistance = await calculateDistance(company.address, newAddress);
    } else {
      newDistance = distanceInKms;
    }

    const freight_price = includes_freight
      ? calculateFreightPrice(newDistance, preferences.km_price)
      : 0;

    const newGutter_metters = has_gutter ? gutter_metters : 0;
    const newEnclousure_height =
      structure_type === "Galpón" ? enclousure_height : [0];
    const newGates_measurements =
      structure_type === "Galpón" ? gates_measurements : [];
    const newNumber_of_gates =
      structure_type === "Galpón" ? number_of_gates : 0;
    const newColor_side_sheet =
      structure_type === "Galpón" ? color_side_sheet : false;

    const sideSheetFactor = getSheetsFactor(sides_sheets_option, preferences);
    const roofSheetFactor = getSheetsFactor(roof_sheets_option, preferences);

    const total = getStructureBudgetTotal(
      preferences,
      width,
      length,
      height,
      enclousure_height,
      structure_type,
      material,
      color_roof_sheet,
      newColor_side_sheet,
      newGutter_metters,
      newGates_measurements,
      includes_gate,
      includes_taxes,
      freight_price,
      has_gutter,
      has_roof_membrane,
      has_sides_membrane,
      sideSheetFactor,
      roofSheetFactor,
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
      width,
      sides_sheets_option,
      roof_sheets_option,
      has_roof_membrane,
      has_sides_membrane,
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
        total: total,
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
        distance:
          includes_freight && distanceCalculation === "distance"
            ? newDistance
            : null,
        has_roof_membrane,
        has_sides_membrane,
        sides_sheets_option,
        roof_sheets_option,
        estimatedDelivery: "",
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
        total: total,
        distance: newDistance,
        customer_address: newAddress?.address || null,
        dataToSubmit,
      });

      if (total) {
        setShowPDF(true);
      }
    }
  };

  return { handleStructureBudgetSubmit };
};
