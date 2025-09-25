import { SelectInput } from "../../../components";

export const SilosSelecType = ({ index }: { index: number }) => {
  return (
    <SelectInput
      name={`silos.${index}.type`}
      label={`Tipo de Silo ${index + 1}`}>
      <option value="">Seleccionar...</option>
      <option value="airbase_silos">Base Aérea</option>
      <option value="feeder_silos">Comederos</option>
    </SelectInput>
  );
};
