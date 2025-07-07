import { useFormContext } from "react-hook-form";
import { Button } from "../../../../components";
import type { BudgetFormData } from "../../schema";

interface Props {
  setShowPDF: (value: React.SetStateAction<boolean>) => void;
  defaultValues: BudgetFormData;
}

export const ResetFormButton = ({ setShowPDF, defaultValues }: Props) => {
  const { reset } = useFormContext();

  const handleResetForm = () => {
    reset(defaultValues);
    setShowPDF(false);
  };
  return (
    <Button
      type="button"
      color="danger"
      styles="mt-4"
      onClick={handleResetForm}>
      Resetear formulario
    </Button>
  );
};
