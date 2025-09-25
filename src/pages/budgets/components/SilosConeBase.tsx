import { RadioInput } from "../../../components";

export const SilosConeBase = ({ index }: { index: number }) => {
  return (
    <RadioInput
      name={`silos.${index}.cone_base`}
      label={`Base Cono ${index + 1}`}
      options={[
        { label: "Estándar", value: "estandar" },
        { label: "45°", value: "45" },
        { label: "55°", value: "55" },
      ]}
    />
  );
};
