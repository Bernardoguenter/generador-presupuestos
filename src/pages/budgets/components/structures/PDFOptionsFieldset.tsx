import { CheckboxInput, Fieldset, SelectInput } from "@/components";
import { useCompanyContext } from "@/common/context";
import { companyHasRenders } from "@/helpers";

/** Opciones del PDF de Remeco: techo a una o dos aguas y hoja de fotos 3D. */
export const PDFOptionsFieldset = () => {
  const { company } = useCompanyContext();
  if (!companyHasRenders(company?.company_name)) return null;

  return (
    <Fieldset title="Techo y PDF">
      <SelectInput
        name="roof_slopes"
        label="Techo">
        <option value={2}>Dos aguas</option>
        <option value={1}>Un agua</option>
      </SelectInput>
      <CheckboxInput
        label="Agregar fotos 3D y medidas al PDF"
        name="include_renders"
      />
    </Fieldset>
  );
};
