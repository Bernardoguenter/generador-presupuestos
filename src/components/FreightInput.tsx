import { useFormContext, useWatch } from "react-hook-form";
import { CheckboxInput } from "./CheckboxInput";
import { GooglePlacesInput } from "./GooglePlacesInput";
import { HiddenInput } from "./HiddenInput";
import { useEffect } from "react";
import { RadioInput } from "./RadioInput";
import { NumberInput } from "./NumberInput";
import { Fieldset } from "./Fieldset";

export const FreightInput = () => {
  const { control, setValue } = useFormContext();
  const includes_freight = useWatch({ control, name: "includes_freight" });
  const distanceCalculation = useWatch({
    control,
    name: "distanceCalculation",
  });

  useEffect(() => {
    if (!includes_freight) {
      setValue("lat", 0);
      setValue("lng", 0);
      setValue("address", "");
      setValue("distance", null);
    }
  }, [includes_freight, setValue]);

  return (
    <Fieldset title="Flete">
      <CheckboxInput
        name="includes_freight"
        label="Incluye flete?"
      />
      {includes_freight && (
        <>
          <RadioInput
            name="distanceCalculation"
            label="Cómo querés calcular el flete?"
            options={[
              { label: "Distancia", value: "distance" },
              { label: "Dirección", value: "address" },
            ]}
          />
          {distanceCalculation === "address" ? (
            <>
              <GooglePlacesInput
                name="address"
                label="Dirección"
              />
              <HiddenInput name="lng" />
              <HiddenInput name="lat" />
            </>
          ) : (
            <NumberInput
              name="distanceInKms"
              label="Distancia en Kms"
            />
          )}
        </>
      )}
    </Fieldset>
  );
};
