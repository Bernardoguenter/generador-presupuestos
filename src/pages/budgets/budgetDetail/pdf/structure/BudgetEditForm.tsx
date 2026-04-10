import { useEffect } from "react";
import { Button, Form } from "@/components";
import { ResetFormButton } from "@/pages/budgets/components/ResetFormButton";
import {
  calculateStructureBudgetSchema,
  type StructureBudgetFormData,
} from "@/pages/budgets/schema";
import type { StructureBudget } from "@/types";
import { usePDFContext } from "@/common/context";
import { useStructureBudgetSubmit } from "@/pages/budgets/hooks";
import { StructureBudgetFormContent } from "@/pages/budgets/components/structures/StructureBudgetFormContent";
import { PDFStructureComponent } from "@/pages/budgets/components/pdf/PDFStructureComponent";

interface Props {
  budget: StructureBudget;
  getBudget: (id: string, type: "silo" | "structure") => void;
  handleView: () => void;
  viewDetail: boolean;
}

export const BudgetEditForm = ({
  budget,
  getBudget,
  handleView,
  viewDetail,
}: Props) => {
  const { setPdfInfo, setShowPDF } = usePDFContext();
  const { handleStructureBudgetSubmit, defaultValues } =
    useStructureBudgetSubmit(budget);

  useEffect(() => {
    setPdfInfo({
      dataToSubmit: budget,
    });
  }, [budget, setPdfInfo]);



  return (
    <div className="flex lg:flex-row flex-col w-full gap-8 ">
      <Form
        onSubmit={handleStructureBudgetSubmit}
        schema={calculateStructureBudgetSchema}
        defaultValues={defaultValues}
        className="mt-4 w-full lg:w-1/2">
        <StructureBudgetFormContent />
        <Button
          type="submit"
          color="info"
          styles="mt-4">
          Crear Vista Previa
        </Button>
        <ResetFormButton<StructureBudgetFormData>
          setShowPDF={setShowPDF}
          defaultValues={defaultValues}
        />
      </Form>
      {viewDetail && (
        <PDFStructureComponent
          getBudget={getBudget}
          handleView={handleView}
        />
      )}
    </div>
  );
};
