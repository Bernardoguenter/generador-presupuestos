import { useEffect } from "react";
import { Button } from "@/components";
import { usePDFContext } from "@/common/context";
import { useFormContext, useWatch } from "react-hook-form";
import { BudgetHeader } from "../../budgetDetail/pdf/BudgetHeader";
import { BudgetFooter } from "../../budgetDetail/pdf/BudgetFooter";
import { PDFStructureTable } from "./PDFStructureTable";
import { PDFPaymentMethods } from "./PDFPaymentMethods";
import { PDFDetails } from "./PDFDetails";
import { PDFEstimatedDelivery } from "./PDFEstimatedDelivery";

export const PDFStructureFormContent = () => {
  const { pdfInfo } = usePDFContext();
  const { control, setValue } = useFormContext();
  const description = useWatch({ control, name: "description" });
  const details = useWatch({ control, name: "details" });
  const paymentMethods = useWatch({ control, name: "paymentMethods" });
  const total = useWatch({ control, name: "total" });
  const caption = useWatch({ control, name: "caption" });
  const estimatedDelivery = useWatch({ control, name: "estimatedDelivery" });

  useEffect(() => {
    setValue("total", total);
  }, [total, setValue]);

  useEffect(() => {
    setValue("caption", caption);
  }, [caption, setValue]);

  useEffect(() => {
    setValue("paymentMethods", paymentMethods);
  }, [paymentMethods, setValue]);

  useEffect(() => {
    setValue("description", description);
  }, [description, setValue]);

  useEffect(() => {
    setValue("details", details);
  }, [details, setValue]);

  useEffect(() => {
    setValue("estimatedDelivery", estimatedDelivery);
  }, [estimatedDelivery, setValue]);

  return (
    <div className="mt-16 bg-white  p-4 lg:p-8 w-full text-black">
      <BudgetHeader customer={pdfInfo?.customer ?? ""} />
      <PDFStructureTable />
      <PDFDetails />
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
