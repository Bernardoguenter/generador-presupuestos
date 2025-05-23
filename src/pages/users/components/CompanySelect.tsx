import { useEffect, useState } from "react";
import type { Company } from "../../../helpers/types";
import { SelectInput } from "../../../components";
import { getAllCompanies } from "../../../common/lib";

export const CompanySelect = () => {
  const [companies, setCompanies] = useState<Company[] | null>(null);

  useEffect(() => {
    const getCompanies = async () => {
      const { data, error } = await getAllCompanies();
      if (!error) {
        setCompanies(data);
      }
    };
    getCompanies();
  }, []);
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
            {company.nombre}
          </option>
        ))}
    </SelectInput>
  );
};
