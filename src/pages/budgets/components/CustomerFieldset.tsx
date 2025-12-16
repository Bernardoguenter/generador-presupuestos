import { Fieldset, TextInput } from "@/components";

export const CustomerFieldset = () => {
  return (
    <Fieldset title="Cliente">
      <TextInput
        name="customer"
        label="Nombre de cliente"
      />
    </Fieldset>
  );
};
