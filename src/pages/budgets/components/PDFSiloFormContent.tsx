import { useEffect } from "react";
import { Button } from "../../../components";
import { usePDFContext } from "../../../common/context";
import { useFormContext, useWatch } from "react-hook-form";
import { BudgetHeader } from "../budgetDetail/BudgetHeader";
import { BudgetFooter } from "../budgetDetail/BudgetFooter";
import { PDFPaymentMethods } from "./PDFPaymentMethods";
import { PDFSiloTable } from "./PDFSiloTable";

export const PDFSiloFormContent = () => {
  const { pdfInfo } = usePDFContext();
  const { control, setValue } = useFormContext();
  const paymentMethods = useWatch({ control, name: "paymentMethods" });
  const caption = useWatch({ control, name: "caption" });

  useEffect(() => {
    setValue("caption", caption);
  }, [caption, setValue]);

  useEffect(() => {
    setValue("paymentMethods", paymentMethods);
  }, [paymentMethods, setValue]);

  return (
    <div className="mt-16 bg-white  p-4 lg:p-8 w-full text-black">
      <BudgetHeader customer={pdfInfo?.customer ?? ""} />
      <PDFSiloTable />
      <PDFPaymentMethods />
      <BudgetFooter />
      <Button
        type="submit"
        color="info">
        Confirmar Presupuesto
      </Button>
    </div>
  );
};
