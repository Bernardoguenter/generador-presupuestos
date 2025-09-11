import { useFormContext, useWatch } from "react-hook-form";
import { CheckboxInput } from "./CheckboxInput";
import { GooglePlacesInput } from "./GooglePlacesInput";
import { HiddenInput } from "./HiddenInput";
import { useEffect } from "react";

export const FreightInput = () => {
  const { control, setValue } = useFormContext();
  const includes_freight = useWatch({ control, name: "includes_freight" });

  useEffect(() => {
    if (!includes_freight) {
      setValue("lat", 0);
      setValue("lng", 0);
      setValue("address", "");
    }
  }, [includes_freight, setValue]);

  return (
    <>
      <CheckboxInput
        name="includes_freight"
        label="Incluye flete?"
      />
      {includes_freight && (
        <>
          {" "}
          <GooglePlacesInput
            name="address"
            label="Dirección"
          />
          <HiddenInput name="lng" />
          <HiddenInput name="lat" />
        </>
      )}
    </>
  );
};
