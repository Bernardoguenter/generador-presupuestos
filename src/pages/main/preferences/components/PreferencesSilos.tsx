import { usePreferencesContext } from "../../../../common/context";
import { Fieldset, NumberInput } from "../../../../components";

export const PreferencesSilos = () => {
  const { preferences } = usePreferencesContext();
  const { airbase_silos, feeder_silos } = preferences;

  return (
    <>
      <Fieldset title="Silos Base Aérea">
        {Object.entries(airbase_silos).map(([key]) => (
          <>
            {" "}
            <NumberInput
              key={`airbase_silos.${key}`}
              name={`airbase_silos.${key}`}
              label={`${key}`}
            />
          </>
        ))}
      </Fieldset>
      <Fieldset title="Extra base cono para Silos base aérea">
        <NumberInput
          name={"cone_base_45"}
          label={"Extra cono base 45"}
        />
        <NumberInput
          name={"cone_base_55"}
          label={"Extra cono base 55"}
        />
      </Fieldset>
      <Fieldset title="Silos comederos">
        {Object.entries(feeder_silos).map(([key]) => (
          <>
            {" "}
            <NumberInput
              key={`feeder_silos.${key}`}
              name={`feeder_silos.${key}`}
              label={key}
            />
          </>
        ))}
      </Fieldset>
    </>
  );
};
