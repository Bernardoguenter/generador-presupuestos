import { formatDetails } from "@/helpers";
import {
  calculateDistance,
  calculateFreightPrice,
  getSheetsFactor,
  getStructureBudgetTotal,
} from "@/helpers";
import type { StructurePDFInfo, StructureBudget } from "@/types";
import type { StructureBudgetFormData } from "@/pages/budgets/schema";
import {
  useAuthContext,
  usePreferencesContext,
  useCompanyContext,
  usePDFContext,
} from "@/common/context";
import { useMemo } from "react";

export const useStructureBudgetSubmit = (initialBudget?: StructureBudget) => {
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

    const total = getStructureBudgetTotal({
      preferences,
      width,
      length,
      height,
      enclousure_height,
      structure_type,
      material,
      color_roof_sheet,
      color_side_sheet: newColor_side_sheet,
      gutter_metters: newGutter_metters,
      gates_measurements: newGates_measurements,
      includes_gate,
      includes_taxes,
      freight_price,
      has_gutter,
      has_roof_membrane,
      has_sides_membrane,
      sideSheetFactor,
      roofSheetFactor,
    });

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
        dataToSubmit,
      });

      if (total) {
        setShowPDF(true);
      }
    }
  };

  const defaultValues: StructureBudgetFormData = useMemo(() => {
    if (initialBudget) {
      return {
        material: initialBudget.material,
        structure_type: initialBudget.structure_type,
        width: initialBudget.width,
        length: initialBudget.length,
        height: initialBudget.height,
        enclousure_height: initialBudget.enclousure_height,
        includes_freight: initialBudget.includes_freight,
        color_roof_sheet: initialBudget.color_roof_sheet,
        color_side_sheet: initialBudget.color_side_sheet,
        includes_taxes: initialBudget.includes_taxes,
        customer: initialBudget.customer,
        has_gutter: initialBudget.has_gutter,
        gutter_metters: initialBudget.gutter_metters,
        gates_measurements: initialBudget.gates_measurements ?? [],
        includes_gate: initialBudget.includes_gate,
        number_of_gates: initialBudget.number_of_gates,
        address: initialBudget.address?.address,
        lng: initialBudget.address?.lng,
        lat: initialBudget.address?.lat,
        budget_markup: initialBudget.budget_markup,
        distanceCalculation:
          initialBudget.distance && initialBudget.distance > 0
            ? "distance"
            : "address",
        distanceInKms:
          initialBudget.includes_freight && initialBudget.distance
            ? initialBudget.distance
            : 0,
        estimatedDelivery: initialBudget.estimatedDelivery,
        has_sides_membrane: initialBudget.has_sides_membrane,
        has_roof_membrane: initialBudget.has_roof_membrane,
        sides_sheets_option: initialBudget.sides_sheets_option,
        roof_sheets_option: initialBudget.roof_sheets_option,
        uniform_enclousure: Array.isArray(initialBudget.enclousure_height)
          ? initialBudget.enclousure_height.every(
              (val) => val === initialBudget.enclousure_height[0],
            )
          : false,
      };
    }

    return {
      material: "Hierro torsionado",
      structure_type: "Galpón",
      width: 15,
      length: 25,
      height: 5,
      enclousure_height: [4.5, 4.5, 4.5, 4.5],
      includes_freight: false,
      distanceCalculation: "distance",
      distanceInKms: 0,
      color_roof_sheet: false,
      color_side_sheet: false,
      includes_taxes: true,
      customer: "",
      has_gutter: false,
      gutter_metters: 0,
      gates_measurements: [{ width: 5, height: 4.5 }],
      includes_gate: true,
      number_of_gates: 1,
      address: "",
      lng: 0,
      lat: 0,
      budget_markup: 0,
      roof_sheets_option: "Cincalum n°25 acanalada",
      sides_sheets_option: "Cincalum n°25 acanalada",
      has_roof_membrane: false,
      has_sides_membrane: false,
      uniform_enclousure: true,
    };
  }, [initialBudget]);

  return { handleStructureBudgetSubmit, defaultValues };
};
