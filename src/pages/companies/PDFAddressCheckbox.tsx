import { useEffect } from "react";
import { CheckboxInput, TextInput } from "../../components";
import { useFormContext, useWatch } from "react-hook-form";

export const PDFAddressCheckbox = () => {
  const { control, setValue } = useFormContext();
  const hasPdfAddress = useWatch({ control, name: "hasPdfAddress" });

  useEffect(() => {
    if (!hasPdfAddress) {
      setValue("pdfAddress", "");
    }
  });

  return (
    <>
      <CheckboxInput
        label="Usar otra dirección para presupuestos"
        name="hasPdfAddress"
      />
      {hasPdfAddress && (
        <TextInput
          name="pdfAddress"
          label="Dirección PDF"
        />
      )}
    </>
  );
};
