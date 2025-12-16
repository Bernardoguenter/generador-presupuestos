import { useEffect } from "react";
import { Button } from "@/components";
import { usePDFContext } from "@/common/context";
import { useFormContext, useWatch } from "react-hook-form";
import { BudgetHeader } from "../../budgetDetail/pdf/BudgetHeader";
import { BudgetFooter } from "../../budgetDetail/pdf/BudgetFooter";
import { PDFPaymentMethods } from "./PDFPaymentMethods";
import { PDFSiloTable } from "./PDFSiloTable";
import { PDFEstimatedDelivery } from "./PDFEstimatedDelivery";

export const PDFSiloFormContent = () => {
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

  return (
    <div className="mt-16 bg-white  p-4 lg:p-8 w-full text-black">
      <BudgetHeader customer={pdfInfo?.customer ?? ""} />
      <PDFSiloTable />
      <PDFPaymentMethods />
      <PDFEstimatedDelivery />
      <BudgetFooter />
      <Button
        type="submit"
        color="info">
        Confirmar Presupuesto
      </Button>
    </div>
  );
};
