import { SelectInput } from "@/components";
import { useGetAllCompanies } from "@/pages/companies/hooks";

export const CompanySelect = () => {
  const { companies } = useGetAllCompanies();

  return (
    <SelectInput
      name="company_id"
      label="Asignar a empresa">
      <option value={"default"}>Selecciona una opción</option>
      {companies &&
        companies.map((company) => (
          <option
            key={company.id}
            value={company.id}>
            {company.company_name}
          </option>
        ))}
    </SelectInput>
  );
};
