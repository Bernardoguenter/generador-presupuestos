import { Fieldset } from "@/components";
import { MaterialsSelect } from "./MaterialsSelect";
import { MembraneCheckbox } from "./MembraneCheckbox";
import { RoofSheetSelect } from "./RoofSheetSelect";
import { SidesSheetSelect } from "./SidesSheetSelect";
import { StructureSelect } from "./StructureSelect";

export const MaterialsAndStructuresFieldset = () => {
  return (
    <>
      <Fieldset title="Material y Estructura">
        <MaterialsSelect />
        <StructureSelect />
        <RoofSheetSelect />
        <SidesSheetSelect />
        <MembraneCheckbox />
      </Fieldset>
    </>
  );
};
