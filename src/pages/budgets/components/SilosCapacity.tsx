import { usePreferencesContext } from "../../../common/context";
import { SelectInput } from "../../../components";

interface Props {
  type?: string;
  index: number;
}

export const SilosCapacity = ({ type, index }: Props) => {
  const { preferences } = usePreferencesContext();
  const { feeder_silos, airbase_silos } = preferences;

  return (
    <>
      {type === "airbase_silos" && (
        <SelectInput
          name={`silos.${index}.capacity`}
          label="Capacidad silos en altura">
          <option value="">Seleccionar...</option>
          {Object.entries(airbase_silos).map(([cap]) => (
            <option
              key={cap}
              value={cap}>
              {cap}
            </option>
          ))}
        </SelectInput>
      )}

      {type === "feeder_silos" && (
        <SelectInput
          name={`silos.${index}.capacity`}
          label="Capacidad silos Comederos">
          <option value="">Seleccionar...</option>
          {Object.entries(feeder_silos).map(([cap]) => (
            <option
              key={cap}
              value={cap}>
              {cap}
            </option>
          ))}
        </SelectInput>
      )}
    </>
  );
};
