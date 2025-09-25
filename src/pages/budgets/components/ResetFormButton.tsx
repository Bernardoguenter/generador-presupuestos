import { useFormContext } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { Button } from "../../../components";

interface Props<T extends FieldValues> {
  setShowPDF?: (value: React.SetStateAction<boolean>) => void;
  defaultValues: T;
}

export const ResetFormButton = <T extends FieldValues>({
  setShowPDF,
  defaultValues,
}: Props<T>) => {
  const { reset } = useFormContext();

  const handleResetForm = () => {
    reset(defaultValues);
    if (setShowPDF) setShowPDF(false);
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
