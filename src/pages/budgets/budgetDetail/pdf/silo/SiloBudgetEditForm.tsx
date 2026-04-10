import { useEffect } from "react";
import { Button, Form } from "@/components";
import {
  calculateSiloBudgetSchema,
  type SiloBudgetFormData,
} from "@/pages/budgets/schema";
import type { SiloBudget } from "@/types";
import { usePDFContext } from "@/common/context";
import { useSiloBudgetSubmit } from "@/pages/budgets/hooks";
import { SiloBudgetFormContent } from "@/pages/budgets/components/silos/SiloBudgetFormContent";
import { ResetFormButton } from "@/pages/budgets/components/ResetFormButton";
import { PDFSiloComponent } from "@/pages/budgets/components/pdf/PDFSiloComponent";

interface Props {
  budget: SiloBudget;
  getBudget: (id: string, type: "silo" | "structure") => void;
  handleView: () => void;
  viewDetail: boolean;
}

export const SiloBudgetEditForm = ({
  budget,
  getBudget,
  handleView,
  viewDetail,
}: Props) => {
  const { setPdfInfo, setShowPDF } = usePDFContext();
  const { handleSiloBudgetSubmit, defaultValues } = useSiloBudgetSubmit(budget);

  useEffect(() => {
    setPdfInfo({
      dataToSubmit: budget,
    });
  }, [budget, setPdfInfo]);



  return (
    <div className="flex lg:flex-row flex-col w-full gap-8 ">
      <Form
        onSubmit={handleSiloBudgetSubmit}
        schema={calculateSiloBudgetSchema}
        defaultValues={defaultValues}
        className="mt-4 w-full lg:w-1/2">
        <SiloBudgetFormContent />
        <Button
          type="submit"
          color="info"
          styles="mt-4">
          Crear Vista Previa
        </Button>
        <ResetFormButton<SiloBudgetFormData>
          setShowPDF={setShowPDF}
          defaultValues={defaultValues}
        />
      </Form>
      {viewDetail && (
        <PDFSiloComponent
          getBudget={getBudget}
          handleView={handleView}
        />
      )}
    </div>
  );
};
