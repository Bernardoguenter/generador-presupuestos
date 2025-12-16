import { ColorRoofSheetInput } from "./ColorRoofSheetInput";
import { ColorSideSheetInput } from "./ColorSideSheetInput";
import { Fieldset } from "@/components";

export const ColorSheetsFieldset = () => {
  return (
    <>
      <Fieldset title="Chapa Color">
        <ColorRoofSheetInput />
        <ColorSideSheetInput />
      </Fieldset>
    </>
  );
};
