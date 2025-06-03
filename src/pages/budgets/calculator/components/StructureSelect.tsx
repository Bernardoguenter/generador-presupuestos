import { SelectInput } from "../../../../components";

export const StructureSelect = () => {
  return (
    <SelectInput
      name="structure_type"
      label="Tipo de estructura">
      <option value="Galpón">Galpón</option>
      <option value="Tinglado">Tinglado</option>
    </SelectInput>
  );
};
