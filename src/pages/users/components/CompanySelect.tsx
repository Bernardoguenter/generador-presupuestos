import { useEffect, useState } from "react";
import type { Company } from "../../../helpers/types";
import { supabase } from "../../../utils/supabase";
import { SelectInput } from "../../../components/SelectInput";

export const CompanySelect = () => {
  const [companies, setCompanies] = useState<Company[] | null>(null);

  useEffect(() => {
    const getCompanies = async () => {
      const { data, error } = await supabase.from("companies").select("*");
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
