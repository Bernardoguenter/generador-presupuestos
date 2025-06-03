import { SelectInput } from "../../../../components";

export const MaterialsSelect = () => {
  return (
    <SelectInput
      name="material"
      label="Material">
      <option value="Hierro torsionado">Hierro Torsionado</option>
      <option value="Perfil u Ángulo">Perfil u Ángulo</option>
      <option value="Alma llena">Alma Llena</option>
    </SelectInput>
  );
};
