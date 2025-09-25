import {
  calculateDistance,
  calculateFreightPrice,
  getSiloBudgetTotal,
} from "../../helpers/formulas";
import type { SiloBudgetFormData } from "../../pages/budgets/schema";
import type { SiloPDFInfo } from "../../helpers/types";
import {
  useAuthContext,
  usePreferencesContext,
  useCompanyContext,
  usePDFContext,
} from "../context";

export const useSiloBudgetSubmit = () => {
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
      silos
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
    };

    setPdfInfo({
      customer,
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
  };

  return { handleSiloBudgetSubmit };
};
