import {
  calculateDistance,
  calculateFreightPrice,
  getSiloBudgetTotal,
} from "@/helpers";
import type { SiloBudgetFormData } from "@/pages/budgets/schema";
import type { SiloBudget, SiloPDFInfo } from "@/types";
import {
  useAuthContext,
  usePreferencesContext,
  useCompanyContext,
  usePDFContext,
} from "@common/context";
import { useMemo } from "react";

export const useSiloBudgetSubmit = (initialBudget?: SiloBudget) => {
  const { authUser } = useAuthContext();
  const { preferences } = usePreferencesContext();
  const { company } = useCompanyContext();
  const { setPdfInfo: setPdfInfoGeneric, setShowPDF } = usePDFContext();

  const setPdfInfo = setPdfInfoGeneric as React.Dispatch<
    React.SetStateAction<SiloPDFInfo | null>
  >;

  const handleSiloBudgetSubmit = async (formData: SiloBudgetFormData) => {
    const {
      includes_freight,
      distanceCalculation,
      address,
      lat,
      lng,
      distanceInKms,
      customer,
      includes_taxes,
      budget_markup,
      silos,
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

    const total = getSiloBudgetTotal(
      preferences,
      includes_taxes,
      freight_price,
      silos,
    );

    const dataToSubmit = {
      silos,
      customer,
      includes_freight,
      includes_taxes,
      created_by: authUser?.id ?? "",
      freight_price,
      total: total,
      totals: {
        silos: [],
        freight_price,
        total,
      },
      address: newAddress,
      description: "",
      paymentMethods: "",
      caption: "",
      budget_markup,
      distance:
        includes_freight && distanceCalculation === "distance"
          ? newDistance
          : null,
      estimatedDelivery: "",
    };

    setPdfInfo({
      dataToSubmit,
    });

    if (total) {
      setShowPDF(true);
    }
  };

  const defaultValues: SiloBudgetFormData = useMemo(() => {
    if (initialBudget) {
      return {
        silos: initialBudget.silos,
        includes_taxes: initialBudget.includes_taxes,
        includes_freight: initialBudget.includes_freight,
        customer: initialBudget.customer,
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
      };
    }

    return {
      includes_freight: false,
      distanceCalculation: "distance",
      distanceInKms: 0,
      includes_taxes: true,
      customer: "",
      address: "",
      lng: 0,
      lat: 0,
      budget_markup: 0,
      silos: [
        {
          type: "airbase_silos",
          capacity: "6tn",
          cone_base: "estandar",
          has_fiber_base: false,
        },
      ],
    };
  }, [initialBudget]);

  return { handleSiloBudgetSubmit, defaultValues };
};
