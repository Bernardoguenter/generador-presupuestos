import { paymentMethods } from "@/helpers/staticData";
import { Form } from "@/components";
import {
  ConfirmSiloPDFSchema,
  type ConfirmSiloPDFFormData,
} from "../../schema";
import { usePDFContext, usePreferencesContext } from "@/common/context";
import {
  CreateBudgetToastError,
  CreateBudgetToastSuccess,
  UpdateBudgetToastError,
  UpdateBudgetToastSuccess,
} from "@/utils/alerts";
import { createBudget, updateBudget } from "@/common/lib";
import { useNavigate, useParams } from "react-router";
import { convertPDF } from "@/helpers/generatePDF";
import { useState } from "react";
import { PDFViewComponent } from "../../budgetDetail/pdf/PDFViewComponent";
import type { Silo, SiloBudget, SiloPDFInfo } from "@/helpers/types";
import {
  getDefaultCaption,
  getSilosDescriptions,
  priceInUSD,
} from "@/helpers/formatData";
import { PDFSiloFormContent } from "./PDFSiloFormContent";
import {
  calculateFreightArsPriceWithTaxesAndMarkup,
  getIndividualSiloPrices,
  getSilosPricestArsPriceWithTaxesAndMarkup,
} from "@/helpers/formulas";
import { getSiloPDFImages } from "@/helpers/generatePDF";

interface Props {
  getBudget?: (id: string, type: "silo" | "structure") => void;
  handleView?: () => void;
}

export const PDFSiloComponent = ({ getBudget, handleView }: Props) => {
  const { id } = useParams();
  const { pdfInfo, setPdfInfo, setShowPDF } = usePDFContext();
  const { preferences } = usePreferencesContext();
  const [viewPdf, setViewPdf] = useState<boolean>(false);
  const [budget, setBudget] = useState<SiloBudget | null>(null);
  const navigate = useNavigate();

  if (!pdfInfo) {
    return;
  }

  const { dataToSubmit, includes_freight, freight_price, includes_taxes } =
    pdfInfo as SiloPDFInfo;

  const defaultDescription = getSilosDescriptions(dataToSubmit.silos);

  const defaultCaption = getDefaultCaption(
    includes_freight,
    pdfInfo.includes_taxes,
    preferences.iva_percentage,
    "silo",
  );

  const silosPricesFromPreferences = getIndividualSiloPrices(
    dataToSubmit.silos,
    preferences,
  );

  const silosPricesList = getSilosPricestArsPriceWithTaxesAndMarkup(
    silosPricesFromPreferences,
    preferences.dollar_quote,
    preferences.default_markup,
    dataToSubmit.budget_markup,
    includes_taxes,
    preferences.iva_percentage,
  );

  const newFreightPrice = calculateFreightArsPriceWithTaxesAndMarkup(
    freight_price,
    preferences.dollar_quote,
    preferences.default_markup,
    dataToSubmit.budget_markup,
    includes_taxes,
    preferences.iva_percentage,
  );

  const totalARS = silosPricesList.reduce(
    (sum, acc) => sum + acc,
    newFreightPrice,
  );

  const defaultValues = {
    description: defaultDescription,
    paymentMethods: paymentMethods["Silo"],
    total: totalARS,
    caption: defaultCaption,
    silosPrices: silosPricesList,
    freight_price: newFreightPrice,
    estimatedDelivery: `${preferences.estimated_delivery_silos} días`,
    extra_product_price: 0,
    extra_product: "",
  };

  const waitNextFrame = () =>
    new Promise((resolve) => requestAnimationFrame(resolve));

  const handleDownloadPdf = async (
    customer: string,
    silos: Silo[],
    isNew: boolean,
  ) => {
    setViewPdf(true);
    await waitNextFrame();
    await waitNextFrame();
    const images = await getSiloPDFImages(silos);

    convertPDF(customer, images);

    setTimeout(() => {
      setViewPdf(false);
      setPdfInfo(null);
      setShowPDF(false);
      if (isNew) {
        navigate("/budgets/calculator");
      }
    }, 1000);
  };

  const handleSubmit = async (formData: ConfirmSiloPDFFormData) => {
    if (formData.extra_product !== "" && formData.extra_product) {
      formData.description.push(formData.extra_product);
    }

    const descriptionString = Array.isArray(formData.description)
      ? formData.description.join("; ")
      : formData.description || "";

    const budgetSubmitData = {
      ...dataToSubmit,
      paymentMethods: formData.paymentMethods,
      description: descriptionString,
      estimatedDelivery: formData.estimatedDelivery,
      freight_price:
        formData.freight_price /
        (1 + dataToSubmit.budget_markup / 100) /
        preferences.dollar_quote,
      totals: {
        silos: (formData?.silosPrices ?? []).map((silo) => {
          const totalPrice = priceInUSD(
            silo,
            preferences.dollar_quote,
            preferences.default_markup,
            dataToSubmit.budget_markup,
          );
          return includes_taxes
            ? totalPrice
            : (totalPrice * (100 - preferences.iva_percentage)) / 100;
        }),
        freight_price: priceInUSD(
          formData.freight_price,
          preferences.dollar_quote,
          preferences.default_markup,
          dataToSubmit.budget_markup,
        ),
        extra_product_price: formData.extra_product_price
          ? priceInUSD(
              formData.extra_product_price,
              preferences.dollar_quote,
              preferences.default_markup,
              dataToSubmit.budget_markup,
            )
          : 0,
        total: priceInUSD(
          formData.total,
          preferences.dollar_quote,
          preferences.default_markup,
          dataToSubmit.budget_markup,
        ),
      },
      total: priceInUSD(
        formData.total,
        preferences.dollar_quote,
        preferences.default_markup,
        dataToSubmit.budget_markup,
      ),
      caption: formData.caption,
      created_by:
        typeof dataToSubmit.created_by === "object"
          ? dataToSubmit.created_by.id
          : dataToSubmit.created_by,
    };

    const { data, error } = id
      ? await updateBudget(budgetSubmitData, id, "silo")
      : await createBudget(budgetSubmitData, "silo");

    if (!error && !id) {
      if (data.id) {
        setBudget(data);
        handleDownloadPdf(data.customer, data.silos, true);
        CreateBudgetToastSuccess();
      }
    } else if (!error && id) {
      setViewPdf(true);

      handleDownloadPdf(data.customer, data.silos, false);
      UpdateBudgetToastSuccess();

      if (getBudget) {
        getBudget(id, "silo");
      }
      if (handleView) {
        handleView();
      }
    } else if (error && !id) {
      CreateBudgetToastError();
    } else if (error && id) {
      UpdateBudgetToastError();
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      schema={ConfirmSiloPDFSchema}
      className="w-full lg:w-1/2">
      {viewPdf && budget ? (
        <PDFViewComponent
          budget={budget}
          type="silo"
        />
      ) : (
        <PDFSiloFormContent />
      )}
    </Form>
  );
};
