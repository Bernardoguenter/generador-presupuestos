import { FreightInput } from "../FreightInput";
import { ColorSheetsFieldset } from "./ColorSheetsFieldset";
import { CustomerFieldset } from "../CustomerFieldset";
import { GutterInput } from "./GutterInput";
import { IncludesGatesFielset } from "./IncludesGatesFieldset";
import { MarginAndTaxesFieldset } from "../MarginAndTaxesFieldset";
import { MaterialsAndStructuresFieldset } from "./MaterialsAndStructuresFieldset";
import { MeasuresFieldset } from "./MeasuresFieldset";
import { EnclousureInputs } from "./EnclousureInputs";

export const StructureBudgetFormContent = () => {
  return (
    <>
      <CustomerFieldset />
      <MaterialsAndStructuresFieldset />
      <MeasuresFieldset />
      <EnclousureInputs />
      <FreightInput />
      <GutterInput />
      <ColorSheetsFieldset />
      <IncludesGatesFielset />
      <MarginAndTaxesFieldset />
    </>
  );
};
